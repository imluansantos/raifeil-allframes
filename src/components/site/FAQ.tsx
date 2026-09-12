import { useEffect, useMemo, useRef, useState } from "react";
import type { LucideIcon } from "lucide-react";
import { ArrowUpRight, CalendarClock, CreditCard, Cpu, LifeBuoy } from "lucide-react";
import { useTranslation } from "react-i18next";
import { WHATSAPP_URL } from "@/data/site";
import { SectionFade } from "@/components/site/SectionFade";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

/* =========================================================================
 * Seção FAQ — reformulada no formato "base de conhecimento" (categorias
 * numa barra lateral, perguntas em acordeão do lado). Porte fiel do
 * componente de referência (faq-tabbed-explorer, 21st.dev / uilayout.contact):
 * https://21st.dev/community/components/s/faq?preview=%2F%40uilayout.contact%2Fcomponents%2Ffaq-tabbed-explorer
 * — layout adaptado ao design system escuro do site (tokens de cor, .display,
 * .eyebrow, text-veil) em vez do visual claro do componente original.
 *
 * Categorias e perguntas agora vêm inteiramente de
 * src/i18n/locales/<idioma>/faq.json (t("categories", { returnObjects: true })
 * retorna o array completo, categoria por categoria, já traduzido) — nada
 * mais fica hardcoded em português aqui, só o ícone de cada categoria
 * (CATEGORY_ICON), que é mapeado pela `key` (budget/assembly/payment/
 * support), não pelo texto exibido.
 * ========================================================================= */

type FaqQuestion = { question: string; answer: string };
type FaqCategory = { key: string; label: string; description: string; questions: FaqQuestion[] };

const CATEGORY_ICON: Record<string, LucideIcon> = {
  budget: CalendarClock,
  assembly: Cpu,
  payment: CreditCard,
  support: LifeBuoy,
};

export function FAQ() {
  const { t } = useTranslation("faq");
  const sectionRef = useRef<HTMLElement>(null);
  const [visible, setVisible] = useState(false);
  const categories = t("categories", { returnObjects: true }) as FaqCategory[];
  const [categoryKey, setCategoryKey] = useState<string>(categories[0]?.key ?? "budget");
  const category = categories.find((c) => c.key === categoryKey) ?? categories[0];

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          setVisible(true);
          io.disconnect();
        }
      },
      { threshold: 0.15 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const items = useMemo(() => category?.questions ?? [], [category]);

  return (
    <section id="faq" ref={sectionRef} className="relative border-t border-border">
      {/* degradê das divisas com as seções vizinhas — entram/saem de outro
          tier (cinza chumbo dos dois lados), mas ainda suavizam o grid bem
          no início/fim antes da troca de cor */}
      <SectionFade side="top" />
      <SectionFade side="bottom" />
      <style>{`
        @keyframes faqDrawLine {
          from { transform: scaleY(0); }
          to { transform: scaleY(1); }
        }
      `}</style>

      <div className="mx-auto max-w-[1600px] px-6 py-16 lg:px-14 md:py-24">
        <div className="mx-auto max-w-2xl text-veil text-center">
          <div
            className={`flex items-center justify-center gap-3 ${visible ? "reveal-left" : "opacity-0"}`}
            style={{ animationDelay: "0ms" }}
          >
            <span
              className="h-3 w-px origin-top bg-foreground"
              style={
                visible
                  ? { animation: "faqDrawLine 0.6s 0.2s cubic-bezier(0.16,1,0.3,1) both" }
                  : undefined
              }
            />
            <span className="eyebrow">{t("eyebrow")}</span>
          </div>
          <h2
            className={`display mt-4 text-3xl text-foreground md:text-5xl ${visible ? "reveal-left" : "opacity-0"}`}
            style={{ animationDelay: "80ms" }}
          >
            {t("title")}
          </h2>
          <p
            className={`mx-auto mt-4 max-w-md text-[14px] leading-relaxed text-muted-foreground ${visible ? "reveal-left" : "opacity-0"}`}
            style={{ animationDelay: "140ms" }}
          >
            {t("subtitle")}
          </p>
        </div>

        {/* base de conhecimento: barra de categorias (lateral no desktop,
            linha horizontal rolável no mobile) + perguntas em acordeão */}
        <div
          className={`mx-auto mt-9 max-w-5xl overflow-hidden rounded-2xl border border-border bg-surface md:flex ${
            visible ? "reveal-left" : "opacity-0"
          }`}
          style={{ animationDelay: "200ms" }}
        >
          <div className="w-full shrink-0 border-b border-border p-5 md:w-64 md:border-r md:border-b-0 md:p-6">
            <span className="eyebrow mb-4 block px-1">{t("sidebarLabel")}</span>
            {/* no mobile, grade 2x2 (nada de rolagem horizontal cortando o
                último item na metade) — no desktop volta a ser uma coluna só,
                empilhada na lateral. */}
            <nav className="grid grid-cols-2 gap-2 md:flex md:flex-col">
              {categories.map((c) => {
                const Icon = CATEGORY_ICON[c.key];
                const active = c.key === categoryKey;
                return (
                  <button
                    key={c.key}
                    type="button"
                    onClick={() => setCategoryKey(c.key)}
                    className={`flex items-center gap-2 rounded-full border px-3 py-2.5 text-left text-[12px] leading-tight font-medium tracking-[0.01em] transition-colors md:gap-2.5 md:px-3.5 md:text-[12.5px] ${
                      active
                        ? "border-foreground/25 bg-background text-foreground"
                        : "border-transparent text-muted-foreground hover:border-border hover:text-foreground"
                    }`}
                  >
                    {Icon && <Icon className="size-4 shrink-0" aria-hidden />}
                    {c.label}
                  </button>
                );
              })}
            </nav>
          </div>

          <div className="flex-1 p-6 md:p-8">
            <div className="mb-6">
              <h3 className="display text-xl text-foreground md:text-2xl">{category?.label}</h3>
              <p className="mt-1.5 text-[13px] leading-relaxed text-muted-foreground">
                {category?.description}
              </p>
            </div>

            {/* key={categoryKey} força remontagem ao trocar de aba, então a
                primeira pergunta da nova categoria já abre sozinha — mesmo
                comportamento do acordeão anterior, sem precisar de estado
                controlado à parte pra isso. */}
            <Accordion key={categoryKey} type="single" collapsible defaultValue={items[0]?.question} className="space-y-3">
              {items.map((item) => (
                <AccordionItem
                  key={item.question}
                  value={item.question}
                  className="overflow-hidden rounded-xl border border-border bg-background/60 px-4 last:border-b"
                >
                  <AccordionTrigger className="text-[14px] font-semibold text-foreground hover:text-muted-foreground hover:no-underline md:text-[14.5px]">
                    {item.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-[13px] leading-relaxed text-muted-foreground">
                    {item.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </div>

        <div
          className={`mt-8 flex justify-center ${visible ? "reveal-left" : "opacity-0"}`}
          style={{ animationDelay: "260ms" }}
        >
          <a
            href={WHATSAPP_URL}
            target="_blank"
            rel="noreferrer"
            className="group flex items-center gap-1.5 text-[12.5px] font-medium text-muted-foreground transition-colors hover:text-foreground"
          >
            {t("bottomLink")}
            <ArrowUpRight className="size-3.5 shrink-0 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </a>
        </div>
      </div>
    </section>
  );
}
