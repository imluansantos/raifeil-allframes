import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { TestimonialsCarousel, TestimonialsMarquee } from "@/components/ui/marquee-01";
import { SiteTexture } from "@/components/site/SiteTexture";
import { SectionFade } from "@/components/site/SectionFade";

export function Testimonials() {
  const { t } = useTranslation("testimonials");
  const sectionRef = useRef<HTMLElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          setVisible(true);
          io.disconnect();
        }
      },
      { threshold: 0.15 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <section
      id="depoimentos"
      ref={sectionRef}
      className="relative overflow-hidden bg-background border-t border-border-strong"
    >
      <style>{`
        @keyframes testiDrawLine {
          from { transform: scaleY(0); }
          to { transform: scaleY(1); }
        }
      `}</style>

      {/* background padrão do site — grid técnico + grain */}
      <SiteTexture />

      {/* degradê das divisas com as seções vizinhas — a de cima é mesmo
          tier (cinza chumbo); a de baixo entra numa seção de outro tier
          (preto), mas ainda suaviza o grid bem no fim antes da troca de cor */}
      <SectionFade side="top" />
      <SectionFade side="bottom" />

      <div className="relative mx-auto max-w-[1600px] px-6 py-20 lg:px-14 md:py-28">
        <div className="max-w-xl text-veil">
          <div
            className={`flex items-center gap-3 ${visible ? "reveal-left" : "opacity-0"}`}
            style={{ animationDelay: "0ms" }}
          >
            <span
              className="h-3 w-px origin-top bg-foreground"
              style={
                visible
                  ? { animation: "testiDrawLine 0.6s 0.2s cubic-bezier(0.16,1,0.3,1) both" }
                  : undefined
              }
            />
            <span className="eyebrow">{t("eyebrow")}</span>
          </div>
          <h2
            className={`display mt-5 max-w-[16ch] text-4xl text-foreground md:text-6xl ${visible ? "reveal-left" : "opacity-0"}`}
            style={{ animationDelay: "80ms" }}
          >
            {t("title")}
          </h2>
        </div>

        <div
          className={`mt-14 ${visible ? "reveal-left" : "opacity-0"}`}
          style={{ animationDelay: "220ms" }}
        >
          <TestimonialsMarquee />
          <TestimonialsCarousel />
        </div>
      </div>
    </section>
  );
}
