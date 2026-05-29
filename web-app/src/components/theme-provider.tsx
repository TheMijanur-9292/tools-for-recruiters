"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { THEMES, ThemeName } from "@/lib/themes";

const THEME_STORAGE_KEY = "ai-challenge-theme";

type ThemeContextValue = {
  theme: ThemeName;
  setTheme: (nextTheme: ThemeName) => void;
};

const ThemeContext = createContext<ThemeContextValue | null>(null);

function isThemeName(value: string | null): value is ThemeName {
  return THEMES.includes(value as ThemeName);
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  // Always start with "light" on both server and client so SSR HTML matches
  // the initial client render. The real saved theme is applied after hydration.
  const [theme, setThemeState] = useState<ThemeName>("light");

  const applyTheme = useCallback((nextTheme: ThemeName) => {
    document.documentElement.setAttribute("data-theme", nextTheme);
    document.documentElement.style.colorScheme =
      nextTheme === "dark" || nextTheme === "oled" ? "dark" : "light";
  }, []);

  // Read saved preference once after hydration and apply it.
  // setState inside this specific mount-only effect is intentional and safe
  // because it runs exactly once after the initial render completes.
  useEffect(() => {
    const savedTheme = localStorage.getItem(THEME_STORAGE_KEY);
    const resolved = isThemeName(savedTheme) ? savedTheme : "light";
    setThemeState(resolved); // eslint-disable-line react-hooks/set-state-in-effect
    applyTheme(resolved);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Persist and apply whenever theme changes after mount
  useEffect(() => {
    applyTheme(theme);
    localStorage.setItem(THEME_STORAGE_KEY, theme);
  }, [applyTheme, theme]);

  const setTheme = useCallback((nextTheme: ThemeName) => {
    setThemeState(nextTheme);
  }, []);

  const value = useMemo(() => ({ theme, setTheme }), [theme, setTheme]);

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within ThemeProvider");
  }

  return context;
}
