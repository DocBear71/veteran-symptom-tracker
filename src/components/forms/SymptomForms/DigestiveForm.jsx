// src/components/forms/SymptomForms/DigestiveForm.jsx
// Phase 10: Digestive condition-specific form
// Covers: DC 7312 (Cirrhosis), DC 7307/7304 (Gastritis/Peptic Ulcer),
//         DC 7347 (Chronic Pancreatitis), DC 7314 (Chronic Biliary Tract Disease)
//
// Props:
//   initialData      — digestiveData object from parent useState
//   onChange         — (fieldName, value) => void — parent owns state
//   selectedSymptom  — string — used internally to show the right subsection

import React, { useState, useEffect } from 'react';

export const INITIAL_DIGESTIVE_DATA = {
  // Cirrhosis specific (DC 7312)
  hasMeldScore: false,
  meldScore: '',
  hasAscites: false,
  ascitesSeverity: '',          // mild | moderate | severe
  hasEncephalopathy: false,
  encephalopathyGrade: '',      // 1 | 2 | 3 | 4
  hasVaricealBleed: false,
  onLactulose: false,
  onDiuretics: false,
  // Gastritis/Peptic Ulcer specific (DC 7307, rates as DC 7304)
  episodeDuration: '',          // 1 | 2 | 3 | 4-7 | 7+
  onDailyMedication: false,
  medicationType: '',           // ppi | h2-blocker | antacid | other
  hasGIBleeding: false,
  // Pancreatitis specific (DC 7347)
  painLocation: '',             // epigastric | mid-back | both
  onEnzymes: false,
  hasDietaryRestriction: false,
  dietaryRestrictionType: '',   // low-fat | clear-liquid | tube-feeding | tpn
  hasMaldigestion: false,
  // Biliary specific (DC 7314)
  attackWithNausea: false,
  attackWithVomiting: false,
  hadStrictureDilation: false,
  // General
  hospitalized: false,
  hospitalizationReason: '',
};

