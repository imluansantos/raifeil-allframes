import { useEffect, useRef, useState, type ReactNode } from "react";
import { useTranslation } from "react-i18next";
import { AnimatePresence, motion } from "motion/react";
import {
  Cookie,
  Laptop,
  MousePointer2,
  Moon,
  Settings,
  Sparkles,
  Sun,
  X,
  Zap,
} from "lucide-react";
import { useTheme } from "@/hooks/use-theme";
import { useAnimationLevel, type AnimationLevel } from "@/hooks/use-animation-level";
import { useCursor, CURSOR_OPTIONS } from "@/hooks/use-cursor";
import { CookieConsentFields } from "@/components/site/CookieConsentFields";

// Só os valores aqui — label e description vêm traduzidos de settings.json
// (chave "animations.<value>.label"/".description"), lidos no componente via
// useTranslation. Mesma ideia em CURSOR_OPTIONS (use-cursor.ts).
const ANIMATION_LEVELS: AnimationLevel[] = ["all", "reduced", "none"];

type SectionKey = "tema" | "cookies" | "animacoes" | "cursor";

// Só chave + ícone aqui — o label vem traduzido de settings.json → sections.*
// (useTranslation).
//
// A seção "Idioma" existiu aqui (troca entre pt/en/es/de/it) e foi removida
// por decisão do cliente — o site passou a ser só em português. O texto
// continua vindo de src/i18n/locales/pt/*.json via t("chave") normalmente
// (isso é o que o painel do Decap edita), só não existe mais nenhum jeito de
// trocar de idioma pela interface. Ver src/i18n/index.ts.
const SECTIONS: { key: SectionKey; icon: ReactNode }[] = [
  { key: "tema", icon: <Sun className="size-4" aria-hidden /> },
  { key: "cookies", icon: <Cookie className="size-4" aria-hidden /> },
  { key: "animacoes", icon: <Sparkles className="size-4" aria-hidden /> },
  { key: "cursor", icon: <MousePointer2 className="size-4" aria-hidden /> },
];

