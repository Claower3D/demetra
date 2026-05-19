import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
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
  CheckCircle2
} from 'lucide-react';
import { useLang } from '../LangContext';
import { useTheme } from '../ThemeContext';
import { translations as defaultTranslations } from '../i18n';

export default function Admin() {
  const { lang } = useLang();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [allTranslations, setAllTranslations] = useState(() => {
    const saved = localStorage.getItem('demetra_translations');
    return saved ? JSON.parse(saved) : defaultTranslations;
  });
  const [showSaveToast, setShowSaveToast] = useState(false);

  const tabs = [
    { id: 'dashboard', icon: <BarChart3 size={20} />, label: 'Dashboard' },
    { id: 'content', icon: <LayoutDashboard size={20} />, label: 'Page Content' },
    { id: 'products', icon: <Package size={20} />, label: 'Products' },
    { id: 'services', icon: <Truck size={20} />, label: 'Services' },
    { id: 'settings', icon: <Settings size={20} />, label: 'Global Settings' },
  ];

  const handleSave = () => {
    localStorage.setItem('demetra_translations', JSON.stringify(allTranslations));
    setShowSaveToast(true);
    setTimeout(() => setShowSaveToast(false), 3000);
    // In a real app, this would send to a backend API
  };

  const updateTranslation = (langKey: string, itemKey: string, newValue: string) => {
    setAllTranslations((prev: any) => ({
      ...prev,
      [langKey]: {
        ...prev[langKey],
        [itemKey]: newValue
      }
    }));
  };

  return (
    <div className="admin-layout" style={{ display: 'flex', minHeight: '100vh', background: 'var(--background)', color: 'var(--foreground)' }}>
      {/* Toast Notification */}
      <AnimatePresence>
        {showSaveToast && (
          <motion.div 
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            style={{ position: 'fixed', bottom: '2rem', right: '2rem', background: 'var(--primary)', color: '#000', padding: '1rem 2rem', borderRadius: '12px', display: 'flex', alignItems: 'center', gap: '0.75rem', fontWeight: '900', zIndex: 10000, boxShadow: '0 10px 30px var(--primary-glow)' }}
          >
            <CheckCircle2 size={20} /> CHANGES SAVED LOCALLY
          </motion.div>
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <aside style={{ width: '280px', background: 'var(--surface)', borderRight: '1px solid var(--border)', padding: '2rem 1.5rem', display: 'flex', flexDirection: 'column', gap: '2rem', position: 'fixed', height: '100vh', zIndex: 1000 }}>
        <div className="logo" style={{ fontSize: '1.2rem' }}>
          DEMETRA<span style={{ color: 'var(--primary)' }}>SYSTEM</span>
          <div style={{ fontSize: '0.6rem', color: 'var(--primary)', letterSpacing: '0.2em', marginTop: '0.25rem' }}>ADMIN PANEL V1.1</div>
        </div>

        <nav style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '1rem',
                padding: '1rem',
                borderRadius: '8px',
                border: 'none',
                background: activeTab === tab.id ? 'rgba(0, 255, 65, 0.1)' : 'transparent',
                color: activeTab === tab.id ? 'var(--primary)' : 'var(--text-muted)',
                cursor: 'pointer',
                transition: '0.3s',
                textAlign: 'left',
                fontWeight: '700',
                fontSize: '0.9rem'
              }}
            >
              {tab.icon}
              {tab.label}
              {activeTab === tab.id && <motion.div layoutId="active-tab" style={{ marginLeft: 'auto' }}><ChevronRight size={16} /></motion.div>}
            </button>
          ))}
        </nav>

        <div style={{ marginTop: 'auto', padding: '1.5rem', background: 'rgba(0,255,65,0.05)', borderRadius: '12px', border: '1px solid var(--primary-glow)' }}>
          <div style={{ fontSize: '0.7rem', color: 'var(--primary)', fontWeight: '800', marginBottom: '0.5rem' }}>SYSTEM STATUS</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.8rem' }}>
            <div style={{ width: '8px', height: '8px', background: '#00ff41', borderRadius: '50%', boxShadow: '0 0 10px #00ff41' }}></div>
            LIVE & PROTECTED
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main style={{ marginLeft: '280px', flex: 1, padding: '4rem' }}>
        <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4rem' }}>
          <div>
            <h1 style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>{activeTab.toUpperCase()}</h1>
            <p style={{ color: 'var(--text-muted)' }}>Real-time management of the Demetra-2005 industrial platform.</p>
          </div>
          <div style={{ display: 'flex', gap: '1rem' }}>
             <button className="btn-outline" onClick={() => setAllTranslations(defaultTranslations)} style={{ padding: '1rem 2rem' }}>
               RESET DEFAULTS
             </button>
             <button className="btn-primary" onClick={handleSave} style={{ padding: '1rem 2rem' }}>
               <Save size={18} /> SAVE CHANGES
             </button>
          </div>
        </header>

        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            {activeTab === 'dashboard' && <DashboardOverview />}
            {activeTab === 'content' && <ContentEditor allTranslations={allTranslations} updateTranslation={updateTranslation} />}
            {activeTab === 'products' && <ProductManager />}
            {activeTab === 'services' && <ServicesManager />}
            {activeTab === 'settings' && <GlobalSettings />}
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  );
}

