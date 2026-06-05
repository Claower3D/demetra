import { useState, useEffect } from 'react';
import { useBuilderLayout } from '../hooks/useBuilderLayout';
import { BuilderWrapper } from '../components/BuilderWrapper';
import CustomBlock, { getCustomBlocks } from '../components/CustomBlock';

interface DynamicPageProps {
  pageId: string;
}

export default function DynamicPage({ pageId }: DynamicPageProps) {
  const [customBlocks, setCustomBlocks] = useState<Record<string, any>>(() => getCustomBlocks());

  useEffect(() => {
    const sync = () => setCustomBlocks(getCustomBlocks());
    window.addEventListener('storage', sync);
    return () => window.removeEventListener('storage', sync);
  }, []);

  const { layout, isBuilder } = useBuilderLayout(pageId, {
    order: [],
    hidden: [],
    styles: {},
    images: {}
  });

  const pageOrder = Array.isArray(layout?.order) ? layout.order : [];
  const hiddenBlocks = Array.isArray(layout?.hidden) ? layout.hidden : [];
  const pageStyle = layout?.styles?.page_root || {};

  return (
    <div style={{ paddingTop: '150px', minHeight: '100vh', background: 'var(--background)', ...pageStyle }}>
      {pageOrder.map((id: string, index: number) => {
        if (hiddenBlocks.includes(id)) return null;

        const blockStyle = layout?.styles?.[id] || {};
        
        let content = null;
        if (id.startsWith('new_block_')) {
          const blockData = customBlocks[id];
          if (blockData) {
            content = (
              <div className="container" style={{ paddingTop: '2rem', paddingBottom: '2rem' }}>
                <CustomBlock id={id} data={blockData} />
              </div>
            );
          } else if (isBuilder) {
            content = (
              <div className="builder-empty-state">
                ✦ НОВЫЙ БЛОК<br/>
                <span style={{ fontSize: '0.8rem', color: 'var(--primary)' }}>Нажмите ПКМ → Редактировать для добавления контента</span>
              </div>
            );
          }
        } else if (isBuilder) {
          content = (
            <div className="builder-empty-state">
              NEW AREA: {id} <br/>
              <span style={{ fontSize: '0.8rem', color: 'var(--primary)' }}>RIGHT CLICK TO CUSTOMIZE</span>
            </div>
          );
        }

        return (
          <BuilderWrapper 
            key={id} 
            id={id} 
            index={index} 
            isFirst={index === 0} 
            isLast={index === pageOrder.length - 1} 
            isBuilder={isBuilder}
            style={blockStyle}
          >
            {content}
          </BuilderWrapper>
        );
      })}

      {pageOrder.length === 0 && (
        <div style={{ height: '50vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '1rem', color: 'var(--text-muted)' }}>
          <h2 style={{ color: '#fff', fontSize: '1.5rem', fontWeight: '900', letterSpacing: '0.05em' }}>ПУСТАЯ СТРАНИЦА</h2>
          {isBuilder ? (
            <p style={{ fontSize: '0.9rem', color: 'var(--primary)' }}>Откройте «Библиотеку блоков» слева, чтобы добавить элементы на страницу.</p>
          ) : (
            <p style={{ fontSize: '0.9rem' }}>Здесь пока нет контента.</p>
          )}
        </div>
      )}
    </div>
  );
}
