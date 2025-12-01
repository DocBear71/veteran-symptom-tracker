import { useState, useEffect } from 'react';
import { symptomCategories } from '../data/symptoms';
import { getCustomSymptoms, updateSymptomLog } from '../utils/storage';

const EditLogModal = ({ log, isOpen, onClose, onSaved }) => {
  const [severity, setSeverity] = useState(5);
  const [notes, setNotes] = useState('');
  const [customSymptoms, setCustomSymptoms] = useState([]);

  // Migraine-specific fields
  const [migraineData, setMigraineData] = useState({
    duration: '',
    prostrating: null,
    aura: false,
    nausea: false,
    lightSensitivity: false,
    soundSensitivity: false,
    triggers: '',
  });

  useEffect(() => {
    if (isOpen && log) {
      setSeverity(log.severity || 5);
      setNotes(log.notes || '');
      setCustomSymptoms(getCustomSymptoms());

      if (log.migraineData) {
        setMigraineData(log.migraineData);
      } else {
        setMigraineData({
          duration: '',
          prostrating: null,
          aura: false,
          nausea: false,
          lightSensitivity: false,
          soundSensitivity: false,
          triggers: '',
        });
      }
    }
  }, [isOpen, log]);

  const isMigraine = log?.symptomId === 'migraine';

  const handleSave = () => {
    if (isMigraine && migraineData.prostrating === null) {
      alert('Please indicate if this migraine was prostrating');
      return;
    }

    const updates = {
      severity,
      notes: notes.trim(),
    };

    if (isMigraine) {
      updates.migraineData = migraineData;
    }

    const result = updateSymptomLog(log.id, updates);

    if (result.success) {
      onSaved();
      onClose();
    } else {
      alert(result.message);
    }
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
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  });

  return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-lg w-full max-w-md max-h-[90vh] overflow-y-auto">
          <div className="p-4 border-b border-gray-200">
            <div className="flex justify-between items-start">
              <div>
                <h2 className="text-lg font-semibold text-gray-900">Edit Entry</h2>
                <p className="text-sm text-gray-500">{log.symptomName}</p>
                <p className="text-xs text-gray-400">{logDate}</p>
              </div>
              <button
                  onClick={onClose}
                  className="text-gray-400 hover:text-gray-600 text-xl"
              >
                ✕
              </button>
            </div>
          </div>

          <div className="p-4 space-y-4">
            {/* Severity Slider */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Severity Level
              </label>
              <div className="bg-gray-50 p-4 rounded-lg">
                <input
                    type="range"
                    min="0"
                    max="10"
                    value={severity}
                    onChange={(e) => setSeverity(Number(e.target.value))}
                    className="w-full"
                />
                <div className="flex justify-between mt-2">
                  <span className="text-xs text-gray-500">0</span>
                  <span className={`text-lg font-bold ${severityInfo.color}`}>
                  {severity} - {severityInfo.label}
                </span>
                  <span className="text-xs text-gray-500">10</span>
                </div>
              </div>
            </div>

            {/* Migraine-Specific Fields */}
            {isMigraine && (
                <div className="bg-purple-50 p-4 rounded-lg border border-purple-200 space-y-4">
                  <h3 className="font-medium text-purple-900">Migraine Details</h3>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Duration
                    </label>
                    <select
                        value={migraineData.duration}
                        onChange={(e) => setMigraineData(prev => ({ ...prev, duration: e.target.value }))}
                        className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                    >
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
                      <button
                          type="button"
                          onClick={() => setMigraineData(prev => ({ ...prev, prostrating: true }))}
                          className={`flex-1 py-2 px-4 rounded-lg border-2 font-medium transition-colors ${
                              migraineData.prostrating === true
                                  ? 'bg-red-100 border-red-500 text-red-700'
                                  : 'bg-white border-gray-300 text-gray-700 hover:border-gray-400'
                          }`}
                      >
                        Yes, prostrating
                      </button>
                      <button
                          type="button"
                          onClick={() => setMigraineData(prev => ({ ...prev, prostrating: false }))}
                          className={`flex-1 py-2 px-4 rounded-lg border-2 font-medium transition-colors ${
                              migraineData.prostrating === false
                                  ? 'bg-green-100 border-green-500 text-green-700'
                                  : 'bg-white border-gray-300 text-gray-700 hover:border-gray-400'
                          }`}
                      >
                        No
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Associated Symptoms
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      {[
                        { key: 'aura', label: 'Aura' },
                        { key: 'nausea', label: 'Nausea' },
                        { key: 'lightSensitivity', label: 'Light sensitivity' },
                        { key: 'soundSensitivity', label: 'Sound sensitivity' },
                      ].map(({ key, label }) => (
                          <label
                              key={key}
                              className={`flex items-center gap-2 p-2 rounded-lg border cursor-pointer transition-colors ${
                                  migraineData[key]
                                      ? 'bg-purple-100 border-purple-300'
                                      : 'bg-white border-gray-200 hover:border-gray-300'
                              }`}
                          >
                            <input
                                type="checkbox"
                                checked={migraineData[key]}
                                onChange={(e) => setMigraineData(prev => ({ ...prev, [key]: e.target.checked }))}
                                className="w-4 h-4 text-purple-600 rounded"
                            />
                            <span className="text-sm text-gray-700">{label}</span>
                          </label>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Known Triggers
                    </label>
                    <input
                        type="text"
                        value={migraineData.triggers}
                        onChange={(e) => setMigraineData(prev => ({ ...prev, triggers: e.target.value }))}
                        placeholder="e.g., stress, bright lights"
                        className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                    />
                  </div>
                </div>
            )}

            {/* Notes */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Notes
              </label>
              <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="What were you doing? Any triggers?"
                  rows={3}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div className="p-4 border-t border-gray-200 flex gap-2">
            <button
                onClick={onClose}
                className="flex-1 py-2 px-4 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
                onClick={handleSave}
                className="flex-1 py-3 px-4 bg-blue-900 text-white font-semibold rounded-lg hover:bg-blue-800"
            >
              Save Changes
            </button>
          </div>
        </div>
      </div>
  );
};

export default EditLogModal;