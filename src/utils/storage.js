/**
 * PROFILE-AWARE STORAGE WRAPPER
 *
 * Wraps existing storage functions to make them profile-aware.
 * All data is namespaced by active profile ID.
 *
 * Phase 2: All profile-namespaced reads/writes now go through
 * the in-memory cache (storageCache.js) backed by IndexedDB.
 * Global/app-level keys remain in localStorage directly.
 */

import { getActiveProfileId, getServiceConnectedConditions, getProfileById, updateProfile } from './profiles';
import { getMeasurements } from './measurements';
import { exportTextFile } from './nativeExport';
import { cacheGet, cacheSet, cacheRemove } from './storageCache';

/**
 * Get profile-namespaced storage key
 */
export const getProfileKey = (baseKey, profileId = null) => {
  const activeId = profileId || getActiveProfileId();
  if (!activeId) {
    // During migration, old keys might be accessed briefly
    // After migration, this should never happen
    const isMigrated = localStorage.getItem('symptomTracker_multiProfileMigration') === 'true';

    if (isMigrated) {
      console.error(`❌ No active profile ID for key: ${baseKey}`);
      console.error('This should not happen. Profile system may not be initialized.');
      return `${baseKey}_INVALID_NO_PROFILE`;
    } else {
      console.warn(`⚠️ Migration in progress, temporary fallback for: ${baseKey}`);
      return baseKey;
    }
  }
  return `${baseKey}_${activeId}`;
};

// ============================================
// SYMPTOM LOGS
// ============================================

export const saveSymptomLog = (entry, profileId = null) => {
  const logs = getSymptomLogs(profileId);
  const now = new Date().toISOString();
  const newEntry = {
    ...entry,
    id: crypto.randomUUID(),
    timestamp: now,
    occurredAt: entry.occurredAt || now,
  };
  logs.push(newEntry);
  const key = getProfileKey('symptomTracker_logs', profileId);
  cacheSet(key, logs);
  return newEntry;
};

export const getSymptomLogs = (profileId = null) => {
  const key = getProfileKey('symptomTracker_logs', profileId);
  return cacheGet(key) || [];
};

export const getLogsByDateRange = (startDate, endDate, profileId = null) => {
  const logs = getSymptomLogs(profileId);
  return logs.filter(log => {
    const logDate = new Date(log.timestamp);
    return logDate >= startDate && logDate <= endDate;
  });
};

export const getTodaysLogs = (profileId = null) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);
  return getLogsByDateRange(today, tomorrow, profileId);
};

export const deleteSymptomLog = (id, profileId = null) => {
  const logs = getSymptomLogs(profileId);
  const filtered = logs.filter(log => log.id !== id);
  const key = getProfileKey('symptomTracker_logs', profileId);
  cacheSet(key, filtered);
};

// ============================================
// VA FORM 21-8940 WORKSHEET
// ============================================

export const DEFAULT_8940_WORKSHEET = {
  usualOccupation: '',
  educationLevel: '',
  vocationalTraining: '',
  lastFullTimeDate: '',
  lastFullTimeReason: '',
  employmentHistory: [],
  conditionsPreventingWork: '',
  howConditionsAffect: '',
  specialAccommodations: '',
  missedWorkDays: '',
  lastSaved: null,
};

export const get8940Worksheet = (profileId = null) => {
  const key = getProfileKey('symptomTracker_8940worksheet', profileId);
  const saved = cacheGet(key);
  if (!saved) return { ...DEFAULT_8940_WORKSHEET, employmentHistory: [] };
  try {
    return { ...DEFAULT_8940_WORKSHEET, ...saved };
  } catch {
    return { ...DEFAULT_8940_WORKSHEET, employmentHistory: [] };
  }
};

export const save8940Worksheet = (updates, profileId = null) => {
  const current = get8940Worksheet(profileId);
  const merged = {
    ...current,
    ...updates,
    lastSaved: new Date().toISOString(),
  };
  const key = getProfileKey('symptomTracker_8940worksheet', profileId);
  cacheSet(key, merged);
  return merged;
};

export const clear8940Worksheet = (profileId = null) => {
  const key = getProfileKey('symptomTracker_8940worksheet', profileId);
  cacheRemove(key);
};

