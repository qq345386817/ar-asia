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
