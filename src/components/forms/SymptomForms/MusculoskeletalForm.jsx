// src/components/forms/SymptomForms/MusculoskeletalForm.jsx
// Two named exports covering Phase 1D / Phase 4C musculoskeletal forms:
//   JointForm  — joint & ROM details for arthritis, bursitis, tendinitis, etc.
//   SpineForm  — spine-specific details for DC 5235/5236/5238/5240/5241
//
// Props (both forms):
//   initialData      — data object from parent useState
//   onChange         — (fieldName, value) => void — parent owns state
//
// SpineForm also accepts:
//   selectedSymptom  — string — needed for sub-condition sections
//                      (vfx-, sf-, ss-, as- prefix detection)

import React, { useState, useEffect } from 'react';

// ─── Initial data constants ───────────────────────────────────────────────────

export const INITIAL_JOINT_DATA = {
  joint: '',              // shoulder | elbow | wrist | hand | finger | hip | knee | ankle | foot | toe | other
  side: '',               // left | right | bilateral
  romEstimate: '',        // full | slightly | moderately | severely
  morningStiffness: '',   // none | minutes | 30-60min | hours
  swelling: false,
  instability: false,
  locking: false,
  grinding: false,
};

export const INITIAL_SPINE_DATA = {
  spineLocation: '',          // cervical | thoracic | lumbar | sacral | multiple
  fractureType: '',           // compression | burst | fracture-dislocation | other (DC 5235)
  fusionLevels: '',           // single-level | two-level | multi-level (DC 5241)
  neurogenicClaudication: false,  // DC 5238 spinal stenosis
  morningStiffnessDuration: '',   // DC 5240 ankylosing spondylitis
};

// ─── JointForm ────────────────────────────────────────────────────────────────

