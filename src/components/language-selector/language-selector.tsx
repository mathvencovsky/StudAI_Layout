import { type SupportedLocale, supportedLocales } from "@/i18n/i18n";
import { useLocale } from "@/hooks/use-locale";
import { IconLanguage } from "@tabler/icons-react";
import {
  DropdownMenuItem,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
} from "@/components/ui/dropdown-menu";
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

/**
 * LanguageSelector component that allows users to switch between supported languages.
 * Uses submenu pattern to work inside a parent DropdownMenu.
 */
export const LanguageSelector = () => {
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
    <DropdownMenuSub>
      <DropdownMenuSubTrigger>
        <IconLanguage className="size-4" />
        {t("language-selector")}
      </DropdownMenuSubTrigger>
      <DropdownMenuSubContent>
        {supportedLocales.map((locale) => (
          <DropdownMenuItem
            key={locale}
            onClick={() => handleLanguageChange(locale)}
            className={currentLocale === locale ? "bg-accent" : ""}
          >
            {languageDisplayNames[locale]}
          </DropdownMenuItem>
        ))}
      </DropdownMenuSubContent>
    </DropdownMenuSub>
  );
};
