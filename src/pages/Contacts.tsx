import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Phone, Mail, MapPin, Clock } from 'lucide-react';
import { useLang, InlineEdit } from '../LangContext';
import { BuilderWrapper } from '../components/BuilderWrapper';
import { useBuilderLayout } from '../hooks/useBuilderLayout';
import CustomBlock, { getCustomBlocks } from '../components/CustomBlock';

export default function Contacts() {
  const { t } = useLang();
  const [customBlocks, setCustomBlocks] = useState<Record<string, any>>(() => getCustomBlocks());

  useEffect(() => {
    const sync = () => setCustomBlocks(getCustomBlocks());
    window.addEventListener('storage', sync);
    return () => window.removeEventListener('storage', sync);
  }, []);

  const { layout, isBuilder } = useBuilderLayout('contacts', { 
    order: ['contacts_main'], 
    hidden: [], 
    styles: {}, 
    images: {} 
  });

  const pageOrder = Array.isArray(layout?.order) && layout.order.length > 0 ? layout.order : ['contacts_main'];
  const hiddenBlocks = Array.isArray(layout?.hidden) ? layout.hidden : [];

  return (
    <div style={{ paddingTop: '150px', minHeight: '100vh', background: 'var(--background)', overflow: 'hidden' }}>
      {pageOrder.map((id: string, index: number) => {
        if (hiddenBlocks.includes(id)) return null;

        const blockStyle = layout?.styles?.[id] || {};

        if (id === 'contacts_main') {
          return (
            <BuilderWrapper 
              key={id} 
              id="contacts_main" 
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
                    <InlineEdit tKey="contact_title" />
                  </div>
                  <h1 style={{ fontSize: 'clamp(3rem, 6vw, 6rem)', color: 'var(--foreground)', marginBottom: '4rem', lineHeight: '0.9' }}>
                    <InlineEdit tKey="contact_title" />
                  </h1>

                  <div className="grid-2" style={{ gap: '6rem', marginBottom: '6rem' }}>
                    <div style={{ display: 'grid', gap: '1.5rem' }}>
                      {[
                        { icon: <Phone />, label: 'contact_phone', val: t.company_phone, sub: 'contact_work_time' },
                        { icon: <Mail />, label: 'contact_email', val: t.company_email, sub: 'contact_email_sub' },
                        { icon: <MapPin />, label: 'contact_address', val: `${t.city}, ${t.address}`, sub: 'contact_address_sub' },
                        { icon: <Clock />, label: 'contact_schedule', val: t.contact_work_time, sub: 'contact_schedule_sub' }
                      ].map((item, i) => (
                        <div key={i} className="industrial-card" style={{ padding: '2rem', display: 'flex', gap: '2rem', alignItems: 'center' }}>
                          <div style={{ color: 'var(--primary)', background: 'rgba(0, 255, 65, 0.1)', padding: '1.5rem', borderRadius: '12px' }}>
                            {item.icon}
                          </div>
                          <div>
                            <div style={{ fontSize: '0.7rem', fontWeight: '800', color: 'var(--text-muted)', letterSpacing: '0.2em', marginBottom: '0.5rem' }}><InlineEdit tKey={item.label} /></div>
                            <div style={{ fontSize: '1.4rem', color: 'var(--foreground)', fontWeight: '700', marginBottom: '0.25rem' }}>{item.val}</div>
                            <div style={{ fontSize: '0.9rem', color: 'var(--text-muted)', opacity: 0.85 }}><InlineEdit tKey={item.sub} /></div>
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="industrial-card" style={{ padding: '4rem', borderColor: 'var(--primary)' }}>
                      <BuilderWrapper id="contact_form" isBuilder={isBuilder}>
                      <h3 style={{ fontSize: '2rem', color: 'var(--foreground)', marginBottom: '2.5rem' }}>{t.contact_btn.toUpperCase()}</h3>
                      <form style={{ display: 'grid', gap: '1.5rem' }}>
                        <div style={{ display: 'grid', gap: '0.5rem' }}>
                          <label style={{ color: 'var(--text-muted)', fontSize: '0.8rem', fontWeight: '700' }}><InlineEdit tKey="contact_form_name" /></label>
                          <input type="text" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border)', padding: '1rem', color: 'var(--foreground)', borderRadius: '8px' }} />
                        </div>
                        <div style={{ display: 'grid', gap: '0.5rem' }}>
                          <label style={{ color: 'var(--text-muted)', fontSize: '0.8rem', fontWeight: '700' }}><InlineEdit tKey="contact_form_phone" /></label>
                          <input type="tel" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border)', padding: '1rem', color: 'var(--foreground)', borderRadius: '8px' }} />
                        </div>
                        <div style={{ display: 'grid', gap: '0.5rem' }}>
                          <label style={{ color: 'var(--text-muted)', fontSize: '0.8rem', fontWeight: '700' }}><InlineEdit tKey="contact_form_msg" /></label>
                          <textarea rows={4} style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border)', padding: '1rem', color: 'var(--foreground)', borderRadius: '8px' }}></textarea>
                        </div>
                        <button type="button" className="btn-primary" style={{ padding: '1.5rem', marginTop: '1rem' }}><InlineEdit tKey="ui_send" /></button>
                      </form>
                      </BuilderWrapper>
                    </div>
                  </div>

                  {/* Map Placeholder */}
                  <div style={{ height: '500px', background: 'var(--surface)', borderRadius: 'var(--radius)', border: '1px solid var(--border)', position: 'relative', overflow: 'hidden', marginBottom: '8rem' }}>
                    <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', background: 'url(https://api-maps.yandex.ru/services/constructor/1.0/static/?um=constructor%3A7a6e7e7e7e7e7e7e7e7e7e7e7e7e7e7e&width=1200&height=500&lang=ru_RU) center/cover', opacity: 0.5 }}></div>
                    <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                       <div style={{ padding: '2rem', background: 'rgba(0,0,0,0.8)', border: '1px solid var(--primary)', color: 'var(--primary)', fontWeight: '800' }}>KARAGANDA_HUB_MAP_ACTIVE</div>
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
