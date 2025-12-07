/**
 * MULTI-PROFILE MIGRATION
 *
 * Migrates existing single-profile data to multi-profile system.
 * Runs once on first load after multi-profile update.
 */

import {
  getProfiles,
  createProfile,
  setActiveProfile,
  isMultiProfileInitialized,
  markMigrationComplete,
} from './profiles';
import { getProfile as getOldProfile, PROFILE_TYPES } from './profile';

/**
 * Run multi-profile migration
 *
 * This function:
 * 1. Checks if migration is needed
 * 2. Creates "Default" profile from existing data
 * 3. Migrates all data to be namespaced by profile ID
 * 4. Sets Default as active profile
 * 5. Marks migration as complete
 */
export const runMultiProfileMigration = () => {
  // Check if already migrated
  if (isMultiProfileInitialized()) {
    console.log('Multi-profile already initialized');
    return { success: true, migrated: false };
  }

  console.log('Starting multi-profile migration...');

  try {
    // Check if there are already profiles (shouldn't happen, but handle it)
    const existingProfiles = getProfiles();
    if (existingProfiles.length > 0) {
      console.log('Profiles already exist, skipping migration');
      markMigrationComplete();
      return { success: true, migrated: false };
    }

    // Get old profile type (if any)
    const oldProfile = getOldProfile();
    const profileType = oldProfile?.type || PROFILE_TYPES.VETERAN;

    // Determine profile name based on type
    let profileName = 'Default';
    if (profileType === PROFILE_TYPES.VETERAN) {
      profileName = 'My Health';
    } else if (profileType === PROFILE_TYPES.CAREGIVER && oldProfile?.patientName) {
      profileName = oldProfile.patientName;
    }

    // Create default profile
    const result = createProfile({
      name: profileName,
      type: profileType,
      color: 'blue',
      metadata: {},
    });

    if (!result.success) {
      console.error('Failed to create default profile:', result.message);
      return { success: false, message: result.message };
    }

    const defaultProfile = result.profile;
    console.log('Created default profile:', defaultProfile);

    // Migrate existing data to new namespaced keys
    migrateData(defaultProfile.id);

    // Set as active profile
    setActiveProfile(defaultProfile.id);

    // Mark migration as complete
    markMigrationComplete();

    console.log('Multi-profile migration complete!');
    return {
      success: true,
      migrated: true,
      profile: defaultProfile
    };

  } catch (error) {
    console.error('Migration error:', error);
    return {
      success: false,
      message: error.message
    };
  }
};

/**
 * Migrate data from old keys to new profile-namespaced keys
 */
const migrateData = (profileId) => {
  // Map of old keys to new keys
  const keysToMigrate = [
    'symptomTracker_logs',
    'symptomTracker_customSymptoms',
    'symptomTracker_favorites',
    'symptomTracker_medications',
    'symptomTracker_medicationLogs',
    'symptomTracker_appointments',
    'symptomTracker_reminderSettings',
    'symptomTracker_sleepApneaProfile',
  ];

  keysToMigrate.forEach(oldKey => {
    const data = localStorage.getItem(oldKey);
    if (data) {
      // Copy to new namespaced key
      const newKey = `${oldKey}_${profileId}`;

      // Only migrate if new key doesn't exist yet (don't overwrite)
      if (!localStorage.getItem(newKey)) {
        localStorage.setItem(newKey, data);
        console.log(`Migrated: ${oldKey} → ${newKey}`);
      } else {
        console.log(`Skipped migration for ${oldKey} (already exists in new format)`);
      }

      // DON'T auto-delete old keys - keep them for now as backup
      // User can manually clean up later if needed
    }
  });

  console.log(`Migration check complete for profile ${profileId}`);
};

/**
 * Clean up old non-namespaced keys (MANUAL - call only when sure migration is complete)
 * This should ONLY be called manually from Settings, never automatically
 */
export const cleanupOldKeys = () => {
  console.warn('⚠️  MANUAL CLEANUP - This will delete old non-namespaced data keys');
  console.warn('⚠️  Make sure migration is complete and data is safe before running this!');

  const keysToDelete = [
    'symptomTracker_logs',
    'symptomTracker_customSymptoms',
    'symptomTracker_favorites',
    'symptomTracker_medications',
    'symptomTracker_medicationLogs',
    'symptomTracker_appointments',
    'symptomTracker_reminderSettings',
    'symptomTracker_sleepApneaProfile',
  ];

  let cleaned = 0;
  keysToDelete.forEach(key => {
    if (localStorage.getItem(key)) {
      localStorage.removeItem(key);
      cleaned++;
      console.log(`Cleaned up old key: ${key}`);
    }
  });

  if (cleaned > 0) {
    console.log(`✅ Cleaned up ${cleaned} old non-namespaced keys`);
  } else {
    console.log('No old keys to clean up');
  }

  return { cleaned };
};

/**
 * Run initialization (migration only, NO automatic cleanup)
 */
export const initializeMultiProfile = () => {
  // Only run migration, never auto-cleanup
  const migrationResult = runMultiProfileMigration();

  return {
    migrated: migrationResult.migrated,
    message: migrationResult.migrated
        ? 'Migration completed successfully'
        : 'Multi-profile already initialized',
  };
};