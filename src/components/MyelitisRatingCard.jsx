import {ChevronDown, ChevronUp} from 'lucide-react';
import {MYELITIS_CRITERIA, getRatingRowColor, getRatingTextColor} from '../utils/ratingCriteria';
import UnderstandingYourRating from './UnderstandingYourRating';
import ServiceConnectedBanner from './ServiceConnectedBanner';

/**
 * Myelitis Rating Card Component - Gold Standard Version
 * DC 8010 - 38 CFR 4.124a
 */
export default function MyelitisRatingCard({analysis, expanded, onToggle}) {
  if (!analysis || !analysis.hasData) return null;
  const {supportedRating, ratingRationale, gaps, metrics} = analysis;
  const criteria = MYELITIS_CRITERIA;

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
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden border-l-4 border-cyan-500">
        <button onClick={onToggle}
                className="w-full px-6 py-4 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
          <div className="flex items-center gap-3">
            <span className="text-2xl">🧬</span>
            <div className="text-left">
              <h3 className="font-semibold text-lg text-gray-900 dark:text-white">Myelitis</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">DC 8010 - 38 CFR 4.124a</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right">
              <div className={`text-2xl font-bold ${getRatingTextColor(supportedRating)}`}>
                {supportedRating !== null ? `${supportedRating}%` : 'N/A'}
              </div>
              <div className="text-xs text-gray-500 dark:text-gray-400">Supported Rating</div>
            </div>
            {expanded ? <ChevronUp className="w-5 h-5 text-gray-400"/> : <ChevronDown className="w-5 h-5 text-gray-400"/>}
          </div>
        </button>

        {expanded && (
            <div className="px-6 pb-6 space-y-6">
              <div className="border-t border-gray-200 dark:border-gray-700"/>

              {/* Evidence Summary */}
              <div>
                <h4 className="font-medium text-gray-900 dark:text-white mb-3 text-center">Evidence Summary</h4>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg text-center">
                    <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">{metrics?.totalLogs || 0}</div>
                    <div className="text-xs text-blue-700 dark:text-blue-300">Total Logs</div>
                  </div>
                  <div className={`p-3 rounded-lg text-center ${metrics?.weaknessLogs > 0 ? 'bg-purple-50 dark:bg-purple-900/20' : 'bg-gray-50 dark:bg-gray-700/30'}`}>
                    <div className={`text-2xl font-bold ${metrics?.weaknessLogs > 0 ? 'text-purple-600 dark:text-purple-400' : 'text-gray-400'}`}>{metrics?.weaknessLogs || 0}</div>
                    <div className="text-xs text-gray-600 dark:text-gray-400">Weakness</div>
                  </div>
                  <div className={`p-3 rounded-lg text-center ${metrics?.bladderLogs > 0 ? 'bg-orange-50 dark:bg-orange-900/20' : 'bg-gray-50 dark:bg-gray-700/30'}`}>
                    <div className={`text-2xl font-bold ${metrics?.bladderLogs > 0 ? 'text-orange-600 dark:text-orange-400' : 'text-gray-400'}`}>{metrics?.bladderLogs || 0}</div>
                    <div className="text-xs text-gray-600 dark:text-gray-400">Bladder</div>
                  </div>
                  <div className={`p-3 rounded-lg text-center ${metrics?.bowelLogs > 0 ? 'bg-red-50 dark:bg-red-900/20' : 'bg-gray-50 dark:bg-gray-700/30'}`}>
                    <div className={`text-2xl font-bold ${metrics?.bowelLogs > 0 ? 'text-red-600 dark:text-red-400' : 'text-gray-400'}`}>{metrics?.bowelLogs || 0}</div>
                    <div className="text-xs text-gray-600 dark:text-gray-400">Bowel</div>
                  </div>
                </div>
              </div>

              {/* Critical Indicators */}
              {(metrics?.hasParalysis || metrics?.hasAutonomicInvolvement) && (
                  <div className="flex flex-wrap justify-center gap-2">
                    {metrics.hasParalysis && (
                        <span className="bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-200 px-3 py-1 rounded-full text-sm font-medium">
                          🚨 Paralysis Documented
                        </span>
                    )}
                    {metrics.hasAutonomicInvolvement && (
                        <span className="bg-orange-100 text-orange-800 dark:bg-orange-900/50 dark:text-orange-200 px-3 py-1 rounded-full text-sm font-medium">
                          ⚠️ Autonomic Involvement
                        </span>
                    )}
                  </div>
              )}

              {/* Analysis Rationale */}
              {ratingRationale?.length > 0 && (
                  <div>
                    <h4 className="font-medium text-gray-900 dark:text-white mb-2 text-center">Analysis Rationale</h4>
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
                  diagnosticCode="8023"
                  currentRating={numericRating}
              />

              {/* VA Rating Schedule */}
              <div>
                <h4 className="font-medium text-gray-900 dark:text-white mb-2 text-center">VA Rating Schedule</h4>
                <div className="space-y-2">
                  {criteria.ratings.map(r => {
                    const s = isRatingSupported(r.percent);
                    return (
                        <div key={r.percent} className={`p-3 rounded-lg border ${s ? 'border-2' : ''} ${getRatingRowColor(r.percent, s)}`}>
                          <div className="flex items-center gap-3">
                            <div className={`w-14 text-center font-bold ${s ? 'text-gray-900 dark:text-white' : 'text-gray-500 dark:text-gray-400'}`}>{r.percent}%</div>
                            <div className={`flex-1 text-sm ${s ? 'text-gray-900 dark:text-white' : 'text-gray-500 dark:text-gray-400'}`}>{r.summary}</div>
                            {s && <span className="text-green-600 dark:text-green-400">✓</span>}
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
                    <span>Myelitis is rated based on <strong>residual deficits</strong> after acute phase resolves</span>
                  </li>
                  <li className="text-sm text-blue-800 dark:text-blue-300 flex items-start gap-2">
                    <span className="text-blue-500 mt-0.5">•</span>
                    <span><strong>Bladder dysfunction (DC 7542)</strong> may be rated separately</span>
                  </li>
                  <li className="text-sm text-blue-800 dark:text-blue-300 flex items-start gap-2">
                    <span className="text-blue-500 mt-0.5">•</span>
                    <span><strong>Bowel dysfunction (DC 7332)</strong> may be rated separately</span>
                  </li>
                  <li className="text-sm text-blue-800 dark:text-blue-300 flex items-start gap-2">
                    <span className="text-blue-500 mt-0.5">•</span>
                    <span>MRI documenting lesion location and extent is essential</span>
                  </li>
                </ul>
              </div>

              {/* Disclaimer */}
              <div className="bg-gray-100 dark:bg-gray-700/50 rounded-lg p-3 text-xs text-gray-600 dark:text-gray-400">
                <strong>Important:</strong> Based on 38 CFR 4.124a, DC 8010 - Myelitis. For documentation purposes only.
              </div>
            </div>
        )}
      </div>
  );
}