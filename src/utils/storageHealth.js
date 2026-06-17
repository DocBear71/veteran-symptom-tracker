/**
 * storageHealth.js
 * Measures localStorage usage and warns when approaching the 5MB limit.
 * Used by Settings.jsx and DataBunker.jsx to surface storage warnings.
 *
 * After the IndexedDB migration, profile data moves out of localStorage,
 * so these thresholds will only matter during the transition window.
 * The utility remains useful indefinitely for monitoring localStorage-only keys.
 */

// Thresholds as percentage of the 5MB (~5,120KB) localStorage limit
const STORAGE_LIMIT_KB   = 5120;
const WARN_THRESHOLD_PCT = 0.75;  // 75% — yellow warning
const CRIT_THRESHOLD_PCT = 0.90;  // 90% — red critical

/**
 * Calculate total localStorage usage in KB.
 * Iterates all keys and sums their serialized byte lengths.
 */
export const getLocalStorageUsageKB = () => {
  try {
    let totalBytes = 0;
    for (let i = 0; i < localStorage.length; i++) {
      const key   = localStorage.key(i);
      const value = localStorage.getItem(key);
      // Each JS character is 2 bytes in UTF-16
      totalBytes += (key.length + (value?.length ?? 0)) * 2;
    }
    return Math.round(totalBytes / 1024);
  } catch {
    return 0;
  }
};

/**
 * Returns a health status object for the storage warning banner.
 *
 * level:
 *   'ok'       — under 75%, no banner needed
 *   'warning'  — 75–90%, yellow banner
 *   'critical' — 90%+,   red banner
 */
export const getStorageHealth = () => {
  const usedKB   = getLocalStorageUsageKB();
  const usedPct  = usedKB / STORAGE_LIMIT_KB;
  const usedMB   = (usedKB / 1024).toFixed(1);
  const limitMB  = (STORAGE_LIMIT_KB / 1024).toFixed(0);
  const pctLabel = Math.round(usedPct * 100);

  if (usedPct >= CRIT_THRESHOLD_PCT) {
    return {
      level: 'critical',
      usedKB,
      usedMB,
      limitMB,
      pctLabel,
      message: `Storage is ${pctLabel}% full (${usedMB} MB of ${limitMB} MB). 
                Export a backup immediately — new entries may stop saving.`,
    };
  }

  if (usedPct >= WARN_THRESHOLD_PCT) {
    return {
      level: 'warning',
      usedKB,
      usedMB,
      limitMB,
      pctLabel,
      message: `Storage is ${pctLabel}% full (${usedMB} MB of ${limitMB} MB). 
                Export a backup soon to avoid data loss.`,
    };
  }

  return {
    level: 'ok',
    usedKB,
    usedMB,
    limitMB,
    pctLabel,
    message: null,
  };
};