export const updateSymptomLog = (id, updates, profileId = null) => {
  const logs = getSymptomLogs(profileId);
  const index = logs.findIndex(log => log.id === id);

  if (index === -1) {
    return { success: false, message: 'Log entry not found' };
  }

  logs[index] = {
    ...logs[index],
    ...updates,
    id: logs[index].id,
    timestamp: logs[index].timestamp,
    updatedAt: new Date().toISOString(),
  };

  const key = getProfileKey('symptomTracker_logs', profileId);
  cacheSet(key, logs);
  return { success: true, log: logs[index] };
};

export const getSymptomLogById = (id, profileId = null) => {
  const logs = getSymptomLogs(profileId);
  return logs.find(log => log.id === id) || null;
};

// ============================================
// OCCURRENCE TIME HELPERS
// ============================================

export const getOccurrenceTime = (log) => {
  return log.occurredAt || log.timestamp;
};

export const isBackDated = (log) => {
  if (!log.occurredAt || !log.timestamp) return false;
  const occurred = new Date(log.occurredAt);
  const logged = new Date(log.timestamp);
  const occurredDate = new Date(occurred.getFullYear(), occurred.getMonth(), occurred.getDate());
  const loggedDate = new Date(logged.getFullYear(), logged.getMonth(), logged.getDate());
  return occurredDate < loggedDate;
};

// ============================================
// CUSTOM SYMPTOMS
// ============================================

export const getCustomSymptoms = (profileId = null) => {
  const key = getProfileKey('symptomTracker_customSymptoms', profileId);
  return cacheGet(key) || [];
};

export const addCustomSymptom = (name, category = 'Custom', profileId = null) => {
  const symptoms = getCustomSymptoms(profileId);

  const exists = symptoms.some(
      s => s.name.toLowerCase() === name.toLowerCase()
  );
  if (exists) {
    return { success: false, message: 'Symptom already exists' };
  }

  const newSymptom = {
    id: `custom-${crypto.randomUUID()}`,
    name: name.trim(),
    category,
    isCustom: true,
    addedAt: new Date().toISOString(),
  };

  symptoms.push(newSymptom);
  const key = getProfileKey('symptomTracker_customSymptoms', profileId);
  cacheSet(key, symptoms);
  return { success: true, symptom: newSymptom };
};

export const deleteCustomSymptom = (id, profileId = null) => {
  const symptoms = getCustomSymptoms(profileId);
  const filtered = symptoms.filter(s => s.id !== id);
  const key = getProfileKey('symptomTracker_customSymptoms', profileId);
  cacheSet(key, filtered);
};

// ============================================
// CHRONIC SYMPTOMS (formerly Favorites)
// ============================================

export const getChronicSymptoms = (profileId = null) => {
  const key = getProfileKey('symptomTracker_favorites', profileId);
  return cacheGet(key) || [];
};

export const addChronicSymptom = (symptom, profileId = null) => {
  const chronicSymptoms = getChronicSymptoms(profileId);

  const exists = chronicSymptoms.some(c => c.symptomId === symptom.symptomId);
  if (exists) {
    return { success: false, message: 'Already in chronic symptoms list' };
  }

  if (chronicSymptoms.length >= 8) {
    return { success: false, message: 'Maximum 8 chronic symptoms allowed' };
  }

  const newChronic = {
    symptomId: symptom.symptomId,
    symptomName: symptom.symptomName,
    category: symptom.category,
    defaultSeverity: symptom.defaultSeverity || 5,
    addedAt: new Date().toISOString(),
  };

  chronicSymptoms.push(newChronic);
  const key = getProfileKey('symptomTracker_favorites', profileId);
  cacheSet(key, chronicSymptoms);
  return { success: true, chronic: newChronic };
};

export const removeChronicSymptom = (symptomId, profileId = null) => {
  const chronicSymptoms = getChronicSymptoms(profileId);
  const filtered = chronicSymptoms.filter(c => c.symptomId !== symptomId);
  const key = getProfileKey('symptomTracker_favorites', profileId);
  cacheSet(key, filtered);
};

