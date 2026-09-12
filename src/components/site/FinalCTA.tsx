import { useEffect, useMemo, useRef, useState } from "react";
import { ArrowUpRight, BadgeCheck, ChevronRight } from "lucide-react";
import { useTranslation } from "react-i18next";
import { INSTAGRAM_URL, PHONE_DISPLAY, WHATSAPP_URL } from "@/data/site";
import { SectionFade } from "@/components/site/SectionFade";

// lucide-react não tem ícone de WhatsApp — mesmo caso resolvido em
// Header.tsx/Footer.tsx: SVG do glifo oficial, cor única via currentColor.
function WhatsAppIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden>
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413" />
    </svg>
  );
}

/* =========================================================================
 * CTA final — redesign a partir de 3 referências do 21st.dev, remontadas
 * com os tokens que já existem no design system do site (var(--color-
 * foreground)/var(--color-background), display/text-veil, border-border,
 * bg-surface, text-muted-foreground) em vez das classes literais dos
 * originais (#fff/#000, "geist", etc.) — assim continua funcionando nos
 * dois temas da alternância global (ThemeToggle.tsx) sem precisar de uma
 * versão dark separada.
 *
 * O QUE VEM DE CADA REFERÊNCIA
 * -----------------------------------------------------------------------
 * • Referência 2 (Animated Hero) → estrutura principal: bloco central,
 *   badge no topo, título em duas linhas com UMA palavra que gira
 *   (troquei o "amazing/new/wonderful..." por variações do tipo de setup:
 *   "gamer", "profissional", "dos sonhos"...), subtítulo curto e dois
 *   botões lado a lado. É a "espinha dorsal" do componente, como pedido.
 *   A rotação de palavra foi refeita em CSS puro (grid + transições),
 *   sem framer-motion — o arquivo atual não depende dessa lib, então
 *   evitei adicionar uma dependência nova só para isso. Se o projeto já
 *   usa framer-motion em outro lugar, dá pra trocar as transições CSS
 *   por <motion.span> com spring, mantendo a mesma estrutura.
 *
 * • Referência 1 (Hero 1) → dois toques específicos, como pedido:
 *   1) o "selo" de confiança abaixo dos botões (ela usa eyebrow pill;
 *      aqui a mesma linguagem visual reaparece como selo de baixo risco,
 *      que é mais útil num CTA final do que repetir o eyebrow do topo);
 *   2) o glow radial suave atrás do título (na referência é uma elipse
 *      grande "colada" na base do hero — aqui virou um blur menor e mais
 *      discreto, centrado no título, pra dar profundidade sem competir
 *      com as linhas do fundo).
 *
 * • Componente 2 (Background Paths) → virou a camada de fundo: as linhas
 *   SVG fluidas foram mantidas, mas (a) reduzidas de 36 para 3 curvas
 *   (36 traços some·se em ruído visual num CTA pequeno, que é exatamente
 *   o "poluir" que o briefing pediu pra evitar), (b) a animação trocou de
 *   framer-motion por CSS (@keyframes + prefers-reduced-motion), e (c) a
 *   cor usa currentColor puxando var(--color-foreground), então as linhas
 *   ficam sutis nos dois temas sem precisar de rgba() fixo.
 *
 *   (A colina/arco sólido que existia no rodapé da versão anterior foi
 *   removida — o border-radius gigante numa faixa baixa estava
 *   renderizando como uma bolha/círculo branco em vez de um morro. Se
 *   quiser reintroduzir uma transição pro Footer depois, o caminho mais
 *   seguro é um `mask-image` com gradiente elíptico, não `rounded-t-[999px]`.)
 *
 * SUGESTÃO DE VARIAÇÃO DE COR
 * -----------------------------------------------------------------------
 * Hoje o componente é monocromático (só var(--color-foreground) e
 * var(--color-background), como o resto do site) — é o mesmo caminho que
 * Apple/Linear/Vercel/Stripe usam: preto/branco + UM acento só quando
 * precisa chamar atenção. Se quiser testar um acento de cor, o lugar mais
 * natural é a palavra que gira no título e/ou o botão principal. Três
 * opções que combinam com "loja de setup/PC" sem cair no clichê roxo-IA:
 *   - Âmbar quente:   #F5A524 (transmite energia/ação)
 *   - Azul elétrico:  #3B82F6 (tech, confiança)
 *   - Verde-esmeralda:#10B981 (disponibilidade, "pode fechar")
 * Bastaria trocar `text-muted-foreground/40` da palavra giratória e o
 * `bg-foreground` do botão principal por uma nova variável de tema
 * (ex.: `--color-accent`), sem tocar no resto do componente.
 *
 * A seção continua `isolate` de propósito (contexto de empilhamento
 * próprio), então as duas camadas de fundo (-z-20 linhas, -z-15 glow)
 * ficam garantidamente atrás do conteúdo mas presas DENTRO desta seção —
 * sem vazar z-index pra outra seção.
 * ========================================================================= */

