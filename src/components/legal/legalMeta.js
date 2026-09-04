// file: src/components/legal/legalMeta.js  v1
// Single source of truth for legal document versions, dates, and company contact info.
//
// WHY THIS FILE EXISTS:
// Previously the effective date, mailing address, and support email were hard-coded
// in five different components. When one changed, the others silently went stale --
// which is a real legal exposure if a court is asked which version a user accepted.
//
// Bump LEGAL_VERSION whenever the substance of the Terms changes. TermsModal compares
// the stored acceptance version against this value and re-prompts if they differ, so
// users are re-presented with materially changed terms.

export const LEGAL_VERSION = '3.0.0';

// Human-readable date shown at the top of each document
export const LEGAL_EFFECTIVE_DATE = 'September 3, 2026';

// Machine-readable date, stored with the acceptance record
export const LEGAL_EFFECTIVE_DATE_ISO = '2026-09-03';

// localStorage keys used for the acceptance record
export const TERMS_ACCEPTANCE_KEY = 'symptomTracker_termsAcceptance';

// The key used by app versions before v3.0.0. Its value was a bare ISO timestamp
// string, with no record of WHICH version of the terms was accepted.
// We migrate it rather than discard it: the fact that a user accepted the
// December 2024 terms on a particular date is evidence worth keeping.
export const LEGACY_TERMS_KEY = 'symptomTracker_termsAccepted';

// Label applied to acceptances recovered from the legacy key
export const LEGACY_VERSION_LABEL = '2.0.0-legacy-2024-12-26';

export const COMPANY = {
    legalName: "Doc Bear Enterprises, LLC.",
    appName: "Doc Bear's Symptom Vault",
    street: '5249 N Park Pl NE, PMB 4011',
    cityStateZip: 'Cedar Rapids, IA 52402',
    country: 'United States',
    privacyEmail: 'privacy@docbear-ent.com',
    supportEmail: 'support@docbear-ent.com',
    website: 'https://www.docbear-ent.com',
    websiteLabel: 'www.docbear-ent.com',
    appWebsite: 'https://www.docbearssymptomvault.com',
    appWebsiteLabel: 'www.docbearssymptomvault.com',
    governingState: 'Iowa',
};

export const CRISIS = {
    veteransCrisisPhone: '988 (then press 1)',
    veteransCrisisText: '838255',
    veteransCrisisChat: 'VeteransCrisisLine.net/chat',
    emergency: '911',
};

/**
 * Read the stored terms acceptance record.
 * Returns null if the user has never accepted, or if the stored record is unreadable.
 */
export const getTermsAcceptance = () => {
    try {
        const raw = localStorage.getItem(TERMS_ACCEPTANCE_KEY);
        if (!raw) return null;
        return JSON.parse(raw);
    } catch {
        return null;
    }
};

/**
 * Convert a pre-v3.0.0 acceptance into the new record shape.
 *
 * Existing users in the App Store and Google Play already accepted the December 2024
 * terms. That acceptance is real and we keep it in the history. It does NOT satisfy
 * the current version, because v3.0.0 adds materially new provisions -- an arbitration
 * agreement with a class action waiver, a liability cap, and new indemnification
 * grounds -- which require fresh affirmative assent. Those users will see the modal
 * again, with their prior acceptance preserved underneath.
 *
 * Safe to call on every launch; it is a no-op after the first run.
 */
export const migrateLegacyAcceptance = () => {
    try {
        const legacy = localStorage.getItem(LEGACY_TERMS_KEY);
        if (!legacy) return null;

        const existing = getTermsAcceptance();

        // Already migrated? Leave it alone.
        if (existing && Array.isArray(existing.history) &&
            existing.history.some(h => h.version === LEGACY_VERSION_LABEL)) {
            return existing;
        }

        const legacyEntry = {
            version: LEGACY_VERSION_LABEL,
            effectiveDate: '2024-12-26',
            acceptedAt: legacy,        // the original ISO timestamp
            migratedAt: new Date().toISOString(),
        };

        const record = existing
            ? { ...existing, history: [legacyEntry, ...(existing.history || [])] }
            : {
                // No current-version acceptance yet. Record only the history, and leave
                // `version` unset so hasAcceptedCurrentTerms() returns false and the
                // modal is shown for the new terms.
                version: null,
                history: [legacyEntry],
            };

        localStorage.setItem(TERMS_ACCEPTANCE_KEY, JSON.stringify(record));
        // Keep the legacy key in place. It costs a few bytes and it is the original
        // artifact; removing it would destroy the very evidence we are preserving.
        return record;
    } catch (e) {
        console.warn('Could not migrate legacy terms acceptance:', e);
        return null;
    }
};

/**
 * True when the user has accepted THIS version of the terms.
 * A version mismatch means the terms changed materially since they last accepted,
 * so the modal should be shown again.
 */
export const hasAcceptedCurrentTerms = () => {
    const record = getTermsAcceptance();
    return Boolean(record && record.version === LEGAL_VERSION);
};

/**
 * True when this user accepted some earlier version of the terms. Used to show
 * returning users a "terms have been updated" heading instead of a first-run one.
 */
export const hasAcceptedAnyPriorTerms = () => {
    const record = getTermsAcceptance();
    if (!record) return false;
    if (Array.isArray(record.history) && record.history.length > 0) return true;
    return Boolean(record.version && record.version !== LEGAL_VERSION);
};

/**
 * Persist an acceptance record locally, preserving the history of prior acceptances.
 * Nothing is transmitted anywhere.
 */
export const recordTermsAcceptance = () => {
    const previous = getTermsAcceptance();

    // Roll any prior current-version acceptance into the history
    const history = [...(previous?.history || [])];
    if (previous?.version && previous.version !== LEGAL_VERSION) {
        history.unshift({
            version: previous.version,
            effectiveDate: previous.effectiveDate,
            acceptedAt: previous.acceptedAt,
        });
    }

    const record = {
        version: LEGAL_VERSION,
        effectiveDate: LEGAL_EFFECTIVE_DATE_ISO,
        acceptedAt: new Date().toISOString(),
        history,
    };

    try {
        localStorage.setItem(TERMS_ACCEPTANCE_KEY, JSON.stringify(record));
    } catch (e) {
        // Storage can fail in private browsing modes. Do not block app use over it.
        console.warn('Could not persist terms acceptance:', e);
    }
    return record;
};