export const updateChronicDefaults = (symptomId, defaultSeverity, profileId = null) => {
  const chronicSymptoms = getChronicSymptoms(profileId);
  const index = chronicSymptoms.findIndex(c => c.symptomId === symptomId);
  if (index !== -1) {
    chronicSymptoms[index].defaultSeverity = defaultSeverity;
    const key = getProfileKey('symptomTracker_favorites', profileId);
    cacheSet(key, chronicSymptoms);
  }
};

export const isChronicSymptom = (symptomId, profileId = null) => {
  const chronicSymptoms = getChronicSymptoms(profileId);
  return chronicSymptoms.some(c => c.symptomId === symptomId);
};

// Legacy aliases
export const getFavorites = getChronicSymptoms;
export const addFavorite = addChronicSymptom;
export const removeFavorite = removeChronicSymptom;
export const updateFavoriteDefaults = updateChronicDefaults;
export const isFavorite = isChronicSymptom;

// ============================================
// MEDICATIONS
// ============================================

export const getMedications = (profileId = null) => {
  const key = getProfileKey('symptomTracker_medications', profileId);
  return cacheGet(key) || [];
};

export const addMedication = (medication, profileId = null) => {
  const meds = getMedications(profileId);

  const exists = meds.some(m =>
      m.name.toLowerCase() === medication.name.toLowerCase() &&
      m.dosage.toLowerCase() === medication.dosage.toLowerCase()
  );
  if (exists) {
    return { success: false, message: 'Medication already exists' };
  }

  const newMed = {
    id: crypto.randomUUID(),
    name: medication.name.trim(),
    dosage: medication.dosage.trim(),
    strength: medication.strength || '',
    quantity: medication.quantity || 1,
    unitType: medication.unitType || 'tablet',
    frequency: medication.frequency || 'as-needed',
    forConditions: medication.forConditions || [],
    notes: medication.notes || '',
    dosingIntervalHours: medication.dosingIntervalHours ?? null,
    isActive: true,
    createdAt: new Date().toISOString(),
  };

  meds.push(newMed);
  const key = getProfileKey('symptomTracker_medications', profileId);
  cacheSet(key, meds);
  return { success: true, medication: newMed };
};

export const updateMedication = (id, updates, profileId = null) => {
  const meds = getMedications(profileId);
  const index = meds.findIndex(m => m.id === id);
  if (index === -1) {
    return { success: false, message: 'Medication not found' };
  }
  meds[index] = { ...meds[index], ...updates };
  const key = getProfileKey('symptomTracker_medications', profileId);
  cacheSet(key, meds);
  return { success: true, medication: meds[index] };
};

export const deleteMedication = (id, profileId = null) => {
  const meds = getMedications(profileId);
  const filtered = meds.filter(m => m.id !== id);
  const key = getProfileKey('symptomTracker_medications', profileId);
  cacheSet(key, filtered);
};

export const saveMedication = addMedication;

// ============================================
// MEDICATION HISTORY
// ============================================

export const getMedicationHistory = (profileId = null) => {
  const key = getProfileKey('symptomTracker_medicationHistory', profileId);
  return cacheGet(key) || [];
};

export const saveMedicationHistory = (entry, profileId = null) => {
  const history = getMedicationHistory(profileId);
  const newEntry = {
    ...entry,
    id: entry.id || `medh_${crypto.randomUUID()}`,
    archivedAt: entry.archivedAt || new Date().toISOString(),
    source: entry.source || 'manual',
  };
  history.push(newEntry);
  const key = getProfileKey('symptomTracker_medicationHistory', profileId);
  cacheSet(key, history);
  return { success: true, entry: newEntry };
};

export const updateMedicationHistory = (id, updates, profileId = null) => {
  const history = getMedicationHistory(profileId);
  const index = history.findIndex(e => e.id === id);
  if (index === -1) return { success: false, message: 'Entry not found' };
  history[index] = { ...history[index], ...updates, id: history[index].id };
  const key = getProfileKey('symptomTracker_medicationHistory', profileId);
  cacheSet(key, history);
  return { success: true, entry: history[index] };
};

export const deleteMedicationHistory = (id, profileId = null) => {
  const history = getMedicationHistory(profileId);
  const filtered = history.filter(e => e.id !== id);
  const key = getProfileKey('symptomTracker_medicationHistory', profileId);
  cacheSet(key, filtered);
};

// ============================================
// MEDICATION LOGS
// ============================================

