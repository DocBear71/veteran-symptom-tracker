import { getProfile } from './profile';

// Local storage keys
const STORAGE_KEYS = {
    SYMPTOM_LOGS: 'symptomTracker_logs',
    USER_SETTINGS: 'symptomTracker_settings',
};

// Save symptom log entry
export const saveSymptomLog = (entry) => {
    const logs = getSymptomLogs();
    const newEntry = {
        ...entry,
        id: crypto.randomUUID(),
        timestamp: new Date().toISOString(),
    };
    logs.push(newEntry);
    localStorage.setItem(STORAGE_KEYS.SYMPTOM_LOGS, JSON.stringify(logs));
    return newEntry;
};

// Get all symptom logs
export const getSymptomLogs = () => {
    const logs = localStorage.getItem(STORAGE_KEYS.SYMPTOM_LOGS);
    return logs ? JSON.parse(logs) : [];
};

// Get logs for a specific date range
export const getLogsByDateRange = (startDate, endDate) => {
    const logs = getSymptomLogs();
    return logs.filter(log => {
        const logDate = new Date(log.timestamp);
        return logDate >= startDate && logDate <= endDate;
    });
};

// Get today's logs
export const getTodaysLogs = () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    return getLogsByDateRange(today, tomorrow);
};

// Delete a specific log entry
export const deleteSymptomLog = (id) => {
    const logs = getSymptomLogs();
    const filtered = logs.filter(log => log.id !== id);
    localStorage.setItem(STORAGE_KEYS.SYMPTOM_LOGS, JSON.stringify(filtered));
};

// Update an existing log entry
export const updateSymptomLog = (id, updates) => {
    const logs = getSymptomLogs();
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

    localStorage.setItem(STORAGE_KEYS.SYMPTOM_LOGS, JSON.stringify(logs));
    return { success: true, log: logs[index] };
};

// Get a single log by ID
export const getSymptomLogById = (id) => {
    const logs = getSymptomLogs();
    return logs.find(log => log.id === id) || null;
};
// --- Custom Symptoms ---

const CUSTOM_SYMPTOMS_KEY = 'symptomTracker_customSymptoms';

export const getCustomSymptoms = () => {
    const symptoms = localStorage.getItem(CUSTOM_SYMPTOMS_KEY);
    return symptoms ? JSON.parse(symptoms) : [];
};

export const addCustomSymptom = (name, category = 'Custom') => {
    const symptoms = getCustomSymptoms();

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
        createdAt: new Date().toISOString(),
    };

    symptoms.push(newSymptom);
    localStorage.setItem(CUSTOM_SYMPTOMS_KEY, JSON.stringify(symptoms));
    return { success: true, symptom: newSymptom };
};

export const deleteCustomSymptom = (id) => {
    const symptoms = getCustomSymptoms();
    const filtered = symptoms.filter(s => s.id !== id);
    localStorage.setItem(CUSTOM_SYMPTOMS_KEY, JSON.stringify(filtered));
};

// --- Chronic Symptoms (formerly Favorites) ---

const CHRONIC_SYMPTOMS_KEY = 'symptomTracker_chronicSymptoms';
// Keep old key for migration
const LEGACY_FAVORITES_KEY = 'symptomTracker_favorites';

// Get chronic symptoms (with migration from old favorites)
export const getChronicSymptoms = () => {
    // First check for new key
    let chronicSymptoms = localStorage.getItem(CHRONIC_SYMPTOMS_KEY);

    if (chronicSymptoms) {
        return JSON.parse(chronicSymptoms);
    }

    // Check for legacy favorites and migrate
    const legacyFavorites = localStorage.getItem(LEGACY_FAVORITES_KEY);
    if (legacyFavorites) {
        const favorites = JSON.parse(legacyFavorites);
        // Migrate to new key
        localStorage.setItem(CHRONIC_SYMPTOMS_KEY, JSON.stringify(favorites));
        // Remove old key
        localStorage.removeItem(LEGACY_FAVORITES_KEY);
        return favorites;
    }

    return [];
};

// Add a chronic symptom
export const addChronicSymptom = (symptom) => {
    const chronicSymptoms = getChronicSymptoms();

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
    localStorage.setItem(CHRONIC_SYMPTOMS_KEY, JSON.stringify(chronicSymptoms));
    return { success: true, chronic: newChronic };
};

