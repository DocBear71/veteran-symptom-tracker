import React, { useState } from 'react';
import { useProfile } from '../hooks/useProfile';
import { setTDIUStatus } from '../utils/profiles';

/**
 * TDIUStatusModal
 * Modal for adding or editing TDIU status.
 * Mirrors the AddServiceConnectedModal pattern for consistency.
 *
 * Required field: effectiveDate
 * All other fields have sensible defaults.
 */
const TDIUStatusModal = ({ initialStatus, onClose }) => {
  const { profile } = useProfile();
  const isEditing = !!initialStatus;

  // Form state — pre-populated from initialStatus if editing
  const [effectiveDate, setEffectiveDate] = useState(
      initialStatus?.effectiveDate || ''
  );
  const [type, setType] = useState(initialStatus?.type || 'schedular');
  const [permanentAndTotal, setPermanentAndTotal] = useState(
      initialStatus?.permanentAndTotal === true
  );
  const [notes, setNotes] = useState(initialStatus?.notes || '');

  const handleSave = () => {
    if (!effectiveDate) {
      alert('Please enter the effective date from your VA decision letter.');
      return;
    }

    if (!profile || !profile.id) {
      alert('No active profile.');
      return;
    }

    const result = setTDIUStatus(profile.id, {
      effectiveDate,
      type,
      permanentAndTotal,
      notes: notes.trim(),
    });

    if (result.success) {
      onClose();
    } else {
      alert(result.message || 'Failed to save TDIU status');
    }
  };

  return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white dark:bg-gray-800 rounded-lg w-full max-w-md max-h-[90vh] overflow-y-auto">
          {/* Header */}
          <div className="p-4 border-b border-gray-200 dark:border-gray-700 sticky top-0 bg-white dark:bg-gray-800">
            <div className="flex justify-between items-start">
              <div>
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                  {isEditing ? 'Edit TDIU Status' : 'Add TDIU Status'}
                </h2>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Total Disability based on Individual Unemployability
                </p>
              </div>
              <button
                  onClick={onClose}
                  className="text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 text-xl"
              >
                ✕
              </button>
            </div>
          </div>

          <div className="p-4 space-y-4">
            {/* Educational note */}
            <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-3">
              <p className="text-xs text-blue-900 dark:text-blue-200">
                ℹ️ Refer to your VA decision letter for the information below.
                If you don't have a copy, you can request one at VA.gov or by
                calling 1-800-827-1000.
              </p>
            </div>

            {/* Effective Date */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Effective Date <span className="text-red-500">*</span>
              </label>
              <input
                  type="date"
                  value={effectiveDate}
                  onChange={(e) => setEffectiveDate(e.target.value)}
                  className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                Date TDIU was granted, per your VA decision letter.
              </p>
            </div>

            {/* Type */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Type
              </label>
              <div className="space-y-2">
                <label
                    className={`flex items-start gap-3 p-3 rounded-lg border-2 cursor-pointer transition-all ${
                        type === 'schedular'
                            ? 'bg-blue-100 dark:bg-blue-900/30 border-blue-400 dark:border-blue-600'
                            : 'bg-white dark:bg-gray-700 border-gray-200 dark:border-gray-600 hover:border-blue-300 dark:hover:border-blue-700'
                    }`}
                >
                  <input
                      type="radio"
                      name="tdiu-type"
                      value="schedular"
                      checked={type === 'schedular'}
                      onChange={(e) => setType(e.target.value)}
                      className="mt-1 w-4 h-4 text-blue-600"
                  />
                  <div className="flex-1">
                  <span className="font-medium text-gray-900 dark:text-gray-100">
                    Schedular (38 CFR §4.16(a))
                  </span>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                      Granted because your ratings meet the schedular thresholds:
                      one rating ≥60%, OR combined ≥70% with at least one ≥40%.
                    </p>
                  </div>
                </label>

                <label
                    className={`flex items-start gap-3 p-3 rounded-lg border-2 cursor-pointer transition-all ${
                        type === 'extra-schedular'
                            ? 'bg-blue-100 dark:bg-blue-900/30 border-blue-400 dark:border-blue-600'
                            : 'bg-white dark:bg-gray-700 border-gray-200 dark:border-gray-600 hover:border-blue-300 dark:hover:border-blue-700'
                    }`}
                >
                  <input
                      type="radio"
                      name="tdiu-type"
                      value="extra-schedular"
                      checked={type === 'extra-schedular'}
                      onChange={(e) => setType(e.target.value)}
                      className="mt-1 w-4 h-4 text-blue-600"
                  />
                  <div className="flex-1">
                  <span className="font-medium text-gray-900 dark:text-gray-100">
                    Extra-Schedular (38 CFR §4.16(b))
                  </span>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                      Granted by the Director of Compensation Service even though
                      schedular thresholds were not met.
                    </p>
                  </div>
                </label>
              </div>
            </div>

            {/* Permanent & Total */}
            <div>
              <label
                  className={`flex items-start gap-3 p-3 rounded-lg border-2 cursor-pointer transition-all ${
                      permanentAndTotal
                          ? 'bg-blue-100 dark:bg-blue-900/30 border-blue-400 dark:border-blue-600'
                          : 'bg-white dark:bg-gray-700 border-gray-200 dark:border-gray-600 hover:border-blue-300 dark:hover:border-blue-700'
                  }`}
              >
                <input
                    type="checkbox"
                    checked={permanentAndTotal}
                    onChange={(e) => setPermanentAndTotal(e.target.checked)}
                    className="mt-1 w-5 h-5 text-blue-600 rounded"
                />
                <div className="flex-1">
                <span className="font-medium text-gray-900 dark:text-gray-100">
                  🛡️ Permanent & Total (P&T)
                </span>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    Check this box if your VA decision letter indicates your TDIU
                    is permanent and total. Common signals include:
                  </p>
                  <ul className="text-xs text-gray-500 dark:text-gray-400 mt-1 ml-3 space-y-0.5">
                    <li>• "Permanent and total disability status" mentioned</li>
                    <li>• Chapter 35 DEA (Dependents' Educational Assistance) granted</li>
                    <li>• "Future exam not scheduled" language</li>
                  </ul>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 italic">
                    P&T provides additional reduction protections and unlocks
                    several downstream benefits.
                  </p>
                </div>
              </label>
            </div>

            {/* Notes */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Notes (optional)
              </label>
              <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="e.g., conditions cited in §4.16 paragraph, relevant context..."
                  rows={3}
                  className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Footer */}
          <div className="p-4 border-t border-gray-200 dark:border-gray-700 flex gap-2 sticky bottom-0 bg-white dark:bg-gray-800">
            <button
                onClick={onClose}
                className="flex-1 py-2 px-4 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700"
            >
              Cancel
            </button>
            <button
                onClick={handleSave}
                className="flex-1 py-3 px-4 bg-blue-900 dark:bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-800 dark:hover:bg-blue-700"
            >
              {isEditing ? 'Save Changes' : 'Add TDIU Status'}
            </button>
          </div>
        </div>
      </div>
  );
};

export default TDIUStatusModal;