# ADViral Agency — One‑Page Site

Статический одностраничный сайт (HTML/CSS/JS):
- Hero с видео и спотлайтом заголовка
- Секции: Кто мы, Услуги, Работы (IG‑лента), Партнеры (marquee)
- Контакты и пакеты с формой запроса

## Публикация на GitHub Pages (через Actions)
В репозитории уже есть workflow `.github/workflows/pages.yml`. Достаточно запушить в ветку `main` — сайт задеплоится автоматически и появится в `Actions → Deployments`.

URL будет вида: `https://<username>.github.io/<repo>/`.

## Настройка формы
Сейчас форма отправляет JSON на `https://example.com/send-email` (заглушка). Подмените URL в `script.js` на ваш серверный эндпоинт, принимающий `application/json`.

## Локальный просмотр
Откройте `index.html` в браузере или поднимите простой HTTP‑сервер.
