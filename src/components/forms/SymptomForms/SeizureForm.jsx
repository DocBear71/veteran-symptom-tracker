// src/components/forms/SymptomForms/SeizureForm.jsx
// Extracted Phase 1D/1E seizure form — covers:
//   General seizure characteristics (all types)
//   Jacksonian/Focal Epilepsy (DC 8912)
//   Diencephalic Epilepsy (DC 8913)
//   Psychomotor Epilepsy (DC 8914)
//
// Props:
//   initialData     — seizureData object from parent useState
//   onChange        — (fieldName, value) => void — parent owns state
//   selectedSymptom — string — used for subtype detection
//   showJacksonian  — bool — override: EditLogModal passes this when existing
//                    log data indicates focal seizure regardless of symptomId
//   showDiencephalic — bool — same override for diencephalic
//   showPsychomotor  — bool — same override for psychomotor
//
// Sub-type detection: symptomId-based (same as parents) OR parent override props.
// This lets EditLogModal correctly show subsections when editing old logs whose
// seizureData already has focal/diencephalic/psychomotor data.

import React, { useState, useEffect } from 'react';

// ─── Initial data constant ────────────────────────────────────────────────────
export const INITIAL_SEIZURE_DATA = {
  episodeType: '',              // generalized | partial | absence | psychogenic | other
  duration: '',                 // seconds
  lossOfConsciousness: null,    // 'yes' | 'partial' | 'no'
  auraPresent: null,            // true | false
  recoveryTime: '',             // immediate | minutes | 30-60min | hours | prolonged
  witnessPresent: null,         // true | false
  // DC 8912 — Jacksonian/Focal
  focalOnsetLocation: '',
  focalSpread: null,            // true | false
  spreadPattern: '',
  secondaryGeneralization: null, // true | false
  awarenessPreserved: null,     // true | false
  // DC 8913 — Diencephalic
  autonomicSymptoms: [],
  // DC 8914 — Psychomotor
  automatisms: [],
  hallucinations: null,
  hallucinationType: '',
  perceptualIllusions: null,
  moodChange: null,
  memoryDisturbance: null,
  automaticState: null,         // true | false
};

// ─── Static data (defined outside component to avoid re-creation) ─────────────
const AUTONOMIC_SYMPTOMS = [
  { id: 'flushing',     label: '🔴 Sudden Flushing' },
  { id: 'sweating',     label: '💧 Profuse Sweating' },
  { id: 'bp-change',    label: '📊 Blood Pressure Change' },
  { id: 'hr-change',    label: '💓 Heart Rate Change' },
  { id: 'pupil-change', label: '👁️ Pupil Changes' },
  { id: 'temperature',  label: '🌡️ Temperature Change' },
  { id: 'gi-symptoms',  label: '🤢 GI Symptoms' },
  { id: 'lacrimation',  label: '😢 Tearing/Salivation' },
];

const AUTOMATISMS = [
  { id: 'lip-smacking',     label: 'Lip Smacking' },
  { id: 'chewing',          label: 'Chewing Motions' },
  { id: 'hand-movements',   label: 'Hand Movements' },
  { id: 'picking',          label: 'Picking at Clothes' },
  { id: 'wandering',        label: 'Purposeless Wandering' },
  { id: 'complex-behavior', label: 'Complex Behavior' },
];

