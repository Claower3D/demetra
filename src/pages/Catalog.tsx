import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, Filter, Search } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useLang, InlineEdit } from '../LangContext';
import { productsData, categories } from '../i18n';
import { BuilderWrapper } from '../components/BuilderWrapper';
import { useBuilderLayout } from '../hooks/useBuilderLayout';

export default function Catalog() {
  const { lang, t } = useLang();
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  
  const { layout, isBuilder } = useBuilderLayout('catalog', { order: [], hidden: [], styles: {}, images: {} });

  const filteredProducts = productsData.filter(p => {
    const matchesCategory = activeCategory === 'all' || p.categoryId === activeCategory;
    const title = p[lang]?.title || '';
    const category = p[lang]?.category || '';
    const matchesSearch = title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          category.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const blockStyle = layout?.styles?.catalog_main || {};

  return (
    <div style={{ paddingTop: '150px', minHeight: '100vh', background: 'var(--background)', ...blockStyle }}>
      <BuilderWrapper id="catalog_main" isBuilder={isBuilder}>
      <div className="container">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', color: 'var(--primary)', fontWeight: '800', fontSize: '0.8rem', letterSpacing: '0.3em', marginBottom: '2rem' }}>
            <div style={{ width: '40px', height: '1px', background: 'var(--primary)' }}></div>
            PRODUCT INVENTORY
          </div>
          <h1 style={{ fontSize: 'clamp(3rem, 6vw, 6rem)', color: 'var(--foreground)', marginBottom: '2rem', lineHeight: '0.9' }}>
            <InlineEdit tKey="cat_title_1" /> <span style={{ color: 'var(--primary)' }}><InlineEdit tKey="cat_title_2" /></span>
          </h1>
          
          <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: '2rem', alignItems: 'end', marginBottom: '4rem' }}>
            <p style={{ color: 'var(--text-muted)', maxWidth: '600px', fontSize: '1.2rem', lineHeight: '1.6' }}>
              <InlineEdit tKey="cat_desc" />
            </p>
            <div style={{ position: 'relative' }}>
              <Search style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} size={18} />
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
              {filteredProducts.map((item, i) => {
                const cardId = `cat_item_${item.id}`;
                const cardStyle = layout.styles?.[cardId] || {};
                return (
                  <motion.div
                    layout
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ duration: 0.4 }}
                    key={item.id}
                    className="product-card"
                    style={{
                      gridColumn: filteredProducts.length > 2 && i % 3 === 0 ? 'span 6' : 'span 3',
                      ...cardStyle
                    }}
                  >
                    <BuilderWrapper id={cardId} isBuilder={isBuilder}>
                    <Link to={`/product/${item.id}`} style={{ display: 'block', height: '100%' }}>
                      <img src={layout.images?.[`${cardId}_img`] || item.image} alt={item[lang]?.title || ''} />
                      <div className="product-info">
                        <div style={{ color: 'var(--primary)', fontSize: '0.9rem', fontWeight: '800', marginBottom: '0.5rem' }}>◆ {item[lang]?.category}</div>
                        <h3 style={{ fontSize: '1.8rem', color: 'var(--foreground)' }}>{item[lang]?.title}</h3>
                        <div style={{ marginTop: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--primary)', fontWeight: '700', fontSize: '0.8rem', opacity: 0, transition: 'all 0.3s' }} className="view-details">
                          {t.ui_view_specs} <ArrowRight size={16} />
                        </div>
                      </div>
                    </Link>
                    </BuilderWrapper>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </motion.div>

          {filteredProducts.length === 0 && (
            <div style={{ textAlign: 'center', color: 'var(--text-muted)', opacity: 0.5, padding: '8rem 0', fontSize: '1.5rem', fontWeight: '700' }}>
              {t.ui_no_results}
            </div>
          )}
        </motion.div>
      </div>
      </BuilderWrapper>
    </div>
  );
}
