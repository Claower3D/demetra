import React from 'react';
import { useLang } from '../LangContext';

// Shape of a custom block's data
export interface CustomBlockData {
  type: 'heading' | 'text' | 'divider' | 'button' | 'card' | 'two_col' | 'image_text' | 'cta_banner';
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
  const accent = data.accent || 'var(--primary)';
  const bg = data.bg || 'transparent';
  const align = data.align || 'left';

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
          {data.subheading && (
            <div style={{ color: accent, fontWeight: '800', fontSize: '0.8rem', letterSpacing: '0.3em', marginBottom: '1rem', textTransform: 'uppercase' }}>
              ◆ {data.subheading}
            </div>
          )}
          <h2 style={{ fontSize: 'clamp(2rem, 5vw, 4rem)', fontWeight: '900', lineHeight: 1.05, margin: 0 }}>
            {data.heading || 'Заголовок блока'}
          </h2>
          {data.body && (
            <p style={{ marginTop: '1.5rem', fontSize: '1.1rem', color: 'var(--text-muted)', maxWidth: '720px', lineHeight: 1.7, margin: '1.5rem auto 0' }}>
              {data.body}
            </p>
          )}
        </div>
      );

    case 'text':
      return (
        <div style={base}>
          <p style={{ fontSize: '1.15rem', lineHeight: 1.8, color: 'var(--text-muted)', maxWidth: '800px', margin: align === 'center' ? '0 auto' : '0', whiteSpace: 'pre-wrap' }}>
            {data.body || 'Введите текст блока...'}
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
            {data.label || 'Нажмите здесь'} →
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
            {data.src && (
              <img src={data.src} alt="" style={{ width: '100%', height: '260px', objectFit: 'cover', display: 'block' }} />
            )}
            <div style={{ padding: '2.5rem' }}>
              {data.label && (
                <h3 style={{ fontSize: '1.5rem', fontWeight: '900', marginBottom: '1rem', color: 'var(--foreground)' }}>
                  {data.label}
                </h3>
              )}
              {data.body && (
                <p style={{ color: 'var(--text-muted)', lineHeight: 1.7, fontSize: '1rem' }}>{data.body}</p>
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
            {data.col1 || 'Левая колонка...'}
          </p>
          <p style={{ fontSize: '1.1rem', lineHeight: 1.8, color: 'var(--text-muted)', margin: 0, whiteSpace: 'pre-wrap' }}>
            {data.col2 || 'Правая колонка...'}
          </p>
        </div>
      );

    case 'image_text':
      return (
        <div style={{ ...base, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4rem', alignItems: 'center' }}>
          {data.src && (
            <img src={data.src} alt="" style={{ width: '100%', borderRadius: 'var(--radius)', display: 'block', aspectRatio: '16/9', objectFit: 'cover' }} />
          )}
          <div>
            {data.heading && <h3 style={{ fontSize: '2rem', fontWeight: '900', marginBottom: '1.5rem', color: 'var(--foreground)' }}>{data.heading}</h3>}
            {data.body && <p style={{ color: 'var(--text-muted)', lineHeight: 1.8, whiteSpace: 'pre-wrap' }}>{data.body}</p>}
            {data.href && data.label && (
              <a href={data.href} style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', color: accent, fontWeight: '800', marginTop: '2rem', textDecoration: 'none' }}>
                {data.label} →
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
          {data.subheading && (
            <div style={{ color: accent, fontWeight: '800', fontSize: '0.8rem', letterSpacing: '0.3em', marginBottom: '1.5rem' }}>
              ◆ {data.subheading}
            </div>
          )}
          {data.heading && (
            <h2 style={{ fontSize: 'clamp(2.5rem, 5vw, 4rem)', fontWeight: '900', marginBottom: '1.5rem', color: 'var(--foreground)' }}>
              {data.heading}
            </h2>
          )}
          {data.body && (
            <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem', maxWidth: '600px', margin: '0 auto 2.5rem', lineHeight: 1.7 }}>
              {data.body}
            </p>
          )}
          {data.href && (
            <a href={data.href} style={{
              display: 'inline-flex', alignItems: 'center', gap: '0.75rem',
              padding: '1.25rem 3rem', background: accent, color: '#000',
              borderRadius: '12px', fontWeight: '900', textDecoration: 'none',
              boxShadow: `0 0 40px ${accent}40`
            }}>
              {data.label || 'Узнать больше'} →
            </a>
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
