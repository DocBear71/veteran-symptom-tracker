import { useState, useEffect } from 'react';
import { Clock, Calendar } from 'lucide-react';

/**
 * YYYY-MM-DD in the user's LOCAL time zone.
 * toISOString() gives the UTC date, which is already "tomorrow" after
 * 7 pm Central. Date inputs need the local calendar date.
 */
const toLocalDateString = (date) => {
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, '0');
    const d = String(date.getDate()).padStart(2, '0');
    return `${y}-${m}-${d}`;
};

/**
 * OccurrenceTimePicker Component
 *
 * Allows users to specify when a symptom actually occurred,
 * with presets for common scenarios (now, earlier today, yesterday, custom)
 *
 * Props:
 * - value: ISO string of occurrence time (optional)
 * - onChange: Function called with ISO string when time changes
 * - label: Label text (default: "When did this occur?")
 */
export default function OccurrenceTimePicker({ value, onChange, label = "When did this occur?" }) {
  const [mode, setMode] = useState('now'); // 'now', 'earlier-today', 'yesterday', 'custom'
  const [customDate, setCustomDate] = useState('');
  const [customTime, setCustomTime] = useState('');
  const [userInteracting, setUserInteracting] = useState(false); // Prevent useEffect override
  const [timeError, setTimeError] = useState('');

  // Initialize from value prop (but don't override during user interaction)
  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => {
    if (value && !userInteracting) {
      const occurrenceDate = new Date(value);
      const now = new Date();
      const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      const yesterdayStart = new Date(todayStart);
      yesterdayStart.setDate(yesterdayStart.getDate() - 1);

      // Determine which mode based on the value
      if (occurrenceDate >= new Date(now.getTime() - 60000)) {
        // Within last minute = "now"
        setMode('now');
      } else if (occurrenceDate >= todayStart) {
        // Today but earlier = "earlier-today"
        setMode('earlier-today');
        setCustomTime(occurrenceDate.toTimeString().slice(0, 5)); // HH:MM
      } else if (occurrenceDate >= yesterdayStart && occurrenceDate < todayStart) {
        // Yesterday
        setMode('yesterday');
        setCustomTime(occurrenceDate.toTimeString().slice(0, 5));
      } else {
        // Custom date
        setMode('custom');
        setCustomDate(toLocalDateString(occurrenceDate)); // YYYY-MM-DD, local
        setCustomTime(occurrenceDate.toTimeString().slice(0, 5));
      }
    }
  }, [value, userInteracting]);

  // Handle mode change
  const handleModeChange = (newMode) => {
    setUserInteracting(true); // Prevent useEffect from overriding
    setMode(newMode);
    setTimeError(''); // Clear any validation error from previous mode

    const now = new Date();

    switch (newMode) {
      case 'now':
        onChange(now.toISOString());
        setUserInteracting(false);
        break;

      case 'earlier-today': {
        // Default to 2 hours ago
        const twoHoursAgo = new Date(now.getTime() - (2 * 60 * 60 * 1000));
        setCustomTime(twoHoursAgo.toTimeString().slice(0, 5));
        onChange(twoHoursAgo.toISOString());
        setTimeout(() => setUserInteracting(false), 100);
        break;
      }

      case 'yesterday': {
        // Default to same time yesterday
        const yesterday = new Date(now);
        yesterday.setDate(yesterday.getDate() - 1);
        setCustomTime(now.toTimeString().slice(0, 5));
        onChange(yesterday.toISOString());
        setTimeout(() => setUserInteracting(false), 100);
        break;
      }

      case 'custom': {
        // Default to 3 days ago at noon (outside yesterday range)
        const customDefault = new Date(now);
        customDefault.setDate(customDefault.getDate() - 3);
        customDefault.setHours(12, 0, 0, 0);
        setCustomDate(toLocalDateString(customDefault));
        setCustomTime('12:00');
        onChange(customDefault.toISOString());
        // Keep userInteracting flag longer for custom to prevent mode switch
        setTimeout(() => setUserInteracting(false), 500);
        break;
      }
    }
  };

    // Handle time change for earlier-today, yesterday, or custom mode.
    // The typed value always shows in the box. The stored time only updates
    // once the value is a complete, valid, non-future time.
    const handleTimeChange = (newTime) => {
        setCustomTime(newTime);
        setTimeError(''); // Clear any previous error

        // The time input sends '' while an hour/minute segment is half-typed or
        // the field is cleared. Not an error; wait for a complete time. The last
        // good value stays stored until then.
        if (!newTime) return;

        const [hours, minutes] = newTime.split(':').map(Number);
        const now = new Date();
        let newDate = null;

        if (mode === 'earlier-today') {
            newDate = new Date(now.getFullYear(), now.getMonth(), now.getDate(), hours, minutes);
        } else if (mode === 'yesterday') {
            newDate = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 1, hours, minutes);
        } else if (mode === 'custom' && customDate) {
            const [year, month, day] = customDate.split('-').map(Number);
            newDate = new Date(year, month - 1, day, hours, minutes);
        } else {
            // Custom mode with no date picked yet: nothing to combine with
            return;
        }

        // A complete value that still doesn't make a real time. Show it.
        if (Number.isNaN(newDate.getTime())) {
            setTimeError('That time is not valid');
            return;
        }

        if (newDate > now) {
            // Still show what they typed, so they can fix AM/PM without retyping
            setTimeError(
                mode === 'earlier-today'
                    ? 'This time is later than now. Check your AM/PM setting.'
                    : 'Cannot log for a future time'
            );
            return; // Don't store a future time
        }

        onChange(newDate.toISOString());
    };

  // Handle custom date change
  const handleDateChange = (newDate) => {
    setCustomDate(newDate);
    setTimeError('');

    // The date input sends '' while a segment is half-typed or the field is
    // cleared. That isn't an error; wait for a complete date before updating
    // the stored time. The last good value stays in place until then.
    if (!newDate || !customTime) return;

    const [hours, minutes] = customTime.split(':').map(Number);
    const [year, month, day] = newDate.split('-').map(Number);
    const dateObj = new Date(year, month - 1, day, hours, minutes);

    // A complete but impossible date. Show it instead of silently skipping.
    if (Number.isNaN(dateObj.getTime())) {
      setTimeError('That date is not valid');
      return;
    }

    // Same rule as handleTimeChange: no future times
    if (dateObj > new Date()) {
      setTimeError('Cannot log for a future time');
      return;
    }

    onChange(dateObj.toISOString());
  };

  // Get max date (today)
  const maxDate = toLocalDateString(new Date());

  return (
      <div className="space-y-3">
        {/* Label */}
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2">
          <Clock className="w-4 h-4" />
          {label}
        </label>

        {/* Mode Selection */}
        <div className="grid grid-cols-2 gap-2">
          <button
              type="button"
              onClick={() => handleModeChange('now')}
              className={`px-3 py-2 text-sm font-medium rounded-lg border-2 transition-colors ${
                  mode === 'now'
                      ? 'bg-blue-100 border-blue-500 text-blue-700 dark:bg-blue-900/30 dark:border-blue-500 dark:text-blue-300'
                      : 'bg-white border-gray-300 text-gray-700 hover:border-gray-400 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-300 dark:hover:border-gray-500'
              }`}
          >
            Just now
          </button>

          <button
              type="button"
              onClick={() => handleModeChange('earlier-today')}
              className={`px-3 py-2 text-sm font-medium rounded-lg border-2 transition-colors ${
                  mode === 'earlier-today'
                      ? 'bg-blue-100 border-blue-500 text-blue-700 dark:bg-blue-900/30 dark:border-blue-500 dark:text-blue-300'
                      : 'bg-white border-gray-300 text-gray-700 hover:border-gray-400 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-300 dark:hover:border-gray-500'
              }`}
          >
            Earlier today
          </button>

          <button
              type="button"
              onClick={() => handleModeChange('yesterday')}
              className={`px-3 py-2 text-sm font-medium rounded-lg border-2 transition-colors ${
                  mode === 'yesterday'
                      ? 'bg-blue-100 border-blue-500 text-blue-700 dark:bg-blue-900/30 dark:border-blue-500 dark:text-blue-300'
                      : 'bg-white border-gray-300 text-gray-700 hover:border-gray-400 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-300 dark:hover:border-gray-500'
              }`}
          >
            Yesterday
          </button>

          <button
              type="button"
              onClick={() => handleModeChange('custom')}
              className={`px-3 py-2 text-sm font-medium rounded-lg border-2 transition-colors flex items-center justify-center gap-1 ${
                  mode === 'custom'
                      ? 'bg-blue-100 border-blue-500 text-blue-700 dark:bg-blue-900/30 dark:border-blue-500 dark:text-blue-300'
                      : 'bg-white border-gray-300 text-gray-700 hover:border-gray-400 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-300 dark:hover:border-gray-500'
              }`}
          >
            <Calendar className="w-4 h-4" />
            Custom
          </button>
        </div>

        {/* Time Picker for "Earlier today" or "Yesterday" */}
        {(mode === 'earlier-today' || mode === 'yesterday') && (
            <div className="mt-3">
              <label className="block text-xs text-gray-600 dark:text-gray-400 mb-1">
                What time?
              </label>
              <input
                  type="time"
                  value={customTime}
                  onChange={(e) => handleTimeChange(e.target.value)}
                  className={`w-full px-3 py-2 border rounded-lg
                     bg-white dark:bg-gray-700 text-gray-900 dark:text-white
                     focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      timeError
                          ? 'border-red-400 dark:border-red-500'
                          : 'border-gray-300 dark:border-gray-600'
                  }`}
              />
              {timeError && (
                  <p className="text-xs text-red-500 dark:text-red-400 mt-1">
                    ⚠️ {timeError}
                  </p>
              )}
            </div>
        )}

        {/* Custom Date & Time Picker */}
        {mode === 'custom' && (
            <div className="mt-3 space-y-2">
              <div>
                <label className="block text-xs text-gray-600 dark:text-gray-400 mb-1">
                  Date
                </label>
                <input
                    type="date"
                    value={customDate}
                    onChange={(e) => handleDateChange(e.target.value)}
                    max={maxDate}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg
                       bg-white dark:bg-gray-700 text-gray-900 dark:text-white
                       focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-xs text-gray-600 dark:text-gray-400 mb-1">
                  Time
                </label>
                <input
                    type="time"
                    value={customTime}
                    onChange={(e) => handleTimeChange(e.target.value)}
                    className={`w-full px-3 py-2 border rounded-lg
                       bg-white dark:bg-gray-700 text-gray-900 dark:text-white
                       focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                        timeError
                            ? 'border-red-400 dark:border-red-500'
                            : 'border-gray-300 dark:border-gray-600'
                    }`}
                />
                {timeError && (
                    <p className="text-xs text-red-500 dark:text-red-400 mt-1">
                      ⚠️ {timeError}
                    </p>
                )}
              </div>
            </div>
        )}

        {/* Info text for back-dated logs — only show for previous-day entries */}
        {(mode === 'yesterday' || mode === 'custom') && (
            <div className="mt-2 p-2 bg-amber-50 dark:bg-amber-900/20 rounded-lg border border-amber-200 dark:border-amber-800">
              <p className="text-xs text-amber-800 dark:text-amber-300">
                ℹ️ Entries logged for a previous day are marked as back-dated in your history and exports.
              </p>
            </div>
        )}
      </div>
  );
}