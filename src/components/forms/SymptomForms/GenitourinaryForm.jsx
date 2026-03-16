// src/components/forms/SymptomForms/GenitourinaryForm.jsx
// Phase 3: Genitourinary condition-specific form
// Covers: DC 7508 (Kidney Stones), DC 7530 (Chronic Renal Disease),
//         DC 7512 (Chronic Cystitis/UTI), DC 7542 (Neurogenic Bladder),
//         DC 7518 (Urethral Stricture), DC 7527 (Prostate Conditions),
//         DC 7332 (Sphincter Impairment), DC 7522 (Erectile Dysfunction)
//
// Props:
//   initialData  — genitourinaryData object from parent useState
//   onChange     — (fieldName, value) => void — parent owns state
//
// Note: affectedSystem is auto-detected by a useEffect in the parent
// based on selectedSymptom — no prop needed here.

import React, { useState, useEffect } from 'react';

export const INITIAL_GENITOURINARY_DATA = {
  affectedSystem: '',        // kidney | bladder | prostate | reproductive | sphincter
  // Kidney/Renal
  kidneySymptoms: [],
  kidneyPainLocation: '',
  kidneyPainSeverity: 5,
  stoneEpisode: false,
  stonePassedToday: false,
  stoneSize: '',
  procedureRecent: '',
  procedureDate: '',
  dialysis: false,
  dialysisType: '',
  dialysisFrequency: '',
  // Voiding dysfunction
  voidingSymptoms: [],
  urinaryFrequency24h: '',
  nocturiaCount: '',
  incontinenceEpisode: false,
  incontinenceType: '',
  incontinenceLeakageAmount: '',
  padChangesRequired: '',
  catheterUse: false,
  catheterType: '',
  catheterizationsPerDay: '',
  uti: false,
  utiSymptoms: [],
  // Prostate
  prostateSymptoms: [],
  prostateScore: '',
  prostateMedications: [],
  // Sphincter/Bowel
  fecalIncontinenceEpisode: false,
  fecalIncontinenceFrequency: '',
  fecalIncontinenceType: '',
  fecalUrgency: false,
  bowelControlMethods: [],
  // Reproductive
  erectileDysfunction: false,
  edSeverity: '',
  testicular: false,
  testicularSymptoms: [],
  // Impact & Associations
  activitiesAffected: [],
  fluidRestriction: false,
  workMissed: false,
  associatedConditions: [],
  complications: [],
};

