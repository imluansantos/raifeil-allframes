import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "@tanstack/react-router";
import { Instagram, Loader2, MapPin, Send, Youtube } from "lucide-react";
import {
  ADDRESS,
  DEVELOPER_NAME,
  DEVELOPER_URL,
  INSTAGRAM_URL,
  NAV,
  PHONE_DISPLAY,
  TIKTOK_URL,
  WHATSAPP_URL,
  YOUTUBE_URL,
} from "@/data/site";
import { SiteTexture } from "@/components/site/SiteTexture";
import { SectionFade } from "@/components/site/SectionFade";
import { ThemeToggle } from "@/components/site/ThemeToggle";
import { CookiePreferencesModal } from "@/components/site/CookiePreferencesModal";
import { scrollToSection } from "@/lib/scrollToSection";
import logo from "@/assets/logo.webp";

// lucide-react não tem ícone de TikTok (pedidos de brand icon nesse pacote
// ficam sistematicamente fora do escopo deles) — mesmo caso do WhatsApp no
// Header.tsx, resolvido do mesmo jeito: um SVG do glifo oficial, uma cor só,
// pra herdar a cor do texto via currentColor como qualquer ícone lucide.
function TiktokIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden>
      <path d="M12.53.02C13.84 0 15.14.01 16.44 0c.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07Z" />
    </svg>
  );
}

// lucide-react não tem ícone de WhatsApp — mesmo caso do TikTok acima:
// SVG do glifo oficial, cor única via currentColor.
function WhatsAppIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden>
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413" />
    </svg>
  );
}

// Duração do "loading" do formulário de newsletter, escolhida aleatoriamente
// a cada envio (não é uma faixa contínua, é um sorteio entre esses 5
// valores específicos, em ms).
const NEWSLETTER_LOADING_DURATIONS_MS = [500, 650, 750, 900, 1000, 1150, 1250, 1400, 1500, 1750, 3000];

/* `noTopBorder`: a home page passa isso porque o FinalCTA de lá termina
 * num arco decorativo (curva), e a linha reta desta borda cortava bem em
 * cima da curva, quebrando a transição. Nas outras páginas (que usam o
 * Footer sem esse arco) a borda continua normal — não passe essa prop lá. */
