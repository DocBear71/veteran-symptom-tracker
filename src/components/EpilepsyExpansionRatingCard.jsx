// CREATE NEW FILE: /mnt/project/components/EpilepsyExpansionRatingCard.jsx

import { ChevronDown, ChevronUp } from 'lucide-react';
import {
  EPILEPSY_JACKSONIAN_CRITERIA,
  EPILEPSY_DIENCEPHALIC_CRITERIA,
  EPILEPSY_PSYCHOMOTOR_CRITERIA,
  getRatingRowColor,
  getRatingTextColor,
} from '../utils/ratingCriteria';
import UnderstandingYourRating from './UnderstandingYourRating';
import ServiceConnectedBanner from './ServiceConnectedBanner';

/**
 * Epilepsy Expansion Rating Card Component - Gold Standard Version
 * DC 8912 - Jacksonian/Focal Epilepsy - 38 CFR 4.124a
 * DC 8913 - Diencephalic Epilepsy - 38 CFR 4.124a
 * DC 8914 - Psychomotor Epilepsy - 38 CFR 4.124a
 *
 * Flexible component handling all three epilepsy types via epilepsyType prop
 */

const EPILEPSY_CONFIG = {
  jacksonian: {
    criteria: EPILEPSY_JACKSONIAN_CRITERIA,
    title: 'Epilepsy, Jacksonian/Focal',
    code: '8912',
    icon: '🎯',
    borderColor: 'border-purple-500',
    accentColor: 'purple',
  },
  diencephalic: {
    criteria: EPILEPSY_DIENCEPHALIC_CRITERIA,
    title: 'Epilepsy, Diencephalic',
    code: '8913',
    icon: '🌡️',
    borderColor: 'border-teal-500',
    accentColor: 'teal',
  },
  psychomotor: {
    criteria: EPILEPSY_PSYCHOMOTOR_CRITERIA,
    title: 'Epilepsy, Psychomotor',
    code: '8914',
    icon: '🧠',
    borderColor: 'border-indigo-500',
    accentColor: 'indigo',
  },
};

