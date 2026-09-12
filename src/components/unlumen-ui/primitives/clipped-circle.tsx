"use client";

import * as React from "react";
import { motion, useMotionValue } from "motion/react";

import { cn } from "@/lib/utils";

interface ClippedCircleProps {
  className?: string;
  circleClassName?: string;
  circleSize?: number;
}

function ClippedCircle({
  className,
  circleClassName = "bg-white/20",
  circleSize = 400,
}: ClippedCircleProps) {
  const containerRef = React.useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = React.useState(false);

  /**
   * Posição do círculo é motion value (framer-motion), não `useState`.
   * Isso é a primeira otimização: antes, TODO mousemove chamava
   * `setPosition(...)`, disparando um re-render do React a cada pixel de
   * movimento do mouse — e a posição era aplicada via `left`/`top`, que
   * são propriedades de LAYOUT (o navegador recalculava o layout da
   * página inteira a cada evento). Motion values escrevem direto no
   * estilo do elemento sem passar pelo React, e ao usar `x`/`y` (em vez
   * de `left`/`top`) o framer-motion aplica isso como `transform`, que é
   * só compositor (GPU) — não gera reflow.
   *
   * `isHovered` continua sendo `useState` de propósito: só muda em
   * enter/leave (baixa frequência), então não é o gargalo — não precisa
   * virar motion value.
   */
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  // Direto e síncrono, sem rAF/cache nossos por cima: `x`/`y` são motion
  // values do framer-motion, que já agenda e coalesce as escritas no DOM
  // internamente (uma por frame de tela, não importa quantas vezes `.set()`
  // é chamado antes disso). Um rAF nosso por cima disso só adicionava mais
  // um frame de atraso entre o mouse se mover e o círculo responder — o que
  // parece mais "pesado", mesmo fazendo menos trabalho de CPU. E cachear o
  // rect do pai (em vez de medir a cada movimento) quebrava quando o card
  // tem `hover:scale-105` mudando o tamanho dele durante o hover.
  const half = circleSize / 2;

  React.useEffect(() => {
    const container = containerRef.current;
    if (!container || !container.parentElement) return;

    const parent = container.parentElement;

    const handleMouseEnter = (e: MouseEvent) => {
      const rect = parent.getBoundingClientRect();
      x.set(e.clientX - rect.left - half);
      y.set(e.clientY - rect.top - half);
      setIsHovered(true);
    };

    const handleMouseMove = (e: MouseEvent) => {
      const rect = parent.getBoundingClientRect();
      x.set(e.clientX - rect.left - half);
      y.set(e.clientY - rect.top - half);
    };

    const handleMouseLeave = () => {
      setIsHovered(false);
    };

    parent.addEventListener("mouseenter", handleMouseEnter);
    parent.addEventListener("mousemove", handleMouseMove);
    parent.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      parent.removeEventListener("mouseenter", handleMouseEnter);
      parent.removeEventListener("mousemove", handleMouseMove);
      parent.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, [half, x, y]);

  return (
    <div
      ref={containerRef}
      className={cn(
        "absolute inset-0 overflow-hidden pointer-events-none",
        className,
      )}
    >
      <motion.div
        className={cn(
          "pointer-events-none absolute rounded-full",
          circleClassName,
        )}
        style={{
          x,
          y,
          width: circleSize,
          height: circleSize,
          mixBlendMode: "difference",
        }}
        initial={{ scale: 0 }}
        animate={{ scale: isHovered ? 1 : 0 }}
        transition={{
          duration: 0.5,
          ease: [0.19, 1, 0.22, 1],
        }}
      />
    </div>
  );
}

export { ClippedCircle, type ClippedCircleProps };