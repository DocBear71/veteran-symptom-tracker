// ============================================
// RectumAnusRatingCard.jsx
// Phase 14D: Rating card for Rectum/Anus Conditions
// DC 7332 (Sphincter), DC 7333 (Stricture), DC 7334 (Prolapse),
// DC 7335 (Fistula), DC 7336 (Hemorrhoids), DC 7337 (Pruritus Ani)
// 38 CFR 4.114
// ============================================
// GOLD STANDARD COMPLIANT - Analysis functions are in ratingCriteria.js

import { ChevronDown, ChevronUp, Info } from 'lucide-react';
import {
  SPHINCTER_CONTROL_CRITERIA,
  RECTAL_STRICTURE_CRITERIA,
  RECTAL_PROLAPSE_CRITERIA,
  ANAL_FISTULA_CRITERIA,
  HEMORRHOIDS_CRITERIA,
  PRURITUS_ANI_CRITERIA,
} from '../utils/ratingCriteria';

const RectumAnusRatingCard = ({ analysis, expanded, onToggle }) => {
  if (!analysis?.hasData) {
    return null;
  }

  const {
    supportedRating,
    rationale = [],
    evidenceGaps = [],
    metrics = {},
    diagnosticCode,
    condition,
  } = analysis;

  // Get the appropriate criteria object based on diagnostic code
  const getCriteria = () => {
    switch (diagnosticCode) {
      case '7332': return SPHINCTER_CONTROL_CRITERIA;
      case '7333': return RECTAL_STRICTURE_CRITERIA;
      case '7334': return RECTAL_PROLAPSE_CRITERIA;
      case '7335': return ANAL_FISTULA_CRITERIA;
      case '7336': return HEMORRHOIDS_CRITERIA;
      case '7337': return PRURITUS_ANI_CRITERIA;
      default: return analysis.criteria;
    }
  };

  const criteria = getCriteria();

  // Get appropriate styling based on condition
  const getConditionStyle = () => {
    switch (diagnosticCode) {
      case '7332': return { icon: '🩺', color: 'purple', label: 'Sphincter Control' };
      case '7333': return { icon: '🔬', color: 'orange', label: 'Stricture' };
      case '7334': return { icon: '⚠️', color: 'red', label: 'Prolapse' };
      case '7335': return { icon: '🩹', color: 'amber', label: 'Fistula' };
      case '7336': return { icon: '💊', color: 'blue', label: 'Hemorrhoids' };
      case '7337': return { icon: '🔍', color: 'teal', label: 'Pruritus Ani' };
      default: return { icon: '📋', color: 'gray', label: 'Anorectal' };
    }
  };

  const style = getConditionStyle();

  // Check if a rating level is supported
  const isRatingSupported = (ratingPercent) => {
    return supportedRating >= ratingPercent;
  };

  // Get row styling for rating schedule
  const getRatingRowStyle = (percent, isSupported) => {
    if (!isSupported) {
      return 'bg-gray-50 dark:bg-gray-700/30 border-gray-200 dark:border-gray-600';
    }
    if (percent === 100) return 'bg-red-50 dark:bg-red-900/20 border-red-300 dark:border-red-700';
    if (percent >= 60) return 'bg-orange-50 dark:bg-orange-900/20 border-orange-300 dark:border-orange-700';
    if (percent >= 30) return 'bg-yellow-50 dark:bg-yellow-900/20 border-yellow-300 dark:border-yellow-700';
    if (percent >= 10) return 'bg-green-50 dark:bg-green-900/20 border-green-300 dark:border-green-700';
    return 'bg-gray-50 dark:bg-gray-700/30 border-gray-200 dark:border-gray-600';
  };

  // Get condition-specific metric labels
  const getMetricLabels = () => {
    switch (diagnosticCode) {
      case '7332':
        return {
          metric1Label: 'Daily Episodes',
          metric1Key: 'dailyEpisodes',
          metric2Label: 'Weekly Episodes',
          metric2Key: 'weeklyEpisodes',
          metric3Label: 'Monthly Episodes',
          metric3Key: 'monthlyEpisodes',
        };
      case '7336':
        return {
          metric1Label: 'Bleeding Episodes',
          metric1Key: 'bleedingLogs',
          metric2Label: 'Thrombosis',
          metric2Key: 'thrombosisEpisodes',
          metric3Label: 'Prolapsed',
          metric3Key: 'prolapsedLogs',
        };
      default:
        return {
          metric1Label: 'Severe',
          metric1Key: 'severeCount',
          metric2Label: 'Moderate',
          metric2Key: 'moderateCount',
          metric3Label: 'Avg Severity',
          metric3Key: 'avgSeverity',
        };
    }
  };

  const metricLabels = getMetricLabels();

  return (
      <div className={`bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden border-l-4 border-${style.color}-500`}>
        {/* === COLLAPSED HEADER === */}
        <button
            onClick={onToggle}
            className="w-full px-6 py-4 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
        >
          <div className="flex items-center gap-3">
            <span className="text-2xl">{style.icon}</span>
            <div className="text-left">
              <h3 className="font-semibold text-lg text-gray-900 dark:text-white">
                {condition}
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                DC {diagnosticCode} - 38 CFR 4.114
              </p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right">
              <div className={`text-2xl font-bold text-${style.color}-600 dark:text-${style.color}-400`}>
                {supportedRating}%
              </div>
              <div className="text-xs text-gray-500 dark:text-gray-400">
                Supported Rating
              </div>
            </div>
            {expanded ? (
                <ChevronUp className="w-5 h-5 text-gray-400" />
            ) : (
                <ChevronDown className="w-5 h-5 text-gray-400" />
            )}
          </div>
        </button>

        {/* === EXPANDED CONTENT === */}
        {expanded && (
            <div className="px-6 pb-6 space-y-6">
              <div className="border-t border-gray-200 dark:border-gray-700" />

              {/* Section 1: Evidence Summary (4-box grid) */}
              <div>
                <h4 className="font-medium text-gray-900 dark:text-white mb-3 text-center">
                  Evidence Summary
                </h4>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {/* Total Logs */}
                  <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg text-center">
                    <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                      {metrics.totalLogs || 0}
                    </div>
                    <div className="text-xs text-blue-700 dark:text-blue-300">Total Symptoms</div>
                    <div className="text-xs text-blue-600 dark:text-blue-400">Logged</div>
                  </div>

                  {/* Metric 1 - Condition Specific */}
                  <div className="bg-red-50 dark:bg-red-900/20 p-3 rounded-lg text-center">
                    <div className="text-2xl font-bold text-red-600 dark:text-red-400">
                      {metrics[metricLabels.metric1Key] || 0}
                    </div>
                    <div className="text-xs text-red-700 dark:text-red-300">{metricLabels.metric1Label}</div>
                  </div>

                  {/* Metric 2 - Condition Specific */}
                  <div className="bg-orange-50 dark:bg-orange-900/20 p-3 rounded-lg text-center">
                    <div className="text-2xl font-bold text-orange-600 dark:text-orange-400">
                      {metrics[metricLabels.metric2Key] || 0}
                    </div>
                    <div className="text-xs text-orange-700 dark:text-orange-300">{metricLabels.metric2Label}</div>
                  </div>

                  {/* Metric 3 - Condition Specific */}
                  <div className="bg-purple-50 dark:bg-purple-900/20 p-3 rounded-lg text-center">
                    <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                      {typeof metrics[metricLabels.metric3Key] === 'number'
                          ? (metricLabels.metric3Key === 'avgSeverity'
                              ? metrics[metricLabels.metric3Key].toFixed(1)
                              : metrics[metricLabels.metric3Key])
                          : 0}
                    </div>
                    <div className="text-xs text-purple-700 dark:text-purple-300">{metricLabels.metric3Label}</div>
                  </div>
                </div>

                {/* DC 7332 Sphincter-specific indicators */}
                {diagnosticCode === '7332' && (
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-3">
                      <div className={`p-2 rounded-lg text-center ${metrics.onBowelProgram ? 'bg-green-100 dark:bg-green-900/30' : 'bg-gray-100 dark:bg-gray-700/30'}`}>
                        <div className={`text-sm font-medium ${metrics.onBowelProgram ? 'text-green-700 dark:text-green-300' : 'text-gray-500 dark:text-gray-400'}`}>
                          {metrics.onBowelProgram ? '✓ Bowel Program' : '○ No Bowel Program'}
                        </div>
                      </div>
                      <div className={`p-2 rounded-lg text-center ${metrics.requiresDigitalStim ? 'bg-orange-100 dark:bg-orange-900/30' : 'bg-gray-100 dark:bg-gray-700/30'}`}>
                        <div className={`text-sm font-medium ${metrics.requiresDigitalStim ? 'text-orange-700 dark:text-orange-300' : 'text-gray-500 dark:text-gray-400'}`}>
                          {metrics.requiresDigitalStim ? '✓ Digital Stim' : '○ No Digital Stim'}
                        </div>
                      </div>
                      <div className={`p-2 rounded-lg text-center ${metrics.requiresMedication ? 'bg-blue-100 dark:bg-blue-900/30' : 'bg-gray-100 dark:bg-gray-700/30'}`}>
                        <div className={`text-sm font-medium ${metrics.requiresMedication ? 'text-blue-700 dark:text-blue-300' : 'text-gray-500 dark:text-gray-400'}`}>
                          {metrics.requiresMedication ? '✓ Medication' : '○ No Medication'}
                        </div>
                      </div>
                      <div className={`p-2 rounded-lg text-center ${metrics.requiresSpecialDiet ? 'bg-purple-100 dark:bg-purple-900/30' : 'bg-gray-100 dark:bg-gray-700/30'}`}>
                        <div className={`text-sm font-medium ${metrics.requiresSpecialDiet ? 'text-purple-700 dark:text-purple-300' : 'text-gray-500 dark:text-gray-400'}`}>
                          {metrics.requiresSpecialDiet ? '✓ Special Diet' : '○ No Special Diet'}
                        </div>
                      </div>
                    </div>
                )}

                {/* DC 7336 Hemorrhoid-specific indicator */}
                {diagnosticCode === '7336' && (
                    <div className="flex justify-center mt-3">
                      <div className={`px-4 py-2 rounded-lg ${metrics.anemiaDocumented ? 'bg-red-100 dark:bg-red-900/30' : 'bg-gray-100 dark:bg-gray-700/30'}`}>
                  <span className={`text-sm font-medium ${metrics.anemiaDocumented ? 'text-red-700 dark:text-red-300' : 'text-gray-500 dark:text-gray-400'}`}>
                    {metrics.anemiaDocumented ? '⚠️ Anemia Documented' : '○ No Anemia Documented'}
                  </span>
                      </div>
                    </div>
                )}
              </div>

              {/* Section 2: Analysis Rationale */}
              {rationale && rationale.length > 0 && (
                  <div>
                    <h4 className="font-medium text-gray-900 dark:text-white mb-2 text-center">
                      Analysis Rationale
                    </h4>
                    <div className="bg-gray-50 dark:bg-gray-700/30 rounded-lg p-3 space-y-2">
                      {rationale.map((item, idx) => (
                          <div key={idx} className="flex items-start gap-2">
                            <span className="text-blue-600 dark:text-blue-400 mt-0.5">◆</span>
                            <span className="text-sm text-gray-700 dark:text-gray-300">{item}</span>
                          </div>
                      ))}
                    </div>
                  </div>
              )}

              {/* Section 3: VA Rating Schedule */}
              <div>
                <h4 className="font-medium text-gray-900 dark:text-white mb-2 text-center">
                  VA Rating Schedule - DC {diagnosticCode}
                </h4>
                <div className="space-y-2">
                  {criteria.ratings.map((rating, idx) => {
                    const isSupported = isRatingSupported(rating.percent);
                    return (
                        <div
                            key={idx}
                            className={`p-3 rounded-lg border ${isSupported ? 'border-2' : ''} ${getRatingRowStyle(rating.percent, isSupported)}`}
                        >
                          <div className="flex items-center gap-3">
                            <div className={`w-14 text-center font-bold ${
                                isSupported ? 'text-gray-900 dark:text-white' : 'text-gray-500 dark:text-gray-400'
                            }`}>
                              {rating.percent}%
                            </div>
                            <div className={`flex-1 text-sm ${
                                isSupported ? 'text-gray-900 dark:text-white' : 'text-gray-500 dark:text-gray-400'
                            }`}>
                              {rating.summary}
                            </div>
                            {isSupported && (
                                <span className="text-green-600 dark:text-green-400">✓</span>
                            )}
                          </div>
                        </div>
                    );
                  })}
                </div>
              </div>

              {/* Section 4: Documentation Gaps */}
              {evidenceGaps && evidenceGaps.length > 0 && (
                  <div>
                    <h4 className="font-medium text-gray-900 dark:text-white mb-2 text-center">
                      Documentation Gaps
                    </h4>
                    <div className="bg-amber-50 dark:bg-amber-900/20 rounded-lg p-3 space-y-2">
                      {evidenceGaps.map((gap, idx) => (
                          <div key={idx} className="flex items-start gap-2">
                            <span className="text-amber-600 dark:text-amber-400 mt-0.5">⚠</span>
                            <span className="text-sm text-gray-700 dark:text-gray-300">{gap}</span>
                          </div>
                      ))}
                    </div>
                  </div>
              )}

              {/* Section 5: Important Information */}
              {criteria.note && (
                  <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg border border-blue-200 dark:border-blue-800">
                    <h4 className="font-semibold text-blue-900 dark:text-blue-200 mb-2 flex items-center gap-2">
                      <Info className="w-4 h-4" />
                      Important Information
                    </h4>
                    <p className="text-sm text-blue-800 dark:text-blue-300">
                      {criteria.note}
                    </p>
                  </div>
              )}

              {/* Section 6: Disclaimer */}
              {criteria.disclaimer && (
                  <div className="bg-gray-100 dark:bg-gray-700/50 rounded-lg p-3 text-xs text-gray-600 dark:text-gray-400">
                    <strong>Important:</strong> {criteria.disclaimer}
                  </div>
              )}
            </div>
        )}
      </div>
  );
};

export default RectumAnusRatingCard;