import Prism from "prismjs";
import "prismjs/components/prism-bash";
import "prismjs/components/prism-c";
import "prismjs/components/prism-clike";
import "prismjs/components/prism-cpp";
import "prismjs/components/prism-css";
import "prismjs/components/prism-go";
import "prismjs/components/prism-java";
// 第二层：依赖基础语言的语言
import "prismjs/components/prism-javascript";
import "prismjs/components/prism-json";
import "prismjs/components/prism-jsx";
import "prismjs/components/prism-markdown";
// 第一层：基础语言
import "prismjs/components/prism-markup";
// 第三层：独立语言
import "prismjs/components/prism-python";
import "prismjs/components/prism-tsx";
import "prismjs/components/prism-typescript";
// 第四层：依赖多个语言的格式
import "prismjs/components/prism-yaml";
import { useEffect, useRef, useState } from "react";

import { useTheme } from "../context/theme";
// 导入自定义样式
import "./prism-custom.css";

interface EditorProps {
  language?: string;
  value: string;
  onChange?: (content: string) => void;
  readonly?: boolean;
  className?: string;
  height?: string;
}

// Prism.js 语言映射
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
  shell: "bash",
  html: "markup",
  yaml: "yaml",
  css: "css",
  less: "css",
  scss: "scss",
  golang: "go",
  js: "javascript",
  ts: "typescript",
  jsx: "jsx",
  tsx: "tsx",
  java: "java",
  csharp: "csharp",
  php: "php",
  ruby: "ruby",
  rust: "rust",
  sql: "sql",
  bash: "bash",
  sh: "bash",
};

export default function SimpleEditor({
  value,
  onChange,
  language = "text",
  readonly = false,
  height = "300px",
  className = "",
}: EditorProps) {
  const { theme } = useTheme();
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const lineNumbersRef = useRef<HTMLDivElement>(null);
  const highlightRef = useRef<HTMLDivElement>(null);
  const [lineCount, setLineCount] = useState(1);
  const [highlightedCode, setHighlightedCode] = useState("");

  // 获取当前主题
  const isDark =
    theme === "dark" ||
    (theme === "system" &&
      window.matchMedia("(prefers-color-scheme: dark)").matches);

  // 计算行数和语法高亮
  useEffect(() => {
    const lines = value.split("\n").length;
    setLineCount(lines);

    // 语法高亮
    const prismLanguage = languageMap[language] || "plaintext";

    if (prismLanguage !== "plaintext" && Prism.languages[prismLanguage]) {
      try {
        const highlighted = Prism.highlight(
          value,
          Prism.languages[prismLanguage],
          prismLanguage,
        );
        setHighlightedCode(highlighted);
      } catch (error) {
        console.warn("Prism highlighting failed:", error);
        setHighlightedCode(value);
      }
    } else {
      setHighlightedCode(value);
    }
  }, [value, language]);

  // 同步滚动
  const handleScroll = () => {
    if (textareaRef.current && lineNumbersRef.current && highlightRef.current) {
      const scrollTop = textareaRef.current.scrollTop;
      lineNumbersRef.current.scrollTop = scrollTop;
      highlightRef.current.scrollTop = scrollTop;
    }
  };

  // 处理 Tab 键插入 4 个空格
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Tab") {
      e.preventDefault();
      const textarea = e.currentTarget;
      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;

      // 插入 4 个空格
      const newValue =
        value.substring(0, start) + "    " + value.substring(end);

      if (onChange) {
        onChange(newValue);
      }

      // 设置光标位置
      setTimeout(() => {
        textarea.selectionStart = textarea.selectionEnd = start + 4;
      }, 0);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    if (onChange) {
      onChange(e.target.value);
    }
  };

  return (
    <div
      className={`rounded-md overflow-hidden bg-white dark:bg-gray-800 ${className}`}
      style={{ height }}
    >
      <div className="flex h-full">
        {/* 行号区域 */}
        <div
          ref={lineNumbersRef}
          className="flex-shrink-0 bg-gray-50 dark:bg-gray-700 border-r border-gray-200 dark:border-gray-600 overflow-hidden select-none"
          style={{
            width: `${Math.max(3, lineCount.toString().length + 1)}ch`,
            paddingLeft: "8px",
            paddingRight: "8px",
          }}
        >
          <div
            className="text-sm text-gray-500 dark:text-gray-400 font-mono pt-3 pb-3"
            style={{ lineHeight: "1.5rem" }}
          >
            {Array.from({ length: lineCount }, (_, i) => (
              <div
                key={i + 1}
                className="text-right"
                style={{ height: "1.5rem", lineHeight: "1.5rem" }}
              >
                {i + 1}
              </div>
            ))}
          </div>
        </div>

        {/* 编辑器区域 */}
        <div className="flex-1 relative">
          {/* 语法高亮层 */}
          <div
            ref={highlightRef}
            className="absolute inset-0 pointer-events-none overflow-hidden"
            style={{
              padding: "12px",
              lineHeight: "1.5rem",
              fontSize: "14px",
              fontFamily:
                "ui-monospace, SFMono-Regular, 'SF Mono', Consolas, 'Liberation Mono', Menlo, monospace",
            }}
          >
            <pre
              className={`font-mono text-sm whitespace-pre-wrap break-words ${
                isDark ? "prism-dark" : "prism-light"
              }`}
              style={{
                margin: 0,
                padding: 0,
                background: "transparent",
                lineHeight: "1.5rem",
                color: isDark ? "#e5e7eb" : "#374151",
              }}
              dangerouslySetInnerHTML={{ __html: highlightedCode }}
            />
          </div>

          {/* 透明的 textarea */}
          <textarea
            ref={textareaRef}
            value={value}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            onScroll={handleScroll}
            readOnly={readonly}
            placeholder={readonly ? "" : "Write your text here..."}
            className="w-full h-full resize-none border-0 outline-0 bg-transparent font-mono text-sm p-3 focus:ring-0 relative z-10"
            style={{
              lineHeight: "1.5rem",
              tabSize: 4,
              color: "transparent",
              caretColor: isDark ? "#60a5fa" : "#3b82f6",
            }}
            spellCheck={false}
          />
        </div>
      </div>
    </div>
  );
}
