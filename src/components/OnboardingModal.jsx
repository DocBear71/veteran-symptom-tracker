import { useState } from 'react';

const OnboardingModal = ({ onComplete }) => {
  const [currentStep, setCurrentStep] = useState(0);

  const steps = [
    {
      id: 'welcome',
      icon: '🎖️',
      title: 'Welcome, Veteran',
      content: (
          <>
            <p className="mb-3">
              This app helps you <strong>document your symptoms consistently</strong> to
              support your VA disability claims.
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              The VA looks for patterns and frequency. Regular logging creates the
              evidence you need.
            </p>
          </>
      ),
    },
    {
      id: 'quick-log',
      icon: '⚡',
      title: 'Quick Log for Chronic Conditions',
      content: (
          <>
            <p className="mb-3">
              Add your <strong>chronic conditions</strong> for one-tap logging from the home screen.
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Perfect for conditions you track daily like back pain, migraines, or anxiety.
              Tap once, adjust severity, and you're done.
            </p>
          </>
      ),
    },
    {
      id: 'details',
      icon: '📋',
      title: 'VA-Aligned Details',
      content: (
          <>
            <p className="mb-3">
              The app captures <strong>details that matter for VA ratings</strong>:
            </p>
            <ul className="text-sm space-y-2 text-gray-600 dark:text-gray-400">
              <li>• <strong>Migraines:</strong> Prostrating vs. non-prostrating, duration</li>
              <li>• <strong>Pain:</strong> Flare-ups, range of motion, affected activities</li>
              <li>• <strong>Mental Health:</strong> Flashbacks, avoidance, hypervigilance</li>
              <li>• <strong>Sleep:</strong> Hours, quality, nightmares</li>
            </ul>
          </>
      ),
    },
    {
      id: 'medications',
      icon: '💊',
      title: 'Track Medications',
      content: (
          <>
            <p className="mb-3">
              Log medications you take for your symptoms. This shows the VA you're
              <strong> actively managing your conditions</strong>.
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Link medications to specific symptom entries to show what you needed
              to take and when.
            </p>
          </>
      ),
    },
    {
      id: 'appointments',
      icon: '🏥',
      title: 'Document Appointments',
      content: (
          <>
            <p className="mb-3">
              Record your <strong>C&P exams and medical visits</strong> while the details
              are fresh.
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Note what was discussed, what the examiner said, and any follow-ups needed.
              This is invaluable for appeals.
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
      icon: '🔒',
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

  const currentStepData = steps[currentStep];
  const isLastStep = currentStep === steps.length - 1;
  const isFirstStep = currentStep === 0;

  const handleNext = () => {
    if (isLastStep) {
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
    onComplete();
  };

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
            {/* Icon */}
            <div className="text-5xl text-center mb-4">
              {currentStepData.icon}
            </div>

            {/* Title */}
            <h2 className="text-xl font-bold text-gray-900 dark:text-white text-center mb-4">
              {currentStepData.title}
            </h2>

            {/* Body */}
            <div className="text-gray-700 dark:text-gray-300 mb-6">
              {currentStepData.content}
            </div>

            {/* Step Indicator */}
            <div className="flex justify-center gap-1.5 mb-6">
              {steps.map((_, index) => (
                  <button
                      key={index}
                      onClick={() => setCurrentStep(index)}
                      className={`w-2 h-2 rounded-full transition-all ${
                          index === currentStep
                              ? 'bg-blue-600 w-4'
                              : index < currentStep
                                  ? 'bg-blue-400'
                                  : 'bg-gray-300 dark:bg-gray-600'
                      }`}
                      aria-label={`Go to step ${index + 1}`}
                  />
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="px-6 pb-6 flex gap-3">
            {isFirstStep ? (
                <button
                    onClick={handleSkip}
                    className="flex-1 py-2 px-4 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 text-sm"
                >
                  Skip Tutorial
                </button>
            ) : (
                <button
                    onClick={handlePrev}
                    className="flex-1 py-2 px-4 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700"
                >
                  Back
                </button>
            )}
            <button
                onClick={handleNext}
                className="flex-1 py-3 px-4 bg-blue-900 dark:bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-800 dark:hover:bg-blue-700"
            >
              {isLastStep ? "Get Started" : "Next"}
            </button>
          </div>
        </div>
      </div>
  );
};

export default OnboardingModal;