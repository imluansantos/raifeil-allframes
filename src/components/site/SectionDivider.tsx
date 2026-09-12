/* =========================================================================
 * Marca de início de seção — dois tracinhos finos no topo, alinhados com o
 * padding do conteúdo (px-6 lg:px-14), tipo marcação de régua/desenho
 * técnico. Reforça a linha divisória (border-t/border-y) já usada entre
 * seções, deixando explícito "aqui começa algo novo", sem introduzir
 * nenhuma cor — só a mesma linguagem técnica do resto do site.
 *
 * Vai dentro de uma seção com `position: relative` (todas as seções que a
 * usam já têm `relative` na className).
 * ========================================================================= */
export function SectionDivider() {
  return (
    <>
      <span aria-hidden className="section-tick left-6 lg:left-14" />
      <span aria-hidden className="section-tick right-6 lg:right-14" />
    </>
  );
}
