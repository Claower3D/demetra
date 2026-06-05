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
