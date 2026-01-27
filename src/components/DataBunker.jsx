import { Download, Upload, Shield, AlertTriangle } from 'lucide-react';
import { useState, useEffect } from 'react';
import { getDataStats } from '../utils/storage';

export default function DataBunker() {
    const [lastBackup, setLastBackup] = useState(
        localStorage.getItem('lastBackupDate')
    );
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

        const handleDataChange = () => {
            setDataStats(getDataStats());
        };

        window.addEventListener('profileChanged', handleDataChange);
        window.addEventListener('storage', handleDataChange);

        return () => {
            window.removeEventListener('profileChanged', handleDataChange);
            window.removeEventListener('storage', handleDataChange);
        };
    }, []);

    const handleExportBunker = () => {
        // Get active profile ID for profile-specific data
        const activeProfileId = localStorage.getItem('symptomTracker_activeProfileId') || 'default';

        // Collect ALL symptomTracker data from localStorage
        const allData = {};
        for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);
            if (key && key.startsWith('symptomTracker_')) {
                try {
                    const value = localStorage.getItem(key);
                    // Try to parse as JSON, fallback to raw value
                    try {
                        allData[key] = JSON.parse(value);
                    } catch {
                        allData[key] = value;
                    }
                } catch (e) {
                    console.warn(`Failed to export key: ${key}`, e);
                }
            }
        }

        const data = {
            version: '2.0',
            exportDate: new Date().toISOString(),
            appVersion: '2.5.0',
            activeProfileId,
            // Store all raw localStorage data for complete backup
            rawData: allData,
            // Also store in friendly format for the active profile
            data: {
                symptomLogs: JSON.parse(localStorage.getItem(`symptomTracker_logs_${activeProfileId}`) || '[]'),
                customSymptoms: JSON.parse(localStorage.getItem(`symptomTracker_customSymptoms_${activeProfileId}`) || '[]'),
                chronicSymptoms: JSON.parse(localStorage.getItem(`symptomTracker_chronicSymptoms_${activeProfileId}`) || '[]'),
                serviceConnectedConditions: JSON.parse(
                    localStorage.getItem(`symptomTracker_serviceConnected_${activeProfileId}`) || '[]'
                ),
                medications: JSON.parse(localStorage.getItem(`symptomTracker_medications_${activeProfileId}`) || '[]'),
                medicationLogs: JSON.parse(localStorage.getItem(`symptomTracker_medicationLogs_${activeProfileId}`) || '[]'),
                measurements: JSON.parse(localStorage.getItem(`symptomTracker_measurements_${activeProfileId}`) || '[]'),
                appointments: JSON.parse(localStorage.getItem(`symptomTracker_appointments_${activeProfileId}`) || '[]'),
                profiles: JSON.parse(localStorage.getItem('symptomTracker_profiles') || '[]'),
                userProfile: JSON.parse(localStorage.getItem(`symptomTracker_profile_${activeProfileId}`) || '{}'),
                theme: localStorage.getItem('symptomTracker_theme') || 'system',
                reminderSettings: JSON.parse(localStorage.getItem('symptomTracker_reminderSettings') || '{}'),
                onboardingComplete: localStorage.getItem('symptomTracker_onboardingComplete') === 'true',
            }
        };

    const blob = new Blob([JSON.stringify(data, null, 2)], {
      type: 'application/json'
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `symptom-vault-backup-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);

    const now = new Date().toISOString();
    localStorage.setItem('lastBackupDate', now);
    setLastBackup(now);
  };

    const handleImportBunker = (event) => {
        const file = event.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (e) => {
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

                // VERSION 2.0+ format - has rawData with all localStorage keys
                if (imported.rawData) {
                    // Restore all raw localStorage data
                    Object.entries(imported.rawData).forEach(([key, value]) => {
                        if (typeof value === 'string') {
                            localStorage.setItem(key, value);
                        } else {
                            localStorage.setItem(key, JSON.stringify(value));
                        }
                    });

                    alert('Data restored successfully! The page will now reload.');
                    window.location.reload();
                    return;
                }

                // LEGACY format - data at root level (old backups before multi-profile)
                if (imported.symptomLogs && !imported.data) {
                    // This is the old format - restore with proper keys
                    const profileId = imported.activeProfileId || 'default';

                    if (imported.symptomLogs)
                        localStorage.setItem(`symptomTracker_logs_${profileId}`, JSON.stringify(imported.symptomLogs));
                    if (imported.customSymptoms)
                        localStorage.setItem(`symptomTracker_customSymptoms_${profileId}`, JSON.stringify(imported.customSymptoms));
                    if (imported.chronicConditions)
                        localStorage.setItem(`symptomTracker_chronicSymptoms_${profileId}`, JSON.stringify(imported.chronicConditions));
                    if (imported.medications)
                        localStorage.setItem(`symptomTracker_medications_${profileId}`, JSON.stringify(imported.medications));
                    if (imported.medicationLogs)
                        localStorage.setItem(`symptomTracker_medicationLogs_${profileId}`, JSON.stringify(imported.medicationLogs));
                    if (imported.appointments)
                        localStorage.setItem(`symptomTracker_appointments_${profileId}`, JSON.stringify(imported.appointments));
                    if (imported.userProfile)
                        localStorage.setItem(`symptomTracker_profile_${profileId}`, JSON.stringify(imported.userProfile));
                    if (imported.profiles)
                        localStorage.setItem('symptomTracker_profiles', JSON.stringify(imported.profiles));
                    if (imported.activeProfileId)
                        localStorage.setItem('symptomTracker_activeProfileId', imported.activeProfileId);
                    if (imported.theme)
                        localStorage.setItem('symptomTracker_theme', imported.theme);
                    if (imported.reminderSettings)
                        localStorage.setItem('symptomTracker_reminderSettings', JSON.stringify(imported.reminderSettings));
                    if (imported.onboardingComplete !== undefined)
                        localStorage.setItem('symptomTracker_onboardingComplete', String(imported.onboardingComplete));

                    alert('Legacy backup restored successfully! The page will now reload.');
                    window.location.reload();
                    return;
                }

                // VERSION 1.0 format - has data wrapper but no rawData
                if (imported.data) {
                    const { data } = imported;
                    const profileId = imported.activeProfileId || localStorage.getItem('symptomTracker_activeProfileId') || 'default';

                    if (data.symptomLogs)
                        localStorage.setItem(`symptomTracker_logs_${profileId}`, JSON.stringify(data.symptomLogs));
                    if (data.customSymptoms)
                        localStorage.setItem(`symptomTracker_customSymptoms_${profileId}`, JSON.stringify(data.customSymptoms));
                    if (data.chronicSymptoms)
                        localStorage.setItem(`symptomTracker_chronicSymptoms_${profileId}`, JSON.stringify(data.chronicSymptoms));
                    if (data.serviceConnectedConditions)
                        localStorage.setItem(`symptomTracker_serviceConnected_${profileId}`, JSON.stringify(data.serviceConnectedConditions));
                    if (data.medications)
                        localStorage.setItem(`symptomTracker_medications_${profileId}`, JSON.stringify(data.medications));
                    if (data.medicationLogs)
                        localStorage.setItem(`symptomTracker_medicationLogs_${profileId}`, JSON.stringify(data.medicationLogs));
                    if (data.measurements)
                        localStorage.setItem(`symptomTracker_measurements_${profileId}`, JSON.stringify(data.measurements));
                    if (data.appointments)
                        localStorage.setItem(`symptomTracker_appointments_${profileId}`, JSON.stringify(data.appointments));
                    if (data.profiles)
                        localStorage.setItem('symptomTracker_profiles', JSON.stringify(data.profiles));
                    if (data.userProfile)
                        localStorage.setItem(`symptomTracker_profile_${profileId}`, JSON.stringify(data.userProfile));
                    if (data.theme)
                        localStorage.setItem('symptomTracker_theme', data.theme);
                    if (data.reminderSettings)
                        localStorage.setItem('symptomTracker_reminderSettings', JSON.stringify(data.reminderSettings));
                    if (data.onboardingComplete !== undefined)
                        localStorage.setItem('symptomTracker_onboardingComplete', String(data.onboardingComplete));

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
        </div>

        {/* Info */}
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-4 text-center">
          Save backup files to your computer, cloud storage, or USB drive
        </p>
      </div>
  );
}