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
        html: "<strong>ADViral Agency</strong> — агентство комплексного digital-продвижения брендов в социальных сетях и цифровой среде, ориентированное на рост и реальные бизнес-результаты. Мы базируемся в <strong>Таллине, Эстония</strong>, и работаем с проектами как на локальном, так и на международном рынке.<br><br>Наша цель — не просто присутствие бренда в онлайне, а его рост, узнаваемость и стабильный поток клиентов. Мы выстраиваем продвижение системно: от аналитики до креатива и масштабирования.<br><br>Мы объединяем стратегию, креатив и аналитику, чтобы создавать не просто контент, а измеримые бизнес-результаты.<br><br><strong>ADViral Agency</strong> — это команда, которая думает о бизнесе клиента как о своём собственном и берёт на себя ответственность за результат."
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
        interestedServices: "Интересующие услуги",
        interestedServicesPlaceholder: "Выберите услуги",
        budget: { placeholder: "Ваш бюджет, нап: 990€" },
        message: { placeholder: "Коротко опишите задачу" },
        submit: "Отправить запрос",
        saveServicesSelection: "Сохранить выбор",
      },
    },
    footer: {
      copy: "© 2026 ADViral Agency",
      authorLabel: "Made by",
      authorCredits: "Сделано самым классным, красивым, замечательным, умным, креативным, находчивым, бесстрашным, талантливым, легендарным, харизматичным, проницательным, великолепным, блестящим, виртуозным, амбициозным, прогрессивным, неповторимым, атлетичным, эрудированным, дальновидным, безупречным, искрометным, галантным, целеустремленным, вдохновляющим, энергичным, оригинальным, выдающимся, эффектным, мудрым, надежным, решительным, многогранным, тактичным, искусным, благородным, уникальным, феноменальным, эстетичным, неутомимым, аттрактивным, авторитетным, непревзойденным, изобретательным, хайповым, незаменимым, жизнерадостным, глубоким, статным и скромным человеком — Александром Захаровым 🕶️",
      authorCreditsAria: "О создателе",
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
        interestedServices: "Interested services",
        interestedServicesPlaceholder: "Select services",
        budget: { placeholder: "Your budget, e.g.: 990€" },
        message: { placeholder: "Briefly describe the task" },
        submit: "Send request",
        saveServicesSelection: "Save selection",
      },
    },
    footer: {
      copy: "© 2026 ADViral Agency",
      authorLabel: "Made by",
      authorCredits: "Made by the coolest, most beautiful, wonderful, smart, creative, resourceful, fearless, talented, legendary, charismatic, insightful, magnificent, brilliant, virtuoso, ambitious, progressive, one-of-a-kind, athletic, erudite, visionary, impeccable, sparkling, gallant, determined, inspiring, energetic, original, outstanding, striking, wise, reliable, decisive, multifaceted, tactful, skillful, noble, unique, phenomenal, aesthetic, tireless, attractive, authoritative, unsurpassed, inventive, hype, irreplaceable, cheerful, profound, stately and modest person — Alexander Zahharov 🕶️",
      authorCreditsAria: "Credits",
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
        html: "<strong>ADViral Agency</strong> on täisteenust pakkuv digiturundusagentuur, mis keskendub brändide kasvule ja mõõdetavatele ärilistele tulemustele sotsiaalmeedias ja digitaalses keskkonnas. Meie asukoht on <strong>Tallinn, Eesti</strong>, ning töötame nii kohalike kui ka rahvusvaheliste projektidega.<br><br>Meie eesmärk ei ole brändi olemasolu veebis, vaid selle kasv, tuntuse suurendamine ja stabiilse kliendivoo loomine. Läheneme turundusele tervikliku süsteemina — alates põhjalikust analüüsist kuni loovlahenduste ja skaleeritava kasvuni.<br><br>Ühendame strateegia, loovuse ja andmed, et pakkuda enamat kui lihtsalt sisu — saavutame reaalseid ja mõõdetavaid ärilisi tulemusi.<br><br><strong>ADViral Agency</strong> on meeskond, kes suhtub kliendi ärisse nagu enda omasse ja võtab vastutuse tulemuste eest."
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
        interestedServices: "Teenused, mis teid huvitavad",
        interestedServicesPlaceholder: "Vali teenused",
        budget: { placeholder: "Teie eelarve, nt: 990€" },
        message: { placeholder: "Kirjelda lühidalt vajadust" },
        submit: "Saada päring",
        saveServicesSelection: "Salvesta valik",
      },
    },
    footer: {
      copy: "© 2026 ADViral Agency",
      authorLabel: "Made by",
      authorCredits: "Tehtud kõige lahedama, ilusama, imelise, targa, loova, leidlike, kartmatu, andeka, legendaarse, karismaatilise, terava, suurepärase, hiilgava, virtuoosse, ambitsioonika, progressiivse, ainulaadse, atleetilise, erudiitse, kaugemalevaatava, veatu, sädelava, galantse, sihikindla, inspireeriva, energilise, originaalse, silmapaistva, mõjuka, usaldusväärse, otsustusvõimelise, mitmekülgse, taktilise, osava, väärika, unikaalse, fenomenalse, esteetilise, väsimatu, atraktiivse, autoriteetse, ületamatu, leidliku, trendika, asendamatu, rõõmsameelse, sügava, statuursa ja tagasihoidliku inimese poolt — Aleksandr Zahharov 🕶️",
      authorCreditsAria: "Krediidid",
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

// Развёрнутые тексты для попапа услуг (по языкам и data-service-icon)
const servicePopupLongText = {
  ru: {
    analysis: '<p>Мы начинаем продвижение с глубокого анализа, чтобы каждое действие опиралось на данные, а не на догадки.</p><p><strong>Что мы делаем:</strong></p><ul><li>Анализ текущего позиционирования бренда и его восприятия аудиторией</li><li>Исследование рынка и конкурентной среды</li><li>Определение целевой аудитории, её потребностей, болей и мотивации</li><li>Анализ продуктовой линейки: сильные и слабые стороны, точки роста</li><li>Формирование ключевых УТП и коммуникационных сообщений</li></ul><p><strong>Результат:</strong></p><p>Чёткое понимание, <em>что, кому и как продавать</em>, а также основа для эффективной стратегии продвижения.</p>',
    content: '<p>Контент — ключевой инструмент привлечения и удержания внимания в digital-среде.</p><p><strong>Что мы делаем:</strong></p><ul><li>Разработка концепции и сценариев под цели бренда</li><li>Фото- и видеосъёмка для социальных сетей, рекламы и сайта</li><li>Создание имиджевого, продуктового и lifestyle-контента</li><li>Адаптация контента под разные платформы (форматы, длительность, подача)</li></ul><p><strong>Результат:</strong></p><p>Визуально сильный контент, который формирует доверие, повышает вовлечённость и стимулирует продажи.</p>',
    video: '<p>Для брендов, которым важно выделяться и выглядеть технологично и премиально.</p><p><strong>Что мы делаем:</strong></p><ul><li>Профессиональная видеосъёмка с использованием студийного и выездного оборудования</li><li>Рекламные и презентационные видеоролики</li><li>Motion-дизайн и анимация</li><li>3D-визуализация продуктов, логотипов и сцен</li><li>Интеграция 3D-графики в видео и рекламные материалы</li></ul><p><strong>Результат:</strong></p><p>Эффектный визуал, который усиливает бренд и повышает конверсию рекламных кампаний.</p>',
    strategy: '<p>Мы выстраиваем системный подход к росту бренда, а не разрозненные действия.</p><p><strong>Что мы делаем:</strong></p><ul><li>Определение целей и KPI продвижения</li><li>Подбор эффективных digital-каналов</li><li>Формирование контент- и рекламной стратегии</li><li>Планирование этапов роста и масштабирования</li><li>Контроль реализации и корректировка стратегии по данным аналитики</li></ul><p><strong>Результат:</strong></p><p>Понятный и измеримый путь развития бренда с прогнозируемым результатом.</p>',
    social: '<p>Социальные сети — это диалог с аудиторией и постоянное присутствие бренда в её жизни.</p><p><strong>Что мы делаем:</strong></p><ul><li>Разработка SMM-стратегии и контент-плана</li><li>Создание и публикация контента</li><li>Визуальное и текстовое оформление аккаунтов</li><li>Работа с комментариями и сообщениями</li><li>Анализ статистики и оптимизация контента</li></ul><p><strong>Результат:</strong></p><p>Активные аккаунты с живой аудиторией, рост узнаваемости и лояльности к бренду.</p>',
    design: '<p>Дизайн — это не только эстетика, но и инструмент продаж.</p><p><strong>Что мы делаем:</strong></p><ul><li>Разработка фирменного стиля и айдентики</li><li>Дизайн рекламных материалов и креатива</li><li>UI/UX-дизайн сайтов и лендингов</li><li>Адаптивный дизайн под все устройства</li></ul><p><strong>Результат:</strong></p><p>Визуально целостный и удобный дизайн, усиливающий бренд и пользовательский опыт.</p>',
    ads: '<p>Мы настраиваем рекламу так, чтобы она работала на результат, а не «сливала бюджет».</p><p><strong>Что мы делаем:</strong></p><ul><li>Анализ и выбор рекламных каналов</li><li>Настройка таргетированной и контекстной рекламы</li><li>Создание рекламных креативов и текстов</li><li>A/B-тестирование и оптимизация</li><li>Постоянный контроль и аналитика эффективности</li></ul><p><strong>Результат:</strong></p><p>Стабильный поток целевых заявок и рост продаж при оптимальных затратах.</p>',
    community: '<p>Работа с сообществами усиливает доверие и формирует лояльное окружение вокруг бренда.</p><p><strong>Что мы делаем:</strong></p><ul><li>Поиск и подбор релевантных сообществ</li><li>Нативное продвижение бренда</li><li>Работа с лидерами мнений и администраторами</li><li>Организация активности и вовлечения аудитории</li><li>Мониторинг репутации бренда</li></ul><p><strong>Результат:</strong></p><p>Органический рост узнаваемости и положительный имидж бренда.</p>',
    web: '<p>Технологическая основа для масштабирования бизнеса.</p><p><strong>Что мы делаем:</strong></p><ul><li>Разработка корпоративных сайтов и лендингов</li><li>Создание интернет-магазинов</li><li>Индивидуальные веб-сервисы и платформы</li><li>Интеграция с CRM, аналитикой и сторонними сервисами</li><li>Техническая поддержка и развитие проектов</li></ul><p><strong>Результат:</strong></p><p>Надёжные, быстрые и удобные digital-продукты, которые поддерживают рост бизнеса.</p>',
  },
  en: {
    analysis: '<p>We start every project with in-depth research to ensure that all marketing decisions are data-driven and effective.</p><p><strong>What\'s included:</strong></p><ul><li>Analysis of brand positioning and audience perception</li><li>Market and competitor research</li><li>Identification of target audiences, their needs and pain points</li><li>Evaluation of the product line and growth opportunities</li><li>Development of clear value propositions and key messages</li></ul><p><strong>Result:</strong></p><p>A solid strategic foundation that defines <em>what to promote, to whom, and how</em>.</p>',
    content: '<p>High-quality content is essential for capturing attention and building trust online.</p><p><strong>What we deliver:</strong></p><ul><li>Creative concepts and scripts aligned with brand goals</li><li>Photo and video production for social media, websites, and ads</li><li>Product, lifestyle, and brand storytelling content</li><li>Content adaptation for different platforms and formats</li></ul><p><strong>Result:</strong></p><p>Engaging visual content that increases brand recognition and drives conversions.</p>',
    video: '<p>For brands that want to stand out with premium, high-impact visuals.</p><p><strong>What\'s included:</strong></p><ul><li>Professional studio and on-location video shoots</li><li>Commercial and promotional video production</li><li>Motion design and animation</li><li>3D product visualization and brand elements</li><li>Seamless integration of 3D graphics into video content</li></ul><p><strong>Result:</strong></p><p>Visually powerful assets that elevate brand perception and performance.</p>',
    strategy: '<p>We build structured marketing systems, not isolated campaigns.</p><p><strong>What we do:</strong></p><ul><li>Goal setting and KPI definition</li><li>Selection of the most effective digital channels</li><li>Development of content and advertising strategies</li><li>Step-by-step growth and scaling plans</li><li>Ongoing performance monitoring and optimization</li></ul><p><strong>Result:</strong></p><p>A clear, measurable roadmap for sustainable brand growth.</p>',
    social: '<p>Social media is where brands communicate, engage, and build long-term relationships.</p><p><strong>What\'s included:</strong></p><ul><li>SMM strategy and content planning</li><li>Content creation and publishing</li><li>Visual and textual brand consistency</li><li>Community management and audience interaction</li><li>Performance analysis and continuous improvement</li></ul><p><strong>Result:</strong></p><p>Active, growing social media profiles with engaged audiences.</p>',
    design: '<p>Design is not just about aesthetics — it\'s a conversion tool.</p><p><strong>What we offer:</strong></p><ul><li>Brand identity and visual system design</li><li>Advertising creatives and digital assets</li><li>UI/UX design for websites and landing pages</li><li>Fully responsive design across all devices</li></ul><p><strong>Result:</strong></p><p>A cohesive visual identity that enhances user experience and brand value.</p>',
    ads: '<p>We focus on efficiency, performance, and measurable results.</p><p><strong>What\'s included:</strong></p><ul><li>Channel and audience analysis</li><li>Setup of targeted and contextual advertising</li><li>Creative development and copywriting</li><li>A/B testing and ongoing optimization</li><li>Detailed analytics and performance tracking</li></ul><p><strong>Result:</strong></p><p>Consistent lead generation and sales growth with optimized budgets.</p>',
    community: '<p>Community-driven promotion builds trust and organic brand authority.</p><p><strong>What we do:</strong></p><ul><li>Identification of relevant online communities</li><li>Native brand promotion and discussions</li><li>Collaboration with influencers and community leaders</li><li>Engagement campaigns and brand activity</li><li>Reputation monitoring and management</li></ul><p><strong>Result:</strong></p><p>Organic visibility and a strong, positive brand reputation.</p>',
    web: '<p>We create scalable digital products that support business growth.</p><p><strong>What\'s included:</strong></p><ul><li>Corporate websites and landing pages</li><li>E-commerce solutions</li><li>Custom web platforms and services</li><li>CRM, analytics, and third-party integrations</li><li>Ongoing maintenance and development</li></ul><p><strong>Result:</strong></p><p>Reliable, fast, and user-friendly digital solutions built for growth.</p>',
  },
  et: {
    analysis: '<p>Iga eduka turundusprojekti aluseks on põhjalik analüüs ja strateegiline lähenemine.</p><p><strong>Sisaldab:</strong></p><ul><li>Brändi positsioneerimise ja tajumise analüüsi</li><li>Turu ja konkurentide uuringut</li><li>Sihtrühmade, nende vajaduste ja probleemide määratlemist</li><li>Tooteportfelli analüüsi ja kasvuvõimaluste kaardistamist</li><li>Selgete väärtuspakkumiste ja sõnumite loomist</li></ul><p><strong>Tulemus:</strong></p><p>Selge arusaam, <em>mida, kellele ja kuidas turundada</em>.</p>',
    content: '<p>Kvaliteetne visuaalne sisu on digitaalse turunduse keskmes.</p><p><strong>Mida pakume:</strong></p><ul><li>Loomingulised kontseptsioonid ja stsenaariumid</li><li>Foto- ja videoproduktsioon sotsiaalmeedia, veebide ja reklaamide jaoks</li><li>Toote-, elustiili- ja brändisisu</li><li>Sisu kohandamine erinevatele platvormidele</li></ul><p><strong>Tulemus:</strong></p><p>Kaasaegne ja kaasahaarav sisu, mis suurendab tuntust ja müüki.</p>',
    video: '<p>Ideaalne lahendus brändidele, kes soovivad eristuda ja mõjuda premium-tasemel.</p><p><strong>Sisaldab:</strong></p><ul><li>Professionaalsed videoülesvõtted stuudios ja kohapeal</li><li>Reklaam- ja tutvustusvideod</li><li>Motion-disain ja animatsioon</li><li>3D-visualiseerimine toodetele ja brändielementidele</li><li>3D-graafika integreerimine videotesse</li></ul><p><strong>Tulemus:</strong></p><p>Visuaalselt tugevad lahendused, mis tõstavad brändi väärtust.</p>',
    strategy: '<p>Loome läbimõeldud ja mõõdetavaid turundussüsteeme.</p><p><strong>Mida teeme:</strong></p><ul><li>Eesmärkide ja KPI-de määratlemine</li><li>Sobivate digikanalite valik</li><li>Sisu- ja reklaamistrateegiate loomine</li><li>Kasvu ja skaleerimise planeerimine</li><li>Tulemuste analüüs ja optimeerimine</li></ul><p><strong>Tulemus:</strong></p><p>Selge ja toimiv strateegia brändi pikaajaliseks kasvuks.</p>',
    social: '<p>Sotsiaalmeedia on brändi ja kliendi vaheline dialoog.</p><p><strong>Sisaldab:</strong></p><ul><li>Sotsiaalmeedia strateegiat ja sisukava</li><li>Postituste loomist ja avaldamist</li><li>Visuaalse ja sõnalise ühtsuse tagamist</li><li>Suhtlust jälgijatega</li><li>Analüüsi ja pidevat parendamist</li></ul><p><strong>Tulemus:</strong></p><p>Aktiivsed ja kasvavad sotsiaalmeediakanalid.</p>',
    design: '<p>Hea disain ühendab visuaali ja funktsionaalsuse.</p><p><strong>Pakume:</strong></p><ul><li>Brändi visuaalse identiteedi loomist</li><li>Reklaam- ja digidisaini lahendusi</li><li>UI/UX-disaini veebidele ja maandumislehtedele</li><li>Mobiili- ja kasutajasõbralikku disaini</li></ul><p><strong>Tulemus:</strong></p><p>Ühtne ja professionaalne visuaalne kuvand.</p>',
    ads: '<p>Tulemustele suunatud reklaam, mitte lihtsalt nähtavus.</p><p><strong>Sisaldab:</strong></p><ul><li>Reklaamikanalite ja sihtrühmade analüüsi</li><li>Targalt seadistatud reklaamikampaaniaid</li><li>Reklaamitekstide ja visuaalide loomist</li><li>A/B-testimist ja optimeerimist</li><li>Detailset tulemusanalüüsi</li></ul><p><strong>Tulemus:</strong></p><p>Stabiilne päringute ja müügi kasv.</p>',
    community: '<p>Kogukondlik turundus loob usaldust ja pikaajalist väärtust.</p><p><strong>Mida teeme:</strong></p><ul><li>Sobivate kogukondade leidmine</li><li>Loomulik ja usaldusväärne brändi esitlemine</li><li>Koostöö arvamusliidritega</li><li>Aktiivsuse ja kaasatuse suurendamine</li><li>Brändi maine jälgimine</li></ul><p><strong>Tulemus:</strong></p><p>Orgaaniline nähtavus ja tugev brändi maine.</p>',
    web: '<p>Loome tehnilisi lahendusi, mis toetavad äri kasvu.</p><p><strong>Sisaldab:</strong></p><ul><li>Ettevõtte veebilehti ja maandumislehti</li><li>E-kaubanduse lahendusi</li><li>Kohandatud veebiplatvorme</li><li>CRM-i ja muude süsteemide integratsioone</li><li>Jätkuvat arendust ja tuge</li></ul><p><strong>Tulemus:</strong></p><p>Kiired, usaldusväärsed ja skaleeritavad digilahendused.</p>',
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
  document.dispatchEvent(new CustomEvent("i18n-applied", { detail: { lang: targetLang } }));
}

function showTransientNotification(i18nKey) {
  const notification = document.createElement("div");
  notification.className = "email-copy-notification";
  notification.setAttribute("data-i18n", i18nKey);
  document.body.appendChild(notification);
  const currentLang = document.documentElement.lang || DEFAULT_LANG;
  applyLanguage(currentLang);
  setTimeout(() => notification.classList.add("show"), 10);
  setTimeout(() => {
    notification.classList.remove("show");
    setTimeout(() => { if (document.body.contains(notification)) document.body.removeChild(notification); }, 300);
  }, 2000);
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

  // Блокировка прокрутки фона при открытых попапах и плеере (колесо мыши не крутит страницу)
  let bodyScrollLockCount = 0;
  function lockBodyScroll() {
    bodyScrollLockCount++;
    doc.body.style.overflow = "hidden";
    doc.documentElement.style.overflow = "hidden";
  }
  function unlockBodyScroll() {
    if (bodyScrollLockCount > 0) bodyScrollLockCount--;
    if (bodyScrollLockCount === 0) {
      doc.body.style.overflow = "";
      doc.documentElement.style.overflow = "";
    }
  }
  function isScrollLocked() {
    return bodyScrollLockCount > 0;
  }
  doc.addEventListener("wheel", (e) => {
    if (!isScrollLocked()) return;
    // Разрешаем прокрутку колёсиком внутри попапа услуг
    if (e.target.closest("#service-popup .service-popup-scroll")) return;
    e.preventDefault();
  }, { passive: false });

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

  // Якоря: каждый ведёт на начало секции (без смещения). Отступ хедера — только в padding секции.
  function scrollToSectionStart(el) {
    if (!el) return;
    const top = window.scrollY + el.getBoundingClientRect().top;
    window.scrollTo({ top: Math.max(0, top), behavior: 'smooth' });
    if (history.replaceState && el.id) {
      history.replaceState(null, '', '#' + el.id);
    }
  }

  doc.addEventListener('click', (e) => {
    const a = e.target.closest('a[href^="#"]');
    if (!a) return;
    const href = a.getAttribute('href');
    if (href === '#') return;
    const target = doc.querySelector(href);
    if (!target) return;
    e.preventDefault();
    scrollToSectionStart(target);
  });

  let lastScrollY = window.scrollY || window.pageYOffset;
  let lastScrollDirection = 'down';

  const servicesSection = doc.getElementById('services');
  const servicesCards = servicesSection ? Array.from(servicesSection.querySelectorAll('.cards .card')) : [];
  let servicesWavePrepared = false;
  const partnersSection = doc.getElementById('partners');
  const partnersItems = partnersSection ? Array.from(partnersSection.querySelectorAll('.client-item')) : [];
  let partnersWavePrepared = false;
  const worksSection = doc.getElementById('works');
  const worksItems = worksSection ? Array.from(worksSection.querySelectorAll('.ig-strip .ig-item')) : [];
  let worksWavePrepared = false;

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

  const WAVE_DURATION_MS = 1000;
  const WAVE_SHRINK_START = 0.4; /* фаза уменьшения press-bounce начинается с 40% */
  const REVEAL_DURATION_MS = 750;

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

    const baseDelay = 0.2;
    const stepDelay = 0.067;

    const numRows = rowClusters.length;
    const numCols = colClusters.length;
    positions.forEach(({ card, top, left }) => {
      const rowIndex = findClusterIndex(rowClusters, top);
      const colIndex = findClusterIndex(colClusters, left);
      const waveIndex = (numCols - 1 - colIndex) * numRows + rowIndex;
      const delaySec = baseDelay + waveIndex * stepDelay;
      const delayMs = delaySec * 1000;
      card.dataset.waveReady = 'true';
      card.style.setProperty('--wave-delay', `${delaySec.toFixed(2)}s`);

      /* Волна: подъём карточки + иконки; уменьшение иконки стартует вместе с фазой уменьшения карточки (40% анимации), а не в конце */
      const tStart = setTimeout(() => {
        if (card.matches(':hover')) return;
        card.classList.add('wave-active', 'icon-animating');
      }, delayMs);
      const shrinkStartMs = delayMs + WAVE_DURATION_MS * WAVE_SHRINK_START;
      const tIconShrink = setTimeout(() => {
        if (card.matches(':hover')) return;
        card.classList.remove('icon-animating');
        card.classList.add('icon-animating-out');
        setTimeout(() => card.classList.remove('icon-animating-out'), 250);
      }, shrinkStartMs);
      const tEnd = setTimeout(() => {
        card.classList.remove('wave-active');
      }, delayMs + WAVE_DURATION_MS);
      card.dataset.waveStartTimer = tStart;
      card.dataset.waveEndTimer = tEnd;
    });
  };

  const preparePartnersWave = () => {
    if (!partnersSection || partnersWavePrepared || partnersItems.length === 0) return;
    partnersWavePrepared = true;
    const tolerance = 48;
    const positions = partnersItems.map((el) => {
      const rect = el.getBoundingClientRect();
      return { el, top: rect.top, left: rect.left };
    });
    const rowClusters = clusterAxis(positions.map((p) => p.top), tolerance);
    const colClusters = clusterAxis(positions.map((p) => p.left), tolerance);
    const numRows = rowClusters.length;
    const baseDelay = 0.2;
    const stepDelay = 0.067;
    positions.forEach(({ el, top, left }) => {
      const rowIndex = findClusterIndex(rowClusters, top);
      const colIndex = findClusterIndex(colClusters, left);
      const waveIndex = colIndex * numRows + rowIndex;
      const delaySec = baseDelay + waveIndex * stepDelay;
      el.dataset.waveReady = 'true';
      el.style.setProperty('--wave-delay', `${delaySec.toFixed(2)}s`);

      const markWaveDone = () => el.classList.add('wave-done');
      el.addEventListener('animationend', (e) => {
        if (e.animationName === 'press-bounce') el.classList.add('wave-done');
      }, { once: true });
      el.addEventListener('mouseenter', markWaveDone, { once: true });
    });
  };

  const prepareWorksWave = () => {
    if (!worksSection || worksWavePrepared || worksItems.length === 0) return;
    worksWavePrepared = true;
    const tolerance = 48;
    const positions = worksItems.map((el) => {
      const rect = el.getBoundingClientRect();
      return { el, top: rect.top, left: rect.left };
    });
    const rowClusters = clusterAxis(positions.map((p) => p.top), tolerance);
    const colClusters = clusterAxis(positions.map((p) => p.left), tolerance);
    const numRows = rowClusters.length;
    const numCols = colClusters.length;
    const baseDelay = 0.2;
    const stepDelay = 0.067;
    /* Сверху слева направо вниз: по строкам, в строке — слева направо */
    positions.forEach(({ el, top, left }) => {
      const rowIndex = findClusterIndex(rowClusters, top);
      const colIndex = findClusterIndex(colClusters, left);
      const waveIndex = rowIndex * numCols + colIndex;
      const delaySec = baseDelay + waveIndex * stepDelay;
      el.dataset.waveReady = 'true';
      el.style.setProperty('--wave-delay', `${delaySec.toFixed(2)}s`);

      const markWaveDone = () => el.classList.add('wave-done');
      el.addEventListener('animationend', (e) => {
        if (e.animationName === 'press-bounce-skew-v' || e.animationName === 'press-bounce-skew-v-r1' || e.animationName === 'press-bounce-skew-v-r3') markWaveDone();
      }, { once: true });
      el.addEventListener('mouseenter', markWaveDone, { once: true });
    });
  };

  const siteHeader = doc.querySelector('.site-header');
  const scrollThreshold = 80;
  window.addEventListener('scroll', () => {
    const currentY = window.scrollY || window.pageYOffset;
    if (currentY > lastScrollY) {
      lastScrollDirection = 'down';
    } else if (currentY < lastScrollY) {
      lastScrollDirection = 'up';
    }
    lastScrollY = currentY;
    if (siteHeader && !doc.documentElement.classList.contains('menu-open')) {
      if (lastScrollDirection === 'down' && currentY > scrollThreshold) {
        siteHeader.classList.add('header--hidden');
      } else {
        siteHeader.classList.remove('header--hidden');
      }
    }
  }, { passive: true });

  // Переключатель темы: светлая/тёмная, сохранение в localStorage
  (function initThemeToggle() {
    const THEME_STORAGE_KEY = "adviral-theme";
    const root = doc.documentElement;

    function getStoredTheme() {
      try {
        const stored = localStorage.getItem(THEME_STORAGE_KEY);
        if (stored === "light" || stored === "dark") return stored;
      } catch (_) {}
      return null;
    }

    function applyTheme(theme) {
      root.setAttribute("data-theme", theme);
      const btn = doc.getElementById("theme-toggle");
      if (btn) {
        btn.setAttribute("aria-label", theme === "dark" ? "Switch to light theme" : "Switch to dark theme");
      }
    }

    function initTheme() {
      const stored = getStoredTheme();
      if (stored) {
        applyTheme(stored);
        return;
      }
      if (window.matchMedia && window.matchMedia("(prefers-color-scheme: light)").matches) {
        applyTheme("light");
      } else {
        applyTheme("dark");
      }
    }

    initTheme();

    const themeBtn = doc.getElementById("theme-toggle");
    if (themeBtn) {
      themeBtn.addEventListener("click", function () {
        const current = root.getAttribute("data-theme") || "dark";
        const next = current === "dark" ? "light" : "dark";
        applyTheme(next);
        try {
          localStorage.setItem(THEME_STORAGE_KEY, next);
        } catch (_) {}
      });
    }
  })();

  // Кнопка «Вверх»: показывается после прокрутки мимо героя, по клику — скролл в самый верх
  (function initScrollToTop() {
    const scrollToTopBtn = doc.getElementById('scroll-to-top');
    const heroSection = doc.getElementById('hero');
    if (!scrollToTopBtn || !heroSection) return;

    function updateVisibility() {
      const heroBottom = heroSection.getBoundingClientRect().bottom;
      const isPastHero = heroBottom < 0;
      scrollToTopBtn.classList.toggle('visible', isPastHero);
    }

    window.addEventListener('scroll', updateVisibility, { passive: true });
    updateVisibility();

    scrollToTopBtn.addEventListener('click', (e) => {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  })();

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
    const mobileIO = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          const target = entry.target;
          if (target === servicesSection) {
            setTimeout(() => {
              prepareServicesWave();
              servicesSection.classList.add('in-view');
            }, REVEAL_DURATION_MS);
          } else if (target === partnersSection) {
            setTimeout(() => {
              preparePartnersWave();
              partnersSection.classList.add('in-view');
            }, REVEAL_DURATION_MS);
          } else if (target === worksSection) {
            setTimeout(() => {
              prepareWorksWave();
              worksSection.classList.add('in-view');
            }, REVEAL_DURATION_MS);
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
  /** Элемент, у которого меняется scrollLeft (лента или обёртка .ig-strip-scroll для горизонтальной) */
  function getScrollContainer(strip) {
    return strip && (strip.closest(".ig-strip-scroll") || strip);
  }
  // Для обратной совместимости оставляем старые переменные для первой ленты
  const igSlider = igSliders[0];
  const igStrip = igStrips[0];
  const igStripScroll = getScrollContainer(igStrip);

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
      if (step && igStripScroll) {
        igStripScroll.scrollLeft += step;
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
    if (!igStripScroll) return;
    igStrip.classList.add("no-snap");
    let lastTime = performance.now();

    function scrollFrame(now) {
      const deltaTime = (now - lastTime) / 1000;
      lastTime = now;
      igStripScroll.scrollLeft += dir * speed * deltaTime;
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
    if (!igStripScroll) return;
    let lastTime = performance.now();

    function scrollFrame(now) {
      const deltaTime = (now - lastTime) / 1000;
      lastTime = now;
      igStripScroll.scrollLeft += dir * speed * deltaTime * 2;
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
    if (!igStripScroll) return;
    let lastTime = performance.now();

    function scrollFrame(now) {
      const deltaTime = (now - lastTime) / 1000;
      lastTime = now;
      igStripScroll.scrollLeft += dir * speed * deltaTime * 0.5;
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
    const scrollEl = strip ? getScrollContainer(strip) : null;
    
    let pressStartTime = 0;
    let pressRafId = null;
    let hoverRafId = null;

    function startPressScrollForStrip(dir, speed) {
      if (!scrollEl) return;
      let lastTime = performance.now();
      function scrollFrame(now) {
        const deltaTime = (now - lastTime) / 1000;
        lastTime = now;
        scrollEl.scrollLeft += dir * speed * deltaTime * 2;
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
      if (!scrollEl) return;
      let lastTime = performance.now();
      function scrollFrame(now) {
        const deltaTime = (now - lastTime) / 1000;
        lastTime = now;
        scrollEl.scrollLeft += dir * speed * deltaTime * 0.5;
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
    
    // Ищем стрелки среди соседей слайдера (родитель — контейнер или .horizontal-row)
    const arrowContainer = slider.parentElement;
    if (!arrowContainer) return;

    const containerChildren = Array.from(arrowContainer.children);
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

    const scrollElForStrip = strip ? getScrollContainer(strip) : null;
    function scrollStripBy(direction) {
      if (!scrollElForStrip) return;
      const scrollAmount = scrollElForStrip.offsetWidth / 2;
      scrollElForStrip.scrollBy({ left: direction * scrollAmount, behavior: "smooth" });
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
      if (!igStripScroll) return;
      const scrollAmount = igStripScroll.offsetWidth / 2;
      igStripScroll.scrollBy({ left: direction * scrollAmount, behavior: "smooth" });
    }

    prevArrow?.addEventListener("click", () => scrollStripBy(-1));
    nextArrow?.addEventListener("click", () => scrollStripBy(1));
  }

  // Обрабатываем drag для всех лент
  igStrips.forEach((strip) => {
    const scrollEl = getScrollContainer(strip);
    let isDragging = false;
    let dragStartX = 0;
    let dragStartScroll = 0;

    const stopDrag = (evt) => {
      if (!isDragging) return;
      isDragging = false;
      const el = scrollEl || strip;
      delete el.dataset.dragging;
      if (evt?.pointerId !== undefined) {
        el.releasePointerCapture?.(evt.pointerId);
      }
    };

    const target = scrollEl || strip;
    target.addEventListener("pointerdown", (evt) => {
      // Пропускаем клики на видео элементы - они обрабатываются отдельно
      const item = evt.target.closest(".ig-item");
      if (item && item.hasAttribute("data-video")) {
        return; // Не начинаем drag для видео элементов
      }
      
      // Обычный drag для прокрутки
      isDragging = true;
      dragStartX = evt.clientX;
      dragStartScroll = scrollEl.scrollLeft;
      target.dataset.dragging = "true";
      target.setPointerCapture?.(evt.pointerId);
    });

    target.addEventListener("pointermove", (evt) => {
      if (!isDragging) return;
      const delta = evt.clientX - dragStartX;
      scrollEl.scrollLeft = dragStartScroll - delta;
    });

    target.addEventListener("pointerup", stopDrag);
    target.addEventListener("pointerleave", stopDrag);
    target.addEventListener("lostpointercapture", stopDrag);
  });

  // --- Менеджер загрузки видео ---
  // Задачи: (1) при открытии плеера — остановить загрузку ленты и отдать приоритет плееру;
  // (2) при закрытии плеера — вернуть превью в ленту. Полные видео грузятся только при открытии плеера.
  const videoLoadManager = (function() {
    function getAllFeedVideos() {
      return Array.from(doc.querySelectorAll(".ig-strip .ig-item video"));
    }

    // При открытии модалки: останавливаем загрузку всех видео в ленте (убираем src и load()),
    // чтобы освободить канал и отдать приоритет плееру.
    function pauseFeedLoading() {
      getAllFeedVideos().forEach((video) => {
        video.pause();
        const item = video.closest(".ig-item");
        const source = video.querySelector("source");
        if (source && (item?.dataset.videoPreview || item?.dataset.video)) {
          source.removeAttribute("src");
          video.removeAttribute("src");
          video.load(); // прерываем загрузку
        }
      });
    }

    // При закрытии модалки: восстанавливаем src превью у карточек ленты (мы их обнулили в pauseFeedLoading).
    function resumeFeedVideos() {
      getAllFeedVideos().forEach((video) => {
        const item = video.closest(".ig-item");
        const previewSrc = item?.dataset.videoPreview || item?.dataset.video;
        const source = video.querySelector("source");
        if (previewSrc && source) {
          source.src = previewSrc;
          video.preload = "metadata";
          video.load();
        }
      });
    }

    return {
      pauseFeedLoading,
      resumeFeedVideos,
    };
  })();

  // Загрузка только превью в ленте (metadata), полное видео — только при открытии в плеере
  igStrips.forEach((strip) => {
    const igVideos = Array.from(strip.querySelectorAll("video"));
    if (igVideos.length === 0) return;

    let loadingQueue = [...igVideos];
    let isLoading = false;

    function loadNextVideo() {
      if (isLoading || loadingQueue.length === 0) return;

      const video = loadingQueue.shift();
      if (!video || video.dataset.loaded === "true") {
        loadNextVideo();
        return;
      }

      isLoading = true;
      video.dataset.loaded = "true";

      const item = video.closest(".ig-item");
      const previewSrc = item?.dataset.videoPreview;
      const source = video.querySelector("source");

      if (previewSrc && source) {
        source.src = previewSrc;
      } else if (source && !source.src && item?.dataset.video) {
        source.src = item.dataset.video;
      }

      video.preload = "metadata";
      video.muted = true;
      video.loop = true;
      video.load();

      video.addEventListener("loadedmetadata", () => {
        isLoading = false;
        loadNextVideo();
      }, { once: true });

      setTimeout(() => {
        if (isLoading) {
          isLoading = false;
          loadNextVideo();
        }
      }, 3000);
    }

    igVideos.forEach((video) => {
      video.muted = true;
      video.loop = true;
    });

    if (window.requestIdleCallback) {
      requestIdleCallback(() => loadNextVideo(), { timeout: 1000 });
    } else {
      setTimeout(loadNextVideo, 500);
    }
  });

  // Один общий IntersectionObserver для всех превью в лентах: играют только видимые на странице.
  const allFeedPreviews = Array.from(doc.querySelectorAll(".ig-strip .ig-item video"));
  const feedPreviewObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        const video = entry.target;
        if (entry.isIntersecting) {
          if (video.readyState >= 2) video.play().catch(() => {});
        } else {
          video.pause();
        }
      });
    },
    { threshold: 0.1, rootMargin: "200px" }
  );
  allFeedPreviews.forEach((video) => feedPreviewObserver.observe(video));

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
        
        // Один и тот же набор контролов и настроек для десктопа и мобильных; громкость скрывается в CSS на мобильных
        const controls = [
          "play-large",
          "play",
          "progress",
          "current-time",
          "duration",
          "mute",
          "volume",
          "settings",
          "airplay",
          "fullscreen"
        ];
        
        const isMobile = window.innerWidth <= 768;
        
        player = new Plyr(modalPlayer, {
          controls,
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
          hideControls: isMobile,
          resetOnEnd: true,
          ratio: null,
          volume: isMobile ? 1 : 0.5
        });

        // Обработка ошибок загрузки
        player.on("error", (event) => {
          console.error("Plyr error:", event.detail);
        });
        
        // Проверяем, что Plyr правильно инициализировался
        player.on("ready", () => {
          // console.log("Plyr ready");
          
          // Обёртка для текущего времени и длительности в один общий блок
          const content = modalPlayer.closest(".video-modal-content");
          const controls = content?.querySelector(".plyr__controls");
          const timeCurrent = content?.querySelector(".plyr__time--current");
          const timeDuration = content?.querySelector(".plyr__time--duration");
          if (controls && timeCurrent && timeDuration && !content.querySelector(".plyr__time-group")) {
            const timeGroup = doc.createElement("div");
            timeGroup.className = "plyr__time-group";
            const separator = doc.createElement("span");
            separator.className = "plyr__time-separator";
            separator.setAttribute("aria-hidden", "true");
            separator.textContent = "/";
            controls.insertBefore(timeGroup, timeCurrent);
            timeGroup.appendChild(timeCurrent);
            timeGroup.appendChild(separator);
            timeGroup.appendChild(timeDuration);
          }
          
          // Добавляем поддержку жестов на мобильных устройствах
          if (window.innerWidth <= 768) {
            setupMobileGestures();
          }
        });
        
        // Функция для настройки жестов на мобильных
        function setupMobileGestures() {
          const videoWrapper = modalPlayer.closest('.video-modal-content');
          const seekIndicator = doc.getElementById('video-seek-indicator');
          if (!videoWrapper) return;
          
          let lastTapTime = 0;
          let tapTimeout = null;
          let indicatorTimeout = null;
          
          function showSeekIndicator(direction) {
            if (!seekIndicator) return;
            
            // Устанавливаем иконку направления
            seekIndicator.textContent = direction === 'forward' ? '⏩' : '⏪';
            seekIndicator.classList.add('show');
            
            // Скрываем индикатор через 500ms
            clearTimeout(indicatorTimeout);
            indicatorTimeout = setTimeout(() => {
              seekIndicator.classList.remove('show');
            }, 500);
          }
          
          videoWrapper.addEventListener('touchend', (e) => {
            const currentTime = new Date().getTime();
            const tapLength = currentTime - lastTapTime;
            
            // Двойное нажатие (в течение 300ms)
            if (tapLength < 300 && tapLength > 0) {
              clearTimeout(tapTimeout);
              
              // Определяем, где нажали (левая или правая половина экрана)
              const touch = e.changedTouches[0];
              const rect = videoWrapper.getBoundingClientRect();
              const x = touch.clientX - rect.left;
              const screenWidth = rect.width;
              
              if (player && player.currentTime !== undefined) {
                if (x < screenWidth / 2) {
                  // Левая половина - перемотка назад на 10 секунд
                  player.rewind(10);
                  showSeekIndicator('backward');
                } else {
                  // Правая половина - перемотка вперед на 10 секунд
                  player.forward(10);
                  showSeekIndicator('forward');
                }
              }
              
              lastTapTime = 0; // Сброс для следующего двойного нажатия
            } else {
              lastTapTime = currentTime;
            }
          }, { passive: true });
        }
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
        currentIndex = videoItems.findIndex(item => getVideoSource(item) === videoSrc);
      }

      updateNavigationState();

      currentVideoSrc = videoSrc;

      // Останавливаем загрузку всех видео в ленте — весь трафик отдаём плееру
      videoLoadManager.pauseFeedLoading();

      // Устанавливаем источник видео и приоритет загрузки
      setupQualitySources(videoSrc);
      modalPlayer.preload = "auto";

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
      
      if (modal.hidden) lockBodyScroll();
      modal.hidden = false;
      
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
      const srcEmit = currentVideoSrc;
      if (player) {
        player.pause();
        player.currentTime = 0;
      } else {
        modalPlayer.pause();
        modalPlayer.currentTime = 0;
      }
      currentVideoSrc = "";
      modal.hidden = true;
      unlockBodyScroll();
      // Восстанавливаем превью в ленте и при необходимости запускаем фоновый прелоад
      videoLoadManager.resumeFeedVideos();
      if (srcEmit) {
        doc.dispatchEvent(new CustomEvent("video-modal-closed", { detail: { src: srcEmit } }));
      }
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

    // Открытие плеера извне (например, из попапа «Услуги» — кнопка «растянуть на весь экран»)
    doc.addEventListener("open-video-modal", (e) => {
      const src = e.detail?.src;
      if (src) openModal(src, null);
    });
  })();

  // Обработка фокуса на полях ввода в секции контактов для усиления затемнения
  const contactSection = doc.getElementById("contact");
  if (contactSection) {
    const contactInputs = contactSection.querySelectorAll("input, textarea");
    const contactFocusables = Array.from(contactInputs);

    const handleFocus = () => contactSection.classList.add("has-focus");
    const checkBlur = () => {
      const hasActive = contactFocusables.some((el) => el === doc.activeElement) ||
        doc.activeElement?.closest?.(".services-dropdown-panel");
      if (!hasActive) contactSection.classList.remove("has-focus");
    };

    contactFocusables.forEach((input) => {
      input.addEventListener("focus", handleFocus);
      input.addEventListener("blur", checkBlur);
    });
  }

  // Дропдаун «Интересующие Услуги» — мультивыбор, скрытое поле для Formspree
  (function initInterestedServicesDropdown() {
    const trigger = doc.getElementById("interested-services-toggle");
    const panel = doc.getElementById("interested-services-list");
    const hiddenInput = doc.getElementById("interested_services_value");
    const saveBtn = doc.getElementById("interested-services-save-btn");
    if (!trigger || !panel || !hiddenInput) return;

    const options = Array.from(panel.querySelectorAll(".services-dropdown-option"));
    const selectedEl = trigger.querySelector(".services-dropdown-selected");
    const placeholderEl = trigger.querySelector(".services-dropdown-placeholder");

    function updateSelectedDisplay() {
      const selected = options.filter((o) => o.classList.contains("selected"));
      const values = selected.map((o) => o.dataset.value || "").filter(Boolean);
      const items = selected.map((o) => ({
        value: o.dataset.value || "",
        iconSrc: o.querySelector("img")?.getAttribute("src") || "",
        label: (o.querySelector("span")?.textContent || "").trim(),
      }));
      hiddenInput.value = values.join(", ");
      if (selectedEl) {
        selectedEl.innerHTML = items
          .filter((it) => it.value)
          .map(
            (it) =>
              `<span class="service-tag service-tag-icon" data-value="${escapeHtml(it.value)}" title="${escapeHtml(it.label)}"><img src="${escapeHtml(it.iconSrc)}" alt="" width="24" height="24" /></span>`
          )
          .join("");
      }
    }
    function escapeHtml(s) {
      const div = doc.createElement("div");
      div.textContent = s;
      return div.innerHTML;
    }

    function openPanel() {
      panel.removeAttribute("hidden");
      trigger.setAttribute("aria-expanded", "true");
      contactSection?.classList.add("has-focus");
    }
    function closePanel() {
      panel.setAttribute("hidden", "");
      trigger.setAttribute("aria-expanded", "false");
      if (contactSection && !doc.activeElement?.closest?.(".contact-form-wrapper")) {
        contactSection.classList.remove("has-focus");
      }
    }

    trigger.addEventListener("click", (e) => {
      const iconChip = e.target.closest(".service-tag-icon");
      if (iconChip) {
        e.preventDefault();
        e.stopPropagation();
        const value = iconChip.dataset.value;
        const opt = options.find((o) => o.dataset.value === value);
        if (opt) {
          opt.classList.remove("selected");
          opt.setAttribute("aria-selected", "false");
          updateSelectedDisplay();
        }
        return;
      }
      e.preventDefault();
      if (panel.hasAttribute("hidden")) openPanel();
      else closePanel();
    });

    options.forEach((opt) => {
      opt.addEventListener("click", (e) => {
        e.preventDefault();
        e.stopPropagation();
        opt.classList.toggle("selected");
        opt.setAttribute("aria-selected", opt.classList.contains("selected"));
        updateSelectedDisplay();
      });
      opt.addEventListener("keydown", (e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          opt.click();
        }
      });
    });

    doc.addEventListener("click", (e) => {
      if (panel.hasAttribute("hidden")) return;
      if (!trigger.contains(e.target) && !panel.contains(e.target)) closePanel();
    });
    if (saveBtn) saveBtn.addEventListener("click", (e) => { e.preventDefault(); closePanel(); });
    doc.addEventListener("i18n-applied", () => updateSelectedDisplay());
    const form = doc.querySelector("#contact-form");
    if (form) form.addEventListener("reset", () => {
      options.forEach((o) => o.classList.remove("selected"));
      options.forEach((o) => o.removeAttribute("aria-selected"));
      updateSelectedDisplay();
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
          showTransientNotification("form.sent");
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

  const cardsContainer = servicesSection ? servicesSection.querySelector('.cards') : doc.querySelector('.cards');
  const cards = cardsContainer ? Array.from(cardsContainer.querySelectorAll('.card')) : [];

  // Гарантируем полное проигрывание анимации границы при наведении; при повторном наведении анимация продолжается с текущего момента до полного загорания
  const GLOW_MS = 250;
  cards.forEach((card) => {
    let animationStartTime = null;
    let glowDurationMs = GLOW_MS; /* длительность текущей фазы загорания (может быть короче при продолжении с середины) */
    let phase = null; /* 'in' | 'out' | null */
    let phaseStartTime = null;
    let fadeOutTimeoutId = null;

    const startGlowAnimation = () => {
      if (card.classList.contains('wave-active')) return;
      clearTimeout(fadeOutTimeoutId);
      fadeOutTimeoutId = null;

      let currentGlow = 0;
      const now = performance.now();
      if (phase === 'in' && phaseStartTime != null) {
        const elapsed = (now - phaseStartTime) / GLOW_MS;
        currentGlow = Math.min(1, elapsed);
      } else if (phase === 'out' && phaseStartTime != null) {
        const elapsed = (now - phaseStartTime) / GLOW_MS;
        currentGlow = 1 - Math.min(1, elapsed);
      }

      card.classList.add('card-scale-on');
      card.style.animation = 'none';
      void card.offsetWidth;

      if (currentGlow >= 1) {
        card.style.animation = 'border-glow 0.001s ease-in-out forwards';
        glowDurationMs = 1;
        phase = 'in';
        phaseStartTime = now;
        animationStartTime = now;
        card.addEventListener('animationend', function handleEnd(e) {
          if (e.animationName === 'border-glow') {
            phase = null;
            phaseStartTime = null;
            animationStartTime = null;
          }
          card.removeEventListener('animationend', handleEnd);
        }, { once: true });
        return;
      } else {
        const durationS = (GLOW_MS / 1000) * (1 - currentGlow);
        const delayS = -(GLOW_MS / 1000) * currentGlow;
        glowDurationMs = GLOW_MS * (1 - currentGlow);
        card.style.animation = `border-glow ${durationS}s ease-in-out ${delayS}s forwards`;
        phase = 'in';
        phaseStartTime = now;
      }
      animationStartTime = now;

      const handleAnimationEnd = (e) => {
        if (e.animationName === 'border-glow') {
          phase = null;
          phaseStartTime = null;
          animationStartTime = null;
        }
        card.removeEventListener('animationend', handleAnimationEnd);
      };
      card.addEventListener('animationend', handleAnimationEnd, { once: true });
    };

    const startFadeOutAnimation = () => {
      if (animationStartTime != null) {
        const elapsed = performance.now() - animationStartTime;
        const remaining = Math.max(0, glowDurationMs - elapsed);

        fadeOutTimeoutId = setTimeout(() => {
          fadeOutTimeoutId = null;
          card.classList.remove('card-scale-on');
          card.style.animation = 'none';
          void card.offsetWidth;
          card.style.animation = 'border-glow-out 0.25s ease-in-out forwards';
          phase = 'out';
          phaseStartTime = performance.now();
          animationStartTime = null;

          const handleFadeOutEnd = (e) => {
            if (e.animationName === 'border-glow-out') phase = null;
            phaseStartTime = null;
            card.removeEventListener('animationend', handleFadeOutEnd);
          };
          card.addEventListener('animationend', handleFadeOutEnd, { once: true });
        }, remaining);
      } else {
        card.classList.remove('card-scale-on');
        card.style.animation = 'none';
        void card.offsetWidth;
        card.style.animation = 'border-glow-out 0.25s ease-in-out forwards';
        phase = 'out';
        phaseStartTime = performance.now();

        const handleFadeOutEnd = (e) => {
          if (e.animationName === 'border-glow-out') phase = null;
          phaseStartTime = null;
          card.removeEventListener('animationend', handleFadeOutEnd);
        };
        card.addEventListener('animationend', handleFadeOutEnd, { once: true });
      }
    };

    card.addEventListener('mouseenter', startGlowAnimation);
    card.addEventListener('mouseleave', startFadeOutAnimation);
    card.addEventListener('focus', startGlowAnimation);
    card.addEventListener('blur', startFadeOutAnimation);
  });

  // Гарантируем полное проигрывание анимации иконки при наведении
  cards.forEach((card) => {
    let iconAnimationStartTime = null;

    const startIconAnimation = () => {
      card.classList.remove('icon-animating', 'icon-animating-out');
      void card.offsetWidth;
      card.classList.add('icon-animating');
      iconAnimationStartTime = performance.now();
    };

    const stopIconAnimation = () => {
      if (iconAnimationStartTime) {
        const elapsed = performance.now() - iconAnimationStartTime;
        const remaining = Math.max(0, 250 - elapsed); /* 0.25s — синхронно с border-glow */

        setTimeout(() => {
          card.classList.remove('icon-animating', 'icon-animating-out');
          void card.offsetWidth;
          card.classList.add('icon-animating-out');
          iconAnimationStartTime = null;
        }, remaining);
      } else {
        card.classList.remove('icon-animating', 'icon-animating-out');
        void card.offsetWidth;
        card.classList.add('icon-animating-out');
      }
    };

    card.addEventListener('mouseenter', startIconAnimation);
    card.addEventListener('mouseleave', stopIconAnimation);
    card.addEventListener('focus', startIconAnimation);
    card.addEventListener('blur', stopIconAnimation);
  });

  // Popup для мобильных
  const servicePopup = doc.getElementById('service-popup');
  const servicePopupContainer = servicePopup?.querySelector('.service-popup-container');
  const servicePopupTitle = servicePopup?.querySelector('.service-popup-title');
  const servicePopupTextContent = servicePopup?.querySelector('.service-popup-text-content');
  const servicePopupIcon = servicePopup?.querySelector('.service-popup-icon');
  const servicePopupClose = servicePopup?.querySelector('.service-popup-close');
  const servicePopupOverlay = servicePopup?.querySelector('.service-popup-overlay');
  const servicePopupPrev = servicePopup?.querySelector('.service-popup-prev');
  const servicePopupNext = servicePopup?.querySelector('.service-popup-next');
  let servicePopupInlineVideoEl = servicePopup?.querySelector('.service-popup-inline-video-el');
  const servicePopupInlineVideoPlaceholder = servicePopup?.querySelector('.service-popup-inline-video-placeholder');
  
  let currentServiceIndex = -1;
  let servicePopupPlyr = null;
  let servicePopupVideoLoaded = false;
  const SERVICE_POPUP_MAIN_VIDEO = "assets/videos/Horizontal/BSU3.mp4";

  function openServicePopup(card, index = -1) {
    if (!servicePopup || !servicePopupContainer || !servicePopupTitle || !servicePopupTextContent) return;
    
    currentServiceIndex = index >= 0 ? index : cards.indexOf(card);
    
    const title = card.querySelector('h3')?.textContent || '';
    const text = card.querySelector('p')?.textContent || '';
    const serviceType = card.getAttribute('data-service-icon') || '';
    const currentLang = document.documentElement.lang || DEFAULT_LANG;
    const longHtml = servicePopupLongText[currentLang] && servicePopupLongText[currentLang][serviceType];
    
    servicePopupTitle.textContent = title;
    if (longHtml) {
      servicePopupTextContent.innerHTML = longHtml;
    } else {
      servicePopupTextContent.textContent = text;
    }
    servicePopupContainer.setAttribute('data-service-type', serviceType);
    
    const computedStyle = getComputedStyle(card);
    const serviceColor = computedStyle.getPropertyValue('--service-color');
    const serviceBorderColor = computedStyle.getPropertyValue('--service-border-color');
    
    servicePopupContainer.style.setProperty('--service-color', serviceColor);
    servicePopupContainer.style.setProperty('--service-border-color', serviceBorderColor);
    
    if (servicePopupIcon) {
      const cardIcon = getComputedStyle(card, '::after');
      const iconUrl = cardIcon.backgroundImage;
      const iconFilter = cardIcon.filter;
      servicePopupIcon.style.backgroundImage = iconUrl;
      servicePopupIcon.style.filter = iconFilter;
    }
    
    if (!servicePopup.classList.contains('active')) lockBodyScroll();
    servicePopup.classList.add('active');
    resetServicePopupInlineVideo();
    showServicePopupPlaceholder();
  }

  function showServicePopupPlaceholder() {
    servicePopupVideoLoaded = false;
    if (servicePopupInlineVideoPlaceholder) {
      servicePopupInlineVideoPlaceholder.style.display = "flex";
      servicePopupInlineVideoPlaceholder.removeAttribute("hidden");
    }
    if (servicePopupInlineVideoEl) {
      servicePopupInlineVideoEl.style.display = "none";
    }
    const plyrWrap = servicePopup?.querySelector(".service-popup-inline-video .plyr");
    if (plyrWrap) plyrWrap.style.display = "none";
  }

  function hideServicePopupPlaceholder() {
    servicePopupVideoLoaded = true;
    if (servicePopupInlineVideoPlaceholder) {
      servicePopupInlineVideoPlaceholder.style.display = "none";
      servicePopupInlineVideoPlaceholder.setAttribute("hidden", "");
    }
    if (servicePopupInlineVideoEl) {
      servicePopupInlineVideoEl.style.display = "block";
    }
    const plyrWrap = servicePopup?.querySelector(".service-popup-inline-video .plyr");
    if (plyrWrap) plyrWrap.style.display = "block";
  }

  function loadAndPlayServicePopupVideo() {
    if (!servicePopupInlineVideoEl || servicePopupVideoLoaded) return;
    videoLoadManager.pauseFeedLoading();
    /* При смене попапа: уничтожаем Plyr и сбрасываем видео, чтобы повторная загрузка сработала */
    if (servicePopupPlyr) {
      try { servicePopupPlyr.destroy(); } catch (_) {}
      servicePopupPlyr = null;
    }
    const videoEl = servicePopup?.querySelector(".service-popup-inline-video-el") || servicePopupInlineVideoEl;
    if (!videoEl) return;
    videoEl.pause();
    videoEl.removeAttribute("src");
    videoEl.load();
    /* Установка src в следующем тике, чтобы браузер успел обработать сброс (иначе при повторном открытии попапа видео не грузится) */
    requestAnimationFrame(() => {
      if (servicePopupVideoLoaded) return;
      videoEl.src = SERVICE_POPUP_MAIN_VIDEO;
      videoEl.preload = "auto";
      videoEl.load();
      if (!servicePopupPlyr && typeof Plyr !== "undefined") {
        initServicePopupPlyr(videoEl);
      }
      function onReady() {
        hideServicePopupPlaceholder();
        if (servicePopupPlyr) {
          servicePopupPlyr.play().catch(() => {});
        } else {
          videoEl.play().catch(() => {});
        }
      }
      if (servicePopupPlyr) {
        servicePopupPlyr.once("ready", onReady);
        if (videoEl.readyState >= 2) onReady();
      } else {
        videoEl.addEventListener("loadeddata", onReady, { once: true });
        if (videoEl.readyState >= 2) onReady();
      }
    });
  }

  function initServicePopupPlyr(videoElement) {
    const el = videoElement || servicePopup?.querySelector(".service-popup-inline-video-el") || servicePopupInlineVideoEl;
    if (!el || servicePopupPlyr) return;
    if (typeof Plyr === "undefined") {
      el.controls = true;
      return;
    }
    try {
      const controls = [
        "play-large",
        "play",
        "progress",
        "current-time",
        "duration",
        "mute",
        "volume",
        "settings",
        "airplay",
        "fullscreen"
      ];
      const isMobile = window.innerWidth <= 768;
      servicePopupPlyr = new Plyr(el, {
        controls,
        settings: ["quality", "speed"],
        speed: { selected: 1, options: [0.5, 0.75, 1, 1.25, 1.5, 1.75, 2] },
        keyboard: { focused: true, global: false },
        clickToPlay: true,
        hideControls: isMobile,
        resetOnEnd: true,
        ratio: null,
        volume: isMobile ? 1 : 0.5
      });
    } catch (err) {
      el.controls = true;
    }
  }

  function resetServicePopupInlineVideo() {
    if (servicePopupPlyr) {
      try { servicePopupPlyr.destroy(); } catch (_) {}
      servicePopupPlyr = null;
    }
    const videoEl = servicePopup?.querySelector(".service-popup-inline-video-el");
    if (!videoEl) return;
    videoEl.pause();
    videoEl.removeAttribute("src");
    videoEl.load();
    videoEl.controls = false;
    /* После Plyr.destroy() старый <video> может оставаться в некорректном состоянии — подменяем на новый элемент, чтобы при следующем клике по плейсхолдеру загрузка и Plyr работали */
    const parent = videoEl.parentElement;
    if (parent) {
      const fresh = doc.createElement("video");
      fresh.className = "service-popup-inline-video-el";
      fresh.setAttribute("playsinline", "");
      fresh.setAttribute("preload", "none");
      fresh.setAttribute("aria-label", "Example video");
      parent.replaceChild(fresh, videoEl);
      servicePopupInlineVideoEl = fresh;
    }
    videoLoadManager.resumeFeedVideos();
  }

  function closeServicePopup() {
    if (!servicePopup) return;
    servicePopup.classList.remove('active');
    unlockBodyScroll();
    currentServiceIndex = -1;
    resetServicePopupInlineVideo();
    showServicePopupPlaceholder();
  }

  if (servicePopupInlineVideoPlaceholder) {
    servicePopupInlineVideoPlaceholder.addEventListener("click", (e) => {
      e.preventDefault();
      loadAndPlayServicePopupVideo();
    });
    servicePopupInlineVideoPlaceholder.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        loadAndPlayServicePopupVideo();
      }
    });
  }
  
  function navigateServicePopup(direction) {
    if (currentServiceIndex === -1 || cards.length === 0) return;
    
    let newIndex = currentServiceIndex + direction;
    
    // Зацикливаем навигацию
    if (newIndex < 0) newIndex = cards.length - 1;
    if (newIndex >= cards.length) newIndex = 0;
    
    const newCard = cards[newIndex];
    if (newCard) {
      openServicePopup(newCard, newIndex);
    }
  }

  // Закрытие popup
  if (servicePopupClose) {
    servicePopupClose.addEventListener('click', closeServicePopup);
  }
  
  if (servicePopupOverlay) {
    servicePopupOverlay.addEventListener('click', closeServicePopup);
  }
  
  // Навигация в popup
  if (servicePopupPrev) {
    servicePopupPrev.addEventListener('click', () => navigateServicePopup(-1));
  }
  
  if (servicePopupNext) {
    servicePopupNext.addEventListener('click', () => navigateServicePopup(1));
  }

  // Закрытие по Escape
  doc.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && servicePopup?.classList.contains('active')) {
      closeServicePopup();
    }
  });

  // При смене языка обновляем контент попапа, если он открыт
  doc.addEventListener('i18n-applied', () => {
    if (servicePopup?.classList.contains('active') && currentServiceIndex >= 0 && cards[currentServiceIndex]) {
      openServicePopup(cards[currentServiceIndex], currentServiceIndex);
    }
  });

  cards.forEach((card) => {
    card.addEventListener('click', () => {
      // Показываем popup при клике и на мобильных, и на десктопе
      openServicePopup(card);
    });

    const rect0 = () => card.getBoundingClientRect();
    const updateSpotlight = createRafThrottle((clientX, clientY) => {
      const rect = rect0();
      card.style.setProperty('--x', `${clientX - rect.left}px`);
      card.style.setProperty('--y', `${clientY - rect.top}px`);
      card.style.setProperty('--opacity', 1);
    });

    card.addEventListener('mouseenter', () => {
      const rect = rect0();
      card.style.setProperty('--x', `${rect.width / 2}px`);
      card.style.setProperty('--y', `${rect.height / 2}px`);
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
        showTransientNotification("email.copied");
      } catch (err) {
        console.error("Ошибка копирования:", err);
        const textArea = doc.createElement("textarea");
        textArea.value = email;
        textArea.style.position = "fixed";
        textArea.style.opacity = "0";
        doc.body.appendChild(textArea);
        textArea.select();
        try {
          doc.execCommand("copy");
          showTransientNotification("email.copied");
        } catch (err2) {
          console.error("Ошибка копирования:", err2);
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
        showTransientNotification("email.copied");
      } catch (err) {
        console.error("Ошибка копирования:", err);
        const textArea = doc.createElement("textarea");
        textArea.value = phone;
        textArea.style.position = "fixed";
        textArea.style.opacity = "0";
        doc.body.appendChild(textArea);
        textArea.select();
        try {
          doc.execCommand("copy");
          showTransientNotification("email.copied");
        } catch (err2) {
          console.error("Ошибка fallback копирования:", err2);
        }
        doc.body.removeChild(textArea);
      }
    });
  }

  // Попап «Сделано Александром Захаровым» по клику на «:» в футере
  const authorPopup = doc.getElementById("author-popup");
  const authorColon = doc.querySelector(".footer-author-colon");
  if (authorPopup && authorColon) {
    const overlay = authorPopup.querySelector(".author-popup-overlay");
    const closeBtn = authorPopup.querySelector(".author-popup-close");
    const openPopup = () => {
      authorPopup.hidden = false;
      closeBtn.focus();
      doc.body.style.overflow = "hidden";
    };
    const closePopup = () => {
      authorPopup.hidden = true;
      doc.body.style.overflow = "";
    };
    authorColon.addEventListener("click", (e) => {
      e.preventDefault();
      openPopup();
    });
    authorColon.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        openPopup();
      }
    });
    if (overlay) overlay.addEventListener("click", closePopup);
    if (closeBtn) closeBtn.addEventListener("click", closePopup);
    doc.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && authorPopup && !authorPopup.hidden) closePopup();
    });
  }

  // Копирование email автора при клике (Made by: alexander.zahharov@gmail.com)
  const authorEmailLink = doc.getElementById("author-email-link");
  if (authorEmailLink) {
    const copyAuthorEmail = async (textToCopy) => {
      try {
        await navigator.clipboard.writeText(textToCopy);
        return true;
      } catch {
        const ta = doc.createElement("textarea");
        ta.value = textToCopy;
        ta.style.position = "fixed";
        ta.style.opacity = "0";
        doc.body.appendChild(ta);
        ta.select();
        try {
          doc.execCommand("copy");
          return true;
        } catch {
          return false;
        } finally {
          doc.body.removeChild(ta);
        }
      }
    };
    const showCopyNotification = () => showTransientNotification("email.copied");
    authorEmailLink.addEventListener("click", async (e) => {
      e.preventDefault();
      const text = authorEmailLink.getAttribute("data-copy") || "alexander.zahharov@gmail.com";
      const ok = await copyAuthorEmail(text);
      if (ok) showCopyNotification();
    });
  }

  /* Клиенты и Работы: анимация увеличения/уменьшения доигрывается до конца при уходе курсора */
  (function initHoverScaleCompletion() {
    const hoverCapable = window.matchMedia("(hover: hover)");
    if (!hoverCapable.matches) return;
    const HOVER_SCALE_UP_MS = 250;

    function setupHoverScaleCompletion(selector) {
      document.querySelectorAll(selector).forEach((el) => {
        let enterTime = 0;
        let leaveTimeoutId = null;

        el.addEventListener("mouseenter", () => {
          if (leaveTimeoutId != null) {
            clearTimeout(leaveTimeoutId);
            leaveTimeoutId = null;
          }
          enterTime = performance.now();
          el.classList.add("hover-scale-on");
        });

        el.addEventListener("mouseleave", () => {
          const elapsed = performance.now() - enterTime;
          const remaining = Math.max(0, HOVER_SCALE_UP_MS - elapsed);
          leaveTimeoutId = setTimeout(() => {
            leaveTimeoutId = null;
            el.classList.remove("hover-scale-on");
          }, remaining);
        });
      });
    }

    setupHoverScaleCompletion("#partners .client-item");
    setupHoverScaleCompletion("#works .ig-item");
    setupHoverScaleCompletion("#works .ig-item-horizontal");
  })();

  /* Мобильная версия: при тапе воспроизводить hover-эффект (активация и деактивация) */
  const hoverNone = window.matchMedia("(hover: none)");
  const narrowViewport = window.matchMedia("(max-width: 1024px)"); /* планшет и мобильная — тап вместо ховера */
  const HOVER_TAP_DURATION_MS = 550;

  function shouldApplyHoverTap() {
    return hoverNone.matches || narrowViewport.matches;
  }

  function applyHoverTap(e) {
    if (!shouldApplyHoverTap()) return;
    if (e.type === "click" && hoverNone.matches) return;
    const added = [];
    let el = e.target;
    while (el && el !== document.body) {
      el.classList.add("hover-tap-active");
      added.push(el);
      el = el.parentElement;
    }
    setTimeout(() => {
      added.forEach((node) => node.classList.remove("hover-tap-active"));
    }, HOVER_TAP_DURATION_MS);
  }

  /* Только по клику (не по touchend), чтобы на мобильных не было эффектов при зажатии */
  document.addEventListener("click", applyHoverTap, { passive: true });
});