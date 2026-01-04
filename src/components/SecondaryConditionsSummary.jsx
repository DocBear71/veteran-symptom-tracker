// ============================================
// SecondaryConditionsSummary.jsx
// Phase 15B: Compact summary component for Rating Evidence integration
// Shows relevant secondary conditions based on user's logged conditions
// ============================================

import { useState, useMemo } from 'react';
import { ChevronDown, ChevronUp, Link2, AlertCircle, ExternalLink, Star } from 'lucide-react';

/**
 * Maps condition analysis keys to their secondary conditions data
 * This bridges the analysis results from RatingEvidence to secondary conditions
 */
const CONDITION_SECONDARY_MAP = {
  // Analysis key : { criteriaKey, displayName }
  'diabetes': { key: 'DIABETES', display: 'Diabetes Mellitus', dc: '7913' },
  'ptsd': { key: 'PTSD', display: 'PTSD', dc: '9411' },
  'tinnitus': { key: 'TINNITUS', display: 'Tinnitus', dc: '6260' },
  'sleep-apnea': { key: 'SLEEP_APNEA', display: 'Sleep Apnea', dc: '6847' },
  'sleepApnea': { key: 'SLEEP_APNEA', display: 'Sleep Apnea', dc: '6847' },
  'fibromyalgia': { key: 'FIBROMYALGIA', display: 'Fibromyalgia', dc: '5025' },
  'hypertension': { key: 'HYPERTENSION', display: 'Hypertension', dc: '7101' },
  'peripheral-neuropathy': { key: 'PERIPHERAL_NEUROPATHY', display: 'Peripheral Neuropathy', dc: '8520' },
  'peripheralNeuropathy': { key: 'PERIPHERAL_NEUROPATHY', display: 'Peripheral Neuropathy', dc: '8520' },
  'parkinsons': { key: 'PARKINSONS', display: "Parkinson's Disease", dc: '8004' },
  'multiple-sclerosis': { key: 'MULTIPLE_SCLEROSIS', display: 'Multiple Sclerosis', dc: '8018' },
  'multipleSclerosis': { key: 'MULTIPLE_SCLEROSIS', display: 'Multiple Sclerosis', dc: '8018' },
  'als': { key: 'ALS', display: 'ALS', dc: '8017' },
};

/**
 * Inline secondary condition data (simplified version)
 * In production, this would import from ratingCriteria.js
 */
