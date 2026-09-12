"use client";

import * as React from "react";
import {
  motion,
  useMotionTemplate,
  useMotionValue,
  useSpring,
  useTransform,
  type MotionStyle,
  type SpringOptions,
} from "motion/react";

export type TiltProps = {
  children: React.ReactNode;
  className?: string;
  style?: MotionStyle;
  /**
   * Maximum rotation angle in degrees.
   * @default 15
   */
  rotationFactor?: number;
  /**
   * Reverse the tilt direction.
   * @default false
   */
  isReverse?: boolean;
  springOptions?: SpringOptions;
};

export function Tilt({
  children,
  className,
  style,
  rotationFactor = 15,
  isReverse = false,
  springOptions,
}: TiltProps) {
  const ref = React.useRef<HTMLDivElement>(null);

  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const xSpring = useSpring(x, springOptions);
  const ySpring = useSpring(y, springOptions);

  const rotateX = useTransform(
    ySpring,
    [-0.5, 0.5],
    isReverse
      ? [rotationFactor, -rotationFactor]
      : [-rotationFactor, rotationFactor],
  );
  const rotateY = useTransform(
    xSpring,
    [-0.5, 0.5],
    isReverse
      ? [-rotationFactor, rotationFactor]
      : [rotationFactor, -rotationFactor],
  );

  const transform = useMotionTemplate`perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;

  // Direto e síncrono, sem rAF nosso por cima: `x`/`y` são motion values do
  // framer-motion, que já tem seu próprio agendador de frame internamente —
  // ele já coalesce múltiplas chamadas de `.set()` dentro do mesmo frame de
  // tela em uma única escrita no DOM. Um rAF adicional aqui só empilhava
  // mais um frame de atraso entre o movimento do mouse e a resposta visual
  // (mais lento de perceber), sem reduzir trabalho de verdade — por isso
  // saiu. `getBoundingClientRect` é uma leitura barata aqui, já que nada
  // neste componente escreve em propriedades de layout (só `transform`).
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = ref.current?.getBoundingClientRect();
    if (!rect) return;
    x.set((e.clientX - rect.left) / rect.width - 0.5);
    y.set((e.clientY - rect.top) / rect.height - 0.5);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      ref={ref}
      className={className}
      style={{ transformStyle: "preserve-3d", ...style, transform }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      {children}
    </motion.div>
  );
}