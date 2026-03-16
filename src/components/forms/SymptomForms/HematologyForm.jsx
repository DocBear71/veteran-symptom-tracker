// src/components/forms/SymptomForms/HematologyForm.jsx
// Phase 5: Eight named form exports covering hemic/lymphatic conditions.
// Constants live in HematologyDefaults.js (Vite Fast Refresh requirement).
//
// Exports:
//   AnemiaForm            — DC 7700 (Iron Def), DC 7709 (Aplastic), DC 7705 (Hemolytic)
//   SickleCellForm        — DC 7714
//   BleedingDisorderForm  — DC 7705/7703 (ITP, hemophilia, Von Willebrand)
//   InfectionForm         — Immune deficiency/recurrent infection tracking
//   LymphomaLeukemiaForm  — DC 7703 (Leukemia), DC 7715 (Lymphoma)
//   PolycythemiaForm      — DC 7707 (Polycythemia Vera)
//   TreatmentForm         — Cancer treatment side effects
//   B12DeficiencyForm     — DC 7716 (Pernicious Anemia)
//
// All props: { initialData, onChange }
// onChange: (fieldName, value) => void — parent owns state

import React, { useState, useEffect } from 'react';

// ─── Shared helpers ────────────────────────────────────────────────────────────

const selectCls =
    'w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100';

const inputCls =
    'w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100';

// Standard checkbox list used by many forms
const CheckboxList = ({ items, checked, onChange, cols = 1 }) => (
    <div className={cols === 2 ? 'grid grid-cols-2 gap-2' : 'space-y-2'}>
      {items.map(({ value, label }) => (
          <label key={value} className="flex items-center gap-2">
            <input
                type="checkbox"
                checked={checked.includes(value)}
                onChange={(e) => {
                  const next = e.target.checked
                      ? [...checked, value]
                      : checked.filter(v => v !== value);
                  onChange(next);
                }}
                className="rounded border-gray-300 dark:border-gray-600"
            />
            <span className="text-sm text-gray-700 dark:text-gray-300">{label}</span>
          </label>
      ))}
    </div>
);

// Shared useForm hook
const useForm = (initialData, defaults, onChange) => {
  const [formData, setFormData] = useState(initialData ?? { ...defaults });

  useEffect(() => {
    setFormData(initialData ?? { ...defaults });
  }, [initialData]);

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    onChange(field, value);
  };

  const toggleArray = (field, value) => {
    const current = formData[field] ?? [];
    const updated = current.includes(value)
        ? current.filter(v => v !== value)
        : [...current, value];
    handleChange(field, updated);
  };

  return { formData, handleChange, toggleArray };
};

// ─── Card wrapper ──────────────────────────────────────────────────────────────
const Card = ({ color, emoji, title, children }) => {
  const colors = {
    red: 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800 [&_h3]:text-red-900 dark:[&_h3]:text-red-100',
    purple: 'bg-purple-50 dark:bg-purple-900/20 border-purple-200 dark:border-purple-800 [&_h3]:text-purple-900 dark:[&_h3]:text-purple-100',
    orange: 'bg-orange-50 dark:bg-orange-900/20 border-orange-200 dark:border-orange-800 [&_h3]:text-orange-900 dark:[&_h3]:text-orange-100',
    amber: 'bg-amber-50 dark:bg-amber-900/20 border-amber-200 dark:border-amber-800 [&_h3]:text-amber-900 dark:[&_h3]:text-amber-100',
  };
  return (
      <div className={`rounded-lg p-4 space-y-4 border ${colors[color] ?? colors.red}`}>
        <h3 className="font-semibold flex items-center gap-2">
          {emoji} {title}
        </h3>
        {children}
      </div>
  );
};

// ─── AnemiaForm ───────────────────────────────────────────────────────────────

import {
  INITIAL_ANEMIA_DATA,
  INITIAL_SICKLE_CELL_DATA,
  INITIAL_BLEEDING_DISORDER_DATA,
  INITIAL_INFECTION_DATA,
  INITIAL_LYMPHOMA_LEUKEMIA_DATA,
  INITIAL_POLYCYTHEMIA_DATA,
  INITIAL_TREATMENT_DATA,
  INITIAL_B12_DEFICIENCY_DATA,
} from './HematologyDefaults.js';

