import { createFileRoute } from "@tanstack/react-router";
import { LegalPage } from "@/components/site/LegalPage";
import { TERMS_OF_USE_KEY } from "@/data/legal";

// Meta de SEO fixo em português — não reativo à troca de idioma (é calculado
// fora do ciclo de render do React). O conteúdo visível da página, esse sim,
// é traduzido pelo LegalPage.tsx via i18n.
const title = "Termos de Uso | All Frames Technology";
const description =
  "Estes Termos de Uso regulam o acesso e a utilização do site da All Frames Technology. Ao navegar neste site, você concorda com os termos descritos abaixo.";

export const Route = createFileRoute("/termos-de-uso")({
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
  component: () => <LegalPage docKey={TERMS_OF_USE_KEY} />,
});
