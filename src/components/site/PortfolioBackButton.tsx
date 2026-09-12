import { useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";
import { ArrowLeft } from "lucide-react";

// Botão "Início" FIXO da página /portfolio — só existe visualmente depois
// que o bloco da hero (a foto da fachada, ver PortfolioHero.tsx) sai da
// tela. Enquanto a hero ainda está visível, é o botão "Início" NORMAL
// dentro dela (renderizado ali mesmo, no fluxo do conteúdo, logo acima do
// texto "Portfólio") quem aparece — este componente aqui fica
// completamente invisível (opacity-0, sem pointer-events) até esse ponto,
// então os dois nunca se sobrepõem.
export function PortfolioBackButton() {
  const { t } = useTranslation("nav");
  const [pastHero, setPastHero] = useState(false);

  useEffect(() => {
    // Só considera "passou da hero" quando ela sai de trás do header de
    // vez (mesmo threshold usado no Header.tsx pra decidir "overHero").
    const threshold = 104;
    const onScroll = () => {
      const hero = document.getElementById("portfolio-hero");
      const bottom = hero?.getBoundingClientRect().bottom ?? 0;
      setPastHero(bottom <= threshold);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div
      className={`fixed inset-x-0 top-20 z-[60] mx-auto max-w-[1600px] px-6 transition-opacity duration-300 md:top-24 lg:px-14 ${
        pastHero ? "opacity-100" : "pointer-events-none opacity-0"
      }`}
      aria-hidden={!pastHero}
    >
      <Link
        to="/"
        tabIndex={pastHero ? 0 : -1}
        // duas classes diferentes (não só opacity) de propósito — é o que dá
        // aquele efeito de "preencher e deslizar" (o padding-left nascendo
        // empurra o texto/ícone um pouco pro lado ao mesmo tempo que o fundo
        // opaco aparece), a mesma animação de antes.
        className={`group inline-flex items-center gap-2 rounded-full text-[12px] font-semibold tracking-[0.12em] uppercase transition-all duration-300 ${
          pastHero
            ? "border border-white/12 bg-black/45 px-4 py-2.5 text-white shadow-[0_8px_32px_-12px] shadow-black/60 backdrop-blur-xl"
            : "border border-transparent bg-transparent px-0 py-0 text-white/80"
        } hover:text-white/80`}
      >
        <ArrowLeft className="size-3.5 transition-transform group-hover:-translate-x-0.5" />
        {t("home")}
      </Link>
    </div>
  );
}
