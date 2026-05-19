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
  Trash
} from 'lucide-react';
import { useLang } from '../LangContext';
import { useTheme } from '../ThemeContext';
import { translations as defaultTranslations, productsData as defaultProducts, categories as defaultCategories } from '../i18n';

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
    const keys = ['home', 'catalog', 'services', 'about', 'contacts', 'partner'];
    const layouts: any = {};
    keys.forEach(k => {
      const saved = localStorage.getItem(`demetra_${k}_layout`);
      const defaults: any = {
        home: { order: ['hero', 'marquee', 'catalog', 'partnership', 'services', 'cta'], hidden: [], styles: {}, images: {} },
        catalog: { order: [], hidden: [], styles: {}, images: {} },
        services: { order: [], hidden: [], styles: {}, images: {} },
        about: { order: [], hidden: [], styles: {}, images: {} },
        contacts: { order: [], hidden: [], styles: {}, images: {} },
        partner: { order: [], hidden: [], styles: {}, images: {} }
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
            links: parsed.links || defaults[k].links || {}
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
      const keys = ['home', 'catalog', 'services', 'about', 'contacts', 'partner'];
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

      <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} style={{ position: 'fixed', top: '1.25rem', left: '1.25rem', zIndex: 3000, background: '#111', border: '1px solid #333', color: '#00ff41', padding: '0.75rem', borderRadius: '12px', cursor: 'pointer' }}>
        {isSidebarOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Sidebar */}
      <motion.div animate={{ width: sidebarWidth }} style={{ background: '#0a0a0a', borderRight: '1px solid #222', padding: isSidebarOpen ? '2rem 1.5rem' : '0', display: 'flex', flexDirection: 'column', gap: '2rem', position: 'fixed', height: '100vh', zIndex: 2500, boxShadow: '10px 0 50px rgba(0,0,0,0.5)', overflow: 'hidden' }}>
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
              <TildaEditor pageLayouts={pageLayouts} setPageLayouts={setPageLayouts} allTranslations={allTranslations} updateTranslation={updateTranslation} currentLang={effectiveLang} handleSave={handleSave} />
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
function TildaEditor({ pageLayouts, setPageLayouts, allTranslations, updateTranslation, currentLang, handleSave }: any) {
  const [editingKey, setEditingKey] = useState<string | null>(null);
  const [previewRoute, setPreviewRoute] = useState<string>('/');
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

  useEffect(() => {
    const handleMessage = (e: MessageEvent) => {
      if (e.data?.type === 'DEMETRA_BUILDER') {
        const { action, id, index, key, value, arrayKey } = e.data;
        if (action === 'EDIT_BLOCK') setEditingKey(id);
        if (action === 'MOVE_UP') moveSection(arrayKey, index, 'up');
        if (action === 'MOVE_DOWN') moveSection(arrayKey, index, 'down');
        if (action === 'REMOVE_BLOCK') removeSection(id);
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
  }, [currentLayout, currentLang, updateTranslation, previewRoute]);

  useEffect(() => {
    if (iframeRef.current?.contentWindow) {
      iframeRef.current.contentWindow.postMessage({ type: 'DEMETRA_UPDATE_LAYOUT', layout: currentLayout }, '*');
      iframeRef.current.contentWindow.postMessage({ type: 'DEMETRA_UPDATE_TRANSLATIONS', translations: allTranslations }, '*');
    }
  }, [currentLayout, allTranslations, previewRoute]);

  return (
    <div className="tilda-editor" style={{ position: 'relative', height: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* Top Floating Toolbar */}
      <div style={{ background: '#1a1a1a', borderBottom: '1px solid #333', padding: '1.25rem 2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', zIndex: 5000, flexShrink: 0 }}>
         <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
            <div style={{ background: '#00ff41', color: '#000', padding: '0.4rem 0.8rem', borderRadius: '4px', fontWeight: '900', fontSize: '0.7rem', letterSpacing: '0.05em' }}>VISUAL MODE</div>
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
            </select>
            <div style={{ color: '#888', fontSize: '0.85rem' }}>Switch pages to edit different areas.</div>
         </div>
         <button onClick={handleSave} style={{ background: '#00ff41', color: '#000', border: 'none', padding: '0.75rem 2rem', borderRadius: '8px', fontWeight: '900', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem', boxShadow: '0 0 20px rgba(0, 255, 65, 0.2)' }}>
            <Save size={18} /> PUBLISH CHANGES
         </button>
      </div>

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

      {/* Editing Sidebar (Slide-over) */}
      <AnimatePresence>
        {editingKey && (
          <motion.div 
            initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }}
            style={{ position: 'fixed', top: 0, right: 0, width: '450px', height: '100vh', background: '#0a0a0a', borderLeft: '1px solid #333', zIndex: 6000, padding: '3rem', boxShadow: '-20px 0 50px rgba(0,0,0,0.5)' }}
          >
             <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '3rem' }}>
                <h3 style={{ fontSize: '0.7rem', color: '#00ff41', fontWeight: '900', letterSpacing: '0.2em' }}>BLOCK SETTINGS: {editingKey.toUpperCase()}</h3>
                <button onClick={() => setEditingKey(null)} style={{ background: 'none', border: 'none', color: '#888', cursor: 'pointer' }}><X size={24} /></button>
             </div>
             
             <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                <div style={{ display: 'grid', gap: '0.75rem' }}>
                   <label style={{ fontSize: '0.7rem', color: '#888', fontWeight: '900' }}>VERTICAL PADDING</label>
                   <input 
                      type="text" 
                      placeholder="e.g. 6rem 0, 100px 0, auto"
                      value={currentLayout.styles?.[editingKey]?.padding || ''}
                      onChange={(e) => {
                         const v = e.target.value;
                         updateLayout({ ...currentLayout, styles: { ...(currentLayout.styles || {}), [editingKey]: { ...(currentLayout.styles?.[editingKey] || {}), padding: v } } });
                      }}
                      style={{ background: '#111', border: '1px solid #333', padding: '1rem', color: '#fff', fontSize: '0.9rem', borderRadius: '8px', outline: 'none' }}
                   />
                </div>
                
                <div style={{ display: 'grid', gap: '0.75rem' }}>
                   <label style={{ fontSize: '0.7rem', color: '#888', fontWeight: '900' }}>TRANSFORM SCALE (0.1 - 2.0)</label>
                   <input 
                      type="number" 
                      step="0.1"
                      placeholder="1"
                      value={currentLayout.styles?.[editingKey]?.transform ? currentLayout.styles[editingKey].transform.replace('scale(', '').replace(')', '') : '1'}
                      onChange={(e) => {
                         const v = `scale(${e.target.value})`;
                         updateLayout({ ...currentLayout, styles: { ...(currentLayout.styles || {}), [editingKey]: { ...(currentLayout.styles?.[editingKey] || {}), transform: v } } });
                      }}
                      style={{ background: '#111', border: '1px solid #333', padding: '1rem', color: '#fff', fontSize: '0.9rem', borderRadius: '8px', outline: 'none' }}
                   />
                </div>

                <div style={{ display: 'grid', gap: '0.75rem' }}>
                   <label style={{ fontSize: '0.7rem', color: '#888', fontWeight: '900' }}>FONT SIZE SCALING</label>
                   <input 
                      type="text" 
                      placeholder="e.g. 1.2rem, 150%, 20px"
                      value={currentLayout.styles?.[editingKey]?.fontSize || ''}
                      onChange={(e) => {
                         const v = e.target.value;
                         updateLayout({ ...currentLayout, styles: { ...(currentLayout.styles || {}), [editingKey]: { ...(currentLayout.styles?.[editingKey] || {}), fontSize: v } } });
                      }}
                      style={{ background: '#111', border: '1px solid #333', padding: '1rem', color: '#fff', fontSize: '0.9rem', borderRadius: '8px', outline: 'none' }}
                   />
                </div>

                <div style={{ display: 'grid', gap: '0.75rem' }}>
                   <label style={{ fontSize: '0.7rem', color: '#888', fontWeight: '900' }}>BORDER RADIUS</label>
                   <input 
                      type="text" 
                      placeholder="e.g. 16px, 50%"
                      value={currentLayout.styles?.[editingKey]?.borderRadius || ''}
                      onChange={(e) => {
                         const v = e.target.value;
                         updateLayout({ ...currentLayout, styles: { ...(currentLayout.styles || {}), [editingKey]: { ...(currentLayout.styles?.[editingKey] || {}), borderRadius: v } } });
                      }}
                      style={{ background: '#111', border: '1px solid #333', padding: '1rem', color: '#fff', fontSize: '0.9rem', borderRadius: '8px', outline: 'none' }}
                   />
                </div>

                <div style={{ display: 'grid', gap: '0.75rem' }}>
                   <label style={{ fontSize: '0.7rem', color: '#888', fontWeight: '900' }}>OPACITY (0.0 - 1.0)</label>
                   <input 
                      type="number" 
                      step="0.1"
                      min="0"
                      max="1"
                      placeholder="1"
                      value={currentLayout.styles?.[editingKey]?.opacity || ''}
                      onChange={(e) => {
                         const v = e.target.value;
                         updateLayout({ ...currentLayout, styles: { ...(currentLayout.styles || {}), [editingKey]: { ...(currentLayout.styles?.[editingKey] || {}), opacity: v } } });
                      }}
                      style={{ background: '#111', border: '1px solid #333', padding: '1rem', color: '#fff', fontSize: '0.9rem', borderRadius: '8px', outline: 'none' }}
                   />
                </div>

                <div style={{ display: 'grid', gap: '0.75rem' }}>
                   <label style={{ fontSize: '0.7rem', color: '#888', fontWeight: '900' }}>BACKGROUND COLOR / CSS</label>
                   <input 
                      type="text" 
                      placeholder="e.g. #ff0000, rgba(0,0,0,0.5), transparent"
                      value={currentLayout.styles?.[editingKey]?.background || ''}
                      onChange={(e) => {
                         const v = e.target.value;
                         updateLayout({ ...currentLayout, styles: { ...(currentLayout.styles || {}), [editingKey]: { ...(currentLayout.styles?.[editingKey] || {}), background: v } } });
                      }}
                      style={{ background: '#111', border: '1px solid #333', padding: '1rem', color: '#fff', fontSize: '0.9rem', borderRadius: '8px', outline: 'none' }}
                   />
                </div>

                <div style={{ display: 'grid', gap: '0.75rem', marginTop: '1rem', paddingTop: '2rem', borderTop: '1px solid #222' }}>
                   <label style={{ fontSize: '0.7rem', color: '#00ff41', fontWeight: '900' }}>BACKGROUND / FOREGROUND IMAGE URL</label>
                   <input 
                      type="text" 
                      placeholder="/corporate_about.png"
                      value={currentLayout.images?.[`${editingKey}_img`] || ''}
                      onChange={(e) => {
                         const v = e.target.value;
                         updateLayout({ ...currentLayout, images: { ...(currentLayout.images || {}), [`${editingKey}_img`]: v } });
                      }}
                      style={{ background: '#111', border: '1px solid #333', padding: '1rem', color: '#fff', fontSize: '0.9rem', borderRadius: '8px', outline: 'none' }}
                   />
                </div>
                
                {/* Advanced Sizing for Sub-Blocks */}
                {(editingKey.startsWith('srv_') || editingKey.startsWith('cat_')) && (
                   <div style={{ display: 'grid', gap: '0.75rem', marginTop: '1rem', paddingTop: '2rem', borderTop: '1px solid #222' }}>
                      <label style={{ fontSize: '0.7rem', color: '#00ff41', fontWeight: '900' }}>GRID SIZE (WIDTH)</label>
                      <select 
                         value={currentLayout.styles?.[editingKey]?.gridColumn || 'span 1'}
                         onChange={(e) => {
                            const v = e.target.value;
                            updateLayout({ ...currentLayout, styles: { ...(currentLayout.styles || {}), [editingKey]: { ...(currentLayout.styles?.[editingKey] || {}), gridColumn: v } } });
                         }}
                         style={{ background: '#111', border: '1px solid #333', padding: '1rem', color: '#fff', fontSize: '0.9rem', borderRadius: '8px', outline: 'none', appearance: 'none' }}
                      >
                         <option value="span 1">Standard (1 Column)</option>
                         <option value="span 2">Wide (2 Columns)</option>
                         <option value="span 3">Full Width (3 Columns)</option>
                      </select>
                      
                      <label style={{ fontSize: '0.7rem', color: '#00ff41', fontWeight: '900', marginTop: '1rem' }}>GRID ROW (HEIGHT)</label>
                      <select 
                         value={currentLayout.styles?.[editingKey]?.gridRow || 'span 1'}
                         onChange={(e) => {
                            const v = e.target.value;
                            updateLayout({ ...currentLayout, styles: { ...(currentLayout.styles || {}), [editingKey]: { ...(currentLayout.styles?.[editingKey] || {}), gridRow: v } } });
                         }}
                         style={{ background: '#111', border: '1px solid #333', padding: '1rem', color: '#fff', fontSize: '0.9rem', borderRadius: '8px', outline: 'none', appearance: 'none' }}
                      >
                         <option value="span 1">Standard Height</option>
                         <option value="span 2">Tall (2 Rows)</option>
                      </select>
                   </div>
                )}

                {/* Button Links */}
                {editingKey.startsWith('btn_') && (
                   <div style={{ display: 'grid', gap: '0.75rem', marginTop: '1rem', paddingTop: '2rem', borderTop: '1px solid #222' }}>
                      <label style={{ fontSize: '0.7rem', color: '#00ff41', fontWeight: '900' }}>LINK URL / PATH</label>
                      <input 
                         type="text" 
                         placeholder="/catalog"
                         value={currentLayout.links?.[editingKey] || ''}
                         onChange={(e) => {
                            const v = e.target.value;
                            updateLayout({ ...currentLayout, links: { ...(currentLayout.links || {}), [editingKey]: v } });
                         }}
                         style={{ background: '#111', border: '1px solid #333', padding: '1rem', color: '#fff', fontSize: '0.9rem', borderRadius: '8px', outline: 'none' }}
                      />
                   </div>
                )}
             </div>

             <button onClick={() => setEditingKey(null)} style={{ width: '100%', marginTop: '3rem', padding: '1.25rem', background: '#00ff41', color: '#000', border: 'none', borderRadius: '12px', fontWeight: '900', cursor: 'pointer' }}>
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
