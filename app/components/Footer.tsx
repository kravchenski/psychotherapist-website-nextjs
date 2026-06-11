"use client";

import Link from "next/link";
import type { HomeContent } from "../types/content";

type FooterProps = {
  content: HomeContent["footer"];
};

export default function Footer({ content }: FooterProps) {
  const NAV_LINKS = [
    { label: "Обо мне", href: "/#about" },
    { label: "Услуги", href: "/#services" },
    { label: "Оплата", href: "/payment" },
    { label: "Публичный договор", href: "/public-offer" },
    { label: "Контакты", href: "/#contact" },
  ];

  return (
    <footer className="w-full bg-[#2c302e] border-t border-[rgba(255,255,255,0.1)]">
      <div className="px-4 pt-16 pb-12 sm:px-6 md:px-10 lg:px-16 xl:px-[60px]">
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
              {content.brandTitle}
            </div>

            <div
              className="text-sm font-light"
              style={{
                color: "rgba(255, 255, 255, 0.6)",
                fontFamily: "var(--font-montserrat), sans-serif",
                lineHeight: "1.7",
              }}
            >
              <p className="mb-0">{content.description}</p>
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
              {content.navigationTitle}
            </div>

            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm font-light transition-all duration-300 hover:text-white"
                style={{
                  color: "rgba(255, 255, 255, 0.6)",
                  fontFamily: "var(--font-montserrat), sans-serif",
                  lineHeight: "20px",
                }}
              >
                {link.label}
              </Link>
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
              {content.infoTitle}
            </div>

            <Link
              href="/privacy-policy"
              className="text-left text-sm font-light transition-all duration-300 hover:text-white"
              style={{
                color: "rgba(255, 255, 255, 0.6)",
                fontFamily: "var(--font-montserrat), sans-serif",
                lineHeight: "20px",
              }}
            >
              Политика конфиденциальности
            </Link>
            <Link
              href="/payment"
              className="text-left text-sm font-light transition-all duration-300 hover:text-white"
              style={{
                color: "rgba(255, 255, 255, 0.6)",
                fontFamily: "var(--font-montserrat), sans-serif",
                lineHeight: "20px",
              }}
            >
              Оплата услуг
            </Link>
            <Link
              href="/public-offer"
              className="text-left text-sm font-light transition-all duration-300 hover:text-white"
              style={{
                color: "rgba(255, 255, 255, 0.6)",
                fontFamily: "var(--font-montserrat), sans-serif",
                lineHeight: "20px",
              }}
            >
              Публичный договор
            </Link>
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
              {content.requisitesTitle}
            </div>

            {content.requisites.map((item, index) => (
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
              color: "rgba(255, 255, 255, 0.68)",
              fontFamily: "var(--font-montserrat), sans-serif",
              lineHeight: "16px",
            }}
          >
            {content.copyright}
          </div>
        </div>
      </div>
      </div>

      <div className="w-full bg-white px-4 py-5 sm:px-6">
        <div className="mx-auto flex max-w-4xl justify-center">
          {/* eslint-disable-next-line @next/next/no-img-element -- SVG payment marks should render as-is. */}
          <img
            src="/utils/payments_logos.svg"
            alt="Visa, Mastercard, Белкарт, bePaid, Я Pay, Google Pay, Apple Pay"
            width={760}
            height={80}
            className="h-auto w-full max-w-[760px]"
            style={{ height: "auto" }}
          />
        </div>
      </div>
    </footer>
  );
}
