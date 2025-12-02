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

// Clear all data (use with caution)
export const clearAllData = () => {
    localStorage.removeItem(STORAGE_KEYS.SYMPTOM_LOGS);
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

export const exportAllData = () => {
    const data = {
        version: '1.3', // Updated version for chronic terminology
        exportedAt: new Date().toISOString(),
        symptomLogs: getSymptomLogs(),
        customSymptoms: getCustomSymptoms(),
        chronicSymptoms: getChronicSymptoms(),
        medications: getMedications(),
        medicationLogs: getMedicationLogs(),
        appointments: getAppointments(),
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

export const importAllData = (jsonData, options = { merge: false }) => {
    try {
        const data = typeof jsonData === 'string' ? JSON.parse(jsonData) : jsonData;

        const validation = validateBackupData(data);
        if (!validation.valid) {
            return { success: false, message: validation.message };
        }

        // Handle both old 'favorites' and new 'chronicSymptoms' keys
        const importedChronicSymptoms = data.chronicSymptoms || data.favorites || [];

        if (options.merge) {
            // Merge with existing data
            const existingLogs = getSymptomLogs();
            const existingCustomSymptoms = getCustomSymptoms();
            const existingChronicSymptoms = getChronicSymptoms();
            const existingMedications = getMedications();
            const existingMedicationLogs = getMedicationLogs();
            const existingAppointments = getAppointments();

            // Merge logs
            const existingLogIds = new Set(existingLogs.map(log => log.id));
            const newLogs = data.symptomLogs.filter(log => !existingLogIds.has(log.id));
            const mergedLogs = [...existingLogs, ...newLogs];
            localStorage.setItem('symptomTracker_logs', JSON.stringify(mergedLogs));

            // Merge custom symptoms
            const existingSymptomIds = new Set(existingCustomSymptoms.map(s => s.id));
            const newSymptoms = (data.customSymptoms || []).filter(s => !existingSymptomIds.has(s.id));
            const mergedSymptoms = [...existingCustomSymptoms, ...newSymptoms];
            localStorage.setItem('symptomTracker_customSymptoms', JSON.stringify(mergedSymptoms));

            // Merge chronic symptoms
            const existingChronicIds = new Set(existingChronicSymptoms.map(c => c.symptomId));
            const newChronic = importedChronicSymptoms.filter(c => !existingChronicIds.has(c.symptomId));
            const mergedChronic = [...existingChronicSymptoms, ...newChronic];
            localStorage.setItem(CHRONIC_SYMPTOMS_KEY, JSON.stringify(mergedChronic));

            // Merge medications
            const existingMedIds = new Set(existingMedications.map(m => m.id));
            const newMeds = (data.medications || []).filter(m => !existingMedIds.has(m.id));
            const mergedMeds = [...existingMedications, ...newMeds];
            localStorage.setItem(MEDICATIONS_KEY, JSON.stringify(mergedMeds));

            // Merge medication logs
            const existingMedLogIds = new Set(existingMedicationLogs.map(l => l.id));
            const newMedLogs = (data.medicationLogs || []).filter(l => !existingMedLogIds.has(l.id));
            const mergedMedLogs = [...existingMedicationLogs, ...newMedLogs];
            localStorage.setItem(MEDICATION_LOGS_KEY, JSON.stringify(mergedMedLogs));

            // Merge appointments
            const existingAptIds = new Set(existingAppointments.map(a => a.id));
            const newApts = (data.appointments || []).filter(a => !existingAptIds.has(a.id));
            const mergedApts = [...existingAppointments, ...newApts];
            localStorage.setItem(APPOINTMENTS_KEY, JSON.stringify(mergedApts));

            return {
                success: true,
                message: `Merged ${newLogs.length} new log entries`,
                stats: {
                    logsAdded: newLogs.length,
                    symptomsAdded: newSymptoms.length,
                    chronicAdded: newChronic.length,
                    medicationsAdded: newMeds.length,
                    appointmentsAdded: newApts.length,
                },
            };
        } else {
            // Replace all data
            localStorage.setItem('symptomTracker_logs', JSON.stringify(data.symptomLogs));

            if (data.customSymptoms) {
                localStorage.setItem('symptomTracker_customSymptoms', JSON.stringify(data.customSymptoms));
            }

            // Store chronic symptoms (handle both old and new format)
            localStorage.setItem(CHRONIC_SYMPTOMS_KEY, JSON.stringify(importedChronicSymptoms));
            // Clean up legacy key if it exists
            localStorage.removeItem(LEGACY_FAVORITES_KEY);

            if (data.reminderSettings) {
                localStorage.setItem('symptomTracker_reminderSettings', JSON.stringify(data.reminderSettings));
            }

            if (data.medications) {
                localStorage.setItem(MEDICATIONS_KEY, JSON.stringify(data.medications));
            }

            if (data.medicationLogs) {
                localStorage.setItem(MEDICATION_LOGS_KEY, JSON.stringify(data.medicationLogs));
            }

            if (data.appointments) {
                localStorage.setItem(APPOINTMENTS_KEY, JSON.stringify(data.appointments));
            }

            return {
                success: true,
                message: `Restored ${data.symptomLogs.length} log entries`,
                stats: {
                    logsRestored: data.symptomLogs.length,
                    symptomsRestored: (data.customSymptoms || []).length,
                    chronicRestored: importedChronicSymptoms.length,
                    medicationsRestored: (data.medications || []).length,
                    appointmentsRestored: (data.appointments || []).length,
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
        chronicSymptoms: getChronicSymptoms().length,
        medications: getMedications().length,
        medicationLogs: getMedicationLogs().length,
        appointments: getAppointments().length,
    };
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