const SECONDARY_DATA = {
  DIABETES: {
    condition: 'Diabetes Mellitus',
    dc: '7913',
    topSecondaries: [
      { name: 'Peripheral Neuropathy', dc: '8520', nexus: 'strong' },
      { name: 'Diabetic Retinopathy', dc: '6006', nexus: 'strong' },
      { name: 'Hypertension', dc: '7101', nexus: 'strong' },
      { name: 'Coronary Artery Disease', dc: '7005', nexus: 'strong' },
      { name: 'Diabetic Nephropathy', dc: '7541', nexus: 'strong' },
      { name: 'Depression', dc: '9434', nexus: 'strong' },
      { name: 'Erectile Dysfunction', dc: '7522', nexus: 'strong', smcK: true },
    ],
  },
  PTSD: {
    condition: 'PTSD',
    dc: '9411',
    topSecondaries: [
      { name: 'Major Depression', dc: '9434', nexus: 'strong' },
      { name: 'Sleep Apnea', dc: '6847', nexus: 'moderate' },
      { name: 'Irritable Bowel Syndrome', dc: '7319', nexus: 'strong' },
      { name: 'Hypertension', dc: '7101', nexus: 'moderate' },
      { name: 'Migraines', dc: '8100', nexus: 'moderate' },
      { name: 'GERD', dc: '7346', nexus: 'moderate' },
    ],
  },
  TINNITUS: {
    condition: 'Tinnitus',
    dc: '6260',
    topSecondaries: [
      { name: 'Depression', dc: '9434', nexus: 'strong' },
      { name: 'Anxiety', dc: '9400', nexus: 'strong' },
      { name: 'Insomnia/Sleep Disturbance', dc: '6847', nexus: 'strong' },
    ],
    note: 'Tinnitus is capped at 10%, but secondary mental health conditions can significantly increase total rating.',
  },
  SLEEP_APNEA: {
    condition: 'Sleep Apnea',
    dc: '6847',
    topSecondaries: [
      { name: 'Hypertension', dc: '7101', nexus: 'strong' },
      { name: 'Coronary Artery Disease', dc: '7005', nexus: 'strong' },
      { name: 'Atrial Fibrillation', dc: '7010', nexus: 'strong' },
      { name: 'Depression', dc: '9434', nexus: 'strong' },
      { name: 'Type 2 Diabetes', dc: '7913', nexus: 'moderate' },
    ],
    canBeSecondaryTo: ['PTSD (weight gain from medications)', 'Neck conditions', 'Diabetes'],
  },
  FIBROMYALGIA: {
    condition: 'Fibromyalgia',
    dc: '5025',
    topSecondaries: [
      { name: 'Depression', dc: '9434', nexus: 'strong' },
      { name: 'Anxiety', dc: '9400', nexus: 'strong' },
      { name: 'Migraines', dc: '8100', nexus: 'strong' },
      { name: 'IBS', dc: '7319', nexus: 'strong' },
    ],
    canBeSecondaryTo: ['PTSD', 'Chronic pain conditions'],
  },
  HYPERTENSION: {
    condition: 'Hypertension',
    dc: '7101',
    topSecondaries: [
      { name: 'Hypertensive Heart Disease', dc: '7007', nexus: 'strong' },
      { name: 'Coronary Artery Disease', dc: '7005', nexus: 'strong' },
      { name: 'Chronic Kidney Disease', dc: '7530', nexus: 'strong' },
      { name: 'Stroke Residuals', dc: '8008', nexus: 'strong' },
    ],
    canBeSecondaryTo: ['Sleep Apnea', 'PTSD', 'Diabetes'],
  },
  PERIPHERAL_NEUROPATHY: {
    condition: 'Peripheral Neuropathy',
    dc: '8520',
    topSecondaries: [
      { name: 'Depression', dc: '9434', nexus: 'strong' },
      { name: 'Gait/Balance Issues', dc: '6204', nexus: 'moderate' },
    ],
    canBeSecondaryTo: ['Diabetes Mellitus', 'Toxic exposures', 'Back conditions with radiculopathy'],
  },
  PARKINSONS: {
    condition: "Parkinson's Disease",
    dc: '8004',
    topSecondaries: [
      { name: 'Depression', dc: '9434', nexus: 'strong' },
      { name: 'Dementia', dc: '9326', nexus: 'strong' },
      { name: 'Loss of Smell', dc: '6275', nexus: 'strong' },
      { name: 'Erectile Dysfunction', dc: '7522', nexus: 'strong', smcK: true },
      { name: 'Neurogenic Bladder', dc: '7542', nexus: 'strong' },
      { name: 'Sleep Disturbance', dc: '6847', nexus: 'strong' },
      { name: 'Upper Extremity Impairment', dc: '8514/5125', nexus: 'strong', smcK: true },
      { name: 'Lower Extremity Impairment', dc: '8520/5167', nexus: 'strong', smcK: true },
    ],
    note: "Parkinson's has a minimum 30% rating. Secondary conditions and SMC can significantly increase total compensation.",
  },

  MULTIPLE_SCLEROSIS: {
    condition: 'Multiple Sclerosis',
    dc: '8018',
    topSecondaries: [
      { name: 'Depression', dc: '9434', nexus: 'strong' },
      { name: 'Cognitive Impairment/Dementia', dc: '9326', nexus: 'strong' },
      { name: 'Erectile Dysfunction', dc: '7522', nexus: 'strong', smcK: true },
      { name: 'Visual Disturbances', dc: '6066/6090', nexus: 'strong' },
      { name: 'Voiding Dysfunction', dc: '7542', nexus: 'strong' },
      { name: 'Sphincter Impairment', dc: '7332', nexus: 'strong' },
      { name: 'Upper Extremity Impairment', dc: '8514/5125', nexus: 'strong', smcK: true },
      { name: 'Lower Extremity Impairment', dc: '8520/5167', nexus: 'strong', smcK: true },
    ],
    note: 'MS has minimum 30% rating. SMC-K is automatic for ED secondary to MS.',
  },

  ALS: {
    condition: 'ALS (Amyotrophic Lateral Sclerosis)',
    dc: '8017',
    topSecondaries: [
      { name: 'Erectile Dysfunction / FSAD', dc: '7522/7632', nexus: 'strong', smcK: true },
      { name: 'Respiratory Failure', dc: '6520/6847', nexus: 'strong' },
      { name: 'Swallowing Difficulty', dc: '7203', nexus: 'strong' },
      { name: 'Speech Impairment', dc: '6519', nexus: 'strong' },
      { name: 'Upper Extremity LOU', dc: '5125/5109', nexus: 'strong', smcK: true },
      { name: 'Lower Extremity LOU', dc: '5167/5110', nexus: 'strong', smcK: true },
      { name: 'Depression', dc: '9434', nexus: 'strong' },
      { name: 'Dementia (ALS-FTD)', dc: '9326', nexus: 'strong' },
    ],
    note: 'ALS has minimum 100% rating. Secondary conditions are critical for SMC, which adds compensation beyond 100%.',
  },
};

