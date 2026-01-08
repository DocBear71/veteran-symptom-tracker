// ============================================
// SecondaryConditionsGuide.jsx
// Phase 15B: Main component for displaying secondary conditions
// ============================================

import { useState, useMemo } from 'react';
import { ChevronDown, ChevronUp, Link2, AlertCircle, FileText, ExternalLink, Info, CheckCircle, Circle } from 'lucide-react';
import { useProfile } from '../hooks/useProfile';

// Import criteria objects that have secondaryConditions data
import {
  DIABETES_CRITERIA,
  PTSD_CRITERIA,
  TINNITUS_CRITERIA,
  SLEEP_APNEA_CRITERIA,
  FIBROMYALGIA_CRITERIA,
  HYPERTENSION_CRITERIA,
  PERIPHERAL_NEUROPATHY_CRITERIA,
  PARKINSONS_DISEASE_CRITERIA,
  MULTIPLE_SCLEROSIS_CRITERIA,
  ALS_CRITERIA,
} from '../utils/ratingCriteria';

// Map of condition IDs to their criteria objects (only those with secondaryConditions)
const SECONDARY_CONDITIONS_MAP = {
  'diabetes': { criteria: DIABETES_CRITERIA, icon: '🩸', color: 'orange' },
  'ptsd': { criteria: PTSD_CRITERIA, icon: '🧠', color: 'purple' },
  'tinnitus': { criteria: TINNITUS_CRITERIA, icon: '👂', color: 'cyan' },
  'sleep-apnea': { criteria: SLEEP_APNEA_CRITERIA, icon: '😴', color: 'sky' },
  'fibromyalgia': { criteria: FIBROMYALGIA_CRITERIA, icon: '💪', color: 'pink' },
  'hypertension': { criteria: HYPERTENSION_CRITERIA, icon: '❤️', color: 'red' },
  'peripheral-neuropathy': { criteria: PERIPHERAL_NEUROPATHY_CRITERIA, icon: '⚡', color: 'indigo' },
  'parkinsons': { criteria: PARKINSONS_DISEASE_CRITERIA, icon: '🧠', color: 'purple' },
  'multiple-sclerosis': { criteria: MULTIPLE_SCLEROSIS_CRITERIA, icon: '🧠', color: 'indigo' },
  'als': { criteria: ALS_CRITERIA, icon: '🧠', color: 'red' },
};

// Nexus strength indicators
const NEXUS_BADGES = {
  strong: { label: 'Strong Nexus', color: 'green', description: 'Well-established medical connection' },
  moderate: { label: 'Moderate Nexus', color: 'yellow', description: 'Documented connection, may need more evidence' },
  possible: { label: 'Possible Nexus', color: 'gray', description: 'Connection exists but requires strong documentation' },
};

/**
 * Individual Secondary Condition Card
 */
