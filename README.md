# All Frames Technology

Site institucional da All Frames Technology — montagem, reforma e personalização de setups e PCs em Bento Gonçalves/RS.

## Stack

- [TanStack Start](https://tanstack.com/start) (React 19 + SSR)
- [TanStack Router](https://tanstack.com/router) (roteamento por arquivo)
- Tailwind CSS v4
- i18next / react-i18next (pt, en, es, de, it)

## Desenvolvimento

Requer Node.js e npm.

```sh
npm install
npm run dev
```

## Scripts

- `npm run dev` — ambiente de desenvolvimento
- `npm run build` — build de produção
- `npm run preview` — pré-visualiza o build de produção
- `npm run lint` — checa lint (ESLint + Prettier)
- `npm run format` — formata o código com Prettier

## Estrutura

- `src/routes/` — páginas (roteamento por arquivo do TanStack Router)
- `src/components/site/` — componentes das seções do site
- `src/components/ui/` — componentes de UI de base
- `src/data/` — dados estruturais (serviços, portfólio, textos legais)
- `src/i18n/locales/` — traduções por idioma e namespace