/**
 * Individual Secondary Condition Row
 */
const SecondaryRow = ({ secondary }) => {
  const nexusColors = {
    strong: 'text-green-600 dark:text-green-400 bg-green-100 dark:bg-green-900/30',
    moderate: 'text-yellow-600 dark:text-yellow-400 bg-yellow-100 dark:bg-yellow-900/30',
  };

  return (
      <div className="flex items-center justify-between py-1.5 px-2 hover:bg-gray-50 dark:hover:bg-gray-700/50 rounded">
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-700 dark:text-gray-300">{secondary.name}</span>
          <span className="text-xs text-gray-500 dark:text-gray-500">DC {secondary.dc}</span>
          {secondary.smcK && (
              <span className="px-1.5 py-0.5 bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 text-xs rounded">
            SMC-K
          </span>
          )}
        </div>
        <span className={`px-2 py-0.5 rounded text-xs font-medium ${nexusColors[secondary.nexus]}`}>
        {secondary.nexus}
      </span>
      </div>
  );
};

/**
 * Summary card for a single primary condition's secondaries
 */
const ConditionSecondaryCard = ({ conditionKey, data, isExpanded, onToggle }) => {
  const secondaryInfo = SECONDARY_DATA[data.key];
  if (!secondaryInfo) return null;

  return (
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
        <button
            onClick={onToggle}
            className="w-full px-4 py-3 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
        >
          <div className="flex items-center gap-2">
            <Link2 className="w-4 h-4 text-blue-500" />
            <span className="font-medium text-gray-900 dark:text-white">
            {secondaryInfo.condition}
          </span>
            <span className="text-xs text-gray-500">DC {secondaryInfo.dc}</span>
          </div>
          <div className="flex items-center gap-2">
          <span className="px-2 py-0.5 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 text-xs rounded-full">
            {secondaryInfo.topSecondaries.length} secondaries
          </span>
            {isExpanded ? (
                <ChevronUp className="w-4 h-4 text-gray-400" />
            ) : (
                <ChevronDown className="w-4 h-4 text-gray-400" />
            )}
          </div>
        </button>

        {isExpanded && (
            <div className="px-4 pb-3 border-t border-gray-200 dark:border-gray-700">
              {/* Top Secondaries */}
              <div className="mt-3 space-y-0.5">
                {secondaryInfo.topSecondaries.map((sec, idx) => (
                    <SecondaryRow key={idx} secondary={sec} />
                ))}
              </div>

              {/* Note if exists */}
              {secondaryInfo.note && (
                  <div className="mt-3 p-2 bg-amber-50 dark:bg-amber-900/20 rounded text-xs text-amber-800 dark:text-amber-300">
                    <AlertCircle className="w-3 h-3 inline mr-1" />
                    {secondaryInfo.note}
                  </div>
              )}

              {/* Can be secondary to */}
              {secondaryInfo.canBeSecondaryTo && (
                  <div className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                    <span className="font-medium">Can also be secondary to:</span>{' '}
                    {secondaryInfo.canBeSecondaryTo.join(', ')}
                  </div>
              )}
            </div>
        )}
      </div>
  );
};

