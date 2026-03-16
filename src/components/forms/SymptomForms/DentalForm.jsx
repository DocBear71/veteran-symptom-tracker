// src/components/forms/SymptomForms/DentalForm.jsx
// Extracted Phase 7 dental/oral form — covers:
//   Jaw/TMJ conditions (DC 9900 series)
//   Bone/structural issues (osteomyelitis)
//   Tooth loss documentation
//   Prosthesis/denture details
//   Palate symptoms
//   Mastication/swallowing function
//   Oral neoplasm/tumor tracking
//   Infection/inflammation
//   Functional impact
//
// Props:
//   initialData — dentalData object from parent useState
//   onChange    — (fieldName, value) => void — parent owns state

import React, { useState, useEffect } from 'react';

// ─── Initial data constant ────────────────────────────────────────────────────
export const INITIAL_DENTAL_DATA = {
  // General
  affectedArea: '',              // jaw-mandible | jaw-maxilla | jaw-bilateral | jaw-tmj | teeth | palate | tongue | lips | gums | oral-mucosa | multiple
  isJawRelated: false,
  isBoneRelated: false,
  isToothRelated: false,
  isProsthesisRelated: false,
  // Jaw/structural
  jawPainSide: '',               // left | right | bilateral
  jawPainSeverity: 5,
  jawOpening: '',                // mm
  jawLocking: false,
  jawClicking: false,
  jawDeviation: false,
  boneInfection: false,
  boneExposed: false,
  boneDrainage: false,
  // Tooth
  toothCount: '',
  toothLocation: [],             // upper | lower | anterior | posterior
  toothLossCause: '',
  prosthesisType: '',
  prosthesisFunction: '',        // restores | does-not-restore
  prosthesisPain: false,
  prosthesisFit: '',             // good | acceptable | poor | ill-fitting
  // Palate
  palatePain: false,
  palateUlcers: false,
  palateInfection: false,
  // Function
  chewingDifficulty: '',         // none | mild | moderate | severe | unable
  swallowingDifficulty: '',
  dietaryRestrictions: '',       // none | semi-solid | soft | puree | full-liquid
  speechDifficulty: false,
  // Neoplasm
  oralMass: false,
  massLocation: '',
  massBiopsy: '',                // benign | malignant | pending | not-biopsied
  treatmentStatus: '',           // none | active-treatment | post-surgical | surveillance | recurrent
  // Infection
  activeInfection: false,
  infectionType: '',
  antibioticUse: false,
  // Impact
  workMissed: false,
  eatingImpaired: false,
  socialImpact: false,
};

// ─── Static data ──────────────────────────────────────────────────────────────
const TOOTH_LOCATIONS = [
  { value: 'upper',    label: 'Upper/Maxilla' },
  { value: 'lower',    label: 'Lower/Mandible' },
  { value: 'anterior', label: 'Anterior (Front)' },
  { value: 'posterior', label: 'Posterior (Back)' },
];

