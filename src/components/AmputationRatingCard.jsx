// ============================================
// AmputationRatingCard.jsx
// Rating card for Amputation / Extremity Loss conditions
// DC 5120-5173 - Per 38 CFR 4.71a
// Includes SMC-K eligibility detection
// ============================================

import React from 'react';
import { ChevronDown, ChevronUp, AlertTriangle, Info, CheckCircle } from 'lucide-react';
import SMCAlertBanner from './SMCAlertBanner';

/**
 * Amputation / Extremity Loss Rating Card
 *
 * Displays rating analysis for amputation and loss of use conditions.
 * Integrates with SMC-K detection for qualifying anatomical losses.
 *
 * Per 38 CFR § 3.350(a), SMC-K is awarded for:
 * - Loss of use of one hand
 * - Loss of use of one foot
 * - Loss of use of both buttocks
 * - Loss of one or more creative organs
 *
 * @param {Object} analysis - Result from analyzeAmputationLogs()
 * @param {boolean} expanded - Whether card is expanded
 * @param {function} onToggle - Toggle expand/collapse
 */
const AmputationRatingCard = ({ analysis, expanded, onToggle }) => {
  // Don't render if no data
  if (!analysis?.hasData) {
    return null;
  }

  const {
    condition,
    diagnosticCode,
    supportedRating,
    rationale = [],
    evidenceGaps = [],
    metrics = {},
    criteriaReference,
    smcEligible,
    smcData,
  } = analysis;

  // Get rating color based on percentage
  const getRatingColor = (percent) => {
    if (percent >= 70) return 'text-red-600 dark:text-red-400';
    if (percent >= 50) return 'text-orange-600 dark:text-orange-400';
    if (percent >= 30) return 'text-yellow-600 dark:text-yellow-400';
    return 'text-green-600 dark:text-green-400';
  };

  // Get row color for rating schedule
  const getRatingRowColor = (percent, isSupported) => {
    if (!isSupported) return 'bg-gray-50 dark:bg-gray-700/30 border-gray-200 dark:border-gray-600';
    if (percent >= 70) return 'bg-red-50 dark:bg-red-900/20 border-red-300 dark:border-red-700';
    if (percent >= 50) return 'bg-orange-50 dark:bg-orange-900/20 border-orange-300 dark:border-orange-700';
    if (percent >= 30) return 'bg-yellow-50 dark:bg-yellow-900/20 border-yellow-300 dark:border-yellow-700';
    return 'bg-green-50 dark:bg-green-900/20 border-green-300 dark:border-green-700';
  };

  // Check if rating is supported
  const isRatingSupported = (ratingPercent) => {
    return supportedRating >= ratingPercent;
  };

  // Simplified rating schedule for amputations
  const ratingSchedule = [
    { percent: 90, summary: 'Loss of arm at shoulder / Loss of thigh at hip', dc: '5120/5160' },
    { percent: 80, summary: 'Loss of arm above elbow / Loss of thigh above knee (major)', dc: '5121/5161' },
    { percent: 70, summary: 'Loss of arm below elbow / Loss of hand (major)', dc: '5124/5125' },
    { percent: 60, summary: 'Loss of arm below elbow / Loss of hand (minor) / Loss of leg below knee', dc: '5124/5125/5165' },
    { percent: 40, summary: 'Loss of foot / Loss of use of foot', dc: '5167' },
    { percent: 30, summary: 'Partial foot loss (Chopart/Lisfranc)', dc: '5166' },
    { percent: 20, summary: 'Loss of great toe with metatarsal', dc: '5171' },
    { percent: 10, summary: 'Loss of 2-4 toes / Loss of great toe without metatarsal', dc: '5172/5171' },
  ];

  return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden border-l-4 border-amber-500">
        {/* === COLLAPSED HEADER === */}
        <button
            onClick={onToggle}
            className="w-full px-6 py-4 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
        >
          <div className="flex items-center gap-3">
            <span className="text-2xl">🦿</span>
            <div className="text-left">
              <h3 className="font-semibold text-lg text-gray-900 dark:text-white">
                {condition || 'Amputation / Extremity Loss'}
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {diagnosticCode || 'DC 5120-5173'} - 38 CFR 4.71a
              </p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            {/* SMC-K Badge in Header */}
            {smcEligible && (
                <span className="px-2 py-1 bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300 text-xs font-bold rounded">
              SMC-K ×{smcData?.awards || 1}
            </span>
            )}
            <div className="text-right">
              <div className={`text-2xl font-bold ${getRatingColor(supportedRating)}`}>
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
              <div className="border-t border-gray-200 dark:border-gray-700" />

              {/* SMC-K Alert Banner */}
              {smcEligible && smcData && (
                  <SMCAlertBanner
                      smcLevel="K"
                      category="EXTREMITY_LOSS"
                      conditionName={`Loss of ${smcData.qualifying?.join(', ') || 'Extremity'}`}
                      diagnosticCode={diagnosticCode}
                      autoGrant={true}
                      note={smcData.note || `Qualifies for ${smcData.awards} SMC-K award(s) under 38 CFR § 3.350(a). Each qualifying loss adds $139.87/month.`}
                  />
              )}

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

                  {/* SMC-K Awards */}
                  <div className={`p-3 rounded-lg text-center ${
                      smcEligible
                          ? 'bg-amber-50 dark:bg-amber-900/20'
                          : 'bg-gray-50 dark:bg-gray-700/30'
                  }`}>
                    <div className={`text-2xl font-bold ${
                        smcEligible
                            ? 'text-amber-600 dark:text-amber-400'
                            : 'text-gray-400'
                    }`}>
                      {metrics?.smcKAwards || 0}
                    </div>
                    <div className={`text-xs ${
                        smcEligible
                            ? 'text-amber-700 dark:text-amber-300'
                            : 'text-gray-500 dark:text-gray-400'
                    }`}>SMC-K Awards</div>
                  </div>

                  {/* Qualifying Losses */}
                  <div className="bg-green-50 dark:bg-green-900/20 p-3 rounded-lg text-center">
                    <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                      {metrics?.smcKQualifying?.length || 0}
                    </div>
                    <div className="text-xs text-green-700 dark:text-green-300">Qualifying Losses</div>
                  </div>

                  {/* Bilateral Status */}
                  <div className="bg-purple-50 dark:bg-purple-900/20 p-3 rounded-lg text-center">
                    <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                      {(metrics?.hasBilateralHands || metrics?.hasBilateralFeet) ? 'Yes' : 'No'}
                    </div>
                    <div className="text-xs text-purple-700 dark:text-purple-300">Bilateral Loss</div>
                  </div>
                </div>
              </div>

              {/* Section 2: Documented Losses */}
              {metrics?.smcKQualifying && metrics.smcKQualifying.length > 0 && (
                  <div>
                    <h4 className="font-medium text-gray-900 dark:text-white mb-2 text-center">
                      Documented Anatomical Losses
                    </h4>
                    <div className="bg-amber-50 dark:bg-amber-900/20 rounded-lg p-4 border border-amber-200 dark:border-amber-800">
                      <div className="grid grid-cols-2 gap-2">
                        {metrics.smcKQualifying.map((loss, idx) => (
                            <div key={idx} className="flex items-center gap-2">
                              <CheckCircle className="w-4 h-4 text-green-500" />
                              <span className="text-sm text-amber-800 dark:text-amber-200 font-medium">
                        {loss}
                      </span>
                            </div>
                        ))}
                      </div>
                      {(metrics.hasBilateralHands || metrics.hasBilateralFeet) && (
                          <div className="mt-3 pt-3 border-t border-amber-300 dark:border-amber-700">
                            <div className="flex items-center gap-2 text-amber-900 dark:text-amber-100">
                              <Info className="w-4 h-4" />
                              <span className="text-sm font-medium">
                        Bilateral loss may qualify for SMC-L or higher
                      </span>
                            </div>
                          </div>
                      )}
                    </div>
                  </div>
              )}

              {/* Section 3: All Documented Losses Detail */}
              {metrics?.losses && (
                  <div>
                    <h4 className="font-medium text-gray-900 dark:text-white mb-2 text-center">
                      Extremity Status
                    </h4>
                    <div className="bg-gray-50 dark:bg-gray-700/30 rounded-lg p-4">
                      <div className="grid grid-cols-2 gap-4">
                        {/* Upper Extremities */}
                        <div>
                          <h5 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Upper Extremity</h5>
                          <div className="space-y-1">
                            <div className="flex items-center gap-2 text-sm">
                              {metrics.losses.rightHand ? (
                                  <CheckCircle className="w-4 h-4 text-red-500" />
                              ) : (
                                  <div className="w-4 h-4 rounded-full border-2 border-gray-300 dark:border-gray-600" />
                              )}
                              <span className={metrics.losses.rightHand ? 'text-gray-900 dark:text-white' : 'text-gray-500 dark:text-gray-400'}>
                          Right Hand
                        </span>
                            </div>
                            <div className="flex items-center gap-2 text-sm">
                              {metrics.losses.leftHand ? (
                                  <CheckCircle className="w-4 h-4 text-red-500" />
                              ) : (
                                  <div className="w-4 h-4 rounded-full border-2 border-gray-300 dark:border-gray-600" />
                              )}
                              <span className={metrics.losses.leftHand ? 'text-gray-900 dark:text-white' : 'text-gray-500 dark:text-gray-400'}>
                          Left Hand
                        </span>
                            </div>
                            <div className="flex items-center gap-2 text-sm">
                              {metrics.losses.rightArm ? (
                                  <CheckCircle className="w-4 h-4 text-red-500" />
                              ) : (
                                  <div className="w-4 h-4 rounded-full border-2 border-gray-300 dark:border-gray-600" />
                              )}
                              <span className={metrics.losses.rightArm ? 'text-gray-900 dark:text-white' : 'text-gray-500 dark:text-gray-400'}>
                          Right Arm
                        </span>
                            </div>
                            <div className="flex items-center gap-2 text-sm">
                              {metrics.losses.leftArm ? (
                                  <CheckCircle className="w-4 h-4 text-red-500" />
                              ) : (
                                  <div className="w-4 h-4 rounded-full border-2 border-gray-300 dark:border-gray-600" />
                              )}
                              <span className={metrics.losses.leftArm ? 'text-gray-900 dark:text-white' : 'text-gray-500 dark:text-gray-400'}>
                          Left Arm
                        </span>
                            </div>
                          </div>
                        </div>

                        {/* Lower Extremities */}
                        <div>
                          <h5 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Lower Extremity</h5>
                          <div className="space-y-1">
                            <div className="flex items-center gap-2 text-sm">
                              {metrics.losses.rightFoot ? (
                                  <CheckCircle className="w-4 h-4 text-red-500" />
                              ) : (
                                  <div className="w-4 h-4 rounded-full border-2 border-gray-300 dark:border-gray-600" />
                              )}
                              <span className={metrics.losses.rightFoot ? 'text-gray-900 dark:text-white' : 'text-gray-500 dark:text-gray-400'}>
                          Right Foot
                        </span>
                            </div>
                            <div className="flex items-center gap-2 text-sm">
                              {metrics.losses.leftFoot ? (
                                  <CheckCircle className="w-4 h-4 text-red-500" />
                              ) : (
                                  <div className="w-4 h-4 rounded-full border-2 border-gray-300 dark:border-gray-600" />
                              )}
                              <span className={metrics.losses.leftFoot ? 'text-gray-900 dark:text-white' : 'text-gray-500 dark:text-gray-400'}>
                          Left Foot
                        </span>
                            </div>
                            <div className="flex items-center gap-2 text-sm">
                              {metrics.losses.rightLeg ? (
                                  <CheckCircle className="w-4 h-4 text-red-500" />
                              ) : (
                                  <div className="w-4 h-4 rounded-full border-2 border-gray-300 dark:border-gray-600" />
                              )}
                              <span className={metrics.losses.rightLeg ? 'text-gray-900 dark:text-white' : 'text-gray-500 dark:text-gray-400'}>
                          Right Leg
                        </span>
                            </div>
                            <div className="flex items-center gap-2 text-sm">
                              {metrics.losses.leftLeg ? (
                                  <CheckCircle className="w-4 h-4 text-red-500" />
                              ) : (
                                  <div className="w-4 h-4 rounded-full border-2 border-gray-300 dark:border-gray-600" />
                              )}
                              <span className={metrics.losses.leftLeg ? 'text-gray-900 dark:text-white' : 'text-gray-500 dark:text-gray-400'}>
                          Left Leg
                        </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
              )}

              {/* Section 4: Analysis Rationale */}
              {rationale && rationale.length > 0 && (
                  <div>
                    <h4 className="font-medium text-gray-900 dark:text-white mb-2 text-center">
                      Analysis Rationale
                    </h4>
                    <div className="bg-gray-50 dark:bg-gray-700/30 rounded-lg p-3 space-y-2">
                      {rationale.map((item, idx) => (
                          <div key={idx} className="flex items-start gap-2">
                            <span className="text-amber-600 dark:text-amber-400 mt-0.5">◆</span>
                            <span className="text-sm text-gray-700 dark:text-gray-300">{item}</span>
                          </div>
                      ))}
                    </div>
                  </div>
              )}

              {/* Section 5: VA Rating Schedule */}
              <div>
                <h4 className="font-medium text-gray-900 dark:text-white mb-2 text-center">
                  VA Rating Schedule (Amputations)
                </h4>
                <div className="space-y-2">
                  {ratingSchedule.map((rating, idx) => {
                    const isSupported = isRatingSupported(rating.percent);
                    return (
                        <div
                            key={idx}
                            className={`p-3 rounded-lg border ${isSupported ? 'border-2' : ''} ${getRatingRowColor(rating.percent, isSupported)}`}
                        >
                          <div className="flex items-center gap-3">
                            <div className={`w-14 text-center font-bold ${isSupported ? 'text-gray-900 dark:text-white' : 'text-gray-500 dark:text-gray-400'}`}>
                              {rating.percent}%
                            </div>
                            <div className="flex-1">
                              <div className={`text-sm ${isSupported ? 'text-gray-900 dark:text-white' : 'text-gray-500 dark:text-gray-400'}`}>
                                {rating.summary}
                              </div>
                              <div className="text-xs text-gray-500 dark:text-gray-400">
                                DC {rating.dc}
                              </div>
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

              {/* Section 6: Documentation Gaps */}
              {evidenceGaps && evidenceGaps.length > 0 && (
                  <div>
                    <h4 className="font-medium text-gray-900 dark:text-white mb-2 text-center">
                      Documentation Recommendations
                    </h4>
                    <div className="bg-amber-50 dark:bg-amber-900/20 rounded-lg p-3 space-y-2">
                      {evidenceGaps.map((gap, idx) => (
                          <div key={idx} className="flex items-start gap-2">
                            <AlertTriangle className="w-4 h-4 text-amber-600 dark:text-amber-400 mt-0.5 flex-shrink-0" />
                            <span className="text-sm text-gray-700 dark:text-gray-300">{gap}</span>
                          </div>
                      ))}
                    </div>
                  </div>
              )}

              {/* Section 7: SMC Information */}
              <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg border border-blue-200 dark:border-blue-800">
                <h4 className="font-semibold text-blue-900 dark:text-blue-200 mb-2 flex items-center gap-2">
                  <span>💰</span>
                  Special Monthly Compensation (SMC-K)
                </h4>
                <div className="text-sm text-blue-800 dark:text-blue-300 space-y-2">
                  <p>
                    Per 38 CFR § 3.350(a), SMC-K ($139.87/month) is awarded for each qualifying loss:
                  </p>
                  <ul className="list-disc list-inside ml-2 space-y-1">
                    <li>Loss of use of one hand</li>
                    <li>Loss of use of one foot</li>
                    <li>Loss of use of both buttocks</li>
                    <li>Loss of one or more creative organs</li>
                  </ul>
                  <p className="mt-2 font-medium">
                    Maximum: 3 SMC-K awards ($419.61/month total)
                  </p>
                  {(metrics?.hasBilateralHands || metrics?.hasBilateralFeet) && (
                      <p className="mt-2 text-blue-900 dark:text-blue-100 font-medium">
                        ⚠️ Bilateral loss of hands or feet may qualify for SMC-L or higher levels.
                      </p>
                  )}
                </div>
              </div>

              {/* Section 8: Loss of Use Definition */}
              <div className="bg-gray-50 dark:bg-gray-700/30 p-4 rounded-lg">
                <h4 className="font-semibold text-gray-900 dark:text-white mb-2 flex items-center gap-2">
                  <span>📖</span>
                  Definition: "Loss of Use"
                </h4>
                <p className="text-sm text-gray-700 dark:text-gray-300">
                  Per 38 CFR § 3.350(a)(2), "loss of use" of a hand or foot exists when:
                </p>
                <ul className="mt-2 text-sm text-gray-700 dark:text-gray-300 list-disc list-inside space-y-1">
                  <li>No effective function remains other than that which would be equally well served by an amputation stump at the site of election with use of a suitable prosthesis</li>
                  <li>The determination is made based on the actual remaining function</li>
                  <li>Acts of grasping, manipulation, etc. (hand) or balance, propulsion, etc. (foot) could be accomplished equally well by an amputation stump with prosthesis</li>
                </ul>
              </div>

              {/* Section 9: Disclaimer */}
              <div className="bg-gray-100 dark:bg-gray-700/50 rounded-lg p-3 text-xs text-gray-600 dark:text-gray-400">
                <strong>Important:</strong> This analysis is based on logged symptoms and 38 CFR 4.71a rating criteria.
                Actual ratings depend on medical evidence and C&P examination findings. SMC eligibility requires
                VA determination. Major/minor hand designation depends on hand dominance.
              </div>
            </div>
        )}
      </div>
  );
};

export default AmputationRatingCard;