export const AnemiaForm = ({ initialData, onChange }) => {
  const { formData, handleChange } = useForm(initialData, INITIAL_ANEMIA_DATA, onChange);

  return (
      <Card color="red" emoji="🩸" title="Anemia Details">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Type of Anemia</label>
          <select value={formData.type} onChange={(e) => handleChange('type', e.target.value)} className={selectCls}>
            <option value="">Select type...</option>
            <option value="iron-deficiency">Iron Deficiency Anemia</option>
            <option value="b12-deficiency">Pernicious Anemia/B12 Deficiency</option>
            <option value="folate-deficiency">Folate Deficiency</option>
            <option value="hemolytic">Acquired Hemolytic Anemia</option>
            <option value="aplastic">Aplastic Anemia</option>
            <option value="sickle-cell">Sickle Cell Anemia</option>
            <option value="other">Other/Unknown</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Symptom Severity</label>
          <select value={formData.severity} onChange={(e) => handleChange('severity', e.target.value)} className={selectCls}>
            <option value="">Select severity...</option>
            <option value="mild">Mild - Minimal functional impact</option>
            <option value="moderate">Moderate - Limits some activities</option>
            <option value="severe">Severe - Significantly limits daily activities</option>
            <option value="incapacitating">Incapacitating - Unable to work/function</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Current Treatment (select all that apply)</label>
          <CheckboxList
              items={[
                { value: 'oral-iron', label: 'Oral Iron Supplements' },
                { value: 'iv-iron', label: 'IV Iron Infusions' },
                { value: 'b12-injections', label: 'B12 Injections' },
                { value: 'b12-oral', label: 'Oral/Sublingual B12' },
                { value: 'folate-supplements', label: 'Folate Supplements' },
                { value: 'immunosuppressants', label: 'Immunosuppressive Therapy' },
                { value: 'growth-factors', label: 'Myeloid Growth Factors (G-CSF/GM-CSF)' },
                { value: 'dietary-only', label: 'Dietary Modification Only' },
                { value: 'transfusions', label: 'Blood Transfusions' },
              ]}
              checked={formData.treatment}
              onChange={(next) => handleChange('treatment', next)}
          />
        </div>

        {formData.treatment.includes('transfusions') && (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Transfusion Frequency</label>
                <select value={formData.transfusion_history} onChange={(e) => handleChange('transfusion_history', e.target.value)} className={selectCls}>
                  <option value="">Select frequency...</option>
                  <option value="weekly">Weekly or more</option>
                  <option value="monthly">Monthly</option>
                  <option value="quarterly">Every 3 months</option>
                  <option value="biannually">Every 6 months</option>
                  <option value="annually">Once per year</option>
                  <option value="one-time">One-time transfusion</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Date of Last Transfusion</label>
                <input type="date" value={formData.last_transfusion} onChange={(e) => handleChange('last_transfusion', e.target.value)} className={inputCls} />
              </div>
            </>
        )}
      </Card>
  );
};

// ─── SickleCellForm ───────────────────────────────────────────────────────────

