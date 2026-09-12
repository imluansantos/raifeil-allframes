// Todo o texto das páginas legais (título, data, intro e seções da Política
// de Privacidade e dos Termos de Uso) vive em i18n/locales/<idioma>/legal.json,
// nas chaves "privacyPolicy" e "termsOfUse" — ver LegalPage.tsx. Este arquivo
// só guarda os identificadores usados pelas rotas
// (politica-de-privacidade.tsx / termos-de-uso.tsx) pra montar as metatags de
// SEO (fixas em português, ver comentário nessas rotas) e pra passar pro
// componente qual documento renderizar.
export const PRIVACY_POLICY_KEY = "privacyPolicy" as const;
export const TERMS_OF_USE_KEY = "termsOfUse" as const;
