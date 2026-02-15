import { useTheme } from "@/hooks/use-theme";
import { type Mode, type ColorTheme } from "@/context-providers/theme/theme-context";
import { IconPalette } from "@tabler/icons-react";
import {
  DropdownMenuItem,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu";
import { useTranslation } from "react-i18next";
import { useCallback } from "react";

const modes: Mode[] = ["light", "dark", "system"];
const colorThemes: ColorTheme[] = ["default", "studai"];

/**
 * ThemeSelector component that allows users to switch between modes and color themes.
 * Uses submenu pattern to work inside a parent DropdownMenu.
 */
export const ThemeSelector = () => {
  const { mode, setMode, colorTheme, setColorTheme } = useTheme();
  const { t } = useTranslation();

  const handleModeChange = useCallback(
    (newMode: Mode) => setMode(newMode),
    [setMode]
  );

  const handleColorThemeChange = useCallback(
    (newTheme: ColorTheme) => setColorTheme(newTheme),
    [setColorTheme]
  );

  return (
    <DropdownMenuSub>
      <DropdownMenuSubTrigger>
        <IconPalette className="size-4" />
        {t("theme-selector")}
      </DropdownMenuSubTrigger>
      <DropdownMenuSubContent>
        <DropdownMenuLabel>{t("theme-mode")}</DropdownMenuLabel>
        {modes.map((m) => (
          <DropdownMenuItem
            key={m}
            onClick={() => handleModeChange(m)}
            className={mode === m ? "bg-accent" : ""}
          >
            {t(`theme-mode-${m}`)}
          </DropdownMenuItem>
        ))}
        <DropdownMenuSeparator />
        <DropdownMenuLabel>{t("theme-color")}</DropdownMenuLabel>
        {colorThemes.map((theme) => (
          <DropdownMenuItem
            key={theme}
            onClick={() => handleColorThemeChange(theme)}
            className={colorTheme === theme ? "bg-accent" : ""}
          >
            {t(`theme-color-${theme}`)}
          </DropdownMenuItem>
        ))}
      </DropdownMenuSubContent>
    </DropdownMenuSub>
  );
};
