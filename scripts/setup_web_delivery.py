#!/usr/bin/env python3
"""Configure the existing public model bucket and Pages output safely."""
import json
import os
import urllib.error
import urllib.request

ACCOUNT = "bab4f0abd1eb8841b9cfc25ef1087c7d"
BUCKET = "ffishasia-models"
DOMAIN = "nature-assets.luopeike.com"
OPENER = urllib.request.build_opener(urllib.request.ProxyHandler({}))


def api(path, method="GET", body=None):
    request = urllib.request.Request(
        "https://api.cloudflare.com/client/v4/" + path,
        method=method, data=json.dumps(body).encode() if body is not None else None,
        headers={"Authorization": "Bearer " + os.environ["CLOUDFLARE_API_TOKEN"], "Content-Type": "application/json"},
    )
    with OPENER.open(request, timeout=40) as response:
        result = json.load(response)
    if not result.get("success"):
        raise RuntimeError("Cloudflare request failed: " + path)
    return result.get("result")


def main():
    zones = api("zones?name=luopeike.com")
    if len(zones) != 1:
        raise RuntimeError("Cannot identify the luopeike.com zone")
    zone = zones[0]["id"]
    prefix = "accounts/" + ACCOUNT + "/r2/buckets/" + BUCKET
    domains = api(prefix + "/domains/custom")["domains"]
    attached = any(item["domain"] == DOMAIN for item in domains)
    if not attached:
        try:
            existing = api("zones/" + zone + "/dns_records?name=" + DOMAIN)
            if existing:
                raise RuntimeError("The selected asset domain already has unrelated DNS records")
            api(prefix + "/domains/custom", "POST", {"domain": DOMAIN, "enabled": True, "zoneId": zone, "minTLS": "1.2"})
            attached = True
        except urllib.error.HTTPError as error:
            if error.code != 403:
                raise
            print("PENDING: DNS access is not authorized. Keep the existing public R2 URL until the owner configures a custom domain.")
    if attached:
        print("Asset domain:", DOMAIN)
    try:
        cors = api(prefix + "/cors")
    except urllib.error.HTTPError as error:
        if error.code != 404:
            raise
        cors = {"rules": []}
    rules = (cors or {}).get("rules", [])
    if not any(rule.get("id") == "little-nature-public-models" for rule in rules):
        rules.append({
            "id": "little-nature-public-models",
            "allowed": {"origins": ["*"], "methods": ["GET", "HEAD"], "headers": ["*"]},
            "exposeHeaders": ["Content-Length", "ETag"], "maxAgeSeconds": 3600,
        })
        api(prefix + "/cors", "PUT", {"rules": rules})
    print("Read-only CORS enabled for already-public model resources.")
    try:
        project = api("accounts/" + ACCOUNT + "/pages/projects/ar-asia")
    except urllib.error.HTTPError as error:
        if error.code != 403:
            raise
        print("PENDING: Pages access is not authorized. Set build command npm run build and output directory public in Pages.")
        return
    config = project["build_config"]
    config.update({"build_command": "npm run build", "destination_dir": "public"})
    try:
        api("accounts/" + ACCOUNT + "/pages/projects/ar-asia", "PATCH", {"build_config": config})
    except urllib.error.HTTPError as error:
        if error.code != 403:
            raise
        print("PENDING: Pages configuration changes are not authorized. Set build command npm run build and output directory public in Pages.")
        return
    print("Pages build configuration: npm run build -> public. No deployment triggered.")


if __name__ == "__main__":
    main()
