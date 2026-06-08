#!/usr/bin/env python3
import html
import json
import re
import shutil
from datetime import date
from pathlib import Path

ROOT = Path(__file__).resolve().parent
PROJECT_ROOT = ROOT.parent
MANIFEST_PATH = PROJECT_ROOT / "FFishAsia" / "Resources" / "manifest.json"
THUMBNAIL_ROOT = PROJECT_ROOT / "FFishAsia" / "Resources" / "thumbnails"
IMAGE_ROOT = ROOT / "model-images"
SITE = "https://ar-asia.luopeike.com"
APP_STORE_URL = "https://apps.apple.com/app/id6766551832"
SKETCHFAB_SOURCE_URL = "https://sketchfab.com/ffishAsia-and-floraZia"
LASTMOD = date.today().isoformat()

LOCALES = {
    "en-US": {
        "lang": "en",
        "name_key": "name_en",
        "tax_key": "taxonomic_info_en",
        "home": "Home",
        "help": "Help",
        "privacy": "Privacy",
        "app_store": "App Store",
        "models": "Models",
        "category": "Category",
        "scientific": "Scientific name",
        "file_size": "File size",
        "geometry": "Geometry",
        "animation": "Animation",
        "faces": "faces",
        "vertices": "vertices",
        "available": "Available",
        "none": "None",
        "taxonomy": "Taxonomy",
        "source": "Source",
        "source_link": "View original model on Sketchfab",
        "cta": "View Little Nature on the App Store",
        "title_suffix": "3D Model in Little Nature",
        "lead": "A curated CC0-based 3D biological model record for browsing in Little Nature. Supported iPhone and iPad devices can view downloaded models in AR.",
        "category_labels": {"animal": "Animal", "plant": "Plant", "special": "Special"},
        "language_label": "Language",
    },
    "de-DE": {
        "lang": "de",
        "name_key": "name_de",
        "tax_key": "taxonomic_info_de",
        "home": "Startseite",
        "help": "Hilfe",
        "privacy": "Datenschutz",
        "app_store": "App Store",
        "models": "Modelle",
        "category": "Kategorie",
        "scientific": "Wissenschaftlicher Name",
        "file_size": "Dateigröße",
        "geometry": "Geometrie",
        "animation": "Animation",
        "faces": "Flächen",
        "vertices": "Eckpunkte",
        "available": "Verfügbar",
        "none": "Keine",
        "taxonomy": "Taxonomie",
        "source": "Quelle",
        "source_link": "Originalmodell auf Sketchfab ansehen",
        "cta": "Little Nature im App Store ansehen",
        "title_suffix": "3D-Modell in Little Nature",
        "lead": "Ein kuratierter CC0-basierter biologischer 3D-Modellrecord für Little Nature. Unterstützte iPhone- und iPad-Geräte können geladene Modelle in AR anzeigen.",
        "category_labels": {"animal": "Tier", "plant": "Pflanze", "special": "Spezial"},
        "language_label": "Sprache",
    },
    "ja": {
        "lang": "ja",
        "name_key": "name_ja",
        "tax_key": "taxonomic_info_ja",
        "home": "ホーム",
        "help": "ヘルプ",
        "privacy": "プライバシー",
        "app_store": "App Store",
        "models": "モデル",
        "category": "カテゴリー",
        "scientific": "学名",
        "file_size": "ファイルサイズ",
        "geometry": "ジオメトリ",
        "animation": "アニメーション",
        "faces": "面",
        "vertices": "頂点",
        "available": "あり",
        "none": "なし",
        "taxonomy": "分類",
        "source": "出典",
        "source_link": "Sketchfabで元モデルを見る",
        "cta": "App Storeで小さな自然を見る",
        "title_suffix": "小さな自然の3Dモデル",
        "lead": "小さな自然で閲覧できる、CC0ベースの3D生物モデル資料です。対応するiPhoneとiPadでは、ダウンロードしたモデルをARで表示できます。",
        "category_labels": {"animal": "動物", "plant": "植物", "special": "特別"},
        "language_label": "言語",
    },
    "ko": {
        "lang": "ko",
        "name_key": "name_ko",
        "tax_key": "taxonomic_info_ko",
        "home": "홈",
        "help": "도움말",
        "privacy": "개인정보",
        "app_store": "App Store",
        "models": "모델",
        "category": "카테고리",
        "scientific": "학명",
        "file_size": "파일 크기",
        "geometry": "지오메트리",
        "animation": "애니메이션",
        "faces": "면",
        "vertices": "정점",
        "available": "있음",
        "none": "없음",
        "taxonomy": "분류",
        "source": "출처",
        "source_link": "Sketchfab에서 원본 모델 보기",
        "cta": "App Store에서 Little Nature 보기",
        "title_suffix": "Little Nature의 3D 모델",
        "lead": "Little Nature에서 탐색할 수 있는 CC0 기반 3D 생물 모델 기록입니다. 지원되는 iPhone 및 iPad에서는 다운로드한 모델을 AR로 볼 수 있습니다.",
        "category_labels": {"animal": "동물", "plant": "식물", "special": "특별"},
        "language_label": "언어",
    },
    "zh-Hans": {
        "lang": "zh-Hans",
        "name_key": "name_zh_hans",
        "tax_key": "taxonomic_info_zh_hans",
        "home": "首页",
        "help": "帮助",
        "privacy": "隐私",
        "app_store": "App Store",
        "models": "模型",
        "category": "分类",
        "scientific": "学名",
        "file_size": "文件大小",
        "geometry": "几何信息",
        "animation": "动画",
        "faces": "面",
        "vertices": "顶点",
        "available": "有",
        "none": "无",
        "taxonomy": "分类信息",
        "source": "来源",
        "source_link": "在 Sketchfab 查看原始模型",
        "cta": "在 App Store 查看小小自然",
        "title_suffix": "小小自然 3D 模型资料",
        "lead": "这是小小自然中的一条 CC0 3D 生物模型资料。支持的 iPhone 和 iPad 可在下载后用 AR 查看模型。",
        "category_labels": {"animal": "动物", "plant": "植物", "special": "特别"},
        "language_label": "语言",
    },
    "zh-Hant": {
        "lang": "zh-Hant",
        "name_key": "name_zh_hant",
        "tax_key": "taxonomic_info_zh_hant",
        "home": "首頁",
        "help": "幫助",
        "privacy": "隱私",
        "app_store": "App Store",
        "models": "模型",
        "category": "分類",
        "scientific": "學名",
        "file_size": "檔案大小",
        "geometry": "幾何資訊",
        "animation": "動畫",
        "faces": "面",
        "vertices": "頂點",
        "available": "有",
        "none": "無",
        "taxonomy": "分類資訊",
        "source": "來源",
        "source_link": "在 Sketchfab 查看原始模型",
        "cta": "在 App Store 查看小小自然",
        "title_suffix": "小小自然 3D 模型資料",
        "lead": "這是小小自然中的一條 CC0 3D 生物模型資料。支援的 iPhone 和 iPad 可在下載後用 AR 查看模型。",
        "category_labels": {"animal": "動物", "plant": "植物", "special": "特別"},
        "language_label": "語言",
    },
}

