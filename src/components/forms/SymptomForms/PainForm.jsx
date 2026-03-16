// src/components/forms/SymptomForms/PainForm.jsx
// Extracted generic pain form — covers musculoskeletal pain, radiculopathy,
// joint pain, and any symptom ID that triggers isPainSelected / isPainRelated
// in the parent files.
//
// Props:
//   initialData — the painData object from parent useState
//   onChange    — (fieldName, value) => void — parent owns state
//
// NOTE: affectedActivities is an array. The parent's onChange receives the
// full updated array as the value (not a single item), so the parent only
// needs:  (field, value) => setPainData(prev => ({ ...prev, [field]: value }))

import React, { useState, useEffect } from 'react';

// ─── Initial data constant ────────────────────────────────────────────────────
export const INITIAL_PAIN_DATA = {
  painLocation: '',
  radiating: false,
  radiatingTo: '',
  limitedRangeOfMotion: false,
  affectedActivities: [],  // array of activity strings
  painType: '',
  flareUp: false,
};

// ─── Activity list (static — no reason to re-create on every render) ─────────
const ACTIVITIES = ['Walking', 'Standing', 'Sitting', 'Sleeping', 'Lifting', 'Bending', 'Driving', 'Working'];

// ─── Component ────────────────────────────────────────────────────────────────
const PainForm = ({ initialData, onChange }) => {
  const [formData, setFormData] = useState(
      initialData ?? { ...INITIAL_PAIN_DATA }
  );

  // Sync inward: re-init when parent resets (key change or new symptom)
  useEffect(() => {
    setFormData(initialData ?? { ...INITIAL_PAIN_DATA });
  }, [initialData]);

  // Scalar field update — keeps internal state in sync AND notifies parent
  const handleChange = (fieldName, value) => {
    setFormData(prev => ({ ...prev, [fieldName]: value }));
    onChange(fieldName, value);
  };

  // Array toggle for affectedActivities — parent receives full updated array
  const toggleActivity = (activity) => {
    const updated = formData.affectedActivities.includes(activity)
        ? formData.affectedActivities.filter(a => a !== activity)
        : [...formData.affectedActivities, activity];
    setFormData(prev => ({ ...prev, affectedActivities: updated }));
    onChange('affectedActivities', updated);
  };



  // Shared active-pill class for checkbox cards
  const pillClass = (active) =>
      `flex items-center gap-2 p-2 rounded-lg border cursor-pointer ${
          active
              ? 'bg-rose-100 dark:bg-rose-900/50 border-rose-300 dark:border-rose-700'
              : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700'
      }`;

  return (
      <div className="bg-rose-50 dark:bg-rose-900/30 p-4 rounded-lg border border-rose-200 dark:border-rose-800 space-y-4">
        <h3 className="font-medium text-rose-900 dark:text-rose-200">Pain Details</h3>
        <p className="text-xs text-rose-700 dark:text-rose-300">
          Document impact on daily activities for VA claims
        </p>

        {/* Pain type */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Pain Type
          </label>
          <select
              value={formData.painType}
              onChange={(e) => handleChange('painType', e.target.value)}
              className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
          >
            <option value="">Select type...</option>
            <option value="sharp">Sharp/Stabbing</option>
            <option value="dull">Dull/Aching</option>
            <option value="burning">Burning</option>
            <option value="throbbing">Throbbing</option>
            <option value="shooting">Shooting</option>
            <option value="stiff">Stiffness</option>
          </select>
        </div>

        {/* Radiating / Limited ROM toggles */}
        <div className="grid grid-cols-2 gap-2">
          <label className={pillClass(formData.radiating)}>
            <input
                type="checkbox"
                checked={formData.radiating}
                onChange={(e) => handleChange('radiating', e.target.checked)}
                className="w-4 h-4 text-rose-600 rounded"
            />
            <span className="text-sm text-gray-700 dark:text-gray-300">Radiating pain</span>
          </label>
          <label className={pillClass(formData.limitedRangeOfMotion)}>
            <input
                type="checkbox"
                checked={formData.limitedRangeOfMotion}
                onChange={(e) => handleChange('limitedRangeOfMotion', e.target.checked)}
                className="w-4 h-4 text-rose-600 rounded"
            />
            <span className="text-sm text-gray-700 dark:text-gray-300">Limited ROM</span>
          </label>
        </div>

        {/* Radiates-to text field — only shown when radiating is true */}
        {formData.radiating && (
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Radiates to
              </label>
              <input
                  type="text"
                  value={formData.radiatingTo}
                  onChange={(e) => handleChange('radiatingTo', e.target.value)}
                  placeholder="e.g., down left leg, into shoulder"
                  className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
              />
            </div>
        )}

        {/* Affected activities grid */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Activities Affected
          </label>
          <div className="grid grid-cols-2 gap-2">
            {ACTIVITIES.map(activity => (
                <label key={activity} className={pillClass(formData.affectedActivities.includes(activity))}>
                  <input
                      type="checkbox"
                      checked={formData.affectedActivities.includes(activity)}
                      onChange={() => toggleActivity(activity)}
                      className="w-4 h-4 text-rose-600 rounded"
                  />
                  <span className="text-sm text-gray-700 dark:text-gray-300">{activity}</span>
                </label>
            ))}
          </div>
        </div>
      </div>
  );
};

export default PainForm;