const DigestiveForm = ({ initialData, onChange, selectedSymptom }) => {
  const [formData, setFormData] = useState(
      initialData ?? { ...INITIAL_DIGESTIVE_DATA }
  );

  useEffect(() => {
    setFormData(initialData ?? { ...INITIAL_DIGESTIVE_DATA });
  }, [initialData]);

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    onChange(field, value);
  };

  const selectCls = 'w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600 text-gray-900 dark:text-white';

  // Reproduce the same sub-condition detection used in the parent
  const isCirrhosis =
      selectedSymptom?.startsWith('cirrhosis-') ||
      ['cirrhosis-fatigue', 'cirrhosis-ascites', 'cirrhosis-edema', 'cirrhosis-jaundice',
        'cirrhosis-encephalopathy', 'cirrhosis-variceal-bleed', 'cirrhosis-sbp',
        'cirrhosis-coagulopathy', 'cirrhosis-splenomegaly', 'cirrhosis-anorexia',
        'cirrhosis-malaise', 'cirrhosis-abdominal-pain', 'cirrhosis-itching',
        'cirrhosis-hospitalization'].includes(selectedSymptom);

  const isGastritis =
      selectedSymptom?.startsWith('gastritis-') ||
      ['gastritis-abdominal-pain', 'gastritis-nausea', 'gastritis-vomiting',
        'gastritis-bloating', 'gastritis-indigestion', 'gastritis-hematemesis',
        'gastritis-melena', 'gastritis-hospitalization'].includes(selectedSymptom);

  const isPancreatitis =
      selectedSymptom?.startsWith('pancreatitis-') ||
      ['pancreatitis-abdominal-pain', 'pancreatitis-back-pain', 'pancreatitis-nausea',
        'pancreatitis-vomiting', 'pancreatitis-maldigestion', 'pancreatitis-weight-loss',
        'pancreatitis-enzyme-use', 'pancreatitis-dietary-restriction',
        'pancreatitis-tube-feeding', 'pancreatitis-cyst',
        'pancreatitis-hospitalization'].includes(selectedSymptom);

  const isBiliary =
      selectedSymptom?.startsWith('biliary-') ||
      ['biliary-ruq-pain', 'biliary-nausea', 'biliary-vomiting', 'biliary-jaundice',
        'biliary-fever', 'biliary-dilation', 'biliary-attack'].includes(selectedSymptom);

  const Checkbox = ({ field, label }) => (
      <label className="flex items-center gap-2">
        <input
            type="checkbox"
            checked={formData[field]}
            onChange={(e) => handleChange(field, e.target.checked)}
            className="rounded"
        />
        <span className="text-sm text-gray-700 dark:text-gray-300">{label}</span>
      </label>
  );

  return (
      <div className="bg-amber-50 dark:bg-amber-900/20 p-4 rounded-lg border border-amber-200 dark:border-amber-800">
        <h4 className="font-medium text-amber-900 dark:text-amber-200 mb-3 flex items-center gap-2">
          🫁 Digestive Details
        </h4>

        {/* ── CIRRHOSIS (DC 7312) ─────────────────────────────────────────── */}
        {isCirrhosis && (
            <div className="space-y-3 mb-4">
              <div className="grid grid-cols-2 gap-3">
                <Checkbox field="hasAscites" label="Ascites present" />
                <Checkbox field="hasEncephalopathy" label="Encephalopathy/confusion" />
                <Checkbox field="hasVaricealBleed" label="Variceal bleeding" />
                <Checkbox field="onLactulose" label="Taking lactulose" />
                <Checkbox field="onDiuretics" label="Taking diuretics" />
              </div>

              {formData.hasAscites && (
                  <div>
                    <label className="block text-sm text-gray-600 dark:text-gray-400 mb-1">
                      Ascites Severity
                    </label>
                    <select
                        value={formData.ascitesSeverity}
                        onChange={(e) => handleChange('ascitesSeverity', e.target.value)}
                        className={selectCls}
                    >
                      <option value="">Select severity...</option>
                      <option value="mild">Mild (detectable on imaging only)</option>
                      <option value="moderate">Moderate (visible distension)</option>
                      <option value="severe">Severe (tense abdomen, requiring paracentesis)</option>
                    </select>
                  </div>
              )}
            </div>
        )}

        {/* ── GASTRITIS / PEPTIC ULCER (DC 7307 rates as DC 7304) ─────────── */}
        {isGastritis && (
            <div className="space-y-3 mb-4">
              <div>
                <label className="block text-sm text-gray-600 dark:text-gray-400 mb-1">
                  Episode Duration
                </label>
                <select
                    value={formData.episodeDuration}
                    onChange={(e) => handleChange('episodeDuration', e.target.value)}
                    className={selectCls}
                >
                  <option value="">Select duration...</option>
                  <option value="1">1 day</option>
                  <option value="2">2 days</option>
                  <option value="3">3 days (meets VA criteria)</option>
                  <option value="4-7">4–7 days</option>
                  <option value="7+">More than 7 days</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <Checkbox field="onDailyMedication" label="On daily medication" />
                <Checkbox field="hasGIBleeding" label="GI bleeding present" />
              </div>

              {formData.onDailyMedication && (
                  <div>
                    <label className="block text-sm text-gray-600 dark:text-gray-400 mb-1">
                      Medication Type
                    </label>
                    <select
                        value={formData.medicationType}
                        onChange={(e) => handleChange('medicationType', e.target.value)}
                        className={selectCls}
                    >
                      <option value="">Select type...</option>
                      <option value="ppi">PPI (Omeprazole, Pantoprazole, etc.)</option>
                      <option value="h2-blocker">H2 Blocker (Famotidine, Ranitidine)</option>
                      <option value="antacid">Antacid (Tums, Maalox)</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
              )}
            </div>
        )}

        {/* ── PANCREATITIS (DC 7347) ──────────────────────────────────────── */}
        {isPancreatitis && (
            <div className="space-y-3 mb-4">
              <div>
                <label className="block text-sm text-gray-600 dark:text-gray-400 mb-1">
                  Pain Location
                </label>
                <select
                    value={formData.painLocation}
                    onChange={(e) => handleChange('painLocation', e.target.value)}
                    className={selectCls}
                >
                  <option value="">Select location...</option>
                  <option value="epigastric">Epigastric (upper abdomen)</option>
                  <option value="mid-back">Mid-back</option>
                  <option value="both">Both epigastric and mid-back</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <Checkbox field="onEnzymes" label="Taking pancreatic enzymes" />
                <Checkbox field="hasMaldigestion" label="Maldigestion/steatorrhea" />
                <Checkbox field="hasDietaryRestriction" label="Dietary restriction required" />
              </div>

              {formData.hasDietaryRestriction && (
                  <div>
                    <label className="block text-sm text-gray-600 dark:text-gray-400 mb-1">
                      Diet Type
                    </label>
                    <select
                        value={formData.dietaryRestrictionType}
                        onChange={(e) => handleChange('dietaryRestrictionType', e.target.value)}
                        className={selectCls}
                    >
                      <option value="">Select diet...</option>
                      <option value="low-fat">Low-fat diet</option>
                      <option value="clear-liquid">Clear liquid diet</option>
                      <option value="tube-feeding">Tube feeding (enteral)</option>
                      <option value="tpn">TPN (total parenteral nutrition)</option>
                    </select>
                  </div>
              )}
            </div>
        )}

        {/* ── BILIARY TRACT (DC 7314) ─────────────────────────────────────── */}
        {isBiliary && (
            <div className="space-y-3 mb-4">
              <div className="grid grid-cols-2 gap-3 text-left">
                <Checkbox field="attackWithNausea" label="Nausea with attack" />
                <Checkbox field="attackWithVomiting" label="Vomiting with attack" />
                <Checkbox field="hadStrictureDilation" label="Had stricture dilation procedure" />
              </div>

              {formData.attackWithNausea && formData.attackWithVomiting && (
                  <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded text-sm text-green-700 dark:text-green-300">
                    ✓ This attack meets VA criteria (RUQ pain + nausea + vomiting)
                  </div>
              )}
            </div>
        )}

        {/* ── COMMON: Hospitalization ─────────────────────────────────────── */}
        <div className="pt-3 border-t border-amber-200 dark:border-amber-700">
          <Checkbox field="hospitalized" label="Hospitalized for this condition" />
        </div>
      </div>
  );
};

export default DigestiveForm;