LANGUAGE_NAMES = {
    "en-US": "English",
    "de-DE": "Deutsch",
    "ja": "日本語",
    "ko": "한국어",
    "zh-Hans": "简体中文",
    "zh-Hant": "繁體中文",
}

CATEGORY_SLUGS = {
    "animal": "animals",
    "plant": "plants",
    "special": "special",
}


def esc(value):
    return html.escape(str(value or ""), quote=True)


def slug_for(model):
    return Path(model["filename"]).stem.replace("_", "-")


def name_for(model, locale):
    spec = LOCALES[locale]
    return model.get(spec["name_key"]) or model.get("name_en") or slug_for(model)


def tax_for(model, locale):
    spec = LOCALES[locale]
    return model.get(spec["tax_key"]) or model.get("taxonomic_info_en") or model.get("taxonomic_info") or ""


def model_url(locale, slug):
    return f"{SITE}/{locale}/models/{slug}/"


def model_index_url(locale):
    return f"{SITE}/{locale}/models/"


def category_url(locale, category):
    return f"{SITE}/{locale}/models/{CATEGORY_SLUGS[category]}/"


def rel_prefix(locale):
    return "../../../"


def language_select(locale, slug):
    options = []
    for candidate, label in LANGUAGE_NAMES.items():
        selected = " selected" if candidate == locale else ""
        options.append(f'<option value="../../../{candidate}/models/{slug}/"{selected}>{esc(label)}</option>')
    return "".join(options)


def nav(locale, slug):
    spec = LOCALES[locale]
    options = language_select(locale, slug)
    return f"""
    <header class="site-header">
      <a class="brand" href="../../../{locale}/" aria-label="Little Nature">
        <span class="brand-mark">LN</span>
        <span>Little Nature</span>
      </a>
      <div class="header-actions">
        <nav class="nav-links" aria-label="Primary">
          <a href="../../../{locale}/">{esc(spec["home"])}</a>
          <a href="../../../{locale}/models/">{esc(spec["models"])}</a>
          <a href="../../../{locale}/help">{esc(spec["help"])}</a>
          <a href="../../../{locale}/privacy-policy">{esc(spec["privacy"])}</a>
          <a href="{APP_STORE_URL}">{esc(spec["app_store"])}</a>
        </nav>
        <select class="language-select" aria-label="{esc(spec["language_label"])}" onchange="if (this.value) window.location.href = this.value;">{options}</select>
      </div>
    </header>"""


def meta_links(locale, slug):
    return alternate_links(locale, lambda candidate: model_url(candidate, slug))


def alternate_links(locale, url_for_locale):
    lines = [f'  <link rel="canonical" href="{url_for_locale(locale)}">']
    for candidate in LOCALES:
        lines.append(f'  <link rel="alternate" hreflang="{candidate}" href="{url_for_locale(candidate)}">')
    lines.append(f'  <link rel="alternate" hreflang="x-default" href="{url_for_locale("en-US")}">')
    return "\n".join(lines)


