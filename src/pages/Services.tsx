import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Settings, Shield, Zap, Hammer, ArrowRight } from 'lucide-react';
import { servicesData } from '../i18n';
import { useLang, InlineEdit } from '../LangContext';
import { BuilderWrapper } from '../components/BuilderWrapper';
import { useBuilderLayout } from '../hooks/useBuilderLayout';
import CustomBlock, { getCustomBlocks } from '../components/CustomBlock';

export default function Services() {
  const { t, lang } = useLang();
  const [customBlocks, setCustomBlocks] = useState<Record<string, any>>(() => getCustomBlocks());

  const [servicesList, setServicesList] = useState(() => servicesData);

  useEffect(() => {
    const sync = () => {
      setCustomBlocks(getCustomBlocks());
      setServicesList([...servicesData]);
    };
    window.addEventListener('storage', sync);
    return () => window.removeEventListener('storage', sync);
  }, []);

  const { layout, isBuilder } = useBuilderLayout('services', { 
    order: ['services_main'], 
    hidden: [], 
    styles: {}, 
    images: {} 
  });

  

  const pageOrder = Array.isArray(layout?.order) && layout.order.length > 0 ? layout.order : ['services_main'];
  const hiddenBlocks = Array.isArray(layout?.hidden) ? layout.hidden : [];

  return (
    <div style={{ paddingTop: '150px', minHeight: '100vh', background: 'var(--background)', overflow: 'hidden' }}>
      {pageOrder.map((id: string, index: number) => {
        if (hiddenBlocks.includes(id)) return null;

        const blockStyle = layout?.styles?.[id] || {};

        if (id === 'services_main') {
          return (
            <BuilderWrapper 
              key={id} 
              id="services_main" 
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
                    <InlineEdit tKey="srv_subtitle" />
                  </div>
                  <h1 style={{ fontSize: 'clamp(3rem, 6vw, 6rem)', color: 'var(--foreground)', marginBottom: '4rem', lineHeight: '0.9' }}>
                    <InlineEdit tKey="srv_title_1" /> <span style={{ color: 'var(--primary)' }}><InlineEdit tKey="srv_title_2" /></span>
                  </h1>

                  <div style={{ display: 'grid', gap: '2rem', marginBottom: '8rem' }}>
                    {servicesList.map((srv, i) => {
                      const cardId = `srv_item_${srv.id || i}`;
                      const cardStyle = layout.styles?.[cardId] || {};
                      return (
                        <motion.div
                          key={srv.id || i}
                          whileHover={{ x: 20 }}
                          className="industrial-card service-item-card"
                          style={{ ...cardStyle }}
                        >
                          <BuilderWrapper id={cardId} isBuilder={isBuilder}>
                            <div className="service-item-grid">
                              <div style={{ 
                                color: 'var(--primary)', 
                                background: srv.mediaType === 'icon' ? 'rgba(0, 255, 65, 0.1)' : 'transparent', 
                                width: '100px', 
                                height: '100px', 
                                borderRadius: '16px', 
                                overflow: 'hidden', 
                                display: 'flex', 
                                alignItems: 'center', 
                                justifyContent: 'center',
                                flexShrink: 0
                              }}>
                                {srv.mediaType === 'video' ? (
                                  <video src={srv.mediaUrl} autoPlay loop muted playsInline style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                ) : srv.mediaType === 'image' ? (
                                  <img src={srv.mediaUrl} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                ) : (
                                  srv.iconType === 'Shield' ? <Shield size={32} /> :
                                  srv.iconType === 'Zap' ? <Zap size={32} /> :
                                  srv.iconType === 'Hammer' ? <Hammer size={32} /> :
                                  <Settings size={32} />
                                )}
                              </div>
                              <div style={{ flex: 1 }}>
                                <h3 style={{ fontSize: '2rem', color: 'var(--foreground)', marginBottom: '1rem' }}>
                                  {(srv as any)[lang]?.title || srv.ru?.title}
                                </h3>
                                <p style={{ color: 'var(--text-muted)', fontSize: '1.2rem', maxWidth: '800px' }}>
                                  {(srv as any)[lang]?.desc || srv.ru?.desc}
                                </p>
                              </div>
                              <div style={{ color: 'var(--primary)' }}>
                                <ArrowRight size={32} />
                              </div>
                            </div>
                          </BuilderWrapper>
                        </motion.div>
                      );
                    })}
                  </div>

                  <div className="industrial-card" style={{ padding: '8rem 4rem', textAlign: 'center', background: 'linear-gradient(135deg, var(--surface), var(--background))' }}>
                     <h2 style={{ fontSize: '3rem', color: 'var(--foreground)', marginBottom: '2rem' }}><InlineEdit tKey="srv_audit_title" /></h2>
                     <p style={{ fontSize: '1.4rem', color: 'var(--text-muted)', maxWidth: '800px', margin: '0 auto 4rem' }}>
                       <InlineEdit tKey="srv_audit_desc" />
                     </p>
                     <button className="btn-primary" style={{ padding: '1.5rem 4rem' }}><InlineEdit tKey="ui_audit" /></button>
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
