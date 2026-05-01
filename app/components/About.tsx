import Image from "next/image";
import type { HomeContent } from "../types/content";

const defaultPhoto = "/personal_photos/about.webp";

type AboutProps = {
  content: HomeContent["about"];
};

export default function About({ content }: AboutProps) {
  const photoUrl = content.photoUrl || defaultPhoto;
  return (
    <section className="w-full bg-white py-12 lg:py-16 px-4 sm:px-6 lg:px-8" id="about">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col lg:flex-row gap-8 lg:gap-12 items-start">
          {/* Left: Image */}
          <div className="w-full lg:w-1/2">
            <div className="relative inline-block w-full">
              <div className="relative overflow-hidden rounded-lg">
                <Image
                  alt="Анна Почебыт"
                  src={photoUrl}
                  width={640}
                  height={800}
                  sizes="(max-width: 1023px) 92vw, 50vw"
                  quality={72}
                  loading="lazy"
                  className="w-full h-auto"
                />
              </div>
              {/* Decorative blur circle - positioned relative to image wrapper */}
              <div
                className="hidden md:block absolute -bottom-6 -right-6 w-32 h-32 lg:w-48 lg:h-48 rounded-full blur-3xl opacity-50"
                style={{ backgroundColor: "#e2dacf" }}
              />
            </div>
          </div>

          {/* Right: Content */}
          <div className="w-full lg:w-1/2 flex flex-col gap-3">
            {/* Section Label */}
            <div
              className="text-lg sm:text-xl lg:text-2xl font-semibold tracking-wider uppercase text-center lg:text-left"
              style={{
                color: "#4f5f4e",
                fontFamily: "var(--font-cormorant), Georgia, serif",
                lineHeight: "1.1",
              }}
            >
              {content.label}
            </div>

            {/* Main Heading */}
            <div
              className="text-4xl sm:text-5xl lg:text-[48px] font-medium text-center lg:text-left"
              style={{
                color: "#2c302e",
                fontFamily: "var(--font-cormorant), Georgia, serif",
                lineHeight: 1.1,
                letterSpacing: "-0.02em",
              }}
            >
              {content.heading}
            </div>

            {/* Bio Text */}
            <div className="flex flex-col gap-4 sm:gap-5 pt-3 sm:pt-4 pb-4 sm:pb-5 text-center sm:text-left">
            <div
              className="text-lg sm:text-xl"
              style={{
                color: "rgba(44, 48, 46, 0.7)",
                fontFamily: "var(--font-montserrat), sans-serif",
                fontWeight: 300,
                lineHeight: "1.6",
              }}
            >
              <p className="mb-0">
                {content.intro}
              </p>
            </div>

              <div
                className="text-lg sm:text-xl"
                style={{
                  color: "rgba(44, 48, 46, 0.7)",
                  fontFamily: "var(--font-montserrat), sans-serif",
                  fontWeight: 300,
                  lineHeight: "1.75",
                }}
              >
                <p>
                  {content.description}
                </p>
              </div>
            </div>

            {/* Timeline */}
            <div className="relative pl-6 sm:pl-7 border-l-2 border-[rgba(108,123,107,0.2)] pt-6 sm:pt-8 lg:pt-10">
              {content.timeline.map((item, index) => (
                <div
                  key={index}
                  className="relative pb-6 sm:pb-7 last:pb-0"
                  style={{
                    paddingLeft: "26px",
                  }}
                >
                  {/* Timeline dot */}
                  <div
                    className="absolute left-[-30px] sm:left-[-35px] top-[5px] w-3 h-3 bg-[#4f5f4e] rounded-full"
                    style={{
                      boxShadow: "0 0 0 4px white",
                    }}
                  />

                  {/* Year/Label */}
                  <div
                    style={{
                      color: "#4f5f4e",
                      fontFamily: "var(--font-montserrat), sans-serif",
                      fontSize: "1rem",
                      fontWeight: 600,
                      lineHeight: "24px",
                    }}
                  >
                    {item.year}
                  </div>

                  {/* Title */}
                  {item.title && (
                    <div
                      style={{
                        color: "#2c302e",
                        fontFamily: "var(--font-cormorant), Georgia, serif",
                        fontSize: "1.375rem",
                        fontWeight: 500,
                        lineHeight: "1.5",
                        letterSpacing: "-0.01em",
                        marginTop: "4px",
                      }}
                    >
                      {item.title}
                    </div>
                  )}

                  {/* Institution/Courses */}
                  {item.institution && (
                    <div
                      style={{
                        color: "rgba(44, 48, 46, 0.78)",
                        fontFamily: "var(--font-montserrat), sans-serif",
                        fontSize: "1rem",
                        fontWeight: 400,
                        lineHeight: "1.5",
                        marginTop: "4px",
                      }}
                    >
                      {item.institution}
                    </div>
                  )}

                  {item.courses && (
                    <div
                      style={{
                        color: "rgba(44, 48, 46, 0.78)",
                        fontFamily: "var(--font-montserrat), sans-serif",
                        fontSize: "1rem",
                        fontWeight: 400,
                        lineHeight: "1.6",
                        marginTop: "4px",
                      }}
                    >
                      {item.courses.map((course, idx) => (
                        <div key={idx}>{course}</div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}