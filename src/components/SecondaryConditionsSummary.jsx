// ============================================
// SecondaryConditionsSummary.jsx
// Phase 15B: Compact summary component for Rating Evidence integration
// Shows relevant secondary conditions based on user's logged conditions
//
// Phase 3 refactor (current): secondaryConditions.js is the sole source
// of truth. All primary condition data — including topSecondaries,
// note, and canBeSecondaryTo — lives there. To add or change a primary
// condition's secondaries, edit src/data/secondaryConditions.js. This
// component reads from that map only.
// ============================================

import { useState, useMemo } from 'react';
import { ChevronDown, ChevronUp, Link2, AlertCircle, ExternalLink, Star } from 'lucide-react';
import SECONDARY_CONDITIONS_MAP from '../data/secondaryConditions';

// (Phase 3: CURATED_DISPLAY_KEY and SECONDARY_DATA removed —
//  all data now lives in src/data/secondaryConditions.js)

/**
 * Individual Secondary Condition Row
 * Renders one row inside an expanded ConditionSecondaryCard: condition
 * name, DC, optional SMC-K badge, and nexus strength badge.
 */
const SecondaryRow = ({ secondary }) => {
  // Nexus strength levels match values in secondaryConditions.js
  // ('strong' | 'moderate' | 'possible'). Any new strength value added
  // there must get a matching entry here or the badge will render unstyled.
  const nexusColors = {
    strong: 'text-green-600 dark:text-green-400 bg-green-100 dark:bg-green-900/30',
    moderate: 'text-yellow-600 dark:text-yellow-400 bg-yellow-100 dark:bg-yellow-900/30',
    possible: 'text-orange-600 dark:text-orange-400 bg-orange-100 dark:bg-orange-900/30',
  };

  return (
      <div className="flex items-center justify-between py-1.5 px-2 hover:bg-gray-50 dark:hover:bg-gray-700/50 rounded">
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-700 dark:text-gray-300">{secondary.name}</span>
          <span className="text-xs text-gray-500 dark:text-gray-500">DC {secondary.dc}</span>
          {secondary.smcK && (
              <span className="px-1.5 py-0.5 bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 text-xs rounded">
            SMC-K
          </span>
          )}
        </div>
        <span className={`px-2 py-0.5 rounded text-xs font-medium ${nexusColors[secondary.nexus]}`}>
        {secondary.nexus}
      </span>
      </div>
  );
};

