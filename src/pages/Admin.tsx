import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { 
  Settings, 
  LayoutDashboard, 
  Package, 
  Truck, 
  MessageSquare, 
  Image as ImageIcon, 
  Save, 
  Plus, 
  Trash2, 
  Edit3, 
  ChevronRight, 
  Globe, 
  Zap,
  BarChart3,
  ShieldCheck,
  Search,
  Filter,
  Activity,
  CheckCircle2,
  ArrowLeft,
  RotateCcw,
  Menu,
  X,
  PlusCircle,
  ExternalLink,
  Phone,
  Mail,
  User,
  Info,
  Layers,
  Home,
  Users,
  Compass,
  FileText,
  Monitor,
  MoveUp,
  MoveDown,
  Eye,
  EyeOff,
  GripVertical,
  MousePointer2,
  Settings2,
  Copy,
  Trash,
  Type,
  AlignLeft,
  Columns,
  CreditCard,
  Megaphone,
  Minus
} from 'lucide-react';
import { useLang } from '../LangContext';
import { useTheme } from '../ThemeContext';
import { translations as defaultTranslations, productsData as defaultProducts, categories as defaultCategories } from '../i18n';
import { setCustomBlock, getCustomBlocks } from '../components/CustomBlock';

// Full site preview components (simplified for admin context)
import HomeContent from './Home';

