"""Upload immutable thumbnail fallbacks using the existing local R2 profile."""
from concurrent.futures import ThreadPoolExecutor
import json
import os
from pathlib import Path
import subprocess
import sys

ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT))
from web_experience import asset_digest


def main():
    models = json.loads((ROOT.parent / "FFishAsia/Resources/manifest.json").read_text())["models"]
    paths = [ROOT / "model-images" / (Path(model["filename"]).stem + "_thumb.jpeg") for model in models]
    if not all(path.is_file() for path in paths):
        raise SystemExit("Run generate_model_pages.py first to prepare all thumbnails.")
    environment = {key: value for key, value in os.environ.items() if key.lower() not in {"http_proxy", "https_proxy", "all_proxy"}}
    endpoint = environment.get("R2_ENDPOINT", "https://bab4f0abd1eb8841b9cfc25ef1087c7d.r2.cloudflarestorage.com")
    bucket = environment.get("BUCKET_NAME", "ffishasia-models")
    profile = environment.get("AWS_PROFILE", "r2")

    def upload(path):
        digest = asset_digest("/model-images/" + path.name)
        key = "thumbnails/" + path.stem + "-" + digest + path.suffix
        subprocess.run(["aws", "s3", "cp", str(path), "s3://" + bucket + "/" + key,
                        "--profile", profile, "--endpoint-url", endpoint,
                        "--content-type", "image/jpeg", "--cache-control", "public,max-age=31536000,immutable",
                        "--only-show-errors"], env=environment, check=True)
        return path.name

    with ThreadPoolExecutor(max_workers=4) as pool:
        for index, name in enumerate(pool.map(upload, paths), 1):
            print(f"{index}/{len(paths)} {name}", flush=True)


if __name__ == "__main__":
    main()
