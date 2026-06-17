// ============================================
// MEASUREMENT STORAGE UTILITIES
// ============================================
// Profile-aware storage for measurement data.
// Phase 2: reads/writes go through storageCache (IndexedDB backed).

import { getActiveProfileId } from './profiles.js';
import { getMeasurementType } from '../data/measurementTypes';
import { cacheGet, cacheSet, cacheRemove } from './storageCache';

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

const generateMeasurementId = () => {
  return `meas_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
};

/**
 * Get all measurements for active profile
 */
export const getMeasurements = (options = {}) => {
  try {
    const key = getMeasurementsKey(options.profileId || null);
    let measurements = cacheGet(key) || [];

    if (options.type) {
      measurements = measurements.filter(m => m.measurementType === options.type);
    }

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

    measurements.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

    return measurements;
  } catch (error) {
    console.error('Error getting measurements:', error);
    return [];
  }
};

/**
 * Get a single measurement by ID
 */
export const getMeasurementById = (id) => {
  const measurements = getMeasurements();
  return measurements.find(m => m.id === id) || null;
};

/**
 * Save a new measurement
 */
export const saveMeasurement = (measurement) => {
  try {
    const key = getMeasurementsKey();
    const measurements = getMeasurements();

    const type = getMeasurementType(measurement.measurementType);
    if (!type) {
      throw new Error(`Invalid measurement type: ${measurement.measurementType}`);
    }

    const newMeasurement = {
      id: generateMeasurementId(),
      timestamp: measurement.timestamp || new Date().toISOString(),
      measurementType: measurement.measurementType,
      values: measurement.values || {},
      metadata: measurement.metadata || {},
      notes: measurement.notes || '',
    };

    if (measurement.measurementType === 'weight' && measurement.values.height) {
      saveHeight(measurement.values.height);
    }

    measurements.push(newMeasurement);
    cacheSet(key, measurements);

    return newMeasurement;
  } catch (error) {
    console.error('Error saving measurement:', error);
    throw error;
  }
};

/**
 * Update an existing measurement
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

    measurements[index] = {
      ...measurements[index],
      ...updates,
      id,
    };

    if (measurements[index].measurementType === 'weight' && updates.values?.height) {
      saveHeight(updates.values.height);
    }

    cacheSet(key, measurements);
    return measurements[index];
  } catch (error) {
    console.error('Error updating measurement:', error);
    return null;
  }
};

/**
 * Delete a measurement
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

    cacheSet(key, filtered);
    return true;
  } catch (error) {
    console.error('Error deleting measurement:', error);
    return false;
  }
};

/**
 * Delete all measurements for active profile
 */
export const deleteAllMeasurements = () => {
  try {
    const key = getMeasurementsKey();
    cacheRemove(key);
    return true;
  } catch (error) {
    console.error('Error deleting all measurements:', error);
    return false;
  }
};

// ============================================
// HEIGHT MANAGEMENT
// ============================================

export const saveHeight = (heightInches) => {
  try {
    const key = getHeightKey();
    cacheSet(key, heightInches);
    return true;
  } catch (error) {
    console.error('Error saving height:', error);
    return false;
  }
};

export const getHeight = () => {
  try {
    const key = getHeightKey();
    const height = cacheGet(key);
    return height !== null ? parseFloat(height) : null;
  } catch (error) {
    console.error('Error getting height:', error);
    return null;
  }
};

// ============================================
// MEASUREMENT STATISTICS & ANALYSIS
// ============================================

export const getMeasurementStats = (measurementType, days = 30) => {
  const measurements = getMeasurements({ type: measurementType, days });

  if (measurements.length === 0) {
    return { count: 0, latest: null, oldest: null, average: null, min: null, max: null };
  }

  const type = getMeasurementType(measurementType);
  const primaryField = type.fields.find(f => f.required)?.key;

  if (!primaryField) return { count: measurements.length };

  const values = measurements
  .map(m => m.values[primaryField])
  .filter(v => v !== undefined && v !== null && !isNaN(v));

  if (values.length === 0) return { count: measurements.length };

  const sum = values.reduce((acc, val) => acc + val, 0);

  return {
    count: measurements.length,
    latest: measurements[0],
    oldest: measurements[measurements.length - 1],
    average: parseFloat((sum / values.length).toFixed(2)),
    min: Math.min(...values),
    max: Math.max(...values),
    values,
  };
};

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

export const getLatestMeasurement = (measurementType) => {
  const measurements = getMeasurements({ type: measurementType });
  return measurements.length > 0 ? measurements[0] : null;
};

export const exportMeasurementsJSON = (options = {}) => {
  const measurements = getMeasurements(options);
  return JSON.stringify(measurements, null, 2);
};

export const importMeasurementsJSON = (jsonString) => {
  try {
    const imported = JSON.parse(jsonString);

    if (!Array.isArray(imported)) {
      throw new Error('Invalid format: expected array of measurements');
    }

    const key = getMeasurementsKey();
    const existing = getMeasurements();

    const existingIds = new Set(existing.map(m => m.id));
    const newMeasurements = imported.filter(m => !existingIds.has(m.id));
    const merged = [...existing, ...newMeasurements];

    cacheSet(key, merged);

    return {
      success: true,
      imported: newMeasurements.length,
      skipped: imported.length - newMeasurements.length,
      total: merged.length,
    };
  } catch (error) {
    return { success: false, error: error.message };
  }
};