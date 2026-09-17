import { useEffect, useState, lazy, Suspense } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "@tanstack/react-router";
import { Menu, X, MapPin, Instagram, ArrowUpRight, Settings } from "lucide-react";
import { NAV, WHATSAPP_URL, INSTAGRAM, INSTAGRAM_URL, ADDRESS } from "@/data/site";
import { scrollToSection } from "@/lib/scrollToSection";
import logo from "@/assets/logo.webp";

// SettingsPanel carregado sob demanda (React.lazy), não mais com import
// estático no topo do arquivo. Motivo: o Header aparece em TODA página do
// site, e o import estático antigo trazia a SettingsPanel — e com ela a lib
// "motion" (motion/react) que ela usa por baixo — pro bundle inicial de
// qualquer visitante, mesmo que 99% nunca cliquem na engrenagem. O
// PageSpeed apontou ~325 KiB de "JavaScript não usado" no carregamento
// inicial; essa lib era a suspeita mais forte. Com lazy(), esse pedaço só é
// baixado quando alguém realmente abre o painel (ver `settingsLoaded`
// abaixo) — o painel em si continua idêntico, só o momento do download
// muda.
const SettingsPanel = lazy(() =>
  import("@/components/site/SettingsPanel").then((mod) => ({ default: mod.SettingsPanel })),
);

function WhatsAppIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden>
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413" />
    </svg>
  );
}

const SECTION_IDS = NAV.map((item) => item.href.slice(1));

