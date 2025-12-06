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

// ============================================
// PROFILE CONTEXT
// ============================================
// Provides profile state to entire app without prop drilling

const ProfileContext = createContext(null);

export const ProfileProvider = ({ children }) => {
  const [profile, setProfile] = useState(getProfile());
  const [labels, setLabels] = useState(getLabels());
  const [features, setFeatures] = useState(getFeatureFlags());

  // Refresh profile state (call after profile changes)
  const refreshProfile = useCallback(() => {
    setProfile(getProfile());
    setLabels(getLabels());
    setFeatures(getFeatureFlags());
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

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [refreshProfile]);

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
      features: getFeatureFlags(),
      refreshProfile: () => {},
      shouldShowOnboarding: !isOnboardingComplete(),
      isVeteran: false,
      isGeneral: false,
      isCaregiver: false,
      hasProfile: false,
    };
  }

  return context;
};

export default useProfile;