// Painel de Configurações, aberto pela engrenagem no Header — modal
// centralizado com sidebar de categorias à esquerda + conteúdo à direita,
// no mesmo layout de "Configurações" do Claude (pedido explícito): lista
// vertical de seções, uma ativa por vez, painel de conteúdo rolável do lado
// direito. Tema, Cookies, Animações e Cursor funcionam de verdade — cada um
// reaproveitando seu respectivo hook (use-theme, use-animation-level,
// use-cursor).
export function SettingsPanel({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { t } = useTranslation("settings");
  const { theme, toggle: toggleTheme } = useTheme();
  const { level, setLevel } = useAnimationLevel();
  const { cursor, setCursor } = useCursor();
  const [active, setActive] = useState<SectionKey>("tema");
  const panelRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  // volta pra primeira seção toda vez que o painel reabre
  useEffect(() => {
    if (open) setActive("tema");
  }, [open]);

  // Esc fecha, trava o scroll da página por trás, prende o foco (Tab/
  // Shift+Tab) dentro do painel, e devolve o foco pro botão que abriu ao
  // fechar — mesmo padrão de acessibilidade dos outros modais do site
  // (CookiePreferencesModal), com o foco preso a mais.
  useEffect(() => {
    if (!open) return;

    closeButtonRef.current?.focus();

    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
        return;
      }
      if (e.key !== "Tab" || !panelRef.current) return;
      const focusables = panelRef.current.querySelectorAll<HTMLElement>(
        'button, a[href], input, [tabindex]:not([tabindex="-1"])',
      );
      if (focusables.length === 0) return;
      const first = focusables[0]!;
      const last = focusables[focusables.length - 1]!;
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [open, onClose]);

  return (
    <>
      <AnimatePresence>
        {open && (
          <div className="fixed inset-0 z-90 flex items-center justify-center p-4">
            <motion.div
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={onClose}
              aria-hidden
            />

            <motion.div
              ref={panelRef}
              role="dialog"
              aria-modal="true"
              aria-label={t("title")}
              className="relative flex h-[min(640px,85vh)] w-full max-w-3xl overflow-hidden rounded-2xl border border-border bg-surface shadow-[0_24px_80px_-24px] shadow-black/60"
              initial={{ opacity: 0, scale: 0.97, y: 8 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.97, y: 8 }}
              transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
            >
              {/* sidebar — some no mobile (vira lista de botões no topo do
                  conteúdo, ver abaixo); no sm+ é a coluna fixa da esquerda,
                  igual ao layout de referência. */}
              <div className="hidden w-56 shrink-0 flex-col border-r border-border bg-background/40 px-3 py-4 sm:flex">
                <span className="px-2 pt-1 pb-2 text-[10.5px] font-semibold tracking-[0.12em] text-muted-foreground/60 uppercase">
                  {t("title")}
                </span>

                <nav className="flex flex-col gap-0.5">
                  {SECTIONS.map((s) => (
                    <button
                      key={s.key}
                      type="button"
                      onClick={() => setActive(s.key)}
                      aria-current={active === s.key}
                      className={`flex items-center gap-2.5 rounded-md px-2.5 py-2 text-left text-[13px] font-medium transition-colors ${
                        active === s.key
                          ? "bg-surface-2 text-foreground"
                          : "text-muted-foreground hover:bg-surface-2/60 hover:text-foreground"
                      }`}
                    >
                      {s.icon}
                      {t(`sections.${s.key}`)}
                    </button>
                  ))}
                </nav>
              </div>

              {/* conteúdo */}
              <div className="flex min-w-0 flex-1 flex-col">
                <div className="flex items-center justify-between gap-4 border-b border-border px-6 py-4">
                  <div className="flex items-center gap-2.5 sm:hidden">
                    <Settings className="size-4 text-foreground" aria-hidden />
                    <h2 className="display text-base text-foreground">{t("title")}</h2>
                  </div>
                  <h2 className="display hidden text-base text-foreground sm:block">
                    {t(`sections.${active}`)}
                  </h2>
                  <button
                    ref={closeButtonRef}
                    type="button"
                    onClick={onClose}
                    aria-label={t("close")}
                    className="rounded-full p-1.5 text-muted-foreground transition-colors hover:text-foreground"
                  >
                    <X className="size-4.5" />
                  </button>
                </div>

                {/* abas horizontais — só no mobile, onde a sidebar vira isso */}
                <div className="flex gap-1.5 overflow-x-auto border-b border-border px-4 py-2.5 sm:hidden">
                  {SECTIONS.map((s) => (
                    <button
                      key={s.key}
                      type="button"
                      onClick={() => setActive(s.key)}
                      className={`inline-flex shrink-0 items-center gap-1.5 rounded-full border px-3 py-1.5 text-[12px] font-medium whitespace-nowrap transition-colors ${
                        active === s.key
                          ? "border-foreground/30 bg-surface-2 text-foreground"
                          : "border-border text-muted-foreground"
                      }`}
                    >
                      {s.icon}
                      {t(`sections.${s.key}`)}
                    </button>
                  ))}
                </div>

                <div className="flex-1 overflow-y-auto px-6 py-6">
                  {active === "tema" && (
                    <div className="max-w-md">
                      <div className="flex items-center justify-between gap-4 rounded-lg border border-border p-3.5">
                        <div className="flex items-center gap-2.5 text-[13px] font-medium text-foreground">
                          {theme === "light" ? (
                            <Sun className="size-4 shrink-0 text-muted-foreground" aria-hidden />
                          ) : (
                            <Moon className="size-4 shrink-0 text-muted-foreground" aria-hidden />
                          )}
                          {theme === "light" ? t("theme.light") : t("theme.dark")}
                        </div>
                        <button
                          type="button"
                          role="switch"
                          aria-checked={theme === "light"}
                          aria-label={theme === "light" ? t("theme.enableDark") : t("theme.enableLight")}
                          onClick={toggleTheme}
                          className="relative inline-flex h-5 w-9 shrink-0 items-center rounded-full border border-border bg-foreground transition-colors"
                        >
                          <span
                            className={`inline-block size-3.5 rounded-full bg-background shadow-sm transition-transform duration-300 ${
                              theme === "light" ? "translate-x-[18px]" : "translate-x-0.5"
                            }`}
                          />
                        </button>
                      </div>
                      <p className="mt-2 text-[11.5px] leading-relaxed text-muted-foreground/70">
                        {t("theme.caption")}
                      </p>
                    </div>
                  )}

                  {active === "cookies" && (
                    <div className="max-w-md">
                      <CookieConsentFields compact />
                    </div>
                  )}

                  {active === "animacoes" && (
                    <div className="max-w-md space-y-2.5">
                      {ANIMATION_LEVELS.map((value) => (
                        <button
                          key={value}
                          type="button"
                          onClick={() => setLevel(value)}
                          aria-pressed={level === value}
                          className={`w-full rounded-lg border p-3.5 text-left transition-colors ${
                            level === value
                              ? "border-foreground/40 bg-surface-2"
                              : "border-border hover:border-foreground/20"
                          }`}
                        >
                          <div className="flex items-center justify-between gap-3">
                            <p className="text-[13px] font-semibold text-foreground">
                              {t(`animations.${value}.label`)}
                            </p>
                            <span
                              className={`inline-flex size-4 shrink-0 items-center justify-center rounded-full border ${
                                level === value
                                  ? "border-foreground bg-foreground"
                                  : "border-border"
                              }`}
                            >
                              {level === value && (
                                <span className="size-1.5 rounded-full bg-background" />
                              )}
                            </span>
                          </div>
                          <p className="mt-1 text-[12px] leading-relaxed text-muted-foreground">
                            {t(`animations.${value}.description`)}
                          </p>
                        </button>
                      ))}

                      <div className="mt-4 flex items-start gap-2.5 rounded-lg border border-border bg-surface-2/40 p-3">
                        <Zap className="mt-0.5 size-3.5 shrink-0 text-muted-foreground" aria-hidden />
                        <p className="text-[11.5px] leading-relaxed text-muted-foreground">
                          {t("animations.caption")}
                        </p>
                      </div>
                    </div>
                  )}

                  {active === "cursor" && (
                    <div className="max-w-md">
                      {/* grade de opções — some no mobile (<sm): cursor
                          personalizado depende de mouse, então em telas de
                          toque mostramos só o aviso "só no computador" logo
                          abaixo, no lugar da grade. */}
                      <div className="hidden sm:block">
                      <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3">
                        {CURSOR_OPTIONS.map((opt) => (
                          <button
                            key={opt.value}
                            type="button"
                            onClick={() => setCursor(opt.value)}
                            aria-pressed={cursor === opt.value}
                            className={`flex flex-col items-center gap-2 rounded-lg border p-3 transition-colors ${
                              cursor === opt.value
                                ? "border-foreground/40 bg-surface-2"
                                : "border-border hover:border-foreground/20"
                            }`}
                          >
                            {/* miniatura — fundo quadriculado sutil só pra deixar
                                visível que o PNG tem transparência de verdade
                                (mesmo truque visual de editores de imagem) */}
                            <span
                              className="flex size-12 shrink-0 items-center justify-center rounded-md"
                              style={
                                opt.thumbnail
                                  ? {
                                      backgroundImage:
                                        "linear-gradient(45deg, var(--color-border) 25%, transparent 25%), linear-gradient(-45deg, var(--color-border) 25%, transparent 25%), linear-gradient(45deg, transparent 75%, var(--color-border) 75%), linear-gradient(-45deg, transparent 75%, var(--color-border) 75%)",
                                      backgroundSize: "8px 8px",
                                      backgroundPosition: "0 0, 0 4px, 4px -4px, -4px 0",
                                    }
                                  : undefined
                              }
                            >
                              {opt.thumbnail ? (
                                <img
                                  src={opt.thumbnail}
                                  alt=""
                                  draggable={false}
                                  className="size-9 object-contain"
                                />
                              ) : (
                                <MousePointer2 className="size-5 text-muted-foreground" aria-hidden />
                              )}
                            </span>
                            <span className="flex items-center gap-1.5 text-[12px] font-medium text-foreground">
                              {t(`cursor.${opt.value}`)}
                              {cursor === opt.value && (
                                <span className="inline-flex size-3.5 shrink-0 items-center justify-center rounded-full border border-foreground bg-foreground">
                                  <span className="size-1.5 rounded-full bg-background" />
                                </span>
                              )}
                            </span>
                          </button>
                        ))}

                        {/* placeholder, não é clicável de propósito — só avisa
                            que tem mais opções de cursor vindo por aí. Visual
                            diferente (borda tracejada, sem preenchimento) pra
                            não parecer mais uma opção selecionável. */}
                        <div className="flex flex-col items-center justify-center gap-2 rounded-lg border border-dashed border-border p-3 text-center">
                          <span className="flex size-12 shrink-0 items-center justify-center rounded-md">
                            <Sparkles className="size-5 text-muted-foreground/40" aria-hidden />
                          </span>
                          <span className="text-[11px] font-medium text-muted-foreground/60">
                            {t("cursor.comingSoon")}
                          </span>
                        </div>
                      </div>
                      <p className="mt-3 text-[11.5px] leading-relaxed text-muted-foreground/70">
                        {t("cursor.caption")}
                      </p>
                      </div>

                      {/* aviso mobile — mesmo espírito do placeholder "coming
                          soon" acima (borda tracejada, não é clicável): cursor
                          customizado não faz sentido em tela de toque, então
                          avisamos que a função é exclusiva do computador em
                          vez de esconder a seção inteira. */}
                      <div className="flex flex-col items-center gap-3 rounded-lg border border-dashed border-border p-6 text-center sm:hidden">
                        <Laptop className="size-6 text-muted-foreground/50" aria-hidden />
                        <p className="text-[13px] font-semibold text-foreground">
                          {t("cursor.desktopOnlyTitle")}
                        </p>
                        <p className="text-[12px] leading-relaxed text-muted-foreground">
                          {t("cursor.desktopOnlyDescription")}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
