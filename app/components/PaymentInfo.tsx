import Link from "next/link";
import type { HomeContent } from "../types/content";

type PaymentInfoProps = {
  content: HomeContent["payment"];
};

export default function PaymentInfo({ content }: PaymentInfoProps) {
  const intro = content.sections[0];

  return (
    <section className="w-full bg-white px-4 py-12 sm:px-6 md:px-10 lg:px-16 lg:py-16 xl:px-[60px]" id="payment-info">
      <div className="mx-auto max-w-7xl">
        <div className="grid gap-8 lg:grid-cols-[0.85fr_1.15fr] lg:items-start">
          <div>
            <p
              className="text-lg font-semibold uppercase tracking-wider sm:text-xl lg:text-2xl"
              style={{ color: "#4f5f4e", fontFamily: "var(--font-cormorant), Georgia, serif" }}
            >
              Оплата
            </p>
            <h2
              className="mt-3 text-4xl font-medium sm:text-5xl"
              style={{
                color: "#2c302e",
                fontFamily: "var(--font-cormorant), Georgia, serif",
                lineHeight: 1,
              }}
            >
              {content.homeTitle}
            </h2>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link
                href="/payment"
                className="rounded-full border border-[#e5e2dc] bg-[#495b48] px-5 py-3 text-sm font-medium text-white transition hover:bg-[#3f4f3f]"
                style={{ fontFamily: "var(--font-montserrat), sans-serif" }}
              >
                Подробнее об оплате
              </Link>
              <Link
                href="/public-offer"
                className="rounded-full border border-[rgba(73,91,72,0.22)] bg-white px-5 py-3 text-sm font-medium text-[#334333] transition hover:bg-[#f4f7f3]"
                style={{ fontFamily: "var(--font-montserrat), sans-serif" }}
              >
                Публичный договор
              </Link>
            </div>
          </div>

          <div className="space-y-4">
            {intro?.paragraphs.slice(0, 4).map((paragraph) => (
              <p
                key={paragraph}
                className="text-sm leading-7 sm:text-base"
                style={{ color: "rgba(44,48,46,0.78)", fontFamily: "var(--font-montserrat), sans-serif" }}
              >
                {paragraph}
              </p>
            ))}
            <p
              className="rounded-2xl border border-[rgba(108,123,107,0.14)] bg-[#f4f7f3] px-5 py-4 text-sm leading-7"
              style={{ color: "#334333", fontFamily: "var(--font-montserrat), sans-serif" }}
            >
              {content.sections[1]?.paragraphs.join(" ")}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