export const SickleCellForm = ({ initialData, onChange }) => {
  const { formData, handleChange } = useForm(initialData, INITIAL_SICKLE_CELL_DATA, onChange);

  return (
      <Card color="red" emoji="🩸" title="Sickle Cell Crisis Details">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Type of Crisis</label>
          <select value={formData.crisis_type} onChange={(e) => handleChange('crisis_type', e.target.value)} className={selectCls}>
            <option value="">Select crisis type...</option>
            <option value="vaso-occlusive">Vaso-occlusive (Pain Crisis)</option>
            <option value="acute-chest">Acute Chest Syndrome</option>
            <option value="splenic-sequestration">Splenic Sequestration</option>
            <option value="aplastic">Aplastic Crisis</option>
            <option value="hemolytic">Hemolytic Crisis</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Pain Location (select all that apply)</label>
          <CheckboxList
              cols={2}
              items={[
                { value: 'bones', label: 'Bones' },
                { value: 'joints', label: 'Joints' },
                { value: 'chest', label: 'Chest' },
                { value: 'abdomen', label: 'Abdomen' },
                { value: 'back', label: 'Back' },
                { value: 'extremities', label: 'Arms/Legs' },
              ]}
              checked={formData.crisis_location}
              onChange={(next) => handleChange('crisis_location', next)}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Pain Severity (0–10)</label>
          <input
              type="range" min="0" max="10"
              value={formData.pain_severity}
              onChange={(e) => handleChange('pain_severity', e.target.value)}
              className="w-full"
          />
          <div className="flex justify-between text-xs text-gray-600 dark:text-gray-400">
            <span>0 (No pain)</span>
            <span className="font-semibold text-lg">{formData.pain_severity || '0'}</span>
            <span>10 (Worst)</span>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Crisis Duration</label>
          <select value={formData.crisis_duration} onChange={(e) => handleChange('crisis_duration', e.target.value)} className={selectCls}>
            <option value="">Select duration...</option>
            <option value="hours">Less than 24 hours</option>
            <option value="1-3-days">1–3 days</option>
            <option value="4-7-days">4–7 days</option>
            <option value="over-week">Over 1 week</option>
            <option value="ongoing">Ongoing</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Known Triggers (select all that apply)</label>
          <CheckboxList
              items={[
                { value: 'dehydration', label: 'Dehydration' },
                { value: 'cold', label: 'Cold Temperature' },
                { value: 'stress', label: 'Physical/Emotional Stress' },
                { value: 'infection', label: 'Infection' },
                { value: 'altitude', label: 'High Altitude' },
                { value: 'alcohol', label: 'Alcohol' },
                { value: 'unknown', label: 'Unknown Trigger' },
              ]}
              checked={formData.triggers}
              onChange={(next) => handleChange('triggers', next)}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Treatment Received (select all that apply)</label>
          <CheckboxList
              items={[
                { value: 'home-management', label: 'Home Management' },
                { value: 'er-visit', label: 'Emergency Room Visit' },
                { value: 'hospitalized', label: 'Hospitalized' },
                { value: 'iv-fluids', label: 'IV Fluids' },
                { value: 'pain-medication', label: 'Pain Medication' },
                { value: 'oxygen', label: 'Oxygen Therapy' },
                { value: 'blood-transfusion', label: 'Blood Transfusion' },
                { value: 'exchange-transfusion', label: 'Exchange Transfusion' },
              ]}
              checked={formData.treatment_received}
              onChange={(next) => handleChange('treatment_received', next)}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Hospitalizations in Past 12 Months</label>
          <select value={formData.hospitalizations_year} onChange={(e) => handleChange('hospitalizations_year', e.target.value)} className={selectCls}>
            <option value="">Select frequency...</option>
            <option value="0">0 hospitalizations</option>
            <option value="1-2">1–2 hospitalizations</option>
            <option value="3">3 hospitalizations</option>
            <option value="4-plus">4 or more hospitalizations</option>
          </select>
        </div>
      </Card>
  );
};

// ─── BleedingDisorderForm ─────────────────────────────────────────────────────

