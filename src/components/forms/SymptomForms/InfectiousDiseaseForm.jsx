// src/components/forms/SymptomForms/InfectiousDiseaseForm.jsx
// Extracted Phase 6 infectious disease forms — 11 named exports:
//   HIVForm, HepatitisForm, LymeForm, MalariaForm, BrucellosisForm,
//   CampylobacterForm, QFeverForm, SalmonellaForm, ShigellaForm,
//   WestNileForm, NTMForm
//
// Each has a matching INITIAL_*_DATA export.
//
// Props for all forms: { initialData, onChange, selectedSymptom }
//   onChange: (fieldName, value) => void — parent owns state
//   selectedSymptom is needed by HIVForm and LymeForm for symptom-specific subsections.

import React, { useState, useEffect } from 'react';
import {
  INITIAL_HIV_DATA, INITIAL_HEPATITIS_DATA, INITIAL_LYME_DATA,
  INITIAL_MALARIA_DATA, INITIAL_BRUCELLOSIS_DATA, INITIAL_CAMPYLOBACTER_DATA,
  INITIAL_QFEVER_DATA, INITIAL_SALMONELLA_DATA, INITIAL_SHIGELLA_DATA,
  INITIAL_WEST_NILE_DATA, INITIAL_NTM_DATA,
} from './InfectiousDiseaseDefaults.js';

// ─── Shared helpers ───────────────────────────────────────────────────────────

// Sync hook: re-initializes internal state when parent resets via key change
const useSyncedState = (initialData, defaults) => {
  const [formData, setFormData] = useState(initialData ?? { ...defaults });
  useEffect(() => {
    setFormData(initialData ?? { ...defaults });
  }, [initialData]); // eslint-disable-line react-hooks/exhaustive-deps
  return [formData, setFormData];
};

// Standard scalar + parent notify
const makeHandleChange = (setFormData, onChange) => (fieldName, value) => {
  setFormData(prev => ({ ...prev, [fieldName]: value }));
  onChange(fieldName, value);
};

// Array toggle — avoids setState-in-render pattern
const makeToggleArray = (formData, setFormData, onChange) => (fieldName, id) => {
  const current = formData[fieldName] || [];
  const updated = current.includes(id)
      ? current.filter(s => s !== id)
      : [...current, id];
  setFormData(prev => ({ ...prev, [fieldName]: updated }));
  onChange(fieldName, updated);
};

// Shared checkbox row component
const CheckRow = ({ checked, onChange, label, danger = false, className = '' }) => (
    <label className={`flex items-start gap-2 ${className}`}>
      <input
          type="checkbox"
          checked={checked}
          onChange={onChange}
          className={`mt-1 rounded ${danger
              ? 'border-red-300 dark:border-red-600 bg-red-50 dark:bg-red-900/20'
              : 'border-gray-300 dark:border-gray-600'}`}
      />
      <span className={`text-sm ${danger
          ? 'text-red-700 dark:text-red-300 font-semibold'
          : 'text-gray-700 dark:text-gray-300'}`}>
        {label}
      </span>
    </label>
);

// Shared warning box
const Warning = ({ children }) => (
    <div className="mt-3 p-3 bg-red-50 dark:bg-red-900/30 rounded border border-red-300 dark:border-red-700">
      <p className="text-sm text-red-900 dark:text-red-200 font-semibold">{children}</p>
    </div>
);

// Shared VA guidance box
const VAGuidance = ({ children }) => (
    <div className="mt-4 p-3 bg-white dark:bg-gray-800 rounded border border-blue-300 dark:border-blue-700">
      <p className="text-xs text-gray-600 dark:text-gray-400">{children}</p>
    </div>
);

