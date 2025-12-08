import { useState } from 'react';
import { formatRating, getRatingColorClass } from '../utils/ratingCriteria';

/**
 * Rhinitis Rating Card Component
 * Shows rhinitis symptom analysis and VA rating
 */
const RhinitisRatingCard = ({ analysis, expanded, onToggle }) => {
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
            <span className="text-2xl">🤧</span>
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
              <div className="space-y-4">

                {/* Evidence Summary */}
                <div>
                  <h4 className="font-medium text-gray-900 dark:text-white mb-2">
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
                      <h4 className="font-medium text-gray-900 dark:text-white mb-2">
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
                  <h4 className="font-medium text-gray-900 dark:text-white mb-2">
                    VA Rating Schedule
                  </h4>
                  <div className="space-y-2">
                    {criteria.ratings.map(rating => {
                      const isSupported = supportedRating === rating.percent.toString();

                      return (
                          <div
                              key={rating.percent}
                              className={`p-2 rounded-lg border flex items-center gap-3 ${
                                  isSupported
                                      ? `${getRatingColorClass(rating.percent)} border-2`
                                      : 'bg-gray-50 dark:bg-gray-700/30 border-gray-200 dark:border-gray-600'
                              }`}
                          >
                            <div className={`w-12 text-center font-bold ${
                                isSupported
                                    ? ''
                                    : 'text-gray-500 dark:text-gray-400'
                            }`}>
                              {formatRating(rating.percent)}
                            </div>
                            <div className={`flex-1 text-sm ${
                                isSupported
                                    ? ''
                                    : 'text-gray-500 dark:text-gray-400'
                            }`}>
                              {rating.summary}
                            </div>
                            {isSupported && (
                                <span className="text-green-600 dark:text-green-400">✓</span>
                            )}
                          </div>
                      );
                    })}
                  </div>
                </div>

                {/* Documentation Gaps */}
                {gaps && gaps.length > 0 && (
                    <div>
                      <h4 className="font-medium text-gray-900 dark:text-white mb-2">
                        Documentation Gaps
                      </h4>
                      <div className="bg-yellow-50 dark:bg-yellow-900/20 rounded-lg p-3 space-y-2">
                        {gaps.map((gap, i) => (
                            <div key={i} className="flex items-start gap-2">
                              <span className="text-yellow-600 dark:text-yellow-400 mt-0.5">⚠</span>
                              <span className="text-sm text-gray-700 dark:text-gray-300">{gap}</span>
                            </div>
                        ))}
                      </div>
                    </div>
                )}

                {/* Key Definitions */}
                {criteria.definitions && Object.keys(criteria.definitions).length > 0 && (
                    <div>
                      <button
                          onClick={() => setShowDefinitions(!showDefinitions)}
                          className="flex items-center gap-2 text-sm text-blue-600 dark:text-blue-400 hover:underline"
                      >
                        <span>📖</span>
                        <span>{showDefinitions ? 'Hide' : 'Show'} Rhinitis Rating Definitions</span>
                      </button>

                      {showDefinitions && (
                          <div className="mt-3 space-y-2">
                            {Object.values(criteria.definitions).map((def, i) => (
                                <div key={i} className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-3">
                                  <h5 className="font-medium text-blue-900 dark:text-blue-300 text-sm">
                                    {def.term}
                                  </h5>
                                  <p className="text-sm text-blue-800 dark:text-blue-400 mt-1">
                                    {def.definition}
                                  </p>
                                  {def.examples && (
                                      <ul className="mt-2 text-xs text-blue-700 dark:text-blue-400 space-y-1">
                                        {def.examples.map((example, j) => (
                                            <li key={j}>• {example}</li>
                                        ))}
                                      </ul>
                                  )}
                                </div>
                            ))}
                          </div>
                      )}
                    </div>
                )}

                {/* Important Note */}
                <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4 border-l-4 border-blue-500">
                  <h4 className="font-medium text-blue-900 dark:text-blue-300 mb-2">
                    Important: Rhinitis Documentation
                  </h4>
                  <ul className="space-y-2 text-sm text-blue-800 dark:text-blue-400">
                    <li className="flex items-start gap-2">
                      <span className="mt-0.5">•</span>
                      <span>Log chronic nasal congestion episodes</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="mt-0.5">•</span>
                      <span>Document post-nasal drainage and sneezing</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="mt-0.5">•</span>
                      <span>Note if seasonal or year-round</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="mt-0.5">•</span>
                      <span>Track triggers (allergens, weather, irritants)</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="mt-0.5">•</span>
                      <span>30% rating requires ENT documentation of nasal polyps</span>
                    </li>
                  </ul>
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

export default RhinitisRatingCard;