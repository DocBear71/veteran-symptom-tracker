import { ChevronDown, ChevronUp } from 'lucide-react';
import { ESOPHAGEAL_STRICTURE_CRITERIA, getRatingRowColor, getRatingTextColor } from '../utils/ratingCriteria';
import UnderstandingYourRating from './UnderstandingYourRating';
import ServiceConnectedBanner from './ServiceConnectedBanner';

/**

 * Esophageal Rating Card Component
 * DC 7203 - Esophageal Stricture
 * DC 7204 - Esophageal Spasm/Motility Disorders (rated as DC 7203)
 * 38 CFR 4.114
 */
export default function EsophagealRatingCard({ analysis, expanded, onToggle }) {
  if (!analysis || !analysis.hasData) return null;

  const { supportedRating, ratingRationale, gaps, metrics } = analysis;
  const criteria = ESOPHAGEAL_STRICTURE_CRITERIA;

  const isRatingSupported = (percent) => parseInt(supportedRating) === percent;

  // Determine condition type for display
  const getConditionType = () => {
    if (metrics?.isStrictureRelated && metrics?.isSpasmRelated) {
      return 'Stricture & Motility';
    } else if (metrics?.isSpasmRelated && !metrics?.isStrictureRelated) {
      return 'Spasm/Motility (DC 7204)';
    }
    return 'Stricture (DC 7203)';
  };

  return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden border-l-4 border-lime-500">
        {/* Collapsed Header */}
        <button
            onClick={onToggle}
            className="w-full px-6 py-4 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
        >
          <div className="flex items-center gap-3">
            <span className="text-2xl">🫁</span>
            <div className="text-left">
              <h3 className="font-semibold text-lg text-gray-900 dark:text-white">
                Esophageal {getConditionType()}
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                DC 7203/7204 - {criteria.cfrReference}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right">
              <div className={`text-2xl font-bold ${getRatingTextColor(supportedRating)}`}>
                {supportedRating !== null && supportedRating !== undefined ? `${supportedRating}%` : 'N/A'}
              </div>
              <div className="text-xs text-gray-500 dark:text-gray-400">Supported Rating</div>
            </div>
            {expanded ? (
                <ChevronUp className="w-5 h-5 text-gray-400" />
            ) : (
                <ChevronDown className="w-5 h-5 text-gray-400" />
            )}
          </div>
        </button>

        {/* Expanded Content */}
        {expanded && (
            <div className="px-6 pb-6 space-y-6">
              <div className="border-t border-gray-200dark:border-gray-700" />

              {/* Service-Connected Status Banner */}
              <ServiceConnectedBanner
                  conditionKey="esophageal"
                  currentAnalysis={analysis}
              />

              {/* Evidence Summary - 4 Box Grid */}
              <div>
                <h4 className="font-medium text-gray-900 dark:text-white mb-3 text-center">
                  Evidence Summary
                </h4>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg text-center">
                    <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                      {metrics?.totalLogs || 0}
                    </div>
                    <div className="text-xs text-blue-700 dark:text-blue-300">Total Logs</div>
                  </div>
                  <div className={`p-3 rounded-lg text-center ${
                      metrics?.totalDysphagiaLogs > 0 ? 'bg-red-50 dark:bg-red-900/20' : 'bg-gray-50 dark:bg-gray-700/30'
                  }`}>
                    <div className={`text-2xl font-bold ${
                        metrics?.totalDysphagiaLogs > 0 ? 'text-red-600 dark:text-red-400' : 'text-gray-400'
                    }`}>
                      {metrics?.totalDysphagiaLogs || 0}
                    </div>
                    <div className="text-xs text-gray-600 dark:text-gray-400">Dysphagia Episodes</div>
                  </div>
                  <div className={`p-3 rounded-lg text-center ${
                      metrics?.dilatationCount > 0 ? 'bg-amber-50 dark:bg-amber-900/20' : 'bg-gray-50 dark:bg-gray-700/30'
                  }`}>
                    <div className={`text-2xl font-bold ${
                        metrics?.dilatationCount > 0 ? 'text-amber-600 dark:text-amber-400' : 'text-gray-400'
                    }`}>
                      {metrics?.dilatationCount || 0}
                    </div>
                    <div className="text-xs text-gray-600 dark:text-gray-400">Dilatations</div>
                  </div>
                  <div className={`p-3 rounded-lg text-center ${
                      metrics?.aspirationLogs > 0 ? 'bg-orange-50 dark:bg-orange-900/20' : 'bg-gray-50 dark:bg-gray-700/30'
                  }`}>
                    <div className={`text-2xl font-bold ${
                        metrics?.aspirationLogs > 0 ? 'text-orange-600 dark:text-orange-400' : 'text-gray-400'
                    }`}>
                      {metrics?.aspirationLogs || 0}
                    </div>
                    <div className="text-xs text-gray-600 dark:text-gray-400">Aspiration Events</div>
                  </div>
                </div>
                {/* Additional metrics row */}
                <div className="grid grid-cols-4 gap-3 mt-3">
                  <div className={`p-2 rounded-lg text-center ${
                      metrics?.recurrentLogs > 0 ? 'bg-rose-50 dark:bg-rose-900/20' : 'bg-gray-50 dark:bg-gray-700/30'
                  }`}>
                    <div className={`text-lg font-bold ${
                        metrics?.recurrentLogs > 0 ? 'text-rose-600 dark:text-rose-400' : 'text-gray-400'
                    }`}>
                      {metrics?.recurrentLogs > 0 ? 'Yes' : 'No'}
                    </div>
                    <div className="text-xs text-gray-600 dark:text-gray-400">Recurrent</div>
                  </div>
                  <div className={`p-2 rounded-lg text-center ${
                      metrics?.refractoryLogs > 0 ? 'bg-red-50 dark:bg-red-900/20' : 'bg-gray-50 dark:bg-gray-700/30'
                  }`}>
                    <div className={`text-lg font-bold ${
                        metrics?.refractoryLogs > 0 ? 'text-red-600 dark:text-red-400' : 'text-gray-400'
                    }`}>
                      {metrics?.refractoryLogs > 0 ? 'Yes' : 'No'}
                    </div>
                    <div className="text-xs text-gray-600 dark:text-gray-400">Refractory</div>
                  </div>
                  <div className={`p-2 rounded-lg text-center ${
                      metrics?.pegTubeLogs > 0 ? 'bg-purple-50 dark:bg-purple-900/20' : 'bg-gray-50 dark:bg-gray-700/30'
                  }`}>
                    <div className={`text-lg font-bold ${
                        metrics?.pegTubeLogs > 0 ? 'text-purple-600 dark:text-purple-400' : 'text-gray-400'
                    }`}>
                      {metrics?.pegTubeLogs > 0 ? 'Yes' : 'No'}
                    </div>
                    <div className="text-xs text-gray-600 dark:text-gray-400">PEG Tube</div>
                  </div>
                  <div className={`p-2 rounded-lg text-center ${
                      metrics?.dailyMedLogs > 0 ? 'bg-green-50 dark:bg-green-900/20' : 'bg-gray-50 dark:bg-gray-700/30'
                  }`}>
                    <div className={`text-lg font-bold ${
                        metrics?.dailyMedLogs > 0 ? 'text-green-600 dark:text-green-400' : 'text-gray-400'
                    }`}>
                      {metrics?.dailyMedLogs > 0 ? 'Yes' : 'No'}
                    </div>
                    <div className="text-xs text-gray-600 dark:text-gray-400">Daily Meds</div>
                  </div>
                </div>
              </div>

              {/* Spasm-specific metrics if applicable */}
              {metrics?.isSpasmRelated && (
                  <div className="bg-purple-50 dark:bg-purple-900/20 rounded-lg p-3">
                    <h5 className="text-sm font-medium text-purple-800 dark:text-purple-200 mb-2">
                      Motility/Spasm Symptoms:
                    </h5>
                    <div className="grid grid-cols-2 gap-2">
                      <div className="text-sm text-purple-700 dark:text-purple-300">
                        Chest Pain: {metrics?.spasmChestPainLogs || 0} episodes
                      </div>
                      <div className="text-sm text-purple-700 dark:text-purple-300">
                        Achalasia: {metrics?.achalasiaLogs > 0 ? 'Documented' : 'Not logged'}
                      </div>
                    </div>
                    <p className="text-xs text-purple-600 dark:text-purple-400 mt-2">
                      DC 7204 (Esophageal Spasm) is rated using DC 7203 criteria
                    </p>
                  </div>
              )}

              {/* Analysis Rationale */}
              {ratingRationale?.length > 0 && (
                  <div>
                    <h4 className="font-medium text-gray-900 dark:text-white mb-2 text-center">
                      Analysis Rationale
                    </h4>
                    <div className="bg-gray-50 dark:bg-gray-700/30 rounded-lg p-3 space-y-2">
                      {ratingRationale.map((item, idx) => (
                          <div key={idx} className="flex items-start gap-2">
                            <span className="text-lime-600 dark:text-lime-400 mt-0.5">◆</span>
                            <span className="text-sm text-gray-700 dark:text-gray-300">{item}</span>
                          </div>
                      ))}
                    </div>
                  </div>
              )}

              {/* Understanding Your Rating - Educational Content */}
              <UnderstandingYourRating
                  diagnosticCode="7203"
                  currentRating={supportedRating}
              />

              {/* VA Rating Schedule */}
              <div>
                <h4 className="font-medium text-gray-900 dark:text-white mb-2 text-center">
                  VA Rating Schedule
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
                            {isSupported && (
                                <span className="text-green-600 dark:text-green-400">✓</span>
                            )}
                          </div>
                        </div>
                    );
                  })}
                </div>
              </div>

              {/* Documentation Gaps */}
              {gaps?.length > 0 && (
                  <div>
                    <h4 className="font-medium text-gray-900 dark:text-white mb-2 text-center">
                      Documentation Gaps
                    </h4>
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

              {/* Definitions */}
              <div className="bg-gray-50 dark:bg-gray-700/30 rounded-lg p-4">
                <h4 className="font-medium text-gray-900 dark:text-white mb-3">Key Definitions</h4>
                <div className="space-y-2 text-sm">
                  <div>
                    <span className="font-medium text-gray-800 dark:text-gray-200">Recurrent Stricture:</span>
                    <span className="text-gray-600 dark:text-gray-400 ml-1">
                  Cannot maintain target diameter (&gt;14mm) for more than 4 weeks
                </span>
                  </div>
                  <div>
                    <span className="font-medium text-gray-800 dark:text-gray-200">Refractory Stricture:</span>
                    <span className="text-gray-600 dark:text-gray-400 ml-1">
                  Cannot achieve target diameter after 5+ dilatations at 2-week intervals
                </span>
                  </div>
                </div>
              </div>

              {/* Important Information */}
              <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg border border-blue-200 dark:border-blue-800">
                <h4 className="font-semibold text-blue-900 dark:text-blue-200 mb-2 flex items-center gap-2">
                  <span>ℹ️</span>
                  Important Information
                </h4>
                <ul className="space-y-1">
                  <li className="text-sm text-blue-800 dark:text-blue-300 flex items-start gap-2">
                    <span className="text-blue-500 mt-0.5">•</span>
                    <span>DC 7204 (Spasm/Motility) uses DC 7203 criteria</span>
                  </li>
                  <li className="text-sm text-blue-800 dark:text-blue-300 flex items-start gap-2">
                    <span className="text-blue-500 mt-0.5">•</span>
                    <span>Dilatation frequency is key: ≥3/year = 50%, ≤2/year = 30%</span>
                  </li>
                  <li className="text-sm text-blue-800 dark:text-blue-300 flex items-start gap-2">
                    <span className="text-blue-500 mt-0.5">•</span>
                    <span>PEG tube with undernutrition indicates 80% rating</span>
                  </li>
                  <li className="text-sm text-blue-800 dark:text-blue-300 flex items-start gap-2">
                    <span className="text-blue-500 mt-0.5">•</span>
                    <span>Includes: achalasia, diffuse spasm, corkscrew/nutcracker esophagus</span>
                  </li>
                </ul>
              </div>

              {/* Aspiration Warning */}
              {metrics?.aspirationLogs > 0 && (
                  <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded-lg border border-red-300 dark:border-red-700">
                    <h4 className="font-semibold text-red-900 dark:text-red-200 mb-2 flex items-center gap-2">
                      <span>⚠️</span>
                      Aspiration Risk
                    </h4>
                    <p className="text-sm text-red-800 dark:text-red-300">
                      Aspiration events have been documented. Ensure pulmonary evaluation is current
                      and discuss aspiration precautions with your healthcare provider.
                    </p>
                  </div>
              )}

              {/* Disclaimer */}
              <div className="bg-gray-100 dark:bg-gray-700/50 rounded-lg p-3 text-xs text-gray-600 dark:text-gray-400">
                <strong>Important:</strong> {criteria.disclaimer}
              </div>
            </div>
        )}
      </div>
  );
}