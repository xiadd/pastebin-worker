import { useTheme } from "@/context/theme";
import markdownIt from "markdown-it";
import Prism from "prismjs";
import "prismjs/components/prism-bash";
import "prismjs/components/prism-c";
import "prismjs/components/prism-clike";
import "prismjs/components/prism-cpp";
import "prismjs/components/prism-css";
import "prismjs/components/prism-go";
import "prismjs/components/prism-java";
import "prismjs/components/prism-javascript";
import "prismjs/components/prism-json";
import "prismjs/components/prism-jsx";
import "prismjs/components/prism-markdown";
// 导入 Prism.js 语言支持（与 editor.tsx 保持一致）
import "prismjs/components/prism-markup";
import "prismjs/components/prism-python";
import "prismjs/components/prism-tsx";
import "prismjs/components/prism-typescript";
import "prismjs/components/prism-yaml";
import { useEffect, useMemo, useRef } from "react";

// 导入自定义 Prism 样式
import "./prism-custom.css";

const md = markdownIt({
  html: true,
  linkify: true,
  typographer: true,
});

// 语言映射（与 editor.tsx 保持一致）
const languageMap: Record<string, string> = {
  js: "javascript",
  ts: "typescript",
  jsx: "jsx",
  tsx: "tsx",
  py: "python",
  cpp: "cpp",
  "c++": "cpp",
  c: "c",
  java: "java",
  go: "go",
  css: "css",
  html: "markup",
  xml: "markup",
  json: "json",
  yaml: "yaml",
  yml: "yaml",
  bash: "bash",
  sh: "bash",
  shell: "bash",
  md: "markdown",
  markdown: "markdown",
};

export default function MdRenderer({ content }: { content: string }) {
  const { theme } = useTheme();
  const articleRef = useRef<HTMLElement>(null);

  // 获取当前主题
  const isDark =
    theme === "dark" ||
    (theme === "system" &&
      window.matchMedia("(prefers-color-scheme: dark)").matches);

  // 使用 useMemo 缓存处理过的内容
  const processedContent = useMemo(() => {
    const rendered = md.render(content);

    // 使用临时 DOM 元素来处理代码块
    const tempDiv = document.createElement("div");
    tempDiv.innerHTML = rendered;

    // 查找所有代码块
    const codeBlocks = tempDiv.querySelectorAll("pre code");

    codeBlocks.forEach((block, index) => {
      const codeElement = block as HTMLElement;
      const preElement = codeElement.parentElement as HTMLElement;

      // 获取语言类名
      const className = codeElement.className;
      const languageMatch = className.match(/language-(\w+)/);
      const language = languageMatch ? languageMatch[1] : "text";
      const prismLanguage = languageMap[language] || language;

      // 获取原始代码内容
      const code = codeElement.textContent || "";

      // 创建新的代码块容器
      const container = document.createElement("div");
      container.className = "code-block-container";

      // 创建头部
      const header = document.createElement("div");
      header.className = "code-block-header";

      // 语言标签
      const languageLabel = document.createElement("span");
      languageLabel.className = "code-block-language";
      languageLabel.textContent = language;

      // 复制按钮
      const copyButton = document.createElement("button");
      copyButton.className = "code-copy-button";
      copyButton.setAttribute("data-code", code);
      copyButton.setAttribute("data-index", index.toString());
      copyButton.innerHTML = `
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <rect width="14" height="14" x="8" y="8" rx="2" ry="2"/>
          <path d="m4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/>
        </svg>
        <span class="copy-text">Copy</span>
      `;

      header.appendChild(languageLabel);
      header.appendChild(copyButton);

      // 创建内容区域
      const contentDiv = document.createElement("div");
      contentDiv.className = "code-block-content";

      // 创建新的 pre 和 code 元素
      const newPre = document.createElement("pre");
      const newCode = document.createElement("code");
      newCode.className = `language-${language}`;

      // 进行语法高亮
      if (Prism.languages[prismLanguage]) {
        try {
          const highlightedCode = Prism.highlight(
            code,
            Prism.languages[prismLanguage],
            prismLanguage,
          );
          newCode.innerHTML = highlightedCode;
          newCode.classList.add(isDark ? "prism-dark" : "prism-light");
        } catch (error) {
          console.warn(
            "Prism highlighting failed for language:",
            prismLanguage,
            error,
          );
          newCode.textContent = code;
        }
      } else {
        newCode.textContent = code;
      }

      newPre.appendChild(newCode);
      contentDiv.appendChild(newPre);

      // 组装容器
      container.appendChild(header);
      container.appendChild(contentDiv);

      // 替换原来的 pre 元素
      preElement.parentNode?.replaceChild(container, preElement);
    });

    return tempDiv.innerHTML;
  }, [content, isDark]);

  // 处理复制按钮点击事件
  useEffect(() => {
    const handleCopyClick = async (event: Event) => {
      const target = event.target as HTMLElement;
      const button = target.closest(".code-copy-button") as HTMLButtonElement;

      if (!button) return;

      const code = button.getAttribute("data-code");
      const copyText = button.querySelector(".copy-text");

      if (!code || !copyText) return;

      try {
        await navigator.clipboard.writeText(code);

        // 更新按钮状态
        button.classList.add("copied");
        copyText.textContent = "Copied";

        // 2秒后恢复
        setTimeout(() => {
          button.classList.remove("copied");
          copyText.textContent = "Copy";
        }, 2000);
      } catch (err) {
        // 降级方案
        const textArea = document.createElement("textarea");
        textArea.value = code;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand("copy");
        document.body.removeChild(textArea);

        // 更新按钮状态
        button.classList.add("copied");
        copyText.textContent = "Copied";

        setTimeout(() => {
          button.classList.remove("copied");
          copyText.textContent = "Copy";
        }, 2000);
      }
    };

    const article = articleRef.current;
    if (article) {
      article.addEventListener("click", handleCopyClick);
      return () => {
        article.removeEventListener("click", handleCopyClick);
      };
    }
  }, [processedContent]);

  return (
    <article
      ref={articleRef}
      className="prose prose-lg dark:prose-invert max-w-none
        prose-headings:text-gray-900 dark:prose-headings:text-gray-100
        prose-p:text-gray-700 dark:prose-p:text-gray-300
        prose-strong:text-gray-900 dark:prose-strong:text-gray-100
        prose-code:text-pink-600 dark:prose-code:text-pink-400 prose-code:bg-gray-100 dark:prose-code:bg-gray-800 prose-code:px-1 prose-code:py-0.5 prose-code:rounded prose-code:text-sm prose-code:font-medium
        prose-pre:bg-gray-100 dark:prose-pre:bg-gray-900 prose-pre:text-gray-800 dark:prose-pre:text-gray-200 prose-pre:border dark:prose-pre:border-gray-700
        prose-blockquote:text-gray-700 dark:prose-blockquote:text-gray-300
        prose-a:text-blue-600 dark:prose-a:text-blue-400
        prose-li:text-gray-700 dark:prose-li:text-gray-300"
      dangerouslySetInnerHTML={{ __html: processedContent }}
    />
  );
}
