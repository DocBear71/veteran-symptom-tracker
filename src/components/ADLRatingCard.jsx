import React, { useState } from 'react';
import { ChevronDown, ChevronUp, CheckCircle, Circle, AlertTriangle, Info, DollarSign, Heart } from 'lucide-react';
import { getRatingTextColor } from '../utils/ratingCriteria';
import ServiceConnectedBanner from './ServiceConnectedBanner';
import SMCAlertBanner from './SMCAlertBanner';

/**
 * ADL Rating Card Component
 *
 * Displays Activities of Daily Living analysis for Aid & Attendance claims
 * Based on 38 CFR § 3.352(a) - Criteria for permanent need for aid and attendance
 */
const ADLRatingCard = ({ analysis, expanded, onToggle }) => {
  if (!analysis || !analysis.hasData) return null;

  const {
    supportedLevel,
    totalLogs,
    factorsAffected,
    factors,
    hasBedridden,
    hasTotalDependence,
    hasNursingLevel,
    hasHousebound,
    potentialSMC,
    rationale,
    evidenceGaps,
    metrics
  } = analysis;

  // Determine the SMC level indicator
  const getSMCLevelInfo = () => {
    if (potentialSMC === 'R') {
      return { level: 'SMC-R', color: 'red', amount: '$10,480.48', description: 'Higher Aid & Attendance' };
    } else if (potentialSMC === 'L') {
      return { level: 'SMC-L', color: 'purple', amount: '$5,144.45', description: 'Basic Aid & Attendance' };
    } else if (potentialSMC === 'S') {
      return { level: 'SMC-S', color: 'blue', amount: '$4,579.63', description: 'Housebound' };
    }
    return { level: 'Review', color: 'gray', amount: 'TBD', description: 'More documentation needed' };
  };

  const smcInfo = getSMCLevelInfo();

  // ADL Factor definitions per 38 CFR § 3.352(a)
  const adlFactorDefinitions = {
    dressing: {
      name: 'Dressing/Undressing',
      description: 'Inability to dress or undress self, or to keep self ordinarily clean and presentable',
      icon: '👕',
    },
    hygiene: {
      name: 'Personal Hygiene',
      description: 'Inability to attend to the wants of nature, bathing, and keeping ordinarily clean',
      icon: '🚿',
    },
    feeding: {
      name: 'Feeding/Eating',
      description: 'Inability to feed self through loss of coordination or extreme weakness',
      icon: '🍽️',
    },
    toileting: {
      name: 'Toileting/Continence',
      description: 'Frequent need of adjustment of prosthetic or orthopedic appliances, or incontinence',
      icon: '🚽',
    },
    mobility: {
      name: 'Mobility/Transfers',
      description: 'Physical or mental incapacity requiring care or assistance on a regular basis to protect from hazards',
      icon: '🚶',
    },
    safety: {
      name: 'Safety/Protection',
      description: 'Need for protection from hazards or dangers incident to daily environment',
      icon: '🛡️',
    },
    cognitive: {
      name: 'Cognitive Function',
      description: 'Mental incapacity requiring care or assistance on a regular basis',
      icon: '🧠',
    },
  };

  return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden border-l-4 border-amber-500">
        {/* Header */}
        <button
            onClick={onToggle}
            className="w-full px-6 py-4 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
        >
          <div className="flex items-center gap-3">
            <span className="text-2xl">🏠</span>
            <div className="text-left">
              <h3 className="font-semibold text-lg text-gray-900 dark:text-white">
                Activities of Daily Living (ADL)
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                38 CFR § 3.352(a) - Aid & Attendance Eligibility
              </p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right">
              <div className={`text-2xl font-bold ${
                  potentialSMC ? 'text-green-600 dark:text-green-400' : 'text-gray-500 dark:text-gray-400'
              }`}>
                {potentialSMC ? `SMC-${potentialSMC}` : 'Review'}
              </div>
              <div className="text-xs text-gray-500 dark:text-gray-400">
                {factorsAffected}/7 Factors
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
              <div className="border-t border-gray-200 dark:border-gray-700" />

              {/* SMC Potential Banner */}
              {potentialSMC && (
                  <div className={`p-4 rounded-lg border-2 ${
                      potentialSMC === 'R' ? 'bg-red-50 dark:bg-red-900/20 border-red-300 dark:border-red-700' :
                          potentialSMC === 'L' ? 'bg-purple-50 dark:bg-purple-900/20 border-purple-300 dark:border-purple-700' :
                              'bg-blue-50 dark:bg-blue-900/20 border-blue-300 dark:border-blue-700'
                  }`}>
                    <div className="flex items-center gap-3">
                      <DollarSign className={`w-8 h-8 ${
                          potentialSMC === 'R' ? 'text-red-600 dark:text-red-400' :
                              potentialSMC === 'L' ? 'text-purple-600 dark:text-purple-400' :
                                  'text-blue-600 dark:text-blue-400'
                      }`} />
                      <div>
                        <div className="font-bold text-lg text-gray-900 dark:text-white">
                          Potential {smcInfo.level} Eligibility
                        </div>
                        <div className="text-sm text-gray-600 dark:text-gray-400">
                          {smcInfo.description} - {smcInfo.amount}/month (2026 rates)
                        </div>
                      </div>
                    </div>
                  </div>
              )}

              {/* Evidence Summary */}
              <div>
                <h4 className="font-medium text-gray-900 dark:text-white mb-3 text-center">
                  Evidence Summary
                </h4>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg text-center">
                    <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                      {totalLogs || 0}
                    </div>
                    <div className="text-xs text-blue-700 dark:text-blue-300">ADL Logs</div>
                  </div>
                  <div className={`p-3 rounded-lg text-center ${
                      factorsAffected >= 3
                          ? 'bg-green-50 dark:bg-green-900/20'
                          : 'bg-gray-50 dark:bg-gray-700/30'
                  }`}>
                    <div className={`text-2xl font-bold ${
                        factorsAffected >= 3
                            ? 'text-green-600 dark:text-green-400'
                            : 'text-gray-400'
                    }`}>
                      {factorsAffected}/7
                    </div>
                    <div className="text-xs text-gray-600 dark:text-gray-400">Factors Documented</div>
                  </div>
                  <div className={`p-3 rounded-lg text-center ${
                      hasBedridden || hasTotalDependence
                          ? 'bg-red-50 dark:bg-red-900/20'
                          : 'bg-gray-50 dark:bg-gray-700/30'
                  }`}>
                    <div className={`text-2xl font-bold ${
                        hasBedridden || hasTotalDependence
                            ? 'text-red-600 dark:text-red-400'
                            : 'text-gray-400'
                    }`}>
                      {hasBedridden || hasTotalDependence ? 'Yes' : 'No'}
                    </div>
                    <div className="text-xs text-gray-600 dark:text-gray-400">Severe Limitation</div>
                  </div>
                  <div className={`p-3 rounded-lg text-center ${
                      potentialSMC
                          ? 'bg-amber-50 dark:bg-amber-900/20'
                          : 'bg-gray-50 dark:bg-gray-700/30'
                  }`}>
                    <div className={`text-2xl font-bold ${
                        potentialSMC
                            ? 'text-amber-600 dark:text-amber-400'
                            : 'text-gray-400'
                    }`}>
                      {potentialSMC || '—'}
                    </div>
                    <div className="text-xs text-gray-600 dark:text-gray-400">SMC Level</div>
                  </div>
                </div>
              </div>

              {/* ADL Factors Checklist */}
              <div>
                <h4 className="font-medium text-gray-900 dark:text-white mb-3 text-center">
                  ADL Factors (38 CFR § 3.352(a))
                </h4>
                <div className="space-y-2">
                  {Object.entries(adlFactorDefinitions).map(([key, factor]) => {
                    const isDocumented = factors?.[key];
                    return (
                        <div
                            key={key}
                            className={`p-3 rounded-lg border ${
                                isDocumented
                                    ? 'bg-green-50 dark:bg-green-900/20 border-green-300 dark:border-green-700'
                                    : 'bg-gray-50 dark:bg-gray-700/30 border-gray-200 dark:border-gray-600'
                            }`}
                        >
                          <div className="flex items-center gap-3">
                            <span className="text-xl">{factor.icon}</span>
                            {isDocumented ? (
                                <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                            ) : (
                                <Circle className="w-5 h-5 text-gray-300 dark:text-gray-600 flex-shrink-0" />
                            )}
                            <div className="flex-1">
                              <div className={`font-medium ${
                                  isDocumented
                                      ? 'text-green-900 dark:text-green-100'
                                      : 'text-gray-600 dark:text-gray-400'
                              }`}>
                                {factor.name}
                              </div>
                              <div className="text-xs text-gray-500 dark:text-gray-400">
                                {factor.description}
                              </div>
                            </div>
                            {isDocumented && (
                                <span className="text-xs bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 px-2 py-0.5 rounded">
                          Documented
                        </span>
                            )}
                          </div>
                        </div>
                    );
                  })}
                </div>
              </div>

              {/* Severe Indicators */}
              <div>
                <h4 className="font-medium text-gray-900 dark:text-white mb-3 text-center">
                  Severity Indicators
                </h4>
                <div className="grid grid-cols-2 gap-3">
                  <div className={`p-3 rounded-lg border ${
                      hasBedridden
                          ? 'bg-red-50 dark:bg-red-900/20 border-red-300 dark:border-red-700'
                          : 'bg-gray-50 dark:bg-gray-700/30 border-gray-200 dark:border-gray-600'
                  }`}>
                    <div className="flex items-center gap-2">
                      {hasBedridden ? (
                          <CheckCircle className="w-5 h-5 text-red-500" />
                      ) : (
                          <Circle className="w-5 h-5 text-gray-300 dark:text-gray-600" />
                      )}
                      <span className={hasBedridden ? 'text-red-900 dark:text-red-100 font-medium' : 'text-gray-600 dark:text-gray-400'}>
                    Bedridden
                  </span>
                    </div>
                  </div>
                  <div className={`p-3 rounded-lg border ${
                      hasTotalDependence
                          ? 'bg-red-50 dark:bg-red-900/20 border-red-300 dark:border-red-700'
                          : 'bg-gray-50 dark:bg-gray-700/30 border-gray-200 dark:border-gray-600'
                  }`}>
                    <div className="flex items-center gap-2">
                      {hasTotalDependence ? (
                          <CheckCircle className="w-5 h-5 text-red-500" />
                      ) : (
                          <Circle className="w-5 h-5 text-gray-300 dark:text-gray-600" />
                      )}
                      <span className={hasTotalDependence ? 'text-red-900 dark:text-red-100 font-medium' : 'text-gray-600 dark:text-gray-400'}>
                    Total Dependence
                  </span>
                    </div>
                  </div>
                  <div className={`p-3 rounded-lg border ${
                      hasNursingLevel
                          ? 'bg-red-50 dark:bg-red-900/20 border-red-300 dark:border-red-700'
                          : 'bg-gray-50 dark:bg-gray-700/30 border-gray-200 dark:border-gray-600'
                  }`}>
                    <div className="flex items-center gap-2">
                      {hasNursingLevel ? (
                          <CheckCircle className="w-5 h-5 text-red-500" />
                      ) : (
                          <Circle className="w-5 h-5 text-gray-300 dark:text-gray-600" />
                      )}
                      <span className={hasNursingLevel ? 'text-red-900 dark:text-red-100 font-medium' : 'text-gray-600 dark:text-gray-400'}>
                    Nursing Level Care
                  </span>
                    </div>
                  </div>
                  <div className={`p-3 rounded-lg border ${
                      hasHousebound
                          ? 'bg-blue-50 dark:bg-blue-900/20 border-blue-300 dark:border-blue-700'
                          : 'bg-gray-50 dark:bg-gray-700/30 border-gray-200 dark:border-gray-600'
                  }`}>
                    <div className="flex items-center gap-2">
                      {hasHousebound ? (
                          <CheckCircle className="w-5 h-5 text-blue-500" />
                      ) : (
                          <Circle className="w-5 h-5 text-gray-300 dark:text-gray-600" />
                      )}
                      <span className={hasHousebound ? 'text-blue-900 dark:text-blue-100 font-medium' : 'text-gray-600 dark:text-gray-400'}>
                    Housebound
                  </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Analysis Rationale */}
              {rationale && rationale.length > 0 && (
                  <div>
                    <h4 className="font-medium text-gray-900 dark:text-white mb-2 text-center">
                      Analysis Rationale
                    </h4>
                    <div className="bg-gray-50 dark:bg-gray-700/30 rounded-lg p-3 space-y-2">
                      {rationale.map((item, idx) => (
                          <div key={idx} className="flex items-start gap-2">
                            <span className="text-blue-600 dark:text-blue-400 mt-0.5">◆</span>
                            <span className="text-sm text-gray-700 dark:text-gray-300">{item}</span>
                          </div>
                      ))}
                    </div>
                  </div>
              )}

              {/* Evidence Gaps */}
              {evidenceGaps && evidenceGaps.length > 0 && (
                  <div>
                    <h4 className="font-medium text-gray-900 dark:text-white mb-2 text-center">
                      Documentation Gaps
                    </h4>
                    <div className="bg-amber-50 dark:bg-amber-900/20 rounded-lg p-3 space-y-2">
                      {evidenceGaps.map((gap, idx) => (
                          <div key={idx} className="flex items-start gap-2">
                            <AlertTriangle className="w-4 h-4 text-amber-600 dark:text-amber-400 mt-0.5 flex-shrink-0" />
                            <span className="text-sm text-amber-800 dark:text-amber-300">{gap}</span>
                          </div>
                      ))}
                    </div>
                  </div>
              )}

              {/* Filing Guidance */}
              <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg border border-blue-200 dark:border-blue-800">
                <h4 className="font-semibold text-blue-900 dark:text-blue-200 mb-2 flex items-center gap-2">
                  <Info className="w-5 h-5" />
                  How to File for Aid & Attendance
                </h4>
                <ul className="space-y-2 text-sm text-blue-800 dark:text-blue-300">
                  <li className="flex items-start gap-2">
                    <span className="text-blue-500 mt-0.5">•</span>
                    <span><strong>VA Form 21-2680:</strong> Examination for Housebound Status or Permanent Need for Aid & Attendance - must be completed by a physician.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-blue-500 mt-0.5">•</span>
                    <span><strong>Required:</strong> You must already be service-connected at a combined 100% schedular rating OR have a single condition at 100%.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-blue-500 mt-0.5">•</span>
                    <span><strong>Evidence:</strong> Your logged ADL limitations can support your claim. Export this data for your physician.</span>
                  </li>
                </ul>
              </div>

              {/* SMC Levels Explanation */}
              <div className="bg-gray-50 dark:bg-gray-700/30 rounded-lg p-4">
                <h4 className="font-medium text-gray-900 dark:text-white mb-3">
                  SMC Levels for Aid & Attendance
                </h4>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2">
                    <span className="w-16 font-bold text-blue-600 dark:text-blue-400">SMC-S</span>
                    <span className="text-gray-600 dark:text-gray-400">Housebound - substantially confined to dwelling</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-16 font-bold text-purple-600 dark:text-purple-400">SMC-L</span>
                    <span className="text-gray-600 dark:text-gray-400">Basic A&A - need regular help with ADLs</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-16 font-bold text-red-600 dark:text-red-400">SMC-R</span>
                    <span className="text-gray-600 dark:text-gray-400">Higher A&A - need nursing home level care</span>
                  </div>
                </div>
              </div>

              {/* Disclaimer */}
              <div className="bg-gray-100 dark:bg-gray-700/50 rounded-lg p-3 text-xs text-gray-600 dark:text-gray-400">
                <strong>Important:</strong> Aid & Attendance eligibility is determined per 38 CFR § 3.352(a).
                This analysis is for documentation guidance only. The VA makes all final A&A determinations
                based on medical evidence and VA Form 21-2680 examination.
              </div>
            </div>
        )}
      </div>
  );
};

export default ADLRatingCard;