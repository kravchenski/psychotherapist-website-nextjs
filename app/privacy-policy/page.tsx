import type { Metadata } from "next";
import LegalDocument from "../components/LegalDocument";
import { privacySections } from "../legalContent";

export const metadata: Metadata = {
  title: "Политика конфиденциальности | Анна Почебыт",
  description: "Политика конфиденциальности и защиты информации.",
};

export default function PrivacyPolicyPage() {
  return (
    <LegalDocument
      eyebrow="Правовые документы"
      title="Политика конфиденциальности и защиты информации"
      description="Порядок обработки персональных данных и меры по обеспечению безопасности персональных данных ИП Почебыт Анны Владимировны."
      sections={privacySections}
    />
  );
}