def format_number(value):
    try:
        return f"{int(value):,}"
    except Exception:
        return ""


def description_for(model, locale):
    name = name_for(model, locale)
    category = LOCALES[locale]["category_labels"].get(model.get("category"), model.get("category", ""))
    scientific = model.get("scientific_name") or ""
    if locale == "de-DE":
        base = f"{name} ist ein kuratierter CC0-basierter 3D-Modellrecord in Little Nature."
        if scientific:
            base += f" Wissenschaftlicher Name: {scientific}."
        return f"{base} Kategorie: {category}. Dateigröße: {model.get('file_size_mb', '')} MB."
    if locale == "ja":
        base = f"{name}は、小さな自然で閲覧できるCC0ベースの3Dモデル資料です。"
        if scientific:
            base += f" 学名: {scientific}。"
        return f"{base} カテゴリー: {category}。ファイルサイズ: {model.get('file_size_mb', '')} MB。"
    if locale == "ko":
        base = f"{name}는 Little Nature에서 탐색할 수 있는 CC0 기반 3D 모델 기록입니다."
        if scientific:
            base += f" 학명: {scientific}."
        return f"{base} 카테고리: {category}. 파일 크기: {model.get('file_size_mb', '')} MB."
    if locale == "zh-Hans":
        base = f"{name} 是小小自然中的一条 CC0 3D 模型资料。"
        if scientific:
            base += f" 学名：{scientific}。"
        return f"{base} 分类：{category}。文件大小：{model.get('file_size_mb', '')} MB。可查看模型预览、几何信息、动画状态和来源链接。"
    if locale == "zh-Hant":
        base = f"{name} 是小小自然中的一條 CC0 3D 模型資料。"
        if scientific:
            base += f" 學名：{scientific}。"
        return f"{base} 分類：{category}。檔案大小：{model.get('file_size_mb', '')} MB。可查看模型預覽、幾何資訊、動畫狀態和來源連結。"
    base = f"{name} is a curated CC0-based 3D model record in Little Nature."
    if scientific:
        base += f" Scientific name: {scientific}."
    return f"{base} Category: {category}. File size: {model.get('file_size_mb', '')} MB."


def parse_taxonomy(taxonomy):
    result = []
    for line in taxonomy.splitlines():
        if ":" not in line:
            continue
        key, value = line.split(":", 1)
        key = key.strip()
        value = value.strip()
        if key and value and value != "___":
            result.append((key, value))
    return result


def taxonomy_highlights(taxonomy):
    items = parse_taxonomy(taxonomy)
    preferred = ["Kingdom", "Order", "Family", "Genus", "Species"]
    highlights = []
    for key in preferred:
        match = next(((item_key, value) for item_key, value in items if item_key == key), None)
        if match:
            highlights.append(match)
    if len(highlights) < 4:
        for item in items:
            if item not in highlights:
                highlights.append(item)
            if len(highlights) == 4:
                break
    return highlights[-4:] or items[:4]


def category_title(locale, category):
    label = LOCALES[locale]["category_labels"][category]
    if locale == "de-DE":
        return f"Little Nature {label} - 3D-Modellkatalog"
    if locale == "ja":
        return f"小さな自然 {label} - 3Dモデル一覧"
    if locale == "ko":
        return f"Little Nature {label} - 3D 모델 목록"
    if locale == "zh-Hans":
        return f"小小自然{label}模型 - 3D 生物模型目录"
    if locale == "zh-Hant":
        return f"小小自然{label}模型 - 3D 生物模型目錄"
    return f"Little Nature {label} Models - 3D Model Catalog"


def category_description(locale, category, count):
    label = LOCALES[locale]["category_labels"][category]
    if locale == "de-DE":
        return f"Durchsuche {count} {label}-Modelleinträge in Little Nature mit Vorschau, Taxonomie, Dateigröße, Geometrie und Quellenlinks."
    if locale == "ja":
        return f"小さな自然の{label}モデル{count}件を、プレビュー、分類、ファイルサイズ、ジオメトリ、出典リンク付きで閲覧できます。"
    if locale == "ko":
        return f"Little Nature의 {label} 모델 {count}개를 미리보기, 분류, 파일 크기, 지오메트리, 출처 링크와 함께 살펴보세요."
    if locale == "zh-Hans":
        return f"浏览小小自然中的 {count} 个{label}模型资料，包括预览图、分类信息、文件大小、几何信息和来源链接。"
    if locale == "zh-Hant":
        return f"瀏覽小小自然中的 {count} 個{label}模型資料，包括預覽圖、分類資訊、檔案大小、幾何資訊和來源連結。"
    return f"Browse {count} Little Nature {label.lower()} model records with previews, taxonomy, file sizes, geometry, and source links."


