import { ChevronDown, ChevronUp } from 'lucide-react';
import { HYPERTHYROIDISM_CRITERIA, getRatingRowColor, getRatingTextColor } from '../utils/ratingCriteria';
import UnderstandingYourRating from './UnderstandingYourRating';
import ServiceConnectedBanner from './ServiceConnectedBanner';

/**
 * Hyperthyroidism/Graves' Disease Rating Card - Gold Standard Version
 * DC 7900 - 38 CFR 4.119
 */
export default function HyperthyroidismRatingCard({ analysis, expanded, onToggle }) {
  if (!analysis || !analysis.hasData) return null;

  const { supportedRating, ratingRationale, gaps, metrics } = analysis;
  const criteria = HYPERTHYROIDISM_CRITERIA;

  const isRatingSupported = (ratingPercent) => {
    if (supportedRating === null || supportedRating === undefined) return false;
    if (typeof supportedRating === 'number') return ratingPercent === supportedRating;
    if (typeof supportedRating === 'string') {
      if (supportedRating.includes('-')) {
        const [low, high] = supportedRating.split('-').map(Number);
        return ratingPercent >= low && ratingPercent <= high;
      }
      return ratingPercent === parseInt(supportedRating, 10);
    }
    return false;
  };

  return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden border-l-4 border-orange-500">
        <button
            onClick={onToggle}
            className="w-full px-6 py-4 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
        >
          <div className="flex items-center gap-3">
            <span className="text-2xl">🦋</span>
            <div className="text-left">
              <h3 className="font-semibold text-lg text-gray-900 dark:text-white">Hyperthyroidism/Graves' Disease</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">DC 7900 - 38 CFR 4.119</p>
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
                  conditionKey="hyperthyroidism"
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
                  <div className={`p-3 rounded-lg text-center ${metrics?.cardiacSymptoms > 0 ? 'bg-red-50 dark:bg-red-900/20' : 'bg-gray-50 dark:bg-gray-700/30'}`}>
                    <div className={`text-2xl font-bold ${metrics?.cardiacSymptoms > 0 ? 'text-red-600 dark:text-red-400' : 'text-gray-400'}`}>
                      {metrics?.cardiacSymptoms || 0}
                    </div>
                    <div className="text-xs text-gray-600 dark:text-gray-400">Cardiac</div>
                  </div>
                  <div className={`p-3 rounded-lg text-center ${metrics?.hasGravesEyeDisease ? 'bg-amber-50 dark:bg-amber-900/20' : 'bg-gray-50 dark:bg-gray-700/30'}`}>
                    <div className={`text-2xl font-bold ${metrics?.hasGravesEyeDisease ? 'text-amber-600 dark:text-amber-400' : 'text-gray-400'}`}>
                      {metrics?.hasGravesEyeDisease ? '✓' : '—'}
                    </div>
                    <div className="text-xs text-gray-600 dark:text-gray-400">Eye Disease</div>
                  </div>
                </div>
              </div>

              {/* Symptom Breakdown */}
              <div>
                <h4 className="font-medium text-gray-900 dark:text-white mb-2 text-center">Symptom Categories</h4>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                  <div className="bg-gray-50 dark:bg-gray-700/30 p-2 rounded text-center">
                    <div className="text-lg font-semibold text-gray-700 dark:text-gray-300">{metrics?.metabolicSymptoms || 0}</div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">Metabolic</div>
                  </div>
                  <div className="bg-gray-50 dark:bg-gray-700/30 p-2 rounded text-center">
                    <div className="text-lg font-semibold text-gray-700 dark:text-gray-300">{metrics?.neurologicSymptoms || 0}</div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">Neurologic</div>
                  </div>
                  <div className="bg-gray-50 dark:bg-gray-700/30 p-2 rounded text-center">
                    <div className="text-lg font-semibold text-gray-700 dark:text-gray-300">{metrics?.muscleSymptoms || 0}</div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">Muscle</div>
                  </div>
                  <div className="bg-gray-50 dark:bg-gray-700/30 p-2 rounded text-center">
                    <div className="text-lg font-semibold text-gray-700 dark:text-gray-300">{metrics?.eyeSymptoms || 0}</div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">Eye (Graves')</div>
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

              {/* VA Rating Schedule */}
              <div>
                <h4 className="font-medium text-gray-900 dark:text-white mb-2 text-center">VA Rating Schedule</h4>
                <div className="space-y-2">
                  {criteria.ratings.map((rating, idx) => {
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
                    <span>30% rating applies for 6 months after initial diagnosis</span>
                  </li>
                  <li className="text-sm text-blue-800 dark:text-blue-300 flex items-start gap-2">
                    <span className="text-blue-500 mt-0.5">•</span>
                    <span>Cardiac involvement (DC 7008) should be rated separately</span>
                  </li>
                  <li className="text-sm text-blue-800 dark:text-blue-300 flex items-start gap-2">
                    <span className="text-blue-500 mt-0.5">•</span>
                    <span>Graves' eye disease should be rated under appropriate eye DCs</span>
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