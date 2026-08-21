import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import { ErrorBoundary } from './components/ErrorBoundary.tsx';
import './index.css';

// Register Service Worker with clean auto-update handling
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker
      .register('/sw.js')
      .then((reg) => {
<<<<<<< HEAD
=======
        // Check for updates
>>>>>>> e86ab3b8f4485c7cb4e74604d156c9bf1e466e51
        reg.addEventListener('updatefound', () => {
          const newWorker = reg.installing;
          if (newWorker) {
            newWorker.addEventListener('statechange', () => {
              if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                console.log('[SW] New version available, reloading clients...');
              }
            });
          }
        });
      })
      .catch((err) => {
        console.log('[SW] ServiceWorker registration skipped:', err);
      });
  });
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </StrictMode>,
);
<<<<<<< HEAD
=======


>>>>>>> e86ab3b8f4485c7cb4e74604d156c9bf1e466e51
