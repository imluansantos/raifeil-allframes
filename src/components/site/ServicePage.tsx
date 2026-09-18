import { useEffect, useRef, useState } from "react";
import { Link } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";
import { ArrowLeft, ArrowRight, ArrowUpRight, CircleCheck } from "lucide-react";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { FixedBackButton } from "@/components/site/FixedBackButton";
import { SERVICE_PAGES, type ServicePageData } from "@/data/servicePages";
import { WHATSAPP_URL } from "@/data/site";

type ServiceHighlight = { title: string; text: string };

// hook local — cada seção da página tem seu próprio observer (não dá pra
// reaproveitar um só, já que são elementos DOM distintos e cada um deve
// revelar independente conforme entra na tela).
function useSectionReveal(threshold = 0.15) {
  const ref = useRef<HTMLElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          setVisible(true);
          io.disconnect();
        }
      },
      { threshold },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [threshold]);

  return [ref, visible] as const;
}

// Template compartilhado pelas 4 páginas de serviço (src/routes/<slug>.tsx).
// Segue o "esqueleto" da página de detalhe de projeto (portfolio/$slug):
// banner com foto + breadcrumb, conteúdo, seção de cross-link ("outros
// serviços" aqui, "outros projetos" lá) e CTA final. Sem pacote fechado —
// o cliente pede exatamente o que quer, por isso não existe uma lista de
// "o que está incluído": só um panorama geral (esquerda) e uma vitrine do
// que já resolvemos, à la carte (direita).
//
// Todo o texto (chrome compartilhado + conteúdo por serviço) vem de
// i18n/locales/<idioma>/servicePages.json, indexado por service.slug — ver
// src/data/servicePages.ts pros campos estruturais (image/path/number).
export function ServicePage({ service }: { service: ServicePageData }) {
  const { t } = useTranslation("servicePages");
  const others = SERVICE_PAGES.filter((s) => s.slug !== service.slug);

  const title = t(`services.${service.slug}.title`);
  const lead = t(`services.${service.slug}.lead`);
  const description = t(`services.${service.slug}.description`);
  const items = t(`services.${service.slug}.items`, { returnObjects: true }) as string[];
  const highlights = t(`services.${service.slug}.highlights`, {
    returnObjects: true,
  }) as ServiceHighlight[];
  const requestables = t(`services.${service.slug}.requestables`, {
    returnObjects: true,
  }) as string[];
  // "Foto do banner desta página" no CMS — campo opcional, vazio por
  // padrão: sem edição pelo painel, continua usando a imagem fixa de
  // sempre (service.image, de servicePages.ts). Mesmo fallback do Hero e
  // do Sobre Nós.
  const bannerImage = t(`services.${service.slug}.bannerImage`, { defaultValue: "" }) || service.image;

  // banner é o primeiro fold — anima ao montar, sem esperar scroll (mesmo
  // padrão do Hero.tsx/PortfolioHero.tsx). As outras 3 seções ficam abaixo
  // da dobra, então cada uma só revela quando entra na viewport.
  const [contentRef, contentVisible] = useSectionReveal();
  const [othersRef, othersVisible] = useSectionReveal();
  const [ctaRef, ctaVisible] = useSectionReveal(0.2);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      {/* Botão "Início" fixo — some enquanto o banner (id="service-hero")
          está visível (o link "Início" normal dentro dele já cobre esse
          momento) e só aparece, com fundo opaco, depois que o banner sai da
          tela. Mesmo padrão usado em /portfolio, ver FixedBackButton.tsx. */}
      <FixedBackButton targetId="service-hero" to="/" label={t("nav:home")} />
      <main>
        {/* banner */}
        <section id="service-hero" className="relative overflow-hidden">
          <div className="relative aspect-[4/3] w-full overflow-hidden sm:aspect-[16/9] lg:aspect-[21/9]">
            <img
              src={bannerImage}
              alt={title}
              fetchPriority="high"
              decoding="async"
              className="absolute inset-0 size-full object-cover"
              style={service.imagePosition ? { objectPosition: service.imagePosition } : undefined}
            />
            {/* overlay escuro fixo — texto branco legível sobre qualquer foto */}
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-black/10" />
            <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-transparent" />

            <div className="absolute inset-x-0 top-0 mx-auto flex max-w-[1600px] items-center justify-between px-6 pt-28 lg:px-14 md:pt-32">
              <Link
                to="/"
                className="reveal-left group inline-flex items-center gap-2 text-[12px] font-semibold tracking-[0.12em] text-white/80 uppercase transition-colors hover:text-white"
              >
                <ArrowLeft className="size-3.5 transition-transform group-hover:-translate-x-0.5" />
                {t("nav:home")}
              </Link>
              <span
                className="reveal-left rounded-md border border-white/20 bg-black/30 px-2.5 py-1 text-[10px] font-semibold tracking-[0.14em] text-white/80 uppercase backdrop-blur-sm"
                style={{ animationDelay: "80ms" }}
              >
                {t("serviceBadge", { number: service.number })}
              </span>
            </div>

            <div className="absolute inset-x-0 bottom-0 mx-auto max-w-[1600px] px-6 pb-10 lg:px-14 md:pb-14">
              <span
                className="reveal-left block font-mono text-[11px] tracking-[0.15em] text-white/60"
                style={{ animationDelay: "140ms" }}
              >
                {service.number} · {t("aboutServiceEyebrow")}
              </span>
              <h1
                className="reveal-left display mt-2 text-4xl text-white md:text-6xl"
                style={{ animationDelay: "200ms" }}
              >
                {title}
              </h1>
            </div>
          </div>
        </section>

        {/* conteúdo — sem "pacote incluso": o cliente não fecha um combo
            fechado, ele pede exatamente o que precisa. A coluna da esquerda
            dá o panorama geral (puxado dos mesmos itens do card na home);
            a da direita é uma vitrine do que já resolvemos, à la carte. */}
        <section ref={contentRef} className="relative overflow-hidden">
          {/* grade técnica sutil de fundo — mesma linguagem visual do
              banner de portfólio, pra dar um acabamento mais editorial. */}
          <div
            className="pointer-events-none absolute inset-0 -z-10 opacity-[0.04]"
            style={{
              backgroundImage:
                "linear-gradient(theme(colors.foreground/60%) 1px, transparent 1px), linear-gradient(to right, theme(colors.foreground/60%) 1px, transparent 1px)",
              backgroundSize: "56px 56px",
              maskImage: "radial-gradient(ellipse 70% 60% at 80% 0%, black 30%, transparent 90%)",
              WebkitMaskImage: "radial-gradient(ellipse 70% 60% at 80% 0%, black 30%, transparent 90%)",
            }}
          />

          <div className="mx-auto max-w-[1600px] px-6 py-14 lg:px-14 md:py-20">
            <div className={`max-w-2xl ${contentVisible ? "reveal-left" : "opacity-0"}`}>
              <span className="eyebrow">{t("aboutServiceEyebrow")}</span>
              <p className="display mt-4 text-xl leading-snug md:text-2xl">{lead}</p>
              <p className="mt-6 text-[15px] leading-relaxed text-foreground/80">{description}</p>
            </div>

            {/* diferenciais — mantidos como estavam, só reposicionados */}
            <div
              className={`mt-12 grid gap-4 sm:grid-cols-3 ${contentVisible ? "reveal-left" : "opacity-0"}`}
              style={{ animationDelay: "80ms" }}
            >
              {highlights.map((h, i) => (
                <div
                  key={h.title}
                  className="rounded-lg border border-border/70 bg-surface/40 p-6 transition-colors hover:border-border-strong"
                >
                  <span className="font-mono text-[10px] tracking-[0.15em] text-muted-foreground/50">
                    0{i + 1}
                  </span>
                  <h3 className="mt-3 text-[13.5px] font-semibold text-foreground">{h.title}</h3>
                  <p className="mt-2 text-[12.5px] leading-relaxed text-muted-foreground">{h.text}</p>
                </div>
              ))}
            </div>

            {/* visão geral (esquerda) x pedidos à la carte (direita) */}
            <div
              className={`mt-16 grid gap-10 border-t border-border pt-12 lg:grid-cols-2 lg:gap-16 ${contentVisible ? "reveal-left" : "opacity-0"}`}
              style={{ animationDelay: "160ms" }}
            >
              <div>
                <span className="eyebrow">{t("overviewEyebrow")}</span>
                <h3 className="display mt-3 text-xl md:text-2xl">{t("overviewTitle")}</h3>
                <p className="mt-3 max-w-md text-[13.5px] leading-relaxed text-muted-foreground">
                  {t("overviewDescription")}
                </p>
                <ul className="mt-8 space-y-4">
                  {items.map((item) => (
                    <li key={item} className="flex items-start gap-3 text-[13.5px] text-foreground/90">
                      <CircleCheck className="mt-0.5 size-4 shrink-0 text-muted-foreground" aria-hidden />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="rounded-xl border border-border/70 bg-surface/40 p-6 md:p-8">
                <span className="eyebrow">{t("requestablesEyebrow")}</span>
                <p className="mt-3 max-w-md text-[13px] leading-relaxed text-muted-foreground">
                  {t("requestablesDescription")}
                </p>
                <ul className="mt-6 grid grid-cols-1 gap-x-6 gap-y-3.5 sm:grid-cols-2">
                  {requestables.map((r) => (
                    <li key={r} className="flex items-start gap-2 text-[13px] text-foreground/90">
                      <span className="mt-0.5 text-muted-foreground">→</span>
                      {r}
                    </li>
                  ))}
                </ul>
                <a
                  href={WHATSAPP_URL}
                  target="_blank"
                  rel="noreferrer"
                  className="group mt-8 inline-flex w-full items-center justify-center gap-2 rounded-full bg-foreground px-4 py-3.5 text-[11px] font-bold tracking-[0.12em] text-background uppercase shadow-[0_8px_32px_-12px] shadow-black/30 transition-all hover:shadow-black/40"
                >
                  {t("requestablesCta")}
                  <ArrowUpRight className="size-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* outros serviços */}
        <section ref={othersRef} className="border-t border-border">
          <div className="mx-auto max-w-[1600px] px-6 py-14 lg:px-14 md:py-20">
            <span className={`eyebrow ${othersVisible ? "reveal-left" : "opacity-0"}`}>
              {t("otherServicesEyebrow")}
            </span>
            <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 lg:gap-6">
              {others.map((s, i) => (
                <OtherServiceCard
                  key={s.slug}
                  service={s}
                  visible={othersVisible}
                  delay={80 + i * 80}
                />
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section ref={ctaRef} className="border-t border-border">
          <div className="mx-auto flex max-w-[1600px] flex-col items-start justify-between gap-6 px-6 py-16 lg:px-14 md:py-20 sm:flex-row sm:items-center">
            <div className={ctaVisible ? "reveal-left" : "opacity-0"}>
              <span className="eyebrow">{t("ctaEyebrow")}</span>
              <p className="display mt-3 max-w-md text-2xl md:text-3xl">{t("ctaTitle")}</p>
            </div>
            <a
              href={WHATSAPP_URL}
              target="_blank"
              rel="noreferrer"
              className={`group inline-flex w-full items-center justify-center gap-3 rounded-full bg-foreground px-6 py-4 text-[12px] font-bold tracking-[0.14em] text-background uppercase shadow-[0_8px_40px_-8px] shadow-black/30 transition-all hover:shadow-black/40 sm:w-auto sm:justify-start sm:gap-4 ${ctaVisible ? "reveal-left" : "opacity-0"}`}
              style={{ animationDelay: "100ms" }}
            >
              {t("ctaButton")}
              <ArrowUpRight className="size-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </a>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}

function OtherServiceCard({
  service,
  visible = true,
  delay = 0,
}: {
  service: ServicePageData;
  visible?: boolean;
  delay?: number;
}) {
  const { t } = useTranslation("servicePages");
  const title = t(`services.${service.slug}.title`);
  const lead = t(`services.${service.slug}.lead`);
  const bannerImage = t(`services.${service.slug}.bannerImage`, { defaultValue: "" }) || service.image;

  return (
    <div
      className={`group overflow-hidden rounded-xl border border-border bg-surface ${visible ? "reveal-left" : "opacity-0"}`}
      style={{ animationDelay: `${delay}ms` }}
    >
      <div className="aspect-[16/9] overflow-hidden">
        <img
          src={bannerImage}
          alt=""
          loading="lazy"
          decoding="async"
          className="size-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
          style={service.imagePosition ? { objectPosition: service.imagePosition } : undefined}
        />
      </div>

      <div className="p-5">
        <h3 className="text-[15px] font-semibold text-foreground">{title}</h3>
        <p className="mt-2 text-[13px] leading-relaxed text-muted-foreground">{lead}</p>

        <Link
          to={service.path}
          className="mt-5 flex items-center gap-1.5 text-[11px] font-semibold tracking-[0.12em] text-foreground uppercase transition-all duration-300 hover:gap-2.5 hover:text-muted-foreground"
        >
          {t("viewMore")}
          <ArrowRight className="size-3.5 shrink-0" aria-hidden />
        </Link>
      </div>
    </div>
  );
}