export const BleedingDisorderForm = ({ initialData, onChange }) => {
  const { formData, handleChange } = useForm(initialData, INITIAL_BLEEDING_DISORDER_DATA, onChange);

  return (
      <Card color="red" emoji="🩸" title="Bleeding Disorder Details">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Type of Bleeding Disorder</label>
          <select value={formData.disorder_type} onChange={(e) => handleChange('disorder_type', e.target.value)} className={selectCls}>
            <option value="">Select type...</option>
            <option value="thrombocytopenia">Immune Thrombocytopenia</option>
            <option value="hemophilia">Hemophilia</option>
            <option value="von-willebrand">Von Willebrand Disease</option>
            <option value="other">Other Bleeding Disorder</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Bleeding Sites (select all that apply)</label>
          <CheckboxList
              cols={2}
              items={[
                { value: 'nose', label: 'Nosebleeds' },
                { value: 'gums', label: 'Gum Bleeding' },
                { value: 'skin', label: 'Skin (Bruising/Petechiae)' },
                { value: 'gi', label: 'GI Bleeding' },
                { value: 'urinary', label: 'Urinary Tract' },
                { value: 'menstrual', label: 'Heavy Menstrual' },
                { value: 'joints', label: 'Joint Bleeding' },
                { value: 'intracranial', label: 'Intracranial' },
              ]}
              checked={formData.bleeding_site}
              onChange={(next) => handleChange('bleeding_site', next)}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Bleeding Episode Frequency</label>
          <select value={formData.bleeding_frequency} onChange={(e) => handleChange('bleeding_frequency', e.target.value)} className={selectCls}>
            <option value="">Select frequency...</option>
            <option value="daily">Daily</option>
            <option value="weekly">Weekly</option>
            <option value="monthly">Monthly</option>
            <option value="quarterly">Every 3 months</option>
            <option value="rare">Rare/Occasional</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Current Platelet Count (if known)</label>
          <input
              type="number"
              value={formData.platelet_count}
              onChange={(e) => handleChange('platelet_count', e.target.value)}
              placeholder="e.g., 50,000"
              className={inputCls}
          />
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Normal: 150,000–400,000 per μL</p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Current Treatment (select all that apply)</label>
          <CheckboxList
              items={[
                { value: 'steroids', label: 'Corticosteroids' },
                { value: 'immunoglobulins', label: 'IV Immunoglobulins (IVIG)' },
                { value: 'immunosuppressants', label: 'Immunosuppressants' },
                { value: 'tpo-agonists', label: 'TPO Receptor Agonists' },
                { value: 'platelet-transfusion', label: 'Platelet Transfusions' },
                { value: 'factor-replacement', label: 'Factor Replacement Therapy' },
                { value: 'splenectomy', label: 'Previous Splenectomy' },
                { value: 'monitoring-only', label: 'Monitoring Only' },
              ]}
              checked={formData.treatment}
              onChange={(next) => handleChange('treatment', next)}
          />
        </div>
      </Card>
  );
};

// ─── InfectionForm ────────────────────────────────────────────────────────────

export const InfectionForm = ({ initialData, onChange }) => {
  const { formData, handleChange } = useForm(initialData, INITIAL_INFECTION_DATA, onChange);

  return (
      <div className="bg-red-50 dark:bg-red-900/20 rounded-lg p-4 space-y-4 border border-red-200 dark:border-red-800">
        <h3 className="font-semibold text-red-900 dark:text-red-100 flex items-center gap-2">
          🦠 Infection Details
        </h3>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Type of Infection (select all that apply)</label>
          <CheckboxList
              items={[
                { value: 'respiratory', label: 'Respiratory (pneumonia, bronchitis)' },
                { value: 'uti', label: 'Urinary Tract Infection' },
                { value: 'skin', label: 'Skin/Soft Tissue Infection' },
                { value: 'oral', label: 'Oral/Dental Infection' },
                { value: 'sinus', label: 'Sinus Infection' },
                { value: 'gi', label: 'GI Infection' },
                { value: 'blood', label: 'Bloodstream Infection (Sepsis)' },
                { value: 'fungal', label: 'Fungal Infection' },
                { value: 'viral', label: 'Viral Infection' },
                { value: 'other', label: 'Other Infection' },
              ]}
              checked={formData.infection_type}
              onChange={(next) => handleChange('infection_type', next)}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Infection Frequency</label>
          <select value={formData.frequency} onChange={(e) => handleChange('frequency', e.target.value)} className={selectCls}>
            <option value="">Select frequency...</option>
            <option value="weekly">Weekly or more often</option>
            <option value="every-6-weeks">Every 6 weeks</option>
            <option value="every-3-months">Every 3 months</option>
            <option value="every-6-months">Every 6 months</option>
            <option value="yearly">Once per year</option>
            <option value="first-time">First time</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Severity</label>
          <select value={formData.severity} onChange={(e) => handleChange('severity', e.target.value)} className={selectCls}>
            <option value="">Select severity...</option>
            <option value="mild">Mild - Managed at home</option>
            <option value="moderate">Moderate - Doctor visit/antibiotics needed</option>
            <option value="severe">Severe - ER visit required</option>
            <option value="hospitalized">Required hospitalization</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Requires Hospitalization?</label>
          <select value={formData.requires_hospitalization} onChange={(e) => handleChange('requires_hospitalization', e.target.value)} className={selectCls}>
            <option value="">Select...</option>
            <option value="no">No hospitalization needed</option>
            <option value="yes-current">Currently hospitalized</option>
            <option value="yes-recent">Recently hospitalized</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Treatment (select all that apply)</label>
          <CheckboxList
              items={[
                { value: 'antibiotics-oral', label: 'Oral Antibiotics' },
                { value: 'antibiotics-iv', label: 'IV Antibiotics' },
                { value: 'antifungal', label: 'Antifungal Medication' },
                { value: 'antiviral', label: 'Antiviral Medication' },
                { value: 'prophylactic', label: 'Prophylactic Antibiotics' },
                { value: 'growth-factors', label: 'Growth Factors (G-CSF/GM-CSF)' },
                { value: 'ivig', label: 'IVIG (Immunoglobulin Therapy)' },
                { value: 'hospitalization', label: 'Hospitalization' },
              ]}
              checked={formData.treatment}
              onChange={(next) => handleChange('treatment', next)}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Immune Status</label>
          <select value={formData.immune_status} onChange={(e) => handleChange('immune_status', e.target.value)} className={selectCls}>
            <option value="">Select status...</option>
            <option value="normal">Normal immune function</option>
            <option value="neutropenia">Neutropenia (low white blood cells)</option>
            <option value="immunosuppressed">Immunosuppressed (medications)</option>
            <option value="bone-marrow">Post bone marrow/stem cell transplant</option>
            <option value="chemotherapy">During/after chemotherapy</option>
          </select>
        </div>
      </div>
  );
};

