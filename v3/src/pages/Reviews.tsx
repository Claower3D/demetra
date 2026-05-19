import { motion } from 'framer-motion';
import { Quote, Star } from 'lucide-react';
import { useLang } from '../LangContext';

export default function Reviews() {
  const { t } = useLang();

  const reviews = [
    { text: t.review_1, author: t.review_1_author },
    { text: t.review_2, author: t.review_2_author }
  ];

  return (
    <div style={{ paddingTop: '150px', minHeight: '100vh', background: 'var(--background)' }}>
      <div className="container">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', color: 'var(--primary)', fontWeight: '800', fontSize: '0.8rem', letterSpacing: '0.3em', marginBottom: '2rem' }}>
            <Quote size={16} />
            CLIENT FEEDBACK
          </div>
          <h1 style={{ fontSize: 'clamp(3rem, 6vw, 6rem)', color: '#fff', marginBottom: '6rem', lineHeight: '0.9' }}>
            ОТЗЫВЫ <span style={{ color: 'var(--primary)' }}>КЛИЕНТОВ</span>
          </h1>

          <div style={{ display: 'grid', gap: '2rem', marginBottom: '8rem' }}>
            {reviews.map((rev, i) => (
              <motion.div key={i} className="industrial-card" style={{ padding: '4rem' }}>
                <div style={{ display: 'flex', gap: '0.5rem', color: 'var(--primary)', marginBottom: '2rem' }}>
                  {[...Array(5)].map((_, j) => <Star key={j} size={16} fill="currentColor" />)}
                </div>
                <p style={{ fontSize: '1.5rem', color: '#fff', fontStyle: 'italic', marginBottom: '2.5rem', lineHeight: '1.6' }}>"{rev.text}"</p>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                  <div style={{ width: '40px', height: '2px', background: 'var(--primary)' }}></div>
                  <div style={{ color: 'rgba(255,255,255,0.4)', fontWeight: '700', fontSize: '0.9rem', letterSpacing: '0.1em' }}>{rev.author}</div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
