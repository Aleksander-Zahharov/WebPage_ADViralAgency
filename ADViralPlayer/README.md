# ADViralPlayer

Плеер на базе [Plyr](https://github.com/sampotts/plyr) с единым дизайном: модальное окно видео, центральная кнопка Play/Пауза, прогресс-бар по центру, время под прогрессом (тот же отступ слева, что и у прогресс-бара — 12px) в одном ряду с кнопками Settings и Fullscreen, меню Quality/Speed без кнопок «Назад», скрытие панели через 3 с без взаимодействия, громкость скрыта на мобильных/планшетах.

## Зависимости

- **Plyr** (JS + CSS): подключите официальную сборку Plyr перед ADViralPlayer.
  ```html
  <link rel="stylesheet" href="https://cdn.plyr.io/3.7.8/plyr.css" />
  <script src="https://cdn.plyr.io/3.7.8/plyr.polyfilled.js"></script>
  ```

## Подключение

1. Подключите стили ADViralPlayer **после** стилей Plyr:
   ```html
   <link rel="stylesheet" href="path/to/ADViralPlayer.css" />
   ```

2. Подключите скрипт **после** Plyr:
   ```html
   <script src="path/to/ADViralPlayer.js"></script>
   ```

3. В разметке контейнер с видео должен иметь класс **`AdviralPlayer`** или **`video-modal-content`**, а сам `<video>` — тот элемент, который передаёте в `ADViralPlayer.init()`.

## HTML-структура (пример модалки)

```html
<div class="video-modal" id="video-modal" hidden>
  <div class="video-modal-overlay"></div>
  <div class="video-modal-container">
    <button class="video-modal-close" aria-label="Close">×</button>
    <div class="video-modal-content AdviralPlayer" id="adviral-player">
      <div class="video-seek-indicator" id="video-seek-indicator"></div>
      <video id="modal-video-player" playsinline crossorigin>
        <source src="video.mp4" type="video/mp4" />
      </video>
    </div>
  </div>
</div>
```

После инициализации Plyr создаёт внутри контейнера свою разметку (`.plyr`, контролы и т.д.). Класс `AdviralPlayer` или `video-modal-content` должен оставаться на обёртке видео (как в примере выше).

## Инициализация

```javascript
const videoEl = document.getElementById('modal-video-player');
const player = ADViralPlayer.init(videoEl);
// player — экземпляр Plyr; можно вызывать player.play(), player.pause() и т.д.
```

Опционально можно передать контейнер индикатора перемотки (для мобильных «+5 sec» / «-5 sec»):

```javascript
ADViralPlayer.init(videoEl, { seekIndicatorId: 'video-seek-indicator' });
```

## Смена видео (важно)

При переключении на другое видео **не вызывайте** `player.source = { ... }` — Plyr пересоздаёт весь UI и сбрасывает настройки. Меняйте только источник у элемента `<video>` и вызывайте `load()`:

```javascript
videoElement.querySelector('source').src = newVideoUrl;
videoElement.src = newVideoUrl;
videoElement.load();
// Воспроизведение после загрузки:
videoElement.addEventListener('loadeddata', function playOnce() {
  videoElement.removeEventListener('loadeddata', playOnce);
  player.play().catch(function () {});
}, { once: true });
if (videoElement.readyState >= 2) player.play().catch(function () {});
```

## Пути к ресурсам в CSS

В `ADViralPlayer.css` используются пути к иконкам:

- `url("./assets/images/icons/icon_play.svg")`
- `url("./assets/images/icons/icon_pause.svg")`
- `url("./assets/images/icons/icon_arrow.png")` — для стрелок навигации (если используете `.modal-arrow`)

Скопируйте папку `assets/images/icons/` в свой проект или измените эти пути в CSS под свою структуру.

## Переменные (опционально)

- В корне страницы или в контейнере можно задать `--blur` (например `10px`) для `backdrop-filter` у кнопок и меню.
- Для светлой темы контейнер или `html` должен иметь атрибут `data-theme="light"` — тогда применяются переопределения для плеера в светлой теме.

## Файлы в этой папке

| Файл | Описание |
|------|----------|
| `README.md` | Эта инструкция |
| `ADViralPlayer.js` | Конфиг Plyr и `applyAdviralControlsLayout()`: time-group (отступ 12px как у прогресс-бара), seek fix, adviral-controls-right, скрытие громкости на мобильных, удаление кнопок «Назад», idle, мобильные жесты. При смене видео — только `video.src` + `video.load()`, не `player.source`. |
| `ADViralPlayer.css` | Все стили плеера (модалка, контролы, прогресс, время margin-left 12px, меню, кнопка Play по центру, адаптив). Полный дубликат блока из основного проекта. |

Скопируйте папку `ADViralPlayer` в новый проект и подключите CSS/JS как выше — плеер будет выглядеть и работать так же, как на сайте ADViralAgency.

---

**Синхронизация с основным проектом:** если вы правите плеер в `styles.css` или `script.js`, обновить сохранённую копию можно так:
- **Стили:** в `styles.css` блок ADViralPlayer начинается с комментария `/* =========================` и строки `ADViralPlayer — единый дизайн плеера` (около строки 5707) и заканчивается перед следующим крупным блоком; медиазапросы для плеера разбросаны до ~6995. Скопируйте актуальный диапазон в `ADViralPlayer.css`.
- **Логика:** инициализация Plyr и функция `applyAdviralControlsLayout()` в `script.js` (поиск по `initPlayer` / `applyAdviralControlsLayout`) продублированы в `ADViralPlayer.js`. При смене видео в основном проекте используется только `setupQualitySources()` + `modalPlayer.load()`, без `player.source`.