def model_notes(locale, name, category, scientific, taxonomy, model):
    highlights = taxonomy_highlights(taxonomy)
    classification = ", ".join(f"{key}: {value}" for key, value in highlights)
    if not classification:
        classification = LOCALES[locale]["none"]
    faces = format_number(model.get("face_count"))
    vertices = format_number(model.get("vertex_count"))
    if locale == "de-DE":
        return [
            f"{name} ist in Little Nature als {category}-Modell katalogisiert. Der Eintrag verbindet lokale Namen, verfügbare wissenschaftliche Benennung und Taxonomie mit einer CC0-basierten 3D-Quelle.",
            f"Wichtige Klassifikationsdaten: {classification}.",
            f"Der USDZ-Datensatz umfasst {faces} Flächen und {vertices} Eckpunkte und ist für die On-Demand-Nutzung in der App optimiert.",
        ]
    if locale == "ja":
        return [
            f"{name}は小さな自然で{category}モデルとして整理されています。ローカライズ名、利用可能な学名、分類情報、CC0ベースの3Dソースを結び付けた資料です。",
            f"主な分類情報: {classification}。",
            f"USDZデータは{faces}面、{vertices}頂点で構成され、アプリ内で必要に応じてダウンロードして閲覧できます。",
        ]
    if locale == "ko":
        return [
            f"{name}는 Little Nature에서 {category} 모델로 정리된 항목입니다. 현지화된 이름, 확인 가능한 학명, 분류 정보, CC0 기반 3D 출처를 함께 제공합니다.",
            f"주요 분류 정보: {classification}.",
            f"USDZ 데이터는 {faces}개 면과 {vertices}개 정점으로 구성되며 앱에서 필요할 때 내려받아 볼 수 있습니다.",
        ]
    if locale == "zh-Hans":
        return [
            f"{name} 在小小自然中归入{category}模型。页面把本地化名称、可用学名、分类阶元和 CC0 3D 来源放在一起，方便检索和核对。",
            f"主要分类信息：{classification}。",
            f"这个 USDZ 模型包含 {faces} 个面和 {vertices} 个顶点，可在 App 内按需下载并查看。",
        ]
    if locale == "zh-Hant":
        return [
            f"{name} 在小小自然中歸入{category}模型。頁面把本地化名稱、可用學名、分類階元和 CC0 3D 來源放在一起，方便檢索和核對。",
            f"主要分類資訊：{classification}。",
            f"這個 USDZ 模型包含 {faces} 個面和 {vertices} 個頂點，可在 App 內按需下載並查看。",
        ]
    return [
        f"{name} is cataloged in Little Nature as a {category.lower()} model. The record connects localized names, available scientific naming, taxonomy, and a CC0-based 3D source.",
        f"Key classification data: {classification}.",
        f"The USDZ asset contains {faces} faces and {vertices} vertices and is designed for on-demand viewing in the app.",
    ]


def section_label(locale, key):
    labels = {
        "species_notes": {
            "en-US": "Species and Model Notes",
            "de-DE": "Art- und Modellhinweise",
            "ja": "種とモデルのメモ",
            "ko": "종 및 모델 정보",
            "zh-Hans": "物种与模型资料",
            "zh-Hant": "物種與模型資料",
        },
        "categories": {
            "en-US": "Categories",
            "de-DE": "Kategorien",
            "ja": "カテゴリー",
            "ko": "카테고리",
            "zh-Hans": "分类",
            "zh-Hant": "分類",
        },
        "all_models": {
            "en-US": "All models",
            "de-DE": "Alle Modelle",
            "ja": "すべてのモデル",
            "ko": "전체 모델",
            "zh-Hans": "全部模型",
            "zh-Hant": "全部模型",
        },
    }
    return labels[key][locale]


def breadcrumb_schema(locale, items):
    return {
        "@type": "BreadcrumbList",
        "itemListElement": [
            {
                "@type": "ListItem",
                "position": index + 1,
                "name": name,
                "item": url,
            }
            for index, (name, url) in enumerate(items)
        ],
    }


def item_list_schema(models, locale, base_url):
    return {
        "@type": "ItemList",
        "itemListElement": [
            {
                "@type": "ListItem",
                "position": index + 1,
                "url": model_url(locale, slug_for(model)),
                "name": name_for(model, locale),
            }
            for index, model in enumerate(models)
        ],
        "url": base_url,
        "numberOfItems": len(models),
    }


