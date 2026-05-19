import { motion } from 'framer-motion';
import { useLang } from '../LangContext';

export default function About() {
  const { t } = useLang();

  return (
    <div style={{ paddingTop: '150px', minHeight: '100vh', background: 'var(--background)' }}>
      <div className="container">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', color: 'var(--primary)', fontWeight: '800', fontSize: '0.8rem', letterSpacing: '0.3em', marginBottom: '2rem' }}>
            <div style={{ width: '40px', height: '1px', background: 'var(--primary)' }}></div>
            CORPORATE PROFILE
          </div>
          <h1 style={{ fontSize: 'clamp(3rem, 6vw, 6rem)', color: '#fff', marginBottom: '4rem', lineHeight: '0.9' }}>
            О <span style={{ color: 'var(--primary)' }}>КОМПАНИИ</span>
          </h1>
          
          <div className="grid-2" style={{ gap: '6rem', alignItems: 'flex-start' }}>
            <div>
              <div className="industrial-card" style={{ marginBottom: '3rem' }}>
                <p style={{ fontSize: '1.2rem', color: 'rgba(255,255,255,0.6)', lineHeight: '1.8', marginBottom: '2rem' }}>
                  ТОО «Деметра-2005» основана в 2005 году. Наша специализация — это качественный ремонт, стыковка конвейерных лент методом горячей и холодной вулканизации, футеровка барабанов конвейеров, а также поставка материалов.
                </p>
                <p style={{ fontSize: '1.2rem', color: 'rgba(255,255,255,0.6)', lineHeight: '1.8' }}>
                  Мы являемся официальными партнерами крупнейших производителей и предлагаем инновационные решения, которые гарантируют безостановочную работу вашего производства.
                </p>
              </div>
              
              <div className="grid-2" style={{ gap: '1.5rem' }}>
                {[
                  { val: '15+', label: 'ЛЕТ ОПЫТА' },
                  { val: '1000+', label: 'ПРОЕКТОВ' }
                ].map((stat, i) => (
                  <div key={i} style={{ padding: '3rem 2rem', background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', textAlign: 'center' }}>
                    <div style={{ fontSize: '3.5rem', fontWeight: '800', color: 'var(--primary)', marginBottom: '0.5rem' }}>{stat.val}</div>
                    <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.8rem', letterSpacing: '0.2em', fontWeight: '700' }}>{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>
            
            <div style={{ display: 'grid', gap: '2rem' }}>
              <motion.div 
                whileHover={{ scale: 1.02 }}
                style={{ height: '400px', borderRadius: 'var(--radius)', overflow: 'hidden', border: '1px solid var(--border)' }}
              >
                <img src="/corporate_about.png" alt="Office" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              </motion.div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
                <div style={{ height: '200px', borderRadius: 'var(--radius)', overflow: 'hidden', border: '1px solid var(--border)' }}>
                  <img src="/vibrant_hero.png" alt="Industrial" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </div>
                <div style={{ height: '200px', background: 'var(--primary)', borderRadius: 'var(--radius)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem' }}>
                   <div style={{ color: '#000', fontWeight: '800', fontSize: '1.5rem', textAlign: 'center' }}>QUALITY GUARANTEED</div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
