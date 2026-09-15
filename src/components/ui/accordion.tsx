import * as React from "react";
import * as AccordionPrimitive from "@radix-ui/react-accordion";
import { ChevronDown } from "lucide-react";

import { cn } from "@/lib/utils";

const Accordion = AccordionPrimitive.Root;

const AccordionItem = React.forwardRef<
  React.ElementRef<typeof AccordionPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Item>
>(({ className, ...props }, ref) => (
  <AccordionPrimitive.Item ref={ref} className={cn("border-b", className)} {...props} />
));
AccordionItem.displayName = "AccordionItem";

const AccordionTrigger = React.forwardRef<
  React.ElementRef<typeof AccordionPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Trigger>
>(({ className, children, ...props }, ref) => (
  <AccordionPrimitive.Header className="flex">
    <AccordionPrimitive.Trigger
      ref={ref}
      className={cn(
        "flex flex-1 items-center justify-between py-4 text-sm font-medium cursor-pointer transition-all hover:underline text-left [&[data-state=open]>svg]:rotate-180",
        className,
      )}
      {...props}
    >
      {children}
      <ChevronDown className="h-4 w-4 shrink-0 text-muted-foreground transition-transform duration-200" />
    </AccordionPrimitive.Trigger>
  </AccordionPrimitive.Header>
));
AccordionTrigger.displayName = AccordionPrimitive.Trigger.displayName;

const AccordionContent = React.forwardRef<
  React.ElementRef<typeof AccordionPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Content>
>(({ className, children, ...props }, ref) => (
  <AccordionPrimitive.Content
    ref={ref}
    // Tentativa anterior (guardada no histórico) animava `height` via
    // @keyframes, do jeito que o Radix sugere por padrão: pra isso funcionar
    // ele precisa MEDIR a altura real do conteúdo (ResizeObserver) e só
    // então preencher a variável --radix-accordion-content-height — essa
    // medição roda bem no instante em que a animação deveria começar, e é
    // isso que dava aquele soluço/atraso: mesmo com easing e fade bons, a
    // animação em si começava "manca" porque dependia de uma medição de
    // layout no meio do caminho.
    //
    // Troca pra a técnica de grid (forceMount + grid-template-rows 0fr↔1fr,
    // ver https://css-tricks.com/css-grid-can-do-auto-height-transitions):
    // o conteúdo fica sempre montado (forceMount) e quem cresce/encolhe é a
    // TRACK do grid, não a altura calculada em JS — o navegador interpola
    // 0fr→1fr sozinho, sem nenhuma medição prévia, então a animação começa
    // no primeiro frame de verdade, sem atraso. overflow-hidden no wrapper
    // interno esconde o conteúdo enquanto a track ainda está fechada, e o
    // fade de opacidade junto disfarça o que sobra de reflow.
    forceMount
    className="grid text-sm transition-[grid-template-rows,opacity] duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] data-[state=closed]:grid-rows-[0fr] data-[state=closed]:opacity-0 data-[state=open]:grid-rows-[1fr] data-[state=open]:opacity-100"
    {...props}
  >
    <div className="overflow-hidden">
      <div className={cn("pb-4 pt-0", className)}>{children}</div>
    </div>
  </AccordionPrimitive.Content>
));
AccordionContent.displayName = AccordionPrimitive.Content.displayName;

export { Accordion, AccordionItem, AccordionTrigger, AccordionContent };