def render_page(model, locale):
    spec = LOCALES[locale]
    slug = slug_for(model)
    name = name_for(model, locale)
    english_name = model.get("name_en") or name
    title = f"{name} - {spec['title_suffix']}"
    description = description_for(model, locale)
    image = f"{SITE}/model-images/{Path(model['filename']).stem}_preview.jpeg"
    local_image = f"../../../model-images/{Path(model['filename']).stem}_preview.jpeg"
    category = spec["category_labels"].get(model.get("category"), model.get("category", ""))
    taxonomy = tax_for(model, locale)
    taxonomy_html = "<br>".join(esc(line) for line in taxonomy.splitlines() if line.strip()) or esc(spec["none"])
    scientific = model.get("scientific_name") or spec["none"]
    animation = spec["available"] if model.get("has_animation") else spec["none"]
    notes = model_notes(locale, name, category, scientific, taxonomy, model)
    notes_html = "\n".join(f"        <p>{esc(note)}</p>" for note in notes)
    breadcrumb_items = [
        (spec["home"], f"{SITE}/{locale}/"),
        (spec["models"], model_index_url(locale)),
        (name, model_url(locale, slug)),
    ]
    schema = {
        "@context": "https://schema.org",
        "@graph": [
            {
                "@type": "CreativeWork",
                "name": name,
                "alternateName": [value for value in [
                    model.get("name_en"),
                    model.get("name_de"),
                    model.get("name_ja"),
                    model.get("name_ko"),
                    model.get("name_zh_hans"),
                    model.get("name_zh_hant"),
                ] if value and value != name],
                "description": description,
                "url": model_url(locale, slug),
                "image": image,
                "encodingFormat": "model/vnd.usdz+zip",
                "fileFormat": "USDZ",
                "license": "https://creativecommons.org/publicdomain/zero/1.0/",
                "isPartOf": {"@id": f"{SITE}/#app"},
                "sameAs": [model.get("sketchfab_url") or SKETCHFAB_SOURCE_URL],
                "keywords": [category, "3D model", "CC0", "Little Nature", english_name],
            },
            breadcrumb_schema(locale, breadcrumb_items),
        ],
    }
    return f"""<!DOCTYPE html>
<html lang="{esc(spec['lang'])}">

<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>{esc(title)}</title>
  <meta name="description" content="{esc(description[:165])}">
  <meta name="robots" content="index, follow">
  <meta name="theme-color" content="#0f766e" media="(prefers-color-scheme: light)">
  <meta name="theme-color" content="#10201c" media="(prefers-color-scheme: dark)">
  <link rel="icon" type="image/png" sizes="32x32" href="../../../favicon-32.png">
  <link rel="icon" type="image/png" sizes="64x64" href="../../../favicon-64.png">
  <link rel="apple-touch-icon" sizes="180x180" href="../../../apple-touch-icon.png">
  <link rel="stylesheet" href="../../../style/base.css">
{meta_links(locale, slug)}
  <meta property="og:title" content="{esc(title)}">
  <meta property="og:description" content="{esc(description[:180])}">
  <meta property="og:type" content="article">
  <meta property="og:url" content="{model_url(locale, slug)}">
  <meta property="og:site_name" content="Little Nature">
  <meta property="og:image" content="{image}">
  <meta property="og:image:width" content="1024">
  <meta property="og:image:height" content="576">
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="{esc(title)}">
  <meta name="twitter:description" content="{esc(description[:180])}">
  <meta name="twitter:image" content="{image}">
  <script type="application/ld+json">
{json.dumps(schema, ensure_ascii=False, indent=2)}
  </script>
</head>

<body>
  <main class="site-shell">
{nav(locale, slug)}
    <article class="content-card model-page">
      <p class="eyebrow">Little Nature / {esc(spec["models"])}</p>
      <h1>{esc(name)}</h1>
      <p class="lead">{esc(spec["lead"])}</p>
      <div class="model-layout">
        <figure class="model-figure">
          <img src="{local_image}" alt="{esc(name)} 3D model preview" loading="eager">
          <figcaption>{esc(english_name)}</figcaption>
        </figure>
        <dl class="model-facts">
          <div><dt>{esc(spec["category"])}</dt><dd>{esc(category)}</dd></div>
          <div><dt>{esc(spec["scientific"])}</dt><dd>{esc(scientific)}</dd></div>
          <div><dt>{esc(spec["file_size"])}</dt><dd>{esc(model.get("file_size_mb", ""))} MB</dd></div>
          <div><dt>{esc(spec["geometry"])}</dt><dd>{format_number(model.get("face_count"))} {esc(spec["faces"])} · {format_number(model.get("vertex_count"))} {esc(spec["vertices"])}</dd></div>
          <div><dt>{esc(spec["animation"])}</dt><dd>{esc(animation)}</dd></div>
        </dl>
      </div>
      <section class="section">
        <h2>{esc(spec["taxonomy"])}</h2>
        <p class="taxonomy-text">{taxonomy_html}</p>
      </section>
      <section class="section">
        <h2>{esc(section_label(locale, "species_notes"))}</h2>
{notes_html}
      </section>
      <section class="section">
        <h2>{esc(spec["source"])}</h2>
        <p><a href="{esc(model.get("sketchfab_url") or SKETCHFAB_SOURCE_URL)}">{esc(spec["source_link"])}</a></p>
        <p><a class="button" href="{APP_STORE_URL}">{esc(spec["cta"])}</a></p>
      </section>
    </article>
  </main>
</body>

</html>
"""


def render_model_cards(models, locale, image_prefix="../../model-images/"):
    spec = LOCALES[locale]
    cards = []
    for model in models:
        slug = slug_for(model)
        name = name_for(model, locale)
        category = spec["category_labels"].get(model.get("category"), model.get("category", ""))
        image = f"{image_prefix}{Path(model['filename']).stem}_preview.jpeg"
        cards.append(f"""
        <article class="model-list-card">
          <a href="../{slug}/" data-category="{esc(model.get("category", ""))}">
            <img src="{image}" alt="{esc(name)} 3D model preview" loading="lazy">
            <span class="model-list-title">{esc(name)}</span>
            <span class="model-list-meta">{esc(category)} · {esc(model.get('file_size_mb', ''))} MB</span>
          </a>
        </article>""")
    return "".join(cards)


