import build1 from "@/assets/build1.webp";
import build3 from "@/assets/build3.webp";
import build5 from "@/assets/build5.webp";
import build6 from "@/assets/build6.webp"
import build7 from "@/assets/build7.webp"
import build8 from "@/assets/build8.webp"
import build9 from "@/assets/build9.webp"
import build10 from "@/assets/build10.webp"
import build13 from "@/assets/build13.webp"
import polarHeroVideo from "@/assets/polar-hero.mp4";
import polarHeroPoster from "@/assets/polar-hero-poster.webp";

// build2.png fica de fora de propósito — é a mesma foto usada no fundo do Hero
// da home, então repeti-la aqui criaria uma duplicata visual entre as páginas.

export type ProjectCategory = "AF Ultra" | "PC White" | "PC Black" | "RGB";

export interface ProjectSpecs {
  cpu?: string;
  gpu?: string;
  ram?: string;
  storage?: string;
  cooling?: string;
  motherboard?: string;
  case?: string;
}

export interface Project {
  /** Número de exibição — "001", "002"... usado como microtipografia técnica. */
  id: string;
  /** Segmento de URL: /portfolio/[slug] — também usado como chave de tradução
   *  em i18n/locales/<idioma>/portfolio.json (projects.<slug>). */
  slug: string;
  /** Nome do build — mantido igual em todos os idiomas (nome próprio, como o
   *  dos membros da equipe ou os "AF Ultra"/"PC White" das categorias), não é
   *  traduzido. */
  title: string;
  category: ProjectCategory;
  cover: string;
  /** equivalente ao `object-position` do CSS — ajusta o enquadramento do
   *  `cover` quando ele é cortado (object-cover) nos cards, sem alterar o
   *  card/div em si. Omitido = centralizado (padrão do navegador). */
  imagePosition?: string;
  /**
   * Fotos extras pra galeria da página de detalhe. Nenhum projeto atual tem
   * imagens sobrando além da capa, então fica undefined por enquanto — a
   * página de detalhe já está pronta pra renderizar assim que você adicionar.
   */
  gallery?: string[];
  /**
   * Vídeo (mp4, sem áudio) pro banner da página de detalhe — quando presente,
   * substitui a foto estática do `cover` só nessa seção, em loop mudo. `cover`
   * continua sendo usado normalmente nos cards (home/portfolio/relacionados)
   * e como fallback de acessibilidade/pouca conexão. Ver routes/portfolio/$slug.tsx.
   */
  video?: string;
  /** Poster do `video` — primeiro quadro exibido antes do vídeo carregar/tocar
   *  (evita tela em branco) e usado no lugar do vídeo quando o usuário
   *  desativa animações nas Configurações. */
  videoPoster?: string;
  /**
   * `shortDescription`/`description`/`objective`/`specs` (os campos com texto
   * traduzível) vivem em i18n/locales/<idioma>/portfolio.json, na chave
   * `projects.<slug>` — não ficam mais aqui. Ver ProjectCard.tsx e
   * routes/portfolio/$slug.tsx pra como são lidos.
   */
  /** Quais specs este projeto tem preenchidas (as chaves), na ordem de
   *  exibição — os VALORES traduzidos (ex: "Gabinete branco Lian Li...")
   *  vêm de portfolio.json:projects.<slug>.specs.<chave>. */
  specKeys: (keyof ProjectSpecs)[];
  /** Exibido nos 3 destaques da home. */
  featured?: boolean;
  /**
   * true = specs/copy são ilustrativas (derivadas só do que é visível na
   * própria foto), não um levantamento real do build. Troque pelos dados
   * reais de cada projeto assim que tiver — a estrutura já está pronta,
   * é só editar os campos abaixo.
   */
  placeholder: boolean;
}

export const PROJECTS: Project[] = [
  {
    id: "001",
    slug: "polar",
    title: "Polar",
    category: "PC White",
    cover: build6,
    video: polarHeroVideo,
    videoPoster: polarHeroPoster,
    specKeys: ["gpu", "motherboard", "cooling", "case"],
    featured: true,
    placeholder: true,
  },
  {
    id: "002",
    slug: "allframes-ultra1",
    title: "AF Ultra 1",
    category: "AF Ultra",
    cover: build5,
    imagePosition: "50% 80%",
    specKeys: ["gpu", "motherboard", "ram", "case"],
    featured: true,
    placeholder: true,
  },
  {
    id: "003",
    slug: "aurora",
    title: "Aurora",
    category: "RGB",
    cover: build10,
    specKeys: ["gpu"],
    placeholder: true,
  },
  {
    id: "004",
    slug: "pc-blueout",
    title: "Blue-Out",
    category: "PC Black",
    cover: build8,
    imagePosition: "50% 90%",
    specKeys: ["gpu", "case"],
    featured: true,
    placeholder: true,
  },
  {
    id: "005",
    slug: "snow-build",
    title: "Snow Build",
    category: "PC White",
    cover: build13,
    specKeys: ["cpu", "gpu", "motherboard", "cooling", "case"],
    placeholder: true,
  },
  {
    id: "006",
    slug: "frostline",
    title: "Frostiline",
    category: "PC White",
    cover: build7,
    specKeys: ["gpu", "motherboard", "ram", "cooling", "case"],
    placeholder: true,
  },
  {
    id: "007",
    slug: "mistic",
    title: "Mistic",
    category: "RGB",
    cover: build9,
    specKeys: ["gpu", "ram", "cooling", "case"],
    placeholder: true,
  },
  {
    id: "008",
    slug: "glacial",
    title: "Glacial",
    category: "PC Black",
    cover: build1,
    specKeys: ["gpu", "motherboard", "case"],
    placeholder: true,
  },
  {
    id: "009",
    slug: "prism",
    title: "Prism",
    category: "RGB",
    cover: build3,
    specKeys: ["gpu", "cooling", "case"],
    placeholder: true,
  },
];

export const PROJECT_CATEGORIES: ProjectCategory[] = ["AF Ultra", "PC White", "PC Black", "RGB"];

export function getFeaturedProjects(): Project[] {
  return PROJECTS.filter((p) => p.featured);
}

export function getProjectBySlug(slug: string): Project | undefined {
  return PROJECTS.find((p) => p.slug === slug);
}
