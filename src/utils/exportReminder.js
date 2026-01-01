/**
 * Export Reminder System
 * Reminds users to export data periodically
 */

const REMINDER_KEY = 'symptomTracker_lastExportReminder';
const EXPORT_DATE_KEY = 'symptomTracker_lastExportDate';
const REMINDER_INTERVAL_DAYS = 7; // Remind every 7 days

/**
 * Check if user should be reminded to export
 */
export const shouldShowExportReminder = () => {
  const lastReminder = localStorage.getItem(REMINDER_KEY);
  const lastExport = localStorage.getItem(EXPORT_DATE_KEY);

  const now = Date.now();
  const reminderInterval = REMINDER_INTERVAL_DAYS * 24 * 60 * 60 * 1000;

  // If never reminded, show reminder after 3 days
  if (!lastReminder) {
    const firstUse = localStorage.getItem('symptomTracker_onboarding');
    if (firstUse) {
      const firstUseDate = new Date(JSON.parse(firstUse).completedAt || Date.now());
      if (now - firstUseDate.getTime() > 3 * 24 * 60 * 60 * 1000) {
        return true;
      }
    }
  }

  // Check if enough time has passed since last reminder
  if (lastReminder && now - parseInt(lastReminder) < reminderInterval) {
    return false;
  }

  // Check if user exported recently
  if (lastExport && now - parseInt(lastExport) < reminderInterval) {
    return false;
  }

  return true;
};

/**
 * Mark that user was reminded
 */
export const markReminderShown = () => {
  localStorage.setItem(REMINDER_KEY, Date.now().toString());
};

/**
 * Mark that user exported data
 */
export const markDataExported = () => {
  localStorage.setItem(EXPORT_DATE_KEY, Date.now().toString());
};

export default {
  shouldShowExportReminder,
  markReminderShown,
  markDataExported
};