# ADViral Agency — Performance Optimization Log

Документация всех оптимизаций скорости загрузки сайта adviral.agency.

---

## Хронология версий

### v1.0 — Оригинал (до 07.02.2026)
Начальное состояние сайта до любых оптимизаций.

**Характеристики:**
- Общий вес ассетов: **252.5 MB**
- Начальная загрузка: **~31.4 MB**
- HTML issues: **8**
- FCP (First Contentful Paint): **~2–3 сек**
- LCP (Largest Contentful Paint): **~4–6 сек**

**Проблемы:**
- 3 hero-видео загружались одновременно (LAMBO5 5.8 MB + Vertical_Sun_girl 9.56 MB + TWTWfinal 12.41 MB)
- Фотографии в PNG формате (Slide_White 4.76 MB, Slide_Green 3.70 MB, Slide_Red 3.38 MB)
- 9 шрифтов в TTF (690 KB), из которых используются только 2
- Google Fonts Inter загружался, но не использовался в CSS
- Plyr CSS + JS (~150 KB) загружались синхронно, блокируя рендеринг
- Contact-видео (12.41 MB) грузилось с autoplay сразу, хотя секция внизу страницы
- CSS (278 KB) и JS (166 KB) не минифицированы
- Hero-видео без poster-изображения (пустой экран при загрузке)
- 11 изображений без `loading="lazy"`

---

### v1.1 — Первая волна оптимизации (07.02.2026, коммит `d6d3954`)

**Что сделано:**

#### Значимые (HIGH impact — основная экономия трафика и скорости)

| # | Оптимизация | Результат | Экономия |
|---|-------------|-----------|----------|
| 1 | **PNG фото → WebP** | Slide_White: 4.76 MB → 482 KB, Slide_Green: 3.70 MB → 212 KB, Slide_Red: 3.38 MB → 190 KB | **~11 MB** (90-95%) |
| 2 | **Contact-видео: lazy-load** | IntersectionObserver загружает TWTWfinal.mp4 только когда секция видна | **12.4 MB** отложено |
| 3 | **Hero-видео: 1 источник вместо 3** | Десктоп грузит только LAMBO5, мобильная версия переключается через JS | **9.56 MB** отложено |
| 4 | **Poster-изображения на видео** | Кадр из видео (14 KB) показывается мгновенно, пока видео буферизуется | FCP -2 сек |

#### Средние (MEDIUM impact — заметное улучшение)

| # | Оптимизация | Результат | Экономия |
|---|-------------|-----------|----------|
| 5 | **Plyr CSS/JS отложен** | Загружается динамически только при открытии видеоплеера через `window.__loadPlyr()` | **~150 KB** со старта |
| 6 | **CSS/JS минифицированы** | CSS: 278 → 174 KB (37%), JS: 166 → 114 KB (32%) | **~156 KB** |
| 7 | **Удалены 7 неиспользуемых шрифтов** | Jura (3 файла), Comfortaa (2), PoiretOne, Sansation-Bold | **~618 KB** |

#### Специфичные (LOW impact — доводка и best practices)

| # | Оптимизация | Результат | Экономия |
|---|-------------|-----------|----------|
| 8 | Удалён Google Fonts Inter | Не используется ни в одном CSS-правиле | ~80 KB + 1 HTTP запрос |
| 9 | `loading="lazy"` на все изображения | Добавлено к 10 логотипам клиентов + иконке отправки | Отложено ~230 KB |
| 10 | Preload poster hero | `<link rel="preload">` для мгновенного отображения poster-кадра | FCP -100ms |

**Результат v1.1:**
- Начальная загрузка: **31.4 MB → 7.0 MB** (экономия 78%)
- HTML issues: **8 → 2**
- FCP: **~0.5–1 сек**

---

### v1.2 — Вторая волна оптимизации (07.02.2026, коммит `8772373`)

**Что сделано:**

#### Значимые (HIGH impact — ощутимое ускорение)

