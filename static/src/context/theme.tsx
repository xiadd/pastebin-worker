import { FC, createContext, useEffect, useState } from "react";

type Theme = "light" | "dark" | "system";

export const ThemeContext = createContext({
  theme: "light",
  setTheme: (theme: Theme) => {},
});

interface Props {
  children: React.ReactNode;
}

export const ThemeContextProvider: FC<Props> = (props) => {
  const localTheme = localStorage.getItem("theme") as Theme;
  const [theme, setTheme] = useState<Theme>(localTheme || "light");
  useEffect(() => {
    const root = window.document.documentElement;

    // 清除所有可能的主题类
    root.classList.remove("light", "dark");

    if (theme === "system") {
      const prefersDark = window.matchMedia(
        "(prefers-color-scheme: dark)",
      ).matches;
      root.classList.add(prefersDark ? "dark" : "light");
      root.dataset.theme = prefersDark ? "dark" : "light";
    } else {
      root.classList.add(theme);
      root.dataset.theme = theme;
    }

    localStorage.setItem("theme", theme);
  }, [theme]);

  return (
    <ThemeContext.Provider
      value={{
        theme,
        setTheme,
      }}
    >
      {props.children}
    </ThemeContext.Provider>
  );
};
