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
  clearAllData,
} from '../utils/storage';

const Settings = () => {
  const [permissionStatus, setPermissionStatus] = useState('default');
  const [reminderSettings, setReminderSettings] = useState(getReminderSettings());
  const [supported, setSupported] = useState(true);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('info'); // info, success, error
  const [dataStats, setDataStats] = useState({ logs: 0, customSymptoms: 0, favorites: 0 });
  const [showRestoreConfirm, setShowRestoreConfirm] = useState(false);
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
  }, []);

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

      // Store pending data and show confirmation
      setPendingRestore(data);
      setShowRestoreConfirm(true);
    } catch (error) {
      showMessage('Invalid backup file', 'error');
    }

    // Reset file input
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

  return (
      <div className="pb-20">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Settings</h2>

        {/* Status Message */}
        {message && (
            <div className={`mb-4 p-3 rounded-lg text-center ${
                messageType === 'success' ? 'bg-green-100 text-green-800' :
                    messageType === 'error' ? 'bg-red-100 text-red-800' :
                        'bg-blue-100 text-blue-800'
            }`}>
              {message}
            </div>
        )}

        {/* Notification Support Warning */}
        {!supported && (
            <div className="mb-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <p className="text-yellow-800 font-medium">Notifications not supported</p>
              <p className="text-yellow-700 text-sm mt-1">
                Your browser or device doesn't support push notifications.
              </p>
            </div>
        )}

        {/* Daily Reminders Section */}
        <div className="bg-white rounded-lg border border-gray-200 p-4 mb-4">
          <h3 className="font-medium text-gray-900 mb-3">Daily Reminders</h3>

          {supported && permissionStatus !== 'granted' && (
              <div className="mb-4 p-3 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-600 mb-2">
                  Enable notifications to receive daily reminders to log your symptoms.
                </p>
                <button
                    onClick={handleEnableNotifications}
                    className="w-full py-2 px-4 bg-blue-900 text-white font-medium rounded-lg hover:bg-blue-800"
                >
                  Enable Notifications
                </button>
              </div>
          )}

          {permissionStatus === 'granted' && (
              <>
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <p className="font-medium text-gray-900">Reminder Alerts</p>
                    <p className="text-sm text-gray-500">Get reminded to log symptoms</p>
                  </div>
                  <button
                      onClick={() => handleToggleReminders(!reminderSettings.enabled)}
                      className={`relative w-14 h-8 rounded-full transition-colors ${
                          reminderSettings.enabled ? 'bg-blue-900' : 'bg-gray-300'
                      }`}
                  >
                <span
                    className={`absolute top-1 w-6 h-6 bg-white rounded-full shadow transition-transform ${
                        reminderSettings.enabled ? 'left-7' : 'left-1'
                    }`}
                />
                  </button>
                </div>

                {reminderSettings.enabled && (
                    <div className="space-y-3">
                      <p className="text-sm font-medium text-gray-700">Reminder Times</p>

                      {reminderSettings.times.map((time, index) => (
                          <div key={index} className="flex items-center gap-2">
                            <input
                                type="time"
                                value={time}
                                onChange={(e) => handleTimeChange(index, e.target.value)}
                                className="flex-1 p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                            />
                            {reminderSettings.times.length > 1 && (
                                <button
                                    onClick={() => handleRemoveTime(index)}
                                    className="p-2 text-red-500 hover:bg-red-50 rounded-lg"
                                    aria-label="Remove time"
                                >
                                  ✕
                                </button>
                            )}
                          </div>
                      ))}

                      <button
                          onClick={handleAddTime}
                          className="w-full py-2 px-4 border-2 border-dashed border-gray-300 text-gray-600 rounded-lg hover:border-gray-400"
                      >
                        + Add Another Time
                      </button>

                      <button
                          onClick={handleTestNotification}
                          className="w-full py-2 px-4 bg-gray-100 text-gray-700 font-medium rounded-lg hover:bg-gray-200"
                      >
                        Test Notification
                      </button>
                    </div>
                )}
              </>
          )}

          {permissionStatus === 'denied' && (
              <div className="p-3 bg-red-50 rounded-lg">
                <p className="text-red-800 font-medium">Notifications Blocked</p>
                <p className="text-red-700 text-sm mt-1">
                  To enable, click the lock icon in your browser's address bar.
                </p>
              </div>
          )}
        </div>

        {/* Backup & Restore Section */}
        <div className="bg-white rounded-lg border border-gray-200 p-4 mb-4">
          <h3 className="font-medium text-gray-900 mb-3">Backup & Restore</h3>

          {/* Data Stats */}
          <div className="bg-gray-50 rounded-lg p-3 mb-4">
            <p className="text-sm text-gray-600 mb-2">Your data:</p>
            <div className="grid grid-cols-3 gap-2 text-center">
              <div>
                <p className="text-xl font-bold text-blue-900">{dataStats.logs}</p>
                <p className="text-xs text-gray-500">Log Entries</p>
              </div>
              <div>
                <p className="text-xl font-bold text-blue-900">{dataStats.customSymptoms}</p>
                <p className="text-xs text-gray-500">Custom Symptoms</p>
              </div>
              <div>
                <p className="text-xl font-bold text-blue-900">{dataStats.favorites}</p>
                <p className="text-xs text-gray-500">Favorites</p>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <button
                onClick={handleExportData}
                className="w-full py-3 px-4 bg-blue-900 text-white font-medium rounded-lg hover:bg-blue-800 flex items-center justify-center gap-2"
            >
              <span>📥</span> Download Backup
            </button>

            <button
                onClick={handleImportClick}
                className="w-full py-3 px-4 border-2 border-blue-900 text-blue-900 font-medium rounded-lg hover:bg-blue-50 flex items-center justify-center gap-2"
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

          <p className="text-xs text-gray-500 mt-3">
            💡 Back up regularly to avoid losing your symptom history
          </p>
        </div>

        {/* Install App */}
        <div className="bg-white rounded-lg border border-gray-200 p-4 mb-4">
          <h3 className="font-medium text-gray-900 mb-3">Install App</h3>
          <p className="text-sm text-gray-600 mb-3">
            Add to your home screen for quick access and offline use.
          </p>
          <div className="text-sm text-gray-500 space-y-2">
            <p><strong>iPhone/iPad:</strong> Tap Share → Add to Home Screen</p>
            <p><strong>Android:</strong> Tap Menu → Add to Home Screen</p>
            <p><strong>Desktop:</strong> Click install icon in address bar</p>
          </div>
        </div>

        {/* Data Privacy */}
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <h3 className="font-medium text-gray-900 mb-3">Your Data</h3>
          <p className="text-sm text-gray-600 mb-3">
            All data is stored locally on your device. Nothing is sent to any server.
          </p>
          <p className="text-sm text-gray-500">
            Use the Export features to back up your data or share with your VSO.
          </p>
        </div>

        {/* Restore Confirmation Modal */}
        {showRestoreConfirm && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
              <div className="bg-white rounded-lg w-full max-w-md">
                <div className="p-4 border-b border-gray-200">
                  <h2 className="text-lg font-semibold text-gray-900">Restore Data</h2>
                </div>

                <div className="p-4">
                  <p className="text-gray-600 mb-4">
                    Found {pendingRestore?.symptomLogs?.length || 0} log entries in backup.
                    How would you like to restore?
                  </p>

                  <div className="space-y-3">
                    <button
                        onClick={() => handleConfirmRestore(true)}
                        className="w-full py-3 px-4 bg-blue-900 text-white font-medium rounded-lg hover:bg-blue-800"
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
                        className="w-full py-2 px-4 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                    >
                      Cancel
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