"use client";

const imgViber = "social_networks/viber.svg";
const imgTelegram = "social_networks/telegram.svg";
const imgInstagram = "social_networks/instagram.svg";
const imgWhatsapp = "social_networks/whatsapp.svg";

const SOCIAL_LINKS = [
  { icon: imgViber, alt: "Viber", href: "#" },
  { icon: imgTelegram, alt: "Telegram", href: "#" },
  { icon: imgInstagram, alt: "Instagram", href: "#" },
  { icon: imgWhatsapp, alt: "WhatsApp", href: "#" },
];

const CONTACT_INFO = [
  {
    label: "Телефон",
    value: "+375 (29) 726-22-39",
  },
  {
    label: "Часы работы",
    value: "Пн-Пт: 09:00 - 20:00",
    subValue: "(по предварительной записи)",
  },
];

export default function Contacts() {
  return (
    <section className="w-full bg-white pt-12 md:py-20 lg:py-20 px-4 sm:px-6 md:px-10 lg:px-16 xl:px-[60px]" id="contact">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col lg:flex-row gap-12 lg:gap-16">
          
          {/* Left: Contact Info */}
          <div className="w-full lg:w-1/2 flex flex-col gap-3 text-center lg:text-left">
            {/* Section Label */}
            <div
              className="text-sm font-semibold tracking-wider uppercase"
              style={{
                color: "#6c7b6b",
                fontFamily: "var(--font-cormorant), Georgia, serif",
                lineHeight: "20px",
              }}
            >
              Связь со мной
            </div>

            {/* Main Heading */}
            <div
              className="text-4xl sm:text-5xl lg:text-[48px] font-medium"
              style={{
                color: "#2c302e",
                fontFamily: "var(--font-cormorant), Georgia, serif",
                lineHeight: 1.1,
                letterSpacing: "-0.02em",
              }}
            >
              Контакты
            </div>

            {/* Description */}
            <div className="flex flex-col gap-4 sm:gap-5 pt-3 sm:pt-4 pb-4 sm:pb-5 max-w-md mx-auto lg:mx-0">
              <div
                className="text-base sm:text-lg text-center lg:text-left"
                style={{
                  color: "rgba(44, 48, 46, 0.7)",
                  fontFamily: "var(--font-montserrat), sans-serif",
                  fontWeight: 300,
                  lineHeight: "1.7",
                }}
              >
                <p className="mb-0">
                  <span className="font-bold">
                    Возможен формат онлайн или офлайн в Гродно.
                    <br />
                    <br />
                  </span>
                  Свяжитесь со мной, чтобы задать вопросы или записаться на консультацию. Я отвечу вам в ближайшее время.
                </p>
              </div>
            </div>

            {/* Contact Info List */}
            <div className="flex flex-col gap-8 pt-4 sm:pt-6">
              {CONTACT_INFO.map((item, index) => (
                <div key={index} className="flex flex-col gap-2">
                  <div
                    className="text-xs font-semibold tracking-wider uppercase"
                    style={{
                      color: "rgba(44, 48, 46, 0.6)",
                      fontFamily: "var(--font-cormorant), Georgia, serif",
                      lineHeight: "20px",
                      letterSpacing: "0.7px",
                    }}
                  >
                    {item.label}
                  </div>
                  <div
                    className="text-xl font-medium"
                    style={{
                      color: "#2c302e",
                      fontFamily:
                        item.label === "Телефон" || item.label === "Часы работы"
                          ? "var(--font-montserrat), sans-serif"
                          : "var(--font-cormorant), Georgia, serif",
                      fontWeight: item.label === "Телефон" || item.label === "Часы работы" ? 600 : 500,
                      fontVariantNumeric:
                        item.label === "Телефон" || item.label === "Часы работы" ? "tabular-nums" : undefined,
                      letterSpacing:
                        item.label === "Телефон" || item.label === "Часы работы" ? "0.02em" : undefined,
                      lineHeight: "28px",
                    }}
                  >
                    {item.value}
                  </div>
                  {item.subValue && (
                    <div
                      className="text-sm font-light"
                      style={{
                        color: "rgba(44, 48, 46, 0.6)",
                        fontFamily: "var(--font-montserrat), sans-serif",
                        lineHeight: "20px",
                      }}
                    >
                      {item.subValue}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Right: Social Icons Grid */}
          <div className="w-full lg:w-1/2 flex items-center justify-center py-8 lg:py-0 md:h-[700px]">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 sm:gap-10 lg:gap-[104px] justify-items-center justify-center w-full">
              {SOCIAL_LINKS.map((social, index) => (
                <a
                  key={index}
                  href={social.href}
                  className="relative group size-[110px] md:size-[110px] lg:size-[110px] flex items-center justify-center transition-all duration-300 ease-out transform hover:scale-110 hover:-translate-y-1"
                >
                <img
                  alt={social.alt}
                  src={social.icon}
                  className="max-w-none size-full object-contain transition-all duration-300 group-hover:opacity-100"
                />
                </a>
              ))}
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}