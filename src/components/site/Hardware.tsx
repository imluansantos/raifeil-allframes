import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { SiteTexture } from "@/components/site/SiteTexture";
import { SectionFade } from "@/components/site/SectionFade";
import intelLogo from "@/assets/intel.webp";
import amdLogo from "@/assets/amd.webp";
import nvidiaLogo from "@/assets/nvidia.webp";
import asusLogo from "@/assets/asus.webp";
import corsairLogo from "@/assets/corsair.webp";
import kingstonLogo from "@/assets/kingston.webp";
import samsungLogo from "@/assets/samsung.webp";
import msiLogo from "@/assets/msi.webp";

const LOGOS = [
  { name: "Intel", src: intelLogo },
  { name: "AMD", src: amdLogo },
  { name: "NVIDIA", src: nvidiaLogo },
  { name: "ASUS", src: asusLogo },
  { name: "Corsair", src: corsairLogo },
  { name: "Kingston", src: kingstonLogo },
  { name: "Samsung", src: samsungLogo },
  { name: "MSI", src: msiLogo },
];

export function Hardware() {
  const { t } = useTranslation("hardware");
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
      { threshold: 0.2 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative overflow-hidden border-y border-border bg-background py-14 md:py-16"
    >
      <style>{`
        @keyframes hwDrawLine {
          from { transform: scaleY(0); }
          to { transform: scaleY(1); }
        }
        @keyframes logoLoopScroll {
          from { transform: translate3d(0, 0, 0); }
          to { transform: translate3d(-33.3333%, 0, 0); }
        }
        .logo-loop-track {
          animation: logoLoopScroll 24s linear infinite;
          will-change: transform;
          backface-visibility: hidden;
          transform: translate3d(0, 0, 0);
        }
        /* only pause on hover for pointers that actually hover — prevents a mobile tap
           from leaving the track "stuck" paused, which read as a random freeze */
        @media (hover: hover) and (pointer: fine) {
          .logo-loop-wrap:hover .logo-loop-track {
            animation-play-state: paused;
          }
        }
        @media (prefers-reduced-motion: reduce) {
          .logo-loop-track { animation: none; }
        }
      `}</style>

      {/* background padrão do site — grid técnico + grain */}
      <SiteTexture />

      {/* degradê das divisas com as seções vizinhas — a de baixo é mesmo
          tier (cinza chumbo); a de cima entra vindo de outro tier (preto),
          mas ainda suaviza o grid bem no início antes da troca de cor */}
      <SectionFade side="top" />
      <SectionFade side="bottom" />

      <div className="mx-auto grid max-w-[1600px] gap-10 px-6 lg:grid-cols-[22rem_1fr] lg:items-center lg:gap-16 lg:px-14">
        <div className="text-veil lg:border-r lg:border-border lg:pr-16">
          <div
            className={`flex items-center gap-3 ${visible ? "reveal-left" : "opacity-0"}`}
            style={{ animationDelay: "0ms" }}
          >
            <span
              className="h-3 w-px origin-top bg-foreground"
              style={
                visible
                  ? { animation: "hwDrawLine 0.6s 0.2s cubic-bezier(0.16,1,0.3,1) both" }
                  : undefined
              }
            />
            <span className="eyebrow">{t("eyebrow")}</span>
          </div>

          <h3
            className={`display mt-4 text-2xl text-foreground md:text-3xl ${visible ? "reveal-left" : "opacity-0"}`}
            style={{ animationDelay: "80ms" }}
          >
            {t("title")}
          </h3>

          <p
            className={`mt-4 text-[15px] leading-relaxed text-foreground/85 ${visible ? "reveal-left" : "opacity-0"}`}
            style={{ animationDelay: "160ms" }}
          >
            {t("subtitle")}
          </p>
        </div>

        {/* mobile: static grid — every brand visible immediately, no marquee timing to wait on */}
        <div
          className={`grid grid-cols-4 gap-x-3 gap-y-6 md:hidden ${visible ? "reveal-left" : "opacity-0"}`}
          style={{ animationDelay: "240ms" }}
        >
          {LOGOS.map((logo) => (
            <div key={logo.name} className="flex h-7 items-center justify-center">
              <img
                src={logo.src}
                alt={logo.name}
                loading="eager"
                decoding="async"
                className="h-full w-full object-contain opacity-75"
                style={{ filter: "brightness(0) invert(var(--logo-invert))" }}
                draggable={false}
              />
            </div>
          ))}
        </div>

        {/* desktop: continuous logo marquee — fade nas bordas, pausa no hover (mouse only), tripled for seamless tiling */}
        <div
          className={`logo-loop-wrap relative hidden overflow-hidden py-4 md:block ${visible ? "reveal-left" : "opacity-0"}`}
          style={{
            animationDelay: "240ms",
            maskImage:
              "linear-gradient(to right, transparent, black 12%, black 88%, transparent)",
            WebkitMaskImage:
              "linear-gradient(to right, transparent, black 12%, black 88%, transparent)",
          }}
        >
          <div className="logo-loop-track flex w-max items-center gap-16">
            {[...LOGOS, ...LOGOS, ...LOGOS].map((logo, i) => (
              <div
                key={`${logo.name}-${i}`}
                className="flex h-10 w-[7rem] shrink-0 items-center justify-center"
              >
                <img
                  src={logo.src}
                  alt={logo.name}
                  loading="eager"
                  decoding="async"
                  className="h-full w-full object-contain opacity-75 transition-all duration-300 ease-out hover:scale-110 hover:opacity-100"
                  style={{ filter: "brightness(0) invert(var(--logo-invert))" }}
                  draggable={false}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}