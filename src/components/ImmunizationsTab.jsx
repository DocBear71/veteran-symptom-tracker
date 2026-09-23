/**
 * ImmunizationsTab.jsx — Doc Bear's Symptom Vault
 *
 * Renders the Immunizations tab inside Measurements. Shows every vaccine
 * record, whether it came from a VA Blue Button import or was entered by hand,
 * and lets the Veteran add, edit, and delete records.
 *
 * Two sources are deliberately shown side by side rather than split into
 * separate lists. A claim needs one complete shot record, and a Veteran
 * usually can't remember which shots the VA happens to have on file. The
 * source badge answers that question without fragmenting the list.
 *
 * Parent (Measurements.jsx) owns the data load and passes it down, so a save
 * here calls onChanged() to trigger a reload rather than holding its own copy.
 */

import { useState } from 'react';
import {
    saveImmunization,
    updateImmunization,
    deleteImmunization,
    IMMUNIZATION_SOURCES,
    IMMUNIZATION_ADMINISTERED_BY,
} from '../utils/storage';

// ─────────────────────────────────────────────────────────────
// Display constants
// ─────────────────────────────────────────────────────────────

// Who gave the shot. Order matters — this is the dropdown order too.
const ADMINISTERED_BY_OPTIONS = [
    { value: IMMUNIZATION_ADMINISTERED_BY.VA,       label: 'VA facility',        icon: '🏥' },
    { value: IMMUNIZATION_ADMINISTERED_BY.MILITARY, label: 'Military / on duty', icon: '🎖️' },
    { value: IMMUNIZATION_ADMINISTERED_BY.PHARMACY, label: 'Pharmacy',           icon: '💊' },
    { value: IMMUNIZATION_ADMINISTERED_BY.CIVILIAN, label: 'Civilian provider',  icon: '🩺' },
    { value: IMMUNIZATION_ADMINISTERED_BY.EMPLOYER, label: 'Employer / school',  icon: '🏢' },
    { value: IMMUNIZATION_ADMINISTERED_BY.OTHER,    label: 'Other',              icon: '📋' },
];

const ADMINISTERED_BY_MAP = ADMINISTERED_BY_OPTIONS.reduce((acc, o) => {
    acc[o.value] = o;
    return acc;
}, {});

// Common injection sites. Free text is still allowed — this is a datalist,
// not a dropdown, because a paper shot record can say anything.
const COMMON_SITES = [
    'Left deltoid', 'Right deltoid',
    'Left thigh', 'Right thigh',
    'Left gluteal', 'Right gluteal',
    'Oral', 'Intranasal',
];

const ROUTE_OPTIONS = [
    '', 'Intramuscular (IM)', 'Subcutaneous (SubQ)', 'Intradermal (ID)', 'Oral', 'Intranasal',
];

const EMPTY_FORM = {
    vaccineName:    '',
    vaccineDate:    '',
    administeredBy: IMMUNIZATION_ADMINISTERED_BY.VA,
    facility:       '',
    provider:       '',
    doseNumber:     '',
    seriesTotal:    '',
    lotNumber:      '',
    manufacturer:   '',
    site:           '',
    route:          '',
    notes:          '',
    reactionOccurred:    false,
    reactionSeverity:    '',
    reactionDescription: '',
    reactionOnsetDate:   '',
};

// ─────────────────────────────────────────────────────────────
// Date helpers
// ─────────────────────────────────────────────────────────────

/**
 * Format a 'YYYY-MM-DD' string for display.
 *
 * The 'T00:00:00' suffix forces local-time parsing. Without it, JS reads a
 * bare date string as UTC and a Veteran west of Greenwich sees every shot
 * shift one day earlier.
 *
 * When precision is 'month', VA never recorded the day, so we show only the
 * month and year rather than inventing a day that isn't in the record.
 */