export default function Admin() {
  const { lang, setLang, t } = useLang();
  const [activeTab, setActiveTab] = useState('builder'); // Default to Builder (Tilda Mode)
  const [isSidebarOpen, setIsSidebarOpen] = useState(window.innerWidth >= 1024);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  
  const [allTranslations, setAllTranslations] = useState<any>(() => {
    try {
      const saved = localStorage.getItem('demetra_translations');
      const base = JSON.parse(JSON.stringify(defaultTranslations));
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.ru) base.ru = { ...base.ru, ...parsed.ru };
        if (parsed.kk) base.kk = { ...base.kk, ...parsed.kk };
        if (parsed.en) base.en = { ...base.en, ...parsed.en };
      }
      return base;
    } catch (e) { return JSON.parse(JSON.stringify(defaultTranslations)); }
  });

  const [products, setProducts] = useState<any[]>(() => {
    const saved = localStorage.getItem('demetra_products');
    return saved ? JSON.parse(saved) : JSON.parse(JSON.stringify(defaultProducts));
  });

  const [pageLayouts, setPageLayouts] = useState<any>(() => {
    const keys = ['home', 'catalog', 'services', 'about', 'contacts', 'partner', 'gallery'];
    const layouts: any = {};
    keys.forEach(k => {
      const saved = localStorage.getItem(`demetra_${k}_layout`);
      const defaults: any = {
        home: { order: ['hero', 'marquee', 'catalog', 'partnership', 'services', 'cta'], hidden: [], styles: {}, images: {} },
        catalog: { order: [], hidden: [], styles: {}, images: {} },
        services: { order: [], hidden: [], styles: {}, images: {} },
        about: { order: [], hidden: [], styles: {}, images: {} },
        contacts: { order: [], hidden: [], styles: {}, images: {} },
        partner: { order: [], hidden: [], styles: {}, images: {} },
        gallery: {
          order: ['gallery_1', 'gallery_2', 'gallery_3', 'gallery_4', 'gallery_5', 'gallery_6'],
          hidden: [],
          styles: {},
          images: {},
          items: {
            gallery_1: { id: "gallery_1", src: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&q=80&w=1200", type: 'image', category: 'production', ru: { title: "Конвейерная линия Т-1500", desc: "Установка и пусконаладка новой автоматизированной конвейерной линии с HDPE роликами." }, kk: { title: "Т-1500 конвейерлік желісі", desc: "HDPE роликтері бар жаңа автоматтандырылған конвейер желісін орнату және іске қосу." }, en: { title: "T-1500 Conveyor Line", desc: "Installation and commissioning of a new automated conveyor line with HDPE rollers." } },
            gallery_2: { id: "gallery_2", src: "https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122?auto=format&fit=crop&q=80&w=1200", type: 'image', category: 'services', ru: { title: "Ремонт конвейерной ленты", desc: "Срочная стыковка конвейерной ленты методом горячей вулканизации на глубине." }, kk: { title: "Конвейер таспасын жөндеу", desc: "Тереңдікте ыстық вулканизация әдісімен конвейер таспасын шұғыл біріктіру." }, en: { title: "Conveyor Belt Repair", desc: "Urgent splicing of a conveyor belt using hot vulcanization method at depth." } },
            gallery_3: { id: "gallery_3", src: "https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&q=80&w=1200", type: 'image', category: 'equipment', ru: { title: "Футеровка приводного барабана", desc: "Применение резинокерамической футеровки германского производства для предотвращения проскальзывания ленты." }, kk: { title: "Жетекші барабанды футерлеу", desc: "Таспаның сырғып кетуін болдырмау үшін германдық резеңке-керамикалық футерлеуді қолдану." }, en: { title: "Drive Drum Lagging", desc: "Application of German-made rubber-ceramic lagging to prevent belt slippage." } },
            gallery_4: { id: "gallery_4", src: "https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&q=80&w=1200", type: 'image', category: 'production', ru: { title: "Контроль качества роликов", desc: "Лабораторные испытания биения конвейерных роликов на специализированном стенде перед отгрузкой клиенту." }, kk: { title: "Роликтердің сапасын бақылау", desc: "Тапсырыс берушіге жөнелту алдында мамандандырылған стендте конвейер роликтерінің соғуын зертханалық сынау." }, en: { title: "Roller Quality Control", desc: "Laboratory testing of conveyor roller runout on a specialized stand before shipping to the client." } },
            gallery_5: { id: "gallery_5", src: "https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&q=80&w=1200", type: 'image', category: 'materials', ru: { title: "Демпферная станция амортизации", desc: "Успешный монтаж амортизирующей станции в точке загрузки крупнокусковой руды." }, kk: { title: "Амортизациялық демпферлік станция", desc: "Ірі кесекті кенді тиеу нүктесінде амортизациялық станцияны сәтті монтаждау." }, en: { title: "Shock Absorbing Damper Station", desc: "Successful installation of a damping station at the large-fraction ore loading point." } },
            gallery_6: { id: "gallery_6", src: "https://images.unsplash.com/photo-1416339306562-f3d12fefd36f?auto=format&fit=crop&q=80&w=1200", type: 'image', category: 'services', ru: { title: "Антикоррозийная защита", desc: "Нанесение полимерных защитных составов на стальные конструкции металлургического цеха." }, kk: { title: "Коррозияға қарсы қорғаныс", desc: "Металлургиялық цехтың болат конструкцияларына полимерлі қорғаныс құрамдарын жағу." }, en: { title: "Anti-Corrosion Protection", desc: "Application of polymer protective coatings to the steel structures of the metallurgical workshop." } }
          }
        }
      };
      
      try {
        if (saved) {
          const parsed = JSON.parse(saved);
          // Ensure structure is correct
          layouts[k] = {
            order: parsed.order || defaults[k].order,
            hidden: parsed.hidden || defaults[k].hidden,
            styles: parsed.styles || defaults[k].styles,
            images: parsed.images || defaults[k].images,
            links: parsed.links || defaults[k].links || {},
            items: parsed.items || defaults[k].items || {}
          };
        } else {
          layouts[k] = defaults[k];
        }
      } catch (e) {
        layouts[k] = defaults[k];
      }
    });
    return layouts;
  });

  const [showSaveToast, setShowSaveToast] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
      if (window.innerWidth < 1024) setIsSidebarOpen(false);
      else setIsSidebarOpen(true);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const tabs = [
    { id: 'builder', icon: <Monitor size={20} />, label: 'Visual Builder (Tilda Mode)' },
    { id: 'dashboard', icon: <BarChart3 size={20} />, label: t.admin_dashboard || 'Dashboard' },
    { id: 'content', icon: <Layers size={20} />, label: t.admin_content || 'All Texts' },
    { id: 'products', icon: <Package size={20} />, label: t.admin_products || 'Catalog' },
    { id: 'services', icon: <Truck size={20} />, label: t.admin_services || 'Services' },
    { id: 'settings', icon: <Settings size={20} />, label: t.admin_settings || 'Global Settings' },
  ];

  const handleSave = () => {
    localStorage.setItem('demetra_translations', JSON.stringify(allTranslations));
    localStorage.setItem('demetra_products', JSON.stringify(products));
    Object.keys(pageLayouts).forEach(k => {
      localStorage.setItem(`demetra_${k}_layout`, JSON.stringify(pageLayouts[k]));
    });
    window.dispatchEvent(new Event('storage'));
    setShowSaveToast(true);
    setTimeout(() => setShowSaveToast(false), 3000);
  };

  const resetToDefault = () => {
    if (window.confirm('Reset all changes?')) {
      localStorage.removeItem('demetra_translations');
      localStorage.removeItem('demetra_products');
      const keys = ['home', 'catalog', 'services', 'about', 'contacts', 'partner', 'gallery'];
      keys.forEach(k => localStorage.removeItem(`demetra_${k}_layout`));
      window.location.reload();
    }
  };

  const updateTranslation = (langKey: string, itemKey: string, newValue: string) => {
    setAllTranslations((prev: any) => ({ ...prev, [langKey]: { ...prev[langKey], [itemKey]: newValue }}));
  };

  const sidebarWidth = isSidebarOpen ? '280px' : '0px';
  const effectiveLang = (['ru', 'kk', 'en'].includes(lang)) ? lang : 'ru';

  return (
    <div className="admin-layout" style={{ display: 'flex', minHeight: '100vh', background: '#050505', color: '#ffffff', position: 'relative', zIndex: 999999, pointerEvents: 'auto', fontFamily: 'Inter, system-ui, sans-serif' }}>
      <AnimatePresence>
        {showSaveToast && (
          <motion.div initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 50 }} style={{ position: 'fixed', bottom: '2rem', right: '2rem', background: '#00ff41', color: '#000', padding: '1rem 2rem', borderRadius: '12px', display: 'flex', alignItems: 'center', gap: '0.75rem', fontWeight: '900', zIndex: 1000000, boxShadow: '0 10px 40px rgba(0, 255, 65, 0.4)' }}>
            <CheckCircle2 size={20} /> {t.admin_save || 'SAVED'}
          </motion.div>
        )}
      </AnimatePresence>

      <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} style={{ position: 'fixed', top: '1.25rem', left: '1.25rem', zIndex: 9999, background: '#111', border: '1px solid #333', color: '#00ff41', padding: '0.75rem', borderRadius: '12px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Menu size={24} />
      </button>

      {/* Sidebar */}
      <motion.div animate={{ width: sidebarWidth }} style={{ background: '#0a0a0a', borderRight: '1px solid #222', padding: isSidebarOpen ? '5rem 1.5rem 2rem 1.5rem' : '0', display: 'flex', flexDirection: 'column', gap: '2rem', position: 'fixed', height: '100vh', zIndex: 2500, boxShadow: '10px 0 50px rgba(0,0,0,0.5)', overflow: 'hidden' }}>
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', color: '#00ff41', fontWeight: '800', fontSize: '0.8rem', textDecoration: 'none', background: 'rgba(0,255,65,0.05)', padding: '1rem', borderRadius: '8px', border: '1px solid #222' }}>
          <ArrowLeft size={16} /> {t.admin_return || 'RETURN'}
        </Link>
        <div style={{ display: 'flex', background: '#1a1a1a', padding: '0.3rem', borderRadius: '8px', border: '1px solid #222' }}>
          {(['ru', 'kk', 'en'] as const).map((l) => (
            <button key={l} onClick={() => setLang(l)} style={{ flex: 1, padding: '0.6rem', borderRadius: '6px', border: 'none', background: lang === l ? '#00ff41' : 'transparent', color: lang === l ? '#000' : '#888', fontSize: '0.7rem', fontWeight: '900', cursor: 'pointer', transition: '0.2s', textTransform: 'uppercase' }}>{l}</button>
          ))}
        </div>
        <div className="logo" style={{ fontSize: '1.2rem', fontWeight: '900', letterSpacing: '-0.02em' }}>DEMETRA<span style={{ color: '#00ff41' }}>SYSTEM</span><div style={{ fontSize: '0.6rem', color: '#00ff41', letterSpacing: '0.2em', marginTop: '0.25rem' }}>TILDA_MODE V2.1</div></div>
        <nav style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          {tabs.map(tab => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id)} style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '1rem', borderRadius: '12px', border: 'none', background: activeTab === tab.id ? 'rgba(0, 255, 65, 0.1)' : 'transparent', color: activeTab === tab.id ? '#00ff41' : '#888', cursor: 'pointer', transition: '0.2s', textAlign: 'left', fontWeight: '700', fontSize: '0.9rem' }}>{tab.icon} {tab.label}</button>
          ))}
        </nav>
        <button onClick={resetToDefault} style={{ marginTop: 'auto', display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '1rem', background: 'rgba(255,0,0,0.05)', color: '#ff4b4b', border: '1px solid #222', borderRadius: '8px', cursor: 'pointer', fontWeight: '800', fontSize: '0.8rem' }}><RotateCcw size={16} /> {t.admin_reset}</button>
      </motion.div>

      {/* Main Area */}
      <main style={{ marginLeft: sidebarWidth, flex: 1, background: activeTab === 'builder' ? '#111' : '#000', transition: '0.3s', minHeight: '100vh', position: 'relative' }}>
        {activeTab !== 'builder' && (
          <header style={{ padding: '4rem 4rem 0', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '2rem' }}>
            <div>
              <h1 style={{ fontSize: '3rem', marginBottom: '0.5rem', textTransform: 'uppercase', fontWeight: '900' }}>{tabs.find(t_item => t_item.id === activeTab)?.label}</h1>
              <p style={{ color: '#888' }}>{t.admin_desc}</p>
            </div>
            <button onClick={handleSave} style={{ background: '#00ff41', color: '#000', border: 'none', padding: '1.25rem 3.5rem', borderRadius: '16px', fontWeight: '900', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.75rem', boxShadow: '0 0 30px rgba(0, 255, 65, 0.2)' }}><Save size={20} /> {t.admin_save}</button>
          </header>
        )}

        <AnimatePresence mode="wait">
          <motion.div key={activeTab} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }}>
            {activeTab === 'builder' ? (
              <TildaEditor pageLayouts={pageLayouts} setPageLayouts={setPageLayouts} allTranslations={allTranslations} updateTranslation={updateTranslation} currentLang={effectiveLang} handleSave={handleSave} isSidebarOpen={isSidebarOpen} />
            ) : (
              <div style={{ padding: '4rem' }}>
                {activeTab === 'dashboard' && <DashboardOverview windowWidth={windowWidth} t={t} />}
                {activeTab === 'content' && <PageEditor allTranslations={allTranslations} updateTranslation={updateTranslation} currentLang={effectiveLang} windowWidth={windowWidth} t={t} />}
                {activeTab === 'products' && <ProductManager products={products} setProducts={setProducts} currentLang={effectiveLang} categories={defaultCategories} windowWidth={windowWidth} />}
                {activeTab === 'services' && <ServicesManager allTranslations={allTranslations} updateTranslation={updateTranslation} currentLang={effectiveLang} windowWidth={windowWidth} />}
                {activeTab === 'settings' && <GlobalSettings allTranslations={allTranslations} updateTranslation={updateTranslation} currentLang={effectiveLang} windowWidth={windowWidth} />}
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  );
}

