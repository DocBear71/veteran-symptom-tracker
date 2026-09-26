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
import { photoDeleteByLogId } from './db';
import { conditionKeyForSnomed } from './snomedMap';



// Vaccine name matching lives in vaccineName.js so the parser and storage
// share one implementation.
//
// Two statements, not one. `export ... from` is a pass-through: it makes the
// names available to other modules but does NOT bind them in this file's
// scope, so functions below that call getImmunizationMatchKey would throw.
// The import binds them here; the export keeps existing imports from
// storage.js working.
import { normalizeVaccineName, getImmunizationMatchKey } from './vaccineName';
export { normalizeVaccineName, getImmunizationMatchKey };


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

  // Photos live in a separate IndexedDB store keyed by logId, so removing the
  // log leaves them behind: nothing points at them, no screen shows them, and
  // they keep consuming the device's storage quota indefinitely.
  //
  // Fire-and-forget on purpose. Keeping this function synchronous means every
  // existing caller gets cleanup without a signature change, and a failed
  // cleanup leaves the data exactly as orphaned as it would have been anyway.
  photoDeleteByLogId(id).catch(error =>
      console.error(`❌ Failed to delete photos for log "${id}":`, error)
  );
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
// IMMUNIZATIONS / VACCINES
// ============================================

/**
 * Where a vaccine record came from.
 *   VA_IMPORT — parsed out of a VA Blue Button file
 *   MANUAL    — entered by the Veteran: pharmacy, county clinic, employer,
 *               travel clinic, or typed off a paper shot record (DD 2766)
 */
export const IMMUNIZATION_SOURCES = {
    VA_IMPORT: 'va-import',
    MANUAL: 'manual',
};

/**
 * Who physically administered the shot. Separate from `source` on purpose:
 * a military-era shot typed off a paper DD 2766 has source MANUAL but
 * administeredBy MILITARY, and that distinction matters for a claim.
 */
export const IMMUNIZATION_ADMINISTERED_BY = {
    VA:       'va',
    MILITARY: 'military',
    PHARMACY: 'pharmacy',
    CIVILIAN: 'civilian',
    EMPLOYER: 'employer',
    OTHER:    'other',
};

/**
 * Read all immunizations, newest administration date first.
 */
export const getImmunizations = (profileId = null) => {
    try {
        const key = getProfileKey('symptomTracker_immunizations', profileId);
        const immunizations = cacheGet(key);
        if (!Array.isArray(immunizations)) return [];
        return immunizations.slice().sort((a, b) => {
            const dateA = new Date(a.vaccineDate || a.createdAt || 0);
            const dateB = new Date(b.vaccineDate || b.createdAt || 0);
            return dateB - dateA;
        });
    } catch (error) {
        console.error('Error reading immunizations:', error);
        return [];
    }
};

/**
 * Create a new immunization record.
 *
 * Record shape:
 * {
 *   id, vaccineName, vaccineDate ('YYYY-MM-DD'),
 *   doseNumber, seriesTotal,        // "3 of 6" for an anthrax series
 *   lotNumber, manufacturer, site, route,
 *   facility, provider, administeredBy,
 *   reaction: { occurred, severity, description, onsetDate, symptomLogId },
 *   notes, source, edited, vaConfirmed, originalImport,
 *   importedAt, createdAt, updatedAt
 * }
 */
export const saveImmunization = (immunization, profileId = null) => {
    try {
        const immunizations = getImmunizations(profileId);
        const now = new Date().toISOString();

        const newRecord = {
            // Defaults first so a caller passing a partial object still gets a
            // well-formed record. Spread of the caller's data overrides these.
            vaccineName:    '',
            vaccineDate:    null,
            doseNumber:     null,
            seriesTotal:    null,
            lotNumber:      '',
            manufacturer:   '',
            site:           '',
            route:          '',
            facility:       '',
            provider:       '',
            administeredBy: IMMUNIZATION_ADMINISTERED_BY.OTHER,
            notes:          '',
            source:         IMMUNIZATION_SOURCES.MANUAL,
            ...immunization,
            // These are ours to control regardless of what was passed in
            id:        immunization.id || crypto.randomUUID(),
            reaction:  immunization.reaction || {
                occurred:     false,
                severity:     null,
                description:  '',
                onsetDate:    null,
                symptomLogId: null,
            },
            createdAt: immunization.createdAt || now,
            updatedAt: now,
        };

        immunizations.unshift(newRecord);
        const key = getProfileKey('symptomTracker_immunizations', profileId);
        cacheSet(key, immunizations);
        return newRecord;
    } catch (error) {
        console.error('Error saving immunization:', error);
        return null;
    }
};

