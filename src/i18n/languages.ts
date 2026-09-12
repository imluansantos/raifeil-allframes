// Lista de idiomas suportados — usada pelo seletor de Idioma no painel de
// Configurações (SettingsPanel.tsx) e pelo mapeamento pra <html lang="..."> em
// src/i18n/index.ts. "code" é o que o i18next usa internamente (chave dos
// arquivos em src/i18n/locales/<code>/*.json); "htmlLang" é a tag BCP47
// correta pro atributo lang do documento (pt vira pt-BR, os outros ficam
// iguais ao code).
export const LANGUAGES = [
  { code: "pt", label: "Português", htmlLang: "pt-BR" },
  { code: "en", label: "English", htmlLang: "en" },
  { code: "es", label: "Español", htmlLang: "es" },
  { code: "de", label: "Deutsch", htmlLang: "de" },
  { code: "it", label: "Italiano", htmlLang: "it" },
] as const;

export type LanguageCode = (typeof LANGUAGES)[number]["code"];

export const DEFAULT_LANGUAGE: LanguageCode = "pt";

export function isLanguageCode(v: unknown): v is LanguageCode {
  return typeof v === "string" && LANGUAGES.some((l) => l.code === v);
}