export function FinalCTA() {
  const { t } = useTranslation("finalcta");
  const sectionRef = useRef<HTMLElement>(null);
  const [visible, setVisible] = useState(false);
  const [wordIndex, setWordIndex] = useState(0);
  const prevWordIndexRef = useRef(0);

  // `rotatingWords` vem de finalcta.json — cada idioma define suas próprias
  // palavras/pontuação (ver comentário do template mais abaixo, perto do
  // <h2>, sobre por que a ordem das palavras muda por idioma).
  const rotatingWords = t("rotatingWords", { returnObjects: true }) as string[];

  // Guarda o índice anterior só depois que a troca já foi renderizada —
  // durante a própria troca, a ref ainda aponta pra palavra que está
  // saindo, que é exatamente o que a lógica de transform abaixo precisa.
  useEffect(() => {
    prevWordIndexRef.current = wordIndex;
  }, [wordIndex]);

  // Reveal único ao entrar na viewport — um só momento orquestrado,
  // não uma animação por elemento (mantido do arquivo original).
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

  // Rotação da palavra do título — desliga sozinha se o usuário pedir
  // menos movimento no sistema.
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const id = setInterval(() => {
      setWordIndex((i) => (i + 1) % rotatingWords.length);
    }, 2600);
    return () => clearInterval(id);
  }, [rotatingWords.length]);

  // ao trocar de idioma o número de palavras pode mudar — evita índice fora
  // do array (rotatingWords[wordIndex] undefined) na primeira renderização
  // pós-troca.
  useEffect(() => {
    if (wordIndex >= rotatingWords.length) {
      setWordIndex(0);
      prevWordIndexRef.current = 0;
    }
  }, [rotatingWords.length, wordIndex]);

  const longestWord = useMemo(
    () => rotatingWords.reduce((a, b) => (b.length > a.length ? b : a)),
    [rotatingWords],
  );

  return (
    <section
      id="comece"
      ref={sectionRef}
      className="relative isolate overflow-hidden px-6 pt-14 pb-32 text-center md:pt-20 md:pb-48"
    >
      <style>{`
        /* linhas de fundo (Componente 2, adaptado) */
        @keyframes finalCtaPathDrift {
          0%, 100% { transform: translate(0, 0); opacity: 0.28; }
          50% { transform: translate(1.5%, -1%); opacity: 0.48; }
        }
        .final-cta-bg-path { animation: finalCtaPathDrift 16s ease-in-out infinite; }
        .final-cta-bg-path:nth-of-type(2) { animation-duration: 20s; animation-delay: -5s; }
        .final-cta-bg-path:nth-of-type(3) { animation-duration: 24s; animation-delay: -11s; }

        /* palavra giratória do título (Referência 2, sem framer-motion) */
        .final-cta-word {
          transition: transform 0.5s cubic-bezier(0.16,1,0.3,1), opacity 0.4s ease;
        }

        @media (prefers-reduced-motion: reduce) {
          .final-cta-bg-path { animation: none; }
          .final-cta-word { transition: none; }
        }
      `}</style>

      {/* degradê de emenda com a seção anterior */}
      <SectionFade side="top" />

      {/* camada 1 — linhas fluidas (Componente 2 / Background Paths) */}
      <svg
        aria-hidden
        viewBox="0 0 1200 400"
        preserveAspectRatio="none"
        className="pointer-events-none absolute inset-0 -z-20 h-full w-full text-foreground"
      >
        <path
          className="final-cta-bg-path"
          d="M-100 300C150 200 350 380 600 260C850 140 1000 320 1300 180"
          fill="none"
          stroke="currentColor"
          strokeWidth="1"
          strokeOpacity="0.5"
        />
        <path
          className="final-cta-bg-path"
          d="M-100 120C200 260 400 40 650 160C900 280 1050 60 1300 200"
          fill="none"
          stroke="currentColor"
          strokeWidth="1"
          strokeOpacity="0.35"
        />
        <path
          className="final-cta-bg-path"
          d="M-100 220C180 80 420 300 640 140C900 -20 1080 220 1300 100"
          fill="none"
          stroke="currentColor"
          strokeWidth="0.75"
          strokeOpacity="0.3"
        />
      </svg>

      {/* camada 2 — glow radial atrás do título (toque da Referência 1) */}
      <div
        aria-hidden
        className="pointer-events-none absolute top-[18%] left-1/2 -z-[15] h-[280px] w-[560px] -translate-x-1/2 rounded-full opacity-[0.14] blur-3xl"
        style={{ background: "var(--color-foreground)" }}
      />

      <div className="relative z-10 mx-auto max-w-2xl">
        <span
          className={`group inline-flex items-center gap-2 rounded-full border border-border bg-surface/70 px-4 py-2 text-[11px] font-semibold tracking-[0.18em] text-muted-foreground uppercase backdrop-blur-sm ${visible ? "reveal-left" : "opacity-0"}`}
        >
          {t("badge")}
          <ChevronRight className="size-3.5 transition-transform group-hover:translate-x-0.5" aria-hidden />
        </span>

        {/* título com palavra giratória — a ordem das palavras muda por
            idioma (PT/ES/IT: substantivo antes do adjetivo giratório; EN/DE:
            adjetivo antes do substantivo), então em vez de um template fixo
            de posições, cada idioma define titleLine1 (1ª linha), titlePrefix
            (texto logo antes da palavra), a própria palavra giratória e
            titleSuffix (texto depois da palavra, vazio quando não precisa) —
            ver src/i18n/locales/<idioma>/finalcta.json. */}
        <h2
          className={`display text-veil mt-6 text-[clamp(2.25rem,9vw,4.5rem)] leading-[0.95] text-foreground ${visible ? "reveal-left" : "opacity-0"}`}
          style={{ animationDelay: "80ms" }}
        >
          {t("titleLine1")}
          <br />
          <span className="text-muted-foreground/40">
            {t("titlePrefix")}{" "}
            <span className="relative inline-grid align-baseline text-center text-foreground">
              {/* reserva a largura pela palavra mais longa, sem deixar o título "pular" */}
              <span className="invisible" aria-hidden>
                {longestWord}
              </span>
              {rotatingWords.map((word, i) => {
                const isActive = i === wordIndex;
                const isExiting = !isActive && i === prevWordIndexRef.current;
                // Ativa: no lugar. Saindo: sempre sobe (-100%). Qualquer
                // outra: fica estacionada embaixo (100%), pronta pra subir
                // quando for a vez dela — assim a troca é sempre "pra cima".
                const translateY = isActive ? "0" : isExiting ? "-100%" : "100%";
                return (
                  <span
                    key={word}
                    aria-hidden={!isActive}
                    className="final-cta-word absolute inset-0"
                    style={{
                      transform: `translateY(${translateY})`,
                      opacity: isActive ? 1 : 0,
                    }}
                  >
                    {word}
                  </span>
                );
              })}
            </span>
            {t("titleSuffix") ? ` ${t("titleSuffix")}` : ""}
          </span>
          <span className="sr-only">{rotatingWords[wordIndex]}</span>
        </h2>

        <p
          className={`mx-auto mt-6 max-w-md text-[15px] leading-relaxed text-muted-foreground ${visible ? "reveal-left" : "opacity-0"}`}
          style={{ animationDelay: "160ms" }}
        >
          {t("subtitle")}
        </p>

        <div
          className={`mt-9 flex flex-col items-center justify-center gap-3.5 sm:flex-row ${visible ? "reveal-left" : "opacity-0"}`}
          style={{ animationDelay: "240ms" }}
        >
          <a
            href={INSTAGRAM_URL}
            target="_blank"
            rel="noreferrer"
            className="group relative inline-flex w-full items-center justify-center gap-3 overflow-hidden rounded-full bg-foreground px-6 py-4 text-[12px] font-bold tracking-[0.12em] text-background uppercase shadow-[0_8px_40px_-8px] shadow-black/30 transition-all hover:scale-[1.02] hover:shadow-black/40 sm:w-auto"
          >
            <span className="relative z-10">{t("ctaPrimary")}</span>
            <ArrowUpRight className="relative z-10 size-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            <span
              className="absolute inset-0 -translate-x-full bg-background/15 transition-transform duration-700 ease-out group-hover:translate-x-full"
              style={{ transform: "skewX(-20deg)" }}
            />
          </a>
          <a
            href={WHATSAPP_URL}
            target="_blank"
            rel="noreferrer"
            className="inline-flex w-full items-center justify-center gap-2 rounded-full border border-white/15 bg-black px-6 py-4 text-[12px] font-semibold tracking-[0.1em] text-white uppercase transition-colors hover:bg-neutral-900 sm:w-auto"
          >
            <WhatsAppIcon className="size-3.5" />
            {PHONE_DISPLAY}
          </a>
        </div>

        {/* selo de confiança — toque da Referência 1 (era eyebrow pill, aqui reaparece como selo pós-CTA) */}
        <div
          className={`mt-5 inline-flex items-center gap-1.5 text-[12px] text-muted-foreground ${visible ? "reveal-left" : "opacity-0"}`}
          style={{ animationDelay: "300ms" }}
        >
          <BadgeCheck className="size-3.5" aria-hidden />
          {t("trustBadge")}
        </div>
      </div>
    </section>
  );
}