import { useState, useEffect, useRef } from 'react';
import {
  notificationsSupported,
  getNotificationPermission,
  requestNotificationPermission,
  registerServiceWorker,
  getReminderSettings,
  saveReminderSettings,
  showNotification,
} from '../utils/notifications';
import {
  exportAllData,
  importAllData,
  getDataStats,
  resetOnboarding,
} from '../utils/storage';
import ProfileManagement from './ProfileManagement';
import ServiceConnectedConditions from './ServiceConnectedConditions';
import useProfile from '../hooks/useProfile.jsx';
import { getBackupHistory } from '../utils/storageVersion';
import { restoreFromEmergencyBackup } from '../utils/storageVersion';
import { createEmergencyBackup } from '../utils/storageVersion';

/**
 * Display backup history
 */
const BackupHistoryDisplay = () => {
  const [history, setHistory] = useState([]);

  useEffect(() => {
    setHistory(getBackupHistory());
  }, []);

  if (history.length === 0) {
    return (
        <div className="bg-gray-50 dark:bg-gray-700/30 rounded-lg p-4 text-center">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            No automatic backups yet. Your first backup will be created within 24 hours.
          </p>
        </div>
    );
  }

  return (
      <div className="bg-gray-50 dark:bg-gray-700/30 rounded-lg p-3 space-y-2 max-h-48 overflow-y-auto">
        {history.slice().reverse().map((backup, idx) => (
            <div
                key={idx}
                className="flex items-center justify-between text-sm bg-white dark:bg-gray-800 rounded p-2"
            >
              <div className="flex items-center gap-2">
                <span>📅</span>
                <span className="font-medium text-gray-900 dark:text-white">
              {backup.date}
            </span>
                <span className="text-gray-600 dark:text-gray-400">
              at {new Date(backup.timestamp).toLocaleTimeString()}
            </span>
              </div>
              <span className="text-xs text-gray-500 dark:text-gray-400 font-mono">
            {(backup.dataSize / 1024).toFixed(1)} KB
          </span>
            </div>
        ))}
      </div>
  );
};


