import type { LegalSection } from "../legalContent";

type LegalDocumentProps = {
  eyebrow: string;
  title: string;
  description: string;
  sections: LegalSection[];
  children?: React.ReactNode;
};

export default function LegalDocument({
  eyebrow,
  title,
  description,
  sections,
  children,
}: LegalDocumentProps) {
  return (
    <main className="flex-1 bg-[#fbfaf6] px-4 py-10 sm:px-6 lg:px-8 lg:py-14">
      <div className="mx-auto max-w-5xl">
        <div className="mb-8 border-b border-[rgba(44,48,46,0.1)] pb-8">
          <p
            className="text-xs font-semibold uppercase tracking-[0.22em]"
            style={{ color: "#6c7b6b", fontFamily: "var(--font-montserrat), sans-serif" }}
          >
            {eyebrow}
          </p>
          <h1
            className="mt-4 text-4xl font-medium sm:text-5xl"
            style={{
              color: "#2c302e",
              fontFamily: "var(--font-cormorant), Georgia, serif",
              lineHeight: 1,
            }}
          >
            {title}
          </h1>
          <p
            className="mt-5 max-w-3xl text-sm leading-7 sm:text-base"
            style={{ color: "rgba(44,48,46,0.76)", fontFamily: "var(--font-montserrat), sans-serif" }}
          >
            {description}
          </p>
          {children}
        </div>

        <div className="space-y-5">
          {sections.map((section) => (
            <section
              key={section.title}
              className="rounded-2xl border border-[rgba(108,123,107,0.12)] bg-white p-5 shadow-[0_12px_40px_rgba(44,48,46,0.05)] sm:p-7"
            >
              <h2
                className="text-2xl font-medium sm:text-3xl"
                style={{
                  color: "#2c302e",
                  fontFamily: "var(--font-cormorant), Georgia, serif",
                  lineHeight: 1.1,
                }}
              >
                {section.title}
              </h2>
              <div className="mt-4 space-y-3">
                {section.paragraphs.map((paragraph) => (
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
          ))}
        </div>
      </div>
    </main>
  );
}
