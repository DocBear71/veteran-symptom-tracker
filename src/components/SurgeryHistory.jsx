import { useState, useEffect } from 'react';
import { getSurgeries, deleteSurgery } from '../utils/storage';
import EditSurgeryModal from './EditSurgeryModal';

// ── Display labels for procedure types ─────────────────────────────────────
const PROCEDURE_TYPE_LABELS = {
  orthopedic:       'Orthopedic',
  cardiovascular:   'Cardiovascular',
  neurological:     'Neurological',
  gastrointestinal: 'Gastrointestinal',
  urological:       'Urological',
  pulmonary:        'Pulmonary / Thoracic',
  ophthalmic:       'Ophthalmic',
  dental_oral:      'Dental / Oral',
  skin_tissue:      'Skin / Soft Tissue',
  emergency:        'Emergency / Trauma',
  other:            'Other',
};

// ── Color coding by procedure type ─────────────────────────────────────────
const TYPE_COLORS = {
  orthopedic:       'bg-blue-100 dark:bg-blue-900/50 text-blue-800 dark:text-blue-300',
  cardiovascular:   'bg-red-100 dark:bg-red-900/50 text-red-800 dark:text-red-300',
  neurological:     'bg-purple-100 dark:bg-purple-900/50 text-purple-800 dark:text-purple-300',
  gastrointestinal: 'bg-yellow-100 dark:bg-yellow-900/50 text-yellow-800 dark:text-yellow-300',
  urological:       'bg-cyan-100 dark:bg-cyan-900/50 text-cyan-800 dark:text-cyan-300',
  pulmonary:        'bg-sky-100 dark:bg-sky-900/50 text-sky-800 dark:text-sky-300',
  ophthalmic:       'bg-teal-100 dark:bg-teal-900/50 text-teal-800 dark:text-teal-300',
  dental_oral:      'bg-lime-100 dark:bg-lime-900/50 text-lime-800 dark:text-lime-300',
  skin_tissue:      'bg-orange-100 dark:bg-orange-900/50 text-orange-800 dark:text-orange-300',
  emergency:        'bg-rose-100 dark:bg-rose-900/50 text-rose-800 dark:text-rose-300',
  other:            'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-300',
};

// ── Date formatter (prevents UTC timezone shift) ───────────────────────────
const formatDate = (dateString) => {
  if (!dateString) return '';
  const date = new Date(dateString + 'T00:00:00');
  return date.toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
};

