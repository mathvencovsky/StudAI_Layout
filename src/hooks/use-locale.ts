import type { SupportedLocale } from "@/i18n/i18n";
import { toSupportedLocale } from "@/i18n/i18n-utils";
import { useCallback } from "react";
import { useTranslation } from "react-i18next";

export function useLocale() {
  const { i18n } = useTranslation();

  const locale = toSupportedLocale(i18n.resolvedLanguage ?? i18n.language);

  const setLocale = useCallback(
    (next: SupportedLocale) => {
      i18n.changeLanguage(next);
    },
    [i18n]
  );

  return [locale, setLocale] as const;
}
