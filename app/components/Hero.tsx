import Image from "next/image";

const imgAbstractCalmBackground = "/utils/bg_abstract_calm.png";
const imgMainPhoto = "/personal_photos/hero_photo.jpeg";

export default function Hero() {
  return (
    <section className="w-full min-h-[1080px] flex items-center justify-center relative overflow-hidden lg:py-16 px-4 sm:px-6 lg:px-8" id="hero">
     <div className="max-w-8xl mx-auto my-auto">
       {/* Background with gradient overlay */}
      <div className="absolute inset-0 flex flex-col items-start justify-center">
        <div className="flex-1 min-h-0 min-w-0 opacity-60 relative w-full">
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <Image
              alt="Abstract calm background"
              src={imgAbstractCalmBackground}
              fill
              sizes="100vw"
              quality={60}
              loading="eager"
              className="absolute h-full left-[-1.56%] max-w-none top-0 w-[103.12%] object-cover"
            />
          </div>
        </div>
        <div className="absolute bg-gradient-to-b from-[rgba(249,248,245,0.4)] inset-0 to-[#f9f8f5] via-1/2 via-[rgba(249,248,245,0.6)]" />
      </div>

      {/* FOR SCREENS LESS THAN 1024px - EXACTLY LIKE ABOUT SECTION */}
      <div className="lg:hidden max-w-7xl mx-auto w-full relative z-10">
        <div className="flex flex-col lg:flex-row gap-8 lg:gap-12 items-start">
          
          {/* PHOTO ON TOP - EXACT SAME STYLES AS IN ABOUT */}
          <div className="w-full lg:w-1/2">
            <div className="relative inline-block w-full">
              <div className="relative overflow-hidden rounded-lg">
                <Image
                  alt="Анна Почебыт" 
                  src={imgMainPhoto}
                  width={1600}
                  height={2400}
                  sizes="(max-width: 639px) 92vw, (max-width: 1023px) 680px, 50vw"
                  quality={70}
                  priority
                  fetchPriority="high"
                  className="w-full h-auto"
                />
              </div>
              <div 
                className="hidden md:block absolute -bottom-6 -right-6 w-32 h-32 lg:w-48 lg:h-48 rounded-full blur-3xl opacity-50"
                style={{ backgroundColor: "#e2dacf" }}
              />
            </div>
          </div>

          {/* TEXT CONTENT UNDER PHOTO */}
          <div className="w-full lg:w-1/2 flex flex-col gap-3">
            <h1 
              className="text-[#2c302e] text-4xl sm:text-5xl lg:text-[72px] font-medium text-center lg:text-left"
              style={{ fontFamily: "var(--font-cormorant), Georgia, serif", lineHeight: "1.1", letterSpacing: "-0.02em" }}
            >
              Психолог-психотерапевт
            </h1>

            <p 
              className="text-base sm:text-lg font-light px-2 text-[rgba(44,48,46,0.82)]"
              style={{ fontFamily: "var(--font-cormorant), Georgia, serif", lineHeight: "1.7" }}
            >
              Психотерапевт – это как проводник, который помогает вам найти свой собственный путь к решению проблем. Он не даёт готовых советов, а создаёт безопасное пространство, где вы можете разобраться в своих мыслях и чувствах, понять, что мешает, и найти свои собственные силы для изменений. Главное для меня– это доверие, конфиденциальность и вера в то, что вы сами способны справиться, просто иногда нужна помощь, чтобы это осознать.
            </p>

            <div className="flex flex-col gap-[12px] mt-4">
              <a
                href="#contact"
                className="bg-[#4a5b49] hover:bg-[#3f4f3f] transition-all duration-300 ease-out transform hover:translate-y-[-2px] border border-[#e5e2dc] h-[48px] items-center justify-center min-h-[40px] px-[24px] rounded-full shadow-[0px_10px_15px_-3px_rgba(74,91,73,0.22),0px_4px_6px_-4px_rgba(74,91,73,0.22)] hover:shadow-[0px_14px_20px_-3px_rgba(74,91,73,0.32),0px_6px_8px_-4px_rgba(74,91,73,0.24)] cursor-pointer inline-flex"
                style={{ fontFamily: "var(--font-montserrat), sans-serif", fontWeight: 500 }}
              >
                <span className="text-[14px] text-center text-white leading-[20px]">Записаться на консультацию</span>
              </a>

              <a
                href="#about"
                className="bg-transparent hover:bg-[rgba(108,123,107,0.05)] transition-all duration-300 ease-out transform hover:translate-y-[-2px] border hover:border-[rgba(108,123,107,0.4)] border-[rgba(108,123,107,0.2)] h-[48px] items-center justify-center min-h-[40px] px-[24px] rounded-full shadow-[0px_1px_2px_0px_rgba(0,0,0,0.05)] hover:shadow-[0px_4px_8px_0px_rgba(0,0,0,0.08)] cursor-pointer inline-flex"
                style={{ fontFamily: "var(--font-montserrat), sans-serif", fontWeight: 500 }}
              >
                <span className="text-[14px] text-center text-[#2c302e] leading-[20px]">Подробнее обо мне</span>
              </a>
            </div>
          </div>

        </div>
      </div>

      {/* FOR SCREENS 1024px AND LARGER - ORIGINAL FULL LAYOUT */}
      <div className="hidden lg:block absolute inset-0 z-10">
        <div className="w-full h-full flex max-w-8xl mx-auto">
          <div className="w-[53%] flex items-center justify-center">
            <div className="max-w-[768px] w-[768px] relative h-full flex flex-col justify-center md:px-4">
              <h1 
                className="relative mb-8 text-[#2c302e] text-[72px] tracking-[-1.8px] font-medium"
                style={{ fontFamily: "var(--font-cormorant), Georgia, serif", lineHeight: "1.1" }}
              >
                Психолог-психотерапевт
              </h1>

              <p 
                className="relative max-w-[680px] mb-12 text-[24px] text-[rgba(44,48,46,0.82)] font-light"
                style={{ fontFamily: "var(--font-cormorant), Georgia, serif", lineHeight: "1.4" }}
              >
                Психотерапевт – это как проводник, который помогает вам найти свой собственный путь к решению проблем. Он не даёт готовых советов, а создаёт безопасное пространство, где вы можете разобраться в своих мыслях и чувствах, понять, что мешает, и найти свои собственные силы для изменений. Главное для меня– это доверие, конфиденциальность и вера в то, что вы сами способны справиться, просто иногда нужна помощь, чтобы это осознать.
              </p>

              <div className="relative flex flex-row gap-[14px]">
                <a
                  href="#contact"
                  className="bg-[#4a5b49] hover:bg-[#3f4f3f] transition-all duration-300 ease-out transform hover:translate-y-[-2px] border border-[#e5e2dc] h-[56px] items-center justify-center min-h-[40px] px-[20px] rounded-full shadow-[0px_10px_15px_-3px_rgba(74,91,73,0.22),0px_4px_6px_-4px_rgba(74,91,73,0.22)] hover:shadow-[0px_14px_20px_-3px_rgba(74,91,73,0.32),0px_6px_8px_-4px_rgba(74,91,73,0.24)] cursor-pointer flex-none inline-flex"
                  style={{ fontFamily: "var(--font-montserrat), sans-serif", fontWeight: 500 }}
                >
                  <span className="text-[16px] text-center text-white leading-[24px]">Записаться на консультацию</span>
                </a>

                <a
                  href="#about"
                  className="bg-transparent hover:bg-[rgba(108,123,107,0.05)] transition-all duration-300 ease-out transform hover:translate-y-[-2px] border hover:border-[rgba(108,123,107,0.4)] border-[rgba(108,123,107,0.2)] h-[56px] items-center justify-center min-h-[40px] px-[20px] rounded-full shadow-[0px_1px_2px_0px_rgba(0,0,0,0.05)] hover:shadow-[0px_4px_8px_0px_rgba(0,0,0,0.08)] cursor-pointer flex-none inline-flex"
                  style={{ fontFamily: "var(--font-montserrat), sans-serif", fontWeight: 500 }}
                >
                  <span className="text-[16px] text-center text-[#2c302e] leading-[24px]">Подробнее обо мне</span>
                </a>
              </div>
            </div>
          </div>

          <div className="w-1/2 h-[1080px] relative">
            <Image
              alt="Анна Почебыт" 
              src={imgMainPhoto}
              fill
              sizes="50vw"
              quality={70}
              loading="lazy"
              className="absolute inset-0 max-w-none object-cover pointer-events-none w-full h-full"
            />
          </div>
        </div>
      </div>
     </div>

    </section>
  );
}