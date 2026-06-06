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
      const initialRect = (e.currentTarget as HTMLElement).getBoundingClientRect();
      const element = e.currentTarget as HTMLElement;
      
      const handleMouseMove = (moveEvent: MouseEvent) => {
         if (!isDraggingRef.current) return;
         const newX = moveEvent.clientX - startPosRef.current.x;
         const newY = moveEvent.clientY - startPosRef.current.y;
         setOffset({ x: newX, y: newY });

         const ghostRect = {
           left: initialRect.left + (newX - offset.x),
           top: initialRect.top + (newY - offset.y),
           right: initialRect.left + (newX - offset.x) + initialRect.width,
           bottom: initialRect.top + (newY - offset.y) + initialRect.height,
           width: initialRect.width,
           height: initialRect.height
         };
         drawGuidesForText(element, ghostRect);
      };
      
      const handleMouseUp = (upEvent: MouseEvent) => {
         isDraggingRef.current = false;
         const finalX = upEvent.clientX - startPosRef.current.x;
         const finalY = upEvent.clientY - startPosRef.current.y;
         localStorage.setItem(`demetra_text_offset_${tKey}`, JSON.stringify({ x: finalX, y: finalY }));
         document.removeEventListener('mousemove', handleMouseMove);
         document.removeEventListener('mouseup', handleMouseUp);
         
         const guidesContainer = document.getElementById('drag-guides-container');
         if (guidesContainer) {
           guidesContainer.remove();
         }
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

function drawGuidesForText(
  element: HTMLElement,
  ghostRect: { left: number; top: number; right: number; bottom: number; width: number; height: number }
) {
  let container = document.getElementById('drag-guides-container');
  if (!container) {
    container = document.createElement('div');
    container.id = 'drag-guides-container';
    container.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100vw;
      height: 100vh;
      pointer-events: none;
      z-index: 999998;
    `;
    document.body.appendChild(container);
  }
  container.innerHTML = '';

  const parentEl = element.parentElement;
  const parentRect = parentEl?.getBoundingClientRect() || {
    top: 0, bottom: window.innerHeight,
    left: 0, right: window.innerWidth,
    width: window.innerWidth, height: window.innerHeight
  };

  const targets = Array.from(document.querySelectorAll('.builder-wrapper, span[contenteditable]'))
    .filter(el => el !== element && !element.contains(el))
    .map(el => ({ el, rect: el.getBoundingClientRect() }))
    .filter(item => item.rect.width > 0 && item.rect.height > 0);

  const SNAP_THRESHOLD = 6;
  const snapColor = 'rgba(0, 200, 255, 0.9)';
  const measureColor = 'rgba(255, 75, 75, 0.85)';

  const makeLine = (x1: number, y1: number, x2: number, y2: number, color: string, direction: 'v' | 'h') => {
    const line = document.createElement('div');
    line.style.cssText = [
      'position:fixed', 'pointer-events:none',
      `background:${color}`,
      direction === 'v'
        ? `left:${x1}px;top:${Math.min(y1, y2)}px;width:1.5px;height:${Math.abs(y2 - y1)}px`
        : `left:${Math.min(x1, x2)}px;top:${y1}px;width:${Math.abs(x2 - x1)}px;height:1.5px`,
    ].join(';');
    container.appendChild(line);
  };

  const makeBadge = (text: string, x: number, y: number) => {
    const badge = document.createElement('div');
    badge.innerText = text;
    badge.style.cssText = `
      position:fixed;left:${x}px;top:${y}px;
      background:rgba(255,75,75,0.95);color:#fff;
      font-family:monospace;font-size:10px;font-weight:800;
      padding:2px 5px;border-radius:4px;
      transform:translate(-50%,-50%);white-space:nowrap;
      pointer-events:none;box-shadow:0 2px 6px rgba(0,0,0,.4);z-index:1000001;
    `;
    container.appendChild(badge);
  };

  const highlightEl = (rect: DOMRect, color = 'rgba(255,75,75,0.35)') => {
    const h = document.createElement('div');
    h.style.cssText = `
      position:fixed;left:${rect.left}px;top:${rect.top}px;
      width:${rect.width}px;height:${rect.height}px;
      border:1.5px solid ${color};border-radius:3px;
      pointer-events:none;box-sizing:border-box;
    `;
    container.appendChild(h);
  };

  const gTop = ghostRect.top;
  const gBot = ghostRect.bottom;
  const gMidY = ghostRect.top + ghostRect.height / 2;
  const gLeft = ghostRect.left;
  const gRight = ghostRect.right;
  const gMidX = ghostRect.left + ghostRect.width / 2;

  targets.forEach(({ rect }) => {
    const rTop = rect.top;
    const rBot = rect.bottom;
    const rMidY = rect.top + rect.height / 2;
    const rLeft = rect.left;
    const rRight = rect.right;
    const rMidX = rect.left + rect.width / 2;

    if (Math.abs(gTop - rTop) < SNAP_THRESHOLD) {
      highlightEl(rect, 'rgba(0,200,255,0.5)');
      makeLine(0, rTop, window.innerWidth, rTop, snapColor, 'h');
    }
    if (Math.abs(gBot - rBot) < SNAP_THRESHOLD) {
      highlightEl(rect, 'rgba(0,200,255,0.5)');
      makeLine(0, rBot, window.innerWidth, rBot, snapColor, 'h');
    }
    if (Math.abs(gMidY - rMidY) < SNAP_THRESHOLD) {
      highlightEl(rect, 'rgba(0,200,255,0.5)');
      makeLine(0, rMidY, window.innerWidth, rMidY, snapColor, 'h');
    }
    if (Math.abs(gLeft - rLeft) < SNAP_THRESHOLD) {
      highlightEl(rect, 'rgba(0,200,255,0.5)');
      makeLine(rLeft, 0, rLeft, window.innerHeight, snapColor, 'v');
    }
    if (Math.abs(gRight - rRight) < SNAP_THRESHOLD) {
      highlightEl(rect, 'rgba(0,200,255,0.5)');
      makeLine(rRight, 0, rRight, window.innerHeight, snapColor, 'v');
    }
    if (Math.abs(gMidX - rMidX) < SNAP_THRESHOLD) {
      highlightEl(rect, 'rgba(0,200,255,0.5)');
      makeLine(rMidX, 0, rMidX, window.innerHeight, snapColor, 'v');
    }
  });

  let closestAbove: any = null;
  let closestBelow: any = null;
  let closestLeft: any = null;
  let closestRight: any = null;

  targets.forEach(item => {
    const r = item.rect;
    const xOverlap = Math.max(0, Math.min(ghostRect.right, r.right) - Math.max(ghostRect.left, r.left)) > 0;
    const yOverlap = Math.max(0, Math.min(ghostRect.bottom, r.bottom) - Math.max(ghostRect.top, r.top)) > 0;

    if (xOverlap) {
      if (r.bottom <= gTop && (!closestAbove || r.bottom > closestAbove.rect.bottom)) closestAbove = item;
      if (r.top >= gBot && (!closestBelow || r.top < closestBelow.rect.top)) closestBelow = item;
    }
    if (yOverlap) {
      if (r.right <= gLeft && (!closestLeft || r.right > closestLeft.rect.right)) closestLeft = item;
      if (r.left >= gRight && (!closestRight || r.left < closestRight.rect.left)) closestRight = item;
    }
  });

  const addMeasure = (x1: number, y1: number, x2: number, y2: number, val: number, dir: 'v' | 'h') => {
    if (val <= 0) return;
    makeLine(x1, y1, x2, y2, measureColor, dir);
    makeBadge(`${val}px`, dir === 'v' ? x1 : (x1 + x2) / 2, dir === 'v' ? (y1 + y2) / 2 : y1);
  };

  if (closestAbove) {
    highlightEl(closestAbove.rect);
    addMeasure(gMidX, closestAbove.rect.bottom, gMidX, gTop, Math.round(gTop - closestAbove.rect.bottom), 'v');
  }
  if (closestBelow) {
    highlightEl(closestBelow.rect);
    addMeasure(gMidX, gBot, gMidX, closestBelow.rect.top, Math.round(closestBelow.rect.top - gBot), 'v');
  }
  if (closestLeft) {
    highlightEl(closestLeft.rect);
    addMeasure(closestLeft.rect.right, gMidY, gLeft, gMidY, Math.round(gLeft - closestLeft.rect.right), 'h');
  }
  if (closestRight) {
    highlightEl(closestRight.rect);
    addMeasure(gRight, gMidY, closestRight.rect.left, gMidY, Math.round(closestRight.rect.left - gRight), 'h');
  }
}
