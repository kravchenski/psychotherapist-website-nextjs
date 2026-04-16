"use client"
import Image from 'next/image'
import { useState } from "react";

const imgSvg = "utils/service_check.svg";

const SERVICES = [
  "Индивидуальное консультирование (психотерапия)",
  "Работа с отношениями и семейными вопросами",
  "Коррекция самооценки и эмоциональной устойчивости",
  "Работа с созависимостью",
  "Поддержка при трудностях сепарации",
  "Консультирование по вопросам сексуальности",
  "Другие вопросы по запросу (уточняйте)",
];

export default function Services() {
  const [isButtonHovered, setIsButtonHovered] = useState(false);

  return (
    <section className="w-full bg-[#f9f8f5] py-12 lg:py-16 px-4 sm:px-6 lg:px-8" id="services">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col items-center text-center mb-10 lg:mb-12">
          {/* Section Label */}
          <div
            className="text-sm font-semibold tracking-wider uppercase mb-3"
            style={{
              color: "#6c7b6b",
              fontFamily: "var(--font-cormorant), Georgia, serif",
              lineHeight: "20px",
            }}
          >
            Направления работы
          </div>

          {/* Description */}
          <div
            className="text-base sm:text-lg max-w-2xl"
            style={{
              color: "rgba(44, 48, 46, 0.88)",
              fontFamily: "var(--font-montserrat), sans-serif",
              fontWeight: 400,
              lineHeight: "1.7",
            }}
          >
            <p className="mb-0">
              Предлагаю индивидуальный формат работы, доступный как очно, так и онлайн.
            </p>
            <p>
              <span className="font-bold">Не работаю со всеми видами зависимости, с детьми и подростками до 18 лет</span>
            </p>
          </div>
        </div>

        <div className="flex lg:flex-row gap-6 lg:gap-10 justify-center">
          {/* Service Card - Full width on mobile, 2-column on desktop */}
          <div>
            <div
              className="bg-white border border-[#e5e2dc] rounded-[24px] p-6 sm:p-8 md:p-10 w-full transition-all duration-300 ease-out"
              style={{
                transform: isButtonHovered ? "translateY(-4px)" : "translateY(0)",
                boxShadow: isButtonHovered
                  ? "0px 18px 30px -14px rgba(44, 48, 46, 0.28), 0px 8px 14px -10px rgba(44, 48, 46, 0.2)"
                  : "0px 10px 18px -12px rgba(44, 48, 46, 0.18), 0px 4px 8px -6px rgba(44, 48, 46, 0.12)",
              }}
            >
              <div className="relative">
                {/* Card Header */}
                <div className="flex justify-between items-start mb-5">
                  <div>
                    <div
                      className="text-2xl font-medium mb-2"
                      style={{
                        color: "#2c302e",
                        fontFamily: "var(--font-cormorant), Georgia, serif",
                        letterSpacing: "-0.01em",
                      }}
                    >
                      Индивидуальные консультации
                    </div>
                    <div className="flex gap-2">
                      <span className="bg-[#6c7b6b1a] text-[#6c7b6b] text-xs font-medium px-2 py-1 rounded">
                        офлайн
                      </span>
                      <span className="bg-[#6c7b6b1a] text-[#6c7b6b] text-xs font-medium px-2 py-1 rounded">
                        онлайн
                      </span>
                    </div>
                  </div>
                </div>

                {/* Description */}
                <div
                  className="text-sm mb-7"
                  style={{
                    color: "rgba(44, 48, 46, 0.82)",
                    fontFamily: "var(--font-montserrat), sans-serif",
                    fontWeight: 400,
                    lineHeight: "1.6",
                  }}
                >
                  <p className="sm:hidden mb-0">
                    Персональная работа с психологическими трудностями, направленная на решение конкретных проблем и достижение позитивных изменений в жизни.
                  </p>
                  <div className="hidden sm:block">
                    <p className="mb-0">Персональная работа с психологическими</p>
                    <p className="mb-0">трудностями, направленная на решение конкретных</p>
                    <p className="mb-0">проблем и достижение позитивных изменений в</p>
                    <p>жизни.</p>
                  </div>
                </div>

                {/* Services List */}
                <div className="space-y-4 mb-7">
                  {SERVICES.map((service, index) => (
                    <div key={index} className="flex items-start gap-3">
                      <div className="flex-shrink-0 mt-1">
                        <Image src={imgSvg} alt='Service check' width={20} height={20} />
                      </div>
                      <div
                        className="text-sm"
                        style={{
                          color: "rgba(44, 48, 46, 0.8)",
                          fontFamily: "var(--font-montserrat), sans-serif",
                          fontWeight: 400,
                          lineHeight: "1.6",
                        }}
                      >
                        {service}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Action Button */}
                <button
                  className="w-full bg-[#495b48] text-white font-medium py-3 px-6 rounded-full border border-[#e5e2dc] cursor-pointer transition-shadow duration-300 ease-out hover:shadow-[0px_12px_24px_-10px_rgba(44,48,46,0.35),0px_6px_12px_-8px_rgba(44,48,46,0.25)] focus-visible:shadow-[0px_12px_24px_-10px_rgba(44,48,46,0.35),0px_6px_12px_-8px_rgba(44,48,46,0.25)]"
                  style={{
                    fontFamily: 'var(--font-montserrat), sans-serif',
                  }}
                  onMouseEnter={() => setIsButtonHovered(true)}
                  onMouseLeave={() => setIsButtonHovered(false)}
                  onFocus={() => setIsButtonHovered(true)}
                  onBlur={() => setIsButtonHovered(false)}
                  onClick={() => { window.location.hash = "contact"; }}
                >
                  Записаться
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
