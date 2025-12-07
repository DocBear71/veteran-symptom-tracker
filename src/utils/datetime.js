// ============================================
// DATETIME UTILITIES
// ============================================
// Centralized datetime functions to ensure consistent local timezone handling
// across the entire app. All functions work with the user's local timezone.

/**
 * Format a date as local datetime string for datetime-local input
 * @param {Date} date - Date object (defaults to now)
 * @returns {string} - Format: YYYY-MM-DDTHH:mm in local timezone
 *
 * Example: formatLocalDateTime() → "2025-12-06T21:20"
 */
export const formatLocalDateTime = (date = new Date()) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  return `${year}-${month}-${day}T${hours}:${minutes}`;
};

/**
 * Format a date as local date string for date input
 * @param {Date} date - Date object (defaults to now)
 * @returns {string} - Format: YYYY-MM-DD in local timezone
 *
 * Example: formatLocalDate() → "2025-12-06"
 */
export const formatLocalDate = (date = new Date()) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

/**
 * Format a date as local time string for time input
 * @param {Date} date - Date object (defaults to now)
 * @returns {string} - Format: HH:mm in local timezone
 *
 * Example: formatLocalTime() → "21:20"
 */
export const formatLocalTime = (date = new Date()) => {
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  return `${hours}:${minutes}`;
};

/**
 * Format date for display (user-friendly)
 * @param {string|Date} date - ISO string or Date object
 * @returns {string} - Format: "Dec 6, 2025"
 *
 * Example: formatDisplayDate("2025-12-06") → "Dec 6, 2025"
 */
export const formatDisplayDate = (date) => {
  const d = typeof date === 'string' ? new Date(date) : date;
  return d.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });
};

/**
 * Format time for display (user-friendly)
 * @param {string|Date} date - ISO string or Date object
 * @param {boolean} includeSeconds - Include seconds in output
 * @returns {string} - Format: "9:20 PM" or "9:20:15 PM"
 *
 * Example: formatDisplayTime("2025-12-06T21:20:00") → "9:20 PM"
 */
export const formatDisplayTime = (date, includeSeconds = false) => {
  const d = typeof date === 'string' ? new Date(date) : date;
  return d.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    second: includeSeconds ? '2-digit' : undefined,
    hour12: true
  });
};

/**
 * Format datetime for display (user-friendly)
 * @param {string|Date} date - ISO string or Date object
 * @returns {string} - Format: "Dec 6, 2025 at 9:20 PM"
 *
 * Example: formatDisplayDateTime("2025-12-06T21:20:00") → "Dec 6, 2025 at 9:20 PM"
 */
export const formatDisplayDateTime = (date) => {
  const d = typeof date === 'string' ? new Date(date) : date;
  return `${formatDisplayDate(d)} at ${formatDisplayTime(d)}`;
};

/**
 * Get relative time string (e.g., "2 hours ago", "just now")
 * @param {string|Date} date - ISO string or Date object
 * @returns {string} - Relative time string
 *
 * Example: getRelativeTime(twoHoursAgo) → "2 hours ago"
 */
export const getRelativeTime = (date) => {
  const d = typeof date === 'string' ? new Date(date) : date;
  const now = new Date();
  const diffMs = now - d;
  const diffSecs = Math.floor(diffMs / 1000);
  const diffMins = Math.floor(diffSecs / 60);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);
  const diffWeeks = Math.floor(diffDays / 7);
  const diffMonths = Math.floor(diffDays / 30);
  const diffYears = Math.floor(diffDays / 365);

  if (diffSecs < 60) return 'just now';
  if (diffMins < 60) return `${diffMins} ${diffMins === 1 ? 'minute' : 'minutes'} ago`;
  if (diffHours < 24) return `${diffHours} ${diffHours === 1 ? 'hour' : 'hours'} ago`;
  if (diffDays < 7) return `${diffDays} ${diffDays === 1 ? 'day' : 'days'} ago`;
  if (diffWeeks < 4) return `${diffWeeks} ${diffWeeks === 1 ? 'week' : 'weeks'} ago`;
  if (diffMonths < 12) return `${diffMonths} ${diffMonths === 1 ? 'month' : 'months'} ago`;
  return `${diffYears} ${diffYears === 1 ? 'year' : 'years'} ago`;
};

/**
 * Get start of day in local timezone
 * @param {Date} date - Date object (defaults to today)
 * @returns {Date} - Date set to 00:00:00.000 local time
 *
 * Example: getStartOfDay() → Today at 12:00:00 AM
 */
export const getStartOfDay = (date = new Date()) => {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  return d;
};

/**
 * Get end of day in local timezone
 * @param {Date} date - Date object (defaults to today)
 * @returns {Date} - Date set to 23:59:59.999 local time
 *
 * Example: getEndOfDay() → Today at 11:59:59 PM
 */
export const getEndOfDay = (date = new Date()) => {
  const d = new Date(date);
  d.setHours(23, 59, 59, 999);
  return d;
};

/**
 * Get date X days ago from now
 * @param {number} days - Number of days ago
 * @returns {Date} - Date object X days in the past
 *
 * Example: getDaysAgo(7) → Date one week ago
 */
export const getDaysAgo = (days) => {
  const date = new Date();
  date.setDate(date.getDate() - days);
  return date;
};

/**
 * Get date X days from now
 * @param {number} days - Number of days in future
 * @returns {Date} - Date object X days in the future
 *
 * Example: getDaysFromNow(7) → Date one week from now
 */
