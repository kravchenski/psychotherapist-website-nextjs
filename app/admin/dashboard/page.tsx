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

  useEffect(() => {
    // Check authentication and load content
    const loadContent = async () => {
      try {
        const sessionResponse = await fetch("/api/admin/session", {
          credentials: "include",
        });

        if (!sessionResponse.ok) {
          router.push("/admin");
          return;
        }

        const contentResponse = await fetch("/api/content", {
          credentials: "include",
        });

        if (!contentResponse.ok) {
          setError("Failed to load content");
          return;
        }

        const data = await contentResponse.json();
        setContent(data);
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
      const response = await fetch("/api/content", {
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
    <main className="relative min-h-screen overflow-hidden bg-[linear-gradient(180deg,#f7f3ea_0%,#f9f8f5_42%,#eef1ea_100%)]">
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -left-24 -top-24 h-72 w-72 rounded-full bg-[#dce5db] blur-3xl opacity-70" />
        <div className="absolute bottom-0 right-0 h-96 w-96 rounded-full bg-[#e8ddd1] blur-3xl opacity-60" />
      </div>

      {/* Header */}
      <header className="relative border-b border-[rgba(108,123,107,0.18)] bg-[rgba(255,255,255,0.72)] backdrop-blur-xl">
        <div className="mx-auto max-w-7xl px-4 py-5 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
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
            <div className="flex flex-wrap gap-3">
              <Link
                href="/"
                target="_blank"
                className="inline-flex items-center justify-center rounded-full border border-[rgba(108,123,107,0.25)] bg-white/70 px-5 py-2 text-sm font-medium text-[#2c302e] transition hover:border-[rgba(108,123,107,0.45)] hover:bg-[rgba(108,123,107,0.08)] cursor-pointer"
                style={{ fontFamily: "var(--font-montserrat), sans-serif" }}
              >
                Посмотреть сайт
              </Link>
              <button
                onClick={handleLogout}
                className="inline-flex items-center justify-center rounded-full bg-[#4a5b49] px-5 py-2 text-sm font-medium text-white transition hover:bg-[#3f4f3f] cursor-pointer"
                style={{ fontFamily: "var(--font-montserrat), sans-serif" }}
              >
                Выход
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="relative mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        {error && (
          <div className="mb-6 rounded-2xl border border-[#b89d87] bg-[#f5ece5] px-4 py-3 text-sm text-[#7d4d35]" style={{ fontFamily: "var(--font-montserrat), sans-serif" }}>
            {error}
          </div>
        )}

        <div className="rounded-[32px] border border-[rgba(108,123,107,0.18)] bg-[rgba(255,255,255,0.72)] p-6 shadow-[0px_30px_80px_-30px_rgba(44,48,46,0.4)] backdrop-blur-xl sm:p-8">
          <h2
            className="mb-6 text-2xl font-medium text-[#2c302e]"
            style={{ fontFamily: "var(--font-cormorant), Georgia, serif", lineHeight: "1.1" }}
          >
            Редактор содержимого
          </h2>
          {content && <AdminContentEditor initialContent={content} onSave={handleSaveContent} />}
        </div>
      </div>
    </main>
  );
}
