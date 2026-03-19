import { useState, useEffect } from 'react';
import './App.css';

// Components
import TermsModal from './components/legal/TermsModal';
import Layout from './components/Layout';
import SymptomLogger from './components/SymptomLogger';
import SymptomHistory from './components/SymptomHistory';
import Medications from './components/Medications';
import Measurements from './components/Measurements';
import WeightTracker from './components/WeightTracker';
import Trends from './components/Trends';
import ExportData from './components/ExportData';
import Settings from './components/Settings';
import OnboardingModal from './components/OnboardingModal';
import ThankYou from './components/legal/ThankYou.jsx';
import SecondaryConditionsGuide from './components/SecondaryConditionsGuide';
import PresumptiveConditionsGuide from './components/PresumptiveConditionsGuide';
import MOSNoiseExposureLookup from './components/MOSNoiseExposureLookup';
import StrategicFilingGuide from './components/StrategicFilingGuide';
import VATermsAndFAQ from './components/VATermsAndFAQ';
import CPExamPrep from './components/CPExamPrep';
import AfterActionReport from './components/AfterActionReport';
import QuickActionsMenu from './components/QuickActionsMenu';
import { initializeAccessibility } from './utils/accessibilityUtils.js';
import BlueButtonImport from './components/BlueButtonImport';
import { createEmergencyBackup, createDailyBackup } from './utils/storageVersion';



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
    '/va-terms-faq': 'va-terms-faq',
    '/cp-exam-prep': 'cp-exam-prep',
    '/strategic-filing': 'strategic-filing',
    'after-action-report': 'after-action-report',
    'weight-tracker': '/weight-tracker',
    'blue-button-import': '/blue-button-import',
  };

  return pathToView[path] || 'log';
};

