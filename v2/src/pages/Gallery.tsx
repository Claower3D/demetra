import { motion } from 'framer-motion';
import { Image as ImageIcon, Maximize2 } from 'lucide-react';

export default function Gallery() {
  const images = [
    "/conveyor_hero_bg.png",
    "/clean_services.png",
    "/rubber_lining.png",
    "/corporate_about.png",
    "/vibrant_hero.png",
    "/conveyor_belt.png"
  ];

  return (
    <div style={{ paddingTop: '150px', minHeight: '100vh', background: 'var(--background)' }}>
      <div className="container">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', color: 'var(--primary)', fontWeight: '800', fontSize: '0.8rem', letterSpacing: '0.3em', marginBottom: '2rem' }}>
            <ImageIcon size={16} />
            VISUAL ASSETS
          </div>
          <h1 style={{ fontSize: 'clamp(3rem, 6vw, 6rem)', color: '#fff', marginBottom: '6rem', lineHeight: '0.9' }}>
            ФОТО <span style={{ color: 'var(--primary)' }}>ГАЛЕРЕЯ</span>
          </h1>

          <div className="bento-grid" style={{ gridAutoRows: '300px', marginBottom: '8rem' }}>
            {images.map((img, i) => (
              <motion.div
                key={i}
                whileHover={{ scale: 0.98 }}
                className="product-card"
                style={{ gridColumn: i % 4 === 0 ? 'span 2' : 'span 1' }}
              >
                <img src={img} alt="Gallery" style={{ filter: 'brightness(0.6)' }} />
                <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', opacity: 0, transition: '0.3s', background: 'rgba(0, 255, 65, 0.2)' }} className="gallery-overlay">
                  <Maximize2 color="#fff" size={40} />
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
