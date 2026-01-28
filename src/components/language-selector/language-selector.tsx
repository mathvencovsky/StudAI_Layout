import { type SupportedLocale, supportedLocales } from "@/i18n/i18n";
import { useLocale } from "@/hooks/use-locale";
import { IconLanguage } from "@tabler/icons-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { useTranslation } from "react-i18next";
import { isSupportedLocale } from "@/i18n/i18n-utils";
import { useCallback } from "react";

/**
 * Maps supported locales to user-friendly display names
 */
const languageDisplayNames: Record<SupportedLocale, string> = {
  en: "English",
  "pt-BR": "Português (Brasil)",
};

export interface LanguageSelectorProps {
  className?: string;
}

/**
 * LanguageSelector component that allows users to switch between supported languages.
 * Integrates with the existing i18n setup and persists language preferences to local storage.
 */
export const LanguageSelector = ({ className }: LanguageSelectorProps) => {
  const [currentLocale, setLocale] = useLocale();
  const { t } = useTranslation();

  const handleLanguageChange = useCallback(
    (locale: string) => {
      if (isSupportedLocale(locale)) {
        setLocale(locale);
      }
    },
    [setLocale]
  );

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" className={className}>
          <IconLanguage className="size-4" />
          {t("language-selector")}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className={className}>
        {supportedLocales.map((locale) => (
          <DropdownMenuItem
            key={locale}
            onClick={() => handleLanguageChange(locale)}
            className={currentLocale === locale ? "bg-accent" : ""}
          >
            {languageDisplayNames[locale]}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