// Inner app component that uses profile context
const AppContent = () => {
  // Initialize view from URL path (for direct links like /thank-you)
  const [currentView, setCurrentView] = useState(getInitialViewFromURL());
  const { shouldShowOnboarding, refreshProfile } = useProfile();
  const [showOnboarding, setShowOnboarding] = useState(shouldShowOnboarding);
  const [showTerms, setShowTerms] = useState(false);
  const [showBlueButton, setShowBlueButton] = useState(false);

  // Fraud alert banner — dismissed state persisted to localStorage
  const [showFraudAlert, setShowFraudAlert] = useState(() => {
    return localStorage.getItem('docbear_fraudAlertDismissed') !== 'true';
  });

  const dismissFraudAlert = () => {
    localStorage.setItem('docbear_fraudAlertDismissed', 'true');
    setShowFraudAlert(false);
  };

  const reopenFraudAlert = () => {
    localStorage.removeItem('docbear_fraudAlertDismissed');
    setShowFraudAlert(true);
  };

  // Phase 1H - Copy last entry prefill data
  const [prefillData, setPrefillData] = useState(null);

  // V2.5 - Initialize accessibility settings on app load
  useEffect(() => {
    initializeAccessibility();
  }, []);

  useEffect(() => {
    const termsAccepted = localStorage.getItem('symptomTracker_termsAccepted');
    if (!termsAccepted) {
      setShowTerms(true);
    }
  }, []);

  const handleAcceptTerms = () => {
    localStorage.setItem('symptomTracker_termsAccepted', new Date().toISOString());
    setShowTerms(false);
  };

  /// Run multi-profile migration and cleanup on first load
  useEffect(() => {
    const initialize = async () => {

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
  }, [refreshProfile]);

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
      'va-terms-faq': '/va-terms-faq',
      'strategic-filing': '/strategic-filing',
      '/cp-exam-prep': '/cp-exam-prep',
      'after-action-report': 'after-action-report',
      'weight-tracker': '/weight-tracker',
      'blue-button-import': '/blue-button-import',
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
        return <SymptomLogger
            prefillData={prefillData}
            onPrefillUsed={() => setPrefillData(null)}
            onNavigate={handleNavigate}
        />;
      case 'history':
        return <SymptomHistory onCopyLog={handleCopyLog} />;
      case 'measurements':
        return <Measurements onNavigate={handleNavigate} />;
      case 'weight-tracker':
        return <WeightTracker onNavigate={handleNavigate} />;
      case 'meds':
        return <Medications />;
      case 'trends':
        return <Trends />;
      case 'export':
        return <ExportData />;
      case 'settings':
        return <Settings
            onNavigate={handleNavigate}
            onOpenBlueButton={() => setShowBlueButton(true)}
            onShowFraudAlert={reopenFraudAlert}
        />;
      case 'thank-you':
        return <ThankYou />;
      case 'secondary-conditions':
        return <SecondaryConditionsGuide onNavigateToSymptom={(_symptom) => handleNavigate('log')} />;
      case 'presumptive-conditions':
        return <PresumptiveConditionsGuide />;
      case 'mos-noise-exposure':
        return <MOSNoiseExposureLookup />;
      case 'va-terms-faq':
        return <VATermsAndFAQ />;
      case 'cp-exam-prep':
        return <CPExamPrep />;
      case 'strategic-filing':
        return <StrategicFilingGuide onBack={() => handleNavigate('settings')} />;
      case 'after-action-report':
        return <AfterActionReport />
      case 'blue-button-import':
        return null;
      default:
        return <SymptomLogger />;
    }
  };

  return (
      <>
        {/* Fraud Alert Banner */}
        {showFraudAlert && (
            <div className="fixed top-0 left-0 right-0 z-50 bg-red-700 dark:bg-red-900 text-white shadow-lg">
              <div className="max-w-4xl mx-auto px-4 py-3">
                <div className="flex items-start gap-3">
                  <span className="text-xl flex-shrink-0 mt-0.5">🚨</span>
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-sm">
                      Fraud Alert — VA Appointment Scam
                    </p>
                    <p className="text-xs text-red-100 mt-0.5 leading-relaxed">
                      VA does <strong>not</strong> charge upfront for appointments and does{' '}
                      <strong>not</strong> send payment requests by email, text, or phone.
                      If you receive a suspicious letter, call, or message — do not pay.
                      Contact your local VA medical center directly to verify.
                    </p>
                    <p className="text-xs text-red-200 mt-1">
                      Report scams: VSAFE{' '}
                      <span className="font-mono">1-833-38V-SAFE</span>
                      {' '}· VA OIG Hotline{' '}
                      <span className="font-mono">1-800-488-8244</span>
                      {' '}· VHAOICHelpline@va.gov
                    </p>
                  </div>
                  <button
                      onClick={dismissFraudAlert}
                      className="flex-shrink-0 text-red-200 hover:text-white text-xl font-bold leading-none p-1 -mt-1"
                      aria-label="Dismiss fraud alert"
                  >
                    ×
                  </button>
                </div>
              </div>
            </div>
        )}

        {/* Terms Modal - MUST accept before anything else */}
        {showTerms && (
            <TermsModal
                isOpen={showTerms}
                onAccept={handleAcceptTerms}
            />
        )}
        {/* Onboarding Modal */}
        {showOnboarding && (
            <OnboardingModal onComplete={handleOnboardingComplete} />
        )}

        {/* Main App */}
        <Layout currentView={currentView} onNavigate={handleNavigate}>
          {renderView()}
        </Layout>

        {/* Blue Button Import Wizard */}
        {showBlueButton && (
            <BlueButtonImport
                onClose={() => setShowBlueButton(false)}
                onImportComplete={(_result) => {
                  setShowBlueButton(false);
                  // Phase 5 will handle writing to storage here
                }}
            />
        )}

        {/* V2.5 - Quick Actions Floating Button */}
        <QuickActionsMenu
            onNavigate={handleNavigate}
            currentView={currentView}
            hiddenViews={['log', 'settings']}
        />
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