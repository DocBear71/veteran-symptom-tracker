/**
 * DiagnosesTab.jsx — Doc Bear's Symptom Vault
 *
 * The Veteran's diagnosed conditions: what, when, and who recorded it.
 *
 * WHY THE DATE FIELD IS THE POINT OF THIS SCREEN.
 *
 * Several conditions are rated on time since diagnosis rather than on a fixed
 * percentage. Hypoparathyroidism is 100% for three months, then residuals.
 * Hyperthyroidism is 30% for six. Until this screen existed the app had no way
 * to know that date, so it reported the initial rating to everyone regardless
 * of how long ago they were diagnosed — a number that was usually too high and
 * that flowed straight into the estimated combined rating.
 *
 * So "Diagnosed" starts empty and stays empty until the Veteran fills it in.
 * An empty date means the analyzer declines to give a number, which is the
 * honest answer.
 *
 * "First recorded" is separate and not editable. It's the date the VA file
 * gives, meaning when the condition was added to a facility's problem list. It
 * is a floor on the diagnosis date, not the date itself — a Veteran whose care
 * moved between facilities has the same condition entered more than once.
 */

import { useState, useEffect, useCallback } from 'react';
import { useProfile } from '../hooks/useProfile';
import {
    getDiagnoses,
    saveDiagnosis,
    updateDiagnosis,
    deleteDiagnosis,
    backfillDiagnosisConditionKeys,
    DIAGNOSIS_SOURCES,
} from '../utils/storage';
import { CONDITIONS } from '../utils/ratingCriteria';
import { isTimeLimited, getTimeLimitInfo } from '../utils/snomedMap';
import { SURGERY_LIMITED_CONDITIONS } from '../utils/ratingLogic/_shared';

// Sorted once at module load. CONDITIONS is keyed DIABETES while the value's
// id is 'diabetes' — the id is what the analyzers answer to, so that's what
// gets stored.
const CONDITION_OPTIONS = Object.values(CONDITIONS)
    .filter(c => c && c.id && c.name)
    .sort((a, b) => a.name.localeCompare(b.name));

