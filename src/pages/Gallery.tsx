import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Image as ImageIcon, Maximize2, X, ChevronLeft, ChevronRight, Sparkles, Cpu, Layers, HardHat, ShieldAlert } from 'lucide-react';
import { useLang, InlineEdit } from '../LangContext';

export default function Gallery() {
  const { lang, t } = useLang();
  const [activeCategory, setActiveCategory] = useState('all');
  const [selectedImageIndex, setSelectedImageIndex] = useState<number | null>(null);

  // Curated premium industrial stock images with context
  const galleryItems = [
    { 
      src: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&q=80&w=1200", 
      category: 'production',
      icon: <Cpu size={16} />,
      ru: { title: "Конвейерная линия Т-1500", desc: "Установка и пусконаладка новой автоматизированной конвейерной линии с HDPE роликами." },
      kk: { title: "Т-1500 конвейерлік желісі", desc: "HDPE роликтері бар жаңа автоматтандырылған конвейер желісін орнату және іске қосу." },
      en: { title: "T-1500 Conveyor Line", desc: "Installation and commissioning of a new automated conveyor line with HDPE rollers." }
    },
    { 
      src: "https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122?auto=format&fit=crop&q=80&w=1200", 
      category: 'services',
      icon: <HardHat size={16} />,
      ru: { title: "Ремонт конвейерной ленты", desc: "Срочная стыковка конвейерной ленты методом горячей вулканизации на глубине." },
      kk: { title: "Конвейер таспасын жөндеу", desc: "Тереңдікте ыстық вулканизация әдісімен конвейер таспасын шұғыл біріктіру." },
      en: { title: "Conveyor Belt Repair", desc: "Urgent splicing of a conveyor belt using hot vulcanization method at depth." }
    },
    { 
      src: "https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&q=80&w=1200", 
      category: 'equipment',
      icon: <Layers size={16} />,
      ru: { title: "Футеровка приводного барабана", desc: "Применение резинокерамической футеровки германского производства для предотвращения проскальзывания ленты." },
      kk: { title: "Жетекші барабанды футерлеу", desc: "Таспаның сырғып кетуін болдырмау үшін германдық резеңке-керамикалық футерлеуді қолдану." },
      en: { title: "Drive Drum Lagging", desc: "Application of German-made rubber-ceramic lagging to prevent belt slippage." }
    },
    { 
      src: "https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&q=80&w=1200", 
      category: 'production',
      icon: <Cpu size={16} />,
      ru: { title: "Контроль качества роликов", desc: "Лабораторные испытания биения конвейерных роликов на специализированном стенде перед отгрузкой клиенту." },
      kk: { title: "Роликтердің сапасын бақылау", desc: "Тапсырыс берушіге жөнелту алдында мамандандырылған стендте конвейер роликтерінің соғуын зертханалық сынау." },
      en: { title: "Roller Quality Control", desc: "Laboratory testing of conveyor roller runout on a specialized stand before shipping to the client." }
    },
    { 
      src: "https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&q=80&w=1200", 
      category: 'materials',
      icon: <Layers size={16} />,
      ru: { title: "Демпферная станция амортизации", desc: "Успешный монтаж амортизирующей станции в точке загрузки крупнокусковой руды." },
      kk: { title: "Амортизациялық демпферлік станция", desc: "Ірі кесекті кенді тиеу нүктесінде амортизациялық станцияны сәтті монтаждау." },
      en: { title: "Shock Absorbing Damper Station", desc: "Successful installation of a damping station at the large-fraction ore loading point." }
    },
    { 
      src: "https://images.unsplash.com/photo-1416339306562-f3d12fefd36f?auto=format&fit=crop&q=80&w=1200", 
      category: 'services',
      icon: <ShieldAlert size={16} />,
      ru: { title: "Антикоррозийная защита", desc: "Нанесение полимерных защитных составов на стальные конструкции металлургического цеха." },
      kk: { title: "Коррозияға қарсы қорғаныс", desc: "Металлургиялық цехтың болат конструкцияларына полимерлі қорғаныс құрамдарын жағу." },
      en: { title: "Anti-Corrosion Protection", desc: "Application of polymer protective coatings to the steel structures of the metallurgical workshop." }
    }
  ];

  // Unique categories translated
  const categoriesDict: any = {
    all: { ru: 'Все фото', kk: 'Барлық фото', en: 'All Photos' },
    production: { ru: 'Производство', kk: 'Өндіріс', en: 'Production' },
    services: { ru: 'Сервис', kk: 'Қызметтер', en: 'Services' },
    equipment: { ru: 'Оборудование', kk: 'Жабдықтар', en: 'Equipment' },
    materials: { ru: 'Материалы', kk: 'Материалдар', en: 'Materials' }
  };

  const filteredItems = activeCategory === 'all' 
    ? galleryItems 
    : galleryItems.filter(item => item.category === activeCategory);

  // Keyboard navigation for lightbox
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (selectedImageIndex === null) return;
      if (e.key === 'Escape') setSelectedImageIndex(null);
      if (e.key === 'ArrowRight') handleNext();
      if (e.key === 'ArrowLeft') handlePrev();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedImageIndex]);

  const handlePrev = () => {
    setSelectedImageIndex(prev => 
      prev !== null ? (prev === 0 ? filteredItems.length - 1 : prev - 1) : null
    );
  };

  const handleNext = () => {
    setSelectedImageIndex(prev => 
      prev !== null ? (prev === filteredItems.length - 1 ? 0 : prev + 1) : null
    );
  };

  return (
    <div style={{ paddingTop: '150px', minHeight: '100vh', background: 'var(--background)' }}>
      <div className="container">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
          
          {/* Badge & Title */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', color: 'var(--primary)', fontWeight: '800', fontSize: '0.8rem', letterSpacing: '0.3em', marginBottom: '2rem' }}>
            <ImageIcon size={16} />
            <InlineEdit tKey="nav_gallery" />
          </div>
          
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: '2rem', marginBottom: '4rem' }}>
            <h1 style={{ fontSize: 'clamp(3rem, 6vw, 6rem)', color: 'var(--foreground)', lineHeight: '0.9', margin: 0 }}>
              <InlineEdit tKey="gallery_title" />
            </h1>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-muted)', fontSize: '0.9rem', fontWeight: '700' }}>
              <Sparkles size={16} className="text-primary" style={{ color: 'var(--primary)' }} />
              <span>DEMETRA DIGITAL WORKSPACE</span>
            </div>
          </div>

          {/* Sleek Category Filter Bar */}
          <div style={{ 
            background: 'var(--surface)', 
            padding: '0.75rem', 
            borderRadius: 'var(--radius)', 
            border: '1px solid var(--border)', 
            marginBottom: '4rem', 
            display: 'flex', 
            flexWrap: 'wrap', 
            gap: '0.5rem', 
            alignItems: 'center',
            boxShadow: '0 4px 30px rgba(0, 0, 0, 0.02)'
          }}>
            {Object.keys(categoriesDict).map((catId) => (
              <button
                key={catId}
                onClick={() => {
                  setActiveCategory(catId);
                  setSelectedImageIndex(null);
                }}
                className={`btn-category ${activeCategory === catId ? 'active' : ''}`}
                style={{
                  padding: '10px 24px',
                  fontSize: '0.8rem',
                  letterSpacing: '0.05em'
                }}
              >
                {categoriesDict[catId][lang]}
              </button>
            ))}
          </div>

          {/* Stunning Bento Masonry Grid */}
          <motion.div 
            className="bento-grid" 
            style={{ gridAutoRows: '320px', gap: '2rem', marginBottom: '8rem' }}
            layout
          >
            <AnimatePresence mode="popLayout">
              {filteredItems.map((item, index) => {
                // Alternating sizes for gorgeous asymmetrical masonry layout
                const gridColumn = index % 3 === 0 ? 'span 7' : 'span 5';
                const gridRow = index === 0 || index === 3 ? 'span 2' : 'span 1';
                
                return (
                  <motion.div
                    layout
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                    key={item.src}
                    onClick={() => setSelectedImageIndex(index)}
                    className="product-card"
                    style={{
                      gridColumn: gridColumn,
                      gridRow: gridRow,
                      cursor: 'pointer'
                    }}
                  >
                    {/* Visual Card Image */}
                    <img 
                      src={item.src} 
                      alt={item[lang]?.title || ''} 
                      style={{ 
                        width: '100%', 
                        height: '100%', 
                        objectFit: 'cover' 
                      }} 
                    />
                    
                    {/* Glowing Overlay Indicator */}
                    <div style={{ 
                      position: 'absolute', 
                      inset: 0, 
                      display: 'flex', 
                      alignItems: 'center', 
                      justifyContent: 'center', 
                      opacity: 0, 
                      transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)', 
                      background: 'rgba(0, 143, 36, 0.15)' 
                    }} className="gallery-overlay">
                      <div style={{ 
                        background: '#ffffff', 
                        color: '#000000', 
                        padding: '1.25rem', 
                        borderRadius: '50%', 
                        boxShadow: '0 10px 30px rgba(0, 143, 36, 0.4)' 
                      }}>
                        <Maximize2 size={24} />
                      </div>
                    </div>

                    {/* Image Context Footer Info Panel inside Card Overlay */}
                    <div className="product-info" style={{ padding: '2.5rem' }}>
                      <div style={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        gap: '0.5rem', 
                        color: 'var(--primary)', 
                        fontSize: '0.8rem', 
                        fontWeight: '800', 
                        marginBottom: '0.5rem' 
                      }}>
                        {item.icon}
                        <span>{categoriesDict[item.category][lang].toUpperCase()}</span>
                      </div>
                      <h3 style={{ 
                        fontSize: gridRow.includes('2') || gridColumn.includes('7') ? '2.2rem' : '1.4rem', 
                        fontWeight: '900',
                        lineHeight: '1.2' 
                      }}>
                        {item[lang]?.title}
                      </h3>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </motion.div>
        </motion.div>
      </div>

      {/* FULLSCREEN LIGHTBOX PORTAL OVERLAY */}
      <AnimatePresence>
        {selectedImageIndex !== null && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{
              position: 'fixed',
              inset: 0,
              zIndex: 9999,
              background: 'rgba(5, 7, 12, 0.95)',
              backdropFilter: 'blur(15px)',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center'
            }}
          >
            {/* Top Close Control Panel */}
            <div style={{
              position: 'absolute',
              top: '2rem',
              left: '3rem',
              right: '3rem',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              color: '#ffffff',
              zIndex: 10000
            }}>
              <div>
                <div style={{ color: 'var(--primary)', fontSize: '0.8rem', fontWeight: '800', letterSpacing: '0.2em' }}>
                  ◆ {categoriesDict[filteredItems[selectedImageIndex].category][lang].toUpperCase()}
                </div>
                <h4 style={{ margin: 0, fontSize: '1.2rem', fontWeight: '800', color: '#ffffff' }}>
                  {filteredItems[selectedImageIndex][lang]?.title}
                </h4>
              </div>
              <button
                onClick={() => setSelectedImageIndex(null)}
                style={{
                  background: 'rgba(255,255,255,0.05)',
                  border: '1px solid rgba(255,255,255,0.1)',
                  color: '#ffffff',
                  width: '50px',
                  height: '50px',
                  borderRadius: '50%',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transition: 'all 0.3s'
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.transform = 'scale(1.1)';
                  e.currentTarget.style.borderColor = 'var(--primary)';
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.transform = 'scale(1)';
                  e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)';
                }}
              >
                <X size={20} />
              </button>
            </div>

            {/* Main Picture viewport */}
            <div style={{
              position: 'relative',
              width: '90%',
              maxWidth: '1200px',
              height: '60vh',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center'
            }}>
              {/* Previous Button Left */}
              <button
                onClick={(e) => { e.stopPropagation(); handlePrev(); }}
                style={{
                  position: 'absolute',
                  left: '-4rem',
                  background: 'rgba(255,255,255,0.05)',
                  border: '1px solid rgba(255,255,255,0.1)',
                  color: '#ffffff',
                  width: '60px',
                  height: '60px',
                  borderRadius: '50%',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  zIndex: 10001,
                  transition: 'all 0.3s'
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.transform = 'scale(1.1)';
                  e.currentTarget.style.borderColor = 'var(--primary)';
                  e.currentTarget.style.color = 'var(--primary)';
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.transform = 'scale(1)';
                  e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)';
                  e.currentTarget.style.color = '#ffffff';
                }}
              >
                <ChevronLeft size={30} />
              </button>

              {/* Dynamic Scaling Image Block */}
              <motion.img 
                key={filteredItems[selectedImageIndex].src}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.4, ease: 'easeOut' }}
                src={filteredItems[selectedImageIndex].src} 
                alt="" 
                style={{
                  maxWidth: '100%',
                  maxHeight: '100%',
                  objectFit: 'contain',
                  borderRadius: '16px',
                  boxShadow: '0 30px 100px rgba(0,0,0,0.8), 0 0 50px rgba(0, 143, 36, 0.1)'
                }}
              />

              {/* Next Button Right */}
              <button
                onClick={(e) => { e.stopPropagation(); handleNext(); }}
                style={{
                  position: 'absolute',
                  right: '-4rem',
                  background: 'rgba(255,255,255,0.05)',
                  border: '1px solid rgba(255,255,255,0.1)',
                  color: '#ffffff',
                  width: '60px',
                  height: '60px',
                  borderRadius: '50%',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  zIndex: 10001,
                  transition: 'all 0.3s'
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.transform = 'scale(1.1)';
                  e.currentTarget.style.borderColor = 'var(--primary)';
                  e.currentTarget.style.color = 'var(--primary)';
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.transform = 'scale(1)';
                  e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)';
                  e.currentTarget.style.color = '#ffffff';
                }}
              >
                <ChevronRight size={30} />
              </button>
            </div>

            {/* Description Text Panel Footer */}
            <motion.div 
              key={`desc-${selectedImageIndex}`}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              style={{
                marginTop: '4rem',
                maxWidth: '700px',
                textAlign: 'center',
                padding: '0 2rem'
              }}
            >
              <p style={{
                color: 'rgba(255, 255, 255, 0.7)',
                fontSize: '1.2rem',
                lineHeight: '1.6',
                margin: 0
              }}>
                {filteredItems[selectedImageIndex][lang]?.desc}
              </p>
              
              <div style={{
                marginTop: '2rem',
                color: 'rgba(255,255,255,0.3)',
                fontSize: '0.8rem',
                fontWeight: '700',
                letterSpacing: '0.1em'
              }}>
                {selectedImageIndex + 1} / {filteredItems.length}
              </div>
            </motion.div>

          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
