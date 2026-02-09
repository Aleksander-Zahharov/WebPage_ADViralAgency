# Google Analytics — ADViral Agency

> **При любых изменениях в аналитике — обновлять этот файл.**

---

## 1. Обзор

ИИ в Cursor подключён к Google Analytics 4 через MCP-сервер `analytics-mcp`.  
Это позволяет запрашивать любые данные аналитики прямо в чате — трафик, события, устройства, отчёты в реальном времени.

**Примеры запросов:**
- "Сколько пользователей за последнюю неделю?"
- "Какие видео открывают чаще всего?"
- "С каких устройств заходят?"
- "Покажи трафик в реальном времени"
- "На какой секции проводят больше всего времени?"

---

## 2. Что отслеживается на сайте

### 2.1 Автоматически (GA4 + GTM)

Эти данные GA4 собирает без дополнительного кода:

| Метрика | Пример запроса ИИ | GA4 dimension / metric |
|---------|-------------------|------------------------|
| Пользователи | "Сколько юзеров за неделю?" | `totalUsers`, `newUsers` |
| Сессии | "Сколько сессий за месяц?" | `sessions` |
| Просмотры страниц | "Сколько page_view?" | event `page_view` |
| Устройство | "Desktop или mobile?" | `deviceCategory` |
| ОС | "Windows, iOS, Android?" | `operatingSystem` |
| Браузер | "Chrome, Safari, Edge?" | `browser` |
| Новые / вернувшиеся | "Повторные визиты?" | `newVsReturning` |
| Страна и город | "Откуда заходят?" | `country`, `city` |
| Язык браузера | "Какие языки?" | `language` |
| Разрешение экрана | "Какие экраны?" | `screenResolution` |
| Источник трафика | "Откуда приходят?" | `sessionSource`, `sessionMedium` |
| Скролл (90% страницы) | "Доскроллили?" | event `scroll` |
| Клики по внешним ссылкам | "Внешние клики?" | event `click` |
| Начало заполнения формы | "Начали форму?" | event `form_start` |
| Вовлечённость | "Средняя вовлечённость?" | `userEngagementDuration` |
| Реальное время | "Кто сейчас на сайте?" | `run_realtime_report` |

### 2.2 Кастомные события (код в `script.js`)

Реализованы через `window.dataLayer.push()` → GTM → GA4:

| Событие | Когда срабатывает | Параметры |
|---------|-------------------|-----------|
| `contact_form_submit` | Форма заявки успешно отправлена | `form_name`, `form_email`, `form_company`, `form_services` |
| `portfolio_view` | Открыли видео из портфолио | `video_name`, `video_src` |
| `video_play` | Видео начало воспроизведение | `video_name`, `video_src` |
| `video_complete` | Видео досмотрено до конца | `video_name`, `video_src`, `video_watched_seconds`, `video_duration_seconds`, `video_percent_watched` |
| `video_close` | Видео закрыто (не досмотрев) | `video_name`, `video_src`, `video_watched_seconds`, `video_duration_seconds`, `video_percent_watched` |
| `section_time` | Каждые 30 сек пока секция видна | `section_name`, `section_id`, `time_seconds` |
| `page_exit` | Пользователь уходит со страницы | `exit_section`, `section_times` (JSON со всеми секциями) |

### 2.3 Секции с учётом времени

| ID | Название | Содержимое |
|----|----------|------------|
| `hero` | Hero | Главный экран с видеофоном |
| `about` | Who We Are | Описание агентства |
| `works` | Our Work | Видео-портфолио |
| `services` | Services | Карточки услуг |
| `partners` | Partners | Логотипы клиентов |
| `contact` | Contact | Форма заявки |

### 2.4 Search Console (после подключения)

| Метрика | Описание |
|---------|----------|
| Поисковые запросы | По каким словам находят сайт |
| Позиции в Google | На каком месте в выдаче |
| CTR | Процент кликов из поиска |
| Показы | Сколько раз показывался в Google |

---

## 3. Инфраструктура

### Ключевые параметры

