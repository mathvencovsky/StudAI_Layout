import { useTranslation } from "react-i18next";
import { useLocale } from "@/hooks/use-locale";

export function useI18n() {
  const { t, i18n } = useTranslation();
  const [locale, setLocale] = useLocale();

  return {
    t,
    locale,
    setLocale,
    i18n,
  };
}
