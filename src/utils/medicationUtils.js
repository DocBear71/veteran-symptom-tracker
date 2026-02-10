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
  { value: 'powder', label: 'Powder/Packet' },
  { value: 'liquid', label: 'Liquid (ml)' },
  { value: 'drop', label: 'Drop(s)' },
  { value: 'patch', label: 'Patch(es)' },
  { value: 'cream', label: 'Cream/Topical' },
  { value: 'inhaler', label: 'Inhaler Puff(s)' },
  { value: 'other', label: 'Other' },
];