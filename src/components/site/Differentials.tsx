import { useEffect, useId, useRef, useState } from "react";
import type { LucideIcon } from "lucide-react";
import { ArrowRightLeft, Cable, Cpu, Infinity as InfinityIcon, MapPin, MessageCircle } from "lucide-react";
import { useTranslation } from "react-i18next";
import { SiteTexture } from "@/components/site/SiteTexture";
import { SectionFade } from "@/components/site/SectionFade";

/* =========================================================================
 * Seção Diferenciais.
 *
 * Grade estática de 6 cards, um por diferencial, dentro de um único grid
 * dividido por linhas tracejadas. Porte fiel do componente de referência
 * enviado pelo cliente (grid-feature-cards, 21st.dev / Efferd UI):
 * https://21st.dev/@efferd/components/grid-feature-cards
 * ========================================================================= */

// `key` bate com src/i18n/locales/<idioma>/differentials.json → cards[] —
// título e descrição de cada card agora vêm traduzidos de lá (ver
// OverviewFeatureCard, que faz t(`cards.${key}.title/description`)); ícone e
// numeração continuam fixos aqui (não são texto, não precisam de tradução).
type OverviewCard = { key: string; number: string; icon: LucideIcon };

const OVERVIEW_CARDS: OverviewCard[] = [
  { key: "uso-real", number: "01", icon: Cpu },
  { key: "orcamento", number: "02", icon: ArrowRightLeft },
  { key: "cabos", number: "03", icon: Cable },
  { key: "pos-entrega", number: "04", icon: InfinityIcon },
  { key: "presencial", number: "05", icon: MapPin },
  { key: "whatsapp", number: "06", icon: MessageCircle },
];

/* Porte fiel do componente de referência (grid-feature-cards, 21st.dev /
   Efferd UI): grade de fundo desenhada em SVG (não um radial-gradient de
   pontos) com alguns quadrados "acesos" em posições aleatórias, ícone fino
   (strokeWidth 1) e título/descrição enxutos. */
function OverviewGridPattern({ squares }: { squares: number[][] }) {
  const patternId = useId();
  const cell = 20;
  return (
    <svg aria-hidden="true" className="pointer-events-none absolute inset-0 h-full w-full fill-foreground/5 stroke-foreground/25 mix-blend-overlay">
      <defs>
        <pattern id={patternId} width={cell} height={cell} patternUnits="userSpaceOnUse" x="-12" y="4">
          <path d={`M.5 ${cell}V.5H${cell}`} fill="none" />
        </pattern>
      </defs>
      <rect width="100%" height="100%" strokeWidth={0} fill={`url(#${patternId})`} />
      <svg x="-12" y="4" className="overflow-visible">
        {squares.map(([sx, sy], index) => (
          <rect strokeWidth="0" key={index} width={cell + 1} height={cell + 1} x={(sx ?? 0) * cell} y={(sy ?? 0) * cell} />
        ))}
      </svg>
    </svg>
  );
}

function genOverviewSquares(length = 5): number[][] {
  return Array.from({ length }, () => [
    Math.floor(Math.random() * 4) + 7, // x aleatório entre 7 e 10
    Math.floor(Math.random() * 6) + 1, // y aleatório entre 1 e 6
  ]);
}

function OverviewFeatureCard({
  card,
  index,
  borderClassName,
}: {
  card: OverviewCard;
  index: number;
  borderClassName: string;
}) {
  const { t } = useTranslation("differentials");
  const Icon = card.icon;
  // computado uma vez (lazy init) pra não sortear um padrão novo a cada
  // re-render do Differentials
  const [squares] = useState(() => genOverviewSquares());

  return (
    <div
      className={`pd-card-in group relative overflow-hidden p-6 ${borderClassName}`}
      style={{ animationDelay: `${240 + index * 70}ms` }}
    >
      <div
        className="pointer-events-none absolute top-0 left-1/2 -mt-2 -ml-20 h-full w-full"
        style={{
          maskImage: "linear-gradient(white, transparent)",
          WebkitMaskImage: "linear-gradient(white, transparent)",
        }}
      >
        <div
          className="absolute inset-0 bg-gradient-to-r from-foreground/5 to-foreground/1 opacity-100"
          style={{
            maskImage: "radial-gradient(farthest-side at top, white, transparent)",
            WebkitMaskImage: "radial-gradient(farthest-side at top, white, transparent)",
          }}
        >
          <OverviewGridPattern squares={squares} />
        </div>
      </div>

      {/* efeito hover: brilho suave saindo do canto do ícone, sem mover o
          card (o card faz parte de um grid com divisórias compartilhadas —
          qualquer transform no card quebraria o alinhamento das linhas) */}
      <div
        aria-hidden
        className="pointer-events-none absolute -top-16 -left-16 size-56 rounded-full bg-foreground/[0.07] opacity-0 blur-2xl transition-opacity duration-500 ease-out group-hover:opacity-100"
      />

      <Icon
        className="relative size-6 text-foreground/75 transition-all duration-300 ease-out group-hover:scale-110 group-hover:text-foreground"
        strokeWidth={1}
        aria-hidden
      />
      <p className="relative mt-10 text-sm font-semibold text-foreground md:text-base">
        {t(`cards.${card.key}.title`)}
      </p>
      <p className="relative z-20 mt-2 max-w-[30ch] text-xs font-light text-muted-foreground transition-colors duration-300 group-hover:text-muted-foreground/90">
        {t(`cards.${card.key}.description`)}
      </p>
    </div>
  );
}

