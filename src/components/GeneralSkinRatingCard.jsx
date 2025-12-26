import { ChevronDown, ChevronUp } from 'lucide-react';
import {
  DISCOID_LUPUS_CRITERIA,
  BULLOUS_DISORDERS_CRITERIA,
  CUTANEOUS_VASCULITIS_CRITERIA,
  DERMATOPHYTOSIS_CRITERIA,
  SKIN_INFECTIONS_CRITERIA,
  GENERAL_SKIN_FORMULA_CRITERIA, getRatingRowColor, getRatingTextColor,
} from '../utils/ratingCriteria';
import UnderstandingYourRating from './UnderstandingYourRating.jsx';

/**
 * General Skin Rating Card Component - Gold Standard Version
 * Reusable card for skin conditions rated under General Rating Formula for the Skin
 *
 * Supports:
 * - Discoid Lupus Erythematosus (DC 7809)
 * - Bullous Disorders (DC 7815)
 * - Primary Cutaneous Vasculitis (DC 7826)
 * - Dermatophytosis (DC 7813)
 * - Skin Infections (DC 7820)
 *
 * Based on 38 CFR 4.118
 */

// Map condition to criteria and display settings
const CONDITION_CONFIG = {
  'Discoid Lupus Erythematosus': {
    criteria: DISCOID_LUPUS_CRITERIA,
    icon: '🦋',
    shortName: 'Discoid Lupus',
  },
  'Bullous Disorders': {
    criteria: BULLOUS_DISORDERS_CRITERIA,
    icon: '💧',
    shortName: 'Bullous Disorders',
  },
  'Primary Cutaneous Vasculitis': {
    criteria: CUTANEOUS_VASCULITIS_CRITERIA,
    icon: '🩸',
    shortName: 'Cutaneous Vasculitis',
  },
  'Dermatophytosis': {
    criteria: DERMATOPHYTOSIS_CRITERIA,
    icon: '🍄',
    shortName: 'Dermatophytosis',
  },
  'Skin Infections': {
    criteria: SKIN_INFECTIONS_CRITERIA,
    icon: '🦠',
    shortName: 'Skin Infections',
  },
};

