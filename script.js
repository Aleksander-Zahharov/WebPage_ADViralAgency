// Язык, который подставляется, если пользователь ещё ничего не выбирал
const DEFAULT_LANG = "en";
// Ключ в localStorage, где хранится выбранный язык
const LANG_STORAGE_KEY = "adviral-lang";
// Имя cookie, которым дублируем язык (на случай очистки localStorage)
const LANG_COOKIE_NAME = "adviral-lang";

// Поддерживаемые коды языков
const SUPPORTED_LANGS = ["ru", "en", "et"];

// Достаём значение параметра lang из URL, если оно валидное
function readLangFromQuery() {
  try {
    const params = new URLSearchParams(window.location.search);
    const l = (params.get("lang") || "").toLowerCase();
    return SUPPORTED_LANGS.includes(l) ? l : null;
  } catch (_) {
    return null;
  }
}

// Работа с cookie: чтение/запись языка
function readLangFromCookie() {
  const cookie = document.cookie || "";
  const parts = cookie.split(/;\s*/);
  for (const part of parts) {
    const [k, v] = part.split("=");
    if (k === LANG_COOKIE_NAME) {
      const val = decodeURIComponent(v || "").toLowerCase();
      return SUPPORTED_LANGS.includes(val) ? val : null;
    }
  }
  return null;
}

function writeLangCookie(lang) {
  try {
    const maxAge = 60 * 60 * 24 * 365; // 1 год
    document.cookie = `${LANG_COOKIE_NAME}=${encodeURIComponent(lang)}; Max-Age=${maxAge}; Path=/; SameSite=Lax`;
  } catch (_) {
    // ignore cookie errors (Safari private mode, etc.)
  }
}

// Определяем язык по браузеру: navigator.languages предпочтительнее
function detectBrowserLang() {
  const langs = (navigator.languages && navigator.languages.length ? navigator.languages : [navigator.language || navigator.userLanguage || ""]).map((l) => String(l || "").toLowerCase());
  // Пробуем сопоставить прямо
  for (const l of langs) {
    if (SUPPORTED_LANGS.includes(l)) return l;
  }
  // Пробуем по префиксу (ru-RU -> ru)
  for (const l of langs) {
    const base = l.split("-")[0];
    if (SUPPORTED_LANGS.includes(base)) return base;
  }
  return null;
}

// Комплексное получение языка: URL -> cookie -> localStorage -> браузер -> default
function resolveInitialLang() {
  const fromQuery = readLangFromQuery();
  if (fromQuery) return { lang: fromQuery, source: "query" };

  const fromCookie = readLangFromCookie();
  if (fromCookie) return { lang: fromCookie, source: "cookie" };

  const fromStorage = localStorage.getItem(LANG_STORAGE_KEY);
  if (SUPPORTED_LANGS.includes(fromStorage)) return { lang: fromStorage, source: "storage" };

  const detected = detectBrowserLang();
  if (detected) return { lang: detected, source: "detect" };

  return { lang: DEFAULT_LANG, source: "default" };
}