// ── Component ───────────────────────────────────────────────────────────────
const SurgeryHistory = () => {
  const [surgeries, setSurgeries]           = useState([]);
  const [expandedId, setExpandedId]         = useState(null);
  const [editingSurgery, setEditingSurgery] = useState(null);

  const loadSurgeries = () => {
    setSurgeries(getSurgeries());
  };

  useEffect(() => {
    loadSurgeries();
  }, []);

  // ── Delete with confirmation ────────────────────────────────────────────
  const handleDelete = (surgery) => {
    if (window.confirm(`Delete record for "${surgery.procedureName}"? This cannot be undone.`)) {
      deleteSurgery(surgery.id);
      loadSurgeries();
    }
  };

  // ── Toggle expand/collapse for a row ───────────────────────────────────
  const toggleExpand = (id) => {
    setExpandedId(prev => (prev === id ? null : id));
  };

  // ── Empty state ─────────────────────────────────────────────────────────
  if (surgeries.length === 0) {
    return (
        <div className="text-center py-12 text-gray-500 dark:text-gray-400">
          <div className="text-4xl mb-3">🏥</div>
          <p className="font-medium">No surgery records yet</p>
          <p className="text-sm mt-1">
            Tap <strong>Add New</strong> to record a surgery. Surgical history is
            valuable evidence for VA claims and C&amp;P exams.
          </p>
        </div>
    );
  }

  // ── List ────────────────────────────────────────────────────────────────
  return (
      <>
        <div className="space-y-3">
          {surgeries.map((surgery) => {
            const isExpanded  = expandedId === surgery.id;
            const typeLabel   = PROCEDURE_TYPE_LABELS[surgery.procedureType] || surgery.procedureType || 'Other';
            const typeColor   = TYPE_COLORS[surgery.procedureType] || TYPE_COLORS.other;

            // Flatten relatedConditions array to a readable string for display
            const relatedDisplay = surgery.relatedConditions?.length
                ? surgery.relatedConditions.map(c => c.label).join(', ')
                : null;

            return (
                <div
                    key={surgery.id}
                    className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border
                         border-gray-100 dark:border-gray-700 overflow-hidden"
                >
                  {/* ── Summary row (always visible) ── */}
                  <div
                      className="flex items-start justify-between p-4 cursor-pointer
                            hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                      onClick={() => toggleExpand(surgery.id)}
                      role="button"
                      aria-expanded={isExpanded}
                      aria-label={`${surgery.procedureName} — tap to ${isExpanded ? 'collapse' : 'expand'}`}
                  >
                    <div className="flex-1 min-w-0">
                      {/* Type badge */}
                      <span className={`inline-block text-xs font-semibold px-2 py-0.5
                                    rounded-full mb-1 ${typeColor}`}>
                    {typeLabel}
                  </span>

                      {/* Procedure name */}
                      <p className="font-semibold text-gray-900 dark:text-white truncate">
                        {surgery.procedureName}
                      </p>

                      {/* Date + facility */}
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {formatDate(surgery.surgeryDate)}
                        {surgery.facility && ` · ${surgery.facility}`}
                      </p>

                      {/* Surgeon */}
                      {surgery.surgeonName && (
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            {surgery.surgeonName}
                          </p>
                      )}

                      {/* Related conditions pill row */}
                      {relatedDisplay && (
                          <p className="text-xs text-blue-600 dark:text-blue-400 mt-1">
                            🔗 {relatedDisplay}
                          </p>
                      )}
                    </div>

                    {/* Right side: expand chevron + action buttons */}
                    <div className="flex flex-col items-end gap-1 ml-3 shrink-0">
                  <span className="text-gray-400 text-xs select-none">
                    {isExpanded ? '▲' : '▼'}
                  </span>
                      {/* Stop propagation so clicks on buttons don't toggle expand */}
                      <div className="flex gap-1 mt-1" onClick={(e) => e.stopPropagation()}>
                        <button
                            onClick={() => setEditingSurgery(surgery)}
                            className="text-gray-400 dark:text-gray-500 hover:text-blue-500
                                 dark:hover:text-blue-400 p-1"
                            title="Edit"
                            aria-label="Edit surgery record"
                        >
                          ✏️
                        </button>
                        <button
                            onClick={() => handleDelete(surgery)}
                            className="text-gray-400 dark:text-gray-500 hover:text-red-500
                                 dark:hover:text-red-400 p-1"
                            title="Delete"
                            aria-label="Delete surgery record"
                        >
                          🗑️
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* ── Expanded detail panel ── */}
                  {isExpanded && (
                      <div className="px-4 pb-4 border-t border-gray-100 dark:border-gray-700
                                space-y-3 pt-3">

                        {/* Anesthesia */}
                        {surgery.anesthesiaType && (
                            <DetailRow
                                label="Anesthesia"
                                value={surgery.anesthesiaType.charAt(0).toUpperCase() +
                                    surgery.anesthesiaType.slice(1)}
                            />
                        )}

                        {/* Pre-op diagnosis */}
                        {surgery.preOpDiagnosis && (
                            <DetailRow label="Pre-Op Diagnosis" value={surgery.preOpDiagnosis} />
                        )}

                        {/* Complications */}
                        {surgery.complications && (
                            <DetailRow
                                label="Complications"
                                value={surgery.complications}
                                highlight
                            />
                        )}

                        {/* Recovery notes */}
                        {surgery.recoveryNotes && (
                            <DetailRow label="Recovery Notes" value={surgery.recoveryNotes} />
                        )}

                        {/* Follow-up */}
                        {surgery.followUpRequired && (
                            <div className="flex items-center gap-2 text-sm">
                      <span className="px-2 py-0.5 bg-amber-100 dark:bg-amber-900/50
                                       text-amber-800 dark:text-amber-300 rounded-full
                                       text-xs font-semibold">
                        Follow-up required
                      </span>
                              {surgery.followUpDate && (
                                  <span className="text-gray-600 dark:text-gray-400">
                          {formatDate(surgery.followUpDate)}
                        </span>
                              )}
                            </div>
                        )}

                        {/* No extra detail available */}
                        {!surgery.anesthesiaType &&
                            !surgery.preOpDiagnosis &&
                            !surgery.complications &&
                            !surgery.recoveryNotes &&
                            !surgery.followUpRequired && (
                                <p className="text-sm text-gray-500 dark:text-gray-400 italic">
                                  No additional details recorded.
                                </p>
                            )}
                      </div>
                  )}
                </div>
            );
          })}
        </div>

        {/* ── Edit modal ── */}
        <EditSurgeryModal
            surgery={editingSurgery}
            isOpen={editingSurgery !== null}
            onClose={() => setEditingSurgery(null)}
            onSaved={() => {
              setEditingSurgery(null);
              loadSurgeries();
            }}
        />
      </>
  );
};

// ── Small helper: labelled detail row ─────────────────────────────────────
// highlight=true adds a subtle red tint — used for complications
const DetailRow = ({ label, value, highlight = false }) => (
    <div>
    <span className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">
      {label}
    </span>
      <p className={`text-sm mt-0.5 ${
          highlight
              ? 'text-red-700 dark:text-red-400'
              : 'text-gray-700 dark:text-gray-300'
      }`}>
        {value}
      </p>
    </div>
);

export default SurgeryHistory;