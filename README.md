# Psychotherapist Website

Next.js 16 сайт с админкой. Контент CMS хранится в файле [content/home.json](/home/kravchenski/projects/NEXT.JS/psychotherapist-website/content/home.json), база данных не используется.

## Стек

- `Next.js 16` + `React 19`
- `Bun`
- `Vercel Blob` для фото из CMS
- cookie-based admin auth через `proxy.ts`

## Переменные окружения

Шаблон есть в [.env.example](/home/kravchenski/projects/NEXT.JS/psychotherapist-website/.env.example).

```env
BLOB_READ_WRITE_TOKEN=vercel_blob_rw_token
ADMIN_USERNAME=admin
ADMIN_PASSWORD=change-me
ADMIN_SESSION_SECRET=replace-with-a-long-random-secret
ADMIN_SESSION_MAX_AGE_SECONDS=7200
ADMIN_COOKIE_SECURE=false
ADMIN_ALLOWED_ORIGINS=https://example.com,http://example.com
```

## Локальный запуск

```bash
bun install
bun run dev
```

Открывайте:

- `/` — публичный сайт
- `/admin` — вход в админку
- `/admin/dashboard` — редактор контента после логина

## VPS

На VPS используется [server.js](/home/kravchenski/projects/NEXT.JS/psychotherapist-website/server.js). Он поддерживает оба варианта запуска, которые обычно даёт панель хостинга:

- `SOCKET` — слушает Unix socket и выставляет права `0660`
- `PORT` + `INSTANCE_HOST` — слушает HTTP host/port

Команды:

```bash
bun install
bun run build
NODE_ENV=production node server.js
```

Если панель сама запускает приложение, укажите entrypoint:

```text
server.js
```

Если панель просит start command:

```bash
NODE_ENV=production node server.js
```

## Важные файлы

- [server.js](/home/kravchenski/projects/NEXT.JS/psychotherapist-website/server.js) — production server для VPS
- [content/home.json](/home/kravchenski/projects/NEXT.JS/psychotherapist-website/content/home.json) — редактируемый CMS-контент
- [app/lib/contentStore.ts](/home/kravchenski/projects/NEXT.JS/psychotherapist-website/app/lib/contentStore.ts) — файловое хранилище контента
- [app/api/admin/content/route.ts](/home/kravchenski/projects/NEXT.JS/psychotherapist-website/app/api/admin/content/route.ts) — сохранение контента из админки
- [app/api/upload/route.ts](/home/kravchenski/projects/NEXT.JS/psychotherapist-website/app/api/upload/route.ts) — загрузка изображений в Vercel Blob

## Проверка

```bash
bun run lint
bun run build
```