// ─────────────────────────────────────────────────────────────────────────────
// 1. HIV/AIDS Form (DC 6351)
// ─────────────────────────────────────────────────────────────────────────────
export const HIVForm = ({ initialData, onChange, selectedSymptom }) => {
  const [formData, setFormData] = useSyncedState(initialData, INITIAL_HIV_DATA);
  const handleChange = makeHandleChange(setFormData, onChange);
  const toggleArray = makeToggleArray(formData, setFormData, onChange);

  const constitutionalItems = [
    { id: 'night-sweats',      label: 'Night Sweats' },
    { id: 'persistent-fever',  label: 'Persistent Fever' },
    { id: 'chronic-diarrhea',  label: 'Chronic Diarrhea' },
    { id: 'severe-fatigue',    label: 'Severe Fatigue' },
  ];

  return (
      <div className="bg-red-50 dark:bg-red-900/20 rounded-lg p-6 border-2 border-red-200 dark:border-red-800 space-y-4">
        <div className="flex items-center gap-3 mb-4">
          <span className="text-3xl">🦠</span>
          <div>
            <h3 className="font-semibold text-red-900 dark:text-red-300 text-lg">HIV/AIDS Symptom Details</h3>
            <p className="text-sm text-red-700 dark:text-red-400">Document symptoms to support VA rating under DC 6351</p>
          </div>
        </div>

        {/* Opportunistic infection — only shown for that specific symptom */}
        {selectedSymptom === 'hiv-opportunistic-infection' && (
            <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-red-300 dark:border-red-700 space-y-3">
              <h4 className="font-medium text-red-900 dark:text-red-300">Opportunistic Infection Details</h4>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Type of Infection *</label>
                <select
                    value={formData.infectionType}
                    onChange={(e) => handleChange('infectionType', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                >
                  <option value="">Select infection type...</option>
                  <option value="Pneumocystis jirovecii pneumonia (PCP)">Pneumocystis jirovecii pneumonia (PCP)</option>
                  <option value="Cytomegalovirus (CMV)">Cytomegalovirus (CMV)</option>
                  <option value="Mycobacterium avium complex (MAC)">Mycobacterium avium complex (MAC)</option>
                  <option value="Toxoplasmosis">Toxoplasmosis</option>
                  <option value="Cryptococcosis">Cryptococcosis</option>
                  <option value="Histoplasmosis">Histoplasmosis</option>
                  <option value="Tuberculosis (TB)">Tuberculosis (TB)</option>
                  <option value="Candidiasis (esophageal)">Candidiasis (esophageal)</option>
                  <option value="Progressive multifocal leukoencephalopathy (PML)">Progressive multifocal leukoencephalopathy (PML)</option>
                  <option value="Other">Other (specify in notes)</option>
                </select>
              </div>
              <div className="bg-red-100 dark:bg-red-900/30 p-3 rounded-lg">
                <p className="text-sm text-red-800 dark:text-red-200">
                  ⚠️ <strong>Recurrent opportunistic infections may qualify for 100% rating.</strong> Document each episode separately and note treatment/hospitalization.
                </p>
              </div>
            </div>
        )}

        {/* Constitutional symptoms */}
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700 space-y-3">
          <h4 className="font-medium text-gray-900 dark:text-gray-100">Constitutional Symptoms</h4>
          <p className="text-sm text-gray-600 dark:text-gray-400">Select all symptoms present (required for 30% minimum rating):</p>
          <div className="grid grid-cols-2 gap-2">
            {constitutionalItems.map(({ id, label }) => (
                <label key={id} className="flex items-center gap-2">
                  <input
                      type="checkbox"
                      checked={formData.constitutionalSymptoms?.includes(id)}
                      onChange={() => toggleArray('constitutionalSymptoms', id)}
                      className="rounded border-gray-300 dark:border-gray-600"
                  />
                  <span className="text-sm text-gray-700 dark:text-gray-300">{label}</span>
                </label>
            ))}
          </div>
        </div>

        {/* Weight loss — only for that symptom */}
        {selectedSymptom === 'hiv-weight-loss' && (
            <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-red-300 dark:border-red-700 space-y-3">
              <h4 className="font-medium text-red-900 dark:text-red-300">Weight Loss Documentation</h4>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Percentage of Body Weight Lost *</label>
                <input
                    type="number" min="0" max="50" step="0.5"
                    value={formData.weightLossPercentage}
                    onChange={(e) => handleChange('weightLossPercentage', e.target.value)}
                    placeholder="e.g., 12.5"
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                />
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">≥10% = Pathological weight loss (may support 100% rating with other symptoms)</p>
              </div>
              {parseFloat(formData.weightLossPercentage) >= 10 && (
                  <div className="bg-red-100 dark:bg-red-900/30 p-3 rounded-lg">
                    <p className="text-sm text-red-800 dark:text-red-200">
                      ⚠️ <strong>Pathological weight loss documented.</strong> With debilitating constitutional symptoms, may support 100% rating.
                    </p>
                  </div>
              )}
            </div>
        )}

        {/* Treatment */}
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700 space-y-3">
          <h4 className="font-medium text-gray-900 dark:text-gray-100">Treatment Information</h4>
          <label className="flex items-center gap-2">
            <input type="checkbox" checked={formData.onAntiretrovirals}
                   onChange={(e) => handleChange('onAntiretrovirals', e.target.checked)}
                   className="rounded border-gray-300 dark:border-gray-600" />
            <span className="text-sm text-gray-700 dark:text-gray-300">Currently on Antiretroviral Therapy (ART)</span>
          </label>
          {formData.onAntiretrovirals && (
              <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg">
                <p className="text-sm text-blue-800 dark:text-blue-200">
                  ℹ️ Use of FDA-approved antiretroviral medications supports <strong>minimum 30% rating</strong> under DC 6351.
                </p>
              </div>
          )}
          {formData.onAntiretrovirals && (
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Treatment Compliance</label>
                <select value={formData.treatmentCompliance}
                        onChange={(e) => handleChange('treatmentCompliance', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100">
                  <option value="">Select compliance level...</option>
                  <option value="excellent">Excellent (&gt;95% adherence)</option>
                  <option value="good">Good (85-95% adherence)</option>
                  <option value="fair">Fair (70-85% adherence)</option>
                  <option value="poor">Poor (&lt;70% adherence)</option>
                </select>
              </div>
          )}
        </div>

        {/* CD4 */}
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700 space-y-3">
          <h4 className="font-medium text-gray-900 dark:text-gray-100">Lab Values (Optional)</h4>
          <label className="flex items-center gap-2">
            <input type="checkbox" checked={formData.cd4CountKnown}
                   onChange={(e) => handleChange('cd4CountKnown', e.target.checked)}
                   className="rounded border-gray-300 dark:border-gray-600" />
            <span className="text-sm text-gray-700 dark:text-gray-300">I know my CD4 count range</span>
          </label>
          {formData.cd4CountKnown && (
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Most Recent CD4 Count Range</label>
                <select value={formData.cd4Range}
                        onChange={(e) => handleChange('cd4Range', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100">
                  <option value="">Select CD4 range...</option>
                  <option value="<200">&lt;200 (AIDS diagnosis, severe immunosuppression)</option>
                  <option value="200-500">200-500 (Moderate immunosuppression)</option>
                  <option value=">500">&gt;500 (Normal to near-normal)</option>
                </select>
                {formData.cd4Range === '<200' && (
                    <div className="bg-red-100 dark:bg-red-900/30 p-3 rounded-lg mt-2">
                      <p className="text-sm text-red-800 dark:text-red-200">⚠️ CD4 &lt;200 indicates AIDS and supports <strong>minimum 30% rating</strong>.</p>
                    </div>
                )}
                {formData.cd4Range === '200-500' && (
                    <div className="bg-yellow-100 dark:bg-yellow-900/30 p-3 rounded-lg mt-2">
                      <p className="text-sm text-yellow-800 dark:text-yellow-200">ℹ️ CD4 200-500 with constitutional symptoms supports <strong>10% rating</strong>.</p>
                    </div>
                )}
              </div>
          )}
          <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg">
            <p className="text-sm text-blue-800 dark:text-blue-200">
              💡 <strong>Tip:</strong> Use the Measurements tab to track CD4 counts and viral load over time for comprehensive evidence.
            </p>
          </div>
        </div>

        {/* Rating guidance */}
        <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg border border-gray-300 dark:border-gray-600">
          <h4 className="font-medium text-gray-900 dark:text-gray-100 mb-2">VA Rating Guidance (DC 6351)</h4>
          <ul className="text-sm text-gray-700 dark:text-gray-300 space-y-1 text-left">
            <li>• <strong>100%:</strong> Recurrent opportunistic infections OR pathological weight loss with debilitating symptoms</li>
            <li>• <strong>60%:</strong> Refractory constitutional symptoms, intermittent diarrhea, or post-opportunistic infection</li>
            <li>• <strong>30%:</strong> Constitutional symptoms, CD4 &lt;200, or on antiretroviral medications</li>
            <li>• <strong>10%:</strong> Mild constitutional symptoms, CD4 200-500, or depression/memory loss</li>
            <li>• <strong>0%:</strong> Asymptomatic with HIV diagnosis</li>
          </ul>
        </div>
      </div>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// 2. Hepatitis Form (DC 7354 / DC 7314)
// ─────────────────────────────────────────────────────────────────────────────
export const HepatitisForm = ({ initialData, onChange }) => {
  const [formData, setFormData] = useSyncedState(initialData, INITIAL_HEPATITIS_DATA);
  const handleChange = makeHandleChange(setFormData, onChange);

  return (
      <div className="bg-amber-50 dark:bg-amber-900/20 rounded-lg p-6 border-2 border-amber-200 dark:border-amber-800 space-y-4">
        <div className="flex items-center gap-3 mb-4">
          <span className="text-3xl">🦠</span>
          <div>
            <h3 className="font-semibold text-amber-900 dark:text-amber-300 text-lg">Hepatitis Symptom Details</h3>
            <p className="text-sm text-amber-700 dark:text-amber-400">Document symptoms to support VA rating under DC 7354 (Hep C) or DC 7314 (Hep B)</p>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-amber-300 dark:border-amber-700 space-y-3">
          <h4 className="font-medium text-amber-900 dark:text-amber-300">Weight Changes</h4>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Weight Loss Percentage (if applicable)</label>
            <input type="number" min="0" max="50" step="0.5"
                   value={formData.weightLossPercentage}
                   onChange={(e) => handleChange('weightLossPercentage', e.target.value)}
                   placeholder="e.g., 10.5"
                   className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
            />
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">≥10% = Substantial weight loss (may support 60% rating)</p>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700 space-y-3">
          <h4 className="font-medium text-gray-900 dark:text-gray-100">Symptom Severity</h4>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Symptom Frequency</label>
            <select value={formData.symptomFrequency}
                    onChange={(e) => handleChange('symptomFrequency', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100">
              <option value="">Select frequency...</option>
              <option value="daily">Daily (every day or nearly every day)</option>
              <option value="intermittent">Intermittent (several times per week)</option>
              <option value="rare">Rare (occasionally)</option>
            </select>
          </div>
          <CheckRow checked={formData.debilitating}
                    onChange={(e) => handleChange('debilitating', e.target.checked)}
                    label="Symptoms are debilitating (interfere with work/daily activities)" />
          <CheckRow checked={formData.dietaryRestrictions}
                    onChange={(e) => handleChange('dietaryRestrictions', e.target.checked)}
                    label="Dietary restrictions required" />
        </div>

        <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg border border-gray-300 dark:border-gray-600">
          <h4 className="font-medium text-gray-900 dark:text-gray-100 mb-2">VA Rating Guidance</h4>
          <ul className="text-sm text-gray-700 dark:text-gray-300 space-y-1 text-left">
            <li>• <strong>100%:</strong> Near-constant debilitating symptoms</li>
            <li>• <strong>60%:</strong> Daily fatigue/malaise with substantial weight loss</li>
            <li>• <strong>30%:</strong> Daily fatigue/malaise with minor weight loss</li>
            <li>• <strong>10%:</strong> Intermittent fatigue/malaise</li>
            <li>• <strong>0%:</strong> Nonsymptomatic</li>
          </ul>
        </div>
      </div>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// 3. Lyme Disease Form (DC 6319)
// ─────────────────────────────────────────────────────────────────────────────
export const LymeForm = ({ initialData, onChange, selectedSymptom }) => {
  const [formData, setFormData] = useSyncedState(initialData, INITIAL_LYME_DATA);
  const handleChange = makeHandleChange(setFormData, onChange);

  return (
      <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-6 border-2 border-green-200 dark:border-green-800 space-y-4">
        <div className="flex items-center gap-3 mb-4">
          <span className="text-3xl">🦟</span>
          <div>
            <h3 className="font-semibold text-green-900 dark:text-green-300 text-lg">Lyme Disease Symptom Details</h3>
            <p className="text-sm text-green-700 dark:text-green-400">Document symptoms to support VA rating under DC 6319</p>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-green-300 dark:border-green-700 space-y-3">
          <h4 className="font-medium text-green-900 dark:text-green-300">Treatment Status</h4>
          <CheckRow checked={formData.activeTreatment}
                    onChange={(e) => handleChange('activeTreatment', e.target.checked)}
                    label="Currently undergoing active treatment (antibiotics)" />
          {formData.activeTreatment && (
              <div className="bg-red-50 dark:bg-red-900/20 p-3 rounded-lg">
                <p className="text-sm text-red-800 dark:text-red-200">⚠️ <strong>Active treatment rates 100%</strong> for minimum 6 months under DC 6319</p>
              </div>
          )}
          <CheckRow checked={formData.treatmentCompleted}
                    onChange={(e) => handleChange('treatmentCompleted', e.target.checked)}
                    label="Treatment completed (tracking residual symptoms)" />
          {formData.treatmentCompleted && (
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Treatment Completion Date (approximate)</label>
                <input type="date" value={formData.treatmentStartDate}
                       onChange={(e) => handleChange('treatmentStartDate', e.target.value)}
                       className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100" />
              </div>
          )}
        </div>

        {selectedSymptom === 'lyme-rash' && (
            <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-green-300 dark:border-green-700 space-y-3">
              <h4 className="font-medium text-green-900 dark:text-green-300">Rash Details</h4>
              <CheckRow checked={formData.rashPresent}
                        onChange={(e) => handleChange('rashPresent', e.target.checked)}
                        label="Rash currently present or documented" />
              {formData.rashPresent && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Rash Type</label>
                    <select value={formData.rashType}
                            onChange={(e) => handleChange('rashType', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100">
                      <option value="">Select type...</option>
                      <option value="bulls-eye">Bull's-eye (Erythema migrans)</option>
                      <option value="expanding-red">Expanding red rash (non-bull's-eye)</option>
                      <option value="other">Other type</option>
                    </select>
                  </div>
              )}
            </div>
        )}

        {formData.treatmentCompleted && (
            <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg border border-blue-300 dark:border-blue-700">
              <h4 className="font-medium text-blue-900 dark:text-blue-300 mb-3">Post-Treatment Residual Symptoms</h4>
              <p className="text-sm text-blue-800 dark:text-blue-200 mb-3">After treatment, residuals are rated under body system affected:</p>
              <ul className="text-sm text-blue-700 dark:text-blue-300 space-y-1">
                <li>• Nerve pain/numbness → Peripheral neuropathy rating</li>
                <li>• Joint pain → Arthritis rating for affected joints</li>
                <li>• Cognitive issues → Neurological rating</li>
                <li>• Chronic fatigue → Chronic Fatigue Syndrome rating</li>
                <li>• Cardiac issues → Heart condition rating</li>
              </ul>
            </div>
        )}

        <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg border border-gray-300 dark:border-gray-600">
          <h4 className="font-medium text-gray-900 dark:text-gray-100 mb-2">VA Rating Guidance (DC 6319)</h4>
          <ul className="text-sm text-gray-700 dark:text-gray-300 space-y-1 text-left">
            <li>• <strong>100%:</strong> Active disease requiring treatment (minimum 6 months)</li>
            <li>• <strong>After Treatment:</strong> Rate residuals by affected body system</li>
            <li>• Common residuals may require multiple diagnostic codes</li>
            <li>• Document all persistent symptoms for proper rating</li>
          </ul>
        </div>
      </div>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// 4. Malaria Form
// ─────────────────────────────────────────────────────────────────────────────
export const MalariaForm = ({ initialData, onChange, selectedSymptom }) => {
  const [formData, setFormData] = useSyncedState(initialData, INITIAL_MALARIA_DATA);
  const handleChange = makeHandleChange(setFormData, onChange);

  return (
      <div className="space-y-4">
        <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg border border-blue-200 dark:border-blue-800">
          <h4 className="font-semibold text-blue-900 dark:text-blue-200 mb-2">🦟 Malaria Details</h4>
          <p className="text-sm text-blue-800 dark:text-blue-300 mb-3">Track malaria symptoms and episodes. Document cyclical fever patterns and relapses.</p>
          <div className="space-y-3">
            {selectedSymptom === 'malaria-fever-spike' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Fever Temperature (°F)</label>
                  <input type="number" step="0.1"
                         value={formData.feverTemperature}
                         onChange={(e) => handleChange('feverTemperature', e.target.value)}
                         placeholder="e.g., 103.5"
                         className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white" />
                </div>
            )}
            <CheckRow checked={formData.cyclicalPattern} onChange={(e) => handleChange('cyclicalPattern', e.target.checked)} label="Cyclical fever pattern (occurs every 48-72 hours)" />
            <CheckRow checked={formData.relapseEpisode} onChange={(e) => handleChange('relapseEpisode', e.target.checked)} label="This is a relapse episode (recurrence after treatment)" />
            <CheckRow checked={formData.hospitalized} onChange={(e) => handleChange('hospitalized', e.target.checked)} label="Hospitalized for malaria complications" />
            <CheckRow checked={formData.continuousMedication} onChange={(e) => handleChange('continuousMedication', e.target.checked)} label="On continuous antimalarial medication" />
            <CheckRow checked={formData.severeComplications} onChange={(e) => handleChange('severeComplications', e.target.checked)} label="Severe complications (cerebral malaria, organ failure, severe anemia)" />
          </div>
          <VAGuidance>
            <strong>For VA Claims:</strong> Document fever patterns with temperature readings. Track relapse episodes (especially common with P. vivax and P. ovale). Lab confirmation of parasitemia strengthens claims. Cyclical fever every 48-72 hours is characteristic.
          </VAGuidance>
        </div>
      </div>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// 5. Brucellosis Form
// ─────────────────────────────────────────────────────────────────────────────
export const BrucellosisForm = ({ initialData, onChange }) => {
  const [formData, setFormData] = useSyncedState(initialData, INITIAL_BRUCELLOSIS_DATA);
  const handleChange = makeHandleChange(setFormData, onChange);

  return (
      <div className="space-y-4">
        <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg border border-blue-200 dark:border-blue-800">
          <h4 className="font-semibold text-blue-900 dark:text-blue-200 mb-2">🐄 Brucellosis Details</h4>
          <p className="text-sm text-blue-800 dark:text-blue-300 mb-3">Track brucellosis symptoms. This infection can relapse for years and cause chronic arthritis/spondylitis.</p>
          <div className="space-y-3">
            <CheckRow checked={formData.undulantFever} onChange={(e) => handleChange('undulantFever', e.target.checked)} label="Undulant (wave-like) fever pattern" />
            <CheckRow checked={formData.relapseEpisode} onChange={(e) => handleChange('relapseEpisode', e.target.checked)} label="This is a relapse episode (recurrence after treatment)" />
            <CheckRow checked={formData.chronicArthritis} onChange={(e) => handleChange('chronicArthritis', e.target.checked)} label="Chronic arthritis or spondylitis (spine inflammation)" />
            <CheckRow checked={formData.multiOrganInvolvement} onChange={(e) => handleChange('multiOrganInvolvement', e.target.checked)} label="Multiple organ involvement (liver, spleen, bones, joints)" />
            <CheckRow checked={formData.neurobrucellosis} onChange={(e) => handleChange('neurobrucellosis', e.target.checked)} label="Neurobrucellosis (CNS involvement: meningitis, encephalitis)" />
          </div>
          <VAGuidance>
            <strong>For VA Claims:</strong> Brucellosis is common in military personnel exposed to livestock in deployment areas. Document relapsing pattern and night sweats. Spine X-rays/MRI important if back pain present. Blood cultures or serology confirms diagnosis.
          </VAGuidance>
        </div>
      </div>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// 6. Campylobacter Form
// ─────────────────────────────────────────────────────────────────────────────
export const CampylobacterForm = ({ initialData, onChange }) => {
  const [formData, setFormData] = useSyncedState(initialData, INITIAL_CAMPYLOBACTER_DATA);
  const handleChange = makeHandleChange(setFormData, onChange);

  return (
      <div className="space-y-4">
        <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg border border-blue-200 dark:border-blue-800">
          <h4 className="font-semibold text-blue-900 dark:text-blue-200 mb-2">🦠 Campylobacter jejuni Details</h4>
          <p className="text-sm text-blue-800 dark:text-blue-300 mb-3">Track post-infection complications. Campylobacter can trigger Guillain-Barré syndrome and reactive arthritis.</p>
          <div className="space-y-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Weeks Since Initial Infection</label>
              <input type="number" value={formData.weeksSinceInfection}
                     onChange={(e) => handleChange('weeksSinceInfection', e.target.value)}
                     placeholder="e.g., 2"
                     className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white" />
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Reactive arthritis typically occurs 1-4 weeks after infection</p>
            </div>
            <CheckRow checked={formData.stoolCultureConfirmed} onChange={(e) => handleChange('stoolCultureConfirmed', e.target.checked)} label="Stool culture confirmed Campylobacter jejuni" />
            <CheckRow checked={formData.reactiveArthritis} onChange={(e) => handleChange('reactiveArthritis', e.target.checked)} label="Reactive arthritis (joint inflammation post-infection)" />
            <CheckRow checked={formData.chronicIBS} onChange={(e) => handleChange('chronicIBS', e.target.checked)} label="Post-infectious IBS (chronic bowel symptoms)" />
            <CheckRow checked={formData.guillainBarre} onChange={(e) => handleChange('guillainBarre', e.target.checked)} label="Guillain-Barré syndrome (GBS) - progressive muscle weakness" danger />
          </div>
          {formData.guillainBarre && (
              <Warning>⚠️ Guillain-Barré syndrome is a serious complication requiring immediate neurological evaluation. Seek emergency care for progressive weakness or difficulty breathing.</Warning>
          )}
          <VAGuidance>
            <strong>For VA Claims:</strong> Associated with Gulf War illness. Campylobacter is the leading bacterial trigger for GBS. Document timeline from infection to complications. EMG/nerve conduction studies important if GBS suspected.
          </VAGuidance>
        </div>
      </div>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// 7. Q Fever Form
// ─────────────────────────────────────────────────────────────────────────────
export const QFeverForm = ({ initialData, onChange }) => {
  const [formData, setFormData] = useSyncedState(initialData, INITIAL_QFEVER_DATA);
  const handleChange = makeHandleChange(setFormData, onChange);

  return (
      <div className="space-y-4">
        <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg border border-blue-200 dark:border-blue-800">
          <h4 className="font-semibold text-blue-900 dark:text-blue-200 mb-2">🐐 Q Fever Details</h4>
          <p className="text-sm text-blue-800 dark:text-blue-300 mb-3">Track Q fever symptoms. Chronic Q fever (&gt;6 months) can cause endocarditis requiring long-term treatment.</p>
          <div className="space-y-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Months Since Initial Infection</label>
              <input type="number" value={formData.monthsSinceInfection}
                     onChange={(e) => handleChange('monthsSinceInfection', e.target.value)}
                     placeholder="e.g., 8"
                     className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white" />
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Chronic Q fever defined as symptoms persisting &gt;6 months</p>
            </div>
            <CheckRow checked={formData.chronicQFever} onChange={(e) => handleChange('chronicQFever', e.target.checked)} label="Chronic Q fever (symptoms >6 months)" />
            <CheckRow checked={formData.phaseIAntibodies} onChange={(e) => handleChange('phaseIAntibodies', e.target.checked)} label="Phase I antibodies elevated (>1:800 indicates chronic infection)" />
            <CheckRow checked={formData.fatigueSyndrome} onChange={(e) => handleChange('fatigueSyndrome', e.target.checked)} label="Q fever fatigue syndrome (debilitating fatigue >6 months)" />
            <CheckRow checked={formData.endocarditis} onChange={(e) => handleChange('endocarditis', e.target.checked)} label="Q fever endocarditis (heart valve infection)" danger />
          </div>
          {formData.endocarditis && (
              <Warning>⚠️ Q fever endocarditis requires 18+ months of antibiotic treatment (doxycycline + hydroxychloroquine). Echocardiogram needed for diagnosis.</Warning>
          )}
          <VAGuidance>
            <strong>For VA Claims:</strong> Common in military deployments to Iraq/Afghanistan (livestock exposure). Chronic Q fever develops in 1-5% of cases. Veterans with pre-existing valve abnormalities at higher risk. Serology showing high Phase I titers indicates chronic infection.
          </VAGuidance>
        </div>
      </div>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// 8. Salmonella Form
// ─────────────────────────────────────────────────────────────────────────────
export const SalmonellaForm = ({ initialData, onChange }) => {
  const [formData, setFormData] = useSyncedState(initialData, INITIAL_SALMONELLA_DATA);
  const handleChange = makeHandleChange(setFormData, onChange);

  return (
      <div className="space-y-4">
        <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg border border-blue-200 dark:border-blue-800">
          <h4 className="font-semibold text-blue-900 dark:text-blue-200 mb-2">🦠 Nontyphoid Salmonella Details</h4>
          <p className="text-sm text-blue-800 dark:text-blue-300 mb-3">Track Salmonella infection symptoms. Document complications like bacteremia and reactive arthritis.</p>
          <div className="space-y-3">
            <CheckRow checked={formData.stoolCultureConfirmed} onChange={(e) => handleChange('stoolCultureConfirmed', e.target.checked)} label="Stool culture confirmed Salmonella" />
            <CheckRow checked={formData.reactiveArthritis} onChange={(e) => handleChange('reactiveArthritis', e.target.checked)} label="Reactive arthritis (joint inflammation 1-4 weeks post-infection)" />
            <CheckRow checked={formData.bacteremia} onChange={(e) => handleChange('bacteremia', e.target.checked)} label="Bacteremia/Sepsis (bacteria in bloodstream)" danger />
            <CheckRow checked={formData.hospitalized} onChange={(e) => handleChange('hospitalized', e.target.checked)} label="Hospitalized for complications" />
            <CheckRow checked={formData.severeComplications} onChange={(e) => handleChange('severeComplications', e.target.checked)} label="Other severe complications" />
          </div>
          <VAGuidance>
            <strong>For VA Claims:</strong> Salmonella is common in military deployments. Document all GI symptoms, dehydration requiring IV fluids, and post-infectious complications. Reactive arthritis typically occurs 1-4 weeks after infection.
          </VAGuidance>
        </div>
      </div>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// 9. Shigella Form
// ─────────────────────────────────────────────────────────────────────────────
export const ShigellaForm = ({ initialData, onChange }) => {
  const [formData, setFormData] = useSyncedState(initialData, INITIAL_SHIGELLA_DATA);
  const handleChange = makeHandleChange(setFormData, onChange);

  return (
      <div className="space-y-4">
        <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg border border-blue-200 dark:border-blue-800">
          <h4 className="font-semibold text-blue-900 dark:text-blue-200 mb-2">🦠 Shigella Infection Details</h4>
          <p className="text-sm text-blue-800 dark:text-blue-300 mb-3">Track Shigella dysentery symptoms. Document bloody diarrhea, tenesmus, and complications.</p>
          <div className="space-y-3">
            <CheckRow checked={formData.stoolCultureConfirmed} onChange={(e) => handleChange('stoolCultureConfirmed', e.target.checked)} label="Stool culture confirmed Shigella" />
            <CheckRow checked={formData.reactiveArthritis} onChange={(e) => handleChange('reactiveArthritis', e.target.checked)} label="Reactive arthritis (Reiter syndrome)" />
            <CheckRow checked={formData.hus} onChange={(e) => handleChange('hus', e.target.checked)} label="Hemolytic Uremic Syndrome (HUS) - kidney failure" danger />
            <CheckRow checked={formData.hospitalized} onChange={(e) => handleChange('hospitalized', e.target.checked)} label="Hospitalized for complications" />
            <CheckRow checked={formData.severeComplications} onChange={(e) => handleChange('severeComplications', e.target.checked)} label="Other severe complications (seizures, severe dehydration)" />
          </div>
          {formData.hus && (
              <Warning>⚠️ HUS is a life-threatening complication requiring immediate medical care. Document all lab work showing kidney dysfunction, low platelets, and hemolysis.</Warning>
          )}
          <VAGuidance>
            <strong>For VA Claims:</strong> Shigella causes dysentery (bloody diarrhea with painful straining/tenesmus). Common in Gulf War deployments. HUS is rare but serious. Document all symptoms and complications.
          </VAGuidance>
        </div>
      </div>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// 10. West Nile Virus Form
// ─────────────────────────────────────────────────────────────────────────────
export const WestNileForm = ({ initialData, onChange }) => {
  const [formData, setFormData] = useSyncedState(initialData, INITIAL_WEST_NILE_DATA);
  const handleChange = makeHandleChange(setFormData, onChange);

  return (
      <div className="space-y-4">
        <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg border border-blue-200 dark:border-blue-800">
          <h4 className="font-semibold text-blue-900 dark:text-blue-200 mb-2">🦟 West Nile Virus Details</h4>
          <p className="text-sm text-blue-800 dark:text-blue-300 mb-3">Track West Nile symptoms. Neuroinvasive disease and post-infection syndrome can cause long-term impairment.</p>
          <div className="space-y-3">
            <CheckRow checked={formData.serologyConfirmed} onChange={(e) => handleChange('serologyConfirmed', e.target.checked)} label="West Nile IgM antibodies confirmed" />
            <CheckRow checked={formData.neuroinvasive} onChange={(e) => handleChange('neuroinvasive', e.target.checked)} label="Neuroinvasive disease (nervous system involvement)" />
            <CheckRow checked={formData.encephalitis} onChange={(e) => handleChange('encephalitis', e.target.checked)} label="Encephalitis (brain inflammation)" danger />
            <CheckRow checked={formData.acuteFlaccidParalysis} onChange={(e) => handleChange('acuteFlaccidParalysis', e.target.checked)} label="Acute Flaccid Paralysis (polio-like paralysis)" danger />
            <CheckRow checked={formData.permanentImpairment} onChange={(e) => handleChange('permanentImpairment', e.target.checked)} label="Permanent neurological impairment" />
          </div>
          {(formData.acuteFlaccidParalysis || formData.encephalitis) && (
              <Warning>⚠️ Severe neuroinvasive disease. Document CSF analysis, MRI/CT findings, and neurological exam showing deficits. Paralysis may be permanent.</Warning>
          )}
          <VAGuidance>
            <strong>For VA Claims:</strong> West Nile is mosquito-borne. Post-West Nile syndrome causes chronic fatigue and weakness lasting months to years. Acute flaccid paralysis is rare but serious. Document both acute illness and long-term sequelae.
          </VAGuidance>
        </div>
      </div>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// 11. NTM (Nontuberculous Mycobacterium) Form
// ─────────────────────────────────────────────────────────────────────────────
export const NTMForm = ({ initialData, onChange }) => {
  const [formData, setFormData] = useSyncedState(initialData, INITIAL_NTM_DATA);
  const handleChange = makeHandleChange(setFormData, onChange);

  return (
      <div className="space-y-4">
        <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg border border-blue-200 dark:border-blue-800">
          <h4 className="font-semibold text-blue-900 dark:text-blue-200 mb-2">🫁 Nontuberculous Mycobacterium (NTM) Details</h4>
          <p className="text-sm text-blue-800 dark:text-blue-300 mb-3">Track NTM lung infection. Related to TB but different organism. Requires 12-24 months of multi-drug therapy.</p>
          <div className="space-y-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">NTM Species (if known)</label>
              <select value={formData.ntmSpecies}
                      onChange={(e) => handleChange('ntmSpecies', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white">
                <option value="">Select species...</option>
                <option value="mac">MAC (M. avium complex)</option>
                <option value="abscessus">M. abscessus</option>
                <option value="kansasii">M. kansasii</option>
                <option value="other">Other species</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Months on Treatment</label>
              <input type="number" value={formData.monthsOnTreatment}
                     onChange={(e) => handleChange('monthsOnTreatment', e.target.value)}
                     placeholder="e.g., 6"
                     className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white" />
            </div>
            <CheckRow checked={formData.activeDisease} onChange={(e) => handleChange('activeDisease', e.target.checked)} label="Active NTM disease (positive cultures, CT findings)" />
            <CheckRow checked={formData.onTreatment} onChange={(e) => handleChange('onTreatment', e.target.checked)} label="On long-term antibiotic therapy (12-24 months)" />
            <CheckRow checked={formData.disseminated} onChange={(e) => handleChange('disseminated', e.target.checked)} label="Disseminated NTM (spread beyond lungs)" danger />
          </div>
          <VAGuidance>
            <strong>For VA Claims:</strong> NTM requires multiple positive sputum cultures, CT showing nodular/cavitary disease, and prolonged multi-drug therapy. Treatment typically: macrolide + ethambutol + rifampin for 12-24 months. Not contagious person-to-person.
          </VAGuidance>
        </div>
      </div>
  );
};