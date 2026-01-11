import { ChevronDown, ChevronUp } from 'lucide-react';
import { THYROIDITIS_CRITERIA, getRatingRowColor, getRatingTextColor } from '../utils/ratingCriteria';
import UnderstandingYourRating from './UnderstandingYourRating';
import ServiceConnectedBanner from './ServiceConnectedBanner';
import {isRatingSupported} from '../utils/ratingUtils.js';

/**

 * Thyroiditis Rating Card - Gold Standard Version
 * DC 7906 - 38 CFR 4.119
 */
export default function ThyroiditisRatingCard({ analysis, expanded, onToggle }) {
  if (!analysis || !analysis.hasData) return null;

  const { supportedRating, ratingRationale, gaps, metrics } = analysis;
  const criteria = THYROIDITIS_CRITERIA;

  // Determine phase display
  const getPhaseDisplay = () => {
    switch (metrics?.currentPhase) {
      case 'hyperthyroid':
        return { text: 'Hyperthyroid', color: 'text-red-600 dark:text-red-400', bg: 'bg-red-50 dark:bg-red-900/20' };
      case 'hypothyroid':
        return { text: 'Hypothyroid', color: 'text-blue-600 dark:text-blue-400', bg: 'bg-blue-50 dark:bg-blue-900/20' };
      default:
        return { text: 'Euthyroid', color: 'text-green-600 dark:text-green-400', bg: 'bg-green-50 dark:bg-green-900/20' };
    }
  };

  const phaseDisplay = getPhaseDisplay();

  return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden border-l-4 border-orange-500">
        <button
            onClick={onToggle}
            className="w-full px-6 py-4 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
        >
          <div className="flex items-center gap-3">
            <span className="text-2xl">🔥</span>
            <div className="text-left">
              <h3 className="font-semibold text-lg text-gray-900 dark:text-white">Thyroiditis</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">DC 7906 - 38 CFR 4.119</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right">
              <div className={`text-2xl font-bold ${getRatingTextColor(supportedRating)}`}>
                {supportedRating !== null && supportedRating !== undefined ? `${supportedRating}%` : 'N/A'}
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
                  conditionKey="thyroiditis"
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
                  <div className="bg-purple-50 dark:bg-purple-900/20 p-3 rounded-lg text-center">
                    <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">{metrics?.avgSeverity?.toFixed(1) || '0.0'}</div>
                    <div className="text-xs text-purple-700 dark:text-purple-300">Avg Severity</div>
                  </div>
                  <div className={`p-3 rounded-lg text-center ${phaseDisplay.bg}`}>
                    <div className={`text-lg font-bold ${phaseDisplay.color}`}>{phaseDisplay.text}</div>
                    <div className="text-xs text-gray-600 dark:text-gray-400">Current Phase</div>
                  </div>
                  <div className="bg-gray-50 dark:bg-gray-700/30 p-3 rounded-lg text-center">
                    <div className="text-2xl font-bold text-gray-600 dark:text-gray-400">{metrics?.neckSymptoms || 0}</div>
                    <div className="text-xs text-gray-600 dark:text-gray-400">Neck Symptoms</div>
                  </div>
                </div>
              </div>

              {/* Phase Breakdown */}
              <div>
                <h4 className="font-medium text-gray-900 dark:text-white mb-2 text-center">Thyroid Function Logs</h4>
                <div className="grid grid-cols-3 gap-2">
                  <div className="bg-gray-50 dark:bg-gray-700/30 p-2 rounded text-center">
                    <div className="text-lg font-semibold text-gray-700 dark:text-gray-300">{metrics?.thyroiditisSpecificLogs || 0}</div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">Thyroiditis</div>
                  </div>
                  <div className="bg-red-50 dark:bg-red-900/20 p-2 rounded text-center">
                    <div className="text-lg font-semibold text-red-600 dark:text-red-400">{metrics?.hyperLogs || 0}</div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">Hyperthyroid</div>
                  </div>
                  <div className="bg-blue-50 dark:bg-blue-900/20 p-2 rounded text-center">
                    <div className="text-lg font-semibold text-blue-600 dark:text-blue-400">{metrics?.hypoLogs || 0}</div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">Hypothyroid</div>
                  </div>
                </div>
              </div>

              {/* Analysis Rationale */}
              {ratingRationale?.length > 0 && (
                  <div>
                    <h4 className="font-medium text-gray-900 dark:text-white mb-2 text-center">Analysis Rationale</h4>
                    <div className="bg-gray-50 dark:bg-gray-700/30 rounded-lg p-3 space-y-2">
                      {ratingRationale.map((item, idx) => (
                          <div key={idx} className="flex items-start gap-2">
                            <span className="text-orange-600 dark:text-orange-400 mt-0.5">◆</span>
                            <span className="text-sm text-gray-700 dark:text-gray-300">{item}</span>
                          </div>
                      ))}
                    </div>
                  </div>
              )}

              {/* Understanding Your Rating - Educational Content */}
              <UnderstandingYourRating
                  diagnosticCode="7904"
                  currentRating={supportedRating}
              />

              {/* VA Rating Schedule */}
              <div>
                <h4 className="font-medium text-gray-900 dark:text-white mb-2 text-center">VA Rating Schedule</h4>
                <div className="space-y-2">
                  {criteria.ratings.map((rating, idx) => {
                    const isSupported = isRatingSupported(rating.percent, supportedRating);
                    return (
                        <div
                            key={idx}
                            className={`p-3 rounded-lg border ${isSupported ? 'border-2' : ''} ${getRatingRowColor(rating.percent, isSupported)}`}
                        >
                          <div className="flex items-center gap-3">
                            <div className={`w-14 text-center font-bold ${isSupported ? 'text-gray-900 dark:text-white' : 'text-gray-500 dark:text-gray-400'}`}>
                              {rating.percent}%
                            </div>
                            <div className={`flex-1 text-sm ${isSupported ? 'text-gray-900 dark:text-white' : 'text-gray-500 dark:text-gray-400'}`}>
                              {rating.summary}
                            </div>
                            {isSupported && <span className="text-green-600 dark:text-green-400">✓</span>}
                          </div>
                        </div>
                    );
                  })}
                </div>
              </div>

              {/* Documentation Gaps */}
              {gaps?.length > 0 && (
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
              <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg border border-blue-200 dark:border-blue-800">
                <h4 className="font-semibold text-blue-900 dark:text-blue-200 mb-2 flex items-center gap-2">
                  <span>ℹ️</span>Important Information
                </h4>
                <ul className="space-y-1">
                  <li className="text-sm text-blue-800 dark:text-blue-300 flex items-start gap-2">
                    <span className="text-blue-500 mt-0.5">•</span>
                    <span>Rating depends on thyroid function status (hyper, hypo, or normal)</span>
                  </li>
                  <li className="text-sm text-blue-800 dark:text-blue-300 flex items-start gap-2">
                    <span className="text-blue-500 mt-0.5">•</span>
                    <span>Hyperthyroid phase: Rate as DC 7900 (30%)</span>
                  </li>
                  <li className="text-sm text-blue-800 dark:text-blue-300 flex items-start gap-2">
                    <span className="text-blue-500 mt-0.5">•</span>
                    <span>Hypothyroid phase: Rate as DC 7903 (30% without myxedema)</span>
                  </li>
                  <li className="text-sm text-blue-800 dark:text-blue-300 flex items-start gap-2">
                    <span className="text-blue-500 mt-0.5">•</span>
                    <span>Normal function (euthyroid): 0% rating</span>
                  </li>
                </ul>
              </div>

              {/* Disclaimer */}
              <div className="bg-gray-100 dark:bg-gray-700/50 rounded-lg p-3 text-xs text-gray-600 dark:text-gray-400">
                <strong>Important:</strong> {criteria.disclaimer}
              </div>
            </div>
        )}
      </div>
  );
}