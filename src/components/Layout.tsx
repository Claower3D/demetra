import { useState, useEffect } from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { Phone, MapPin, Mail, Menu, X, ChevronDown, Moon, Sun, Cog, Cpu, Activity } from 'lucide-react';
import { motion, AnimatePresence, useScroll, useSpring } from 'framer-motion';
import { useLang } from '../LangContext';
import { useTheme } from '../ThemeContext';
import FloatingAssistant from './FloatingAssistant';
import { BuilderWrapper } from './BuilderWrapper';



export default function Layout() {
  const isBuilder = window.self !== window.top;
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  
  const { lang, setLang, t } = useLang();
  const { theme, toggleTheme } = useTheme();
  const location = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
    setMobileMenuOpen(false);
    setActiveDropdown(null);
  }, [location.pathname]);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    const handleMouseMove = (e: MouseEvent) => {
      setMousePos({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('scroll', handleScroll);
    window.addEventListener('mousemove', handleMouseMove);
    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  const dropdownVariants = {
    hidden: { opacity: 0, y: 10, pointerEvents: 'none' as const },
    visible: { opacity: 1, y: 0, pointerEvents: 'auto' as const },
  };

  const { scrollYProgress } = useScroll();
  const scaleY = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: 'var(--background)', color: 'var(--foreground)', transition: '0.3s' }}>
      <motion.div className="scroll-progress" style={{ scaleY, originY: 0 }} />
      
      {/* Interactive Background System */}
      <div className="bg-mesh">
        <div className="mesh-orb orb-1"></div>
        <div className="mesh-orb orb-2"></div>
        
        {/* Floating Technical Symbols */}
        {[...Array(6)].map((_, i) => (
          <div 
            key={i} 
            className="tech-element" 
            style={{ 
              top: `${Math.random() * 100}%`, 
              left: `${Math.random() * 100}%`,
              animationDelay: `${i * -5}s`,
              transform: `scale(${0.5 + Math.random()})`
            }}
          >
            {i % 3 === 0 ? <Cog size={120} /> : i % 3 === 1 ? <Cpu size={100} /> : <Activity size={80} />}
          </div>
        ))}
      </div>

      {/* Interactive Mouse Glow */}
      <div 
        className="mouse-glow" 
        style={{ 
          left: mousePos.x, 
          top: mousePos.y 
        }}
      ></div>
      
      <div className="side-indicator">
        <span>EST. 2005</span>
        <span>KARAGANDA / KZ</span>
      </div>

      <BuilderWrapper id="navigation" isBuilder={isBuilder}>
        <header className={`header ${isScrolled ? 'scrolled' : ''}`} style={isBuilder ? { position: 'relative', top: 0 } : {}}>
          <div className="container nav-container">
          <Link to="/" className="logo">
            {t.company_name}
          </Link>

          <nav className="nav-links">
            <div 
              className="nav-item"
              onMouseEnter={() => setActiveDropdown('about')}
              onMouseLeave={() => setActiveDropdown(null)}
              style={{ position: 'relative' }}
            >
              <Link to="/about" className="nav-link" style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                {t.nav_about} <ChevronDown size={14} />
              </Link>
              
              <AnimatePresence>
                {activeDropdown === 'about' && (
                  <motion.div 
                    initial="hidden"
                    animate="visible"
                    exit="hidden"
                    variants={dropdownVariants}
                    style={{
                      position: 'absolute',
                      top: '100%',
                      left: 0,
                      background: 'var(--surface)',
                      border: '1px solid var(--border)',
                      borderRadius: '8px',
                      padding: '1rem',
                      minWidth: '200px',
                      boxShadow: '0 20px 40px rgba(0,0,0,0.5)',
                      zIndex: 100
                    }}
                  >
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                      <Link to="/pay" className="nav-link">{t.nav_pay}</Link>
                      <Link to="/partner" className="nav-link">{t.nav_partner}</Link>
                      <Link to="/reviews" className="nav-link">{t.nav_reviews}</Link>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <Link to="/catalog" className="nav-link">{t.nav_catalog}</Link>
            <Link to="/services" className="nav-link">{t.nav_service}</Link>
            <Link to="/faq" className="nav-link">{t.nav_faq}</Link>
            <Link to="/gallery" className="nav-link">{t.nav_gallery}</Link>
            <Link to="/contacts" className="nav-link">{t.nav_contact}</Link>
          </nav>

          <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
            <button 
              onClick={toggleTheme}
              style={{ background: 'var(--surface)', border: '1px solid var(--border)', color: 'var(--primary)', padding: '0.5rem', borderRadius: '8px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
            >
              {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
            </button>

            <div style={{ display: 'flex', gap: '0.75rem' }}>
              {['ru', 'kk', 'en'].map((l) => (
                <button 
                  key={l}
                  onClick={() => setLang(l as any)}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: lang === l ? 'var(--primary)' : 'var(--text-muted)',
                    fontWeight: '700',
                    fontSize: '0.8rem',
                    cursor: 'pointer',
                    textTransform: 'uppercase'
                  }}
                >
                  {l}
                </button>
              ))}
            </div>
            
            <a href="tel:+77009207012" className="btn-primary" style={{ padding: '0.6rem 1.2rem', fontSize: '0.9rem' }}>
               {t.contact_btn}
            </a>

            <button 
              className="mobile-toggle"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div 
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              style={{
                background: 'var(--surface)',
                borderBottom: '1px solid var(--border)',
                overflow: 'hidden'
              }}
            >
              <div className="container" style={{ padding: '2rem 0', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                <Link to="/about" className="nav-link">{t.nav_about}</Link>
                <Link to="/catalog" className="nav-link">{t.nav_catalog}</Link>
                <Link to="/services" className="nav-link">{t.nav_service}</Link>
                <Link to="/faq" className="nav-link">{t.nav_faq}</Link>
                <Link to="/gallery" className="nav-link">{t.nav_gallery}</Link>
                <Link to="/contacts" className="nav-link">{t.nav_contact}</Link>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>
      </BuilderWrapper>

      <main style={{ flex: 1, position: 'relative', zIndex: 1 }}>
        <Outlet />
      </main>

      <BuilderWrapper id="footer" isBuilder={isBuilder}>
      <footer style={{ padding: '6rem 0', background: 'var(--surface)', borderTop: '1px solid var(--border)', position: 'relative', zIndex: 1 }}>
        <div className="container">
          <div className="grid-3" style={{ gap: '3rem', marginBottom: '4rem' }}>
            <div>
              <div className="logo" style={{ fontSize: '1.5rem', marginBottom: '1.5rem' }}>
                {t.company_name}
              </div>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', lineHeight: '1.6' }}>
                {t.footer_desc}
              </p>
            </div>
            
            <div>
              <h4 style={{ color: 'var(--foreground)', marginBottom: '1.5rem' }}>{t.footer_nav}</h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                <Link to="/about" className="nav-link">{t.nav_about}</Link>
                <Link to="/catalog" className="nav-link">{t.nav_catalog}</Link>
                <Link to="/services" className="nav-link">{t.nav_service}</Link>
                <Link to="/contacts" className="nav-link">{t.nav_contact}</Link>
              </div>
            </div>

            <div>
              <h4 style={{ color: 'var(--foreground)', marginBottom: '1.5rem' }}>{t.nav_contact}</h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div style={{ display: 'flex', gap: '0.75rem', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                  <MapPin size={18} style={{ color: 'var(--primary)', flexShrink: 0 }} />
                  {t.city}, {t.address}
                </div>
                <div style={{ display: 'flex', gap: '0.75rem', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                  <Phone size={18} style={{ color: 'var(--primary)', flexShrink: 0 }} />
                  {t.company_phone}
                </div>
                <div style={{ display: 'flex', gap: '0.75rem', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                  <Mail size={18} style={{ color: 'var(--primary)', flexShrink: 0 }} />
                  {t.company_email}
                </div>
              </div>
            </div>
          </div>

          <div style={{ position: 'relative', width: '100%', height: '350px', borderRadius: 'var(--radius)', overflow: 'hidden', border: '1px solid var(--border)', background: 'var(--surface)' }}>
            <iframe 
              title="map"
              width="100%" 
              height="100%" 
              frameBorder="0" 
              scrolling="no" 
              marginHeight={0} 
              marginWidth={0} 
              src="https://maps.google.com/maps?q=Караганда,%20ул.%20Сатпаева%203/2&t=&z=16&ie=UTF8&iwloc=&output=embed"
              style={{ filter: theme === 'dark' ? 'invert(90%) hue-rotate(180deg) brightness(0.8) contrast(1.2)' : 'none' }}
            ></iframe>
            <div style={{ position: 'absolute', top: '1.5rem', left: '1.5rem', background: 'var(--surface)', padding: '1.5rem', borderRadius: '12px', border: '1px solid var(--primary)', boxShadow: '0 10px 30px rgba(0,0,0,0.5)', maxWidth: '300px' }}>
              <h5 style={{ color: 'var(--primary)', marginBottom: '0.5rem', fontSize: '0.8rem', fontWeight: '900', letterSpacing: '0.1em' }}>HEADQUARTERS</h5>
              <p style={{ fontSize: '0.85rem', color: 'var(--foreground)', marginBottom: '1rem' }}>{t.city}, {t.address}</p>
              <a 
                href="https://www.google.com/maps/dir/?api=1&destination=Караганда,ул.Сатпаева+3/2" 
                target="_blank" 
                rel="noreferrer"
                className="btn-primary" 
                style={{ width: '100%', fontSize: '0.75rem', padding: '0.75rem' }}
              >
                GET DIRECTIONS
              </a>
            </div>
          </div>
          
          <div style={{ marginTop: '4rem', paddingTop: '2rem', borderTop: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', color: 'var(--text-muted)', fontSize: '0.8rem' }}>
            <p>{t.rights}</p>
            <p>Разработка: Antigravity</p>
          </div>
        </div>
      </footer>
      </BuilderWrapper>
      <FloatingAssistant />
    </div>
  );
}
