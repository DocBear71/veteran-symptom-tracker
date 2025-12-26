import { ChevronDown, ChevronUp } from 'lucide-react';
import { ACNE_CRITERIA, CHLORACNE_CRITERIA } from '../utils/ratingCriteria';
import UnderstandingYourRating from './UnderstandingYourRating.jsx';

/**
 * Acne/Chloracne Rating Card Component - Gold Standard Version
 * Displays VA rating analysis for Acne (DC 7828) or Chloracne (DC 7829)
 * Based on 38 CFR 4.118
 *
 * Chloracne is an Agent Orange presumptive condition with additional
 * consideration for intertriginous areas (20% rating level)
 */
export default function AcneChloracneRatingCard({ analysis, expanded, onToggle }) {
  if (!analysis || !analysis.hasData) return null;

  const { supportedRating, ratingRationale, gaps, metrics, condition, diagnosticCode } = analysis;

  // Determine which condition and criteria to use
  const isChloracne = condition === 'Chloracne' || diagnosticCode === '7829';
  const criteria = isChloracne ? CHLORACNE_CRITERIA : ACNE_CRITERIA;
  const conditionName = isChloracne ? 'Chloracne' : 'Acne';
  const dcCode = isChloracne ? '7829' : '7828';

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
    if (percent >= 30) return 'bg-yellow-100 dark:bg-yellow-900/30 border-yellow-300 dark:border-yellow-700';
    if (percent >= 20) return 'bg-lime-100 dark:bg-lime-900/30 border-lime-300 dark:border-lime-700';
    if (percent >= 10) return 'bg-green-100 dark:bg-green-900/30 border-green-300 dark:border-green-700';
    return 'bg-blue-50 dark:bg-blue-900/30 border-blue-200 dark:border-blue-700';
  };

  const totalLogs = metrics?.totalLogs || 0;
  const hasDeepAcne = isChloracne ? metrics?.hasDeepChloracne : metrics?.hasDeepAcne;
  const hasSuperficialOnly = metrics?.hasSuperficialOnly || false;

  return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden border-l-4 border-orange-500">
        {/* === COLLAPSED HEADER === */}
        <button
            onClick={onToggle}
            className="w-full px-6 py-4 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
        >
          <div className="flex items-center gap-3">
            <span className="text-2xl">{isChloracne ? '🧪' : '🔴'}</span>
            <div className="text-left">
              <h3 className="font-semibold text-lg text-gray-900 dark:text-white">
                {conditionName}
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                DC {dcCode} - 38 CFR 4.118
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

                  {/* Acne Type */}
                  <div className={`p-3 rounded-lg text-center ${
                      hasDeepAcne ? 'bg-red-50 dark:bg-red-900/20' : 'bg-gray-50 dark:bg-gray-700/30'
                  }`}>
                    <div className={`text-2xl font-bold ${
                        hasDeepAcne ? 'text-red-600 dark:text-red-400' : 'text-gray-400'
                    }`}>
                      {hasDeepAcne ? 'Deep' : 'Surface'}
                    </div>
                    <div className="text-xs text-gray-600 dark:text-gray-400">Acne Type</div>
                  </div>

                  {/* Nodules/Cysts */}
                  <div className={`p-3 rounded-lg text-center ${
                      (metrics?.nodulesLogs > 0 || metrics?.cystsLogs > 0)
                          ? 'bg-orange-50 dark:bg-orange-900/20'
                          : 'bg-gray-50 dark:bg-gray-700/30'
                  }`}>
                    <div className={`text-2xl font-bold ${
                        (metrics?.nodulesLogs > 0 || metrics?.cystsLogs > 0)
                            ? 'text-orange-600 dark:text-orange-400'
                            : 'text-gray-400'
                    }`}>
                      {(metrics?.nodulesLogs || 0) + (metrics?.cystsLogs || 0)}
                    </div>
                    <div className="text-xs text-gray-600 dark:text-gray-400">Nodule/Cyst Logs</div>
                  </div>

                  {/* Scarring */}
                  <div className={`p-3 rounded-lg text-center ${
                      metrics?.scarringLogs > 0 ? 'bg-purple-50 dark:bg-purple-900/20' : 'bg-gray-50 dark:bg-gray-700/30'
                  }`}>
                    <div className={`text-2xl font-bold ${
                        metrics?.scarringLogs > 0 ? 'text-purple-600 dark:text-purple-400' : 'text-gray-400'
                    }`}>
                      {metrics?.scarringLogs || 0}
                    </div>
                    <div className="text-xs text-gray-600 dark:text-gray-400">Scarring Logs</div>
                  </div>
                </div>

                {/* Additional metrics row for Chloracne */}
                {isChloracne && (
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mt-3">
                      {/* Intertriginous */}
                      <div className={`p-3 rounded-lg text-center ${
                          metrics?.intertriginousLogs > 0 ? 'bg-amber-50 dark:bg-amber-900/20' : 'bg-gray-50 dark:bg-gray-700/30'
                      }`}>
                        <div className={`text-2xl font-bold ${
                            metrics?.intertriginousLogs > 0 ? 'text-amber-600 dark:text-amber-400' : 'text-gray-400'
                        }`}>
                          {metrics?.intertriginousLogs || 0}
                        </div>
                        <div className="text-xs text-gray-600 dark:text-gray-400">Intertriginous</div>
                      </div>

                      {/* Agent Orange */}
                      <div className={`p-3 rounded-lg text-center ${
                          metrics?.agentOrangeLogs > 0 ? 'bg-green-50 dark:bg-green-900/20' : 'bg-gray-50 dark:bg-gray-700/30'
                      }`}>
                        <div className={`text-2xl font-bold ${
                            metrics?.agentOrangeLogs > 0 ? 'text-green-600 dark:text-green-400' : 'text-gray-400'
                        }`}>
                          {metrics?.agentOrangeLogs > 0 ? 'Yes' : 'No'}
                        </div>
                        <div className="text-xs text-gray-600 dark:text-gray-400">AO Exposure</div>
                      </div>

                      {/* Onset Documented */}
                      <div className={`p-3 rounded-lg text-center ${
                          metrics?.onsetWithinYearLogs > 0 ? 'bg-teal-50 dark:bg-teal-900/20' : 'bg-gray-50 dark:bg-gray-700/30'
                      }`}>
                        <div className={`text-2xl font-bold ${
                            metrics?.onsetWithinYearLogs > 0 ? 'text-teal-600 dark:text-teal-400' : 'text-gray-400'
                        }`}>
                          {metrics?.onsetWithinYearLogs > 0 ? 'Yes' : 'No'}
                        </div>
                        <div className="text-xs text-gray-600 dark:text-gray-400">Onset ≤1 Year</div>
                      </div>
                    </div>
                )}
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

              {/* Understanding Your Rating - Educational Content */}
              <UnderstandingYourRating
                  diagnosticCode="7829"
                  currentRating={numericRating}
              />

              {/* Section 3: VA Rating Schedule */}
              <div>
                <h4 className="font-medium text-gray-900 dark:text-white mb-2 text-center">
                  VA Rating Schedule - {conditionName}
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
                    <span>Deep acne = nodules and pus-filled cysts (not just surface breakouts)</span>
                  </li>
                  <li className="text-sm text-blue-800 dark:text-blue-300 flex items-start gap-2">
                    <span className="text-blue-500 mt-0.5">•</span>
                    <span>30% requires deep acne affecting ≥40% of face and neck</span>
                  </li>
                  {isChloracne && (
                      <>
                        <li className="text-sm text-blue-800 dark:text-blue-300 flex items-start gap-2">
                          <span className="text-blue-500 mt-0.5">•</span>
                          <span>Chloracne is an Agent Orange presumptive condition</span>
                        </li>
                        <li className="text-sm text-blue-800 dark:text-blue-300 flex items-start gap-2">
                          <span className="text-blue-500 mt-0.5">•</span>
                          <span>20% rating for intertriginous areas (armpits, groin, skin folds)</span>
                        </li>
                        <li className="text-sm text-blue-800 dark:text-blue-300 flex items-start gap-2">
                          <span className="text-blue-500 mt-0.5">•</span>
                          <span>Must manifest within 1 year of last herbicide exposure</span>
                        </li>
                      </>
                  )}
                  <li className="text-sm text-blue-800 dark:text-blue-300 flex items-start gap-2">
                    <span className="text-blue-500 mt-0.5">•</span>
                    <span>Scarring may qualify for separate/alternative rating under DC 7800-7805</span>
                  </li>
                </ul>
              </div>

              {/* Section 6: Disclaimer */}
              <div className="bg-gray-100 dark:bg-gray-700/50 rounded-lg p-3 text-xs text-gray-600 dark:text-gray-400">
                <strong>Important:</strong> Based on 38 CFR 4.118, Diagnostic Code {dcCode} - {conditionName}.
                {isChloracne && ' Chloracne is a VA presumptive condition for Agent Orange exposure.'}
                {' '}This analysis is for documentation purposes only. The VA makes all final rating determinations.
              </div>
            </div>
        )}
      </div>
  );
}