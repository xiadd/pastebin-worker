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
  showFullscreenButton?: boolean;
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
  xml: "markup",
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
  showFullscreenButton = false,
}: EditorProps) {
  const { theme } = useTheme();
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const lineNumbersRef = useRef<HTMLDivElement>(null);
  const highlightRef = useRef<HTMLDivElement>(null);
  const [lineCount, setLineCount] = useState(1);
  const [highlightedCode, setHighlightedCode] = useState("");
  const [isFullscreen, setIsFullscreen] = useState(false);

  // 获取当前主题
  const isDark =
    theme === "dark" ||
    (theme === "system" &&
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-color-scheme: dark)").matches);

  // HTML 转义函数
  const escapeHtml = (text: string): string => {
    const div = document.createElement("div");
    div.textContent = text;
    return div.innerHTML;
  };

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
        // 如果语法高亮失败，转义HTML内容
        setHighlightedCode(escapeHtml(value));
      }
    } else {
      // 对于纯文本，转义HTML内容
      setHighlightedCode(escapeHtml(value));
    }
  }, [value, language]);

  // 同步滚动
  const handleScroll = () => {
    if (textareaRef.current && lineNumbersRef.current && highlightRef.current) {
      const scrollTop = textareaRef.current.scrollTop;
      const scrollLeft = textareaRef.current.scrollLeft;
      lineNumbersRef.current.scrollTop = scrollTop;
      highlightRef.current.scrollTop = scrollTop;
      highlightRef.current.scrollLeft = scrollLeft;
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

  // 处理粘贴事件，确保只粘贴纯文本
  const handlePaste = (e: React.ClipboardEvent<HTMLTextAreaElement>) => {
    e.preventDefault();

    // 获取纯文本内容
    const text = e.clipboardData.getData("text/plain");

    if (text && onChange) {
      const textarea = e.currentTarget;
      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;

      // 插入纯文本
      const newValue = value.substring(0, start) + text + value.substring(end);
      onChange(newValue);

      // 设置光标位置
      setTimeout(() => {
        textarea.selectionStart = textarea.selectionEnd = start + text.length;
      }, 0);
    }
  };

  // 全屏切换函数
  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  // 处理 ESC 键退出全屏
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isFullscreen) {
        setIsFullscreen(false);
      }
    };

    if (isFullscreen) {
      document.addEventListener("keydown", handleKeyDown);
      return () => document.removeEventListener("keydown", handleKeyDown);
    }
  }, [isFullscreen]);

  return (
    <div
      className={`rounded-md overflow-hidden bg-white dark:bg-gray-800 ${className} ${
        isFullscreen ? "fixed inset-0 z-50 rounded-none" : ""
      }`}
      style={{ height: isFullscreen ? "100vh" : height }}
    >
      {/* 工具栏 */}
      {showFullscreenButton && (
        <div className="flex justify-end items-center p-2 border-b border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700">
          <button
            onClick={toggleFullscreen}
            className="p-1.5 rounded-md hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
            title={isFullscreen ? "Exit Fullscreen (ESC)" : "Fullscreen"}
          >
            {isFullscreen ? (
              <svg
                className="w-4 h-4 text-gray-600 dark:text-gray-300"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            ) : (
              <svg
                className="w-4 h-4 text-gray-600 dark:text-gray-300"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4"
                />
              </svg>
            )}
          </button>
        </div>
      )}
      <div
        className={`flex ${
          showFullscreenButton ? "h-[calc(100%-49px)]" : "h-full"
        }`}
      >
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
              className={`font-mono text-sm whitespace-pre ${
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
            onPaste={handlePaste}
            readOnly={readonly}
            placeholder={readonly ? "" : "Write your text here..."}
            className="w-full h-full resize-none border-0 outline-0 bg-transparent font-mono text-sm p-3 focus:ring-0 relative z-10"
            style={{
              lineHeight: "1.5rem",
              tabSize: 4,
              color: "transparent",
              caretColor: isDark ? "#60a5fa" : "#3b82f6",
              whiteSpace: "pre",
              wordWrap: "normal",
              overflowWrap: "normal",
            }}
            spellCheck={false}
          />
        </div>
      </div>
    </div>
  );
}
