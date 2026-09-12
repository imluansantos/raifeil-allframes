import { useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";
import { ArrowLeft } from "lucide-react";
import { PROJECTS, PROJECT_CATEGORIES } from "@/data/projects";
import storefront from "@/assets/frentedaloja.webp";

function useCountUp(target: number, durationMs = 1100) {
  const [value, setValue] = useState(0);

  useEffect(() => {
    const prefersReduced =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (prefersReduced) {
      setValue(target);
      return;
    }

    let raf: number;
    const start = performance.now();

    const tick = (now: number) => {
      const progress = Math.min((now - start) / durationMs, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setValue(Math.round(eased * target));
      if (progress < 1) raf = requestAnimationFrame(tick);
    };

    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [target, durationMs]);

  return value;
}

export function PortfolioHero() {
  const { t } = useTranslation("portfolio");
  const projectCount = useCountUp(PROJECTS.length);
  const categoryCount = useCountUp(PROJECT_CATEGORIES.length, 900);

  return (
    // id="portfolio-hero" — usado pelo PortfolioBackButton.tsx (renderizado
    // fora daqui, em routes/portfolio/index.tsx) pra saber quando este bloco
    // (com a foto de fundo) sai da tela e o botão fixo com fundo opaco deve
    // aparecer no lugar do botão normal abaixo.
    <section
      id="portfolio-hero"
      // portfolio-hero-scope: fixa este banner sempre no tom escuro (foto +
      // véu preto), mesmo com o site inteiro no modo claro — decisão sua,
      // ver styles.css pra a explicação completa.
      className="portfolio-hero-scope relative overflow-hidden border-b border-border"
    >
      <style>{`
        @keyframes pfHeroDrawLine {
          from { transform: scaleY(0); }
          to { transform: scaleY(1); }
        }
        @keyframes pfGlowDrift {
          0%, 100% { transform: translate(0, 0) scale(1); }
          50% { transform: translate(4%, 3%) scale(1.1); }
        }
      `}</style>

      {/* `isolate` de propósito — sem isso, as camadas de fundo com -z
          acabam escapando pra trás do bg-background opaco do wrapper em
          routes/portfolio (mesmo bug/mesma correção do 404: ver
          8bit-not-found1.tsx). */}
      <div className="relative isolate">
        {/* camada sólida preta, atrás de tudo — garante que este banner
            nunca fique claro em lugar nenhum (nem numa borda/canto sem
            cobertura da foto ou do véu), em qualquer tema do site. */}
        <div aria-hidden className="pointer-events-none absolute inset-0 -z-30 bg-black" />

        {/* foto real da fachada da loja (mesmo arquivo do Hero da home) — bem
            escurecida e discreta, só pra não deixar o topo do portfólio sem
            nenhum fundo. O grid técnico logo abaixo continua por cima dela,
            então ela nunca disputa atenção com o título/conteúdo. */}
        <img
          src={storefront}
          alt=""
          aria-hidden
          draggable={false}
          className="pointer-events-none absolute inset-0 -z-20 size-full object-cover object-[50%_28%] opacity-[0.22] blur-[1px]"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 -z-20"
          style={{
            // var(--portfolio-hero-overlay) — preto no tema escuro, branco no
            // claro (ver styles.css). Antes era um gradiente preto fixo, que
            // sobrava como uma caixa cinza lavada quando o site inteiro está
            // no modo claro (.light).
            background: "var(--portfolio-hero-overlay)",
          }}
        />

        {/* faint technical grid — same background language used on Serviços e Diferenciais */}
        <div
          className="pointer-events-none absolute inset-0 -z-10 opacity-[0.05]"
          style={{
            backgroundImage:
              "linear-gradient(theme(colors.foreground/60%) 1px, transparent 1px), linear-gradient(to right, theme(colors.foreground/60%) 1px, transparent 1px)",
            backgroundSize: "56px 56px",
            maskImage: "radial-gradient(ellipse 70% 60% at 20% 20%, black 30%, transparent 90%)",
            WebkitMaskImage: "radial-gradient(ellipse 70% 60% at 20% 20%, black 30%, transparent 90%)",
          }}
        />
        {/* glow-drift: classe usada só como gancho pra config de Animações
            (styles.css, .motion-reduced) desligar esse loop contínuo sem
            precisar duplicar a regra aqui. */}
        <div
          className="glow-drift pointer-events-none absolute -top-24 -left-24 -z-10 size-[36rem] rounded-full bg-foreground/[0.04] blur-[130px]"
          style={{ animation: "pfGlowDrift 18s ease-in-out infinite" }}
        />

        <div className="absolute top-10 right-6 hidden size-16 border-t border-r border-foreground/20 lg:block lg:right-14" />

        <div className="mx-auto max-w-[1600px] px-6 pt-28 pb-12 lg:px-14 md:pt-36 md:pb-16">
          {/* Botão "Início" normal, dentro do fluxo do conteúdo — rola junto
              com a página como qualquer outro texto da hero (não é fixed).
              Quando esse bloco inteiro sai da tela, o PortfolioBackButton.tsx
              (fixo, com fundo opaco) assume o lugar dele — ver esse arquivo. */}
          <Link
            to="/"
            // text-foreground (não text-white fixo) — antes ficava invisível
            // em cima do fundo claro no tema .light, já que --foreground já
            // inverte sozinho pra escuro nesse tema.
            className="reveal-left group mb-4 inline-flex items-center gap-2 text-[12px] font-semibold tracking-[0.12em] text-foreground/80 uppercase transition-colors hover:text-foreground"
            style={{ animationDelay: "0ms" }}
          >
            <ArrowLeft className="size-3.5 transition-transform group-hover:-translate-x-0.5" />
            {t("hero.backLabel")}
          </Link>

          <div className="reveal-left flex items-center gap-3" style={{ animationDelay: "40ms" }}>
            <span
              className="h-3 w-px origin-top bg-foreground"
              style={{ animation: "pfHeroDrawLine 0.6s 0.2s cubic-bezier(0.16,1,0.3,1) both" }}
            />
            <span className="eyebrow">{t("hero.eyebrow")}</span>
          </div>

          <h1
            // text-foreground explícito — sem isso o título herdava a cor do
            // <body> (que segue o tema GLOBAL do site, não o
            // portfolio-hero-scope daqui), então no modo claro ficava cinza-
            // escuro sobre o fundo escuro deste banner, quase ilegível.
            className="reveal-left display mt-4 text-foreground text-[clamp(2rem,6vw,3.5rem)] leading-[0.95]"
            style={{ animationDelay: "80ms" }}
          >
            {t("hero.title")}
          </h1>

          <p
            className="reveal-left mt-4 max-w-lg text-[14px] leading-relaxed text-muted-foreground md:text-[15px]"
            style={{ animationDelay: "180ms" }}
          >
            {t("hero.subtitle")}
          </p>

          <div
            // `w-fit` — antes o border-t ia até a largura toda do container
            // (bem além do texto), formando uma linha enorme sem necessidade.
            // Agora ela termina exatamente onde o conteúdo (os 2 números)
            // termina.
            className="reveal-left mt-6 flex w-fit flex-wrap items-center gap-x-8 gap-y-3 border-t border-border pt-4"
            style={{ animationDelay: "260ms" }}
          >
            <span className="flex items-baseline gap-2 tabular-nums">
              <span className="text-xl font-bold tracking-[-0.03em] text-foreground md:text-2xl">
                {projectCount}
              </span>
              <span className="text-[11px] tracking-[0.18em] text-muted-foreground uppercase">
                {t("hero.statsProjects")}
              </span>
            </span>
            <span className="flex items-baseline gap-2 tabular-nums">
              <span className="text-xl font-bold tracking-[-0.03em] text-foreground md:text-2xl">
                {categoryCount}
              </span>
              <span className="text-[11px] tracking-[0.18em] text-muted-foreground uppercase">
                {t("hero.statsCategories")}
              </span>
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
