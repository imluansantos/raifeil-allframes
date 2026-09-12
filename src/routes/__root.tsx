import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  createRootRouteWithContext,
  useRouter,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";
import { type ReactNode } from "react";

// Configurações → Idioma: inicializa o i18next uma única vez, o mais cedo
// possível (import de efeito colateral, sem nada importado dele aqui) —
// precisa rodar antes de qualquer componente chamar useTranslation(),
// senão o primeiro render viria sem nenhum recurso de tradução carregado.
import "@/i18n";
import appCss from "../styles.css?url";
import NotFound1 from "@/components/ui/8bit-not-found1";
import { Header } from "@/components/site/Header";
import { FloatingWhatsApp } from "@/components/site/FloatingWhatsApp";
import { DevSignature } from "@/components/site/DevSignature";

// Página 404 "estilo jogo retrô" (8-bit) — pedido explícito do cliente pra
// recriar https://21st.dev/community/components?q=404&preview=%2F%40theorcdev%2Fcomponents%2F8bit-not-found1
// (componente NotFound1 da 8bitcn-ui) igual ao original, trocando só a copy
// pelo tom do site. É a única tela do app que foge do design system
// monocromático "sério" de propósito — um easter egg de página não
// encontrada, por isso não leva Footer (só o Header, pra manter a
// navegação disponível mesmo numa página perdida).
//
// Header fica FORA da div `.retro`: essa classe define a fonte pixelada
// (Press Start 2P) da página 404, e font-family é herdado por padrão em
// CSS — se o Header ficasse dentro, o texto dele (logo, nav, botão)
// herdava a fonte pixelada também, mudando a aparência do Header sem
// nenhuma linha de código ter sido tocada nele. Como o Header é `fixed`,
// ficar fora da div não muda nada visualmente na posição dele.
function NotFoundComponent() {
  return (
    <>
      <Header />
      <div className="retro flex min-h-screen items-center justify-center bg-background">
        <NotFound1 />
      </div>
    </>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  console.error(error);
  const router = useRouter();

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-xl font-semibold tracking-tight text-foreground">
          This page didn't load
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Something went wrong on our end. You can try refreshing or head back home.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <button
            onClick={() => {
              router.invalidate();
              reset();
            }}
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Try again
          </button>
          <a
            href="/"
            className="inline-flex items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent"
          >
            Go home
          </a>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "All Frames Technology" },
      {
        name: "description",
        content:
          "Montagem, reforma e personalização de setups e PCs em Bento Gonçalves/RS.",
      },
      { name: "author", content: "All Frames Technology" },
      { name: "theme-color", content: "#0d0d0e" },
      { property: "og:type", content: "website" },
      // imagem de prévia ao compartilhar o link (WhatsApp/Instagram/Twitter/
      // Facebook) — só precisa estar aqui, na rota raiz: nenhuma rota filha
      // define og:image/twitter:image própria, então todas herdam esta por
      // padrão (mesmo esquema que og:type/twitter:card já seguiam). URL
      // absoluta é obrigatória pro protocolo Open Graph — troque o domínio
      // aqui se ele mudar. Arquivo em public/og-image.jpg (1200x630) — JPG de
      // propósito (não webp): esse arquivo é buscado pelo crawler de cada
      // rede social, não pelo navegador de quem visita o site, e nem todo
      // crawler tem suporte confiável a webp nessa função específica de
      // gerar prévia de link. JPG/PNG é o formato "à prova de bala" pra isso.
      { property: "og:image", content: "https://allframestechnology.com.br/og-image.jpg" },
      { property: "og:image:width", content: "1200" },
      { property: "og:image:height", content: "630" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:image", content: "https://allframestechnology.com.br/og-image.jpg" },
    ],
    links: [
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      {
        rel: "stylesheet",
        // Press+Start+2P: fonte pixelada da página 404 "8-bit" (.retro em
        // styles.css) — carregada junto da Inter pra não abrir uma segunda
        // conexão com o Google Fonts.
        href: "https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=Press+Start+2P&display=swap",
      },
      {
        rel: "stylesheet",
        href: appCss,
      },
      { rel: "icon", href: "/favicon.ico", type: "image/x-icon" },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: ReactNode }) {
  return (
    <html lang="pt-BR">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <FloatingWhatsApp />
        <DevSignature />
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();

  return (
    <QueryClientProvider client={queryClient}>
      {/* Required: nested routes render here. Removing <Outlet /> breaks all child routes. */}
      <Outlet />
    </QueryClientProvider>
  );
}
