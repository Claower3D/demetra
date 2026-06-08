import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'

const rootElement = document.getElementById('root')!;
const root = createRoot(rootElement);

// Client error logging helper
const logErrorToServer = (errorType: string, message: string, stack?: string) => {
  const payload = {
    type: errorType,
    message,
    stack,
    url: window.location.href,
    userAgent: navigator.userAgent,
    timestamp: new Date().toISOString()
  };
  fetch('/api/log', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  }).catch(() => {});
};

window.addEventListener('error', (event) => {
  logErrorToServer('runtime_error', event.message, event.error?.stack);
});

window.addEventListener('unhandledrejection', (event) => {
  logErrorToServer('unhandled_rejection', String(event.reason), event.reason?.stack);
});

// Intercept console.error
const originalConsoleError = console.error;
console.error = (...args) => {
  originalConsoleError.apply(console, args);
  const msg = args.map(arg => typeof arg === 'object' ? JSON.stringify(arg) : String(arg)).join(' ');
  logErrorToServer('console_error', msg);
};

try {
  root.render(
    <App />
  );
} catch (e) {
  logErrorToServer('root_render_error', e instanceof Error ? e.message : String(e), e instanceof Error ? e.stack : undefined);
  rootElement.innerHTML = `
    <div style="background: #000; color: #ff4b4b; padding: 2rem; font-family: monospace; height: 100vh;">
      <h1>CRITICAL RENDERING ERROR</h1>
      <pre>${e instanceof Error ? e.stack : String(e)}</pre>
      <button onclick="localStorage.clear(); location.reload();" style="background: #ff4b4b; color: #000; border: none; padding: 1rem; cursor: pointer; font-weight: 900;">FACTORY RESET & RELOAD</button>
    </div>
  `;
}
