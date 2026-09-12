import { useEffect, useRef, useState } from "react";
import { ChevronRight, ArrowUpRight } from "lucide-react";
import cutoutRed from "@/assets/cutout-red.png";
import cutoutWhite from "@/assets/cutout-white.png";
import cutoutBlue from "@/assets/cutout-blue.png";
import { WHATSAPP_URL } from "@/data/site";

// versão alternativa da hero — não substitui a Hero.tsx original.
// referência: banner "The Best Gaming Experience" (produto flutuando + faixa
// diagonal + paginação em bolinhas + seta), reconstruído em preto e branco.

function WhatsAppIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden>
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.148.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
      <path d="M12.001 2C6.478 2 2 6.477 2 12c0 1.85.505 3.667 1.465 5.253L2 22l4.874-1.437A9.96 9.96 0 0 0 12 22c5.523 0 10-4.477 10-10S17.523 2 12 2zm0 18.153a8.13 8.13 0 0 1-4.147-1.134l-.297-.176-3.048.899.912-2.98-.194-.306A8.126 8.126 0 0 1 3.847 12c0-4.5 3.653-8.153 8.153-8.153S20.153 7.5 20.153 12 16.5 20.153 12 20.153z" />
    </svg>
  );
}

const SLIDES = [cutoutRed, cutoutWhite, cutoutBlue];

