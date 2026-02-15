import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import resourcesToBackend from "i18next-resources-to-backend";

export const supportedLocales = ["en", "pt-BR"] as const;
export type SupportedLocale = (typeof supportedLocales)[number];

export const defaultNS = "common" as const;

const localeModules = import.meta.glob("./locales/*/*.ts");

i18n
  .use(LanguageDetector)
  .use(
    resourcesToBackend((language: string, namespace: string) => {
      const key = `./locales/${language}/${namespace}.ts`;
      const loader = localeModules[key];
      if (!loader) return Promise.reject(new Error(`Missing ${key}`));
      return loader().then((m) =>
        typeof m === "object" && m && "default" in m ? m.default : m
      );
    })
  )
  .use(initReactI18next)
  .init({
    detection: {
      order: ["localStorage", "navigator"],
      caches: ["localStorage"],
    },
    fallbackLng: "pt-BR",
    supportedLngs: [...supportedLocales],
    ns: [defaultNS],
    defaultNS,
    interpolation: { escapeValue: false },
  });

export { i18n };
