import { useState } from 'react';
import {
  PROFILE_OPTIONS,
  PROFILE_TYPES,
  setProfileType,
  setOnboardingComplete,
  getProfileType,
} from '../utils/profile.js';

const OnboardingModal = ({ onComplete }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [selectedProfile, setSelectedProfile] = useState(null);
  const [patientName, setPatientName] = useState('');
  const [showComingSoon, setShowComingSoon] = useState(null);

  // Profile selection step (Step 0)
  const profileStep = {
    id: 'profile-select',
    title: 'Welcome! Who\'s using this app?',
    content: null, // Custom render
  };

  // Veteran-specific steps
  const veteranSteps = [
    {
      id: 'welcome',
      icon: '🎖️',
      title: 'Built for Veterans',
      content: (
          <>
            <p className="mb-3">
              This app helps you <strong>document symptoms consistently</strong> to
              support your VA disability claims.
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              The VA looks for patterns, frequency, and severity over time.
              Consistent documentation strengthens your case.
            </p>
          </>
      ),
    },
    {
      id: 'conditions',
      icon: '📋',
      title: 'Condition-Specific Tracking',
      content: (
          <>
            <p className="mb-3">
              Log symptoms with <strong>details that matter for ratings</strong>:
            </p>
            <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1 ml-4">
              <li>• <strong>Migraines:</strong> Duration, prostrating severity, light/sound sensitivity</li>
              <li>• <strong>Sleep issues:</strong> CPAP usage, awakening causes, daytime sleepiness</li>
              <li>• <strong>PTSD:</strong> Triggers, nightmare frequency, avoidance behaviors</li>
              <li>• <strong>Pain:</strong> Location, radiation, range of motion impact</li>
            </ul>
          </>
      ),
    },
    {
      id: 'chronic',
      icon: '⭐',
      title: 'Chronic Symptoms',
      content: (
          <>
            <p className="mb-3">
              Add your ongoing conditions to <strong>Chronic Symptoms</strong> for one-tap logging.
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Perfect for daily issues like chronic pain, tinnitus, or anxiety that you
              need to document regularly.
            </p>
          </>
      ),
    },
    {
      id: 'trends',
      icon: '📈',
      title: 'See Your Patterns',
      content: (
          <>
            <p className="mb-3">
              The <strong>Trends</strong> tab shows your symptom patterns over time.
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Visualize frequency and severity to understand your conditions better
              and demonstrate impact to the VA.
            </p>
          </>
      ),
    },
    {
      id: 'appointments',
      icon: '📅',
      title: 'Track Appointments',
      content: (
          <>
            <p className="mb-3">
              Document <strong>C&P exams, doctor visits, and what was discussed</strong>.
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Keep a record of provider recommendations, diagnoses discussed, and
              follow-up needs. This is invaluable for appeals.
            </p>
          </>
      ),
    },
    {
      id: 'export',
      icon: '📤',
      title: 'Export for Your VSO',
      content: (
          <>
            <p className="mb-3">
              Generate <strong>PDF or CSV reports</strong> to share with your VSO,
              attorney, or doctor.
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Your data stays on your device. Back it up regularly using the Settings page.
            </p>
          </>
      ),
    },
    {
      id: 'privacy',
      icon: '🔔',
      title: 'Your Data, Your Device',
      content: (
          <>
            <p className="mb-3">
              <strong>Everything stays on your phone.</strong> No accounts, no servers,
              no one else can see your health information.
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Use the backup feature in Settings to save your data. You can restore it
              anytime or transfer to a new device.
            </p>
          </>
      ),
    },
  ];

  // General health steps (abbreviated - skip VA-specific content)
  const generalSteps = [
    {
      id: 'welcome',
      icon: '🏥',
      title: 'Track Your Health',
      content: (
          <>
            <p className="mb-3">
              Document your symptoms consistently to share with your healthcare providers.
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Track patterns over time to help your doctors understand your condition better.
            </p>
          </>
      ),
    },
    // ... would include subset of veteran steps minus VA-specific language
  ];

  // Caregiver steps
  const caregiverSteps = [
    {
      id: 'welcome',
      icon: '❤️',
      title: 'Caring for Someone',
      content: (
          <>
            <p className="mb-3">
              Track symptoms for <strong>{patientName || 'your loved one'}</strong> to
              share with their care team.
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Consistent documentation helps providers understand patterns and adjust treatment.
            </p>
          </>
      ),
    },
  ];

  // Select steps based on profile
  const getStepsForProfile = () => {
    switch (selectedProfile) {
      case PROFILE_TYPES.VETERAN:
        return veteranSteps;
      case PROFILE_TYPES.GENERAL:
        return generalSteps;
      case PROFILE_TYPES.CAREGIVER:
        return caregiverSteps;
      default:
        return veteranSteps;
    }
  };

  const steps = [profileStep, ...getStepsForProfile()];
  const currentStepData = steps[currentStep];
  const isFirstStep = currentStep === 0;
  const isLastStep = currentStep === steps.length - 1;
  const isProfileStep = currentStep === 0;

  const handleProfileSelect = (profileOption) => {
    if (!profileOption.available) {
      setShowComingSoon(profileOption.type);
      return;
    }
    setSelectedProfile(profileOption.type);
    setShowComingSoon(null);
  };

  const handleNext = () => {
    if (isProfileStep) {
      // Save profile type when leaving profile selection
      if (selectedProfile) {
        setProfileType(selectedProfile, patientName);
        setCurrentStep(prev => prev + 1);
      }
    } else if (isLastStep) {
      setOnboardingComplete(true);
      onComplete();
    } else {
      setCurrentStep(prev => prev + 1);
    }
  };

  const handlePrev = () => {
    if (!isFirstStep) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const handleSkip = () => {
    // If skipping without profile selection, default to Veteran
    if (!selectedProfile) {
      setProfileType(PROFILE_TYPES.VETERAN);
    }
    setOnboardingComplete(true);
    onComplete();
  };

  // Render profile selection (Step 0)
  const renderProfileSelection = () => (
      <div className="space-y-3">
        {PROFILE_OPTIONS.map((option) => (
            <button
                key={option.type}
                onClick={() => handleProfileSelect(option)}
                className={`w-full p-4 rounded-lg border-2 text-left transition-all ${
                    selectedProfile === option.type
                        ? 'border-blue-600 bg-blue-50 dark:bg-blue-900/20'
                        : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                } ${!option.available ? 'opacity-75' : ''}`}
            >
              <div className="flex items-start gap-3">
                <span className="text-2xl">{option.icon}</span>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold text-gray-900 dark:text-white">
                      {option.title}
                    </h3>
                    {!option.available && (
                        <span className="text-xs px-2 py-0.5 bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400 rounded-full">
                    Coming Soon
                  </span>
                    )}
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {option.subtitle}
                  </p>
                </div>
                {selectedProfile === option.type && (
                    <span className="text-blue-600 text-xl">✓</span>
                )}
              </div>
            </button>
        ))}

        {/* Coming Soon Message */}
        {showComingSoon && (
            <div className="mt-4 p-4 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg">
              <p className="text-sm text-amber-800 dark:text-amber-300">
                {PROFILE_OPTIONS.find(o => o.type === showComingSoon)?.comingSoonMessage}
              </p>
              <button
                  onClick={() => {
                    setSelectedProfile(PROFILE_TYPES.VETERAN);
                    setShowComingSoon(null);
                  }}
                  className="mt-2 text-sm text-blue-600 dark:text-blue-400 underline"
              >
                Continue with Veteran profile for now
              </button>
            </div>
        )}

        {/* Caregiver name input (shown when caregiver selected and available) */}
        {selectedProfile === PROFILE_TYPES.CAREGIVER && (
            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Who are you caring for?
              </label>
              <input
                  type="text"
                  value={patientName}
                  onChange={(e) => setPatientName(e.target.value)}
                  placeholder="Enter their name"
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg
                       bg-white dark:bg-gray-700 text-gray-900 dark:text-white
                       focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
        )}
      </div>
  );

  return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white dark:bg-gray-800 rounded-lg w-full max-w-md overflow-hidden shadow-xl">
          {/* Progress Bar */}
          <div className="h-1 bg-gray-200 dark:bg-gray-700">
            <div
                className="h-full bg-blue-600 transition-all duration-300"
                style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
            />
          </div>

          {/* Content */}
          <div className="p-6">
            {/* Icon (not shown on profile step) */}
            {!isProfileStep && currentStepData.icon && (
                <div className="text-5xl text-center mb-4">
                  {currentStepData.icon}
                </div>
            )}

            {/* Title */}
            <h2 className="text-xl font-bold text-gray-900 dark:text-white text-center mb-4">
              {currentStepData.title}
            </h2>

            {/* Body */}
            <div className="text-gray-700 dark:text-gray-300 mb-6">
              {isProfileStep ? renderProfileSelection() : currentStepData.content}
            </div>

            {/* Step Indicator */}
            <div className="flex justify-center gap-1.5 mb-6">
              {steps.map((_, index) => (
                  <button
                      key={index}
                      onClick={() => {
                        // Only allow going back, not forward
                        if (index < currentStep) {
                          setCurrentStep(index);
                        }
                      }}
                      className={`w-2 h-2 rounded-full transition-all ${
                          index === currentStep
                              ? 'bg-blue-600 w-4'
                              : index < currentStep
                                  ? 'bg-blue-400 cursor-pointer'
                                  : 'bg-gray-300 dark:bg-gray-600'
                      }`}
                      aria-label={`Go to step ${index + 1}`}
                  />
              ))}
            </div>

            {/* Navigation Buttons */}
            <div className="flex gap-3">
              {!isFirstStep && (
                  <button
                      onClick={handlePrev}
                      className="flex-1 py-3 px-4 border border-gray-300 dark:border-gray-600
                           text-gray-700 dark:text-gray-300 font-medium rounded-lg
                           hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                  >
                    Back
                  </button>
              )}

              {isFirstStep && (
                  <button
                      onClick={handleSkip}
                      className="flex-1 py-3 px-4 text-gray-500 dark:text-gray-400 font-medium
                           hover:text-gray-700 dark:hover:text-gray-300 transition-colors"
                  >
                    Skip
                  </button>
              )}

              <button
                  onClick={handleNext}
                  disabled={isProfileStep && !selectedProfile}
                  className={`flex-1 py-3 px-4 font-medium rounded-lg transition-colors ${
                      isProfileStep && !selectedProfile
                          ? 'bg-gray-300 dark:bg-gray-600 text-gray-500 cursor-not-allowed'
                          : 'bg-blue-600 text-white hover:bg-blue-700'
                  }`}
              >
                {isLastStep ? 'Get Started' : 'Next'}
              </button>
            </div>
          </div>
        </div>
      </div>
  );
};

export default OnboardingModal;