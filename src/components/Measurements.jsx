import { useState, useEffect } from 'react';
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


/**
 * Measurements Component - Phase 1
 * Displays measurement tracking interface for objective health data
 */
const Measurements = () => {
  const { features } = useProfile();
  const [measurements, setMeasurements] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedMeasurementType, setSelectedMeasurementType] = useState(null);
  const [filterType, setFilterType] = useState('all');


  useEffect(() => {
    loadMeasurements();
  }, [filterType]);

  const loadMeasurements = () => {
    const options = filterType !== 'all' ? { type: filterType } : {};
    setMeasurements(getMeasurements(options));
  };

  const handleAddClick = (measurementType) => {
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

  return (
      <div className="space-y-4">
        {/* Header */}
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
              Measurements
            </h2>
            <span className="text-xs px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 rounded-full">
            Beta
          </span>
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Track objective health measurements for VA documentation
          </p>
        </div>

        {/* Quick Add Buttons */}
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4">
          <h3 className="text-sm font-medium text-gray-900 dark:text-white mb-3">
            Quick Log Measurement
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
            {measurementTypes.map(type => (
                <button
                    key={type.id}
                    onClick={() => handleAddClick(type)}
                    className="flex items-center gap-2 p-3 rounded-lg border border-gray-200 dark:border-gray-600
                       hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-left"
                >
                  <span className="text-2xl">{type.icon}</span>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium text-gray-900 dark:text-white truncate">
                      {type.shortName}
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400 truncate">
                      {type.name}
                    </div>
                  </div>
                </button>
            ))}
          </div>
        </div>

        {/* Filter */}
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4">
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
            Filter by type:
          </label>
          <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="w-full md:w-64 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg
                   bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
          >
            <option value="all">All measurements</option>
            {measurementTypes.map(type => (
                <option key={type.id} value={type.id}>
                  {type.icon} {type.name}
                </option>
            ))}
          </select>
        </div>

        {/* Measurements List */}
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
          <div className="p-4 border-b border-gray-200 dark:border-gray-700">
            <h3 className="text-sm font-medium text-gray-900 dark:text-white">
              Recent Measurements ({filteredMeasurements.length})
            </h3>
          </div>

          {filteredMeasurements.length === 0 ? (
              <div className="p-8 text-center">
                <div className="text-4xl mb-2">📊</div>
                <p className="text-gray-500 dark:text-gray-400">
                  No measurements logged yet
                </p>
                <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">
                  Click a button above to log your first measurement
                </p>
              </div>
          ) : (
              <div className="divide-y divide-gray-200 dark:divide-gray-700">
                {filteredMeasurements.map(measurement => (
                    <MeasurementCard
                        key={measurement.id}
                        measurement={measurement}
                        onDelete={handleDeleteMeasurement}
                    />
                ))}
              </div>
          )}
        </div>

        {/* Add Measurement Modal */}
        {showAddModal && selectedMeasurementType && (
            <AddMeasurementModal
                measurementType={selectedMeasurementType}
                onSave={handleSaveMeasurement}
                onCancel={() => {
                  setShowAddModal(false);
                  setSelectedMeasurementType(null);
                }}
            />
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
                    {typeof value === 'boolean' ? (value ? 'Yes' : 'No') : value}
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
                            value={metadata[field.key] || ''}
                            onChange={(e) => handleMetadataChange(field.key, parseFloat(e.target.value) || '')}
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