// ─── LymphomaLeukemiaForm ─────────────────────────────────────────────────────

export const LymphomaLeukemiaForm = ({ initialData, onChange }) => {
  const { formData, handleChange } = useForm(initialData, INITIAL_LYMPHOMA_LEUKEMIA_DATA, onChange);

  return (
      <Card color="purple" emoji="🎗️" title="Cancer/Lymphoma Details">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Diagnosis</label>
          <select value={formData.diagnosis} onChange={(e) => handleChange('diagnosis', e.target.value)} className={selectCls}>
            <option value="">Select diagnosis...</option>
            <option value="hodgkin">Hodgkin's Lymphoma</option>
            <option value="non-hodgkin">Non-Hodgkin's Lymphoma</option>
            <option value="cll">Chronic Lymphocytic Leukemia</option>
            <option value="cml">Chronic Myelogenous Leukemia</option>
            <option value="all">Acute Lymphoblastic Leukemia</option>
            <option value="aml">Acute Myeloid Leukemia</option>
            <option value="multiple-myeloma">Multiple Myeloma</option>
            <option value="plasmacytoma">Solitary Plasmacytoma</option>
            <option value="mds">Myelodysplastic Syndrome</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Stage (if known)</label>
          <select value={formData.stage} onChange={(e) => handleChange('stage', e.target.value)} className={selectCls}>
            <option value="">Select stage...</option>
            <option value="stage-1">Stage I (Early/Localized)</option>
            <option value="stage-2">Stage II (Limited Spread)</option>
            <option value="stage-3">Stage III (Advanced)</option>
            <option value="stage-4">Stage IV (Widespread)</option>
            <option value="early">Early Stage</option>
            <option value="advanced">Advanced Stage</option>
            <option value="unknown">Stage Unknown</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Treatment Status</label>
          <select value={formData.treatment_status} onChange={(e) => handleChange('treatment_status', e.target.value)} className={selectCls}>
            <option value="">Select status...</option>
            <option value="active-treatment">Active Treatment (100% rating)</option>
            <option value="remission">Complete Remission</option>
            <option value="partial-remission">Partial Remission</option>
            <option value="maintenance">Maintenance Therapy</option>
            <option value="surveillance">Surveillance Only</option>
            <option value="recurrence">Recurrence/Relapse</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Treatment Type (select all that apply)</label>
          <CheckboxList
              items={[
                { value: 'chemotherapy', label: 'Chemotherapy' },
                { value: 'radiation', label: 'Radiation Therapy' },
                { value: 'immunotherapy', label: 'Immunotherapy' },
                { value: 'targeted-therapy', label: 'Targeted Therapy' },
                { value: 'stem-cell', label: 'Stem Cell/Bone Marrow Transplant' },
                { value: 'car-t', label: 'CAR T-Cell Therapy' },
                { value: 'watch-wait', label: 'Watch and Wait' },
              ]}
              checked={formData.treatment_type}
              onChange={(next) => handleChange('treatment_type', next)}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Cycles Completed (if applicable)</label>
          <input
              type="text"
              value={formData.cycles_completed}
              onChange={(e) => handleChange('cycles_completed', e.target.value)}
              placeholder="e.g., 4 of 6"
              className={inputCls}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Current Side Effects (select all that apply)</label>
          <CheckboxList
              cols={2}
              items={[
                { value: 'fatigue', label: 'Fatigue' },
                { value: 'nausea', label: 'Nausea/Vomiting' },
                { value: 'neuropathy', label: 'Neuropathy' },
                { value: 'pain', label: 'Pain' },
                { value: 'infections', label: 'Frequent Infections' },
                { value: 'anemia', label: 'Anemia' },
                { value: 'bleeding', label: 'Bleeding Issues' },
                { value: 'weight-loss', label: 'Weight Loss' },
                { value: 'cognitive', label: 'Cognitive Changes' },
                { value: 'mouth-sores', label: 'Mouth Sores' },
              ]}
              checked={formData.side_effects}
              onChange={(next) => handleChange('side_effects', next)}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Date of Last Treatment</label>
          <input type="date" value={formData.last_treatment_date} onChange={(e) => handleChange('last_treatment_date', e.target.value)} className={inputCls} />
        </div>
      </Card>
  );
};