const formatVaccineDate = (dateStr, precision = 'day') => {
    if (!dateStr) return 'Date unknown';
    const d = new Date(dateStr + 'T00:00:00');
    if (isNaN(d)) return dateStr;

    if (precision === 'month') {
        return d.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
    }
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
};

// ─────────────────────────────────────────────────────────────
// Main tab
// ─────────────────────────────────────────────────────────────

const ImmunizationsTab = ({ immunizations, onChanged }) => {
    const [showForm, setShowForm]   = useState(false);
    const [editingRecord, setEditingRecord] = useState(null);

    const handleAdd = () => {
        setEditingRecord(null);
        setShowForm(true);
    };

    const handleEdit = (record) => {
        setEditingRecord(record);
        setShowForm(true);
    };

    const handleCloseForm = () => {
        setShowForm(false);
        setEditingRecord(null);
    };

    const handleSave = (formData) => {
        // Flatten the reaction fields back into the nested shape storage expects
        const payload = {
            vaccineName:    formData.vaccineName.trim(),
            vaccineDate:    formData.vaccineDate || null,
            administeredBy: formData.administeredBy,
            facility:       formData.facility.trim(),
            provider:       formData.provider.trim(),
            doseNumber:     formData.doseNumber ? parseInt(formData.doseNumber, 10) : null,
            seriesTotal:    formData.seriesTotal ? parseInt(formData.seriesTotal, 10) : null,
            lotNumber:      formData.lotNumber.trim(),
            manufacturer:   formData.manufacturer.trim(),
            site:           formData.site.trim(),
            route:          formData.route,
            notes:          formData.notes.trim(),
            reaction: {
                occurred:    formData.reactionOccurred,
                severity:    formData.reactionSeverity ? parseInt(formData.reactionSeverity, 10) : null,
                description: formData.reactionDescription.trim(),
                onsetDate:   formData.reactionOnsetDate || null,
                // Reserved for a future "link this reaction to a symptom log" picker
                symptomLogId: editingRecord?.reaction?.symptomLogId || null,
            },
        };

        if (editingRecord) {
            // updateImmunization handles the edited flag and the originalImport
            // snapshot for VA records — nothing to do here.
            updateImmunization(editingRecord.id, payload);
        } else {
            saveImmunization({ ...payload, source: IMMUNIZATION_SOURCES.MANUAL });
        }

        handleCloseForm();
        onChanged();
    };

    const handleDelete = (record) => {
        const label = record.shortName || record.vaccineName;
        if (window.confirm(`Delete the ${label} record from ${formatVaccineDate(record.vaccineDate, record.datePrecision)}?`)) {
            deleteImmunization(record.id);
            onChanged();
        }
    };

    const vaCount     = immunizations.filter(i => i.source === IMMUNIZATION_SOURCES.VA_IMPORT).length;
    const manualCount = immunizations.length - vaCount;

    return (
        <div className="space-y-3">
            {/* Add button */}
            <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4">
                <div className="flex items-center justify-between gap-3 flex-wrap">
                    <div>
                        <h3 className="text-sm font-medium text-gray-900 dark:text-white">
                            Immunization Record ({immunizations.length})
                        </h3>
                        {immunizations.length > 0 && (
                            <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                                {vaCount} from VA records · {manualCount} added by you
                            </p>
                        )}
                    </div>
                    <button
                        onClick={handleAdd}
                        className="px-4 py-2 bg-blue-900 dark:bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-800 dark:hover:bg-blue-500 transition-colors">
                        + Add Vaccine
                    </button>
                </div>
            </div>

            {/* Info banner */}
            <div className="bg-teal-50 dark:bg-teal-900/20 border border-teal-200 dark:border-teal-800 rounded-lg p-3 text-xs text-teal-800 dark:text-teal-300">
                💉 Records marked <strong>VA</strong> came from your Blue Button import. Add shots the VA
                doesn't have — pharmacy, county clinic, employer, or a paper military shot record.
                If you had a reaction to a shot, note it here; that documentation supports a claim later.
            </div>

            {/* Empty state */}
            {immunizations.length === 0 ? (
                <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-8 text-center">
                    <div className="text-4xl mb-2">💉</div>
                    <p className="text-gray-600 dark:text-gray-400 font-medium">No vaccines recorded yet</p>
                    <p className="text-sm text-gray-500 dark:text-gray-500 mt-1">
                        Import your VA Blue Button file to pull in your VA shot record, or add one by hand.
                    </p>
                </div>
            ) : (
                <div className="space-y-2">
                    {immunizations.map(record => (
                        <ImmunizationCard
                            key={record.id}
                            record={record}
                            onEdit={handleEdit}
                            onDelete={handleDelete}
                        />
                    ))}
                </div>
            )}

            {showForm && (
                <ImmunizationFormModal
                    record={editingRecord}
                    onSave={handleSave}
                    onCancel={handleCloseForm}
                />
            )}
        </div>
    );
};

