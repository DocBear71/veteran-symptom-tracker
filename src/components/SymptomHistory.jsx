import { useRef, useState, useEffect } from 'react';
import { Calendar, Clock, Edit2, Trash2, ChevronDown, ChevronUp, Filter, History } from 'lucide-react';
import { getSymptomLogs, deleteSymptomLog, getMedicationLogsForSymptom, getOccurrenceTime, isBackDated } from '../utils/storage';
import { useProfile } from '../hooks/useProfile';
import EditLogModal from './EditLogModal';
import AppointmentForm from './AppointmentForm';
import AppointmentHistory from './AppointmentHistory';

const SymptomHistory = ({ onCopyLog }) => {
  const [logs, setLogs] = useState([]);
  const [filter, setFilter] = useState('all');
  const [editingLog, setEditingLog] = useState(null);

  // Main tab: symptoms vs appointments
  const [mainTab, setMainTab] = useState('symptoms');
  // Sub-tab for appointments
  const [appointmentTab, setAppointmentTab] = useState('history');

  useEffect(() => {
    loadLogs();
  }, [filter]);

  const loadLogs = () => {
    let allLogs = getSymptomLogs();
    allLogs.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

    // Attach linked medications to each log
    allLogs = allLogs.map(log => ({
      ...log,
      linkedMedications: getMedicationLogsForSymptom(log.id),
    }));

    const now = new Date();
    if (filter === 'today') {
      const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      allLogs = allLogs.filter(log => new Date(log.timestamp) >= today);
    } else if (filter === 'week') {
      const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      allLogs = allLogs.filter(log => new Date(log.timestamp) >= weekAgo);
    }

    setLogs(allLogs);
  };

  const handleDelete = (id) => {
    if (window.confirm('Delete this entry?')) {
      deleteSymptomLog(id);
      loadLogs();
    }
  };

  const formatDate = (timestamp) => {
    return new Date(timestamp).toLocaleDateString('en-US', {
      weekday: 'short', month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit',
    });
  };

  const getSeverityColor = (severity) => {
    if (severity <= 2) return 'bg-green-100 dark:bg-green-900/50 text-green-800 dark:text-green-300';
    if (severity <= 4) return 'bg-yellow-100 dark:bg-yellow-900/50 text-yellow-800 dark:text-yellow-300';
    if (severity <= 6) return 'bg-orange-100 dark:bg-orange-900/50 text-orange-800 dark:text-orange-300';
    if (severity <= 8) return 'bg-red-100 dark:bg-red-900/50 text-red-800 dark:text-red-300';
    return 'bg-red-200 dark:bg-red-900 text-red-900 dark:text-red-200';
  };

  // PHASE 1A: Updated formatDuration to include all new options
  const formatDuration = (duration) => {
    const labels = {
      // Migraine-specific durations
      'less-than-1h': '< 1 hour',
      '1-4h': '1-4 hours',
      '4-24h': '4-24 hours',
      '1-2d': '1-2 days',
      'more-than-2d': '> 2 days',
      'ongoing': 'Ongoing',
      // Universal durations (Phase 1A)
      'just-started': 'Just started',
      'minutes': 'Minutes',
      'hours': 'Hours',
      'days': 'Days',
      'weeks': 'Weeks',
      'months': 'Months+',
    };
    return labels[duration] || duration;
  };

  // PHASE 1A: Format time of day
  const formatTimeOfDay = (timeOfDay) => {
    const labels = {
      'morning': '🌅 Morning',
      'afternoon': '☀️ Afternoon',
      'evening': '🌆 Evening',
      'night': '🌙 Night',
      'all-day': '📅 All Day',
      'varies': '🔄 Varies',
    };
    return labels[timeOfDay] || timeOfDay;
  };

  // PHASE 1B: Format Bristol Scale
  const formatBristolScale = (scale) => {
    const descriptions = {
      1: 'Type 1 (Hard lumps)',
      2: 'Type 2 (Lumpy sausage)',
      3: 'Type 3 (Cracked sausage)',
      4: 'Type 4 (Smooth sausage)',
      5: 'Type 5 (Soft blobs)',
      6: 'Type 6 (Mushy)',
      7: 'Type 7 (Watery)',
    };
    return descriptions[scale] || `Type ${scale}`;
  };

  // PHASE 1B: Format urgency level
  const formatUrgency = (urgency) => {
    const labels = {
      'none': 'No urgency',
      'mild': 'Mild',
      'moderate': 'Moderate',
      'severe': 'Severe',
      'incontinence': '⚠️ Incontinence',
    };
    return labels[urgency] || urgency;
  };

  // PHASE 1B: Format abdominal pain location
  const formatPainLocation = (location) => {
    const labels = {
      'upper-left': 'Upper Left',
      'upper-center': 'Upper Center',
      'upper-right': 'Upper Right',
      'lower-left': 'Lower Left',
      'lower-center': 'Lower Center',
      'lower-right': 'Lower Right',
      'diffuse': 'Diffuse/All Over',
    };
    return labels[location] || location;
  };

  return (
      <div className="pb-20">
        {/* Main Tab Toggle: Symptoms vs Appointments */}
        <div className="flex gap-2 mb-4">
          <button
              onClick={() => setMainTab('symptoms')}
              className={`flex-1 py-2 px-4 rounded-lg font-medium transition-colors ${
                  mainTab === 'symptoms'
                      ? 'bg-blue-900 dark:bg-blue-600 text-white'
                      : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
              }`}
          >
            Symptoms
          </button>
          <button
              onClick={() => setMainTab('appointments')}
              className={`flex-1 py-2 px-4 rounded-lg font-medium transition-colors ${
                  mainTab === 'appointments'
                      ? 'bg-blue-900 dark:bg-blue-600 text-white'
                      : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
              }`}
          >
            Appointments
          </button>
        </div>

        {/* Symptoms Tab Content */}
        {mainTab === 'symptoms' && (
            <>
              {/* Filter Tabs */}
              <div className="flex gap-2 mb-4">
                {['all', 'today', 'week'].map((f) => (
                    <button key={f} onClick={() => setFilter(f)}
                            className={`px-4 py-2 rounded-lg font-medium transition-colors ${filter === f
                                ? 'bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200'
                                : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600'}`}>
                      {f.charAt(0).toUpperCase() + f.slice(1)}
                    </button>
                ))}
              </div>

              {logs.length === 0 ? (
                  <div className="text-center py-12 text-gray-500 dark:text-gray-400">
                    <p>No symptoms logged yet</p>
                    <p className="text-sm">Start tracking to build your history</p>
                  </div>
              ) : (
                  <div className="space-y-3">
                    {logs.map((log) => (
                        <div key={log.id} className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4 shadow-sm">
                          <div className="flex justify-between items-start">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-1 flex-wrap">
                                <span className="font-semibold text-gray-900 dark:text-white">{log.symptomName}</span>
                                <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${getSeverityColor(log.severity)}`}>
                                                    {log.severity}/10
                                                </span>
                                {/* PHASE 1A: Universal Flare-up Badge */}
                                {log.isFlareUp && (
                                    <span className="px-2 py-0.5 bg-orange-200 dark:bg-orange-900 text-orange-800 dark:text-orange-200 rounded-full text-xs font-semibold">
                                                        🔥 Flare-up
                                                    </span>
                                )}
                                {log.updatedAt && <span className="text-xs text-gray-400 dark:text-gray-500">(edited)</span>}
                              </div>

                              {/* Category, Date, and Universal Details */}
                              <div className="flex flex-wrap items-center gap-1 text-xs text-gray-500 dark:text-gray-400 mb-2">
                                <span>{log.category}</span>
                                <span>•</span>
                                <span>{formatDate(getOccurrenceTime(log))}</span>

                                {/* Back-dated indicator */}
                                {isBackDated(log) && (
                                    <span
                                        className="inline-flex items-center gap-1 px-2 py-0.5 bg-amber-100 dark:bg-amber-900/30 text-amber-800 dark:text-amber-300 text-xs rounded-full cursor-help ml-1"
                                        title={`Occurred: ${formatDate(log.occurredAt)}\nLogged: ${formatDate(log.timestamp)}`}
                                    >
                                    <History className="w-3 h-3" />
                                    Back-dated
                                  </span>
                                )}

                                {/* PHASE 1A: Duration */}
                                {log.duration && (
                                    <>
                                      <span>•</span>
                                      <span className="text-gray-600 dark:text-gray-300">{formatDuration(log.duration)}</span>
                                    </>
                                )}
                                {/* PHASE 1A: Time of Day */}
                                {log.timeOfDay && (
                                    <>
                                      <span>•</span>
                                      <span>{formatTimeOfDay(log.timeOfDay)}</span>
                                    </>
                                )}
                              </div>

                              {/* Linked Medications */}
                              {log.linkedMedications && log.linkedMedications.length > 0 && (
                                  <div className="bg-teal-50 dark:bg-teal-900/30 rounded-lg p-2 mb-2">
                                    <p className="text-xs font-medium text-teal-800 dark:text-teal-300 mb-1">💊 Medications taken:</p>
                                    <div className="flex flex-wrap gap-1">
                                      {log.linkedMedications.map((med, idx) => (
                                          <span key={idx} className="px-2 py-0.5 bg-teal-200 dark:bg-teal-800 text-teal-800 dark:text-teal-200 rounded-full text-xs">
                                                                {med.medicationName} {med.dosage}
                                                            </span>
                                      ))}
                                    </div>
                                  </div>
                              )}

                              {/* ============================================ */}
                              {/* PHASE 1B: GI DETAILS DISPLAY */}
                              {/* ============================================ */}
                              {log.giData && (
                                  <div className="bg-amber-50 dark:bg-amber-900/20 rounded-lg p-3 mb-2 text-sm">
                                    <div className="flex flex-wrap gap-2 mb-2">
                                      {/* Bristol Scale */}
                                      {log.giData.bristolScale && (
                                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                              log.giData.bristolScale <= 2 ? 'bg-orange-200 dark:bg-orange-900 text-orange-800 dark:text-orange-200' :
                                                  log.giData.bristolScale <= 4 ? 'bg-green-200 dark:bg-green-900 text-green-800 dark:text-green-200' :
                                                      'bg-yellow-200 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200'
                                          }`}>
                                                                {formatBristolScale(log.giData.bristolScale)}
                                                            </span>
                                      )}
                                      {/* Frequency */}
                                      {log.giData.frequencyPerDay && (
                                          <span className="px-2 py-1 bg-amber-200 dark:bg-amber-800 text-amber-800 dark:text-amber-200 rounded-full text-xs">
                                                                {log.giData.frequencyPerDay}x today
                                                            </span>
                                      )}
                                      {/* Urgency */}
                                      {log.giData.urgencyLevel && log.giData.urgencyLevel !== 'none' && (
                                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                              log.giData.urgencyLevel === 'incontinence' ? 'bg-red-200 dark:bg-red-900 text-red-800 dark:text-red-200' :
                                                  log.giData.urgencyLevel === 'severe' ? 'bg-red-100 dark:bg-red-900/50 text-red-800 dark:text-red-300' :
                                                      'bg-amber-200 dark:bg-amber-800 text-amber-800 dark:text-amber-200'
                                          }`}>
                                                                {formatUrgency(log.giData.urgencyLevel)}
                                                            </span>
                                      )}
                                      {/* Blood Present */}
                                      {log.giData.bloodPresent === true && (
                                          <span className="px-2 py-1 bg-red-200 dark:bg-red-900 text-red-800 dark:text-red-200 rounded-full text-xs font-semibold">
                                                                🩸 Blood present
                                                            </span>
                                      )}
                                    </div>

                                    {/* Additional GI Details */}
                                    <div className="flex flex-wrap gap-1 text-xs text-amber-700 dark:text-amber-300">
                                      {log.giData.bloatingSeverity && log.giData.bloatingSeverity !== 'none' && (
                                          <span>• Bloating: {log.giData.bloatingSeverity}</span>
                                      )}
                                      {log.giData.abdominalPainLocation && (
                                          <span>• Pain: {formatPainLocation(log.giData.abdominalPainLocation)}</span>
                                      )}
                                      {log.giData.mealRelated === true && (
                                          <span>• Worse after eating</span>
                                      )}
                                      {log.giData.nighttimeSymptoms && (
                                          <span>• Nighttime symptoms</span>
                                      )}
                                    </div>
                                  </div>
                              )}

                              {/* Respiratory Details */}
                              {log.respiratoryData && (
                                  <div className="bg-sky-50 dark:bg-sky-900/30 rounded-lg p-3 mb-2 text-sm">
                                    <div className="flex flex-wrap gap-2 mb-2">
                                      {log.respiratoryData.spo2 && (
                                          <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                                              parseInt(log.respiratoryData.spo2) < 90
                                                  ? 'bg-red-200 dark:bg-red-900 text-red-800 dark:text-red-200'
                                                  : parseInt(log.respiratoryData.spo2) < 95
                                                      ? 'bg-yellow-200 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200'
                                                      : 'bg-green-200 dark:bg-green-900 text-green-800 dark:text-green-200'
                                          }`}>
                                            SpO₂: {log.respiratoryData.spo2}%
                                          </span>
                                      )}
                                      {log.respiratoryData.peakFlow && (
                                          <span className="px-2 py-1 bg-sky-200 dark:bg-sky-800 text-sky-800 dark:text-sky-200 rounded-full text-xs">
                                            Peak Flow: {log.respiratoryData.peakFlow} L/min
                                          </span>
                                      )}
                                      {log.respiratoryData.rescueInhalerUsed === true && (
                                          <span className="px-2 py-1 bg-orange-200 dark:bg-orange-800 text-orange-800 dark:text-orange-200 rounded-full text-xs">
                                            🚨 Rescue Inhaler{log.respiratoryData.inhalerPuffs ? `: ${log.respiratoryData.inhalerPuffs} puffs` : ''}
                                          </span>
                                      )}
                                      {log.respiratoryData.activityTrigger && (
                                          <span className="px-2 py-1 bg-sky-200 dark:bg-sky-800 text-sky-800 dark:text-sky-200 rounded-full text-xs">
                                            Trigger: {log.respiratoryData.activityTrigger === 'rest' ? 'At rest' :
                                              log.respiratoryData.activityTrigger === 'mild' ? 'Mild exertion' :
                                                  log.respiratoryData.activityTrigger === 'moderate' ? 'Moderate exertion' :
                                                      log.respiratoryData.activityTrigger === 'severe' ? 'Severe exertion' :
                                                          log.respiratoryData.activityTrigger}
                                          </span>
                                      )}
                                    </div>
                                    <div className="flex flex-wrap gap-1 text-xs text-sky-700 dark:text-sky-300">
                                      {log.respiratoryData.wheezing && <span>• Wheezing</span>}
                                      {log.respiratoryData.chestTightness && <span>• Chest tightness</span>}
                                      {log.respiratoryData.coughing && <span>• Coughing</span>}
                                    </div>
                                  </div>
                              )}

                              {/* Migraine Details */}
                              {log.migraineData && (
                                  <div className="bg-purple-50 dark:bg-purple-900/30 rounded-lg p-3 mb-2 text-sm">
                                    <div className="flex flex-wrap gap-2 mb-2">
                                                        <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                                                            log.migraineData.prostrating
                                                                ? 'bg-red-200 dark:bg-red-900 text-red-800 dark:text-red-200'
                                                                : 'bg-green-200 dark:bg-green-900 text-green-800 dark:text-green-200'
                                                        }`}>
                                                            {log.migraineData.prostrating ? '⚠️ Prostrating' : 'Non-prostrating'}
                                                        </span>
                                      {log.migraineData.duration && (
                                          <span className="px-2 py-1 bg-purple-200 dark:bg-purple-800 text-purple-800 dark:text-purple-200 rounded-full text-xs">
                                                                {formatDuration(log.migraineData.duration)}
                                                            </span>
                                      )}
                                    </div>
                                    <div className="flex flex-wrap gap-1 text-xs text-purple-700 dark:text-purple-300">
                                      {log.migraineData.aura && <span>• Aura</span>}
                                      {log.migraineData.nausea && <span>• Nausea</span>}
                                      {log.migraineData.lightSensitivity && <span>• Light sensitive</span>}
                                      {log.migraineData.soundSensitivity && <span>• Sound sensitive</span>}
                                    </div>
                                    {log.migraineData.triggers && (
                                        <p className="text-xs text-purple-600 dark:text-purple-400 mt-1">Triggers: {log.migraineData.triggers}</p>
                                    )}
                                  </div>
                              )}

                              {/* Sleep Details */}
                              {log.sleepData && (
                                  <div className="bg-indigo-50 dark:bg-indigo-900/30 rounded-lg p-3 mb-2 text-sm">
                                    <div className="flex flex-wrap gap-2 mb-2">
                                      {log.sleepData.hoursSlept && (
                                          <span className="px-2 py-1 bg-indigo-200 dark:bg-indigo-800 text-indigo-800 dark:text-indigo-200 rounded-full text-xs">
                                                                {log.sleepData.hoursSlept} hrs sleep
                                                            </span>
                                      )}
                                      <span className="px-2 py-1 bg-indigo-200 dark:bg-indigo-800 text-indigo-800 dark:text-indigo-200 rounded-full text-xs">
                                                            Quality: {log.sleepData.quality}/10
                                                        </span>
                                      {log.sleepData.wakeUps && (
                                          <span className="px-2 py-1 bg-indigo-200 dark:bg-indigo-800 text-indigo-800 dark:text-indigo-200 rounded-full text-xs">
                                                                Woke {log.sleepData.wakeUps}x
                                                            </span>
                                      )}
                                    </div>
                                    <div className="flex flex-wrap gap-1 text-xs text-indigo-700 dark:text-indigo-300">
                                      {log.sleepData.troubleFallingAsleep && <span>• Trouble falling asleep</span>}
                                      {log.sleepData.troubleStayingAsleep && <span>• Trouble staying asleep</span>}
                                      {log.sleepData.nightmares && <span>• Nightmares</span>}
                                      {log.sleepData.feelRested === false && <span>• Not rested</span>}
                                    </div>
                                  </div>
                              )}

                              {/* PTSD Details */}
                              {log.ptsdData && (
                                  <div className="bg-amber-50 dark:bg-amber-900/30 rounded-lg p-3 mb-2 text-sm">
                                    <div className="flex flex-wrap gap-1 text-xs text-amber-700 dark:text-amber-300">
                                      {log.ptsdData.flashbacks && <span>• Flashbacks</span>}
                                      {log.ptsdData.intrusiveThoughts && <span>• Intrusive thoughts</span>}
                                      {log.ptsdData.avoidance && <span>• Avoidance</span>}
                                      {log.ptsdData.emotionalNumbering && <span>• Emotional numbness</span>}
                                      {log.ptsdData.hypervigilance && <span>• Hypervigilance</span>}
                                      {log.ptsdData.exaggeratedStartle && <span>• Startle response</span>}
                                    </div>
                                    {log.ptsdData.triggerDescription && (
                                        <p className="text-xs text-amber-600 dark:text-amber-400 mt-1">Trigger: {log.ptsdData.triggerDescription}</p>
                                    )}
                                  </div>
                              )}

                              {/* Phase 1E: Seizure Details */}
                              {log.seizureData && (
                                  <div className="bg-yellow-50 dark:bg-yellow-900/30 rounded-lg p-3 mb-2 text-sm">
                                    <div className="flex items-center gap-2 mb-2">
                                      <span className="text-yellow-600 dark:text-yellow-400">⚡</span>
                                      <span className="font-semibold text-yellow-800 dark:text-yellow-200">Seizure Details</span>
                                    </div>
                                    {log.seizureData.seizureType && (
                                        <p className="text-xs text-yellow-700 dark:text-yellow-300 mb-1">
                                          Type: <span className="font-medium">{log.seizureData.seizureType}</span>
                                        </p>
                                    )}
                                    <div className="flex flex-wrap gap-2 mb-1">
                                      {log.seizureData.durationSeconds && (
                                          <span className="px-2 py-1 bg-yellow-200 dark:bg-yellow-800 text-yellow-800 dark:text-yellow-200 rounded-full text-xs">
                                            Duration: {log.seizureData.durationSeconds}s
                                          </span>
                                      )}
                                      {log.seizureData.lossOfConsciousness && (
                                          <span className="px-2 py-1 bg-red-200 dark:bg-red-900 text-red-800 dark:text-red-200 rounded-full text-xs font-semibold">
                                            Loss of Consciousness
                                          </span>
                                      )}
                                      {log.seizureData.auraPresent && (
                                          <span className="px-2 py-1 bg-yellow-200 dark:bg-yellow-800 text-yellow-800 dark:text-yellow-200 rounded-full text-xs">
                                            Aura Present
                                          </span>
                                      )}
                                      {log.seizureData.witnessPresent && (
                                          <span className="px-2 py-1 bg-green-200 dark:bg-green-900 text-green-800 dark:text-green-200 rounded-full text-xs">
                                            Witnessed
                                          </span>
                                      )}
                                    </div>
                                    {log.seizureData.recoveryTime && (
                                        <p className="text-xs text-yellow-700 dark:text-yellow-300">
                                          Recovery: {log.seizureData.recoveryTime}
                                        </p>
                                    )}
                                  </div>
                              )}

                              {/* Phase 2: Eye/Vision Details */}
                              {log.eyeData && (
                                  <div className="bg-blue-50 dark:bg-blue-900/30 rounded-lg p-3 mb-2 text-sm">
                                    <div className="flex items-center gap-2 mb-2">
                                      <span className="text-blue-600 dark:text-blue-400">👁️</span>
                                      <span className="font-semibold text-blue-800 dark:text-blue-200">Vision Details</span>
                                    </div>
                                    {log.eyeData.affectedEye && (
                                        <p className="text-xs text-blue-700 dark:text-blue-300 mb-1">
                                          Affected Eye: <span className="font-medium">{log.eyeData.affectedEye}</span>
                                        </p>
                                    )}
                                    <div className="flex flex-wrap gap-2 mb-1">
                                      {log.eyeData.leftEyeAcuity && (
                                          <span className="px-2 py-1 bg-blue-200 dark:bg-blue-800 text-blue-800 dark:text-blue-200 rounded-full text-xs">
                                            Left: {log.eyeData.leftEyeAcuity}
                                          </span>
                                      )}
                                      {log.eyeData.rightEyeAcuity && (
                                          <span className="px-2 py-1 bg-blue-200 dark:bg-blue-800 text-blue-800 dark:text-blue-200 rounded-full text-xs">
                                            Right: {log.eyeData.rightEyeAcuity}
                                          </span>
                                      )}
                                    </div>
                                    {log.eyeData.symptoms?.length > 0 && (
                                        <p className="text-xs text-blue-700 dark:text-blue-300 mb-1">
                                          Symptoms: {log.eyeData.symptoms.join(', ')}
                                        </p>
                                    )}
                                    {log.eyeData.fieldOfVision && (
                                        <p className="text-xs text-blue-700 dark:text-blue-300 mb-1">
                                          Field of Vision: {log.eyeData.fieldOfVision}
                                        </p>
                                    )}
                                    {log.eyeData.affectedActivities?.length > 0 && (
                                        <p className="text-xs text-blue-700 dark:text-blue-300">
                                          Affects: {log.eyeData.affectedActivities.join(', ')}
                                        </p>
                                    )}
                                  </div>
                              )}

                              {/* Phase 3: Genitourinary Details */}
                              {log.genitourinaryData && (
                                  <div className="bg-teal-50 dark:bg-teal-900/30 rounded-lg p-3 mb-2 text-sm">
                                    <div className="flex items-center gap-2 mb-2">
                                      <span className="text-teal-600 dark:text-teal-400">🫘</span>
                                      <span className="font-semibold text-teal-800 dark:text-teal-200">Genitourinary Details</span>
                                    </div>
                                    {log.genitourinaryData.system && (
                                        <p className="text-xs text-teal-700 dark:text-teal-300 mb-1">
                                          System: <span className="font-medium">{log.genitourinaryData.system}</span>
                                        </p>
                                    )}
                                    <div className="flex flex-wrap gap-2 mb-1">
                                      {log.genitourinaryData.stoneEpisode && (
                                          <span className="px-2 py-1 bg-red-200 dark:bg-red-900 text-red-800 dark:text-red-200 rounded-full text-xs font-semibold">
                                            Stone Episode
                                          </span>
                                      )}
                                      {log.genitourinaryData.stonePassed && (
                                          <span className="px-2 py-1 bg-green-200 dark:bg-green-900 text-green-800 dark:text-green-200 rounded-full text-xs">
                                            Stone Passed
                                          </span>
                                      )}
                                      {log.genitourinaryData.procedure && (
                                          <span className="px-2 py-1 bg-orange-200 dark:bg-orange-900 text-orange-800 dark:text-orange-200 rounded-full text-xs">
                                            Procedure: {log.genitourinaryData.procedure}
                                          </span>
                                      )}
                                    </div>
                                    {log.genitourinaryData.urinaryFrequency && (
                                        <p className="text-xs text-teal-700 dark:text-teal-300 mb-1">
                                          Frequency: {log.genitourinaryData.urinaryFrequency}x/day
                                        </p>
                                    )}
                                    {log.genitourinaryData.nocturiaCount && (
                                        <p className="text-xs text-teal-700 dark:text-teal-300 mb-1">
                                          Nocturia: {log.genitourinaryData.nocturiaCount}x/night
                                        </p>
                                    )}
                                    {log.genitourinaryData.incontinenceEpisode && (
                                        <span className="px-2 py-1 bg-red-200 dark:bg-red-900 text-red-800 dark:text-red-200 rounded-full text-xs font-semibold">
                                          Incontinence Episode
                                        </span>
                                    )}
                                    {log.genitourinaryData.erectileDysfunction && (
                                        <p className="text-xs text-teal-700 dark:text-teal-300 mt-1">
                                          ED Severity: {log.genitourinaryData.edSeverity}
                                        </p>
                                    )}
                                  </div>
                              )}

                              {/* Phase 4: Gynecological Details */}
                              {log.gynecologicalData && (
                                  <div className="bg-pink-50 dark:bg-pink-900/30 rounded-lg p-3 mb-2 text-sm">
                                    <div className="flex items-center gap-2 mb-2">
                                      <span className="text-pink-600 dark:text-pink-400">🌸</span>
                                      <span className="font-semibold text-pink-800 dark:text-pink-200">Gynecological Details</span>
                                    </div>
                                    {log.gynecologicalData.affectedOrgan && (
                                        <p className="text-xs text-pink-700 dark:text-pink-300 mb-1">
                                          Organ: <span className="font-medium">{log.gynecologicalData.affectedOrgan}</span>
                                        </p>
                                    )}
                                    {log.gynecologicalData.painType && (
                                        <p className="text-xs text-pink-700 dark:text-pink-300 mb-1">
                                          Pain Type: {log.gynecologicalData.painType}
                                        </p>
                                    )}
                                    <div className="flex flex-wrap gap-2 mb-1">
                                      {log.gynecologicalData.endometriosisDiagnosed && (
                                          <span className="px-2 py-1 bg-red-200 dark:bg-red-900 text-red-800 dark:text-red-200 rounded-full text-xs font-semibold">
                                            Endometriosis
                                          </span>
                                      )}
                                      {log.gynecologicalData.pcosDiagnosed && (
                                          <span className="px-2 py-1 bg-purple-200 dark:bg-purple-900 text-purple-800 dark:text-purple-200 rounded-full text-xs">
                                            PCOS
                                          </span>
                                      )}
                                      {log.gynecologicalData.pidDiagnosed && (
                                          <span className="px-2 py-1 bg-orange-200 dark:bg-orange-900 text-orange-800 dark:text-orange-200 rounded-full text-xs">
                                            PID
                                          </span>
                                      )}
                                      {log.gynecologicalData.prolapseDiagnosed && (
                                          <span className="px-2 py-1 bg-yellow-200 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200 rounded-full text-xs">
                                            Prolapse
                                          </span>
                                      )}
                                    </div>
                                    {log.gynecologicalData.cycleRegularity && (
                                        <p className="text-xs text-pink-700 dark:text-pink-300 mb-1">
                                          Cycle: {log.gynecologicalData.cycleRegularity}
                                        </p>
                                    )}
                                    {log.gynecologicalData.flowHeaviness && (
                                        <p className="text-xs text-pink-700 dark:text-pink-300 mb-1">
                                          Flow: {log.gynecologicalData.flowHeaviness}
                                        </p>
                                    )}
                                    {log.gynecologicalData.dysmenorrheaSeverity && (
                                        <p className="text-xs text-pink-700 dark:text-pink-300">
                                          Dysmenorrhea: {log.gynecologicalData.dysmenorrheaSeverity}
                                        </p>
                                    )}
                                  </div>
                              )}

                              {/* Phase 5: Anemia Details */}
                              {log.anemiaData && (
                                  <div className="bg-red-50 dark:bg-red-900/30 rounded-lg p-3 mb-2 text-sm">
                                    <div className="flex items-center gap-2 mb-2">
                                      <span className="text-red-600 dark:text-red-400">🩸</span>
                                      <span className="font-semibold text-red-800 dark:text-red-200">Anemia Details</span>
                                    </div>
                                    {log.anemiaData.anemia_type && (
                                        <p className="text-xs text-red-700 dark:text-red-300 mb-1">
                                          Type: <span className="font-medium">{log.anemiaData.anemia_type}</span>
                                        </p>
                                    )}
                                    {log.anemiaData.treatment?.length > 0 && (
                                        <p className="text-xs text-red-700 dark:text-red-300 mb-1">
                                          Treatment: {log.anemiaData.treatment.join(', ')}
                                        </p>
                                    )}
                                    {log.anemiaData.neurological_symptoms?.length > 0 && (
                                        <p className="text-xs text-red-700 dark:text-red-300">
                                          Neurological: {log.anemiaData.neurological_symptoms.join(', ')}
                                        </p>
                                    )}
                                  </div>
                              )}

                              {/* Phase 5: Sickle Cell Details */}
                              {log.sickleCellData && (
                                  <div className="bg-purple-50 dark:bg-purple-900/30 rounded-lg p-3 mb-2 text-sm">
                                    <div className="flex items-center gap-2 mb-2">
                                      <span className="text-purple-600 dark:text-purple-400">🌙</span>
                                      <span className="font-semibold text-purple-800 dark:text-purple-200">Sickle Cell Crisis</span>
                                    </div>
                                    {log.sickleCellData.crisis_type && (
                                        <p className="text-xs text-purple-700 dark:text-purple-300 mb-1">
                                          Type: <span className="font-medium">{log.sickleCellData.crisis_type}</span>
                                        </p>
                                    )}
                                    {log.sickleCellData.crisis_location?.length > 0 && (
                                        <p className="text-xs text-purple-700 dark:text-purple-300 mb-1">
                                          Location: {log.sickleCellData.crisis_location.join(', ')}
                                        </p>
                                    )}
                                    {log.sickleCellData.hospitalization_required && (
                                        <span className="px-2 py-1 bg-red-200 dark:bg-red-900 text-red-800 dark:text-red-200 rounded-full text-xs font-semibold">
                                          🏥 Hospitalization Required
                                        </span>
                                    )}
                                    {log.sickleCellData.organ_damage?.length > 0 && (
                                        <p className="text-xs text-purple-700 dark:text-purple-300 mt-1">
                                          Organ Damage: {log.sickleCellData.organ_damage.join(', ')}
                                        </p>
                                    )}
                                  </div>
                              )}

                              {/* Phase 5: Bleeding Disorder Details */}
                              {log.bleedingDisorderData && (
                                  <div className="bg-pink-50 dark:bg-pink-900/30 rounded-lg p-3 mb-2 text-sm">
                                    <div className="flex items-center gap-2 mb-2">
                                      <span className="text-pink-600 dark:text-pink-400">🩹</span>
                                      <span className="font-semibold text-pink-800 dark:text-pink-200">Bleeding Disorder</span>
                                    </div>
                                    {log.bleedingDisorderData.disorder_type && (
                                        <p className="text-xs text-pink-700 dark:text-pink-300 mb-1">
                                          Type: <span className="font-medium">{log.bleedingDisorderData.disorder_type}</span>
                                        </p>
                                    )}
                                    {log.bleedingDisorderData.platelet_count && (
                                        <p className="text-xs text-pink-700 dark:text-pink-300 mb-1">
                                          Platelet Count: {log.bleedingDisorderData.platelet_count}/μL
                                        </p>
                                    )}
                                    {log.bleedingDisorderData.bleeding_site?.length > 0 && (
                                        <p className="text-xs text-pink-700 dark:text-pink-300 mb-1">
                                          Bleeding Sites: {log.bleedingDisorderData.bleeding_site.join(', ')}
                                        </p>
                                    )}
                                    {log.bleedingDisorderData.treatment?.length > 0 && (
                                        <p className="text-xs text-pink-700 dark:text-pink-300">
                                          Treatment: {log.bleedingDisorderData.treatment.join(', ')}
                                        </p>
                                    )}
                                  </div>
                              )}

                              {/* Phase 5: Polycythemia Details */}
                              {log.polycythemiaData && (
                                  <div className="bg-orange-50 dark:bg-orange-900/30 rounded-lg p-3 mb-2 text-sm">
                                    <div className="flex items-center gap-2 mb-2">
                                      <span className="text-orange-600 dark:text-orange-400">🔬</span>
                                      <span className="font-semibold text-orange-800 dark:text-orange-200">Polycythemia Vera</span>
                                    </div>
                                    {log.polycythemiaData.diagnosis && (
                                        <p className="text-xs text-orange-700 dark:text-orange-300 mb-1">
                                          Diagnosis: <span className="font-medium">{log.polycythemiaData.diagnosis}</span>
                                        </p>
                                    )}
                                    {log.polycythemiaData.medications?.length > 0 && (
                                        <p className="text-xs text-orange-700 dark:text-orange-300">
                                          Treatment: {log.polycythemiaData.medications.join(', ')}
                                        </p>
                                    )}
                                  </div>
                              )}

                              {/* Phase 5: Lymphoma/Leukemia Details */}
                              {log.lymphomaLeukemiaData && (
                                  <div className="bg-indigo-50 dark:bg-indigo-900/30 rounded-lg p-3 mb-2 text-sm">
                                    <div className="flex items-center gap-2 mb-2">
                                      <span className="text-indigo-600 dark:text-indigo-400">🧬</span>
                                      <span className="font-semibold text-indigo-800 dark:text-indigo-200">Lymphoma/Leukemia</span>
                                    </div>
                                    {log.lymphomaLeukemiaData.diagnosis && (
                                        <p className="text-xs text-indigo-700 dark:text-indigo-300 mb-1">
                                          Diagnosis: <span className="font-medium">{log.lymphomaLeukemiaData.diagnosis}</span>
                                        </p>
                                    )}
                                    {log.lymphomaLeukemiaData.treatment_status && (
                                        <p className="text-xs text-indigo-700 dark:text-indigo-300 mb-1">
                                          Status: {log.lymphomaLeukemiaData.treatment_status}
                                        </p>
                                    )}
                                    {log.lymphomaLeukemiaData.treatment_type?.length > 0 && (
                                        <p className="text-xs text-indigo-700 dark:text-indigo-300 mb-1">
                                          Treatment: {log.lymphomaLeukemiaData.treatment_type.join(', ')}
                                        </p>
                                    )}
                                    {log.lymphomaLeukemiaData.side_effects?.length > 0 && (
                                        <p className="text-xs text-indigo-700 dark:text-indigo-300">
                                          Side Effects: {log.lymphomaLeukemiaData.side_effects.join(', ')}
                                        </p>
                                    )}
                                  </div>
                              )}

                              {/* Joint & ROM Details */}
                              {log.jointData && (
                                  <div className="bg-indigo-50 dark:bg-indigo-900/30 rounded-lg p-3 mb-2 text-sm">
                                    <div className="flex items-center gap-2 mb-2">
                                      <span className="text-indigo-600 dark:text-indigo-400">🦴</span>
                                      <span className="font-semibold text-indigo-800 dark:text-indigo-200">Joint & ROM Details</span>
                                    </div>
                                    <div className="flex flex-wrap gap-2 mb-2">
                                      {log.jointData.joint && (
                                          <span className="px-2 py-1 bg-indigo-200 dark:bg-indigo-800 text-indigo-800 dark:text-indigo-200 rounded-full text-xs font-medium">
                                            {log.jointData.joint} {log.jointData.side && `- ${log.jointData.side}`}
                                          </span>
                                      )}
                                      {log.jointData.romEstimate && (
                                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                              log.jointData.romEstimate === 'full' ? 'bg-green-200 dark:bg-green-900 text-green-800 dark:text-green-200' :
                                                  log.jointData.romEstimate === 'moderate' ? 'bg-yellow-200 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200' :
                                                      'bg-red-200 dark:bg-red-900 text-red-800 dark:text-red-200'
                                          }`}>
                                            ROM: {log.jointData.romEstimate}
                                          </span>
                                      )}
                                      {log.jointData.morningStiffness && (
                                          <span className="px-2 py-1 bg-orange-200 dark:bg-orange-900 text-orange-800 dark:text-orange-200 rounded-full text-xs">
                                            🌅 Stiffness: {log.jointData.morningStiffness}
                                          </span>
                                      )}
                                    </div>
                                    <div className="flex flex-wrap gap-2">
                                      {log.jointData.swelling && (
                                          <span className="px-2 py-1 bg-blue-200 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-full text-xs">
                                            Swelling
                                          </span>
                                      )}
                                      {log.jointData.instability && (
                                          <span className="px-2 py-1 bg-red-200 dark:bg-red-900 text-red-800 dark:text-red-200 rounded-full text-xs">
                                            Instability
                                          </span>
                                      )}
                                      {log.jointData.locking && (
                                          <span className="px-2 py-1 bg-purple-200 dark:bg-purple-900 text-purple-800 dark:text-purple-200 rounded-full text-xs">
                                            Locking
                                          </span>
                                      )}
                                      {log.jointData.grinding && (
                                          <span className="px-2 py-1 bg-amber-200 dark:bg-amber-900 text-amber-800 dark:text-amber-200 rounded-full text-xs">
                                            Grinding
                                          </span>
                                      )}
                                    </div>
                                  </div>
                              )}

                              {/* Pain Details */}
                              {log.painData && (
                                  <div className="bg-rose-50 dark:bg-rose-900/30 rounded-lg p-3 mb-2 text-sm">
                                    <div className="flex flex-wrap gap-2 mb-2">
                                      {log.painData.painType && (
                                          <span className="px-2 py-1 bg-rose-200 dark:bg-rose-800 text-rose-800 dark:text-rose-200 rounded-full text-xs capitalize">
                                                                {log.painData.painType}
                                                            </span>
                                      )}
                                      {/* Legacy pain flare-up - keep for backward compatibility */}
                                      {log.painData.flareUp && !log.isFlareUp && (
                                          <span className="px-2 py-1 bg-red-200 dark:bg-red-900 text-red-800 dark:text-red-200 rounded-full text-xs font-semibold">
                                                                ⚠️ Flare-up
                                                            </span>
                                      )}
                                      {log.painData.limitedRangeOfMotion && (
                                          <span className="px-2 py-1 bg-rose-200 dark:bg-rose-800 text-rose-800 dark:text-rose-200 rounded-full text-xs">
                                                                Limited ROM
                                                            </span>
                                      )}
                                    </div>
                                    <div className="flex flex-wrap gap-1 text-xs text-rose-700 dark:text-rose-300">
                                      {log.painData.radiating && (
                                          <span>• Radiating{log.painData.radiatingTo ? ` to ${log.painData.radiatingTo}` : ''}</span>
                                      )}
                                    </div>
                                    {log.painData.affectedActivities?.length > 0 && (
                                        <p className="text-xs text-rose-600 dark:text-rose-400 mt-1">
                                          Affects: {log.painData.affectedActivities.join(', ')}
                                        </p>
                                    )}
                                  </div>
                              )}

                              {/* ============================================ */}
                              {/* Phase 7: Dental/ORAL DETAILS DISPLAY */}
                              {/* ============================================ */}
                              {log.dentalData && (
                                  <div className="bg-amber-50 dark:bg-amber-900/20 rounded-lg p-3 mb-2 text-sm">
                                    <div className="flex flex-wrap gap-2 mb-2">
                                      {/* Jaw Pain Severity */}
                                      {log.dentalData.jawPainSeverity !== undefined && log.dentalData.jawPainSeverity > 0 && (
                                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                              log.dentalData.jawPainSeverity >= 7 ? 'bg-red-200 dark:bg-red-900 text-red-800 dark:text-red-200' :
                                                  log.dentalData.jawPainSeverity >= 4 ? 'bg-orange-200 dark:bg-orange-900 text-orange-800 dark:text-orange-200' :
                                                      'bg-yellow-200 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200'
                                          }`}>
                                            🦷 Jaw pain: {log.dentalData.jawPainSeverity}/10
                                          </span>
                                      )}

                                      {/* Jaw Opening */}
                                      {log.dentalData.jawOpening && (
                                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                              log.dentalData.jawOpening < 20 ? 'bg-red-200 dark:bg-red-900 text-red-800 dark:text-red-200' :
                                                  log.dentalData.jawOpening < 35 ? 'bg-orange-200 dark:bg-orange-900 text-orange-800 dark:text-orange-200' :
                                                      'bg-green-200 dark:bg-green-900 text-green-800 dark:text-green-200'
                                          }`}>
                                            Opening: {log.dentalData.jawOpening}mm
                                          </span>
                                      )}

                                      {/* Chewing Difficulty */}
                                      {log.dentalData.chewingDifficulty && log.dentalData.chewingDifficulty !== 'none' && (
                                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                              log.dentalData.chewingDifficulty === 'unable' ? 'bg-red-200 dark:bg-red-900 text-red-800 dark:text-red-200' :
                                                  log.dentalData.chewingDifficulty === 'severe' ? 'bg-orange-200 dark:bg-orange-900 text-orange-800 dark:text-orange-200' :
                                                      'bg-amber-200 dark:bg-amber-800 text-amber-800 dark:text-amber-200'
                                          }`}>
                                            Chewing: {log.dentalData.chewingDifficulty}
                                          </span>
                                      )}

                                      {/* Dietary Restrictions */}
                                      {log.dentalData.dietaryRestrictions && log.dentalData.dietaryRestrictions !== 'none' && (
                                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                              log.dentalData.dietaryRestrictions === 'full-liquid' ? 'bg-red-200 dark:bg-red-900 text-red-800 dark:text-red-200' :
                                                  log.dentalData.dietaryRestrictions === 'puree' ? 'bg-orange-200 dark:bg-orange-900 text-orange-800 dark:text-orange-200' :
                                                      'bg-amber-200 dark:bg-amber-800 text-amber-800 dark:text-amber-200'
                                          }`}>
                                            Diet: {log.dentalData.dietaryRestrictions.replace(/-/g, ' ')}
                                          </span>
                                      )}

                                      {/* Missing Teeth Count */}
                                      {log.dentalData.toothCount && log.dentalData.toothCount > 0 && (
                                          <span className="px-2 py-1 bg-amber-200 dark:bg-amber-800 text-amber-800 dark:text-amber-200 rounded-full text-xs">
                                            {log.dentalData.toothCount} teeth lost
                                          </span>
                                      )}

                                      {/* Prosthesis Type */}
                                      {log.dentalData.prosthesisType && log.dentalData.prosthesisType !== 'none' && (
                                          <span className="px-2 py-1 bg-amber-200 dark:bg-amber-800 text-amber-800 dark:text-amber-200 rounded-full text-xs">
                                            {log.dentalData.prosthesisType.replace(/-/g, ' ')}
                                          </span>
                                      )}

                                      {/* Bone Condition */}
                                      {log.dentalData.boneCondition && log.dentalData.boneCondition !== 'none' && (
                                          <span className="px-2 py-1 bg-red-200 dark:bg-red-900 text-red-800 dark:text-red-200 rounded-full text-xs font-semibold">
                                            ⚠️ {log.dentalData.boneCondition.replace(/-/g, ' ')}
                                          </span>
                                      )}

                                      {/* Oral Mass/Tumor */}
                                      {log.dentalData.oralMass && (
                                          <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                                              log.dentalData.massBiopsy === 'malignant' ? 'bg-red-200 dark:bg-red-900 text-red-800 dark:text-red-200' :
                                                  log.dentalData.massBiopsy === 'benign' ? 'bg-yellow-200 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200' :
                                                      'bg-orange-200 dark:bg-orange-900 text-orange-800 dark:text-orange-200'
                                          }`}>
                                            🔬 Oral mass {log.dentalData.massBiopsy ? `(${log.dentalData.massBiopsy})` : ''}
                                          </span>
                                      )}

                                      {/* Infection */}
                                      {log.dentalData.infection && (
                                          <span className="px-2 py-1 bg-red-200 dark:bg-red-900 text-red-800 dark:text-red-200 rounded-full text-xs font-semibold">
                                            🦠 Infection
                                          </span>
                                      )}
                                    </div>

                                    {/* Additional Dental Details */}
                                    <div className="flex flex-wrap gap-1 text-xs text-amber-700 dark:text-amber-300">
                                      {log.dentalData.palateSymptoms && log.dentalData.palateSymptoms.length > 0 && (
                                          <span>• Palate: {log.dentalData.palateSymptoms.join(', ')}</span>
                                      )}
                                      {log.dentalData.swallowingDifficulty && log.dentalData.swallowingDifficulty !== 'none' && (
                                          <span>• Swallowing: {log.dentalData.swallowingDifficulty}</span>
                                      )}
                                      {log.dentalData.speakingDifficulty && (
                                          <span>• Speaking difficulty</span>
                                      )}
                                      {log.dentalData.painWithEating && (
                                          <span>• Pain with eating</span>
                                      )}
                                      {log.dentalData.massLocation && (
                                          <span>• Mass location: {log.dentalData.massLocation}</span>
                                      )}
                                      {log.dentalData.infectionType && (
                                          <span>• Infection type: {log.dentalData.infectionType}</span>
                                      )}
                                      {log.dentalData.workMissed && (
                                          <span>• Work missed</span>
                                      )}
                                    </div>
                                  </div>
                              )}

                              {/* HIV/AIDS Details */}
                              {log.hivData && (
                                  <div className="bg-red-50 dark:bg-red-900/20 rounded-lg p-3 mb-2 text-sm">
                                    <div className="flex flex-wrap gap-2 mb-2">
                                      {/* Opportunistic Infection */}
                                      {log.hivData.infectionType && (
                                          <span className="px-2 py-1 bg-red-200 dark:bg-red-900 text-red-800 dark:text-red-200 rounded-full text-xs font-semibold">
                                            ⚠️ {log.hivData.infectionType}
                                          </span>
                                      )}

                                      {/* Weight Loss */}
                                      {log.hivData.weightLossPercentage && parseFloat(log.hivData.weightLossPercentage) > 0 && (
                                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                              parseFloat(log.hivData.weightLossPercentage) >= 10 ? 'bg-red-200 dark:bg-red-900 text-red-800 dark:text-red-200' :
                                                  parseFloat(log.hivData.weightLossPercentage) >= 5 ? 'bg-orange-200 dark:bg-orange-900 text-orange-800 dark:text-orange-200' :
                                                      'bg-yellow-200 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200'
                                          }`}>
                                            📉 {log.hivData.weightLossPercentage}% weight loss
                                          </span>
                                      )}

                                      {/* CD4 Count Range */}
                                      {log.hivData.cd4Range && (
                                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                              log.hivData.cd4Range === '<200' ? 'bg-red-200 dark:bg-red-900 text-red-800 dark:text-red-200' :
                                                  log.hivData.cd4Range === '200-500' ? 'bg-yellow-200 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200' :
                                                      'bg-green-200 dark:bg-green-900 text-green-800 dark:text-green-200'
                                          }`}>
                                            🔬 CD4: {log.hivData.cd4Range}
                                          </span>
                                      )}

                                      {/* On Antiretrovirals */}
                                      {log.hivData.onAntiretrovirals && (
                                          <span className="px-2 py-1 bg-blue-200 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-full text-xs font-medium">
                                            💊 On ART
                                          </span>
                                      )}

                                      {/* Treatment Compliance */}
                                      {log.hivData.treatmentCompliance && (
                                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                              log.hivData.treatmentCompliance === 'excellent' ? 'bg-green-200 dark:bg-green-900 text-green-800 dark:text-green-200' :
                                                  log.hivData.treatmentCompliance === 'good' ? 'bg-blue-200 dark:bg-blue-900 text-blue-800 dark:text-blue-200' :
                                                      log.hivData.treatmentCompliance === 'fair' ? 'bg-yellow-200 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200' :
                                                          'bg-red-200 dark:bg-red-900 text-red-800 dark:text-red-200'
                                          }`}>
                                            Compliance: {log.hivData.treatmentCompliance}
                                          </span>
                                      )}
                                    </div>

                                    {/* Constitutional Symptoms */}
                                    {log.hivData.constitutionalSymptoms && log.hivData.constitutionalSymptoms.length > 0 && (
                                        <div className="flex flex-wrap gap-1 text-xs text-red-700 dark:text-red-300">
                                          <span className="font-medium">Symptoms:</span>
                                          {log.hivData.constitutionalSymptoms.map((symptom, i) => (
                                              <span key={i}>• {symptom.replace(/-/g, ' ')}</span>
                                          ))}
                                        </div>
                                    )}
                                  </div>
                              )}

                              {/* Hepatitis Details */}
                              {log.hepatitisData && (
                                  <div className="bg-amber-50 dark:bg-amber-900/20 rounded-lg p-3 mb-2 text-sm">
                                    <div className="flex flex-wrap gap-2 mb-2">
                                      {log.hepatitisData.weightLossPercentage && parseFloat(log.hepatitisData.weightLossPercentage) > 0 && (
                                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                              parseFloat(log.hepatitisData.weightLossPercentage) >= 10 ? 'bg-red-200 dark:bg-red-900 text-red-800 dark:text-red-200' :
                                                  parseFloat(log.hepatitisData.weightLossPercentage) >= 5 ? 'bg-orange-200 dark:bg-orange-900 text-orange-800 dark:text-orange-200' :
                                                      'bg-yellow-200 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200'
                                          }`}>
                                            📉 {log.hepatitisData.weightLossPercentage}% weight loss
                                          </span>
                                      )}
                                      {log.hepatitisData.symptomFrequency && (
                                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                              log.hepatitisData.symptomFrequency === 'daily' ? 'bg-red-200 dark:bg-red-900 text-red-800 dark:text-red-200' :
                                                  log.hepatitisData.symptomFrequency === 'intermittent' ? 'bg-yellow-200 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200' :
                                                      'bg-green-200 dark:bg-green-900 text-green-800 dark:text-green-200'
                                          }`}>
                                            {log.hepatitisData.symptomFrequency}
                                          </span>
                                      )}
                                      {log.hepatitisData.debilitating && (
                                          <span className="px-2 py-1 bg-red-200 dark:bg-red-900 text-red-800 dark:text-red-200 rounded-full text-xs font-semibold">
                                            ⚠️ Debilitating
                                          </span>
                                      )}
                                      {log.hepatitisData.dietaryRestrictions && (
                                          <span className="px-2 py-1 bg-amber-200 dark:bg-amber-800 text-amber-800 dark:text-amber-200 rounded-full text-xs">
                                            🍽️ Dietary restrictions
                                          </span>
                                      )}
                                    </div>
                                  </div>
                              )}

                              {/* Lyme Disease Details */}
                              {log.lymeData && (
                                  <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-3 mb-2 text-sm">
                                    <div className="flex flex-wrap gap-2 mb-2">
                                      {log.lymeData.activeTreatment && (
                                          <span className="px-2 py-1 bg-red-200 dark:bg-red-900 text-red-800 dark:text-red-200 rounded-full text-xs font-semibold">
                                            💊 Active treatment (100%)
                                          </span>
                                      )}
                                      {log.lymeData.treatmentCompleted && (
                                          <span className="px-2 py-1 bg-blue-200 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-full text-xs font-medium">
                                            ✓ Treatment completed
                                          </span>
                                      )}
                                      {log.lymeData.rashPresent && (
                                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                              log.lymeData.rashType === 'bulls-eye' ? 'bg-red-200 dark:bg-red-900 text-red-800 dark:text-red-200' :
                                                  'bg-orange-200 dark:bg-orange-900 text-orange-800 dark:text-orange-200'
                                          }`}>
                                            🎯 {log.lymeData.rashType === 'bulls-eye' ? "Bull's-eye rash" : 'Rash present'}
                                          </span>
                                      )}
                                    </div>
                                    {log.lymeData.treatmentStartDate && (
                                        <p className="text-xs text-green-600 dark:text-green-400">
                                          Treatment date: {new Date(log.lymeData.treatmentStartDate).toLocaleDateString()}
                                        </p>
                                    )}
                                  </div>
                              )}

                              {/* Malaria Details */}
                              {log.malariaData && (
                                  <div className="flex flex-wrap gap-2 mt-2">
                                    {log.malariaData.relapseEpisode && (
                                        <span className="px-2 py-1 bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300
                                   rounded-full text-xs font-medium border border-red-200 dark:border-red-800">
                      🔄 Relapse Episode
                    </span>
                                    )}
                                    {log.malariaData.hospitalized && (
                                        <span className="px-2 py-1 bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300
                                   rounded-full text-xs font-medium">
                      🏥 Hospitalized
                    </span>
                                    )}
                                    {log.malariaData.severeComplications && (
                                        <span className="px-2 py-1 bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300
                                   rounded-full text-xs font-medium">
                      ⚠️ Severe Complications
                    </span>
                                    )}
                                    {log.malariaData.cyclicalPattern && (
                                        <span className="px-2 py-1 bg-orange-100 dark:bg-orange-900/30 text-orange-800 dark:text-orange-300
                                   rounded-full text-xs">
                      🔁 Cyclical Pattern (48-72hr)
                    </span>
                                    )}
                                    {log.malariaData.continuousMedication && (
                                        <span className="px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300
                                   rounded-full text-xs">
                      💊 Continuous Medication
                    </span>
                                    )}
                                    {log.malariaData.feverTemperature && (
                                        <span className="px-2 py-1 bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300
                                   rounded-full text-xs">
                      🌡️ {log.malariaData.feverTemperature}°F
                    </span>
                                    )}
                                  </div>
                              )}

                              {/* Brucellosis Details */}
                              {log.brucellosisData && (
                                  <div className="flex flex-wrap gap-2 mt-2">
                                    {log.brucellosisData.relapseEpisode && (
                                        <span className="px-2 py-1 bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300
                                   rounded-full text-xs font-medium border border-red-200 dark:border-red-800">
                      🔄 Relapse Episode
                    </span>
                                    )}
                                    {log.brucellosisData.neurobrucellosis && (
                                        <span className="px-2 py-1 bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300
                                   rounded-full text-xs font-medium">
                      🧠 Neurobrucellosis (CNS)
                    </span>
                                    )}
                                    {log.brucellosisData.multiOrganInvolvement && (
                                        <span className="px-2 py-1 bg-orange-100 dark:bg-orange-900/30 text-orange-800 dark:text-orange-300
                                   rounded-full text-xs">
                      Multi-Organ Involvement
                    </span>
                                    )}
                                    {log.brucellosisData.chronicArthritis && (
                                        <span className="px-2 py-1 bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300
                                   rounded-full text-xs">
                      Chronic Arthritis/Spondylitis
                    </span>
                                    )}
                                    {log.brucellosisData.undulantFever && (
                                        <span className="px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300
                                   rounded-full text-xs">
                      🌊 Undulant Fever
                    </span>
                                    )}
                                  </div>
                              )}

                              {/* Campylobacter Details */}
                              {log.campylobacterData && (
                                  <div className="flex flex-wrap gap-2 mt-2">
                                    {log.campylobacterData.guillainBarre && (
                                        <span className="px-2 py-1 bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300
                                   rounded-full text-xs font-bold border-2 border-red-300 dark:border-red-700">
                      ⚠️ GUILLAIN-BARRÉ SYNDROME
                    </span>
                                    )}
                                    {log.campylobacterData.reactiveArthritis && (
                                        <span className="px-2 py-1 bg-orange-100 dark:bg-orange-900/30 text-orange-800 dark:text-orange-300
                                   rounded-full text-xs font-medium">
                      Reactive Arthritis
                    </span>
                                    )}
                                    {log.campylobacterData.chronicIBS && (
                                        <span className="px-2 py-1 bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300
                                   rounded-full text-xs">
                      Post-Infectious IBS
                    </span>
                                    )}
                                    {log.campylobacterData.stoolCultureConfirmed && (
                                        <span className="px-2 py-1 bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300
                                   rounded-full text-xs">
                      ✓ Stool Culture Confirmed
                    </span>
                                    )}
                                    {log.campylobacterData.weeksSinceInfection && (
                                        <span className="px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300
                                   rounded-full text-xs">
                      {log.campylobacterData.weeksSinceInfection} weeks post-infection
                    </span>
                                    )}
                                  </div>
                              )}

                              {/* Q Fever Details */}
                              {log.qFeverData && (
                                  <div className="flex flex-wrap gap-2 mt-2">
                                    {log.qFeverData.endocarditis && (
                                        <span className="px-2 py-1 bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300
                                   rounded-full text-xs font-bold border-2 border-red-300 dark:border-red-700">
                      ⚠️ Q FEVER ENDOCARDITIS
                    </span>
                                    )}
                                    {log.qFeverData.chronicQFever && (
                                        <span className="px-2 py-1 bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300
                                   rounded-full text-xs font-medium">
                      Chronic Q Fever (&gt;6 months)
                    </span>
                                    )}
                                    {log.qFeverData.fatigueSyndrome && (
                                        <span className="px-2 py-1 bg-orange-100 dark:bg-orange-900/30 text-orange-800 dark:text-orange-300
                                   rounded-full text-xs">
                      Q Fever Fatigue Syndrome
                    </span>
                                    )}
                                    {log.qFeverData.phaseIAntibodies && (
                                        <span className="px-2 py-1 bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300
                                   rounded-full text-xs">
                      Phase I Ab+ (&gt;1:800)
                    </span>
                                    )}
                                    {log.qFeverData.monthsSinceInfection && (
                                        <span className="px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300
                                   rounded-full text-xs">
                      {log.qFeverData.monthsSinceInfection} months post-infection
                    </span>
                                    )}
                                  </div>
                              )}

                              {/* Phase 6: Salmonella Details */}
                              {log.salmonellaData && (
                                  <div className="flex flex-wrap gap-2 mt-2">
                                    {log.salmonellaData.stoolCultureConfirmed && (
                                        <span className="inline-flex items-center gap-1 px-2 py-1 bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300 rounded-full text-xs">
                      ✓ Stool Culture Confirmed
                    </span>
                                    )}
                                    {log.salmonellaData.reactiveArthritis && (
                                        <span className="inline-flex items-center gap-1 px-2 py-1 bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300 rounded-full text-xs font-medium">
                      Reactive Arthritis
                    </span>
                                    )}
                                    {log.salmonellaData.bacteremia && (
                                        <span className="inline-flex items-center gap-1 px-2 py-1 bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300 rounded-full text-xs font-semibold">
                      Bacteremia/Sepsis
                    </span>
                                    )}
                                    {log.salmonellaData.hospitalized && (
                                        <span className="inline-flex items-center gap-1 px-2 py-1 bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300 rounded-full text-xs">
                      Hospitalized
                    </span>
                                    )}
                                    {log.salmonellaData.severeComplications && (
                                        <span className="inline-flex items-center gap-1 px-2 py-1 bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300 rounded-full text-xs">
                      Severe Complications
                    </span>
                                    )}
                                  </div>
                              )}

                              {/* Phase 6: Shigella Details */}
                              {log.shigellaData && (
                                  <div className="flex flex-wrap gap-2 mt-2">
                                    {log.shigellaData.stoolCultureConfirmed && (
                                        <span className="inline-flex items-center gap-1 px-2 py-1 bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300 rounded-full text-xs">
                      ✓ Stool Culture Confirmed
                    </span>
                                    )}
                                    {log.shigellaData.reactiveArthritis && (
                                        <span className="inline-flex items-center gap-1 px-2 py-1 bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300 rounded-full text-xs font-medium">
                      Reactive Arthritis
                    </span>
                                    )}
                                    {log.shigellaData.hus && (
                                        <span className="inline-flex items-center gap-1 px-2 py-1 bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300 rounded-full text-xs font-bold border-2 border-red-500">
                      ⚠️ HUS
                    </span>
                                    )}
                                    {log.shigellaData.hospitalized && (
                                        <span className="inline-flex items-center gap-1 px-2 py-1 bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300 rounded-full text-xs">
                      Hospitalized
                    </span>
                                    )}
                                    {log.shigellaData.severeComplications && (
                                        <span className="inline-flex items-center gap-1 px-2 py-1 bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300 rounded-full text-xs">
                      Severe Complications
                    </span>
                                    )}
                                  </div>
                              )}

                              {/* Phase 6: West Nile Details */}
                              {log.westNileData && (
                                  <div className="flex flex-wrap gap-2 mt-2">
                                    {log.westNileData.serologyConfirmed && (
                                        <span className="inline-flex items-center gap-1 px-2 py-1 bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300 rounded-full text-xs">
                      ✓ Serology Confirmed
                    </span>
                                    )}
                                    {log.westNileData.neuroinvasive && (
                                        <span className="inline-flex items-center gap-1 px-2 py-1 bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300 rounded-full text-xs font-medium">
                      Neuroinvasive Disease
                    </span>
                                    )}
                                    {log.westNileData.encephalitis && (
                                        <span className="inline-flex items-center gap-1 px-2 py-1 bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300 rounded-full text-xs font-semibold">
                      Encephalitis
                    </span>
                                    )}
                                    {log.westNileData.acuteFlaccidParalysis && (
                                        <span className="inline-flex items-center gap-1 px-2 py-1 bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300 rounded-full text-xs font-bold border-2 border-red-500">
                      ⚠️ Acute Flaccid Paralysis
                    </span>
                                    )}
                                    {log.westNileData.permanentImpairment && (
                                        <span className="inline-flex items-center gap-1 px-2 py-1 bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300 rounded-full text-xs">
                      Permanent Impairment
                    </span>
                                    )}
                                  </div>
                              )}

                              {/* Phase 6: NTM Details */}
                              {log.ntmData && (
                                  <div className="flex flex-wrap gap-2 mt-2">
                                    {log.ntmData.ntmSpecies && (
                                        <span className="inline-flex items-center gap-1 px-2 py-1 bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300 rounded-full text-xs font-medium">
                      {log.ntmData.ntmSpecies === 'mac' && 'MAC'}
                                          {log.ntmData.ntmSpecies === 'abscessus' && 'M. abscessus'}
                                          {log.ntmData.ntmSpecies === 'kansasii' && 'M. kansasii'}
                                          {log.ntmData.ntmSpecies === 'other' && 'Other NTM'}
                    </span>
                                    )}
                                    {log.ntmData.activeDisease && (
                                        <span className="inline-flex items-center gap-1 px-2 py-1 bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300 rounded-full text-xs font-semibold">
                      Active Disease
                    </span>
                                    )}
                                    {log.ntmData.onTreatment && (
                                        <span className="inline-flex items-center gap-1 px-2 py-1 bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300 rounded-full text-xs">
                      On Treatment {log.ntmData.monthsOnTreatment && `(${log.ntmData.monthsOnTreatment}mo)`}
                    </span>
                                    )}
                                    {log.ntmData.disseminated && (
                                        <span className="inline-flex items-center gap-1 px-2 py-1 bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300 rounded-full text-xs font-bold border-2 border-red-500">
                      ⚠️ Disseminated
                    </span>
                                    )}
                                  </div>
                              )}

                              {/* PHASE 8A: MENTAL HEALTH EXPANSION - HISTORY DISPLAY */}
                              {log.eatingDisorderData && (
                                  <div className="text-xs text-gray-600 dark:text-gray-400 space-y-1 flex flex-col items-start">
                                    {log.eatingDisorderData.currentWeight && (
                                        <div>
                                          <span className="font-semibold">Current Weight:</span> {log.eatingDisorderData.currentWeight} lbs
                                          {log.eatingDisorderData.expectedMinimumWeight && (
                                              <span className="ml-2 text-gray-500">
                                        (Expected: {log.eatingDisorderData.expectedMinimumWeight} lbs)
                                    </span>
                                          )}
                                        </div>
                                    )}

                                    {log.eatingDisorderData.incapacitatingEpisode && (
                                        <div>
                                <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200">
                                    Incapacitating Episode
                                </span>
                                          {log.eatingDisorderData.episodeDuration && (
                                              <span className="ml-2">Duration: {log.eatingDisorderData.episodeDuration}</span>
                                          )}
                                        </div>
                                    )}

                                    {log.eatingDisorderData.hospitalized && (
                                        <div>
                                <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200">
                                    Hospitalized
                                </span>
                                          {log.eatingDisorderData.tubeFeeding && (
                                              <span className="ml-2 text-amber-700 dark:text-amber-400">Tube Feeding</span>
                                          )}
                                          {log.eatingDisorderData.parenteralNutrition && (
                                              <span className="ml-2 text-amber-700 dark:text-amber-400">Parenteral Nutrition</span>
                                          )}
                                        </div>
                                    )}

                                    {log.eatingDisorderData.bingeEpisode && (
                                        <div>
                                <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200">
                                    Binge Episode
                                </span>
                                        </div>
                                    )}

                                    {log.eatingDisorderData.purgingEpisode && (
                                        <div>
                                <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200">
                                    Purging Episode
                                </span>
                                        </div>
                                    )}

                                    {log.eatingDisorderData.compensatoryBehaviors && log.eatingDisorderData.compensatoryBehaviors.length > 0 && (
                                        <div>
                                          <span className="font-semibold">Compensatory Behaviors:</span> {log.eatingDisorderData.compensatoryBehaviors.join(', ')}
                                        </div>
                                    )}

                                    {log.eatingDisorderData.restrictedIntake && (
                                        <div>
                                <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200">
                                    Restricted Intake
                                </span>
                                        </div>
                                    )}
                                  </div>
                              )}

                              {/* Anxiety Disorders Form Data */}
                              {log.anxietyData && (
                                  <div className="text-xs text-gray-600 dark:text-gray-400 space-y-1 flex flex-col items-start">
                                    {/* Physical Symptoms */}
                                    {(log.anxietyData.heartRacing || log.anxietyData.sweating || log.anxietyData.trembling ||
                                        log.anxietyData.shortnessOfBreath || log.anxietyData.chestTightness || log.anxietyData.nausea ||
                                        log.anxietyData.dizziness || log.anxietyData.hotFlashes || log.anxietyData.numbnessTingling) && (
                                        <div>
                                          <span className="font-semibold">Physical:</span>{' '}
                                          {[
                                            log.anxietyData.heartRacing && 'Heart racing',
                                            log.anxietyData.sweating && 'Sweating',
                                            log.anxietyData.trembling && 'Trembling',
                                            log.anxietyData.shortnessOfBreath && 'Shortness of breath',
                                            log.anxietyData.chestTightness && 'Chest tightness',
                                            log.anxietyData.nausea && 'Nausea',
                                            log.anxietyData.dizziness && 'Dizziness',
                                            log.anxietyData.hotFlashes && 'Hot flashes',
                                            log.anxietyData.numbnessTingling && 'Numbness/tingling',
                                          ].filter(Boolean).join(', ')}
                                        </div>
                                    )}

                                    {/* Cognitive Symptoms */}
                                    {(log.anxietyData.racingThoughts || log.anxietyData.fearOfLosingControl ||
                                        log.anxietyData.fearOfDying || log.anxietyData.feelingDetached ||
                                        log.anxietyData.difficultyConcentrating) && (
                                        <div>
                                          <span className="font-semibold">Cognitive:</span>{' '}
                                          {[
                                            log.anxietyData.racingThoughts && 'Racing thoughts',
                                            log.anxietyData.fearOfLosingControl && 'Fear of losing control',
                                            log.anxietyData.fearOfDying && 'Fear of dying',
                                            log.anxietyData.feelingDetached && 'Feeling detached',
                                            log.anxietyData.difficultyConcentrating && 'Difficulty concentrating',
                                          ].filter(Boolean).join(', ')}
                                        </div>
                                    )}

                                    {/* Avoidance/Impact */}
                                    {(log.anxietyData.avoidedSocial || log.anxietyData.leftEarly || log.anxietyData.calledOut ||
                                        log.anxietyData.cancelledPlans || log.anxietyData.neededSafetyPerson) && (
                                        <div>
                                          <span className="font-semibold">Impact:</span>{' '}
                                          {[
                                            log.anxietyData.avoidedSocial && 'Avoided social situations',
                                            log.anxietyData.leftEarly && 'Left early',
                                            log.anxietyData.calledOut && 'Called out',
                                            log.anxietyData.cancelledPlans && 'Cancelled plans',
                                            log.anxietyData.neededSafetyPerson && 'Needed safety person',
                                          ].filter(Boolean).join(', ')}
                                        </div>
                                    )}

                                    {log.anxietyData.episodeDuration && (
                                        <div>
                                          <span className="font-semibold">Duration:</span> {log.anxietyData.episodeDuration}
                                        </div>
                                    )}

                                    {log.anxietyData.wasPanicAttack && (
                                        <div>
                                <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200">
                                    Panic Attack
                                </span>
                                        </div>
                                    )}

                                    {log.anxietyData.trigger && (
                                        <div>
                                          <span className="font-semibold">Trigger:</span> {log.anxietyData.trigger}
                                        </div>
                                    )}
                                  </div>
                              )}

                              {/* Depression Form Data */}
                              {log.depressionData && (
                                  <div className="text-xs text-gray-600 dark:text-gray-400 space-y-1 flex flex-col items-start">
                                    {/* Mood Symptoms */}
                                    {(log.depressionData.depressedMood || log.depressionData.anhedonia ||
                                        log.depressionData.worthlessness || log.depressionData.excessiveGuilt ||
                                        log.depressionData.hopelessness || log.depressionData.irritability) && (
                                        <div>
                                          <span className="font-semibold">Mood:</span>{' '}
                                          {[
                                            log.depressionData.depressedMood && 'Depressed mood',
                                            log.depressionData.anhedonia && 'Anhedonia',
                                            log.depressionData.worthlessness && 'Worthlessness',
                                            log.depressionData.excessiveGuilt && 'Excessive guilt',
                                            log.depressionData.hopelessness && 'Hopelessness',
                                            log.depressionData.irritability && 'Irritability',
                                          ].filter(Boolean).join(', ')}
                                        </div>
                                    )}

                                    {/* Physical/Vegetative Symptoms */}
                                    {(log.depressionData.insomnia || log.depressionData.hypersomnia ||
                                        log.depressionData.decreasedAppetite || log.depressionData.increasedAppetite ||
                                        log.depressionData.fatigue || log.depressionData.psychomotorAgitation ||
                                        log.depressionData.psychomotorRetardation) && (
                                        <div>
                                          <span className="font-semibold">Physical:</span>{' '}
                                          {[
                                            log.depressionData.insomnia && 'Insomnia',
                                            log.depressionData.hypersomnia && 'Hypersomnia',
                                            log.depressionData.decreasedAppetite && 'Decreased appetite',
                                            log.depressionData.increasedAppetite && 'Increased appetite',
                                            log.depressionData.fatigue && 'Fatigue',
                                            log.depressionData.psychomotorAgitation && 'Agitation',
                                            log.depressionData.psychomotorRetardation && 'Slowed movements',
                                          ].filter(Boolean).join(', ')}
                                        </div>
                                    )}

                                    {/* Cognitive Symptoms */}
                                    {(log.depressionData.difficultyConcentrating || log.depressionData.difficultyDeciding ||
                                        log.depressionData.memoryProblems || log.depressionData.thoughtsOfDeath) && (
                                        <div>
                                          <span className="font-semibold">Cognitive:</span>{' '}
                                          {[
                                            log.depressionData.difficultyConcentrating && 'Difficulty concentrating',
                                            log.depressionData.difficultyDeciding && 'Difficulty deciding',
                                            log.depressionData.memoryProblems && 'Memory problems',
                                            log.depressionData.thoughtsOfDeath && 'Thoughts of death',
                                          ].filter(Boolean).join(', ')}
                                        </div>
                                    )}

                                    {/* Functional Impact */}
                                    {(log.depressionData.unableToGetUp || log.depressionData.calledOutWork ||
                                        log.depressionData.neglectedSelfCare || log.depressionData.socialWithdrawal ||
                                        log.depressionData.unableToCompleteTasks) && (
                                        <div>
                                          <span className="font-semibold">Impact:</span>{' '}
                                          {[
                                            log.depressionData.unableToGetUp && 'Unable to get up',
                                            log.depressionData.calledOutWork && 'Called out of work',
                                            log.depressionData.neglectedSelfCare && 'Neglected self-care',
                                            log.depressionData.socialWithdrawal && 'Social withdrawal',
                                            log.depressionData.unableToCompleteTasks && 'Unable to complete tasks',
                                          ].filter(Boolean).join(', ')}
                                        </div>
                                    )}

                                    {log.depressionData.suicidalIdeation && (
                                        <div>
                                <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200">
                                    Suicidal Ideation Present
                                </span>
                                        </div>
                                    )}

                                    {log.depressionData.trigger && (
                                        <div>
                                          <span className="font-semibold">Trigger:</span> {log.depressionData.trigger}
                                        </div>
                                    )}

                                    {log.depressionData.episodeContext && (
                                        <div>
                                          <span className="font-semibold">Context:</span> {log.depressionData.episodeContext}
                                        </div>
                                    )}
                                  </div>
                              )}

                              {/* Bipolar/Cyclothymic Form Data */}
                              {log.bipolarData && (
                                  <div className="text-xs text-gray-600 dark:text-gray-400 space-y-1 flex flex-col items-start">
                                    {log.bipolarData.episodeType && (
                                        <div>
                                <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200">
                                    {log.bipolarData.episodeType === 'manic' && 'Manic Episode'}
                                  {log.bipolarData.episodeType === 'hypomanic' && 'Hypomanic Episode'}
                                  {log.bipolarData.episodeType === 'depressive' && 'Depressive Episode'}
                                  {log.bipolarData.episodeType === 'mixed' && 'Mixed Episode'}
                                </span>
                                        </div>
                                    )}

                                    {/* Manic/Hypomanic Symptoms */}
                                    {(log.bipolarData.elevatedMood || log.bipolarData.irritableMood ||
                                        log.bipolarData.increasedEnergy || log.bipolarData.decreasedSleep ||
                                        log.bipolarData.moreTalkative || log.bipolarData.racingThoughts ||
                                        log.bipolarData.distractibility || log.bipolarData.increasedActivity ||
                                        log.bipolarData.riskyBehavior || log.bipolarData.grandiosity) && (
                                        <div>
                                          <span className="font-semibold">Manic/Hypomanic:</span>{' '}
                                          {[
                                            log.bipolarData.elevatedMood && 'Elevated mood',
                                            log.bipolarData.irritableMood && 'Irritable',
                                            log.bipolarData.increasedEnergy && 'Increased energy',
                                            log.bipolarData.decreasedSleep && 'Decreased sleep need',
                                            log.bipolarData.moreTalkative && 'More talkative',
                                            log.bipolarData.racingThoughts && 'Racing thoughts',
                                            log.bipolarData.distractibility && 'Distractible',
                                            log.bipolarData.increasedActivity && 'Increased activity',
                                            log.bipolarData.riskyBehavior && 'Risky behavior',
                                            log.bipolarData.grandiosity && 'Grandiosity',
                                          ].filter(Boolean).join(', ')}
                                        </div>
                                    )}

                                    {/* Depressive Symptoms */}
                                    {(log.bipolarData.depressedMood || log.bipolarData.anhedonia ||
                                        log.bipolarData.fatigue || log.bipolarData.worthlessness) && (
                                        <div>
                                          <span className="font-semibold">Depressive:</span>{' '}
                                          {[
                                            log.bipolarData.depressedMood && 'Depressed mood',
                                            log.bipolarData.anhedonia && 'Anhedonia',
                                            log.bipolarData.fatigue && 'Fatigue',
                                            log.bipolarData.worthlessness && 'Worthlessness',
                                          ].filter(Boolean).join(', ')}
                                        </div>
                                    )}

                                    {log.bipolarData.sleepHours && (
                                        <div>
                                          <span className="font-semibold">Sleep:</span> {log.bipolarData.sleepHours} hours
                                        </div>
                                    )}

                                    {log.bipolarData.riskyBehaviors && log.bipolarData.riskyBehaviors.length > 0 && (
                                        <div>
                                          <span className="font-semibold">Risky Behaviors:</span> {log.bipolarData.riskyBehaviors.join(', ')}
                                        </div>
                                    )}

                                    {/* Functional Impact */}
                                    {(log.bipolarData.unableToWork || log.bipolarData.relationshipConflicts ||
                                        log.bipolarData.legalProblems || log.bipolarData.hospitalizationRequired) && (
                                        <div>
                                          <span className="font-semibold">Impact:</span>{' '}
                                          {[
                                            log.bipolarData.unableToWork && 'Unable to work',
                                            log.bipolarData.relationshipConflicts && 'Relationship conflicts',
                                            log.bipolarData.legalProblems && 'Legal problems',
                                            log.bipolarData.hospitalizationRequired && 'Hospitalization required',
                                          ].filter(Boolean).join(', ')}
                                        </div>
                                    )}

                                    {log.bipolarData.episodeDuration && (
                                        <div>
                                          <span className="font-semibold">Duration:</span> {log.bipolarData.episodeDuration}
                                        </div>
                                    )}
                                  </div>
                              )}

                              {/* OCD Form Data */}
                              {log.ocdData && (
                                  <div className="text-xs text-gray-600 dark:text-gray-400 space-y-1 flex flex-col items-start">
                                    {/* Obsession Types */}
                                    {(log.ocdData.contaminationFears || log.ocdData.fearOfHarm ||
                                        log.ocdData.needForSymmetry || log.ocdData.forbiddenThoughts ||
                                        log.ocdData.religiousObsessions || log.ocdData.hoardingUrges ||
                                        log.ocdData.otherObsession) && (
                                        <div>
                                          <span className="font-semibold">Obsessions:</span>{' '}
                                          {[
                                            log.ocdData.contaminationFears && 'Contamination',
                                            log.ocdData.fearOfHarm && 'Fear of harm',
                                            log.ocdData.needForSymmetry && 'Symmetry',
                                            log.ocdData.forbiddenThoughts && 'Forbidden thoughts',
                                            log.ocdData.religiousObsessions && 'Religious',
                                            log.ocdData.hoardingUrges && 'Hoarding',
                                            log.ocdData.otherObsession && log.ocdData.otherObsession,
                                          ].filter(Boolean).join(', ')}
                                        </div>
                                    )}

                                    {/* Compulsion Types */}
                                    {(log.ocdData.washingCleaning || log.ocdData.checking ||
                                        log.ocdData.repeating || log.ocdData.counting ||
                                        log.ocdData.ordering || log.ocdData.mentalRituals ||
                                        log.ocdData.reassuranceSeeking || log.ocdData.otherCompulsion) && (
                                        <div>
                                          <span className="font-semibold">Compulsions:</span>{' '}
                                          {[
                                            log.ocdData.washingCleaning && 'Washing/cleaning',
                                            log.ocdData.checking && 'Checking',
                                            log.ocdData.repeating && 'Repeating',
                                            log.ocdData.counting && 'Counting',
                                            log.ocdData.ordering && 'Ordering',
                                            log.ocdData.mentalRituals && 'Mental rituals',
                                            log.ocdData.reassuranceSeeking && 'Reassurance seeking',
                                            log.ocdData.otherCompulsion && log.ocdData.otherCompulsion,
                                          ].filter(Boolean).join(', ')}
                                        </div>
                                    )}

                                    {log.ocdData.timeConsumed && (
                                        <div>
                                          <span className="font-semibold">Time Consumed:</span> {log.ocdData.timeConsumed}
                                        </div>
                                    )}

                                    {log.ocdData.distressLevel !== undefined && log.ocdData.distressLevel !== 5 && (
                                        <div>
                                          <span className="font-semibold">Distress Level:</span> {log.ocdData.distressLevel}/10
                                        </div>
                                    )}

                                    {/* Functional Impact */}
                                    {(log.ocdData.lateToAppointments || log.ocdData.avoidedSituations ||
                                        log.ocdData.interferedRoutines || log.ocdData.relationshipProblems ||
                                        log.ocdData.unableToComplete) && (
                                        <div>
                                          <span className="font-semibold">Impact:</span>{' '}
                                          {[
                                            log.ocdData.lateToAppointments && 'Late to appointments',
                                            log.ocdData.avoidedSituations && 'Avoided situations',
                                            log.ocdData.interferedRoutines && 'Interfered with routines',
                                            log.ocdData.relationshipProblems && 'Relationship problems',
                                            log.ocdData.unableToComplete && 'Unable to complete tasks',
                                          ].filter(Boolean).join(', ')}
                                        </div>
                                    )}

                                    {log.ocdData.trigger && (
                                        <div>
                                          <span className="font-semibold">Trigger:</span> {log.ocdData.trigger}
                                        </div>
                                    )}
                                  </div>
                              )}

                              {/* Adjustment Disorder Form Data */}
                              {log.adjustmentDisorderData && (
                                  <div className="text-xs text-gray-600 dark:text-gray-400 space-y-1 flex flex-col items-start">
                                    {/* Stressor Information */}
                                    {log.adjustmentDisorderData.stressor && (
                                        <div>
                                          <span className="font-semibold">Stressor:</span> {log.adjustmentDisorderData.stressor}
                                        </div>
                                    )}

                                    {log.adjustmentDisorderData.stressorDate && (
                                        <div>
                                          <span className="font-semibold">Stressor Date:</span> {log.adjustmentDisorderData.stressorDate}
                                          {log.adjustmentDisorderData.daysSinceStressor && (
                                              <span className="ml-2 text-gray-500">
                                        ({log.adjustmentDisorderData.daysSinceStressor} days ago
                                                {parseInt(log.adjustmentDisorderData.daysSinceStressor) > 180 &&
                                                    <span className="text-amber-600 dark:text-amber-400"> - Chronic</span>
                                                })
                                    </span>
                                          )}
                                        </div>
                                    )}

                                    {/* Presentation Type */}
                                    {log.adjustmentDisorderData.presentationType && (
                                        <div>
                                <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200">
                                    {log.adjustmentDisorderData.presentationType === 'depressed' && 'With Depressed Mood'}
                                  {log.adjustmentDisorderData.presentationType === 'anxiety' && 'With Anxiety'}
                                  {log.adjustmentDisorderData.presentationType === 'mixed-emotions' && 'Mixed Anxiety & Depression'}
                                  {log.adjustmentDisorderData.presentationType === 'conduct' && 'With Conduct Disturbance'}
                                  {log.adjustmentDisorderData.presentationType === 'mixed-conduct-emotions' && 'Mixed Conduct & Emotions'}
                                  {log.adjustmentDisorderData.presentationType === 'unspecified' && 'Unspecified'}
                                </span>
                                        </div>
                                    )}

                                    {/* Emotional/Behavioral Symptoms */}
                                    {(log.adjustmentDisorderData.tearfulness || log.adjustmentDisorderData.hopelessness ||
                                        log.adjustmentDisorderData.worry || log.adjustmentDisorderData.physicalTension ||
                                        log.adjustmentDisorderData.impulsiveBehaviors || log.adjustmentDisorderData.aggression ||
                                        log.adjustmentDisorderData.ruleViolations || log.adjustmentDisorderData.recklessBehavior) && (
                                        <div>
                                          <span className="font-semibold">Symptoms:</span>{' '}
                                          {[
                                            log.adjustmentDisorderData.tearfulness && 'Tearfulness',
                                            log.adjustmentDisorderData.hopelessness && 'Hopelessness',
                                            log.adjustmentDisorderData.worry && 'Worry',
                                            log.adjustmentDisorderData.physicalTension && 'Physical tension',
                                            log.adjustmentDisorderData.impulsiveBehaviors && 'Impulsive behaviors',
                                            log.adjustmentDisorderData.aggression && 'Aggression',
                                            log.adjustmentDisorderData.ruleViolations && 'Rule violations',
                                            log.adjustmentDisorderData.recklessBehavior && 'Reckless behavior',
                                          ].filter(Boolean).join(', ')}
                                        </div>
                                    )}

                                    {/* Functional Impact */}
                                    {(log.adjustmentDisorderData.workDifficulty || log.adjustmentDisorderData.relationshipProblems ||
                                        log.adjustmentDisorderData.socialWithdrawal || log.adjustmentDisorderData.selfCareNeglect ||
                                        log.adjustmentDisorderData.unableToFulfillResponsibilities) && (
                                        <div>
                                          <span className="font-semibold">Impact:</span>{' '}
                                          {[
                                            log.adjustmentDisorderData.workDifficulty && 'Work difficulty',
                                            log.adjustmentDisorderData.relationshipProblems && 'Relationship problems',
                                            log.adjustmentDisorderData.socialWithdrawal && 'Social withdrawal',
                                            log.adjustmentDisorderData.selfCareNeglect && 'Self-care neglect',
                                            log.adjustmentDisorderData.unableToFulfillResponsibilities && 'Unable to fulfill responsibilities',
                                          ].filter(Boolean).join(', ')}
                                        </div>
                                    )}

                                    {/* Progress Tracking */}
                                    {log.adjustmentDisorderData.symptomsImproving !== null && (
                                        <div>
                                          <span className="font-semibold">Symptoms Improving:</span>{' '}
                                          {log.adjustmentDisorderData.symptomsImproving === true && 'Yes'}
                                          {log.adjustmentDisorderData.symptomsImproving === false && 'No'}
                                          {log.adjustmentDisorderData.symptomsImproving === null && 'Unsure'}
                                        </div>
                                    )}

                                    {log.adjustmentDisorderData.stillAffectingFunctioning !== null && (
                                        <div>
                                          <span className="font-semibold">Affecting Functioning:</span>{' '}
                                          {log.adjustmentDisorderData.stillAffectingFunctioning === true && 'Yes'}
                                          {log.adjustmentDisorderData.stillAffectingFunctioning === false && 'No'}
                                          {log.adjustmentDisorderData.stillAffectingFunctioning === null && 'Somewhat'}
                                        </div>
                                    )}

                                    {log.adjustmentDisorderData.context && (
                                        <div>
                                          <span className="font-semibold">Context:</span> {log.adjustmentDisorderData.context}
                                        </div>
                                    )}
                                  </div>
                              )}

                              {/* Phase 8B: Binge Eating Disorder Details */}
                              {log.bingeEatingData && (
                                  <div className="bg-purple-50 dark:bg-purple-900/30 rounded-lg p-3 mb-2 text-sm">
                                    <div className="flex items-center gap-2 mb-2">
                                      <span className="text-purple-600 dark:text-purple-400">🍽️</span>
                                      <span className="font-semibold text-purple-800 dark:text-purple-200">Binge Eating Details</span>
                                    </div>
                                    <div className="text-xs text-purple-700 dark:text-purple-300">
                                      <div className="flex flex-wrap gap-2 mb-1">
                                      {log.bingeEatingData.bingeEpisode && (
                                          <span className="px-2 py-1 bg-purple-200 dark:bg-purple-900 text-purple-800 dark:text-purple-200 rounded-full text-xs inline-block">
                                            Binge episode
                                          </span>
                                      )}
                                      {log.bingeEatingData.lossOfControl && (
                                          <span className="px-2 py-1 bg-red-200 dark:bg-red-900 text-red-800 dark:text-red-200 rounded-full text-xs inline-block ml-2">
                                            Loss of control
                                          </span>
                                      )}
                                      </div>
                                      {log.bingeEatingData.distressLevel && (
                                          <p className="text-xs text-purple-600 dark:text-purple-400 mt-1">
                                            Distress level: {log.bingeEatingData.distressLevel}/10
                                          </p>
                                      )}
                                    </div>
                                  </div>
                              )}

                              {/* Phase 8B: Dissociative Disorders Details */}
                              {log.dissociativeData && (
                                  <div className="bg-indigo-50 dark:bg-indigo-900/30 rounded-lg p-3 mb-2 text-sm">
                                    <div className="flex items-center gap-2 mb-2">
                                      <span className="text-indigo-600 dark:text-indigo-400">🌀</span>
                                      <span className="font-semibold text-indigo-800 dark:text-indigo-200">Dissociative Episode</span>
                                    </div>
                                    <div className="text-xs text-indigo-700 dark:text-indigo-300">
                                      <div className="flex flex-wrap gap-2 mb-1">
                                      {log.dissociativeData.memoryGap && (
                                          <span className="px-2 py-1 bg-indigo-200 dark:bg-indigo-900 text-indigo-800 dark:text-indigo-200 rounded-full text-xs inline-block">
                                            Memory gap
                                          </span>
                                      )}
                                      {log.dissociativeData.lostTime && (
                                          <span className="px-2 py-1 bg-indigo-200 dark:bg-indigo-900 text-indigo-800 dark:text-indigo-200 rounded-full text-xs inline-block ml-2">
                                            Lost time
                                          </span>
                                      )}
                                      </div>
                                      {log.dissociativeData.duration && (
                                          <p className="text-xs text-indigo-600 dark:text-indigo-400 mt-1">
                                            Duration: {log.dissociativeData.duration}
                                          </p>
                                      )}
                                    </div>
                                  </div>
                              )}

                              {/* Phase 8B: Acute Stress Disorder Details */}
                              {log.acuteStressData && (
                                  <div className="bg-red-50 dark:bg-red-900/30 rounded-lg p-3 mb-2 text-sm">
                                    <div className="flex items-center gap-2 mb-2">
                                      <span className="text-red-600 dark:text-red-400">⚡</span>
                                      <span className="font-semibold text-red-800 dark:text-red-200">Acute Stress Details</span>
                                    </div>
                                    <div className="text-xs text-red-700 dark:text-red-300">
                                      {log.acuteStressData.traumaDate && (
                                          <p className="text-xs text-red-600 dark:text-red-400 mb-1">
                                            Trauma date: {new Date(log.acuteStressData.traumaDate).toLocaleDateString()}
                                          </p>
                                      )}
                                      <div className="flex flex-wrap gap-2">
                                      {log.acuteStressData.dissociativeSymptoms && (
                                          <span className="px-2 py-1 bg-red-200 dark:bg-red-900 text-red-800 dark:text-red-200 rounded-full text-xs inline-block">
                                            Dissociative symptoms
                                          </span>
                                      )}
                                      {log.acuteStressData.avoidance && (
                                          <span className="px-2 py-1 bg-orange-200 dark:bg-orange-900 text-orange-800 dark:text-orange-200 rounded-full text-xs inline-block ml-2">
                                            Avoidance behaviors
                                          </span>
                                      )}
                                    </div>
                                  </div>
                                  </div>
                              )}

                              {/* Phase 8B: Personality Disorders Details */}
                              {log.personalityData && (
                                  <div className="bg-amber-50 dark:bg-amber-900/30 rounded-lg p-3 mb-2 text-sm">
                                    <div className="flex items-center gap-2 mb-2">
                                      <span className="text-amber-600 dark:text-amber-400">🎭</span>
                                      <span className="font-semibold text-amber-800 dark:text-amber-200">Functional Impact</span>
                                    </div>
                                    <div className="text-xs text-amber-700 dark:text-amber-300">
                                      <div className="flex flex-wrap gap-2">
                                      {log.personalityData.occupationalImpact && (
                                          <span className="px-2 py-1 bg-amber-200 dark:bg-amber-900 text-amber-800 dark:text-amber-200 rounded-full text-xs inline-block">
                                            💼 Work/school impact
                                          </span>
                                      )}
                                      {log.personalityData.socialImpact && (
                                          <span className="px-2 py-1 bg-amber-200 dark:bg-amber-900 text-amber-800 dark:text-amber-200 rounded-full text-xs inline-block ml-2">
                                            👥 Relationship impact
                                          </span>
                                      )}
                                    </div>
                                    </div>
                                  </div>
                              )}

                              {/* Phase 9: Cardiovascular Data Display */}
                              {log.cardiovascularData && (
                                  <div className="flex flex-wrap gap-1 mt-1">
                                    {log.cardiovascularData.activityLevel && (
                                        <span className="px-2 py-0.5 bg-rose-100 dark:bg-rose-900/30 text-rose-700 dark:text-rose-300 rounded text-xs">
                                  METs: {log.cardiovascularData.activityLevel === 'greater-than-10' ? '>10' :
                                            log.cardiovascularData.activityLevel === 'less-than-1' ? '<1' :
                                                log.cardiovascularData.activityLevel}
                                </span>
                                    )}
                                    {log.cardiovascularData.atRest && (
                                        <span className="px-2 py-0.5 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 rounded text-xs">
                                  At rest
                                </span>
                                    )}
                                    {log.cardiovascularData.withExertion && (
                                        <span className="px-2 py-0.5 bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300 rounded text-xs">
                                  With exertion
                                </span>
                                    )}
                                    {log.cardiovascularData.treatmentRequired && log.cardiovascularData.treatmentRequired !== 'none' && (
                                        <span className="px-2 py-0.5 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 rounded text-xs">
                                  Tx: {log.cardiovascularData.treatmentRequired}
                                </span>
                                    )}
                                    {log.cardiovascularData.hospitalized && (
                                        <span className="px-2 py-0.5 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 rounded text-xs">
                                  Hospitalized
                                </span>
                                    )}
                                    {log.cardiovascularData.hasAICD && (
                                        <span className="px-2 py-0.5 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 rounded text-xs">
                                  AICD
                                </span>
                                    )}
                                    {log.cardiovascularData.aicdShockDelivered && (
                                        <span className="px-2 py-0.5 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 rounded text-xs">
                                  AICD Shock
                                </span>
                                    )}
                                    {log.cardiovascularData.activeInfection && (
                                        <span className="px-2 py-0.5 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 rounded text-xs">
                                  Active infection
                                </span>
                                    )}
                                    {log.cardiovascularData.painWorseWithBreathing && (
                                        <span className="px-2 py-0.5 bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300 rounded text-xs">
                                  Worse w/ breathing
                                </span>
                                    )}
                                    {log.cardiovascularData.painReliefLeaningForward && (
                                        <span className="px-2 py-0.5 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 rounded text-xs">
                                  Relief leaning forward
                                </span>
                                    )}
                                    {log.cardiovascularData.affectedLeg && (
                                        <span className="px-2 py-0.5 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded text-xs">
                                  {log.cardiovascularData.affectedLeg === 'left' ? 'Left leg' :
                                      log.cardiovascularData.affectedLeg === 'right' ? 'Right leg' : 'Both legs'}
                                </span>
                                    )}
                                    {log.cardiovascularData.compressionUsed && (
                                        <span className="px-2 py-0.5 bg-teal-100 dark:bg-teal-900/30 text-teal-700 dark:text-teal-300 rounded text-xs">
                                  Compression
                                </span>
                                    )}
                                    {log.cardiovascularData.elevationHelps && (
                                        <span className="px-2 py-0.5 bg-teal-100 dark:bg-teal-900/30 text-teal-700 dark:text-teal-300 rounded text-xs">
                                  Elevation helps
                                </span>
                                    )}
                                  </div>
                              )}

                              {/* Phase 10: Digestive Details */}
                              {log.digestiveData && (
                                  <div className="bg-amber-50 dark:bg-amber-900/30 rounded-lg p-3 mb-2 text-sm">
                                    <div className="flex items-center gap-2 mb-2">
                                      <span className="text-amber-600 dark:text-amber-400">🫁</span>
                                      <span className="font-semibold text-amber-800 dark:text-amber-200">Digestive Details</span>
                                    </div>
                                    <div className="flex flex-wrap gap-2">
                                      {/* Cirrhosis fields */}
                                      {log.digestiveData.hasAscites && (
                                          <span className="px-2 py-1 bg-amber-200 dark:bg-amber-800 text-amber-800 dark:text-amber-200 rounded-full text-xs">
                                            Ascites{log.digestiveData.ascitesSeverity ? ` (${log.digestiveData.ascitesSeverity})` : ''}
                                          </span>
                                      )}
                                      {log.digestiveData.hasEncephalopathy && (
                                          <span className="px-2 py-1 bg-red-200 dark:bg-red-800 text-red-800 dark:text-red-200 rounded-full text-xs">
                                            🧠 Encephalopathy
                                          </span>
                                      )}
                                      {log.digestiveData.hasVaricealBleed && (
                                          <span className="px-2 py-1 bg-red-300 dark:bg-red-700 text-red-800 dark:text-red-200 rounded-full text-xs">
                                            🩸 Variceal bleed
                                          </span>
                                      )}
                                      {log.digestiveData.onLactulose && (
                                          <span className="px-2 py-1 bg-amber-200 dark:bg-amber-800 text-amber-800 dark:text-amber-200 rounded-full text-xs">
                                            💊 On lactulose
                                          </span>
                                      )}
                                      {log.digestiveData.onDiuretics && (
                                          <span className="px-2 py-1 bg-amber-200 dark:bg-amber-800 text-amber-800 dark:text-amber-200 rounded-full text-xs">
                                            💊 On diuretics
                                          </span>
                                      )}
                                      {/* Gastritis fields */}
                                      {log.digestiveData.episodeDuration && (
                                          <span className="px-2 py-1 bg-amber-200 dark:bg-amber-800 text-amber-800 dark:text-amber-200 rounded-full text-xs">
                                            Episode: {log.digestiveData.episodeDuration} days
                                          </span>
                                      )}
                                      {log.digestiveData.onDailyMedication && (
                                          <span className="px-2 py-1 bg-amber-200 dark:bg-amber-800 text-amber-800 dark:text-amber-200 rounded-full text-xs">
                                            💊 Daily medication{log.digestiveData.medicationType ? ` (${log.digestiveData.medicationType})` : ''}
                                          </span>
                                      )}
                                      {log.digestiveData.hasGIBleeding && (
                                          <span className="px-2 py-1 bg-red-300 dark:bg-red-700 text-red-800 dark:text-red-200 rounded-full text-xs">
                                            🩸 GI bleeding
                                          </span>
                                      )}
                                      {/* Pancreatitis fields */}
                                      {log.digestiveData.painLocation && (
                                          <span className="px-2 py-1 bg-amber-200 dark:bg-amber-800 text-amber-800 dark:text-amber-200 rounded-full text-xs">
                                            Pain: {log.digestiveData.painLocation}
                                          </span>
                                      )}
                                      {log.digestiveData.onEnzymes && (
                                          <span className="px-2 py-1 bg-amber-200 dark:bg-amber-800 text-amber-800 dark:text-amber-200 rounded-full text-xs">
                                            💊 On enzymes
                                          </span>
                                      )}
                                      {log.digestiveData.hasMaldigestion && (
                                          <span className="px-2 py-1 bg-amber-200 dark:bg-amber-800 text-amber-800 dark:text-amber-200 rounded-full text-xs">
                                            Maldigestion
                                          </span>
                                      )}
                                      {log.digestiveData.hasDietaryRestriction && (
                                          <span className="px-2 py-1 bg-amber-200 dark:bg-amber-800 text-amber-800 dark:text-amber-200 rounded-full text-xs">
                                            🍽️ Diet restriction{log.digestiveData.dietaryRestrictionType ? ` (${log.digestiveData.dietaryRestrictionType})` : ''}
                                          </span>
                                      )}
                                      {/* Biliary fields */}
                                      {log.digestiveData.attackWithNausea && log.digestiveData.attackWithVomiting && (
                                          <span className="px-2 py-1 bg-green-200 dark:bg-green-800 text-green-800 dark:text-green-200 rounded-full text-xs">
                                            ✓ Attack with N/V (documented)
                                          </span>
                                      )}
                                      {log.digestiveData.attackWithNausea && !log.digestiveData.attackWithVomiting && (
                                          <span className="px-2 py-1 bg-amber-200 dark:bg-amber-800 text-amber-800 dark:text-amber-200 rounded-full text-xs">
                                            Nausea
                                          </span>
                                      )}
                                      {log.digestiveData.attackWithVomiting && !log.digestiveData.attackWithNausea && (
                                          <span className="px-2 py-1 bg-amber-200 dark:bg-amber-800 text-amber-800 dark:text-amber-200 rounded-full text-xs">
                                            Vomiting
                                          </span>
                                      )}
                                      {log.digestiveData.hadStrictureDilation && (
                                          <span className="px-2 py-1 bg-purple-200 dark:bg-purple-800 text-purple-800 dark:text-purple-200 rounded-full text-xs">
                                            Stricture dilation
                                          </span>
                                      )}
                                      {/* Common field */}
                                      {log.digestiveData.hospitalized && (
                                          <span className="px-2 py-1 bg-red-300 dark:bg-red-700 text-red-800 dark:text-red-200 rounded-full text-xs">
                                            🏥 Hospitalized
                                          </span>
                                      )}
                                    </div>
                                  </div>
                              )}



                              {log.notes && (
                                  <p className="text-sm text-gray-700 dark:text-gray-300 bg-gray-50 dark:bg-gray-700 p-2 rounded">{log.notes}</p>
                              )}
                            </div>

                            <div className="flex flex-col gap-1 ml-2">
                              <button onClick={() => onCopyLog && onCopyLog(log)}
                                      className="text-gray-400 dark:text-gray-500 hover:text-green-500 dark:hover:text-green-400 p-1" title="Log again">🔄</button>
                              <button onClick={() => setEditingLog(log)}
                                      className="text-gray-400 dark:text-gray-500 hover:text-blue-500 dark:hover:text-blue-400 p-1" title="Edit">✏️</button>
                              <button onClick={() => handleDelete(log.id)}
                                      className="text-gray-400 dark:text-gray-500 hover:text-red-500 dark:hover:text-red-400 p-1" title="Delete">🗑️</button>
                            </div>
                          </div>
                        </div>


                    ))}
                  </div>
              )}



              <EditLogModal log={editingLog} isOpen={editingLog !== null}
                            onClose={() => setEditingLog(null)} onSaved={() => { loadLogs(); }} />
            </>
        )}

        {/* Appointments Tab Content */}
        {mainTab === 'appointments' && (
            <div>
              {/* Sub-tabs for appointments */}
              <div className="flex gap-2 mb-4">
                <button
                    onClick={() => setAppointmentTab('history')}
                    className={`flex-1 py-2 px-4 rounded-lg font-medium transition-colors ${
                        appointmentTab === 'history'
                            ? 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200'
                            : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600'
                    }`}
                >
                  📋 History
                </button>
                <button
                    onClick={() => setAppointmentTab('add')}
                    className={`flex-1 py-2 px-4 rounded-lg font-medium transition-colors ${
                        appointmentTab === 'add'
                            ? 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200'
                            : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600'
                    }`}
                >
                  ➕ Add New
                </button>
              </div>

              {appointmentTab === 'history' && <AppointmentHistory />}
              {appointmentTab === 'add' && (
                  <AppointmentForm onSaved={() => setAppointmentTab('history')} />
              )}
            </div>
        )}
      </div>
  );
};

export default SymptomHistory;