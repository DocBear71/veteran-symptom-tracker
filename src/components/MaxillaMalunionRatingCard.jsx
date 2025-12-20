import {ChevronDown, ChevronUp} from 'lucide-react';

export default function MaxillaMalunionRatingCard({
                                                    analysis,
                                                    expanded,
                                                    onToggle,
                                                  }) {
  if (!analysis || !analysis.hasData) return null;
  const {supportedRating, rationale, evidenceGaps, metrics} = analysis;

  // Normalize rating for comparison (handles string vs number)
  const normalizeRating = (rating) => {
    if (rating === null || rating === undefined) return null;
    if (typeof rating === 'number') return rating;
    if (typeof rating === 'string') return parseInt(rating, 10);
    return null;
  };

  const numericRating = normalizeRating(supportedRating);
  const isRatingSupported = (p) => numericRating === p;

  // Standardized color scheme across all rating cards
  // 0% gets a distinct "supported but minimal" style visible in both light/dark modes
  const getRatingRowColor = (percent, isSupported) => {
    if (!isSupported) return 'bg-gray-50 dark:bg-gray-700/30 border-gray-200 dark:border-gray-600';
    if (percent >= 100) return 'bg-red-100 dark:bg-red-900/30 border-red-300 dark:border-red-700';
    if (percent >= 70) return 'bg-orange-100 dark:bg-orange-900/30 border-orange-300 dark:border-orange-700';
    if (percent >= 50) return 'bg-amber-100 dark:bg-amber-900/30 border-amber-300 dark:border-amber-700';
    if (percent >= 30) return 'bg-yellow-100 dark:bg-yellow-900/30 border-yellow-300 dark:border-yellow-700';
    if (percent >= 10) return 'bg-green-100 dark:bg-green-900/30 border-green-300 dark:border-green-700';
    // 0-9%: Blue-gray that's visible in both light and dark modes
    return 'bg-blue-50 dark:bg-blue-900/30 border-blue-200 dark:border-blue-700';
  };

  const ratings = [
    {percent: 50, summary: 'Severe displacement'},
    {percent: 30, summary: 'Moderate displacement'},
    {percent: 10, summary: 'Slight displacement'},
  ];

  return (
      <div
          className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden border-l-4 border-cyan-500">
        <button onClick={onToggle}
                className="w-full px-6 py-4 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
          <div className="flex items-center gap-3"><span
              className="text-2xl">🦴</span>
            <div className="text-left"><h3
                className="font-semibold text-lg text-gray-900 dark:text-white">Maxilla
              Malunion</h3><p
                className="text-sm text-gray-600 dark:text-gray-400">DC 9914 -
              38 CFR 4.150</p></div>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right">
              <div
                  className="text-2xl font-bold text-cyan-600 dark:text-cyan-400">{supportedRating !==
              null ? `${supportedRating}%` : 'N/A'}</div>
              <div
                  className="text-xs text-gray-500 dark:text-gray-400">Supported
                Rating
              </div>
            </div>
            {expanded ?
                <ChevronUp className="w-5 h-5 text-gray-400"/> :
                <ChevronDown className="w-5 h-5 text-gray-400"/>}</div>
        </button>
        {expanded && (
            <div className="px-6 pb-6 space-y-6">
              <div className="border-t border-gray-200 dark:border-gray-700"/>
              <div><h4
                  className="font-medium text-gray-900 dark:text-white mb-3 text-center">Evidence
                Summary</h4>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  <div
                      className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg text-center">
                    <div
                        className="text-2xl font-bold text-blue-600 dark:text-blue-400">{metrics?.totalLogs ||
                        0}</div>
                    <div
                        className="text-xs text-blue-700 dark:text-blue-300">Total
                      Logs
                    </div>
                  </div>
                  <div
                      className={`p-3 rounded-lg text-center ${metrics?.displacement ?
                          'bg-red-50 dark:bg-red-900/20' :
                          'bg-gray-50 dark:bg-gray-700/30'}`}>
                    <div className={`text-lg font-bold ${metrics?.displacement ?
                        'text-red-600 dark:text-red-400' :
                        'text-gray-400'}`}>{metrics?.displacement || '—'}</div>
                    <div
                        className="text-xs text-gray-600 dark:text-gray-400">Displacement
                    </div>
                  </div>
                  <div
                      className={`p-3 rounded-lg text-center ${metrics?.chewingDifficulty ?
                          'bg-purple-50 dark:bg-purple-900/20' :
                          'bg-gray-50 dark:bg-gray-700/30'}`}>
                    <div
                        className={`text-2xl font-bold ${metrics?.chewingDifficulty ?
                            'text-purple-600 dark:text-purple-400' :
                            'text-gray-400'}`}>{metrics?.chewingDifficulty ?
                        '✓' :
                        '—'}</div>
                    <div
                        className="text-xs text-gray-600 dark:text-gray-400">Chewing
                      Issues
                    </div>
                  </div>
                  <div
                      className={`p-3 rounded-lg text-center ${metrics?.painDays >
                      0 ?
                          'bg-orange-50 dark:bg-orange-900/20' :
                          'bg-gray-50 dark:bg-gray-700/30'}`}>
                    <div
                        className={`text-2xl font-bold ${metrics?.painDays > 0 ?
                            'text-orange-600 dark:text-orange-400' :
                            'text-gray-400'}`}>{metrics?.painDays || 0}</div>
                    <div
                        className="text-xs text-gray-600 dark:text-gray-400">Pain
                      Days
                    </div>
                  </div>
                </div>
              </div>
              {rationale?.length > 0 && (<div><h4
                  className="font-medium text-gray-900 dark:text-white mb-2 text-center">Analysis
                Rationale</h4>
                <div
                    className="bg-gray-50 dark:bg-gray-700/30 rounded-lg p-3 space-y-2">{rationale.map(
                    (item, idx) => (
                        <div key={idx} className="flex items-start gap-2"><span
                            className="text-blue-600 dark:text-blue-400 mt-0.5">◆</span><span
                            className="text-sm text-gray-700 dark:text-gray-300">{item}</span>
                        </div>))}</div>
              </div>)}
              <div><h4
                  className="font-medium text-gray-900 dark:text-white mb-2 text-center">VA
                Rating Schedule</h4>
                <div className="space-y-2">{ratings.map(r => {
                  const s = isRatingSupported(r.percent);
                  return (<div key={r.percent}
                               className={`p-3 rounded-lg border ${s ?
                                   'border-2' :
                                   ''} ${getRatingRowColor(r.percent, s)}`}>
                    <div className="flex items-center gap-3">
                      <div className={`w-14 text-center font-bold ${s ?
                          'text-gray-900 dark:text-white' :
                          'text-gray-500 dark:text-gray-400'}`}>{r.percent}%
                      </div>
                      <div className={`flex-1 text-sm ${s ?
                          'text-gray-900 dark:text-white' :
                          'text-gray-500 dark:text-gray-400'}`}>{r.summary}</div>
                      {s && <span
                          className="text-green-600 dark:text-green-400">✓</span>}
                    </div>
                  </div>);
                })}</div>
              </div>
              {evidenceGaps?.length > 0 && (<div><h4
                  className="font-medium text-gray-900 dark:text-white mb-2 text-center">Documentation
                Gaps</h4>
                <div
                    className="bg-amber-50 dark:bg-amber-900/20 rounded-lg p-3 space-y-2">{evidenceGaps.map(
                    (gap, idx) => (
                        <div key={idx} className="flex items-start gap-2"><span
                            className="text-amber-600 dark:text-amber-400 mt-0.5">⚠</span><span
                            className="text-sm text-gray-700 dark:text-gray-300">{gap}</span>
                        </div>))}</div>
              </div>)}
              <div
                  className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg border border-blue-200 dark:border-blue-800">
                <h4 className="font-semibold text-blue-900 dark:text-blue-200 mb-2 flex items-center gap-2">
                  <span>ℹ️</span>Important Information</h4>
                <ul className="space-y-1">
                  <li className="text-sm text-blue-800 dark:text-blue-300 flex items-start gap-2">
                    <span className="text-blue-500 mt-0.5">•</span><span>Document degree of maxilla displacement</span>
                  </li>
                  <li className="text-sm text-blue-800 dark:text-blue-300 flex items-start gap-2">
                    <span className="text-blue-500 mt-0.5">•</span><span>Track impact on chewing and bite alignment</span>
                  </li>
                </ul>
              </div>
              <div
                  className="bg-gray-100 dark:bg-gray-700/50 rounded-lg p-3 text-xs text-gray-600 dark:text-gray-400">
                <strong>Important:</strong> Based on 38 CFR 4.150, DC 9914. For
                documentation purposes only.
              </div>
            </div>
        )}
      </div>
  );
}