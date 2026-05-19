import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, CheckCircle, Package, ArrowRight } from 'lucide-react';
import { useLang } from '../LangContext';
import { productsData } from '../i18n';

export default function ProductDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { lang, t } = useLang();

  const product = productsData.find(p => p.id === Number(id));

  if (!product) {
    return (
      <div style={{ paddingTop: '150px', textAlign: 'center', minHeight: '60vh', background: 'var(--background)' }}>
        <h2 style={{ color: 'var(--foreground)' }}>PRODUCT NOT FOUND</h2>
        <button onClick={() => navigate('/catalog')} className="btn-primary" style={{ marginTop: '2rem' }}>
          {t.ui_back_to_catalog}
        </button>
      </div>
    );
  }

  const p = product[lang];

  return (
    <div style={{ paddingTop: '150px', minHeight: '100vh', background: 'var(--background)' }}>
      <div className="container">
        <Link to="/catalog" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', color: 'rgba(255,255,255,0.4)', marginBottom: '4rem', fontSize: '0.9rem', fontWeight: '700', letterSpacing: '0.1em' }}>
          <ArrowLeft size={16} /> {t.ui_back_to_catalog}
        </Link>

        <div className="grid-2" style={{ gap: '6rem', marginBottom: '8rem', alignItems: 'start' }}>
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
            className="product-card"
          >
             <div style={{ position: 'absolute', top: '2rem', left: '2rem', zIndex: 5, padding: '0.5rem 1rem', background: 'rgba(0,0,0,0.8)', border: '1px solid var(--primary)', color: 'var(--primary)', fontSize: '0.7rem', fontWeight: '800', letterSpacing: '0.2em' }}>
              SERIAL_NO: DT-{product.id}00X
            </div>
            <img 
              src={product.image} 
              alt={p.title} 
              style={{ width: '100%', display: 'block' }} 
            />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', color: 'var(--primary)', fontWeight: '800', fontSize: '0.8rem', letterSpacing: '0.3em', marginBottom: '1.5rem' }}>
              <Package size={16} />
              {p.category.toUpperCase()}
            </div>
            
            <h1 style={{ fontSize: 'clamp(2.5rem, 5vw, 4.5rem)', color: 'var(--foreground)', lineHeight: '0.9', marginBottom: '2.5rem' }}>
              {p.title}
            </h1>
            
            <div className="industrial-card" style={{ marginBottom: '3.5rem' }}>
              <h3 style={{ color: 'var(--primary)', fontSize: '0.8rem', marginBottom: '1.5rem' }}>// {t.ui_description.toUpperCase()}</h3>
              <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '1.2rem', lineHeight: '1.8' }}>
                {p.desc}
              </p>
            </div>

            <div style={{ display: 'grid', gap: '1.5rem', marginBottom: '4rem' }}>
              {[
                t.stat_3,
                "Сертифицированная продукция",
                "Отгрузка со склада в день заказа"
              ].map((item, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '1rem', color: 'var(--foreground)', fontSize: '1.1rem' }}>
                  <CheckCircle size={20} style={{ color: 'var(--primary)' }} />
                  {item}
                </div>
              ))}
            </div>

            <a href="tel:+77009207012" className="btn-primary" style={{ width: '100%', justifyContent: 'center', padding: '1.5rem', fontSize: '1.1rem' }}>
              {t.ui_get_price} <ArrowRight size={20} />
            </a>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
