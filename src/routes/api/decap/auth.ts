// Rota de servidor que inicia o login do Decap CMS com o GitHub. O painel
// (public/admin/config.yml, auth_endpoint: api/decap/auth) abre essa rota
// numa popup; ela gera um "state" aleatório (proteção contra CSRF), guarda
// esse state num cookie de curta duração e manda o navegador pro GitHub.
// Depois que a pessoa autoriza no GitHub, ele redireciona de volta pra
// callback.ts (nesta mesma pasta), que confere o state e troca o código
// pelo token de acesso.
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/api/decap/auth")({
  server: {
    handlers: {
      GET: async ({ request }) => {
        const clientId = process.env.GITHUB_OAUTH_CLIENT_ID;
        if (!clientId) {
          return new Response(
            "GITHUB_OAUTH_CLIENT_ID não configurado nas variáveis de ambiente da Vercel.",
            { status: 500 },
          );
        }

        const url = new URL(request.url);
        const state = crypto.randomUUID();
        const redirectUri = `${url.origin}/api/decap/callback`;

        const authorizeUrl = new URL("https://github.com/login/oauth/authorize");
        authorizeUrl.searchParams.set("client_id", clientId);
        authorizeUrl.searchParams.set("redirect_uri", redirectUri);
        // O GitHub exige os escopos separados por ESPAÇO, não por vírgula —
        // "repo,user" era interpretado como um escopo inválido só, e o token
        // saía sem nenhuma permissão de repositório de verdade. Foi essa a
        // causa real do erro "does not have access to this repo", inclusive
        // pra você mesmo (dono do repositório): o login concluía normal, mas
        // o token gerado não carregava a permissão de repo nenhuma.
        authorizeUrl.searchParams.set("scope", "repo user");
        authorizeUrl.searchParams.set("state", state);

        return new Response(null, {
          status: 302,
          headers: {
            Location: authorizeUrl.toString(),
            // 5 minutos é tempo de sobra pra pessoa fazer login no GitHub e
            // voltar; HttpOnly + Secure + SameSite=Lax porque esse cookie só
            // precisa ser lido pelo nosso próprio servidor na callback, nunca
            // pelo navegador.
            "Set-Cookie": `decap_oauth_state=${state}; Path=/; Max-Age=300; HttpOnly; Secure; SameSite=Lax`,
          },
        });
      },
    },
  },
});