| # | Оптимизация | Результат | Экономия |
|---|-------------|-----------|----------|
| 1 | **Сжатие hero-видео** (ffmpeg, CRF 28) | LAMBO5: 5.8 → 4.38 MB, Sun_girl: 9.56 → 5.70 MB, TWTWfinal: 12.41 → 5.53 MB | **~12.2 MB** (44%) |
| 2 | **Сжатие 15 preview-видео** (CRF 30) | Суммарно: 18.7 → 7.9 MB | **~10.8 MB** (58%) |
| 3 | **Critical CSS inline** в `<head>` | Критические стили (header + hero) инлайнятся — мгновенная первая отрисовка | FCP -0.3 сек |
| 4 | **CSS загружается async** | `media="print" onload="this.media='all'"` — не блокирует рендеринг | Render-blocking убран |
| 5 | **Responsive images (srcset)** | 3 размера: sm (480px), md (800px), full (2700px). Мобильный юзер грузит 14–20 KB вместо 482 KB | **до -96%** на мобильных |

#### Средние (MEDIUM impact — полезно, но не главное)

| # | Оптимизация | Результат | Экономия |
|---|-------------|-----------|----------|
| 6 | **Service Worker** (`sw.js`) | Кеширует CSS, JS, шрифты, poster для офлайн и повторных визитов | Повторные визиты ~0 сек |
| 7 | **TTF → WOFF2** шрифты | Sansation-Light: 36 → 14 KB, Sansation-Regular: 36 → 14 KB | **~44 KB** (61%) |
| 8 | **Удалены PNG-оригиналы** | -15.14 MB из репозитория (WebP уже были созданы в v1.1) | **15 MB** из repo |
| 9 | **CLS fix (width/height)** | `width="2700" height="1600"` на фотографии — предотвращает "прыжки" при загрузке | CLS → 0 |

#### Специфичные (LOW impact — финишная полировка)

| # | Оптимизация | Результат | Экономия |
|---|-------------|-----------|----------|
| 10 | Prefetch hints | `<link rel="prefetch">` для предзагрузки следующих секций | Чуть быстрее скролл |
| 11 | WOFF2 preload | `<link rel="preload" as="font" type="font/woff2">` | Шрифт на ~50ms раньше |
| 12 | Skeleton shimmer CSS | `@keyframes skeleton-shimmer` — анимированный placeholder | Визуальный UX |
| 13 | Удалены лишние preconnect | fonts.googleapis.com и fonts.gstatic.com больше не нужны | 2 DNS lookup |
| 14 | Tree-shake CSS (анализ) | Все "unused" селекторы = JS-динамические (.active и т.д.), удалять нечего | Нет (чисто) |

**Результат v1.2:**
- Начальная загрузка: **~7.0 MB → ~5.0 MB** (ещё 30% экономии)
- Общий вес ассетов: **252.5 MB → 215.4 MB** (-37 MB, 15%)
- Hero videos: **27.8 → 15.6 MB** (-44%)
- Preview videos: **18.7 → 7.9 MB** (-58%)
- Photos: **18.4 → 4.6 MB** (-75%)
- Fonts: **691 → 100 KB** (-86%)

---

## Итоговое сравнение: Оригинал → Финал

| Метрика | v1.0 (оригинал) | v1.2 (финал) | Изменение |
|---------|-----------------|--------------|-----------|
| Начальная загрузка | ~31.4 MB | ~5.0 MB | **-84%** |
| Hero videos | 27.8 MB | 15.6 MB | **-44%** |
| Preview videos | 18.7 MB | 7.9 MB | **-58%** |
| Photos | 18.4 MB | 4.6 MB | **-75%** |
| Fonts | 691 KB | 100 KB | **-86%** |
| CSS (minified) | 278 KB | 174 KB | **-37%** |
| JS (minified) | 166 KB | 115 KB | **-31%** |
| HTML issues | 8 | 2 | **-75%** |
| Est. FCP | ~2–3 сек | ~0.3–0.5 сек | **-80%** |
| Est. LCP | ~4–6 сек | ~1.5–2.5 сек | **-60%** |

