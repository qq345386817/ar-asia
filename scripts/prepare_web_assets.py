#!/usr/bin/env python3
"""Verify source licenses and optionally download GLB/glTF through Sketchfab's API."""
import argparse
from concurrent.futures import ThreadPoolExecutor
from datetime import datetime, timezone
import hashlib
import json
import os
from pathlib import Path
import struct
import subprocess
import tempfile
import urllib.error
import urllib.request
import zipfile

ROOT = Path(__file__).resolve().parents[1]
MANIFEST = ROOT.parent / "FFishAsia/Resources/manifest.json"
ASSETS = ROOT / "data/web-assets.json"
CACHE = ROOT / ".cache/web-assets"
MAX_ARCHIVE_BYTES = 250 * 1024 * 1024
OPENER = urllib.request.build_opener(urllib.request.ProxyHandler({}))


def local_settings():
    settings = dict(os.environ)
    path = ROOT / ".env.assets.local"
    if path.exists():
        for line in path.read_text().splitlines():
            if not line.strip() or line.lstrip().startswith("#") or "=" not in line:
                continue
            key, value = line.split("=", 1)
            settings.setdefault(key.strip(), value.strip().strip("\"'"))
    return settings


def request_json(url, authorization=None):
    headers = {"User-Agent": "LittleNatureAssetPreparation/1.0", "Accept": "application/json"}
    if authorization:
        headers["Authorization"] = authorization
    with OPENER.open(urllib.request.Request(url, headers=headers), timeout=45) as response:
        return json.load(response)


def verify(model):
    info = request_json("https://api.sketchfab.com/v3/models/" + model["id"])
    license_info = info.get("license") or {}
    if license_info.get("slug") != "cc0":
        raise ValueError(model["filename"] + ": source is not verified CC0")
    return model["id"], {
        "source_url": model["sketchfab_url"],
        "license": "CC0-1.0",
        "license_url": "https://creativecommons.org/publicdomain/zero/1.0/",
        "creator": info.get("user", {}).get("displayName", ""),
        "creator_url": info.get("user", {}).get("profileUrl", ""),
        "downloadable": bool(info.get("isDownloadable")),
        "source_animation_count": info.get("animationCount", 0),
        "verified_at": datetime.now(timezone.utc).date().isoformat(),
    }


def download_archive(url, target):
    request = urllib.request.Request(url, headers={"User-Agent": "LittleNatureAssetPreparation/1.0"})
    size = 0
    with OPENER.open(request, timeout=120) as response, target.open("wb") as output:
        while chunk := response.read(1024 * 1024):
            size += len(chunk)
            if size > MAX_ARCHIVE_BYTES:
                raise ValueError("Source archive exceeds the preparation size limit")
            output.write(chunk)


def validate_glb(path, expects_animation):
    with path.open("rb") as stream:
        magic, version, length = struct.unpack("<4sII", stream.read(12))
        if magic != b"glTF" or version != 2 or length != path.stat().st_size:
            raise ValueError("Invalid GLB header")
        chunk_length, chunk_type = struct.unpack("<II", stream.read(8))
        if chunk_type != 0x4E4F534A:
            raise ValueError("GLB has no JSON chunk")
        document = json.loads(stream.read(chunk_length))
    if expects_animation and not document.get("animations"):
        raise ValueError("Downloaded model lost its animation")
    if any(buffer.get("uri") for buffer in document.get("buffers", [])):
        raise ValueError("GLB contains external buffer references")
    if any(image.get("uri") and not image["uri"].startswith("data:") for image in document.get("images", [])):
        raise ValueError("GLB contains external texture references")
    return len(document.get("animations", []))


def unpack_gltf(archive, destination):
    with zipfile.ZipFile(archive) as source:
        if sum(item.file_size for item in source.infolist()) > MAX_ARCHIVE_BYTES:
            raise ValueError("Expanded model exceeds the preparation size limit")
        for item in source.infolist():
            resolved = (destination / item.filename).resolve()
            if not resolved.is_relative_to(destination.resolve()):
                raise ValueError("Unsafe archive path")
        source.extractall(destination)
    candidates = sorted(destination.rglob("*.glb")) or sorted(destination.rglob("*.gltf"))
    if not candidates:
        raise ValueError("Archive has no GLB/glTF model")
    return next((item for item in candidates if item.stem == "scene"), candidates[0])


