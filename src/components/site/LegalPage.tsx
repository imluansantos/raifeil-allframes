import { Link } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";
import { ArrowLeft } from "lucide-react";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { FixedBackButton } from "@/components/site/FixedBackButton";

type LegalDocKey = "privacyPolicy" | "termsOfUse";
type LegalSection = { heading: string; body: string[] };

// Template compartilhado pelas páginas legais (Política de Privacidade,
// Termos de Uso) — editorial, sem foto de banner, só o essencial pra
// leitura: título, data de atualização e seções em prosa. Todo o texto vem
// de i18n/locales/<idioma>/legal.json, indexado por `docKey` — ver
// src/data/legal.ts (só guarda o identificador, não mais o texto).
export function LegalPage({ docKey }: { docKey: LegalDocKey }) {
  const { t } = useTranslation("legal");
  const title = t(`${docKey}.title`);
  const updated = t(`${docKey}.updated`);
  const intro = t(`${docKey}.intro`);
  const sections = t(`${docKey}.sections`, { returnObjects: true }) as LegalSection[];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      {/* Botão "Início" fixo — some enquanto o topo da página (id="legal-hero")
          está visível (o link "Início" normal logo abaixo do Header já cobre
          esse momento) e só aparece, com fundo opaco, depois que esse bloco
          sai da tela. Mesmo padrão usado em /portfolio, ver
          FixedBackButton.tsx. */}
      <FixedBackButton targetId="legal-hero" to="/" label={t("chrome.backLabel")} />
      <main>
        <section id="legal-hero" className="relative overflow-hidden border-b border-border pt-32 pb-14 md:pt-40 md:pb-16">
          <div className="mx-auto max-w-[900px] px-6 lg:px-14">
            <Link
              to="/"
              className="group inline-flex items-center gap-2 text-[12px] font-semibold tracking-[0.12em] text-muted-foreground uppercase transition-colors hover:text-foreground"
            >
              <ArrowLeft className="size-3.5 transition-transform group-hover:-translate-x-0.5" />
              {t("chrome.backLabel")}
            </Link>
            <h1 className="display mt-6 text-3xl text-foreground md:text-5xl">{title}</h1>
            <p className="mt-3 text-[13px] text-muted-foreground">
              {t("chrome.updatedLabel", { date: updated })}
            </p>
            <p className="mt-6 max-w-2xl text-[15px] leading-relaxed text-foreground/85">
              {intro}
            </p>
          </div>
        </section>

        <section>
          <div className="mx-auto max-w-[900px] px-6 py-14 lg:px-14 md:py-20">
            <div className="space-y-10">
              {sections.map((section) => (
                <div key={section.heading}>
                  <h2 className="text-[15px] font-semibold text-foreground md:text-base">
                    {section.heading}
                  </h2>
                  <div className="mt-3 space-y-3">
                    {section.body.map((paragraph, i) => (
                      <p
                        key={i}
                        className="text-[13.5px] leading-relaxed text-muted-foreground"
                      >
                        {paragraph}
                      </p>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            <p className="mt-14 border-t border-border pt-6 text-[12px] leading-relaxed text-muted-foreground/70">
              {t("chrome.disclaimer")}
            </p>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
