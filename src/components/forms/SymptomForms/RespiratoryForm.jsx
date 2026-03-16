// src/components/forms/SymptomForms/RespiratoryForm.jsx
// Shared respiratory symptom detail form used by SymptomLogger and EditLogModal.
// Prop contract: { initialData, onChange }
//   initialData — existing data object (empty defaults or populated log data)
//   onChange    — callback: (fieldName, value) => void
//
// Note: rescueInhalerUsed uses null as a third state (not yet answered).

import React, { useState, useEffect } from 'react';

export const INITIAL_RESPIRATORY_DATA = {
  rescueInhalerUsed: null,  // true/false/null
  inhalerPuffs: '',
  peakFlow: '',
  spo2: '',
  activityTrigger: '',
  wheezing: false,
  chestTightness: false,
  coughing: false,
};

const RespiratoryForm = ({ initialData = {}, onChange }) => {
  const [data, setData] = useState({ ...INITIAL_RESPIRATORY_DATA, ...initialData });

  useEffect(() => {
    setData({ ...INITIAL_RESPIRATORY_DATA, ...initialData });
  }, [initialData]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleChange = (field, value) => {
    setData(prev => ({ ...prev, [field]: value }));
    onChange(field, value);
  };

  return (
      <div className="bg-sky-50 dark:bg-sky-900/30 p-4 rounded-lg border border-sky-200 dark:border-sky-800 space-y-4">
        <h3 className="font-medium text-sky-900 dark:text-sky-200">Respiratory Details</h3>
        <p className="text-xs text-sky-700 dark:text-sky-300">Track breathing symptoms for VA claims</p>

        {/* Rescue Inhaler — three-state (null/true/false) */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Did you use a rescue inhaler?
          </label>
          <div className="grid grid-cols-2 gap-2">
            <button type="button"
                    onClick={() => handleChange('rescueInhalerUsed', true)}
                    className={`p-2 rounded-lg border transition-colors ${
                        data.rescueInhalerUsed === true
                            ? 'bg-sky-100 dark:bg-sky-900/50 border-sky-400 dark:border-sky-600 text-sky-900 dark:text-sky-200'
                            : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300'
                    }`}>
              Yes
            </button>
            <button type="button"
                    onClick={() => {
                      handleChange('rescueInhalerUsed', false);
                      handleChange('inhalerPuffs', '');
                    }}
                    className={`p-2 rounded-lg border transition-colors ${
                        data.rescueInhalerUsed === false
                            ? 'bg-sky-100 dark:bg-sky-900/50 border-sky-400 dark:border-sky-600 text-sky-900 dark:text-sky-200'
                            : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300'
                    }`}>
              No
            </button>
          </div>
        </div>

        {/* Inhaler Puffs — only shown when inhaler was used */}
        {data.rescueInhalerUsed === true && (
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                How many puffs?
              </label>
              <input type="number" min="1" max="20"
                     value={data.inhalerPuffs}
                     onChange={e => handleChange('inhalerPuffs', e.target.value)}
                     placeholder="e.g., 2"
                     className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white" />
            </div>
        )}

        {/* Peak Flow & SpO2 */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Peak Flow (L/min)
            </label>
            <input type="number" min="0" max="800"
                   value={data.peakFlow}
                   onChange={e => handleChange('peakFlow', e.target.value)}
                   placeholder="Optional"
                   className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              SpO2 (%)
            </label>
            <input type="number" min="70" max="100"
                   value={data.spo2}
                   onChange={e => handleChange('spo2', e.target.value)}
                   placeholder="Optional"
                   className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white" />
          </div>
        </div>

        {/* Activity Trigger */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            What triggered symptoms?
          </label>
          <select value={data.activityTrigger}
                  onChange={e => handleChange('activityTrigger', e.target.value)}
                  className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white">
            <option value="">Select trigger...</option>
            <option value="rest">At rest</option>
            <option value="mild">Mild exertion (walking)</option>
            <option value="moderate">Moderate exertion (stairs, housework)</option>
            <option value="severe">Severe exertion (running, heavy lifting)</option>
          </select>
        </div>

        {/* Associated Symptoms */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Associated Symptoms
          </label>
          <div className="grid grid-cols-3 gap-2">
            {[
              { key: 'wheezing',       label: 'Wheezing' },
              { key: 'chestTightness', label: 'Chest Tightness' },
              { key: 'coughing',       label: 'Coughing' },
            ].map(({ key, label }) => (
                <label key={key} className={`flex items-center gap-2 p-2 rounded-lg border cursor-pointer ${
                    data[key]
                        ? 'bg-sky-100 dark:bg-sky-900/50 border-sky-300 dark:border-sky-700'
                        : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700'
                }`}>
                  <input type="checkbox" checked={data[key]}
                         onChange={e => handleChange(key, e.target.checked)}
                         className="w-4 h-4 text-sky-600 rounded" />
                  <span className="text-sm text-gray-700 dark:text-gray-300">{label}</span>
                </label>
            ))}
          </div>
        </div>
      </div>
  );
};

export default RespiratoryForm;