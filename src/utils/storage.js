/**
 * PROFILE-AWARE STORAGE WRAPPER
 *
 * Wraps existing storage functions to make them profile-aware.
 * All data is namespaced by active profile ID.
 */

import { getActiveProfileId, getServiceConnectedConditions, getProfileById, updateProfile } from './profiles';
import { getMeasurements } from './measurements';

/**
 * Get profile-namespaced storage key
 */
const getProfileKey = (baseKey, profileId = null) => {
  const activeId = profileId || getActiveProfileId();
  if (!activeId) {
    // During migration, old keys might be accessed briefly
    // After migration, this should never happen
    const isMigrated = localStorage.getItem('symptomTracker_multiProfileMigration') === 'true';

    if (isMigrated) {
      // Migration already complete - no active profile is an error
      console.error(`âŒ No active profile ID for key: ${baseKey}`);
      console.error('This should not happen. Profile system may not be initialized.');
      // Return empty namespaced key to prevent reading old shared data
      return `${baseKey}_INVALID_NO_PROFILE`;
    } else {
      // Migration in progress - allow fallback temporarily
      console.warn(`⚠ ï¸  Migration in progress, temporary fallback for: ${baseKey}`);
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
    timestamp: now,  // When the log was created/saved
    occurredAt: entry.occurredAt || now,  // When the symptom actually occurred (defaults to now)
  };
  logs.push(newEntry);
  const key = getProfileKey('symptomTracker_logs', profileId);
  localStorage.setItem(key, JSON.stringify(logs));
  return newEntry;
};

export const getSymptomLogs = (profileId = null) => {
  const key = getProfileKey('symptomTracker_logs', profileId);
  const logs = localStorage.getItem(key);
  return logs ? JSON.parse(logs) : [];
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
  localStorage.setItem(key, JSON.stringify(filtered));
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
  localStorage.setItem(key, JSON.stringify(logs));
  return { success: true, log: logs[index] };
};

export const getSymptomLogById = (id, profileId = null) => {
  const logs = getSymptomLogs(profileId);
  return logs.find(log => log.id === id) || null;
};

// ============================================
// OCCURRENCE TIME HELPERS
// ============================================

/**
 * Get the time when a symptom actually occurred
 * Falls back to timestamp for backward compatibility
 */
export const getOccurrenceTime = (log) => {
  return log.occurredAt || log.timestamp;
};

/**
 * Check if a log was back-dated (occurred before it was logged)
 */
export const isBackDated = (log) => {
  if (!log.occurredAt || !log.timestamp) return false;
  const occurred = new Date(log.occurredAt);
  const logged = new Date(log.timestamp);
  // Consider back-dated if occurrence is more than 1 minute before logging
  return (logged - occurred) > 60000; // 60 seconds
};

// ============================================
// CUSTOM SYMPTOMS
// ============================================

export const getCustomSymptoms = (profileId = null) => {
  const key = getProfileKey('symptomTracker_customSymptoms', profileId);
  const symptoms = localStorage.getItem(key);
  return symptoms ? JSON.parse(symptoms) : [];
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
    id: `custom-${Date.now()}`,
    name: name.trim(),
    category,
    isCustom: true,
    addedAt: new Date().toISOString(),
  };

  symptoms.push(newSymptom);
  const key = getProfileKey('symptomTracker_customSymptoms', profileId);
  localStorage.setItem(key, JSON.stringify(symptoms));

  return { success: true, symptom: newSymptom };
};

export const deleteCustomSymptom = (id, profileId = null) => {
  const symptoms = getCustomSymptoms(profileId);
  const filtered = symptoms.filter(s => s.id !== id);
  const key = getProfileKey('symptomTracker_customSymptoms', profileId);
  localStorage.setItem(key, JSON.stringify(filtered));
};

// ============================================
// CHRONIC SYMPTOMS (formerly Favorites)
// ============================================

export const getChronicSymptoms = (profileId = null) => {
  const key = getProfileKey('symptomTracker_favorites', profileId);
  const symptoms = localStorage.getItem(key);
  return symptoms ? JSON.parse(symptoms) : [];
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
  localStorage.setItem(key, JSON.stringify(chronicSymptoms));
  return { success: true, chronic: newChronic };
};

export const removeChronicSymptom = (symptomId, profileId = null) => {
  const chronicSymptoms = getChronicSymptoms(profileId);
  const filtered = chronicSymptoms.filter(c => c.symptomId !== symptomId);
  const key = getProfileKey('symptomTracker_favorites', profileId);
  localStorage.setItem(key, JSON.stringify(filtered));
};

export const updateChronicDefaults = (symptomId, defaultSeverity, profileId = null) => {
  const chronicSymptoms = getChronicSymptoms(profileId);
  const index = chronicSymptoms.findIndex(c => c.symptomId === symptomId);
  if (index !== -1) {
    chronicSymptoms[index].defaultSeverity = defaultSeverity;
    const key = getProfileKey('symptomTracker_favorites', profileId);
    localStorage.setItem(key, JSON.stringify(chronicSymptoms));
  }
};

