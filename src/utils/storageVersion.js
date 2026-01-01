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

  // Backup all symptomTracker data
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key && key.startsWith('symptomTracker_')) {
      backup.data[key] = localStorage.getItem(key);
    }
  }

  // Store in localStorage AND sessionStorage
  const backupString = JSON.stringify(backup);
  localStorage.setItem(BACKUP_KEY, backupString);
  sessionStorage.setItem(BACKUP_KEY, backupString);

  console.log('Emergency backup created:', new Date().toISOString());
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
  localStorage.setItem(LAST_BACKUP_KEY, now.toISOString());

  // Store last 7 days of backups
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