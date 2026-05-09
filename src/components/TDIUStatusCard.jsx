import React, { useState } from 'react';
import { useProfile } from '../hooks/useProfile';
import { getTDIUStatus, clearTDIUStatus } from '../utils/profiles';
import { formatDateOnly } from '../utils/datetime';
import TDIUStatusModal from './TDIUStatusModal';

/**
 * TDIUStatusCard
 * Displays the user's TDIU status (or an "Add TDIU" prompt if not set).
 * Lives in ServiceConnectedConditions, below the Combined VA Rating card.
 *
 * TDIU is profile-level metadata — it is not tied to any individual condition.
 * Per 38 CFR §4.16, TDIU is granted based on the combined effect of all
 * service-connected disabilities preventing substantially gainful employment.
 * It is a status of the veteran, not of any single condition.
 */
const TDIUStatusCard = () => {
  const { profile, refreshProfile } = useProfile();
  const [showModal, setShowModal] = useState(false);

  // Only render for veteran profiles
  if (!profile || !profile.id || profile.type !== 'veteran') {
    return null;
  }

  const tdiuStatus = getTDIUStatus(profile.id);

  const handleRemove = () => {
    if (window.confirm(
        'Remove TDIU status from your profile? This does not affect your VA rating — it only removes the record from this app.'
    )) {
      const result = clearTDIUStatus(profile.id);
      if (result.success) {
        refreshProfile();
      } else {
        alert(result.message || 'Failed to remove TDIU status');
      }
    }
  };

  const handleModalClose = () => {
    setShowModal(false);
    refreshProfile();
  };

  // Format effective date for display (MM/DD/YYYY) using the shared
  // date-only formatter that avoids timezone drift.
  const formatDate = (isoDate) => {
    if (!isoDate) return 'Not specified';
    return formatDateOnly(isoDate) || 'Not specified';
  };

  // ============================================
  // STATE 1: TDIU NOT GRANTED — show "Add TDIU" prompt
  // ============================================
  if (!tdiuStatus) {
    return (
        <>
          <div className="bg-gray-50 dark:bg-gray-800 rounded-lg border-2 border-dashed border-gray-300 dark:border-gray-600 p-6 mb-6">
            <div className="flex items-start gap-4">
              <span className="text-3xl">🎯</span>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
                  TDIU Status
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                  If you have been granted Total Disability based on Individual
                  Unemployability (TDIU), record it here. TDIU is a profile-level
                  status that is documented separately from your individual
                  condition ratings.
                </p>
                <button
                    onClick={() => setShowModal(true)}
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors text-sm"
                >
                  + Add TDIU Status
                </button>
              </div>
            </div>
          </div>

          {showModal && (
              <TDIUStatusModal
                  initialStatus={null}
                  onClose={handleModalClose}
              />
          )}
        </>
    );
  }

  // ============================================
  // STATE 2: TDIU GRANTED — show status details
  // ============================================
  return (
      <>
        <div className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-lg border-2 border-green-200 dark:border-green-700 p-6 mb-6">
          <div className="flex items-start justify-between gap-4 mb-3">
            <div className="flex items-center gap-3">
              <span className="text-3xl">✓</span>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  TDIU — Total Disability based on Individual Unemployability
                </h3>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Granted under 38 CFR §4.16
                </p>
              </div>
            </div>
          </div>

          {/* Status details grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
            <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-3">
              <p className="text-xs text-gray-500 dark:text-gray-400 font-medium mb-1">
                Effective Date
              </p>
              <p className="text-sm font-semibold text-gray-900 dark:text-white">
                {formatDate(tdiuStatus.effectiveDate)}
              </p>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-3">
              <p className="text-xs text-gray-500 dark:text-gray-400 font-medium mb-1">
                Type
              </p>
              <p className="text-sm font-semibold text-gray-900 dark:text-white">
                {tdiuStatus.type === 'schedular'
                    ? 'Schedular (§4.16(a))'
                    : 'Extra-Schedular (§4.16(b))'}
              </p>
            </div>
          </div>

          {/* P&T badge */}
          <div className="mb-3">
            {tdiuStatus.permanentAndTotal ? (
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-blue-100 dark:bg-blue-900/40 border border-blue-200 dark:border-blue-700">
                  <span>🛡️</span>
                  <span className="text-sm font-medium text-blue-900 dark:text-blue-200">
                Permanent & Total (P&T)
              </span>
                </div>
            ) : (
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-gray-100 dark:bg-gray-700 border border-gray-200 dark:border-gray-600">
              <span className="text-sm text-gray-700 dark:text-gray-300">
                Not marked as Permanent & Total
              </span>
                </div>
            )}
          </div>

          {/* Practical effect notice */}
          <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-3 mb-3">
            <p className="text-xs text-gray-600 dark:text-gray-400 font-medium mb-1">
              💡 What this means for you:
            </p>
            <p className="text-sm text-gray-900 dark:text-white">
              Paid at the 100% rate. Your schedular combined rating remains shown
              above for documentation and re-evaluation purposes.
              {tdiuStatus.permanentAndTotal && (
                  <> P&T status provides additional protections under 38 CFR §3.951
                    and may unlock benefits like Chapter 35 DEA for dependents.</>
              )}
            </p>
          </div>

          {/* Notes */}
          {tdiuStatus.notes && (
              <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-3 mb-3">
                <p className="text-xs text-gray-600 dark:text-gray-400 font-medium mb-1">
                  Notes:
                </p>
                <p className="text-sm text-gray-900 dark:text-white whitespace-pre-wrap">
                  {tdiuStatus.notes}
                </p>
              </div>
          )}

          {/* Action buttons */}
          <div className="flex gap-2">
            <button
                onClick={() => setShowModal(true)}
                className="flex-1 sm:flex-none px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg font-semibold transition-colors text-sm"
            >
              Edit
            </button>
            <button
                onClick={handleRemove}
                className="flex-1 sm:flex-none px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-semibold transition-colors text-sm"
            >
              Remove TDIU
            </button>
          </div>
        </div>

        {showModal && (
            <TDIUStatusModal
                initialStatus={tdiuStatus}
                onClose={handleModalClose}
            />
        )}
      </>
  );
};

export default TDIUStatusCard;