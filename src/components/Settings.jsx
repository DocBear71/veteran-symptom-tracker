import { useState, useEffect } from 'react';
import {
  notificationsSupported,
  getNotificationPermission,
  requestNotificationPermission,
  registerServiceWorker,
  getReminderSettings,
  saveReminderSettings,
  showNotification,
} from '../utils/notifications';

const Settings = () => {
  const [permissionStatus, setPermissionStatus] = useState('default');
  const [reminderSettings, setReminderSettings] = useState(getReminderSettings());
  const [supported, setSupported] = useState(true);
  const [message, setMessage] = useState('');

  useEffect(() => {
    // Check support and permission on mount
    const checkStatus = async () => {
      setSupported(notificationsSupported());
      setPermissionStatus(getNotificationPermission());

      // Register service worker
      if (notificationsSupported()) {
        await registerServiceWorker();
      }
    };
    checkStatus();
  }, []);

  const handleEnableNotifications = async () => {
    const result = await requestNotificationPermission();
    setPermissionStatus(getNotificationPermission());
    setMessage(result.message);
    setTimeout(() => setMessage(''), 3000);
  };

  const handleToggleReminders = (enabled) => {
    const newSettings = { ...reminderSettings, enabled };
    setReminderSettings(newSettings);
    saveReminderSettings(newSettings);
  };

  const handleAddTime = () => {
    if (reminderSettings.times.length >= 5) {
      setMessage('Maximum 5 reminder times allowed');
      setTimeout(() => setMessage(''), 3000);
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
      setMessage(result.message);
      setTimeout(() => setMessage(''), 3000);
    }
  };

  return (
      <div className="pb-20">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Settings</h2>

        {/* Status Message */}
        {message && (
            <div className="mb-4 p-3 bg-blue-100 text-blue-800 rounded-lg text-center">
              {message}
            </div>
        )}

        {/* Notification Support Warning */}
        {!supported && (
            <div className="mb-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <p className="text-yellow-800 font-medium">Notifications not supported</p>
              <p className="text-yellow-700 text-sm mt-1">
                Your browser or device doesn't support push notifications.
                Try using Chrome, Firefox, or Edge on desktop, or add this app to your home screen on mobile.
              </p>
            </div>
        )}

        {/* Daily Reminders Section */}
        <div className="bg-white rounded-lg border border-gray-200 p-4 mb-4">
          <h3 className="font-medium text-gray-900 mb-3">Daily Reminders</h3>

          {/* Permission Status */}
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

          {/* Reminder Toggle */}
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

                {/* Reminder Times */}
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
                          className="w-full py-2 px-4 border-2 border-dashed border-gray-300 text-gray-600 rounded-lg hover:border-gray-400 hover:text-gray-700"
                      >
                        + Add Another Time
                      </button>

                      {/* Test Notification */}
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
                  You've blocked notifications. To enable them, click the lock icon in your browser's address bar and allow notifications.
                </p>
              </div>
          )}
        </div>

        {/* App Info */}
        <div className="bg-white rounded-lg border border-gray-200 p-4 mb-4">
          <h3 className="font-medium text-gray-900 mb-3">Install App</h3>
          <p className="text-sm text-gray-600 mb-3">
            Add Veteran Symptom Tracker to your home screen for quick access and offline use.
          </p>
          <div className="text-sm text-gray-500 space-y-2">
            <p><strong>iPhone/iPad:</strong> Tap Share → Add to Home Screen</p>
            <p><strong>Android:</strong> Tap Menu → Add to Home Screen</p>
            <p><strong>Desktop:</strong> Click the install icon in your browser's address bar</p>
          </div>
        </div>

        {/* Data Management */}
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <h3 className="font-medium text-gray-900 mb-3">Your Data</h3>
          <p className="text-sm text-gray-600 mb-3">
            All data is stored locally on your device. Nothing is sent to any server.
          </p>
          <p className="text-sm text-gray-500">
            Use the Export feature to back up your data regularly.
          </p>
        </div>
      </div>
  );
};

export default Settings;