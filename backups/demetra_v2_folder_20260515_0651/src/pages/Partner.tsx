import { motion } from 'framer-motion';
import { Handshake, Target, Users, TrendingUp } from 'lucide-react';

export default function Partner() {
  return (
    <div style={{ paddingTop: '150px', minHeight: '100vh', background: 'var(--background)' }}>
      <div className="container">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', color: 'var(--primary)', fontWeight: '800', fontSize: '0.8rem', letterSpacing: '0.3em', marginBottom: '2rem' }}>
            <Handshake size={16} />
            B2B COLLABORATION
          </div>
          <h1 style={{ fontSize: 'clamp(3rem, 6vw, 6rem)', color: '#fff', marginBottom: '6rem', lineHeight: '0.9' }}>
            ПАРТНЕР<span style={{ color: 'var(--primary)' }}>СТВО</span>
          </h1>

          <div className="grid-2" style={{ gap: '6rem', marginBottom: '8rem' }}>
             <div className="industrial-card">
               <p style={{ fontSize: '1.4rem', color: '#fff', marginBottom: '2rem', lineHeight: '1.4' }}>Мы приглашаем к сотрудничеству промышленные предприятия и горно-обогатительные комплексы.</p>
               <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '1.1rem', lineHeight: '1.8' }}>ТОО «Деметра-2005» предлагает специальные условия для постоянных партнеров: приоритетное обслуживание, гибкие системы скидок и технический аудит оборудования на льготных условиях.</p>
             </div>
             <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
               {[
                 { icon: <Target />, label: 'ЦЕЛИ' },
                 { icon: <Users />, label: 'КОМАНДА' },
                 { icon: <TrendingUp />, label: 'РОСТ' },
                 { icon: <Handshake />, label: 'СВЯЗИ' }
               ].map((item, i) => (
                 <div key={i} className="industrial-card" style={{ padding: '2rem', textAlign: 'center' }}>
                   <div style={{ color: 'var(--primary)', marginBottom: '1rem' }}>{item.icon}</div>
                   <div style={{ color: '#fff', fontWeight: '800', fontSize: '0.7rem' }}>{item.label}</div>
                 </div>
               ))}
             </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
