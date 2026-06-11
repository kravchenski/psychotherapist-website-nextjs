import type { Metadata } from "next";
import LegalDocument from "../components/LegalDocument";
import { publicOfferSections } from "../legalContent";

export const metadata: Metadata = {
  title: "Публичный договор | Анна Почебыт",
  description: "Публичный договор на оказание информационно-консультационных услуг.",
};

export default function PublicOfferPage() {
  return (
    <LegalDocument
      eyebrow="Правовые документы"
      title="Публичный договор"
      description="Публичная оферта на оказание информационно-консультационных услуг ИП Почебыт Анной Владимировной."
      sections={publicOfferSections}
    />
  );
}
