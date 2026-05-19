import { motion } from 'framer-motion';
import { CreditCard, Truck, ShieldCheck, Wallet } from 'lucide-react';
import { InlineEdit } from '../LangContext';
import { BuilderWrapper } from '../components/BuilderWrapper';
import { useBuilderLayout } from '../hooks/useBuilderLayout';

export default function Pay() {
  const { isBuilder } = useBuilderLayout('pay', {});
  
  const paymentItems = [
    { icon: <CreditCard />, tKey: 'pay_t1', dKey: 'pay_d1' },
    { icon: <Truck />, tKey: 'pay_t2', dKey: 'pay_d2' },
    { icon: <ShieldCheck />, tKey: 'pay_t3', dKey: 'pay_d3' },
    { icon: <Wallet />, tKey: 'pay_t4', dKey: 'pay_d4' }
  ];

  return (
    <div style={{ paddingTop: '150px', minHeight: '100vh', background: 'var(--background)' }}>
      <div className="container">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', color: 'var(--primary)', fontWeight: '800', fontSize: '0.8rem', letterSpacing: '0.3em', marginBottom: '2rem' }}>
            <Wallet size={16} />
            <InlineEdit tKey="nav_pay" />
          </div>
          <h1 style={{ fontSize: 'clamp(3rem, 6vw, 6rem)', color: 'var(--foreground)', marginBottom: '6rem', lineHeight: '0.9' }}>
            <InlineEdit tKey="pay_title" />
          </h1>

          <div className="grid-2" style={{ gap: '2rem', marginBottom: '8rem' }}>
            {paymentItems.map((item, i) => (
              <BuilderWrapper key={i} id={`pay_item_${i}`} isBuilder={isBuilder}>
                <div className="industrial-card" style={{ padding: '3rem', height: '100%' }}>
                  <div style={{ color: 'var(--primary)', marginBottom: '1.5rem' }}>{item.icon}</div>
                  <h3 style={{ fontSize: '1.5rem', color: 'var(--foreground)', marginBottom: '1rem' }}><InlineEdit tKey={item.tKey} /></h3>
                  <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem' }}><InlineEdit tKey={item.dKey} /></p>
                </div>
              </BuilderWrapper>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
