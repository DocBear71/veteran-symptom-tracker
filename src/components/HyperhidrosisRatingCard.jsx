import { ChevronDown, ChevronUp } from 'lucide-react';
import { HYPERHIDROSIS_CRITERIA, getRatingRowColor, getRatingTextColor } from '../utils/ratingCriteria';
import UnderstandingYourRating from './UnderstandingYourRating.jsx';

/**
 * Hyperhidrosis Rating Card Component - Gold Standard Version
 * Displays VA rating analysis for Hyperhidrosis (DC 7832)
 * Based on 38 CFR 4.118
 *
 * Rating is based on functional impairment and therapy response:
 * - 30% = Unable to handle paper or tools due to moisture AND unresponsive to therapy
 * - 0% = Able to handle paper or tools after therapy
 */
export default function HyperhidrosisRatingCard({ analysis, expanded, onToggle }) {
  if (!analysis || !analysis.hasData) return null;

  const { supportedRating, ratingRationale, gaps, metrics } = analysis;
  const criteria = HYPERHIDROSIS_CRITERIA;

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
  const cannotHandlePaperTools = metrics?.cannotHandlePaperTools || false;
  const isTherapyUnresponsive = metrics?.isTherapyUnresponsive || false;
  const isTherapyResponsive = metrics?.isTherapyResponsive || false;
  const affectedAreas = metrics?.affectedAreas || [];

  return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden border-l-4 border-orange-500">
        {/* === COLLAPSED HEADER === */}
        <button
            onClick={onToggle}
            className="w-full px-6 py-4 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
        >
          <div className="flex items-center gap-3">
            <span className="text-2xl">💧</span>
            <div className="text-left">
              <h3 className="font-semibold text-lg text-gray-900 dark:text-white">
                Hyperhidrosis
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                DC 7832 - 38 CFR 4.118
              </p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right">
              <div className={`text-2xl font-bold ${getRatingTextColor(supportedRating)}`}>
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

                  {/* Cannot Handle Paper/Tools - KEY CRITERION */}
                  <div className={`p-3 rounded-lg text-center ${
                      cannotHandlePaperTools ? 'bg-red-50 dark:bg-red-900/20' : 'bg-gray-50 dark:bg-gray-700/30'
                  }`}>
                    <div className={`text-2xl font-bold ${
                        cannotHandlePaperTools ? 'text-red-600 dark:text-red-400' : 'text-gray-400'
                    }`}>
                      {cannotHandlePaperTools ? 'Yes' : 'No'}
                    </div>
                    <div className="text-xs text-gray-600 dark:text-gray-400">Can't Handle</div>
                    <div className="text-xs text-gray-500 dark:text-gray-500">Paper/Tools</div>
                  </div>

                  {/* Therapy Response - KEY CRITERION */}
                  <div className={`p-3 rounded-lg text-center ${
                      isTherapyUnresponsive
                          ? 'bg-orange-50 dark:bg-orange-900/20'
                          : isTherapyResponsive
                              ? 'bg-green-50 dark:bg-green-900/20'
                              : 'bg-gray-50 dark:bg-gray-700/30'
                  }`}>
                    <div className={`text-2xl font-bold ${
                        isTherapyUnresponsive
                            ? 'text-orange-600 dark:text-orange-400'
                            : isTherapyResponsive
                                ? 'text-green-600 dark:text-green-400'
                                : 'text-gray-400'
                    }`}>
                      {isTherapyUnresponsive ? 'No' : isTherapyResponsive ? 'Yes' : '?'}
                    </div>
                    <div className="text-xs text-gray-600 dark:text-gray-400">Responds to</div>
                    <div className="text-xs text-gray-500 dark:text-gray-500">Therapy</div>
                  </div>

                  {/* Affected Areas Count */}
                  <div className={`p-3 rounded-lg text-center ${
                      affectedAreas.length > 0 ? 'bg-purple-50 dark:bg-purple-900/20' : 'bg-gray-50 dark:bg-gray-700/30'
                  }`}>
                    <div className={`text-2xl font-bold ${
                        affectedAreas.length > 0 ? 'text-purple-600 dark:text-purple-400' : 'text-gray-400'
                    }`}>
                      {affectedAreas.length}
                    </div>
                    <div className="text-xs text-gray-600 dark:text-gray-400">Areas</div>
                    <div className="text-xs text-gray-500 dark:text-gray-500">Affected</div>
                  </div>
                </div>

                {/* Affected Areas Display */}
                {affectedAreas.length > 0 && (
                    <div className="mt-3 bg-gray-50 dark:bg-gray-700/30 rounded-lg p-3">
                      <div className="text-xs text-gray-600 dark:text-gray-400 mb-1">Affected Areas:</div>
                      <div className="flex flex-wrap gap-2">
                        {affectedAreas.map((area, idx) => (
                            <span
                                key={idx}
                                className="px-2 py-1 bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300 text-xs rounded-full"
                            >
                      {area}
                    </span>
                        ))}
                      </div>
                    </div>
                )}

                {/* Additional metrics row */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-3">
                  {/* Dripping Sweat */}
                  <div className={`p-3 rounded-lg text-center ${
                      metrics?.drippingSweatLogs > 0 ? 'bg-cyan-50 dark:bg-cyan-900/20' : 'bg-gray-50 dark:bg-gray-700/30'
                  }`}>
                    <div className={`text-2xl font-bold ${
                        metrics?.drippingSweatLogs > 0 ? 'text-cyan-600 dark:text-cyan-400' : 'text-gray-400'
                    }`}>
                      {metrics?.drippingSweatLogs || 0}
                    </div>
                    <div className="text-xs text-gray-600 dark:text-gray-400">Dripping</div>
                  </div>

                  {/* Occupational Impact */}
                  <div className={`p-3 rounded-lg text-center ${
                      metrics?.occupationalLogs > 0 ? 'bg-amber-50 dark:bg-amber-900/20' : 'bg-gray-50 dark:bg-gray-700/30'
                  }`}>
                    <div className={`text-2xl font-bold ${
                        metrics?.occupationalLogs > 0 ? 'text-amber-600 dark:text-amber-400' : 'text-gray-400'
                    }`}>
                      {metrics?.occupationalLogs || 0}
                    </div>
                    <div className="text-xs text-gray-600 dark:text-gray-400">Work Impact</div>
                  </div>

                  {/* Skin Complications */}
                  <div className={`p-3 rounded-lg text-center ${
                      (metrics?.macerationLogs > 0 || metrics?.infectionLogs > 0)
                          ? 'bg-rose-50 dark:bg-rose-900/20'
                          : 'bg-gray-50 dark:bg-gray-700/30'
                  }`}>
                    <div className={`text-2xl font-bold ${
                        (metrics?.macerationLogs > 0 || metrics?.infectionLogs > 0)
                            ? 'text-rose-600 dark:text-rose-400'
                            : 'text-gray-400'
                    }`}>
                      {(metrics?.macerationLogs || 0) + (metrics?.infectionLogs || 0)}
                    </div>
                    <div className="text-xs text-gray-600 dark:text-gray-400">Complications</div>
                  </div>

                  {/* Treatments Tried */}
                  <div className={`p-3 rounded-lg text-center ${
                      metrics?.treatmentLogs > 0 ? 'bg-indigo-50 dark:bg-indigo-900/20' : 'bg-gray-50 dark:bg-gray-700/30'
                  }`}>
                    <div className={`text-2xl font-bold ${
                        metrics?.treatmentLogs > 0 ? 'text-indigo-600 dark:text-indigo-400' : 'text-gray-400'
                    }`}>
                      {metrics?.treatmentLogs > 0 ? 'Yes' : 'No'}
                    </div>
                    <div className="text-xs text-gray-600 dark:text-gray-400">Treatment</div>
                  </div>
                </div>
              </div>

              {/* Key Criteria Status Banner */}
              <div className={`p-4 rounded-lg border-2 ${
                  cannotHandlePaperTools && isTherapyUnresponsive
                      ? 'bg-green-50 dark:bg-green-900/20 border-green-300 dark:border-green-700'
                      : 'bg-amber-50 dark:bg-amber-900/20 border-amber-300 dark:border-amber-700'
              }`}>
                <h4 className="font-medium text-gray-900 dark:text-white mb-2 text-center">
                  30% Rating Criteria Status
                </h4>
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center gap-2">
                <span className={`text-xl ${cannotHandlePaperTools ? '✅' : '❌'}`}>
                  {cannotHandlePaperTools ? '✅' : '❌'}
                </span>
                    <span className="text-sm text-gray-700 dark:text-gray-300">
                  Unable to handle paper/tools
                </span>
                  </div>
                  <div className="flex items-center gap-2">
                <span className={`text-xl ${isTherapyUnresponsive ? '✅' : '❌'}`}>
                  {isTherapyUnresponsive ? '✅' : '❌'}
                </span>
                    <span className="text-sm text-gray-700 dark:text-gray-300">
                  Unresponsive to therapy
                </span>
                  </div>
                </div>
                <p className="text-xs text-gray-600 dark:text-gray-400 mt-2 text-center">
                  Both criteria must be met for 30% rating
                </p>
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
                  diagnosticCode="7832"
                  currentRating={supportedRating}
              />

              {/* Section 3: VA Rating Schedule */}
              <div>
                <h4 className="font-medium text-gray-900 dark:text-white mb-2 text-center">
                  VA Rating Schedule - Hyperhidrosis
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
                    <span>Key criterion: inability to handle PAPER or TOOLS due to moisture</span>
                  </li>
                  <li className="text-sm text-blue-800 dark:text-blue-300 flex items-start gap-2">
                    <span className="text-blue-500 mt-0.5">•</span>
                    <span>Must be UNRESPONSIVE to therapy for 30% rating</span>
                  </li>
                  <li className="text-sm text-blue-800 dark:text-blue-300 flex items-start gap-2">
                    <span className="text-blue-500 mt-0.5">•</span>
                    <span>Document all treatments tried: antiperspirants, iontophoresis, Botox, oral meds, surgery</span>
                  </li>
                  <li className="text-sm text-blue-800 dark:text-blue-300 flex items-start gap-2">
                    <span className="text-blue-500 mt-0.5">•</span>
                    <span>Occupational impact statements strengthen claims</span>
                  </li>
                  <li className="text-sm text-blue-800 dark:text-blue-300 flex items-start gap-2">
                    <span className="text-blue-500 mt-0.5">•</span>
                    <span>Secondary infections or skin breakdown may warrant separate rating</span>
                  </li>
                </ul>
              </div>

              {/* Section 6: Disclaimer */}
              <div className="bg-gray-100 dark:bg-gray-700/50 rounded-lg p-3 text-xs text-gray-600 dark:text-gray-400">
                <strong>Important:</strong> Based on 38 CFR 4.118, Diagnostic Code 7832 - Hyperhidrosis.
                This analysis is for documentation purposes only. The VA makes all final rating determinations.
              </div>
            </div>
        )}
      </div>
  );
}