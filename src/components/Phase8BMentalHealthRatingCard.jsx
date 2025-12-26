import { ChevronDown, ChevronUp } from 'lucide-react';
import { MENTAL_HEALTH_SHARED_CRITERIA } from '../utils/ratingCriteria';
import UnderstandingYourRating from './UnderstandingYourRating';

/**
 * Phase 8B Mental Health Rating Card - Gold Standard Version
 * Handles: Schizophrenia, Schizoaffective, Delusional, Psychotic NOS, Brief Psychotic,
 * Binge Eating, Dissociative Identity, Dissociative Amnesia, Acute Stress,
 * Antisocial Personality, Borderline Personality, Narcissistic Personality, Avoidant Personality
 *
 * All use the General Rating Formula for Mental Disorders (38 CFR 4.130)
 */
export default function Phase8BMentalHealthRatingCard({ analysis, expanded, onToggle }) {
  if (!analysis || !analysis.hasData) return null;

  const { supportedRating, ratingRationale, gaps, evidence, metrics, condition, diagnosticCode } = analysis;
  const criteria = MENTAL_HEALTH_SHARED_CRITERIA;

  // Get appropriate emoji based on condition
  const getConditionEmoji = () => {
    const cond = (condition || '').toLowerCase();
    if (cond.includes('schizophrenia') || cond.includes('psychotic')) return '🧠';
    if (cond.includes('schizoaffective')) return '🧠';
    if (cond.includes('dissociative')) return '🌀';
    if (cond.includes('stress')) return '⚡';
    if (cond.includes('personality')) return '🎭';
    if (cond.includes('eating')) return '🍽️';
    if (cond.includes('delusional')) return '🧠';
    return '🧠';
  };

  // Normalize supportedRating to number for comparison
  const numericRating = typeof supportedRating === 'string'
      ? parseInt(supportedRating, 10)
      : supportedRating;

  const isRatingSupported = (percent) => numericRating === percent;

  // Standardized color scheme across all rating cards
  // 0% gets a distinct "supported but minimal" style visible in both light/dark modes
  const getRatingRowColor = (percent, isSupported) => {
    if (!isSupported) return 'bg-gray-50 dark:bg-gray-700/30 border-gray-200 dark:border-gray-600';
    if (percent >= 100) return 'bg-red-100 dark:bg-red-900/30 border-red-300 dark:border-red-700';
    if (percent >= 70) return 'bg-orange-100 dark:bg-orange-900/30 border-orange-300 dark:border-orange-700';
    if (percent >= 50) return 'bg-amber-100 dark:bg-amber-900/30 border-amber-300 dark:border-amber-700';
    if (percent >= 30) return 'bg-yellow-100 dark:bg-yellow-900/30 border-yellow-300 dark:border-yellow-700';
    if (percent >= 10) return 'bg-green-100 dark:bg-green-900/30 border-green-300 dark:border-green-700';
    // 0-9%: Blue-gray that's visible in both light and dark modes
    return 'bg-blue-50 dark:bg-blue-900/30 border-blue-200 dark:border-blue-700';
  };

  return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden border-l-4 border-violet-500">
        <button
            onClick={onToggle}
            className="w-full px-6 py-4 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
        >
          <div className="flex items-center gap-3">
            <span className="text-2xl">{getConditionEmoji()}</span>
            <div className="text-left">
              <h3 className="font-semibold text-lg text-gray-900 dark:text-white">
                {condition || 'Mental Health Condition'}
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                General Rating Formula for Mental Disorders
              </p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right">
              <div className="text-2xl font-bold text-violet-600 dark:text-violet-400">
                {supportedRating !== null && supportedRating !== undefined ? `${supportedRating}%` : 'N/A'}
              </div>
              <div className="text-xs text-gray-500 dark:text-gray-400">Supported Rating</div>
            </div>
            {expanded ? <ChevronUp className="w-5 h-5 text-gray-400" /> : <ChevronDown className="w-5 h-5 text-gray-400" />}
          </div>
        </button>

        {expanded && (
            <div className="px-6 pb-6 space-y-6">
              <div className="border-t border-gray-200 dark:border-gray-700" />

              {/* Evidence Summary - 4 Box Grid */}
              <div>
                <h4 className="font-medium text-gray-900 dark:text-white mb-3 text-center">Evidence Summary</h4>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg text-center">
                    <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                      {metrics?.totalLogs || 0}
                    </div>
                    <div className="text-xs text-blue-700 dark:text-blue-300">Total Logs</div>
                  </div>
                  <div className={`p-3 rounded-lg text-center ${
                      metrics?.severeSymptoms > 0 ? 'bg-red-50 dark:bg-red-900/20' : 'bg-gray-50 dark:bg-gray-700/30'
                  }`}>
                    <div className={`text-2xl font-bold ${
                        metrics?.severeSymptoms > 0 ? 'text-red-600 dark:text-red-400' : 'text-gray-400'
                    }`}>
                      {metrics?.severeSymptoms || 0}
                    </div>
                    <div className="text-xs text-gray-600 dark:text-gray-400">Severe Episodes</div>
                  </div>
                  <div className={`p-3 rounded-lg text-center ${
                      metrics?.avgSeverity ? 'bg-purple-50 dark:bg-purple-900/20' : 'bg-gray-50 dark:bg-gray-700/30'
                  }`}>
                    <div className={`text-xl font-bold ${
                        metrics?.avgSeverity ? 'text-purple-600 dark:text-purple-400' : 'text-gray-400'
                    }`}>
                      {metrics?.avgSeverity ? `${metrics.avgSeverity.toFixed(1)}` : '—'}/10
                    </div>
                    <div className="text-xs text-gray-600 dark:text-gray-400">Avg Severity</div>
                  </div>
                  <div className={`p-3 rounded-lg text-center ${
                      metrics?.hospitalized ? 'bg-red-50 dark:bg-red-900/20' : 'bg-gray-50 dark:bg-gray-700/30'
                  }`}>
                    <div className={`text-2xl font-bold ${
                        metrics?.hospitalized ? 'text-red-600 dark:text-red-400' : 'text-gray-400'
                    }`}>
                      {metrics?.hospitalized ? '⚠️' : '—'}
                    </div>
                    <div className="text-xs text-gray-600 dark:text-gray-400">Hospitalization</div>
                  </div>
                </div>
              </div>

              {/* Analysis Rationale */}
              {ratingRationale?.length > 0 && (
                  <div>
                    <h4 className="font-medium text-gray-900 dark:text-white mb-2 text-center">Analysis Rationale</h4>
                    <div className="bg-gray-50 dark:bg-gray-700/30 rounded-lg p-3 space-y-2">
                      {ratingRationale.map((item, idx) => (
                          <div key={idx} className="flex items-start gap-2">
                            <span className="text-blue-600 dark:text-blue-400 mt-0.5">◆</span>
                            <span className="text-sm text-gray-700 dark:text-gray-300">
                      {item.startsWith('•') ? item.substring(1).trim() : item}
                    </span>
                          </div>
                      ))}
                    </div>
                  </div>
              )}

              {/* VA Rating Schedule */}
              <div>
                <h4 className="font-medium text-gray-900 dark:text-white mb-2 text-center">
                  VA Rating Schedule (General Rating Formula)
                </h4>
                <div className="space-y-2">
                  {criteria.ratings.map((rating) => {
                    const isSupported = isRatingSupported(rating.percent);
                    return (
                        <div
                            key={rating.percent}
                            className={`p-3 rounded-lg border ${isSupported ? 'border-2' : ''} ${getRatingRowColor(rating.percent, isSupported)}`}
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
                            {isSupported && <span className="text-green-600 dark:text-green-400">✓</span>}
                          </div>
                        </div>
                    );
                  })}
                </div>
              </div>

              {/* Critical Indicators (Hospitalization) */}
              {metrics?.hospitalized && (
                  <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded-lg border border-red-200 dark:border-red-800">
                    <h4 className="font-semibold text-red-900 dark:text-red-200 mb-2 flex items-center gap-2">
                      <span>⚠️</span>Critical Indicators
                    </h4>
                    <ul className="space-y-1">
                      <li className="text-sm text-red-800 dark:text-red-300 font-bold">
                        Hospitalization required/recent documented
                      </li>
                      {metrics.hospitalizationCount > 0 && (
                          <li className="text-sm text-red-800 dark:text-red-300">
                            {metrics.hospitalizationCount} hospitalization(s) documented
                          </li>
                      )}
                      {metrics.dangerToSelf && (
                          <li className="text-sm text-red-800 dark:text-red-300">Danger to self documented</li>
                      )}
                      {metrics.dangerToOthers && (
                          <li className="text-sm text-red-800 dark:text-red-300">Danger to others documented</li>
                      )}
                    </ul>
                  </div>
              )}

              {/* Documentation Gaps */}
              {gaps?.length > 0 && (
                  <div>
                    <h4 className="font-medium text-gray-900 dark:text-white mb-2 text-center">Documentation Gaps</h4>
                    <div className="bg-amber-50 dark:bg-amber-900/20 rounded-lg p-3 space-y-2">
                      {gaps.map((gap, idx) => (
                          <div key={idx} className="flex items-start gap-2">
                            <span className="text-amber-600 dark:text-amber-400 mt-0.5">⚠</span>
                            <span className="text-sm text-gray-700 dark:text-gray-300">{gap}</span>
                          </div>
                      ))}
                    </div>
                  </div>
              )}

              {/* Important Information */}
              <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg border border-blue-200 dark:border-blue-800">
                <h4 className="font-semibold text-blue-900 dark:text-blue-200 mb-2 flex items-center gap-2">
                  <span>ℹ️</span>Important Information
                </h4>
                <ul className="space-y-1">
                  <li className="text-sm text-blue-800 dark:text-blue-300 flex items-start gap-2">
                    <span className="text-blue-500 mt-0.5">•</span>
                    <span>All mental health conditions use General Rating Formula</span>
                  </li>
                  <li className="text-sm text-blue-800 dark:text-blue-300 flex items-start gap-2">
                    <span className="text-blue-500 mt-0.5">•</span>
                    <span>Document occupational and social impairment levels</span>
                  </li>
                  <li className="text-sm text-blue-800 dark:text-blue-300 flex items-start gap-2">
                    <span className="text-blue-500 mt-0.5">•</span>
                    <span>Track symptom frequency, severity, and functional impact</span>
                  </li>
                </ul>
              </div>

              {/* Disclaimer */}
              <div className="bg-gray-100 dark:bg-gray-700/50 rounded-lg p-3 text-xs text-gray-600 dark:text-gray-400">
                <strong>Important:</strong> Based on 38 CFR 4.130 - General Rating Formula for Mental Disorders.
                All mental health conditions use the same rating scale based on occupational and social impairment.
                For documentation purposes only.
              </div>
            </div>
        )}
      </div>
  );
}