// ─────────────────────────────────────────────────────────────
// One vaccine row
// ─────────────────────────────────────────────────────────────

const ImmunizationCard = ({ record, onEdit, onDelete }) => {
    const [expanded, setExpanded] = useState(false);

    const displayName = record.shortName || record.vaccineName;
    const isVA        = record.source === IMMUNIZATION_SOURCES.VA_IMPORT;
    const admin       = ADMINISTERED_BY_MAP[record.administeredBy] || ADMINISTERED_BY_MAP.other;
    const hasReaction = record.reaction?.occurred;

    // A full name that differs from the short name is worth showing, since two
    // different flu formulations can collapse to the same short label.
    const showFullName = record.vaccineName && record.vaccineName !== displayName;

    return (
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
            <div className="p-4">
                <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                        {/* Name + badges */}
                        <div className="flex items-center gap-2 flex-wrap">
                            <span className="font-medium text-gray-900 dark:text-white">{displayName}</span>

                            {isVA ? (
                                <span className="text-xs px-2 py-0.5 rounded-full bg-blue-100 dark:bg-blue-900/40 text-blue-800 dark:text-blue-300">
                      VA record
                    </span>
                            ) : (
                                <span className="text-xs px-2 py-0.5 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300">
                      Added by you
                    </span>
                            )}

                            {record.vaConfirmed && (
                                <span className="text-xs px-2 py-0.5 rounded-full bg-green-100 dark:bg-green-900/40 text-green-800 dark:text-green-300">
                      ✓ VA also has this
                    </span>
                            )}

                            {record.edited && (
                                <span className="text-xs px-2 py-0.5 rounded-full bg-amber-100 dark:bg-amber-900/40 text-amber-800 dark:text-amber-300">
                      Edited
                    </span>
                            )}

                            {hasReaction && (
                                <span className="text-xs px-2 py-0.5 rounded-full bg-red-100 dark:bg-red-900/40 text-red-800 dark:text-red-300">
                      ⚠️ Reaction noted
                    </span>
                            )}
                        </div>

                        {/* Date + who gave it */}
                        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                            {formatVaccineDate(record.vaccineDate, record.datePrecision)}
                            {record.datePrecision === 'month' && (
                                <span className="text-xs text-gray-400 dark:text-gray-500"> (day not recorded)</span>
                            )}
                            {' · '}
                            {admin.icon} {admin.label}
                        </p>

                        {/* Dose in series */}
                        {record.doseNumber && (
                            <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                                Dose {record.doseNumber}
                                {record.seriesTotal ? ` of ${record.seriesTotal}` : ''}
                            </p>
                        )}

                        {record.facility && (
                            <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{record.facility}</p>
                        )}
                    </div>

                    {/* Actions */}
                    <div className="flex flex-col gap-1 flex-shrink-0">
                        <button
                            onClick={() => onEdit(record)}
                            className="text-gray-400 dark:text-gray-500 hover:text-blue-500 dark:hover:text-blue-400 p-1"
                            aria-label={`Edit ${displayName} record`}
                            title="Edit">
                            ✏️
                        </button>
                        <button
                            onClick={() => onDelete(record)}
                            className="text-gray-400 dark:text-gray-500 hover:text-red-500 dark:hover:text-red-400 p-1"
                            aria-label={`Delete ${displayName} record`}
                            title="Delete">
                            🗑️
                        </button>
                    </div>
                </div>

                {/* Expand toggle */}
                <button
                    onClick={() => setExpanded(e => !e)}
                    aria-expanded={expanded}
                    className="mt-2 text-xs text-blue-600 dark:text-blue-400 hover:underline">
                    {expanded ? 'Hide details' : 'Show details'}
                </button>
            </div>

            {expanded && (
                <div className="px-4 pb-4 pt-1 border-t border-gray-200 dark:border-gray-700 space-y-2 text-sm">
                    {showFullName && (
                        <DetailRow label="Full name on record" value={record.vaccineName} />
                    )}
                    {record.manufacturer && <DetailRow label="Manufacturer" value={record.manufacturer} />}
                    {record.lotNumber    && <DetailRow label="Lot number"   value={record.lotNumber} />}
                    {record.site         && <DetailRow label="Site"         value={record.site} />}
                    {record.route        && <DetailRow label="Route"        value={record.route} />}
                    {record.provider     && <DetailRow label="Provider"     value={record.provider} />}
                    {record.ndc          && <DetailRow label="NDC"          value={record.ndc} />}
                    {record.dosage       && <DetailRow label="Dosage"       value={record.dosage} />}

                    {record.administeredByName && (
                        <DetailRow label="Administered by" value={record.administeredByName} />
                    )}

                    {/* VA lists one shot under every facility that has it on file.
                  Showing all of them explains why this is a single row. */}
                    {record.allFacilities?.length > 1 && (
                        <DetailRow
                            label={`VA facilities on file (${record.allFacilities.length})`}
                            value={record.allFacilities.join(', ')}
                        />
                    )}

                    {hasReaction && (
                        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-3">
                            <p className="text-xs font-semibold text-red-800 dark:text-red-300 mb-1">
                                Reaction
                                {record.reaction.severity ? ` — severity ${record.reaction.severity}/10` : ''}
                            </p>
                            {record.reaction.onsetDate && (
                                <p className="text-xs text-red-700 dark:text-red-400">
                                    Onset: {formatVaccineDate(record.reaction.onsetDate)}
                                </p>
                            )}
                            {record.reaction.description && (
                                <p className="text-xs text-red-700 dark:text-red-400 mt-1">
                                    {record.reaction.description}
                                </p>
                            )}
                        </div>
                    )}

                    {record.notes && <DetailRow label="Your notes" value={record.notes} />}

                    {record.providerNotes && (
                        <DetailRow label="VA provider notes" value={record.providerNotes} />
                    )}

                    {/* If this record was imported and then hand-edited, the original
                  VA values are still on file. Showing them keeps the export
                  honest about what VA actually said. */}
                    {record.edited && record.originalImport && (
                        <details className="text-xs">
                            <summary className="cursor-pointer text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200">
                                View original VA values before your edits
                            </summary>
                            <div className="mt-2 pl-3 border-l-2 border-gray-300 dark:border-gray-600 space-y-1">
                                <DetailRow label="Name"     value={record.originalImport.vaccineName} />
                                <DetailRow label="Date"     value={formatVaccineDate(record.originalImport.vaccineDate, record.originalImport.datePrecision)} />
                                {record.originalImport.facility && (
                                    <DetailRow label="Facility" value={record.originalImport.facility} />
                                )}
                            </div>
                        </details>
                    )}
                </div>
            )}
        </div>
    );
};

