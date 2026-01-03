import React, { useState, useEffect } from 'react';
import { useProfile } from '../hooks/useProfile';
import {
  addServiceConnectedCondition,
  updateServiceConnectedCondition,
} from '../utils/profiles';

// List of all trackable conditions in the app
const ALL_CONDITIONS = [
  { key: 'ankleAchilles', name: 'Ankle/Achilles Tendon Condition' },
  { key: 'anxiety', name: 'Anxiety' },
  { key: 'asthma', name: 'Asthma' },
  { key: 'back', name: 'Back/Spine Condition' },
  { key: 'bipolar', name: 'Bipolar Disorder' },
  { key: 'copd', name: 'COPD' },
  { key: 'depression', name: 'Depression' },
  { key: 'diabetes', name: 'Diabetes' },
  { key: 'eczema', name: 'Eczema' },
  { key: 'gerd', name: 'GERD' },
  { key: 'hearingLoss', name: 'Hearing Loss' },
  { key: 'hip', name: 'Hip Condition' },
  { key: 'hipThigh', name: 'Hip/Thigh Condition' },
  { key: 'hypertension', name: 'Hypertension' },
  { key: 'ibs', name: 'Irritable Bowel Syndrome (IBS)' },
  { key: 'knee', name: 'Knee Condition' },
  { key: 'migraine', name: 'Migraine Headaches' },
  { key: 'mentalHealth', name: 'Other Mental Health Condition' },
  { key: 'peripheralNeuropathy', name: 'Peripheral Neuropathy' },
  { key: 'psoriasis', name: 'Psoriasis' },
  { key: 'ptsd', name: 'PTSD' },
  { key: 'radiculopathy', name: 'Radiculopathy' },
  { key: 'rhinitis', name: 'Rhinitis' },
  { key: 'scars', name: 'Scars' },
  { key: 'shoulder', name: 'Shoulder Condition' },
  { key: 'sinusitis', name: 'Sinusitis' },
  { key: 'sleepApnea', name: 'Sleep Apnea' },
  { key: 'tbi', name: 'Traumatic Brain Injury (TBI)' },
  { key: 'tinnitus', name: 'Tinnitus' },
  { key: 'custom', name: '✏️ Enter Custom Condition Name' },
]; // No .sort() needed - already alphabetized

