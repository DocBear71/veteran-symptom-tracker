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

    // Clear all localStorage keys for this app
    localStorage.removeItem('symptomTracker_logs');
    localStorage.removeItem('symptomTracker_customSymptoms');
    localStorage.removeItem('symptomTracker_chronicSymptoms');
    localStorage.removeItem('symptomTracker_favorites');
    localStorage.removeItem('symptomTracker_reminderSettings');
    localStorage.removeItem('symptomTracker_medications');
    localStorage.removeItem('symptomTracker_medicationLogs');
    localStorage.removeItem('symptomTracker_appointments');

    // Reload page to reset app state
    window.location.reload();
  };

  return (
      <div className="space-y-4 text-left">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Settings</h2>

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

        {/* Service-Connected Conditions (Veteran profiles only) */}
        {currentProfile && currentProfile.type === 'veteran' && (
            <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4">
              <ServiceConnectedConditions />
            </div>
        )}

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