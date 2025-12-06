// Profile types and configuration
// Allows app to serve Veterans, general health tracking, and caregivers

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

/**
 * Get profile configuration by type
 */
export const getProfileConfig = (profileType) => {
  return PROFILE_CONFIG[profileType] || PROFILE_CONFIG[PROFILE_TYPES.VETERAN];
};

/**
 * Check if a feature is enabled for a profile type
 */
export const isFeatureEnabled = (profileType, feature) => {
  const config = getProfileConfig(profileType);
  return config.features[feature] === true;
};

/**
 * Get terminology for a profile type
 */
export const getTerminology = (profileType, term) => {
  const config = getProfileConfig(profileType);
  return config.terminology[term] || term;
};

/**
 * Get display name for profile type
 */
export const getProfileName = (profileType) => {
  const config = getProfileConfig(profileType);
  return config.name;
};