def category_links(locale, prefix="../../"):
    spec = LOCALES[locale]
    links = [f'<a href="{prefix}{locale}/models/">{esc(section_label(locale, "all_models"))}</a>']
    for category, slug in CATEGORY_SLUGS.items():
        links.append(f'<a href="{prefix}{locale}/models/{slug}/">{esc(spec["category_labels"][category])}</a>')
    return f'<nav class="category-links" aria-label="{esc(section_label(locale, "categories"))}">{"".join(links)}</nav>'


def render_model_index(models, locale):
    spec = LOCALES[locale]
    title = f"Little Nature {spec['models']} - 3D Biological Model Catalog"
    if locale == "de-DE":
        title = "Little Nature Modelle - 3D-Tier- und Pflanzenkatalog"
    elif locale == "ja":
        title = "小さな自然 モデル - 3D生物モデル一覧"
    elif locale == "ko":
        title = "Little Nature 모델 - 3D 생물 모델 목록"
    elif locale == "zh-Hans":
        title = "小小自然模型 - 3D 生物模型目录"
    elif locale == "zh-Hant":
        title = "小小自然模型 - 3D 生物模型目錄"
    description = {
        "en-US": "Browse Little Nature's localized catalog of CC0-based 3D animal and plant model records, with names, categories, file sizes, taxonomy, and source links.",
        "de-DE": "Durchsuche den lokalisierten Little Nature Katalog mit CC0-basierten 3D-Tier- und Pflanzenmodellen, Kategorien, Dateigrößen, Taxonomie und Quellenlinks.",
        "ja": "小さな自然のCC0ベース3D動植物モデル資料を、名称、カテゴリー、ファイルサイズ、分類、出典リンク付きで閲覧できます。",
        "ko": "Little Nature의 CC0 기반 3D 동식물 모델 기록을 이름, 카테고리, 파일 크기, 분류, 출처 링크와 함께 살펴보세요.",
        "zh-Hans": "浏览小小自然中的 CC0 3D 动植物模型资料，包括名称、分类、文件大小、分类信息和来源链接。",
        "zh-Hant": "瀏覽小小自然中的 CC0 3D 動植物模型資料，包括名稱、分類、檔案大小、分類資訊和來源連結。",
    }[locale]
    options = "".join(
        f'<option value="../../{candidate}/models/"{" selected" if candidate == locale else ""}>{esc(label)}</option>'
        for candidate, label in LANGUAGE_NAMES.items()
    )
    alternate_links = [f'  <link rel="canonical" href="{SITE}/{locale}/models/">']
    for candidate in LOCALES:
        alternate_links.append(f'  <link rel="alternate" hreflang="{candidate}" href="{SITE}/{candidate}/models/">')
    alternate_links.append(f'  <link rel="alternate" hreflang="x-default" href="{SITE}/en-US/models/">')
    schema = {
        "@context": "https://schema.org",
        "@graph": [
            {
                "@type": "CollectionPage",
                "name": title,
                "description": description,
                "url": model_index_url(locale),
                "isPartOf": {"@id": f"{SITE}/#website"},
                "mainEntity": {"@id": f"{SITE}/{locale}/models/#item-list"},
            },
            {
                "@id": f"{SITE}/{locale}/models/#item-list",
                **item_list_schema(models, locale, model_index_url(locale)),
            },
            breadcrumb_schema(locale, [
                (spec["home"], f"{SITE}/{locale}/"),
                (spec["models"], model_index_url(locale)),
            ]),
        ],
    }
    cards = []
    for model in models:
        name = name_for(model, locale)
        category = spec["category_labels"].get(model.get("category"), model.get("category", ""))
        image = f"../../model-images/{Path(model['filename']).stem}_preview.jpeg"
        cards.append(f"""
        <article class="model-list-card">
          <a href="{slug_for(model)}/" data-category="{esc(model.get("category", ""))}">
            <img src="{image}" alt="{esc(name)} 3D model preview" loading="lazy">
            <span class="model-list-title">{esc(name)}</span>
            <span class="model-list-meta">{esc(category)} · {esc(model.get('file_size_mb', ''))} MB</span>
          </a>
        </article>""")
    return f"""<!DOCTYPE html>
<html lang="{esc(spec['lang'])}">

<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>{esc(title)}</title>
  <meta name="description" content="{esc(description)}">
  <meta name="robots" content="index, follow">
  <meta name="theme-color" content="#0f766e" media="(prefers-color-scheme: light)">
  <meta name="theme-color" content="#10201c" media="(prefers-color-scheme: dark)">
  <link rel="icon" type="image/png" sizes="32x32" href="../../favicon-32.png">
  <link rel="icon" type="image/png" sizes="64x64" href="../../favicon-64.png">
  <link rel="apple-touch-icon" sizes="180x180" href="../../apple-touch-icon.png">
  <link rel="stylesheet" href="../../style/base.css">
{chr(10).join(alternate_links)}
  <meta property="og:title" content="{esc(title)}">
  <meta property="og:description" content="{esc(description)}">
  <meta property="og:type" content="website">
  <meta property="og:url" content="{SITE}/{locale}/models/">
  <meta property="og:site_name" content="Little Nature">
  <meta property="og:image" content="{SITE}/app-icon.png">
  <meta property="og:image:width" content="1024">
  <meta property="og:image:height" content="1024">
  <meta name="twitter:card" content="summary">
  <meta name="twitter:title" content="{esc(title)}">
  <meta name="twitter:description" content="{esc(description)}">
  <meta name="twitter:image" content="{SITE}/app-icon.png">
  <script type="application/ld+json">
{json.dumps(schema, ensure_ascii=False, indent=2)}
  </script>
</head>

<body>
  <main class="site-shell">
    <header class="site-header">
      <a class="brand" href="../../{locale}/" aria-label="Little Nature">
        <span class="brand-mark">LN</span>
        <span>Little Nature</span>
      </a>
      <div class="header-actions">
        <nav class="nav-links" aria-label="Primary">
          <a href="../../{locale}/">{esc(spec["home"])}</a>
          <a href="../../{locale}/models/">{esc(spec["models"])}</a>
          <a href="../../{locale}/help">{esc(spec["help"])}</a>
          <a href="../../{locale}/privacy-policy">{esc(spec["privacy"])}</a>
          <a href="{APP_STORE_URL}">{esc(spec["app_store"])}</a>
        </nav>
        <select class="language-select" aria-label="{esc(spec["language_label"])}" onchange="if (this.value) window.location.href = this.value;">{options}</select>
      </div>
    </header>
    <article class="content-card">
      <p class="eyebrow">Little Nature</p>
      <h1>{esc(spec["models"])}</h1>
      <p class="lead">{esc(description)}</p>
      {category_links(locale)}
      <div class="model-list">
{''.join(cards)}
      </div>
    </article>
  </main>
</body>

</html>
"""


