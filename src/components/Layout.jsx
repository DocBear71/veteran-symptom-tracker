import { useProfile } from '../hooks/useProfile';
import { getActiveProfile, getColorById } from '../utils/profiles';
import { useEffect, useState } from 'react';

// Main layout wrapper with header and navigation
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

  // Get labels based on active profile type
  const getLabels = () => {
    if (!activeProfile) {
      return {
        appTitle: 'Symptom Tracker',
        appSubtitle: 'Loading...',
      };
    }

    switch (activeProfile.type) {
      case 'veteran':
        return {
          appTitle: 'Veteran Symptom Tracker',
          appSubtitle: 'Document symptoms for VA claims',
        };
      case 'general':
        return {
          appTitle: 'Symptom Tracker',
          appSubtitle: 'Track your daily symptoms',
        };
      case 'caregiver':
        return {
          appTitle: `${activeProfile.name}'s Symptom Tracker`,
          appSubtitle: `Tracking symptoms for ${activeProfile.name}`,
        };
      default:
        return {
          appTitle: 'Symptom Tracker',
          appSubtitle: 'Track your symptoms',
        };
    }
  };

  const labels = getLabels();
  const profileColor = activeProfile ? getColorById(activeProfile.color) : null;

  return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        {/* Header */}
        <header className="bg-blue-900 dark:bg-gray-800 text-white shadow-lg">
          <div className="max-w-lg mx-auto px-4 py-4">
            <div className="flex items-center justify-between mb-1">
              <h1 className="text-xl font-bold">{labels.appTitle}</h1>
              {activeProfile && profileColor && (
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${profileColor.class} flex items-center gap-1`}>
                  {activeProfile.name}
                </span>
              )}
            </div>
            <p className="text-blue-200 dark:text-gray-400 text-sm">{labels.appSubtitle}</p>
          </div>
        </header>

        {/* Main Content */}
        <main className="max-w-lg mx-auto px-4 py-6 pb-24">
          {children}
        </main>

        {/* Bottom Navigation */}
        <nav className="fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 shadow-lg">
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