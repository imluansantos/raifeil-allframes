// Configuração "crua" do Vite/TanStack Start — sem o wrapper da Lovable
// (@lovable.dev/vite-tanstack-config). Ejetamos dele porque esse wrapper
// prende o Nitro (o motor de servidor) no preset "cloudflare-module" sempre,
// não importa o que a gente configure por fora — e o objetivo agora é
// deployar na Vercel.
//
// Os plugins abaixo são exatamente os que a documentação oficial do
// TanStack Start recomenda (tanstack.com/start → Hosting / Build from
// Scratch), na ordem que ela pede — o viteReact() sempre depois do
// tanstackStart():
//   - tsConfigPaths: resolve o alias "@/" (definido em tsconfig.json) nos
//     imports, sem precisar reescrever nenhum import do projeto.
//   - tailwindcss: plugin oficial do Tailwind v4 pro Vite (o projeto já
//     usa Tailwind v4, então isso é obrigatório pro CSS compilar).
//   - tanstackStart: roteamento baseado em arquivo + SSR.
//   - viteReact: plugin oficial do React.
//   - nitro: builda o servidor. De propósito SEM preset fixo — a Vercel
//     detecta TanStack Start/Nitro sozinha durante o deploy e monta a saída
//     certa. Se um dia quiser mirar outra plataforma de novo (Cloudflare,
//     Node, etc.), é só passar nitro({ preset: "cloudflare-module" }) (ou o
//     preset desejado) aqui.
import { defineConfig } from "vite";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import viteReact from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import tsConfigPaths from "vite-tsconfig-paths";
import { nitro } from "nitro/vite";

export default defineConfig({
  plugins: [
    tsConfigPaths({ projects: ["./tsconfig.json"] }),
    tailwindcss(),
    tanstackStart(),
    viteReact(),
    nitro(),
  ],
  // Redireciona o entry point do servidor pro nosso wrapper de erro de SSR
  // (src/server.ts, que captura erro 500 "engolido" pelo h3 e mostra uma
  // página de erro decente) no lugar do entry padrão do TanStack Start.
  environments: {
    ssr: {
      build: {
        rollupOptions: {
          input: "./src/server.ts",
        },
      },
    },
  },
});
