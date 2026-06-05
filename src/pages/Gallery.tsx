import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Image as ImageIcon, Maximize2, X, ChevronLeft, ChevronRight, Sparkles, Cpu, Layers, HardHat, PlusCircle } from 'lucide-react';
import { useLang, InlineEdit } from '../LangContext';
import { BuilderWrapper } from '../components/BuilderWrapper';
import { useBuilderLayout } from '../hooks/useBuilderLayout';
import CustomBlock, { getCustomBlocks } from '../components/CustomBlock';

const defaultGalleryItems = [
  { 
    id: "gallery_1",
    src: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&q=80&w=1200", 
    type: 'image',
    category: 'production',
    ru: { title: "Конвейерная линия Т-1500", desc: "Установка и пусконаладка новой автоматизированной конвейерной линии с HDPE роликами." },
    kk: { title: "Т-1500 конвейерлік желісі", desc: "HDPE роликтері бар жаңа автоматтандырылған конвейер желісін орнату және іске қосу." },
    en: { title: "T-1500 Conveyor Line", desc: "Installation and commissioning of a new automated conveyor line with HDPE rollers." }
  },
  { 
    id: "gallery_2",
    src: "https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122?auto=format&fit=crop&q=80&w=1200", 
    type: 'image',
    category: 'services',
    ru: { title: "Ремонт конвейерной ленты", desc: "Срочная стыковка конвейерной ленты методом горячей вулканизации на глубине." },
    kk: { title: "Конвейер таспасын жөндеу", desc: "Тереңдікте ыстық вулканизация әдісімен конвейер таспасын шұғыл біріктіру." },
    en: { title: "Conveyor Belt Repair", desc: "Urgent splicing of a conveyor belt using hot vulcanization method at depth." }
  },
  { 
    id: "gallery_3",
    src: "https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&q=80&w=1200", 
    type: 'image',
    category: 'equipment',
    ru: { title: "Футеровка приводного барабана", desc: "Применение резинокерамической футеровки германского производства для предотвращения проскальзывания ленты." },
    kk: { title: "Жетекші барабанды футерлеу", desc: "Таспаның сырғып кетуін болдырмау үшін германдық резеңке-керамикалық футерлеуді қолдану." },
    en: { title: "Drive Drum Lagging", desc: "Application of German-made rubber-ceramic lagging to prevent belt slippage." }
  },
  { 
    id: "gallery_4",
    src: "https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&q=80&w=1200", 
    type: 'image',
    category: 'production',
    ru: { title: "Контроль качества роликов", desc: "Лабораторные испытания биения конвейерных роликов на специализированном стенде перед отгрузкой клиенту." },
    kk: { title: "Роликтердің сапасын бақылау", desc: "Тапсырыс берушіге жөнелту алдында мамандандырылған стендте конвейер роликтерінің соғуын зертханалық сынау." },
    en: { title: "Roller Quality Control", desc: "Laboratory testing of conveyor roller runout on a specialized stand before shipping to the client." }
  },
  { 
    id: "gallery_5",
    src: "https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&q=80&w=1200", 
    type: 'image',
    category: 'materials',
    ru: { title: "Демпферная станция амортизации", desc: "Успешный монтаж амортизирующей станции в точке загрузки крупнокусковой руды." },
    kk: { title: "Амортизациялық демпферлік станция", desc: "Ірі кесекті кенді тиеу нүктесінде амортизациялық станцияны сәтті монтаждау." },
    en: { title: "Shock Absorbing Damper Station", desc: "Successful installation of a damping station at the large-fraction ore loading point." }
  },
  { 
    id: "gallery_6",
    src: "https://images.unsplash.com/photo-1416339306562-f3d12fefd36f?auto=format&fit=crop&q=80&w=1200", 
    type: 'image',
    category: 'services',
    ru: { title: "Антикоррозийная защита", desc: "Нанесение полимерных защитных составов на стальные конструкции металлургического цеха." },
    kk: { title: "Коррозияға қарсы қорғаныс", desc: "Металлургиялық цехтың болат конструкцияларына полимерлі қорғаныс құрамдарын жағу." },
    en: { title: "Anti-Corrosion Protection", desc: "Application of polymer protective coatings to the steel structures of the metallurgical workshop." }
  }
];

