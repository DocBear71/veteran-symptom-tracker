// src/components/forms/SymptomForms/NeurologicalForm.jsx
// Shared neurological condition forms used by SymptomLogger and EditLogModal.
// Covers: Multiple Sclerosis, Parkinson's Disease, Myasthenia Gravis,
//         Narcolepsy, ALS, Syringomyelia, Myelitis
//
// Prop contract — one pair per sub-condition:
//   { conditionData, onChange, selectedSymptom }
//   conditionData — current state object for that condition
//   onChange      — callback: (fieldName, value) => void
//   selectedSymptom — the active symptom ID (drives subsection visibility)

import React, { useState, useEffect } from 'react';

// ── Default shapes — exported for useState init and reset in parents ──────────

export const INITIAL_MULTIPLE_SCLEROSIS_DATA = {
  isRelapse: false,
  relapseDuration: '',
  relapseRecovery: '',
  mobilityAid: '',
  assistanceNeeded: false,
  assistanceType: '',
  onDMT: false,
  dmtType: '',
  recentSteroids: false,
  edssEstimate: '',
  heatTriggered: false,
};

export const INITIAL_PARKINSONS_DATA = {
  tremorSide: '',
  tremorSeverity: '',
  freezingEpisodes: '',
  fallsToday: '',
  onTime: '',
  medicationState: '',
  mobilityAid: '',
  assistanceNeeded: false,
  speechAffected: false,
  swallowingAffected: false,
  hallucinationsPresent: false,
  confusionPresent: false,
};

export const INITIAL_MYASTHENIA_DATA = {
  worseWithActivity: false,
  betterWithRest: false,
  timeOfDayWorst: '',
  ocularOnly: false,
  bulbarInvolved: false,
  limbsInvolved: false,
  respiratoryInvolved: false,
  canRaiseArms: '',
  ptosisPresent: false,
  ptosisSide: '',
  doubleVision: false,
  onPyridostigmine: false,
  dosesTakenToday: '',
  breathingDifficulty: false,
  emergencySigns: false,
};

export const INITIAL_NARCOLEPSY_DATA = {
  sleepAttackDuration: '',
  sleepAttackTrigger: '',
  cataplexyTrigger: '',
  cataplexyAffected: '',
  fellDuringCataplexy: false,
  hallucinationType: '',
  paralysisAtSleep: false,
  paralysisAtWake: false,
  automaticBehaviorActivity: '',
  onStimulants: false,
  stimulantType: '',
  onSodiumOxybate: false,
  sleepStudyConfirmed: false,
};

export const INITIAL_ALS_DATA = {
  weaknessLocation: '',
  weaknessSide: '',
  fasciculationLocation: '',
  speechClarity: '',
  swallowingSolids: '',
  swallowingLiquids: '',
  breathingDifficulty: '',
  usesBiPAP: false,
  usesVentilator: false,
  usesFeedingTube: false,
  feedingTubeType: '',
  mobilityStatus: '',
  fvcPercent: '',
  weightChange: '',
};

export const INITIAL_SYRINGOMYELIA_DATA = {
  painType: '',
  painLocation: '',
  sensoryLossPattern: '',
  tempInsensitivityArea: '',
  hadBurnInjury: false,
  hadCutInjury: false,
  weaknessLocation: '',
  muscleWastingLocation: '',
  hasScoliosis: false,
  hasHeadaches: false,
  headacheWithCough: false,
  syrinxLocation: '',
};

export const INITIAL_MYELITIS_DATA = {
  weaknessDistribution: '',
  sensoryLevel: '',
  bladderSymptoms: '',
  usesCatheter: false,
  catheterType: '',
  bowelSymptoms: '',
  usesBowelProgram: false,
  spasticityLocation: '',
  onBaclofenPump: false,
  painType: '',
  mobilityStatus: '',
  hasSexualDysfunction: false,
  causeOfMyelitis: '',
};

// ── Helper: generic controlled local state with parent sync ──────────────────

