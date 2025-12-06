import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

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

createRoot(document.getElementById('root')).render(
    <StrictMode>
      <App />
    </StrictMode>,
)