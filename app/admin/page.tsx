"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { SubmitEventHandler } from "react";

export default function AdminLoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit: SubmitEventHandler<HTMLFormElement> = async (event) => {
    event.preventDefault();
    setIsSubmitting(true);
    setErrorMessage(null);

    try {
      const response = await fetch("/api/admin/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      });

      if (!response.ok) {
        const payload = (await response.json().catch(() => null)) as { error?: string } | null;
        throw new Error(payload?.error || "Не удалось войти");
      }

      router.replace("/admin/index.html");
      router.refresh();
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : "Не удалось войти");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[linear-gradient(180deg,#f7f3ea_0%,#f9f8f5_42%,#eef1ea_100%)] px-4 py-10 sm:px-6 lg:px-8">
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -left-24 -top-24 h-72 w-72 rounded-full bg-[#dce5db] blur-3xl opacity-70" />
        <div className="absolute bottom-0 right-0 h-96 w-96 rounded-full bg-[#e8ddd1] blur-3xl opacity-60" />
      </div>

      <section className="relative grid w-full max-w-5xl gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
        <div className="space-y-6 text-center lg:text-left">
          <h1
            className="text-4xl font-medium text-[#2c302e] sm:text-5xl lg:text-[64px]"
            style={{ fontFamily: "var(--font-cormorant), Georgia, serif", lineHeight: "1.05", letterSpacing: "-0.03em" }}
          >
            Вход для администратора
          </h1>
        </div>

        <div className="relative">
          <div className="absolute inset-0 translate-y-6 rounded-[34px] bg-[#d9e1d8] blur-2xl opacity-70" />
          <form
            onSubmit={handleSubmit}
            className="relative overflow-hidden rounded-[32px] border border-[rgba(108,123,107,0.18)] bg-[rgba(255,255,255,0.72)] p-6 shadow-[0px_30px_80px_-30px_rgba(44,48,46,0.4)] backdrop-blur-xl sm:p-8"
          >
            <div className="mb-6">
              <h2
                className="text-2xl font-medium text-[#2c302e] sm:text-3xl"
                style={{ fontFamily: "var(--font-cormorant), Georgia, serif", lineHeight: "1.1" }}
              >
                Авторизация
              </h2>
              <p className="mt-2 text-sm text-[#2c302e]/68 sm:text-base" style={{ fontFamily: "var(--font-montserrat), sans-serif", lineHeight: "1.7", fontWeight: 300 }}>
                Введите данные администратора
              </p>
            </div>

            <div className="space-y-4">
              <label className="block">
                <span className="mb-2 block text-xs font-semibold uppercase tracking-[0.18em] text-[#4f5f4e]">Логин</span>
                <input
                  value={username}
                  onChange={(event) => setUsername(event.target.value)}
                  autoComplete="username"
                  className="w-full rounded-2xl border border-[rgba(108,123,107,0.22)] bg-white/80 px-4 py-3 text-[#2c302e] outline-none transition focus:border-[#4f5f4e] focus:ring-4 focus:ring-[rgba(79,95,78,0.12)]"
                  placeholder="Логин"
                  required
                  style={{ fontFamily: "var(--font-montserrat), sans-serif" }}
                />
              </label>

              <label className="block">
                <span className="mb-2 block text-xs font-semibold uppercase tracking-[0.18em] text-[#4f5f4e]">Пароль</span>
                <input
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  type="password"
                  autoComplete="current-password"
                  className="w-full rounded-2xl border border-[rgba(108,123,107,0.22)] bg-white/80 px-4 py-3 text-[#2c302e] outline-none transition focus:border-[#4f5f4e] focus:ring-4 focus:ring-[rgba(79,95,78,0.12)]"
                  placeholder="Пароль"
                  required
                  style={{ fontFamily: "var(--font-montserrat), sans-serif" }}
                />
              </label>
            </div>

            {errorMessage ? (
              <div className="mt-4 rounded-2xl border border-[#b89d87] bg-[#f5ece5] px-4 py-3 text-sm text-[#7d4d35]" style={{ fontFamily: "var(--font-montserrat), sans-serif" }}>
                {errorMessage}
              </div>
            ) : null}

            <button
              type="submit"
              disabled={isSubmitting}
              className="mt-6 inline-flex h-12 w-full items-center justify-center rounded-full bg-[#4a5b49] px-5 text-sm font-semibold text-white transition hover:bg-[#3f4f3f] disabled:cursor-not-allowed disabled:opacity-70"
              style={{ fontFamily: "var(--font-montserrat), sans-serif" }}
            >
              {isSubmitting ? "Проверка..." : "Войти в Панель управления"}
            </button>
          </form>
        </div>
      </section>
    </main>
  );
}