import { motion } from 'framer-motion';
import { CreditCard, Truck, ShieldCheck, Wallet } from 'lucide-react';

export default function Pay() {
  return (
    <div style={{ paddingTop: '150px', minHeight: '100vh', background: 'var(--background)' }}>
      <div className="container">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', color: 'var(--primary)', fontWeight: '800', fontSize: '0.8rem', letterSpacing: '0.3em', marginBottom: '2rem' }}>
            <Wallet size={16} />
            TRANSACTION POLICY
          </div>
          <h1 style={{ fontSize: 'clamp(3rem, 6vw, 6rem)', color: '#fff', marginBottom: '6rem', lineHeight: '0.9' }}>
            ОПЛАТА И <span style={{ color: 'var(--primary)' }}>ДОСТАВКА</span>
          </h1>

          <div className="grid-2" style={{ gap: '2rem', marginBottom: '8rem' }}>
            {[
              { icon: <CreditCard />, title: "БЕЗНАЛИЧНЫЙ РАСЧЕТ", desc: "Оплата производится по выставленному счету для юридических лиц." },
              { icon: <Truck />, title: "ДОСТАВКА ПО РК", desc: "Осуществляем доставку оборудования во все регионы Казахстана." },
              { icon: <ShieldCheck />, title: "ГАРАНТИЯ БЕЗОПАСНОСТИ", desc: "Все сделки сопровождаются полным пакетом документов." },
              { icon: <Wallet />, title: "ГИБКИЕ УСЛОВИЯ", desc: "Для постоянных партнеров возможна отсрочка платежа." }
            ].map((item, i) => (
              <div key={i} className="industrial-card" style={{ padding: '3rem' }}>
                <div style={{ color: 'var(--primary)', marginBottom: '1.5rem' }}>{item.icon}</div>
                <h3 style={{ fontSize: '1.5rem', color: '#fff', marginBottom: '1rem' }}>{item.title}</h3>
                <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '1.1rem' }}>{item.desc}</p>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
