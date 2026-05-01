# Psychotherapist Website

Современный сайт психотерапевта на Next.js 16 с пользовательской CMS для редактирования контента, защищенной админ-зоной и полностью типизированной моделью данных.

Этот репозиторий устроен так, чтобы его было удобно поддерживать в долгую: публичная часть, административный вход, CMS-интерфейс, контент-модель и механика защиты разделены по отдельным слоям.

## Кратко

- Публичный сайт для представления специалиста, услуг и контактов.
- Пользовательская CMS с интуитивным интерфейсом редактирования.
- Отдельная админ-страница с логином и паролем.
- Cookie-based доступ к `/admin` через proxy.
- Типизированная структура контента для минимизации ошибок при изменении данных.
- Современный дизайн админ-панели с табами для каждой секции.

## Содержание

1. [Что это за проект](#что-это-за-проект)
2. [Основные возможности](#основные-возможности)
3. [Технологический стек](#технологический-стек)
4. [Как это работает](#как-это-работает)
5. [Структура репозитория](#структура-репозитория)
6. [Контент-модель](#контент-модель)
7. [Админка и безопасность](#админка-и-безопасность)
8. [Локальная разработка](#локальная-разработка)
9. [Переменные окружения](#переменные-окружения)
10. [npm-скрипты](#npm-скрипты)
11. [Рабочий процесс](#рабочий-процесс)
12. [Сборка и деплой](#сборка-и-деплой)
13. [Troubleshooting](#troubleshooting)
14. [Как расширять проект](#как-расширять-проект)
15. [Вклад в проект](#вклад-в-проект)

## Что это за проект

Это лендинг/сайт психотерапевта, ориентированный на:

- представление специалиста и его опыта;
- демонстрацию направлений работы и формата консультаций;
- передачу актуальных контактных данных;
- редактирование ключевого текста через CMS без вмешательства в код компонентов.

Сайт разделен на две зоны:

- публичную часть для посетителей;
- административную часть для редактора/владельца контента.

## Основные возможности

- App Router на Next.js 16.
- React 19 и TypeScript 5.
- Пользовательская CMS с REST API для управления контентом.
- Интуитивный интерфейс редактирования со вкладками для каждой секции.
- Типизированный JSON-контент для главной страницы.
- Защищенная админ-зона с отдельной страницей входа.
- Подписанная сессия в HttpOnly-cookie.
- Проверка доступа к `/admin` на уровне `proxy.ts`.
- Адаптивная верстка для мобильных, планшетов и десктопов.

## Технологический стек

| Слой | Технология |
| --- | --- |
| Framework | Next.js 16.2.2 |
| UI | React 19.2.4 |
| Язык | TypeScript 5 |
| Стили | Tailwind CSS 4 + inline styles там, где это оправдано |
| CMS | Пользовательская REST API |
| Линтинг | ESLint 9 + eslint-config-next |
| Шрифты | `Montserrat`, `Cormorant Garamond` через `next/font/google` |

## Как это работает

### Публичная часть

1. Главная страница находится в [app/page.tsx](app/page.tsx).
2. Контент импортируется из [content/home.json](content/home.json).
3. Компоненты секций получают данные через типизированные пропсы.
4. Рендерятся секции:
   - hero;
   - about;
   - services;
   - contacts.

### Редактирование контента

1. TinaCMS читает схему из [tina/config.ts](tina/config.ts).
2. Коллекция `home` привязана к [content/home.json](content/home.json).
3. Админ открывает `/admin`.
4. После авторизации Tina загружается через [/admin/index.html](public/admin/index.html).
5. Изменения сохраняются в JSON-файл и сразу становятся частью сайта.

### Авторизация и защита

1. Форма входа находится в [app/admin/page.tsx](app/admin/page.tsx).
2. API авторизации — [app/api/admin/login/route.ts](app/api/admin/login/route.ts).
3. При успешном входе создается подписанный токен сессии в cookie `admin_session`.
4. [proxy.ts](proxy.ts) проверяет cookie и решает, пускать ли пользователя в `/admin`.
5. Срок действия сессии ограничен, а cookie помечена как `HttpOnly` и `SameSite=Strict`.

## Структура репозитория

```text
app/
  admin/page.tsx                    # Экран входа в админку
  api/admin/login/route.ts          # Логин-эндпоинт для администратора
  components/                       # Секции сайта и общие UI-компоненты
  lib/adminSession.ts               # Генерация и проверка admin-сессии
  page.tsx                          # Главная страница
  types/content.ts                  # TypeScript-модель контента
  globals.css                       # Глобальные стили
  layout.tsx                        # Корневой layout

content/
  home.json                         # Реальные данные главной страницы

public/
  admin/index.html                  # TinaCMS admin shell и runtime локализация UI
  personal_photos/                  # Изображения автора/специалиста
  social_networks/                  # Иконки соцсетей
  utils/                            # Дополнительные визуальные ассеты

tina/
  config.ts                         # Tina schema и настройки
  __generated__/                    # Сгенерированные Tina файлы

proxy.ts                            # Защита admin-маршрутов
```

## Контент-модель

Главная страница хранится в одном JSON-документе и состоит из четырех крупных блоков.

### Hero

| Поле | Тип | Описание |
| --- | --- | --- |
| `title` | string | Главный заголовок первого экрана |
| `description` | string | Основной текст о подходе |
| `primaryButtonText` | string | Текст основной CTA-кнопки |
| `secondaryButtonText` | string | Текст вторичной CTA-кнопки |

### About

| Поле | Тип | Описание |
| --- | --- | --- |
| `label` | string | Подпись секции |
| `heading` | string | Заголовок блока |
| `intro` | string | Краткое вступление |
| `description` | string | Развернутое описание |
| `timeline` | array | Хронология опыта и дополнительного образования |

#### Структура `timeline`

| Поле | Тип | Описание |
| --- | --- | --- |
| `year` | string | Год, период или заголовок пункта |
| `title` | string | Название этапа/должности |
| `institution` | string | Учреждение или место работы |
| `courses` | string[] | Список курсов или пунктов дополнительного образования |

### Services

| Поле | Тип | Описание |
| --- | --- | --- |
| `label` | string | Подпись секции |
| `description` | string | Вводный текст к блоку услуг |
| `highlight` | string | Важное уточнение или ограничение по работе |
| `cardTitle` | string | Заголовок карточки услуги |
| `cardDescription` | string | Описание карточки |
| `buttonText` | string | Текст CTA-кнопки |
| `items` | string[] | Список направлений или пунктов услуги |

### Contacts

| Поле | Тип | Описание |
| --- | --- | --- |
| `label` | string | Подпись секции |
| `description` | string | Текст про формат связи и записи |
| `phoneLabel` | string | Подпись телефона |
| `phoneValue` | string | Сам номер телефона |
| `hoursLabel` | string | Подпись графика |
| `hoursValue` | string | Основное время работы |
| `hoursSubValue` | string | Дополнительная пометка к графику |

## Админка и безопасность

### Модель входа

Админка не открывается напрямую без проверки. Сценарий выглядит так:

1. Пользователь открывает [app/admin/page.tsx](app/admin/page.tsx).
2. Вводит `ADMIN_USERNAME` и `ADMIN_PASSWORD`.
3. Логин-эндпоинт принимает запрос только с того же origin (`Origin`/`Referer`).
4. Серверная функция в [app/api/admin/login/route.ts](app/api/admin/login/route.ts) проверяет данные.
5. Если логин успешен, создается токен через [app/lib/adminSession.ts](app/lib/adminSession.ts).
6. Токен записывается в cookie `admin_session`.
7. [proxy.ts](proxy.ts) разрешает вход только при валидной cookie.

### Политика cookie

- `HttpOnly`: включено.
- `SameSite`: `strict`.
- `Secure`: включается в production.
- `Path`: `/`.
- `Max-Age`: 2 часа.

### Важные замечания по security

- Не храните реальные production-секреты в репозитории.
- Не используйте короткий пароль администратора.
- Меняйте `ADMIN_SESSION_SECRET`, если подозреваете компрометацию.
- Логин-эндпоинт отклоняет cross-site запросы, чтобы нельзя было получить cookie по внешней ссылке.
- Для production добавьте секреты в managed secret storage у хостинга.

### TinaCMS runtime

В [public/admin/index.html](public/admin/index.html) есть runtime-патч, который:

- переводит UI Tina на русский язык;
- скрывает локальные служебные баннеры Tina;
- убирает шумные сообщения, мешающие работе редактора;
- не требует ручной сборки кастомной версии Tina UI.

## Локальная разработка

### Требования

- Node.js 20 или новее.
- npm 10 или новее.
- Рабочий браузер с поддержкой современных DOM API.

### Установка

```bash
npm install
```

### Файл окружения

Для локальной разработки используйте `.env.local`, а `.env.example` держите в репозитории как шаблон без реальных секретов.

Создайте [`.env.local`](.env.local) и укажите:

```env
ADMIN_USERNAME=admin
ADMIN_PASSWORD=your-strong-password
ADMIN_SESSION_SECRET=your-very-long-random-secret
ADMIN_SESSION_MAX_AGE_SECONDS=7200
```

Если используете Tina Cloud, дополнительно могут понадобиться:

```env
NEXT_PUBLIC_TINA_CLIENT_ID=your-client-id
TINA_TOKEN=your-tina-token
```

### Запуск

```bash
npm run dev
```

В этом проекте dev-скрипт запускает Tina в local mode и Next.js одновременно:

```text
TINA_DEV=true tinacms dev -c "next dev"
```

### Что открыть в браузере

- Публичный сайт: http://localhost:3000
- Экран входа: http://localhost:3000/admin
- Tina после логина: http://localhost:3000/admin/index.html

## Переменные окружения

### Обязательные

| Переменная | Где используется | Зачем нужна |
| --- | --- | --- |
| `ADMIN_USERNAME` | [app/api/admin/login/route.ts](app/api/admin/login/route.ts) | Логин администратора |
| `ADMIN_PASSWORD` | [app/api/admin/login/route.ts](app/api/admin/login/route.ts) | Пароль администратора |
| `ADMIN_SESSION_SECRET` | [app/api/admin/login/route.ts](app/api/admin/login/route.ts), [proxy.ts](proxy.ts), [app/lib/adminSession.ts](app/lib/adminSession.ts) | Секрет подписи сессии |

### Опциональные

| Переменная | Где используется | Зачем нужна |
| --- | --- | --- |
| `NEXT_PUBLIC_TINA_CLIENT_ID` | [tina/config.ts](tina/config.ts) | Tina Cloud client ID |
| `TINA_TOKEN` | [tina/config.ts](tina/config.ts) | Tina Cloud token |
| `GITHUB_BRANCH` | [tina/config.ts](tina/config.ts) | Имя ветки при работе в GitHub |
| `VERCEL_GIT_COMMIT_REF` | [tina/config.ts](tina/config.ts) | Имя ветки на Vercel |
| `HEAD` | [tina/config.ts](tina/config.ts) | Запасной источник имени ветки |
| `ADMIN_SESSION_MAX_AGE_SECONDS` | [app/lib/adminSession.ts](app/lib/adminSession.ts), [app/api/admin/login/route.ts](app/api/admin/login/route.ts) | Длительность admin-сессии в секундах |

## npm-скрипты

| Скрипт | Команда | Что делает |
| --- | --- | --- |
| `dev` | `TINA_DEV=true tinacms dev -c "next dev"` | Локальная разработка с Tina |
| `tina:dev` | `TINA_DEV=true tinacms dev -c "next dev"` | Явный Tina development mode |
| `build` | `next build` | Production build Next.js |
| `tina:build` | `tinacms build && next build` | Сборка Tina admin и Next.js |
| `start` | `next start` | Запуск production-сборки |
| `lint` | `eslint` | Проверка качества кода |

## Рабочий процесс

### Для разработки контента

1. Запустите `npm run dev`.
2. Откройте `/admin` и войдите.
3. Отредактируйте текст нужного блока.
4. Проверьте сайт на главной странице.
5. Сохраните изменения в JSON-контент.

### Для разработки кода

1. Вносите изменения в компоненты внутри `app/components`.
2. Если меняете данные, синхронизируйте:
   - [content/home.json](content/home.json);
   - [app/types/content.ts](app/types/content.ts);
   - [tina/config.ts](tina/config.ts).
3. Запускайте `npm run lint`.
4. Прогоняйте `npm run build`.

### Для правок админки

1. Меняйте [public/admin/index.html](public/admin/index.html).
2. Проверяйте, что патч не ломает загрузку Tina UI.
3. После изменения делайте hard refresh в браузере.

## Сборка и деплой

### Что важно понимать перед деплоем

TinaCMS в этом проекте не деплоится как отдельное приложение. Вместе с Next.js в продакшен уезжает весь репозиторий, а файл [public/admin/index.html](public/admin/index.html) автоматически попадает в сборку как статический admin shell.

Именно поэтому вам не нужно вручную «запаковывать Tina отдельно» или переносить `index.html` в TSX. На сервере должен оказаться весь проект, а не только часть админки.

### Вариант 1. Любой Node.js сервер или VPS

Подходит для:

- обычного VPS на Ubuntu/Debian;
- выделенного сервера;
- Docker-контейнера;
- PaaS, где можно запускать Node.js процесс.

#### Шаг 1. Подготовьте сервер

Убедитесь, что на сервере установлен:

- Node.js 20+;
- npm;
- git или способ загрузить файлы проекта;
- возможность запускать долгоживущий процесс.

#### Шаг 2. Загрузите проект

Скопируйте в серверную директорию:

- весь репозиторий целиком; или
- минимум те же файлы, что и в локальной среде, включая `public/`, `app/`, `content/`, `tina/`.

#### Шаг 3. Настройте переменные окружения

На сервере должны быть заданы:

```env
ADMIN_USERNAME=your_admin_login
ADMIN_PASSWORD=your_admin_password
ADMIN_SESSION_SECRET=your_very_long_random_secret
ADMIN_SESSION_MAX_AGE_SECONDS=7200
```

Если используете Tina Cloud, также добавьте:

```env
NEXT_PUBLIC_TINA_CLIENT_ID=your_client_id
TINA_TOKEN=your_tina_token
```

#### Шаг 4. Установите зависимости и соберите проект

```bash
npm install
npm run build
```

#### Шаг 5. Запустите production-сервер

```bash
npm run start
```

По умолчанию приложение будет доступно на порту `3000`.

#### Шаг 6. Проксируйте домен через nginx или другой reverse proxy

Если хотите открыть сайт по домену, обычно ставят nginx как фронт перед Node.js:

```nginx
server {
  listen 80;
  server_name example.com;

  location / {
    proxy_pass http://127.0.0.1:3000;
    proxy_http_version 1.1;
    proxy_set_header Host $host;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto $scheme;
    proxy_set_header Upgrade $http_upgrade;
    proxy_set_header Connection "upgrade";
  }
}
```

#### Шаг 7. Проверьте админку

После деплоя откройте:

- `/admin` для входа;
- `/admin/index.html` после авторизации.

Если всё настроено правильно, Tina admin shell загрузится с того же сервера, что и сайт.

### Вариант 2. Vercel

Vercel подходит, если вы хотите самый быстрый и простой деплой без ручной настройки сервера.

#### Шаг 1. Подключите репозиторий

1. Залейте проект в GitHub/GitLab/Bitbucket.
2. Импортируйте репозиторий в Vercel.

#### Шаг 2. Настройте переменные окружения в Vercel

Добавьте те же переменные, что и локально:

```env
ADMIN_USERNAME=your_admin_login
ADMIN_PASSWORD=your_admin_password
ADMIN_SESSION_SECRET=your_very_long_random_secret
ADMIN_SESSION_MAX_AGE_SECONDS=7200
NEXT_PUBLIC_TINA_CLIENT_ID=your_client_id
TINA_TOKEN=your_tina_token
```

Если Tina Cloud у вас не подключен, первые три переменные всё равно обязательны для админ-входа.

#### Шаг 3. Деплойте

Vercel сам выполнит сборку через `next build`.

После публикации проверьте:

- главную страницу;
- `/admin`;
- `/admin/index.html`.

#### Шаг 4. Обновления

Каждый push в основную ветку будет автоматически пересобирать приложение.

### Вариант 3. Обычный хостинг через FTP или SFTP

Этот вариант работает только если хостинг поддерживает Node.js процессы.

Если это классический shared-хостинг только под статические HTML/PHP-сайты, текущий проект там не запустится, потому что использует:

- Next.js server runtime;
- API route для логина;
- proxy-защиту `/admin`.

#### Когда FTP или SFTP действительно подходит

- У вас есть SSH/SFTP доступ;
- у провайдера есть Node.js App/Passenger/PM2 или аналог;
- можно запускать команду `npm run start`.

#### Шаг 1. Подготовьте локальный production-пакет

```bash
npm install
npm run build
```

#### Шаг 2. Загрузите проект на хостинг

Через FTP/SFTP передайте на сервер:

- исходники проекта;
- `package.json` и `package-lock.json`;
- папки `app`, `public`, `content`, `tina`;
- конфиги (`next.config.ts`, `tsconfig.json` и т.д.).

#### Шаг 3. Настройте env на хостинге

Минимум:

```env
ADMIN_USERNAME=your_admin_login
ADMIN_PASSWORD=your_admin_password
ADMIN_SESSION_SECRET=your_very_long_random_secret
ADMIN_SESSION_MAX_AGE_SECONDS=7200
```

#### Шаг 4. Установите зависимости и запустите

Если хостинг дает консоль/SSH:

```bash
npm install
npm run build
npm run start
```

Если у хостинга есть UI для Node App, укажите:

- Start command: `npm run start`
- Build command: `npm run build`

#### Шаг 5. Проверьте маршруты

После запуска проверьте:

- `/`
- `/admin`
- `/admin/index.html`

Если эти страницы открываются, значит Tina admin shell и Next.js запущены корректно.

### Локальная production-проверка

```bash
npm run build
npm run start
```

### Tina build

Используйте `npm run tina:build`, если вам нужно собрать Tina-ассеты перед production. Если Tina Cloud не настроен, локальная проверка обычно достаточна через `npm run build`.

### Перед публикацией проверьте

1. Линтер проходит без ошибок.
2. Production build проходит без ошибок.
3. В production настроены секреты.
4. Админка открывается только после логина.
5. Контент на главной странице отображается корректно на mobile и desktop.

## Troubleshooting

### `/admin` не открывается

- Убедитесь, что запущен именно `npm run dev`.
- Проверьте, что `public/admin/index.html` существует.
- Убедитесь, что cookie `admin_session` установилась после входа.

### Логин не проходит

- Проверьте `ADMIN_USERNAME` и `ADMIN_PASSWORD`.
- Проверьте `ADMIN_SESSION_SECRET`.
- Перезапустите dev-сервер после изменения `.env.local`.

### Видите `You are local mode` или другой служебный текст Tina

- Сделайте hard refresh.
- Убедитесь, что обновлен [public/admin/index.html](public/admin/index.html).

### Появляется CORS/NetworkError на PostHog

- Проверьте, что `telemetry: "disabled"` включен в [tina/config.ts](tina/config.ts).
- Убедитесь, что dev-скрипт запускает Tina с `TINA_DEV=true`.

### `tina:build` жалуется на токен

- Это ожидаемо без Tina Cloud credentials.
- Для локальной разработки используйте `npm run dev` и `npm run build`.

## Как расширять проект

### Добавить новый блок на главную

1. Добавьте новый объект в `HomeContent`.
2. Расширьте [content/home.json](content/home.json).
3. Добавьте новую секцию в [tina/config.ts](tina/config.ts).
4. Создайте компонент в [app/components](app/components).
5. Подключите компонент в [app/page.tsx](app/page.tsx).

### Добавить новые поля в существующий блок

1. Обновите JSON.
2. Обновите типы.
3. Обновите Tina schema.
4. Передайте новые поля в компонент.

### Добавить новый admin flow

1. Создайте API route.
2. Расширьте модель сессии в [app/lib/adminSession.ts](app/lib/adminSession.ts) при необходимости.
3. Обновите proxy-маршрутизацию.
4. Документируйте изменения в README.

## Вклад в проект

Если хотите предложить улучшение, действуйте как в зрелом open-source проекте:

1. Откройте issue с описанием проблемы или идеи.
2. Проверьте, что изменение не ломает текущий контент и админ-флоу.
3. Сделайте маленький осмысленный PR.
4. Приложите скриншоты, если меняете UI.
5. Обязательно опишите, как проверить изменение локально.

## Лицензия

В репозитории сейчас не задан отдельный `LICENSE` файл. Если вы планируете публиковать проект как open-source, добавьте подходящую лицензию отдельно.
