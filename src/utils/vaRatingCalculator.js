/**
 * VA Combined Disability Rating Calculator
 * Implements the "whole person" method from 38 CFR Part 4.25
 */

/**
 * Calculate combined VA disability rating using VA math
 * @param {number[]} ratings - Array of individual rating percentages (e.g., [50, 50, 40, 20])
 * @returns {number} - Combined rating rounded to nearest 10%
 */
export const calculateCombinedRating = (ratings) => {
  if (!ratings || ratings.length === 0) {
    return 0;
  }

  // Filter out 0% ratings (they don't affect calculation)
  const nonZeroRatings = ratings.filter(r => r > 0);

  if (nonZeroRatings.length === 0) {
    return 0;
  }

  // Sort in descending order (highest first)
  const sortedRatings = [...nonZeroRatings].sort((a, b) => b - a);

  // Start with 100% efficiency (whole person)
  let remainingEfficiency = 100;

  // Apply each rating to the remaining efficiency
  sortedRatings.forEach(rating => {
    const disability = (rating / 100) * remainingEfficiency;
    remainingEfficiency = remainingEfficiency - disability;
  });

  // Total disability is what's left after all conditions
  const combinedDisability = 100 - remainingEfficiency;

  // Round to nearest 10% per VA rules
  return Math.round(combinedDisability / 10) * 10;
};

/**
 * Calculate combined rating with detailed breakdown
 * @param {Array<{conditionName: string, currentRating: number}>} conditions
 * @returns {Object} - { combinedRating, breakdown, totalEfficiency }
 */
export const calculateCombinedRatingDetailed = (conditions) => {
  if (!conditions || conditions.length === 0) {
    return {
      combinedRating: 0,
      breakdown: [],
      totalEfficiency: 100,
    };
  }

  // Filter and sort by rating (descending)
  const sortedConditions = [...conditions]
  .filter(c => c.currentRating > 0)
  .sort((a, b) => b.currentRating - a.currentRating);

  let remainingEfficiency = 100;
  const breakdown = [];

  sortedConditions.forEach((condition, index) => {
    const disability = (condition.currentRating / 100) * remainingEfficiency;
    const newRemaining = remainingEfficiency - disability;

    breakdown.push({
      step: index + 1,
      conditionName: condition.conditionName,
      rating: condition.currentRating,
      disabilityAdded: Math.round(disability * 10) / 10,
      remainingEfficiency: Math.round(newRemaining * 10) / 10,
    });

    remainingEfficiency = newRemaining;
  });

  const combinedDisability = 100 - remainingEfficiency;
  const combinedRating = Math.round(combinedDisability / 10) * 10;

  return {
    combinedRating,
    breakdown,
    totalDisability: Math.round(combinedDisability * 10) / 10,
    totalEfficiency: Math.round(remainingEfficiency * 10) / 10,
  };
};

/**
 * Get rating badge color based on percentage
 */
export const getRatingColor = (rating) => {
  if (rating === 0) return 'gray';
  if (rating <= 20) return 'green';
  if (rating <= 40) return 'yellow';
  if (rating <= 60) return 'orange';
  return 'red';
};

export default {
  calculateCombinedRating,
  calculateCombinedRatingDetailed,
  getRatingColor,
};