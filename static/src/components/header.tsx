import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Chinese,
  NewComputer as Computer,
  English,
  Github,
  Moon,
  SunOne as Sun,
} from "@icon-park/react";
import { useTranslation } from "react-i18next";
import { Link } from "wouter";

import logoIcon from "../assets/logo.svg";
import { useTheme } from "../context/theme";

export default function Header() {
  const { i18n } = useTranslation();
  const { theme, setTheme } = useTheme();

  const handleChangeLanguage = (lang: string) => {
    i18n.changeLanguage(lang);
  };

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
                {i18n.language === "en" ? (
                  <English size={18} />
                ) : (
                  <Chinese size={18} />
                )}
              </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem>
                <button
                  onClick={() => handleChangeLanguage("en")}
                  className="block w-full text-left px-2 py-1"
                >
                  English
                </button>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <button
                  onClick={() => handleChangeLanguage("spanish")}
                  className="block w-full text-left px-2 py-1"
                >
                  Español
                </button>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <button
                  onClick={() => handleChangeLanguage("russian")}
                  className="block w-full text-left px-2 py-1"
                >
                  Русский язык
                </button>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <button
                  onClick={() => handleChangeLanguage("zh")}
                  className="block w-full text-left px-2 py-1"
                >
                  中文
                </button>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <button
                  onClick={() => handleChangeLanguage("indonesian")}
                  className="block w-full text-left px-2 py-1"
                >
                  Bahasa Indonesia
                </button>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <button
                  onClick={() => handleChangeLanguage("japanese")}
                  className="block w-full text-left px-2 py-1"
                >
                  Japanese
                </button>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <DropdownMenu>
            <DropdownMenuTrigger>
              <div className="p-2 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white">
                {theme === "light" ? (
                  <Sun size={18} />
                ) : theme === "dark" ? (
                  <Moon size={18} />
                ) : (
                  <Computer size={18} />
                )}
              </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem>
                <button
                  onClick={() => setTheme("light")}
                  className="block w-full text-left px-2 py-1"
                >
                  Light
                </button>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <button
                  onClick={() => setTheme("dark")}
                  className="block w-full text-left px-2 py-1"
                >
                  Dark
                </button>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <button
                  onClick={() => setTheme("system")}
                  className="block w-full text-left px-2 py-1"
                >
                  System
                </button>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </nav>
      </div>
    </header>
  );
}