function DashboardOverview() {
  return (
    <div style={{ display: 'grid', gap: '3rem' }}>
      <div className="grid-3" style={{ gap: '2rem' }}>
        {[
          { label: 'Total Products', value: '24', icon: <Package />, color: '#00ff41' },
          { label: 'Active Services', value: '12', icon: <Truck />, color: '#0066ff' },
          { label: 'Form Inquiries', value: '158', icon: <MessageSquare />, color: '#ff00ff' },
        ].map((stat, i) => (
          <div key={i} className="industrial-card" style={{ padding: '2rem', display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
            <div style={{ padding: '1rem', background: 'rgba(255,255,255,0.05)', borderRadius: '12px', color: stat.color }}>
              {stat.icon}
            </div>
            <div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: '700' }}>{stat.label}</div>
              <div style={{ fontSize: '2rem', fontWeight: '900' }}>{stat.value}</div>
            </div>
          </div>
        ))}
      </div>
      
      <div className="grid-2" style={{ gap: '2rem' }}>
        <div className="industrial-card" style={{ padding: '3rem' }}>
          <h3 style={{ marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}><Activity size={20} color="var(--primary)" /> RECENT LOGS</h3>
          <div style={{ display: 'grid', gap: '1rem' }}>
            {[
              { text: 'Updated "Conveyor Roller" translation in KK', time: '12m ago' },
              { text: 'Added 2 new items to Catalog', time: '1h ago' },
              { text: 'Changed primary theme to Toxic Green', time: '3h ago' },
              { text: 'System backup created successfully', time: '5h ago' }
            ].map((log, i) => (
              <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '1rem', background: 'rgba(255,255,255,0.02)', borderRadius: '8px', border: '1px solid var(--border)' }}>
                <span style={{ fontSize: '0.9rem' }}>{log.text}</span>
                <span style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>{log.time}</span>
              </div>
            ))}
          </div>
        </div>
        
        <div className="industrial-card" style={{ padding: '3rem' }}>
          <h3 style={{ marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}><Globe size={20} color="var(--primary)" /> LOCALIZATION STATUS</h3>
          <div style={{ display: 'grid', gap: '1.5rem' }}>
            {['RU', 'KK', 'EN'].map(lang => (
              <div key={lang}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', fontSize: '0.8rem', fontWeight: '800' }}>
                  <span>{lang} TRANSLATION</span>
                  <span style={{ color: 'var(--primary)' }}>{lang === 'RU' ? '100%' : lang === 'KK' ? '92%' : '88%'}</span>
                </div>
                <div style={{ width: '100%', height: '4px', background: 'rgba(255,255,255,0.05)', borderRadius: '2px' }}>
                  <div style={{ width: lang === 'RU' ? '100%' : lang === 'KK' ? '92%' : '88%', height: '100%', background: 'var(--primary)', boxShadow: '0 0 10px var(--primary-glow)' }}></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function ContentEditor({ allTranslations, updateTranslation }: any) {
  const [activeLang, setActiveLang] = useState<'ru' | 'kk' | 'en'>('ru');
  const [search, setSearch] = useState('');
  
  const currentTranslations = allTranslations[activeLang];

  return (
    <div className="industrial-card" style={{ padding: '3rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '3rem', flexWrap: 'wrap', gap: '2rem' }}>
        <div style={{ display: 'flex', gap: '0.5rem', background: 'rgba(255,255,255,0.03)', padding: '0.5rem', borderRadius: '12px', border: '1px solid var(--border)' }}>
          {['ru', 'kk', 'en'].map(l => (
            <button 
              key={l} 
              onClick={() => setActiveLang(l as any)}
              style={{ 
                padding: '0.75rem 1.5rem', 
                borderRadius: '8px', 
                border: 'none', 
                background: activeLang === l ? 'var(--primary)' : 'transparent', 
                color: activeLang === l ? '#000' : 'var(--text-muted)', 
                fontSize: '0.7rem', 
                fontWeight: '900',
                cursor: 'pointer',
                transition: '0.3s',
                textTransform: 'uppercase'
              }}
            >
              {l}
            </button>
          ))}
        </div>
        
        <div style={{ position: 'relative', flex: 1, maxWidth: '400px' }}>
          <Search size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', opacity: 0.3 }} />
          <input 
            type="text" 
            placeholder="Search keys..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{ width: '100%', background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border)', padding: '1rem 1rem 1rem 3rem', borderRadius: '8px', color: '#fff' }}
          />
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(400px, 1fr))', gap: '2.5rem' }}>
        {Object.entries(currentTranslations).filter(([key]) => key.toLowerCase().includes(search.toLowerCase())).map(([key, val]: any) => (
          <div key={key} style={{ display: 'grid', gap: '0.75rem', padding: '1.5rem', background: 'rgba(255,255,255,0.02)', borderRadius: '12px', border: '1px solid var(--border)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <label style={{ fontSize: '0.65rem', fontWeight: '800', color: 'var(--primary)', letterSpacing: '0.15em' }}>{key.toUpperCase()}</label>
              <button style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}><Zap size={14} /></button>
            </div>
            <textarea 
              value={val} 
              onChange={(e) => updateTranslation(activeLang, key, e.target.value)}
              style={{ background: 'rgba(0,0,0,0.2)', border: '1px solid rgba(255,255,255,0.05)', padding: '1rem', borderRadius: '6px', color: '#fff', fontSize: '0.9rem', minHeight: '80px', width: '100%', resize: 'vertical', lineHeight: '1.5' }}
            />
          </div>
        ))}
      </div>
    </div>
  );
}

function ProductManager() {
  return (
    <div style={{ display: 'grid', gap: '2rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Showing 24 industrial assets</div>
        <button className="btn-primary" style={{ padding: '1rem 2rem', gap: '0.5rem' }}>
          <Plus size={18} /> ADD NEW PRODUCT
        </button>
      </div>
      
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '2rem' }}>
        {[1, 2, 3, 4, 5, 6].map(i => (
          <div key={i} className="industrial-card" style={{ padding: '0', overflow: 'hidden' }}>
            <div style={{ height: '200px', background: 'rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
               <ImageIcon size={48} style={{ opacity: 0.1 }} />
               <div style={{ position: 'absolute', top: '1rem', right: '1rem', background: 'rgba(0,255,65,0.1)', color: 'var(--primary)', padding: '0.25rem 0.75rem', borderRadius: '4px', fontSize: '0.6rem', fontWeight: '900' }}>ACTIVE</div>
            </div>
            <div style={{ padding: '1.5rem' }}>
              <div style={{ fontSize: '0.7rem', color: 'var(--primary)', fontWeight: '800', marginBottom: '0.5rem', letterSpacing: '0.1em' }}>CONVEYOR COMPONENTS</div>
              <h4 style={{ marginBottom: '1.5rem', fontSize: '1.2rem' }}>Heavy-Duty Roller V{i}</h4>
              <div style={{ display: 'flex', gap: '0.75rem' }}>
                <button style={{ flex: 1, padding: '0.75rem', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border)', borderRadius: '6px', cursor: 'pointer', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', fontWeight: '700', fontSize: '0.8rem' }}>
                  <Edit3 size={14} /> EDIT
                </button>
                <button style={{ padding: '0.75rem', background: 'rgba(255,75,75,0.05)', border: '1px solid rgba(255,75,75,0.1)', borderRadius: '6px', cursor: 'pointer', color: '#ff4b4b' }}>
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function ServicesManager() {
  return (
    <div className="industrial-card" style={{ padding: '3rem' }}>
       <div style={{ textAlign: 'center', padding: '4rem 0' }}>
         <Truck size={64} color="var(--primary)" style={{ opacity: 0.2, marginBottom: '2rem' }} />
         <h2 style={{ marginBottom: '1rem' }}>SERVICES CONFIGURATOR</h2>
         <p style={{ color: 'var(--text-muted)', maxWidth: '500px', margin: '0 auto' }}>Manage your engineering competencies, service descriptions, and technical specifications provided to your clients.</p>
         <button className="btn-primary" style={{ marginTop: '3rem', padding: '1.2rem 3rem' }}>+ DEFINE NEW SERVICE</button>
       </div>
    </div>
  );
}

function GlobalSettings() {
  return (
    <div className="industrial-card" style={{ padding: '3rem' }}>
      <div style={{ display: 'grid', gap: '4rem' }}>
        <div style={{ display: 'grid', gap: '2rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <ShieldCheck size={24} color="var(--primary)" />
            <h3 style={{ fontSize: '1.4rem' }}>SITE IDENTITY & ACCESS</h3>
          </div>
          <div className="grid-2" style={{ gap: '2rem' }}>
            <div style={{ display: 'grid', gap: '0.75rem' }}>
              <label style={{ fontSize: '0.7rem', color: 'var(--primary)', fontWeight: '800' }}>PLATFORM NAME</label>
              <input type="text" defaultValue="Деметра-2005" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border)', padding: '1.2rem', borderRadius: '8px', color: '#fff', fontSize: '1rem' }} />
            </div>
            <div style={{ display: 'grid', gap: '0.75rem' }}>
              <label style={{ fontSize: '0.7rem', color: 'var(--primary)', fontWeight: '800' }}>ADMIN EMAIL</label>
              <input type="email" defaultValue="info@demetra2005.kz" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border)', padding: '1.2rem', borderRadius: '8px', color: '#fff', fontSize: '1rem' }} />
            </div>
          </div>
        </div>

        <div style={{ display: 'grid', gap: '2rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <Settings size={24} color="var(--primary)" />
            <h3 style={{ fontSize: '1.4rem' }}>SYSTEM PREFERENCES</h3>
          </div>
          <div className="grid-3" style={{ gap: '2rem' }}>
            {[
              { label: 'Auto-Backup', desc: 'Every 24 hours', state: true },
              { label: 'Cloud Sync', desc: 'Persist changes', state: true },
              { label: 'Maintenance', desc: 'Global status', state: false }
            ].map((pref, i) => (
              <div key={i} style={{ padding: '2rem', background: 'rgba(255,255,255,0.02)', border: '1px solid var(--border)', borderRadius: '16px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                  <span style={{ fontWeight: '800', fontSize: '0.9rem' }}>{pref.label}</span>
                  <div style={{ width: '40px', height: '20px', background: pref.state ? 'var(--primary)' : 'rgba(255,255,255,0.1)', borderRadius: '10px', position: 'relative' }}>
                    <div style={{ width: '16px', height: '16px', background: '#fff', borderRadius: '50%', position: 'absolute', top: '2px', left: pref.state ? '22px' : '2px', transition: '0.3s' }}></div>
                  </div>
                </div>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{pref.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
