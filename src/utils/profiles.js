/**
 * MULTI-PROFILE SYSTEM
 *
 * Allows users to create and switch between multiple profiles.
 * Each profile has completely separate data (logs, meds, appointments, etc.)
 *
 * Use cases:
 * - Parent tracking multiple children
 * - Caregiver for multiple patients
 * - Veteran tracking both VA claims + general health
 */

const PROFILES_KEY = 'symptomTracker_profiles';
const ACTIVE_PROFILE_KEY = 'symptomTracker_activeProfileId';
const MIGRATION_KEY = 'symptomTracker_multiProfileMigration';

// Available profile colors for visual distinction
export const PROFILE_COLORS = [
  { id: 'blue', name: 'Blue', class: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200', ring: 'ring-blue-500' },
  { id: 'green', name: 'Green', class: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200', ring: 'ring-green-500' },
  { id: 'red', name: 'Red', class: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200', ring: 'ring-red-500' },
  { id: 'purple', name: 'Purple', class: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200', ring: 'ring-purple-500' },
  { id: 'orange', name: 'Orange', class: 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200', ring: 'ring-orange-500' },
  { id: 'pink', name: 'Pink', class: 'bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-200', ring: 'ring-pink-500' },
  { id: 'yellow', name: 'Yellow', class: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200', ring: 'ring-yellow-500' },
  { id: 'indigo', name: 'Indigo', class: 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200', ring: 'ring-indigo-500' },
  { id: 'teal', name: 'Teal', class: 'bg-teal-100 text-teal-800 dark:bg-teal-900 dark:text-teal-200', ring: 'ring-teal-500' },
  { id: 'gray', name: 'Gray', class: 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200', ring: 'ring-gray-500' },
];

/**
 * Get color object by ID
 */
export const getColorById = (colorId) => {
  return PROFILE_COLORS.find(c => c.id === colorId) || PROFILE_COLORS[0];
};

/**
 * Get all profiles
 */
export const getProfiles = () => {
  try {
    const data = localStorage.getItem(PROFILES_KEY);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error('Error reading profiles:', error);
    return [];
  }
};

/**
 * Save profiles array
 */
const saveProfiles = (profiles) => {
  try {
    localStorage.setItem(PROFILES_KEY, JSON.stringify(profiles));
    return { success: true };
  } catch (error) {
    console.error('Error saving profiles:', error);
    return { success: false, message: error.message };
  }
};

/**
 * Get active profile ID
 */
export const getActiveProfileId = () => {
  return localStorage.getItem(ACTIVE_PROFILE_KEY);
};

/**
 * Get active profile object
 */
export const getActiveProfile = () => {
  const activeId = getActiveProfileId();
  if (!activeId) return null;

  const profiles = getProfiles();
  return profiles.find(p => p.id === activeId) || null;
};

/**
 * Get profile by ID
 */
export const getProfileById = (profileId) => {
  const profiles = getProfiles();
  return profiles.find(p => p.id === profileId) || null;
};

/**
 * Set active profile
 * Also syncs the profile type to the global profile settings
 */
export const setActiveProfile = (profileId) => {
  const profile = getProfileById(profileId);
  if (!profile) {
    return { success: false, message: 'Profile not found' };
  }

  try {
    localStorage.setItem(ACTIVE_PROFILE_KEY, profileId);

    // CRITICAL: Sync the profile type to the global profile settings
    // This ensures useProfile hook and feature flags work correctly
    const globalProfileKey = 'symptomTracker_profile';
    const existingGlobalProfile = JSON.parse(localStorage.getItem(globalProfileKey) || '{}');
    const updatedGlobalProfile = {
      ...existingGlobalProfile,
      type: profile.type,
      patientName: profile.metadata?.patientName || profile.name || '',
      updatedAt: new Date().toISOString(),
      // Store reference to the active multi-profile
      activeProfileId: profileId,
      activeProfileName: profile.name,
    };
    localStorage.setItem(globalProfileKey, JSON.stringify(updatedGlobalProfile));

    // Mark onboarding as complete for this profile type
    // (prevents re-showing onboarding on profile switch)
    localStorage.setItem('symptomTracker_onboardingComplete', 'true');

    // Trigger storage event for other tabs/components
    window.dispatchEvent(new CustomEvent('profileChanged', {
      detail: { profileId, profile }
    }));

    // Also trigger a storage event so useProfile hook can detect the change
    window.dispatchEvent(new StorageEvent('storage', {
      key: globalProfileKey,
      newValue: JSON.stringify(updatedGlobalProfile),
    }));

    return { success: true, profile };
  } catch (error) {
    console.error('Error setting active profile:', error);
    return { success: false, message: error.message };
  }
};

/**
 * Create new profile
 */
export const createProfile = ({ name, type, color, metadata = {} }) => {
  if (!name || !type) {
    return { success: false, message: 'Name and type are required' };
  }

  const profiles = getProfiles();

  // Check profile limit
  if (profiles.length >= 10) {
    return { success: false, message: 'Maximum 10 profiles allowed' };
  }

  // Check for duplicate names
  if (profiles.some(p => p.name.toLowerCase() === name.toLowerCase())) {
    return { success: false, message: 'A profile with this name already exists' };
  }

  const newProfile = {
    id: crypto.randomUUID(),
    name,
    type, // veteran, general, caregiver
    color: color || 'blue',
    metadata,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  profiles.push(newProfile);
  const result = saveProfiles(profiles);

  if (result.success) {
    return { success: true, profile: newProfile };
  }
  return result;
};

/**
 * Update profile
 */
export const updateProfile = (profileId, updates) => {
  const profiles = getProfiles();
  const index = profiles.findIndex(p => p.id === profileId);

  if (index === -1) {
    return { success: false, message: 'Profile not found' };
  }

  // Check for duplicate names (excluding current profile)
  if (updates.name) {
    const duplicate = profiles.find((p, i) =>
        i !== index && p.name.toLowerCase() === updates.name.toLowerCase()
    );
    if (duplicate) {
      return { success: false, message: 'A profile with this name already exists' };
    }
  }

  profiles[index] = {
    ...profiles[index],
    ...updates,
    id: profileId, // Don't allow ID changes
    updatedAt: new Date().toISOString(),
  };

  const result = saveProfiles(profiles);

  if (result.success) {
    // Trigger update event
    window.dispatchEvent(new CustomEvent('profileUpdated', {
      detail: { profileId, profile: profiles[index] }
    }));
    return { success: true, profile: profiles[index] };
  }
  return result;
};

/**
 * Delete profile
 */
export const deleteProfile = (profileId) => {
  const profiles = getProfiles();
  const index = profiles.findIndex(p => p.id === profileId);

  if (index === -1) {
    return { success: false, message: 'Profile not found' };
  }

  // Can't delete if it's the only profile
  if (profiles.length === 1) {
    return { success: false, message: 'Cannot delete the only profile' };
  }

  const isActive = getActiveProfileId() === profileId;

  // Remove profile
  const deletedProfile = profiles[index];
  profiles.splice(index, 1);

  const result = saveProfiles(profiles);

  if (result.success) {
    // Delete all data associated with this profile
    deleteProfileData(profileId);

    // If this was the active profile, switch to another
    if (isActive) {
      setActiveProfile(profiles[0].id);
    }

    return { success: true, deletedProfile };
  }
  return result;
};

/**
 * Delete all data associated with a profile
 */
const deleteProfileData = (profileId) => {
  const keysToDelete = [
    `symptomTracker_logs_${profileId}`,
    `symptomTracker_customSymptoms_${profileId}`,
    `symptomTracker_favorites_${profileId}`,
    `symptomTracker_medications_${profileId}`,
    `symptomTracker_medicationLogs_${profileId}`,
    `symptomTracker_appointments_${profileId}`,
    `symptomTracker_reminderSettings_${profileId}`,
    `symptomTracker_sleepApneaProfile_${profileId}`,
  ];

  keysToDelete.forEach(key => {
    localStorage.removeItem(key);
  });
};

/**
 * Get profile count
 */
export const getProfileCount = () => {
  return getProfiles().length;
};

/**
 * Check if multi-profile system is initialized
 */
export const isMultiProfileInitialized = () => {
  return localStorage.getItem(MIGRATION_KEY) === 'true';
};

/**
 * Mark multi-profile migration as complete
 */
export const markMigrationComplete = () => {
  localStorage.setItem(MIGRATION_KEY, 'true');
};

/**
 * Get profile icon based on type
 */
export const getProfileIcon = (type) => {
  const icons = {
    veteran: '🎖️',
    general: '🏥',
    caregiver: '❤️',
  };
  return icons[type] || '👤';
};

/**
 * Get profile stats (number of logs, meds, etc.)
 */
export const getProfileStats = (profileId) => {
  try {
    const logs = JSON.parse(localStorage.getItem(`symptomTracker_logs_${profileId}`) || '[]');
    const meds = JSON.parse(localStorage.getItem(`symptomTracker_medications_${profileId}`) || '[]');
    const appointments = JSON.parse(localStorage.getItem(`symptomTracker_appointments_${profileId}`) || '[]');

    return {
      logs: logs.length,
      medications: meds.filter(m => m.isActive).length,
      appointments: appointments.length,
    };
  } catch (error) {
    console.error('Error getting profile stats:', error);
    return { logs: 0, medications: 0, appointments: 0 };
  }
};

// =============================================================================
// SERVICE-CONNECTED CONDITIONS MANAGEMENT
// =============================================================================

/**
 * Add a service-connected condition to a profile
 * @param {string} profileId - Profile ID
 * @param {object} condition - Condition object
 * @returns {object} Result with success status and updated profile
 */
export const addServiceConnectedCondition = (profileId, condition) => {
  const profiles = getProfiles();
  const profile = profiles.find(p => p.id === profileId);

  if (!profile) {
    return { success: false, message: 'Profile not found' };
  }

  // Ensure serviceConnectedConditions array exists
  if (!profile.serviceConnectedConditions) {
    profile.serviceConnectedConditions = [];
  }

  // Create condition with ID and timestamp
  const newCondition = {
    id: crypto.randomUUID(),
    conditionKey: condition.conditionKey,
    conditionName: condition.conditionName,
    currentRating: condition.currentRating,
    effectiveDate: condition.effectiveDate,
    trackingGoal: condition.trackingGoal || 'maintain',
    notes: condition.notes || '',
    addedAt: new Date().toISOString(),
  };

  profile.serviceConnectedConditions.push(newCondition);
  profile.updatedAt = new Date().toISOString();

  const result = saveProfiles(profiles);

  if (result.success) {
    return { success: true, profile, condition: newCondition };
  }
  return result;
};

/**
 * Update a service-connected condition
 * @param {string} profileId - Profile ID
 * @param {string} conditionId - Condition ID
 * @param {object} updates - Updated fields
 * @returns {object} Result with success status
 */
export const updateServiceConnectedCondition = (profileId, conditionId, updates) => {
  const profiles = getProfiles();
  const profile = profiles.find(p => p.id === profileId);

  if (!profile) {
    return { success: false, message: 'Profile not found' };
  }

  const condition = profile.serviceConnectedConditions?.find(c => c.id === conditionId);

  if (!condition) {
    return { success: false, message: 'Condition not found' };
  }

  // Update allowed fields
  Object.keys(updates).forEach(key => {
    if (['currentRating', 'effectiveDate', 'trackingGoal', 'notes'].includes(key)) {
      condition[key] = updates[key];
    }
  });

  profile.updatedAt = new Date().toISOString();

  const result = saveProfiles(profiles);

  if (result.success) {
    return { success: true, profile, condition };
  }
  return result;
};

/**
 * Remove a service-connected condition
 * @param {string} profileId - Profile ID
 * @param {string} conditionId - Condition ID
 * @returns {object} Result with success status
 */
export const removeServiceConnectedCondition = (profileId, conditionId) => {
  const profiles = getProfiles();
  const profile = profiles.find(p => p.id === profileId);

  if (!profile) {
    return { success: false, message: 'Profile not found' };
  }

  if (!profile.serviceConnectedConditions) {
    return { success: true, profile }; // Nothing to remove
  }

  profile.serviceConnectedConditions = profile.serviceConnectedConditions.filter(
      c => c.id !== conditionId
  );

  profile.updatedAt = new Date().toISOString();

  const result = saveProfiles(profiles);

  if (result.success) {
    return { success: true, profile };
  }
  return result;
};

/**
 * Get all service-connected conditions for a profile
 * @param {string} profileId - Profile ID
 * @returns {array} Array of service-connected conditions
 */
export const getServiceConnectedConditions = (profileId) => {
  const profile = getProfileById(profileId);
  return profile?.serviceConnectedConditions || [];
};

/**
 * Check if a condition is service-connected for a profile
 * @param {string} profileId - Profile ID
 * @param {string} conditionKey - Condition key to check
 * @returns {object|null} Service-connected condition object or null
 */
export const getServiceConnectedCondition = (profileId, conditionKey) => {
  const conditions = getServiceConnectedConditions(profileId);
  return conditions.find(c => c.conditionKey === conditionKey) || null;
};