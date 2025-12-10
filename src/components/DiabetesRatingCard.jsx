import { useState } from 'react';
import GlucoseTrendChart from './GlucoseTrendChart';
import { formatRating, getRatingColorClass } from '../utils/ratingCriteria';

/**
 * Enhanced Diabetes Rating Card with Glucose/HbA1c Chart
 * Shows glucose trends, HbA1c values, and VA rating analysis
 */
const DiabetesRatingCard = ({ analysis, expanded, onToggle }) => {
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
    glucoseMeasurements,
    hba1cMeasurements,
    avgGlucose,
    latestHbA1c,
  } = analysis;

  const hasMeasurements = (glucoseMeasurements && glucoseMeasurements.length > 0) ||
      (hba1cMeasurements && hba1cMeasurements.length > 0);

  return (
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
        {/* Header */}
        <button
            onClick={onToggle}
            className="w-full p-4 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
        >
          <div className="flex items-center gap-3">
            <span className="text-2xl">🩸</span>
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
                        : supportedRating.includes('0')
                            ? 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-300 border-gray-300 dark:border-gray-600'
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

                {/* Glucose Trend Chart */}
                {hasMeasurements && (
                    <div>
                      <GlucoseTrendChart
                          glucoseMeasurements={glucoseMeasurements}
                          hba1cMeasurements={hba1cMeasurements}
                          evaluationDays={90}
                      />
                    </div>
                )}

                {/* Quick Stats */}
                {(avgGlucose || latestHbA1c) && (
                    <div className="bg-gray-50 dark:bg-gray-700/30 rounded-lg p-3">
                      <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-2">
                        Control Summary
                      </h4>
                      <div className="grid grid-cols-2 gap-3 text-sm">
                        {avgGlucose && (
                            <div>
                              <span className="text-gray-600 dark:text-gray-400">Avg Glucose:</span>
                              <span className={`ml-2 font-medium ${
                                  avgGlucose > 180 ? 'text-orange-600 dark:text-orange-400' :
                                      avgGlucose > 126 ? 'text-yellow-600 dark:text-yellow-400' :
                                          'text-green-600 dark:text-green-400'
                              }`}>
                        {avgGlucose} mg/dL
                      </span>
                            </div>
                        )}
                        {latestHbA1c && (
                            <div>
                              <span className="text-gray-600 dark:text-gray-400">Latest HbA1c:</span>
                              <span className={`ml-2 font-medium ${
                                  latestHbA1c >= 9 ? 'text-red-600 dark:text-red-400' :
                                      latestHbA1c >= 7.5 ? 'text-orange-600 dark:text-orange-400' :
                                          latestHbA1c >= 7 ? 'text-yellow-600 dark:text-yellow-400' :
                                              'text-green-600 dark:text-green-400'
                              }`}>
                        {latestHbA1c}%
                      </span>
                              <span className="ml-1 text-xs text-gray-500 dark:text-gray-400">
                        ({
                                latestHbA1c >= 9 ? 'Poor' :
                                    latestHbA1c >= 7.5 ? 'Suboptimal' :
                                        latestHbA1c >= 7 ? 'Fair' :
                                            latestHbA1c >= 6.5 ? 'Good' : 'Excellent'
                              })
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
                  <h4 className="font-medium text-gray-900 dark:text-white mb-2 text-center">
                    VA Rating Schedule
                  </h4>
                  <div className="space-y-2">
                    {criteria.ratings.map(rating => {
                      const ratingStr = rating.compensable === false ? '0 (Non-comp)' :
                          rating.compensable === true ? '0 (Comp)' :
                              rating.percent.toString();
                      const isSupported = supportedRating === ratingStr ||
                          (supportedRating === '0' && rating.compensable) ||
                          supportedRating === rating.percent.toString();

                      return (
                          <div
                              key={`${rating.percent}-${rating.compensable}`}
                              className={`p-2 rounded-lg border flex items-center gap-3 ${
                                  isSupported
                                      ? `${getRatingColorClass(rating.percent)} border-2`
                                      : 'bg-gray-50 dark:bg-gray-700/30 border-gray-200 dark:border-gray-600'
                              }`}
                          >
                            <div className={`w-14 text-center font-bold text-sm ${
                                isSupported
                                    ? ''
                                    : 'text-gray-500 dark:text-gray-400'
                            }`}>
                              {ratingStr}
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
                      <h4 className="font-medium text-gray-900 dark:text-white mb-2 text-center">
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
                        <span>{showDefinitions ? 'Hide' : 'Show'} Diabetes Rating Definitions</span>
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
                    Important: Diabetes Documentation
                  </h4>
                  <ul className="space-y-2 text-sm text-blue-800 dark:text-blue-400">
                    <li className="flex items-start gap-2">
                      <span className="mt-0.5">•</span>
                      <span>Log both fasting (before breakfast) and post-meal glucose readings</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="mt-0.5">•</span>
                      <span>Record HbA1c test results every 3 months</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="mt-0.5">•</span>
                      <span>Document insulin injections and oral medication use</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="mt-0.5">•</span>
                      <span>Track severe hypoglycemic episodes requiring assistance</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="mt-0.5">•</span>
                      <span>Higher ratings (60-100%) require hospitalization documentation</span>
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

export default DiabetesRatingCard;