export function Hero2() {
  const sectionRef = useRef<HTMLElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const pausedRef = useRef(false);
  const [visible, setVisible] = useState(false);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const [active, setActive] = useState(0);

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

  useEffect(() => {
    const el = panelRef.current;
    if (!el) return;
    const onMove = (e: MouseEvent) => {
      const rect = el.getBoundingClientRect();
      setTilt({
        x: (e.clientX - rect.left) / rect.width - 0.5,
        y: (e.clientY - rect.top) / rect.height - 0.5,
      });
    };
    const onLeave = () => setTilt({ x: 0, y: 0 });
    el.addEventListener("mousemove", onMove);
    el.addEventListener("mouseleave", onLeave);
    return () => {
      el.removeEventListener("mousemove", onMove);
      el.removeEventListener("mouseleave", onLeave);
    };
  }, []);

  useEffect(() => {
    const id = setInterval(() => {
      if (!pausedRef.current) setActive((i) => (i + 1) % SLIDES.length);
    }, 5200);
    return () => clearInterval(id);
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative overflow-hidden border-t border-border bg-background"
    >
      <style>{`
        @keyframes h2FadeUp { from { opacity: 0; transform: translateY(18px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes h2Pulse { 0%, 100% { opacity: 0.4; } 50% { opacity: 0.75; } }
        .h2-anim { opacity: 0; }
        .h2-visible .h2-anim { animation: h2FadeUp 0.9s cubic-bezier(0.16,1,0.3,1) both; }
      `}</style>

      {/* textura de fundo — grade fina quase invisível */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.05]"
        style={{
          backgroundImage:
            "linear-gradient(to right, black 1px, transparent 1px), linear-gradient(to bottom, black 1px, transparent 1px)",
          backgroundSize: "56px 56px",
        }}
      />

      {/* faixa diagonal full-bleed atravessando a seção inteira — versão P&B da fita da referência */}
      <div
        className="pointer-events-none absolute top-1/2 left-1/2 h-[130%] w-[45%] -translate-x-1/2 -translate-y-1/2 opacity-90"
        style={{
          transform: `translate(-50%, -50%) rotate(${-13 + tilt.x * 1.5}deg)`,
          background:
            "linear-gradient(90deg, transparent 0%, rgba(0,0,0,0.045) 42%, rgba(0,0,0,0.09) 50%, rgba(0,0,0,0.045) 58%, transparent 100%)",
          transition: "transform 0.5s ease-out",
        }}
      />
      <div
        className="pointer-events-none absolute top-0 right-[8%] hidden h-full w-px opacity-25 lg:block"
        style={{
          transform: "rotate(-13deg)",
          background: "linear-gradient(to bottom, transparent, black 20%, black 80%, transparent)",
        }}
      />
      <div
        className="pointer-events-none absolute top-[10%] right-[6%] h-[55%] w-[38%] opacity-70"
        style={{
          background: "radial-gradient(ellipse at center, rgba(0,0,0,0.07), transparent 68%)",
          animation: "h2Pulse 6s ease-in-out infinite",
        }}
      />
      <div
        className="pointer-events-none absolute top-[24%] right-[14%] h-[30%] w-[24%] opacity-60"
        style={{ background: "radial-gradient(circle, rgba(0,0,0,0.08), transparent 72%)" }}
      />

      <div
        className={`relative z-10 mx-auto grid max-w-[1600px] grid-cols-1 items-center gap-10 px-6 py-20 lg:grid-cols-[1fr_1.05fr] lg:gap-8 lg:px-14 lg:py-28 ${visible ? "h2-visible" : ""}`}
      >
        {/* ===== coluna esquerda — texto ===== */}
        <div className="max-w-xl">
          <div className="h2-anim flex items-center gap-3" style={{ animationDelay: "80ms" }}>
            <span className="h-3 w-px bg-black" aria-hidden />
            <span className="eyebrow">Setups prontos</span>
          </div>

          <h2 className="mt-5">
            <span
              className="h2-anim block text-[13px] font-semibold tracking-[0.3em] text-muted-foreground uppercase"
              style={{ animationDelay: "160ms" }}
            >
              A melhor
            </span>
            <span
              className="h2-anim display block text-[clamp(2.75rem,11vw,4.75rem)] leading-[0.92] whitespace-nowrap lg:text-[clamp(3rem,6vw,5.25rem)]"
              style={{ animationDelay: "240ms" }}
            >
              experiência<span className="text-black">.</span>
            </span>
          </h2>

          <p
            className="h2-anim mt-7 max-w-md text-[16px] leading-relaxed text-muted-foreground md:text-[17px]"
            style={{ animationDelay: "340ms" }}
          >
            Setups de alta performance, montados sob medida e prontos para render, competir ou só existir bonito na
            sua mesa.
          </p>

          <div
            className="h2-anim mt-9 flex flex-col items-start gap-3.5 sm:flex-row sm:items-center"
            style={{ animationDelay: "420ms" }}
          >
            <a
              href="#projetos"
              className="group relative inline-flex w-full items-center justify-center gap-2.5 overflow-hidden rounded-md bg-foreground px-6 py-3.5 text-[12px] font-bold tracking-[0.14em] text-background uppercase transition-all hover:opacity-90 sm:w-auto"
            >
              <span className="relative z-10">Ver setups prontos</span>
              <ArrowUpRight className="relative z-10 size-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </a>
            <a
              href={WHATSAPP_URL}
              target="_blank"
              rel="noreferrer"
              className="inline-flex w-full items-center justify-center gap-2.5 rounded-md border border-border-strong px-6 py-3.5 text-[12px] font-bold tracking-[0.14em] text-foreground uppercase transition-colors hover:border-black/40 sm:w-auto"
            >
              <WhatsAppIcon className="size-4" />
              Falar no WhatsApp
            </a>
          </div>

          {/* paginação sincronizada com o carrossel */}
          <div
            className="h2-anim mt-11 flex items-center gap-3 border-t border-border/60 pt-5"
            style={{ animationDelay: "500ms" }}
          >
            {SLIDES.map((_, i) => (
              <button
                key={i}
                type="button"
                onClick={() => setActive(i)}
                onMouseEnter={() => (pausedRef.current = true)}
                onMouseLeave={() => (pausedRef.current = false)}
                aria-label={`Ver build ${i + 1}`}
                className="p-1"
              >
                <span
                  className={`block h-1.5 rounded-full transition-all duration-500 ${
                    active === i ? "w-7 bg-foreground" : "w-1.5 bg-border-strong hover:bg-muted-foreground"
                  }`}
                />
              </button>
            ))}
          </div>
        </div>

        {/* ===== coluna direita — produto flutuante ===== */}
        <div
          ref={panelRef}
          className="h2-anim relative mx-auto aspect-[4/5] w-full max-w-[440px] lg:mx-0 lg:ml-auto lg:max-w-[500px]"
          style={{ animationDelay: "180ms" }}
        >
          {/* sombra de chão — dá peso ao objeto flutuante */}
          <div
            className="absolute bottom-[6%] left-1/2 h-8 w-[62%] -translate-x-1/2 rounded-full opacity-50 blur-xl"
            style={{ background: "radial-gradient(ellipse, rgba(0,0,0,0.9), transparent 75%)" }}
          />

          {/* glow ambiente atrás do produto */}
          <div
            className="absolute inset-[4%] rounded-full opacity-90"
            style={{ background: "radial-gradient(circle, rgba(0,0,0,0.07), transparent 66%)" }}
          />

          {/* cantoneiras — detalhe técnico premium */}
          <div className="absolute top-0 left-0 size-9 border-t border-l border-black/15" />
          <div className="absolute right-0 bottom-0 size-9 border-r border-b border-black/15" />

          {/* produto — pilha com crossfade */}
          <div
            className="absolute inset-0 flex items-center justify-center"
            style={{
              transform: `perspective(1200px) rotateX(${tilt.y * -6}deg) rotateY(${tilt.x * 8}deg)`,
              transition: "transform 0.5s cubic-bezier(0.16,1,0.3,1)",
            }}
          >
            {SLIDES.map((src, i) => (
              <img
                key={src}
                src={src}
                alt={i === active ? "Setup All Frames Technology montado, iluminação RGB" : ""}
                aria-hidden={i !== active}
                loading={i === 0 ? "eager" : "lazy"}
                decoding="async"
                draggable={false}
                className="absolute w-[88%] max-w-[440px] transition-all duration-700 ease-out"
                style={{
                  opacity: active === i ? 1 : 0,
                  transform: `scale(${active === i ? 1 : 0.94}) translateY(${active === i ? 0 : 14}px)`,
                  filter: "drop-shadow(0 36px 44px rgba(0,0,0,0.7))",
                  pointerEvents: active === i ? "auto" : "none",
                }}
              />
            ))}
          </div>

          {/* seta — avança o slide */}
          <button
            type="button"
            onClick={() => setActive((i) => (i + 1) % SLIDES.length)}
            onMouseEnter={() => (pausedRef.current = true)}
            onMouseLeave={() => (pausedRef.current = false)}
            aria-label="Próximo setup"
            className="group absolute right-2 bottom-2 flex size-12 items-center justify-center rounded-full bg-foreground text-background transition-transform hover:scale-105 active:scale-95"
            style={{ boxShadow: "0 14px 34px -10px rgba(0,0,0,0.65)" }}
          >
            <ChevronRight className="size-5 transition-transform group-hover:translate-x-0.5" />
          </button>
        </div>
      </div>
    </section>
  );
}
