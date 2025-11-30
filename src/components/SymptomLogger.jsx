import { useState, useEffect } from 'react';
import { symptomCategories } from '../data/symptoms';
import { saveSymptomLog, getCustomSymptoms, addCustomSymptom } from '../utils/storage';

const SymptomLogger = ({ onLogSaved }) => {
  const [selectedSymptom, setSelectedSymptom] = useState('');
  const [severity, setSeverity] = useState(5);
  const [notes, setNotes] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);
  const [customSymptoms, setCustomSymptoms] = useState([]);

  // Custom symptom form state
  const [showCustomForm, setShowCustomForm] = useState(false);
  const [newSymptomName, setNewSymptomName] = useState('');
  const [newSymptomCategory, setNewSymptomCategory] = useState('Custom');
  const [customError, setCustomError] = useState('');

  // Load custom symptoms on mount
  useEffect(() => {
    setCustomSymptoms(getCustomSymptoms());
  }, []);

  // Build combined symptom list with custom symptoms
  const getAllCategories = () => {
    const categories = [...symptomCategories];

    // Group custom symptoms by category
    const customByCategory = {};
    customSymptoms.forEach(symptom => {
      if (!customByCategory[symptom.category]) {
        customByCategory[symptom.category] = [];
      }
      customByCategory[symptom.category].push(symptom);
    });

    // Add custom symptoms to existing categories or create new ones
    Object.entries(customByCategory).forEach(([categoryName, symptoms]) => {
      const existingCategory = categories.find(c => c.name === categoryName);
      if (existingCategory) {
        // Add to existing category
        existingCategory.symptoms = [
          ...existingCategory.symptoms,
          ...symptoms
        ];
      } else {
        // Create new category for custom symptoms
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

    // Find the symptom details from combined list
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

  const handleAddCustomSymptom = (e) => {
    e.preventDefault();
    setCustomError('');

    if (!newSymptomName.trim()) {
      setCustomError('Please enter a symptom name');
      return;
    }

    const result = addCustomSymptom(newSymptomName, newSymptomCategory);

    if (result.success) {
      // Refresh custom symptoms list
      setCustomSymptoms(getCustomSymptoms());
      // Select the new symptom
      setSelectedSymptom(result.symptom.id);
      // Reset and close form
      setNewSymptomName('');
      setNewSymptomCategory('Custom');
      setShowCustomForm(false);
    } else {
      setCustomError(result.message);
    }
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
  const allCategories = getAllCategories();

  return (
      <div className="pb-20">
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

        {/* Custom Symptoms Count */}
        {customSymptoms.length > 0 && (
            <p className="text-xs text-gray-500 text-center mt-4">
              {customSymptoms.length} custom symptom{customSymptoms.length !== 1 ? 's' : ''} saved
            </p>
        )}
      </div>
  );
};

export default SymptomLogger;