export const getDaysFromNow = (days) => {
  const date = new Date();
  date.setDate(date.getDate() + days);
  return date;
};

/**
 * Check if two dates are on the same day (ignoring time)
 * @param {string|Date} date1 - First date
 * @param {string|Date} date2 - Second date
 * @returns {boolean} - True if same calendar day
 *
 * Example: isSameDay(new Date(), new Date()) → true
 */
export const isSameDay = (date1, date2) => {
  const d1 = typeof date1 === 'string' ? new Date(date1) : date1;
  const d2 = typeof date2 === 'string' ? new Date(date2) : date2;

  return d1.getFullYear() === d2.getFullYear() &&
      d1.getMonth() === d2.getMonth() &&
      d1.getDate() === d2.getDate();
};

/**
 * Check if date is today
 * @param {string|Date} date - Date to check
 * @returns {boolean} - True if today
 *
 * Example: isToday(new Date()) → true
 */
export const isToday = (date) => {
  return isSameDay(date, new Date());
};

/**
 * Check if date is yesterday
 * @param {string|Date} date - Date to check
 * @returns {boolean} - True if yesterday
 *
 * Example: isYesterday(getDaysAgo(1)) → true
 */
export const isYesterday = (date) => {
  return isSameDay(date, getDaysAgo(1));
};

/**
 * Get a user-friendly date label (Today, Yesterday, or formatted date)
 * @param {string|Date} date - Date to format
 * @returns {string} - "Today", "Yesterday", or "Dec 6, 2025"
 *
 * Example: getDateLabel(new Date()) → "Today"
 */
export const getDateLabel = (date) => {
  if (isToday(date)) return 'Today';
  if (isYesterday(date)) return 'Yesterday';
  return formatDisplayDate(date);
};

/**
 * Parse datetime-local input value to Date object
 * @param {string} localDateTimeString - Value from datetime-local input (YYYY-MM-DDTHH:mm)
 * @returns {Date} - Date object in local timezone
 *
 * Example: parseDateTimeLocal("2025-12-06T21:20") → Date object for Dec 6 at 9:20 PM local
 */
export const parseDateTimeLocal = (localDateTimeString) => {
  // datetime-local gives us YYYY-MM-DDTHH:mm in local time
  // We need to parse it as local time, not UTC
  const [datePart, timePart] = localDateTimeString.split('T');
  const [year, month, day] = datePart.split('-').map(Number);
  const [hours, minutes] = timePart.split(':').map(Number);

  return new Date(year, month - 1, day, hours, minutes);
};

/**
 * Get day of week name
 * @param {string|Date} date - Date to check
 * @returns {string} - Day name (e.g., "Saturday")
 *
 * Example: getDayOfWeek(new Date()) → "Saturday"
 */
export const getDayOfWeek = (date) => {
  const d = typeof date === 'string' ? new Date(date) : date;
  return d.toLocaleDateString('en-US', { weekday: 'long' });
};

/**
 * Get short day of week name
 * @param {string|Date} date - Date to check
 * @returns {string} - Short day name (e.g., "Sat")
 *
 * Example: getShortDayOfWeek(new Date()) → "Sat"
 */
export const getShortDayOfWeek = (date) => {
  const d = typeof date === 'string' ? new Date(date) : date;
  return d.toLocaleDateString('en-US', { weekday: 'short' });
};

/**
 * Calculate age from birthdate
 * @param {string|Date} birthDate - Birth date
 * @returns {number} - Age in years
 *
 * Example: calculateAge("1990-01-01") → 35
 */
export const calculateAge = (birthDate) => {
  const birth = typeof birthDate === 'string' ? new Date(birthDate) : birthDate;
  const today = new Date();
  let age = today.getFullYear() - birth.getFullYear();
  const monthDiff = today.getMonth() - birth.getMonth();

  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
    age--;
  }

  return age;
};

/**
 * Format duration in milliseconds to readable string
 * @param {number} milliseconds - Duration in ms
 * @returns {string} - Formatted duration
 *
 * Example: formatDuration(3661000) → "1h 1m 1s"
 */
export const formatDuration = (milliseconds) => {
  const seconds = Math.floor(milliseconds / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (days > 0) return `${days}d ${hours % 24}h`;
  if (hours > 0) return `${hours}h ${minutes % 60}m`;
  if (minutes > 0) return `${minutes}m ${seconds % 60}s`;
  return `${seconds}s`;
};

/**
 * Get date range for the last N days
 * @param {number} days - Number of days (default 30)
 * @returns {Object} - { startDate: Date, endDate: Date }
 *
 * Example: getDateRange(7) → { startDate: 7 days ago at 00:00, endDate: today at 23:59 }
 */
export const getDateRange = (days = 30) => {
  return {
    startDate: getStartOfDay(getDaysAgo(days)),
    endDate: getEndOfDay(),
  };
};

/**
 * Group items by date
 * @param {Array} items - Array of items with timestamp property
 * @param {string} timestampKey - Key name for timestamp (default 'timestamp')
 * @returns {Object} - Object grouped by date string (YYYY-MM-DD)
 *
 * Example: groupByDate([{timestamp: '2025-12-06T21:20'}]) → { '2025-12-06': [...] }
 */
export const groupByDate = (items, timestampKey = 'timestamp') => {
  return items.reduce((groups, item) => {
    const date = formatLocalDate(new Date(item[timestampKey]));
    if (!groups[date]) {
      groups[date] = [];
    }
    groups[date].push(item);
    return groups;
  }, {});
};