const DiagnosesTab = () => {
    const { profile } = useProfile();
    const [diagnoses, setDiagnoses] = useState([]);
    const [editingId, setEditingId] = useState(null);
    const [showAdd, setShowAdd] = useState(false);
    const [search, setSearch] = useState('');

      const load = useCallback(() => {
    // Links any diagnosis whose SNOMED code we now recognize but whose
    // conditionKey is still null — imports made before the map existed, and
    // records whose code was added to it later.
    backfillDiagnosisConditionKeys();
    setDiagnoses(getDiagnoses());
  }, []);

    useEffect(() => {
        load();
        const handler = () => load();
        window.addEventListener('profileChanged', handler);
        return () => window.removeEventListener('profileChanged', handler);
    }, [load, profile?.id]);

    const handleDelete = (record) => {
        if (!window.confirm(`Remove "${record.conditionName}" from your diagnoses?`)) return;
        deleteDiagnosis(record.id);
        load();
    };

    const filtered = search.trim()
        ? diagnoses.filter(d =>
            (d.conditionName || '').toLowerCase().includes(search.toLowerCase().trim()))
        : diagnoses;

    // Surfaced at the top because a date nobody enters is the whole failure mode
    // this screen exists to prevent.
    const missingDates = diagnoses.filter(d => !d.diagnosisDate).length;

    return (
        <div>
            {/* ── Intro ─────────────────────────────────────────────── */}
            <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-3 mb-4">
                <p className="text-sm text-blue-900 dark:text-blue-200">
                    <strong>Your diagnosed conditions.</strong> Import them from a VA Blue Button file,
                    or add them by hand from any medical record you have.
                </p>
                <p className="text-xs text-blue-800 dark:text-blue-300 mt-1">
                    Adding a diagnosis date matters: some conditions are rated on how long ago you were
                    diagnosed, and the app won't estimate a rating for those without it.
                </p>
            </div>

            {missingDates > 0 && (
                <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg p-3 mb-4">
                    <p className="text-sm text-amber-900 dark:text-amber-200">
                        {missingDates} of your {diagnoses.length} diagnoses {missingDates === 1 ? 'has' : 'have'} no
                        diagnosis date yet. Tap a condition to add one.
                    </p>
                </div>
            )}

            {/* ── Search and add ────────────────────────────────────── */}
            <div className="flex gap-2 mb-4">
                <input
                    type="text"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search diagnoses..."
                    className="flex-1 px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm"
                />
                <button
                    onClick={() => setShowAdd(true)}
                    className="px-4 py-2 bg-blue-900 dark:bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-800 dark:hover:bg-blue-700"
                >
                    + Add
                </button>
            </div>

            {showAdd && (
                <DiagnosisForm
                    onSave={(data) => { saveDiagnosis(data); setShowAdd(false); load(); }}
                    onCancel={() => setShowAdd(false)}
                />
            )}

            {/* ── List ──────────────────────────────────────────────── */}
            {filtered.length === 0 ? (
                <div className="text-center py-10 px-4">
                    <p className="text-gray-500 dark:text-gray-400 text-sm">
                        {diagnoses.length === 0
                            ? 'No diagnoses recorded yet. Import a Blue Button file from Settings, or add one by hand.'
                            : 'No diagnoses match your search.'}
                    </p>
                </div>
            ) : (
                <div className="space-y-2">
                    {filtered.map(record => (
                        editingId === record.id ? (
                            <DiagnosisForm
                                key={record.id}
                                existing={record}
                                onSave={(data) => { updateDiagnosis(record.id, data); setEditingId(null); load(); }}
                                onCancel={() => setEditingId(null)}
                            />
                        ) : (
                            <DiagnosisCard
                                key={record.id}
                                record={record}
                                onEdit={() => setEditingId(record.id)}
                                onDelete={() => handleDelete(record)}
                            />
                        )
                    ))}
                </div>
            )}
        </div>
    );
};

/**
 * One diagnosis, read-only.
 */
const DiagnosisCard = ({ record, onEdit, onDelete }) => {
    const fmt = (d) => d ? new Date(d + 'T00:00:00').toLocaleDateString() : null;
    const isVa = record.source === DIAGNOSIS_SOURCES.VA_IMPORT;

    return (
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-3">
            <div className="flex items-start justify-between gap-2">
                <div className="flex-1 min-w-0">
                    <p className="font-medium text-gray-900 dark:text-white">
                        {record.conditionName}
                    </p>

                    <div className="flex flex-wrap gap-2 mt-1">
                        {isVa ? (
                            <span className="text-xs px-2 py-0.5 rounded bg-teal-100 dark:bg-teal-900/40 text-teal-800 dark:text-teal-200">
                    {record.edited ? 'VA file (edited)' : 'VA file'}
                  </span>
                        ) : (
                            <span className="text-xs px-2 py-0.5 rounded bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300">
                    Self-reported
                  </span>
                        )}
                        {record.excludeFromExport && (
                            <span className="text-xs px-2 py-0.5 rounded bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400">
                    Not in exports
                  </span>
                        )}
                    </div>

                    {/* The two dates, labeled so the difference is obvious */}
                    <div className="mt-2 text-xs text-gray-600 dark:text-gray-400 space-y-0.5">
                        {record.diagnosisDate ? (
                            <p>Diagnosed: <strong className="text-gray-900 dark:text-gray-200">{fmt(record.diagnosisDate)}</strong></p>
                        ) : (
                            <p className="text-amber-700 dark:text-amber-400">
                                Diagnosis date not set
                            </p>
                        )}
                        {record.firstRecordedDate && (
                            <p>First recorded in VA records: {fmt(record.firstRecordedDate)}</p>
                        )}
                        {(record.provider || record.facility) && (
                            <p>{[record.provider, record.facility].filter(Boolean).join(' · ')}</p>
                        )}
                                      {record.snomedCode && (
                  <p className="opacity-70">SNOMED {record.snomedCode}</p>
              )}
              {record.conditionKey && (
                  <p className="text-blue-700 dark:text-blue-400">
                    {/* Name the target. Hyper- and hypo- pairs sort next to each
                        other in the picker and differ by two letters, so a
                        mis-click is easy and otherwise invisible. */}
                    Linked to: {CONDITION_OPTIONS.find(c => c.id === record.conditionKey)?.name || record.conditionKey}
                    {isTimeLimited(record.conditionKey) && !record.diagnosisDate && (
                        <span className="block text-amber-700 dark:text-amber-400 mt-0.5">
                          ⚠ This condition is rated {getTimeLimitInfo(record.conditionKey).initialRating}%
                          for its first {getTimeLimitInfo(record.conditionKey).months} months, then on
                          remaining symptoms. Without a diagnosis date the app can't tell which applies,
                          so it won't estimate a rating.
                        </span>
                    )}
                  </p>
              )}
                    </div>

                    {record.notes && (
                        <p className="text-xs text-gray-600 dark:text-gray-400 mt-2 italic">
                            {record.notes}
                        </p>
                    )}
                </div>

                <div className="flex flex-col gap-1 flex-shrink-0">
                    <button
                        onClick={onEdit}
                        aria-label={`Edit ${record.conditionName}`}
                        className="p-1.5 text-gray-400 hover:text-blue-600 dark:hover:text-blue-400"
                    >
                        ✏️
                    </button>
                    <button
                        onClick={onDelete}
                        aria-label={`Delete ${record.conditionName}`}
                        className="p-1.5 text-gray-400 hover:text-red-600 dark:hover:text-red-400"
                    >
                        🗑
                    </button>
                </div>
            </div>
        </div>
    );
};

