// MyastheniaGravisRatingCard.jsx
// Myasthenia Gravis (DC 8025) - Rating Card Component
// VA rates MG with minimum 30%, 100% during crisis
// Tracks fatigable weakness pattern and MGFA classification

import { ChevronDown, ChevronUp } from 'lucide-react';
import { MYASTHENIA_GRAVIS_CRITERIA, getRatingRowColor, getRatingTextColor } from '../utils/ratingCriteria';
import UnderstandingYourRating from './UnderstandingYourRating';
import ServiceConnectedBanner from './ServiceConnectedBanner';

export default function MyastheniaGravisRatingCard({ analysis, expanded, onToggle }) {
  if (!analysis || !analysis.hasData) return null;

  const { supportedRating, rationale, evidenceGaps, metrics } = analysis;
  const criteria = MYASTHENIA_GRAVIS_CRITERIA;

  // Normalize rating for comparison
  const normalizeRating = (rating) => {
    if (rating === null || rating === undefined) return null;
    if (typeof rating === 'number') return rating;
    if (typeof rating === 'string') return parseInt(rating, 10);
    return null;
  };

  const numericRating = normalizeRating(supportedRating);
  const isRatingSupported = (p) => numericRating === p;

  // Get MGFA class label
  const getMGFALabel = (mgfaClass) => {
    const labels = {
      'I': 'Class I - Ocular Only',
      'II': 'Class II - Mild Generalized',
      'III': 'Class III - Moderate Generalized',
      'IV': 'Class IV - Severe Generalized',
      'V': 'Class V - Intubation Required'
    };
    return labels[mgfaClass] || mgfaClass || 'Not Classified';
  };

  return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden border-l-4 border-teal-500">
        {/* Collapsed Header */}
        <button
            onClick={onToggle}
            className="w-full px-6 py-4 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
        >
          <div className="flex items-center gap-3">
            <span className="text-2xl">💪</span>
            <div className="text-left">
              <h3 className="font-semibold text-lg text-gray-900 dark:text-white">
                Myasthenia Gravis
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                DC 8025 - 38 CFR 4.124a
              </p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right">
              <div className={`text-2xl font-bold ${getRatingTextColor(supportedRating)}`}>
                {supportedRating !== null ? `${supportedRating}%` : 'N/A'}
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
              <div className="border-t border-gray-200dark:border-gray-700" />

              {/* Service-Connected Status Banner */}
              <ServiceConnectedBanner
                  conditionKey="myastheniaGravis"
                  currentAnalysis={analysis}
              />

              {/* Section 1: Evidence Summary */}
              <div>
                <h4 className="font-medium text-gray-900 dark:text-white mb-3 text-center">
                  Evidence Summary
                </h4>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg text-center">
                    <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                      {metrics?.totalLogs || 0}
                    </div>
                    <div className="text-xs text-blue-700 dark:text-blue-300">Total Logs</div>
                  </div>
                  <div className={`p-3 rounded-lg text-center ${metrics?.crisisCount > 0 ? 'bg-red-50 dark:bg-red-900/20' : 'bg-gray-50 dark:bg-gray-700/30'}`}>
                    <div className={`text-2xl font-bold ${metrics?.crisisCount > 0 ? 'text-red-600 dark:text-red-400' : 'text-gray-400'}`}>
                      {metrics?.crisisCount || 0}
                    </div>
                    <div className="text-xs text-gray-600 dark:text-gray-400">Crisis Events</div>
                  </div>
                  <div className={`p-3 rounded-lg text-center ${metrics?.ptosisOccurrences > 0 ? 'bg-purple-50 dark:bg-purple-900/20' : 'bg-gray-50 dark:bg-gray-700/30'}`}>
                    <div className={`text-2xl font-bold ${metrics?.ptosisOccurrences > 0 ? 'text-purple-600 dark:text-purple-400' : 'text-gray-400'}`}>
                      {metrics?.ptosisOccurrences || 0}
                    </div>
                    <div className="text-xs text-gray-600 dark:text-gray-400">Ptosis Events</div>
                  </div>
                  <div className={`p-3 rounded-lg text-center bg-teal-50 dark:bg-teal-900/20`}>
                    <div className="text-lg font-bold text-teal-600 dark:text-teal-400">
                      {getMGFALabel(metrics?.mgfaClassEstimate).split(' - ')[0] || '—'}
                    </div>
                    <div className="text-xs text-gray-600 dark:text-gray-400">MGFA Class</div>
                  </div>
                </div>
              </div>

              {/* MGFA Classification Note */}
              {metrics?.mgfaClassEstimate && (
                  <div className="bg-teal-50 dark:bg-teal-900/20 p-3 rounded-lg border border-teal-200 dark:border-teal-800">
                    <p className="text-sm text-teal-800 dark:text-teal-200">
                      <strong>MGFA Estimate:</strong> {getMGFALabel(metrics?.mgfaClassEstimate)}
                    </p>
                    {metrics?.hasRespiratoryInvolvement && (
                        <p className="text-sm text-red-600 dark:text-red-400 mt-1">
                          ⚠️ Respiratory involvement documented - monitor closely for crisis
                        </p>
                    )}
                  </div>
              )}

              {/* Section 2: Analysis Rationale */}
              {rationale?.length > 0 && (
                  <div>
                    <h4 className="font-medium text-gray-900 dark:text-white mb-2 text-center">
                      Analysis Rationale
                    </h4>
                    <div className="bg-gray-50 dark:bg-gray-700/30 rounded-lg p-3 space-y-2">
                      {rationale.map((item, idx) => (
                          <div key={idx} className="flex items-start gap-2">
                            <span className="text-teal-600 dark:text-teal-400 mt-0.5">◆</span>
                            <span className="text-sm text-gray-700 dark:text-gray-300">{item}</span>
                          </div>
                      ))}
                    </div>
                  </div>
              )}

              {/* Understanding Your Rating - Educational Content */}
              <UnderstandingYourRating
                  diagnosticCode="8025"
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
                            <div className={`w-14 text-center font-bold ${s ? 'text-gray-900 dark:text-white' : 'text-gray-500 dark:text-gray-400'}`}>
                              {r.percent}%
                            </div>
                            <div className={`flex-1 text-sm ${s ? 'text-gray-900 dark:text-white' : 'text-gray-500 dark:text-gray-400'}`}>
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
              {evidenceGaps?.length > 0 && (
                  <div>
                    <h4 className="font-medium text-gray-900 dark:text-white mb-2 text-center">
                      Documentation Gaps
                    </h4>
                    <div className="bg-amber-50 dark:bg-amber-900/20 rounded-lg p-3 space-y-2">
                      {evidenceGaps.map((gap, idx) => (
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
                  <li className="text-sm text-blue-800 dark:text-blue-300 flex items-start gap-2">
                    <span className="text-blue-500 mt-0.5">•</span>
                    <span>MG has a minimum 30% rating with fatigable weakness</span>
                  </li>
                  <li className="text-sm text-blue-800 dark:text-blue-300 flex items-start gap-2">
                    <span className="text-blue-500 mt-0.5">•</span>
                    <span>100% rating applies during myasthenic crisis</span>
                  </li>
                  <li className="text-sm text-blue-800 dark:text-blue-300 flex items-start gap-2">
                    <span className="text-blue-500 mt-0.5">•</span>
                    <span>Document characteristic pattern: worse with activity, better with rest</span>
                  </li>
                </ul>
              </div>

              {/* Crisis Warning */}
              {metrics?.crisisCount > 0 && (
                  <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded-lg border border-red-300 dark:border-red-700">
                    <h4 className="font-semibold text-red-900 dark:text-red-200 mb-2 flex items-center gap-2">
                      <span>🚨</span>Crisis History Documented
                    </h4>
                    <p className="text-sm text-red-800 dark:text-red-300">
                      {metrics?.crisisCount} myasthenic crisis event(s) recorded. During crisis periods,
                      a 100% rating applies. Ensure all crisis events and hospitalizations are fully documented.
                    </p>
                  </div>
              )}

              {/* Section 6: Disclaimer */}
              <div className="bg-gray-100 dark:bg-gray-700/50 rounded-lg p-3 text-xs text-gray-600 dark:text-gray-400">
                <strong>Important:</strong> {criteria.disclaimer}
              </div>
            </div>
        )}
      </div>
  );
}