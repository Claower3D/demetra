import { motion } from 'framer-motion';
import { Settings, Shield, Zap, Hammer, ArrowRight } from 'lucide-react';
import { useLang, InlineEdit } from '../LangContext';
import { BuilderWrapper } from '../components/BuilderWrapper';
import { useBuilderLayout } from '../hooks/useBuilderLayout';

export default function Services() {
  const { t } = useLang();
  const { layout, isBuilder } = useBuilderLayout('services', { order: [], hidden: [], styles: {}, images: {} });

  const services = [
    { icon: <Settings />, title: t.srv_1_title, desc: t.srv_1_desc, tKeyTitle: 'srv_1_title', tKeyDesc: 'srv_1_desc' },
    { icon: <Shield />, title: t.srv_2_title, desc: t.srv_2_desc, tKeyTitle: 'srv_2_title', tKeyDesc: 'srv_2_desc' },
    { icon: <Zap />, title: t.srv_3_title, desc: t.srv_3_desc, tKeyTitle: 'srv_3_title', tKeyDesc: 'srv_3_desc' },
    { icon: <Hammer />, title: t.srv_4_title, desc: t.srv_4_desc, tKeyTitle: 'srv_4_title', tKeyDesc: 'srv_4_desc' }
  ];

  const blockStyle = layout?.styles?.services_main || {};

  return (
    <div style={{ paddingTop: '150px', minHeight: '100vh', background: 'var(--background)', ...blockStyle }}>
      <BuilderWrapper id="services_main" isBuilder={isBuilder}>
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
            {services.map((srv, i) => {
              const cardId = `srv_item_${i}`;
              const cardStyle = layout.styles?.[cardId] || {};
              return (
                <motion.div
                  key={i}
                  whileHover={{ x: 20 }}
                  className="industrial-card"
                  style={{ padding: '4rem', display: 'grid', gridTemplateColumns: 'auto 1fr auto', gap: '4rem', alignItems: 'center', ...cardStyle }}
                >
                  <BuilderWrapper id={cardId} isBuilder={isBuilder}>
                    <div style={{ display: 'grid', gridTemplateColumns: 'auto 1fr auto', gap: '4rem', alignItems: 'center' }}>
                      <div style={{ color: 'var(--primary)', background: 'rgba(0, 255, 65, 0.1)', padding: '2rem', borderRadius: '16px' }}>
                        {srv.icon}
                      </div>
                      <div>
                        <h3 style={{ fontSize: '2rem', color: 'var(--foreground)', marginBottom: '1rem' }}><InlineEdit tKey={srv.tKeyTitle} /></h3>
                        <p style={{ color: 'var(--text-muted)', fontSize: '1.2rem', maxWidth: '800px' }}><InlineEdit tKey={srv.tKeyDesc} /></p>
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
    </div>
  );
}
