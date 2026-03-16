// src/components/forms/SymptomForms/PTSDForm.jsx
// Shared PTSD episode detail form used by SymptomLogger and EditLogModal.
// Prop contract: { initialData, onChange }
//   initialData — existing data object (empty defaults or populated log data)
//   onChange    — callback: (fieldName, value) => void

import React, { useState, useEffect } from 'react';

// Default shape — exported so parents can use it for useState init and reset
export const INITIAL_PTSD_DATA = {
  flashbacks: false,
  avoidance: false,
  emotionalNumbering: false,
  hypervigilance: false,
  exaggeratedStartle: false,
  intrusiveThoughts: false,
  triggerDescription: '',
};

const PTSDForm = ({ initialData = {}, onChange }) => {
  // Merge incoming initialData over defaults
  const [data, setData] = useState({ ...INITIAL_PTSD_DATA, ...initialData });

  // Re-sync when EditLogModal loads a different log entry
  useEffect(() => {
    setData({ ...INITIAL_PTSD_DATA, ...initialData });
  }, [initialData]);

  // Central update: keep local state in sync AND notify parent
  const handleChange = (fieldName, value) => {
    setData(prev => ({ ...prev, [fieldName]: value }));
    onChange(fieldName, value);
  };

  return (
      <div className="bg-amber-50 dark:bg-amber-900/30 p-4 rounded-lg border border-amber-200 dark:border-amber-800 space-y-4">
        <h3 className="font-medium text-amber-900 dark:text-amber-200">Mental Health Details</h3>
        <p className="text-xs text-amber-700 dark:text-amber-300">
          These align with PTSD rating criteria
        </p>

        {/* Associated Experiences */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Associated Experiences
          </label>
          <div className="grid grid-cols-1 gap-2">
            {[
              { key: 'flashbacks',          label: 'Flashbacks' },
              { key: 'intrusiveThoughts',   label: 'Intrusive thoughts' },
              { key: 'avoidance',           label: 'Avoidance of triggers/situations' },
              { key: 'emotionalNumbering',  label: 'Emotional numbness' },
              { key: 'hypervigilance',      label: 'Hypervigilance' },
              { key: 'exaggeratedStartle',  label: 'Exaggerated startle response' },
            ].map(({ key, label }) => (
                <label
                    key={key}
                    className={`flex items-center gap-2 p-2 rounded-lg border cursor-pointer ${
                        data[key]
                            ? 'bg-amber-100 dark:bg-amber-900/50 border-amber-300 dark:border-amber-700'
                            : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700'
                    }`}
                >
                  <input
                      type="checkbox"
                      checked={data[key]}
                      onChange={(e) => handleChange(key, e.target.checked)}
                      className="w-4 h-4 text-amber-600 rounded"
                  />
                  <span className="text-sm text-gray-700 dark:text-gray-300">{label}</span>
                </label>
            ))}
          </div>
        </div>

        {/* Trigger */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Trigger (if known)
          </label>
          <input
              type="text"
              value={data.triggerDescription}
              onChange={(e) => handleChange('triggerDescription', e.target.value)}
              placeholder="What triggered this episode?"
              className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
          />
        </div>
      </div>
  );
};

export default PTSDForm;