import { useState, useEffect } from 'react';
import { sortedSymptomCategories } from '../data/symptoms';
import { saveSymptomLog, getCustomSymptoms, addCustomSymptom, getMedications, logMedicationTaken } from '../utils/storage';
import QuickLog from './QuickLog';
import AddChronicModal from './AddChronicModal';

const SymptomLogger = ({ onLogSaved }) => {
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedSymptom, setSelectedSymptom] = useState('');

  const [severity, setSeverity] = useState(5);
  const [notes, setNotes] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);
  const [customSymptoms, setCustomSymptoms] = useState([]);
  const [refreshQuickLog, setRefreshQuickLog] = useState(0);

  const [isFlareUp, setIsFlareUp] = useState(false);
  const [duration, setDuration] = useState('');
  const [timeOfDay, setTimeOfDay] = useState('');

  // Custom symptom form state
  const [showCustomForm, setShowCustomForm] = useState(false);
  const [newSymptomName, setNewSymptomName] = useState('');
  const [newSymptomCategory, setNewSymptomCategory] = useState('Custom');
  const [customError, setCustomError] = useState('');

  // Chronic symptom modal state
  const [showChronicModal, setShowChronicModal] = useState(false);

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

  // PTSD-specific fields
  const [ptsdData, setPtsdData] = useState({
    flashbacks: false,
    avoidance: false,
    emotionalNumbering: false,
    hypervigilance: false,
    exaggeratedStartle: false,
    intrusiveThoughts: false,
    triggerDescription: '',
  });

  // Pain-specific fields
  const [painData, setPainData] = useState({
    painLocation: '',
    radiating: false,
    radiatingTo: '',
    limitedRangeOfMotion: false,
    affectedActivities: [],
    painType: '',
    flareUp: false,
  });

  const [giData, setGIData] = useState({
    bristolScale: null,          // 1-7 Bristol Stool Scale
    frequencyPerDay: '',         // Number of episodes/bowel movements
    urgencyLevel: '',            // none/mild/moderate/severe/incontinence
    bloodPresent: null,          // true/false/null
    bloatingSeverity: '',        // none/mild/moderate/severe
    abdominalPainLocation: '',   // upper-right/upper-left/lower-right/lower-left/central/diffuse
    mealRelated: null,           // true/false - symptoms worse after eating
    nighttimeSymptoms: false,    // woken up by symptoms
  });

  useEffect(() => {
    setCustomSymptoms(getCustomSymptoms());
    setMedications(getMedications());
  }, []);

  // Determine which special form to show - EXPANDED DETECTION
  const isMigraineSelected = selectedSymptom === 'migraine';

  // Sleep: match sleep-related symptoms and categories
  const isSleepSelected = selectedSymptom === 'sleep-issues' ||
      selectedSymptom?.includes('insomnia') ||
      selectedSymptom?.includes('sleep') ||
      selectedCategory === 'sleep-disorders';

  const isNightmareSelected = selectedSymptom === 'nightmares';

  // PTSD/Mental Health: broader matching for mental health symptoms
  const isPTSDRelated = selectedSymptom?.includes('anxiety') ||
      selectedSymptom?.includes('ptsd') ||
      selectedSymptom?.includes('panic') ||
      selectedSymptom?.includes('depression') ||
      selectedSymptom?.includes('mood') ||
      ['hypervigilance', 'nightmares', 'irritability', 'flashbacks', 'intrusive-thoughts',
        'avoidance', 'emotional-numbness', 'startle-response', 'concentration-problems',
        'social-withdrawal', 'hopelessness', 'guilt', 'anger-outbursts'].includes(selectedSymptom) ||
      selectedCategory === 'mental-health' ||
      selectedCategory === 'ptsd-symptoms';

  // Pain: match ANY pain-related symptom or musculoskeletal category
  const isPainSelected = selectedSymptom?.includes('pain') ||
      selectedSymptom?.includes('-ache') ||
      selectedSymptom?.includes('stiff') ||
      ['sciatica', 'radiculopathy', 'stenosis', 'arthritis', 'bursitis', 'tendinitis',
        'strain', 'sprain', 'rom-limited', 'swelling', 'instability', 'weakness',
        'numbness', 'tingling', 'cramping', 'spasms', 'plantar-fasciitis', 'ddd',
        'spondylosis', 'spondylolisthesis', 'herniated', 'bulging'].some(term => selectedSymptom?.includes(term)) ||
      ['pain', 'back-spine', 'shoulder', 'knee', 'hip', 'ankle-foot', 'wrist-hand',
        'elbow', 'neck', 'joints'].includes(selectedCategory);

  // Phase 1B: GI condition detection - match IBS, GERD, and future GI conditions
  const isGISelected = selectedSymptom?.startsWith('ibs') ||
      selectedSymptom?.startsWith('gerd') ||
      selectedSymptom?.startsWith('uc-') ||
      selectedSymptom?.startsWith('ulcer-') ||
      selectedSymptom?.startsWith('hemorrhoid') ||
      selectedSymptom?.startsWith('divertic') ||
      ['diarrhea', 'constipation', 'bloating', 'abdominal-pain', 'nausea', 'rectal-bleeding'].includes(selectedSymptom);

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
    // Phase 1B: Reset GI data
    if (!isGISelected) {
      setGIData({
        bristolScale: null, frequencyPerDay: '', urgencyLevel: '',
        bloodPresent: null, bloatingSeverity: '', abdominalPainLocation: '',
        mealRelated: null, nighttimeSymptoms: false,
      });
    }
  }, [selectedSymptom, isMigraineSelected, isSleepSelected, isNightmareSelected, isPTSDRelated, isPainSelected, isGISelected]);

  // Build categories list including custom symptoms
  const getAllCategories = () => {
    const categories = sortedSymptomCategories.map(cat => ({
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

  const allCategories = getAllCategories();

  // Get symptoms for the selected category
  const getSymptomsForCategory = () => {
    if (!selectedCategory) return [];
    const category = allCategories.find(cat => cat.id === selectedCategory);
    return category ? category.symptoms : [];
  };

  const availableSymptoms = getSymptomsForCategory();

  // Handle category change - reset symptom selection
  const handleCategoryChange = (categoryId) => {
    setSelectedCategory(categoryId);
    setSelectedSymptom('');
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!selectedSymptom) return;

    if (isMigraineSelected && migraineData.prostrating === null) {
      alert('Please indicate if this migraine was prostrating (incapacitating)');
      return;
    }

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
      // PHASE 1A: Universal fields
      isFlareUp,
      duration: duration || null,
      timeOfDay: timeOfDay || null,
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
    // Phase 1B: Add GI data
    if (isGISelected) {
      entry.giData = { ...giData };
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
    setSelectedCategory('');
    setSelectedSymptom('');
    setSeverity(5);
    setNotes('');
    setTookMedication(false);
    setSelectedMedications([]);
    // Reset universal fields
    setIsFlareUp(false);
    setDuration('');
    setTimeOfDay('');

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
      const categoryId = sortedSymptomCategories.find(c => c.name === newSymptomCategory)?.id
          || `custom-${newSymptomCategory.toLowerCase()}`;
      setSelectedCategory(categoryId);
      setSelectedSymptom(result.symptom.id);
      setNewSymptomName('');
      setNewSymptomCategory('Custom');
      setShowCustomForm(false);
    } else {
      setCustomError(result.message);
    }
  };

  const getSeverityInfo = (value) => {
    if (value <= 2) return { label: 'Minimal', color: 'text-green-600 dark:text-green-400' };
    if (value <= 4) return { label: 'Mild', color: 'text-yellow-600 dark:text-yellow-400' };
    if (value <= 6) return { label: 'Moderate', color: 'text-orange-500 dark:text-orange-400' };
    if (value <= 8) return { label: 'Severe', color: 'text-red-500 dark:text-red-400' };
    return { label: 'Extreme', color: 'text-red-700 dark:text-red-300' };
  };

  const toggleActivity = (activity) => {
    setPainData(prev => ({
      ...prev,
      affectedActivities: prev.affectedActivities.includes(activity)
          ? prev.affectedActivities.filter(a => a !== activity)
          : [...prev.affectedActivities, activity]
    }));
  };

  // Bristol Scale descriptions for user reference
  const bristolDescriptions = {
    1: 'Separate hard lumps (severe constipation)',
    2: 'Lumpy, sausage-shaped (mild constipation)',
    3: 'Sausage with cracks (normal)',
    4: 'Smooth, soft sausage (ideal)',
    5: 'Soft blobs with clear edges (lacking fiber)',
    6: 'Mushy with ragged edges (mild diarrhea)',
    7: 'Watery, no solid pieces (severe diarrhea)',
  };

  const severityInfo = getSeverityInfo(severity);

  return (
      <div className="pb-20">
        {/* Quick Log Section */}
        <QuickLog
            key={refreshQuickLog}
            onLogSaved={onLogSaved}
            onAddChronic={() => setShowChronicModal(true)}
        />

        {/* Add Chronic Symptom Modal */}
        <AddChronicModal
            isOpen={showChronicModal}
            onClose={() => setShowChronicModal(false)}
            onAdded={() => setRefreshQuickLog(prev => prev + 1)}
        />

        {/* Divider */}
        <div className="relative mb-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300 dark:border-gray-600"></div>
          </div>
          <div className="relative flex justify-center">
            <span className="bg-gray-50 dark:bg-gray-900 px-3 text-sm text-gray-500 dark:text-gray-400">or log with details</span>
          </div>
        </div>

        {/* Success Message */}
        {showSuccess && (
            <div className="mb-4 p-3 bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 rounded-lg text-center">
              ✓ Symptom logged successfully
            </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Two-Step Symptom Selection */}
          <div className="space-y-4">
            {/* Step 1: Category Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                1. Select Category
              </label>
              <select
                  value={selectedCategory}
                  onChange={(e) => {
                    if (e.target.value === 'ADD_CUSTOM') {
                      setShowCustomForm(true);
                      setSelectedCategory('');
                    } else {
                      handleCategoryChange(e.target.value);
                    }
                  }}
                  className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Select a category...</option>
                {allCategories.map(category => (
                    <option key={category.id} value={category.id}>
                      {category.name} ({category.symptoms.length})
                    </option>
                ))}
                <option value="ADD_CUSTOM">+ Add Custom Symptom</option>
              </select>
            </div>

            {/* Step 2: Symptom Selection */}
            {selectedCategory && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    2. Select Symptom
                  </label>
                  <select
                      value={selectedSymptom}
                      onChange={(e) => setSelectedSymptom(e.target.value)}
                      className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      required
                  >
                    <option value="">Select a symptom...</option>
                    {availableSymptoms.map(symptom => (
                        <option key={symptom.id} value={symptom.id}>
                          {symptom.name} {symptom.isCustom ? '(custom)' : ''}
                        </option>
                    ))}
                  </select>
                </div>
            )}
          </div>

          {/* Custom Symptom Form */}
          {showCustomForm && (
              <div className="bg-blue-50 dark:bg-blue-900/30 p-4 rounded-lg border border-blue-200 dark:border-blue-800">
                <h3 className="font-medium text-blue-900 dark:text-blue-200 mb-3">Add Custom Symptom</h3>
                <div className="space-y-3">
                  <div>
                    <label className="block text-sm text-gray-700 dark:text-gray-300 mb-1">Symptom Name</label>
                    <input
                        type="text"
                        value={newSymptomName}
                        onChange={(e) => setNewSymptomName(e.target.value)}
                        placeholder="e.g., Plantar Fasciitis"
                        className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                        autoFocus
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-700 dark:text-gray-300 mb-1">Category</label>
                    <select
                        value={newSymptomCategory}
                        onChange={(e) => setNewSymptomCategory(e.target.value)}
                        className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                    >
                      {sortedSymptomCategories.map(cat => (
                          <option key={cat.id} value={cat.name}>{cat.name}</option>
                      ))}
                      <option value="Custom">Custom</option>
                    </select>
                  </div>
                  {customError && <p className="text-red-600 dark:text-red-400 text-sm">{customError}</p>}
                  <div className="flex gap-2">
                    <button type="button" onClick={handleAddCustomSymptom}
                            className="flex-1 py-2 px-4 bg-blue-900 dark:bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-800 dark:hover:bg-blue-700">
                      Add Symptom
                    </button>
                    <button type="button"
                            onClick={() => { setShowCustomForm(false); setNewSymptomName(''); setCustomError(''); }}
                            className="py-2 px-4 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 font-medium rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600">
                      Cancel
                    </button>
                  </div>
                </div>
              </div>
          )}

          {/* ============================================ */}
          {/* PHASE 1A: UNIVERSAL ENHANCEMENT FIELDS */}
          {/* ============================================ */}
          {selectedSymptom && (
              <div className="bg-gray-50 dark:bg-gray-800/50 p-4 rounded-lg border border-gray-200 dark:border-gray-700 space-y-4">
                <h3 className="font-medium text-gray-900 dark:text-gray-100 flex items-center gap-2">
                  <span>📋</span> Symptom Details
                </h3>

                {/* Flare-Up Toggle */}
                <div>
                  <label className={`flex items-center gap-3 p-3 rounded-lg border-2 cursor-pointer transition-all ${
                      isFlareUp
                          ? 'bg-orange-100 dark:bg-orange-900/30 border-orange-400 dark:border-orange-600'
                          : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-600 hover:border-orange-300 dark:hover:border-orange-700'
                  }`}>
                    <input
                        type="checkbox"
                        checked={isFlareUp}
                        onChange={(e) => setIsFlareUp(e.target.checked)}
                        className="w-5 h-5 text-orange-600 rounded"
                    />
                    <div>
                                    <span className="font-medium text-gray-900 dark:text-gray-100">
                                        🔥 This is a flare-up
                                    </span>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        Symptom is worse than usual baseline
                      </p>
                    </div>
                  </label>
                </div>

                {/* Duration and Time of Day */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Duration
                    </label>
                    <select
                        value={duration}
                        onChange={(e) => setDuration(e.target.value)}
                        className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm"
                    >
                      <option value="">How long?</option>
                      <option value="just-started">Just started</option>
                      <option value="minutes">Minutes</option>
                      <option value="hours">Hours</option>
                      <option value="days">Days</option>
                      <option value="weeks">Weeks</option>
                      <option value="months">Months+</option>
                      <option value="ongoing">Ongoing/Chronic</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Time of Day
                    </label>
                    <select
                        value={timeOfDay}
                        onChange={(e) => setTimeOfDay(e.target.value)}
                        className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm"
                    >
                      <option value="">When?</option>
                      <option value="morning">Morning</option>
                      <option value="afternoon">Afternoon</option>
                      <option value="evening">Evening</option>
                      <option value="night">Night</option>
                      <option value="all-day">All Day</option>
                      <option value="varies">Varies</option>
                    </select>
                  </div>
                </div>
              </div>
          )}

          {/* ============================================ */}
          {/* PHASE 1B: GI CONDITION-SPECIFIC FORM */}
          {/* For IBS, GERD, UC, peptic ulcer, hemorrhoids, diverticulitis */}
          {/* ============================================ */}
          {isGISelected && (
              <div className="bg-amber-50 dark:bg-amber-900/20 p-4 rounded-lg border border-amber-200 dark:border-amber-800 space-y-4">
                <h3 className="font-medium text-amber-900 dark:text-amber-200 flex items-center gap-2">
                  <span>🩺</span> GI Symptom Details
                </h3>
                <p className="text-xs text-amber-700 dark:text-amber-300">
                  Track details for VA rating documentation
                </p>

                {/* Bristol Stool Scale */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Bristol Stool Scale (if applicable)
                  </label>
                  <div className="grid grid-cols-7 gap-1 mb-2">
                    {[1, 2, 3, 4, 5, 6, 7].map(num => (
                        <button
                            key={num}
                            type="button"
                            onClick={() => setGIData(prev => ({ ...prev, bristolScale: num }))}
                            className={`py-2 px-1 rounded-lg border-2 font-bold text-sm transition-all ${
                                giData.bristolScale === num
                                    ? num <= 2 ? 'bg-orange-200 dark:bg-orange-900 border-orange-500 text-orange-800 dark:text-orange-200'
                                        : num <= 4 ? 'bg-green-200 dark:bg-green-900 border-green-500 text-green-800 dark:text-green-200'
                                            : 'bg-yellow-200 dark:bg-yellow-900 border-yellow-500 text-yellow-800 dark:text-yellow-200'
                                    : 'bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300'
                            }`}
                        >
                          {num}
                        </button>
                    ))}
                  </div>
                  {giData.bristolScale && (
                      <p className="text-xs text-gray-600 dark:text-gray-400 bg-white dark:bg-gray-800 p-2 rounded">
                        Type {giData.bristolScale}: {bristolDescriptions[giData.bristolScale]}
                      </p>
                  )}
                  <button
                      type="button"
                      onClick={() => setGIData(prev => ({ ...prev, bristolScale: null }))}
                      className="text-xs text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 mt-1"
                  >
                    Clear selection
                  </button>
                </div>

                {/* Frequency and Urgency Row */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Episodes Today
                    </label>
                    <input
                        type="number"
                        min="0"
                        max="50"
                        value={giData.frequencyPerDay}
                        onChange={(e) => setGIData(prev => ({ ...prev, frequencyPerDay: e.target.value }))}
                        placeholder="# times"
                        className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Urgency Level
                    </label>
                    <select
                        value={giData.urgencyLevel}
                        onChange={(e) => setGIData(prev => ({ ...prev, urgencyLevel: e.target.value }))}
                        className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm"
                    >
                      <option value="">Select...</option>
                      <option value="none">None</option>
                      <option value="mild">Mild - Can wait</option>
                      <option value="moderate">Moderate - Need to go soon</option>
                      <option value="severe">Severe - Must go immediately</option>
                      <option value="incontinence">Incontinence</option>
                    </select>
                  </div>
                </div>

                {/* Blood Present */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Blood Present?
                  </label>
                  <div className="flex gap-3">
                    <button
                        type="button"
                        onClick={() => setGIData(prev => ({ ...prev, bloodPresent: true }))}
                        className={`flex-1 py-2 px-4 rounded-lg border-2 font-medium ${
                            giData.bloodPresent === true
                                ? 'bg-red-100 dark:bg-red-900/50 border-red-500 text-red-700 dark:text-red-300'
                                : 'bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300'
                        }`}
                    >
                      Yes
                    </button>
                    <button
                        type="button"
                        onClick={() => setGIData(prev => ({ ...prev, bloodPresent: false }))}
                        className={`flex-1 py-2 px-4 rounded-lg border-2 font-medium ${
                            giData.bloodPresent === false
                                ? 'bg-green-100 dark:bg-green-900/50 border-green-500 text-green-700 dark:text-green-300'
                                : 'bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300'
                        }`}
                    >
                      No
                    </button>
                  </div>
                </div>

                {/* Bloating Severity */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Bloating Severity
                  </label>
                  <select
                      value={giData.bloatingSeverity}
                      onChange={(e) => setGIData(prev => ({ ...prev, bloatingSeverity: e.target.value }))}
                      className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                  >
                    <option value="">Select...</option>
                    <option value="none">None</option>
                    <option value="mild">Mild - Noticeable but not bothersome</option>
                    <option value="moderate">Moderate - Uncomfortable</option>
                    <option value="severe">Severe - Pants don't fit / visible distension</option>
                  </select>
                </div>

                {/* Abdominal Pain Location */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Pain Location (if applicable)
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { id: 'upper-left', label: 'Upper Left' },
                      { id: 'upper-center', label: 'Upper Center' },
                      { id: 'upper-right', label: 'Upper Right' },
                      { id: 'lower-left', label: 'Lower Left' },
                      { id: 'lower-center', label: 'Lower Center' },
                      { id: 'lower-right', label: 'Lower Right' },
                    ].map(({ id, label }) => (
                        <button
                            key={id}
                            type="button"
                            onClick={() => setGIData(prev => ({
                              ...prev,
                              abdominalPainLocation: prev.abdominalPainLocation === id ? '' : id
                            }))}
                            className={`py-2 px-2 rounded-lg border text-xs font-medium transition-all ${
                                giData.abdominalPainLocation === id
                                    ? 'bg-amber-200 dark:bg-amber-900 border-amber-500 text-amber-800 dark:text-amber-200'
                                    : 'bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300'
                            }`}
                        >
                          {label}
                        </button>
                    ))}
                  </div>
                  <button
                      type="button"
                      onClick={() => setGIData(prev => ({ ...prev, abdominalPainLocation: 'diffuse' }))}
                      className={`w-full mt-2 py-2 px-4 rounded-lg border text-sm font-medium ${
                          giData.abdominalPainLocation === 'diffuse'
                              ? 'bg-amber-200 dark:bg-amber-900 border-amber-500 text-amber-800 dark:text-amber-200'
                              : 'bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300'
                      }`}
                  >
                    Diffuse / All Over
                  </button>
                </div>

                {/* Additional Toggles */}
                <div className="space-y-2">
                  <label className={`flex items-center gap-2 p-2 rounded-lg border cursor-pointer ${
                      giData.mealRelated === true
                          ? 'bg-amber-100 dark:bg-amber-900/50 border-amber-300 dark:border-amber-700'
                          : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700'
                  }`}>
                    <input
                        type="checkbox"
                        checked={giData.mealRelated === true}
                        onChange={(e) => setGIData(prev => ({ ...prev, mealRelated: e.target.checked ? true : null }))}
                        className="w-4 h-4 text-amber-600 rounded"
                    />
                    <span className="text-sm text-gray-700 dark:text-gray-300">Worse after eating</span>
                  </label>

                  <label className={`flex items-center gap-2 p-2 rounded-lg border cursor-pointer ${
                      giData.nighttimeSymptoms
                          ? 'bg-amber-100 dark:bg-amber-900/50 border-amber-300 dark:border-amber-700'
                          : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700'
                  }`}>
                    <input
                        type="checkbox"
                        checked={giData.nighttimeSymptoms}
                        onChange={(e) => setGIData(prev => ({ ...prev, nighttimeSymptoms: e.target.checked }))}
                        className="w-4 h-4 text-amber-600 rounded"
                    />
                    <span className="text-sm text-gray-700 dark:text-gray-300">Woken up by symptoms (nighttime)</span>
                  </label>
                </div>
              </div>
          )}

          {/* Migraine-Specific Fields */}
          {isMigraineSelected && (
              <div className="bg-purple-50 dark:bg-purple-900/30 p-4 rounded-lg border border-purple-200 dark:border-purple-800 space-y-4">
                <h3 className="font-medium text-purple-900 dark:text-purple-200">Migraine Details</h3>
                <p className="text-xs text-purple-700 dark:text-purple-300">These details align with VA rating criteria</p>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Duration</label>
                  <select value={migraineData.duration}
                          onChange={(e) => setMigraineData(prev => ({ ...prev, duration: e.target.value }))}
                          className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white">
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
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Was this migraine prostrating? <span className="text-red-500">*</span>
                  </label>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">Prostrating = unable to perform normal activities</p>
                  <div className="flex gap-3">
                    <button type="button"
                            onClick={() => setMigraineData(prev => ({ ...prev, prostrating: true }))}
                            className={`flex-1 py-2 px-4 rounded-lg border-2 font-medium ${
                                migraineData.prostrating === true
                                    ? 'bg-red-100 dark:bg-red-900/50 border-red-500 text-red-700 dark:text-red-300'
                                    : 'bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300'
                            }`}>
                      Yes, prostrating
                    </button>
                    <button type="button"
                            onClick={() => setMigraineData(prev => ({ ...prev, prostrating: false }))}
                            className={`flex-1 py-2 px-4 rounded-lg border-2 font-medium ${
                                migraineData.prostrating === false
                                    ? 'bg-green-100 dark:bg-green-900/50 border-green-500 text-green-700 dark:text-green-300'
                                    : 'bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300'
                            }`}>
                      No
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Associated Symptoms</label>
                  <div className="grid grid-cols-2 gap-2">
                    {[
                      { key: 'aura', label: 'Aura' },
                      { key: 'nausea', label: 'Nausea' },
                      { key: 'lightSensitivity', label: 'Light sensitivity' },
                      { key: 'soundSensitivity', label: 'Sound sensitivity' },
                    ].map(({ key, label }) => (
                        <label key={key} className={`flex items-center gap-2 p-2 rounded-lg border cursor-pointer ${
                            migraineData[key] ? 'bg-purple-100 dark:bg-purple-900/50 border-purple-300 dark:border-purple-700' : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700'
                        }`}>
                          <input type="checkbox" checked={migraineData[key]}
                                 onChange={(e) => setMigraineData(prev => ({ ...prev, [key]: e.target.checked }))}
                                 className="w-4 h-4 text-purple-600 rounded" />
                          <span className="text-sm text-gray-700 dark:text-gray-300">{label}</span>
                        </label>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Known Triggers</label>
                  <input type="text" value={migraineData.triggers}
                         onChange={(e) => setMigraineData(prev => ({ ...prev, triggers: e.target.value }))}
                         placeholder="e.g., stress, bright lights"
                         className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white" />
                </div>
              </div>
          )}

          {/* Sleep-Specific Fields */}
          {(isSleepSelected || isNightmareSelected) && (
              <div className="bg-indigo-50 dark:bg-indigo-900/30 p-4 rounded-lg border border-indigo-200 dark:border-indigo-800 space-y-4">
                <h3 className="font-medium text-indigo-900 dark:text-indigo-200">Sleep Details</h3>
                <p className="text-xs text-indigo-700 dark:text-indigo-300">Track sleep patterns for VA claims documentation</p>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Hours Slept</label>
                    <input type="number" min="0" max="24" step="0.5"
                           value={sleepData.hoursSlept}
                           onChange={(e) => setSleepData(prev => ({ ...prev, hoursSlept: e.target.value }))}
                           placeholder="Hours"
                           className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Times Woken Up</label>
                    <input type="number" min="0" max="20"
                           value={sleepData.wakeUps}
                           onChange={(e) => setSleepData(prev => ({ ...prev, wakeUps: e.target.value }))}
                           placeholder="Times"
                           className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white" />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Sleep Quality: {sleepData.quality}/10
                  </label>
                  <input type="range" min="0" max="10" value={sleepData.quality}
                         onChange={(e) => setSleepData(prev => ({ ...prev, quality: Number(e.target.value) }))}
                         className="w-full" />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Sleep Issues</label>
                  <div className="grid grid-cols-1 gap-2">
                    {[
                      { key: 'troubleFallingAsleep', label: 'Trouble falling asleep' },
                      { key: 'troubleStayingAsleep', label: 'Trouble staying asleep' },
                      { key: 'nightmares', label: 'Nightmares/night terrors' },
                    ].map(({ key, label }) => (
                        <label key={key} className={`flex items-center gap-2 p-2 rounded-lg border cursor-pointer ${
                            sleepData[key] ? 'bg-indigo-100 dark:bg-indigo-900/50 border-indigo-300 dark:border-indigo-700' : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700'
                        }`}>
                          <input type="checkbox" checked={sleepData[key]}
                                 onChange={(e) => setSleepData(prev => ({ ...prev, [key]: e.target.checked }))}
                                 className="w-4 h-4 text-indigo-600 rounded" />
                          <span className="text-sm text-gray-700 dark:text-gray-300">{label}</span>
                        </label>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Feel rested upon waking?</label>
                  <div className="flex gap-3">
                    <button type="button"
                            onClick={() => setSleepData(prev => ({ ...prev, feelRested: true }))}
                            className={`flex-1 py-2 px-4 rounded-lg border-2 font-medium ${
                                sleepData.feelRested === true
                                    ? 'bg-green-100 dark:bg-green-900/50 border-green-500 text-green-700 dark:text-green-300'
                                    : 'bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300'
                            }`}>Yes</button>
                    <button type="button"
                            onClick={() => setSleepData(prev => ({ ...prev, feelRested: false }))}
                            className={`flex-1 py-2 px-4 rounded-lg border-2 font-medium ${
                                sleepData.feelRested === false
                                    ? 'bg-red-100 dark:bg-red-900/50 border-red-500 text-red-700 dark:text-red-300'
                                    : 'bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300'
                            }`}>No</button>
                  </div>
                </div>
              </div>
          )}

          {/* PTSD-Related Fields */}
          {isPTSDRelated && (
              <div className="bg-amber-50 dark:bg-amber-900/30 p-4 rounded-lg border border-amber-200 dark:border-amber-800 space-y-4">
                <h3 className="font-medium text-amber-900 dark:text-amber-200">Mental Health Details</h3>
                <p className="text-xs text-amber-700 dark:text-amber-300">These align with PTSD rating criteria</p>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Associated Experiences</label>
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
                            ptsdData[key] ? 'bg-amber-100 dark:bg-amber-900/50 border-amber-300 dark:border-amber-700' : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700'
                        }`}>
                          <input type="checkbox" checked={ptsdData[key]}
                                 onChange={(e) => setPtsdData(prev => ({ ...prev, [key]: e.target.checked }))}
                                 className="w-4 h-4 text-amber-600 rounded" />
                          <span className="text-sm text-gray-700 dark:text-gray-300">{label}</span>
                        </label>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Trigger (if known)
                  </label>
                  <input type="text" value={ptsdData.triggerDescription}
                         onChange={(e) => setPtsdData(prev => ({ ...prev, triggerDescription: e.target.value }))}
                         placeholder="What triggered this episode?"
                         className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white" />
                </div>
              </div>
          )}

          {/* Pain-Specific Fields */}
          {isPainSelected && (
              <div className="bg-rose-50 dark:bg-rose-900/30 p-4 rounded-lg border border-rose-200 dark:border-rose-800 space-y-4">
                <h3 className="font-medium text-rose-900 dark:text-rose-200">Pain Details</h3>
                <p className="text-xs text-rose-700 dark:text-rose-300">Document impact on daily activities for VA claims</p>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Pain Type</label>
                  <select value={painData.painType}
                          onChange={(e) => setPainData(prev => ({ ...prev, painType: e.target.value }))}
                          className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white">
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
                      painData.radiating ? 'bg-rose-100 dark:bg-rose-900/50 border-rose-300 dark:border-rose-700' : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700'
                  }`}>
                    <input type="checkbox" checked={painData.radiating}
                           onChange={(e) => setPainData(prev => ({ ...prev, radiating: e.target.checked }))}
                           className="w-4 h-4 text-rose-600 rounded" />
                    <span className="text-sm text-gray-700 dark:text-gray-300">Radiating pain</span>
                  </label>
                  <label className={`flex items-center gap-2 p-2 rounded-lg border cursor-pointer ${
                      painData.limitedRangeOfMotion ? 'bg-rose-100 dark:bg-rose-900/50 border-rose-300 dark:border-rose-700' : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700'
                  }`}>
                    <input type="checkbox" checked={painData.limitedRangeOfMotion}
                           onChange={(e) => setPainData(prev => ({ ...prev, limitedRangeOfMotion: e.target.checked }))}
                           className="w-4 h-4 text-rose-600 rounded" />
                    <span className="text-sm text-gray-700 dark:text-gray-300">Limited ROM</span>
                  </label>
                </div>

                {painData.radiating && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Radiates to</label>
                      <input type="text" value={painData.radiatingTo}
                             onChange={(e) => setPainData(prev => ({ ...prev, radiatingTo: e.target.value }))}
                             placeholder="e.g., down left leg, into shoulder"
                             className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white" />
                    </div>
                )}

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Activities Affected</label>
                  <div className="grid grid-cols-2 gap-2">
                    {['Walking', 'Standing', 'Sitting', 'Sleeping', 'Lifting', 'Bending', 'Driving', 'Working'].map(activity => (
                        <label key={activity} className={`flex items-center gap-2 p-2 rounded-lg border cursor-pointer ${
                            painData.affectedActivities.includes(activity) ? 'bg-rose-100 dark:bg-rose-900/50 border-rose-300 dark:border-rose-700' : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700'
                        }`}>
                          <input type="checkbox" checked={painData.affectedActivities.includes(activity)}
                                 onChange={() => toggleActivity(activity)}
                                 className="w-4 h-4 text-rose-600 rounded" />
                          <span className="text-sm text-gray-700 dark:text-gray-300">{activity}</span>
                        </label>
                    ))}
                  </div>
                </div>
              </div>
          )}

          {/* Severity Slider */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Severity Level</label>
            <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
              <input type="range" min="0" max="10" value={severity}
                     onChange={(e) => setSeverity(Number(e.target.value))}
                     className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer" />
              <div className="flex justify-between mt-2">
                <span className="text-xs text-gray-500 dark:text-gray-400">0</span>
                <span className={`text-lg font-bold ${severityInfo.color}`}>
                {severity} - {severityInfo.label}
              </span>
                <span className="text-xs text-gray-500 dark:text-gray-400">10</span>
              </div>
            </div>
          </div>

          {/* Medication Taken */}
          {medications.length > 0 && selectedSymptom && (
              <div className="bg-teal-50 dark:bg-teal-900/30 p-4 rounded-lg border border-teal-200 dark:border-teal-800">
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
                  <span className="font-medium text-teal-900 dark:text-teal-200">I took medication for this</span>
                </label>

                {tookMedication && (
                    <div className="mt-3 space-y-2">
                      <p className="text-sm text-teal-700 dark:text-teal-300">Select all that apply:</p>
                      {medications.filter(m => m.isActive).map(med => (
                          <label
                              key={med.id}
                              className={`flex items-center gap-2 p-2 rounded-lg border cursor-pointer transition-colors ${
                                  selectedMedications.includes(med.id)
                                      ? 'bg-teal-100 dark:bg-teal-900/50 border-teal-400 dark:border-teal-600'
                                      : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 hover:border-teal-300 dark:hover:border-teal-600'
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
                            <span className="text-sm text-gray-700 dark:text-gray-300">
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
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Notes (optional)</label>
            <textarea value={notes} onChange={(e) => setNotes(e.target.value)}
                      placeholder="What were you doing? What made it better or worse?"
                      rows={3}
                      className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500" />
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Detailed notes help build stronger claims</p>
          </div>

          {/* Submit Button */}
          <button type="submit" disabled={!selectedSymptom}
                  className="w-full py-3 px-4 bg-blue-900 dark:bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-800 dark:hover:bg-blue-700 disabled:bg-gray-300 dark:disabled:bg-gray-700 disabled:cursor-not-allowed transition-colors">
            Log Symptom
          </button>
        </form>
      </div>
  );
};

export default SymptomLogger;