/**
 * Update an immunization.
 *
 * The first time a VA-imported record is hand-edited we snapshot the original
 * values into `originalImport` and set `edited: true`. The PDF export needs to
 * be able to mark a record as user-modified rather than presenting altered
 * data as verbatim VA data — that distinction protects the Veteran if a
 * reviewer ever compares the export against the VA's own file.
 */
export const updateImmunization = (id, updates, profileId = null) => {
    try {
        const immunizations = getImmunizations(profileId);
        const index = immunizations.findIndex(i => i.id === id);
        if (index === -1) return null;

        const existing = immunizations[index];
        const isVaRecord = existing.source === IMMUNIZATION_SOURCES.VA_IMPORT;

        let originalImport = existing.originalImport || null;
        if (isVaRecord && !originalImport) {
            // Snapshot everything except bookkeeping fields
            const {
                id: _id,
                originalImport: _oi,
                edited: _ed,
                updatedAt: _ua,
                ...snapshot
            } = existing;
            originalImport = snapshot;
        }

        immunizations[index] = {
            ...existing,
            ...updates,
            // Identity and provenance are not user-editable
            id:             existing.id,
            source:         existing.source,
            createdAt:      existing.createdAt,
            originalImport,
            edited:         isVaRecord ? true : (existing.edited || false),
            updatedAt:      new Date().toISOString(),
        };

        const key = getProfileKey('symptomTracker_immunizations', profileId);
        cacheSet(key, immunizations);
        return immunizations[index];
    } catch (error) {
        console.error('Error updating immunization:', error);
        return null;
    }
};

export const deleteImmunization = (id, profileId = null) => {
    try {
        const immunizations = getImmunizations(profileId);
        const filtered = immunizations.filter(i => i.id !== id);
        const key = getProfileKey('symptomTracker_immunizations', profileId);
        cacheSet(key, filtered);
        return true;
    } catch (error) {
        console.error('Error deleting immunization:', error);
        return false;
    }
};

/**
 * Find an existing record matching a name + date. Used by the Blue Button
 * wizard's conflict detection before the user ever sees the preview screen.
 */
export const findImmunizationMatch = (vaccineName, vaccineDate, profileId = null) => {
    const matchKey = getImmunizationMatchKey(vaccineName, vaccineDate);
    return getImmunizations(profileId).find(
        i => getImmunizationMatchKey(i.vaccineName, i.vaccineDate) === matchKey
    ) || null;
};

/**
 * Write one Blue Button vaccine record, merging instead of duplicating.
 *
 * Rules, in order:
 *   1. No match  → create a new record tagged VA_IMPORT.
 *   2. Match on a MANUAL record → do NOT duplicate. Flag it `vaConfirmed`
 *      so the Veteran can see the VA also has this one, and fill blanks.
 *   3. Match on a VA_IMPORT record → fill blank fields only. Never overwrite
 *      anything the user typed, and never touch notes or reaction data.
 *
 * Returns { action: 'created' | 'merged' | 'confirmed' | 'unchanged', record }
 */
export const upsertImportedImmunization = (record, profileId = null) => {
    try {
        const immunizations = getImmunizations(profileId);
        const matchKey = getImmunizationMatchKey(record.vaccineName, record.vaccineDate);
        const index = immunizations.findIndex(
            i => getImmunizationMatchKey(i.vaccineName, i.vaccineDate) === matchKey
        );

        // Case 1 — brand new
        if (index === -1) {
            const saved = saveImmunization({
                ...record,
                source:         IMMUNIZATION_SOURCES.VA_IMPORT,
                administeredBy: record.administeredBy || IMMUNIZATION_ADMINISTERED_BY.VA,
                importedAt:     new Date().toISOString(),
            }, profileId);
            return { action: 'created', record: saved };
        }

        const existing = immunizations[index];

        // Fill blanks only. Anything already populated stays as-is.
        // notes and reaction are deliberately absent from this list — those are
        // the Veteran's own words and the VA file has no business overwriting them.
        const FILLABLE_FIELDS = [
            'lotNumber', 'manufacturer', 'site', 'route',
            'facility', 'provider', 'doseNumber', 'seriesTotal',
        ];

        const isBlank = (v) => v === undefined || v === null || v === '';

        const filled = {};
        FILLABLE_FIELDS.forEach(field => {
            if (isBlank(existing[field]) && !isBlank(record[field])) {
                filled[field] = record[field];
            }
        });

        // Case 2 — VA file confirms a record the Veteran entered by hand
        const wasManual = existing.source === IMMUNIZATION_SOURCES.MANUAL;
        const vaConfirmed = wasManual ? true : (existing.vaConfirmed || false);
        const newlyConfirmed = wasManual && !existing.vaConfirmed;

        // Case 3 — nothing to do
        if (Object.keys(filled).length === 0 && !newlyConfirmed) {
            return { action: 'unchanged', record: existing };
        }

        immunizations[index] = {
            ...existing,
            ...filled,
            vaConfirmed,
            lastImportMatchAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
        };

        const key = getProfileKey('symptomTracker_immunizations', profileId);
        cacheSet(key, immunizations);

        return {
            action: newlyConfirmed ? 'confirmed' : 'merged',
            record: immunizations[index],
        };
    } catch (error) {
        console.error('Error upserting imported immunization:', error);
        return { action: 'error', record: null };
    }
};


