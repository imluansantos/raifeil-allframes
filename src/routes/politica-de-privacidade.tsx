import { createFileRoute } from "@tanstack/react-router";
import { LegalPage } from "@/components/site/LegalPage";
import { PRIVACY_POLICY_KEY } from "@/data/legal";

// Meta de SEO fixo em português — não reativo à troca de idioma (é calculado
// fora do ciclo de render do React). O conteúdo visível da página, esse sim,
// é traduzido pelo LegalPage.tsx via i18n.
const title = "Política de Privacidade | All Frames Technology";
const description =
  "Esta Política de Privacidade explica quais dados a All Frames Technology coleta através deste site, como esses dados são usados e quais são os seus direitos como titular, em conformidade com a Lei Geral de Proteção de Dados (LGPD — Lei nº 13.709/2018).";

export const Route = createFileRoute("/politica-de-privacidade")({
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
  component: () => <LegalPage docKey={PRIVACY_POLICY_KEY} />,
});
