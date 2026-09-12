import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { Check, Info } from "lucide-react";

const STORAGE_KEY = "af-cookie-prefs";

type Prefs = { analytics: boolean; marketing: boolean };

function readPrefs(): Prefs {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw) as Prefs;
  } catch {
    // localStorage indisponível ou conteúdo inválido — segue com o padrão
  }
  return { analytics: true, marketing: true };
}

// Os três toggles (Essenciais/Análise/Marketing) + botão de salvar —
// compartilhado entre o CookiePreferencesModal (modal cheio, com o cookie
// ilustrado ao lado) e a aba "Cookies" do painel de Configurações (direto,
// sem modal, sem ilustração, compacto). `compact` controla o respiro/tamanho
// do texto; `onCancel`, quando passado, mostra um botão "Cancelar" ao lado
// do "Salvar" (só faz sentido dentro de um modal que pode ser fechado sem
// salvar — o painel de Configurações não usa isso, já tem o X do painel).
export function CookieConsentFields({
  compact = false,
  onCancel,
}: {
  compact?: boolean;
  onCancel?: () => void;
}) {
  const { t } = useTranslation("cookies");
  const [prefs, setPrefs] = useState<Prefs>({ analytics: true, marketing: true });
  // "Preferências salvas" — badge que aparece ao salvar e some sozinho.
  const [showSaved, setShowSaved] = useState(false);
  // "O que são cookies?" — pop-out com a explicação, fecha ao clicar fora
  // ou com Esc.
  const [showInfo, setShowInfo] = useState(false);
  const infoRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setPrefs(readPrefs());
  }, []);

  useEffect(() => {
    if (!showSaved) return;
    const timer = setTimeout(() => setShowSaved(false), 3000);
    return () => clearTimeout(timer);
  }, [showSaved]);

  useEffect(() => {
    if (!showInfo) return;
    const onClickOutside = (e: MouseEvent) => {
      if (infoRef.current && !infoRef.current.contains(e.target as Node)) {
        setShowInfo(false);
      }
    };
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setShowInfo(false);
    };
    document.addEventListener("mousedown", onClickOutside);
    window.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("mousedown", onClickOutside);
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [showInfo]);

  const save = () => {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(prefs));
    } catch {
      // best-effort
    }
    setShowSaved(true);
  };

  return (
    <div className="relative">
      <div
        role="status"
        aria-live="polite"
        className={`pointer-events-none absolute z-10 flex items-center gap-1.5 rounded-full bg-foreground px-3.5 py-1.5 text-[12px] font-semibold text-background shadow-[0_8px_24px_-8px] shadow-black/40 transition-all duration-300 ${
          compact ? "-top-2 left-0" : "-top-3 left-4"
        } ${showSaved ? "translate-y-0 opacity-100" : "-translate-y-2 opacity-0"}`}
      >
        <Check className="size-3.5 shrink-0" aria-hidden />
        {t("saved")}
      </div>

      <div ref={infoRef} className="relative mb-3 inline-block">
        <button
          type="button"
          onClick={() => setShowInfo((v) => !v)}
          aria-expanded={showInfo}
          className="inline-flex items-center gap-1.5 text-[12px] font-medium text-muted-foreground underline decoration-dotted underline-offset-4 transition-colors hover:text-foreground"
        >
          <Info className="size-3.5 shrink-0" aria-hidden />
          {t("whatAreCookies")}
        </button>

        {showInfo && (
          <div
            role="tooltip"
            className="absolute top-full left-0 z-20 mt-3 w-72 max-w-[80vw] rounded-lg border border-border bg-surface-2 p-3 text-[11.5px] leading-relaxed text-muted-foreground shadow-[0_16px_40px_-12px] shadow-black/50"
          >
            {/* setinha do balão, apontando pro botão que abriu */}
            <span
              className="absolute -top-1.5 left-4 size-3 rotate-45 border-t border-l border-border bg-surface-2"
              aria-hidden
            />
            {t("whatAreCookiesExplanation")}
          </div>
        )}
      </div>

      <div className={compact ? "space-y-2" : "space-y-3"}>
        <PrefRow
          compact={compact}
          label={t("essentialLabel")}
          description={t("essentialDescription")}
          checked
          disabled
        />
        <PrefRow
          compact={compact}
          label={t("analyticsLabel")}
          description={t("analyticsDescription")}
          checked={prefs.analytics}
          onChange={(v) => setPrefs((p) => ({ ...p, analytics: v }))}
        />
        <PrefRow
          compact={compact}
          label={t("marketingLabel")}
          description={t("marketingDescription")}
          checked={prefs.marketing}
          onChange={(v) => setPrefs((p) => ({ ...p, marketing: v }))}
        />
      </div>

      <div
        className={
          compact
            ? "mt-3 flex justify-end"
            : "mt-6 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end"
        }
      >
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="rounded-full border border-border px-4 py-2.5 text-[12px] font-semibold text-muted-foreground transition-colors hover:text-foreground"
          >
            {t("cancel")}
          </button>
        )}
        <button
          type="button"
          onClick={save}
          className={`rounded-full bg-foreground font-bold text-background transition-colors hover:bg-foreground/90 ${
            compact ? "px-3.5 py-1.5 text-[11.5px]" : "px-4 py-2.5 text-[12px]"
          }`}
        >
          {t("save")}
        </button>
      </div>
    </div>
  );
}

function PrefRow({
  label,
  description,
  checked,
  disabled,
  onChange,
  compact,
}: {
  label: string;
  description: string;
  checked: boolean;
  disabled?: boolean;
  onChange?: (value: boolean) => void;
  compact?: boolean;
}) {
  return (
    <div
      className={`flex items-start justify-between gap-4 rounded-lg border border-border ${compact ? "p-2.5" : "p-3.5"}`}
    >
      <div>
        <p className={`font-semibold text-foreground ${compact ? "text-[12.5px]" : "text-[13px]"}`}>
          {label}
        </p>
        <p
          className={`mt-1 leading-relaxed text-muted-foreground ${compact ? "text-[11px]" : "text-[12px]"}`}
        >
          {description}
        </p>
      </div>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        aria-label={label}
        disabled={disabled}
        onClick={() => onChange?.(!checked)}
        className={`relative inline-flex h-5 w-9 shrink-0 items-center rounded-full border border-border transition-colors ${
          checked ? "bg-foreground" : "bg-surface-2"
        } ${disabled ? "opacity-50" : ""}`}
      >
        <span
          className={`inline-block size-3.5 rounded-full bg-background shadow-sm transition-transform duration-300 ${
            checked ? "translate-x-[18px]" : "translate-x-0.5"
          }`}
        />
      </button>
    </div>
  );
}
