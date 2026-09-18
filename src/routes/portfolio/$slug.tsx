import { createFileRoute, Link } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";
import { ArrowLeft, ArrowUpRight } from "lucide-react";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { FixedBackButton } from "@/components/site/FixedBackButton";
import { ProjectCard } from "@/components/site/ProjectCard";
import { getProjectBySlug, PROJECTS, type Project, type ProjectSpecs } from "@/data/projects";
import { WHATSAPP_URL } from "@/data/site";
import { useAnimationLevel } from "@/hooks/use-animation-level";
import ptPortfolio from "@/i18n/locales/pt/portfolio.json";

export const Route = createFileRoute("/portfolio/$slug")({
  // Meta de SEO fixo em português — não reativo à troca de idioma (é
  // calculado fora do ciclo de render do React). O conteúdo visível da
  // página, esse sim, é traduzido pelo componente abaixo via i18n. Usamos o
  // texto em pt aqui (ptPortfolio) só pra manter a meta com o mesmo teor do
  // conteúdo padrão do site.
  head: ({ params }) => {
    const project = getProjectBySlug(params.slug);
    const projectPt = project
      ? (ptPortfolio.projects as Record<string, { shortDescription: string }>)[project.slug]
      : undefined;
    const title = project ? `${project.title} | Portfólio All Frames Technology` : "Projeto não encontrado";
    return {
      meta: [
        { title },
        ...(projectPt ? [{ name: "description", content: projectPt.shortDescription }] : []),
      ],
    };
  },
  component: ProjectDetailPage,
});

