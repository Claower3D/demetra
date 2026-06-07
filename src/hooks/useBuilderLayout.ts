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

  // Sync state when pageKey changes (crucial for React Router transitions without full page reload!)
  useEffect(() => {
    try {
      const saved = localStorage.getItem(`demetra_${pageKey}_layout`);
      if (saved && saved !== 'undefined') {
        setLayout(JSON.parse(saved));
      } else {
        setLayout(defaultLayout);
      }
    } catch (e) {
      setLayout(defaultLayout);
    }

    // Stale-While-Revalidate: fetch the fresh layout from Go backend in non-builder mode
    if (!isBuilder) {
      fetch(`/api/layout/${pageKey}`)
        .then(r => {
          if (!r.ok) throw new Error("Status " + r.status);
          return r.json();
        })
        .then(data => {
          if (data && typeof data === 'object') {
            setLayout(data);
            localStorage.setItem(`demetra_${pageKey}_layout`, JSON.stringify(data));
          }
        })
        .catch(e => console.warn(`Could not load fresh layout for ${pageKey}:`, e));
    }
  }, [pageKey, isBuilder]);

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

  useEffect(() => {
    if (!isBuilder) return;

    const handleDocumentDragOver = (e: DragEvent) => {
      e.preventDefault();
    };

    const handleDocumentDrop = (e: DragEvent) => {
      if (e.defaultPrevented) return;
      
      const raw = e.dataTransfer?.getData('text/plain');
      if (raw && raw.startsWith('add_block:')) {
        e.preventDefault();
        const type = raw.replace('add_block:', '');
        window.parent.postMessage({
          type: 'DEMETRA_BUILDER',
          action: 'ADD_BLOCK_AT',
          blockType: type,
          targetId: 'order',
          arrayKey: 'order'
        }, '*');
      }
    };

    document.addEventListener('dragover', handleDocumentDragOver);
    document.addEventListener('drop', handleDocumentDrop);
    return () => {
      document.removeEventListener('dragover', handleDocumentDragOver);
      document.removeEventListener('drop', handleDocumentDrop);
    };
  }, [isBuilder]);

  return { layout, isBuilder };
}
