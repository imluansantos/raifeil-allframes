import setup1 from "@/assets/setup1.webp";
import reformaUpgrade from "@/assets/upgrade.webp";
import Personalizacao from "@/assets/personalizacao.webp";
import SuporteTecnico from "@/assets/suporte-tecnico.webp";

export interface ServicePageData {
  slug: string;
  /** rota da página — usada tanto pelos cards da home quanto pelo cross-link
   *  "outros serviços" no final de cada página de serviço. */
  path: string;
  number: string;
  image: string;
  imagePosition?: string;
}

// Conteúdo estrutural (não-traduzível) dos 4 serviços — usado pelos cards da
// seção Serviços (home) e pelas páginas de detalhe de cada um
// (src/routes/<slug>.tsx). Todo o texto traduzível (title/lead/description/
// items/highlights/requestables) vive em src/i18n/locales/<idioma>/
// servicePages.json, indexado pelo mesmo `slug` daqui — ver ServicePage.tsx.
export const SERVICE_PAGES: ServicePageData[] = [
  {
    slug: "montagem-de-setups",
    path: "/montagem-de-setups",
    number: "01",
    image: setup1,
    imagePosition: "50% 54%",
  },
  {
    slug: "reforma-e-upgrade",
    path: "/reforma-e-upgrade",
    number: "02",
    image: reformaUpgrade,
    imagePosition: "50% 24%",
  },
  {
    slug: "personalizacao",
    path: "/personalizacao",
    number: "03",
    image: Personalizacao,
  },
  {
    slug: "suporte-tecnico",
    path: "/suporte-tecnico",
    number: "04",
    image: SuporteTecnico,
    imagePosition: "50% 24%",
  },
];

export function getServicePageBySlug(slug: string) {
  return SERVICE_PAGES.find((s) => s.slug === slug);
}
