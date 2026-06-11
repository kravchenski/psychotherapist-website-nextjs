"use client";

import { privacySections } from "../legalContent";

type PrivacyPolicyProps = {
  open: boolean;
  onClose: () => void;
};

export default function PrivacyPolicy({ open, onClose }: PrivacyPolicyProps) {
  if (!open) {
    return null;
  }

  return (
    <div
      className="fixed inset-0 z-[100] flex items-stretch justify-center bg-[rgba(19,23,21,0.62)] px-3 py-3 sm:px-5 sm:py-5 backdrop-blur-[2px]"
      role="dialog"
      aria-modal="true"
      aria-labelledby="privacy-policy-title"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) {
          onClose();
        }
      }}
    >
      <div className="relative flex h-full w-full max-w-7xl flex-col overflow-hidden rounded-[32px] border border-[rgba(108,123,107,0.18)] bg-[linear-gradient(180deg,#f7f2e9_0%,#fbfaf6_100%)] shadow-[0_30px_120px_rgba(0,0,0,0.35)]">
        <div className="flex items-start justify-between gap-4 border-b border-[rgba(44,48,46,0.08)] px-4 py-4 sm:px-6 lg:px-8">
          <div>
            <p
              className="text-[10px] font-semibold uppercase tracking-[0.28em] sm:text-xs"
              style={{ color: "#6c7b6b", fontFamily: "var(--font-montserrat), sans-serif" }}
            >
              Правовые документы
            </p>
            <h2
              id="privacy-policy-title"
              className="mt-2 text-2xl font-medium sm:text-3xl lg:text-4xl"
              style={{
                color: "#2c302e",
                fontFamily: "var(--font-cormorant), Georgia, serif",
                lineHeight: 1,
              }}
            >
              Политика конфиденциальности и защиты информации
            </h2>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-[rgba(44,48,46,0.12)] bg-white text-[#2c302e] transition-transform duration-200 hover:scale-105 cursor-pointer"
            aria-label="Закрыть политику конфиденциальности"
          >
            <span aria-hidden="true" className="text-2xl leading-none">×</span>
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-4 py-5 sm:px-6 sm:py-6 lg:px-8 lg:py-8">
          <div className="grid gap-6 lg:grid-cols-[minmax(0,1.6fr)_minmax(280px,0.9fr)] lg:gap-8">
            <div className="space-y-4 sm:space-y-5">
              {privacySections.map((section) => (
                <article
                  key={section.title}
                  className="rounded-[24px] border border-[rgba(44,48,46,0.08)] bg-white p-5 shadow-[0_10px_30px_rgba(44,48,46,0.05)] sm:p-7"
                >
                  <h3
                    className="text-2xl font-medium sm:text-3xl"
                    style={{
                      color: "#2c302e",
                      fontFamily: "var(--font-cormorant), Georgia, serif",
                      lineHeight: 1.05,
                    }}
                  >
                    {section.title}
                  </h3>

                  <div className="mt-5 space-y-3">
                    {section.paragraphs.map((paragraph) => (
                      <p
                        key={paragraph}
                        className="rounded-2xl border border-[rgba(108,123,107,0.08)] bg-[rgba(247,242,233,0.65)] px-4 py-4 text-sm leading-7 sm:text-[15px]"
                        style={{ color: "rgba(44, 48, 46, 0.84)", fontFamily: "var(--font-montserrat), sans-serif" }}
                      >
                        {paragraph}
                      </p>
                    ))}
                  </div>
                </article>
              ))}
            </div>

            <aside className="h-fit rounded-[28px] border border-[rgba(108,123,107,0.14)] bg-[linear-gradient(180deg,#ffffff_0%,#f8f4ec_100%)] p-6 shadow-[0_16px_50px_rgba(44,48,46,0.07)] sm:p-8 lg:sticky lg:top-0">
              <p
                className="text-xs font-semibold uppercase tracking-[0.24em]"
                style={{ color: "#6c7b6b", fontFamily: "var(--font-montserrat), sans-serif" }}
              >
                Оператор
              </p>
              <h4
                className="mt-4 text-3xl font-medium"
                style={{
                  color: "#2c302e",
                  fontFamily: "var(--font-cormorant), Georgia, serif",
                  lineHeight: 1.05,
                }}
              >
                ИП Почебыт Анна Владимировна
              </h4>
              <div
                className="mt-5 space-y-4 text-sm leading-7"
                style={{ color: "rgba(44, 48, 46, 0.78)", fontFamily: "var(--font-montserrat), sans-serif" }}
              >
                <p>УНП 592012888, свидетельство о государственной регистрации от 02.09.2024.</p>
                <p>По вопросам обработки персональных данных: Hengi.gro@rambler.ru.</p>
              </div>
            </aside>
          </div>
        </div>
      </div>
    </div>
  );
}