const ConditionSecondaryCard = ({ data, isExpanded, onToggle }) => {
  // Build display data from canonical SECONDARY_CONDITIONS_MAP. Memoized
  // so we don't re-map secondaries on every render (matters most for ALS,
  // MS, and Parkinson's which have long lists).
  //
  // Field shape mapping (canonical → display):
  //   primaryCondition       → condition
  //   diagnosticCode         → dc
  //   secondaryConditions    → topSecondaries (filtered by topSecondaries[]
  //                            DC array if present, else show all)
  //   nexusStrength          → nexus
  //   smcPotential           → smcK
  //   note                   → note (passthrough, optional)
  //   canBeSecondaryTo       → canBeSecondaryTo (passthrough, optional)
  const secondaryInfo = useMemo(() => {
    if (!data.canonicalKey) return null;
    const canonical = SECONDARY_CONDITIONS_MAP[data.canonicalKey];
    if (!canonical) return null;

    const allSecondaries = (canonical.secondaryConditions || []).map(sec => ({
      name: sec.name,
      dc: sec.diagnosticCode,
      nexus: sec.nexusStrength,
      smcK: sec.smcPotential === true,
    }));

    // If canonical specifies a topSecondaries DC subset, filter & order by it.
    // Otherwise show all canonical secondaries.
    let displaySecondaries = allSecondaries;
    if (Array.isArray(canonical.topSecondaries) && canonical.topSecondaries.length > 0) {
      displaySecondaries = canonical.topSecondaries
      .map(dc => allSecondaries.find(sec => sec.dc === dc))
      .filter(Boolean);
    }

    return {
      condition: canonical.primaryCondition,
      dc: canonical.diagnosticCode,
      topSecondaries: displaySecondaries,
      note: canonical.note,
      canBeSecondaryTo: canonical.canBeSecondaryTo,
    };
  }, [data.canonicalKey]);

  if (!secondaryInfo) return null;

  return (
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
        <button
            onClick={onToggle}
            className="w-full px-4 py-3 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
        >
          <div className="flex items-center gap-2">
            <Link2 className="w-4 h-4 text-blue-500" />
            <span className="font-medium text-gray-900 dark:text-white">
            {secondaryInfo.condition}
          </span>
            <span className="text-xs text-gray-500">DC {secondaryInfo.dc}</span>
          </div>
          <div className="flex items-center gap-2">
          <span className="px-2 py-0.5 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 text-xs rounded-full">
            {secondaryInfo.topSecondaries.length} secondaries
          </span>
            {isExpanded ? (
                <ChevronUp className="w-4 h-4 text-gray-400" />
            ) : (
                <ChevronDown className="w-4 h-4 text-gray-400" />
            )}
          </div>
        </button>

        {isExpanded && (
            <div className="px-4 pb-3 border-t border-gray-200 dark:border-gray-700">
              {/* Top Secondaries */}
              <div className="mt-3 space-y-0.5">
                {secondaryInfo.topSecondaries.map((sec, idx) => (
                    <SecondaryRow key={idx} secondary={sec} />
                ))}
              </div>

              {/* Note if exists */}
              {secondaryInfo.note && (
                  <div className="mt-3 p-2 bg-amber-50 dark:bg-amber-900/20 rounded text-xs text-amber-800 dark:text-amber-300">
                    <AlertCircle className="w-3 h-3 inline mr-1" />
                    {secondaryInfo.note}
                  </div>
              )}

              {/* Can be secondary to */}
              {secondaryInfo.canBeSecondaryTo && (
                  <div className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                    <span className="font-medium">Can also be secondary to:</span>{' '}
                    {secondaryInfo.canBeSecondaryTo.join(', ')}
                  </div>
              )}
            </div>
        )}
      </div>
  );
};

/**
 * Main Summary Component
 * Shows secondary conditions for all conditions with logged data
 */
