/* =========================================================================
 * Degradê de divisa entre seções do mesmo tier (mesma cor de fundo).
 *
 * Entre seções que compartilham a mesma cor de fundo, o grid/grain contínuo
 * não deixa a quebra de seção perceptível — parece uma seção só, sem fim.
 * Em vez de traçar uma linha, o próprio fundo vai sumindo aos poucos
 * conforme se aproxima da divisa (o grid/grain desaparece, cor sólida no
 * lugar) e volta a aparecer conforme se afasta dela, do outro lado. Cada
 * seção instancia sua própria metade (`side="bottom"` na primeira,
 * `side="top"` na segunda) — juntas, as duas metades criam o "vale" que
 * sinaliza a troca sem nenhuma linha/traço literal na tela.
 *
 * A seção precisa ser `position: relative` pra isso se posicionar
 * corretamente, e `var(--color-background)` resolve pra cor certa sozinho,
 * herdando o tier (preto ou cinza-chumbo) de onde o componente é usado.
 * ========================================================================= */
export function SectionFade({ side }: { side: "top" | "bottom" }) {
  return (
    <div
      aria-hidden
      className={`pointer-events-none absolute inset-x-0 -z-[5] h-40 md:h-56 ${
        side === "top" ? "top-0" : "bottom-0"
      }`}
      style={{
        backgroundImage:
          side === "top"
            ? "linear-gradient(to bottom, var(--color-background) 0%, transparent 100%)"
            : "linear-gradient(to top, var(--color-background) 0%, transparent 100%)",
      }}
    />
  );
}
