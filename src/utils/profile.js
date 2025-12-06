// ============================================
// PROFILE MANAGEMENT
// ============================================
// Handles user profile types (Veteran, General, Caregiver)
// This determines terminology, features shown, and evaluation frameworks

const PROFILE_KEY = 'symptomTracker_profile';
const ONBOARDING_KEY = 'symptomTracker_onboardingComplete';

// Profile type constants
export const PROFILE_TYPES = {
  VETERAN: 'veteran',
  GENERAL: 'general',
  CAREGIVER: 'caregiver',
};

// Default profile structure
const DEFAULT_PROFILE = {
  type: null, // Set during onboarding
  patientName: '', // Only used for caregiver mode
  createdAt: null,
  updatedAt: null,
};

// Get the current profile
export const getProfile = () => {
  try {
    const data = localStorage.getItem(PROFILE_KEY);
    return data ? JSON.parse(data) : DEFAULT_PROFILE;
  } catch (error) {
    console.error('Error reading profile:', error);
    return DEFAULT_PROFILE;
  }
};

// Save/update profile
export const saveProfile = (profileData) => {
  try {
    const existing = getProfile();
    const updated = {
      ...existing,
      ...profileData,
      updatedAt: new Date().toISOString(),
      createdAt: existing.createdAt || new Date().toISOString(),
    };
    localStorage.setItem(PROFILE_KEY, JSON.stringify(updated));
    return { success: true, profile: updated };
  } catch (error) {
    console.error('Error saving profile:', error);
    return { success: false, message: error.message };
  }
};

// Set profile type (used during onboarding)
export const setProfileType = (type, patientName = '') => {
  if (!Object.values(PROFILE_TYPES).includes(type)) {
    return { success: false, message: 'Invalid profile type' };
  }
  return saveProfile({ type, patientName });
};

// Get profile type
export const getProfileType = () => {
  const profile = getProfile();
  return profile.type;
};

// Check if profile is set up
export const hasProfile = () => {
  const profile = getProfile();
  return profile.type !== null;
};

// Check if user is a veteran
export const isVeteran = () => {
  return getProfileType() === PROFILE_TYPES.VETERAN;
};

// Check if user is a caregiver
export const isCaregiver = () => {
  return getProfileType() === PROFILE_TYPES.CAREGIVER;
};

// Get patient name (for caregiver mode)
export const getPatientName = () => {
  const profile = getProfile();
  return profile.patientName || 'Patient';
};

// Onboarding status
export const isOnboardingComplete = () => {
  return localStorage.getItem(ONBOARDING_KEY) === 'true';
};

export const setOnboardingComplete = (complete = true) => {
  localStorage.setItem(ONBOARDING_KEY, complete.toString());
};

// Reset profile (for testing or "start over")
export const resetProfile = () => {
  localStorage.removeItem(PROFILE_KEY);
  localStorage.removeItem(ONBOARDING_KEY);
};

// ============================================
// PROFILE-AWARE LABELS & TERMINOLOGY
// ============================================
// Returns appropriate text based on profile type

export const getLabels = () => {
  const type = getProfileType();
  const patientName = getPatientName();

  // Base labels that change by profile
  const labels = {
    // App header
    appTitle: {
      [PROFILE_TYPES.VETERAN]: 'Veteran Symptom Tracker',
      [PROFILE_TYPES.GENERAL]: 'Symptom Tracker',
      [PROFILE_TYPES.CAREGIVER]: `${patientName}'s Symptom Tracker`,
    },
    appSubtitle: {
      [PROFILE_TYPES.VETERAN]: 'Document symptoms for VA claims',
      [PROFILE_TYPES.GENERAL]: 'Track your daily symptoms',
      [PROFILE_TYPES.CAREGIVER]: `Tracking symptoms for ${patientName}`,
    },

    // Quick Log
    quickLogHeader: {
      [PROFILE_TYPES.VETERAN]: 'Quick Log',
      [PROFILE_TYPES.GENERAL]: 'Quick Log',
      [PROFILE_TYPES.CAREGIVER]: `Log for ${patientName}`,
    },

    // Export terminology
    exportRecipient: {
      [PROFILE_TYPES.VETERAN]: 'VSO or Attorney',
      [PROFILE_TYPES.GENERAL]: 'Doctor',
      [PROFILE_TYPES.CAREGIVER]: 'Care Team',
    },
    exportDescription: {
      [PROFILE_TYPES.VETERAN]: 'Generate reports for your VA claim',
      [PROFILE_TYPES.GENERAL]: 'Generate reports for your doctor',
      [PROFILE_TYPES.CAREGIVER]: `Generate reports for ${patientName}'s care team`,
    },

    // Possessive references
    yourSymptoms: {
      [PROFILE_TYPES.VETERAN]: 'your symptoms',
      [PROFILE_TYPES.GENERAL]: 'your symptoms',
      [PROFILE_TYPES.CAREGIVER]: `${patientName}'s symptoms`,
    },
    youExperienced: {
      [PROFILE_TYPES.VETERAN]: 'you experienced',
      [PROFILE_TYPES.GENERAL]: 'you experienced',
      [PROFILE_TYPES.CAREGIVER]: `${patientName} experienced`,
    },
  };

  // Return labels for current profile type, with fallback to general
  const currentType = type || PROFILE_TYPES.GENERAL;

  return Object.keys(labels).reduce((acc, key) => {
    acc[key] = labels[key][currentType] || labels[key][PROFILE_TYPES.GENERAL];
    return acc;
  }, {});
};

// ============================================
// FEATURE FLAGS BY PROFILE
// ============================================
// Determines which features are visible/enabled

export const getFeatureFlags = () => {
  const type = getProfileType();

  return {
    // VA-specific features
    showRatingCorrelation: type === PROFILE_TYPES.VETERAN,
    showVATerminology: type === PROFILE_TYPES.VETERAN,
    showCPExamPrep: type === PROFILE_TYPES.VETERAN,

    // Caregiver-specific features
    showPatientNameInHeader: type === PROFILE_TYPES.CAREGIVER,
    showSimplifiedMode: type === PROFILE_TYPES.CAREGIVER, // Future: larger buttons, simpler flows

    // Universal features (always shown)
    showTrends: true,
    showExport: true,
    showMedications: true,
    showAppointments: true,
    showNotifications: true,
  };
};

// ============================================
// PROFILE INFO FOR DISPLAY
// ============================================

export const PROFILE_OPTIONS = [
  {
    type: PROFILE_TYPES.VETERAN,
    icon: '🎖️',
    title: 'Veteran',
    subtitle: 'Documenting for VA disability claims',
    description: 'Includes VA rating schedule correlation, C&P exam prep guidance, and VSO-ready exports.',
    available: true,
  },
  {
    type: PROFILE_TYPES.GENERAL,
    icon: '🏥',
    title: 'General Health',
    subtitle: 'Tracking symptoms for medical care',
    description: 'Track patterns for doctor visits, treatment efficacy, and health management.',
    available: true,

  },
  {
    type: PROFILE_TYPES.CAREGIVER,
    icon: '❤️',
    title: 'Caregiver',
    subtitle: 'Tracking for someone in your care',
    description: 'Document symptoms for a family member or patient with simplified logging and care team exports.',
    available: true,

  },
];