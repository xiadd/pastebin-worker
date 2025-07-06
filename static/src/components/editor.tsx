import Editor from "@monaco-editor/react";
import { useEffect, useState } from "react";

import { useTheme } from "../context/theme";

interface EditorProps {
  language?: string;
  value: string;
  onChange?: (content: string) => void;
  readonly?: boolean;
  className?: string;
  height?: string;
}

// Monaco Editor 语言映射
const languageMap: Record<string, string> = {
  text: "plaintext",
  markdown: "markdown",
  go: "go",
  javascript: "javascript",
  typescript: "typescript",
  json: "json",
  c: "c",
  cpp: "cpp",
  python: "python",
  shell: "shell",
  html: "html",
  yaml: "yaml",
  css: "css",
  less: "less",
  scss: "scss",
  golang: "go",
};

export default function MonacoEditor({
  value,
  onChange,
  language = "text",
  readonly = false,
  height = "300px",
  className = "",
}: EditorProps) {
  const { theme } = useTheme();
  const [monacoTheme, setMonacoTheme] = useState<"light" | "vs-dark">("light");

  useEffect(() => {
    let newMonacoTheme: "light" | "vs-dark" = "light";

    if (theme === "dark") {
      newMonacoTheme = "vs-dark";
    } else if (theme === "system") {
      const prefersDark = window.matchMedia(
        "(prefers-color-scheme: dark)",
      ).matches;
      if (prefersDark) {
        newMonacoTheme = "vs-dark";
      }
    }
    setMonacoTheme(newMonacoTheme);
  }, [theme]);

  const handleEditorChange = (value: string | undefined) => {
    if (onChange) {
      onChange(value || "");
    }
  };

  return (
    <div className={`rounded-md border overflow-hidden ${className}`}>
      <Editor
        height={height}
        language={languageMap[language] || "plaintext"}
        value={value}
        onChange={handleEditorChange}
        theme={monacoTheme}
        options={{
          readOnly: readonly,
          minimap: { enabled: false },
          fontSize: 14,
          lineNumbers: "on",
          scrollBeyondLastLine: false,
          automaticLayout: true,
          wordWrap: "on",
          contextmenu: false,
          placeholder: readonly ? "" : "Write your text here...",
          scrollbar: {
            vertical: "visible",
            horizontal: "visible",
          },
          renderLineHighlight: "line",
          cursorBlinking: "blink",
          selectOnLineNumbers: true,
          roundedSelection: false,
          matchBrackets: "always",
          folding: true,
          foldingStrategy: "indentation",
          showFoldingControls: "always",
          renderWhitespace: "selection",
          mouseWheelZoom: true,
          smoothScrolling: true,
          cursorSmoothCaretAnimation: "on",
        }}
      />
    </div>
  );
}
