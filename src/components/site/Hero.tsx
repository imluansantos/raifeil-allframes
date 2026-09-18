import { useTranslation } from "react-i18next";
import { ArrowUpRight, ChevronDown } from "lucide-react";
import { WHATSAPP_URL, INSTAGRAM } from "@/data/site";
import { ShowcaseMarquee } from "@/components/site/ShowcaseMarquee";
import { SiteTexture } from "@/components/site/SiteTexture";
import { SectionFade } from "@/components/site/SectionFade";
import { scrollToSection } from "@/lib/scrollToSection";
import storefront from "@/assets/frentedaloja.webp";

export function Hero() {
  const { t } = useTranslation("hero");
  // "Foto de fundo do banner principal" no CMS (Início > backgroundImage) —
  // campo opcional (required: false em config.yml): vazio por padrão, então
  // sem ninguém trocar nada pelo painel o site continua usando exatamente a
  // mesma foto de sempre (storefront, importada acima). Assim que o admin
  // subir uma foto ali, ela passa a ganhar prioridade — mesmo padrão já
  // usado pelas fotos da equipe em Team.tsx.
  const customBackground = t("backgroundImage", { defaultValue: "" });
  return (
    <section id="top" className="relative overflow-hidden bg-background">
      {/* background padrão do site — grid técnico + grain. Só aparece
          abaixo da foto da fachada (que cobre o topo da seção por cima). */}
      <SiteTexture />

      {/* headline + descrição/CTA — foto da fachada da loja como fundo, desfocada
          e escurecida em camadas pra garantir contraste do texto em branco */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0">
          <img
            src={customBackground || storefront}
            alt=""
            aria-hidden
            draggable={false}
            // fetchPriority="high": essa é a imagem de fundo da Hero — na
            // prática, quase sempre o elemento LCP (maior conteúdo visível)
            // da home. O PageSpeed apontou "descoberta de solicitações de
            // LCP" como problema no mobile: sem essa dica, o navegador só
            // prioriza essa imagem depois de descobrir o resto da página
            // (CSS, JS), atrasando o LCP. Com fetchPriority="high", ela
            // entra na fila de download com prioridade máxima assim que o
            // HTML é parseado, do mesmo jeito que já não tem loading="lazy"
            // (continua carregando imediatamente, nunca adiado).
            fetchPriority="high"
            decoding="async"
            className="h-full w-full scale-110 object-cover object-center blur-[6px]"
          />
          {/* véu escuro base */}
          <div className="absolute inset-0 bg-black/55" />
          {/* degradê vertical — mais escuro no topo (onde fica o header) e no
              rodapé (onde funde com o resto da página), mais claro no meio
              pra deixar a foto respirar atrás do texto */}
          <div
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(180deg, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.38) 45%, rgba(0,0,0,0.78) 100%)",
            }}
          />
          {/* transição final pro fundo claro do resto da seção */}
          <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-b from-transparent to-background md:h-44" />
        </div>

        <div className="relative z-10 mx-auto max-w-2xl px-6 pt-44 pb-24 text-center lg:px-14 lg:pt-64 lg:pb-40">
          <h1 className="display text-[clamp(1.75rem,9.5vw,3.25rem)] leading-[0.95] sm:text-[clamp(3rem,8vw,4.5rem)] lg:text-[clamp(3.25rem,5vw,4.75rem)]">
            <span
              className="reveal-left block text-white whitespace-nowrap"
              style={{ animationDelay: "140ms" }}
            >
              {t("headline1")}
            </span>
            <span
              className="reveal-left block text-white/45 whitespace-nowrap"
              style={{ animationDelay: "220ms" }}
            >
              {t("headline2")}
            </span>
            <span
              className="reveal-left block text-white whitespace-nowrap"
              style={{ animationDelay: "300ms" }}
            >
              {t("headline3")}
            </span>
          </h1>

          <p
            className="reveal-left mx-auto mt-8 max-w-lg text-[17px] leading-relaxed text-white/75 md:text-[19px]"
            style={{ animationDelay: "420ms" }}
          >
            {t("subtitle")}
          </p>

          <div
            className="reveal-left mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row"
            style={{ animationDelay: "500ms" }}
          >
            <a
              href={WHATSAPP_URL}
              target="_blank"
              rel="noreferrer"
              className="group relative inline-flex w-full items-center justify-center gap-6 overflow-hidden rounded-full bg-white px-6 py-4 text-[12px] font-bold tracking-[0.14em] text-black uppercase shadow-[0_8px_40px_-8px] shadow-black/50 transition-all hover:shadow-black/60 sm:w-auto sm:justify-between"
            >
              <span className="relative z-10">{t("ctaPrimary")}</span>
              <ArrowUpRight className="relative z-10 size-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              <span
                className="absolute inset-0 -translate-x-full bg-black/10 transition-transform duration-700 ease-out group-hover:translate-x-full"
                style={{ transform: "skewX(-20deg)" }}
              />
            </a>
            <a
              href="#sobre"
              onClick={(e) => {
                // evita o "#sobre" aparecendo na barra de endereço — mesmo
                // padrão usado pelos links de âncora do Header/Footer.
                e.preventDefault();
                scrollToSection("sobre");
              }}
              className="text-[12px] font-semibold tracking-[0.14em] text-white/75 uppercase underline decoration-white/30 decoration-1 underline-offset-[6px] transition-colors hover:text-white"
            >
              {t("nav:about")}
            </a>
          </div>
        </div>
      </div>

      {/* legenda — acima do carrossel de fotos reais */}
      <div
        className="reveal-left relative z-10 mx-auto flex max-w-[1600px] items-center justify-between gap-4 px-6 lg:px-14"
        style={{ animationDelay: "580ms" }}
      >
        <span className="eyebrow">{t("eyebrow")}</span>
        <a
          href="#projetos"
          onClick={(e) => {
            e.preventDefault();
            scrollToSection("projetos");
          }}
          className="hidden items-center gap-1.5 text-[11px] font-semibold tracking-[0.1em] text-muted-foreground uppercase transition-colors hover:text-foreground sm:flex"
        >
          {t("viewAllProjects")}
          <ArrowUpRight className="size-3.5" />
        </a>
      </div>

      {/* carrossel de fotos reais — dois trilhos em direções opostas */}
      <div className="reveal-left relative z-10 mt-4 lg:mt-6" style={{ animationDelay: "660ms" }}>
        <ShowcaseMarquee />
      </div>

      {/* instagram + scroll cue */}
      <div className="relative z-10 hidden items-center justify-between px-6 py-6 lg:flex lg:px-14">
        <span className="text-[10px] tracking-[0.24em] text-foreground/70 uppercase">{INSTAGRAM}</span>
        <div className="flex items-center gap-2 text-[10px] tracking-[0.24em] text-foreground/50 uppercase">
          {t("scrollForMore")}
          <ChevronDown className="size-3.5 animate-bounce" />
        </div>
      </div>

      {/* degradê da divisa com a próxima seção — mesmo tier (preto) dos dois lados */}
      <SectionFade side="bottom" />
    </section>
  );
}
