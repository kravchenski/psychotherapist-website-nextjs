"use client";

export default function Footer() {
  const NAV_LINKS = [
    { label: "Обо мне", href: "#about" },
    { label: "Услуги", href: "#services" },
    { label: "Контакты", href: "#contact" },
  ];

  const INFO_LINKS = [
    { label: "Об оплате", href: "#" },
    { label: "Политика конфиденциальности", href: "#" },
    { label: "Договор публичной оферты", href: "#" },
  ];

  const REQUISITES = [
    "ИП Почебыт Анна",
    "УНП 592012888",
    "р/с BY50 ALFA 3013 2E77 2000 1027 0000",
    "ЦБУ № 6 АО «Альфа-Банк»",
  ];

  return (
    <footer className="w-full bg-[#2c302e] border-t border-[rgba(255,255,255,0.1)] pt-16 pb-16 px-4 sm:px-6 md:px-10 lg:px-16 xl:px-[60px]">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-12">
          
          {/* Column 1: Logo & Description */}
          <div className="flex flex-col gap-6">
            <div
              className="text-2xl lg:text-[30px] font-medium"
              style={{
                color: "#ffffff",
                fontFamily: "var(--font-cormorant), Georgia, serif",
                lineHeight: "36px",
                letterSpacing: "-0.01em",
              }}
            >
              Анна Почебыт
            </div>

            <div
              className="text-sm font-light"
              style={{
                color: "rgba(255, 255, 255, 0.6)",
                fontFamily: "var(--font-montserrat), sans-serif",
                lineHeight: "1.7",
              }}
            >
              <p className="mb-0">Психотерапевт-психолог. Интегративный подход, живой терапевтический контакт.</p>
            </div>
          </div>

          {/* Column 2: Navigation */}
          <div className="flex flex-col gap-4">
            <div
              className="text-2xl font-medium pb-2"
              style={{
                color: "#ffffff",
                fontFamily: "var(--font-cormorant), Georgia, serif",
                lineHeight: "28px",
                letterSpacing: "-0.01em",
              }}
            >
              Навигация
            </div>

            {NAV_LINKS.map((link, index) => (
              <a
                key={index}
                href={link.href}
                className="text-sm font-light transition-all duration-300 hover:text-white"
                style={{
                  color: "rgba(255, 255, 255, 0.6)",
                  fontFamily: "var(--font-montserrat), sans-serif",
                  lineHeight: "20px",
                }}
              >
                {link.label}
              </a>
            ))}
          </div>

          {/* Column 3: Information */}
          <div className="flex flex-col gap-4">
            <div
              className="text-2xl font-medium pb-2"
              style={{
                color: "#ffffff",
                fontFamily: "var(--font-cormorant), Georgia, serif",
                lineHeight: "28px",
                letterSpacing: "-0.01em",
              }}
            >
              Информация
            </div>

            {INFO_LINKS.map((link, index) => (
              <a
                key={index}
                href={link.href}
                className="text-sm font-light transition-all duration-300 hover:text-white"
                style={{
                  color: "rgba(255, 255, 255, 0.6)",
                  fontFamily: "var(--font-montserrat), sans-serif",
                  lineHeight: "20px",
                }}
              >
                {link.label}
              </a>
            ))}
          </div>

          {/* Column 4: Requisites */}
          <div className="flex flex-col gap-4">
            <div
              className="text-2xl font-medium pb-2"
              style={{
                color: "#ffffff",
                fontFamily: "var(--font-cormorant), Georgia, serif",
                lineHeight: "28px",
                letterSpacing: "-0.01em",
              }}
            >
              Реквизиты
            </div>

            {REQUISITES.map((item, index) => (
              <div
                key={index}
                className="text-sm font-light"
                style={{
                  color: "rgba(255, 255, 255, 0.6)",
                  fontFamily: "var(--font-montserrat), sans-serif",
                  lineHeight: "20px",
                }}
              >
                {item}
              </div>
            ))}
          </div>

        </div>

        {/* Copyright */}
        <div className="mt-16 pt-8 border-t border-[rgba(255,255,255,0.1)]">
          <div
            className="text-center text-xs font-light"
            style={{
              color: "rgba(255, 255, 255, 0.4)",
              fontFamily: "var(--font-montserrat), sans-serif",
              lineHeight: "16px",
            }}
          >
            © 2026 Анна Почебыт. Все права защищены.
          </div>
        </div>
      </div>
    </footer>
  );
}