// RatingScenarioCalculator.jsx - "What If" VA Rating Calculator
// Allows veterans to explore hypothetical rating scenarios
// Uses VA Math (whole person method) from 38 CFR Part 4.25

import React, { useState, useEffect, useMemo } from 'react';
import { useProfile } from '../hooks/useProfile';
import { getServiceConnectedConditions } from '../utils/profiles';
import {
  calculateCombinedRating,
  calculateCombinedRatingDetailed,
  getRatingColor,
} from '../utils/vaRatingCalculator';

// ============================================
// CONSTANTS
// ============================================

// Common VA conditions for the dropdown
const COMMON_CONDITIONS = [
  { name: 'Sleep Apnea', code: '6847', commonRatings: [0, 30, 50, 100] },
  { name: 'PTSD', code: '9411', commonRatings: [0, 10, 30, 50, 70, 100] },
  { name: 'Major Depressive Disorder', code: '9434', commonRatings: [0, 10, 30, 50, 70, 100] },
  { name: 'Generalized Anxiety Disorder', code: '9400', commonRatings: [0, 10, 30, 50, 70, 100] },
  { name: 'Tinnitus', code: '6260', commonRatings: [10] },
  { name: 'Hearing Loss (Bilateral)', code: '6100', commonRatings: [0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100] },
  { name: 'Migraine Headaches', code: '8100', commonRatings: [0, 10, 30, 50] },
  { name: 'Lumbosacral Strain (Low Back)', code: '5237', commonRatings: [0, 10, 20, 40, 50, 60, 100] },
  { name: 'Cervical Strain (Neck)', code: '5237', commonRatings: [0, 10, 20, 30, 40, 50, 100] },
  { name: 'Intervertebral Disc Syndrome', code: '5243', commonRatings: [0, 10, 20, 40, 60] },
  { name: 'Knee Instability', code: '5257', commonRatings: [0, 10, 20, 30] },
  { name: 'Knee Limited Flexion', code: '5260', commonRatings: [0, 10, 20, 30] },
  { name: 'Knee Limited Extension', code: '5261', commonRatings: [0, 10, 20, 30, 40, 50] },
  { name: 'Ankle Limited Motion', code: '5271', commonRatings: [0, 10, 20] },
  { name: 'Shoulder Limited Motion', code: '5201', commonRatings: [20, 30, 40] },
  { name: 'Hip Limited Flexion', code: '5252', commonRatings: [0, 10, 20, 30, 40] },
  { name: 'Radiculopathy (Upper Extremity)', code: '8510-8719', commonRatings: [0, 10, 20, 30, 40, 50, 60, 70] },
  { name: 'Radiculopathy (Lower Extremity)', code: '8520-8730', commonRatings: [0, 10, 20, 40, 60, 80] },
  { name: 'Peripheral Neuropathy', code: '8599-8520', commonRatings: [0, 10, 20, 40] },
  { name: 'Diabetes Mellitus Type II', code: '7913', commonRatings: [10, 20, 40, 60, 100] },
  { name: 'Hypertension', code: '7101', commonRatings: [0, 10, 20, 40, 60] },
  { name: 'GERD', code: '7346', commonRatings: [0, 10, 30, 60] },
  { name: 'IBS', code: '7319', commonRatings: [0, 10, 30] },
  { name: 'Rhinitis (Allergic)', code: '6522', commonRatings: [0, 10, 30] },
  { name: 'Sinusitis', code: '6510-6514', commonRatings: [0, 10, 30, 50] },
  { name: 'Asthma', code: '6602', commonRatings: [0, 10, 30, 60, 100] },
  { name: 'Eczema/Dermatitis', code: '7806', commonRatings: [0, 10, 30, 60] },
  { name: 'Psoriasis', code: '7816', commonRatings: [0, 10, 30, 60] },
  { name: 'Scars (Painful/Unstable)', code: '7804', commonRatings: [10, 20, 30] },
  { name: 'Erectile Dysfunction', code: '7522', commonRatings: [0] }, // SMC-K eligible
  { name: 'Plantar Fasciitis', code: '5276', commonRatings: [0, 10, 20, 30, 50] },
  { name: 'TBI Residuals', code: '8045', commonRatings: [0, 10, 40, 70, 100] },
  { name: 'Chronic Fatigue Syndrome', code: '6354', commonRatings: [0, 10, 20, 40, 60, 100] },
  { name: 'Fibromyalgia', code: '5025', commonRatings: [0, 10, 20, 40] },
  { name: 'Coronary Artery Disease', code: '7005', commonRatings: [0, 10, 30, 60, 100] },
  { name: 'Cardiomyopathy', code: '7020', commonRatings: [0, 10, 30, 60, 100] },
  { name: 'Flatfoot (Pes Planus)', code: '5276', commonRatings: [0, 10, 20, 30, 50] },
  { name: 'CUSTOM - Enter Your Own', code: 'CUSTOM', commonRatings: [0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100] },
].sort((a, b) => a.name.localeCompare(b.name));

