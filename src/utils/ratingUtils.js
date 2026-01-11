/**
 * ratingUtils.js
 * Shared utility functions for VA rating calculations and validation
 * Used across all rating card components
 */

/**
 * Determines if a given rating percentage is supported based on the supportedRating value
 *
 * @param {number} ratingPercent - The rating percentage to check (e.g., 10, 30, 50)
 * @param {number|string|null|undefined} supportedRating - The supported rating(s) for a condition
 *   - Can be a single number (e.g., 30)
 *   - Can be a string of a single number (e.g., "30")
 *   - Can be a range string (e.g., "10-40")
 *   - Can be null/undefined (returns false)
 * @returns {boolean} - True if the rating is supported, false otherwise
 *
 * @example
 * // Single number
 * isRatingSupported(30, 30) // true
 * isRatingSupported(30, 50) // false
 *
 * @example
 * // Range string
 * isRatingSupported(30, "10-50") // true
 * isRatingSupported(60, "10-50") // false
 *
 * @example
 * // Null/undefined
 * isRatingSupported(30, null) // false
 * isRatingSupported(30, undefined) // false
 */
export const isRatingSupported = (ratingPercent, supportedRating) => {
  // Handle null/undefined cases
  if (supportedRating === null || supportedRating === undefined) return false;

  // Handle direct number comparison
  if (typeof supportedRating === 'number') return ratingPercent === supportedRating;

  // Handle string cases (single value or range)
  if (typeof supportedRating === 'string') {
    // Check if it's a range (e.g., "10-40")
    if (supportedRating.includes('-')) {
      const [low, high] = supportedRating.split('-').map(Number);
      return ratingPercent >= low && ratingPercent <= high;
    }
    // Single value as string
    return ratingPercent === parseInt(supportedRating, 10);
  }

  return false;
};

/**
 * Additional rating utilities can be added here as the app grows
 * Examples for future expansion:
 * - calculateCombinedRating()
 * - getRatingDescription()
 * - validateRatingCriteria()
 */