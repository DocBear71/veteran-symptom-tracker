// CREATE NEW FILE: /mnt/project/EndometriosisRatingCard.jsx

import { ChevronDown, ChevronUp } from 'lucide-react';
import { ENDOMETRIOSIS_CRITERIA } from '../utils/ratingCriteria';

export default function EndometriosisRatingCard({ analysis, expanded, onToggle }) {

  if (!analysis || !analysis.hasData) {
    return null;
  }

  const { supportedRating, rationale, evidenceGaps, metrics } = analysis;
  const criteria = ENDOMETRIOSIS_CRITERIA;
  const ratingDetails = criteria.ratings.find(r => r.percent === supportedRating);

  // Determine color based on rating
  const getBorderColor = () => {
    if (supportedRating >= 50) return 'border-red-500';
    if (supportedRating >= 30) return 'border-orange-500';
    if (supportedRating >= 10) return 'border-yellow-500';
    return 'border-gray-400';
  };

  const getRatingColor = () => {
    if (supportedRating >= 50) return 'text-red-600 dark:text-red-400';
    if (supportedRating >= 30) return 'text-orange-600 dark:text-orange-400';
    if (supportedRating >= 10) return 'text-yellow-600 dark:text-yellow-400';
    return 'text-gray-600 dark:text-gray-400';
  };

  return (
      <div className={`bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden border-l-4 ${getBorderColor()}`}>
        <button
            onClick={onToggle}
            className="w-full px-6 py-4 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
        >
          <div className="flex items-center gap-3">
            <span className="text-2xl">🌸</span>
            <div className="text-left">
              <h3 className="font-semibold text-lg text-gray-900 dark:text-white">
                Endometriosis
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                DC 7629 - 38 CFR 4.116
              </p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right">
              <div className={`text-2xl font-bold ${getRatingColor()}`}>
                {supportedRating}%
              </div>
              <div className="text-xs text-gray-500 dark:text-gray-400">
                Supported Rating
              </div>
            </div>
            {expanded ? <ChevronUp className="w-5 h-5 text-gray-400" /> : <ChevronDown className="w-5 h-5 text-gray-400" />}
          </div>
        </button>

        {expanded && (
            <div className="px-6 pb-6 space-y-6">
              <div className="border-t border-gray-200 dark:border-gray-700"></div>

              {/* Critical Note */}
              <div className="bg-rose-50 dark:bg-rose-900/20 border border-rose-200 dark:border-rose-800 p-4 rounded-lg">
                <h4 className="font-semibold text-rose-900 dark:text-rose-200 mb-2 flex items-center gap-2">
                  <span>⚠️</span>
                  Laparoscopy Required
                </h4>
                <p className="text-sm text-rose-700 dark:text-rose-300">
                  VA requires diagnosis to be substantiated by laparoscopy. Without laparoscopy confirmation, endometriosis cannot be service-connected.
                </p>
              </div>

              {ratingDetails && (
                  <div className="bg-gray-50 dark:bg-gray-700/50 p-4 rounded-lg">
                    <h4 className="font-semibold text-gray-900 dark:text-gray-200 mb-2">
                      {supportedRating}% Rating Criteria
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

              {metrics && (
                  <div>
                    <h4 className="font-semibold text-gray-900 dark:text-white mb-3">
                      Key Findings
                    </h4>
                    <div className="grid grid-cols-2 gap-3">
                      {metrics.laparoscopyConfirmed !== undefined && (
                          <div className={`p-3 rounded-lg ${metrics.laparoscopyConfirmed ? 'bg-green-50 dark:bg-green-900/20' : 'bg-red-50 dark:bg-red-900/20'}`}>
                            <div className="text-xs text-gray-600 dark:text-gray-400 mb-1">Laparoscopy</div>
                            <div className={`font-medium ${metrics.laparoscopyConfirmed ? 'text-green-700 dark:text-green-300' : 'text-red-700 dark:text-red-300'}`}>
                              {metrics.laparoscopyConfirmed ? 'Confirmed' : 'Not Confirmed'}
                            </div>
                          </div>
                      )}
                      {metrics.hasBowelBladderLesions !== undefined && (
                          <div className={`p-3 rounded-lg ${metrics.hasBowelBladderLesions ? 'bg-orange-50 dark:bg-orange-900/20' : 'bg-gray-50 dark:bg-gray-700/50'}`}>
                            <div className="text-xs text-gray-600 dark:text-gray-400 mb-1">Bowel/Bladder</div>
                            <div className={`font-medium ${metrics.hasBowelBladderLesions ? 'text-orange-700 dark:text-orange-300' : 'text-gray-700 dark:text-gray-300'}`}>
                              {metrics.hasBowelBladderLesions ? 'Lesions Present' : 'Not Involved'}
                            </div>
                          </div>
                      )}
                      {metrics.mostCommonEffectiveness && (
                          <div className="p-3 rounded-lg bg-blue-50 dark:bg-blue-900/20 col-span-2">
                            <div className="text-xs text-gray-600 dark:text-gray-400 mb-1">Treatment Effectiveness</div>
                            <div className="font-medium text-blue-700 dark:text-blue-300 capitalize">
                              {metrics.mostCommonEffectiveness.replace(/-/g, ' ')}
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