// Три варианта перевода: русский, английский, эстонский.
// Меняй фразу в трёх местах по одному ключу, чтобы все языки синхронизировались.
// Полный словарь переводов, сгруппированный по языковым ключам
const translations = {
  ru: {
    meta: {
      title: "ADViral Agency — Агентство цифрового маркетинга и продакшна",
      description:
        "Агентство полного цикла: стратегия продвижения, SMM, производство видео (Reels, TikTok, YouTube Shorts), таргетированная реклама и performance-маркетинг для роста продаж.",
    },
    logo: "ADViral Agency",
    nav: {
      about: "Кто мы",
      services: "Услуги",
      works: "Работы",
      partners: "Партнеры",
      contact: "Контакты",
      menuToggle: { "aria-label": "Открыть меню" },
    },
    lang: {
      switcher: { "aria-label": "Выбор языка" },
    },
    hero: {
      title: "ADViral Agency",
      subtitle: "Цифровой маркетинг, управление соцсетями, видео-контент и performance для роста бизнеса",
      ctaPrimary: "Получить консультацию",
      ctaSecondary: "Наши услуги",
    },
    about: {
      title: "Кто мы",
      description:
        "ADViral — агентство полного цикла. Мы объединяем стратегию, SMM, видеопродакшн и performance‑маркетинг: кампании не только видят — ими делятся, а лиды превращаются в клиентов.",
      list: {
        campaigns: "SMM‑стратегии и кампании с вирусным потенциалом",
        production: "Видео для Reels, TikTok, YouTube Shorts и сторис",
        analytics: "Аналитика, A/B‑тесты и непрерывная оптимизация",
      },
    },
    services: {
      title: "Услуги: SMM, видеопродакшн и реклама",
      cards: {
        socialManagement: {
          title: "📱 Ведение соцсетей",
          text: "Instagram, Facebook, TikTok, YouTube: контент, визуал и единый стиль.",
        },
        growthStrategy: {
          title: "🧭 Стратегия продвижения",
          text: "Совместно строим маршрут роста охватов и вовлеченности.",
        },
        adCampaigns: {
          title: "🎯 Рекламные кампании",
          text: "Креативы, таргет и постоянный анализ эффективности.",
        },
        communityEngagement: {
          title: "💬 Активность в сообществах",
          text: "Диалог с аудиторией в группах, комментариях и обсуждениях.",
        },
        socialVideo: {
          title: "🎬 Видео для соцсетей",
          text: "Динамичные ролики для Reels, TikTok и сторис.",
        },
        brandAudit: {
          title: "🧠 Анализ бренда",
          text: "Разбираем миссию, ценности и цели компании.",
        },
        marketResearch: {
          title: "📊 Анализ рынка",
          text: "Ищем точки роста на фоне конкурентов и трендов.",
        },
        productAnalysis: {
          title: "🧩 Анализ продуктовой линейки",
          text: "Сегментируем предложения для разных аудиторий.",
        },
        audienceStrategy: {
          title: "👥 ЦА и стратегии привлечения",
          text: "Портрет клиента и новые сценарии привлечения.",
        },
      },
    },
    works: {
      title: "Наши работы",
      subtitle: "Видео‑кейсы по SMM, продакшну и рекламе. Клик откроет видеоплеер.",
      cases: {
        case1: { text: "Кейс 1", "aria-label": "Кейс 1" },
        case2: { text: "Кейс 2", "aria-label": "Кейс 2" },
        case3: { text: "Кейс 3", "aria-label": "Кейс 3" },
        case4: { text: "Кейс 4", "aria-label": "Кейс 4" },
        case5: { text: "Кейс 5", "aria-label": "Кейс 5" },
        case6: { text: "Кейс 6", "aria-label": "Кейс 6" },
        case7: { text: "Кейс 7", "aria-label": "Кейс 7" },
        case8: { text: "Кейс 8", "aria-label": "Кейс 8" },
        case9: { text: "Кейс 9", "aria-label": "Кейс 9" },
        case10: { text: "Кейс 10", "aria-label": "Кейс 10" },
        case11: { text: "Кейс 11", "aria-label": "Кейс 11" },
        case12: { text: "Кейс 12", "aria-label": "Кейс 12" },
      },
    },
    partners: {
      title: "Наши партнеры",
    },
    contact: {
      title: "Контакты",
      packages: {
        free: {
          name: "Free",
          price: "0€",
          features: {
            consultation: "Экспресс-консультация по продвижению",
            checklist: "Персональный чек-лист первых шагов",
          },
        },
        basic: {
          name: "Basic",
          price: "от 990€",
          features: {
            previous: "Все из пакета Free",
            socials: "Ежедневное ведение соцсетей и контент-план",
            strategy: "Стратегия роста охватов",
          },
        },
        pro: {
          name: "Pro",
          price: "от 2 490€",
          features: {
            previous: "Все из пакета Basic",
            campaigns: "Создание и настройка рекламных кампаний",
            video: "Видео для соцсетей и работа с сообществами",
          },
        },
        elite: {
          name: "Elite",
          price: "кастом",
          features: {
            previous: "Все из пакета Pro",
            analysis: "Глубокий анализ бренда, рынка и продуктовой линейки",
            acquisition: "Стратегии привлечения и сегментация аудитории",
          },
        },
      },
      form: {
        name: { placeholder: "Ваше имя" },
        email: { placeholder: "Email" },
        company: { placeholder: "Компания (необязательно)" },
        message: { placeholder: "Коротко опишите задачу" },
    submit: "Отправить запрос",
      },
    },
    footer: {
      copy: "© 2025 ADViral Agency",
      email: "hello@adviral.agency",
      social: {
        instagram: "Instagram",
        facebook: "Facebook",
        tiktok: "TikTok",
      },
    },
  },
  en: {
    meta: {
      title: "ADViral Agency — Social Media, Video Production, and Performance Marketing",
      description:
        "Full‑service digital marketing agency: social media strategy and management, short‑form video production (Reels, TikTok, Shorts), creative advertising and performance campaigns that drive measurable growth.",
    },
    logo: "ADViral Agency",
    nav: {
      about: "About",
      services: "Services",
      works: "Cases",
      partners: "Partners",
      contact: "Contact",
      menuToggle: { "aria-label": "Open menu" },
    },
    lang: {
      switcher: { "aria-label": "Language selection" },
    },
    hero: {
      title: "ADViral Agency",
      subtitle: "Social media marketing, video production, and performance campaigns to grow your business",
      ctaPrimary: "Request a consultation",
      ctaSecondary: "Our services",
    },
    about: {
      title: "Who we are",
      description:
        "ADViral is a full‑service digital agency. We align social media strategy, creative production, and performance marketing so your campaigns are seen, shared, and convert.",
      list: {
        campaigns: "SMM strategies and campaigns with viral potential",
        production: "Short‑form production for Reels, TikTok, YouTube Shorts",
        analytics: "Analytics, A/B testing, and continuous optimisation",
      },
    },
    services: {
      title: "Services: Social Media, Video, Advertising",
      cards: {
        socialManagement: {
          title: "📱 Social media management",
          text: "Instagram, Facebook, TikTok, YouTube — content, visuals, consistent style.",
        },
        growthStrategy: {
          title: "🧭 Growth strategy",
          text: "Co-create the roadmap to lift reach and engagement.",
        },
        adCampaigns: {
          title: "🎯 Advertising campaigns",
          text: "Creative development, targeting, and continuous optimisation.",
        },
        communityEngagement: {
          title: "💬 Community engagement",
          text: "Conversations with audiences in groups, comments, and threads.",
        },
        socialVideo: {
          title: "🎬 Social video production",
          text: "Short-form videos tailored for Reels, TikTok, and Stories.",
        },
        brandAudit: {
          title: "🧠 Brand deep-dive",
          text: "Unpack mission, values, and goals to guide communication.",
        },
        marketResearch: {
          title: "📊 Market & competitor analysis",
          text: "Spot opportunities across competitors and trends.",
        },
        productAnalysis: {
          title: "🧩 Product portfolio review",
          text: "Segment offers for different customer clusters.",
        },
        audienceStrategy: {
          title: "👥 Audience insights & acquisition",
          text: "Define personas and craft fresh acquisition plays.",
        },
      },
    },
    works: {
      title: "Our work",
      subtitle: "Video cases across SMM, production, and advertising. Click to open in player.",
      cases: {
        case1: { text: "Case 1", "aria-label": "Case 1" },
        case2: { text: "Case 2", "aria-label": "Case 2" },
        case3: { text: "Case 3", "aria-label": "Case 3" },
        case4: { text: "Case 4", "aria-label": "Case 4" },
        case5: { text: "Case 5", "aria-label": "Case 5" },
        case6: { text: "Case 6", "aria-label": "Case 6" },
        case7: { text: "Case 7", "aria-label": "Case 7" },
        case8: { text: "Case 8", "aria-label": "Case 8" },
        case9: { text: "Case 9", "aria-label": "Case 9" },
        case10: { text: "Case 10", "aria-label": "Case 10" },
        case11: { text: "Case 11", "aria-label": "Case 11" },
        case12: { text: "Case 12", "aria-label": "Case 12" },
      },
    },
    partners: {
      title: "Our partners",
    },
    contact: {
      title: "Contacts",
      packages: {
        free: {
          name: "Free",
          price: "€0",
          features: {
            consultation: "Express marketing consultation",
            checklist: "Personalised quick-start checklist",
          },
        },
        basic: {
          name: "Basic",
          price: "from €990",
          features: {
            previous: "Everything in Free",
            socials: "Daily social media management and content calendar",
            strategy: "Growth strategy to lift reach",
          },
        },
        pro: {
          name: "Pro",
          price: "from €2,490",
          features: {
            previous: "Everything in Basic",
            campaigns: "Creative development and advertising campaign setup",
            video: "Short-form video production and community engagement",
          },
        },
        elite: {
          name: "Elite",
          price: "custom",
          features: {
            previous: "Everything in Pro",
            analysis: "In-depth brand, market, and product portfolio analysis",
            acquisition: "Audience segmentation and new acquisition plays",
          },
        },
      },
      form: {
        name: { placeholder: "Your name" },
        email: { placeholder: "Email" },
        company: { placeholder: "Company (optional)" },
        message: { placeholder: "Briefly describe the task" },
    submit: "Send request",
      },
    },
    footer: {
      copy: "© 2025 ADViral Agency",
      email: "hello@adviral.agency",
      social: {
        instagram: "Instagram",
        facebook: "Facebook",
        tiktok: "TikTok",
      },
    },
  },
  et: {
    meta: {
      title: "ADViral Agency — Sotsiaalmeedia, videoproduktsioon ja performance‑turundus",
      description:
        "Täisteenust pakkuv digiturundusagentuur: SMM strateegia ja haldus, lühivideod (Reels, TikTok, Shorts), loovlahendused ja performance‑kampaaniad, mis toovad kasvu.",
    },
    logo: "ADViral Agency",
    nav: {
      about: "Kes me oleme",
      services: "Teenused",
      works: "Projektid",
      partners: "Partnerid",
      contact: "Kontakt",
      menuToggle: { "aria-label": "Ava menüü" },
    },
    lang: {
      switcher: { "aria-label": "Keele valik" },
    },
    hero: {
      title: "ADViral Agency",
      subtitle: "Sotsiaalmeedia turundus, videod ja performance‑kampaaniad sinu ettevõtte kasvuks",
      ctaPrimary: "Küsi konsultatsiooni",
      ctaSecondary: "Meie teenused",
    },
    about: {
      title: "Kes me oleme",
      description:
        "ADViral on täisteenust pakkuv digiagentuur. Seome sotsiaalmeedia strateegia, loovproduktsiooni ja performance‑turunduse: kampaaniad mitte ainult ei paista silma, vaid ka konverteerivad.",
      list: {
        campaigns: "SMM‑strateegiad ja viirusliku potentsiaaliga kampaaniad",
        production: "Lühivideod Reelsi, TikToki ja YouTube Shortsi jaoks",
        analytics: "Analüütika, A/B‑testid ja pidev optimeerimine",
      },
    },
    services: {
      title: "Teenused: SMM, videod, reklaam",
      cards: {
        socialManagement: {
          title: "📱 Sotsiaalmeedia haldus",
          text: "Instagram, Facebook, TikTok, YouTube: sisu, visuaal ja ühtne stiil.",
        },
        growthStrategy: {
          title: "🧭 Kasvustrateegia",
          text: "Loome koos plaani, mis kasvatab haaret ja kaasatust.",
        },
        adCampaigns: {
          title: "🎯 Reklaamikampaaniad",
          text: "Loovlahendused, sihtimine ja pidev tulemuslikkuse analüüs.",
        },
        communityEngagement: {
          title: "💬 Kogukondade kaasamine",
          text: "Vestlused sihtrühmaga gruppides, kommentaarides ja aruteludes.",
        },
        socialVideo: {
          title: "🎬 Videod sotsiaalmeediale",
          text: "Lühiformaadid Reelsi, TikToki, Shorts ja lugude jaoks.",
        },
        brandAudit: {
          title: "🧠 Brändi süvaanalüüs",
          text: "Kaardistame ettevõtte missiooni, väärtused ja eesmärgid.",
        },
        marketResearch: {
          title: "📊 Turuanalüüs ja konkurendid",
          text: "Leiame kasvuvõimalused konkurentide ja trendide põhjal.",
        },
        productAnalysis: {
          title: "🧩 Tooteportfelli analüüs",
          text: "Segmentime pakkumised erinevatele kliendigruppidele.",
        },
        audienceStrategy: {
          title: "👥 Sihtgrupp ja uued strateegiad",
          text: "Kirjeldame personad ja loome uued kliendihankestrateegiad.",
        },
      },
    },
    works: {
      title: "Meie tööd",
      subtitle: "Videokesed SMM‑i, produktsiooni ja reklaami teemadel. Klõps avab videomängija.",
      cases: {
        case1: { text: "Projekt 1", "aria-label": "Projekt 1" },
        case2: { text: "Projekt 2", "aria-label": "Projekt 2" },
        case3: { text: "Projekt 3", "aria-label": "Projekt 3" },
        case4: { text: "Projekt 4", "aria-label": "Projekt 4" },
        case5: { text: "Projekt 5", "aria-label": "Projekt 5" },
        case6: { text: "Projekt 6", "aria-label": "Projekt 6" },
        case7: { text: "Projekt 7", "aria-label": "Projekt 7" },
        case8: { text: "Projekt 8", "aria-label": "Projekt 8" },
        case9: { text: "Projekt 9", "aria-label": "Projekt 9" },
        case10: { text: "Projekt 10", "aria-label": "Projekt 10" },
        case11: { text: "Projekt 11", "aria-label": "Projekt 11" },
        case12: { text: "Projekt 12", "aria-label": "Projekt 12" },
      },
    },
    partners: {
      title: "Meie partnerid",
    },
    contact: {
      title: "Kontaktid",
      packages: {
        free: {
          name: "Free",
          price: "0€",
          features: {
            consultation: "Kiirkonsultatsioon turunduse teemadel",
            checklist: "Isiklik stardiplaan ja kontrollnimekiri",
          },
        },
        basic: {
          name: "Basic",
          price: "alates 990 €",
          features: {
            previous: "Kõik, mis on paketis Free",
            socials: "Igapäevane sotsiaalmeedia haldus ja sisukalender",
            strategy: "Kasvustrateegia haarde suurendamiseks",
          },
        },
        pro: {
          name: "Pro",
          price: "alates 2 490 €",
          features: {
            previous: "Kõik, mis on paketis Basic",
            campaigns: "Loovlahendused ja reklaamikampaaniate seadistamine",
            video: "Lühivideod ning kogukondade kaasamine",
          },
        },
        elite: {
          name: "Elite",
          price: "kohandatud",
          features: {
            previous: "Kõik, mis on paketis Pro",
            analysis: "Sügav brändi-, turu- ja tooteportfelli analüüs",
            acquisition: "Sihtgrupi segmentimine ja uued hankestrateegiad",
          },
        },
      },
      form: {
        name: { placeholder: "Teie nimi" },
        email: { placeholder: "Email" },
        company: { placeholder: "Ettevõte (valikuline)" },
        message: { placeholder: "Kirjelda lühidalt vajadust" },
        submit: "Saada päring",
      },
    },
    footer: {
      copy: "© 2025 ADViral Agency",
      email: "hello@adviral.agency",
      social: {
        instagram: "Instagram",
        facebook: "Facebook",
        tiktok: "TikTok",
      },
    },
  },
};

