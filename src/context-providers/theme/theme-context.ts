import { createContext } from "react";

export type Mode = "dark" | "light" | "system";
export type ColorTheme = "default" | "studai";

export interface ThemeContextValue {
  mode: Mode;
  setMode: (mode: Mode) => void;
  colorTheme: ColorTheme;
  setColorTheme: (theme: ColorTheme) => void;
}

export const ThemeContext = createContext<ThemeContextValue | undefined>(
  undefined,
);
