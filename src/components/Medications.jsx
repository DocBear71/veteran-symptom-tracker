import { useState, useEffect } from 'react';
import {
  getMedications,
  addMedication,
  updateMedication,
  deleteMedication,
  logMedicationTaken,
  getMedicationLogs,
  deleteMedicationLog,
  updateMedicationLog,
  isBackDated,
  getMedicationHistory,
  saveMedicationHistory,
  updateMedicationHistory,
  deleteMedicationHistory,
} from '../utils/storage';
import {
  formatDosage,
  formatDosageWithTotal,
  getDosageForLog,
  UNIT_TYPE_OPTIONS,
  EFFECTIVENESS_LEVELS,
  EFFECTIVENESS_LABELS,
  COMMON_SIDE_EFFECTS
} from '../utils/medicationUtils';
import { getActiveProfileId } from '../utils/profiles';
import OccurrenceTimePicker from './OccurrenceTimePicker';
import MedicationDocumentationGuide from './MedicationDocumentationGuide';

// ─── Medication Groups: localStorage helpers ────────────────────────────
// Uses same profile-namespacing pattern as storage.js for data isolation.
const getGroupsKey = () => {
  const profileId = getActiveProfileId();
  const base = 'symptomTracker_medicationGroups';
  return profileId ? `${base}_${profileId}` : base;
};

const getMedicationGroups = () => {
  try { return JSON.parse(localStorage.getItem(getGroupsKey())) || []; }
  catch { return []; }
};

const saveMedicationGroups = (groups) => {
  localStorage.setItem(getGroupsKey(), JSON.stringify(groups));
};

// ─── Reusable Dosage Form Fields ─────────────────────────────────
// MUST be defined outside the main component to prevent re-mounting on each render
const DosageFields = ({ data, onChange }) => (
    <>
        <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Strength per unit <span className="text-red-500">*</span>
            </label>
            <input type="text" value={data.strength}
                   onChange={(e) => onChange(prev => ({ ...prev, strength: e.target.value }))}
                   placeholder="e.g., 20mg, 500mg, 10mg/5ml"
                   className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500" />
        </div>
        <div className="grid grid-cols-2 gap-3">
            <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Qty per dose</label>
                <input type="number" min="1" max="20"
                       value={data.quantity === '' ? '' : data.quantity}
                       onChange={(e) => {
                           const val = e.target.value;
                           // Allow empty string while typing, store as empty so user can clear & retype
                           onChange(prev => ({ ...prev, quantity: val === '' ? '' : parseInt(val) || '' }));
                       }}
                       onBlur={(e) => {
                           // On blur, default empty/invalid back to 1
                           if (!e.target.value || parseInt(e.target.value) < 1) {
                               onChange(prev => ({ ...prev, quantity: 1 }));
                           }
                       }}
                       className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500" />
            </div>
            <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Form</label>
                <select value={data.unitType}
                        onChange={(e) => onChange(prev => ({ ...prev, unitType: e.target.value }))}
                        className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500">
                    {UNIT_TYPE_OPTIONS.map(opt => (<option key={opt.value} value={opt.value}>{opt.label}</option>))}
                </select>
            </div>
        </div>
        {data.strength && (
            <div className="text-xs text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-gray-700/50 p-2 rounded">
                Displays as: <span className="font-medium text-gray-700 dark:text-gray-300">
                    {formatDosageWithTotal({ strength: data.strength, quantity: parseInt(data.quantity) || 1, unitType: data.unitType })}
                </span>
            </div>
        )}
    </>
);

// ─── Reusable Effectiveness + Side Effects fields ────────────────
// MUST be outside the main component to prevent input focus loss on re-render.
// Constants (EFFECTIVENESS_LEVELS, EFFECTIVENESS_LABELS, COMMON_SIDE_EFFECTS) imported from medicationUtils.

