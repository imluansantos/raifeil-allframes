import { useEffect, useRef, useState } from "react";
import type { PointerEvent as ReactPointerEvent } from "react";
import { ArrowUpRight, ChevronDown, MapPin, MousePointerClick, X } from "lucide-react";
import { useTranslation } from "react-i18next";
import { SectionFade } from "@/components/site/SectionFade";
import storefront from "@/assets/frenteaboutus.webp";

// bloco institucional "quem somos" — vem antes da seção Equipe (Team.tsx).
// resumo da história real da empresa (2022 · perfil no Instagram do João
// Gabriel → 2024 · entrada do Raí e primeira loja física → 2025 · chegada
// do Luiz e reformulação pro mercado gamer). Texto completo é grande demais
// pra seção; aqui fica só a versão condensada.

const STORE_ADDRESS = "R. Mal. Floriano, 205 - Centro, Bento Gonçalves - RS, 95700-110";
const MAPS_QUERY = `All Frames Technology, ${STORE_ADDRESS}`;
const MAPS_EMBED_URL = `https://www.google.com/maps?q=${encodeURIComponent(MAPS_QUERY)}&output=embed`;
const MAPS_LINK = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(MAPS_QUERY)}`;
export function AboutUs() {
  const { t } = useTranslation("aboutus");
  const sectionRef = useRef<HTMLElement>(null);
  const [visible, setVisible] = useState(false);
  const [showLocation, setShowLocation] = useState(false);
  // "Ver mais" / "Mostrar menos" — só existe no mobile (o botão fica
  // md:hidden); no desktop o terceiro parágrafo sempre aparece.
  const [expanded, setExpanded] = useState(false);

  // hover/foco controlados em JS (não em CSS puro) — é o que permite o "X"
  // realmente fechar o pop-out mesmo com o mouse ainda em cima da imagem.
  // Com `:hover` puro em CSS, clicar no X não muda o :hover do navegador,
  // então o pop-out reaparecia na hora — daí o botão "não funcionar".
  const [hovering, setHovering] = useState(false);
  const [focused, setFocused] = useState(false);
  const [dismissed, setDismissed] = useState(false);
  const locationOpen = showLocation || ((hovering || focused) && !dismissed);

  // Guarda o tipo do último ponteiro que tocou o card (mouse/touch/caneta),
  // atualizado bem cedo (pointerdown chega antes de focus/click). É o que
  // deixa o onFocus abaixo saber se o foco veio de um toque ou de verdade
  // do teclado/mouse — ver comentário ali pra entender por que isso importa.
  const lastPointerTypeRef = useRef<"mouse" | "touch" | "pen" | null>(null);

  // Segunda camada de proteção, independente da de cima: mesmo já filtrando
  // hover/foco por pointerType, um toque real ainda dispara uma sequência de
  // eventos (pointerover/enter/down → foco → up/out/leave → mousemove/down/up
  // → click) num intervalo de tempo curtíssimo. Se, por qualquer motivo (um
  // navegador específico, uma variação na ordem desses eventos), o clique
  // "de verdade" acabar sendo entregue depois que o pop-out já apareceu na
  // tela, ele pode cair em cima do iframe do mapa ou do link — que estão na
  // MESMA posição do dedo. Pra isso nunca acontecer, o cartão do pop-out
  // (iframe + link "Ver no Google Maps") só aceita clique um instante depois
  // de abrir (`popupInteractive`); até lá ele fica com pointer-events
  // desativado. Esse atraso é curto demais pra um usuário notar ao tentar
  // clicar de propósito, mas suficiente pra nunca coincidir com o clique que
  // acabou de abrir o próprio pop-out.
  const [popupInteractive, setPopupInteractive] = useState(false);

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

  // liga `popupInteractive` só um pouco depois do pop-out abrir, e desliga
  // na hora se ele fechar — ver comentário acima de `popupInteractive`.
  useEffect(() => {
    if (!locationOpen) {
      setPopupInteractive(false);
      return;
    }
    const id = setTimeout(() => setPopupInteractive(true), 400);
    return () => clearTimeout(id);
  }, [locationOpen]);

  return (
    <section id="sobre" ref={sectionRef} className="relative">
      {/* degradê das divisas com as seções vizinhas — mesmo tier (preto) dos dois lados.
          Precisam ficar num elemento sem max-w (a section em si), senão o degradê fica
          limitado à largura do conteúdo (1600px) e some fora dela nas telas largas. */}
      <SectionFade side="top" />
      <SectionFade side="bottom" />
      <div className="mx-auto max-w-[1600px] px-6 pt-16 pb-20 lg:px-14 md:pt-24 md:pb-28">
      <div className="grid grid-cols-1 items-center gap-12 md:grid-cols-[1.1fr_1fr] md:gap-12 lg:gap-16">
        {/* texto */}
        <div className="text-veil">
          <span
            className="pointer-events-none absolute -top-14 -left-1 font-serif text-[7rem] leading-none text-muted-foreground select-none md:-top-20 md:text-[9rem]"
            aria-hidden
          >
            &ldquo;
          </span>

          <div
            className={`relative flex items-center gap-3 ${visible ? "reveal-left" : "opacity-0"}`}
            style={{ animationDelay: "0ms" }}
          >
            <span className="h-3 w-px origin-top bg-foreground" aria-hidden />
            <span className="eyebrow">{t("eyebrow")}</span>
          </div>

          <p
            className={`display relative mt-6 max-w-xl text-[26px] leading-[1.18] md:text-[32px] lg:text-[36px] ${visible ? "reveal-left" : "opacity-0"}`}
            style={{ animationDelay: "100ms" }}
          >
            <span className="text-muted-foreground/50">{t("titleMuted")}</span> {t("titleRest")}
          </p>

          <p
            className={`relative mt-6 max-w-xl text-[16px] leading-relaxed text-muted-foreground md:text-[18px] ${visible ? "reveal-left" : "opacity-0"}`}
            style={{ animationDelay: "220ms" }}
          >
            {t("paragraph1")}
          </p>

          <p
            className={`relative mt-4 max-w-xl text-[16px] leading-relaxed text-muted-foreground md:text-[18px] ${visible ? "reveal-left" : "opacity-0"}`}
            style={{ animationDelay: "260ms" }}
          >
            {t("paragraph2")}
          </p>

          {/* no mobile o terceiro parágrafo só aparece depois de tocar em
              "Ver mais"; no desktop (md:block) ele sempre fica visível e o
              botão abaixo (md:hidden) some. */}
          <button
            type="button"
            onClick={() => setExpanded((v) => !v)}
            aria-expanded={expanded}
            className={`relative mt-5 inline-flex w-fit items-center gap-1.5 rounded-full border border-border bg-surface px-4 py-2 text-[12.5px] font-semibold tracking-[0.02em] text-foreground uppercase transition-colors hover:border-foreground/40 hover:bg-background md:hidden ${visible ? "reveal-left" : "opacity-0"}`}
            style={{ animationDelay: "300ms" }}
          >
            {expanded ? t("showLess") : t("expandMore")}
            <ChevronDown
              className={`size-3.5 shrink-0 transition-transform duration-300 ${expanded ? "rotate-180" : ""}`}
              aria-hidden
            />
          </button>

          <p
            className={`relative mt-4 max-w-xl text-[16px] leading-relaxed text-muted-foreground md:mt-4 md:block md:text-[18px] ${expanded ? "block" : "hidden"} ${visible ? "reveal-left" : "opacity-0"}`}
            style={{ animationDelay: "300ms" }}
          >
            {t("paragraph3")}
          </p>
        </div>

        {/* fachada da loja */}
        <div className={`relative ${visible ? "reveal-left" : "opacity-0"}`} style={{ animationDelay: "180ms" }}>
          <div
            role="button"
            tabIndex={0}
            aria-expanded={locationOpen}
            aria-label={t("mapAriaLabel")}
            onClick={() => setShowLocation((v) => !v)}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                setShowLocation((v) => !v);
              }
            }}
            // pointerdown chega bem antes de focus/click na sequência que o
            // navegador emula a partir de um toque — é o sinal mais cedo que
            // temos do tipo real do ponteiro, por isso guardamos aqui pro
            // onFocus (abaixo) poder consultar.
            onPointerDown={(e: ReactPointerEvent<HTMLDivElement>) => {
              lastPointerTypeRef.current = e.pointerType as "mouse" | "touch" | "pen";
            }}
            // onPointerEnter/Leave (não onMouseEnter/Leave) de propósito, com
            // filtro por pointerType: um toque no celular também dispara
            // eventos de mouse "sintéticos" (o navegador emula
            // mouseover/mousemove/mousedown/focus/mouseup antes do click, pra
            // conseguir simular clique em cima de elementos com hover). Sem
            // esse filtro, um simples toque na foto já contava como
            // "mouseenter" e abria o pop-out ANTES do click terminar — e
            // então o click "de verdade" (o passo final dessa sequência)
            // acabava sendo entregue pro que já tinha acabado de aparecer ali
            // (o iframe do Google Maps ou o link "Ver no Google Maps"), já
            // que a posição na tela é a mesma. Resultado: tocar a foto
            // redirecionava direto pro Google Maps. Com o filtro, só mouse de
            // verdade abre por hover — toque abre só pelo onClick normal
            // (que já funciona certinho, sem esse problema).
            onPointerEnter={(e: ReactPointerEvent<HTMLDivElement>) => {
              if (e.pointerType !== "mouse") return;
              setHovering(true);
              setDismissed(false);
            }}
            onPointerLeave={(e: ReactPointerEvent<HTMLDivElement>) => {
              if (e.pointerType !== "mouse") return;
              // não reseta `dismissed` aqui: o clique no X deixa o próprio
              // botão com foco (comportamento normal do navegador), então
              // se isso reabilitasse o hover, o pop-out reabria assim que
              // o mouse saísse — mesmo já fechado pelo X.
              setHovering(false);
            }}
            onFocus={() => {
              // mesmo motivo do onPointerEnter acima: focus também chega
              // antes do click numa sequência emulada por toque, então um
              // toque real (ou caneta) não deve abrir o pop-out por aqui —
              // só clique/toque no onClick, ou foco de verdade vindo do
              // teclado (Tab), que não passa por pointerdown antes.
              if (lastPointerTypeRef.current === "touch" || lastPointerTypeRef.current === "pen") return;
              setFocused(true);
              setDismissed(false);
            }}
            onBlur={(e) => {
              if (!e.currentTarget.contains(e.relatedTarget as Node)) {
                setFocused(false);
                setDismissed(false);
              }
            }}
            // aspect-[3/2] (não mais 4/3) de propósito, junto com o
            // object-position abaixo — só a caixa da própria imagem, nada
            // na seção/grid em volta mudou. Testei o recorte com a foto
            // real antes de aplicar: 3/2 é o suficiente pra cortar o céu e
            // o prédio bege de cima inteiros, começando já dentro do mural
            // e indo até a calçada, igual à referência.
            //
            // OBS: o overflow-hidden NÃO fica mais aqui no container — ele
            // foi para o wrapper interno (só em volta da imagem). Isso é
            // proposital: o card do mapa (imagem + endereço) é mais alto
            // que essa caixa 3/2, e como ele fica centralizado por cima via
            // flex, a parte de cima dele (onde mora o botão "X") acabava
            // cortada pelo overflow-hidden do container — daí o "X" sumir
            // assim que o mapa carregava de verdade. Com o corte restrito
            // à imagem, o card do mapa pode "vazar" um pouco pra fora da
            // caixa da foto sem nada ficar invisível.
            className="group relative aspect-[3/2] w-full cursor-pointer rounded-md border border-border bg-surface"
          >
            <div className="absolute inset-0 overflow-hidden rounded-md">
              <img
                src={storefront}
                alt={t("storeAlt")}
                loading="lazy"
                decoding="async"
                className="absolute inset-0 size-full object-cover object-[50%_60%] transition-transform duration-700 ease-out group-hover:scale-[1.04]"
              />
              {/* dica — desktop pede pra passar o mouse, mobile pede pra tocar;
                  some assim que o mapa abre (por hover, foco ou toque) */}
              <span
                className={`pointer-events-none absolute top-4 right-4 z-20 hidden items-center gap-1.5 rounded-md border border-white/20 bg-black/45 px-2.5 py-1.5 text-[10px] font-semibold tracking-[0.1em] text-white uppercase backdrop-blur-sm transition-opacity duration-300 md:inline-flex ${
                  locationOpen ? "opacity-0" : "opacity-100"
                }`}
              >
                <MousePointerClick className="size-3.5 shrink-0" aria-hidden />
                {t("hoverHint")}
              </span>
              <span
                className={`pointer-events-none absolute top-4 right-4 z-20 inline-flex items-center gap-1.5 rounded-md border border-white/20 bg-black/45 px-2.5 py-1.5 text-[10px] font-semibold tracking-[0.1em] text-white uppercase backdrop-blur-sm transition-opacity duration-300 md:hidden ${
                  locationOpen ? "opacity-0" : "opacity-100"
                }`}
              >
                <MapPin className="size-3.5 shrink-0" aria-hidden />
                {t("tapHint")}
              </span>
            </div>

            {/* pop-out de localização — aparece ao passar o mouse/focar (desktop) ou
                ao tocar na foto (mobile, via o estado showLocation); o "X" força o
                fechamento mesmo com o mouse ainda em cima (ver `dismissed` acima) */}
            <div
              className={`absolute inset-0 z-20 flex items-center justify-center bg-black/75 p-4 backdrop-blur-[2px] transition-opacity duration-300 ${
                locationOpen ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0"
              }`}
            >
              <div
                className={`relative w-full max-w-[400px] overflow-hidden rounded-md border border-white/15 bg-background text-left shadow-2xl ${
                  popupInteractive ? "pointer-events-auto" : "pointer-events-none"
                }`}
              >
                <button
                  type="button"
                  aria-label={t("closeMapAriaLabel")}
                  onClick={(e) => {
                    e.stopPropagation();
                    e.currentTarget.blur();
                    setFocused(false);
                    setShowLocation(false);
                    setDismissed(true);
                  }}
                  className="absolute top-3 right-3 z-10 inline-flex size-7 items-center justify-center rounded-full border border-white/20 bg-black/55 text-white backdrop-blur-sm transition-colors hover:bg-black/75"
                >
                  <X className="size-4" />
                </button>
                <iframe
                  title="Localização da All Frames Technology no mapa"
                  src={MAPS_EMBED_URL}
                  className="h-48 w-full border-0 sm:h-56"
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />
                <div className="p-5">
                  <p className="flex items-center gap-1.5 text-[12px] font-semibold tracking-[0.12em] text-foreground uppercase">
                    <MapPin className="size-4 shrink-0" aria-hidden />
                    {t("ourLocation")}
                  </p>
                  <p className="mt-2 text-[14px] leading-relaxed text-muted-foreground">{STORE_ADDRESS}</p>
                  <a
                    href={MAPS_LINK}
                    target="_blank"
                    rel="noreferrer"
                    className="mt-4 inline-flex items-center gap-1 text-[13px] font-semibold tracking-[0.08em] text-foreground uppercase underline decoration-border-strong decoration-1 underline-offset-4 transition-colors hover:text-muted-foreground"
                  >
                    {t("viewOnMaps")}
                    <ArrowUpRight className="size-4" />
                  </a>
                </div>
              </div>
            </div>
          </div>
          {/* sombra de chão */}
          <div
            className="pointer-events-none absolute -bottom-4 left-1/2 h-6 w-[78%] -translate-x-1/2 rounded-full bg-black/15 blur-xl"
            aria-hidden
          />
        </div>
      </div>
      </div>
    </section>
  );
}