// Remove a chronic symptom
export const removeChronicSymptom = (symptomId) => {
    const chronicSymptoms = getChronicSymptoms();
    const filtered = chronicSymptoms.filter(c => c.symptomId !== symptomId);
    localStorage.setItem(CHRONIC_SYMPTOMS_KEY, JSON.stringify(filtered));
};

// Update chronic symptom's default severity
export const updateChronicDefaults = (symptomId, defaultSeverity) => {
    const chronicSymptoms = getChronicSymptoms();
    const index = chronicSymptoms.findIndex(c => c.symptomId === symptomId);
    if (index !== -1) {
        chronicSymptoms[index].defaultSeverity = defaultSeverity;
        localStorage.setItem(CHRONIC_SYMPTOMS_KEY, JSON.stringify(chronicSymptoms));
    }
};

// Check if a symptom is in chronic list
export const isChronicSymptom = (symptomId) => {
    const chronicSymptoms = getChronicSymptoms();
    return chronicSymptoms.some(c => c.symptomId === symptomId);
};

// Legacy aliases for backward compatibility
export const getFavorites = getChronicSymptoms;
export const addFavorite = addChronicSymptom;
export const removeFavorite = removeChronicSymptom;
export const updateFavoriteDefaults = updateChronicDefaults;
export const isFavorite = isChronicSymptom;

// --- Data Backup & Restore ---

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

// --- Medications ---

const MEDICATIONS_KEY = 'symptomTracker_medications';
const MEDICATION_LOGS_KEY = 'symptomTracker_medicationLogs';

export const getMedications = () => {
    const meds = localStorage.getItem(MEDICATIONS_KEY);
    return meds ? JSON.parse(meds) : [];
};

export const addMedication = (medication) => {
    const meds = getMedications();

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
    localStorage.setItem(MEDICATIONS_KEY, JSON.stringify(meds));
    return { success: true, medication: newMed };
};

export const updateMedication = (id, updates) => {
    const meds = getMedications();
    const index = meds.findIndex(m => m.id === id);
    if (index === -1) {
        return { success: false, message: 'Medication not found' };
    }

    meds[index] = { ...meds[index], ...updates };
    localStorage.setItem(MEDICATIONS_KEY, JSON.stringify(meds));
    return { success: true, medication: meds[index] };
};

export const deleteMedication = (id) => {
    const meds = getMedications();
    const filtered = meds.filter(m => m.id !== id);
    localStorage.setItem(MEDICATIONS_KEY, JSON.stringify(filtered));
};

export const logMedicationTaken = (entry) => {
    const logs = getMedicationLogs();

    const newLog = {
        id: crypto.randomUUID(),
        medicationId: entry.medicationId,
        medicationName: entry.medicationName,
        dosage: entry.dosage,
        timestamp: new Date().toISOString(),
        takenFor: entry.takenFor || '',
        symptomLogId: entry.symptomLogId || null,
        effectiveness: entry.effectiveness || null,
        sideEffects: entry.sideEffects || '',
        notes: entry.notes || '',
    };

    logs.push(newLog);
    localStorage.setItem(MEDICATION_LOGS_KEY, JSON.stringify(logs));
    return { success: true, log: newLog };
};

export const getMedicationLogs = () => {
    const logs = localStorage.getItem(MEDICATION_LOGS_KEY);
    return logs ? JSON.parse(logs) : [];
};

export const getMedicationLogsForSymptom = (symptomLogId) => {
    const logs = getMedicationLogs();
    return logs.filter(log => log.symptomLogId === symptomLogId);
};

export const getMedicationLogsByDateRange = (startDate, endDate) => {
    const logs = getMedicationLogs();
    return logs.filter(log => {
        const logDate = new Date(log.timestamp);
        return logDate >= startDate && logDate <= endDate;
    });
};

export const deleteMedicationLog = (id) => {
    const logs = getMedicationLogs();
    const filtered = logs.filter(log => log.id !== id);
    localStorage.setItem(MEDICATION_LOGS_KEY, JSON.stringify(filtered));
};

export const getTodaysMedicationLogs = () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    return getMedicationLogsByDateRange(today, tomorrow);
};

// --- Appointments ---

const APPOINTMENTS_KEY = 'symptomTracker_appointments';

export const getAppointments = () => {
    try {
        const data = localStorage.getItem(APPOINTMENTS_KEY);
        return data ? JSON.parse(data) : [];
    } catch (error) {
        console.error('Error reading appointments:', error);
        return [];
    }
};