// ============================================
// DIAGNOSES / HEALTH CONDITIONS
// ============================================

/**
 * Where a diagnosis record came from.
 *   VA_IMPORT — parsed from the Health Conditions section of a Blue Button file
 *   MANUAL    — typed in by the Veteran from a private provider's record,
 *               service treatment records, or a paper report
 */
export const DIAGNOSIS_SOURCES = {
    VA_IMPORT: 'va-import',
    MANUAL: 'manual',
};

/**
 * Categories that are on a VA problem list but are NOT medical diagnoses.
 *
 * A problem list carries social determinants alongside conditions. Edward's own
 * file contains "Homeless single person" and "Family bereavement" — real and
 * clinically relevant, but not conditions anyone is claiming, and not something
 * to put in a PDF a Veteran hands to a VSO without deciding to.
 *
 * These import and display normally. They're excluded from export by default,
 * and the Veteran can include any of them deliberately.
 */
export const NON_DIAGNOSIS_PATTERNS = [
    /homeless/i,
    /bereavement/i,
    /unemploy/i,
    /financial/i,
    /housing/i,
    /food insecur/i,
    /social/i,
    /caregiver/i,
    /transportation/i,
];

/**
 * Whether a condition name looks like a social determinant rather than a
 * diagnosis. Used to set excludeFromExport at import time; never overrides a
 * choice the Veteran has made.
 */
export const looksLikeSocialDeterminant = (conditionName) => {
    if (!conditionName) return false;
    return NON_DIAGNOSIS_PATTERNS.some(p => p.test(conditionName));
};

/**
 * Read all diagnoses, most recent first.
 *
 * Sorts on diagnosisDate when the Veteran has supplied one, falling back to
 * firstRecordedDate. A Veteran who corrects a date expects the list to reorder.
 */
export const getDiagnoses = (profileId = null) => {
    try {
        const key = getProfileKey('symptomTracker_diagnoses', profileId);
        const diagnoses = cacheGet(key);
        if (!Array.isArray(diagnoses)) return [];
        return diagnoses.slice().sort((a, b) => {
            const dateA = new Date(a.diagnosisDate || a.firstRecordedDate || a.createdAt || 0);
            const dateB = new Date(b.diagnosisDate || b.firstRecordedDate || b.createdAt || 0);
            return dateB - dateA;
        });
    } catch (error) {
        console.error('Error reading diagnoses:', error);
        return [];
    }
};

/**
 * Create a diagnosis record.
 *
 * TWO DATES, ON PURPOSE.
 *
 * firstRecordedDate is what the VA file says: the date this condition was added
 * to a facility's problem list. It is NOT a diagnosis date. Edward's file lists
 * Diabetes Mellitus Type 2 twice — March 2018 at Northern Arizona and January
 * 2021 at Cedar Rapids — because the problem list was re-entered when his care
 * moved. It is a floor on the diagnosis date, nothing more.
 *
 * diagnosisDate is the Veteran's answer, and it starts EMPTY.
 *
 * Several conditions are rated on time since diagnosis: hypoparathyroidism is
 * 100% for three months, hyperthyroidism 30% for six. Defaulting diagnosisDate
 * to firstRecordedDate would make those look more recently diagnosed than they
 * are, which keeps them inside the initial rating window and overstates. An
 * empty date means the analyzer declines to give a number, which is the honest
 * answer until somebody supplies one.
 *
 * Record shape:
 * {
 *   id, conditionName, snomedCode,
 *   firstRecordedDate ('YYYY-MM-DD', immutable, from import),
 *   diagnosisDate ('YYYY-MM-DD' or null, Veteran-supplied),
 *   conditionKey,            // maps to a rating analyzer, when we recognize it
 *   provider, facility,
 *   source, edited, excludeFromExport,
 *   notes, createdAt, updatedAt
 * }
 */
