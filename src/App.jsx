import { useState } from 'react';
import './App.css';

// Components
import Layout from './components/Layout';
import SymptomLogger from './components/SymptomLogger';
import SymptomHistory from './components/SymptomHistory';
import Medications from './components/Medications';
import Trends from './components/Trends';
import ExportData from './components/ExportData';
import Settings from './components/Settings';
import OnboardingModal from './components/OnboardingModal';

// Profile system
import { ProfileProvider, useProfile } from './hooks/useProfile.jsx';

// Inner app component that uses profile context
const AppContent = () => {
  const [currentView, setCurrentView] = useState('log');
  const { shouldShowOnboarding, refreshProfile } = useProfile();
  const [showOnboarding, setShowOnboarding] = useState(shouldShowOnboarding);

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
      case 'meds':
        return <Medications />;
      case 'trends':
        return <Trends />;
      case 'export':
        return <ExportData />;
      case 'settings':
        return <Settings />;
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