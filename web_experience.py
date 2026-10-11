"""Static, localized entry points for browsing and studying the app's model catalog."""
import html
import hashlib
import json
import os
from functools import cache
from pathlib import Path
from urllib.parse import urlencode

ROOT = Path(__file__).resolve().parent
SITE = "https://ar-asia.luopeike.com"
APP_STORE = "https://apps.apple.com/app/id6766551832"


@cache
def asset_url(path):
    digest = hashlib.sha256((ROOT / path.lstrip("/")).read_bytes()).hexdigest()[:12]
    return path + "?v=" + digest


def esc(value):
    return html.escape(str(value or ""), quote=True)


def json_script(value):
    return json.dumps(value, ensure_ascii=False, separators=(",", ":")).replace("<", "\\u003c")


def stem(model):
    return Path(model["filename"]).stem


def slug(model):
    return stem(model).replace("_", "-")


class Experience:
    def __init__(self, models, locales, language_names):
        self.models = models
        self.locales = locales
        self.language_names = language_names
        self.copy = json.loads((ROOT / "data/web-copy.json").read_text())
        self.help_copy = json.loads((ROOT / "data/help-copy.json").read_text())
        self.config = json.loads((ROOT / "data/experience.json").read_text())
        self.assets = json.loads((ROOT / "data/web-assets.json").read_text())["models"]
        expected = set(self.copy["en-US"])
        for locale in locales:
            if set(self.copy[locale]) != expected:
                raise ValueError("Incomplete website translations: " + locale)
        known = {stem(model) for model in models}
        for key in self.config["featured"]:
            if key not in known:
                raise ValueError("Unknown featured model: " + key)
        for theme in self.config["themes"].values():
            if not set(theme["models"]).issubset(known):
                raise ValueError("Unknown theme model")

    def name(self, model, locale):
        return model.get(self.locales[locale]["name_key"]) or model["name_en"]

    def app_url(self, locale, surface):
        provider = os.environ.get("APP_STORE_PROVIDER_TOKEN", "")
        parameters = {"ct": "website_" + locale + "_" + surface, "mt": "8"}
        if provider:
            parameters["pt"] = provider
        return APP_STORE + "?" + urlencode(parameters)

    def model_data(self, model, locale):
        names = [model.get(spec["name_key"], "") for spec in self.locales.values()]
        asset = self.assets.get(model["id"], {})
        return {
            "id": model["id"], "slug": slug(model), "name": self.name(model, locale),
            "names": names, "scientific": model.get("scientific_name", ""),
            "category": model["category"],
            "categoryLabel": self.locales[locale]["category_labels"][model["category"]],
            "animated": bool(model.get("has_animation")),
            "featured": stem(model) in self.config["featured"],
            "themes": [key for key, theme in self.config["themes"].items() if stem(model) in theme["models"]],
            "image": "/model-images/" + stem(model) + "_preview.jpeg",
            "thumbnail": asset_url("/model-images/" + stem(model) + "_thumb.jpeg"),
            "url": "/" + locale + "/models/" + slug(model) + "/",
            "glb": asset.get("glb_url", ""),
            "usdz": model["download_url"],
            "creator": asset.get("creator", "ffish.asia / floraZia.com"),
            "source": model["sketchfab_url"],
        }

    def runtime(self, models, locale, surface, **extra):
        payload = {"locale": locale, "surface": surface, "copy": self.copy[locale],
                   "models": [self.model_data(model, locale) for model in models], **extra}
        return (
            '<script id="experience-data" type="application/json">' + json_script(payload) + "</script>\n"
            '<script defer src="' + asset_url("/assets/vendor/icons.js") + '"></script>\n'
            '<script type="module" src="' + asset_url("/assets/experience.js") + '"></script>'
        )

    def header(self, locale, path=""):
        text, spec = self.copy[locale], self.locales[locale]
        options = "".join(
            '<option value="/' + candidate + "/" + path + '"' + (" selected" if candidate == locale else "") + ">" + esc(label) + "</option>"
            for candidate, label in self.language_names.items()
        )
        return f"""
    <header class="site-header">
      <a class="brand" href="/{locale}/"><img src="/favicon-64.png" alt="" width="36" height="36"><span>Little Nature</span></a>
      <div class="header-actions">
        <nav class="nav-links" aria-label="{esc(spec['models'])}">
          <a href="/{locale}/models/">{esc(spec['models'])}</a>
          <a class="study-link" href="/{locale}/study-cards/"><i data-lucide="book-open"></i>{esc(text['studyCards'])}<span class="selection-badge" data-selection-count hidden>0</span></a>
          <a href="/{locale}/help">{esc(spec['help'])}</a>
        </nav>
        <select class="language-select" aria-label="{esc(spec['language_label'])}" onchange="if(this.value)location.href=this.value">{options}</select>
      </div>
    </header>"""

    def footer(self, locale):
        spec = self.locales[locale]
        return f"""
    <footer class="experience-footer">
      <span>Little Nature · <a href="https://creativecommons.org/publicdomain/zero/1.0/">CC0</a></span>
      <a href="https://sketchfab.com/ffishAsia-and-floraZia">ffish.asia / floraZia.com · Sketchfab</a>
      <a href="/{locale}/privacy-policy">{esc(spec['privacy'])}</a>
    </footer>"""

    def app_band(self, locale, surface):
        text = self.copy[locale]
        return f"""
    <aside class="app-band">
      <img src="/app-icon.png" alt="" width="52" height="52" loading="lazy">
      <div><h2>{esc(text['appTitle'])}</h2><p>{esc(text['appBody'])}</p></div>
      <a class="button app-store-link" data-surface="{esc(surface)}" href="{esc(self.app_url(locale, surface))}">{esc(text['appCta'])}<i data-lucide="arrow-up-right"></i></a>
    </aside>"""

    def head(self, locale, path, title, description, schema):
        language = self.locales[locale]["lang"]
        alternates = "".join(
            f'<link rel="alternate" hreflang="{candidate}" href="{SITE}/{candidate}/{path}">\n'
            for candidate in self.locales
        )
        return f"""<!DOCTYPE html>
<html lang="{esc(language)}">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>{esc(title)}</title>
  <meta name="description" content="{esc(description)}">
  <meta name="robots" content="index, follow">
  <meta name="apple-itunes-app" content="app-id=6766551832">
  <link rel="canonical" href="{SITE}/{locale}/{path}">
  {alternates}<link rel="alternate" hreflang="x-default" href="{SITE}/en-US/{path}">
  <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32.png">
  <link rel="apple-touch-icon" href="/apple-touch-icon.png">
  <link rel="stylesheet" href="{asset_url('/style/base.css')}">
  <link rel="stylesheet" href="{asset_url('/style/experience.css')}">
  <meta property="og:title" content="{esc(title)}">
  <meta property="og:description" content="{esc(description)}">
  <meta property="og:type" content="website">
  <meta property="og:url" content="{SITE}/{locale}/{path}">
  <meta property="og:image" content="{SITE}/app-icon.png">
  <meta name="twitter:card" content="summary">
  <script type="application/ld+json">{json_script(schema)}</script>
</head>
<body class="experience-site"><main class="site-shell experience-shell">"""

    def cards(self, models, locale):
        text = self.copy[locale]
        output = []
        for model in models:
            item = self.model_data(model, locale)
            animation = '<span class="animation-mark"><i data-lucide="play"></i>' + esc(self.locales[locale]["animation"]) + "</span>" if item["animated"] else ""
            alt = text["imageAlt"].replace("{name}", item["name"])
            scientific = f'<span class="specimen-scientific">{esc(item["scientific"])}</span>' if item["scientific"] else ""
            output.append(f"""
      <article class="specimen-tile" data-model-id="{item['id']}">
        <a class="specimen-link" href="{item['url']}">
          <div class="specimen-photo"><img src="{item['thumbnail']}" alt="{esc(alt)}" width="256" height="144" loading="eager" decoding="async">{animation}</div>
          <div class="specimen-caption"><h3>{esc(item['name'])}</h3>{scientific}<span class="specimen-kind">{esc(item['categoryLabel'])}</span></div>
        </a>
        <button class="icon-button card-toggle" data-card-id="{item['id']}" type="button" aria-pressed="false" title="{esc(text['addCard'])}" aria-label="{esc(text['addCard'] + ': ' + item['name'])}"><i data-lucide="plus"></i></button>
      </article>""")
        return "".join(output)

    def toolbar(self, locale, initial_category=""):
        text, spec = self.copy[locale], self.locales[locale]
        options = f'<option value="">{esc(text["allThemes"])}</option>' + "".join(
            f'<option value="{key}">{esc(text["themes"][key]["title"])}</option>' for key in self.config["themes"]
        )
        categories = f'<option value="">{esc(text["all"])}</option>' + "".join(
            f'<option value="{key}"{" selected" if key == initial_category else ""}>{esc(label)}</option>'
            for key, label in spec["category_labels"].items()
        )
        return f"""
    <form class="catalog-toolbar" role="search">
      <label class="search-field"><i data-lucide="search"></i><span class="sr-only">{esc(text['search'])}</span><input id="model-search" type="search" name="q" autocomplete="off" placeholder="{esc(text['searchPlaceholder'])}"></label>
      <label class="filter-field"><span class="sr-only">{esc(spec['category'])}</span><select id="category-filter">{categories}</select></label>
      <label class="filter-field"><span class="sr-only">{esc(text['theme'])}</span><select id="theme-filter">{options}</select></label>
      <label class="animation-filter"><input id="animated-filter" type="checkbox"><span>{esc(text['animatedOnly'])}</span></label>
    </form>"""

    def theme_links(self, locale):
        text = self.copy[locale]
        return '<nav class="theme-links" aria-label="' + esc(text["theme"]) + '">' + "".join(
            f'<a href="/{locale}/collections/{key}/"><i data-lucide="{theme["icon"]}"></i>{esc(text["themes"][key]["title"])}</a>'
            for key, theme in self.config["themes"].items()
        ) + "</nav>"

    def render_listing(self, locale, category=None, theme=None, home=False):
        text, spec = self.copy[locale], self.locales[locale]
        models = self.models
        path = "models/"
        title = text["catalogTitle"]
        description = text["catalogDescription"]
        observation = ""
        if home:
            path = ""
            title = "Little Nature"
            description = text["catalogDescription"]
            models = [model for key in self.config["featured"] for model in self.models if stem(model) == key]
        elif category:
            path += {"animal": "animals", "plant": "plants", "special": "special"}[category] + "/"
            title = spec["category_labels"][category]
            models = [model for model in models if model["category"] == category]
        elif theme:
            path = "collections/" + theme + "/"
            theme_copy = text["themes"][theme]
            title, description = theme_copy["title"], theme_copy["description"]
            models = [model for model in models if stem(model) in self.config["themes"][theme]["models"]]
            observation = self.observation(locale, theme)
        ordered = {key: index for index, key in enumerate(self.config["featured"])}
        models = sorted(models, key=lambda model: ordered.get(stem(model), len(ordered)))
        url = SITE + "/" + locale + "/" + path
        schema = {"@context": "https://schema.org", "@graph": [
            {"@type": "CollectionPage", "name": title, "description": description, "url": url, "inLanguage": spec["lang"],
             "isPartOf": {"@id": SITE + "/#website"},
             "mainEntity": {"@type": "ItemList", "numberOfItems": len(models), "itemListElement": [
                 {"@type": "ListItem", "position": index + 1, "name": self.name(model, locale),
                  "url": SITE + "/" + locale + "/models/" + slug(model) + "/"}
                 for index, model in enumerate(models)]}},
            {"@type": "BreadcrumbList", "itemListElement": [
                {"@type": "ListItem", "position": 1, "name": "Little Nature", "item": SITE + "/" + locale + "/"},
                *([] if home else [{"@type": "ListItem", "position": 2, "name": title, "item": url}])]},
        ]}
        if home:
            schema["@graph"].append({"@type": "WebSite", "@id": SITE + "/#website",
                                     "name": "Little Nature", "url": SITE + "/" + locale + "/", "inLanguage": spec["lang"]})
        more = f'<a class="text-link" href="/{locale}/models/">{esc(text["all"])}<i data-lucide="arrow-up-right"></i></a>' if home else ""
        section_title = text["featured"] if home else title
        result_text = text["results"].replace("{count}", str(len(models))).replace("{total}", str(len(models)))
        empty = f"""<div class="empty-state" id="catalog-empty" hidden><h2>{esc(text['noResults'])}</h2><button class="button secondary" id="reset-filters" type="button"><i data-lucide="rotate-ccw"></i>{esc(text['resetFilters'])}</button><a id="search-all-link" href="/{locale}/models/" hidden>{esc(text['searchAll'])}</a></div>"""
        return self.head(locale, path, title + (" | Little Nature" if not home else " | " + text["catalogTitle"]), text["catalogDescription"] if home else description, schema) + self.header(locale, path) + f"""
    <section class="catalog-intro"><div><h1>{esc(title)}</h1><p>{esc(description)}</p></div></section>
    {self.theme_links(locale)}
    {observation}
    <section class="catalog-section" aria-label="{esc(section_title)}">
      <div class="section-heading"><h2>{esc(section_title)}</h2>{more}</div>
      {self.toolbar(locale, category or '')}
      <p class="result-count" id="result-count" role="status" aria-live="polite">{esc(result_text)}</p>
      <div class="specimen-grid">{self.cards(models, locale)}</div>{empty}
    </section>
    {self.app_band(locale, 'home' if home else 'catalog')}
    {self.footer(locale)}
    </main>{self.runtime(models, locale, 'catalog', initialCategory=category or '', theme=theme or '', home=home)}</body></html>
"""

    def observation(self, locale, theme):
        text = self.copy[locale]
        prompts = "".join("<li>" + esc(prompt) + "</li>" for prompt in text["themes"][theme]["prompts"])
        return f'<section class="observation-section"><h2>{esc(text["observe"])}</h2><ul>{prompts}</ul></section>'

    def viewer(self, model, locale):
        item, text = self.model_data(model, locale), self.copy[locale]
        alt = text["imageAlt"].replace("{name}", item["name"])
        return f"""
        <div class="viewer-column">
          <div class="viewer-toolbar-slot">
          <div class="viewer-controls" id="viewer-controls" hidden>
            <button class="icon-button" id="animation-toggle" type="button" title="{esc(text['play'])}" aria-label="{esc(text['play'])}" aria-pressed="false" hidden><i data-lucide="play"></i></button>
            <button class="icon-button" id="reset-view" type="button" title="{esc(text['reset'])}" aria-label="{esc(text['reset'])}"><i data-lucide="rotate-ccw"></i></button>
            <button class="icon-button" id="fullscreen-view" type="button" title="{esc(text['fullscreen'])}" aria-label="{esc(text['fullscreen'])}"><i data-lucide="maximize"></i></button>
            <span class="viewer-credit">CC0 · {esc(item['creator'])}</span>
          </div>
          </div>
          <div class="specimen-viewer" id="specimen-viewer" data-model-id="{item['id']}">
            <div class="viewer-poster"><img src="{item['image']}" alt="{esc(alt)}" width="1024" height="576" fetchpriority="high"><button id="load-viewer" class="button viewer-launch" type="button"><i data-lucide="box"></i>{esc(text['view3d'])}</button></div>
            <div class="viewer-stage" id="viewer-stage" hidden></div>
            <div class="viewer-status" id="viewer-status" role="status" hidden><span id="viewer-status-text"></span><button id="retry-viewer" class="button secondary" type="button" hidden><i data-lucide="refresh-cw"></i>{esc(text['retry'])}</button></div>
          </div>
          <p class="provider-note"{" hidden" if item["glb"] else ""}>{esc(text['providerNote'])} <a href="{esc(item['source'])}" target="_blank" rel="noopener noreferrer">{esc(text['sourceViewer'])}<i data-lucide="arrow-up-right"></i></a></p>
        </div>"""

    def detail_actions(self, model, locale):
        item, text = self.model_data(model, locale), self.copy[locale]
        glb = f'<a class="button secondary" href="{esc(item["glb"])}" download>{esc(text["downloadGLB"])}</a>' if item["glb"] else ""
        return f"""<div class="detail-actions">
          <button class="button secondary card-toggle" data-card-id="{item['id']}" type="button" aria-pressed="false"><i data-lucide="plus"></i><span data-card-label>{esc(text['addCard'])}</span></button>
          <a class="button secondary quick-look-link" href="{esc(item['usdz'])}" rel="ar" hidden><img src="{item['image']}" alt="" hidden>{esc(text['quickLook'])}</a>{glb}
        </div>"""

    def render_study(self, locale):
        text = self.copy[locale]
        path = "study-cards/"
        title, description = text["studyTitle"], text["studyDescription"]
        schema = {"@context": "https://schema.org", "@type": "WebApplication", "name": title,
                  "url": SITE + "/" + locale + "/" + path, "description": description,
                  "applicationCategory": "EducationalApplication", "operatingSystem": "Web browser",
                  "isAccessibleForFree": True, "inLanguage": self.locales[locale]["lang"]}
        theme_options = "".join(f'<option value="{key}">{esc(value["title"])}</option>' for key, value in text["themes"].items())
        return self.head(locale, path, title + " | Little Nature", description, schema) + self.header(locale, path) + f"""
    <section class="catalog-intro"><div><h1>{esc(title)}</h1><p>{esc(description)}</p></div></section>
    <section class="study-workspace">
      <div class="study-toolbar">
        <label>{esc(text['paper'])}<select id="paper-size"><option value="A4">A4</option><option value="Letter">Letter</option></select></label>
        <label>{esc(text['layout'])}<select id="card-layout"><option value="named">{esc(text['namedCards'])}</option><option value="matching">{esc(text['matchingCards'])}</option></select></label>
        <label class="scientific-toggle"><input type="checkbox" id="scientific-names" checked>{esc(text['scientificNames'])}</label>
        <button class="button" id="print-cards" type="button"><i data-lucide="printer"></i>{esc(text['print'])}</button>
      </div>
      <div class="selection-toolbar"><p id="study-count" role="status"></p><button class="text-button" id="select-featured" type="button">{esc(text['selectFeatured'])}</button><label class="sr-only" for="study-theme">{esc(text['theme'])}</label><select id="study-theme"><option value="">{esc(text['theme'])}</option>{theme_options}</select><button class="text-button" id="clear-cards" type="button"><i data-lucide="x"></i>{esc(text['clear'])}</button></div>
      <div class="study-preview" id="study-preview" aria-label="{esc(text['preview'])}"></div>
      <div class="empty-state" id="study-empty" hidden><h2>{esc(text['emptySelection'])}</h2><a class="button secondary" href="/{locale}/models/">{esc(text['chooseModels'])}</a></div>
    </section>
    <section class="catalog-section"><div class="section-heading"><h2>{esc(text['chooseModels'])}</h2></div>{self.toolbar(locale)}
      <p class="result-count" id="result-count" role="status" aria-live="polite"></p>
      <div class="specimen-grid">{self.cards(self.models, locale)}</div>
      <div class="empty-state" id="catalog-empty" hidden><h2>{esc(text['noResults'])}</h2><button class="button secondary" id="reset-filters" type="button">{esc(text['resetFilters'])}</button></div>
    </section>{self.app_band(locale, 'study')}{self.footer(locale)}
    </main><div id="print-output" class="print-only"></div><style id="print-page-size"></style>
    {self.runtime(self.models, locale, 'study')}</body></html>"""

    def render_help(self, locale):
        text = self.help_copy[locale]
        url = SITE + "/" + locale + "/help"
        questions = text["questions"]
        schema = {"@context": "https://schema.org", "@graph": [
            {"@type": "FAQPage", "@id": url + "#faq", "url": url,
             "name": text["title"], "description": text["description"],
             "inLanguage": self.locales[locale]["lang"],
             "mainEntity": [{"@type": "Question", "name": question,
                             "acceptedAnswer": {"@type": "Answer", "text": answer}}
                            for question, answer, _ in questions]},
            {"@type": "BreadcrumbList", "itemListElement": [
                {"@type": "ListItem", "position": 1, "name": "Little Nature", "item": SITE + "/" + locale + "/"},
                {"@type": "ListItem", "position": 2, "name": text["title"], "item": url}]}
        ]}
        sections = []
        for question, answer, path in questions:
            target = "/" + locale + "/" + path if path else APP_STORE
            label = self.copy[locale]["studyCards"] if path == "study-cards/" else (
                self.copy[locale]["themes"]["motion"]["title"] if path == "collections/motion/" else (
                    self.locales[locale]["models"] if path else self.copy[locale]["appCta"]))
            sections.append(f'<section class="help-answer"><h2>{esc(question)}</h2><p>{esc(answer)}</p>'
                            f'<a href="{esc(target)}">{esc(label)}</a></section>')
        return self.head(locale, "help", text["title"] + " | Little Nature", text["description"], schema) + self.header(locale, "help") + f"""
    <article class="help-content">
      <section class="catalog-intro"><div><h1>{esc(text['title'])}</h1><p>{esc(text['description'])}</p></div></section>
      {''.join(sections)}
      <p>{esc(text['contact'])} cameoshell09@gmail.com</p>
    </article>{self.footer(locale)}</main>{self.runtime([], locale, 'help')}</body></html>"""
