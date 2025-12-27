// file: src/hooks/useProfile.jsx v2 - Profile context and hook
// Updated to support caregivers caring for veterans with veteran feature access

import { useState, useEffect, useCallback, createContext, useContext } from 'react';
import {
  getProfile,
  getProfileType,
  getLabels,
  getFeatureFlags,
  isOnboardingComplete,
  hasProfile,
  PROFILE_TYPES,
} from '../utils/profile.js';
import { getActiveProfile } from '../utils/profiles.js';

// ============================================
// PROFILE CONTEXT
// ============================================
// Provides profile state to entire app without prop drilling

const ProfileContext = createContext(null);

/**
 * Check if the current active profile is a caregiver caring for a veteran
 */
const getIsVeteranCaregiver = () => {
  const activeProfile = getActiveProfile();
  return activeProfile?.type === 'caregiver' &&
      activeProfile?.metadata?.isVeteranCaregiver === true;
};

/**
 * Get modified feature flags based on profile type and veteran caregiver status
 * If caregiver is caring for a veteran, enable veteran-specific features
 */
const getModifiedFeatureFlags = () => {
  const baseFlags = getFeatureFlags();
  const isVeteranCaregiver = getIsVeteranCaregiver();

  if (isVeteranCaregiver) {
    return {
      ...baseFlags,
      // Enable veteran features for caregivers caring for veterans
      showRatingCorrelation: true,
      showVATerminology: true,
      showCPExamPrep: true,
    };
  }

  return baseFlags;
};

export const ProfileProvider = ({ children }) => {
  const [profile, setProfile] = useState(getProfile());
  const [labels, setLabels] = useState(getLabels());
  const [features, setFeatures] = useState(getModifiedFeatureFlags());
  const [isVeteranCaregiver, setIsVeteranCaregiver] = useState(getIsVeteranCaregiver());

  // Refresh profile state (call after profile changes)
  const refreshProfile = useCallback(() => {
    setProfile(getProfile());
    setLabels(getLabels());
    setFeatures(getModifiedFeatureFlags());
    setIsVeteranCaregiver(getIsVeteranCaregiver());
  }, []);

  // Check if onboarding should show
  const shouldShowOnboarding = !isOnboardingComplete();

  // Listen for storage changes (in case profile updated in another tab)
  useEffect(() => {
    const handleStorageChange = (e) => {
      if (e.key?.includes('symptomTracker_profile') || e.key?.includes('symptomTracker_onboarding')) {
        refreshProfile();
      }
    };

    // Listen for profile switch events from ProfileManagement
    const handleProfileChanged = (e) => {
      console.log('Profile changed event received:', e.detail);
      refreshProfile();
    };

    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('profileChanged', handleProfileChanged);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('profileChanged', handleProfileChanged);
    };
  }, [refreshProfile]);

  /**
   * Determine if this profile should have access to veteran features.
   * This is true for:
   * 1. Veteran profiles
   * 2. Caregiver profiles where isVeteranCaregiver is true
   */
  const hasVeteranFeatures = profile.type === PROFILE_TYPES.VETERAN || isVeteranCaregiver;

  const value = {
    profile,
    profileType: profile.type,
    labels,
    features,
    refreshProfile,
    shouldShowOnboarding,

    // Convenience booleans
    isVeteran: profile.type === PROFILE_TYPES.VETERAN,
    isGeneral: profile.type === PROFILE_TYPES.GENERAL,
    isCaregiver: profile.type === PROFILE_TYPES.CAREGIVER,
    hasProfile: hasProfile(),

    // NEW: Veteran caregiver support
    isVeteranCaregiver,
    hasVeteranFeatures, // True for veterans OR caregivers of veterans
  };

  return (
      <ProfileContext.Provider value={value}>
        {children}
      </ProfileContext.Provider>
  );
};

// ============================================
// USE PROFILE HOOK
// ============================================
// Easy access to profile throughout the app

export const useProfile = () => {
  const context = useContext(ProfileContext);

  if (!context) {
    // Return defaults if used outside provider (shouldn't happen in normal use)
    console.warn('useProfile used outside ProfileProvider');
    return {
      profile: getProfile(),
      profileType: getProfileType(),
      labels: getLabels(),
      features: getModifiedFeatureFlags(),
      refreshProfile: () => {},
      shouldShowOnboarding: !isOnboardingComplete(),
      isVeteran: false,
      isGeneral: false,
      isCaregiver: false,
      hasProfile: false,
      isVeteranCaregiver: false,
      hasVeteranFeatures: false,
    };
  }

  return context;
};

export default useProfile;