def category_language_select(locale, category):
    slug = CATEGORY_SLUGS[category]
    options = []
    for candidate, label in LANGUAGE_NAMES.items():
        selected = " selected" if candidate == locale else ""
        options.append(f'<option value="../../../{candidate}/models/{slug}/"{selected}>{esc(label)}</option>')
    return "".join(options)


def render_category_page(all_models, locale, category):
    models = [model for model in all_models if model.get("category") == category]
    spec = LOCALES[locale]
    category_label = spec["category_labels"][category]
    title = category_title(locale, category)
    description = category_description(locale, category, len(models))
    slug = CATEGORY_SLUGS[category]
    schema = {
        "@context": "https://schema.org",
        "@graph": [
            {
                "@type": "CollectionPage",
                "name": title,
                "description": description,
                "url": category_url(locale, category),
                "isPartOf": {"@id": f"{SITE}/#website"},
                "mainEntity": {"@id": f"{SITE}/{locale}/models/{slug}/#item-list"},
            },
            {
                "@id": f"{SITE}/{locale}/models/{slug}/#item-list",
                **item_list_schema(models, locale, category_url(locale, category)),
            },
            breadcrumb_schema(locale, [
                (spec["home"], f"{SITE}/{locale}/"),
                (spec["models"], model_index_url(locale)),
                (category_label, category_url(locale, category)),
            ]),
        ],
    }
    options = category_language_select(locale, category)
    return f"""<!DOCTYPE html>
<html lang="{esc(spec['lang'])}">

<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>{esc(title)}</title>
  <meta name="description" content="{esc(description)}">
  <meta name="robots" content="index, follow">
  <meta name="theme-color" content="#0f766e" media="(prefers-color-scheme: light)">
  <meta name="theme-color" content="#10201c" media="(prefers-color-scheme: dark)">
  <link rel="icon" type="image/png" sizes="32x32" href="../../../favicon-32.png">
  <link rel="icon" type="image/png" sizes="64x64" href="../../../favicon-64.png">
  <link rel="apple-touch-icon" sizes="180x180" href="../../../apple-touch-icon.png">
  <link rel="stylesheet" href="../../../style/base.css">
{alternate_links(locale, lambda candidate: category_url(candidate, category))}
  <meta property="og:title" content="{esc(title)}">
  <meta property="og:description" content="{esc(description)}">
  <meta property="og:type" content="website">
  <meta property="og:url" content="{category_url(locale, category)}">
  <meta property="og:site_name" content="Little Nature">
  <meta property="og:image" content="{SITE}/app-icon.png">
  <meta property="og:image:width" content="1024">
  <meta property="og:image:height" content="1024">
  <meta name="twitter:card" content="summary">
  <meta name="twitter:title" content="{esc(title)}">
  <meta name="twitter:description" content="{esc(description)}">
  <meta name="twitter:image" content="{SITE}/app-icon.png">
  <script type="application/ld+json">
{json.dumps(schema, ensure_ascii=False, indent=2)}
  </script>
</head>

<body>
  <main class="site-shell">
    <header class="site-header">
      <a class="brand" href="../../../{locale}/" aria-label="Little Nature">
        <span class="brand-mark">LN</span>
        <span>Little Nature</span>
      </a>
      <div class="header-actions">
        <nav class="nav-links" aria-label="Primary">
          <a href="../../../{locale}/">{esc(spec["home"])}</a>
          <a href="../../../{locale}/models/">{esc(spec["models"])}</a>
          <a href="../../../{locale}/help">{esc(spec["help"])}</a>
          <a href="../../../{locale}/privacy-policy">{esc(spec["privacy"])}</a>
          <a href="{APP_STORE_URL}">{esc(spec["app_store"])}</a>
        </nav>
        <select class="language-select" aria-label="{esc(spec["language_label"])}" onchange="if (this.value) window.location.href = this.value;">{options}</select>
      </div>
    </header>
    <article class="content-card">
      <p class="eyebrow">Little Nature / {esc(spec["models"])}</p>
      <h1>{esc(category_label)}</h1>
      <p class="lead">{esc(description)}</p>
      {category_links(locale, prefix="../../../")}
      <div class="model-list">
{render_model_cards(models, locale, image_prefix="../../../model-images/")}
      </div>
    </article>
  </main>
</body>

</html>
"""


