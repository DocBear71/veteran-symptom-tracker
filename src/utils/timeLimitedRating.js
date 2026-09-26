// src/utils/timeLimitedRating.js
//
// Display helpers for rating cards whose analyzer can return a STATUS
// instead of a percentage.
//
// Time-limited endocrine conditions (DC 7900, 7903, 7905, 7909) carry an
// initial rating for a fixed window after diagnosis. Past that window, or
// with no diagnosis date on file, the analyzer has no honest number to give,
// so it returns one of the status strings below instead.
//
// Rating cards were written expecting a number. Fed a string, they showed
// "Rate residuals%" in the header and passed NaN to UnderstandingYourRating.
// These helpers give every affected card the same answer in the same words.
//
// FAIL LOUD: an unrecognized string is shown as-is and logged, never hidden
// behind a friendly label, so a typo in an analyzer shows up on screen.

import { getRatingTextColor } from './ratingCriteria';
import { isRatingSupported } from './ratingUtils.js';

// These must match the strings the analyzers return, character for character.
// Currently returned by analyzeHypoparathyroidismLogs in
// src/utils/ratingLogic/skinAndEndocrine.js.
export const RATING_STATUS = {
    RESIDUALS: 'Rate residuals',
    DATE_NEEDED: 'Diagnosis date needed',
};

const STATUS_LABELS = {
    [RATING_STATUS.RESIDUALS]: 'Residuals',
    [RATING_STATUS.DATE_NEEDED]: 'Date needed',
};

// Muted gray for any non-numeric status. These are not ratings, so they do
// not get the red/orange/green severity colors a percentage would.
const STATUS_COLOR = 'text-gray-600 dark:text-gray-300';

/**
 * Work out how a card header should show supportedRating.
 *
 * @param {number|string|null|undefined} supportedRating - from the analyzer
 * @returns {{
 *   label: string,          // text for the header, e.g. "30%", "Residuals"
 *   colorClass: string,     // Tailwind text color classes
 *   numericRating: number|null, // number for UnderstandingYourRating, or null
 *   isStatus: boolean,      // true when the analyzer returned a status string
 * }}
 */
export const getRatingDisplay = (supportedRating) => {
    if (supportedRating === null || supportedRating === undefined) {
        return { label: 'N/A', colorClass: STATUS_COLOR, numericRating: null, isStatus: false };
    }

    if (typeof supportedRating === 'number') {
        return {
            label: `${supportedRating}%`,
            colorClass: getRatingTextColor(supportedRating),
            numericRating: supportedRating,
            isStatus: false,
        };
    }

    // Known status strings
    if (STATUS_LABELS[supportedRating]) {
        return {
            label: STATUS_LABELS[supportedRating],
            colorClass: STATUS_COLOR,
            // Residuals are rated elsewhere; for the educational panel the
            // schedule's own residuals row is 0%. Date-needed has no rating at all.
            numericRating: supportedRating === RATING_STATUS.RESIDUALS ? 0 : null,
            isStatus: true,
        };
    }

    // Numeric strings like '30' or ranges like '30-100' from older analyzers.
    // Keep the existing behavior: show it with a % sign.
    if (/^\d/.test(String(supportedRating))) {
        const parsed = parseInt(supportedRating, 10);
        return {
            label: `${supportedRating}%`,
            colorClass: getRatingTextColor(parsed),
            numericRating: Number.isNaN(parsed) ? null : parsed,
            isStatus: false,
        };
    }

    // Anything else is a string this helper doesn't know. Show it raw.
    console.warn(`[timeLimitedRating] Unrecognized supportedRating status: "${supportedRating}"`);
    return { label: String(supportedRating), colorClass: STATUS_COLOR, numericRating: null, isStatus: true };
};

/**
 * Should this row of the VA Rating Schedule be highlighted as supported?
 *
 * A status of 'Rate residuals' highlights the row marked
 * criteria.residualsOnly. 'Diagnosis date needed' highlights nothing, since
 * the app is deliberately not estimating. Numbers use the normal check.
 *
 * @param {object} rating - one entry from CRITERIA.ratings
 * @param {number|string|null} supportedRating - from the analyzer
 * @returns {boolean}
 */
export const isScheduleRowSupported = (rating, supportedRating) => {
    if (supportedRating === RATING_STATUS.RESIDUALS) {
        return rating?.criteria?.residualsOnly === true;
    }
    if (supportedRating === RATING_STATUS.DATE_NEEDED) {
        return false;
    }
    return isRatingSupported(rating.percent, supportedRating);
};

/**
 * Label for the left column of a VA Rating Schedule row.
 * The residuals row is stored as percent: 0, but it isn't a 0% rating. It
 * means "rate what's left under other codes", so it says that.
 *
 * @param {object} rating - one entry from CRITERIA.ratings
 * @returns {string}
 */
export const getScheduleRowLabel = (rating) => {
    if (rating?.criteria?.residualsOnly === true) return 'Residuals';
    return `${rating.percent}%`;
};