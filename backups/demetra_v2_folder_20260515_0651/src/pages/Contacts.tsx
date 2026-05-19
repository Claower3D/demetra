import { motion } from 'framer-motion';
import { Phone, Mail, MapPin, Clock, MessageSquare } from 'lucide-react';
import { useLang } from '../LangContext';

export default function Contacts() {
  const { t } = useLang();

  return (
    <div style={{ paddingTop: '150px', minHeight: '100vh', background: 'var(--background)' }}>
      <div className="container">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', color: 'var(--primary)', fontWeight: '800', fontSize: '0.8rem', letterSpacing: '0.3em', marginBottom: '2rem' }}>
            <div style={{ width: '40px', height: '1px', background: 'var(--primary)' }}></div>
            DIRECT CHANNELS
          </div>
          <h1 style={{ fontSize: 'clamp(3rem, 6vw, 6rem)', color: 'var(--foreground)', marginBottom: '4rem', lineHeight: '0.9' }}>
            СВЯЖИТЕСЬ С <span style={{ color: 'var(--primary)' }}>НАМИ</span>
          </h1>

          <div className="grid-2" style={{ gap: '6rem', marginBottom: '6rem' }}>
            <div style={{ display: 'grid', gap: '1.5rem' }}>
              {[
                { icon: <Phone />, label: 'ТЕЛЕФОН', val: '+7 700 920 70 12', sub: 'Пн-Пт, 9:00 - 18:00' },
                { icon: <Mail />, label: 'EMAIL', val: 'info@demetra2005.kz', sub: 'Для коммерческих предложений' },
                { icon: <MapPin />, label: 'АДРЕС', val: 'г. Караганда, ул. Сатпаева 3/2', sub: 'Центральный офис' },
                { icon: <Clock />, label: 'ГРАФИК', val: '09:00 - 18:00', sub: 'Выходной: Сб, Вс' }
              ].map((item, i) => (
                <div key={i} className="industrial-card" style={{ padding: '2rem', display: 'flex', gap: '2rem', alignItems: 'center' }}>
                  <div style={{ color: 'var(--primary)', background: 'rgba(0, 255, 65, 0.1)', padding: '1.5rem', borderRadius: '12px' }}>
                    {item.icon}
                  </div>
                  <div>
                    <div style={{ fontSize: '0.7rem', fontWeight: '800', color: 'rgba(255,255,255,0.3)', letterSpacing: '0.2em', marginBottom: '0.5rem' }}>{item.label}</div>
                    <div style={{ fontSize: '1.4rem', color: 'var(--foreground)', fontWeight: '700', marginBottom: '0.25rem' }}>{item.val}</div>
                    <div style={{ fontSize: '0.9rem', color: 'rgba(255,255,255,0.4)' }}>{item.sub}</div>
                  </div>
                </div>
              ))}
            </div>

            <div className="industrial-card" style={{ padding: '4rem', borderColor: 'var(--primary)' }}>
              <h3 style={{ fontSize: '2rem', color: 'var(--foreground)', marginBottom: '2.5rem' }}>{t.contact_btn.toUpperCase()}</h3>
              <form style={{ display: 'grid', gap: '1.5rem' }}>
                <div style={{ display: 'grid', gap: '0.5rem' }}>
                  <label style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.8rem', fontWeight: '700' }}>ВАШЕ ИМЯ</label>
                  <input type="text" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border)', padding: '1rem', color: 'var(--foreground)', borderRadius: '8px' }} />
                </div>
                <div style={{ display: 'grid', gap: '0.5rem' }}>
                  <label style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.8rem', fontWeight: '700' }}>ТЕЛЕФОН</label>
                  <input type="tel" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border)', padding: '1rem', color: 'var(--foreground)', borderRadius: '8px' }} />
                </div>
                <div style={{ display: 'grid', gap: '0.5rem' }}>
                  <label style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.8rem', fontWeight: '700' }}>СООБЩЕНИЕ</label>
                  <textarea rows={4} style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border)', padding: '1rem', color: 'var(--foreground)', borderRadius: '8px' }}></textarea>
                </div>
                <button type="button" className="btn-primary" style={{ padding: '1.5rem', marginTop: '1rem' }}>{t.ui_send}</button>
              </form>
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
    </div>
  );
}