// TILDA STYLE EDITOR
function TildaEditor({ pageLayouts, setPageLayouts, allTranslations, updateTranslation, currentLang, handleSave, isSidebarOpen }: any) {
  const [editingKey, setEditingKey] = useState<string | null>(null);
  const [isSettingsOpen, setIsSettingsOpen] = useState<boolean>(false);
  const [previewRoute, setPreviewRoute] = useState<string>('/');
  const [isLibraryOpen, setIsLibraryOpen] = useState<boolean>(true);
  const [libSearch, setLibSearch] = useState<string>('');
  const iframeRef = useRef<HTMLIFrameElement>(null);

  // Map route to layout key
  const routeToKey = (route: string) => {
    if (route === '/') return 'home';
    return route.replace('/', '');
  };

  const layoutKey = routeToKey(previewRoute);
  const currentLayout = pageLayouts[layoutKey];

  const updateLayout = (newLayout: any) => {
    setPageLayouts((prev: any) => ({ ...prev, [layoutKey]: newLayout }));
  };
  
  const moveSection = (arrayKey: string, index: number, direction: 'up' | 'down') => {
    const key = arrayKey || 'order';
    const newOrder = [...(currentLayout[key] || [])];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= newOrder.length) return;
    const temp = newOrder[index];
    newOrder[index] = newOrder[targetIndex];
    newOrder[targetIndex] = temp;
    updateLayout({ ...currentLayout, [key]: newOrder });
  };

  const removeSection = (id: string) => {
    updateLayout({ ...currentLayout, hidden: [...(currentLayout.hidden || []), id] });
  };

  const addMainSection = (sectionId: string) => {
    let nextOrder = [...(currentLayout.order || [])];
    let nextHidden = [...(currentLayout.hidden || [])];
    
    // If hidden, unhide it
    if (nextHidden.includes(sectionId)) {
      nextHidden = nextHidden.filter(x => x !== sectionId);
    }
    
    // If not in order, add it
    if (!nextOrder.includes(sectionId)) {
      nextOrder.push(sectionId);
    }
    
    updateLayout({
      ...currentLayout,
      order: nextOrder,
      hidden: nextHidden
    });
  };

  const addCustomBlock = (type: string) => {
    const newId = `new_block_${Date.now()}`;
    
    const defaultDataMap: Record<string, any> = {
      heading: { type: 'heading', heading: 'Новый заголовок', subheading: 'Раздел', body: 'Описание раздела...' },
      text: { type: 'text', body: 'Текст нового блока. Вы можете изменить этот текст в панели настроек.' },
      divider: { type: 'divider' },
      button: { type: 'button', label: 'Нажми меня', href: '#' },
      card: { type: 'card', label: 'Заголовок карточки', body: 'Описание карточки...', src: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&q=80&w=600' },
      two_col: { type: 'two_col', col1: 'Левая колонка с описанием...', col2: 'Правая колонка с характеристиками...' },
      image_text: { type: 'image_text', heading: 'Индустриальные решения', body: 'Описание преимуществ нашей компании...', src: 'https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122?auto=format&fit=crop&q=80&w=600' },
      cta_banner: { type: 'cta_banner', heading: 'Готовы начать проект?', subheading: 'Свяжитесь с нами', body: 'Наши специалисты ответят на все вопросы.', label: 'Оставить заявку', href: '/contacts' }
    };
    
    const allCustomBlocks = { ...getCustomBlocks(), [newId]: defaultDataMap[type] || { type } };
    localStorage.setItem('demetra_custom_blocks', JSON.stringify(allCustomBlocks));
    window.dispatchEvent(new Event('storage'));
    
    const nextOrder = [...(currentLayout.order || []), newId];
    updateLayout({
      ...currentLayout,
      order: nextOrder
    });
    
    setEditingKey(newId);
    setIsSettingsOpen(true);
  };

  const addGalleryItem = () => {
    const newId = `gallery_${Date.now()}`;
    const newItem = {
      id: newId,
      type: 'image',
      src: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&q=80&w=1200',
      category: 'production',
      ru: { title: 'Новый элемент', desc: 'Описание нового элемента.' },
      kk: { title: 'Жаңа элемент', desc: 'Жаңа элемент сипаттамасы.' },
      en: { title: 'New Item', desc: 'Description of the new item.' }
    };
    
    const nextLayout = {
      ...currentLayout,
      order: [...(currentLayout.order || []), newId],
      items: { ...(currentLayout.items || {}), [newId]: newItem }
    };
    
    updateLayout(nextLayout);
    setEditingKey(newId);
    setIsSettingsOpen(true);
  };

  useEffect(() => {
    const handleMessage = (e: MessageEvent) => {
      if (e.data?.type === 'DEMETRA_BUILDER') {
        const { action, id, index, key, value, arrayKey } = e.data;
        if (action === 'EDIT_BLOCK') {
          setEditingKey(id);
          setIsSettingsOpen(true);
        }
        if (action === 'MOVE_UP') moveSection(arrayKey, index, 'up');
        if (action === 'MOVE_DOWN') moveSection(arrayKey, index, 'down');
        if (action === 'REMOVE_BLOCK') {
          if (id?.startsWith('gallery_')) {
            const newOrder = (currentLayout.order || []).filter((x: string) => x !== id);
            const newItems = { ...(currentLayout.items || {}) };
            delete newItems[id];
            updateLayout({ ...currentLayout, order: newOrder, items: newItems });
            if (editingKey === id) {
              setEditingKey(null);
              setIsSettingsOpen(false);
            }
          } else {
            removeSection(id);
          }
        }
        if (action === 'UPDATE_GALLERY_LAYOUT') {
          updateLayout(e.data.layout);
        }
        if (action === 'ADD_BLOCK_AFTER') {
           const newOrder = [...(currentLayout.order || [])];
           newOrder.splice(index + 1, 0, `new_block_${Date.now()}`); // Insert a new dummy block
           updateLayout({ ...currentLayout, order: newOrder });
        }
        if (action === 'MOVE_BLOCK_TO') {
           const { draggedId, targetId, arrayKey: arrKey } = e.data;
           const k = arrKey || 'order';
           const newOrder = [...(currentLayout[k] || [])];
           const draggedIndex = newOrder.indexOf(draggedId);
           const targetIndex = newOrder.indexOf(targetId);
           if (draggedIndex !== -1 && targetIndex !== -1) {
             newOrder.splice(draggedIndex, 1);
             newOrder.splice(targetIndex, 0, draggedId);
             updateLayout({ ...currentLayout, [k]: newOrder });
           }
        }
        if (action === 'UPDATE_TEXT') {
           updateTranslation(currentLang, key, value);
        }
        if (action === 'UPDATE_STYLE') {
           updateLayout({
             ...currentLayout, 
             styles: {
               ...(currentLayout.styles || {}),
               [id]: { ...(currentLayout.styles?.[id] || {}), ...e.data.styles }
             }
           });
        }
      }
    };
    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, [currentLayout, currentLang, updateTranslation, previewRoute, editingKey]);

  useEffect(() => {
    if (iframeRef.current?.contentWindow) {
      iframeRef.current.contentWindow.postMessage({ type: 'DEMETRA_UPDATE_LAYOUT', layout: currentLayout }, '*');
      iframeRef.current.contentWindow.postMessage({ type: 'DEMETRA_UPDATE_TRANSLATIONS', translations: allTranslations }, '*');
    }
  }, [currentLayout, allTranslations, previewRoute]);

  return (
    <div className="tilda-editor" style={{ position: 'relative', height: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* Top Floating Toolbar */}
      <div style={{ background: '#1a1a1a', borderBottom: '1px solid #333', padding: '1.25rem 2rem', paddingLeft: isSidebarOpen ? '2rem' : '5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', zIndex: 5000, flexShrink: 0, transition: 'padding-left 0.2s ease' }}>
         <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', flexWrap: 'wrap' }}>
            <div style={{ background: '#00ff41', color: '#000', padding: '0.4rem 0.8rem', borderRadius: '4px', fontWeight: '900', fontSize: '0.7rem', letterSpacing: '0.05em' }}>VISUAL MODE</div>
            
            {/* Sidebar toggle button inside the visual editor */}
            <button
              onClick={() => setIsLibraryOpen(!isLibraryOpen)}
              style={{
                background: isLibraryOpen ? 'rgba(0, 255, 65, 0.1)' : '#222',
                color: isLibraryOpen ? '#00ff41' : '#aaa',
                border: isLibraryOpen ? '1px solid #00ff41' : '1px solid #444',
                padding: '0.5rem 1rem',
                borderRadius: '8px',
                fontSize: '0.8rem',
                fontWeight: '800',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '0.4rem',
                transition: 'all 0.2s ease'
              }}
            >
              <PlusCircle size={14} />
              Библиотека блоков
            </button>

            <select 
               value={previewRoute}
               onChange={(e) => setPreviewRoute(e.target.value)}
               style={{ background: '#0a0a0a', color: '#fff', border: '1px solid #333', padding: '0.5rem 1rem', borderRadius: '8px', fontSize: '0.85rem', outline: 'none', cursor: 'pointer' }}
            >
               <option value="/">Главная (Home)</option>
               <option value="/catalog">Оборудование (Catalog)</option>
               <option value="/services">Услуги (Services)</option>
               <option value="/about">О компании (About)</option>
               <option value="/contacts">Контакты (Contacts)</option>
               <option value="/partner">Партнерам (Partner)</option>
               <option value="/gallery">Галерея (Gallery)</option>
            </select>
            <div style={{ color: '#888', fontSize: '0.85rem' }}>Switch pages to edit different areas.</div>

            {editingKey && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <button
                  onClick={() => setIsSettingsOpen(!isSettingsOpen)}
                  style={{
                    background: isSettingsOpen ? 'rgba(0, 255, 65, 0.1)' : '#222',
                    color: isSettingsOpen ? '#00ff41' : '#aaa',
                    border: isSettingsOpen ? '1px solid #00ff41' : '1px solid #444',
                    padding: '0.5rem 1rem',
                    borderRadius: '8px',
                    fontSize: '0.8rem',
                    fontWeight: '800',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.4rem',
                    transition: 'all 0.2s ease'
                  }}
                >
                  <Settings2 size={14} />
                  {isSettingsOpen ? 'Скрыть настройки' : `Настройки (${editingKey})`}
                </button>
                <button
                  onClick={() => { setEditingKey(null); setIsSettingsOpen(false); }}
                  style={{
                    background: 'rgba(255, 75, 75, 0.1)',
                    color: '#ff4b4b',
                    border: '1px solid rgba(255, 75, 75, 0.2)',
                    padding: '0.5rem 0.8rem',
                    borderRadius: '8px',
                    fontSize: '0.8rem',
                    fontWeight: '800',
                    cursor: 'pointer',
                  }}
                  title="Сбросить выбор текущего блока"
                >
                  Сбросить
                </button>
              </div>
            )}
         </div>
         <button onClick={handleSave} style={{ background: '#00ff41', color: '#000', border: 'none', padding: '0.75rem 2rem', borderRadius: '8px', fontWeight: '900', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem', boxShadow: '0 0 20px rgba(0, 255, 65, 0.2)' }}>
            <Save size={18} /> PUBLISH CHANGES
         </button>
      </div>

      {/* Main Workspace containing left library panel & iframe */}
      <div style={{ flex: 1, display: 'flex', position: 'relative', background: '#000', overflow: 'hidden' }}>
        
        {/* LEFT Library Panel */}
        <AnimatePresence>
          {isLibraryOpen && (
            <motion.div
              initial={{ width: 0, opacity: 0 }}
              animate={{ width: 340, opacity: 1 }}
              exit={{ width: 0, opacity: 0 }}
              transition={{ duration: 0.25, ease: 'easeInOut' }}
              style={{
                background: '#09090b',
                borderRight: '1px solid #222',
                display: 'flex',
                flexDirection: 'column',
                flexShrink: 0,
                overflow: 'hidden',
                zIndex: 4000
              }}
            >
              <div style={{ width: 340, display: 'flex', flexDirection: 'column', height: '100%', padding: '1.5rem', boxSizing: 'border-box' }}>
                 
                 {/* Header */}
                 <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
                   <div>
                     <h3 style={{ fontSize: '0.8rem', color: '#00ff41', fontWeight: '900', letterSpacing: '0.15em', margin: 0 }}>БИБЛИОТЕКА БЛОКОВ</h3>
                     <p style={{ color: '#555', fontSize: '0.65rem', margin: '0.2rem 0 0 0' }}>Нажмите элемент для добавления</p>
                   </div>
                   <button 
                     onClick={() => setIsLibraryOpen(false)} 
                     style={{ background: 'none', border: 'none', color: '#888', cursor: 'pointer', display: 'flex', alignItems: 'center' }}
                   >
                     <X size={18} />
                   </button>
                 </div>

                 {/* Search Bar */}
                 <div style={{ position: 'relative', marginBottom: '1.25rem' }}>
                   <Search size={14} style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: '#555' }} />
                   <input
                     type="text"
                     placeholder="Поиск блоков и элементов..."
                     value={libSearch}
                     onChange={(e) => setLibSearch(e.target.value)}
                     style={{
                       width: '100%',
                       background: '#121214',
                       border: '1px solid #222',
                       borderRadius: '8px',
                       padding: '0.5rem 0.5rem 0.5rem 2.2rem',
                       color: '#fff',
                       fontSize: '0.8rem',
                       outline: 'none',
                       boxSizing: 'border-box'
                     }}
                   />
                 </div>

                 {/* Scrollable list of items */}
                 <div className="custom-scrollbar" style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                    
                    {/* GALLERY MEDIA (shown if layoutKey === 'gallery') */}
                    {layoutKey === 'gallery' && (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                         <div style={{ fontSize: '0.65rem', color: '#555', fontWeight: '900', letterSpacing: '0.15em' }}>ГАЛЕРЕЯ МЕДИА</div>
                         <button
                           onClick={addGalleryItem}
                           style={{
                             width: '100%',
                             background: 'rgba(0, 255, 65, 0.05)',
                             border: '1px dashed #00ff41',
                             borderRadius: '12px',
                             padding: '1.25rem',
                             color: '#00ff41',
                             fontWeight: '800',
                             fontSize: '0.8rem',
                             cursor: 'pointer',
                             display: 'flex',
                             flexDirection: 'column',
                             alignItems: 'center',
                             gap: '0.5rem',
                             transition: 'all 0.2s'
                           }}
                           onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(0, 255, 65, 0.1)'}
                           onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(0, 255, 65, 0.05)'}
                         >
                           <Plus size={24} />
                           <span>Добавить Фото / Видео</span>
                         </button>
                      </div>
                    )}

                    {/* SECTIONS LIST (Home page only) */}
                    {layoutKey === 'home' && (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                         <div style={{ fontSize: '0.65rem', color: '#555', fontWeight: '900', letterSpacing: '0.15em' }}>СЕКЦИИ СТРАНИЦЫ</div>
                         <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                            {[
                              { id: 'hero', title: 'Hero (Обложка)', desc: 'Главный баннер, слайды и кнопки', icon: <Layers size={14} /> },
                              { id: 'marquee', title: 'Marquee (Инфо-строка)', desc: 'Бегущая строка с показателями', icon: <Zap size={14} /> },
                              { id: 'catalog', title: 'Catalog (Каталог)', desc: 'Сетка продукции и оборудования', icon: <Package size={14} /> },
                              { id: 'partnership', title: 'Partnership (Партнеры)', desc: 'Сетка логотипов партнеров', icon: <ExternalLink size={14} /> },
                              { id: 'services', title: 'Services (Услуги)', desc: 'Блоки преимуществ и услуг', icon: <Settings size={14} /> },
                              { id: 'cta', title: 'CTA (Обратная связь)', desc: 'Кнопки обратной связи', icon: <Phone size={14} /> }
                            ].filter(x => x.title.toLowerCase().includes(libSearch.toLowerCase()) || x.desc.toLowerCase().includes(libSearch.toLowerCase())).map(sec => {
                              const order = currentLayout.order || [];
                              const hidden = currentLayout.hidden || [];
                              const isAdded = order.includes(sec.id);
                              const isHidden = hidden.includes(sec.id);
                              
                              let statusText = 'Добавить';
                              let statusColor = '#00ff41';
                              let bg = 'rgba(0, 255, 65, 0.03)';
                              let border = '1px solid #1a1a1e';
                              
                              if (isAdded) {
                                if (isHidden) {
                                  statusText = 'Скрыт (Показать)';
                                  statusColor = '#888';
                                  bg = '#121214';
                                } else {
                                  statusText = 'Активен';
                                  statusColor = '#00ff41';
                                  bg = 'rgba(0, 255, 65, 0.08)';
                                  border = '1px solid rgba(0, 255, 65, 0.2)';
                                }
                              }
                              
                              return (
                                <div
                                  key={sec.id}
                                  onClick={() => addMainSection(sec.id)}
                                  style={{
                                    background: bg,
                                    border: border,
                                    borderRadius: '10px',
                                    padding: '0.75rem 0.85rem',
                                    cursor: 'pointer',
                                    transition: 'all 0.2s',
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'center',
                                    gap: '1rem'
                                  }}
                                  onMouseEnter={(e) => {
                                    e.currentTarget.style.borderColor = '#00ff41';
                                    e.currentTarget.style.background = 'rgba(0, 255, 65, 0.05)';
                                  }}
                                  onMouseLeave={(e) => {
                                    e.currentTarget.style.borderColor = isAdded && !isHidden ? 'rgba(0, 255, 65, 0.2)' : '#1a1a1e';
                                    e.currentTarget.style.background = bg;
                                  }}
                                >
                                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                    <div style={{ color: statusColor }}>{sec.icon}</div>
                                    <div style={{ textAlign: 'left' }}>
                                      <div style={{ fontSize: '0.75rem', color: '#fff', fontWeight: '800' }}>{sec.title}</div>
                                      <div style={{ fontSize: '0.6rem', color: '#555', marginTop: '0.1rem' }}>{sec.desc}</div>
                                    </div>
                                  </div>
                                  <div style={{ fontSize: '0.6rem', color: statusColor, fontWeight: '900', letterSpacing: '0.05em', whiteSpace: 'nowrap' }}>
                                    {statusText}
                                  </div>
                                </div>
                              );
                            })}
                         </div>
                      </div>
                    )}

                    {/* CUSTOM BLOCKS LIST */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                       <div style={{ fontSize: '0.65rem', color: '#555', fontWeight: '900', letterSpacing: '0.15em' }}>ДОБАВИТЬ ЭЛЕМЕНТЫ</div>
                       <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
                          {[
                            { id: 'heading', title: 'Заголовок', icon: '𝐇', desc: 'Heading' },
                            { id: 'text', title: 'Текст', icon: '¶', desc: 'Paragraph' },
                            { id: 'button', title: 'Кнопка', icon: '↗', desc: 'Button' },
                            { id: 'card', title: 'Карточка', icon: '▭', desc: 'Bento Card' },
                            { id: 'two_col', title: '2 Колонки', icon: '⫿', desc: '2 Columns' },
                            { id: 'image_text', title: 'Фото+Текст', icon: '⊡', desc: 'Image & Text' },
                            { id: 'cta_banner', title: 'Баннер', icon: '★', desc: 'Promo Banner' },
                            { id: 'divider', title: 'Разделитель', icon: '—', desc: 'Divider Line' }
                          ].filter(x => x.title.toLowerCase().includes(libSearch.toLowerCase()) || x.desc.toLowerCase().includes(libSearch.toLowerCase())).map(el => (
                            <button
                              key={el.id}
                              onClick={() => addCustomBlock(el.id)}
                              style={{
                                background: '#121214',
                                border: '1px solid #1e1e22',
                                borderRadius: '10px',
                                padding: '0.85rem 0.4rem',
                                color: '#fff',
                                cursor: 'pointer',
                                transition: 'all 0.2s',
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                gap: '0.3rem'
                              }}
                              onMouseEnter={(e) => {
                                e.currentTarget.style.borderColor = '#00ff41';
                                e.currentTarget.style.background = 'rgba(0, 255, 65, 0.04)';
                                e.currentTarget.style.transform = 'translateY(-2px)';
                              }}
                              onMouseLeave={(e) => {
                                e.currentTarget.style.borderColor = '#1e1e22';
                                e.currentTarget.style.background = '#121214';
                                e.currentTarget.style.transform = 'translateY(0)';
                              }}
                            >
                              <div style={{ fontSize: '1.2rem', color: '#00ff41', fontWeight: '800' }}>{el.icon}</div>
                              <div style={{ fontSize: '0.75rem', fontWeight: '800' }}>{el.title}</div>
                              <div style={{ fontSize: '0.6rem', color: '#555' }}>{el.desc}</div>
                            </button>
                          ))}
                       </div>
                    </div>

                 </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Small Toggle Handle for Sidebar on the left edge */}
        {!isLibraryOpen && (
          <button
            onClick={() => setIsLibraryOpen(true)}
            style={{
              position: 'absolute',
              left: 0,
              top: '50%',
              transform: 'translateY(-50%)',
              background: '#1a1a1a',
              border: '1px solid #333',
              borderLeft: 'none',
              color: '#00ff41',
              padding: '1.25rem 0.9rem 1.25rem 0.6rem',
              borderRadius: '0 20px 20px 0',
              cursor: 'pointer',
              zIndex: 5500,
              boxShadow: '10px 0 30px rgba(0,0,0,0.5)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: '0.2s',
            }}
            title="Открыть библиотеку блоков"
            onMouseEnter={(e) => {
              e.currentTarget.style.background = '#222';
              e.currentTarget.style.boxShadow = '10px 0 30px rgba(0, 255, 65, 0.1)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = '#1a1a1a';
              e.currentTarget.style.boxShadow = '10px 0 30px rgba(0,0,0,0.5)';
            }}
          >
            <PlusCircle size={20} />
          </button>
        )}

        {/* The Page Itself - Now a real Iframe showing the full site including Header and Footer! */}
        <div style={{ flex: 1, position: 'relative', background: '#000' }}>
           <iframe 
              ref={iframeRef}
              src={previewRoute} 
              style={{ width: '100%', height: '100%', border: 'none' }}
              title="Live Preview"
              onLoad={(e) => {
                 // Resync data when iframe navigates
                 const win = (e.target as HTMLIFrameElement).contentWindow;
                 win?.postMessage({ type: 'DEMETRA_UPDATE_LAYOUT', layout: currentLayout }, '*');
                 win?.postMessage({ type: 'DEMETRA_UPDATE_TRANSLATIONS', translations: allTranslations }, '*');
              }}
           />
        </div>
      </div>

      {/* Floating Settings Toggle Handle on the right edge */}
      {editingKey && !isSettingsOpen && (
        <button
          onClick={() => setIsSettingsOpen(true)}
          style={{
            position: 'absolute',
            right: 0,
            top: '50%',
            transform: 'translateY(-50%)',
            background: '#1a1a1a',
            border: '1px solid #333',
            borderRight: 'none',
            color: '#00ff41',
            padding: '1.25rem 0.6rem 1.25rem 0.9rem',
            borderRadius: '20px 0 0 20px',
            cursor: 'pointer',
            zIndex: 5500,
            boxShadow: '-10px 0 30px rgba(0,0,0,0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: '0.2s',
          }}
          title={`Показать настройки (${editingKey})`}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = '#222';
            e.currentTarget.style.boxShadow = '-10px 0 30px rgba(0, 255, 65, 0.1)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = '#1a1a1a';
            e.currentTarget.style.boxShadow = '-10px 0 30px rgba(0,0,0,0.5)';
          }}
        >
          <Settings2 size={22} style={{ animation: 'spin 10s linear infinite' }} />
        </button>
      )}

      {/* Editing Sidebar (Slide-over) */}
      <AnimatePresence>
        {editingKey && isSettingsOpen && (
          <motion.div 
            initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }}
            style={{ position: 'fixed', top: 0, right: 0, width: '480px', height: '100vh', background: '#0a0a0a', borderLeft: '1px solid #333', zIndex: 6000, padding: '2.5rem', boxShadow: '-20px 0 50px rgba(0,0,0,0.5)', overflowY: 'auto' }}
          >
             <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2.5rem' }}>
                <h3 style={{ fontSize: '0.7rem', color: '#00ff41', fontWeight: '900', letterSpacing: '0.2em' }}>BLOCK: {editingKey.toUpperCase()}</h3>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                   <button 
                     onClick={() => { setEditingKey(null); setIsSettingsOpen(false); }} 
                     style={{ background: 'rgba(255, 75, 75, 0.1)', border: '1px solid rgba(255, 75, 75, 0.2)', color: '#ff4b4b', padding: '0.4rem 0.8rem', borderRadius: '6px', fontSize: '0.75rem', fontWeight: '800', cursor: 'pointer' }}
                     title="Сбросить выбор текущего блока"
                   >
                     Сбросить выбор
                   </button>
                   <button onClick={() => setIsSettingsOpen(false)} style={{ background: 'none', border: 'none', color: '#888', cursor: 'pointer', display: 'flex', alignItems: 'center' }}><X size={24} /></button>
                </div>
             </div>
             
              {editingKey.startsWith('new_block_')
                 ? <CustomBlockEditor blockId={editingKey} />
                 : <StyleEditor editingKey={editingKey} currentLayout={currentLayout} updateLayout={updateLayout} onClose={() => { setEditingKey(null); setIsSettingsOpen(false); }} />
              }

             <button onClick={() => setIsSettingsOpen(false)} style={{ width: '100%', marginTop: '2rem', padding: '1.25rem', background: '#00ff41', color: '#000', border: 'none', borderRadius: '12px', fontWeight: '900', cursor: 'pointer' }}>
                APPLY SETTINGS
             </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// OTHER COMPONENTS (RE-INTEGRATED FROM PREVIOUS V1.8)
function DashboardOverview({ windowWidth, t }: any) {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: windowWidth < 1024 ? '1fr' : '1fr 1fr 1fr', gap: '2rem' }}>
      {[
        { label: t.admin_products, value: '24', icon: <Package />, color: '#00ff41' },
        { label: t.admin_services, value: '12', icon: <Truck />, color: '#0066ff' },
        { label: 'Inquiries', value: '158', icon: <MessageSquare />, color: '#ff00ff' },
      ].map((stat, i) => (
        <div key={i} style={{ padding: '2.5rem', background: '#0a0a0a', border: '1px solid #222', borderRadius: '24px', display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
          <div style={{ padding: '1.25rem', background: 'rgba(255,255,255,0.03)', borderRadius: '16px', color: stat.color }}>{stat.icon}</div>
          <div><div style={{ fontSize: '0.75rem', color: '#888', fontWeight: '800', letterSpacing: '0.15em' }}>{stat.label?.toUpperCase()}</div><div style={{ fontSize: '3rem', fontWeight: '900', lineHeight: 1, marginTop: '0.5rem' }}>{stat.value}</div></div>
        </div>
      ))}
    </div>
  );
}

function PageEditor({ allTranslations, updateTranslation, currentLang, windowWidth, t }: any) {
  const [search, setSearch] = useState('');
  return (
    <div style={{ background: '#0a0a0a', padding: '3rem', borderRadius: '32px', border: '1px solid #222' }}>
       <div style={{ marginBottom: '3rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h3 style={{ fontWeight: '900' }}>TEXT DATABASE ({currentLang.toUpperCase()})</h3>
          <input placeholder="Filter keys..." value={search} onChange={(e) => setSearch(e.target.value)} style={{ background: '#111', border: '1px solid #333', padding: '1rem', borderRadius: '12px', color: '#fff', width: '300px' }} />
       </div>
       <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
          {Object.entries(allTranslations[currentLang]).filter(([k]) => k.includes(search)).map(([k, v]: any) => (
             <div key={k} style={{ display: 'grid', gap: '0.5rem' }}>
                <label style={{ fontSize: '0.6rem', color: '#00ff41', fontWeight: '900' }}>{k.toUpperCase()}</label>
                <textarea value={v} onChange={(e) => updateTranslation(currentLang, k, e.target.value)} style={{ background: '#111', border: '1px solid #333', padding: '1rem', color: '#fff', borderRadius: '8px', minHeight: '60px' }} />
             </div>
          ))}
       </div>
    </div>
  );
}

function ProductManager({ products, setProducts, currentLang, categories, windowWidth }: any) {
  const updateProduct = (id: number, field: string, value: string) => {
    setProducts((prev: any[]) => prev.map(p => {
      if (p.id === id) {
        const updated = { ...p };
        if (['title', 'desc', 'category'].includes(field)) { updated[currentLang][field] = value; } else { updated[field] = value; }
        return updated;
      }
      return p;
    }));
  };
  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2.5rem' }}>
      {products.map((product: any) => (
        <div key={product.id} style={{ background: '#0a0a0a', border: '1px solid #222', borderRadius: '24px', overflow: 'hidden', display: 'flex' }}><div style={{ width: '150px', background: '#111', flexShrink: 0 }}><img src={product.image} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.7 }} /></div><div style={{ padding: '2rem', flex: 1, display: 'flex', flexDirection: 'column', gap: '1rem' }}><input value={product[currentLang]?.title} onChange={(e) => updateProduct(product.id, 'title', e.target.value)} style={{ background: 'transparent', border: 'none', color: '#fff', fontSize: '1.25rem', fontWeight: '900', width: '100%', outline: 'none' }} /><textarea value={product[currentLang]?.desc} onChange={(e) => updateProduct(product.id, 'desc', e.target.value)} style={{ background: '#111', border: '1px solid #222', color: '#888', fontSize: '0.8rem', padding: '1rem', borderRadius: '12px', minHeight: '80px', resize: 'none', width: '100%' }} /></div></div>
      ))}
    </div>
  );
}

function ServicesManager({ allTranslations, updateTranslation, currentLang, windowWidth }: any) {
  return <div style={{ padding: '4rem', background: '#0a0a0a', border: '1px solid #222', borderRadius: '24px', textAlign: 'center' }}>Services are managed via Visual Builder.</div>;
}

function GlobalSettings({ allTranslations, updateTranslation, currentLang, windowWidth }: any) {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '3rem' }}>
       <div style={{ background: '#0a0a0a', padding: '3rem', borderRadius: '32px', border: '1px solid #222' }}><h3 style={{ marginBottom: '2rem', fontWeight: '900' }}>BRAND IDENTITY</h3><div style={{ display: 'grid', gap: '2rem' }}><SettingField label="COMPANY BRAND NAME" val={allTranslations[currentLang].company_name} onChange={(v: string) => updateTranslation(currentLang, 'company_name', v)} /><SettingField label="HEADQUARTERS ADDRESS" val={allTranslations[currentLang].address} onChange={(v: string) => updateTranslation(currentLang, 'address', v)} /></div></div>
    </div>
  );
}

