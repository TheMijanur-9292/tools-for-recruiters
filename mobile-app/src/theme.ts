export type ThemeName = "light" | "dark" | "sepia" | "oled";

export type ThemePalette = {
  background: string;
  surface: string;
  elevated: string;
  text: string;
  mutedText: string;
  border: string;
  primary: string;
  primaryStrong: string;
  heroA: string;
  heroB: string;
  chip: string;
};

export const themeLabels: Record<ThemeName, string> = {
  light: "Light",
  dark: "Dark",
  sepia: "Sepia",
  oled: "OLED",
};

export const themes: Record<ThemeName, ThemePalette> = {
  light: {
    background: "#edf4ff",
    surface: "#ffffff",
    elevated: "#dbe7ff",
    text: "#112650",
    mutedText: "#51658b",
    border: "#bfd2f3",
    primary: "#0f62fe",
    primaryStrong: "#0047c8",
    heroA: "#082867",
    heroB: "#23a4ef",
    chip: "#eef4ff",
  },
  dark: {
    background: "#0e1728",
    surface: "#1a2339",
    elevated: "#223153",
    text: "#f2f6ff",
    mutedText: "#a8b7d6",
    border: "#34486e",
    primary: "#56b7ff",
    primaryStrong: "#228ee2",
    heroA: "#0c1220",
    heroB: "#1c4a95",
    chip: "#1f2d49",
  },
  sepia: {
    background: "#f5ead7",
    surface: "#fff9ef",
    elevated: "#f1e2c9",
    text: "#3f2d1f",
    mutedText: "#7d6853",
    border: "#d9c1a0",
    primary: "#8f4f1f",
    primaryStrong: "#6b360d",
    heroA: "#4d2f1d",
    heroB: "#ba7c39",
    chip: "#faefdf",
  },
  oled: {
    background: "#010101",
    surface: "#0a0a0a",
    elevated: "#121212",
    text: "#f6f6f6",
    mutedText: "#b9b9b9",
    border: "#232323",
    primary: "#42d6ff",
    primaryStrong: "#16b2df",
    heroA: "#020202",
    heroB: "#143450",
    chip: "#111111",
  },
};
