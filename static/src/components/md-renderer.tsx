import markdownIt from "markdown-it";

const md = markdownIt({
  html: true,
  linkify: true,
  typographer: true,
});

export default function MdRenderer({ content }: { content: string }) {
  return (
    <article
      className="prose prose-lg dark:prose-invert max-w-none
        prose-headings:text-gray-900 dark:prose-headings:text-gray-100
        prose-p:text-gray-700 dark:prose-p:text-gray-300
        prose-strong:text-gray-900 dark:prose-strong:text-gray-100
        prose-code:text-pink-600 dark:prose-code:text-pink-400 prose-code:bg-gray-100 dark:prose-code:bg-gray-800 prose-code:px-1 prose-code:py-0.5 prose-code:rounded prose-code:text-sm prose-code:font-medium
        prose-pre:bg-gray-100 dark:prose-pre:bg-gray-900 prose-pre:text-gray-800 dark:prose-pre:text-gray-200 prose-pre:border dark:prose-pre:border-gray-700
        prose-blockquote:text-gray-700 dark:prose-blockquote:text-gray-300
        prose-a:text-blue-600 dark:prose-a:text-blue-400
        prose-li:text-gray-700 dark:prose-li:text-gray-300"
      dangerouslySetInnerHTML={{ __html: md.render(content) }}
    />
  );
}
