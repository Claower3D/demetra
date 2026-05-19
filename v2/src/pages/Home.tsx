import { useState, useEffect } from 'react';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import { ChevronRight, Activity, Cpu, Layers, ShieldCheck, Zap, Cog, ArrowUpRight, Handshake } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useLang } from '../LangContext';
import { productsData } from '../i18n';

export default function Home() {
  const { lang, t } = useLang();
  
  const slides = [
    { 
      img: "/conveyor_hero_bg.png", 
      title: t.hero_title_1, 
      subtitle: t.hero_title_2,
      desc: t.hero_subtitle
    },
    { 
      img: "/clean_services.png", 
      title: t.srv_title_1, 
      subtitle: t.srv_title_2,
      desc: t.srv_1_desc
    },
    { 
      img: "/rubber_lining.png", 
      title: t.partner_title, 
      subtitle: "STRATEGIC ASSET",
      desc: t.partner_desc
    }
  ];

  const [currentSlide, setCurrentSlide] = useState(0);
  const { scrollY } = useScroll();
  const yParallax = useTransform(scrollY, [0, 1000], [0, 300]);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [slides.length]);

  const bentoProducts = productsData.slice(0, 5);

  const mainServices = [
    { 
      icon: <Cpu size={40} />, 
      title: t.srv_1_title, 
      desc: t.srv_1_desc,
      id: "service-1"
    },
    { 
      icon: <Layers size={40} />, 
      title: t.srv_2_title, 
      desc: t.srv_2_desc,
      id: "service-2"
    },
    { 
      icon: <ShieldCheck size={40} />, 
      title: t.srv_3_title, 
      desc: t.srv_3_desc,
      id: "service-3"
    },
    { 
      icon: <Cog size={40} />, 
      title: t.srv_4_title, 
      desc: t.srv_4_desc,
      id: "service-4"
    }
  ];

  return (
    <div className="home-wrapper" style={{ background: 'var(--background)', color: 'var(--foreground)' }}>
      {/* Hero Section */}
      <section style={{ height: '100vh', position: 'relative', overflow: 'hidden', display: 'flex', alignItems: 'center' }}>
        <AnimatePresence mode="wait">
          <motion.div 
            key={currentSlide}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.5 }}
            style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}
          >
            <motion.img 
              style={{ width: '100%', height: '120%', objectFit: 'cover', filter: 'brightness(0.35)', y: yParallax }}
              src={slides[currentSlide].img} 
            />
          </motion.div>
        </AnimatePresence>

        <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', background: 'linear-gradient(to top, var(--background) 10%, transparent 50%)', zIndex: 2 }} />

        <div className="container hero-container" style={{ position: 'relative', zIndex: 10 }}>
          <div style={{ maxWidth: '1000px' }}>
            <AnimatePresence mode="wait">
              <motion.div
                key={currentSlide}
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 50 }}
                transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              >
                <div style={{ display: 'inline-flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem', color: 'var(--primary)', fontWeight: '800', fontSize: '0.8rem', letterSpacing: '0.3em', textTransform: 'uppercase' }}>
                  <Zap size={18} />
                  {t.hero_badge}
                </div>
                
                <h1 style={{ fontSize: 'clamp(3rem, 10vw, 8rem)', lineHeight: '0.85', marginBottom: '2rem', color: 'var(--foreground)' }}>
                  {slides[currentSlide].title} <br/>
                  <span style={{ color: 'var(--primary)' }}>{slides[currentSlide].subtitle}</span>
                </h1>
                
                <p style={{ fontSize: '1.4rem', color: 'var(--text-muted)', maxWidth: '700px', marginBottom: '4rem', lineHeight: '1.6', fontWeight: 500 }}>
                  {slides[currentSlide].desc}
                </p>
                
                <div style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap' }}>
                  <Link to="/catalog" className="btn-primary" style={{ padding: '1.5rem 3rem', fontSize: '1.1rem' }}>
                    {t.btn_catalog} <ChevronRight size={20} />
                  </Link>
                  <Link to="/services" className="btn-outline" style={{ padding: '1.5rem 3rem', fontSize: '1.1rem' }}>
                    {t.btn_services}
                  </Link>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </section>

      {/* Marquee Section */}
      <div className="marquee-container bg-blueprint">
        <div className="marquee-content">
          {[...Array(10)].map((_, i) => (
            <div key={i} className="marquee-item">
              DEMETRA-2005 / SYSTEM_ACTIVE / QUALITY_ASSURANCE / 
            </div>
          ))}
        </div>
      </div>

      {/* 1. Catalog Section */}
      <section className="section-padding bg-blueprint" style={{ borderBottom: '1px solid var(--border)' }}>
        <div className="container">
          <div className="section-header">
            <div>
              <div style={{ color: 'var(--primary)', fontWeight: '800', fontSize: '0.8rem', letterSpacing: '0.3em', marginBottom: '1rem' }}>EQUIPMENT INVENTORY</div>
              <h2 style={{ fontSize: 'clamp(2.5rem, 6vw, 4.5rem)', color: 'var(--foreground)' }}>
                {t.cat_title_1} <span style={{ color: 'var(--primary)' }}>{t.cat_title_2}</span>
              </h2>
            </div>
            <Link to="/catalog" className="btn-outline">{t.btn_catalog} <ChevronRight size={18} /></Link>
          </div>

          <motion.div 
            className="bento-grid" 
            style={{ gridAutoRows: 'minmax(350px, auto)' }}
            layout
          >
            {bentoProducts.map((item, i) => (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                key={item.id}
                className="product-card"
                style={{
                  gridColumn: i === 0 ? 'span 2' : 'span 1',
                  gridRow: i === 0 ? 'span 2' : 'span 1'
                }}
              >
                <Link to={`/product/${item.id}`} style={{ display: 'block', height: '100%' }}>
                  <img src={item.image} alt={item[lang]?.title || ''} />
                  <div className="product-info">
                    <div style={{ color: 'var(--primary)', fontSize: '0.9rem', fontWeight: '800', marginBottom: '0.5rem' }}>◆ {item[lang]?.category}</div>
                    <h3 style={{ fontSize: i === 0 ? '3rem' : '1.5rem', color: 'var(--foreground)' }}>{item[lang]?.title}</h3>
                  </div>
                </Link>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* 2. Partnership Section */}
      <section className="section-padding bg-carbon">
        <div className="container">
          <div className="industrial-card" style={{ padding: 'clamp(2rem, 5vw, 6rem)' }}>
            <div className="grid-2" style={{ alignItems: 'center' }}>
              <div>
                <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.75rem', color: 'var(--primary)', fontWeight: '800', fontSize: '0.8rem', letterSpacing: '0.3em', marginBottom: '2rem' }}>
                  <Handshake size={20} />
                  {t.partner_title}
                </div>
                <h2 style={{ fontSize: 'clamp(2rem, 5vw, 4rem)', color: 'var(--foreground)', marginBottom: '2rem', lineHeight: '1.1' }}>
                  {t.partner_subtitle}
                </h2>
                <p style={{ color: 'var(--text-muted)', fontSize: '1.2rem', lineHeight: '1.7', marginBottom: '3rem' }}>
                  {t.partner_desc}
                </p>
                <div style={{ display: 'grid', gap: '1.5rem', marginBottom: '4rem' }}>
                  {[t.partner_feat_1, t.partner_feat_2, t.partner_feat_3].map((feat, i) => (
                    <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '1rem', color: 'var(--foreground)', fontWeight: '700' }}>
                      <div style={{ width: '8px', height: '8px', background: 'var(--primary)', borderRadius: '50%' }}></div>
                      {feat}
                    </div>
                  ))}
                </div>
                <Link to="/partner" className="btn-primary" style={{ padding: '1.5rem 3rem' }}>{t.nav_partner}</Link>
              </div>
              <div style={{ position: 'relative' }} className="responsive-hide">
                <img src="/corporate_about.png" alt="Partnership" style={{ width: '100%', borderRadius: 'var(--radius)', filter: 'grayscale(0.5) brightness(1.1)' }} />
                <div style={{ position: 'absolute', bottom: '-2rem', left: '-2rem', background: 'var(--primary)', color: '#000', padding: '2rem', borderRadius: 'var(--radius)', fontWeight: '900', fontSize: '1.5rem' }}>
                  15+ YEARS
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Services Section */}
      <section className="section-padding bg-topo">
        <div className="container">
          <div className="section-header">
            <div>
              <div style={{ color: 'var(--primary)', fontWeight: '800', fontSize: '0.8rem', letterSpacing: '0.3em', marginBottom: '1rem' }}>SERVICES OVERVIEW</div>
              <h2 style={{ fontSize: 'clamp(2.5rem, 6vw, 4.5rem)', color: 'var(--foreground)', lineHeight: '1' }}>
                {t.srv_title_1} <span style={{ color: 'var(--primary)' }}>{t.srv_title_2}</span>
              </h2>
            </div>
            <Link to="/services" className="btn-outline">
              {t.btn_services} <ArrowUpRight size={18} />
            </Link>
          </div>
          
          <div className="grid-2">
            {mainServices.map((service, i) => (
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: i * 0.1 }}
                key={service.id}
                className="industrial-card"
                style={{ padding: '4rem' }}
              >
                <div style={{ color: 'var(--primary)', marginBottom: '2.5rem' }}>{service.icon}</div>
                <h3 style={{ fontSize: '1.8rem', color: 'var(--foreground)', marginBottom: '1.5rem' }}>{service.title}</h3>
                <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem', lineHeight: '1.7', marginBottom: '2.5rem' }}>{service.desc}</p>
                <Link to="/services" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', color: 'var(--primary)', fontWeight: '800', fontSize: '0.8rem', letterSpacing: '0.1em' }}>
                  LEARN MORE <ChevronRight size={16} />
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="section-padding bg-gradient-tech">
        <div className="container">
          <div
            className="industrial-card"
            style={{ padding: 'clamp(4rem, 10vw, 8rem) 1.5rem', textAlign: 'center', borderColor: 'var(--primary)', background: 'transparent' }}
          >
            <h2 style={{ fontSize: 'clamp(2.5rem, 8vw, 5rem)', color: 'var(--foreground)', marginBottom: '2rem' }}>{t.cta_title}</h2>
            <p style={{ fontSize: '1.5rem', color: 'var(--text-muted)', maxWidth: '800px', margin: '0 auto 4rem' }}>
              {t.footer_desc}
            </p>
            <div style={{ display: 'flex', gap: '2rem', justifyContent: 'center', flexWrap: 'wrap' }}>
              <Link to="/contacts" className="btn-primary" style={{ padding: '1.5rem 4rem' }}>{t.contact_btn}</Link>
              <Link to="/services" className="btn-outline" style={{ padding: '1.5rem 4rem' }}>{t.nav_service}</Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
