import { javascript } from "@codemirror/lang-javascript";
import { markdown, markdownLanguage } from "@codemirror/lang-markdown";
import { StreamLanguage } from "@codemirror/language";
import { languages } from "@codemirror/language-data";
import { go } from "@codemirror/legacy-modes/mode/go";
import { python } from "@codemirror/legacy-modes/mode/python";
import { shell } from "@codemirror/legacy-modes/mode/shell";
import CodeMirror from "@uiw/react-codemirror";
import { useEffect, useState } from "react";

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
  const [languageExtension, setLanguageExtension] = useState<any>([]);
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
        setLanguageExtension([javascript()]);
        break;
      case "python":
        setLanguageExtension([StreamLanguage.define(python)]);
        break;
      case "shell":
        setLanguageExtension([StreamLanguage.define(shell)]);
        break;
      default:
        break;
    }
  }, [language]);

  return (
    <CodeMirror
      className="rounded-sm border border-gray-200"
      height={height}
      width="100%"
      onChange={onChange}
      value={value}
      extensions={languageExtension}
      readOnly={readonly}
      placeholder={readonly ? "" : "Write your text here..."}
      theme="light"
    />
  );
}
