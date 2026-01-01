// FILE: /mnt/project/components/PeripheralNerveRatingCard.jsx
// CREATE NEW FILE

import { ChevronDown, ChevronUp } from 'lucide-react';
import {
  // Upper Extremity Criteria
  UPPER_RADICULAR_GROUP_CRITERIA,
  MIDDLE_RADICULAR_GROUP_CRITERIA,
  LOWER_RADICULAR_GROUP_CRITERIA,
  ALL_RADICULAR_GROUPS_CRITERIA,
  RADIAL_NERVE_CRITERIA,
  MEDIAN_NERVE_CRITERIA,
  ULNAR_NERVE_CRITERIA,
  MUSCULOCUTANEOUS_NERVE_CRITERIA,
  CIRCUMFLEX_NERVE_CRITERIA,
  LONG_THORACIC_NERVE_CRITERIA,
  // Lower Extremity Criteria
  SCIATIC_NERVE_CRITERIA,
  COMMON_PERONEAL_NERVE_CRITERIA,
  SUPERFICIAL_PERONEAL_NERVE_CRITERIA,
  DEEP_PERONEAL_NERVE_CRITERIA,
  TIBIAL_NERVE_CRITERIA,
  POSTERIOR_TIBIAL_NERVE_CRITERIA,
  FEMORAL_NERVE_CRITERIA,
  SAPHENOUS_NERVE_CRITERIA,
  OBTURATOR_NERVE_CRITERIA,
  LATERAL_FEMORAL_CUTANEOUS_NERVE_CRITERIA,
  ILIOINGUINAL_NERVE_CRITERIA, getRatingRowColor, getRatingTextColor,
} from '../utils/ratingCriteria';
import UnderstandingYourRating from './UnderstandingYourRating';
import ServiceConnectedBanner from './ServiceConnectedBanner';

/**

 * Peripheral Nerve Rating Card Component - Gold Standard Version
 * Handles all 21 peripheral nerve conditions (DC 8510-8530, 8610-8630, 8710-8730)
 * 38 CFR 4.124a
 *
 * @param {string} nerveType - The type of nerve (e.g., 'upper-radicular', 'median', 'sciatic')
 * @param {object} analysis - Analysis result from the corresponding analyze function
 * @param {boolean} expanded - Whether the card is expanded
 * @param {function} onToggle - Toggle expand/collapse
 */

