// src/components/forms/SymptomForms/MentalHealthForm.jsx
// Shared mental health condition forms used by SymptomLogger and EditLogModal.
// Covers: Depression, Bipolar, OCD, Adjustment Disorder, Eating Disorders
//         (Anorexia/Bulimia), Binge Eating, Dissociative, Acute Stress,
//         Personality Disorders, Somatic Symptom, Illness Anxiety,
//         Depersonalization, Cyclothymic
//
// Prop contract per sub-form: { initialData, onChange, [selectedSymptom] }
//   initialData — existing data object or empty defaults
//   onChange    — callback: (fieldName, value) => void
//   selectedSymptom — active symptom ID (only where needed for conditional sections)

import React, { useState, useEffect } from 'react';

// ── Default shapes ────────────────────────────────────────────────────────────

export const INITIAL_DEPRESSION_DATA = {
  depressedMood: false,
  anhedonia: false,
  worthlessness: false,
  excessiveGuilt: false,
  hopelessness: false,
  irritability: false,
  insomnia: false,
  hypersomnia: false,
  decreasedAppetite: false,
  increasedAppetite: false,
  fatigue: false,
  psychomotorAgitation: false,
  psychomotorRetardation: false,
  difficultyConcentrating: false,
  difficultyDeciding: false,
  memoryProblems: false,
  thoughtsOfDeath: false,
  unableToGetUp: false,
  calledOutWork: false,
  neglectedSelfCare: false,
  socialWithdrawal: false,
  unableToCompleteTasks: false,
  suicidalIdeation: false,
  trigger: '',
  episodeContext: '',
};

export const INITIAL_BIPOLAR_DATA = {
  episodeType: '',
  elevatedMood: false,
  irritableMood: false,
  increasedEnergy: false,
  decreasedSleep: false,
  moreTalkative: false,
  racingThoughts: false,
  distractibility: false,
  increasedActivity: false,
  riskyBehavior: false,
  grandiosity: false,
  depressedMood: false,
  anhedonia: false,
  fatigue: false,
  worthlessness: false,
  sleepHours: '',
  riskyBehaviors: [],
  unableToWork: false,
  relationshipConflicts: false,
  legalProblems: false,
  hospitalizationRequired: false,
  episodeDuration: '',
};

export const INITIAL_OCD_DATA = {
  contaminationFears: false,
  fearOfHarm: false,
  needForSymmetry: false,
  forbiddenThoughts: false,
  religiousObsessions: false,
  hoardingUrges: false,
  otherObsession: '',
  washingCleaning: false,
  checking: false,
  repeating: false,
  counting: false,
  ordering: false,
  mentalRituals: false,
  reassuranceSeeking: false,
  otherCompulsion: '',
  timeConsumed: '',
  distressLevel: 5,
  lateToAppointments: false,
  avoidedSituations: false,
  interferedRoutines: false,
  relationshipProblems: false,
  unableToComplete: false,
  trigger: '',
};

export const INITIAL_ADJUSTMENT_DISORDER_DATA = {
  stressor: '',
  stressorDate: '',
  daysSinceStressor: '',
  presentationType: '',
  tearfulness: false,
  hopelessness: false,
  worry: false,
  physicalTension: false,
  impulsiveBehaviors: false,
  aggression: false,
  ruleViolations: false,
  recklessBehavior: false,
  workDifficulty: false,
  relationshipProblems: false,
  socialWithdrawal: false,
  selfCareNeglect: false,
  unableToFulfillResponsibilities: false,
  symptomsImproving: null,
  stillAffectingFunctioning: null,
  context: '',
};

export const INITIAL_EATING_DISORDER_DATA = {
  currentWeight: '',
  expectedMinimumWeight: '',
  weightPercentage: '',
  incapacitatingEpisode: false,
  episodeDuration: '',
  hospitalized: false,
  hospitalizationReason: '',
  tubeFeeding: false,
  parenteralNutrition: false,
  bingeEpisode: false,
  purgingEpisode: false,
  compensatoryBehaviors: [],
  restrictedIntake: false,
};

export const INITIAL_BINGE_EATING_DATA = {
  bingeEpisode: false,
  lossOfControl: false,
  distressLevel: 5,
};

export const INITIAL_DISSOCIATIVE_DATA = {
  memoryGap: false,
  lostTime: false,
  durationAmount: '',
  durationUnit: '',
};

export const INITIAL_ACUTE_STRESS_DATA = {
  traumaDate: '',
  dissociativeSymptoms: false,
  avoidance: false,
};

export const INITIAL_PERSONALITY_DATA = {
  occupationalImpact: false,
  socialImpact: false,
};

export const INITIAL_SOMATIC_SYMPTOM_DATA = {
  painPreoccupation: false,
  excessiveHealthWorry: false,
  multipleSymptoms: false,
  frequentDoctorVisits: false,
  functionalImpairment: false,
};

export const INITIAL_ILLNESS_ANXIETY_DATA = {
  fearOfIllness: false,
  bodyChecking: false,
  reassuranceSeeking: false,
  appointmentAvoidance: false,
  healthDistress: false,
};

export const INITIAL_DEPERSONALIZATION_DATA = {
  detachment: false,
  unreality: false,
  robotAutopilot: false,
  distress: false,
};

export const INITIAL_CYCLOTHYMIC_DATA = {
  hypomanic: false,
  depressive: false,
  moodSwings: false,
  irritability: false,
};

// ── Shared hook ──────────────────────────────────────────────────────────────

function useSubForm(defaults, initialData, onChange) {
  const [data, setData] = useState({ ...defaults, ...initialData });
  useEffect(() => {
    setData({ ...defaults, ...initialData });
  }, [initialData]); // eslint-disable-line react-hooks/exhaustive-deps
  const handleChange = (field, value) => {
    setData(prev => ({ ...prev, [field]: value }));
    onChange(field, value);
  };
  return [data, handleChange];
}

// ── Reusable checkbox row ────────────────────────────────────────────────────

