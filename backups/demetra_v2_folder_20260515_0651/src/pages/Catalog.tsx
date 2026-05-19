import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, Filter, Search } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useLang } from '../LangContext';
import { productsData, categories } from '../i18n';

export default function Catalog() {
  const { lang, t } = useLang();
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredProducts = productsData.filter(p => {
    const matchesCategory = activeCategory === 'all' || p.categoryId === activeCategory;
    const matchesSearch = p[lang].title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          p[lang].category.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div style={{ paddingTop: '150px', minHeight: '100vh', background: 'var(--background)' }}>
      <div className="container">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', color: 'var(--primary)', fontWeight: '800', fontSize: '0.8rem', letterSpacing: '0.3em', marginBottom: '2rem' }}>
            <div style={{ width: '40px', height: '1px', background: 'var(--primary)' }}></div>
            PRODUCT INVENTORY
          </div>
          <h1 style={{ fontSize: 'clamp(3rem, 6vw, 6rem)', color: 'var(--foreground)', marginBottom: '2rem', lineHeight: '0.9' }}>
            {t.cat_title_1} <span style={{ color: 'var(--primary)' }}>{t.cat_title_2}</span>
          </h1>
          
          <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: '2rem', alignItems: 'end', marginBottom: '4rem' }}>
            <p style={{ color: 'rgba(255,255,255,0.5)', maxWidth: '600px', fontSize: '1.2rem', lineHeight: '1.6' }}>
              {t.cat_desc}
            </p>
            <div style={{ position: 'relative' }}>
              <Search style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'rgba(255,255,255,0.3)' }} size={18} />
              <input 
                type="text" 
                placeholder={t.ui_search} 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{ background: 'var(--surface)', border: '1px solid var(--border)', padding: '1rem 1rem 1rem 3rem', color: 'var(--foreground)', borderRadius: '8px', width: '300px', fontSize: '0.8rem', fontWeight: '700' }}
              />
            </div>
          </div>

          {/* Filter Bar */}
          <div style={{ background: 'var(--surface)', padding: '1rem', borderRadius: 'var(--radius)', border: '1px solid var(--border)', marginBottom: '4rem', display: 'flex', flexWrap: 'wrap', gap: '0.5rem', alignItems: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', color: 'var(--foreground)', marginRight: '1rem', padding: '0 1rem' }}>
              <Filter size={18} />
              <span style={{ fontWeight: '700', fontSize: '0.8rem', letterSpacing: '0.1em' }}>{t.ui_filter}</span>
            </div>
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`btn-category ${activeCategory === cat.id ? 'active' : ''}`}
              >
                {cat[lang]}
              </button>
            ))}
          </div>

          <motion.div 
            className="bento-grid" 
            style={{ gridAutoRows: 'minmax(300px, auto)' }}
            layout
          >
            <AnimatePresence mode="popLayout">
              {filteredProducts.map((item, i) => (
                <motion.div
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.4 }}
                  key={item.id}
                  className="product-card"
                  style={{
                    gridColumn: filteredProducts.length > 2 && i % 3 === 0 ? 'span 2' : 'span 1'
                  }}
                >
                  <Link to={`/product/${item.id}`} style={{ display: 'block', height: '100%' }}>
                    <img src={item.image} alt={item[lang]?.title || ''} />
                    <div className="product-info">
                      <div style={{ color: 'var(--primary)', fontSize: '0.9rem', fontWeight: '800', marginBottom: '0.5rem' }}>◆ {item[lang]?.category}</div>
                      <h3 style={{ fontSize: '1.8rem', color: 'var(--foreground)' }}>{item[lang]?.title}</h3>
                      <div style={{ marginTop: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--primary)', fontWeight: '700', fontSize: '0.8rem', opacity: 0, transition: 'all 0.3s' }} className="view-details">
                        {t.ui_view_specs} <ArrowRight size={16} />
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>

          {filteredProducts.length === 0 && (
            <div style={{ textAlign: 'center', color: 'rgba(255,255,255,0.2)', padding: '8rem 0', fontSize: '1.5rem', fontWeight: '700' }}>
              NO ASSETS MATCHING YOUR CRITERIA.
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
