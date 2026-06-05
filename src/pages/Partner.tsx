import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Handshake, Target, Users, TrendingUp } from 'lucide-react';
import { useLang, InlineEdit } from '../LangContext';
import { BuilderWrapper } from '../components/BuilderWrapper';
import { useBuilderLayout } from '../hooks/useBuilderLayout';
import CustomBlock, { getCustomBlocks } from '../components/CustomBlock';

export default function Partner() {
  const [customBlocks, setCustomBlocks] = useState<Record<string, any>>(() => getCustomBlocks());

  useEffect(() => {
    const sync = () => setCustomBlocks(getCustomBlocks());
    window.addEventListener('storage', sync);
    return () => window.removeEventListener('storage', sync);
  }, []);

  const { layout, isBuilder } = useBuilderLayout('partner', { 
    order: ['partner_main'], 
    hidden: [], 
    styles: {}, 
    images: {} 
  });

  const pageOrder = Array.isArray(layout?.order) && layout.order.length > 0 ? layout.order : ['partner_main'];
  const hiddenBlocks = Array.isArray(layout?.hidden) ? layout.hidden : [];

  return (
    <div style={{ paddingTop: '150px', minHeight: '100vh', background: 'var(--background)', overflow: 'hidden' }}>
      {pageOrder.map((id: string, index: number) => {
        if (hiddenBlocks.includes(id)) return null;

        const blockStyle = layout?.styles?.[id] || {};

        if (id === 'partner_main') {
          return (
            <BuilderWrapper 
              key={id} 
              id="partner_main" 
              index={index} 
              isFirst={index === 0} 
              isLast={index === pageOrder.length - 1} 
              isBuilder={isBuilder} 
              style={blockStyle}
            >
              <div className="container">
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', color: 'var(--primary)', fontWeight: '800', fontSize: '0.8rem', letterSpacing: '0.3em', marginBottom: '2rem' }}>
                    <Handshake size={16} />
                    B2B COLLABORATION
                  </div>
                  <h1 style={{ fontSize: 'clamp(3rem, 6vw, 6rem)', color: 'var(--foreground)', marginBottom: '6rem', lineHeight: '0.9' }}>
                    ПАРТНЕР<span style={{ color: 'var(--primary)' }}>СТВО</span>
                  </h1>

                  <div className="grid-2" style={{ gap: '6rem', marginBottom: '8rem' }}>
                    <div className="industrial-card">
                      <div style={{ fontSize: '1.4rem', color: 'var(--foreground)', marginBottom: '2rem', lineHeight: '1.4' }}>
                        <InlineEdit tKey="partner_title" />
                      </div>
                      <div style={{ color: 'var(--text-muted)', fontSize: '1.1rem', lineHeight: '1.8' }}>
                        <InlineEdit tKey="partner_desc" />
                      </div>
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
                      {[
                        { icon: <Target />, labelKey: 'partner_goals' },
                        { icon: <Users />, labelKey: 'partner_team' },
                        { icon: <TrendingUp />, labelKey: 'partner_growth' },
                        { icon: <Handshake />, labelKey: 'partner_links' }
                      ].map((item, i) => (
                        <div key={i} className="industrial-card" style={{ padding: '2rem', textAlign: 'center' }}>
                          <div style={{ color: 'var(--primary)', marginBottom: '1rem' }}>{item.icon}</div>
                          <div style={{ color: 'var(--foreground)', fontWeight: '800', fontSize: '0.7rem' }}><InlineEdit tKey={item.labelKey} /></div>
                        </div>
                      ))}
                    </div>
                  </div>
                </motion.div>
              </div>
            </BuilderWrapper>
          );
        } else if (id.startsWith('new_block_')) {
          const blockData = customBlocks[id];
          if (blockData) {
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
                <div className="container" style={{ paddingTop: '2rem', paddingBottom: '2rem' }}>
                  <CustomBlock id={id} data={blockData} />
                </div>
              </BuilderWrapper>
            );
          }
        }
        return null;
      })}
    </div>
  );
}
