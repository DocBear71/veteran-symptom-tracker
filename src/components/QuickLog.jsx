import { useState, useEffect } from 'react';
import { getFavorites, removeFavorite, saveSymptomLog } from '../utils/storage';

const QuickLog = ({ onLogSaved, onAddFavorite }) => {
  const [favorites, setFavorites] = useState([]);
  const [quickSeverity, setQuickSeverity] = useState({});
  const [showSuccess, setShowSuccess] = useState('');
  const [editMode, setEditMode] = useState(false);

  useEffect(() => {
    loadFavorites();
  }, []);

  const loadFavorites = () => {
    const favs = getFavorites();
    setFavorites(favs);
    // Initialize severity state for each favorite
    const severities = {};
    favs.forEach(f => {
      severities[f.symptomId] = f.defaultSeverity || 5;
    });
    setQuickSeverity(severities);
  };

  const handleQuickLog = (favorite) => {
    const entry = {
      symptomId: favorite.symptomId,
      symptomName: favorite.symptomName,
      category: favorite.category,
      severity: quickSeverity[favorite.symptomId] || 5,
      notes: '',
    };

    saveSymptomLog(entry);

    // Show success
    setShowSuccess(favorite.symptomId);
    setTimeout(() => setShowSuccess(''), 1500);

    if (onLogSaved) onLogSaved();
  };

  const handleRemoveFavorite = (symptomId) => {
    removeFavorite(symptomId);
    loadFavorites();
  };

  const handleSeverityChange = (symptomId, value) => {
    setQuickSeverity(prev => ({
      ...prev,
      [symptomId]: value,
    }));
  };

  const getSeverityColor = (severity) => {
    if (severity <= 2) return 'bg-green-500';
    if (severity <= 4) return 'bg-yellow-500';
    if (severity <= 6) return 'bg-orange-500';
    if (severity <= 8) return 'bg-red-500';
    return 'bg-red-700';
  };

  if (favorites.length === 0) {
    return (
        <div className="bg-gray-50 rounded-lg p-4 mb-6">
          <h3 className="font-medium text-gray-700 mb-2">Quick Log</h3>
          <p className="text-sm text-gray-500 mb-3">
            Add favorite symptoms for one-tap logging
          </p>
          <button
              onClick={onAddFavorite}
              className="w-full py-2 px-4 border-2 border-dashed border-gray-300 text-gray-600 rounded-lg hover:border-blue-400 hover:text-blue-600 transition-colors"
          >
            + Add Your First Favorite
          </button>
        </div>
    );
  }

  return (
      <div className="bg-gray-50 rounded-lg p-4 mb-6">
        <div className="flex justify-between items-center mb-3">
          <h3 className="font-medium text-gray-700">Quick Log</h3>
          <button
              onClick={() => setEditMode(!editMode)}
              className="text-sm text-blue-600 hover:text-blue-800"
          >
            {editMode ? 'Done' : 'Edit'}
          </button>
        </div>

        <div className="grid grid-cols-2 gap-2">
          {favorites.map((favorite) => (
              <div key={favorite.symptomId} className="relative">
                {/* Success overlay */}
                {showSuccess === favorite.symptomId && (
                    <div className="absolute inset-0 bg-green-500 rounded-lg flex items-center justify-center z-10">
                      <span className="text-white font-medium">✓ Logged!</span>
                    </div>
                )}

                <div
                    className={`bg-white rounded-lg border border-gray-200 p-3 ${
                        editMode ? '' : 'hover:border-blue-400 hover:shadow-sm cursor-pointer'
                    } transition-all`}
                    onClick={() => !editMode && handleQuickLog(favorite)}
                >
                  {/* Remove button in edit mode */}
                  {editMode && (
                      <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleRemoveFavorite(favorite.symptomId);
                          }}
                          className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full text-sm hover:bg-red-600 z-10"
                      >
                        ✕
                      </button>
                  )}

                  <p className="font-medium text-gray-900 text-sm truncate">
                    {favorite.symptomName}
                  </p>
                  <p className="text-xs text-gray-500 mb-2">{favorite.category}</p>

                  {/* Severity indicator/adjuster */}
                  <div className="flex items-center gap-2">
                    <div
                        className={`w-8 h-8 rounded-full ${getSeverityColor(
                            quickSeverity[favorite.symptomId]
                        )} flex items-center justify-center text-white font-bold text-sm`}
                    >
                      {quickSeverity[favorite.symptomId]}
                    </div>

                    {editMode ? (
                        <input
                            type="range"
                            min="0"
                            max="10"
                            value={quickSeverity[favorite.symptomId]}
                            onChange={(e) =>
                                handleSeverityChange(favorite.symptomId, Number(e.target.value))
                            }
                            onClick={(e) => e.stopPropagation()}
                            className="flex-1 h-2"
                        />
                    ) : (
                        <span className="text-xs text-gray-500">Tap to log</span>
                    )}
                  </div>
                </div>
              </div>
          ))}

          {/* Add more button */}
          {favorites.length < 8 && (
              <button
                  onClick={onAddFavorite}
                  className="bg-white rounded-lg border-2 border-dashed border-gray-300 p-3 text-gray-400 hover:border-blue-400 hover:text-blue-600 transition-colors flex items-center justify-center min-h-[88px]"
              >
                <span className="text-2xl">+</span>
              </button>
          )}
        </div>

        {editMode && (
            <p className="text-xs text-gray-500 mt-3">
              Adjust default severity for each favorite. Changes save automatically.
            </p>
        )}
      </div>
  );
};

export default QuickLog;