import { Download, Upload, Shield, AlertTriangle } from 'lucide-react';
import { cacheGet, cacheGetAllWithPrefix } from '../utils/storageCache';
import { getStorageHealth } from '../utils/storageHealth';
import { useState, useEffect } from 'react';
import { getDataStats } from '../utils/storage';
import { exportTextFile } from '../utils/nativeExport';
import { isNativePlatform } from '../utils/platformUtils';
import { hapticSuccess } from '../utils/haptics';
import { cacheSet } from '../utils/storageCache';
import { getPlatform } from '../utils/platformUtils.js';

export default function DataBunker() {
    const [lastBackup, setLastBackup] = useState(
        localStorage.getItem('lastBackupDate')
    );
  const [storageHealth, setStorageHealth] = useState(() => getStorageHealth());
    const [dataStats, setDataStats] = useState({
        logs: 0,
        customSymptoms: 0,
        chronicSymptoms: 0,
        appointments: 0,
        measurements: 0
    });

    // Load data stats on mount and listen for changes
  useEffect(() => {
    setDataStats(getDataStats());
    // Recalculate after mount — migration may have completed
    // between initial render and here, clearing localStorage
    setStorageHealth(getStorageHealth());

    const handleDataChange = () => {
      setDataStats(getDataStats());
      setStorageHealth(getStorageHealth());
    };

        window.addEventListener('profileChanged', handleDataChange);
        window.addEventListener('storage', handleDataChange);

        return () => {
            window.removeEventListener('profileChanged', handleDataChange);
            window.removeEventListener('storage', handleDataChange);
        };
    }, []);

  const handleExportBunker = async () => {
    // Get active profile ID and all profiles
    const activeProfileId = localStorage.getItem(
        'symptomTracker_activeProfileId') || 'default';
    const allProfiles = JSON.parse(
        localStorage.getItem('symptomTracker_profiles') || '[]');

    // ── rawData: complete snapshot of cache + localStorage ────────────
    // Collect ALL profile-namespaced data from cache (IndexedDB-backed)
    // plus global keys from localStorage
    const allCacheData = cacheGetAllWithPrefix('symptomTracker_');
    const allData = { ...allCacheData };
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith('symptomTracker_')) {
        try {
          const value = localStorage.getItem(key);
          try { allData[key] = JSON.parse(value); }
          catch { allData[key] = value; }
        } catch (e) {
          console.warn(`Failed to export key: ${key}`, e);
        }
      }
    }

    // ── Per-profile data: build 'data' section for ALL profiles ───────
    // Reads from IDB cache for each profile so large arrays are complete.
    const profilesData = {};
    allProfiles.forEach(profile => {
      const pid = profile.id;
      profilesData[pid] = {
        symptomLogs:        cacheGet(`symptomTracker_logs_${pid}`) || [],
        customSymptoms:     cacheGet(`symptomTracker_customSymptoms_${pid}`) || [],
        chronicSymptoms:    cacheGet(`symptomTracker_favorites_${pid}`) || [],
        medications:        cacheGet(`symptomTracker_medications_${pid}`) || [],
        medicationLogs:     cacheGet(`symptomTracker_medicationLogs_${pid}`) || [],
        medicationHistory:  cacheGet(`symptomTracker_medicationHistory_${pid}`) || [],
        measurements:       cacheGet(`symptomTracker_measurements_${pid}`) || [],
        appointments:       cacheGet(`symptomTracker_appointments_${pid}`) || [],
        reminderSettings:   cacheGet(`symptomTracker_reminderSettings_${pid}`) || {},
        worksheet8940:      cacheGet(`symptomTracker_8940worksheet_${pid}`) || null,
        weightGoal:         cacheGet(`symptomTracker_weightGoal_${pid}`) || null,
        mentalHealthScores: cacheGet(`symptomTracker_mentalHealthScores_${pid}`) || [],
        sleepApneaProfile:  cacheGet(`symptomTracker_sleepApneaProfile_${pid}`) || null,
        serviceConnectedConditions: (() => {
          try {
            const p = allProfiles.find(p => p.id === pid);
            return p?.serviceConnectedConditions || [];
          } catch { return []; }
        })(),
      };
    });

    // ── Active profile friendly section (backward compat) ─────────────
    // Keep the top-level 'data' key pointing to the active profile
    // so older restore code and the Python compliance script still work.
    const activeProfileData = profilesData[activeProfileId] || {};

    const data = {
      version: '2.2',
      exportDate: new Date().toISOString(),
      appVersion: '3.6.5',
      activeProfileId,
      // Complete snapshot — all keys from cache + localStorage
      rawData: allData,
      // All profiles — full IDB-sourced arrays for every profile
      profilesData,
      // Active profile in top-level 'data' for backward compatibility
      // with restore code and Python compliance scripts
      data: {
        ...activeProfileData,
        profiles: allProfiles,
        userProfile: JSON.parse(localStorage.getItem(
            `symptomTracker_profile_${activeProfileId}`) || '{}'),
        theme: localStorage.getItem('symptomTracker_theme') || 'system',
        onboardingComplete: localStorage.getItem(
            'symptomTracker_onboardingComplete') === 'true',
      },
    };

    const jsonString = JSON.stringify(data, null, 2);
    const now = new Date();
    const year   = now.getFullYear();
    const month  = (now.getMonth() + 1).toString().padStart(2, '0');
    const day    = now.getDate().toString().padStart(2, '0');
    const hours  = now.getHours();
    const minutes = now.getMinutes().toString().padStart(2, '0');
    const ampm   = hours >= 12 ? 'pm' : 'am';
    const hours12 = (hours % 12 || 12).toString();
    const filename = `symptom-vault-backup-${year}-${month}-${day}_${hours12}${minutes}${ampm}.json`;

    const result = await exportTextFile(jsonString, filename, 'application/json');

    if (result && result.success === false) {
      return;
    }

    hapticSuccess();
    const nowISO = new Date().toISOString();
    localStorage.setItem('lastBackupDate', nowISO);
    setLastBackup(nowISO);
  };

  // Native iOS/Android restore — reads JSON file via Capacitor Filesystem
  const handleNativeRestore = async () => {
    try {
      const platform = getPlatform();

      let jsonString;

      if (platform === 'android') {
        const { openFileFromDevice } = await import('../utils/fileSaver.js');
        const androidResult = await openFileFromDevice('application/json');
        jsonString = androidResult.content;

      } else {
        // iOS and web: use @capawesome/capacitor-file-picker
        const cap = globalThis?.Capacitor || window?.Capacitor;
        const FilePicker = cap?.Plugins?.FilePicker;

        if (!FilePicker) {
          // Web fallback — trigger hidden file input
          document.getElementById('bunker-restore-input')?.click();
          return;
        }

        const iosResult = await FilePicker.pickFiles({
          types: ['application/json'],
          multiple: false,
          readData: true,
        });

        if (!iosResult?.files?.length) return;
        jsonString = atob(iosResult.files[0].data);
      }

      // Pass jsonString to existing import logic via synthetic event
      const syntheticFile = new File([jsonString], 'backup.json', {
        type: 'application/json'
      });
      const syntheticEvent = { target: { files: [syntheticFile] } };
      handleImportBunker(syntheticEvent);

    } catch (error) {
      // User cancelled the picker — not an error
      if (error?.message?.includes('cancelled') ||
          error?.message?.includes('canceled')) return;

      console.error('Native restore error:', error);
      alert('Restore failed: ' + error.message);
    }
  };

  const handleImportBunker = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (e) => {
      try {
        const imported = JSON.parse(e.target.result);

        // Validate structure - support both old and new formats
        if (!imported.data && !imported.rawData && !imported.symptomLogs) {
          throw new Error('Invalid backup file format');
        }

        // Confirm before overwriting
        if (!confirm('This will replace all your current data. Are you sure?')) {
          return;
        }

        // Helper — writes global keys to localStorage, profile data to cache
        const LOCAL_KEYS = new Set([
          'symptomTracker_profiles',
          'symptomTracker_activeProfileId',
          'symptomTracker_theme',
          'symptomTracker_onboardingComplete',
          'symptomTracker_multiProfileMigration',
          'symptomTracker_profile',
          'symptomTracker_schemaVersion',
          'symptomTracker_settings',
          'symptomTracker_bbImportLog',
          'symptomTracker_thresholdReminderDismissedUntil',
          'lastBackupDate',
        ]);

        const restoreKey = (key, value) => {
          if (LOCAL_KEYS.has(key)) {
            // Global key — localStorage
            localStorage.setItem(key,
                typeof value === 'string' ? value : JSON.stringify(value));
          } else {
            // Profile data — write to cache (IndexedDB)
            cacheSet(key, typeof value === 'string'
                ? (() => { try { return JSON.parse(value); } catch { return value; } })()
                : value);
          }
        };

        // VERSION 2.1 format — hybrid restore:
        // • active profile's large arrays come from 'data' (full IDB-sourced copy)
        // • all other profiles + global keys come from rawData
        if (imported.data && (imported.version === '2.1' || imported.version === '2.2')) {
          const { data } = imported;
          const profileId = imported.activeProfileId
              || localStorage.getItem('symptomTracker_activeProfileId')
              || 'default';

          const LOCAL_KEYS_SET = new Set([
            'symptomTracker_profiles','symptomTracker_activeProfileId',
            'symptomTracker_theme','symptomTracker_onboardingComplete',
            'symptomTracker_multiProfileMigration','symptomTracker_profile',
            'symptomTracker_schemaVersion','symptomTracker_settings',
            'symptomTracker_bbImportLog','symptomTracker_thresholdReminderDismissedUntil',
            'lastBackupDate','symptomTracker_backupHistory',
          ]);

          const writePromises = [];

          // ── Step 1: Restore rawData for ALL keys ──────────────────────
          // This gets other profiles + global keys. Active profile's large
          // arrays will be overwritten in Step 2 with the better 'data' copy.
          if (imported.rawData) {
            Object.entries(imported.rawData).forEach(([key, value]) => {
              if (LOCAL_KEYS_SET.has(key)) {
                // Global key → localStorage
                localStorage.setItem(key,
                    typeof value === 'string' ? value : JSON.stringify(value));
              } else {
                // Profile data → IDB (includes other profiles)
                const parsed = typeof value === 'string'
                    ? (() => { try { return JSON.parse(value); } catch { return value; } })()
                    : value;
                writePromises.push(cacheSet(key, parsed));
              }
            });
          }

          // ── Step 2: Overwrite active profile arrays with 'data' copy ──
          // These are the full IDB-sourced arrays — larger than rawData versions.
          if (data.symptomLogs)
            writePromises.push(cacheSet(`symptomTracker_logs_${profileId}`, data.symptomLogs));
          if (data.medicationLogs)
            writePromises.push(cacheSet(`symptomTracker_medicationLogs_${profileId}`, data.medicationLogs));
          if (data.medications)
            writePromises.push(cacheSet(`symptomTracker_medications_${profileId}`, data.medications));
          if (data.customSymptoms)
            writePromises.push(cacheSet(`symptomTracker_customSymptoms_${profileId}`, data.customSymptoms));
          if (data.chronicSymptoms)
            writePromises.push(cacheSet(`symptomTracker_favorites_${profileId}`, data.chronicSymptoms));
          if (data.medicationHistory)
            writePromises.push(cacheSet(`symptomTracker_medicationHistory_${profileId}`, data.medicationHistory));
          if (data.measurements)
            writePromises.push(cacheSet(`symptomTracker_measurements_${profileId}`, data.measurements));
          if (data.appointments)
            writePromises.push(cacheSet(`symptomTracker_appointments_${profileId}`, data.appointments));
          if (data.reminderSettings)
            writePromises.push(cacheSet(`symptomTracker_reminderSettings_${profileId}`, data.reminderSettings));
          if (data.worksheet8940)
            writePromises.push(cacheSet(`symptomTracker_8940worksheet_${profileId}`, data.worksheet8940));
          if (data.weightGoal)
            writePromises.push(cacheSet(`symptomTracker_weightGoal_${profileId}`, data.weightGoal));
          if (data.mentalHealthScores)
            writePromises.push(cacheSet(`symptomTracker_mentalHealthScores_${profileId}`, data.mentalHealthScores));
          if (data.sleepApneaProfile)
            writePromises.push(cacheSet(`symptomTracker_sleepApneaProfile_${profileId}`, data.sleepApneaProfile));

          // ── Step 3: Restore non-active profiles from profilesData ────
          // v2.2 exports include full IDB arrays for every profile,
          // so we use those instead of the rawData fallback.
          if (imported.profilesData) {
            Object.entries(imported.profilesData).forEach(([pid, pdata]) => {
              if (pid === profileId) return; // already handled in Step 2
              const profileKeys = [
                ['symptomTracker_logs',              pdata.symptomLogs],
                ['symptomTracker_customSymptoms',    pdata.customSymptoms],
                ['symptomTracker_favorites',         pdata.chronicSymptoms],
                ['symptomTracker_medications',       pdata.medications],
                ['symptomTracker_medicationLogs',    pdata.medicationLogs],
                ['symptomTracker_medicationHistory', pdata.medicationHistory],
                ['symptomTracker_measurements',      pdata.measurements],
                ['symptomTracker_appointments',      pdata.appointments],
                ['symptomTracker_reminderSettings',  pdata.reminderSettings],
                ['symptomTracker_8940worksheet',     pdata.worksheet8940],
                ['symptomTracker_weightGoal',        pdata.weightGoal],
                ['symptomTracker_mentalHealthScores',pdata.mentalHealthScores],
                ['symptomTracker_sleepApneaProfile', pdata.sleepApneaProfile],
              ];
              profileKeys.forEach(([baseKey, value]) => {
                if (value !== null && value !== undefined) {
                  writePromises.push(cacheSet(`${baseKey}_${pid}`, value));
                }
              });
            });
          }

          // Wait for ALL IDB writes to complete before reloading
          await Promise.all(writePromises);
          alert('Data restored successfully! The page will now reload.');
          window.location.reload();
          return;
        }

        // VERSION 2.0 format — rawData only (no data wrapper)
        if (imported.rawData) {
          // Separate global (localStorage) keys from profile (IDB) keys
          const writePromises = [];
          Object.entries(imported.rawData).forEach(([key, value]) => {
            if (LOCAL_KEYS.has(key)) {
              // Global key — localStorage (synchronous, no promise needed)
              localStorage.setItem(key,
                  typeof value === 'string' ? value : JSON.stringify(value));
            } else {
              // Profile data — write to IDB and collect the promise
              const parsed = typeof value === 'string'
                  ? (() => { try { return JSON.parse(value); } catch { return value; } })()
                  : value;
              writePromises.push(cacheSet(key, parsed));
            }
          });

          // Wait for ALL IndexedDB writes to complete before reloading
          await Promise.all(writePromises);
          alert('Data restored successfully! The page will now reload.');
          window.location.reload();
          return;
        }

        // LEGACY format — data at root level (old backups before multi-profile)
        if (imported.symptomLogs && !imported.data) {
          const profileId = imported.activeProfileId || 'default';
          const legacyPromises = [];
          if (imported.symptomLogs)
            legacyPromises.push(cacheSet(`symptomTracker_logs_${profileId}`, imported.symptomLogs));
          if (imported.customSymptoms)
            legacyPromises.push(cacheSet(`symptomTracker_customSymptoms_${profileId}`, imported.customSymptoms));
          if (imported.chronicConditions)
            legacyPromises.push(cacheSet(`symptomTracker_favorites_${profileId}`, imported.chronicConditions));
          if (imported.medications)
            legacyPromises.push(cacheSet(`symptomTracker_medications_${profileId}`, imported.medications));
          if (imported.medicationLogs)
            legacyPromises.push(cacheSet(`symptomTracker_medicationLogs_${profileId}`, imported.medicationLogs));
          if (imported.appointments)
            legacyPromises.push(cacheSet(`symptomTracker_appointments_${profileId}`, imported.appointments));
          if (imported.userProfile)
            localStorage.setItem(`symptomTracker_profile_${profileId}`,
                JSON.stringify(imported.userProfile));
          if (imported.profiles)
            localStorage.setItem('symptomTracker_profiles',
                JSON.stringify(imported.profiles));
          if (imported.activeProfileId)
            localStorage.setItem('symptomTracker_activeProfileId',
                imported.activeProfileId);
          if (imported.theme)
            localStorage.setItem('symptomTracker_theme', imported.theme);
          if (imported.reminderSettings)
            legacyPromises.push(cacheSet(`symptomTracker_reminderSettings_${profileId}`,
                imported.reminderSettings));
          if (imported.onboardingComplete !== undefined)
            localStorage.setItem('symptomTracker_onboardingComplete',
                String(imported.onboardingComplete));
          await Promise.all(legacyPromises);
          alert('Legacy backup restored successfully! The page will now reload.');
          window.location.reload();
          return;
        }

        // VERSION 1.0 format — has data wrapper but no rawData
        if (imported.data) {
          const { data } = imported;
          const profileId = imported.activeProfileId
              || localStorage.getItem('symptomTracker_activeProfileId')
              || 'default';
          const v1Promises = [];
          if (data.symptomLogs)
            v1Promises.push(cacheSet(`symptomTracker_logs_${profileId}`, data.symptomLogs));
          if (data.customSymptoms)
            v1Promises.push(cacheSet(`symptomTracker_customSymptoms_${profileId}`, data.customSymptoms));
          if (data.chronicSymptoms)
            v1Promises.push(cacheSet(`symptomTracker_favorites_${profileId}`, data.chronicSymptoms));
          if (data.medications)
            v1Promises.push(cacheSet(`symptomTracker_medications_${profileId}`, data.medications));
          if (data.medicationLogs)
            v1Promises.push(cacheSet(`symptomTracker_medicationLogs_${profileId}`, data.medicationLogs));
          if (data.measurements)
            v1Promises.push(cacheSet(`symptomTracker_measurements_${profileId}`, data.measurements));
          if (data.appointments)
            v1Promises.push(cacheSet(`symptomTracker_appointments_${profileId}`, data.appointments));
          if (data.profiles)
            localStorage.setItem('symptomTracker_profiles',
                JSON.stringify(data.profiles));
          if (data.userProfile)
            localStorage.setItem(`symptomTracker_profile_${profileId}`,
                JSON.stringify(data.userProfile));
          if (data.theme)
            localStorage.setItem('symptomTracker_theme', data.theme);
          if (data.reminderSettings)
            v1Promises.push(cacheSet(`symptomTracker_reminderSettings_${profileId}`,
                data.reminderSettings));
          if (data.onboardingComplete !== undefined)
            localStorage.setItem('symptomTracker_onboardingComplete',
                String(data.onboardingComplete));
          if (data.worksheet8940)
            v1Promises.push(cacheSet(`symptomTracker_8940worksheet_${profileId}`,
                data.worksheet8940));
          if (data.weightGoal)
            v1Promises.push(cacheSet(`symptomTracker_weightGoal_${profileId}`, data.weightGoal));
          if (data.mentalHealthScores)
            v1Promises.push(cacheSet(`symptomTracker_mentalHealthScores_${profileId}`,
                data.mentalHealthScores));
          if (data.sleepApneaProfile)
            v1Promises.push(cacheSet(`symptomTracker_sleepApneaProfile_${profileId}`,
                data.sleepApneaProfile));
          if (data.medicationHistory)
            v1Promises.push(cacheSet(`symptomTracker_medicationHistory_${profileId}`,
                data.medicationHistory));
          await Promise.all(v1Promises);
          alert('Data restored successfully! The page will now reload.');
          window.location.reload();
        }
      } catch (error) {
        alert('Error reading backup file: ' + error.message);
        console.error('Import error:', error);
      }
    };
    reader.readAsText(file);
  };

  const daysSinceBackup = lastBackup
      ? Math.floor((Date.now() - new Date(lastBackup).getTime()) / (1000 * 60 * 60 * 24))
      : null;

  return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
        <div className="flex items-center gap-3 mb-4">
          <Shield className="w-8 h-8 text-green-600 dark:text-green-400" />
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              The Bunker
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Crash-proof backup system
            </p>
          </div>
        </div>

        {/* Storage health warning — shown in DataBunker so user acts immediately */}
        {storageHealth.level !== 'ok' && (
            <div className={`rounded-lg border p-3 mb-4 ${
                storageHealth.level === 'critical'
                    ? 'bg-red-50 dark:bg-red-900/20 border-red-300 dark:border-red-700'
                    : 'bg-amber-50 dark:bg-amber-900/20 border-amber-200 dark:border-amber-800'
            }`}>
              <div className="flex items-start gap-2">
                <AlertTriangle className={`w-5 h-5 flex-shrink-0 mt-0.5 ${
                    storageHealth.level === 'critical'
                        ? 'text-red-600 dark:text-red-400'
                        : 'text-amber-600 dark:text-amber-400'
                }`} />
                <div>
                  <p className={`text-sm font-semibold ${
                      storageHealth.level === 'critical'
                          ? 'text-red-800 dark:text-red-200'
                          : 'text-amber-800 dark:text-amber-200'
                  }`}>
                    {storageHealth.level === 'critical'
                        ? `Storage ${storageHealth.pctLabel}% full — backup now`
                        : `Storage ${storageHealth.pctLabel}% full — backup soon`}
                  </p>
                  <p className={`text-xs mt-0.5 ${
                      storageHealth.level === 'critical'
                          ? 'text-red-700 dark:text-red-300'
                          : 'text-amber-700 dark:text-amber-300'
                  }`}>
                    {storageHealth.usedMB} MB used of ~{storageHealth.limitMB} MB.
                    {storageHealth.level === 'critical'
                        ? ' New entries may stop saving until you free up space.'
                        : ' Export a backup to protect your records.'}
                  </p>
                </div>
              </div>
            </div>
        )}

          {/* Data Stats */}
          <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-3 mb-4">
              <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Your data to protect:
              </p>
              <div className="grid grid-cols-2 gap-2 text-center">
                  <div className="bg-white dark:bg-gray-800 rounded-lg p-2">
                      <p className="text-xl font-bold text-green-600 dark:text-green-400">
                          {dataStats.logs}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">Symptom Entries</p>
                  </div>
                  <div className="bg-white dark:bg-gray-800 rounded-lg p-2">
                      <p className="text-xl font-bold text-green-600 dark:text-green-400">
                          {dataStats.appointments || 0}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">Appointments</p>
                  </div>
                  <div className="bg-white dark:bg-gray-800 rounded-lg p-2">
                      <p className="text-xl font-bold text-green-600 dark:text-green-400">
                          {dataStats.chronicSymptoms || 0}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">Quick Log Items</p>
                  </div>
                  <div className="bg-white dark:bg-gray-800 rounded-lg p-2">
                      <p className="text-xl font-bold text-green-600 dark:text-green-400">
                          {dataStats.measurements || 0}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">Measurements</p>
                  </div>
              </div>
          </div>

          {/* Warning if no recent backup */}
        {(daysSinceBackup === null || daysSinceBackup > 7) && (
            <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200
                        dark:border-amber-800 rounded-lg p-3 mb-4">
              <div className="flex items-start gap-2">
                <AlertTriangle className="w-5 h-5 text-amber-600 dark:text-amber-400
                                       flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-amber-800 dark:text-amber-200">
                    {daysSinceBackup === null
                        ? "You haven't created a backup yet!"
                        : `Last backup was ${daysSinceBackup} days ago`}
                  </p>
                  <p className="text-xs text-amber-700 dark:text-amber-300 mt-1">
                    Your data only exists in this browser. Export a backup now!
                  </p>
                </div>
              </div>
            </div>
        )}

        {/* Last backup info */}
        {lastBackup && (
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
              Last backup: {new Date(lastBackup).toLocaleDateString()} at{' '}
              {new Date(lastBackup).toLocaleTimeString()}
            </p>
        )}

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-3">
          <button
              onClick={handleExportBunker}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-3
                     bg-green-600 hover:bg-green-700 text-white rounded-lg
                     font-medium transition-colors"
          >
            <Download className="w-5 h-5" />
            Save Backup
          </button>

          {isNativePlatform() ? (
              <button
                  onClick={handleNativeRestore}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-3
                           bg-blue-600 hover:bg-blue-700 text-white rounded-lg
                           font-medium transition-colors"
              >
                <Upload className="w-5 h-5" />
                Restore Backup
              </button>
          ) : (
              <label className="flex-1 flex items-center justify-center gap-2 px-4 py-3
                            bg-blue-600 hover:bg-blue-700 text-white rounded-lg
                            font-medium cursor-pointer transition-colors">
                <Upload className="w-5 h-5" />
                Restore Backup
                <input
                    type="file"
                    accept=".json"
                    onChange={handleImportBunker}
                    className="hidden"
                />
              </label>
          )}
        </div>

        {/* Info */}
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-4 text-center">
          {isNativePlatform()
              ? 'Android: tap Drive or scroll to "Save to Device" in the share sheet. iOS: tap Save to Files.'
              : 'Save backup files to your computer, cloud storage, or USB drive'}
        </p>
      </div>
  );
}