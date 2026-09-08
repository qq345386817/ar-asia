# Little Nature Website

Static website for Little Nature.

## URLs

| Language | Home | Models | Help | Privacy |
| --- | --- | --- | --- | --- |
| English | https://ar-asia.luopeike.com/en-US/ | https://ar-asia.luopeike.com/en-US/models/ | https://ar-asia.luopeike.com/en-US/help | https://ar-asia.luopeike.com/en-US/privacy-policy |
| Deutsch | https://ar-asia.luopeike.com/de-DE/ | https://ar-asia.luopeike.com/de-DE/models/ | https://ar-asia.luopeike.com/de-DE/help | https://ar-asia.luopeike.com/de-DE/privacy-policy |
| 日本語 | https://ar-asia.luopeike.com/ja/ | https://ar-asia.luopeike.com/ja/models/ | https://ar-asia.luopeike.com/ja/help | https://ar-asia.luopeike.com/ja/privacy-policy |
| 한국어 | https://ar-asia.luopeike.com/ko/ | https://ar-asia.luopeike.com/ko/models/ | https://ar-asia.luopeike.com/ko/help | https://ar-asia.luopeike.com/ko/privacy-policy |
| 简体中文 | https://ar-asia.luopeike.com/zh-Hans/ | https://ar-asia.luopeike.com/zh-Hans/models/ | https://ar-asia.luopeike.com/zh-Hans/help | https://ar-asia.luopeike.com/zh-Hans/privacy-policy |
| 繁體中文 | https://ar-asia.luopeike.com/zh-Hant/ | https://ar-asia.luopeike.com/zh-Hant/models/ | https://ar-asia.luopeike.com/zh-Hant/help | https://ar-asia.luopeike.com/zh-Hant/privacy-policy |

Sitemap: https://ar-asia.luopeike.com/sitemap.xml

## Missing Pages and Redirects

Keep `404.html` in the deployment root. Cloudflare Pages uses it to return
HTTP 404 for missing paths instead of serving the root page with HTTP 200.
It must not be included in the sitemap.

`_redirects` maps legacy help and privacy URLs to their English replacements.
Add permanent redirects only when the old URL has a corresponding replacement;
do not redirect every missing path to the home page.

For Search Console 404 reports, inspect the example URLs and last crawl dates.
Check the live response before changing routes, then validate the affected URLs
after deployment.

## Model Pages

Each localized site includes indexable model detail pages under:

```text
/<locale>/models/<model-slug>/
```

Each localized site also includes category landing pages:

```text
/<locale>/models/animals/
/<locale>/models/plants/
/<locale>/models/special/
```

For example:

- https://ar-asia.luopeike.com/en-US/models/sakura-cherry-blossom/
- https://ar-asia.luopeike.com/de-DE/models/japanese-giant-hornet/
- https://ar-asia.luopeike.com/en-US/models/animals/
- https://ar-asia.luopeike.com/zh-Hans/models/plants/

Regenerate model pages and `sitemap.xml` after updating the app manifest:

```sh
python3 generate_model_pages.py
```

The generator adds related-model links to every detail page. The initial SEO
content trial also adds curated English and German species context, with Kew
Plants of the World Online references, to selected model pages. Extend
`CURATED_SPECIES` only with facts checked against a named source.

After deploying substantial page changes, verify that `sitemap.xml` is listed
in Google Search Console. Request indexing only for a small set of materially
updated representative pages; Google recrawls the remaining URLs normally.
