import { useState, useEffect } from 'react';
import { getSymptomLogs, deleteSymptomLog, getMedicationLogsForSymptom } from '../utils/storage';
import EditLogModal from './EditLogModal';
import AppointmentForm from './AppointmentForm';
import AppointmentHistory from './AppointmentHistory';

const SymptomHistory = () => {
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
                                <span>{formatDate(log.timestamp)}</span>
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

                              {log.notes && (
                                  <p className="text-sm text-gray-700 dark:text-gray-300 bg-gray-50 dark:bg-gray-700 p-2 rounded">{log.notes}</p>
                              )}
                            </div>

                            <div className="flex flex-col gap-1 ml-2">
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