import { useState, useEffect } from 'react';
import { symptomCategories } from '../data/symptoms';
import { saveSymptomLog, getCustomSymptoms, addCustomSymptom } from '../utils/storage';
import QuickLog from './QuickLog';
import AddFavoriteModal from './AddFavoriteModal';

const SymptomLogger = ({ onLogSaved }) => {
  const [selectedSymptom, setSelectedSymptom] = useState('');
  const [severity, setSeverity] = useState(5);
  const [notes, setNotes] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);
  const [customSymptoms, setCustomSymptoms] = useState([]);
  const [refreshQuickLog, setRefreshQuickLog] = useState(0);

  // Custom symptom form state
  const [showCustomForm, setShowCustomForm] = useState(false);
  const [newSymptomName, setNewSymptomName] = useState('');
  const [newSymptomCategory, setNewSymptomCategory] = useState('Custom');
  const [customError, setCustomError] = useState('');

  // Favorite modal state
  const [showFavoriteModal, setShowFavoriteModal] = useState(false);

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
    setCustomSymptoms(getCustomSymptoms());
  }, []);

  const isMigraineSelected = selectedSymptom === 'migraine';

  useEffect(() => {
    if (!isMigraineSelected) {
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
  }, [selectedSymptom, isMigraineSelected]);

  const getAllCategories = () => {
    const categories = symptomCategories.map(cat => ({
      ...cat,
      symptoms: [...cat.symptoms]
    }));

    const customByCategory = {};
    customSymptoms.forEach(symptom => {
      if (!customByCategory[symptom.category]) {
        customByCategory[symptom.category] = [];
      }
      customByCategory[symptom.category].push(symptom);
    });

    Object.entries(customByCategory).forEach(([categoryName, symptoms]) => {
      const existingCategory = categories.find(c => c.name === categoryName);
      if (existingCategory) {
        existingCategory.symptoms = [...existingCategory.symptoms, ...symptoms];
      } else {
        categories.push({
          id: `custom-${categoryName.toLowerCase()}`,
          name: categoryName,
          symptoms: symptoms,
        });
      }
    });

    return categories;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!selectedSymptom) return;

    if (isMigraineSelected && migraineData.prostrating === null) {
      alert('Please indicate if this migraine was prostrating (incapacitating)');
      return;
    }

    const allCategories = getAllCategories();
    const symptomData = allCategories
    .flatMap(cat => cat.symptoms.map(s => ({ ...s, category: cat.name })))
    .find(s => s.id === selectedSymptom);

    const entry = {
      symptomId: selectedSymptom,
      symptomName: symptomData?.name || selectedSymptom,
      category: symptomData?.category || 'Other',
      severity,
      notes: notes.trim(),
      isCustomSymptom: symptomData?.isCustom || false,
    };

    if (isMigraineSelected) {
      entry.migraineData = {
        duration: migraineData.duration,
        prostrating: migraineData.prostrating,
        aura: migraineData.aura,
        nausea: migraineData.nausea,
        lightSensitivity: migraineData.lightSensitivity,
        soundSensitivity: migraineData.soundSensitivity,
        triggers: migraineData.triggers.trim(),
      };
    }

    saveSymptomLog(entry);

    setSelectedSymptom('');
    setSeverity(5);
    setNotes('');
    setMigraineData({
      duration: '',
      prostrating: null,
      aura: false,
      nausea: false,
      lightSensitivity: false,
      soundSensitivity: false,
      triggers: '',
    });

    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 2000);

    if (onLogSaved) onLogSaved();
  };

  const handleAddCustomSymptom = (e) => {
    e.preventDefault();
    setCustomError('');

    if (!newSymptomName.trim()) {
      setCustomError('Please enter a symptom name');
      return;
    }

    const result = addCustomSymptom(newSymptomName, newSymptomCategory);

    if (result.success) {
      setCustomSymptoms(getCustomSymptoms());
      setSelectedSymptom(result.symptom.id);
      setNewSymptomName('');
      setNewSymptomCategory('Custom');
      setShowCustomForm(false);
    } else {
      setCustomError(result.message);
    }
  };

  const getSeverityInfo = (value) => {
    if (value <= 2) return { label: 'Minimal', color: 'text-green-600' };
    if (value <= 4) return { label: 'Mild', color: 'text-yellow-600' };
    if (value <= 6) return { label: 'Moderate', color: 'text-orange-500' };
    if (value <= 8) return { label: 'Severe', color: 'text-red-500' };
    return { label: 'Extreme', color: 'text-red-700' };
  };

  const severityInfo = getSeverityInfo(severity);
  const allCategories = getAllCategories();

  return (
      <div className="pb-20">
        {/* Quick Log Section */}
        <QuickLog
            key={refreshQuickLog}
            onLogSaved={onLogSaved}
            onAddFavorite={() => setShowFavoriteModal(true)}
        />

        {/* Add Favorite Modal */}
        <AddFavoriteModal
            isOpen={showFavoriteModal}
            onClose={() => setShowFavoriteModal(false)}
            onAdded={() => setRefreshQuickLog(prev => prev + 1)}
        />

        {/* Divider */}
        <div className="relative mb-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300"></div>
          </div>
          <div className="relative flex justify-center">
            <span className="bg-gray-50 px-3 text-sm text-gray-500">or log with details</span>
          </div>
        </div>

        {/* Success Message */}
        {showSuccess && (
            <div className="mb-4 p-3 bg-green-100 text-green-800 rounded-lg text-center">
              ✓ Symptom logged successfully
            </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Symptom Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              What symptom are you experiencing?
            </label>
            <select
                value={selectedSymptom}
                onChange={(e) => {
                  if (e.target.value === 'ADD_CUSTOM') {
                    setShowCustomForm(true);
                    setSelectedSymptom('');
                  } else {
                    setSelectedSymptom(e.target.value);
                  }
                }}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
            >
              <option value="">Select a symptom...</option>
              {allCategories.map(category => (
                  <optgroup key={category.id} label={category.name}>
                    {category.symptoms.map(symptom => (
                        <option key={symptom.id} value={symptom.id}>
                          {symptom.name} {symptom.isCustom ? '(custom)' : ''}
                        </option>
                    ))}
                  </optgroup>
              ))}
              <optgroup label="─────────────">
                <option value="ADD_CUSTOM">+ Add Custom Symptom</option>
              </optgroup>
            </select>
          </div>

          {/* Custom Symptom Form */}
          {showCustomForm && (
              <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                <h3 className="font-medium text-blue-900 mb-3">Add Custom Symptom</h3>

                <div className="space-y-3">
                  <div>
                    <label className="block text-sm text-gray-700 mb-1">
                      Symptom Name
                    </label>
                    <input
                        type="text"
                        value={newSymptomName}
                        onChange={(e) => setNewSymptomName(e.target.value)}
                        placeholder="e.g., Plantar Fasciitis"
                        className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                        autoFocus
                    />
                  </div>

                  <div>
                    <label className="block text-sm text-gray-700 mb-1">
                      Category
                    </label>
                    <select
                        value={newSymptomCategory}
                        onChange={(e) => setNewSymptomCategory(e.target.value)}
                        className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    >
                      {symptomCategories.map(cat => (
                          <option key={cat.id} value={cat.name}>
                            {cat.name}
                          </option>
                      ))}
                      <option value="Custom">Custom</option>
                    </select>
                  </div>

                  {customError && (
                      <p className="text-red-600 text-sm">{customError}</p>
                  )}

                  <div className="flex gap-2">
                    <button
                        type="button"
                        onClick={handleAddCustomSymptom}
                        className="flex-1 py-2 px-4 bg-blue-900 text-white font-medium rounded-lg hover:bg-blue-800"
                    >
                      Add Symptom
                    </button>
                    <button
                        type="button"
                        onClick={() => {
                          setShowCustomForm(false);
                          setNewSymptomName('');
                          setCustomError('');
                        }}
                        className="py-2 px-4 bg-gray-200 text-gray-700 font-medium rounded-lg hover:bg-gray-300"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </div>
          )}

          {/* Migraine-Specific Fields */}
          {isMigraineSelected && (
              <div className="bg-purple-50 p-4 rounded-lg border border-purple-200 space-y-4">
                <h3 className="font-medium text-purple-900">Migraine Details</h3>
                <p className="text-xs text-purple-700">
                  These details align with VA rating criteria for migraines
                </p>

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
                  <p className="text-xs text-gray-500 mb-2">
                    Prostrating = unable to perform normal activities, had to lie down
                  </p>
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
                      { key: 'aura', label: 'Aura (visual disturbances)' },
                      { key: 'nausea', label: 'Nausea/Vomiting' },
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
                    Known Triggers (optional)
                  </label>
                  <input
                      type="text"
                      value={migraineData.triggers}
                      onChange={(e) => setMigraineData(prev => ({ ...prev, triggers: e.target.value }))}
                      placeholder="e.g., stress, bright lights, lack of sleep"
                      className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                  />
                </div>
              </div>
          )}

          {/* Severity Slider */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Severity Level
            </label>
            <div className="bg-white p-4 rounded-lg border border-gray-200">
              <input
                  type="range"
                  min="0"
                  max="10"
                  value={severity}
                  onChange={(e) => setSeverity(Number(e.target.value))}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
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

          {/* Notes */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Notes (optional)
            </label>
            <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="What were you doing? What made it better or worse? Any triggers?"
                rows={3}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
            <p className="text-xs text-gray-500 mt-1">
              Detailed notes help build stronger claims
            </p>
          </div>

          {/* Submit Button */}
          <button
              type="submit"
              disabled={!selectedSymptom}
              className="w-full py-3 px-4 bg-blue-900 text-white font-semibold rounded-lg hover:bg-blue-800 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
          >
            Log Symptom
          </button>
        </form>
      </div>
  );
};

export default SymptomLogger;