const SecondaryConditionsSummary = ({
                                      activeConditions = [], // Array of condition keys that have logged data
                                      onViewFullGuide,
                                      compact = false
                                    }) => {
  const [expandedCondition, setExpandedCondition] = useState(null);

  // Map active conditions to those that have a canonical entry.
  // Any key in SECONDARY_CONDITIONS_MAP qualifies — no second map to sync.
  const conditionsWithSecondaries = useMemo(() => {
    return activeConditions
    .map(key => {
      const canonical = SECONDARY_CONDITIONS_MAP[key];
      if (!canonical) return null;
      return {
        conditionKey: key,
        canonicalKey: key,
        display: canonical.primaryCondition,
        dc: canonical.diagnosticCode,
      };
    })
    .filter(Boolean);
  }, [activeConditions]);

  // Count total potential secondaries shown across all cards.
  // Respects each primary's topSecondaries subset if defined — this number
  // should match what the user actually sees when they expand all cards.
  const totalSecondaries = useMemo(() => {
    return conditionsWithSecondaries.reduce((sum, cond) => {
      const canonical = SECONDARY_CONDITIONS_MAP[cond.canonicalKey];
      if (!canonical) return sum;
      // If topSecondaries is defined, count only that subset (filtered to
      // DCs that exist in the canonical list). Else count all canonical.
      if (Array.isArray(canonical.topSecondaries) && canonical.topSecondaries.length > 0) {
        const validDCs = new Set(
            (canonical.secondaryConditions || []).map(sec => sec.diagnosticCode)
        );
        return sum + canonical.topSecondaries.filter(dc => validDCs.has(dc)).length;
      }
      return sum + (canonical.secondaryConditions?.length || 0);
    }, 0);
  }, [conditionsWithSecondaries]);

  if (compact) {
    // Compact mode - just show a summary banner
    return (
        <div className="bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg p-4 text-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Link2 className="w-5 h-5" />
              <div>
                <div className="font-medium">Secondary Conditions Available</div>
                <div className="text-sm text-purple-100">
                  {totalSecondaries} potential secondaries from {conditionsWithSecondaries.length} logged condition(s)
                </div>
              </div>
            </div>
            {onViewFullGuide && (
                <button
                    onClick={onViewFullGuide}
                    className="px-4 py-2 bg-white/20 hover:bg-white/30 rounded-lg text-sm font-medium flex items-center gap-2 transition-colors"
                >
                  View Guide
                  <ExternalLink className="w-4 h-4" />
                </button>
            )}
          </div>
        </div>
    );
  }

  return (
      <div className="space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-gray-900 dark:text-white flex items-center gap-2">
            <Link2 className="w-5 h-5 text-purple-500" />
            Potential Secondary Conditions
          </h3>
          {onViewFullGuide && (
              <button
                  onClick={onViewFullGuide}
                  className="text-sm text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1"
              >
                Full Guide <ExternalLink className="w-3 h-3" />
              </button>
          )}
        </div>

        {/* Info Banner */}
        <div className="bg-purple-50 dark:bg-purple-900/20 p-3 rounded-lg text-sm text-purple-800 dark:text-purple-300">
          Based on your logged symptoms, you may be eligible for these secondary conditions.
          Click each condition to see potential claims.
        </div>

        {/* Condition Cards */}
        <div className="space-y-2">
          {conditionsWithSecondaries.map(cond => (
              <ConditionSecondaryCard
                  key={cond.conditionKey}
                  conditionKey={cond.conditionKey}
                  data={cond}
                  isExpanded={expandedCondition === cond.conditionKey}
                  onToggle={() => setExpandedCondition(
                      expandedCondition === cond.conditionKey ? null : cond.conditionKey
                  )}
              />
          ))}
        </div>

        {/* High Value Tip */}
        <div className="bg-amber-50 dark:bg-amber-900/20 p-3 rounded-lg border border-amber-200 dark:border-amber-800">
          <div className="flex items-start gap-2">
            <Star className="w-4 h-4 text-amber-600 dark:text-amber-400 mt-0.5 flex-shrink-0" />
            <div className="text-sm text-amber-800 dark:text-amber-300">
              <strong>Pro Tip:</strong> Secondary conditions can significantly increase your combined rating.
              A 50% primary with two 10% secondaries could result in a higher combined rating than the primary alone.
            </div>
          </div>
        </div>

        {/* DIC Awareness */}
        <div className="bg-red-50 dark:bg-red-900/20 p-3 rounded-lg border border-red-200 dark:border-red-800">
          <div className="flex items-start gap-2">
            <AlertCircle className="w-4 h-4 text-red-600 dark:text-red-400 mt-0.5 flex-shrink-0" />
            <div className="text-sm text-red-800 dark:text-red-300">
              <strong>DIC Protection:</strong> Filing secondary conditions now — even at 0% —
              creates a service-connection record that protects your surviving spouse's
              Dependency and Indemnity Compensation (DIC) eligibility.
              <span className="block mt-1">
                <strong>5-year rule:</strong> Rating stabilizes after 5 years — cannot reduce without sustained improvement across all evidence.{' '}
                <strong>10-year rule:</strong> Service connection cannot be severed after 10 years.{' '}
                <strong>20-year rule:</strong> Rating level cannot drop below its 20-year mark.
                The sooner you file, the sooner these clocks start.
              </span>
            </div>
          </div>
        </div>
      </div>
  );
};

export default SecondaryConditionsSummary;