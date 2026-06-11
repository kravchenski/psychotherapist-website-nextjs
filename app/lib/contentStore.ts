import { promises as fs } from "node:fs";
import path from "node:path";
import { revalidatePath } from "next/cache";
import homeContent from "@/content/home.json";
import type { HomeContent } from "@/app/types/content";
import { paymentSections, privacySections, publicOfferSections } from "@/app/legalContent";

const defaultExtendedContent = {
  footer: {
    brandTitle: "Анна Почебыт",
    description: "Психотерапевт-психолог. Интегративный подход, живой терапевтический контакт.",
    navigationTitle: "Навигация",
    infoTitle: "Информация",
    requisitesTitle: "Реквизиты",
    requisites: [
      "ИП Почебыт Анна Владимировна",
      "УНП 592012888, свидетельство о регистрации выдано 02.09.2024 Администрацией Ленинского района г. Гродно",
      "Юридический адрес: Гродненская область, г. Гродно, ул. Социалистическая, 56, кв. 28",
      "Режим работы: 09:00 - 20:00 (по предварительной записи)",
      "р/с BY50 ALFA 3013 2E77 2000 1027 0000",
      "ЦБУ № 6 АО «Альфа-Банк»",
      "BIC: ALFABY2X",
      "УНП банка: 101541947",
    ],
    copyright: "© 2026 Анна Почебыт. Все права защищены.",
  },
  payment: {
    eyebrow: "Интернет-эквайринг",
    title: "Оплата услуг",
    description:
      "Информация об оплате услуг в белорусских рублях, безопасности платежей, подтверждении оплаты и порядке возврата денежных средств.",
    paymentUrl: "https://api.bepaid.by/products/prd_5e2c12758bd61836/pay",
    homeTitle: "Банковскими картами через BePaid",
    sections: paymentSections,
    publicOfferLinkText: "Публичный договор",
  },
  publicOffer: {
    eyebrow: "Правовые документы",
    title: "Публичный договор",
    description: "Публичная оферта на оказание информационно-консультационных услуг ИП Почебыт Анной Владимировной.",
    sections: publicOfferSections,
  },
  privacyPolicy: {
    eyebrow: "Правовые документы",
    title: "Политика конфиденциальности и защиты информации",
    description:
      "Порядок обработки персональных данных и меры по обеспечению безопасности персональных данных ИП Почебыт Анны Владимировны.",
    sections: privacySections,
  },
} satisfies Pick<HomeContent, "footer" | "payment" | "publicOffer" | "privacyPolicy">;

const fallbackContent = normalizeHomeContent(homeContent);
const contentFilePath = path.join(process.cwd(), "content", "home.json");

function isTimelineItem(value: unknown): value is HomeContent["about"]["timeline"][number] {
  if (!value || typeof value !== "object") {
    return false;
  }

  const item = value as Record<string, unknown>;

  return (
    typeof item.year === "string" &&
    (item.title === undefined || typeof item.title === "string") &&
    (item.institution === undefined || typeof item.institution === "string") &&
    (item.courses === undefined ||
      (Array.isArray(item.courses) && item.courses.every((course) => typeof course === "string")))
  );
}

function isStringArray(value: unknown): value is string[] {
  return Array.isArray(value) && value.every((item) => typeof item === "string");
}

function isLegalSection(value: unknown): value is HomeContent["payment"]["sections"][number] {
  if (!value || typeof value !== "object") {
    return false;
  }

  const section = value as Record<string, unknown>;

  return typeof section.title === "string" && isStringArray(section.paragraphs);
}

function isLegalSections(value: unknown): value is HomeContent["payment"]["sections"] {
  return Array.isArray(value) && value.every(isLegalSection);
}

function normalizeHomeContent(value: unknown): HomeContent {
  const content = value as Partial<HomeContent>;

  return {
    ...(content as HomeContent),
    footer: {
      ...defaultExtendedContent.footer,
      ...(content.footer || {}),
      requisites: isStringArray(content.footer?.requisites)
        ? content.footer.requisites
        : defaultExtendedContent.footer.requisites,
    },
    payment: {
      ...defaultExtendedContent.payment,
      ...(content.payment || {}),
      sections: isLegalSections(content.payment?.sections)
        ? content.payment.sections
        : defaultExtendedContent.payment.sections,
    },
    publicOffer: {
      ...defaultExtendedContent.publicOffer,
      ...(content.publicOffer || {}),
      sections: isLegalSections(content.publicOffer?.sections)
        ? content.publicOffer.sections
        : defaultExtendedContent.publicOffer.sections,
    },
    privacyPolicy: {
      ...defaultExtendedContent.privacyPolicy,
      ...(content.privacyPolicy || {}),
      sections: isLegalSections(content.privacyPolicy?.sections)
        ? content.privacyPolicy.sections
        : defaultExtendedContent.privacyPolicy.sections,
    },
  };
}