// ─── Component ────────────────────────────────────────────────────────────────
const SeizureForm = ({
                       initialData,
                       onChange,
                       selectedSymptom,
                       showJacksonian   = false,
                       showDiencephalic = false,
                       showPsychomotor  = false,
                     }) => {
  const [formData, setFormData] = useState(
      initialData ?? { ...INITIAL_SEIZURE_DATA }
  );

  // Sync inward: re-init when parent resets via key change
  useEffect(() => {
    setFormData(initialData ?? { ...INITIAL_SEIZURE_DATA });
  }, [initialData]);

  // Scalar field update
  const handleChange = (fieldName, value) => {
    setFormData(prev => ({ ...prev, [fieldName]: value }));
    onChange(fieldName, value);
  };

  // Array toggle helper — avoids setState-in-render by computing outside updater
  const toggleArrayField = (fieldName, id) => {
    const current = formData[fieldName] || [];
    const updated = current.includes(id)
        ? current.filter(s => s !== id)
        : [...current, id];
    setFormData(prev => ({ ...prev, [fieldName]: updated }));
    onChange(fieldName, updated);
  };

  // Sub-type detection — symptomId OR parent override (for editing existing logs)
  const isJacksonian = showJacksonian ||
      selectedSymptom?.startsWith('jack-') ||
      selectedSymptom === 'seizure-partial' ||
      selectedSymptom?.includes('focal');

  const isDiencephalic = showDiencephalic ||
      selectedSymptom?.startsWith('dien-');

  const isPsychomotor = showPsychomotor ||
      selectedSymptom?.startsWith('psych-') ||
      selectedSymptom === 'seizure-psychomotor';

  // Shared button class helper for Yes/No/Partial toggle buttons
  const btnClass = (active, colorActive = 'purple') => {
    const activeColors = {
      purple: 'bg-purple-100 dark:bg-purple-900/50 border-purple-400 dark:border-purple-600 text-purple-900 dark:text-purple-200',
      red:    'bg-red-100 dark:bg-red-900/50 border-red-400 dark:border-red-600',
      green:  'bg-green-100 dark:bg-green-900/50 border-green-400 dark:border-green-600',
    };
    return `p-2 rounded-lg border transition-colors ${
        active
            ? activeColors[colorActive]
            : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300'
    }`;
  };

  // Shared class for checkbox pill cards
  const pillClass = (active, color = 'purple') => {
    const activeColors = {
      purple: 'bg-purple-100 dark:bg-purple-900/50 border-purple-300 dark:border-purple-700',
      blue:   'bg-blue-100 dark:bg-blue-900/50 border-blue-300',
    };
    return `flex items-center gap-2 p-2 rounded-lg border cursor-pointer transition-colors ${
        active ? activeColors[color] : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700'
    }`;
  };

  return (
      <div className="bg-purple-50 dark:bg-purple-900/30 p-4 rounded-lg border border-purple-200 dark:border-purple-800 space-y-4">
        <h3 className="font-medium text-purple-900 dark:text-purple-200">Seizure/Episode Details</h3>
        <p className="text-xs text-purple-700 dark:text-purple-300">
          Document episode characteristics for VA claims
        </p>

        {/* Episode Type */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Episode Type
          </label>
          <select
              value={formData.episodeType}
              onChange={(e) => handleChange('episodeType', e.target.value)}
              className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
          >
            <option value="">Select type...</option>
            <option value="generalized">Generalized (Tonic-Clonic/Grand Mal)</option>
            <option value="partial">Partial/Focal</option>
            <option value="absence">Absence (Petit Mal)</option>
            <option value="psychogenic">Psychogenic Non-Epileptic</option>
            <option value="other">Other/Unknown</option>
          </select>
        </div>

        {/* Duration */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Duration of Episode (seconds)
          </label>
          <input
              type="number"
              min="0"
              max="9999"
              value={formData.duration}
              onChange={(e) => handleChange('duration', e.target.value)}
              placeholder="e.g., 30"
              className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
          />
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Approximate duration in seconds</p>
        </div>

        {/* Loss of Consciousness */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Loss of Consciousness?
          </label>
          <div className="grid grid-cols-3 gap-2">
            <button type="button"
                    onClick={() => handleChange('lossOfConsciousness', 'yes')}
                    className={btnClass(formData.lossOfConsciousness === 'yes')}>
              Yes
            </button>
            <button type="button"
                    onClick={() => handleChange('lossOfConsciousness', 'partial')}
                    className={btnClass(formData.lossOfConsciousness === 'partial')}>
              Partial
            </button>
            <button type="button"
                    onClick={() => handleChange('lossOfConsciousness', 'no')}
                    className={btnClass(formData.lossOfConsciousness === 'no')}>
              No
            </button>
          </div>
        </div>

        {/* Aura */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Did you have warning signs (aura)?
          </label>
          <div className="grid grid-cols-2 gap-2">
            <button type="button"
                    onClick={() => handleChange('auraPresent', true)}
                    className={btnClass(formData.auraPresent === true)}>
              Yes
            </button>
            <button type="button"
                    onClick={() => handleChange('auraPresent', false)}
                    className={btnClass(formData.auraPresent === false)}>
              No
            </button>
          </div>
        </div>

        {/* Recovery Time */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Recovery Time
          </label>
          <select
              value={formData.recoveryTime}
              onChange={(e) => handleChange('recoveryTime', e.target.value)}
              className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
          >
            <option value="">Select recovery time...</option>
            <option value="immediate">Immediate (&lt; 5 minutes)</option>
            <option value="minutes">5-30 minutes</option>
            <option value="30-60min">30-60 minutes</option>
            <option value="hours">1-4 hours</option>
            <option value="prolonged">More than 4 hours</option>
          </select>
        </div>

        {/* Witness Present */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Was there a witness present?
          </label>
          <div className="grid grid-cols-2 gap-2">
            <button type="button"
                    onClick={() => handleChange('witnessPresent', true)}
                    className={btnClass(formData.witnessPresent === true)}>
              Yes
            </button>
            <button type="button"
                    onClick={() => handleChange('witnessPresent', false)}
                    className={btnClass(formData.witnessPresent === false)}>
              No
            </button>
          </div>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            Witness statements strengthen VA claims
          </p>
        </div>

        {/* ── DC 8912: Jacksonian/Focal ───────────────────────────────────── */}
        {isJacksonian && (
            <div className="border-t border-purple-200 dark:border-purple-700 pt-4 mt-4">
              <h4 className="font-medium text-purple-800 dark:text-purple-300 mb-3">
                🎯 Focal/Jacksonian Details (DC 8912)
              </h4>

              {/* Focal onset location */}
              <div className="mb-3">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Where did the seizure start?
                </label>
                <select
                    value={formData.focalOnsetLocation}
                    onChange={(e) => handleChange('focalOnsetLocation', e.target.value)}
                    className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                >
                  <option value="">Select location...</option>
                  <option value="face">Face/Mouth</option>
                  <option value="hand">Hand/Fingers</option>
                  <option value="arm">Arm</option>
                  <option value="leg">Leg</option>
                  <option value="foot">Foot/Toes</option>
                  <option value="sensory-face">Sensory - Face</option>
                  <option value="sensory-arm">Sensory - Arm/Hand</option>
                  <option value="sensory-leg">Sensory - Leg/Foot</option>
                  <option value="visual">Visual Disturbance</option>
                </select>
              </div>

              {/* Jacksonian march */}
              <div className="mb-3">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Did the seizure spread to other body areas? (Jacksonian March)
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button type="button"
                          onClick={() => handleChange('focalSpread', true)}
                          className={btnClass(formData.focalSpread === true)}>
                    Yes, it spread
                  </button>
                  <button type="button"
                          onClick={() => handleChange('focalSpread', false)}
                          className={btnClass(formData.focalSpread === false)}>
                    No, stayed localized
                  </button>
                </div>
              </div>

              {/* Secondary generalization */}
              <div className="mb-3">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Did it become a full body convulsion? (Secondary Generalization)
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button type="button"
                          onClick={() => handleChange('secondaryGeneralization', true)}
                          className={btnClass(formData.secondaryGeneralization === true, 'red')}>
                    Yes (Major)
                  </button>
                  <button type="button"
                          onClick={() => handleChange('secondaryGeneralization', false)}
                          className={btnClass(formData.secondaryGeneralization === false, 'green')}>
                    No (Minor)
                  </button>
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  Secondary generalization rates as major seizure per 38 CFR 4.124a
                </p>
              </div>

              {/* Awareness */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Was awareness preserved during the focal seizure?
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button type="button"
                          onClick={() => handleChange('awarenessPreserved', true)}
                          className={btnClass(formData.awarenessPreserved === true)}>
                    Yes, aware
                  </button>
                  <button type="button"
                          onClick={() => handleChange('awarenessPreserved', false)}
                          className={btnClass(formData.awarenessPreserved === false)}>
                    No, impaired
                  </button>
                </div>
              </div>
            </div>
        )}

        {/* ── DC 8913: Diencephalic ──────────────────────────────────────── */}
        {isDiencephalic && (
            <div className="border-t border-purple-200 dark:border-purple-700 pt-4 mt-4">
              <h4 className="font-medium text-purple-800 dark:text-purple-300 mb-3">
                🌡️ Autonomic Symptoms (DC 8913)
              </h4>
              <p className="text-xs text-purple-600 dark:text-purple-400 mb-3">
                Select all autonomic symptoms experienced during this episode
              </p>
              <div className="grid grid-cols-2 gap-2">
                {AUTONOMIC_SYMPTOMS.map(symptom => (
                    <label key={symptom.id}
                           className={pillClass(formData.autonomicSymptoms?.includes(symptom.id))}>
                      <input
                          type="checkbox"
                          checked={formData.autonomicSymptoms?.includes(symptom.id) || false}
                          onChange={() => toggleArrayField('autonomicSymptoms', symptom.id)}
                          className="w-4 h-4 text-purple-600 rounded"
                      />
                      <span className="text-sm text-gray-700 dark:text-gray-300">{symptom.label}</span>
                    </label>
                ))}
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                Diencephalic epilepsy rates as minor seizures per 38 CFR 4.124a
              </p>
            </div>
        )}

        {/* ── DC 8914: Psychomotor ───────────────────────────────────────── */}
        {isPsychomotor && (
            <div className="border-t border-purple-200 dark:border-purple-700 pt-4 mt-4">
              <h4 className="font-medium text-purple-800 dark:text-purple-300 mb-3">
                🧠 Psychomotor Details (DC 8914)
              </h4>
              <p className="text-xs text-purple-600 dark:text-purple-400 mb-3">
                Psychomotor seizures can be rated as major or minor depending on characteristics
              </p>

              {/* Automatic state */}
              <div className="mb-3">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Was there an automatic state? (Complex behavior without awareness)
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button type="button"
                          onClick={() => handleChange('automaticState', true)}
                          className={btnClass(formData.automaticState === true, 'red')}>
                    Yes (Major)
                  </button>
                  <button type="button"
                          onClick={() => handleChange('automaticState', false)}
                          className={btnClass(formData.automaticState === false, 'green')}>
                    No
                  </button>
                </div>
              </div>

              {/* Automatisms */}
              <div className="mb-3">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Automatisms observed (select all that apply)
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {AUTOMATISMS.map(auto => (
                      <label key={auto.id}
                             className={pillClass(formData.automatisms?.includes(auto.id))}>
                        <input
                            type="checkbox"
                            checked={formData.automatisms?.includes(auto.id) || false}
                            onChange={() => toggleArrayField('automatisms', auto.id)}
                            className="w-4 h-4 text-purple-600 rounded"
                        />
                        <span className="text-sm text-gray-700 dark:text-gray-300">{auto.label}</span>
                      </label>
                  ))}
                </div>
              </div>

              {/* Minor transient symptoms */}
              <div className="mb-3">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Brief transient symptoms (indicate Minor type)
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { field: 'hallucinations',      label: 'Hallucinations' },
                    { field: 'perceptualIllusions',  label: 'Déjà vu/Jamais vu' },
                    { field: 'moodChange',           label: 'Sudden Mood Change' },
                    { field: 'memoryDisturbance',    label: 'Memory Disturbance' },
                  ].map(({ field, label }) => (
                      <label key={field} className={pillClass(formData[field], 'blue')}>
                        <input
                            type="checkbox"
                            checked={formData[field] || false}
                            onChange={(e) => handleChange(field, e.target.checked)}
                            className="w-4 h-4 text-blue-600 rounded"
                        />
                        <span className="text-sm">{label}</span>
                      </label>
                  ))}
                </div>
              </div>

              {/* Rating classification indicator */}
              <div className={`p-3 rounded-lg ${
                  formData.automaticState === true || formData.lossOfConsciousness === 'yes'
                      ? 'bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800'
                      : 'bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-800'
              }`}>
                <p className="text-sm font-medium">
                  {formData.automaticState === true || formData.lossOfConsciousness === 'yes'
                      ? '⚠️ This episode has MAJOR seizure characteristics'
                      : 'ℹ️ This episode has MINOR seizure characteristics'
                  }
                </p>
                <p className="text-xs mt-1 text-gray-600 dark:text-gray-400">
                  Per 38 CFR 4.124a: Major = automatic states or convulsions with LOC
                </p>
              </div>
            </div>
        )}
      </div>
  );
};

export default SeizureForm;