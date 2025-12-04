'use client';

import { useTranslation } from '@/i18n';
import { Language } from '@/types';
import { LANGUAGES } from '@/constants';

/**
 * Language Switcher Component
 */
export default function LanguageSwitcher() {
  const { t, language, setLanguage } = useTranslation();

  const handleLanguageChange = (lang: Language) => {
    setLanguage(lang);
    // Reload page to apply language changes
    if (typeof window !== 'undefined') {
      window.location.reload();
    }
  };

  return (
    <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
      <span>{t('common.language') || 'Language'}:</span>
      <select
        value={language}
        onChange={(e) => handleLanguageChange(e.target.value as Language)}
        style={{
          padding: '8px 12px',
          borderRadius: '4px',
          border: '1px solid #ddd',
          cursor: 'pointer',
        }}
      >
        <option value={LANGUAGES.en}>English</option>
        <option value={LANGUAGES.tr}>Türkçe</option>
      </select>
    </div>
  );
}