const defaultGalleryLayout = {
  order: ['gallery_main'],
  order_gallery: ['gallery_1', 'gallery_2', 'gallery_3', 'gallery_4', 'gallery_5', 'gallery_6'],
  items: {
    gallery_1: defaultGalleryItems[0],
    gallery_2: defaultGalleryItems[1],
    gallery_3: defaultGalleryItems[2],
    gallery_4: defaultGalleryItems[3],
    gallery_5: defaultGalleryItems[4],
    gallery_6: defaultGalleryItems[5]
  }
};

const getCategoryIcon = (category: string) => {
  switch (category) {
    case 'production': return <Cpu size={16} />;
    case 'services': return <HardHat size={16} />;
    case 'equipment': return <Layers size={16} />;
    case 'materials': return <Layers size={16} />;
    default: return <ImageIcon size={16} />;
  }
};

function renderMedia(item: any, lang: string) {
  if (item.type === 'video') {
    const src = item.src || '';
    let isYoutube = false;
    let embedUrl = src;
    
    if (src.includes('youtube.com') || src.includes('youtu.be')) {
      isYoutube = true;
      let videoId = '';
      if (src.includes('youtube.com/watch')) {
        const urlParams = new URLSearchParams(src.split('?')[1] || '');
        videoId = urlParams.get('v') || '';
      } else if (src.includes('youtu.be/')) {
        videoId = src.split('youtu.be/')[1]?.split('?')[0] || '';
      } else if (src.includes('youtube.com/embed/')) {
        videoId = src.split('youtube.com/embed/')[1]?.split('?')[0] || '';
      }
      embedUrl = `https://www.youtube.com/embed/${videoId}?autoplay=1&mute=1&playlist=${videoId}&loop=1&controls=0&showinfo=0&rel=0`;
    }

    if (isYoutube) {
      return (
        <iframe
          src={embedUrl}
          title={item[lang]?.title || ''}
          style={{ width: '100%', height: '100%', border: 'none', objectFit: 'cover', pointerEvents: 'none' }}
          allow="autoplay; encrypted-media"
        />
      );
    } else {
      return (
        <video
          src={src}
          muted
          loop
          autoPlay
          playsInline
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
        />
      );
    }
  }

  return (
    <img 
      src={item.src} 
      alt={item[lang]?.title || ''} 
      style={{ 
        width: '100%', 
        height: '100%', 
        objectFit: 'cover' 
      }} 
    />
  );
}

