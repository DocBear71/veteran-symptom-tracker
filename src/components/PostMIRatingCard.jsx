import { ChevronDown, ChevronUp } from 'lucide-react';
import { POST_MI_CRITERIA } from '../utils/ratingCriteria';
import UnderstandingYourRating from './UnderstandingYourRating';

export default function PostMIRatingCard({ analysis, expanded, onToggle }) {
  if (!analysis || !analysis.hasData) return null;

  const { supportedRating, ratingRationale, gaps, metrics } = analysis;
  const criteria = POST_MI_CRITERIA;

  // Use ratingRationale or rationale for backward compatibility
  const rationale = ratingRationale || analysis.rationale || [];
  const evidenceGaps = gaps || analysis.evidenceGaps || [];

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
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden border-l-4 border-rose-500">
        <button onClick={onToggle} className="w-full px-6 py-4 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
          <div className="flex items-center gap-3">
            <span className="text-2xl">💔</span>
            <div className="text-left">
              <h3 className="font-semibold text-lg text-gray-900 dark:text-white">Myocardial Infarction (Post-MI)</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">DC 7006 - 38 CFR 4.104</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right">
              <div className="text-2xl font-bold text-rose-600 dark:text-rose-400">{supportedRating !== null ? `${supportedRating}%` : 'N/A'}</div>
              <div className="text-xs text-gray-500 dark:text-gray-400">Supported Rating</div>
            </div>
            {expanded ? <ChevronUp className="w-5 h-5 text-gray-400" /> : <ChevronDown className="w-5 h-5 text-gray-400" />}
          </div>
        </button>

        {expanded && (
            <div className="px-6 pb-6 space-y-6">
              <div className="border-t border-gray-200 dark:border-gray-700" />

              {/* Recovery Period Alert */}
              {metrics?.isInRecoveryPeriod && (
                  <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded-lg border border-red-200 dark:border-red-800">
                    <h4 className="font-semibold text-red-900 dark:text-red-200 mb-1 flex items-center gap-2">
                      <span>🚨</span>Within 3-Month Recovery Period
                    </h4>
                    <p className="text-sm text-red-800 dark:text-red-300">
                      You are within the automatic 100% rating period following your MI. This rating applies during the MI and for 3 months following.
                    </p>
                  </div>
              )}

              {/* Evidence Summary */}
              <div>
                <h4 className="font-medium text-gray-900 dark:text-white mb-3 text-center">Evidence Summary</h4>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg text-center">
                    <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">{metrics?.totalLogs || 0}</div>
                    <div className="text-xs text-blue-700 dark:text-blue-300">Total Logs</div>
                  </div>
                  <div className={`p-3 rounded-lg text-center ${metrics?.metsLevel ? 'bg-green-50 dark:bg-green-900/20' : 'bg-gray-50 dark:bg-gray-700/30'}`}>
                    <div className={`text-2xl font-bold ${metrics?.metsLevel ? 'text-green-600 dark:text-green-400' : 'text-gray-400'}`}>
                      {metrics?.metsLevel || '—'}
                    </div>
                    <div className="text-xs text-gray-600 dark:text-gray-400">METs Level</div>
                  </div>
                  <div className={`p-3 rounded-lg text-center ${metrics?.ejectionFraction ? 'bg-purple-50 dark:bg-purple-900/20' : 'bg-gray-50 dark:bg-gray-700/30'}`}>
                    <div className={`text-2xl font-bold ${metrics?.ejectionFraction ? 'text-purple-600 dark:text-purple-400' : 'text-gray-400'}`}>
                      {metrics?.ejectionFraction ? `${metrics.ejectionFraction}%` : '—'}
                    </div>
                    <div className="text-xs text-gray-600 dark:text-gray-400">Ejection Fraction</div>
                  </div>
                  <div className={`p-3 rounded-lg text-center ${metrics?.hasHypertrophyOrDilatation ? 'bg-red-50 dark:bg-red-900/20' : 'bg-gray-50 dark:bg-gray-700/30'}`}>
                    <div className={`text-2xl font-bold ${metrics?.hasHypertrophyOrDilatation ? 'text-red-600 dark:text-red-400' : 'text-gray-400'}`}>
                      {metrics?.hasHypertrophyOrDilatation ? 'Yes' : 'No'}
                    </div>
                    <div className="text-xs text-gray-600 dark:text-gray-400">Hypertrophy/Dilatation</div>
                  </div>
                </div>
                {/* Secondary metrics row */}
                <div className="grid grid-cols-3 gap-3 mt-3">
                  <div className="bg-rose-50 dark:bg-rose-900/20 p-2 rounded-lg text-center">
                    <div className="text-lg font-bold text-rose-600 dark:text-rose-400">{metrics?.chestPainCount || 0}</div>
                    <div className="text-xs text-rose-700 dark:text-rose-300">Chest Pain Episodes</div>
                  </div>
                  <div className="bg-orange-50 dark:bg-orange-900/20 p-2 rounded-lg text-center">
                    <div className="text-lg font-bold text-orange-600 dark:text-orange-400">{metrics?.dyspneaCount || 0}</div>
                    <div className="text-xs text-orange-700 dark:text-orange-300">Dyspnea Episodes</div>
                  </div>
                  <div className="bg-amber-50 dark:bg-amber-900/20 p-2 rounded-lg text-center">
                    <div className="text-lg font-bold text-amber-600 dark:text-amber-400">{metrics?.hospitalizationCount || 0}</div>
                    <div className="text-xs text-amber-700 dark:text-amber-300">Hospitalizations</div>
                  </div>
                </div>
              </div>

              {/* Analysis Rationale */}
              {rationale && rationale.length > 0 && (
                  <div>
                    <h4 className="font-medium text-gray-900 dark:text-white mb-2 text-center">Analysis Rationale</h4>
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

              {/* VA Rating Schedule */}
              <div>
                <h4 className="font-medium text-gray-900 dark:text-white mb-2 text-center">VA Rating Schedule</h4>
                <div className="space-y-2">
                  {criteria.ratings.map(rating => {
                    const isSupported = isRatingSupported(rating.percent);
                    return (
                        <div key={rating.percent} className={`p-3 rounded-lg border ${isSupported ? 'border-2' : ''} ${getRatingRowColor(rating.percent, isSupported)}`}>
                          <div className="flex items-center gap-3">
                            <div className={`w-14 text-center font-bold ${isSupported ? 'text-gray-900 dark:text-white' : 'text-gray-500 dark:text-gray-400'}`}>{rating.percent}%</div>
                            <div className={`flex-1 text-sm ${isSupported ? 'text-gray-900 dark:text-white' : 'text-gray-500 dark:text-gray-400'}`}>{rating.summary}</div>
                            {isSupported && <span className="text-green-600 dark:text-green-400">✓</span>}
                          </div>
                        </div>
                    );
                  })}
                </div>
              </div>

              {/* Documentation Gaps */}
              {evidenceGaps && evidenceGaps.length > 0 && (
                  <div>
                    <h4 className="font-medium text-gray-900 dark:text-white mb-2 text-center">Documentation Gaps</h4>
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

              {/* Important Information */}
              <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg border border-blue-200 dark:border-blue-800">
                <h4 className="font-semibold text-blue-900 dark:text-blue-200 mb-2 flex items-center gap-2">
                  <span>ℹ️</span>Important Information
                </h4>
                <ul className="space-y-1">
                  <li className="text-sm text-blue-800 dark:text-blue-300 flex items-start gap-2"><span className="text-blue-500 mt-0.5">•</span><span>Automatic 100% rating during MI and for 3 months following (documented by labs)</span></li>
                  <li className="text-sm text-blue-800 dark:text-blue-300 flex items-start gap-2"><span className="text-blue-500 mt-0.5">•</span><span>After recovery period, rating is based on METs capacity from stress test</span></li>
                  <li className="text-sm text-blue-800 dark:text-blue-300 flex items-start gap-2"><span className="text-blue-500 mt-0.5">•</span><span>History of multiple MIs can support 60% rating</span></li>
                  <li className="text-sm text-blue-800 dark:text-blue-300 flex items-start gap-2"><span className="text-blue-500 mt-0.5">•</span><span>Document MI date, cardiac rehab participation, and ongoing symptoms</span></li>
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