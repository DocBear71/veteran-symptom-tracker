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
} from '../utils/storage';
import { formatDosage, formatDosageWithTotal, getDosageForLog, UNIT_TYPE_OPTIONS } from '../utils/medicationUtils';
import { getActiveProfileId } from '../utils/profiles';
import OccurrenceTimePicker from './OccurrenceTimePicker';

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

const Medications = () => {
  const [medications, setMedications] = useState([]);
  const [logs, setLogs] = useState([]);
  const [groups, setGroups] = useState([]);
  const [activeTab, setActiveTab] = useState('log');
  const [showAddForm, setShowAddForm] = useState(false);
  const [showGroupForm, setShowGroupForm] = useState(false);
  const [editingGroup, setEditingGroup] = useState(null);
  const [showEditMedForm, setShowEditMedForm] = useState(false);
  const [editingMed, setEditingMed] = useState(null);
  const [editMedData, setEditMedData] = useState({
    name: '', strength: '', quantity: 1, unitType: 'tablet',
    frequency: 'as-needed', forConditions: '', notes: '', isActive: true,
  });
  const [message, setMessage] = useState('');

  // Multi-select state for Quick Log
  const [selectedMedIds, setSelectedMedIds] = useState(new Set());
  const [showBatchLogForm, setShowBatchLogForm] = useState(false);

  // Add medication form state — structured dosage
  const [newMed, setNewMed] = useState({
    name: '', strength: '', quantity: 1, unitType: 'tablet',
    frequency: 'as-needed', forConditions: '', notes: '',
  });

  // Batch log & group form state
  const [batchLogData, setBatchLogData] = useState({ takenFor: '', notes: '' });
  const [batchOccurredAt, setBatchOccurredAt] = useState(new Date().toISOString());
  const [groupForm, setGroupForm] = useState({ name: '', icon: '🌅', medicationIds: [] });

  // Group quick-log confirmation modal
  const [showGroupLogConfirm, setShowGroupLogConfirm] = useState(false);
  const [pendingGroup, setPendingGroup] = useState(null);
  const [groupLogData, setGroupLogData] = useState({ notes: '', occurredAt: new Date().toISOString() });

  // Edit medication log modal
  const [showEditLogForm, setShowEditLogForm] = useState(false);
  const [editingLog, setEditingLog] = useState(null);
  const [editLogData, setEditLogData] = useState({ takenFor: '', notes: '', occurredAt: '' });

  useEffect(() => { loadData(); }, []);

  const loadData = () => {
    setMedications(getMedications());
    const allLogs = getMedicationLogs();
    allLogs.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
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
    let count = 0;
    medsToLog.forEach(med => {
      const r = logMedicationTaken({ medicationId: med.id, medicationName: med.name, dosage: getDosageForLog(med), takenFor: batchLogData.takenFor, notes: batchLogData.notes, occurredAt: batchOccurredAt });
      if (r.success) count++;
    });
    showMessage(`Logged ${count} medication${count !== 1 ? 's' : ''}`);
    setSelectedMedIds(new Set()); setShowBatchLogForm(false);
    setBatchLogData({ takenFor: '', notes: '' }); setBatchOccurredAt(new Date().toISOString()); loadData();
  };

  // ─── Group Quick Log ─────────────────────────────────────────────
  // Opens a confirmation modal so user can set time and optional notes
  const handleGroupQuickLog = (group) => {
    const meds = medications.filter(m => m.isActive && group.medicationIds.includes(m.id));
    if (meds.length === 0) { showMessage('No active medications in this group'); return; }
    setPendingGroup(group);
    setGroupLogData({ notes: '', occurredAt: new Date().toISOString() });
    setShowGroupLogConfirm(true);
  };

  const handleConfirmGroupLog = (e) => {
    e.preventDefault();
    if (!pendingGroup) return;
    const meds = medications.filter(m => m.isActive && pendingGroup.medicationIds.includes(m.id));
    let count = 0;
    meds.forEach(med => {
      const r = logMedicationTaken({
        medicationId: med.id, medicationName: med.name, dosage: getDosageForLog(med),
        takenFor: pendingGroup.name,
        notes: groupLogData.notes || `Logged via "${pendingGroup.name}" group`,
        occurredAt: groupLogData.occurredAt,
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
    });
    if (result.success) {
      showMessage('Medication updated!'); setShowEditMedForm(false); setEditingMed(null); loadData();
    } else { showMessage(result.message || 'Failed to update'); }
  };

  // ─── Edit Medication Log ─────────────────────────────────────────
  const handleEditLog = (log) => {
    setEditingLog(log);
    setEditLogData({
      takenFor: log.takenFor || '',
      notes: log.notes || '',
      occurredAt: log.occurredAt || log.timestamp,
    });
    setShowEditLogForm(true);
  };

  const handleSaveEditLog = (e) => {
    e.preventDefault();
    const result = updateMedicationLog(editingLog.id, {
      takenFor: editLogData.takenFor,
      notes: editLogData.notes,
      occurredAt: editLogData.occurredAt,
    });
    if (result.success) {
      showMessage('Log updated!'); setShowEditLogForm(false); setEditingLog(null); loadData();
    } else { showMessage(result.message || 'Failed to update'); }
  };

  // ─── Delete handlers ─────────────────────────────────────────────
  const handleDeleteMedication = (id) => { if (window.confirm('Remove this medication from your list?')) { deleteMedication(id); loadData(); } };
  const handleDeleteLog = (id) => { if (window.confirm('Delete this log entry?')) { deleteMedicationLog(id); loadData(); } };

  // ─── Helpers ─────────────────────────────────────────────────────
  const formatDate = (timestamp) => new Date(timestamp).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' });

  const frequencyLabels = {
    'as-needed': 'As Needed (PRN)', 'daily': 'Once Daily', 'twice-daily': 'Twice Daily',
    'three-times': 'Three Times Daily', 'four-times': 'Four Times Daily', 'weekly': 'Weekly', 'other': 'Other',
  };
  const groupIcons = ['🌅', '🌙', '☀️', '🕐', '💊', '🏥', '⚡', '🎯'];
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

  // ─── Group logs by occurredAt timestamp for visual clustering ────
  // Logs within 60 seconds of each other are considered part of the same batch.
  const groupedLogs = (() => {
    if (logs.length === 0) return [];

    const groups = [];
    let currentGroup = null;

    logs.forEach(log => {
      const logTime = new Date(log.occurredAt || log.timestamp).getTime();

      if (currentGroup && Math.abs(logTime - currentGroup.time) < 60000) {
        // Within 60 seconds of the group — add to it
        currentGroup.items.push(log);
      } else {
        // Start a new group
        currentGroup = {
          time: logTime,
          // Use takenFor as group label if it matches a group name, otherwise generic
          label: log.takenFor || null,
          items: [log],
        };
        groups.push(currentGroup);
      }
    });

    return groups;
  })();

  return (
      <div className="pb-20">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Medications</h2>

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
                            </div>
                            <div className="flex items-center gap-2 ml-2">
                              <button onClick={() => handleEditMedication(med)} className="text-gray-400 dark:text-gray-500 hover:text-blue-500 dark:hover:text-blue-400" title="Edit medication">✏️</button>
                              <button onClick={() => handleDeleteMedication(med.id)} className="text-gray-400 dark:text-gray-500 hover:text-red-500 dark:hover:text-red-400" title="Delete medication">🗑️</button>
                            </div>
                          </div>
                        </div>
                    ))}
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
                      const isBackDated = firstLog.occurredAt && firstLog.timestamp &&
                          new Date(firstLog.timestamp) - new Date(firstLog.occurredAt) > 60000;

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
                                {isBackDated && (
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

                              {/* Shared notes */}
                              {sharedNotes && (
                                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-3 bg-gray-50 dark:bg-gray-700 p-2 rounded">
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
                                  {isBackDated && (
                                      <p className="text-xs text-amber-500 dark:text-amber-400">
                                        ⏱ Back-dated (logged {formatDate(loggedTime)})
                                      </p>
                                  )}
                                  {log.takenFor && <p className="text-xs text-blue-600 dark:text-blue-400 mt-1">For: {log.takenFor}</p>}
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