import { ChevronDown, ChevronUp } from 'lucide-react';
import { PAD_CRITERIA } from '../utils/ratingCriteria';

export default function PADRatingCard({ analysis, expanded, onToggle }) {
  if (!analysis || !analysis.hasData) return null;

  const { supportedRating, ratingRationale, gaps, metrics } = analysis;
  const criteria = PAD_CRITERIA;

  // Handle both ratingRationale and rationale for compatibility
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
    if (percent >= 60) return 'bg-orange-100 dark:bg-orange-900/30 border-orange-300 dark:border-orange-700';
    if (percent >= 40) return 'bg-amber-100 dark:bg-amber-900/30 border-amber-300 dark:border-amber-700';
    return 'bg-yellow-100 dark:bg-yellow-900/30 border-yellow-300 dark:border-yellow-700';
  };

  // Format ABI display
  const formatABI = (abi) => {
    if (abi === null || abi === undefined) return '—';
    return abi.toFixed(2);
  };

  // Determine ABI status color
  const getABIStatusColor = (abi) => {
    if (abi === null || abi === undefined) return 'bg-gray-50 dark:bg-gray-700/30';
    if (abi <= 0.4) return 'bg-red-50 dark:bg-red-900/20';
    if (abi <= 0.5) return 'bg-orange-50 dark:bg-orange-900/20';
    if (abi <= 0.7) return 'bg-amber-50 dark:bg-amber-900/20';
    if (abi <= 0.9) return 'bg-yellow-50 dark:bg-yellow-900/20';
    return 'bg-green-50 dark:bg-green-900/20';
  };

  const getABITextColor = (abi) => {
    if (abi === null || abi === undefined) return 'text-gray-400';
    if (abi <= 0.4) return 'text-red-600 dark:text-red-400';
    if (abi <= 0.5) return 'text-orange-600 dark:text-orange-400';
    if (abi <= 0.7) return 'text-amber-600 dark:text-amber-400';
    if (abi <= 0.9) return 'text-yellow-600 dark:text-yellow-400';
    return 'text-green-600 dark:text-green-400';
  };

  return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden border-l-4 border-rose-500">
        <button onClick={onToggle} className="w-full px-6 py-4 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
          <div className="flex items-center gap-3">
            <span className="text-2xl">🦵</span>
            <div className="text-left">
              <h3 className="font-semibold text-lg text-gray-900 dark:text-white">Peripheral Arterial Disease</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">DC 7114 - 38 CFR 4.104</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right">
              <div className="text-2xl font-bold text-rose-600 dark:text-rose-400">{supportedRating !== null ? `${supportedRating}%` : 'N/A'}</div>
              <div className="text-xs text-gray-500 dark:text-gray-400">Per Extremity</div>
            </div>
            {expanded ? <ChevronUp className="w-5 h-5 text-gray-400" /> : <ChevronDown className="w-5 h-5 text-gray-400" />}
          </div>
        </button>

        {expanded && (
            <div className="px-6 pb-6 space-y-6">
              <div className="border-t border-gray-200 dark:border-gray-700" />

              {/* Evidence Summary */}
              <div>
                <h4 className="font-medium text-gray-900 dark:text-white mb-3 text-center">Evidence Summary</h4>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg text-center">
                    <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">{metrics?.totalLogs || 0}</div>
                    <div className="text-xs text-blue-700 dark:text-blue-300">Total Logs</div>
                  </div>
                  <div className={`p-3 rounded-lg text-center ${getABIStatusColor(metrics?.lowestABI)}`}>
                    <div className={`text-2xl font-bold ${getABITextColor(metrics?.lowestABI)}`}>
                      {formatABI(metrics?.lowestABI)}
                    </div>
                    <div className="text-xs text-gray-600 dark:text-gray-400">Lowest ABI</div>
                  </div>
                  <div className="bg-purple-50 dark:bg-purple-900/20 p-3 rounded-lg text-center">
                    <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                      {(metrics?.claudicationMild || 0) + (metrics?.claudicationModerate || 0) + (metrics?.claudicationSevere || 0)}
                    </div>
                    <div className="text-xs text-purple-700 dark:text-purple-300">Claudication</div>
                  </div>
                  <div className={`p-3 rounded-lg text-center ${metrics?.restPainCount > 0 ? 'bg-red-50 dark:bg-red-900/20' : 'bg-gray-50 dark:bg-gray-700/30'}`}>
                    <div className={`text-2xl font-bold ${metrics?.restPainCount > 0 ? 'text-red-600 dark:text-red-400' : 'text-gray-400'}`}>
                      {metrics?.restPainCount || 0}
                    </div>
                    <div className="text-xs text-gray-600 dark:text-gray-400">Rest Pain</div>
                  </div>
                </div>

                {/* Secondary Metrics */}
                <div className="grid grid-cols-4 gap-2 mt-3">
                  <div className={`p-2 rounded-lg text-center ${metrics?.claudicationSevere > 0 ? 'bg-red-50 dark:bg-red-900/20' : 'bg-gray-50 dark:bg-gray-700/30'}`}>
                    <div className={`text-lg font-bold ${metrics?.claudicationSevere > 0 ? 'text-red-600 dark:text-red-400' : 'text-gray-400'}`}>
                      {metrics?.claudicationSevere || 0}
                    </div>
                    <div className="text-xs text-gray-600 dark:text-gray-400">&lt;25 yds</div>
                  </div>
                  <div className={`p-2 rounded-lg text-center ${metrics?.claudicationModerate > 0 ? 'bg-orange-50 dark:bg-orange-900/20' : 'bg-gray-50 dark:bg-gray-700/30'}`}>
                    <div className={`text-lg font-bold ${metrics?.claudicationModerate > 0 ? 'text-orange-600 dark:text-orange-400' : 'text-gray-400'}`}>
                      {metrics?.claudicationModerate || 0}
                    </div>
                    <div className="text-xs text-gray-600 dark:text-gray-400">25-100 yds</div>
                  </div>
                  <div className={`p-2 rounded-lg text-center ${metrics?.claudicationMild > 0 ? 'bg-yellow-50 dark:bg-yellow-900/20' : 'bg-gray-50 dark:bg-gray-700/30'}`}>
                    <div className={`text-lg font-bold ${metrics?.claudicationMild > 0 ? 'text-yellow-600 dark:text-yellow-400' : 'text-gray-400'}`}>
                      {metrics?.claudicationMild || 0}
                    </div>
                    <div className="text-xs text-gray-600 dark:text-gray-400">&gt;100 yds</div>
                  </div>
                  <div className={`p-2 rounded-lg text-center ${metrics?.ulcerationCount > 0 ? 'bg-red-50 dark:bg-red-900/20' : 'bg-gray-50 dark:bg-gray-700/30'}`}>
                    <div className={`text-lg font-bold ${metrics?.ulcerationCount > 0 ? 'text-red-600 dark:text-red-400' : 'text-gray-400'}`}>
                      {metrics?.ulcerationCount || 0}
                    </div>
                    <div className="text-xs text-gray-600 dark:text-gray-400">Ulcers</div>
                  </div>
                </div>

                {/* Trophic Changes and Other Findings */}
                <div className="grid grid-cols-3 gap-2 mt-3">
                  <div className={`p-2 rounded-lg text-center ${metrics?.trophicChangeCount > 0 ? 'bg-amber-50 dark:bg-amber-900/20' : 'bg-gray-50 dark:bg-gray-700/30'}`}>
                    <div className={`text-lg font-bold ${metrics?.trophicChangeCount > 0 ? 'text-amber-600 dark:text-amber-400' : 'text-gray-400'}`}>
                      {metrics?.trophicChangeCount || 0}
                    </div>
                    <div className="text-xs text-gray-600 dark:text-gray-400">Trophic Changes</div>
                  </div>
                  <div className={`p-2 rounded-lg text-center ${metrics?.coldnessCount > 0 ? 'bg-cyan-50 dark:bg-cyan-900/20' : 'bg-gray-50 dark:bg-gray-700/30'}`}>
                    <div className={`text-lg font-bold ${metrics?.coldnessCount > 0 ? 'text-cyan-600 dark:text-cyan-400' : 'text-gray-400'}`}>
                      {metrics?.coldnessCount || 0}
                    </div>
                    <div className="text-xs text-gray-600 dark:text-gray-400">Coldness</div>
                  </div>
                  <div className={`p-2 rounded-lg text-center ${metrics?.diminishedPulsesCount > 0 ? 'bg-indigo-50 dark:bg-indigo-900/20' : 'bg-gray-50 dark:bg-gray-700/30'}`}>
                    <div className={`text-lg font-bold ${metrics?.diminishedPulsesCount > 0 ? 'text-indigo-600 dark:text-indigo-400' : 'text-gray-400'}`}>
                      {metrics?.diminishedPulsesCount || 0}
                    </div>
                    <div className="text-xs text-gray-600 dark:text-gray-400">Weak Pulses</div>
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
                            <span className="text-rose-600 dark:text-rose-400 mt-0.5">◆</span>
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
                        <div
                            key={rating.percent}
                            className={`p-3 rounded-lg border ${isSupported ? 'border-2' : ''} ${getRatingRowColor(rating.percent, isSupported)}`}
                        >
                          <div className="flex items-center gap-3">
                            <div className={`w-14 text-center font-bold ${isSupported ? 'text-gray-900 dark:text-white' : 'text-gray-500 dark:text-gray-400'}`}>
                              {rating.percent}%
                            </div>
                            <div className={`flex-1 text-sm ${isSupported ? 'text-gray-900 dark:text-white' : 'text-gray-500 dark:text-gray-400'}`}>
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

              {/* ABI Reference Guide */}
              <div className="bg-gray-50 dark:bg-gray-700/30 rounded-lg p-4">
                <h4 className="font-medium text-gray-900 dark:text-white mb-2 text-center">ABI Reference Guide</h4>
                <div className="grid grid-cols-2 md:grid-cols-5 gap-2 text-xs">
                  <div className="bg-green-100 dark:bg-green-900/30 p-2 rounded text-center">
                    <div className="font-bold text-green-700 dark:text-green-400">≥1.0</div>
                    <div className="text-green-600 dark:text-green-300">Normal</div>
                  </div>
                  <div className="bg-yellow-100 dark:bg-yellow-900/30 p-2 rounded text-center">
                    <div className="font-bold text-yellow-700 dark:text-yellow-400">0.9-0.99</div>
                    <div className="text-yellow-600 dark:text-yellow-300">20%</div>
                  </div>
                  <div className="bg-amber-100 dark:bg-amber-900/30 p-2 rounded text-center">
                    <div className="font-bold text-amber-700 dark:text-amber-400">0.5-0.7</div>
                    <div className="text-amber-600 dark:text-amber-300">40%</div>
                  </div>
                  <div className="bg-orange-100 dark:bg-orange-900/30 p-2 rounded text-center">
                    <div className="font-bold text-orange-700 dark:text-orange-400">0.4-0.5</div>
                    <div className="text-orange-600 dark:text-orange-300">60%</div>
                  </div>
                  <div className="bg-red-100 dark:bg-red-900/30 p-2 rounded text-center">
                    <div className="font-bold text-red-700 dark:text-red-400">≤0.4</div>
                    <div className="text-red-600 dark:text-red-300">100%</div>
                  </div>
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
                  <span>ℹ️</span>
                  Important Information
                </h4>
                <ul className="text-sm text-blue-800 dark:text-blue-300 space-y-1 list-disc list-inside">
                  <li>Each affected extremity is rated separately and combined</li>
                  <li>ABI measurement provides objective evidence for rating</li>
                  <li>Claudication distance should be documented consistently</li>
                  <li>Request vascular studies (Doppler) if not done recently</li>
                </ul>
              </div>

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