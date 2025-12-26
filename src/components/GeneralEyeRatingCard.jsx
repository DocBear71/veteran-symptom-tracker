import { ChevronDown, ChevronUp } from 'lucide-react';
import {
  UVEITIS_CRITERIA,
  KERATITIS_CRITERIA,
  CHRONIC_CONJUNCTIVITIS_CRITERIA,
  SCLERITIS_CRITERIA,
} from '../utils/ratingCriteria';
import UnderstandingYourRating from './UnderstandingYourRating.jsx';

/**
 * General Eye Rating Card Component - Gold Standard Version
 * Supports: DC 6000 (Uveitis), DC 6001 (Keratitis), DC 6002 (Scleritis), DC 6018 (Chronic Conjunctivitis)
 * All use the General Rating Formula for Diseases of the Eye
 * Color scheme: cyan (sensory/eye conditions)
 */
export default function GeneralEyeRatingCard({ analysis, expanded, onToggle }) {
  if (!analysis || !analysis.hasData) return null;

  const { condition, diagnosticCode, supportedRating, ratingRationale, gaps, metrics } = analysis;

  // Get the appropriate criteria based on diagnostic code
  const getCriteria = () => {
    switch (diagnosticCode) {
      case '6000': return UVEITIS_CRITERIA;
      case '6001': return KERATITIS_CRITERIA;
      case '6002': return SCLERITIS_CRITERIA;
      case '6018': return CHRONIC_CONJUNCTIVITIS_CRITERIA;
      default: return UVEITIS_CRITERIA;
    }
  };

  const criteria = getCriteria();

  // Get condition-specific icon
  const getConditionIcon = () => {
    switch (diagnosticCode) {
      case '6000': return '👁️'; // Uveitis
      case '6001': return '🔍'; // Keratitis (cornea)
      case '6002': return '⚪'; // Scleritis (white of eye)
      case '6018': return '👀'; // Conjunctivitis
      default: return '👁️';
    }
  };

  // Normalize rating for comparison
  const normalizeRating = (rating) => {
    if (rating === null || rating === undefined) return null;
    if (typeof rating === 'number') return rating;
    if (typeof rating === 'string') return parseInt(rating, 10);
    return null;
  };

  const numericRating = normalizeRating(supportedRating);
  const isRatingSupported = (p) => numericRating === p;

  // Standardized color scheme across all rating cards
  const getRatingRowColor = (percent, isSupported) => {
    if (!isSupported) return 'bg-gray-50 dark:bg-gray-700/30 border-gray-200 dark:border-gray-600';
    if (percent >= 100) return 'bg-red-100 dark:bg-red-900/30 border-red-300 dark:border-red-700';
    if (percent >= 70) return 'bg-orange-100 dark:bg-orange-900/30 border-orange-300 dark:border-orange-700';
    if (percent >= 50) return 'bg-amber-100 dark:bg-amber-900/30 border-amber-300 dark:border-amber-700';
    if (percent >= 30) return 'bg-yellow-100 dark:bg-yellow-900/30 border-yellow-300 dark:border-yellow-700';
    if (percent >= 10) return 'bg-green-100 dark:bg-green-900/30 border-green-300 dark:border-green-700';
    return 'bg-blue-50 dark:bg-blue-900/30 border-blue-200 dark:border-blue-700';
  };

  return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden border-l-4 border-cyan-500">
        {/* === COLLAPSED HEADER === */}
        <button
            onClick={onToggle}
            className="w-full px-6 py-4 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
        >
          <div className="flex items-center gap-3">
            <span className="text-2xl">{getConditionIcon()}</span>
            <div className="text-left">
              <h3 className="font-semibold text-lg text-gray-900 dark:text-white">{condition}</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">DC {diagnosticCode} - 38 CFR 4.79</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right">
              <div className="text-2xl font-bold text-cyan-600 dark:text-cyan-400">
                {supportedRating !== null ? `${supportedRating}%` : 'N/A'}
              </div>
              <div className="text-xs text-gray-500 dark:text-gray-400">Supported Rating</div>
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
              <div className="border-t border-gray-200 dark:border-gray-700" />

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

                  {/* Treatment Visits - Key metric for eye conditions */}
                  <div className={`p-3 rounded-lg text-center ${
                      metrics?.treatmentVisits > 0
                          ? 'bg-cyan-50 dark:bg-cyan-900/20'
                          : 'bg-gray-50 dark:bg-gray-700/30'
                  }`}>
                    <div className={`text-2xl font-bold ${
                        metrics?.treatmentVisits > 0
                            ? 'text-cyan-600 dark:text-cyan-400'
                            : 'text-gray-400'
                    }`}>
                      {metrics?.treatmentVisits || 0}
                    </div>
                    <div className="text-xs text-gray-600 dark:text-gray-400">Treatment Visits</div>
                  </div>

                  {/* Avg Severity */}
                  <div className={`p-3 rounded-lg text-center ${
                      metrics?.avgSeverity > 0
                          ? 'bg-purple-50 dark:bg-purple-900/20'
                          : 'bg-gray-50 dark:bg-gray-700/30'
                  }`}>
                    <div className={`text-2xl font-bold ${
                        metrics?.avgSeverity > 0
                            ? 'text-purple-600 dark:text-purple-400'
                            : 'text-gray-400'
                    }`}>
                      {(metrics?.avgSeverity || 0).toFixed(1)}
                    </div>
                    <div className="text-xs text-gray-600 dark:text-gray-400">Avg Severity</div>
                  </div>

                  {/* Condition-specific fourth box */}
                  <div className={`p-3 rounded-lg text-center ${
                      metrics?.isChronic || metrics?.hasComplications
                          ? 'bg-orange-50 dark:bg-orange-900/20'
                          : 'bg-gray-50 dark:bg-gray-700/30'
                  }`}>
                    <div className={`text-2xl font-bold ${
                        metrics?.isChronic || metrics?.hasComplications
                            ? 'text-orange-600 dark:text-orange-400'
                            : 'text-gray-400'
                    }`}>
                      {metrics?.isBilateral ? '👁️👁️' : metrics?.isChronic ? '↻' : '—'}
                    </div>
                    <div className="text-xs text-gray-600 dark:text-gray-400">
                      {metrics?.isBilateral ? 'Bilateral' : metrics?.isChronic ? 'Chronic' : 'Status'}
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
                  diagnosticCode={diagnosticCode}
                  currentRating={numericRating}
              />

              {/* Section 3: VA Rating Schedule */}
              <div>
                <h4 className="font-medium text-gray-900 dark:text-white mb-2 text-center">
                  VA Rating Schedule
                </h4>
                <div className="space-y-2">
                  {criteria.ratings.map((r) => {
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
                  <li className="text-sm text-blue-800 dark:text-blue-300 flex items-start gap-2">
                    <span className="text-blue-500 mt-0.5">•</span>
                    <span>Log each clinic visit for treatment as a "Treatment Visit" symptom</span>
                  </li>
                  <li className="text-sm text-blue-800 dark:text-blue-300 flex items-start gap-2">
                    <span className="text-blue-500 mt-0.5">•</span>
                    <span>Incapacitating episode = visit specifically for treatment (not routine monitoring)</span>
                  </li>
                  <li className="text-sm text-blue-800 dark:text-blue-300 flex items-start gap-2">
                    <span className="text-blue-500 mt-0.5">•</span>
                    <span>Document visual acuity if impaired - may qualify for higher rating under DC 6061-6091</span>
                  </li>
                  <li className="text-sm text-blue-800 dark:text-blue-300 flex items-start gap-2">
                    <span className="text-blue-500 mt-0.5">•</span>
                    <span>7+ visits = 60%, 5-6 visits = 40%, 3-4 visits = 20%, 1-2 visits = 10%</span>
                  </li>
                </ul>
              </div>

              {/* Section 6: Disclaimer */}
              <div className="bg-gray-100 dark:bg-gray-700/50 rounded-lg p-3 text-xs text-gray-600 dark:text-gray-400">
                <strong>Important:</strong> Based on 38 CFR 4.79, General Rating Formula for Diseases of the Eye.
                Rating based on incapacitating episodes (treatment visits) or visual impairment, whichever is higher.
                For documentation purposes only.
              </div>
            </div>
        )}
      </div>
  );
}