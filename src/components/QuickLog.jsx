import { useState, useEffect } from 'react';
import { getChronicSymptoms, removeChronicSymptom, saveSymptomLog, getMedications, logMedicationTaken, getSymptomLogs } from '../utils/storage';

const QuickLog = ({ onLogSaved, onAddChronic }) => {
  const [chronicSymptoms, setChronicSymptoms] = useState([]);
  const [medications, setMedications] = useState([]);
  const [showSuccess, setShowSuccess] = useState('');
  const [editMode, setEditMode] = useState(false);

  // Phase 1G - Recent symptoms & search
  const [recentSymptoms, setRecentSymptoms] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [symptomFrequency, setSymptomFrequency] = useState({});


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

  const [giData, setGIData] = useState({
    bristolScale: null,
    frequencyPerDay: '',
    urgencyLevel: '',
    bloodPresent: null,
    bloatingSeverity: '',
    abdominalPainLocation: '',
    mealRelated: null,
    nighttimeSymptoms: false,
  });

  const [respiratoryData, setRespiratoryData] = useState({
    rescueInhalerUsed: null,
    inhalerPuffs: '',
    peakFlow: '',
    spo2: '',
    activityTrigger: '',
    wheezing: false,
    chestTightness: false,
    coughing: false,
  });

  const [jointData, setJointData] = useState({
    joint: '',
    side: '',
    romEstimate: '',
    morningStiffness: '',
    swelling: false,
    instability: false,
    locking: false,
    grinding: false,
  });

  const [seizureData, setSeizureData] = useState({
    episodeType: '',
    duration: '',
    lossOfConsciousness: null,
    auraPresent: null,
    recoveryTime: '',
    witnessPresent: null,
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    setChronicSymptoms(getChronicSymptoms());
    setMedications(getMedications());

    // Phase 1G - Load recent symptoms and calculate frequency
    const allLogs = getSymptomLogs();

    // Get last 10 unique symptoms logged
    const uniqueSymptoms = [];
    const seenIds = new Set();
    for (let i = allLogs.length - 1; i >= 0 && uniqueSymptoms.length < 10; i--) {
      const log = allLogs[i];
      if (!seenIds.has(log.symptomId)) {
        uniqueSymptoms.push({
          symptomId: log.symptomId,
          symptomName: log.symptomName,
          category: log.category,
          lastLogged: log.timestamp
        });
        seenIds.add(log.symptomId);
      }
    }
    setRecentSymptoms(uniqueSymptoms);

    // Calculate frequency (how many times each symptom logged in last 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const frequency = {};
    allLogs.forEach(log => {
      if (new Date(log.timestamp) >= thirtyDaysAgo) {
        frequency[log.symptomId] = (frequency[log.symptomId] || 0) + 1;
      }
    });
    setSymptomFrequency(frequency);
  };

  // Determine symptom type - EXPANDED DETECTION
  const isMigraine = selectedChronic?.symptomId === 'migraine';

  // Sleep: match sleep-related symptoms only
  const isSleepRelated = selectedChronic?.symptomId?.includes('sleep') ||
      selectedChronic?.symptomId?.includes('insomnia') ||
      ['sleep-issues', 'nightmares'].includes(selectedChronic?.symptomId);

  // PTSD/Mental Health: broader matching (symptom only)
  const isPTSDRelated = selectedChronic?.symptomId?.includes('anxiety') ||
      selectedChronic?.symptomId?.includes('ptsd') ||
      selectedChronic?.symptomId?.includes('panic') ||
      selectedChronic?.symptomId?.includes('depression') ||
      selectedChronic?.symptomId?.includes('mood') ||
      ['hypervigilance', 'nightmares', 'irritability', 'flashbacks', 'intrusive-thoughts',
        'avoidance', 'emotional-numbness', 'startle-response', 'concentration-problems',
        'social-withdrawal', 'hopelessness', 'guilt', 'anger-outbursts'].includes(selectedChronic?.symptomId);

  // Pain: match ANY pain-related symptom only
  const isPainRelated = selectedChronic?.symptomId?.includes('pain') ||
      selectedChronic?.symptomId?.includes('-ache') ||
      selectedChronic?.symptomId?.includes('stiff') ||
      ['sciatica', 'radiculopathy', 'stenosis', 'arthritis', 'bursitis', 'tendinitis',
        'strain', 'sprain', 'rom-limited', 'swelling', 'instability', 'weakness',
        'numbness', 'tingling', 'cramping', 'spasms', 'plantar-fasciitis', 'ddd',
        'spondylosis', 'spondylolisthesis', 'herniated', 'bulging'].some(term => selectedChronic?.symptomId?.includes(term));

  // GI: match GI-related symptoms
  const isGIRelated = selectedChronic?.symptomId?.startsWith('ibs') ||
      selectedChronic?.symptomId?.startsWith('gerd') ||
      selectedChronic?.symptomId?.startsWith('uc-') ||
      selectedChronic?.symptomId?.startsWith('ulcer-') ||
      selectedChronic?.symptomId?.startsWith('hemorrhoid') ||
      selectedChronic?.symptomId?.startsWith('divertic') ||
      ['diarrhea', 'constipation', 'bloating', 'abdominal-pain', 'nausea', 'rectal-bleeding'].includes(selectedChronic?.symptomId);

  // Respiratory: match respiratory symptoms
  const isRespiratoryRelated = selectedChronic?.symptomId?.startsWith('asthma-') ||
      selectedChronic?.symptomId?.startsWith('copd-') ||
      selectedChronic?.symptomId?.startsWith('apnea-') ||
      selectedChronic?.symptomId?.startsWith('emphysema-') ||
      selectedChronic?.symptomId?.startsWith('bronchitis-') ||
      selectedChronic?.symptomId?.includes('breathing') ||
      selectedChronic?.symptomId?.includes('wheez') ||
      selectedChronic?.symptomId?.includes('cough') ||
      ['shortness-breath', 'dyspnea', 'chest-tightness', 'respiratory-distress'].includes(selectedChronic?.symptomId);

  // Joint: match joint-related symptoms
  const isJointRelated = selectedChronic?.symptomId?.startsWith('shoulder-') ||
      selectedChronic?.symptomId?.startsWith('knee-') ||
      selectedChronic?.symptomId?.startsWith('hip-') ||
      selectedChronic?.symptomId?.startsWith('ankle-') ||
      selectedChronic?.symptomId?.startsWith('elbow-') ||
      selectedChronic?.symptomId?.startsWith('wrist-') ||
      selectedChronic?.symptomId?.startsWith('hand-') ||
      selectedChronic?.symptomId?.startsWith('finger-') ||
      selectedChronic?.symptomId?.startsWith('foot-') ||
      selectedChronic?.symptomId?.startsWith('toe-') ||
      selectedChronic?.symptomId?.includes('joint') ||
      selectedChronic?.symptomId?.includes('arthritis') ||
      selectedChronic?.symptomId?.includes('bursitis') ||
      selectedChronic?.symptomId?.includes('tendinitis') ||
      ['rom-limited', 'swelling', 'instability', 'grinding', 'locking'].includes(selectedChronic?.symptomId);

  // Seizure: match seizure-related symptoms
  const isSeizureRelated = selectedChronic?.symptomId?.includes('seizure') ||
      selectedChronic?.symptomId?.includes('epilep') ||
      selectedChronic?.symptomId?.includes('convuls') ||
      selectedChronic?.symptomId?.startsWith('seizure-') ||
      ['absence-seizure', 'tonic-clonic', 'focal-seizure', 'grand-mal', 'petit-mal'].includes(selectedChronic?.symptomId);

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
    setGIData({
      bristolScale: null, frequencyPerDay: '', urgencyLevel: '', bloodPresent: null,
      bloatingSeverity: '', abdominalPainLocation: '', mealRelated: null, nighttimeSymptoms: false,
    });
    setRespiratoryData({
      rescueInhalerUsed: null, inhalerPuffs: '', peakFlow: '', spo2: '',
      activityTrigger: '', wheezing: false, chestTightness: false, coughing: false,
    });
    setJointData({
      joint: '', side: '', romEstimate: '', morningStiffness: '',
      swelling: false, instability: false, locking: false, grinding: false,
    });
    setSeizureData({
      episodeType: '', duration: '', lossOfConsciousness: null,
      auraPresent: null, recoveryTime: '', witnessPresent: null,
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
    if (isGIRelated) {
      entry.giData = { ...giData };
    }
    if (isRespiratoryRelated) {
      entry.respiratoryData = { ...respiratoryData };
    }
    if (isJointRelated) {
      entry.jointData = { ...jointData };
    }
    if (isSeizureRelated) {
      entry.seizureData = { ...seizureData };
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

  // Phase 1G - Filter chronic symptoms by search term
  const filteredChronicSymptoms = chronicSymptoms.filter(symptom =>
      symptom.symptomName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      symptom.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

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

          {/* Phase 1G - Search box */}
          {chronicSymptoms.length >= 2 && (
              <div className="mb-3">
                <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Search chronic symptoms..."
                    className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
          )}

          {/* Phase 1G - Recent Symptoms */}
          {!editMode && recentSymptoms.length > 0 && searchTerm === '' && (
              <div className="mb-4 pb-4 border-b border-gray-200 dark:border-gray-700">
                <p className="text-xs font-medium text-gray-600 dark:text-gray-400 mb-2">📋 Recently Logged</p>
                <div className="flex flex-wrap gap-1.5">
                  {recentSymptoms.slice(0, 5).map((symptom) => {
                    const frequency = symptomFrequency[symptom.symptomId] || 0;
                    return (
                        <button
                            key={symptom.symptomId}
                            onClick={() => {
                              const chronicMatch = chronicSymptoms.find(c => c.symptomId === symptom.symptomId);
                              if (chronicMatch) {
                                handleOpenLogModal(chronicMatch);
                              }
                            }}
                            className="px-2 py-1 bg-blue-100 dark:bg-blue-900/50 text-blue-800 dark:text-blue-200 rounded-full text-xs hover:bg-blue-200 dark:hover:bg-blue-900 transition-colors flex items-center gap-1"
                        >
                          <span>{symptom.symptomName}</span>
                          {frequency > 1 && (
                              <span className="bg-blue-200 dark:bg-blue-800 px-1.5 rounded-full font-semibold">
                                {frequency}
                              </span>
                          )}
                        </button>
                    );
                  })}
                </div>
              </div>
          )}

          <div className="grid grid-cols-2 gap-2">
            {filteredChronicSymptoms.map((chronic) => (
                <div key={chronic.symptomId} className="relative">
                  {/* Success overlay */}
                  {showSuccess === chronic.symptomId && (
                      <div className="absolute inset-0 bg-green-500 rounded-lg flex items-center justify-center z-10">
                        <span className="text-white font-medium">✓ Logged!</span>
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
                          ✓
                        </button>
                    )}

                    {/* Phase 1G - Frequency badge */}
                    {!editMode && symptomFrequency[chronic.symptomId] > 0 && (
                        <div className="absolute -top-1.5 -right-1.5 bg-gradient-to-r from-blue-500 to-blue-600 text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center shadow-lg">
                          {symptomFrequency[chronic.symptomId]}
                        </div>
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
                      ✓
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

                  {/* GI-SPECIFIC FIELDS */}
                  {isGIRelated && (
                      <div className="bg-amber-50 dark:bg-amber-900/20 p-4 rounded-lg border border-amber-200 dark:border-amber-800 space-y-3">
                        <h3 className="font-medium text-amber-900 dark:text-amber-200 text-sm">GI Details</h3>

                        <div className="grid grid-cols-2 gap-2">
                          <div>
                            <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                              Episodes Today
                            </label>
                            <input
                                type="number"
                                min="0"
                                value={giData.frequencyPerDay}
                                onChange={(e) => setGIData(prev => ({ ...prev, frequencyPerDay: e.target.value }))}
                                placeholder="#"
                                className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm"
                            />
                          </div>
                          <div>
                            <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                              Urgency
                            </label>
                            <select
                                value={giData.urgencyLevel}
                                onChange={(e) => setGIData(prev => ({ ...prev, urgencyLevel: e.target.value }))}
                                className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm"
                            >
                              <option value="">...</option>
                              <option value="none">None</option>
                              <option value="mild">Mild</option>
                              <option value="moderate">Moderate</option>
                              <option value="severe">Severe</option>
                              <option value="incontinence">Incontinence</option>
                            </select>
                          </div>
                        </div>
                      </div>
                  )}

                  {/* RESPIRATORY-SPECIFIC FIELDS */}
                  {isRespiratoryRelated && (
                      <div className="bg-sky-50 dark:bg-sky-900/30 p-4 rounded-lg border border-sky-200 dark:border-sky-800 space-y-3">
                        <h3 className="font-medium text-sky-900 dark:text-sky-200 text-sm">Respiratory Details</h3>

                        <div>
                          <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Rescue Inhaler?
                          </label>
                          <div className="grid grid-cols-2 gap-2">
                            <button
                                type="button"
                                onClick={() => setRespiratoryData(prev => ({ ...prev, rescueInhalerUsed: true }))}
                                className={`p-2 rounded-lg border text-sm ${
                                    respiratoryData.rescueInhalerUsed === true
                                        ? 'bg-sky-100 dark:bg-sky-900/50 border-sky-400 text-sky-900 dark:text-sky-200'
                                        : 'bg-white dark:bg-gray-800 border-gray-200 text-gray-700 dark:text-gray-300'
                                }`}
                            >
                              Yes
                            </button>
                            <button
                                type="button"
                                onClick={() => setRespiratoryData(prev => ({ ...prev, rescueInhalerUsed: false, inhalerPuffs: '' }))}
                                className={`p-2 rounded-lg border text-sm ${
                                    respiratoryData.rescueInhalerUsed === false
                                        ? 'bg-sky-100 dark:bg-sky-900/50 border-sky-400 text-sky-900 dark:text-sky-200'
                                        : 'bg-white dark:bg-gray-800 border-gray-200 text-gray-700 dark:text-gray-300'
                                }`}
                            >
                              No
                            </button>
                          </div>
                        </div>

                        {respiratoryData.rescueInhalerUsed === true && (
                            <div>
                              <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                                # Puffs
                              </label>
                              <input
                                  type="number"
                                  min="1"
                                  max="20"
                                  value={respiratoryData.inhalerPuffs}
                                  onChange={(e) => setRespiratoryData(prev => ({ ...prev, inhalerPuffs: e.target.value }))}
                                  placeholder="2"
                                  className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm"
                              />
                            </div>
                        )}

                        <div className="grid grid-cols-2 gap-2">
                          <div>
                            <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                              Peak Flow
                            </label>
                            <input
                                type="number"
                                value={respiratoryData.peakFlow}
                                onChange={(e) => setRespiratoryData(prev => ({ ...prev, peakFlow: e.target.value }))}
                                placeholder="L/min"
                                className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm"
                            />
                          </div>
                          <div>
                            <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                              SpO2
                            </label>
                            <input
                                type="number"
                                value={respiratoryData.spo2}
                                onChange={(e) => setRespiratoryData(prev => ({ ...prev, spo2: e.target.value }))}
                                placeholder="%"
                                className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm"
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-3 gap-2">
                          <label className={`flex items-center gap-1 p-2 rounded border cursor-pointer text-xs ${
                              respiratoryData.wheezing
                                  ? 'bg-sky-100 dark:bg-sky-900/50 border-sky-300'
                                  : 'bg-white dark:bg-gray-800 border-gray-200'
                          }`}>
                            <input
                                type="checkbox"
                                checked={respiratoryData.wheezing}
                                onChange={(e) => setRespiratoryData(prev => ({ ...prev, wheezing: e.target.checked }))}
                                className="w-3 h-3 text-sky-600 rounded"
                            />
                            <span className="text-gray-700 dark:text-gray-300">Wheeze</span>
                          </label>
                          <label className={`flex items-center gap-1 p-2 rounded border cursor-pointer text-xs ${
                              respiratoryData.chestTightness
                                  ? 'bg-sky-100 dark:bg-sky-900/50 border-sky-300'
                                  : 'bg-white dark:bg-gray-800 border-gray-200'
                          }`}>
                            <input
                                type="checkbox"
                                checked={respiratoryData.chestTightness}
                                onChange={(e) => setRespiratoryData(prev => ({ ...prev, chestTightness: e.target.checked }))}
                                className="w-3 h-3 text-sky-600 rounded"
                            />
                            <span className="text-gray-700 dark:text-gray-300">Tight</span>
                          </label>
                          <label className={`flex items-center gap-1 p-2 rounded border cursor-pointer text-xs ${
                              respiratoryData.coughing
                                  ? 'bg-sky-100 dark:bg-sky-900/50 border-sky-300'
                                  : 'bg-white dark:bg-gray-800 border-gray-200'
                          }`}>
                            <input
                                type="checkbox"
                                checked={respiratoryData.coughing}
                                onChange={(e) => setRespiratoryData(prev => ({ ...prev, coughing: e.target.checked }))}
                                className="w-3 h-3 text-sky-600 rounded"
                            />
                            <span className="text-gray-700 dark:text-gray-300">Cough</span>
                          </label>
                        </div>
                      </div>
                  )}

                  {/* JOINT-SPECIFIC FIELDS */}
                  {isJointRelated && (
                      <div className="bg-indigo-50 dark:bg-indigo-900/30 p-4 rounded-lg border border-indigo-200 dark:border-indigo-800 space-y-3">
                        <h3 className="font-medium text-indigo-900 dark:text-indigo-200 text-sm">Joint Details</h3>

                        <div className="grid grid-cols-2 gap-2">
                          <div>
                            <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                              Joint
                            </label>
                            <select
                                value={jointData.joint}
                                onChange={(e) => setJointData(prev => ({ ...prev, joint: e.target.value }))}
                                className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm"
                            >
                              <option value="">...</option>
                              <option value="shoulder">Shoulder</option>
                              <option value="elbow">Elbow</option>
                              <option value="wrist">Wrist</option>
                              <option value="hip">Hip</option>
                              <option value="knee">Knee</option>
                              <option value="ankle">Ankle</option>
                            </select>
                          </div>

                          <div>
                            <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                              Side
                            </label>
                            <select
                                value={jointData.side}
                                onChange={(e) => setJointData(prev => ({ ...prev, side: e.target.value }))}
                                className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm"
                            >
                              <option value="">...</option>
                              <option value="left">Left</option>
                              <option value="right">Right</option>
                              <option value="bilateral">Both</option>
                            </select>
                          </div>
                        </div>

                        <div>
                          <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                            ROM
                          </label>
                          <select
                              value={jointData.romEstimate}
                              onChange={(e) => setJointData(prev => ({ ...prev, romEstimate: e.target.value }))}
                              className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm"
                          >
                            <option value="">...</option>
                            <option value="full">Full</option>
                            <option value="slightly">Slightly limited</option>
                            <option value="moderately">Moderate</option>
                            <option value="severely">Severe</option>
                          </select>
                        </div>

                        <div className="grid grid-cols-2 gap-2">
                          <label className={`flex items-center gap-1 p-2 rounded border cursor-pointer text-xs ${
                              jointData.swelling
                                  ? 'bg-indigo-100 dark:bg-indigo-900/50 border-indigo-300'
                                  : 'bg-white dark:bg-gray-800 border-gray-200'
                          }`}>
                            <input
                                type="checkbox"
                                checked={jointData.swelling}
                                onChange={(e) => setJointData(prev => ({ ...prev, swelling: e.target.checked }))}
                                className="w-3 h-3 text-indigo-600 rounded"
                            />
                            <span className="text-gray-700 dark:text-gray-300">Swelling</span>
                          </label>
                          <label className={`flex items-center gap-1 p-2 rounded border cursor-pointer text-xs ${
                              jointData.instability
                                  ? 'bg-indigo-100 dark:bg-indigo-900/50 border-indigo-300'
                                  : 'bg-white dark:bg-gray-800 border-gray-200'
                          }`}>
                            <input
                                type="checkbox"
                                checked={jointData.instability}
                                onChange={(e) => setJointData(prev => ({ ...prev, instability: e.target.checked }))}
                                className="w-3 h-3 text-indigo-600 rounded"
                            />
                            <span className="text-gray-700 dark:text-gray-300">Unstable</span>
                          </label>
                        </div>
                      </div>
                  )}

                  {/* SEIZURE-SPECIFIC FIELDS */}
                  {isSeizureRelated && (
                      <div className="bg-purple-50 dark:bg-purple-900/30 p-4 rounded-lg border border-purple-200 dark:border-purple-800 space-y-3">
                        <h3 className="font-medium text-purple-900 dark:text-purple-200 text-sm">Episode Details</h3>

                        <div>
                          <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Type
                          </label>
                          <select
                              value={seizureData.episodeType}
                              onChange={(e) => setSeizureData(prev => ({ ...prev, episodeType: e.target.value }))}
                              className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm"
                          >
                            <option value="">...</option>
                            <option value="generalized">Generalized</option>
                            <option value="partial">Partial</option>
                            <option value="absence">Absence</option>
                            <option value="other">Other</option>
                          </select>
                        </div>

                        <div>
                          <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Duration (sec)
                          </label>
                          <input
                              type="number"
                              min="0"
                              value={seizureData.duration}
                              onChange={(e) => setSeizureData(prev => ({ ...prev, duration: e.target.value }))}
                              placeholder="seconds"
                              className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Loss of Consciousness?
                          </label>
                          <div className="grid grid-cols-3 gap-1">
                            <button
                                type="button"
                                onClick={() => setSeizureData(prev => ({ ...prev, lossOfConsciousness: 'yes' }))}
                                className={`p-2 rounded border text-xs ${
                                    seizureData.lossOfConsciousness === 'yes'
                                        ? 'bg-purple-100 dark:bg-purple-900/50 border-purple-400 text-purple-900 dark:text-purple-200'
                                        : 'bg-white dark:bg-gray-800 border-gray-200 text-gray-700 dark:text-gray-300'
                                }`}
                            >Yes</button>
                            <button
                                type="button"
                                onClick={() => setSeizureData(prev => ({ ...prev, lossOfConsciousness: 'partial' }))}
                                className={`p-2 rounded border text-xs ${
                                    seizureData.lossOfConsciousness === 'partial'
                                        ? 'bg-purple-100 dark:bg-purple-900/50 border-purple-400 text-purple-900 dark:text-purple-200'
                                        : 'bg-white dark:bg-gray-800 border-gray-200 text-gray-700 dark:text-gray-300'
                                }`}
                            >Partial</button>
                            <button
                                type="button"
                                onClick={() => setSeizureData(prev => ({ ...prev, lossOfConsciousness: 'no' }))}
                                className={`p-2 rounded border text-xs ${
                                    seizureData.lossOfConsciousness === 'no'
                                        ? 'bg-purple-100 dark:bg-purple-900/50 border-purple-400 text-purple-900 dark:text-purple-200'
                                        : 'bg-white dark:bg-gray-800 border-gray-200 text-gray-700 dark:text-gray-300'
                                }`}
                            >No</button>
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-2">
                          <label className={`flex items-center gap-1 p-2 rounded border cursor-pointer text-xs ${
                              seizureData.auraPresent === true
                                  ? 'bg-purple-100 dark:bg-purple-900/50 border-purple-300'
                                  : 'bg-white dark:bg-gray-800 border-gray-200'
                          }`}>
                            <input
                                type="checkbox"
                                checked={seizureData.auraPresent === true}
                                onChange={(e) => setSeizureData(prev => ({ ...prev, auraPresent: e.target.checked }))}
                                className="w-3 h-3 text-purple-600 rounded"
                            />
                            <span className="text-gray-700 dark:text-gray-300">Aura</span>
                          </label>
                          <label className={`flex items-center gap-1 p-2 rounded border cursor-pointer text-xs ${
                              seizureData.witnessPresent === true
                                  ? 'bg-purple-100 dark:bg-purple-900/50 border-purple-300'
                                  : 'bg-white dark:bg-gray-800 border-gray-200'
                          }`}>
                            <input
                                type="checkbox"
                                checked={seizureData.witnessPresent === true}
                                onChange={(e) => setSeizureData(prev => ({ ...prev, witnessPresent: e.target.checked }))}
                                className="w-3 h-3 text-purple-600 rounded"
                            />
                            <span className="text-gray-700 dark:text-gray-300">Witness</span>
                          </label>
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