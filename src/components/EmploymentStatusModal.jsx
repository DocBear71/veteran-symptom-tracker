import React, { useState } from 'react';
import { useProfile } from '../hooks/useProfile';
import { setEmploymentStatus } from '../utils/profiles';
import {
  PROTECTED_ENVIRONMENT_INDICATORS,
  CURRENT_POVERTY_THRESHOLD,
  CURRENT_POVERTY_THRESHOLD_YEAR,
} from '../utils/tdiuEligibility';

/**
 * EmploymentStatusModal
 *
 * Modal for editing the veteran's current employment status, accommodations,
 * and supporting evidence. Mirrors the TDIUStatusModal pattern.
 *
 * Sections:
 *   1. Current employment basics (employed yes/no, employer type, income)
 *   2. Accommodations checklist (qualifying + non-qualifying)
 *   3. Evidence collection checklist
 *   4. Notes
 *
 * The data shape stored aligns with what analyzeMarginalEmployment() and
 * analyzeProtectedEnvironment() in tdiuEligibility.js expect to consume.
 */
const EmploymentStatusModal = ({ initialStatus, onClose }) => {
  const { profile } = useProfile();
  const isEditing = !!initialStatus;

  // ============================================
  // Form state — pre-populated from initialStatus when editing
  // ============================================
  const [currentlyEmployed, setCurrentlyEmployed] = useState(
      initialStatus?.currentlyEmployed !== false // default to true
  );
  const [employerType, setEmployerType] = useState(
      initialStatus?.employerType || 'competitive'
  );
  const [startDate, setStartDate] = useState(initialStatus?.startDate || '');
  const [lastEmployedDate, setLastEmployedDate] = useState(
      initialStatus?.lastEmployedDate || ''
  );
  const [annualIncome, setAnnualIncome] = useState(
      initialStatus?.annualIncome !== undefined
          ? String(initialStatus.annualIncome)
          : ''
  );
  const [overThresholdSince, setOverThresholdSince] = useState(
      initialStatus?.overThresholdSince || ''
  );
  const [accommodations, setAccommodations] = useState(
      Array.isArray(initialStatus?.accommodations)
          ? initialStatus.accommodations
          : []
  );
  const [evidence, setEvidence] = useState({
    employerLetter: initialStatus?.evidence?.employerLetter || false,
    attendanceRecords: initialStatus?.evidence?.attendanceRecords || false,
    coworkerStatements: initialStatus?.evidence?.coworkerStatements || false,
    jobDescription: initialStatus?.evidence?.jobDescription || false,
    vocationalOpinion: initialStatus?.evidence?.vocationalOpinion || false,
    medicalNexus: initialStatus?.evidence?.medicalNexus || false,
  });
  const [notes, setNotes] = useState(initialStatus?.notes || '');

  // ============================================
  // Derived values — live feedback while editing
  // ============================================
  const incomeNum = parseFloat(annualIncome) || 0;
  const overThreshold = incomeNum > CURRENT_POVERTY_THRESHOLD;

  // ============================================
  // Handlers
  // ============================================
  const toggleAccommodation = (id) => {
    setAccommodations(prev =>
        prev.includes(id)
            ? prev.filter(a => a !== id)
            : [...prev, id]
    );
  };

  const toggleEvidence = (key) => {
    setEvidence(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const handleSave = () => {
    if (!profile?.id) {
      alert('No active profile.');
      return;
    }

    const payload = {
      currentlyEmployed,
      employerType: currentlyEmployed ? employerType : (employerType || 'competitive'),
      startDate: currentlyEmployed ? startDate : '',
      lastEmployedDate: !currentlyEmployed ? lastEmployedDate : '',
      annualIncome: currentlyEmployed ? incomeNum : 0,
      overThresholdSince: currentlyEmployed && overThreshold ? overThresholdSince : null,
      accommodations,
      evidence,
      notes: notes.trim(),
    };

    const result = setEmploymentStatus(profile.id, payload);
    if (result.success) {
      onClose();
    } else {
      alert(result.message || 'Failed to save employment status');
    }
  };

  return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white dark:bg-gray-800 rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
          {/* ============================================ */}
          {/* HEADER                                       */}
          {/* ============================================ */}
          <div className="p-4 border-b border-gray-200 dark:border-gray-700 sticky top-0 bg-white dark:bg-gray-800 z-10">
            <div className="flex justify-between items-start">
              <div>
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                  {isEditing ? 'Edit Employment Status' : 'Add Employment Status'}
                </h2>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  For TDIU marginal employment / protected environment analysis
                </p>
              </div>
              <button
                  onClick={onClose}
                  className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 text-xl"
                  aria-label="Close"
              >
                ✕
              </button>
            </div>
          </div>

          <div className="p-4 space-y-5">
            {/* ============================================ */}
            {/* SECTION 1: BASIC EMPLOYMENT INFO             */}
            {/* ============================================ */}
            <div>
              <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-2">
                1. Current Employment
              </h3>

              {/* Currently employed toggle */}
              <div className="space-y-2 mb-3">
                <label
                    className={`flex items-start gap-3 p-3 rounded-lg border-2 cursor-pointer transition-all ${
                        currentlyEmployed
                            ? 'bg-blue-100 dark:bg-blue-900/30 border-blue-400 dark:border-blue-600'
                            : 'bg-white dark:bg-gray-700 border-gray-200 dark:border-gray-600'
                    }`}
                >
                  <input
                      type="radio"
                      name="currently-employed"
                      checked={currentlyEmployed === true}
                      onChange={() => setCurrentlyEmployed(true)}
                      className="mt-1 w-4 h-4 text-blue-600"
                  />
                  <div className="flex-1">
                    <span className="font-medium text-gray-900 dark:text-gray-100">
                      Currently employed
                    </span>
                  </div>
                </label>

                <label
                    className={`flex items-start gap-3 p-3 rounded-lg border-2 cursor-pointer transition-all ${
                        !currentlyEmployed
                            ? 'bg-blue-100 dark:bg-blue-900/30 border-blue-400 dark:border-blue-600'
                            : 'bg-white dark:bg-gray-700 border-gray-200 dark:border-gray-600'
                    }`}
                >
                  <input
                      type="radio"
                      name="currently-employed"
                      checked={currentlyEmployed === false}
                      onChange={() => setCurrentlyEmployed(false)}
                      className="mt-1 w-4 h-4 text-blue-600"
                  />
                  <div className="flex-1">
                    <span className="font-medium text-gray-900 dark:text-gray-100">
                      Not currently employed
                    </span>
                  </div>
                </label>
              </div>

              {/* Conditional: Currently employed fields */}
              {currentlyEmployed && (
                  <div className="space-y-3 pl-3 border-l-2 border-blue-200 dark:border-blue-800">
                    {/* Employer type */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Employer type
                      </label>
                      <select
                          value={employerType}
                          onChange={(e) => setEmployerType(e.target.value)}
                          className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      >
                        <option value="competitive">Competitive employment</option>
                        <option value="family-business">Family-owned business</option>
                        <option value="sheltered-workshop">Sheltered workshop</option>
                        <option value="self-employed">Self-employed</option>
                        <option value="other">Other</option>
                      </select>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                        Employer type alone does not determine protected-environment status — the accommodations matter more.
                      </p>
                    </div>

                    {/* Start date */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Start date
                      </label>
                      <input
                          type="date"
                          value={startDate}
                          onChange={(e) => setStartDate(e.target.value)}
                          className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      />
                    </div>

                    {/* Annual income */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Gross annual income ($)
                      </label>
                      <input
                          type="number"
                          min="0"
                          step="100"
                          value={annualIncome}
                          onChange={(e) => setAnnualIncome(e.target.value)}
                          placeholder="0"
                          className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      />
                      {/* Live threshold feedback */}
                      {incomeNum > 0 && (
                          <p className={`text-xs mt-1 ${
                              overThreshold
                                  ? 'text-amber-700 dark:text-amber-400'
                                  : 'text-green-700 dark:text-green-400'
                          }`}>
                            {overThreshold
                                ? `⚠ Above ${CURRENT_POVERTY_THRESHOLD_YEAR} Census poverty threshold ($${CURRENT_POVERTY_THRESHOLD.toLocaleString()}). May not be marginal under income test alone.`
                                : `✓ Below ${CURRENT_POVERTY_THRESHOLD_YEAR} Census poverty threshold ($${CURRENT_POVERTY_THRESHOLD.toLocaleString()}). Income test suggests marginal employment.`}
                          </p>
                      )}
                    </div>

                    {/* Over-threshold since (only relevant if above threshold) */}
                    {overThreshold && (
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Earnings have been above threshold since
                          </label>
                          <input
                              type="date"
                              value={overThresholdSince}
                              onChange={(e) => setOverThresholdSince(e.target.value)}
                              className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                          />
                          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                            VA may send a VA Form 21-4140 (Employment Questionnaire) after approximately 12 months above threshold. Used to flag that window.
                          </p>
                        </div>
                    )}
                  </div>
              )}

              {/* Conditional: Not currently employed */}
              {!currentlyEmployed && (
                  <div className="pl-3 border-l-2 border-gray-200 dark:border-gray-700">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Last day employed (optional)
                    </label>
                    <input
                        type="date"
                        value={lastEmployedDate}
                        onChange={(e) => setLastEmployedDate(e.target.value)}
                        className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    />
                  </div>
              )}
            </div>

            {/* ============================================ */}
            {/* SECTION 2: ACCOMMODATIONS                    */}
            {/* ============================================ */}
            {currentlyEmployed && (
                <div>
                  <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-2">
                    2. Accommodations Received
                  </h3>
                  <p className="text-xs text-gray-600 dark:text-gray-400 mb-3">
                    Check each accommodation your employer makes that relates to your service-connected conditions. Each one must be tied to an SC condition to count toward protected-environment analysis.
                  </p>

                  {/* Qualifying indicators */}
                  <div className="mb-4">
                    <p className="text-xs font-semibold text-gray-700 dark:text-gray-300 mb-2 uppercase tracking-wide">
                      May support protected-environment finding
                    </p>
                    <div className="space-y-1.5">
                      {PROTECTED_ENVIRONMENT_INDICATORS.qualifying.map(item => (
                          <label
                              key={item.id}
                              className={`flex items-start gap-2 p-2 rounded cursor-pointer transition-all ${
                                  accommodations.includes(item.id)
                                      ? 'bg-amber-50 dark:bg-amber-900/20 border border-amber-300 dark:border-amber-700'
                                      : 'hover:bg-gray-50 dark:hover:bg-gray-700/50 border border-transparent'
                              }`}
                          >
                            <input
                                type="checkbox"
                                checked={accommodations.includes(item.id)}
                                onChange={() => toggleAccommodation(item.id)}
                                className="mt-0.5 w-4 h-4 text-amber-600 rounded"
                            />
                            <span className="text-sm text-gray-900 dark:text-gray-100">
                              {item.label}
                            </span>
                          </label>
                      ))}
                    </div>
                  </div>

                  {/* Non-qualifying indicators */}
                  <div>
                    <p className="text-xs font-semibold text-gray-700 dark:text-gray-300 mb-2 uppercase tracking-wide">
                      Does NOT alone qualify as protected environment
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mb-2 italic">
                      Track these for context, but understand they don't carry weight on their own.
                    </p>
                    <div className="space-y-1.5">
                      {PROTECTED_ENVIRONMENT_INDICATORS.nonQualifying.map(item => (
                          <label
                              key={item.id}
                              className={`flex items-start gap-2 p-2 rounded cursor-pointer transition-all ${
                                  accommodations.includes(item.id)
                                      ? 'bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600'
                                      : 'hover:bg-gray-50 dark:hover:bg-gray-700/50 border border-transparent'
                              }`}
                          >
                            <input
                                type="checkbox"
                                checked={accommodations.includes(item.id)}
                                onChange={() => toggleAccommodation(item.id)}
                                className="mt-0.5 w-4 h-4 text-gray-600 rounded"
                            />
                            <span className="text-sm text-gray-900 dark:text-gray-100">
                              {item.label}
                            </span>
                          </label>
                      ))}
                    </div>
                  </div>
                </div>
            )}

            {/* ============================================ */}
            {/* SECTION 3: EVIDENCE COLLECTED                */}
            {/* ============================================ */}
            {currentlyEmployed && (
                <div>
                  <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-2">
                    3. Evidence Collected
                  </h3>
                  <p className="text-xs text-gray-600 dark:text-gray-400 mb-3">
                    Track which supporting documents you have. Cantrell v. Shulkin requires VA to address evidence of protected-environment status — build the record.
                  </p>

                  <div className="space-y-1.5">
                    <EvidenceCheckbox
                        checked={evidence.employerLetter}
                        onChange={() => toggleEvidence('employerLetter')}
                        label="Detailed employer letter"
                        importance="critical"
                    />
                    <EvidenceCheckbox
                        checked={evidence.attendanceRecords}
                        onChange={() => toggleEvidence('attendanceRecords')}
                        label="Attendance / payroll records"
                        importance="high"
                    />
                    <EvidenceCheckbox
                        checked={evidence.coworkerStatements}
                        onChange={() => toggleEvidence('coworkerStatements')}
                        label="Coworker or supervisor statements"
                        importance="medium"
                    />
                    <EvidenceCheckbox
                        checked={evidence.jobDescription}
                        onChange={() => toggleEvidence('jobDescription')}
                        label="Written job description showing duties excused"
                        importance="medium"
                    />
                    <EvidenceCheckbox
                        checked={evidence.vocationalOpinion}
                        onChange={() => toggleEvidence('vocationalOpinion')}
                        label="Vocational expert opinion"
                        importance="medium"
                    />
                    <EvidenceCheckbox
                        checked={evidence.medicalNexus}
                        onChange={() => toggleEvidence('medicalNexus')}
                        label="Medical nexus tying accommodations to SC conditions"
                        importance="high"
                    />
                  </div>
                </div>
            )}

            {/* ============================================ */}
            {/* SECTION 4: NOTES                             */}
            {/* ============================================ */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Notes (optional)
              </label>
              <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="e.g., specific incidents, dates of accommodations, related medical records..."
                  rows={3}
                  className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* ============================================ */}
          {/* FOOTER                                       */}
          {/* ============================================ */}
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
              {isEditing ? 'Save Changes' : 'Save Employment Status'}
            </button>
          </div>
        </div>
      </div>
  );
};

/**
 * Small internal helper component for evidence checkboxes with importance badge.
 */
const EvidenceCheckbox = ({ checked, onChange, label, importance }) => {
  const importanceColors = {
    critical: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
    high: 'bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200',
    medium: 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200',
  };

  return (
      <label
          className={`flex items-start gap-2 p-2 rounded cursor-pointer transition-all ${
              checked
                  ? 'bg-green-50 dark:bg-green-900/20 border border-green-300 dark:border-green-700'
                  : 'hover:bg-gray-50 dark:hover:bg-gray-700/50 border border-transparent'
          }`}
      >
        <input
            type="checkbox"
            checked={checked}
            onChange={onChange}
            className="mt-0.5 w-4 h-4 text-green-600 rounded"
        />
        <div className="flex-1 flex items-start justify-between gap-2">
          <span className="text-sm text-gray-900 dark:text-gray-100">{label}</span>
          <span className={`text-xs px-1.5 py-0.5 rounded font-medium whitespace-nowrap ${importanceColors[importance]}`}>
            {importance}
          </span>
        </div>
      </label>
  );
};

export default EmploymentStatusModal;