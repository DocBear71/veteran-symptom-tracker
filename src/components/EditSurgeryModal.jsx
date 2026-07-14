import { useState } from 'react';
import { updateSurgery } from '../utils/storage';
import SurgeryForm from './SurgeryForm';

/**
 * EditSurgeryModal
 *
 * Wraps SurgeryForm in a modal overlay for editing an existing surgery record.
 * Passes the existing surgery as initialData so SurgeryForm pre-populates all fields.
 *
 * On save, intercepts the SurgeryForm's onSaved callback, calls updateSurgery
 * with the edited data, then notifies the parent via onSaved.
 *
 * Props:
 *   surgery  — the surgery record object to edit (or null when closed)
 *   isOpen   — boolean controlling visibility
 *   onClose  — called when user dismisses without saving
 *   onSaved  — called after a successful update
 */
const EditSurgeryModal = ({ surgery, isOpen, onClose, onSaved }) => {
  const [saveError, setSaveError] = useState(null);

  // Nothing to render when closed or no surgery provided
  if (!isOpen || !surgery) return null;

  /**
   * SurgeryForm calls onSaved with no arguments (it just signals completion).
   * We need the updated form data, so we intercept by wrapping saveSurgery
   * via a custom submit handler injected through SurgeryForm's initialData +
   * the overrideSave prop.
   *
   * Strategy: pass overrideSave so SurgeryForm skips its own saveSurgery call
   * and hands the processed payload back to us instead. We then call
   * updateSurgery here and close the modal.
   */
  const handleOverrideSave = (processedPayload) => {
    setSaveError(null);

    const result = updateSurgery(surgery.id, processedPayload);

    if (result) {
      onSaved?.();
    } else {
      setSaveError('Failed to update surgery record. Please try again.');
    }
  };

  return (
      /* ── Backdrop ── */
      <div
          className="fixed inset-0 bg-black/50 z-50 flex items-end sm:items-center
                 justify-center p-0 sm:p-4"
          onClick={onClose}
          role="dialog"
          aria-modal="true"
          aria-label="Edit surgery record"
      >
        {/* ── Modal panel — stop clicks propagating to backdrop ── */}
        <div
            className="w-full sm:max-w-lg bg-white dark:bg-gray-800 rounded-t-2xl
                   sm:rounded-2xl shadow-xl max-h-[92vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
        >
          {/* ── Header bar ── */}
          <div className="flex items-center justify-between px-4 pt-4 pb-2
                        border-b border-gray-100 dark:border-gray-700 sticky top-0
                        bg-white dark:bg-gray-800 z-10">
            <h2 className="text-base font-bold text-gray-900 dark:text-white">
              Edit Surgery Record
            </h2>
            <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200
                       text-2xl leading-none p-1"
                aria-label="Close"
            >
              &times;
            </button>
          </div>

          {/* ── Error banner (update-level errors) ── */}
          {saveError && (
              <div className="mx-4 mt-3 p-3 bg-red-50 dark:bg-red-900/30 border
                          border-red-200 dark:border-red-700 rounded-lg">
                <p className="text-red-700 dark:text-red-400 text-sm">{saveError}</p>
              </div>
          )}

          {/* ── Form — rendered inside the modal scroll area ── */}
          <div className="p-4">
            {/*
           * We pass overrideSave so SurgeryForm skips its own saveSurgery call.
           * initialData pre-populates all fields from the existing record.
           * onCancel closes the modal without saving.
           */}
            <SurgeryForm
                initialData={surgery}
                overrideSave={handleOverrideSave}
                onCancel={onClose}
            />
          </div>
        </div>
      </div>
  );
};

export default EditSurgeryModal;