export default function GeneralSkinRatingCard({ analysis, expanded, onToggle }) {
  if (!analysis || !analysis.hasData) return null;

  const { supportedRating, ratingRationale, gaps, metrics, condition, diagnosticCode } = analysis;

  // Get condition-specific config
  const config = CONDITION_CONFIG[condition] || {
    criteria: GENERAL_SKIN_FORMULA_CRITERIA,
    icon: '🩹',
    shortName: condition,
  };

  const criteria = config.criteria;

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

  const totalLogs = metrics?.totalLogs || 0;
  const bodyPercentage = metrics?.bodyPercentage || 'Not documented';
  const treatmentLevel = metrics?.treatmentLevel || 'Not documented';

  // Format treatment level for display
  const formatTreatmentLevel = (level) => {
    const labels = {
      'constant': 'Constant Systemic',
      '6weeks': 'Systemic >=6 Weeks',
      'intermittent': 'Intermittent Systemic',
      'topical': 'Topical Only',
      'refractory': 'Refractory',
      'continuous': 'Continuous Systemic',
      'none': 'No Systemic',
    };
    return labels[level] || level || 'Not documented';
  };

  // Determine if this is a vasculitis card (different rating structure)
  const isVasculitis = condition === 'Primary Cutaneous Vasculitis';

  return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden border-l-4 border-orange-500">
        {/* === COLLAPSED HEADER === */}
        <button
            onClick={onToggle}
            className="w-full px-6 py-4 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
        >
          <div className="flex items-center gap-3">
            <span className="text-2xl">{config.icon}</span>
            <div className="text-left">
              <h3 className="font-semibold text-lg text-gray-900 dark:text-white">
                {config.shortName}
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                DC {diagnosticCode} - 38 CFR 4.118
              </p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right">
              <div className={`text-2xl font-bold ${getRatingTextColor(supportedRating)}`}>
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

              {/* Section 1: Evidence Summary */}
              <div>
                <h4 className="font-medium text-gray-900 dark:text-white mb-3 text-center">
                  Evidence Summary
                </h4>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {/* Total Logs */}
                  <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg text-center">
                    <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                      {totalLogs}
                    </div>
                    <div className="text-xs text-blue-700 dark:text-blue-300">Total Logs</div>
                  </div>

                  {/* Body Percentage - Not shown for vasculitis */}
                  {!isVasculitis && (
                      <div className={`p-3 rounded-lg text-center ${
                          bodyPercentage !== 'Not documented'
                              ? 'bg-orange-50 dark:bg-orange-900/20'
                              : 'bg-gray-50 dark:bg-gray-700/30'
                      }`}>
                        <div className={`text-lg font-bold ${
                            bodyPercentage !== 'Not documented'
                                ? 'text-orange-600 dark:text-orange-400'
                                : 'text-gray-400'
                        }`}>
                          {bodyPercentage}
                        </div>
                        <div className="text-xs text-gray-600 dark:text-gray-400">Body Affected</div>
                      </div>
                  )}

                  {/* Treatment Level */}
                  <div className={`p-3 rounded-lg text-center ${
                      treatmentLevel !== 'Not documented'
                          ? 'bg-purple-50 dark:bg-purple-900/20'
                          : 'bg-gray-50 dark:bg-gray-700/30'
                  }`}>
                    <div className={`text-sm font-bold ${
                        treatmentLevel !== 'Not documented'
                            ? 'text-purple-600 dark:text-purple-400'
                            : 'text-gray-400'
                    }`}>
                      {formatTreatmentLevel(treatmentLevel)}
                    </div>
                    <div className="text-xs text-gray-600 dark:text-gray-400">Treatment</div>
                  </div>

                  {/* Vasculitis-specific: Episode Frequency */}
                  {isVasculitis && metrics?.episodeFrequency && (
                      <div className="bg-red-50 dark:bg-red-900/20 p-3 rounded-lg text-center">
                        <div className="text-lg font-bold text-red-600 dark:text-red-400">
                          {metrics.episodeFrequency === '4+' ? '4+' : metrics.episodeFrequency === '1-3' ? '1-3' : '—'}
                        </div>
                        <div className="text-xs text-gray-600 dark:text-gray-400">Episodes/Year</div>
                      </div>
                  )}

                  {/* Vasculitis-specific: Refractory */}
                  {isVasculitis && metrics?.isRefractory && (
                      <div className="bg-amber-50 dark:bg-amber-900/20 p-3 rounded-lg text-center">
                        <div className="text-lg font-bold text-amber-600 dark:text-amber-400">
                          Yes
                        </div>
                        <div className="text-xs text-gray-600 dark:text-gray-400">Refractory</div>
                      </div>
                  )}
                </div>

                {/* Condition-specific metrics */}
                {renderConditionSpecificMetrics(condition, metrics)}
              </div>

              {/* Section 2: Analysis Rationale */}
              {ratingRationale && ratingRationale.length > 0 && (
                  <div>
                    <h4 className="font-medium text-gray-900 dark:text-white mb-2 text-center">
                      Analysis Rationale
                    </h4>
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
                  diagnosticCode={diagnosticCode}
                  currentRating={supportedRating}
              />

              {/* Section 3: VA Rating Schedule */}
              <div>
                <h4 className="font-medium text-gray-900 dark:text-white mb-2 text-center">
                  VA Rating Schedule - {config.shortName}
                </h4>
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
                            {isSupported && (
                                <span className="text-green-600 dark:text-green-400">✓</span>
                            )}
                          </div>
                        </div>
                    );
                  })}
                </div>
              </div>

              {/* Section 4: Documentation Gaps */}
              {gaps && gaps.length > 0 && (
                  <div>
                    <h4 className="font-medium text-gray-900 dark:text-white mb-2 text-center">
                      Documentation Gaps
                    </h4>
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

              {/* Section 5: Important Information */}
              <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg border border-blue-200 dark:border-blue-800">
                <h4 className="font-semibold text-blue-900 dark:text-blue-200 mb-2 flex items-center gap-2">
                  <span>ℹ️</span>
                  Important Information
                </h4>
                <ul className="space-y-1">
                  {renderConditionSpecificNotes(condition, metrics)}
                </ul>
              </div>

              {/* Section 6: Disclaimer */}
              <div className="bg-gray-100 dark:bg-gray-700/50 rounded-lg p-3 text-xs text-gray-600 dark:text-gray-400">
                <strong>Important:</strong> Based on 38 CFR 4.118, Diagnostic Code {diagnosticCode} - {condition}.
                {!isVasculitis && ' Uses the General Rating Formula for the Skin.'}
                {' '}This analysis is for documentation purposes only. The VA makes all final rating determinations.
              </div>
            </div>
        )}
      </div>
  );
}

