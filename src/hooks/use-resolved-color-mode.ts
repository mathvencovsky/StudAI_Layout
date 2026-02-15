import { useEffect, useState } from "react";
import { useTheme } from "@/hooks/use-theme";

/**
 * Returns the resolved color mode ("dark" or "light"), handling "system" preference
 */
export function useResolvedColorMode(): "dark" | "light" {
  const { mode } = useTheme();
  const [resolvedMode, setResolvedMode] = useState<"dark" | "light">(() => {
    if (mode === "system") {
      return window.matchMedia("(prefers-color-scheme: dark)").matches
        ? "dark"
        : "light";
    }
    return mode;
  });

  useEffect(() => {
    if (mode !== "system") {
      setResolvedMode(mode);
      return;
    }

    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    setResolvedMode(mediaQuery.matches ? "dark" : "light");

    const handler = (e: MediaQueryListEvent) => {
      setResolvedMode(e.matches ? "dark" : "light");
    };
    mediaQuery.addEventListener("change", handler);
    return () => mediaQuery.removeEventListener("change", handler);
  }, [mode]);

  return resolvedMode;
}
