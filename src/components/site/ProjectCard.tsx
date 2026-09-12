import { useRef } from "react";
import { Link } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";
import { ArrowUpRight } from "lucide-react";
import type { Project } from "@/data/projects";

export function ProjectCard({
  project,
  aspectClassName = "aspect-[4/5]",
  showDescription = false,
  delay = 0,
  visible = true,
  className = "",
}: {
  project: Project;
  aspectClassName?: string;
  showDescription?: boolean;
  delay?: number;
  visible?: boolean;
  className?: string;
}) {
  const { t } = useTranslation("portfolio");
  const shortDescription = t(`projects.${project.slug}.shortDescription`);
  const glowRef = useRef<HTMLDivElement>(null);

  const handleMove = (e: React.MouseEvent<HTMLAnchorElement>) => {
    const el = glowRef.current;
    if (!el) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    el.style.background = `radial-gradient(280px circle at ${x}% ${y}%, rgba(255,255,255,0.16), transparent 72%)`;
  };

  const handleLeave = () => {
    const el = glowRef.current;
    if (el) el.style.background = "transparent";
  };

  return (
    <Link
      to="/portfolio/$slug"
      params={{ slug: project.slug }}
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
      className={`group relative block overflow-hidden rounded-md border border-border/70 bg-surface transition-colors duration-300 hover:border-foreground/40 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-foreground ${aspectClassName} ${visible ? "reveal-left" : "opacity-0"} ${className}`}
      style={{
        animationDelay: `${delay}ms`,
        boxShadow: "0 10px 30px -10px rgba(0,0,0,0.8), 0 30px 70px -20px rgba(0,0,0,0.6)",
      }}
    >
      <img
        src={project.cover}
        alt={`${project.title}, ${project.category}`}
        loading="lazy"
        decoding="async"
        style={project.imagePosition ? { objectPosition: project.imagePosition } : undefined}
        className="absolute inset-0 size-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.05]"
      />

      {/* legibility gradient — fixed dark overlay so the white caption text stays readable over any photo, regardless of site theme */}
      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/45 to-black/15" />

      {/* cursor-tracked spotlight */}
      <div ref={glowRef} className="pointer-events-none absolute inset-0 transition-opacity duration-300" />

      {/* glare sweep on hover — same skew-sweep language as the site's primary CTAs */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/10 to-transparent transition-transform duration-700 ease-out group-hover:translate-x-full"
        style={{ transform: "skewX(-20deg)" }}
      />

      {/* corner bracket */}
      <div className="pointer-events-none absolute top-4 right-4 size-6 border-t border-r border-white/0 transition-all duration-300 group-hover:border-white/60" />

      <div className="absolute inset-x-0 top-0 p-4 md:p-5">
        <span className="font-mono text-[10px] tracking-[0.15em] text-white/70">
          {/* "PROJECT" mantido em inglês de propósito — microtipografia técnica
              do design, já era assim mesmo na versão em português original. */}
          PROJECT {project.id}
        </span>
      </div>

      <div className="absolute inset-x-0 bottom-0 p-4 md:p-5">
        <h3 className="display text-lg text-white transition-transform duration-300 group-hover:-translate-y-0.5 sm:text-xl md:text-2xl">
          {project.title}
        </h3>
        {showDescription && (
          <p className="mt-2 hidden max-w-md text-[13px] leading-relaxed text-white/75 sm:block">
            {shortDescription}
          </p>
        )}
        <div className="mt-3 hidden items-center gap-2 text-[11px] font-semibold tracking-[0.14em] text-white uppercase opacity-0 transition-all duration-300 group-hover:translate-x-0.5 group-hover:opacity-100 sm:flex">
          {t("card.viewProject")}
          <ArrowUpRight className="size-3.5" />
        </div>
      </div>
    </Link>
  );
}
