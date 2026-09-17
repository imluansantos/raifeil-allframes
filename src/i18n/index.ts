import i18n from "i18next";
import { initReactI18next } from "react-i18next";

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

/* =========================================================================
 * i18n — o site é só em português. Existia aqui uma troca de idioma de
 * verdade (pt/en/es/de/it, escolhida no painel de Configurações), removida
 * por decisão do cliente: a partir de agora o site é só em português, sem
 * seletor nenhum (ver SettingsPanel.tsx, que não tem mais a seção "Idioma").
 *
 * O i18next continua em uso mesmo assim — não porque falta idioma, mas
 * porque todo componente do site já chama t("chave") em vez de texto fixo,
 * e são justamente esses arquivos pt/*.json (em src/i18n/locales/pt/) que o
 * painel do Decap edita. Trocar centenas de chamadas t()/useTranslation()
 * por string fixa não traria ganho nenhum e ainda quebraria a edição pelo
 * CMS. As pastas locales/en, es, de, it continuam no repositório (não fazem
 * mal nenhum aí paradas) mas não são mais importadas nem usadas em lugar
 * nenhum — dá pra apagar numa faxina futura se quiser.
 * ========================================================================= */

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
};

i18n.use(initReactI18next).init({
  resources,
  lng: "pt",
  fallbackLng: "pt",
  ns: [...NAMESPACES],
  defaultNS: "settings",
  interpolation: { escapeValue: false },
  react: { useSuspense: false },
});

if (typeof document !== "undefined") {
  document.documentElement.lang = "pt-BR";
}

export default i18n;