function SettingField({ label, val, onChange }: any) {
  return (
    <div style={{ display: 'grid', gap: '0.75rem' }}><label style={{ fontSize: '0.7rem', color: '#888', fontWeight: '900' }}>{label}</label><input value={val || ''} onChange={(e) => onChange(e.target.value)} style={{ background: '#111', border: '1px solid #222', padding: '1.25rem', borderRadius: '12px', color: '#fff', fontSize: '1rem', outline: 'none' }} /></div>
  );
}

// ─── Content Block Editor ────────────────────────────────────────────────────
const BLOCK_TYPES = [
  { id: 'heading',    label: 'Заголовок',       icon: '𝐇' },
  { id: 'text',       label: 'Текст',            icon: '¶' },
  { id: 'divider',    label: 'Разделитель',      icon: '—' },
  { id: 'button',     label: 'Кнопка',           icon: '↗' },
  { id: 'card',       label: 'Карточка',         icon: '▭' },
  { id: 'two_col',    label: '2 Колонки',        icon: '⫿' },
  { id: 'image_text', label: 'Фото + Текст',     icon: '⊡' },
  { id: 'cta_banner', label: 'CTA Баннер',       icon: '★' },
];

function CustomBlockEditor({ blockId }: { blockId: string }) {
  const [data, setData] = useState<any>(() => {
    try {
      const all = JSON.parse(localStorage.getItem('demetra_custom_blocks') || '{}');
      return all[blockId] || { type: 'heading' };
    } catch { return { type: 'heading' }; }
  });

  const update = (key: string, val: string) => {
    const next = { ...data, [key]: val };
    setData(next);
    setCustomBlock(blockId, next);
  };

  const selectType = (type: string) => {
    const next = { ...data, type };
    setData(next);
    setCustomBlock(blockId, next);
  };

  const inp = (style?: any): React.CSSProperties => ({
    background: '#111', border: '1px solid #333', padding: '0.75rem 1rem',
    color: '#fff', fontSize: '0.9rem', borderRadius: '8px', outline: 'none',
    width: '100%', boxSizing: 'border-box', ...style
  });

  const lbl = (text: string) => (
    <label style={{ fontSize: '0.65rem', color: '#888', fontWeight: '900', letterSpacing: '0.1em' }}>{text}</label>
  );

  const field = (label: string, key: string, placeholder = '', multiline = false) => (
    <div style={{ display: 'grid', gap: '0.4rem' }}>
      {lbl(label)}
      {multiline
        ? <textarea value={data[key] || ''} onChange={e => update(key, e.target.value)} placeholder={placeholder}
            style={{ ...inp(), minHeight: '90px', resize: 'vertical' }} />
        : <input value={data[key] || ''} onChange={e => update(key, e.target.value)} placeholder={placeholder}
            style={inp()} />
      }
    </div>
  );

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Type picker */}
      <div>
        {lbl('ТИП БЛОКА')}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem', marginTop: '0.5rem' }}>
          {BLOCK_TYPES.map(bt => (
            <button key={bt.id} onClick={() => selectType(bt.id)} style={{
              padding: '0.75rem', borderRadius: '8px', border: '1px solid',
              borderColor: data.type === bt.id ? '#00ff41' : '#333',
              background: data.type === bt.id ? 'rgba(0,255,65,0.08)' : '#111',
              color: data.type === bt.id ? '#00ff41' : '#888',
              fontWeight: '800', fontSize: '0.75rem', cursor: 'pointer',
              display: 'flex', alignItems: 'center', gap: '0.5rem'
            }}>
              <span style={{ fontSize: '1rem' }}>{bt.icon}</span> {bt.label}
            </button>
          ))}
        </div>
      </div>

      <div style={{ height: '1px', background: '#222' }} />

      {/* Alignment */}
      <div>
        {lbl('ВЫРАВНИВАНИЕ')}
        <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem' }}>
          {(['left','center','right'] as const).map(a => (
            <button key={a} onClick={() => update('align', a)} style={{
              flex: 1, padding: '0.6rem', borderRadius: '6px', border: '1px solid',
              borderColor: data.align === a ? '#00ff41' : '#333',
              background: data.align === a ? 'rgba(0,255,65,0.08)' : '#111',
              color: data.align === a ? '#00ff41' : '#666',
              fontSize: '0.75rem', fontWeight: '800', cursor: 'pointer'
            }}>{a === 'left' ? '⬅ Лево' : a === 'center' ? '⬛ Центр' : 'Право ➡'}</button>
          ))}
        </div>
      </div>

      {/* Fields per type */}
      {(data.type === 'heading' || data.type === 'cta_banner' || data.type === 'image_text') && field('НАДПИСЬ НАД ЗАГОЛОВКОМ', 'subheading', 'НАШИ УСЛУГИ')}
      {(data.type !== 'text' && data.type !== 'divider' && data.type !== 'button') && field('ЗАГОЛОВОК', 'heading', 'Заголовок блока')}
      {(data.type !== 'divider' && data.type !== 'button') && field('ОПИСАНИЕ / ТЕКСТ', 'body', 'Введите текст...', true)}
      {data.type === 'two_col' && field('ЛЕВАЯ КОЛОНКА', 'col1', 'Текст слева...', true)}
      {data.type === 'two_col' && field('ПРАВАЯ КОЛОНКА', 'col2', 'Текст справа...', true)}
      {(data.type === 'card' || data.type === 'image_text') && field('URL ИЗОБРАЖЕНИЯ', 'src', 'https:// или /image.png')}
      {(data.type === 'button' || data.type === 'card' || data.type === 'cta_banner' || data.type === 'image_text') && field('ТЕКСТ КНОПКИ / ССЫЛКИ', 'label', 'Узнать больше')}
      {(data.type === 'button' || data.type === 'card' || data.type === 'cta_banner' || data.type === 'image_text') && field('URL ССЫЛКИ', 'href', '/catalog')}

      {/* Accent / bg */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
        <div style={{ display: 'grid', gap: '0.4rem' }}>
          {lbl('ЦВЕТ АКЦЕНТА')}
          <input type="color" value={data.accent || '#008f24'} onChange={e => update('accent', e.target.value)}
            style={{ ...inp(), padding: '0.3rem', height: '42px', cursor: 'pointer' }} />
        </div>
        <div style={{ display: 'grid', gap: '0.4rem' }}>
          {lbl('ЦВЕТ ФОНА (CSS)')}
          <input value={data.bg || ''} onChange={e => update('bg', e.target.value)} placeholder="transparent"
            style={inp()} />
        </div>
      </div>
    </div>
  );
}