export function Differentials() {
  const { t } = useTranslation("differentials");
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
      { threshold: 0.1 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <section
      id="diferenciais"
      ref={sectionRef}
      className="relative overflow-hidden border-y border-border-strong bg-background py-16 md:py-24"
    >
      <style>{`
        @keyframes pdDrawLine {
          from { transform: scaleY(0); }
          to { transform: scaleY(1); }
        }
        @keyframes pdCardIn {
          from { opacity: 0; transform: translateY(14px) scale(0.95); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
        .pd-card-in {
          opacity: 0;
          animation: pdCardIn 0.5s cubic-bezier(0.16,1,0.3,1) both;
        }

        @media (prefers-reduced-motion: reduce) {
          .pd-card-in {
            animation: none !important;
            opacity: 1 !important;
            transform: none !important;
          }
          .pd-card-in * {
            transition: none !important;
          }
        }
      `}</style>

      {/* background padrão do site — grid técnico + grain (mesma receita
          usada em toda seção com fundo de tier próprio) */}
      <SiteTexture />

      {/* degradê das divisas com as seções vizinhas — mesmo tier (cinza chumbo) dos dois lados */}
      <SectionFade side="top" />
      <SectionFade side="bottom" />

      <div className="mx-auto max-w-[1600px] px-6 lg:px-14">
        <div className="max-w-xl text-veil">
          <div className={`flex items-center gap-3 ${visible ? "reveal-left" : "opacity-0"}`} style={{ animationDelay: "0ms" }}>
            <span
              className="h-3 w-px origin-top bg-foreground"
              style={visible ? { animation: "pdDrawLine 0.6s 0.2s cubic-bezier(0.16,1,0.3,1) both" } : undefined}
            />
            <span className="eyebrow">{t("eyebrow")}</span>
          </div>
          <h2
            className={`display mt-4 max-w-[16ch] text-3xl text-foreground md:text-5xl ${visible ? "reveal-left" : "opacity-0"}`}
            style={{ animationDelay: "80ms" }}
          >
            {t("title")}
          </h2>
          <p
            className={`mt-4 max-w-md text-[13.5px] leading-relaxed text-muted-foreground ${visible ? "reveal-left" : "opacity-0"}`}
            style={{ animationDelay: "140ms" }}
          >
            {t("subtitle")}
          </p>
        </div>

        {/* Visão geral — 6 cards estáticos (3 em cima, 3 embaixo), um por
            diferencial. Porte fiel do componente enviado pelo cliente —
            https://21st.dev/@efferd/components/grid-feature-cards */}
        <div
          className={`mt-10 overflow-hidden rounded-2xl border border-dashed border-border md:mt-12 ${visible ? "reveal-left" : "opacity-0"}`}
          style={{ animationDelay: "180ms" }}
        >
          <div className="grid grid-cols-1 sm:grid-cols-3">
            {OVERVIEW_CARDS.map((card, i) => {
              const col = i % 3;
              const row = Math.floor(i / 3);
              // "max-sm:" (só abaixo do breakpoint sm) e "sm:" (só a partir dele)
              // nunca competem pela mesma media query — evita a ambiguidade de
              // ter "border-t" e "border-t-0" no mesmo breakpoint disputando
              // qual vence na folha de estilo gerada.
              const borderClassName = [
                i > 0 ? "max-sm:border-t max-sm:border-dashed max-sm:border-border" : "",
                col > 0 ? "sm:border-l sm:border-dashed sm:border-border" : "",
                row > 0 ? "sm:border-t sm:border-dashed sm:border-border" : "",
              ]
                .filter(Boolean)
                .join(" ");
              return <OverviewFeatureCard key={card.key} card={card} index={i} borderClassName={borderClassName} />;
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
