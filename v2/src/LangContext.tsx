import { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { translations, productsData, categories } from './i18n';

type Language = 'ru' | 'kk' | 'en';

interface LangContextType {
  lang: Language;
  setLang: (lang: Language) => void;
  t: typeof translations.ru;
}

const LangContext = createContext<LangContextType | undefined>(undefined);

export function LangProvider({ children }: { children: ReactNode }) {
  // Try to load language from localStorage
  const [lang, setLangState] = useState<Language>(() => {
    const saved = localStorage.getItem('demetra_lang');
    return (saved as Language) || 'ru';
  });

  const setLang = (newLang: Language) => {
    setLangState(newLang);
    localStorage.setItem('demetra_lang', newLang);
  };

  const t = translations[lang];

  return (
    <LangContext.Provider value={{ lang, setLang, t }}>
      {children}
    </LangContext.Provider>
  );
}

export function useLang() {
  const context = useContext(LangContext);
  if (!context) {
    throw new Error('useLang must be used within a LangProvider');
  }
  return context;
}
