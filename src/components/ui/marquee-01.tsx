import { useRef, useState } from "react";
import type { PointerEvent as ReactPointerEvent } from "react";
import { ChevronLeft, ChevronRight, Star } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Card, CardContent } from "@/components/ui/card";
import { Marquee } from "@/components/ui/marquee-01-utils/marquee";
import { TESTIMONIALS } from "@/data/site";
import { cn } from "@/lib/utils";

// adaptado do bloco "marquee-01" (21st.dev) ao design system do site:
// tema dark (reaproveita os tokens já existentes em styles.css), textos e
// depoimentos em PT-BR vindos de src/data/site.ts, e avatar em iniciais no
// lugar das fotos de estoque do exemplo original — mesmo padrão visual já
// usado no grid de depoimentos estático.

function initials(name: string) {
  const parts = name.split(" ");
  return `${parts[0]?.[0] ?? ""}${parts[parts.length - 1]?.[0] ?? ""}`;
}

type Testimonial = (typeof TESTIMONIALS)[number];

const half = Math.ceil(TESTIMONIALS.length / 2);
const firstRow = TESTIMONIALS.slice(0, half);
const secondRow = TESTIMONIALS.slice(half);

// 18 depoimentos reais — já dá volume suficiente pro carrossel mobile sem
// precisar repetir o conjunto (diferente de quando só tínhamos 4).
const CAROUSEL_ITEMS = TESTIMONIALS;

// `testimonial` vem inteiro (não espalhado em props) de propósito: o campo
// `key` de Testimonial (t01, t02...) usado pra buscar a tradução da citação
// colidiria com a prop especial `key` do React se fosse espalhado via
// `{...t}` na chamada do componente — o React nunca repassaria esse valor.
function ReviewCard({ testimonial, className }: { testimonial: Testimonial; className?: string }) {
  const { t } = useTranslation("testimonials");
  const { key, name, rating } = testimonial;
  return (
    <Card
      className={cn(
        "relative h-full w-80 shrink-0 cursor-default overflow-hidden border-foreground/20 bg-background p-6 transition-colors duration-300 hover:border-foreground/45",
        className,
      )}
    >
      <CardContent className="flex h-full flex-col gap-4 p-0">
        <div className="flex items-center gap-0.5" aria-label={t("ratingLabel", { rating })}>
          {Array.from({ length: 5 }, (_, s) => (
            <Star
              key={s}
              className={`size-3.5 ${s < rating ? "fill-foreground text-foreground" : "fill-transparent text-border-strong"}`}
              strokeWidth={1.5}
            />
          ))}
        </div>

        <p className="text-[14px] leading-relaxed text-foreground">{t(`quotes.${key}`)}</p>

        <div className="mt-auto flex items-center gap-3 border-t border-border/70 pt-4">
          <span className="flex size-9 shrink-0 items-center justify-center rounded-md border border-border-strong text-[11px] font-bold tracking-wide text-muted-foreground">
            {initials(name)}
          </span>
          <span className="min-w-0">
            <span className="block text-[13px] font-semibold tracking-[-0.01em] text-foreground">{name}</span>
            <span className="block truncate text-[11px] text-muted-foreground">{t("clientRole")}</span>
          </span>
        </div>
      </CardContent>
    </Card>
  );
}

export function TestimonialsMarquee() {
  return (
    <div className="relative hidden w-full flex-col gap-4 overflow-hidden py-2 md:flex">
      <Marquee pauseOnHover className="[--duration:34s]">
        {firstRow.map((item) => (
          <ReviewCard key={item.key} testimonial={item} />
        ))}
      </Marquee>
      <Marquee reverse pauseOnHover className="[--duration:34s]">
        {secondRow.map((item) => (
          <ReviewCard key={item.key} testimonial={item} />
        ))}
      </Marquee>

      <div className="pointer-events-none absolute inset-y-0 left-0 w-12 bg-gradient-to-r from-background to-transparent sm:w-32" />
      <div className="pointer-events-none absolute inset-y-0 right-0 w-12 bg-gradient-to-l from-background to-transparent sm:w-32" />
    </div>
  );
}

