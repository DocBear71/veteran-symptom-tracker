import { ChevronDown, ChevronUp } from 'lucide-react';

/**
 * Generic Joint Rating Card - Gold Standard Version
 * For musculoskeletal conditions: Ankle, Wrist, Elbow, Degenerative Arthritis
 * 38 CFR 4.71a
 *
 * Note: Analysis functions may return supportedRating as:
 * - Number (10, 20, etc.)
 * - String number ('10', '20')
 * - Range string ('0-10', '10-20')
 * - null/undefined
 */
export default function GenericJointRatingCard({
                                                 analysis,
                                                 expanded,
                                                 onToggle,
                                                 jointName,
                                                 diagnosticCode,
                                                 criteria,
                                                 icon = '🦴'
                                               }) {
  if (!analysis || !analysis.hasData) return null;

  const { supportedRating, rationale, evidenceGaps, metrics, condition, ratingRationale, gaps, evidence } = analysis;

  // Extract joint info from analysis if not provided as props
  const displayName = jointName || condition || 'Joint Condition';
  const displayCode = diagnosticCode || analysis.diagnosticCode || '5000';
  const displayCriteria = criteria || analysis.criteria;

  // Use rationale from either format
  const displayRationale = rationale || ratingRationale || [];
  const displayGaps = evidenceGaps || gaps || [];

  // Handle supportedRating that could be number, string, or range
  const formatRatingDisplay = (rating) => {
    if (rating === null || rating === undefined) return 'N/A';

    // Convert to string for processing
    const ratingStr = String(rating);

    // Check if it's a range like "0-10" or "10-20"
    if (ratingStr.includes('-')) {
      return ratingStr + '%';
    }

    // It's a single value
    return ratingStr + '%';
  };

  // For highlighting in the rating schedule, extract the max value from ranges
  const getNumericRating = (rating) => {
    if (rating === null || rating === undefined) return null;
    const ratingStr = String(rating);
    if (ratingStr.includes('-')) {
      // For ranges like "10-20", use the higher value for comparison
      const parts = ratingStr.split('-');
      return parseInt(parts[1], 10);
    }
    return parseInt(ratingStr, 10);
  };

  const numericRating = getNumericRating(supportedRating);

  const isRatingSupported = (percent) => {
    if (numericRating === null) return false;
    // For ranges, highlight if the percent falls within or at the upper bound
    const ratingStr = String(supportedRating);
    if (ratingStr.includes('-')) {
      const [low, high] = ratingStr.split('-').map(p => parseInt(p, 10));
      return percent >= low && percent <= high;
    }
    return numericRating === percent;
  };

  // Standardized color scheme across all rating cards
  const getRatingRowColor = (percent, isSupported) => {
    if (!isSupported) return 'bg-gray-50 dark:bg-gray-700/30 border-gray-200 dark:border-gray-600';
    if (percent >= 100) return 'bg-red-100 dark:bg-red-900/30 border-red-300 dark:border-red-700';
    if (percent >= 70) return 'bg-orange-100 dark:bg-orange-900/30 border-orange-300 dark:border-orange-700';
    if (percent >= 50) return 'bg-amber-100 dark:bg-amber-900/30 border-amber-300 dark:border-amber-700';
    if (percent >= 30) return 'bg-yellow-100 dark:bg-yellow-900/30 border-yellow-300 dark:border-yellow-700';
    if (percent >= 10) return 'bg-green-100 dark:bg-green-900/30 border-green-300 dark:border-green-700';
    return 'bg-gray-100 dark:bg-gray-700/30 border-gray-300 dark:border-gray-600';
  };

  return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden border-l-4 border-blue-500">
        <button
            onClick={onToggle}
            className="w-full px-6 py-4 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
        >
          <div className="flex items-center gap-3">
            <span className="text-2xl">{icon}</span>
            <div className="text-left">
              <h3 className="font-semibold text-lg text-gray-900 dark:text-white">
                {displayName}
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                DC {displayCode} - 38 CFR 4.71a
              </p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right">
              <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                {formatRatingDisplay(supportedRating)}
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
                      {metrics?.totalLogs || evidence?.length || 0}
                    </div>
                    <div className="text-xs text-blue-700 dark:text-blue-300">Total Logs</div>
                  </div>
                  <div className={`p-3 rounded-lg text-center ${
                      metrics?.painDays > 0 ? 'bg-red-50 dark:bg-red-900/20' : 'bg-gray-50 dark:bg-gray-700/30'
                  }`}>
                    <div className={`text-2xl font-bold ${
                        metrics?.painDays > 0 ? 'text-red-600 dark:text-red-400' : 'text-gray-400'
                    }`}>
                      {metrics?.painDays || 0}
                    </div>
                    <div className="text-xs text-gray-600 dark:text-gray-400">Pain Episodes</div>
                  </div>
                  <div className={`p-3 rounded-lg text-center ${
                      metrics?.avgPain ? 'bg-purple-50 dark:bg-purple-900/20' : 'bg-gray-50 dark:bg-gray-700/30'
                  }`}>
                    <div className={`text-xl font-bold ${
                        metrics?.avgPain ? 'text-purple-600 dark:text-purple-400' : 'text-gray-400'
                    }`}>
                      {metrics?.avgPain || '—'}/10
                    </div>
                    <div className="text-xs text-gray-600 dark:text-gray-400">Avg Pain</div>
                  </div>
                  <div className={`p-3 rounded-lg text-center ${
                      metrics?.limitedROM > 0 ? 'bg-orange-50 dark:bg-orange-900/20' : 'bg-gray-50 dark:bg-gray-700/30'
                  }`}>
                    <div className={`text-2xl font-bold ${
                        metrics?.limitedROM > 0 ? 'text-orange-600 dark:text-orange-400' : 'text-gray-400'
                    }`}>
                      {metrics?.limitedROM || metrics?.flareUps || 0}
                    </div>
                    <div className="text-xs text-gray-600 dark:text-gray-400">ROM Limited</div>
                  </div>
                </div>
              </div>

              {/* Analysis Rationale */}
              {displayRationale?.length > 0 && (
                  <div>
                    <h4 className="font-medium text-gray-900 dark:text-white mb-2 text-center">
                      Analysis Rationale
                    </h4>
                    <div className="bg-gray-50 dark:bg-gray-700/30 rounded-lg p-3 space-y-2">
                      {displayRationale.map((item, idx) => (
                          <div key={idx} className="flex items-start gap-2">
                            <span className="text-blue-600 dark:text-blue-400 mt-0.5">◆</span>
                            <span className="text-sm text-gray-700 dark:text-gray-300">{item}</span>
                          </div>
                      ))}
                    </div>
                  </div>
              )}

              {/* VA Rating Schedule */}
              {displayCriteria?.ratings && (
                  <div>
                    <h4 className="font-medium text-gray-900 dark:text-white mb-2 text-center">
                      VA Rating Schedule
                    </h4>
                    <div className="space-y-2">
                      {displayCriteria.ratings.map((rating, idx) => {
                        const isSupported = isRatingSupported(rating.percent);
                        return (
                            <div
                                key={`${rating.percent}-${idx}`}
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
              )}

              {/* Documentation Gaps */}
              {displayGaps?.length > 0 && (
                  <div>
                    <h4 className="font-medium text-gray-900 dark:text-white mb-2 text-center">
                      Documentation Gaps
                    </h4>
                    <div className="bg-amber-50 dark:bg-amber-900/20 rounded-lg p-3 space-y-2">
                      {displayGaps.map((gap, idx) => (
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
                  <span>ℹ️</span>
                  Important Information
                </h4>
                <ul className="space-y-1">
                  <li className="text-sm text-blue-800 dark:text-blue-300 flex items-start gap-2">
                    <span className="text-blue-500 mt-0.5">•</span>
                    <span>Range ratings require goniometer measurements for precision</span>
                  </li>
                  <li className="text-sm text-blue-800 dark:text-blue-300 flex items-start gap-2">
                    <span className="text-blue-500 mt-0.5">•</span>
                    <span>Document pain on motion and functional limitations</span>
                  </li>
                  <li className="text-sm text-blue-800 dark:text-blue-300 flex items-start gap-2">
                    <span className="text-blue-500 mt-0.5">•</span>
                    <span>Track flare-ups and additional ROM loss during flares</span>
                  </li>
                </ul>
              </div>

              {/* Disclaimer */}
              <div className="bg-gray-100 dark:bg-gray-700/50 rounded-lg p-3 text-xs text-gray-600 dark:text-gray-400">
                <strong>Important:</strong> Based on 38 CFR 4.71a - Musculoskeletal System.
                Range ratings indicate clinical documentation needed for precise rating. For documentation purposes only.
              </div>
            </div>
        )}
      </div>
  );
}