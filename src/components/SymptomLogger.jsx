import { useState } from 'react';
import { symptomCategories } from '../data/symptoms';
import { saveSymptomLog } from '../utils/storage';

const SymptomLogger = ({ onLogSaved }) => {
  const [selectedSymptom, setSelectedSymptom] = useState('');
  const [severity, setSeverity] = useState(5);
  const [notes, setNotes] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!selectedSymptom) return;

    // Find the symptom details
    const symptomData = symptomCategories
    .flatMap(cat => cat.symptoms.map(s => ({ ...s, category: cat.name })))
    .find(s => s.id === selectedSymptom);

    const entry = {
      symptomId: selectedSymptom,
      symptomName: symptomData?.name || selectedSymptom,
      category: symptomData?.category || 'Other',
      severity,
      notes: notes.trim(),
    };

    saveSymptomLog(entry);

    // Reset form
    setSelectedSymptom('');
    setSeverity(5);
    setNotes('');

    // Show success message
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 2000);

    // Notify parent
    if (onLogSaved) onLogSaved();
  };

  // Get severity label and color
  const getSeverityInfo = (value) => {
    if (value <= 2) return { label: 'Minimal', color: 'text-green-600' };
    if (value <= 4) return { label: 'Mild', color: 'text-yellow-600' };
    if (value <= 6) return { label: 'Moderate', color: 'text-orange-500' };
    if (value <= 8) return { label: 'Severe', color: 'text-red-500' };
    return { label: 'Extreme', color: 'text-red-700' };
  };

  const severityInfo = getSeverityInfo(severity);

  return (
      <div className="pb-20"> {/* Padding for bottom nav */}
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
                onChange={(e) => setSelectedSymptom(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
            >
              <option value="">Select a symptom...</option>
              {symptomCategories.map(category => (
                  <optgroup key={category.id} label={category.name}>
                    {category.symptoms.map(symptom => (
                        <option key={symptom.id} value={symptom.id}>
                          {symptom.name}
                        </option>
                    ))}
                  </optgroup>
              ))}
            </select>
          </div>

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