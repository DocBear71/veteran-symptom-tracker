import { ChevronDown, ChevronUp } from 'lucide-react';
import { HEPATITIS_C_CRITERIA, getRatingRowColor, getRatingTextColor } from '../utils/ratingCriteria';
import UnderstandingYourRating from './UnderstandingYourRating';

/**
 * Hepatitis C Rating Card Component - Gold Standard Version
 * Displays VA rating analysis for Hepatitis C (DC 7354)
 * Based on 38 CFR 4.114
 */
export default function HepatitisCRatingCard({ analysis, expanded, onToggle }) {
  if (!analysis || !analysis.hasData) {
    return null;
  }

  const { supportedRating, ratingRationale, evidence, gaps, metrics } = analysis;
  const criteria = HEPATITIS_C_CRITERIA;

  // Helper: Check if rating is supported
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

  const totalLogs = metrics?.totalLogs || 0;

  return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden border-l-4 border-emerald-500">
        {/* === COLLAPSED HEADER === */}
        <button
            onClick={onToggle}
            className="w-full px-6 py-4 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
        >
          <div className="flex items-center gap-3">
            <span className="text-2xl">🦠</span>
            <div className="text-left">
              <h3 className="font-semibold text-lg text-gray-900 dark:text-white">
                Hepatitis C
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                DC 7354 - 38 CFR 4.114
              </p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right">
              <div className={`text-2xl font-bold ${getRatingTextColor(supportedRating)}`}>
                {supportedRating !== null ? `${supportedRating}%` : 'N/A'}
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
                  <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg text-center">
                    <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                      {totalLogs}
                    </div>
                    <div className="text-xs text-blue-700 dark:text-blue-300">Total Logs</div>
                  </div>

                  <div className={`p-3 rounded-lg text-center ${
                      metrics?.symptomCounts?.fatigue > 0
                          ? 'bg-purple-50 dark:bg-purple-900/20'
                          : 'bg-gray-50 dark:bg-gray-700/30'
                  }`}>
                    <div className={`text-2xl font-bold ${
                        metrics?.symptomCounts?.fatigue > 0
                            ? 'text-purple-600 dark:text-purple-400'
                            : 'text-gray-400 dark:text-gray-500'
                    }`}>
                      {metrics?.symptomCounts?.fatigue || 0}
                    </div>
                    <div className="text-xs text-gray-600 dark:text-gray-400">Fatigue Episodes</div>
                  </div>

                  <div className={`p-3 rounded-lg text-center ${
                      metrics?.symptomCounts?.nausea > 0
                          ? 'bg-amber-50 dark:bg-amber-900/20'
                          : 'bg-gray-50 dark:bg-gray-700/30'
                  }`}>
                    <div className={`text-2xl font-bold ${
                        metrics?.symptomCounts?.nausea > 0
                            ? 'text-amber-600 dark:text-amber-400'
                            : 'text-gray-400 dark:text-gray-500'
                    }`}>
                      {metrics?.symptomCounts?.nausea || 0}
                    </div>
                    <div className="text-xs text-gray-600 dark:text-gray-400">Nausea Episodes</div>
                  </div>

                  <div className={`p-3 rounded-lg text-center ${
                      metrics?.symptomCounts?.abdominalPain > 0
                          ? 'bg-red-50 dark:bg-red-900/20'
                          : 'bg-gray-50 dark:bg-gray-700/30'
                  }`}>
                    <div className={`text-2xl font-bold ${
                        metrics?.symptomCounts?.abdominalPain > 0
                            ? 'text-red-600 dark:text-red-400'
                            : 'text-gray-400 dark:text-gray-500'
                    }`}>
                      {metrics?.symptomCounts?.abdominalPain || 0}
                    </div>
                    <div className="text-xs text-gray-600 dark:text-gray-400">Abdominal Pain</div>
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
                            <span className="text-blue-600 dark:text-blue-400 mt-0.5">◆</span>
                            <span className="text-sm text-gray-700 dark:text-gray-300">{item}</span>
                          </div>
                      ))}
                    </div>
                  </div>
              )}

              {/* Understanding Your Rating - Educational Content */}
              <UnderstandingYourRating
                  diagnosticCode="7354"
                  currentRating={supportedRating}
              />

              {/* Section 3: VA Rating Schedule */}
              <div>
                <h4 className="font-medium text-gray-900 dark:text-white mb-2 text-center">
                  VA Rating Schedule
                </h4>
                <div className="space-y-2">
                  {criteria.ratings.map(rating => {
                    const isSupported = isRatingSupported(rating.percent);
                    return (
                        <div
                            key={rating.percent}
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
                    <span>Track fatigue, malaise, nausea, and abdominal symptoms daily</span>
                  </li>
                  <li className="text-sm text-blue-800 dark:text-blue-300 flex items-start gap-2">
                    <span className="text-blue-500 mt-0.5">•</span>
                    <span>Document weight changes over time</span>
                  </li>
                  <li className="text-sm text-blue-800 dark:text-blue-300 flex items-start gap-2">
                    <span className="text-blue-500 mt-0.5">•</span>
                    <span>Keep records of liver enzyme lab values</span>
                  </li>
                </ul>
              </div>

              {/* Section 6: Disclaimer */}
              <div className="bg-gray-100 dark:bg-gray-700/50 rounded-lg p-3 text-xs text-gray-600 dark:text-gray-400">
                <strong>Important:</strong> Based on 38 CFR 4.114, Diagnostic Code 7354 - Hepatitis C.
                This analysis is for documentation purposes only. The VA makes all final rating determinations.
              </div>
            </div>
        )}
      </div>
  );
}