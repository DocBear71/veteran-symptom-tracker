import { ChevronDown, ChevronUp } from 'lucide-react';
import { INTESTINAL_FISTULA_CRITERIA } from '../utils/ratingCriteria';
import UnderstandingYourRating from './UnderstandingYourRating.jsx';

/**
 * Intestinal Fistula Rating Card Component
 * DC 7330 - 38 CFR 4.114
 * Rated by TPN needs, drainage amount, BMI, and duration
 */
export default function IntestinalFistulaRatingCard({ analysis, expanded, onToggle }) {
  if (!analysis || !analysis.hasData) return null;

  const { supportedRating, ratingRationale, gaps, metrics } = analysis;
  const criteria = INTESTINAL_FISTULA_CRITERIA;

  const isRatingSupported = (percent) => parseInt(supportedRating) === percent;

  const getRatingRowColor = (percent, isSupported) => {
    if (!isSupported) return 'bg-gray-50 dark:bg-gray-700/30 border-gray-200 dark:border-gray-600';
    if (percent >= 100) return 'bg-red-100 dark:bg-red-900/30 border-red-300 dark:border-red-700';
    if (percent >= 60) return 'bg-orange-100 dark:bg-orange-900/30 border-orange-300 dark:border-orange-700';
    if (percent >= 30) return 'bg-amber-100 dark:bg-amber-900/30 border-amber-300 dark:border-amber-700';
    return 'bg-blue-50 dark:bg-blue-900/30 border-blue-200 dark:border-blue-700';
  };

  // Determine drainage severity
  const getDrainageSeverity = () => {
    if (metrics?.drainageHeavyLogs > 0) return { level: 'Heavy', color: 'text-red-600 dark:text-red-400', bg: 'bg-red-50 dark:bg-red-900/20' };
    if (metrics?.drainageModerateLogs > 0) return { level: 'Moderate', color: 'text-orange-600 dark:text-orange-400', bg: 'bg-orange-50 dark:bg-orange-900/20' };
    if (metrics?.drainageMinimalLogs > 0) return { level: 'Minimal', color: 'text-yellow-600 dark:text-yellow-400', bg: 'bg-yellow-50 dark:bg-yellow-900/20' };
    return { level: 'Not Logged', color: 'text-gray-400', bg: 'bg-gray-50 dark:bg-gray-700/30' };
  };

  // Determine BMI status
  const getBMIStatus = () => {
    if (metrics?.veryLowBMILogs > 0) return { level: '<16', color: 'text-red-600 dark:text-red-400', bg: 'bg-red-50 dark:bg-red-900/20' };
    if (metrics?.lowBMILogs > 0) return { level: '16-18', color: 'text-orange-600 dark:text-orange-400', bg: 'bg-orange-50 dark:bg-orange-900/20' };
    return { level: 'Normal', color: 'text-green-600 dark:text-green-400', bg: 'bg-green-50 dark:bg-green-900/20' };
  };

  const drainageInfo = getDrainageSeverity();
  const bmiInfo = getBMIStatus();

  return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden border-l-4 border-lime-500">
        {/* Collapsed Header */}
        <button
            onClick={onToggle}
            className="w-full px-6 py-4 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
        >
          <div className="flex items-center gap-3">
            <span className="text-2xl">🩹</span>
            <div className="text-left">
              <h3 className="font-semibold text-lg text-gray-900 dark:text-white">
                Intestinal Fistula
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                DC {criteria.diagnosticCode} - {criteria.cfrReference}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right">
              <div className="text-2xl font-bold text-lime-600 dark:text-lime-400">
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
              <div className="border-t border-gray-200 dark:border-gray-700" />

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
                  <div className={`p-3 rounded-lg text-center ${drainageInfo.bg}`}>
                    <div className={`text-xl font-bold ${drainageInfo.color}`}>
                      {drainageInfo.level}
                    </div>
                    <div className="text-xs text-gray-600 dark:text-gray-400">Drainage Level</div>
                  </div>
                  <div className={`p-3 rounded-lg text-center ${bmiInfo.bg}`}>
                    <div className={`text-xl font-bold ${bmiInfo.color}`}>
                      {bmiInfo.level}
                    </div>
                    <div className="text-xs text-gray-600 dark:text-gray-400">BMI Status</div>
                  </div>
                  <div className={`p-3 rounded-lg text-center ${
                      metrics?.persistentDrainageLogs > 0 ? 'bg-amber-50 dark:bg-amber-900/20' : 'bg-gray-50 dark:bg-gray-700/30'
                  }`}>
                    <div className={`text-xl font-bold ${
                        metrics?.persistentDrainageLogs > 0 ? 'text-amber-600 dark:text-amber-400' : 'text-gray-400'
                    }`}>
                      {metrics?.drainageDurationMonths || 'N/A'}
                    </div>
                    <div className="text-xs text-gray-600 dark:text-gray-400">Duration (mo)</div>
                  </div>
                </div>
                {/* Nutrition and complications row */}
                <div className="grid grid-cols-4 gap-3 mt-3">
                  <div className={`p-2 rounded-lg text-center ${
                      metrics?.tpnLogs > 0 ? 'bg-red-50 dark:bg-red-900/20' : 'bg-gray-50 dark:bg-gray-700/30'
                  }`}>
                    <div className={`text-lg font-bold ${
                        metrics?.tpnLogs > 0 ? 'text-red-600 dark:text-red-400' : 'text-gray-400'
                    }`}>
                      {metrics?.tpnLogs > 0 ? 'Yes' : 'No'}
                    </div>
                    <div className="text-xs text-gray-600 dark:text-gray-400">TPN</div>
                  </div>
                  <div className={`p-2 rounded-lg text-center ${
                      metrics?.enteralNutritionLogs > 0 ? 'bg-orange-50 dark:bg-orange-900/20' : 'bg-gray-50 dark:bg-gray-700/30'
                  }`}>
                    <div className={`text-lg font-bold ${
                        metrics?.enteralNutritionLogs > 0 ? 'text-orange-600 dark:text-orange-400' : 'text-gray-400'
                    }`}>
                      {metrics?.enteralNutritionLogs > 0 ? 'Yes' : 'No'}
                    </div>
                    <div className="text-xs text-gray-600 dark:text-gray-400">Enteral</div>
                  </div>
                  <div className={`p-2 rounded-lg text-center ${
                      metrics?.infectionLogs > 0 ? 'bg-rose-50 dark:bg-rose-900/20' : 'bg-gray-50 dark:bg-gray-700/30'
                  }`}>
                    <div className={`text-lg font-bold ${
                        metrics?.infectionLogs > 0 ? 'text-rose-600 dark:text-rose-400' : 'text-gray-400'
                    }`}>
                      {metrics?.infectionLogs || 0}
                    </div>
                    <div className="text-xs text-gray-600 dark:text-gray-400">Infections</div>
                  </div>
                  <div className={`p-2 rounded-lg text-center ${
                      metrics?.skinIrritationLogs > 0 ? 'bg-purple-50 dark:bg-purple-900/20' : 'bg-gray-50 dark:bg-gray-700/30'
                  }`}>
                    <div className={`text-lg font-bold ${
                        metrics?.skinIrritationLogs > 0 ? 'text-purple-600 dark:text-purple-400' : 'text-gray-400'
                    }`}>
                      {metrics?.skinIrritationLogs || 0}
                    </div>
                    <div className="text-xs text-gray-600 dark:text-gray-400">Skin Issues</div>
                  </div>
                </div>
              </div>

              {/* Drainage Details */}
              <div className="bg-gray-50 dark:bg-gray-700/30 rounded-lg p-3">
                <h5 className="text-sm font-medium text-gray-800 dark:text-gray-200 mb-2">
                  Drainage Documentation:
                </h5>
                <div className="grid grid-cols-3 gap-2 text-center">
                  <div>
                    <div className="text-lg font-bold text-gray-700 dark:text-gray-300">
                      {metrics?.drainageHeavyLogs || 0}
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">Heavy</div>
                    <div className="text-xs text-gray-400 dark:text-gray-500">(3+ bags/10+ pads)</div>
                  </div>
                  <div>
                    <div className="text-lg font-bold text-gray-700 dark:text-gray-300">
                      {metrics?.drainageModerateLogs || 0}
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">Moderate</div>
                  </div>
                  <div>
                    <div className="text-lg font-bold text-gray-700 dark:text-gray-300">
                      {metrics?.drainageMinimalLogs || 0}
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">Minimal</div>
                  </div>
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-2 text-center">
                  Based on 130cc ostomy bags or pad changes per day
                </p>
              </div>

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
                  diagnosticCode="7330"
                  currentRating={numericRating}
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

              {/* Rating Criteria Matrix */}
              <div className="bg-gray-50 dark:bg-gray-700/30 rounded-lg p-4">
                <h4 className="font-medium text-gray-900 dark:text-white mb-3 text-center">
                  Rating Criteria Matrix
                </h4>
                <div className="overflow-x-auto">
                  <table className="w-full text-xs">
                    <thead>
                    <tr className="border-b border-gray-300 dark:border-gray-600">
                      <th className="text-left py-2 px-1">Rating</th>
                      <th className="text-center py-2 px-1">Drainage</th>
                      <th className="text-center py-2 px-1">BMI</th>
                      <th className="text-center py-2 px-1">Duration</th>
                      <th className="text-center py-2 px-1">Nutrition</th>
                    </tr>
                    </thead>
                    <tbody className="text-gray-600 dark:text-gray-400">
                    <tr className="border-b border-gray-200 dark:border-gray-700">
                      <td className="py-2 px-1 font-medium">100%</td>
                      <td className="text-center py-2 px-1">Any</td>
                      <td className="text-center py-2 px-1">Any</td>
                      <td className="text-center py-2 px-1">Any</td>
                      <td className="text-center py-2 px-1 text-red-600 dark:text-red-400">TPN Required</td>
                    </tr>
                    <tr className="border-b border-gray-200 dark:border-gray-700">
                      <td className="py-2 px-1 font-medium">60%</td>
                      <td className="text-center py-2 px-1">Heavy</td>
                      <td className="text-center py-2 px-1">&lt;16</td>
                      <td className="text-center py-2 px-1">3+ mo</td>
                      <td className="text-center py-2 px-1">Enteral</td>
                    </tr>
                    <tr>
                      <td className="py-2 px-1 font-medium">30%</td>
                      <td className="text-center py-2 px-1">Heavy</td>
                      <td className="text-center py-2 px-1">16-18</td>
                      <td className="text-center py-2 px-1">1-3 mo</td>
                      <td className="text-center py-2 px-1">-</td>
                    </tr>
                    </tbody>
                  </table>
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
                    <span>TPN for fistula symptoms = automatic 100% rating</span>
                  </li>
                  <li className="text-sm text-blue-800 dark:text-blue-300 flex items-start gap-2">
                    <span className="text-blue-500 mt-0.5">•</span>
                    <span>Heavy drainage = 3+ ostomy bags (130cc) OR 10+ pad changes/day</span>
                  </li>
                  <li className="text-sm text-blue-800 dark:text-blue-300 flex items-start gap-2">
                    <span className="text-blue-500 mt-0.5">•</span>
                    <span>BMI is critical factor: &lt;16 vs 16-18 affects rating</span>
                  </li>
                  <li className="text-sm text-blue-800 dark:text-blue-300 flex items-start gap-2">
                    <span className="text-blue-500 mt-0.5">•</span>
                    <span>Duration matters: 1-3 months vs 3+ months</span>
                  </li>
                </ul>
              </div>

              {/* Infection Warning */}
              {metrics?.infectionLogs > 0 && (
                  <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded-lg border border-red-300 dark:border-red-700">
                    <h4 className="font-semibold text-red-900 dark:text-red-200 mb-2 flex items-center gap-2">
                      <span>⚠️</span>
                      Infection Alert
                    </h4>
                    <p className="text-sm text-red-800 dark:text-red-300">
                      Infection episodes have been documented. Ensure appropriate medical follow-up
                      and wound care management. Infections can worsen fistula outcomes.
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