import { useEffect, useRef, useState } from "react";
import { useAnimationLevel } from "@/hooks/use-animation-level";
import build1 from "@/assets/build1.webp";
import build2 from "@/assets/build2.webp";
import build3 from "@/assets/build3.webp";
import build4 from "@/assets/build4.webp";
import build12 from "@/assets/build12.webp";
import build6 from "@/assets/build6.webp";
import build7 from "@/assets/build7.webp";
import build8 from "@/assets/build8.webp";
import build9 from "@/assets/build9.webp";
import build10 from "@/assets/build10.webp";
import heroSetup2 from "@/assets/hero-setup2.webp";

// embutido na Hero, logo abaixo do título — linha de cima anda pra esquerda,
// linha de baixo anda pra direita, mas só quando a página rola. Paradas
// quando o scroll para. Cada linha tem 7 fotos (sem repetir entre elas)
// puxadas de src/assets.
const TOP_ROW = [build1, build2, build3, build4, build6, build7, heroSetup2];
const BOTTOM_ROW = [build12, build8, build9, build10, heroSetup2];

function MarqueeRow({
  images,
  reverse,
  speed,
}: {
  images: string[];
  reverse?: boolean;
  speed: number;
}) {
  const trackRef = useRef<HTMLDivElement>(null);
  const repeatStartRef = useRef<HTMLDivElement>(null);
  const [repeatWidth, setRepeatWidth] = useState(0);
  // Animações → "Nenhuma": nem liga o listener de scroll (não só esconde o
  // movimento via CSS) — ganho real de processamento, o pedido explícito.
  const { isNone } = useAnimationLevel();

  // mede a largura de "uma volta" (primeira cópia da lista + os gaps) lendo
  // onde a segunda cópia começa — assim o loop fecha exatamente sem sobra
  // nem buraco, mesmo com gap responsivo (gap-4 no mobile, gap-5 no desktop).
  useEffect(() => {
    const measure = () => {
      if (repeatStartRef.current) setRepeatWidth(repeatStartRef.current.offsetLeft);
    };
    measure();
    const ro = new ResizeObserver(measure);
    if (trackRef.current) ro.observe(trackRef.current);
    window.addEventListener("resize", measure);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", measure);
    };
  }, [images]);

  // sem animação por tempo: a posição é uma função direta do scroll da
  // página. Escrevemos o transform via ref (sem re-render) pra ficar leve.
  useEffect(() => {
    if (!repeatWidth || isNone) return;
    let raf = 0;

    const apply = () => {
      const t = (((window.scrollY * speed) % repeatWidth) + repeatWidth) % repeatWidth;
      const x = reverse ? t - repeatWidth : -t;
      if (trackRef.current) {
        trackRef.current.style.transform = `translate3d(${x}px, 0, 0)`;
      }
    };

    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(apply);
    };

    apply();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
    };
  }, [repeatWidth, reverse, speed, isNone]);

  return (
    <div
      className="relative overflow-hidden"
      style={{
        maskImage: "linear-gradient(to right, transparent, black 6%, black 94%, transparent)",
        WebkitMaskImage:
          "linear-gradient(to right, transparent, black 6%, black 94%, transparent)",
      }}
    >
      <div
        ref={trackRef}
        className="flex w-max items-center gap-3 will-change-transform md:gap-5"
      >
        {/* no mobile as fotos ficam bem menores (h-24 w-32, era h-32 w-52) —
            dá pra ver umas 3/4 seguidas de cada vez, em vez de só 2 quase
            cortadas. sm/lg (tablet e desktop) continuam do tamanho de
            antes. */}
        {[...images, ...images, ...images].map((src, i) => (
          <div
            key={i}
            ref={i === images.length ? repeatStartRef : undefined}
            className="h-24 w-32 shrink-0 overflow-hidden rounded-xl border border-border bg-surface transition-transform duration-500 ease-out hover:scale-[1.03] sm:h-40 sm:w-64 lg:h-48 lg:w-80"
          >
            <img
              src={src}
              alt=""
              loading="lazy"
              decoding="async"
              draggable={false}
              className="size-full object-cover"
            />
          </div>
        ))}
      </div>
    </div>
  );
}

export function ShowcaseMarquee() {
  return (
    <div className="relative overflow-hidden border-b border-border bg-background pb-14 md:pb-20">
      <div className="flex flex-col gap-4 md:gap-5">
        <MarqueeRow images={TOP_ROW} speed={0.6} />
        <MarqueeRow images={BOTTOM_ROW} speed={0.5} reverse />
      </div>
    </div>
  );
}
