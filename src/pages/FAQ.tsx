import { motion } from 'framer-motion';
import { HelpCircle, ChevronDown } from 'lucide-react';
import { useState } from 'react';
import { useLang, InlineEdit } from '../LangContext';
import { BuilderWrapper } from '../components/BuilderWrapper';
import { useBuilderLayout } from '../hooks/useBuilderLayout';

export default function FAQ() {
  const { isBuilder } = useBuilderLayout('faq', {});
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqs = [
    { qKey: 'faq_q1', aKey: 'faq_a1' },
    { qKey: 'faq_q2', aKey: 'faq_a2' },
    { qKey: 'faq_q3', aKey: 'faq_a3' },
    { qKey: 'faq_q4', aKey: 'faq_a4' }
  ];

  return (
    <div style={{ paddingTop: '150px', minHeight: '100vh', background: 'var(--background)' }}>
      <div className="container">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', color: 'var(--primary)', fontWeight: '800', fontSize: '0.8rem', letterSpacing: '0.3em', marginBottom: '2rem' }}>
            <HelpCircle size={16} />
            <InlineEdit tKey="nav_faq" />
          </div>
          <h1 style={{ fontSize: 'clamp(3rem, 6vw, 6rem)', color: 'var(--foreground)', marginBottom: '6rem', lineHeight: '0.9' }}>
            <InlineEdit tKey="faq_title" />
          </h1>

          <div style={{ maxWidth: '900px', margin: '0 auto', display: 'grid', gap: '1rem', marginBottom: '8rem' }}>
            {faqs.map((faq, i) => (
              <BuilderWrapper key={i} id={`faq_item_${i}`} isBuilder={isBuilder}>
                <div 
                  className="industrial-card" 
                  style={{ padding: '2rem', cursor: 'pointer', border: openIndex === i ? '1px solid var(--primary)' : '1px solid var(--border)' }}
                  onClick={() => setOpenIndex(openIndex === i ? null : i)}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <h3 style={{ fontSize: '1.25rem', color: 'var(--foreground)', textTransform: 'none' }}><InlineEdit tKey={faq.qKey} /></h3>
                    <ChevronDown style={{ transform: openIndex === i ? 'rotate(180deg)' : 'none', transition: '0.3s', color: 'var(--primary)' }} />
                  </div>
                  {openIndex === i && (
                    <motion.p 
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      style={{ marginTop: '1.5rem', color: 'var(--text-muted)', fontSize: '1.1rem', lineHeight: '1.6', overflow: 'hidden' }}
                    >
                      <InlineEdit tKey={faq.aKey} />
                    </motion.p>
                  )}
                </div>
              </BuilderWrapper>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
