import {
  Chinese,
  NewComputer as Computer,
  English,
  Github,
  Moon,
  SunOne as Sun,
} from "@icon-park/react";
import Dropdown from "rc-dropdown";
import "rc-dropdown/assets/index.css";
import Menu, { Item as MenuItem } from "rc-menu";
import { useContext } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "wouter";

import logoIcon from "../assets/logo.svg";
import { ThemeContext } from "../context/theme";

// import { useTheme } from "../hooks/use-theme-select";

export default function Header() {
  const { t, i18n } = useTranslation();
  const { theme, setTheme } = useContext(ThemeContext);

  const handleChangeLanguage = (lang: string) => {
    i18n.changeLanguage(lang);
  };

  return (
    <div
      id="marketing-banner"
      tabIndex={-1}
      className="fixed left-1/2 top-4 z-50 flex w-[calc(100%-2rem)] -translate-x-1/2 shadow-lg flex-col justify-between rounded-lg p-4 md:flex-row lg:max-w-7xl navbar bg-base-100"
    >
      <div className="mb-0 me-4 flex flex-row items-center">
        <Link
          to="/"
          className="flex items-center border-gray-200 dark:border-gray-600 md:mb-0 md:me-4 md:border-e md:pe-4"
        >
          <img src={logoIcon} className="me-2 h-6" alt="Flowbite Logo" />
          <span className="self-center whitespace-nowrap text-lg font-semibold dark:text-white">
            PasteShare
          </span>
        </Link>

        <div className="flex">
          <Link
            to="/tutorial"
            className="rounded-lg px-4 py-2 text-sm font-medium text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
          >
            {t("tutorial")}
          </Link>
        </div>
      </div>
      <div className="flex flex-shrink-0 items-center">
        <a
          href="https://github.com/xiadd/pastebin-worker"
          target="_blank"
          rel="noopener noreferrer"
          className="btn btn-ghost btn-sm"
        >
          <Github size={20} />
        </a>

        <Dropdown
          overlay={
            <Menu className="z-10 divide-y divide-gray-100 rounded-lg !border-0 bg-white !shadow-md dark:bg-gray-700">
              <MenuItem key="1">
                <button
                  onClick={() => handleChangeLanguage("en")}
                  className="block w-full px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
                >
                  English
                </button>
              </MenuItem>
              <MenuItem key="2">
                <button
                  onClick={() => handleChangeLanguage("zh")}
                  className="block w-full px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
                >
                  中文
                </button>
              </MenuItem>
            </Menu>
          }
          trigger={["click"]}
        >
          <button className="flex gap-2 items-center btn btn-ghost btn-sm">
            {i18n.language === "en" ? (
              <English size={20} />
            ) : (
              <Chinese size={20} />
            )}
          </button>
        </Dropdown>

        <div className="dropdown">
          <div tabIndex={0} role="button" className="btn btn-ghost btn-sm">
            <button className="flex gap-2 items-center">
              {theme === "light" ? (
                <Sun size={18} />
              ) : theme === "dark" ? (
                <Moon size={18} />
              ) : (
                <Computer size={18} />
              )}
            </button>
          </div>
          <ul
            tabIndex={0}
            className="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-base-100 rounded-box"
          >
            <li onClick={() => setTheme("light")}>
              <div className="flex gap-2">
                <Sun size={18} />
                <span>Light</span>
              </div>
            </li>
            <li onClick={() => setTheme("dark")}>
              <div className="flex gap-2">
                <Moon size={18} />
                <span>Dark</span>
              </div>
            </li>
            <li onClick={() => setTheme("system")}>
              <div className="flex gap-2">
                <Computer size={18} />
                <span>System</span>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
