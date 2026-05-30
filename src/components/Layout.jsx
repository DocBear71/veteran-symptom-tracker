/**
 * Layout.jsx
 *
 * Main layout wrapper with header, bottom navigation, and footer.
 * Features:
 * - 4-tab bottom navigation (cleaner than Vet-Rate's cluttered nav)
 * - Privacy badge in header
 * - Panic key integration (triple-tap Escape or triple-tap screen on mobile)
 * - Comprehensive footer with app stats
 * - Profile-aware header
 *
 * Usage:
 *   <Layout currentView={view} onNavigate={setView}>
 *     {children}
 *   </Layout>
 */

import { useEffect, useState } from 'react';
import { useProfile } from '../hooks/useProfile';
import { getActiveProfile, getColorById } from '../utils/profiles';
import { Shield, PenLine, BarChart3, History, Menu } from 'lucide-react';
import Footer from './legal/Footer';

// ==============================================
// PANIC KEY HOOK (inline for simplicity)
// ==============================================
const usePanicKey = (redirectUrl = 'https://www.google.com') => {
  useEffect(() => {
    let escapeCount = 0;
    let escapeTimer = null;
    let tapCount = 0;
    let lastTapTime = 0;
    let tapTimer = null;

    // Desktop: Triple-tap Escape
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        escapeCount++;
        clearTimeout(escapeTimer);

        if (escapeCount >= 3) {
          window.location.href = redirectUrl;
          return;
        }

        escapeTimer = setTimeout(() => {
          escapeCount = 0;
        }, 1000);
      }
    };

    // Mobile: Triple-tap anywhere
    const handleTouchStart = () => {
      const now = Date.now();

      if (now - lastTapTime < 500) {
        tapCount++;
      } else {
        tapCount = 1;
      }

      lastTapTime = now;
      clearTimeout(tapTimer);

      if (tapCount >= 3) {
        window.location.href = redirectUrl;
        return;
      }

      tapTimer = setTimeout(() => {
        tapCount = 0;
      }, 1000);
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('touchstart', handleTouchStart, { passive: true });

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('touchstart', handleTouchStart);
      clearTimeout(escapeTimer);
      clearTimeout(tapTimer);
    };
  }, [redirectUrl]);
};

// ==============================================
// PRIVACY BADGE COMPONENT
// ==============================================
const PrivacyBadge = ({ compact = true }) => {
  if (compact) {
    return (
        <div className="inline-flex items-center gap-1 px-2 py-1 bg-green-100
                      dark:bg-green-900/30 text-green-800 dark:text-green-300
                      rounded-full text-xs font-medium">
          <Shield className="w-3 h-3" />
          <span>Private</span>
        </div>
    );
  }

  return (
      <div className="flex items-center gap-3 px-3 py-2 bg-green-50
                    dark:bg-green-900/20 border border-green-200
                    dark:border-green-800 rounded-lg text-xs">
        <span className="text-green-700 dark:text-green-400">🚫☁️ No Cloud</span>
        <span className="text-green-700 dark:text-green-400">🤖❌ No AI</span>
        <span className="text-green-700 dark:text-green-400">🔒 100% Local</span>
      </div>
  );
};

// ==============================================
// NAVIGATION BUTTON COMPONENT
// ==============================================
const NavButton = ({ icon: Icon, emoji, label, view, currentView, onNavigate }) => {
  const isActive = currentView === view;

  return (
      <button
          onClick={() => onNavigate(view)}
          className={`flex-1 py-3 text-center transition-colors ${
              isActive
                  ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-900 dark:text-blue-300'
                  : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700'
          }`}
          aria-current={isActive ? 'page' : undefined}
      >
        {Icon ? (
            <Icon className={`w-6 h-6 mx-auto mb-1 ${isActive ? 'stroke-2' : ''}`} />
        ) : (
            <div className="text-xl mb-1">{emoji}</div>
        )}
        <div className="text-xs font-medium">{label}</div>
      </button>
  );
};