const Settings = ({ onNavigate }) => {  // ← ADD onNavigate prop
  // Theme state (no context needed)
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('symptomTracker_theme') || 'system';
  });
  const { profile: currentProfile } = useProfile();

  const [permissionStatus, setPermissionStatus] = useState('default');
  const [reminderSettings, setReminderSettings] = useState(getReminderSettings());
  const [supported, setSupported] = useState(true);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('info');
  const [dataStats, setDataStats] = useState({ logs: 0, customSymptoms: 0, chronicSymptoms: 0, appointments: 0 });
  const [showRestoreConfirm, setShowRestoreConfirm] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleteConfirmText, setDeleteConfirmText] = useState('');
  const [pendingRestore, setPendingRestore] = useState(null);
  const fileInputRef = useRef(null);


  useEffect(() => {
    const checkStatus = async () => {
      setSupported(notificationsSupported());
      setPermissionStatus(getNotificationPermission());
      setDataStats(getDataStats());

      if (notificationsSupported()) {
        await registerServiceWorker();
      }
    };
    checkStatus();

    // Listen for profile changes and reload data stats
    const handleProfileChange = () => {
      setDataStats(getDataStats());
    };

    window.addEventListener('profileChanged', handleProfileChange);
    return () => window.removeEventListener('profileChanged', handleProfileChange);
  }, []);

  // Theme handler
  const setThemeMode = (newTheme) => {
    setTheme(newTheme);
    localStorage.setItem('symptomTracker_theme', newTheme);

    // Apply theme immediately
    if (newTheme === 'dark') {
      document.documentElement.classList.add('dark');
    } else if (newTheme === 'light') {
      document.documentElement.classList.remove('dark');
    } else {
      // System preference
      if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    }
  };

  const showMessage = (text, type = 'info') => {
    setMessage(text);
    setMessageType(type);
    setTimeout(() => setMessage(''), 4000);
  };

  const handleEnableNotifications = async () => {
    const result = await requestNotificationPermission();
    setPermissionStatus(getNotificationPermission());
    showMessage(result.message, result.success ? 'success' : 'error');
  };

  const handleToggleReminders = (enabled) => {
    const newSettings = { ...reminderSettings, enabled };
    setReminderSettings(newSettings);
    saveReminderSettings(newSettings);
  };

  const handleAddTime = () => {
    if (reminderSettings.times.length >= 5) {
      showMessage('Maximum 5 reminder times allowed', 'error');
      return;
    }
    const newSettings = {
      ...reminderSettings,
      times: [...reminderSettings.times, '12:00'],
    };
    setReminderSettings(newSettings);
    saveReminderSettings(newSettings);
  };

  const handleRemoveTime = (index) => {
    const newTimes = reminderSettings.times.filter((_, i) => i !== index);
    const newSettings = { ...reminderSettings, times: newTimes };
    setReminderSettings(newSettings);
    saveReminderSettings(newSettings);
  };

  const handleTimeChange = (index, value) => {
    const newTimes = [...reminderSettings.times];
    newTimes[index] = value;
    const newSettings = { ...reminderSettings, times: newTimes };
    setReminderSettings(newSettings);
    saveReminderSettings(newSettings);
  };

  const handleTestNotification = async () => {
    const result = await showNotification(
        'Test Reminder',
        'This is what your symptom reminder will look like!'
    );
    if (!result.success) {
      showMessage(result.message, 'error');
    }
  };

  // Backup & Restore handlers
  const handleExportData = () => {
    exportAllData();
    showMessage('Backup file downloaded!', 'success');
  };

  const handleImportClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileSelect = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      const text = await file.text();
      const data = JSON.parse(text);
      setPendingRestore(data);
      setShowRestoreConfirm(true);
    } catch (error) {
      showMessage('Invalid backup file', 'error');
    }

    event.target.value = '';
  };

  const handleConfirmRestore = (merge = false) => {
    if (!pendingRestore) return;

    const result = importAllData(pendingRestore, { merge });

    if (result.success) {
      showMessage(result.message, 'success');
      setDataStats(getDataStats());

      // Trigger profile refresh to update ServiceConnectedConditions
      window.dispatchEvent(new Event('profileChanged'));

      // Force page reload after a short delay to ensure everything refreshes
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    } else {
      showMessage(result.message, 'error');
    }

    setShowRestoreConfirm(false);
    setPendingRestore(null);
  };

  const handleCancelRestore = () => {
    setShowRestoreConfirm(false);
    setPendingRestore(null);
  };

  const handleDeleteAllData = () => {
    if (deleteConfirmText !== 'DELETE') {
      showMessage('Please type DELETE to confirm', 'error');
      return;
    }

    // Clear ALL localStorage keys for this app (including backups)
    const keysToRemove = [];

    // Collect all symptomTracker keys
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith('symptomTracker_')) {
        keysToRemove.push(key);
      }
    }

    // Remove all keys
    keysToRemove.forEach(key => {
      localStorage.removeItem(key);
    });

    // Also clear sessionStorage backups
    sessionStorage.clear();

    console.log(`Deleted ${keysToRemove.length} items from localStorage`);

    // Reload page to reset app state
    window.location.reload();
  };

  return (
      <div className="space-y-4 text-left">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Settings</h2>

        {/* Theme Settings */}
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4">
          <h3 className="font-medium text-gray-900 dark:text-white mb-3">Appearance</h3>

          <label className="block text-sm text-gray-700 dark:text-gray-300 mb-2">Theme</label>
          <div className="grid grid-cols-3 gap-2">
            <button
                onClick={() => setThemeMode('light')}
                className={`py-2 px-3 rounded-lg border-2 transition-colors ${
                    theme === 'light'
                        ? 'border-blue-900 dark:border-blue-500 bg-blue-50 dark:bg-blue-900/30 text-blue-900 dark:text-blue-300'
                        : 'border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
                }`}
            >
              ☀️ Light
            </button>
            <button
                onClick={() => setThemeMode('dark')}
                className={`py-2 px-3 rounded-lg border-2 transition-colors ${
                    theme === 'dark'
                        ? 'border-blue-900 dark:border-blue-500 bg-blue-50 dark:bg-blue-900/30 text-blue-900 dark:text-blue-300'
                        : 'border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
                }`}
            >
              🌙 Dark
            </button>
            <button
                onClick={() => setThemeMode('system')}
                className={`py-2 px-3 rounded-lg border-2 transition-colors ${
                    theme === 'system'
                        ? 'border-blue-900 dark:border-blue-500 bg-blue-50 dark:bg-blue-900/30 text-blue-900 dark:text-blue-300'
                        : 'border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
                }`}
            >
              💻 System
            </button>
          </div>
        </div>

        {/* Message Banner */}
        {message && (
            <div className={`p-3 rounded-lg ${
                messageType === 'success' ? 'bg-green-50 dark:bg-green-900/30 text-green-800 dark:text-green-200 border border-green-200 dark:border-green-800' :
                    messageType === 'error' ? 'bg-red-50 dark:bg-red-900/30 text-red-800 dark:text-red-200 border border-red-200 dark:border-red-800' :
                        'bg-blue-50 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200 border border-blue-200 dark:border-blue-800'
            }`}>
              {message}
            </div>
        )}

        {/* Profile Management */}
        <ProfileManagement />

        {/* Service-Connected Conditions (Veteran profiles only) - Collapsible */}
        {currentProfile && currentProfile.type === 'veteran' && (
            <details className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden group">
              <summary className="px-4 py-3 cursor-pointer flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors list-none">
                <div className="flex items-center gap-2">
                  <span className="text-xl">🎖️</span>
                  <div>
                    <h3 className="font-medium text-gray-900 dark:text-white">My Service-Connected Conditions</h3>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Track VA disability ratings and monitor for increases</p>
                  </div>
                </div>
                <span className="text-gray-400 dark:text-gray-500 transition-transform group-open:rotate-180">
                  ▼
                </span>
              </summary>
              <div className="px-4 pb-4 border-t border-gray-200 dark:border-gray-700">
                <ServiceConnectedConditions />
              </div>
            </details>
        )}
        {/* Secondary Conditions Guide (Veteran profiles only) */}
        {currentProfile && (currentProfile.type === 'veteran' ||
            (currentProfile.type === 'caregiver' && currentProfile.metadata?.isVeteranCaregiver)) && (
            <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4">
              <h3 className="font-medium text-gray-900 dark:text-white mb-2 flex items-center gap-2">
                <span>🔗</span>
                Secondary Conditions Guide
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                Discover potential secondary service-connected conditions based on your primary disabilities.
                Includes nexus strength indicators and documentation tips.
              </p>
              <button
                  onClick={() => onNavigate && onNavigate('secondary-conditions')}
                  className="w-full py-3 px-4 bg-purple-600 hover:bg-purple-700 text-white font-medium rounded-lg flex items-center justify-center gap-2 transition-colors"
              >
                <span>📋</span> View Secondary Conditions Guide
              </button>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                Learn which conditions may be claimed as secondary to your service-connected disabilities
              </p>
            </div>
        )}
        {/* Presumptive Conditions Guide - Veteran only */}
        {currentProfile && (currentProfile.type === 'veteran' ||
            (currentProfile.type === 'caregiver' && currentProfile.metadata?.isVeteranCaregiver)) && (
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
              <div className="flex items-start gap-4">
                <span className="text-3xl">🎖️</span>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    Presumptive Conditions Guide
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                    Conditions the VA presumes are service-connected based on your service era (Vietnam, Gulf War, Camp Lejeune, etc.)
                  </p>
                  <button
                      onClick={() => onNavigate && onNavigate('presumptive-conditions')}
                      className="mt-3 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white
                   rounded-lg font-medium transition-colors inline-flex items-center gap-2"
                  >
                    <span>View Guide</span>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
        )}

        {/* MOS Noise Exposure Lookup */}
        {currentProfile && (currentProfile.type === 'veteran' ||
            (currentProfile.type === 'caregiver' && currentProfile.metadata?.isVeteranCaregiver)) && (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-start gap-4">
            <span className="text-3xl">🔊</span>
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                MOS Noise Exposure Lookup
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                Check if your MOS has presumptive noise exposure for hearing loss/tinnitus claims
              </p>
              <button
                  onClick={() => onNavigate && onNavigate('mos-noise-exposure')}
                  className="mt-3 px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded-lg text-sm font-medium transition-colors"
              >
                Look Up Your MOS
              </button>
            </div>
          </div>
        </div>
        )}


        {/* Notifications */}
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4">
          <h3 className="font-medium text-gray-900 dark:text-white mb-3">Daily Reminders</h3>

          {!supported && (
              <div className="bg-yellow-50 dark:bg-yellow-900/30 border border-yellow-200 dark:border-yellow-800 rounded-lg p-3 mb-3">
                <p className="text-sm text-yellow-800 dark:text-yellow-200">
                  Notifications are not supported in your browser. Try using Chrome, Firefox, or Safari on mobile.
                </p>
              </div>
          )}

          {supported && permissionStatus === 'default' && (
              <div className="mb-4">
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                  Get daily reminders to log your symptoms. Helps build consistent documentation for your VA claim.
                </p>
                <button
                    onClick={handleEnableNotifications}
                    className="w-full py-3 px-4 bg-blue-900 dark:bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-800 dark:hover:bg-blue-700"
                >
                  Enable Notifications
                </button>
              </div>
          )}

          {supported && permissionStatus === 'denied' && (
              <div className="bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 rounded-lg p-3 mb-3">
                <p className="text-sm text-red-800 dark:text-red-200">
                  Notifications blocked. Enable them in your browser settings to receive reminders.
                </p>
              </div>
          )}

          {supported && permissionStatus === 'granted' && (
              <div className="space-y-4 text-left">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-700 dark:text-gray-300">Enable reminders</span>
                  <button
                      onClick={() => handleToggleReminders(!reminderSettings.enabled)}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                          reminderSettings.enabled ? 'bg-blue-900 dark:bg-blue-600' : 'bg-gray-300 dark:bg-gray-600'
                      }`}
                  >
                    <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        reminderSettings.enabled ? 'translate-x-6' : 'translate-x-1'
                    }`} />
                  </button>
                </div>

                {reminderSettings.enabled && (
                    <>
                      <div>
                        <label className="block text-sm text-gray-700 dark:text-gray-300 mb-2">Reminder times</label>
                        <div className="space-y-2">
                          {reminderSettings.times.map((time, index) => (
                              <div key={index} className="flex gap-2">
                                <input
                                    type="time"
                                    value={time}
                                    onChange={(e) => handleTimeChange(index, e.target.value)}
                                    className="flex-1 p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                                />
                                <button
                                    onClick={() => handleRemoveTime(index)}
                                    className="p-2 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-lg"
                                >
                                  ✕
                                </button>
                              </div>
                          ))}
                        </div>
                        {reminderSettings.times.length < 5 && (
                            <button
                                onClick={handleAddTime}
                                className="mt-2 w-full py-2 px-4 border-2 border-dashed border-gray-300 dark:border-gray-600 text-gray-600 dark:text-gray-400 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700"
                            >
                              + Add time
                            </button>
                        )}
                      </div>

                      <button
                          onClick={handleTestNotification}
                          className="w-full py-2 px-4 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700"
                      >
                        Send Test Notification
                      </button>
                    </>
                )}
              </div>
          )}
        </div>

        {/* Emergency Data Recovery */}
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
            <span>🚨</span>
            <span>Emergency Data Recovery</span>
          </h2>

          <div className="space-y-4">
            {/* Show backup history */}
            <div>
              <h3 className="font-medium text-gray-900 dark:text-white mb-2">
                Recent Automatic Backups
              </h3>
              <BackupHistoryDisplay />
            </div>

            {/* Action buttons */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <button
                  onClick={() => {
                    if (confirm('⚠️ Restore data from most recent automatic backup?\n\nThis will overwrite your current data with the last backup.\n\nClick OK to continue.')) {
                      const success = restoreFromEmergencyBackup();
                      if (success) {
                        alert('✅ Data restored successfully!\n\nThe page will now refresh.');
                        window.location.reload();
                      } else {
                        alert('❌ No backup found to restore from.\n\nBackups are created automatically each day.');
                      }
                    }
                  }}
                  className="px-4 py-3 bg-orange-600 hover:bg-orange-700 text-white rounded-lg font-semibold transition-colors flex items-center justify-center gap-2"
              >
                <span>🔄</span>
                <span>Restore from Latest Backup</span>
              </button>

              <button
                  onClick={() => {
                    createEmergencyBackup();
                    alert('✅ Manual backup created successfully!\n\nYour data has been backed up.');
                  }}
                  className="px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition-colors flex items-center justify-center gap-2"
              >
                <span>💾</span>
                <span>Create Manual Backup Now</span>
              </button>
            </div>
          </div>

          <div className="mt-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
            <div className="flex gap-3">
              <span className="text-xl">ℹ️</span>
              <div>
                <h4 className="font-semibold text-blue-900 dark:text-blue-200 mb-1">
                  Automatic Protection
                </h4>
                <p className="text-sm text-blue-800 dark:text-blue-300">
                  Your data is automatically backed up every day. We keep the last 7 days of backups
                  for emergency recovery. Manual backups are stored immediately.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Export Data Section - NEW */}
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4">
          <h3 className="font-medium text-gray-900 dark:text-white mb-3">Export Data</h3>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
            Export your symptom logs and measurements for VA claims or backup
          </p>
          <button
              onClick={() => onNavigate && onNavigate('export')}
              className="w-full py-3 px-4 bg-blue-900 dark:bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-800 dark:hover:bg-blue-700 flex items-center justify-center gap-2"
          >
            <span>📤</span> Go to Export & Reports
          </button>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
            Download PDF reports or export data in CSV/JSON format
          </p>
        </div>

        {/* Backup & Restore Section */}
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4">
          <h3 className="font-medium text-gray-900 dark:text-white mb-3">Backup & Restore</h3>

          {/* Data Stats */}
          <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-3 mb-4">
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Your data:</p>
            <div className="grid grid-cols-2 gap-2 text-center">
              <div>
                <p className="text-xl font-bold text-blue-900 dark:text-blue-400">{dataStats.logs}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">Symptom Entries</p>
              </div>
              <div>
                <p className="text-xl font-bold text-blue-900 dark:text-blue-400">{dataStats.appointments || 0}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">Appointments</p>
              </div>
              <div>
                <p className="text-xl font-bold text-blue-900 dark:text-blue-400">{dataStats.customSymptoms}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">Custom Symptoms</p>
              </div>
              <div>
                <p className="text-xl font-bold text-blue-900 dark:text-blue-400">{dataStats.chronicSymptoms || 0}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">Quick Log Items</p>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <button
                onClick={handleExportData}
                className="w-full py-3 px-4 bg-blue-900 dark:bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-800 dark:hover:bg-blue-700 flex items-center justify-center gap-2"
            >
              <span>💾</span> Download Backup
            </button>

            <button
                onClick={handleImportClick}
                className="w-full py-3 px-4 border-2 border-blue-900 dark:border-blue-500 text-blue-900 dark:text-blue-400 font-medium rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/30 flex items-center justify-center gap-2"
            >
              <span>📤</span> Restore from Backup
            </button>

            <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileSelect}
                accept=".json"
                className="hidden"
            />
          </div>

          <p className="text-xs text-gray-500 dark:text-gray-400 mt-3">
            💡 Back up regularly to avoid losing your symptom history
          </p>
        </div>

        {/* Help & Tutorial Section */}
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4">
          <h3 className="font-medium text-gray-900 dark:text-white mb-3">Help</h3>

          <button
              onClick={() => {
                resetOnboarding();
                window.location.reload();
              }}
              className="w-full py-3 px-4 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 font-medium rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 flex items-center justify-center gap-2"
          >
            <span>📖</span> Show Tutorial Again
          </button>

          <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
            Review the app walkthrough and feature explanations
          </p>
        </div>

        {/* Install App */}
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4">
          <h3 className="font-medium text-gray-900 dark:text-white mb-3">Install App</h3>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
            Add to your home screen for quick access and offline use.
          </p>
          <div className="text-sm text-gray-500 dark:text-gray-400 space-y-2">
            <p><strong>iPhone/iPad:</strong> Tap Share → Add to Home Screen</p>
            <p><strong>Android:</strong> Tap Menu → Add to Home Screen</p>
            <p><strong>Desktop:</strong> Click install icon in address bar</p>
          </div>
        </div>

        {/* Data Privacy & Danger Zone */}
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4">
          <h3 className="font-medium text-gray-900 dark:text-white mb-3">Your Data</h3>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
            All data is stored locally on your device. Nothing is sent to any server.
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
            Use the Export features to back up your data or share with your VSO.
          </p>

          {/* Danger Zone */}
          <div className="border-t border-gray-200 dark:border-gray-700 pt-4 mt-4">
            <h4 className="font-medium text-red-600 dark:text-red-400 mb-3">Danger Zone</h4>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
              Permanently delete all your data. This cannot be undone.
            </p>
            <button
                onClick={() => setShowDeleteConfirm(true)}
                className="w-full py-2 px-4 border-2 border-red-500 text-red-600 dark:text-red-400 font-medium rounded-lg hover:bg-red-50 dark:hover:bg-red-900/30"
            >
              Delete All Data
            </button>
          </div>
        </div>

        {/* Restore Confirmation Modal */}
        {showRestoreConfirm && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
              <div className="bg-white dark:bg-gray-800 rounded-lg w-full max-w-md">
                <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                  <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Restore Data</h2>
                </div>

                <div className="p-4">
                  <p className="text-gray-600 dark:text-gray-400 mb-4">
                    Found {pendingRestore?.symptomLogs?.length || 0} log entries and {pendingRestore?.appointments?.length || 0} appointments in backup.
                    How would you like to restore?
                  </p>

                  <div className="space-y-3">
                    <button
                        onClick={() => handleConfirmRestore(true)}
                        className="w-full py-3 px-4 bg-blue-900 dark:bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-800 dark:hover:bg-blue-700"
                    >
                      Merge with existing data
                      <span className="block text-sm font-normal opacity-80">
                    Adds new entries without removing current data
                  </span>
                    </button>

                    <button
                        onClick={() => handleConfirmRestore(false)}
                        className="w-full py-3 px-4 bg-red-600 text-white font-medium rounded-lg hover:bg-red-700"
                    >
                      Replace all data
                      <span className="block text-sm font-normal opacity-80">
                    ⚠️ This will overwrite your current data
                  </span>
                    </button>

                    <button
                        onClick={handleCancelRestore}
                        className="w-full py-2 px-4 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </div>
            </div>
        )}

        {/* Delete Confirmation Modal */}
        {showDeleteConfirm && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
              <div className="bg-white dark:bg-gray-800 rounded-lg w-full max-w-md">
                <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                  <h2 className="text-lg font-semibold text-red-600 dark:text-red-400">Delete All Data</h2>
                </div>

                <div className="p-4">
                  <div className="bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 rounded-lg p-3 mb-4">
                    <p className="text-red-800 dark:text-red-200 font-medium">⚠️ Warning</p>
                    <p className="text-red-700 dark:text-red-300 text-sm mt-1">
                      This will permanently delete all {dataStats.logs} log entries,
                      {' '}{dataStats.appointments || 0} appointments, and {dataStats.customSymptoms} custom symptoms.
                      This action cannot be undone.
                    </p>
                  </div>

                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                    Type <strong>DELETE</strong> to confirm:
                  </p>
                  <input
                      type="text"
                      value={deleteConfirmText}
                      onChange={(e) => setDeleteConfirmText(e.target.value)}
                      placeholder="Type DELETE"
                      className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-red-500 focus:border-red-500 mb-4"
                  />

                  <div className="flex gap-2">
                    <button
                        onClick={() => {
                          setShowDeleteConfirm(false);
                          setDeleteConfirmText('');
                        }}
                        className="flex-1 py-2 px-4 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700"
                    >
                      Cancel
                    </button>
                    <button
                        onClick={handleDeleteAllData}
                        disabled={deleteConfirmText !== 'DELETE'}
                        className="flex-1 py-2 px-4 bg-red-600 text-white font-medium rounded-lg hover:bg-red-700 disabled:bg-gray-300 dark:disabled:bg-gray-600 disabled:cursor-not-allowed"
                    >
                      Delete Everything
                    </button>
                  </div>
                </div>
              </div>
            </div>
        )}
      </div>
  );
};

export default Settings;