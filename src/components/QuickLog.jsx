import { useState, useEffect } from 'react';
import { getFavorites, removeFavorite, saveSymptomLog } from '../utils/storage';

const QuickLog = ({ onLogSaved, onAddFavorite }) => {
  const [favorites, setFavorites] = useState([]);
  const [showSuccess, setShowSuccess] = useState('');
  const [editMode, setEditMode] = useState(false);

  // Modal state
  const [selectedFavorite, setSelectedFavorite] = useState(null);
  const [logSeverity, setLogSeverity] = useState(5);
  const [logNotes, setLogNotes] = useState('');

  useEffect(() => {
    loadFavorites();
  }, []);

  const loadFavorites = () => {
    const favs = getFavorites();
    setFavorites(favs);
  };

  const handleOpenLogModal = (favorite) => {
    if (editMode) return;
    setSelectedFavorite(favorite);
    setLogSeverity(favorite.defaultSeverity || 5);
    setLogNotes('');
  };

  const handleCloseModal = () => {
    setSelectedFavorite(null);
    setLogSeverity(5);
    setLogNotes('');
  };

  const handleConfirmLog = () => {
    if (!selectedFavorite) return;

    const entry = {
      symptomId: selectedFavorite.symptomId,
      symptomName: selectedFavorite.symptomName,
      category: selectedFavorite.category,
      severity: logSeverity,
      notes: logNotes.trim(),
    };

    saveSymptomLog(entry);

    // Show success
    setShowSuccess(selectedFavorite.symptomId);
    setTimeout(() => setShowSuccess(''), 1500);

    handleCloseModal();
    if (onLogSaved) onLogSaved();
  };

  const handleRemoveFavorite = (symptomId) => {
    removeFavorite(symptomId);
    loadFavorites();
  };

  const getSeverityColor = (severity) => {
    if (severity <= 2) return 'bg-green-500';
    if (severity <= 4) return 'bg-yellow-500';
    if (severity <= 6) return 'bg-orange-500';
    if (severity <= 8) return 'bg-red-500';
    return 'bg-red-700';
  };

  const getSeverityInfo = (value) => {
    if (value <= 2) return { label: 'Minimal', color: 'text-green-600' };
    if (value <= 4) return { label: 'Mild', color: 'text-yellow-600' };
    if (value <= 6) return { label: 'Moderate', color: 'text-orange-500' };
    if (value <= 8) return { label: 'Severe', color: 'text-red-500' };
    return { label: 'Extreme', color: 'text-red-700' };
  };

  if (favorites.length === 0) {
    return (
        <div className="bg-gray-50 rounded-lg p-4 mb-6">
          <h3 className="font-medium text-gray-700 mb-2">Quick Log</h3>
          <p className="text-sm text-gray-500 mb-3">
            Add favorite symptoms for faster logging
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

  const severityInfo = getSeverityInfo(logSeverity);

  return (
      <>
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
                      onClick={() => handleOpenLogModal(favorite)}
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

                    <div className="flex items-center gap-2">
                      <div
                          className={`w-8 h-8 rounded-full ${getSeverityColor(
                              favorite.defaultSeverity || 5
                          )} flex items-center justify-center text-white font-bold text-sm`}
                      >
                        {favorite.defaultSeverity || 5}
                      </div>
                      <span className="text-xs text-gray-500">Tap to log</span>
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
        </div>

        {/* Quick Log Modal */}
        {selectedFavorite && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
              <div className="bg-white rounded-lg w-full max-w-md">
                <div className="p-4 border-b border-gray-200">
                  <div className="flex justify-between items-center">
                    <div>
                      <h2 className="text-lg font-semibold text-gray-900">
                        {selectedFavorite.symptomName}
                      </h2>
                      <p className="text-sm text-gray-500">{selectedFavorite.category}</p>
                    </div>
                    <button
                        onClick={handleCloseModal}
                        className="text-gray-400 hover:text-gray-600 text-xl"
                    >
                      ✕
                    </button>
                  </div>
                </div>

                <div className="p-4 space-y-4">
                  {/* Severity Slider */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Severity Level
                    </label>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <input
                          type="range"
                          min="0"
                          max="10"
                          value={logSeverity}
                          onChange={(e) => setLogSeverity(Number(e.target.value))}
                          className="w-full"
                      />
                      <div className="flex justify-between mt-2">
                        <span className="text-xs text-gray-500">0</span>
                        <span className={`text-lg font-bold ${severityInfo.color}`}>
                      {logSeverity} - {severityInfo.label}
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
                        value={logNotes}
                        onChange={(e) => setLogNotes(e.target.value)}
                        placeholder="What were you doing? Any triggers?"
                        rows={3}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                </div>

                <div className="p-4 border-t border-gray-200 flex gap-2">
                  <button
                      onClick={handleCloseModal}
                      className="flex-1 py-2 px-4 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                      onClick={handleConfirmLog}
                      className="flex-1 py-3 px-4 bg-blue-900 text-white font-semibold rounded-lg hover:bg-blue-800"
                  >
                    Log Symptom
                  </button>
                </div>
              </div>
            </div>
        )}
      </>
  );
};

export default QuickLog;