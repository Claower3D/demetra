import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { LangProvider } from './LangContext';
import { ThemeProvider } from './ThemeContext';
import Layout from './components/Layout';
import Home from './pages/Home';
import Catalog from './pages/Catalog';
import ProductDetails from './pages/ProductDetails';
import Services from './pages/Services';
import About from './pages/About';
import Contacts from './pages/Contacts';
import FAQ from './pages/FAQ';
import Gallery from './pages/Gallery';
import Pay from './pages/Pay';
import Partner from './pages/Partner';
import Reviews from './pages/Reviews';
import Admin from './pages/Admin';
import './index.css';

import { useState, useEffect } from 'react';
import { getPagesList } from './components/CustomBlock';
import DynamicPage from './pages/DynamicPage';

class ErrorBoundary extends React.Component<{children: any}, {hasError: boolean, error: any}> {
  constructor(props: any) {
    super(props);
    this.state = { hasError: false, error: null };
  }
  static getDerivedStateFromError(error: any) { return { hasError: true, error }; }
  render() {
    if (this.state.hasError) {
      return (
        <div style={{ background: '#000', color: '#ff4b4b', padding: '2rem', fontFamily: 'monospace', height: '100vh', overflow: 'auto' }}>
          <h1>CRITICAL UI ERROR</h1>
          <pre>{this.state.error?.stack}</pre>
          <button onClick={() => { localStorage.clear(); window.location.reload(); }} style={{ background: '#ff4b4b', color: '#000', border: 'none', padding: '1rem', cursor: 'pointer', fontWeight: '900' }}>FACTORY RESET & RELOAD</button>
        </div>
      );
    }
    return this.props.children;
  }
}

function App() {
  const [pages, setPages] = useState(() => getPagesList());

  useEffect(() => {
    const sync = () => setPages(getPagesList());
    window.addEventListener('storage', sync);
    return () => window.removeEventListener('storage', sync);
  }, []);

  // 1. Initial Load from Go Backend to client localStorage
  useEffect(() => {
    fetch('/api/pages')
      .then(r => r.json())
      .then(data => {
        if (data && Array.isArray(data) && data.length > 0) {
          localStorage.setItem('demetra_pages_list', JSON.stringify(data));
          window.dispatchEvent(new Event('storage'));
        }
      })
      .catch(e => console.warn("Could not load pages from backend:", e));

    fetch('/api/custom-blocks')
      .then(r => r.json())
      .then(data => {
        if (data && Object.keys(data).length > 0) {
          localStorage.setItem('demetra_custom_blocks', JSON.stringify(data));
          window.dispatchEvent(new Event('storage'));
        }
      })
      .catch(e => console.warn("Could not load custom blocks from backend:", e));

    const defaultPages = ['home', 'catalog', 'services', 'about', 'contacts', 'partner', 'gallery'];
    const currentPages = getPagesList();
    const allPageIds = Array.from(new Set([...defaultPages, ...currentPages.map(p => p.id)]));

    // Clean up any contaminated layouts (e.g. catalog that has home's 'hero' block order)
    const nonHomeIds = allPageIds.filter(id => id !== 'home');
    nonHomeIds.forEach(id => {
      try {
        const saved = localStorage.getItem(`demetra_${id}_layout`);
        if (saved) {
          const parsed = JSON.parse(saved);
          if (parsed && Array.isArray(parsed.order) && parsed.order.includes('hero')) {
            console.warn(`Clearing contaminated layout for ${id}`);
            localStorage.removeItem(`demetra_${id}_layout`);
          }
        }
      } catch {}
    });
    
    allPageIds.forEach(id => {
      fetch(`/api/layout/${id}`)
        .then(r => r.json())
        .then(data => {
          if (data && typeof data === 'object') {
            localStorage.setItem(`demetra_${id}_layout`, JSON.stringify(data));
          }
        })
        .catch(e => console.warn(`Could not load layout for ${id} from backend:`, e));
    });
  }, []);

  // 2. Debounced Save to Go Backend on client storage changes
  useEffect(() => {
    let timeoutId: any = null;

    const handleStorageSync = () => {
      if (timeoutId) clearTimeout(timeoutId);

      timeoutId = setTimeout(() => {
        const customBlocksData = localStorage.getItem('demetra_custom_blocks');
        if (customBlocksData) {
          fetch('/api/custom-blocks', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: customBlocksData
          }).catch(err => console.warn("Sync custom blocks failed", err));
        }

        const pagesListData = localStorage.getItem('demetra_pages_list');
        if (pagesListData) {
          fetch('/api/pages', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: pagesListData
          }).catch(err => console.warn("Sync pages list failed", err));
        }

        const defaultPages = ['home', 'catalog', 'services', 'about', 'contacts', 'partner', 'gallery'];
        let pageIds = [...defaultPages];
        try {
          const parsed = JSON.parse(pagesListData || '[]');
          pageIds = Array.from(new Set([...defaultPages, ...parsed.map((p: any) => p.id)]));
        } catch {}

        pageIds.forEach(pageId => {
          const layoutData = localStorage.getItem(`demetra_${pageId}_layout`);
          if (layoutData) {
            fetch(`/api/layout/${pageId}`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: layoutData
            }).catch(err => console.warn(`Sync layout ${pageId} failed`, err));
          }
        });
      }, 1000);
    };

    window.addEventListener('storage', handleStorageSync);
    return () => {
      window.removeEventListener('storage', handleStorageSync);
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, []);

  const customPages = pages.filter(p => !p.isSystem);

  return (
    <ErrorBoundary>
      <ThemeProvider>
        <LangProvider>
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Layout />}>
                <Route index element={<Home />} />
                <Route path="about" element={<About />} />
                <Route path="catalog" element={<Catalog />} />
                <Route path="product/:id" element={<ProductDetails />} />
                <Route path="services" element={<Services />} />
                <Route path="contacts" element={<Contacts />} />
                <Route path="partner" element={<Partner />} />
                <Route path="faq" element={<FAQ />} />
                <Route path="gallery" element={<Gallery />} />
                <Route path="reviews" element={<Reviews />} />
                <Route path="pay" element={<Pay />} />
                
                {customPages.map(page => {
                  const cleanPath = page.path.startsWith('/') ? page.path.substring(1) : page.path;
                  return (
                    <Route 
                      key={page.id} 
                      path={cleanPath} 
                      element={<DynamicPage pageId={page.id} />} 
                    />
                  );
                })}
              </Route>
              <Route path="/admin" element={<Admin />} />
            </Routes>
          </BrowserRouter>
        </LangProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
