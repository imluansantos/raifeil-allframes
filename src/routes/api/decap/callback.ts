// Recebe a volta do GitHub depois do login (ver auth.ts). Confere o "state"
// contra o cookie que a auth.ts deixou, troca o "code" pelo token de acesso
// (isso exige o client secret, por isso só pode acontecer aqui no servidor,
// nunca no navegador) e devolve uma página HTML minúscula que fala com a
// janela original via postMessage. Esse é o protocolo que o Decap CMS espera
// de qualquer backend de OAuth (o mesmo formato usado pelo Netlify/Decap).
import { createFileRoute } from "@tanstack/react-router";

function parseCookies(header: string | null): Record<string, string> {
  const cookies: Record<string, string> = {};
  if (!header) return cookies;
  for (const part of header.split(";")) {
    const [rawName, ...rawValue] = part.trim().split("=");
    if (!rawName) continue;
    cookies[rawName] = decodeURIComponent(rawValue.join("="));
  }
  return cookies;
}

// Monta a página que fica na popup: ela espera a janela que abriu o login
// mandar um sinal (handshake), e só então devolve a mensagem final (sucesso
// ou erro) pra origem certa. O Decap, do outro lado, já sabe escutar esse
// formato de mensagem.
function popupResponse(message: string) {
  const html = `<!DOCTYPE html>
<html>
  <body>
    <script>
      function receiveMessage(e) {
        window.opener.postMessage(
          ${JSON.stringify(message)},
          e.origin
        );
        window.removeEventListener("message", receiveMessage, false);
      }
      window.addEventListener("message", receiveMessage, false);
      window.opener.postMessage("authorizing:github", "*");
    </script>
  </body>
</html>`;
  return new Response(html, {
    status: 200,
    headers: {
      "content-type": "text/html; charset=utf-8",
      // já pode limpar o cookie de state, ele não serve mais pra nada.
      "Set-Cookie": "decap_oauth_state=; Path=/; Max-Age=0; HttpOnly; Secure; SameSite=Lax",
    },
  });
}

export const Route = createFileRoute("/api/decap/callback")({
  server: {
    handlers: {
      GET: async ({ request }) => {
        const clientId = process.env.GITHUB_OAUTH_CLIENT_ID;
        const clientSecret = process.env.GITHUB_OAUTH_CLIENT_SECRET;
        if (!clientId || !clientSecret) {
          return new Response(
            "GITHUB_OAUTH_CLIENT_ID / GITHUB_OAUTH_CLIENT_SECRET não configurados nas variáveis de ambiente da Vercel.",
            { status: 500 },
          );
        }

        const url = new URL(request.url);
        const code = url.searchParams.get("code");
        const state = url.searchParams.get("state");
        const cookies = parseCookies(request.headers.get("cookie"));
        const expectedState = cookies["decap_oauth_state"];

        if (!code || !state || !expectedState || state !== expectedState) {
          return popupResponse(
            "authorization:github:error:" +
              JSON.stringify({ message: "Estado inválido, tente fazer login de novo." }),
          );
        }

        const redirectUri = `${url.origin}/api/decap/callback`;

        const tokenResponse = await fetch("https://github.com/login/oauth/access_token", {
          method: "POST",
          headers: {
            "content-type": "application/json",
            accept: "application/json",
          },
          body: JSON.stringify({
            client_id: clientId,
            client_secret: clientSecret,
            code,
            redirect_uri: redirectUri,
            state,
          }),
        });

        const tokenData = (await tokenResponse.json()) as {
          access_token?: string;
          error_description?: string;
        };

        if (!tokenData.access_token) {
          return popupResponse(
            "authorization:github:error:" +
              JSON.stringify({
                message:
                  tokenData.error_description ||
                  "Não foi possível obter o token do GitHub.",
              }),
          );
        }

        return popupResponse(
          "authorization:github:success:" +
            JSON.stringify({ token: tokenData.access_token, provider: "github" }),
        );
      },
    },
  },
});