/**
 * Render condition-specific metrics in the Evidence Summary section
 */
function renderConditionSpecificMetrics(condition, metrics) {
  if (!metrics) return null;

  switch (condition) {
    case 'Discoid Lupus Erythematosus':
      return (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-3">
            <MetricBox
                value={metrics.discoidLesionsLogs || 0}
                label="Discoid Lesions"
                highlight={metrics.discoidLesionsLogs > 0}
            />
            <MetricBox
                value={metrics.scarringLogs || 0}
                label="Scarring"
                highlight={metrics.scarringLogs > 0}
                color="purple"
            />
            <MetricBox
                value={metrics.faceLogs || 0}
                label="Face Involvement"
                highlight={metrics.faceLogs > 0}
                color="amber"
            />
            <MetricBox
                value={metrics.photosensitivityLogs || 0}
                label="Photosensitivity"
                highlight={metrics.photosensitivityLogs > 0}
                color="yellow"
            />
          </div>
      );

    case 'Bullous Disorders':
      return (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-3">
            <MetricBox
                value={metrics.blistersLogs || 0}
                label="Blisters"
                highlight={metrics.blistersLogs > 0}
            />
            <MetricBox
                value={metrics.erosionsLogs || 0}
                label="Erosions"
                highlight={metrics.erosionsLogs > 0}
                color="red"
            />
            <MetricBox
                value={metrics.nikolskyLogs || 0}
                label="Nikolsky Sign"
                highlight={metrics.nikolskyLogs > 0}
                color="amber"
            />
            <MetricBox
                value={metrics.hasMucosalInvolvement ? 'Yes' : 'No'}
                label="Mucosal"
                highlight={metrics.hasMucosalInvolvement}
                color="purple"
            />
          </div>
      );

    case 'Primary Cutaneous Vasculitis':
      return (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-3">
            <MetricBox
                value={metrics.purpuraLogs || 0}
                label="Purpura"
                highlight={metrics.purpuraLogs > 0}
                color="purple"
            />
            <MetricBox
                value={metrics.ulcersLogs || 0}
                label="Ulcers"
                highlight={metrics.ulcersLogs > 0}
                color="red"
            />
            <MetricBox
                value={metrics.necrosisLogs || 0}
                label="Necrosis"
                highlight={metrics.necrosisLogs > 0}
                color="rose"
            />
            <MetricBox
                value={metrics.scarringLogs || 0}
                label="Scarring"
                highlight={metrics.scarringLogs > 0}
                color="amber"
            />
          </div>
      );

    case 'Dermatophytosis':
      const fungalTypes = [];
      if (metrics.tineaPedisLogs > 0) fungalTypes.push("Athlete's Foot");
      if (metrics.onychomycosisLogs > 0) fungalTypes.push('Nail Fungus');
      if (metrics.tineaCorporisLogs > 0) fungalTypes.push('Body');
      if (metrics.tineaCrurisLogs > 0) fungalTypes.push('Jock Itch');

      return (
          <div className="space-y-3 mt-3">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <MetricBox
                  value={metrics.onychomycosisLogs || 0}
                  label="Nail Fungus"
                  highlight={metrics.onychomycosisLogs > 0}
                  color="amber"
              />
              <MetricBox
                  value={metrics.tineaPedisLogs || 0}
                  label="Athlete's Foot"
                  highlight={metrics.tineaPedisLogs > 0}
              />
              <MetricBox
                  value={metrics.recurrentLogs || 0}
                  label="Recurrent"
                  highlight={metrics.recurrentLogs > 0}
                  color="red"
              />
              <MetricBox
                  value={metrics.itchingLogs || 0}
                  label="Itching"
                  highlight={metrics.itchingLogs > 0}
                  color="orange"
              />
            </div>
            {fungalTypes.length > 0 && (
                <div className="bg-gray-50 dark:bg-gray-700/30 rounded-lg p-2">
                  <span className="text-xs text-gray-600 dark:text-gray-400">Types: </span>
                  <span className="text-xs text-gray-800 dark:text-gray-200">{fungalTypes.join(', ')}</span>
                </div>
            )}
          </div>
      );

    case 'Skin Infections':
      const infectionTypes = [];
      if (metrics.cellulitisLogs > 0) infectionTypes.push('Cellulitis');
      if (metrics.abscessLogs > 0) infectionTypes.push('Abscess');
      if (metrics.herpesZosterLogs > 0) infectionTypes.push('Shingles');
      if (metrics.herpesSimplexLogs > 0) infectionTypes.push('Herpes');
      if (metrics.folliculitisLogs > 0) infectionTypes.push('Folliculitis');

      return (
          <div className="space-y-3 mt-3">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <MetricBox
                  value={metrics.cellulitisLogs || 0}
                  label="Cellulitis"
                  highlight={metrics.cellulitisLogs > 0}
                  color="red"
              />
              <MetricBox
                  value={metrics.abscessLogs || 0}
                  label="Abscess"
                  highlight={metrics.abscessLogs > 0}
                  color="amber"
              />
              <MetricBox
                  value={metrics.herpesZosterLogs || 0}
                  label="Shingles"
                  highlight={metrics.herpesZosterLogs > 0}
                  color="purple"
              />
              <MetricBox
                  value={metrics.recurrentLogs || 0}
                  label="Recurrent"
                  highlight={metrics.recurrentLogs > 0}
                  color="rose"
              />
            </div>
            {infectionTypes.length > 0 && (
                <div className="bg-gray-50 dark:bg-gray-700/30 rounded-lg p-2">
                  <span className="text-xs text-gray-600 dark:text-gray-400">Types: </span>
                  <span className="text-xs text-gray-800 dark:text-gray-200">{infectionTypes.join(', ')}</span>
                </div>
            )}
          </div>
      );

    default:
      return null;
  }
}

