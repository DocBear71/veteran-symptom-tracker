import { ChevronDown, ChevronUp } from 'lucide-react';
import {
  VERTEBRAL_FRACTURE_CRITERIA,
  SACROILIAC_INJURY_CRITERIA,
  SPINAL_STENOSIS_CRITERIA,
  ANKYLOSING_SPONDYLITIS_CRITERIA,
  SPINAL_FUSION_CRITERIA, getRatingRowColor, getRatingTextColor,
} from '../utils/ratingCriteria';
import UnderstandingYourRating from './UnderstandingYourRating';
import ServiceConnectedBanner from './ServiceConnectedBanner';
import RatingEnhancementsDisplay from './RatingEnhancementsDisplay';

/**
 * Spine Conditions Rating Card Component - Gold Standard Version
 * Handles 5 spine conditions using General Rating Formula for Spine
 * DC 5235: Vertebral Fracture/Dislocation
 * DC 5236: Sacroiliac Injury and Weakness
 * DC 5238: Spinal Stenosis
 * DC 5240: Ankylosing Spondylitis
 * DC 5241: Spinal Fusion
 * 38 CFR 4.71a
 */
export default function SpineConditionsRatingCard({ analysis, diagnosticCode, expanded, onToggle }) {
  if (!analysis || !analysis.hasData) return null;

  const { supportedRating, ratingRationale, gaps, metrics } = analysis;

  // Get condition-specific configuration based on diagnostic code
  const getConditionConfig = () => {
    switch (diagnosticCode) {
      case '5235':
        return {
          criteria: VERTEBRAL_FRACTURE_CRITERIA,
          emoji: '💥',
          name: 'Vertebral Fracture or Dislocation',
          specificLabel: 'Height Loss',
          specificValue: metrics?.heightLossLogged || 0,
          impactLabel: 'Neurologic',
          impactValue: metrics?.radiculopathyCount || 0,
        };
      case '5236':
        return {
          criteria: SACROILIAC_INJURY_CRITERIA,
          emoji: '🦴',
          name: 'Sacroiliac Injury and Weakness',
          specificLabel: 'Referred Pain',
          specificValue: metrics?.referredPainCount || 0,
          impactLabel: 'Functional',
          impactValue: metrics?.functionalDifficultyCount || 0,
        };
      case '5238':
        return {
          criteria: SPINAL_STENOSIS_CRITERIA,
          emoji: '🔬',
          name: 'Spinal Stenosis',
          specificLabel: 'Claudication',
          specificValue: metrics?.claudicationCount || 0,
          impactLabel: 'Walk Limited',
          impactValue: metrics?.walkingDifficultyCount || 0,
        };
      case '5240':
        return {
          criteria: ANKYLOSING_SPONDYLITIS_CRITERIA,
          emoji: '🔥',
          name: 'Ankylosing Spondylitis',
          specificLabel: 'AM Stiffness',
          specificValue: metrics?.morningStiffnessCount || 0,
          impactLabel: 'Flares',
          impactValue: metrics?.flareCount || 0,
        };
      case '5241':
        return {
          criteria: SPINAL_FUSION_CRITERIA,
          emoji: '🔧',
          name: 'Spinal Fusion',
          specificLabel: 'Stiffness',
          specificValue: metrics?.stiffnessCount || 0,
          impactLabel: 'Adjacent Pain',
          impactValue: metrics?.adjacentSegmentPainCount || 0,
        };
      default:
        return null;
    }
  };

  const config = getConditionConfig();
  if (!config) return null;

  const { criteria, emoji, name, specificLabel, specificValue, impactLabel, impactValue } = config;

  // Normalize rating for comparison (handles string vs number)
  const normalizeRating = (rating) => {
    if (rating === null || rating === undefined) return null;
    if (typeof rating === 'number') return rating;
    if (typeof rating === 'string') return parseInt(rating, 10);
    return null;
  };

  const numericRating = normalizeRating(supportedRating);
  const isRatingSupported = (p) => numericRating === p;

  return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden border-l-4 border-amber-500">
        {/* === COLLAPSED HEADER === */}
        <button
            onClick={onToggle}
            className="w-full px-6 py-4 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
        >
          <div className="flex items-center gap-3">
            <span className="text-2xl">{emoji}</span>
            <div className="text-left">
              <h3 className="font-semibold text-lg text-gray-900 dark:text-white">
                {name}
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                DC {diagnosticCode} - 38 CFR 4.71a
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

        {/* === EXPANDED CONTENT === */}
        {expanded && (
            <div className="px-6 pb-6 space-y-6">
              <div className="border-t border-gray-200dark:border-gray-700" />

              {/* Service-Connected Status Banner */}
              <ServiceConnectedBanner
                  conditionKey="spineConditions"
                  currentAnalysis={analysis}
              />

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

                  {/* Box 2: Avg Severity */}
                  <div className={`p-3 rounded-lg text-center ${
                      metrics?.avgSeverity >= 7
                          ? 'bg-red-50 dark:bg-red-900/20'
                          : metrics?.avgSeverity >= 4
                              ? 'bg-orange-50 dark:bg-orange-900/20'
                              : 'bg-purple-50 dark:bg-purple-900/20'
                  }`}>
                    <div className={`text-2xl font-bold ${
                        metrics?.avgSeverity >= 7
                            ? 'text-red-600 dark:text-red-400'
                            : metrics?.avgSeverity >= 4
                                ? 'text-orange-600 dark:text-orange-400'
                                : 'text-purple-600 dark:text-purple-400'
                    }`}>
                      {(metrics?.avgSeverity || 0).toFixed(1)}
                    </div>
                    <div className="text-xs text-gray-600 dark:text-gray-400">
                      Avg Severity
                    </div>
                  </div>

                  {/* Box 3: Condition-Specific Metric */}
                  <div className={`p-3 rounded-lg text-center ${
                      specificValue > 0
                          ? 'bg-green-50 dark:bg-green-900/20'
                          : 'bg-gray-50 dark:bg-gray-700/30'
                  }`}>
                    <div className={`text-2xl font-bold ${
                        specificValue > 0
                            ? 'text-green-600 dark:text-green-400'
                            : 'text-gray-400'
                    }`}>
                      {specificValue}
                    </div>
                    <div className="text-xs text-gray-600 dark:text-gray-400">
                      {specificLabel}
                    </div>
                  </div>

                  {/* Box 4: Functional Impact */}
                  <div className={`p-3 rounded-lg text-center ${
                      impactValue > 0
                          ? 'bg-orange-50 dark:bg-orange-900/20'
                          : 'bg-gray-50 dark:bg-gray-700/30'
                  }`}>
                    <div className={`text-2xl font-bold ${
                        impactValue > 0
                            ? 'text-orange-600 dark:text-orange-400'
                            : 'text-gray-400'
                    }`}>
                      {impactValue}
                    </div>
                    <div className="text-xs text-gray-600 dark:text-gray-400">
                      {impactLabel}
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
              <RatingEnhancementsDisplay
                  diagnosticCode={diagnosticCode}  // Use the appropriate DC code
                  showDefinitions={true}
                  showCaseLaw={true}
                  showTips={true}
                  showExamTips={true}
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
                    <span>Spine conditions rated under General Rating Formula (38 CFR 4.71a)</span>
                  </li>
                  <li className="text-sm text-blue-800 dark:text-blue-300 flex items-start gap-2">
                    <span className="text-blue-500 mt-0.5">•</span>
                    <span>Document forward flexion and combined ROM measurements</span>
                  </li>
                  <li className="text-sm text-blue-800 dark:text-blue-300 flex items-start gap-2">
                    <span className="text-blue-500 mt-0.5">•</span>
                    <span>Neurologic abnormalities (radiculopathy) rated separately</span>
                  </li>
                  {diagnosticCode === '5235' && (
                      <li className="text-sm text-blue-800 dark:text-blue-300 flex items-start gap-2">
                        <span className="text-blue-500 mt-0.5">•</span>
                        <span>Vertebral body height loss ≥50% = minimum 10% rating</span>
                      </li>
                  )}
                  {diagnosticCode === '5240' && (
                      <li className="text-sm text-blue-800 dark:text-blue-300 flex items-start gap-2">
                        <span className="text-blue-500 mt-0.5">•</span>
                        <span>Morning stiffness &gt;30 minutes indicates inflammatory back pain</span>
                      </li>
                  )}
                  {diagnosticCode === '5238' && (
                      <li className="text-sm text-blue-800 dark:text-blue-300 flex items-start gap-2">
                        <span className="text-blue-500 mt-0.5">•</span>
                        <span>Document neurogenic claudication (leg pain relieved by sitting)</span>
                      </li>
                  )}
                  {diagnosticCode === '5241' && (
                      <li className="text-sm text-blue-800 dark:text-blue-300 flex items-start gap-2">
                        <span className="text-blue-500 mt-0.5">•</span>
                        <span>Track adjacent segment disease and hardware complications</span>
                      </li>
                  )}
                </ul>
              </div>

              {/* Section 6: Disclaimer */}
              <div className="bg-gray-100 dark:bg-gray-700/50 rounded-lg p-3 text-xs text-gray-600 dark:text-gray-400">
                <strong>Important:</strong> Based on 38 CFR 4.71a, General Rating Formula for Diseases and
                Injuries of the Spine. VA determines final ratings based on complete medical evidence
                including clinical ROM measurements. This analysis is for documentation guidance only.
              </div>
            </div>
        )}
      </div>
  );
}