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
  const [monacoTheme, setMonacoTheme] = useState<"light" | "custom-dark">(
    "light",
  );
  const [editorInstance, setEditorInstance] = useState<any>(null);
  const [monacoInstance, setMonacoInstance] = useState<any>(null);

  useEffect(() => {
    let newMonacoTheme: "light" | "custom-dark" = "light";

    // 检查当前是否应该使用暗色模式
    const isDark =
      theme === "dark" ||
      (theme === "system" &&
        window.matchMedia("(prefers-color-scheme: dark)").matches);

    if (isDark) {
      newMonacoTheme = "custom-dark";
    }

    setMonacoTheme(newMonacoTheme);

    // 如果编辑器已经加载，立即应用主题
    if (monacoInstance && editorInstance) {
      monacoInstance.editor.setTheme(newMonacoTheme);
    }
  }, [theme, editorInstance, monacoInstance]);

  const handleEditorDidMount = (editor: any, monaco: any) => {
    setEditorInstance(editor);
    setMonacoInstance(monaco);

    // 修复滚轮事件被拦截的问题 - 允许页面滚动
    const editorDomNode = editor.getDomNode();
    if (editorDomNode) {
      // 监听编辑器的滚轮事件
      editorDomNode.addEventListener(
        "wheel",
        (e: WheelEvent) => {
          // 如果按住 Ctrl/Cmd 键，保留缩放功能
          if (e.ctrlKey || e.metaKey) {
            return;
          }

          // 获取编辑器的滚动容器
          const scrollContainer = editorDomNode.querySelector(
            ".monaco-scrollable-element",
          ) as HTMLElement;

          if (!scrollContainer) {
            return;
          }

          const { scrollTop, scrollHeight, clientHeight } = scrollContainer;
          const isScrollable = scrollHeight > clientHeight;

          // 如果编辑器内容不需要滚动，直接允许页面滚动
          if (!isScrollable) {
            return;
          }

          const isAtTop = scrollTop <= 0;
          const isAtBottom = scrollTop + clientHeight >= scrollHeight - 1;

          // 如果编辑器已经滚动到边界，允许页面滚动
          if ((isAtTop && e.deltaY < 0) || (isAtBottom && e.deltaY > 0)) {
            return;
          }

          // 编辑器还可以滚动，阻止页面滚动
          e.preventDefault();
          e.stopPropagation();
        },
        { passive: false },
      );
    }

    // 定义自定义暗色主题
    monaco.editor.defineTheme("custom-dark", {
      base: "vs-dark",
      inherit: true,
      rules: [
        { token: "", foreground: "e5e7eb" },
        { token: "comment", foreground: "6b7280", fontStyle: "italic" },
        { token: "keyword", foreground: "60a5fa" },
        { token: "string", foreground: "34d399" },
        { token: "number", foreground: "fbbf24" },
        { token: "regexp", foreground: "f87171" },
        { token: "type", foreground: "a78bfa" },
        { token: "class", foreground: "fbbf24" },
        { token: "function", foreground: "60a5fa" },
        { token: "variable", foreground: "e5e7eb" },
        { token: "constant", foreground: "f87171" },
        { token: "property", foreground: "fbbf24" },
        { token: "operator", foreground: "f87171" },
        { token: "tag", foreground: "f87171" },
        { token: "attribute.name", foreground: "fbbf24" },
        { token: "attribute.value", foreground: "34d399" },
      ],
      colors: {
        "editor.background": "#1f2937",
        "editor.foreground": "#e5e7eb",
        "editorLineNumber.foreground": "#6b7280",
        "editorLineNumber.activeForeground": "#9ca3af",
        "editor.selectionBackground": "#374151",
        "editor.selectionHighlightBackground": "#374151",
        "editorCursor.foreground": "#60a5fa",
        "editor.lineHighlightBackground": "#374151",
        "editorWhitespace.foreground": "#4b5563",
        "editorIndentGuide.background": "#4b5563",
        "editorIndentGuide.activeBackground": "#6b7280",
        "editor.findMatchBackground": "#1d4ed8",
        "editor.findMatchHighlightBackground": "#3b82f6",
        "scrollbarSlider.background": "#4b556380",
        "scrollbarSlider.hoverBackground": "#6b728080",
        "scrollbarSlider.activeBackground": "#9ca3af80",
      },
    });

    // 根据当前主题应用正确的主题
    const isDark =
      theme === "dark" ||
      (theme === "system" &&
        window.matchMedia("(prefers-color-scheme: dark)").matches);
    monaco.editor.setTheme(isDark ? "custom-dark" : "light");
  };

  const handleEditorChange = (value: string | undefined) => {
    if (onChange) {
      onChange(value || "");
    }
  };

  return (
    <div
      className={`rounded-md border overflow-hidden bg-white dark:bg-gray-800 ${className}`}
    >
      <Editor
        height={height}
        language={languageMap[language] || "plaintext"}
        value={value}
        onChange={handleEditorChange}
        theme={monacoTheme}
        onMount={handleEditorDidMount}
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
          mouseWheelZoom: false,
          smoothScrolling: true,
          cursorSmoothCaretAnimation: "on",
        }}
      />
    </div>
  );
}