/**
 * Add or edit form.
 *
 * firstRecordedDate is shown but not editable — it's what the VA file said,
 * and letting it drift would remove the only fixed reference point a reviewer
 * could check the Veteran's date against.
 */
const DiagnosisForm = ({ existing, onSave, onCancel }) => {
  const [form, setForm] = useState({
    conditionName:     existing?.conditionName || '',
    conditionKey:      existing?.conditionKey || '',
    diagnosisDate:     existing?.diagnosisDate || '',
        provider:          existing?.provider || '',
        facility:          existing?.facility || '',
        notes:             existing?.notes || '',
        excludeFromExport: existing?.excludeFromExport || false,
    });

    const set = (key, value) => setForm(f => ({ ...f, [key]: value }));

    const handleSubmit = () => {
        if (!form.conditionName.trim()) {
            alert('Enter a condition name.');
            return;
        }
    onSave({
      ...form,
      conditionName: form.conditionName.trim(),
      // Empty string would store a key nothing matches; null means unlinked.
      conditionKey: form.conditionKey || null,
            // Empty string would read as "set to nothing" downstream; null is
            // unambiguously "not supplied".
            diagnosisDate: form.diagnosisDate || null,
        });
    };

    const fmt = (d) => d ? new Date(d + 'T00:00:00').toLocaleDateString() : null;

    return (
        <div className="bg-white dark:bg-gray-800 rounded-lg border-2 border-blue-400 dark:border-blue-600 p-4 space-y-3">
            <div>
                <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Condition
                </label>
                <input
                    type="text"
                    value={form.conditionName}
                    onChange={(e) => set('conditionName', e.target.value)}
                    placeholder="e.g. Hypoparathyroidism"
                    className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-white text-sm"
                />
            </div>

            {/* Optional link to a rating analyzer. Without it the diagnosis is a
            record; with it, the date drives the rating estimate. */}
            <div>
                <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Link to a rated condition <span className="font-normal opacity-70">(optional)</span>
                </label>
                <select
                    value={form.conditionKey}
                    onChange={(e) => set('conditionKey', e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-white text-sm"
                >
                    <option value="">Not linked</option>
                    {CONDITION_OPTIONS.map(c => (
                        <option key={c.id} value={c.id}>
                            {c.name}{c.diagnosticCode ? ` (DC ${c.diagnosticCode})` : ''}
                        </option>
                    ))}
                </select>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    Links this diagnosis to the app's rating analysis for that condition. VA problem-list
                    names don't always match, so this is how you connect them.
                </p>
                {isTimeLimited(form.conditionKey) && (
                    <p className="text-xs text-amber-700 dark:text-amber-400 mt-1">
                        This condition is rated {getTimeLimitInfo(form.conditionKey).initialRating}% for its
                        first {getTimeLimitInfo(form.conditionKey).months} months
                        (DC {getTimeLimitInfo(form.conditionKey).dc}), then on remaining symptoms. The
                        diagnosis date below decides which applies.
                    </p>
                )}

                {SURGERY_LIMITED_CONDITIONS[form.conditionKey] && (
                    <p className="text-xs text-amber-700 dark:text-amber-400 mt-1">
                        This condition is rated {SURGERY_LIMITED_CONDITIONS[form.conditionKey].initialRating}% for
                        {' '}{SURGERY_LIMITED_CONDITIONS[form.conditionKey].months} months from discharge after
                        surgery (DC {SURGERY_LIMITED_CONDITIONS[form.conditionKey].dc}). That period comes from a
                        surgery record, not the diagnosis date: add the surgery to your surgery records and link it
                        to this condition.
                    </p>
                )}
            </div>

            <div>
                <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Date of diagnosis
                </label>
                <input
                    type="date"
                    value={form.diagnosisDate}
                    onChange={(e) => set('diagnosisDate', e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-white text-sm"
                />
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    When you were actually diagnosed, from your medical records. Leave blank if you
                    aren't sure — the app won't guess.
                </p>
            </div>

            {existing?.firstRecordedDate && (
                <div className="bg-gray-50 dark:bg-gray-900/50 rounded-lg p-2">
                    <p className="text-xs text-gray-600 dark:text-gray-400">
                        <strong>First recorded in VA records:</strong> {fmt(existing.firstRecordedDate)}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-500 mt-0.5">
                        This is when the condition was added to a VA problem list, which may be later
                        than your actual diagnosis. It can't be edited.
                    </p>
                </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                    <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Diagnosing provider
                    </label>
                    <input
                        type="text"
                        value={form.provider}
                        onChange={(e) => set('provider', e.target.value)}
                        className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-white text-sm"
                    />
                </div>
                <div>
                    <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Facility
                    </label>
                    <input
                        type="text"
                        value={form.facility}
                        onChange={(e) => set('facility', e.target.value)}
                        className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-white text-sm"
                    />
                </div>
            </div>

            <div>
                <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Notes
                </label>
                <textarea
                    value={form.notes}
                    onChange={(e) => set('notes', e.target.value)}
                    rows={2}
                    className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-white text-sm"
                />
            </div>

            {/* A VA problem list carries social determinants alongside diagnoses.
            They're kept out of exports by default so nothing personal lands in
            a PDF a Veteran hands over without deciding to. */}
            <label className="flex items-start gap-2 cursor-pointer">
                <input
                    type="checkbox"
                    checked={form.excludeFromExport}
                    onChange={(e) => set('excludeFromExport', e.target.checked)}
                    className="mt-0.5 w-4 h-4 rounded border-gray-300 dark:border-gray-600 text-blue-600"
                />
                <span className="text-xs text-gray-700 dark:text-gray-300">
            Leave this out of exported claim packages
          </span>
            </label>

            <div className="flex gap-2 pt-1">
                <button
                    onClick={handleSubmit}
                    className="flex-1 py-2 bg-blue-900 dark:bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-800 dark:hover:bg-blue-700"
                >
                    Save
                </button>
                <button
                    onClick={onCancel}
                    className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg text-sm"
                >
                    Cancel
                </button>
            </div>
        </div>
    );
};

export default DiagnosesTab;