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
  Mail,
  Moon,
  SunOne as Sun,
} from "@icon-park/react";
import { useTranslation } from "react-i18next";
import { Link } from "wouter";

import logoIcon from "../assets/logo.svg";
import { useTheme } from "../context/theme";

export default function Header() {
  const { t, i18n } = useTranslation();
  const { theme, setTheme } = useTheme();

  const handleChangeLanguage = (lang: string) => {
    i18n.changeLanguage(lang);
  };

  return (
    <header
      tabIndex={-1}
      className="container relative z-50 h-20 flex justify-between items-center border-b border-1"
    >
      <div className="mb-0 me-4 flex flex-row items-center">
        <Link to="/" className="flex items-center md:mb-0 md:me-4 md:pe-4">
          <img
            src={logoIcon}
            className="me-2 h-6"
            alt="PasteShare Logo - Free Online Pastebin"
          />
          <span className="self-center whitespace-nowrap text-lg font-semibold">
            PasteShare
          </span>
        </Link>
      </div>
      <nav className="flex flex-shrink-0 items-center gap-4">
        <a
          href="https://github.com/xiadd/pastebin-worker"
          target="_blank"
          rel="noopener noreferrer"
          className="btn btn-ghost btn-sm"
          aria-label="View source code on GitHub"
        >
          <Github size={20} />
        </a>

        <a href="mailto:xiadd0102@gmail.com" aria-label="Contact us via email">
          <Mail size={20} />
        </a>

        <DropdownMenu>
          <DropdownMenuTrigger>
            <button className="flex gap-2 items-center btn btn-ghost btn-sm">
              {i18n.language === "en" ? (
                <English size={20} />
              ) : (
                <Chinese size={20} />
              )}
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem>
              <button
                onClick={() => handleChangeLanguage("en")}
                className="block w-full px-4"
              >
                English
              </button>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <button
                onClick={() => handleChangeLanguage("spanish")}
                className="block w-full px-4"
              >
                Español
              </button>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <button
                onClick={() => handleChangeLanguage("russian")}
                className="block w-full px-4"
              >
                Русский язык
              </button>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <button
                onClick={() => handleChangeLanguage("zh")}
                className="block w-full px-4"
              >
                中文
              </button>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <button
                onClick={() => handleChangeLanguage("indonesian")}
                className="block w-full px-4"
              >
                Bahasa Indonesia
              </button>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <button
                onClick={() => handleChangeLanguage("japanese")}
                className="block w-full px-4"
              >
                Japanese
              </button>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <DropdownMenu>
          <DropdownMenuTrigger>
            <button className="flex gap-2 items-center btn btn-ghost btn-sm">
              {theme === "light" ? (
                <Sun size={20} />
              ) : theme === "dark" ? (
                <Moon size={20} />
              ) : (
                <Computer size={20} />
              )}
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem>
              <button
                onClick={() => setTheme("light")}
                className="block w-full px-4"
              >
                Light
              </button>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <button
                onClick={() => setTheme("dark")}
                className="block w-full px-4"
              >
                Dark
              </button>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <button
                onClick={() => setTheme("system")}
                className="block w-full px-4"
              >
                System
              </button>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </nav>
    </header>
  );
}