export const isChronicSymptom = (symptomId, profileId = null) => {
  const chronicSymptoms = getChronicSymptoms(profileId);
  return chronicSymptoms.some(c => c.symptomId === symptomId);
};

// Legacy aliases for backward compatibility (deprecated - use chronic symptoms functions)
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
  const meds = localStorage.getItem(key);
  return meds ? JSON.parse(meds) : [];
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
    frequency: medication.frequency || 'as-needed',
    forConditions: medication.forConditions || [],
    notes: medication.notes || '',
    isActive: true,
    createdAt: new Date().toISOString(),
  };

  meds.push(newMed);
  const key = getProfileKey('symptomTracker_medications', profileId);
  localStorage.setItem(key, JSON.stringify(meds));
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
  localStorage.setItem(key, JSON.stringify(meds));
  return { success: true, medication: meds[index] };
};

export const deleteMedication = (id, profileId = null) => {
  const meds = getMedications(profileId);
  const filtered = meds.filter(m => m.id !== id);
  const key = getProfileKey('symptomTracker_medications', profileId);
  localStorage.setItem(key, JSON.stringify(filtered));
};

export const saveMedication = addMedication;

// ============================================
// MEDICATION LOGS
// ============================================

export const getMedicationLogs = (profileId = null) => {
  const key = getProfileKey('symptomTracker_medicationLogs', profileId);
  const logs = localStorage.getItem(key);
  return logs ? JSON.parse(logs) : [];
};

export const logMedicationTaken = (entry, profileId = null) => {
  const logs = getMedicationLogs(profileId);

  const now = new Date().toISOString();
  const newLog = {
    id: crypto.randomUUID(),
    medicationId: entry.medicationId,
    medicationName: entry.medicationName,
    dosage: entry.dosage,
    timestamp: now,
    // When the medication was actually taken (defaults to now, supports backdating)
    occurredAt: entry.occurredAt || now,
    takenFor: entry.takenFor || '',
    symptomLogId: entry.symptomLogId || null,
    effectiveness: entry.effectiveness || null,
    sideEffects: entry.sideEffects || '',
    notes: entry.notes || '',
  };

  logs.push(newLog);
  const key = getProfileKey('symptomTracker_medicationLogs', profileId);
  localStorage.setItem(key, JSON.stringify(logs));
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
  localStorage.setItem(key, JSON.stringify(logs));
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
  localStorage.setItem(key, JSON.stringify(filtered));
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
    id: logs[index].id, // preserve original id
    timestamp: logs[index].timestamp, // preserve original creation time
    updatedAt: new Date().toISOString(),
  };
  const key = getProfileKey('symptomTracker_medicationLogs', profileId);
  localStorage.setItem(key, JSON.stringify(logs));
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
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : [];
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
    localStorage.setItem(key, JSON.stringify(appointments));
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
      localStorage.setItem(key, JSON.stringify(appointments));
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
    localStorage.setItem(key, JSON.stringify(filtered));
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
// SLEEP APNEA PROFILE
// ============================================

export const getSleepApneaProfile = (profileId = null) => {
  const key = getProfileKey('symptomTracker_sleepApneaProfile', profileId);
  const profile = localStorage.getItem(key);
  return profile ? JSON.parse(profile) : null;
};

export const saveSleepApneaProfile = (profile, profileId = null) => {
  const key = getProfileKey('symptomTracker_sleepApneaProfile', profileId);
  localStorage.setItem(key, JSON.stringify(profile));
};

// ============================================
// REMINDER SETTINGS
// ============================================

export const getReminderSettings = (profileId = null) => {
  const key = getProfileKey('symptomTracker_reminderSettings', profileId);
  const settings = localStorage.getItem(key);
  return settings ? JSON.parse(settings) : {
    enabled: false,
    times: ['09:00', '21:00'],
    lastNotified: null,
  };
};

export const saveReminderSettings = (settings, profileId = null) => {
  const key = getProfileKey('symptomTracker_reminderSettings', profileId);
  localStorage.setItem(key, JSON.stringify(settings));
};

// ============================================
// DATA STATS
// ============================================

export const getDataStats = (profileId = null) => {
  const logs = getSymptomLogs(profileId);
  const customSymptoms = getCustomSymptoms(profileId);
  const chronicSymptoms = getChronicSymptoms(profileId);
  const appointments = getAppointments(profileId);

  // Get measurements count
  let measurements = 0;
  try {
    const allMeasurements = getMeasurements({ profileId });
    measurements = allMeasurements ? allMeasurements.length : 0;
  } catch (error) {
    // Measurements module might not be available
    measurements = 0;
  }

  return {
    logs: logs.length,
    customSymptoms: customSymptoms.length,
    chronicSymptoms: chronicSymptoms.length,
    appointments: appointments.length,
    measurements,
  };
};

// ============================================
// ONBOARDING (Global, not profile-specific)
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

