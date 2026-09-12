import { Link } from "@tanstack/react-router";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/8bit-button";
import favicon404 from "@/assets/8bit404.webp";
import { SiteTexture } from "@/components/site/SiteTexture";
import { SectionFade } from "@/components/site/SectionFade";

// Recriação do NotFound1 da 8bitcn-ui
// (https://21st.dev/community/components?q=404&preview=%2F%40theorcdev%2Fcomponents%2F8bit-not-found1)
// — mesma estrutura/visual do original, só a copy adaptada pro tom do site
// e a imagem trocada pelo próprio ícone da marca (a mesma placa de vídeo
// usada no favicon), reduzida a 48x48 e ampliada de volta com
// image-rendering: pixelated (.pixelated em styles.css) pra virar um
// "pixel art" de verdade em vez de uma imagem em alta resolução só
// serrilhada.
interface NotFound1Props {
  className?: string;
  cta?: string;
  description?: string;
  href?: string;
  imageSrc?: string;
  title?: string;
}

export default function NotFound1({
  title = "GAME OVER",
  description = "Essa página não existe ou foi movida. Mas seu setup continua no lugar certo.",
  cta = "Voltar para o início",
  href = "/",
  imageSrc = favicon404,
  className,
}: NotFound1Props) {
  return (
    <div
      className={cn(
        "retro relative isolate grid min-h-screen w-full place-content-center gap-5 bg-background px-4 py-16 text-center md:py-24",
        className,
      )}
    >
      {/* fundo: grid técnico + grain do site (mesma textura padrão do
          resto das páginas). `relative isolate` cria um contexto de
          empilhamento próprio pra esta div, senão a camada -z-10 do
          SiteTexture escapa pra trás do bg-background sólido do wrapper
          em __root.tsx e fica coberta (mesmo padrão usado em
          FinalCTA.tsx). `min-h-screen` garante que a textura cubra a
          tela inteira, não só a altura do conteúdo. */}
      <SiteTexture />

      {/* sombra leve preta atrás do bloco de conteúdo (404 + boss + GAME
          OVER + texto + botão) — radial-gradient bem suave, sem stops
          abruptos, só pra dar contraste contra o grid sem virar uma
          "caixa" com borda visível. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-[8]"
        style={{
          backgroundImage:
            "radial-gradient(ellipse 60% 65% at 50% 50%, rgba(0,0,0,0.55) 0%, rgba(0,0,0,0.28) 45%, transparent 75%)",
        }}
      />

      {/* degradê nas bordas de cima/baixo — mesmo componente usado entre
          seções da home pra suavizar a divisa (aqui não tem seção vizinha,
          então funciona como uma vinheta: o grid vai sumindo perto das
          bordas e vira preto sólido, igual ao resto do site). */}
      <SectionFade side="top" />
      <SectionFade side="bottom" />

      <div className="retro font-bold text-6xl tracking-tight sm:text-8xl">
        404
      </div>

      {imageSrc && (
        <div className="flex justify-center -mt-4">
          <img
            alt="404"
            className="pixelated"
            height={200}
            src={imageSrc}
            width={200}
          />
        </div>
      )}

      <h1 className="retro font-bold text-2xl tracking-tight sm:text-4xl">
        {title}
      </h1>

      <p className="retro text-muted-foreground text-xs">{description}</p>

      <div className="flex justify-center">
        <Link to={href}>
          <Button>{cta}</Button>
        </Link>
      </div>
    </div>
  );
}
