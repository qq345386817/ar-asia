import json
from html.parser import HTMLParser
from pathlib import Path
import sys
import unittest
from unittest.mock import patch
from tempfile import TemporaryDirectory
from types import SimpleNamespace
from urllib.parse import urlparse
import xml.etree.ElementTree as ET

ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT))
from generate_model_pages import correct_publisher_identity, LOCALES, SITE
import generate_model_pages


class PageParser(HTMLParser):
    def __init__(self):
        super().__init__()
        self.structured = False
        self.schemas = []
        self.text = []
        self.links = []
        self.h1_count = 0

    def handle_starttag(self, tag, attributes):
        if tag == "link":
            self.links.append(dict(attributes))
        if tag == "h1":
            self.h1_count += 1
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
    def test_policy_presentation_is_idempotent(self):
        original = (ROOT / "en-US/privacy-policy.html").read_text()
        copy = json.loads((ROOT / "data/web-copy.json").read_text())
        experience = SimpleNamespace(
            copy=copy,
            header=lambda locale, path: '\n    <header class="site-header">Little Nature</header>',
            footer=lambda locale: '<footer class="experience-footer">Little Nature</footer>'
        )
        with TemporaryDirectory() as temporary:
            target = Path(temporary) / "en-US/privacy-policy.html"
            target.parent.mkdir()
            target.write_text(original)
            def write(path, content, url):
                path.write_text(content)
            with patch.object(generate_model_pages, "ROOT", Path(temporary)), patch.object(generate_model_pages, "write_page", write):
                generate_model_pages.update_website_privacy(experience, "en-US")
                first = target.read_text()
                generate_model_pages.update_website_privacy(experience, "en-US")
                self.assertEqual(target.read_text(), first)

    def test_sitemap_pages_keep_canonicals_headings_and_language_alternates(self):
        namespace = {"s": "http://www.sitemaps.org/schemas/sitemap/0.9"}
        urls = [entry.text for entry in ET.parse(ROOT / "sitemap.xml").findall("s:url/s:loc", namespace)]
        self.assertTrue(urls)
        self.assertEqual(len(urls), len(set(urls)))
        for url in urls:
            with self.subTest(url=url):
                path = ROOT / urlparse(url).path.lstrip("/")
                if path.is_dir():
                    path /= "index.html"
                elif not path.suffix:
                    path = path.with_suffix(".html")
                page = PageParser()
                page.feed(path.read_text())
                self.assertEqual(page.h1_count, 1)
                self.assertEqual([link["href"] for link in page.links if link.get("rel") == "canonical"], [url])
                alternates = {link["hreflang"]: link["href"] for link in page.links if link.get("rel") == "alternate"}
                self.assertEqual(set(alternates), set(LOCALES) | {"x-default"})
                parts = urlparse(url).path.lstrip("/").split("/", 1)
                suffix = parts[1] if len(parts) == 2 else ""
                for locale in LOCALES:
                    self.assertEqual(alternates[locale], f"{SITE}/{locale}/{suffix}")
                self.assertEqual(alternates["x-default"], alternates["en-US"])

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
