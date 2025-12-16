import { useState } from 'react';
import { ChevronDown, ChevronUp, AlertTriangle } from 'lucide-react';
import { PERNICIOUS_ANEMIA_CRITERIA } from '../utils/ratingCriteria';

export default function PerniciousAnemiaRatingCard({ analysis, expanded, onToggle }) {
  if (!analysis || !analysis.hasData) {
    return null;
  }

  const { supportedRating, rationale, evidenceGaps, metrics } = analysis;
  const criteria = PERNICIOUS_ANEMIA_CRITERIA;
  const ratingDetails = criteria.ratings.find(r => r.percent === supportedRating);
  const hasCNSInvolvement = metrics?.hasCNSInvolvement;

  return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden border-l-4 border-purple-500">
        {/* Header */}
        <button
            onClick={onToggle}
            className="w-full px-6 py-4 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
        >
          <div className="flex items-center gap-3">
            <span className="text-2xl">💉</span>
            <div className="text-left">
              <h3 className="font-semibold text-lg text-gray-900 dark:text-white">
                Pernicious Anemia (B12 Deficiency)
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                DC 7722 - 38 CFR 4.117
              </p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right">
              <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                {supportedRating}%
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

        {/* Expanded Content */}
        {expanded && (
            <div className="px-6 pb-6 space-y-6">
              <div className="border-t border-gray-200 dark:border-gray-700"></div>

              {/* CNS Warning */}
              {hasCNSInvolvement && (
                  <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded-lg border border-red-200 dark:border-red-800">
                    <div className="flex items-start gap-2">
                      <AlertTriangle className="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
                      <div>
                        <h4 className="font-semibold text-red-900 dark:text-red-200 mb-1">
                          CNS Involvement Detected
                        </h4>
                        <p className="text-sm text-red-800 dark:text-red-300">
                          Neurological symptoms suggest central nervous system involvement. 100% rating requires
                          neurology evaluation and documented CNS damage (MRI, EMG/NCV studies).
                        </p>
                      </div>
                    </div>
                  </div>
              )}

              {/* Summary */}
              {ratingDetails && (
                  <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-lg">
                    <h4 className="font-semibold text-purple-900 dark:text-purple-200 mb-2">
                      {supportedRating}% Rating Criteria
                    </h4>
                    <p className="text-purple-800 dark:text-purple-300 mb-3">
                      {ratingDetails.summary}
                    </p>
                    <ul className="space-y-1">
                      {ratingDetails.criteriaDescription.map((item, idx) => (
                          <li key={idx} className="text-sm text-purple-700 dark:text-purple-400 flex items-start gap-2">
                            <span className="text-purple-500 mt-0.5">•</span>
                            <span>{item}</span>
                          </li>
                      ))}
                    </ul>
                  </div>
              )}

              {/* Your Evidence */}
              <div>
                <h4 className="font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                  <span className="text-lg">📊</span>
                  Your Documented Evidence
                </h4>
                <div className="bg-gray-50 dark:bg-gray-700/50 p-4 rounded-lg space-y-2">
                  {rationale.map((item, idx) => (
                      <div key={idx} className="flex items-start gap-2 text-sm">
                        <span className="text-green-500 mt-0.5">✓</span>
                        <span className="text-gray-700 dark:text-gray-300">{item}</span>
                      </div>
                  ))}
                </div>
              </div>

              {/* Metrics */}
              {metrics && (
                  <div>
                    <h4 className="font-semibold text-gray-900 dark:text-white mb-3">
                      Tracked Metrics
                    </h4>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg">
                        <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                          {metrics.totalLogs}
                        </div>
                        <div className="text-xs text-blue-700 dark:text-blue-300">
                          Total Logs
                        </div>
                      </div>
                      {metrics.b12InjectionCount > 0 && (
                          <div className="bg-purple-50 dark:bg-purple-900/20 p-3 rounded-lg">
                            <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                              {metrics.b12InjectionCount}
                            </div>
                            <div className="text-xs text-purple-700 dark:text-purple-300">
                              B12 Injections
                            </div>
                          </div>
                      )}
                      {metrics.neurologicalSymptomTypes > 0 && (
                          <div className="bg-red-50 dark:bg-red-900/20 p-3 rounded-lg col-span-2">
                            <div className="text-2xl font-bold text-red-600 dark:text-red-400">
                              {metrics.neurologicalSymptomTypes}
                            </div>
                            <div className="text-xs text-red-700 dark:text-red-300">
                              Neurological Symptom Types
                            </div>
                          </div>
                      )}
                    </div>
                  </div>
              )}

              {/* Evidence Gaps */}
              {evidenceGaps && evidenceGaps.length > 0 && (
                  <div>
                    <h4 className="font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                      <span className="text-lg">⚠️</span>
                      Strengthen Your Claim
                    </h4>
                    <div className="bg-amber-50 dark:bg-amber-900/20 p-4 rounded-lg space-y-2">
                      {evidenceGaps.map((gap, idx) => (
                          <div key={idx} className="flex items-start gap-2 text-sm">
                            <span className="text-amber-500 mt-0.5">→</span>
                            <span className="text-amber-800 dark:text-amber-200">{gap}</span>
                          </div>
                      ))}
                    </div>
                  </div>
              )}
            </div>
        )}
      </div>
  );
}