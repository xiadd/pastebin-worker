import { javascript } from "@codemirror/lang-javascript";
import { markdown, markdownLanguage } from "@codemirror/lang-markdown";
import { StreamLanguage } from "@codemirror/language";
import { languages } from "@codemirror/language-data";
import { css } from "@codemirror/legacy-modes/mode/css";
import { go } from "@codemirror/legacy-modes/mode/go";
import { python } from "@codemirror/legacy-modes/mode/python";
import { shell } from "@codemirror/legacy-modes/mode/shell";
import { html } from "@codemirror/legacy-modes/mode/xml";
import { yaml } from "@codemirror/legacy-modes/mode/yaml";
import CodeMirror from "@uiw/react-codemirror";
import { useContext, useEffect, useState } from "react";

import { ThemeContext } from "../context/theme";

interface EditorProps {
  language?: string;
  value: string;
  onChange?: (content: string) => void;
  readonly?: boolean;
  className?: string;
  height?: string;
}

export default function Editor({
  value,
  onChange,
  language = "text",
  readonly = false,
  height = "300px",
}: EditorProps) {
  const { theme } = useContext(ThemeContext);
  const [languageExtension, setLanguageExtension] = useState<any>([]);
  const [codemirrorTheme, setCodemirrorTheme] = useState<"light" | "dark">(
    "light",
  );
  useEffect(() => {
    switch (language) {
      case "markdown":
        setLanguageExtension([
          markdown({ base: markdownLanguage, codeLanguages: languages }),
        ]);
        break;
      case "go":
        setLanguageExtension([StreamLanguage.define(go)]);
        break;
      case "javascript":
      case "typescript":
      case "json":
        setLanguageExtension([javascript({ jsx: true })]);
        break;
      case "python":
        setLanguageExtension([StreamLanguage.define(python)]);
        break;
      case "shell":
        setLanguageExtension([StreamLanguage.define(shell)]);
        break;
      case "html":
        setLanguageExtension([StreamLanguage.define(html)]);
        break;
      case "yaml":
        setLanguageExtension([StreamLanguage.define(yaml)]);
      case "css":
      case "less":
      case "scss":
        setLanguageExtension([StreamLanguage.define(css)]);
        break;
      default:
        break;
    }
  }, [language]);

  useEffect(() => {
    let newCodemirrorTheme: "light" | "dark" = "light";

    if (theme === "dark") {
      newCodemirrorTheme = "dark";
      console.log(11, theme);
    } else if (theme === "system") {
      const prefersDark = window.matchMedia(
        "(prefers-color-scheme: dark)",
      ).matches;
      if (prefersDark) {
        newCodemirrorTheme = "dark";
      }
    }
    setCodemirrorTheme(newCodemirrorTheme as "light" | "dark");
  }, [theme]);

  return (
    <CodeMirror
      className="rounded-sm"
      height={height}
      width="100%"
      onChange={onChange}
      value={value}
      extensions={languageExtension}
      readOnly={readonly}
      placeholder={readonly ? "" : "Write your text here..."}
      theme={codemirrorTheme}
    />
  );
}
