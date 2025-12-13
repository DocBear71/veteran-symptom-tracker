import {
  analyzeVisionLogs,
  VISION_LOSS_CRITERIA,
  GLAUCOMA_CRITERIA,
} from '../utils/ratingCriteria';

const EyeVisionRatingCard = ({logs, expanded, onToggle}) => {
  const analysis = analyzeVisionLogs(logs);

  if (!analysis.hasData) {
    return (
        <div
            className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-start gap-3">
            <div className="text-3xl">👁️</div>
            <div className="flex-1">
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                Eye & Vision Conditions
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                No vision-related symptoms logged yet. Start tracking eye
                conditions to see rating analysis.
              </p>
            </div>
          </div>
        </div>
    );
  }

  const {
    acuityTrends,
    mostAffectedActivities,
    fieldDefects,
    evidenceGaps,
    ratingGuidance,
  } = analysis;

  // Visual acuity color coding
  const getAcuityColor = (acuity) => {
    const severityMap = {
      '20/20': 'text-green-600 dark:text-green-400',
      '20/25': 'text-green-600 dark:text-green-400',
      '20/30': 'text-yellow-600 dark:text-yellow-400',
      '20/40': 'text-yellow-600 dark:text-yellow-400',
      '20/50': 'text-orange-600 dark:text-orange-400',
      '20/70': 'text-orange-600 dark:text-orange-400',
      '20/100': 'text-red-600 dark:text-red-400',
      '20/200': 'text-red-600 dark:text-red-400',
      'CF': 'text-red-700 dark:text-red-500',
      'HM': 'text-red-700 dark:text-red-500',
      'LP': 'text-red-800 dark:text-red-600',
      'NLP': 'text-red-900 dark:text-red-700',
    };
    return severityMap[acuity] || 'text-gray-600 dark:text-gray-400';
  };

  return (
      <div
          className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
        {/* Collapsible Header */}
        <button
            onClick={onToggle}
            className="w-full p-6 flex items-start gap-3 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
        >
          <div className="text-3xl">👁️</div>
          <div className="flex-1 text-left">
            <h3 className="font-semibold text-gray-900 dark:text-white mb-1">
              Eye & Vision Conditions
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              DC 6061-6079 (Vision Loss), DC 6067 (Glaucoma), DC 6066 (Diabetic
              Retinopathy)
            </p>
          </div>
          <div className="text-right flex items-center gap-4">
            <div>
              <div className="text-sm text-gray-500 dark:text-gray-400">Total
                Logs
              </div>
              <div
                  className="text-2xl font-bold text-cyan-600 dark:text-cyan-400">{analysis.totalLogs}</div>
            </div>
            <svg
                className={`w-6 h-6 text-gray-400 transition-transform ${expanded ?
                    'transform rotate-180' :
                    ''}`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                    d="M19 9l-7 7-7-7"/>
            </svg>
          </div>
        </button>

        {/* Expandable Content */}
        {expanded && (
            <div
                className="px-6 pb-6 space-y-6 border-t border-gray-200 dark:border-gray-700">

              {/* Visual Acuity Summary */}
              {(acuityTrends.worstLeft || acuityTrends.worstRight) && (
                  <div
                      className="bg-cyan-50 dark:bg-cyan-900/30 rounded-lg p-4 border border-cyan-200 dark:border-cyan-800">
                    <h4 className="font-medium text-cyan-900 dark:text-cyan-200 mb-3">Visual
                      Acuity (Worst Logged)</h4>
                    <div className="grid grid-cols-2 gap-4">
                      {acuityTrends.worstLeft && (
                          <div>
                            <div
                                className="text-xs text-gray-600 dark:text-gray-400 mb-1">Left
                              Eye
                            </div>
                            <div
                                className={`text-2xl font-bold ${getAcuityColor(
                                    acuityTrends.worstLeft.acuity)}`}>
                              {acuityTrends.worstLeft.acuity}
                            </div>
                            <div
                                className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                              {new Date(
                                  acuityTrends.worstLeft.date).toLocaleDateString()}
                            </div>
                          </div>
                      )}
                      {acuityTrends.worstRight && (
                          <div>
                            <div
                                className="text-xs text-gray-600 dark:text-gray-400 mb-1">Right
                              Eye
                            </div>
                            <div
                                className={`text-2xl font-bold ${getAcuityColor(
                                    acuityTrends.worstRight.acuity)}`}>
                              {acuityTrends.worstRight.acuity}
                            </div>
                            <div
                                className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                              {new Date(
                                  acuityTrends.worstRight.date).toLocaleDateString()}
                            </div>
                          </div>
                      )}
                    </div>
                    {acuityTrends.betterEye && (
                        <div
                            className="mt-3 pt-3 border-t border-cyan-300 dark:border-cyan-700">
                          <p className="text-sm text-cyan-800 dark:text-cyan-300">
                            <strong>Better
                              Eye:</strong> {acuityTrends.betterEye === 'left' ?
                              'Left' :
                              'Right'}
                            {' '}({acuityTrends.betterEye === 'left' ?
                              acuityTrends.worstLeft.acuity :
                              acuityTrends.worstRight.acuity})
                          </p>
                          <p className="text-xs text-cyan-700 dark:text-cyan-400 mt-1">
                            VA ratings are based on visual acuity in the better
                            eye
                          </p>
                        </div>
                    )}
                  </div>
              )}

              {/* Rating Guidance */}
              <div
                  className="bg-blue-50 dark:bg-blue-900/30 rounded-lg p-4 border border-blue-200 dark:border-blue-800">
                <h4 className="font-medium text-blue-900 dark:text-blue-200 mb-2 flex items-center gap-2">
                  <span>📊</span>
                  Rating Guidance
                </h4>
                <p className="text-sm text-blue-800 dark:text-blue-300">
                  {ratingGuidance}
                </p>
              </div>

              {/* Field of Vision Defects */}
              {fieldDefects.length > 0 && (
                  <div>
                    <h4 className="font-medium text-gray-900 dark:text-white mb-2">Field
                      of Vision Defects</h4>
                    <div className="space-y-1">
                      {fieldDefects.map(({field, count}) => (
                          <div key={field}
                               className="flex items-center justify-between text-sm">
                      <span
                          className="text-gray-700 dark:text-gray-300 capitalize">
                        {field.replace('-', ' ')}
                      </span>
                            <span className="text-gray-500 dark:text-gray-400">
                        {count} log{count !== 1 ? 's' : ''}
                      </span>
                          </div>
                      ))}
                    </div>
                    <p className="text-xs text-orange-600 dark:text-orange-400 mt-2">
                      ⚠️ Field defects require formal visual field testing
                      (perimetry) for VA claims
                    </p>
                  </div>
              )}

              {/* Impact on Activities */}
              {mostAffectedActivities.length > 0 && (
                  <div>
                    <h4 className="font-medium text-gray-900 dark:text-white mb-2">Most
                      Affected Activities</h4>
                    <div className="space-y-2">
                      {mostAffectedActivities.map(({activity, count}) => (
                          <div key={activity}
                               className="flex items-center gap-2">
                            <div
                                className="flex-1 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                              <div
                                  className="bg-cyan-600 dark:bg-cyan-500 h-2 rounded-full"
                                  style={{
                                    width: `${(count / analysis.totalLogs) *
                                    100}%`,
                                  }}
                              ></div>
                            </div>
                            <span
                                className="text-sm text-gray-700 dark:text-gray-300 w-32 capitalize">
                        {activity.replace('-', ' ')}
                      </span>
                            <span
                                className="text-sm text-gray-500 dark:text-gray-400 w-8 text-right">
                        {count}
                      </span>
                          </div>
                      ))}
                    </div>
                  </div>
              )}

              {/* Evidence Gaps */}
              {evidenceGaps.length > 0 && (
                  <div
                      className="bg-yellow-50 dark:bg-yellow-900/30 rounded-lg p-4 border border-yellow-200 dark:border-yellow-800">
                    <h4 className="font-medium text-yellow-900 dark:text-yellow-200 mb-2 flex items-center gap-2">
                      <span>⚠️</span>
                      Evidence Needed for VA Claim
                    </h4>
                    <ul className="space-y-1">
                      {evidenceGaps.map((gap, index) => (
                          <li key={index}
                              className="text-sm text-yellow-800 dark:text-yellow-300 flex items-start gap-2">
                            <span
                                className="text-yellow-600 dark:text-yellow-400 mt-0.5">•</span>
                            <span>{gap}</span>
                          </li>
                      ))}
                    </ul>
                  </div>
              )}

              {/* VA Rating Schedule Reference */}
              <div
                  className="border-t border-gray-200 dark:border-gray-700 pt-4">
                <details className="text-sm">
                  <summary
                      className="font-medium text-gray-900 dark:text-white cursor-pointer hover:text-cyan-600 dark:hover:text-cyan-400">
                    View VA Rating Schedule for Vision Loss
                  </summary>
                  <div className="mt-3 space-y-3">
                    {VISION_LOSS_CRITERIA.ratings.map((rating) => (
                        <div key={rating.percent}
                             className="bg-gray-50 dark:bg-gray-900/50 rounded p-3 border border-gray-200 dark:border-gray-700">
                          <div
                              className="flex items-start justify-between mb-2">
                            <span
                                className="font-semibold text-cyan-600 dark:text-cyan-400">{rating.percent}%</span>
                            <span
                                className="text-xs text-gray-500 dark:text-gray-400">DC 6061-6079</span>
                          </div>
                          <p className="text-sm font-medium text-gray-800 dark:text-gray-200 mb-2">
                            {rating.summary}
                          </p>
                          <ul className="space-y-1">
                            {rating.criteriaDescription.map((criteria, idx) => (
                                <li key={idx}
                                    className="text-xs text-gray-600 dark:text-gray-400 flex items-start gap-2">
                                  <span
                                      className="text-gray-400 dark:text-gray-500">•</span>
                                  <span>{criteria}</span>
                                </li>
                            ))}
                          </ul>
                        </div>
                    ))}
                  </div>
                </details>
              </div>

              {/* Glaucoma Reference */}
              <div
                  className="border-t border-gray-200 dark:border-gray-700 pt-4">
                <details className="text-sm">
                  <summary
                      className="font-medium text-gray-900 dark:text-white cursor-pointer hover:text-cyan-600 dark:hover:text-cyan-400">
                    View VA Rating Schedule for Glaucoma
                  </summary>
                  <div className="mt-3 space-y-3">
                    {GLAUCOMA_CRITERIA.ratings.map((rating, idx) => (
                        <div key={idx}
                             className="bg-gray-50 dark:bg-gray-900/50 rounded p-3 border border-gray-200 dark:border-gray-700">
                          <div
                              className="flex items-start justify-between mb-2">
                      <span
                          className="font-semibold text-cyan-600 dark:text-cyan-400">
                        {rating.percent === 'variable' ?
                            'Variable' :
                            `${rating.percent}%`}
                      </span>
                            <span
                                className="text-xs text-gray-500 dark:text-gray-400">DC 6067</span>
                          </div>
                          <p className="text-sm font-medium text-gray-800 dark:text-gray-200 mb-2">
                            {rating.summary}
                          </p>
                          <ul className="space-y-1">
                            {rating.criteriaDescription.map((criteria, idx) => (
                                <li key={idx}
                                    className="text-xs text-gray-600 dark:text-gray-400 flex items-start gap-2">
                                  <span
                                      className="text-gray-400 dark:text-gray-500">•</span>
                                  <span>{criteria}</span>
                                </li>
                            ))}
                          </ul>
                        </div>
                    ))}
                  </div>
                </details>
              </div>

              {/* Important Notes */}
              <div
                  className="bg-gray-50 dark:bg-gray-900/50 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
                <h4 className="font-medium text-gray-900 dark:text-white mb-2 text-sm">Important
                  Notes</h4>
                <ul className="space-y-1 text-xs text-gray-600 dark:text-gray-400">
                  <li className="flex items-start gap-2">
                    <span>•</span>
                    <span>Vision loss ratings are based on <strong>visual acuity in the better eye</strong></span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span>•</span>
                    <span>Visual acuity must be measured with <strong>best correction</strong> (glasses/contacts)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span>•</span>
                    <span>Field of vision defects may increase the rating or be rated separately</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span>•</span>
                    <span>Glaucoma with bilateral involvement is rated under vision loss criteria</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span>•</span>
                    <span>Your symptom logs support your claim but <strong>do not replace</strong> formal ophthalmology exams</span>
                  </li>
                </ul>
              </div>
            </div>
        )}
      </div>
  );
};

export default EyeVisionRatingCard;