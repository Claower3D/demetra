import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import { translations } from './i18n';

type Language = 'ru' | 'kk' | 'en';

interface LangContextType {
  lang: Language;
  setLang: (lang: Language) => void;
  t: typeof translations.ru;
}

const LangContext = createContext<LangContextType | undefined>(undefined);

export function LangProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Language>(() => {
    const saved = localStorage.getItem('demetra_lang');
    return (saved as Language) || 'ru';
  });

  const [dynamicTranslations, setDynamicTranslations] = useState(() => {
    try {
      const saved = localStorage.getItem('demetra_translations');
      if (saved) {
        const parsed = JSON.parse(saved);
        // Deep merge to ensure NEW keys (like admin_*) are present even if storage is old
        const merged = { ...translations };
        if (parsed.ru) merged.ru = { ...translations.ru, ...parsed.ru };
        if (parsed.kk) merged.kk = { ...translations.kk, ...parsed.kk };
        if (parsed.en) merged.en = { ...translations.en, ...parsed.en };
        return merged;
      }
    } catch (e) {
      console.error("Failed to parse translations", e);
    }
    return translations;
  });

  useEffect(() => {
    const handleStorageChange = () => {
      try {
        const saved = localStorage.getItem('demetra_translations');
        if (saved) {
          const parsed = JSON.parse(saved);
          setDynamicTranslations((prev: any) => {
             const merged = { ...translations };
             if (parsed.ru) merged.ru = { ...translations.ru, ...parsed.ru };
             if (parsed.kk) merged.kk = { ...translations.kk, ...parsed.kk };
             if (parsed.en) merged.en = { ...translations.en, ...parsed.en };
             return merged;
          });
        }
      } catch (e) {}
    };
    window.addEventListener('storage', handleStorageChange);
    
    const handleMessage = (e: MessageEvent) => {
      if (e.data?.type === 'DEMETRA_UPDATE_TRANSLATIONS') {
        setDynamicTranslations(e.data.translations);
      }
    };
    window.addEventListener('message', handleMessage);

    const interval = setInterval(handleStorageChange, 1000);
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('message', handleMessage);
      clearInterval(interval);
    };
  }, []);

  const setLang = (newLang: Language) => {
    setLangState(newLang);
    localStorage.setItem('demetra_lang', newLang);
  };

  const t = dynamicTranslations[lang];

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

export function InlineEdit({ tKey, className, style }: { tKey: string, className?: string, style?: any }) {
  const { t } = useLang();
  const isBuilder = window.self !== window.top;
  
  if (!isBuilder) {
    return <span className={className} style={style}>{(t as any)[tKey] || tKey}</span>;
  }

  const handleBlur = (e: React.FocusEvent<HTMLElement>) => {
    window.parent.postMessage({ type: 'DEMETRA_BUILDER', action: 'UPDATE_TEXT', key: tKey, value: e.target.innerText }, '*');
  };

  return (
    <span 
      className={className} 
      style={{ ...style, outline: '1px dashed rgba(0,255,65,0.4)', padding: '0.1em 0.2em', cursor: 'text', display: 'inline-block', transition: '0.2s' }}
      contentEditable
      suppressContentEditableWarning
      onBlur={handleBlur}
      onFocus={(e) => { 
        const target = e.target as HTMLElement;
        target.style.outline = '2px solid #00ff41'; 
        target.style.background = 'rgba(0,255,65,0.1)'; 
      }}
      onMouseLeave={(e) => { 
        const target = e.target as HTMLElement;
        if (document.activeElement !== target) { 
          target.style.outline = '1px dashed rgba(0,255,65,0.4)'; 
          target.style.background = 'transparent';
        } 
      }}
    >
      {(t as any)[tKey] || tKey}
    </span>
  );
}