// Mapping of nerve types to their criteria and display info
const NERVE_CONFIG = {
  'upper-radicular': {
    criteria: UPPER_RADICULAR_GROUP_CRITERIA,
    name: 'Upper Radicular Group (C5-C6)',
    emoji: '🔌',
    color: 'purple',
    isUpperExtremity: true,
  },
  'middle-radicular': {
    criteria: MIDDLE_RADICULAR_GROUP_CRITERIA,
    name: 'Middle Radicular Group (C7)',
    emoji: '🔌',
    color: 'purple',
    isUpperExtremity: true,
  },
  'lower-radicular': {
    criteria: LOWER_RADICULAR_GROUP_CRITERIA,
    name: 'Lower Radicular Group (C8-T1)',
    emoji: '🔌',
    color: 'purple',
    isUpperExtremity: true,
  },
  'all-radicular': {
    criteria: ALL_RADICULAR_GROUPS_CRITERIA,
    name: 'All Radicular Groups (Brachial Plexus)',
    emoji: '🔌',
    color: 'purple',
    isUpperExtremity: true,
  },
  'radial': {
    criteria: RADIAL_NERVE_CRITERIA,
    name: 'Radial Nerve (Musculospiral)',
    emoji: '🔌',
    color: 'purple',
    isUpperExtremity: true,
  },
  'median': {
    criteria: MEDIAN_NERVE_CRITERIA,
    name: 'Median Nerve',
    emoji: '🔌',
    color: 'purple',
    isUpperExtremity: true,
  },
  'ulnar': {
    criteria: ULNAR_NERVE_CRITERIA,
    name: 'Ulnar Nerve',
    emoji: '🔌',
    color: 'purple',
    isUpperExtremity: true,
  },
  'musculocutaneous': {
    criteria: MUSCULOCUTANEOUS_NERVE_CRITERIA,
    name: 'Musculocutaneous Nerve',
    emoji: '🔌',
    color: 'purple',
    isUpperExtremity: true,
  },
  'circumflex': {
    criteria: CIRCUMFLEX_NERVE_CRITERIA,
    name: 'Circumflex (Axillary) Nerve',
    emoji: '🔌',
    color: 'purple',
    isUpperExtremity: true,
  },
  'long-thoracic': {
    criteria: LONG_THORACIC_NERVE_CRITERIA,
    name: 'Long Thoracic Nerve',
    emoji: '🔌',
    color: 'purple',
    isUpperExtremity: true,
  },
  'sciatic': {
    criteria: SCIATIC_NERVE_CRITERIA,
    name: 'Sciatic Nerve',
    emoji: '🦵',
    color: 'indigo',
    isUpperExtremity: false,
  },
  'common-peroneal': {
    criteria: COMMON_PERONEAL_NERVE_CRITERIA,
    name: 'Common Peroneal Nerve',
    emoji: '🦵',
    color: 'indigo',
    isUpperExtremity: false,
  },
  'superficial-peroneal': {
    criteria: SUPERFICIAL_PERONEAL_NERVE_CRITERIA,
    name: 'Superficial Peroneal Nerve',
    emoji: '🦵',
    color: 'indigo',
    isUpperExtremity: false,
  },
  'deep-peroneal': {
    criteria: DEEP_PERONEAL_NERVE_CRITERIA,
    name: 'Deep Peroneal Nerve',
    emoji: '🦵',
    color: 'indigo',
    isUpperExtremity: false,
  },
  'tibial': {
    criteria: TIBIAL_NERVE_CRITERIA,
    name: 'Tibial Nerve',
    emoji: '🦵',
    color: 'indigo',
    isUpperExtremity: false,
  },
  'posterior-tibial': {
    criteria: POSTERIOR_TIBIAL_NERVE_CRITERIA,
    name: 'Posterior Tibial Nerve',
    emoji: '🦵',
    color: 'indigo',
    isUpperExtremity: false,
  },
  'femoral': {
    criteria: FEMORAL_NERVE_CRITERIA,
    name: 'Femoral Nerve',
    emoji: '🦵',
    color: 'indigo',
    isUpperExtremity: false,
  },
  'saphenous': {
    criteria: SAPHENOUS_NERVE_CRITERIA,
    name: 'Saphenous Nerve',
    emoji: '🦵',
    color: 'indigo',
    isUpperExtremity: false,
  },
  'obturator': {
    criteria: OBTURATOR_NERVE_CRITERIA,
    name: 'Obturator Nerve',
    emoji: '🦵',
    color: 'indigo',
    isUpperExtremity: false,
  },
  'lateral-femoral-cutaneous': {
    criteria: LATERAL_FEMORAL_CUTANEOUS_NERVE_CRITERIA,
    name: 'Lateral Femoral Cutaneous Nerve',
    emoji: '🦵',
    color: 'indigo',
    isUpperExtremity: false,
  },
  'ilioinguinal': {
    criteria: ILIOINGUINAL_NERVE_CRITERIA,
    name: 'Ilio-inguinal Nerve',
    emoji: '🦵',
    color: 'indigo',
    isUpperExtremity: false,
  },
};

