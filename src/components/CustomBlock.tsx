import React from 'react';
import { useLang } from '../LangContext';
import { BuilderWrapper } from './BuilderWrapper';

// Shape of a custom block's data
export interface CustomBlockData {
  id?: string;
  type: 'heading' | 'text' | 'divider' | 'button' | 'card' | 'two_col' | 'image_text' | 'cta_banner' | 'container';
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
  childrenBlocks?: CustomBlockData[];
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

// ----------------- Renderer -----------------
export default function CustomBlock({ id, data }: { id: string; data: CustomBlockData }) {
  const { lang } = useLang();
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

  const base: React.CSSProperties = {
    background: bg,
    textAlign: align,
    width: '100%',
    padding: '3rem 0',
    color: 'var(--foreground)'
  };

  switch (data.type) {
    case 'heading':
      return (
        <div style={base}>
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
        <div style={base}>
          <p style={{ fontSize: '1.15rem', lineHeight: 1.8, color: 'var(--text-muted)', maxWidth: '800px', margin: align === 'center' ? '0 auto' : '0', whiteSpace: 'pre-wrap' }}>
            {body || 'Введите text блока...'}
          </p>
        </div>
      );

    case 'divider':
      return (
        <div style={{ ...base, padding: '1.5rem 0' }}>
          <div style={{ height: '1px', background: `linear-gradient(to right, transparent, ${accent}, transparent)`, opacity: 0.4 }} />
        </div>
      );

    case 'button':
      return (
        <div style={base}>
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
      return (
        <div style={base}>
          <div style={{
            background: 'var(--surface)', border: '1px solid var(--border)',
            borderRadius: 'var(--radius)', overflow: 'hidden',
            transition: 'all 0.4s'
          }}>
            {data.mediaType === 'video' && data.videoSrc ? (
              <div style={{ width: '100%', height: '260px', position: 'relative', overflow: 'hidden' }}>
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
                  <video src={data.videoSrc} autoPlay loop muted playsInline style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                )}
              </div>
            ) : (
              data.src && <img src={data.src} alt="" style={{ width: '100%', height: '260px', objectFit: 'cover', display: 'block' }} />
            )}
            <div style={{ padding: '2.5rem' }}>
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
          </div>
        </div>
      );

    case 'two_col':
      return (
        <div style={{ ...base, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4rem', alignItems: 'start' }}>
          <p style={{ fontSize: '1.1rem', lineHeight: 1.8, color: 'var(--text-muted)', margin: 0, whiteSpace: 'pre-wrap' }}>
            {col1 || 'Левая колонка...'}
          </p>
          <p style={{ fontSize: '1.1rem', lineHeight: 1.8, color: 'var(--text-muted)', margin: 0, whiteSpace: 'pre-wrap' }}>
            {col2 || 'Правая колонка...'}
          </p>
        </div>
      );

    case 'image_text':
      return (
        <div style={{ ...base, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4rem', alignItems: 'center' }}>
          {data.mediaType === 'video' && data.videoSrc ? (
            <div style={{ width: '100%', borderRadius: 'var(--radius)', aspectRatio: '16/9', overflow: 'hidden', position: 'relative' }}>
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
                <video src={data.videoSrc} autoPlay loop muted playsInline style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              )}
            </div>
          ) : (
            data.src && <img src={data.src} alt="" style={{ width: '100%', borderRadius: 'var(--radius)', display: 'block', aspectRatio: '16/9', objectFit: 'cover' }} />
          )}
          <div>
            {heading && <h3 style={{ fontSize: '2rem', fontWeight: '900', marginBottom: '1.5rem', color: 'var(--foreground)' }}>{heading}</h3>}
            {body && <p style={{ color: 'var(--text-muted)', lineHeight: 1.8, whiteSpace: 'pre-wrap' }}>{body}</p>}
            {data.href && label && (
              <a href={data.href} style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', color: accent, fontWeight: '800', marginTop: '2rem', textDecoration: 'none' }}>
                {label} →
              </a>
            )}
          </div>
        </div>
      );

    case 'cta_banner':
      return (
        <div style={{
          ...base,
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

    case 'container':
      const children = data.childrenBlocks || [];
      const isBuilder = window.self !== window.top;
      return (
        <div style={{
          ...base,
          display: 'flex',
          flexDirection: 'column',
          gap: '2rem',
          minHeight: isBuilder ? '120px' : 'auto',
          border: isBuilder ? '1.5px dashed rgba(0, 255, 65, 0.25)' : 'none',
          padding: isBuilder ? '2.5rem' : '1rem 0',
          borderRadius: 'var(--radius)',
          background: isBuilder ? 'rgba(255,255,255,0.01)' : bg,
          position: 'relative'
        }}>
          {isBuilder && children.length === 0 && (
            <div style={{ color: 'var(--text-muted)', fontSize: '0.9rem', textAlign: 'center', padding: '2rem 1rem' }}>
              ✦ Пустой контейнер. Добавьте элементы внутри блока.
            </div>
          )}
          {children.map((child, index) => (
            <div key={child.id} style={{ position: 'relative' }}>
              {isBuilder ? (
                <div style={{ position: 'relative', border: '1px dashed rgba(255,255,255,0.1)', padding: '1.5rem', borderRadius: '12px', marginBottom: '0.5rem' }}>
                  <div style={{ position: 'absolute', top: '5px', right: '5px', zIndex: 10 }}>
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        window.parent.postMessage({ type: 'DEMETRA_BUILDER', action: 'DELETE_NESTED', id: id, nestedId: child.id || '' }, '*');
                      }}
                      style={{ background: '#ff4b4b', border: 'none', color: '#fff', fontSize: '0.65rem', padding: '0.25rem 0.5rem', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}
                    >
                      Удалить элемент
                    </button>
                  </div>
                  <BuilderWrapper id={child.id || ''} index={index} isFirst={index === 0} isLast={index === children.length - 1} isBuilder={isBuilder}>
                    <CustomBlock id={child.id || ''} data={child} />
                  </BuilderWrapper>
                </div>
              ) : (
                <CustomBlock id={child.id || ''} data={child} />
              )}
            </div>
          ))}
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