export const getMedicationLogs = (profileId = null) => {
  const key = getProfileKey('symptomTracker_medicationLogs', profileId);
  return cacheGet(key) || [];
};

export const logMedicationTaken = (entry, profileId = null) => {
  const logs = getMedicationLogs(profileId);

  const newLog = {
    id: crypto.randomUUID(),
    timestamp: new Date().toISOString(),
    occurredAt: entry.occurredAt || new Date().toISOString(),
    medicationId: entry.medicationId,
    medicationName: entry.medicationName,
    dosage: entry.dosage,
    batchId: entry.batchId || null,
    takenFor: entry.takenFor || '',
    symptomLogId: entry.symptomLogId || null,
    effectiveness: entry.effectiveness || null,
    sideEffects: entry.sideEffects || '',
    notes: entry.notes || '',
  };

  logs.push(newLog);
  const key = getProfileKey('symptomTracker_medicationLogs', profileId);
  cacheSet(key, logs);
  return { success: true, log: newLog };
};

export const saveMedicationLog = (log, profileId = null) => {
  const logs = getMedicationLogs(profileId);
  const newLog = {
    ...log,
    id: log.id || crypto.randomUUID(),
    timestamp: log.timestamp || new Date().toISOString(),
  };
  logs.push(newLog);
  const key = getProfileKey('symptomTracker_medicationLogs', profileId);
  cacheSet(key, logs);
  return newLog;
};

export const getMedicationLogsForSymptom = (symptomLogId, profileId = null) => {
  const logs = getMedicationLogs(profileId);
  return logs.filter(log => log.symptomLogId === symptomLogId);
};

export const getMedicationLogsByDateRange = (startDate, endDate, profileId = null) => {
  const logs = getMedicationLogs(profileId);
  return logs.filter(log => {
    const logDate = new Date(log.timestamp);
    return logDate >= startDate && logDate <= endDate;
  });
};

export const deleteMedicationLog = (id, profileId = null) => {
  const logs = getMedicationLogs(profileId);
  const filtered = logs.filter(log => log.id !== id);
  const key = getProfileKey('symptomTracker_medicationLogs', profileId);
  cacheSet(key, filtered);
};

export const updateMedicationLog = (id, updates, profileId = null) => {
  const logs = getMedicationLogs(profileId);
  const index = logs.findIndex(log => log.id === id);
  if (index === -1) {
    return { success: false, message: 'Medication log not found' };
  }
  logs[index] = {
    ...logs[index],
    ...updates,
    id: logs[index].id,
    timestamp: logs[index].timestamp,
    updatedAt: new Date().toISOString(),
  };
  const key = getProfileKey('symptomTracker_medicationLogs', profileId);
  cacheSet(key, logs);
  return { success: true, log: logs[index] };
};

export const getTodaysMedicationLogs = (profileId = null) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);
  return getMedicationLogsByDateRange(today, tomorrow, profileId);
};

// ============================================
// APPOINTMENTS
// ============================================

export const getAppointments = (profileId = null) => {
  try {
    const key = getProfileKey('symptomTracker_appointments', profileId);
    const appointments = cacheGet(key);
    if (!appointments) return [];
    return appointments.sort((a, b) => {
      const dateA = new Date(a.appointmentDate || a.createdAt || 0);
      const dateB = new Date(b.appointmentDate || b.createdAt || 0);
      return dateB - dateA;
    });
  } catch (error) {
    console.error('Error reading appointments:', error);
    return [];
  }
};

export const saveAppointment = (appointment, profileId = null) => {
  try {
    const appointments = getAppointments(profileId);
    const newAppointment = {
      ...appointment,
      id: appointment.id || Date.now().toString(),
      createdAt: appointment.createdAt || new Date().toISOString(),
    };
    appointments.unshift(newAppointment);
    const key = getProfileKey('symptomTracker_appointments', profileId);
    cacheSet(key, appointments);
    return newAppointment;
  } catch (error) {
    console.error('Error saving appointment:', error);
    return null;
  }
};

