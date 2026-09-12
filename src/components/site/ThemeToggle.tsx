import { Moon, Sun } from "lucide-react";
import { useTheme } from "@/hooks/use-theme";

/* =========================================================================
 * Alternância global dark / light.
 *
 * Preto (tier 1) continua o padrão do site — .light no <html> é opt-in e
 * troca só o tier 1 pelos tons já desenhados no tier 4 (branco, ver
 * styles.css), reaproveitando o design system em vez de inventar paleta
 * nova. Seções com tom próprio (theme-charcoal, theme-gray, theme-light)
 * mantêm sua cor de qualquer forma: fazem parte do ritmo de tons do site,
 * não do "modo" preto/branco de base.
 *
 * O estado em si (leitura/escrita do localStorage, aplicação da classe
 * .light) vive em src/hooks/use-theme.ts — este componente é só a UI. Isso
 * é o que permite o mesmo tema ficar sincronizado entre este toggle (Footer)
 * e o painel de Configurações (Header/SettingsPanel.tsx): os dois chamam
 * useTheme() e assinam o mesmo estado compartilhado.
 * ========================================================================= */

export function ThemeToggle({ className = "" }: { className?: string }) {
  const { theme, toggle } = useTheme();

  return (
    <button
      type="button"
      onClick={toggle}
      role="switch"
      aria-checked={theme === "light"}
      aria-label={theme === "light" ? "Ativar modo escuro" : "Ativar modo claro"}
      className={`inline-flex items-center gap-2 ${className}`}
    >
      {/* Moon à esquerda, Sun à direita — a bolinha anda pra direita no modo
          claro (translate-x-[18px]), então precisa terminar embaixo do ícone
          certo (Sun). Antes era Sun-esquerda/Moon-direita, e a bolinha
          "escolhia" a lua justamente quando o modo claro estava ativo. */}
      <Moon className="size-3.5 shrink-0 text-muted-foreground" aria-hidden />
      <span
        aria-hidden
        className="relative inline-flex h-5 w-9 shrink-0 items-center rounded-full border border-border bg-surface-2 transition-colors"
      >
        <span
          className={`inline-block size-3.5 rounded-full bg-foreground shadow-sm transition-transform duration-300 ${
            theme === "light" ? "translate-x-[18px]" : "translate-x-0.5"
          }`}
        />
      </span>
      <Sun className="size-3.5 shrink-0 text-muted-foreground" aria-hidden />
    </button>
  );
}
