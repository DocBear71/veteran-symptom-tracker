import { useState } from 'react';
import { PROFILE_OPTIONS, setProfileType } from '../utils/profile';

/**
 * ProfileSelection Component
 * Allows users to select their profile type (Veteran, General, Caregiver)
 * Used in onboarding and settings
 */
const ProfileSelection = ({ onSelect, showTitle = true }) => {
  const [selectedType, setSelectedType] = useState(null);
  const [caregiverName, setCaregiverName] = useState('');
  const [error, setError] = useState('');

  const handleSelect = (type) => {
    setSelectedType(type);
    setError('');
  };

  const handleContinue = () => {
    if (!selectedType) {
      setError('Please select a profile type');
      return;
    }

    if (selectedType === 'caregiver' && !caregiverName.trim()) {
      setError('Please enter the person\'s name');
      return;
    }

    // Save profile
    const result = setProfileType(selectedType, caregiverName);

    if (result.success) {
      onSelect(selectedType, caregiverName);
    } else {
      setError(result.message);
    }
  };

  return (
      <div className="max-w-4xl mx-auto">
        {showTitle && (
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-3">
                Choose Your Profile
              </h2>
              <p className="text-gray-600 dark:text-gray-400">
                This helps us customize the app for your needs
              </p>
            </div>
        )}

        <div className="grid md:grid-cols-3 gap-4 mb-6">
          {PROFILE_OPTIONS.map((profile) => (
              <button
                  key={profile.type}
                  onClick={() => profile.available && handleSelect(profile.type)}
                  disabled={!profile.available}
                  className={`relative p-6 rounded-xl border-2 text-left transition-all ${
                      selectedType === profile.type
                          ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                          : profile.available
                              ? 'border-gray-300 dark:border-gray-600 hover:border-blue-300 dark:hover:border-blue-700 bg-white dark:bg-gray-800'
                              : 'border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 opacity-50 cursor-not-allowed'
                  }`}
              >
                {/* Icon */}
                <div className="text-4xl mb-3">{profile.icon}</div>

                {/* Title */}
                <h3 className="font-bold text-lg text-gray-900 dark:text-white mb-1">
                  {profile.title}
                </h3>

                {/* Subtitle */}
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                  {profile.subtitle}
                </p>

                {/* Description */}
                <p className="text-xs text-gray-500 dark:text-gray-500">
                  {profile.description}
                </p>

                {/* Coming Soon Badge */}
                {!profile.available && (
                    <div className="absolute top-4 right-4 px-2 py-1 bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300 text-xs rounded-full">
                      Coming Soon
                    </div>
                )}

                {/* Selected Indicator */}
                {selectedType === profile.type && (
                    <div className="absolute top-4 right-4 w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                      <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                )}
              </button>
          ))}
        </div>

        {/* Caregiver Name Input */}
        {selectedType === 'caregiver' && (
            <div className="mb-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
              <label className="block text-sm font-medium text-gray-900 dark:text-white mb-2">
                Who are you caring for?
              </label>
              <input
                  type="text"
                  value={caregiverName}
                  onChange={(e) => setCaregiverName(e.target.value)}
                  placeholder="Enter their name (e.g., Mom, John, Sarah)"
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg
                     bg-white dark:bg-gray-800 text-gray-900 dark:text-white
                     focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  autoFocus
              />
              <p className="text-xs text-gray-600 dark:text-gray-400 mt-2">
                This name will appear throughout the app (e.g., "Mom's symptoms", "Tracking for John")
              </p>
            </div>
        )}

        {/* Error Message */}
        {error && (
            <div className="mb-6 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
              <p className="text-sm text-red-800 dark:text-red-300">{error}</p>
            </div>
        )}

        {/* Continue Button */}
        <div className="flex justify-center">
          <button
              onClick={handleContinue}
              disabled={!selectedType}
              className={`px-8 py-3 rounded-lg font-medium transition-colors ${
                  selectedType
                      ? 'bg-blue-600 hover:bg-blue-700 text-white'
                      : 'bg-gray-300 dark:bg-gray-700 text-gray-500 dark:text-gray-500 cursor-not-allowed'
              }`}
          >
            Continue
          </button>
        </div>
      </div>
  );
};

export default ProfileSelection;