export const JointForm = ({ initialData, onChange }) => {
  const [formData, setFormData] = useState(
      initialData ?? { ...INITIAL_JOINT_DATA }
  );

  useEffect(() => {
    setFormData(initialData ?? { ...INITIAL_JOINT_DATA });
  }, [initialData]);

  const handleChange = (fieldName, value) => {
    setFormData(prev => ({ ...prev, [fieldName]: value }));
    onChange(fieldName, value);
  };

  // Active pill class for checkbox toggles
  const pillClass = (active) =>
      `flex items-center gap-2 p-2 rounded-lg border cursor-pointer ${
          active
              ? 'bg-indigo-100 dark:bg-indigo-900/50 border-indigo-300 dark:border-indigo-700'
              : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700'
      }`;

  return (
      <div className="bg-indigo-50 dark:bg-indigo-900/30 p-4 rounded-lg border border-indigo-200 dark:border-indigo-800 space-y-4">
        <h3 className="font-medium text-indigo-900 dark:text-indigo-200">Joint &amp; ROM Details</h3>
        <p className="text-xs text-indigo-700 dark:text-indigo-300">Document joint limitations for VA claims</p>

        {/* Joint and Side */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Which Joint?
            </label>
            <select
                value={formData.joint}
                onChange={(e) => handleChange('joint', e.target.value)}
                className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
            >
              <option value="">Select joint...</option>
              <option value="shoulder">Shoulder</option>
              <option value="elbow">Elbow</option>
              <option value="wrist">Wrist</option>
              <option value="hand">Hand</option>
              <option value="finger">Finger</option>
              <option value="hip">Hip</option>
              <option value="knee">Knee</option>
              <option value="ankle">Ankle</option>
              <option value="foot">Foot</option>
              <option value="toe">Toe</option>
              <option value="other">Other</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Side
            </label>
            <select
                value={formData.side}
                onChange={(e) => handleChange('side', e.target.value)}
                className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
            >
              <option value="">Select side...</option>
              <option value="left">Left</option>
              <option value="right">Right</option>
              <option value="bilateral">Both (Bilateral)</option>
            </select>
          </div>
        </div>

        {/* Range of Motion */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Range of Motion
          </label>
          <select
              value={formData.romEstimate}
              onChange={(e) => handleChange('romEstimate', e.target.value)}
              className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
          >
            <option value="">Select ROM...</option>
            <option value="full">Full range of motion</option>
            <option value="slightly">Slightly limited</option>
            <option value="moderately">Moderately limited</option>
            <option value="severely">Severely limited</option>
          </select>
        </div>

        {/* Morning Stiffness */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Morning Stiffness
          </label>
          <select
              value={formData.morningStiffness}
              onChange={(e) => handleChange('morningStiffness', e.target.value)}
              className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
          >
            <option value="">Select duration...</option>
            <option value="none">None</option>
            <option value="minutes">Less than 30 minutes</option>
            <option value="30-60min">30-60 minutes</option>
            <option value="hours">More than 1 hour</option>
          </select>
        </div>

        {/* Associated Symptoms */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Associated Symptoms
          </label>
          <div className="grid grid-cols-2 gap-2">
            {[
              { field: 'swelling',    label: 'Swelling' },
              { field: 'instability', label: 'Instability' },
              { field: 'locking',     label: 'Locking/Catching' },
              { field: 'grinding',    label: 'Grinding/Crepitus' },
            ].map(({ field, label }) => (
                <label key={field} className={pillClass(formData[field])}>
                  <input
                      type="checkbox"
                      checked={formData[field]}
                      onChange={(e) => handleChange(field, e.target.checked)}
                      className="w-4 h-4 text-indigo-600 rounded"
                  />
                  <span className="text-sm text-gray-700 dark:text-gray-300">{label}</span>
                </label>
            ))}
          </div>
        </div>
      </div>
  );
};

// ─── SpineForm ────────────────────────────────────────────────────────────────

export const SpineForm = ({ initialData, onChange, selectedSymptom }) => {
  const [formData, setFormData] = useState(
      initialData ?? { ...INITIAL_SPINE_DATA }
  );

  useEffect(() => {
    setFormData(initialData ?? { ...INITIAL_SPINE_DATA });
  }, [initialData]);

  const handleChange = (fieldName, value) => {
    setFormData(prev => ({ ...prev, [fieldName]: value }));
    onChange(fieldName, value);
  };

  return (
      <div className="space-y-4 p-4 bg-amber-50 dark:bg-amber-900/20 rounded-lg border border-amber-200 dark:border-amber-700">
        <h4 className="font-medium text-amber-800 dark:text-amber-200 flex items-center gap-2">
          <span>🦴</span> Spine Condition Details
        </h4>

        {/* Spine Location */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Spine Region Affected
          </label>
          <select
              value={formData.spineLocation}
              onChange={(e) => handleChange('spineLocation', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
          >
            <option value="">Select region...</option>
            <option value="cervical">Cervical (Neck)</option>
            <option value="thoracic">Thoracic (Mid-Back)</option>
            <option value="lumbar">Lumbar (Low Back)</option>
            <option value="sacral">Sacral/SI Joint</option>
            <option value="multiple">Multiple Regions</option>
          </select>
        </div>

        {/* Vertebral Fracture (DC 5235) — vfx- prefix */}
        {selectedSymptom?.startsWith('vfx-') && (
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Fracture Type (if known)
              </label>
              <select
                  value={formData.fractureType}
                  onChange={(e) => handleChange('fractureType', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              >
                <option value="">Select type...</option>
                <option value="compression">Compression Fracture</option>
                <option value="burst">Burst Fracture</option>
                <option value="fracture-dislocation">Fracture-Dislocation</option>
                <option value="other">Other/Unknown</option>
              </select>
            </div>
        )}

        {/* Spinal Fusion (DC 5241) — sf- prefix */}
        {selectedSymptom?.startsWith('sf-') && (
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Fusion Extent
              </label>
              <select
                  value={formData.fusionLevels}
                  onChange={(e) => handleChange('fusionLevels', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              >
                <option value="">Select fusion extent...</option>
                <option value="single-level">Single Level</option>
                <option value="two-level">Two Levels</option>
                <option value="multi-level">Three+ Levels (Multi-Level)</option>
              </select>
            </div>
        )}

        {/* Spinal Stenosis (DC 5238) — ss- prefix */}
        {selectedSymptom?.startsWith('ss-') && (
            <div className="flex items-center gap-2">
              <input
                  type="checkbox"
                  id="neurogenicClaudication"
                  checked={formData.neurogenicClaudication}
                  onChange={(e) => handleChange('neurogenicClaudication', e.target.checked)}
                  className="w-4 h-4 text-amber-600 rounded focus:ring-amber-500"
              />
              <label htmlFor="neurogenicClaudication" className="text-sm text-gray-700 dark:text-gray-300">
                Neurogenic claudication present (leg pain relieved by sitting/bending forward)
              </label>
            </div>
        )}

        {/* Ankylosing Spondylitis (DC 5240) — as- prefix */}
        {selectedSymptom?.startsWith('as-') && (
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Morning Stiffness Duration
              </label>
              <select
                  value={formData.morningStiffnessDuration}
                  onChange={(e) => handleChange('morningStiffnessDuration', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              >
                <option value="">Select duration...</option>
                <option value="less-than-30">Less than 30 minutes</option>
                <option value="30-60">30-60 minutes</option>
                <option value="1-2-hours">1-2 hours</option>
                <option value="more-than-2-hours">More than 2 hours</option>
                <option value="all-day">All day</option>
              </select>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                Morning stiffness &gt;30 minutes is characteristic of inflammatory back pain
              </p>
            </div>
        )}
      </div>
  );
};