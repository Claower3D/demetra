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
  Grid,
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
import { setCustomBlock, getCustomBlocks, getPagesList } from '../components/CustomBlock';
import type { PageItem } from '../components/CustomBlock';

const findParentBlockOfNested = (nestedId: string) => {
  try {
    const customBlocks = JSON.parse(localStorage.getItem('demetra_custom_blocks') || '{}');
    for (const parentId in customBlocks) {
      const parent = customBlocks[parentId];
      if (parent.childrenBlocks && parent.childrenBlocks.some((c: any) => c.id === nestedId)) {
        return parentId;
      }
    }
  } catch {}
  return null;
};

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

  const [pages, setPages] = useState<PageItem[]>(() => getPagesList());

  const [pageLayouts, setPageLayouts] = useState<any>(() => {
    const pageList = getPagesList();
    const layouts: any = {};
    pageList.forEach(p => {
      const k = p.id;
      const saved = localStorage.getItem(`demetra_${k}_layout`);
      const defaults: any = {
        home: { order: ['hero', 'marquee', 'catalog', 'partnership', 'services', 'cta'], hidden: [], styles: {}, images: {} },
        catalog: { order: ['catalog_main'], hidden: [], styles: {}, images: {} },
        services: { order: ['services_main'], hidden: [], styles: {}, images: {} },
        about: { order: ['about_main'], hidden: [], styles: {}, images: {} },
        contacts: { order: ['contacts_main'], hidden: [], styles: {}, images: {} },
        partner: { order: ['partner_main'], hidden: [], styles: {}, images: {} },
        gallery: {
          order: ['gallery_main'],
          order_gallery: ['gallery_1', 'gallery_2', 'gallery_3', 'gallery_4', 'gallery_5', 'gallery_6'],
          hidden: [],
          styles: {},
          images: {},
          items: {
            gallery_1: { id: "gallery_1", src: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&q=80&w=1200", type: 'image', category: 'production', ru: { title: "Конвейерная линия Т-1500", desc: "Установка и пусконаладка новой автоматизированной конвейерной линии с HDPE роликами." }, kk: { title: "Т-1500 конвейерлік желісі", desc: "HDPE роликтері бар жаңа автоматтандырылған конвейер желісін орнату и іске қосу." }, en: { title: "T-1500 Conveyor Line", desc: "Installation and commissioning of a new automated conveyor line with HDPE rollers." } },
            gallery_2: { id: "gallery_2", src: "https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122?auto=format&fit=crop&q=80&w=1200", type: 'image', category: 'services', ru: { title: "Ремонт конвейерной ленты", desc: "Срочная стыковка конвейерной ленты методом горячей вулканизации на глубине." }, kk: { title: "Конвейер таспасын жөндеу", desc: "Тереңдікте ыстық вулканизация әдісімен конвейер таспасын шұғыл біріктіру." }, en: { title: "Conveyor Belt Repair", desc: "Urgent splicing of a conveyor belt using hot vulcanization method at depth." } },
            gallery_3: { id: "gallery_3", src: "https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&q=80&w=1200", type: 'image', category: 'equipment', ru: { title: "Футеровка приводного барабана", desc: "Применение резинокерамической футеровки германского производства для предотвращения проскальзывания ленты." }, kk: { title: "Жетекші барабанды футерлеу", desc: "Таспаның сырғып кетуін болдырмау үшін германдық резеңке-керамикалық футерлеуді қолдану." }, en: { title: "Drive Drum Lagging", desc: "Application of German-made rubber-ceramic lagging to prevent belt slippage." } },
            gallery_4: { id: "gallery_4", src: "https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&q=80&w=1200", type: 'image', category: 'production', ru: { title: "Контроль качества роликов", desc: "Лабораторные испытания биения конвейерных роликов на специализированном стенде перед отгрузкой клиенту." }, kk: { title: "Роликтердің сапасын бақылау", desc: "Тапсырыс берушіге жөнелту алдында мамандандырылған стендте конвейер роликтерінің соғуын зертханалық сынау." }, en: { title: "Roller Quality Control", desc: "Laboratory testing of conveyor roller runout on a specialized stand before shipping to the client." } },
            gallery_5: { id: "gallery_5", src: "https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&q=80&w=1200", type: 'image', category: 'materials', ru: { title: "Демпферная станция амортизации", desc: "Успешный монтаж амортизирующей станции в точке загрузки крупнокусковой руды." }, kk: { title: "Амортизациялық демпферлік станция", desc: "Ірі кесекті кенді тиеу нүктесінде амортизациялық станцияны сәтті монтаждау." }, en: { title: "Shock Absorbing Damper Station", desc: "Successful installation of a damping station at the large-fraction ore loading point." } },
            gallery_6: { id: "gallery_6", src: "https://images.unsplash.com/photo-1416339306562-f3d12fefd36f?auto=format&fit=crop&q=80&w=1200", type: 'image', category: 'services', ru: { title: "Антикоррозийная защита", desc: "Нанесение полимерных защитных составов на стальные конструкции металлургического цеха." }, kk: { title: "Коррозияға қарсы қорғаныс", desc: "Металлургиялық цехтың болат конструкцияларына полимерлі қорғаныс құрамдарын жағу." }, en: { title: "Anti-Corrosion Protection", desc: "Application of polymer protective coatings to the steel structures of the metallurgical workshop." } }
          }
        }
      };
      
      const defaultLayout = defaults[k] || { order: [], hidden: [], styles: {}, images: {}, items: {} };
      try {
        if (saved) {
          const parsed = JSON.parse(saved);
          layouts[k] = {
            ...defaultLayout,
            ...parsed,
            styles: { ...(defaultLayout.styles || {}), ...(parsed.styles || {}) },
            images: { ...(defaultLayout.images || {}), ...(parsed.images || {}) },
            links: { ...(defaultLayout.links || {}), ...(parsed.links || {}) },
            items: { ...(defaultLayout.items || {}), ...(parsed.items || {}) }
          };
        } else {
          layouts[k] = defaultLayout;
        }
      } catch (e) {
        layouts[k] = defaultLayout;
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
    { id: 'pages', icon: <Compass size={20} />, label: 'Управление страницами' },
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
              <TildaEditor pages={pages} pageLayouts={pageLayouts} setPageLayouts={setPageLayouts} allTranslations={allTranslations} updateTranslation={updateTranslation} currentLang={effectiveLang} handleSave={handleSave} isSidebarOpen={isSidebarOpen} />
            ) : (
              <div style={{ padding: '4rem' }}>
                {activeTab === 'pages' && <PagesManager pages={pages} setPages={setPages} pageLayouts={pageLayouts} setPageLayouts={setPageLayouts} t={t} lang={effectiveLang} />}
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
function TildaEditor({ pages, pageLayouts, setPageLayouts, allTranslations, updateTranslation, currentLang, handleSave, isSidebarOpen }: any) {
  const [editingKey, setEditingKey] = useState<string | null>(null);
  const [isSettingsOpen, setIsSettingsOpen] = useState<boolean>(false);
  const [previewRoute, setPreviewRoute] = useState<string>('/');
  const [isLibraryOpen, setIsLibraryOpen] = useState<boolean>(true);
  const [showDesignerGrid, setShowDesignerGrid] = useState<boolean>(() => {
    return localStorage.getItem('demetra_show_designer_grid') === 'true';
  });
  const [libSearch, setLibSearch] = useState<string>('');
  const [hoveredBlockId, setHoveredBlockId] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [modalActiveTab, setModalActiveTab] = useState<'content' | 'media' | 'scaling'>('content');
  const [addingNestedForBlockId, setAddingNestedForBlockId] = useState<string | null>(null);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  // Refs so message handlers always read fresh values (avoid stale closures)
  const pageLayoutsRef = useRef<any>({});
  const layoutKeyRef   = useRef<string>('home');

  const getBlockHelp = (id: string) => {
    const helpData: Record<string, { title: string; desc: string; steps: string[] }> = {
      hero: {
        title: 'Hero (Обложка)',
        desc: 'Главный баннер с полноэкранным слайдером картинок, крупными заголовками и кнопками перехода.',
        steps: [
          'Нажмите «Добавить» или перетащите блок на странице.',
          'Кликните на текст прямо в окне предпросмотра, чтобы изменить его.',
          'Нажмите шестеренку на блоке, чтобы заменить изображения слайдов, настроить отступы или цвет наложения.'
        ]
      },
      marquee: {
        title: 'Marquee (Инфо-строка)',
        desc: 'Динамическая бегущая строка с ключевыми показателями и преимуществами вашей компании.',
        steps: [
          'Используется для демонстрации преимуществ, слоганов или брендов.',
          'В панели настроек (StyleEditor) можно изменить фоновый цвет и скорость анимации.',
          'Текст локализуется на трех языках.'
        ]
      },
      catalog: {
        title: 'Catalog (Сетка каталога)',
        desc: 'Интерактивная bento-сетка продукции с кнопками быстрого просмотра и фильтрацией по категориям.',
        steps: [
          'Выводит список товаров из базы данных.',
          'Позволяет покупателям мгновенно искать и фильтровать оборудование.',
          'Для изменения товаров перейдите во вкладку «Продукты» в левом меню админки.'
        ]
      },
      partnership: {
        title: 'Partnership (Партнеры)',
        desc: 'Сетка логотипов ключевых партнеров и дистрибьюторов компании.',
        steps: [
          'Повышает доверие к вашему бренду.',
          'Нажмите на настройки блока для изменения логотипов или добавления новых ссылок.'
        ]
      },
      services: {
        title: 'Services (Сетка услуг)',
        desc: 'Сетка интерактивных карточек предоставляемых услуг с иконками.',
        steps: [
          'Подходит для детального описания направлений деятельности.',
          'Вы можете перетаскивать карточки услуг, меняя их порядок.',
          'Тексты и иконки настраиваются через контекстное меню блока.'
        ]
      },
      cta: {
        title: 'CTA (Обратная связь)',
        desc: 'Финальный блок с призывом к действию, кнопкой контактов и быстрым переходом.',
        steps: [
          'Увеличивает конверсию заявок.',
          'Вы можете привязать кнопки к форме обратной связи или Telegram.',
          'Настройте фоновые градиенты в панели стилей.'
        ]
      },
      heading: {
        title: 'Кастомный заголовок',
        desc: 'Информационный блок с надзаголовком, крупным шрифтом и кратким описанием.',
        steps: [
          'Кликните на заголовок для открытия параметров.',
          'Выберите выравнивание (слева, центр, справа) и цвет акцента.',
          'Переведите тексты во вкладках RU, KK, EN.'
        ]
      },
      text: {
        title: 'Текст',
        desc: 'Простой текстовый блок для размещения статей, описаний или списков.',
        steps: [
          'Поддерживает абзацы и переносы строк.',
          'Вы можете настроить цвет текста и фона.',
          'Идеален для размещения юридической информации или инструкций.'
        ]
      },
      button: {
        title: 'Акцентная кнопка',
        desc: 'Кнопка действия с ярким неоновым свечением при наведении.',
        steps: [
          'Введите текст кнопки в поле «Надпись».',
          'В поле «Ссылка» укажите адрес перехода (например, /contacts).',
          'Выберите цвет свечения.'
        ]
      },
      card: {
        title: 'Bento Карточка',
        desc: 'Информационный блок с превью-картинкой, описанием и кнопкой подробностей.',
        steps: [
          'Укажите ссылку на изображение.',
          'Заполните заголовок и текст карточки.',
          'Кнопка может вести на любую страницу сайта.'
        ]
      },
      two_col: {
        title: '2 Колонки',
        desc: 'Текстовый блок, разделенный на две независимые колонки.',
        steps: [
          'Удобно для сравнения характеристик или преимуществ.',
          'Заполняйте левую и правую колонки в панели настроек.'
        ]
      },
      image_text: {
        title: 'Фото + Текст',
        desc: 'Сбалансированный блок, содержащий изображение с одной стороны и описание с кнопкой с другой.',
        steps: [
          'Укажите ссылку на фото.',
          'Настройте заголовок, описание и ссылку.',
          'Автоматически адаптируется под мобильные устройства.'
        ]
      },
      cta_banner: {
        title: 'Промо-баннер',
        desc: 'Акцентный блок во всю ширину с градиентной заливкой и встроенной кнопкой.',
        steps: [
          'Используйте для горячих акций или лид-магнитов.',
          'Задайте фоновый градиент (цвет) для привлечения внимания.',
          'Настройте ссылку на форму заказа.'
        ]
      },
      divider: {
        title: 'Разделитель',
        desc: 'Тонкая декоративная градиентная линия для визуального разделения контента.',
        steps: [
          'Создает пространство и улучшает восприятие страницы.',
          'В настройках можно переопределить цвет линии.'
        ]
      },
      gallery_add: {
        title: 'Медиа-файл в Галерею',
        desc: 'Добавление нового фото или видео в Bento-сетку галереи.',
        steps: [
          'Выберите тип медиа (Изображение или Видео).',
          'Укажите ссылку на файл или YouTube видео.',
          'Задайте категорию фильтрации и подписи на трех языках.'
        ]
      }
    };
    return helpData[id] || {
      title: 'Элемент',
      desc: 'Позволяет гибко кастомизировать структуру страницы.',
      steps: [
        'Нажмите для добавления.',
        'Редактируйте параметры в панели настроек.'
      ]
    };
  };


  // Map route to layout key
  const routeToKey = (route: string) => {
    if (route === '/') return 'home';
    return route.replace('/', '');
  };

  const layoutKey = routeToKey(previewRoute);
  const currentLayout = pageLayouts[layoutKey];

  // Keep refs in sync on every render so message handlers never capture stale values
  pageLayoutsRef.current = pageLayouts;
  layoutKeyRef.current   = layoutKey;

  const updateLayout = (newLayout: any, overrideKey?: string) => {
    const lk = overrideKey ?? layoutKeyRef.current;
    setPageLayouts((prev: any) => {
      const updated = { ...prev, [lk]: newLayout };
      localStorage.setItem(`demetra_${lk}_layout`, JSON.stringify(newLayout));
      window.dispatchEvent(new Event('storage'));
      // Immediately push updated layout to iframe so it re-renders with new order
      if (iframeRef.current?.contentWindow) {
        iframeRef.current.contentWindow.postMessage({ type: 'DEMETRA_UPDATE_LAYOUT', layout: newLayout }, '*');
      }
      return updated;
    });
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
      cta_banner: { type: 'cta_banner', heading: 'Готовы начать проект?', subheading: 'Свяжитесь с нами', body: 'Наши специалисты ответят на все вопросы.', label: 'Оставить заявку', href: '/contacts' },
      container: { type: 'container', childrenBlocks: [] }
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

  const handleSelectNestedType = (type: string) => {
    if (!addingNestedForBlockId) return;
    try {
      const customBlocks = JSON.parse(localStorage.getItem('demetra_custom_blocks') || '{}');
      const parentBlock = customBlocks[addingNestedForBlockId] || { type: 'container' };
      
      const newNestedId = `nested_${Date.now()}`;
      const newNestedBlock = {
        id: newNestedId,
        type: type,
        heading: 'Новый элемент',
        body: 'Описание элемента',
        label: 'Кнопка',
        src: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=800&q=80',
        href: '#'
      };
      
      parentBlock.childrenBlocks = [...(parentBlock.childrenBlocks || []), newNestedBlock];
      customBlocks[addingNestedForBlockId] = parentBlock;
      
      localStorage.setItem('demetra_custom_blocks', JSON.stringify(customBlocks));
      window.dispatchEvent(new Event('storage'));
      
      setAddingNestedForBlockId(null);
      
      if (iframeRef.current) {
        iframeRef.current.contentWindow?.postMessage({
          type: 'DEMETRA_UPDATE_LAYOUT',
          layout: currentLayout
        }, '*');
      }
      
      setEditingKey(newNestedId);
      setIsModalOpen(true);
      setModalActiveTab('content');
    } catch (err) {
      console.error("Add nested error", err);
    }
  };

  useEffect(() => {
    const handleMessage = (e: MessageEvent) => {
      if (e.data?.type === 'DEMETRA_BUILDER') {
        const { action, id, index, key, value, arrayKey } = e.data;
        if (action === 'EDIT_BLOCK') {
          setEditingKey(id);
          setIsSettingsOpen(true);
        }
        if (action === 'OPEN_MODAL') {
          setEditingKey(id);
          setIsModalOpen(true);
          setModalActiveTab(e.data.tab || 'content');
        }
        if (action === 'ADD_NESTED') {
          setAddingNestedForBlockId(id);
        }
        if (action === 'DELETE_NESTED') {
          try {
            const customBlocks = JSON.parse(localStorage.getItem('demetra_custom_blocks') || '{}');
            const parentBlock = customBlocks[id] || {};
            parentBlock.childrenBlocks = (parentBlock.childrenBlocks || []).filter((c: any) => c.id !== e.data.nestedId);
            customBlocks[id] = parentBlock;
            localStorage.setItem('demetra_custom_blocks', JSON.stringify(customBlocks));
            window.dispatchEvent(new Event('storage'));
            if (iframeRef.current) {
              iframeRef.current.contentWindow?.postMessage({
                type: 'DEMETRA_UPDATE_LAYOUT',
                layout: currentLayout
              }, '*');
            }
          } catch (err) {
            console.error("Delete nested error", err);
          }
        }
        if (action === 'MOVE_UP') {
          if (arrayKey && arrayKey.startsWith('nested:')) {
            const parentId = arrayKey.replace('nested:', '');
            try {
              const customBlocks = JSON.parse(localStorage.getItem('demetra_custom_blocks') || '{}');
              const parentBlock = customBlocks[parentId];
              if (parentBlock && parentBlock.childrenBlocks) {
                const newChildren = [...parentBlock.childrenBlocks];
                if (index > 0 && index < newChildren.length) {
                  const temp = newChildren[index];
                  newChildren[index] = newChildren[index - 1];
                  newChildren[index - 1] = temp;
                  parentBlock.childrenBlocks = newChildren;
                  customBlocks[parentId] = parentBlock;
                  localStorage.setItem('demetra_custom_blocks', JSON.stringify(customBlocks));
                  window.dispatchEvent(new Event('storage'));
                  if (iframeRef.current) {
                    iframeRef.current.contentWindow?.postMessage({
                      type: 'DEMETRA_UPDATE_LAYOUT',
                      layout: currentLayout
                    }, '*');
                  }
                }
              }
            } catch (err) {
              console.error("Move up nested error", err);
            }
          } else {
            moveSection(arrayKey, index, 'up');
          }
        }
        if (action === 'MOVE_DOWN') {
          if (arrayKey && arrayKey.startsWith('nested:')) {
            const parentId = arrayKey.replace('nested:', '');
            try {
              const customBlocks = JSON.parse(localStorage.getItem('demetra_custom_blocks') || '{}');
              const parentBlock = customBlocks[parentId];
              if (parentBlock && parentBlock.childrenBlocks) {
                const newChildren = [...parentBlock.childrenBlocks];
                if (index >= 0 && index < newChildren.length - 1) {
                  const temp = newChildren[index];
                  newChildren[index] = newChildren[index + 1];
                  newChildren[index + 1] = temp;
                  parentBlock.childrenBlocks = newChildren;
                  customBlocks[parentId] = parentBlock;
                  localStorage.setItem('demetra_custom_blocks', JSON.stringify(customBlocks));
                  window.dispatchEvent(new Event('storage'));
                  if (iframeRef.current) {
                    iframeRef.current.contentWindow?.postMessage({
                      type: 'DEMETRA_UPDATE_LAYOUT',
                      layout: currentLayout
                    }, '*');
                  }
                }
              }
            } catch (err) {
              console.error("Move down nested error", err);
            }
          } else {
            moveSection(arrayKey, index, 'down');
          }
        }
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
          } else if (id?.startsWith('nested_')) {
            const parentId = findParentBlockOfNested(id);
            if (parentId) {
              try {
                const customBlocks = JSON.parse(localStorage.getItem('demetra_custom_blocks') || '{}');
                const parentBlock = customBlocks[parentId] || {};
                parentBlock.childrenBlocks = (parentBlock.childrenBlocks || []).filter((c: any) => c.id !== id);
                customBlocks[parentId] = parentBlock;
                localStorage.setItem('demetra_custom_blocks', JSON.stringify(customBlocks));
                window.dispatchEvent(new Event('storage'));
                
                if (iframeRef.current) {
                  iframeRef.current.contentWindow?.postMessage({
                    type: 'DEMETRA_UPDATE_LAYOUT',
                    layout: currentLayout
                  }, '*');
                }
                
                if (editingKey === id) {
                  setEditingKey(null);
                  setIsSettingsOpen(false);
                }
              } catch (err) {
                console.error("Remove nested block error", err);
              }
            }
          } else if (id?.startsWith('cat_')) {
            const prodId = id.replace('cat_', '');
            const newOrder = (currentLayout.order_catalog || []).filter((x: any) => String(x) !== String(prodId));
            updateLayout({ ...currentLayout, order_catalog: newOrder });
            if (editingKey === id) {
              setEditingKey(null);
              setIsSettingsOpen(false);
            }
          } else if (id?.startsWith('srv_')) {
            const srvId = id.replace('srv_', '');
            const newOrder = (currentLayout.order_services || []).filter((x: any) => String(x) !== String(srvId));
            updateLayout({ ...currentLayout, order_services: newOrder });
            if (editingKey === id) {
              setEditingKey(null);
              setIsSettingsOpen(false);
            }
          } else {
            removeSection(id);
          }
        }
        if (action === 'ADD_BLOCK_AT') {
          const { type, targetId, arrayKey: arrKey } = e.data;
          const k = arrKey || 'order';
          const newId = `new_block_${Date.now()}`;
          
          const defaultDataMap: Record<string, any> = {
            heading: { type: 'heading', heading: 'Новый заголовок', subheading: 'Раздел', body: 'Описание раздела...' },
            text: { type: 'text', body: 'Текст нового блока. Вы можете изменить этот текст в панели настроек.' },
            divider: { type: 'divider' },
            button: { type: 'button', label: 'Нажми меня', href: '#' },
            card: { type: 'card', label: 'Заголовок карточки', body: 'Описание карточки...', src: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&q=80&w=600' },
            two_col: { type: 'two_col', col1: 'Левая колонка с описанием...', col2: 'Правая колонка с характеристиками...' },
            image_text: { type: 'image_text', heading: 'Индустриальные решения', body: 'Описание преимуществ нашей компании...', src: 'https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122?auto=format&fit=crop&q=80&w=600' },
            cta_banner: { type: 'cta_banner', heading: 'Готовы начать проект?', subheading: 'Свяжитесь с нами', body: 'Наши специалисты ответят на все вопросы.', label: 'Оставить заявку', href: '/contacts' },
            container: { type: 'container', childrenBlocks: [] }
          };

          if (k.startsWith('nested:')) {
            const containerBlockId = k.replace('nested:', '');
            try {
              const customBlocks = JSON.parse(localStorage.getItem('demetra_custom_blocks') || '{}');
              const parentBlock = customBlocks[containerBlockId] || { type: 'container', childrenBlocks: [] };
              
              const newNestedId = `nested_${Date.now()}`;
              const newNestedBlock = {
                id: newNestedId,
                ...((defaultDataMap[type] || { type }))
              };
              
              const children = [...(parentBlock.childrenBlocks || [])];
              const targetIndex = children.findIndex(c => c.id === targetId);
              if (targetIndex !== -1) {
                children.splice(targetIndex, 0, newNestedBlock);
              } else {
                children.push(newNestedBlock);
              }
              
              parentBlock.childrenBlocks = children;
              customBlocks[containerBlockId] = parentBlock;
              
              localStorage.setItem('demetra_custom_blocks', JSON.stringify(customBlocks));
              window.dispatchEvent(new Event('storage'));
              
              if (iframeRef.current) {
                iframeRef.current.contentWindow?.postMessage({
                  type: 'DEMETRA_UPDATE_LAYOUT',
                  layout: currentLayout
                }, '*');
              }
              
              setEditingKey(newNestedId);
              setIsModalOpen(true);
              setModalActiveTab('content');
            } catch (err) {
              console.error("Add nested drop at index error", err);
            }
          } else {
            const allCustomBlocks = { ...getCustomBlocks(), [newId]: defaultDataMap[type] || { type } };
            localStorage.setItem('demetra_custom_blocks', JSON.stringify(allCustomBlocks));
            window.dispatchEvent(new Event('storage'));
            
            const newOrder = [...(currentLayout[k] || [])];
            const targetIndex = newOrder.indexOf(targetId);
            if (targetIndex !== -1) {
              newOrder.splice(targetIndex, 0, newId);
            } else {
              newOrder.push(newId);
            }
            
            updateLayout({
              ...currentLayout,
              [k]: newOrder
            });
            
            setEditingKey(newId);
            setIsSettingsOpen(true);
          }
        }
        if (action === 'ADD_NESTED_AT') {
          const { id: containerBlockId, blockType } = e.data;
          try {
            const customBlocks = JSON.parse(localStorage.getItem('demetra_custom_blocks') || '{}');
            const parentBlock = customBlocks[containerBlockId] || { type: 'container' };
            
            const newNestedId = `nested_${Date.now()}`;
            const newNestedBlock = {
              id: newNestedId,
              type: blockType,
              heading: 'Новый элемент',
              body: 'Описание элемента',
              label: 'Кнопка',
              src: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=800&q=80',
              href: '#'
            };
            
            parentBlock.childrenBlocks = [...(parentBlock.childrenBlocks || []), newNestedBlock];
            customBlocks[containerBlockId] = parentBlock;
            
            localStorage.setItem('demetra_custom_blocks', JSON.stringify(customBlocks));
            window.dispatchEvent(new Event('storage'));
            
            if (iframeRef.current) {
              iframeRef.current.contentWindow?.postMessage({
                type: 'DEMETRA_UPDATE_LAYOUT',
                layout: currentLayout
              }, '*');
            }
            
            setEditingKey(newNestedId);
            setIsModalOpen(true);
            setModalActiveTab('content');
          } catch (err) {
            console.error("Add nested drop error", err);
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
           if (arrKey && arrKey.startsWith('nested:')) {
             const parentId = arrKey.replace('nested:', '');
             try {
               const customBlocks = JSON.parse(localStorage.getItem('demetra_custom_blocks') || '{}');
               const parentBlock = customBlocks[parentId];
               if (parentBlock && parentBlock.childrenBlocks) {
                 const newChildren = [...parentBlock.childrenBlocks];
                 const draggedIndex = newChildren.findIndex((c: any) => c.id === draggedId);
                 const targetIndex = newChildren.findIndex((c: any) => c.id === targetId);
                 if (draggedIndex !== -1 && targetIndex !== -1) {
                   const [draggedItem] = newChildren.splice(draggedIndex, 1);
                   newChildren.splice(targetIndex, 0, draggedItem);
                   parentBlock.childrenBlocks = newChildren;
                   customBlocks[parentId] = parentBlock;
                   localStorage.setItem('demetra_custom_blocks', JSON.stringify(customBlocks));
                   window.dispatchEvent(new Event('storage'));
                   
                   if (iframeRef.current) {
                     iframeRef.current.contentWindow?.postMessage({
                       type: 'DEMETRA_UPDATE_LAYOUT',
                       layout: currentLayout
                     }, '*');
                   }
                 }
               }
             } catch (err) {
               console.error("Move nested error", err);
             }
           } else {
             // ─── Read FRESH layout via ref – no stale closure! ───
             const lk = layoutKeyRef.current;
             const freshLayout = pageLayoutsRef.current[lk] || {};

             const cleanId = (str: any): string =>
               String(str).replace('cat_item_', '').replace('cat_', '').replace('srv_', '').replace('service-', 'service-').trim();

             // ─── Determine correct array key from the DRAGGED element's ID prefix ───
             // arrKey from target is unreliable — if user drops on outer section wrapper
             // it reports 'order' instead of 'order_catalog'
             let k: string;
             if (draggedId && (draggedId.startsWith('cat_') || /^\d+$/.test(String(draggedId)))) {
               k = 'order_catalog';
             } else if (draggedId && draggedId.startsWith('gallery_')) {
               k = 'order_gallery';
             } else if (draggedId && (draggedId.startsWith('service-') || draggedId.startsWith('srv_'))) {
               k = 'order_services';
             } else {
               k = arrKey || 'order';
             }

             let rawOrder: any[] = freshLayout[k] || [];
             if (rawOrder.length === 0) {
               if (k === 'order_catalog')       rawOrder = ['1','2','3','4','5'];
               else if (k === 'order_services') rawOrder = ['service-1','service-2','service-3','service-4'];
               else if (k === 'order_gallery')  rawOrder = ['gallery_1','gallery_2','gallery_3','gallery_4','gallery_5','gallery_6'];
             }
             
             const newOrder = rawOrder.map((x: any) => String(x));

             // Strip cat_/srv_/gallery_ prefix from both sides for matching
             const stripPrefix = (str: string) =>
               str.replace('cat_item_', '').replace('cat_', '').replace('gallery_', 'gallery_').replace('srv_', '').trim();
             
             const cleanDragId = stripPrefix(String(draggedId));
             const cleanTgtId  = stripPrefix(String(targetId));
             
             console.log('[MOVE_BLOCK_TO]', { k, lk, newOrder, cleanDragId, cleanTgtId });
             
             const di = newOrder.findIndex(x => stripPrefix(x) === cleanDragId);
             const ti = newOrder.findIndex(x => stripPrefix(x) === cleanTgtId);
             
             console.log('[MOVE_BLOCK_TO] indices', { di, ti });
             
             if (di !== -1 && ti !== -1) {
               const [movedItem] = newOrder.splice(di, 1);
               newOrder.splice(ti, 0, movedItem);
               const updatedLayout = { ...freshLayout, [k]: newOrder };
               // Save directly – bypass React state closure
               localStorage.setItem(`demetra_${lk}_layout`, JSON.stringify(updatedLayout));
               window.dispatchEvent(new Event('storage'));
               if (iframeRef.current?.contentWindow) {
                 iframeRef.current.contentWindow.postMessage({ type: 'DEMETRA_UPDATE_LAYOUT', layout: updatedLayout }, '*');
               }
               // Also update React state for UI consistency
               setPageLayouts((prev: any) => ({ ...prev, [lk]: updatedLayout }));
               console.log('[MOVE_BLOCK_TO] saved', k, newOrder);
             } else {
               console.warn('[MOVE_BLOCK_TO] IDs not found', { cleanDragId, cleanTgtId, newOrder, k });
             }
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
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Empty deps: refs keep values fresh

  useEffect(() => {
    if (iframeRef.current?.contentWindow) {
      iframeRef.current.contentWindow.postMessage({ type: 'DEMETRA_UPDATE_LAYOUT', layout: currentLayout }, '*');
      iframeRef.current.contentWindow.postMessage({ type: 'DEMETRA_UPDATE_TRANSLATIONS', translations: allTranslations }, '*');
      iframeRef.current.contentWindow.postMessage({ type: 'DEMETRA_TOGGLE_GRID', enabled: showDesignerGrid }, '*');
    }
  }, [currentLayout, allTranslations, previewRoute, showDesignerGrid]);

  useEffect(() => {
    localStorage.setItem('demetra_show_designer_grid', String(showDesignerGrid));
    if (iframeRef.current?.contentWindow) {
      iframeRef.current.contentWindow.postMessage({ type: 'DEMETRA_TOGGLE_GRID', enabled: showDesignerGrid }, '*');
    }
  }, [showDesignerGrid]);

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

            {/* Designer grid toggle button */}
            <button
              onClick={() => setShowDesignerGrid(!showDesignerGrid)}
              style={{
                background: showDesignerGrid ? 'rgba(0, 255, 65, 0.1)' : '#222',
                color: showDesignerGrid ? '#00ff41' : '#aaa',
                border: showDesignerGrid ? '1px solid #00ff41' : '1px solid #444',
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
              <Grid size={14} />
              Сетка
            </button>

            <select 
               value={previewRoute}
               onChange={(e) => setPreviewRoute(e.target.value)}
               style={{ background: '#0a0a0a', color: '#fff', border: '1px solid #333', padding: '0.5rem 1rem', borderRadius: '8px', fontSize: '0.85rem', outline: 'none', cursor: 'pointer' }}
            >
               {pages.map((p: any) => {
                 const name = p.name[currentLang] || p.name.ru;
                 return (
                   <option key={p.id} value={p.path}>
                     {name} ({p.id})
                   </option>
                 );
               })}
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
                         <div style={{ fontSize: '0.75rem', color: '#8e9196', fontWeight: '900', letterSpacing: '0.15em' }}>ГАЛЕРЕЯ МЕДИА</div>
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
                             fontSize: '0.85rem',
                             cursor: 'pointer',
                             display: 'flex',
                             flexDirection: 'column',
                             alignItems: 'center',
                             gap: '0.5rem',
                             transition: 'all 0.2s'
                           }}
                           onMouseEnter={(e) => {
                             setHoveredBlockId('gallery_add');
                             e.currentTarget.style.background = 'rgba(0, 255, 65, 0.1)';
                           }}
                           onMouseLeave={(e) => {
                             setHoveredBlockId(null);
                             e.currentTarget.style.background = 'rgba(0, 255, 65, 0.05)';
                           }}
                         >
                           <Plus size={24} />
                           <span>Добавить Фото / Видео</span>
                         </button>
                      </div>
                    )}

                    {/* SECTIONS LIST (Home page only) */}
                    {layoutKey === 'home' && (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                         <div style={{ fontSize: '0.75rem', color: '#8e9196', fontWeight: '900', letterSpacing: '0.15em' }}>СЕКЦИИ СТРАНИЦЫ</div>
                         <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                            {[
                              { id: 'hero', title: 'Hero (Обложка)', desc: 'Главный баннер, слайды и кнопки', icon: <Layers size={16} /> },
                              { id: 'marquee', title: 'Marquee (Инфо-строка)', desc: 'Бегущая строка с показателями', icon: <Zap size={16} /> },
                              { id: 'catalog', title: 'Catalog (Каталог)', desc: 'Сетка продукции и оборудования', icon: <Package size={16} /> },
                              { id: 'partnership', title: 'Partnership (Партнеры)', desc: 'Сетка логотипов партнеров', icon: <ExternalLink size={16} /> },
                              { id: 'services', title: 'Services (Услуги)', desc: 'Блоки преимуществ и услуг', icon: <Settings size={16} /> },
                              { id: 'cta', title: 'CTA (Обратная связь)', desc: 'Кнопки обратной связи', icon: <Phone size={16} /> }
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
                                  statusColor = '#8e9196';
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
                                    padding: '0.85rem 1rem',
                                    cursor: 'pointer',
                                    transition: 'all 0.2s',
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'center',
                                    gap: '1rem'
                                  }}
                                  onMouseEnter={(e) => {
                                    setHoveredBlockId(sec.id);
                                    e.currentTarget.style.borderColor = '#00ff41';
                                    e.currentTarget.style.background = 'rgba(0, 255, 65, 0.05)';
                                  }}
                                  onMouseLeave={(e) => {
                                    setHoveredBlockId(null);
                                    e.currentTarget.style.borderColor = isAdded && !isHidden ? 'rgba(0, 255, 65, 0.2)' : '#1a1a1e';
                                    e.currentTarget.style.background = bg;
                                  }}
                                >
                                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                    <div style={{ color: statusColor, display: 'flex', alignItems: 'center' }}>{sec.icon}</div>
                                    <div style={{ textAlign: 'left' }}>
                                      <div style={{ fontSize: '0.85rem', color: '#fff', fontWeight: '800' }}>{sec.title}</div>
                                      <div style={{ fontSize: '0.7rem', color: '#a1a1aa', marginTop: '0.2rem' }}>{sec.desc}</div>
                                    </div>
                                  </div>
                                  <div style={{ fontSize: '0.7rem', color: statusColor, fontWeight: '900', letterSpacing: '0.05em', whiteSpace: 'nowrap' }}>
                                    {statusText}
                                  </div>
                                </div>
                              );
                            })}
                         </div>
                      </div>
                    )}

                    {/* CUSTOM BLOCKS LIST */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                       
                       {/* Standard Elements */}
                       <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                          <div style={{ fontSize: '0.75rem', color: '#8e9196', fontWeight: '900', letterSpacing: '0.15em' }}>СТАНДАРТНЫЕ ЭЛЕМЕНТЫ</div>
                          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
                             {[
                               { id: 'heading', title: 'Заголовок', icon: '𝐇', desc: 'Heading' },
                               { id: 'text', title: 'Текст', icon: '¶', desc: 'Paragraph' },
                               { id: 'button', title: 'Кнопка', icon: '↗', desc: 'Button' },
                               { id: 'card', title: 'Карточка', icon: '▭', desc: 'Bento Card' },
                               { id: 'two_col', title: '2 Колонки', icon: '⫿', desc: '2 Columns' },
                               { id: 'image_text', title: 'Фото+Текст', icon: '⊡', desc: 'Image & Text' },
                               { id: 'cta_banner', title: 'Баннер', icon: '★', desc: 'Promo Banner' },
                               { id: 'divider', title: 'Разделитель', icon: '—', desc: 'Divider Line' },
                               { id: 'container', title: 'Контейнер', icon: '⧇', desc: 'Nested Blocks' }
                             ].filter(x => x.title.toLowerCase().includes(libSearch.toLowerCase()) || x.desc.toLowerCase().includes(libSearch.toLowerCase())).map(el => (
                               <button
                                 key={el.id}
                                 onClick={() => addCustomBlock(el.id)}
                                 draggable={true}
                                 onDragStart={(e) => {
                                   e.dataTransfer.setData("text/plain", `add_block:${el.id}`);
                                   e.dataTransfer.effectAllowed = "copy";
                                 }}
                                 style={{
                                   background: '#121214',
                                   border: '1px solid #1e1e22',
                                   borderRadius: '10px',
                                   padding: '1rem 0.5rem',
                                   color: '#fff',
                                   cursor: 'pointer',
                                   transition: 'all 0.2s',
                                   display: 'flex',
                                   flexDirection: 'column',
                                   alignItems: 'center',
                                   gap: '0.4rem'
                                 }}
                                 onMouseEnter={(e) => {
                                   setHoveredBlockId(el.id);
                                   e.currentTarget.style.borderColor = '#00ff41';
                                   e.currentTarget.style.background = 'rgba(0, 255, 65, 0.04)';
                                   e.currentTarget.style.transform = 'translateY(-2px)';
                                 }}
                                 onMouseLeave={(e) => {
                                   setHoveredBlockId(null);
                                   e.currentTarget.style.borderColor = '#1e1e22';
                                   e.currentTarget.style.background = '#121214';
                                   e.currentTarget.style.transform = 'translateY(0)';
                                 }}
                               >
                                 <div style={{ fontSize: '1.4rem', color: '#00ff41', fontWeight: '800' }}>{el.icon}</div>
                                 <div style={{ fontSize: '0.85rem', fontWeight: '800' }}>{el.title}</div>
                                 <div style={{ fontSize: '0.65rem', color: '#a1a1aa' }}>{el.desc}</div>
                               </button>
                             ))}
                          </div>
                       </div>

                       {/* Shapes Section */}
                       <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                          <div style={{ fontSize: '0.75rem', color: '#8e9196', fontWeight: '900', letterSpacing: '0.15em' }}>ФИГУРЫ (SHAPES)</div>
                          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
                             {[
                               { id: 'shape_rect', title: 'Квадрат', icon: '■', desc: 'Rectangle Shape' },
                               { id: 'shape_circle', title: 'Круг', icon: '●', desc: 'Circle Shape' },
                               { id: 'shape_line', title: 'Линия', icon: '│', desc: 'Line Shape' }
                             ].filter(x => x.title.toLowerCase().includes(libSearch.toLowerCase()) || x.desc.toLowerCase().includes(libSearch.toLowerCase())).map(el => (
                               <button
                                 key={el.id}
                                 onClick={() => addCustomBlock(el.id)}
                                 draggable={true}
                                 onDragStart={(e) => {
                                   e.dataTransfer.setData("text/plain", `add_block:${el.id}`);
                                   e.dataTransfer.effectAllowed = "copy";
                                 }}
                                 style={{
                                   background: '#121214',
                                   border: '1px solid #1e1e22',
                                   borderRadius: '10px',
                                   padding: '1rem 0.5rem',
                                   color: '#fff',
                                   cursor: 'pointer',
                                   transition: 'all 0.2s',
                                   display: 'flex',
                                   flexDirection: 'column',
                                   alignItems: 'center',
                                   gap: '0.4rem'
                                 }}
                                 onMouseEnter={(e) => {
                                   setHoveredBlockId(el.id);
                                   e.currentTarget.style.borderColor = '#00ff41';
                                   e.currentTarget.style.background = 'rgba(0, 255, 65, 0.04)';
                                   e.currentTarget.style.transform = 'translateY(-2px)';
                                 }}
                                 onMouseLeave={(e) => {
                                   setHoveredBlockId(null);
                                   e.currentTarget.style.borderColor = '#1e1e22';
                                   e.currentTarget.style.background = '#121214';
                                   e.currentTarget.style.transform = 'translateY(0)';
                                 }}
                               >
                                 <div style={{ fontSize: '1.4rem', color: '#00ff41', fontWeight: '800' }}>{el.icon}</div>
                                 <div style={{ fontSize: '0.85rem', fontWeight: '800' }}>{el.title}</div>
                                 <div style={{ fontSize: '0.65rem', color: '#a1a1aa' }}>{el.desc}</div>
                               </button>
                             ))}
                          </div>
                       </div>

                    </div>

                 </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Floating Instruction / Help Guide */}
        <AnimatePresence>
          {hoveredBlockId && (
            <motion.div
              initial={{ opacity: 0, x: -10, scale: 0.95 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: -10, scale: 0.95 }}
              transition={{ duration: 0.15 }}
              style={{
                position: 'absolute',
                left: isLibraryOpen ? '355px' : '65px',
                top: '120px',
                width: '320px',
                background: 'rgba(10, 10, 12, 0.96)',
                backdropFilter: 'blur(20px)',
                border: '1px solid #00ff41',
                borderRadius: '16px',
                padding: '1.5rem',
                color: '#fff',
                zIndex: 4500,
                boxShadow: '0 10px 40px rgba(0, 255, 65, 0.15), 0 0 100px rgba(0,0,0,0.8)',
                pointerEvents: 'none'
              }}
            >
               <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#00ff41', marginBottom: '0.75rem' }}>
                  <Info size={16} />
                  <span style={{ fontSize: '0.7rem', fontWeight: '900', letterSpacing: '0.15em', textTransform: 'uppercase' }}>ИНСТРУКЦИЯ</span>
               </div>
               <h4 style={{ fontSize: '1.1rem', fontWeight: '900', margin: '0 0 0.5rem 0', color: '#fff' }}>
                  {getBlockHelp(hoveredBlockId).title}
               </h4>
               <p style={{ fontSize: '0.8rem', color: '#a1a1aa', margin: '0 0 1rem 0', lineHeight: '1.5' }}>
                  {getBlockHelp(hoveredBlockId).desc}
               </p>
               <div style={{ borderTop: '1px solid #222', paddingTop: '1rem' }}>
                  <div style={{ fontSize: '0.65rem', color: '#00ff41', fontWeight: '800', marginBottom: '0.5rem' }}>КАК НАСТРОИТЬ:</div>
                  <ul style={{ margin: 0, paddingLeft: '1.25rem', fontSize: '0.75rem', color: '#d1d1d6', display: 'flex', flexDirection: 'column', gap: '0.4rem', lineHeight: '1.4' }}>
                     {getBlockHelp(hoveredBlockId).steps.map((step: string, i: number) => (
                        <li key={i}>{step}</li>
                     ))}
                  </ul>
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

      {/* Figma-Style Block Editor Modal */}
      <AnimatePresence>
        {isModalOpen && editingKey && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              width: '100vw',
              height: '100vh',
              background: 'rgba(0, 0, 0, 0.85)',
              backdropFilter: 'blur(16px)',
              zIndex: 8000,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
            onClick={() => setIsModalOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.95, y: 15 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 15 }}
              style={{
                width: '850px',
                maxWidth: '95vw',
                height: '650px',
                maxHeight: '90vh',
                background: '#0d0d0e',
                border: '1px solid #2a2b2f',
                borderRadius: '24px',
                display: 'flex',
                flexDirection: 'column',
                boxShadow: '0 25px 70px rgba(0, 255, 65, 0.12)',
                overflow: 'hidden',
              }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Modal Header */}
              <div style={{
                padding: '1.5rem 2rem',
                borderBottom: '1px solid #1a1b1e',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                background: '#070708'
              }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <span style={{ fontSize: '0.65rem', background: 'rgba(0,255,65,0.08)', color: '#00ff41', border: '1px solid rgba(0,255,65,0.2)', padding: '0.25rem 0.5rem', borderRadius: '4px', fontWeight: '900', letterSpacing: '0.05em' }}>
                      {editingKey.startsWith('new_block_') ? 'ПОЛЬЗОВАТЕЛЬСКИЙ БЛОК' : 'СИСТЕМНЫЙ БЛОК'}
                    </span>
                    <h2 style={{ fontSize: '1.1rem', fontWeight: '900', color: '#fff', margin: 0 }}>
                      Настройки элемента: <span style={{ color: '#aaa' }}>{editingKey}</span>
                    </h2>
                  </div>
                </div>
                <button
                  onClick={() => setIsModalOpen(false)}
                  style={{
                    background: '#1a1b1e',
                    border: '1px solid #333',
                    color: '#888',
                    width: '36px',
                    height: '36px',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    transition: '0.2s',
                  }}
                  onMouseEnter={(e) => { e.currentTarget.style.color = '#fff'; e.currentTarget.style.borderColor = '#555'; }}
                  onMouseLeave={(e) => { e.currentTarget.style.color = '#888'; e.currentTarget.style.borderColor = '#333'; }}
                >
                  <X size={18} />
                </button>
              </div>

              {/* Modal Tabs */}
              <div style={{
                display: 'flex',
                background: '#09090a',
                borderBottom: '1px solid #1a1b1e',
                padding: '0 1rem',
              }}>
                {[
                  { id: 'content', label: '📝 Текст & Информация' },
                  { id: 'media', label: '🖼️ Изображения & Видео' },
                  { id: 'scaling', label: '📐 Размеры & Сетка' },
                  { id: 'effects', label: '✨ Эффекты & Фон' },
                  { id: 'actions', label: '⚡ Действия & Модалки' }
                ].map(tab => (
                  <button
                    key={tab.id}
                    onClick={() => setModalActiveTab(tab.id as any)}
                    style={{
                      padding: '1.25rem 1.5rem',
                      background: 'none',
                      border: 'none',
                      borderBottom: modalActiveTab === tab.id ? '2px solid #00ff41' : '2px solid transparent',
                      color: modalActiveTab === tab.id ? '#fff' : '#6c6f75',
                      fontWeight: '800',
                      fontSize: '0.85rem',
                      cursor: 'pointer',
                      transition: '0.2s',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem'
                    }}
                    onMouseEnter={(e) => { if (modalActiveTab !== tab.id) e.currentTarget.style.color = '#aaa'; }}
                    onMouseLeave={(e) => { if (modalActiveTab !== tab.id) e.currentTarget.style.color = '#6c6f75'; }}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>

              {/* Modal Body */}
              <div style={{
                flex: 1,
                padding: '2rem 2.5rem',
                overflowY: 'auto',
                background: '#0d0d0e'
              }}>
                <ModalBodyContent 
                  editingKey={editingKey}
                  modalActiveTab={modalActiveTab}
                  currentLayout={currentLayout}
                  updateLayout={updateLayout}
                  allTranslations={allTranslations}
                  updateTranslation={updateTranslation}
                />
              </div>

              {/* Modal Footer */}
              <div style={{
                padding: '1.5rem 2.5rem',
                borderTop: '1px solid #1a1b1e',
                background: '#070708',
                display: 'flex',
                justifyContent: 'flex-end',
                gap: '1rem'
              }}>
                <button
                  onClick={() => setIsModalOpen(false)}
                  style={{
                    background: '#141416',
                    border: '1px solid #2a2b2f',
                    color: '#fff',
                    padding: '0.85rem 2rem',
                    borderRadius: '12px',
                    fontWeight: '800',
                    fontSize: '0.9rem',
                    cursor: 'pointer',
                    transition: '0.2s'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.background = '#1a1b1e'}
                  onMouseLeave={(e) => e.currentTarget.style.background = '#141416'}
                >
                  Закрыть
                </button>
                <button
                  onClick={() => setIsModalOpen(false)}
                  style={{
                    background: '#00ff41',
                    border: 'none',
                    color: '#000',
                    padding: '0.85rem 2.5rem',
                    borderRadius: '12px',
                    fontWeight: '900',
                    fontSize: '0.9rem',
                    cursor: 'pointer',
                    boxShadow: '0 0 30px rgba(0, 255, 65, 0.25)',
                    transition: '0.2s'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.boxShadow = '0 0 40px rgba(0, 255, 65, 0.4)'}
                  onMouseLeave={(e) => e.currentTarget.style.boxShadow = '0 0 30px rgba(0, 255, 65, 0.25)'}
                >
                  Применить изменения
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Choice of Nested Block Type Modal */}
      <AnimatePresence>
        {addingNestedForBlockId && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              width: '100vw',
              height: '100vh',
              background: 'rgba(0, 0, 0, 0.85)',
              zIndex: 99999,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              backdropFilter: 'blur(8px)'
            }}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              style={{
                background: '#0d0d0e',
                border: '1px solid #1a1b1e',
                borderRadius: '24px',
                padding: '2.5rem',
                width: '450px',
                boxShadow: '0 30px 70px rgba(0, 0, 0, 0.8)',
                display: 'flex',
                flexDirection: 'column',
                gap: '1.5rem'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h3 style={{ fontSize: '1.1rem', color: '#fff', fontWeight: '900', letterSpacing: '0.05em' }}>ДОБАВИТЬ ЭЛЕМЕНТ</h3>
                <button
                  onClick={() => setAddingNestedForBlockId(null)}
                  style={{ background: 'none', border: 'none', color: '#6c6f75', cursor: 'pointer' }}
                >
                  <X size={20} />
                </button>
              </div>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', maxHeight: '400px', overflowY: 'auto', paddingRight: '0.25rem' }}>
                {[
                  { type: 'heading', name: '📝 Заголовок', desc: 'Заголовок с подзаголовком' },
                  { type: 'text', name: '📄 Текст / Описание', desc: 'Абзац с форматированным текстом' },
                  { type: 'button', name: '🎯 Кнопка действия', desc: 'Интерактивная кнопка со ссылкой' },
                  { type: 'card', name: '🎴 Карточка с фото', desc: 'Сетка карточек с описанием' },
                  { type: 'image_text', name: '🖼️ Медиа-блок', desc: 'Фото/Видео слева и текст справа' },
                  { type: 'divider', name: '➖ Разделитель', desc: 'Элегантная градиентная линия' }
                ].map(opt => (
                  <button
                    key={opt.type}
                    onClick={() => handleSelectNestedType(opt.type)}
                    style={{
                      background: '#141416',
                      border: '1px solid #1a1b1e',
                      color: '#fff',
                      padding: '1rem 1.25rem',
                      borderRadius: '12px',
                      fontSize: '0.9rem',
                      fontWeight: '700',
                      cursor: 'pointer',
                      textAlign: 'left',
                      transition: 'all 0.2s',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '0.25rem'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.borderColor = '#00ff41';
                      e.currentTarget.style.background = 'rgba(0, 255, 65, 0.04)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.borderColor = '#1a1b1e';
                      e.currentTarget.style.background = '#141416';
                    }}
                  >
                    <span style={{ color: '#fff' }}>{opt.name}</span>
                    <span style={{ fontSize: '0.7rem', color: '#6c6f75', fontWeight: 'normal' }}>{opt.desc}</span>
                  </button>
                ))}
              </div>
              
              <button
                onClick={() => setAddingNestedForBlockId(null)}
                style={{
                  width: '100%',
                  background: '#1a1b1e',
                  border: 'none',
                  color: '#6c6f75',
                  padding: '1rem',
                  borderRadius: '12px',
                  cursor: 'pointer',
                  fontWeight: '700',
                  fontSize: '0.9rem',
                  transition: '0.2s'
                }}
                onMouseEnter={(e) => e.currentTarget.style.background = '#25262b'}
                onMouseLeave={(e) => e.currentTarget.style.background = '#1a1b1e'}
              >
                Отмена
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ─── Modal Body Content Component ──────────────────────────────────────────
function ModalBodyContent({ 
  editingKey, 
  modalActiveTab, 
  currentLayout, 
  updateLayout, 
  allTranslations, 
  updateTranslation 
}: { 
  editingKey: string; 
  modalActiveTab: 'content' | 'media' | 'scaling' | 'effects' | 'actions'; 
  currentLayout: any; 
  updateLayout: any; 
  allTranslations: any; 
  updateTranslation: any; 
}) {
  const [activeLang, setActiveLang] = useState<'ru' | 'kk' | 'en'>('ru');
  const isNestedBlock = editingKey.startsWith('nested_');
  const parentKey = isNestedBlock ? findParentBlockOfNested(editingKey) : null;
  const isCustomBlock = editingKey.startsWith('new_block_') || isNestedBlock;
  const isGalleryItem = editingKey.startsWith('gallery_');
  
  const inputStyle: React.CSSProperties = {
    background: '#111',
    border: '1px solid #333',
    padding: '0.75rem 1rem',
    color: '#fff',
    fontSize: '0.9rem',
    borderRadius: '10px',
    outline: 'none',
    width: '100%',
    boxSizing: 'border-box'
  };

  const labelStyle = (text: string) => (
    <label style={{ fontSize: '0.7rem', color: '#00ff41', fontWeight: '800', letterSpacing: '0.05em', marginBottom: '0.4rem', display: 'block' }}>
      {text.toUpperCase()}
    </label>
  );

  // 1. SCALING & DIMENSIONS TAB
  if (modalActiveTab === 'scaling') {
    const s = currentLayout.styles?.[editingKey] || {};
    const setStyleVal = (key: string, val: any) => {
      updateLayout({
        ...currentLayout,
        styles: {
          ...(currentLayout.styles || {}),
          [editingKey]: { ...(currentLayout.styles?.[editingKey] || {}), [key]: val }
        }
      });
    };

    const getNumVal = (cssVal: string | number | undefined, fallback: number) => {
      if (cssVal === undefined) return fallback;
      if (typeof cssVal === 'number') return cssVal;
      const num = parseInt(cssVal, 10);
      return isNaN(num) ? fallback : num;
    };

    const padTop = getNumVal(s.paddingTop, 48);
    const padBottom = getNumVal(s.paddingBottom, 48);
    const padLeft = getNumVal(s.paddingLeft, 0);
    const padRight = getNumVal(s.paddingRight, 0);
    const margTop = getNumVal(s.marginTop, 0);
    const margBottom = getNumVal(s.marginBottom, 0);
    const borderRadius = getNumVal(s.borderRadius, 12);
    const opacity = getNumVal(s.opacity === undefined ? 1 : s.opacity, 1) * 100;
    
    let scaleVal = 1;
    if (s.transform && s.transform.includes('scale')) {
      const match = s.transform.match(/scale\(([^)]+)\)/);
      if (match && match[1]) scaleVal = parseFloat(match[1]) || 1;
    }

    return (
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div>
            {labelStyle(`Масштаб элемента (${scaleVal.toFixed(2)}x)`)}
            <input 
              type="range" min="0.5" max="1.5" step="0.05" 
              value={scaleVal} 
              onChange={e => setStyleVal('transform', `scale(${e.target.value})`)} 
              style={{ width: '100%', accentColor: '#00ff41', cursor: 'pointer' }}
            />
          </div>

          <div>
            {labelStyle(`Внутренние отступы сверху / снизу (${padTop}px / ${padBottom}px)`)}
            <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
              <input 
                type="range" min="0" max="120" 
                value={padTop} 
                onChange={e => setStyleVal('paddingTop', `${e.target.value}px`)} 
                style={{ flex: 1, accentColor: '#00ff41', cursor: 'pointer' }}
              />
              <input 
                type="range" min="0" max="120" 
                value={padBottom} 
                onChange={e => setStyleVal('paddingBottom', `${e.target.value}px`)} 
                style={{ flex: 1, accentColor: '#00ff41', cursor: 'pointer' }}
              />
            </div>
          </div>

          <div>
            {labelStyle(`Внутренние отступы слева / справа (${padLeft}px / ${padRight}px)`)}
            <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
              <input 
                type="range" min="0" max="80" 
                value={padLeft} 
                onChange={e => setStyleVal('paddingLeft', `${e.target.value}px`)} 
                style={{ flex: 1, accentColor: '#00ff41', cursor: 'pointer' }}
              />
              <input 
                type="range" min="0" max="80" 
                value={padRight} 
                onChange={e => setStyleVal('paddingRight', `${e.target.value}px`)} 
                style={{ flex: 1, accentColor: '#00ff41', cursor: 'pointer' }}
              />
            </div>
          </div>

          <div>
            {labelStyle(`Внешние отступы сверху / снизу (${margTop}px / ${margBottom}px)`)}
            <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
              <input 
                type="range" min="0" max="60" 
                value={margTop} 
                onChange={e => setStyleVal('marginTop', `${e.target.value}px`)} 
                style={{ flex: 1, accentColor: '#00ff41', cursor: 'pointer' }}
              />
              <input 
                type="range" min="0" max="60" 
                value={margBottom} 
                onChange={e => setStyleVal('marginBottom', `${e.target.value}px`)} 
                style={{ flex: 1, accentColor: '#00ff41', cursor: 'pointer' }}
              />
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div>
            {labelStyle(`Скругление углов (${borderRadius}px)`)}
            <input 
              type="range" min="0" max="50" 
              value={borderRadius} 
              onChange={e => setStyleVal('borderRadius', `${e.target.value}px`)} 
              style={{ width: '100%', accentColor: '#00ff41', cursor: 'pointer' }}
            />
          </div>

          <div>
            {labelStyle(`Прозрачность (${opacity}%)`)}
            <input 
              type="range" min="0" max="100" 
              value={opacity} 
              onChange={e => setStyleVal('opacity', parseFloat((parseInt(e.target.value) / 100).toFixed(2)))} 
              style={{ width: '100%', accentColor: '#00ff41', cursor: 'pointer' }}
            />
          </div>

          <div>
            {labelStyle('Адаптивность / Скрытие')}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginTop: '0.25rem' }}>
              <input 
                type="checkbox" 
                id="hideOnMobile"
                checked={!!s.hideOnMobile} 
                onChange={e => setStyleVal('hideOnMobile', e.target.checked)} 
                style={{ width: '20px', height: '20px', accentColor: '#00ff41', cursor: 'pointer' }}
              />
              <label htmlFor="hideOnMobile" style={{ fontSize: '0.85rem', color: '#fff', fontWeight: 'bold', cursor: 'pointer', userSelect: 'none' }}>
                Скрыть на мобильных (class="responsive-hide")
              </label>
            </div>
          </div>

          <div>
            {labelStyle('Ширина в сетке (Grid Column Span)')}
            <select 
              value={s.gridColumn || 'span 12'} 
              onChange={e => setStyleVal('gridColumn', e.target.value)} 
              style={{ ...inputStyle, cursor: 'pointer' }}
            >
              <option value="span 12">100% Ширина (12 колонок)</option>
              <option value="span 10">83% Ширина (10 колонок)</option>
              <option value="span 8">66% Ширина (8 колонок)</option>
              <option value="span 6">50% Ширина (6 колонок)</option>
              <option value="span 4">33% Ширина (4 колонки)</option>
              <option value="span 3">25% Ширина (3 колонки)</option>
            </select>
          </div>

          <div>
            {labelStyle('Высота в сетке (Grid Row Span)')}
            <select 
              value={s.gridRow || 'span 1'} 
              onChange={e => setStyleVal('gridRow', e.target.value)} 
              style={{ ...inputStyle, cursor: 'pointer' }}
            >
              <option value="span 1">1 Ряд (Стандартная)</option>
              <option value="span 2">2 Ряда (Высокая)</option>
              <option value="span 3">3 Ряда</option>
              <option value="span 4">4 Ряда</option>
            </select>
          </div>

          <div style={{ gridColumn: 'span 2', height: '1px', background: '#222', margin: '0.5rem 0' }} />

          <div>
            {labelStyle('Тип позиционирования (Position)')}
            <select 
              value={s.position || 'relative'} 
              onChange={e => setStyleVal('position', e.target.value)} 
              style={{ ...inputStyle, cursor: 'pointer' }}
            >
              <option value="relative">В потоке (Relative / Grid)</option>
              <option value="absolute">Свободное (Absolute - как в Figma)</option>
              <option value="fixed">Фиксированное (Fixed)</option>
            </select>
          </div>
          <div>
            {labelStyle('Z-Index (Слой)')}
            <input 
              type="number" 
              value={s.zIndex || ''} 
              onChange={e => setStyleVal('zIndex', e.target.value ? parseInt(e.target.value) : undefined)} 
              placeholder="10" 
              style={inputStyle} 
            />
          </div>

          {s.position === 'absolute' && (
            <>
              <div>
                {labelStyle('Смещение слева (Left)')}
                <input 
                  type="text" 
                  value={s.left || ''} 
                  onChange={e => setStyleVal('left', e.target.value)} 
                  placeholder="20px или 50%" 
                  style={inputStyle} 
                />
              </div>
              <div>
                {labelStyle('Смещение сверху (Top)')}
                <input 
                  type="text" 
                  value={s.top || ''} 
                  onChange={e => setStyleVal('top', e.target.value)} 
                  placeholder="50px или 10%" 
                  style={inputStyle} 
                />
              </div>
            </>
          )}

          <div>
            {labelStyle('Цвет фона / Заливка (CSS)')}
            <div style={{ display: 'flex', gap: '0.75rem' }}>
              <input 
                type="color" 
                value={s.backgroundColor || '#0d0d0e'} 
                onChange={e => setStyleVal('backgroundColor', e.target.value)} 
                style={{ width: '42px', height: '42px', border: '1px solid #333', borderRadius: '8px', cursor: 'pointer', background: 'none', padding: 0 }}
              />
              <input 
                type="text" 
                value={s.background || ''} 
                onChange={e => setStyleVal('background', e.target.value)} 
                placeholder="transparent или linear-gradient..." 
                style={inputStyle}
              />
            </div>
          </div>
        </div>
      </div>
    );
  }

  // 1.5 EFFECTS TAB
  if (modalActiveTab === 'effects') {
    const s = currentLayout.styles?.[editingKey] || {};
    const setStyleVal = (key: string, val: any) => {
      updateLayout({
        ...currentLayout,
        styles: {
          ...(currentLayout.styles || {}),
          [editingKey]: { ...(currentLayout.styles?.[editingKey] || {}), [key]: val }
        }
      });
    };

    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', background: '#111', padding: '1rem', borderRadius: '12px', border: '1px solid #222' }}>
          <div style={{ fontSize: '1.5rem' }}>✨</div>
          <div>
            <h4 style={{ margin: '0 0 0.25rem 0', color: '#fff', fontSize: '0.9rem', fontWeight: '800' }}>Эффекты и Трансформации</h4>
            <p style={{ margin: 0, color: '#888', fontSize: '0.75rem' }}>Настройте визуальные фильтры, тени и размытие для выделенного блока.</p>
          </div>
        </div>
        
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
          <div>
            {labelStyle('Размытие фона (Backdrop Filter)')}
            <input type="text" value={s.backdropFilter || ''} onChange={e => setStyleVal('backdropFilter', e.target.value)} placeholder="blur(10px)" style={inputStyle} />
          </div>
          <div>
            {labelStyle('Тень блока (Box Shadow)')}
            <input type="text" value={s.boxShadow || ''} onChange={e => setStyleVal('boxShadow', e.target.value)} placeholder="0 10px 20px rgba(0,0,0,0.5)" style={inputStyle} />
          </div>
          <div>
            {labelStyle('Трансформация (Transform)')}
            <input type="text" value={s.transform || ''} onChange={e => setStyleVal('transform', e.target.value)} placeholder="scale(1.05) rotate(5deg)" style={inputStyle} />
          </div>
          <div>
            {labelStyle('Фильтр картинки (Filter)')}
            <input type="text" value={s.filter || ''} onChange={e => setStyleVal('filter', e.target.value)} placeholder="grayscale(100%) blur(2px)" style={inputStyle} />
          </div>
        </div>
      </div>
    );
  }

  // 1.6 ACTIONS TAB
  if (modalActiveTab === 'actions') {
    const l = currentLayout.links?.[editingKey] || {};
    const setLinkVal = (key: string, val: any) => {
      updateLayout({
        ...currentLayout,
        links: {
          ...(currentLayout.links || {}),
          [editingKey]: { ...(currentLayout.links?.[editingKey] || {}), [key]: val }
        }
      });
    };

    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', background: '#111', padding: '1rem', borderRadius: '12px', border: '1px solid #222' }}>
          <div style={{ fontSize: '1.5rem' }}>⚡</div>
          <div>
            <h4 style={{ margin: '0 0 0.25rem 0', color: '#fff', fontSize: '0.9rem', fontWeight: '800' }}>Интерактивность</h4>
            <p style={{ margin: 0, color: '#888', fontSize: '0.75rem' }}>Привяжите открытие модального окна или скрипт к этому элементу.</p>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '1.5rem' }}>
          <div>
            {labelStyle('Связь с модальным окном (ID окна)')}
            <input type="text" value={l.modalId || ''} onChange={e => setLinkVal('modalId', e.target.value)} placeholder="Введи ID модалки (напр. 'contact_modal')" style={inputStyle} />
            <p style={{ fontSize: '0.7rem', color: '#888', marginTop: '0.5rem' }}>Если указан ID модального окна, при клике на этот элемент будет открываться указанное окно.</p>
          </div>
          <div>
            {labelStyle('URL Ссылка (Href)')}
            <input type="text" value={l.href || ''} onChange={e => setLinkVal('href', e.target.value)} placeholder="/catalog или https://..." style={inputStyle} />
          </div>
          <div>
            {labelStyle('Свой класс для клика (Class)')}
            <input type="text" value={l.className || ''} onChange={e => setLinkVal('className', e.target.value)} placeholder="my-custom-trigger" style={inputStyle} />
          </div>
        </div>
      </div>
    );
  }

  // 2. MEDIA TAB (PHOTOS & VIDEOS)
  if (modalActiveTab === 'media') {
    let currentImg = '';
    let currentVideo = '';
    let isVideoType = false;

    const presets = [
      { url: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=800&q=80', name: 'Оборудование / Сталь' },
      { url: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=800&q=80', name: 'Автоматика / Монитор' },
      { url: 'https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122?auto=format&fit=crop&w=800&q=80', name: 'Завод / Конструкция' },
      { url: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=800&q=80', name: 'Ленты / Логистика' },
      { url: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=800&q=80', name: 'Сварка / Металл' },
      { url: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=800&q=80', name: 'Склад труб / Прокат' },
    ];

    if (isCustomBlock) {
      try {
        const customBlocks = JSON.parse(localStorage.getItem('demetra_custom_blocks') || '{}');
        const targetKey = isNestedBlock ? parentKey! : editingKey;
        const parentData = customBlocks[targetKey] || {};
        const data = isNestedBlock
          ? (parentData.childrenBlocks || []).find((c: any) => c.id === editingKey) || {}
          : parentData;
        currentImg = data.src || '';
        currentVideo = data.videoSrc || '';
        isVideoType = data.mediaType === 'video';
      } catch {}
    } else if (isGalleryItem) {
      const item = currentLayout.items?.[editingKey] || {};
      currentImg = item.src || '';
      currentVideo = item.src || '';
      isVideoType = item.type === 'video';
    } else {
      currentImg = currentLayout.images?.[`${editingKey}_img`] || '';
      currentVideo = currentLayout.videos?.[`${editingKey}_video`] || '';
      isVideoType = currentLayout.mediaTypes?.[`${editingKey}_type`] === 'video';
    }

    const updateMedia = (imgUrl: string, vidUrl: string, isVid: boolean) => {
      if (isCustomBlock) {
        try {
          const customBlocks = JSON.parse(localStorage.getItem('demetra_custom_blocks') || '{}');
          const targetKey = isNestedBlock ? parentKey! : editingKey;
          const parentData = customBlocks[targetKey] || {};
          
          if (isNestedBlock) {
            parentData.childrenBlocks = (parentData.childrenBlocks || []).map((c: any) => 
              c.id === editingKey ? { ...c, src: imgUrl, videoSrc: vidUrl, mediaType: isVid ? 'video' : 'image' } : c
            );
          } else {
            parentData.src = imgUrl;
            parentData.videoSrc = vidUrl;
            parentData.mediaType = isVid ? 'video' : 'image';
          }
          
          customBlocks[targetKey] = parentData;
          localStorage.setItem('demetra_custom_blocks', JSON.stringify(customBlocks));
          window.dispatchEvent(new Event('storage'));
        } catch {}
      } else if (isGalleryItem) {
        const item = currentLayout.items?.[editingKey] || {};
        updateLayout({
          ...currentLayout,
          items: {
            ...(currentLayout.items || {}),
            [editingKey]: { ...item, src: isVid ? vidUrl : imgUrl, type: isVid ? 'video' : 'image' }
          }
        });
      } else {
        updateLayout({
          ...currentLayout,
          images: { ...(currentLayout.images || {}), [`${editingKey}_img`]: imgUrl },
          videos: { ...(currentLayout.videos || {}), [`${editingKey}_video`]: vidUrl },
          mediaTypes: { ...(currentLayout.mediaTypes || {}), [`${editingKey}_type`]: isVid ? 'video' : 'image' }
        });
      }
    };

    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <div>
              {labelStyle('Тип фонового контента')}
              <div style={{ display: 'flex', gap: '0.75rem', marginTop: '0.25rem' }}>
                <button
                  onClick={() => updateMedia(currentImg, currentVideo, false)}
                  style={{
                    flex: 1, padding: '0.75rem', borderRadius: '10px', border: '1px solid',
                    borderColor: !isVideoType ? '#00ff41' : '#333',
                    background: !isVideoType ? 'rgba(0,255,65,0.08)' : '#111',
                    color: !isVideoType ? '#00ff41' : '#888',
                    fontWeight: '800', cursor: 'pointer'
                  }}
                >
                  🖼️ Фото / Изображение
                </button>
                <button
                  onClick={() => updateMedia(currentImg, currentVideo, true)}
                  style={{
                    flex: 1, padding: '0.75rem', borderRadius: '10px', border: '1px solid',
                    borderColor: isVideoType ? '#00ff41' : '#333',
                    background: isVideoType ? 'rgba(0,255,65,0.08)' : '#111',
                    color: isVideoType ? '#00ff41' : '#888',
                    fontWeight: '800', cursor: 'pointer'
                  }}
                >
                  🎥 Видеоролик (BG)
                </button>
              </div>
            </div>

            {!isVideoType ? (
              <div>
                {labelStyle('Ссылка на изображение (Image URL)')}
                <input 
                  type="text" value={currentImg} 
                  onChange={e => updateMedia(e.target.value, currentVideo, false)}
                  placeholder="https://... или /image.png" 
                  style={inputStyle}
                />
              </div>
            ) : (
              <div>
                {labelStyle('Ссылка на видео (YouTube / Direct mp4)')}
                <input 
                  type="text" value={currentVideo} 
                  onChange={e => updateMedia(currentImg, e.target.value, true)}
                  placeholder="https://www.youtube.com/watch?v=... или /video.mp4" 
                  style={inputStyle}
                />
              </div>
            )}

            <div>
              {labelStyle('Предпросмотр медиафайла')}
              <div style={{
                width: '100%', height: '180px', borderRadius: '14px', border: '1px solid #333',
                background: '#070708', display: 'flex', alignItems: 'center', justifyContent: 'center',
                overflow: 'hidden', marginTop: '0.4rem', position: 'relative'
              }}>
                {isVideoType ? (
                  currentVideo ? (
                    <div style={{ color: '#00ff41', fontSize: '0.85rem', fontWeight: 'bold', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem' }}>
                      <span>🎥 Видео готово к фоновому воспроизведению</span>
                      <span style={{ fontSize: '0.7rem', color: '#666' }}>{currentVideo}</span>
                    </div>
                  ) : (
                    <span style={{ color: '#555', fontSize: '0.8rem' }}>Видео не выбрано</span>
                  )
                ) : (
                  currentImg ? (
                    <img src={currentImg} alt="Preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  ) : (
                    <span style={{ color: '#555', fontSize: '0.8rem' }}>Изображение не выбрано</span>
                  )
                )}
              </div>
            </div>
          </div>

          <div>
            {labelStyle('Быстрый выбор промышленных фото (Галерея)')}
            <div style={{
              display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginTop: '0.5rem',
              maxHeight: '360px', overflowY: 'auto', paddingRight: '0.5rem'
            }}>
              {presets.map((p, i) => (
                <div
                  key={i}
                  onClick={() => updateMedia(p.url, currentVideo, isVideoType)}
                  style={{
                    borderRadius: '12px', overflow: 'hidden', border: currentImg === p.url ? '2px solid #00ff41' : '1px solid #222',
                    cursor: 'pointer', position: 'relative', height: '100px', transition: 'all 0.2s'
                  }}
                  onMouseEnter={e => e.currentTarget.style.transform = 'scale(0.97)'}
                  onMouseLeave={e => e.currentTarget.style.transform = 'none'}
                >
                  <img src={p.url} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.6 }} />
                  <div style={{
                    position: 'absolute', bottom: 0, left: 0, right: 0, background: 'rgba(0,0,0,0.7)',
                    padding: '0.4rem', fontSize: '0.65rem', color: '#fff', fontWeight: '800', textAlign: 'center'
                  }}>{p.name}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // 3. CONTENT & TRANSLATIONS TAB
  if (modalActiveTab === 'content') {
    if (isCustomBlock) {
      const targetKey = isNestedBlock ? parentKey! : editingKey;
      let data: any = {};
      try {
        const customBlocks = JSON.parse(localStorage.getItem('demetra_custom_blocks') || '{}');
        const parentData = customBlocks[targetKey] || { type: 'heading' };
        data = isNestedBlock
          ? (parentData.childrenBlocks || []).find((c: any) => c.id === editingKey) || { type: 'heading' }
          : parentData;
      } catch {}

      const updateCustomField = (fieldKey: string, val: any) => {
        try {
          const customBlocks = JSON.parse(localStorage.getItem('demetra_custom_blocks') || '{}');
          const parentData = customBlocks[targetKey] || {};
          if (isNestedBlock) {
            parentData.childrenBlocks = (parentData.childrenBlocks || []).map((c: any) => 
              c.id === editingKey ? { ...c, [fieldKey]: val } : c
            );
          } else {
            parentData[fieldKey] = val;
          }
          customBlocks[targetKey] = parentData;
          localStorage.setItem('demetra_custom_blocks', JSON.stringify(customBlocks));
          window.dispatchEvent(new Event('storage'));
        } catch {}
      };

      const selectType = (t: string) => {
        try {
          const customBlocks = JSON.parse(localStorage.getItem('demetra_custom_blocks') || '{}');
          const parentData = customBlocks[targetKey] || {};
          if (isNestedBlock) {
            parentData.childrenBlocks = (parentData.childrenBlocks || []).map((c: any) => 
              c.id === editingKey ? { ...c, type: t } : c
            );
          } else {
            parentData.type = t;
          }
          customBlocks[targetKey] = parentData;
          localStorage.setItem('demetra_custom_blocks', JSON.stringify(customBlocks));
          window.dispatchEvent(new Event('storage'));
        } catch {}
      };

      const customInp = (label: string, fieldName: string, multiline = false) => {
        const keyWithLang = `${fieldName}_${activeLang}`;
        const val = data[keyWithLang] || data[fieldName] || '';
        return (
          <div style={{ display: 'grid', gap: '0.4rem' }}>
            {labelStyle(`${label} (${activeLang.toUpperCase()})`)}
            {multiline ? (
              <textarea 
                value={val} 
                onChange={e => updateCustomField(keyWithLang, e.target.value)} 
                style={{ ...inputStyle, minHeight: '90px', resize: 'vertical' }}
              />
            ) : (
              <input 
                type="text" 
                value={val} 
                onChange={e => updateCustomField(keyWithLang, e.target.value)} 
                style={inputStyle}
              />
            )}
          </div>
        );
      };

      return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ display: 'flex', gap: '0.5rem', background: '#111', padding: '0.25rem', borderRadius: '8px', border: '1px solid #222' }}>
              {(['ru', 'kk', 'en'] as const).map(l => (
                <button
                  key={l}
                  onClick={() => setActiveLang(l)}
                  style={{
                    padding: '0.4rem 1rem', borderRadius: '6px', border: 'none',
                    background: activeLang === l ? '#00ff41' : 'transparent',
                    color: activeLang === l ? '#000' : '#888',
                    fontWeight: '900', fontSize: '0.75rem', cursor: 'pointer', transition: '0.2s'
                  }}
                >
                  {l.toUpperCase()}
                </button>
              ))}
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <span style={{ fontSize: '0.75rem', color: '#666', fontWeight: 'bold' }}>ТИП БЛОКА:</span>
              <select
                value={data.type || 'heading'}
                onChange={e => selectType(e.target.value)}
                style={{ ...inputStyle, width: '200px', padding: '0.5rem 1rem' }}
              >
                <option value="heading">Заголовок страницы</option>
                <option value="text">Текст (Простой)</option>
                <option value="card">Карточка с картинкой</option>
                <option value="two_col">Две колонки</option>
                <option value="image_text">Фото + Текст</option>
                <option value="cta_banner">Промо-баннер (CTA)</option>
                <option value="divider">Разделитель</option>
                <option value="container">Контейнер (Группировка/Сетка)</option>
              </select>
            </div>
          </div>

          <div style={{ height: '1px', background: '#222' }} />

          {(data.type === 'heading' || data.type === 'cta_banner' || data.type === 'image_text') && customInp('Надпись над заголовком', 'subheading')}
          {(data.type !== 'text' && data.type !== 'divider' && data.type !== 'button' && data.type !== 'container') && customInp('Главный Заголовок', 'heading')}
          {(data.type !== 'divider' && data.type !== 'button' && data.type !== 'container') && customInp('Описание / Основной текст', 'body', true)}
          
          {data.type === 'two_col' && (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
              {customInp('Левая колонка', 'col1', true)}
              {customInp('Правая колонка', 'col2', true)}
            </div>
          )}

          {(data.type === 'button' || data.type === 'card' || data.type === 'cta_banner' || data.type === 'image_text') && (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
              {customInp('Текст кнопки / ссылки', 'label')}
              <div style={{ display: 'grid', gap: '0.4rem' }}>
                {labelStyle('Адрес ссылки / URL')}
                <input 
                  type="text" value={data.href || ''} 
                  onChange={e => updateCustomField('href', e.target.value)} 
                  placeholder="/catalog"
                  style={inputStyle}
                />
              </div>
            </div>
          )}

          {data.type === 'container' && (
            <div style={{ display: 'grid', gap: '1.5rem', background: '#141416', padding: '1.5rem', borderRadius: '14px', border: '1px solid #222' }}>
              <h3 style={{ fontSize: '0.9rem', color: '#00ff41', margin: 0, fontWeight: '900' }}>⚙️ НАСТРОЙКИ КОНТЕЙНЕРА</h3>
              
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                <div>
                  {labelStyle('Режим отображения (Layout)')}
                  <select
                    value={data.displayType || 'grid'}
                    onChange={e => updateCustomField('displayType', e.target.value)}
                    style={inputStyle}
                  >
                    <option value="grid">Сетка CSS Grid (Свободное расположение)</option>
                    <option value="flex">Flexbox (В ряд / В колонку)</option>
                  </select>
                </div>

                {data.displayType === 'flex' ? (
                  <div>
                    {labelStyle('Направление Flexbox')}
                    <select
                      value={data.flexDirection || 'column'}
                      onChange={e => updateCustomField('flexDirection', e.target.value)}
                      style={inputStyle}
                    >
                      <option value="column">В колонку (Вертикально)</option>
                      <option value="row">В ряд (Горизонтально)</option>
                    </select>
                  </div>
                ) : (
                  <div>
                    {labelStyle('Количество колонок сетки')}
                    <select
                      value={data.cols || 12}
                      onChange={e => updateCustomField('cols', parseInt(e.target.value) || 12)}
                      style={inputStyle}
                    >
                      <option value={12}>12 колонок (Гибкая Figma-сетка)</option>
                      <option value={4}>4 колонки</option>
                      <option value={3}>3 колонки</option>
                      <option value={2}>2 колонки (Рядом)</option>
                      <option value={1}>1 колонка (Вертикально)</option>
                    </select>
                  </div>
                )}
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                <div>
                  {labelStyle('Расстояние между элементами (Gap)')}
                  <select
                    value={data.gap || '2rem'}
                    onChange={e => updateCustomField('gap', e.target.value)}
                    style={inputStyle}
                  >
                    <option value="0px">Без отступов (0px)</option>
                    <option value="0.5rem">Очень узкий (8px)</option>
                    <option value="1rem">Узкий (16px)</option>
                    <option value="1.5rem">Средний (24px)</option>
                    <option value="2rem">Стандартный (32px)</option>
                    <option value="3rem">Широкий (48px)</option>
                  </select>
                </div>

                <div>
                  {labelStyle('Выравнивание по вертикали (Align)')}
                  <select
                    value={data.alignItems || 'stretch'}
                    onChange={e => updateCustomField('alignItems', e.target.value)}
                    style={inputStyle}
                  >
                    <option value="stretch">Растянуть (Stretch)</option>
                    <option value="center">По центру (Center)</option>
                    <option value="flex-start">По верху (Start)</option>
                    <option value="flex-end">По низу (End)</option>
                  </select>
                </div>
              </div>
            </div>
          )}
        </div>
      );
    }

    if (isGalleryItem) {
      const item = currentLayout.items?.[editingKey] || {};
      const updateItemLang = (l: string, fieldKey: string, val: string) => {
        updateLayout({
          ...currentLayout,
          items: {
            ...(currentLayout.items || {}),
            [editingKey]: {
              ...item,
              [l]: {
                ...(item[l] || {}),
                [fieldKey]: val
              }
            }
          }
        });
      };

      return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div style={{ display: 'flex', gap: '0.5rem', background: '#111', padding: '0.25rem', borderRadius: '8px', border: '1px solid #222', width: 'fit-content' }}>
            {(['ru', 'kk', 'en'] as const).map(l => (
              <button
                key={l}
                onClick={() => setActiveLang(l)}
                style={{
                  padding: '0.4rem 1rem', borderRadius: '6px', border: 'none',
                  background: activeLang === l ? '#00ff41' : 'transparent',
                  color: activeLang === l ? '#000' : '#888',
                  fontWeight: '900', fontSize: '0.75rem', cursor: 'pointer', transition: '0.2s'
                }}
              >
                {l.toUpperCase()}
              </button>
            ))}
          </div>

          <div style={{ display: 'grid', gap: '1.25rem' }}>
            <div style={{ display: 'grid', gap: '0.4rem' }}>
              {labelStyle(`Название медиафайла (${activeLang.toUpperCase()})`)}
              <input 
                type="text" 
                value={item[activeLang]?.title || ''} 
                onChange={e => updateItemLang(activeLang, 'title', e.target.value)} 
                placeholder="Введите название..."
                style={inputStyle}
              />
            </div>
            <div style={{ display: 'grid', gap: '0.4rem' }}>
              {labelStyle(`Описание медиафайла (${activeLang.toUpperCase()})`)}
              <textarea 
                value={item[activeLang]?.desc || ''} 
                onChange={e => updateItemLang(activeLang, 'desc', e.target.value)} 
                placeholder="Введите подробное описание..."
                style={{ ...inputStyle, minHeight: '120px', resize: 'vertical' }}
              />
            </div>
          </div>
        </div>
      );
    }

    const relevantKeys = Object.keys(allTranslations.ru).filter(key => {
      if (editingKey === 'hero') return key.startsWith('hero_') || key === 'btn_catalog' || key === 'btn_services';
      if (editingKey === 'catalog') return key.startsWith('cat_') || key === 'btn_details';
      if (editingKey === 'services') return key.startsWith('srv_');
      if (editingKey === 'partner' || editingKey === 'partnership') return key.startsWith('partner_') || key === 'nav_partner';
      if (editingKey === 'reviews') return key.startsWith('reviews_') || key.startsWith('review_');
      if (editingKey === 'contact') return key.startsWith('contact_');
      if (editingKey === 'faq') return key.startsWith('faq_');
      if (editingKey === 'pay') return key.startsWith('pay_');
      return key.toLowerCase().includes(editingKey.toLowerCase());
    });

    const displayKeys = relevantKeys.length > 0 ? relevantKeys : Object.keys(allTranslations.ru).slice(0, 8);

    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', gap: '0.5rem', background: '#111', padding: '0.25rem', borderRadius: '8px', border: '1px solid #222' }}>
            {(['ru', 'kk', 'en'] as const).map(l => (
              <button
                key={l}
                onClick={() => setActiveLang(l)}
                style={{
                  padding: '0.4rem 1rem', borderRadius: '6px', border: 'none',
                  background: activeLang === l ? '#00ff41' : 'transparent',
                  color: activeLang === l ? '#000' : '#888',
                  fontWeight: '900', fontSize: '0.75rem', cursor: 'pointer', transition: '0.2s'
                }}
              >
                {l.toUpperCase()}
              </button>
            ))}
          </div>
          <span style={{ fontSize: '0.75rem', color: '#666', fontWeight: 'bold' }}>
            Найдено полей: {displayKeys.length}
          </span>
        </div>

        <div style={{ height: '1px', background: '#222' }} />

        <div style={{ display: 'grid', gap: '1.5rem', maxHeight: '380px', overflowY: 'auto', paddingRight: '0.5rem' }}>
          {displayKeys.map(k => {
            const val = allTranslations[activeLang]?.[k] || '';
            const isMultiline = val.length > 60 || k.includes('desc') || k.includes('subtitle') || k.includes('review_');
            return (
              <div key={k} style={{ display: 'grid', gap: '0.4rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  {labelStyle(k.replace(/_/g, ' '))}
                  <span style={{ fontSize: '0.6rem', color: '#555', fontFamily: 'monospace' }}>KEY: {k}</span>
                </div>
                {isMultiline ? (
                  <textarea
                    value={val}
                    onChange={e => updateTranslation(activeLang, k, e.target.value)}
                    style={{ ...inputStyle, minHeight: '80px', resize: 'vertical' }}
                  />
                ) : (
                  <input
                    type="text"
                    value={val}
                    onChange={e => updateTranslation(activeLang, k, e.target.value)}
                    style={inputStyle}
                  />
                )}
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  return <div style={{ color: '#888' }}>Нет доступных настроек для этой вкладки.</div>;
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

function PagesManager({ pages, setPages, pageLayouts, setPageLayouts, t, lang }: any) {
  const [newPageNameRu, setNewPageNameRu] = useState('');
  const [newPageNameKk, setNewPageNameKk] = useState('');
  const [newPageNameEn, setNewPageNameEn] = useState('');
  const [newPagePath, setNewPagePath] = useState('');
  const [editingPageId, setEditingPageId] = useState<string | null>(null);
  
  const [editNameRu, setEditNameRu] = useState('');
  const [editNameKk, setEditNameKk] = useState('');
  const [editNameEn, setEditNameEn] = useState('');
  const [editPath, setEditPath] = useState('');

  const handleCreatePage = () => {
    if (!newPageNameRu.trim() || !newPagePath.trim()) {
      alert('Пожалуйста, заполните как минимум русское название страницы и путь.');
      return;
    }
    
    // Validate path starts with /
    let path = newPagePath.trim();
    if (!path.startsWith('/')) {
      path = '/' + path;
    }
    
    // Check if path or id already exists
    const slug = path.replace('/', '').toLowerCase() || 'home';
    if (pages.some((p: any) => p.id === slug || p.path === path)) {
      alert('Страница с таким путем или идентификатором уже существует.');
      return;
    }
    
    const newPage = {
      id: slug,
      path: path,
      name: {
        ru: newPageNameRu.trim(),
        kk: newPageNameKk.trim() || newPageNameRu.trim(),
        en: newPageNameEn.trim() || newPageNameRu.trim()
      }
    };
    
    const updated = [...pages, newPage];
    setPages(updated);
    localStorage.setItem('demetra_pages_list', JSON.stringify(updated));
    
    // Create default layout for this new page
    const newLayout = { order: [], hidden: [], styles: {}, images: {} };
    setPageLayouts((prev: any) => ({ ...prev, [slug]: newLayout }));
    localStorage.setItem(`demetra_${slug}_layout`, JSON.stringify(newLayout));
    
    // Dispatch events to reload
    window.dispatchEvent(new Event('storage'));
    
    // Reset fields
    setNewPageNameRu('');
    setNewPageNameKk('');
    setNewPageNameEn('');
    setNewPagePath('');
  };

  const handleStartEdit = (p: any) => {
    setEditingPageId(p.id);
    setEditNameRu(p.name.ru);
    setEditNameKk(p.name.kk);
    setEditNameEn(p.name.en);
    setEditPath(p.path);
  };

  const handleSaveEdit = (pageId: string) => {
    const updated = pages.map((p: any) => {
      if (p.id === pageId) {
        return {
          ...p,
          path: p.isSystem ? p.path : editPath,
          name: {
            ru: editNameRu,
            kk: editNameKk,
            en: editNameEn
          }
        };
      }
      return p;
    });
    
    setPages(updated);
    localStorage.setItem('demetra_pages_list', JSON.stringify(updated));
    window.dispatchEvent(new Event('storage'));
    setEditingPageId(null);
  };

  const handleDeletePage = (p: any) => {
    if (p.isSystem) return;
    if (window.confirm(`Вы уверены, что хотите удалить страницу "${p.name.ru}"? Все блоки на этой странице будут безвозвратно удалены.`)) {
      const updated = pages.filter((item: any) => item.id !== p.id);
      setPages(updated);
      localStorage.setItem('demetra_pages_list', JSON.stringify(updated));
      
      // Clean up layout storage
      localStorage.removeItem(`demetra_${p.id}_layout`);
      setPageLayouts((prev: any) => {
        const next = { ...prev };
        delete next[p.id];
        return next;
      });
      
      window.dispatchEvent(new Event('storage'));
    }
  };

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '3rem' }}>
      {/* Create Page Form */}
      <div style={{ background: '#0a0a0a', padding: '3rem', borderRadius: '32px', border: '1px solid #222', display: 'flex', flexDirection: 'column', gap: '2rem' }}>
        <h3 style={{ fontWeight: '900', color: '#00ff41', letterSpacing: '0.1em', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <PlusCircle size={22} /> СОЗДАТЬ СТРАНИЦУ
        </h3>
        
        <div style={{ display: 'grid', gap: '1.25rem' }}>
          <div style={{ display: 'grid', gap: '0.5rem' }}>
            <label style={{ fontSize: '0.7rem', color: '#888', fontWeight: '900' }}>НАЗВАНИЕ (RU)</label>
            <input 
              value={newPageNameRu} 
              onChange={(e) => {
                setNewPageNameRu(e.target.value);
                // Auto generate path if empty
                if (!newPagePath) {
                  const slug = e.target.value.toLowerCase()
                    .replace(/[^a-z0-9\s-]/g, '')
                    .trim()
                    .replace(/\s+/g, '-');
                  setNewPagePath('/' + slug);
                }
              }} 
              placeholder="Контакты"
              style={{ background: '#111', border: '1px solid #222', padding: '1.25rem', borderRadius: '12px', color: '#fff', fontSize: '1rem', outline: 'none' }} 
            />
          </div>

          <div style={{ display: 'grid', gap: '0.5rem' }}>
            <label style={{ fontSize: '0.7rem', color: '#888', fontWeight: '900' }}>НАЗВАНИЕ (KK)</label>
            <input 
              value={newPageNameKk} 
              onChange={(e) => setNewPageNameKk(e.target.value)} 
              placeholder="Байланыс"
              style={{ background: '#111', border: '1px solid #222', padding: '1.25rem', borderRadius: '12px', color: '#fff', fontSize: '1rem', outline: 'none' }} 
            />
          </div>

          <div style={{ display: 'grid', gap: '0.5rem' }}>
            <label style={{ fontSize: '0.7rem', color: '#888', fontWeight: '900' }}>НАЗВАНИЕ (EN)</label>
            <input 
              value={newPageNameEn} 
              onChange={(e) => setNewPageNameEn(e.target.value)} 
              placeholder="Contacts"
              style={{ background: '#111', border: '1px solid #222', padding: '1.25rem', borderRadius: '12px', color: '#fff', fontSize: '1rem', outline: 'none' }} 
            />
          </div>

          <div style={{ display: 'grid', gap: '0.5rem' }}>
            <label style={{ fontSize: '0.7rem', color: '#888', fontWeight: '900' }}>URL ПУТЬ (должен начинаться с /)</label>
            <input 
              value={newPagePath} 
              onChange={(e) => setNewPagePath(e.target.value)} 
              placeholder="/contacts"
              style={{ background: '#111', border: '1px solid #222', padding: '1.25rem', borderRadius: '12px', color: '#fff', fontSize: '1rem', outline: 'none' }} 
            />
          </div>
        </div>

        <button 
          onClick={handleCreatePage}
          style={{ background: '#00ff41', color: '#000', border: 'none', padding: '1.25rem', borderRadius: '12px', fontWeight: '900', cursor: 'pointer', transition: '0.2s', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}
        >
          <Plus size={20} /> ДОБАВИТЬ СТРАНИЦУ
        </button>
      </div>

      {/* Pages List */}
      <div style={{ background: '#0a0a0a', padding: '3rem', borderRadius: '32px', border: '1px solid #222', display: 'flex', flexDirection: 'column', gap: '2rem' }}>
        <h3 style={{ fontWeight: '900', color: '#fff', letterSpacing: '0.1em' }}>СПИСОК СТРАНИЦ</h3>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', maxHeight: '550px', overflowY: 'auto', paddingRight: '0.5rem' }}>
          {pages.map((p: any) => {
            const isEditing = editingPageId === p.id;
            
            return (
              <div key={p.id} style={{ background: '#111', border: '1px solid #222', borderRadius: '16px', padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {isEditing ? (
                  <div style={{ display: 'grid', gap: '1rem' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                      <div>
                        <label style={{ fontSize: '0.6rem', color: '#666', fontWeight: '900' }}>ИМЯ (RU)</label>
                        <input value={editNameRu} onChange={e => setEditNameRu(e.target.value)} style={{ background: '#000', border: '1px solid #333', padding: '0.5rem', borderRadius: '6px', color: '#fff', width: '100%' }} />
                      </div>
                      <div>
                        <label style={{ fontSize: '0.6rem', color: '#666', fontWeight: '900' }}>ИМЯ (KK)</label>
                        <input value={editNameKk} onChange={e => setEditNameKk(e.target.value)} style={{ background: '#000', border: '1px solid #333', padding: '0.5rem', borderRadius: '6px', color: '#fff', width: '100%' }} />
                      </div>
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                      <div>
                        <label style={{ fontSize: '0.6rem', color: '#666', fontWeight: '900' }}>ИМЯ (EN)</label>
                        <input value={editNameEn} onChange={e => setEditNameEn(e.target.value)} style={{ background: '#000', border: '1px solid #333', padding: '0.5rem', borderRadius: '6px', color: '#fff', width: '100%' }} />
                      </div>
                      <div>
                        <label style={{ fontSize: '0.6rem', color: '#666', fontWeight: '900' }}>ПУТЬ</label>
                        <input disabled={p.isSystem} value={editPath} onChange={e => setEditPath(e.target.value)} style={{ background: '#000', border: '1px solid #333', padding: '0.5rem', borderRadius: '6px', color: '#fff', width: '100%', opacity: p.isSystem ? 0.5 : 1 }} />
                      </div>
                    </div>
                    <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem' }}>
                      <button onClick={() => handleSaveEdit(p.id)} style={{ background: '#00ff41', color: '#000', border: 'none', padding: '0.5rem 1rem', borderRadius: '6px', fontWeight: '800', cursor: 'pointer', fontSize: '0.8rem' }}>Сохранить</button>
                      <button onClick={() => setEditingPageId(null)} style={{ background: '#222', color: '#fff', border: 'none', padding: '0.5rem 1rem', borderRadius: '6px', fontWeight: '800', cursor: 'pointer', fontSize: '0.8rem' }}>Отмена</button>
                    </div>
                  </div>
                ) : (
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <span style={{ fontSize: '1rem', fontWeight: '900', color: '#fff' }}>{p.name[lang as 'ru' | 'kk' | 'en'] || p.name.ru}</span>
                        {p.isSystem && (
                          <span style={{ fontSize: '0.6rem', background: '#222', color: '#888', padding: '0.2rem 0.4rem', borderRadius: '4px', fontWeight: '700' }}>SYSTEM</span>
                        )}
                      </div>
                      <div style={{ fontSize: '0.8rem', color: '#00ff41', fontWeight: '700', marginTop: '0.25rem' }}>{p.path}</div>
                    </div>
                    
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      <button 
                        onClick={() => handleStartEdit(p)}
                        style={{ background: '#222', border: 'none', color: '#aaa', padding: '0.5rem', borderRadius: '8px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                        title="Редактировать название / путь"
                      >
                        <Edit3 size={16} />
                      </button>
                      {!p.isSystem && (
                        <button 
                          onClick={() => handleDeletePage(p)}
                          style={{ background: 'rgba(255,0,0,0.1)', border: 'none', color: '#ff4b4b', padding: '0.5rem', borderRadius: '8px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                          title="Удалить страницу"
                        >
                          <Trash2 size={16} />
                        </button>
                      )}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

