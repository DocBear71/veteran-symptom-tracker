import { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { FOLATE_DEFICIENCY_ANEMIA_CRITERIA } from '../utils/ratingCriteria';

export default function FolateDeficiencyAnemiaRatingCard({ analysis, expanded, onToggle }) {
  if (!analysis || !analysis.hasData) {
    return null;
  }

  const { supportedRating, rationale, evidenceGaps, metrics } = analysis;
  const criteria = FOLATE_DEFICIENCY_ANEMIA_CRITERIA;
  const ratingDetails = criteria.ratings.find(r => r.percent === supportedRating);

  return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden border-l-4 border-orange-500">
        {/* Header */}
        <button
            onClick={onToggle}
            className="w-full px-6 py-4 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
        >
          <div className="flex items-center gap-3">
            <span className="text-2xl">🥬</span>
            <div className="text-left">
              <h3 className="font-semibold text-lg text-gray-900 dark:text-white">
                Folate Deficiency Anemia
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                DC 7721 - 38 CFR 4.117
              </p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right">
              <div className="text-2xl font-bold text-orange-600 dark:text-orange-400">
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

              {/* Summary */}
              {ratingDetails && (
                  <div className="bg-orange-50 dark:bg-orange-900/20 p-4 rounded-lg">
                    <h4 className="font-semibold text-orange-900 dark:text-orange-200 mb-2">
                      {supportedRating}% Rating Criteria
                    </h4>
                    <p className="text-orange-800 dark:text-orange-300 mb-3">
                      {ratingDetails.summary}
                    </p>
                    <ul className="space-y-1">
                      {ratingDetails.criteriaDescription.map((item, idx) => (
                          <li key={idx} className="text-sm text-orange-700 dark:text-orange-400 flex items-start gap-2">
                            <span className="text-orange-500 mt-0.5">•</span>
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
                      {metrics.ivFolateCount > 0 && (
                          <div className="bg-purple-50 dark:bg-purple-900/20 p-3 rounded-lg">
                            <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                              {metrics.ivFolateCount}
                            </div>
                            <div className="text-xs text-purple-700 dark:text-purple-300">
                              IV Folate Treatments
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