// ─── Component ────────────────────────────────────────────────────────────────
const DentalForm = ({ initialData, onChange }) => {
  const [formData, setFormData] = useState(
      initialData ?? { ...INITIAL_DENTAL_DATA }
  );

  useEffect(() => {
    setFormData(initialData ?? { ...INITIAL_DENTAL_DATA });
  }, [initialData]);

  // Scalar field update
  const handleChange = (fieldName, value) => {
    setFormData(prev => ({ ...prev, [fieldName]: value }));
    onChange(fieldName, value);
  };

  // Array toggle — compute outside updater to avoid setState-in-render
  const toggleToothLocation = (value) => {
    const current = formData.toothLocation || [];
    const updated = current.includes(value)
        ? current.filter(l => l !== value)
        : [...current, value];
    setFormData(prev => ({ ...prev, toothLocation: updated }));
    onChange('toothLocation', updated);
  };

  // Active-pill class for condition type checkboxes
  const conditionPill = 'flex items-center gap-2 p-2 rounded-lg border cursor-pointer bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700';

  // Prosthesis function button class
  const prosthesisBtnClass = (active) =>
      `p-2 rounded-lg border transition-colors ${
          active
              ? 'bg-amber-100 dark:bg-amber-900/50 border-amber-400 dark:border-amber-600 text-amber-900 dark:text-amber-200'
              : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300'
      }`;

  return (
      <div className="bg-amber-50 dark:bg-amber-900/20 p-6 rounded-lg border border-amber-200 dark:border-amber-800 space-y-4">
        <div className="flex items-start gap-3 mb-4">
          <span className="text-3xl">🦷</span>
          <div>
            <h3 className="font-semibold text-amber-900 dark:text-amber-200 text-lg">
              Dental & Oral Condition Details
            </h3>
            <p className="text-sm text-amber-700 dark:text-amber-300 mt-1">
              Document dental/oral symptoms for VA disability ratings (DC 9900 series)
            </p>
          </div>
        </div>

        {/* Primary Affected Area */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Primary Affected Area
          </label>
          <select
              value={formData.affectedArea}
              onChange={(e) => handleChange('affectedArea', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
          >
            <option value="">Select affected area...</option>
            <option value="jaw-mandible">Jaw (Mandible - Lower)</option>
            <option value="jaw-maxilla">Jaw (Maxilla - Upper)</option>
            <option value="jaw-bilateral">Jaw (Both Upper &amp; Lower)</option>
            <option value="jaw-tmj">TMJ (Temporomandibular Joint)</option>
            <option value="teeth">Teeth</option>
            <option value="palate">Hard Palate</option>
            <option value="tongue">Tongue</option>
            <option value="lips">Lips</option>
            <option value="gums">Gums/Gingiva</option>
            <option value="oral-mucosa">Oral Mucosa (Mouth Lining)</option>
            <option value="multiple">Multiple Areas</option>
          </select>
        </div>

        {/* Condition Type */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Condition Type (check all that apply)
          </label>
          <div className="grid grid-cols-2 gap-2">
            <label className={conditionPill}>
              <input type="checkbox" checked={formData.isJawRelated}
                     onChange={(e) => handleChange('isJawRelated', e.target.checked)}
                     className="rounded border-gray-300 dark:border-gray-600" />
              <span className="text-sm text-gray-700 dark:text-gray-300">Jaw/Bone Issue</span>
            </label>
            <label className={conditionPill}>
              <input type="checkbox" checked={formData.isToothRelated}
                     onChange={(e) => handleChange('isToothRelated', e.target.checked)}
                     className="rounded border-gray-300 dark:border-gray-600" />
              <span className="text-sm text-gray-700 dark:text-gray-300">Tooth Loss/Damage</span>
            </label>
            <label className={conditionPill}>
              <input type="checkbox" checked={formData.isBoneRelated}
                     onChange={(e) => handleChange('isBoneRelated', e.target.checked)}
                     className="rounded border-gray-300 dark:border-gray-600" />
              <span className="text-sm text-gray-700 dark:text-gray-300">Bone Infection/Disease</span>
            </label>
            <label className={conditionPill}>
              <input type="checkbox" checked={formData.isProsthesisRelated}
                     onChange={(e) => handleChange('isProsthesisRelated', e.target.checked)}
                     className="rounded border-gray-300 dark:border-gray-600" />
              <span className="text-sm text-gray-700 dark:text-gray-300">Prosthesis/Denture Issue</span>
            </label>
          </div>
        </div>

        {/* ── Jaw symptoms ───────────────────────────────────────────────── */}
        {formData.isJawRelated && (
            <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700 space-y-4">
              <h4 className="font-medium text-gray-900 dark:text-gray-100">Jaw Symptoms</h4>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Jaw Pain Side</label>
                  <select value={formData.jawPainSide}
                          onChange={(e) => handleChange('jawPainSide', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100">
                    <option value="">Select side...</option>
                    <option value="left">Left</option>
                    <option value="right">Right</option>
                    <option value="bilateral">Both Sides (Bilateral)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Maximum Jaw Opening (if known)
                  </label>
                  <div className="flex gap-2">
                    <input type="number" value={formData.jawOpening}
                           onChange={(e) => handleChange('jawOpening', e.target.value)}
                           placeholder="35" min="0" max="60"
                           className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100" />
                    <span className="flex items-center text-sm text-gray-500 dark:text-gray-400">mm</span>
                  </div>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Normal: 35-50mm</p>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Jaw Pain Severity (0-10)
                </label>
                <input type="range" min="0" max="10"
                       value={formData.jawPainSeverity}
                       onChange={(e) => handleChange('jawPainSeverity', Number(e.target.value))}
                       className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer" />
                <div className="flex justify-between mt-1">
                  <span className="text-xs text-gray-500 dark:text-gray-400">No pain</span>
                  <span className="text-sm font-semibold text-amber-900 dark:text-amber-200">{formData.jawPainSeverity}/10</span>
                  <span className="text-xs text-gray-500 dark:text-gray-400">Worst pain</span>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Jaw Movement Issues</label>
                <div className="space-y-2">
                  {[
                    { field: 'jawLocking',   label: 'Jaw Locking/Stuck' },
                    { field: 'jawClicking',  label: 'Clicking/Popping Sounds' },
                    { field: 'jawDeviation', label: 'Jaw Deviation/Misalignment' },
                  ].map(({ field, label }) => (
                      <label key={field} className="flex items-center gap-2">
                        <input type="checkbox" checked={formData[field]}
                               onChange={(e) => handleChange(field, e.target.checked)}
                               className="rounded border-gray-300 dark:border-gray-600" />
                        <span className="text-sm text-gray-700 dark:text-gray-300">{label}</span>
                      </label>
                  ))}
                </div>
              </div>
            </div>
        )}

        {/* ── Bone issues ─────────────────────────────────────────────────── */}
        {formData.isBoneRelated && (
            <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700 space-y-4">
              <h4 className="font-medium text-gray-900 dark:text-gray-100">Bone/Structural Issues</h4>
              <div className="space-y-2">
                {[
                  { field: 'boneInfection', label: 'Bone Infection (Osteomyelitis)' },
                  { field: 'boneExposed',   label: 'Exposed Bone (Visible/Palpable)' },
                  { field: 'boneDrainage',  label: 'Drainage from Bone/Jaw' },
                ].map(({ field, label }) => (
                    <label key={field} className="flex items-center gap-2">
                      <input type="checkbox" checked={formData[field]}
                             onChange={(e) => handleChange(field, e.target.checked)}
                             className="rounded border-gray-300 dark:border-gray-600" />
                      <span className="text-sm text-gray-700 dark:text-gray-300">{label}</span>
                    </label>
                ))}
              </div>
              {formData.boneInfection && (
                  <div className="bg-red-50 dark:bg-red-900/20 p-3 rounded-lg">
                    <p className="text-sm text-red-800 dark:text-red-200">
                      ⚠️ Osteomyelitis is serious — rated under DC 5000 (bone infection). Document all treatment, antibiotics, and surgical interventions.
                    </p>
                  </div>
              )}
            </div>
        )}

        {/* ── Tooth loss ──────────────────────────────────────────────────── */}
        {formData.isToothRelated && (
            <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700 space-y-4">
              <h4 className="font-medium text-gray-900 dark:text-gray-100">Tooth Loss Documentation</h4>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Number of Missing Teeth</label>
                <input type="number" value={formData.toothCount}
                       onChange={(e) => handleChange('toothCount', e.target.value)}
                       min="0" max="32" placeholder="0"
                       className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100" />
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Total count out of 32 adult teeth</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Location of Missing Teeth (select all that apply)
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {TOOTH_LOCATIONS.map(option => (
                      <label key={option.value} className="flex items-center gap-2">
                        <input type="checkbox"
                               checked={formData.toothLocation.includes(option.value)}
                               onChange={() => toggleToothLocation(option.value)}
                               className="rounded border-gray-300 dark:border-gray-600" />
                        <span className="text-sm text-gray-700 dark:text-gray-300">{option.label}</span>
                      </label>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Cause of Tooth Loss ⚠️ IMPORTANT
                </label>
                <select value={formData.toothLossCause}
                        onChange={(e) => handleChange('toothLossCause', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100">
                  <option value="">Select cause...</option>
                  <option value="bone-loss-trauma">Bone Loss from Trauma</option>
                  <option value="bone-loss-osteomyelitis">Bone Loss from Osteomyelitis</option>
                  <option value="bone-loss-disease">Bone Loss from Disease (e.g., cancer, radiation)</option>
                  <option value="periodontal">Periodontal Disease Only</option>
                  <option value="decay">Decay/Cavities Only</option>
                  <option value="unknown">Unknown/Multiple Causes</option>
                </select>
                <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg mt-2">
                  <p className="text-xs text-blue-800 dark:text-blue-200">
                    💡 VA only rates tooth loss if due to bone loss from trauma or disease (NOT periodontal disease alone). Document the underlying bone/jaw condition causing tooth loss.
                  </p>
                </div>
              </div>
            </div>
        )}

        {/* ── Prosthesis ──────────────────────────────────────────────────── */}
        {formData.isProsthesisRelated && (
            <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700 space-y-4">
              <h4 className="font-medium text-gray-900 dark:text-gray-100">Prosthesis/Denture Details</h4>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Type of Prosthesis</label>
                <select value={formData.prosthesisType}
                        onChange={(e) => handleChange('prosthesisType', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100">
                  <option value="">Select type...</option>
                  <option value="none">No Prosthesis</option>
                  <option value="partial-removable">Partial Denture (Removable)</option>
                  <option value="complete-upper">Complete Upper Denture</option>
                  <option value="complete-lower">Complete Lower Denture</option>
                  <option value="complete-both">Complete Dentures (Both)</option>
                  <option value="implants">Dental Implants</option>
                  <option value="bridge">Fixed Bridge</option>
                </select>
              </div>

              {formData.prosthesisType && formData.prosthesisType !== 'none' && (
                  <>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Does Prosthesis Restore Masticatory Function?
                      </label>
                      <div className="grid grid-cols-2 gap-2">
                        <button type="button"
                                onClick={() => handleChange('prosthesisFunction', 'restores')}
                                className={prosthesisBtnClass(formData.prosthesisFunction === 'restores')}>
                          Yes, Restores Function
                        </button>
                        <button type="button"
                                onClick={() => handleChange('prosthesisFunction', 'does-not-restore')}
                                className={prosthesisBtnClass(formData.prosthesisFunction === 'does-not-restore')}>
                          No, Does NOT Restore
                        </button>
                      </div>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                        Higher VA rating if prosthesis does NOT restore ability to chew
                      </p>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Prosthesis Fit</label>
                      <select value={formData.prosthesisFit}
                              onChange={(e) => handleChange('prosthesisFit', e.target.value)}
                              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100">
                        <option value="">Select fit quality...</option>
                        <option value="good">Good Fit</option>
                        <option value="acceptable">Acceptable Fit</option>
                        <option value="poor">Poor Fit</option>
                        <option value="ill-fitting">Ill-Fitting/Unusable</option>
                      </select>
                    </div>

                    <div className="space-y-2">
                      <label className="flex items-center gap-2">
                        <input type="checkbox" checked={formData.prosthesisPain}
                               onChange={(e) => handleChange('prosthesisPain', e.target.checked)}
                               className="rounded border-gray-300 dark:border-gray-600" />
                        <span className="text-sm text-gray-700 dark:text-gray-300">Pain from Prosthesis</span>
                      </label>
                    </div>
                  </>
              )}
            </div>
        )}

        {/* ── Palate ──────────────────────────────────────────────────────── */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Hard Palate Symptoms</label>
          <div className="space-y-2">
            {[
              { field: 'palatePain',      label: 'Palate Pain' },
              { field: 'palateUlcers',    label: 'Palate Ulcers/Sores' },
              { field: 'palateInfection', label: 'Palate Infection' },
            ].map(({ field, label }) => (
                <label key={field} className="flex items-center gap-2">
                  <input type="checkbox" checked={formData[field]}
                         onChange={(e) => handleChange(field, e.target.checked)}
                         className="rounded border-gray-300 dark:border-gray-600" />
                  <span className="text-sm text-gray-700 dark:text-gray-300">{label}</span>
                </label>
            ))}
          </div>
        </div>

        {/* ── Mastication/swallowing function ────────────────────────────── */}
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700 space-y-4">
          <h4 className="font-medium text-gray-900 dark:text-gray-100">Eating/Speaking Function</h4>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Chewing Difficulty</label>
              <select value={formData.chewingDifficulty}
                      onChange={(e) => handleChange('chewingDifficulty', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100">
                <option value="">Select level...</option>
                <option value="none">No Difficulty</option>
                <option value="mild">Mild Difficulty</option>
                <option value="moderate">Moderate Difficulty</option>
                <option value="severe">Severe Difficulty</option>
                <option value="unable">Unable to Chew</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Swallowing Difficulty</label>
              <select value={formData.swallowingDifficulty}
                      onChange={(e) => handleChange('swallowingDifficulty', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100">
                <option value="">Select level...</option>
                <option value="none">No Difficulty</option>
                <option value="mild">Mild Difficulty</option>
                <option value="moderate">Moderate Difficulty</option>
                <option value="severe">Severe Difficulty</option>
                <option value="unable">Unable to Swallow Solids</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Dietary Restrictions Due to Dental/Oral Condition
            </label>
            <select value={formData.dietaryRestrictions}
                    onChange={(e) => handleChange('dietaryRestrictions', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100">
              <option value="">Select dietary restrictions...</option>
              <option value="none">No Restrictions</option>
              <option value="semi-solid">Semi-solid Foods Required</option>
              <option value="soft">Soft Foods Required</option>
              <option value="puree">Pureed Foods Required</option>
              <option value="full-liquid">Full Liquid Diet Required</option>
            </select>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              Dietary restrictions increase VA rating for jaw/mouth conditions
            </p>
          </div>

          <div className="space-y-2">
            <label className="flex items-center gap-2">
              <input type="checkbox" checked={formData.speechDifficulty}
                     onChange={(e) => handleChange('speechDifficulty', e.target.checked)}
                     className="rounded border-gray-300 dark:border-gray-600" />
              <span className="text-sm text-gray-700 dark:text-gray-300">Speech/Articulation Difficulty</span>
            </label>
          </div>
        </div>

        {/* ── Neoplasm/tumor ──────────────────────────────────────────────── */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Neoplasm/Tumor/Growth
          </label>
          <label className="flex items-center gap-2">
            <input type="checkbox" checked={formData.oralMass}
                   onChange={(e) => handleChange('oralMass', e.target.checked)}
                   className="rounded border-gray-300 dark:border-gray-600" />
            <span className="text-sm text-gray-700 dark:text-gray-300">Oral Mass/Lump/Growth Present</span>
          </label>

          {formData.oralMass && (
              <div className="mt-3 space-y-3 bg-red-50 dark:bg-red-900/20 p-4 rounded-lg">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Mass Location</label>
                  <input type="text" value={formData.massLocation}
                         onChange={(e) => handleChange('massLocation', e.target.value)}
                         placeholder="e.g., left cheek, floor of mouth, tongue"
                         className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Biopsy Result</label>
                  <select value={formData.massBiopsy}
                          onChange={(e) => handleChange('massBiopsy', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100">
                    <option value="">Select result...</option>
                    <option value="benign">Benign (Non-cancerous)</option>
                    <option value="malignant">Malignant (Cancerous)</option>
                    <option value="pending">Biopsy Pending</option>
                    <option value="not-biopsied">Not Yet Biopsied</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Treatment Status</label>
                  <select value={formData.treatmentStatus}
                          onChange={(e) => handleChange('treatmentStatus', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100">
                    <option value="">Select status...</option>
                    <option value="none">No Treatment Yet</option>
                    <option value="active-treatment">Active Treatment (Chemo/Radiation)</option>
                    <option value="post-surgical">Post-Surgical</option>
                    <option value="surveillance">Surveillance/Monitoring</option>
                    <option value="recurrent">Recurrent After Treatment</option>
                  </select>
                </div>
                {formData.massBiopsy === 'malignant' && (
                    <div className="bg-red-100 dark:bg-red-900/30 p-3 rounded-lg">
                      <p className="text-sm text-red-800 dark:text-red-200 font-semibold">
                        ⚠️ Malignant oral neoplasms rate 100% during and for 6 months after treatment (DC 9918). Document all treatment dates and ongoing side effects.
                      </p>
                    </div>
                )}
              </div>
          )}
        </div>

        {/* ── Infection/inflammation ──────────────────────────────────────── */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Infection/Inflammation
          </label>
          <label className="flex items-center gap-2">
            <input type="checkbox" checked={formData.activeInfection}
                   onChange={(e) => handleChange('activeInfection', e.target.checked)}
                   className="rounded border-gray-300 dark:border-gray-600" />
            <span className="text-sm text-gray-700 dark:text-gray-300">Active Infection/Abscess</span>
          </label>

          {formData.activeInfection && (
              <div className="mt-3 space-y-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Type of Infection</label>
                  <input type="text" value={formData.infectionType}
                         onChange={(e) => handleChange('infectionType', e.target.value)}
                         placeholder="e.g., dental abscess, gum infection, jaw osteomyelitis"
                         className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100" />
                </div>
                <label className="flex items-center gap-2">
                  <input type="checkbox" checked={formData.antibioticUse}
                         onChange={(e) => handleChange('antibioticUse', e.target.checked)}
                         className="rounded border-gray-300 dark:border-gray-600" />
                  <span className="text-sm text-gray-700 dark:text-gray-300">Currently on Antibiotics</span>
                </label>
              </div>
          )}
        </div>

        {/* ── Impact on daily life ────────────────────────────────────────── */}
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
            Impact on Daily Activities
          </label>
          <div className="space-y-2">
            {[
              { field: 'eatingImpaired', label: 'Interferes with Eating/Nutrition' },
              { field: 'workMissed',     label: 'Caused Missed Work' },
              { field: 'socialImpact',   label: 'Affects Social Activities/Appearance' },
            ].map(({ field, label }) => (
                <label key={field} className="flex items-center gap-2">
                  <input type="checkbox" checked={formData[field]}
                         onChange={(e) => handleChange(field, e.target.checked)}
                         className="rounded border-gray-300 dark:border-gray-600" />
                  <span className="text-sm text-gray-700 dark:text-gray-300">{label}</span>
                </label>
            ))}
          </div>
        </div>
      </div>
  );
};

export default DentalForm;