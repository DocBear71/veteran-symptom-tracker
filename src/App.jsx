import { useState, useEffect } from 'react';
import Layout from './components/Layout';
import SymptomLogger from './components/SymptomLogger';
import SymptomHistory from './components/SymptomHistory';
import Medications from './components/Medications';
import Trends from './components/Trends';
import ExportData from './components/ExportData';
import Settings from './components/Settings';
import OnboardingModal from './components/OnboardingModal';
import { isOnboardingComplete, setOnboardingComplete } from './utils/storage';

const App = () => {
  const [currentView, setCurrentView] = useState('log');
  const [refreshKey, setRefreshKey] = useState(0);
  const [showOnboarding, setShowOnboarding] = useState(false);

  // Check for first-time user on mount
  useEffect(() => {
    if (!isOnboardingComplete()) {
      setShowOnboarding(true);
    }
  }, []);

  // Apply dark mode on mount
  useEffect(() => {
    const savedTheme = localStorage.getItem('symptomTracker_theme') || 'system';

    const applyTheme = () => {
      if (savedTheme === 'dark') {
        document.documentElement.classList.add('dark');
      } else if (savedTheme === 'light') {
        document.documentElement.classList.remove('dark');
      } else {
        // System preference
        if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
          document.documentElement.classList.add('dark');
        } else {
          document.documentElement.classList.remove('dark');
        }
      }
    };

    applyTheme();

    // Listen for system theme changes if using system preference
    if (savedTheme === 'system') {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      const handleChange = () => applyTheme();
      mediaQuery.addEventListener('change', handleChange);
      return () => mediaQuery.removeEventListener('change', handleChange);
    }
  }, []);

  const handleLogSaved = () => {
    setRefreshKey(prev => prev + 1);
  };

  const handleOnboardingComplete = () => {
    setOnboardingComplete();
    setShowOnboarding(false);
  };

  const renderView = () => {
    switch (currentView) {
      case 'log':
        return <SymptomLogger onLogSaved={handleLogSaved} />;
      case 'history':
        return <SymptomHistory key={refreshKey} />;
      case 'meds':
        return <Medications />;
      case 'trends':
        return <Trends key={refreshKey} />;
      case 'export':
        return <ExportData />;
      case 'settings':
        return <Settings />;
      default:
        return <SymptomLogger onLogSaved={handleLogSaved} />;
    }
  };

  return (
      <>
        <Layout currentView={currentView} onNavigate={setCurrentView}>
          {renderView()}
        </Layout>

        {/* Onboarding Modal */}
        {showOnboarding && (
            <OnboardingModal onComplete={handleOnboardingComplete} />
        )}
      </>
  );
};

export default App;