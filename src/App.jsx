import { useState, useEffect } from 'react';
import './App.css';

// Components
import Layout from './components/Layout';
import SymptomLogger from './components/SymptomLogger';
import SymptomHistory from './components/SymptomHistory';
import Medications from './components/Medications';
import Measurements from './components/Measurements';
import Trends from './components/Trends';
import ExportData from './components/ExportData';
import Settings from './components/Settings';
import OnboardingModal from './components/OnboardingModal';
import ThankYou from './components/legal/ThankYou.jsx';
import SecondaryConditionsGuide from './components/SecondaryConditionsGuide';
import PresumptiveConditionsGuide from './components/PresumptiveConditionsGuide';
import MOSNoiseExposureLookup from './components/MOSNoiseExposureLookup';

// Profile system
import { ProfileProvider, useProfile } from './hooks/useProfile.jsx';

// Multi-profile migration
import { initializeMultiProfile } from './utils/profileMigration';

/**
 * Get initial view based on URL path
 * This allows direct linking to pages like /thank-you
 */
const getInitialViewFromURL = () => {
  const path = window.location.pathname;

  // Map URL paths to view names
  const pathToView = {
    '/thank-you': 'thank-you',
    '/history': 'history',
    '/meds': 'meds',
    '/medications': 'meds',
    '/trends': 'trends',
    '/measurements': 'measurements',
    '/settings': 'settings',
    '/export': 'export',
    '/secondary-conditions': 'secondary-conditions',
    '/presumptive-conditions': 'presumptive-conditions',
    '/mos-noise-exposure': 'mos-noise-exposure',
  };

  return pathToView[path] || 'log';
};

// Inner app component that uses profile context
const AppContent = () => {
  // Initialize view from URL path (for direct links like /thank-you)
  const [currentView, setCurrentView] = useState(getInitialViewFromURL());
  const { shouldShowOnboarding, refreshProfile } = useProfile();
  const [showOnboarding, setShowOnboarding] = useState(shouldShowOnboarding);

  // Phase 1H - Copy last entry prefill data
  const [prefillData, setPrefillData] = useState(null);

  /// Run multi-profile migration and cleanup on first load
  useEffect(() => {
    const initialize = async () => {
      // Import backup utilities
      const { createEmergencyBackup, createDailyBackup } = await import('./utils/storageVersion');

      // Check if user has any data before creating backup
      const hasData = localStorage.getItem('symptomTracker_logs') ||
          localStorage.getItem('symptomTracker_profiles') ||
          Object.keys(localStorage).some(key =>
              key.startsWith('symptomTracker_logs_') ||
              key.startsWith('symptomTracker_profiles')
          );

      // Only create emergency backup if data exists
      if (hasData) {
        createEmergencyBackup();
        console.log('🛡️ Pre-migration backup created');

        // Also check if daily backup is needed
        createDailyBackup();
      } else {
        console.log('ℹ️ No data found - skipping backup creation');
      }

      const result = initializeMultiProfile();
      if (result.migrated) {
        console.log('Multi-profile migration completed');
      }
      if (result.cleaned > 0) {
        console.log(`Cleaned up ${result.cleaned} old data keys`);
      }
      // Refresh profile context after initialization
      refreshProfile();
    };
    initialize();
  }, []);

  // Handle browser back/forward buttons
  useEffect(() => {
    const handlePopState = () => {
      setCurrentView(getInitialViewFromURL());
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  // Update URL when view changes (optional - enables shareable links)
  const handleNavigate = (view) => {
    setCurrentView(view);

    // Update URL without page reload
    const viewToPath = {
      'log': '/',
      'history': '/history',
      'meds': '/meds',
      'trends': '/trends',
      'measurements': '/measurements',
      'settings': '/settings',
      'export': '/export',
      'thank-you': '/thank-you',
      'secondary-conditions': '/secondary-conditions',
      'presumptive-conditions': '/presumptive-conditions',
      'mos-noise-exposure': '/mos-noise-exposure',
    };

    const newPath = viewToPath[view] || '/';
    if (window.location.pathname !== newPath) {
      window.history.pushState({}, '', newPath);
    }
  };

  // Handle onboarding completion
  const handleOnboardingComplete = () => {
    setShowOnboarding(false);
    refreshProfile(); // Refresh profile state after onboarding
  };

  // Phase 1H - Handle copying a log entry to pre-fill logger
  const handleCopyLog = (log) => {
    setPrefillData(log);
    handleNavigate('log'); // Switch to logger view
  };

  // Render the current view
  const renderView = () => {
    switch (currentView) {
      case 'log':
        return <SymptomLogger prefillData={prefillData} onPrefillUsed={() => setPrefillData(null)} />;
      case 'history':
        return <SymptomHistory onCopyLog={handleCopyLog} />;
      case 'measurements':
        return <Measurements />;
      case 'meds':
        return <Medications />;
      case 'trends':
        return <Trends />;
      case 'export':
        return <ExportData />;
      case 'settings':
        return <Settings onNavigate={handleNavigate} />;
      case 'thank-you':
        return <ThankYou />;
      case 'secondary-conditions':
        return <SecondaryConditionsGuide onNavigateToSymptom={(symptom) => handleNavigate('log')} />;
      case 'presumptive-conditions':
        return <PresumptiveConditionsGuide />;
      case 'mos-noise-exposure':
        return <MOSNoiseExposureLookup />;
      default:
        return <SymptomLogger />;
    }
  };

  return (
      <>
        {/* Onboarding Modal */}
        {showOnboarding && (
            <OnboardingModal onComplete={handleOnboardingComplete} />
        )}

        {/* Main App */}
        <Layout currentView={currentView} onNavigate={handleNavigate}>
          {renderView()}
        </Layout>
      </>
  );
};

// Root App component wraps everything in ProfileProvider
function App() {
  return (
      <ProfileProvider>
        <AppContent />
      </ProfileProvider>
  );
}

export default App;