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

// Profile system
import { ProfileProvider, useProfile } from './hooks/useProfile.jsx';

// Multi-profile migration
import { initializeMultiProfile } from './utils/profileMigration';

// Inner app component that uses profile context
const AppContent = () => {
  const [currentView, setCurrentView] = useState('log');
  const { shouldShowOnboarding, refreshProfile } = useProfile();
  const [showOnboarding, setShowOnboarding] = useState(shouldShowOnboarding);

  // Run multi-profile migration and cleanup on first load
  useEffect(() => {
    const initialize = async () => {
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

  // Handle onboarding completion
  const handleOnboardingComplete = () => {
    setShowOnboarding(false);
    refreshProfile(); // Refresh profile state after onboarding
  };

  // Render the current view
  const renderView = () => {
    switch (currentView) {
      case 'log':
        return <SymptomLogger />;
      case 'history':
        return <SymptomHistory />;
      case 'measurements':
        return <Measurements />;
      case 'meds':
        return <Medications />;
      case 'trends':
        return <Trends />;
      case 'export':
        return <ExportData />;
      case 'settings':
        return <Settings onNavigate={setCurrentView} />;
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
        <Layout currentView={currentView} onNavigate={setCurrentView}>
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