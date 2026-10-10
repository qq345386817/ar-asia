#!/usr/bin/env python3
"""Build a preparation shortlist without modifying the app catalog."""
from datetime import datetime, timezone
import json
from urllib.parse import urlencode
from prepare_web_assets import MANIFEST, ROOT, request_json

TOPICS = ["animation", "dragonfly", "mantis", "stag beetle", "salamander", "tree frog", "goldfish", "parrotfish", "hermit crab", "toad", "carp"]
OWNER = "ffishAsia-and-floraZia"


def main():
    seen = {model["id"] for model in json.loads(MANIFEST.read_text())["models"]}
    candidates = []
    for topic in TOPICS:
        query = urlencode({"type": "models", "user": OWNER, "q": topic, "count": 12, "downloadable": "true"})
        results = request_json("https://api.sketchfab.com/v3/search?" + query).get("results", [])
        for entry in results:
            if entry["uid"] in seen or entry.get("user", {}).get("username") != OWNER:
                continue
            seen.add(entry["uid"])
            model = request_json("https://api.sketchfab.com/v3/models/" + entry["uid"])
            if model.get("license", {}).get("slug") != "cc0" or not model.get("isDownloadable"):
                continue
            if topic == "animation" and not model.get("animationCount"):
                continue
            if model.get("faceCount", 0) > 750000:
                continue
            candidates.append({
                "id": model["uid"], "source_name": model["name"], "topic": topic,
                "source_url": "https://sketchfab.com/3d-models/" + model["uid"],
                "license": "CC0-1.0", "license_url": "https://creativecommons.org/publicdomain/zero/1.0/",
                "source_description": model.get("description", ""),
                "faces": model.get("faceCount"), "vertices": model.get("vertexCount"),
                "animation_count": model.get("animationCount", 0),
                "status": "candidate_only: needs download, visual review, localized naming, and device testing",
            })
            print("Verified candidate: " + model["name"], flush=True)
            break
        if len(candidates) >= 8:
            break
    (ROOT / "data/model-candidates.json").write_text(json.dumps({
        "verified_at": datetime.now(timezone.utc).date().isoformat(),
        "source": "Sketchfab public API; licenses verified per model, not inferred from titles",
        "models": candidates,
    }, ensure_ascii=False, indent=2) + "\n")
    print("Prepared " + str(len(candidates)) + " candidates; the app manifest is unchanged.")


if __name__ == "__main__":
    main()