// All possible VA rating percentages
const ALL_RATINGS = [0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100];

// localStorage key for saved scenarios
const STORAGE_KEY = 'rating-scenarios';

// ============================================
// COMPONENT
// ============================================

const RatingScenarioCalculator = ({ embedded = false, onClose }) => {
  const { profile } = useProfile();

  // State for service-connected conditions from profile
  const [serviceConnectedConditions, setServiceConnectedConditions] = useState([]);

  // State for hypothetical conditions added by user
  const [hypotheticalConditions, setHypotheticalConditions] = useState([]);

  // State for the "add condition" form
  const [newCondition, setNewCondition] = useState({
    name: '',
    customName: '',
    rating: 30,
    code: '',
  });

  // State for saved scenarios
  const [savedScenarios, setSavedScenarios] = useState([]);
  const [scenarioName, setScenarioName] = useState('');
  const [showSaveModal, setShowSaveModal] = useState(false);
  const [compareMode, setCompareMode] = useState(false);
  const [selectedScenarioId, setSelectedScenarioId] = useState(null);

  // State for educational section
  const [showEducation, setShowEducation] = useState(false);

  // ============================================
  // EFFECTS
  // ============================================

  // Load service-connected conditions from profile
  useEffect(() => {
    if (profile?.id) {
      const conditions = getServiceConnectedConditions(profile.id);
      setServiceConnectedConditions(conditions || []);
    }
  }, [profile]);

  // Load saved scenarios from localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        setSavedScenarios(JSON.parse(saved));
      }
    } catch (e) {
      console.error('Error loading saved scenarios:', e);
    }
  }, []);

  // ============================================
  // CALCULATIONS
  // ============================================

  // Calculate current rating from service-connected conditions only
  const currentRating = useMemo(() => {
    if (serviceConnectedConditions.length === 0) return 0;
    return calculateCombinedRating(serviceConnectedConditions.map(c => c.currentRating));
  }, [serviceConnectedConditions]);

  // Calculate new rating including hypothetical conditions
  const projectedRating = useMemo(() => {
    const allRatings = [
      ...serviceConnectedConditions.map(c => c.currentRating),
      ...hypotheticalConditions.map(c => c.rating),
    ];
    if (allRatings.length === 0) return 0;
    return calculateCombinedRating(allRatings);
  }, [serviceConnectedConditions, hypotheticalConditions]);

  // Get detailed breakdown for the projected scenario
  const projectedBreakdown = useMemo(() => {
    const allConditions = [
      ...serviceConnectedConditions.map(c => ({
        conditionName: c.conditionName,
        currentRating: c.currentRating,
        isExisting: true,
      })),
      ...hypotheticalConditions.map(c => ({
        conditionName: c.name,
        currentRating: c.rating,
        isExisting: false,
      })),
    ];
    return calculateCombinedRatingDetailed(allConditions);
  }, [serviceConnectedConditions, hypotheticalConditions]);

  // Calculate rating difference
  const ratingDifference = projectedRating - currentRating;

  // ============================================
  // HANDLERS
  // ============================================

  // Handle condition selection from dropdown
  const handleConditionSelect = (e) => {
    const selectedName = e.target.value;
    const condition = COMMON_CONDITIONS.find(c => c.name === selectedName);

    if (condition) {
      setNewCondition({
        name: selectedName,
        customName: selectedName === 'CUSTOM - Enter Your Own' ? '' : selectedName,
        rating: condition.commonRatings[Math.floor(condition.commonRatings.length / 2)] || 30,
        code: condition.code,
      });
    }
  };

  // Handle adding a hypothetical condition
  const handleAddCondition = () => {
    const conditionName = newCondition.name === 'CUSTOM - Enter Your Own'
        ? newCondition.customName
        : newCondition.name;

    if (!conditionName || conditionName.trim() === '') {
      alert('Please select or enter a condition name');
      return;
    }

    const newHypothetical = {
      id: `hyp-${Date.now()}`,
      name: conditionName.trim(),
      rating: newCondition.rating,
      code: newCondition.code,
    };

    setHypotheticalConditions(prev => [...prev, newHypothetical]);

    // Reset form
    setNewCondition({
      name: '',
      customName: '',
      rating: 30,
      code: '',
    });
  };

  // Handle removing a hypothetical condition
  const handleRemoveCondition = (id) => {
    setHypotheticalConditions(prev => prev.filter(c => c.id !== id));
  };

  // Handle updating a hypothetical condition's rating
  const handleUpdateRating = (id, newRating) => {
    setHypotheticalConditions(prev =>
        prev.map(c => c.id === id ? { ...c, rating: parseInt(newRating) } : c)
    );
  };

  // Save current scenario
  const handleSaveScenario = () => {
    if (!scenarioName.trim()) {
      alert('Please enter a name for this scenario');
      return;
    }

    const scenario = {
      id: `scenario-${Date.now()}`,
      name: scenarioName.trim(),
      createdAt: new Date().toISOString(),
      currentRating,
      projectedRating,
      hypotheticalConditions: [...hypotheticalConditions],
      serviceConnectedSnapshot: serviceConnectedConditions.map(c => ({
        name: c.conditionName,
        rating: c.currentRating,
      })),
    };

    const updated = [...savedScenarios, scenario];
    setSavedScenarios(updated);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));

    setScenarioName('');
    setShowSaveModal(false);
  };

  // Load a saved scenario
  const handleLoadScenario = (scenario) => {
    setHypotheticalConditions(scenario.hypotheticalConditions || []);
    setCompareMode(false);
    setSelectedScenarioId(null);
  };

  // Delete a saved scenario
  const handleDeleteScenario = (id) => {
    if (window.confirm('Delete this saved scenario?')) {
      const updated = savedScenarios.filter(s => s.id !== id);
      setSavedScenarios(updated);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    }
  };

  // Clear all hypothetical conditions
  const handleClearAll = () => {
    if (hypotheticalConditions.length === 0) return;
    if (window.confirm('Clear all hypothetical conditions?')) {
      setHypotheticalConditions([]);
    }
  };

  // ============================================
  // HELPER FUNCTIONS
  // ============================================

  // Get color classes for rating badges
  const getRatingBadgeClasses = (rating) => {
    const color = getRatingColor(rating);
    switch (color) {
      case 'red':
        return 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400';
      case 'orange':
        return 'bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-400';
      case 'yellow':
        return 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400';
      case 'green':
        return 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400';
      default:
        return 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300';
    }
  };

  // Get color for difference indicator
  const getDifferenceColor = (diff) => {
    if (diff > 0) return 'text-green-600 dark:text-green-400';
    if (diff < 0) return 'text-red-600 dark:text-red-400';
    return 'text-gray-500 dark:text-gray-400';
  };

  // ============================================
  // RENDER
  // ============================================

  return (
      <div className={`${embedded ? '' : 'min-h-screen bg-gray-50 dark:bg-gray-900'}`}>
        <div className={`${embedded ? 'p-4' : 'p-6 max-w-4xl mx-auto'}`}>

          {/* Header */}
          <div className="bg-gradient-to-r from-indigo-900 to-purple-800 dark:from-gray-800 dark:to-gray-700 rounded-lg p-6 text-white mb-6">
            <h2 className="text-2xl font-bold flex items-center gap-3">
              <span className="text-3xl">🧮</span>
              Rating Scenario Calculator
            </h2>
            <p className="text-indigo-100 dark:text-gray-300 mt-2 text-left">
              Explore "what if" scenarios to see how additional conditions might affect your combined VA disability rating.
            </p>
          </div>

          {/* Current vs Projected Rating Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            {/* Current Rating */}
            <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-5">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400 uppercase tracking-wide">
                  Current Rating
                </h3>
                <span className="text-xs text-gray-500 dark:text-gray-500">
                {serviceConnectedConditions.length} condition{serviceConnectedConditions.length !== 1 ? 's' : ''}
              </span>
              </div>
              <div className={`inline-flex items-center px-5 py-3 rounded-xl text-4xl font-bold ${getRatingBadgeClasses(currentRating)}`}>
                {currentRating}%
              </div>
              {serviceConnectedConditions.length === 0 && (
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-3">
                    No service-connected conditions in profile
                  </p>
              )}
            </div>

            {/* Projected Rating */}
            <div className="bg-white dark:bg-gray-800 rounded-lg border-2 border-indigo-200 dark:border-indigo-700 p-5">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-medium text-indigo-600 dark:text-indigo-400 uppercase tracking-wide">
                  Projected Rating
                </h3>
                {hypotheticalConditions.length > 0 && (
                    <span className={`text-sm font-semibold ${getDifferenceColor(ratingDifference)}`}>
                  {ratingDifference > 0 ? '+' : ''}{ratingDifference}%
                </span>
                )}
              </div>
              <div className={`inline-flex items-center px-5 py-3 rounded-xl text-4xl font-bold ${getRatingBadgeClasses(projectedRating)}`}>
                {projectedRating}%
              </div>
              {hypotheticalConditions.length === 0 ? (
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-3">
                    Add hypothetical conditions below
                  </p>
              ) : (
                  <p className="text-sm text-indigo-600 dark:text-indigo-400 mt-3">
                    +{hypotheticalConditions.length} hypothetical condition{hypotheticalConditions.length !== 1 ? 's' : ''}
                  </p>
              )}
            </div>
          </div>

          {/* Impact Summary Banner */}
          {hypotheticalConditions.length > 0 && ratingDifference !== 0 && (
              <div className={`rounded-lg p-4 mb-6 ${
                  ratingDifference > 0
                      ? 'bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800'
                      : 'bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800'
              }`}>
                <div className="flex items-start gap-3">
                  <span className="text-2xl">{ratingDifference > 0 ? '📈' : '📉'}</span>
                  <div>
                    <h4 className={`font-semibold text-left ${
                        ratingDifference > 0
                            ? 'text-green-800 dark:text-green-200'
                            : 'text-amber-800 dark:text-amber-200'
                    }`}>
                      {ratingDifference > 0 ? 'Potential Rating Increase' : 'Rating Would Decrease'}
                    </h4>
                    <p className={`text-sm mt-1 text-left ${
                        ratingDifference > 0
                            ? 'text-green-700 dark:text-green-300'
                            : 'text-amber-700 dark:text-amber-300'
                    }`}>
                      Adding these conditions would change your combined rating from{' '}
                      <strong>{currentRating}%</strong> to <strong>{projectedRating}%</strong>
                      {ratingDifference > 0 && projectedRating >= 100 && (
                          <span className="block mt-1 font-medium">
                      ⭐ This would qualify for 100% schedular rating!
                    </span>
                      )}
                    </p>
                  </div>
                </div>
              </div>
          )}

          {/* Add Hypothetical Condition Form */}
          <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-5 mb-6">
            <h3 className="font-semibold text-lg text-gray-900 dark:text-white mb-4 flex items-center gap-2">
              <span>➕</span>
              Add Hypothetical Condition
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Condition Dropdown */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Select Condition
                </label>
                <select
                    value={newCondition.name}
                    onChange={handleConditionSelect}
                    className="w-full px-3 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg
                         bg-white dark:bg-gray-700 text-gray-900 dark:text-white
                         focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="">-- Select a condition --</option>
                  {COMMON_CONDITIONS.map(condition => (
                      <option key={condition.name} value={condition.name}>
                        {condition.name} {condition.code !== 'CUSTOM' ? `(DC ${condition.code})` : ''}
                      </option>
                  ))}
                </select>
              </div>

              {/* Rating Dropdown */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Rating %
                </label>
                <select
                    value={newCondition.rating}
                    onChange={(e) => setNewCondition(prev => ({ ...prev, rating: parseInt(e.target.value) }))}
                    className="w-full px-3 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg
                         bg-white dark:bg-gray-700 text-gray-900 dark:text-white
                         focus:ring-2 focus:ring-indigo-500"
                >
                  {ALL_RATINGS.map(rating => (
                      <option key={rating} value={rating}>{rating}%</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Custom Condition Name Input */}
            {newCondition.name === 'CUSTOM - Enter Your Own' && (
                <div className="mt-4">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Custom Condition Name
                  </label>
                  <input
                      type="text"
                      value={newCondition.customName}
                      onChange={(e) => setNewCondition(prev => ({ ...prev, customName: e.target.value }))}
                      placeholder="Enter condition name..."
                      className="w-full px-3 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg
                         bg-white dark:bg-gray-700 text-gray-900 dark:text-white
                         focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
            )}

            {/* Add Button */}
            <div className="mt-4 flex gap-3">
              <button
                  onClick={handleAddCondition}
                  disabled={!newCondition.name}
                  className="px-5 py-2.5 bg-indigo-600 text-white rounded-lg font-medium
                       hover:bg-indigo-700 disabled:bg-gray-400 disabled:cursor-not-allowed
                       transition-colors flex items-center gap-2"
              >
                <span>➕</span>
                Add to Scenario
              </button>
              {hypotheticalConditions.length > 0 && (
                  <button
                      onClick={handleClearAll}
                      className="px-4 py-2.5 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20
                         rounded-lg font-medium transition-colors"
                  >
                    Clear All
                  </button>
              )}
            </div>
          </div>

          {/* Hypothetical Conditions List */}
          {hypotheticalConditions.length > 0 && (
              <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-5 mb-6">
                <h3 className="font-semibold text-lg text-gray-900 dark:text-white mb-4 flex items-center justify-between">
              <span className="flex items-center gap-2">
                <span>🔮</span>
                Hypothetical Conditions ({hypotheticalConditions.length})
              </span>
                  <button
                      onClick={() => setShowSaveModal(true)}
                      className="text-sm px-3 py-1.5 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                  >
                    💾 Save Scenario
                  </button>
                </h3>

                <div className="space-y-3">
                  {hypotheticalConditions.map((condition) => (
                      <div
                          key={condition.id}
                          className="flex items-center justify-between p-3 bg-indigo-50 dark:bg-indigo-900/20
                           rounded-lg border border-indigo-200 dark:border-indigo-800"
                      >
                        <div className="flex-1">
                    <span className="font-medium text-gray-900 dark:text-white">
                      {condition.name}
                    </span>
                          {condition.code && condition.code !== 'CUSTOM' && (
                              <span className="text-xs text-gray-500 dark:text-gray-400 ml-2">
                        DC {condition.code}
                      </span>
                          )}
                        </div>

                        <div className="flex items-center gap-3">
                          {/* Editable Rating */}
                          <select
                              value={condition.rating}
                              onChange={(e) => handleUpdateRating(condition.id, e.target.value)}
                              className="px-2 py-1 border border-indigo-300 dark:border-indigo-600 rounded
                               bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
                          >
                            {ALL_RATINGS.map(rating => (
                                <option key={rating} value={rating}>{rating}%</option>
                            ))}
                          </select>

                          {/* Remove Button */}
                          <button
                              onClick={() => handleRemoveCondition(condition.id)}
                              className="text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/30
                               p-1.5 rounded transition-colors"
                              title="Remove condition"
                          >
                            ✕
                          </button>
                        </div>
                      </div>
                  ))}
                </div>
              </div>
          )}

          {/* Calculation Breakdown */}
          {(serviceConnectedConditions.length > 0 || hypotheticalConditions.length > 0) && (
              <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-5 mb-6">
                <h3 className="font-semibold text-lg text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                  <span>📊</span>
                  VA Math Calculation Breakdown
                </h3>

                <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4">
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                    VA uses the "whole person" theory: each disability applies to your remaining efficiency, not simple addition.
                  </p>

                  <div className="space-y-2 text-left">
                    <div className="text-sm font-medium text-gray-700 dark:text-gray-300 pb-2 border-b border-gray-200 dark:border-gray-600">
                      Starting: 100% whole person (efficiency)
                    </div>

                    {projectedBreakdown.breakdown?.map((step, index) => (
                        <div
                            key={index}
                            className={`text-sm py-2 border-b border-gray-200 dark:border-gray-600 ${
                                !serviceConnectedConditions.find(c => c.conditionName === step.conditionName)
                                    ? 'bg-indigo-50 dark:bg-indigo-900/20 -mx-2 px-2 rounded'
                                    : ''
                            }`}
                        >
                          <div className="flex justify-between items-center">
                      <span className="text-gray-900 dark:text-white">
                        <strong>Step {step.step}:</strong> {step.conditionName}
                        {!serviceConnectedConditions.find(c => c.conditionName === step.conditionName) && (
                            <span className="ml-2 text-xs bg-indigo-200 dark:bg-indigo-800 text-indigo-700 dark:text-indigo-300 px-1.5 py-0.5 rounded">
                            hypothetical
                          </span>
                        )}
                      </span>
                            <span className="font-mono text-gray-600 dark:text-gray-400">
                        {step.rating}%
                      </span>
                          </div>
                          <div className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                            {step.rating}% of {(step.remainingEfficiency + step.disabilityAdded).toFixed(1)}% =
                            {' '}{step.disabilityAdded.toFixed(1)}% disability added →
                            {' '}{step.remainingEfficiency.toFixed(1)}% efficiency remaining
                          </div>
                        </div>
                    ))}

                    <div className="pt-3 flex justify-between items-center text-base font-semibold">
                  <span className="text-gray-900 dark:text-white">
                    Combined Disability:
                  </span></div>
                    <div>
                      <span className="text-gray-900 dark:text-white">
                    {projectedBreakdown.totalDisability?.toFixed(1)}% → rounds to {projectedRating}%
                  </span>
                    </div>
                  </div>
                </div>
              </div>
          )}

          {/* Saved Scenarios */}
          {savedScenarios.length > 0 && (
              <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-5 mb-6">
                <h3 className="font-semibold text-lg text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                  <span>📁</span>
                  Saved Scenarios ({savedScenarios.length})
                </h3>

                <div className="space-y-3">
                  {savedScenarios.map((scenario) => (
                      <div
                          key={scenario.id}
                          className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg"
                      >
                        <div className="flex-1">
                          <div className="font-medium text-gray-900 dark:text-white">
                            {scenario.name}
                          </div>
                          <div className="text-sm text-gray-500 dark:text-gray-400">
                            {scenario.currentRating}% → {scenario.projectedRating}%
                            <span className={`ml-2 ${getDifferenceColor(scenario.projectedRating - scenario.currentRating)}`}>
                        ({scenario.projectedRating - scenario.currentRating > 0 ? '+' : ''}
                              {scenario.projectedRating - scenario.currentRating}%)
                      </span>
                            <span className="mx-2">•</span>
                            {scenario.hypotheticalConditions?.length || 0} conditions
                            <span className="mx-2">•</span>
                            {new Date(scenario.createdAt).toLocaleDateString()}
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <button
                              onClick={() => handleLoadScenario(scenario)}
                              className="px-3 py-1.5 text-sm bg-indigo-600 text-white rounded hover:bg-indigo-700 transition-colors"
                          >
                            Load
                          </button>
                          <button
                              onClick={() => handleDeleteScenario(scenario.id)}
                              className="px-3 py-1.5 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded transition-colors"
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                  ))}
                </div>
              </div>
          )}

          {/* Educational Section */}
          <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden mb-6">
            <button
                onClick={() => setShowEducation(!showEducation)}
                className="w-full px-5 py-4 flex items-center justify-between text-left hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
            >
            <span className="font-semibold text-lg text-gray-900 dark:text-white flex items-center gap-2">
              <span>📚</span>
              Understanding VA Math
            </span>
              <span className="text-2xl text-gray-400">
              {showEducation ? '−' : '+'}
            </span>
            </button>

            {showEducation && (
                <div className="px-5 pb-5 border-t border-gray-200 dark:border-gray-700 pt-4">
                  <div className="space-y-4 text-sm text-gray-700 dark:text-gray-300">
                    <div>
                      <h4 className="font-semibold text-gray-900 dark:text-white mb-2">
                        Why 50% + 30% ≠ 80%
                      </h4>
                      <p className="text-left">
                        The VA uses the "whole person" theory from 38 CFR Part 4.25. Instead of simple addition,
                        each disability rating applies to your <em>remaining</em> efficiency (the "whole" that's left).
                      </p>
                    </div>

                    <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4">
                      <h4 className="font-semibold text-blue-900 dark:text-blue-200 mb-2">
                        Example: 50% + 30%
                      </h4>
                      <ol className="list-decimal list-inside space-y-1 text-blue-800 dark:text-blue-300 text-left">
                        <li>Start with 100% efficiency (whole person)</li>
                        <li>50% disability = 50% of 100% = 50% disabled, 50% remaining</li>
                        <li>30% disability = 30% of 50% = 15% more disabled</li>
                        <li>Total: 50% + 15% = <strong>65%</strong> (not 80%)</li>
                        <li>Rounded to nearest 10%: <strong>70%</strong></li>
                      </ol>
                    </div>

                    <div>
                      <h4 className="font-semibold text-gray-900 dark:text-white mb-2">
                        The Formula
                      </h4>
                      <div className="bg-gray-100 dark:bg-gray-700 rounded p-3 font-mono text-sm">
                        Combined = 1 - ((1 - r₁) × (1 - r₂) × (1 - r₃)...)
                      </div>
                      <p className="mt-2 text-left">
                        Where r₁, r₂, r₃ are the individual ratings as decimals.
                      </p>
                    </div>

                    <div>
                      <h4 className="font-semibold text-gray-900 dark:text-white mb-2">
                        Key Points
                      </h4>
                      <ul className="list-disc list-inside space-y-1 text-left">
                        <li>Higher ratings are applied first</li>
                        <li>Each additional condition has diminishing returns</li>
                        <li>Final rating is rounded to the nearest 10%</li>
                        <li>0% ratings don't affect the calculation</li>
                        <li>Bilateral conditions (same body part, both sides) get a special bilateral factor</li>
                      </ul>
                    </div>

                    <div className="bg-yellow-50 dark:bg-yellow-900/20 rounded-lg p-4">
                      <h4 className="font-semibold text-yellow-800 dark:text-yellow-200 mb-2">
                        ⚠️ Important Disclaimer
                      </h4>
                      <p className="text-yellow-700 dark:text-yellow-300 text-left">
                        This calculator provides estimates for planning purposes only. The VA makes all
                        final rating determinations. Actual ratings depend on medical evidence, C&P exam
                        findings, and VA adjudication. This tool does not account for bilateral factors,
                        protected ratings, or other special provisions.
                      </p>
                    </div>
                  </div>
                </div>
            )}
          </div>

          {/* Existing Conditions Reference */}
          {serviceConnectedConditions.length > 0 && (
              <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-5">
                <h3 className="font-semibold text-lg text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                  <span>🎖️</span>
                  Your Current Service-Connected Conditions
                </h3>

                <div className="space-y-2 text-left">
                  {serviceConnectedConditions.map((condition) => (
                      <div
                          key={condition.id}
                          className="flex items-center justify-between py-2 border-b border-gray-100 dark:border-gray-700 last:border-0"
                      >
                  <span className="text-gray-900 dark:text-white">
                    {condition.conditionName}
                  </span>
                        <span className={`px-3 py-1 rounded-lg font-semibold ${getRatingBadgeClasses(condition.currentRating)}`}>
                    {condition.currentRating}%
                  </span>
                      </div>
                  ))}
                </div>

                <p className="text-xs text-gray-500 dark:text-gray-400 mt-4">
                  These conditions are from your profile. Edit them in Settings → Service-Connected Conditions.
                </p>
              </div>
          )}

        </div>

        {/* Save Scenario Modal */}
        {showSaveModal && (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
              <div className="bg-white dark:bg-gray-800 rounded-lg max-w-md w-full p-6 shadow-xl">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                  Save Scenario
                </h3>

                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Scenario Name
                  </label>
                  <input
                      type="text"
                      value={scenarioName}
                      onChange={(e) => setScenarioName(e.target.value)}
                      placeholder="e.g., Sleep Apnea + Increase Request"
                      className="w-full px-3 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg
                         bg-white dark:bg-gray-700 text-gray-900 dark:text-white
                         focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-3 mb-4 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Current Rating:</span>
                    <span className="font-medium text-gray-900 dark:text-white">{currentRating}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Projected Rating:</span>
                    <span className="font-medium text-gray-900 dark:text-white">{projectedRating}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Hypothetical Conditions:</span>
                    <span className="font-medium text-gray-900 dark:text-white">{hypotheticalConditions.length}</span>
                  </div>
                </div>

                <div className="flex justify-end gap-3">
                  <button
                      onClick={() => setShowSaveModal(false)}
                      className="px-4 py-2 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                      onClick={handleSaveScenario}
                      className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                  >
                    Save Scenario
                  </button>
                </div>
              </div>
            </div>
        )}
      </div>
  );
};

export default RatingScenarioCalculator;