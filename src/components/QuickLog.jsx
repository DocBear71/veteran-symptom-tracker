import { useState, useEffect } from 'react';
import { getChronicSymptoms, removeChronicSymptom, saveSymptomLog, getMedications, logMedicationTaken } from '../utils/storage';

const QuickLog = ({ onLogSaved, onAddChronic }) => {
  const [chronicSymptoms, setChronicSymptoms] = useState([]);
  const [medications, setMedications] = useState([]);
  const [showSuccess, setShowSuccess] = useState('');
  const [editMode, setEditMode] = useState(false);

  // Modal state
  const [selectedChronic, setSelectedChronic] = useState(null);
  const [logSeverity, setLogSeverity] = useState(5);
  const [logNotes, setLogNotes] = useState('');

  // Medication state
  const [selectedMedications, setSelectedMedications] = useState([]);

  // Condition-specific states
  const [migraineData, setMigraineData] = useState({
    duration: '',
    prostrating: null,
    aura: false,
    nausea: false,
    lightSensitivity: false,
    soundSensitivity: false,
    triggers: '',
  });

  const [sleepData, setSleepData] = useState({
    hoursSlept: '',
    quality: 5,
    wakeUps: '',
    troubleFallingAsleep: false,
    troubleStayingAsleep: false,
    nightmares: false,
    feelRested: null,
  });

  const [ptsdData, setPtsdData] = useState({
    flashbacks: false,
    avoidance: false,
    emotionalNumbering: false,
    hypervigilance: false,
    exaggeratedStartle: false,
    intrusiveThoughts: false,
    triggerDescription: '',
  });

  const [painData, setPainData] = useState({
    radiating: false,
    radiatingTo: '',
    limitedRangeOfMotion: false,
    affectedActivities: [],
    painType: '',
    flareUp: false,
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    setChronicSymptoms(getChronicSymptoms());
    setMedications(getMedications());
  };

  // Determine symptom type
  const isMigraine = selectedChronic?.symptomId === 'migraine';
  const isSleepRelated = ['sleep-issues', 'nightmares'].includes(selectedChronic?.symptomId);
  const isPTSDRelated = ['anxiety', 'hypervigilance', 'nightmares', 'irritability'].includes(selectedChronic?.symptomId);
  const isPainRelated = ['back-pain', 'neck-pain', 'knee-pain', 'shoulder-pain', 'hip-pain', 'joint-pain'].includes(selectedChronic?.symptomId);

  const handleOpenLogModal = (chronic) => {
    if (editMode) return;
    setSelectedChronic(chronic);
    setLogSeverity(chronic.defaultSeverity || 5);
    setLogNotes('');
    setSelectedMedications([]);

    // Reset condition-specific data
    setMigraineData({
      duration: '', prostrating: null, aura: false, nausea: false,
      lightSensitivity: false, soundSensitivity: false, triggers: '',
    });
    setSleepData({
      hoursSlept: '', quality: 5, wakeUps: '', troubleFallingAsleep: false,
      troubleStayingAsleep: false, nightmares: false, feelRested: null,
    });
    setPtsdData({
      flashbacks: false, avoidance: false, emotionalNumbering: false,
      hypervigilance: false, exaggeratedStartle: false, intrusiveThoughts: false,
      triggerDescription: '',
    });
    setPainData({
      radiating: false, radiatingTo: '', limitedRangeOfMotion: false,
      affectedActivities: [], painType: '', flareUp: false,
    });
  };

  const handleCloseModal = () => {
    setSelectedChronic(null);
    setLogSeverity(5);
    setLogNotes('');
    setSelectedMedications([]);
  };

  const handleConfirmLog = () => {
    if (!selectedChronic) return;

    // Validate migraine prostrating field
    if (isMigraine && migraineData.prostrating === null) {
      alert('Please indicate if this migraine was prostrating');
      return;
    }

    const entry = {
      symptomId: selectedChronic.symptomId,
      symptomName: selectedChronic.symptomName,
      category: selectedChronic.category,
      severity: logSeverity,
      notes: logNotes.trim(),
    };

    // Add condition-specific data
    if (isMigraine) {
      entry.migraineData = { ...migraineData };
    }
    if (isSleepRelated) {
      entry.sleepData = { ...sleepData };
    }
    if (isPTSDRelated) {
      entry.ptsdData = { ...ptsdData };
    }
    if (isPainRelated) {
      entry.painData = { ...painData };
    }

    const savedEntry = saveSymptomLog(entry);

    // Log medications if selected
    if (selectedMedications.length > 0) {
      selectedMedications.forEach(medId => {
        const med = medications.find(m => m.id === medId);
        if (med) {
          logMedicationTaken({
            medicationId: med.id,
            medicationName: med.name,
            dosage: med.dosage,
            takenFor: entry.symptomName,
            symptomLogId: savedEntry.id,
          });
        }
      });
    }

    // Show success
    setShowSuccess(selectedChronic.symptomId);
    setTimeout(() => setShowSuccess(''), 1500);

    handleCloseModal();
    if (onLogSaved) onLogSaved();
  };

  const handleRemoveChronic = (symptomId) => {
    removeChronicSymptom(symptomId);
    loadData();
  };

  const toggleActivity = (activity) => {
    setPainData(prev => ({
      ...prev,
      affectedActivities: prev.affectedActivities.includes(activity)
          ? prev.affectedActivities.filter(a => a !== activity)
          : [...prev.affectedActivities, activity]
    }));
  };

  const getSeverityColor = (severity) => {
    if (severity <= 2) return 'bg-green-500';
    if (severity <= 4) return 'bg-yellow-500';
    if (severity <= 6) return 'bg-orange-500';
    if (severity <= 8) return 'bg-red-500';
    return 'bg-red-700';
  };

  const getSeverityInfo = (value) => {
    if (value <= 2) return { label: 'Minimal', color: 'text-green-600 dark:text-green-400' };
    if (value <= 4) return { label: 'Mild', color: 'text-yellow-600 dark:text-yellow-400' };
    if (value <= 6) return { label: 'Moderate', color: 'text-orange-500 dark:text-orange-400' };
    if (value <= 8) return { label: 'Severe', color: 'text-red-500 dark:text-red-400' };
    return { label: 'Extreme', color: 'text-red-700 dark:text-red-300' };
  };

  if (chronicSymptoms.length === 0) {
    return (
        <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 mb-6">
          <h3 className="font-medium text-gray-700 dark:text-gray-300 mb-2">Quick Log</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">
            Add chronic symptoms for faster logging
          </p>
          <button
              onClick={onAddChronic}
              className="w-full py-2 px-4 border-2 border-dashed border-gray-300 dark:border-gray-600 text-gray-600 dark:text-gray-400 rounded-lg hover:border-blue-400 dark:hover:border-blue-500 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
          >
            + Add Your First Chronic Symptom
          </button>
        </div>
    );
  }

  const severityInfo = getSeverityInfo(logSeverity);
  const activeMedications = medications.filter(m => m.isActive);

  return (
      <>
        <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 mb-6">
          <div className="flex justify-between items-center mb-3">
            <h3 className="font-medium text-gray-700 dark:text-gray-300">Quick Log</h3>
            <button
                onClick={() => setEditMode(!editMode)}
                className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300"
            >
              {editMode ? 'Done' : 'Edit'}
            </button>
          </div>

          <div className="grid grid-cols-2 gap-2">
            {chronicSymptoms.map((chronic) => (
                <div key={chronic.symptomId} className="relative">
                  {/* Success overlay */}
                  {showSuccess === chronic.symptomId && (
                      <div className="absolute inset-0 bg-green-500 rounded-lg flex items-center justify-center z-10">
                        <span className="text-white font-medium">âœ“ Logged!</span>
                      </div>
                  )}

                  <div
                      className={`bg-white dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600 p-3 ${
                          editMode ? '' : 'hover:border-blue-400 dark:hover:border-blue-500 hover:shadow-sm cursor-pointer'
                      } transition-all`}
                      onClick={() => handleOpenLogModal(chronic)}
                  >
                    {/* Remove button in edit mode */}
                    {editMode && (
                        <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleRemoveChronic(chronic.symptomId);
                            }}
                            className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full text-sm hover:bg-red-600 z-10"
                        >
                          âœ•
                        </button>
                    )}

                    <p className="font-medium text-gray-900 dark:text-white text-sm truncate">
                      {chronic.symptomName}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">{chronic.category}</p>

                    <div className="flex items-center gap-2">
                      <div
                          className={`w-8 h-8 rounded-full ${getSeverityColor(
                              chronic.defaultSeverity || 5
                          )} flex items-center justify-center text-white font-bold text-sm`}
                      >
                        {chronic.defaultSeverity || 5}
                      </div>
                      <span className="text-xs text-gray-500 dark:text-gray-400">Tap to log</span>
                    </div>
                  </div>
                </div>
            ))}

            {/* Add more button */}
            {chronicSymptoms.length < 8 && (
                <button
                    onClick={onAddChronic}
                    className="bg-white dark:bg-gray-700 rounded-lg border-2 border-dashed border-gray-300 dark:border-gray-600 p-3 text-gray-400 dark:text-gray-500 hover:border-blue-400 dark:hover:border-blue-500 hover:text-blue-600 dark:hover:text-blue-400 transition-colors flex items-center justify-center min-h-[88px]"
                >
                  <span className="text-2xl">+</span>
                </button>
            )}
          </div>
        </div>

        {/* Enhanced Quick Log Modal */}
        {selectedChronic && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
              <div className="bg-white dark:bg-gray-800 rounded-lg w-full max-w-md max-h-[90vh] overflow-y-auto">
                <div className="p-4 border-b border-gray-200 dark:border-gray-700 sticky top-0 bg-white dark:bg-gray-800">
                  <div className="flex justify-between items-center">
                    <div>
                      <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                        {selectedChronic.symptomName}
                      </h2>
                      <p className="text-sm text-gray-500 dark:text-gray-400">{selectedChronic.category}</p>
                    </div>
                    <button
                        onClick={handleCloseModal}
                        className="text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 text-xl"
                    >
                      âœ•
                    </button>
                  </div>
                </div>

                <div className="p-4 space-y-4">
                  {/* Severity Slider */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Severity Level
                    </label>
                    <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                      <input
                          type="range"
                          min="0"
                          max="10"
                          value={logSeverity}
                          onChange={(e) => setLogSeverity(Number(e.target.value))}
                          className="w-full"
                      />
                      <div className="flex justify-between mt-2">
                        <span className="text-xs text-gray-500 dark:text-gray-400">0</span>
                        <span className={`text-lg font-bold ${severityInfo.color}`}>
                      {logSeverity} - {severityInfo.label}
                    </span>
                        <span className="text-xs text-gray-500 dark:text-gray-400">10</span>
                      </div>
                    </div>
                  </div>

                  {/* MIGRAINE-SPECIFIC FIELDS */}
                  {isMigraine && (
                      <div className="bg-purple-50 dark:bg-purple-900/30 p-4 rounded-lg border border-purple-200 dark:border-purple-800 space-y-4">
                        <h3 className="font-medium text-purple-900 dark:text-purple-200 text-sm">Migraine Details</h3>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Duration</label>
                          <select
                              value={migraineData.duration}
                              onChange={(e) => setMigraineData(prev => ({ ...prev, duration: e.target.value }))}
                              className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm"
                          >
                            <option value="">Select...</option>
                            <option value="less-than-1h">Less than 1 hour</option>
                            <option value="1-4h">1-4 hours</option>
                            <option value="4-24h">4-24 hours</option>
                            <option value="1-2d">1-2 days</option>
                            <option value="more-than-2d">More than 2 days</option>
                            <option value="ongoing">Still ongoing</option>
                          </select>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Prostrating? <span className="text-red-500">*</span>
                          </label>
                          <div className="flex gap-2">
                            <button
                                type="button"
                                onClick={() => setMigraineData(prev => ({ ...prev, prostrating: true }))}
                                className={`flex-1 py-2 px-3 rounded-lg border-2 text-sm font-medium ${
                                    migraineData.prostrating === true
                                        ? 'bg-red-100 dark:bg-red-900/50 border-red-500 text-red-700 dark:text-red-300'
                                        : 'bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300'
                                }`}
                            >
                              Yes
                            </button>
                            <button
                                type="button"
                                onClick={() => setMigraineData(prev => ({ ...prev, prostrating: false }))}
                                className={`flex-1 py-2 px-3 rounded-lg border-2 text-sm font-medium ${
                                    migraineData.prostrating === false
                                        ? 'bg-green-100 dark:bg-green-900/50 border-green-500 text-green-700 dark:text-green-300'
                                        : 'bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300'
                                }`}
                            >
                              No
                            </button>
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-2">
                          {[
                            { key: 'aura', label: 'Aura' },
                            { key: 'nausea', label: 'Nausea' },
                            { key: 'lightSensitivity', label: 'Light' },
                            { key: 'soundSensitivity', label: 'Sound' },
                          ].map(({ key, label }) => (
                              <label
                                  key={key}
                                  className={`flex items-center gap-2 p-2 rounded-lg border cursor-pointer text-sm ${
                                      migraineData[key]
                                          ? 'bg-purple-100 dark:bg-purple-900/50 border-purple-300 dark:border-purple-700'
                                          : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700'
                                  }`}
                              >
                                <input
                                    type="checkbox"
                                    checked={migraineData[key]}
                                    onChange={(e) => setMigraineData(prev => ({ ...prev, [key]: e.target.checked }))}
                                    className="w-4 h-4 text-purple-600 rounded"
                                />
                                <span className="text-gray-700 dark:text-gray-300">{label}</span>
                              </label>
                          ))}
                        </div>
                      </div>
                  )}

                  {/* SLEEP-SPECIFIC FIELDS */}
                  {isSleepRelated && (
                      <div className="bg-indigo-50 dark:bg-indigo-900/30 p-4 rounded-lg border border-indigo-200 dark:border-indigo-800 space-y-4">
                        <h3 className="font-medium text-indigo-900 dark:text-indigo-200 text-sm">Sleep Details</h3>

                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">Hours Slept</label>
                            <input
                                type="number"
                                min="0"
                                max="24"
                                step="0.5"
                                value={sleepData.hoursSlept}
                                onChange={(e) => setSleepData(prev => ({ ...prev, hoursSlept: e.target.value }))}
                                placeholder="Hrs"
                                className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm"
                            />
                          </div>
                          <div>
                            <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">Woke Up</label>
                            <input
                                type="number"
                                min="0"
                                max="20"
                                value={sleepData.wakeUps}
                                onChange={(e) => setSleepData(prev => ({ ...prev, wakeUps: e.target.value }))}
                                placeholder="Times"
                                className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm"
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-1 gap-2">
                          {[
                            { key: 'troubleFallingAsleep', label: 'Trouble falling asleep' },
                            { key: 'troubleStayingAsleep', label: 'Trouble staying asleep' },
                            { key: 'nightmares', label: 'Nightmares' },
                          ].map(({ key, label }) => (
                              <label
                                  key={key}
                                  className={`flex items-center gap-2 p-2 rounded-lg border cursor-pointer text-sm ${
                                      sleepData[key]
                                          ? 'bg-indigo-100 dark:bg-indigo-900/50 border-indigo-300 dark:border-indigo-700'
                                          : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700'
                                  }`}
                              >
                                <input
                                    type="checkbox"
                                    checked={sleepData[key]}
                                    onChange={(e) => setSleepData(prev => ({ ...prev, [key]: e.target.checked }))}
                                    className="w-4 h-4 text-indigo-600 rounded"
                                />
                                <span className="text-gray-700 dark:text-gray-300">{label}</span>
                              </label>
                          ))}
                        </div>

                        <div>
                          <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-2">Feel rested?</label>
                          <div className="flex gap-2">
                            <button
                                type="button"
                                onClick={() => setSleepData(prev => ({ ...prev, feelRested: true }))}
                                className={`flex-1 py-2 px-3 rounded-lg border-2 text-sm font-medium ${
                                    sleepData.feelRested === true
                                        ? 'bg-green-100 dark:bg-green-900/50 border-green-500 text-green-700 dark:text-green-300'
                                        : 'bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300'
                                }`}
                            >
                              Yes
                            </button>
                            <button
                                type="button"
                                onClick={() => setSleepData(prev => ({ ...prev, feelRested: false }))}
                                className={`flex-1 py-2 px-3 rounded-lg border-2 text-sm font-medium ${
                                    sleepData.feelRested === false
                                        ? 'bg-red-100 dark:bg-red-900/50 border-red-500 text-red-700 dark:text-red-300'
                                        : 'bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300'
                                }`}
                            >
                              No
                            </button>
                          </div>
                        </div>
                      </div>
                  )}

                  {/* PTSD-SPECIFIC FIELDS */}
                  {isPTSDRelated && (
                      <div className="bg-amber-50 dark:bg-amber-900/30 p-4 rounded-lg border border-amber-200 dark:border-amber-800 space-y-4">
                        <h3 className="font-medium text-amber-900 dark:text-amber-200 text-sm">Mental Health Details</h3>

                        <div className="grid grid-cols-2 gap-2">
                          {[
                            { key: 'flashbacks', label: 'Flashbacks' },
                            { key: 'intrusiveThoughts', label: 'Intrusive thoughts' },
                            { key: 'avoidance', label: 'Avoidance' },
                            { key: 'hypervigilance', label: 'Hypervigilance' },
                            { key: 'emotionalNumbering', label: 'Numbness' },
                            { key: 'exaggeratedStartle', label: 'Startle' },
                          ].map(({ key, label }) => (
                              <label
                                  key={key}
                                  className={`flex items-center gap-2 p-2 rounded-lg border cursor-pointer text-sm ${
                                      ptsdData[key]
                                          ? 'bg-amber-100 dark:bg-amber-900/50 border-amber-300 dark:border-amber-700'
                                          : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700'
                                  }`}
                              >
                                <input
                                    type="checkbox"
                                    checked={ptsdData[key]}
                                    onChange={(e) => setPtsdData(prev => ({ ...prev, [key]: e.target.checked }))}
                                    className="w-4 h-4 text-amber-600 rounded"
                                />
                                <span className="text-gray-700 dark:text-gray-300">{label}</span>
                              </label>
                          ))}
                        </div>

                        <div>
                          <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">Trigger</label>
                          <input
                              type="text"
                              value={ptsdData.triggerDescription}
                              onChange={(e) => setPtsdData(prev => ({ ...prev, triggerDescription: e.target.value }))}
                              placeholder="What triggered this?"
                              className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm"
                          />
                        </div>
                      </div>
                  )}

                  {/* PAIN-SPECIFIC FIELDS */}
                  {isPainRelated && (
                      <div className="bg-rose-50 dark:bg-rose-900/30 p-4 rounded-lg border border-rose-200 dark:border-rose-800 space-y-4">
                        <h3 className="font-medium text-rose-900 dark:text-rose-200 text-sm">Pain Details</h3>

                        <div>
                          <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">Pain Type</label>
                          <select
                              value={painData.painType}
                              onChange={(e) => setPainData(prev => ({ ...prev, painType: e.target.value }))}
                              className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm"
                          >
                            <option value="">Select...</option>
                            <option value="sharp">Sharp/Stabbing</option>
                            <option value="dull">Dull/Aching</option>
                            <option value="burning">Burning</option>
                            <option value="throbbing">Throbbing</option>
                            <option value="shooting">Shooting</option>
                            <option value="stiff">Stiffness</option>
                          </select>
                        </div>

                        <div className="grid grid-cols-2 gap-2">
                          <label
                              className={`flex items-center gap-2 p-2 rounded-lg border cursor-pointer text-sm ${
                                  painData.radiating
                                      ? 'bg-rose-100 dark:bg-rose-900/50 border-rose-300 dark:border-rose-700'
                                      : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700'
                              }`}
                          >
                            <input
                                type="checkbox"
                                checked={painData.radiating}
                                onChange={(e) => setPainData(prev => ({ ...prev, radiating: e.target.checked }))}
                                className="w-4 h-4 text-rose-600 rounded"
                            />
                            <span className="text-gray-700 dark:text-gray-300">Radiating</span>
                          </label>
                          <label
                              className={`flex items-center gap-2 p-2 rounded-lg border cursor-pointer text-sm ${
                                  painData.flareUp
                                      ? 'bg-rose-100 dark:bg-rose-900/50 border-rose-300 dark:border-rose-700'
                                      : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700'
                              }`}
                          >
                            <input
                                type="checkbox"
                                checked={painData.flareUp}
                                onChange={(e) => setPainData(prev => ({ ...prev, flareUp: e.target.checked }))}
                                className="w-4 h-4 text-rose-600 rounded"
                            />
                            <span className="text-gray-700 dark:text-gray-300">Flare-up</span>
                          </label>
                        </div>

                        {painData.radiating && (
                            <input
                                type="text"
                                value={painData.radiatingTo}
                                onChange={(e) => setPainData(prev => ({ ...prev, radiatingTo: e.target.value }))}
                                placeholder="Radiates to..."
                                className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm"
                            />
                        )}

                        <label
                            className={`flex items-center gap-2 p-2 rounded-lg border cursor-pointer text-sm ${
                                painData.limitedRangeOfMotion
                                    ? 'bg-rose-100 dark:bg-rose-900/50 border-rose-300 dark:border-rose-700'
                                    : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700'
                            }`}
                        >
                          <input
                              type="checkbox"
                              checked={painData.limitedRangeOfMotion}
                              onChange={(e) => setPainData(prev => ({ ...prev, limitedRangeOfMotion: e.target.checked }))}
                              className="w-4 h-4 text-rose-600 rounded"
                          />
                          <span className="text-gray-700 dark:text-gray-300">Limited range of motion</span>
                        </label>

                        <div>
                          <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-2">Activities Affected</label>
                          <div className="grid grid-cols-4 gap-1">
                            {['Walking', 'Standing', 'Sitting', 'Sleeping', 'Lifting', 'Bending', 'Driving', 'Working'].map(activity => (
                                <label
                                    key={activity}
                                    className={`flex items-center justify-center p-2 rounded-lg border cursor-pointer text-xs ${
                                        painData.affectedActivities.includes(activity)
                                            ? 'bg-rose-100 dark:bg-rose-900/50 border-rose-300 dark:border-rose-700'
                                            : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700'
                                    }`}
                                >
                                  <input
                                      type="checkbox"
                                      checked={painData.affectedActivities.includes(activity)}
                                      onChange={() => toggleActivity(activity)}
                                      className="sr-only"
                                  />
                                  <span className="text-gray-700 dark:text-gray-300">{activity}</span>
                                </label>
                            ))}
                          </div>
                        </div>
                      </div>
                  )}

                  {/* Medications */}
                  {activeMedications.length > 0 && (
                      <div className="bg-teal-50 dark:bg-teal-900/30 p-4 rounded-lg border border-teal-200 dark:border-teal-800">
                        <h3 className="font-medium text-teal-900 dark:text-teal-200 text-sm mb-3">Medications Taken</h3>
                        <div className="space-y-2">
                          {activeMedications.map(med => (
                              <label
                                  key={med.id}
                                  className={`flex items-center gap-2 p-2 rounded-lg border cursor-pointer text-sm ${
                                      selectedMedications.includes(med.id)
                                          ? 'bg-teal-100 dark:bg-teal-900/50 border-teal-400 dark:border-teal-600'
                                          : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700'
                                  }`}
                              >
                                <input
                                    type="checkbox"
                                    checked={selectedMedications.includes(med.id)}
                                    onChange={(e) => {
                                      if (e.target.checked) {
                                        setSelectedMedications(prev => [...prev, med.id]);
                                      } else {
                                        setSelectedMedications(prev => prev.filter(id => id !== med.id));
                                      }
                                    }}
                                    className="w-4 h-4 text-teal-600 rounded"
                                />
                                <span className="text-gray-700 dark:text-gray-300">
                          {med.name} ({med.dosage})
                        </span>
                              </label>
                          ))}
                        </div>
                      </div>
                  )}

                  {/* Notes */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Notes (optional)
                    </label>
                    <textarea
                        value={logNotes}
                        onChange={(e) => setLogNotes(e.target.value)}
                        placeholder="What were you doing? Any triggers?"
                        rows={2}
                        className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                </div>

                <div className="p-4 border-t border-gray-200 dark:border-gray-700 flex gap-2 sticky bottom-0 bg-white dark:bg-gray-800">
                  <button
                      onClick={handleCloseModal}
                      className="flex-1 py-2 px-4 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700"
                  >
                    Cancel
                  </button>
                  <button
                      onClick={handleConfirmLog}
                      className="flex-1 py-3 px-4 bg-blue-900 dark:bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-800 dark:hover:bg-blue-700"
                  >
                    Log Symptom
                  </button>
                </div>
              </div>
            </div>
        )}
      </>
  );
};

export default QuickLog;