/* =========================================================================
 * Textura de fundo compartilhada — grid técnico + grain sutil.
 *
 * Mesma receita usada como "background padrão" do site inteiro (aplicada
 * direto no body, em src/styles.css, via background-image fixo). Seções com
 * fundo de tier próprio (theme-charcoal etc.) são opacas e cobririam essa
 * camada de fundo — por isso essas seções instanciam este componente
 * localmente, garantindo que a textura seja visualmente idêntica em
 * qualquer lugar do site, e não um efeito recriado seção a seção.
 *
 * De propósito só com linear-gradient/radial-gradient + rgba() dentro do
 * `style` inline — nada de theme(), color-mix() ou data-URI de SVG. Essas
 * três já foram tentadas e cada uma quebrou a propriedade inteira:
 * background-image é uma lista separada por vírgula, e um único item
 * inválido (uma função que só o Tailwind resolve, ou que o navegador não
 * suporta) invalida a declaração inteira, derrubando também as camadas que
 * estavam corretas. rgba()/gradient puro não depende de nada disso.
 *
 * As cores vêm de --texture-line/--texture-dot (definidas em styles.css),
 * não de rgba() fixo: isso é o que permite a textura virar clara→escura
 * junto com a alternância global dark/light (.light no <html>), sem tocar
 * neste componente de novo — nas seções que já têm tom próprio
 * (theme-charcoal etc.) essas variáveis não mudam, então a textura segue
 * exatamente igual a antes.
 *
 * O grain (5px) e a grade (56px) têm tamanhos "primos entre si" — a cada
 * 280px (mínimo múltiplo comum de 5 e 56) os dois padrões se realinham e
 * um ponto do grain cai bem em cima de um cruzamento da grade, somando a
 * opacidade dos dois ali e criando um "ponto" mais claro periódico (era
 * isso que aparecia nos cruzamentos marcados). O `backgroundPosition`
 * desloca o grain por meio ciclo (2.5px, metade de 5px), então os pontos
 * do grain nunca mais caem num pixel inteiro (múltiplo de 56) — esse
 * realinhamento nunca mais acontece, em qualquer tamanho de tela. Mesmo
 * ajuste replicado no background do body em styles.css.
 * ========================================================================= */
export function SiteTexture() {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
      <div
        className="absolute inset-0"
        style={{
          backgroundImage:
            "linear-gradient(var(--texture-line) 1px, transparent 1px), linear-gradient(to right, var(--texture-line) 1px, transparent 1px)",
          backgroundSize: "56px 56px",
        }}
      />
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: "radial-gradient(var(--texture-dot) 0.4px, transparent 0.4px)",
          backgroundSize: "5px 5px",
          backgroundPosition: "2.5px 2.5px",
        }}
      />
    </div>
  );
}
