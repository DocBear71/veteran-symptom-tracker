import React, { useState, useMemo } from 'react';
import { useProfile } from '../hooks/useProfile';
import { PROTECTED_ENVIRONMENT_INDICATORS } from '../utils/tdiuEligibility';

/**
 * EmployerLetterGenerator
 *
 * Generates a draft letter the veteran can give to their employer (or a
 * supervisor) to fill out. The letter is structured to capture the elements
 * VA expects in protected-environment evidence per M21-1 and Cantrell v.
 * Shulkin (28 Vet. App. 382, 2017).
 *
 * The veteran fills in basic context; the employer fills in the substantive
 * accommodations. Output supports clipboard copy and print/PDF (via the
 * browser's native print → save-as-PDF flow, which works on all platforms
 * without bundling another PDF library).
 *
 * Inputs come from the existing employmentStatus profile data if available,
 * but the user can override anything before exporting.
 */
const EmployerLetterGenerator = ({ employmentStatus, onClose }) => {
  const { profile } = useProfile();

  // ============================================
  // Form state — pre-filled from existing employment status when present
  // ============================================
  const [veteranName, setVeteranName] = useState(profile?.name || '');
  const [employerName, setEmployerName] = useState(
      employmentStatus?.employerName || ''
  );
  const [supervisorName, setSupervisorName] = useState('');
  const [supervisorTitle, setSupervisorTitle] = useState('');
  const [jobTitle, setJobTitle] = useState('');
  const [employmentStart, setEmploymentStart] = useState(
      employmentStatus?.startDate || ''
  );
  const [today] = useState(new Date().toISOString().split('T')[0]);

  // Pull the labels for the user's selected qualifying accommodations so the
  // letter mentions the right ones for the employer to address.
  const selectedAccommodations = useMemo(() => {
    const ids = employmentStatus?.accommodations || [];
    return PROTECTED_ENVIRONMENT_INDICATORS.qualifying
    .filter(q => ids.includes(q.id))
    .map(q => q.label);
  }, [employmentStatus]);

  // ============================================
  // Letter body — built from the user's input
  // ============================================
  const letterText = useMemo(() => {
    const lines = [];
    lines.push(`${today}`);
    lines.push('');
    lines.push('U.S. Department of Veterans Affairs');
    lines.push('Re: Statement of employment circumstances for veteran:');
    lines.push(`    ${veteranName || '[VETERAN NAME]'}`);
    lines.push('');
    lines.push('To Whom It May Concern:');
    lines.push('');
    lines.push(
        `I am ${supervisorName || '[SUPERVISOR NAME]'}, ${supervisorTitle || '[TITLE]'} at ${employerName || '[EMPLOYER NAME]'}. I am writing to document the employment circumstances of ${veteranName || '[VETERAN NAME]'}, who has worked here as ${jobTitle || '[JOB TITLE]'} since ${employmentStart || '[START DATE]'}.`
    );
    lines.push('');
    lines.push(
        'This veteran has service-connected disabilities. The accommodations described below are made specifically because of those disabilities and would not be extended to a non-disabled employee in a competitive employment setting.'
    );
    lines.push('');
    lines.push('Accommodations provided:');

    if (selectedAccommodations.length > 0) {
      selectedAccommodations.forEach(label => {
        lines.push(`  • ${label}`);
      });
    } else {
      lines.push('  • [List specific accommodations — e.g., flexible schedule, excused absences, reduced productivity standards]');
    }

    lines.push('');
    lines.push(
        'Without these accommodations, the veteran would likely not be able to maintain employment in a competitive setting. The relationship described above and the latitude extended to this employee differ materially from what would be tolerated for a non-disabled employee in the open labor market.'
    );
    lines.push('');
    lines.push('I am willing to be contacted to verify any of the above.');
    lines.push('');
    lines.push('Sincerely,');
    lines.push('');
    lines.push('');
    lines.push(`${supervisorName || '[SUPERVISOR NAME]'}`);
    lines.push(`${supervisorTitle || '[TITLE]'}`);
    lines.push(`${employerName || '[EMPLOYER NAME]'}`);
    lines.push('Contact: __________________________');
    lines.push('Date signed: ______________________');

    return lines.join('\n');
  }, [
    today, veteranName, supervisorName, supervisorTitle,
    employerName, jobTitle, employmentStart, selectedAccommodations,
  ]);

  // ============================================
  // Actions
  // ============================================
  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(letterText);
      alert('Letter copied to clipboard.');
    } catch (e) {
      // Clipboard API can fail in older browsers / insecure contexts; fall back.
      const ta = document.createElement('textarea');
      ta.value = letterText;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand('copy');
      document.body.removeChild(ta);
      alert('Letter copied to clipboard.');
    }
  };

  const handlePrint = () => {
    // Open a clean print window with just the letter — avoids printing the
    // surrounding app chrome. Browser's print dialog can save to PDF.
    const w = window.open('', '_blank');
    if (!w) {
      alert('Pop-up blocked. Please allow pop-ups for this site to print.');
      return;
    }
    w.document.write(`
      <html>
        <head>
          <title>Employer Statement - ${veteranName || 'Veteran'}</title>
          <style>
            body { font-family: 'Times New Roman', serif; font-size: 12pt; max-width: 6.5in; margin: 1in auto; line-height: 1.5; white-space: pre-wrap; }
            @media print { body { margin: 0.75in; } }
          </style>
        </head>
        <body>${letterText.replace(/[&<>]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;' }[c]))}</body>
      </html>
    `);
    w.document.close();
    w.focus();
    w.print();
  };

  return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white dark:bg-gray-800 rounded-lg w-full max-w-3xl max-h-[90vh] overflow-y-auto">
          {/* Header */}
          <div className="p-4 border-b border-gray-200 dark:border-gray-700 sticky top-0 bg-white dark:bg-gray-800 z-10">
            <div className="flex justify-between items-start">
              <div>
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                  📨 Employer Letter Generator
                </h2>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Draft a statement for your employer to complete and sign
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

          <div className="p-4 space-y-4">
            {/* Guidance */}
            <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-3">
              <p className="text-xs text-blue-900 dark:text-blue-200">
                ℹ️ This generates a draft letter you can give to your supervisor or HR. They fill in details and sign. The structure is aligned with what VA expects to see in protected-environment evidence (Cantrell v. Shulkin, M21-1).
              </p>
            </div>

            {/* Fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <Field label="Your name" value={veteranName} onChange={setVeteranName} />
              <Field label="Employer name" value={employerName} onChange={setEmployerName} placeholder="Company / business" />
              <Field label="Supervisor name" value={supervisorName} onChange={setSupervisorName} placeholder="Person signing letter" />
              <Field label="Supervisor title" value={supervisorTitle} onChange={setSupervisorTitle} placeholder="e.g., Manager, Owner" />
              <Field label="Your job title" value={jobTitle} onChange={setJobTitle} placeholder="e.g., Maintenance Tech" />
              <Field label="Employment start date" value={employmentStart} onChange={setEmploymentStart} type="date" />
            </div>

            {/* Accommodations reminder */}
            {selectedAccommodations.length === 0 && (
                <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg p-3">
                  <p className="text-xs text-amber-900 dark:text-amber-200">
                    ⚠ You haven't checked any qualifying accommodations in your employment status. The letter will show a placeholder for the employer to fill in. For best results, edit your employment status first and select the accommodations that apply.
                  </p>
                </div>
            )}

            {/* Preview */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Letter preview
              </label>
              <textarea
                  value={letterText}
                  readOnly
                  rows={18}
                  className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 font-mono text-xs"
              />
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                You can copy and edit this in your word processor before printing, or print directly.
              </p>
            </div>
          </div>

          {/* Actions */}
          <div className="p-4 border-t border-gray-200 dark:border-gray-700 flex gap-2 sticky bottom-0 bg-white dark:bg-gray-800">
            <button
                onClick={onClose}
                className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700"
            >
              Close
            </button>
            <button
                onClick={handleCopy}
                className="flex-1 py-2 px-4 bg-gray-700 dark:bg-gray-600 text-white rounded-lg hover:bg-gray-800 dark:hover:bg-gray-500"
            >
              📋 Copy
            </button>
            <button
                onClick={handlePrint}
                className="flex-1 py-2 px-4 bg-blue-900 dark:bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-800 dark:hover:bg-blue-700"
            >
              🖨 Print / Save as PDF
            </button>
          </div>
        </div>
      </div>
  );
};

/**
 * Small reusable field component.
 */
const Field = ({ label, value, onChange, placeholder, type = 'text' }) => (
    <div>
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
        {label}
      </label>
      <input
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
      />
    </div>
);

export default EmployerLetterGenerator;