### Оставшиеся 2 issue (не критичные)
1. **17 autoplay видео** — это preview-видео в карусели, `autoplay` нужен для UX (по дизайну). Они имеют `preload="none"` и загружаются через очередь.
2. **2 TTF шрифта** — TTF сохранены как fallback для старых браузеров, WOFF2 загружается первым.

---

## Технические детали

### Структура оптимизации загрузки

```
Приоритет загрузки (сверху вниз по странице):
  1. Critical CSS (inline в <head>)        — 0ms (уже в HTML)
  2. Poster hero-видео (preload)           — ~50ms (14 KB)
  3. WOFF2 шрифты (preload)                — ~50ms (28 KB)
  4. Hero видео (autoplay, fetchpriority)  — ~2-4 сек (4.38 MB)
  5. Основной CSS (async, non-blocking)    — ~100ms (174 KB)
  6. Script.js (defer)                     — ~100ms (115 KB)
  7. About фотки (lazy, srcset)            — при скролле (14-482 KB)
  8. Preview видео (lazy queue)            — при скролле (~500 KB каждый)
  9. Client логотипы (lazy)                — при скролле (~5-37 KB)
  10. Contact видео (IntersectionObserver) — при скролле до секции (5.53 MB)
  11. Plyr CSS/JS (on demand)              — при клике на видео (~150 KB)
```

### Service Worker (`sw.js`)
- **Precache:** HTML, CSS, JS, WOFF2 шрифты, poster-изображения
- **Стратегия для HTML:** Network-first (свежий контент, fallback на кеш)
- **Стратегия для ассетов:** Stale-while-revalidate (мгновенно из кеша, обновление в фоне)
- **Видео:** Network-only (слишком большие для кеша)

### Responsive images
```html
<img src="Slide_White.webp"
     srcset="Slide_White_sm.webp 480w,
             Slide_White_md.webp 800w,
             Slide_White.webp 2700w"
     sizes="(max-width: 480px) 480px,
            (max-width: 800px) 800px,
            2700px"
     width="2700" height="1600" loading="lazy" />
```

### Lazy-load contact видео
```html
<video class="contact-video" muted playsinline loop preload="none"
       poster="assets/images/poster_contact.webp"
       data-lazy-src="assets/videos/HeroSections/TWTWfinal.mp4">
</video>
```
IntersectionObserver с `rootMargin: '400px'` создаёт `<source>` и запускает загрузку за 400px до появления секции в viewport.

### On-demand Plyr
```javascript
window.__loadPlyr = function(callback) {
  // Динамически загружает plyr.css + plyr.polyfilled.js
  // Вызывает callback когда Plyr готов
};
```

---

## Как измерить скорость

```bash
# Полный аудит (локальные файлы + HTTP тест живого сайта)
python perf_audit.py

# Только локальный аудит (без HTTP)
python perf_audit.py --local

# Тест конкретного URL
python perf_audit.py https://adviral.agency
```

Результаты сохраняются в `perf_results/perf_YYYYMMDD_HHMMSS.json`. При повторном запуске скрипт автоматически сравнивает с предыдущим результатом.

---

## Как откатить изменения

```bash
# Откат до состояния перед второй волной (v1.1)
git checkout backup/pre-optimization-v2

# Откат до любого конкретного коммита
git checkout <commit-hash>

# Вернуться на текущую версию
git checkout master
```

---

## Рекомендации на будущее

Если сайт будет перенесён с GitHub Pages на собственный хостинг/CDN:
- **Brotli сжатие** — на 15-20% лучше gzip для CSS/JS
- **HTTP/2 Server Push** или **103 Early Hints** для критических ресурсов
- **Cloudflare/Bunny CDN** для видео — адаптивный стриминг по скорости клиента
- **Cache-Control: immutable** для статики с hash в имени файла