// ─── PolycythemiaForm ─────────────────────────────────────────────────────────

export const PolycythemiaForm = ({ initialData, onChange }) => {
  const { formData, handleChange } = useForm(initialData, INITIAL_POLYCYTHEMIA_DATA, onChange);

  return (
      <Card color="red" emoji="🔴" title="Myeloproliferative Disorder Details">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Diagnosis</label>
          <select value={formData.diagnosis} onChange={(e) => handleChange('diagnosis', e.target.value)} className={selectCls}>
            <option value="">Select diagnosis...</option>
            <option value="polycythemia-vera">Polycythemia Vera</option>
            <option value="essential-thrombocythemia">Essential Thrombocythemia</option>
            <option value="primary-myelofibrosis">Primary Myelofibrosis</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Current Treatment (select all that apply)</label>
          <CheckboxList
              items={[
                { value: 'phlebotomy', label: 'Phlebotomy/Therapeutic Bloodletting' },
                { value: 'hydroxyurea', label: 'Hydroxyurea (Myelosuppressive)' },
                { value: 'interferon', label: 'Interferon' },
                { value: 'jakafi', label: 'Ruxolitinib (Jakafi)' },
                { value: 'aspirin', label: 'Low-dose Aspirin' },
                { value: 'anagrelide', label: 'Anagrelide' },
                { value: 'other-chemo', label: 'Other Chemotherapy' },
              ]}
              checked={formData.treatment}
              onChange={(next) => handleChange('treatment', next)}
          />
        </div>

        {formData.treatment.includes('phlebotomy') && (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Phlebotomy Frequency</label>
                <select value={formData.phlebotomy_frequency} onChange={(e) => handleChange('phlebotomy_frequency', e.target.value)} className={selectCls}>
                  <option value="">Select frequency...</option>
                  <option value="weekly">Weekly or more</option>
                  <option value="6-plus-year">6 or more times per year</option>
                  <option value="4-5-year">4–5 times per year</option>
                  <option value="3-or-less">3 or fewer times per year</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Date of Last Phlebotomy</label>
                <input type="date" value={formData.last_phlebotomy} onChange={(e) => handleChange('last_phlebotomy', e.target.value)} className={inputCls} />
              </div>
            </>
        )}

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Medications for Blood Count Control (select all that apply)</label>
          <CheckboxList
              items={[
                { value: 'hydroxyurea-continuous', label: 'Continuous Hydroxyurea' },
                { value: 'interferon-continuous', label: 'Continuous Interferon' },
                { value: 'jakafi-continuous', label: 'Continuous JAK Inhibitor' },
                { value: 'intermittent-therapy', label: 'Intermittent Therapy' },
              ]}
              checked={formData.medications}
              onChange={(next) => handleChange('medications', next)}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Complications (select all that apply)</label>
          <CheckboxList
              cols={2}
              items={[
                { value: 'blood-clots', label: 'Blood Clots/Thrombosis' },
                { value: 'stroke', label: 'Stroke' },
                { value: 'heart-attack', label: 'Heart Attack' },
                { value: 'bleeding', label: 'Bleeding Episodes' },
                { value: 'gout', label: 'Gout' },
                { value: 'enlarged-spleen', label: 'Enlarged Spleen' },
                { value: 'itching', label: 'Severe Itching' },
                { value: 'headaches', label: 'Frequent Headaches' },
              ]}
              checked={formData.complications}
              onChange={(next) => handleChange('complications', next)}
          />
        </div>
      </Card>
  );
};

