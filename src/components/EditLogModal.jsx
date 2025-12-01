import { useState, useEffect } from 'react';
import { updateSymptomLog, getMedications, logMedicationTaken, getMedicationLogsForSymptom, deleteMedicationLog } from '../utils/storage';

const EditLogModal = ({ log, isOpen, onClose, onSaved }) => {
  const [severity, setSeverity] = useState(5);
  const [notes, setNotes] = useState('');
  const [medications, setMedications] = useState([]);
  const [selectedMedications, setSelectedMedications] = useState([]);
  const [existingMedLogs, setExistingMedLogs] = useState([]);

  // Migraine-specific fields
  const [migraineData, setMigraineData] = useState({
    duration: '', prostrating: null, aura: false, nausea: false,
    lightSensitivity: false, soundSensitivity: false, triggers: '',
  });

  // Sleep-specific fields
  const [sleepData, setSleepData] = useState({
    hoursSlept: '', quality: 5, wakeUps: '', troubleFallingAsleep: false,
    troubleStayingAsleep: false, nightmares: false, feelRested: null,
  });

  // PTSD-specific fields
  const [ptsdData, setPtsdData] = useState({
    flashbacks: false, avoidance: false, emotionalNumbering: false,
    hypervigilance: false, exaggeratedStartle: false, intrusiveThoughts: false,
    triggerDescription: '',
  });

  // Pain-specific fields
  const [painData, setPainData] = useState({
    painLocation: '', radiating: false, radiatingTo: '',
    limitedRangeOfMotion: false, affectedActivities: [], painType: '', flareUp: false,
  });

  useEffect(() => {
    if (isOpen && log) {
      setSeverity(log.severity || 5);
      setNotes(log.notes || '');
      setMedications(getMedications());

      // Get existing medication logs for this symptom
      const existingMeds = getMedicationLogsForSymptom(log.id);
      setExistingMedLogs(existingMeds);
      setSelectedMedications(existingMeds.map(m => m.medicationId));

      // Load condition-specific data
      if (log.migraineData) {
        setMigraineData(log.migraineData);
      } else {
        setMigraineData({
          duration: '', prostrating: null, aura: false, nausea: false,
          lightSensitivity: false, soundSensitivity: false, triggers: '',
        });
      }

      if (log.sleepData) {
        setSleepData(log.sleepData);
      } else {
        setSleepData({
          hoursSlept: '', quality: 5, wakeUps: '', troubleFallingAsleep: false,
          troubleStayingAsleep: false, nightmares: false, feelRested: null,
        });
      }

      if (log.ptsdData) {
        setPtsdData(log.ptsdData);
      } else {
        setPtsdData({
          flashbacks: false, avoidance: false, emotionalNumbering: false,
          hypervigilance: false, exaggeratedStartle: false, intrusiveThoughts: false,
          triggerDescription: '',
        });
      }

      if (log.painData) {
        setPainData(log.painData);
      } else {
        setPainData({
          painLocation: '', radiating: false, radiatingTo: '',
          limitedRangeOfMotion: false, affectedActivities: [], painType: '', flareUp: false,
        });
      }
    }
  }, [isOpen, log]);

  const isMigraine = log?.symptomId === 'migraine';
  const isSleepRelated = ['sleep-issues', 'nightmares'].includes(log?.symptomId);
  const isPTSDRelated = ['anxiety', 'hypervigilance', 'nightmares', 'irritability'].includes(log?.symptomId);
  const isPainRelated = ['back-pain', 'neck-pain', 'knee-pain', 'shoulder-pain', 'hip-pain', 'joint-pain'].includes(log?.symptomId);

  const handleSave = () => {
    if (isMigraine && migraineData.prostrating === null) {
      alert('Please indicate if this migraine was prostrating');
      return;
    }

    const updates = {
      severity,
      notes: notes.trim(),
    };

    if (isMigraine) updates.migraineData = migraineData;
    if (isSleepRelated) updates.sleepData = sleepData;
    if (isPTSDRelated) updates.ptsdData = ptsdData;
    if (isPainRelated) updates.painData = painData;

    const result = updateSymptomLog(log.id, updates);

    if (result.success) {
      // Handle medication changes
      const existingMedIds = existingMedLogs.map(m => m.medicationId);

      // Delete removed medications
      existingMedLogs.forEach(medLog => {
        if (!selectedMedications.includes(medLog.medicationId)) {
          deleteMedicationLog(medLog.id);
        }
      });

      // Add new medications
      selectedMedications.forEach(medId => {
        if (!existingMedIds.includes(medId)) {
          const med = medications.find(m => m.id === medId);
          if (med) {
            logMedicationTaken({
              medicationId: med.id,
              medicationName: med.name,
              dosage: med.dosage,
              takenFor: log.symptomName,
              symptomLogId: log.id,
            });
          }
        }
      });

      onSaved();
      onClose();
    } else {
      alert(result.message);
    }
  };

  const toggleActivity = (activity) => {
    setPainData(prev => ({
      ...prev,
      affectedActivities: prev.affectedActivities.includes(activity)
          ? prev.affectedActivities.filter(a => a !== activity)
          : [...prev.affectedActivities, activity]
    }));
  };

  const getSeverityInfo = (value) => {
    if (value <= 2) return { label: 'Minimal', color: 'text-green-600' };
    if (value <= 4) return { label: 'Mild', color: 'text-yellow-600' };
    if (value <= 6) return { label: 'Moderate', color: 'text-orange-500' };
    if (value <= 8) return { label: 'Severe', color: 'text-red-500' };
    return { label: 'Extreme', color: 'text-red-700' };
  };

  if (!isOpen || !log) return null;

  const severityInfo = getSeverityInfo(severity);
  const logDate = new Date(log.timestamp).toLocaleDateString('en-US', {
    weekday: 'short', month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit',
  });

  return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-lg w-full max-w-md max-h-[90vh] overflow-y-auto">
          <div className="p-4 border-b border-gray-200 sticky top-0 bg-white">
            <div className="flex justify-between items-start">
              <div>
                <h2 className="text-lg font-semibold text-gray-900">Edit Entry</h2>
                <p className="text-sm text-gray-500">{log.symptomName}</p>
                <p className="text-xs text-gray-400">{logDate}</p>
              </div>
              <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-xl">✕</button>
            </div>
          </div>

          <div className="p-4 space-y-4">
            {/* Severity Slider */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Severity Level</label>
              <div className="bg-gray-50 p-4 rounded-lg">
                <input type="range" min="0" max="10" value={severity}
                       onChange={(e) => setSeverity(Number(e.target.value))} className="w-full" />
                <div className="flex justify-between mt-2">
                  <span className="text-xs text-gray-500">0</span>
                  <span className={`text-lg font-bold ${severityInfo.color}`}>
                  {severity} - {severityInfo.label}
                </span>
                  <span className="text-xs text-gray-500">10</span>
                </div>
              </div>
            </div>

            {/* Migraine Fields */}
            {isMigraine && (
                <div className="bg-purple-50 p-4 rounded-lg border border-purple-200 space-y-4">
                  <h3 className="font-medium text-purple-900">Migraine Details</h3>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Duration</label>
                    <select value={migraineData.duration}
                            onChange={(e) => setMigraineData(prev => ({ ...prev, duration: e.target.value }))}
                            className="w-full p-2 border border-gray-300 rounded-lg">
                      <option value="">Select duration...</option>
                      <option value="less-than-1h">Less than 1 hour</option>
                      <option value="1-4h">1-4 hours</option>
                      <option value="4-24h">4-24 hours</option>
                      <option value="1-2d">1-2 days</option>
                      <option value="more-than-2d">More than 2 days</option>
                      <option value="ongoing">Still ongoing</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Was this migraine prostrating? <span className="text-red-500">*</span>
                    </label>
                    <div className="flex gap-3">
                      <button type="button"
                              onClick={() => setMigraineData(prev => ({ ...prev, prostrating: true }))}
                              className={`flex-1 py-2 px-4 rounded-lg border-2 font-medium ${
                                  migraineData.prostrating === true
                                      ? 'bg-red-100 border-red-500 text-red-700'
                                      : 'bg-white border-gray-300 text-gray-700'
                              }`}>Yes</button>
                      <button type="button"
                              onClick={() => setMigraineData(prev => ({ ...prev, prostrating: false }))}
                              className={`flex-1 py-2 px-4 rounded-lg border-2 font-medium ${
                                  migraineData.prostrating === false
                                      ? 'bg-green-100 border-green-500 text-green-700'
                                      : 'bg-white border-gray-300 text-gray-700'
                              }`}>No</button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Associated Symptoms</label>
                    <div className="grid grid-cols-2 gap-2">
                      {[
                        { key: 'aura', label: 'Aura' },
                        { key: 'nausea', label: 'Nausea' },
                        { key: 'lightSensitivity', label: 'Light sensitivity' },
                        { key: 'soundSensitivity', label: 'Sound sensitivity' },
                      ].map(({ key, label }) => (
                          <label key={key} className={`flex items-center gap-2 p-2 rounded-lg border cursor-pointer ${
                              migraineData[key] ? 'bg-purple-100 border-purple-300' : 'bg-white border-gray-200'
                          }`}>
                            <input type="checkbox" checked={migraineData[key]}
                                   onChange={(e) => setMigraineData(prev => ({ ...prev, [key]: e.target.checked }))}
                                   className="w-4 h-4 text-purple-600 rounded" />
                            <span className="text-sm text-gray-700">{label}</span>
                          </label>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Known Triggers</label>
                    <input type="text" value={migraineData.triggers}
                           onChange={(e) => setMigraineData(prev => ({ ...prev, triggers: e.target.value }))}
                           placeholder="e.g., stress, bright lights"
                           className="w-full p-2 border border-gray-300 rounded-lg" />
                  </div>
                </div>
            )}

            {/* Sleep Fields */}
            {isSleepRelated && (
                <div className="bg-indigo-50 p-4 rounded-lg border border-indigo-200 space-y-4">
                  <h3 className="font-medium text-indigo-900">Sleep Details</h3>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Hours Slept</label>
                      <input type="number" min="0" max="24" step="0.5"
                             value={sleepData.hoursSlept}
                             onChange={(e) => setSleepData(prev => ({ ...prev, hoursSlept: e.target.value }))}
                             className="w-full p-2 border border-gray-300 rounded-lg" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Times Woken Up</label>
                      <input type="number" min="0" max="20"
                             value={sleepData.wakeUps}
                             onChange={(e) => setSleepData(prev => ({ ...prev, wakeUps: e.target.value }))}
                             className="w-full p-2 border border-gray-300 rounded-lg" />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Sleep Quality: {sleepData.quality}/10</label>
                    <input type="range" min="0" max="10" value={sleepData.quality}
                           onChange={(e) => setSleepData(prev => ({ ...prev, quality: Number(e.target.value) }))}
                           className="w-full" />
                  </div>

                  <div className="grid grid-cols-1 gap-2">
                    {[
                      { key: 'troubleFallingAsleep', label: 'Trouble falling asleep' },
                      { key: 'troubleStayingAsleep', label: 'Trouble staying asleep' },
                      { key: 'nightmares', label: 'Nightmares/night terrors' },
                    ].map(({ key, label }) => (
                        <label key={key} className={`flex items-center gap-2 p-2 rounded-lg border cursor-pointer ${
                            sleepData[key] ? 'bg-indigo-100 border-indigo-300' : 'bg-white border-gray-200'
                        }`}>
                          <input type="checkbox" checked={sleepData[key]}
                                 onChange={(e) => setSleepData(prev => ({ ...prev, [key]: e.target.checked }))}
                                 className="w-4 h-4 text-indigo-600 rounded" />
                          <span className="text-sm text-gray-700">{label}</span>
                        </label>
                    ))}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Feel rested?</label>
                    <div className="flex gap-3">
                      <button type="button"
                              onClick={() => setSleepData(prev => ({ ...prev, feelRested: true }))}
                              className={`flex-1 py-2 px-4 rounded-lg border-2 font-medium ${
                                  sleepData.feelRested === true
                                      ? 'bg-green-100 border-green-500 text-green-700'
                                      : 'bg-white border-gray-300 text-gray-700'
                              }`}>Yes</button>
                      <button type="button"
                              onClick={() => setSleepData(prev => ({ ...prev, feelRested: false }))}
                              className={`flex-1 py-2 px-4 rounded-lg border-2 font-medium ${
                                  sleepData.feelRested === false
                                      ? 'bg-red-100 border-red-500 text-red-700'
                                      : 'bg-white border-gray-300 text-gray-700'
                              }`}>No</button>
                    </div>
                  </div>
                </div>
            )}

            {/* PTSD Fields */}
            {isPTSDRelated && (
                <div className="bg-amber-50 p-4 rounded-lg border border-amber-200 space-y-4">
                  <h3 className="font-medium text-amber-900">Mental Health Details</h3>

                  <div className="grid grid-cols-1 gap-2">
                    {[
                      { key: 'flashbacks', label: 'Flashbacks' },
                      { key: 'intrusiveThoughts', label: 'Intrusive thoughts' },
                      { key: 'avoidance', label: 'Avoidance' },
                      { key: 'emotionalNumbering', label: 'Emotional numbness' },
                      { key: 'hypervigilance', label: 'Hypervigilance' },
                      { key: 'exaggeratedStartle', label: 'Startle response' },
                    ].map(({ key, label }) => (
                        <label key={key} className={`flex items-center gap-2 p-2 rounded-lg border cursor-pointer ${
                            ptsdData[key] ? 'bg-amber-100 border-amber-300' : 'bg-white border-gray-200'
                        }`}>
                          <input type="checkbox" checked={ptsdData[key]}
                                 onChange={(e) => setPtsdData(prev => ({ ...prev, [key]: e.target.checked }))}
                                 className="w-4 h-4 text-amber-600 rounded" />
                          <span className="text-sm text-gray-700">{label}</span>
                        </label>
                    ))}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Trigger</label>
                    <input type="text" value={ptsdData.triggerDescription}
                           onChange={(e) => setPtsdData(prev => ({ ...prev, triggerDescription: e.target.value }))}
                           placeholder="What triggered this?"
                           className="w-full p-2 border border-gray-300 rounded-lg" />
                  </div>
                </div>
            )}

            {/* Pain Fields */}
            {isPainRelated && (
                <div className="bg-rose-50 p-4 rounded-lg border border-rose-200 space-y-4">
                  <h3 className="font-medium text-rose-900">Pain Details</h3>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Pain Type</label>
                    <select value={painData.painType}
                            onChange={(e) => setPainData(prev => ({ ...prev, painType: e.target.value }))}
                            className="w-full p-2 border border-gray-300 rounded-lg">
                      <option value="">Select type...</option>
                      <option value="sharp">Sharp/Stabbing</option>
                      <option value="dull">Dull/Aching</option>
                      <option value="burning">Burning</option>
                      <option value="throbbing">Throbbing</option>
                      <option value="shooting">Shooting</option>
                      <option value="stiff">Stiffness</option>
                    </select>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <label className={`flex items-center gap-2 p-2 rounded-lg border cursor-pointer ${
                        painData.radiating ? 'bg-rose-100 border-rose-300' : 'bg-white border-gray-200'
                    }`}>
                      <input type="checkbox" checked={painData.radiating}
                             onChange={(e) => setPainData(prev => ({ ...prev, radiating: e.target.checked }))}
                             className="w-4 h-4 text-rose-600 rounded" />
                      <span className="text-sm text-gray-700">Radiating</span>
                    </label>
                    <label className={`flex items-center gap-2 p-2 rounded-lg border cursor-pointer ${
                        painData.flareUp ? 'bg-rose-100 border-rose-300' : 'bg-white border-gray-200'
                    }`}>
                      <input type="checkbox" checked={painData.flareUp}
                             onChange={(e) => setPainData(prev => ({ ...prev, flareUp: e.target.checked }))}
                             className="w-4 h-4 text-rose-600 rounded" />
                      <span className="text-sm text-gray-700">Flare-up</span>
                    </label>
                  </div>

                  {painData.radiating && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Radiates to</label>
                        <input type="text" value={painData.radiatingTo}
                               onChange={(e) => setPainData(prev => ({ ...prev, radiatingTo: e.target.value }))}
                               placeholder="e.g., down left leg"
                               className="w-full p-2 border border-gray-300 rounded-lg" />
                      </div>
                  )}

                  <label className={`flex items-center gap-2 p-3 rounded-lg border cursor-pointer ${
                      painData.limitedRangeOfMotion ? 'bg-rose-100 border-rose-300' : 'bg-white border-gray-200'
                  }`}>
                    <input type="checkbox" checked={painData.limitedRangeOfMotion}
                           onChange={(e) => setPainData(prev => ({ ...prev, limitedRangeOfMotion: e.target.checked }))}
                           className="w-4 h-4 text-rose-600 rounded" />
                    <span className="text-sm text-gray-700">Limited range of motion</span>
                  </label>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Activities Affected</label>
                    <div className="grid grid-cols-2 gap-2">
                      {['Walking', 'Standing', 'Sitting', 'Sleeping', 'Lifting', 'Bending', 'Driving', 'Working'].map(activity => (
                          <label key={activity} className={`flex items-center gap-2 p-2 rounded-lg border cursor-pointer ${
                              painData.affectedActivities.includes(activity) ? 'bg-rose-100 border-rose-300' : 'bg-white border-gray-200'
                          }`}>
                            <input type="checkbox" checked={painData.affectedActivities.includes(activity)}
                                   onChange={() => toggleActivity(activity)}
                                   className="w-4 h-4 text-rose-600 rounded" />
                            <span className="text-sm text-gray-700">{activity}</span>
                          </label>
                      ))}
                    </div>
                  </div>
                </div>
            )}

            {/* Medications */}
            {medications.length > 0 && (
                <div className="bg-teal-50 p-4 rounded-lg border border-teal-200">
                  <h3 className="font-medium text-teal-900 mb-3">Medications Taken</h3>
                  <div className="space-y-2">
                    {medications.filter(m => m.isActive).map(med => (
                        <label key={med.id} className={`flex items-center gap-2 p-2 rounded-lg border cursor-pointer ${
                            selectedMedications.includes(med.id)
                                ? 'bg-teal-100 border-teal-400'
                                : 'bg-white border-gray-200'
                        }`}>
                          <input type="checkbox" checked={selectedMedications.includes(med.id)}
                                 onChange={(e) => {
                                   if (e.target.checked) {
                                     setSelectedMedications(prev => [...prev, med.id]);
                                   } else {
                                     setSelectedMedications(prev => prev.filter(id => id !== med.id));
                                   }
                                 }}
                                 className="w-4 h-4 text-teal-600 rounded" />
                          <span className="text-sm text-gray-700">{med.name} ({med.dosage})</span>
                        </label>
                    ))}
                  </div>
                </div>
            )}

            {/* Notes */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Notes</label>
              <textarea value={notes} onChange={(e) => setNotes(e.target.value)}
                        placeholder="Additional notes..."
                        rows={3}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" />
            </div>
          </div>

          <div className="p-4 border-t border-gray-200 flex gap-2 sticky bottom-0 bg-white">
            <button onClick={onClose}
                    className="flex-1 py-2 px-4 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50">
              Cancel
            </button>
            <button onClick={handleSave}
                    className="flex-1 py-3 px-4 bg-blue-900 text-white font-semibold rounded-lg hover:bg-blue-800">
              Save Changes
            </button>
          </div>
        </div>
      </div>
  );
};

export default EditLogModal;