import { createContext, useContext, useState, useEffect, useRef, type ReactNode } from 'react';
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
  
  const [offset, setOffset] = useState(() => {
    try {
      const saved = localStorage.getItem(`demetra_text_offset_${tKey}`);
      return saved ? JSON.parse(saved) : { x: 0, y: 0 };
    } catch {
      return { x: 0, y: 0 };
    }
  });

  const isDraggingRef = useRef(false);
  const startPosRef = useRef({ x: 0, y: 0 });

  const handleMouseDown = (e: React.MouseEvent) => {
    if (!isBuilder) return;
    if (e.altKey || e.shiftKey || e.button === 1) {
      e.preventDefault();
      e.stopPropagation();
      isDraggingRef.current = true;
      startPosRef.current = { x: e.clientX - offset.x, y: e.clientY - offset.y };
      
      const handleMouseMove = (moveEvent: MouseEvent) => {
         if (!isDraggingRef.current) return;
         const newX = moveEvent.clientX - startPosRef.current.x;
         const newY = moveEvent.clientY - startPosRef.current.y;
         setOffset({ x: newX, y: newY });
      };
      
      const handleMouseUp = (upEvent: MouseEvent) => {
         isDraggingRef.current = false;
         const finalX = upEvent.clientX - startPosRef.current.x;
         const finalY = upEvent.clientY - startPosRef.current.y;
         localStorage.setItem(`demetra_text_offset_${tKey}`, JSON.stringify({ x: finalX, y: finalY }));
         document.removeEventListener('mousemove', handleMouseMove);
         document.removeEventListener('mouseup', handleMouseUp);
         window.dispatchEvent(new Event('storage'));
      };
      
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    }
  };

  const transformStyle = offset.x || offset.y ? `translate(${offset.x}px, ${offset.y}px)` : undefined;

  if (!isBuilder) {
    return <span className={className} style={{ ...style, transform: transformStyle, display: transformStyle ? 'inline-block' : undefined }}>{(t as any)[tKey] || tKey}</span>;
  }

  const handleBlur = (e: React.FocusEvent<HTMLElement>) => {
    window.parent.postMessage({ type: 'DEMETRA_BUILDER', action: 'UPDATE_TEXT', key: tKey, value: e.target.innerText }, '*');
  };

  return (
    <span 
      className={className} 
      style={{ 
        ...style, 
        transform: transformStyle,
        outline: '1px dashed rgba(0,255,65,0.4)', 
        padding: '0.1em 0.2em', 
        cursor: 'text', 
        display: 'inline-block', 
        transition: isDraggingRef.current ? 'none' : '0.2s outline, 0.2s background',
        position: 'relative',
        zIndex: isDraggingRef.current ? 100 : 1
      }}
      contentEditable
      suppressContentEditableWarning
      onMouseDown={handleMouseDown}
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
      title="Alt + Drag to move text (Figma style)"
    >
      {(t as any)[tKey] || tKey}
    </span>
  );
}