/**
 * Render condition-specific notes in the Important Information section
 */
function renderConditionSpecificNotes(condition, metrics) {
  const commonNotes = [
    <li key="body" className="text-sm text-blue-800 dark:text-blue-300 flex items-start gap-2">
      <span className="text-blue-500 mt-0.5">•</span>
      <span>Document body surface area percentage for accurate rating</span>
    </li>,
    <li key="treatment" className="text-sm text-blue-800 dark:text-blue-300 flex items-start gap-2">
      <span className="text-blue-500 mt-0.5">•</span>
      <span>Treatment level (topical vs systemic) is a key rating criterion</span>
    </li>,
    <li key="scars" className="text-sm text-blue-800 dark:text-blue-300 flex items-start gap-2">
      <span className="text-blue-500 mt-0.5">•</span>
      <span>Scarring/disfigurement may qualify for separate rating under DC 7800-7805</span>
    </li>,
  ];

  switch (condition) {
    case 'Discoid Lupus Erythematosus':
      return [
        ...commonNotes,
        <li key="dle1" className="text-sm text-blue-800 dark:text-blue-300 flex items-start gap-2">
          <span className="text-blue-500 mt-0.5">•</span>
          <span>Do NOT combine with systemic lupus (DC 6350) ratings</span>
        </li>,
        <li key="dle2" className="text-sm text-blue-800 dark:text-blue-300 flex items-start gap-2">
          <span className="text-blue-500 mt-0.5">•</span>
          <span>Scalp involvement with hair loss may rate under DC 7830</span>
        </li>,
      ];

    case 'Bullous Disorders':
      return [
        ...commonNotes,
        <li key="bull1" className="text-sm text-blue-800 dark:text-blue-300 flex items-start gap-2">
          <span className="text-blue-500 mt-0.5">•</span>
          <span>Mucosal involvement (oral, ocular, GI, GU) rates SEPARATELY</span>
        </li>,
        <li key="bull2" className="text-sm text-blue-800 dark:text-blue-300 flex items-start gap-2">
          <span className="text-blue-500 mt-0.5">•</span>
          <span>Biopsy confirmation strengthens claim significantly</span>
        </li>,
      ];

    case 'Primary Cutaneous Vasculitis':
      return [
        <li key="cv1" className="text-sm text-blue-800 dark:text-blue-300 flex items-start gap-2">
          <span className="text-blue-500 mt-0.5">•</span>
          <span>Episodes must be medically DOCUMENTED for rating purposes</span>
        </li>,
        <li key="cv2" className="text-sm text-blue-800 dark:text-blue-300 flex items-start gap-2">
          <span className="text-blue-500 mt-0.5">•</span>
          <span>60% requires refractory disease despite continuous immunosuppression</span>
        </li>,
        <li key="cv3" className="text-sm text-blue-800 dark:text-blue-300 flex items-start gap-2">
          <span className="text-blue-500 mt-0.5">•</span>
          <span>30% requires 4+ episodes/year with intermittent immunosuppressive therapy</span>
        </li>,
        <li key="cv4" className="text-sm text-blue-800 dark:text-blue-300 flex items-start gap-2">
          <span className="text-blue-500 mt-0.5">•</span>
          <span>Alternative rating as disfigurement (DC 7800) or scars may be higher</span>
        </li>,
      ];

    case 'Dermatophytosis':
      return [
        ...commonNotes,
        <li key="derm1" className="text-sm text-blue-800 dark:text-blue-300 flex items-start gap-2">
          <span className="text-blue-500 mt-0.5">•</span>
          <span>Nail fungus often requires 3-6 months of oral antifungal therapy</span>
        </li>,
        <li key="derm2" className="text-sm text-blue-800 dark:text-blue-300 flex items-start gap-2">
          <span className="text-blue-500 mt-0.5">•</span>
          <span>Document recurrent infections and treatment failures</span>
        </li>,
      ];

    case 'Skin Infections':
      return [
        ...commonNotes,
        <li key="skinf1" className="text-sm text-blue-800 dark:text-blue-300 flex items-start gap-2">
          <span className="text-blue-500 mt-0.5">•</span>
          <span>Post-herpetic neuralgia from shingles may warrant separate neurological rating</span>
        </li>,
        <li key="skinf2" className="text-sm text-blue-800 dark:text-blue-300 flex items-start gap-2">
          <span className="text-blue-500 mt-0.5">•</span>
          <span>Document each infection episode with dates and treatment</span>
        </li>,
      ];

    default:
      return commonNotes;
  }
}

