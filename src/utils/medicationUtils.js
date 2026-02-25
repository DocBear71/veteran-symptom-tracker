/**
 * MEDICATION DOSAGE UTILITIES
 *
 * Shared formatting for structured and legacy dosage fields.
 * Structured meds have: strength, quantity, unitType
 * Legacy meds have: dosage (free text string)
 *
 * All display code should call formatDosage() instead of reading .dosage directly.
 * All logging code should call getDosageForLog() to get the string stored in logs.
 */

const UNIT_LABELS = {
  tablet: { singular: 'tablet', plural: 'tablets' },
  capsule: { singular: 'capsule', plural: 'capsules' },
  injection: { singular: 'injection', plural: 'injections' },
  powder: { singular: 'packet', plural: 'packets' },
  liquid: { singular: 'ml', plural: 'ml' },
  drop: { singular: 'drop', plural: 'drops' },
  patch: { singular: 'patch', plural: 'patches' },
  cream: { singular: 'application', plural: 'applications' },
  inhaler: { singular: 'puff', plural: 'puffs' },
  other: { singular: 'dose', plural: 'doses' },
};

/**
 * Format a medication's dosage for display.
 * Handles both structured (new) and legacy (old text) formats.
 * Works on both medication objects AND log entries (which store dosage as string).
 */
export const formatDosage = (med) => {
  if (!med) return '';

  // New structured format: has strength field
  if (med.strength) {
    const qty = med.quantity || 1;
    const unitInfo = UNIT_LABELS[med.unitType] || UNIT_LABELS.other;
    const unitLabel = qty === 1 ? unitInfo.singular : unitInfo.plural;

    if (qty === 1) {
      return med.unitType === 'other' ? med.strength : `${med.strength} ${unitLabel}`;
    }
    return `${qty} × ${med.strength} ${unitLabel}`;
  }

  // Legacy format: plain text dosage field
  return med.dosage || '';
};

/**
 * Get dosage string for medication logs.
 * Logs store a snapshot of the dosage at time taken.
 */
export const getDosageForLog = (med) => formatDosage(med);

/**
 * Calculate total dose per intake (quantity × strength).
 * Only works for structured meds with parseable numeric strength.
 */
export const getTotalDose = (med) => {
  if (!med?.strength || !med?.quantity || med.quantity <= 1) return null;

  const match = med.strength.match(/^([\d.]+)\s*(.+)$/);
  if (!match) return null;

  const perUnit = parseFloat(match[1]);
  const unit = match[2];
  if (isNaN(perUnit)) return null;

  const total = perUnit * med.quantity;
  const formatted = total % 1 === 0 ? total.toFixed(0) : total.toFixed(1);
  return `${formatted}${unit}`;
};

/**
 * Format dosage with total dose shown.
 * e.g., "3 × 20mg capsules (60mg total)"
 */
export const formatDosageWithTotal = (med) => {
  const base = formatDosage(med);
  const total = getTotalDose(med);
  return total ? `${base} (${total} total)` : base;
};

/**
 * Available unit types for medication forms
 */
export const UNIT_TYPE_OPTIONS = [
  { value: 'tablet', label: 'Tablet(s)' },
  { value: 'capsule', label: 'Capsule(s)' },
  { value: 'injection', label: 'Injection' },
  { value: 'powder', label: 'Powder' },
  { value: 'packet', label: 'Packet' },
  { value: 'liquid', label: 'Liquid (ml)' },
  { value: 'drop', label: 'Drop(s)' },
  { value: 'patch', label: 'Patch(es)' },
  { value: 'cream', label: 'Cream/Topical' },
  { value: 'inhaler', label: 'Inhaler Puff(s)' },
  { value: 'other', label: 'Other' },
];

// ============================================
// SHARED EFFECTIVENESS & SIDE EFFECTS CONSTANTS
// Used by SymptomLogger, QuickLog, EditLogModal, and Medications
// ============================================

export const EFFECTIVENESS_LEVELS = [
  { value: 'none', label: 'No Relief', color: 'bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200 border-red-300 dark:border-red-700' },
  { value: 'slight', label: 'Slight', color: 'bg-orange-100 dark:bg-orange-900 text-orange-800 dark:text-orange-200 border-orange-300 dark:border-orange-700' },
  { value: 'moderate', label: 'Moderate', color: 'bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200 border-yellow-300 dark:border-yellow-700' },
  { value: 'significant', label: 'Significant', color: 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 border-green-300 dark:border-green-700' },
  { value: 'complete', label: 'Complete', color: 'bg-emerald-100 dark:bg-emerald-900 text-emerald-800 dark:text-emerald-200 border-emerald-300 dark:border-emerald-700' },
];

export const EFFECTIVENESS_LABELS = {
  none: 'No Relief', slight: 'Slight Relief', moderate: 'Moderate Relief',
  significant: 'Significant Relief', complete: 'Complete Relief',
};

export const COMMON_SIDE_EFFECTS = [
  'Drowsiness', 'Dizziness', 'Nausea', 'Weight Gain', 'Fatigue',
  'Headache', 'Dry Mouth', 'Constipation', 'Insomnia', 'Brain Fog',
  'GI Upset', 'Sexual Dysfunction', 'Appetite Changes', 'Mood Changes',
  'Muscle Weakness', 'Blurred Vision', 'Tremor', 'Swelling',
];

/**
 * Default medication detail object for tracking effectiveness and side effects
 * per medication when logging symptoms.
 */
export const getDefaultMedDetail = () => ({
  effectiveness: '',
  sideEffects: [],
  sideEffectsOther: '',
});