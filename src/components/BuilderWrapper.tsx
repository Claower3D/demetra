import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MoveUp, MoveDown, Trash, Settings, Layers, Plus, Edit3, Image as ImageIcon } from 'lucide-react';

// Global drag state – only one element can be dragged at a time
const dragState = {
  draggingId: null as string | null,
  startX: 0,
  startY: 0,
};

export function BuilderWrapper({ children, id, index, isFirst, isLast, isBuilder, arrayKey = 'order', style = {} }: any) {
  const [isHovered, setIsHovered] = useState(false);
  const [isDraggingOver, setIsDraggingOver] = useState(false);
  const [contextMenu, setContextMenu] = useState<{x: number, y: number} | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [dragSize, setDragSize] = useState<{gridColumn?: string, gridRow?: string, width?: string, height?: string} | null>(null);
  const [isDraggingThis, setIsDraggingThis] = useState(false);
  
  const getPageKey = () => {
    const path = window.location.pathname;
    if (path.includes('/about')) return 'about';
    if (path.includes('/services')) return 'services';
    if (path.includes('/catalog')) return 'catalog';
    if (path.includes('/contacts')) return 'contacts';
    if (path.includes('/faq')) return 'faq';
    if (path.includes('/gallery')) return 'gallery';
    if (path.includes('/pay')) return 'pay';
    if (path.includes('/partner')) return 'partner';
    return 'home';
  };

  const [localStyle, setLocalStyle] = useState(style);

  useEffect(() => {
    setLocalStyle(style);
  }, [style]);

  useEffect(() => {
    const syncStyle = () => {
      try {
        const pageKey = getPageKey();
        const saved = localStorage.getItem(`demetra_${pageKey}_layout`);
        if (saved) {
          const layout = JSON.parse(saved);
          const blockStyle = layout?.styles?.[id];
          if (blockStyle) {
            setLocalStyle(blockStyle);
          }
        }
      } catch (e) {
        console.error("Failed to sync style in BuilderWrapper", e);
      }
    };

    syncStyle();
    window.addEventListener('storage', syncStyle);
    window.addEventListener('message', syncStyle);
    return () => {
      window.removeEventListener('storage', syncStyle);
      window.removeEventListener('message', syncStyle);
    };
  }, [id, style]);

  useEffect(() => {
    const handleClickOutside = () => setContextMenu(null);
    window.addEventListener('click', handleClickOutside);
    window.addEventListener('scroll', handleClickOutside);
    return () => {
       window.removeEventListener('click', handleClickOutside);
       window.removeEventListener('scroll', handleClickOutside);
    };
  }, []);

  const postMsg = (action: string, payload?: any) => {
    window.parent.postMessage({ type: 'DEMETRA_BUILDER', action, id, index, arrayKey, ...payload }, '*');
    setContextMenu(null);
  };

  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setContextMenu({ x: e.clientX, y: e.clientY });
  };

  // ─── MOUSE-BASED DRAG (instead of HTML5 drag) ──────────────────────────────
  // This approach gives us full control: only the element where mousedown fires
  // will be dragged, parent wrappers are completely unaffected.
  const ghostRef = useRef<HTMLElement | null>(null);
  const isDraggingRef = useRef(false);
  const dragMoved = useRef(false);

  const handleMouseDown = (e: React.MouseEvent) => {
    if (!isBuilder) return;

    const target = e.target as HTMLElement;
    // Don't intercept clicks on interactive controls or contentEditable
    if (
      target.closest('input') ||
      target.closest('button') ||
      target.closest('select') ||
      target.closest('textarea') ||
      target.isContentEditable ||
      target.closest('.floating-assistant-container')
    ) {
      return;
    }

    // Only allow dragging from the green label/toolbar area (top-left corner)
    // or from empty space directly on this wrapper (not a deeper nested .builder-wrapper)
    const deepestWrapper = (e.target as HTMLElement).closest('.builder-wrapper');
    if (deepestWrapper !== containerRef.current) {
      // Mouse is over a CHILD builder-wrapper – let that child handle it
      return;
    }

    e.stopPropagation();

    const startX = e.clientX;
    const startY = e.clientY;
    dragMoved.current = false;
    isDraggingRef.current = false;
    dragState.draggingId = null;
    dragState.startX = startX;
    dragState.startY = startY;
    
    // Capture initial rect BEFORE any movement
    const initialRect = containerRef.current?.getBoundingClientRect();

    const SNAP_THRESHOLD = 6; // px tolerance for alignment detection

    const drawGuides = (ghostRect: any) => {
      const container = document.getElementById('drag-guides-container');
      if (!container) return;
      container.innerHTML = '';

      const parentEl = containerRef.current?.parentElement;
      const parentRect = parentEl?.getBoundingClientRect() || {
        top: 0, bottom: window.innerHeight,
        left: 0, right: window.innerWidth,
        width: window.innerWidth, height: window.innerHeight
      };

      const wrappers = Array.from(document.querySelectorAll('.builder-wrapper'))
        .filter(el => el !== containerRef.current && !(ghostRef.current?.contains(el as Node)))
        .map(el => ({ el, rect: el.getBoundingClientRect() }))
        .filter(item => item.rect.width > 0 && item.rect.height > 0);

      // ── Helpers ────────────────────────────────────────────────────
      const makeLine = (
        x1: number, y1: number, x2: number, y2: number,
        color: string, direction: 'v' | 'h'
      ) => {
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

      // ── 1. ALIGNMENT SNAP LINES (Figma-style) ──────────────────────
      // Check if ghost edges/center align with any other element
      const ghostTop    = ghostRect.top;
      const ghostBot    = ghostRect.bottom;
      const ghostMidY   = ghostRect.top + ghostRect.height / 2;
      const ghostLeft   = ghostRect.left;
      const ghostRight  = ghostRect.right;
      const ghostMidX   = ghostRect.left + ghostRect.width / 2;

      const snapColor = 'rgba(0,200,255,0.9)'; // cyan for snap lines

      wrappers.forEach(({ rect }) => {
        const rTop  = rect.top;
        const rBot  = rect.bottom;
        const rMidY = rect.top + rect.height / 2;
        const rLeft = rect.left;
        const rRight = rect.right;
        const rMidX = rect.left + rect.width / 2;

        // Horizontal alignment: same top
        if (Math.abs(ghostTop - rTop) < SNAP_THRESHOLD) {
          highlightEl(rect, 'rgba(0,200,255,0.5)');
          const y = rTop;
          makeLine(0, y, window.innerWidth, y, snapColor, 'h');
        }
        // Horizontal alignment: same bottom
        if (Math.abs(ghostBot - rBot) < SNAP_THRESHOLD) {
          highlightEl(rect, 'rgba(0,200,255,0.5)');
          const y = rBot;
          makeLine(0, y, window.innerWidth, y, snapColor, 'h');
        }
        // Horizontal alignment: same center Y
        if (Math.abs(ghostMidY - rMidY) < SNAP_THRESHOLD) {
          highlightEl(rect, 'rgba(0,200,255,0.5)');
          const y = rMidY;
          makeLine(0, y, window.innerWidth, y, snapColor, 'h');
        }
        // Vertical alignment: same left
        if (Math.abs(ghostLeft - rLeft) < SNAP_THRESHOLD) {
          highlightEl(rect, 'rgba(0,200,255,0.5)');
          const x = rLeft;
          makeLine(x, 0, x, window.innerHeight, snapColor, 'v');
        }
        // Vertical alignment: same right
        if (Math.abs(ghostRight - rRight) < SNAP_THRESHOLD) {
          highlightEl(rect, 'rgba(0,200,255,0.5)');
          const x = rRight;
          makeLine(x, 0, x, window.innerHeight, snapColor, 'v');
        }
        // Vertical alignment: same center X
        if (Math.abs(ghostMidX - rMidX) < SNAP_THRESHOLD) {
          highlightEl(rect, 'rgba(0,200,255,0.5)');
          const x = rMidX;
          makeLine(x, 0, x, window.innerHeight, snapColor, 'v');
        }
      });

      // ── 2. SPACING MEASUREMENT LINES (red, existing logic) ─────────
      let closestAbove: any = null;
      let closestBelow: any = null;
      let closestLeft: any  = null;
      let closestRight: any = null;

      wrappers.forEach(item => {
        const r = item.rect;
        const xOverlap = Math.max(0, Math.min(ghostRect.right, r.right) - Math.max(ghostRect.left, r.left)) > 0;
        const yOverlap = Math.max(0, Math.min(ghostRect.bottom, r.bottom) - Math.max(ghostRect.top, r.top)) > 0;

        if (xOverlap) {
          if (r.bottom <= ghostRect.top && (!closestAbove || r.bottom > closestAbove.rect.bottom))
            closestAbove = item;
          if (r.top >= ghostRect.bottom && (!closestBelow || r.top < closestBelow.rect.top))
            closestBelow = item;
        }
        if (yOverlap) {
          if (r.right <= ghostRect.left && (!closestLeft || r.right > closestLeft.rect.right))
            closestLeft = item;
          if (r.left >= ghostRect.right && (!closestRight || r.left < closestRight.rect.left))
            closestRight = item;
        }
      });

      const redLine = 'rgba(255,75,75,0.85)';
      const midX = ghostRect.left + ghostRect.width / 2;
      const midY = ghostRect.top  + ghostRect.height / 2;

      const addMeasure = (x1: number, y1: number, x2: number, y2: number,
                          val: number, dir: 'v' | 'h') => {
        if (val <= 0) return;
        makeLine(x1, y1, x2, y2, redLine, dir);
        makeBadge(
          `${val}px`,
          dir === 'v' ? x1 : (x1 + x2) / 2,
          dir === 'v' ? (y1 + y2) / 2 : y1
        );
      };

      if (closestAbove) {
        highlightEl(closestAbove.rect);
        addMeasure(midX, closestAbove.rect.bottom, midX, ghostRect.top,
          Math.round(ghostRect.top - closestAbove.rect.bottom), 'v');
      } else {
        addMeasure(midX, parentRect.top, midX, ghostRect.top,
          Math.round(ghostRect.top - parentRect.top), 'v');
      }
      if (closestBelow) {
        highlightEl(closestBelow.rect);
        addMeasure(midX, ghostRect.bottom, midX, closestBelow.rect.top,
          Math.round(closestBelow.rect.top - ghostRect.bottom), 'v');
      } else {
        addMeasure(midX, ghostRect.bottom, midX, parentRect.bottom,
          Math.round(parentRect.bottom - ghostRect.bottom), 'v');
      }
      if (closestLeft) {
        highlightEl(closestLeft.rect);
        addMeasure(closestLeft.rect.right, midY, ghostRect.left, midY,
          Math.round(ghostRect.left - closestLeft.rect.right), 'h');
      } else {
        addMeasure(parentRect.left, midY, ghostRect.left, midY,
          Math.round(ghostRect.left - parentRect.left), 'h');
      }
      if (closestRight) {
        highlightEl(closestRight.rect);
        addMeasure(ghostRect.right, midY, closestRight.rect.left, midY,
          Math.round(closestRight.rect.left - ghostRect.right), 'h');
      } else {
        addMeasure(ghostRect.right, midY, parentRect.right, midY,
          Math.round(parentRect.right - ghostRect.right), 'h');
      }
    };

    const onMouseMove = (me: MouseEvent) => {
      const dx = me.clientX - startX;
      const dy = me.clientY - startY;

      if (!isDraggingRef.current && (Math.abs(dx) > 5 || Math.abs(dy) > 5)) {
        // Threshold exceeded – start dragging
        isDraggingRef.current = true;
        dragMoved.current = true;
        dragState.draggingId = id;
        setIsDraggingThis(true);

        // Create a semi-transparent ghost clone using the initial rect
        const el = containerRef.current;
        if (!el || !initialRect) return;
        const clone = el.cloneNode(true) as HTMLElement;
        clone.style.cssText = `
          position: fixed;
          left: ${initialRect.left}px;
          top: ${initialRect.top}px;
          width: ${initialRect.width}px;
          height: ${initialRect.height}px;
          opacity: 0.55;
          pointer-events: none;
          z-index: 999999;
          border: 2px dashed #00ff41;
          border-radius: 8px;
          transform: scale(1.03);
          box-shadow: 0 10px 40px rgba(0,0,0,0.5);
          transition: none;
        `;
        // Remove inner edit overlays from ghost
        clone.querySelectorAll('.builder-wrapper-toolbar, button, .builder-wrapper').forEach(n => {
          (n as HTMLElement).style.display = 'none';
        });
        document.body.appendChild(clone);
        ghostRef.current = clone;

        // Create guides container
        let guidesContainer = document.getElementById('drag-guides-container');
        if (!guidesContainer) {
          guidesContainer = document.createElement('div');
          guidesContainer.id = 'drag-guides-container';
          guidesContainer.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100vw;
            height: 100vh;
            pointer-events: none;
            z-index: 999998;
          `;
          document.body.appendChild(guidesContainer);
        }
      }

      if (isDraggingRef.current && ghostRef.current && initialRect) {
        // Move ghost by the same delta from its original position
        const newLeft = initialRect.left + dx;
        const newTop = initialRect.top + dy;
        ghostRef.current.style.left = `${newLeft}px`;
        ghostRef.current.style.top = `${newTop}px`;

        const ghostRect = {
          left: newLeft,
          top: newTop,
          right: newLeft + initialRect.width,
          bottom: newTop + initialRect.height,
          width: initialRect.width,
          height: initialRect.height
        };
        drawGuides(ghostRect);
      }
    };

    const onMouseUp = (ue: MouseEvent) => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);

      // Remove ghost and guides container
      if (ghostRef.current) {
        ghostRef.current.remove();
        ghostRef.current = null;
      }
      const guidesContainer = document.getElementById('drag-guides-container');
      if (guidesContainer) {
        guidesContainer.remove();
      }

      setIsDraggingThis(false);

      if (!isDraggingRef.current) {
        // It was a click – open modal
        const clickTarget = ue.target as HTMLElement;
        if (
          !clickTarget.isContentEditable &&
          !clickTarget.closest('input') &&
          !clickTarget.closest('button') &&
          !clickTarget.closest('select') &&
          !clickTarget.closest('textarea') &&
          !clickTarget.closest('.floating-assistant-container')
        ) {
          postMsg('OPEN_MODAL', { tab: 'content' });
        }
        dragState.draggingId = null;
        isDraggingRef.current = false;
        return;
      }

      isDraggingRef.current = false;

      // Find the drop target: walk up from the element under cursor
      // (ghost is already removed, so elementFromPoint returns page content)
      let el = document.elementFromPoint(ue.clientX, ue.clientY);
      let dropWrapper: HTMLElement | null = null;
      while (el && el !== document.body) {
        if ((el as HTMLElement).hasAttribute?.('data-builder-id')) {
          dropWrapper = el as HTMLElement;
          break;
        }
        el = (el as HTMLElement).parentElement;
      }

      if (dropWrapper) {
        const targetId = dropWrapper.getAttribute('data-builder-id');
        // Use the TARGET's arrayKey so Admin.tsx looks up the correct list
        const targetArrKey = dropWrapper.getAttribute('data-array-key') || arrayKey;
        if (targetId && targetId !== id) {
          window.parent.postMessage({
            type: 'DEMETRA_BUILDER',
            action: 'MOVE_BLOCK_TO',
            id,
            index,
            // Admin reads e.data.arrayKey – send the shared array key
            // Both dragged and target must be in the same array
            arrayKey: targetArrKey,
            draggedId: id,
            targetId,
          }, '*');
        }
      }

      dragState.draggingId = null;
    };

    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);
  };
  // ─────────────────────────────────────────────────────────────────────────────

  const handleDragOver = (e: React.DragEvent) => {
    // Keep native drag-over for library blocks dragged from the sidebar
    e.preventDefault();
    e.stopPropagation();
    const data = e.dataTransfer.types.includes('text/plain');
    if (data) setIsDraggingOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.stopPropagation();
    setIsDraggingOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDraggingOver(false);
    const draggedId = e.dataTransfer.getData("text/plain");
    if (draggedId) {
      if (draggedId.startsWith("add_block:")) {
        const type = draggedId.replace("add_block:", "");
        postMsg('ADD_BLOCK_AT', { type, targetId: id, arrayKey });
      }
    }
  };

  const handleResizeStart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!containerRef.current) return;
    const startX = e.clientX;
    const startY = e.clientY;
    const startWidth = containerRef.current.offsetWidth;
    const startHeight = containerRef.current.offsetHeight;

    const parentWidth = containerRef.current.parentElement?.offsetWidth || window.innerWidth;
    const colWidth = parentWidth / 12;

    const onMouseMove = (moveEvent: MouseEvent) => {
      const deltaX = moveEvent.clientX - startX;
      const deltaY = moveEvent.clientY - startY;
      
      const finalW = `${Math.max(50, startWidth + deltaX)}px`;
      const finalH = `${Math.max(30, startHeight + deltaY)}px`;
      
      const newColSpan = Math.max(1, Math.min(12, Math.round((startWidth + deltaX) / colWidth)));
      const newRowSpan = Math.max(1, Math.round((startHeight + deltaY) / 100));
      
      setDragSize({
        width: finalW,
        height: finalH,
        gridColumn: `span ${newColSpan}`,
        gridRow: `span ${newRowSpan}`
      });
    };

    const onMouseUp = (upEvent: MouseEvent) => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
      
      const deltaX = upEvent.clientX - startX;
      const deltaY = upEvent.clientY - startY;
      
      const finalW = `${Math.max(50, startWidth + deltaX)}px`;
      const finalH = `${Math.max(30, startHeight + deltaY)}px`;
      
      const finalColSpan = Math.max(1, Math.min(12, Math.round((startWidth + deltaX) / colWidth)));
      const finalRowSpan = Math.max(1, Math.round((startHeight + deltaY) / 100));
      
      postMsg('UPDATE_STYLE', { 
        styles: { 
          width: finalW, 
          height: finalH,
          gridColumn: `span ${finalColSpan}`, 
          gridRow: `span ${finalRowSpan}`
        } 
      });
      setDragSize(null);
    };

    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);
  };

  // ── Hover: only the DEEPEST wrapper directly under mouse gets highlighted ──
  const handleMouseOver = (e: React.MouseEvent) => {
    if (!isBuilder) return;
    e.stopPropagation();
    // The deepest .builder-wrapper the mouse is currently inside
    const deepestWrapper = (e.target as HTMLElement).closest('.builder-wrapper');
    if (deepestWrapper === containerRef.current) {
      setIsHovered(true);
    }
    // Parent wrappers: they receive this event but deepestWrapper !== them, so they skip
  };

  const handleMouseOut = (e: React.MouseEvent) => {
    if (!isBuilder) return;
    e.stopPropagation();
    setIsHovered(false);
  };
  // ─────────────────────────────────────────────────────────────────────────────

  const mergedStyle = { ...(localStyle || {}), ...(style || {}) };

  return (
    <div 
      ref={containerRef}
      className="builder-wrapper"
      data-builder-id={isBuilder ? id : undefined}
      data-array-key={isBuilder ? arrayKey : undefined}
      onMouseOver={isBuilder ? handleMouseOver : undefined} 
      onMouseOut={isBuilder ? handleMouseOut : undefined}
      onContextMenu={isBuilder ? handleContextMenu : undefined}
      onMouseDown={isBuilder ? handleMouseDown : undefined}
      // Keep native drag only for library-sidebar items
      onDragOver={isBuilder ? handleDragOver : undefined}
      onDragLeave={isBuilder ? handleDragLeave : undefined}
      onDrop={isBuilder ? handleDrop : undefined}
      style={{ 
        position: 'relative', 
        border: isBuilder 
          ? (isDraggingOver 
              ? '2px dashed #00ff41' 
              : (isHovered ? '2px solid #00ff41' : '2px solid transparent'))
          : 'none',
        boxShadow: (isBuilder && isDraggingOver) ? '0 0 25px rgba(0, 255, 65, 0.4)' : 'none',
        transition: dragSize ? 'none' : 'all 0.15s ease', 
        gridColumn: dragSize?.gridColumn || mergedStyle?.gridColumn || 'span 12',
        gridRow: dragSize?.gridRow || mergedStyle?.gridRow || 'auto',
        width: dragSize?.width || mergedStyle?.width || (id?.startsWith('btn_') ? 'fit-content' : '100%'), 
        height: dragSize?.height || mergedStyle?.height || (id?.startsWith('btn_') ? 'auto' : '100%'), 
        boxSizing: 'border-box',
        cursor: isBuilder ? 'grab' : 'default',
        background: mergedStyle?.background || 'transparent',
        padding: mergedStyle?.padding || '0px',
        borderRadius: mergedStyle?.borderRadius || '0px',
        opacity: (mergedStyle?.opacity !== undefined ? mergedStyle.opacity : 1) * (isDraggingThis ? 0.4 : 1),
        transform: mergedStyle?.transform || 'none',
        marginTop: mergedStyle?.marginTop || undefined,
        marginBottom: mergedStyle?.marginBottom || undefined,
        paddingTop: mergedStyle?.paddingTop || undefined,
        paddingBottom: mergedStyle?.paddingBottom || undefined,
        paddingLeft: mergedStyle?.paddingLeft || undefined,
        paddingRight: mergedStyle?.paddingRight || undefined,
        backgroundColor: mergedStyle?.backgroundColor || undefined,
        userSelect: 'none',
      }}
    >
       {/* Hover toolbar */}
       <AnimatePresence>
         {isBuilder && isHovered && !dragSize && !contextMenu && (
           <motion.div 
             className="builder-wrapper-toolbar"
             initial={{ opacity: 0, y: -10 }} 
             animate={{ opacity: 1, y: 0 }}
             exit={{ opacity: 0, y: -10 }}
             style={{ 
               position: 'absolute', 
               top: '4px', 
               left: '4px', 
               display: 'flex', 
               alignItems: 'center', 
               gap: '6px', 
               zIndex: 99999, 
               background: '#00ff41', 
               padding: '4px 8px', 
               borderRadius: '6px',
               boxShadow: '0 2px 10px rgba(0, 0, 0, 0.4)',
               pointerEvents: 'all',
             }}
             onMouseDown={(e) => e.stopPropagation()}
           >
             <span style={{ color: '#000', fontSize: '0.65rem', fontWeight: '900', textTransform: 'uppercase', marginRight: '4px', cursor: 'default' }}>
               {id.startsWith('nested_') ? 'Элемент' : id}
             </span>
             
             {/* Edit */}
             <button 
               onMouseDown={(e) => e.stopPropagation()}
               onClick={(e) => { e.stopPropagation(); postMsg('OPEN_MODAL', { tab: 'content' }); }}
               title="Редактировать"
               style={{ background: 'rgba(0,0,0,0.15)', border: 'none', color: '#000', cursor: 'pointer', display: 'flex', alignItems: 'center', padding: '3px 5px', borderRadius: '4px' }}
             >
               <Settings size={10} />
             </button>

             {/* Delete */}
             <button 
               onMouseDown={(e) => e.stopPropagation()}
               onClick={(e) => {
                 e.stopPropagation();
                 if (id.startsWith('nested_')) {
                   const parentId = arrayKey.replace('nested:', '');
                   window.parent.postMessage({ type: 'DEMETRA_BUILDER', action: 'DELETE_NESTED', id: parentId, nestedId: id }, '*');
                 } else {
                   postMsg('REMOVE_BLOCK');
                 }
               }}
               title="Удалить"
               style={{ background: 'rgba(200,0,0,0.15)', border: 'none', color: '#c00', cursor: 'pointer', display: 'flex', alignItems: 'center', padding: '3px 5px', borderRadius: '4px' }}
             >
               <Trash size={10} />
             </button>
           </motion.div>
         )}
       </AnimatePresence>
       
       {/* Content */}
       <div
         style={{ width: '100%', height: '100%', opacity: isBuilder && isHovered && !dragSize && !contextMenu ? 0.75 : 1, transition: '0.2s' }}
       >
         {children}
       </div>

       {/* Resize handle */}
       {isBuilder && isHovered && !contextMenu && (
         <div 
           onMouseDown={handleResizeStart}
           style={{
             position: 'absolute',
             bottom: '-6px',
             right: '-6px',
             width: '16px',
             height: '16px',
             background: '#00ff41',
             border: '2px solid #000',
             borderRadius: '50%',
             cursor: 'nwse-resize',
             zIndex: 200,
             boxShadow: '0 0 10px rgba(0,255,65,0.5)'
           }}
         />
       )}

       {/* Add block below */}
       {isBuilder && isHovered && !contextMenu && (
         <button
           onMouseDown={(e) => e.stopPropagation()}
           onClick={() => postMsg('ADD_BLOCK_AFTER')}
           style={{
             position: 'absolute',
             bottom: '-25px',
             left: '50%',
             transform: 'translateX(-50%)',
             width: '30px',
             height: '30px',
             background: '#00ff41',
             border: 'none',
             borderRadius: '50%',
             color: '#000',
             display: 'flex',
             alignItems: 'center',
             justifyContent: 'center',
             cursor: 'pointer',
             zIndex: 500,
             boxShadow: '0 5px 15px rgba(0,255,65,0.3)'
           }}
         >
           <Plus size={16} />
         </button>
       )}

       {/* Right-Click Context Menu */}
       {isBuilder && contextMenu && (
         <div style={{
           position: 'fixed', left: Math.min(contextMenu.x, window.innerWidth - 200), top: Math.min(contextMenu.y, window.innerHeight - 250),
           background: '#111', border: '1px solid #333', padding: '0.5rem', borderRadius: '8px', display: 'flex', flexDirection: 'column', gap: '0.25rem', zIndex: 99999, boxShadow: '0 10px 40px rgba(0,0,0,0.8)', minWidth: '180px'
         }}>
            <div style={{ padding: '0.5rem', fontSize: '0.7rem', color: '#00ff41', fontWeight: '900', borderBottom: '1px solid #222', marginBottom: '0.25rem', letterSpacing: '0.05em' }}>БЛОК: {id.toUpperCase()}</div>
            <button onMouseDown={(e) => e.stopPropagation()} onClick={() => postMsg('OPEN_MODAL', { tab: 'content' })} style={{ background: 'none', border: 'none', color: '#fff', textAlign: 'left', padding: '0.75rem 1rem', cursor: 'pointer', borderRadius: '4px', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }} onMouseEnter={(e) => e.currentTarget.style.background = '#222'} onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}><Edit3 size={14} style={{ color: '#00ff41' }} /> 📝 Редактировать инфо</button>
             <button onMouseDown={(e) => e.stopPropagation()} onClick={() => postMsg('OPEN_MODAL', { tab: 'media' })} style={{ background: 'none', border: 'none', color: '#fff', textAlign: 'left', padding: '0.75rem 1rem', cursor: 'pointer', borderRadius: '4px', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }} onMouseEnter={(e) => e.currentTarget.style.background = '#222'} onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}><ImageIcon size={14} style={{ color: '#00ff41' }} /> 🖼️ Добавить фото/видео</button>
            <button onMouseDown={(e) => e.stopPropagation()} onClick={() => postMsg('OPEN_MODAL', { tab: 'scaling' })} style={{ background: 'none', border: 'none', color: '#fff', textAlign: 'left', padding: '0.75rem 1rem', cursor: 'pointer', borderRadius: '4px', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }} onMouseEnter={(e) => e.currentTarget.style.background = '#222'} onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}><Layers size={14} style={{ color: '#00ff41' }} /> 📐 Масштаб & Размеры</button>
            <div style={{ height: '1px', background: '#333', margin: '0.25rem 0' }}></div>
            {index !== undefined && <button onMouseDown={(e) => e.stopPropagation()} onClick={() => postMsg('MOVE_UP')} disabled={isFirst} style={{ background: 'none', border: 'none', color: isFirst ? '#444' : '#fff', textAlign: 'left', padding: '0.75rem 1rem', cursor: isFirst ? 'default' : 'pointer', borderRadius: '4px', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }} onMouseEnter={(e) => { if(!isFirst) e.currentTarget.style.background = '#222'}} onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}><MoveUp size={14} /> Переместить выше</button>}
            {index !== undefined && <button onMouseDown={(e) => e.stopPropagation()} onClick={() => postMsg('MOVE_DOWN')} disabled={isLast} style={{ background: 'none', border: 'none', color: isLast ? '#444' : '#fff', textAlign: 'left', padding: '0.75rem 1rem', cursor: isLast ? 'default' : 'pointer', borderRadius: '4px', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }} onMouseEnter={(e) => { if(!isLast) e.currentTarget.style.background = '#222'}} onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}><MoveDown size={14} /> Переместить ниже</button>}
            <div style={{ height: '1px', background: '#333', margin: '0.25rem 0' }}></div>
            <button onMouseDown={(e) => e.stopPropagation()} onClick={() => postMsg('REMOVE_BLOCK')} style={{ background: 'none', border: 'none', color: '#ff4b4b', textAlign: 'left', padding: '0.75rem 1rem', cursor: 'pointer', borderRadius: '4px', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }} onMouseEnter={(e) => e.currentTarget.style.background = '#222'} onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}><Trash size={14} /> Удалить блок</button>
         </div>
       )}
    </div>
  );
}
