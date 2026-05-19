"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import AdminContentEditor from "@/app/components/AdminContentEditor";
import type { HomeContent } from "@/app/types/content";

export default function AdminDashboardPage() {
  const router = useRouter();
  const [content, setContent] = useState<HomeContent | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isDeployConfigured, setIsDeployConfigured] = useState(false);
  const [isDeploying, setIsDeploying] = useState(false);
  const [deployMessage, setDeployMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  useEffect(() => {
    const loadContent = async () => {
      try {
        const sessionResponse = await fetch("/api/admin/session", {
          credentials: "include",
        });

        if (!sessionResponse.ok) {
          router.push("/admin");
          return;
        }

        const [contentResponse, deployInfoResponse] = await Promise.all([
          fetch("/api/content", {
            credentials: "include",
          }),
          fetch("/api/admin/deploy-info", {
            credentials: "include",
          }),
        ]);

        if (!contentResponse.ok) {
          setError("Failed to load content");
          return;
        }

        const data = await contentResponse.json();
        setContent(data);

        if (deployInfoResponse.ok) {
          const deployInfo = await deployInfoResponse.json();
          setIsDeployConfigured(Boolean(deployInfo.isConfigured));
        }
      } catch (err) {
        console.error("Error loading content:", err);
        setError("Failed to load content");
      } finally {
        setIsLoading(false);
      }
    };

    loadContent();
  }, [router]);

  const handleSaveContent = async (updatedContent: HomeContent) => {
    try {
      const response = await fetch("/api/admin/content", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedContent),
        credentials: "include",
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to save content");
      }

      setContent(updatedContent);
    } catch (err) {
      throw err;
    }
  };

  const handleStaticBuildAndDeploy = async () => {
    setIsDeploying(true);
    setDeployMessage(null);

    try {
      const response = await fetch("/api/admin/deploy", {
        method: "POST",
        credentials: "include",
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Не удалось выполнить сборку и деплой");
      }

      setDeployMessage({
        type: "success",
        text: data.message || "Статический HTML собран и отправлен на сервер",
      });
    } catch (err) {
      setDeployMessage({
        type: "error",
        text: err instanceof Error ? err.message : "Ошибка при сборке и деплое",
      });
    } finally {
      setIsDeploying(false);
    }
  };

  const handleLogout = async () => {
    try {
      await fetch("/api/admin/logout", {
        method: "POST",
        credentials: "include",
      });
      router.push("/admin");
    } catch (err) {
      console.error("Logout error:", err);
    }
  };

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[linear-gradient(180deg,#f7f3ea_0%,#f9f8f5_42%,#eef1ea_100%)]">
        <div className="text-center">
          <div className="mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-b-2 border-[#4a5b49]"></div>
          <p className="text-[#4f5f4e]" style={{ fontFamily: "var(--font-montserrat), sans-serif" }}>
            Загрузка...
          </p>
        </div>
      </div>
    );
  }

  return (
    <main className="relative min-h-screen overflow-x-clip bg-[linear-gradient(180deg,#f7f3ea_0%,#f9f8f5_46%,#edf1ea_100%)]">
      {/* Header */}
      <header className="relative border-b border-[rgba(108,123,107,0.18)] bg-[rgba(255,255,255,0.82)] backdrop-blur-xl">
        <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div className="min-w-0">
              <h1
                className="text-2xl font-medium text-[#2c302e] sm:text-3xl"
                style={{ fontFamily: "var(--font-cormorant), Georgia, serif", lineHeight: "1.1" }}
              >
                Администратор CMS
              </h1>
              <p
                className="mt-1 text-sm text-[#4f5f4e]/80 sm:text-base"
                style={{ fontFamily: "var(--font-montserrat), sans-serif", lineHeight: "1.6" }}
              >
                Управление содержимым сайта психотерапевта
              </p>
            </div>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 md:flex md:shrink-0 md:flex-wrap md:justify-end">
              <Link
                href="https://anna-pochebyt.by/"
                target="_blank"
                className="inline-flex min-h-11 items-center justify-center rounded-lg border border-[rgba(108,123,107,0.25)] bg-white/75 px-5 py-2 text-sm font-medium text-[#2c302e] transition hover:border-[rgba(108,123,107,0.45)] hover:bg-[rgba(108,123,107,0.08)] cursor-pointer"
                style={{ fontFamily: "var(--font-montserrat), sans-serif" }}
              >
                Посмотреть сайт
              </Link>
              <button
                onClick={handleLogout}
                className="inline-flex min-h-11 items-center justify-center rounded-lg bg-[#4a5b49] px-5 py-2 text-sm font-medium text-white transition hover:bg-[#3f4f3f] cursor-pointer"
                style={{ fontFamily: "var(--font-montserrat), sans-serif" }}
              >
                Выход
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="relative mx-auto max-w-7xl px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
        {error && (
          <div className="mb-6 rounded-lg border border-[#b89d87] bg-[#f5ece5] px-4 py-3 text-sm text-[#7d4d35]" style={{ fontFamily: "var(--font-montserrat), sans-serif" }}>
            {error}
          </div>
        )}

        <div className="rounded-xl border border-[rgba(108,123,107,0.18)] bg-[rgba(255,255,255,0.84)] p-4 shadow-[0px_24px_70px_-36px_rgba(44,48,46,0.5)] backdrop-blur-xl sm:p-6 lg:p-8">
          <h2
            className="mb-5 text-2xl font-medium text-[#2c302e]"
            style={{ fontFamily: "var(--font-cormorant), Georgia, serif", lineHeight: "1.1" }}
          >
            Редактор содержимого
          </h2>
          {content && (
            <AdminContentEditor
              initialContent={content}
              onSave={handleSaveContent}
              onDeploy={handleStaticBuildAndDeploy}
              isDeployConfigured={isDeployConfigured}
              isDeploying={isDeploying}
              deployMessage={deployMessage}
            />
          )}
        </div>
      </div>
    </main>
  );
}
