import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useLang, InlineEdit } from '../LangContext';
import { BuilderWrapper } from '../components/BuilderWrapper';
import { useBuilderLayout } from '../hooks/useBuilderLayout';
import CustomBlock, { getCustomBlocks } from '../components/CustomBlock';

export default function About() {
  const { t } = useLang();
  const [customBlocks, setCustomBlocks] = useState<Record<string, any>>(() => getCustomBlocks());

  useEffect(() => {
    const sync = () => setCustomBlocks(getCustomBlocks());
    window.addEventListener('storage', sync);
    return () => window.removeEventListener('storage', sync);
  }, []);

  const { layout, isBuilder } = useBuilderLayout('about', { 
    order: ['about_main'], 
    hidden: [], 
    styles: {}, 
    images: {} 
  });

  const pageOrder = Array.isArray(layout?.order) && layout.order.length > 0 ? layout.order : ['about_main'];
  const hiddenBlocks = Array.isArray(layout?.hidden) ? layout.hidden : [];

  return (
    <div style={{ paddingTop: '150px', minHeight: '100vh', background: 'var(--background)', overflow: 'hidden' }}>
      {pageOrder.map((id: string, index: number) => {
        if (hiddenBlocks.includes(id)) return null;
        
        const blockStyle = layout?.styles?.[id] || {};

        if (id === 'about_main') {
          return (
            <BuilderWrapper 
              key={id} 
              id="about_main" 
              index={index} 
              isFirst={index === 0} 
              isLast={index === pageOrder.length - 1} 
              isBuilder={isBuilder} 
              style={blockStyle}
            >
              <div className="container">
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', color: 'var(--primary)', fontWeight: '800', fontSize: '0.8rem', letterSpacing: '0.3em', marginBottom: '2rem' }}>
                    <div style={{ width: '40px', height: '1px', background: 'var(--primary)' }}></div>
                    <InlineEdit tKey="nav_about" />
                  </div>
                  <h1 style={{ fontSize: 'clamp(3rem, 6vw, 6rem)', color: '#fff', marginBottom: '4rem', lineHeight: '0.9' }}>
                    <InlineEdit tKey="about_title" />
                  </h1>
                  
                  <div className="grid-2" style={{ gap: '6rem', alignItems: 'flex-start' }}>
                    <div>
                      <div className="industrial-card" style={{ marginBottom: '3rem' }}>
                        <div style={{ fontSize: '1.2rem', color: 'rgba(255,255,255,0.6)', lineHeight: '1.8', marginBottom: '2rem' }}>
                          <InlineEdit tKey="about_p1" />
                        </div>
                        <div style={{ fontSize: '1.2rem', color: 'rgba(255,255,255,0.6)', lineHeight: '1.8' }}>
                          <InlineEdit tKey="about_p2" />
                        </div>
                      </div>
                      
                      <div className="grid-2" style={{ gap: '1.5rem' }}>
                        {[
                          { val: '15+', label: 'about_stat_1' },
                          { val: '1000+', label: 'about_stat_2' }
                        ].map((stat, i) => (
                          <div key={i} style={{ padding: '3rem 2rem', background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', textAlign: 'center' }}>
                            <div style={{ fontSize: '3.5rem', fontWeight: '800', color: 'var(--primary)', marginBottom: '0.5rem' }}>{stat.val}</div>
                            <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.8rem', letterSpacing: '0.2em', fontWeight: '700' }}><InlineEdit tKey={stat.label} /></div>
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    <div style={{ display: 'grid', gap: '2rem' }}>
                      <motion.div 
                        whileHover={{ scale: 1.02 }}
                        style={{ height: '400px', borderRadius: 'var(--radius)', overflow: 'hidden', border: '1px solid var(--border)' }}
                      >
                        <img src={layout.images?.about_img_1 || "/corporate_about.png"} alt="Office" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      </motion.div>
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
                        <div style={{ height: '200px', borderRadius: 'var(--radius)', overflow: 'hidden', border: '1px solid var(--border)' }}>
                          <img src={layout.images?.about_img_2 || "/vibrant_hero.png"} alt="Industrial" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        </div>
                        <div style={{ height: '200px', background: 'var(--primary)', borderRadius: 'var(--radius)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem' }}>
                           <div style={{ color: '#000', fontWeight: '800', fontSize: '1.5rem', textAlign: 'center' }}>{t.stat_3.toUpperCase()}</div>
                        </div>
                      </div>
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
