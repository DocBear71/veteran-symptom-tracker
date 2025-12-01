import { useState, useEffect } from 'react';
import { symptomCategories } from '../data/symptoms';
import { saveSymptomLog, getCustomSymptoms, addCustomSymptom, getMedications, logMedicationTaken } from '../utils/storage';
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

  // Medication for symptom
  const [medications, setMedications] = useState([]);
  const [tookMedication, setTookMedication] = useState(false);
  const [selectedMedications, setSelectedMedications] = useState([]);

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

  // Sleep-specific fields
  const [sleepData, setSleepData] = useState({
    hoursSlept: '',
    quality: 5,
    wakeUps: '',
    troubleFallingAsleep: false,
    troubleStayingAsleep: false,
    nightmares: false,
    feelRested: null,
  });

  // PTSD-specific fields (for nightmares, hypervigilance, anxiety, etc.)
  const [ptsdData, setPtsdData] = useState({
    flashbacks: false,
    avoidance: false,
    emotionalNumbering: false,
    hypervigilance: false,
    exaggeratedStartle: false,
    intrusiveThoughts: false,
    triggerDescription: '',
  });

  // Pain-specific fields (for back, neck, joint pain)
  const [painData, setPainData] = useState({
    painLocation: '',
    radiating: false,
    radiatingTo: '',
    limitedRangeOfMotion: false,
    affectedActivities: [],
    painType: '',
    flareUp: false,
  });

  useEffect(() => {
    setCustomSymptoms(getCustomSymptoms());
    setMedications(getMedications());
  }, []);

  // Determine which special form to show
  const isMigraineSelected = selectedSymptom === 'migraine';
  const isSleepSelected = selectedSymptom === 'sleep-issues';
  const isNightmareSelected = selectedSymptom === 'nightmares';
  const isPTSDRelated = ['anxiety', 'hypervigilance', 'nightmares', 'irritability'].includes(selectedSymptom);
  const isPainSelected = ['back-pain', 'neck-pain', 'knee-pain', 'shoulder-pain', 'hip-pain', 'joint-pain'].includes(selectedSymptom);

  // Reset condition-specific data when symptom changes
  useEffect(() => {
    if (!isMigraineSelected) {
      setMigraineData({
        duration: '', prostrating: null, aura: false, nausea: false,
        lightSensitivity: false, soundSensitivity: false, triggers: '',
      });
    }
    if (!isSleepSelected && !isNightmareSelected) {
      setSleepData({
        hoursSlept: '', quality: 5, wakeUps: '', troubleFallingAsleep: false,
        troubleStayingAsleep: false, nightmares: false, feelRested: null,
      });
    }
    if (!isPTSDRelated) {
      setPtsdData({
        flashbacks: false, avoidance: false, emotionalNumbering: false,
        hypervigilance: false, exaggeratedStartle: false, intrusiveThoughts: false,
        triggerDescription: '',
      });
    }
    if (!isPainSelected) {
      setPainData({
        painLocation: '', radiating: false, radiatingTo: '',
        limitedRangeOfMotion: false, affectedActivities: [], painType: '', flareUp: false,
      });
    }
  }, [selectedSymptom, isMigraineSelected, isSleepSelected, isNightmareSelected, isPTSDRelated, isPainSelected]);

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

    // Add condition-specific data
    if (isMigraineSelected) {
      entry.migraineData = { ...migraineData };
    }
    if (isSleepSelected || isNightmareSelected) {
      entry.sleepData = { ...sleepData };
    }
    if (isPTSDRelated) {
      entry.ptsdData = { ...ptsdData };
    }
    if (isPainSelected) {
      entry.painData = { ...painData };
    }

    saveSymptomLog(entry);

    // Log medications if taken
    if (tookMedication && selectedMedications.length > 0) {
      selectedMedications.forEach(medId => {
        const med = medications.find(m => m.id === medId);
        if (med) {
          logMedicationTaken({
            medicationId: med.id,
            medicationName: med.name,
            dosage: med.dosage,
            takenFor: entry.symptomName,
            symptomLogId: entry.id,
          });
        }
      });
    }

    // Reset form
    setSelectedSymptom('');
    setSeverity(5);
    setNotes('');
    setTookMedication(false);
    setSelectedMedications([]);

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

  const toggleActivity = (activity) => {
    setPainData(prev => ({
      ...prev,
      affectedActivities: prev.affectedActivities.includes(activity)
          ? prev.affectedActivities.filter(a => a !== activity)
          : [...prev.affectedActivities, activity]
    }));
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
                    <label className="block text-sm text-gray-700 mb-1">Symptom Name</label>
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
                    <label className="block text-sm text-gray-700 mb-1">Category</label>
                    <select
                        value={newSymptomCategory}
                        onChange={(e) => setNewSymptomCategory(e.target.value)}
                        className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    >
                      {symptomCategories.map(cat => (
                          <option key={cat.id} value={cat.name}>{cat.name}</option>
                      ))}
                      <option value="Custom">Custom</option>
                    </select>
                  </div>
                  {customError && <p className="text-red-600 text-sm">{customError}</p>}
                  <div className="flex gap-2">
                    <button type="button" onClick={handleAddCustomSymptom}
                            className="flex-1 py-2 px-4 bg-blue-900 text-white font-medium rounded-lg hover:bg-blue-800">
                      Add Symptom
                    </button>
                    <button type="button"
                            onClick={() => { setShowCustomForm(false); setNewSymptomName(''); setCustomError(''); }}
                            className="py-2 px-4 bg-gray-200 text-gray-700 font-medium rounded-lg hover:bg-gray-300">
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
                <p className="text-xs text-purple-700">These details align with VA rating criteria</p>

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
                  <p className="text-xs text-gray-500 mb-2">Prostrating = unable to perform normal activities</p>
                  <div className="flex gap-3">
                    <button type="button"
                            onClick={() => setMigraineData(prev => ({ ...prev, prostrating: true }))}
                            className={`flex-1 py-2 px-4 rounded-lg border-2 font-medium ${
                                migraineData.prostrating === true
                                    ? 'bg-red-100 border-red-500 text-red-700'
                                    : 'bg-white border-gray-300 text-gray-700'
                            }`}>
                      Yes, prostrating
                    </button>
                    <button type="button"
                            onClick={() => setMigraineData(prev => ({ ...prev, prostrating: false }))}
                            className={`flex-1 py-2 px-4 rounded-lg border-2 font-medium ${
                                migraineData.prostrating === false
                                    ? 'bg-green-100 border-green-500 text-green-700'
                                    : 'bg-white border-gray-300 text-gray-700'
                            }`}>
                      No
                    </button>
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

          {/* Sleep-Specific Fields */}
          {(isSleepSelected || isNightmareSelected) && (
              <div className="bg-indigo-50 p-4 rounded-lg border border-indigo-200 space-y-4">
                <h3 className="font-medium text-indigo-900">Sleep Details</h3>
                <p className="text-xs text-indigo-700">Track sleep patterns for VA claims documentation</p>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Hours Slept</label>
                    <input type="number" min="0" max="24" step="0.5"
                           value={sleepData.hoursSlept}
                           onChange={(e) => setSleepData(prev => ({ ...prev, hoursSlept: e.target.value }))}
                           placeholder="Hours"
                           className="w-full p-2 border border-gray-300 rounded-lg" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Times Woken Up</label>
                    <input type="number" min="0" max="20"
                           value={sleepData.wakeUps}
                           onChange={(e) => setSleepData(prev => ({ ...prev, wakeUps: e.target.value }))}
                           placeholder="Times"
                           className="w-full p-2 border border-gray-300 rounded-lg" />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Sleep Quality: {sleepData.quality}/10
                  </label>
                  <input type="range" min="0" max="10" value={sleepData.quality}
                         onChange={(e) => setSleepData(prev => ({ ...prev, quality: Number(e.target.value) }))}
                         className="w-full" />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Sleep Issues</label>
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
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Feel rested upon waking?</label>
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

          {/* PTSD-Related Fields */}
          {isPTSDRelated && (
              <div className="bg-amber-50 p-4 rounded-lg border border-amber-200 space-y-4">
                <h3 className="font-medium text-amber-900">Mental Health Details</h3>
                <p className="text-xs text-amber-700">These align with PTSD rating criteria</p>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Associated Experiences</label>
                  <div className="grid grid-cols-1 gap-2">
                    {[
                      { key: 'flashbacks', label: 'Flashbacks' },
                      { key: 'intrusiveThoughts', label: 'Intrusive thoughts' },
                      { key: 'avoidance', label: 'Avoidance of triggers/situations' },
                      { key: 'emotionalNumbering', label: 'Emotional numbness' },
                      { key: 'hypervigilance', label: 'Hypervigilance' },
                      { key: 'exaggeratedStartle', label: 'Exaggerated startle response' },
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
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Trigger (if known)
                  </label>
                  <input type="text" value={ptsdData.triggerDescription}
                         onChange={(e) => setPtsdData(prev => ({ ...prev, triggerDescription: e.target.value }))}
                         placeholder="What triggered this episode?"
                         className="w-full p-2 border border-gray-300 rounded-lg" />
                </div>
              </div>
          )}

          {/* Pain-Specific Fields */}
          {isPainSelected && (
              <div className="bg-rose-50 p-4 rounded-lg border border-rose-200 space-y-4">
                <h3 className="font-medium text-rose-900">Pain Details</h3>
                <p className="text-xs text-rose-700">Document impact on daily activities for VA claims</p>

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
                    <span className="text-sm text-gray-700">Radiating pain</span>
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
                             placeholder="e.g., down left leg, into shoulder"
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

          {/* Severity Slider */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Severity Level</label>
            <div className="bg-white p-4 rounded-lg border border-gray-200">
              <input type="range" min="0" max="10" value={severity}
                     onChange={(e) => setSeverity(Number(e.target.value))}
                     className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer" />
              <div className="flex justify-between mt-2">
                <span className="text-xs text-gray-500">0</span>
                <span className={`text-lg font-bold ${severityInfo.color}`}>
                {severity} - {severityInfo.label}
              </span>
                <span className="text-xs text-gray-500">10</span>
              </div>
            </div>
          </div>

          {/* Medication Taken */}
          {medications.length > 0 && selectedSymptom && (
              <div className="bg-teal-50 p-4 rounded-lg border border-teal-200">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                      type="checkbox"
                      checked={tookMedication}
                      onChange={(e) => {
                        setTookMedication(e.target.checked);
                        if (!e.target.checked) setSelectedMedications([]);
                      }}
                      className="w-4 h-4 text-teal-600 rounded"
                  />
                  <span className="font-medium text-teal-900">I took medication for this</span>
                </label>

                {tookMedication && (
                    <div className="mt-3 space-y-2">
                      <p className="text-sm text-teal-700">Select all that apply:</p>
                      {medications.filter(m => m.isActive).map(med => (
                          <label
                              key={med.id}
                              className={`flex items-center gap-2 p-2 rounded-lg border cursor-pointer transition-colors ${
                                  selectedMedications.includes(med.id)
                                      ? 'bg-teal-100 border-teal-400'
                                      : 'bg-white border-gray-200 hover:border-teal-300'
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
                            <span className="text-sm text-gray-700">
              {med.name} ({med.dosage})
            </span>
                          </label>
                      ))}
                    </div>
                )}
              </div>
          )}

          {/* Notes */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Notes (optional)</label>
            <textarea value={notes} onChange={(e) => setNotes(e.target.value)}
                      placeholder="What were you doing? What made it better or worse?"
                      rows={3}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" />
            <p className="text-xs text-gray-500 mt-1">Detailed notes help build stronger claims</p>
          </div>

          {/* Submit Button */}
          <button type="submit" disabled={!selectedSymptom}
                  className="w-full py-3 px-4 bg-blue-900 text-white font-semibold rounded-lg hover:bg-blue-800 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors">
            Log Symptom
          </button>
        </form>
      </div>
  );
};

export default SymptomLogger;