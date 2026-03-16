// src/components/forms/SymptomForms/GynecologicalForm.jsx
// Phase 4: Gynecological condition-specific form
// Covers endometriosis, menstrual disorders, PCOS, PID, prolapse, sexual function
// Per 38 CFR Part 4, DC 7615 (PCOS), DC 7699 (other gyn conditions)
//
// Props:
//   initialData      — gynecologicalData object from parent useState
//   onChange         — (fieldName, value) => void — parent owns state
//   selectedSymptom  — string — needed for sub-section conditional rendering

import React, { useState, useEffect } from 'react';

export const INITIAL_GYNECOLOGICAL_DATA = {
  affectedOrgan: '',              // vulva | vagina | cervix | uterus | fallopian-tube | ovary | multiple
  painType: '',                   // chronic-pelvic | dysmenorrhea | dyspareunia | ovulation | other
  painSeverity: 5,
  painLocation: '',
  painDuration: '',
  // Endometriosis
  endometriosisDiagnosed: false,
  laparoscopyConfirmed: false,
  laparoscopyDate: '',
  lesionLocations: [],            // Bowel | Bladder | Ovaries | Peritoneum | Uterosacral | Other
  treatmentType: '',              // hormonal | surgical | pain-management | none
  treatmentEffectiveness: '',     // controlled | partially-controlled | not-controlled
  bowelSymptoms: false,
  bladderSymptoms: false,
  // Menstrual disorders
  cycleRegularity: '',            // regular | irregular | absent
  cycleLength: '',
  flowHeaviness: '',              // spotting | light | moderate | heavy | very-heavy
  flowDuration: '',
  dysmenorrheaSeverity: '',       // none | mild | moderate | severe
  intermenstrualBleeding: false,
  // PCOS (DC 7615)
  pcosDiagnosed: false,
  pcosSymptoms: [],               // Irregular Periods | Hirsutism | Acne | Weight Gain | Ovarian Cysts | Insulin Resistance
  rotterdamCriteriaMet: '',       // 2-of-3 | 3-of-3 | not-assessed
  // PID
  pidDiagnosed: false,
  pidType: '',                    // acute | chronic
  recurrentInfections: false,
  numberOfEpisodes: '',
  lastEpisodeDate: '',
  // Prolapse
  prolapseDiagnosed: false,
  prolapseType: '',               // cystocele | rectocele | uterine | vault | enterocele | multiple
  popStage: '',                   // 0 | 1 | 2 | 3 | 4
  prolapseTreatment: '',          // none | pessary | pt | surgical
  // Sexual function
  sexualDysfunction: false,
  arousalDifficulty: false,
  libidoDecreased: false,
  // Impact & treatment
  interferesDailyActivities: false,
  workMissed: false,
  continuousTreatmentRequired: false,
  treatmentMedications: [],
};