const EffectivenessSideEffectsFields = ({ data, onChange }) => (
    <>
      {/* Effectiveness */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          How effective? <span className="text-xs text-gray-400 font-normal">(optional)</span>
        </label>
        <div className="flex flex-wrap gap-1.5">
          {EFFECTIVENESS_LEVELS.map((level) => (
              <button key={level.value} type="button"
                      onClick={() => onChange(prev => ({ ...prev, effectiveness: prev.effectiveness === level.value ? '' : level.value }))}
                      className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-all ${
                          data.effectiveness === level.value
                              ? level.color + ' ring-2 ring-offset-1 ring-blue-500 dark:ring-offset-gray-800'
                              : 'bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400 border-gray-200 dark:border-gray-600 hover:bg-gray-200 dark:hover:bg-gray-600'
                      }`}>
                {level.label}
              </button>
          ))}
        </div>
      </div>

      {/* Side Effects */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Side effects? <span className="text-xs text-gray-400 font-normal">(optional)</span>
        </label>
        <div className="flex flex-wrap gap-1.5 mb-2">
          {COMMON_SIDE_EFFECTS.map((effect) => {
            const isSelected = data.sideEffects.includes(effect);
            return (
                <button key={effect} type="button"
                        onClick={() => onChange(prev => ({
                          ...prev,
                          sideEffects: prev.sideEffects.includes(effect)
                              ? prev.sideEffects.filter(e => e !== effect)
                              : [...prev.sideEffects, effect],
                        }))}
                        className={`px-2.5 py-1 rounded-full text-xs font-medium border transition-all ${
                            isSelected
                                ? 'bg-amber-100 dark:bg-amber-900 text-amber-800 dark:text-amber-200 border-amber-400 dark:border-amber-600 ring-1 ring-amber-400'
                                : 'bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400 border-gray-200 dark:border-gray-600 hover:bg-gray-200 dark:hover:bg-gray-600'
                        }`}>
                  {isSelected ? '✓ ' : ''}{effect}
                </button>
            );
          })}
        </div>
        <input type="text" value={data.sideEffectsOther}
               onChange={(e) => onChange(prev => ({ ...prev, sideEffectsOther: e.target.value }))}
               placeholder="Other side effects..."
               className="w-full p-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500" />
      </div>
    </>
);

// ─── Dosing Timer Component ──────────────────────────────────────────
// Shows time since last dose and countdown to next safe dose.
// Only renders for medications with dosingIntervalHours set.
// Uses a 1-minute interval to keep the display live.
const DosingTimer = ({ med, logs }) => {
  const [now, setNow] = useState(() => Date.now());

  // Tick every minute to keep elapsed/remaining time current
  useEffect(() => {
    const interval = setInterval(() => setNow(Date.now()), 60_000);
    return () => clearInterval(interval);
  }, []);

  // Find the most recent log entry for this specific medication
  const lastLog = logs
  .filter(l => l.medicationId === med.id)
  .sort((a, b) => new Date(b.occurredAt || b.timestamp) - new Date(a.occurredAt || a.timestamp))[0];

  if (!lastLog) {
    return (
        <div className="mt-2 px-2 py-1.5 bg-gray-50 dark:bg-gray-700/50 rounded-lg flex items-center gap-2">
          <span className="text-sm">⏱</span>
          <span className="text-xs text-gray-500 dark:text-gray-400">
          No doses logged yet — timer starts after first log
        </span>
        </div>
    );
  }

  const intervalMs = med.dosingIntervalHours * 60 * 60 * 1000;
  const lastTakenMs = new Date(lastLog.occurredAt || lastLog.timestamp).getTime();
  const nextSafeMs = lastTakenMs + intervalMs;
  const elapsedMs = now - lastTakenMs;
  const remainingMs = nextSafeMs - now;
  const isSafe = remainingMs <= 0;

  // Format a millisecond duration as "Xh Ym" or "Ym"
  const formatDuration = (ms) => {
    const totalMin = Math.max(0, Math.floor(Math.abs(ms) / 60_000));
    const hrs = Math.floor(totalMin / 60);
    const mins = totalMin % 60;
    if (hrs > 0) return `${hrs}h ${mins}m`;
    return `${mins}m`;
  };

  const elapsedLabel = formatDuration(elapsedMs);
  const remainingLabel = formatDuration(remainingMs);

  return (
      <div className={`mt-2 rounded-lg border p-2.5 ${
          isSafe
              ? 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800'
              : 'bg-amber-50 dark:bg-amber-900/20 border-amber-200 dark:border-amber-800'
      }`}>
        <div className="flex items-center justify-between gap-3">
          {/* Status badge */}
          <div className="flex items-center gap-1.5 flex-shrink-0">
            <span className={`w-2 h-2 rounded-full flex-shrink-0 ${isSafe ? 'bg-green-500' : 'bg-amber-500'}`} />
            <span className={`text-xs font-semibold ${isSafe ? 'text-green-700 dark:text-green-400' : 'text-amber-700 dark:text-amber-400'}`}>
            {isSafe ? '✓ Safe to take' : '⏳ Wait'}
          </span>
          </div>

          {/* Time info */}
          <div className="flex items-center gap-3 text-xs text-right">
            <div>
              <span className="text-gray-500 dark:text-gray-400">Since last dose: </span>
              <span className="font-medium text-gray-700 dark:text-gray-300">{elapsedLabel} ago</span>
            </div>
            {!isSafe && (
                <div>
                  <span className="text-amber-600 dark:text-amber-400 font-medium">{remainingLabel} left</span>
                </div>
            )}
          </div>
        </div>

        {/* Warning banner when too soon */}
        {!isSafe && (
            <div className="mt-1.5 text-xs text-amber-700 dark:text-amber-300">
              Next safe dose: {new Date(nextSafeMs).toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })}
            </div>
        )}
      </div>
  );
};

const Medications = () => {
  const [medications, setMedications] = useState([]);
  const [medHistory, setMedHistory] = useState([]);
  const [logs, setLogs] = useState([]);
  const [groups, setGroups] = useState([]);
  const [expandedHistoryId, setExpandedHistoryId] = useState(null);
  const [editingHistoryEntry, setEditingHistoryEntry] = useState(null);
  const [historyNotesDraft, setHistoryNotesDraft] = useState('');
  const [activeTab, setActiveTab] = useState('log');
  const [showAddForm, setShowAddForm] = useState(false);
  const [showGroupForm, setShowGroupForm] = useState(false);
  const [editingGroup, setEditingGroup] = useState(null);
  const [showEditMedForm, setShowEditMedForm] = useState(false);
  const [editingMed, setEditingMed] = useState(null);
  const [editMedData, setEditMedData] = useState({
    name: '', strength: '', quantity: 1, unitType: 'tablet',
    frequency: 'as-needed', forConditions: '', notes: '', isActive: true,
    dosingIntervalHours: '',
  });
  const [message, setMessage] = useState('');

  // Multi-select state for Quick Log
  const [selectedMedIds, setSelectedMedIds] = useState(new Set());
  const [showBatchLogForm, setShowBatchLogForm] = useState(false);

  // Add medication form state — structured dosage
  const [newMed, setNewMed] = useState({
    name: '', strength: '', quantity: 1, unitType: 'tablet',
    frequency: 'as-needed', forConditions: '', notes: '',
    dosingIntervalHours: '',
  });

  // Batch log & group form state
  const [batchLogData, setBatchLogData] = useState({ takenFor: '', effectiveness: '', sideEffects: [], sideEffectsOther: '', notes: '' });
  const [batchOccurredAt, setBatchOccurredAt] = useState(new Date().toISOString());
  const [groupForm, setGroupForm] = useState({ name: '', icon: '🌅', medicationIds: [] });

  // Group quick-log confirmation modal
  const [showGroupLogConfirm, setShowGroupLogConfirm] = useState(false);
  const [pendingGroup, setPendingGroup] = useState(null);
  const [groupLogData, setGroupLogData] = useState({ effectiveness: '', sideEffects: [], sideEffectsOther: '', notes: '', occurredAt: new Date().toISOString() });

  // Edit medication log modal
  const [showEditLogForm, setShowEditLogForm] = useState(false);
  const [editingLog, setEditingLog] = useState(null);
  const [editLogData, setEditLogData] = useState({ takenFor: '', effectiveness: '', sideEffects: [], sideEffectsOther: '', notes: '', occurredAt: '' });

  useEffect(() => { loadData(); }, []);

  const loadData = () => {
    setMedications(getMedications());
    // Sort history by lastFilledStr descending (most recent first)
    const history = getMedicationHistory();
    history.sort((a, b) => {
      const dateA = new Date(a.lastFilledStr || a.archivedAt || 0);
      const dateB = new Date(b.lastFilledStr || b.archivedAt || 0);
      return dateB - dateA;
    });
    setMedHistory(history);
    const allLogs = getMedicationLogs();
    // Sort by when medication was actually taken (occurredAt), fall back to
    // entry timestamp for legacy logs that predate the occurredAt field.
    allLogs.sort((a, b) => {
      const timeA = new Date(a.occurredAt || a.timestamp);
      const timeB = new Date(b.occurredAt || b.timestamp);
      return timeB - timeA;
    });
    setLogs(allLogs);
    setGroups(getMedicationGroups());
  };

  const showMessage = (text) => {
    setMessage(text);
    setTimeout(() => setMessage(''), 3000);
  };

  // ─── Add Medication ──────────────────────────────────────────────
  const handleAddMedication = (e) => {
    e.preventDefault();
    if (!newMed.name.trim() || !newMed.strength.trim()) {
      showMessage('Please enter medication name and strength'); return;
    }
    const result = addMedication({
      name: newMed.name,
      strength: newMed.strength.trim(),
      quantity: parseInt(newMed.quantity) || 1,
      unitType: newMed.unitType,
      dosage: formatDosage({ strength: newMed.strength.trim(), quantity: parseInt(newMed.quantity) || 1, unitType: newMed.unitType }),
      frequency: newMed.frequency,
      forConditions: newMed.forConditions.split(',').map(c => c.trim()).filter(c => c),
      notes: newMed.notes,
      // Dosing interval — null if not set, stored in hours (e.g. 4, 6, 8, 12)
      dosingIntervalHours: newMed.dosingIntervalHours ? parseFloat(newMed.dosingIntervalHours) : null,
    });
    if (result.success) {
      showMessage('Medication added!');
      setNewMed({ name: '', strength: '', quantity: 1, unitType: 'tablet', frequency: 'as-needed', forConditions: '', notes: '' });
      setShowAddForm(false);
      loadData();
    } else { showMessage(result.message); }
  };

  // ─── Multi-Select Toggle ─────────────────────────────────────────
  const toggleMedSelection = (medId) => {
    setSelectedMedIds(prev => {
      const next = new Set(prev);
      next.has(medId) ? next.delete(medId) : next.add(medId);
      return next;
    });
  };

    // ─── Batch Log ───────────────────────────────────────────────────
  const handleBatchLog = (e) => {
    e.preventDefault();
    const medsToLog = medications.filter(m => selectedMedIds.has(m.id));

    // Check dosing intervals — warn for any med logged too soon
    const tooSoon = medsToLog.filter(med => {
      if (!med.dosingIntervalHours) return false;
      const lastLog = logs
      .filter(l => l.medicationId === med.id)
      .sort((a, b) => new Date(b.occurredAt || b.timestamp) - new Date(a.occurredAt || a.timestamp))[0];
      if (!lastLog) return false;
      const remainingMs = (new Date(lastLog.occurredAt || lastLog.timestamp).getTime() + med.dosingIntervalHours * 3600000) - Date.now();
      return remainingMs > 0;
    });

    if (tooSoon.length > 0) {
      const names = tooSoon.map(m => m.name).join(', ');
      const confirmed = window.confirm(`⚠️ Too soon for: ${names}\n\nMinimum dosing interval not met. Log anyway?`);
      if (!confirmed) return;
    }

    let count = 0;
        // Combine selected side effects with any custom entry
        const batchAllSideEffects = [
            ...batchLogData.sideEffects,
            ...(batchLogData.sideEffectsOther.trim() ? [batchLogData.sideEffectsOther.trim()] : []),
        ].join(', ');

        // Generate one batchId shared by all meds in this submission
        const batchId = `batch_${Date.now()}`;

        medsToLog.forEach(med => {
            const r = logMedicationTaken({
                medicationId: med.id, medicationName: med.name, dosage: getDosageForLog(med),
                takenFor: batchLogData.takenFor, notes: batchLogData.notes, occurredAt: batchOccurredAt,
                effectiveness: batchLogData.effectiveness || null,
                sideEffects: batchAllSideEffects,
                batchId,
            });
            if (r.success) count++;
        });
        showMessage(`Logged ${count} medication${count !== 1 ? 's' : ''}`);
        setSelectedMedIds(new Set()); setShowBatchLogForm(false);
        setBatchLogData({ takenFor: '', effectiveness: '', sideEffects: [], sideEffectsOther: '', notes: '' }); setBatchOccurredAt(new Date().toISOString()); loadData();
    };

  // ─── Group Quick Log ─────────────────────────────────────────────
  // Opens a confirmation modal so user can set time and optional notes
  const handleGroupQuickLog = (group) => {
    const meds = medications.filter(m => m.isActive && group.medicationIds.includes(m.id));
    if (meds.length === 0) { showMessage('No active medications in this group'); return; }
    setPendingGroup(group);
    setGroupLogData({ effectiveness: '', sideEffects: [], sideEffectsOther: '', notes: '', occurredAt: new Date().toISOString() });
    setShowGroupLogConfirm(true);
  };

    const handleConfirmGroupLog = (e) => {
        e.preventDefault();
        if (!pendingGroup) return;
        const meds = medications.filter(m => m.isActive && pendingGroup.medicationIds.includes(m.id));
        let count = 0;
        const groupAllSideEffects = [
            ...groupLogData.sideEffects,
            ...(groupLogData.sideEffectsOther.trim() ? [groupLogData.sideEffectsOther.trim()] : []),
        ].join(', ');

        // Generate one batchId shared by all meds in this submission
        const batchId = `batch_${Date.now()}`;

        meds.forEach(med => {
            const r = logMedicationTaken({
                medicationId: med.id, medicationName: med.name, dosage: getDosageForLog(med),
                takenFor: pendingGroup.name,
                notes: groupLogData.notes || `Logged via "${pendingGroup.name}" group`,
                occurredAt: groupLogData.occurredAt,
                effectiveness: groupLogData.effectiveness || null,
                sideEffects: groupAllSideEffects,
                batchId,
            });
      if (r.success) count++;
    });
    showMessage(`${pendingGroup.icon} Logged ${count} med${count !== 1 ? 's' : ''} from "${pendingGroup.name}"`);
    setShowGroupLogConfirm(false); setPendingGroup(null); loadData();
  };

  // ─── Group CRUD ──────────────────────────────────────────────────
  const handleSaveGroup = (e) => {
    e.preventDefault();
    if (!groupForm.name.trim()) { showMessage('Please enter a group name'); return; }
    if (groupForm.medicationIds.length === 0) { showMessage('Please select at least one medication'); return; }
    const allGroups = getMedicationGroups();
    if (editingGroup) {
      const idx = allGroups.findIndex(g => g.id === editingGroup.id);
      if (idx !== -1) allGroups[idx] = { ...allGroups[idx], ...groupForm };
    } else {
      allGroups.push({ id: `grp_${Date.now()}`, ...groupForm, createdAt: new Date().toISOString() });
    }
    saveMedicationGroups(allGroups);
    showMessage(editingGroup ? 'Group updated!' : 'Group created!');
    setShowGroupForm(false); setEditingGroup(null);
    setGroupForm({ name: '', icon: '🌅', medicationIds: [] }); loadData();
  };
  const handleEditGroup = (group) => {
    setEditingGroup(group);
    setGroupForm({ name: group.name, icon: group.icon, medicationIds: [...group.medicationIds] });
    setShowGroupForm(true);
  };
  const handleDeleteGroup = (groupId) => {
    if (window.confirm('Delete this medication group?')) {
      saveMedicationGroups(getMedicationGroups().filter(g => g.id !== groupId)); loadData();
    }
  };
  const toggleGroupMed = (medId) => {
    setGroupForm(prev => ({ ...prev, medicationIds: prev.medicationIds.includes(medId) ? prev.medicationIds.filter(id => id !== medId) : [...prev.medicationIds, medId] }));
  };

  // ─── Edit Medication ─────────────────────────────────────────────
  const handleEditMedication = (med) => {
    setEditingMed(med);
    setEditMedData({
      name: med.name,
      strength: med.strength || med.dosage || '',
      quantity: med.quantity || 1,
      unitType: med.unitType || 'tablet',
      frequency: med.frequency || 'as-needed',
      forConditions: Array.isArray(med.forConditions) ? med.forConditions.join(', ') : '',
      notes: med.notes || '',
      isActive: med.isActive !== false,
      dosingIntervalHours: med.dosingIntervalHours != null ? String(med.dosingIntervalHours) : '',
    });
    setShowEditMedForm(true);
  };

  const handleSaveEditMedication = (e) => {
    e.preventDefault();
    if (!editMedData.name.trim() || !editMedData.strength.trim()) {
      showMessage('Please enter medication name and strength'); return;
    }
    const result = updateMedication(editingMed.id, {
      name: editMedData.name.trim(),
      strength: editMedData.strength.trim(),
      quantity: parseInt(editMedData.quantity) || 1,
      unitType: editMedData.unitType,
      dosage: formatDosage({ strength: editMedData.strength.trim(), quantity: parseInt(editMedData.quantity) || 1, unitType: editMedData.unitType }),
      frequency: editMedData.frequency,
      forConditions: editMedData.forConditions.split(',').map(c => c.trim()).filter(c => c),
      notes: editMedData.notes,
      isActive: editMedData.isActive,
      dosingIntervalHours: editMedData.dosingIntervalHours ? parseFloat(editMedData.dosingIntervalHours) : null,
    });
    if (result.success) {
      showMessage('Medication updated!'); setShowEditMedForm(false); setEditingMed(null); loadData();
    } else { showMessage(result.message || 'Failed to update'); }
  };

  // ─── Edit Medication Log ─────────────────────────────────────────
  const handleEditLog = (log) => {
    setEditingLog(log);
    // Parse sideEffects string back into array for chip selection
    const existingSideEffects = log.sideEffects
        ? log.sideEffects.split(',').map(s => s.trim()).filter(Boolean)
        : [];
    const knownEffects = existingSideEffects.filter(e => COMMON_SIDE_EFFECTS.includes(e));
    const otherEffects = existingSideEffects.filter(e => !COMMON_SIDE_EFFECTS.includes(e));

    setEditLogData({
      takenFor: log.takenFor || '',
      effectiveness: log.effectiveness || '',
      sideEffects: knownEffects,
      sideEffectsOther: otherEffects.join(', '),
      notes: log.notes || '',
      occurredAt: log.occurredAt || log.timestamp,
    });
    setShowEditLogForm(true);
  };

  const handleSaveEditLog = (e) => {
    e.preventDefault();
    const editAllSideEffects = [
      ...editLogData.sideEffects,
      ...(editLogData.sideEffectsOther.trim() ? [editLogData.sideEffectsOther.trim()] : []),
    ].join(', ');

    const result = updateMedicationLog(editingLog.id, {
      takenFor: editLogData.takenFor,
      effectiveness: editLogData.effectiveness || null,
      sideEffects: editAllSideEffects,
      notes: editLogData.notes,
      occurredAt: editLogData.occurredAt,
    });
    if (result.success) {
      showMessage('Log updated!'); setShowEditLogForm(false); setEditingLog(null); loadData();
    } else { showMessage(result.message || 'Failed to update'); }
  };

  // ─── Delete handlers ─────────────────────────────────────────────
  const handleDeleteMedication = (id) => { if (window.confirm('Remove this medication from your list?')) { deleteMedication(id); loadData(); } };

  // ─── Discontinue: moves active med to Medication History ────────
  const handleDiscontinueMedication = (med) => {
    if (!window.confirm(`Move "${med.name}" to Medication History? You can restore it later.`)) return;
    saveMedicationHistory({
      name: med.name,
      dosage: med.dosage,
      strength: med.strength,
      quantity: med.quantity,
      unitType: med.unitType,
      frequency: med.frequency,
      forConditions: med.forConditions,
      notes: med.notes,
      isActive: false,
      source: med.source || 'manual',
      discontinuedAt: new Date().toISOString(),
      archivedAt: new Date().toISOString(),
    });
    deleteMedication(med.id);
    showMessage(`${med.name} moved to Medication History`);
    loadData();
  };

  // ─── Restore: moves history entry back to active meds ───────────
  const handleRestoreFromHistory = (entry) => {
    if (!window.confirm(`Restore "${entry.name}" to your active medications?`)) return;
    addMedication({
      name: entry.name,
      dosage: entry.dosage || 'See instructions',
      strength: entry.strength || '',
      quantity: entry.quantity || 1,
      unitType: entry.unitType || 'tablet',
      frequency: entry.frequency || 'as-needed',
      forConditions: entry.forConditions || [],
      notes: entry.notes || '',
      isActive: true,
      source: entry.source || 'manual',
    });
    deleteMedicationHistory(entry.id);
    showMessage(`${entry.name} restored to active medications`);
    loadData();
  };

  // ─── Save history entry notes edit ──────────────────────────────
  const handleSaveHistoryNotes = (entry) => {
    updateMedicationHistory(entry.id, { notes: historyNotesDraft });
    setEditingHistoryEntry(null);
    setHistoryNotesDraft('');
    showMessage('Notes saved');
    loadData();
  };

  const handleDeleteLog = (id) => { if (window.confirm('Delete this log entry?')) { deleteMedicationLog(id); loadData(); } };

  // ─── Helpers ─────────────────────────────────────────────────────
  const formatDate = (timestamp) => new Date(timestamp).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' });

  const frequencyLabels = {
    'as-needed': 'As Needed (PRN)', 'daily': 'Once Daily', 'twice-daily': 'Twice Daily',
    'three-times': 'Three Times Daily', 'four-times': 'Four Times Daily', 'weekly': 'Weekly', 'other': 'Other',
  };
  const groupIcons = ['🌅', '🌙', '☀️', '🕐', '💊', '🏥', '⚡', '🎯'];

  // ─── Effectiveness & Side Effects (§4.10 compliance) ─────────────
  // Constants defined outside component (EFFECTIVENESS_LEVELS, COMMON_SIDE_EFFECTS, etc.)
  // to prevent re-mount focus loss. Internal aliases for convenience:
  const getEffectivenessColor = (val) => {
    const level = EFFECTIVENESS_LEVELS.find(l => l.value === val);
    return level ? level.color : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 border-gray-300 dark:border-gray-600';
  };

  const activeMeds = medications.filter(m => m.isActive);



  // ─── Reusable Checkbox Icon ──────────────────────────────────────
  const CheckIcon = ({ checked, size = 6 }) => (
      <div className={`w-${size} h-${size} rounded-md border-2 flex items-center justify-center transition-colors ${
          checked ? 'bg-blue-600 dark:bg-blue-500 border-blue-600 dark:border-blue-500' : 'border-gray-300 dark:border-gray-600'
      }`}>
        {checked && (
            <svg className={`w-${size - 2} h-${size - 2} text-white`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
        )}
      </div>
  );

    // ─── Group logs by batchId (exact) or occurredAt (legacy fallback) ────
    // New logs use batchId for precise grouping. Old logs fall back to
    // a 2-minute time window on occurredAt.
    const groupedLogs = (() => {
        if (logs.length === 0) return [];

        const groups = [];
        // Map of batchId -> group for O(1) lookup
        const batchMap = {};

        logs.forEach(log => {
            // ── Strategy 1: exact batchId match (new logs) ──
            if (log.batchId) {
                if (batchMap[log.batchId]) {
                    batchMap[log.batchId].items.push(log);
                    return;
                }
                const newGroup = {
                    time: new Date(log.occurredAt || log.timestamp).getTime(),
                    batchId: log.batchId,
                    label: log.takenFor || null,
                    items: [log],
                };
                batchMap[log.batchId] = newGroup;
                groups.push(newGroup);
                return;
            }

            // ── Strategy 2: time proximity fallback (legacy logs without batchId) ──
            // Uses a tighter 2-minute window and requires same takenFor label to group.
            const logTime = new Date(log.occurredAt || log.timestamp).getTime();
            const lastGroup = groups[groups.length - 1];

            if (
                lastGroup &&
                !lastGroup.batchId && // don't merge into a batchId group
                Math.abs(logTime - lastGroup.time) < 120000 &&
                lastGroup.label === (log.takenFor || null)
            ) {
                lastGroup.items.push(log);
            } else {
                groups.push({
                    time: logTime,
                    batchId: null,
                    label: log.takenFor || null,
                    items: [log],
                });
            }
        });

        return groups;
    })();

  return (
      <div className="pb-20">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Medications</h2>

        {/* §4.10 Educational Guide - Veteran profiles only */}
        <div className="mt-4">
          <MedicationDocumentationGuide />
        </div>
        <br/>


        {message && (
            <div className="mb-4 p-3 bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 rounded-lg text-center">
              {message}
            </div>
        )}

        {/* Tabs — 2×2 grid on small screens, single row on wider screens */}
        <div className="grid grid-cols-4 gap-1.5 mb-4">
          {[{ id: 'log', label: 'Quick Log' }, { id: 'groups', label: 'Groups' }, { id: 'list', label: 'My Meds' }, { id: 'history', label: 'History' }].map((tab) => (
              <button key={tab.id} onClick={() => setActiveTab(tab.id)}
                      className={`py-2 px-1 rounded-lg text-xs font-medium transition-colors text-center ${
                          activeTab === tab.id ? 'bg-blue-900 dark:bg-blue-600 text-white' : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
                      }`}>{tab.label}</button>
          ))}
        </div>

        {/* ═══════════ QUICK LOG TAB ═══════════ */}
        {activeTab === 'log' && (
            <div>
              {groups.length > 0 && (
                  <div className="mb-4">
                    <p className="text-xs text-gray-500 dark:text-gray-400 mb-2 uppercase tracking-wide font-medium">Quick Log a Group</p>
                    <div className="flex flex-wrap gap-2">
                      {groups.map(group => {
                        const activeCount = activeMeds.filter(m => group.medicationIds.includes(m.id)).length;
                        return (
                            <button key={group.id} onClick={() => handleGroupQuickLog(group)}
                                    className="flex items-center gap-2 px-4 py-3 bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-900/30 dark:to-blue-800/30 border border-blue-200 dark:border-blue-700 rounded-lg hover:shadow-md transition-all active:scale-95">
                              <span className="text-xl">{group.icon}</span>
                              <div className="text-left">
                                <p className="font-medium text-blue-900 dark:text-blue-200 text-sm">{group.name}</p>
                                <p className="text-xs text-blue-600 dark:text-blue-400">{activeCount} med{activeCount !== 1 ? 's' : ''}</p>
                              </div>
                            </button>
                        );
                      })}
                    </div>
                  </div>
              )}

              {activeMeds.length === 0 ? (
                  <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                    <p className="text-4xl mb-2">💊</p>
                    <p>No medications added yet</p>
                    <button onClick={() => { setActiveTab('list'); setShowAddForm(true); }}
                            className="mt-3 text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 font-medium">+ Add your first medication</button>
                  </div>
              ) : (

                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">Tap to select, then log all at once:</p>
                    <div className="space-y-2">
                      {activeMeds.map((med) => {
                        const isSelected = selectedMedIds.has(med.id);
                        return (
                            <button key={med.id} onClick={() => toggleMedSelection(med.id)}
                                    className={`w-full rounded-lg border p-4 text-left transition-all ${isSelected
                                        ? 'bg-blue-50 dark:bg-blue-900/30 border-blue-400 dark:border-blue-500 ring-1 ring-blue-400 dark:ring-blue-500'
                                        : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-600'}`}>
                              <div className="flex justify-between items-center">
                                <div className="flex items-center gap-3">
                                  <CheckIcon checked={isSelected} />
                                  <div>
                                    <p className="font-semibold text-gray-900 dark:text-white">{med.name}</p>
                                    <p className="text-sm text-gray-600 dark:text-gray-400">{formatDosage(med)}</p>
                                    <p className="text-xs text-gray-400 dark:text-gray-500">{frequencyLabels[med.frequency]}</p>
                                  </div>
                                </div>
                                <span className="text-2xl">💊</span>
                              </div>
                            </button>
                        );
                      })}
                    </div>

                    {selectedMedIds.size > 0 && (
                        <div className="sticky bottom-20 mt-4">
                          <div className="bg-blue-900 dark:bg-blue-700 rounded-xl shadow-lg p-3 flex items-center justify-between">
                            <div className="text-white">
                              <p className="font-semibold text-sm">{selectedMedIds.size} selected</p>
                              <button onClick={() => setSelectedMedIds(new Set())} className="text-blue-200 text-xs hover:text-white">Clear</button>
                            </div>
                            <div className="flex gap-2">
                              {selectedMedIds.size < activeMeds.length && (
                                  <button onClick={() => setSelectedMedIds(new Set(activeMeds.map(m => m.id)))}
                                          className="px-3 py-2 text-sm text-blue-200 hover:text-white border border-blue-400 dark:border-blue-500 rounded-lg">All</button>
                              )}
                              <button onClick={() => { setBatchOccurredAt(new Date().toISOString()); setShowBatchLogForm(true); }}
                                      className="px-5 py-2 bg-white text-blue-900 font-semibold rounded-lg hover:bg-blue-50 transition-colors">Log Selected</button>
                            </div>
                          </div>
                        </div>
                    )}
                  </div>
              )}
            </div>
        )}

        {/* ═══════════ GROUPS TAB ═══════════ */}
        {activeTab === 'groups' && (
            <div>
              <button onClick={() => { setEditingGroup(null); setGroupForm({ name: '', icon: '🌅', medicationIds: [] }); setShowGroupForm(true); }}
                      className="w-full mb-4 py-3 px-4 border-2 border-dashed border-gray-300 dark:border-gray-600 text-gray-600 dark:text-gray-400 rounded-lg hover:border-blue-400 dark:hover:border-blue-500 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                + Create Medication Group
              </button>
              {groups.length === 0 ? (
                  <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                    <p className="text-4xl mb-2">📦</p>
                    <p className="mb-1">No medication groups yet</p>
                    <p className="text-sm">Create groups like "Morning Meds" or "Bedtime Meds" to log multiple medications with one tap.</p>
                  </div>
              ) : (
                  <div className="space-y-3">
                    {groups.map(group => {
                      const groupMeds = medications.filter(m => group.medicationIds.includes(m.id));
                      const activeGroupMeds = groupMeds.filter(m => m.isActive);
                      const inactiveCount = groupMeds.length - activeGroupMeds.length;
                      const deletedCount = group.medicationIds.length - groupMeds.length;
                      return (
                          <div key={group.id} className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4">
                            <div className="flex justify-between items-start mb-3">
                              <div className="flex items-center gap-2">
                                <span className="text-2xl">{group.icon}</span>
                                <div>
                                  <p className="font-semibold text-gray-900 dark:text-white">{group.name}</p>
                                  <p className="text-xs text-gray-500 dark:text-gray-400">
                                    {activeGroupMeds.length} active med{activeGroupMeds.length !== 1 ? 's' : ''}
                                    {inactiveCount > 0 && `, ${inactiveCount} inactive`}
                                    {deletedCount > 0 && <span className="text-amber-500"> · {deletedCount} removed</span>}
                                  </p>
                                </div>
                              </div>
                              <div className="flex items-center gap-1">
                                <button onClick={() => handleEditGroup(group)} className="p-1.5 text-gray-400 dark:text-gray-500 hover:text-blue-500 dark:hover:text-blue-400" title="Edit group">✏️</button>
                                <button onClick={() => handleDeleteGroup(group.id)} className="p-1.5 text-gray-400 dark:text-gray-500 hover:text-red-500 dark:hover:text-red-400" title="Delete group">🗑️</button>
                              </div>
                            </div>
                              <div className="space-y-1 mb-3">
                                  {activeGroupMeds.map(med => (
                                      <div key={med.id} className="flex items-start gap-2 text-sm text-gray-700 dark:text-gray-300">
                                          <span className="text-green-500 mt-0.5 shrink-0">●</span>
                                          <span className="break-words min-w-0">{med.name} <span className="text-gray-400 dark:text-gray-500">({formatDosage(med)})</span></span>
                                      </div>
                                  ))}
                              </div>
                            <button onClick={() => handleGroupQuickLog(group)} disabled={activeGroupMeds.length === 0}
                                    className="w-full py-2 px-3 bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-lg text-sm font-medium hover:bg-blue-100 dark:hover:bg-blue-800/40 transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
                              Log All {activeGroupMeds.length} Meds
                            </button>
                          </div>
                      );
                    })}
                  </div>
              )}
            </div>
        )}

        {/* ═══════════ MY MEDS TAB ═══════════ */}
        {activeTab === 'list' && (
            <div>
              <button onClick={() => setShowAddForm(true)}
                      className="w-full mb-4 py-3 px-4 border-2 border-dashed border-gray-300 dark:border-gray-600 text-gray-600 dark:text-gray-400 rounded-lg hover:border-blue-400 dark:hover:border-blue-500 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                + Add Medication
              </button>
              {medications.length === 0 ? (
                  <div className="text-center py-8 text-gray-500 dark:text-gray-400"><p>No medications in your list</p></div>
              ) : (
                  <div className="space-y-3">
                    {medications.map((med) => (
                        <div key={med.id} className={`bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4 ${!med.isActive ? 'opacity-60' : ''}`}>
                          <div className="flex justify-between items-start text-left">
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2">
                                <p className="font-semibold text-gray-900 dark:text-white">{med.name}</p>
                                {!med.isActive && <span className="text-xs px-1.5 py-0.5 bg-gray-200 dark:bg-gray-600 text-gray-500 dark:text-gray-400 rounded">Inactive</span>}
                              </div>
                              <p className="text-sm text-gray-600 dark:text-gray-400">{formatDosageWithTotal(med)}</p>
                              <p className="text-xs text-blue-600 dark:text-blue-400">{frequencyLabels[med.frequency]}</p>
                              {med.forConditions?.length > 0 && <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">For: {med.forConditions.join(', ')}</p>}
                              {med.notes && <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">{med.notes}</p>}
                              {/* Dosing Timer — only renders if interval is set */}
                              {med.dosingIntervalHours && (
                                  <DosingTimer
                                      med={med}
                                      logs={logs}
                                  />
                              )}
                            </div>
                            <div className="flex items-center gap-2 ml-2">
                              <button onClick={() => handleEditMedication(med)} className="text-gray-400 dark:text-gray-500 hover:text-blue-500 dark:hover:text-blue-400" title="Edit medication">✏️</button>
                              <button onClick={() => handleDiscontinueMedication(med)}
                                      className="text-gray-400 dark:text-gray-500 hover:text-amber-500 dark:hover:text-amber-400"
                                      title="Discontinue — move to history">🗄️</button>
                              <button onClick={() => handleDeleteMedication(med.id)} className="text-gray-400 dark:text-gray-500 hover:text-red-500 dark:hover:text-red-400" title="Delete medication">🗑️</button>
                            </div>
                          </div>
                        </div>
                    ))}
                  </div>
              )}

              {/* ── Medication History Section ───────────────── */}
              {medHistory.length > 0 && (
                  <div className="mt-6">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="flex-1 h-px bg-gray-200 dark:bg-gray-700" />
                      <p className="text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wide whitespace-nowrap">
                        Medication History ({medHistory.length})
                      </p>
                      <div className="flex-1 h-px bg-gray-200 dark:bg-gray-700" />
                    </div>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mb-3">
                      Past prescriptions and discontinued medications. Useful for VA C&P documentation.
                    </p>
                    <div className="space-y-2">
                      {medHistory.map((entry) => (
                          <div key={entry.id}
                               className="bg-gray-50 dark:bg-gray-800/60 rounded-lg border border-gray-200 dark:border-gray-700">
                            {/* Collapsed header — always visible */}
                            <button
                                onClick={() => setExpandedHistoryId(prev => prev === entry.id ? null : entry.id)}
                                className="w-full flex items-center justify-between p-3 text-left">
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2 flex-wrap">
                                  <p className="font-medium text-gray-700 dark:text-gray-300 text-sm">{entry.name}</p>
                                  {entry.source === 'blue-button' && (
                                      <span className="text-xs px-1.5 py-0.5 bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400 rounded">VA</span>
                                  )}
                                </div>
                                <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">
                                  {entry.lastFilledStr
                                      ? `Last filled: ${entry.lastFilledStr}`
                                      : entry.discontinuedAt
                                          ? `Discontinued: ${new Date(entry.discontinuedAt).toLocaleDateString()}`
                                          : 'No date recorded'}
                                </p>
                              </div>
                              <span className="text-gray-400 dark:text-gray-500 text-xs ml-2">
                            {expandedHistoryId === entry.id ? '▲' : '▼'}
                          </span>
                            </button>

                            {/* Expanded detail */}
                            {expandedHistoryId === entry.id && (
                                <div className="px-3 pb-3 border-t border-gray-200 dark:border-gray-700 pt-3 space-y-2">
                                  {entry.dosage && (
                                      <p className="text-xs text-gray-600 dark:text-gray-400">
                                        <span className="font-medium">Dosage:</span> {entry.dosage}
                                      </p>
                                  )}
                                  {entry.forConditions?.length > 0 && (
                                      <p className="text-xs text-gray-600 dark:text-gray-400">
                                        <span className="font-medium">For:</span> {entry.forConditions.join(', ')}
                                      </p>
                                  )}

                                  {/* Notes — view or edit */}
                                  {editingHistoryEntry === entry.id ? (
                                      <div className="space-y-2">
                                <textarea
                                    value={historyNotesDraft}
                                    onChange={(e) => setHistoryNotesDraft(e.target.value)}
                                    rows={3}
                                    className="w-full p-2 text-xs border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                                    placeholder="Add notes about this prescription..."
                                />
                                        <div className="flex gap-2">
                                          <button onClick={() => handleSaveHistoryNotes(entry)}
                                                  className="px-3 py-1.5 bg-blue-900 dark:bg-blue-600 text-white text-xs rounded-lg hover:bg-blue-800">
                                            Save
                                          </button>
                                          <button onClick={() => { setEditingHistoryEntry(null); setHistoryNotesDraft(''); }}
                                                  className="px-3 py-1.5 border border-gray-300 dark:border-gray-600 text-gray-600 dark:text-gray-400 text-xs rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700">
                                            Cancel
                                          </button>
                                        </div>
                                      </div>
                                  ) : (
                                      <div>
                                        {entry.notes && (
                                            <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">{entry.notes}</p>
                                        )}
                                        <button
                                            onClick={() => { setEditingHistoryEntry(entry.id); setHistoryNotesDraft(entry.notes || ''); }}
                                            className="text-xs text-blue-600 dark:text-blue-400 hover:underline">
                                          {entry.notes ? '✏️ Edit notes' : '+ Add notes'}
                                        </button>
                                      </div>
                                  )}

                                  {/* Actions */}
                                  <div className="flex gap-2 pt-1">
                                    <button onClick={() => handleRestoreFromHistory(entry)}
                                            className="flex-1 py-1.5 px-3 bg-green-50 dark:bg-green-900/30 text-green-700 dark:text-green-400 border border-green-200 dark:border-green-800 rounded-lg text-xs font-medium hover:bg-green-100 dark:hover:bg-green-900/50 transition-colors">
                                      ↩ Restore to Active
                                    </button>
                                    <button onClick={() => { if (window.confirm('Delete this history entry?')) { deleteMedicationHistory(entry.id); loadData(); } }}
                                            className="py-1.5 px-3 text-red-400 dark:text-red-500 border border-red-200 dark:border-red-800 rounded-lg text-xs hover:bg-red-50 dark:hover:bg-red-900/30 transition-colors">
                                      🗑️
                                    </button>
                                  </div>
                                </div>
                            )}
                          </div>
                      ))}
                    </div>
                  </div>
              )}
            </div>
        )}

        {/* ═══════════ HISTORY TAB ═══════════ */}
        {activeTab === 'history' && (
            <div>
              {logs.length === 0 ? (
                  <div className="text-center py-8 text-gray-500 dark:text-gray-400"><p className="text-4xl mb-2">📋</p><p>No medication logs yet</p></div>
              ) : (
                  <div className="space-y-3">
                    {groupedLogs.map((group, gIdx) => {
                      const firstLog = group.items[0];
                      const isMulti = group.items.length > 1;
                      const displayTime = firstLog.occurredAt || firstLog.timestamp;
                      const loggedTime = firstLog.timestamp;
                        const backDated = isBackDated(firstLog);

                      // Match to a saved medication group for icon
                      const matchingGroup = groups.find(g => g.name === firstLog.takenFor);
                      const groupIcon = matchingGroup?.icon || (isMulti ? '💊' : null);

                      if (isMulti) {
                        // ── Grouped card for batch/group logs ──
                        const sharedNotes = group.items.every(l => l.notes === firstLog.notes) ? firstLog.notes : null;

                        return (
                            <div key={`group-${gIdx}`} className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4">
                              {/* Group header */}
                              <div className="mb-3">
                                <div className="flex items-center gap-2">
                                  {groupIcon && <span className="text-lg">{groupIcon}</span>}
                                  <p className="font-semibold text-gray-900 dark:text-white">
                                    {firstLog.takenFor || `${group.items.length} Medications`}
                                  </p>
                                </div>
                                <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">
                                  {formatDate(displayTime)} · {group.items.length} meds
                                </p>
                                  {backDated && (
                                      <p className="text-xs text-amber-500 dark:text-amber-400">
                                          ⏱ Back-dated (logged {formatDate(loggedTime)})
                                      </p>
                                  )}
                              </div>

                              {/* Individual meds in group */}
                              <div className="space-y-2">
                                {group.items.map(log => (
                                    <div key={log.id} className="flex justify-between items-start text-left pl-3 border-l-2 border-blue-200 dark:border-blue-700">
                                      <div className="flex-1 min-w-0">
                                        <p className="text-sm font-medium text-gray-900 dark:text-white">{log.medicationName}</p>
                                        <p className="text-xs text-gray-500 dark:text-gray-400">{formatDosage(log)}</p>
                                      </div>
                                      <div className="flex items-center gap-1 ml-2 shrink-0">
                                        <button onClick={() => handleEditLog(log)} className="text-gray-400 dark:text-gray-500 hover:text-blue-500 dark:hover:text-blue-400 p-0.5" title="Edit log">✏️</button>
                                        <button onClick={() => handleDeleteLog(log.id)} className="text-gray-400 dark:text-gray-500 hover:text-red-500 dark:hover:text-red-400 p-0.5" title="Delete log">🗑️</button>
                                      </div>
                                    </div>
                                ))}
                              </div>

                              {/* Effectiveness & Side Effects (shared across batch) */}
                              {firstLog.effectiveness && (
                                  <div className="mt-3">
                                  <span className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-medium border ${getEffectivenessColor(firstLog.effectiveness)}`}>
                                    {EFFECTIVENESS_LABELS[firstLog.effectiveness] || firstLog.effectiveness}
                                  </span>
                                  </div>
                              )}
                              {firstLog.sideEffects && (
                                  <p className="text-xs text-amber-600 dark:text-amber-400 mt-1">
                                    ⚠️ {Array.isArray(firstLog.sideEffects) ? firstLog.sideEffects.join(', ') : firstLog.sideEffects}
                                  </p>
                              )}
                              {/* Shared notes */}
                              {sharedNotes && (
                                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-2 bg-gray-50 dark:bg-gray-700 p-2 rounded">
                                    {sharedNotes}
                                  </p>
                              )}
                            </div>
                        );
                      } else {
                        // ── Single medication card ──
                        const log = firstLog;
                        return (
                            <div key={log.id} className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4">
                              <div className="flex justify-between items-start text-left">
                                <div className="flex-1 min-w-0">
                                  <p className="font-semibold text-gray-900 dark:text-white">{log.medicationName}</p>
                                  <p className="text-sm text-gray-600 dark:text-gray-400">{formatDosage(log)}</p>
                                  <p className="text-xs text-gray-400 dark:text-gray-500">{formatDate(displayTime)}</p>
                                    {backDated && (
                                        <p className="text-xs text-amber-500 dark:text-amber-400">
                                            ⏱ Back-dated (logged {formatDate(loggedTime)})
                                        </p>
                                    )}
                                  {log.takenFor && <p className="text-xs text-blue-600 dark:text-blue-400 mt-1">For: {log.takenFor}</p>}
                                  {log.effectiveness && (
                                      <span className={`inline-block mt-1 px-2.5 py-0.5 rounded-full text-xs font-medium border ${getEffectivenessColor(log.effectiveness)}`}>
                                      {EFFECTIVENESS_LABELS[log.effectiveness] || log.effectiveness}
                                    </span>
                                  )}
                                  {log.sideEffects && (
                                      <p className="text-xs text-amber-600 dark:text-amber-400 mt-1">⚠️ {Array.isArray(log.sideEffects) ? log.sideEffects.join(', ') : log.sideEffects}</p>
                                  )}
                                  {log.notes && <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 bg-gray-50 dark:bg-gray-700 p-2 rounded">{log.notes}</p>}
                                </div>
                                <div className="flex items-center gap-1 ml-2 shrink-0">
                                  <button onClick={() => handleEditLog(log)} className="text-gray-400 dark:text-gray-500 hover:text-blue-500 dark:hover:text-blue-400" title="Edit log">✏️</button>
                                  <button onClick={() => handleDeleteLog(log.id)} className="text-gray-400 dark:text-gray-500 hover:text-red-500 dark:hover:text-red-400" title="Delete log">🗑️</button>
                                </div>
                              </div>
                            </div>
                        );
                      }
                    })}
                  </div>
              )}
            </div>
        )}

        {/* ═══════════ ADD MEDICATION MODAL ═══════════ */}
        {showAddForm && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
              <div className="bg-white dark:bg-gray-800 rounded-lg w-full max-w-md max-h-[90vh] overflow-y-auto">
                <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                  <div className="flex justify-between items-center">
                    <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Add Medication</h2>
                    <button onClick={() => setShowAddForm(false)} className="text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 text-xl">✕</button>
                  </div>
                </div>
                <form onSubmit={handleAddMedication} className="p-4 space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Medication Name <span className="text-red-500">*</span></label>
                    <input type="text" value={newMed.name} onChange={(e) => setNewMed(prev => ({ ...prev, name: e.target.value }))}
                           placeholder="e.g., Ibuprofen, Gabapentin"
                           className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500" autoFocus />
                  </div>
                  <DosageFields data={newMed} onChange={setNewMed} />
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Frequency</label>
                    <select value={newMed.frequency} onChange={(e) => setNewMed(prev => ({ ...prev, frequency: e.target.value }))}
                            className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500">
                      <option value="as-needed">As Needed (PRN)</option><option value="daily">Once Daily</option>
                      <option value="twice-daily">Twice Daily</option><option value="three-times">Three Times Daily</option>
                      <option value="four-times">Four Times Daily</option><option value="weekly">Weekly</option><option value="other">Other</option>
                    </select>
                  </div>
                  {/* Dosing Interval — drives the safety timer */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Minimum time between doses
                      <span className="text-xs text-gray-400 font-normal ml-1">(optional — enables dosing timer)</span>
                    </label>
                    <select value={newMed.dosingIntervalHours}
                            onChange={(e) => setNewMed(prev => ({ ...prev, dosingIntervalHours: e.target.value }))}
                            className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500">
                      <option value="">Not set (no timer)</option>
                      <option value="2">Every 2 hours</option>
                      <option value="3">Every 3 hours</option>
                      <option value="4">Every 4 hours</option>
                      <option value="6">Every 6 hours</option>
                      <option value="8">Every 8 hours</option>
                      <option value="12">Every 12 hours</option>
                      <option value="24">Every 24 hours</option>
                    </select>
                    {newMed.dosingIntervalHours && (
                        <p className="text-xs text-blue-600 dark:text-blue-400 mt-1">
                          ⏱ A safety timer will show when it's safe to take the next dose.
                        </p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Prescribed For (optional)</label>
                    <input type="text" value={newMed.forConditions} onChange={(e) => setNewMed(prev => ({ ...prev, forConditions: e.target.value }))}
                           placeholder="e.g., Back pain, Anxiety (comma-separated)"
                           className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Notes (optional)</label>
                    <textarea value={newMed.notes} onChange={(e) => setNewMed(prev => ({ ...prev, notes: e.target.value }))}
                              placeholder="e.g., Take with food" rows={2}
                              className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500" />
                  </div>
                  <div className="flex gap-2">
                    <button type="button" onClick={() => setShowAddForm(false)} className="flex-1 py-2 px-4 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700">Cancel</button>
                    <button type="submit" className="flex-1 py-3 px-4 bg-blue-900 dark:bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-800 dark:hover:bg-blue-700">Add Medication</button>
                  </div>
                </form>
              </div>
            </div>
        )}

        {/* ═══════════ BATCH LOG MODAL ═══════════ */}
        {showBatchLogForm && selectedMedIds.size > 0 && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
              <div className="bg-white dark:bg-gray-800 rounded-lg w-full max-w-md max-h-[90vh] overflow-y-auto">
                <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                  <div className="flex justify-between items-center">
                    <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Log {selectedMedIds.size} Medication{selectedMedIds.size !== 1 ? 's' : ''}</h2>
                    <button onClick={() => setShowBatchLogForm(false)} className="text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 text-xl">✕</button>
                  </div>
                </div>
                <form onSubmit={handleBatchLog} className="p-4 space-y-4">
                  <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-3">
                    <p className="text-xs text-gray-500 dark:text-gray-400 mb-2 uppercase tracking-wide font-medium">Logging:</p>
                    <div className="space-y-1">
                      {medications.filter(m => selectedMedIds.has(m.id)).map(med => (
                          <div key={med.id} className="flex items-center gap-2 text-sm">
                            <span className="text-blue-500">✓</span>
                            <span className="text-gray-900 dark:text-white font-medium">{med.name}</span>
                            <span className="text-gray-500 dark:text-gray-400">({formatDosage(med)})</span>
                          </div>
                      ))}
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Taking them for (optional)</label>
                    <input type="text" value={batchLogData.takenFor} onChange={(e) => setBatchLogData(prev => ({ ...prev, takenFor: e.target.value }))}
                           placeholder="e.g., Morning routine, Pain flare-up"
                           className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500" autoFocus />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Notes (optional)</label>
                    <textarea value={batchLogData.notes} onChange={(e) => setBatchLogData(prev => ({ ...prev, notes: e.target.value }))}
                              placeholder="Any additional notes" rows={2}
                              className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500" />
                  </div>
                  <EffectivenessSideEffectsFields data={batchLogData} onChange={setBatchLogData} />
                  <div className="pt-2 border-t border-gray-200 dark:border-gray-700">
                    <OccurrenceTimePicker value={batchOccurredAt} onChange={setBatchOccurredAt} label="When were these taken?" />
                  </div>
                  {selectedMedIds.size >= 2 && groups.length === 0 && (
                      <p className="text-xs text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20 p-2 rounded">💡 Tip: Use the Groups tab to save this combo for even faster logging next time.</p>
                  )}
                  <div className="flex gap-2">
                    <button type="button" onClick={() => setShowBatchLogForm(false)} className="flex-1 py-2 px-4 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700">Cancel</button>
                    <button type="submit" className="flex-1 py-3 px-4 bg-blue-900 dark:bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-800 dark:hover:bg-blue-700">Log All</button>
                  </div>
                </form>
              </div>
            </div>
        )}

        {/* ═══════════ CREATE/EDIT GROUP MODAL ═══════════ */}
        {showGroupForm && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
              <div className="bg-white dark:bg-gray-800 rounded-lg w-full max-w-md max-h-[90vh] overflow-y-auto">
                <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                  <div className="flex justify-between items-center">
                    <h2 className="text-lg font-semibold text-gray-900 dark:text-white">{editingGroup ? 'Edit Group' : 'Create Medication Group'}</h2>
                    <button onClick={() => { setShowGroupForm(false); setEditingGroup(null); }} className="text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 text-xl">✕</button>
                  </div>
                </div>
                <form onSubmit={handleSaveGroup} className="p-4 space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Group Name <span className="text-red-500">*</span></label>
                    <input type="text" value={groupForm.name} onChange={(e) => setGroupForm(prev => ({ ...prev, name: e.target.value }))}
                           placeholder="e.g., Morning Meds, Bedtime Meds"
                           className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500" autoFocus />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Icon</label>
                    <div className="flex flex-wrap gap-2">
                      {groupIcons.map(icon => (
                          <button key={icon} type="button" onClick={() => setGroupForm(prev => ({ ...prev, icon }))}
                                  className={`w-10 h-10 rounded-lg text-xl flex items-center justify-center transition-all ${
                                      groupForm.icon === icon ? 'bg-blue-100 dark:bg-blue-900/40 ring-2 ring-blue-500' : 'bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600'
                                  }`}>{icon}</button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Select Medications <span className="text-red-500">*</span></label>
                    {activeMeds.length === 0 ? (
                        <p className="text-sm text-gray-500 dark:text-gray-400 text-center py-4">No active medications. Add medications first.</p>
                    ) : (
                        <div className="space-y-2 max-h-60 overflow-y-auto">
                          {activeMeds.map(med => {
                            const isIn = groupForm.medicationIds.includes(med.id);
                            return (
                                <button key={med.id} type="button" onClick={() => toggleGroupMed(med.id)}
                                        className={`w-full p-3 rounded-lg border text-left transition-all flex items-center gap-3 ${
                                            isIn ? 'bg-blue-50 dark:bg-blue-900/30 border-blue-400 dark:border-blue-500' : 'bg-white dark:bg-gray-700 border-gray-200 dark:border-gray-600 hover:border-blue-300 dark:hover:border-blue-600'
                                        }`}>
                                  <div className={`w-5 h-5 rounded border-2 flex items-center justify-center ${isIn ? 'bg-blue-600 dark:bg-blue-500 border-blue-600 dark:border-blue-500' : 'border-gray-300 dark:border-gray-500'}`}>
                                    {isIn && <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>}
                                  </div>
                                  <div>
                                    <p className="font-medium text-gray-900 dark:text-white text-sm">{med.name}</p>
                                    <p className="text-xs text-gray-500 dark:text-gray-400">{formatDosage(med)}</p>
                                  </div>
                                </button>
                            );
                          })}
                        </div>
                    )}
                    {groupForm.medicationIds.length > 0 && <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">{groupForm.medicationIds.length} medication{groupForm.medicationIds.length !== 1 ? 's' : ''} selected</p>}
                  </div>
                  <div className="flex gap-2">
                    <button type="button" onClick={() => { setShowGroupForm(false); setEditingGroup(null); }} className="flex-1 py-2 px-4 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700">Cancel</button>
                    <button type="submit" className="flex-1 py-3 px-4 bg-blue-900 dark:bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-800 dark:hover:bg-blue-700">{editingGroup ? 'Update Group' : 'Create Group'}</button>
                  </div>
                </form>
              </div>
            </div>
        )}

        {/* ═══════════ EDIT MEDICATION MODAL ═══════════ */}
        {showEditMedForm && editingMed && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
              <div className="bg-white dark:bg-gray-800 rounded-lg w-full max-w-md max-h-[90vh] overflow-y-auto">
                <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                  <div className="flex justify-between items-center">
                    <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Edit Medication</h2>
                    <button onClick={() => { setShowEditMedForm(false); setEditingMed(null); }} className="text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 text-xl">✕</button>
                  </div>
                </div>
                <form onSubmit={handleSaveEditMedication} className="p-4 space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Medication Name <span className="text-red-500">*</span></label>
                    <input type="text" value={editMedData.name} onChange={(e) => setEditMedData(prev => ({ ...prev, name: e.target.value }))}
                           className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500" autoFocus />
                  </div>
                  <DosageFields data={editMedData} onChange={setEditMedData} />
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Frequency</label>
                    <select value={editMedData.frequency} onChange={(e) => setEditMedData(prev => ({ ...prev, frequency: e.target.value }))}
                            className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500">
                      <option value="as-needed">As Needed (PRN)</option><option value="daily">Once Daily</option>
                      <option value="twice-daily">Twice Daily</option><option value="three-times">Three Times Daily</option>
                      <option value="four-times">Four Times Daily</option><option value="weekly">Weekly</option><option value="other">Other</option>
                    </select>
                  </div>
                  {/* Dosing Interval */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Minimum time between doses
                      <span className="text-xs text-gray-400 font-normal ml-1">(optional — enables dosing timer)</span>
                    </label>
                    <select value={editMedData.dosingIntervalHours}
                            onChange={(e) => setEditMedData(prev => ({ ...prev, dosingIntervalHours: e.target.value }))}
                            className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500">
                      <option value="">Not set (no timer)</option>
                      <option value="2">Every 2 hours</option>
                      <option value="3">Every 3 hours</option>
                      <option value="4">Every 4 hours</option>
                      <option value="6">Every 6 hours</option>
                      <option value="8">Every 8 hours</option>
                      <option value="12">Every 12 hours</option>
                      <option value="24">Every 24 hours</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Prescribed For (optional)</label>
                    <input type="text" value={editMedData.forConditions} onChange={(e) => setEditMedData(prev => ({ ...prev, forConditions: e.target.value }))}
                           placeholder="e.g., Back pain, Anxiety (comma-separated)"
                           className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Notes (optional)</label>
                    <textarea value={editMedData.notes} onChange={(e) => setEditMedData(prev => ({ ...prev, notes: e.target.value }))}
                              placeholder="e.g., Take with food" rows={2}
                              className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500" />
                  </div>
                  {/* Active/Inactive toggle */}
                  <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                    <div>
                      <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Active Medication</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">Inactive meds won't appear in Quick Log</p>
                    </div>
                    <button type="button" onClick={() => setEditMedData(prev => ({ ...prev, isActive: !prev.isActive }))}
                            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${editMedData.isActive ? 'bg-blue-600' : 'bg-gray-300 dark:bg-gray-600'}`}>
                      <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${editMedData.isActive ? 'translate-x-6' : 'translate-x-1'}`} />
                    </button>
                  </div>
                  <div className="flex gap-2">
                    <button type="button" onClick={() => { setShowEditMedForm(false); setEditingMed(null); }} className="flex-1 py-2 px-4 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700">Cancel</button>
                    <button type="submit" className="flex-1 py-3 px-4 bg-blue-900 dark:bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-800 dark:hover:bg-blue-700">Save Changes</button>
                  </div>
                </form>
              </div>
            </div>
        )}

        {/* ═══════════ GROUP LOG CONFIRMATION MODAL ═══════════ */}
        {showGroupLogConfirm && pendingGroup && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
              <div className="bg-white dark:bg-gray-800 rounded-lg w-full max-w-md max-h-[90vh] overflow-y-auto">
                <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                  <div className="flex justify-between items-center">
                    <div>
                      <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                        {pendingGroup.icon} Log {pendingGroup.name}
                      </h2>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {medications.filter(m => m.isActive && pendingGroup.medicationIds.includes(m.id)).length} medications
                      </p>
                    </div>
                    <button onClick={() => { setShowGroupLogConfirm(false); setPendingGroup(null); }}
                            className="text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 text-xl">✕</button>
                  </div>
                </div>
                <form onSubmit={handleConfirmGroupLog} className="p-4 space-y-4">
                  <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-3">
                    <div className="space-y-1">
                      {medications.filter(m => m.isActive && pendingGroup.medicationIds.includes(m.id)).map(med => (
                          <div key={med.id} className="flex items-center gap-2 text-sm">
                            <span className="text-green-500">●</span>
                            <span className="text-gray-900 dark:text-white">{med.name}</span>
                            <span className="text-gray-500 dark:text-gray-400">({formatDosage(med)})</span>
                          </div>
                      ))}
                    </div>
                  </div>
                  <EffectivenessSideEffectsFields data={groupLogData} onChange={setGroupLogData} />
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Notes (optional)</label>
                    <textarea value={groupLogData.notes} onChange={(e) => setGroupLogData(prev => ({ ...prev, notes: e.target.value }))}
                              placeholder="Any additional notes" rows={2}
                              className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500" />
                  </div>
                  <div className="pt-2 border-t border-gray-200 dark:border-gray-700">
                    <OccurrenceTimePicker value={groupLogData.occurredAt} onChange={(val) => setGroupLogData(prev => ({ ...prev, occurredAt: val }))} label="When were these taken?" />
                  </div>
                  <div className="flex gap-2">
                    <button type="button" onClick={() => { setShowGroupLogConfirm(false); setPendingGroup(null); }}
                            className="flex-1 py-2 px-4 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700">Cancel</button>
                    <button type="submit"
                            className="flex-1 py-3 px-4 bg-blue-900 dark:bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-800 dark:hover:bg-blue-700">Log All</button>
                  </div>
                </form>
              </div>
            </div>
        )}

        {/* ═══════════ EDIT MEDICATION LOG MODAL ═══════════ */}
        {showEditLogForm && editingLog && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
              <div className="bg-white dark:bg-gray-800 rounded-lg w-full max-w-md max-h-[90vh] overflow-y-auto">
                <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                  <div className="flex justify-between items-center">
                    <div>
                      <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Edit Log Entry</h2>
                      <p className="text-sm text-gray-500 dark:text-gray-400">{editingLog.medicationName} — {formatDosage(editingLog)}</p>
                    </div>
                    <button onClick={() => { setShowEditLogForm(false); setEditingLog(null); }}
                            className="text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 text-xl">✕</button>
                  </div>
                </div>
                <form onSubmit={handleSaveEditLog} className="p-4 space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Taken for (optional)</label>
                    <input type="text" value={editLogData.takenFor} onChange={(e) => setEditLogData(prev => ({ ...prev, takenFor: e.target.value }))}
                           placeholder="e.g., Morning routine, Pain flare-up"
                           className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500" />
                  </div>
                  <EffectivenessSideEffectsFields data={editLogData} onChange={setEditLogData} />
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Notes (optional)</label>
                    <textarea value={editLogData.notes} onChange={(e) => setEditLogData(prev => ({ ...prev, notes: e.target.value }))}
                              placeholder="Any additional notes" rows={2}
                              className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500" />
                  </div>
                  <div className="pt-2 border-t border-gray-200 dark:border-gray-700">
                    <OccurrenceTimePicker value={editLogData.occurredAt} onChange={(val) => setEditLogData(prev => ({ ...prev, occurredAt: val }))} label="When was this taken?" />
                  </div>
                  <div className="flex gap-2">
                    <button type="button" onClick={() => { setShowEditLogForm(false); setEditingLog(null); }}
                            className="flex-1 py-2 px-4 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700">Cancel</button>
                    <button type="submit"
                            className="flex-1 py-3 px-4 bg-blue-900 dark:bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-800 dark:hover:bg-blue-700">Save Changes</button>
                  </div>
                </form>
              </div>
            </div>
        )}

      </div>
  );
};

export default Medications;