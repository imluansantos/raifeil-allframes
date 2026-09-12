import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import type { Project } from "@/data/projects";
import { ProjectCard } from "@/components/site/ProjectCard";

export function PortfolioGrid({ projects }: { projects: Project[] }) {
  const { t } = useTranslation("portfolio");
  const gridRef = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = gridRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          setVisible(true);
          io.disconnect();
        }
      },
      { threshold: 0.05 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  if (projects.length === 0) {
    return (
      <p className="py-16 text-center text-[13px] text-muted-foreground">
        {t("grid.empty")}
      </p>
    );
  }

  return (
    // grid uniforme (mesma proporção pra todo mundo) em vez do "bento" antigo
    // (card largo a cada 3 + retrato/quadrado alternando) — aquele ritmo
    // ficava bagunçado assim que o filtro de categoria mudava a ordem/
    // quantidade dos cards. 2 colunas no mobile, 3 a partir do desktop;
    // gaps mais curtos (gap-3/gap-4) pra ficar mais compacto que antes.
    <div ref={gridRef} className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-3">
      {projects.map((project, i) => (
        <ProjectCard
          key={project.slug}
          project={project}
          aspectClassName="aspect-[4/5]"
          visible={visible}
          delay={Math.min(i, 8) * 60}
        />
      ))}
    </div>
  );
}
