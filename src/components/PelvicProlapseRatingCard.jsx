// CREATE NEW FILE: /mnt/project/PelvicProlapseRatingCard.jsx

import { ChevronDown, ChevronUp } from 'lucide-react';
import { PELVIC_PROLAPSE_CRITERIA } from '../utils/ratingCriteria';

export default function PelvicProlapseRatingCard({ analysis, expanded, onToggle }) {

  if (!analysis || !analysis.hasData) {
    return null;
  }

  const { supportedRating, rationale, evidenceGaps, metrics } = analysis;
  const criteria = PELVIC_PROLAPSE_CRITERIA;
  const ratingDetails = criteria.ratings[0]; // Always 10%

  return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden border-l-4 border-yellow-500">
        <button
            onClick={onToggle}
            className="w-full px-6 py-4 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
        >
          <div className="flex items-center gap-3">
            <span className="text-2xl">🏥</span>
            <div className="text-left">
              <h3 className="font-semibold text-lg text-gray-900 dark:text-white">
                Pelvic Organ Prolapse
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                DC 7621 - 38 CFR 4.116
              </p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right">
              <div className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">
                10%
              </div>
              <div className="text-xs text-gray-500 dark:text-gray-400">
                Flat Rating
              </div>
            </div>
            {expanded ? <ChevronUp className="w-5 h-5 text-gray-400" /> : <ChevronDown className="w-5 h-5 text-gray-400" />}
          </div>
        </button>

        {expanded && (
            <div className="px-6 pb-6 space-y-6">
              <div className="border-t border-gray-200 dark:border-gray-700"></div>

              {/* Flat Rating Note */}
              <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 p-4 rounded-lg">
                <h4 className="font-semibold text-yellow-900 dark:text-yellow-200 mb-2">
                  Flat 10% Rating
                </h4>
                <p className="text-sm text-yellow-800 dark:text-yellow-300">
                  Pelvic organ prolapse receives a flat 10% rating regardless of severity, type, or stage. However, secondary conditions may be separately ratable.
                </p>
              </div>

              {ratingDetails && (
                  <div className="bg-gray-50 dark:bg-gray-700/50 p-4 rounded-lg">
                    <h4 className="font-semibold text-gray-900 dark:text-gray-200 mb-2">
                      10% Rating Criteria
                    </h4>
                    <p className="text-gray-700 dark:text-gray-300 mb-3">
                      {ratingDetails.summary}
                    </p>
                    <ul className="space-y-1">
                      {ratingDetails.criteriaDescription.map((item, idx) => (
                          <li key={idx} className="text-sm text-gray-600 dark:text-gray-400 flex items-start gap-2">
                            <span className="text-gray-500 mt-0.5">•</span>
                            <span>{item}</span>
                          </li>
                      ))}
                    </ul>
                  </div>
              )}

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

              {metrics && (metrics.mostCommonType || metrics.mostCommonStage) && (
                  <div>
                    <h4 className="font-semibold text-gray-900 dark:text-white mb-3">
                      Prolapse Details
                    </h4>
                    <div className="grid grid-cols-2 gap-3">
                      {metrics.mostCommonType && (
                          <div className="p-3 rounded-lg bg-purple-50 dark:bg-purple-900/20">
                            <div className="text-xs text-gray-600 dark:text-gray-400 mb-1">Type</div>
                            <div className="font-medium text-purple-700 dark:text-purple-300 capitalize">
                              {metrics.mostCommonType.replace(/-/g, ' ')}
                            </div>
                          </div>
                      )}
                      {metrics.mostCommonStage && (
                          <div className="p-3 rounded-lg bg-blue-50 dark:bg-blue-900/20">
                            <div className="text-xs text-gray-600 dark:text-gray-400 mb-1">POP-Q Stage</div>
                            <div className="font-medium text-blue-700 dark:text-blue-300">
                              Stage {metrics.mostCommonStage}
                            </div>
                          </div>
                      )}
                    </div>
                  </div>
              )}

              {evidenceGaps && evidenceGaps.length > 0 && (
                  <div>
                    <h4 className="font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                      <span className="text-lg">⚠️</span>
                      Strengthen Your Claim
                    </h4>
                    <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
                      <ul className="space-y-2">
                        {evidenceGaps.map((gap, idx) => (
                            <li key={idx} className="text-sm text-gray-700 dark:text-gray-300 flex items-start gap-2">
                              <span className="text-yellow-600 dark:text-yellow-400 mt-0.5">►</span>
                              <span>{gap}</span>
                            </li>
                        ))}
                      </ul>
                    </div>
                  </div>
              )}

              <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 p-4 rounded-lg">
                <h4 className="font-semibold text-blue-900 dark:text-blue-200 mb-2">💡 Important Note</h4>
                <p className="text-sm text-blue-800 dark:text-blue-300">
                  {criteria.disclaimer}
                </p>
              </div>
            </div>
        )}
      </div>
  );
}