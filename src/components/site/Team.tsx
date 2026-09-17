import { useEffect, useRef, useState, type CSSProperties, type PointerEvent } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import { useTranslation } from "react-i18next";
import { TEAM } from "@/data/site";
import { SectionFade } from "@/components/site/SectionFade";
import raif from "@/assets/rai-1.webp"
import joaog from "@/assets/joao-g.webp"
import luizw from "@/assets/luiz-w.webp";
import gabrield from "@/assets/gabriel-d.webp";

const PHOTOS: (string | undefined)[] = [luizw, joaog, raif, gabrield];

function initials(name: string) {
  const parts = name.split(" ");
  return `${parts[0]?.[0] ?? ""}${parts[parts.length - 1]?.[0] ?? ""}`;
}

function TeamCard({
  index,
  name,
  role,
  bio,
  photo,
  visible = true,
  delay = 0,
}: {
  index: number;
  name: string;
  role: string;
  bio: string;
  photo?: string | undefined;
  visible?: boolean;
  delay?: number;
}) {
  const { t } = useTranslation("team");
  const cardRef = useRef<HTMLDivElement>(null);
  const [style, setStyle] = useState<CSSProperties>({});
  // mobile só: sem hover de verdade em touch, então a ocupação (bio) abre
  // por toque num botão, cobrindo o card inteiro — nunca estourando a
  // altura fixa dele — e fecha por um botão "Voltar" dedicado.
  const [expanded, setExpanded] = useState(false);

  // onPointerMove/Leave (não onMouseMove/Leave) de propósito: um toque no
  // celular também dispara eventos de mouse "sintéticos" pro navegador
  // conseguir emular clique em cima de elementos com hover — inclusive
  // mousemove, com a posição exata do toque. Sem o filtro por pointerType,
  // isso calculava uma inclinação a partir do ponto tocado e aplicava (o
  // "mouseleave" que desfaria nunca vem de um toque), deixando o card
  // torto/travado depois de tocar nele no mobile. Com o filtro, só o mouse
  // de verdade (desktop) inclina o card — toque não faz mais nada aqui.
  const onMove = (e: PointerEvent<HTMLDivElement>) => {
    if (e.pointerType !== "mouse") return;
    const el = cardRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width;
    const py = (e.clientY - rect.top) / rect.height;
    const rotateY = (px - 0.5) * 14;
    const rotateX = (0.5 - py) * 14;
    setStyle({
      transform: `perspective(900px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02,1.02,1.02)`,
      "--mx": `${px * 100}%`,
      "--my": `${py * 100}%`,
    } as CSSProperties);
  };

  const onLeave = (e: PointerEvent<HTMLDivElement>) => {
    if (e.pointerType !== "mouse") return;
    setStyle({
      transform: "perspective(900px) rotateX(0deg) rotateY(0deg) scale3d(1,1,1)",
    });
  };

  return (
    <div
      style={{ perspective: "900px", animationDelay: `${delay}ms` }}
      className={visible ? "reveal-left" : "opacity-0"}
    >
      <div
        ref={cardRef}
        onPointerMove={onMove}
        onPointerLeave={onLeave}
        style={{
          transition: "transform 0.5s cubic-bezier(0.16,1,0.3,1)",
          boxShadow: "var(--card-shadow)",
          ...style,
        }}
        className="group relative aspect-[3/5.5] w-full overflow-hidden rounded-lg border border-border bg-surface will-change-transform lg:aspect-[3/4]"
      >
        {/* cursor-tracked spotlight */}
        <div
          className="pointer-events-none absolute inset-0 z-20 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
          style={{
            background:
              "radial-gradient(circle at var(--mx,50%) var(--my,50%), rgba(255,255,255,0.14), transparent 45%)",
          }}
        />
        {/* edge glow on hover */}
        <div
          className="pointer-events-none absolute inset-0 z-20 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
          style={{
            boxShadow: "inset 0 0 0 1px rgba(0,0,0,0.4), 0 24px 60px -20px rgba(0,0,0,0.3)",
          }}
        />

        {/* photo or placeholder plate */}
        {photo ? (
          <img
            src={photo}
            alt={name}
            loading="lazy"
            decoding="async"
            className="absolute inset-0 size-full object-cover object-top grayscale-[10%] transition-transform duration-700 ease-out group-hover:scale-[1.06]"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center bg-[linear-gradient(160deg,theme(colors.surface)_0%,theme(colors.background)_100%)]">
            <span className="placeholder-initials text-6xl font-bold tracking-[-0.04em]">
              {initials(name)}
            </span>
            <div
              className="absolute inset-0 opacity-[0.06] mix-blend-overlay"
              style={{
                backgroundImage:
                  "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='120' height='120'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
              }}
            />
          </div>
        )}

        {/* legibility gradient — mantém a legenda (nome/cargo) legível por
            cima de qualquer foto ou do placeholder. var(--card-caption-overlay)
            já é preto no tema escuro e branco no tema claro (ver styles.css),
            então o card nunca fica com um véu/placa preta solta em cima de
            um fundo claro — pedido explícito: preto só continua no dark. */}
        <div
          className="absolute inset-0 z-10"
          style={{ background: "var(--card-caption-overlay)" }}
        />


        {/*
          Bottom panel. Name + role are always fully shown, sized to their own
          content — no more magic "reveal height" that clipped a wrapped role
          line (the bug in your screenshot: "TÉCNICA" / "ADMINISTRADOR" cut
          off at the card edge whenever the role wrapped to 2 lines).
          The bio grows in on hover using a 0fr → 1fr grid-rows transition,
          which animates to the paragraph's real height instead of a guessed
          number, so it never clips regardless of how long the bio is.
          It's hidden below md: on touch devices there's no real hover, and a
          tap can leave :hover "stuck" — that's what was expanding the bio
          permanently and blowing out the card's height on mobile. Below md,
          the panel stays just name + role, leaving more room for the photo.
        */}
        <div
          className="absolute inset-x-0 bottom-0 z-20 px-5 pt-4 pb-5"
          style={{ backgroundColor: "var(--card-caption-bg)" }}
        >
          <h3 className="display text-lg md:text-xl" style={{ color: "var(--foreground)" }}>
            {name}
          </h3>
          <p className="mt-1 text-[10px] tracking-[0.14em] text-muted-foreground uppercase">{role}</p>
          <div className="hidden grid-rows-[0fr] transition-[grid-template-rows] duration-500 ease-out md:grid md:group-hover:grid-rows-[1fr]">
            <div className="overflow-hidden">
              <p className="pt-3 text-[12px] leading-relaxed text-muted-foreground/80">{bio}</p>
            </div>
          </div>
        </div>

        {/* mobile — botão pra ver a ocupação completa (a bio), já que touch
            não tem hover pra revelar como no desktop */}
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            setExpanded(true);
          }}
          aria-label={t("expandAriaLabel")}
          aria-expanded={expanded}
          className="absolute right-3 bottom-3 z-30 inline-flex size-8 items-center justify-center rounded-full border border-white/20 bg-black/60 text-white backdrop-blur-sm transition-colors hover:bg-black/75 md:hidden"
        >
          <ChevronDown className="size-4" />
        </button>

        {/* mobile — pop-out cobrindo o card inteiro com a ocupação completa;
            nunca estoura a altura fixa do card, e o botão "Voltar" fecha */}
        <div
          className={`absolute inset-0 z-40 flex flex-col justify-end bg-black/90 p-5 backdrop-blur-sm transition-opacity duration-300 md:hidden ${
            expanded ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0"
          }`}
        >
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setExpanded(false);
            }}
            aria-label={t("backLabel")}
            className="absolute top-3 right-3 inline-flex items-center gap-1.5 rounded-full border border-white/20 bg-black/55 px-3 py-1.5 text-[10px] font-semibold tracking-[0.1em] text-white uppercase backdrop-blur-sm transition-colors hover:bg-black/75"
          >
            <ChevronUp className="size-3.5" />
            {t("backLabel")}
          </button>
          <h3 className="display text-lg text-white">{name}</h3>
          <p className="mt-1 text-[10px] tracking-[0.14em] text-white/55 uppercase">{role}</p>
          <p className="mt-3 text-[12px] leading-relaxed text-white/85">{bio}</p>
        </div>
      </div>
    </div>
  );
}

