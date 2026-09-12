"use client";

import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

// Botão "8-bit" — recriado a partir do componente da 8bitcn-ui
// (https://www.8bitcn.com/docs/components/button), usado só na página 404.
// A primeira versão usava uma moldura retangular reta (cantos simples), mas
// o formato de referência é uma "pílula pixelada": borda em escada de 3
// degraus em cada canto, arredondando o retângulo só com blocos quadrados —
// pra isso não dá pra usar border-radius nem cantos simples, é preciso
// recortar a própria forma com clip-path (utilitário .pixel-corners em
// styles.css). Três camadas empilhadas fazem o efeito completo: sombra
// sólida (sem blur) deslocada embaixo/direita, moldura preta atrás, e o
// preenchimento branco por cima, encolhido pela espessura da borda.
//
// Interação (cores/formato do botão continuam intocados): no hover, o
// botão inteiro (moldura + sombra grudada nele) sobe 2px pra cima/esquerda,
// como se flutuasse um pouco acima da "mesa" — dá o gancho pro active:
// existente, que já faz o oposto (desce 4px, afundando na própria sombra
// até ela sumir). Hover → levanta, clique → afunda.
const bitButtonVariants = cva(
  "retro group relative inline-flex items-center justify-center gap-2 whitespace-nowrap border-none bg-transparent uppercase tracking-wide transition-transform duration-150 ease-out hover:-translate-x-0.5 hover:-translate-y-0.5 active:translate-x-1 active:translate-y-1 disabled:pointer-events-none disabled:opacity-50 disabled:hover:translate-x-0 disabled:hover:translate-y-0 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default: "text-black",
        destructive: "text-black",
        outline: "text-foreground",
        secondary: "text-black",
        ghost: "bg-transparent text-foreground",
        link: "bg-transparent text-foreground underline underline-offset-4",
      },
      size: {
        default: "px-7 py-3.5 text-[13px]",
        sm: "px-5 py-2.5 text-[11px]",
        lg: "px-9 py-4 text-sm",
        icon: "size-12",
      },
      font: {
        retro: "retro",
        normal: "font-sans normal-case tracking-normal",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
      font: "retro",
    },
  },
);

export interface BitButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof bitButtonVariants> {
  asChild?: boolean;
}

const FILL_CLASSES: Record<NonNullable<BitButtonProps["variant"]>, string> = {
  default: "bg-white",
  destructive: "bg-red-500",
  outline: "bg-background",
  secondary: "bg-secondary",
  ghost: "",
  link: "",
};

function ButtonDecorations({ variant }: { variant?: BitButtonProps["variant"] }) {
  if (variant === "ghost" || variant === "link") return null;
  const fill = FILL_CLASSES[variant ?? "default"];

  return (
    <>
      {/* sombra — some (encolhe pra dentro) quando o botão "afunda" no
          active:, dando a sensação de pressionar de verdade */}
      <span
        aria-hidden
        className="pixel-corners pointer-events-none absolute inset-0 translate-x-1 translate-y-1 bg-black/70 transition-transform duration-100 group-active:translate-x-0 group-active:translate-y-0"
      />
      {/* moldura preta */}
      <span aria-hidden className="pixel-corners pointer-events-none absolute inset-0 bg-black" />
      {/* preenchimento, encolhido pela espessura da borda (4px) */}
      <span aria-hidden className={cn("pixel-corners pointer-events-none absolute inset-1", fill)} />
    </>
  );
}

const Button = React.forwardRef<HTMLButtonElement, BitButtonProps>(
  ({ className, variant, size, font, asChild = false, children, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        ref={ref}
        className={cn(bitButtonVariants({ variant, size, font, className }))}
        {...props}
      >
        {asChild ? (
          children
        ) : (
          <>
            <ButtonDecorations variant={variant} />
            <span className="relative">{children}</span>
          </>
        )}
      </Comp>
    );
  },
);
Button.displayName = "BitButton";

export { Button, bitButtonVariants };
