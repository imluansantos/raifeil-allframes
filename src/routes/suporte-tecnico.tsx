import { createFileRoute } from "@tanstack/react-router";
import { ServicePage } from "@/components/site/ServicePage";
import { getServicePageBySlug } from "@/data/servicePages";

const service = getServicePageBySlug("suporte-tecnico")!;
// Meta de SEO fixo em português — não reativo à troca de idioma (é calculado
// fora do ciclo de render do React). O conteúdo visível da página, esse sim,
// é traduzido pelo ServicePage.tsx via i18n.
const title = "Suporte Técnico | All Frames Technology";
const description = "Nenhum cliente esquecido. Estamos sempre aqui para resolver.";

export const Route = createFileRoute("/suporte-tecnico")({
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
