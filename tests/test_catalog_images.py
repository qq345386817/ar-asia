from html.parser import HTMLParser
import json
import hashlib
from pathlib import Path
import sys
import tempfile
import unittest
from unittest.mock import patch
from urllib.parse import urlparse

ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT))
import generate_model_pages as generator


class Images(HTMLParser):
    def __init__(self):
        super().__init__()
        self.images = []

    def handle_starttag(self, tag, attributes):
        attrs = dict(attributes)
        if tag == "img" and attrs.get("src", "").startswith("/model-images/"):
            self.images.append(attrs)


class CatalogImageTests(unittest.TestCase):
    def test_every_language_loads_all_catalog_thumbnails_without_lazy_deferral(self):
        models = json.loads(generator.MANIFEST_PATH.read_text())["models"]
        expected = {Path(model["filename"]).stem + "_thumb.jpeg" for model in models}
        for locale in generator.LOCALES:
            with self.subTest(locale=locale):
                document = Images()
                document.feed((ROOT / locale / "models/index.html").read_text())
                self.assertEqual(len(document.images), len(models))
                self.assertEqual({Path(urlparse(image["src"]).path).name for image in document.images}, expected)
                for image in document.images:
                    self.assertEqual(image["loading"], "eager")
                    self.assertTrue((ROOT / urlparse(image["src"]).path.lstrip("/")).is_file())
                    self.assertTrue(urlparse(image["src"]).query.startswith("v="))

    def test_runtime_keeps_full_images_for_details_and_printing(self):
        document = (ROOT / "en-US/models/index.html").read_text()
        start = document.index('<script id="experience-data" type="application/json">')
        payload = json.loads(document[document.index(">", start) + 1:document.index("</script>", start)])
        for model in payload["models"]:
            self.assertTrue(model["image"].endswith("_preview.jpeg"))
            self.assertIn("_thumb.jpeg?v=", model["thumbnail"])
            path = ROOT / urlparse(model["thumbnail"]).path.lstrip("/")
            digest = hashlib.sha256(path.read_bytes()).hexdigest()[:12]
            self.assertTrue(model["thumbnailFallback"].endswith(path.stem + "-" + digest + ".jpeg"))

    def test_generation_fails_before_publishing_a_missing_image(self):
        with tempfile.TemporaryDirectory() as directory:
            source = Path(directory) / "source"
            target = Path(directory) / "target"
            source.mkdir()
            with patch.object(generator, "THUMBNAIL_ROOT", source), patch.object(generator, "IMAGE_ROOT", target):
                with self.assertRaisesRegex(ValueError, "Missing model images: specimen_thumb.jpeg, specimen_preview.jpeg"):
                    generator.copy_images([{"filename": "specimen.usdz"}])
                self.assertFalse(target.exists())


if __name__ == "__main__":
    unittest.main()
