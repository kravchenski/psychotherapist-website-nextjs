// tina/config.ts
import { LocalAuthProvider, defineConfig } from "tinacms";
var SelfHostedAuthProvider = class extends LocalAuthProvider {
  async authenticate() {
    if (typeof window !== "undefined") {
      window.location.assign("/admin");
    }
    return {
      access_token: "",
      id_token: "",
      refresh_token: ""
    };
  }
  async getUser() {
    try {
      const response = await fetch("/api/admin/session", {
        credentials: "include"
      });
      if (!response.ok) {
        return null;
      }
      return await response.json();
    } catch {
      return null;
    }
  }
  async getToken() {
    const user = await this.getUser();
    return user ? { id_token: "admin-session" } : { id_token: "" };
  }
  async logout() {
    try {
      await fetch("/api/admin/logout", {
        method: "POST",
        credentials: "include"
      });
    } catch {
    }
    if (typeof window !== "undefined") {
      window.location.assign("/admin");
    }
  }
};
var branch = process.env.GITHUB_BRANCH || process.env.VERCEL_GIT_COMMIT_REF || process.env.HEAD || "master";
var config_default = defineConfig({
  branch,
  telemetry: "disabled",
  contentApiUrlOverride: "/api/tina/gql",
  authProvider: new SelfHostedAuthProvider(),
  build: {
    outputFolder: "admin",
    publicFolder: "public"
  },
  media: {
    tina: {
      mediaRoot: "",
      publicFolder: "public"
    }
  },
  schema: {
    collections: [
      {
        name: "home",
        label: "\u0413\u043B\u0430\u0432\u043D\u0430\u044F \u0441\u0442\u0440\u0430\u043D\u0438\u0446\u0430",
        path: "content",
        format: "json",
        match: {
          include: "home"
        },
        ui: {
          allowedActions: {
            create: false,
            delete: false
          }
        },
        fields: [
          {
            type: "object",
            name: "hero",
            label: "\u041F\u0435\u0440\u0432\u044B\u0439 \u044D\u043A\u0440\u0430\u043D",
            fields: [
              { type: "string", name: "title", label: "\u0417\u0430\u0433\u043E\u043B\u043E\u0432\u043E\u043A" },
              {
                type: "string",
                name: "description",
                label: "\u041E\u043F\u0438\u0441\u0430\u043D\u0438\u0435",
                ui: { component: "textarea" }
              },
              { type: "string", name: "primaryButtonText", label: "\u0422\u0435\u043A\u0441\u0442 \u043A\u043D\u043E\u043F\u043A\u0438 1" },
              { type: "string", name: "secondaryButtonText", label: "\u0422\u0435\u043A\u0441\u0442 \u043A\u043D\u043E\u043F\u043A\u0438 2" }
            ]
          },
          {
            type: "object",
            name: "about",
            label: "\u041E\u0431\u043E \u043C\u043D\u0435",
            fields: [
              { type: "string", name: "label", label: "\u041F\u043E\u0434\u043F\u0438\u0441\u044C \u0441\u0435\u043A\u0446\u0438\u0438" },
              { type: "string", name: "heading", label: "\u0417\u0430\u0433\u043E\u043B\u043E\u0432\u043E\u043A" },
              {
                type: "string",
                name: "intro",
                label: "\u041A\u043E\u0440\u043E\u0442\u043A\u0438\u0439 \u0442\u0435\u043A\u0441\u0442",
                ui: { component: "textarea" }
              },
              {
                type: "string",
                name: "description",
                label: "\u041E\u043F\u0438\u0441\u0430\u043D\u0438\u0435",
                ui: { component: "textarea" }
              },
              {
                type: "object",
                name: "timeline",
                label: "\u0425\u0440\u043E\u043D\u043E\u043B\u043E\u0433\u0438\u044F",
                list: true,
                fields: [
                  { type: "string", name: "year", label: "\u041F\u0435\u0440\u0438\u043E\u0434" },
                  { type: "string", name: "title", label: "\u0417\u0430\u0433\u043E\u043B\u043E\u0432\u043E\u043A" },
                  {
                    type: "string",
                    name: "institution",
                    label: "\u0423\u0447\u0440\u0435\u0436\u0434\u0435\u043D\u0438\u0435",
                    ui: { component: "textarea" }
                  },
                  {
                    type: "string",
                    name: "courses",
                    label: "\u041A\u0443\u0440\u0441\u044B",
                    list: true
                  }
                ]
              }
            ]
          },
          {
            type: "object",
            name: "services",
            label: "\u0423\u0441\u043B\u0443\u0433\u0438",
            fields: [
              { type: "string", name: "label", label: "\u041F\u043E\u0434\u043F\u0438\u0441\u044C \u0441\u0435\u043A\u0446\u0438\u0438" },
              {
                type: "string",
                name: "description",
                label: "\u041E\u043F\u0438\u0441\u0430\u043D\u0438\u0435",
                ui: { component: "textarea" }
              },
              {
                type: "string",
                name: "highlight",
                label: "\u0412\u044B\u0434\u0435\u043B\u0435\u043D\u043D\u044B\u0439 \u0442\u0435\u043A\u0441\u0442",
                ui: { component: "textarea" }
              },
              { type: "string", name: "cardTitle", label: "\u0417\u0430\u0433\u043E\u043B\u043E\u0432\u043E\u043A \u043A\u0430\u0440\u0442\u043E\u0447\u043A\u0438" },
              {
                type: "string",
                name: "cardDescription",
                label: "\u041E\u043F\u0438\u0441\u0430\u043D\u0438\u0435 \u043A\u0430\u0440\u0442\u043E\u0447\u043A\u0438",
                ui: { component: "textarea" }
              },
              { type: "string", name: "buttonText", label: "\u0422\u0435\u043A\u0441\u0442 \u043A\u043D\u043E\u043F\u043A\u0438" },
              {
                type: "string",
                name: "items",
                label: "\u0421\u043F\u0438\u0441\u043E\u043A \u0443\u0441\u043B\u0443\u0433",
                list: true
              }
            ]
          },
          {
            type: "object",
            name: "contacts",
            label: "\u041A\u043E\u043D\u0442\u0430\u043A\u0442\u044B",
            fields: [
              { type: "string", name: "label", label: "\u041F\u043E\u0434\u043F\u0438\u0441\u044C \u0441\u0435\u043A\u0446\u0438\u0438" },
              {
                type: "string",
                name: "description",
                label: "\u041E\u043F\u0438\u0441\u0430\u043D\u0438\u0435",
                ui: { component: "textarea" }
              },
              { type: "string", name: "phoneLabel", label: "\u041F\u043E\u0434\u043F\u0438\u0441\u044C \u0442\u0435\u043B\u0435\u0444\u043E\u043D\u0430" },
              { type: "string", name: "phoneValue", label: "\u0422\u0435\u043B\u0435\u0444\u043E\u043D" },
              { type: "string", name: "hoursLabel", label: "\u041F\u043E\u0434\u043F\u0438\u0441\u044C \u0447\u0430\u0441\u043E\u0432" },
              { type: "string", name: "hoursValue", label: "\u0427\u0430\u0441\u044B \u0440\u0430\u0431\u043E\u0442\u044B" },
              { type: "string", name: "hoursSubValue", label: "\u041F\u043E\u0434\u0441\u0442\u0440\u043E\u043A\u0430 \u0447\u0430\u0441\u043E\u0432" }
            ]
          }
        ]
      }
    ]
  }
});
export {
  config_default as default
};
