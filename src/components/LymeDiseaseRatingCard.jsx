import React from 'react';

export default function LymeDiseaseRatingCard({ analysis, expanded, onToggle }) {
  if (!analysis.hasData) {
    return null;
  }

  const getRatingColor = (rating) => {
    if (rating === 100 || rating === '100') return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300';
    if (rating === 'Residuals' || rating === 'Requires Evaluation') return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300';
    return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
  };

  return (
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6 shadow-sm">
        <div
            className="flex items-center justify-between mb-4 cursor-pointer"
            onClick={onToggle}
        >
          <div className="flex items-center gap-3">
            <span className="text-3xl">🦟</span>
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
                  {analysis.supportedRating === 'Residuals' ? 'See Residuals' :
                      analysis.supportedRating === 'Requires Evaluation' ? 'Evaluation Needed' :
                          `${analysis.supportedRating}%`}
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
                              {reason.startsWith('•') || reason.startsWith('  •') ? reason : `• ${reason}`}
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

              {/* Symptom Metrics */}
              {analysis.metrics?.symptomCounts && (
                  <div className="mb-4">
                    <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-2">
                      Symptom Breakdown
                    </h4>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                      {analysis.metrics.symptomCounts.nervePain > 0 && (
                          <div className="bg-red-50 dark:bg-red-900/20 p-3 rounded-lg">
                            <p className="text-xs text-gray-600 dark:text-gray-400">Nerve Pain</p>
                            <p className="text-2xl font-bold text-red-700 dark:text-red-300">
                              {analysis.metrics.symptomCounts.nervePain}
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
                      {analysis.metrics.symptomCounts.cognitive > 0 && (
                          <div className="bg-purple-50 dark:bg-purple-900/20 p-3 rounded-lg">
                            <p className="text-xs text-gray-600 dark:text-gray-400">Cognitive Issues</p>
                            <p className="text-2xl font-bold text-purple-700 dark:text-purple-300">
                              {analysis.metrics.symptomCounts.cognitive}
                            </p>
                          </div>
                      )}
                      {analysis.metrics.symptomCounts.fatigue > 0 && (
                          <div className="bg-indigo-50 dark:bg-indigo-900/20 p-3 rounded-lg">
                            <p className="text-xs text-gray-600 dark:text-gray-400">Fatigue</p>
                            <p className="text-2xl font-bold text-indigo-700 dark:text-indigo-300">
                              {analysis.metrics.symptomCounts.fatigue}
                            </p>
                          </div>
                      )}
                      {analysis.metrics.symptomCounts.facialParalysis > 0 && (
                          <div className="bg-red-50 dark:bg-red-900/20 p-3 rounded-lg border-2 border-red-300">
                            <p className="text-xs text-gray-600 dark:text-gray-400">Facial Paralysis</p>
                            <p className="text-2xl font-bold text-red-700 dark:text-red-300">
                              {analysis.metrics.symptomCounts.facialParalysis}
                            </p>
                          </div>
                      )}
                    </div>
                  </div>
              )}

              {/* Treatment Status */}
              {analysis.metrics && (
                  <div className="mb-4">
                    <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-2">
                      Treatment Status
                    </h4>
                    <div className="bg-gray-50 dark:bg-gray-900/20 rounded-lg p-3 border border-gray-200 dark:border-gray-700">
                      {analysis.metrics.activeTreatment && (
                          <p className="text-sm text-gray-900 dark:text-gray-200 mb-2">
                            ✓ <strong>Active Treatment:</strong> Currently undergoing antibiotic therapy (100% rating applies)
                          </p>
                      )}
                      {analysis.metrics.treatmentCompleted && (
                          <p className="text-sm text-gray-900 dark:text-gray-200 mb-2">
                            ✓ <strong>Treatment Completed:</strong> Rate residual symptoms by body system
                          </p>
                      )}
                      {analysis.metrics.hasNeurologicalSymptoms && (
                          <p className="text-sm text-amber-900 dark:text-amber-200">
                            ⚠️ Neurological symptoms present - may require separate neuropathy rating
                          </p>
                      )}
                      {analysis.metrics.hasArthritisSymptoms && (
                          <p className="text-sm text-amber-900 dark:text-amber-200">
                            ⚠️ Arthritis symptoms present - may require separate joint rating
                          </p>
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
                Based on 38 CFR 4.88b, Diagnostic Code 6319. Active Lyme disease rates 100% during treatment. After treatment, rate residuals under appropriate body system codes. This analysis is for documentation purposes only.
              </p>
            </div>
        )}
      </div>
  );
}