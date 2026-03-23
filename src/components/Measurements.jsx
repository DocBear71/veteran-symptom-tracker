import { useState, useEffect, useCallback } from 'react';
import { getMentalHealthScores, deleteMentalHealthScore } from '../utils/storage';
import {
  getMeasurements,
  saveMeasurement,
  deleteMeasurement,
  getHeight,
} from '../utils/measurements';
import {
  getAllMeasurementTypes,
  getMeasurementType,
  interpretMeasurement,
  formatMeasurementValue,
} from '../data/measurementTypes';
import { useProfile } from '../hooks/useProfile';
import { formatLocalDateTime } from '../utils/datetime';


const MEAS_TABS = [
  { id: 'vitals',        label: '🩺 Vitals & Labs' },
  { id: 'mental_health', label: '🧠 Mental Health' },
];

/**
 * Measurements Component - Phase 1
 * Displays measurement tracking interface for objective health data
 */
const Measurements = ({ onNavigate }) => {
  const { features } = useProfile();
  const [activeTab, setActiveTab]           = useState('vitals');
  const [measurements, setMeasurements]     = useState([]);
  const [mentalHealthScores, setMentalHealthScores] = useState([]);
  const [showAddModal, setShowAddModal]     = useState(false);
  const [selectedMeasurementType, setSelectedMeasurementType] = useState(null);
  const [filterType, setFilterType]         = useState('all');

  const loadMeasurements = useCallback(() => {
    const options = filterType !== 'all' ? { type: filterType } : {};
    setMeasurements(getMeasurements(options));
  }, [filterType]);

  const loadMentalHealth = useCallback(() => {
    const scores = getMentalHealthScores();
    // Sort newest first
    setMentalHealthScores([...scores].sort((a, b) =>
        new Date(b.dateStr) - new Date(a.dateStr)
    ));
  }, []);

  useEffect(() => { loadMeasurements(); }, [loadMeasurements]);
  useEffect(() => { loadMentalHealth(); }, [loadMentalHealth]);

  const handleAddClick = (measurementType) => {
    // Weight gets its own dedicated tracker page instead of the modal
    if (measurementType.id === 'weight' && onNavigate) {
      onNavigate('weight-tracker');
      return;
    }
    setSelectedMeasurementType(measurementType);
    setShowAddModal(true);
  };

  const handleSaveMeasurement = (measurementData) => {
    saveMeasurement(measurementData);
    loadMeasurements();
    setShowAddModal(false);
    setSelectedMeasurementType(null);
  };

  const handleDeleteMeasurement = (id) => {
    if (window.confirm('Delete this measurement?')) {
      deleteMeasurement(id);
      loadMeasurements();
    }
  };

  const measurementTypes = getAllMeasurementTypes();
  const filteredMeasurements = measurements;

  const handleDeleteMentalHealth = (id) => {
    if (window.confirm('Delete this mental health assessment record?')) {
      deleteMentalHealthScore(id);
      loadMentalHealth();
    }
  };

  return (
      <div className="space-y-4 text-left">
        {/* Header */}
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Measurements</h2>
            <span className="text-xs px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 rounded-full">Beta</span>
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Track objective health data and mental health assessments for VA documentation
          </p>
        </div>

        {/* Tab Bar */}
        <div className="flex gap-2">
          {MEAS_TABS.map(tab => (
              <button key={tab.id} onClick={() => setActiveTab(tab.id)}
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                          activeTab === tab.id
                              ? 'bg-blue-900 dark:bg-blue-600 text-white'
                              : 'bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:border-blue-300 dark:hover:border-blue-600'
                      }`}>
                {tab.label}
              </button>
          ))}
        </div>

        {/* ── VITALS & LABS TAB ── */}
        {activeTab === 'vitals' && (
            <>
              {/* Quick Add Buttons */}
              <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4">
                <h3 className="text-sm font-medium text-gray-900 dark:text-white mb-3">Quick Log Measurement</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {measurementTypes.map(type => (
                      <button key={type.id} onClick={() => handleAddClick(type)}
                              className="flex items-center gap-3 p-3 rounded-lg border border-gray-200 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-left">
                        <span className="text-2xl flex-shrink-0">{type.icon}</span>
                        <div className="flex-1 min-w-0">
                          <div className="text-sm font-medium text-gray-900 dark:text-white">{type.shortName}</div>
                          <div className="text-xs text-gray-500 dark:text-gray-400">{type.name}</div>
                        </div>
                      </button>
                  ))}
                </div>
              </div>

              {/* Filter */}
              <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">Filter by type:</label>
                <select value={filterType} onChange={(e) => setFilterType(e.target.value)}
                        className="w-full md:w-64 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white">
                  <option value="all">All measurements</option>
                  {measurementTypes.map(type => (
                      <option key={type.id} value={type.id}>{type.icon} {type.name}</option>
                  ))}
                </select>
              </div>

              {/* Measurements List */}
              <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
                <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                  <h3 className="text-sm font-medium text-gray-900 dark:text-white">
                    Recent Measurements ({measurements.length})
                  </h3>
                </div>
                {measurements.length === 0 ? (
                    <div className="p-8 text-center">
                      <div className="text-4xl mb-2">📊</div>
                      <p className="text-gray-500 dark:text-gray-400">No measurements logged yet</p>
                      <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">Click a button above to log your first measurement</p>
                    </div>
                ) : (
                    <div className="divide-y divide-gray-200 dark:divide-gray-700">
                      {measurements.map(measurement => (
                          <MeasurementCard key={measurement.id} measurement={measurement} onDelete={handleDeleteMeasurement} />
                      ))}
                    </div>
                )}
              </div>
            </>
        )}

        {/* ── MENTAL HEALTH TAB ── */}
        {activeTab === 'mental_health' && (
            <MentalHealthTab
                scores={mentalHealthScores}
                onDelete={handleDeleteMentalHealth}
            />
        )}

        {/* Add Measurement Modal */}
        {showAddModal && selectedMeasurementType && (
            <AddMeasurementModal
                measurementType={selectedMeasurementType}
                onSave={handleSaveMeasurement}
                onCancel={() => { setShowAddModal(false); setSelectedMeasurementType(null); }}
            />
        )}
      </div>
  );
};

// ─────────────────────────────────────────────────────────────
// Severity band helpers for GAD-7, PHQ-9, PCL-5
// ─────────────────────────────────────────────────────────────

const GAD7_BANDS = [
  { max: 4,  label: 'Minimal',           color: 'green'  },
  { max: 9,  label: 'Mild',              color: 'yellow' },
  { max: 14, label: 'Moderate',          color: 'orange' },
  { max: 21, label: 'Severe',            color: 'red'    },
];
const PHQ9_BANDS = [
  { max: 4,  label: 'Minimal',           color: 'green'  },
  { max: 9,  label: 'Mild',              color: 'yellow' },
  { max: 14, label: 'Moderate',          color: 'orange' },
  { max: 19, label: 'Moderately Severe', color: 'orange' },
  { max: 27, label: 'Severe',            color: 'red'    },
];
const PCL5_BANDS = [
  { max: 30, label: 'Below threshold',   color: 'green'  },
  { max: 49, label: 'Moderate PTSD',     color: 'orange' },
  { max: 80, label: 'Severe PTSD',       color: 'red'    },
];

const _getSeverity = (score, bands) => {
  if (score === null || score === undefined) return null;
  return bands.find(b => score <= b.max) || bands[bands.length - 1];
};

const SEVERITY_COLORS = {
  green:  'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300',
  yellow: 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300',
  orange: 'bg-orange-100 dark:bg-orange-900/30 text-orange-800 dark:text-orange-300',
  red:    'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300',
};

const SeverityBadge = ({ score, bands }) => {
  const sev = _getSeverity(score, bands);
  if (!sev) return null;
  return (
      <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${SEVERITY_COLORS[sev.color]}`}>
        {sev.label}
      </span>
  );
};

// ─────────────────────────────────────────────────────────────
// Mental Health Tab
// ─────────────────────────────────────────────────────────────

const MentalHealthTab = ({ scores, onDelete }) => {
  if (scores.length === 0) {
    return (
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-8 text-center">
          <div className="text-4xl mb-2">🧠</div>
          <p className="text-gray-600 dark:text-gray-400 font-medium">No mental health scores yet</p>
          <p className="text-sm text-gray-500 dark:text-gray-500 mt-1">
            Import your VA Blue Button file to pull in GAD-7, PHQ-9, and PCL-5 scores.
          </p>
        </div>
    );
  }

  return (
      <div className="space-y-3">
        {/* Info banner */}
        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-3 text-xs text-blue-800 dark:text-blue-300">
          🧠 <strong>GAD-7</strong> (anxiety, 0–21) · <strong>PHQ-9</strong> (depression, 0–27) · <strong>PCL-5</strong> (PTSD, 0–80).
          Scores at or above clinical thresholds are highlighted. Expand any record to see item-level responses for C&P documentation.
        </div>

        {scores.map(score => (
            <MentalHealthCard key={score.id} score={score} onDelete={onDelete} />
        ))}
      </div>
  );
};

const MentalHealthCard = ({ score, onDelete }) => {
  const [expanded, setExpanded] = useState(false);
  const hasResponses = score.responses &&
      (score.responses.gad7?.length || score.responses.phq9?.length || score.responses.pcl5?.length);

  const dateDisplay = score.dateStr
      ? new Date(score.dateStr + 'T12:00:00').toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
      : 'Unknown date';

  return (
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4">
        {/* Header row */}
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-gray-900 dark:text-white">{dateDisplay}</p>
            {score.clinician && (
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{score.clinician}{score.location ? ` · ${score.location}` : ''}</p>
            )}
            {score.source === 'blue-button' && (
                <p className="text-xs text-blue-600 dark:text-blue-400 mt-0.5">📥 Imported from VA Blue Button</p>
            )}
          </div>
          <button onClick={() => onDelete(score.id)}
                  className="text-gray-400 hover:text-red-500 dark:hover:text-red-400 flex-shrink-0"
                  title="Delete this record">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
        </div>

        {/* Score row */}
        <div className="flex flex-wrap gap-3 mt-3">
          {score.gad7 !== null && (
              <div className="flex flex-col items-center min-w-[72px] bg-gray-50 dark:bg-gray-700/50 rounded-lg p-2">
                <span className="text-xs text-gray-500 dark:text-gray-400 font-medium">GAD-7</span>
                <span className="text-2xl font-bold text-gray-900 dark:text-white">{score.gad7}</span>
                <span className="text-xs text-gray-400 dark:text-gray-500">/ 21</span>
                <div className="mt-1"><SeverityBadge score={score.gad7} bands={GAD7_BANDS} /></div>
              </div>
          )}
          {score.phq9 !== null && (
              <div className="flex flex-col items-center min-w-[72px] bg-gray-50 dark:bg-gray-700/50 rounded-lg p-2">
                <span className="text-xs text-gray-500 dark:text-gray-400 font-medium">PHQ-9</span>
                <span className="text-2xl font-bold text-gray-900 dark:text-white">{score.phq9}</span>
                <span className="text-xs text-gray-400 dark:text-gray-500">/ 27</span>
                <div className="mt-1"><SeverityBadge score={score.phq9} bands={PHQ9_BANDS} /></div>
              </div>
          )}
          {score.pcl5 !== null && (
              <div className="flex flex-col items-center min-w-[72px] bg-gray-50 dark:bg-gray-700/50 rounded-lg p-2">
                <span className="text-xs text-gray-500 dark:text-gray-400 font-medium">PCL-5</span>
                <span className="text-2xl font-bold text-gray-900 dark:text-white">{score.pcl5}</span>
                <span className="text-xs text-gray-400 dark:text-gray-500">/ 80</span>
                <div className="mt-1"><SeverityBadge score={score.pcl5} bands={PCL5_BANDS} /></div>
              </div>
          )}
        </div>

        {/* Expand/collapse for item responses */}
        {hasResponses && (
            <button onClick={() => setExpanded(e => !e)}
                    className="mt-3 text-xs text-blue-600 dark:text-blue-400 hover:underline">
              {expanded ? '▲ Hide item responses' : '▼ Show item responses (C&P documentation)'}
            </button>
        )}

        {expanded && (
            <div className="mt-3 space-y-3">
              {[
                { key: 'gad7', label: 'GAD-7 — Generalized Anxiety Disorder', responses: score.responses?.gad7 },
                { key: 'phq9', label: 'PHQ-9 — Depression Scale', responses: score.responses?.phq9 },
                { key: 'pcl5', label: 'PCL-5 — PTSD Checklist', responses: score.responses?.pcl5 },
              ].filter(s => s.responses?.length).map(section => (
                  <div key={section.key} className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-3">
                    <p className="text-xs font-semibold text-gray-700 dark:text-gray-300 mb-2">{section.label}</p>
                    <div className="space-y-1.5">
                      {section.responses.map(r => (
                          <div key={r.item} className="text-xs">
                            <span className="text-gray-500 dark:text-gray-400">{r.item}. {r.question}</span>
                            <span className="ml-2 font-medium text-gray-900 dark:text-white">→ {r.answer}</span>
                          </div>
                      ))}
                    </div>
                  </div>
              ))}
            </div>
        )}
      </div>
  );
};

/**
 * Measurement Card Component
 */
const MeasurementCard = ({ measurement, onDelete }) => {
  const [showDetails, setShowDetails] = useState(false);
  const type = getMeasurementType(measurement.measurementType);

  if (!type) return null;

  const interpretation = interpretMeasurement(
      measurement.measurementType,
      measurement.values,
      measurement.metadata
  );

  const timestamp = new Date(measurement.timestamp);
  const formattedDate = timestamp.toLocaleDateString();
  const formattedTime = timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  return (
      <div className="p-4 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
        <div className="flex items-start gap-3">
          <span className="text-2xl mt-1">{type.icon}</span>

          <div className="flex-1 min-w-0">
            {/* Header */}
            <div className="flex items-start justify-between gap-2 mb-1">
              <div>
                <h4 className="font-medium text-gray-900 dark:text-white">
                  {type.name}
                </h4>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {formattedDate} at {formattedTime}
                </p>
              </div>
              <button
                  onClick={() => onDelete(measurement.id)}
                  className="text-gray-400 hover:text-red-600 dark:hover:text-red-400"
                  title="Delete measurement"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
            </div>

            {/* Value */}
            <div className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
              {formatMeasurementValue(measurement.measurementType, measurement.values)}
            </div>

            {/* Interpretation */}
            {interpretation && (
                <div className={`inline-flex items-center gap-1 px-2 py-1 rounded text-xs font-medium ${
                    interpretation.color === 'green' ? 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300' :
                        interpretation.color === 'yellow' ? 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300' :
                            interpretation.color === 'orange' ? 'bg-orange-100 dark:bg-orange-900/30 text-orange-800 dark:text-orange-300' :
                                interpretation.color === 'red' ? 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300' :
                                    'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-300'
                }`}>
                  {interpretation.label}
                </div>
            )}

            {/* Notes */}
            {measurement.notes && (
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                  📝 {measurement.notes}
                </p>
            )}

            {/* Toggle Details */}
            {Object.keys(measurement.metadata).length > 0 && (
                <button
                    onClick={() => setShowDetails(!showDetails)}
                    className="text-xs text-blue-600 dark:text-blue-400 hover:underline mt-2"
                >
                  {showDetails ? 'Hide' : 'Show'} details
                </button>
            )}

            {/* Details */}
            {showDetails && (
                <div className="mt-2 p-2 bg-gray-50 dark:bg-gray-700/50 rounded text-xs space-y-1">
                  {Object.entries(measurement.metadata).map(([key, value]) => (
                      <div key={key} className="flex items-center gap-2">
                  <span className="text-gray-500 dark:text-gray-400 capitalize">
                    {key.replace(/([A-Z])/g, ' $1').trim()}:
                  </span>
                        <span className="text-gray-900 dark:text-white">
                    {typeof value === 'boolean'
                        ? (value ? 'Yes' : 'No')
                        : (value !== undefined && value !== null && value !== '' ? value : '-')}
                  </span>
                      </div>
                  ))}
                </div>
            )}
          </div>
        </div>
      </div>
  );
};

/**
 * Add Measurement Modal Component
 */
const AddMeasurementModal = ({ measurementType, onSave, onCancel }) => {
  const [values, setValues] = useState({});
  const [metadata, setMetadata] = useState({});
  const [notes, setNotes] = useState('');
  const [timestamp, setTimestamp] = useState(() => formatLocalDateTime());

  // Initialize metadata with defaults
  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => {
    const defaultMetadata = {};
    measurementType.metadata?.forEach(field => {
      if (field.default !== undefined) {
        defaultMetadata[field.key] = field.default;
      }
    });
    setMetadata(defaultMetadata);

    // For weight measurements, try to pre-fill height
    if (measurementType.id === 'weight') {
      const savedHeight = getHeight();
      if (savedHeight) {
        setValues(prev => ({ ...prev, height: savedHeight }));
      }
    }
  }, [measurementType]);

  const handleValueChange = (key, value) => {
    setValues(prev => ({ ...prev, [key]: parseFloat(value) || 0 }));
  };

  const handleMetadataChange = (key, value) => {
    setMetadata(prev => ({ ...prev, [key]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Validate required fields
    const requiredFields = measurementType.fields.filter(f => f.required);
    const missingFields = requiredFields.filter(f => !values[f.key] && values[f.key] !== 0);

    if (missingFields.length > 0) {
      alert(`Please fill in: ${missingFields.map(f => f.label).join(', ')}`);
      return;
    }

    onSave({
      measurementType: measurementType.id,
      values,
      metadata,
      notes,
      timestamp: new Date(timestamp).toISOString(),
    });
  };

  return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
        <div className="bg-white dark:bg-gray-800 rounded-lg max-w-md w-full max-h-[90vh] overflow-y-auto">
          {/* Header */}
          <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between sticky top-0 bg-white dark:bg-gray-800">
            <div className="flex items-center gap-2">
              <span className="text-2xl">{measurementType.icon}</span>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Log {measurementType.name}
              </h3>
            </div>
            <button
                onClick={onCancel}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
            >
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="p-4 space-y-4">
            {/* Timestamp */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Date & Time
              </label>
              <input
                  type="datetime-local"
                  value={timestamp}
                  onChange={(e) => setTimestamp(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg
                       bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  required
              />
            </div>

            {/* Value Fields */}
            {measurementType.fields.map(field => (
                <div key={field.key}>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    {field.label} {field.required && <span className="text-red-500">*</span>}
                  </label>
                  {field.help && (
                      <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">
                        {field.help}
                      </p>
                  )}

                  {/* Handle select-type fields (like Bristol Scale) */}
                  {field.type === 'select' ? (
                      <select
                          value={values[field.key] || ''}
                          onChange={(e) => handleValueChange(field.key, e.target.value)}
                          required={field.required}
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg
                             bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      >
                        {field.options.map(option => (
                            <option key={option.value} value={option.value}>
                              {option.label}
                            </option>
                        ))}
                      </select>
                  ) : (
                      <div className="flex items-center gap-2">
                        <input
                            type={field.type}
                            min={field.min}
                            max={field.max}
                            step={field.step || 1}
                            placeholder={field.placeholder}
                            value={values[field.key] || ''}
                            onChange={(e) => handleValueChange(field.key, e.target.value)}
                            required={field.required}
                            className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg
                               bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                        />
                        {field.unit && (
                            <span className="text-sm text-gray-500 dark:text-gray-400">
                              {field.unit}
                            </span>
                        )}
                      </div>
                  )}
                </div>
            ))}

            {/* Metadata Fields */}
            {measurementType.metadata?.map(field => (
                <div key={field.key}>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    {field.label}
                  </label>

                  {field.type === 'boolean' ? (
                      <div className="flex items-center gap-4">
                        <label className="flex items-center gap-2">
                          <input
                              type="radio"
                              checked={metadata[field.key] === true}
                              onChange={() => handleMetadataChange(field.key, true)}
                              className="text-blue-600"
                          />
                          <span className="text-sm text-gray-700 dark:text-gray-300">Yes</span>
                        </label>
                        <label className="flex items-center gap-2">
                          <input
                              type="radio"
                              checked={metadata[field.key] === false}
                              onChange={() => handleMetadataChange(field.key, false)}
                              className="text-blue-600"
                          />
                          <span className="text-sm text-gray-700 dark:text-gray-300">No</span>
                        </label>
                      </div>
                  ) : field.type === 'select' ? (
                      <select
                          value={metadata[field.key] || field.default || ''}
                          onChange={(e) => handleMetadataChange(field.key, e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg
                           bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      >
                        {field.options.map(option => (
                            <option key={option.value} value={option.value}>
                              {option.label}
                            </option>
                        ))}
                      </select>
                  ) : field.type === 'number' ? (
                      <div className="flex items-center gap-2">
                        <input
                            type="number"
                            min={field.min}
                            max={field.max}
                            placeholder={field.placeholder}
                            value={metadata[field.key] !== undefined ? metadata[field.key] : ''}
                            onChange={(e) => {
                              const val = e.target.value;
                              handleMetadataChange(field.key, val === '' ? '' : parseFloat(val));
                            }}
                            className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg
                             bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                        />
                        {field.unit && (
                            <span className="text-sm text-gray-500 dark:text-gray-400">
                      {field.unit}
                    </span>
                        )}
                      </div>
                  ) : null}
                </div>
            ))}

            {/* Notes */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Notes (optional)
              </label>
              <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  rows={2}
                  placeholder="Any additional context..."
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg
                       bg-white dark:bg-gray-700 text-gray-900 dark:text-white resize-none"
              />
            </div>

            {/* Buttons */}
            <div className="flex gap-2 pt-2">
              <button
                  type="button"
                  onClick={onCancel}
                  className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg
                       text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                Cancel
              </button>
              <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg
                       transition-colors font-medium"
              >
                Save Measurement
              </button>
            </div>
          </form>
        </div>
      </div>
  );
};

export default Measurements;