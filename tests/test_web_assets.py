import importlib.util
import json
from pathlib import Path
import struct
import tempfile
import unittest
import zipfile

SCRIPT = Path(__file__).resolve().parents[1] / "scripts/prepare_web_assets.py"
SPEC = importlib.util.spec_from_file_location("web_assets", SCRIPT)
assets = importlib.util.module_from_spec(SPEC)
SPEC.loader.exec_module(assets)


def glb(path, document):
    payload = json.dumps(document).encode()
    payload += b" " * ((-len(payload)) % 4)
    path.write_bytes(struct.pack("<4sIIII", b"glTF", 2, 20 + len(payload), len(payload), 0x4E4F534A) + payload)


class WebAssetTests(unittest.TestCase):
    def test_animated_source_cannot_be_replaced_by_static_glb(self):
        with tempfile.TemporaryDirectory() as directory:
            path = Path(directory) / "scene.glb"
            glb(path, {"asset": {"version": "2.0"}})
            with self.assertRaisesRegex(ValueError, "lost its animation"):
                assets.validate_glb(path, True)

    def test_external_textures_must_be_packed_before_publication(self):
        with tempfile.TemporaryDirectory() as directory:
            path = Path(directory) / "scene.glb"
            glb(path, {"asset": {"version": "2.0"}, "images": [{"uri": "../textures/source.jpeg"}]})
            with self.assertRaisesRegex(ValueError, "external texture"):
                assets.validate_glb(path, False)

    def test_source_archive_cannot_escape_its_destination(self):
        with tempfile.TemporaryDirectory() as directory:
            path = Path(directory) / "model.zip"
            with zipfile.ZipFile(path, "w") as archive:
                archive.writestr("../escape.glb", b"bad")
            with self.assertRaisesRegex(ValueError, "Unsafe archive path"):
                assets.unpack_gltf(path, Path(directory) / "extracted")

    def test_corrupted_download_is_rejected_before_conversion(self):
        with tempfile.TemporaryDirectory() as directory:
            path = Path(directory) / "model.glb"
            path.write_bytes(b"corrupted")
            entry = {"sketchfab_id": "model", "format": "glb_4k", "file": "model.glb", "bytes": 0, "sha256": "bad"}
            with self.assertRaisesRegex(ValueError, "checksum mismatch"):
                assets.prepare_from_local({"id": "model", "filename": "model.usdz"}, {}, Path(directory), [entry])


if __name__ == "__main__":
    unittest.main()
