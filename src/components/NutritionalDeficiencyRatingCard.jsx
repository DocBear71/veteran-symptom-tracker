// ============================================
// NutritionalDeficiencyRatingCard.jsx
// Phase 14E: Rating card for Nutritional Deficiencies
// DC 6313 (Avitaminosis), DC 6314 (Beriberi), DC 6315 (Pellagra)
// 38 CFR 4.88b
// ============================================
// GOLD STANDARD COMPLIANT - Analysis functions are in ratingCriteria.js

import { ChevronDown, ChevronUp, Info } from 'lucide-react';
import {
  AVITAMINOSIS_CRITERIA,
  BERIBERI_CRITERIA,
  PELLAGRA_CRITERIA,
} from '../utils/ratingCriteria';

const NutritionalDeficiencyRatingCard = ({ analysis, expanded, onToggle }) => {
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
      case '6313': return AVITAMINOSIS_CRITERIA;
      case '6314': return BERIBERI_CRITERIA;
      case '6315': return PELLAGRA_CRITERIA;
      default: return analysis.criteria;
    }
  };

  const criteria = getCriteria();

  // Get appropriate styling based on condition
  const getConditionStyle = () => {
    switch (diagnosticCode) {
      case '6313': return { icon: '💊', color: 'orange', label: 'Avitaminosis' };
      case '6314': return { icon: '🫀', color: 'red', label: 'Beriberi' };
      case '6315': return { icon: '🌞', color: 'amber', label: 'Pellagra' };
      default: return { icon: '🍎', color: 'green', label: 'Nutritional' };
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
    if (percent >= 40) return 'bg-yellow-50 dark:bg-yellow-900/20 border-yellow-300 dark:border-yellow-700';
    if (percent >= 20) return 'bg-lime-50 dark:bg-lime-900/20 border-lime-300 dark:border-lime-700';
    if (percent >= 10) return 'bg-green-50 dark:bg-green-900/20 border-green-300 dark:border-green-700';
    return 'bg-gray-50 dark:bg-gray-700/30 border-gray-200 dark:border-gray-600';
  };

  // Get condition-specific metric labels
  const getMetricConfig = () => {
    switch (diagnosticCode) {
      case '6313': // Avitaminosis
        return [
          { key: 'hasStomatitis', label: 'Stomatitis', type: 'boolean' },
          { key: 'hasDiarrhea', label: 'Diarrhea', type: 'boolean' },
          { key: 'hasDermatitis', label: 'Dermatitis', type: 'boolean' },
          { key: 'hasMentalChanges', label: 'Mental Changes', type: 'boolean' },
        ];
      case '6314': // Beriberi
        return [
          { key: 'wetBeriberi', label: 'Wet (Cardiac)', type: 'boolean' },
          { key: 'dryBeriberi', label: 'Dry (Neuro)', type: 'boolean' },
          { key: 'wernickeKorsakoff', label: 'W-K Syndrome', type: 'boolean' },
          { key: 'hasCardiacInvolvement', label: 'Heart', type: 'boolean' },
        ];
      case '6315': // Pellagra
        return [
          { key: 'hasDermatitis', label: 'Dermatitis', type: 'boolean' },
          { key: 'hasDiarrhea', label: 'Diarrhea', type: 'boolean' },
          { key: 'hasMentalChanges', label: 'Dementia', type: 'boolean' },
          { key: 'hasCasalNecklace', label: 'Casal\'s', type: 'boolean' },
        ];
      default:
        return [];
    }
  };

  const metricConfig = getMetricConfig();

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
                DC {diagnosticCode} - 38 CFR 4.88b
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

                  {/* Condition-specific boolean indicators */}
                  {metricConfig.slice(0, 3).map((config, idx) => {
                    const value = metrics[config.key];
                    const colors = ['red', 'orange', 'purple'][idx];
                    return (
                        <div
                            key={config.key}
                            className={`p-3 rounded-lg text-center ${
                                value
                                    ? `bg-${colors}-50 dark:bg-${colors}-900/20`
                                    : 'bg-gray-100 dark:bg-gray-700/30'
                            }`}
                        >
                          <div className={`text-2xl font-bold ${
                              value
                                  ? `text-${colors}-600 dark:text-${colors}-400`
                                  : 'text-gray-400 dark:text-gray-500'
                          }`}>
                            {value ? '✓' : '○'}
                          </div>
                          <div className={`text-xs ${
                              value
                                  ? `text-${colors}-700 dark:text-${colors}-300`
                                  : 'text-gray-500 dark:text-gray-400'
                          }`}>
                            {config.label}
                          </div>
                        </div>
                    );
                  })}
                </div>

                {/* Additional indicators row for specific conditions */}
                {diagnosticCode === '6314' && (
                    <div className="grid grid-cols-2 gap-3 mt-3">
                      <div className={`p-2 rounded-lg text-center ${
                          metrics.hasCardiacInvolvement
                              ? 'bg-red-100 dark:bg-red-900/30'
                              : 'bg-gray-100 dark:bg-gray-700/30'
                      }`}>
                  <span className={`text-sm font-medium ${
                      metrics.hasCardiacInvolvement
                          ? 'text-red-700 dark:text-red-300'
                          : 'text-gray-500 dark:text-gray-400'
                  }`}>
                    {metrics.hasCardiacInvolvement ? '⚠️ Cardiac Involvement' : '○ No Cardiac Involvement'}
                  </span>
                      </div>
                      <div className={`p-2 rounded-lg text-center ${
                          metrics.hasNeurologicalInvolvement
                              ? 'bg-purple-100 dark:bg-purple-900/30'
                              : 'bg-gray-100 dark:bg-gray-700/30'
                      }`}>
                  <span className={`text-sm font-medium ${
                      metrics.hasNeurologicalInvolvement
                          ? 'text-purple-700 dark:text-purple-300'
                          : 'text-gray-500 dark:text-gray-400'
                  }`}>
                    {metrics.hasNeurologicalInvolvement ? '⚠️ Neuro Involvement' : '○ No Neuro Involvement'}
                  </span>
                      </div>
                    </div>
                )}

                {diagnosticCode === '6315' && metrics.classicTriad && (
                    <div className="mt-3 p-3 bg-amber-100 dark:bg-amber-900/30 rounded-lg text-center">
                <span className="text-sm font-medium text-amber-700 dark:text-amber-300">
                  ⚠️ Classic Pellagra Triad Present: Dermatitis + Diarrhea + Dementia
                </span>
                    </div>
                )}

                {diagnosticCode === '6313' && metrics.hasCachexia && (
                    <div className="mt-3 p-3 bg-red-100 dark:bg-red-900/30 rounded-lg text-center">
                <span className="text-sm font-medium text-red-700 dark:text-red-300">
                  ⚠️ Cachexia (Severe Wasting) Documented
                </span>
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

              {/* Condition-specific info boxes */}
              {diagnosticCode === '6314' && (
                  <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-lg border border-purple-200 dark:border-purple-800">
                    <h4 className="font-semibold text-purple-900 dark:text-purple-200 mb-2">
                      Beriberi Types
                    </h4>
                    <div className="grid grid-cols-2 gap-3 text-sm">
                      <div>
                        <span className="font-medium text-purple-800 dark:text-purple-300">Wet Beriberi:</span>
                        <p className="text-purple-700 dark:text-purple-400">Affects heart - CHF, edema, cardiomegaly</p>
                      </div>
                      <div>
                        <span className="font-medium text-purple-800 dark:text-purple-300">Dry Beriberi:</span>
                        <p className="text-purple-700 dark:text-purple-400">Affects nerves - neuropathy, footdrop, atrophy</p>
                      </div>
                    </div>
                  </div>
              )}

              {diagnosticCode === '6315' && (
                  <div className="bg-amber-50 dark:bg-amber-900/20 p-4 rounded-lg border border-amber-200 dark:border-amber-800">
                    <h4 className="font-semibold text-amber-900 dark:text-amber-200 mb-2">
                      The "4 D's" of Pellagra
                    </h4>
                    <div className="grid grid-cols-4 gap-2 text-center text-sm">
                      <div className={`p-2 rounded ${metrics.hasDermatitis ? 'bg-amber-200 dark:bg-amber-800' : 'bg-gray-200 dark:bg-gray-700'}`}>
                        <span className="font-medium">Dermatitis</span>
                      </div>
                      <div className={`p-2 rounded ${metrics.hasDiarrhea ? 'bg-amber-200 dark:bg-amber-800' : 'bg-gray-200 dark:bg-gray-700'}`}>
                        <span className="font-medium">Diarrhea</span>
                      </div>
                      <div className={`p-2 rounded ${metrics.hasMentalChanges ? 'bg-amber-200 dark:bg-amber-800' : 'bg-gray-200 dark:bg-gray-700'}`}>
                        <span className="font-medium">Dementia</span>
                      </div>
                      <div className="p-2 rounded bg-gray-200 dark:bg-gray-700">
                        <span className="font-medium text-gray-500">Death*</span>
                      </div>
                    </div>
                    <p className="text-xs text-amber-700 dark:text-amber-400 mt-2">*If untreated</p>
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

export default NutritionalDeficiencyRatingCard;