export default function PeripheralNerveRatingCard({ nerveType, analysis, expanded, onToggle }) {
  if (!analysis || !analysis.hasData) return null;

  const config = NERVE_CONFIG[nerveType];
  if (!config) return null;

  const { supportedRating, ratingRationale, gaps, metrics, diagnosticCodes } = analysis;
  const criteria = config.criteria;
  const isUpperExtremity = config.isUpperExtremity;

  // Build DC code display string
  const dcDisplay = diagnosticCodes
      ? `DC ${diagnosticCodes.paralysis}/${diagnosticCodes.neuritis}/${diagnosticCodes.neuralgia}`
      : `DC ${criteria.diagnosticCodes?.paralysis || 'XXXX'}`;

  // Normalize rating for comparison
  const normalizeRating = (rating) => {
    if (rating === null || rating === undefined) return null;
    if (typeof rating === 'number') return rating;
    if (typeof rating === 'string') return parseInt(rating, 10);
    return null;
  };

  const numericRating = normalizeRating(supportedRating);
  const isRatingSupported = (p) => numericRating === p;

  // Border color based on extremity
  const borderColor = isUpperExtremity ? 'border-purple-500' : 'border-indigo-500';
  const accentColor = isUpperExtremity ? 'purple' : 'indigo';

  return (
      <div className={`bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden border-l-4 ${borderColor}`}>
        <button
            onClick={onToggle}
            className="w-full px-6 py-4 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
        >
          <div className="flex items-center gap-3">
            <span className="text-2xl">{config.emoji}</span>
            <div className="text-left">
              <h3 className="font-semibold text-lg text-gray-900 dark:text-white">{config.name}</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">{dcDisplay} - 38 CFR 4.124a</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right">
              <div className={`text-2xl font-bold ${getRatingTextColor(supportedRating)}`}>
                {supportedRating !== null ? `${supportedRating}%` : 'N/A'}
              </div>
              <div className="text-xs text-gray-500 dark:text-gray-400">Supported Rating</div>
            </div>
            {expanded ? <ChevronUp className="w-5 h-5 text-gray-400" /> : <ChevronDown className="w-5 h-5 text-gray-400" />}
          </div>
        </button>

        {expanded && (
            <div className="px-6 pb-6 space-y-6">
              <div className="border-t border-gray-200dark:border-gray-700" />

              {/* Service-Connected Status Banner */}
              <ServiceConnectedBanner
                  conditionKey="peripheralNerve"
                  currentAnalysis={analysis}
              />

              {/* Evidence Summary */}
              <div>
                <h4 className="font-medium text-gray-900 dark:text-white mb-3 text-center">Evidence Summary</h4>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg text-center">
                    <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">{metrics?.totalLogs || 0}</div>
                    <div className="text-xs text-blue-700 dark:text-blue-300">Total Logs</div>
                  </div>
                  <div className={`p-3 rounded-lg text-center ${metrics?.motorLogs > 0 ? 'bg-purple-50 dark:bg-purple-900/20' : 'bg-gray-50 dark:bg-gray-700/30'}`}>
                    <div className={`text-2xl font-bold ${metrics?.motorLogs > 0 ? 'text-purple-600 dark:text-purple-400' : 'text-gray-400'}`}>
                      {metrics?.motorLogs || 0}
                    </div>
                    <div className="text-xs text-gray-600 dark:text-gray-400">Motor</div>
                  </div>
                  <div className={`p-3 rounded-lg text-center ${metrics?.sensoryLogs > 0 ? 'bg-orange-50 dark:bg-orange-900/20' : 'bg-gray-50 dark:bg-gray-700/30'}`}>
                    <div className={`text-2xl font-bold ${metrics?.sensoryLogs > 0 ? 'text-orange-600 dark:text-orange-400' : 'text-gray-400'}`}>
                      {metrics?.sensoryLogs || 0}
                    </div>
                    <div className="text-xs text-gray-600 dark:text-gray-400">Sensory</div>
                  </div>
                  <div className="bg-green-50 dark:bg-green-900/20 p-3 rounded-lg text-center">
                    <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                      {metrics?.avgSeverity ? parseFloat(metrics.avgSeverity).toFixed(1) : '0.0'}
                    </div>
                    <div className="text-xs text-green-700 dark:text-green-300">Avg Severity</div>
                  </div>
                </div>
              </div>

              {/* Critical Indicators */}
              <div className="flex flex-wrap justify-center gap-2">
                {metrics?.severityLevel && (
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                        metrics.severityLevel === 'complete' ? 'bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-200' :
                            metrics.severityLevel === 'severe' ? 'bg-orange-100 text-orange-800 dark:bg-orange-900/50 dark:text-orange-200' :
                                metrics.severityLevel === 'moderate' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-200' :
                                    'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-200'
                    }`}>
                {metrics.severityLevel.charAt(0).toUpperCase() + metrics.severityLevel.slice(1)} Involvement
              </span>
                )}
                {metrics?.isWholySensory && (
                    <span className="bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-200 px-3 py-1 rounded-full text-sm font-medium">
                ℹ️ Wholly Sensory (Max: Moderate)
              </span>
                )}
                {isUpperExtremity && metrics?.isMajorExtremity !== undefined && (
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                        metrics.isMajorExtremity ? 'bg-purple-100 text-purple-800 dark:bg-purple-900/50 dark:text-purple-200' :
                            'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200'
                    }`}>
                {metrics.isMajorExtremity ? '💪 Major (Dominant)' : 'Minor (Non-dominant)'}
              </span>
                )}
              </div>

              {/* Analysis Rationale */}
              {ratingRationale && ratingRationale.length > 0 && (
                  <div>
                    <h4 className="font-medium text-gray-900 dark:text-white mb-2 text-center">Analysis Rationale</h4>
                    <div className="bg-gray-50 dark:bg-gray-700/30 rounded-lg p-3 space-y-2">
                      {ratingRationale.map((item, idx) => (
                          <div key={idx} className="flex items-start gap-2">
                            <span className={`text-${accentColor}-600 dark:text-${accentColor}-400 mt-0.5`}>◆</span>
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

              {/* VA Rating Schedule */}
              <div>
                <h4 className="font-medium text-gray-900 dark:text-white mb-2 text-center">VA Rating Schedule</h4>
                <div className="space-y-2">
                  {criteria.ratings.map((rating, idx) => {
                    const supported = isRatingSupported(rating.percent);
                    return (
                        <div
                            key={idx}
                            className={`p-3 rounded-lg border ${supported ? 'border-2' : ''} ${getRatingRowColor(rating.percent, supported)}`}
                        >
                          <div className="flex items-center gap-3">
                            <div className={`w-14 text-center font-bold ${supported ? 'text-gray-900 dark:text-white' : 'text-gray-500 dark:text-gray-400'}`}>
                              {rating.percent}%
                            </div>
                            <div className={`flex-1 text-sm ${supported ? 'text-gray-900 dark:text-white' : 'text-gray-500 dark:text-gray-400'}`}>
                              {rating.summary}
                              {/* Show major/minor distinction for upper extremity */}
                              {isUpperExtremity && rating.extremity && (
                                  <span className="text-xs ml-1 text-gray-500">({rating.extremity})</span>
                              )}
                            </div>
                            {supported && <span className="text-green-600 dark:text-green-400">✓</span>}
                          </div>
                        </div>
                    );
                  })}
                </div>
              </div>

              {/* Documentation Gaps */}
              {gaps && gaps.length > 0 && (
                  <div>
                    <h4 className="font-medium text-gray-900 dark:text-white mb-2 text-center">Documentation Gaps</h4>
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

              {/* Important Information */}
              {criteria.note && (
                  <div className={`bg-${accentColor}-50 dark:bg-${accentColor}-900/20 p-4 rounded-lg border border-${accentColor}-200 dark:border-${accentColor}-800`}>
                    <h4 className={`font-semibold text-${accentColor}-900 dark:text-${accentColor}-200 mb-2 flex items-center gap-2`}>
                      <span>ℹ️</span>
                      Important Information
                    </h4>
                    <p className={`text-sm text-${accentColor}-800 dark:text-${accentColor}-300`}>
                      {criteria.note}
                    </p>
                  </div>
              )}

              {/* Disclaimer */}
              {criteria.disclaimer && (
                  <div className="bg-gray-100 dark:bg-gray-700/50 rounded-lg p-3 text-xs text-gray-600 dark:text-gray-400">
                    <strong>Important:</strong> {criteria.disclaimer}
                  </div>
              )}
            </div>
        )}
      </div>
  );
}