import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from "react";
import type { Locale, TranslationKeys } from "./types";
import { ptBR } from "./pt-BR";
import { enUS } from "./en-US";

const STORAGE_KEY = "studai_locale";

const translations: Record<Locale, TranslationKeys> = {
  "pt-BR": ptBR,
  "en-US": enUS,
};

// Debug: Log translations on module load
if (typeof window !== "undefined") {
  console.log("I18n translations loaded:", {
    "pt-BR keys": Object.keys(ptBR).length,
    "en-US keys": Object.keys(enUS).length,
    "sample pt-BR": ptBR["hero.headline"],
    "sample en-US": enUS["hero.headline"],
  });
}

function detectLocale(): Locale {
  // 1. Check localStorage for saved preference
  if (typeof window !== "undefined") {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved === "pt-BR" || saved === "en-US") return saved;
  }

  // 2. Fallback: navigator.language
  if (typeof navigator !== "undefined") {
    const lang = navigator.language || (navigator as any).userLanguage || "";
    if (lang.startsWith("pt")) return "pt-BR";
  }

  // 3. Default to English
  return "en-US";
}

type I18nContextValue = {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: (key: keyof TranslationKeys) => string;
};

const I18nContext = createContext<I18nContextValue | null>(null);

export function I18nProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>(detectLocale);
  const [, forceUpdate] = useState({});

  // Debug: Log provider initialization
  useEffect(() => {
    console.log("I18nProvider mounted with locale:", locale);
    console.log("Translations available:", {
      locale,
      translationsCount: Object.keys(translations[locale] || {}).length,
      sampleKey: translations[locale]?.["hero.headline"],
    });
  }, [locale]);

  const setLocale = useCallback((newLocale: Locale) => {
    console.log("Changing locale from", locale, "to", newLocale);
    setLocaleState(newLocale);
    localStorage.setItem(STORAGE_KEY, newLocale);
    // Force re-render of all consumers
    forceUpdate({});
  }, [locale]);

  // Update <html lang> whenever locale changes
  useEffect(() => {
    document.documentElement.lang = locale;
  }, [locale]);

  const t = useCallback(
    (key: keyof TranslationKeys): string => {
      const translation = translations[locale]?.[key];
      if (translation) return translation;
      
      const fallback = translations["pt-BR"]?.[key];
      if (fallback) return fallback;
      
      console.warn(`Missing translation for key: ${key}`, {
        locale,
        hasLocaleTranslations: !!translations[locale],
        hasFallbackTranslations: !!translations["pt-BR"],
        translationsKeys: Object.keys(translations[locale] || {}).slice(0, 5),
      });
      return key;
    },
    [locale]
  );

  return (
    <I18nContext.Provider value={{ locale, setLocale, t }}>
      {children}
    </I18nContext.Provider>
  );
}

export function useI18n() {
  const ctx = useContext(I18nContext);
  if (!ctx) throw new Error("useI18n must be used within I18nProvider");
  return ctx;
}