export const exportAllData = (profileId = null) => {
  const activeId = profileId || getActiveProfileId();

  const data = {
    version: '1.4',
    profileId: activeId,
    exportedAt: new Date().toISOString(),
    symptomLogs: getSymptomLogs(activeId),
    customSymptoms: getCustomSymptoms(activeId),
    favorites: getChronicSymptoms(activeId), // Keep "favorites" key for compatibility
    medications: getMedications(activeId),
    medicationLogs: getMedicationLogs(activeId),
    appointments: getAppointments(activeId),
    serviceConnected: activeId ? getServiceConnectedConditions(activeId) : [], // ← ADD THIS LINE
    reminderSettings: getReminderSettings(activeId),
    profile: null,
    onboardingComplete: localStorage.getItem('symptomTracker_onboardingComplete') === 'true',
    sleepApneaProfile: getSleepApneaProfile(activeId),
  };

  const jsonString = JSON.stringify(data, null, 2);
  const blob = new Blob([jsonString], { type: 'application/json' });
  const url = URL.createObjectURL(blob);

  const date = new Date().toISOString().split('T')[0];
  const link = document.createElement('a');
  link.href = url;
  link.download = `symptom-tracker-backup-${date}.json`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);

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
      // Merge logic
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

      // Merge service-connected conditions
      const existingServiceConnectedIds = new Set(existingServiceConnected.map(sc => sc.id));
      const newServiceConnected = (data.serviceConnected || []).filter(
          sc => !existingServiceConnectedIds.has(sc.id)
      );
      const mergedServiceConnected = [...existingServiceConnected, ...newServiceConnected];

      const logsKey = getProfileKey('symptomTracker_logs', activeId);
      const symptomsKey = getProfileKey('symptomTracker_customSymptoms', activeId);
      const chronicKey = getProfileKey('symptomTracker_favorites', activeId);

      localStorage.setItem(logsKey, JSON.stringify(mergedLogs));
      localStorage.setItem(symptomsKey, JSON.stringify(mergedSymptoms));
      localStorage.setItem(chronicKey, JSON.stringify(mergedChronic));

      // Update service-connected conditions in the profile object
      if (mergedServiceConnected.length > 0) {
        const profile = getProfileById(activeId);
        if (profile) {
          updateProfile(activeId, {
            serviceConnectedConditions: mergedServiceConnected
          });
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
        const key = getProfileKey('symptomTracker_logs', activeId);
        localStorage.setItem(key, JSON.stringify(data.symptomLogs));
      }

      if (data.customSymptoms) {
        const key = getProfileKey('symptomTracker_customSymptoms', activeId);
        localStorage.setItem(key, JSON.stringify(data.customSymptoms));
      }

      if (data.favorites) {
        const key = getProfileKey('symptomTracker_favorites', activeId);
        localStorage.setItem(key, JSON.stringify(data.favorites));
      }

      if (data.medications) {
        const key = getProfileKey('symptomTracker_medications', activeId);
        localStorage.setItem(key, JSON.stringify(data.medications));
      }

      if (data.medicationLogs) {
        const key = getProfileKey('symptomTracker_medicationLogs', activeId);
        localStorage.setItem(key, JSON.stringify(data.medicationLogs));
      }

      if (data.appointments) {
        const key = getProfileKey('symptomTracker_appointments', activeId);
        localStorage.setItem(key, JSON.stringify(data.appointments));
      }

      if (data.serviceConnected && data.serviceConnected.length > 0) {
        // Service-connected conditions are stored IN the profile object, not as separate storage
        const profile = getProfileById(activeId);
        if (profile) {
          updateProfile(activeId, {
            serviceConnectedConditions: data.serviceConnected
          });
        }
      }

      if (data.reminderSettings) {
        const key = getProfileKey('symptomTracker_reminderSettings', activeId);
        localStorage.setItem(key, JSON.stringify(data.reminderSettings));
      }

      if (data.sleepApneaProfile) {
        const key = getProfileKey('symptomTracker_sleepApneaProfile', activeId);
        localStorage.setItem(key, JSON.stringify(data.sleepApneaProfile));
      }

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

export const clearAllData = (profileId = null) => {
  const activeId = profileId || getActiveProfileId();

  if (!activeId) return;

  localStorage.removeItem(getProfileKey('symptomTracker_logs', activeId));
  localStorage.removeItem(getProfileKey('symptomTracker_customSymptoms', activeId));
  localStorage.removeItem(getProfileKey('symptomTracker_favorites', activeId));
  localStorage.removeItem(getProfileKey('symptomTracker_medications', activeId));
  localStorage.removeItem(getProfileKey('symptomTracker_medicationLogs', activeId));
  localStorage.removeItem(getProfileKey('symptomTracker_appointments', activeId));
  localStorage.removeItem(getProfileKey('symptomTracker_reminderSettings', activeId));
  localStorage.removeItem(getProfileKey('symptomTracker_sleepApneaProfile', activeId));
};