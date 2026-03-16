// src/components/forms/SymptomForms/CardiovascularForm.jsx
// Extracted Phase 9 cardiovascular form — covers:
//   Cardiac (heart disease, cardiomyopathy, CAD, Post-MI, HHD)
//   Arrhythmia (SVT, ventricular, AICD)
//   Pericarditis
//   Post-phlebitic syndrome
//
// Props:
//   initialData  — the cardiovascularData object from parent useState
//   onChange     — (fieldName, value) => void  — parent owns state
//   selectedSymptom — string — needed for sub-condition detection and AICD logic

import React, { useState, useEffect } from 'react';

// ─── Initial data constant ────────────────────────────────────────────────────
export const INITIAL_CARDIOVASCULAR_DATA = {
  // General cardiac / cardiomyopathy
  activityLevel: '',       // METs-equivalent activity when symptoms occur
  symptomTrigger: '',      // what triggers symptoms
  symptomDuration: '',     // how long symptoms last
  atRest: false,           // symptoms occur at rest
  withExertion: false,     // symptoms occur with exertion
  // Arrhythmia
  episodeType: '',
  treatmentRequired: '',   // none | oral | iv | cardioversion | ablation | vagal
  hospitalized: false,
  hasAICD: false,
  aicdShockDelivered: false,
  vagalManeuverUsed: false,
  // Pericarditis
  activeInfection: false,
  painWorseWithBreathing: false,
  painReliefLeaningForward: false,
  // Post-phlebitic
  affectedLeg: '',         // left | right | both
  compressionUsed: false,
  elevationHelps: false,
};

// ─── Sub-condition detection helpers ─────────────────────────────────────────
// These mirror the detection logic in both parent files so the form can
// show/hide its own subsections without requiring extra props.

const detectCardiac = (symptomId) =>
    symptomId?.startsWith('cardiac-') ||
    symptomId?.startsWith('cardiomyopathy-') ||
    symptomId?.startsWith('cad-') ||
    symptomId?.startsWith('post-mi-') ||
    symptomId?.startsWith('hhd-');

const detectArrhythmia = (symptomId) =>
    symptomId?.startsWith('svt-') ||
    symptomId?.startsWith('ventricular-arrhythmia-') ||
    symptomId?.startsWith('arrhythmia-') ||
    symptomId?.startsWith('aicd-');

const detectPericarditis = (symptomId) =>
    symptomId?.startsWith('pericarditis-');

const detectPostPhlebitic = (symptomId) =>
    symptomId?.startsWith('post-phlebitic-');

