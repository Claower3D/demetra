import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'

const rootElement = document.getElementById('root')!;
const root = createRoot(rootElement);

try {
  root.render(
    <StrictMode>
      <App />
    </StrictMode>,
  );
} catch (e) {
  rootElement.innerHTML = `
    <div style="background: #000; color: #ff4b4b; padding: 2rem; font-family: monospace; height: 100vh;">
      <h1>CRITICAL RENDERING ERROR</h1>
      <pre>${e instanceof Error ? e.stack : String(e)}</pre>
      <button onclick="localStorage.clear(); location.reload();" style="background: #ff4b4b; color: #000; border: none; padding: 1rem; cursor: pointer; font-weight: 900;">FACTORY RESET & RELOAD</button>
    </div>
  `;
}
