import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { ArrowUpRight } from "lucide-react";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { PortfolioHero } from "@/components/site/PortfolioHero";
import { PortfolioBackButton } from "@/components/site/PortfolioBackButton";
import { ProjectFilters, type ProjectFilterValue } from "@/components/site/ProjectFilters";
import { PortfolioGrid } from "@/components/site/PortfolioGrid";
import { PROJECTS } from "@/data/projects";
import { WHATSAPP_URL } from "@/data/site";

// Meta de SEO fixo em português — não reativo à troca de idioma (é calculado
// fora do ciclo de render do React). O conteúdo visível da página, esse sim,
// é traduzido pelos componentes abaixo via i18n.
const title = "Portfólio | All Frames Technology";
const description =
  "Projetos de montagem, personalização e upgrade de PCs realizados pela All Frames Technology em Bento Gonçalves/RS.";

export const Route = createFileRoute("/portfolio/")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: PortfolioPage,
});

function PortfolioPage() {
  const { t } = useTranslation("portfolio");
  const [filter, setFilter] = useState<ProjectFilterValue>("all");
  const filtered = filter === "all" ? PROJECTS : PROJECTS.filter((p) => p.category === filter);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      {/* Botão "Início" fixo vive fora da árvore do PortfolioHero de propósito
          (ver PortfolioBackButton.tsx) — evita ficar preso no stacking
          context da hero e sumir atrás de outros elementos da página. */}
      <PortfolioBackButton />
      <main>
        <PortfolioHero />

        <section className="mx-auto max-w-[1600px] px-6 py-10 lg:px-14 md:py-14">
          <ProjectFilters active={filter} onChange={setFilter} />
          <div className="mt-6">
            <PortfolioGrid projects={filtered} />
          </div>
        </section>

        <section className="border-t border-border">
          <div className="mx-auto flex max-w-[1600px] flex-col items-start justify-between gap-6 px-6 py-12 lg:px-14 md:py-16 sm:flex-row sm:items-center">
            <div>
              <span className="eyebrow">{t("index.ctaEyebrow")}</span>
              <p className="display mt-3 max-w-md text-2xl md:text-3xl">
                {t("index.ctaTitle")}
              </p>
            </div>
            <a
              href={WHATSAPP_URL}
              target="_blank"
              rel="noreferrer"
              className="group inline-flex w-full items-center justify-center gap-3 rounded-md bg-foreground px-6 py-4 text-[12px] font-bold tracking-[0.14em] text-background uppercase shadow-[0_8px_40px_-8px] shadow-black/30 transition-all hover:shadow-black/40 sm:w-auto sm:justify-start sm:gap-4"
            >
              {t("index.ctaButton")}
              <ArrowUpRight className="size-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </a>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
