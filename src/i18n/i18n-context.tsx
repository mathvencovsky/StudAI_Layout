import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from "react";
import type { Locale, TranslationKeys } from "./types";
import { ptBR } from "./pt-BR";
import { enUS } from "./en-US";

const STORAGE_KEY = "studai_locale";

const translations: Record<Locale, TranslationKeys> = {
  "pt-BR": ptBR,
  "en-US": enUS,
};

function detectLocale(): Locale {
  if (typeof window !== "undefined") {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved === "pt-BR" || saved === "en-US") return saved;
  }

  if (typeof navigator !== "undefined") {
    const lang = navigator.language || "";
    if (lang.startsWith("pt")) return "pt-BR";
  }

  return "en-US";
}

type I18nContextValue = {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: (key: keyof TranslationKeys) => string;
};

const I18nContext = createContext<I18nContextValue | null>(null);

/**
 * Provides i18n context to the landing page component tree.
 */
export function I18nProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>(detectLocale);
  const [, forceUpdate] = useState({});

  const setLocale = useCallback((newLocale: Locale) => {
    setLocaleState(newLocale);
    localStorage.setItem(STORAGE_KEY, newLocale);
    forceUpdate({});
  }, []);

  useEffect(() => {
    document.documentElement.lang = locale;
  }, [locale]);

  const t = useCallback(
    (key: keyof TranslationKeys): string => {
      const translation = translations[locale]?.[key];
      if (translation) return translation;

      const fallback = translations["pt-BR"]?.[key];
      if (fallback) return fallback;

      console.warn(`Missing translation: ${key}`);
      return key;
    },
    [locale],
  );

  return (
    <I18nContext.Provider value={{ locale, setLocale, t }}>
      {children}
    </I18nContext.Provider>
  );
}

/**
 * Returns the i18n context value. Must be used within I18nProvider.
 */
export function useI18n() {
  const ctx = useContext(I18nContext);
  if (!ctx) throw new Error("useI18n must be used within I18nProvider");
  return ctx;
}
