import { createFileRoute } from "@tanstack/react-router";
import { Header } from "@/components/site/Header";
import { Hero } from "@/components/site/Hero";
import { AboutUs } from "@/components/site/AboutUs";
import { Services } from "@/components/site/Services";
import { Hardware } from "@/components/site/Hardware";
import { Team } from "@/components/site/Team";
import { ProjectsSection } from "@/components/site/ProjectsSection";
import { Differentials } from "@/components/site/Differentials";
import { Testimonials } from "@/components/site/Testimonials";
import { FinalCTA } from "@/components/site/FinalCTA";
import { Footer } from "@/components/site/Footer";
import { FAQ } from "@/components/site/FAQ";

const title = "All Frames Technology";
const description =
  "Montagem, reforma e personalização de setups e PCs de alto padrão em Bento Gonçalves/RS. Consultoria de peças, water cooling custom e suporte pós-venda real.";

export const Route = createFileRoute("/")({
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
  component: Index,
});

function Index() {
  return (
    <div className="min-h-screen">
      <Header />
      <main>
        <Hero />
        <AboutUs />
        <Team />
        <Services />
        <ProjectsSection />
        <Hardware />
        <Differentials />
        <Testimonials />
        <FAQ />
        <FinalCTA />
      </main>
      {/* sem a borda de cima aqui: o FinalCTA termina num arco decorativo, e a
          linha reta cortava em cima da curva. Só nesta página. */}
      <Footer noTopBorder />
    </div>
  );
}
