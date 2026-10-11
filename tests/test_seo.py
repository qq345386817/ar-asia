import json
from html.parser import HTMLParser
from pathlib import Path
import sys
import unittest
from urllib.parse import urlparse

ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT))
from generate_model_pages import correct_publisher_identity, LOCALES, SITE


class PageParser(HTMLParser):
    def __init__(self):
        super().__init__()
        self.structured = False
        self.schemas = []
        self.text = []

    def handle_starttag(self, tag, attributes):
        if tag == "script":
            self.structured = dict(attributes).get("type") == "application/ld+json"

    def handle_endtag(self, tag):
        if tag == "script":
            self.structured = False

    def handle_data(self, data):
        if self.structured:
            self.schemas.append(json.loads(data))
        else:
            self.text.append(data)


class SEOTests(unittest.TestCase):
    def test_faq_answers_are_visible_in_every_language(self):
        for locale in LOCALES:
            with self.subTest(locale=locale):
                parser = PageParser()
                parser.feed((ROOT / locale / "help.html").read_text())
                faq = next(node for node in parser.schemas[0]["@graph"] if node["@type"] == "FAQPage")
                visible = " ".join(parser.text)
                self.assertEqual(len(faq["mainEntity"]), 6)
                for entry in faq["mainEntity"]:
                    self.assertIn(entry["name"], visible)
                    self.assertIn(entry["acceptedAnswer"]["text"], visible)

    def test_creator_is_not_the_app_publisher(self):
        schema = {"@graph": [{"@type": "Organization", "@id": SITE + "/#organization",
                              "sameAs": ["https://apps.apple.com/app/id6766551832", "https://sketchfab.com/ffishAsia-and-floraZia"]}]}
        document = '<p>Unchanged</p><script type="application/ld+json">' + json.dumps(schema) + '</script>'
        corrected = correct_publisher_identity(document)
        self.assertNotIn("https://sketchfab.com/ffishAsia-and-floraZia", corrected)
        self.assertIn("https://apps.apple.com/app/id6766551832", corrected)
        self.assertIn("<p>Unchanged</p>", corrected)
        self.assertEqual(corrected, correct_publisher_identity(corrected))

    def test_llms_links_resolve_to_existing_public_pages(self):
        import re
        content = (ROOT / "llms.txt").read_text()
        links = re.findall(r"\]\((https://ar-asia\.luopeike\.com/[^)]+)\)", content)
        self.assertGreaterEqual(len(links), 10)
        for link in links:
            path = ROOT / urlparse(link).path.lstrip("/")
            if path.is_dir():
                path /= "index.html"
            elif not path.suffix:
                path = path.with_suffix(".html")
            self.assertTrue(path.is_file(), link)


if __name__ == "__main__":
    unittest.main()
