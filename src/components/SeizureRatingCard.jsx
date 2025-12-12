import { useState } from 'react';
import { formatRating, getRatingColorClass } from './ratingCriteria';

/**
 * Seizure/Epilepsy Rating Card Component
 * Shows seizure frequency analysis and VA rating for epilepsy (DC 8910, 8911)
 * Analyzes major and minor seizure patterns over various time periods
 */
const SeizureRatingCard = ({ analysis, expanded, onToggle }) => {
  const [showDefinitions, setShowDefinitions] = useState(false);

  if (!analysis.hasData) return null;

  const {
    condition,
    diagnosticCode,
    supportedRating,
    ratingRationale,
    evidence,
    gaps,
    criteria,
    disclaimer,
    seizureType,
    frequencyAnalysis,
  } = analysis;

  // Determine emoji based on seizure type
  const getSeizureEmoji = () => {
    if (diagnosticCode === '8910') return 'ðŸ§ '; // Major seizures
    if (diagnosticCode === '8911') return '⚡'; // Minor seizures
    return 'ðŸ©º';
  };

  return (
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
        {/* Header */}
        <button
            onClick={onToggle}
            className="w-full p-4 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
        >
          <div className="flex items-center gap-3">
            <span className="text-2xl">{getSeizureEmoji()}</span>
            <div className="text-left">
              <h3 className="font-semibold text-gray-900 dark:text-white">
                {condition}
              </h3>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                DC {diagnosticCode} • {criteria.cfrReference}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            {supportedRating && (
                <span className={`px-3 py-1 rounded-full text-sm font-medium border ${
                    supportedRating.includes('Requires') || supportedRating.includes('Clinical')
                        ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 border-blue-300 dark:border-blue-700'
                        : getRatingColorClass(parseInt(supportedRating))
                }`}>
              {supportedRating}
            </span>
            )}
            <svg
                className={`w-5 h-5 text-gray-400 transition-transform ${expanded ? 'rotate-180' : ''}`}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7"/>
            </svg>
          </div>
        </button>

        {/* Expanded Content */}
        {expanded && (
            <div className="p-4 border-t border-gray-200 dark:border-gray-700">
              <div className="space-y-4 text-left">

                {/* Frequency Analysis */}
                {frequencyAnalysis && (
                    <div>
                      <h4 className="font-medium text-gray-900 dark:text-white mb-2 text-center">
                        Seizure Frequency Analysis
                      </h4>
                      <div className="bg-purple-50 dark:bg-purple-900/20 rounded-lg p-3 space-y-2">
                        {frequencyAnalysis.last30Days !== undefined && (
                            <div className="flex justify-between items-center text-sm">
                              <span className="text-gray-700 dark:text-gray-300">Last 30 days:</span>
                              <span className="font-medium text-purple-900 dark:text-purple-300">
                                {frequencyAnalysis.last30Days} seizure{frequencyAnalysis.last30Days !== 1 ? 's' : ''}
                              </span>
                            </div>
                        )}
                        {frequencyAnalysis.last6Months !== undefined && (
                            <div className="flex justify-between items-center text-sm">
                              <span className="text-gray-700 dark:text-gray-300">Last 6 months:</span>
                              <span className="font-medium text-purple-900 dark:text-purple-300">
                                {frequencyAnalysis.last6Months} seizure{frequencyAnalysis.last6Months !== 1 ? 's' : ''}
                              </span>
                            </div>
                        )}
                        {frequencyAnalysis.lastYear !== undefined && (
                            <div className="flex justify-between items-center text-sm">
                              <span className="text-gray-700 dark:text-gray-300">Last 12 months:</span>
                              <span className="font-medium text-purple-900 dark:text-purple-300">
                                {frequencyAnalysis.lastYear} seizure{frequencyAnalysis.lastYear !== 1 ? 's' : ''}
                              </span>
                            </div>
                        )}
                        {frequencyAnalysis.last2Years !== undefined && (
                            <div className="flex justify-between items-center text-sm">
                              <span className="text-gray-700 dark:text-gray-300">Last 2 years:</span>
                              <span className="font-medium text-purple-900 dark:text-purple-300">
                                {frequencyAnalysis.last2Years} seizure{frequencyAnalysis.last2Years !== 1 ? 's' : ''}
                              </span>
                            </div>
                        )}
                        {frequencyAnalysis.averagePerMonth && (
                            <div className="flex justify-between items-center text-sm pt-2 border-t border-purple-200 dark:border-purple-800">
                              <span className="text-gray-700 dark:text-gray-300 font-medium">Average/month (last year):</span>
                              <span className="font-semibold text-purple-900 dark:text-purple-300">
                                {frequencyAnalysis.averagePerMonth.toFixed(1)}
                              </span>
                            </div>
                        )}
                      </div>
                    </div>
                )}

                {/* Evidence Summary */}
                <div>
                  <h4 className="font-medium text-gray-900 dark:text-white mb-2 text-center">
                    Evidence Summary
                  </h4>
                  <div className="bg-gray-50 dark:bg-gray-700/30 rounded-lg p-3 space-y-2">
                    {evidence.map((item, i) => (
                        <div key={i} className="flex items-start gap-2">
                          <span className="text-green-600 dark:text-green-400 mt-0.5">✓</span>
                          <span className="text-sm text-gray-700 dark:text-gray-300">{item}</span>
                        </div>
                    ))}
                  </div>
                </div>

                {/* Rating Rationale */}
                {ratingRationale && ratingRationale.length > 0 && (
                    <div>
                      <h4 className="font-medium text-gray-900 dark:text-white mb-2 text-center">
                        Analysis Rationale
                      </h4>
                      <div className="bg-gray-50 dark:bg-gray-700/30 rounded-lg p-3 space-y-2">
                        {ratingRationale.map((reason, i) => (
                            <div key={i} className="flex items-start gap-2">
                              <span className="text-blue-600 dark:text-blue-400 mt-0.5">•</span>
                              <span className="text-sm text-gray-700 dark:text-gray-300">{reason}</span>
                            </div>
                        ))}
                      </div>
                    </div>
                )}

                {/* VA Rating Schedule */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium text-gray-900 dark:text-white text-center flex-1">
                      VA Rating Schedule
                    </h4>
                    <button
                        onClick={() => setShowDefinitions(!showDefinitions)}
                        className="text-xs text-blue-600 dark:text-blue-400 hover:underline"
                    >
                      {showDefinitions ? 'Hide' : 'Show'} Definitions
                    </button>
                  </div>
                  <div className="bg-gray-50 dark:bg-gray-700/30 rounded-lg overflow-hidden">
                    <table className="w-full text-sm">
                      <thead className="bg-gray-100 dark:bg-gray-600/30">
                      <tr>
                        <th className="px-3 py-2 text-left font-medium text-gray-700 dark:text-gray-300">Rating</th>
                        <th className="px-3 py-2 text-left font-medium text-gray-700 dark:text-gray-300">Criteria</th>
                      </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200 dark:divide-gray-600">
                      {criteria.ratings.map((rating, index) => (
                          <tr key={index} className="hover:bg-gray-100 dark:hover:bg-gray-600/20">
                            <td className="px-3 py-2">
                            <span className={`inline-block px-2 py-0.5 rounded text-xs font-medium ${getRatingColorClass(rating.percent)}`}>
                              {formatRating(rating.percent)}
                            </span>
                            </td>
                            <td className="px-3 py-2 text-gray-700 dark:text-gray-300">
                              <div className="font-medium mb-1">{rating.summary}</div>
                              {showDefinitions && (
                                  <ul className="text-xs space-y-1 mt-2 text-gray-600 dark:text-gray-400">
                                    {rating.criteriaDescription.map((desc, i) => (
                                        <li key={i} className="flex items-start gap-1">
                                          <span className="mt-0.5">•</span>
                                          <span>{desc}</span>
                                        </li>
                                    ))}
                                  </ul>
                              )}
                            </td>
                          </tr>
                      ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Important Notes */}
                <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-3">
                  <h4 className="font-medium text-blue-900 dark:text-blue-300 mb-2 text-sm">
                    Important Notes
                  </h4>
                  <ul className="text-xs text-blue-800 dark:text-blue-300 space-y-1">
                    <li className="flex items-start gap-2">
                      <span className="mt-0.5">•</span>
                      <span>
                        <strong>Major seizure:</strong> Generalized tonic-clonic convulsion with unconsciousness
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="mt-0.5">•</span>
                      <span>
                        <strong>Minor seizure:</strong> Brief interruption in consciousness (absence, myoclonic, or akinetic)
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="mt-0.5">•</span>
                      <span>
                        Seizures must be witnessed or verified by a physician at some time
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="mt-0.5">•</span>
                      <span>
                        When on continuous medication, minimum rating is 10%
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="mt-0.5">•</span>
                      <span>
                        If both major and minor seizures present, rate the predominating type
                      </span>
                    </li>
                  </ul>
                </div>

                {/* Evidence Gaps */}
                {gaps && gaps.length > 0 && (
                    <div>
                      <h4 className="font-medium text-gray-900 dark:text-white mb-2 text-center">
                        To Strengthen Your Claim
                      </h4>
                      <div className="bg-yellow-50 dark:bg-yellow-900/20 rounded-lg p-3 space-y-2">
                        {gaps.map((gap, i) => (
                            <div key={i} className="flex items-start gap-2">
                              <span className="text-yellow-600 dark:text-yellow-400 mt-0.5">!</span>
                              <span className="text-sm text-gray-700 dark:text-gray-300">{gap}</span>
                            </div>
                        ))}
                      </div>
                    </div>
                )}

                {/* Disclaimer */}
                <div className="text-xs text-gray-500 dark:text-gray-400 border-t border-gray-200 dark:border-gray-600 pt-3 italic text-center">
                  {disclaimer}
                </div>
              </div>
            </div>
        )}
      </div>
  );
};

export default SeizureRatingCard;