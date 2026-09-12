import { useSyncExternalStore } from "react";

/* =========================================================================
 * Fonte única de verdade do tema global dark/light.
 *
 * Extraído do que antes vivia só dentro de ThemeToggle.tsx (Footer) — agora
 * o painel de Configurações (Header.tsx/SettingsPanel.tsx) também precisa
 * ler/mudar o mesmo tema, e os dois lugares precisam ficar sincronizados em
 * tempo real (mudar num tem que refletir no outro na hora, sem precisar de
 * reload). Um módulo com estado próprio + useSyncExternalStore resolve isso
 * sem precisar de Context/Provider lá em cima no __root.tsx — qualquer
 * componente que chamar useTheme() em qualquer lugar da árvore já assina o
 * mesmo estado.
 *
 * Preferência salva em localStorage — sobrevive a reload, é por navegador.
 * ========================================================================= */

const STORAGE_KEY = "af-theme";
export type Theme = "dark" | "light";

let theme: Theme = "dark";
let hydrated = false;
const listeners = new Set<() => void>();

function applyTheme(next: Theme) {
  if (typeof document !== "undefined") {
    document.documentElement.classList.toggle("light", next === "light");
  }
}

function readStored(): Theme {
  try {
    return window.localStorage.getItem(STORAGE_KEY) === "light" ? "light" : "dark";
  } catch {
    // localStorage indisponível (modo privado, etc.) — segue com o padrão
    return "dark";
  }
}

// Lê o valor salvo e aplica a classe .light no <html> — chamado uma vez,
// automaticamente, na primeira vez que algum componente usa o hook no
// navegador (ver useTheme abaixo). Idempotente: chamar de novo não faz mal.
function hydrate() {
  if (hydrated) return;
  hydrated = true;
  theme = readStored();
  applyTheme(theme);
}

function setTheme(next: Theme) {
  theme = next;
  applyTheme(next);
  try {
    window.localStorage.setItem(STORAGE_KEY, next);
  } catch {
    // best-effort — se não der pra salvar, o toggle ainda funciona na sessão
  }
  listeners.forEach((l) => l());
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

function getSnapshot(): Theme {
  return theme;
}

// snapshot de SSR/primeira renderização — sempre "dark" (o padrão do site)
// até o efeito de hidratação no client rodar e ler o localStorage de verdade.
function getServerSnapshot(): Theme {
  return "dark";
}

// Roda uma vez, na primeira vez que este módulo é importado no navegador —
// antes de qualquer componente renderizar. Se isso rodasse dentro do hook
// (a cada render) em vez de aqui no escopo do módulo, a primeira leitura de
// useSyncExternalStore já teria capturado o snapshot "dark" (padrão) antes
// da hidratação acontecer, e nada dispararia um re-render pra corrigir —
// listeners só são notificados por setTheme, não por essa leitura inicial.
if (typeof window !== "undefined") {
  hydrate();
}

export function useTheme() {
  const current = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  return {
    theme: current,
    isLight: current === "light",
    toggle: () => setTheme(current === "light" ? "dark" : "light"),
    setTheme,
  };
}
