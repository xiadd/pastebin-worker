import { Github, Mail } from "@icon-park/react";
import { Link } from "@tanstack/react-router";

export default function Footer() {
  return (
    <footer className="bg-gray-50 dark:bg-gray-950 border-t border-gray-200 dark:border-gray-800">
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand Section */}
          <div className="col-span-1 md:col-span-2">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-50 mb-4">
              PasteShare
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-4 max-w-md">
              A free, fast, and secure pastebin service for sharing code
              snippets, text, and files online. Built with modern web
              technologies and powered by Cloudflare Workers for optimal
              performance.
            </p>
            <div className="flex gap-4">
              <a
                href="https://github.com/xiadd/pastebin-worker"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 transition-colors"
                aria-label="View source code on GitHub"
              >
                <Github size={20} />
              </a>
              <a
                href="mailto:xiadd0102@gmail.com"
                className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 transition-colors"
                aria-label="Contact us via email"
              >
                <Mail size={20} />
              </a>
            </div>
          </div>

          {/* Features */}
          <div>
            <h4 className="text-sm font-semibold text-gray-900 dark:text-gray-50 mb-4 uppercase tracking-wider">
              Features
            </h4>
            <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
              <li>Syntax Highlighting</li>
              <li>Password Protection</li>
              <li>Auto Expiration</li>
              <li>File Uploads</li>
              <li>Mobile Responsive</li>
              <li>API Access</li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h4 className="text-sm font-semibold text-gray-900 dark:text-gray-50 mb-4 uppercase tracking-wider">
              Resources
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  to="/tutorial"
                  className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 transition-colors"
                >
                  Tutorial & API
                </Link>
              </li>
              <li>
                <a
                  href="https://github.com/xiadd/pastebin-worker"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 transition-colors"
                >
                  Source Code
                </a>
              </li>
              <li>
                <a
                  href="https://github.com/xiadd/pastebin-worker/issues"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 transition-colors"
                >
                  Report Issues
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-200 dark:border-gray-800 mt-8 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              © {new Date().getFullYear()} PasteShare. Open source pastebin
              service.
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-2 md:mt-0">
              Built with ❤️ using Cloudflare Workers
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
