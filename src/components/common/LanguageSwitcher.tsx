'use client';

import { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import { useTranslation } from '@/i18n';
import { Language } from '@/types';
import { LANGUAGES } from '@/constants';

/**
 * Language Switcher Component
 * Template-style dropdown
 */
export default function LanguageSwitcher() {
  const { language, setLanguage } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLUListElement>(null);

  const languages = [
    { code: LANGUAGES.en, name: 'English', flag: '/assets/images/icons/en-us.png' },
    { code: LANGUAGES.tr, name: 'Türkçe', flag: '/assets/images/icons/en-us.png' }, // TODO: Add Turkish flag icon
  ];

  const currentLanguage = languages.find((lang) => lang.code === language) || languages[0];

  const handleLanguageChange = (lang: Language) => {
    setLanguage(lang);
    setIsOpen(false);
    // Reload page to apply language changes
    if (typeof window !== 'undefined') {
      window.location.reload();
    }
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  return (
    <ul className="rbt-dropdown-menu switcher-language" ref={dropdownRef}>
      <li className={`has-child-menu ${isOpen ? 'open' : ''}`}>
        <a href="#" onClick={(e) => { e.preventDefault(); setIsOpen(!isOpen); }}>
          <Image
            className="left-image"
            src={currentLanguage.flag}
            alt={currentLanguage.name}
            width={20}
            height={20}
          />
          <span className="menu-item">{currentLanguage.name}</span>
          <i className="right-icon feather-chevron-down"></i>
        </a>
        <ul className={`sub-menu ${isOpen ? 'open' : ''}`}>
          {languages.map((lang) => (
            <li key={lang.code}>
              <a
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  handleLanguageChange(lang.code);
                }}
              >
                <Image
                  className="left-image"
                  src={lang.flag}
                  alt={lang.name}
                  width={20}
                  height={20}
                />
                <span className="menu-item">{lang.name}</span>
              </a>
            </li>
          ))}
        </ul>
      </li>
    </ul>
  );
}