export function isHomeContent(value: unknown): value is HomeContent {
  if (!value || typeof value !== "object") {
    return false;
  }

  const content = value as Record<string, unknown>;
  const hero = content.hero as Record<string, unknown> | undefined;
  const about = content.about as Record<string, unknown> | undefined;
  const services = content.services as Record<string, unknown> | undefined;
  const contacts = content.contacts as Record<string, unknown> | undefined;
  const footer = content.footer as Record<string, unknown> | undefined;
  const payment = content.payment as Record<string, unknown> | undefined;
  const publicOffer = content.publicOffer as Record<string, unknown> | undefined;
  const privacyPolicy = content.privacyPolicy as Record<string, unknown> | undefined;

  return Boolean(
    hero &&
      about &&
      services &&
      contacts &&
      typeof hero.title === "string" &&
      typeof hero.description === "string" &&
      typeof hero.primaryButtonText === "string" &&
      typeof hero.secondaryButtonText === "string" &&
      (hero.photoUrl === undefined || typeof hero.photoUrl === "string") &&
      typeof about.label === "string" &&
      typeof about.heading === "string" &&
      typeof about.intro === "string" &&
      typeof about.description === "string" &&
      (about.photoUrl === undefined || typeof about.photoUrl === "string") &&
      Array.isArray(about.timeline) &&
      about.timeline.every(isTimelineItem) &&
      typeof services.label === "string" &&
      typeof services.description === "string" &&
      typeof services.highlight === "string" &&
      typeof services.cardTitle === "string" &&
      typeof services.cardDescription === "string" &&
      typeof services.price === "string" &&
      typeof services.buttonText === "string" &&
      Array.isArray(services.items) &&
      services.items.every((item) => typeof item === "string") &&
      typeof contacts.label === "string" &&
      typeof contacts.description === "string" &&
      typeof contacts.phoneLabel === "string" &&
      typeof contacts.phoneValue === "string" &&
      typeof contacts.hoursLabel === "string" &&
      typeof contacts.hoursValue === "string" &&
      (contacts.hoursSubValue === undefined || typeof contacts.hoursSubValue === "string") &&
      footer &&
      typeof footer.brandTitle === "string" &&
      typeof footer.description === "string" &&
      typeof footer.navigationTitle === "string" &&
      typeof footer.infoTitle === "string" &&
      typeof footer.requisitesTitle === "string" &&
      isStringArray(footer.requisites) &&
      typeof footer.copyright === "string" &&
      payment &&
      typeof payment.eyebrow === "string" &&
      typeof payment.title === "string" &&
      typeof payment.description === "string" &&
      typeof payment.paymentUrl === "string" &&
      typeof payment.homeTitle === "string" &&
      isLegalSections(payment.sections) &&
      typeof payment.publicOfferLinkText === "string" &&
      publicOffer &&
      typeof publicOffer.eyebrow === "string" &&
      typeof publicOffer.title === "string" &&
      typeof publicOffer.description === "string" &&
      isLegalSections(publicOffer.sections) &&
      privacyPolicy &&
      typeof privacyPolicy.eyebrow === "string" &&
      typeof privacyPolicy.title === "string" &&
      typeof privacyPolicy.description === "string" &&
      isLegalSections(privacyPolicy.sections),
  );
}

export async function getHomeContent(): Promise<HomeContent> {
  try {
    const rawContent = await fs.readFile(contentFilePath, "utf8");
    const content = JSON.parse(rawContent) as unknown;

    const normalizedContent = normalizeHomeContent(content);

    if (isHomeContent(normalizedContent)) {
      return normalizedContent;
    }
  } catch (error) {
    console.warn("Content file is unavailable or invalid, using fallback home content.", error);
  }

  return fallbackContent;
}

export async function saveHomeContent(content: HomeContent) {
  await fs.mkdir(path.dirname(contentFilePath), { recursive: true });
  await fs.writeFile(contentFilePath, `${JSON.stringify(content, null, 2)}\n`, "utf8");
  revalidatePath("/");
  revalidatePath("/payment");
  revalidatePath("/public-offer");
  revalidatePath("/privacy-policy");

  return content;
}
