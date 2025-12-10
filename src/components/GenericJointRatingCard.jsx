import { useState } from 'react';
import { formatRating, getRatingColorClass } from '../utils/ratingCriteria';

/**
 * Generic Joint Conditions Rating Card Component
 * Reusable for Ankle, Wrist, Elbow, Degenerative Arthritis, and other joint conditions
 */
const GenericJointRatingCard = ({ analysis, expanded, onToggle, icon = '🦴' }) => {
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
  } = analysis;

  return (
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
        {/* Header */}
        <button
            onClick={onToggle}
            className="w-full p-4 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
        >
          <div className="flex items-center gap-3">
            <span className="text-2xl">{icon}</span>
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
                    supportedRating.includes('-')
                        ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 border-blue-300 dark:border-blue-700'
                        : getRatingColorClass(parseInt(supportedRating))
                }`}>
              {supportedRating}%
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
                        Rating Analysis
                      </h4>
                      <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-3 space-y-2">
                        {ratingRationale.map((item, i) => (
                            <div key={i} className="flex items-start gap-2">
                              <span className="text-blue-600 dark:text-blue-400 mt-0.5">•</span>
                              <span className="text-sm text-gray-700 dark:text-gray-300">{item}</span>
                            </div>
                        ))}
                      </div>
                    </div>
                )}

                {/* Documentation Gaps */}
                {gaps && gaps.length > 0 && (
                    <div>
                      <h4 className="font-medium text-gray-900 dark:text-white mb-2 text-center">
                        Documentation Gaps / Recommendations
                      </h4>
                      <div className="bg-amber-50 dark:bg-amber-900/20 rounded-lg p-3 space-y-2">
                        {gaps.map((item, i) => (
                            <div key={i} className="flex items-start gap-2">
                              <span className="text-amber-600 dark:text-amber-400 mt-0.5">!</span>
                              <span className="text-sm text-gray-700 dark:text-gray-300">{item}</span>
                            </div>
                        ))}
                      </div>
                    </div>
                )}

                {/* Definitions Toggle */}
                {criteria.definitions && (
                    <div>
                      <button
                          onClick={() => setShowDefinitions(!showDefinitions)}
                          className="flex items-center gap-2 text-sm text-blue-600 dark:text-blue-400 hover:underline"
                      >
                        <svg
                            className={`w-4 h-4 transition-transform ${showDefinitions ? 'rotate-180' : ''}`}
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7"/>
                        </svg>
                        {showDefinitions ? 'Hide' : 'Show'} Medical Definitions
                      </button>

                      {showDefinitions && (
                          <div className="mt-3 bg-gray-50 dark:bg-gray-700/30 rounded-lg p-3 space-y-3">
                            {Object.entries(criteria.definitions).map(([key, def]) => (
                                <div key={key}>
                                  <h5 className="font-medium text-gray-900 dark:text-white text-sm">
                                    {def.term}
                                  </h5>
                                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                                    {def.definition}
                                  </p>
                                  {def.examples && def.examples.length > 0 && (
                                      <ul className="mt-1 ml-4 text-xs text-gray-500 dark:text-gray-400 list-disc">
                                        {def.examples.map((ex, i) => (
                                            <li key={i}>{ex}</li>
                                        ))}
                                      </ul>
                                  )}
                                </div>
                            ))}
                          </div>
                      )}
                    </div>
                )}

                {/* Major/Minor Note (for wrist/elbow) */}
                {criteria.majorMinorNote && (
                    <div className="bg-purple-50 dark:bg-purple-900/20 rounded-lg p-3">
                      <p className="text-sm text-purple-700 dark:text-purple-300">
                        <strong>Dominance Note:</strong> {criteria.majorMinorNote}
                      </p>
                    </div>
                )}

                {/* Rating Note (for degenerative arthritis) */}
                {criteria.ratingNote && (
                    <div className="bg-indigo-50 dark:bg-indigo-900/20 rounded-lg p-3">
                      <p className="text-sm text-indigo-700 dark:text-indigo-300">
                        <strong>Rating Note:</strong> {criteria.ratingNote}
                      </p>
                    </div>
                )}

                {/* Rating Criteria Reference */}
                <div>
                  <h4 className="font-medium text-gray-900 dark:text-white mb-2 text-center">
                    VA Rating Criteria Summary
                  </h4>
                  <div className="bg-gray-100 dark:bg-gray-700/50 rounded-lg p-3">
                    <ul className="space-y-1 text-sm text-gray-700 dark:text-gray-300">
                      {criteria.ratings && criteria.ratings.slice(0, 5).map((rating, i) => (
                          <li key={i} className="flex items-start gap-2">
                            <span className="mt-0.5">•</span>
                            <span><strong>{rating.percent}%</strong> = {rating.summary}</span>
                          </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Disclaimer */}
                {disclaimer && (
                    <div className="bg-gray-100 dark:bg-gray-700/50 rounded-lg p-3 text-xs text-gray-600 dark:text-gray-400">
                      <strong>Important:</strong> {disclaimer}
                    </div>
                )}
              </div>
            </div>
        )}
      </div>
  );
};

export default GenericJointRatingCard;