export const updateAppointment = (id, updatedData, profileId = null) => {
  try {
    const appointments = getAppointments(profileId);
    const index = appointments.findIndex(apt => apt.id === id);
    if (index !== -1) {
      appointments[index] = {
        ...appointments[index],
        ...updatedData,
        updatedAt: new Date().toISOString(),
      };
      const key = getProfileKey('symptomTracker_appointments', profileId);
      cacheSet(key, appointments);
      return appointments[index];
    }
    return null;
  } catch (error) {
    console.error('Error updating appointment:', error);
    return null;
  }
};

export const deleteAppointment = (id, profileId = null) => {
  try {
    const appointments = getAppointments(profileId);
    const filtered = appointments.filter(apt => apt.id !== id);
    const key = getProfileKey('symptomTracker_appointments', profileId);
    cacheSet(key, filtered);
    return true;
  } catch (error) {
    console.error('Error deleting appointment:', error);
    return false;
  }
};

export const getAppointmentsByDateRange = (startDate, endDate, profileId = null) => {
  const appointments = getAppointments(profileId);
  return appointments.filter(apt => {
    const aptDate = new Date(apt.appointmentDate);
    return aptDate >= startDate && aptDate <= endDate;
  });
};

// ============================================
// SURGERIES
// ============================================

export const getSurgeries = (profileId = null) => {
  try {
    const key = getProfileKey('symptomTracker_surgeries', profileId);
    const surgeries = cacheGet(key);
    if (!surgeries) return [];
    // Sort newest surgery date first
    return surgeries.sort((a, b) => {
      const dateA = new Date(a.surgeryDate || a.createdAt || 0);
      const dateB = new Date(b.surgeryDate || b.createdAt || 0);
      return dateB - dateA;
    });
  } catch (error) {
    console.error('Error reading surgeries:', error);
    return [];
  }
};

export const saveSurgery = (surgery, profileId = null) => {
  try {
    const surgeries = getSurgeries(profileId);
    const newSurgery = {
      ...surgery,
      id: surgery.id || crypto.randomUUID(),
      createdAt: surgery.createdAt || new Date().toISOString(),
      // relatedConditions stored as array for future Option 2 structured linking:
      // [{ label: 'Right hip', categoryId: null }]
      // Currently populated from free-text relatedConditions field as a single-element array
      relatedConditions: surgery.relatedConditions || [],
    };
    surgeries.unshift(newSurgery);
    const key = getProfileKey('symptomTracker_surgeries', profileId);
    cacheSet(key, surgeries);
    return newSurgery;
  } catch (error) {
    console.error('Error saving surgery:', error);
    return null;
  }
};

export const updateSurgery = (id, updatedData, profileId = null) => {
  try {
    const surgeries = getSurgeries(profileId);
    const index = surgeries.findIndex(s => s.id === id);
    if (index !== -1) {
      surgeries[index] = {
        ...surgeries[index],
        ...updatedData,
        updatedAt: new Date().toISOString(),
      };
      const key = getProfileKey('symptomTracker_surgeries', profileId);
      cacheSet(key, surgeries);
      return surgeries[index];
    }
    return null;
  } catch (error) {
    console.error('Error updating surgery:', error);
    return null;
  }
};

export const deleteSurgery = (id, profileId = null) => {
  try {
    const surgeries = getSurgeries(profileId);
    const filtered = surgeries.filter(s => s.id !== id);
    const key = getProfileKey('symptomTracker_surgeries', profileId);
    cacheSet(key, filtered);
    return true;
  } catch (error) {
    console.error('Error deleting surgery:', error);
    return false;
  }
};

// ============================================
// SLEEP APNEA PROFILE
// ============================================

export const getSleepApneaProfile = (profileId = null) => {
  const key = getProfileKey('symptomTracker_sleepApneaProfile', profileId);
  return cacheGet(key) || null;
};

export const saveSleepApneaProfile = (profile, profileId = null) => {
  const key = getProfileKey('symptomTracker_sleepApneaProfile', profileId);
  cacheSet(key, profile);
};

// ============================================
// REMINDER SETTINGS
// ============================================

export const getReminderSettings = (profileId = null) => {
  const key = getProfileKey('symptomTracker_reminderSettings', profileId);
  return cacheGet(key) || {
    enabled: false,
    times: ['09:00', '21:00'],
    lastNotified: null,
  };
};

