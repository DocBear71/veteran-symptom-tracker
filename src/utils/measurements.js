// ============================================
// MEASUREMENT STORAGE UTILITIES
// ============================================
// Profile-aware storage for measurement data
// All measurements are isolated by active profile ID

import { getActiveProfileId } from './profiles.js';
import { getMeasurementType } from '../data/measurementTypes';

// ============================================
// STORAGE KEY GENERATION
// ============================================

const getMeasurementsKey = (profileId = null) => {
  const activeProfileId = profileId || getActiveProfileId();
  return `symptomTracker_measurements_${activeProfileId}`;
};

const getHeightKey = (profileId = null) => {
  const activeProfileId = profileId || getActiveProfileId();
  return `symptomTracker_height_${activeProfileId}`;
};

// ============================================
// MEASUREMENT CRUD OPERATIONS
// ============================================

/**
 * Generate unique ID for measurement
 */
const generateMeasurementId = () => {
  return `meas_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
};

/**
 * Get all measurements for active profile
 * @param {Object} options - Filter options
 * @param {string} options.type - Filter by measurement type
 * @param {number} options.days - Filter by days in past
 * @param {Date} options.startDate - Filter by start date
 * @param {Date} options.endDate - Filter by end date
 * @returns {Array} Array of measurement objects
 */
export const getMeasurements = (options = {}) => {
  try {
    const key = getMeasurementsKey();
    const data = localStorage.getItem(key);
    let measurements = data ? JSON.parse(data) : [];

    // Filter by measurement type
    if (options.type) {
      measurements = measurements.filter(m => m.measurementType === options.type);
    }

    // Filter by date range
    if (options.days) {
      const cutoff = new Date();
      cutoff.setDate(cutoff.getDate() - options.days);
      measurements = measurements.filter(m => new Date(m.timestamp) >= cutoff);
    }

    if (options.startDate) {
      measurements = measurements.filter(m => new Date(m.timestamp) >= new Date(options.startDate));
    }

    if (options.endDate) {
      measurements = measurements.filter(m => new Date(m.timestamp) <= new Date(options.endDate));
    }

    // Sort by timestamp (newest first)
    measurements.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

    return measurements;
  } catch (error) {
    console.error('Error getting measurements:', error);
    return [];
  }
};

/**
 * Get a single measurement by ID
 * @param {string} id - Measurement ID
 * @returns {Object|null} Measurement object or null
 */
export const getMeasurementById = (id) => {
  const measurements = getMeasurements();
  return measurements.find(m => m.id === id) || null;
};

/**
 * Save a new measurement
 * @param {Object} measurement - Measurement data
 * @param {string} measurement.measurementType - Type of measurement
 * @param {Object} measurement.values - Measurement values
 * @param {Object} measurement.metadata - Additional metadata
 * @param {string} measurement.notes - Optional notes
 * @param {string} measurement.timestamp - ISO timestamp (defaults to now)
 * @returns {Object} Saved measurement with generated ID
 */
export const saveMeasurement = (measurement) => {
  try {
    const key = getMeasurementsKey();
    const measurements = getMeasurements();

    // Validate measurement type
    const type = getMeasurementType(measurement.measurementType);
    if (!type) {
      throw new Error(`Invalid measurement type: ${measurement.measurementType}`);
    }

    // Create new measurement entry
    const newMeasurement = {
      id: generateMeasurementId(),
      timestamp: measurement.timestamp || new Date().toISOString(),
      measurementType: measurement.measurementType,
      values: measurement.values || {},
      metadata: measurement.metadata || {},
      notes: measurement.notes || '',
    };

    // Special handling for weight measurements - store height separately
    if (measurement.measurementType === 'weight' && measurement.values.height) {
      saveHeight(measurement.values.height);
    }

    measurements.push(newMeasurement);
    localStorage.setItem(key, JSON.stringify(measurements));

    return newMeasurement;
  } catch (error) {
    console.error('Error saving measurement:', error);
    throw error;
  }
};

/**
 * Update an existing measurement
 * @param {string} id - Measurement ID
 * @param {Object} updates - Fields to update
 * @returns {Object|null} Updated measurement or null
 */
export const updateMeasurement = (id, updates) => {
  try {
    const key = getMeasurementsKey();
    const measurements = getMeasurements();
    const index = measurements.findIndex(m => m.id === id);

    if (index === -1) {
      console.error('Measurement not found:', id);
      return null;
    }

    // Update measurement
    measurements[index] = {
      ...measurements[index],
      ...updates,
      id, // Ensure ID doesn't change
    };

    // Special handling for weight measurements
    if (measurements[index].measurementType === 'weight' && updates.values?.height) {
      saveHeight(updates.values.height);
    }

    localStorage.setItem(key, JSON.stringify(measurements));
    return measurements[index];
  } catch (error) {
    console.error('Error updating measurement:', error);
    return null;
  }
};

/**
 * Delete a measurement
 * @param {string} id - Measurement ID
 * @returns {boolean} Success status
 */
export const deleteMeasurement = (id) => {
  try {
    const key = getMeasurementsKey();
    const measurements = getMeasurements();
    const filtered = measurements.filter(m => m.id !== id);

    if (filtered.length === measurements.length) {
      console.error('Measurement not found:', id);
      return false;
    }

    localStorage.setItem(key, JSON.stringify(filtered));
    return true;
  } catch (error) {
    console.error('Error deleting measurement:', error);
    return false;
  }
};

/**
 * Delete all measurements for active profile
 * @returns {boolean} Success status
 */
export const deleteAllMeasurements = () => {
  try {
    const key = getMeasurementsKey();
    localStorage.removeItem(key);
    return true;
  } catch (error) {
    console.error('Error deleting all measurements:', error);
    return false;
  }
};

// ============================================
// HEIGHT MANAGEMENT (for BMI calculations)
// ============================================

/**
 * Save height for active profile
 * Height is stored separately as it doesn't change frequently
 * @param {number} heightInches - Height in inches
 * @returns {boolean} Success status
 */
export const saveHeight = (heightInches) => {
  try {
    const key = getHeightKey();
    localStorage.setItem(key, heightInches.toString());
    return true;
  } catch (error) {
    console.error('Error saving height:', error);
    return false;
  }
};

/**
 * Get height for active profile
 * @returns {number|null} Height in inches or null
 */
export const getHeight = () => {
  try {
    const key = getHeightKey();
    const height = localStorage.getItem(key);
    return height ? parseFloat(height) : null;
  } catch (error) {
    console.error('Error getting height:', error);
    return null;
  }
};

// ============================================
// MEASUREMENT STATISTICS & ANALYSIS
// ============================================

/**
 * Calculate statistics for a measurement type
 * @param {string} measurementType - Type of measurement
 * @param {number} days - Number of days to analyze
 * @returns {Object} Statistics object
 */
export const getMeasurementStats = (measurementType, days = 30) => {
  const measurements = getMeasurements({ type: measurementType, days });

  if (measurements.length === 0) {
    return {
      count: 0,
      latest: null,
      oldest: null,
      average: null,
      min: null,
      max: null,
    };
  }

  // Get the primary field for this measurement type
  const type = getMeasurementType(measurementType);
  const primaryField = type.fields.find(f => f.required)?.key;

  if (!primaryField) return { count: measurements.length };

  // Extract values
  const values = measurements
  .map(m => m.values[primaryField])
  .filter(v => v !== undefined && v !== null && !isNaN(v));

  if (values.length === 0) return { count: measurements.length };

  // Calculate statistics
  const sum = values.reduce((acc, val) => acc + val, 0);
  const average = sum / values.length;
  const min = Math.min(...values);
  const max = Math.max(...values);

  return {
    count: measurements.length,
    latest: measurements[0], // Already sorted newest first
    oldest: measurements[measurements.length - 1],
    average: parseFloat(average.toFixed(2)),
    min,
    max,
    values, // Raw values for charting
  };
};

/**
 * Calculate average blood pressure over time period
 * @param {number} days - Number of days to analyze
 * @returns {Object} Average systolic and diastolic
 */
export const getAverageBloodPressure = (days = 30) => {
  const measurements = getMeasurements({ type: 'blood-pressure', days });

  if (measurements.length === 0) {
    return { systolic: null, diastolic: null, count: 0 };
  }

  const systolicValues = measurements.map(m => m.values.systolic).filter(Boolean);
  const diastolicValues = measurements.map(m => m.values.diastolic).filter(Boolean);

  return {
    systolic: systolicValues.length > 0
        ? Math.round(systolicValues.reduce((a, b) => a + b, 0) / systolicValues.length)
        : null,
    diastolic: diastolicValues.length > 0
        ? Math.round(diastolicValues.reduce((a, b) => a + b, 0) / diastolicValues.length)
        : null,
    count: measurements.length,
  };
};

/**
 * Check if blood pressure is "predominantly" at a certain level
 * Used for VA hypertension rating determination
 * "Predominantly" means more than 50% of readings
 * @param {number} days - Number of days to analyze (default 90)
 * @param {Object} threshold - { systolic: number, diastolic: number }
 * @returns {Object} Analysis result
 */
export const analyzeBloodPressurePredominance = (days = 90, threshold = {}) => {
  const measurements = getMeasurements({ type: 'blood-pressure', days });

  if (measurements.length === 0) {
    return {
      isPredominant: false,
      percentage: 0,
      totalReadings: 0,
      qualifyingReadings: 0,
      message: 'No blood pressure readings in evaluation period',
    };
  }

  // Count readings that meet threshold (systolic OR diastolic)
  const qualifyingReadings = measurements.filter(m => {
    if (threshold.systolic && m.values.systolic >= threshold.systolic) return true;
    if (threshold.diastolic && m.values.diastolic >= threshold.diastolic) return true;
    return false;
  }).length;

  const percentage = (qualifyingReadings / measurements.length) * 100;
  const isPredominant = percentage > 50;

  return {
    isPredominant,
    percentage: parseFloat(percentage.toFixed(1)),
    totalReadings: measurements.length,
    qualifyingReadings,
    message: isPredominant
        ? `${percentage.toFixed(1)}% of readings meet threshold (>50% required)`
        : `Only ${percentage.toFixed(1)}% of readings meet threshold (<50%)`,
  };
};

/**
 * Get latest measurement of a specific type
 * @param {string} measurementType - Type of measurement
 * @returns {Object|null} Latest measurement or null
 */
export const getLatestMeasurement = (measurementType) => {
  const measurements = getMeasurements({ type: measurementType });
  return measurements.length > 0 ? measurements[0] : null;
};

/**
 * Export measurements as JSON
 * @param {Object} options - Export options
 * @returns {string} JSON string
 */
export const exportMeasurementsJSON = (options = {}) => {
  const measurements = getMeasurements(options);
  return JSON.stringify(measurements, null, 2);
};

/**
 * Import measurements from JSON
 * @param {string} jsonString - JSON string of measurements
 * @returns {Object} Import result
 */
export const importMeasurementsJSON = (jsonString) => {
  try {
    const imported = JSON.parse(jsonString);

    if (!Array.isArray(imported)) {
      throw new Error('Invalid format: expected array of measurements');
    }

    const key = getMeasurementsKey();
    const existing = getMeasurements();

    // Merge, avoiding duplicates by ID
    const existingIds = new Set(existing.map(m => m.id));
    const newMeasurements = imported.filter(m => !existingIds.has(m.id));

    const merged = [...existing, ...newMeasurements];
    localStorage.setItem(key, JSON.stringify(merged));

    return {
      success: true,
      imported: newMeasurements.length,
      skipped: imported.length - newMeasurements.length,
      total: merged.length,
    };
  } catch (error) {
    return {
      success: false,
      error: error.message,
    };
  }
};