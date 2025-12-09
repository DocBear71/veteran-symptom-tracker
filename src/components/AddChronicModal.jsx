import { useState, useEffect } from 'react';
import { sortedSymptomCategories } from '../data/symptoms';
import { getCustomSymptoms, addChronicSymptom, getChronicSymptoms } from '../utils/storage';

const AddChronicModal = ({ isOpen, onClose, onAdded }) => {
    const [selectedSymptom, setSelectedSymptom] = useState('');
    const [defaultSeverity, setDefaultSeverity] = useState(5);
    const [customSymptoms, setCustomSymptoms] = useState([]);
    const [existingChronic, setExistingChronic] = useState([]);
    const [error, setError] = useState('');

    useEffect(() => {
        if (isOpen) {
            setCustomSymptoms(getCustomSymptoms());
            setExistingChronic(getChronicSymptoms().map(c => c.symptomId));
            setSelectedSymptom('');
            setDefaultSeverity(5);
            setError('');
        }
    }, [isOpen]);

    // Build combined symptom list
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

        const result = addChronicSymptom({
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
            <div className="bg-white dark:bg-gray-800 rounded-lg w-full max-w-md max-h-[90vh] overflow-y-auto">
                <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                    <div className="flex justify-between items-center">
                        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Add Chronic Symptom</h2>
                        <button
                            onClick={onClose}
                            className="text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 text-xl"
                        >
                            ✕
                        </button>
                    </div>
                </div>

                <div className="p-4 space-y-4">
                    {error && (
                        <div className="p-3 bg-red-100 dark:bg-red-900/50 text-red-700 dark:text-red-300 rounded-lg text-sm">
                            {error}
                        </div>
                    )}

                    {/* Info Box */}
                    <div className="p-3 bg-blue-50 dark:bg-blue-900/30 rounded-lg">
                        <p className="text-sm text-blue-800 dark:text-blue-300">
                            💡 Add symptoms you track regularly for one-tap logging from the home screen.
                        </p>
                    </div>

                    {/* Symptom Selection */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Select Symptom
                        </label>
                        <select
                            value={selectedSymptom}
                            onChange={(e) => setSelectedSymptom(e.target.value)}
                            className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                        >
                            <option value="">Choose a symptom...</option>
                            {allCategories.map(category => (
                                <optgroup key={category.id} label={category.name}>
                                    {category.symptoms.map(symptom => {
                                        const isAlreadyChronic = existingChronic.includes(symptom.id);
                                        return (
                                            <option
                                                key={symptom.id}
                                                value={symptom.id}
                                                disabled={isAlreadyChronic}
                                            >
                                                {symptom.name} {isAlreadyChronic ? '(already added)' : ''}
                                            </option>
                                        );
                                    })}
                                </optgroup>
                            ))}
                        </select>
                    </div>

                    {/* Default Severity */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Default Severity (for quick logging)
                        </label>
                        <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                            <input
                                type="range"
                                min="0"
                                max="10"
                                value={defaultSeverity}
                                onChange={(e) => setDefaultSeverity(Number(e.target.value))}
                                className="w-full"
                            />
                            <div className="flex justify-between mt-1">
                                <span className="text-xs text-gray-500 dark:text-gray-400">0</span>
                                <span className="text-lg font-bold text-blue-900 dark:text-blue-400">{defaultSeverity}</span>
                                <span className="text-xs text-gray-500 dark:text-gray-400">10</span>
                            </div>
                        </div>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                            You can adjust this before each quick log
                        </p>
                    </div>
                </div>

                <div className="p-4 border-t border-gray-200 dark:border-gray-700 flex gap-2">
                    <button
                        onClick={onClose}
                        className="flex-1 py-2 px-4 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleAdd}
                        className="flex-1 py-2 px-4 bg-blue-900 dark:bg-blue-600 text-white rounded-lg hover:bg-blue-800 dark:hover:bg-blue-700"
                    >
                        Add to Quick Log
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AddChronicModal;