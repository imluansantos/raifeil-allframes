import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { ChevronDown, Check, SlidersHorizontal } from "lucide-react";
import { PROJECT_CATEGORIES, type ProjectCategory } from "@/data/projects";

// "all" é o valor interno (comparação/estado) — o texto exibido ("Todos" /
// "All" / "Todos" / "Alle" / "Tutti") vem de portfolio.json:filters.all e
// nunca é comparado, só mostrado. Os nomes de categoria (PC White, PC Black,
// RGB, AF Ultra) ficam iguais em todos os idiomas de propósito — são nomes
// de estilo/categoria, não frases (mesmo critério já usado pras marcas de
// hardware em Hardware.tsx).
export type ProjectFilterValue = "all" | ProjectCategory;

const OPTIONS: ProjectFilterValue[] = ["all", ...PROJECT_CATEGORIES];

export function ProjectFilters({
  active,
  onChange,
}: {
  active: ProjectFilterValue;
  onChange: (value: ProjectFilterValue) => void;
}) {
  const { t } = useTranslation("portfolio");
  const [open, setOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const isFiltered = active !== "all";
  const labelFor = (option: ProjectFilterValue) => (option === "all" ? t("filters.all") : option);

  useEffect(() => {
    if (!open) return;
    const onClickOutside = (e: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, [open]);

  return (
    <div>
      <span className="eyebrow mb-2 block">{t("filters.label")}</span>

      {/* ===== mobile: dropdown ===== */}
      <div ref={wrapperRef} className="relative sm:hidden">
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          aria-haspopup="listbox"
          className={`flex w-full items-center justify-between gap-3 rounded-full border px-4 py-3 text-[12px] font-semibold tracking-[0.08em] uppercase transition-colors ${
            isFiltered ? "border-foreground/60 text-foreground" : "border-border text-foreground"
          }`}
        >
          <span className="flex items-center gap-2.5">
            <SlidersHorizontal className="size-3.5 text-foreground" aria-hidden />
            {labelFor(active)}
            {isFiltered && (
              <span className="size-1.5 shrink-0 rounded-full bg-foreground" aria-hidden />
            )}
          </span>
          <ChevronDown
            className={`size-4 text-muted-foreground transition-transform duration-200 ${
              open ? "rotate-180" : ""
            }`}
          />
        </button>

        {open && (
          <ul
            role="listbox"
            className="absolute inset-x-0 top-[calc(100%+6px)] z-30 overflow-hidden rounded-md border border-border bg-background shadow-[0_16px_40px_-12px_rgba(0,0,0,0.7)]"
          >
            {OPTIONS.map((option) => {
              const isActive = option === active;
              return (
                <li key={option} role="option" aria-selected={isActive}>
                  <button
                    type="button"
                    onClick={() => {
                      onChange(option);
                      setOpen(false);
                    }}
                    className={`flex w-full items-center justify-between gap-3 border-b border-border/60 px-4 py-3 text-left text-[12px] font-semibold tracking-[0.08em] uppercase last:border-b-0 ${
                      isActive
                        ? "bg-foreground/10 text-foreground"
                        : "text-muted-foreground hover:bg-surface hover:text-foreground"
                    }`}
                  >
                    {labelFor(option)}
                    {isActive && <Check className="size-3.5 shrink-0" />}
                  </button>
                </li>
              );
            })}
          </ul>
        )}
      </div>

      {/* ===== desktop/tablet: pill segmented control ===== */}
      <div
        aria-label={t("filters.ariaLabel")}
        className="hidden items-center gap-2.5 sm:flex"
      >
        <SlidersHorizontal className="size-3.5 shrink-0 text-foreground" aria-hidden />
        <div className="inline-flex flex-nowrap gap-2 rounded-full border border-border p-1">
          {OPTIONS.map((option) => {
            const isActive = option === active;
            return (
              <button
                key={option}
                type="button"
                aria-pressed={isActive}
                onClick={() => onChange(option)}
                className={`shrink-0 rounded-full px-4 py-2 text-[12px] font-semibold tracking-[0.08em] whitespace-nowrap uppercase transition-colors duration-200 ${
                  isActive
                    ? "bg-foreground text-background"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {labelFor(option)}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}