export const saveReminderSettings = (settings, profileId = null) => {
  const key = getProfileKey('symptomTracker_reminderSettings', profileId);
  cacheSet(key, settings);
};

// ============================================
// DATA STATS
// ============================================

export const getDataStats = (profileId = null) => {
  const logs = getSymptomLogs(profileId);
  const customSymptoms = getCustomSymptoms(profileId);
  const chronicSymptoms = getChronicSymptoms(profileId);
  const appointments = getAppointments(profileId);
  const surgeries = getSurgeries(profileId);

  let measurements = 0;
  try {
    const allMeasurements = getMeasurements({ profileId });
    measurements = allMeasurements ? allMeasurements.length : 0;
  } catch (_error) {
    measurements = 0;
  }

  return {
    logs: logs.length,
    customSymptoms: customSymptoms.length,
    chronicSymptoms: chronicSymptoms.length,
    appointments: appointments.length,
    surgeries: surgeries.length,
    measurements,
  };
};

// ============================================
// ONBOARDING (Global — stays in localStorage)
// ============================================

export const isOnboardingComplete = () => {
  return localStorage.getItem('symptomTracker_onboardingComplete') === 'true';
};

export const setOnboardingComplete = () => {
  localStorage.setItem('symptomTracker_onboardingComplete', 'true');
};

export const resetOnboarding = () => {
  localStorage.removeItem('symptomTracker_onboardingComplete');
};

// ============================================
// EXPORT / IMPORT (Profile-specific)
// ============================================

const validateBackupData = (data) => {
  if (!data || typeof data !== 'object') {
    return { valid: false, message: 'Invalid file format' };
  }
  if (!data.version) {
    return { valid: false, message: 'Missing version info - not a valid backup file' };
  }
  if (!Array.isArray(data.symptomLogs)) {
    return { valid: false, message: 'Missing or invalid symptom logs' };
  }
  return { valid: true };
};

export const exportAllData = async (profileId = null) => {
  const activeId = profileId || getActiveProfileId();

  const data = {
    version: '1.4',
    profileId: activeId,
    exportedAt: new Date().toISOString(),
    symptomLogs: getSymptomLogs(activeId),
    customSymptoms: getCustomSymptoms(activeId),
    favorites: getChronicSymptoms(activeId),
    medications: getMedications(activeId),
    medicationLogs: getMedicationLogs(activeId),
    medicationHistory: getMedicationHistory(activeId),
    appointments: getAppointments(activeId),
    surgeries: getSurgeries(activeId),
    serviceConnected: activeId ? getServiceConnectedConditions(activeId) : [],
    reminderSettings: getReminderSettings(activeId),
    profile: null,
    // onboardingComplete stays in localStorage — read directly
    onboardingComplete: localStorage.getItem('symptomTracker_onboardingComplete') === 'true',
    sleepApneaProfile: getSleepApneaProfile(activeId),
    worksheet8940: get8940Worksheet(activeId),
    weightGoal: getWeightGoal(activeId),
    mentalHealthScores: getMentalHealthScores(activeId),
  };

  const jsonString = JSON.stringify(data, null, 2);
  const date = new Date().toISOString().split('T')[0];
  await exportTextFile(
      jsonString,
      `symptom-tracker-backup-${date}.json`,
      'application/json'
  );

  return { success: true };
};

