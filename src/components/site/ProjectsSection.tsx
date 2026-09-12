import { useEffect, useRef, useState } from "react";
import { Link } from "@tanstack/react-router";
import { ArrowUpRight } from "lucide-react";
import { useTranslation } from "react-i18next";
import { getFeaturedProjects, PROJECTS } from "@/data/projects";
import { ProjectCard } from "@/components/site/ProjectCard";
import { SectionFade } from "@/components/site/SectionFade";

export function ProjectsSection() {
  const { t } = useTranslation("projectsSection");
  const sectionRef = useRef<HTMLElement>(null);
  const [visible, setVisible] = useState(false);
  const featured = getFeaturedProjects();

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
    <section id="projetos" ref={sectionRef} className="relative border-t border-border">
      {/* degradê das divisas com as seções vizinhas — a de cima é mesmo tier
          (preto); a de baixo entra numa seção de outro tier (cinza chumbo),
          mas ainda suaviza o grid bem no fim antes da troca de cor */}
      <SectionFade side="top" />
      <SectionFade side="bottom" />
      <div className="mx-auto max-w-[1600px] px-6 py-16 lg:px-14 md:py-20">
      <div className="max-w-xl text-veil">
        <div className={`flex items-center gap-3 ${visible ? "reveal-left" : "opacity-0"}`}>
          <span className="h-3 w-px origin-top bg-foreground" aria-hidden />
          <span className="eyebrow">{t("eyebrow")}</span>
        </div>
        <h2
          className={`display mt-4 max-w-[16ch] text-3xl md:text-5xl ${visible ? "reveal-left" : "opacity-0"}`}
          style={{ animationDelay: "60ms" }}
        >
          {t("title")}
        </h2>
        <p
          className={`mt-4 max-w-md text-[14px] leading-relaxed text-muted-foreground ${visible ? "reveal-left" : "opacity-0"}`}
          style={{ animationDelay: "120ms" }}
        >
          {t("subtitle")}
        </p>
      </div>

      {/* 1 destaque grande + 2 empilhados — evita a grade 3x3 óbvia */}
      <div className="mt-10 grid grid-cols-1 gap-5 lg:grid-cols-2 lg:gap-6">
        {featured[0] && (
          <ProjectCard
            project={featured[0]}
            aspectClassName="aspect-[4/5] lg:aspect-auto lg:h-full"
            className="lg:row-span-2"
            showDescription
            visible={visible}
            delay={160}
          />
        )}
        {featured[1] && (
          <ProjectCard project={featured[1]} aspectClassName="aspect-[16/11]" visible={visible} delay={240} />
        )}
        {featured[2] && (
          <ProjectCard project={featured[2]} aspectClassName="aspect-[16/11]" visible={visible} delay={320} />
        )}
      </div>

      {/* CTA — transição pro portfólio completo */}
      <div
        className={`mt-10 flex flex-col items-start justify-between gap-6 pt-8 sm:flex-row sm:items-center ${visible ? "reveal-left" : "opacity-0"}`}
        style={{ animationDelay: "380ms" }}
      >
        <p className="max-w-sm text-[13px] leading-relaxed text-muted-foreground">
          {t("ctaText")}
        </p>
        <Link
          to="/portfolio"
          className="group inline-flex w-full items-center justify-between gap-6 rounded-full border border-foreground bg-transparent px-6 py-4 text-[12px] font-bold tracking-[0.14em] text-foreground uppercase transition-all hover:bg-foreground hover:text-background hover:shadow-[0_4px_24px_-6px] hover:shadow-black/40 sm:w-auto"
        >
          {t("exploreLink")}
          <span className="flex items-center gap-2">
            <span className="font-mono text-[11px] font-normal tracking-normal text-muted-foreground normal-case group-hover:text-background/70">
              {t("projectsCount", { count: PROJECTS.length })}
            </span>
            <ArrowUpRight className="size-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </span>
        </Link>
      </div>
      </div>
    </section>
  );
}
