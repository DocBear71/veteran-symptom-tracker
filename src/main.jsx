import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { checkAndMigrateStorage, createDailyBackup } from './utils/storageVersion'

// CRITICAL: Protect data BEFORE anything else runs
console.log('🛡️ Checking storage version and creating backups...');
checkAndMigrateStorage();
createDailyBackup();
console.log('✅ Storage protection initialized');

// Apply saved theme BEFORE React renders to prevent flash
const savedTheme = localStorage.getItem('symptomTracker_theme') || 'system';
if (savedTheme === 'dark') {
  document.documentElement.classList.add('dark');
} else if (savedTheme === 'light') {
  document.documentElement.classList.remove('dark');
} else {
  // System preference
  if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
    document.documentElement.classList.add('dark');
  }
}

// Guard against accidental external navigation in PWA standalone mode.
// Rapid taps can trigger anchor default behavior and break out of fullscreen.
if (window.matchMedia('(display-mode: standalone)').matches) {
  // Log ALL clicks to catch what's triggering navigation
  document.addEventListener('click', (e) => {
    const anchor = e.target.closest('a');
    if (anchor) {
      // Store in localStorage so we can read it after the navigation happens
      localStorage.setItem('lastAnchorClick', JSON.stringify({
        href: anchor.href,
        text: anchor.textContent?.trim()?.slice(0, 50),
        html: anchor.outerHTML?.slice(0, 100),
        time: new Date().toISOString(),
      }));
      const url = new URL(anchor.href, window.location.origin);
      if (url.origin === window.location.origin && !anchor.target) {
        e.preventDefault();
      }
    }

    // Log every click target for debugging
    localStorage.setItem('lastClick', JSON.stringify({
      tag: e.target.tagName,
      id: e.target.id,
      className: e.target.className?.toString()?.slice(0, 80),
      text: e.target.textContent?.trim()?.slice(0, 30),
      time: new Date().toISOString(),
    }));
  });

  // Catch any beforeunload - fires when page is about to navigate away
  window.addEventListener('beforeunload', (e) => {
    localStorage.setItem('unloadTrigger', JSON.stringify({
      time: new Date().toISOString(),
      url: window.location.href,
      lastClick: localStorage.getItem('lastClick'),
    }));
  });
}

createRoot(document.getElementById('root')).render(
    <StrictMode>
      <App />
    </StrictMode>,
)