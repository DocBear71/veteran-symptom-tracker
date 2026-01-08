// Check if notifications are supported
export const notificationsSupported = () => {
  return 'Notification' in window && 'serviceWorker' in navigator;
};

// Get current permission status
export const getNotificationPermission = () => {
  if (!notificationsSupported()) return 'unsupported';
  return Notification.permission;
};

// Request notification permission
export const requestNotificationPermission = async () => {
  if (!notificationsSupported()) {
    return { success: false, message: 'Notifications not supported on this device' };
  }

  try {
    const permission = await Notification.requestPermission();
    return {
      success: permission === 'granted',
      permission,
      message: permission === 'granted'
          ? 'Notifications enabled!'
          : 'Notification permission denied',
    };
  } catch (error) {
    return { success: false, message: error.message };
  }
};

// Register service worker
export const registerServiceWorker = async () => {
  if (!('serviceWorker' in navigator)) {
    return { success: false, message: 'Service workers not supported' };
  }

  try {
    const registration = await navigator.serviceWorker.register('/sw.js');
    return { success: true, registration };
  } catch (error) {
    return { success: false, message: error.message };
  }
};

// Schedule a local notification (for immediate or testing)
export const showNotification = async (title, body) => {
  if (getNotificationPermission() !== 'granted') {
    return { success: false, message: 'Notifications not permitted' };
  }

  try {
    const registration = await navigator.serviceWorker.ready;
    await registration.showNotification(title, {
      body,
      icon: '/icon-192.png',
      badge: '/icon-192.png',
      vibrate: [100, 50, 100],
      tag: 'symptom-reminder',
      renotify: true,
    });
    return { success: true };
  } catch (error) {
    return { success: false, message: error.message };
  }
};

// Storage keys for reminder settings
const REMINDER_SETTINGS_KEY = 'symptomTracker_reminderSettings';

// Get reminder settings
export const getReminderSettings = () => {
  const settings = localStorage.getItem(REMINDER_SETTINGS_KEY);
  return settings ? JSON.parse(settings) : {
    enabled: false,
    times: ['09:00', '21:00'], // Default: morning and evening
    lastNotified: null,
  };
};

// Save reminder settings
export const saveReminderSettings = (settings) => {
  localStorage.setItem(REMINDER_SETTINGS_KEY, JSON.stringify(settings));
};

// Check if it's time to show a reminder
export const shouldShowReminder = () => {
  const settings = getReminderSettings();
  if (!settings.enabled) return false;

  const now = new Date();
  const currentTime = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
  const today = now.toDateString();

  // Check if we've already notified today at this time
  const lastNotified = settings.lastNotified ? new Date(settings.lastNotified) : null;

  for (const reminderTime of settings.times) {
    // Check if current time matches a reminder time (within 1-minute window)
    const [reminderHour, reminderMin] = reminderTime.split(':').map(Number);
    const reminderDate = new Date(now);
    reminderDate.setHours(reminderHour, reminderMin, 0, 0);

    const diffMinutes = Math.abs((now - reminderDate) / 1000 / 60);

    if (diffMinutes < 1) {
      // Check if we already notified for this time today
      if (lastNotified && lastNotified.toDateString() === today) {
        const lastTime = `${String(lastNotified.getHours()).padStart(2, '0')}:${String(lastNotified.getMinutes()).padStart(2, '0')}`;
        if (lastTime === reminderTime) {
          return false; // Already notified
        }
      }
      return true;
    }
  }

  return false;
};

// Mark reminder as shown
export const markReminderShown = () => {
  const settings = getReminderSettings();
  settings.lastNotified = new Date().toISOString();
  saveReminderSettings(settings);
};