def copy_images(models):
    IMAGE_ROOT.mkdir(exist_ok=True)
    for model in models:
        stem = Path(model["filename"]).stem
        source = THUMBNAIL_ROOT / f"{stem}_preview.jpeg"
        if source.exists():
            shutil.copy2(source, IMAGE_ROOT / source.name)


def generate_sitemap(models):
    alternates = list(LOCALES)
    page_specs = [
        ("", "1.0"),
        ("models/", "0.9"),
        ("help", "0.8"),
        ("privacy-policy", "0.7"),
    ]
    entries = []
    for path_suffix, priority in page_specs:
        for locale in LOCALES:
            loc = f"{SITE}/{locale}/" if not path_suffix else f"{SITE}/{locale}/{path_suffix}"
            links = []
            for alt in alternates:
                href = f"{SITE}/{alt}/" if not path_suffix else f"{SITE}/{alt}/{path_suffix}"
                links.append(f'    <xhtml:link rel="alternate" hreflang="{alt}" href="{href}" />')
            xdefault = f"{SITE}/en-US/" if not path_suffix else f"{SITE}/en-US/{path_suffix}"
            links.append(f'    <xhtml:link rel="alternate" hreflang="x-default" href="{xdefault}" />')
            entries.append((loc, priority, links))
    for category, slug in CATEGORY_SLUGS.items():
        for locale in LOCALES:
            loc = category_url(locale, category)
            links = []
            for alt in alternates:
                links.append(f'    <xhtml:link rel="alternate" hreflang="{alt}" href="{category_url(alt, category)}" />')
            links.append(f'    <xhtml:link rel="alternate" hreflang="x-default" href="{category_url("en-US", category)}" />')
            entries.append((loc, "0.8", links))
    for model in models:
        slug = slug_for(model)
        for locale in LOCALES:
            loc = model_url(locale, slug)
            links = [f'    <xhtml:link rel="alternate" hreflang="{alt}" href="{model_url(alt, slug)}" />' for alt in alternates]
            links.append(f'    <xhtml:link rel="alternate" hreflang="x-default" href="{model_url("en-US", slug)}" />')
            entries.append((loc, "0.6", links))

    body = ['<?xml version="1.0" encoding="UTF-8"?>', '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">']
    for loc, priority, links in entries:
        body.append("  <url>")
        body.append(f"    <loc>{loc}</loc>")
        body.append(f"    <lastmod>{LASTMOD}</lastmod>")
        body.extend(links)
        body.append(f"    <priority>{priority}</priority>")
        body.append("  </url>")
    body.append("</urlset>")
    (ROOT / "sitemap.xml").write_text("\n".join(body) + "\n", encoding="utf-8")


def main():
    models = json.loads(MANIFEST_PATH.read_text(encoding="utf-8"))["models"]
    for locale in LOCALES:
        models_root = ROOT / locale / "models"
        if models_root.exists():
            shutil.rmtree(models_root)
        models_root.mkdir(parents=True, exist_ok=True)
        (models_root / "index.html").write_text(render_model_index(models, locale), encoding="utf-8")
        for category in CATEGORY_SLUGS:
            category_root = models_root / CATEGORY_SLUGS[category]
            category_root.mkdir(parents=True, exist_ok=True)
            (category_root / "index.html").write_text(render_category_page(models, locale, category), encoding="utf-8")
        for model in models:
            slug = slug_for(model)
            target_dir = models_root / slug
            target_dir.mkdir(parents=True, exist_ok=True)
            (target_dir / "index.html").write_text(render_page(model, locale), encoding="utf-8")
    copy_images(models)
    generate_sitemap(models)
    print(f"Generated {len(models) * len(LOCALES)} model pages.")


if __name__ == "__main__":
    main()