def prepared_record(model, output, record, prepared_from):
    animation_count = validate_glb(output, bool(model.get("has_animation")))
    digest = hashlib.sha256(output.read_bytes()).hexdigest()
    object_key = "web-models/" + Path(model["filename"]).stem + "-" + digest[:12] + ".glb"
    return output, object_key, {
        **record, "glb_bytes": output.stat().st_size, "glb_sha256": digest,
        "glb_animation_count": animation_count, "object_key": object_key,
        "prepared_from": prepared_from,
    }


def prepare_model(model, settings, record):
    oauth = settings.get("SKETCHFAB_ACCESS_TOKEN", "").strip()
    token = settings.get("SKETCHFAB_API_TOKEN", "").strip()
    if not oauth and not token:
        raise ValueError("Configure SKETCHFAB_API_TOKEN or SKETCHFAB_ACCESS_TOKEN in .env.assets.local")
    authorization = "Bearer " + oauth if oauth else "Token " + token
    response = request_json("https://api.sketchfab.com/v3/models/" + model["id"] + "/download", authorization)
    downloadable = response.get("glb") or response.get("gltf")
    if not downloadable or not downloadable.get("url"):
        raise ValueError("No downloadable GLB/glTF format")
    stem = Path(model["filename"]).stem
    CACHE.mkdir(parents=True, exist_ok=True)
    output = CACHE / (stem + ".glb")
    with tempfile.TemporaryDirectory(prefix="little-nature-source-") as temporary:
        directory = Path(temporary)
        archive = directory / "model.download"
        download_archive(downloadable["url"], archive)
        if zipfile.is_zipfile(archive):
            source = unpack_gltf(archive, directory / "extracted")
            if source.suffix == ".gltf":
                subprocess.run(["node", str(ROOT / "scripts/pack_gltf.mjs"), str(source), str(output)], check=True)
            else:
                output.write_bytes(source.read_bytes())
        else:
            output.write_bytes(archive.read_bytes())
    return prepared_record(model, output, record, "Sketchfab GLB/glTF download")


def prepare_from_usdz(model, record, blender):
    sources = sorted((ROOT.parent / "usdz_resources").rglob(model["filename"]))
    if not sources:
        raise ValueError("No local original USDZ: " + model["filename"])
    CACHE.mkdir(parents=True, exist_ok=True)
    output = CACHE / (Path(model["filename"]).stem + ".glb")
    subprocess.run([blender, "--background", "--factory-startup", "--python-exit-code", "1",
                    "--python", str(ROOT / "scripts/convert_usdz_blender.py"), "--",
                    str(sources[0]), str(output), "animated" if model.get("has_animation") else "static"], check=True)
    return prepared_record(model, output, record, "Existing source USDZ; Blender conversion")


