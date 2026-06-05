import { useState, useEffect } from 'react';

export function useBuilderLayout(pageKey: string, defaultLayout: any) {
  const isBuilder = window.self !== window.top;

  const [layout, setLayout] = useState(() => {
    try {
      const saved = localStorage.getItem(`demetra_${pageKey}_layout`);
      if (saved && saved !== 'undefined') {
        const parsed = JSON.parse(saved);
        return parsed || defaultLayout;
      }
    } catch (e) {
      console.error("Layout parse error", e);
    }
    return defaultLayout;
  });

  useEffect(() => {
    if (isBuilder) {
      document.body.classList.add('builder-mode');
    } else {
      document.body.classList.remove('builder-mode');
    }

    const handleMessage = (e: MessageEvent) => {
      if (e.data?.type === 'DEMETRA_UPDATE_LAYOUT') {
        const incoming = e.data.layout;
        setLayout((prev: any) => {
          // Deep merge: incoming takes priority but we keep any extra keys from prev
          const merged = {
            ...prev,
            ...incoming,
            styles: { ...(prev?.styles || {}), ...(incoming?.styles || {}) },
            images: { ...(prev?.images || {}), ...(incoming?.images || {}) },
            links: { ...(prev?.links || {}), ...(incoming?.links || {}) },
            items: { ...(prev?.items || {}), ...(incoming?.items || {}) },
          };
          localStorage.setItem(`demetra_${pageKey}_layout`, JSON.stringify(merged));
          return merged;
        });
      }
    };
    window.addEventListener('message', handleMessage);
    return () => {
      window.removeEventListener('message', handleMessage);
      document.body.classList.remove('builder-mode');
    };
  }, [pageKey, isBuilder]);

  return { layout, isBuilder };
}
