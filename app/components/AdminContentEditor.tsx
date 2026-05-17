"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import type { HomeContent } from "@/app/types/content";

interface ContentEditorProps {
  initialContent: HomeContent;
  onSave: (content: HomeContent) => Promise<void>;
  onContentChange?: (content: HomeContent) => void;
  onDeploy?: () => Promise<void>;
  isDeploying?: boolean;
  isDeployConfigured?: boolean;
  deployMessage?: { type: "success" | "error"; text: string } | null;
}

export default function ContentEditor({
  initialContent,
  onSave,
  onContentChange,
  onDeploy,
  isDeploying = false,
  isDeployConfigured = false,
  deployMessage = null,
}: ContentEditorProps) {
  const [content, setContent] = useState<HomeContent>(initialContent);
  const [isSaving, setIsSaving] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [activeTab, setActiveTab] = useState<"hero" | "about" | "services" | "contacts">("hero");
  const [isDeployDialogOpen, setIsDeployDialogOpen] = useState(false);

  const handleSave = async () => {
    setIsSaving(true);
    setMessage(null);

    try {
      await onSave(content);
      setMessage({ type: "success", text: "Контент успешно сохранен" });
    } catch (error) {
      setMessage({
        type: "error",
        text: error instanceof Error ? error.message : "Ошибка при сохранении",
      });
    } finally {
      setIsSaving(false);
    }
  };

  useEffect(() => {
    onContentChange?.(content);
  }, [content, onContentChange]);

  return (
    <div className="space-y-6">
      {/* Tabs */}
      <div className="overflow-x-auto border-b border-[rgba(108,123,107,0.2)]">
        <div className="flex min-w-max gap-2 sm:min-w-0">
          {(["hero", "about", "services", "contacts"] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`shrink-0 whitespace-nowrap border-b-2 -mb-px px-3 py-2 text-xs font-semibold uppercase tracking-[0.12em] transition-colors cursor-pointer sm:px-4 sm:text-sm sm:tracking-[0.14em] ${
                activeTab === tab
                  ? "border-[#4a5b49] text-[#2c302e]"
                  : "border-transparent text-[#4f5f4e]/70 hover:text-[#2c302e]"
              }`}
              style={{ fontFamily: "var(--font-montserrat), sans-serif" }}
            >
              {tab === "hero" && "1. Первый экран"}
              {tab === "about" && "2. Обо мне"}
              {tab === "services" && "3. Услуги"}
              {tab === "contacts" && "4. Контакты"}
            </button>
          ))}
        </div>
      </div>

      {/* Hero Section */}
      {activeTab === "hero" && (
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Заголовок</label>
            <input
              type="text"
              value={content.hero.title}
              onChange={(e) =>
                setContent({
                  ...content,
                  hero: { ...content.hero, title: e.target.value },
                })
              }
              className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-black focus:border-blue-500 focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Описание</label>
            <textarea
              value={content.hero.description}
              onChange={(e) =>
                setContent({
                  ...content,
                  hero: { ...content.hero, description: e.target.value },
                })
              }
              rows={5}
              className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-black focus:border-blue-500 focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Текст кнопки 1</label>
            <input
              type="text"
              value={content.hero.primaryButtonText}
              onChange={(e) =>
                setContent({
                  ...content,
                  hero: { ...content.hero, primaryButtonText: e.target.value },
                })
              }
              className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-black focus:border-blue-500 focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Текст кнопки 2</label>
            <input
              type="text"
              value={content.hero.secondaryButtonText}
              onChange={(e) =>
                setContent({
                  ...content,
                  hero: { ...content.hero, secondaryButtonText: e.target.value },
                })
              }
              className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-black focus:border-blue-500 focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Фотография на первом экране</label>
            {content.hero.photoUrl && (
              <div className="mt-3 mb-5 rounded-[24px] border border-[rgba(108,123,107,0.18)] bg-[rgba(249,248,245,0.6)] p-3">
                <div className="relative h-44 w-32 overflow-hidden rounded-[18px]">
                  <Image
                    src={content.hero.photoUrl}
                    alt="Preview"
                    fill
                    sizes="128px"
                    className="object-cover"
                  />
                </div>
              </div>
            )}
            <input
              type="file"
              accept="image/jpeg,image/png,image/webp,image/svg+xml"
              onChange={async (e) => {
                const file = e.target.files?.[0];
                if (!file) return;

                setIsUploading(true);
                setMessage(null);

                try {
                  const formData = new FormData();
                  formData.append("file", file);

                  const response = await fetch("/api/upload", {
                    method: "POST",
                    body: formData,
                    credentials: "include",
                  });

                  if (!response.ok) {
                    const data = await response.json();
                    throw new Error(data.error || "Failed to upload image");
                  }

                  const data = await response.json();
                  setContent({
                    ...content,
                    hero: { ...content.hero, photoUrl: data.url },
                  });
                  setMessage({ type: "success", text: "Фото успешно загружено" });
                } catch (err) {
                  setMessage({
                    type: "error",
                    text: err instanceof Error ? err.message : "Ошибка при загрузке фото",
                  });
                } finally {
                  setIsUploading(false);
                }
              }}
              disabled={isUploading}
              className="mt-2 w-full cursor-pointer rounded-full border border-[rgba(108,123,107,0.3)] bg-white/80 px-4 py-2 text-sm text-[#2c302e] shadow-[0px_6px_18px_-12px_rgba(44,48,46,0.45)] file:mr-4 file:rounded-full file:border-0 file:bg-[#4a5b49] file:px-5 file:py-2 file:text-white hover:file:bg-[#3f4f3f] disabled:opacity-50"
            />
            <p className="mt-2 text-xs text-[#4f5f4e]/70">JPG, PNG, WebP или SVG. Максимум 5MB</p>
          </div>
        </div>
      )}

      {/* About Section */}
      {activeTab === "about" && (
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Подпись секции</label>
            <input
              type="text"
              value={content.about.label}
              onChange={(e) =>
                setContent({
                  ...content,
                  about: { ...content.about, label: e.target.value },
                })
              }
              className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-black focus:border-blue-500 focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Заголовок</label>
            <input
              type="text"
              value={content.about.heading}
              onChange={(e) =>
                setContent({
                  ...content,
                  about: { ...content.about, heading: e.target.value },
                })
              }
              className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-black focus:border-blue-500 focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Короткий текст</label>
            <textarea
              value={content.about.intro}
              onChange={(e) =>
                setContent({
                  ...content,
                  about: { ...content.about, intro: e.target.value },
                })
              }
              rows={3}
              className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-black focus:border-blue-500 focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Описание</label>
            <textarea
              value={content.about.description}
              onChange={(e) =>
                setContent({
                  ...content,
                  about: { ...content.about, description: e.target.value },
                })
              }
              rows={5}
              className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-black focus:border-blue-500 focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Фотография</label>
            {content.about.photoUrl && (
              <div className="mt-3 mb-5 rounded-[24px] border border-[rgba(108,123,107,0.18)] bg-[rgba(249,248,245,0.6)] p-3">
                <div className="relative h-44 w-32 overflow-hidden rounded-[18px]">
                  <Image
                    src={content.about.photoUrl}
                    alt="Preview"
                    fill
                    sizes="128px"
                    className="object-cover"
                  />
                </div>
              </div>
            )}
            <input
              type="file"
              accept="image/jpeg,image/png,image/webp,image/svg+xml"
              onChange={async (e) => {
                const file = e.target.files?.[0];
                if (!file) return;

                setIsUploading(true);
                setMessage(null);

                try {
                  const formData = new FormData();
                  formData.append("file", file);

                  const response = await fetch("/api/upload", {
                    method: "POST",
                    body: formData,
                    credentials: "include",
                  });

                  if (!response.ok) {
                    const data = await response.json();
                    throw new Error(data.error || "Failed to upload image");
                  }

                  const data = await response.json();
                  setContent({
                    ...content,
                    about: { ...content.about, photoUrl: data.url },
                  });
                  setMessage({ type: "success", text: "Фото успешно загружено" });
                } catch (err) {
                  setMessage({
                    type: "error",
                    text: err instanceof Error ? err.message : "Ошибка при загрузке фото",
                  });
                } finally {
                  setIsUploading(false);
                }
              }}
              disabled={isUploading}
              className="mt-2 w-full cursor-pointer rounded-full border border-[rgba(108,123,107,0.3)] bg-white/80 px-4 py-2 text-sm text-[#2c302e] shadow-[0px_6px_18px_-12px_rgba(44,48,46,0.45)] file:mr-4 file:rounded-full file:border-0 file:bg-[#4a5b49] file:px-5 file:py-2 file:text-white hover:file:bg-[#3f4f3f] disabled:opacity-50"
            />
            <p className="mt-2 text-xs text-[#4f5f4e]/70">JPG, PNG, WebP или SVG. Максимум 5MB</p>
          </div>
        </div>
      )}

      {/* Services Section */}
      {activeTab === "services" && (
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Подпись секции</label>
            <input
              type="text"
              value={content.services.label}
              onChange={(e) =>
                setContent({
                  ...content,
                  services: { ...content.services, label: e.target.value },
                })
              }
              className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-black focus:border-blue-500 focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Описание</label>
            <textarea
              value={content.services.description}
              onChange={(e) =>
                setContent({
                  ...content,
                  services: { ...content.services, description: e.target.value },
                })
              }
              rows={3}
              className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-black focus:border-blue-500 focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Выделенный текст</label>
            <textarea
              value={content.services.highlight}
              onChange={(e) =>
                setContent({
                  ...content,
                  services: { ...content.services, highlight: e.target.value },
                })
              }
              rows={3}
              className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-black focus:border-blue-500 focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Заголовок карточки</label>
            <input
              type="text"
              value={content.services.cardTitle}
              onChange={(e) =>
                setContent({
                  ...content,
                  services: { ...content.services, cardTitle: e.target.value },
                })
              }
              className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-black focus:border-blue-500 focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Описание карточки</label>
            <textarea
              value={content.services.cardDescription}
              onChange={(e) =>
                setContent({
                  ...content,
                  services: { ...content.services, cardDescription: e.target.value },
                })
              }
              rows={3}
              className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-black focus:border-blue-500 focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Текст кнопки</label>
            <input
              type="text"
              value={content.services.buttonText}
              onChange={(e) =>
                setContent({
                  ...content,
                  services: { ...content.services, buttonText: e.target.value },
                })
              }
              className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-black focus:border-blue-500 focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Список услуг (по одной на строку)</label>
            <textarea
              value={content.services.items.join("\n")}
              onChange={(e) =>
                setContent({
                  ...content,
                  services: {
                    ...content.services,
                    items: e.target.value.split("\n").filter((item) => item.trim()),
                  },
                })
              }
              rows={5}
              className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-black focus:border-blue-500 focus:outline-none"
            />
          </div>
        </div>
      )}

      {/* Contacts Section */}
      {activeTab === "contacts" && (
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Подпись секции</label>
            <input
              type="text"
              value={content.contacts.label}
              onChange={(e) =>
                setContent({
                  ...content,
                  contacts: { ...content.contacts, label: e.target.value },
                })
              }
              className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-black focus:border-blue-500 focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Описание</label>
            <textarea
              value={content.contacts.description}
              onChange={(e) =>
                setContent({
                  ...content,
                  contacts: { ...content.contacts, description: e.target.value },
                })
              }
              rows={4}
              className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-black focus:border-blue-500 focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Подпись телефона</label>
            <input
              type="text"
              value={content.contacts.phoneLabel}
              onChange={(e) =>
                setContent({
                  ...content,
                  contacts: { ...content.contacts, phoneLabel: e.target.value },
                })
              }
              className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-black focus:border-blue-500 focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Номер телефона</label>
            <input
              type="text"
              value={content.contacts.phoneValue}
              onChange={(e) =>
                setContent({
                  ...content,
                  contacts: { ...content.contacts, phoneValue: e.target.value },
                })
              }
              className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-black focus:border-blue-500 focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Подпись часов</label>
            <input
              type="text"
              value={content.contacts.hoursLabel}
              onChange={(e) =>
                setContent({
                  ...content,
                  contacts: { ...content.contacts, hoursLabel: e.target.value },
                })
              }
              className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-black focus:border-blue-500 focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Часы работы</label>
            <input
              type="text"
              value={content.contacts.hoursValue}
              onChange={(e) =>
                setContent({
                  ...content,
                  contacts: { ...content.contacts, hoursValue: e.target.value },
                })
              }
              className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-black focus:border-blue-500 focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Подстрока часов</label>
            <input
              type="text"
              value={content.contacts.hoursSubValue}
              onChange={(e) =>
                setContent({
                  ...content,
                  contacts: { ...content.contacts, hoursSubValue: e.target.value },
                })
              }
              className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-black focus:border-blue-500 focus:outline-none"
            />
          </div>

        </div>
      )}

      {/* Save Button & Message */}
      <div className="flex flex-col gap-4 pt-6 border-t border-[rgba(108,123,107,0.2)] sm:flex-row sm:items-center">
        <div className="flex-1 space-y-3">
          {message && (
            <div
              className={`rounded-2xl border px-4 py-3 text-sm font-medium ${
                message.type === "success"
                  ? "border-[#9fb19c] bg-[#eef3ee] text-[#2f3e2f]"
                  : "border-[#b89d87] bg-[#f5ece5] text-[#7d4d35]"
              }`}
              style={{ fontFamily: "var(--font-montserrat), sans-serif" }}
            >
              {message.text}
            </div>
          )}

          {deployMessage && activeTab === "contacts" && (
            <div
              className={`rounded-2xl border px-4 py-3 text-sm ${
                deployMessage.type === "success"
                  ? "border-[#9fb19c] bg-[#eef3ee] text-[#2f3e2f]"
                  : "border-[#b89d87] bg-[#f5ece5] text-[#7d4d35]"
              }`}
              style={{ fontFamily: "var(--font-montserrat), sans-serif" }}
            >
              {deployMessage.text}
            </div>
          )}
        </div>

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          {activeTab === "contacts" && (
            <button
              type="button"
              onClick={() => setIsDeployDialogOpen(true)}
              disabled={isDeploying || !isDeployConfigured}
              className="inline-flex items-center justify-center rounded-full bg-[#c7b39f] px-6 py-2 text-sm font-semibold text-[#2c302e] transition hover:bg-[#baa18a] disabled:bg-[#d8d1c8] disabled:text-[#6f6a63] cursor-pointer"
              style={{ fontFamily: "var(--font-montserrat), sans-serif" }}
            >
              {isDeploying ? "Сборка и отправка..." : "Подтвердить"}
            </button>
          )}

          <button
            onClick={handleSave}
            disabled={isSaving}
            className="inline-flex items-center justify-center rounded-full bg-[#4a5b49] px-6 py-2 text-sm font-semibold text-white transition hover:bg-[#3f4f3f] disabled:bg-[#9aa49a] cursor-pointer"
            style={{ fontFamily: "var(--font-montserrat), sans-serif" }}
          >
            {isSaving ? "Сохранение..." : "Сохранить"}
          </button>
        </div>
      </div>

      {isDeployDialogOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[rgba(28,30,29,0.42)] px-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-[32px] border border-[rgba(108,123,107,0.18)] bg-[linear-gradient(180deg,rgba(249,248,245,0.98)_0%,rgba(255,255,255,0.96)_100%)] p-6 shadow-[0px_30px_80px_-30px_rgba(44,48,46,0.45)]">
            <p
              className="text-xs font-semibold uppercase tracking-[0.16em] text-[#6c7b6b]"
              style={{ fontFamily: "var(--font-montserrat), sans-serif" }}
            >
              Подтверждение
            </p>
            <h3
              className="mt-3 text-3xl font-medium text-[#2c302e]"
              style={{ fontFamily: "var(--font-cormorant), Georgia, serif", lineHeight: "1.05" }}
            >
              Запустить статическую сборку и деплой?
            </h3>
            <p
              className="mt-3 text-sm text-[#4f5f4e]/85"
              style={{ fontFamily: "var(--font-montserrat), sans-serif", lineHeight: "1.7" }}
            >
              Будет запущен новый deploy проекта на Vercel.
            </p>

            <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-end">
              <button
                type="button"
                onClick={() => setIsDeployDialogOpen(false)}
                className="inline-flex items-center justify-center rounded-full border border-[rgba(108,123,107,0.25)] bg-white/75 px-5 py-3 text-sm font-medium text-[#2c302e] transition hover:bg-[rgba(108,123,107,0.08)]"
                style={{ fontFamily: "var(--font-montserrat), sans-serif" }}
              >
                Отмена
              </button>
              <button
                type="button"
                onClick={async () => {
                  setIsDeployDialogOpen(false);
                  await onDeploy?.();
                }}
                className="inline-flex items-center justify-center rounded-full bg-[#4a5b49] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#3f4f3f]"
                style={{ fontFamily: "var(--font-montserrat), sans-serif" }}
              >
                Подтвердить
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
