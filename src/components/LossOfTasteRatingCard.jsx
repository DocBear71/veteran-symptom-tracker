import { ChevronDown, ChevronUp } from 'lucide-react';
import { LOSS_OF_TASTE_CRITERIA, getRatingRowColor, getRatingTextColor } from '../utils/ratingCriteria';
import UnderstandingYourRating from './UnderstandingYourRating';
import ServiceConnectedBanner from './ServiceConnectedBanner';

/**
 * Loss of Taste (Ageusia) Rating Card Component - Gold Standard Version
 * DC 6276 - 38 CFR 4.87a
 *
 * Rating: 10% for complete loss of sense of taste with diagnosed cause
 * Common secondary to: COVID-19, Medications, TBI, Bell's Palsy, Diabetes
 */
export default function LossOfTasteRatingCard({ analysis, expanded, onToggle }) {
  if (!analysis || !analysis.hasData) return null;

  const { supportedRating, rationale, evidenceGaps, metrics } = analysis;
  const criteria = LOSS_OF_TASTE_CRITERIA;

  // Normalize rating for comparison
  const normalizeRating = (rating) => {
    if (rating === null || rating === undefined) return null;
    if (typeof rating === 'number') return rating;
    if (typeof rating === 'string') return parseInt(rating, 10);
    return null;
  };

  const numericRating = normalizeRating(supportedRating);
  const isRatingSupported = (percent) => numericRating === percent;

  return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden border-l-4 border-cyan-500">
        {/* === COLLAPSED HEADER === */}
        <button
            onClick={onToggle}
            className="w-full px-6 py-4 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
        >
          <div className="flex items-center gap-3">
            <span className="text-2xl">👅</span>
            <div className="text-left">
              <h3 className="font-semibold text-lg text-gray-900 dark:text-white">
                Loss of Taste (Ageusia)
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                DC 6276 - 38 CFR 4.87a
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

              {/* Service-Connected Status Banner */}
              <ServiceConnectedBanner
                  conditionKey="loss-of-taste"
                  currentAnalysis={analysis}
              />

              {/* Section 1: Evidence Summary (4-box grid) */}
              <div>
                <h4 className="font-medium text-gray-900 dark:text-white mb-3 text-center">
                  Evidence Summary
                </h4>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {/* Total Logs */}
                  <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg text-center">
                    <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                      {metrics?.totalLogs || 0}
                    </div>
                    <div className="text-xs text-blue-700 dark:text-blue-300">
                      Total Logs
                    </div>
                  </div>

                  {/* Complete Loss */}
                  <div className={`p-3 rounded-lg text-center ${
                      metrics?.hasCompleteLoss
                          ? 'bg-red-50 dark:bg-red-900/20'
                          : 'bg-gray-50 dark:bg-gray-700/30'
                  }`}>
                    <div className={`text-2xl font-bold ${
                        metrics?.hasCompleteLoss
                            ? 'text-red-600 dark:text-red-400'
                            : 'text-gray-400'
                    }`}>
                      {metrics?.hasCompleteLoss ? '✓' : '—'}
                    </div>
                    <div className="text-xs text-gray-600 dark:text-gray-400">
                      Complete Loss
                    </div>
                  </div>

                  {/* Tastes Affected */}
                  <div className={`p-3 rounded-lg text-center ${
                      metrics?.tastesAffected > 0
                          ? 'bg-purple-50 dark:bg-purple-900/20'
                          : 'bg-gray-50 dark:bg-gray-700/30'
                  }`}>
                    <div className={`text-2xl font-bold ${
                        metrics?.tastesAffected > 0
                            ? 'text-purple-600 dark:text-purple-400'
                            : 'text-gray-400'
                    }`}>
                      {metrics?.tastesAffected || 0}/5
                    </div>
                    <div className="text-xs text-gray-600 dark:text-gray-400">
                      Tastes Lost
                    </div>
                  </div>

                  {/* Testing Done */}
                  <div className={`p-3 rounded-lg text-center ${
                      metrics?.testingCount > 0
                          ? 'bg-green-50 dark:bg-green-900/20'
                          : 'bg-gray-50 dark:bg-gray-700/30'
                  }`}>
                    <div className={`text-2xl font-bold ${
                        metrics?.testingCount > 0
                            ? 'text-green-600 dark:text-green-400'
                            : 'text-gray-400'
                    }`}>
                      {metrics?.testingCount > 0 ? '✓' : '—'}
                    </div>
                    <div className="text-xs text-gray-600 dark:text-gray-400">
                      Testing Done
                    </div>
                  </div>
                </div>

                {/* Taste Types Grid */}
                <div className="mt-3">
                  <div className="text-xs text-gray-500 dark:text-gray-400 text-center mb-2">
                    Basic Tastes Affected
                  </div>
                  <div className="grid grid-cols-5 gap-2">
                    {[
                      { name: 'Sweet', count: metrics?.sweetLossCount },
                      { name: 'Salty', count: metrics?.saltyLossCount },
                      { name: 'Sour', count: metrics?.sourLossCount },
                      { name: 'Bitter', count: metrics?.bitterLossCount },
                      { name: 'Umami', count: metrics?.umamiLossCount },
                    ].map((taste) => (
                        <div
                            key={taste.name}
                            className={`p-2 rounded text-center text-xs ${
                                taste.count > 0
                                    ? 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300'
                                    : 'bg-gray-100 dark:bg-gray-700/30 text-gray-400'
                            }`}
                        >
                          {taste.name}
                          {taste.count > 0 && <span className="block font-bold">✗</span>}
                        </div>
                    ))}
                  </div>
                </div>

                {/* Additional Metrics Row */}
                <div className="grid grid-cols-3 gap-3 mt-3">
                  {/* Cause Documented */}
                  <div className={`p-2 rounded-lg text-center ${
                      metrics?.hasDiagnosedCause
                          ? 'bg-teal-50 dark:bg-teal-900/20'
                          : 'bg-gray-50 dark:bg-gray-700/30'
                  }`}>
                    <div className={`text-lg font-bold ${
                        metrics?.hasDiagnosedCause
                            ? 'text-teal-600 dark:text-teal-400'
                            : 'text-gray-400'
                    }`}>
                      {metrics?.hasDiagnosedCause ? '✓' : '—'}
                    </div>
                    <div className="text-xs text-gray-600 dark:text-gray-400">
                      Cause Known
                    </div>
                  </div>

                  {/* Functional Impact */}
                  <div className={`p-2 rounded-lg text-center ${
                      metrics?.hasFunctionalImpact
                          ? 'bg-orange-50 dark:bg-orange-900/20'
                          : 'bg-gray-50 dark:bg-gray-700/30'
                  }`}>
                    <div className={`text-lg font-bold ${
                        metrics?.hasFunctionalImpact
                            ? 'text-orange-600 dark:text-orange-400'
                            : 'text-gray-400'
                    }`}>
                      {metrics?.hasFunctionalImpact ? '✓' : '—'}
                    </div>
                    <div className="text-xs text-gray-600 dark:text-gray-400">
                      Impact Logged
                    </div>
                  </div>

                  {/* Chronic */}
                  <div className={`p-2 rounded-lg text-center ${
                      metrics?.hasChronicCondition
                          ? 'bg-amber-50 dark:bg-amber-900/20'
                          : 'bg-gray-50 dark:bg-gray-700/30'
                  }`}>
                    <div className={`text-lg font-bold ${
                        metrics?.hasChronicCondition
                            ? 'text-amber-600 dark:text-amber-400'
                            : 'text-gray-400'
                    }`}>
                      {metrics?.hasChronicCondition ? '✓' : '—'}
                    </div>
                    <div className="text-xs text-gray-600 dark:text-gray-400">
                      Chronic
                    </div>
                  </div>
                </div>
              </div>

              {/* Section 2: Analysis Rationale */}
              {rationale && rationale.length > 0 && (
                  <div>
                    <h4 className="font-medium text-gray-900 dark:text-white mb-2 text-center">
                      Analysis Rationale
                    </h4>
                    <div className="bg-gray-50 dark:bg-gray-700/30 rounded-lg p-3 space-y-2">
                      {rationale.map((item, idx) => (
                          <div key={idx} className="flex items-start gap-2">
                            <span className="text-cyan-600 dark:text-cyan-400 mt-0.5">◆</span>
                            <span className="text-sm text-gray-700 dark:text-gray-300">{item}</span>
                          </div>
                      ))}
                    </div>
                  </div>
              )}

              {/* Understanding Your Rating - Educational Content */}
              <UnderstandingYourRating
                  diagnosticCode="6276"
                  currentRating={numericRating}
              />

              {/* Section 3: VA Rating Schedule */}
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

              {/* Section 4: Documentation Gaps */}
              {evidenceGaps && evidenceGaps.length > 0 && (
                  <div>
                    <h4 className="font-medium text-gray-900 dark:text-white mb-2 text-center">
                      Documentation Gaps
                    </h4>
                    <div className="bg-amber-50 dark:bg-amber-900/20 rounded-lg p-3 space-y-2">
                      {evidenceGaps.map((gap, idx) => (
                          <div key={idx} className="flex items-start gap-2">
                            <span className="text-amber-600 dark:text-amber-400 mt-0.5">⚠</span>
                            <span className="text-sm text-gray-700 dark:text-gray-300">{gap}</span>
                          </div>
                      ))}
                    </div>
                  </div>
              )}

              {/* Section 5: Secondary Conditions Info */}
              {criteria.secondaryConditions && (
                  <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-lg border border-purple-200 dark:border-purple-800">
                    <h4 className="font-semibold text-purple-900 dark:text-purple-200 mb-2 flex items-center gap-2">
                      <span>🔗</span>
                      Common Primary Conditions
                    </h4>
                    <p className="text-sm text-purple-800 dark:text-purple-300 mb-2">
                      {criteria.secondaryConditions.description}
                    </p>
                    <ul className="space-y-1">
                      {criteria.secondaryConditions.commonPrimaries.slice(0, 4).map((primary, idx) => (
                          <li key={idx} className="text-sm text-purple-800 dark:text-purple-300 flex items-start gap-2">
                            <span className="text-purple-500 mt-0.5">•</span>
                            <span><strong>{primary.condition}</strong> (DC {primary.diagnosticCode})</span>
                          </li>
                      ))}
                    </ul>
                  </div>
              )}

              {/* Section 6: Important Information */}
              <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg border border-blue-200 dark:border-blue-800">
                <h4 className="font-semibold text-blue-900 dark:text-blue-200 mb-2 flex items-center gap-2">
                  <span>ℹ️</span>
                  Important Information
                </h4>
                <ul className="space-y-1">
                  <li className="text-sm text-blue-800 dark:text-blue-300 flex items-start gap-2">
                    <span className="text-blue-500 mt-0.5">•</span>
                    <span>Complete loss (ageusia) required for 10% rating</span>
                  </li>
                  <li className="text-sm text-blue-800 dark:text-blue-300 flex items-start gap-2">
                    <span className="text-blue-500 mt-0.5">•</span>
                    <span>Must have definite diagnosed physical or mental cause</span>
                  </li>
                  <li className="text-sm text-blue-800 dark:text-blue-300 flex items-start gap-2">
                    <span className="text-blue-500 mt-0.5">•</span>
                    <span>Taste and smell are closely related - document both if affected</span>
                  </li>
                  <li className="text-sm text-blue-800 dark:text-blue-300 flex items-start gap-2">
                    <span className="text-blue-500 mt-0.5">•</span>
                    <span>Document nutritional impacts (appetite, weight changes)</span>
                  </li>
                  <li className="text-sm text-blue-800 dark:text-blue-300 flex items-start gap-2">
                    <span className="text-blue-500 mt-0.5">•</span>
                    <span>Can be rated separately from the underlying condition</span>
                  </li>
                </ul>
              </div>

              {/* Important Note about separate ratings */}
              {criteria.importantNote && (
                  <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg border border-green-200 dark:border-green-800">
                    <h4 className="font-semibold text-green-900 dark:text-green-200 mb-2 flex items-center gap-2">
                      <span>💡</span>
                      Rating Note
                    </h4>
                    <p className="text-sm text-green-800 dark:text-green-300">
                      {criteria.importantNote}
                    </p>
                  </div>
              )}

              {/* Section 7: Disclaimer */}
              <div className="bg-gray-100 dark:bg-gray-700/50 rounded-lg p-3 text-xs text-gray-600 dark:text-gray-400">
                <strong>Important:</strong> {criteria.disclaimer}
              </div>
            </div>
        )}
      </div>
  );
}