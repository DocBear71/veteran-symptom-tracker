// ============================================
// TuberculosisRatingCard.jsx
// Phase 14C: Rating card for Tuberculosis
// DC 6730 (Active), DC 6731 (Inactive), DC 6311 (Miliary)
// ============================================

import { ChevronDown, ChevronUp, AlertCircle, Info, AlertTriangle } from 'lucide-react';
import {
  TUBERCULOSIS_ACTIVE_CRITERIA,
  TUBERCULOSIS_INACTIVE_CRITERIA,
  TUBERCULOSIS_MILIARY_CRITERIA
} from '../utils/ratingCriteria';

const TuberculosisRatingCard = ({ analysis, expanded, onToggle }) => {
  if (!analysis?.hasData) {
    return null;
  }

  const {
    supportedRating,
    rationale = [],
    evidenceGaps = [],
    metrics = {},
    diagnosticCode,
    diseaseStatus,
  } = analysis;

  // Select appropriate criteria based on disease status
  const criteria = diagnosticCode === '6311' ? TUBERCULOSIS_MILIARY_CRITERIA :
      diagnosticCode === '6730' ? TUBERCULOSIS_ACTIVE_CRITERIA :
          TUBERCULOSIS_INACTIVE_CRITERIA;

  // Determine card styling based on status
  const getStatusInfo = () => {
    if (diseaseStatus === 'miliary-active') {
      return {
        color: 'red',
        icon: '🦠',
        label: 'MILIARY (DISSEMINATED)',
        bgClass: 'bg-red-50 dark:bg-red-900/20',
        borderClass: 'border-red-500',
      };
    }
    if (diseaseStatus === 'active') {
      return {
        color: 'orange',
        icon: '🫁',
        label: 'ACTIVE',
        bgClass: 'bg-orange-50 dark:bg-orange-900/20',
        borderClass: 'border-orange-500',
      };
    }
    return {
      color: 'teal',
      icon: '🫁',
      label: 'INACTIVE',
      bgClass: 'bg-teal-50 dark:bg-teal-900/20',
      borderClass: 'border-teal-500',
    };
  };

  const statusInfo = getStatusInfo();

  // Check if a rating level is supported
  const isRatingSupported = (ratingPercent) => {
    if (typeof ratingPercent === 'string') return false; // "Rate residuals"
    return supportedRating >= ratingPercent;
  };

  // Get row styling for rating schedule
  const getRatingRowStyle = (percent, isSupported) => {
    if (!isSupported) {
      return 'bg-gray-50 dark:bg-gray-700/30 border-gray-200 dark:border-gray-600';
    }
    if (percent === 100) return 'bg-red-50 dark:bg-red-900/20 border-red-300 dark:border-red-700';
    if (percent >= 60) return 'bg-orange-50 dark:bg-orange-900/20 border-orange-300 dark:border-orange-700';
    if (percent >= 30) return 'bg-yellow-50 dark:bg-yellow-900/20 border-yellow-300 dark:border-yellow-700';
    return 'bg-green-50 dark:bg-green-900/20 border-green-300 dark:border-green-700';
  };

  return (
      <div className={`bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden border-l-4 ${statusInfo.borderClass}`}>
        {/* === COLLAPSED HEADER === */}
        <button
            onClick={onToggle}
            className="w-full px-6 py-4 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
        >
          <div className="flex items-center gap-3">
            <span className="text-2xl">{statusInfo.icon}</span>
            <div className="text-left">
              <div className="flex items-center gap-2">
                <h3 className="font-semibold text-lg text-gray-900 dark:text-white">
                  Tuberculosis
                </h3>
                <span className={`px-2 py-0.5 text-xs font-bold rounded ${
                    diseaseStatus === 'miliary-active' ? 'bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-300' :
                        diseaseStatus === 'active' ? 'bg-orange-100 text-orange-800 dark:bg-orange-900/50 dark:text-orange-300' :
                            'bg-teal-100 text-teal-800 dark:bg-teal-900/50 dark:text-teal-300'
                }`}>
                {statusInfo.label}
              </span>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                DC {diagnosticCode} - {diagnosticCode === '6311' ? '38 CFR 4.88b' : '38 CFR 4.97'}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right">
              <div className={`text-2xl font-bold text-${statusInfo.color}-600 dark:text-${statusInfo.color}-400`}>
                {supportedRating}%
              </div>
              <div className="text-xs text-gray-500 dark:text-gray-400">
                {diseaseStatus === 'inactive' && supportedRating < 100 ? 'Based on Residuals' : 'Supported Rating'}
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
              <div className="border-t border-gray-200 dark:border-gray-700" />

              {/* Active TB Warning Banner */}
              {(diseaseStatus === 'active' || diseaseStatus === 'miliary-active') && (
                  <div className="bg-red-50 dark:bg-red-900/30 p-4 rounded-lg border border-red-300 dark:border-red-700">
                    <div className="flex items-start gap-3">
                      <AlertTriangle className="w-5 h-5 text-red-600 dark:text-red-400 mt-0.5 flex-shrink-0" />
                      <div>
                        <h4 className="font-semibold text-red-900 dark:text-red-200">
                          Active Tuberculosis - 100% Rating
                        </h4>
                        <p className="text-sm text-red-800 dark:text-red-300 mt-1">
                          Active TB is rated 100% while disease is active. A mandatory VA examination is required
                          when TB becomes inactive to reassess rating based on residuals.
                        </p>
                      </div>
                    </div>
                  </div>
              )}

              {/* Section 1: Evidence Summary */}
              <div>
                <h4 className="font-medium text-gray-900 dark:text-white mb-3 text-center">
                  Evidence Summary
                </h4>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {/* Total Logs */}
                  <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg text-center">
                    <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                      {metrics.totalLogs || 0}
                    </div>
                    <div className="text-xs text-blue-700 dark:text-blue-300">Total Entries</div>
                  </div>

                  {/* Constitutional Symptoms */}
                  <div className="bg-orange-50 dark:bg-orange-900/20 p-3 rounded-lg text-center">
                    <div className="text-2xl font-bold text-orange-600 dark:text-orange-400">
                      {metrics.constitutionalSymptoms || 0}
                    </div>
                    <div className="text-xs text-orange-700 dark:text-orange-300">Constitutional</div>
                    <div className="text-xs text-orange-600 dark:text-orange-400">Fever/Sweats/Weight</div>
                  </div>

                  {/* Respiratory */}
                  <div className="bg-sky-50 dark:bg-sky-900/20 p-3 rounded-lg text-center">
                    <div className="text-2xl font-bold text-sky-600 dark:text-sky-400">
                      {metrics.respiratorySymptoms || 0}
                    </div>
                    <div className="text-xs text-sky-700 dark:text-sky-300">Respiratory</div>
                    <div className="text-xs text-sky-600 dark:text-sky-400">Cough Entries</div>
                  </div>

                  {/* Hospitalizations */}
                  <div className="bg-red-50 dark:bg-red-900/20 p-3 rounded-lg text-center">
                    <div className="text-2xl font-bold text-red-600 dark:text-red-400">
                      {metrics.hospitalizations || 0}
                    </div>
                    <div className="text-xs text-red-700 dark:text-red-300">Hospitalizations</div>
                  </div>
                </div>

                {/* Second row - disease indicators */}
                <div className="grid grid-cols-3 gap-3 mt-3">
                  <div className={`p-2 rounded-lg text-center ${
                      metrics.hasCavitaryDisease ? 'bg-red-100 dark:bg-red-900/30' : 'bg-gray-100 dark:bg-gray-700/30'
                  }`}>
                    <div className={`text-sm font-medium ${
                        metrics.hasCavitaryDisease ? 'text-red-700 dark:text-red-300' : 'text-gray-500 dark:text-gray-400'
                    }`}>
                      {metrics.hasCavitaryDisease ? '⚠️ Cavitary' : '○ No Cavities'}
                    </div>
                  </div>
                  <div className={`p-2 rounded-lg text-center ${
                      metrics.hasDrugResistance ? 'bg-red-100 dark:bg-red-900/30' : 'bg-gray-100 dark:bg-gray-700/30'
                  }`}>
                    <div className={`text-sm font-medium ${
                        metrics.hasDrugResistance ? 'text-red-700 dark:text-red-300' : 'text-gray-500 dark:text-gray-400'
                    }`}>
                      {metrics.hasDrugResistance ? '⚠️ Drug Resistant' : '○ No Resistance'}
                    </div>
                  </div>
                  <div className={`p-2 rounded-lg text-center ${
                      metrics.hemoptysisLogs > 0 ? 'bg-red-100 dark:bg-red-900/30' : 'bg-gray-100 dark:bg-gray-700/30'
                  }`}>
                    <div className={`text-sm font-medium ${
                        metrics.hemoptysisLogs > 0 ? 'text-red-700 dark:text-red-300' : 'text-gray-500 dark:text-gray-400'
                    }`}>
                      {metrics.hemoptysisLogs > 0 ? `⚠️ Hemoptysis (${metrics.hemoptysisLogs})` : '○ No Hemoptysis'}
                    </div>
                  </div>
                </div>
              </div>

              {/* Section 2: Analysis Rationale */}
              {rationale && rationale.length > 0 && (
                  <div>
                    <h4 className="font-medium text-gray-900 dark:text-white mb-2 text-center">
                      Analysis Rationale
                    </h4>
                    <div className={`${statusInfo.bgClass} rounded-lg p-3 space-y-2`}>
                      {rationale.map((item, idx) => (
                          <div key={idx} className="flex items-start gap-2">
                            <span className={`text-${statusInfo.color}-600 dark:text-${statusInfo.color}-400 mt-0.5`}>◆</span>
                            <span className="text-sm text-gray-700 dark:text-gray-300">{item}</span>
                          </div>
                      ))}
                    </div>
                  </div>
              )}

              {/* Section 3: VA Rating Schedule */}
              <div>
                <h4 className="font-medium text-gray-900 dark:text-white mb-2 text-center">
                  VA Rating Schedule - DC {diagnosticCode}
                </h4>
                <div className="space-y-2">
                  {criteria.ratings.map((rating, idx) => {
                    const percent = typeof rating.percent === 'number' ? rating.percent : null;
                    const isSupported = percent !== null && isRatingSupported(percent);
                    return (
                        <div
                            key={idx}
                            className={`p-3 rounded-lg border ${isSupported ? 'border-2' : ''} ${getRatingRowStyle(percent, isSupported)}`}
                        >
                          <div className="flex items-center gap-3">
                            <div className={`w-16 text-center font-bold ${
                                isSupported ? 'text-gray-900 dark:text-white' : 'text-gray-500 dark:text-gray-400'
                            }`}>
                              {rating.percent}{typeof rating.percent === 'number' ? '%' : ''}
                            </div>
                            <div className={`flex-1 text-sm ${
                                isSupported ? 'text-gray-900 dark:text-white' : 'text-gray-500 dark:text-gray-400'
                            }`}>
                              {rating.summary}
                            </div>
                            {isSupported && (
                                <span className="text-green-600 dark:text-green-400">✓</span>
                            )}
                          </div>
                        </div>
                    );
                  })}
                </div>
              </div>

              {/* Section 4: Inactive TB - Residuals Info */}
              {diseaseStatus === 'inactive' && (
                  <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg border border-blue-200 dark:border-blue-800">
                    <h4 className="font-semibold text-blue-900 dark:text-blue-200 mb-2 flex items-center gap-2">
                      <Info className="w-4 h-4" />
                      Rating Inactive TB by Residuals
                    </h4>
                    <p className="text-sm text-blue-800 dark:text-blue-300 mb-2">
                      Inactive TB is rated based on lung function impairment. Rate residuals as:
                    </p>
                    <ul className="text-sm text-blue-800 dark:text-blue-300 space-y-1 ml-4">
                      <li>• <strong>Interstitial lung disease</strong> (DC 6825-6833) for fibrosis/scarring</li>
                      <li>• <strong>Restrictive lung disease</strong> (DC 6840-6845) for restricted expansion</li>
                      <li>• <strong>Chronic bronchitis</strong> (DC 6600) if obstructive disease predominant</li>
                      <li>• <strong>Rib removal</strong> (DC 5297) for thoracoplasty history</li>
                    </ul>
                    <p className="text-sm text-blue-700 dark:text-blue-400 mt-2 italic">
                      Pulmonary function tests (PFTs) are required to determine exact rating percentage.
                    </p>
                  </div>
              )}

              {/* Section 5: Miliary TB - Organ Involvement */}
              {diseaseStatus === 'miliary-active' && criteria.possibleOrganInvolvement && (
                  <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-lg border border-purple-200 dark:border-purple-800">
                    <h4 className="font-semibold text-purple-900 dark:text-purple-200 mb-2 flex items-center gap-2">
                      <AlertCircle className="w-4 h-4" />
                      Possible Organ Involvement (Rate Separately When Inactive)
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-purple-800 dark:text-purple-300">
                      {criteria.possibleOrganInvolvement.slice(0, 6).map((organ, idx) => (
                          <div key={idx}>
                            <span className="font-medium">{organ.organ}:</span> {organ.suggestedDC}
                          </div>
                      ))}
                    </div>
                  </div>
              )}

              {/* Section 6: Documentation Gaps */}
              {evidenceGaps && evidenceGaps.length > 0 && (
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

              {/* Section 7: Presumptive Info */}
              {criteria.presumptiveInfo && (
                  <div className="bg-green-50 dark:bg-green-900/20 p-3 rounded-lg border border-green-200 dark:border-green-800">
                    <div className="flex items-start gap-2">
                      <span className="text-green-600 dark:text-green-400">✓</span>
                      <div className="text-sm text-green-800 dark:text-green-300">
                        <strong>Presumptive Condition:</strong> {criteria.presumptiveInfo.description}
                      </div>
                    </div>
                  </div>
              )}

              {/* Section 8: Important Notes */}
              {criteria.importantNotes && criteria.importantNotes.length > 0 && (
                  <div className="bg-gray-50 dark:bg-gray-700/30 p-4 rounded-lg">
                    <h4 className="font-medium text-gray-900 dark:text-white mb-2">Important Notes</h4>
                    <ul className="space-y-1">
                      {criteria.importantNotes.slice(0, 5).map((note, idx) => (
                          <li key={idx} className="flex items-start gap-2 text-sm text-gray-700 dark:text-gray-300">
                            <span className="text-gray-400 mt-1">•</span>
                            {note}
                          </li>
                      ))}
                    </ul>
                  </div>
              )}

              {/* Section 9: Disclaimer */}
              <div className="bg-gray-100 dark:bg-gray-700/50 rounded-lg p-3 text-xs text-gray-600 dark:text-gray-400">
                <strong>Important:</strong> {criteria.disclaimer}
              </div>
            </div>
        )}
      </div>
  );
};

export default TuberculosisRatingCard;