import { createFileRoute } from "@tanstack/react-router";
import { ServicePage } from "@/components/site/ServicePage";
import { getServicePageBySlug } from "@/data/servicePages";

const service = getServicePageBySlug("montagem-de-setups")!;
// Meta de SEO fixo em português — não reativo à troca de idioma (é calculado
// fora do ciclo de render do React). O conteúdo visível da página, esse sim,
// é traduzido pelo ServicePage.tsx via i18n.
const title = "Montagem de Setups | All Frames Technology";
const description = "Setups montados do zero com as melhores peças para o seu perfil e orçamento.";

export const Route = createFileRoute("/montagem-de-setups")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: () => <ServicePage service={service} />,
});