const AddServiceConnectedModal = ({ condition, onClose }) => {
  const { profile: currentProfile, refreshProfile } = useProfile();
  const [formData, setFormData] = useState({
    conditionKey: condition?.conditionKey || '',
    conditionName: condition?.conditionName || '',
    currentRating: condition?.currentRating ?? 0,
    effectiveDate: condition?.effectiveDate || new Date().toISOString().split('T')[0],
    trackingGoal: condition?.trackingGoal || 'maintain',
    notes: condition?.notes || '',
  });

  const [isCustomCondition, setIsCustomCondition] = useState(
      condition?.conditionKey === 'custom' || false
  );

  const isEditing = !!condition;

  const handleSubmit = (e) => {
    e.preventDefault();

    // Safety check for profile
    if (!currentProfile || !currentProfile.id) {
      console.error('❌ No active profile found');
      alert('No active profile found. Please make sure you have a profile selected.');
      return;
    }

    if (!formData.conditionKey) {
      alert('Please select a condition type');
      return;
    }

    if (!formData.conditionName || formData.conditionName.trim() === '') {
      alert('Please enter a condition name');
      return;
    }

    console.log('🔵 Submitting form data:', formData);
    console.log('🔵 Current profile ID:', currentProfile?.id);

    try {
      let result;
      if (isEditing) {
        console.log('🔵 Updating existing condition:', condition.id);
        result = updateServiceConnectedCondition(currentProfile.id, condition.id, formData);
      } else {
        console.log('🔵 Adding new condition');
        result = addServiceConnectedCondition(currentProfile.id, formData);
      }

      console.log('🔵 Save result:', result);

      if (!result || !result.success) {
        throw new Error(result?.message || 'Failed to save condition');
      }

      console.log('🔵 Calling refreshProfile');
      if (typeof refreshProfile === 'function') {
        refreshProfile();
      } else {
        console.warn('⚠️ refreshProfile is not a function, reloading page instead');
        window.location.reload();
      }

      console.log('🔵 Closing modal');
      onClose();
    } catch (error) {
      console.error('❌ Error saving condition:', error);
      alert('Failed to save condition. Please try again.');
    }
  };

  const handleConditionChange = (e) => {
    const selectedKey = e.target.value;
    const selectedCondition = ALL_CONDITIONS.find(c => c.key === selectedKey);

    if (selectedKey === 'custom') {
      setIsCustomCondition(true);
      setFormData({
        ...formData,
        conditionKey: 'custom',
        conditionName: '', // Clear name so user can enter custom
      });
    } else {
      setIsCustomCondition(false);
      setFormData({
        ...formData,
        conditionKey: selectedKey,
        conditionName: selectedCondition?.name || '',
      });
    }
  };

  const RATING_OPTIONS = [0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100];

  return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
        <div className="bg-white dark:bg-gray-800 rounded-lg max-w-2xl w-full max-h-[90vh]
                      overflow-y-auto shadow-xl">
          <div className="sticky top-0 bg-white dark:bg-gray-800 border-b border-gray-200
                        dark:border-gray-700 px-6 py-4 flex items-center justify-between">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              {isEditing ? 'Edit' : 'Add'} Service-Connected Condition
            </h2>
            <button
                onClick={onClose}
                className="text-gray-500 hover:text-gray-700 dark:text-gray-400
                       dark:hover:text-gray-200 text-2xl leading-none"
            >
              ×
            </button>
          </div>

          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            {/* Condition Selection */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                Condition *
              </label>
              <select
                  value={formData.conditionKey}
                  onChange={handleConditionChange}
                  required
                  disabled={isEditing}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600
         rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white
         disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <option value="">Select a condition...</option>
                {ALL_CONDITIONS.map(({ key, name }) => (
                    <option key={key} value={key}>
                      {name}
                    </option>
                ))}
              </select>
              {isEditing && (
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    Condition cannot be changed after creation
                  </p>
              )}
            </div>

            {/* Custom Condition Name Input (shows when "Custom" is selected) */}
            {isCustomCondition && (
                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    Custom Condition Name *
                  </label>
                  <input
                      type="text"
                      value={formData.conditionName}
                      onChange={(e) => setFormData({ ...formData, conditionName: e.target.value })}
                      placeholder="e.g., Right Achilles Tendonitis, Left Hip Trochanteric Pain"
                      required
                      disabled={isEditing}
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600
             rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white
             disabled:opacity-50 disabled:cursor-not-allowed"
                  />
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    Enter the exact condition name from your VA rating decision letter
                  </p>
                </div>
            )}

            {/* Current Rating */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                Current VA Rating *
              </label>
              <div className="grid grid-cols-6 gap-2">
                {RATING_OPTIONS.map((rating) => (
                    <button
                        key={rating}
                        type="button"
                        onClick={() => setFormData({ ...formData, currentRating: rating })}
                        className={`py-2 px-3 rounded-lg border-2 font-semibold transition-all ${
                            formData.currentRating === rating
                                ? 'border-blue-600 bg-blue-600 text-white'
                                : 'border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:border-blue-400'
                        }`}
                    >
                      {rating}%
                    </button>
                ))}
              </div>
            </div>

            {/* Effective Date */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                Effective Date *
              </label>
              <input
                  type="date"
                  value={formData.effectiveDate}
                  onChange={(e) => setFormData({ ...formData, effectiveDate: e.target.value })}
                  required
                  max={new Date().toISOString().split('T')[0]}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600
                         rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                The date your rating became effective (from your rating decision letter)
              </p>
            </div>

            {/* Tracking Goal */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                Tracking Goal
              </label>
              <div className="space-y-2">
                {[
                  { value: 'increase', label: 'Track for Rating Increase', icon: '↑', desc: 'Monitor symptoms to support increase request' },
                  { value: 'reeval', label: 'Pending Re-evaluation', icon: '🔄', desc: 'Scheduled for C&P exam or routine re-eval' },
                  { value: 'maintain', label: 'Maintain Current Rating', icon: '✓', desc: 'Monitor to ensure rating stays stable' },
                ].map(({ value, label, icon, desc }) => (
                    <label
                        key={value}
                        className={`flex items-start gap-3 p-4 border-2 rounded-lg cursor-pointer transition-all ${
                            formData.trackingGoal === value
                                ? 'border-blue-600 bg-blue-50 dark:bg-blue-900/20'
                                : 'border-gray-300 dark:border-gray-600 hover:border-blue-400'
                        }`}
                    >
                      <input
                          type="radio"
                          name="trackingGoal"
                          value={value}
                          checked={formData.trackingGoal === value}
                          onChange={(e) => setFormData({ ...formData, trackingGoal: e.target.value })}
                          className="mt-1"
                      />
                      <div className="flex-1">
                        <div className="flex items-center gap-2 font-semibold text-gray-900 dark:text-white">
                          <span>{icon}</span>
                          <span>{label}</span>
                        </div>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                          {desc}
                        </p>
                      </div>
                    </label>
                ))}
              </div>
            </div>

            {/* Notes */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                Notes (Optional)
              </label>
              <textarea
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  rows={3}
                  placeholder="E.g., 'C&P exam scheduled for March 2025' or 'Symptoms worsening since last eval'"
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600
                         rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white
                         resize-none"
              />
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
              <button
                  type="button"
                  onClick={onClose}
                  className="flex-1 px-6 py-3 bg-gray-100 dark:bg-gray-700 text-gray-700
                         dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600
                         font-semibold transition-colors"
              >
                Cancel
              </button>
              <button
                  type="submit"
                  className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700
                         font-semibold transition-colors"
              >
                {isEditing ? 'Save Changes' : 'Add Condition'}
              </button>
            </div>
          </form>
        </div>
      </div>
  );
};

export default AddServiceConnectedModal;