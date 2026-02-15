import { useEffect, useMemo, useState, type ReactNode } from "react";
import {
  ThemeContext,
  type ColorTheme,
  type Mode,
} from "@/context-providers/theme/theme-context";

const MODE_STORAGE_KEY = "vite-ui-theme";
const COLOR_THEME_STORAGE_KEY = "vite-ui-color-theme";

export interface ThemeProviderProps {
  children: ReactNode;
  defaultMode?: Mode;
  defaultColorTheme?: ColorTheme;
}

/**
 * Theme provider that manages dark/light mode and color themes
 */
export function ThemeProvider({
  children,
  defaultMode = "system",
  defaultColorTheme = "default",
}: ThemeProviderProps) {
  const [mode, setModeState] = useState<Mode>(
    () => (localStorage.getItem(MODE_STORAGE_KEY) as Mode) || defaultMode,
  );
  const [colorTheme, setColorThemeState] = useState<ColorTheme>(
    () =>
      (localStorage.getItem(COLOR_THEME_STORAGE_KEY) as ColorTheme) ||
      defaultColorTheme,
  );

  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove("light", "dark");

    if (mode === "system") {
      const systemTheme = window.matchMedia("(prefers-color-scheme: dark)")
        .matches
        ? "dark"
        : "light";
      root.classList.add(systemTheme);
      return;
    }

    root.classList.add(mode);
  }, [mode]);

  useEffect(() => {
    const root = window.document.documentElement;
    if (colorTheme === "default") {
      root.removeAttribute("data-theme");
    } else {
      root.setAttribute("data-theme", colorTheme);
    }
  }, [colorTheme]);

  const value = useMemo(
    () => ({
      mode,
      setMode: (newMode: Mode) => {
        localStorage.setItem(MODE_STORAGE_KEY, newMode);
        setModeState(newMode);
      },
      colorTheme,
      setColorTheme: (newTheme: ColorTheme) => {
        localStorage.setItem(COLOR_THEME_STORAGE_KEY, newTheme);
        setColorThemeState(newTheme);
      },
    }),
    [mode, colorTheme],
  );

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
}
