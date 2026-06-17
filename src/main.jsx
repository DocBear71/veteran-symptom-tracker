import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { checkAndMigrateStorage, createDailyBackup } from './utils/storageVersion'
import { migrateLocalStorageToIDB } from './utils/db'
import { initializeCache } from './utils/storageCache'

// CRITICAL: Protect data BEFORE anything else runs
console.log('🛡️ Checking storage version and creating backups...');
checkAndMigrateStorage();
createDailyBackup();
console.log('✅ Storage protection initialized');

// Apply saved theme BEFORE React renders to prevent flash
// Theme must be read from localStorage directly here — cache not ready yet
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
  document.addEventListener('click', (e) => {
    const anchor = e.target.closest('a');
    if (anchor && anchor.href) {
      const url = new URL(anchor.href, window.location.origin);
      if (url.origin === window.location.origin && !anchor.target) {
        e.preventDefault();
      }
    }
  });
}

// Initialize IndexedDB migration and cache BEFORE React mounts.
// This ensures all synchronous storage.js reads hit the cache
// rather than falling back to localStorage on first render.
(async () => {
  try {
    // Step 1: Migrate any existing localStorage data to IndexedDB (runs once)
    await migrateLocalStorageToIDB();

    // Step 2: Load all IDB data into the in-memory cache
    await initializeCache();
  } catch (err) {
    // Non-fatal — app can still run, reads fall back to localStorage
    console.error('❌ Storage initialization error:', err);
  } finally {
    // Always mount React, even if storage init fails
    createRoot(document.getElementById('root')).render(
        <StrictMode>
          <App />
        </StrictMode>,
    );
  }
})();