export const importAllData = (jsonData, options = { merge: false }, profileId = null) => {
  const activeId = profileId || getActiveProfileId();

  if (!activeId) {
    return { success: false, message: 'No active profile' };
  }

  try {
    const data = typeof jsonData === 'string' ? JSON.parse(jsonData) : jsonData;

    const validation = validateBackupData(data);
    if (!validation.valid) {
      return { success: false, message: validation.message };
    }

    if (options.merge) {
      const existingLogs = getSymptomLogs(activeId);
      const existingCustomSymptoms = getCustomSymptoms(activeId);
      const existingChronicSymptoms = getChronicSymptoms(activeId);
      const existingServiceConnected = getServiceConnectedConditions(activeId);

      const existingLogIds = new Set(existingLogs.map(log => log.id));
      const newLogs = data.symptomLogs.filter(log => !existingLogIds.has(log.id));
      const mergedLogs = [...existingLogs, ...newLogs];

      const existingSymptomNames = new Set(existingCustomSymptoms.map(s => s.name.toLowerCase()));
      const newSymptoms = (data.customSymptoms || []).filter(
          s => !existingSymptomNames.has(s.name.toLowerCase())
      );
      const mergedSymptoms = [...existingCustomSymptoms, ...newSymptoms];

      const existingChronicIds = new Set(existingChronicSymptoms.map(f => f.symptomId));
      const newChronic = (data.favorites || []).filter(
          f => !existingChronicIds.has(f.symptomId)
      );
      const mergedChronic = [...existingChronicSymptoms, ...newChronic];

      const existingServiceConnectedIds = new Set(existingServiceConnected.map(sc => sc.id));
      const newServiceConnected = (data.serviceConnected || []).filter(
          sc => !existingServiceConnectedIds.has(sc.id)
      );
      const mergedServiceConnected = [...existingServiceConnected, ...newServiceConnected];

      const logsKey = getProfileKey('symptomTracker_logs', activeId);
      const symptomsKey = getProfileKey('symptomTracker_customSymptoms', activeId);
      const chronicKey = getProfileKey('symptomTracker_favorites', activeId);

      cacheSet(logsKey, mergedLogs);
      cacheSet(symptomsKey, mergedSymptoms);
      cacheSet(chronicKey, mergedChronic);

      if (mergedServiceConnected.length > 0) {
        const profile = getProfileById(activeId);
        if (profile) {
          updateProfile(activeId, {
            serviceConnectedConditions: mergedServiceConnected
          });
        }
      }

      if (data.worksheet8940 && !get8940Worksheet(activeId)?.lastSaved) {
        save8940Worksheet(data.worksheet8940, activeId);
      }

      if (data.weightGoal && !getWeightGoal(activeId)) {
        saveWeightGoal(data.weightGoal, activeId);
      }

      if (data.mentalHealthScores && Array.isArray(data.mentalHealthScores)) {
        const existingScores = getMentalHealthScores(activeId);
        if (!existingScores || existingScores.length === 0) {
          const key = getProfileKey('symptomTracker_mentalHealthScores', activeId);
          cacheSet(key, data.mentalHealthScores);
        }
      }

      return {
        success: true,
        message: `Merged ${newLogs.length} new log entries`,
        stats: {
          logsAdded: newLogs.length,
          symptomsAdded: newSymptoms.length,
          chronicAdded: newChronic.length,
          serviceConnectedAdded: newServiceConnected.length,
        },
      };
    } else {
      // Replace all data
      if (data.symptomLogs) {
        cacheSet(getProfileKey('symptomTracker_logs', activeId), data.symptomLogs);
      }
      if (data.customSymptoms) {
        cacheSet(getProfileKey('symptomTracker_customSymptoms', activeId), data.customSymptoms);
      }
      if (data.favorites) {
        cacheSet(getProfileKey('symptomTracker_favorites', activeId), data.favorites);
      }
      if (data.medications) {
        cacheSet(getProfileKey('symptomTracker_medications', activeId), data.medications);
      }
      if (data.medicationLogs) {
        cacheSet(getProfileKey('symptomTracker_medicationLogs', activeId), data.medicationLogs);
      }
      if (data.medicationHistory) {
        cacheSet(getProfileKey('symptomTracker_medicationHistory', activeId), data.medicationHistory);
      }
      if (data.appointments) {
        cacheSet(getProfileKey('symptomTracker_appointments', activeId), data.appointments);
      }
      if (data.surgeries) {
        cacheSet(getProfileKey('symptomTracker_surgeries', activeId), data.surgeries);
      }
      if (data.serviceConnected && data.serviceConnected.length > 0) {
        const profile = getProfileById(activeId);
        if (profile) {
          updateProfile(activeId, {
            serviceConnectedConditions: data.serviceConnected
          });
        }
      }
      if (data.reminderSettings) {
        cacheSet(getProfileKey('symptomTracker_reminderSettings', activeId), data.reminderSettings);
      }
      if (data.sleepApneaProfile) {
        cacheSet(getProfileKey('symptomTracker_sleepApneaProfile', activeId), data.sleepApneaProfile);
      }
      if (data.worksheet8940) {
        cacheSet(getProfileKey('symptomTracker_8940worksheet', activeId), data.worksheet8940);
      }
      if (data.weightGoal) {
        saveWeightGoal(data.weightGoal, activeId);
      }
      if (data.mentalHealthScores && Array.isArray(data.mentalHealthScores)) {
        cacheSet(getProfileKey('symptomTracker_mentalHealthScores', activeId), data.mentalHealthScores);
      }
      // Global keys stay in localStorage
      if (data.profile) {
        localStorage.setItem('symptomTracker_profile', JSON.stringify(data.profile));
      }
      if (data.onboardingComplete !== undefined) {
        localStorage.setItem('symptomTracker_onboardingComplete', data.onboardingComplete.toString());
      }

      return {
        success: true,
        message: `Restored ${data.symptomLogs.length} log entries`,
        stats: {
          logsRestored: data.symptomLogs.length,
          symptomsRestored: (data.customSymptoms || []).length,
          chronicRestored: (data.favorites || []).length,
          profileRestored: !!data.profile,
        },
      };
    }
  } catch (error) {
    console.error('Import error:', error);
    return { success: false, message: error.message };
  }
};

