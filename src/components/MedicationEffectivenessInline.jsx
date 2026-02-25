/**
 * MedicationEffectivenessInline.jsx
 *
 * Compact inline component for tracking medication effectiveness and side effects
 * when logging a symptom. Shown per-medication inside SymptomLogger, QuickLog,
 * and EditLogModal when the user checks a medication.
 *
 * Props:
 *   medDetail  — { effectiveness, sideEffects, sideEffectsOther }
 *   onChange   — (updatedDetail) => void
 *   compact    — boolean (true for QuickLog's smaller layout)
 */
import { EFFECTIVENESS_LEVELS, COMMON_SIDE_EFFECTS } from '../utils/medicationUtils';
import { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

const MedicationEffectivenessInline = ({ medDetail, onChange, compact = false }) => {
  const [showSideEffects, setShowSideEffects] = useState(
      (medDetail.sideEffects && medDetail.sideEffects.length > 0) || !!medDetail.sideEffectsOther
  );

  const updateField = (field, value) => {
    onChange({ ...medDetail, [field]: value });
  };

  const toggleSideEffect = (effect) => {
    const current = medDetail.sideEffects || [];
    const updated = current.includes(effect)
        ? current.filter(e => e !== effect)
        : [...current, effect];
    onChange({ ...medDetail, sideEffects: updated });
  };

  return (
      <div className="mt-2 ml-6 space-y-2 border-l-2 border-teal-300 dark:border-teal-700 pl-3">
        {/* Effectiveness - always visible */}
        <div>
          <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">
            How effective? <span className="text-gray-400 font-normal">(optional)</span>
          </label>
          <div className="flex flex-wrap gap-1">
            {EFFECTIVENESS_LEVELS.map((level) => (
                <button
                    key={level.value}
                    type="button"
                    onClick={() => updateField('effectiveness', medDetail.effectiveness === level.value ? '' : level.value)}
                    className={`px-2 py-1 rounded-full text-xs font-medium border transition-all ${
                        medDetail.effectiveness === level.value
                            ? level.color + ' ring-1 ring-offset-1 ring-blue-500 dark:ring-offset-gray-800'
                            : 'bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400 border-gray-200 dark:border-gray-600 hover:bg-gray-200 dark:hover:bg-gray-600'
                    }`}
                >
                  {level.label}
                </button>
            ))}
          </div>
        </div>

        {/* Side Effects - collapsible to keep form compact */}
        <div>
          <button
              type="button"
              onClick={() => setShowSideEffects(!showSideEffects)}
              className="flex items-center gap-1 text-xs font-medium text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 transition-colors"
          >
            {showSideEffects ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
            Side effects? <span className="text-gray-400 font-normal">(optional)</span>
            {medDetail.sideEffects?.length > 0 && (
                <span className="ml-1 px-1.5 py-0.5 bg-amber-100 dark:bg-amber-900 text-amber-700 dark:text-amber-300 rounded-full text-xs">
              {medDetail.sideEffects.length}
            </span>
            )}
          </button>

          {showSideEffects && (
              <div className="mt-1.5 space-y-1.5">
                <div className="flex flex-wrap gap-1">
                  {COMMON_SIDE_EFFECTS.map((effect) => {
                    const isSelected = (medDetail.sideEffects || []).includes(effect);
                    return (
                        <button
                            key={effect}
                            type="button"
                            onClick={() => toggleSideEffect(effect)}
                            className={`px-2 py-0.5 rounded-full text-xs font-medium border transition-all ${
                                isSelected
                                    ? 'bg-amber-100 dark:bg-amber-900 text-amber-800 dark:text-amber-200 border-amber-400 dark:border-amber-600 ring-1 ring-amber-400'
                                    : 'bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400 border-gray-200 dark:border-gray-600 hover:bg-gray-200 dark:hover:bg-gray-600'
                            }`}
                        >
                          {isSelected ? '✓ ' : ''}{effect}
                        </button>
                    );
                  })}
                </div>
                <input
                    type="text"
                    value={medDetail.sideEffectsOther || ''}
                    onChange={(e) => updateField('sideEffectsOther', e.target.value)}
                    placeholder="Other side effects..."
                    className="w-full p-1.5 text-xs border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                />
              </div>
          )}
        </div>
      </div>
  );
};

export default MedicationEffectivenessInline;