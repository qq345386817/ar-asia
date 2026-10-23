#!/usr/bin/env python3
"""Serve generated pages locally with Cloudflare Pages-style clean HTML URLs."""
import argparse
from functools import partial
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]


class SiteHandler(SimpleHTTPRequestHandler):
    def translate_path(self, path):
        target = Path(super().translate_path(path))
        if not target.exists() and not target.suffix and target.with_suffix(".html").is_file():
            return str(target.with_suffix(".html"))
        return str(target)


if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument("--port", type=int, default=8765)
    arguments = parser.parse_args()
    handler = partial(SiteHandler, directory=str(ROOT))
    with ThreadingHTTPServer(("127.0.0.1", arguments.port), handler) as server:
        print(f"Little Nature: http://127.0.0.1:{arguments.port}", flush=True)
        try:
            server.serve_forever()
        except KeyboardInterrupt:
            pass