const GenitourinaryForm = ({ initialData, onChange }) => {
  const [formData, setFormData] = useState(
      initialData ?? { ...INITIAL_GENITOURINARY_DATA }
  );

  useEffect(() => {
    setFormData(initialData ?? { ...INITIAL_GENITOURINARY_DATA });
  }, [initialData]);

  // Single field update — bubbles to parent
  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    onChange(field, value);
  };

  // Toggle an item in an array field
  const toggleItem = (field, item) => {
    const current = formData[field] ?? [];
    const updated = current.includes(item)
        ? current.filter(v => v !== item)
        : [...current, item];
    handleChange(field, updated);
  };

  // Active pill style for checkbox toggles
  const pill = (active) =>
      `flex items-center gap-2 p-2 rounded-lg border cursor-pointer ${
          active
              ? 'bg-teal-100 dark:bg-teal-900/50 border-teal-300 dark:border-teal-700'
              : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700'
      }`;

  const pillLg = (active) =>
      `flex items-center gap-2 p-3 rounded-lg border cursor-pointer ${
          active
              ? 'bg-teal-100 dark:bg-teal-900/50 border-teal-300 dark:border-teal-700'
              : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700'
      }`;

  const selectCls =
      'w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white';

  const inputCls =
      'w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white';

  return (
      <div className="space-y-4 p-4 bg-teal-50 dark:bg-teal-900/20 rounded-lg border border-teal-200 dark:border-teal-800">
        <h3 className="font-medium text-teal-900 dark:text-teal-200">Genitourinary Details</h3>

        {/* ── KIDNEY / RENAL ─────────────────────────────────────────────── */}
        {formData.affectedSystem === 'kidney' && (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Kidney Symptoms
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {['Flank Pain', 'Hematuria', 'Oliguria', 'Polyuria', 'Nausea', 'Fatigue', 'Edema', 'Fever'].map(s => (
                      <label key={s} className={pill(formData.kidneySymptoms.includes(s))}>
                        <input
                            type="checkbox"
                            checked={formData.kidneySymptoms.includes(s)}
                            onChange={() => toggleItem('kidneySymptoms', s)}
                            className="w-4 h-4 text-teal-600 rounded"
                        />
                        <span className="text-sm text-gray-700 dark:text-gray-300">{s}</span>
                      </label>
                  ))}
                </div>
              </div>

              {formData.kidneySymptoms.includes('Flank Pain') && (
                  <>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Pain Location
                      </label>
                      <select
                          value={formData.kidneyPainLocation}
                          onChange={(e) => handleChange('kidneyPainLocation', e.target.value)}
                          className={selectCls}
                      >
                        <option value="">Select location</option>
                        <option value="left-flank">Left Flank</option>
                        <option value="right-flank">Right Flank</option>
                        <option value="bilateral">Both Flanks</option>
                        <option value="lower-back">Lower Back</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Pain Severity: {formData.kidneyPainSeverity}/10
                      </label>
                      <input
                          type="range" min="1" max="10"
                          value={formData.kidneyPainSeverity}
                          onChange={(e) => handleChange('kidneyPainSeverity', Number(e.target.value))}
                          className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                      />
                    </div>
                  </>
              )}

              <div className="grid grid-cols-2 gap-4">
                <label className={pillLg(formData.stoneEpisode)}>
                  <input
                      type="checkbox"
                      checked={formData.stoneEpisode}
                      onChange={(e) => handleChange('stoneEpisode', e.target.checked)}
                      className="w-4 h-4 text-teal-600 rounded"
                  />
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Kidney Stone Episode</span>
                </label>

                <label className={pillLg(formData.stonePassedToday)}>
                  <input
                      type="checkbox"
                      checked={formData.stonePassedToday}
                      onChange={(e) => handleChange('stonePassedToday', e.target.checked)}
                      className="w-4 h-4 text-teal-600 rounded"
                  />
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Passed Stone Today</span>
                </label>
              </div>

              {formData.stonePassedToday && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Stone Size (mm)
                    </label>
                    <input
                        type="number"
                        value={formData.stoneSize}
                        onChange={(e) => handleChange('stoneSize', e.target.value)}
                        placeholder="e.g., 4"
                        className={inputCls}
                    />
                  </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Recent Procedure
                </label>
                <select
                    value={formData.procedureRecent}
                    onChange={(e) => handleChange('procedureRecent', e.target.value)}
                    className={selectCls}
                >
                  <option value="">None</option>
                  <option value="lithotripsy">Lithotripsy (ESWL)</option>
                  <option value="ureteroscopy">Ureteroscopy</option>
                  <option value="stent-placed">Ureteral Stent Placed</option>
                  <option value="stent-removed">Stent Removed</option>
                  <option value="nephrostomy">Nephrostomy Tube</option>
                </select>
              </div>

              {formData.procedureRecent && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Procedure Date
                    </label>
                    <input
                        type="date"
                        value={formData.procedureDate}
                        onChange={(e) => handleChange('procedureDate', e.target.value)}
                        className={inputCls}
                    />
                  </div>
              )}

              <label className={pillLg(formData.dialysis)}>
                <input
                    type="checkbox"
                    checked={formData.dialysis}
                    onChange={(e) => handleChange('dialysis', e.target.checked)}
                    className="w-4 h-4 text-teal-600 rounded"
                />
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">On Dialysis</span>
              </label>

              {formData.dialysis && (
                  <>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Dialysis Type
                      </label>
                      <select
                          value={formData.dialysisType}
                          onChange={(e) => handleChange('dialysisType', e.target.value)}
                          className={selectCls}
                      >
                        <option value="">Select type</option>
                        <option value="hemodialysis">Hemodialysis</option>
                        <option value="peritoneal">Peritoneal Dialysis</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Frequency
                      </label>
                      <select
                          value={formData.dialysisFrequency}
                          onChange={(e) => handleChange('dialysisFrequency', e.target.value)}
                          className={selectCls}
                      >
                        <option value="">Select frequency</option>
                        <option value="three-times-week">3 times per week</option>
                        <option value="four-times-week">4 times per week</option>
                        <option value="daily">Daily</option>
                      </select>
                    </div>
                  </>
              )}
            </>
        )}

        {/* ── BLADDER / VOIDING ──────────────────────────────────────────── */}
        {formData.affectedSystem === 'bladder' && (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Voiding Symptoms
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {['Frequency', 'Urgency', 'Hesitancy', 'Weak Stream', 'Incomplete Emptying', 'Nocturia', 'Pain', 'Burning'].map(s => (
                      <label key={s} className={pill(formData.voidingSymptoms.includes(s))}>
                        <input
                            type="checkbox"
                            checked={formData.voidingSymptoms.includes(s)}
                            onChange={() => toggleItem('voidingSymptoms', s)}
                            className="w-4 h-4 text-teal-600 rounded"
                        />
                        <span className="text-sm text-gray-700 dark:text-gray-300">{s}</span>
                      </label>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Urinary Frequency (24h)
                  </label>
                  <input
                      type="number"
                      value={formData.urinaryFrequency24h}
                      onChange={(e) => handleChange('urinaryFrequency24h', e.target.value)}
                      placeholder="# of times"
                      className={inputCls}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Nocturia Count
                  </label>
                  <input
                      type="number"
                      value={formData.nocturiaCount}
                      onChange={(e) => handleChange('nocturiaCount', e.target.value)}
                      placeholder="# waking to void"
                      className={inputCls}
                  />
                </div>
              </div>

              <label className={pillLg(formData.incontinenceEpisode)}>
                <input
                    type="checkbox"
                    checked={formData.incontinenceEpisode}
                    onChange={(e) => handleChange('incontinenceEpisode', e.target.checked)}
                    className="w-4 h-4 text-teal-600 rounded"
                />
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Incontinence Episode Today
            </span>
              </label>

              {formData.incontinenceEpisode && (
                  <>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Incontinence Type
                      </label>
                      <select
                          value={formData.incontinenceType}
                          onChange={(e) => handleChange('incontinenceType', e.target.value)}
                          className={selectCls}
                      >
                        <option value="">Select type</option>
                        <option value="stress">Stress (coughing, sneezing)</option>
                        <option value="urge">Urge (sudden need)</option>
                        <option value="overflow">Overflow (retention)</option>
                        <option value="mixed">Mixed</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Leakage Amount
                      </label>
                      <select
                          value={formData.incontinenceLeakageAmount}
                          onChange={(e) => handleChange('incontinenceLeakageAmount', e.target.value)}
                          className={selectCls}
                      >
                        <option value="">Select amount</option>
                        <option value="drops">Drops only</option>
                        <option value="small">Small amount</option>
                        <option value="moderate">Moderate amount</option>
                        <option value="large">Large amount (complete voiding)</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Pad/Diaper Changes Required
                      </label>
                      <input
                          type="number"
                          value={formData.padChangesRequired}
                          onChange={(e) => handleChange('padChangesRequired', e.target.value)}
                          placeholder="# of changes today"
                          className={inputCls}
                      />
                    </div>
                  </>
              )}

              <label className={pillLg(formData.catheterUse)}>
                <input
                    type="checkbox"
                    checked={formData.catheterUse}
                    onChange={(e) => handleChange('catheterUse', e.target.checked)}
                    className="w-4 h-4 text-teal-600 rounded"
                />
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Using Catheter</span>
              </label>

              {formData.catheterUse && (
                  <>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Catheter Type
                      </label>
                      <select
                          value={formData.catheterType}
                          onChange={(e) => handleChange('catheterType', e.target.value)}
                          className={selectCls}
                      >
                        <option value="">Select type</option>
                        <option value="intermittent">Intermittent (self-cath)</option>
                        <option value="indwelling">Indwelling (Foley)</option>
                        <option value="suprapubic">Suprapubic</option>
                      </select>
                    </div>

                    {formData.catheterType === 'intermittent' && (
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Catheterizations Per Day
                          </label>
                          <input
                              type="number"
                              value={formData.catheterizationsPerDay}
                              onChange={(e) => handleChange('catheterizationsPerDay', e.target.value)}
                              placeholder="# of times"
                              className={inputCls}
                          />
                        </div>
                    )}
                  </>
              )}

              <label className={pillLg(formData.uti)}>
                <input
                    type="checkbox"
                    checked={formData.uti}
                    onChange={(e) => handleChange('uti', e.target.checked)}
                    className="w-4 h-4 text-teal-600 rounded"
                />
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">UTI Symptoms</span>
              </label>

              {formData.uti && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      UTI Symptoms
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      {['Burning', 'Fever', 'Cloudy Urine', 'Foul Odor', 'Blood', 'Pelvic Pain'].map(s => (
                          <label key={s} className={pill(formData.utiSymptoms.includes(s))}>
                            <input
                                type="checkbox"
                                checked={formData.utiSymptoms.includes(s)}
                                onChange={() => toggleItem('utiSymptoms', s)}
                                className="w-4 h-4 text-teal-600 rounded"
                            />
                            <span className="text-sm text-gray-700 dark:text-gray-300">{s}</span>
                          </label>
                      ))}
                    </div>
                  </div>
              )}
            </>
        )}

        {/* ── PROSTATE ───────────────────────────────────────────────────── */}
        {formData.affectedSystem === 'prostate' && (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Prostate Symptoms
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {['Weak Stream', 'Hesitancy', 'Frequency', 'Urgency', 'Nocturia', 'Incomplete Emptying', 'Dribbling', 'Pain'].map(s => (
                      <label key={s} className={pill(formData.prostateSymptoms.includes(s))}>
                        <input
                            type="checkbox"
                            checked={formData.prostateSymptoms.includes(s)}
                            onChange={() => toggleItem('prostateSymptoms', s)}
                            className="w-4 h-4 text-teal-600 rounded"
                        />
                        <span className="text-sm text-gray-700 dark:text-gray-300">{s}</span>
                      </label>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  IPSS Score (if known)
                  <span className="text-xs text-gray-500 ml-2">(0–35, higher = worse)</span>
                </label>
                <input
                    type="number"
                    value={formData.prostateScore}
                    onChange={(e) => handleChange('prostateScore', e.target.value)}
                    min="0" max="35"
                    placeholder="0-35"
                    className={inputCls}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Nocturia Count (times waking to void)
                </label>
                <input
                    type="number"
                    value={formData.nocturiaCount}
                    onChange={(e) => handleChange('nocturiaCount', e.target.value)}
                    placeholder="# of times"
                    className={inputCls}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Prostate Medications
                </label>
                <div className="space-y-2">
                  {['Alpha Blocker (Flomax, etc.)', '5-Alpha Reductase Inhibitor (Finasteride, etc.)'].map(med => (
                      <label key={med} className={pill(formData.prostateMedications.includes(med))}>
                        <input
                            type="checkbox"
                            checked={formData.prostateMedications.includes(med)}
                            onChange={() => toggleItem('prostateMedications', med)}
                            className="w-4 h-4 text-teal-600 rounded"
                        />
                        <span className="text-sm text-gray-700 dark:text-gray-300">{med}</span>
                      </label>
                  ))}
                </div>
              </div>
            </>
        )}

        {/* ── SPHINCTER / BOWEL ──────────────────────────────────────────── */}
        {formData.affectedSystem === 'sphincter' && (
            <>
              <label className={pillLg(formData.fecalIncontinenceEpisode)}>
                <input
                    type="checkbox"
                    checked={formData.fecalIncontinenceEpisode}
                    onChange={(e) => handleChange('fecalIncontinenceEpisode', e.target.checked)}
                    className="w-4 h-4 text-teal-600 rounded"
                />
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Fecal Incontinence Episode Today
            </span>
              </label>

              {formData.fecalIncontinenceEpisode && (
                  <>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Typical Frequency
                      </label>
                      <select
                          value={formData.fecalIncontinenceFrequency}
                          onChange={(e) => handleChange('fecalIncontinenceFrequency', e.target.value)}
                          className={selectCls}
                      >
                        <option value="">Select frequency</option>
                        <option value="daily">Daily</option>
                        <option value="weekly">Weekly</option>
                        <option value="monthly">Monthly</option>
                        <option value="rarely">Rarely</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Incontinence Type
                      </label>
                      <select
                          value={formData.fecalIncontinenceType}
                          onChange={(e) => handleChange('fecalIncontinenceType', e.target.value)}
                          className={selectCls}
                      >
                        <option value="">Select type</option>
                        <option value="solid">Solid stool</option>
                        <option value="liquid">Liquid stool</option>
                        <option value="gas-only">Gas only</option>
                        <option value="mixed">Mixed</option>
                      </select>
                    </div>
                  </>
              )}

              <label className={pillLg(formData.fecalUrgency)}>
                <input
                    type="checkbox"
                    checked={formData.fecalUrgency}
                    onChange={(e) => handleChange('fecalUrgency', e.target.checked)}
                    className="w-4 h-4 text-teal-600 rounded"
                />
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Bowel Urgency</span>
              </label>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Bowel Control Methods
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {['Medications', 'Dietary Changes', 'Scheduled BMs', 'Pads/Briefs'].map(m => (
                      <label key={m} className={pill(formData.bowelControlMethods.includes(m))}>
                        <input
                            type="checkbox"
                            checked={formData.bowelControlMethods.includes(m)}
                            onChange={() => toggleItem('bowelControlMethods', m)}
                            className="w-4 h-4 text-teal-600 rounded"
                        />
                        <span className="text-sm text-gray-700 dark:text-gray-300">{m}</span>
                      </label>
                  ))}
                </div>
              </div>
            </>
        )}

        {/* ── REPRODUCTIVE ───────────────────────────────────────────────── */}
        {formData.affectedSystem === 'reproductive' && (
            <>
              <label className={pillLg(formData.erectileDysfunction)}>
                <input
                    type="checkbox"
                    checked={formData.erectileDysfunction}
                    onChange={(e) => handleChange('erectileDysfunction', e.target.checked)}
                    className="w-4 h-4 text-teal-600 rounded"
                />
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Erectile Dysfunction</span>
              </label>

              {formData.erectileDysfunction && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Severity
                    </label>
                    <select
                        value={formData.edSeverity}
                        onChange={(e) => handleChange('edSeverity', e.target.value)}
                        className={selectCls}
                    >
                      <option value="">Select severity</option>
                      <option value="mild">Mild (occasional difficulty)</option>
                      <option value="moderate">Moderate (frequent difficulty)</option>
                      <option value="severe">Severe (usually unable)</option>
                      <option value="complete">Complete (always unable)</option>
                    </select>
                  </div>
              )}

              <label className={pillLg(formData.testicular)}>
                <input
                    type="checkbox"
                    checked={formData.testicular}
                    onChange={(e) => handleChange('testicular', e.target.checked)}
                    className="w-4 h-4 text-teal-600 rounded"
                />
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Testicular Symptoms</span>
              </label>

              {formData.testicular && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Testicular Symptoms
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      {['Pain', 'Swelling', 'Mass/Lump', 'Discomfort', 'Heaviness'].map(s => (
                          <label key={s} className={pill(formData.testicularSymptoms.includes(s))}>
                            <input
                                type="checkbox"
                                checked={formData.testicularSymptoms.includes(s)}
                                onChange={() => toggleItem('testicularSymptoms', s)}
                                className="w-4 h-4 text-teal-600 rounded"
                            />
                            <span className="text-sm text-gray-700 dark:text-gray-300">{s}</span>
                          </label>
                      ))}
                    </div>
                  </div>
              )}
            </>
        )}

        {/* ── COMMON FIELDS FOR ALL SYSTEMS ──────────────────────────────── */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Activities Affected
          </label>
          <div className="grid grid-cols-2 gap-2">
            {['Work', 'Sleep', 'Exercise', 'Social', 'Intimacy', 'Travel'].map(a => (
                <label key={a} className={pill(formData.activitiesAffected.includes(a))}>
                  <input
                      type="checkbox"
                      checked={formData.activitiesAffected.includes(a)}
                      onChange={() => toggleItem('activitiesAffected', a)}
                      className="w-4 h-4 text-teal-600 rounded"
                  />
                  <span className="text-sm text-gray-700 dark:text-gray-300">{a}</span>
                </label>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <label className={pillLg(formData.fluidRestriction)}>
            <input
                type="checkbox"
                checked={formData.fluidRestriction}
                onChange={(e) => handleChange('fluidRestriction', e.target.checked)}
                className="w-4 h-4 text-teal-600 rounded"
            />
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Limiting Fluids</span>
          </label>

          <label className={pillLg(formData.workMissed)}>
            <input
                type="checkbox"
                checked={formData.workMissed}
                onChange={(e) => handleChange('workMissed', e.target.checked)}
                className="w-4 h-4 text-teal-600 rounded"
            />
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Missed Work</span>
          </label>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Associated Conditions
          </label>
          <div className="grid grid-cols-2 gap-2">
            {['Diabetes', 'Hypertension', 'BPH', 'Neurogenic', 'Radiation Therapy', 'Spinal Injury'].map(c => (
                <label key={c} className={pill(formData.associatedConditions.includes(c))}>
                  <input
                      type="checkbox"
                      checked={formData.associatedConditions.includes(c)}
                      onChange={() => toggleItem('associatedConditions', c)}
                      className="w-4 h-4 text-teal-600 rounded"
                  />
                  <span className="text-sm text-gray-700 dark:text-gray-300">{c}</span>
                </label>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Complications
          </label>
          <div className="grid grid-cols-2 gap-2">
            {['Recurrent UTIs', 'Hydronephrosis', 'Renal Failure', 'Sepsis', 'Skin Breakdown'].map(c => (
                <label key={c} className={pill(formData.complications.includes(c))}>
                  <input
                      type="checkbox"
                      checked={formData.complications.includes(c)}
                      onChange={() => toggleItem('complications', c)}
                      className="w-4 h-4 text-teal-600 rounded"
                  />
                  <span className="text-sm text-gray-700 dark:text-gray-300">{c}</span>
                </label>
            ))}
          </div>
        </div>
      </div>
  );
};

export default GenitourinaryForm;