const DetailRow = ({ label, value }) => {
    if (!value) return null;
    return (
        <div className="flex gap-2 flex-wrap">
            <span className="text-xs font-medium text-gray-500 dark:text-gray-400 flex-shrink-0">{label}:</span>
            <span className="text-xs text-gray-800 dark:text-gray-200 break-words">{value}</span>
        </div>
    );
};

// ─────────────────────────────────────────────────────────────
// Add / edit form
// ─────────────────────────────────────────────────────────────

const ImmunizationFormModal = ({ record, onSave, onCancel }) => {
    const isEdit = !!record;
    const isVARecord = record?.source === IMMUNIZATION_SOURCES.VA_IMPORT;

    const [form, setForm] = useState(() => {
        if (!record) return { ...EMPTY_FORM };
        return {
            vaccineName:    record.vaccineName || '',
            vaccineDate:    record.vaccineDate || '',
            administeredBy: record.administeredBy || IMMUNIZATION_ADMINISTERED_BY.VA,
            facility:       record.facility || '',
            provider:       record.provider || '',
            doseNumber:     record.doseNumber != null ? String(record.doseNumber) : '',
            seriesTotal:    record.seriesTotal != null ? String(record.seriesTotal) : '',
            lotNumber:      record.lotNumber || '',
            manufacturer:   record.manufacturer || '',
            site:           record.site || '',
            route:          record.route || '',
            notes:          record.notes || '',
            reactionOccurred:    record.reaction?.occurred || false,
            reactionSeverity:    record.reaction?.severity != null ? String(record.reaction.severity) : '',
            reactionDescription: record.reaction?.description || '',
            reactionOnsetDate:   record.reaction?.onsetDate || '',
        };
    });

    const [errors, setErrors] = useState({});

    const setField = (field, value) => {
        setForm(prev => ({ ...prev, [field]: value }));
        if (errors[field]) setErrors(prev => ({ ...prev, [field]: null }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const newErrors = {};
        if (!form.vaccineName.trim()) newErrors.vaccineName = 'Enter the vaccine name';
        if (!form.vaccineDate)        newErrors.vaccineDate = 'Enter the date you got the shot';

        // A dose number without a series total is fine; the reverse is not,
        // since "of 6" with no dose number tells a reviewer nothing.
        if (form.seriesTotal && !form.doseNumber) {
            newErrors.doseNumber = 'Enter which dose this was';
        }

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }
        onSave(form);
    };

    const inputClass = (field) =>
        `w-full p-3 border rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white ${
            errors[field] ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
        }`;

    return (
        <div
            className="fixed inset-0 bg-black/50 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4"
            role="dialog"
            aria-modal="true"
            aria-labelledby="immunization-form-title">
            <div className="bg-white dark:bg-gray-800 w-full sm:max-w-lg sm:rounded-xl rounded-t-xl max-h-[90vh] overflow-y-auto">
                {/* Header */}
                <div className="sticky top-0 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-4 py-3 flex items-center justify-between">
                    <h3 id="immunization-form-title" className="text-lg font-semibold text-gray-900 dark:text-white">
                        {isEdit ? 'Edit Vaccine' : 'Add Vaccine'}
                    </h3>
                    <button
                        onClick={onCancel}
                        className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 text-xl leading-none p-1"
                        aria-label="Close">
                        ×
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-4 space-y-4">
                    {isVARecord && (
                        <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg p-3 text-xs text-amber-800 dark:text-amber-300">
                            This record came from your VA file. Your changes are saved, and the original VA
                            values are kept alongside them so your export stays accurate about what VA recorded.
                        </div>
                    )}

                    {/* Vaccine name */}
                    <div>
                        <label htmlFor="vax-name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Vaccine name *
                        </label>
                        <input
                            id="vax-name"
                            type="text"
                            value={form.vaccineName}
                            onChange={(e) => setField('vaccineName', e.target.value)}
                            placeholder="Influenza, Tdap, Anthrax, Hepatitis B..."
                            className={inputClass('vaccineName')}
                            aria-describedby={errors.vaccineName ? 'vax-name-error' : undefined}
                        />
                        {errors.vaccineName && (
                            <p id="vax-name-error" className="text-red-500 dark:text-red-400 text-sm mt-1">{errors.vaccineName}</p>
                        )}
                    </div>

                    {/* Date + who gave it */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                            <label htmlFor="vax-date" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                Date received *
                            </label>
                            <input
                                id="vax-date"
                                type="date"
                                value={form.vaccineDate}
                                onChange={(e) => setField('vaccineDate', e.target.value)}
                                className={inputClass('vaccineDate')}
                                aria-describedby={errors.vaccineDate ? 'vax-date-error' : undefined}
                            />
                            {errors.vaccineDate && (
                                <p id="vax-date-error" className="text-red-500 dark:text-red-400 text-sm mt-1">{errors.vaccineDate}</p>
                            )}
                        </div>
                        <div>
                            <label htmlFor="vax-admin" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                Who gave it
                            </label>
                            <select
                                id="vax-admin"
                                value={form.administeredBy}
                                onChange={(e) => setField('administeredBy', e.target.value)}
                                className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white">
                                {ADMINISTERED_BY_OPTIONS.map(o => (
                                    <option key={o.value} value={o.value}>{o.icon} {o.label}</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    {/* Facility + provider */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                            <label htmlFor="vax-facility" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                Facility / location
                            </label>
                            <input
                                id="vax-facility"
                                type="text"
                                value={form.facility}
                                onChange={(e) => setField('facility', e.target.value)}
                                placeholder="Hy-Vee Pharmacy, Fort Benning, county clinic..."
                                className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                            />
                        </div>
                        <div>
                            <label htmlFor="vax-provider" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                Provider
                            </label>
                            <input
                                id="vax-provider"
                                type="text"
                                value={form.provider}
                                onChange={(e) => setField('provider', e.target.value)}
                                placeholder="Name, if you have it"
                                className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                            />
                        </div>
                    </div>

                    {/* Series */}
                    <div>
                        <p className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Dose in series
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">
                            For multi-dose series like anthrax or hepatitis B. Leave blank for a single shot.
                        </p>
                        <div className="flex items-center gap-2">
                            <input
                                type="number"
                                min="1"
                                value={form.doseNumber}
                                onChange={(e) => setField('doseNumber', e.target.value)}
                                placeholder="Dose #"
                                aria-label="Dose number"
                                className={`${inputClass('doseNumber')} max-w-[7rem]`}
                            />
                            <span className="text-sm text-gray-500 dark:text-gray-400">of</span>
                            <input
                                type="number"
                                min="1"
                                value={form.seriesTotal}
                                onChange={(e) => setField('seriesTotal', e.target.value)}
                                placeholder="Total"
                                aria-label="Total doses in series"
                                className="w-full max-w-[7rem] p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                            />
                        </div>
                        {errors.doseNumber && (
                            <p className="text-red-500 dark:text-red-400 text-sm mt-1">{errors.doseNumber}</p>
                        )}
                    </div>

                    {/* Lot + manufacturer */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                            <label htmlFor="vax-lot" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                Lot number
                            </label>
                            <input
                                id="vax-lot"
                                type="text"
                                value={form.lotNumber}
                                onChange={(e) => setField('lotNumber', e.target.value)}
                                placeholder="From your shot card"
                                className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                            />
                        </div>
                        <div>
                            <label htmlFor="vax-mfr" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                Manufacturer
                            </label>
                            <input
                                id="vax-mfr"
                                type="text"
                                value={form.manufacturer}
                                onChange={(e) => setField('manufacturer', e.target.value)}
                                placeholder="Pfizer, Moderna, BioThrax..."
                                className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                            />
                        </div>
                    </div>

                    {/* Site + route */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                            <label htmlFor="vax-site" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                Injection site
                            </label>
                            <input
                                id="vax-site"
                                type="text"
                                list="vax-site-options"
                                value={form.site}
                                onChange={(e) => setField('site', e.target.value)}
                                placeholder="Left deltoid"
                                className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                            />
                            <datalist id="vax-site-options">
                                {COMMON_SITES.map(s => <option key={s} value={s} />)}
                            </datalist>
                        </div>
                        <div>
                            <label htmlFor="vax-route" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                Route
                            </label>
                            <select
                                id="vax-route"
                                value={form.route}
                                onChange={(e) => setField('route', e.target.value)}
                                className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white">
                                {ROUTE_OPTIONS.map(r => (
                                    <option key={r || 'none'} value={r}>{r || 'Not recorded'}</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    {/* Reaction */}
                    <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-3 space-y-3">
                        <label className="flex items-center gap-3 cursor-pointer">
                            <input
                                type="checkbox"
                                checked={form.reactionOccurred}
                                onChange={(e) => setField('reactionOccurred', e.target.checked)}
                                className="w-5 h-5 rounded border-gray-300 dark:border-gray-600 text-blue-600 focus:ring-blue-500"
                            />
                            <span className="text-sm font-medium text-gray-900 dark:text-white">
                  I had a reaction to this shot
                </span>
                        </label>

                        {form.reactionOccurred && (
                            <>
                                <p className="text-xs text-gray-500 dark:text-gray-400">
                                    Document what happened and when it started. A reaction recorded close to the
                                    date of the shot is far stronger evidence than one recalled years later.
                                </p>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                    <div>
                                        <label htmlFor="vax-reaction-onset" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                            Onset date
                                        </label>
                                        <input
                                            id="vax-reaction-onset"
                                            type="date"
                                            value={form.reactionOnsetDate}
                                            onChange={(e) => setField('reactionOnsetDate', e.target.value)}
                                            className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                                        />
                                    </div>
                                    <div>
                                        <label htmlFor="vax-reaction-severity" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                            Severity
                                        </label>
                                        <select
                                            id="vax-reaction-severity"
                                            value={form.reactionSeverity}
                                            onChange={(e) => setField('reactionSeverity', e.target.value)}
                                            className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white">
                                            <option value="">Not rated</option>
                                            {[1,2,3,4,5,6,7,8,9,10].map(n => (
                                                <option key={n} value={n}>{n} / 10</option>
                                            ))}
                                        </select>
                                    </div>
                                </div>

                                <div>
                                    <label htmlFor="vax-reaction-desc" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                        What happened
                                    </label>
                                    <textarea
                                        id="vax-reaction-desc"
                                        rows={3}
                                        value={form.reactionDescription}
                                        onChange={(e) => setField('reactionDescription', e.target.value)}
                                        placeholder="Symptoms, how long they lasted, whether you sought treatment"
                                        className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                                    />
                                </div>
                            </>
                        )}
                    </div>

                    {/* Notes */}
                    <div>
                        <label htmlFor="vax-notes" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Notes
                        </label>
                        <textarea
                            id="vax-notes"
                            rows={2}
                            value={form.notes}
                            onChange={(e) => setField('notes', e.target.value)}
                            placeholder="Anything else worth recording"
                            className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                        />
                    </div>

                    {/* Actions */}
                    <div className="flex gap-3 pt-2">
                        <button
                            type="button"
                            onClick={onCancel}
                            className="flex-1 py-3 px-4 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg text-sm font-medium hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="flex-1 py-3 px-4 bg-blue-900 dark:bg-blue-600 text-white rounded-lg text-sm font-semibold hover:bg-blue-800 dark:hover:bg-blue-500 transition-colors">
                            {isEdit ? 'Save Changes' : 'Add Vaccine'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ImmunizationsTab;