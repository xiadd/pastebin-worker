import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  NewComputer as Computer,
  Github,
  Moon,
  SunOne as Sun,
} from '@icon-park/react';
import { Link } from '@tanstack/react-router';
import { useState } from 'react';

import logoIcon from '../assets/logo.svg';
import { useTheme } from '../context/theme';
import ShareHistorySidebar from './share-history-sidebar';

export default function Header() {
  const { theme, setTheme } = useTheme();
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);

  return (
    <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 shadow-sm">
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 h-16 flex justify-between items-center">
        <Link to="/" className="flex items-center space-x-2">
          <img src={logoIcon} className="h-8 w-8" alt="PasteShare" />
          <span className="text-xl font-semibold text-gray-900 dark:text-white">
            PasteShare
          </span>
        </Link>
        <nav className="flex items-center space-x-2">
          <button
            onClick={() => setIsHistoryOpen(true)}
            className="p-2 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
            aria-label="Share History"
            title="Share History"
          >
            <svg
              className="w-[18px] h-[18px]"
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
          </button>

          <a
            href="https://github.com/xiadd/pastebin-worker"
            target="_blank"
            rel="noopener noreferrer"
            className="p-2 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
            aria-label="View source code on GitHub"
          >
            <Github size={18} />
          </a>

          <DropdownMenu>
            <DropdownMenuTrigger>
              <div className="p-2 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white">
                {theme === 'light' ? (
                  <Sun size={18} />
                ) : theme === 'dark' ? (
                  <Moon size={18} />
                ) : (
                  <Computer size={18} />
                )}
              </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem>
                <button
                  onClick={() => setTheme('light')}
                  className="block w-full text-left px-2 py-1"
                >
                  Light
                </button>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <button
                  onClick={() => setTheme('dark')}
                  className="block w-full text-left px-2 py-1"
                >
                  Dark
                </button>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <button
                  onClick={() => setTheme('system')}
                  className="block w-full text-left px-2 py-1"
                >
                  System
                </button>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </nav>
      </div>

      <ShareHistorySidebar
        open={isHistoryOpen}
        onClose={() => setIsHistoryOpen(false)}
      />
    </header>
  );
}
