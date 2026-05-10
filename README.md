# Psychotherapist Website

Сайт на Next.js 16 с собственной админкой, Prisma/Postgres для CMS-контента и Vercel Blob для изображений, загружаемых из админ-панели.

## Стек

- `Next.js 16` + `React 19`
- `Prisma` + `Postgres`
- `Vercel Blob` для фото из CMS
- cookie-based admin auth через `proxy.ts`

## Как устроено

- Текстовый контент главной страницы хранится в таблице `SiteContent`.
- Дефолтный контент лежит в [content/home.json](/home/kravchenski/projects/NEXT.JS/psychotherapist-website/content/home.json).
- При первом чтении приложение может использовать JSON как fallback и записать его в БД.
- Изображения, загруженные из админки, отправляются через [app/api/upload/route.ts](/home/kravchenski/projects/NEXT.JS/psychotherapist-website/app/api/upload/route.ts) в Vercel Blob и сохраняются в контенте как публичные URL.

## Переменные окружения

Шаблон есть в [.env.example](/home/kravchenski/projects/NEXT.JS/psychotherapist-website/.env.example).

Обязательные переменные:

```env
DATABASE_URL=postgresql://USER:PASSWORD@HOST:5432/DATABASE?schema=public
PRISMA_DATABASE_URL=postgresql://USER:PASSWORD@HOST:5432/DATABASE?schema=public
POSTGRES_URL=postgresql://USER:PASSWORD@HOST:5432/DATABASE?schema=public
BLOB_READ_WRITE_TOKEN=vercel_blob_rw_token
VERCEL_DEPLOY_HOOK_URL=https://api.vercel.com/v1/integrations/deploy/your-project/your-hook
ADMIN_USERNAME=admin
ADMIN_PASSWORD=change-me
ADMIN_SESSION_SECRET=replace-with-a-long-random-secret
ADMIN_SESSION_MAX_AGE_SECONDS=7200
```

## Локальный запуск

```bash
npm install
npm run dev
```

Открывайте:

- `/` — публичный сайт
- `/admin` — вход в админку
- `/admin/dashboard` — редактор контента после логина

## Vercel workflow

Ниже тот порядок, который нужен для нормальной привязки проекта к Vercel и базе:

```bash
vercel link
vercel env pull .env.development.local
npx prisma migrate dev --name init
vercel deploy
```

Что важно:

- `vercel link` связывает локальный репозиторий с Vercel project.
- `vercel env pull .env.development.local` подтягивает `DATABASE_URL`, `POSTGRES_URL`, `BLOB_READ_WRITE_TOKEN` и остальные секреты из Vercel.
- `npx prisma migrate dev --name init` создаёт локальную миграцию и применяет её к dev-базе.
- `vercel deploy` публикует проект с теми же переменными окружения.
- Если админка работает на Vercel, кнопка деплоя вызывает `VERCEL_DEPLOY_HOOK_URL` и запускает новый deploy проекта.

## Prisma

Схема Prisma находится в [prisma/schema.prisma](/home/kravchenski/projects/NEXT.JS/psychotherapist-website/prisma/schema.prisma).

Сейчас в базе нужен только один основной объект:

- `SiteContent` — JSON-контент CMS

Служебный клиент Prisma создаётся в [app/lib/prisma.ts](/home/kravchenski/projects/NEXT.JS/psychotherapist-website/app/lib/prisma.ts).

## Vercel Blob

Загрузка изображений идёт через [app/api/upload/route.ts](/home/kravchenski/projects/NEXT.JS/psychotherapist-website/app/api/upload/route.ts).

- API принимает `multipart/form-data`
- пропускает только `jpeg/png/webp/svg`
- режет размер до `5MB`
- загружает файл в публичный Blob
- возвращает готовый URL, который сразу сохраняется в CMS

Чтобы изображения с Blob корректно работали в `next/image`, разрешён удалённый хост в [next.config.ts](/home/kravchenski/projects/NEXT.JS/psychotherapist-website/next.config.ts).

## Основные файлы

- [app/page.tsx](/home/kravchenski/projects/NEXT.JS/psychotherapist-website/app/page.tsx) — главная страница
- [app/admin/page.tsx](/home/kravchenski/projects/NEXT.JS/psychotherapist-website/app/admin/page.tsx) — логин
- [app/admin/dashboard/page.tsx](/home/kravchenski/projects/NEXT.JS/psychotherapist-website/app/admin/dashboard/page.tsx) — CMS
- [app/api/content/route.ts](/home/kravchenski/projects/NEXT.JS/psychotherapist-website/app/api/content/route.ts) — чтение контента
- [app/api/admin/content/route.ts](/home/kravchenski/projects/NEXT.JS/psychotherapist-website/app/api/admin/content/route.ts) — сохранение контента
- [app/components/AdminContentEditor.tsx](/home/kravchenski/projects/NEXT.JS/psychotherapist-website/app/components/AdminContentEditor.tsx) — UI редактора

## Проверка перед деплоем

```bash
npm run lint
npm run build
```

Если деплой идёт в Vercel, проверьте, что в проекте реально заданы:

- `DATABASE_URL`
- `POSTGRES_URL` или `PRISMA_DATABASE_URL`
- `BLOB_READ_WRITE_TOKEN`
- `VERCEL_DEPLOY_HOOK_URL`
- `ADMIN_USERNAME`
- `ADMIN_PASSWORD`
- `ADMIN_SESSION_SECRET`
