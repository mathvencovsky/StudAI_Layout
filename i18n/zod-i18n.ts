import { z } from "zod";
import { i18n } from "@/i18n/i18n";

const zodLocaleMap: Record<string, string> = {
  en: "en",
  "pt-BR": "pt",
};

async function applyZodLocale(language: string) {
  const zodLocale = zodLocaleMap[language] ?? "en";
  const mod = await import(`../../node_modules/zod/v4/locales/${zodLocale}.js`);
  const localeFn = mod.default ?? mod[zodLocale];
  z.config(localeFn());
}

/** Syncs Zod's built-in error locale with the current i18next language. */
export function initZodI18n() {
  applyZodLocale(i18n.language);
  i18n.on("languageChanged", applyZodLocale);
}