// ─── TreatmentForm ────────────────────────────────────────────────────────────

export const TreatmentForm = ({ initialData, onChange }) => {
  const { formData, handleChange } = useForm(initialData, INITIAL_TREATMENT_DATA, onChange);

  return (
      <Card color="orange" emoji="💊" title="Treatment Side Effects">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Treatment Type</label>
          <select value={formData.treatment_type} onChange={(e) => handleChange('treatment_type', e.target.value)} className={selectCls}>
            <option value="">Select treatment type...</option>
            <option value="chemotherapy">Chemotherapy</option>
            <option value="radiation">Radiation Therapy</option>
            <option value="immunotherapy">Immunotherapy</option>
            <option value="targeted-therapy">Targeted Therapy</option>
            <option value="hormone-therapy">Hormone Therapy</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Regimen/Protocol (if known)</label>
          <input
              type="text"
              value={formData.regimen}
              onChange={(e) => handleChange('regimen', e.target.value)}
              placeholder="e.g., R-CHOP, ABVD, etc."
              className={inputCls}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Current Cycle Number</label>
          <input
              type="text"
              value={formData.cycle_number}
              onChange={(e) => handleChange('cycle_number', e.target.value)}
              placeholder="e.g., Cycle 3 of 6"
              className={inputCls}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Side Effects Experiencing (select all that apply)</label>
          <CheckboxList
              cols={2}
              items={[
                { value: 'nausea', label: 'Nausea' },
                { value: 'vomiting', label: 'Vomiting' },
                { value: 'diarrhea', label: 'Diarrhea' },
                { value: 'constipation', label: 'Constipation' },
                { value: 'fatigue', label: 'Fatigue' },
                { value: 'neuropathy', label: 'Neuropathy' },
                { value: 'mouth-sores', label: 'Mouth Sores/Mucositis' },
                { value: 'hair-loss', label: 'Hair Loss' },
                { value: 'skin-changes', label: 'Skin Changes/Rash' },
                { value: 'appetite-loss', label: 'Loss of Appetite' },
                { value: 'cognitive', label: 'Cognitive Issues (Chemo Brain)' },
                { value: 'pain', label: 'Pain' },
              ]}
              checked={formData.side_effects}
              onChange={(next) => handleChange('side_effects', next)}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Overall Side Effect Severity</label>
          <select value={formData.severity} onChange={(e) => handleChange('severity', e.target.value)} className={selectCls}>
            <option value="">Select severity...</option>
            <option value="mild">Mild - Manageable</option>
            <option value="moderate">Moderate - Interferes with daily activities</option>
            <option value="severe">Severe - Requires intervention</option>
            <option value="life-threatening">Life-threatening</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Side Effect Management (select all that apply)</label>
          <CheckboxList
              items={[
                { value: 'anti-nausea', label: 'Anti-nausea Medications' },
                { value: 'pain-meds', label: 'Pain Medications' },
                { value: 'growth-factors', label: 'Growth Factors' },
                { value: 'steroids', label: 'Steroids' },
                { value: 'nutrition-support', label: 'Nutritional Support' },
                { value: 'hospitalization', label: 'Required Hospitalization' },
                { value: 'dose-reduction', label: 'Dose Reduction Needed' },
                { value: 'treatment-delay', label: 'Treatment Delay' },
              ]}
              checked={formData.management}
              onChange={(next) => handleChange('management', next)}
          />
        </div>
      </Card>
  );
};

