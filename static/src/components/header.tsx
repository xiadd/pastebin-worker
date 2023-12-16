import { useState } from 'react';
import { Link } from 'wouter';
import { useTranslation } from 'react-i18next';
import { Menu, Transition } from '@headlessui/react';

import logoIcon from '../assets/logo.svg';
import githubIcon from '../assets/github.svg';

export default function Header() {
  const { t, i18n } = useTranslation();

  const [showLanguageToggle, setShowLanguageToggle] = useState(false);

  const handleChangeLanguage = (lang: string) => {
    i18n.changeLanguage(lang);
  };

  return (
    <div
      id="marketing-banner"
      tabIndex={-1}
      className="fixed z-50 flex flex-col md:flex-row justify-between w-[calc(100%-2rem)] p-4 -translate-x-1/2 bg-white border border-gray-100 rounded-lg shadow-sm lg:max-w-7xl left-1/2 top-4 dark:bg-gray-700 dark:border-gray-600"
    >
      <div className="flex flex-col items-start mb-3 me-4 md:items-center md:flex-row md:mb-0">
        <Link
          to="/"
          className="flex items-center mb-2 border-gray-200 md:pe-4 md:me-4 md:border-e md:mb-0 dark:border-gray-600"
        >
          <img src={logoIcon} className="h-6 me-2" alt="Flowbite Logo" />
          <span className="self-center text-lg font-semibold whitespace-nowrap dark:text-white">
            PasteShare
          </span>
        </Link>
      </div>
      <div className="flex items-center flex-shrink-0">
        <a
          href="https://github.com/xiadd/pastebin-worker"
          target="_blank"
          rel="noopener noreferrer"
          className="w-6"
        >
          <img src={githubIcon} />
        </a>
      </div>
    </div>
  );
}