/**
 * Main Summary Component
 * Shows secondary conditions for all conditions with logged data
 */
const SecondaryConditionsSummary = ({
                                      activeConditions = [], // Array of condition keys that have logged data
                                      onViewFullGuide,
                                      compact = false
                                    }) => {
  const [expandedCondition, setExpandedCondition] = useState(null);

  // Map active conditions to those with secondary data
  const conditionsWithSecondaries = useMemo(() => {
    return activeConditions
    .map(key => {
      const mapping = CONDITION_SECONDARY_MAP[key];
      if (mapping && SECONDARY_DATA[mapping.key]) {
        return { conditionKey: key, ...mapping };
      }
      return null;
    })
    .filter(Boolean);
  }, [activeConditions]);

  // Count total potential secondaries
  const totalSecondaries = useMemo(() => {
    return conditionsWithSecondaries.reduce((sum, cond) => {
      const data = SECONDARY_DATA[cond.key];
      return sum + (data?.topSecondaries?.length || 0);
    }, 0);
  }, [conditionsWithSecondaries]);

  if (conditionsWithSecondaries.length === 0) {
    return null; // Don't show if no conditions have secondary data
  }

  if (compact) {
    // Compact mode - just show a summary banner
    return (
        <div className="bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg p-4 text-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Link2 className="w-5 h-5" />
              <div>
                <div className="font-medium">Secondary Conditions Available</div>
                <div className="text-sm text-purple-100">
                  {totalSecondaries} potential secondaries from {conditionsWithSecondaries.length} logged condition(s)
                </div>
              </div>
            </div>
            {onViewFullGuide && (
                <button
                    onClick={onViewFullGuide}
                    className="px-4 py-2 bg-white/20 hover:bg-white/30 rounded-lg text-sm font-medium flex items-center gap-2 transition-colors"
                >
                  View Guide
                  <ExternalLink className="w-4 h-4" />
                </button>
            )}
          </div>
        </div>
    );
  }

  return (
      <div className="space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-gray-900 dark:text-white flex items-center gap-2">
            <Link2 className="w-5 h-5 text-purple-500" />
            Potential Secondary Conditions
          </h3>
          {onViewFullGuide && (
              <button
                  onClick={onViewFullGuide}
                  className="text-sm text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1"
              >
                Full Guide <ExternalLink className="w-3 h-3" />
              </button>
          )}
        </div>

        {/* Info Banner */}
        <div className="bg-purple-50 dark:bg-purple-900/20 p-3 rounded-lg text-sm text-purple-800 dark:text-purple-300">
          Based on your logged symptoms, you may be eligible for these secondary conditions.
          Click each condition to see potential claims.
        </div>

        {/* Condition Cards */}
        <div className="space-y-2">
          {conditionsWithSecondaries.map(cond => (
              <ConditionSecondaryCard
                  key={cond.conditionKey}
                  conditionKey={cond.conditionKey}
                  data={cond}
                  isExpanded={expandedCondition === cond.conditionKey}
                  onToggle={() => setExpandedCondition(
                      expandedCondition === cond.conditionKey ? null : cond.conditionKey
                  )}
              />
          ))}
        </div>

        {/* High Value Tip */}
        <div className="bg-amber-50 dark:bg-amber-900/20 p-3 rounded-lg border border-amber-200 dark:border-amber-800">
          <div className="flex items-start gap-2">
            <Star className="w-4 h-4 text-amber-600 dark:text-amber-400 mt-0.5 flex-shrink-0" />
            <div className="text-sm text-amber-800 dark:text-amber-300">
              <strong>Pro Tip:</strong> Secondary conditions can significantly increase your combined rating.
              A 50% primary with two 10% secondaries could result in a higher combined rating than the primary alone.
            </div>
          </div>
        </div>
      </div>
  );
};

export default SecondaryConditionsSummary;