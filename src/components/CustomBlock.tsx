import React from 'react';
import { useLang } from '../LangContext';
import { BuilderWrapper } from './BuilderWrapper';

// Shape of a custom block's data
export interface CustomBlockData {
  id?: string;
  type: 'heading' | 'text' | 'divider' | 'button' | 'card' | 'two_col' | 'image_text' | 'cta_banner' | 'container' | 'shape_rect' | 'shape_circle' | 'shape_line';
  heading?: string;
  subheading?: string;
  body?: string;
  label?: string;     // Button label or card title
  href?: string;      // Button link
  src?: string;       // Image src for card / image_text
  col1?: string;      // two_col left
  col2?: string;      // two_col right
  align?: 'left' | 'center' | 'right';
  accent?: string;    // accent color override
  bg?: string;        // background override
  mediaType?: 'image' | 'video';
  videoSrc?: string;
  mediaPosition?: string;
  mediaAspect?: string;
  mediaFit?: string;
  childrenBlocks?: CustomBlockData[];
  displayType?: 'grid' | 'flex';
  cols?: number;
  gap?: string;
  flexDirection?: 'row' | 'column';
  alignItems?: string;
  justifyContent?: string;
}

// Get all custom blocks from localStorage
export function getCustomBlocks(): Record<string, CustomBlockData> {
  try {
    return JSON.parse(localStorage.getItem('demetra_custom_blocks') || '{}');
  } catch { return {}; }
}

export function setCustomBlock(id: string, data: CustomBlockData) {
  const all = getCustomBlocks();
  all[id] = data;
  localStorage.setItem('demetra_custom_blocks', JSON.stringify(all));
  window.dispatchEvent(new Event('storage'));
}

export function deleteCustomBlock(id: string) {
  const all = getCustomBlocks();
  delete all[id];
  localStorage.setItem('demetra_custom_blocks', JSON.stringify(all));
}

export interface PageItem {
  id: string;
  path: string;
  name: {
    ru: string;
    kk: string;
    en: string;
  };
  isSystem?: boolean;
}

export function getPagesList(): PageItem[] {
  const DEFAULT_PAGES: PageItem[] = [
    { id: 'home', path: '/', name: { ru: 'Главная', kk: 'Басты бет', en: 'Home' }, isSystem: true },
    { id: 'about', path: '/about', name: { ru: 'О компании', kk: 'Біз туралы', en: 'About' }, isSystem: true },
    { id: 'catalog', path: '/catalog', name: { ru: 'Каталог', kk: 'Каталог', en: 'Catalog' }, isSystem: true },
    { id: 'services', path: '/services', name: { ru: 'Услуги', kk: 'Қызметтер', en: 'Services' }, isSystem: true },
    { id: 'partner', path: '/partner', name: { ru: 'Партнерам', kk: 'Серіктестерге', en: 'Partners' }, isSystem: true },
    { id: 'gallery', path: '/gallery', name: { ru: 'Галерея', kk: 'Галерея', en: 'Gallery' }, isSystem: true },
    { id: 'contacts', path: '/contacts', name: { ru: 'Контакты', kk: 'Байланыс', en: 'Contacts' }, isSystem: true }
  ];
  try {
    const saved = localStorage.getItem('demetra_pages_list');
    return saved ? JSON.parse(saved) : DEFAULT_PAGES;
  } catch {
    return DEFAULT_PAGES;
  }
}