const SecondaryConditionCard = ({ condition, primaryCondition, onTrackSymptoms }) => {
  const [expanded, setExpanded] = useState(false);
  const nexusBadge = NEXUS_BADGES[condition.nexusStrength] || NEXUS_BADGES.possible;

  return (
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
        {/* Header - Always visible */}
        <button
            onClick={() => setExpanded(!expanded)}
            className="w-full px-4 py-3 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
        >
          <div className="flex-1 text-left">
            <div className="font-medium text-gray-900 dark:text-white">
              {condition.manifestation}
            </div>
            <div className="flex items-center gap-2 mt-1">
            <span className="text-xs text-gray-500 dark:text-gray-400">
              DC {condition.suggestedDCs.join(', ')}
            </span>
              <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium
              ${nexusBadge.color === 'green' ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' : ''}
              ${nexusBadge.color === 'yellow' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400' : ''}
              ${nexusBadge.color === 'gray' ? 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-400' : ''}
            `}>
              {nexusBadge.label}
            </span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {condition.smcConsideration && (
                <span className="px-2 py-0.5 bg-amber-100 dark:bg-amber-900/30 text-amber-800 dark:text-amber-400 text-xs rounded font-medium">
              SMC-K
            </span>
            )}
            {expanded ? (
                <ChevronUp className="w-5 h-5 text-gray-400" />
            ) : (
                <ChevronDown className="w-5 h-5 text-gray-400" />
            )}
          </div>
        </button>

        {/* Expanded Content */}
        {expanded && (
            <div className="px-4 pb-4 space-y-3 border-t border-gray-200 dark:border-gray-700">
              {/* DC Descriptions */}
              <div className="pt-3">
                <div className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase mb-1">
                  Diagnostic Code Description
                </div>
                <div className="text-sm text-gray-700 dark:text-gray-300">
                  {condition.dcDescriptions.join(' / ')}
                </div>
              </div>

              {/* Clinical Notes */}
              {condition.notes && (
                  <div>
                    <div className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase mb-1">
                      Clinical Notes
                    </div>
                    <div className="text-sm text-gray-700 dark:text-gray-300 bg-gray-50 dark:bg-gray-700/30 p-2 rounded">
                      {condition.notes}
                    </div>
                  </div>
              )}

              {/* SMC Note */}
              {condition.smcNote && (
                  <div className="bg-amber-50 dark:bg-amber-900/20 p-2 rounded border border-amber-200 dark:border-amber-800">
                    <div className="flex items-start gap-2">
                      <AlertCircle className="w-4 h-4 text-amber-600 dark:text-amber-400 mt-0.5 flex-shrink-0" />
                      <div className="text-sm text-amber-800 dark:text-amber-300">
                        <strong>SMC Consideration:</strong> {condition.smcNote}
                      </div>
                    </div>
                  </div>
              )}

              {/* Documentation Tips */}
              {condition.documentationTips && condition.documentationTips.length > 0 && (
                  <div>
                    <div className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase mb-1">
                      Documentation Tips
                    </div>
                    <ul className="space-y-1">
                      {condition.documentationTips.map((tip, idx) => (
                          <li key={idx} className="flex items-start gap-2 text-sm text-gray-700 dark:text-gray-300">
                            <FileText className="w-4 h-4 text-blue-500 dark:text-blue-400 mt-0.5 flex-shrink-0" />
                            {tip}
                          </li>
                      ))}
                    </ul>
                  </div>
              )}

              {/* Action Buttons */}
              <div className="flex gap-2 pt-2">
                {onTrackSymptoms && (
                    <button
                        onClick={() => onTrackSymptoms(condition)}
                        className="flex-1 px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded-lg flex items-center justify-center gap-2 transition-colors"
                    >
                      <Link2 className="w-4 h-4" />
                      Track Symptoms
                    </button>
                )}
              </div>
            </div>
        )}
      </div>
  );
};

/**
 * Category Section - Groups related secondary conditions
 */
const CategorySection = ({ categoryId, category, primaryCondition, onTrackSymptoms }) => {
  const [expanded, setExpanded] = useState(true);

  return (
      <div className="mb-4">
        <button
            onClick={() => setExpanded(!expanded)}
            className="w-full flex items-center justify-between py-2 text-left"
        >
          <h4 className="font-medium text-gray-900 dark:text-white flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-blue-500"></span>
            {category.name}
            <span className="text-sm text-gray-500 dark:text-gray-400 font-normal">
            ({category.conditions.length} condition{category.conditions.length !== 1 ? 's' : ''})
          </span>
          </h4>
          {expanded ? (
              <ChevronUp className="w-4 h-4 text-gray-400" />
          ) : (
              <ChevronDown className="w-4 h-4 text-gray-400" />
          )}
        </button>

        {expanded && (
            <div className="space-y-2 mt-2">
              {category.conditions.map((condition, idx) => (
                  <SecondaryConditionCard
                      key={idx}
                      condition={condition}
                      primaryCondition={primaryCondition}
                      onTrackSymptoms={onTrackSymptoms}
                  />
              ))}
            </div>
        )}
      </div>
  );
};

/**
 * Primary Condition Panel - Shows all secondaries for a primary condition
 */
const PrimaryConditionPanel = ({ conditionId, conditionData, userServiceConnected, onTrackSymptoms }) => {
  const [expanded, setExpanded] = useState(false);
  const { criteria, icon, color } = conditionData;
  const secondaryData = criteria?.secondaryConditions;

  if (!secondaryData) return null;

  // Count total secondaries across all categories
  const totalSecondaries = Object.values(secondaryData.categories || {})
  .reduce((sum, cat) => sum + (cat.conditions?.length || 0), 0);

  // Check if user has this as service-connected
  const isUserServiceConnected = userServiceConnected?.includes(criteria.diagnosticCode);

  return (
      <div className={`bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden border-l-4 border-${color}-500`}>
        {/* Header */}
        <button
            onClick={() => setExpanded(!expanded)}
            className="w-full px-4 py-4 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
        >
          <div className="flex items-center gap-3 flex-1 min-w-0">
            <span className="text-2xl flex-shrink-0">{icon}</span>
            <div className="text-left flex-1 min-w-0">
              <h3 className="font-semibold text-base text-gray-900 dark:text-white">
                {criteria.condition}
              </h3>
              <div className="flex flex-wrap items-center gap-x-2 gap-y-1 mt-1">
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  DC {criteria.diagnosticCode}
                </span>
                <span className={`px-2 py-0.5 text-xs font-bold rounded-full bg-${color}-100 dark:bg-${color}-900/30 text-${color}-600 dark:text-${color}-400`}>
                  {totalSecondaries} secondaries
                </span>
                {isUserServiceConnected && (
                    <span className="px-2 py-0.5 bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-400 text-xs rounded-full font-medium">
                      SC
                    </span>
                )}
              </div>
            </div>
          </div>
          {expanded ? (
              <ChevronUp className="w-5 h-5 text-gray-400 flex-shrink-0 ml-2" />
          ) : (
              <ChevronDown className="w-5 h-5 text-gray-400 flex-shrink-0 ml-2" />
          )}
        </button>

        {/* Expanded Content */}
        {expanded && (
            <div className="px-6 pb-6 space-y-4">
              <div className="border-t border-gray-200 dark:border-gray-700" />

              {/* Description */}
              {secondaryData.description && (
                  <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
                    <div className="flex items-start gap-2">
                      <Info className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" />
                      <p className="text-sm text-blue-800 dark:text-blue-300">
                        {secondaryData.description}
                      </p>
                    </div>
                  </div>
              )}

              {/* Categories of Secondary Conditions */}
              {secondaryData.categories && Object.entries(secondaryData.categories).map(([catId, category]) => (
                  <CategorySection
                      key={catId}
                      categoryId={catId}
                      category={category}
                      primaryCondition={criteria.condition}
                      onTrackSymptoms={onTrackSymptoms}
                  />
              ))}

              {/* Case Law References (if any) */}
              {secondaryData.caseLawReferences && secondaryData.caseLawReferences.length > 0 && (
                  <div className="bg-gray-50 dark:bg-gray-700/30 p-4 rounded-lg">
                    <h4 className="font-medium text-gray-900 dark:text-white mb-2 flex items-center gap-2">
                      <FileText className="w-4 h-4" />
                      Relevant Case Law
                    </h4>
                    <div className="space-y-2">
                      {secondaryData.caseLawReferences.map((ref, idx) => (
                          <div key={idx} className="text-sm">
                            <div className="font-medium text-gray-800 dark:text-gray-200">
                              {ref.case} ({ref.citation})
                            </div>
                            <div className="text-gray-600 dark:text-gray-400">
                              {ref.holding}
                            </div>
                          </div>
                      ))}
                    </div>
                  </div>
              )}

              {/* "Can Be Secondary To" section */}
              {secondaryData.canBeSecondaryTo && secondaryData.canBeSecondaryTo.length > 0 && (
                  <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-lg">
                    <h4 className="font-medium text-purple-900 dark:text-purple-200 mb-2 flex items-center gap-2">
                      <Link2 className="w-4 h-4" />
                      This Condition Can Also Be Secondary To:
                    </h4>
                    <div className="space-y-2">
                      {secondaryData.canBeSecondaryTo.map((link, idx) => (
                          <div key={idx} className="flex items-center gap-2 text-sm text-purple-800 dark:text-purple-300">
                            <span className="font-medium">DC {link.primaryDC}:</span>
                            <span>{link.primaryCondition}</span>
                            <span className={`px-1.5 py-0.5 rounded text-xs
                      ${link.nexusStrength === 'strong' ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' : ''}
                      ${link.nexusStrength === 'moderate' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400' : ''}
                    `}>
                      {link.nexusStrength}
                    </span>
                          </div>
                      ))}
                    </div>
                  </div>
              )}

              {/* Important Notes */}
              {secondaryData.importantNotes && secondaryData.importantNotes.length > 0 && (
                  <div className="bg-amber-50 dark:bg-amber-900/20 p-4 rounded-lg">
                    <h4 className="font-medium text-amber-900 dark:text-amber-200 mb-2 flex items-center gap-2">
                      <AlertCircle className="w-4 h-4" />
                      Important Notes
                    </h4>
                    <ul className="space-y-1">
                      {secondaryData.importantNotes.map((note, idx) => (
                          <li key={idx} className="flex items-start gap-2 text-sm text-amber-800 dark:text-amber-300">
                            <span className="text-amber-600 dark:text-amber-400 mt-1">•</span>
                            {note}
                          </li>
                      ))}
                    </ul>
                  </div>
              )}

              {/* Documentation Strategy */}
              {secondaryData.documentationStrategy && secondaryData.documentationStrategy.length > 0 && (
                  <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg">
                    <h4 className="font-medium text-green-900 dark:text-green-200 mb-2 flex items-center gap-2">
                      <CheckCircle className="w-4 h-4" />
                      Documentation Strategy
                    </h4>
                    <ul className="space-y-1">
                      {secondaryData.documentationStrategy.map((tip, idx) => (
                          <li key={idx} className="flex items-start gap-2 text-sm text-green-800 dark:text-green-300">
                            <Circle className="w-3 h-3 text-green-600 dark:text-green-400 mt-1 flex-shrink-0" />
                            {tip}
                          </li>
                      ))}
                    </ul>
                  </div>
              )}
            </div>
        )}
      </div>
  );
};

/**
 * Main Secondary Conditions Guide Component
 */
const SecondaryConditionsGuide = ({ userServiceConnected = [], onTrackSymptoms, onNavigateToSymptom }) => {
  const { isVeteran } = useProfile();
  const [filterMode, setFilterMode] = useState('all'); // 'all', 'service-connected', 'common'
  const [searchTerm, setSearchTerm] = useState('');

  // Filter conditions based on mode
  const filteredConditions = useMemo(() => {
    let conditions = Object.entries(SECONDARY_CONDITIONS_MAP);

    if (filterMode === 'service-connected' && userServiceConnected.length > 0) {
      conditions = conditions.filter(([id, data]) =>
          userServiceConnected.includes(data.criteria?.diagnosticCode)
      );
    }

    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      conditions = conditions.filter(([id, data]) => {
        const criteria = data.criteria;
        if (criteria?.condition?.toLowerCase().includes(term)) return true;
        if (criteria?.diagnosticCode?.includes(term)) return true;
        // Search through secondary conditions too
        const secondaries = criteria?.secondaryConditions?.categories;
        if (secondaries) {
          for (const cat of Object.values(secondaries)) {
            for (const cond of cat.conditions || []) {
              if (cond.manifestation?.toLowerCase().includes(term)) return true;
              if (cond.suggestedDCs?.some(dc => dc.includes(term))) return true;
            }
          }
        }
        return false;
      });
    }

    return conditions;
  }, [filterMode, searchTerm, userServiceConnected]);

  // Calculate stats
  const totalSecondaries = useMemo(() => {
    return Object.values(SECONDARY_CONDITIONS_MAP).reduce((sum, data) => {
      const cats = data.criteria?.secondaryConditions?.categories;
      if (!cats) return sum;
      return sum + Object.values(cats).reduce((catSum, cat) => catSum + (cat.conditions?.length || 0), 0);
    }, 0);
  }, []);

  if (!isVeteran) {
    return (
        <div className="bg-gray-100 dark:bg-gray-800 p-6 rounded-lg text-center">
          <Info className="w-8 h-8 text-gray-400 mx-auto mb-2" />
          <p className="text-gray-600 dark:text-gray-400">
            Secondary conditions information is available for veteran profiles.
          </p>
        </div>
    );
  }

  return (
      <div className="space-y-6">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg p-6 text-white">
          <h2 className="text-2xl font-bold mb-2 flex items-center gap-2">
            <Link2 className="w-6 h-6" />
            Secondary Conditions Guide
          </h2>
          <p className="text-blue-100 text-sm">
            Discover potential secondary service-connected conditions based on your primary disabilities.
            Each condition below shows related conditions that may be claimed as secondary.
          </p>
          <div className="mt-4 flex gap-4 text-sm">
            <div className="bg-white/20 rounded-lg px-4 py-2">
              <div className="text-2xl font-bold">{Object.keys(SECONDARY_CONDITIONS_MAP).length}</div>
              <div className="text-blue-100">Primary Conditions</div>
            </div>
            <div className="bg-white/20 rounded-lg px-4 py-2">
              <div className="text-2xl font-bold">{totalSecondaries}</div>
              <div className="text-blue-100">Total Secondaries</div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="flex-1">
            <input
                type="text"
                placeholder="Search conditions or diagnostic codes..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400"
            />
          </div>
          <div className="flex gap-2">
            <button
                onClick={() => setFilterMode('all')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors
              ${filterMode === 'all'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                }`}
            >
              All
            </button>
            <button
                onClick={() => setFilterMode('service-connected')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors
              ${filterMode === 'service-connected'
                    ? 'bg-green-600 text-white'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                }`}
            >
              My Service-Connected
            </button>
          </div>
        </div>

        {/* Info Banner */}
        <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg border border-blue-200 dark:border-blue-800">
          <div className="flex items-start gap-3">
            <Info className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" />
            <div className="text-sm text-blue-800 dark:text-blue-300">
              <strong>How Secondary Claims Work:</strong> A secondary condition must be caused OR aggravated by an
              already service-connected condition. You'll need a medical nexus opinion stating the connection is
              "at least as likely as not" (50% or greater probability).
            </div>
          </div>
        </div>

        {/* Condition Panels */}
        <div className="space-y-4">
          {filteredConditions.length === 0 ? (
              <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                {filterMode === 'service-connected'
                    ? 'No service-connected conditions found. Add your conditions in the Service-Connected section.'
                    : 'No conditions match your search.'
                }
              </div>
          ) : (
              filteredConditions.map(([conditionId, conditionData]) => (
                  <PrimaryConditionPanel
                      key={conditionId}
                      conditionId={conditionId}
                      conditionData={conditionData}
                      userServiceConnected={userServiceConnected}
                      onTrackSymptoms={onTrackSymptoms}
                  />
              ))
          )}
        </div>

        {/* Disclaimer */}
        <div className="bg-gray-100 dark:bg-gray-700/50 rounded-lg p-4 text-xs text-gray-600 dark:text-gray-400">
          <strong>Important:</strong> This guide is for educational purposes only and does not constitute medical
          or legal advice. The presence of a condition in this guide does not guarantee VA service connection.
          Always consult with a Veterans Service Organization (VSO), accredited claims agent, or VA-accredited
          attorney for claim guidance. Medical nexus opinions should come from qualified healthcare providers.
        </div>
      </div>
  );
};

export default SecondaryConditionsGuide;