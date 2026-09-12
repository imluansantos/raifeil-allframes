import { useSyncExternalStore } from "react";

/* =========================================================================
 * Cursor personalizado global — painel de Configurações, seção "Cursor".
 * Mesmo padrão de módulo com estado próprio + useSyncExternalStore usado em
 * use-theme.ts / use-animation-level.ts: qualquer componente que chame
 * useCursor() assina o mesmo estado, sem precisar de Context/Provider.
 *
 * O valor escolhido vira uma classe no <html> (.cursor-sword, .cursor-plane,
 * etc. — "default" não aplica nenhuma classe, cursor do sistema mesmo). Uma
 * regra CSS global (styles.css) faz `html.cursor-X, html.cursor-X * { cursor:
 * url(...) hotspotX hotspotY, auto !important; }` — o !important + seletor
 * universal é necessário porque botões/links do site já têm cursor: pointer
 * no próprio CSS, então sem isso o cursor customizado nunca apareceria em
 * cima de nada clicável.
 *
 * Preferência salva em localStorage — sobrevive a reload, é por navegador.
 * ========================================================================= */

const STORAGE_KEY = "af-cursor";

export type CursorOption = "default" | "sword" | "plane" | "sukuna" | "playstation";

// Sem "label" aqui de propósito: o nome de cada opção vem traduzido de
// settings.json (chave "cursor.<value>"), lido no SettingsPanel.tsx via
// useTranslation — assim a seção Cursor também muda de idioma junto com o
// resto do painel.
export const CURSOR_OPTIONS: {
  value: CursorOption;
  thumbnail: string | null;
}[] = [
  { value: "default", thumbnail: null },
  { value: "sword", thumbnail: "/cursors/sword.png" },
  { value: "plane", thumbnail: "/cursors/plane.png" },
  { value: "sukuna", thumbnail: "/cursors/sukuna.png" },
  { value: "playstation", thumbnail: "/cursors/playstation.png" },
];

const VALID = new Set(CURSOR_OPTIONS.map((o) => o.value));
const CLASS_NAMES = CURSOR_OPTIONS.filter((o) => o.value !== "default").map(
  (o) => `cursor-${o.value}`,
);

let cursor: CursorOption = "default";
let hydrated = false;
const listeners = new Set<() => void>();

function isCursorOption(v: unknown): v is CursorOption {
  return typeof v === "string" && VALID.has(v as CursorOption);
}

function applyCursor(next: CursorOption) {
  if (typeof document === "undefined") return;
  const root = document.documentElement;
  for (const cls of CLASS_NAMES) root.classList.remove(cls);
  if (next !== "default") root.classList.add(`cursor-${next}`);
}

function readStored(): CursorOption {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    return isCursorOption(raw) ? raw : "default";
  } catch {
    return "default";
  }
}

function hydrate() {
  if (hydrated) return;
  hydrated = true;
  cursor = readStored();
  applyCursor(cursor);
}

function setCursor(next: CursorOption) {
  cursor = next;
  applyCursor(next);
  try {
    window.localStorage.setItem(STORAGE_KEY, next);
  } catch {
    // best-effort
  }
  listeners.forEach((l) => l());
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

function getSnapshot(): CursorOption {
  return cursor;
}

function getServerSnapshot(): CursorOption {
  return "default";
}

if (typeof window !== "undefined") {
  hydrate();
}

export function useCursor() {
  const current = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  return {
    cursor: current,
    setCursor,
  };
}
