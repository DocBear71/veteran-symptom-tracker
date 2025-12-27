// file: src/components/Layout.jsx v2 - Main layout wrapper with header, navigation, and footer
// Updated to include Footer component on all pages

import { useProfile } from '../hooks/useProfile';
import { getActiveProfile, getColorById } from '../utils/profiles';
import { useEffect, useState } from 'react';
import Footer from './legal/Footer';

// Main layout wrapper with header, navigation, and footer
const Layout = ({ children, currentView, onNavigate }) => {
  const { features } = useProfile();
  const [activeProfile, setActiveProfile] = useState(null);

  useEffect(() => {
    const profile = getActiveProfile();
    setActiveProfile(profile);

    // Listen for profile changes
    const handleProfileChange = () => {
      const updatedProfile = getActiveProfile();
      setActiveProfile(updatedProfile);
    };

    window.addEventListener('profileChanged', handleProfileChange);
    return () => window.removeEventListener('profileChanged', handleProfileChange);
  }, []);

  // Scroll to top when view/page changes
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, [currentView]);

  // Get labels based on active profile type
  // Now also checks for isVeteranCaregiver flag
  const getLabels = () => {
    if (!activeProfile) {
      return {
        appTitle: "Doc Bear's Symptom Vault",
        appSubtitle: 'Loading...',
      };
    }

    // Check if this is a caregiver caring for a veteran
    const isVeteranCaregiver = activeProfile.metadata?.isVeteranCaregiver === true;

    switch (activeProfile.type) {
      case 'veteran':
        return {
          appTitle: 'Veteran Symptom Tracker',
          appSubtitle: 'Document symptoms for VA claims',
        };
      case 'general':
        return {
          appTitle: "Doc Bear's Symptom Vault",
          appSubtitle: 'Track your daily symptoms',
        };
      case 'caregiver':
        if (isVeteranCaregiver) {
          return {
            appTitle: `${activeProfile.name}'s VA Tracker`,
            appSubtitle: `Tracking VA symptoms for ${activeProfile.name}`,
          };
        }
        return {
          appTitle: `${activeProfile.name}'s Symptom Tracker`,
          appSubtitle: `Tracking symptoms for ${activeProfile.name}`,
        };
      default:
        return {
          appTitle: "Doc Bear's Symptom Vault",
          appSubtitle: 'Track your symptoms',
        };
    }
  };

  const labels = getLabels();
  const profileColor = activeProfile ? getColorById(activeProfile.color) : null;

  // Check if caregiver is caring for a veteran (for potential visual indicator)
  const isVeteranCaregiver = activeProfile?.type === 'caregiver' &&
      activeProfile?.metadata?.isVeteranCaregiver === true;

  return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col">
        {/* Header */}
        <header className="bg-blue-900 dark:bg-gray-800 text-white shadow-lg">
          <div className="max-w-lg mx-auto px-4 py-4">
            <div className="flex items-center justify-between mb-1">
              <h1 className="text-xl font-bold">{labels.appTitle}</h1>
              {activeProfile && profileColor && (
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${profileColor.class} flex items-center gap-1`}>
                {/* Show veteran badge for veteran caregivers */}
                    {isVeteranCaregiver && <span>🎖️</span>}
                    {activeProfile.name}
              </span>
              )}
            </div>
            <p className="text-blue-200 dark:text-gray-400 text-sm">{labels.appSubtitle}</p>
          </div>
        </header>

        {/* Main Content - flex-1 to push footer down */}
        <main className="max-w-lg mx-auto px-4 py-6 pb-24 flex-1 w-full">
          {children}
        </main>

        {/* Footer - Above bottom navigation */}
        <div className="pb-20">
          <Footer />
        </div>

        {/* Bottom Navigation - Fixed at bottom */}
        <nav className="fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 shadow-lg z-40">
          <div className="max-w-lg mx-auto flex">
            <NavButton
                icon="➕"
                label="Log"
                view="log"
                currentView={currentView}
                onNavigate={onNavigate}
            />
            <NavButton
                icon="📋"
                label="History"
                view="history"
                currentView={currentView}
                onNavigate={onNavigate}
            />
            <NavButton
                icon="💊"
                label="Meds"
                view="meds"
                currentView={currentView}
                onNavigate={onNavigate}
            />
            <NavButton
                icon="📈"
                label="Trends"
                view="trends"
                currentView={currentView}
                onNavigate={onNavigate}
            />
            <NavButton
                icon="📊"
                label="Measure"
                view="measurements"
                currentView={currentView}
                onNavigate={onNavigate}
            />
            <NavButton
                icon="⚙️"
                label="Settings"
                view="settings"
                currentView={currentView}
                onNavigate={onNavigate}
            />
          </div>
        </nav>
      </div>
  );
};

// Navigation button component
const NavButton = ({ icon, label, view, currentView, onNavigate }) => {
  const isActive = currentView === view;

  return (
      <button
          onClick={() => onNavigate(view)}
          className={`flex-1 py-3 text-center transition-colors ${
              isActive
                  ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-900 dark:text-blue-300'
                  : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700'
          }`}
      >
        <div className="text-xl mb-1">{icon}</div>
        <div className="text-xs font-medium">{label}</div>
      </button>
  );
};

export default Layout;