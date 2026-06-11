import type { Metadata } from "next";
import LegalDocument from "../components/LegalDocument";
import { getHomeContent } from "../lib/contentStore";

export const metadata: Metadata = {
  title: "Политика конфиденциальности | Анна Почебыт",
  description: "Политика конфиденциальности и защиты информации.",
};

export const dynamic = "force-dynamic";

export default async function PrivacyPolicyPage() {
  const content = await getHomeContent();
  const privacyPolicy = content.privacyPolicy;

  return (
    <LegalDocument
      eyebrow={privacyPolicy.eyebrow}
      title={privacyPolicy.title}
      description={privacyPolicy.description}
      sections={privacyPolicy.sections}
    />
  );
}
