import markdownIt from 'markdown-it';

const md = markdownIt({
  html: true,
  linkify: true,
  typographer: true,
});

export default function MdRenderer({ content }: { content: string }) {
  return (
    <div className="px-10 md:px-0 md:max-w-6xl mx-auto md:pt-10">
      <div
        className="prose !max-w-full"
        dangerouslySetInnerHTML={{ __html: md.render(content) }}
      />
    </div>
  );
}
