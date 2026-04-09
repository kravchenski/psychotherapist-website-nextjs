"use client";

const imgPhoto = "personal_photos/about.jpeg";

const TIMELINE_ITEMS = [
  {
    year: "2012",
    title: "Диплом врача-психотерапевта",
    institution: "Гродненский государственный медицинский университет",
  },
  {
    year: "2016 - 2021",
    title: "Врач-психотерапевт",
    institution: "Психосоматическое отделение УЗ ГКБ №3",
  },
  {
    year: "2021 - 2024",
    title: "Врач-психотерапевт",
    institution: 'УЗ "ГОКЦ" Психиатрия-Наркология',
  },
  {
    year: "2024 – н.в.",
    title: "Врач-психотерапевт",
    institution: "Медицинский центр «ЛОДЭ»",
  },
  {
    year: "Дополнительное образование по курсам:",
    courses: [
      "- семейная системная писхотерапия;",
      "- семейная медиация: технология работы с семейным кризисом;",
      "- сексуальные расстройства, профилактика сексуальных нарушений;",
      "- доказательная медицина: антидепрессанты в практике врача-психотерапевта;",
      "- актуальные проблемы диагностики, лечения, реабилитации психических расстройств;",
      "- современные подходы к терапии психосоматических расстройств",
    ],
  },
];

export default function About() {
  return (
    <section className="w-full bg-white py-12 lg:py-16 px-4 sm:px-6 lg:px-8" id="#about">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col lg:flex-row gap-8 lg:gap-12 items-start">
          {/* Left: Image */}
          <div className="w-full lg:w-1/2">
            <div className="relative inline-block w-full">
              <div className="relative overflow-hidden rounded-lg">
                <img
                  alt="Анна Почебыт"
                  src={imgPhoto}
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
              className="text-sm font-semibold tracking-wider uppercase"
              style={{
                color: "#6c7b6b",
                fontFamily: "var(--font-cormorant), Georgia, serif",
                lineHeight: "20px",
              }}
            >
              Обо мне
            </div>

            {/* Main Heading */}
            <div
              className="text-4xl sm:text-5xl lg:text-[48px] font-medium"
              style={{
                color: "#2c302e",
                fontFamily: "var(--font-cormorant), Georgia, serif",
                lineHeight: 1.1,
                letterSpacing: "-0.02em",
              }}
            >
              Приятно познакомиться!
            </div>

            {/* Bio Text */}
            <div className="flex flex-col gap-4 sm:gap-5 pt-3 sm:pt-4 pb-4 sm:pb-5">
            <div
              className="text-lg sm:text-xl"
              style={{
                color: "rgba(44, 48, 46, 0.7)",
                fontFamily: "var(--font-montserrat), sans-serif",
                fontWeight: 300,
                lineHeight: "1.6",
              }}
            >
              <p className="mb-0">Меня зовут Анна Почебыт, я психотерапевт-психолог. Живу и работаю в Гродно.</p>
            </div>

              <div
                className="text-base sm:text-lg"
                style={{
                  color: "rgba(44, 48, 46, 0.7)",
                  fontFamily: "var(--font-montserrat), sans-serif",
                  fontWeight: 300,
                  lineHeight: "1.7",
                }}
              >
                <p>
                  Создаю безопасное пространство, где можно открыто говорить о чувствах, разбираться в отношениях и находить внутренние ресурсы. Помогаю справляться со стрессом, тревогой и жизненными трудностями. Вместе мы ищем пути к гармонии и внутренней уверенности. Моя цель — помочь вам жить осознанно и легче.
                </p>
              </div>
            </div>

            {/* Timeline */}
            <div className="relative pl-6 sm:pl-7 border-l-2 border-[rgba(108,123,107,0.2)] pt-6 sm:pt-8 lg:pt-10">
              {TIMELINE_ITEMS.map((item, index) => (
                <div
                  key={index}
                  className="relative pb-6 sm:pb-7 last:pb-0"
                  style={{
                    paddingLeft: "26px",
                  }}
                >
                  {/* Timeline dot */}
                  <div
                    className="absolute left-[-30px] sm:left-[-31px] top-[5px] w-3 h-3 bg-[#6c7b6b] rounded-full"
                    style={{
                      boxShadow: "0 0 0 4px white",
                    }}
                  />

                  {/* Year/Label */}
                  <div
                    style={{
                      color: "#6c7b6b",
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
                        color: "rgba(44, 48, 46, 0.6)",
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
                        color: "rgba(44, 48, 46, 0.6)",
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