/**
 * Reusable metric box component
 */
function MetricBox({ value, label, highlight = false, color = 'orange' }) {
  const colorClasses = {
    orange: highlight ? 'bg-orange-50 dark:bg-orange-900/20 text-orange-600 dark:text-orange-400' : '',
    purple: highlight ? 'bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400' : '',
    amber: highlight ? 'bg-amber-50 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400' : '',
    yellow: highlight ? 'bg-yellow-50 dark:bg-yellow-900/20 text-yellow-600 dark:text-yellow-400' : '',
    red: highlight ? 'bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400' : '',
    rose: highlight ? 'bg-rose-50 dark:bg-rose-900/20 text-rose-600 dark:text-rose-400' : '',
    green: highlight ? 'bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400' : '',
  };

  const bgClass = highlight
      ? colorClasses[color]
      : 'bg-gray-50 dark:bg-gray-700/30';

  const textClass = highlight
      ? colorClasses[color]?.split(' ').filter(c => c.includes('text-')).join(' ')
      : 'text-gray-400';

  return (
      <div className={`p-3 rounded-lg text-center ${bgClass}`}>
        <div className={`text-xl font-bold ${textClass}`}>
          {value}
        </div>
        <div className="text-xs text-gray-600 dark:text-gray-400">{label}</div>
      </div>
  );
}