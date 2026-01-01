import React, { useState } from 'react';
import { useProfile } from '../hooks/useProfile';
import {
  getServiceConnectedConditions,
  removeServiceConnectedCondition,
} from '../utils/profiles'; // CORRECTED: Import from profiles.js
import AddServiceConnectedModal from './AddServiceConnectedModal';
import { calculateCombinedRating, calculateCombinedRatingDetailed, getRatingColor } from '../utils/vaRatingCalculator';

const ServiceConnectedConditions = () => {
  const { profile: currentProfile, refreshProfile } = useProfile();
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingCondition, setEditingCondition] = useState(null);

  if (!currentProfile) {
    return (
        <div className="text-center py-8">
          <p className="text-gray-600 dark:text-gray-400">No active profile</p>
        </div>
    );
  }

  const conditions = getServiceConnectedConditions(currentProfile.id);

  const handleRemove = (conditionId) => {
    if (window.confirm('Remove this service-connected condition from your profile?')) {
      const result = removeServiceConnectedCondition(currentProfile.id, conditionId);
      if (result.success) {
        refreshProfile(); // Trigger re-render
      } else {
        alert(result.message || 'Failed to remove condition');
      }
    }
  };

  const handleEdit = (condition) => {
    setEditingCondition(condition);
    setShowAddModal(true);
  };

  const handleModalClose = () => {
    setShowAddModal(false);
    setEditingCondition(null);
    refreshProfile(); // Refresh after add/edit
  };

  const getRatingBadgeColor = (rating) => {
    if (rating === 0) return 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300';
    if (rating >= 70) return 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-200';
    if (rating >= 50) return 'bg-orange-100 dark:bg-orange-900/30 text-orange-800 dark:text-orange-200';
    if (rating >= 30) return 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-200';
    return 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200';
  };

  const getTrackingGoalLabel = (goal) => {
    switch (goal) {
      case 'increase': return 'Seeking Increase';
      case 'reeval': return 'Pending Re-evaluation';
      case 'maintain': return 'Maintaining Rating';
      default: return 'Monitoring';
    }
  };

  const getTrackingGoalIcon = (goal) => {
    switch (goal) {
      case 'increase': return '↑';
      case 'reeval': return '🔄';
      case 'maintain': return '✓';
      default: return '📊';
    }
  };

  return (
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              My Service-Connected Conditions
            </h2>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              Track your existing VA disability ratings and monitor for increases
            </p>
          </div>
          <button
              onClick={() => {
                setEditingCondition(null);
                setShowAddModal(true);
              }}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700
                     transition-colors flex items-center gap-2"
          >
            <span className="text-lg">+</span>
            Add Condition
          </button>
        </div>

        {/* Info Banner for Veteran Profiles */}
        {currentProfile?.type === 'veteran' && (
            <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800
                        rounded-lg p-4">
              <div className="flex gap-3">
                <span className="text-2xl">ℹ️</span>
                <div className="flex-1">
                  <h3 className="font-semibold text-blue-900 dark:text-blue-200 mb-1">
                    Why Track Service-Connected Conditions?
                  </h3>
                  <ul className="text-sm text-blue-800 dark:text-blue-300 space-y-1">
                    <li>• Document symptom progression for rating increase requests</li>
                    <li>• Monitor compliance for re-evaluations (e.g., Sleep Apnea)</li>
                    <li>• Generate focused exports showing evidence of worsening</li>
                    <li>• Compare current symptoms against your existing rating level</li>
                  </ul>
                </div>
              </div>
            </div>
        )}

        {/* Combined Rating Display */}
        {conditions.length > 0 && (
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20
                  rounded-lg border-2 border-blue-200 dark:border-blue-700 p-6 mb-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
                    Combined VA Rating
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Calculated using VA's "whole person" method (38 CFR Part 4.25)
                  </p>
                </div>
                <div className="text-right">
                  <div className={`inline-flex items-center px-6 py-3 rounded-xl text-4xl font-bold
                        ${getRatingColor(calculateCombinedRating(conditions.map(c => c.currentRating))) === 'red'
                      ? 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400'
                      : getRatingColor(calculateCombinedRating(conditions.map(c => c.currentRating))) === 'orange'
                          ? 'bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-400'
                          : getRatingColor(calculateCombinedRating(conditions.map(c => c.currentRating))) === 'yellow'
                              ? 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400'
                              : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                  }`}>
                    {calculateCombinedRating(conditions.map(c => c.currentRating))}%
                  </div>
                </div>
              </div>
            </div>
        )}

        {/* Show calculation breakdown (optional) */}
        {conditions.length > 0 && (
            <details className="mt-3 text-sm">
              <summary className="cursor-pointer text-blue-600 dark:text-blue-400 hover:underline">
                Show calculation details
              </summary>
              <div className="mt-3 space-y-2 bg-white dark:bg-gray-800 rounded p-3">
                <p className="font-semibold">VA Combined Rating Calculation:</p>
                {(() => {
                  const detailed = calculateCombinedRatingDetailed(conditions);
                  return (
                      <>
                        {detailed.breakdown?.map((step) => (
                            <div key={step.step} className="text-xs text-gray-600 dark:text-gray-400">
                              Step {step.step}: {step.conditionName} ({step.rating}%) →
                              {step.remainingEfficiency?.toFixed(1) || '0.0'}% efficiency remaining
                            </div>
                        ))}
                        <div className="pt-2 border-t border-gray-200 dark:border-gray-700 font-semibold">
                          Final: {calculateCombinedRating(conditions.map(c => c.currentRating))}%
                          (rounded from {detailed.totalDisability?.toFixed(1) || '0.0'}%)
                        </div>
                      </>
                  );
                })()}
              </div>
            </details>
        )}

        {/* Conditions List */}
        {conditions.length === 0 ? (
            <div className="text-center py-12 bg-gray-50 dark:bg-gray-800 rounded-lg border-2
                        border-dashed border-gray-300 dark:border-gray-600">
              <span className="text-6xl mb-4 block">📋</span>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                No Service-Connected Conditions Yet
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                Add your existing VA disability ratings to track symptoms and document changes
              </p>
              <button
                  onClick={() => setShowAddModal(true)}
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700
                       transition-colors"
              >
                Add Your First Condition
              </button>
            </div>
        ) : (
            <div className="space-y-4">
              {conditions.map((condition) => (
                  <div
                      key={condition.id}
                      className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200
                         dark:border-gray-700 p-6 hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                            {condition.conditionName}
                          </h3>
                          <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                              getRatingBadgeColor(condition.currentRating)
                          }`}>
                      {condition.currentRating}%
                    </span>
                        </div>

                        <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
                    <span>
                      <strong>Effective:</strong>{' '}
                      {new Date(condition.effectiveDate).toLocaleDateString()}
                    </span>
                          <span className="flex items-center gap-1">
                      <span>{getTrackingGoalIcon(condition.trackingGoal)}</span>
                      <strong>{getTrackingGoalLabel(condition.trackingGoal)}</strong>
                    </span>
                        </div>

                        {condition.notes && (
                            <p className="mt-3 text-sm text-gray-700 dark:text-gray-300
                                  bg-gray-50 dark:bg-gray-900/50 p-3 rounded">
                              {condition.notes}
                            </p>
                        )}
                      </div>

                      <div className="flex gap-2 ml-4">
                        <button
                            onClick={() => handleEdit(condition)}
                            className="px-3 py-1.5 text-sm bg-gray-100 dark:bg-gray-700
                               text-gray-700 dark:text-gray-300 rounded hover:bg-gray-200
                               dark:hover:bg-gray-600 transition-colors"
                        >
                          Edit
                        </button>
                        <button
                            onClick={() => handleRemove(condition.id)}
                            className="px-3 py-1.5 text-sm bg-red-100 dark:bg-red-900/30
                               text-red-700 dark:text-red-300 rounded hover:bg-red-200
                               dark:hover:bg-red-900/50 transition-colors"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  </div>
              ))}
            </div>
        )}

        {/* Add/Edit Modal */}
        {showAddModal && (
            <AddServiceConnectedModal
                condition={editingCondition}
                onClose={handleModalClose}
            />
        )}
      </div>
  );
};

export default ServiceConnectedConditions;