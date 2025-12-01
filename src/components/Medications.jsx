import { useState, useEffect } from 'react';
import {
  getMedications,
  addMedication,
  deleteMedication,
  logMedicationTaken,
  getMedicationLogs,
  deleteMedicationLog,
} from '../utils/storage';

const Medications = () => {
  const [medications, setMedications] = useState([]);
  const [logs, setLogs] = useState([]);
  const [activeTab, setActiveTab] = useState('log'); // log, list, history
  const [showAddForm, setShowAddForm] = useState(false);
  const [showLogForm, setShowLogForm] = useState(false);
  const [selectedMed, setSelectedMed] = useState(null);
  const [message, setMessage] = useState('');

  // Add medication form state
  const [newMed, setNewMed] = useState({
    name: '',
    dosage: '',
    frequency: 'as-needed',
    forConditions: '',
    notes: '',
  });

  // Log medication form state
  const [logData, setLogData] = useState({
    takenFor: '',
    notes: '',
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    setMedications(getMedications());
    const allLogs = getMedicationLogs();
    allLogs.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
    setLogs(allLogs);
  };

  const showMessage = (text) => {
    setMessage(text);
    setTimeout(() => setMessage(''), 3000);
  };

  const handleAddMedication = (e) => {
    e.preventDefault();

    if (!newMed.name.trim() || !newMed.dosage.trim()) {
      showMessage('Please enter medication name and dosage');
      return;
    }

    const result = addMedication({
      ...newMed,
      forConditions: newMed.forConditions.split(',').map(c => c.trim()).filter(c => c),
    });

    if (result.success) {
      showMessage('Medication added!');
      setNewMed({ name: '', dosage: '', frequency: 'as-needed', forConditions: '', notes: '' });
      setShowAddForm(false);
      loadData();
    } else {
      showMessage(result.message);
    }
  };

  const handleQuickLog = (med) => {
    setSelectedMed(med);
    setShowLogForm(true);
  };

  const handleLogMedication = (e) => {
    e.preventDefault();

    if (!selectedMed) return;

    const result = logMedicationTaken({
      medicationId: selectedMed.id,
      medicationName: selectedMed.name,
      dosage: selectedMed.dosage,
      takenFor: logData.takenFor,
      notes: logData.notes,
    });

    if (result.success) {
      showMessage(`Logged: ${selectedMed.name}`);
      setShowLogForm(false);
      setSelectedMed(null);
      setLogData({ takenFor: '', notes: '' });
      loadData();
    }
  };

  const handleDeleteMedication = (id) => {
    if (window.confirm('Remove this medication from your list?')) {
      deleteMedication(id);
      loadData();
    }
  };

  const handleDeleteLog = (id) => {
    if (window.confirm('Delete this log entry?')) {
      deleteMedicationLog(id);
      loadData();
    }
  };

  const formatDate = (timestamp) => {
    return new Date(timestamp).toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
    });
  };

  const frequencyLabels = {
    'as-needed': 'As Needed (PRN)',
    'daily': 'Once Daily',
    'twice-daily': 'Twice Daily',
    'three-times': 'Three Times Daily',
    'four-times': 'Four Times Daily',
    'weekly': 'Weekly',
    'other': 'Other',
  };

  return (
      <div className="pb-20">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Medications</h2>

        {/* Message */}
        {message && (
            <div className="mb-4 p-3 bg-green-100 text-green-800 rounded-lg text-center">
              {message}
            </div>
        )}

        {/* Tabs */}
        <div className="flex gap-2 mb-4">
          {[
            { id: 'log', label: 'Quick Log' },
            { id: 'list', label: 'My Meds' },
            { id: 'history', label: 'History' },
          ].map((tab) => (
              <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                      activeTab === tab.id
                          ? 'bg-blue-900 text-white'
                          : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
              >
                {tab.label}
              </button>
          ))}
        </div>

        {/* Quick Log Tab */}
        {activeTab === 'log' && (
            <div>
              {medications.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    <p className="text-4xl mb-2">💊</p>
                    <p>No medications added yet</p>
                    <button
                        onClick={() => { setActiveTab('list'); setShowAddForm(true); }}
                        className="mt-3 text-blue-600 hover:text-blue-800 font-medium"
                    >
                      + Add your first medication
                    </button>
                  </div>
              ) : (
                  <div className="space-y-2">
                    <p className="text-sm text-gray-600 mb-3">Tap to log that you took it:</p>
                    {medications.filter(m => m.isActive).map((med) => (
                        <button
                            key={med.id}
                            onClick={() => handleQuickLog(med)}
                            className="w-full bg-white rounded-lg border border-gray-200 p-4 text-left hover:border-blue-400 hover:shadow-sm transition-all"
                        >
                          <div className="flex justify-between items-start">
                            <div>
                              <p className="font-semibold text-gray-900">{med.name}</p>
                              <p className="text-sm text-gray-600">{med.dosage}</p>
                              <p className="text-xs text-gray-400">{frequencyLabels[med.frequency]}</p>
                            </div>
                            <span className="text-2xl">💊</span>
                          </div>
                        </button>
                    ))}
                  </div>
              )}
            </div>
        )}

        {/* My Medications Tab */}
        {activeTab === 'list' && (
            <div>
              <button
                  onClick={() => setShowAddForm(true)}
                  className="w-full mb-4 py-3 px-4 border-2 border-dashed border-gray-300 text-gray-600 rounded-lg hover:border-blue-400 hover:text-blue-600 transition-colors"
              >
                + Add Medication
              </button>

              {medications.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    <p>No medications in your list</p>
                  </div>
              ) : (
                  <div className="space-y-3">
                    {medications.map((med) => (
                        <div
                            key={med.id}
                            className="bg-white rounded-lg border border-gray-200 p-4"
                        >
                          <div className="flex justify-between items-start">
                            <div>
                              <p className="font-semibold text-gray-900">{med.name}</p>
                              <p className="text-sm text-gray-600">{med.dosage}</p>
                              <p className="text-xs text-blue-600">{frequencyLabels[med.frequency]}</p>
                              {med.forConditions?.length > 0 && (
                                  <p className="text-xs text-gray-500 mt-1">
                                    For: {med.forConditions.join(', ')}
                                  </p>
                              )}
                              {med.notes && (
                                  <p className="text-xs text-gray-400 mt-1">{med.notes}</p>
                              )}
                            </div>
                            <button
                                onClick={() => handleDeleteMedication(med.id)}
                                className="text-gray-400 hover:text-red-500"
                            >
                              🗑️
                            </button>
                          </div>
                        </div>
                    ))}
                  </div>
              )}
            </div>
        )}

        {/* History Tab */}
        {activeTab === 'history' && (
            <div>
              {logs.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    <p className="text-4xl mb-2">📋</p>
                    <p>No medication logs yet</p>
                  </div>
              ) : (
                  <div className="space-y-3">
                    {logs.map((log) => (
                        <div
                            key={log.id}
                            className="bg-white rounded-lg border border-gray-200 p-4"
                        >
                          <div className="flex justify-between items-start">
                            <div>
                              <p className="font-semibold text-gray-900">{log.medicationName}</p>
                              <p className="text-sm text-gray-600">{log.dosage}</p>
                              <p className="text-xs text-gray-400">{formatDate(log.timestamp)}</p>
                              {log.takenFor && (
                                  <p className="text-xs text-blue-600 mt-1">For: {log.takenFor}</p>
                              )}
                              {log.notes && (
                                  <p className="text-sm text-gray-500 mt-1 bg-gray-50 p-2 rounded">
                                    {log.notes}
                                  </p>
                              )}
                            </div>
                            <button
                                onClick={() => handleDeleteLog(log.id)}
                                className="text-gray-400 hover:text-red-500"
                            >
                              🗑️
                            </button>
                          </div>
                        </div>
                    ))}
                  </div>
              )}
            </div>
        )}

        {/* Add Medication Modal */}
        {showAddForm && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
              <div className="bg-white rounded-lg w-full max-w-md max-h-[90vh] overflow-y-auto">
                <div className="p-4 border-b border-gray-200">
                  <div className="flex justify-between items-center">
                    <h2 className="text-lg font-semibold text-gray-900">Add Medication</h2>
                    <button onClick={() => setShowAddForm(false)} className="text-gray-400 hover:text-gray-600 text-xl">
                      ✕
                    </button>
                  </div>
                </div>

                <form onSubmit={handleAddMedication} className="p-4 space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Medication Name <span className="text-red-500">*</span>
                    </label>
                    <input
                        type="text"
                        value={newMed.name}
                        onChange={(e) => setNewMed(prev => ({ ...prev, name: e.target.value }))}
                        placeholder="e.g., Ibuprofen, Gabapentin"
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                        autoFocus
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Dosage <span className="text-red-500">*</span>
                    </label>
                    <input
                        type="text"
                        value={newMed.dosage}
                        onChange={(e) => setNewMed(prev => ({ ...prev, dosage: e.target.value }))}
                        placeholder="e.g., 400mg, 1 tablet"
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Frequency</label>
                    <select
                        value={newMed.frequency}
                        onChange={(e) => setNewMed(prev => ({ ...prev, frequency: e.target.value }))}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="as-needed">As Needed (PRN)</option>
                      <option value="daily">Once Daily</option>
                      <option value="twice-daily">Twice Daily</option>
                      <option value="three-times">Three Times Daily</option>
                      <option value="four-times">Four Times Daily</option>
                      <option value="weekly">Weekly</option>
                      <option value="other">Other</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Prescribed For (optional)
                    </label>
                    <input
                        type="text"
                        value={newMed.forConditions}
                        onChange={(e) => setNewMed(prev => ({ ...prev, forConditions: e.target.value }))}
                        placeholder="e.g., Back pain, Anxiety (comma-separated)"
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Notes (optional)</label>
                    <textarea
                        value={newMed.notes}
                        onChange={(e) => setNewMed(prev => ({ ...prev, notes: e.target.value }))}
                        placeholder="e.g., Take with food"
                        rows={2}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div className="flex gap-2">
                    <button
                        type="button"
                        onClick={() => setShowAddForm(false)}
                        className="flex-1 py-2 px-4 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                    >
                      Cancel
                    </button>
                    <button
                        type="submit"
                        className="flex-1 py-3 px-4 bg-blue-900 text-white font-medium rounded-lg hover:bg-blue-800"
                    >
                      Add Medication
                    </button>
                  </div>
                </form>
              </div>
            </div>
        )}

        {/* Log Medication Modal */}
        {showLogForm && selectedMed && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
              <div className="bg-white rounded-lg w-full max-w-md">
                <div className="p-4 border-b border-gray-200">
                  <div className="flex justify-between items-center">
                    <div>
                      <h2 className="text-lg font-semibold text-gray-900">Log Medication</h2>
                      <p className="text-sm text-gray-500">{selectedMed.name} - {selectedMed.dosage}</p>
                    </div>
                    <button onClick={() => { setShowLogForm(false); setSelectedMed(null); }} className="text-gray-400 hover:text-gray-600 text-xl">
                      ✕
                    </button>
                  </div>
                </div>

                <form onSubmit={handleLogMedication} className="p-4 space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Taking it for (optional)
                    </label>
                    <input
                        type="text"
                        value={logData.takenFor}
                        onChange={(e) => setLogData(prev => ({ ...prev, takenFor: e.target.value }))}
                        placeholder="e.g., Migraine, Back pain flare-up"
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Notes (optional)</label>
                    <textarea
                        value={logData.notes}
                        onChange={(e) => setLogData(prev => ({ ...prev, notes: e.target.value }))}
                        placeholder="Any additional notes"
                        rows={2}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div className="flex gap-2">
                    <button
                        type="button"
                        onClick={() => { setShowLogForm(false); setSelectedMed(null); }}
                        className="flex-1 py-2 px-4 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                    >
                      Cancel
                    </button>
                    <button
                        type="submit"
                        className="flex-1 py-3 px-4 bg-blue-900 text-white font-medium rounded-lg hover:bg-blue-800"
                    >
                      Log Taken
                    </button>
                  </div>
                </form>
              </div>
            </div>
        )}
      </div>
  );
};

export default Medications;