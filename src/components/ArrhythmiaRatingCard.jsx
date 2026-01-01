import { ChevronDown, ChevronUp } from 'lucide-react';
import { SVT_CRITERIA, VENTRICULAR_ARRHYTHMIA_CRITERIA, getRatingRowColor, getRatingTextColor } from '../utils/ratingCriteria';
import UnderstandingYourRating from './UnderstandingYourRating';
import ServiceConnectedBanner from './ServiceConnectedBanner';

export default function ArrhythmiaRatingCard({ analysis, expanded, onToggle }) {
  if (!analysis || !analysis.hasData) return null;

  const { supportedRating, rationale, evidenceGaps, metrics, condition, diagnosticCode } = analysis;

  // Determine which criteria to use based on condition
  const isVentricular = condition?.includes('Ventricular') || diagnosticCode === '7011';
  const criteria = isVentricular ? VENTRICULAR_ARRHYTHMIA_CRITERIA : SVT_CRITERIA;
  const conditionName = isVentricular ? 'Ventricular Arrhythmias' : 'Supraventricular Tachycardia';
  const dcCode = isVentricular ? '7011' : '7010';

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
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden border-l-4 border-rose-500">
        <button onClick={onToggle} className="w-full px-6 py-4 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
          <div className="flex items-center gap-3">
            <span className="text-2xl">💓</span>
            <div className="text-left">
              <h3 className="font-semibold text-lg text-gray-900 dark:text-white">{conditionName}</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">DC {dcCode} - 38 CFR 4.104</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right">
              <div className={`text-2xl font-bold ${getRatingTextColor(supportedRating)}`}>
                {supportedRating !== null ? `${supportedRating}%` : 'N/A'}</div>
              <div className="text-xs text-gray-500 dark:text-gray-400">Supported Rating</div>
            </div>
            {expanded ? <ChevronUp className="w-5 h-5 text-gray-400" /> : <ChevronDown className="w-5 h-5 text-gray-400" />}
          </div>
        </button>

        {expanded && (
            <div className="px-6 pb-6 space-y-6">
              <div className="border-t border-gray-200 dark:border-gray-700" />

              {/* Service-Connected Status Banner */}
              <ServiceConnectedBanner
                  conditionKey="arrhythmia"
                  currentAnalysis={analysis}
              />

              {/* AICD Alert for Ventricular */}
              {metrics?.hasAICD && (
                  <div className="bg-red-100 dark:bg-red-900/30 border border-red-300 dark:border-red-700 p-3 rounded-lg">
                    <p className="text-sm font-medium text-red-800 dark:text-red-200">
                      ⚡ AICD (Implantable Defibrillator) in place - Supports 100% rating
                    </p>
                    {metrics.aicdShocks > 0 && (
                        <p className="text-xs text-red-700 dark:text-red-300 mt-1">
                          {metrics.aicdShocks} shock(s) delivered during evaluation period
                        </p>
                    )}
                  </div>
              )}

              {/* Evidence Summary */}
              <div>
                <h4 className="font-medium text-gray-900 dark:text-white mb-3 text-center">Evidence Summary</h4>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg text-center">
                    <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">{metrics?.totalLogs || 0}</div>
                    <div className="text-xs text-blue-700 dark:text-blue-300">Total Episodes</div>
                  </div>
                  <div className={`p-3 rounded-lg text-center ${metrics?.treatmentInterventions > 0 ? 'bg-purple-50 dark:bg-purple-900/20' : 'bg-gray-50 dark:bg-gray-700/30'}`}>
                    <div className={`text-2xl font-bold ${metrics?.treatmentInterventions > 0 ? 'text-purple-600 dark:text-purple-400' : 'text-gray-400'}`}>
                      {metrics?.treatmentInterventions || 0}
                    </div>
                    <div className="text-xs text-gray-600 dark:text-gray-400">Treatments</div>
                  </div>
                  <div className={`p-3 rounded-lg text-center ${metrics?.hospitalizations > 0 ? 'bg-red-50 dark:bg-red-900/20' : 'bg-gray-50 dark:bg-gray-700/30'}`}>
                    <div className={`text-2xl font-bold ${metrics?.hospitalizations > 0 ? 'text-red-600 dark:text-red-400' : 'text-gray-400'}`}>
                      {metrics?.hospitalizations || 0}
                    </div>
                    <div className="text-xs text-gray-600 dark:text-gray-400">Hospitalizations</div>
                  </div>
                  <div className={`p-3 rounded-lg text-center ${(metrics?.cardioversions > 0 || metrics?.ablations > 0) ? 'bg-orange-50 dark:bg-orange-900/20' : 'bg-gray-50 dark:bg-gray-700/30'}`}>
                    <div className={`text-2xl font-bold ${(metrics?.cardioversions > 0 || metrics?.ablations > 0) ? 'text-orange-600 dark:text-orange-400' : 'text-gray-400'}`}>
                      {(metrics?.cardioversions || 0) + (metrics?.ablations || 0)}
                    </div>
                    <div className="text-xs text-gray-600 dark:text-gray-400">Procedures</div>
                  </div>
                </div>
              </div>

              {/* Treatment Breakdown */}
              {(metrics?.ivTreatments > 0 || metrics?.vagalManeuvers > 0 || metrics?.oralTreatments > 0) && (
                  <div>
                    <h4 className="font-medium text-gray-900 dark:text-white mb-2 text-center">Treatment Breakdown</h4>
                    <div className="grid grid-cols-3 gap-2">
                      <div className="bg-green-50 dark:bg-green-900/20 p-2 rounded text-center">
                        <div className="text-lg font-bold text-green-600 dark:text-green-400">{metrics?.vagalManeuvers || 0}</div>
                        <div className="text-xs text-gray-600 dark:text-gray-400">Vagal</div>
                      </div>
                      <div className="bg-amber-50 dark:bg-amber-900/20 p-2 rounded text-center">
                        <div className="text-lg font-bold text-amber-600 dark:text-amber-400">{metrics?.oralTreatments || 0}</div>
                        <div className="text-xs text-gray-600 dark:text-gray-400">Oral Meds</div>
                      </div>
                      <div className="bg-red-50 dark:bg-red-900/20 p-2 rounded text-center">
                        <div className="text-lg font-bold text-red-600 dark:text-red-400">{metrics?.ivTreatments || 0}</div>
                        <div className="text-xs text-gray-600 dark:text-gray-400">IV Meds</div>
                      </div>
                    </div>
                  </div>
              )}

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

              <UnderstandingYourRating
                  diagnosticCode="7010"
                  currentRating={supportedRating}
              />

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
                  {isVentricular ? (
                      <>
                        <li className="text-sm text-blue-800 dark:text-blue-300 flex items-start gap-2"><span className="text-blue-500 mt-0.5">•</span><span>AICD implantation automatically supports 100% rating</span></li>
                        <li className="text-sm text-blue-800 dark:text-blue-300 flex items-start gap-2"><span className="text-blue-500 mt-0.5">•</span><span>Document all episodes requiring medical intervention</span></li>
                        <li className="text-sm text-blue-800 dark:text-blue-300 flex items-start gap-2"><span className="text-blue-500 mt-0.5">•</span><span>Keep records of Holter monitor and electrophysiology studies</span></li>
                      </>
                  ) : (
                      <>
                        <li className="text-sm text-blue-800 dark:text-blue-300 flex items-start gap-2"><span className="text-blue-500 mt-0.5">•</span><span>Document frequency of paroxysmal episodes</span></li>
                        <li className="text-sm text-blue-800 dark:text-blue-300 flex items-start gap-2"><span className="text-blue-500 mt-0.5">•</span><span>Track all treatments: vagal maneuvers, medications, cardioversion</span></li>
                        <li className="text-sm text-blue-800 dark:text-blue-300 flex items-start gap-2"><span className="text-blue-500 mt-0.5">•</span><span>Episodes requiring IV meds or cardioversion support 30% rating</span></li>
                      </>
                  )}
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