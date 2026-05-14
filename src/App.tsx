import { useState, useEffect } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Settings, Shield, Zap, Wrench, Factory, Cpu, Hammer, Phone, Mail, MapPin, ChevronRight, Menu, X } from 'lucide-react';
import './index.css';

function App() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { scrollYProgress } = useScroll();
  const y = useTransform(scrollYProgress, [0, 1], ['0%', '50%']);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const fadeInUp = {
    hidden: { opacity: 0, y: 40 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  return (
    <>
      <header className={isScrolled ? 'scrolled' : ''}>
        <div className="container nav-container">
          <a href="#" className="logo">
            <Factory className="text-toxic" size={32} />
            <span>ДЕМЕТРА<span className="text-toxic">2005</span></span>
          </a>

          <nav className="nav-links">
            <a href="#about">О компании</a>
            <a href="#catalog">Каталог</a>
            <a href="#service">Сервис</a>
            <a href="#contacts">Контакты</a>
          </nav>

          <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
            <a href="tel:+77009207012" className="btn-toxic" style={{ padding: '8px 16px', fontSize: '0.9rem' }}>
              <Phone size={16} style={{ marginRight: '8px' }} /> Связаться
            </a>
            <button 
              className="mobile-menu-btn" 
              style={{ background: 'transparent', border: 'none', color: 'white', display: 'none', cursor: 'pointer' }}
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X /> : <Menu />}
            </button>
          </div>
        </div>
      </header>

      <main>
        {/* Hero Section */}
        <section className="hero">
          <div className="hero-bg">
            <div className="toxic-blob blob-1"></div>
            <div className="toxic-blob blob-2"></div>
            <motion.div style={{ y }} className="hero-parallax-bg"></motion.div>
          </div>

          <div className="container">
            <motion.div 
              className="hero-content"
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            >
              <motion.div 
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2, duration: 0.5 }}
                style={{ display: 'inline-block', padding: '8px 16px', background: 'rgba(57, 255, 20, 0.1)', border: '1px solid var(--toxic-green)', borderRadius: '20px', marginBottom: '1.5rem', color: 'var(--toxic-green)', fontWeight: '600', letterSpacing: '1px', textTransform: 'uppercase', fontSize: '0.8rem' }}
              >
                Инновации в промышленности
              </motion.div>
              <h1 className="hero-title">
                Ремонт и обслуживание <br />
                <span className="text-toxic">конвейерного</span> оборудования
              </h1>
              <p className="hero-subtitle">
                Более 15 лет мы обеспечиваем бесперебойную работу промышленных предприятий. Качественная продукция, доступные цены и безупречный сервис.
              </p>
              <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                <a href="#catalog" className="btn-toxic">Перейти в каталог <ChevronRight size={20} /></a>
                <a href="#service" className="btn-toxic" style={{ background: 'var(--bg-card)', color: 'white', borderColor: 'var(--border-color)' }}>Наши услуги</a>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Stats */}
        <section>
          <div className="container">
            <motion.div 
              className="stats-container glass"
              variants={staggerContainer}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
            >
              <motion.div className="stat-item" variants={fadeInUp}>
                <div className="stat-number pulse">15+</div>
                <div className="stat-label">Лет опыта</div>
              </motion.div>
              <motion.div className="stat-item" variants={fadeInUp}>
                <div className="stat-number">500+</div>
                <div className="stat-label">Проектов</div>
              </motion.div>
              <motion.div className="stat-item" variants={fadeInUp}>
                <div className="stat-number">100%</div>
                <div className="stat-label">Гарантия качества</div>
              </motion.div>
              <motion.div className="stat-item" variants={fadeInUp}>
                <div className="stat-number">24/7</div>
                <div className="stat-label">Поддержка</div>
              </motion.div>
            </motion.div>
          </div>
        </section>

        {/* Services */}
        <section id="service" className="section-padding">
          <div className="container">
            <div className="section-header">
              <span className="section-subtitle">Наши компетенции</span>
              <h2 className="section-title">Профессиональный <span className="text-toxic">Сервис</span></h2>
            </div>

            <motion.div 
              className="grid-2"
              variants={staggerContainer}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
            >
              <motion.div className="service-card glass" variants={fadeInUp}>
                <div className="service-icon"><Settings size={32} /></div>
                <h3 className="service-title">Обслуживание конвейеров</h3>
                <p className="service-desc">Комплексное сервисное обслуживание ленточных конвейеров для обеспечения бесперебойной работы вашего предприятия.</p>
              </motion.div>

              <motion.div className="service-card glass" variants={fadeInUp}>
                <div className="service-icon"><Shield size={32} /></div>
                <h3 className="service-title">Футеровка и гуммирование</h3>
                <p className="service-desc">Качественная футеровка и гуммирование поверхностей для защиты оборудования от износа и повреждений.</p>
              </motion.div>

              <motion.div className="service-card glass" variants={fadeInUp}>
                <div className="service-icon"><Zap size={32} /></div>
                <h3 className="service-title">Защитные покрытия</h3>
                <p className="service-desc">Нанесение высокотехнологичных защитных покрытий от абразива и агрессивных кислот.</p>
              </motion.div>

              <motion.div className="service-card glass" variants={fadeInUp}>
                <div className="service-icon"><Wrench size={32} /></div>
                <h3 className="service-title">Ремонт оборудования</h3>
                <p className="service-desc">Профессиональный ремонт и восстановление горно-шахтного и металлургического оборудования.</p>
              </motion.div>
            </motion.div>
          </div>
        </section>

        {/* Catalog Preview */}
        <section id="catalog" className="section-padding" style={{ background: 'var(--bg-dark)' }}>
          <div className="container">
            <div className="section-header">
              <span className="section-subtitle">Оборудование</span>
              <h2 className="section-title">Каталог <span className="text-toxic">Продукции</span></h2>
            </div>

            <motion.div 
              className="grid-4"
              variants={staggerContainer}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
            >
              {[
                { title: 'Защитные покрытия', icon: <Shield /> },
                { title: 'Демпферные станции', icon: <Cpu /> },
                { title: 'Клеевые составы', icon: <Zap /> },
                { title: 'Компрессорные установки', icon: <Factory /> },
                { title: 'Конвейерные ленты', icon: <Settings /> },
                { title: 'Очистители, датчики', icon: <Zap /> },
                { title: 'Ролики конвейерные', icon: <Settings /> },
                { title: 'Футеровочные материалы', icon: <Hammer /> },
              ].map((item, index) => (
                <motion.a 
                  href="#" 
                  key={index} 
                  className="service-card glass" 
                  variants={fadeInUp}
                  style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', gap: '1rem' }}
                >
                  <div style={{ color: 'var(--toxic-green)' }}>{item.icon}</div>
                  <h4 style={{ fontSize: '1.1rem' }}>{item.title}</h4>
                </motion.a>
              ))}
            </motion.div>

            <div style={{ textAlign: 'center', marginTop: '3rem' }}>
              <a href="#" className="btn-toxic" style={{ background: 'rgba(57,255,20,0.1)' }}>Смотреть весь каталог</a>
            </div>
          </div>
        </section>

      </main>

      {/* Footer */}
      <footer id="contacts">
        <div className="container">
          <div className="footer-content">
            <div>
              <div className="footer-logo logo">
                <Factory className="text-toxic" size={28} />
                <span>ДЕМЕТРА<span className="text-toxic">2005</span></span>
              </div>
              <p className="footer-desc">
                Надежный партнер в сфере ремонта и технического обслуживания конвейерного оборудования.
              </p>
            </div>

            <div>
              <h4 className="footer-title">Контакты</h4>
              <div className="contact-item">
                <MapPin className="contact-icon" size={20} />
                <div>
                  <p style={{ color: 'white' }}>г. Караганда</p>
                  <p>ул. Сатпаева д.3/2</p>
                </div>
              </div>
              <div className="contact-item">
                <Phone className="contact-icon" size={20} />
                <div>
                  <p>+7 700 920 70 12</p>
                  <p>+7 701 445 61 86</p>
                  <p>+7 777 072 27 34</p>
                </div>
              </div>
            </div>

            <div>
              <h4 className="footer-title">Навигация</h4>
              <ul className="footer-links">
                <li><a href="#about">О компании</a></li>
                <li><a href="#catalog">Каталог оборудования</a></li>
                <li><a href="#service">Сервисное обслуживание</a></li>
                <li><a href="#pay">Оплата и доставка</a></li>
                <li><a href="#faq">Вопрос-ответ</a></li>
              </ul>
            </div>
          </div>

          <div className="footer-bottom">
            <p>&copy; {new Date().getFullYear()} Деметра-2005. Все права защищены. Разработано с использованием передовых технологий.</p>
          </div>
        </div>
      </footer>
    </>
  );
}

export default App;
