import { useState, useEffect } from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { Phone, MapPin, Mail, Menu, X, ChevronDown, Moon, Sun, Cog, Cpu, Activity, Zap } from 'lucide-react';
import { motion, AnimatePresence, useScroll, useSpring } from 'framer-motion';
import { useLang } from '../LangContext';
import { useTheme } from '../ThemeContext';
import FloatingAssistant from './FloatingAssistant';

export default function Layout() {
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

      <header className={`header ${isScrolled ? 'scrolled' : ''}`}>
        <div className="container nav-container">
          <Link to="/" className="logo">
            ДЕМЕТРА<span style={{ color: 'var(--primary)' }}>2005</span>
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

      <main style={{ flex: 1, position: 'relative', zIndex: 1 }}>
        <Outlet />
      </main>

      <footer style={{ padding: '6rem 0', background: 'var(--surface)', borderTop: '1px solid var(--border)', position: 'relative', zIndex: 1 }}>
        <div className="container">
          <div className="grid-4">
            <div>
              <div className="logo" style={{ marginBottom: '1.5rem', display: 'block' }}>
                ДЕМЕТРА<span style={{ color: 'var(--primary)' }}>2005</span>
              </div>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
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
              <h4 style={{ color: 'var(--foreground)', marginBottom: '1.5rem' }}>SUPPORT</h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                <Link to="/pay" className="nav-link">{t.nav_pay}</Link>
                <Link to="/faq" className="nav-link">{t.nav_faq}</Link>
                <Link to="/partner" className="nav-link">{t.nav_partner}</Link>
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
                  +7 700 920 70 12
                </div>
                <div style={{ display: 'flex', gap: '0.75rem', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                  <Mail size={18} style={{ color: 'var(--primary)', flexShrink: 0 }} />
                  info@demetra2005.kz
                </div>
              </div>
            </div>
          </div>
          
          <div style={{ marginTop: '4rem', paddingTop: '2rem', borderTop: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', color: 'var(--text-muted)', fontSize: '0.8rem' }}>
            <p>{t.rights}</p>
            <p>Разработка: Antigravity</p>
          </div>
        </div>
      </footer>
      <FloatingAssistant />
    </div>
  );
}