// ----------------- Renderer -----------------
export default function CustomBlock({ id, data }: { id: string; data: CustomBlockData }) {
  const { lang } = useLang();
  const [isOverContainer, setIsOverContainer] = React.useState(false);
  const [layoutStyles, setLayoutStyles] = React.useState<Record<string, any>>({});
  const [layoutLinks, setLayoutLinks] = React.useState<Record<string, any>>({});

  React.useEffect(() => {
    const syncStyles = () => {
      try {
        const pageKey = window.location.pathname === '/' ? 'home' : window.location.pathname.replace('/', '');
        const saved = localStorage.getItem(`demetra_${pageKey}_layout`);
        if (saved) {
          const layout = JSON.parse(saved);
          if (layout && layout.styles) {
            setLayoutStyles(layout.styles);
          }
          if (layout && layout.links) {
            setLayoutLinks(layout.links);
          }
        }
      } catch (e) {
        console.error("Failed to sync layout data in CustomBlock", e);
      }
    };
    syncStyles();
    window.addEventListener('storage', syncStyles);
    window.addEventListener('message', syncStyles);
    return () => {
      window.removeEventListener('storage', syncStyles);
      window.removeEventListener('message', syncStyles);
    };
  }, []);
  const accent = data.accent || 'var(--primary)';
  const bg = data.bg || 'transparent';
  const align = data.align || 'left';

  // Support multilingual fields (e.g. heading_ru, heading_kk, heading_en)
  const heading = (data as any)[`heading_${lang}`] || data.heading;
  const subheading = (data as any)[`subheading_${lang}`] || data.subheading;
  const body = (data as any)[`body_${lang}`] || data.body;
  const label = (data as any)[`label_${lang}`] || data.label;
  const col1 = (data as any)[`col1_${lang}`] || data.col1;
  const col2 = (data as any)[`col2_${lang}`] || data.col2;

  const links = layoutLinks[id] || {};
  const isBuilder = window.self !== window.top;

  const handleClick = (e: React.MouseEvent) => {
    if (isBuilder) return; // Don't trigger links in builder
    if (links.modalId) {
      // dispatch custom event to open modal
      window.dispatchEvent(new CustomEvent('OPEN_CUSTOM_MODAL', { detail: { id: links.modalId } }));
    }
    if (links.onClickAction) {
      try {
        // eslint-disable-next-line no-new-func
        const fn = new Function('e', links.onClickAction);
        fn(e);
      } catch (err) {
        console.error('Custom click action failed', err);
      }
    }
    if (links.href && !data.href) {
      window.location.href = links.href;
    }
  };

  const base: React.CSSProperties = {
    background: bg,
    textAlign: align,
    width: '100%',
    padding: '3rem 0',
    color: 'var(--foreground)',
    cursor: (!isBuilder && (links.modalId || links.onClickAction || links.href)) ? 'pointer' : undefined,
  };

  const wrapperProps = {
    style: base,
    onClick: handleClick,
    className: links.className || undefined
  };

  switch (data.type) {
    case 'heading':
      return (
        <div {...wrapperProps}>
          {subheading && (
            <div style={{ color: accent, fontWeight: '800', fontSize: '0.8rem', letterSpacing: '0.3em', marginBottom: '1rem', textTransform: 'uppercase' }}>
              ◆ {subheading}
            </div>
          )}
          <h2 style={{ fontSize: 'clamp(2rem, 5vw, 4rem)', fontWeight: '900', lineHeight: 1.05, margin: 0 }}>
            {heading || 'Заголовок блока'}
          </h2>
          {body && (
            <p style={{ marginTop: '1.5rem', fontSize: '1.1rem', color: 'var(--text-muted)', maxWidth: '720px', lineHeight: 1.7, margin: '1.5rem auto 0' }}>
              {body}
            </p>
          )}
        </div>
      );

    case 'text':
      return (
        <div {...wrapperProps}>
          <p style={{ fontSize: '1.15rem', lineHeight: 1.8, color: 'var(--text-muted)', maxWidth: '800px', margin: align === 'center' ? '0 auto' : '0', whiteSpace: 'pre-wrap' }}>
            {body || 'Введите text блока...'}
          </p>
        </div>
      );

    case 'divider':
      return (
        <div {...wrapperProps} style={{ ...wrapperProps.style, padding: '1.5rem 0' }}>
          <div style={{ height: '1px', background: `linear-gradient(to right, transparent, ${accent}, transparent)`, opacity: 0.4 }} />
        </div>
      );

    case 'button':
      return (
        <div {...wrapperProps}>
          <a
            href={data.href || '#'}
            style={{
              display: 'inline-flex', alignItems: 'center', gap: '0.75rem',
              padding: '1.25rem 3rem', background: accent, color: '#000',
              borderRadius: '12px', fontWeight: '900', fontSize: '0.9rem',
              letterSpacing: '0.05em', textDecoration: 'none',
              transition: 'all 0.3s', boxShadow: `0 0 25px ${accent}33`
            }}
          >
            {label || 'Нажмите здесь'} →
          </a>
        </div>
      );

    case 'card':
      const cardMediaPosition = data.mediaPosition || 'top';
      const cardMediaAspect = data.mediaAspect || 'auto';
      const cardMediaFit = (data.mediaFit || 'cover') as any;
      const cardHeight = cardMediaAspect === 'auto' ? '260px' : undefined;

      const cardMediaElement = (
        <div
          className={isBuilder ? "builder-media-hoverable" : ""}

          style={{ width: '100%', height: cardHeight, aspectRatio: cardMediaAspect === 'auto' ? undefined : cardMediaAspect, position: 'relative', overflow: 'hidden' }}
        >
          {data.mediaType === 'video' && data.videoSrc ? (
            <div style={{ width: '100%', height: '100%', position: 'relative', overflow: 'hidden' }}>
              {data.videoSrc.includes('youtube.com') || data.videoSrc.includes('youtu.be') ? (
                (() => {
                  let embedId = '';
                  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
                  const match = data.videoSrc.match(regExp);
                  if (match && match[2].length === 11) embedId = match[2];
                  return embedId ? (
                    <iframe
                      src={`https://www.youtube.com/embed/${embedId}?autoplay=1&mute=1&loop=1&playlist=${embedId}&controls=0`}
                      style={{ width: '100%', height: '100%', border: 'none' }}
                      title="Card Video"
                    />
                  ) : null;
                })()
              ) : (
                <video src={data.videoSrc} autoPlay loop muted playsInline style={{ width: '100%', height: '100%', objectFit: cardMediaFit }} />
              )}
            </div>
          ) : (
            data.src ? (
              <img src={data.src} alt="" style={{ width: '100%', height: '100%', objectFit: cardMediaFit, display: 'block' }} />
            ) : (
              isBuilder ? (
                <div style={{
                  width: '100%', height: '100%', minHeight: '260px', background: 'rgba(255,255,255,0.02)',
                  borderBottom: '1.5px dashed var(--border)', display: 'flex', flexDirection: 'column',
                  alignItems: 'center', justifyContent: 'center', gap: '0.5rem', color: 'var(--text-muted)'
                }}>
                  <span style={{ fontSize: '2rem' }}>🖼️</span>
                  <span style={{ fontSize: '0.85rem', fontWeight: 'bold' }}>Добавь фото или видео</span>
                </div>
              ) : null
            )
          )}
        </div>
      );

      const cardTextElement = (
        <div 
          className={isBuilder ? "builder-text-hoverable" : ""}

          style={{ padding: '2.5rem' }}
        >
          {label && (
            <h3 style={{ fontSize: '1.5rem', fontWeight: '900', marginBottom: '1rem', color: 'var(--foreground)' }}>
              {label}
            </h3>
          )}
          {body && (
            <p style={{ color: 'var(--text-muted)', lineHeight: 1.7, fontSize: '1rem' }}>{body}</p>
          )}
          {data.href && (
            <a href={data.href} style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', color: accent, fontWeight: '800', fontSize: '0.85rem', marginTop: '1.5rem', textDecoration: 'none' }}>
              Подробнее →
            </a>
          )}
        </div>
      );

      return (
        <div {...wrapperProps}>
          <div style={{
            background: 'var(--surface)', border: '1px solid var(--border)',
            borderRadius: 'var(--radius)', overflow: 'hidden',
            transition: 'all 0.4s'
          }}>
            {cardMediaPosition === 'bottom' ? (
              <>
                {cardTextElement}
                {cardMediaElement}
              </>
            ) : (
              <>
                {cardMediaElement}
                {cardTextElement}
              </>
            )}
          </div>
        </div>
      );

    case 'two_col':
      return (
        <div 
          {...wrapperProps} 
          className={`${wrapperProps.className || ''} ${isBuilder ? "builder-text-hoverable" : ""}`}

          style={{ ...wrapperProps.style, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4rem', alignItems: 'start' }}
        >
          <p style={{ fontSize: '1.1rem', lineHeight: 1.8, color: 'var(--text-muted)', margin: 0, whiteSpace: 'pre-wrap' }}>
            {col1 || 'Левая колонка...'}
          </p>
          <p style={{ fontSize: '1.1rem', lineHeight: 1.8, color: 'var(--text-muted)', margin: 0, whiteSpace: 'pre-wrap' }}>
            {col2 || 'Правая колонка...'}
          </p>
        </div>
      );

    case 'image_text':
      const mediaPosition = data.mediaPosition || 'left';
      const mediaAspect = data.mediaAspect || '16/9';
      const mediaFit = (data.mediaFit || 'cover') as any;

      const mediaElement = (
        <div
          className={isBuilder ? "builder-media-hoverable" : ""}

          style={{ width: '100%', borderRadius: 'var(--radius)', aspectRatio: mediaAspect === 'auto' ? undefined : mediaAspect, height: mediaAspect === 'auto' ? '400px' : undefined, overflow: 'hidden', position: 'relative' }}
        >
          {data.mediaType === 'video' && data.videoSrc ? (
            <div style={{ width: '100%', height: '100%', position: 'relative', overflow: 'hidden' }}>
              {data.videoSrc.includes('youtube.com') || data.videoSrc.includes('youtu.be') ? (
                (() => {
                  let embedId = '';
                  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
                  const match = data.videoSrc.match(regExp);
                  if (match && match[2].length === 11) embedId = match[2];
                  return embedId ? (
                    <iframe
                      src={`https://www.youtube.com/embed/${embedId}?autoplay=1&mute=1&loop=1&playlist=${embedId}&controls=0`}
                      style={{ width: '100%', height: '100%', border: 'none' }}
                      title="Block Video"
                    />
                  ) : null;
                })()
              ) : (
                <video src={data.videoSrc} autoPlay loop muted playsInline style={{ width: '100%', height: '100%', objectFit: mediaFit }} />
              )}
            </div>
          ) : (
            data.src ? (
              <img src={data.src} alt="" style={{ width: '100%', height: '100%', display: 'block', objectFit: mediaFit }} />
            ) : (
              isBuilder ? (
                <div style={{
                  width: '100%', height: '100%', minHeight: '260px', background: 'rgba(255,255,255,0.02)',
                  border: '1.5px dashed var(--border)', borderRadius: 'var(--radius)',
                  display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                  gap: '0.5rem', color: 'var(--text-muted)'
                }}>
                  <span style={{ fontSize: '2rem' }}>🖼️</span>
                  <span style={{ fontSize: '0.85rem', fontWeight: 'bold' }}>Добавь фото или видео</span>
                </div>
              ) : null
            )
          )}
        </div>
      );

      const textElement = (
        <div 
          className={isBuilder ? "builder-text-hoverable" : ""}

        >
          {heading && <h3 style={{ fontSize: '2rem', fontWeight: '900', marginBottom: '1.5rem', color: 'var(--foreground)' }}>{heading}</h3>}
          {body && <p style={{ color: 'var(--text-muted)', lineHeight: 1.8, whiteSpace: 'pre-wrap' }}>{body}</p>}
          {data.href && label && (
            <a href={data.href} style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', color: accent, fontWeight: '800', marginTop: '2rem', textDecoration: 'none' }}>
              {label} →
            </a>
          )}
        </div>
      );

      return (
        <div {...wrapperProps} style={{ ...wrapperProps.style, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4rem', alignItems: 'center' }}>
          {mediaPosition === 'right' ? (
            <>
              {textElement}
              {mediaElement}
            </>
          ) : (
            <>
              {mediaElement}
              {textElement}
            </>
          )}
        </div>
      );

    case 'cta_banner':
      return (
        <div {...wrapperProps} style={{
          ...wrapperProps.style,
          background: bg !== 'transparent' ? bg : `linear-gradient(135deg, var(--surface), var(--background))`,
          border: '1px solid var(--border)',
          borderRadius: 'var(--radius)',
          padding: '5rem 4rem',
          textAlign: 'center'
        }}>
          {subheading && (
            <div style={{ color: accent, fontWeight: '800', fontSize: '0.8rem', letterSpacing: '0.3em', marginBottom: '1.5rem' }}>
              ◆ {subheading}
            </div>
          )}
          {heading && (
            <h2 style={{ fontSize: 'clamp(2.5rem, 5vw, 4rem)', fontWeight: '900', marginBottom: '1.5rem', color: 'var(--foreground)' }}>
              {heading}
            </h2>
          )}
          {body && (
            <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem', maxWidth: '600px', margin: '0 auto 2.5rem', lineHeight: 1.7 }}>
              {body}
            </p>
          )}
          {data.href && (
            <a href={data.href} style={{
              display: 'inline-flex', alignItems: 'center', gap: '0.75rem',
              padding: '1.25rem 3rem', background: accent, color: '#000',
              borderRadius: '12px', fontWeight: '900', textDecoration: 'none',
              boxShadow: `0 0 40px ${accent}40`
            }}>
              {label || 'Узнать больше'} →
            </a>
          )}
        </div>
      );

    case 'shape_rect':
      return (
        <div {...wrapperProps} style={{ ...wrapperProps.style, width: '100%', height: '200px', background: accent, borderRadius: '8px' }} />
      );

    case 'shape_circle':
      return (
        <div {...wrapperProps} style={{ ...wrapperProps.style, width: '150px', height: '150px', background: accent, borderRadius: '50%' }} />
      );

    case 'shape_line':
      return (
        <div {...wrapperProps} style={{ ...wrapperProps.style, width: '100%', height: '2px', background: accent, margin: '2rem 0' }} />
      );

    case 'container':
      const children = data.childrenBlocks || [];

      const handleContainerDragOver = (e: React.DragEvent) => {
        if (!isBuilder) return;
        e.preventDefault();
        e.stopPropagation();
        setIsOverContainer(true);
      };

      const handleContainerDragLeave = () => {
        if (!isBuilder) return;
        setIsOverContainer(false);
      };

      const handleContainerDrop = (e: React.DragEvent) => {
        if (!isBuilder) return;
        e.preventDefault();
        e.stopPropagation();
        setIsOverContainer(false);
        const draggedId = e.dataTransfer.getData("text/plain");
        if (draggedId && draggedId.startsWith("add_block:")) {
          const type = draggedId.replace("add_block:", "");
          window.parent.postMessage({
            type: 'DEMETRA_BUILDER',
            action: 'ADD_NESTED_AT',
            id: id,
            blockType: type
          }, '*');
        }
      };

      const displayType = data.displayType || 'grid';
      const cols = data.cols || 12;
      const gap = data.gap || '2rem';
      const flexDirection = data.flexDirection || 'column';
      const alignItems = data.alignItems || 'stretch';

      return (
        <div
          {...wrapperProps}
          onDragOver={handleContainerDragOver}
          onDragLeave={handleContainerDragLeave}
          onDrop={handleContainerDrop}
          style={{
            ...base,
            display: displayType,
            gridTemplateColumns: displayType === 'grid' ? `repeat(${cols}, 1fr)` : undefined,
            flexDirection: displayType === 'flex' ? flexDirection : undefined,
            gap: gap,
            alignItems: alignItems,
            minHeight: isBuilder ? '120px' : 'auto',
            border: isBuilder
              ? (isOverContainer ? '2px dashed #00ff41' : '1.5px dashed rgba(0, 255, 65, 0.25)')
              : 'none',
            padding: isBuilder ? '2.5rem' : '1rem 0',
            borderRadius: 'var(--radius)',
            background: isBuilder
              ? (isOverContainer ? 'rgba(0, 255, 65, 0.05)' : 'rgba(255,255,255,0.01)')
              : bg,
            position: 'relative',
            boxShadow: (isBuilder && isOverContainer) ? '0 0 25px rgba(0, 255, 65, 0.25)' : 'none',
            transition: 'all 0.15s ease'
          }}
        >
          {isBuilder && displayType === 'grid' && (
            <div style={{
              position: 'absolute',
              top: 0, left: 0, right: 0, bottom: 0,
              pointerEvents: 'none',
              zIndex: 0,
              display: 'grid',
              gridTemplateColumns: `repeat(${cols}, 1fr)`,
              gap: gap,
              padding: isBuilder ? '2.5rem' : '1rem 0',
              boxSizing: 'border-box'
            }}>
              {Array.from({ length: cols * 3 }).map((_, i) => (
                <div key={i} style={{
                  border: '1px dashed rgba(0, 255, 65, 0.12)',
                  borderRadius: '4px',
                  minHeight: '80px',
                  background: 'rgba(0, 255, 65, 0.003)'
                }} />
              ))}
            </div>
          )}

          {isBuilder && children.length === 0 && (
            <div style={{ color: 'var(--text-muted)', fontSize: '0.9rem', textAlign: 'center', padding: '2rem 1rem', gridColumn: 'span 12', zIndex: 1 }}>
              ✦ Пустой контейнер. Добавьте элементы внутри блока.
            </div>
          )}
          {children.map((child, index) => {
            const childStyle = layoutStyles[child.id || ''] || {};
            const gridColumn = childStyle.gridColumn || 'span 12';
            const gridRow = childStyle.gridRow || 'auto';

            return (
              <div
                key={child.id}
                style={{
                  position: 'relative',
                  gridColumn: displayType === 'grid' ? gridColumn : undefined,
                  gridRow: displayType === 'grid' ? gridRow : undefined,
                  width: displayType === 'grid' ? '100%' : undefined,
                  height: displayType === 'grid' ? '100%' : undefined,
                  zIndex: 1,
                }}
              >
                {isBuilder ? (
                  <BuilderWrapper
                    id={child.id || ''}
                    index={index}
                    isFirst={index === 0}
                    isLast={index === children.length - 1}
                    isBuilder={isBuilder}
                    arrayKey={"nested:" + id}
                  >
                    <div style={{ height: '100%', boxSizing: 'border-box' }}>
                      <CustomBlock id={child.id || ''} data={child} />
                    </div>
                  </BuilderWrapper>
                ) : (
                  <CustomBlock id={child.id || ''} data={child} />
                )}
              </div>
            );
          })}
          {isBuilder && (
            <button
              onClick={() => window.parent.postMessage({ type: 'DEMETRA_BUILDER', action: 'ADD_NESTED', id: id }, '*')}
              style={{
                alignSelf: 'center',
                background: 'rgba(0, 255, 65, 0.1)',
                border: '1px dashed var(--primary)',
                color: 'var(--primary)',
                padding: '0.75rem 2rem',
                borderRadius: '8px',
                fontSize: '0.8rem',
                cursor: 'pointer',
                fontWeight: '900',
                transition: '0.2s',
                marginTop: '1rem'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'rgba(0, 255, 65, 0.2)';
                e.currentTarget.style.boxShadow = '0 0 15px rgba(0, 255, 65, 0.3)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'rgba(0, 255, 65, 0.1)';
                e.currentTarget.style.boxShadow = 'none';
              }}
            >
              + Добавить элемент в блок
            </button>
          )}
        </div>
      );

    default:
      return (
        <div style={{ ...base, padding: '4rem', background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', textAlign: 'center', color: 'var(--text-muted)' }}>
          Неизвестный тип блока: {data.type}
        </div>
      );
  }
}