// mobile — em telas estreitas, um carrossel corrido de 2 fileiras que nunca
// para pra ler fica ilegível e os cards nascem cortados nas bordas. No lugar,
// uma fileira única com scroll-snap: o usuário desliza no próprio ritmo, um
// card inteiro por vez (sem fatia cortada do próximo espiando na borda, que
// lia como layout quebrado), e os pontinhos avisam quantos faltam.
export function TestimonialsCarousel() {
  const { t } = useTranslation("testimonials");
  const scrollerRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);
  // arrastar com o dedo (touch) já rola nativamente por causa do
  // overflow-x-auto — isso aqui é só pra também dar pra arrastar com
  // mouse/trackpad (não existe "touch" de mouse, então sem isso só dava
  // pra clicar/arrastar em tela de verdade).
  const dragRef = useRef<{ startX: number; startScrollLeft: number; dragging: boolean } | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  const cardWidth = () => {
    const el = scrollerRef.current;
    return el ? el.scrollWidth / CAROUSEL_ITEMS.length : 0;
  };

  const onScroll = () => {
    const el = scrollerRef.current;
    const width = cardWidth();
    if (!el || !width) return;
    const idx = Math.round(el.scrollLeft / width);
    setActive(Math.min(CAROUSEL_ITEMS.length - 1, Math.max(0, idx)));
  };

  const scrollToIndex = (idx: number) => {
    const el = scrollerRef.current;
    const width = cardWidth();
    if (!el || !width) return;
    const clamped = Math.min(CAROUSEL_ITEMS.length - 1, Math.max(0, idx));
    el.scrollTo({ left: clamped * width, behavior: "smooth" });
  };

  const onPointerDown = (e: ReactPointerEvent<HTMLDivElement>) => {
    // toque real (celular) já rola sozinho — só assume o controle manual
    // pra mouse/trackpad, senão ia disputar com o scroll nativo do touch.
    if (e.pointerType === "touch") return;
    const el = scrollerRef.current;
    if (!el) return;
    dragRef.current = { startX: e.clientX, startScrollLeft: el.scrollLeft, dragging: true };
    setIsDragging(true);
    el.setPointerCapture(e.pointerId);
  };

  const onPointerMove = (e: ReactPointerEvent<HTMLDivElement>) => {
    const el = scrollerRef.current;
    const drag = dragRef.current;
    if (!el || !drag?.dragging) return;
    el.scrollLeft = drag.startScrollLeft - (e.clientX - drag.startX);
  };

  const endDrag = () => {
    if (!dragRef.current?.dragging) return;
    dragRef.current.dragging = false;
    setIsDragging(false);
    // ao soltar, encaixa no card mais próximo — arrastar manual (via
    // scrollLeft direto) não aciona o scroll-snap sozinho como o gesto
    // nativo de touch/scroll aciona.
    scrollToIndex(active);
  };

  return (
    <div className="md:hidden">
      <div
        ref={scrollerRef}
        onScroll={onScroll}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={endDrag}
        onPointerLeave={endDrag}
        onPointerCancel={endDrag}
        className={`scroll-fade-x -mx-6 flex snap-x snap-mandatory gap-4 overflow-x-auto px-6 pb-1 [&::-webkit-scrollbar]:hidden ${
          isDragging ? "cursor-grabbing snap-none select-none" : "cursor-grab"
        }`}
        style={{ scrollbarWidth: "none" }}
      >
        {CAROUSEL_ITEMS.map((item, i) => (
          <div key={`${item.key}-${i}`} className="w-full shrink-0 snap-center">
            <ReviewCard testimonial={item} className="w-full" />
          </div>
        ))}
      </div>

      <div className="mt-6 flex items-center justify-center gap-5">
        <button
          type="button"
          aria-label={t("prevLabel")}
          onClick={() => scrollToIndex(active - 1)}
          disabled={active === 0}
          className="flex size-12 shrink-0 items-center justify-center rounded-full border border-border-strong bg-surface text-foreground transition-colors hover:border-foreground/50 hover:bg-background disabled:pointer-events-none disabled:opacity-30"
        >
          <ChevronLeft className="size-6" />
        </button>

        <div className="flex items-center gap-1.5" aria-hidden>
          {CAROUSEL_ITEMS.map((_, i) => (
            <span
              key={i}
              className={`h-1 rounded-full transition-all duration-300 ${
                i === active ? "w-5 bg-foreground" : "w-1.5 bg-border-strong"
              }`}
            />
          ))}
        </div>

        <button
          type="button"
          aria-label={t("nextLabel")}
          onClick={() => scrollToIndex(active + 1)}
          disabled={active === CAROUSEL_ITEMS.length - 1}
          className="flex size-12 shrink-0 items-center justify-center rounded-full border border-border-strong bg-surface text-foreground transition-colors hover:border-foreground/50 hover:bg-background disabled:pointer-events-none disabled:opacity-30"
        >
          <ChevronRight className="size-6" />
        </button>
      </div>
    </div>
  );
}
