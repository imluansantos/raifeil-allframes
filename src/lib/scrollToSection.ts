// Scroll suave até uma seção da home, sem tocar na URL — nada de "#servicos"
// aparecendo na barra de endereço. Usado pelos links do Header e do Footer
// que apontam pros anchors de NAV (@/data/site).
//
// O <Link to="/" hash={id}> do TanStack Router continua no JSX (então o
// href renderizado fica correto pra "abrir em nova aba"/crawler/etc), mas
// quando o clique acontece com o usuário já na home, a gente intercepta e
// faz o scroll manualmente — sem navegação, sem hash, sem histórico novo.
// Fora da home, o clique cai no comportamento padrão do Link (navega pra
// "/" e o próprio TanStack cuida do anchor).
const HEADER_OFFSET = 96;

export function scrollToSection(id: string) {
  const el = document.getElementById(id);
  if (!el) return;

  if (id === "top") {
    window.scrollTo({ top: 0, behavior: "smooth" });
    return;
  }

  const top = el.getBoundingClientRect().top + window.scrollY - HEADER_OFFSET;
  window.scrollTo({ top, behavior: "smooth" });
}
