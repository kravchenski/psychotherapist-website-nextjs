import { defineConfig } from "tinacms";

const branch =
  process.env.GITHUB_BRANCH ||
  process.env.VERCEL_GIT_COMMIT_REF ||
  process.env.HEAD ||
  "master";

export default defineConfig({
  branch,
  telemetry: "disabled",
  build: {
    outputFolder: "admin",
    publicFolder: "public",
  },
  media: {
    tina: {
      mediaRoot: "",
      publicFolder: "public",
    },
  },
  schema: {
    collections: [
      {
        name: "home",
        label: "Главная страница",
        path: "content",
        format: "json",
        match: {
          include: "home",
        },
        ui: {
          allowedActions: {
            create: false,
            delete: false,
          },
        },
        fields: [
          {
            type: "object",
            name: "hero",
            label: "Первый экран",
            fields: [
              { type: "string", name: "title", label: "Заголовок" },
              {
                type: "string",
                name: "description",
                label: "Описание",
                ui: { component: "textarea" },
              },
              { type: "string", name: "primaryButtonText", label: "Текст кнопки 1" },
              { type: "string", name: "secondaryButtonText", label: "Текст кнопки 2" },
            ],
          },
          {
            type: "object",
            name: "about",
            label: "Обо мне",
            fields: [
              { type: "string", name: "label", label: "Подпись секции" },
              { type: "string", name: "heading", label: "Заголовок" },
              {
                type: "string",
                name: "intro",
                label: "Короткий текст",
                ui: { component: "textarea" },
              },
              {
                type: "string",
                name: "description",
                label: "Описание",
                ui: { component: "textarea" },
              },
              {
                type: "object",
                name: "timeline",
                label: "Хронология",
                list: true,
                fields: [
                  { type: "string", name: "year", label: "Период" },
                  { type: "string", name: "title", label: "Заголовок" },
                  {
                    type: "string",
                    name: "institution",
                    label: "Учреждение",
                    ui: { component: "textarea" },
                  },
                  {
                    type: "string",
                    name: "courses",
                    label: "Курсы",
                    list: true,
                  },
                ],
              },
            ],
          },
          {
            type: "object",
            name: "services",
            label: "Услуги",
            fields: [
              { type: "string", name: "label", label: "Подпись секции" },
              {
                type: "string",
                name: "description",
                label: "Описание",
                ui: { component: "textarea" },
              },
              {
                type: "string",
                name: "highlight",
                label: "Выделенный текст",
                ui: { component: "textarea" },
              },
              { type: "string", name: "cardTitle", label: "Заголовок карточки" },
              {
                type: "string",
                name: "cardDescription",
                label: "Описание карточки",
                ui: { component: "textarea" },
              },
              { type: "string", name: "buttonText", label: "Текст кнопки" },
              {
                type: "string",
                name: "items",
                label: "Список услуг",
                list: true,
              },
            ],
          },
          {
            type: "object",
            name: "contacts",
            label: "Контакты",
            fields: [
              { type: "string", name: "label", label: "Подпись секции" },
              {
                type: "string",
                name: "description",
                label: "Описание",
                ui: { component: "textarea" },
              },
              { type: "string", name: "phoneLabel", label: "Подпись телефона" },
              { type: "string", name: "phoneValue", label: "Телефон" },
              { type: "string", name: "hoursLabel", label: "Подпись часов" },
              { type: "string", name: "hoursValue", label: "Часы работы" },
              { type: "string", name: "hoursSubValue", label: "Подстрока часов" },
            ],
          },
        ],
      },
    ],
  },
});
