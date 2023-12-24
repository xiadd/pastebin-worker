import { useState } from 'react';
import { Link } from 'wouter';
import { useTranslation } from 'react-i18next';
import Dropdown from 'rc-dropdown';
import Menu, { Item as MenuItem } from 'rc-menu';
import 'rc-dropdown/assets/index.css';

import logoIcon from '../assets/logo.svg';
import githubIcon from '../assets/github.svg';
import localeIcon from '../assets/locale.svg';

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
      <div className="flex me-4 items-center flex-row mb-0">
        <Link
          to="/"
          className="flex items-center border-gray-200 md:pe-4 md:me-4 md:border-e md:mb-0 dark:border-gray-600"
        >
          <img src={logoIcon} className="h-6 me-2" alt="Flowbite Logo" />
          <span className="self-center text-lg font-semibold whitespace-nowrap dark:text-white">
            PasteShare
          </span>
        </Link>

        <div className="flex">
          <Link
            to="/tutorial"
            className="py-2 px-4 text-sm font-medium text-gray-500 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
          >
            {t('tutorial')}
          </Link>
        </div>
      </div>
      <div className="flex items-center flex-shrink-0 gap-2">
        <a
          href="https://github.com/xiadd/pastebin-worker"
          target="_blank"
          rel="noopener noreferrer"
          className="w-6"
        >
          <img src={githubIcon} />
        </a>

        <Dropdown
          overlay={
            <Menu className="z-10 bg-white divide-y divide-gray-100 rounded-lg !shadow dark:bg-gray-700 !border-0">
              <MenuItem key="1">
                <button
                  onClick={() => handleChangeLanguage('en')}
                  className="block w-full px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
                >
                  English
                </button>
              </MenuItem>
              <MenuItem key="2">
                <button
                  onClick={() => handleChangeLanguage('zh')}
                  className="block w-full px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
                >
                  中文
                </button>
              </MenuItem>
            </Menu>
          }
          trigger={['click']}
        >
          <button className="flex gap-2">
            <img src={localeIcon} className="w-6" />
            {t(i18n.language)}
          </button>
        </Dropdown>
      </div>
    </div>
  );
}
