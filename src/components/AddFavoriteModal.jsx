import { useState, useEffect } from 'react';
import { symptomCategories } from '../data/symptoms';
import { getCustomSymptoms, addFavorite, getFavorites } from '../utils/storage';

const AddFavoriteModal = ({ isOpen, onClose, onAdded }) => {
  const [selectedSymptom, setSelectedSymptom] = useState('');
  const [defaultSeverity, setDefaultSeverity] = useState(5);
  const [customSymptoms, setCustomSymptoms] = useState([]);
  const [existingFavorites, setExistingFavorites] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    if (isOpen) {
      setCustomSymptoms(getCustomSymptoms());
      setExistingFavorites(getFavorites().map(f => f.symptomId));
      setSelectedSymptom('');
      setDefaultSeverity(5);
      setError('');
    }
  }, [isOpen]);

  // Build combined symptom list
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

  const handleAdd = () => {
    if (!selectedSymptom) {
      setError('Please select a symptom');
      return;
    }

    const allCategories = getAllCategories();
    const symptomData = allCategories
    .flatMap(cat => cat.symptoms.map(s => ({ ...s, category: cat.name })))
    .find(s => s.id === selectedSymptom);

    if (!symptomData) {
      setError('Symptom not found');
      return;
    }

    const result = addFavorite({
      symptomId: selectedSymptom,
      symptomName: symptomData.name,
      category: symptomData.category,
      defaultSeverity,
    });

    if (result.success) {
      onAdded();
      onClose();
    } else {
      setError(result.message);
    }
  };

  if (!isOpen) return null;

  const allCategories = getAllCategories();

  return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-lg w-full max-w-md max-h-[90vh] overflow-y-auto">
          <div className="p-4 border-b border-gray-200">
            <div className="flex justify-between items-center">
              <h2 className="text-lg font-semibold text-gray-900">Add Favorite</h2>
              <button
                  onClick={onClose}
                  className="text-gray-400 hover:text-gray-600 text-xl"
              >
                ✕
              </button>
            </div>
          </div>

          <div className="p-4 space-y-4">
            {error && (
                <div className="p-3 bg-red-100 text-red-700 rounded-lg text-sm">
                  {error}
                </div>
            )}

            {/* Symptom Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Select Symptom
              </label>
              <select
                  value={selectedSymptom}
                  onChange={(e) => setSelectedSymptom(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Choose a symptom...</option>
                {allCategories.map(category => (
                    <optgroup key={category.id} label={category.name}>
                      {category.symptoms.map(symptom => {
                        const isFavorited = existingFavorites.includes(symptom.id);
                        return (
                            <option
                                key={symptom.id}
                                value={symptom.id}
                                disabled={isFavorited}
                            >
                              {symptom.name} {isFavorited ? '(already favorite)' : ''}
                            </option>
                        );
                      })}
                    </optgroup>
                ))}
              </select>
            </div>

            {/* Default Severity */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Default Severity (for quick logging)
              </label>
              <div className="bg-gray-50 p-4 rounded-lg">
                <input
                    type="range"
                    min="0"
                    max="10"
                    value={defaultSeverity}
                    onChange={(e) => setDefaultSeverity(Number(e.target.value))}
                    className="w-full"
                />
                <div className="flex justify-between mt-1">
                  <span className="text-xs text-gray-500">0</span>
                  <span className="text-lg font-bold text-blue-900">{defaultSeverity}</span>
                  <span className="text-xs text-gray-500">10</span>
                </div>
              </div>
              <p className="text-xs text-gray-500 mt-1">
                You can adjust this before each quick log
              </p>
            </div>
          </div>

          <div className="p-4 border-t border-gray-200 flex gap-2">
            <button
                onClick={onClose}
                className="flex-1 py-2 px-4 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
                onClick={handleAdd}
                className="flex-1 py-2 px-4 bg-blue-900 text-white rounded-lg hover:bg-blue-800"
            >
              Add to Favorites
            </button>
          </div>
        </div>
      </div>
  );
};

export default AddFavoriteModal;