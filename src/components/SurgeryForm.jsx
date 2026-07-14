import { useState } from 'react';
import { saveSurgery } from '../utils/storage';

// ── Procedure type options ──────────────────────────────────────────────────
// Covers the major surgical categories a veteran would encounter.
// categoryId field is reserved for future Option 2 structured linking.
const PROCEDURE_TYPES = [
  { value: 'orthopedic',      label: 'Orthopedic' },
  { value: 'cardiovascular',  label: 'Cardiovascular' },
  { value: 'neurological',    label: 'Neurological' },
  { value: 'gastrointestinal',label: 'Gastrointestinal' },
  { value: 'urological',      label: 'Urological' },
  { value: 'pulmonary',       label: 'Pulmonary / Thoracic' },
  { value: 'ophthalmic',      label: 'Ophthalmic' },
  { value: 'dental_oral',     label: 'Dental / Oral' },
  { value: 'skin_tissue',     label: 'Skin / Soft Tissue' },
  { value: 'emergency',       label: 'Emergency / Trauma' },
  { value: 'other',           label: 'Other' },
];

const ANESTHESIA_TYPES = [
  { value: 'general',   label: 'General' },
  { value: 'regional',  label: 'Regional (spinal/epidural)' },
  { value: 'local',     label: 'Local' },
  { value: 'sedation',  label: 'Sedation / MAC' },
  { value: 'none',      label: 'None / Unknown' },
];

// ── Empty form state ────────────────────────────────────────────────────────
const EMPTY_FORM = {
  surgeryDate:        '',
  procedureName:      '',
  procedureType:      '',
  surgeonName:        '',
  facility:           '',
  anesthesiaType:     '',
  relatedConditions:  '',   // free-text; stored as [{ label, categoryId: null }]
  preOpDiagnosis:     '',
  complications:      '',
  recoveryNotes:      '',
  followUpRequired:   false,
  followUpDate:       '',
};

