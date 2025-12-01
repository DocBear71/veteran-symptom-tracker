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
    id: crypto.randomUUID(), // Unique ID for each entry
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

  // Preserve original id and timestamp, update everything else
  logs[index] = {
    ...logs[index],
    ...updates,
    id: logs[index].id, // Keep original ID
    timestamp: logs[index].timestamp, // Keep original timestamp
    updatedAt: new Date().toISOString(), // Track when edited
  };

  localStorage.setItem(STORAGE_KEYS.SYMPTOM_LOGS, JSON.stringify(logs));
  return { success: true, log: logs[index] };
};

// Get a single log by ID
export const getSymptomLogById = (id) => {
  const logs = getSymptomLogs();
  return logs.find(log => log.id === id) || null;
};

// Clear all data (use with caution)
export const clearAllData = () => {
  localStorage.removeItem(STORAGE_KEYS.SYMPTOM_LOGS);
};

// --- Custom Symptoms ---

const CUSTOM_SYMPTOMS_KEY = 'symptomTracker_customSymptoms';

// Get all custom symptoms
export const getCustomSymptoms = () => {
  const symptoms = localStorage.getItem(CUSTOM_SYMPTOMS_KEY);
  return symptoms ? JSON.parse(symptoms) : [];
};

// Add a new custom symptom
export const addCustomSymptom = (name, category = 'Custom') => {
  const symptoms = getCustomSymptoms();

  // Check for duplicates (case-insensitive)
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

// Delete a custom symptom
export const deleteCustomSymptom = (id) => {
  const symptoms = getCustomSymptoms();
  const filtered = symptoms.filter(s => s.id !== id);
  localStorage.setItem(CUSTOM_SYMPTOMS_KEY, JSON.stringify(filtered));
};

// --- Favorite Symptoms ---

const FAVORITES_KEY = 'symptomTracker_favorites';

// Get favorite symptoms
export const getFavorites = () => {
  const favorites = localStorage.getItem(FAVORITES_KEY);
  return favorites ? JSON.parse(favorites) : [];
};

// Add a favorite symptom
export const addFavorite = (symptom) => {
  const favorites = getFavorites();

  // Check if already exists
  const exists = favorites.some(f => f.symptomId === symptom.symptomId);
  if (exists) {
    return { success: false, message: 'Already in favorites' };
  }

  // Limit to 8 favorites
  if (favorites.length >= 8) {
    return { success: false, message: 'Maximum 8 favorites allowed' };
  }

  const newFavorite = {
    symptomId: symptom.symptomId,
    symptomName: symptom.symptomName,
    category: symptom.category,
    defaultSeverity: symptom.defaultSeverity || 5,
    addedAt: new Date().toISOString(),
  };

  favorites.push(newFavorite);
  localStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites));
  return { success: true, favorite: newFavorite };
};

// Remove a favorite
export const removeFavorite = (symptomId) => {
  const favorites = getFavorites();
  const filtered = favorites.filter(f => f.symptomId !== symptomId);
  localStorage.setItem(FAVORITES_KEY, JSON.stringify(filtered));
};

// Update favorite's default severity
export const updateFavoriteDefaults = (symptomId, defaultSeverity) => {
  const favorites = getFavorites();
  const index = favorites.findIndex(f => f.symptomId === symptomId);
  if (index !== -1) {
    favorites[index].defaultSeverity = defaultSeverity;
    localStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites));
  }
};

// Check if a symptom is favorited
export const isFavorite = (symptomId) => {
  const favorites = getFavorites();
  return favorites.some(f => f.symptomId === symptomId);
};

// --- Data Backup & Restore ---

