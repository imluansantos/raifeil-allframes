export const WHATSAPP_NUMBER = "5554997111393";
export const WHATSAPP_URL = `https://wa.me/${WHATSAPP_NUMBER}`;
export const PHONE_DISPLAY = "(54) 99711-1393";
export const INSTAGRAM = "@allframestechnology";
export const INSTAGRAM_URL = "https://instagram.com/allframestechnology";
export const TIKTOK_URL = "https://www.tiktok.com/@allframes";
export const YOUTUBE_URL = "https://www.youtube.com/@allframestechnology";
export const ADDRESS = "Rua Marechal Floriano, 205, Centro, Bento Gonçalves/RS";

// crédito do desenvolvedor no rodapé — nome próprio, não traduzido em
// nenhum idioma (mesmo padrão de "AF Ultra"/"PC White"). Ver Footer.tsx.
export const DEVELOPER_NAME = "Lunding Technology";
export const DEVELOPER_URL = "https://lunding.com.br";

// `key` bate com as chaves de src/i18n/locales/<idioma>/nav.json — Header.tsx
// e Footer.tsx traduzem via t(`nav:${item.key}`) em vez de usar um label fixo
// aqui (isso que faz a navegação virar EN/ES/DE/IT junto com o resto do site
// na seção Idioma do painel de Configurações).
export const NAV = [
  { key: "home", href: "#top" },
  // ATENÇÃO: esses hrefs têm que bater exatamente com o id="..." da seção
  // correspondente (AboutUs.tsx tem id="sobre", ProjectsSection.tsx tem
  // id="projetos") — era "#sobrenos"/"#portfolio" antes, sem seção nenhuma
  // com esse id, e por isso tanto o scroll quanto o "link ativo" do Header
  // quebravam nesses dois.
  { key: "about", href: "#sobre" },
  { key: "services", href: "#servicos" },
  { key: "portfolio", href: "#projetos" },
  { key: "differentials", href: "#diferenciais" },
  { key: "testimonials", href: "#depoimentos" },
  { key: "faq", href: "#faq" },
] as const;

export const SERVICES = [
  {
    id: "montagem",
    number: "01",
    title: "Montagem de setups",
    lead: "Do orçamento à primeira inicialização. Cada peça escolhida para o seu uso real, não para encher planilha.",
    items: [
      "Consultoria de peças e compatibilidade",
      "Montagem com cable management",
      "Testes de estabilidade e temperatura",
      "Instalação de sistema e drivers",
    ],
  },
  {
    id: "reforma",
    number: "02",
    title: "Reforma e upgrade",
    lead: "Seu setup atual, mais rápido e mais bonito.",
    items: ["Diagnóstico completo", "Troca de peças e refrigeração", "Limpeza e retrofit"],
  },
  {
    id: "personalizacao",
    number: "03",
    title: "Personalização",
    lead: "RGB, cabos sleeved, water cooling custom e temas.",
    items: ["Cabos sleeved sob medida", "Water cooling custom", "Temas e acabamento"],
  },
  {
    id: "suporte",
    number: "04",
    title: "Suporte técnico",
    lead: "Pós-venda de verdade. Nenhum cliente esquecido.",
    items: ["Atendimento direto", "Manutenção preventiva", "Acompanhamento vitalício"],
  },
];

export const BRANDS = [
  "Intel",
  "AMD",
  "NVIDIA",
  "ASUS",
  "Corsair",
  "Kingston",
  "Samsung",
  "MSI",
  "Cooler Master",
];

// `key` bate com src/i18n/locales/<idioma>/team.json → members.<key> — role e
// bio agora vêm traduzidos de lá (Team.tsx faz t(`members.${key}.role`) etc.),
// só o nome de cada pessoa continua fixo aqui (nome próprio não se traduz).
export const TEAM = [
  { name: "Luiz Fernando Welp", key: "luiz" },
  { name: "João Gabriel Guedes Galiazzi", key: "joao" },
  { name: "Raí Feil dos Santos", key: "rai" },
  { name: "Gabriel Dorneles", key: "gabriel" },
] as const;

// Comparativo usado na seção Diferenciais. Cada linha contrasta como uma
// etapa costuma acontecer numa assistência comum e como ela acontece aqui.
// Frases curtas e diretas de propósito (formato compacto tipo tabela).
// Tom deliberadamente factual e sóbrio, site institucional, sem valores.
export const COMPARISON = [
  {
    topic: "Consultoria de peças",
    allFrames: "Peças pensadas pro seu uso real, jogo ou trabalho.",
    others: "Kits fechados, iguais pra qualquer cliente.",
  },
  {
    topic: "Orçamento",
    allFrames: "Você entende cada troca antes de comprar.",
    others: "Fechado, sem detalhamento do que foi analisado.",
  },
  {
    topic: "Acabamento da montagem",
    allFrames: "Cable management e testes antes da entrega.",
    others: "Entrega funcional, sem cuidado com o interior.",
  },
  {
    topic: "Pós-entrega",
    allFrames: "Vitalício, direto com quem montou o seu PC.",
    others: "Terceirizado, você recomeça do zero.",
  },
  {
    topic: "Canal de comunicação",
    allFrames: "WhatsApp direto, sem central de atendimento.",
    others: "Fila de atendimento, retorno sem prazo.",
  },
  {
    topic: "Presença local",
    allFrames: "Atendimento presencial em Bento Gonçalves.",
    others: "Suporte só remoto.",
  },
];

// Sem campo de cidade de propósito: os depoimentos abaixo vieram sem
// confirmação de onde cada cliente mora, então o card mostra só nome + cargo
// (ver ReviewCard em marquee-01.tsx, que já trata "cidade" como opcional).
//
// `key` bate com src/i18n/locales/<idioma>/testimonials.json → quotes.<key> —
// o texto do depoimento e o cargo ("Cliente") agora vêm traduzidos de lá
// (marquee-01.tsx faz t(`quotes.${key}`) e t("clientRole")); nome e nota
// (rating) continuam fixos aqui.
export const TESTIMONIALS = [
  { key: "t01", name: "Gabriel N.", rating: 5 },
  { key: "t02", name: "Franzoh", rating: 5 },
  { key: "t03", name: "Andressa C.", rating: 5 },
  { key: "t04", name: "Matheus S.", rating: 5 },
  { key: "t05", name: "Giulia P.", rating: 5 },
  { key: "t06", name: "Henry", rating: 5 },
  { key: "t07", name: "Lucas P.", rating: 5 },
  { key: "t08", name: "Fernanda T.", rating: 5 },
  { key: "t09", name: "Deisi G.", rating: 5 },
  { key: "t10", name: "Patrik V.", rating: 5 },
  { key: "t11", name: "Henrique D.", rating: 5 },
  { key: "t12", name: "Jean B.", rating: 5 },
  { key: "t13", name: "Luan S.", rating: 5 },
  { key: "t14", name: "Vinicius Z.", rating: 5 },
  { key: "t15", name: "Bruno M.", rating: 5 },
  { key: "t16", name: "Jennifer C.", rating: 5 },
  { key: "t17", name: "Arthur S.", rating: 5 },
  { key: "t18", name: "Eduardo G.", rating: 5 },
] as const;

export const STATS = [
  { value: "+10.000", label: "setups entregues" },
  { value: "8 anos", label: "de oficina" },
  { value: "100%", label: "pós-venda ativo" },
  { value: "Bento Gonçalves", label: "RS · atendimento local" },
];
