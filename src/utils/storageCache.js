/**
 * storageCache.js — In-memory cache with IndexedDB backing store
 *
 * Provides a synchronous read interface over async IndexedDB storage.
 * All profile-namespaced data is preloaded into memory on startup and
 * on every profile switch. Writes go to both cache and IndexedDB.
 *
 * Public API (all synchronous except initialize/refreshForProfile):
 *   cacheGet(key)           → value | null
 *   cacheSet(key, value)    → void  (writes to cache + IDB async)
 *   cacheRemove(key)        → void  (removes from cache + IDB async)
 *   cacheIsReady()          → boolean
 *
 * Async (called from main.jsx and on profile switch):
 *   initializeCache()                    → Promise<void>
 *   refreshCacheForProfile(profileId)    → Promise<void>
 */

import { dbGet, dbSet, dbRemove, dbGetAll } from './db';

// ─── Internal state ───────────────────────────────────────────────────────────

// The in-memory cache — plain object, keyed identically to IDB/localStorage
const _cache = {};

// Whether the cache has been loaded from IDB at least once
let _ready = false;

// Keys that must NEVER enter the cache — these stay in localStorage only
const LOCAL_STORAGE_ONLY_KEYS = new Set([
  'symptomTracker_theme',
  'symptomTracker_schemaVersion',
  'symptomTracker_onboardingComplete',
  'symptomTracker_activeProfileId',
  'symptomTracker_profiles',
  'symptomTracker_multiProfileMigration',
  'symptomTracker_autoBackup',
  'symptomTracker_lastBackup',
  'symptomTracker_backupHistory',
  'symptomTracker_profile',          // global profile sync object
  'symptomTracker_settings',         // app-level settings
  'symptomTracker_bbImportLog',      // Blue Button import history
  'symptomTracker_thresholdReminderDismissedUntil',
  'lastBackupDate',
]);

// ─── Public sync API ──────────────────────────────────────────────────────────

/**
 * Read a value from the cache.
 * Falls back to localStorage for keys not in cache (safety net only).
 */
export const cacheGet = (key) => {
  // Always use localStorage for global keys
  if (LOCAL_STORAGE_ONLY_KEYS.has(key)) {
    const raw = localStorage.getItem(key);
    if (raw === null) return null;
    try { return JSON.parse(raw); } catch { return raw; }
  }

  // Profile-namespaced key — read from cache
  if (key in _cache) {
    return _cache[key];
  }

  // Cache miss fallback — read from localStorage in case migration
  // hasn't run yet (first launch before IDB migration completes)
  const raw = localStorage.getItem(key);
  if (raw === null) return null;
  try { return JSON.parse(raw); } catch { return raw; }
};

/**
 * Write a value to the cache and asynchronously persist to IndexedDB.
 * For localStorage-only keys, writes to localStorage instead.
 */
export const cacheSet = (key, value) => {
  if (LOCAL_STORAGE_ONLY_KEYS.has(key)) {
    // Global key — localStorage only
    try {
      localStorage.setItem(key, typeof value === 'string'
          ? value
          : JSON.stringify(value));
    } catch (e) {
      console.error(`cacheSet localStorage failed for "${key}":`, e);
    }
    return Promise.resolve();
  }

  // Update in-memory cache immediately (synchronous, instant)
  _cache[key] = value;

  // Persist to IndexedDB and return the Promise
  // Callers that need to await completion (e.g. restore) can use the return value
  return dbSet(key, value).catch(err => {
    console.error(`cacheSet IDB failed for "${key}":`, err);
  });
};

/**
 * Remove a key from the cache and asynchronously delete from IndexedDB.
 * For localStorage-only keys, removes from localStorage instead.
 */
export const cacheRemove = (key) => {
  if (LOCAL_STORAGE_ONLY_KEYS.has(key)) {
    localStorage.removeItem(key);
    return;
  }

  // Remove from in-memory cache
  delete _cache[key];

  // Remove from IndexedDB asynchronously
  dbRemove(key).catch(err => {
    console.error(`cacheRemove IDB failed for "${key}":`, err);
  });
};

/**
 * Check whether the cache has been initialized.
 * Components can check this to show loading states if needed.
 */
export const cacheIsReady = () => _ready;

// ─── Async initialization ─────────────────────────────────────────────────────

/**
 * Load ALL IndexedDB data into the cache.
 * Called once from main.jsx before React mounts.
 * After this returns, all synchronous reads will hit the cache.
 */
export const initializeCache = async () => {
  try {
    console.log('📦 Initializing storage cache from IndexedDB...');

    // Load everything from IDB into the cache
    const allData = await dbGetAll();
    const keyCount = Object.keys(allData).length;

    Object.assign(_cache, allData);
    _ready = true;

    console.log(`✅ Storage cache ready — ${keyCount} keys loaded`);
  } catch (error) {
    console.error('❌ Cache initialization failed:', error);
    // App can still function — cacheGet falls back to localStorage
    _ready = true; // Mark ready so app doesn't hang
  }
};

/**
 * Refresh the cache for a specific profile.
 * Called whenever the active profile changes.
 * Only reloads keys belonging to the given profileId.
 */
export const refreshCacheForProfile = async (profileId) => {
  if (!profileId) return;

  try {
    console.log(`🔄 Refreshing cache for profile ${profileId}...`);

    // Load all IDB data and filter to this profile's keys
    const allData = await dbGetAll();

    // Update cache entries for this profile
    Object.entries(allData).forEach(([key, value]) => {
      if (key.endsWith(`_${profileId}`)) {
        _cache[key] = value;
      }
    });

    console.log(`✅ Cache refreshed for profile ${profileId}`);
  } catch (error) {
    console.error(`❌ Cache refresh failed for profile ${profileId}:`, error);
  }
};

/**
 * Clear all profile-namespaced keys for a specific profileId from the cache.
 * Called when a profile is deleted.
 */
export const clearProfileFromCache = (profileId) => {
  if (!profileId) return;
  Object.keys(_cache).forEach(key => {
    if (key.endsWith(`_${profileId}`)) {
      delete _cache[key];
    }
  });
};

/**
 * Get all cache keys matching a prefix.
 * Used by DataBunker export to collect all profile data.
 */
export const cacheGetAllWithPrefix = (prefix) => {
  const result = {};
  Object.entries(_cache).forEach(([key, value]) => {
    if (key.startsWith(prefix)) {
      result[key] = value;
    }
  });
  return result;
};