// Ищем значение по точечному пути в словаре переводов
function resolveTranslation(dictionary, path) {
  return path
    .split(".")
    .reduce((acc, segment) => (acc && acc[segment] !== undefined ? acc[segment] : undefined), dictionary);
}

// Применяем найденный перевод к элементу и его атрибутам
function applyTranslationValue(el, value, attrs, skipText) {
  if (value === undefined || value === null) return;
  const isString = typeof value === "string";
  const dict = isString ? { text: value } : value;

  if (attrs.length) {
    attrs.forEach((attrName) => {
      const attrValue = dict[attrName] ?? (isString ? value : undefined);
      if (attrValue !== undefined) {
        el.setAttribute(attrName, attrValue);
      }
    });
  }

  if (dict.html !== undefined) {
    el.innerHTML = dict.html;
    return;
  }

  if (!skipText && (!attrs.length || dict.text !== undefined)) {
    const textValue = dict.text ?? (isString ? value : undefined);
    if (textValue !== undefined) {
      el.textContent = textValue;
    }
  }
}

// Обновляем визуальное состояние переключателя языка
function syncLanguageSwitcher(lang) {
  document.querySelectorAll(".lang-switcher").forEach((root) => {
    if (!root) return;

    root.dataset.activeLang = lang;

    const valueNode = root.querySelector("[data-lang-value]");
    if (valueNode) {
      valueNode.textContent = String(lang).toUpperCase();
    }

    const options = root.querySelectorAll("[data-lang-option]");
    options.forEach((option) => {
      const isActive = option.dataset.value === lang;
      option.classList.toggle("is-active", isActive);
      option.setAttribute("aria-selected", isActive ? "true" : "false");
      option.setAttribute("tabindex", isActive ? "0" : "-1");
      if (isActive && option.id) {
        const menu = option.closest("[data-lang-menu]");
        if (menu) {
          menu.setAttribute("aria-activedescendant", option.id);
        }
      }
    });
  });
}