export default function EpilepsyExpansionRatingCard({ analysis, expanded, onToggle, epilepsyType = 'jacksonian' }) {
  if (!analysis || !analysis.hasData) return null;

  const config = EPILEPSY_CONFIG[epilepsyType] || EPILEPSY_CONFIG.jacksonian;
  const { supportedRating, ratingRationale, gaps, metrics } = analysis;
  const criteria = config.criteria;

  // Normalize rating for comparison (handles string vs number)
  const normalizeRating = (rating) => {
    if (rating === null || rating === undefined) return null;
    if (typeof rating === 'number') return rating;
    if (typeof rating === 'string') return parseInt(rating, 10);
    return null;
  };

  const numericRating = normalizeRating(supportedRating);
  const isRatingSupported = (p) => numericRating === p;

  // Get text color class based on accent
  const getAccentTextColor = () => {
    switch (config.accentColor) {
      case 'purple': return 'text-purple-600 dark:text-purple-400';
      case 'teal': return 'text-teal-600 dark:text-teal-400';
      case 'indigo': return 'text-indigo-600 dark:text-indigo-400';
      default: return 'text-purple-600 dark:text-purple-400';
    }
  };

  return (
      <div className={`bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden border-l-4 ${config.borderColor}`}>
        {/* === COLLAPSED HEADER === */}
        <button
            onClick={onToggle}
            className="w-full px-6 py-4 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
        >
          <div className="flex items-center gap-3">
            <span className="text-2xl">{config.icon}</span>
            <div className="text-left">
              <h3 className="font-semibold text-lg text-gray-900 dark:text-white">
                {config.title}
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                DC {config.code} - 38 CFR 4.124a
              </p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right">
              <div className={`text-2xl font-bold ${getRatingTextColor(supportedRating)}`}>
                {supportedRating !== null && supportedRating !== undefined ? `${supportedRating}%` : 'N/A'}
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

        {/* === EXPANDED CONTENT === */}
        {expanded && (
            <div className="px-6 pb-6 space-y-6">
              <div className="border-t border-gray-200dark:border-gray-700" />

              {/* Service-Connected Status Banner */}
              <ServiceConnectedBanner
                  conditionKey="epilepsy"
                  currentAnalysis={analysis}
              />

              {/* Section 1: Evidence Summary (4-box grid) */}
              <div>
                <h4 className="font-medium text-gray-900 dark:text-white mb-3 text-center">
                  Evidence Summary
                </h4>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {/* Total Logs */}
                  <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg text-center">
                    <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                      {metrics?.totalLogs || 0}
                    </div>
                    <div className="text-xs text-blue-700 dark:text-blue-300">Total Logs</div>
                  </div>

                  {/* Major Seizures */}
                  <div className={`p-3 rounded-lg text-center ${
                      metrics?.majorSeizures > 0
                          ? 'bg-red-50 dark:bg-red-900/20'
                          : 'bg-gray-50 dark:bg-gray-700/30'
                  }`}>
                    <div className={`text-2xl font-bold ${
                        metrics?.majorSeizures > 0
                            ? 'text-red-600 dark:text-red-400'
                            : 'text-gray-400'
                    }`}>
                      {metrics?.majorSeizures || 0}
                    </div>
                    <div className="text-xs text-gray-600 dark:text-gray-400">Major</div>
                  </div>

                  {/* Minor Seizures */}
                  <div className={`p-3 rounded-lg text-center ${
                      metrics?.minorSeizures > 0
                          ? 'bg-purple-50 dark:bg-purple-900/20'
                          : 'bg-gray-50 dark:bg-gray-700/30'
                  }`}>
                    <div className={`text-2xl font-bold ${
                        metrics?.minorSeizures > 0
                            ? 'text-purple-600 dark:text-purple-400'
                            : 'text-gray-400'
                    }`}>
                      {metrics?.minorSeizures || 0}
                    </div>
                    <div className="text-xs text-gray-600 dark:text-gray-400">Minor</div>
                  </div>

                  {/* Weekly Average or Last Year */}
                  <div className={`p-3 rounded-lg text-center ${
                      (metrics?.weeklyMinorAverage > 0 || metrics?.lastYearCount > 0)
                          ? 'bg-orange-50 dark:bg-orange-900/20'
                          : 'bg-gray-50 dark:bg-gray-700/30'
                  }`}>
                    <div className={`text-2xl font-bold ${
                        (metrics?.weeklyMinorAverage > 0 || metrics?.lastYearCount > 0)
                            ? 'text-orange-600 dark:text-orange-400'
                            : 'text-gray-400'
                    }`}>
                      {metrics?.weeklyMinorAverage !== undefined
                          ? metrics.weeklyMinorAverage.toFixed(1)
                          : (metrics?.lastYearCount || 0)}
                    </div>
                    <div className="text-xs text-gray-600 dark:text-gray-400">
                      {metrics?.weeklyMinorAverage !== undefined ? '/Week' : 'Last Year'}
                    </div>
                  </div>
                </div>
              </div>

              {/* Section 2: Analysis Rationale */}
              {ratingRationale?.length > 0 && (
                  <div>
                    <h4 className="font-medium text-gray-900 dark:text-white mb-2 text-center">
                      Analysis Rationale
                    </h4>
                    <div className="bg-gray-50 dark:bg-gray-700/30 rounded-lg p-3 space-y-2">
                      {ratingRationale.map((item, idx) => (
                          <div key={idx} className="flex items-start gap-2">
                            <span className="text-blue-600 dark:text-blue-400 mt-0.5">◆</span>
                            <span className="text-sm text-gray-700 dark:text-gray-300">{item}</span>
                          </div>
                      ))}
                    </div>
                  </div>
              )}

              {/* Understanding Your Rating - Educational Content */}
              <UnderstandingYourRating
                  diagnosticCode={config.code}
                  currentRating={numericRating}
              />

              {/* Section 3: VA Rating Schedule */}
              <div>
                <h4 className="font-medium text-gray-900 dark:text-white mb-2 text-center">
                  VA Rating Schedule
                </h4>
                <div className="space-y-2">
                  {criteria.ratings.map(r => {
                    const s = isRatingSupported(r.percent);
                    return (
                        <div
                            key={r.percent}
                            className={`p-3 rounded-lg border ${s ? 'border-2' : ''} ${getRatingRowColor(r.percent, s)}`}
                        >
                          <div className="flex items-center gap-3">
                            <div className={`w-14 text-center font-bold ${
                                s ? 'text-gray-900 dark:text-white' : 'text-gray-500 dark:text-gray-400'
                            }`}>
                              {r.percent}%
                            </div>
                            <div className={`flex-1 text-sm ${
                                s ? 'text-gray-900 dark:text-white' : 'text-gray-500 dark:text-gray-400'
                            }`}>
                              {r.summary}
                            </div>
                            {s && <span className="text-green-600 dark:text-green-400">✓</span>}
                          </div>
                        </div>
                    );
                  })}
                </div>
              </div>

              {/* Section 4: Documentation Gaps */}
              {gaps?.length > 0 && (
                  <div>
                    <h4 className="font-medium text-gray-900 dark:text-white mb-2 text-center">
                      Documentation Gaps
                    </h4>
                    <div className="bg-amber-50 dark:bg-amber-900/20 rounded-lg p-3 space-y-2">
                      {gaps.map((gap, idx) => (
                          <div key={idx} className="flex items-start gap-2">
                            <span className="text-amber-600 dark:text-amber-400 mt-0.5">⚠</span>
                            <span className="text-sm text-gray-700 dark:text-gray-300">{gap}</span>
                          </div>
                      ))}
                    </div>
                  </div>
              )}

              {/* Section 5: Important Information */}
              <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg border border-blue-200 dark:border-blue-800">
                <h4 className="font-semibold text-blue-900 dark:text-blue-200 mb-2 flex items-center gap-2">
                  <span>ℹ️</span>Important Information
                </h4>
                <ul className="space-y-1">
                  {epilepsyType === 'jacksonian' && (
                      <>
                        <li className="text-sm text-blue-800 dark:text-blue-300 flex items-start gap-2">
                          <span className="text-blue-500 mt-0.5">•</span>
                          <span>Rate as minor seizures unless major seizures predominate</span>
                        </li>
                        <li className="text-sm text-blue-800 dark:text-blue-300 flex items-start gap-2">
                          <span className="text-blue-500 mt-0.5">•</span>
                          <span>Secondary generalization counts as major seizure</span>
                        </li>
                        <li className="text-sm text-blue-800 dark:text-blue-300 flex items-start gap-2">
                          <span className="text-blue-500 mt-0.5">•</span>
                          <span>Document focal onset location and spread pattern</span>
                        </li>
                      </>
                  )}
                  {epilepsyType === 'diencephalic' && (
                      <>
                        <li className="text-sm text-blue-800 dark:text-blue-300 flex items-start gap-2">
                          <span className="text-blue-500 mt-0.5">•</span>
                          <span>Always rated as minor seizures per 38 CFR 4.124a</span>
                        </li>
                        <li className="text-sm text-blue-800 dark:text-blue-300 flex items-start gap-2">
                          <span className="text-blue-500 mt-0.5">•</span>
                          <span>Document autonomic symptoms during episodes</span>
                        </li>
                        <li className="text-sm text-blue-800 dark:text-blue-300 flex items-start gap-2">
                          <span className="text-blue-500 mt-0.5">•</span>
                          <span>Track weekly frequency for higher ratings</span>
                        </li>
                      </>
                  )}
                  {epilepsyType === 'psychomotor' && (
                      <>
                        <li className="text-sm text-blue-800 dark:text-blue-300 flex items-start gap-2">
                          <span className="text-blue-500 mt-0.5">•</span>
                          <span>Can be rated as MAJOR or MINOR depending on characteristics</span>
                        </li>
                        <li className="text-sm text-blue-800 dark:text-blue-300 flex items-start gap-2">
                          <span className="text-blue-500 mt-0.5">•</span>
                          <span>Major: automatic states and/or convulsions with LOC</span>
                        </li>
                        <li className="text-sm text-blue-800 dark:text-blue-300 flex items-start gap-2">
                          <span className="text-blue-500 mt-0.5">•</span>
                          <span>Minor: brief episodes with hallucinations, déjà vu, mood changes</span>
                        </li>
                      </>
                  )}
                </ul>
              </div>

              {/* Section 6: Disclaimer */}
              <div className="bg-gray-100 dark:bg-gray-700/50 rounded-lg p-3 text-xs text-gray-600 dark:text-gray-400">
                <strong>Important:</strong> {criteria.disclaimer || 'Based on 38 CFR 4.124a. For documentation purposes only. The VA determines final ratings based on complete medical evidence and C&P examination findings.'}
              </div>
            </div>
        )}
      </div>
  );
}