export function Footer({ noTopBorder = false }: { noTopBorder?: boolean }) {
  const { t } = useTranslation("footer");
  const [email, setEmail] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [subscribed, setSubscribed] = useState(false);
  const [cookieModalOpen, setCookieModalOpen] = useState(false);

  const footerRef = useRef<HTMLElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = footerRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          setVisible(true);
          io.disconnect();
        }
      },
      { threshold: 0.1 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <footer
      ref={footerRef}
      className={`relative overflow-hidden bg-background ${
        noTopBorder ? "" : "border-t border-border-strong"
      }`}
    >
      {/* degradê da divisa com a seção anterior — entra vindo de outro tier
          (cinza chumbo), mas ainda suaviza o grid bem no início */}
      <SectionFade side="top" />

      {/* background padrão do site — grid técnico + grain */}
      <SiteTexture />

      {/* assinatura de fundo — wordmark gigante e quase invisível, recurso
          clássico de rodapé de estúdio/agência (não é glow, não é blob:
          só tipografia, na mesma cor do texto, quase apagada) */}
      <span
        aria-hidden
        className="pointer-events-none absolute -bottom-[0.12em] left-1/2 w-full -translate-x-1/2 -z-[5] text-center leading-none font-black tracking-tighter text-foreground/[0.06] select-none"
        style={{ fontSize: "clamp(5rem, 17vw, 14rem)" }}
      >
        ALL FRAMES
      </span>

      <div className="relative mx-auto max-w-[1600px] px-6 pt-20 pb-10 lg:px-14 md:pt-28">
        {/* 4 colunas, igual à referência: Newsletter · Navegação · Contato · Redes.
            Layout apenas — a estética (grid/grain, wordmark, tons do site) continua
            a mesma que já estava aprovada. */}
        <div className="text-veil grid gap-14 md:grid-cols-12 md:gap-8">
          {/* newsletter */}
          <div
            className={`md:col-span-5 lg:col-span-4 ${visible ? "reveal-left" : "opacity-0"}`}
          >
            <Link
              to="/"
              onClick={(e) => {
                if (window.location.pathname === "/") {
                  e.preventDefault();
                  scrollToSection("top");
                }
              }}
              className="inline-flex items-center"
            >
              <img
                src={logo}
                alt="All Frames Technology"
                // logo.webp é um arquivo branco/claro (pensado pra fundo
                // escuro) — no tema claro o fundo do Footer vira branco e a
                // logo some. --brand-logo-invert (styles.css) é 0 no escuro
                // (sem inversão, a logo já nasce certa) e 1 no claro
                // (inverte pra preto).
                style={{ filter: "invert(var(--brand-logo-invert))" }}
                className="h-14 w-auto object-contain md:h-16"
              />
            </Link>

            <h3 className="display mt-5 text-2xl text-foreground md:text-[28px]">
              {t("stayConnected")}
            </h3>
            <p className="mt-2.5 max-w-xs text-[13px] leading-relaxed text-muted-foreground">
              {t("newsletterText")}
            </p>

            {/* newsletter — ainda sem serviço de e-mail integrado (ex:
                Mailchimp/Resend); captura o e-mail localmente e confirma
                pro usuário, mas não dispara envio de verdade até esse
                serviço ser conectado. */}
            {subscribed ? (
              <p className="mt-4 text-[13px] font-medium text-foreground">
                {t("newsletterSuccess")}
              </p>
            ) : (
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  if (!email.trim() || submitting) return;
                  setSubmitting(true);
                  // loading curto e aleatório antes da confirmação — sorteia
                  // entre os 5 valores fixos acima, não uma faixa contínua.
                  const delay =
                    NEWSLETTER_LOADING_DURATIONS_MS[
                      Math.floor(Math.random() * NEWSLETTER_LOADING_DURATIONS_MS.length)
                    ];
                  window.setTimeout(() => {
                    setSubmitting(false);
                    setSubscribed(true);
                  }, delay);
                }}
                className="mt-4 flex max-w-xs items-center gap-2"
              >
                <label htmlFor="footer-newsletter-email" className="sr-only">
                  {t("emailLabel")}
                </label>
                <input
                  id="footer-newsletter-email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={t("emailPlaceholder")}
                  disabled={submitting}
                  className="h-10 min-w-0 flex-1 rounded-md border border-border bg-surface px-3.5 text-[13px] text-foreground placeholder:text-muted-foreground/70 outline-none transition-colors focus:border-foreground/40 disabled:opacity-60"
                />
                <button
                  type="submit"
                  disabled={submitting}
                  aria-label={submitting ? t("subscribing") : t("subscribe")}
                  className="flex size-10 shrink-0 items-center justify-center rounded-full bg-foreground text-background transition-colors hover:bg-foreground/90 disabled:opacity-60"
                >
                  {submitting ? (
                    <Loader2 className="size-4 animate-spin" />
                  ) : (
                    <Send className="size-4" />
                  )}
                </button>
              </form>
            )}
          </div>

          {/* navegação — mesma lista usada no Header, pra nunca ficar
              fora de sincronia com os anchors reais do site */}
          <div
            className={`md:col-span-3 lg:col-span-2 ${visible ? "reveal-left" : "opacity-0"}`}
            style={{ animationDelay: "80ms" }}
          >
            <h3 className="eyebrow">{t("navHeading")}</h3>
            <ul className="mt-5 space-y-3">
              {NAV.map((item) => (
                <li key={item.href}>
                  <Link
                    to="/"
                    hash={item.href.slice(1)}
                    onClick={(e) => {
                      if (window.location.pathname === "/") {
                        e.preventDefault();
                        scrollToSection(item.href.slice(1));
                      }
                    }}
                    className="text-[13px] text-muted-foreground transition-colors hover:text-foreground"
                  >
                    {t(`nav:${item.key}`)}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* contato */}
          <div
            className={`md:col-span-2 lg:col-span-3 ${visible ? "reveal-left" : "opacity-0"}`}
            style={{ animationDelay: "140ms" }}
          >
            <h3 className="eyebrow">{t("contactHeading")}</h3>
            <ul className="mt-5 space-y-3 text-[13px] text-muted-foreground">
              <li>
                <a
                  href={WHATSAPP_URL}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 transition-colors hover:text-foreground"
                >
                  <WhatsAppIcon className="size-3.5 shrink-0 text-foreground/50" />
                  {PHONE_DISPLAY}
                </a>
              </li>
              <li className="flex items-start gap-2 leading-relaxed">
                <MapPin className="mt-0.5 size-3.5 shrink-0 text-foreground/50" aria-hidden />
                {ADDRESS}
              </li>
            </ul>
          </div>

          {/* redes sociais + alternância dark/light — igual à referência,
              o toggle vive junto dos ícones, na mesma coluna */}
          <div
            className={`md:col-span-2 lg:col-span-3 ${visible ? "reveal-left" : "opacity-0"}`}
            style={{ animationDelay: "200ms" }}
          >
            <h3 className="eyebrow">{t("socialHeading")}</h3>
            <div className="mt-5 flex gap-3">
              <a
                href={INSTAGRAM_URL}
                target="_blank"
                rel="noreferrer"
                aria-label="Instagram"
                className="flex size-9 items-center justify-center rounded-full border border-border text-muted-foreground transition-colors hover:border-foreground/40 hover:text-foreground"
              >
                <Instagram className="size-4" />
              </a>
              <a
                href={WHATSAPP_URL}
                target="_blank"
                rel="noreferrer"
                aria-label="WhatsApp"
                className="flex size-9 items-center justify-center rounded-full border border-border text-muted-foreground transition-colors hover:border-foreground/40 hover:text-foreground"
              >
                <WhatsAppIcon className="size-4" />
              </a>
              <a
                href={TIKTOK_URL}
                target="_blank"
                rel="noreferrer"
                aria-label="TikTok"
                className="flex size-9 items-center justify-center rounded-full border border-border text-muted-foreground transition-colors hover:border-foreground/40 hover:text-foreground"
              >
                <TiktokIcon className="size-4" />
              </a>
              <a
                href={YOUTUBE_URL}
                target="_blank"
                rel="noreferrer"
                aria-label="YouTube"
                className="flex size-9 items-center justify-center rounded-full border border-border text-muted-foreground transition-colors hover:border-foreground/40 hover:text-foreground"
              >
                <Youtube className="size-4" />
              </a>
            </div>

            <div className="mt-5">
              <ThemeToggle />
            </div>
          </div>
        </div>

        <div
          className={`relative mt-16 flex flex-col items-center justify-between gap-4 border-t border-border pt-7 text-center md:flex-row md:text-left ${visible ? "reveal-left" : "opacity-0"}`}
          style={{ animationDelay: "260ms" }}
        >
          <span className="flex flex-wrap items-center justify-center gap-x-1.5 text-[11px] tracking-wide text-muted-foreground/70 md:justify-start">
            {t("copyright", { year: new Date().getFullYear() })}
            <span aria-hidden className="text-muted-foreground/40">
              ·
            </span>
            <span>
              {t("developedBy")}{" "}
              <a
                href={DEVELOPER_URL}
                target="_blank"
                rel="noreferrer"
                className="text-muted-foreground/70 underline decoration-muted-foreground/30 underline-offset-2 transition-colors hover:text-foreground"
              >
                {DEVELOPER_NAME}
              </a>
            </span>
          </span>

          <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-[11px] tracking-wide text-muted-foreground/70">
            <Link to="/politica-de-privacidade" className="transition-colors hover:text-foreground">
              {t("privacyPolicy")}
            </Link>
            <Link to="/termos-de-uso" className="transition-colors hover:text-foreground">
              {t("termsOfUse")}
            </Link>
            <button
              type="button"
              onClick={() => setCookieModalOpen(true)}
              className="transition-colors hover:text-foreground"
            >
              {t("cookieSettings")}
            </button>
          </div>
        </div>
      </div>

      {cookieModalOpen && <CookiePreferencesModal onClose={() => setCookieModalOpen(false)} />}
    </footer>
  );
}
