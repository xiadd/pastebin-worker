export default function Tutorial() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto max-w-4xl px-4 py-12">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
          <div className="p-8">
            <header className="mb-12 text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 dark:bg-blue-900 rounded-full mb-6">
                <svg
                  className="w-8 h-8 text-blue-600 dark:text-blue-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
              </div>
              <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
                Tutorial & API Guide
              </h1>
              <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
                Learn how to use PasteShare for sharing code snippets, text, and
                files with ease and security.
              </p>
            </header>

            <section className="mb-12">
              <div className="flex items-center mb-6">
                <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center mr-3">
                  <svg
                    className="w-5 h-5 text-blue-600 dark:text-blue-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                    />
                  </svg>
                </div>
                <h2 className="text-3xl font-semibold text-gray-800 dark:text-white">
                  Getting Started
                </h2>
              </div>
              <div className="bg-gray-50 dark:bg-gray-700 rounded-xl p-6 mb-6">
                <p className="text-gray-700 dark:text-gray-200 text-lg leading-relaxed">
                  PasteShare is a free, fast, and secure pastebin service built
                  on Cloudflare Workers. You can use it to share code snippets,
                  text documents, and files with others quickly and easily.
                </p>
              </div>
              <div className="bg-white dark:bg-gray-750 rounded-xl border border-gray-200 dark:border-gray-600 p-6">
                <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-4 flex items-center">
                  <span className="w-6 h-6 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center mr-2 text-sm font-bold text-blue-600 dark:text-blue-400">
                    1
                  </span>
                  Basic Usage
                </h3>
                <ol className="space-y-3">
                  {[
                    "Paste your code or text in the editor",
                    "Choose your programming language for syntax highlighting",
                    "Set expiration time (optional)",
                    "Add password protection (optional)",
                    'Click "Create Paste" to generate a shareable link',
                  ].map((step, index) => (
                    <li key={index} className="flex items-start">
                      <span className="flex-shrink-0 w-6 h-6 bg-gray-100 dark:bg-gray-600 rounded-full flex items-center justify-center mr-3 mt-0.5">
                        <span className="text-sm font-medium text-gray-600 dark:text-gray-300">
                          {index + 1}
                        </span>
                      </span>
                      <span className="text-gray-700 dark:text-gray-200">
                        {step}
                      </span>
                    </li>
                  ))}
                </ol>
              </div>
            </section>

            <section className="mb-12">
              <div className="flex items-center mb-6">
                <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center mr-3">
                  <svg
                    className="w-5 h-5 text-blue-600 dark:text-blue-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"
                    />
                  </svg>
                </div>
                <h2 className="text-3xl font-semibold text-gray-800 dark:text-white">
                  API Documentation
                </h2>
              </div>

              <div className="space-y-6">
                <div className="bg-white dark:bg-gray-750 rounded-xl border border-gray-200 dark:border-gray-600 p-6">
                  <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">
                    Create a Paste via API
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300 mb-4">
                    You can create pastes programmatically using our REST API:
                  </p>
                  <div className="relative">
                    <pre className="bg-gray-900 dark:bg-black text-gray-100 p-6 rounded-lg overflow-x-auto border border-gray-300 dark:border-gray-600 shadow-inner">
                      <code className="text-sm font-mono">{`curl 'https://as.al/api/create' \\
  --data-raw '{
    "content": "console.log('Hello World!');",
    "language": "javascript",
    "expire": 3600,
    "isPrivate": false
  }' \\
  --header 'Content-Type: application/json'`}</code>
                    </pre>
                    <button className="absolute top-3 right-3 p-2 text-gray-400 hover:text-gray-200 transition-colors">
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                        />
                      </svg>
                    </button>
                  </div>
                </div>

                <div className="bg-white dark:bg-gray-750 rounded-xl border border-gray-200 dark:border-gray-600 p-6">
                  <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">
                    API Parameters
                  </h3>
                  <div className="space-y-4">
                    {[
                      {
                        name: "content",
                        required: true,
                        desc: "The text/code content to share",
                      },
                      {
                        name: "language",
                        required: false,
                        desc: "Programming language for syntax highlighting",
                      },
                      {
                        name: "expire",
                        required: false,
                        desc: "Expiration time in seconds",
                      },
                      {
                        name: "isPrivate",
                        required: false,
                        desc: "Whether to password protect the paste",
                      },
                      {
                        name: "share_password",
                        required: false,
                        desc: "Custom password for private pastes",
                      },
                    ].map((param) => (
                      <div
                        key={param.name}
                        className="flex items-start p-4 bg-gray-50 dark:bg-gray-700 rounded-lg"
                      >
                        <div className="flex-shrink-0 mr-4">
                          <code className="px-2 py-1 bg-gray-200 dark:bg-gray-600 text-gray-800 dark:text-gray-200 rounded text-sm font-mono">
                            {param.name}
                          </code>
                          <span
                            className={`ml-2 px-2 py-1 text-xs rounded-full ${
                              param.required
                                ? "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
                                : "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
                            }`}
                          >
                            {param.required ? "required" : "optional"}
                          </span>
                        </div>
                        <p className="text-gray-600 dark:text-gray-300">
                          {param.desc}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </section>

            <section className="mb-12">
              <div className="flex items-center mb-6">
                <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center mr-3">
                  <svg
                    className="w-5 h-5 text-blue-600 dark:text-blue-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zM21 5a2 2 0 00-2-2h-4a2 2 0 00-2 2v12a4 4 0 004 4h4a2 2 0 002-2V5z"
                    />
                  </svg>
                </div>
                <h2 className="text-3xl font-semibold text-gray-800 dark:text-white">
                  Supported Languages
                </h2>
              </div>
              <div className="bg-white dark:bg-gray-750 rounded-xl border border-gray-200 dark:border-gray-600 p-6">
                <p className="text-gray-600 dark:text-gray-300 mb-6">
                  PasteShare supports syntax highlighting for a wide variety of
                  programming languages and file formats:
                </p>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
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
                      className="bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 px-3 py-2 rounded-lg text-center transition-all duration-200 hover:bg-blue-50 hover:text-blue-700 dark:hover:bg-blue-900 dark:hover:text-blue-300 hover:scale-105"
                    >
                      <span className="text-sm font-medium">{lang}</span>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            <section className="mb-8">
              <div className="flex items-center mb-6">
                <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center mr-3">
                  <svg
                    className="w-5 h-5 text-blue-600 dark:text-blue-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                    />
                  </svg>
                </div>
                <h2 className="text-3xl font-semibold text-gray-800 dark:text-white">
                  Open Source
                </h2>
              </div>
              <div className="bg-gray-50 dark:bg-gray-700 rounded-xl p-8 border border-gray-200 dark:border-gray-600">
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
                      <svg
                        className="w-6 h-6 text-blue-600 dark:text-blue-400"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                      </svg>
                    </div>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-3">
                      Contribute to PasteShare
                    </h3>
                    <p className="text-gray-700 dark:text-gray-200 mb-4 leading-relaxed">
                      PasteShare is open source and available on GitHub. We
                      welcome contributions, bug reports, feature requests, and
                      feedback from the community. Help us make PasteShare even
                      better!
                    </p>
                    <div className="flex flex-wrap gap-3">
                      <a
                        href="https://github.com/xiadd/pastebin-worker"
                        className="inline-flex items-center px-4 py-2 bg-gray-900 dark:bg-gray-700 text-white rounded-lg hover:bg-gray-800 dark:hover:bg-gray-600 transition-colors"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <svg
                          className="w-4 h-4 mr-2"
                          fill="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.30.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                        </svg>
                        View on GitHub
                      </a>
                      <a
                        href="https://github.com/xiadd/pastebin-worker/issues"
                        className="inline-flex items-center px-4 py-2 bg-blue-600 dark:bg-blue-700 text-white rounded-lg hover:bg-blue-700 dark:hover:bg-blue-600 transition-colors"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <svg
                          className="w-4 h-4 mr-2"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.732L13.732 4.268c-.77-1.065-2.694-1.065-3.464 0L3.34 16.268c-.77 1.065.192 2.732 1.732 2.732z"
                          />
                        </svg>
                        Report Issues
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