export const saveAppointment = (appointment) => {
    try {
        const appointments = getAppointments();
        const newAppointment = {
            ...appointment,
            id: Date.now().toString(),
            createdAt: new Date().toISOString(),
        };
        appointments.unshift(newAppointment);
        localStorage.setItem(APPOINTMENTS_KEY, JSON.stringify(appointments));
        return newAppointment;
    } catch (error) {
        console.error('Error saving appointment:', error);
        return null;
    }
};

export const updateAppointment = (id, updatedData) => {
    try {
        const appointments = getAppointments();
        const index = appointments.findIndex(apt => apt.id === id);
        if (index !== -1) {
            appointments[index] = {
                ...appointments[index],
                ...updatedData,
                updatedAt: new Date().toISOString(),
            };
            localStorage.setItem(APPOINTMENTS_KEY, JSON.stringify(appointments));
            return appointments[index];
        }
        return null;
    } catch (error) {
        console.error('Error updating appointment:', error);
        return null;
    }
};

export const deleteAppointment = (id) => {
    try {
        const appointments = getAppointments();
        const filtered = appointments.filter(apt => apt.id !== id);
        localStorage.setItem(APPOINTMENTS_KEY, JSON.stringify(filtered));
        return true;
    } catch (error) {
        console.error('Error deleting appointment:', error);
        return false;
    }
};

export const getAppointmentsByDateRange = (startDate, endDate) => {
    const appointments = getAppointments();
    return appointments.filter(apt => {
        const aptDate = new Date(apt.appointmentDate);
        return aptDate >= startDate && aptDate <= endDate;
    });
};

// --- Onboarding ---

const ONBOARDING_KEY = 'symptomTracker_onboardingComplete';

// Check if onboarding has been completed
export const isOnboardingComplete = () => {
  return localStorage.getItem(ONBOARDING_KEY) === 'true';
};

// Mark onboarding as complete
export const setOnboardingComplete = () => {
  localStorage.setItem(ONBOARDING_KEY, 'true');
};

// Reset onboarding (for testing or Settings)
export const resetOnboarding = () => {
  localStorage.removeItem(ONBOARDING_KEY);
};

// ============================================
// UPDATED exportAllData FUNCTION
// ============================================
// Replace your existing exportAllData with this version

