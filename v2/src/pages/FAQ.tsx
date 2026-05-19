import { motion } from 'framer-motion';
import { HelpCircle, ChevronDown } from 'lucide-react';
import { useState } from 'react';

const faqs = [
  { q: "Как осуществляется доставка оборудования?", a: "Мы работаем с крупнейшими транспортными компаниями Казахстана. Возможна доставка до склада заказчика или самовывоз из Караганды." },
  { q: "Предоставляете ли вы гарантию на услуги?", a: "Да, на все виды работ по стыковке и футеровке предоставляется официальная гарантия от 6 до 12 месяцев." },
  { q: "Какие способы оплаты вы принимаете?", a: "Мы работаем с юридическими лицами по безналичному расчету с предоставлением всех закрывающих документов." },
  { q: "Выезжаете ли вы в другие регионы Казахстана?", a: "Да, наши сервисные бригады мобильны и готовы к выезду в любую точку РК для проведения срочных работ." }
];

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <div style={{ paddingTop: '150px', minHeight: '100vh', background: 'var(--background)' }}>
      <div className="container">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', color: 'var(--primary)', fontWeight: '800', fontSize: '0.8rem', letterSpacing: '0.3em', marginBottom: '2rem' }}>
            <HelpCircle size={16} />
            KNOWLEDGE BASE
          </div>
          <h1 style={{ fontSize: 'clamp(3rem, 6vw, 6rem)', color: '#fff', marginBottom: '6rem', lineHeight: '0.9' }}>
            ВОПРОСЫ И <span style={{ color: 'var(--primary)' }}>ОТВЕТЫ</span>
          </h1>

          <div style={{ maxWidth: '900px', margin: '0 auto', display: 'grid', gap: '1rem', marginBottom: '8rem' }}>
            {faqs.map((faq, i) => (
              <div 
                key={i} 
                className="industrial-card" 
                style={{ padding: '2rem', cursor: 'pointer', border: openIndex === i ? '1px solid var(--primary)' : '1px solid var(--border)' }}
                onClick={() => setOpenIndex(openIndex === i ? null : i)}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <h3 style={{ fontSize: '1.25rem', color: '#fff', textTransform: 'none' }}>{faq.q}</h3>
                  <ChevronDown style={{ transform: openIndex === i ? 'rotate(180deg)' : 'none', transition: '0.3s', color: 'var(--primary)' }} />
                </div>
                {openIndex === i && (
                  <motion.p 
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    style={{ marginTop: '1.5rem', color: 'rgba(255,255,255,0.5)', fontSize: '1.1rem', lineHeight: '1.6', overflow: 'hidden' }}
                  >
                    {faq.a}
                  </motion.p>
                )}
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
