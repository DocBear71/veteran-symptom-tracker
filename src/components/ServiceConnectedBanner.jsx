import React from 'react';
import { getServiceConnectedCondition } from '../utils/profiles';
import { useProfile } from '../hooks/useProfile';

/**
 * Banner showing service-connected status on rating cards
 * Displays current rating, effective date, and whether increase is supported
 */
const ServiceConnectedBanner = ({ conditionKey, currentAnalysis }) => {
  const { profile } = useProfile();

  if (!profile || profile.type !== 'veteran') {
    return null;
  }

  const scCondition = getServiceConnectedCondition(profile.id, conditionKey);

  if (!scCondition) {
    return null; // Not service-connected
  }

  // Determine if increase is supported
  const supportsIncrease = currentAnalysis?.rating > scCondition.currentRating;

  return (
      <div className="mb-6 bg-blue-50 dark:bg-blue-900/20 border-2 border-blue-200 dark:border-blue-700 rounded-lg p-4">
        <div className="flex items-start gap-3">
          <div className="flex-shrink-0">
            <svg className="w-6 h-6 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>

          <div className="flex-1 min-w-0">
            <h3 className="text-sm font-semibold text-blue-900 dark:text-blue-100 mb-2">
              Currently Service-Connected
            </h3>

            <div className="grid grid-cols-2 gap-4 text-sm mb-3">
              <div>
                <span className="text-blue-700 dark:text-blue-300 font-medium">Current Rating:</span>
                <span className="ml-2 font-bold text-blue-900 dark:text-blue-100">
                {scCondition.currentRating}%
              </span>
              </div>
              <div>
                <span className="text-blue-700 dark:text-blue-300 font-medium">Effective:</span>
                <span className="ml-2 text-blue-900 dark:text-blue-100">
                {new Date(scCondition.effectiveDate).toLocaleDateString('en-US', {
                  month: '2-digit',
                  day: '2-digit',
                  year: 'numeric'
                })}
              </span>
              </div>
            </div>

            <div className="flex items-center gap-2 text-sm">
              <span className="text-blue-700 dark:text-blue-300 font-medium">Tracking Goal:</span>
              <span className="inline-flex items-center gap-1 text-blue-900 dark:text-blue-100">
              {scCondition.trackingGoal === 'increase' && '↑ Seeking Increase'}
                {scCondition.trackingGoal === 'reeval' && '🔄 Pending Re-evaluation'}
                {scCondition.trackingGoal === 'maintain' && '✓ Maintaining Rating'}
            </span>
            </div>

            {/* Increase Recommendation */}
            {supportsIncrease && scCondition.trackingGoal === 'increase' && (
                <div className="mt-3 pt-3 border-t border-blue-200 dark:border-blue-700">
                  <div className="flex items-start gap-2">
                    <svg className="w-5 h-5 text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <div className="text-sm">
                      <p className="font-semibold text-green-800 dark:text-green-300">
                        Current symptoms support {currentAnalysis.rating}% rating
                      </p>
                      <p className="text-green-700 dark:text-green-400 mt-1">
                        Your documented symptoms meet the criteria for a higher rating than your current {scCondition.currentRating}%.
                        Consider filing for an increase.
                      </p>
                    </div>
                  </div>
                </div>
            )}

            {/* Notes */}
            {scCondition.notes && (
                <div className="mt-3 pt-3 border-t border-blue-200 dark:border-blue-700">
                  <p className="text-xs text-blue-700 dark:text-blue-300 font-medium mb-1">Notes:</p>
                  <p className="text-sm text-blue-900 dark:text-blue-100 italic">
                    "{scCondition.notes}"
                  </p>
                </div>
            )}
          </div>
        </div>
      </div>
  );
};

export default ServiceConnectedBanner;