export const saveDiagnosis = (diagnosis, profileId = null) => {
    try {
        const diagnoses = getDiagnoses(profileId);
        const now = new Date().toISOString();

        const newRecord = {
            conditionName:     '',
            snomedCode:        null,
            firstRecordedDate: null,
            diagnosisDate:     null,
            conditionKey:      null,
            provider:          '',
            facility:          '',
            notes:             '',
            source:            DIAGNOSIS_SOURCES.MANUAL,
            ...diagnosis,
            // Ours to control regardless of what the caller passed
            id:        diagnosis.id || crypto.randomUUID(),
            // Only default this when the caller didn't decide. An explicit
            // false from the Veteran has to survive.
            excludeFromExport: diagnosis.excludeFromExport !== undefined
                ? diagnosis.excludeFromExport
                : looksLikeSocialDeterminant(diagnosis.conditionName),
            createdAt: diagnosis.createdAt || now,
            updatedAt: now,
        };

        diagnoses.unshift(newRecord);
        const key = getProfileKey('symptomTracker_diagnoses', profileId);
        cacheSet(key, diagnoses);
        return newRecord;
    } catch (error) {
        console.error('Error saving diagnosis:', error);
        return null;
    }
};

/**
 * Update a diagnosis.
 *
 * A VA-imported record that the Veteran edits gets flagged `edited`, and the
 * original import is snapshotted once. The claim package labels an edited
 * record as such: presenting altered data as verbatim VA data would undermine
 * every other VA-sourced line in the document.
 *
 * firstRecordedDate is deliberately NOT updatable. It's what the file said.
 */
export const updateDiagnosis = (id, updates, profileId = null) => {
    try {
        const diagnoses = getDiagnoses(profileId);
        const index = diagnoses.findIndex(d => d.id === id);
        if (index === -1) return null;

        const existing = diagnoses[index];
        const isVaRecord = existing.source === DIAGNOSIS_SOURCES.VA_IMPORT;

        // eslint-disable-next-line no-unused-vars
        const { firstRecordedDate, id: _ignoredId, ...safeUpdates } = updates;

        const updated = {
            ...existing,
            ...safeUpdates,
            id: existing.id,
            firstRecordedDate: existing.firstRecordedDate,
            edited: isVaRecord ? true : existing.edited,
            originalImport: isVaRecord && !existing.originalImport
                ? {
                    conditionName:     existing.conditionName,
                    firstRecordedDate: existing.firstRecordedDate,
                    provider:          existing.provider,
                    facility:          existing.facility,
                }
                : existing.originalImport,
            updatedAt: new Date().toISOString(),
        };

        diagnoses[index] = updated;
        const key = getProfileKey('symptomTracker_diagnoses', profileId);
        cacheSet(key, diagnoses);
        return updated;
    } catch (error) {
        console.error('Error updating diagnosis:', error);
        return null;
    }
};

/**
 * Delete a diagnosis.
 */
export const deleteDiagnosis = (id, profileId = null) => {
    try {
        const diagnoses = getDiagnoses(profileId);
        const filtered = diagnoses.filter(d => d.id !== id);
        if (filtered.length === diagnoses.length) return false;

        const key = getProfileKey('symptomTracker_diagnoses', profileId);
        cacheSet(key, filtered);
        return true;
    } catch (error) {
        console.error('Error deleting diagnosis:', error);
        return false;
    }
};

/**
 * Find an existing diagnosis by SNOMED code, falling back to a name match.
 *
 * SNOMED first because it's stable across facilities: Sleep Apnea is 73430006
 * whether it was entered in Arizona or Iowa. Name matching is the fallback for
 * manual entries, which have no code.
 */