// ==============================================
// MAIN LAYOUT COMPONENT
// ==============================================
const Layout = ({ children, currentView, onNavigate }) => {
  const { labels, features, isVeteran } = useProfile();
  const [activeProfile, setActiveProfile] = useState(() => getActiveProfile());
  const [keyboardOpen, setKeyboardOpen] = useState(false);

  // Only "installed" contexts (home-screen PWA / native app) need the hardcoded
  // safe-area fallback — there the OS doesn't reserve space for the status/nav
  // bars and env() can report 0. In a normal browser tab the browser already
  // reserves that space, so forcing 28px/36px doubles up into huge top/bottom
  // bands. In browser mode we use env() alone (0 when no notch, real inset when
  // there is one).
  const [isInstalled] = useState(() => {
    if (typeof window === 'undefined') return false;
    const standaloneDisplay = window.matchMedia?.('(display-mode: standalone)')?.matches;
    const iosStandalone = window.navigator?.standalone === true;
    const isNative = !!(globalThis?.Capacitor?.isNativePlatform?.());
    return Boolean(standaloneDisplay || iosStandalone || isNative);
  });

  const safeTop = isInstalled
      ? 'max(env(safe-area-inset-top, 0px), 28px)'
      : 'env(safe-area-inset-top, 0px)';
  const safeBottom = isInstalled
      ? 'max(env(safe-area-inset-bottom, 0px), 36px)'
      : 'env(safe-area-inset-bottom, 0px)';

  // Initialize panic key
  usePanicKey('https://www.google.com');

  useEffect(() => {
    const handleProfileChange = () => {
      setActiveProfile(getActiveProfile());
    };

    window.addEventListener('profileChanged', handleProfileChange);
    return () => window.removeEventListener('profileChanged', handleProfileChange);
  }, []);

  // Phase 5 — hide bottom nav when keyboard is open so it doesn't
  // float above the keyboard on iOS
  useEffect(() => {
    const onShow = () => setKeyboardOpen(true);
    const onHide = () => setKeyboardOpen(false);
    window.addEventListener('vaultKeyboardShow', onShow);
    window.addEventListener('vaultKeyboardHide', onHide);
    return () => {
      window.removeEventListener('vaultKeyboardShow', onShow);
      window.removeEventListener('vaultKeyboardHide', onHide);
    };
  }, []);

  const profileColor = activeProfile ? getColorById(activeProfile.color) : null;

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [currentView]);

  return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col">

        {/* iOS safe area fill — fixed blue strip behind the status bar only.
          Zero height on Android/web where safe-area-inset-top is 0. */}
        <div
            className="fixed top-0 left-0 right-0 z-50 bg-blue-900 dark:bg-gray-800"
            style={{ height: safeTop }}
            aria-hidden="true"
        />

        {/* Header */}
        <header
            className="bg-blue-900 dark:bg-gray-800 text-white shadow-lg"
            style={{ paddingTop: safeTop }}
        >
          <div className="max-w-lg mx-auto px-4 py-4">
            <div className="flex items-center justify-between mb-1">
              <h1 className="text-xl font-bold">{labels.appTitle}</h1>
              <div className="flex items-center gap-2">
                <PrivacyBadge compact />
                {activeProfile && profileColor && (
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${profileColor.class} flex items-center gap-1`}>
                  {activeProfile.name}
                </span>
                )}
              </div>
            </div>
            <p className="text-blue-200 dark:text-gray-400 text-sm">{labels.appSubtitle}</p>
          </div>
        </header>

        {/* Main Content */}
        <main className="max-w-lg mx-auto px-4 py-6 pb-1 flex-1 w-full">
          {children}
        </main>

        {/* Footer - Above bottom navigation */}
       <div className="pb-20 px-4 max-w-lg mx-auto w-full">
          <Footer />
        </div>

        {/* Bottom Navigation - Fixed at bottom */}
        {/* 4 tabs: cleaner than Vet-Rate's cluttered navigation */}
        <nav
            className={`fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-800
                   border-t border-gray-200 dark:border-gray-700 shadow-lg z-40
                   transition-transform duration-200
                   ${keyboardOpen ? 'translate-y-full' : 'translate-y-0'}`}
            style={{ paddingBottom: safeBottom }}
            role="navigation"
            aria-label="Main navigation"
        >
          <div className="max-w-lg mx-auto flex">
            <NavButton
                icon={PenLine}
                label="Log"
                view="log"
                currentView={currentView}
                onNavigate={onNavigate}
            />
            <NavButton
                icon={BarChart3}
                label="Trends & Evidence"
                view="trends"
                currentView={currentView}
                onNavigate={onNavigate}
            />
            <NavButton
                icon={History}
                label="History"
                view="history"
                currentView={currentView}
                onNavigate={onNavigate}
            />
            <NavButton
                icon={Menu}
                label="More"
                view="settings"
                currentView={currentView}
                onNavigate={onNavigate}
            />
          </div>
        </nav>
      </div>
  );
};

export default Layout;