export function Team() {
  const { t } = useTranslation("team");
  const sectionRef = useRef<HTMLElement>(null);
  const [visible, setVisible] = useState(false);

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
      { threshold: 0.15 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <section id="equipe" ref={sectionRef} className="relative">
      {/* degradê das divisas com as seções vizinhas — mesmo tier (preto) dos dois lados */}
      <SectionFade side="top" />
      <SectionFade side="bottom" />

      {/* sem borda no topo de propósito — Equipe é continuação direta do
          "Quem somos" (AboutUs.tsx) logo acima, não uma seção nova. A
          quebra visual real fica só depois, entre Equipe e Serviços. Mesmo
          sem borda, o espaço acima foi aumentado pra dar respiro entre o
          fim do texto do AboutUs e o título "Nossa Equipe". */}
      <div className="mx-auto max-w-[1600px] px-6 pt-14 pb-16 lg:px-14 md:pt-20 md:pb-20">
        <div className="max-w-xl text-veil">
          <h2 className={`display text-3xl md:text-5xl ${visible ? "reveal-left" : "opacity-0"}`}>
            {t("title")}
          </h2>
          <p
            className={`mt-4 max-w-md text-[14px] leading-relaxed text-muted-foreground ${visible ? "reveal-left" : "opacity-0"}`}
            style={{ animationDelay: "80ms" }}
          >
            {t("subtitle")}
          </p>
        </div>

        <div className="mt-10 grid grid-cols-2 gap-3 sm:gap-5 lg:grid-cols-4 lg:gap-6">
          {TEAM.map((member, i) => (
            <TeamCard
              key={member.name}
              index={i}
              name={member.name}
              role={t(`members.${member.key}.role`)}
              bio={t(`members.${member.key}.bio`)}
              photo={PHOTOS[i]}
              visible={visible}
              delay={160 + i * 80}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