export const exportAllData = () => {
  // Get profile data
  const profileData = localStorage.getItem('symptomTracker_profile');
  const onboardingComplete = localStorage.getItem('symptomTracker_onboardingComplete');
  const sleepApneaProfile = localStorage.getItem('symptomTracker_sleepApneaProfile');

  const data = {
    version: '1.3', // Updated version for sleep apnea profile support
    exportedAt: new Date().toISOString(),

    // Existing data
    symptomLogs: getSymptomLogs(),
    customSymptoms: getCustomSymptoms(),
    favorites: getFavorites(),
    medications: getMedications(),
    medicationLogs: getMedicationLogs(),
    appointments: getAppointments(),
    reminderSettings: JSON.parse(localStorage.getItem('symptomTracker_reminderSettings') || 'null'),

    // Profile data
    profile: profileData ? JSON.parse(profileData) : null,
    onboardingComplete: onboardingComplete === 'true',

    // Condition-specific profiles (for rating analysis)
    sleepApneaProfile: sleepApneaProfile ? JSON.parse(sleepApneaProfile) : null,
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

// ============================================
// UPDATED importAllData FUNCTION
// ============================================
// Replace your existing importAllData with this version
// This handles both old backups (without profile) and new ones (with profile)

export const importAllData = (jsonData, options = { merge: false }) => {
  try {
    const data = typeof jsonData === 'string' ? JSON.parse(jsonData) : jsonData;

    const validation = validateBackupData(data);
    if (!validation.valid) {
      return { success: false, message: validation.message };
    }

    if (options.merge) {
      // Merge logic - existing code unchanged
      const existingLogs = getSymptomLogs();
      const existingCustomSymptoms = getCustomSymptoms();
      const existingFavorites = getFavorites();

      const existingLogIds = new Set(existingLogs.map(log => log.id));
      const newLogs = data.symptomLogs.filter(log => !existingLogIds.has(log.id));
      const mergedLogs = [...existingLogs, ...newLogs];

      const existingSymptomNames = new Set(existingCustomSymptoms.map(s => s.name.toLowerCase()));
      const newSymptoms = (data.customSymptoms || []).filter(
          s => !existingSymptomNames.has(s.name.toLowerCase())
      );
      const mergedSymptoms = [...existingCustomSymptoms, ...newSymptoms];

      const existingFavoriteIds = new Set(existingFavorites.map(f => f.symptomId));
      const newFavorites = (data.favorites || []).filter(
          f => !existingFavoriteIds.has(f.symptomId)
      );
      const mergedFavorites = [...existingFavorites, ...newFavorites];

      localStorage.setItem('symptomTracker_logs', JSON.stringify(mergedLogs));
      localStorage.setItem('symptomTracker_customSymptoms', JSON.stringify(mergedSymptoms));
      localStorage.setItem('symptomTracker_favorites', JSON.stringify(mergedFavorites));

      // Note: Don't merge profile - keep current profile on merge

      return {
        success: true,
        message: `Merged ${newLogs.length} new log entries`,
        stats: {
          logsAdded: newLogs.length,
          symptomsAdded: newSymptoms.length,
          favoritesAdded: newFavorites.length,
        },
      };
    } else {
      // Replace all data
      localStorage.setItem('symptomTracker_logs', JSON.stringify(data.symptomLogs));

      if (data.customSymptoms) {
        localStorage.setItem('symptomTracker_customSymptoms', JSON.stringify(data.customSymptoms));
      }

      if (data.favorites) {
        localStorage.setItem('symptomTracker_favorites', JSON.stringify(data.favorites));
      }

      if (data.reminderSettings) {
        localStorage.setItem('symptomTracker_reminderSettings', JSON.stringify(data.reminderSettings));
      }

      if (data.medications) {
        localStorage.setItem('symptomTracker_medications', JSON.stringify(data.medications));
      }

      if (data.medicationLogs) {
        localStorage.setItem('symptomTracker_medicationLogs', JSON.stringify(data.medicationLogs));
      }

      if (data.appointments) {
        localStorage.setItem('symptomTracker_appointments', JSON.stringify(data.appointments));
      }

      // NEW: Restore profile data if present
      if (data.profile) {
        localStorage.setItem('symptomTracker_profile', JSON.stringify(data.profile));
      }
      if (data.onboardingComplete !== undefined) {
        localStorage.setItem('symptomTracker_onboardingComplete', data.onboardingComplete.toString());
      }

      // Restore condition-specific profiles
      if (data.sleepApneaProfile) {
        localStorage.setItem('symptomTracker_sleepApneaProfile', JSON.stringify(data.sleepApneaProfile));
      }

      return {
        success: true,
        message: `Restored ${data.symptomLogs.length} log entries`,
        stats: {
          logsRestored: data.symptomLogs.length,
          symptomsRestored: (data.customSymptoms || []).length,
          favoritesRestored: (data.favorites || []).length,
          profileRestored: !!data.profile,
        },
      };
    }
  } catch (error) {
    return { success: false, message: `Error processing file: ${error.message}` };
  }
};

// ============================================
// UPDATED clearAllData FUNCTION
// ============================================
// Include profile data in complete reset

export const clearAllData = () => {
  // Existing data
  localStorage.removeItem('symptomTracker_logs');
  localStorage.removeItem('symptomTracker_customSymptoms');
  localStorage.removeItem('symptomTracker_favorites');
  localStorage.removeItem('symptomTracker_medications');
  localStorage.removeItem('symptomTracker_medicationLogs');
  localStorage.removeItem('symptomTracker_appointments');
  localStorage.removeItem('symptomTracker_reminderSettings');

  // Profile data
  localStorage.removeItem('symptomTracker_profile');
  localStorage.removeItem('symptomTracker_onboardingComplete');

  // Condition-specific profiles
  localStorage.removeItem('symptomTracker_sleepApneaProfile');
};

// ============================================
// UPDATED getDataStats FUNCTION
// ============================================

export const getDataStats = () => {
  const profileData = localStorage.getItem('symptomTracker_profile');
  const profile = profileData ? JSON.parse(profileData) : null;

  const sleepApneaProfileData = localStorage.getItem('symptomTracker_sleepApneaProfile');
  const sleepApneaProfile = sleepApneaProfileData ? JSON.parse(sleepApneaProfileData) : null;

  return {
    logs: getSymptomLogs().length,
    customSymptoms: getCustomSymptoms().length,
    favorites: getFavorites().length,
    medications: getMedications().length,
    medicationLogs: getMedicationLogs().length,
    appointments: getAppointments().length,
    profileType: profile?.type || 'not set',
    sleepApneaProfileSet: sleepApneaProfile?.hasDiagnosis !== undefined,
  };
};