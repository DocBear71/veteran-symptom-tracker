// src/components/forms/SymptomForms/PeripheralNerveForm.jsx
// Extracted peripheral nerve form — covers all 21 nerve types across
// upper and lower extremities (38 CFR 4.124a).
//
// Props:
//   initialData                    — peripheralNerveData object from parent useState
//   onChange                       — (fieldName, value) => void — parent owns state
//   isUpperExtremityNerveRelated   — bool — controls dominant hand question visibility

import React, { useState, useEffect } from 'react';

export const INITIAL_PERIPHERAL_NERVE_DATA = {
  affectedSide: '',
  isDominantSide: '',
  nerveConditionType: '',
  severityLevel: '',
  hasMotorInvolvement: false,
  hasSensoryInvolvement: false,
  hasAtrophy: false,
  atrophyLocation: '',
  hasDeformity: false,
  deformityType: '',
  functionalLimitations: '',
  usesAssistiveDevice: false,
  assistiveDeviceType: '',
  hasEMGNCS: false,
  emgNCSFindings: '',
};

const PeripheralNerveForm = ({ initialData, onChange, isUpperExtremityNerveRelated = false }) => {
  const [formData, setFormData] = useState(
      initialData ?? { ...INITIAL_PERIPHERAL_NERVE_DATA }
  );

  useEffect(() => {
    setFormData(initialData ?? { ...INITIAL_PERIPHERAL_NERVE_DATA });
  }, [initialData]);

  const handleChange = (fieldName, value) => {
    setFormData(prev => ({ ...prev, [fieldName]: value }));
    onChange(fieldName, value);
  };

  return (
      <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-lg border border-purple-200 dark:border-purple-800">
        <h4 className="font-medium text-purple-900 dark:text-purple-200 mb-3 flex items-center gap-2">
          <span>🔌</span> Peripheral Nerve Details
        </h4>
        <p className="text-sm text-purple-600 dark:text-purple-400 mb-3">
          These details help determine your VA rating based on 38 CFR 4.124a criteria.
        </p>

        <div className="space-y-3">

          {/* Affected Side */}
          <div>
            <label className="block text-sm text-gray-600 dark:text-gray-400 mb-1">Affected Side *</label>
            <select
                value={formData.affectedSide}
                onChange={(e) => handleChange('affectedSide', e.target.value)}
                className="w-full px-3 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600"
            >
              <option value="">Select affected side</option>
              <option value="left">Left</option>
              <option value="right">Right</option>
              <option value="bilateral">Bilateral (Both Sides)</option>
            </select>
          </div>

          {/* Dominant hand — upper extremity only */}
          {isUpperExtremityNerveRelated && (
              <div>
                <label className="block text-sm text-gray-600 dark:text-gray-400 mb-1">
                  Is this your dominant (major) hand/arm? *
                </label>
                <select
                    value={formData.isDominantSide}
                    onChange={(e) => handleChange('isDominantSide', e.target.value)}
                    className="w-full px-3 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600"
                >
                  <option value="">Select...</option>
                  <option value="yes">Yes - This is my dominant hand/arm</option>
                  <option value="no">No - This is my non-dominant hand/arm</option>
                  <option value="unknown">Unknown / Ambidextrous</option>
                </select>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  VA rates dominant (major) extremity higher than non-dominant (minor).
                </p>
              </div>
          )}

          {/* Nerve condition type */}
          <div>
            <label className="block text-sm text-gray-600 dark:text-gray-400 mb-1">Type of Nerve Condition</label>
            <select
                value={formData.nerveConditionType}
                onChange={(e) => handleChange('nerveConditionType', e.target.value)}
                className="w-full px-3 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600"
            >
              <option value="">Select type (if known)</option>
              <option value="paralysis">Paralysis (Motor loss)</option>
              <option value="neuritis">Neuritis (Nerve inflammation)</option>
              <option value="neuralgia">Neuralgia (Nerve pain)</option>
              <option value="unknown">Unknown / Not specified</option>
            </select>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              All three types use the same rating criteria per 38 CFR 4.124a.
            </p>
          </div>

          {/* Severity level */}
          <div>
            <label className="block text-sm text-gray-600 dark:text-gray-400 mb-1">Overall Severity Level</label>
            <select
                value={formData.severityLevel}
                onChange={(e) => handleChange('severityLevel', e.target.value)}
                className="w-full px-3 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600"
            >
              <option value="">Select severity</option>
              <option value="complete">Complete - Total loss of function</option>
              <option value="severe">Severe - Major functional loss</option>
              <option value="moderate">Moderate - Noticeable impairment</option>
              <option value="mild">Mild - Minor symptoms</option>
            </select>
          </div>

          {/* Motor / Sensory involvement */}
          <div>
            <label className="block text-sm text-gray-600 dark:text-gray-400 mb-2">
              Type of Involvement (check all that apply)
            </label>
            <div className="space-y-2">
              <label className="flex items-center gap-2">
                <input type="checkbox" checked={formData.hasMotorInvolvement}
                       onChange={(e) => handleChange('hasMotorInvolvement', e.target.checked)}
                       className="rounded" />
                <span className="text-sm text-gray-700 dark:text-gray-300">
                  Motor involvement (weakness, paralysis, atrophy)
                </span>
              </label>
              <label className="flex items-center gap-2">
                <input type="checkbox" checked={formData.hasSensoryInvolvement}
                       onChange={(e) => handleChange('hasSensoryInvolvement', e.target.checked)}
                       className="rounded" />
                <span className="text-sm text-gray-700 dark:text-gray-300">
                  Sensory involvement (numbness, tingling, pain)
                </span>
              </label>
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              Note: Per VA regulations, when involvement is wholly sensory, rating should be mild or at most moderate.
            </p>
          </div>

          {/* Atrophy */}
          <div>
            <label className="flex items-center gap-2">
              <input type="checkbox" checked={formData.hasAtrophy}
                     onChange={(e) => handleChange('hasAtrophy', e.target.checked)}
                     className="rounded" />
              <span className="text-sm text-gray-700 dark:text-gray-300">Muscle atrophy present</span>
            </label>
            {formData.hasAtrophy && (
                <div className="mt-2">
                  <label className="block text-sm text-gray-600 dark:text-gray-400 mb-1">Atrophy Location</label>
                  <input type="text" value={formData.atrophyLocation}
                         onChange={(e) => handleChange('atrophyLocation', e.target.value)}
                         placeholder="e.g., thenar eminence, interossei, deltoid, calf"
                         className="w-full px-3 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600" />
                </div>
            )}
          </div>

          {/* Deformity */}
          <div>
            <label className="flex items-center gap-2">
              <input type="checkbox" checked={formData.hasDeformity}
                     onChange={(e) => handleChange('hasDeformity', e.target.checked)}
                     className="rounded" />
              <span className="text-sm text-gray-700 dark:text-gray-300">Deformity present</span>
            </label>
            {formData.hasDeformity && (
                <div className="mt-2">
                  <label className="block text-sm text-gray-600 dark:text-gray-400 mb-1">Deformity Type</label>
                  <select value={formData.deformityType}
                          onChange={(e) => handleChange('deformityType', e.target.value)}
                          className="w-full px-3 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600">
                    <option value="">Select deformity type</option>
                    <option value="wrist-drop">Wrist Drop (Radial nerve)</option>
                    <option value="finger-drop">Finger Drop</option>
                    <option value="foot-drop">Foot Drop (Peroneal/Sciatic)</option>
                    <option value="claw-hand">Claw Hand (Ulnar nerve)</option>
                    <option value="ape-hand">Ape Hand (Median nerve)</option>
                    <option value="winged-scapula">Winged Scapula (Long thoracic)</option>
                    <option value="other">Other</option>
                  </select>
                </div>
            )}
          </div>

          {/* Assistive device */}
          <div>
            <label className="flex items-center gap-2">
              <input type="checkbox" checked={formData.usesAssistiveDevice}
                     onChange={(e) => handleChange('usesAssistiveDevice', e.target.checked)}
                     className="rounded" />
              <span className="text-sm text-gray-700 dark:text-gray-300">Uses assistive device</span>
            </label>
            {formData.usesAssistiveDevice && (
                <div className="mt-2">
                  <label className="block text-sm text-gray-600 dark:text-gray-400 mb-1">Device Type</label>
                  <select value={formData.assistiveDeviceType}
                          onChange={(e) => handleChange('assistiveDeviceType', e.target.value)}
                          className="w-full px-3 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600">
                    <option value="">Select device type</option>
                    <option value="wrist-splint">Wrist Splint</option>
                    <option value="hand-brace">Hand Brace</option>
                    <option value="afo">AFO (Ankle-Foot Orthosis)</option>
                    <option value="knee-brace">Knee Brace</option>
                    <option value="cane">Cane</option>
                    <option value="walker">Walker</option>
                    <option value="other">Other</option>
                  </select>
                </div>
            )}
          </div>

          {/* EMG/NCS */}
          <div>
            <label className="flex items-center gap-2">
              <input type="checkbox" checked={formData.hasEMGNCS}
                     onChange={(e) => handleChange('hasEMGNCS', e.target.checked)}
                     className="rounded" />
              <span className="text-sm text-gray-700 dark:text-gray-300">
                Has had EMG/Nerve Conduction Study
              </span>
            </label>
            {formData.hasEMGNCS && (
                <div className="mt-2">
                  <label className="block text-sm text-gray-600 dark:text-gray-400 mb-1">
                    EMG/NCS Findings (if known)
                  </label>
                  <textarea
                      value={formData.emgNCSFindings}
                      onChange={(e) => handleChange('emgNCSFindings', e.target.value)}
                      placeholder="e.g., moderate carpal tunnel syndrome, axonal loss, demyelination"
                      rows={2}
                      className="w-full px-3 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600"
                  />
                </div>
            )}
          </div>

          {/* Functional limitations */}
          <div>
            <label className="block text-sm text-gray-600 dark:text-gray-400 mb-1">
              Functional Limitations (optional)
            </label>
            <textarea
                value={formData.functionalLimitations}
                onChange={(e) => handleChange('functionalLimitations', e.target.value)}
                placeholder="Describe how this affects daily activities, work, etc."
                rows={2}
                className="w-full px-3 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600"
            />
          </div>

        </div>
      </div>
  );
};

export default PeripheralNerveForm;