function ProjectDetailPage() {
  const { t } = useTranslation("portfolio");
  const { slug } = Route.useParams();
  const project = getProjectBySlug(slug);
  // "Nenhuma"/"Reduzidas" em Configurações > Animações também corta o
  // autoplay do vídeo do banner — mostra o poster estático no lugar (menos
  // dado baixado, sem loop de movimento pra quem pediu menos animação).
  const { isReducedOrNone } = useAnimationLevel();

  if (!project) {
    return <ProjectNotFound slug={slug} />;
  }

  const specLabels = t("detail.specLabels", { returnObjects: true }) as Record<
    keyof ProjectSpecs,
    string
  >;
  const specValues = t(`projects.${project.slug}.specs`, { returnObjects: true }) as Partial<
    Record<keyof ProjectSpecs, string>
  >;
  const specEntries = project.specKeys.filter((key) => specValues[key]);
  const gallery = project.gallery ?? [];
  const related = PROJECTS.filter((p) => p.slug !== project.slug).slice(0, 3);
  // "Foto de capa do projeto" no CMS — mesmo campo opcional lido em
  // ProjectCard.tsx; aqui também serve de poster do banner (foto ou vídeo).
  const coverImage = t(`projects.${project.slug}.coverImage`, { defaultValue: "" }) || project.cover;

  return (
    <div className="min-h-screen bg-background">
      <Header />
      {/* Botão "Portfólio" fixo — some enquanto o banner (id="project-hero")
          está visível (o link normal dentro dele já cobre esse momento) e só
          aparece, com fundo opaco, depois que o banner sai da tela. Mesmo
          padrão usado em /portfolio, ver FixedBackButton.tsx. */}
      <FixedBackButton targetId="project-hero" to="/portfolio" label={t("detail.backLabel")} />
      <main>
        {/* hero banner */}
        <section id="project-hero" className="relative overflow-hidden">
          <div className="relative aspect-[4/3] w-full overflow-hidden sm:aspect-[16/9] lg:aspect-[21/9]">
            {project.video && !isReducedOrNone ? (
              <video
                src={project.video}
                poster={project.videoPoster ?? coverImage}
                autoPlay
                muted
                loop
                playsInline
                preload="auto"
                className="absolute inset-0 size-full object-cover"
              />
            ) : (
              <img
                src={project.videoPoster ?? coverImage}
                alt={`${project.title}, ${project.category}`}
                fetchPriority="high"
                decoding="async"
                className="absolute inset-0 size-full object-cover"
              />
            )}
            {/* fixed dark overlay so the white title/breadcrumb stay readable over any photo, regardless of site theme */}
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-black/10" />
            <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-transparent" />

            <div className="absolute inset-x-0 top-0 mx-auto flex max-w-[1600px] items-center justify-between px-6 pt-28 lg:px-14 md:pt-32">
              <Link
                to="/portfolio"
                className="group inline-flex items-center gap-2 text-[12px] font-semibold tracking-[0.12em] text-white/80 uppercase transition-colors hover:text-white"
              >
                <ArrowLeft className="size-3.5 transition-transform group-hover:-translate-x-0.5" />
                {t("detail.backLabel")}
              </Link>
              <span className="rounded-md border border-white/20 bg-black/30 px-2.5 py-1 text-[10px] font-semibold tracking-[0.14em] text-white/80 uppercase backdrop-blur-sm">
                {project.category}
              </span>
            </div>

            <div className="absolute inset-x-0 bottom-0 mx-auto max-w-[1600px] px-6 pb-10 lg:px-14 md:pb-14">
              <span className="font-mono text-[11px] tracking-[0.15em] text-white/60">
                PROJECT {project.id}
              </span>
              <h1 className="display mt-2 text-4xl text-white md:text-6xl">{project.title}</h1>
            </div>
          </div>
        </section>

        {/* content */}
        <section className="mx-auto max-w-[1600px] px-6 py-14 lg:px-14 md:py-20">
          <div className="grid gap-12 lg:grid-cols-[1fr_320px] lg:gap-16">
            <div className="max-w-2xl">
              <span className="eyebrow">{t("detail.projectEyebrow")}</span>
              <p className="display mt-4 text-xl leading-snug md:text-2xl">
                {t(`projects.${project.slug}.objective`)}
              </p>
              <p className="mt-6 text-[15px] leading-relaxed text-foreground/80">
                {t(`projects.${project.slug}.description`)}
              </p>
            </div>

            {specEntries.length > 0 && (
              <aside className="h-fit rounded-md border border-border/70 bg-surface/40 p-6">
                <span className="eyebrow">{t("detail.specsEyebrow")}</span>
                <dl className="mt-5 divide-y divide-border/70">
                  {specEntries.map((key) => (
                    <div key={key} className="flex items-baseline justify-between gap-4 py-3 first:pt-0 last:pb-0">
                      <dt className="text-[10.5px] tracking-[0.14em] text-muted-foreground uppercase">
                        {specLabels[key]}
                      </dt>
                      <dd className="text-right text-[13px] font-medium text-foreground">
                        {specValues[key]}
                      </dd>
                    </div>
                  ))}
                </dl>
                {project.placeholder && (
                  <p className="mt-5 border-t border-border/70 pt-4 text-[10.5px] leading-relaxed text-muted-foreground/60">
                    {t("detail.specsDisclaimer")}
                  </p>
                )}
              </aside>
            )}
          </div>

          {gallery.length > 0 && (
            <div className="mt-16 border-t border-border pt-12">
              <span className="eyebrow">{t("detail.galleryEyebrow")}</span>
              <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {gallery.map((src, i) => (
                  <div
                    key={i}
                    className="aspect-[4/5] overflow-hidden rounded-md border border-border/70 bg-surface"
                  >
                    <img
                      src={src}
                      alt={`${project.title}, detalhe ${i + 1}`}
                      loading="lazy"
                      decoding="async"
                      className="size-full object-cover"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}
        </section>

        {/* other projects */}
        {related.length > 0 && (
          <section className="border-t border-border">
            <div className="mx-auto max-w-[1600px] px-6 py-14 lg:px-14 md:py-20">
              <span className="eyebrow">{t("detail.otherProjectsEyebrow")}</span>
              <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 lg:gap-6">
                {related.map((p) => (
                  <ProjectCard key={p.slug} project={p} />
                ))}
              </div>
            </div>
          </section>
        )}

        {/* CTA */}
        <section className="border-t border-border">
          <div className="mx-auto flex max-w-[1600px] flex-col items-start justify-between gap-6 px-6 py-16 lg:px-14 md:py-20 sm:flex-row sm:items-center">
            <div>
              <span className="eyebrow">{t("detail.ctaEyebrow")}</span>
              <p className="display mt-3 max-w-md text-2xl md:text-3xl">
                {t("detail.ctaTitle")}
              </p>
            </div>
            <a
              href={WHATSAPP_URL}
              target="_blank"
              rel="noreferrer"
              className="group inline-flex w-full items-center justify-center gap-3 rounded-md bg-foreground px-6 py-4 text-[12px] font-bold tracking-[0.14em] text-background uppercase shadow-[0_8px_40px_-8px] shadow-black/30 transition-all hover:shadow-black/40 sm:w-auto sm:justify-start sm:gap-4"
            >
              {t("detail.ctaButton")}
              <ArrowUpRight className="size-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </a>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}

function ProjectNotFound({ slug }: { slug: string }) {
  const { t } = useTranslation("portfolio");
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="mx-auto flex min-h-[60vh] max-w-[1600px] flex-col items-center justify-center px-6 py-32 text-center">
        <span className="eyebrow">{t("detail.notFound.eyebrow")}</span>
        <h1 className="display mt-4 text-3xl md:text-5xl">{t("detail.notFound.title")}</h1>
        <p className="mt-4 max-w-sm text-[14px] leading-relaxed text-muted-foreground">
          {t("detail.notFound.text", { slug })}
        </p>
        <Link
          to="/portfolio"
          className="group mt-8 inline-flex items-center gap-2 text-[12px] font-semibold tracking-[0.14em] text-foreground uppercase transition-colors hover:text-muted-foreground"
        >
          <ArrowLeft className="size-3.5 transition-transform group-hover:-translate-x-0.5" />
          {t("detail.notFound.backLink")}
        </Link>
      </main>
      <Footer />
    </div>
  );
}
