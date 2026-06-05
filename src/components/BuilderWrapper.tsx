import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MoveUp, MoveDown, Trash, Settings, Layers, Plus, Edit3, Image as ImageIcon } from 'lucide-react';

export function BuilderWrapper({ children, id, index, isFirst, isLast, isBuilder, arrayKey = 'order', style = {} }: any) {
  const [isHovered, setIsHovered] = useState(false);
  const [isDraggingOver, setIsDraggingOver] = useState(false);
  const [contextMenu, setContextMenu] = useState<{x: number, y: number} | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [dragSize, setDragSize] = useState<{gridColumn?: string, gridRow?: string, width?: string, height?: string} | null>(null);
  
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

  const handleDragStart = (e: React.DragEvent) => {
    e.stopPropagation();
    e.dataTransfer.setData("text/plain", id);
    e.dataTransfer.effectAllowed = "move";
    if (containerRef.current) {
      containerRef.current.style.opacity = '0.5';
    }
  };

  const handleDragEnd = () => {
    if (containerRef.current) {
      containerRef.current.style.opacity = '1';
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDraggingOver(true);
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
      } else if (draggedId !== id) {
        postMsg('MOVE_BLOCK_TO', { draggedId, targetId: id, arrayKey });
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

  const mergedStyle = { ...(localStyle || {}), ...(style || {}) };

  return (
    <div 
      ref={containerRef}
      onMouseEnter={isBuilder ? () => setIsHovered(true) : undefined} 
      onMouseLeave={isBuilder ? () => setIsHovered(false) : undefined}
      onContextMenu={isBuilder ? handleContextMenu : undefined}
      draggable={isBuilder}
      onDragStart={isBuilder ? handleDragStart : undefined}
      onDragEnd={isBuilder ? handleDragEnd : undefined}
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
        opacity: mergedStyle?.opacity !== undefined ? mergedStyle.opacity : 1,
        transform: mergedStyle?.transform || 'none',
        marginTop: mergedStyle?.marginTop || undefined,
        marginBottom: mergedStyle?.marginBottom || undefined,
        paddingTop: mergedStyle?.paddingTop || undefined,
        paddingBottom: mergedStyle?.paddingBottom || undefined,
        paddingLeft: mergedStyle?.paddingLeft || undefined,
        paddingRight: mergedStyle?.paddingRight || undefined,
        backgroundColor: mergedStyle?.backgroundColor || undefined,
      }}
    >
       <AnimatePresence>
         {isBuilder && isHovered && !dragSize && !contextMenu && (
           <motion.div 
             initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}
             style={{ position: 'absolute', top: '0.5rem', left: '0.5rem', background: '#00ff41', color: '#000', padding: '0.4rem 1rem', borderRadius: '4px', fontSize: '0.7rem', fontWeight: '900', zIndex: 100, textTransform: 'uppercase' }}
           >
              BLOCK: {id}
           </motion.div>
         )}
       </AnimatePresence>
       
       <div className={isBuilder ? "builder-content-no-drag" : ""}
         onClickCapture={isBuilder ? (e) => {
           if ((e.target as HTMLElement).isContentEditable) return;
           e.preventDefault();
         } : undefined}
         style={{ opacity: isBuilder && isHovered && !dragSize && !contextMenu ? 0.7 : 1, transition: '0.2s', width: '100%', height: '100%' }}
       >
         {children}
       </div>

       {/* Visual Drag Handle */}
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

       {/* Add Block Button (Floating below) */}
       {isBuilder && isHovered && !contextMenu && (
         <button
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
            <button onClick={() => postMsg('OPEN_MODAL', { tab: 'content' })} style={{ background: 'none', border: 'none', color: '#fff', textAlign: 'left', padding: '0.75rem 1rem', cursor: 'pointer', borderRadius: '4px', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }} onMouseEnter={(e) => e.currentTarget.style.background = '#222'} onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}><Edit3 size={14} style={{ color: '#00ff41' }} /> 📝 Редактировать инфо</button>
             <button onClick={() => postMsg('OPEN_MODAL', { tab: 'media' })} style={{ background: 'none', border: 'none', color: '#fff', textAlign: 'left', padding: '0.75rem 1rem', cursor: 'pointer', borderRadius: '4px', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }} onMouseEnter={(e) => e.currentTarget.style.background = '#222'} onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}><ImageIcon size={14} style={{ color: '#00ff41' }} /> 🖼️ Добавить фото/видео</button>
            <button onClick={() => postMsg('OPEN_MODAL', { tab: 'scaling' })} style={{ background: 'none', border: 'none', color: '#fff', textAlign: 'left', padding: '0.75rem 1rem', cursor: 'pointer', borderRadius: '4px', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }} onMouseEnter={(e) => e.currentTarget.style.background = '#222'} onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}><Layers size={14} style={{ color: '#00ff41' }} /> 📐 Масштаб & Размеры</button>
            <div style={{ height: '1px', background: '#333', margin: '0.25rem 0' }}></div>
            {index !== undefined && <button onClick={() => postMsg('MOVE_UP')} disabled={isFirst} style={{ background: 'none', border: 'none', color: isFirst ? '#444' : '#fff', textAlign: 'left', padding: '0.75rem 1rem', cursor: isFirst ? 'default' : 'pointer', borderRadius: '4px', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }} onMouseEnter={(e) => { if(!isFirst) e.currentTarget.style.background = '#222'}} onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}><MoveUp size={14} /> Переместить выше</button>}
            {index !== undefined && <button onClick={() => postMsg('MOVE_DOWN')} disabled={isLast} style={{ background: 'none', border: 'none', color: isLast ? '#444' : '#fff', textAlign: 'left', padding: '0.75rem 1rem', cursor: isLast ? 'default' : 'pointer', borderRadius: '4px', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }} onMouseEnter={(e) => { if(!isLast) e.currentTarget.style.background = '#222'}} onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}><MoveDown size={14} /> Переместить ниже</button>}
            <div style={{ height: '1px', background: '#333', margin: '0.25rem 0' }}></div>
            <button onClick={() => postMsg('REMOVE_BLOCK')} style={{ background: 'none', border: 'none', color: '#ff4b4b', textAlign: 'left', padding: '0.75rem 1rem', cursor: 'pointer', borderRadius: '4px', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }} onMouseEnter={(e) => e.currentTarget.style.background = '#222'} onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}><Trash size={14} /> Удалить блок</button>
         </div>
       )}
    </div>
  );
}