export const findDiagnosisMatch = (snomedCode, conditionName, profileId = null) => {
    try {
        const diagnoses = getDiagnoses(profileId);
        if (snomedCode) {
            const byCode = diagnoses.find(d => d.snomedCode === snomedCode);
            if (byCode) return byCode;
        }
        if (!conditionName) return null;
        const target = conditionName.toLowerCase().trim();
        return diagnoses.find(d => (d.conditionName || '').toLowerCase().trim() === target) || null;
    } catch (error) {
        console.error('Error matching diagnosis:', error);
        return null;
    }
};

/**
 * Import a diagnosis from a Blue Button file, or reconcile with one already held.
 *
 * DEDUP KEEPS THE OLDEST DATE, which is the opposite of the vaccine upsert.
 *
 * A vaccine appearing twice means two facilities hold the same record, and we
 * keep whichever is richest. A condition appearing twice means the problem list
 * was re-entered at a new facility, and the later entry is further from the
 * actual diagnosis. Keeping the newer date would push the condition's apparent
 * onset forward and, for time-limited ratings, claim an initial-period rating
 * the Veteran is no longer inside.
 *
 * @returns {{action: 'created'|'updated'|'unchanged', record: object}}
 */
export const upsertImportedDiagnosis = (record, profileId = null) => {
    try {
        const existing = findDiagnosisMatch(record.snomedCode, record.conditionName, profileId);

        if (!existing) {
            const created = saveDiagnosis({
                ...record,
                source: DIAGNOSIS_SOURCES.VA_IMPORT,
                importedAt: new Date().toISOString(),
            }, profileId);
            return { action: 'created', record: created };
        }

        const updates = {};

        // Older wins. See the note above.
        const incoming = record.firstRecordedDate;
        const held = existing.firstRecordedDate;
        if (incoming && (!held || new Date(incoming) < new Date(held))) {
            // firstRecordedDate is blocked in updateDiagnosis, so write it here
            // where we know the correction is from the file rather than a hand edit.
            const diagnoses = getDiagnoses(profileId);
            const index = diagnoses.findIndex(d => d.id === existing.id);
            if (index !== -1) {
                diagnoses[index] = {
                    ...diagnoses[index],
                    firstRecordedDate: incoming,
                    provider: diagnoses[index].provider || record.provider || '',
                    facility: diagnoses[index].facility || record.facility || '',
                    updatedAt: new Date().toISOString(),
                };
                cacheSet(getProfileKey('symptomTracker_diagnoses', profileId), diagnoses);
                return { action: 'updated', record: diagnoses[index] };
            }
        }

        // Fill blanks without touching anything the Veteran supplied.
        if (!existing.provider && record.provider) updates.provider = record.provider;
        if (!existing.facility && record.facility) updates.facility = record.facility;
        if (!existing.snomedCode && record.snomedCode) updates.snomedCode = record.snomedCode;

        if (Object.keys(updates).length === 0) {
            return { action: 'unchanged', record: existing };
        }

        // A file filling in blanks is not a hand edit, so don't flag `edited`.
        const diagnoses = getDiagnoses(profileId);
        const index = diagnoses.findIndex(d => d.id === existing.id);
        diagnoses[index] = { ...diagnoses[index], ...updates, updatedAt: new Date().toISOString() };
        cacheSet(getProfileKey('symptomTracker_diagnoses', profileId), diagnoses);
        return { action: 'updated', record: diagnoses[index] };
    } catch (error) {
        console.error('Error importing diagnosis:', error);
        return { action: 'unchanged', record: null };
    }
};

/**
 * The Veteran's diagnosis date for a condition, or null.
 *
 * This is what the time-limited rating analyzers call. Returning null is a
 * real answer and means "we don't know" — the analyzer must then decline to
 * report a numeric rating rather than falling back to the initial-period
 * figure. That fallback is the bug this whole feature exists to fix.
 *
 * @param {string} conditionKey - e.g. 'hypoparathyroidism'
 * @returns {string|null} 'YYYY-MM-DD'
 */
export const getDiagnosisDate = (conditionKey, profileId = null) => {
    try {
        if (!conditionKey) return null;
        const diagnoses = getDiagnoses(profileId);
        const match = diagnoses.find(d => d.conditionKey === conditionKey && d.diagnosisDate);
        return match ? match.diagnosisDate : null;
    } catch (error) {
        console.error('Error reading diagnosis date:', error);
        return null;
    }
};

/**
 * Months elapsed since diagnosis, or null when no date is on file.
 *
 * Analyzers use this to decide whether a Veteran is inside an initial rating
 * window. Fractional so a 5.9-month result doesn't round into the 6-month
 * window it just left.
 */
