# Little Nature Website

Static, six-language website for online model browsing and printable nature
study cards. The app manifest remains the source of model names, taxonomy,
thumbnails, and source URLs.

## SEO and AI-readable Content

All six languages have canonical URLs, reciprocal language alternates,
and sitemap entries. Catalog, animation collection, and printable flashcard
titles describe the actual tools rather than adding keyword lists.
`data/help-copy.json` generates visible localized questions and matching
FAQ structured data. The model creator is credited separately from the app
publisher. Structured data does not guarantee a rich result or indexing.

`/llms.txt` is an optional curated guide to the existing public pages, their
features, limitations, languages, and sources. It is included in the static
build; it does not replace robots.txt, sitemap.xml, or readable HTML.
Google does not require or specially use llms.txt for its AI search features.
Avoid duplicate Markdown copies of every model page or unsupported claims
about improved ranking or AI citations. See [Google AI guidance](https://developers.google.com/search/docs/fundamentals/ai-optimization-guide)
and the [llms.txt proposal](https://llmstxt.org/).

## Development

~~~sh
npm ci
python3 generate_model_pages.py
npm run build
python3 -m http.server 8765 --bind 127.0.0.1
~~~

Open http://127.0.0.1:8765/en-US/. The home page features curated specimens;
the models directory searches the entire catalog. All languages also have
four collections and a study-cards directory.

Catalog cards eagerly load the app's small, versioned 256px thumbnails, so
scrolling or filtering to later models does not wait for native lazy loading.
Detail pages and printed cards retain the 1024px preview images. Generation
fails if a model's thumbnail or preview is missing instead of publishing
broken references.
Failed or stalled thumbnail requests switch to an immutable R2 copy after a
12-second timeout, with at most two retries. The normal source remains Pages;
the fallback uses the same file bytes. After changing thumbnails, upload the
fallbacks before pushing generated pages:

~~~sh
python3 scripts/upload_catalog_images.py
~~~

This uses the existing local `r2` AWS profile. No credentials enter the site.

Study cards support A4 and Letter, picture/name cards, and separate
picture/name matching sets. Selection stays in this browser and follows
language changes. Browser print can save the cards as PDF.

~~~sh
npm test
npm run test:e2e
~~~

End-to-end tests use existing Chrome and the local server, without
downloading browsers or sending production events. QA output stays in
the system temporary directory.

## Web Assets

For manual downloads without an API token, see [MODEL_DOWNLOADS.md](MODEL_DOWNLOADS.md).
It lists two existing animated models and eight new candidates, with formats
and a suggested download directory. Downloading in the Sketchfab browser UI
does not require configuring an API token for this project.

Sketchfab offers GLB/glTF downloads through its official authenticated
endpoint. Configure a local .env.assets.local using .env.assets.example.
This local file is ignored by Git and excluded from the public build.
Use SKETCHFAB_API_TOKEN or an OAuth SKETCHFAB_ACCESS_TOKEN.
WEB_ASSET_BASE_URL is the public HTTPS R2 custom domain.

~~~sh
python3 scripts/prepare_web_assets.py
python3 scripts/prepare_web_assets.py --download --upload
python3 generate_model_pages.py
npm run build
~~~

The preparation script verifies licenses per model, downloads the
featured GLB/glTF resources, packs glTF into self-contained GLB when
needed, checks animation preservation, and uploads hashed filenames.
Archives stay in the ignored .cache directory. Public URLs and license
records go to data/web-assets.json; credentials and temporary signed
download URLs never enter generated pages.

Existing USDZ files can prepare the static featured models without new
Sketchfab credentials. Use an installed Blender executable:

~~~sh
export WEB_ASSET_BASE_URL=https://pub-0154a542ca38442c855387e2736c8f19.r2.dev
python3 scripts/prepare_web_assets.py --from-usdz --blender /Applications/Blender.app/Contents/MacOS/Blender --upload
node scripts/optimize_web_assets.mjs --upload
python3 generate_model_pages.py
npm run build
~~~

The optimization uses Meshopt with a 200k-triangle target and 1% error
bound, 1024px textures, and Draco compression. Browser decoder files are
self-hosted. The original app USDZ files are not modified. The current
ten static previews are about 1.8–2.7 MiB each.

Animated USDZ import did not preserve the source animation tracks in
Blender. The original Sketchfab downloads now provide self-hosted crab,
snake, and catfish animations. Animated geometry is not simplified, and
the optimized GLB is decoded again to verify its animation count.
Never mark a static conversion as an animated preview.

To import browser downloads without an API token:

~~~sh
python3 scripts/prepare_web_assets.py --local-downloads ../usdz_resources/04
export WEB_ASSET_BASE_URL=https://pub-0154a542ca38442c855387e2736c8f19.r2.dev
node scripts/optimize_web_assets.mjs --upload
python3 generate_model_pages.py
npm run build
~~~

The importer verifies source licenses and checks downloads.json SHA-256
values before unpacking. GLB archives with external textures are repacked
into self-contained files. Original archives and app USDZ files are retained.

Without a prepared GLB, the official Sketchfab viewer loads only when the
user opens a 3D preview. Source links and localized retry states remain
available. Prepared GLB is preferred automatically, while existing USDZ
resources serve iOS Quick Look.

data/experience.json defines featured specimens and themes, not a second
model catalog. data/model-candidates.json records the sourcing shortlist
and its import status; runtime pages still use only the canonical app manifest.

The new specimens have names and taxonomy in all six languages. The
Carassius specimen keeps a broad carp label because the source does not
identify its exact variety. The East Japan Tree Frog follows the source
Dryophytes leopardus identification and the American Museum of Natural
History species account, rather than reusing the older Japanese tree frog name.

New app thumbnail and preview URLs use content-hashed R2 filenames. App
code prefers bundled images and supports online images for later catalog
updates. Existing installed versions without that fallback require an
app update to display thumbnails for models not bundled in those versions.

## Publishing

GitHub pushes to main trigger Cloudflare Pages automatically. The existing
dashboard build command is empty, so Pages skips both dependency installation
and building. wrangler.toml explicitly selects the repository root, where
the generated HTML and browser assets are already committed. No parent app
repository or Sketchfab token is needed for publishing. Ignored caches,
local credentials, node_modules, and model archives never enter the repository.

For a future build-based deployment, use npm run build and output directory
public in the Pages dashboard, and update pages_build_output_dir in
wrangler.toml to ./public at the same time. The local build copies only public pages, images, styles, browser
assets, sitemap, and routing files. Credentials, archives, preparation
records, node_modules, and tests are excluded. The build checks the
25 MiB per-file and 20,000-file Pages limits.

The current Cloudflare token permits model-bucket CORS and analytics
deployment, but does not permit DNS inspection or Pages build-setting
changes. Until the owner configures a production R2 custom domain, the
previews use the existing public R2 URL above. The repository configuration
supports the existing GitHub automatic publishing without dashboard changes.
The preparation tool reports these permission limitations explicitly;
it does not change token scopes.

The backend is in the parent app repository under
cloudflare/littlenature-analytics. Apply its web-events migration and
deploy the Worker before publishing the site. See WEB_ANALYTICS.md there.
Localhost, browser tests, Global Privacy Control, and Do Not Track do not
send analytics. Search text is not collected.

Set APP_STORE_PROVIDER_TOKEN in the environment before generating pages
to enable download attribution with the provider token from an ASC
campaign link. Website App Store clicks remain distinct from downloads.

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
