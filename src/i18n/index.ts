import i18n from "i18next";
import { initReactI18next } from "react-i18next";

import { DEFAULT_LANGUAGE, LANGUAGES, isLanguageCode } from "./languages";

import ptNav from "./locales/pt/nav.json";
import ptHeader from "./locales/pt/header.json";
import ptHero from "./locales/pt/hero.json";
import ptFooter from "./locales/pt/footer.json";
import ptCookies from "./locales/pt/cookies.json";
import ptSettings from "./locales/pt/settings.json";
import ptAboutUs from "./locales/pt/aboutus.json";
import ptTeam from "./locales/pt/team.json";
import ptServices from "./locales/pt/services.json";
import ptProjectsSection from "./locales/pt/projectsSection.json";
import ptHardware from "./locales/pt/hardware.json";
import ptDifferentials from "./locales/pt/differentials.json";
import ptTestimonials from "./locales/pt/testimonials.json";
import ptFaq from "./locales/pt/faq.json";
import ptFinalCta from "./locales/pt/finalcta.json";
import ptServicePages from "./locales/pt/servicePages.json";
import ptPortfolio from "./locales/pt/portfolio.json";
import ptLegal from "./locales/pt/legal.json";

import enNav from "./locales/en/nav.json";
import enHeader from "./locales/en/header.json";
import enHero from "./locales/en/hero.json";
import enFooter from "./locales/en/footer.json";
import enCookies from "./locales/en/cookies.json";
import enSettings from "./locales/en/settings.json";
import enAboutUs from "./locales/en/aboutus.json";
import enTeam from "./locales/en/team.json";
import enServices from "./locales/en/services.json";
import enProjectsSection from "./locales/en/projectsSection.json";
import enHardware from "./locales/en/hardware.json";
import enDifferentials from "./locales/en/differentials.json";
import enTestimonials from "./locales/en/testimonials.json";
import enFaq from "./locales/en/faq.json";
import enFinalCta from "./locales/en/finalcta.json";
import enServicePages from "./locales/en/servicePages.json";
import enPortfolio from "./locales/en/portfolio.json";
import enLegal from "./locales/en/legal.json";

import esNav from "./locales/es/nav.json";
import esHeader from "./locales/es/header.json";
import esHero from "./locales/es/hero.json";
import esFooter from "./locales/es/footer.json";
import esCookies from "./locales/es/cookies.json";
import esSettings from "./locales/es/settings.json";
import esAboutUs from "./locales/es/aboutus.json";
import esTeam from "./locales/es/team.json";
import esServices from "./locales/es/services.json";
import esProjectsSection from "./locales/es/projectsSection.json";
import esHardware from "./locales/es/hardware.json";
import esDifferentials from "./locales/es/differentials.json";
import esTestimonials from "./locales/es/testimonials.json";
import esFaq from "./locales/es/faq.json";
import esFinalCta from "./locales/es/finalcta.json";
import esServicePages from "./locales/es/servicePages.json";
import esPortfolio from "./locales/es/portfolio.json";
import esLegal from "./locales/es/legal.json";

import deNav from "./locales/de/nav.json";
import deHeader from "./locales/de/header.json";
import deHero from "./locales/de/hero.json";
import deFooter from "./locales/de/footer.json";
import deCookies from "./locales/de/cookies.json";
import deSettings from "./locales/de/settings.json";
import deAboutUs from "./locales/de/aboutus.json";
import deTeam from "./locales/de/team.json";
import deServices from "./locales/de/services.json";
import deProjectsSection from "./locales/de/projectsSection.json";
import deHardware from "./locales/de/hardware.json";
import deDifferentials from "./locales/de/differentials.json";
import deTestimonials from "./locales/de/testimonials.json";
import deFaq from "./locales/de/faq.json";
import deFinalCta from "./locales/de/finalcta.json";
import deServicePages from "./locales/de/servicePages.json";
import dePortfolio from "./locales/de/portfolio.json";
import deLegal from "./locales/de/legal.json";

import itNav from "./locales/it/nav.json";
import itHeader from "./locales/it/header.json";
import itHero from "./locales/it/hero.json";
import itFooter from "./locales/it/footer.json";
import itCookies from "./locales/it/cookies.json";
import itSettings from "./locales/it/settings.json";
import itAboutUs from "./locales/it/aboutus.json";
import itTeam from "./locales/it/team.json";
import itServices from "./locales/it/services.json";
import itProjectsSection from "./locales/it/projectsSection.json";
import itHardware from "./locales/it/hardware.json";
import itDifferentials from "./locales/it/differentials.json";
import itTestimonials from "./locales/it/testimonials.json";
import itFaq from "./locales/it/faq.json";
import itFinalCta from "./locales/it/finalcta.json";
import itServicePages from "./locales/it/servicePages.json";
import itPortfolio from "./locales/it/portfolio.json";
import itLegal from "./locales/it/legal.json";

