import type { Metadata } from "next";
import LegalDocument from "../components/LegalDocument";
import { getHomeContent } from "../lib/contentStore";

export const metadata: Metadata = {
  title: "Публичный договор | Анна Почебыт",
  description: "Публичный договор на оказание информационно-консультационных услуг.",
};

export const dynamic = "force-dynamic";

export default async function PublicOfferPage() {
  const content = await getHomeContent();
  const publicOffer = content.publicOffer;

  return (
    <LegalDocument
      eyebrow={publicOffer.eyebrow}
      title={publicOffer.title}
      description={publicOffer.description}
      sections={publicOffer.sections}
    />
  );
}
