import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { SERVICE_PAGES } from "@/data/servicePages";
import { SectionFade } from "@/components/site/SectionFade";
import { TiltCard } from "@/components/unlumen-ui/tilt-card";

export function Services() {
  const { t } = useTranslation("services");
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
    <section id="servicos" ref={sectionRef} className="relative border-t border-border">
      {/* degradê das divisas com as seções vizinhas — mesmo tier (preto) dos dois lados */}
      <SectionFade side="top" />
      <SectionFade side="bottom" />

      {/* a borda + o respiro extra no topo marcam de propósito onde a
          página muda de assunto: até aqui era "quem somos" (About Us +
          Equipe), a partir daqui é "o que fazemos". */}
      <div className="mx-auto max-w-[1600px] px-6 pt-16 pb-16 lg:px-14 md:pt-24 md:pb-20">
        <div className="max-w-xl text-veil">
          <div className={`flex items-center gap-3 ${visible ? "reveal-left" : "opacity-0"}`}>
            <span className="h-3 w-px origin-top bg-foreground" aria-hidden />
            <span className="eyebrow">{t("eyebrow")}</span>
          </div>
          <h2
            className={`display mt-4 max-w-[16ch] text-3xl md:text-5xl ${visible ? "reveal-left" : "opacity-0"}`}
            style={{ animationDelay: "80ms" }}
          >
            {t("title")}
          </h2>
          <p
            className={`mt-4 max-w-md text-[14px] leading-relaxed text-muted-foreground ${visible ? "reveal-left" : "opacity-0"}`}
            style={{ animationDelay: "140ms" }}
          >
            {t("subtitle")}
          </p>
        </div>

        {/* grid 2x2 com o componente TiltCard (unlumen-ui,
            https://ui.unlumen.com/components/tilt-card) — substituiu os 4
            cards antigos em coluna única. O grid fica centralizado dentro da
            seção (mx-auto), mas o bloco de texto acima continua alinhado à
            esquerda de propósito — só os cards centralizam. */}
        <div className="mt-10 grid grid-cols-1 gap-8 sm:mx-auto sm:max-w-[1360px] sm:grid-cols-2">
          {SERVICE_PAGES.map((service, i) => (
            <div
              key={service.slug}
              className={visible ? "reveal-left" : "opacity-0"}
              style={{ animationDelay: `${200 + i * 80}ms` }}
            >
              <TiltCard
                title={t(`cards.${service.slug}.title`)}
                description={t(`cards.${service.slug}.lead`)}
                imageSrc={service.image}
                imageAlt=""
                imagePosition={service.imagePosition}
                href={service.path}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