export default function Gallery() {
  const { lang, t } = useLang();
  const [activeCategory, setActiveCategory] = useState('all');
  const [selectedImageIndex, setSelectedImageIndex] = useState<number | null>(null);
  const [customBlocks, setCustomBlocks] = useState<Record<string, any>>(() => getCustomBlocks());

  useEffect(() => {
    const sync = () => setCustomBlocks(getCustomBlocks());
    window.addEventListener('storage', sync);
    return () => window.removeEventListener('storage', sync);
  }, []);

  const { layout, isBuilder } = useBuilderLayout('gallery', defaultGalleryLayout);

  const activeItemsOrder = Array.isArray(layout?.order_gallery) ? layout.order_gallery : defaultGalleryLayout.order_gallery;
  const activeItemsMap = layout?.items || defaultGalleryLayout.items;

  const galleryItems = activeItemsOrder
    .map((id: string) => activeItemsMap[id])
    .filter(Boolean);

  const categoriesDict: any = {
    all: { ru: 'Все медиа', kk: 'Барлық медиа', en: 'All Media' },
    production: { ru: 'Производство', kk: 'Өндіріс', en: 'Production' },
    services: { ru: 'Сервис', kk: 'Қызметтер', en: 'Services' },
    equipment: { ru: 'Оборудование', kk: 'Жабдықтар', en: 'Equipment' },
    materials: { ru: 'Материалы', kk: 'Материалдар', en: 'Materials' }
  };

  const filteredItems = activeCategory === 'all' 
    ? galleryItems 
    : galleryItems.filter((item: any) => item.category === activeCategory);

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
  }, [selectedImageIndex, filteredItems]);

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

  const pageOrder = Array.isArray(layout?.order) && layout.order.length > 0 ? layout.order : ['gallery_main'];
  const hiddenBlocks = Array.isArray(layout?.hidden) ? layout.hidden : [];

  return (
    <div style={{ paddingTop: '150px', minHeight: '100vh', background: 'var(--background)', overflow: 'hidden' }}>
      {pageOrder.map((id: string, index: number) => {
        if (hiddenBlocks.includes(id)) return null;

        const blockStyle = layout?.styles?.[id] || {};

        if (id === 'gallery_main') {
          return (
            <BuilderWrapper 
              key={id} 
              id="gallery_main" 
              index={index} 
              isFirst={index === 0} 
              isLast={index === pageOrder.length - 1} 
              isBuilder={isBuilder} 
              style={blockStyle}
            >
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

                  {/* Visual Builder: Add Media Button */}
                  {isBuilder && (
                    <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '3rem' }}>
                      <button 
                        onClick={() => {
                          const newId = `gallery_${Date.now()}`;
                          const newItem = {
                            id: newId,
                            type: 'image',
                            src: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&q=80&w=1200',
                            category: activeCategory === 'all' ? 'production' : activeCategory,
                            ru: { title: 'Новый элемент', desc: 'Описание нового элемента.' },
                            kk: { title: 'Жаңа элемент', desc: 'Жаңа элемент сипаттамасы.' },
                            en: { title: 'New Item', desc: 'Description of the new item.' }
                          };
                          
                          const nextLayout = {
                            ...layout,
                            order_gallery: [...activeItemsOrder, newId],
                            items: { ...activeItemsMap, [newId]: newItem }
                          };
                          
                          window.parent.postMessage({
                            type: 'DEMETRA_BUILDER',
                            action: 'UPDATE_GALLERY_LAYOUT',
                            layout: nextLayout
                          }, '*');

                          window.parent.postMessage({
                            type: 'DEMETRA_BUILDER',
                            action: 'EDIT_BLOCK',
                            id: newId
                          }, '*');
                        }}
                        style={{ 
                          background: 'rgba(0, 255, 65, 0.1)', 
                          border: '1px dashed #00ff41', 
                          color: '#00ff41', 
                          padding: '1.25rem 3rem', 
                          borderRadius: '12px', 
                          fontWeight: '900', 
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.75rem',
                          fontSize: '0.85rem',
                          letterSpacing: '0.15em',
                          transition: 'all 0.2s ease'
                        }}
                      >
                        <PlusCircle size={20} />
                        ДОБАВИТЬ ФОТО / ВИДЕО В ГАЛЕРЕЮ
                      </button>
                    </div>
                  )}

                  {/* Bento Masonry Grid */}
                  <motion.div 
                    className="bento-grid" 
                    style={{ gridAutoRows: '320px', gap: '2rem', marginBottom: '8rem' }}
                    layout
                  >
                    <AnimatePresence mode="popLayout">
                      {filteredItems.map((item: any, index: number) => {
                        const gridColumn = index % 3 === 0 ? 'span 7' : 'span 5';
                        const gridRow = index === 0 || index === 3 ? 'span 2' : 'span 1';
                        
                        return (
                          <BuilderWrapper
                            key={item.id}
                            id={item.id}
                            index={index}
                            isFirst={index === 0}
                            isLast={index === filteredItems.length - 1}
                            isBuilder={isBuilder}
                            arrayKey="order_gallery"
                            style={{
                              gridColumn: gridColumn,
                              gridRow: gridRow,
                            }}
                          >
                            <div 
                              onClick={() => !isBuilder && setSelectedImageIndex(index)}
                              className="product-card"
                              style={{
                                width: '100%',
                                height: '100%',
                                cursor: 'pointer',
                                position: 'relative'
                              }}
                            >
                              {renderMedia(item, lang)}
                              
                              <div 
                                style={{ 
                                  position: 'absolute', 
                                  inset: 0, 
                                  display: 'flex', 
                                  alignItems: 'center', 
                                  justifyContent: 'center', 
                                  opacity: 0, 
                                  transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)', 
                                  background: 'rgba(0, 143, 36, 0.15)' 
                                }} 
                                className="gallery-overlay"
                                onClick={(e) => {
                                  if (isBuilder) {
                                    e.stopPropagation();
                                    setSelectedImageIndex(index);
                                  }
                                }}
                              >
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
                                  {getCategoryIcon(item.category)}
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
                            </div>
                          </BuilderWrapper>
                        );
                      })}
                    </AnimatePresence>
                  </motion.div>
                </motion.div>
              </div>
            </BuilderWrapper>
          );
        } else if (id.startsWith('new_block_')) {
          const blockData = customBlocks[id];
          if (blockData) {
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
                <div className="container" style={{ paddingTop: '2rem', paddingBottom: '2rem' }}>
                  <CustomBlock id={id} data={blockData} />
                </div>
              </BuilderWrapper>
            );
          }
        }
        return null;
      })}

      {/* FULLSCREEN LIGHTBOX PORTAL OVERLAY */}
      <AnimatePresence>
        {selectedImageIndex !== null && filteredItems[selectedImageIndex] && (
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
              >
                <X size={20} />
              </button>
            </div>

            <div style={{
              position: 'relative',
              width: '90%',
              maxWidth: '1200px',
              height: '60vh',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center'
            }}>
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
              >
                <ChevronLeft size={30} />
              </button>

              {(() => {
                const activeItem = filteredItems[selectedImageIndex];
                if (activeItem.type === 'video') {
                  const src = activeItem.src || '';
                  let isYoutube = false;
                  let videoId = '';
                  if (src.includes('youtube.com') || src.includes('youtu.be')) {
                    isYoutube = true;
                    if (src.includes('youtube.com/watch')) {
                      const urlParams = new URLSearchParams(src.split('?')[1] || '');
                      videoId = urlParams.get('v') || '';
                    } else if (src.includes('youtu.be/')) {
                      videoId = src.split('youtu.be/')[1]?.split('?')[0] || '';
                    } else if (src.includes('youtube.com/embed/')) {
                      videoId = src.split('youtube.com/embed/')[1]?.split('?')[0] || '';
                    }
                  }
                  
                  if (isYoutube) {
                    return (
                      <iframe
                        src={`https://www.youtube.com/embed/${videoId}?autoplay=1`}
                        title={activeItem[lang]?.title || ''}
                        style={{ width: '100%', height: '100%', border: 'none', borderRadius: '16px' }}
                        allow="autoplay; encrypted-media; picture-in-picture"
                        allowFullScreen
                      />
                    );
                  } else {
                    return (
                      <video
                        src={src}
                        controls
                        autoPlay
                        style={{
                          maxWidth: '100%',
                          maxHeight: '100%',
                          objectFit: 'contain',
                          borderRadius: '16px',
                          boxShadow: '0 30px 100px rgba(0,0,0,0.8), 0 0 50px rgba(0, 143, 36, 0.1)'
                        }}
                      />
                    );
                  }
                }
                
                return (
                  <motion.img 
                    key={activeItem.src}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.4, ease: 'easeOut' }}
                    src={activeItem.src} 
                    alt="" 
                    style={{
                      maxWidth: '100%',
                      maxHeight: '100%',
                      objectFit: 'contain',
                      borderRadius: '16px',
                      boxShadow: '0 30px 100px rgba(0,0,0,0.8), 0 0 50px rgba(0, 143, 36, 0.1)'
                    }}
                  />
                );
              })()}

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
              >
                <ChevronRight size={30} />
              </button>
            </div>

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