// ─── Component ────────────────────────────────────────────────────────────────
const CardiovascularForm = ({ initialData, onChange, selectedSymptom }) => {
  // Internal state — parent's initialData is the source of truth on mount/reset
  const [formData, setFormData] = useState(
      initialData ?? { ...INITIAL_CARDIOVASCULAR_DATA }
  );

  // Sync inward: when parent resets (new symptom selected / key change), re-init
  useEffect(() => {
    setFormData(initialData ?? { ...INITIAL_CARDIOVASCULAR_DATA });
  }, [initialData]);

  // Single update helper — keeps internal state in sync AND notifies parent
  const handleChange = (fieldName, value) => {
    setFormData(prev => ({ ...prev, [fieldName]: value }));
    onChange(fieldName, value);
  };

  // Sub-condition flags derived from selectedSymptom prop
  const isCardiacRelated      = detectCardiac(selectedSymptom);
  const isArrhythmiaRelated   = detectArrhythmia(selectedSymptom);
  const isPericarditisRelated = detectPericarditis(selectedSymptom);
  const isPostPhlebiticRelated = detectPostPhlebitic(selectedSymptom);

  // AICD fields only appear for ventricular arrhythmia / aicd symptom IDs
  const showAICDFields =
      selectedSymptom?.includes('ventricular') ||
      selectedSymptom?.includes('aicd');

  return (
      <div className="space-y-4 p-3 bg-red-50 dark:bg-red-900/20 rounded-lg">
        <h4 className="font-medium text-gray-900 dark:text-white flex items-center gap-2">
          <span>❤️</span> Cardiovascular Details
        </h4>

        {/* ── Common cardiac / pericarditis fields ───────────────────────── */}
        {(isCardiacRelated || isPericarditisRelated) && (
            <>
              {/* Symptom timing checkboxes */}
              <div className="grid grid-cols-2 gap-2">
                <label className="flex items-center gap-2">
                  <input
                      type="checkbox"
                      checked={formData.atRest}
                      onChange={(e) => handleChange('atRest', e.target.checked)}
                      className="rounded"
                  />
                  <span className="text-sm text-gray-700 dark:text-gray-300">Symptoms at rest</span>
                </label>
                <label className="flex items-center gap-2">
                  <input
                      type="checkbox"
                      checked={formData.withExertion}
                      onChange={(e) => handleChange('withExertion', e.target.checked)}
                      className="rounded"
                  />
                  <span className="text-sm text-gray-700 dark:text-gray-300">Symptoms with exertion</span>
                </label>
              </div>

              {/* Activity level — maps to METs for VA rating documentation */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Activity level when symptoms occur
                </label>
                <select
                    value={formData.activityLevel}
                    onChange={(e) => handleChange('activityLevel', e.target.value)}
                    className="w-full p-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600"
                >
                  <option value="">Select activity level...</option>
                  <option value="rest">At rest (eating, sitting, lying down)</option>
                  <option value="minimal">Minimal activity (dressing, walking around house)</option>
                  <option value="light">Light activity (light housework, walking 2-3 mph)</option>
                  <option value="moderate">Moderate activity (climbing stairs, walking 4 mph)</option>
                  <option value="heavy">Heavy activity (heavy housework, cycling)</option>
                  <option value="vigorous">Vigorous activity (running, sports)</option>
                </select>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  This helps document your METs capacity for VA rating
                </p>
              </div>
            </>
        )}

        {/* ── Pericarditis-specific fields ───────────────────────────────── */}
        {isPericarditisRelated && (
            <div className="space-y-2 border-t border-red-200 dark:border-red-800 pt-3">
              <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Pericarditis characteristics:
              </p>
              <label className="flex items-center gap-2">
                <input
                    type="checkbox"
                    checked={formData.activeInfection}
                    onChange={(e) => handleChange('activeInfection', e.target.checked)}
                    className="rounded"
                />
                <span className="text-sm text-gray-700 dark:text-gray-300">
                  Currently in active infection period (100% rating during active + 3 months post)
                </span>
              </label>
              <label className="flex items-center gap-2">
                <input
                    type="checkbox"
                    checked={formData.painWorseWithBreathing}
                    onChange={(e) => handleChange('painWorseWithBreathing', e.target.checked)}
                    className="rounded"
                />
                <span className="text-sm text-gray-700 dark:text-gray-300">Pain worse with breathing</span>
              </label>
              <label className="flex items-center gap-2">
                <input
                    type="checkbox"
                    checked={formData.painReliefLeaningForward}
                    onChange={(e) => handleChange('painReliefLeaningForward', e.target.checked)}
                    className="rounded"
                />
                <span className="text-sm text-gray-700 dark:text-gray-300">Pain relieved by leaning forward</span>
              </label>
            </div>
        )}

        {/* ── Arrhythmia-specific fields ─────────────────────────────────── */}
        {isArrhythmiaRelated && (
            <div className="space-y-3 border-t border-red-200 dark:border-red-800 pt-3">
              <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Arrhythmia details:</p>

              {/* Treatment required for this episode */}
              <div>
                <label className="block text-sm text-gray-700 dark:text-gray-300 mb-1">
                  Treatment required for this episode
                </label>
                <select
                    value={formData.treatmentRequired}
                    onChange={(e) => handleChange('treatmentRequired', e.target.value)}
                    className="w-full p-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600"
                >
                  <option value="">Select treatment...</option>
                  <option value="none">No treatment needed</option>
                  <option value="vagal">Vagal maneuver (self-managed)</option>
                  <option value="oral">Oral medication</option>
                  <option value="iv">IV medication (emergency/hospital)</option>
                  <option value="cardioversion">Cardioversion</option>
                  <option value="ablation">Ablation procedure</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <label className="flex items-center gap-2">
                  <input
                      type="checkbox"
                      checked={formData.hospitalized}
                      onChange={(e) => handleChange('hospitalized', e.target.checked)}
                      className="rounded"
                  />
                  <span className="text-sm text-gray-700 dark:text-gray-300">Required hospitalization</span>
                </label>
                <label className="flex items-center gap-2">
                  <input
                      type="checkbox"
                      checked={formData.vagalManeuverUsed}
                      onChange={(e) => handleChange('vagalManeuverUsed', e.target.checked)}
                      className="rounded"
                  />
                  <span className="text-sm text-gray-700 dark:text-gray-300">Used vagal maneuver</span>
                </label>
              </div>

              {/* AICD fields — only for ventricular arrhythmia / aicd symptom IDs */}
              {showAICDFields && (
                  <div className="space-y-2 bg-red-100 dark:bg-red-900/30 p-2 rounded">
                    <label className="flex items-center gap-2">
                      <input
                          type="checkbox"
                          checked={formData.hasAICD}
                          onChange={(e) => handleChange('hasAICD', e.target.checked)}
                          className="rounded"
                      />
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        I have an AICD (implantable defibrillator) — supports 100% rating
                      </span>
                    </label>
                    {formData.hasAICD && (
                        <label className="flex items-center gap-2 ml-6">
                          <input
                              type="checkbox"
                              checked={formData.aicdShockDelivered}
                              onChange={(e) => handleChange('aicdShockDelivered', e.target.checked)}
                              className="rounded"
                          />
                          <span className="text-sm text-gray-700 dark:text-gray-300">
                            AICD delivered shock today
                          </span>
                        </label>
                    )}
                  </div>
              )}
            </div>
        )}

        {/* ── Post-phlebitic syndrome fields ─────────────────────────────── */}
        {isPostPhlebiticRelated && (
            <div className="space-y-3 border-t border-red-200 dark:border-red-800 pt-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Affected leg
                </label>
                <select
                    value={formData.affectedLeg}
                    onChange={(e) => handleChange('affectedLeg', e.target.value)}
                    className="w-full p-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600"
                >
                  <option value="">Select leg...</option>
                  <option value="left">Left leg</option>
                  <option value="right">Right leg</option>
                  <option value="both">Both legs</option>
                </select>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  Each leg is rated separately and combined with bilateral factor
                </p>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <label className="flex items-center gap-2">
                  <input
                      type="checkbox"
                      checked={formData.compressionUsed}
                      onChange={(e) => handleChange('compressionUsed', e.target.checked)}
                      className="rounded"
                  />
                  <span className="text-sm text-gray-700 dark:text-gray-300">Using compression hosiery</span>
                </label>
                <label className="flex items-center gap-2">
                  <input
                      type="checkbox"
                      checked={formData.elevationHelps}
                      onChange={(e) => handleChange('elevationHelps', e.target.checked)}
                      className="rounded"
                  />
                  <span className="text-sm text-gray-700 dark:text-gray-300">Elevation relieves symptoms</span>
                </label>
              </div>
            </div>
        )}
      </div>
  );
};

export default CardiovascularForm;