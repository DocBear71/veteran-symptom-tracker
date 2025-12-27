// file: src/utils/profileTypes.js v2 - Profile types and configuration
// Updated to support caregivers caring for veterans with veteran feature access
// Allows app to serve Veterans, general health tracking, and caregivers (including caregivers for veterans)

export const PROFILE_TYPES = {
  VETERAN: 'veteran',
  GENERAL: 'general',
  CAREGIVER: 'caregiver',
};

export const PROFILE_CONFIG = {
  [PROFILE_TYPES.VETERAN]: {
    id: 'veteran',
    name: 'Veteran',
    description: 'Track symptoms for VA disability claims',
    features: {
      ratingEvidence: true,
      vaTerminology: true,
      claimsFocus: true,
      serviceConnection: true,
    },
    terminology: {
      symptoms: 'Symptoms',
      tracking: 'Symptom Tracking',
      documentation: 'Claims Documentation',
      evidence: 'Rating Evidence',
      export: 'Export for VA Claim',
    },
    icon: '🎖️',
  },
  [PROFILE_TYPES.GENERAL]: {
    id: 'general',
    name: 'General Health',
    description: 'Track symptoms and health conditions',
    features: {
      ratingEvidence: false,
      vaTerminology: false,
      claimsFocus: false,
      serviceConnection: false,
    },
    terminology: {
      symptoms: 'Symptoms',
      tracking: 'Health Tracking',
      documentation: 'Medical Documentation',
      evidence: 'Symptom Analysis',
      export: 'Export Health Records',
    },
    icon: '🏥',
  },
  [PROFILE_TYPES.CAREGIVER]: {
    id: 'caregiver',
    name: 'Caregiver',
    description: 'Track symptoms for someone you care for',
    features: {
      ratingEvidence: false,
      vaTerminology: false,
      claimsFocus: false,
      serviceConnection: false,
      careRecipientName: true,
    },
    terminology: {
      symptoms: 'Symptoms',
      tracking: 'Care Tracking',
      documentation: 'Care Documentation',
      evidence: 'Symptom Patterns',
      export: 'Export Care Records',
    },
    icon: '❤️',
  },
};

// Configuration for caregiver profiles caring for a veteran
// When isVeteranCaregiver is true, these features override the standard caregiver config
export const CAREGIVER_VETERAN_CONFIG = {
  features: {
    ratingEvidence: true,
    vaTerminology: true,
    claimsFocus: true,
    serviceConnection: true,
    careRecipientName: true,
  },
  terminology: {
    symptoms: 'Symptoms',
    tracking: 'VA Care Tracking',
    documentation: 'VA Claims Documentation',
    evidence: 'Rating Evidence',
    export: 'Export for VA Claim',
  },
};

/**
 * Get profile configuration by type
 * @param {string} profileType - The profile type (veteran, general, caregiver)
 * @param {boolean} isVeteranCaregiver - Whether this caregiver is caring for a veteran
 */
export const getProfileConfig = (profileType, isVeteranCaregiver = false) => {
  const baseConfig = PROFILE_CONFIG[profileType] || PROFILE_CONFIG[PROFILE_TYPES.VETERAN];

  // If this is a caregiver for a veteran, merge in veteran features
  if (profileType === PROFILE_TYPES.CAREGIVER && isVeteranCaregiver) {
    return {
      ...baseConfig,
      features: {
        ...baseConfig.features,
        ...CAREGIVER_VETERAN_CONFIG.features,
      },
      terminology: {
        ...baseConfig.terminology,
        ...CAREGIVER_VETERAN_CONFIG.terminology,
      },
    };
  }

  return baseConfig;
};

/**
 * Check if a feature is enabled for a profile type
 * @param {string} profileType - The profile type
 * @param {string} feature - The feature to check
 * @param {boolean} isVeteranCaregiver - Whether this caregiver is caring for a veteran
 */
export const isFeatureEnabled = (profileType, feature, isVeteranCaregiver = false) => {
  const config = getProfileConfig(profileType, isVeteranCaregiver);
  return config.features[feature] === true;
};

/**
 * Get terminology for a profile type
 * @param {string} profileType - The profile type
 * @param {string} term - The terminology key
 * @param {boolean} isVeteranCaregiver - Whether this caregiver is caring for a veteran
 */
export const getTerminology = (profileType, term, isVeteranCaregiver = false) => {
  const config = getProfileConfig(profileType, isVeteranCaregiver);
  return config.terminology[term] || term;
};

/**
 * Get display name for profile type
 * @param {string} profileType - The profile type
 * @param {boolean} isVeteranCaregiver - Whether this caregiver is caring for a veteran
 */
export const getProfileName = (profileType, isVeteranCaregiver = false) => {
  const config = getProfileConfig(profileType, isVeteranCaregiver);
  if (profileType === PROFILE_TYPES.CAREGIVER && isVeteranCaregiver) {
    return 'Caregiver (Veteran)';
  }
  return config.name;
};

/**
 * Check if a profile should have veteran features
 * This is true for veteran profiles OR caregiver profiles caring for veterans
 * @param {string} profileType - The profile type
 * @param {boolean} isVeteranCaregiver - Whether this caregiver is caring for a veteran
 */
export const hasVeteranFeatures = (profileType, isVeteranCaregiver = false) => {
  return profileType === PROFILE_TYPES.VETERAN ||
      (profileType === PROFILE_TYPES.CAREGIVER && isVeteranCaregiver);
};