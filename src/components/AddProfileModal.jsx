// file: src/components/AddProfileModal.jsx v2 - Profile creation wizard
// Updated to support caregivers caring for veterans with veteran feature access

import { useState } from 'react';
import { createProfile, PROFILE_COLORS, getColorById } from '../utils/profiles';
import { PROFILE_OPTIONS } from '../utils/profile';

/**
 * AddProfileModal - Wizard for creating new profiles
 *
 * Supports both quick-add (name + type) and full wizard (with onboarding-like flow)
 * Now includes option for caregivers to indicate they're caring for a veteran
 */
const AddProfileModal = ({ onClose, onProfileCreated, quickMode = false }) => {
  const [step, setStep] = useState(quickMode ? 'quick' : 'type');
  const [profileType, setProfileType] = useState(null);
  const [profileName, setProfileName] = useState('');
  const [profileColor, setProfileColor] = useState('blue');
  const [isVeteranCaregiver, setIsVeteranCaregiver] = useState(false);
  const [error, setError] = useState('');

  const handleSelectType = (type) => {
    setProfileType(type);
    // Reset veteran caregiver flag when changing type
    if (type !== 'caregiver') {
      setIsVeteranCaregiver(false);
    }
    setError('');
    if (!quickMode) {
      setStep('details');
    }
  };

  const handleCreate = () => {
    if (!profileName.trim()) {
      setError('Profile name is required');
      return;
    }

    if (!profileType) {
      setError('Profile type is required');
      return;
    }

    const result = createProfile({
      name: profileName.trim(),
      type: profileType,
      color: profileColor,
      metadata: {
        isVeteranCaregiver: profileType === 'caregiver' ? isVeteranCaregiver : false,
      },
    });

    if (result.success) {
      onProfileCreated(result.profile);
      onClose();
    } else {
      setError(result.message);
    }
  };

  // Quick mode: Single form
  if (quickMode || step === 'quick') {
    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-xl max-w-md w-full p-6 max-h-[90vh] overflow-y-auto">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              Add New Profile
            </h2>

            {/* Profile Name */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-900 dark:text-white mb-2">
                Profile Name
              </label>
              <input
                  type="text"
                  value={profileName}
                  onChange={(e) => setProfileName(e.target.value)}
                  placeholder="e.g., Mom, Jake, My Health"
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg
                       bg-white dark:bg-gray-700 text-gray-900 dark:text-white
                       focus:ring-2 focus:ring-blue-500"
                  autoFocus
              />
            </div>

            {/* Profile Type */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-900 dark:text-white mb-2">
                Profile Type
              </label>
              <div className="grid grid-cols-3 gap-2">
                {PROFILE_OPTIONS.map((option) => (
                    <button
                        key={option.type}
                        onClick={() => {
                          setProfileType(option.type);
                          if (option.type !== 'caregiver') {
                            setIsVeteranCaregiver(false);
                          }
                        }}
                        className={`p-3 rounded-lg border-2 text-center transition-all ${
                            profileType === option.type
                                ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                                : 'border-gray-300 dark:border-gray-600 hover:border-blue-300'
                        }`}
                    >
                      <div className="text-2xl mb-1">{option.icon}</div>
                      <div className="text-xs font-medium text-gray-900 dark:text-white">
                        {option.title}
                      </div>
                    </button>
                ))}
              </div>
            </div>

            {/* Veteran Caregiver Option - Only show when caregiver is selected */}
            {profileType === 'caregiver' && (
                <div className="mb-4 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                  <label className="flex items-start gap-3 cursor-pointer">
                    <input
                        type="checkbox"
                        checked={isVeteranCaregiver}
                        onChange={(e) => setIsVeteranCaregiver(e.target.checked)}
                        className="mt-1 w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    />
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-lg">🎖️</span>
                        <span className="font-medium text-gray-900 dark:text-white">
                          Caring for a Veteran
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                        Enable VA rating criteria, claims documentation features, and veteran-specific terminology.
                      </p>
                    </div>
                  </label>
                </div>
            )}

            {/* Color */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-900 dark:text-white mb-2">
                Color
              </label>
              <div className="grid grid-cols-5 gap-2">
                {PROFILE_COLORS.map((color) => (
                    <button
                        key={color.id}
                        onClick={() => setProfileColor(color.id)}
                        className={`w-full aspect-square rounded-lg ${color.class} ${
                            profileColor === color.id ? `ring-2 ${color.ring}` : ''
                        }`}
                        title={color.name}
                    />
                ))}
              </div>
            </div>

            {/* Error */}
            {error && (
                <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                  <p className="text-sm text-red-800 dark:text-red-300">{error}</p>
                </div>
            )}

            {/* Buttons */}
            <div className="flex gap-3">
              <button
                  onClick={onClose}
                  className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg
                       text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
              >
                Cancel
              </button>
              <button
                  onClick={handleCreate}
                  className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium"
              >
                Create Profile
              </button>
            </div>
          </div>
        </div>
    );
  }

  // Wizard mode: Step-by-step
  if (step === 'type') {
    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-xl max-w-lg w-full p-6">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              Add New Profile
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Who is this profile for?
            </p>

            <div className="space-y-3 mb-6">
              {PROFILE_OPTIONS.map((option) => (
                  <button
                      key={option.type}
                      onClick={() => handleSelectType(option.type)}
                      className="w-full p-4 rounded-lg border-2 border-gray-300 dark:border-gray-600
                         hover:border-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20
                         text-left transition-all"
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-3xl">{option.icon}</span>
                      <div>
                        <h3 className="font-bold text-gray-900 dark:text-white">{option.title}</h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400">{option.subtitle}</p>
                      </div>
                    </div>
                  </button>
              ))}
            </div>

            <button
                onClick={onClose}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg
                     text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
            >
              Cancel
            </button>
          </div>
        </div>
    );
  }

  // Step: Details (name, veteran caregiver option, and color)
  if (step === 'details') {
    const selectedOption = PROFILE_OPTIONS.find(o => o.type === profileType);

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-xl max-w-md w-full p-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center gap-3 mb-6">
              <span className="text-3xl">{selectedOption?.icon}</span>
              <div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                  {selectedOption?.title} Profile
                </h2>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {selectedOption?.subtitle}
                </p>
              </div>
            </div>

            {/* Name */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-900 dark:text-white mb-2">
                {profileType === 'caregiver' ? 'Who are you caring for?' : 'Profile Name'}
              </label>
              <input
                  type="text"
                  value={profileName}
                  onChange={(e) => setProfileName(e.target.value)}
                  placeholder={profileType === 'caregiver' ? 'e.g., Mom, Dad, John' : 'e.g., My Health, VA Claims'}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg
                       bg-white dark:bg-gray-700 text-gray-900 dark:text-white
                       focus:ring-2 focus:ring-blue-500"
                  autoFocus
              />
            </div>

            {/* Veteran Caregiver Option - Only show for caregiver type */}
            {profileType === 'caregiver' && (
                <div className="mb-4 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                  <label className="flex items-start gap-3 cursor-pointer">
                    <input
                        type="checkbox"
                        checked={isVeteranCaregiver}
                        onChange={(e) => setIsVeteranCaregiver(e.target.checked)}
                        className="mt-1 w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    />
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-lg">🎖️</span>
                        <span className="font-medium text-gray-900 dark:text-white">
                          Caring for a Veteran
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                        Enable VA rating criteria, claims documentation features, and veteran-specific terminology for tracking symptoms related to VA disability claims.
                      </p>
                    </div>
                  </label>
                </div>
            )}

            {/* Color */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-900 dark:text-white mb-2">
                Choose a color
              </label>
              <div className="grid grid-cols-5 gap-2">
                {PROFILE_COLORS.map((color) => (
                    <button
                        key={color.id}
                        onClick={() => setProfileColor(color.id)}
                        className={`w-full aspect-square rounded-lg ${color.class} ${
                            profileColor === color.id ? `ring-2 ${color.ring}` : ''
                        }`}
                        title={color.name}
                    />
                ))}
              </div>
            </div>

            {/* Error */}
            {error && (
                <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                  <p className="text-sm text-red-800 dark:text-red-300">{error}</p>
                </div>
            )}

            {/* Buttons */}
            <div className="flex gap-3">
              <button
                  onClick={() => {
                    setStep('type');
                    setIsVeteranCaregiver(false);
                  }}
                  className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg
                       text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
              >
                Back
              </button>
              <button
                  onClick={handleCreate}
                  className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium"
              >
                Create Profile
              </button>
            </div>
          </div>
        </div>
    );
  }

  return null;
};

export default AddProfileModal;