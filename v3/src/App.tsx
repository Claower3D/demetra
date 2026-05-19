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
import './index.css';

import Admin from './pages/Admin';

function App() {
  return (
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
              <Route path="admin" element={<Admin />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </LangProvider>
    </ThemeProvider>
  );
}

export default App;
