import { ArrowUpRight } from "lucide-react";
import { WHATSAPP_URL } from "@/data/site";
import artwork from "@/assets/black-frames-2026.png";

type CampaignStage = "teaser" | "live" | "ended";

function getCampaignStage(now = new Date()): CampaignStage {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: "America/Sao_Paulo",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(now);
  const value = Object.fromEntries(parts.map((part) => [part.type, part.value]));
  const date = `${value.year}-${value.month}-${value.day}`;

  if (date < "2026-11-23") return "teaser";
  if (date <= "2026-11-28") return "live";
  return "ended";
}

function CampaignTicker({ stage }: { stage: Exclude<CampaignStage, "ended"> }) {
  const message = stage === "live" ? "BLACK FRAMES NO AR" : "BLACK FRAMES VEM AÍ";

  return (
    <div className="overflow-hidden border-y border-white/15 bg-black py-3 text-white" aria-label={`${message}, de 23 a 28 de novembro`}>
      <div className="flex w-max animate-marquee items-center" aria-hidden>
        {[0, 1].map((copy) => (
          <div key={copy} className="flex shrink-0 items-center">
            {Array.from({ length: 6 }).map((_, index) => (
              <span key={index} className="flex items-center gap-6 px-6 text-[11px] font-bold tracking-[0.22em] uppercase sm:text-xs">
                {message}
                <span className="size-1.5 rotate-45 bg-white/75" />
                23–28 NOV
                <span className="size-1.5 rotate-45 bg-white/75" />
              </span>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

export function BlackFramesHero() {
  const stage = getCampaignStage();
  if (stage === "ended") return null;

  return (
    <section className="relative bg-black pt-24 text-white sm:pt-28" aria-labelledby="black-frames-title">
      <div className="relative mx-auto max-w-[1600px] overflow-hidden border-y border-white/10 bg-black">
        <img
          src={artwork}
          alt="Black Frames vem aí, de 23 a 28 de novembro"
          fetchPriority="high"
          className="h-[66svh] min-h-[520px] w-full object-cover object-center sm:h-auto sm:min-h-0"
        />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black via-transparent to-black/10" />
        <div className="absolute inset-x-0 bottom-0 flex justify-center px-5 pb-6 sm:justify-end sm:px-10 sm:pb-10">
          <a
            href={WHATSAPP_URL}
            target="_blank"
            rel="noreferrer"
            className="group inline-flex items-center gap-3 rounded-full border border-white/25 bg-black/70 px-5 py-3 text-[11px] font-bold tracking-[0.14em] uppercase shadow-2xl backdrop-blur-md transition hover:bg-white hover:text-black sm:px-6 sm:py-3.5 sm:text-xs"
          >
            {stage === "live" ? "Aproveitar a Black Frames" : "Quero saber primeiro"}
            <ArrowUpRight className="size-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </a>
        </div>
      </div>
      <h1 id="black-frames-title" className="sr-only">Black Frames — de 23 a 28 de novembro</h1>
      <CampaignTicker stage={stage} />
    </section>
  );
}

export function BlackFramesFooterPromo() {
  const stage = getCampaignStage();
  if (stage === "ended") return null;

  return (
    <aside className="relative overflow-hidden border-y border-white/10 bg-black text-white">
      <div className="absolute inset-0 opacity-20 [background-image:linear-gradient(rgba(255,255,255,.08)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.08)_1px,transparent_1px)] [background-size:48px_48px]" />
      <div className="relative mx-auto flex max-w-[1600px] flex-col items-start justify-between gap-6 px-6 py-12 sm:flex-row sm:items-center lg:px-14">
        <div>
          <p className="text-[10px] font-semibold tracking-[0.25em] text-white/55 uppercase">23–28 novembro</p>
          <p className="display mt-2 text-4xl sm:text-5xl">{stage === "live" ? "BLACK FRAMES NO AR" : "BLACK FRAMES VEM AÍ"}</p>
        </div>
        <a
          href={WHATSAPP_URL}
          target="_blank"
          rel="noreferrer"
          className="group inline-flex items-center gap-3 rounded-full bg-white px-5 py-3 text-[11px] font-bold tracking-[0.14em] text-black uppercase sm:px-6 sm:py-3.5 sm:text-xs"
        >
          Falar com a equipe
          <ArrowUpRight className="size-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
        </a>
      </div>
    </aside>
  );
}

export function BlackFramesCornerBadge() {
  const stage = getCampaignStage();
  if (stage === "ended") return null;

  return (
    <a
      href={WHATSAPP_URL}
      target="_blank"
      rel="noreferrer"
      aria-label="Black Frames, de 23 a 28 de novembro"
      className="fixed bottom-5 left-5 z-40 hidden items-center gap-2 rounded-full border border-white/15 bg-black/80 px-4 py-2.5 text-[10px] font-bold tracking-[0.16em] text-white uppercase shadow-2xl backdrop-blur-md transition hover:scale-[1.03] md:flex"
    >
      <span className="size-2 animate-pulse rounded-full bg-white" />
      {stage === "live" ? "Black Frames no ar" : "Black Frames vem aí"}
    </a>
  );
}
