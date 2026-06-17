/**
 * db.js — IndexedDB adapter for Doc Bear's Symptom Vault
 *
 * Replaces localStorage for all profile-namespaced data.
 * Provides a simple async get/set/remove/clear interface
 * using the same key naming conventions as storage.js.
 *
 * Global/app-level keys (theme, profiles, onboarding, etc.)
 * remain in localStorage — they are tiny and needed before
 * React boots. Only bulk profile data moves here.
 *
 * Storage limits:
 *   localStorage:  ~5MB (what we're replacing)
 *   IndexedDB:     iOS ~50MB+, Android effectively unlimited
 */

import { openDB } from 'idb';

// ─── Constants ────────────────────────────────────────────────────────────────

const DB_NAME    = 'symptomVaultDB';
const DB_VERSION = 1;
const STORE_NAME = 'kvStore'; // single key-value object store

// Keys that must STAY in localStorage — never migrate these
export const LOCAL_STORAGE_ONLY_KEYS = new Set([
  'symptomTracker_theme',
  'symptomTracker_schemaVersion',
  'symptomTracker_onboardingComplete',
  'symptomTracker_activeProfileId',
  'symptomTracker_profiles',
  'symptomTracker_multiProfileMigration',
  'symptomTracker_autoBackup',
  'symptomTracker_lastBackup',
  'symptomTracker_backupHistory',
]);

// Migration flag — written to localStorage once migration completes
const IDB_MIGRATION_FLAG = 'symptomTracker_idbMigrationComplete';

// ─── DB Initialization ────────────────────────────────────────────────────────

let dbPromise = null;

/**
 * Get (or initialize) the IndexedDB connection.
 * Called lazily — only opens DB when first needed.
 */
const getDB = () => {
  if (!dbPromise) {
    dbPromise = openDB(DB_NAME, DB_VERSION, {
      upgrade(db) {
        // Create our single key-value store if it doesn't exist
        if (!db.objectStoreNames.contains(STORE_NAME)) {
          db.createObjectStore(STORE_NAME);
        }
      },
    });
  }
  return dbPromise;
};

// ─── Core CRUD Operations ─────────────────────────────────────────────────────

/**
 * Read a value from IndexedDB.
 * Returns parsed value, or null if not found.
 */
export const dbGet = async (key) => {
  try {
    const db = await getDB();
    const value = await db.get(STORE_NAME, key);
    return value ?? null;
  } catch (error) {
    console.error(`❌ dbGet failed for key "${key}":`, error);
    return null;
  }
};

/**
 * Write a value to IndexedDB.
 * Accepts any JSON-serializable value.
 */
export const dbSet = async (key, value) => {
  try {
    const db = await getDB();
    await db.put(STORE_NAME, value, key);
    return true;
  } catch (error) {
    console.error(`❌ dbSet failed for key "${key}":`, error);
    return false;
  }
};

/**
 * Remove a single key from IndexedDB.
 */
export const dbRemove = async (key) => {
  try {
    const db = await getDB();
    await db.delete(STORE_NAME, key);
    return true;
  } catch (error) {
    console.error(`❌ dbRemove failed for key "${key}":`, error);
    return false;
  }
};

/**
 * Get all keys currently stored in IndexedDB.
 * Used by backup and migration functions.
 */
export const dbGetAllKeys = async () => {
  try {
    const db = await getDB();
    return await db.getAllKeys(STORE_NAME);
  } catch (error) {
    console.error('❌ dbGetAllKeys failed:', error);
    return [];
  }
};

/**
 * Get all key-value pairs from IndexedDB.
 * Used by the Data Bunker export and emergency backup.
 */
export const dbGetAll = async () => {
  try {
    const db = await getDB();
    const keys   = await db.getAllKeys(STORE_NAME);
    const values = await db.getAll(STORE_NAME);
    const result = {};
    keys.forEach((key, i) => { result[key] = values[i]; });
    return result;
  } catch (error) {
    console.error('❌ dbGetAll failed:', error);
    return {};
  }
};

/**
 * Clear ALL data from IndexedDB.
 * Only used by clearAllData() and factory reset.
 * Does NOT touch localStorage.
 */
export const dbClear = async () => {
  try {
    const db = await getDB();
    await db.clear(STORE_NAME);
    return true;
  } catch (error) {
    console.error('❌ dbClear failed:', error);
    return false;
  }
};

// ─── One-Time Migration ───────────────────────────────────────────────────────

/**
 * Migrate existing localStorage profile data to IndexedDB.
 *
 * Called once from main.jsx on app startup.
 * Detects all symptomTracker_* keys in localStorage that are
 * NOT in the LOCAL_STORAGE_ONLY_KEYS list and moves them to IndexedDB.
 *
 * Safe to call multiple times — skips if already complete.
 * Does not remove localStorage data until all writes confirm success.
 */
export const migrateLocalStorageToIDB = async () => {
  // Already done — skip
  if (localStorage.getItem(IDB_MIGRATION_FLAG) === 'true') {
    return { skipped: true };
  }

  console.log('🔄 Starting localStorage → IndexedDB migration...');

  const keysToMigrate = [];

  // Collect all symptomTracker keys that should move to IndexedDB
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (!key) continue;
    if (!key.startsWith('symptomTracker_')) continue;
    if (LOCAL_STORAGE_ONLY_KEYS.has(key)) continue;
    keysToMigrate.push(key);
  }

  if (keysToMigrate.length === 0) {
    // Nothing to migrate — new install or already clean
    localStorage.setItem(IDB_MIGRATION_FLAG, 'true');
    console.log('✅ Migration complete (nothing to move — clean install)');
    return { migrated: 0 };
  }

  console.log(`📦 Migrating ${keysToMigrate.length} keys to IndexedDB...`);

  const failed = [];

  for (const key of keysToMigrate) {
    try {
      const raw = localStorage.getItem(key);
      if (raw === null) continue;

      // Parse JSON so IndexedDB stores the actual object/array,
      // not a JSON string — makes dbGet return ready-to-use data
      let value;
      try {
        value = JSON.parse(raw);
      } catch {
        // Not JSON — store as raw string (shouldn't happen for our keys)
        value = raw;
      }

      const success = await dbSet(key, value);
      if (!success) {
        failed.push(key);
      }
    } catch (error) {
      console.error(`❌ Failed to migrate key "${key}":`, error);
      failed.push(key);
    }
  }

  if (failed.length > 0) {
    console.error(`❌ Migration incomplete — ${failed.length} keys failed:`, failed);
    return { migrated: keysToMigrate.length - failed.length, failed };
  }

  // All writes confirmed — now safe to remove from localStorage
  for (const key of keysToMigrate) {
    try {
      localStorage.removeItem(key);
    } catch (_e) {
      // Non-critical — key is already in IndexedDB, stale localStorage
      // copy will just be ignored going forward
    }
  }

  localStorage.setItem(IDB_MIGRATION_FLAG, 'true');

  console.log(`✅ Migration complete — ${keysToMigrate.length} keys moved to IndexedDB`);
  return { migrated: keysToMigrate.length, failed: [] };
};