const CheckboxRow = ({ fieldKey, label, checked, onChange, colorClass = 'indigo' }) => (
    <label className={`flex items-center gap-2 p-2 rounded-lg border cursor-pointer ${
        checked
            ? `bg-${colorClass}-100 dark:bg-${colorClass}-900/50 border-${colorClass}-300 dark:border-${colorClass}-700`
            : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700'
    }`}>
      <input
          type="checkbox"
          checked={checked}
          onChange={e => onChange(fieldKey, e.target.checked)}
          className={`w-4 h-4 text-${colorClass}-600 rounded`}
      />
      <span className="text-sm text-gray-700 dark:text-gray-300">{label}</span>
    </label>
);

// ── Sub-form: Depression ─────────────────────────────────────────────────────

export const DepressionForm = ({ initialData = {}, onChange }) => {
  const [data, handleChange] = useSubForm(INITIAL_DEPRESSION_DATA, initialData, onChange);

  return (
      <div className="bg-indigo-50 dark:bg-indigo-900/30 p-4 rounded-lg border border-indigo-200 dark:border-indigo-800 space-y-4">
        <h3 className="font-medium text-indigo-900 dark:text-indigo-200">Depression Episode Details</h3>
        <p className="text-xs text-indigo-700 dark:text-indigo-300">Track mood, physical symptoms, and functional impact for VA claims evidence</p>

        {/* Mood Symptoms */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Mood Symptoms</label>
          <div className="grid grid-cols-1 gap-2">
            {[
              { key: 'depressedMood',    label: 'Depressed mood most of the day' },
              { key: 'anhedonia',        label: 'Loss of interest/pleasure (anhedonia)' },
              { key: 'worthlessness',    label: 'Feelings of worthlessness' },
              { key: 'excessiveGuilt',   label: 'Excessive guilt' },
              { key: 'hopelessness',     label: 'Hopelessness about future' },
              { key: 'irritability',     label: 'Irritability' },
            ].map(({ key, label }) => (
                <CheckboxRow key={key} fieldKey={key} label={label}
                             checked={data[key]} onChange={handleChange} colorClass="indigo" />
            ))}
          </div>
        </div>

        {/* Physical/Vegetative Symptoms */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Physical/Vegetative Symptoms</label>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            {[
              { key: 'insomnia',                label: 'Insomnia' },
              { key: 'hypersomnia',             label: 'Hypersomnia (sleeping too much)' },
              { key: 'decreasedAppetite',       label: 'Decreased appetite' },
              { key: 'increasedAppetite',       label: 'Increased appetite' },
              { key: 'fatigue',                 label: 'Fatigue/low energy' },
              { key: 'psychomotorAgitation',    label: 'Restlessness/agitation' },
              { key: 'psychomotorRetardation',  label: 'Slowed movements/speech' },
            ].map(({ key, label }) => (
                <CheckboxRow key={key} fieldKey={key} label={label}
                             checked={data[key]} onChange={handleChange} colorClass="indigo" />
            ))}
          </div>
        </div>

        {/* Cognitive Symptoms */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Cognitive Symptoms</label>
          <div className="grid grid-cols-1 gap-2">
            {[
              { key: 'difficultyConcentrating', label: 'Difficulty concentrating' },
              { key: 'difficultyDeciding',      label: 'Difficulty making decisions' },
              { key: 'memoryProblems',          label: 'Memory problems' },
              { key: 'thoughtsOfDeath',         label: 'Recurrent thoughts of death (not ideation)' },
            ].map(({ key, label }) => (
                <CheckboxRow key={key} fieldKey={key} label={label}
                             checked={data[key]} onChange={handleChange} colorClass="indigo" />
            ))}
          </div>
        </div>

        {/* Functional Impact */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Functional Impact</label>
          <div className="grid grid-cols-1 gap-2">
            {[
              { key: 'unableToGetUp',         label: 'Unable to get out of bed' },
              { key: 'calledOutWork',          label: 'Called out of work' },
              { key: 'neglectedSelfCare',      label: 'Neglected self-care (hygiene, eating)' },
              { key: 'socialWithdrawal',       label: 'Withdrew from social contact' },
              { key: 'unableToCompleteTasks',  label: 'Unable to complete daily tasks' },
            ].map(({ key, label }) => (
                <CheckboxRow key={key} fieldKey={key} label={label}
                             checked={data[key]} onChange={handleChange} colorClass="indigo" />
            ))}
          </div>
        </div>

        {/* Suicidal Ideation */}
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 p-3 rounded-lg">
          <label className="flex items-center gap-2">
            <input type="checkbox" checked={data.suicidalIdeation}
                   onChange={e => handleChange('suicidalIdeation', e.target.checked)}
                   className="w-4 h-4 text-red-600 rounded" />
            <span className="text-sm font-medium text-red-900 dark:text-red-200">Suicidal ideation present</span>
          </label>
          {data.suicidalIdeation && (
              <div className="mt-2 text-xs text-red-800 dark:text-red-300">
                <strong>Crisis Resources:</strong>
                <div>988 Suicide &amp; Crisis Lifeline: Call/text 988</div>
                <div>Veterans Crisis Line: Call 988, press 1 | Text 838255</div>
              </div>
          )}
        </div>

        {/* Trigger */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Trigger/Stressor (optional)</label>
          <input type="text" value={data.trigger}
                 onChange={e => handleChange('trigger', e.target.value)}
                 placeholder="What may have triggered this episode?"
                 className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white" />
        </div>

        {/* Episode Context */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Episode Context</label>
          <textarea value={data.episodeContext}
                    onChange={e => handleChange('episodeContext', e.target.value)}
                    placeholder="Describe how this episode is affecting you..."
                    rows="3"
                    className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white" />
        </div>

        <div className="bg-indigo-100 dark:bg-indigo-900/20 p-3 rounded text-xs text-gray-600 dark:text-gray-400">
          <strong>For VA Claims:</strong> MDD diagnosis requires 5+ symptoms including depressed mood or anhedonia, present most of the day, nearly every day for 2+ weeks.
        </div>
      </div>
  );
};

// ── Sub-form: Bipolar ────────────────────────────────────────────────────────

export const BipolarForm = ({ initialData = {}, onChange }) => {
  const [data, handleChange] = useSubForm(INITIAL_BIPOLAR_DATA, initialData, onChange);

  // Array field helper for riskyBehaviors
  const handleArrayToggle = (field, value, checked) => {
    const current = data[field] || [];
    const updated = checked ? [...current, value] : current.filter(v => v !== value);
    handleChange(field, updated);
  };

  return (
      <div className="bg-purple-50 dark:bg-purple-900/30 p-4 rounded-lg border border-purple-200 dark:border-purple-800 space-y-4">
        <h3 className="font-medium text-purple-900 dark:text-purple-200">Bipolar Episode Details</h3>
        <p className="text-xs text-purple-700 dark:text-purple-300">Track mood state, symptoms, and functional impact for VA claims evidence</p>

        {/* Episode Type */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Current Episode Type</label>
          <div className="grid grid-cols-2 gap-2">
            {[
              { value: 'manic',      label: 'Manic Episode' },
              { value: 'hypomanic',  label: 'Hypomanic Episode' },
              { value: 'depressive', label: 'Depressive Episode' },
              { value: 'mixed',      label: 'Mixed Features' },
            ].map(({ value, label }) => (
                <button key={value} type="button"
                        onClick={() => handleChange('episodeType', value)}
                        className={`p-2 rounded-lg border text-sm font-medium ${
                            data.episodeType === value
                                ? 'bg-purple-100 dark:bg-purple-900/50 border-purple-300 dark:border-purple-700 text-purple-900 dark:text-purple-200'
                                : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300'
                        }`}>
                  {label}
                </button>
            ))}
          </div>
        </div>

        {/* Manic/Hypomanic Symptoms */}
        {['manic', 'hypomanic', 'mixed'].includes(data.episodeType) && (
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Manic/Hypomanic Symptoms</label>
              <div className="grid grid-cols-1 gap-2">
                {[
                  { key: 'elevatedMood',      label: 'Elevated/euphoric mood' },
                  { key: 'irritableMood',     label: 'Irritable mood' },
                  { key: 'increasedEnergy',   label: 'Increased energy/activity' },
                  { key: 'decreasedSleep',    label: 'Decreased need for sleep' },
                  { key: 'moreTalkative',     label: 'More talkative than usual' },
                  { key: 'racingThoughts',    label: 'Racing thoughts/flight of ideas' },
                  { key: 'distractibility',   label: 'Distractibility' },
                  { key: 'increasedActivity', label: 'Increased goal-directed activity' },
                  { key: 'riskyBehavior',     label: 'Engaging in risky behaviors' },
                  { key: 'grandiosity',       label: 'Grandiosity/inflated self-esteem' },
                ].map(({ key, label }) => (
                    <CheckboxRow key={key} fieldKey={key} label={label}
                                 checked={data[key]} onChange={handleChange} colorClass="purple" />
                ))}
              </div>
            </div>
        )}

        {/* Depressive Symptoms */}
        {['depressive', 'mixed'].includes(data.episodeType) && (
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Depressive Symptoms</label>
              <div className="grid grid-cols-1 gap-2">
                {[
                  { key: 'depressedMood', label: 'Depressed mood' },
                  { key: 'anhedonia',     label: 'Loss of interest/pleasure' },
                  { key: 'fatigue',       label: 'Fatigue/low energy' },
                  { key: 'worthlessness', label: 'Feelings of worthlessness' },
                ].map(({ key, label }) => (
                    <CheckboxRow key={key} fieldKey={key} label={label}
                                 checked={data[key]} onChange={handleChange} colorClass="purple" />
                ))}
              </div>
            </div>
        )}

        {/* Sleep Hours */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Sleep Hours Last Night</label>
          <input type="number" value={data.sleepHours} min="0" max="24" step="0.5"
                 onChange={e => handleChange('sleepHours', e.target.value)}
                 placeholder="Hours of sleep"
                 className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white" />
        </div>

        {/* Risky Behaviors */}
        {['manic', 'hypomanic'].includes(data.episodeType) && (
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Risky Behaviors Today</label>
              <div className="grid grid-cols-1 gap-2">
                {['Excessive spending', 'Risky sexual behavior', 'Reckless driving', 'Substance use', 'Impulsive major decisions'].map(behavior => (
                    <label key={behavior} className={`flex items-center gap-2 p-2 rounded-lg border cursor-pointer ${
                        data.riskyBehaviors?.includes(behavior)
                            ? 'bg-purple-100 dark:bg-purple-900/50 border-purple-300 dark:border-purple-700'
                            : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700'
                    }`}>
                      <input type="checkbox"
                             checked={data.riskyBehaviors?.includes(behavior)}
                             onChange={e => handleArrayToggle('riskyBehaviors', behavior, e.target.checked)}
                             className="w-4 h-4 text-purple-600 rounded" />
                      <span className="text-sm text-gray-700 dark:text-gray-300">{behavior}</span>
                    </label>
                ))}
              </div>
            </div>
        )}

        {/* Functional Impact */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Functional Impact</label>
          <div className="grid grid-cols-1 gap-2">
            {[
              { key: 'unableToWork',             label: 'Unable to work/attend school' },
              { key: 'relationshipConflicts',     label: 'Relationship conflicts' },
              { key: 'legalProblems',             label: 'Legal problems' },
              { key: 'hospitalizationRequired',   label: 'Hospitalization required' },
            ].map(({ key, label }) => (
                <CheckboxRow key={key} fieldKey={key} label={label}
                             checked={data[key]} onChange={handleChange} colorClass="purple" />
            ))}
          </div>
        </div>

        {/* Episode Duration */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Episode Duration</label>
          <input type="text" value={data.episodeDuration}
                 onChange={e => handleChange('episodeDuration', e.target.value)}
                 placeholder="e.g., '3 days', '2 weeks'"
                 className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white" />
        </div>

        <div className="bg-purple-100 dark:bg-purple-900/20 p-3 rounded text-xs text-gray-600 dark:text-gray-400">
          <strong>For VA Claims:</strong> Manic episodes last 1+ week, hypomanic 4+ days. Document sleep patterns, risky behaviors, and functional impairment.
        </div>
      </div>
  );
};

// ── Sub-form: OCD ────────────────────────────────────────────────────────────

export const OCDForm = ({ initialData = {}, onChange }) => {
  const [data, handleChange] = useSubForm(INITIAL_OCD_DATA, initialData, onChange);

  return (
      <div className="bg-teal-50 dark:bg-teal-900/30 p-4 rounded-lg border border-teal-200 dark:border-teal-800 space-y-4">
        <h3 className="font-medium text-teal-900 dark:text-teal-200">OCD Episode Details</h3>
        <p className="text-xs text-teal-700 dark:text-teal-300">Track obsessions, compulsions, time consumed, and impact for VA claims evidence</p>

        {/* Obsession Types */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Obsession Types</label>
          <div className="grid grid-cols-1 gap-2">
            {[
              { key: 'contaminationFears',  label: 'Contamination fears' },
              { key: 'fearOfHarm',          label: 'Fear of harm to self/others' },
              { key: 'needForSymmetry',     label: 'Need for symmetry/exactness' },
              { key: 'forbiddenThoughts',   label: 'Forbidden/taboo thoughts' },
              { key: 'religiousObsessions', label: 'Religious obsessions' },
              { key: 'hoardingUrges',       label: 'Hoarding urges' },
            ].map(({ key, label }) => (
                <CheckboxRow key={key} fieldKey={key} label={label}
                             checked={data[key]} onChange={handleChange} colorClass="teal" />
            ))}
          </div>
          <input type="text" value={data.otherObsession}
                 onChange={e => handleChange('otherObsession', e.target.value)}
                 placeholder="Other obsession type..."
                 className="mt-2 w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm" />
        </div>

        {/* Compulsion Types */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Compulsion Types</label>
          <div className="grid grid-cols-1 gap-2">
            {[
              { key: 'washingCleaning',    label: 'Washing/cleaning' },
              { key: 'checking',           label: 'Checking' },
              { key: 'repeating',          label: 'Repeating actions' },
              { key: 'counting',           label: 'Counting' },
              { key: 'ordering',           label: 'Ordering/arranging' },
              { key: 'mentalRituals',      label: 'Mental rituals' },
              { key: 'reassuranceSeeking', label: 'Reassurance seeking' },
            ].map(({ key, label }) => (
                <CheckboxRow key={key} fieldKey={key} label={label}
                             checked={data[key]} onChange={handleChange} colorClass="teal" />
            ))}
          </div>
          <input type="text" value={data.otherCompulsion}
                 onChange={e => handleChange('otherCompulsion', e.target.value)}
                 placeholder="Other compulsion type..."
                 className="mt-2 w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm" />
        </div>

        {/* Time Consumed */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Time Consumed by Obsessions/Compulsions</label>
          <select value={data.timeConsumed}
                  onChange={e => handleChange('timeConsumed', e.target.value)}
                  className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white">
            <option value="">Select time...</option>
            <option value="<1hr">Less than 1 hour/day</option>
            <option value="1-3hr">1–3 hours/day</option>
            <option value="3-8hr">3–8 hours/day</option>
            <option value=">8hr">More than 8 hours/day</option>
            <option value="constant">Nearly constant</option>
          </select>
        </div>

        {/* Distress Level */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Distress Level: {data.distressLevel}/10
          </label>
          <input type="range" min="0" max="10" value={data.distressLevel}
                 onChange={e => handleChange('distressLevel', parseInt(e.target.value))}
                 className="w-full" />
          <div className="flex justify-between text-xs text-gray-500 mt-1">
            <span>No distress</span>
            <span>Extreme distress</span>
          </div>
        </div>

        {/* Functional Impact */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Functional Impact</label>
          <div className="grid grid-cols-1 gap-2">
            {[
              { key: 'lateToAppointments',  label: 'Late to work/appointments' },
              { key: 'avoidedSituations',   label: 'Avoided situations' },
              { key: 'interferedRoutines',  label: 'Interfered with daily routines' },
              { key: 'relationshipProblems',label: 'Family/relationship problems' },
              { key: 'unableToComplete',    label: 'Unable to complete tasks' },
            ].map(({ key, label }) => (
                <CheckboxRow key={key} fieldKey={key} label={label}
                             checked={data[key]} onChange={handleChange} colorClass="teal" />
            ))}
          </div>
        </div>

        {/* Trigger */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Trigger/Context</label>
          <input type="text" value={data.trigger}
                 onChange={e => handleChange('trigger', e.target.value)}
                 placeholder="What triggered these obsessions/compulsions?"
                 className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white" />
        </div>

        <div className="bg-teal-100 dark:bg-teal-900/20 p-3 rounded text-xs text-gray-600 dark:text-gray-400">
          <strong>For VA Claims:</strong> OCD diagnosis requires time-consuming obsessions/compulsions (1+ hour/day) causing significant distress or functional impairment.
        </div>
      </div>
  );
};

// ── Sub-form: Adjustment Disorder ────────────────────────────────────────────

export const AdjustmentDisorderForm = ({ initialData = {}, onChange }) => {
  const [data, handleChange] = useSubForm(INITIAL_ADJUSTMENT_DISORDER_DATA, initialData, onChange);

  const handleDateChange = (dateValue) => {
    const days = dateValue
        ? Math.floor((new Date() - new Date(dateValue)) / (1000 * 60 * 60 * 24))
        : '';
    // Update both fields atomically via two onChange calls
    onChange('stressorDate', dateValue);
    onChange('daysSinceStressor', days.toString());
    // Keep local state in sync
    handleChange('stressorDate', dateValue);
    handleChange('daysSinceStressor', days.toString());
  };

  return (
      <div className="bg-yellow-50 dark:bg-yellow-900/30 p-4 rounded-lg border border-yellow-200 dark:border-yellow-800 space-y-4">
        <h3 className="font-medium text-yellow-900 dark:text-yellow-200">Adjustment Disorder Episode Details</h3>
        <p className="text-xs text-yellow-700 dark:text-yellow-300">Track stressor, timeline, and response for VA claims evidence</p>

        {/* Stressor Information */}
        <div className="space-y-3 bg-yellow-100 dark:bg-yellow-900/20 p-3 rounded-lg">
          <h4 className="font-medium text-sm text-yellow-900 dark:text-yellow-200">Stressor Information</h4>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">What was the stressor/trigger?</label>
            <textarea value={data.stressor}
                      onChange={e => handleChange('stressor', e.target.value)}
                      placeholder="Describe the stressor that triggered these symptoms (e.g., job loss, relationship breakup, deployment, relocation)"
                      rows="3"
                      className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">When did the stressor occur?</label>
            <input type="date" value={data.stressorDate}
                   onChange={e => handleDateChange(e.target.value)}
                   className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white" />
            {data.daysSinceStressor && (
                <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                  {data.daysSinceStressor} days ago
                  {parseInt(data.daysSinceStressor) > 180 && (
                      <span className="ml-2 text-amber-600 dark:text-amber-400 font-medium">(Chronic - 6+ months)</span>
                  )}
                </p>
            )}
          </div>
        </div>

        {/* Presentation Type */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Symptom Presentation (Select primary type)</label>
          <div className="grid grid-cols-1 gap-2">
            {[
              { value: 'depressed',              label: 'With Depressed Mood' },
              { value: 'anxiety',                label: 'With Anxiety' },
              { value: 'mixed-emotions',         label: 'With Mixed Anxiety and Depressed Mood' },
              { value: 'conduct',                label: 'With Disturbance of Conduct' },
              { value: 'mixed-conduct-emotions', label: 'With Mixed Disturbance of Emotions and Conduct' },
              { value: 'unspecified',            label: 'Unspecified' },
            ].map(({ value, label }) => (
                <button key={value} type="button"
                        onClick={() => handleChange('presentationType', value)}
                        className={`p-2 rounded-lg border text-sm text-left ${
                            data.presentationType === value
                                ? 'bg-yellow-100 dark:bg-yellow-900/50 border-yellow-300 dark:border-yellow-700 text-yellow-900 dark:text-yellow-200 font-medium'
                                : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300'
                        }`}>
                  {label}
                </button>
            ))}
          </div>
        </div>

        {/* Emotional/Behavioral Symptoms */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Emotional/Behavioral Symptoms</label>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            {[
              { key: 'tearfulness',        label: 'Tearfulness/crying' },
              { key: 'hopelessness',       label: 'Feelings of hopelessness' },
              { key: 'worry',              label: 'Worry/nervousness' },
              { key: 'physicalTension',    label: 'Physical tension' },
              { key: 'impulsiveBehaviors', label: 'Impulsive behaviors' },
              { key: 'aggression',         label: 'Aggression/acting out' },
              { key: 'ruleViolations',     label: 'Rule violations' },
              { key: 'recklessBehavior',   label: 'Reckless behavior' },
            ].map(({ key, label }) => (
                <label key={key} className={`flex items-center gap-2 p-2 rounded-lg border cursor-pointer ${
                    data[key]
                        ? 'bg-yellow-100 dark:bg-yellow-900/50 border-yellow-300 dark:border-yellow-700'
                        : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700'
                }`}>
                  <input type="checkbox" checked={data[key]}
                         onChange={e => handleChange(key, e.target.checked)}
                         className="w-4 h-4 text-yellow-600 rounded" />
                  <span className="text-sm text-gray-700 dark:text-gray-300">{label}</span>
                </label>
            ))}
          </div>
        </div>

        {/* Functional Impact */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Functional Impact</label>
          <div className="grid grid-cols-1 gap-2">
            {[
              { key: 'workDifficulty',                  label: 'Difficulty at work/school' },
              { key: 'relationshipProblems',            label: 'Relationship problems' },
              { key: 'socialWithdrawal',                label: 'Social withdrawal' },
              { key: 'selfCareNeglect',                 label: 'Self-care neglect' },
              { key: 'unableToFulfillResponsibilities', label: 'Unable to fulfill responsibilities' },
            ].map(({ key, label }) => (
                <label key={key} className={`flex items-center gap-2 p-2 rounded-lg border cursor-pointer ${
                    data[key]
                        ? 'bg-yellow-100 dark:bg-yellow-900/50 border-yellow-300 dark:border-yellow-700'
                        : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700'
                }`}>
                  <input type="checkbox" checked={data[key]}
                         onChange={e => handleChange(key, e.target.checked)}
                         className="w-4 h-4 text-yellow-600 rounded" />
                  <span className="text-sm text-gray-700 dark:text-gray-300">{label}</span>
                </label>
            ))}
          </div>
        </div>

        {/* Progress Tracking */}
        <div className="space-y-3 bg-yellow-100 dark:bg-yellow-900/20 p-3 rounded-lg">
          <h4 className="font-medium text-sm text-yellow-900 dark:text-yellow-200">Progress Tracking</h4>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Are symptoms improving?</label>
            <div className="flex gap-2">
              {[{ value: true, label: 'Yes' }, { value: false, label: 'No' }, { value: null, label: 'Unsure' }].map(({ value, label }) => (
                  <button key={String(value)} type="button"
                          onClick={() => handleChange('symptomsImproving', value)}
                          className={`flex-1 p-2 rounded-lg border text-sm ${
                              data.symptomsImproving === value
                                  ? 'bg-yellow-200 dark:bg-yellow-900/70 border-yellow-400 dark:border-yellow-600 text-yellow-900 dark:text-yellow-200 font-medium'
                                  : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300'
                          }`}>
                    {label}
                  </button>
              ))}
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Still affecting daily functioning?</label>
            <div className="flex gap-2">
              {[{ value: true, label: 'Yes' }, { value: false, label: 'No' }, { value: null, label: 'Somewhat' }].map(({ value, label }) => (
                  <button key={String(value)} type="button"
                          onClick={() => handleChange('stillAffectingFunctioning', value)}
                          className={`flex-1 p-2 rounded-lg border text-sm ${
                              data.stillAffectingFunctioning === value
                                  ? 'bg-yellow-200 dark:bg-yellow-900/70 border-yellow-400 dark:border-yellow-600 text-yellow-900 dark:text-yellow-200 font-medium'
                                  : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300'
                          }`}>
                    {label}
                  </button>
              ))}
            </div>
          </div>
        </div>

        {/* Context */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Additional Context (optional)</label>
          <textarea value={data.context}
                    onChange={e => handleChange('context', e.target.value)}
                    placeholder="Describe how the stressor is affecting you today..."
                    rows="3"
                    className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white" />
        </div>

        <div className="bg-yellow-100 dark:bg-yellow-900/20 p-3 rounded text-xs text-gray-600 dark:text-gray-400">
          <strong>For VA Claims:</strong> Adjustment Disorder requires clear documentation of: (1) Identifiable stressor, (2) Symptoms within 3 months of stressor onset, (3) Duration (acute &lt;6 months, chronic ≥6 months), and (4) Functional impairment. Timeline documentation is critical.
        </div>
      </div>
  );
};

// ── Sub-form: Eating Disorders (Anorexia / Bulimia) ──────────────────────────

export const EatingDisorderForm = ({ initialData = {}, onChange, isAnorexia = false, isBulimia = false }) => {
  const [data, handleChange] = useSubForm(INITIAL_EATING_DISORDER_DATA, initialData, onChange);

  const handleArrayToggle = (field, value, checked) => {
    const current = data[field] || [];
    const updated = checked ? [...current, value] : current.filter(v => v !== value);
    handleChange(field, updated);
  };

  return (
      <div className="bg-blue-50 dark:bg-blue-900/30 p-4 rounded-lg space-y-4">
        <h3 className="font-semibold text-gray-900 dark:text-white flex items-center gap-2">
          🍽️ {isAnorexia ? 'Anorexia Nervosa' : 'Bulimia Nervosa'} Tracking
        </h3>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Eating disorders are rated based on weight loss percentage and incapacitating episodes requiring hospitalization.
          Track your symptoms to document evidence for VA claims.
        </p>

        {/* Weight Tracking */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Current Weight (lbs)</label>
          <input type="number" value={data.currentWeight}
                 onChange={e => handleChange('currentWeight', e.target.value)}
                 className="w-full px-3 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600"
                 placeholder="Current weight" />
        </div>
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Expected Minimum Weight (lbs)
            <span className="text-xs text-gray-500 ml-2">(Based on height/age/sex)</span>
          </label>
          <input type="number" value={data.expectedMinimumWeight}
                 onChange={e => handleChange('expectedMinimumWeight', e.target.value)}
                 className="w-full px-3 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600"
                 placeholder="Expected minimum weight" />
        </div>

        {/* Incapacitating Episode */}
        <div className="space-y-2">
          <label className="flex items-center gap-2">
            <input type="checkbox" checked={data.incapacitatingEpisode}
                   onChange={e => handleChange('incapacitatingEpisode', e.target.checked)}
                   className="rounded" />
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Incapacitating Episode (Bed rest and physician treatment required)
          </span>
          </label>
          {data.incapacitatingEpisode && (
              <input type="text" value={data.episodeDuration}
                     onChange={e => handleChange('episodeDuration', e.target.value)}
                     className="w-full px-3 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600"
                     placeholder="Duration of episode (e.g., '3 days')" />
          )}
        </div>

        {/* Hospitalization */}
        <div className="space-y-2">
          <label className="flex items-center gap-2">
            <input type="checkbox" checked={data.hospitalized}
                   onChange={e => handleChange('hospitalized', e.target.checked)}
                   className="rounded" />
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Hospitalized</span>
          </label>
          {data.hospitalized && (
              <div className="ml-6 space-y-2">
                <label className="flex items-center gap-2">
                  <input type="checkbox" checked={data.tubeFeeding}
                         onChange={e => handleChange('tubeFeeding', e.target.checked)}
                         className="rounded" />
                  <span className="text-sm text-gray-700 dark:text-gray-300">Tube Feeding</span>
                </label>
                <label className="flex items-center gap-2">
                  <input type="checkbox" checked={data.parenteralNutrition}
                         onChange={e => handleChange('parenteralNutrition', e.target.checked)}
                         className="rounded" />
                  <span className="text-sm text-gray-700 dark:text-gray-300">Parenteral Nutrition (IV)</span>
                </label>
              </div>
          )}
        </div>

        {/* Bulimia-specific */}
        {isBulimia && (
            <>
              <div className="space-y-2">
                <label className="flex items-center gap-2">
                  <input type="checkbox" checked={data.bingeEpisode}
                         onChange={e => handleChange('bingeEpisode', e.target.checked)}
                         className="rounded" />
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Binge Eating Episode</span>
                </label>
              </div>
              <div className="space-y-2">
                <label className="flex items-center gap-2">
                  <input type="checkbox" checked={data.purgingEpisode}
                         onChange={e => handleChange('purgingEpisode', e.target.checked)}
                         className="rounded" />
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Purging Episode (Self-induced vomiting)</span>
                </label>
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Compensatory Behaviors</label>
                <div className="space-y-1 ml-4">
                  {['Excessive exercise', 'Laxative use', 'Diuretic use', 'Fasting'].map(behavior => (
                      <label key={behavior} className="flex items-center gap-2">
                        <input type="checkbox"
                               checked={data.compensatoryBehaviors.includes(behavior)}
                               onChange={e => handleArrayToggle('compensatoryBehaviors', behavior, e.target.checked)}
                               className="rounded" />
                        <span className="text-sm text-gray-700 dark:text-gray-300">{behavior}</span>
                      </label>
                  ))}
                </div>
              </div>
            </>
        )}

        {/* Anorexia-specific */}
        {isAnorexia && (
            <div className="space-y-2">
              <label className="flex items-center gap-2">
                <input type="checkbox" checked={data.restrictedIntake}
                       onChange={e => handleChange('restrictedIntake', e.target.checked)}
                       className="rounded" />
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Restricted Food Intake Today</span>
              </label>
            </div>
        )}

        <div className="bg-amber-50 dark:bg-amber-900/20 p-3 rounded text-xs text-gray-600 dark:text-gray-400">
          <strong>For VA Claims:</strong> Eating disorders require medical records showing weight, BMI calculations, and
          hospitalization records. Incapacitating episodes must require bed rest and physician treatment (not just therapy).
        </div>
      </div>
  );
};

// ── Sub-form: Binge Eating Disorder ─────────────────────────────────────────

export const BingeEatingForm = ({ initialData = {}, onChange }) => {
  const [data, handleChange] = useSubForm(INITIAL_BINGE_EATING_DATA, initialData, onChange);

  return (
      <div className="space-y-3 p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
        <h4 className="font-medium text-gray-900 dark:text-white">Binge Eating Episode Details</h4>
        <label className="flex items-center gap-2">
          <input type="checkbox" checked={data.bingeEpisode}
                 onChange={e => handleChange('bingeEpisode', e.target.checked)}
                 className="rounded" />
          <span className="text-sm text-gray-700 dark:text-gray-300">Binge eating episode (ate significantly more than normal)</span>
        </label>
        <label className="flex items-center gap-2">
          <input type="checkbox" checked={data.lossOfControl}
                 onChange={e => handleChange('lossOfControl', e.target.checked)}
                 className="rounded" />
          <span className="text-sm text-gray-700 dark:text-gray-300">Loss of control — couldn't stop eating</span>
        </label>
        <div>
          <label className="block text-sm mb-1 text-gray-700 dark:text-gray-300">Distress level about binge (1–10):</label>
          <input type="range" min="1" max="10" value={data.distressLevel}
                 onChange={e => handleChange('distressLevel', parseInt(e.target.value))}
                 className="w-full" />
          <span className="text-sm text-gray-600 dark:text-gray-400">{data.distressLevel}/10</span>
        </div>
      </div>
  );
};

// ── Sub-form: Dissociative ───────────────────────────────────────────────────

export const DissociativeForm = ({ initialData = {}, onChange }) => {
  const [data, handleChange] = useSubForm(INITIAL_DISSOCIATIVE_DATA, initialData, onChange);

  return (
      <div className="space-y-3 p-3 bg-indigo-50 dark:bg-indigo-900/20 rounded-lg">
        <h4 className="font-medium text-gray-900 dark:text-white">Dissociative Episode Details</h4>
        <label className="flex items-center gap-2">
          <input type="checkbox" checked={data.memoryGap}
                 onChange={e => handleChange('memoryGap', e.target.checked)}
                 className="rounded text-indigo-600" />
          <span className="text-sm text-gray-700 dark:text-gray-300">Memory gap — can't remember what happened</span>
        </label>
        <label className="flex items-center gap-2">
          <input type="checkbox" checked={data.lostTime}
                 onChange={e => handleChange('lostTime', e.target.checked)}
                 className="rounded text-indigo-600" />
          <span className="text-sm text-gray-700 dark:text-gray-300">Lost time — found myself somewhere with no memory of how</span>
        </label>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Duration of episode:</label>
          <div className="flex gap-2">
            <input type="number" min="0" max="999"
                   value={data.durationAmount || ''}
                   onChange={e => handleChange('durationAmount', e.target.value)}
                   placeholder="0"
                   className="w-24 p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white" />
            <select value={data.durationUnit || ''}
                    onChange={e => handleChange('durationUnit', e.target.value)}
                    className="flex-1 p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white">
              <option value="">Select unit...</option>
              <option value="Minutes">Minutes</option>
              <option value="Hours">Hours</option>
              <option value="Days">Days</option>
            </select>
          </div>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Example: "3" and "Hours" = "3 hours"</p>
        </div>
      </div>
  );
};

// ── Sub-form: Acute Stress ───────────────────────────────────────────────────

export const AcuteStressForm = ({ initialData = {}, onChange }) => {
  const [data, handleChange] = useSubForm(INITIAL_ACUTE_STRESS_DATA, initialData, onChange);

  return (
      <div className="space-y-3 p-3 bg-red-50 dark:bg-red-900/20 rounded-lg">
        <h4 className="font-medium text-gray-900 dark:text-white">Acute Stress Details</h4>
        <div>
          <label className="block text-sm mb-1 text-gray-700 dark:text-gray-300">Date of traumatic event:</label>
          <input type="date" value={data.traumaDate}
                 onChange={e => handleChange('traumaDate', e.target.value)}
                 className="p-2 border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white" />
        </div>
        <label className="flex items-center gap-2">
          <input type="checkbox" checked={data.dissociativeSymptoms}
                 onChange={e => handleChange('dissociativeSymptoms', e.target.checked)}
                 className="rounded" />
          <span className="text-sm text-gray-700 dark:text-gray-300">Dissociative symptoms (feeling detached, derealization)</span>
        </label>
        <label className="flex items-center gap-2">
          <input type="checkbox" checked={data.avoidance}
                 onChange={e => handleChange('avoidance', e.target.checked)}
                 className="rounded" />
          <span className="text-sm text-gray-700 dark:text-gray-300">Avoiding reminders of trauma</span>
        </label>
      </div>
  );
};

// ── Sub-form: Personality Disorders ─────────────────────────────────────────

export const PersonalityDisorderForm = ({ initialData = {}, onChange }) => {
  const [data, handleChange] = useSubForm(INITIAL_PERSONALITY_DATA, initialData, onChange);

  return (
      <div className="space-y-3 p-3 bg-amber-50 dark:bg-amber-900/20 rounded-lg">
        <h4 className="font-medium text-gray-900 dark:text-white">Functional Impact</h4>
        <label className="flex items-center gap-2">
          <input type="checkbox" checked={data.occupationalImpact}
                 onChange={e => handleChange('occupationalImpact', e.target.checked)}
                 className="rounded" />
          <span className="text-sm text-gray-700 dark:text-gray-300">Impact on work/school today</span>
        </label>
        <label className="flex items-center gap-2">
          <input type="checkbox" checked={data.socialImpact}
                 onChange={e => handleChange('socialImpact', e.target.checked)}
                 className="rounded" />
          <span className="text-sm text-gray-700 dark:text-gray-300">Impact on relationships today</span>
        </label>
      </div>
  );
};

// ── Sub-form: Somatic Symptom ────────────────────────────────────────────────

export const SomaticSymptomForm = ({ initialData = {}, onChange }) => {
  const [data, handleChange] = useSubForm(INITIAL_SOMATIC_SYMPTOM_DATA, initialData, onChange);

  return (
      <div className="space-y-3 p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
        <h4 className="font-medium text-gray-900 dark:text-white">🩺 Somatic Symptom Tracking</h4>
        <p className="text-xs text-gray-600 dark:text-gray-400">Track physical symptoms and health-related behaviors</p>
        <div className="space-y-2">
          {[
            { key: 'painPreoccupation',      label: 'Excessive thoughts about pain/symptoms' },
            { key: 'excessiveHealthWorry',   label: 'Excessive worry about health conditions' },
            { key: 'multipleSymptoms',       label: 'Multiple physical symptoms present' },
            { key: 'frequentDoctorVisits',   label: 'Frequent doctor visits for symptoms' },
            { key: 'functionalImpairment',   label: 'Symptoms interfere with daily functioning' },
          ].map(({ key, label }) => (
              <label key={key} className="flex items-center gap-2">
                <input type="checkbox" checked={data[key]}
                       onChange={e => handleChange(key, e.target.checked)}
                       className="rounded" />
                <span className="text-sm text-gray-700 dark:text-gray-300">{label}</span>
              </label>
          ))}
        </div>
        <div className="bg-purple-100 dark:bg-purple-900/40 p-2 rounded text-xs text-gray-600 dark:text-gray-400">
          <strong>For VA Claims:</strong> Document persistent physical symptoms that cause significant distress.
        </div>
      </div>
  );
};

// ── Sub-form: Illness Anxiety ────────────────────────────────────────────────

export const IllnessAnxietyForm = ({ initialData = {}, onChange }) => {
  const [data, handleChange] = useSubForm(INITIAL_ILLNESS_ANXIETY_DATA, initialData, onChange);

  return (
      <div className="space-y-3 p-3 bg-amber-50 dark:bg-amber-900/20 rounded-lg">
        <h4 className="font-medium text-gray-900 dark:text-white">🏥 Illness Anxiety Tracking</h4>
        <p className="text-xs text-gray-600 dark:text-gray-400">Track health anxiety symptoms and behaviors</p>
        <div className="space-y-2">
          {[
            { key: 'fearOfIllness',         label: 'Preoccupation with having/acquiring serious illness' },
            { key: 'bodyChecking',          label: 'Excessive body checking for signs of illness' },
            { key: 'reassuranceSeeking',    label: 'Seeking reassurance about health from others' },
            { key: 'appointmentAvoidance',  label: 'Avoiding medical appointments due to fear' },
            { key: 'healthDistress',        label: 'High anxiety/distress about health status' },
          ].map(({ key, label }) => (
              <label key={key} className="flex items-center gap-2">
                <input type="checkbox" checked={data[key]}
                       onChange={e => handleChange(key, e.target.checked)}
                       className="rounded" />
                <span className="text-sm text-gray-700 dark:text-gray-300">{label}</span>
              </label>
          ))}
        </div>
      </div>
  );
};

// ── Sub-form: Depersonalization ──────────────────────────────────────────────

export const DepersonalizationForm = ({ initialData = {}, onChange }) => {
  const [data, handleChange] = useSubForm(INITIAL_DEPERSONALIZATION_DATA, initialData, onChange);

  return (
      <div className="space-y-3 p-3 bg-indigo-50 dark:bg-indigo-900/20 rounded-lg">
        <h4 className="font-medium text-gray-900 dark:text-white">🌀 Depersonalization/Derealization Episode</h4>
        <p className="text-xs text-gray-600 dark:text-gray-400">Track dissociative symptoms</p>
        <div className="space-y-2">
          {[
            { key: 'detachment',     label: 'Feeling detached from yourself (depersonalization)' },
            { key: 'unreality',      label: 'Surroundings feel unreal (derealization)' },
            { key: 'robotAutopilot', label: 'Feeling like a robot or on autopilot' },
            { key: 'distress',       label: 'Significant distress from these experiences' },
          ].map(({ key, label }) => (
              <label key={key} className="flex items-center gap-2">
                <input type="checkbox" checked={data[key]}
                       onChange={e => handleChange(key, e.target.checked)}
                       className="rounded" />
                <span className="text-sm text-gray-700 dark:text-gray-300">{label}</span>
              </label>
          ))}
        </div>
      </div>
  );
};

// ── Sub-form: Cyclothymic ────────────────────────────────────────────────────

export const CyclothymicForm = ({ initialData = {}, onChange }) => {
  const [data, handleChange] = useSubForm(INITIAL_CYCLOTHYMIC_DATA, initialData, onChange);

  return (
      <div className="space-y-3 p-3 bg-rose-50 dark:bg-rose-900/20 rounded-lg">
        <h4 className="font-medium text-gray-900 dark:text-white">🔄 Cyclothymic Mood Episode</h4>
        <p className="text-xs text-gray-600 dark:text-gray-400">Track mood fluctuations</p>
        <div className="space-y-2">
          {[
            { key: 'hypomanic',   label: 'Hypomanic symptoms (elevated mood, energy)' },
            { key: 'depressive',  label: 'Depressive symptoms (low mood, low energy)' },
            { key: 'moodSwings',  label: 'Mood swings between states' },
            { key: 'irritability',label: 'Increased irritability' },
          ].map(({ key, label }) => (
              <label key={key} className="flex items-center gap-2">
                <input type="checkbox" checked={data[key]}
                       onChange={e => handleChange(key, e.target.checked)}
                       className="rounded" />
                <span className="text-sm text-gray-700 dark:text-gray-300">{label}</span>
              </label>
          ))}
        </div>
      </div>
  );
};