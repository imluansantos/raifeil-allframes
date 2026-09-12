import { useSyncExternalStore } from "react";

/* =========================================================================
 * Nível de animação global — Todas / Reduzidas / Nenhuma (painel de
 * Configurações, seção "Animações"). Mesmo padrão de módulo com estado
 * próprio + useSyncExternalStore usado em use-theme.ts: qualquer componente
 * que chame useAnimationLevel() em qualquer lugar da árvore assina o mesmo
 * estado, sem precisar de Context/Provider no __root.tsx.
 *
 * O nível se traduz em duas coisas:
 *  1) uma classe no <html> (.motion-reduced / .motion-none) que uma regra
 *     CSS global (styles.css) usa pra cortar a duração de toda transição e
 *     @keyframes do site — cobre a maior parte dos efeitos puramente CSS
 *     (reveal-left/up, hovers, os "drifts" em @keyframes) sem precisar
 *     tocar em cada componente um por um.
 *  2) o valor devolvido por useAnimationLevel(), que os componentes com
 *     efeito pesado de VERDADE (ClippedCircle, o loop de scroll do
 *     ShowcaseMarquee) leem diretamente pra deixar de montar/rodar esse
 *     trabalho de propósito — não só escondido via CSS, mas sem o
 *     JavaScript por trás rodando (é isso que gera ganho real de
 *     performance, não só visual).
 *
 * Preferência salva em localStorage — sobrevive a reload, é por navegador.
 * ========================================================================= */

const STORAGE_KEY = "af-animation-level";
export type AnimationLevel = "all" | "reduced" | "none";

let level: AnimationLevel = "all";
let hydrated = false;
const listeners = new Set<() => void>();

function isAnimationLevel(v: unknown): v is AnimationLevel {
  return v === "all" || v === "reduced" || v === "none";
}

function applyLevel(next: AnimationLevel) {
  if (typeof document === "undefined") return;
  const root = document.documentElement;
  root.classList.toggle("motion-reduced", next === "reduced");
  root.classList.toggle("motion-none", next === "none");
}

function readStored(): AnimationLevel {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    return isAnimationLevel(raw) ? raw : "all";
  } catch {
    return "all";
  }
}

function hydrate() {
  if (hydrated) return;
  hydrated = true;
  level = readStored();
  applyLevel(level);
}

function setLevel(next: AnimationLevel) {
  level = next;
  applyLevel(next);
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

function getSnapshot(): AnimationLevel {
  return level;
}

function getServerSnapshot(): AnimationLevel {
  return "all";
}

if (typeof window !== "undefined") {
  hydrate();
}

export function useAnimationLevel() {
  const current = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  return {
    level: current,
    isReducedOrNone: current !== "all",
    isNone: current === "none",
    setLevel,
  };
}
