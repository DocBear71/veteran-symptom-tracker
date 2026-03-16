// src/components/forms/SymptomForms/MigraineForm.jsx
// Shared migraine detail form used by SymptomLogger and EditLogModal.
// Prop contract: { initialData, onChange }
//   initialData — existing data object (empty defaults or populated log data)
//   onChange    — callback: (fieldName, value) => void
//
// IMPORTANT: prostrating uses null/true/false (three states).
//   null  = not yet answered (blocks save in SymptomLogger)
//   true  = yes, prostrating
//   false = no, not prostrating

import React, { useState, useEffect } from 'react';

// Default shape — exported so parents can use it for useState init and reset.
// prostrating starts as null (required field, must be explicitly answered).
export const INITIAL_MIGRAINE_DATA = {
  duration: '',
  prostrating: null,
  aura: false,
  nausea: false,
  lightSensitivity: false,
  soundSensitivity: false,
  triggers: '',
};

const MigraineForm = ({ initialData = {}, onChange }) => {
  // Merge incoming initialData over defaults
  const [data, setData] = useState({ ...INITIAL_MIGRAINE_DATA, ...initialData });

  // Re-sync when EditLogModal loads a different log entry
  useEffect(() => {
    setData({ ...INITIAL_MIGRAINE_DATA, ...initialData });
  }, [initialData]);

  // Central update: keep local state in sync AND notify parent
  const handleChange = (fieldName, value) => {
    setData(prev => ({ ...prev, [fieldName]: value }));
    onChange(fieldName, value);
  };

  return (
      <div className="bg-purple-50 dark:bg-purple-900/30 p-4 rounded-lg border border-purple-200 dark:border-purple-800 space-y-4">
        <h3 className="font-medium text-purple-900 dark:text-purple-200">Migraine Details</h3>
        <p className="text-xs text-purple-700 dark:text-purple-300">
          These details align with VA rating criteria
        </p>

        {/* Duration */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Duration
          </label>
          <select
              value={data.duration}
              onChange={(e) => handleChange('duration', e.target.value)}
              className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
          >
            <option value="">Select duration...</option>
            <option value="less-than-1h">Less than 1 hour</option>
            <option value="1-4h">1–4 hours</option>
            <option value="4-24h">4–24 hours</option>
            <option value="1-2d">1–2 days</option>
            <option value="more-than-2d">More than 2 days</option>
            <option value="ongoing">Still ongoing</option>
          </select>
        </div>

        {/* Prostrating — required, three-state (null/true/false) */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Was this migraine prostrating? <span className="text-red-500">*</span>
          </label>
          <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">
            Prostrating = unable to perform normal activities
          </p>
          <div className="flex gap-3">
            <button
                type="button"
                onClick={() => handleChange('prostrating', true)}
                className={`flex-1 py-2 px-4 rounded-lg border-2 font-medium ${
                    data.prostrating === true
                        ? 'bg-red-100 dark:bg-red-900/50 border-red-500 text-red-700 dark:text-red-300'
                        : 'bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300'
                }`}
            >
              Yes, prostrating
            </button>
            <button
                type="button"
                onClick={() => handleChange('prostrating', false)}
                className={`flex-1 py-2 px-4 rounded-lg border-2 font-medium ${
                    data.prostrating === false
                        ? 'bg-green-100 dark:bg-green-900/50 border-green-500 text-green-700 dark:text-green-300'
                        : 'bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300'
                }`}
            >
              No
            </button>
          </div>
        </div>

        {/* Associated Symptoms */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Associated Symptoms
          </label>
          <div className="grid grid-cols-2 gap-2">
            {[
              { key: 'aura',            label: 'Aura' },
              { key: 'nausea',          label: 'Nausea' },
              { key: 'lightSensitivity', label: 'Light sensitivity' },
              { key: 'soundSensitivity', label: 'Sound sensitivity' },
            ].map(({ key, label }) => (
                <label
                    key={key}
                    className={`flex items-center gap-2 p-2 rounded-lg border cursor-pointer ${
                        data[key]
                            ? 'bg-purple-100 dark:bg-purple-900/50 border-purple-300 dark:border-purple-700'
                            : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700'
                    }`}
                >
                  <input
                      type="checkbox"
                      checked={data[key]}
                      onChange={(e) => handleChange(key, e.target.checked)}
                      className="w-4 h-4 text-purple-600 rounded"
                  />
                  <span className="text-sm text-gray-700 dark:text-gray-300">{label}</span>
                </label>
            ))}
          </div>
        </div>

        {/* Known Triggers */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Known Triggers
          </label>
          <input
              type="text"
              value={data.triggers}
              onChange={(e) => handleChange('triggers', e.target.value)}
              placeholder="e.g., stress, bright lights"
              className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
          />
        </div>
      </div>
  );
};

export default MigraineForm;