// ── Component ───────────────────────────────────────────────────────────────
// overrideSave: when provided (edit modal), called with the processed payload
// instead of calling saveSurgery directly. Lets the modal own the update call.
const SurgeryForm = ({ onSaved, onCancel, initialData = null, overrideSave = null }) => {
  // If initialData is provided, we're editing an existing record
  const [formData, setFormData] = useState(
      initialData
          ? {
            ...EMPTY_FORM,
            ...initialData,
            // Flatten relatedConditions array back to display string for the text field
            relatedConditions: initialData.relatedConditions
            ?.map(c => c.label)
            .join(', ') || '',
          }
          : { ...EMPTY_FORM }
  );

  const [errors, setErrors]     = useState({});
  const [isSaving, setIsSaving] = useState(false);

  // ── Field update helper ─────────────────────────────────────────────────
  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: null }));
    }
  };

  // ── Validation ──────────────────────────────────────────────────────────
  const validate = () => {
    const newErrors = {};
    if (!formData.surgeryDate)
      newErrors.surgeryDate = 'Please enter the surgery date';
    if (!formData.procedureName.trim())
      newErrors.procedureName = 'Please enter the procedure name';
    if (!formData.procedureType)
      newErrors.procedureType = 'Please select a procedure type';
    return newErrors;
  };

  // ── Submit ──────────────────────────────────────────────────────────────
  const handleSubmit = (e) => {
    e.preventDefault();
    const newErrors = validate();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setIsSaving(true);

    // Convert free-text relatedConditions into the structured array format.
    // Each comma-separated entry becomes { label, categoryId: null }.
    // categoryId is null now (Option 1); reserved for Option 2 structured linking.
    const relatedConditionsArray = formData.relatedConditions
    .split(',')
    .map(s => s.trim())
    .filter(Boolean)
    .map(label => ({ label, categoryId: null }));

    const surgeryPayload = {
      ...formData,
      relatedConditions: relatedConditionsArray,
    };

    // If an overrideSave handler was provided (edit modal), delegate to it.
    // Otherwise call saveSurgery directly (add new flow).
    if (overrideSave) {
      overrideSave(surgeryPayload);
      setIsSaving(false);
      onSaved?.();
    } else {
      const saved = saveSurgery(surgeryPayload);
      setIsSaving(false);
      if (saved) {
        onSaved?.();
      } else {
        setErrors({ submit: 'Failed to save. Please try again.' });
      }
    }
  };

  // ── Shared input class helpers ──────────────────────────────────────────
  const inputClass = (field) =>
      `w-full p-3 border rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white
     focus:outline-none focus:ring-2 focus:ring-blue-500
     ${errors[field]
          ? 'border-red-500'
          : 'border-gray-300 dark:border-gray-600'}`;

  const labelClass = 'block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1';

  // ── Render ──────────────────────────────────────────────────────────────
  return (
      <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm">
        <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
          🏥 {initialData ? 'Edit Surgery Record' : 'Add Surgery Record'}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">

          {/* ── Row: Date + Procedure Type ── */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className={labelClass}>
                Surgery Date <span className="text-red-500">*</span>
              </label>
              <input
                  type="date"
                  value={formData.surgeryDate}
                  onChange={(e) => handleChange('surgeryDate', e.target.value)}
                  className={inputClass('surgeryDate')}
              />
              {errors.surgeryDate && (
                  <p className="text-red-500 dark:text-red-400 text-sm mt-1">
                    {errors.surgeryDate}
                  </p>
              )}
            </div>

            <div>
              <label className={labelClass}>
                Type <span className="text-red-500">*</span>
              </label>
              <select
                  value={formData.procedureType}
                  onChange={(e) => handleChange('procedureType', e.target.value)}
                  className={inputClass('procedureType')}
              >
                <option value="">Select type…</option>
                {PROCEDURE_TYPES.map(t => (
                    <option key={t.value} value={t.value}>{t.label}</option>
                ))}
              </select>
              {errors.procedureType && (
                  <p className="text-red-500 dark:text-red-400 text-sm mt-1">
                    {errors.procedureType}
                  </p>
              )}
            </div>
          </div>

          {/* ── Procedure Name ── */}
          <div>
            <label className={labelClass}>
              Procedure Name <span className="text-red-500">*</span>
            </label>
            <input
                type="text"
                value={formData.procedureName}
                onChange={(e) => handleChange('procedureName', e.target.value)}
                placeholder="e.g., Right hip arthroscopy, Appendectomy"
                className={inputClass('procedureName')}
            />
            {errors.procedureName && (
                <p className="text-red-500 dark:text-red-400 text-sm mt-1">
                  {errors.procedureName}
                </p>
            )}
          </div>

          {/* ── Row: Surgeon + Facility ── */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className={labelClass}>Surgeon</label>
              <input
                  type="text"
                  value={formData.surgeonName}
                  onChange={(e) => handleChange('surgeonName', e.target.value)}
                  placeholder="Dr. Smith"
                  className={inputClass('surgeonName')}
              />
            </div>
            <div>
              <label className={labelClass}>Facility</label>
              <input
                  type="text"
                  value={formData.facility}
                  onChange={(e) => handleChange('facility', e.target.value)}
                  placeholder="VA Medical Center, etc."
                  className={inputClass('facility')}
              />
            </div>
          </div>

          {/* ── Anesthesia Type ── */}
          <div>
            <label className={labelClass}>Anesthesia Type</label>
            <select
                value={formData.anesthesiaType}
                onChange={(e) => handleChange('anesthesiaType', e.target.value)}
                className={inputClass('anesthesiaType')}
            >
              <option value="">Select anesthesia…</option>
              {ANESTHESIA_TYPES.map(t => (
                  <option key={t.value} value={t.value}>{t.label}</option>
              ))}
            </select>
          </div>

          {/* ── Related SC Condition ── */}
          {/* Free-text for now; comma-separate multiple conditions.
            Stored as [{ label, categoryId: null }] for future structured linking. */}
          <div>
            <label className={labelClass}>Related Service-Connected Condition(s)</label>
            <input
                type="text"
                value={formData.relatedConditions}
                onChange={(e) => handleChange('relatedConditions', e.target.value)}
                placeholder="e.g., Right hip, Sleep apnea (comma-separate multiple)"
                className={inputClass('relatedConditions')}
            />
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              Links this surgery to your VA claim. Separate multiple conditions with commas.
            </p>
          </div>

          {/* ── Pre-Op Diagnosis ── */}
          <div>
            <label className={labelClass}>Pre-Op Diagnosis</label>
            <textarea
                value={formData.preOpDiagnosis}
                onChange={(e) => handleChange('preOpDiagnosis', e.target.value)}
                placeholder="Diagnosis documented before surgery…"
                rows={2}
                className={inputClass('preOpDiagnosis')}
            />
          </div>

          {/* ── Complications ── */}
          <div>
            <label className={labelClass}>Complications</label>
            <textarea
                value={formData.complications}
                onChange={(e) => handleChange('complications', e.target.value)}
                placeholder="Any complications during or after surgery…"
                rows={2}
                className={inputClass('complications')}
            />
          </div>

          {/* ── Recovery Notes ── */}
          <div>
            <label className={labelClass}>Recovery Notes</label>
            <textarea
                value={formData.recoveryNotes}
                onChange={(e) => handleChange('recoveryNotes', e.target.value)}
                placeholder="Recovery timeline, restrictions, physical therapy, ongoing issues…"
                rows={3}
                className={inputClass('recoveryNotes')}
            />
          </div>

          {/* ── Follow-Up ── */}
          <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-3 space-y-3">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                  type="checkbox"
                  checked={formData.followUpRequired}
                  onChange={(e) => handleChange('followUpRequired', e.target.checked)}
                  className="w-4 h-4 text-blue-600 rounded"
              />
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Follow-up required
            </span>
            </label>

            {formData.followUpRequired && (
                <div>
                  <label className={labelClass}>Follow-Up Date</label>
                  <input
                      type="date"
                      value={formData.followUpDate}
                      onChange={(e) => handleChange('followUpDate', e.target.value)}
                      className={inputClass('followUpDate')}
                  />
                </div>
            )}
          </div>

          {/* ── Submit error ── */}
          {errors.submit && (
              <p className="text-red-500 dark:text-red-400 text-sm">{errors.submit}</p>
          )}

          {/* ── Action buttons ── */}
          <div className="flex gap-3 pt-2">
            <button
                type="submit"
                disabled={isSaving}
                className="flex-1 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400
                       text-white font-medium rounded-lg transition-colors"
            >
              {isSaving ? 'Saving…' : initialData ? 'Update Record' : 'Save Surgery Record'}
            </button>
            {onCancel && (
                <button
                    type="button"
                    onClick={onCancel}
                    className="flex-1 py-3 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200
                         dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300
                         font-medium rounded-lg transition-colors"
                >
                  Cancel
                </button>
            )}
          </div>

        </form>
      </div>
  );
};

export default SurgeryForm;