const GynecologicalForm = ({ initialData, onChange, selectedSymptom }) => {
  const [formData, setFormData] = useState(
      initialData ?? { ...INITIAL_GYNECOLOGICAL_DATA }
  );

  useEffect(() => {
    setFormData(initialData ?? { ...INITIAL_GYNECOLOGICAL_DATA });
  }, [initialData]);

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    onChange(field, value);
  };

  const toggleItem = (field, item) => {
    const current = formData[field] ?? [];
    const updated = current.includes(item)
        ? current.filter(v => v !== item)
        : [...current, item];
    handleChange(field, updated);
  };

  const pill = (active) =>
      `flex items-center gap-2 p-2 rounded-lg border cursor-pointer ${
          active
              ? 'bg-rose-100 dark:bg-rose-900/50 border-rose-300 dark:border-rose-700'
              : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700'
      }`;

  const pillLg = (active) =>
      `flex items-center gap-2 p-3 rounded-lg border cursor-pointer ${
          active
              ? 'bg-rose-100 dark:bg-rose-900/50 border-rose-300 dark:border-rose-700'
              : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700'
      }`;

  const selectCls =
      'w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white';

  const inputCls =
      'w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white';

  // Sub-section visibility derived from symptom ID (same logic as parent)
  const showEndometriosis =
      formData.affectedOrgan === 'multiple' ||
      selectedSymptom?.includes('endometriosis');

  const showMenstrual =
      formData.affectedOrgan === 'ovary' ||
      selectedSymptom?.includes('menstrual') ||
      selectedSymptom?.includes('period') ||
      selectedSymptom?.includes('pcos') ||
      selectedSymptom?.includes('ovarian');

  const showPID =
      formData.affectedOrgan === 'fallopian-tube' ||
      selectedSymptom?.includes('pid');

  const showProlapse =
      formData.affectedOrgan === 'multiple' ||
      selectedSymptom?.includes('prolapse') ||
      selectedSymptom?.includes('pelvic-pressure') ||
      selectedSymptom?.includes('vaginal-bulge');

  const showSexual =
      selectedSymptom?.includes('sexual') ||
      selectedSymptom?.includes('arousal') ||
      selectedSymptom?.includes('libido') ||
      selectedSymptom?.includes('dyspareunia');

  return (
      <div className="space-y-4 p-4 bg-rose-50 dark:bg-rose-900/20 rounded-lg border border-rose-200 dark:border-rose-800">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-2xl">🌸</span>
          <h3 className="font-medium text-rose-900 dark:text-rose-200">Gynecological Details</h3>
        </div>

        {/* ── ALWAYS: Affected Organ & General Pain ──────────────────────── */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Affected Organ/System
          </label>
          <select
              value={formData.affectedOrgan}
              onChange={(e) => handleChange('affectedOrgan', e.target.value)}
              className={selectCls}
          >
            <option value="">Select organ/system</option>
            <option value="vulva">Vulva/Clitoris</option>
            <option value="vagina">Vagina</option>
            <option value="cervix">Cervix</option>
            <option value="uterus">Uterus</option>
            <option value="fallopian-tube">Fallopian Tube/PID</option>
            <option value="ovary">Ovary/PCOS</option>
            <option value="multiple">Multiple Organs (Endometriosis/Prolapse)</option>
          </select>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Pain Type
            </label>
            <select
                value={formData.painType}
                onChange={(e) => handleChange('painType', e.target.value)}
                className={selectCls}
            >
              <option value="">Select pain type</option>
              <option value="chronic-pelvic">Chronic Pelvic Pain</option>
              <option value="dysmenorrhea">Menstrual Pain (Dysmenorrhea)</option>
              <option value="dyspareunia">Pain with Intercourse (Dyspareunia)</option>
              <option value="ovulation">Ovulation Pain (Mittelschmerz)</option>
              <option value="other">Other Gynecological Pain</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Pain Location
            </label>
            <select
                value={formData.painLocation}
                onChange={(e) => handleChange('painLocation', e.target.value)}
                className={selectCls}
            >
              <option value="">Select location</option>
              <option value="lower-abdomen">Lower Abdomen</option>
              <option value="pelvic-center">Central Pelvis</option>
              <option value="left-side">Left Side</option>
              <option value="right-side">Right Side</option>
              <option value="deep-pelvis">Deep Pelvic</option>
              <option value="vaginal">Vaginal</option>
            </select>
          </div>
        </div>

        {/* ── ENDOMETRIOSIS ──────────────────────────────────────────────── */}
        {showEndometriosis && (
            <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border-l-4 border-rose-500">
              <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-3">Endometriosis</h4>

              <label className={`${pillLg(formData.endometriosisDiagnosed)} mb-3`}>
                <input
                    type="checkbox"
                    checked={formData.endometriosisDiagnosed}
                    onChange={(e) => handleChange('endometriosisDiagnosed', e.target.checked)}
                    className="w-4 h-4 text-rose-600 rounded"
                />
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Diagnosed Endometriosis
            </span>
              </label>

              {formData.endometriosisDiagnosed && (
                  <>
                    <label className={`${pillLg(formData.laparoscopyConfirmed)} mb-3`}>
                      <input
                          type="checkbox"
                          checked={formData.laparoscopyConfirmed}
                          onChange={(e) => handleChange('laparoscopyConfirmed', e.target.checked)}
                          className="w-4 h-4 text-rose-600 rounded"
                      />
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Confirmed by Laparoscopy (Required for VA)
                </span>
                    </label>

                    {formData.laparoscopyConfirmed && (
                        <div className="mb-3">
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Laparoscopy Date
                          </label>
                          <input
                              type="date"
                              value={formData.laparoscopyDate}
                              onChange={(e) => handleChange('laparoscopyDate', e.target.value)}
                              className={inputCls}
                          />
                        </div>
                    )}

                    <div className="mb-3">
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Lesion Locations
                      </label>
                      <div className="grid grid-cols-2 gap-2">
                        {['Bowel', 'Bladder', 'Ovaries', 'Peritoneum', 'Uterosacral', 'Other'].map(loc => (
                            <label key={loc} className={pill(formData.lesionLocations.includes(loc))}>
                              <input
                                  type="checkbox"
                                  checked={formData.lesionLocations.includes(loc)}
                                  onChange={() => toggleItem('lesionLocations', loc)}
                                  className="w-4 h-4 text-rose-600 rounded"
                              />
                              <span className="text-sm text-gray-700 dark:text-gray-300">{loc}</span>
                            </label>
                        ))}
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 mb-3">
                      <label className={pillLg(formData.bowelSymptoms)}>
                        <input
                            type="checkbox"
                            checked={formData.bowelSymptoms}
                            onChange={(e) => handleChange('bowelSymptoms', e.target.checked)}
                            className="w-4 h-4 text-rose-600 rounded"
                        />
                        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Bowel Symptoms</span>
                      </label>

                      <label className={pillLg(formData.bladderSymptoms)}>
                        <input
                            type="checkbox"
                            checked={formData.bladderSymptoms}
                            onChange={(e) => handleChange('bladderSymptoms', e.target.checked)}
                            className="w-4 h-4 text-rose-600 rounded"
                        />
                        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Bladder Symptoms</span>
                      </label>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Treatment Type
                        </label>
                        <select
                            value={formData.treatmentType}
                            onChange={(e) => handleChange('treatmentType', e.target.value)}
                            className={selectCls}
                        >
                          <option value="">Select treatment</option>
                          <option value="hormonal">Hormonal (Birth control, GnRH)</option>
                          <option value="surgical">Surgical (Excision/Ablation)</option>
                          <option value="pain-management">Pain Management Only</option>
                          <option value="none">None</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Treatment Effectiveness
                        </label>
                        <select
                            value={formData.treatmentEffectiveness}
                            onChange={(e) => handleChange('treatmentEffectiveness', e.target.value)}
                            className={selectCls}
                        >
                          <option value="">Select effectiveness</option>
                          <option value="controlled">Controlled</option>
                          <option value="partially-controlled">Partially Controlled</option>
                          <option value="not-controlled">Not Controlled</option>
                        </select>
                      </div>
                    </div>
                  </>
              )}
            </div>
        )}

        {/* ── MENSTRUAL DISORDERS / PCOS ─────────────────────────────────── */}
        {showMenstrual && (
            <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border-l-4 border-rose-500">
              <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-3">Menstrual Disorders</h4>

              <div className="grid grid-cols-3 gap-4 mb-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Cycle Regularity
                  </label>
                  <select
                      value={formData.cycleRegularity}
                      onChange={(e) => handleChange('cycleRegularity', e.target.value)}
                      className={selectCls}
                  >
                    <option value="">Select regularity</option>
                    <option value="regular">Regular (21–35 days)</option>
                    <option value="irregular">Irregular (varies)</option>
                    <option value="absent">Absent (Amenorrhea)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Cycle Length (days)
                  </label>
                  <input
                      type="number" min="14" max="90"
                      value={formData.cycleLength}
                      onChange={(e) => handleChange('cycleLength', e.target.value)}
                      placeholder="28"
                      className={inputCls}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Flow Duration (days)
                  </label>
                  <input
                      type="number" min="1" max="14"
                      value={formData.flowDuration}
                      onChange={(e) => handleChange('flowDuration', e.target.value)}
                      placeholder="5"
                      className={inputCls}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Flow Heaviness
                  </label>
                  <select
                      value={formData.flowHeaviness}
                      onChange={(e) => handleChange('flowHeaviness', e.target.value)}
                      className={selectCls}
                  >
                    <option value="">Select heaviness</option>
                    <option value="spotting">Spotting Only</option>
                    <option value="light">Light</option>
                    <option value="moderate">Moderate</option>
                    <option value="heavy">Heavy (Menorrhagia)</option>
                    <option value="very-heavy">Very Heavy (Soaking Through)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Dysmenorrhea Severity
                  </label>
                  <select
                      value={formData.dysmenorrheaSeverity}
                      onChange={(e) => handleChange('dysmenorrheaSeverity', e.target.value)}
                      className={selectCls}
                  >
                    <option value="">Select severity</option>
                    <option value="none">None</option>
                    <option value="mild">Mild (manageable)</option>
                    <option value="moderate">Moderate (interferes with activities)</option>
                    <option value="severe">Severe (incapacitating)</option>
                  </select>
                </div>
              </div>

              <label className={`${pillLg(formData.intermenstrualBleeding)} mb-3`}>
                <input
                    type="checkbox"
                    checked={formData.intermenstrualBleeding}
                    onChange={(e) => handleChange('intermenstrualBleeding', e.target.checked)}
                    className="w-4 h-4 text-rose-600 rounded"
                />
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Intermenstrual Bleeding (Spotting Between Periods)
            </span>
              </label>

              {/* PCOS sub-section */}
              <div className="bg-rose-50 dark:bg-rose-900/30 p-3 rounded-lg mt-3">
                <label className={`${pillLg(formData.pcosDiagnosed)} mb-3`}>
                  <input
                      type="checkbox"
                      checked={formData.pcosDiagnosed}
                      onChange={(e) => handleChange('pcosDiagnosed', e.target.checked)}
                      className="w-4 h-4 text-rose-600 rounded"
                  />
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                PCOS Diagnosed (rated under DC 7615)
              </span>
                </label>

                {formData.pcosDiagnosed && (
                    <>
                      <div className="mb-3">
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          PCOS Symptoms Present
                        </label>
                        <div className="grid grid-cols-2 gap-2">
                          {['Irregular Periods', 'Hirsutism', 'Acne', 'Weight Gain', 'Ovarian Cysts', 'Insulin Resistance'].map(s => (
                              <label key={s} className={pill(formData.pcosSymptoms.includes(s))}>
                                <input
                                    type="checkbox"
                                    checked={formData.pcosSymptoms.includes(s)}
                                    onChange={() => toggleItem('pcosSymptoms', s)}
                                    className="w-4 h-4 text-rose-600 rounded"
                                />
                                <span className="text-sm text-gray-700 dark:text-gray-300">{s}</span>
                              </label>
                          ))}
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Rotterdam Criteria Met
                        </label>
                        <select
                            value={formData.rotterdamCriteriaMet}
                            onChange={(e) => handleChange('rotterdamCriteriaMet', e.target.value)}
                            className={selectCls}
                        >
                          <option value="">Select criteria</option>
                          <option value="2-of-3">2 of 3 Criteria (Diagnosis)</option>
                          <option value="3-of-3">All 3 Criteria</option>
                          <option value="not-assessed">Not Formally Assessed</option>
                        </select>
                      </div>
                    </>
                )}
              </div>
            </div>
        )}

        {/* ── PID ────────────────────────────────────────────────────────── */}
        {showPID && (
            <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border-l-4 border-rose-500">
              <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-3">
                Pelvic Inflammatory Disease
              </h4>

              <label className={`${pillLg(formData.pidDiagnosed)} mb-3`}>
                <input
                    type="checkbox"
                    checked={formData.pidDiagnosed}
                    onChange={(e) => handleChange('pidDiagnosed', e.target.checked)}
                    className="w-4 h-4 text-rose-600 rounded"
                />
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Diagnosed PID</span>
              </label>

              {formData.pidDiagnosed && (
                  <>
                    <div className="grid grid-cols-2 gap-4 mb-3">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          PID Type
                        </label>
                        <select
                            value={formData.pidType}
                            onChange={(e) => handleChange('pidType', e.target.value)}
                            className={selectCls}
                        >
                          <option value="">Select type</option>
                          <option value="acute">Acute Episode</option>
                          <option value="chronic">Chronic PID</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Last Episode Date
                        </label>
                        <input
                            type="date"
                            value={formData.lastEpisodeDate}
                            onChange={(e) => handleChange('lastEpisodeDate', e.target.value)}
                            className={inputCls}
                        />
                      </div>
                    </div>

                    <label className={`${pillLg(formData.recurrentInfections)} mb-3`}>
                      <input
                          type="checkbox"
                          checked={formData.recurrentInfections}
                          onChange={(e) => handleChange('recurrentInfections', e.target.checked)}
                          className="w-4 h-4 text-rose-600 rounded"
                      />
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Recurrent Infections
                </span>
                    </label>

                    {formData.recurrentInfections && (
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Number of Episodes (past year)
                          </label>
                          <input
                              type="number" min="1" max="20"
                              value={formData.numberOfEpisodes}
                              onChange={(e) => handleChange('numberOfEpisodes', e.target.value)}
                              placeholder="2"
                              className={inputCls}
                          />
                        </div>
                    )}
                  </>
              )}
            </div>
        )}

        {/* ── PELVIC ORGAN PROLAPSE ──────────────────────────────────────── */}
        {showProlapse && (
            <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border-l-4 border-rose-500">
              <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-3">
                Pelvic Organ Prolapse
              </h4>

              <label className={`${pillLg(formData.prolapseDiagnosed)} mb-3`}>
                <input
                    type="checkbox"
                    checked={formData.prolapseDiagnosed}
                    onChange={(e) => handleChange('prolapseDiagnosed', e.target.checked)}
                    className="w-4 h-4 text-rose-600 rounded"
                />
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Pelvic Organ Prolapse Diagnosed
            </span>
              </label>

              {formData.prolapseDiagnosed && (
                  <>
                    <div className="grid grid-cols-2 gap-4 mb-3">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Prolapse Type
                        </label>
                        <select
                            value={formData.prolapseType}
                            onChange={(e) => handleChange('prolapseType', e.target.value)}
                            className={selectCls}
                        >
                          <option value="">Select type</option>
                          <option value="cystocele">Cystocele (Bladder)</option>
                          <option value="rectocele">Rectocele (Rectum)</option>
                          <option value="uterine">Uterine Prolapse</option>
                          <option value="vault">Vaginal Vault Prolapse</option>
                          <option value="enterocele">Enterocele (Small Bowel)</option>
                          <option value="multiple">Multiple Types</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          POP-Q Stage
                        </label>
                        <select
                            value={formData.popStage}
                            onChange={(e) => handleChange('popStage', e.target.value)}
                            className={selectCls}
                        >
                          <option value="">Select stage</option>
                          <option value="0">Stage 0 (No prolapse)</option>
                          <option value="1">Stage I (Mild – above hymen)</option>
                          <option value="2">Stage II (Moderate – at hymen)</option>
                          <option value="3">Stage III (Severe – below hymen)</option>
                          <option value="4">Stage IV (Complete eversion)</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Current Treatment
                      </label>
                      <select
                          value={formData.prolapseTreatment}
                          onChange={(e) => handleChange('prolapseTreatment', e.target.value)}
                          className={selectCls}
                      >
                        <option value="">Select treatment</option>
                        <option value="none">None</option>
                        <option value="pessary">Pessary</option>
                        <option value="pt">Pelvic Floor Physical Therapy</option>
                        <option value="surgical">Surgical Repair (Post-op)</option>
                      </select>
                    </div>
                  </>
              )}
            </div>
        )}

        {/* ── SEXUAL FUNCTION ────────────────────────────────────────────── */}
        {showSexual && (
            <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border-l-4 border-rose-500">
              <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-3">Sexual Function</h4>

              <div className="grid grid-cols-3 gap-3">
                <label className={pillLg(formData.sexualDysfunction)}>
                  <input
                      type="checkbox"
                      checked={formData.sexualDysfunction}
                      onChange={(e) => handleChange('sexualDysfunction', e.target.checked)}
                      className="w-4 h-4 text-rose-600 rounded"
                  />
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Sexual Dysfunction</span>
                </label>

                <label className={pillLg(formData.arousalDifficulty)}>
                  <input
                      type="checkbox"
                      checked={formData.arousalDifficulty}
                      onChange={(e) => handleChange('arousalDifficulty', e.target.checked)}
                      className="w-4 h-4 text-rose-600 rounded"
                  />
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Arousal Difficulty</span>
                </label>

                <label className={pillLg(formData.libidoDecreased)}>
                  <input
                      type="checkbox"
                      checked={formData.libidoDecreased}
                      onChange={(e) => handleChange('libidoDecreased', e.target.checked)}
                      className="w-4 h-4 text-rose-600 rounded"
                  />
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Decreased Libido</span>
                </label>
              </div>
            </div>
        )}

        {/* ── ALWAYS: Impact & Treatment ─────────────────────────────────── */}
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border-l-4 border-rose-500">
          <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-3">Impact &amp; Treatment</h4>

          <div className="grid grid-cols-3 gap-3 mb-3">
            <label className={pillLg(formData.interferesDailyActivities)}>
              <input
                  type="checkbox"
                  checked={formData.interferesDailyActivities}
                  onChange={(e) => handleChange('interferesDailyActivities', e.target.checked)}
                  className="w-4 h-4 text-rose-600 rounded"
              />
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Interferes with Daily Activities
            </span>
            </label>

            <label className={pillLg(formData.workMissed)}>
              <input
                  type="checkbox"
                  checked={formData.workMissed}
                  onChange={(e) => handleChange('workMissed', e.target.checked)}
                  className="w-4 h-4 text-rose-600 rounded"
              />
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Missed Work</span>
            </label>

            <label className={pillLg(formData.continuousTreatmentRequired)}>
              <input
                  type="checkbox"
                  checked={formData.continuousTreatmentRequired}
                  onChange={(e) => handleChange('continuousTreatmentRequired', e.target.checked)}
                  className="w-4 h-4 text-rose-600 rounded"
              />
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Continuous Treatment Required
            </span>
            </label>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Treatment Medications (Optional)
            </label>
            <div className="grid grid-cols-2 gap-2">
              {['Birth Control Pills', 'GnRH Agonist', 'NSAIDs', 'Hormonal IUD', 'Aromatase Inhibitors', 'Pain Medication'].map(med => (
                  <label key={med} className={pill(formData.treatmentMedications.includes(med))}>
                    <input
                        type="checkbox"
                        checked={formData.treatmentMedications.includes(med)}
                        onChange={() => toggleItem('treatmentMedications', med)}
                        className="w-4 h-4 text-rose-600 rounded"
                    />
                    <span className="text-sm text-gray-700 dark:text-gray-300">{med}</span>
                  </label>
              ))}
            </div>
          </div>
        </div>
      </div>
  );
};

export default GynecologicalForm;