// src/components/forms/SymptomForms/AnxietyForm.jsx
// Shared anxiety episode detail form used by SymptomLogger and EditLogModal.
// Prop contract: { initialData, onChange }
//   initialData — object with anxiety field values (empty defaults from INITIAL_ANXIETY_DATA)
//   onChange    — callback: (fieldName, value) => void

import React, { useState, useEffect } from 'react';

// Default shape — exported so parents can use it for useState initialization and reset
export const INITIAL_ANXIETY_DATA = {
  // Physical Symptoms
  heartRacing: false,
  sweating: false,
  trembling: false,
  shortnessOfBreath: false,
  chestTightness: false,
  nausea: false,
  dizziness: false,
  hotFlashes: false,
  numbnessTingling: false,
  // Cognitive Symptoms
  racingThoughts: false,
  fearOfLosingControl: false,
  fearOfDying: false,
  feelingDetached: false,
  difficultyConcentrating: false,
  // Avoidance Behaviors
  avoidedSocial: false,
  leftEarly: false,
  calledOut: false,
  cancelledPlans: false,
  neededSafetyPerson: false,
  // Context
  trigger: '',
  episodeDuration: '',
  wasPanicAttack: false,
};

const AnxietyForm = ({ initialData = {}, onChange }) => {
  // Merge incoming initialData over defaults so partially-populated objects work correctly
  const [data, setData] = useState({ ...INITIAL_ANXIETY_DATA, ...initialData });

  // When the parent swaps initialData (e.g. EditLogModal loads a different log),
  // re-sync local state. Guards against stale data when modal re-opens.
  useEffect(() => {
    setData({ ...INITIAL_ANXIETY_DATA, ...initialData });
  }, [initialData]);

  // Central update: keep local state in sync AND notify parent via onChange
  const handleChange = (fieldName, value) => {
    setData(prev => ({ ...prev, [fieldName]: value }));
    onChange(fieldName, value);
  };

  // Reusable checkbox row — used for all three symptom groups
  const CheckboxRow = ({ fieldKey, label }) => (
      <label
          className={`flex items-center gap-2 p-2 rounded-lg border cursor-pointer ${
              data[fieldKey]
                  ? 'bg-blue-100 dark:bg-blue-900/50 border-blue-300 dark:border-blue-700'
                  : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700'
          }`}
      >
        <input
            type="checkbox"
            checked={data[fieldKey]}
            onChange={(e) => handleChange(fieldKey, e.target.checked)}
            className="w-4 h-4 text-blue-600 rounded"
        />
        <span className="text-sm text-gray-700 dark:text-gray-300">{label}</span>
      </label>
  );

  return (
      <div className="bg-blue-50 dark:bg-blue-900/30 p-4 rounded-lg border border-blue-200 dark:border-blue-800 space-y-4">
        <h3 className="font-medium text-blue-900 dark:text-blue-200">Anxiety Episode Details</h3>
        <p className="text-xs text-blue-700 dark:text-blue-300">
          Track physical symptoms, triggers, and impact for VA claims evidence
        </p>

        {/* Physical Symptoms */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Physical Symptoms
          </label>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            {[
              { key: 'heartRacing',       label: 'Heart racing/palpitations' },
              { key: 'sweating',          label: 'Sweating' },
              { key: 'trembling',         label: 'Trembling/shaking' },
              { key: 'shortnessOfBreath', label: 'Shortness of breath' },
              { key: 'chestTightness',    label: 'Chest tightness' },
              { key: 'nausea',            label: 'Nausea' },
              { key: 'dizziness',         label: 'Dizziness/lightheadedness' },
              { key: 'hotFlashes',        label: 'Hot flashes/chills' },
              { key: 'numbnessTingling',  label: 'Numbness/tingling' },
            ].map(({ key, label }) => (
                <CheckboxRow key={key} fieldKey={key} label={label} />
            ))}
          </div>
        </div>

        {/* Cognitive Symptoms */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Cognitive Symptoms
          </label>
          <div className="grid grid-cols-1 gap-2">
            {[
              { key: 'racingThoughts',        label: 'Racing thoughts' },
              { key: 'fearOfLosingControl',   label: 'Fear of losing control' },
              { key: 'fearOfDying',           label: 'Fear of dying' },
              { key: 'feelingDetached',       label: 'Feeling detached from reality' },
              { key: 'difficultyConcentrating', label: 'Difficulty concentrating' },
            ].map(({ key, label }) => (
                <CheckboxRow key={key} fieldKey={key} label={label} />
            ))}
          </div>
        </div>

        {/* Avoidance / Impact */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Avoidance/Impact
          </label>
          <div className="grid grid-cols-1 gap-2">
            {[
              { key: 'avoidedSocial',       label: 'Avoided social situations' },
              { key: 'leftEarly',           label: 'Left situation early' },
              { key: 'calledOut',           label: 'Called out of work/school' },
              { key: 'cancelledPlans',      label: 'Cancelled plans' },
              { key: 'neededSafetyPerson',  label: 'Required safety person present' },
            ].map(({ key, label }) => (
                <CheckboxRow key={key} fieldKey={key} label={label} />
            ))}
          </div>
        </div>

        {/* Episode Duration */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Episode Duration
          </label>
          <select
              value={data.episodeDuration}
              onChange={(e) => handleChange('episodeDuration', e.target.value)}
              className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
          >
            <option value="">Select duration...</option>
            <option value="<5min">Less than 5 minutes</option>
            <option value="5-15min">5–15 minutes</option>
            <option value="15-30min">15–30 minutes</option>
            <option value="30-60min">30–60 minutes</option>
            <option value=">1hr">More than 1 hour</option>
          </select>
        </div>

        {/* Panic Attack Toggle */}
        <div>
          <label className="flex items-center gap-2">
            <input
                type="checkbox"
                checked={data.wasPanicAttack}
                onChange={(e) => handleChange('wasPanicAttack', e.target.checked)}
                className="w-4 h-4 text-blue-600 rounded"
            />
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
            This was a panic attack
          </span>
          </label>
        </div>

        {/* Trigger */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Trigger/Situation
          </label>
          <input
              type="text"
              value={data.trigger}
              onChange={(e) => handleChange('trigger', e.target.value)}
              placeholder="What triggered this anxiety episode?"
              className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
          />
        </div>

        <div className="bg-blue-100 dark:bg-blue-900/20 p-3 rounded text-xs text-gray-600 dark:text-gray-400">
          <strong>For VA Claims:</strong> Document physical symptoms, triggers, and functional
          impact. Panic attacks require 4+ physical symptoms occurring simultaneously.
        </div>
      </div>
  );
};

export default AnxietyForm;