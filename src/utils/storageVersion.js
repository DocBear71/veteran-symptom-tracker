/**
 * Storage Version Manager
 * Prevents data loss during app updates by managing schema versions
 */

const CURRENT_VERSION = '2.0.0';
const VERSION_KEY = 'symptomTracker_schemaVersion';
const BACKUP_KEY = 'symptomTracker_autoBackup';
const LAST_BACKUP_KEY = 'symptomTracker_lastBackup';

/**
 * Check if migration is needed and preserve data
 */
export const checkAndMigrateStorage = () => {
  const currentVersion = localStorage.getItem(VERSION_KEY);

  // First time user - just set version
  if (!currentVersion) {
    localStorage.setItem(VERSION_KEY, CURRENT_VERSION);
    console.log('First time user - version set to', CURRENT_VERSION);
    return;
  }

  // Same version - no migration needed
  if (currentVersion === CURRENT_VERSION) {
    return;
  }

  // Different version - backup before any changes
  console.log(`Migrating from ${currentVersion} to ${CURRENT_VERSION}`);
  createEmergencyBackup();

  // Update version
  localStorage.setItem(VERSION_KEY, CURRENT_VERSION);
};

/**
 * Create emergency backup of all data
 */
export const createEmergencyBackup = () => {
  const backup = {
    timestamp: new Date().toISOString(),
    version: localStorage.getItem(VERSION_KEY),
    data: {}
  };

  // SELECTIVE BACKUP - Only critical data to avoid quota issues
  const criticalKeys = [
    'symptomTracker_logs',
    'symptomTracker_profiles',
    'symptomTracker_chronicSymptoms',
    'symptomTracker_serviceConnected',
    'symptomTracker_schemaVersion',
    'symptomTracker_activeProfileId',
  ];

  // Backup critical data (including profile-specific keys)
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (!key) continue;

    // Include if it's in the critical keys list
    if (criticalKeys.includes(key)) {
      backup.data[key] = localStorage.getItem(key);
      continue;
    }

    // Include profile-specific critical data
    if (key.match(/symptomTracker_(logs|chronicSymptoms|serviceConnected)_[a-f0-9-]+$/)) {
      backup.data[key] = localStorage.getItem(key);
    }
  }

  const backupString = JSON.stringify(backup);
  const backupSizeMB = (backupString.length / 1024 / 1024).toFixed(2);

  try {
    // Try localStorage with quota handling
    try {
      localStorage.setItem(BACKUP_KEY, backupString);
      console.log(`✅ Emergency backup saved to localStorage (${backupSizeMB} MB)`, new Date().toISOString());
    } catch (quotaError) {
      console.warn(`⚠️ localStorage quota exceeded (${backupSizeMB} MB) - using sessionStorage only`);
      // Remove old backup to free space
      try {
        localStorage.removeItem(BACKUP_KEY);
      } catch (e) {
        // Ignore cleanup errors
      }
    }

    // Always try sessionStorage as fallback
    try {
      sessionStorage.setItem(BACKUP_KEY, backupString);
      console.log('✅ Emergency backup also saved to sessionStorage');
    } catch (sessionError) {
      console.warn('⚠️ sessionStorage quota exceeded');
    }

  } catch (error) {
    console.error('❌ Failed to create emergency backup:', error);
  }

  return backup;
};

/**
 * Restore from emergency backup
 */
export const restoreFromEmergencyBackup = () => {
  // Try localStorage first, then sessionStorage
  let backupString = localStorage.getItem(BACKUP_KEY);
  if (!backupString) {
    backupString = sessionStorage.getItem(BACKUP_KEY);
  }

  if (!backupString) {
    console.error('No emergency backup found');
    return false;
  }

  try {
    const backup = JSON.parse(backupString);

    // Restore all data
    Object.entries(backup.data).forEach(([key, value]) => {
      localStorage.setItem(key, value);
    });

    console.log('Data restored from backup:', backup.timestamp);
    return true;
  } catch (error) {
    console.error('Failed to restore backup:', error);
    return false;
  }
};

/**
 * Create automatic daily backup
 */
export const createDailyBackup = () => {
  const lastBackup = localStorage.getItem(LAST_BACKUP_KEY);
  const now = new Date();
  const today = now.toISOString().split('T')[0];

  // Check if we already backed up today
  if (lastBackup && lastBackup.startsWith(today)) {
    return;
  }

  const backup = createEmergencyBackup();

  try {
    localStorage.setItem(LAST_BACKUP_KEY, now.toISOString());

    // Store last 7 days of backups (metadata only, not full backups)
    const backupHistory = JSON.parse(localStorage.getItem('symptomTracker_backupHistory') || '[]');
    backupHistory.push({
      date: today,
      timestamp: now.toISOString(),
      dataSize: JSON.stringify(backup).length
    });

    // Keep only last 7 backups
    if (backupHistory.length > 7) {
      backupHistory.shift();
    }

    localStorage.setItem('symptomTracker_backupHistory', JSON.stringify(backupHistory));
    console.log('Daily backup created');
  } catch (error) {
    console.error('Failed to save daily backup metadata:', error);
  }
};

/**
 * Get backup history
 */
export const getBackupHistory = () => {
  return JSON.parse(localStorage.getItem('symptomTracker_backupHistory') || '[]');
};

export default {
  checkAndMigrateStorage,
  createEmergencyBackup,
  restoreFromEmergencyBackup,
  createDailyBackup,
  getBackupHistory,
  CURRENT_VERSION
};