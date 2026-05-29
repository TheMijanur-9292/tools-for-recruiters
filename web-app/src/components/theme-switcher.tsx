"use client";

import { useTheme } from "@/components/theme-provider";
import { THEME_LABELS, THEMES } from "@/lib/themes";

export function ThemeSwitcher() {
  const { theme, setTheme } = useTheme();

  return (
    <div className="inline-flex items-center gap-2 rounded-2xl border border-border bg-surface/80 p-2 backdrop-blur">
      {THEMES.map((themeOption) => {
        const selected = themeOption === theme;

        return (
          <button
            key={themeOption}
            type="button"
            onClick={() => setTheme(themeOption)}
            className={[
              "rounded-xl px-3 py-2 text-xs font-semibold uppercase tracking-wider transition",
              selected
                ? "bg-primary text-white shadow-sm"
                : "text-muted-foreground hover:bg-muted-surface",
            ].join(" ")}
          >
            {THEME_LABELS[themeOption]}
          </button>
        );
      })}
    </div>
  );
}
