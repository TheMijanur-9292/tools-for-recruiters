export const THEMES = ["light", "dark", "sepia", "oled"] as const;

export type ThemeName = (typeof THEMES)[number];

export const THEME_LABELS: Record<ThemeName, string> = {
  light: "Light",
  dark: "Dark",
  sepia: "Sepia",
  oled: "OLED",
};
