export default function Tutorial() {
  return (
    <article className="mx-auto max-w-7xl p-4 md:pt-10">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
          How to Use PasteShare - Tutorial & API Guide
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-300">
          Learn how to use PasteShare for sharing code snippets, text, and
          files. Includes API documentation for developers.
        </p>
      </header>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold text-gray-800 dark:text-white mb-4">
          Getting Started
        </h2>
        <div className="prose dark:prose-invert max-w-none">
          <p>
            PasteShare is a free, fast, and secure pastebin service built on
            Cloudflare Workers. You can use it to share code snippets, text
            documents, and files with others quickly and easily.
          </p>
          <h3>Basic Usage:</h3>
          <ol>
            <li>Paste your code or text in the editor</li>
            <li>Choose your programming language for syntax highlighting</li>
            <li>Set expiration time (optional)</li>
            <li>Add password protection (optional)</li>
            <li>Click "Create Paste" to generate a shareable link</li>
          </ol>
        </div>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold text-gray-800 dark:text-white mb-4">
          API Documentation
        </h2>
        <div className="prose dark:prose-invert max-w-none">
          <h3>Create a Paste via API</h3>
          <p>You can create pastes programmatically using our REST API:</p>
          <pre className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg overflow-x-auto">
            <code>{`curl 'https://as.al/api/create' \\
  --data-raw '{
    "content": "console.log('Hello World!');",
    "language": "javascript",
    "expire": 3600,
    "isPrivate": false
  }' \\
  --header 'Content-Type: application/json'`}</code>
          </pre>

          <h3>API Parameters:</h3>
          <ul>
            <li>
              <strong>content</strong> (required): The text/code content to
              share
            </li>
            <li>
              <strong>language</strong> (optional): Programming language for
              syntax highlighting
            </li>
            <li>
              <strong>expire</strong> (optional): Expiration time in seconds
            </li>
            <li>
              <strong>isPrivate</strong> (optional): Whether to password protect
              the paste
            </li>
            <li>
              <strong>share_password</strong> (optional): Custom password for
              private pastes
            </li>
          </ul>
        </div>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold text-gray-800 dark:text-white mb-4">
          Supported Languages
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            "JavaScript",
            "TypeScript",
            "Python",
            "Go",
            "C/C++",
            "Java",
            "PHP",
            "Ruby",
            "Rust",
            "Shell",
            "JSON",
            "YAML",
            "Markdown",
            "CSS",
            "HTML",
            "SQL",
          ].map((lang) => (
            <div
              key={lang}
              className="bg-gray-100 dark:bg-gray-800 p-3 rounded-lg text-center"
            >
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                {lang}
              </span>
            </div>
          ))}
        </div>
      </section>

      <section>
        <h2 className="text-2xl font-semibold text-gray-800 dark:text-white mb-4">
          Open Source
        </h2>
        <div className="prose dark:prose-invert max-w-none">
          <p>
            PasteShare is open source and available on GitHub. Feel free to
            contribute, report issues, or star the repository if you find it
            useful.
          </p>
          <p>
            <a
              href="https://github.com/xiadd/pastebin-worker"
              className="text-blue-600 dark:text-blue-400 hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              View on GitHub →
            </a>
          </p>
        </div>
      </section>
    </article>
  );
}