// Настраиваем обработчики для выпадающего переключателя языка
function setupLanguageSwitcher(root) {
  if (!root) return;

  const toggle = root.querySelector("[data-lang-toggle]");
  const menu = root.querySelector("[data-lang-menu]");
  const options = Array.from(root.querySelectorAll("[data-lang-option]"));

  if (!toggle || !menu || options.length === 0) return;

  let isOpen = false;
  let closeTimer = null;

  menu.hidden = true;
  menu.setAttribute("tabindex", "-1");

  const handleOutsidePointer = (event) => {
    if (!root.contains(event.target)) {
      setOpen(false);
    }
  };

  const handleEscapeKey = (event) => {
    if (event.key === "Escape") {
      setOpen(false);
      toggle.focus({ preventScroll: true });
    }
  };

  function setOpen(state) {
    if (isOpen === state) return;
    isOpen = state;
    clearTimeout(closeTimer);

    if (state) {
      menu.hidden = false;
      requestAnimationFrame(() => {
        root.dataset.open = "true";
        toggle.setAttribute("aria-expanded", "true");
        const activeOption = options.find((opt) => opt.dataset.value === root.dataset.activeLang) || options[0];
        if (activeOption) {
          activeOption.focus({ preventScroll: true });
        }
      });
      document.addEventListener("pointerdown", handleOutsidePointer, true);
      document.addEventListener("keydown", handleEscapeKey, true);
    } else {
      root.dataset.open = "false";
      toggle.setAttribute("aria-expanded", "false");
      document.removeEventListener("pointerdown", handleOutsidePointer, true);
      document.removeEventListener("keydown", handleEscapeKey, true);
      closeTimer = setTimeout(() => {
        menu.hidden = true;
      }, 180);
    }
  }

  function focusOptionAt(index) {
    const target = options[index];
    if (!target) return;
    options.forEach((option, idx) => {
      option.setAttribute("tabindex", idx === index ? "0" : "-1");
    });
    target.focus({ preventScroll: true });
  }

  function getFocusedIndex() {
    return options.indexOf(document.activeElement);
  }

  function getActiveIndex() {
    const currentLang = root.dataset.activeLang;
    const idx = options.findIndex((option) => option.dataset.value === currentLang);
    return idx === -1 ? 0 : idx;
  }

  function stepFocus(delta) {
    const currentIndex = getFocusedIndex();
    const baseIndex = currentIndex === -1 ? getActiveIndex() : currentIndex;
    const nextIndex = (baseIndex + delta + options.length) % options.length;
    focusOptionAt(nextIndex);
  }

  function commitSelection(lang) {
    if (!lang || !translations[lang]) {
      return;
    }

    const current = root.dataset.activeLang;
    if (current === lang) {
      setOpen(false);
      toggle.focus({ preventScroll: true });
      return;
    }

    localStorage.setItem(LANG_STORAGE_KEY, lang);
    writeLangCookie(lang);
    applyLanguage(lang);
    setOpen(false);
    toggle.focus({ preventScroll: true });
  }

  toggle.addEventListener("click", () => {
    setOpen(!isOpen);
  });

  toggle.addEventListener("keydown", (event) => {
    if (event.key === "ArrowDown" || event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      setOpen(true);
    }
  });

  menu.addEventListener("keydown", (event) => {
    switch (event.key) {
      case "ArrowDown":
        event.preventDefault();
        stepFocus(1);
        break;
      case "ArrowUp":
        event.preventDefault();
        stepFocus(-1);
        break;
      case "Home":
        event.preventDefault();
        focusOptionAt(0);
        break;
      case "End":
        event.preventDefault();
        focusOptionAt(options.length - 1);
        break;
      case "Enter":
      case " ": {
        event.preventDefault();
        const activeOption = options[getFocusedIndex()] || options[getActiveIndex()];
        if (activeOption) {
          commitSelection(activeOption.dataset.value);
        }
        break;
      }
      case "Escape":
        event.preventDefault();
        setOpen(false);
        toggle.focus({ preventScroll: true });
        break;
      default:
        break;
    }
  });

  menu.addEventListener("focusout", (event) => {
    if (!isOpen) return;
    const next = event.relatedTarget;
    if (!menu.contains(next) && next !== toggle) {
      setOpen(false);
    }
  });

  options.forEach((option) => {
    option.addEventListener("click", () => {
      commitSelection(option.dataset.value);
    });
  });

  syncLanguageSwitcher(root.dataset.activeLang || options[0].dataset.value);
}

function applyLanguage(lang) {
  const targetLang = translations[lang] ? lang : DEFAULT_LANG;
  const dictionary = translations[targetLang];
  const fallback = translations[DEFAULT_LANG];

  document.documentElement.lang = targetLang;

  document.querySelectorAll("[data-i18n]").forEach((el) => {
    const key = el.dataset.i18n;
    if (!key) return;
    const attrList = (el.dataset.i18nAttrs || "")
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean);
    const skipText = el.dataset.i18nSkipText === "true";

    const value = resolveTranslation(dictionary, key);
    const fallbackValue = value === undefined ? resolveTranslation(fallback, key) : undefined;

    applyTranslationValue(el, value !== undefined ? value : fallbackValue, attrList, skipText);
  });

  syncLanguageSwitcher(targetLang);
}

