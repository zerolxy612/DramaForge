'use client';

import { useLanguage } from '@/lib/i18n/LanguageContext';
import { Language } from '@/lib/i18n/landing';

const languages: { code: Language; label: string }[] = [
  { code: 'en', label: 'EN' },
  { code: 'zh-CN', label: '简' },
  { code: 'zh-TW', label: '繁' },
];

export function LanguageSwitcher() {
  const { language, setLanguage } = useLanguage();

  return (
    <div className="flex gap-1 rounded-full border border-white/20 p-1 bg-black/30 backdrop-blur-sm">
      {languages.map((lang) => (
        <button
          key={lang.code}
          onClick={() => setLanguage(lang.code)}
          className={`
            px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-300
            ${
              language === lang.code
                ? 'bg-accent text-white shadow-[0_0_20px_rgba(229,9,20,0.4)]'
                : 'text-white/60 hover:text-white hover:bg-white/10'
            }
          `}
        >
          {lang.label}
        </button>
      ))}
    </div>
  );
}

