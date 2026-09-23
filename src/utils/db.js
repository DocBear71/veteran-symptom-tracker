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
// v2 — adds the photos object store. Bump this whenever a store is added.
const DB_VERSION = 2;
const STORE_NAME = 'kvStore'; // key-value store for all text data

// Photos live in their OWN object store, deliberately.
//
// initializeCache() calls dbGetAll() on every launch and loads the entire
// kvStore into memory before React mounts. That's fine for text. If photos
// shared that store, every launch would pull every photo a Veteran has ever
// taken into RAM — on an older Android device with a couple of years of logs,
// that's a startup crash.
//
// dbGetAll() reads STORE_NAME only, so nothing here ever enters the cache.
// Photo access is async and on-demand, always.
const PHOTO_STORE = 'photos';

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
  'lastBackupDate',
  'docbear_fraudAlertDismissed',
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
      // The contains() guards make this safe from any prior version — a fresh
      // install creates both stores, a v1 database gains only the photo store,
      // and existing kvStore data is never touched.
      upgrade(db) {
        if (!db.objectStoreNames.contains(STORE_NAME)) {
          db.createObjectStore(STORE_NAME);
        }

        if (!db.objectStoreNames.contains(PHOTO_STORE)) {
          // keyPath 'id' — records carry their own key, unlike kvStore
          const photos = db.createObjectStore(PHOTO_STORE, { keyPath: 'id' });
          // Look up every photo attached to one symptom log
          photos.createIndex('logId', 'logId', { unique: false });
          // Scope photos to a profile for size totals and profile deletion
          photos.createIndex('profileId', 'profileId', { unique: false });
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
    // Photos are a separate store — clearing kvStore alone would orphan
    // every photo and leave the storage quota consumed after a factory reset.
    await db.clear(PHOTO_STORE);
    return true;
  } catch (error) {
    console.error('❌ dbClear failed:', error);
    return false;
  }
};

// ─── Photo Store ──────────────────────────────────────────────────────────────
//
// Photo record shape:
// {
//   id:         string  — crypto.randomUUID()
//   logId:      string  — the symptom log this belongs to
//   profileId:  string  — owning profile
//   blob:       Blob    — full-size image, metadata already stripped
//   thumbBlob:  Blob    — small thumbnail for list rendering
//   size:       number  — byte size of blob, stored so totals don't read bytes
//   width:      number
//   height:     number
//   mimeType:   string
//   caption:    string
//   createdAt:  string  — ISO
// }
//
// Blobs, not base64. Base64 inflates by ~33% and IndexedDB stores Blobs
// natively without deserializing the bytes until you actually read them.

/**
 * Write (or overwrite) one photo record.
 */
export const photoPut = async (record) => {
  try {
    const db = await getDB();
    await db.put(PHOTO_STORE, record);
    return true;
  } catch (error) {
    console.error(`❌ photoPut failed for "${record?.id}":`, error);
    return false;
  }
};

/**
 * Read one photo record by ID, blobs included.
 */
export const photoGet = async (id) => {
  try {
    const db = await getDB();
    return (await db.get(PHOTO_STORE, id)) ?? null;
  } catch (error) {
    console.error(`❌ photoGet failed for "${id}":`, error);
    return null;
  }
};

/**
 * Every photo attached to one symptom log, oldest first.
 */
export const photoGetByLogId = async (logId) => {
  try {
    const db = await getDB();
    const records = await db.getAllFromIndex(PHOTO_STORE, 'logId', logId);
    return records.sort((a, b) =>
        new Date(a.createdAt || 0) - new Date(b.createdAt || 0)
    );
  } catch (error) {
    console.error(`❌ photoGetByLogId failed for "${logId}":`, error);
    return [];
  }
};

/**
 * Metadata for a profile's photos WITHOUT the blobs.
 *
 * Used for the storage-size display and backup estimates. A cursor is used
 * rather than getAll() so the full records never accumulate in an array —
 * we copy out only the scalar fields and let each record go.
 */
export const photoGetMetadataByProfile = async (profileId) => {
  try {
    const db = await getDB();
    const out = [];
    let cursor = await db
    .transaction(PHOTO_STORE)
    .store.index('profileId')
    .openCursor(profileId);

    while (cursor) {
      const { id, logId, size, width, height, mimeType, caption, createdAt } = cursor.value;
      out.push({ id, logId, size, width, height, mimeType, caption, createdAt });
      cursor = await cursor.continue();
    }
    return out;
  } catch (error) {
    console.error(`❌ photoGetMetadataByProfile failed for "${profileId}":`, error);
    return [];
  }
};

/**
 * Total bytes consumed by one profile's photos.
 * Reads the stored `size` field rather than measuring blobs.
 */
export const photoTotalSize = async (profileId) => {
  const meta = await photoGetMetadataByProfile(profileId);
  return meta.reduce((sum, p) => sum + (p.size || 0), 0);
};

export const photoDelete = async (id) => {
  try {
    const db = await getDB();
    await db.delete(PHOTO_STORE, id);
    return true;
  } catch (error) {
    console.error(`❌ photoDelete failed for "${id}":`, error);
    return false;
  }
};

/**
 * Delete every photo attached to a symptom log.
 * Call this whenever a log is deleted, or the photos are orphaned and keep
 * consuming quota with nothing pointing at them.
 */
export const photoDeleteByLogId = async (logId) => {
  try {
    const db = await getDB();
    const tx = db.transaction(PHOTO_STORE, 'readwrite');
    const index = tx.store.index('logId');
    let cursor = await index.openCursor(logId);
    let deleted = 0;
    while (cursor) {
      await cursor.delete();
      deleted++;
      cursor = await cursor.continue();
    }
    await tx.done;
    return deleted;
  } catch (error) {
    console.error(`❌ photoDeleteByLogId failed for "${logId}":`, error);
    return 0;
  }
};

/**
 * Delete every photo belonging to a profile. Called on profile deletion.
 */
export const photoDeleteByProfile = async (profileId) => {
  try {
    const db = await getDB();
    const tx = db.transaction(PHOTO_STORE, 'readwrite');
    const index = tx.store.index('profileId');
    let cursor = await index.openCursor(profileId);
    let deleted = 0;
    while (cursor) {
      await cursor.delete();
      deleted++;
      cursor = await cursor.continue();
    }
    await tx.done;
    return deleted;
  } catch (error) {
    console.error(`❌ photoDeleteByProfile failed for "${profileId}":`, error);
    return 0;
  }
};

/**
 * Count of photos for a profile, without loading any records.
 */
export const photoCountByProfile = async (profileId) => {
  try {
    const db = await getDB();
    return await db.countFromIndex(PHOTO_STORE, 'profileId', profileId);
  } catch (error) {
    console.error(`❌ photoCountByProfile failed for "${profileId}":`, error);
    return 0;
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
    if (LOCAL_STORAGE_ONLY_KEYS.has(key)) continue;
    // Migrate symptomTracker_* profile data, nexus_* nexus builder data,
    // and legacy docbear_nexus_* keys from versions prior to 3.6.0
    if (
        !key.startsWith('symptomTracker_') &&
        !key.startsWith('nexus_') &&
        !key.startsWith('docbear_nexus_')
    ) continue;
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