// Export all data as JSON
export const exportAllData = () => {
  const data = {
    version: '1.1', // Updated version
    exportedAt: new Date().toISOString(),
    symptomLogs: getSymptomLogs(),
    customSymptoms: getCustomSymptoms(),
    favorites: getFavorites(),
    medications: getMedications(),
    medicationLogs: getMedicationLogs(),
    reminderSettings: JSON.parse(localStorage.getItem('symptomTracker_reminderSettings') || 'null'),
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

// Validate backup data structure
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

// Import data from JSON backup
export const importAllData = (jsonData, options = { merge: false }) => {
  try {
    const data = typeof jsonData === 'string' ? JSON.parse(jsonData) : jsonData;

    const validation = validateBackupData(data);
    if (!validation.valid) {
      return { success: false, message: validation.message };
    }

    if (options.merge) {
      // Merge with existing data
      const existingLogs = getSymptomLogs();
      const existingCustomSymptoms = getCustomSymptoms();
      const existingFavorites = getFavorites();

      // Merge logs (avoid duplicates by ID)
      const existingLogIds = new Set(existingLogs.map(log => log.id));
      const newLogs = data.symptomLogs.filter(log => !existingLogIds.has(log.id));
      const mergedLogs = [...existingLogs, ...newLogs];
      localStorage.setItem('symptomTracker_logs', JSON.stringify(mergedLogs));

      // Merge custom symptoms
      const existingSymptomIds = new Set(existingCustomSymptoms.map(s => s.id));
      const newSymptoms = (data.customSymptoms || []).filter(s => !existingSymptomIds.has(s.id));
      const mergedSymptoms = [...existingCustomSymptoms, ...newSymptoms];
      localStorage.setItem('symptomTracker_customSymptoms', JSON.stringify(mergedSymptoms));

      // Merge favorites
      const existingFavIds = new Set(existingFavorites.map(f => f.symptomId));
      const newFavorites = (data.favorites || []).filter(f => !existingFavIds.has(f.symptomId));
      const mergedFavorites = [...existingFavorites, ...newFavorites];
      localStorage.setItem('symptomTracker_favorites', JSON.stringify(mergedFavorites));

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
        localStorage.setItem(MEDICATIONS_KEY, JSON.stringify(data.medications));
      }

      if (data.medicationLogs) {
        localStorage.setItem(MEDICATION_LOGS_KEY, JSON.stringify(data.medicationLogs));
      }

      return {
        success: true,
        message: `Restored ${data.symptomLogs.length} log entries`,
        stats: {
          logsRestored: data.symptomLogs.length,
          symptomsRestored: (data.customSymptoms || []).length,
          favoritesRestored: (data.favorites || []).length,
        },
      };
    }
  } catch (error) {
    return { success: false, message: `Error processing file: ${error.message}` };
  }
};

// Get data statistics
export const getDataStats = () => {
  return {
    logs: getSymptomLogs().length,
    customSymptoms: getCustomSymptoms().length,
    favorites: getFavorites().length,
    medications: getMedications().length,
    medicationLogs: getMedicationLogs().length,
  };
};

// --- Medications ---

const MEDICATIONS_KEY = 'symptomTracker_medications';
const MEDICATION_LOGS_KEY = 'symptomTracker_medicationLogs';

// Get all medications (the user's medication list)
export const getMedications = () => {
  const meds = localStorage.getItem(MEDICATIONS_KEY);
  return meds ? JSON.parse(meds) : [];
};

// Add a new medication to the list
export const addMedication = (medication) => {
  const meds = getMedications();

  // Check for duplicates
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
    frequency: medication.frequency || 'as-needed', // daily, twice-daily, as-needed, etc.
    forConditions: medication.forConditions || [], // what it's prescribed for
    notes: medication.notes || '',
    isActive: true,
    createdAt: new Date().toISOString(),
  };

  meds.push(newMed);
  localStorage.setItem(MEDICATIONS_KEY, JSON.stringify(meds));
  return { success: true, medication: newMed };
};

// Update a medication
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

// Delete a medication
export const deleteMedication = (id) => {
  const meds = getMedications();
  const filtered = meds.filter(m => m.id !== id);
  localStorage.setItem(MEDICATIONS_KEY, JSON.stringify(filtered));
};

// Log a medication dose taken
export const logMedicationTaken = (entry) => {
  const logs = getMedicationLogs();

  const newLog = {
    id: crypto.randomUUID(),
    medicationId: entry.medicationId,
    medicationName: entry.medicationName,
    dosage: entry.dosage,
    timestamp: new Date().toISOString(),
    takenFor: entry.takenFor || '', // symptom it was taken for
    symptomLogId: entry.symptomLogId || null, // link to symptom entry
    effectiveness: entry.effectiveness || null, // 1-5 rating after the fact
    sideEffects: entry.sideEffects || '',
    notes: entry.notes || '',
  };

  logs.push(newLog);
  localStorage.setItem(MEDICATION_LOGS_KEY, JSON.stringify(logs));
  return { success: true, log: newLog };
};

// Get all medication logs
export const getMedicationLogs = () => {
  const logs = localStorage.getItem(MEDICATION_LOGS_KEY);
  return logs ? JSON.parse(logs) : [];
};

// Get medication logs linked to a symptom log
export const getMedicationLogsForSymptom = (symptomLogId) => {
  const logs = getMedicationLogs();
  return logs.filter(log => log.symptomLogId === symptomLogId);
};

// Get medication logs for a date range
export const getMedicationLogsByDateRange = (startDate, endDate) => {
  const logs = getMedicationLogs();
  return logs.filter(log => {
    const logDate = new Date(log.timestamp);
    return logDate >= startDate && logDate <= endDate;
  });
};

// Delete a medication log
export const deleteMedicationLog = (id) => {
  const logs = getMedicationLogs();
  const filtered = logs.filter(log => log.id !== id);
  localStorage.setItem(MEDICATION_LOGS_KEY, JSON.stringify(filtered));
};

// Get today's medication logs
export const getTodaysMedicationLogs = () => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);
  return getMedicationLogsByDateRange(today, tomorrow);
};