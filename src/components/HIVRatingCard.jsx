import React from 'react';

/**
 * HIV/AIDS Rating Card Component
 * Displays VA rating analysis for HIV-Related Illness (DC 6351)
 * Based on 38 CFR 4.88b
 */
export default function HIVRatingCard({ analysis, expanded, onToggle }) {
  if (!analysis.hasData) {
    return null; // Don't show empty cards
  }

  const getRatingColor = (rating) => {
    if (rating >= 70) return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300';
    if (rating >= 50) return 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300';
    if (rating >= 30) return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300';
    if (rating >= 10) return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300';
    return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
  };

  const getSeverityIcon = (rating) => {
    if (rating >= 70) return '🔴';
    if (rating >= 50) return '🟠';
    if (rating >= 30) return '🟡';
    if (rating >= 10) return '🟢';
    return '⚪';
  };

  return (
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6 shadow-sm">
        {/* Header */}
        <div
            className="flex items-center justify-between mb-4 cursor-pointer"
            onClick={onToggle}
        >
          <div className="flex items-center gap-3">
            <span className="text-3xl">🦠</span>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                {analysis.condition}
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Diagnostic Code {analysis.diagnosticCode}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Rating Badge */}
            {analysis.supportedRating !== null && (
                <div className={`px-4 py-2 rounded-lg font-bold text-lg ${getRatingColor(analysis.supportedRating)}`}>
                  {getSeverityIcon(analysis.supportedRating)} {analysis.supportedRating}%
                </div>
            )}
            {/* Expand/Collapse Icon */}
            <span className="text-gray-400">
            {expanded ? '▼' : '▶'}
          </span>
          </div>
        </div>

        {expanded && (
            <div>

              {/* Rating Rationale */}
              {analysis.ratingRationale && analysis.ratingRationale.length > 0 && (
                  <div className="mb-4">
                    <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-2">
                      Rating Rationale
                    </h4>
                    <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-3 border border-blue-200 dark:border-blue-800">
                      <ul className="space-y-1">
                        {analysis.ratingRationale.map((reason, index) => (
                            <li key={index} className="text-sm text-blue-900 dark:text-blue-200">
                              {reason.startsWith('•') ? reason : `• ${reason}`}
                            </li>
                        ))}
                      </ul>
                    </div>
                  </div>
              )}

              {/* Evidence Summary */}
              {analysis.evidence && analysis.evidence.length > 0 && (
                  <div className="mb-4">
                    <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-2">
                      Evidence Summary
                    </h4>
                    <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-3 border border-green-200 dark:border-green-800">
                      <ul className="space-y-1">
                        {analysis.evidence.map((item, index) => (
                            <li key={index} className="text-sm text-green-900 dark:text-green-200">
                              ✓ {item}
                            </li>
                        ))}
                      </ul>
                    </div>
                  </div>
              )}

              {/* Metrics Display */}
              {analysis.metrics && (
                  <div className="mb-4">
                    <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-2">
                      Symptom Breakdown
                    </h4>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                      {analysis.metrics.symptomCounts?.opportunisticInfections > 0 && (
                          <div className="bg-red-50 dark:bg-red-900/20 p-3 rounded-lg">
                            <p className="text-xs text-gray-600 dark:text-gray-400">Opportunistic Infections</p>
                            <p className="text-2xl font-bold text-red-700 dark:text-red-300">
                              {analysis.metrics.symptomCounts.opportunisticInfections}
                            </p>
                          </div>
                      )}
                      {analysis.metrics.symptomCounts?.nightSweats > 0 && (
                          <div className="bg-purple-50 dark:bg-purple-900/20 p-3 rounded-lg">
                            <p className="text-xs text-gray-600 dark:text-gray-400">Night Sweats</p>
                            <p className="text-2xl font-bold text-purple-700 dark:text-purple-300">
                              {analysis.metrics.symptomCounts.nightSweats}
                            </p>
                          </div>
                      )}
                      {analysis.metrics.symptomCounts?.persistentFever > 0 && (
                          <div className="bg-orange-50 dark:bg-orange-900/20 p-3 rounded-lg">
                            <p className="text-xs text-gray-600 dark:text-gray-400">Persistent Fever</p>
                            <p className="text-2xl font-bold text-orange-700 dark:text-orange-300">
                              {analysis.metrics.symptomCounts.persistentFever}
                            </p>
                          </div>
                      )}
                      {analysis.metrics.symptomCounts?.weightLoss > 0 && (
                          <div className="bg-red-50 dark:bg-red-900/20 p-3 rounded-lg">
                            <p className="text-xs text-gray-600 dark:text-gray-400">Weight Loss Episodes</p>
                            <p className="text-2xl font-bold text-red-700 dark:text-red-300">
                              {analysis.metrics.symptomCounts.weightLoss}
                              {analysis.metrics.weightLossPercentage > 0 && (
                                  <span className="text-sm ml-1">({analysis.metrics.weightLossPercentage}%)</span>
                              )}
                            </p>
                          </div>
                      )}
                      {analysis.metrics.symptomCounts?.chronicDiarrhea > 0 && (
                          <div className="bg-yellow-50 dark:bg-yellow-900/20 p-3 rounded-lg">
                            <p className="text-xs text-gray-600 dark:text-gray-400">Chronic Diarrhea</p>
                            <p className="text-2xl font-bold text-yellow-700 dark:text-yellow-300">
                              {analysis.metrics.symptomCounts.chronicDiarrhea}
                            </p>
                          </div>
                      )}
                      {analysis.metrics.symptomCounts?.fatigue > 0 && (
                          <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg">
                            <p className="text-xs text-gray-600 dark:text-gray-400">Severe Fatigue</p>
                            <p className="text-2xl font-bold text-blue-700 dark:text-blue-300">
                              {analysis.metrics.symptomCounts.fatigue}
                            </p>
                          </div>
                      )}
                      {analysis.metrics.symptomCounts?.cognitiveImpairment > 0 && (
                          <div className="bg-indigo-50 dark:bg-indigo-900/20 p-3 rounded-lg">
                            <p className="text-xs text-gray-600 dark:text-gray-400">Cognitive Issues</p>
                            <p className="text-2xl font-bold text-indigo-700 dark:text-indigo-300">
                              {analysis.metrics.symptomCounts.cognitiveImpairment}
                            </p>
                          </div>
                      )}
                      {analysis.metrics.onAntiretrovirals && (
                          <div className="bg-green-50 dark:bg-green-900/20 p-3 rounded-lg">
                            <p className="text-xs text-gray-600 dark:text-gray-400">Treatment Status</p>
                            <p className="text-sm font-bold text-green-700 dark:text-green-300">
                              On ART
                            </p>
                          </div>
                      )}
                    </div>
                  </div>
              )}

              {/* Evidence Gaps */}
              {analysis.gaps && analysis.gaps.length > 0 && (
                  <div>
                    <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-2">
                      Documentation Gaps
                    </h4>
                    <div className="bg-amber-50 dark:bg-amber-900/20 rounded-lg p-3 border border-amber-200 dark:border-amber-800">
                      <ul className="space-y-1">
                        {analysis.gaps.map((gap, index) => (
                            <li key={index} className="text-sm text-amber-900 dark:text-amber-200">
                              ⚠️ {gap}
                            </li>
                        ))}
                      </ul>
                    </div>
                  </div>
              )}
            </div>
        )}

        {/* VA Information Footer */}
        {expanded && (
            <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
              <p className="text-xs text-gray-600 dark:text-gray-400">
                Based on 38 CFR 4.88b, Diagnostic Code 6351 - HIV-Related Illness. This analysis is for documentation purposes only. The VA makes all final rating determinations.
              </p>
            </div>
        )}
      </div>
  );
}