// ─── B12DeficiencyForm ────────────────────────────────────────────────────────

export const B12DeficiencyForm = ({ initialData, onChange }) => {
  const { formData, handleChange } = useForm(initialData, INITIAL_B12_DEFICIENCY_DATA, onChange);

  const hasInjections =
      formData.treatment.includes('injections-weekly') ||
      formData.treatment.includes('injections-monthly');

  return (
      <Card color="amber" emoji="💊" title="B12 Deficiency/Pernicious Anemia Details">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Cause of Deficiency</label>
          <select value={formData.deficiency_cause} onChange={(e) => handleChange('deficiency_cause', e.target.value)} className={selectCls}>
            <option value="">Select cause...</option>
            <option value="pernicious-anemia">Pernicious Anemia</option>
            <option value="dietary">Dietary Deficiency</option>
            <option value="malabsorption">Malabsorption (Crohn's, celiac, etc.)</option>
            <option value="gastric-surgery">Post-gastric Surgery</option>
            <option value="medications">Medication-induced (Metformin, PPIs)</option>
            <option value="other">Other Cause</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Neurological Symptoms (select all that apply)</label>
          <CheckboxList
              items={[
                { value: 'numbness-tingling', label: 'Numbness/Tingling in Hands/Feet' },
                { value: 'balance-problems', label: 'Balance Problems' },
                { value: 'difficulty-walking', label: 'Difficulty Walking' },
                { value: 'weakness', label: 'Muscle Weakness' },
                { value: 'memory-problems', label: 'Memory Problems' },
                { value: 'confusion', label: 'Confusion/Disorientation' },
                { value: 'mood-changes', label: 'Mood Changes/Depression' },
                { value: 'vision-changes', label: 'Vision Changes' },
              ]}
              checked={formData.neurological_symptoms}
              onChange={(next) => handleChange('neurological_symptoms', next)}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Current Treatment (select all that apply)</label>
          <CheckboxList
              items={[
                { value: 'injections-weekly', label: 'B12 Injections (Weekly or more)' },
                { value: 'injections-monthly', label: 'B12 Injections (Monthly)' },
                { value: 'sublingual', label: 'Sublingual B12' },
                { value: 'high-dose-oral', label: 'High-dose Oral B12' },
                { value: 'nasal-spray', label: 'Nasal Spray/Gel' },
                { value: 'dietary-only', label: 'Dietary Modification Only' },
              ]}
              checked={formData.treatment}
              onChange={(next) => handleChange('treatment', next)}
          />
        </div>

        {hasInjections && (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Injection Frequency</label>
                <select value={formData.injection_frequency} onChange={(e) => handleChange('injection_frequency', e.target.value)} className={selectCls}>
                  <option value="">Select frequency...</option>
                  <option value="daily">Daily</option>
                  <option value="weekly">Weekly</option>
                  <option value="biweekly">Every 2 weeks</option>
                  <option value="monthly">Monthly</option>
                  <option value="as-needed">As needed for symptoms</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Date of Last Injection</label>
                <input type="date" value={formData.last_injection} onChange={(e) => handleChange('last_injection', e.target.value)} className={inputCls} />
              </div>
            </>
        )}

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Symptom Improvement with Treatment</label>
          <select value={formData.improvement_noted} onChange={(e) => handleChange('improvement_noted', e.target.value)} className={selectCls}>
            <option value="">Select improvement...</option>
            <option value="complete">Complete Resolution</option>
            <option value="significant">Significant Improvement</option>
            <option value="moderate">Moderate Improvement</option>
            <option value="minimal">Minimal Improvement</option>
            <option value="none">No Improvement (Residual Symptoms)</option>
          </select>
        </div>
      </Card>
  );
};