// Запускаем инициализацию, когда DOM полностью готов
document.addEventListener("DOMContentLoaded", () => {
  // Ensure canonical and og:url reference the current URL (no hard-coded domain)
  (function ensureCanonicalAndOgUrl() {
    try {
      const { origin, pathname, href } = window.location;
      const canonical = document.querySelector('link[rel="canonical"]');
      if (canonical) canonical.setAttribute('href', origin + pathname);
      const ogUrl = document.querySelector('meta[property="og:url"]');
      if (ogUrl) ogUrl.setAttribute('content', href.split('#')[0]);
    } catch (_) { /* noop */ }
  })();

  const doc = document;
  const rootEl = doc.documentElement;
  const headerNavLinks = Array.from(doc.querySelectorAll('.header-nav a[href^="#"]'));
  const createRafThrottle = (fn) => {
    let rafId = 0;
    let lastArgs;
    return function throttled(...args) {
      lastArgs = args;
      if (rafId) return;
      rafId = requestAnimationFrame(() => {
        rafId = 0;
        fn.apply(this, lastArgs);
      });
    };
  };

  const { lang: resolvedLang, source } = resolveInitialLang();
  applyLanguage(resolvedLang);
  // Сохраняем выбор, если он пришёл не из localStorage/cookie
  if (source === "query" || source === "detect") {
    localStorage.setItem(LANG_STORAGE_KEY, resolvedLang);
    writeLangCookie(resolvedLang);
  }

  setupLanguageSwitcher(doc.querySelector(".lang-switcher"));

  // Мобильное меню (гамбургер): открытие/закрытие
  (function setupMobileMenu() {
    const html = rootEl;
    const toggle = doc.getElementById("menu-toggle");
    const menu = doc.getElementById("mobile-menu");
    const header = doc.querySelector('.site-header');
    if (!toggle || !menu) return;

    let isOpen = false;

    function openMenu() {
      if (isOpen) return;
      isOpen = true;
      html.classList.add("menu-open");
      toggle.setAttribute("aria-expanded", "true");
      header?.classList.remove('header--hidden');
      // Переводим фокус на первый пункт
      const firstLink = menu.querySelector('a[href^="#"]');
      firstLink?.focus({ preventScroll: true });
      document.addEventListener("keydown", onKeyDown);
      document.addEventListener("click", onOutsideClick, true);
    }

    function closeMenu() {
      if (!isOpen) return;
      isOpen = false;
      html.classList.remove("menu-open");
      toggle.setAttribute("aria-expanded", "false");
      document.removeEventListener("keydown", onKeyDown);
      document.removeEventListener("click", onOutsideClick, true);
      toggle.focus({ preventScroll: true });
    }

    function onKeyDown(e) {
      if (e.key === "Escape") {
        closeMenu();
      }
    }

    function onOutsideClick(e) {
      // Закрываем, если кликнули вне меню и вне самой кнопки (включая её дочерние элементы)
      if (!menu.contains(e.target) && !toggle.contains(e.target)) {
        closeMenu();
      }
    }

    toggle.addEventListener("click", () => {
      isOpen ? closeMenu() : openMenu();
    });

    // Закрываем меню по клику на пункт
    menu.querySelectorAll('a[href^="#"]').forEach((a) => {
      a.addEventListener("click", () => closeMenu());
    });

    // При ресайзе на десктоп — закрываем
    window.addEventListener("resize", () => {
      if (window.innerWidth > 820) closeMenu();
    });
  })();

  // Автоскрытие хедера отключено по требованию: хедер всегда виден во всех разрешениях.

  // Флаг: если кликнули пункт в шапке — временно не автодокручиваем секции и прокручиваем к секции вручную
  let navScrollBlockUntil = 0;
  headerNavLinks.forEach((a) => {
    const href = a.getAttribute('href');
    if (!href || !href.startsWith('#')) return;
    const target = doc.querySelector(href);
    if (!target) return;

    a.addEventListener('click', (event) => {
      navScrollBlockUntil = performance.now() + 1400; // даём приоритет якорной навигации ~1.4с
      event.preventDefault();
      smoothScrollToTargetTop(target);
      if (history.replaceState) {
        history.replaceState(null, '', href);
      }
    });
  });

  let lastScrollY = window.scrollY || window.pageYOffset;
  let lastScrollDirection = 'down';

  const servicesSection = doc.getElementById('services');
  const servicesCards = servicesSection ? Array.from(servicesSection.querySelectorAll('.cards .card')) : [];
  let servicesWavePrepared = false;

  const clusterAxis = (values, epsilon) => {
    const clusters = [];
    values.forEach((value) => {
      const idx = clusters.findIndex((point) => Math.abs(point - value) <= epsilon);
      if (idx === -1) {
        clusters.push(value);
      } else {
        clusters[idx] = (clusters[idx] + value) / 2;
      }
    });
    return clusters.sort((a, b) => a - b);
  };

  const findClusterIndex = (clusters, value) => {
    let bestIdx = 0;
    let bestDiff = Number.POSITIVE_INFINITY;
    clusters.forEach((cluster, idx) => {
      const diff = Math.abs(cluster - value);
      if (diff < bestDiff) {
        bestDiff = diff;
        bestIdx = idx;
      }
    });
    return bestIdx;
  };

  const prepareServicesWave = () => {
    if (!servicesSection || servicesWavePrepared || servicesCards.length === 0) return;
    servicesWavePrepared = true;

    const tolerance = 48;
    const positions = servicesCards.map((card) => {
      const rect = card.getBoundingClientRect();
      return { card, top: rect.top, left: rect.left };
    });

    const rowClusters = clusterAxis(positions.map((item) => item.top), tolerance);
    const colClusters = clusterAxis(positions.map((item) => item.left), tolerance);

    const baseDelay = 0.26;
    const stepDelay = 0.08;

    positions.forEach(({ card, top, left }) => {
      const rowIndex = findClusterIndex(rowClusters, top);
      const colIndex = findClusterIndex(colClusters, left);
      const waveIndex = rowIndex + colIndex;
      const delay = baseDelay + waveIndex * stepDelay;
      card.dataset.waveReady = 'true';
      card.style.setProperty('--wave-delay', `${delay.toFixed(2)}s`);
    });
  };

  window.addEventListener('scroll', () => {
    const currentY = window.scrollY || window.pageYOffset;
    if (currentY > lastScrollY) {
      lastScrollDirection = 'down';
    } else if (currentY < lastScrollY) {
      lastScrollDirection = 'up';
    }
    lastScrollY = currentY;
  }, { passive: true });

  function getHeaderOffsetPx(el) {
    const cs = getComputedStyle(rootEl);
    const h = parseFloat(cs.getPropertyValue('--header-h')) || 64;
    let extra = -55;
    return h + extra;
  }

  function smoothScrollToTargetTop(el) {
    if (!el) return;
    const startY = window.scrollY || window.pageYOffset;
    const rect = el.getBoundingClientRect();
    const offset = getHeaderOffsetPx(el);
    const target = Math.max(0, startY + rect.top - offset);
    try {
      window.scrollTo({ top: target, behavior: 'smooth' });
    } catch (_) {
      window.scrollTo(0, target);
    }

    setTimeout(() => {
      const newRect = el.getBoundingClientRect();
      const adjust = Math.max(0, (window.scrollY || window.pageYOffset) + newRect.top - offset);
      if (Math.abs(newRect.top - offset) > 2) {
        window.scrollTo({ top: adjust, behavior: 'auto' });
      }
    }, 420);
  }

  // Reveal on scroll — появление секций при прокрутке
  const revealEls = doc.querySelectorAll(".reveal");
  if (revealEls.length) {
    const io = new IntersectionObserver(
      (entries, obs) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const el = entry.target;
            el.classList.add("in-view");

            // Одноразовая автодокрутка при первом появлении секции в зоне видимости
            // Не мешаем якорной навигации из шапки (если недавно кликнули по меню)
            const now = performance.now();
            const alreadyAuto = el.dataset.autoscrolled === '1';
            if (!alreadyAuto && now > navScrollBlockUntil && lastScrollDirection === 'down') {
              el.dataset.autoscrolled = '1';
              smoothScrollToTargetTop(el);
            }
            if (entry.target === servicesSection) {
              prepareServicesWave();
            }
            obs.unobserve(entry.target);
          }
        });
      },
      {
        // Требуем чуть больше прокрутить: порог видимости выше и нижний rootMargin больше
        threshold: 0.18,
        rootMargin: "0px 0px -18% 0px"
      }
    );
    revealEls.forEach((el) => io.observe(el));
  }

  // Instagram-like slider — горизонтальная витрина кейсов
  const igSlider = doc.querySelector(".ig-slider");
  const igStrip = doc.querySelector(".ig-strip");

  function withNoSnap(fn, durationMs = 450) {
    if (!igStrip) return fn();
    igStrip.classList.add('no-snap');
    try { fn(); } finally {
      setTimeout(() => igStrip.classList.remove('no-snap'), durationMs);
    }
  }

  function getScrollStep() {
    if (!igStrip) return 320;
    const first = igStrip.querySelector(".ig-item");
    const cs = getComputedStyle(igStrip);
    const gap = parseFloat(cs.gap || cs.columnGap || '0') || 0;
    const w = first ? first.getBoundingClientRect().width : 240;
    return Math.max(160, w + gap);
  }

  function scrollStrip(dir = 1) {
    if (!igStrip) return;
    withNoSnap(() => {
      igStrip.scrollBy({ left: dir * getScrollStep(), behavior: "smooth" });
    });
  }

  let hoverRafId = null;
  let pressRafId = null;

  function stopHover() {
    if (hoverRafId) {
      cancelAnimationFrame(hoverRafId);
      hoverRafId = null;
      setTimeout(() => igStrip?.classList.remove('no-snap'), 120);
    }
  }

  function stopPress() {
    if (pressRafId) {
      cancelAnimationFrame(pressRafId);
      pressRafId = null;
      setTimeout(() => igStrip?.classList.remove('no-snap'), 120);
    }
  }

  function startRafScroll(dir, speedPxPerSec, assignId) {
    if (!igStrip) return;
    igStrip.classList.add('no-snap');
    let last = performance.now();
    let rem = 0;
    function frame(now) {
      const dt = (now - last) / 1000;
      last = now;
      rem += dir * speedPxPerSec * dt;
      const step = rem > 0 ? Math.floor(rem) : Math.ceil(rem);
      if (step) {
        igStrip.scrollLeft += step;
        rem -= step;
      }
      assignId(requestAnimationFrame(frame));
    }
    assignId(requestAnimationFrame(frame));
  }

  function startHover(dir) {
    stopHover();
    startRafScroll(dir, 16, (id) => (hoverRafId = id));
  }

  function startPress(dir) {
    stopPress();
    stopHover();
    startRafScroll(dir, 180, (id) => (pressRafId = id));
  }

  function startContinuousScroll(dir, speed) {
    if (!igStrip) return;
    igStrip.classList.add("no-snap");
    let lastTime = performance.now();

    function scrollFrame(now) {
      const deltaTime = (now - lastTime) / 1000;
      lastTime = now;
      igStrip.scrollLeft += dir * speed * deltaTime;
      hoverRafId = requestAnimationFrame(scrollFrame);
    }

    hoverRafId = requestAnimationFrame(scrollFrame);
  }

  function stopContinuousScroll() {
    if (hoverRafId) {
      cancelAnimationFrame(hoverRafId);
      hoverRafId = null;
      igStrip.classList.remove("no-snap");
    }
  }

  function startPressScroll(dir, speed) {
    if (!igStrip) return;
    igStrip.classList.add("no-snap");
    let lastTime = performance.now();

    function scrollFrame(now) {
      const deltaTime = (now - lastTime) / 1000;
      lastTime = now;
      igStrip.scrollLeft += dir * speed * deltaTime * 2;
      pressRafId = requestAnimationFrame(scrollFrame);
    }

    pressRafId = requestAnimationFrame(scrollFrame);
  }

  function stopPressScroll() {
    if (pressRafId) {
      cancelAnimationFrame(pressRafId);
      pressRafId = null;
      igStrip.classList.remove("no-snap");
    }
  }

  function startHoverScroll(dir, speed) {
    if (!igStrip) return;
    igStrip.classList.add("no-snap");
    let lastTime = performance.now();

    function scrollFrame(now) {
      const deltaTime = (now - lastTime) / 1000;
      lastTime = now;
      igStrip.scrollLeft += dir * speed * deltaTime * 0.5;
      hoverRafId = requestAnimationFrame(scrollFrame);
    }

    hoverRafId = requestAnimationFrame(scrollFrame);
  }

  function stopHoverScroll() {
    if (hoverRafId) {
      cancelAnimationFrame(hoverRafId);
      hoverRafId = null;
      igStrip.classList.remove("no-snap");
    }
  }

  function rewireArrow(el, dir) {
    if (!el) return null;
    const btn = el.cloneNode(true);
    el.replaceWith(btn);
    btn.addEventListener("pointerdown", (e) => {
      e.preventDefault();
      btn.setPointerCapture?.(e.pointerId);
      startPressScroll(dir, 300);
    });
    btn.addEventListener("pointerup", (e) => {
      btn.releasePointerCapture?.(e.pointerId);
      stopPressScroll();
    });
    btn.addEventListener("pointerleave", () => {
      stopPressScroll();
      stopHoverScroll();
    });
    btn.addEventListener("lostpointercapture", () => {
      stopPressScroll();
      stopHoverScroll();
    });
    btn.addEventListener("pointerenter", () => startHoverScroll(dir, 300));
    return btn;
  }

  rewireArrow(doc.querySelector(".ig-arrow.prev"), -1);
  rewireArrow(doc.querySelector(".ig-arrow.next"), 1);

  if (igSlider && igStrip) {
    const prevArrow = igSlider.querySelector(".ig-arrow.prev");
    const nextArrow = igSlider.querySelector(".ig-arrow.next");

    function scrollStripBy(direction) {
      const scrollAmount = igStrip.offsetWidth / 2;
      igStrip.scrollBy({ left: direction * scrollAmount, behavior: "smooth" });
    }

    prevArrow?.addEventListener("click", () => scrollStripBy(-1));
    nextArrow?.addEventListener("click", () => scrollStripBy(1));
  }

  if (igStrip) {
    let isDragging = false;
    let dragStartX = 0;
    let dragStartScroll = 0;

    const stopDrag = (evt) => {
      if (!isDragging) return;
      isDragging = false;
      igStrip.classList.remove("no-snap");
      delete igStrip.dataset.dragging;
      if (evt?.pointerId !== undefined) {
        igStrip.releasePointerCapture?.(evt.pointerId);
      }
    };

    igStrip.addEventListener("pointerdown", (evt) => {
      isDragging = true;
      dragStartX = evt.clientX;
      dragStartScroll = igStrip.scrollLeft;
      igStrip.classList.add("no-snap");
      igStrip.dataset.dragging = "true";
      igStrip.setPointerCapture?.(evt.pointerId);
    });

    igStrip.addEventListener("pointermove", (evt) => {
      if (!isDragging) return;
      const delta = evt.clientX - dragStartX;
      igStrip.scrollLeft = dragStartScroll - delta;
    });

    igStrip.addEventListener("pointerup", stopDrag);
    igStrip.addEventListener("pointerleave", stopDrag);
    igStrip.addEventListener("lostpointercapture", stopDrag);

  }

  const igVideos = igStrip ? igStrip.querySelectorAll("video") : [];
  igVideos.forEach((video) => {
    video.preload = "metadata";
    video.addEventListener("mouseenter", () => video.play());
    video.addEventListener("mouseleave", () => video.pause());
  });

  // Модальное окно видеоплеера
  (function setupVideoModal() {
    const modal = doc.getElementById("video-modal");
    const modalOverlay = modal?.querySelector(".video-modal-overlay");
    const modalClose = modal?.querySelector(".video-modal-close");
    const modalPlayer = doc.getElementById("modal-video-player");
    const modalSource = doc.getElementById("modal-video-source");
    
    if (!modal || !modalPlayer || !modalSource) {
      console.warn("Video modal elements not found");
      return;
    }

    function getVideoSource(item) {
      // Сначала проверяем data-video атрибут
      if (item.dataset.video) {
        return item.dataset.video;
      }
      
      // Затем проверяем старые атрибуты для обратной совместимости
      if (item.dataset.videoSrc) {
        return item.dataset.videoSrc;
      }
      
      if (item.dataset.videoFallback) {
        return item.dataset.videoFallback;
      }

      // Пробуем получить из video элемента
      const video = item.querySelector("video");
      if (!video) return null;

      const sources = Array.from(video.querySelectorAll("source"));
      if (sources.length > 0 && sources[0].src) {
        return sources[0].src;
      }

      if (video.src) {
        return video.src;
      }

      return null;
    }

    function openModal(videoSrc) {
      if (!videoSrc) {
        console.warn("No video source found");
        return;
      }

      modalSource.src = videoSrc;
      modalPlayer.src = videoSrc;
      modalPlayer.load();
      
      modal.hidden = false;
      document.body.style.overflow = "hidden";
      
      modalPlayer.addEventListener(
        "loadeddata",
        () => {
          modalPlayer.play().catch(() => {});
        },
        { once: true }
      );
      
      setTimeout(() => {
        modalPlayer.focus();
      }, 100);
    }

    function closeModal() {
      modalPlayer.pause();
      modalPlayer.currentTime = 0;
      modalPlayer.src = "";
      modalSource.src = "";
      modal.hidden = true;
      document.body.style.overflow = "";
    }

    // Обработчик клика для открытия модального окна
    const igItems = doc.querySelectorAll(".ig-item[data-video]");
    
    igItems.forEach((item) => {
      item.addEventListener("click", (e) => {
        // Проверяем, не происходит ли перетаскивание
        const igStrip = item.closest(".ig-strip");
        if (igStrip && igStrip.dataset.dragging === "true") {
          return;
        }
        
        e.preventDefault();
        e.stopPropagation();
        
        const videoSrc = getVideoSource(item);
        if (videoSrc) {
          openModal(videoSrc);
        }
      });
    });
    
    // Также обрабатываем клики на самом видео элементе
    const igVideos = doc.querySelectorAll(".ig-item video");
    igVideos.forEach((video) => {
      video.addEventListener("click", (e) => {
        e.preventDefault();
        e.stopPropagation();
        
        const item = video.closest(".ig-item");
        if (!item) return;
        
        const igStrip = item.closest(".ig-strip");
        if (igStrip && igStrip.dataset.dragging === "true") {
          return;
        }
        
        const videoSrc = getVideoSource(item);
        if (videoSrc) {
          openModal(videoSrc);
        }
      });
    });

    // Закрытие по клику на overlay
    if (modalOverlay) {
      modalOverlay.addEventListener("click", (e) => {
        if (e.target === modalOverlay) {
          closeModal();
        }
      });
    }

    // Закрытие по клику на кнопку закрытия
    if (modalClose) {
      modalClose.addEventListener("click", closeModal);
    }

    // Закрытие по Escape
    doc.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && !modal.hidden) {
        closeModal();
      }
    });
  })();

  // Обработчик формы (демонстрационный пример)
  const form = doc.querySelector("#contact-form");
  if (form) {
    form.addEventListener("submit", async (e) => {
      e.preventDefault();

      const submitBtn = form.querySelector("button[type='submit']");
      submitBtn?.setAttribute("disabled", "disabled");

      const formData = new FormData(form);
      // Формируем данные формы в том виде, как ожидает Formspree
      formData.append("_subject", "Новый запрос с сайта ADViral Agency");

      try {
        // Отправляем запрос на Formspree с JSON-данными
        const response = await fetch(form.action, {
          method: form.method,
          headers: { Accept: "application/json" },
          body: formData,
        });

        if (response.ok) {
          alert("Ваш запрос успешно отправлен!");
          form.reset();
        } else {
          const data = await response.json().catch(() => null);
          const message = data?.errors?.[0]?.message || "Не удалось отправить форму. Попробуйте позже.";
          alert(message);
        }
      } catch (error) {
        // Сетевой сбой или другая ошибка перехватывается здесь
        console.error("Ошибка отправки формы:", error);
        alert("Произошла ошибка при отправке. Попробуйте позже.");
      } finally {
        submitBtn?.removeAttribute("disabled");
      }
    });
  }

  // Дополнительно: лёгкая докрутка к ближайшей секции в конце прокрутки колесом

  // Чиним первый <source>, если у него нет расширения .mp4
  (function fixBrokenIgSource() {
    const bad = doc.querySelector('.ig-strip .ig-item video source[src*="BigBuckBunny"]');
    if (bad && !/\.mp4(\?|$)/i.test(bad.getAttribute('src') || '')) {
      bad.setAttribute('src', 'https://storage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4');
      const v = bad.closest('video');
      if (v && typeof v.load === 'function') v.load();
    }
  })();

  const prefersReducedMotionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
  const mobileServicesQuery = window.matchMedia('(max-width: 600px)');
  const cardsContainer = servicesSection ? servicesSection.querySelector('.cards') : doc.querySelector('.cards');
  const cards = cardsContainer ? Array.from(cardsContainer.querySelectorAll('.card')) : [];

  const captureCardLayout = (cardList) => {
    const scrollY = window.scrollY || window.pageYOffset;
    const scrollX = window.scrollX || window.pageXOffset;
    return new Map(
      cardList.map((item) => {
        const rect = item.getBoundingClientRect();
        return [item, {
          top: rect.top + scrollY,
          left: rect.left + scrollX,
          width: rect.width || 1,
          height: rect.height || 1,
        }];
      })
    );
  };

  const animateCardLayoutChange = (beforeMap, afterMap) => {
    afterMap.forEach((afterMetrics, card) => {
      const beforeMetrics = beforeMap.get(card);
      if (!beforeMetrics) return;

      const dx = beforeMetrics.left - afterMetrics.left;
      const dy = beforeMetrics.top - afterMetrics.top;
      const scaleX = beforeMetrics.width / afterMetrics.width;
      const scaleY = beforeMetrics.height / afterMetrics.height;

      const positionShiftMinimal = Math.abs(dx) < 0.5 && Math.abs(dy) < 0.5;
      const scaleShiftMinimal = Math.abs(1 - scaleX) < 0.01 && Math.abs(1 - scaleY) < 0.01;
      if (positionShiftMinimal && scaleShiftMinimal) return;

      card.animate(
        [
          { transform: `translate(${dx}px, ${dy}px) scale(${scaleX}, ${scaleY})` },
          { transform: 'translate(0, 0) scale(1, 1)' }
        ],
        {
          duration: 460,
          easing: 'cubic-bezier(0.22, 0.7, 0.18, 1)',
          fill: 'both',
        }
      );
    });
  };

  cards.forEach((card) => {
    card.addEventListener('click', () => {
      const isOpen = card.classList.contains('is-open');
      const shouldAnimate = mobileServicesQuery.matches && !prefersReducedMotionQuery.matches && cards.length > 0;
      const beforeLayout = shouldAnimate ? captureCardLayout(cards) : null;

      cards.forEach((c) => c.classList.remove('is-open'));
      if (!isOpen) {
        card.classList.add('is-open');
      }

      if (shouldAnimate && beforeLayout) {
        const afterLayout = captureCardLayout(cards);
        animateCardLayoutChange(beforeLayout, afterLayout);
      }
    });

    const updateSpotlight = createRafThrottle((clientX, clientY) => {
      const rect = card.getBoundingClientRect();
      card.style.setProperty('--x', `${clientX - rect.left}px`);
      card.style.setProperty('--y', `${clientY - rect.top}px`);
      card.style.setProperty('--opacity', 1);
    });

    card.addEventListener('mousemove', (event) => updateSpotlight(event.clientX, event.clientY));
    card.addEventListener('mouseleave', () => {
      card.style.setProperty('--opacity', 0);
    });
  });

  // Включаем прожектор при наведении на карточки тарифов
  const supportsHoverSpotlight = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  const pkgBodies = Array.from(doc.querySelectorAll('.pkg-body'));
  if (supportsHoverSpotlight) {
    pkgBodies.forEach((pkg) => {
      const updatePkgSpotlight = createRafThrottle((clientX, clientY) => {
        const rect = pkg.getBoundingClientRect();
        pkg.style.setProperty('--x', `${clientX - rect.left}px`);
        pkg.style.setProperty('--y', `${clientY - rect.top}px`);
        pkg.style.setProperty('--opacity', '1');
      });

      pkg.addEventListener('mousemove', (event) => updatePkgSpotlight(event.clientX, event.clientY));
      pkg.addEventListener('mouseleave', () => {
        pkg.style.setProperty('--opacity', '0');
      });
    });
  } else {
    pkgBodies.forEach((pkg) => {
      pkg.style.setProperty('--opacity', '0');
    });
  }

  // Включаем прожектор при наведении на текстовые поля
  const inputWrappers = Array.from(doc.querySelectorAll('.input-wrapper'));
  if (supportsHoverSpotlight) {
    inputWrappers.forEach((wrapper) => {
      const input = wrapper.querySelector('input, textarea');
      if (!input) return;

      const updateInputSpotlight = createRafThrottle((clientX, clientY) => {
        const rect = wrapper.getBoundingClientRect();
        wrapper.style.setProperty('--x', `${clientX - rect.left}px`);
        wrapper.style.setProperty('--y', `${clientY - rect.top}px`);
        wrapper.style.setProperty('--opacity', '1');
      });

      wrapper.addEventListener('mousemove', (event) => updateInputSpotlight(event.clientX, event.clientY));
      wrapper.addEventListener('mouseleave', () => {
        wrapper.style.setProperty('--opacity', '0');
      });
    });
  } else {
    inputWrappers.forEach((wrapper) => {
      wrapper.style.setProperty('--opacity', '0');
    });
  }

  const fullButton = doc.querySelector('.btn.full');
  fullButton?.addEventListener('mouseleave', (e) => {
    e.target.style.setProperty('--opacity', '0');
  });

  const sectionsForNav = new Map(
    headerNavLinks
      .map((link) => {
        const hash = link.getAttribute('href');
        if (!hash || !hash.startsWith('#')) return null;
        const section = doc.querySelector(hash);
        return section ? [section, link] : null;
      })
      .filter(Boolean)
  );

  if (sectionsForNav.size) {
    const navObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const link = sectionsForNav.get(entry.target);
          if (!link) return;
          link.classList.toggle('active', entry.isIntersecting);
        });
      },
      { threshold: 0.5 }
    );

    sectionsForNav.forEach((_, section) => navObserver.observe(section));
  }

  // Включаем прожектор в секции «Наши партнеры»
  const partnersSection = doc.querySelector("#partners");

  if (partnersSection) {
    const updatePartnersSpotlight = createRafThrottle((clientX, clientY) => {
      const rect = partnersSection.getBoundingClientRect();
      partnersSection.style.setProperty("--x", `${clientX - rect.left}px`);
      partnersSection.style.setProperty("--y", `${clientY - rect.top}px`);
      partnersSection.style.setProperty("--opacity", "1");
    });

    partnersSection.addEventListener("mousemove", (event) => updatePartnersSpotlight(event.clientX, event.clientY));
    partnersSection.addEventListener("mouseleave", () => {
      partnersSection.style.setProperty("--opacity", "0");
    });
  }

  // Прожектор только для заголовка в герое
  const heroSection = doc.getElementById("hero");
  const heroTitle = heroSection?.querySelector(".hero-content h1");

  if (heroSection && heroTitle) {
    const updateHeroSpotlight = createRafThrottle((clientX, clientY) => {
      const rect = heroTitle.getBoundingClientRect();
      heroTitle.style.setProperty("--x", `${clientX - rect.left}px`);
      heroTitle.style.setProperty("--y", `${clientY - rect.top}px`);
      heroTitle.style.setProperty("--spot-o", "1");
    });

    heroSection.addEventListener("mousemove", (event) => updateHeroSpotlight(event.clientX, event.clientY));
    heroSection.addEventListener("mouseleave", () => {
      heroTitle.style.setProperty("--spot-o", "0");
    });
  }
});