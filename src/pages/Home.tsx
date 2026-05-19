import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight, Zap, Cog, Cpu, Layers, ShieldCheck, Handshake } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useLang, InlineEdit } from '../LangContext';
import { productsData } from '../i18n';
import { BuilderWrapper } from '../components/BuilderWrapper';
import { useBuilderLayout } from '../hooks/useBuilderLayout';

export default function Home() {
  const { lang } = useLang();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [yParallax, setYParallax] = useState(0);

  const { layout, isBuilder } = useBuilderLayout('home', {
    order: ['hero', 'marquee', 'catalog', 'partnership', 'services', 'cta'],
    hidden: [],
    styles: {},
    images: {}
  });

  const slides = [
    { 
      img: layout?.images?.hero_1 || "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&q=80", 
      titleKey: 'hero_title_1', 
      subtitleKey: 'hero_title_2', 
      descKey: 'hero_subtitle' 
    },
    { 
      img: layout?.images?.hero_2 || "https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122?auto=format&fit=crop&q=80", 
      titleKey: 'hero_title_3', 
      subtitleKey: 'hero_badge', 
      descKey: 'hero_subtitle' 
    }
  ];

  useEffect(() => {
    const handleScroll = () => setYParallax(window.scrollY * 0.5);
    window.addEventListener('scroll', handleScroll);
    const timer = setInterval(() => setCurrentSlide(prev => (prev + 1) % slides.length), 8000);
    return () => {
      window.removeEventListener('scroll', handleScroll);
      clearInterval(timer);
    };
  }, [slides.length]);

  const defaultCatalogOrder = productsData.slice(0, 5).map(p => p.id);
  const catalogOrder = Array.isArray(layout?.order_catalog) ? layout.order_catalog : defaultCatalogOrder;

  const mainServicesDict: any = {
    "service-1": { icon: <Cpu size={40} />, titleKey: 'srv_1_title', descKey: 'srv_1_desc', id: "service-1" },
    "service-2": { icon: <Layers size={40} />, titleKey: 'srv_2_title', descKey: 'srv_2_desc', id: "service-2" },
    "service-3": { icon: <ShieldCheck size={40} />, titleKey: 'srv_3_title', descKey: 'srv_3_desc', id: "service-3" },
    "service-4": { icon: <Cog size={40} />, titleKey: 'srv_4_title', descKey: 'srv_4_desc', id: "service-4" }
  };
  const servicesOrder = Array.isArray(layout?.order_services) ? layout.order_services : ["service-1", "service-2", "service-3", "service-4"];
  const pageOrder = (Array.isArray(layout?.order) && layout.order.length > 0) ? layout.order : ['hero', 'marquee', 'catalog', 'partnership', 'services', 'cta'];
  const hiddenBlocks = Array.isArray(layout?.hidden) ? layout.hidden : [];

  const renderSection = (id: string, index: number) => {
    if (hiddenBlocks.includes(id)) return null;

    const blockStyle = layout?.styles?.[id] || {};
    
    let content = null;
    switch (id) {
      case 'hero':
        content = (
          <section key="hero" style={{ height: '100vh', position: 'relative', overflow: 'hidden', display: 'flex', alignItems: 'center', ...blockStyle }}>
            <AnimatePresence mode="wait">
              <motion.div key={currentSlide} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 1.5 }} style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}>
                <motion.img style={{ width: '100%', height: '120%', objectFit: 'cover', filter: 'brightness(0.35)', y: yParallax }} src={slides[currentSlide].img} />
              </motion.div>
            </AnimatePresence>
            <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', background: 'linear-gradient(to top, var(--background) 10%, transparent 50%)', zIndex: 2 }} />
            <div className="container hero-container" style={{ position: 'relative', zIndex: 10 }}>
              <div style={{ maxWidth: '1000px' }}>
                <AnimatePresence mode="wait">
                  <motion.div key={currentSlide} initial={{ opacity: 0, x: -50 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 50 }} transition={{ duration: 0.8 }}>
                    <div style={{ display: 'inline-flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem', color: 'var(--primary)', fontWeight: '800', fontSize: '0.8rem', letterSpacing: '0.3em', textTransform: 'uppercase' }}><Zap size={18} /> <InlineEdit tKey="hero_badge" /></div>
                    <h1 style={{ fontSize: 'clamp(3rem, 10vw, 8rem)', lineHeight: '0.85', marginBottom: '2rem' }}><InlineEdit tKey={slides[currentSlide].titleKey} /> <br/><span style={{ color: 'var(--primary)' }}><InlineEdit tKey={slides[currentSlide].subtitleKey} /></span></h1>
                    <p style={{ fontSize: '1.4rem', color: 'var(--text-muted)', maxWidth: '700px', marginBottom: '4rem', lineHeight: '1.6' }}><InlineEdit tKey={slides[currentSlide].descKey} /></p>
                    <div style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap' }}>
                      <BuilderWrapper id="btn_hero_catalog" isBuilder={isBuilder}>
                        <Link to={layout?.links?.btn_hero_catalog || "/catalog"} className="btn-primary" style={{ padding: '1.5rem 3rem', ...(layout?.styles?.btn_hero_catalog || {}) }}><InlineEdit tKey="btn_catalog" /> <ChevronRight size={20} /></Link>
                      </BuilderWrapper>
                      <BuilderWrapper id="btn_hero_services" isBuilder={isBuilder}>
                        <Link to={layout?.links?.btn_hero_services || "/services"} className="btn-outline" style={{ padding: '1.5rem 3rem', ...(layout?.styles?.btn_hero_services || {}) }}><InlineEdit tKey="btn_services" /></Link>
                      </BuilderWrapper>
                    </div>
                  </motion.div>
                </AnimatePresence>
              </div>
            </div>
          </section>
        );
        break;
      case 'marquee':
        content = (
          <div key="marquee" className="marquee-container bg-blueprint" style={{ ...blockStyle }}>
            <div className="marquee-content">{[...Array(10)].map((_, i) => (<div key={i} className="marquee-item">DEMETRA-2005 / SYSTEM_ACTIVE / QUALITY_ASSURANCE / </div>))}</div>
          </div>
        );
        break;
      case 'catalog':
        content = (
          <section key="catalog" className="section-padding bg-blueprint" style={{ borderBottom: '1px solid var(--border)', ...blockStyle }}>
            <div className="container">
              <div className="section-header"><div><div style={{ color: 'var(--primary)', fontWeight: '800', fontSize: '0.8rem', letterSpacing: '0.3em', marginBottom: '1rem' }}>EQUIPMENT INVENTORY</div><h2 style={{ fontSize: 'clamp(2.5rem, 6vw, 4.5rem)' }}><InlineEdit tKey="cat_title_1" /> <span style={{ color: 'var(--primary)' }}><InlineEdit tKey="cat_title_2" /></span></h2></div><Link to="/catalog" className="btn-outline"><InlineEdit tKey="btn_catalog" /> <ChevronRight size={18} /></Link></div>
              <div className="catalog-grid-asymmetric">
                {/* Left Side: Big Block */}
                <div>
                  {catalogOrder.slice(0, 1).map((prodId: any) => {
                     const item = productsData.find(p => String(p.id) === String(prodId)) || productsData[0];
                     const blockId = `cat_${prodId}`;
                     const style = layout?.styles?.[blockId] || {};
                     return (
                       <BuilderWrapper key={blockId} id={blockId} index={0} isFirst={true} isLast={false} isBuilder={isBuilder} arrayKey="order_catalog" style={style}>
                         <div className="product-card" style={{ height: '700px' }}>
                           <Link to={`/product/${item.id}`} style={{ display: 'block', height: '100%' }}>
                             <img src={layout?.images?.[`${blockId}_img`] || item.image} alt="" style={{ height: '100%', objectFit: 'cover' }} />
                             <div className="product-info" style={{ padding: '4rem' }}>
                               <div style={{ color: 'var(--primary)', fontSize: '1rem', fontWeight: '800', marginBottom: '0.75rem' }}>◆ {item[lang]?.category}</div>
                               <h3 style={{ fontSize: '3rem', fontWeight: '950', lineHeight: '1.1' }}>{item[lang]?.title}</h3>
                             </div>
                           </Link>
                         </div>
                       </BuilderWrapper>
                     );
                  })}
                </div>

                {/* Right Side: 2x2 grid of small blocks */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gridAutoRows: '335px', gap: '2rem' }} className="catalog-right-grid">
                  {catalogOrder.slice(1, 5).map((prodId: any, i: number) => {
                     const item = productsData.find(p => String(p.id) === String(prodId)) || productsData[0];
                     const blockId = `cat_${prodId}`;
                     const style = layout?.styles?.[blockId] || {};
                     return (
                       <BuilderWrapper key={blockId} id={blockId} index={i + 1} isFirst={false} isLast={i + 1 === catalogOrder.length - 1} isBuilder={isBuilder} arrayKey="order_catalog" style={style}>
                         <div className="product-card" style={{ height: '100%' }}>
                           <Link to={`/product/${item.id}`} style={{ display: 'block', height: '100%' }}>
                             <img src={layout?.images?.[`${blockId}_img`] || item.image} alt="" style={{ height: '100%', objectFit: 'cover' }} />
                             <div className="product-info" style={{ padding: '2rem' }}>
                               <div style={{ color: 'var(--primary)', fontSize: '0.8rem', fontWeight: '800', marginBottom: '0.5rem' }}>◆ {item[lang]?.category}</div>
                               <h3 style={{ fontSize: '1.3rem', fontWeight: '800' }}>{item[lang]?.title}</h3>
                             </div>
                           </Link>
                         </div>
                       </BuilderWrapper>
                     );
                  })}
                </div>
              </div>
            </div>
          </section>
        );
        break;
      case 'partnership':
        content = (
          <section key="partnership" className="section-padding bg-carbon" style={{ ...blockStyle }}>
            <div className="container">
              <div className="industrial-card" style={{ padding: 'clamp(2rem, 5vw, 6rem)' }}>
                <div className="grid-2" style={{ alignItems: 'center' }}>
                  <div>
                    <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.75rem', color: 'var(--primary)', fontWeight: '800', fontSize: '0.8rem', letterSpacing: '0.3em', marginBottom: '2rem' }}><Handshake size={20} /> <InlineEdit tKey="partner_title" /></div>
                    <h2 style={{ fontSize: 'clamp(2rem, 5vw, 4rem)', marginBottom: '2rem', lineHeight: '1.1' }}><InlineEdit tKey="partner_subtitle" /></h2>
                    <p style={{ color: 'var(--text-muted)', fontSize: '1.2rem', lineHeight: '1.7', marginBottom: '3rem' }}><InlineEdit tKey="partner_desc" /></p>
                    <div style={{ display: 'grid', gap: '1.5rem', marginBottom: '4rem' }}>{[1, 2, 3].map((num) => (<div key={num} style={{ display: 'flex', alignItems: 'center', gap: '1rem', fontWeight: '700' }}><div style={{ width: '8px', height: '8px', background: 'var(--primary)', borderRadius: '50%' }}></div> <InlineEdit tKey={`partner_feat_${num}`} /></div>))}</div>
                    <BuilderWrapper id="btn_partner" isBuilder={isBuilder}>
                      <Link to={layout?.links?.btn_partner || "/partner"} className="btn-primary" style={{ padding: '1.5rem 3rem', ...(layout?.styles?.btn_partner || {}) }}><InlineEdit tKey="nav_partner" /></Link>
                    </BuilderWrapper>
                  </div>
                  <div style={{ position: 'relative' }} className="responsive-hide"><img src={layout?.images?.partnership_img || "/corporate_about.png"} alt="" style={{ width: '100%', borderRadius: 'var(--radius)', filter: 'grayscale(0.5) brightness(1.1)' }} /></div>
                </div>
              </div>
            </div>
          </section>
        );
        break;
      case 'services':
        content = (
          <section key="services" className="section-padding" style={{ background: 'var(--surface)', ...blockStyle }}>
            <div className="container">
              <div style={{ textAlign: 'center', marginBottom: '6rem' }}>
                <div style={{ display: 'inline-flex', alignItems: 'center', gap: '1rem', color: 'var(--primary)', fontWeight: '800', fontSize: '0.8rem', letterSpacing: '0.3em', marginBottom: '2rem' }}><div style={{ width: '40px', height: '1px', background: 'var(--primary)' }}></div> <InlineEdit tKey="srv_subtitle" /></div>
                <h2 style={{ fontSize: 'clamp(2.5rem, 6vw, 5rem)', lineHeight: '0.9' }}><InlineEdit tKey="srv_title_1" /> <br/> <InlineEdit tKey="srv_title_2" /></h2>
              </div>
              <div className="grid-2">
                {servicesOrder.map((srvId: string, i: number) => {
                   const service = mainServicesDict[srvId];
                   if (!service) return null;
                   const blockId = `srv_${srvId}`;
                   const style = layout?.styles?.[blockId] || {};
                   
                   
                   return (
                     <div key={blockId}>
                       <BuilderWrapper id={blockId} index={i} isFirst={i === 0} isLast={i === servicesOrder.length - 1} isBuilder={isBuilder} arrayKey="order_services" style={style}>
                         <div className="industrial-card" style={{ padding: '4rem', height: '100%' }}>
                           <div style={{ color: 'var(--primary)', marginBottom: '2.5rem' }}>{service.icon}</div>
                           <h3 style={{ fontSize: '1.8rem', marginBottom: '1.5rem' }}><InlineEdit tKey={service.titleKey} /></h3>
                           <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem', lineHeight: '1.7', marginBottom: '2.5rem' }}><InlineEdit tKey={service.descKey} /></p>
                           <Link to="/services" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', color: 'var(--primary)', fontWeight: '800', fontSize: '0.8rem', letterSpacing: '0.1em' }}>LEARN MORE <ChevronRight size={16} /></Link>
                         </div>
                       </BuilderWrapper>
                     </div>
                   );
                })}
              </div>
            </div>
          </section>
        );
        break;
      case 'cta':
        content = (
          <section key="cta" className="section-padding bg-gradient-tech" style={{ ...blockStyle }}>
            <div className="container">
              <div className="industrial-card" style={{ padding: 'clamp(4rem, 10vw, 8rem) 1.5rem', textAlign: 'center', borderColor: 'var(--primary)', background: 'transparent', ...blockStyle }}><h2 style={{ fontSize: 'clamp(2.5rem, 8vw, 5rem)', marginBottom: '2rem' }}><InlineEdit tKey="cta_title" /></h2><p style={{ fontSize: '1.5rem', color: 'var(--text-muted)', maxWidth: '800px', margin: '0 auto 4rem' }}><InlineEdit tKey="footer_desc" /></p>
                <div style={{ display: 'flex', gap: '2rem', justifyContent: 'center', flexWrap: 'wrap' }}>
                  <BuilderWrapper id="btn_cta_contact" isBuilder={isBuilder}>
                    <Link to={layout?.links?.btn_cta_contact || "/contacts"} className="btn-primary" style={{ padding: '1.5rem 4rem', ...(layout?.styles?.btn_cta_contact || {}) }}><InlineEdit tKey="contact_btn" /></Link>
                  </BuilderWrapper>
                  <BuilderWrapper id="btn_cta_services" isBuilder={isBuilder}>
                    <Link to={layout?.links?.btn_cta_services || "/services"} className="btn-outline" style={{ padding: '1.5rem 4rem', ...(layout?.styles?.btn_cta_services || {}) }}><InlineEdit tKey="nav_service" /></Link>
                  </BuilderWrapper>
                </div>
              </div>
            </div>
          </section>
        );
        break;
      default:
        if (isBuilder) {
          content = (
            <div className="builder-empty-state">
              NEW AREA: {id} <br/>
              <span style={{ fontSize: '0.8rem', color: 'var(--primary)' }}>RIGHT CLICK TO CUSTOMIZE</span>
            </div>
          );
        }
    }

    return (
      <BuilderWrapper 
        key={id} 
        id={id} 
        index={index} 
        isFirst={index === 0} 
        isLast={index === pageOrder.length - 1} 
        isBuilder={isBuilder}
        style={blockStyle}
      >
        {content}
      </BuilderWrapper>
    );
  };

  return (
    <div className="home-wrapper">
      {pageOrder.map((id: string, index: number) => renderSection(id, index))}
      {pageOrder.length === 0 && !isBuilder && (
        <div style={{ height: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#000' }}>
           <h1 style={{ color: '#fff', fontSize: '2rem' }}>WELCOME TO DEMETRA-2005</h1>
        </div>
      )}
    </div>
  );
}