// ─── Style Editor (existing blocks) ─────────────────────────────────────────
function StyleEditor({ editingKey, currentLayout, updateLayout, onClose }: any) {
  const setStyle = (key: string, val: string) => {
    updateLayout({
      ...currentLayout,
      styles: {
        ...(currentLayout.styles || {}),
        [editingKey]: { ...(currentLayout.styles?.[editingKey] || {}), [key]: val }
      }
    });
  };

  const s = currentLayout.styles?.[editingKey] || {};
  const inp: React.CSSProperties = { background: '#111', border: '1px solid #333', padding: '1rem', color: '#fff', fontSize: '0.9rem', borderRadius: '8px', outline: 'none', width: '100%', boxSizing: 'border-box' };
  const lbl = (t: string) => <label style={{ fontSize: '0.7rem', color: '#888', fontWeight: '900' }}>{t}</label>;

  if (editingKey.startsWith('gallery_')) {
    const item = currentLayout.items?.[editingKey] || {};
    const updateItem = (fieldKey: string, val: any) => {
      updateLayout({
        ...currentLayout,
        items: {
          ...(currentLayout.items || {}),
          [editingKey]: {
            ...item,
            [fieldKey]: val
          }
        }
      });
    };

    const updateItemLang = (langCode: string, fieldKey: string, val: string) => {
      updateLayout({
        ...currentLayout,
        items: {
          ...(currentLayout.items || {}),
          [editingKey]: {
            ...item,
            [langCode]: {
              ...(item[langCode] || {}),
              [fieldKey]: val
            }
          }
        }
      });
    };

    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        <h4 style={{ fontSize: '0.85rem', color: '#00ff41', fontWeight: '900', letterSpacing: '0.15em' }}>РЕДАКТИРОВАНИЕ МЕДИА ЭЛЕМЕНТА</h4>
        
        <div style={{ display: 'grid', gap: '0.5rem' }}>
          {lbl('ТИП МЕДИАФАЙЛА')}
          <select 
            value={item.type || 'image'} 
            onChange={e => updateItem('type', e.target.value)} 
            style={{ ...inp, appearance: 'none' as any }}
          >
            <option value="image">Изображение (Image)</option>
            <option value="video">Видео (Video)</option>
          </select>
        </div>

        <div style={{ display: 'grid', gap: '0.5rem' }}>
          {lbl(item.type === 'video' ? 'URL ВИДЕОФАЙЛА (Direct MP4 или YouTube)' : 'URL ИЗОБРАЖЕНИЯ')}
          <input 
            value={item.src || ''} 
            onChange={e => updateItem('src', e.target.value)} 
            placeholder={item.type === 'video' ? 'https://www.youtube.com/watch?v=... или /video.mp4' : '/image.jpg'} 
            style={inp} 
          />
        </div>

        <div style={{ display: 'grid', gap: '0.5rem' }}>
          {lbl('КАТЕГОРИЯ')}
          <select 
            value={item.category || 'production'} 
            onChange={e => updateItem('category', e.target.value)} 
            style={{ ...inp, appearance: 'none' as any }}
          >
            <option value="production">Производство</option>
            <option value="services">Сервис</option>
            <option value="equipment">Оборудование</option>
            <option value="materials">Материалы</option>
          </select>
        </div>

        <div style={{ height: '1px', background: '#222', margin: '0.5rem 0' }} />

        {/* Translation Fields */}
        <div style={{ display: 'grid', gap: '0.75rem' }}>
          <div style={{ color: '#aaa', fontSize: '0.7rem', fontWeight: 'bold' }}>НАЗВАНИЕ (RU)</div>
          <input value={item.ru?.title || ''} onChange={e => updateItemLang('ru', 'title', e.target.value)} placeholder="Название на русском" style={inp} />
          
          <div style={{ color: '#aaa', fontSize: '0.7rem', fontWeight: 'bold' }}>НАЗВАНИЕ (KK)</div>
          <input value={item.kk?.title || ''} onChange={e => updateItemLang('kk', 'title', e.target.value)} placeholder="Атауы қазақша" style={inp} />
          
          <div style={{ color: '#aaa', fontSize: '0.7rem', fontWeight: 'bold' }}>НАЗВАНИЕ (EN)</div>
          <input value={item.en?.title || ''} onChange={e => updateItemLang('en', 'title', e.target.value)} placeholder="Title in English" style={inp} />
        </div>

        <div style={{ display: 'grid', gap: '0.75rem', marginTop: '0.5rem' }}>
          <div style={{ color: '#aaa', fontSize: '0.7rem', fontWeight: 'bold' }}>ОПИСАНИЕ (RU)</div>
          <textarea value={item.ru?.desc || ''} onChange={e => updateItemLang('ru', 'desc', e.target.value)} placeholder="Описание на русском" style={{ ...inp, minHeight: '60px', resize: 'vertical' }} />
          
          <div style={{ color: '#aaa', fontSize: '0.7rem', fontWeight: 'bold' }}>ОПИСАНИЕ (KK)</div>
          <textarea value={item.kk?.desc || ''} onChange={e => updateItemLang('kk', 'desc', e.target.value)} placeholder="Сипаттамасы қазақша" style={{ ...inp, minHeight: '60px', resize: 'vertical' }} />
          
          <div style={{ color: '#aaa', fontSize: '0.7rem', fontWeight: 'bold' }}>ОПИСАНИЕ (EN)</div>
          <textarea value={item.en?.desc || ''} onChange={e => updateItemLang('en', 'desc', e.target.value)} placeholder="Description in English" style={{ ...inp, minHeight: '60px', resize: 'vertical' }} />
        </div>

        <button 
          onClick={() => {
             const newOrder = (currentLayout.order || []).filter((x: string) => x !== editingKey);
             const newItems = { ...(currentLayout.items || {}) };
             delete newItems[editingKey];
             updateLayout({ ...currentLayout, order: newOrder, items: newItems });
             if (onClose) onClose();
          }}
          style={{ 
            marginTop: '1.5rem', 
            padding: '1rem', 
            background: 'rgba(255, 75, 75, 0.1)', 
            border: '1px solid rgba(255, 75, 75, 0.2)', 
            color: '#ff4b4b', 
            borderRadius: '8px', 
            fontWeight: '800', 
            cursor: 'pointer' 
          }}
        >
          УДАЛИТЬ ИЗ ГАЛЕРЕИ
        </button>
      </div>
    );
  }

  const row = (label: string, key: string, ph = '') => (
    <div style={{ display: 'grid', gap: '0.5rem' }}>
      {lbl(label)}
      <input value={s[key] || ''} onChange={e => setStyle(key, e.target.value)} placeholder={ph} style={inp} />
    </div>
  );

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {row('ВЕРТИКАЛЬНЫЕ ОТСТУПЫ', 'padding', '6rem 0')}
      {row('ФОНОВЫЙ ЦВЕТ / CSS', 'background', 'rgba(0,0,0,0)')}
      {row('СКРУГЛЕНИЕ УГЛОВ', 'borderRadius', '16px')}
      {row('ПРОЗРАЧНОСТЬ (0-1)', 'opacity', '1')}
      {row('МАСШТАБ', 'transform', 'scale(1)')}
      {row('РАЗМЕР ШРИФТА', 'fontSize', '1rem')}

      <div style={{ paddingTop: '1.5rem', borderTop: '1px solid #222', display: 'grid', gap: '0.5rem' }}>
        {lbl('URL ИЗОБРАЖЕНИЯ ФОНА')}
        <input
          value={currentLayout.images?.[`${editingKey}_img`] || ''}
          onChange={e => updateLayout({ ...currentLayout, images: { ...(currentLayout.images || {}), [`${editingKey}_img`]: e.target.value } })}
          placeholder="/image.png"
          style={inp}
        />
      </div>

      {(editingKey.startsWith('srv_') || editingKey.startsWith('cat_')) && (
        <div style={{ paddingTop: '1.5rem', borderTop: '1px solid #222', display: 'grid', gap: '1rem' }}>
          {lbl('ШИРИНА (GRID SPAN)')}
          <select value={s.gridColumn || 'span 1'} onChange={e => setStyle('gridColumn', e.target.value)} style={{ ...inp, appearance: 'none' as any }}>
            <option value="span 1">Стандарт (1 кол.)</option>
            <option value="span 2">Широкий (2 кол.)</option>
            <option value="span 3">Полная ширина</option>
          </select>
          {lbl('ВЫСОТА (GRID ROW)')}
          <select value={s.gridRow || 'span 1'} onChange={e => setStyle('gridRow', e.target.value)} style={{ ...inp, appearance: 'none' as any }}>
            <option value="span 1">Стандартная</option>
            <option value="span 2">Высокая (2 ряда)</option>
          </select>
        </div>
      )}

      {editingKey.startsWith('btn_') && (
        <div style={{ paddingTop: '1.5rem', borderTop: '1px solid #222', display: 'grid', gap: '0.5rem' }}>
          {lbl('URL ССЫЛКИ')}
          <input
            value={currentLayout.links?.[editingKey] || ''}
            onChange={e => updateLayout({ ...currentLayout, links: { ...(currentLayout.links || {}), [editingKey]: e.target.value } })}
            placeholder="/catalog"
            style={inp}
          />
        </div>
      )}
    </div>
  );
}