function useSubForm(initialDefaults, initialData, onChange) {
  const [data, setData] = useState({ ...initialDefaults, ...initialData });
  useEffect(() => {
    setData({ ...initialDefaults, ...initialData });
  }, [initialData]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleChange = (field, value) => {
    setData(prev => ({ ...prev, [field]: value }));
    onChange(field, value);
  };
  return [data, handleChange];
}

// ── Sub-form: Multiple Sclerosis ─────────────────────────────────────────────

export const MultipleSclerosisForm = ({ initialData = {}, onChange, selectedSymptom }) => {
  const [data, handleChange] = useSubForm(INITIAL_MULTIPLE_SCLEROSIS_DATA, initialData, onChange);

  return (
      <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-lg border border-purple-200 dark:border-purple-800">
        <h4 className="font-medium text-purple-900 dark:text-purple-200 mb-3 flex items-center gap-2">
          🧠 Multiple Sclerosis Details
        </h4>

        {/* Relapse tracking */}
        {selectedSymptom === 'ms-relapse' && (
            <div className="space-y-3 mb-4">
              <label className="flex items-center gap-2">
                <input type="checkbox" checked={data.isRelapse}
                       onChange={(e) => handleChange('isRelapse', e.target.checked)}
                       className="rounded" />
                <span className="text-sm text-gray-700 dark:text-gray-300">Confirmed relapse/exacerbation</span>
              </label>
              {data.isRelapse && (
                  <>
                    <div>
                      <label className="block text-sm text-gray-600 dark:text-gray-400 mb-1">Relapse Duration (days)</label>
                      <input type="number" value={data.relapseDuration} min="1"
                             onChange={(e) => handleChange('relapseDuration', e.target.value)}
                             className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600"
                             placeholder="Number of days" />
                    </div>
                    <div>
                      <label className="block text-sm text-gray-600 dark:text-gray-400 mb-1">Recovery Status</label>
                      <select value={data.relapseRecovery}
                              onChange={(e) => handleChange('relapseRecovery', e.target.value)}
                              className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600">
                        <option value="">Select recovery status...</option>
                        <option value="ongoing">Still ongoing</option>
                        <option value="full">Full recovery</option>
                        <option value="partial">Partial recovery</option>
                        <option value="none">No recovery (new baseline)</option>
                      </select>
                    </div>
                    <label className="flex items-center gap-2">
                      <input type="checkbox" checked={data.recentSteroids}
                             onChange={(e) => handleChange('recentSteroids', e.target.checked)}
                             className="rounded" />
                      <span className="text-sm text-gray-700 dark:text-gray-300">Received IV steroids for this relapse</span>
                    </label>
                  </>
              )}
            </div>
        )}

        {/* Heat sensitivity */}
        {selectedSymptom === 'ms-heat-sensitivity' && (
            <label className="flex items-center gap-2 mb-3">
              <input type="checkbox" checked={data.heatTriggered}
                     onChange={(e) => handleChange('heatTriggered', e.target.checked)}
                     className="rounded" />
              <span className="text-sm text-gray-700 dark:text-gray-300">Symptoms triggered by heat/exercise (Uhthoff's)</span>
            </label>
        )}

        {/* Mobility — walking/balance/weakness symptoms */}
        {['ms-walking-difficulty', 'ms-balance-problems', 'ms-muscle-weakness'].includes(selectedSymptom) && (
            <div className="space-y-3 mb-4">
              <div>
                <label className="block text-sm text-gray-600 dark:text-gray-400 mb-1">Mobility Aid Used</label>
                <select value={data.mobilityAid}
                        onChange={(e) => handleChange('mobilityAid', e.target.value)}
                        className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600">
                  <option value="">Select if applicable...</option>
                  <option value="none">No mobility aid needed</option>
                  <option value="cane">Cane</option>
                  <option value="walker">Walker</option>
                  <option value="wheelchair">Wheelchair</option>
                  <option value="scooter">Scooter</option>
                </select>
              </div>
              <label className="flex items-center gap-2">
                <input type="checkbox" checked={data.assistanceNeeded}
                       onChange={(e) => handleChange('assistanceNeeded', e.target.checked)}
                       className="rounded" />
                <span className="text-sm text-gray-700 dark:text-gray-300">Required assistance from another person</span>
              </label>
            </div>
        )}

        {/* Treatment tracking — always visible */}
        <div className="grid grid-cols-2 gap-3">
          <label className="flex items-center gap-2">
            <input type="checkbox" checked={data.onDMT}
                   onChange={(e) => handleChange('onDMT', e.target.checked)}
                   className="rounded" />
            <span className="text-sm text-gray-700 dark:text-gray-300">On disease-modifying therapy</span>
          </label>
        </div>
      </div>
  );
};

// ── Sub-form: Parkinson's Disease ────────────────────────────────────────────

export const ParkinsonsForm = ({ initialData = {}, onChange, selectedSymptom }) => {
  const [data, handleChange] = useSubForm(INITIAL_PARKINSONS_DATA, initialData, onChange);

  return (
      <div className="bg-indigo-50 dark:bg-indigo-900/20 p-4 rounded-lg border border-indigo-200 dark:border-indigo-800">
        <h4 className="font-medium text-indigo-900 dark:text-indigo-200 mb-3 flex items-center gap-2">
          🧠 Parkinson's Disease Details
        </h4>

        {/* Tremor */}
        {selectedSymptom === 'pd-resting-tremor' && (
            <div className="space-y-3 mb-4">
              <div>
                <label className="block text-sm text-gray-600 dark:text-gray-400 mb-1">Tremor Location</label>
                <select value={data.tremorSide}
                        onChange={(e) => handleChange('tremorSide', e.target.value)}
                        className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600">
                  <option value="">Select affected side...</option>
                  <option value="left">Left side</option>
                  <option value="right">Right side</option>
                  <option value="both">Both sides</option>
                </select>
              </div>
              <div>
                <label className="block text-sm text-gray-600 dark:text-gray-400 mb-1">Tremor Severity</label>
                <select value={data.tremorSeverity}
                        onChange={(e) => handleChange('tremorSeverity', e.target.value)}
                        className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600">
                  <option value="">Select severity...</option>
                  <option value="mild">Mild - noticeable but not interfering</option>
                  <option value="moderate">Moderate - interferes with some tasks</option>
                  <option value="severe">Severe - significantly limits function</option>
                </select>
              </div>
            </div>
        )}

        {/* Freezing episodes */}
        {selectedSymptom === 'pd-freezing-gait' && (
            <div className="mb-4">
              <label className="block text-sm text-gray-600 dark:text-gray-400 mb-1">Number of Freezing Episodes Today</label>
              <input type="number" value={data.freezingEpisodes} min="0"
                     onChange={(e) => handleChange('freezingEpisodes', e.target.value)}
                     className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600"
                     placeholder="Number of episodes" />
            </div>
        )}

        {/* Falls */}
        {selectedSymptom === 'pd-falls' && (
            <div className="mb-4">
              <label className="block text-sm text-gray-600 dark:text-gray-400 mb-1">Number of Falls</label>
              <input type="number" value={data.fallsToday} min="0"
                     onChange={(e) => handleChange('fallsToday', e.target.value)}
                     className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600"
                     placeholder="Number of falls" />
            </div>
        )}

        {/* OFF episodes / medication state */}
        {['pd-off-episodes', 'pd-dyskinesia'].includes(selectedSymptom) && (
            <div className="space-y-3 mb-4">
              <div>
                <label className="block text-sm text-gray-600 dark:text-gray-400 mb-1">Current Medication State</label>
                <select value={data.medicationState}
                        onChange={(e) => handleChange('medicationState', e.target.value)}
                        className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600">
                  <option value="">Select state...</option>
                  <option value="on">ON - medication working well</option>
                  <option value="wearing-off">Wearing OFF - medication effect fading</option>
                  <option value="off">OFF - medication not working</option>
                  <option value="dyskinesia">Dyskinesia - involuntary movements</option>
                </select>
              </div>
              <div>
                <label className="block text-sm text-gray-600 dark:text-gray-400 mb-1">Time Since Last Dose (minutes)</label>
                <input type="number" value={data.onTime} min="0"
                       onChange={(e) => handleChange('onTime', e.target.value)}
                       className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600"
                       placeholder="Minutes since last dose" />
              </div>
            </div>
        )}

        {/* Cognitive/psychiatric */}
        {['pd-cognitive-changes', 'pd-depression', 'pd-anxiety'].includes(selectedSymptom) && (
            <div className="grid grid-cols-2 gap-3 mb-4">
              <label className="flex items-center gap-2">
                <input type="checkbox" checked={data.hallucinationsPresent}
                       onChange={(e) => handleChange('hallucinationsPresent', e.target.checked)}
                       className="rounded" />
                <span className="text-sm text-gray-700 dark:text-gray-300">Hallucinations present</span>
              </label>
              <label className="flex items-center gap-2">
                <input type="checkbox" checked={data.confusionPresent}
                       onChange={(e) => handleChange('confusionPresent', e.target.checked)}
                       className="rounded" />
                <span className="text-sm text-gray-700 dark:text-gray-300">Confusion present</span>
              </label>
            </div>
        )}

        {/* Functional impact — always visible */}
        <div className="space-y-3">
          <div>
            <label className="block text-sm text-gray-600 dark:text-gray-400 mb-1">Mobility Aid Used</label>
            <select value={data.mobilityAid}
                    onChange={(e) => handleChange('mobilityAid', e.target.value)}
                    className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600">
              <option value="">Select if applicable...</option>
              <option value="none">No mobility aid needed</option>
              <option value="cane">Cane</option>
              <option value="walker">Walker</option>
              <option value="wheelchair">Wheelchair</option>
            </select>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <label className="flex items-center gap-2">
              <input type="checkbox" checked={data.speechAffected}
                     onChange={(e) => handleChange('speechAffected', e.target.checked)}
                     className="rounded" />
              <span className="text-sm text-gray-700 dark:text-gray-300">Speech affected</span>
            </label>
            <label className="flex items-center gap-2">
              <input type="checkbox" checked={data.swallowingAffected}
                     onChange={(e) => handleChange('swallowingAffected', e.target.checked)}
                     className="rounded" />
              <span className="text-sm text-gray-700 dark:text-gray-300">Swallowing affected</span>
            </label>
          </div>
        </div>
      </div>
  );
};

// ── Sub-form: Myasthenia Gravis ──────────────────────────────────────────────

export const MyastheniaForm = ({ initialData = {}, onChange, selectedSymptom }) => {
  const [data, handleChange] = useSubForm(INITIAL_MYASTHENIA_DATA, initialData, onChange);

  return (
      <div className="bg-teal-50 dark:bg-teal-900/20 p-4 rounded-lg border border-teal-200 dark:border-teal-800">
        <h4 className="font-medium text-teal-900 dark:text-teal-200 mb-3 flex items-center gap-2">
          💪 Myasthenia Gravis Details
        </h4>

        {/* Characteristic pattern — always visible */}
        <div className="grid grid-cols-2 gap-3 mb-4">
          <label className="flex items-center gap-2">
            <input type="checkbox" checked={data.worseWithActivity}
                   onChange={(e) => handleChange('worseWithActivity', e.target.checked)}
                   className="rounded" />
            <span className="text-sm text-gray-700 dark:text-gray-300">Worse with activity</span>
          </label>
          <label className="flex items-center gap-2">
            <input type="checkbox" checked={data.betterWithRest}
                   onChange={(e) => handleChange('betterWithRest', e.target.checked)}
                   className="rounded" />
            <span className="text-sm text-gray-700 dark:text-gray-300">Better with rest</span>
          </label>
        </div>

        {/* Time pattern */}
        <div className="mb-4">
          <label className="block text-sm text-gray-600 dark:text-gray-400 mb-1">Worst Time of Day</label>
          <select value={data.timeOfDayWorst}
                  onChange={(e) => handleChange('timeOfDayWorst', e.target.value)}
                  className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600">
            <option value="">Select if pattern exists...</option>
            <option value="morning">Morning</option>
            <option value="afternoon">Afternoon</option>
            <option value="evening">Evening (most common for MG)</option>
            <option value="variable">Variable/unpredictable</option>
          </select>
        </div>

        {/* Ocular symptoms */}
        {['mg-ptosis', 'mg-diplopia'].includes(selectedSymptom) && (
            <div className="space-y-3 mb-4">
              <label className="flex items-center gap-2">
                <input type="checkbox" checked={data.ptosisPresent}
                       onChange={(e) => handleChange('ptosisPresent', e.target.checked)}
                       className="rounded" />
                <span className="text-sm text-gray-700 dark:text-gray-300">Ptosis (drooping eyelid) present</span>
              </label>
              {data.ptosisPresent && (
                  <div>
                    <label className="block text-sm text-gray-600 dark:text-gray-400 mb-1">Which Eye(s)</label>
                    <select value={data.ptosisSide}
                            onChange={(e) => handleChange('ptosisSide', e.target.value)}
                            className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600">
                      <option value="">Select...</option>
                      <option value="left">Left eye</option>
                      <option value="right">Right eye</option>
                      <option value="both">Both eyes</option>
                      <option value="alternating">Alternating</option>
                    </select>
                  </div>
              )}
              <label className="flex items-center gap-2">
                <input type="checkbox" checked={data.doubleVision}
                       onChange={(e) => handleChange('doubleVision', e.target.checked)}
                       className="rounded" />
                <span className="text-sm text-gray-700 dark:text-gray-300">Double vision present</span>
              </label>
              <label className="flex items-center gap-2">
                <input type="checkbox" checked={data.ocularOnly}
                       onChange={(e) => handleChange('ocularOnly', e.target.checked)}
                       className="rounded" />
                <span className="text-sm text-gray-700 dark:text-gray-300">Symptoms limited to eyes only</span>
              </label>
            </div>
        )}

        {/* Arm raise test */}
        {['mg-limb-weakness', 'mg-arm-elevation-difficulty'].includes(selectedSymptom) && (
            <div className="mb-4">
              <label className="block text-sm text-gray-600 dark:text-gray-400 mb-1">
                How long can you hold arms extended? (seconds)
              </label>
              <input type="number" value={data.canRaiseArms} min="0"
                     onChange={(e) => handleChange('canRaiseArms', e.target.value)}
                     className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600"
                     placeholder="Seconds before fatigue" />
              <p className="text-xs text-gray-500 mt-1">Normal is 2+ minutes. Less than 60 seconds suggests significant weakness.</p>
            </div>
        )}

        {/* Bulbar symptoms */}
        {['mg-difficulty-chewing', 'mg-difficulty-swallowing', 'mg-slurred-speech'].includes(selectedSymptom) && (
            <label className="flex items-center gap-2 mb-4">
              <input type="checkbox" checked={data.bulbarInvolved}
                     onChange={(e) => handleChange('bulbarInvolved', e.target.checked)}
                     className="rounded" />
              <span className="text-sm text-gray-700 dark:text-gray-300">Bulbar muscles involved (chewing/swallowing/speech)</span>
            </label>
        )}

        {/* Breathing */}
        {selectedSymptom === 'mg-breathing-difficulty' && (
            <div className="space-y-3 mb-4">
              <label className="flex items-center gap-2">
                <input type="checkbox" checked={data.breathingDifficulty}
                       onChange={(e) => handleChange('breathingDifficulty', e.target.checked)}
                       className="rounded" />
                <span className="text-sm text-gray-700 dark:text-gray-300">Breathing difficulty present</span>
              </label>
              <label className="flex items-center gap-2">
                <input type="checkbox" checked={data.emergencySigns}
                       onChange={(e) => handleChange('emergencySigns', e.target.checked)}
                       className="rounded" />
                <span className="text-sm font-medium text-red-700 dark:text-red-300">⚠️ Crisis warning signs present</span>
              </label>
            </div>
        )}

        {/* Treatment — always visible */}
        <div className="grid grid-cols-2 gap-3">
          <label className="flex items-center gap-2">
            <input type="checkbox" checked={data.onPyridostigmine}
                   onChange={(e) => handleChange('onPyridostigmine', e.target.checked)}
                   className="rounded" />
            <span className="text-sm text-gray-700 dark:text-gray-300">On pyridostigmine (Mestinon)</span>
          </label>
        </div>
      </div>
  );
};

// ── Sub-form: Narcolepsy ─────────────────────────────────────────────────────

export const NarcolepsyForm = ({ initialData = {}, onChange, selectedSymptom }) => {
  const [data, handleChange] = useSubForm(INITIAL_NARCOLEPSY_DATA, initialData, onChange);

  return (
      <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg border border-blue-200 dark:border-blue-800">
        <h4 className="font-medium text-blue-900 dark:text-blue-200 mb-3 flex items-center gap-2">
          😴 Narcolepsy Details
        </h4>
        <div className="space-y-3">
          {/* Sleep attacks */}
          {['narco-sleep-attacks', 'narco-excessive-daytime-sleepiness'].includes(selectedSymptom) && (
              <>
                <div>
                  <label className="block text-sm text-gray-600 dark:text-gray-400 mb-1">Sleep Attack Duration</label>
                  <select value={data.sleepAttackDuration}
                          onChange={(e) => handleChange('sleepAttackDuration', e.target.value)}
                          className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600">
                    <option value="">Select duration...</option>
                    <option value="seconds">Seconds</option>
                    <option value="1-5min">1–5 minutes</option>
                    <option value="5-20min">5–20 minutes</option>
                    <option value="20-60min">20–60 minutes</option>
                    <option value=">1hr">More than 1 hour</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm text-gray-600 dark:text-gray-400 mb-1">What Were You Doing?</label>
                  <select value={data.sleepAttackTrigger}
                          onChange={(e) => handleChange('sleepAttackTrigger', e.target.value)}
                          className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600">
                    <option value="">Select activity...</option>
                    <option value="emotion">Emotional moment</option>
                    <option value="boredom">Bored/inactive</option>
                    <option value="eating">Eating</option>
                    <option value="driving">Driving</option>
                    <option value="working">Working</option>
                    <option value="other">Other</option>
                  </select>
                </div>
              </>
          )}

          {/* Cataplexy */}
          {selectedSymptom === 'narco-cataplexy' && (
              <>
                <div>
                  <label className="block text-sm text-gray-600 dark:text-gray-400 mb-1">Cataplexy Trigger</label>
                  <select value={data.cataplexyTrigger}
                          onChange={(e) => handleChange('cataplexyTrigger', e.target.value)}
                          className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600">
                    <option value="">Select trigger...</option>
                    <option value="laughter">Laughter</option>
                    <option value="surprise">Surprise</option>
                    <option value="anger">Anger</option>
                    <option value="excitement">Excitement</option>
                    <option value="other">Other emotion</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm text-gray-600 dark:text-gray-400 mb-1">Affected Body Part</label>
                  <select value={data.cataplexyAffected}
                          onChange={(e) => handleChange('cataplexyAffected', e.target.value)}
                          className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600">
                    <option value="">Select area...</option>
                    <option value="face">Face/jaw</option>
                    <option value="arms">Arms</option>
                    <option value="legs">Legs/knees</option>
                    <option value="whole-body">Whole body collapse</option>
                  </select>
                </div>
                <label className="flex items-center gap-2">
                  <input type="checkbox" checked={data.fellDuringCataplexy}
                         onChange={(e) => handleChange('fellDuringCataplexy', e.target.checked)}
                         className="rounded" />
                  <span className="text-sm text-gray-700 dark:text-gray-300">Fell during episode</span>
                </label>
              </>
          )}

          {/* Sleep paralysis / hallucinations */}
          {['narco-sleep-paralysis', 'narco-hallucinations'].includes(selectedSymptom) && (
              <>
                <label className="flex items-center gap-2">
                  <input type="checkbox" checked={data.paralysisAtSleep}
                         onChange={(e) => handleChange('paralysisAtSleep', e.target.checked)}
                         className="rounded" />
                  <span className="text-sm text-gray-700 dark:text-gray-300">Paralysis at sleep onset</span>
                </label>
                <label className="flex items-center gap-2">
                  <input type="checkbox" checked={data.paralysisAtWake}
                         onChange={(e) => handleChange('paralysisAtWake', e.target.checked)}
                         className="rounded" />
                  <span className="text-sm text-gray-700 dark:text-gray-300">Paralysis upon waking</span>
                </label>
                <div>
                  <label className="block text-sm text-gray-600 dark:text-gray-400 mb-1">Hallucination Type</label>
                  <select value={data.hallucinationType}
                          onChange={(e) => handleChange('hallucinationType', e.target.value)}
                          className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600">
                    <option value="">Select type...</option>
                    <option value="visual">Visual</option>
                    <option value="auditory">Auditory</option>
                    <option value="tactile">Tactile</option>
                    <option value="multiple">Multiple types</option>
                  </select>
                </div>
              </>
          )}

          {/* Treatment — always visible */}
          <div className="grid grid-cols-2 gap-3 pt-2 border-t border-blue-200 dark:border-blue-700">
            <label className="flex items-center gap-2">
              <input type="checkbox" checked={data.onStimulants}
                     onChange={(e) => handleChange('onStimulants', e.target.checked)}
                     className="rounded" />
              <span className="text-sm text-gray-700 dark:text-gray-300">On stimulant medication</span>
            </label>
            <label className="flex items-center gap-2">
              <input type="checkbox" checked={data.onSodiumOxybate}
                     onChange={(e) => handleChange('onSodiumOxybate', e.target.checked)}
                     className="rounded" />
              <span className="text-sm text-gray-700 dark:text-gray-300">On Xyrem/Xywav</span>
            </label>
            <label className="flex items-center gap-2">
              <input type="checkbox" checked={data.sleepStudyConfirmed}
                     onChange={(e) => handleChange('sleepStudyConfirmed', e.target.checked)}
                     className="rounded" />
              <span className="text-sm text-gray-700 dark:text-gray-300">MSLT sleep study confirmed</span>
            </label>
          </div>
        </div>
      </div>
  );
};

// ── Sub-form: ALS ────────────────────────────────────────────────────────────

export const ALSForm = ({ initialData = {}, onChange, selectedSymptom }) => {
  const [data, handleChange] = useSubForm(INITIAL_ALS_DATA, initialData, onChange);

  return (
      <div className="bg-rose-50 dark:bg-rose-900/20 p-4 rounded-lg border border-rose-200 dark:border-rose-800">
        <h4 className="font-medium text-rose-900 dark:text-rose-200 mb-3 flex items-center gap-2">
          ⚡ ALS Details
        </h4>
        <div className="space-y-3">
          {/* Weakness */}
          {['als-weakness', 'als-muscle-wasting'].includes(selectedSymptom) && (
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm text-gray-600 dark:text-gray-400 mb-1">Weakness Location</label>
                  <select value={data.weaknessLocation}
                          onChange={(e) => handleChange('weaknessLocation', e.target.value)}
                          className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600">
                    <option value="">Select location...</option>
                    <option value="hands">Hands</option>
                    <option value="arms">Arms</option>
                    <option value="legs">Legs</option>
                    <option value="trunk">Trunk</option>
                    <option value="bulbar">Bulbar (face/throat)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm text-gray-600 dark:text-gray-400 mb-1">Affected Side</label>
                  <select value={data.weaknessSide}
                          onChange={(e) => handleChange('weaknessSide', e.target.value)}
                          className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600">
                    <option value="">Select side...</option>
                    <option value="left">Left</option>
                    <option value="right">Right</option>
                    <option value="both">Both sides</option>
                  </select>
                </div>
              </div>
          )}

          {/* Speech/swallowing */}
          {['als-speech-changes', 'als-swallowing-difficulty'].includes(selectedSymptom) && (
              <>
                <div>
                  <label className="block text-sm text-gray-600 dark:text-gray-400 mb-1">Speech Clarity</label>
                  <select value={data.speechClarity}
                          onChange={(e) => handleChange('speechClarity', e.target.value)}
                          className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600">
                    <option value="">Select clarity...</option>
                    <option value="normal">Normal</option>
                    <option value="mild-slurred">Mild slurring</option>
                    <option value="moderate-slurred">Moderate slurring</option>
                    <option value="severe">Severely slurred</option>
                    <option value="unintelligible">Unintelligible</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm text-gray-600 dark:text-gray-400 mb-1">Swallowing — Solids</label>
                  <select value={data.swallowingSolids}
                          onChange={(e) => handleChange('swallowingSolids', e.target.value)}
                          className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600">
                    <option value="">Select...</option>
                    <option value="normal">Normal</option>
                    <option value="difficulty">Difficulty</option>
                    <option value="unable">Unable</option>
                  </select>
                </div>
              </>
          )}

          {/* Breathing */}
          {selectedSymptom === 'als-breathing-difficulty' && (
              <>
                <div>
                  <label className="block text-sm text-gray-600 dark:text-gray-400 mb-1">Breathing Difficulty</label>
                  <select value={data.breathingDifficulty}
                          onChange={(e) => handleChange('breathingDifficulty', e.target.value)}
                          className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600">
                    <option value="">Select level...</option>
                    <option value="none">None at rest</option>
                    <option value="with-exertion">With exertion</option>
                    <option value="at-rest">At rest</option>
                    <option value="using-bipap">Using BiPAP</option>
                    <option value="ventilator">On ventilator</option>
                  </select>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <label className="flex items-center gap-2">
                    <input type="checkbox" checked={data.usesBiPAP}
                           onChange={(e) => handleChange('usesBiPAP', e.target.checked)}
                           className="rounded" />
                    <span className="text-sm text-gray-700 dark:text-gray-300">Uses BiPAP</span>
                  </label>
                  <label className="flex items-center gap-2">
                    <input type="checkbox" checked={data.usesVentilator}
                           onChange={(e) => handleChange('usesVentilator', e.target.checked)}
                           className="rounded" />
                    <span className="text-sm font-medium text-red-700 dark:text-red-300">On ventilator</span>
                  </label>
                </div>
              </>
          )}

          {/* Feeding tube */}
          {selectedSymptom === 'als-feeding-tube' && (
              <div className="grid grid-cols-2 gap-3">
                <label className="flex items-center gap-2">
                  <input type="checkbox" checked={data.usesFeedingTube}
                         onChange={(e) => handleChange('usesFeedingTube', e.target.checked)}
                         className="rounded" />
                  <span className="text-sm text-gray-700 dark:text-gray-300">Uses feeding tube</span>
                </label>
              </div>
          )}

          {/* Mobility — always visible */}
          <div>
            <label className="block text-sm text-gray-600 dark:text-gray-400 mb-1">Mobility Status</label>
            <select value={data.mobilityStatus}
                    onChange={(e) => handleChange('mobilityStatus', e.target.value)}
                    className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600">
              <option value="">Select status...</option>
              <option value="ambulatory">Ambulatory (no aid)</option>
              <option value="cane">Uses cane</option>
              <option value="walker">Uses walker</option>
              <option value="wheelchair">Wheelchair</option>
              <option value="bedridden">Bedridden</option>
            </select>
          </div>
        </div>
      </div>
  );
};

// ── Sub-form: Syringomyelia ──────────────────────────────────────────────────

export const SyringomyeliaForm = ({ initialData = {}, onChange, selectedSymptom }) => {
  const [data, handleChange] = useSubForm(INITIAL_SYRINGOMYELIA_DATA, initialData, onChange);

  return (
      <div className="bg-violet-50 dark:bg-violet-900/20 p-4 rounded-lg border border-violet-200 dark:border-violet-800">
        <h4 className="font-medium text-violet-900 dark:text-violet-200 mb-3 flex items-center gap-2">
          🧬 Syringomyelia Details
        </h4>
        <div className="space-y-3">
          {/* Pain */}
          {selectedSymptom === 'syring-pain' && (
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm text-gray-600 dark:text-gray-400 mb-1">Pain Type</label>
                  <select value={data.painType}
                          onChange={(e) => handleChange('painType', e.target.value)}
                          className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600">
                    <option value="">Select type...</option>
                    <option value="burning">Burning</option>
                    <option value="aching">Aching</option>
                    <option value="stabbing">Stabbing</option>
                    <option value="electric">Electric/shock-like</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm text-gray-600 dark:text-gray-400 mb-1">Pain Location</label>
                  <select value={data.painLocation}
                          onChange={(e) => handleChange('painLocation', e.target.value)}
                          className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600">
                    <option value="">Select location...</option>
                    <option value="neck">Neck</option>
                    <option value="shoulders">Shoulders</option>
                    <option value="arms">Arms</option>
                    <option value="back">Back</option>
                    <option value="legs">Legs</option>
                  </select>
                </div>
              </div>
          )}

          {/* Sensory loss */}
          {selectedSymptom === 'syring-sensory-loss' && (
              <>
                <div>
                  <label className="block text-sm text-gray-600 dark:text-gray-400 mb-1">Sensory Loss Pattern</label>
                  <select value={data.sensoryLossPattern}
                          onChange={(e) => handleChange('sensoryLossPattern', e.target.value)}
                          className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600">
                    <option value="">Select pattern...</option>
                    <option value="cape">Cape distribution (shoulders/upper arms)</option>
                    <option value="arms">Arms</option>
                    <option value="legs">Legs</option>
                    <option value="trunk">Trunk</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm text-gray-600 dark:text-gray-400 mb-1">Temperature Insensitivity Area</label>
                  <select value={data.tempInsensitivityArea}
                          onChange={(e) => handleChange('tempInsensitivityArea', e.target.value)}
                          className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600">
                    <option value="">Select area...</option>
                    <option value="hands">Hands</option>
                    <option value="arms">Arms</option>
                    <option value="shoulders">Shoulders</option>
                    <option value="trunk">Trunk</option>
                  </select>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <label className="flex items-center gap-2">
                    <input type="checkbox" checked={data.hadBurnInjury}
                           onChange={(e) => handleChange('hadBurnInjury', e.target.checked)}
                           className="rounded" />
                    <span className="text-sm text-gray-700 dark:text-gray-300">Burn injury (temp insensitivity)</span>
                  </label>
                  <label className="flex items-center gap-2">
                    <input type="checkbox" checked={data.hadCutInjury}
                           onChange={(e) => handleChange('hadCutInjury', e.target.checked)}
                           className="rounded" />
                    <span className="text-sm text-gray-700 dark:text-gray-300">Cut injury (pain insensitivity)</span>
                  </label>
                </div>
              </>
          )}

          {/* Headache — Chiari related */}
          {selectedSymptom === 'syring-headache' && (
              <label className="flex items-center gap-2">
                <input type="checkbox" checked={data.headacheWithCough}
                       onChange={(e) => handleChange('headacheWithCough', e.target.checked)}
                       className="rounded" />
                <span className="text-sm text-gray-700 dark:text-gray-300">Headache worsens with coughing/straining (Chiari sign)</span>
              </label>
          )}

          {/* Syrinx location — always visible */}
          <div>
            <label className="block text-sm text-gray-600 dark:text-gray-400 mb-1">Syrinx Location</label>
            <select value={data.syrinxLocation}
                    onChange={(e) => handleChange('syrinxLocation', e.target.value)}
                    className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600">
              <option value="">Select location...</option>
              <option value="cervical">Cervical</option>
              <option value="thoracic">Thoracic</option>
              <option value="both">Cervical and thoracic</option>
            </select>
          </div>
        </div>
      </div>
  );
};

// ── Sub-form: Myelitis ───────────────────────────────────────────────────────

export const MyelitisForm = ({ initialData = {}, onChange, selectedSymptom }) => {
  const [data, handleChange] = useSubForm(INITIAL_MYELITIS_DATA, initialData, onChange);

  return (
      <div className="bg-cyan-50 dark:bg-cyan-900/20 p-4 rounded-lg border border-cyan-200 dark:border-cyan-800">
        <h4 className="font-medium text-cyan-900 dark:text-cyan-200 mb-3 flex items-center gap-2">
          <span>🧬</span> Myelitis Details
        </h4>
        <div className="space-y-3">
          {/* Weakness/Paralysis */}
          {['myel-weakness', 'myel-paralysis'].includes(selectedSymptom) && (
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm text-gray-600 dark:text-gray-400 mb-1">Distribution</label>
                  <select value={data.weaknessDistribution}
                          onChange={(e) => handleChange('weaknessDistribution', e.target.value)}
                          className="w-full px-3 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600">
                    <option value="">Select distribution</option>
                    <option value="paraplegia">Paraplegia (both legs)</option>
                    <option value="quadriplegia">Quadriplegia (all limbs)</option>
                    <option value="hemiplegia">Hemiplegia (one side)</option>
                    <option value="monoplegia">Monoplegia (one limb)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm text-gray-600 dark:text-gray-400 mb-1">Mobility Status</label>
                  <select value={data.mobilityStatus}
                          onChange={(e) => handleChange('mobilityStatus', e.target.value)}
                          className="w-full px-3 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600">
                    <option value="">Select status</option>
                    <option value="ambulatory">Ambulatory (no aid)</option>
                    <option value="cane">Uses cane</option>
                    <option value="walker">Uses walker</option>
                    <option value="wheelchair">Wheelchair</option>
                    <option value="bedridden">Bedridden</option>
                  </select>
                </div>
              </div>
          )}

          {/* Sensory Level */}
          {selectedSymptom === 'myel-sensory-changes' && (
              <div>
                <label className="block text-sm text-gray-600 dark:text-gray-400 mb-1">Sensory Level</label>
                <select value={data.sensoryLevel}
                        onChange={(e) => handleChange('sensoryLevel', e.target.value)}
                        className="w-full px-3 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600">
                  <option value="">Select level</option>
                  <option value="cervical">Cervical (neck level)</option>
                  <option value="thoracic-upper">Upper thoracic (chest)</option>
                  <option value="thoracic-lower">Lower thoracic (abdomen)</option>
                  <option value="lumbar">Lumbar (lower back)</option>
                </select>
              </div>
          )}

          {/* Bladder */}
          {selectedSymptom === 'myel-bladder-dysfunction' && (
              <>
                <div>
                  <label className="block text-sm text-gray-600 dark:text-gray-400 mb-1">Bladder Symptoms</label>
                  <select value={data.bladderSymptoms}
                          onChange={(e) => handleChange('bladderSymptoms', e.target.value)}
                          className="w-full px-3 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600">
                    <option value="">Select type</option>
                    <option value="retention">Retention (can't empty)</option>
                    <option value="incontinence">Incontinence</option>
                    <option value="both">Both retention and incontinence</option>
                    <option value="urgency">Urgency/frequency</option>
                  </select>
                </div>
                <label className="flex items-center gap-2">
                  <input type="checkbox" checked={data.usesCatheter}
                         onChange={(e) => handleChange('usesCatheter', e.target.checked)}
                         className="rounded" />
                  <span className="text-sm text-gray-700 dark:text-gray-300">Uses catheter</span>
                </label>
                {data.usesCatheter && (
                    <div>
                      <label className="block text-sm text-gray-600 dark:text-gray-400 mb-1">Catheter Type</label>
                      <select value={data.catheterType}
                              onChange={(e) => handleChange('catheterType', e.target.value)}
                              className="w-full px-3 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600">
                        <option value="">Select type</option>
                        <option value="intermittent">Intermittent (self-cath)</option>
                        <option value="indwelling">Indwelling (Foley)</option>
                        <option value="suprapubic">Suprapubic</option>
                      </select>
                    </div>
                )}
              </>
          )}

          {/* Bowel */}
          {selectedSymptom === 'myel-bowel-dysfunction' && (
              <>
                <div>
                  <label className="block text-sm text-gray-600 dark:text-gray-400 mb-1">Bowel Symptoms</label>
                  <select value={data.bowelSymptoms}
                          onChange={(e) => handleChange('bowelSymptoms', e.target.value)}
                          className="w-full px-3 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600">
                    <option value="">Select type</option>
                    <option value="constipation">Constipation</option>
                    <option value="incontinence">Fecal incontinence</option>
                    <option value="both">Both</option>
                  </select>
                </div>
                <label className="flex items-center gap-2">
                  <input type="checkbox" checked={data.usesBowelProgram}
                         onChange={(e) => handleChange('usesBowelProgram', e.target.checked)}
                         className="rounded" />
                  <span className="text-sm text-gray-700 dark:text-gray-300">Uses bowel program/routine</span>
                </label>
              </>
          )}

          {/* Spasticity */}
          {selectedSymptom === 'myel-spasticity' && (
              <>
                <div>
                  <label className="block text-sm text-gray-600 dark:text-gray-400 mb-1">Spasticity Location</label>
                  <select value={data.spasticityLocation}
                          onChange={(e) => handleChange('spasticityLocation', e.target.value)}
                          className="w-full px-3 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600">
                    <option value="">Select location</option>
                    <option value="legs">Legs only</option>
                    <option value="arms">Arms only</option>
                    <option value="trunk">Trunk</option>
                    <option value="all">All limbs</option>
                  </select>
                </div>
                <label className="flex items-center gap-2">
                  <input type="checkbox" checked={data.onBaclofenPump}
                         onChange={(e) => handleChange('onBaclofenPump', e.target.checked)}
                         className="rounded" />
                  <span className="text-sm text-gray-700 dark:text-gray-300">Has intrathecal baclofen pump</span>
                </label>
              </>
          )}

          {/* Cause — always visible */}
          <div>
            <label className="block text-sm text-gray-600 dark:text-gray-400 mb-1">Cause (if known)</label>
            <select value={data.causeOfMyelitis}
                    onChange={(e) => handleChange('causeOfMyelitis', e.target.value)}
                    className="w-full px-3 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600">
              <option value="">Select cause</option>
              <option value="transverse">Transverse myelitis (idiopathic)</option>
              <option value="infectious">Post-infectious</option>
              <option value="ms-related">MS-related</option>
              <option value="nmo">NMO spectrum</option>
              <option value="unknown">Unknown</option>
            </select>
          </div>
        </div>
      </div>
  );
};