| Параметр | Значение |
|----------|----------|
| GA4 Property | `ADViral Agency Website` (ID: `521315306`) |
| GTM Container | `GTM-TXV6V4W6` |
| Google Cloud Project | `learned-shell-486720-n3` |
| Service Account | `analytics-mcp@learned-shell-486720-n3.iam.gserviceaccount.com` |
| JSON-ключ | `C:\Users\omego\Desktop\MyProjects\Programming\Sth_Unsorted\google-analytics-key.json` |
| pipx | `C:\Users\omego\AppData\Roaming\Python\Python314\Scripts\pipx.exe` |
| MCP конфиг | `.cursor/mcp.json` |
| Часовой пояс | Europe/Tallinn |
| Валюта | EUR |

### Включённые API

- Google Analytics Admin API
- Google Analytics Data API

### Доступ

- Service Account имеет роль **Viewer** в GA4 (Admin → Property Access Management)

---

## 4. Настройка GTM (кастомные события)

Чтобы кастомные события попали в GA4 отчёты:

1. [tagmanager.google.com](https://tagmanager.google.com) → контейнер `GTM-TXV6V4W6`
2. **Triggers** → New → Custom Event → вписать имя события (например `contact_form_submit`)
3. **Tags** → New → GA4 Event → выбрать триггер → указать параметры
4. **Publish**

Или: GA4 Admin → Data Streams → Enhanced Measurement (автоматически подхватывает часть событий).

---

## 5. Google Search Console — подключение

1. Зайти на https://search.google.com/search-console
2. Добавить ресурс: `https://adviral.agency/`
3. Подтвердить владение (через Google Analytics — самый быстрый способ)
4. GA4 → Admin → Product Links → **Search Console Links** → Link

---

## 6. Восстановление с нуля

Если нужно настроить заново (новый ПК, потеря данных):

### 6.1 Установить pipx
```
pip install pipx
pipx ensurepath
```

### 6.2 Включить API
- [Google Analytics Admin API](https://console.cloud.google.com/apis/library/analyticsadmin.googleapis.com)
- [Google Analytics Data API](https://console.cloud.google.com/apis/library/analyticsdata.googleapis.com)

### 6.3 Получить JSON-ключ
1. https://console.cloud.google.com/iam-admin/serviceaccounts?project=learned-shell-486720-n3
2. Кликнуть на `analytics-mcp@...` → Keys → Add Key → JSON
3. Сохранить файл

### 6.4 Дать доступ в GA4
- Google Analytics → Admin → Property Access Management → добавить email с ролью **Viewer**

### 6.5 Создать `.cursor/mcp.json`
```json
{
  "mcpServers": {
    "analytics-mcp": {
      "command": "ПОЛНЫЙ_ПУТЬ_К_pipx.exe",
      "args": ["run", "analytics-mcp"],
      "env": {
        "GOOGLE_APPLICATION_CREDENTIALS": "ПОЛНЫЙ_ПУТЬ_К_JSON_КЛЮЧУ",
        "GOOGLE_PROJECT_ID": "learned-shell-486720-n3"
      }
    }
  }
}
```

### 6.6 Перезапустить Cursor

---

## 7. Безопасность

- **JSON-ключ — секрет.** Не коммитить в git, не публиковать
- `.cursor/` добавлен в `.gitignore`
- Ключ хранится вне проекта
- При компрометации: удалить ключ в Google Cloud Console → создать новый
- gcloud CLI установлен, но для работы MCP **не нужен**
- Терминал Google Cloud **не нужно** держать открытым

---

## 8. Ссылки

| Сервис | URL |
|--------|-----|
| Google Cloud Console | https://console.cloud.google.com |
| Google Analytics | https://analytics.google.com |
| Google Tag Manager | https://tagmanager.google.com |
| Google Search Console | https://search.google.com/search-console |
| Service Accounts | https://console.cloud.google.com/iam-admin/serviceaccounts?project=learned-shell-486720-n3 |
| analytics-mcp (GitHub) | https://github.com/googleanalytics/google-analytics-mcp |
