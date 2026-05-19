import { motion } from 'framer-motion';
import { Settings, Shield, Zap, Hammer, ArrowRight } from 'lucide-react';
import { useLang } from '../LangContext';

export default function Services() {
  const { t } = useLang();

  const services = [
    { icon: <Settings />, title: t.srv_1_title, desc: t.srv_1_desc },
    { icon: <Shield />, title: t.srv_2_title, desc: t.srv_2_desc },
    { icon: <Zap />, title: t.srv_3_title, desc: t.srv_3_desc },
    { icon: <Hammer />, title: t.srv_4_title, desc: t.srv_4_desc }
  ];

  return (
    <div style={{ paddingTop: '150px', minHeight: '100vh', background: 'var(--background)' }}>
      <div className="container">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', color: 'var(--primary)', fontWeight: '800', fontSize: '0.8rem', letterSpacing: '0.3em', marginBottom: '2rem' }}>
            <div style={{ width: '40px', height: '1px', background: 'var(--primary)' }}></div>
            SERVICE CAPABILITIES
          </div>
          <h1 style={{ fontSize: 'clamp(3rem, 6vw, 6rem)', color: '#fff', marginBottom: '4rem', lineHeight: '0.9' }}>
            НАШИ <span style={{ color: 'var(--primary)' }}>УСЛУГИ</span>
          </h1>

          <div style={{ display: 'grid', gap: '2rem', marginBottom: '8rem' }}>
            {services.map((srv, i) => (
              <motion.div
                key={i}
                whileHover={{ x: 20 }}
                className="industrial-card"
                style={{ padding: '4rem', display: 'grid', gridTemplateColumns: 'auto 1fr auto', gap: '4rem', alignItems: 'center' }}
              >
                <div style={{ color: 'var(--primary)', background: 'rgba(0, 255, 65, 0.1)', padding: '2rem', borderRadius: '16px' }}>
                  {srv.icon}
                </div>
                <div>
                  <h3 style={{ fontSize: '2rem', color: '#fff', marginBottom: '1rem' }}>{srv.title}</h3>
                  <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '1.2rem', maxWidth: '800px' }}>{srv.desc}</p>
                </div>
                <div style={{ color: 'var(--primary)' }}>
                  <ArrowRight size={32} />
                </div>
              </motion.div>
            ))}
          </div>

          <div className="industrial-card" style={{ padding: '8rem 4rem', textAlign: 'center', background: 'linear-gradient(135deg, var(--surface), #000)' }}>
             <h2 style={{ fontSize: '3rem', color: '#fff', marginBottom: '2rem' }}>НУЖЕН АУДИТ ОБОРУДОВАНИЯ?</h2>
             <p style={{ fontSize: '1.4rem', color: 'rgba(255,255,255,0.4)', maxWidth: '800px', margin: '0 auto 4rem' }}>
               Наши специалисты готовы выехать на ваш объект для проведения полной диагностики ваших конвейерных систем.
             </p>
             <button className="btn-primary" style={{ padding: '1.5rem 4rem' }}>ЗАПИСАТЬСЯ НА АУДИТ</button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
