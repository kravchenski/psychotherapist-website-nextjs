import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { getHomeContent } from "../lib/contentStore";

export const metadata: Metadata = {
  title: "Оплата | Анна Почебыт",
  description: "Информация об оплате услуг банковскими картами через интернет-эквайринг BePaid.",
};

export const dynamic = "force-dynamic";

export default async function PaymentPage() {
  const content = await getHomeContent();
  const payment = content.payment;
  const acquiring = payment.sections[0];
  const refund = payment.sections[1];
  const customPayment = payment.sections[2];

  return (
    <main className="flex-1 bg-[#fbfaf6] px-4 py-10 sm:px-6 lg:px-8 lg:py-14">
      <div className="mx-auto max-w-5xl">
        <div className="mb-8 border-b border-[rgba(44,48,46,0.1)] pb-8">
          <p
            className="text-xs font-semibold uppercase tracking-[0.22em]"
            style={{ color: "#6c7b6b", fontFamily: "var(--font-montserrat), sans-serif" }}
          >
            {payment.eyebrow}
          </p>
          <h1
            className="mt-4 text-4xl font-medium sm:text-5xl"
            style={{ color: "#2c302e", fontFamily: "var(--font-cormorant), Georgia, serif", lineHeight: 1 }}
          >
            {payment.title}
          </h1>
          <p
            className="mt-5 max-w-3xl text-sm leading-7 sm:text-base"
            style={{ color: "rgba(44,48,46,0.76)", fontFamily: "var(--font-montserrat), sans-serif" }}
          >
            {payment.description}
          </p>
        </div>

        <div className="space-y-6">
          <section className="rounded-2xl border border-[rgba(108,123,107,0.12)] bg-white p-5 shadow-[0_12px_40px_rgba(44,48,46,0.05)] sm:p-7">
            <h2
              className="text-2xl font-medium sm:text-3xl"
              style={{ color: "#2c302e", fontFamily: "var(--font-cormorant), Georgia, serif", lineHeight: 1.1 }}
            >
              {acquiring?.title}
            </h2>
            <div className="mt-4 space-y-3">
              {acquiring?.paragraphs.slice(0, 2).map((paragraph) => (
                <p
                  key={paragraph}
                  className="text-sm leading-7 sm:text-[15px]"
                  style={{ color: "rgba(44,48,46,0.82)", fontFamily: "var(--font-montserrat), sans-serif" }}
                >
                  {paragraph}
                </p>
              ))}
            </div>

            <div className="my-6 rounded-xl border border-[rgba(108,123,107,0.1)] bg-[#f7f8f6] px-4 py-5">
              <Image
                src="/utils/payment_cards.png"
                alt="Логотипы платежных систем Visa, Mastercard, Белкарт, bePaid, Google Pay и Apple Pay"
                width={1190}
                height={114}
                className="h-auto w-full"
              />
            </div>

            <div className="space-y-3">
              {acquiring?.paragraphs.slice(2).map((paragraph) => (
                <p
                  key={paragraph}
                  className="text-sm leading-7 sm:text-[15px]"
                  style={{ color: "rgba(44,48,46,0.82)", fontFamily: "var(--font-montserrat), sans-serif" }}
                >
                  {paragraph}
                </p>
              ))}
            </div>

            <div className="mt-7 rounded-xl border border-[rgba(108,123,107,0.12)] bg-[#f7f8f6] p-4">
              <p
                className="mb-4 text-sm font-semibold"
                style={{ color: "#334333", fontFamily: "var(--font-montserrat), sans-serif" }}
              >
                Пример письма с подтверждением успешной оплаты
              </p>
              <Image
                src="/utils/payment_confirmation_example.png"
                alt="Пример письма с подтверждением оплаты через bePaid"
                width={699}
                height={731}
                className="mx-auto h-auto w-full max-w-[699px] rounded-lg"
              />
            </div>
          </section>

          <section className="rounded-2xl border border-[rgba(108,123,107,0.12)] bg-white p-5 shadow-[0_12px_40px_rgba(44,48,46,0.05)] sm:p-7">
            <h2
              className="text-2xl font-medium sm:text-3xl"
              style={{ color: "#2c302e", fontFamily: "var(--font-cormorant), Georgia, serif", lineHeight: 1.1 }}
            >
              {refund?.title}
            </h2>
            <div className="mt-4 space-y-3">
              {refund?.paragraphs.map((paragraph) => (
                <p
                  key={paragraph}
                  className="text-sm leading-7 sm:text-[15px]"
                  style={{ color: "rgba(44,48,46,0.82)", fontFamily: "var(--font-montserrat), sans-serif" }}
                >
                  {paragraph}
                </p>
              ))}
            </div>
          </section>

          <section className="rounded-2xl border border-[rgba(108,123,107,0.12)] bg-white p-5 shadow-[0_12px_40px_rgba(44,48,46,0.05)] sm:p-7">
            <h2
              className="text-2xl font-medium sm:text-3xl"
              style={{ color: "#2c302e", fontFamily: "var(--font-cormorant), Georgia, serif", lineHeight: 1.1 }}
            >
              {customPayment?.title}
            </h2>
            <div className="mt-4 space-y-3">
              {customPayment?.paragraphs.map((paragraph) => (
                <p
                  key={paragraph}
                  className="text-sm leading-7 sm:text-[15px]"
                  style={{ color: "rgba(44,48,46,0.82)", fontFamily: "var(--font-montserrat), sans-serif" }}
                >
                  {paragraph}
                </p>
              ))}
            </div>

            <div className="mt-7 rounded-xl border border-[rgba(108,123,107,0.12)] bg-[#f7f8f6] p-4">
              <Image
                src="/utils/custom_payment_example.png"
                alt="Пример формы произвольного платежа"
                width={1135}
                height={433}
                className="h-auto w-full rounded-lg"
              />
            </div>

            <div className="mt-6 flex flex-wrap gap-3">
              <a
                href={payment.customPaymentDevLinkUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-full border border-[rgba(73,91,72,0.22)] bg-white px-5 py-3 text-sm font-medium text-[#334333] transition hover:bg-[#f4f7f3]"
                style={{ fontFamily: "var(--font-montserrat), sans-serif" }}
              >
                {payment.customPaymentDevLinkText}
              </a>
              <Link
                href="/public-offer"
                className="rounded-full border border-[#e5e2dc] bg-[#495b48] px-5 py-3 text-sm font-medium text-white transition hover:bg-[#3f4f3f]"
                style={{ fontFamily: "var(--font-montserrat), sans-serif" }}
              >
                {payment.publicOfferLinkText}
              </Link>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}
