import { useEffect, useState } from "react";

type Theme = "light" | "dark" | "system";

export function useTheme(): [Theme, (theme: Theme) => void] {
  const initialTheme = (localStorage.getItem("theme") as Theme) || "system";
  const [theme, setTheme] = useState<Theme>(initialTheme);

  useEffect(() => {
    const root = window.document.documentElement;

    // 清除所有可能的主题类
    root.classList.remove("light", "dark");

    if (theme === "system") {
      const prefersDark = window.matchMedia(
        "(prefers-color-scheme: dark)",
      ).matches;
      root.classList.add(prefersDark ? "dark" : "light");
    } else {
      root.classList.add(theme);
    }

    localStorage.setItem("theme", theme);
  }, [theme]);

  return [theme, setTheme];
}
