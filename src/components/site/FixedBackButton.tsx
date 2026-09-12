import { useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";

interface FixedBackButtonProps {
  /** id do bloco de topo (banner/hero) que, ao sair da tela, faz este botão
   *  fixo aparecer — enquanto esse bloco ainda está visível, é o link normal
   *  já existente dentro dele (no fluxo do conteúdo) quem aparece. */
  targetId: string;
  to: string;
  label: string;
}

// Versão genérica do botão fixo criado originalmente pra /portfolio
// (ver PortfolioBackButton.tsx) — mesmo comportamento, reaproveitado nas
// páginas de projeto e nas páginas legais (Termos de Uso, Política de
// Privacidade): fica completamente invisível enquanto o bloco de topo
// (targetId) está na tela, e só aparece — como pílula com fundo opaco —
// depois que ele sai. Renderizado como sibling solto (fora da árvore da
// seção que ele observa), com z-index acima do Header (z-50), pelos mesmos
// motivos documentados em PortfolioBackButton.tsx.
export function FixedBackButton({ targetId, to, label }: FixedBackButtonProps) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const threshold = 104;
    const onScroll = () => {
      const target = document.getElementById(targetId);
      const bottom = target?.getBoundingClientRect().bottom ?? 0;
      setVisible(bottom <= threshold);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [targetId]);

  return (
    <div
      className={`fixed inset-x-0 top-20 z-[60] mx-auto max-w-[1600px] px-6 transition-opacity duration-300 md:top-24 lg:px-14 ${
        visible ? "opacity-100" : "pointer-events-none opacity-0"
      }`}
      aria-hidden={!visible}
    >
      <Link
        to={to}
        tabIndex={visible ? 0 : -1}
        className={`group inline-flex items-center gap-2 rounded-full text-[12px] font-semibold tracking-[0.12em] uppercase transition-all duration-300 ${
          visible
            ? "border border-white/12 bg-black/45 px-4 py-2.5 text-white shadow-[0_8px_32px_-12px] shadow-black/60 backdrop-blur-xl"
            : "border border-transparent bg-transparent px-0 py-0 text-white/80"
        } hover:text-white/80`}
      >
        <ArrowLeft className="size-3.5 transition-transform group-hover:-translate-x-0.5" />
        {label}
      </Link>
    </div>
  );
}
