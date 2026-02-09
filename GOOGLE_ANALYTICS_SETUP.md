# Google Analytics + Cursor AI — Настройка

## Что это
MCP-сервер (`analytics-mcp`) позволяет ИИ в Cursor напрямую запрашивать данные из Google Analytics 4 — трафик, события, отчёты в реальном времени и т.д.

## Что было сделано

### 1. Google Analytics
- GA4 подключена к сайту ADViralAgency
- Тег отслеживания встроен в `index.html`

### 2. Google Cloud Console (https://console.cloud.google.com)
- Проект: **My First Project** (ID: `learned-shell-486720-n3`)
- Включены API:
  - Google Analytics Admin API
  - Google Analytics Data API
- Создан Service Account: `analytics-mcp@learned-shell-486720-n3.iam.gserviceaccount.com`
- Скачан JSON-ключ сервисного аккаунта

### 3. Google Analytics — доступ
- В GA4 (Admin → Property Access Management) сервисному аккаунту дана роль **Viewer**

### 4. Cursor MCP
- Конфиг: `.cursor/mcp.json`
- MCP-сервер: `analytics-mcp` (официальный от Google, запускается через `pipx`)

---

## Текущие пути и значения

| Что | Значение |
|-----|----------|
| Google Cloud Project ID | `learned-shell-486720-n3` |
| Service Account Email | `analytics-mcp@learned-shell-486720-n3.iam.gserviceaccount.com` |
| JSON-ключ | `C:\Users\omego\Desktop\MyProjects\Programming\Sth_Unsorted\google-analytics-key.json` |
| pipx | `C:\Users\omego\AppData\Roaming\Python\Python314\Scripts\pipx.exe` |
| MCP конфиг | `.cursor/mcp.json` |

---

## Как пользоваться

Просто спроси ИИ в Cursor, например:
- "Сколько пользователей было на сайте за последнюю неделю?"
- "Какие страницы самые популярные?"
- "Покажи трафик в реальном времени"
- "Какие события чаще всего срабатывают?"

ИИ сам вызовет MCP-сервер и получит данные из GA4.

---

## Как восстановить с нуля (новый компьютер / потеря данных)

### Шаг 1 — Установить Python и pipx
```
pip install pipx
pipx ensurepath
```

### Шаг 2 — Включить API в Google Cloud
Зайти на https://console.cloud.google.com (проект `learned-shell-486720-n3`):
- Включить [Google Analytics Admin API](https://console.cloud.google.com/apis/library/analyticsadmin.googleapis.com)
- Включить [Google Analytics Data API](https://console.cloud.google.com/apis/library/analyticsdata.googleapis.com)

### Шаг 3 — Создать новый ключ (если старый утерян)
1. https://console.cloud.google.com/iam-admin/serviceaccounts?project=learned-shell-486720-n3
2. Кликнуть на `analytics-mcp@...` → Keys → Add Key → Create new key → JSON
3. Сохранить файл, запомнить путь

### Шаг 4 — Дать доступ в GA4 (если новый сервисный аккаунт)
1. Google Analytics → Admin → Property Access Management
2. Добавить email сервисного аккаунта с ролью **Viewer**

### Шаг 5 — Настроить .cursor/mcp.json
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

### Шаг 6 — Перезапустить Cursor
MCP-сервер `analytics-mcp` должен появиться в настройках.

---

## Важно
- **JSON-ключ — это секрет.** Не коммитить в git, не публиковать.
- Терминал Google Cloud НЕ нужно держать открытым — всё работает через ключ.
- Если ключ скомпрометирован — удалить его в Google Cloud Console и создать новый.
- gcloud CLI установлен, но для работы MCP он не требуется.

---

## Полезные ссылки
- [Google Cloud Console](https://console.cloud.google.com)
- [Google Analytics](https://analytics.google.com)
- [analytics-mcp на GitHub](https://github.com/googleanalytics/google-analytics-mcp)
- [Service Accounts](https://console.cloud.google.com/iam-admin/serviceaccounts?project=learned-shell-486720-n3)
