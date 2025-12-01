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