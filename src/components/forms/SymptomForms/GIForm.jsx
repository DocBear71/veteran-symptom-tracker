// src/components/forms/SymptomForms/GIForm.jsx
// Shared GI symptom detail form used by SymptomLogger and EditLogModal.
// Prop contract: { initialData, onChange }
//   initialData — existing data object (empty defaults or populated log data)
//   onChange    — callback: (fieldName, value) => void
//
// Note: bristolScale and bloodPresent and mealRelated use null as a third state.
//   null = not answered, true/false = answered

import React, { useState, useEffect } from 'react';

export const INITIAL_GI_DATA = {
  bristolScale: null,         // 1-7, null = not selected
  frequencyPerDay: '',
  urgencyLevel: '',
  bloodPresent: null,         // true/false/null
  bloatingSeverity: '',
  abdominalPainLocation: '',
  mealRelated: null,          // true/false/null
  nighttimeSymptoms: false,
};

// Moved here from parent components — single source of truth
const BRISTOL_DESCRIPTIONS = {
  1: 'Separate hard lumps (severe constipation)',
  2: 'Lumpy, sausage-shaped (mild constipation)',
  3: 'Sausage with cracks (normal)',
  4: 'Smooth, soft sausage (ideal)',
  5: 'Soft blobs with clear edges (lacking fiber)',
  6: 'Mushy with ragged edges (mild diarrhea)',
  7: 'Watery, no solid pieces (severe diarrhea)',
};

