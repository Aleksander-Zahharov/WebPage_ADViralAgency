// Язык, который подставляется, если пользователь ещё ничего не выбирал
// Комментарий для теста
const DEFAULT_LANG = "en";
// Ключ в localStorage, где хранится выбранный язык
const LANG_STORAGE_KEY = "adviral-lang";
// Имя cookie, которым дублируем язык (на случай очистки localStorage)
const LANG_COOKIE_NAME = "adviral-lang";

// Поддерживаемые коды языков
const SUPPORTED_LANGS = ["ru", "en", "et"];

// Тестовый комментарий для проверки изменений

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
      partners: "Клиенты",
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
      description: {
        html: "<strong>ADViral Agency</strong> — агентство комплексного digital-продвижения брендов в социальных сетях и цифровой среде, ориентированное на рост и реальные бизнес-результаты. Мы базируемся в <strong>Таллине, Эстония</strong>, и работаем с проектами как на локальном, так и на международном рынке.<br><br>Наша цель — не просто присутствие бренда в онлайне, а его рост, узнаваемость и стабильный поток клиентов. Мы выстраиваем продвижение как целостную систему: от глубокой аналитики до креатива и масштабирования.<br><br>Мы объединяем стратегию, креатив и аналитику, чтобы создавать не просто контент, а измеримые бизнес-результаты.<br><br><strong>ADViral Agency</strong> — это команда, которая думает о бизнесе клиента как о своём собственном и берёт на себя ответственность за результат."
      },
      list: {},
    },
    services: {
      title: "Услуги для продвижения",
      cards: {
        strategy: {
          title: "Разработка и реализация стратегий продвижения",
          text: "Стратегии привлечения и удержания клиентов. Разработка маршрута роста бренда, охватов и конверсии.",
        },
        socialManagement: {
          title: "Ведение и развитие социальных сетей",
          text: "Instagram, Facebook, TikTok, YouTube: контент-план, визуал, единый стиль. Развитие присутствия бренда в соцсетях.",
        },
        adCampaigns: {
          title: "Запуск и оптимизация рекламных кампаний",
          text: "Таргетированная реклама, Google Ads, креативы. Постоянный анализ эффективности и оптимизация performance-кампаний.",
        },
        contentCreation: {
          title: "Создание видео- и фото-контента",
          text: "Контент для социальных сетей и рекламных форматов. Reels, TikTok, YouTube Shorts, сторис. Динамичные ролики и качественные визуалы.",
        },
        videoProduction: {
          title: "Профессиональная видеосъёмка и 3D-графика",
          text: "Видеопродакшн для рекламы и соцсетей. Создание 3D-графики, анимации и визуальных эффектов.",
        },
        design: {
          title: "Графический и веб-дизайн",
          text: "Разработка фирменного стиля, логотипов, баннеров и веб-дизайна. Создание визуальной идентичности бренда.",
        },
        webDevelopment: {
          title: "Разработка сайтов и программного обеспечения",
          text: "Создание веб-сайтов и ПО с нуля. Адаптивный дизайн, SEO-оптимизация и интеграция с рекламными системами.",
        },
        communityEngagement: {
          title: "Активность и продвижение в сообществах",
          text: "Диалог с аудиторией в группах, комментариях и обсуждениях. Продвижение бренда в сообществах.",
        },
        analysis: {
          title: "Анализ бренда, рынка и продуктовой линейки",
          text: "Глубокий анализ миссии, ценностей и целей компании. Исследование конкурентов, трендов и возможностей роста.",
        },
      },
    },
    works: {
      title: "Наши работы",
      subtitle: "Наши работы. Клик откроет видеоплеер.",
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
      title: "Наши клиенты",
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
      copy: "© 2026 ADViral Agency",
      email: "info@adviral.agency",
      social: {
        instagram: "",
        facebook: "",
        tiktok: "",
      },
    },
    email: {
      copied: "Сообщение скопировано!",
    },
    form: {
      sent: "Сообщение отправлено",
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
      partners: "Clients",
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
      description: {
        html: "<strong>ADViral Agency</strong> is a full-cycle digital marketing agency focused on brand growth and measurable business results across social media and the broader digital landscape. We are based in <strong>Tallinn, Estonia</strong>, and work with both local and international projects.<br><br>Our goal goes beyond simple online presence. We help brands grow, build strong recognition, and generate a consistent flow of new customers. We approach promotion as an integrated system — from in-depth analytics to creative execution and scalable growth.<br><br>We combine strategy, creativity, and data to deliver more than just content — we deliver measurable business results.<br><br><strong>ADViral Agency</strong> is a team that treats each client's business as its own and takes full responsibility for the outcome."
      },
      list: {
        campaigns: "SMM strategies and campaigns with viral potential",
        production: "Short‑form production for Reels, TikTok, YouTube Shorts",
        analytics: "Analytics, A/B testing, and continuous optimisation",
      },
    },
    services: {
      title: "Services for growth",
      cards: {
        strategy: {
          title: "Development and execution of promotion strategies",
          text: "Customer acquisition and retention strategies. Development of brand growth roadmap, reach, and conversion.",
        },
        socialManagement: {
          title: "Social media management and growth",
          text: "Instagram, Facebook, TikTok, YouTube: content planning, visuals, consistent branding. Brand presence development in social media.",
        },
        adCampaigns: {
          title: "Launch and optimization of advertising campaigns",
          text: "Targeted advertising, Google Ads, creative development. Continuous performance analysis and optimization of performance campaigns.",
        },
        contentCreation: {
          title: "Video and photo content creation",
          text: "Content for social media and advertising formats. Reels, TikTok, YouTube Shorts, Stories. Dynamic videos and high-quality visuals.",
        },
        videoProduction: {
          title: "Professional video production & 3D graphics",
          text: "Video production for advertising and social media. Creation of 3D graphics, animation, and visual effects.",
        },
        design: {
          title: "Graphic & web design",
          text: "Development of brand identity, logos, banners, and web design. Creation of visual brand identity.",
        },
        webDevelopment: {
          title: "Website and software development from scratch",
          text: "Creation of websites and software from scratch. Responsive design, SEO optimization, and integration with advertising systems.",
        },
        communityEngagement: {
          title: "Community engagement and promotion",
          text: "Active dialogue with audiences in groups, comments, and discussions. Brand promotion in communities.",
        },
        analysis: {
          title: "Brand, market, and product line analysis",
          text: "In-depth analysis of mission, values, and company goals. Competitor research, trends, and growth opportunities.",
        },
      },
    },
    works: {
      title: "Our work",
      subtitle: "Our work. Click to open in player.",
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
      title: "Our clients",
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
      copy: "© 2026 ADViral Agency",
      email: "info@adviral.agency",
      social: {
        instagram: "",
        facebook: "",
        tiktok: "",
      },
    },
    email: {
      copied: "Message copied!",
    },
    form: {
      sent: "Message sent",
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
      partners: "Kliendid",
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
      description: {
        html: "<strong>ADViral Agency</strong> on täisteenust pakkuv digiturundusagentuur, mis keskendub brändide kasvule ja mõõdetavatele ärilistele tulemustele sotsiaalmeedias ja digitaalses keskkonnas. Meie asukoht on <strong>Tallinn, Eesti</strong>, ning töötame nii kohalike kui ka rahvusvaheliste projektidega.<br><br>Meie eesmärk ei ole pelgalt brändi olemasolu veebis, vaid selle kasv, tuntuse suurendamine ja stabiilse kliendivoo loomine. Läheneme turundusele tervikliku süsteemina — alates põhjalikust analüüsist kuni loovlahenduste ja skaleeritava kasvuni.<br><br>Ühendame strateegia, loovuse ja andmed, et pakkuda enamat kui lihtsalt sisu — saavutame reaalseid ja mõõdetavaid ärilisi tulemusi.<br><br><strong>ADViral Agency</strong> on meeskond, kes suhtub kliendi ärisse nagu enda omasse ja võtab vastutuse tulemuste eest."
      },
      list: {
        campaigns: "SMM‑strateegiad ja viirusliku potentsiaaliga kampaaniad",
        production: "Lühivideod Reelsi, TikToki ja YouTube Shortsi jaoks",
        analytics: "Analüütika, A/B‑testid ja pidev optimeerimine",
      },
    },
    services: {
      title: "Teenused kasvuks",
      cards: {
        strategy: {
          title: "Turundusstrateegiate väljatöötamine ja elluviimine",
          text: "Kliendide kaasamise ja hoidmise strateegiad. Brändi kasvu, haarde ja konversiooni marsruudi väljatöötamine.",
        },
        socialManagement: {
          title: "Sotsiaalmeedia haldamine ja arendamine",
          text: "Instagram, Facebook, TikTok, YouTube: sisukalender, visuaal, ühtne stiil. Brändi kohalolu arendamine sotsiaalmeedias.",
        },
        adCampaigns: {
          title: "Reklaamikampaaniate käivitamine ja optimeerimine",
          text: "Sihitud reklaamid, Google Ads, loovlahendused. Pidev tulemuslikkuse analüüs ja performance-kampaaniate optimeerimine.",
        },
        contentCreation: {
          title: "Video- ja fotokontendi loomine",
          text: "Kontent sotsiaalmeediale ja reklaamiformaatidele. Reels, TikTok, YouTube Shorts, lood. Dünaamilised videod ja kvaliteetsed visuaalid.",
        },
        videoProduction: {
          title: "Professionaalne videoproduktsioon ja 3D-graafika",
          text: "Videoproduktsioon reklaamiks ja sotsiaalmeediale. 3D-graafika, animatsiooni ja visuaalefektide loomine.",
        },
        design: {
          title: "Graafiline ja veebidisain",
          text: "Firmastiili, logode, bännerite ja veebidisaini väljatöötamine. Visuaalse brändiidentiteedi loomine.",
        },
        webDevelopment: {
          title: "Veebilehtede ja tarkvara arendus nullist",
          text: "Veebilehtede ja tarkvara loomine nullist. Adaptiivne disain, SEO-optimeerimine ja integratsioon reklaamisüsteemidega.",
        },
        communityEngagement: {
          title: "Kogukondade aktiveerimine ja brändi nähtavuse tõstmine",
          text: "Aktiivne dialoog sihtrühmaga gruppides, kommentaarides ja aruteludes. Brändi edendamine kogukondades.",
        },
        analysis: {
          title: "Brändi, turu ja tooteportfelli analüüs",
          text: "Põhjalik analüüs ettevõtte missioonist, väärtustest ja eesmärkidest. Konkurentide ja trendide uuring ning kasvuvõimalused.",
        },
      },
    },
    works: {
      title: "Meie tööd",
      subtitle: "Meie tööd. Klõps avab videomängija.",
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
      title: "Meie kliendid",
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
      copy: "© 2026 ADViral Agency",
      email: "info@adviral.agency",
      social: {
        instagram: "",
        facebook: "",
        tiktok: "",
      },
    },
    email: {
      copied: "Sõnum kopeeritud!",
    },
    form: {
      sent: "Sõnum saadetud",
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

  let isAutoScrolling = false;

  function smoothScrollToTargetTop(el) {
    if (!el || isAutoScrolling) return; // Не начинаем новый скролл, если старый еще идет
    
    // Блокируем другие автоскроллы
    isAutoScrolling = true;
    
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
      // Разблокируем автоскролл с запасом времени
      setTimeout(() => { isAutoScrolling = false; }, 300);
    }, 800); // Увеличиваем время ожидания завершения скролла
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

  // Auto-scroll sections behavior - ОТКЛЮЧЕНО ПОЛНОСТЬЮ
  // Автодокрутка секций полностью удалена по требованию
  const autoScrollEls = doc.querySelectorAll(".auto-scroll");
  if (autoScrollEls.length) {
    // Только запускаем волну карточек для секции Services, автодокрутка отключена
    const mobileIO = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && entry.target === servicesSection) {
            prepareServicesWave();
          }
        });
      },
      { threshold: 0.1 }
    );
    autoScrollEls.forEach((el) => mobileIO.observe(el));
  }

  // Instagram-like slider — горизонтальная витрина кейсов
  // Обрабатываем все ленты (вертикальные и горизонтальные)
  const igSliders = doc.querySelectorAll(".ig-slider");
  const igStrips = doc.querySelectorAll(".ig-strip");
  
  // Для обратной совместимости оставляем старые переменные для первой ленты
  const igSlider = igSliders[0];
  const igStrip = igStrips[0];

  function getScrollStep() {
    if (!igStrip) return 320;
    const first = igStrip.querySelector(".ig-item");
    const cs = getComputedStyle(igStrip);
    const gap = parseFloat(cs.gap || cs.columnGap || '0') || 0;
    const w = first ? first.getBoundingClientRect().width : 240;
    return Math.max(160, w + gap);
  }

  let hoverRafId = null;
  let pressRafId = null;

  function stopHover() {
    if (hoverRafId) {
      cancelAnimationFrame(hoverRafId);
      hoverRafId = null;
    }
  }

  function stopPress() {
    if (pressRafId) {
      cancelAnimationFrame(pressRafId);
      pressRafId = null;
    }
  }

  function startRafScroll(dir, speedPxPerSec, assignId) {
    if (!igStrip) return;
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
    }
  }

  function startHoverScroll(dir, speed) {
    if (!igStrip) return;
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
    }
  }

  function rewireArrow(el, dir) {
    if (!el) return null;
    const btn = el.cloneNode(true);
    el.replaceWith(btn);
    
    // Находим соответствующую ленту для этой стрелки
    const slider = btn.closest(".ig-slider");
    const strip = slider?.querySelector(".ig-strip");
    
    let pressStartTime = 0;
    let pressRafId = null;
    let hoverRafId = null;

    function startPressScrollForStrip(dir, speed) {
      if (!strip) return;
      let lastTime = performance.now();
      function scrollFrame(now) {
        const deltaTime = (now - lastTime) / 1000;
        lastTime = now;
        strip.scrollLeft += dir * speed * deltaTime * 2;
        pressRafId = requestAnimationFrame(scrollFrame);
      }
      pressRafId = requestAnimationFrame(scrollFrame);
    }

    function stopPressScrollForStrip() {
      if (pressRafId) {
        cancelAnimationFrame(pressRafId);
        pressRafId = null;
      }
    }

    function startHoverScrollForStrip(dir, speed) {
      if (!strip) return;
      let lastTime = performance.now();
      function scrollFrame(now) {
        const deltaTime = (now - lastTime) / 1000;
        lastTime = now;
        strip.scrollLeft += dir * speed * deltaTime * 0.5;
        hoverRafId = requestAnimationFrame(scrollFrame);
      }
      hoverRafId = requestAnimationFrame(scrollFrame);
    }

    function stopHoverScrollForStrip() {
      if (hoverRafId) {
        cancelAnimationFrame(hoverRafId);
        hoverRafId = null;
      }
    }

    btn.addEventListener("pointerdown", (e) => {
      e.preventDefault();
      btn.setPointerCapture?.(e.pointerId);
      pressStartTime = performance.now();
      startPressScrollForStrip(dir, 300);
    });
    btn.addEventListener("pointerup", (e) => {
      btn.releasePointerCapture?.(e.pointerId);
      stopPressScrollForStrip();
    });
    btn.addEventListener("pointerleave", () => {
      stopPressScrollForStrip();
      stopHoverScrollForStrip();
    });
    btn.addEventListener("lostpointercapture", () => {
      stopPressScrollForStrip();
      stopHoverScrollForStrip();
    });
    btn.addEventListener("pointerenter", () => startHoverScrollForStrip(dir, 300));

    // Prevent click (next/prev step) if we held the button for scrolling
    btn.addEventListener("click", (e) => {
        if (performance.now() - pressStartTime > 250) {
            e.preventDefault();
            e.stopPropagation();
            e.stopImmediatePropagation();
        }
    });

    return btn;
  }

  // Обрабатываем стрелки для всех лент
  igSliders.forEach((slider) => {
    const strip = slider.querySelector(".ig-strip");
    if (!strip) return;
    
    // Ищем стрелки в родительском контейнере, так как они находятся вне .ig-slider
    const container = slider.closest(".container");
    if (!container) return;
    
    // Находим стрелки, которые находятся рядом с этим слайдером в DOM
    // Стрелки находятся перед и после .ig-slider
    const containerChildren = Array.from(container.children);
    const sliderIndex = containerChildren.indexOf(slider);
    
    let prevArrow = null;
    let nextArrow = null;
    
    // Ищем prev стрелку перед слайдером
    for (let i = sliderIndex - 1; i >= 0; i--) {
      const child = containerChildren[i];
      if (child.classList.contains("ig-arrow") && child.classList.contains("prev")) {
        prevArrow = child;
        break;
      }
    }
    
    // Ищем next стрелку после слайдера
    for (let i = sliderIndex + 1; i < containerChildren.length; i++) {
      const child = containerChildren[i];
      if (child.classList.contains("ig-arrow") && child.classList.contains("next")) {
        nextArrow = child;
        break;
      }
    }

    function scrollStripBy(direction) {
      if (!strip) return;
      const scrollAmount = strip.offsetWidth / 2;
      strip.scrollBy({ left: direction * scrollAmount, behavior: "smooth" });
    }

    // Добавляем обработчики клика для стрелок
    if (prevArrow) {
      prevArrow.addEventListener("click", (e) => {
        e.preventDefault();
        e.stopPropagation();
        scrollStripBy(-1);
      });
    }
    
    if (nextArrow) {
      nextArrow.addEventListener("click", (e) => {
        e.preventDefault();
        e.stopPropagation();
        scrollStripBy(1);
      });
    }
  });

  // Для обратной совместимости оставляем обработку первой ленты
  if (igSlider && igStrip) {
    const prevArrow = igSlider.querySelector(".ig-arrow.prev");
    const nextArrow = igSlider.querySelector(".ig-arrow.next");

    function scrollStripBy(direction) {
      if (!igStrip) return;
      const scrollAmount = igStrip.offsetWidth / 2;
      igStrip.scrollBy({ left: direction * scrollAmount, behavior: "smooth" });
    }

    prevArrow?.addEventListener("click", () => scrollStripBy(-1));
    nextArrow?.addEventListener("click", () => scrollStripBy(1));
  }

  // Обрабатываем drag для всех лент
  igStrips.forEach((strip) => {
    let isDragging = false;
    let dragStartX = 0;
    let dragStartScroll = 0;

    const stopDrag = (evt) => {
      if (!isDragging) return;
      isDragging = false;
      delete strip.dataset.dragging;
      if (evt?.pointerId !== undefined) {
        strip.releasePointerCapture?.(evt.pointerId);
      }
    };

    strip.addEventListener("pointerdown", (evt) => {
      // Пропускаем клики на видео элементы - они обрабатываются отдельно
      const item = evt.target.closest(".ig-item");
      if (item && item.hasAttribute("data-video")) {
        return; // Не начинаем drag для видео элементов
      }
      
      // Обычный drag для прокрутки
      isDragging = true;
      dragStartX = evt.clientX;
      dragStartScroll = strip.scrollLeft;
      strip.dataset.dragging = "true";
      strip.setPointerCapture?.(evt.pointerId);
    });

    strip.addEventListener("pointermove", (evt) => {
      if (!isDragging) return;
      const delta = evt.clientX - dragStartX;
      strip.scrollLeft = dragStartScroll - delta;
    });

    strip.addEventListener("pointerup", stopDrag);
    strip.addEventListener("pointerleave", stopDrag);
    strip.addEventListener("lostpointercapture", stopDrag);
  });

  // Оптимизированная загрузка и автоплей видео для всех лент
  // Загружаем видео последовательно в фоновом режиме сразу после загрузки страницы
  igStrips.forEach((strip) => {
    const igVideos = Array.from(strip.querySelectorAll("video"));
    if (igVideos.length === 0) return;

    // Очередь для последовательной загрузки видео
    let loadingQueue = [...igVideos]; // Сразу добавляем все видео в очередь
    let isLoading = false;

    // Функция для загрузки следующего видео из очереди
    function loadNextVideo() {
      if (isLoading || loadingQueue.length === 0) return;
      
      const video = loadingQueue.shift();
      if (!video || video.dataset.loaded === "true") {
        loadNextVideo();
        return;
      }

      isLoading = true;
      video.dataset.loaded = "true";
      
      // Используем превью версию видео для ленты
      const item = video.closest(".ig-item");
      const previewSrc = item?.dataset.videoPreview;
      const source = video.querySelector("source");
      
      // Если есть превью версия, используем её для ленты
      if (previewSrc && source) {
        source.src = previewSrc;
      } else if (source && !source.src) {
        // Fallback на обычный источник если превью нет
        const normalSrc = item?.dataset.video;
        if (normalSrc) {
          source.src = normalSrc;
        }
      }
      
      // Загружаем metadata для начала
      video.preload = "metadata";
      video.muted = true;
      video.loop = true;
      video.load();
      
      video.addEventListener("loadedmetadata", () => {
        isLoading = false;
        
        // После загрузки metadata начинаем подгружать само видео в фоне
        const loadFullVideo = () => {
          video.preload = "auto";
          // Не вызываем load() повторно если не нужно, но для уверенности в фоне:
          // Если видео уже во viewport, оно должно начать играть
          const rect = video.getBoundingClientRect();
          const isVisible = rect.top < window.innerHeight + 200 && rect.bottom > -200;
          if (isVisible) {
            video.play().catch(() => {});
          }
        };
        
        if (window.requestIdleCallback) {
          requestIdleCallback(loadFullVideo, { timeout: 2000 });
        } else {
          setTimeout(loadFullVideo, 200);
        }
        
        // Переходим к следующему видео в очереди
        loadNextVideo();
      }, { once: true });
      
      // Таймаут на случай если событие не сработает
      setTimeout(() => {
        if (isLoading) {
          isLoading = false;
          loadNextVideo();
        }
      }, 3000);
    }

    // IntersectionObserver для play/pause
    const videoObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const video = entry.target;
          
          if (entry.isIntersecting) {
            // Если видео вошло в viewport, пробуем запустить
            // Если оно еще не загружено, оно подхватится очередью или loadNextVideo
            if (video.readyState >= 2) {
              video.play().catch(() => {});
            } else if (video.dataset.loaded === "true") {
              // Если в процессе загрузки, ставим preload="auto" чтобы ускориться
              video.preload = "auto";
            }
          } else {
            // Видео не видно - останавливаем
            video.pause();
          }
        });
      },
      {
        threshold: 0.1,
        rootMargin: "300px"
      }
    );

    // Инициализируем видео и начинаем фоновую загрузку
    igVideos.forEach((video) => {
      video.muted = true;
      video.loop = true;
      videoObserver.observe(video);
    });

    // Запускаем фоновую загрузку через небольшую паузу после DOMContentLoaded
    if (window.requestIdleCallback) {
      requestIdleCallback(() => loadNextVideo(), { timeout: 1000 });
    } else {
      setTimeout(loadNextVideo, 500);
    }
  });

  // Модальное окно видеоплеера с Plyr
  (function setupVideoModal() {
    const modal = doc.getElementById("video-modal");
    const modalOverlay = modal?.querySelector(".video-modal-overlay");
    const modalClose = modal?.querySelector(".video-modal-close");
    const modalPlayer = doc.getElementById("modal-video-player");
    const prevBtn = doc.getElementById("modal-prev-btn");
    const nextBtn = doc.getElementById("modal-next-btn");
    
    if (!modal || !modalPlayer) {
      console.warn("Video modal elements not found");
      return;
    }

    let player = null;
    let currentVideoSrc = "";
    let currentIndex = -1;
    let videoItems = [];

    // Обновляем список видео элементов
    function updateVideoItems() {
      videoItems = Array.from(doc.querySelectorAll(".ig-item[data-video]"));
    }

    function getVideoSource(item) {
      // Для модального окна используем высокое качество (data-video-high или data-video)
      // Сначала проверяем data-video-high для высокого качества
      if (item.dataset.videoHigh) {
        return item.dataset.videoHigh;
      }
      
      // Затем проверяем обычный data-video атрибут
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

    function setupQualitySources(videoSrc) {
      // Устанавливаем источник видео
      const source = modalPlayer.querySelector("source");
      if (source) {
        source.src = videoSrc;
      }
      // Также устанавливаем src напрямую на video элемент
      modalPlayer.src = videoSrc;
    }

    function updateNavigationState() {
      if (currentIndex === -1) {
        if (prevBtn) prevBtn.style.display = 'none';
        if (nextBtn) nextBtn.style.display = 'none';
        return;
      }

      if (prevBtn) prevBtn.style.display = 'flex';
      if (nextBtn) nextBtn.style.display = 'flex';
    }

    function navigateVideo(direction) {
      updateVideoItems();
      if (videoItems.length === 0) return;

      let newIndex = currentIndex + direction;
      
      // Зацикливаем навигацию
      if (newIndex < 0) newIndex = videoItems.length - 1;
      if (newIndex >= videoItems.length) newIndex = 0;

      const newItem = videoItems[newIndex];
      const newSrc = getVideoSource(newItem);

      if (newSrc) {
        // Если плеер уже играет, ставим на паузу перед переключением
        if (player) {
          player.pause();
        } else {
          modalPlayer.pause();
        }

        currentIndex = newIndex;
        currentVideoSrc = newSrc;
        
        setupQualitySources(newSrc);
        
        if (player) {
          // Для Plyr нужно обновить источник через API
          player.source = {
            type: 'video',
            sources: [
              {
                src: newSrc,
                type: 'video/mp4',
              },
            ],
          };
          
          player.once("ready", () => {
             player.play().catch(() => {});
          });
        } else {
          modalPlayer.load();
          modalPlayer.play().catch(() => {});
        }
        
        updateNavigationState();
      }
    }

    function initPlayer() {
      if (player) {
        return; // Уже инициализирован
      }

      // Проверяем наличие Plyr перед инициализацией
      if (typeof Plyr === "undefined") {
        console.warn("Plyr not available, using standard HTML5 video");
        modalPlayer.controls = true;
        return;
      }

      try {
        // Убеждаемся, что video элемент виден
        modalPlayer.style.display = "block";
        modalPlayer.style.width = "100%";
        modalPlayer.style.height = "100%";
        
        player = new Plyr(modalPlayer, {
          controls: [
            "play-large",
            "play",
            "progress",
            "current-time",
            "duration",
            "mute",
            "volume",
            "settings",
            // "pip", // Removed as requested
            "airplay",
            "fullscreen"
          ],
          settings: ["quality", "speed"],
          quality: {
            default: 720,
            options: [1080, 720, 480, 360],
            forced: true,
            onChange: (quality) => {
              // В будущем здесь можно добавить логику переключения между разными источниками
            }
          },
          speed: {
            selected: 1,
            options: [0.5, 0.75, 1, 1.25, 1.5, 1.75, 2]
          },
          keyboard: {
            focused: true,
            global: false
          },
          autoplay: false,
          clickToPlay: true,
          ratio: null, // Отключаем автоматическое соотношение сторон, используем наш контейнер
          volume: 0.5 // Устанавливаем дефолтную громкость на 50%
        });

        // Обработка ошибок загрузки
        player.on("error", (event) => {
          console.error("Plyr error:", event.detail);
        });
        
        // Проверяем, что Plyr правильно инициализировался
        player.on("ready", () => {
          // console.log("Plyr ready");
        });
      } catch (error) {
        console.error("Error initializing Plyr:", error);
        // Fallback на стандартный HTML5 video
        modalPlayer.controls = true;
      }
    }

    function openModal(videoSrc, itemElement) {
      if (!videoSrc) {
        console.warn("No video source found");
        return;
      }

      updateVideoItems();
      if (itemElement) {
        currentIndex = videoItems.indexOf(itemElement);
      } else {
        // Пытаемся найти по src если элемент не передан
        currentIndex = videoItems.findIndex(item => getVideoSource(item) === videoSrc);
      }

      updateNavigationState();

      currentVideoSrc = videoSrc;

      // Устанавливаем источник видео
      setupQualitySources(videoSrc);

      // Инициализируем Plyr при первом открытии
      if (!player && typeof Plyr !== "undefined") {
        initPlayer();
      }

      // Если Plyr не инициализирован, используем стандартный HTML5 video
      if (!player) {
        modalPlayer.controls = true;
        modalPlayer.load();
      } else {
        // Обновляем источники видео для Plyr через API, если он уже создан, или просто load если только что создан
        // Но лучше всегда использовать source setter если плеер готов, или src attr если нет.
        // Выше мы уже установили src атрибут.
        
        // Важно: если плеер уже был создан, просто смена атрибута src может не сработать в Plyr v3
        if (player.source) {
             player.source = {
                type: 'video',
                sources: [{ src: videoSrc, type: 'video/mp4' }]
             };
        } else {
             // Первый запуск
             modalPlayer.load();
        }
      }
      
      modal.hidden = false;
      document.body.style.overflow = "hidden";
      
      // Воспроизводим после загрузки
      if (player) {
        player.once("ready", () => { // Ждем ready для нового source
          player.play().catch((err) => {
            // Автоплей может быть заблокирован политикой браузера - это нормально
          });
        });
        // Если плеер уже был готов и мы просто сменили сурс, событие ready может сработать быстро или мы его пропустим?
        // Plyr usually fires ready after source change.
        
        setTimeout(() => {
          if (player) {
            player.focus();
          }
        }, 100);
      } else {
        // Fallback для стандартного HTML5 video
        const playHandler = () => {
          modalPlayer.play().catch((err) => {
            // Автоплей может быть заблокирован политикой браузера - это нормально
          });
        };
        modalPlayer.addEventListener("loadeddata", playHandler, { once: true });
        // Также пробуем play сразу, если видео уже загружено
        if (modalPlayer.readyState >= 2) {
          playHandler();
        }
      }
    }

    function closeModal() {
      if (player) {
        player.pause();
        player.currentTime = 0;
      } else {
        modalPlayer.pause();
        modalPlayer.currentTime = 0;
      }
      currentVideoSrc = "";
      modal.hidden = true;
      document.body.style.overflow = "";
    }

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

    // Навигация по стрелкам
    if (prevBtn) {
        prevBtn.addEventListener("click", (e) => {
            e.stopPropagation();
            navigateVideo(-1);
        });
    }
    
    if (nextBtn) {
        nextBtn.addEventListener("click", (e) => {
            e.stopPropagation();
            navigateVideo(1);
        });
    }

    // Закрытие по Escape и навигация стрелками клавиатуры
    doc.addEventListener("keydown", (e) => {
      if (modal.hidden) return;
      
      if (e.key === "Escape") {
        closeModal();
      } else if (e.key === "ArrowLeft") {
          // Если фокус не в инпуте (например, громкость)
          if (document.activeElement.tagName !== 'INPUT') {
             navigateVideo(-1);
          }
      } else if (e.key === "ArrowRight") {
          if (document.activeElement.tagName !== 'INPUT') {
             navigateVideo(1);
          }
      }
    });

    // Обработчик клика для открытия модального окна
    // Используем pointer events для лучшей совместимости
    // Обрабатываем все видео элементы во всех лентах
    const igItems = doc.querySelectorAll(".ig-item[data-video]");
    
    igItems.forEach((item) => {
      let pointerDownX = 0;
      let pointerDownY = 0;
      let hasMoved = false;
      let isPointerDown = false; // Булевый флаг для отслеживания pointerdown
      
      item.addEventListener("pointerdown", (e) => {
        pointerDownX = e.clientX;
        pointerDownY = e.clientY;
        hasMoved = false;
        isPointerDown = true; // Устанавливаем флаг
        // Предотвращаем захват pointer для drag логики
        e.stopPropagation();
      });
      
      item.addEventListener("pointermove", (e) => {
        if (isPointerDown) { // Используем булевый флаг вместо проверки координат
          const deltaX = Math.abs(e.clientX - pointerDownX);
          const deltaY = Math.abs(e.clientY - pointerDownY);
          if (deltaX > 5 || deltaY > 5) {
            hasMoved = true;
          }
        }
      });
      
      item.addEventListener("pointerup", (e) => {
        // Если был drag, не открываем модальное окно
        if (hasMoved) {
          // Сброс состояния
          pointerDownX = 0;
          pointerDownY = 0;
          hasMoved = false;
          isPointerDown = false;
          return;
        }
        
        // Проверяем, не было ли перетаскивания ленты
        const igStrip = item.closest(".ig-strip");
        if (igStrip && igStrip.dataset.dragging === "true") {
          // Сброс состояния
          pointerDownX = 0;
          pointerDownY = 0;
          hasMoved = false;
          isPointerDown = false;
          return;
        }
        
        // Открываем модальное окно только если был клик (не drag)
        if (isPointerDown) {
          e.preventDefault();
          e.stopPropagation();
          
          const videoSrc = getVideoSource(item);
          if (videoSrc) {
            openModal(videoSrc, item); // Передаем элемент для определения индекса
          }
        }
        
        // Сброс состояния
        pointerDownX = 0;
        pointerDownY = 0;
        hasMoved = false;
        isPointerDown = false;
      });
      
      // Также обрабатываем обычный click для совместимости
      item.addEventListener("click", (e) => {
        const igStrip = item.closest(".ig-strip");
        if (igStrip && igStrip.dataset.dragging === "true") {
          return;
        }
        
        if (hasMoved) {
          return;
        }
        
        e.preventDefault();
        e.stopPropagation();
        
        const videoSrc = getVideoSource(item);
        if (videoSrc) {
          openModal(videoSrc, item);
        }
      });
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
      const emailField = form.querySelector('input[name="email"]');
      const nameField = form.querySelector('input[name="name"]');
      const emailValue = emailField?.value || '';
      const nameValue = nameField?.value || '';
      
      // Устанавливаем reply-to на email отправителя для правильной доставки
      if (emailValue) {
        formData.set("_replyto", emailValue);
      }
      
      // Улучшенный subject с информацией об отправителе
      const subject = nameValue 
        ? `Новый запрос от ${nameValue} - ADViral Agency`
        : "Новый запрос с сайта ADViral Agency";
      formData.set("_subject", subject);
      
      // Добавляем информацию о компании, если указана
      const companyField = form.querySelector('input[name="company"]');
      if (companyField?.value) {
        formData.set("_subject", `${subject} (${companyField.value})`);
      }

      try {
        // Отправляем запрос на Formspree с JSON-данными
        const response = await fetch(form.action, {
          method: form.method,
          headers: { Accept: "application/json" },
          body: formData,
        });

        if (response.ok) {
          // Создаем уведомление о успешной отправке
          const notification = doc.createElement("div");
          notification.className = "email-copy-notification";
          notification.setAttribute("data-i18n", "form.sent");
          doc.body.appendChild(notification);
          
          // Применяем перевод
          const currentLang = doc.documentElement.lang || "ru";
          applyLanguage(currentLang);
          
          // Показываем уведомление
          setTimeout(() => {
            notification.classList.add("show");
          }, 10);
          
          // Скрываем уведомление через 2 секунды
          setTimeout(() => {
            notification.classList.remove("show");
            setTimeout(() => {
              if (doc.body.contains(notification)) {
                doc.body.removeChild(notification);
              }
            }, 300);
          }, 2000);
          
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

  // Копирование email при клике
  const emailLink = doc.getElementById("email-link");
  if (emailLink) {
    emailLink.addEventListener("click", async (e) => {
      e.preventDefault();
      const email = emailLink.textContent.trim();
      
      try {
        await navigator.clipboard.writeText(email);
        
        // Создаем уведомление
        const notification = doc.createElement("div");
        notification.className = "email-copy-notification";
        notification.setAttribute("data-i18n", "email.copied");
        doc.body.appendChild(notification);
        
        // Применяем перевод
        const currentLang = doc.documentElement.lang || "ru";
        applyLanguage(currentLang);
        
        // Показываем уведомление
        setTimeout(() => {
          notification.classList.add("show");
        }, 10);
        
        // Скрываем уведомление через 2 секунды
        setTimeout(() => {
          notification.classList.remove("show");
          setTimeout(() => {
            doc.body.removeChild(notification);
          }, 300);
        }, 2000);
      } catch (err) {
        console.error("Ошибка копирования:", err);
        // Fallback для старых браузеров
        const textArea = doc.createElement("textarea");
        textArea.value = email;
        textArea.style.position = "fixed";
        textArea.style.opacity = "0";
        doc.body.appendChild(textArea);
        textArea.select();
        try {
          doc.execCommand("copy");
          const notification = doc.createElement("div");
          notification.className = "email-copy-notification";
          notification.setAttribute("data-i18n", "email.copied");
          doc.body.appendChild(notification);
          
          // Применяем перевод
          const currentLang = doc.documentElement.lang || "ru";
          applyLanguage(currentLang);
          setTimeout(() => {
            notification.classList.add("show");
          }, 10);
          setTimeout(() => {
            notification.classList.remove("show");
            setTimeout(() => {
              doc.body.removeChild(notification);
            }, 300);
          }, 2000);
        } catch (err2) {
          console.error("Ошибка fallback копирования:", err2);
        }
        doc.body.removeChild(textArea);
      }
    });
  }

  // Копирование телефона при клике
  const phoneLink = doc.getElementById("phone-link");
  if (phoneLink) {
    phoneLink.addEventListener("click", async (e) => {
      e.preventDefault();
      const phone = phoneLink.textContent.trim();
      
      try {
        await navigator.clipboard.writeText(phone);
        
        // Создаем уведомление
        const notification = doc.createElement("div");
        notification.className = "email-copy-notification";
        notification.setAttribute("data-i18n", "email.copied");
        doc.body.appendChild(notification);
        
        // Применяем перевод
        const currentLang = doc.documentElement.lang || "ru";
        applyLanguage(currentLang);
        
        // Показываем уведомление
        setTimeout(() => {
          notification.classList.add("show");
        }, 10);
        
        // Скрываем уведомление через 2 секунды
        setTimeout(() => {
          notification.classList.remove("show");
          setTimeout(() => {
            doc.body.removeChild(notification);
          }, 300);
        }, 2000);
      } catch (err) {
        console.error("Ошибка копирования:", err);
        // Fallback для старых браузеров
        const textArea = doc.createElement("textarea");
        textArea.value = phone;
        textArea.style.position = "fixed";
        textArea.style.opacity = "0";
        doc.body.appendChild(textArea);
        textArea.select();
        try {
          doc.execCommand("copy");
          const notification = doc.createElement("div");
          notification.className = "email-copy-notification";
          notification.setAttribute("data-i18n", "email.copied");
          doc.body.appendChild(notification);
          
          // Применяем перевод
          const currentLang = doc.documentElement.lang || "ru";
          applyLanguage(currentLang);
          setTimeout(() => {
            notification.classList.add("show");
          }, 10);
          setTimeout(() => {
            notification.classList.remove("show");
            setTimeout(() => {
              doc.body.removeChild(notification);
            }, 300);
          }, 2000);
        } catch (err2) {
          console.error("Ошибка fallback копирования:", err2);
        }
        doc.body.removeChild(textArea);
      }
    });
  }
});