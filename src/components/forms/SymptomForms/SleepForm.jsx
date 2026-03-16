// src/components/forms/SymptomForms/SleepForm.jsx
// Shared sleep detail form used by SymptomLogger and EditLogModal.
// Prop contract: { initialData, onChange }
//   initialData — existing data object (empty defaults or populated log data)
//   onChange    — callback: (fieldName, value) => void
//
// Note: feelRested uses null as a third state (not yet answered).

import React, { useState, useEffect } from 'react';

export const INITIAL_SLEEP_DATA = {
  hoursSlept: '',
  quality: 5,
  wakeUps: '',
  troubleFallingAsleep: false,
  troubleStayingAsleep: false,
  nightmares: false,
  feelRested: null,   // true/false/null
};

const SleepForm = ({ initialData = {}, onChange }) => {
  const [data, setData] = useState({ ...INITIAL_SLEEP_DATA, ...initialData });

  useEffect(() => {
    setData({ ...INITIAL_SLEEP_DATA, ...initialData });
  }, [initialData]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleChange = (field, value) => {
    setData(prev => ({ ...prev, [field]: value }));
    onChange(field, value);
  };

  return (
      <div className="bg-indigo-50 dark:bg-indigo-900/30 p-4 rounded-lg border border-indigo-200 dark:border-indigo-800 space-y-4">
        <h3 className="font-medium text-indigo-900 dark:text-indigo-200">Sleep Details</h3>
        <p className="text-xs text-indigo-700 dark:text-indigo-300">
          Track sleep patterns for VA claims documentation
        </p>

        {/* Hours Slept & Wake-Ups */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Hours Slept
            </label>
            <input type="number" min="0" max="24" step="0.5"
                   value={data.hoursSlept}
                   onChange={e => handleChange('hoursSlept', e.target.value)}
                   placeholder="Hours"
                   className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Times Woken Up
            </label>
            <input type="number" min="0" max="20"
                   value={data.wakeUps}
                   onChange={e => handleChange('wakeUps', e.target.value)}
                   placeholder="Times"
                   className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white" />
          </div>
        </div>

        {/* Sleep Quality Slider */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Sleep Quality: {data.quality}/10
          </label>
          <input type="range" min="0" max="10" value={data.quality}
                 onChange={e => handleChange('quality', Number(e.target.value))}
                 className="w-full" />
        </div>

        {/* Sleep Issues */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Sleep Issues
          </label>
          <div className="grid grid-cols-1 gap-2">
            {[
              { key: 'troubleFallingAsleep', label: 'Trouble falling asleep' },
              { key: 'troubleStayingAsleep', label: 'Trouble staying asleep' },
              { key: 'nightmares',           label: 'Nightmares/night terrors' },
            ].map(({ key, label }) => (
                <label key={key} className={`flex items-center gap-2 p-2 rounded-lg border cursor-pointer ${
                    data[key]
                        ? 'bg-indigo-100 dark:bg-indigo-900/50 border-indigo-300 dark:border-indigo-700'
                        : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700'
                }`}>
                  <input type="checkbox" checked={data[key]}
                         onChange={e => handleChange(key, e.target.checked)}
                         className="w-4 h-4 text-indigo-600 rounded" />
                  <span className="text-sm text-gray-700 dark:text-gray-300">{label}</span>
                </label>
            ))}
          </div>
        </div>

        {/* Feel Rested — three-state (null/true/false) */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Feel rested upon waking?
          </label>
          <div className="flex gap-3">
            <button type="button"
                    onClick={() => handleChange('feelRested', true)}
                    className={`flex-1 py-2 px-4 rounded-lg border-2 font-medium ${
                        data.feelRested === true
                            ? 'bg-green-100 dark:bg-green-900/50 border-green-500 text-green-700 dark:text-green-300'
                            : 'bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300'
                    }`}>
              Yes
            </button>
            <button type="button"
                    onClick={() => handleChange('feelRested', false)}
                    className={`flex-1 py-2 px-4 rounded-lg border-2 font-medium ${
                        data.feelRested === false
                            ? 'bg-red-100 dark:bg-red-900/50 border-red-500 text-red-700 dark:text-red-300'
                            : 'bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300'
                    }`}>
              No
            </button>
          </div>
        </div>
      </div>
  );
};

export default SleepForm;