import { ChevronDown, ChevronUp } from 'lucide-react';
import { ALOPECIA_AREATA_CRITERIA } from '../utils/ratingCriteria';

/**
 * Alopecia Areata Rating Card Component - Gold Standard Version
 * Displays VA rating analysis for Alopecia Areata (DC 7831)
 * Based on 38 CFR 4.118
 *
 * Rating is straightforward:
 * - 10% = Loss of ALL body hair (alopecia universalis)
 * - 0% = Hair loss limited to scalp and face only
 */
export default function AlopeciaAreataRatingCard({ analysis, expanded, onToggle }) {
  if (!analysis || !analysis.hasData) return null;

  const { supportedRating, ratingRationale, gaps, metrics } = analysis;
  const criteria = ALOPECIA_AREATA_CRITERIA;

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

  // Standardized color scheme - Skin conditions use orange
  const getRatingRowColor = (percent, isSupported) => {
    if (!isSupported) return 'bg-gray-50 dark:bg-gray-700/30 border-gray-200 dark:border-gray-600';
    if (percent >= 10) return 'bg-green-100 dark:bg-green-900/30 border-green-300 dark:border-green-700';
    return 'bg-blue-50 dark:bg-blue-900/30 border-blue-200 dark:border-blue-700';
  };

  const totalLogs = metrics?.totalLogs || 0;
  const hasAllBodyHairLoss = metrics?.hasAllBodyHairLoss || false;
  const hasScalpLoss = metrics?.hasScalpLoss || false;
  const hasFacialLoss = metrics?.hasFacialLoss || false;
  const hasBodyHairLoss = metrics?.hasBodyHairLoss || false;

  return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden border-l-4 border-orange-500">
        {/* === COLLAPSED HEADER === */}
        <button
            onClick={onToggle}
            className="w-full px-6 py-4 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
        >
          <div className="flex items-center gap-3">
            <span className="text-2xl">👤</span>
            <div className="text-left">
              <h3 className="font-semibold text-lg text-gray-900 dark:text-white">
                Alopecia Areata
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                DC 7831 - 38 CFR 4.118
              </p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right">
              <div className="text-2xl font-bold text-orange-600 dark:text-orange-400">
                {supportedRating !== null && supportedRating !== undefined ? `${supportedRating}%` : 'N/A'}
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
                      {totalLogs}
                    </div>
                    <div className="text-xs text-blue-700 dark:text-blue-300">Total Logs</div>
                  </div>

                  {/* Scalp Loss */}
                  <div className={`p-3 rounded-lg text-center ${
                      hasScalpLoss ? 'bg-orange-50 dark:bg-orange-900/20' : 'bg-gray-50 dark:bg-gray-700/30'
                  }`}>
                    <div className={`text-2xl font-bold ${
                        hasScalpLoss ? 'text-orange-600 dark:text-orange-400' : 'text-gray-400'
                    }`}>
                      {hasScalpLoss ? 'Yes' : 'No'}
                    </div>
                    <div className="text-xs text-gray-600 dark:text-gray-400">Scalp Loss</div>
                  </div>

                  {/* Facial Loss */}
                  <div className={`p-3 rounded-lg text-center ${
                      hasFacialLoss ? 'bg-purple-50 dark:bg-purple-900/20' : 'bg-gray-50 dark:bg-gray-700/30'
                  }`}>
                    <div className={`text-2xl font-bold ${
                        hasFacialLoss ? 'text-purple-600 dark:text-purple-400' : 'text-gray-400'
                    }`}>
                      {hasFacialLoss ? 'Yes' : 'No'}
                    </div>
                    <div className="text-xs text-gray-600 dark:text-gray-400">Facial Loss</div>
                  </div>

                  {/* All Body Hair - Key Criterion */}
                  <div className={`p-3 rounded-lg text-center ${
                      hasAllBodyHairLoss ? 'bg-green-50 dark:bg-green-900/20' : 'bg-gray-50 dark:bg-gray-700/30'
                  }`}>
                    <div className={`text-2xl font-bold ${
                        hasAllBodyHairLoss ? 'text-green-600 dark:text-green-400' : 'text-gray-400'
                    }`}>
                      {hasAllBodyHairLoss ? 'Yes' : 'No'}
                    </div>
                    <div className="text-xs text-gray-600 dark:text-gray-400">ALL Body Hair</div>
                  </div>
                </div>

                {/* Additional metrics row */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-3">
                  {/* Nail Changes */}
                  <div className={`p-3 rounded-lg text-center ${
                      metrics?.nailChangesLogs > 0 ? 'bg-amber-50 dark:bg-amber-900/20' : 'bg-gray-50 dark:bg-gray-700/30'
                  }`}>
                    <div className={`text-2xl font-bold ${
                        metrics?.nailChangesLogs > 0 ? 'text-amber-600 dark:text-amber-400' : 'text-gray-400'
                    }`}>
                      {metrics?.nailChangesLogs || 0}
                    </div>
                    <div className="text-xs text-gray-600 dark:text-gray-400">Nail Changes</div>
                  </div>

                  {/* Regrowth */}
                  <div className={`p-3 rounded-lg text-center ${
                      metrics?.regrowthLogs > 0 ? 'bg-teal-50 dark:bg-teal-900/20' : 'bg-gray-50 dark:bg-gray-700/30'
                  }`}>
                    <div className={`text-2xl font-bold ${
                        metrics?.regrowthLogs > 0 ? 'text-teal-600 dark:text-teal-400' : 'text-gray-400'
                    }`}>
                      {metrics?.regrowthLogs || 0}
                    </div>
                    <div className="text-xs text-gray-600 dark:text-gray-400">Regrowth</div>
                  </div>

                  {/* Recurrent */}
                  <div className={`p-3 rounded-lg text-center ${
                      metrics?.recurrentLogs > 0 ? 'bg-red-50 dark:bg-red-900/20' : 'bg-gray-50 dark:bg-gray-700/30'
                  }`}>
                    <div className={`text-2xl font-bold ${
                        metrics?.recurrentLogs > 0 ? 'text-red-600 dark:text-red-400' : 'text-gray-400'
                    }`}>
                      {metrics?.recurrentLogs || 0}
                    </div>
                    <div className="text-xs text-gray-600 dark:text-gray-400">Recurrent</div>
                  </div>

                  {/* Treatment */}
                  <div className={`p-3 rounded-lg text-center ${
                      metrics?.treatmentLogs > 0 ? 'bg-indigo-50 dark:bg-indigo-900/20' : 'bg-gray-50 dark:bg-gray-700/30'
                  }`}>
                    <div className={`text-2xl font-bold ${
                        metrics?.treatmentLogs > 0 ? 'text-indigo-600 dark:text-indigo-400' : 'text-gray-400'
                    }`}>
                      {metrics?.treatmentLogs || 0}
                    </div>
                    <div className="text-xs text-gray-600 dark:text-gray-400">Treatment</div>
                  </div>
                </div>
              </div>

              {/* Section 2: Analysis Rationale */}
              {ratingRationale && ratingRationale.length > 0 && (
                  <div>
                    <h4 className="font-medium text-gray-900 dark:text-white mb-2 text-center">
                      Analysis Rationale
                    </h4>
                    <div className="bg-gray-50 dark:bg-gray-700/30 rounded-lg p-3 space-y-2">
                      {ratingRationale.map((item, idx) => (
                          <div key={idx} className="flex items-start gap-2">
                            <span className="text-orange-600 dark:text-orange-400 mt-0.5">◆</span>
                            <span className="text-sm text-gray-700 dark:text-gray-300">{item}</span>
                          </div>
                      ))}
                    </div>
                  </div>
              )}

              {/* Section 3: VA Rating Schedule */}
              <div>
                <h4 className="font-medium text-gray-900 dark:text-white mb-2 text-center">
                  VA Rating Schedule - Alopecia Areata
                </h4>
                <div className="space-y-2">
                  {criteria.ratings.map((rating, idx) => {
                    const isSupported = isRatingSupported(rating.percent);
                    return (
                        <div
                            key={idx}
                            className={`p-3 rounded-lg border ${isSupported ? 'border-2' : ''} ${getRatingRowColor(rating.percent, isSupported)}`}
                        >
                          <div className="flex items-center gap-3">
                            <div className={`w-14 text-center font-bold ${isSupported ? 'text-gray-900 dark:text-white' : 'text-gray-500 dark:text-gray-400'}`}>
                              {rating.percent}%
                            </div>
                            <div className={`flex-1 text-sm ${isSupported ? 'text-gray-900 dark:text-white' : 'text-gray-500 dark:text-gray-400'}`}>
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
              {gaps && gaps.length > 0 && (
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

              {/* Section 5: Important Information */}
              <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg border border-blue-200 dark:border-blue-800">
                <h4 className="font-semibold text-blue-900 dark:text-blue-200 mb-2 flex items-center gap-2">
                  <span>ℹ️</span>
                  Important Information
                </h4>
                <ul className="space-y-1">
                  <li className="text-sm text-blue-800 dark:text-blue-300 flex items-start gap-2">
                    <span className="text-blue-500 mt-0.5">•</span>
                    <span>10% rating ONLY available for loss of ALL body hair (alopecia universalis)</span>
                  </li>
                  <li className="text-sm text-blue-800 dark:text-blue-300 flex items-start gap-2">
                    <span className="text-blue-500 mt-0.5">•</span>
                    <span>Complete scalp loss (alopecia totalis) still rates 0% without body hair loss</span>
                  </li>
                  <li className="text-sm text-blue-800 dark:text-blue-300 flex items-start gap-2">
                    <span className="text-blue-500 mt-0.5">•</span>
                    <span>Facial hair loss (eyebrows, eyelashes, beard) alone rates 0%</span>
                  </li>
                  <li className="text-sm text-blue-800 dark:text-blue-300 flex items-start gap-2">
                    <span className="text-blue-500 mt-0.5">•</span>
                    <span>Consider secondary mental health rating for psychological impact</span>
                  </li>
                  <li className="text-sm text-blue-800 dark:text-blue-300 flex items-start gap-2">
                    <span className="text-blue-500 mt-0.5">•</span>
                    <span>Scarring alopecia (DC 7830) has different criteria based on scalp %</span>
                  </li>
                </ul>
              </div>

              {/* Section 6: Disclaimer */}
              <div className="bg-gray-100 dark:bg-gray-700/50 rounded-lg p-3 text-xs text-gray-600 dark:text-gray-400">
                <strong>Important:</strong> Based on 38 CFR 4.118, Diagnostic Code 7831 - Alopecia Areata.
                This analysis is for documentation purposes only. The VA makes all final rating determinations.
              </div>
            </div>
        )}
      </div>
  );
}