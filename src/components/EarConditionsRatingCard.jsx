// EarConditionsRatingCard.jsx
// Phase 7B: Ear Conditions Rating Card
// Reusable component for DC 6204 (Peripheral Vestibular), DC 6200 (Suppurative Otitis Media),
// DC 6210 (Otitis Externa), DC 6201 (Nonsuppurative Otitis Media)
// Follows Gold Standard Rating Card Template

import React from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import {
  PERIPHERAL_VESTIBULAR_CRITERIA,
  CHRONIC_SUPPURATIVE_OTITIS_MEDIA_CRITERIA,
  CHRONIC_OTITIS_EXTERNA_CRITERIA,
  CHRONIC_NONSUPPURATIVE_OTITIS_MEDIA_CRITERIA, getRatingRowColor, getRatingTextColor,
} from '../utils/ratingCriteria';
import UnderstandingYourRating from './UnderstandingYourRating';

/**
 * EarConditionsRatingCard - Displays VA rating analysis for ear conditions
 * Color scheme: Cyan (border-cyan-500) for sensory/ear conditions
 */
const EarConditionsRatingCard = ({ analysis, expanded, onToggle }) => {
  // Don't render if no data
  if (!analysis?.hasData) return null;

  const {
    condition,
    diagnosticCode,
    cfrReference,
    supportedRating,
    supportedRatingDisplay,
    ratingRationale,
    gaps,
    metrics,
  } = analysis;

  // Get condition-specific criteria based on diagnostic code
  const getCriteria = () => {
    switch (diagnosticCode) {
      case '6204':
        return PERIPHERAL_VESTIBULAR_CRITERIA;
      case '6200':
        return CHRONIC_SUPPURATIVE_OTITIS_MEDIA_CRITERIA;
      case '6210':
        return CHRONIC_OTITIS_EXTERNA_CRITERIA;
      case '6201':
        return CHRONIC_NONSUPPURATIVE_OTITIS_MEDIA_CRITERIA;
      default:
        return PERIPHERAL_VESTIBULAR_CRITERIA;
    }
  };

  const criteria = getCriteria();

  // Get condition-specific icon
  const getConditionIcon = () => {
    switch (diagnosticCode) {
      case '6204':
        return '🌀'; // Vertigo/vestibular
      case '6200':
        return '💧'; // Suppuration/drainage
      case '6210':
        return '👂'; // External ear
      case '6201':
        return '🔇'; // Hearing affected
      default:
        return '👂';
    }
  };

  // Get condition-specific metric label for box 3
  const getSpecificMetricLabel = () => {
    switch (diagnosticCode) {
      case '6204':
        return 'Vertigo Episodes';
      case '6200':
        return 'Active Suppuration';
      case '6210':
        return 'Criteria Met';
      case '6201':
        return 'Hearing Affected';
      default:
        return 'Key Metric';
    }
  };

  // Get condition-specific metric value for box 3
  const getSpecificMetricValue = () => {
    switch (diagnosticCode) {
      case '6204':
        return metrics?.vertigoEpisodes || 0;
      case '6200':
        return metrics?.hasSuppuration || metrics?.hasAuralPolyp ? 'Yes' : 'No';
      case '6210':
        return metrics?.allCriteriaMet ? '4/4' : `${countCriteriaMet()}/4`;
      case '6201':
        return metrics?.hasHearingLoss ? 'Yes' : 'No';
      default:
        return 0;
    }
  };

  // Helper for DC 6210 criteria count
  const countCriteriaMet = () => {
    if (!metrics) return 0;
    let count = 0;
    if (metrics.hasSwelling) count++;
    if (metrics.hasSkinChanges) count++;
    if (metrics.hasItching) count++;
    if (metrics.hasTreatmentRequirement) count++;
    return count;
  };

  // Get status label for box 4
  const getStatusLabel = () => {
    switch (diagnosticCode) {
      case '6204':
        return metrics?.hasStaggering ? 'With Staggering' : 'Dizziness Only';
      case '6200':
        return metrics?.isBilateral ? 'Bilateral' : 'Unilateral';
      case '6210':
        return metrics?.isBilateral ? 'Bilateral' : 'Unilateral';
      case '6201':
        return metrics?.isChronic ? 'Chronic' : 'Intermittent';
      default:
        return 'Status';
    }
  };

  // Check if a rating level is supported
  const isRatingSupported = (ratingPercent) => {
    if (supportedRating === null || supportedRating === undefined) return false;
    // Handle "Variable" rating for DC 6201
    if (typeof supportedRating === 'string') return false;
    return ratingPercent <= supportedRating && ratingPercent > 0 ||
        (ratingPercent === 0 && supportedRating === 0);
  };

  // Display rating (handles variable rating for DC 6201)
  const displayRating = supportedRatingDisplay ||
      (typeof supportedRating === 'number' ? `${supportedRating}%` : 'Variable');

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
              <h3 className="font-semibold text-lg text-gray-900 dark:text-white">
                {condition}
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                DC {diagnosticCode} - {cfrReference}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right">
              <div className={`text-2xl font-bold ${getRatingTextColor(supportedRating)}`}>
                {displayRating}
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
              <div className="border-t border-gray-200 dark:border-gray-700" />

              {/* Section 1: Evidence Summary (4-box grid) */}
              <div>
                <h4 className="font-medium text-gray-900 dark:text-white mb-3 text-center">
                  Evidence Summary
                </h4>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {/* Box 1: Total Logs */}
                  <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg text-center">
                    <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                      {metrics?.totalLogs || 0}
                    </div>
                    <div className="text-xs text-blue-700 dark:text-blue-300">
                      Total Logs
                    </div>
                  </div>

                  {/* Box 2: Condition-Specific Metric */}
                  <div className="bg-cyan-50 dark:bg-cyan-900/20 p-3 rounded-lg text-center">
                    <div className="text-2xl font-bold text-cyan-600 dark:text-cyan-400">
                      {getSpecificMetricValue()}
                    </div>
                    <div className="text-xs text-cyan-700 dark:text-cyan-300">
                      {getSpecificMetricLabel()}
                    </div>
                  </div>

                  {/* Box 3: Avg Severity */}
                  <div className="bg-purple-50 dark:bg-purple-900/20 p-3 rounded-lg text-center">
                    <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                      {(metrics?.avgSeverity || 0).toFixed(1)}
                    </div>
                    <div className="text-xs text-purple-700 dark:text-purple-300">
                      Avg Severity
                    </div>
                  </div>

                  {/* Box 4: Status */}
                  <div className="bg-orange-50 dark:bg-orange-900/20 p-3 rounded-lg text-center">
                    <div className="text-lg font-bold text-orange-600 dark:text-orange-400">
                      {getStatusLabel()}
                    </div>
                    <div className="text-xs text-orange-700 dark:text-orange-300">
                      Status
                    </div>
                  </div>
                </div>
              </div>

              {/* Section 2: Analysis Rationale */}
              {ratingRationale && ratingRationale.length > 0 && (
                  <div>
                    <h4 className="font-medium text-gray-900 dark:text-white mb-2 text-center">
                      Analysis Rationale
                    </h4>
                    <div className="bg-gray-50 dark:bg-gray-700/30 rounded-lg p-3 space-y-2">
                      {ratingRationale.map((item, idx) => (
                          <div key={idx} className="flex items-start gap-2">
                            <span className="text-cyan-600 dark:text-cyan-400 mt-0.5">◆</span>
                            <span className="text-sm text-gray-700 dark:text-gray-300">{item}</span>
                          </div>
                      ))}
                    </div>
                  </div>
              )}

              {/* Understanding Your Rating - Educational Content */}
              <UnderstandingYourRating
                  diagnosticCode={diagnosticCode}
                  currentRating={typeof supportedRating === 'number' ? supportedRating : null}
              />

              {/* Section 3: VA Rating Schedule */}
              <div>
                <h4 className="font-medium text-gray-900 dark:text-white mb-2 text-center">
                  VA Rating Schedule - DC {diagnosticCode}
                </h4>
                <div className="space-y-2">
                  {criteria.ratings.map((rating, idx) => {
                    const ratingPercent = typeof rating.percent === 'number' ? rating.percent : 0;
                    const isSupported = isRatingSupported(ratingPercent);
                    return (
                        <div
                            key={idx}
                            className={`p-3 rounded-lg border ${isSupported ? 'border-2' : ''} ${getRatingRowColor(ratingPercent, isSupported)}`}
                        >
                          <div className="flex items-center gap-3">
                            <div className={`w-14 text-center font-bold ${
                                isSupported ? 'text-gray-900 dark:text-white' : 'text-gray-500 dark:text-gray-400'
                            }`}>
                              {typeof rating.percent === 'number' ? `${rating.percent}%` : rating.percent}
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

              {/* Section 4: Documentation Gaps */}
              {gaps && gaps.length > 0 && (
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
                  <span>ℹ️</span>
                  Important Information
                </h4>
                <ul className="text-sm text-blue-800 dark:text-blue-300 space-y-1">
                  {diagnosticCode === '6204' && (
                      <>
                        <li>• Objective findings (nystagmus, abnormal testing) are REQUIRED for compensable rating</li>
                        <li>• 30% requires both dizziness AND occasional staggering</li>
                        <li>• 10% for occasional dizziness only</li>
                        <li>• Hearing impairment and suppuration rated separately and combined</li>
                      </>
                  )}
                  {diagnosticCode === '6200' && (
                      <>
                        <li>• Maximum rating under DC 6200 is 10%</li>
                        <li>• Requires active suppuration (pus drainage) OR aural polyps</li>
                        <li>• Hearing impairment evaluated separately under DC 6100</li>
                        <li>• Complications (tinnitus, labyrinthitis, facial paralysis) rated separately</li>
                      </>
                  )}
                  {diagnosticCode === '6210' && (
                      <>
                        <li>• ALL four criteria must be met for 10% rating</li>
                        <li>• Swelling + (Dry/scaly OR serous discharge) + Itching + Frequent/prolonged treatment</li>
                        <li>• Maximum rating under DC 6210 is 10%</li>
                        <li>• Document treatment frequency and duration</li>
                      </>
                  )}
                  {diagnosticCode === '6201' && (
                      <>
                        <li>• DC 6201 does not have its own rating percentage</li>
                        <li>• Rate based on resulting hearing impairment under DC 6100</li>
                        <li>• Audiometric testing required for hearing loss evaluation</li>
                        <li>• Document fluid/effusion presence and duration</li>
                      </>
                  )}
                </ul>
              </div>

              {/* Section 6: Disclaimer */}
              <div className="bg-gray-100 dark:bg-gray-700/50 rounded-lg p-3 text-xs text-gray-600 dark:text-gray-400">
                <strong>Important:</strong> {criteria.disclaimer}
              </div>
            </div>
        )}
      </div>
  );
};

export default EarConditionsRatingCard;