export function Header() {
  const { t } = useTranslation("header");
  // true enquanto a hero (id="top") ainda ocupa o espaço atrás do header —
  // é o que decide se o header fica 100% transparente (sobre a hero) ou
  // ganha o vidro fosco (sobre o resto da página).
  const [overHero, setOverHero] = useState(true);
  const [open, setOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  // true assim que a engrenagem é clicada pela PRIMEIRA vez — depois disso
  // o componente lazy fica montado pra sempre (precisa continuar montado
  // mesmo com settingsOpen=false, porque a própria SettingsPanel usa
  // AnimatePresence por dentro pra fazer a animação de fechar; desmontar
  // na hora cortaria essa animação pela metade).
  const [settingsLoaded, setSettingsLoaded] = useState(false);
  const [activeHash, setActiveHash] = useState(NAV[0]!.href);

  useEffect(() => {
    // offset abaixo do header fixo — uma seção só vira "ativa" quando seu
    // topo já passou por baixo da barra fixa, não assim que encosta nela.
    const headerOffset = 160;

    const updateFromScrollPosition = () => {
      const heroEl = document.getElementById("top");
      const heroBottom = heroEl ? heroEl.getBoundingClientRect().bottom : 0;
      setOverHero(heroBottom > 96);

      let current = SECTION_IDS[0]!;
      for (const id of SECTION_IDS) {
        const el = document.getElementById(id);
        if (el && el.getBoundingClientRect().top <= headerOffset) {
          current = id;
        }
      }
      setActiveHash(`#${current}`);
    };

    // Throttle via requestAnimationFrame — mesmo padrão já usado no scroll
    // do carrossel (ShowcaseMarquee.tsx). Antes esse handler rodava por
    // INTEIRO (getElementById + getBoundingClientRect em ~7 elementos) a
    // cada evento nativo de "scroll", que no mobile pode disparar dezenas
    // de vezes por segundo — era um dos maiores suspeitos das "tarefas
    // longas" do PageSpeed, e roda em toda página do site (esse Header
    // aparece em todas). Com o rAF, no máximo 1 execução por frame
    // (~60x/s), não importa quantos eventos de scroll cheguem entre um
    // frame e outro.
    let raf = 0;
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(updateFromScrollPosition);
    };

    updateFromScrollPosition();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  // Trava o scroll da página por trás enquanto o menu mobile está aberto,
  // e fecha com Esc.
  useEffect(() => {
    if (!open) return;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <header className="fixed inset-x-0 top-0 z-50 px-3 pt-3 sm:px-4 sm:pt-4">
      {/* uma única pill flutuante, sempre — logo e botão de menu vivem
          dentro do mesmo contorno, nunca soltos cada um no seu canto.
          Sobre a hero fica bem sutil (um traço de contorno + leve vidro,
          só o suficiente pra se definir contra a foto de fundo); assim
          que a hero sai de trás do header, ganha o vidro fosco escuro. */}
      <div
        className={`mx-auto flex max-w-[1400px] items-center justify-between gap-3 rounded-full border px-4 py-2.5 transition-all duration-300 sm:px-5 md:grid md:grid-cols-[1fr_auto_1fr] md:gap-4 md:px-6 md:py-3 ${
          overHero
            ? "border-white/20 bg-black/15 backdrop-blur-sm"
            : "border-white/12 bg-black/45 shadow-[0_8px_32px_-12px] shadow-black/60 backdrop-blur-xl"
        }`}
      >
        <Link
          to="/"
          onClick={(e) => {
            if (window.location.pathname === "/") {
              e.preventDefault();
              scrollToSection("top");
              setActiveHash("#top");
            }
          }}
          className="group flex items-center gap-3 justify-self-start"
        >
          <img
            src={logo}
            alt="All Frames Technology"
            className="h-8 w-auto object-contain transition-transform duration-300 group-hover:scale-[1.05] md:h-10"
          />
          <span className="flex flex-col leading-none">
            <span className="text-[12px] font-extrabold tracking-[-0.02em] text-white uppercase md:text-[13px]">
              All Frames
            </span>
            <span className="mt-1 font-mono text-[8px] font-medium tracking-[0.28em] text-white/50 uppercase transition-colors group-hover:text-white md:text-[9px] md:tracking-[0.3em]">
              Technology
            </span>
          </span>
        </Link>

        <nav className="hidden items-center gap-1 md:flex">
          {NAV.map((item) => {
            const isActive = activeHash === item.href;
            return (
              <Link
                key={item.href}
                to="/"
                // "Início" (#top) não leva hash pra URL — ir pra "/" já
                // deixa no topo da home, sem precisar do "#top" aparecendo
                // no endereço quando vem de outra página.
                hash={item.href === "#top" ? undefined : item.href.slice(1)}
                onClick={(e) => {
                  if (window.location.pathname === "/") {
                    e.preventDefault();
                    scrollToSection(item.href.slice(1));
                    setActiveHash(item.href);
                  }
                }}
                className={`group relative px-3.5 py-2 text-[14px] font-medium whitespace-nowrap transition-colors ${
                  isActive ? "text-white" : "text-white/60 hover:text-white"
                }`}
              >
                {t(`nav:${item.key}`)}
                <span
                  className={`absolute inset-x-3.5 -bottom-0.5 h-px origin-center bg-white transition-transform duration-300 ease-out ${
                    isActive ? "scale-x-100" : "scale-x-0 group-hover:scale-x-100"
                  }`}
                />
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center justify-end gap-2 justify-self-end">
          <a
            href={WHATSAPP_URL}
            target="_blank"
            rel="noreferrer"
            // mesmo efeito de hover do CTA principal da Hero (Hero.tsx,
            // "MONTAR MEU SETUP"): sombra mais funda + o "brilho" diagonal
            // varrendo o pill, em vez do simples escurecimento de fundo que
            // esse botão tinha antes. Padroniza a animação dos dois botões.
            className="group relative hidden items-center gap-2 overflow-hidden rounded-full bg-white px-4.5 py-2.5 text-[11px] font-bold tracking-[0.1em] text-black uppercase shadow-[0_6px_24px_-8px] shadow-black/40 transition-all hover:shadow-black/60 md:inline-flex"
          >
            <WhatsAppIcon className="relative z-10 size-3.5" />
            <span className="relative z-10">{t("talkToUs")}</span>
            <ArrowUpRight className="relative z-10 size-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            <span
              className="absolute inset-0 -translate-x-full bg-black/10 transition-transform duration-700 ease-out group-hover:translate-x-full"
              style={{ transform: "skewX(-20deg)" }}
            />
          </a>

          {/* engrenagem — abre o painel de Configurações (SettingsPanel.tsx):
              tema, cookies, idioma, animações e cursor. Fica à direita do
              botão de contato em qualquer largura de tela (não é
              md:hidden/md:inline-flex como os outros dois), já que
              configurações fazem sentido tanto no mobile quanto no desktop. */}
          <button
            type="button"
            onClick={() => {
              setSettingsLoaded(true);
              setSettingsOpen(true);
            }}
            aria-label={t("openSettings")}
            className="flex size-10 shrink-0 items-center justify-center rounded-full text-white transition-colors hover:bg-white/10"
          >
            <Settings className="size-4.5" />
          </button>

          <button
            onClick={() => setOpen((v) => !v)}
            aria-label={open ? t("closeMenu") : t("openMenu")}
            aria-expanded={open}
            aria-controls="mobile-nav"
            className="relative z-10 -mr-1.5 flex size-10 shrink-0 items-center justify-center rounded-full text-white transition-colors hover:bg-white/10 md:hidden"
          >
            {open ? <X className="size-5" /> : <Menu className="size-5" />}
          </button>
        </div>
      </div>

      {/* backdrop — clique fora fecha o menu */}
      {open && (
        <div
          className="fixed inset-0 -z-10 bg-black/70 md:hidden"
          onClick={() => setOpen(false)}
          aria-hidden
        />
      )}

      {open && (
        <div
          id="mobile-nav"
          className="animate-in fade-in slide-in-from-top-2 mt-2 max-h-[calc(100svh-6rem)] overflow-y-auto rounded-3xl border border-white/12 bg-black/70 shadow-[0_16px_48px_-16px] shadow-black/60 backdrop-blur-xl duration-300 md:hidden"
        >
          <nav className="flex flex-col px-6 pt-2 pb-6">
            {NAV.map((item, i) => (
              <Link
                key={item.href}
                to="/"
                hash={item.href === "#top" ? undefined : item.href.slice(1)}
                onClick={(e) => {
                  setOpen(false);
                  if (window.location.pathname === "/") {
                    e.preventDefault();
                    scrollToSection(item.href.slice(1));
                    setActiveHash(item.href);
                  }
                }}
                className="reveal-left group flex items-center justify-between gap-4 border-b border-white/10 py-5 transition-colors"
                style={{ animationDelay: `${i * 60}ms` }}
              >
                <span className="flex items-baseline gap-4">
                  <span className="font-mono text-[11px] text-white/35">
                    0{i + 1}
                  </span>
                  <span className="display text-2xl text-white transition-colors">
                    {t(`nav:${item.key}`)}
                  </span>
                </span>
                <ArrowUpRight className="size-4 shrink-0 text-white/50 transition-all duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-white" />
              </Link>
            ))}

            <a
              href={WHATSAPP_URL}
              target="_blank"
              rel="noreferrer"
              className="reveal-left mt-6 inline-flex items-center justify-center gap-3 rounded-full bg-white px-4 py-4 text-center text-[12px] font-bold tracking-[0.1em] text-black uppercase shadow-[0_8px_40px_-8px] shadow-black/40"
              style={{ animationDelay: `${NAV.length * 60}ms` }}
            >
              <WhatsAppIcon className="size-3.5" />
              {t("talkToUs")}
            </a>

            <div
              className="reveal-left mt-8 flex flex-col gap-3 border-t border-white/10 pt-6 text-[12px] text-white/55"
              style={{ animationDelay: `${(NAV.length + 1) * 60}ms` }}
            >
              <a
                href={INSTAGRAM_URL}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-2 transition-colors hover:text-white"
              >
                <Instagram className="size-3.5 shrink-0" aria-hidden />
                {INSTAGRAM}
              </a>
              <span className="flex items-start gap-2">
                <MapPin className="mt-0.5 size-3.5 shrink-0" aria-hidden />
                {ADDRESS}
              </span>
            </div>
          </nav>
        </div>
      )}

      {settingsLoaded && (
        <Suspense fallback={null}>
          <SettingsPanel open={settingsOpen} onClose={() => setSettingsOpen(false)} />
        </Suspense>
      )}
    </header>
  );
}
