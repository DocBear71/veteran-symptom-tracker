import { ChevronDown, ChevronUp } from 'lucide-react';

/**
 * Generic Rating Card - Gold Standard Version
 * Fallback card for conditions without specific implementations
 *
 * IMPORTANT: This card looks for ratings in multiple places:
 * - criteria.ratings (standard)
 * - criteria.ratingsIncapacitatingEpisodes (intervertebral disc)
 * - criteria.ratingsGeneralFormula (alternative spine ratings)
 */
export default function GenericRatingCard({ analysis, expanded, onToggle, icon = '📋' }) {
  if (!analysis || !analysis.hasData) return null;

  const { supportedRating, rationale, evidenceGaps, metrics, condition, diagnosticCode, criteria, ratingRationale, gaps } = analysis;

  // Handle both formats
  const displayRationale = rationale || ratingRationale || [];
  const displayGaps = evidenceGaps || gaps || [];

  const isRatingSupported = (ratingPercent) => {
    if (supportedRating === null || supportedRating === undefined) return false;
    if (typeof supportedRating === 'number') return ratingPercent === supportedRating;
    if (typeof supportedRating === 'string') {
      if (supportedRating.includes('-')) {
        const [low, high] = supportedRating.split('-').map(Number);
        return ratingPercent >= low && ratingPercent <= high;
      }
      return ratingPercent === parseInt(supportedRating, 10);
    }
    return false;
  };

  const isRatingSupported = (percent) => {
    if (numericRating === null) return false;
    // For ranges, check if percent falls within
    if (typeof supportedRating === 'string' && supportedRating.includes('-')) {
      const [low, high] = supportedRating.split('-').map(p => parseInt(p, 10));
      return percent >= low && percent <= high;
    }
    return numericRating === percent;
  };

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

  // Format rating display
  const formatRating = (rating) => {
    if (rating === null || rating === undefined) return 'N/A';
    if (typeof rating === 'string') {
      if (rating.includes('Requires') || rating.includes('Clinical') || rating.includes('Not Ratable')) {
        return rating;
      }
      return rating.includes('%') ? rating : `${rating}%`;
    }
    return `${rating}%`;
  };

  // Get ratings from criteria - check multiple possible property names
  const getRatingsArray = () => {
    if (!criteria) return [];

    // Try standard ratings first
    if (criteria.ratings && Array.isArray(criteria.ratings) && criteria.ratings.length > 0) {
      return criteria.ratings;
    }

    // Try incapacitating episodes (for intervertebral disc, etc.)
    if (criteria.ratingsIncapacitatingEpisodes && Array.isArray(criteria.ratingsIncapacitatingEpisodes)) {
      return criteria.ratingsIncapacitatingEpisodes;
    }

    // Try general formula ratings
    if (criteria.ratingsGeneralFormula && Array.isArray(criteria.ratingsGeneralFormula)) {
      return criteria.ratingsGeneralFormula;
    }

    return [];
  };

  const ratings = getRatingsArray();

  return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden border-l-4 border-gray-500">
        <button
            onClick={onToggle}
            className="w-full px-6 py-4 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
        >
          <div className="flex items-center gap-3">
            <span className="text-2xl">{icon}</span>
            <div className="text-left">
              <h3 className="font-semibold text-lg text-gray-900 dark:text-white">{condition || 'Condition'}</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">DC {diagnosticCode || '0000'} - 38 CFR Part 4</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right">
              <div className="text-2xl font-bold text-gray-600 dark:text-gray-400">
                {formatRating(supportedRating)}
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
                    <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">{metrics?.totalLogs || 0}</div>
                    <div className="text-xs text-blue-700 dark:text-blue-300">Total Logs</div>
                  </div>
                  <div className={`p-3 rounded-lg text-center ${metrics?.symptomDays > 0 ? 'bg-red-50 dark:bg-red-900/20' : 'bg-gray-50 dark:bg-gray-700/30'}`}>
                    <div className={`text-2xl font-bold ${metrics?.symptomDays > 0 ? 'text-red-600 dark:text-red-400' : 'text-gray-400'}`}>{metrics?.symptomDays || 0}</div>
                    <div className="text-xs text-gray-600 dark:text-gray-400">Symptom Days</div>
                  </div>
                  <div className={`p-3 rounded-lg text-center ${metrics?.avgSeverity ? 'bg-purple-50 dark:bg-purple-900/20' : 'bg-gray-50 dark:bg-gray-700/30'}`}>
                    <div className={`text-xl font-bold ${metrics?.avgSeverity ? 'text-purple-600 dark:text-purple-400' : 'text-gray-400'}`}>{metrics?.avgSeverity || '—'}/10</div>
                    <div className="text-xs text-gray-600 dark:text-gray-400">Avg Severity</div>
                  </div>
                  <div className={`p-3 rounded-lg text-center ${metrics?.flareUps > 0 ? 'bg-orange-50 dark:bg-orange-900/20' : 'bg-gray-50 dark:bg-gray-700/30'}`}>
                    <div className={`text-2xl font-bold ${metrics?.flareUps > 0 ? 'text-orange-600 dark:text-orange-400' : 'text-gray-400'}`}>{metrics?.flareUps || 0}</div>
                    <div className="text-xs text-gray-600 dark:text-gray-400">Flare-Ups</div>
                  </div>
                </div>
              </div>

              {/* Analysis Rationale */}
              {displayRationale?.length > 0 && (
                  <div>
                    <h4 className="font-medium text-gray-900 dark:text-white mb-2 text-center">Analysis Rationale</h4>
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

              {/* VA Rating Schedule - Show if we found any ratings */}
              {ratings.length > 0 && (
                  <div>
                    <h4 className="font-medium text-gray-900 dark:text-white mb-2 text-center">VA Rating Schedule</h4>
                    <div className="space-y-2">
                      {ratings.map((rating, idx) => {
                        const percent = rating.percent ?? rating.rating ?? 0;
                        const summary = rating.summary || rating.description || rating.criteria || '';
                        const isSupported = isRatingSupported(percent);
                        return (
                            <div
                                key={idx}
                                className={`p-3 rounded-lg border ${isSupported ? 'border-2' : ''} ${getRatingRowColor(percent, isSupported)}`}
                            >
                              <div className="flex items-center gap-3">
                                <div className={`w-14 text-center font-bold ${isSupported ? 'text-gray-900 dark:text-white' : 'text-gray-500 dark:text-gray-400'}`}>
                                  {percent}%
                                </div>
                                <div className={`flex-1 text-sm ${isSupported ? 'text-gray-900 dark:text-white' : 'text-gray-500 dark:text-gray-400'}`}>
                                  {summary}
                                </div>
                                {isSupported && <span className="text-green-600 dark:text-green-400">✓</span>}
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
                    <h4 className="font-medium text-gray-900 dark:text-white mb-2 text-center">Documentation Gaps</h4>
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
                  <span>ℹ️</span>Important Information
                </h4>
                <ul className="space-y-1">
                  <li className="text-sm text-blue-800 dark:text-blue-300 flex items-start gap-2">
                    <span className="text-blue-500 mt-0.5">•</span>
                    <span>Document symptoms and their frequency</span>
                  </li>
                  <li className="text-sm text-blue-800 dark:text-blue-300 flex items-start gap-2">
                    <span className="text-blue-500 mt-0.5">•</span>
                    <span>Track functional limitations</span>
                  </li>
                </ul>
              </div>

              {/* Disclaimer */}
              <div className="bg-gray-100 dark:bg-gray-700/50 rounded-lg p-3 text-xs text-gray-600 dark:text-gray-400">
                <strong>Important:</strong> Based on 38 CFR Part 4. For documentation purposes only.
              </div>
            </div>
        )}
      </div>
  );
}