import { useContext } from "react";
import { ThemeContext } from "@/context-providers/theme/theme-context";

/**
 * Hook to access theme context for mode and color theme switching
 */
export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
}
