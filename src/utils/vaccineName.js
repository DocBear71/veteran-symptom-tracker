/**
 * vaccineName.js — Doc Bear's Symptom Vault
 *
 * Single source of truth for vaccine name matching.
 *
 * This lived in two places (bluebuttonParser.js and storage.js) because the
 * parser is dependency-free by design. That was a drift risk with a nasty
 * failure mode: if the two copies ever disagreed, the parser would collapse
 * duplicates that storage then re-split on the next import, quietly producing
 * double vaccine rows in a claim export. One module, no drift.
 *
 * This file imports nothing, so the parser stays clean.
 */

/**
 * Reduce a vaccine name to a duplicate-matching key.
 *
 * VA writes the same vaccine several different ways across years
 * ("INFLUENZA, QUADRIVALENT" vs "Influenza quadrivalent (IIV4)"), so we strip
 * parentheticals, punctuation, and casing before comparing.
 *
 * Matching only — never displayed, never stored as the name.
 */
export const normalizeVaccineName = (name) => {
    if (!name) return '';
    return String(name)
        .toUpperCase()
        .replace(/\([^)]*\)/g, ' ')   // drop "(IIV4)", "(SCT 1234)", etc.
        .replace(/[^A-Z0-9]+/g, ' ')  // punctuation becomes whitespace
        .replace(/\s+/g, ' ')
        .trim();
};

/**
 * Dedupe key: normalized name + administration date.
 *
 * Blue Button gives no stable record ID, so name+date is the only thing that
 * survives a re-import six months from now.
 */
export const getImmunizationMatchKey = (vaccineName, vaccineDate) => {
    return `${normalizeVaccineName(vaccineName)}|${vaccineDate || ''}`;
};