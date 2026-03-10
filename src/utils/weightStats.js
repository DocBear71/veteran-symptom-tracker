/**
 * weightStats.js
 *
 * Weight tracking calculation utilities for Doc Bear's Symptom Vault.
 * Used by WeightTracker.jsx to power trend analysis and projections.
 *
 * Phase 3: Trend Analysis
 */

/**
 * Calculate weight change over a given number of days.
 * Compares the oldest and newest entries within the window.
 *
 * @param {Array} measurements - Array of measurement objects, any sort order
 * @param {number} periodDays - Number of days to look back
 * @returns {{ delta: number, oldest: number, newest: number, daySpan: number } | null}
 */
export const getWeightTrend = (measurements, periodDays) => {
  const cutoff = new Date();
  cutoff.setDate(cutoff.getDate() - periodDays);

  const inRange = measurements
  .filter(m => m.values?.weight && new Date(m.timestamp) >= cutoff)
  .sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));

  if (inRange.length < 2) return null;

  const oldest = inRange[0].values.weight;
  const newest = inRange[inRange.length - 1].values.weight;
  const daySpan = (
      new Date(inRange[inRange.length - 1].timestamp) - new Date(inRange[0].timestamp)
  ) / (1000 * 60 * 60 * 24);

  return {
    delta: parseFloat((newest - oldest).toFixed(1)),
    oldest,
    newest,
    daySpan: Math.round(daySpan),
  };
};

/**
 * Get a direction label and color for a trend delta,
 * relative to whether the user's goal is to lose or gain weight.
 *
 * @param {number} delta - Weight change (negative = lost, positive = gained)
 * @param {boolean} isLossGoal - True if user is trying to lose weight
 * @returns {{ arrow: string, color: string, label: string }}
 */
export const getTrendIndicator = (delta, isLossGoal) => {
  if (Math.abs(delta) < 0.5) {
    return { arrow: '→', color: 'text-gray-500 dark:text-gray-400', label: 'Stable' };
  }

  const movingTowardGoal = isLossGoal ? delta < 0 : delta > 0;

  if (movingTowardGoal) {
    return { arrow: isLossGoal ? '↓' : '↑', color: 'text-green-600 dark:text-green-400', label: 'On track' };
  } else {
    return { arrow: isLossGoal ? '↑' : '↓', color: 'text-red-600 dark:text-red-400', label: 'Off track' };
  }
};

/**
 * Calculate average lbs per week over a given period.
 *
 * @param {Array} measurements - Array of measurement objects
 * @param {number} periodDays - Number of days to look back
 * @returns {number | null} - Lbs per week (negative = losing, positive = gaining)
 */
export const getAverageRate = (measurements, periodDays = 30) => {
  const trend = getWeightTrend(measurements, periodDays);
  if (!trend || trend.daySpan < 1) return null;
  return parseFloat(((trend.delta / trend.daySpan) * 7).toFixed(2));
};

/**
 * Get projected completion date based on current rate of change.
 *
 * @param {number} currentWeight
 * @param {number} goalWeight
 * @param {number | null} weeklyRate - Lbs per week from getAverageRate()
 * @returns {string | null} - Human-readable projection string
 */
export const getProjectedCompletion = (currentWeight, goalWeight, weeklyRate) => {
  if (!currentWeight || !goalWeight || !weeklyRate) return null;

  const remaining = currentWeight - goalWeight;
  if (Math.abs(remaining) < 0.5) return 'Goal reached! 🎉';

  const isLossGoal = remaining > 0;

  // Rate must be moving toward goal
  if (isLossGoal && weeklyRate >= 0) return null;
  if (!isLossGoal && weeklyRate <= 0) return null;

  const weeksRemaining = Math.abs(remaining / weeklyRate);
  const projectedDate = new Date();
  projectedDate.setDate(projectedDate.getDate() + Math.round(weeksRemaining * 7));

  return projectedDate.toLocaleDateString([], {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
};