(() => {
  const supportedLanguages = ["en", "zh-Hans", "zh-Hant", "ja", "ko", "de"];

  const languageInfo = {
    en: { label: "English", htmlLang: "en", ogLocale: "en_US" },
    "zh-Hans": { label: "简体中文", htmlLang: "zh-Hans", ogLocale: "zh_CN" },
    "zh-Hant": { label: "繁體中文", htmlLang: "zh-Hant", ogLocale: "zh_TW" },
    ja: { label: "日本語", htmlLang: "ja", ogLocale: "ja_JP" },
    ko: { label: "한국어", htmlLang: "ko", ogLocale: "ko_KR" },
    de: { label: "Deutsch", htmlLang: "de", ogLocale: "de_DE" }
  };

  const common = {
    en: {
      home: "Home",
      help: "Help",
      privacy: "Privacy",
      appStore: "App Store",
      language: "Language",
      brandAria: "Little Nature home"
    },
    "zh-Hans": {
      home: "首页",
      help: "帮助",
      privacy: "隐私",
      appStore: "App Store",
      language: "语言",
      brandAria: "小小自然首页"
    },
    "zh-Hant": {
      home: "首頁",
      help: "說明",
      privacy: "隱私",
      appStore: "App Store",
      language: "語言",
      brandAria: "小小自然首頁"
    },
    ja: {
      home: "ホーム",
      help: "ヘルプ",
      privacy: "プライバシー",
      appStore: "App Store",
      language: "言語",
      brandAria: "小さな自然 ホーム"
    },
    ko: {
      home: "홈",
      help: "도움말",
      privacy: "개인정보",
      appStore: "App Store",
      language: "언어",
      brandAria: "Little Nature 홈"
    },
    de: {
      home: "Start",
      help: "Hilfe",
      privacy: "Datenschutz",
      appStore: "App Store",
      language: "Sprache",
      brandAria: "Little Nature Startseite"
    }
  };

  const pages = {
    home: {
      en: {
        meta: {
          title: "Little Nature - AR 3D Biological Model Field Guide for Apple Devices",
          description: "Little Nature is an AR 3D biological model field guide for iPhone, iPad, and Mac. Browse curated CC0 animal and plant model records, download models on demand, and view supported models in AR.",
          keywords: "Little Nature, AR biology app, 3D biological models, animal models, plant models, Asian biodiversity, ARKit, RealityKit, CC0 models, nature education",
          ogTitle: "Little Nature - AR 3D Biological Model Field Guide",
          ogDescription: "Browse curated CC0-based 3D biological model records, download models on demand, and view supported models in AR.",
          twitterTitle: "Little Nature - AR 3D Biological Model Field Guide",
          twitterDescription: "A calm field guide for CC0-based 3D animal and plant models on Apple devices."
        },
        hero: {
          eyebrow: "AR biological model field guide",
          title: "Explore Asian biodiversity in 3D.",
          lead: "Little Nature helps you browse curated animal and plant model records, download models only when needed, and view supported models in AR on iPhone and iPad.",
          appStore: "View on App Store",
          help: "Read help"
        },
        preview: {
          panelAria: "App feature preview",
          imageAria: "Stylized 3D flower model preview",
          title: "Sakura Cherry Blossom",
          meta: "Plant · 38.8 MB · CC0-based model record",
          chips: ["Search", "Categories", "On-demand downloads"]
        },
        sections: [
          {
            title: "Built for quiet exploration",
            cards: [
              ["Curated model catalog", "Browse Asian animal and plant model records with names, taxonomy, file size, geometry counts, and source links."],
              ["Search and filter", "Find models by Japanese name, English name, Chinese name, or scientific name, then narrow results by category."],
              ["Local content control", "Download models when you need them, review saved content, and clear local files from Download Manager."]
            ]
          },
          {
            title: "About the model sources",
            cards: [
              ["Open model references", "Model records are curated from public sources and are presented with attribution and source links where available."],
              ["CC0-based usage", "The included model resources are based on CC0 licensing for browsing, download management, and AR viewing."],
              ["No account required", "Little Nature does not require registration, login, or a personal profile to browse the catalog."]
            ]
          }
        ],
        footer: "Questions or feedback? Contact support at cameoshell09@gmail.com."
      },
      "zh-Hans": {
        meta: {
          title: "小小自然 - Apple 设备上的 AR 3D 生物模型图鉴",
          description: "小小自然是一款适用于 iPhone、iPad 和 Mac 的 AR 3D 生物模型图鉴。浏览精选 CC0 动植物模型资料，按需下载，并在支持的设备上用 AR 查看。",
          keywords: "小小自然,AR生物应用,3D生物模型,动物模型,植物模型,亚洲生物多样性,ARKit,RealityKit,CC0模型,自然教育",
          ogTitle: "小小自然 - AR 3D 生物模型图鉴",
          ogDescription: "浏览精选 CC0 3D 生物模型资料，按需下载，并在支持的设备上用 AR 查看。",
          twitterTitle: "小小自然 - AR 3D 生物模型图鉴",
          twitterDescription: "一款安静清晰的 CC0 3D 动植物模型图鉴，适用于 Apple 设备。"
        },
        hero: {
          eyebrow: "AR 生物模型图鉴",
          title: "用 3D 探索亚洲生物多样性。",
          lead: "小小自然帮助你浏览精选动植物模型资料，只在需要时下载模型，并在 iPhone 和 iPad 上用 AR 查看支持的模型。",
          appStore: "前往 App Store",
          help: "阅读帮助"
        },
        preview: {
          panelAria: "App 功能预览",
          imageAria: "风格化 3D 花卉模型预览",
          title: "染井吉野樱",
          meta: "植物 · 38.8 MB · 基于 CC0 的模型资料",
          chips: ["搜索", "分类", "按需下载"]
        },
        sections: [
          {
            title: "为安静探索而设计",
            cards: [
              ["精选模型目录", "浏览亚洲动植物模型资料，查看名称、分类、文件大小、几何数量和来源链接。"],
              ["搜索与筛选", "通过日文名、英文名、中文名或学名查找模型，再按分类缩小结果。"],
              ["本地内容控制", "按需下载模型，查看已保存内容，并在下载管理中清理本地文件。"]
            ]
          },
          {
            title: "关于模型来源",
            cards: [
              ["开放模型参考", "模型资料整理自公开来源，并在可用时展示署名和来源链接。"],
              ["基于 CC0 的使用", "内置模型资源基于 CC0 许可，用于浏览、下载管理和 AR 查看。"],
              ["无需账号", "小小自然不要求注册、登录或提供个人资料即可浏览目录。"]
            ]
          }
        ],
        footer: "有问题或反馈？请联系 cameoshell09@gmail.com。"
      },
      "zh-Hant": {
        meta: {
          title: "小小自然 - Apple 裝置上的 AR 3D 生物模型圖鑑",
          description: "小小自然是一款適用於 iPhone、iPad 和 Mac 的 AR 3D 生物模型圖鑑。瀏覽精選 CC0 動植物模型資料，按需下載，並在支援的裝置上用 AR 查看。",
          keywords: "小小自然,AR生物應用,3D生物模型,動物模型,植物模型,亞洲生物多樣性,ARKit,RealityKit,CC0模型,自然教育",
          ogTitle: "小小自然 - AR 3D 生物模型圖鑑",
          ogDescription: "瀏覽精選 CC0 3D 生物模型資料，按需下載，並在支援的裝置上用 AR 查看。",
          twitterTitle: "小小自然 - AR 3D 生物模型圖鑑",
          twitterDescription: "一款安靜清晰的 CC0 3D 動植物模型圖鑑，適用於 Apple 裝置。"
        },
        hero: {
          eyebrow: "AR 生物模型圖鑑",
          title: "用 3D 探索亞洲生物多樣性。",
          lead: "小小自然幫助你瀏覽精選動植物模型資料，只在需要時下載模型，並在 iPhone 和 iPad 上用 AR 查看支援的模型。",
          appStore: "前往 App Store",
          help: "閱讀說明"
        },
        preview: {
          panelAria: "App 功能預覽",
          imageAria: "風格化 3D 花卉模型預覽",
          title: "染井吉野櫻",
          meta: "植物 · 38.8 MB · 基於 CC0 的模型資料",
          chips: ["搜尋", "分類", "按需下載"]
        },
        sections: [
          {
            title: "為安靜探索而設計",
            cards: [
              ["精選模型目錄", "瀏覽亞洲動植物模型資料，查看名稱、分類、檔案大小、幾何數量和來源連結。"],
              ["搜尋與篩選", "透過日文名、英文名、中文名或學名查找模型，再按分類縮小結果。"],
              ["本地內容控制", "按需下載模型，查看已儲存內容，並在下載管理中清理本地檔案。"]
            ]
          },
          {
            title: "關於模型來源",
            cards: [
              ["開放模型參考", "模型資料整理自公開來源，並在可用時展示署名和來源連結。"],
              ["基於 CC0 的使用", "內建模型資源基於 CC0 授權，用於瀏覽、下載管理和 AR 查看。"],
              ["無需帳號", "小小自然不要求註冊、登入或提供個人資料即可瀏覽目錄。"]
            ]
          }
        ],
        footer: "有問題或回饋？請聯絡 cameoshell09@gmail.com。"
      },
      ja: {
        meta: {
          title: "小さな自然 - Appleデバイス向けAR 3D生物モデル図鑑",
          description: "小さな自然は、iPhone、iPad、Macで使えるAR 3D生物モデル図鑑です。CC0ベースの動植物モデル資料を閲覧し、必要なモデルだけをダウンロードしてARで表示できます。",
          keywords: "小さな自然,AR生物アプリ,3D生物モデル,動物モデル,植物モデル,アジアの生物多様性,ARKit,RealityKit,CC0モデル,自然教育",
          ogTitle: "小さな自然 - AR 3D生物モデル図鑑",
          ogDescription: "CC0ベースの3D生物モデル資料を閲覧し、必要なモデルだけをダウンロードしてARで表示できます。",
          twitterTitle: "小さな自然 - AR 3D生物モデル図鑑",
          twitterDescription: "Appleデバイスで使える、CC0ベースの3D動植物モデル図鑑。"
        },
        hero: {
          eyebrow: "AR生物モデル図鑑",
          title: "アジアの生物多様性を3Dで探索。",
          lead: "小さな自然では、厳選された動植物モデル資料を閲覧し、必要なモデルだけをダウンロードして、iPhoneやiPadで対応モデルをAR表示できます。",
          appStore: "App Storeで見る",
          help: "ヘルプを読む"
        },
        preview: {
          panelAria: "アプリ機能プレビュー",
          imageAria: "3D花モデルのプレビュー",
          title: "ソメイヨシノ",
          meta: "植物 · 38.8 MB · CC0ベースのモデル資料",
          chips: ["検索", "カテゴリー", "オンデマンドダウンロード"]
        },
        sections: [
          {
            title: "静かな観察のために",
            cards: [
              ["厳選モデルカタログ", "アジアの動植物モデル資料を、名称、分類、ファイルサイズ、形状数、ソースリンクとともに閲覧できます。"],
              ["検索とフィルター", "日本語名、英語名、中国語名、学名で検索し、カテゴリーで結果を絞り込めます。"],
              ["ローカル内容の管理", "必要なモデルだけをダウンロードし、保存済み内容を確認して、ダウンロード管理から削除できます。"]
            ]
          },
          {
            title: "モデルソースについて",
            cards: [
              ["公開モデル資料", "モデル資料は公開ソースから整理され、可能な場合は帰属表示とソースリンクを掲載しています。"],
              ["CC0ベースの利用", "収録モデルリソースはCC0ライセンスに基づき、閲覧、ダウンロード管理、AR表示に利用されます。"],
              ["アカウント不要", "小さな自然は、カタログ閲覧に登録、ログイン、個人プロフィールを必要としません。"]
            ]
          }
        ],
        footer: "質問やフィードバックは cameoshell09@gmail.com までお問い合わせください。"
      },
      ko: {
        meta: {
          title: "Little Nature - Apple 기기용 AR 3D 생물 모델 도감",
          description: "Little Nature는 iPhone, iPad, Mac에서 사용할 수 있는 AR 3D 생물 모델 도감입니다. 엄선된 CC0 동식물 모델 기록을 탐색하고, 필요할 때 다운로드하며, 지원 모델을 AR로 볼 수 있습니다.",
          keywords: "Little Nature,AR 생물 앱,3D 생물 모델,동물 모델,식물 모델,아시아 생물다양성,ARKit,RealityKit,CC0 모델,자연 교육",
          ogTitle: "Little Nature - AR 3D 생물 모델 도감",
          ogDescription: "CC0 기반 3D 생물 모델 기록을 탐색하고, 필요할 때 다운로드하며, 지원 모델을 AR로 볼 수 있습니다.",
          twitterTitle: "Little Nature - AR 3D 생물 모델 도감",
          twitterDescription: "Apple 기기에서 사용할 수 있는 CC0 기반 3D 동식물 모델 도감입니다."
        },
        hero: {
          eyebrow: "AR 생물 모델 도감",
          title: "아시아 생물다양성을 3D로 탐색하세요.",
          lead: "Little Nature는 엄선된 동물과 식물 모델 기록을 살펴보고, 필요한 모델만 다운로드하며, iPhone과 iPad에서 지원 모델을 AR로 볼 수 있게 해 줍니다.",
          appStore: "App Store에서 보기",
          help: "도움말 읽기"
        },
        preview: {
          panelAria: "앱 기능 미리보기",
          imageAria: "스타일화된 3D 꽃 모델 미리보기",
          title: "Sakura Cherry Blossom",
          meta: "식물 · 38.8 MB · CC0 기반 모델 기록",
          chips: ["검색", "카테고리", "필요할 때 다운로드"]
        },
        sections: [
          {
            title: "차분한 탐색을 위해 설계",
            cards: [
              ["엄선된 모델 카탈로그", "아시아 동식물 모델 기록을 이름, 분류, 파일 크기, 형상 수, 출처 링크와 함께 탐색합니다."],
              ["검색과 필터", "일본어, 영어, 중국어 또는 학명으로 모델을 찾고 카테고리로 결과를 좁힐 수 있습니다."],
              ["로컬 콘텐츠 제어", "필요할 때 모델을 다운로드하고, 저장된 콘텐츠를 확인하며, 다운로드 관리자에서 로컬 파일을 삭제합니다."]
            ]
          },
          {
            title: "모델 출처 정보",
            cards: [
              ["공개 모델 참고 자료", "모델 기록은 공개 출처에서 정리되며 가능한 경우 저작자 표시와 출처 링크가 함께 제공됩니다."],
              ["CC0 기반 사용", "포함된 모델 리소스는 탐색, 다운로드 관리, AR 보기를 위해 CC0 라이선스를 기반으로 사용됩니다."],
              ["계정 불필요", "Little Nature는 카탈로그 탐색에 등록, 로그인 또는 개인 프로필을 요구하지 않습니다."]
            ]
          }
        ],
        footer: "질문이나 의견은 cameoshell09@gmail.com 으로 보내 주세요."
      },
      de: {
        meta: {
          title: "Little Nature - AR-Feldführer für biologische 3D-Modelle auf Apple-Geräten",
          description: "Little Nature ist ein AR-Feldführer für biologische 3D-Modelle auf iPhone, iPad und Mac. Durchsuche kuratierte CC0-Tier- und Pflanzenrecords, lade Modelle bei Bedarf und sieh unterstützte Modelle in AR an.",
          keywords: "Little Nature,AR Biologie App,3D Biologiemodelle,Tiermodelle,Pflanzenmodelle,asiatische Biodiversität,ARKit,RealityKit,CC0 Modelle,Naturbildung",
          ogTitle: "Little Nature - AR-Feldführer für biologische 3D-Modelle",
          ogDescription: "Durchsuche CC0-basierte biologische 3D-Modellrecords, lade Modelle bei Bedarf und sieh unterstützte Modelle in AR an.",
          twitterTitle: "Little Nature - AR-Feldführer für biologische 3D-Modelle",
          twitterDescription: "Ein ruhiger Feldführer für CC0-basierte 3D-Tier- und Pflanzenmodelle auf Apple-Geräten."
        },
        hero: {
          eyebrow: "AR-Feldführer für biologische Modelle",
          title: "Asiatische Biodiversität in 3D erkunden.",
          lead: "Little Nature hilft dir, kuratierte Tier- und Pflanzenrecords zu durchsuchen, Modelle nur bei Bedarf zu laden und unterstützte Modelle auf iPhone und iPad in AR anzusehen.",
          appStore: "Im App Store ansehen",
          help: "Hilfe lesen"
        },
        preview: {
          panelAria: "App-Funktionsvorschau",
          imageAria: "Stilisierte Vorschau eines 3D-Blumenmodells",
          title: "Sakura Cherry Blossom",
          meta: "Pflanze · 38,8 MB · CC0-basierter Modellrecord",
          chips: ["Suche", "Kategorien", "Downloads bei Bedarf"]
        },
        sections: [
          {
            title: "Für ruhiges Erkunden gemacht",
            cards: [
              ["Kuratierter Modellkatalog", "Durchsuche asiatische Tier- und Pflanzenrecords mit Namen, Taxonomie, Dateigröße, Geometriewerten und Quellenlinks."],
              ["Suchen und filtern", "Finde Modelle nach japanischem, englischem, chinesischem oder wissenschaftlichem Namen und grenze Ergebnisse nach Kategorie ein."],
              ["Kontrolle über lokale Inhalte", "Lade Modelle bei Bedarf, prüfe gespeicherte Inhalte und lösche lokale Dateien im Download-Manager."]
            ]
          },
          {
            title: "Über die Modellquellen",
            cards: [
              ["Offene Modellreferenzen", "Modellrecords werden aus öffentlichen Quellen kuratiert und, wenn verfügbar, mit Zuordnung und Quellenlinks dargestellt."],
              ["CC0-basierte Nutzung", "Die enthaltenen Modellressourcen basieren auf CC0-Lizenzierung für Katalogansicht, Downloadverwaltung und AR-Ansicht."],
              ["Kein Konto erforderlich", "Little Nature benötigt keine Registrierung, Anmeldung oder ein persönliches Profil, um den Katalog zu durchsuchen."]
            ]
          }
        ],
        footer: "Fragen oder Feedback? Kontakt: cameoshell09@gmail.com."
      }
    },
    help: {},
    privacy: {}
  };

  pages.help = makeHelpTranslations();
  pages.privacy = makePrivacyTranslations();

  function makeHelpTranslations() {
    return {
      en: {
        meta: {
          title: "Little Nature Help - Search, Download, and View AR 3D Models",
          description: "Learn how to use Little Nature on iPhone, iPad, and Mac, including model search, category filters, on-demand downloads, AR viewing, offline access, and local content management.",
          keywords: "Little Nature help, AR model guide, 3D biological model help, download model, AR viewing, model catalog, Download Manager",
          ogTitle: "Little Nature Help - Search, Download, and View AR 3D Models",
          ogDescription: "Help for using Little Nature, including model search, category filters, downloads, AR viewing, and offline access.",
          twitterTitle: "Little Nature Help - Search, Download, and View AR 3D Models",
          twitterDescription: "Learn how to browse the catalog, download model files, and view supported models in AR."
        },
        eyebrow: "Help and support",
        title: "How to use Little Nature",
        lead: "Little Nature is designed for browsing biological model records, downloading selected model files, and viewing supported models in AR on compatible iPhone and iPad devices.",
        sections: [
          ["Browse the catalog", [["Use categories", "Use All, Plants, Animals, and Special filters to narrow the model catalog."], ["Search by name", "Search supports Japanese names, English names, Chinese names, and scientific names where available."], ["Open details", "Tap or click a model card to view category, file size, face count, vertex count, animation status, taxonomy, and source links."]]],
          ["Download and manage models", [["Download on demand", "Model files are not all installed up front. Download only the models you want to inspect or view in AR."], ["Use Download Manager", "Open Download Manager to see saved models, storage usage, and controls for removing local content."], ["Offline access", "Saved models remain available on your device until you delete them in the app or remove the app."]]],
          ["View models in AR", [["Camera permission", "AR viewing requires camera access so the app can place models in your surroundings."], ["Device support", "AR viewing is available on compatible iPhone and iPad devices. Mac is intended for catalog browsing and local content management."], ["Placement and gestures", "When AR is ready, follow the in-app guidance to place the model, then use gestures to move, scale, or rotate it."]]]
        ],
        footer: "Need help? Contact cameoshell09@gmail.com."
      },
      "zh-Hans": {
        meta: {
          title: "小小自然帮助 - 搜索、下载和查看 AR 3D 模型",
          description: "了解如何在 iPhone、iPad 和 Mac 上使用小小自然，包括模型搜索、分类筛选、按需下载、AR 查看、离线访问和本地内容管理。",
          keywords: "小小自然帮助,AR模型指南,3D生物模型帮助,下载模型,AR查看,模型目录,下载管理",
          ogTitle: "小小自然帮助 - 搜索、下载和查看 AR 3D 模型",
          ogDescription: "小小自然使用帮助，包括模型搜索、分类筛选、下载、AR 查看和离线访问。",
          twitterTitle: "小小自然帮助 - 搜索、下载和查看 AR 3D 模型",
          twitterDescription: "了解如何浏览目录、下载模型文件，并在 AR 中查看支持的模型。"
        },
        eyebrow: "帮助与支持",
        title: "如何使用小小自然",
        lead: "小小自然用于浏览生物模型资料、下载选定的模型文件，并在兼容的 iPhone 和 iPad 设备上用 AR 查看支持的模型。",
        sections: [
          ["浏览目录", [["使用分类", "使用全部、植物、动物和特别筛选项来缩小模型目录范围。"], ["按名称搜索", "搜索支持日文名、英文名、中文名，以及可用的学名。"], ["打开详情", "点击模型卡片可查看分类、文件大小、面数、顶点数、动画状态、分类信息和来源链接。"]]],
          ["下载和管理模型", [["按需下载", "模型文件不会全部预装。只下载你想查看或用于 AR 的模型。"], ["使用下载管理", "打开下载管理可查看已保存模型、存储占用，以及删除本地内容的控制项。"], ["离线访问", "已保存的模型会保留在设备上，直到你在 App 中删除或移除 App。"]]],
          ["在 AR 中查看模型", [["相机权限", "AR 查看需要相机访问权限，以便 App 在你的环境中放置模型。"], ["设备支持", "AR 查看可在兼容的 iPhone 和 iPad 设备上使用。Mac 主要用于目录浏览和本地内容管理。"], ["放置和手势", "AR 准备就绪后，按照 App 内指引放置模型，然后使用手势移动、缩放或旋转。"]]]
        ],
        footer: "需要帮助？请联系 cameoshell09@gmail.com。"
      },
      "zh-Hant": {
        meta: {
          title: "小小自然說明 - 搜尋、下載和查看 AR 3D 模型",
          description: "了解如何在 iPhone、iPad 和 Mac 上使用小小自然，包括模型搜尋、分類篩選、按需下載、AR 查看、離線存取和本地內容管理。",
          keywords: "小小自然說明,AR模型指南,3D生物模型說明,下載模型,AR查看,模型目錄,下載管理",
          ogTitle: "小小自然說明 - 搜尋、下載和查看 AR 3D 模型",
          ogDescription: "小小自然使用說明，包括模型搜尋、分類篩選、下載、AR 查看和離線存取。",
          twitterTitle: "小小自然說明 - 搜尋、下載和查看 AR 3D 模型",
          twitterDescription: "了解如何瀏覽目錄、下載模型檔案，並在 AR 中查看支援的模型。"
        },
        eyebrow: "說明與支援",
        title: "如何使用小小自然",
        lead: "小小自然用於瀏覽生物模型資料、下載選定的模型檔案，並在相容的 iPhone 和 iPad 裝置上用 AR 查看支援的模型。",
        sections: [
          ["瀏覽目錄", [["使用分類", "使用全部、植物、動物和特別篩選項來縮小模型目錄範圍。"], ["按名稱搜尋", "搜尋支援日文名、英文名、中文名，以及可用的學名。"], ["開啟詳情", "點擊模型卡片可查看分類、檔案大小、面數、頂點數、動畫狀態、分類資訊和來源連結。"]]],
          ["下載和管理模型", [["按需下載", "模型檔案不會全部預先安裝。只下載你想查看或用於 AR 的模型。"], ["使用下載管理", "開啟下載管理可查看已儲存模型、儲存空間用量，以及刪除本地內容的控制項。"], ["離線存取", "已儲存的模型會保留在裝置上，直到你在 App 中刪除或移除 App。"]]],
          ["在 AR 中查看模型", [["相機權限", "AR 查看需要相機存取權限，以便 App 在你的環境中放置模型。"], ["裝置支援", "AR 查看可在相容的 iPhone 和 iPad 裝置上使用。Mac 主要用於目錄瀏覽和本地內容管理。"], ["放置和手勢", "AR 準備就緒後，按照 App 內指引放置模型，然後使用手勢移動、縮放或旋轉。"]]]
        ],
        footer: "需要協助？請聯絡 cameoshell09@gmail.com。"
      },
      ja: {
        meta: {
          title: "小さな自然 ヘルプ - AR 3Dモデルの検索、ダウンロード、表示",
          description: "iPhone、iPad、Macで小さな自然を使う方法を確認できます。モデル検索、カテゴリー、オンデマンドダウンロード、AR表示、オフライン利用、ローカル管理に対応しています。",
          keywords: "小さな自然 ヘルプ,ARモデルガイド,3D生物モデル ヘルプ,モデルダウンロード,AR表示,モデルカタログ,ダウンロード管理",
          ogTitle: "小さな自然 ヘルプ - AR 3Dモデルの検索、ダウンロード、表示",
          ogDescription: "モデル検索、カテゴリー、ダウンロード、AR表示、オフライン利用を含む小さな自然のヘルプ。",
          twitterTitle: "小さな自然 ヘルプ - AR 3Dモデルの検索、ダウンロード、表示",
          twitterDescription: "カタログの閲覧、モデルファイルのダウンロード、対応モデルのAR表示方法を確認できます。"
        },
        eyebrow: "ヘルプとサポート",
        title: "小さな自然の使い方",
        lead: "小さな自然は、生物モデル資料の閲覧、選択したモデルファイルのダウンロード、対応するiPhoneやiPadでのAR表示のために設計されています。",
        sections: [
          ["カタログを見る", [["カテゴリーを使う", "すべて、植物、動物、特別フィルターでモデルカタログを絞り込めます。"], ["名前で検索", "日本語名、英語名、中国語名、利用可能な学名で検索できます。"], ["詳細を開く", "モデルカードをタップまたはクリックすると、カテゴリー、ファイルサイズ、面数、頂点数、アニメーション、分類、ソースリンクを確認できます。"]]],
          ["モデルをダウンロードして管理", [["必要なものだけダウンロード", "モデルファイルは最初からすべてインストールされません。確認したいモデルやARで使いたいモデルだけをダウンロードします。"], ["ダウンロード管理を使う", "ダウンロード管理で保存済みモデル、ストレージ使用量、ローカル内容の削除操作を確認できます。"], ["オフライン利用", "保存済みモデルは、アプリ内で削除するかアプリを削除するまでデバイス上に残ります。"]]],
          ["ARでモデルを見る", [["カメラ権限", "AR表示には、周囲にモデルを配置するためのカメラアクセスが必要です。"], ["対応デバイス", "AR表示は対応するiPhoneとiPadで利用できます。Macはカタログ閲覧とローカル管理向けです。"], ["配置とジェスチャー", "ARの準備ができたら、アプリ内の案内に従ってモデルを配置し、ジェスチャーで移動、拡大縮小、回転できます。"]]]
        ],
        footer: "サポートが必要な場合は cameoshell09@gmail.com までご連絡ください。"
      },
      ko: {
        meta: {
          title: "Little Nature 도움말 - AR 3D 모델 검색, 다운로드, 보기",
          description: "iPhone, iPad, Mac에서 Little Nature를 사용하는 방법을 알아보세요. 모델 검색, 카테고리 필터, 필요할 때 다운로드, AR 보기, 오프라인 접근, 로컬 콘텐츠 관리를 포함합니다.",
          keywords: "Little Nature 도움말,AR 모델 가이드,3D 생물 모델 도움말,모델 다운로드,AR 보기,모델 카탈로그,다운로드 관리자",
          ogTitle: "Little Nature 도움말 - AR 3D 모델 검색, 다운로드, 보기",
          ogDescription: "모델 검색, 카테고리 필터, 다운로드, AR 보기, 오프라인 접근을 포함한 Little Nature 도움말입니다.",
          twitterTitle: "Little Nature 도움말 - AR 3D 모델 검색, 다운로드, 보기",
          twitterDescription: "카탈로그 탐색, 모델 파일 다운로드, 지원 모델의 AR 보기 방법을 알아보세요."
        },
        eyebrow: "도움말 및 지원",
        title: "Little Nature 사용 방법",
        lead: "Little Nature는 생물 모델 기록을 탐색하고 선택한 모델 파일을 다운로드하며, 호환되는 iPhone과 iPad에서 지원 모델을 AR로 볼 수 있도록 설계되었습니다.",
        sections: [
          ["카탈로그 탐색", [["카테고리 사용", "전체, 식물, 동물, 특별 필터를 사용해 모델 카탈로그를 좁힐 수 있습니다."], ["이름으로 검색", "일본어 이름, 영어 이름, 중국어 이름, 사용 가능한 학명을 검색할 수 있습니다."], ["상세 정보 열기", "모델 카드를 탭하거나 클릭하면 카테고리, 파일 크기, 면 수, 정점 수, 애니메이션 상태, 분류, 출처 링크를 볼 수 있습니다."]]],
          ["모델 다운로드 및 관리", [["필요할 때 다운로드", "모델 파일은 처음부터 모두 설치되지 않습니다. 확인하거나 AR로 볼 모델만 다운로드하세요."], ["다운로드 관리자 사용", "다운로드 관리자에서 저장된 모델, 저장 공간 사용량, 로컬 콘텐츠 삭제 컨트롤을 확인할 수 있습니다."], ["오프라인 접근", "저장된 모델은 앱에서 삭제하거나 앱을 제거할 때까지 기기에 남아 있습니다."]]],
          ["AR로 모델 보기", [["카메라 권한", "AR 보기는 앱이 주변 공간에 모델을 배치할 수 있도록 카메라 접근 권한이 필요합니다."], ["기기 지원", "AR 보기는 호환되는 iPhone과 iPad에서 사용할 수 있습니다. Mac은 카탈로그 탐색과 로컬 콘텐츠 관리를 위한 플랫폼입니다."], ["배치와 제스처", "AR이 준비되면 앱 안내에 따라 모델을 배치한 뒤 제스처로 이동, 크기 조절, 회전할 수 있습니다."]]]
        ],
        footer: "도움이 필요하면 cameoshell09@gmail.com 으로 문의하세요."
      },
      de: {
        meta: {
          title: "Little Nature Hilfe - AR-3D-Modelle suchen, laden und ansehen",
          description: "Lerne, wie du Little Nature auf iPhone, iPad und Mac nutzt: Modellsuche, Kategoriefilter, Downloads bei Bedarf, AR-Ansicht, Offline-Zugriff und lokale Inhaltsverwaltung.",
          keywords: "Little Nature Hilfe,AR Modellführer,3D Biologiemodell Hilfe,Modell laden,AR Ansicht,Modellkatalog,Download Manager",
          ogTitle: "Little Nature Hilfe - AR-3D-Modelle suchen, laden und ansehen",
          ogDescription: "Hilfe zu Little Nature mit Modellsuche, Kategorien, Downloads, AR-Ansicht und Offline-Zugriff.",
          twitterTitle: "Little Nature Hilfe - AR-3D-Modelle suchen, laden und ansehen",
          twitterDescription: "Erfahre, wie du den Katalog durchsuchst, Modelldateien lädst und unterstützte Modelle in AR ansiehst."
        },
        eyebrow: "Hilfe und Support",
        title: "So verwendest du Little Nature",
        lead: "Little Nature ist für das Durchsuchen biologischer Modellrecords, das Laden ausgewählter Modelldateien und die AR-Ansicht unterstützter Modelle auf kompatiblen iPhone- und iPad-Geräten gedacht.",
        sections: [
          ["Katalog durchsuchen", [["Kategorien verwenden", "Nutze Alle, Pflanzen, Tiere und Spezial, um den Modellkatalog einzugrenzen."], ["Nach Namen suchen", "Die Suche unterstützt japanische, englische, chinesische und, wenn verfügbar, wissenschaftliche Namen."], ["Details öffnen", "Tippe oder klicke auf eine Modellkarte, um Kategorie, Dateigröße, Flächen, Eckpunkte, Animationsstatus, Taxonomie und Quellenlinks zu sehen."]]],
          ["Modelle laden und verwalten", [["Bei Bedarf laden", "Modelldateien sind nicht vollständig vorinstalliert. Lade nur die Modelle, die du prüfen oder in AR ansehen möchtest."], ["Download-Manager verwenden", "Im Download-Manager siehst du gespeicherte Modelle, Speicherverbrauch und Steuerelemente zum Entfernen lokaler Inhalte."], ["Offline-Zugriff", "Gespeicherte Modelle bleiben auf deinem Gerät, bis du sie in der App löschst oder die App entfernst."]]],
          ["Modelle in AR ansehen", [["Kameraberechtigung", "Für die AR-Ansicht benötigt die App Kamerazugriff, um Modelle in deiner Umgebung zu platzieren."], ["Geräteunterstützung", "AR ist auf kompatiblen iPhone- und iPad-Geräten verfügbar. Mac ist für Katalogansicht und lokale Inhaltsverwaltung gedacht."], ["Platzierung und Gesten", "Wenn AR bereit ist, folge der Anleitung in der App, platziere das Modell und nutze Gesten zum Bewegen, Skalieren oder Drehen."]]]
        ],
        footer: "Brauchst du Hilfe? Kontakt: cameoshell09@gmail.com."
      }
    };
  }

  function makePrivacyTranslations() {
    return {
      en: {
        meta: {
          title: "Little Nature Privacy Policy - Camera, Downloads, and Local Storage",
          description: "Little Nature privacy policy: no account required, no personal profile collection, camera access only for AR viewing, local storage for downloaded model files, and no advertising SDKs.",
          keywords: "Little Nature privacy policy, AR app privacy, camera permission, local storage, downloaded model files, no account, no advertising SDK",
          ogTitle: "Little Nature Privacy Policy",
          ogDescription: "Little Nature does not require an account and does not upload your photos, camera feed, or downloaded model files.",
          twitterTitle: "Little Nature Privacy Policy",
          twitterDescription: "No account required, camera only for AR, downloaded model files stay local, and no advertising SDKs."
        },
        eyebrow: "Little Nature",
        title: "Privacy Policy",
        effective: "Effective date: May 6, 2026",
        lead: "Little Nature is designed as a local browsing and AR viewing app for biological model records. The app does not require an account and does not upload your photos, camera feed, or downloaded model files.",
        sections: [
          ["Privacy at a glance", [["No account required", "You do not need to register, log in, or provide a personal profile to use the app."], ["Camera used only for AR", "Camera access is requested only when you use AR viewing features on supported iPhone or iPad devices."], ["Downloaded models stay local", "Model files you download are stored on your device so they can be opened later, including offline."], ["No advertising SDKs", "The app does not include third-party advertising SDKs and does not sell personal information."]]],
          ["Information the app accesses", [["Camera", "The camera is used to detect your surroundings and place AR models. Camera frames are not uploaded by Little Nature."], ["Local storage", "The app uses local storage for downloaded model files, language preferences, onboarding state, and download status."], ["Network access", "Network access is used to retrieve the model manifest and download model files from the configured content delivery endpoint."]]],
          ["Data retention and deletion", [["Downloaded model files", "Downloaded model files remain on your device until you delete them in Download Manager or remove the app."], ["Support requests", "If you contact support by email, your message will be used only to respond to your request."], ["Changes", "If this policy changes, the updated version will be posted on this page with a revised effective date."]]]
        ],
        footer: "For privacy questions, contact cameoshell09@gmail.com."
      },
      "zh-Hans": {
        meta: {
          title: "小小自然隐私政策 - 相机、下载和本地存储",
          description: "小小自然隐私政策：无需账号，不收集个人资料；相机仅用于 AR 查看；下载的模型文件保存在本地；不包含广告 SDK。",
          keywords: "小小自然隐私政策,AR应用隐私,相机权限,本地存储,下载模型文件,无需账号,无广告SDK",
          ogTitle: "小小自然隐私政策",
          ogDescription: "小小自然不需要账号，也不会上传你的照片、相机画面或下载的模型文件。",
          twitterTitle: "小小自然隐私政策",
          twitterDescription: "无需账号，相机仅用于 AR，下载模型保存在本地，不包含广告 SDK。"
        },
        eyebrow: "小小自然",
        title: "隐私政策",
        effective: "生效日期：2026 年 5 月 6 日",
        lead: "小小自然是一款用于本地浏览和 AR 查看生物模型资料的 App。App 不需要账号，也不会上传你的照片、相机画面或下载的模型文件。",
        sections: [
          ["隐私概览", [["无需账号", "你无需注册、登录或提供个人资料即可使用 App。"], ["相机仅用于 AR", "只有当你在支持的 iPhone 或 iPad 设备上使用 AR 查看功能时，App 才会请求相机访问权限。"], ["下载模型保存在本地", "你下载的模型文件会存储在设备上，方便之后打开，包括离线使用。"], ["无广告 SDK", "App 不包含第三方广告 SDK，也不会出售个人信息。"]]],
          ["App 访问的信息", [["相机", "相机用于检测周围环境并放置 AR 模型。小小自然不会上传相机画面。"], ["本地存储", "App 使用本地存储保存下载的模型文件、语言偏好、新手引导状态和下载状态。"], ["网络访问", "网络访问用于获取模型清单，并从配置的内容分发端点下载模型文件。"]]],
          ["数据保留和删除", [["已下载模型文件", "已下载模型文件会保留在设备上，直到你在下载管理中删除或移除 App。"], ["支持请求", "如果你通过电子邮件联系支持，你的邮件只会用于回复你的请求。"], ["变更", "如果本政策发生变化，更新版本会发布在本页面，并标明新的生效日期。"]]]
        ],
        footer: "如有隐私问题，请联系 cameoshell09@gmail.com。"
      },
      "zh-Hant": {
        meta: {
          title: "小小自然隱私政策 - 相機、下載和本地儲存",
          description: "小小自然隱私政策：無需帳號，不收集個人資料；相機僅用於 AR 查看；下載的模型檔案保存在本地；不包含廣告 SDK。",
          keywords: "小小自然隱私政策,AR應用隱私,相機權限,本地儲存,下載模型檔案,無需帳號,無廣告SDK",
          ogTitle: "小小自然隱私政策",
          ogDescription: "小小自然不需要帳號，也不會上傳你的照片、相機畫面或下載的模型檔案。",
          twitterTitle: "小小自然隱私政策",
          twitterDescription: "無需帳號，相機僅用於 AR，下載模型保存在本地，不包含廣告 SDK。"
        },
        eyebrow: "小小自然",
        title: "隱私政策",
        effective: "生效日期：2026 年 5 月 6 日",
        lead: "小小自然是一款用於本地瀏覽和 AR 查看生物模型資料的 App。App 不需要帳號，也不會上傳你的照片、相機畫面或下載的模型檔案。",
        sections: [
          ["隱私概覽", [["無需帳號", "你無需註冊、登入或提供個人資料即可使用 App。"], ["相機僅用於 AR", "只有當你在支援的 iPhone 或 iPad 裝置上使用 AR 查看功能時，App 才會請求相機存取權限。"], ["下載模型保存在本地", "你下載的模型檔案會儲存在裝置上，方便之後開啟，包括離線使用。"], ["無廣告 SDK", "App 不包含第三方廣告 SDK，也不會出售個人資訊。"]]],
          ["App 存取的資訊", [["相機", "相機用於偵測周圍環境並放置 AR 模型。小小自然不會上傳相機畫面。"], ["本地儲存", "App 使用本地儲存保存下載的模型檔案、語言偏好、新手引導狀態和下載狀態。"], ["網路存取", "網路存取用於取得模型清單，並從設定的內容分發端點下載模型檔案。"]]],
          ["資料保留和刪除", [["已下載模型檔案", "已下載模型檔案會保留在裝置上，直到你在下載管理中刪除或移除 App。"], ["支援請求", "如果你透過電子郵件聯絡支援，你的郵件只會用於回覆你的請求。"], ["變更", "如果本政策發生變化，更新版本會發布在本頁面，並標明新的生效日期。"]]]
        ],
        footer: "如有隱私問題，請聯絡 cameoshell09@gmail.com。"
      },
      ja: {
        meta: {
          title: "小さな自然 プライバシーポリシー - カメラ、ダウンロード、ローカル保存",
          description: "小さな自然のプライバシーポリシー。アカウント不要、個人プロフィール収集なし、カメラはAR表示時のみ使用、ダウンロードモデルはローカル保存、広告SDKなし。",
          keywords: "小さな自然 プライバシーポリシー,ARアプリ プライバシー,カメラ権限,ローカル保存,ダウンロードモデル,アカウント不要,広告SDKなし",
          ogTitle: "小さな自然 プライバシーポリシー",
          ogDescription: "小さな自然はアカウントを必要とせず、写真、カメラ映像、ダウンロード済みモデルファイルをアップロードしません。",
          twitterTitle: "小さな自然 プライバシーポリシー",
          twitterDescription: "アカウント不要、カメラはARのみ、ダウンロード済みモデルはローカル保存、広告SDKなし。"
        },
        eyebrow: "小さな自然",
        title: "プライバシーポリシー",
        effective: "施行日: 2026年5月6日",
        lead: "小さな自然は、生物モデル資料をローカルで閲覧し、AR表示するためのアプリです。アカウントは不要で、写真、カメラ映像、ダウンロード済みモデルファイルをアップロードしません。",
        sections: [
          ["プライバシー概要", [["アカウント不要", "アプリの利用に登録、ログイン、個人プロフィールの提供は必要ありません。"], ["カメラはARのみに使用", "対応するiPhoneまたはiPadでAR表示機能を使う場合のみ、カメラアクセスを要求します。"], ["ダウンロードモデルはローカル保存", "ダウンロードしたモデルファイルはデバイス上に保存され、オフラインを含め後で開くことができます。"], ["広告SDKなし", "アプリには第三者広告SDKが含まれず、個人情報を販売しません。"]]],
          ["アプリがアクセスする情報", [["カメラ", "カメラは周囲を検出し、ARモデルを配置するために使用されます。小さな自然はカメラ映像をアップロードしません。"], ["ローカル保存", "アプリはダウンロード済みモデルファイル、言語設定、オンボーディング状態、ダウンロード状態をローカルに保存します。"], ["ネットワークアクセス", "ネットワークアクセスは、モデルマニフェストの取得と、設定された配信エンドポイントからのモデルファイルダウンロードに使用されます。"]]],
          ["データの保持と削除", [["ダウンロード済みモデルファイル", "ダウンロード済みモデルファイルは、ダウンロード管理で削除するかアプリを削除するまでデバイス上に残ります。"], ["サポート依頼", "メールでサポートに連絡した場合、その内容は問い合わせへの返信にのみ使用されます。"], ["変更", "本ポリシーが変更された場合、更新版は改定された施行日とともにこのページに掲載されます。"]]]
        ],
        footer: "プライバシーに関するお問い合わせは cameoshell09@gmail.com までご連絡ください。"
      },
      ko: {
        meta: {
          title: "Little Nature 개인정보 처리방침 - 카메라, 다운로드, 로컬 저장소",
          description: "Little Nature 개인정보 처리방침: 계정 불필요, 개인 프로필 수집 없음, 카메라는 AR 보기에서만 사용, 다운로드한 모델 파일은 로컬 저장, 광고 SDK 없음.",
          keywords: "Little Nature 개인정보 처리방침,AR 앱 개인정보,카메라 권한,로컬 저장소,다운로드 모델 파일,계정 불필요,광고 SDK 없음",
          ogTitle: "Little Nature 개인정보 처리방침",
          ogDescription: "Little Nature는 계정을 요구하지 않으며 사진, 카메라 피드 또는 다운로드한 모델 파일을 업로드하지 않습니다.",
          twitterTitle: "Little Nature 개인정보 처리방침",
          twitterDescription: "계정 불필요, 카메라는 AR에만 사용, 다운로드한 모델은 로컬 저장, 광고 SDK 없음."
        },
        eyebrow: "Little Nature",
        title: "개인정보 처리방침",
        effective: "시행일: 2026년 5월 6일",
        lead: "Little Nature는 생물 모델 기록을 로컬에서 탐색하고 AR로 보기 위한 앱입니다. 계정이 필요 없으며 사진, 카메라 피드 또는 다운로드한 모델 파일을 업로드하지 않습니다.",
        sections: [
          ["개인정보 한눈에 보기", [["계정 불필요", "앱을 사용하기 위해 등록, 로그인 또는 개인 프로필 제공이 필요하지 않습니다."], ["카메라는 AR에만 사용", "지원되는 iPhone 또는 iPad에서 AR 보기 기능을 사용할 때만 카메라 접근 권한을 요청합니다."], ["다운로드한 모델은 로컬에 유지", "다운로드한 모델 파일은 나중에 열 수 있도록 기기에 저장되며 오프라인에서도 사용할 수 있습니다."], ["광고 SDK 없음", "앱에는 타사 광고 SDK가 포함되어 있지 않으며 개인 정보를 판매하지 않습니다."]]],
          ["앱이 접근하는 정보", [["카메라", "카메라는 주변 환경을 감지하고 AR 모델을 배치하는 데 사용됩니다. Little Nature는 카메라 프레임을 업로드하지 않습니다."], ["로컬 저장소", "앱은 다운로드한 모델 파일, 언어 설정, 온보딩 상태, 다운로드 상태를 로컬 저장소에 저장합니다."], ["네트워크 접근", "네트워크 접근은 모델 매니페스트를 가져오고 구성된 콘텐츠 배포 엔드포인트에서 모델 파일을 다운로드하는 데 사용됩니다."]]],
          ["데이터 보관 및 삭제", [["다운로드한 모델 파일", "다운로드한 모델 파일은 다운로드 관리자에서 삭제하거나 앱을 제거할 때까지 기기에 남아 있습니다."], ["지원 요청", "이메일로 지원팀에 연락하면 메시지는 요청에 응답하는 데만 사용됩니다."], ["변경 사항", "이 정책이 변경되면 개정된 시행일과 함께 이 페이지에 업데이트된 버전이 게시됩니다."]]]
        ],
        footer: "개인정보 관련 문의는 cameoshell09@gmail.com 으로 보내 주세요."
      },
      de: {
        meta: {
          title: "Little Nature Datenschutz - Kamera, Downloads und lokaler Speicher",
          description: "Datenschutz bei Little Nature: kein Konto erforderlich, keine Profil-Erfassung, Kamera nur für AR, lokale Speicherung geladener Modelldateien und keine Werbe-SDKs.",
          keywords: "Little Nature Datenschutz,AR App Datenschutz,Kameraberechtigung,lokaler Speicher,geladene Modelldateien,kein Konto,keine Werbe SDKs",
          ogTitle: "Little Nature Datenschutz",
          ogDescription: "Little Nature benötigt kein Konto und lädt keine Fotos, Kamerabilder oder geladenen Modelldateien hoch.",
          twitterTitle: "Little Nature Datenschutz",
          twitterDescription: "Kein Konto erforderlich, Kamera nur für AR, geladene Modelle bleiben lokal, keine Werbe-SDKs."
        },
        eyebrow: "Little Nature",
        title: "Datenschutz",
        effective: "Gültig ab: 6. Mai 2026",
        lead: "Little Nature ist als App zum lokalen Durchsuchen und Anzeigen biologischer Modellrecords in AR gedacht. Die App benötigt kein Konto und lädt keine Fotos, Kamerabilder oder geladenen Modelldateien hoch.",
        sections: [
          ["Datenschutz auf einen Blick", [["Kein Konto erforderlich", "Du musst dich nicht registrieren, anmelden oder ein persönliches Profil angeben, um die App zu verwenden."], ["Kamera nur für AR", "Kamerazugriff wird nur angefordert, wenn du AR-Funktionen auf unterstützten iPhone- oder iPad-Geräten nutzt."], ["Geladene Modelle bleiben lokal", "Geladene Modelldateien werden auf deinem Gerät gespeichert, damit sie später auch offline geöffnet werden können."], ["Keine Werbe-SDKs", "Die App enthält keine Werbe-SDKs von Drittanbietern und verkauft keine persönlichen Informationen."]]],
          ["Informationen, auf die die App zugreift", [["Kamera", "Die Kamera wird verwendet, um deine Umgebung zu erkennen und AR-Modelle zu platzieren. Little Nature lädt keine Kamerabilder hoch."], ["Lokaler Speicher", "Die App nutzt lokalen Speicher für geladene Modelldateien, Spracheinstellungen, Onboarding-Status und Downloadstatus."], ["Netzwerkzugriff", "Netzwerkzugriff wird verwendet, um das Modellmanifest abzurufen und Modelldateien vom konfigurierten Auslieferungsendpunkt zu laden."]]],
          ["Aufbewahrung und Löschung", [["Geladene Modelldateien", "Geladene Modelldateien bleiben auf deinem Gerät, bis du sie im Download-Manager löschst oder die App entfernst."], ["Supportanfragen", "Wenn du den Support per E-Mail kontaktierst, wird deine Nachricht nur zur Beantwortung deiner Anfrage verwendet."], ["Änderungen", "Wenn sich diese Richtlinie ändert, wird die aktualisierte Version mit neuem Gültigkeitsdatum auf dieser Seite veröffentlicht."]]]
        ],
        footer: "Bei Datenschutzfragen: cameoshell09@gmail.com."
      }
    };
  }

  function setText(selector, value) {
    const element = document.querySelector(selector);
    if (element && value !== undefined) element.textContent = value;
  }

  function setAttr(selector, name, value) {
    const element = document.querySelector(selector);
    if (element && value !== undefined) element.setAttribute(name, value);
  }

  function setMeta(selector, value) {
    setAttr(selector, "content", value);
  }

  function setTextList(elements, values, itemSelector) {
    elements.forEach((element, index) => {
      const value = values[index];
      if (!value) return;
      if (Array.isArray(value)) {
        setChildText(element, itemSelector[0], value[0]);
        setChildText(element, itemSelector[1], value[1]);
      } else {
        element.textContent = value;
      }
    });
  }

  function setChildText(parent, selector, value) {
    const element = parent.querySelector(selector);
    if (element && value !== undefined) element.textContent = value;
  }

  function applyCommon(language) {
    const labels = common[language] || common.en;
    setAttr(".brand", "aria-label", labels.brandAria);
    document.querySelectorAll(".nav-links a").forEach((link) => {
      const href = link.getAttribute("href") || "";
      if (href.includes("index.html")) link.textContent = labels.home;
      if (href.includes("help.html")) link.textContent = labels.help;
      if (href.includes("privacy-policy.html")) link.textContent = labels.privacy;
      if (href.includes("apps.apple.com")) link.textContent = labels.appStore;
    });
    setAttr("[data-language-select]", "aria-label", labels.language);
  }

  function applyMeta(page, language) {
    const data = pages[page][language] || pages[page].en;
    const meta = data.meta;
    const info = languageInfo[language] || languageInfo.en;
    const pageUrl = localizedUrl(page, language);
    document.title = meta.title;
    document.documentElement.lang = info.htmlLang;
    setAttr('link[rel="canonical"]', "href", pageUrl);
    setMeta('meta[name="description"]', meta.description);
    setMeta('meta[name="keywords"]', meta.keywords);
    setMeta('meta[property="og:title"]', meta.ogTitle);
    setMeta('meta[property="og:description"]', meta.ogDescription);
    setMeta('meta[property="og:url"]', pageUrl);
    setMeta('meta[property="og:locale"]', info.ogLocale);
    setMeta('meta[property="og:image:alt"]', `${meta.ogTitle} social preview`);
    setMeta('meta[name="twitter:title"]', meta.twitterTitle);
    setMeta('meta[name="twitter:description"]', meta.twitterDescription);
    setMeta('meta[name="twitter:image:alt"]', `${meta.twitterTitle} social preview`);
  }

  function localizedUrl(page, language) {
    const paths = {
      home: "",
      help: "help.html",
      privacy: "privacy-policy.html"
    };
    const path = paths[page] || "";
    const base = `https://ar-asia.luopeike.com/${path}`;
    return language === "en" ? base : `${base}?lang=${encodeURIComponent(language)}`;
  }

  function applyHome(language) {
    const data = pages.home[language] || pages.home.en;
    applyMeta("home", language);
    setText(".hero-copy .eyebrow", data.hero.eyebrow);
    setText(".hero-copy h1", data.hero.title);
    setText(".hero-copy .lead", data.hero.lead);
    setText(".cta-row .button:not(.secondary)", data.hero.appStore);
    setText(".cta-row .button.secondary", data.hero.help);
    setAttr(".preview-panel", "aria-label", data.preview.panelAria);
    setAttr(".specimen-image", "aria-label", data.preview.imageAria);
    setText(".specimen-title", data.preview.title);
    setText(".specimen-meta", data.preview.meta);
    setTextList(document.querySelectorAll(".chip-row .chip"), data.preview.chips);
    document.querySelectorAll(".section").forEach((section, sectionIndex) => {
      const sectionData = data.sections[sectionIndex];
      if (!sectionData) return;
      setChildText(section, "h2", sectionData.title);
      setTextList(section.querySelectorAll(".feature-card"), sectionData.cards, ["h3", "p"]);
    });
    setText(".footer", data.footer);
    updateSchema(homeSchema(language, data));
  }

  function applyHelp(language) {
    const data = pages.help[language] || pages.help.en;
    applyMeta("help", language);
    setText(".content-card > .eyebrow", data.eyebrow);
    setText(".content-card > h1", data.title);
    setText(".content-card > .lead", data.lead);
    document.querySelectorAll(".section").forEach((section, sectionIndex) => {
      const sectionData = data.sections[sectionIndex];
      if (!sectionData) return;
      setChildText(section, "h2", sectionData[0]);
      setTextList(section.querySelectorAll(".step"), sectionData[1], ["h3", "p"]);
    });
    setText(".footer", data.footer);
    updateSchema(helpSchema(language, data));
  }

  function applyPrivacy(language) {
    const data = pages.privacy[language] || pages.privacy.en;
    applyMeta("privacy", language);
    setText(".content-card > .eyebrow", data.eyebrow);
    setText(".content-card > h1", data.title);
    setText(".policy-meta", data.effective);
    setText(".content-card > .lead", data.lead);
    document.querySelectorAll(".section").forEach((section, sectionIndex) => {
      const sectionData = data.sections[sectionIndex];
      if (!sectionData) return;
      setChildText(section, "h2", sectionData[0]);
      setTextList(section.querySelectorAll(".policy-item"), sectionData[1], ["h3", "p"]);
    });
    setText(".footer", data.footer);
    updateSchema(privacySchema(language, data));
  }

  function updateSchema(schema) {
    const script = document.querySelector('script[type="application/ld+json"]');
    if (script) script.textContent = JSON.stringify(schema, null, 2);
  }

  function homeSchema(language, data) {
    const lang = (languageInfo[language] || languageInfo.en).htmlLang;
    return {
      "@context": "https://schema.org",
      "@graph": [
        organizationNode(),
        websiteNode(lang, data.meta.ogTitle.split(" - ")[0]),
        {
          "@type": "SoftwareApplication",
          "@id": "https://ar-asia.luopeike.com/#app",
          "name": "Little Nature",
          "alternateName": "小小自然",
          "description": data.meta.description,
          "url": "https://ar-asia.luopeike.com/",
          "downloadUrl": "https://apps.apple.com/app/id6766551832",
          "image": "https://ar-asia.luopeike.com/og-image.png",
          "mainEntityOfPage": {
            "@id": "https://ar-asia.luopeike.com/#website"
          },
          "publisher": {
            "@id": "https://ar-asia.luopeike.com/#organization"
          },
          "sameAs": [
            "https://apps.apple.com/app/id6766551832",
            "https://sketchfab.com/ffishAsia-and-floraZia"
          ],
          "applicationCategory": "EducationalApplication",
          "operatingSystem": "iOS, iPadOS, macOS",
          "offers": {
            "@type": "Offer",
            "price": "0",
            "priceCurrency": "USD"
          }
        },
        breadcrumb("https://ar-asia.luopeike.com/#breadcrumb", [[1, "Little Nature", "https://ar-asia.luopeike.com/"]])
      ]
    };
  }

  function helpSchema(language, data) {
    const lang = (languageInfo[language] || languageInfo.en).htmlLang;
    return {
      "@context": "https://schema.org",
      "@graph": [
        organizationNode(),
        websiteNode(lang, "Little Nature"),
        {
          "@type": "WebPage",
          "@id": "https://ar-asia.luopeike.com/help.html#webpage",
          "name": data.meta.ogTitle,
          "url": "https://ar-asia.luopeike.com/help.html",
          "description": data.meta.description,
          "inLanguage": lang,
          "isPartOf": {
            "@id": "https://ar-asia.luopeike.com/#website"
          },
          "publisher": {
            "@id": "https://ar-asia.luopeike.com/#organization"
          }
        },
        {
          "@type": "FAQPage",
          "@id": "https://ar-asia.luopeike.com/help.html#faq",
          "inLanguage": lang,
          "isPartOf": {
            "@id": "https://ar-asia.luopeike.com/help.html#webpage"
          },
          "mainEntity": data.sections.flatMap((section) =>
            section[1].map((item) => ({
              "@type": "Question",
              "name": item[0],
              "acceptedAnswer": {
                "@type": "Answer",
                "text": item[1]
              }
            }))
          )
        },
        breadcrumb("https://ar-asia.luopeike.com/help.html#breadcrumb", [
          [1, "Little Nature", "https://ar-asia.luopeike.com/"],
          [2, data.title, "https://ar-asia.luopeike.com/help.html"]
        ])
      ]
    };
  }

  function privacySchema(language, data) {
    const lang = (languageInfo[language] || languageInfo.en).htmlLang;
    return {
      "@context": "https://schema.org",
      "@graph": [
        organizationNode(),
        websiteNode(lang, "Little Nature"),
        {
          "@type": "PrivacyPolicy",
          "@id": "https://ar-asia.luopeike.com/privacy-policy.html#privacy-policy",
          "name": data.meta.ogTitle,
          "description": data.meta.description,
          "url": "https://ar-asia.luopeike.com/privacy-policy.html",
          "inLanguage": lang,
          "dateModified": "2026-05-14",
          "isPartOf": {
            "@id": "https://ar-asia.luopeike.com/#website"
          },
          "publisher": {
            "@id": "https://ar-asia.luopeike.com/#organization"
          }
        },
        breadcrumb("https://ar-asia.luopeike.com/privacy-policy.html#breadcrumb", [
          [1, "Little Nature", "https://ar-asia.luopeike.com/"],
          [2, data.title, "https://ar-asia.luopeike.com/privacy-policy.html"]
        ])
      ]
    };
  }

  function organizationNode() {
    return {
      "@type": "Organization",
      "@id": "https://ar-asia.luopeike.com/#organization",
      "name": "Little Nature",
      "url": "https://ar-asia.luopeike.com/",
      "logo": {
        "@type": "ImageObject",
        "url": "https://ar-asia.luopeike.com/apple-touch-icon.png",
        "width": 180,
        "height": 180
      },
      "sameAs": [
        "https://apps.apple.com/app/id6766551832",
        "https://sketchfab.com/ffishAsia-and-floraZia"
      ]
    };
  }

  function websiteNode(language, name) {
    return {
      "@type": "WebSite",
      "@id": "https://ar-asia.luopeike.com/#website",
      "name": name,
      "url": "https://ar-asia.luopeike.com/",
      "inLanguage": language,
      "publisher": {
        "@id": "https://ar-asia.luopeike.com/#organization"
      }
    };
  }

  function breadcrumb(id, items) {
    return {
      "@type": "BreadcrumbList",
      "@id": id,
      "itemListElement": items.map(([position, name, item]) => ({
        "@type": "ListItem",
        "position": position,
        "name": name,
        "item": item
      }))
    };
  }

  function selectedLanguage() {
    const params = new URLSearchParams(window.location.search);
    const requested = params.get("lang");
    if (supportedLanguages.includes(requested)) return requested;

    const saved = localStorage.getItem("littleNatureSiteLanguage");
    if (supportedLanguages.includes(saved)) return saved;

    return "en";
  }

  function updateUrl(language) {
    const url = new URL(window.location.href);
    if (language === "en") {
      url.searchParams.delete("lang");
    } else {
      url.searchParams.set("lang", language);
    }
    window.history.replaceState({}, "", url);
  }

  function applyLanguage(language, shouldUpdateUrl = false) {
    const page = document.body.dataset.page || "home";
    const select = document.querySelector("[data-language-select]");
    if (select) select.value = language;
    localStorage.setItem("littleNatureSiteLanguage", language);
    applyCommon(language);
    if (page === "help") applyHelp(language);
    else if (page === "privacy") applyPrivacy(language);
    else applyHome(language);
    if (shouldUpdateUrl) updateUrl(language);
  }

  const select = document.querySelector("[data-language-select]");
  const initialLanguage = selectedLanguage();
  applyLanguage(initialLanguage, supportedLanguages.includes(new URLSearchParams(window.location.search).get("lang")));

  if (select) {
    select.addEventListener("change", () => {
      applyLanguage(select.value, true);
    });
  }
})();
