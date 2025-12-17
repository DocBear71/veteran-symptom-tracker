import React from 'react';

export default function CampylobacterRatingCard({ analysis, expanded, onToggle }) {
  if (!analysis.hasData) {
    return null;
  }

  const getRatingColor = (rating) => {
    if (rating >= 70) return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300';
    if (rating >= 50) return 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300';
    if (rating >= 30) return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300';
    if (rating >= 10) return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300';
    return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
  };

  return (
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6 shadow-sm">
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
            {analysis.supportedRating !== null && (
                <div className={`px-4 py-2 rounded-lg font-bold text-lg ${getRatingColor(analysis.supportedRating)}`}>
                  {analysis.supportedRating}%
                </div>
            )}
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

              {/* Evidence */}
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

              {/* Complications Alert */}
              {(analysis.metrics?.guillainBarre || analysis.metrics?.reactiveArthritis) && (
                  <div className="mb-4">
                    <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-2">
                      Post-Infectious Complications
                    </h4>
                    <div className="bg-red-50 dark:bg-red-900/20 rounded-lg p-3 border border-red-200 dark:border-red-800">
                      <ul className="space-y-1">
                        {analysis.metrics.guillainBarre && (
                            <li className="text-sm text-red-900 dark:text-red-200 font-semibold">
                              ⚠️ Guillain-Barré Syndrome documented
                            </li>
                        )}
                        {analysis.metrics.reactiveArthritis && (
                            <li className="text-sm text-red-900 dark:text-red-200">
                              ⚠️ Reactive arthritis present
                            </li>
                        )}
                      </ul>
                    </div>
                  </div>
              )}

              {/* Symptom Metrics */}
              {analysis.metrics?.symptomCounts && (
                  <div className="mb-4">
                    <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-2">
                      Symptom Breakdown
                    </h4>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                      {analysis.metrics.symptomCounts.diarrhea > 0 && (
                          <div className="bg-brown-50 dark:bg-brown-900/20 p-3 rounded-lg">
                            <p className="text-xs text-gray-600 dark:text-gray-400">Diarrhea</p>
                            <p className="text-2xl font-bold text-brown-700 dark:text-brown-300">
                              {analysis.metrics.symptomCounts.diarrhea}
                            </p>
                          </div>
                      )}
                      {analysis.metrics.symptomCounts.jointPain > 0 && (
                          <div className="bg-orange-50 dark:bg-orange-900/20 p-3 rounded-lg">
                            <p className="text-xs text-gray-600 dark:text-gray-400">Joint Pain</p>
                            <p className="text-2xl font-bold text-orange-700 dark:text-orange-300">
                              {analysis.metrics.symptomCounts.jointPain}
                            </p>
                          </div>
                      )}
                      {analysis.metrics.symptomCounts.muscleWeakness > 0 && (
                          <div className="bg-red-50 dark:bg-red-900/20 p-3 rounded-lg border-2 border-red-300">
                            <p className="text-xs text-gray-600 dark:text-gray-400">Muscle Weakness</p>
                            <p className="text-2xl font-bold text-red-700 dark:text-red-300">
                              {analysis.metrics.symptomCounts.muscleWeakness}
                            </p>
                          </div>
                      )}
                      {analysis.metrics.symptomCounts.nerveSymptoms > 0 && (
                          <div className="bg-purple-50 dark:bg-purple-900/20 p-3 rounded-lg border-2 border-purple-300">
                            <p className="text-xs text-gray-600 dark:text-gray-400">Nerve Symptoms</p>
                            <p className="text-2xl font-bold text-purple-700 dark:text-purple-300">
                              {analysis.metrics.symptomCounts.nerveSymptoms}
                            </p>
                          </div>
                      )}
                    </div>
                  </div>
              )}

              {/* Gaps */}
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

        {expanded && (
            <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
              <p className="text-xs text-gray-600 dark:text-gray-400">
                Based on 38 CFR 4.88b, Diagnostic Code 6330 - Campylobacter jejuni Infection. Associated with Gulf War illness. This analysis is for documentation purposes only. The VA makes all final rating determinations.
              </p>
            </div>
        )}
      </div>
  );
}