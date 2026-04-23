import Link from "next/link";

export default function NotFound() {
  return (
    <main className="flex flex-col w-full flex-1">
      <section className="w-full min-h-screen flex items-center justify-center relative overflow-hidden px-4 sm:px-6 lg:px-8">
        {/* Gradient overlay background */}
        <div className="absolute inset-0">
          <div className="absolute bg-gradient-to-b from-[rgba(249,248,245,0.4)] inset-0 to-[#f9f8f5] via-1/2 via-[rgba(249,248,245,0.6)]" />
        </div>

        {/* Content */}
        <div className="relative z-10 max-w-2xl mx-auto w-full text-center">
          {/* 404 Number */}
          <div
            className="text-8xl sm:text-9xl font-light mb-6 text-[#2c302e]"
            style={{
              fontFamily: "var(--font-cormorant), Georgia, serif",
              letterSpacing: "-0.04em",
            }}
          >
            404
          </div>

          {/* Main heading */}
          <h1
            className="text-3xl sm:text-4xl lg:text-5xl font-light mb-4 text-[#2c302e]"
            style={{
              fontFamily: "var(--font-cormorant), Georgia, serif",
              lineHeight: "1.2",
              letterSpacing: "-0.02em",
            }}
          >
            Страница не найдена
          </h1>

          {/* Description */}
          <p
            className="text-base sm:text-lg md:text-xl font-light px-4 mb-8 text-[#4a5b49]"
            style={{
              fontFamily: "var(--font-cormorant), Georgia, serif",
              lineHeight: "1.75",
            }}
          >
            К сожалению, страница, которую вы ищете, не существует. Может быть, ссылка потеряла актуальность или была введена неправильно.
          </p>

          {/* Back to home button */}
          <Link
            href="/"
            className="inline-flex bg-[#4a5b49] hover:bg-[#3f4f3f] transition-all duration-300 ease-out transform hover:translate-y-[-2px] border border-[#e5e2dc] h-[48px] items-center justify-center px-[32px] rounded-full shadow-[0px_10px_15px_-3px_rgba(74,91,73,0.22),0px_4px_6px_-4px_rgba(74,91,73,0.22)] hover:shadow-[0px_14px_20px_-3px_rgba(74,91,73,0.32),0px_6px_8px_-4px_rgba(74,91,73,0.24)]"
            style={{
              fontFamily: "var(--font-montserrat), sans-serif",
              fontWeight: 500,
              color: "#f9f8f5",
            }}
          >
            На главную
          </Link>

          {/* Decorative elements */}
          <div
            className="hidden md:block absolute -bottom-16 -left-12 w-48 h-48 rounded-full blur-3xl opacity-30"
            style={{ backgroundColor: "#e2dacf" }}
          />
          <div
            className="hidden md:block absolute -top-16 -right-12 w-48 h-48 rounded-full blur-3xl opacity-20"
            style={{ backgroundColor: "#d4c4b0" }}
          />
        </div>
      </section>
    </main>
  );
}
