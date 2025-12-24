import { useState, useEffect, useMemo, useRef } from 'react';
import { Search, ChevronDown } from 'lucide-react';
import {
  sortedSymptomCategories,
  BODY_SYSTEMS,
  getBodySystemList,
  getBodySystem,
  stripDCCode,
  searchSymptoms
} from '../data/symptoms';
import { getCustomSymptoms, addChronicSymptom, getChronicSymptoms } from '../utils/storage';

const AddChronicModal = ({ isOpen, onClose, onAdded }) => {
  // Selection state
  const [selectedBodySystem, setSelectedBodySystem] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedSymptom, setSelectedSymptom] = useState('');
  const [defaultSeverity, setDefaultSeverity] = useState(5);

  // Data state
  const [customSymptoms, setCustomSymptoms] = useState([]);
  const [existingChronic, setExistingChronic] = useState([]);
  const [error, setError] = useState('');

  // Search state
  const [isSearchMode, setIsSearchMode] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const searchInputRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      setCustomSymptoms(getCustomSymptoms());
      setExistingChronic(getChronicSymptoms().map(c => c.symptomId));
      setSelectedBodySystem('');
      setSelectedCategory('');
      setSelectedSymptom('');
      setDefaultSeverity(5);
      setError('');
      setIsSearchMode(false);
      setSearchQuery('');
      setSearchResults([]);
    }
  }, [isOpen]);

  // Build combined symptom list with custom symptoms
  const getAllCategories = () => {
    const categories = sortedSymptomCategories.map(cat => ({
      ...cat,
      symptoms: [...cat.symptoms],
      displayName: stripDCCode(cat.name)
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
          displayName: stripDCCode(categoryName),
          symptoms: symptoms,
        });
      }
    });

    return categories;
  };

  const allCategories = useMemo(() => getAllCategories(), [customSymptoms]);

  // Get body systems list for dropdown
  const bodySystemList = useMemo(() => getBodySystemList(), []);

  // Get categories grouped by body system
  const categoriesByBodySystem = useMemo(() => {
    const grouped = {};

    Object.keys(BODY_SYSTEMS).forEach(systemId => {
      grouped[systemId] = [];
    });

    allCategories.forEach(category => {
      const bodySystem = getBodySystem(category.name);
      const categoryWithDisplay = {
        ...category,
        displayName: stripDCCode(category.name)
      };

      if (grouped[bodySystem]) {
        grouped[bodySystem].push(categoryWithDisplay);
      } else {
        grouped['general'].push(categoryWithDisplay);
      }
    });

    Object.keys(grouped).forEach(systemId => {
      grouped[systemId].sort((a, b) => a.displayName.localeCompare(b.displayName));
    });

    return grouped;
  }, [allCategories]);

  // Get categories for selected body system
  const categoriesForSelectedSystem = useMemo(() => {
    if (!selectedBodySystem) return [];
    if (selectedBodySystem === 'all') {
      return allCategories.map(cat => ({
        ...cat,
        displayName: stripDCCode(cat.name)
      })).sort((a, b) => a.displayName.localeCompare(b.displayName));
    }
    return categoriesByBodySystem[selectedBodySystem] || [];
  }, [selectedBodySystem, categoriesByBodySystem, allCategories]);

  // Get symptoms for selected category
  const symptomsForSelectedCategory = useMemo(() => {
    if (!selectedCategory) return [];
    const category = allCategories.find(cat => cat.id === selectedCategory);
    return category ? category.symptoms : [];
  }, [selectedCategory, allCategories]);

  // Handle search
  useEffect(() => {
    if (searchQuery.length >= 2) {
      const customResults = customSymptoms
      .filter(sym => sym.name.toLowerCase().includes(searchQuery.toLowerCase()))
      .map(sym => ({
        ...sym,
        categoryDisplayName: stripDCCode(sym.category),
        bodySystem: getBodySystem(sym.category),
        bodySystemName: BODY_SYSTEMS[getBodySystem(sym.category)]?.name || 'General',
        matchType: 'symptom',
        isCustom: true
      }));

      const standardResults = searchSymptoms(searchQuery, 20);
      setSearchResults([...customResults, ...standardResults].slice(0, 25));
    } else {
      setSearchResults([]);
    }
  }, [searchQuery, customSymptoms]);

  // Handle search result selection
  const handleSearchResultSelect = (result) => {
    const category = allCategories.find(cat =>
        cat.id === result.categoryId || cat.name === result.category
    );

    if (category) {
      const bodySystem = getBodySystem(category.name);
      setSelectedBodySystem(bodySystem);
      setSelectedCategory(category.id);
      setSelectedSymptom(result.id);
      setIsSearchMode(false);
      setSearchQuery('');
      setSearchResults([]);
    }
  };

  // Handle body system change
  const handleBodySystemChange = (systemId) => {
    setSelectedBodySystem(systemId);
    setSelectedCategory('');
    setSelectedSymptom('');
  };

  // Handle category change
  const handleCategoryChange = (categoryId) => {
    setSelectedCategory(categoryId);
    setSelectedSymptom('');
  };

  // Toggle search mode
  const toggleSearchMode = () => {
    setIsSearchMode(!isSearchMode);
    if (!isSearchMode) {
      setSearchQuery('');
      setSearchResults([]);
      setTimeout(() => searchInputRef.current?.focus(), 100);
    } else {
      setSearchQuery('');
      setSearchResults([]);
    }
  };

  const handleAdd = () => {
    if (!selectedSymptom) {
      setError('Please select a symptom');
      return;
    }

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

            {/* Mode Toggle: Browse vs Search */}
            <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
              {isSearchMode ? 'Search for a symptom' : 'Browse by body system'}
            </span>
              <button
                  type="button"
                  onClick={toggleSearchMode}
                  className="flex items-center gap-1 text-sm text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300"
              >
                {isSearchMode ? (
                    <>
                      <ChevronDown className="w-4 h-4" />
                      Browse Categories
                    </>
                ) : (
                    <>
                      <Search className="w-4 h-4" />
                      Search Symptoms
                    </>
                )}
              </button>
            </div>

            {/* Search Mode */}
            {isSearchMode ? (
                <div className="space-y-3">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                        ref={searchInputRef}
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Type to search symptoms..."
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        autoFocus
                    />
                  </div>

                  {/* Search Results */}
                  {searchQuery.length >= 2 && (
                      <div className="max-h-48 overflow-y-auto border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800">
                        {searchResults.length > 0 ? (
                            searchResults.map((result, index) => {
                              const isAlreadyChronic = existingChronic.includes(result.id);
                              return (
                                  <button
                                      key={`${result.id}-${index}`}
                                      type="button"
                                      onClick={() => !isAlreadyChronic && handleSearchResultSelect(result)}
                                      disabled={isAlreadyChronic}
                                      className={`w-full px-4 py-3 text-left border-b border-gray-100 dark:border-gray-700 last:border-b-0 ${
                                          isAlreadyChronic
                                              ? 'opacity-50 cursor-not-allowed bg-gray-50 dark:bg-gray-700/50'
                                              : 'hover:bg-gray-50 dark:hover:bg-gray-700'
                                      }`}
                                  >
                                    <div className="font-medium text-gray-900 dark:text-white">
                                      {result.name}
                                      {result.isCustom && <span className="ml-2 text-xs text-blue-600 dark:text-blue-400">(custom)</span>}
                                      {isAlreadyChronic && <span className="ml-2 text-xs text-orange-600 dark:text-orange-400">(already added)</span>}
                                    </div>
                                    <div className="text-sm text-gray-500 dark:text-gray-400">
                                      {result.bodySystemName} → {result.categoryDisplayName}
                                    </div>
                                  </button>
                              );
                            })
                        ) : (
                            <div className="px-4 py-3 text-gray-500 dark:text-gray-400 text-center">
                              No symptoms found matching "{searchQuery}"
                            </div>
                        )}
                      </div>
                  )}

                  {searchQuery.length > 0 && searchQuery.length < 2 && (
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Type at least 2 characters to search...
                      </p>
                  )}
                </div>
            ) : (
                /* Browse Mode - 3-Level Dropdowns */
                <div className="space-y-4">
                  {/* Step 1: Body System Selection */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      1. Select Body System
                    </label>
                    <select
                        value={selectedBodySystem}
                        onChange={(e) => handleBodySystemChange(e.target.value)}
                        className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">Select a body system...</option>
                      <option value="all">── All Systems ──</option>
                      {bodySystemList.map(system => (
                          <option key={system.id} value={system.id}>
                            {system.name} ({categoriesByBodySystem[system.id]?.length || 0})
                          </option>
                      ))}
                    </select>
                  </div>

                  {/* Step 2: Category Selection */}
                  {selectedBodySystem && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          2. Select Category
                        </label>
                        <select
                            value={selectedCategory}
                            onChange={(e) => handleCategoryChange(e.target.value)}
                            className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                        >
                          <option value="">Select a category...</option>
                          {categoriesForSelectedSystem.map(category => (
                              <option key={category.id} value={category.id}>
                                {category.displayName} ({category.symptoms.length})
                              </option>
                          ))}
                        </select>
                      </div>
                  )}

                  {/* Step 3: Symptom Selection */}
                  {selectedCategory && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          3. Select Symptom
                        </label>
                        <select
                            value={selectedSymptom}
                            onChange={(e) => setSelectedSymptom(e.target.value)}
                            className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                        >
                          <option value="">Select a symptom...</option>
                          {symptomsForSelectedCategory.map(symptom => {
                            const isAlreadyChronic = existingChronic.includes(symptom.id);
                            return (
                                <option
                                    key={symptom.id}
                                    value={symptom.id}
                                    disabled={isAlreadyChronic}
                                >
                                  {symptom.name} {symptom.isCustom ? '(custom)' : ''} {isAlreadyChronic ? '(already added)' : ''}
                                </option>
                            );
                          })}
                        </select>
                      </div>
                  )}
                </div>
            )}

            {/* Selected Symptom Preview */}
            {selectedSymptom && (
                <div className="p-3 bg-green-50 dark:bg-green-900/30 rounded-lg border border-green-200 dark:border-green-800">
                  <p className="text-sm text-green-800 dark:text-green-300">
                    ✓ Selected: <strong>{symptomsForSelectedCategory.find(s => s.id === selectedSymptom)?.name || selectedSymptom}</strong>
                  </p>
                </div>
            )}

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
                disabled={!selectedSymptom}
                className={`flex-1 py-2 px-4 rounded-lg ${
                    selectedSymptom
                        ? 'bg-blue-900 dark:bg-blue-600 text-white hover:bg-blue-800 dark:hover:bg-blue-700'
                        : 'bg-gray-300 dark:bg-gray-600 text-gray-500 dark:text-gray-400 cursor-not-allowed'
                }`}
            >
              Add to Quick Log
            </button>
          </div>
        </div>
      </div>
  );
};

export default AddChronicModal;