const GIForm = ({ initialData = {}, onChange }) => {
  const [data, setData] = useState({ ...INITIAL_GI_DATA, ...initialData });

  useEffect(() => {
    setData({ ...INITIAL_GI_DATA, ...initialData });
  }, [initialData]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleChange = (field, value) => {
    setData(prev => ({ ...prev, [field]: value }));
    onChange(field, value);
  };

  return (
      <div className="bg-amber-50 dark:bg-amber-900/20 p-4 rounded-lg border border-amber-200 dark:border-amber-800 space-y-4">
        <h3 className="font-medium text-amber-900 dark:text-amber-200 flex items-center gap-2">
          <span>🩺</span> GI Symptom Details
        </h3>
        <p className="text-xs text-amber-700 dark:text-amber-300">
          Track details for VA rating documentation
        </p>

        {/* Bristol Stool Scale */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Bristol Stool Scale (if applicable)
          </label>
          <div className="grid grid-cols-7 gap-1 mb-2">
            {[1, 2, 3, 4, 5, 6, 7].map(num => (
                <button key={num} type="button"
                        onClick={() => handleChange('bristolScale', num)}
                        className={`py-2 px-1 rounded-lg border-2 font-bold text-sm transition-all ${
                            data.bristolScale === num
                                ? num <= 2
                                    ? 'bg-orange-200 dark:bg-orange-900 border-orange-500 text-orange-800 dark:text-orange-200'
                                    : num <= 4
                                        ? 'bg-green-200 dark:bg-green-900 border-green-500 text-green-800 dark:text-green-200'
                                        : 'bg-yellow-200 dark:bg-yellow-900 border-yellow-500 text-yellow-800 dark:text-yellow-200'
                                : 'bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300'
                        }`}>
                  {num}
                </button>
            ))}
          </div>
          {data.bristolScale && (
              <p className="text-xs text-gray-600 dark:text-gray-400 bg-white dark:bg-gray-800 p-2 rounded">
                Type {data.bristolScale}: {BRISTOL_DESCRIPTIONS[data.bristolScale]}
              </p>
          )}
          <button type="button"
                  onClick={() => handleChange('bristolScale', null)}
                  className="text-xs text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 mt-1">
            Clear selection
          </button>
        </div>

        {/* Frequency and Urgency */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Episodes Today
            </label>
            <input type="number" min="0" max="50"
                   value={data.frequencyPerDay}
                   onChange={e => handleChange('frequencyPerDay', e.target.value)}
                   placeholder="# times"
                   className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Urgency Level
            </label>
            <select value={data.urgencyLevel}
                    onChange={e => handleChange('urgencyLevel', e.target.value)}
                    className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm">
              <option value="">Select...</option>
              <option value="none">None</option>
              <option value="mild">Mild - Can wait</option>
              <option value="moderate">Moderate - Need to go soon</option>
              <option value="severe">Severe - Must go immediately</option>
              <option value="incontinence">Incontinence</option>
            </select>
          </div>
        </div>

        {/* Blood Present — three-state (null/true/false) */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Blood Present?
          </label>
          <div className="flex gap-3">
            <button type="button"
                    onClick={() => handleChange('bloodPresent', true)}
                    className={`flex-1 py-2 px-4 rounded-lg border-2 font-medium ${
                        data.bloodPresent === true
                            ? 'bg-red-100 dark:bg-red-900/50 border-red-500 text-red-700 dark:text-red-300'
                            : 'bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300'
                    }`}>
              Yes
            </button>
            <button type="button"
                    onClick={() => handleChange('bloodPresent', false)}
                    className={`flex-1 py-2 px-4 rounded-lg border-2 font-medium ${
                        data.bloodPresent === false
                            ? 'bg-green-100 dark:bg-green-900/50 border-green-500 text-green-700 dark:text-green-300'
                            : 'bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300'
                    }`}>
              No
            </button>
          </div>
        </div>

        {/* Bloating Severity */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Bloating Severity
          </label>
          <select value={data.bloatingSeverity}
                  onChange={e => handleChange('bloatingSeverity', e.target.value)}
                  className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white">
            <option value="">Select...</option>
            <option value="none">None</option>
            <option value="mild">Mild - Noticeable but not bothersome</option>
            <option value="moderate">Moderate - Uncomfortable</option>
            <option value="severe">Severe - Pants don't fit / visible distension</option>
          </select>
        </div>

        {/* Abdominal Pain Location — grid picker + diffuse */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Pain Location (if applicable)
          </label>
          <div className="grid grid-cols-3 gap-2">
            {[
              { id: 'upper-left',   label: 'Upper Left' },
              { id: 'upper-center', label: 'Upper Center' },
              { id: 'upper-right',  label: 'Upper Right' },
              { id: 'lower-left',   label: 'Lower Left' },
              { id: 'lower-center', label: 'Lower Center' },
              { id: 'lower-right',  label: 'Lower Right' },
            ].map(({ id, label }) => (
                <button key={id} type="button"
                        onClick={() => handleChange(
                            'abdominalPainLocation',
                            data.abdominalPainLocation === id ? '' : id
                        )}
                        className={`py-2 px-2 rounded-lg border text-xs font-medium transition-all ${
                            data.abdominalPainLocation === id
                                ? 'bg-amber-200 dark:bg-amber-900 border-amber-500 text-amber-800 dark:text-amber-200'
                                : 'bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300'
                        }`}>
                  {label}
                </button>
            ))}
          </div>
          <button type="button"
                  onClick={() => handleChange('abdominalPainLocation', 'diffuse')}
                  className={`w-full mt-2 py-2 px-4 rounded-lg border text-sm font-medium ${
                      data.abdominalPainLocation === 'diffuse'
                          ? 'bg-amber-200 dark:bg-amber-900 border-amber-500 text-amber-800 dark:text-amber-200'
                          : 'bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300'
                  }`}>
            Diffuse / All Over
          </button>
        </div>

        {/* Additional Toggles */}
        <div className="space-y-2">
          <label className={`flex items-center gap-2 p-2 rounded-lg border cursor-pointer ${
              data.mealRelated === true
                  ? 'bg-amber-100 dark:bg-amber-900/50 border-amber-300 dark:border-amber-700'
                  : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700'
          }`}>
            <input type="checkbox"
                   checked={data.mealRelated === true}
                   onChange={e => handleChange('mealRelated', e.target.checked ? true : null)}
                   className="w-4 h-4 text-amber-600 rounded" />
            <span className="text-sm text-gray-700 dark:text-gray-300">Worse after eating</span>
          </label>

          <label className={`flex items-center gap-2 p-2 rounded-lg border cursor-pointer ${
              data.nighttimeSymptoms
                  ? 'bg-amber-100 dark:bg-amber-900/50 border-amber-300 dark:border-amber-700'
                  : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700'
          }`}>
            <input type="checkbox"
                   checked={data.nighttimeSymptoms}
                   onChange={e => handleChange('nighttimeSymptoms', e.target.checked)}
                   className="w-4 h-4 text-amber-600 rounded" />
            <span className="text-sm text-gray-700 dark:text-gray-300">Woken up by symptoms (nighttime)</span>
          </label>
        </div>
      </div>
  );
};

export default GIForm;