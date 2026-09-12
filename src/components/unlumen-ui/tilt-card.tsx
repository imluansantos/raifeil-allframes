"use client";

import * as React from "react";
import { Link } from "@tanstack/react-router";
import { ChevronRight } from "lucide-react";

import { cn } from "@/lib/utils";
import { Tilt, type TiltProps } from "@/components/unlumen-ui/primitives/tilt";
import { ClippedCircle } from "@/components/unlumen-ui/primitives/clipped-circle";
import { useAnimationLevel } from "@/hooks/use-animation-level";

export interface TiltCardProps extends React.HTMLAttributes<HTMLDivElement> {
  title: string;
  description?: string;
  /** left half of the split badge pill; shown as a simple pill if `badgeLabel` is omitted */
  price?: string;
  /** right half of the split pill, coloured by `badgeVariant` */
  badgeLabel?: string;
  badgeVariant?: "success" | "warning";
  imageSrc?: string;
  imageAlt?: string;
  /** equivalente ao `object-position` do CSS — foco da foto quando cortada
   *  (object-cover), igual ao já usado nos outros cards de serviço do site. */
  imagePosition?: string;
  /** wraps the card in a client-side route (TanStack Router) instead of a plain `<a>` */
  href?: string;
  children?: React.ReactNode;
  tiltProps?: Omit<TiltProps, "children" | "className">;
}

const BADGE_LABEL_CLASSES: Record<
  NonNullable<TiltCardProps["badgeVariant"]>,
  string
> = {
  success: "bg-emerald-500/15 text-emerald-700 dark:text-emerald-300",
  warning: "bg-amber-500/20 text-amber-700 dark:text-amber-300",
};

export function TiltCard({
  title,
  description,
  price,
  badgeLabel,
  badgeVariant = "success",
  imageSrc,
  imageAlt = "",
  imagePosition,
  href,
  children,
  tiltProps,
  className,
  ...props
}: TiltCardProps) {
  // painel de Configurações → Animações: "Reduzidas" e "Nenhuma" desmontam
  // de vez o ClippedCircle (item citado explicitamente no pedido) — não só
  // escondido via CSS, os listeners de mousemove dele nem existem mais.
  const { isReducedOrNone } = useAnimationLevel();

  const inner = (
    <Tilt
      rotationFactor={isReducedOrNone ? 0 : 11}
      {...tiltProps}
      style={{ boxShadow: "var(--tilt-card-shadow)", ...tiltProps?.style }}
      className={cn(
        "relative group overflow-hidden",
        "bg-background border border-border rounded-lg",
        // texto e imagem lado a lado — a imagem ocupa a altura inteira do
        // card, encostada na borda direita (em vez da miniatura pequena
        // flutuando por cima do layout original).
        "flex flex-row items-stretch",
        "h-60 sm:h-64 md:h-72 w-full",
        // hover:shadow-lg / hover:scale-105 / transition-all exatamente como
        // no componente original do unlumen-ui. O fundo NÃO muda de cor no
        // hover (isso brigava com o ClippedCircle, ver abaixo) — o único
        // feedback visual de hover é o próprio círculo + o scale/shadow.
        "hover:shadow-lg hover:scale-105 transition-all duration-400 ease-out",
        className,
      )}
    >
      {/* coluna de texto — largura própria reservada pelo flex, nunca invade
          o espaço da foto. */}
      <div className="relative flex min-w-0 flex-1 flex-col px-5 py-5 sm:px-7 sm:py-7">
        <div className="flex flex-col gap-1.5">
          <div className="flex items-start justify-between gap-2">
            <h2 className="text-lg tracking-tight leading-tight font-medium">
              {title}
            </h2>

            {price && badgeLabel ? (
              <div className="inline-flex h-fit shrink-0 items-center text-sm whitespace-nowrap">
                <span className="rounded-l-full bg-secondary h-fit py-1 px-2 font-medium">
                  {price}
                </span>
                <span
                  className={cn(
                    "rounded-r-full text-sm h-fit py-1 px-2 font-medium",
                    BADGE_LABEL_CLASSES[badgeVariant],
                  )}
                >
                  {badgeLabel}
                </span>
              </div>
            ) : price ? (
              <span className="h-fit shrink-0 rounded-full bg-secondary px-3 py-1 text-sm font-medium whitespace-nowrap">
                {price}
              </span>
            ) : null}
          </div>

          {description && (
            <p className="text-foreground/50 text-sm leading-relaxed">
              {description}
            </p>
          )}
          {children && <div className="mt-2">{children}</div>}
        </div>

        {/* ficava colada no rodapé do card (justify-between no container);
            agora sobe logo abaixo da descrição, com um respiro curto (mt-4). */}
        <ChevronRight aria-hidden className="mt-4 size-6 text-foreground" />
      </div>

      {imageSrc && (
        // z-10 é o que mantém a foto ACIMA do ClippedCircle na pilha de
        // camadas (igual ao componente original) — sem isso, o
        // mix-blend-mode: difference do círculo pinta por cima da foto
        // também e inverte as cores dela, que é o bug que voltou aqui.
        <div className="relative z-10 h-full w-2/5 shrink-0 border-l border-border">
          <img
            src={imageSrc}
            alt={imageAlt}
            loading="lazy"
            decoding="async"
            style={imagePosition ? { objectPosition: imagePosition } : undefined}
            className="absolute inset-0 size-full object-cover"
          />
        </div>
      )}

      {/* círculo branco sólido que segue o mouse por cima do card inteiro
          (mix-blend-mode: difference invertendo as cores por baixo dele) —
          cor e tamanho iguais aos do componente original (bg-white sólido,
          800px), não a versão translúcida/pequena que eu tinha colocado
          antes por engano. Desmontado (não só escondido) em Animações
          Reduzidas/Nenhuma — ver comentário acima. */}
      {!isReducedOrNone && <ClippedCircle circleClassName="bg-white" circleSize={800} />}
    </Tilt>
  );

  if (href) {
    // navegação client-side (SPA) via TanStack Router, igual ao resto do
    // site — um <a> normal aqui recarregaria a página inteira a cada clique.
    return (
      <Link to={href} className="block cursor-pointer" {...(props as any)}>
        {inner}
      </Link>
    );
  }

  return <div {...props}>{inner}</div>;
}