def prepare_from_local(model, record, directory, entries):
    entry = next((item for item in entries if item["sketchfab_id"] == model["id"]
                  and item["format"] != "usdz"), None)
    if not entry:
        raise ValueError("No local GLB/glTF download for " + model["filename"])
    source = (directory / entry["file"]).resolve()
    if not source.is_relative_to(directory.resolve()):
        raise ValueError("Unsafe local download path")
    data = source.read_bytes()
    if len(data) != entry["bytes"] or hashlib.sha256(data).hexdigest() != entry["sha256"]:
        raise ValueError("Local download checksum mismatch: " + model["filename"])
    CACHE.mkdir(parents=True, exist_ok=True)
    output = CACHE / (Path(model["filename"]).stem + ".glb")
    with tempfile.TemporaryDirectory(prefix="little-nature-local-") as temporary:
        if zipfile.is_zipfile(source):
            source = unpack_gltf(source, Path(temporary) / "extracted")
        # Original GLB uploads may reference textures shipped beside the GLB.
        subprocess.run(["node", str(ROOT / "scripts/pack_gltf.mjs"), str(source), str(output)], check=True)
    return prepared_record(model, output, record, "Local original Sketchfab GLB/glTF download")


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--download", action="store_true", help="Download the featured source models; requires local authentication")
    parser.add_argument("--from-usdz", action="store_true", help="Prepare static featured models from already downloaded USDZ")
    parser.add_argument("--local-downloads", type=Path, help="Import verified downloads.json and local browser downloads without an API token")
    parser.add_argument("--blender", default=os.environ.get("BLENDER_BIN", "blender"), help="Blender command path")
    parser.add_argument("--only", help="Prepare one featured filename stem")
    parser.add_argument("--upload", action="store_true", help="Upload downloaded GLB files using the existing R2 AWS profile")
    args = parser.parse_args()
    if sum(bool(value) for value in (args.download, args.from_usdz, args.local_downloads)) > 1:
        parser.error("Choose only one source: --download, --from-usdz, or --local-downloads")
    if args.upload and not (args.download or args.from_usdz or args.local_downloads):
        parser.error("--upload requires a model source")
    settings = local_settings()
    manifest = json.loads(MANIFEST.read_text())
    models = manifest["models"]
    assets = json.loads(ASSETS.read_text())
    with ThreadPoolExecutor(max_workers=3) as executor:
        verified = dict(executor.map(verify, models))
    for model_id, record in verified.items():
        assets["models"][model_id] = {**assets["models"].get(model_id, {}), **record}
    print("Verified CC0 licenses for " + str(len(verified)) + " models.")
    if args.download or args.from_usdz or args.local_downloads:
        base_url = settings.get("WEB_ASSET_BASE_URL", "").rstrip("/")
        if args.upload and not base_url.startswith("https://"):
            raise ValueError("Set WEB_ASSET_BASE_URL to the public HTTPS R2 domain before uploading")
        featured = set(json.loads((ROOT / "data/experience.json").read_text())["featured"])
        entries = json.loads((args.local_downloads / "downloads.json").read_text())["files"] if args.local_downloads else []
        local_ids = {item["sketchfab_id"] for item in entries if item["format"] != "usdz"}
        for model in models:
            if args.local_downloads and model["id"] not in local_ids:
                continue
            if not args.local_downloads and Path(model["filename"]).stem not in featured:
                continue
            if args.only and Path(model["filename"]).stem != args.only:
                continue
            if args.from_usdz and model.get("has_animation"):
                print("Keep source viewer for " + model["filename"] + ": original GLB/glTF is required to preserve animation.")
                continue
            record = assets["models"][model["id"]]
            if args.local_downloads:
                output, key, record = prepare_from_local(model, record, args.local_downloads, entries)
            elif args.from_usdz:
                output, key, record = prepare_from_usdz(model, record, args.blender)
            else:
                output, key, record = prepare_model(model, settings, record)
            if args.upload:
                endpoint = settings.get("R2_ENDPOINT", "https://bab4f0abd1eb8841b9cfc25ef1087c7d.r2.cloudflarestorage.com")
                bucket = settings.get("BUCKET_NAME", "ffishasia-models")
                profile = settings.get("AWS_PROFILE", "r2")
                env = {k: v for k, v in os.environ.items() if k.lower() not in {"http_proxy", "https_proxy", "all_proxy"}}
                subprocess.run(["aws", "s3", "cp", str(output), "s3://" + bucket + "/" + key,
                                "--profile", profile, "--endpoint-url", endpoint, "--no-progress",
                                "--content-type", "model/gltf-binary", "--cache-control", "public,max-age=31536000,immutable"],
                               check=True, env=env)
                record["glb_url"] = base_url + "/" + key
            assets["models"][model["id"]] = record
            ASSETS.write_text(json.dumps(assets, ensure_ascii=False, indent=2) + "\n")
            print(model["filename"] + ": GLB " + str(round(output.stat().st_size / 1048576, 1)) + " MB")
    ASSETS.write_text(json.dumps(assets, ensure_ascii=False, indent=2) + "\n")


if __name__ == "__main__":
    try:
        main()
    except (ValueError, urllib.error.URLError, subprocess.CalledProcessError) as error:
        # Signed download links and authentication headers are never saved or printed.
        if isinstance(error, urllib.error.HTTPError):
            raise SystemExit("Sketchfab/R2 request failed with HTTP " + str(error.code))
        raise SystemExit(str(error))
