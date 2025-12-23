import { ChevronDown, ChevronUp } from 'lucide-react';

/**
 * Multi-Joint Arthritis Rating Card - DC 5002
 * Phase 4B: Musculoskeletal System
 * 38 CFR 4.71a - Has its own unique rating schedule for active inflammatory process
 * Examples: Rheumatoid arthritis, psoriatic arthritis, spondyloarthropathies
 */
export default function MultiJointArthritisRatingCard({ analysis, expanded, onToggle }) {
  if (!analysis || !analysis.hasData) return null;

  const { supportedRating, ratingRationale, gaps, metrics, criteria } = analysis;

  // Handle supportedRating that could be number, string, or range
  const formatRatingDisplay = (rating) => {
    if (rating === null || rating === undefined) return 'N/A';
    const ratingStr = String(rating);
    return ratingStr.includes('-') ? ratingStr + '%' : ratingStr + '%';
  };

  // For highlighting in the rating schedule
  const getNumericRating = (rating) => {
    if (rating === null || rating === undefined) return null;
    const ratingStr = String(rating);
    if (ratingStr.includes('-')) {
      const parts = ratingStr.split('-');
      return parseInt(parts[1], 10);
    }
    return parseInt(ratingStr, 10);
  };

  const numericRating = getNumericRating(supportedRating);

  const isRatingSupported = (percent) => {
    if (numericRating === null) return false;
    const ratingStr = String(supportedRating);
    if (ratingStr.includes('-')) {
      const [low, high] = ratingStr.split('-').map(p => parseInt(p, 10));
      return percent >= low && percent <= high;
    }
    return numericRating === percent;
  };

  const getRatingRowColor = (percent, isSupported) => {
    if (!isSupported) return 'bg-gray-50 dark:bg-gray-700/30 border-gray-200 dark:border-gray-600';
    if (percent >= 100) return 'bg-red-100 dark:bg-red-900/30 border-red-300 dark:border-red-700';
    if (percent >= 70) return 'bg-orange-100 dark:bg-orange-900/30 border-orange-300 dark:border-orange-700';
    if (percent >= 50) return 'bg-amber-100 dark:bg-amber-900/30 border-amber-300 dark:border-amber-700';
    if (percent >= 30) return 'bg-yellow-100 dark:bg-yellow-900/30 border-yellow-300 dark:border-yellow-700';
    if (percent >= 10) return 'bg-green-100 dark:bg-green-900/30 border-green-300 dark:border-green-700';
    return 'bg-blue-50 dark:bg-blue-900/30 border-blue-200 dark:border-blue-700';
  };

  return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden border-l-4 border-amber-500">
        <button
            onClick={onToggle}
            className="w-full px-6 py-4 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
        >
          <div className="flex items-center gap-3">
            <span className="text-2xl">🔥</span>
            <div className="text-left">
              <h3 className="font-semibold text-lg text-gray-900 dark:text-white">
                Multi-Joint Arthritis
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                DC 5002 - 38 CFR 4.71a (Active Process)
              </p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right">
              <div className="text-2xl font-bold text-amber-600 dark:text-amber-400">
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
                  <div className="bg-amber-50 dark:bg-amber-900/20 p-3 rounded-lg text-center">
                    <div className="text-2xl font-bold text-amber-600 dark:text-amber-400">
                      {metrics?.totalLogs || 0}
                    </div>
                    <div className="text-xs text-amber-700 dark:text-amber-300">Total Logs</div>
                  </div>
                  <div className={`p-3 rounded-lg text-center ${
                      metrics?.painDays > 0 ? 'bg-red-50 dark:bg-red-900/20' : 'bg-gray-50 dark:bg-gray-700/30'
                  }`}>
                    <div className={`text-2xl font-bold ${
                        metrics?.painDays > 0 ? 'text-red-600 dark:text-red-400' : 'text-gray-400'
                    }`}>
                      {metrics?.painDays || 0}
                    </div>
                    <div className="text-xs text-gray-600 dark:text-gray-400">Joint Pain</div>
                  </div>
                  <div className={`p-3 rounded-lg text-center ${
                      metrics?.incapacitatingEpisodes > 0 ? 'bg-purple-50 dark:bg-purple-900/20' : 'bg-gray-50 dark:bg-gray-700/30'
                  }`}>
                    <div className={`text-2xl font-bold ${
                        metrics?.incapacitatingEpisodes > 0 ? 'text-purple-600 dark:text-purple-400' : 'text-gray-400'
                    }`}>
                      {metrics?.incapacitatingEpisodes || 0}
                    </div>
                    <div className="text-xs text-gray-600 dark:text-gray-400">Incapacitating</div>
                  </div>
                  <div className={`p-3 rounded-lg text-center ${
                      metrics?.flareUps > 0 ? 'bg-orange-50 dark:bg-orange-900/20' : 'bg-gray-50 dark:bg-gray-700/30'
                  }`}>
                    <div className={`text-2xl font-bold ${
                        metrics?.flareUps > 0 ? 'text-orange-600 dark:text-orange-400' : 'text-gray-400'
                    }`}>
                      {metrics?.flareUps || 0}
                    </div>
                    <div className="text-xs text-gray-600 dark:text-gray-400">Flare-Ups</div>
                  </div>
                </div>
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
                            <span className="text-amber-600 dark:text-amber-400 mt-0.5">◆</span>
                            <span className="text-sm text-gray-700 dark:text-gray-300">{item}</span>
                          </div>
                      ))}
                    </div>
                  </div>
              )}

              {/* VA Rating Schedule */}
              {criteria?.ratings && (
                  <div>
                    <h4 className="font-medium text-gray-900 dark:text-white mb-2 text-center">
                      VA Rating Schedule (Active Process)
                    </h4>
                    <div className="space-y-2">
                      {criteria.ratings.map((rating, idx) => {
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
                                    <span className="text-green-600 dark:text-green-400">✔</span>
                                )}
                              </div>
                            </div>
                        );
                      })}
                    </div>
                  </div>
              )}

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

              {/* Conditions Rated Under DC 5002 */}
              <div className="bg-amber-50 dark:bg-amber-900/20 p-4 rounded-lg border border-amber-200 dark:border-amber-800">
                <h4 className="font-semibold text-amber-900 dark:text-amber-200 mb-2 flex items-center gap-2">
                  <span>ℹ️</span>
                  Conditions Rated Under DC 5002
                </h4>
                <ul className="space-y-1">
                  <li className="text-sm text-amber-800 dark:text-amber-300 flex items-start gap-2">
                    <span className="text-amber-500 mt-0.5">•</span>
                    <span><strong>Rheumatoid Arthritis:</strong> Autoimmune attacking joint lining</span>
                  </li>
                  <li className="text-sm text-amber-800 dark:text-amber-300 flex items-start gap-2">
                    <span className="text-amber-500 mt-0.5">•</span>
                    <span><strong>Psoriatic Arthritis:</strong> Inflammatory arthritis with psoriasis</span>
                  </li>
                  <li className="text-sm text-amber-800 dark:text-amber-300 flex items-start gap-2">
                    <span className="text-amber-500 mt-0.5">•</span>
                    <span><strong>Ankylosing Spondylitis:</strong> Spine and sacroiliac inflammation</span>
                  </li>
                  <li className="text-sm text-amber-800 dark:text-amber-300 flex items-start gap-2">
                    <span className="text-amber-500 mt-0.5">•</span>
                    <span><strong>Reactive Arthritis:</strong> Triggered by infection elsewhere</span>
                  </li>
                  <li className="text-sm text-amber-800 dark:text-amber-300 flex items-start gap-2">
                    <span className="text-amber-500 mt-0.5">•</span>
                    <span><strong>Key labs:</strong> ESR, CRP, RF (rheumatoid factor), anti-CCP</span>
                  </li>
                </ul>
              </div>

              {/* Important Note - Active vs Chronic */}
              <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg border border-blue-200 dark:border-blue-800">
                <h4 className="font-semibold text-blue-900 dark:text-blue-200 mb-2 flex items-center gap-2">
                  <span>📋</span>
                  Active Process vs. Chronic Residuals
                </h4>
                <ul className="space-y-1">
                  <li className="text-sm text-blue-800 dark:text-blue-300 flex items-start gap-2">
                    <span className="text-blue-500 mt-0.5">•</span>
                    <span><strong>DC 5002:</strong> Rates the ACTIVE inflammatory process</span>
                  </li>
                  <li className="text-sm text-blue-800 dark:text-blue-300 flex items-start gap-2">
                    <span className="text-blue-500 mt-0.5">•</span>
                    <span><strong>DC 5003:</strong> Rates CHRONIC RESIDUALS after inflammation resolves</span>
                  </li>
                  <li className="text-sm text-blue-800 dark:text-blue-300 flex items-start gap-2">
                    <span className="text-blue-500 mt-0.5">•</span>
                    <span><strong>Cannot combine:</strong> Active process and residual ratings - use higher</span>
                  </li>
                </ul>
              </div>

              {/* Disclaimer */}
              <div className="bg-gray-100 dark:bg-gray-700/50 rounded-lg p-3 text-xs text-gray-600 dark:text-gray-400">
                <strong>Important:</strong> {criteria?.disclaimer || 'Multi-joint arthritis (DC 5002) rates the ACTIVE inflammatory process. For chronic residuals after inflammation resolves, rate under DC 5003. For documentation purposes only.'}
              </div>
            </div>
        )}
      </div>
  );
}