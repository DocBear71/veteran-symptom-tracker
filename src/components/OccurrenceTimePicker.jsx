import { useState, useEffect } from 'react';
import { Clock, Calendar } from 'lucide-react';

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

  // Initialize from value prop (but don't override during user interaction)
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
        setCustomDate(occurrenceDate.toISOString().split('T')[0]); // YYYY-MM-DD
        setCustomTime(occurrenceDate.toTimeString().slice(0, 5));
      }
    }
  }, [value, userInteracting]);

  // Handle mode change
  const handleModeChange = (newMode) => {
    setUserInteracting(true); // Prevent useEffect from overriding
    setMode(newMode);

    const now = new Date();

    switch (newMode) {
      case 'now':
        onChange(now.toISOString());
        setUserInteracting(false);
        break;

      case 'earlier-today':
        // Default to 2 hours ago
        const twoHoursAgo = new Date(now.getTime() - (2 * 60 * 60 * 1000));
        setCustomTime(twoHoursAgo.toTimeString().slice(0, 5));
        onChange(twoHoursAgo.toISOString());
        setTimeout(() => setUserInteracting(false), 100);
        break;

      case 'yesterday':
        // Default to same time yesterday
        const yesterday = new Date(now);
        yesterday.setDate(yesterday.getDate() - 1);
        setCustomTime(now.toTimeString().slice(0, 5));
        onChange(yesterday.toISOString());
        setTimeout(() => setUserInteracting(false), 100);
        break;

      case 'custom':
        // Default to 3 days ago at noon (outside yesterday range)
        const customDefault = new Date(now);
        customDefault.setDate(customDefault.getDate() - 3);
        customDefault.setHours(12, 0, 0, 0);
        setCustomDate(customDefault.toISOString().split('T')[0]);
        setCustomTime('12:00');
        onChange(customDefault.toISOString());
        // Keep userInteracting flag longer for custom to prevent mode switch
        setTimeout(() => setUserInteracting(false), 500);
        break;
    }
  };

  // Handle time change for earlier-today mode
  const handleTimeChange = (newTime) => {
    setCustomTime(newTime);

    const now = new Date();
    const [hours, minutes] = newTime.split(':');

    if (mode === 'earlier-today') {
      const newDate = new Date(now.getFullYear(), now.getMonth(), now.getDate(), hours, minutes);
      onChange(newDate.toISOString());
    } else if (mode === 'yesterday') {
      const yesterday = new Date(now);
      yesterday.setDate(yesterday.getDate() - 1);
      yesterday.setHours(hours, minutes);
      onChange(yesterday.toISOString());
    } else if (mode === 'custom' && customDate) {
      const [year, month, day] = customDate.split('-');
      const newDate = new Date(year, month - 1, day, hours, minutes);
      onChange(newDate.toISOString());
    }
  };

  // Handle custom date change
  const handleDateChange = (newDate) => {
    setCustomDate(newDate);

    if (customTime) {
      const [hours, minutes] = customTime.split(':');
      const [year, month, day] = newDate.split('-');
      const dateObj = new Date(year, month - 1, day, hours, minutes);
      onChange(dateObj.toISOString());
    }
  };

  // Get max date (today)
  const maxDate = new Date().toISOString().split('T')[0];

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
                  max={mode === 'earlier-today' ? new Date().toTimeString().slice(0, 5) : undefined}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg
                     bg-white dark:bg-gray-700 text-gray-900 dark:text-white
                     focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
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
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg
                       bg-white dark:bg-gray-700 text-gray-900 dark:text-white
                       focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
        )}

        {/* Info text for back-dated logs */}
        {mode !== 'now' && (
            <div className="mt-2 p-2 bg-amber-50 dark:bg-amber-900/20 rounded-lg border border-amber-200 dark:border-amber-800">
              <p className="text-xs text-amber-800 dark:text-amber-300">
                ℹ️ This log will be marked as back-dated and shown with an indicator in your history.
              </p>
            </div>
        )}
      </div>
  );
}