export const monthsSinceDiagnosis = (conditionKey, profileId = null) => {
    const date = getDiagnosisDate(conditionKey, profileId);
    if (!date) return null;
    const then = new Date(date + 'T00:00:00');
    if (isNaN(then)) return null;
    const msPerMonth = 1000 * 60 * 60 * 24 * 30.44;
    return (Date.now() - then.getTime()) / msPerMonth;
};


/**
 * The most recent surgery linked to a condition, with the date its
 * post-surgical rating clock starts from.
 *
 * DC 7904 (hyperparathyroidism) is 100% "for six months from date of
 * discharge following surgery". Discharge is optional on the surgery form.
 * When it's blank the surgery date is used instead and dateSource says so.
 * Discharge is the same day as surgery or later, so the fallback can only end
 * the window early, never late: it can understate, never overstate.
 *
 * @param {string} conditionKey - e.g. 'hyperparathyroidism'
 * @returns {{surgery: object, clockDate: string, dateSource: 'discharge'|'surgery'}|null}
 */
export const getLatestLinkedSurgery = (conditionKey, profileId = null) => {
    try {
        if (!conditionKey) return null;
        const linked = getSurgeries(profileId)
            .filter(s => s.conditionKey === conditionKey && s.surgeryDate)
            .map(s => ({
                surgery: s,
                clockDate: s.dischargeDate || s.surgeryDate,
                dateSource: s.dischargeDate ? 'discharge' : 'surgery',
            }));
        if (linked.length === 0) return null;
        linked.sort((a, b) =>
            new Date(b.clockDate + 'T00:00:00') - new Date(a.clockDate + 'T00:00:00'));
        return linked[0];
    } catch (error) {
        console.error('Error reading linked surgery:', error);
        return null;
    }
};

/**
 * Months since the most recent linked surgery's clock date, plus that record.
 * Negative months means the surgery is dated in the future (scheduled).
 *
 * @returns {{months: number, surgery, clockDate, dateSource}|null}
 */
export const monthsSinceLinkedSurgery = (conditionKey, profileId = null) => {
    const latest = getLatestLinkedSurgery(conditionKey, profileId);
    if (!latest) return null;
    const then = new Date(latest.clockDate + 'T00:00:00');
    if (isNaN(then)) {
        console.error(`Linked surgery for "${conditionKey}" has an unreadable date: ${latest.clockDate}`);
        return null;
    }
    const msPerMonth = 1000 * 60 * 60 * 24 * 30.44;
    return { ...latest, months: (Date.now() - then.getTime()) / msPerMonth };
};


/**
 * Fill in conditionKey on diagnoses that don't have one yet.
 *
 * Runs on every Diagnoses tab load. Two cases it handles:
 *   • records imported before snomedMap.js existed
 *   • records whose SNOMED code has since been added to the map
 *
 * Only ever fills a null. A key the Veteran chose by hand is never
 * overwritten — they know their own diagnosis better than a lookup table.
 *
 * @returns {number} how many were linked
 */
export const backfillDiagnosisConditionKeys = (profileId = null) => {
    try {
        const diagnoses = getDiagnoses(profileId);
        let linked = 0;

        const updated = diagnoses.map(d => {
            if (d.conditionKey || !d.snomedCode) return d;
            const key = conditionKeyForSnomed(d.snomedCode);
            if (!key) return d;
            linked++;
            return { ...d, conditionKey: key, updatedAt: new Date().toISOString() };
        });

        if (linked > 0) {
            cacheSet(getProfileKey('symptomTracker_diagnoses', profileId), updated);
            console.log(`🔗 Linked ${linked} diagnos${linked === 1 ? 'is' : 'es'} to rating conditions`);
        }
        return linked;
    } catch (error) {
        console.error('Error backfilling diagnosis condition keys:', error);
        return 0;
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
  const immunizations = getImmunizations(profileId);

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
    immunizations: immunizations.length,
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
    // Bumped 1.4 → 1.5: adds the immunizations array.
    // Older 1.4 backups restore fine; they just have no immunizations key.
    version: '1.5',
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
    immunizations: getImmunizations(activeId),
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
      // Absent in backups from before v1.5 — guarded so older files restore cleanly
      if (Array.isArray(data.immunizations)) {
        cacheSet(getProfileKey('symptomTracker_immunizations', activeId), data.immunizations);
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
  cacheRemove(getProfileKey('symptomTracker_immunizations', activeId));
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