/* =========================================================================
 * i18n — painel de Configurações, seção "Idioma". Português / English /
 * Español / Deutsch / Italiano, organizados em arquivos JSON por seção do
 * site (nav, header, hero, footer, cookies, settings, aboutus, team,
 * services, projectsSection, hardware, differentials, testimonials, faq,
 * finalcta — ver src/i18n/locales/<idioma>/*.json), não um arquivo único
 * gigante.
 *
 * Sem plugin de detecção de navegador/SSR de propósito: mesmo padrão já
 * usado em use-theme.ts/use-animation-level.ts/use-cursor.ts — a preferência
 * é lida do localStorage manualmente (guardado por `typeof window`, então
 * funciona igual em SSR: cai no padrão "pt" no servidor e hidrata pro valor
 * salvo assim que o módulo carrega no navegador) e persistida no evento
 * "languageChanged" do próprio i18next. Evita puxar mais uma dependência
 * (i18next-browser-languagedetector) só pra isso.
 * ========================================================================= */

const STORAGE_KEY = "af-language";

const NAMESPACES = [
  "nav",
  "header",
  "hero",
  "footer",
  "cookies",
  "settings",
  "aboutus",
  "team",
  "services",
  "projectsSection",
  "hardware",
  "differentials",
  "testimonials",
  "faq",
  "finalcta",
  "servicePages",
  "portfolio",
  "legal",
] as const;

const resources = {
  pt: {
    nav: ptNav,
    header: ptHeader,
    hero: ptHero,
    footer: ptFooter,
    cookies: ptCookies,
    settings: ptSettings,
    aboutus: ptAboutUs,
    team: ptTeam,
    services: ptServices,
    projectsSection: ptProjectsSection,
    hardware: ptHardware,
    differentials: ptDifferentials,
    testimonials: ptTestimonials,
    faq: ptFaq,
    finalcta: ptFinalCta,
    servicePages: ptServicePages,
    portfolio: ptPortfolio,
    legal: ptLegal,
  },
  en: {
    nav: enNav,
    header: enHeader,
    hero: enHero,
    footer: enFooter,
    cookies: enCookies,
    settings: enSettings,
    aboutus: enAboutUs,
    team: enTeam,
    services: enServices,
    projectsSection: enProjectsSection,
    hardware: enHardware,
    differentials: enDifferentials,
    testimonials: enTestimonials,
    faq: enFaq,
    finalcta: enFinalCta,
    servicePages: enServicePages,
    portfolio: enPortfolio,
    legal: enLegal,
  },
  es: {
    nav: esNav,
    header: esHeader,
    hero: esHero,
    footer: esFooter,
    cookies: esCookies,
    settings: esSettings,
    aboutus: esAboutUs,
    team: esTeam,
    services: esServices,
    projectsSection: esProjectsSection,
    hardware: esHardware,
    differentials: esDifferentials,
    testimonials: esTestimonials,
    faq: esFaq,
    finalcta: esFinalCta,
    servicePages: esServicePages,
    portfolio: esPortfolio,
    legal: esLegal,
  },
  de: {
    nav: deNav,
    header: deHeader,
    hero: deHero,
    footer: deFooter,
    cookies: deCookies,
    settings: deSettings,
    aboutus: deAboutUs,
    team: deTeam,
    services: deServices,
    projectsSection: deProjectsSection,
    hardware: deHardware,
    differentials: deDifferentials,
    testimonials: deTestimonials,
    faq: deFaq,
    finalcta: deFinalCta,
    servicePages: deServicePages,
    portfolio: dePortfolio,
    legal: deLegal,
  },
  it: {
    nav: itNav,
    header: itHeader,
    hero: itHero,
    footer: itFooter,
    cookies: itCookies,
    settings: itSettings,
    aboutus: itAboutUs,
    team: itTeam,
    services: itServices,
    projectsSection: itProjectsSection,
    hardware: itHardware,
    differentials: itDifferentials,
    testimonials: itTestimonials,
    faq: itFaq,
    finalcta: itFinalCta,
    servicePages: itServicePages,
    portfolio: itPortfolio,
    legal: itLegal,
  },
};

function readStoredLanguage(): string {
  if (typeof window === "undefined") return DEFAULT_LANGUAGE;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    return isLanguageCode(raw) ? raw : DEFAULT_LANGUAGE;
  } catch {
    return DEFAULT_LANGUAGE;
  }
}

function applyHtmlLang(code: string) {
  if (typeof document === "undefined") return;
  const match = LANGUAGES.find((l) => l.code === code);
  document.documentElement.lang = match?.htmlLang ?? "pt-BR";
}

i18n.use(initReactI18next).init({
  resources,
  lng: readStoredLanguage(),
  fallbackLng: DEFAULT_LANGUAGE,
  supportedLngs: LANGUAGES.map((l) => l.code),
  ns: [...NAMESPACES],
  defaultNS: "settings",
  interpolation: { escapeValue: false },
  react: { useSuspense: false },
});

applyHtmlLang(i18n.language);

if (typeof window !== "undefined") {
  i18n.on("languageChanged", (lng) => {
    applyHtmlLang(lng);
    try {
      window.localStorage.setItem(STORAGE_KEY, lng);
    } catch {
      // best-effort
    }
  });
}

export default i18n;