// ============================================
// WEIGHT GOAL
// ============================================

export const getWeightGoal = (profileId = null) => {
  const key = getProfileKey('symptomTracker_weightGoal', profileId);
  return cacheGet(key) || null;
};

export const saveWeightGoal = (goal, profileId = null) => {
  const key = getProfileKey('symptomTracker_weightGoal', profileId);
  const goalData = {
    goalWeight: goal.goalWeight,
    targetDate: goal.targetDate || null,
    startWeight: goal.startWeight || null,
    startDate: goal.startDate || new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  cacheSet(key, goalData);
  return goalData;
};

export const clearWeightGoal = (profileId = null) => {
  const key = getProfileKey('symptomTracker_weightGoal', profileId);
  cacheRemove(key);
};

export const clearAllData = (profileId = null) => {
  const activeId = profileId || getActiveProfileId();
  if (!activeId) return;

  cacheRemove(getProfileKey('symptomTracker_logs', activeId));
  cacheRemove(getProfileKey('symptomTracker_customSymptoms', activeId));
  cacheRemove(getProfileKey('symptomTracker_favorites', activeId));
  cacheRemove(getProfileKey('symptomTracker_medications', activeId));
  cacheRemove(getProfileKey('symptomTracker_medicationLogs', activeId));
  cacheRemove(getProfileKey('symptomTracker_appointments', activeId));
  cacheRemove(getProfileKey('symptomTracker_surgeries', activeId));
  cacheRemove(getProfileKey('symptomTracker_reminderSettings', activeId));
  cacheRemove(getProfileKey('symptomTracker_sleepApneaProfile', activeId));
  cacheRemove(getProfileKey('symptomTracker_weightGoal', activeId));
  cacheRemove(getProfileKey('symptomTracker_medicationHistory', activeId));
  cacheRemove(getProfileKey('symptomTracker_mentalHealthScores', activeId));
  cacheRemove(getProfileKey('symptomTracker_8940worksheet', activeId));
};

// ============================================
// MENTAL HEALTH SCORES
// ============================================

export const getMentalHealthScores = (profileId = null) => {
  const key = getProfileKey('symptomTracker_mentalHealthScores', profileId);
  return cacheGet(key) || [];
};

export const saveMentalHealthScore = (entry, profileId = null) => {
  const scores = getMentalHealthScores(profileId);
  const newEntry = {
    ...entry,
    id: entry.id || `mhs_${crypto.randomUUID()}`,
    savedAt: entry.savedAt || new Date().toISOString(),
  };
  scores.push(newEntry);
  const key = getProfileKey('symptomTracker_mentalHealthScores', profileId);
  cacheSet(key, scores);
  return { success: true, entry: newEntry };
};

export const deleteMentalHealthScore = (id, profileId = null) => {
  const scores = getMentalHealthScores(profileId);
  const filtered = scores.filter(s => s.id !== id);
  const key = getProfileKey('symptomTracker_mentalHealthScores', profileId);
  cacheSet(key, filtered);
};

export const clearMentalHealthScores = (profileId = null) => {
  const key = getProfileKey('symptomTracker_mentalHealthScores', profileId);
  cacheRemove(key);
};