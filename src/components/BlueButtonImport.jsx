/**
 * BlueButtonImport.jsx
 * Doc Bear's Symptom Vault — Blue Button Smart Import Wizard
 *
 * Phase 0: File upload + validation
 * Phase 1: Section detection + date range selection
 * Phase 2: Parsing, preview, conflict detection, import execution
 *
 * All parsing is on-device. The file never leaves the browser.
 */

import { useState, useCallback, useRef } from 'react';
import {
  validateBluebuttonFile,
  getSectionDateRange,
  parseVitals,
  parseLabs,
  parseConditions,
  parseMedications,
  parseAppointments,
  SECTION_LABELS,
  IMPORTABLE_SECTIONS,
  SECTION_KEYS,
  formatDateForDisplay,
  toISOString,
} from '../utils/bluebuttonParser';
import { saveMeasurement, getMeasurements } from '../utils/measurements';
import { saveAppointment, getAppointments, addCustomSymptom } from '../utils/storage';

// ─────────────────────────────────────────────────────────────
// CONSTANTS
// ─────────────────────────────────────────────────────────────

const WIZARD_STEPS = { UPLOAD: 0, SELECT: 1, PREVIEW: 2, COMPLETE: 3 };

const DEFAULT_SELECTED_SECTIONS = [
  SECTION_KEYS.LABS,
  SECTION_KEYS.CARE_NOTES,
  SECTION_KEYS.CONDITIONS,
  SECTION_KEYS.MEDICATIONS,
  SECTION_KEYS.APPOINTMENTS,
];

// Maps parsed vital/lab types to Vault measurementType strings
const VAULT_TYPE_MAP = {
  'weight':         'weight',
  'blood-pressure': 'blood-pressure',
  'heart-rate':     null,
  'pulse-ox':       'oxygen-saturation',
  'pain':           'pain-score',
  'hba1c':          'hba1c',
  'blood-glucose':  'blood-glucose',
};

const TYPE_LABELS = {
  'weight':         '⚖️ Weight',
  'blood-pressure': '🩺 Blood Pressure',
  'heart-rate':     '💓 Heart Rate',
  'pulse-ox':       '🫁 Pulse Ox (SpO₂)',
  'pain':           '😣 Pain Score',
  'hba1c':          '🩸 HbA1c (A1C)',
  'blood-glucose':  '🩸 Blood Glucose',
};

// ─────────────────────────────────────────────────────────────
// MAIN COMPONENT
// ─────────────────────────────────────────────────────────────

export default function BlueButtonImport({ onClose, onImportComplete }) {
  const [step, setStep] = useState(WIZARD_STEPS.UPLOAD);
  const [, setFileText] = useState(null);
  const [reportInfo, setReportInfo] = useState(null);
  const [validationError, setValidationError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [loadProgress, setLoadProgress] = useState(0);

  // Phase 1
  const [sectionData, setSectionData] = useState(null);
  const [sectionRanges, setSectionRanges] = useState({});
  const [selectedSections, setSelectedSections] = useState(DEFAULT_SELECTED_SECTIONS);
  const [dateRangeStart, setDateRangeStart] = useState('');
  const [dateRangeEnd, setDateRangeEnd] = useState('');

  // Phase 2
  const [parsedData, setParsedData] = useState(null);
  const [recordStates, setRecordStates] = useState({});
  const [isParsing, setIsParsing] = useState(false);
  const [importResult, setImportResult] = useState(null);

  const fileInputRef = useRef(null);

  // ── Step 0 ────────────────────────────────────────────────

  const handleFileSelect = useCallback((file) => {
    if (!file) return;
    if (!file.name.endsWith('.txt') && file.type !== 'text/plain') {
      setValidationError('Please upload a plain text (.txt) file. On VA.gov Review Medical Records, choose "Text File" when downloading.');
      return;
    }
    setValidationError(null);
    setIsLoading(true);
    setLoadProgress(0);

    const _buildSectionData = (text, detected) => {
      const { sectionMap } = detected;
      const ranges = {};
      Object.entries(sectionMap).forEach(([key, section]) => {
        ranges[key] = getSectionDateRange(section.rawText, key);
      });
      setSectionData(detected);
      setSectionRanges(ranges);

      let earliest = null;
      let latest = null;
      Object.values(ranges).forEach(({ start, end }) => {
        if (start && (!earliest || start < earliest)) earliest = start;
        if (end && (!latest || end > latest)) latest = end;
      });
      if (earliest) setDateRangeStart(toISOString(earliest));
      if (latest) setDateRangeEnd(toISOString(latest));
    };

    const reader = new FileReader();
    reader.onprogress = (e) => {
      if (e.lengthComputable) setLoadProgress(Math.round((e.loaded / e.total) * 100));
    };
    reader.onload = (e) => {
      const text = e.target.result;
      const validation = validateBluebuttonFile(text);
      if (!validation.valid) {
        setValidationError(validation.reason);
        setIsLoading(false);
        return;
      }
      setFileText(text);
      setReportInfo(validation.reportInfo);
      setIsLoading(false);
      setLoadProgress(100);
      setTimeout(() => setStep(WIZARD_STEPS.SELECT), 300);
      _buildSectionData(text, validation.reportInfo.detectedSections);
    };
    reader.onerror = () => {
      setValidationError('Failed to read the file. Please try again.');
      setIsLoading(false);
    };
    reader.readAsText(file);
  }, []);


  const handleFileDrop = useCallback((e) => {
    e.preventDefault();
    handleFileSelect(e.dataTransfer.files[0]);
  }, [handleFileSelect]);

  // ── Step 1 ────────────────────────────────────────────────

  const toggleSection = (key) => {
    setSelectedSections(prev =>
        prev.includes(key) ? prev.filter(k => k !== key) : [...prev, key]
    );
  };

  // ── Step 2 — Parse and build preview ─────────────────────

  const handleProceedToPreview = () => {
    setIsParsing(true);
    setStep(WIZARD_STEPS.PREVIEW);

    // Defer parsing so the loading UI renders first
    setTimeout(() => {
      try {
        const { sectionMap } = sectionData;
        const dateRange = {
          start: dateRangeStart ? new Date(dateRangeStart) : null,
          end: dateRangeEnd ? new Date(dateRangeEnd + 'T23:59:59') : null,
        };

        const allRecords = [];

        if (selectedSections.includes(SECTION_KEYS.CARE_NOTES) && sectionMap[SECTION_KEYS.CARE_NOTES]) {
          const vitals = parseVitals(sectionMap[SECTION_KEYS.CARE_NOTES].rawText, dateRange)
          .map(v => ({ ...v, category: 'vital' }));

          // Merge heart-rate records into their same-visit BP record.
          // BP and Pulse lines in a VITAL SIGNS block share the same timestamp or
          // are within a few minutes of each other. We match within 10 minutes.
          const bpRecords = vitals.filter(v => v.type === 'blood-pressure');
          const hrRecords = vitals.filter(v => v.type === 'heart-rate');
          const otherVitals = vitals.filter(v => v.type !== 'blood-pressure' && v.type !== 'heart-rate');

          hrRecords.forEach(hr => {
            const hrTime = hr.date ? hr.date.getTime() : null;
            // Find the closest BP record within 10 minutes
            let bestBP = null;
            let bestDiff = Infinity;
            bpRecords.forEach(bp => {
              const bpTime = bp.date ? bp.date.getTime() : null;
              if (!hrTime || !bpTime) return;
              const diff = Math.abs(hrTime - bpTime);
              if (diff < bestDiff && diff <= 10 * 60 * 1000) {
                bestDiff = diff;
                bestBP = bp;
              }
            });
            if (bestBP) {
              // Merge heartRate into the BP record — no separate entry needed
              bestBP.values = { ...bestBP.values, heartRate: hr.values.heartRate };
            }
            // If no matching BP found within 10 min, drop the orphan HR record —
            // we have no standalone heart-rate vault type to store it in
          });

          [...bpRecords, ...otherVitals].forEach(v => allRecords.push(v));
        }

        if (selectedSections.includes(SECTION_KEYS.LABS) && sectionMap[SECTION_KEYS.LABS]) {
          parseLabs(sectionMap[SECTION_KEYS.LABS].rawText, dateRange)
          .filter(l => l.vaultType)
          .forEach(l => allRecords.push({ ...l, category: 'lab' }));
        }

        if (selectedSections.includes(SECTION_KEYS.CONDITIONS) && sectionMap[SECTION_KEYS.CONDITIONS]) {
          parseConditions(sectionMap[SECTION_KEYS.CONDITIONS].rawText)
          .forEach(c => allRecords.push({ ...c, category: 'condition', type: 'condition' }));
        }

        if (selectedSections.includes(SECTION_KEYS.MEDICATIONS) && sectionMap[SECTION_KEYS.MEDICATIONS]) {
          parseMedications(sectionMap[SECTION_KEYS.MEDICATIONS].rawText)
          .forEach(m => allRecords.push({ ...m, category: 'medication', type: 'medication' }));
        }

        if (selectedSections.includes(SECTION_KEYS.APPOINTMENTS) && sectionMap[SECTION_KEYS.APPOINTMENTS]) {
          parseAppointments(sectionMap[SECTION_KEYS.APPOINTMENTS].rawText, dateRange)
          .forEach(a => allRecords.push({ ...a, category: 'appointment', type: 'appointment' }));
        }

        // Conflict detection against existing Vault data
        const existingMeasurements = getMeasurements();
        const existingAppointments = getAppointments();

        const initialStates = {};
        allRecords.forEach((record, idx) => {
          const key = `record_${idx}`;
          record._key = key;
          record._conflict = _detectConflict(record, existingMeasurements, existingAppointments);
          // Conflicts are skipped by default; user can toggle to import anyway
          initialStates[key] = record._conflict ? 'conflict-skip' : 'include';
        });

        setParsedData(allRecords);
        setRecordStates(initialStates);
        setIsParsing(false);
      } catch (err) {
        console.error('Parsing error:', err);
        setIsParsing(false);
      }
    }, 50);
  };

  const _detectConflict = (record, existingMeasurements, existingAppointments) => {
    if (record.category === 'vital' || record.category === 'lab') {
      // Heart-rate-only records share the blood-pressure vaultType but carry no
      // systolic/diastolic — comparing them against real BP readings is meaningless
      if (record.type === 'heart-rate') return null;

      // Use same mapping as _importVital for consistent conflict detection
      const vaultType = VAULT_TYPE_MAP[record.type] || record.vaultType;
      if (!vaultType || !record.dateStr) return null;
      const match = existingMeasurements.find(m =>
          m.measurementType === vaultType && m.timestamp?.startsWith(record.dateStr)
      );
      return match ? `A ${vaultType} measurement already exists for ${record.dateStr}` : null;
    }
    if (record.category === 'appointment') {
      const match = existingAppointments.find(a =>
          a.appointmentDate?.startsWith(record.dateStr || '')
      );
      return match ? `An appointment already exists on ${record.dateStr}` : null;
    }
    return null;
  };

  const toggleRecord = (key, currentState) => {
    setRecordStates(prev => {
      const isConflict = parsedData.find(r => r._key === key)?._conflict;
      let next;
      if (isConflict) {
        next = currentState === 'conflict-skip' ? 'conflict-import' : 'conflict-skip';
      } else {
        next = currentState === 'include' ? 'skip' : 'include';
      }
      return { ...prev, [key]: next };
    });
  };

  const toggleCategory = (category, action) => {
    setRecordStates(prev => {
      const next = { ...prev };
      parsedData.forEach(record => {
        if (record.category === category) {
          if (action === 'all') {
            next[record._key] = record._conflict ? 'conflict-import' : 'include';
          } else {
            next[record._key] = record._conflict ? 'conflict-skip' : 'skip';
          }
        }
      });
      return next;
    });
  };

  // ── Import execution ──────────────────────────────────────

  const handleImport = () => {
    const counts = { measurements: 0, appointments: 0, conditions: 0, medications: 0, skipped: 0, errors: 0 };

    parsedData.forEach(record => {
      const state = recordStates[record._key];
      if (state === 'skip' || state === 'conflict-skip') {
        counts.skipped++;
        return;
      }
      try {
        if (record.category === 'vital') { _importVital(record); counts.measurements++; }
        else if (record.category === 'lab') { _importLab(record); counts.measurements++; }
        else if (record.category === 'appointment') { _importAppointment(record); counts.appointments++; }
        else if (record.category === 'condition') { _importCondition(record); counts.conditions++; }
        else if (record.category === 'medication') { counts.medications++; } // reference only
      } catch (err) {
        console.error('Import error for record:', record._key, err);
        counts.errors++;
      }
    });

    _saveImportAuditLog(counts);
    setImportResult(counts);
    setFileText(null); // Discard raw file from memory
    setStep(WIZARD_STEPS.COMPLETE);
    if (onImportComplete) onImportComplete(counts);
  };

  const _importVital = (record) => {
    // VAULT_TYPE_MAP is defined at module level (top of file)
    // Do NOT redeclare it here — that causes a temporal dead zone crash
    const vaultType = VAULT_TYPE_MAP[record.type];
    if (!vaultType) return; // null = heart-rate, pain — skip silently

    // Remap values to correct field keys per vault measurement type
    let vaultValues = record.values;
    if (record.type === 'pulse-ox') {
      vaultValues = { spo2: record.values?.spO2 ?? record.values?.spo2 };
    } else if (record.type === 'pain') {
      // Parser stores pain as values.score, vault field key is painScore
      vaultValues = { painScore: record.values?.score };
    }
    // (heart-rate records are merged into BP records in handleProceedToPreview
    //  and never reach _importVital as standalone records)

    saveMeasurement({
      timestamp: record.date ? record.date.toISOString() : new Date().toISOString(),
      measurementType: vaultType,
      values: vaultValues,
      metadata: {
        source: 'blue-button',
        importedAt: new Date().toISOString(),
      },
      notes: 'Imported from VA Blue Button',
    });
  };

  const _importLab = (record) => {
    if (!record.vaultType) return;
    // Map lab value to the correct field name for each measurement type
    const values = {};
    if (record.vaultType === 'hba1c') values.hba1c = record.value;
    else if (record.vaultType === 'blood-glucose') values.glucose = record.value;
    else values.value = record.value;

    saveMeasurement({
      measurementType: record.vaultType,
      timestamp: record.date ? record.date.toISOString() : new Date().toISOString(),
      values,
      metadata: {
        source: 'blue-button',
        importedAt: new Date().toISOString(),
        unit: record.unit,
        flag: record.flag,
        refRange: record.refRange,
        labName: record.name,
      },
      notes: `Lab result from VA Blue Button${record.flag ? ` (${record.flag})` : ''}`,
    });
  };

  const _importAppointment = (record) => {
    // Map Blue Button parsed fields to AppointmentHistory display schema
    // Display reads: appointmentType, providerName, facility, reasonForVisit, discussed

    // Guess appointmentType from clinic name keywords
    const clinicName = (record.clinic || '').toUpperCase();
    let appointmentType = 'other';
    if (clinicName.includes('MENTAL') || clinicName.includes('PSYCH') ||
        clinicName.includes('BHIP') || clinicName.includes('MH')) {
      appointmentType = 'mental_health';
    } else if (clinicName.includes('PACT') || clinicName.includes('PRIMARY') ||
        clinicName.includes('ALAM') || clinicName.includes('TELEPHONE')) {
      appointmentType = 'primary_care';
    } else if (clinicName.includes('PHYSICAL THERAPY') || clinicName.includes('PT ') ||
        clinicName.includes(' PTA')) {
      appointmentType = 'physical_therapy';
    } else if (clinicName.includes('TELEHEALTH') || clinicName.includes('VIDEO') ||
        clinicName.includes('MOBILE DEVICE')) {
      appointmentType = 'telehealth';
    } else if (clinicName.includes('C&P') || clinicName.includes('COMP') ||
        clinicName.includes('PENSION')) {
      appointmentType = 'cp_exam';
    }

    saveAppointment({
      id: `bb_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`,
      appointmentDate: record.dateStr,
      appointmentTime: record.time || '',
      appointmentType,                          // maps to TYPE_LABELS for badge display
      providerName: '',                         // BB doesn't include provider name
      facility: record.location || '',          // "CEDAR RAPIDS VA CLINIC"
      reasonForVisit: record.clinic || '',      // "CR/BHIP MH SW 2" — best we have
      discussed: '',                            // user fills this in after the fact
      status: record.status || '',              // preserved for reference
      source: 'blue-button',
      createdAt: new Date().toISOString(),
    });
  };

  const _importCondition = (record, index = 0) => {
    // addCustomSymptom uses Date.now() for IDs — calling it synchronously
    // in a loop causes timestamp collisions. We pass an offset so each
    // condition gets a guaranteed-unique ID even when imported at the same ms.
    addCustomSymptom(record.name, 'Imported (VA Problem List)', index);
  };

  const _saveImportAuditLog = (counts) => {
    try {
      const existing = JSON.parse(localStorage.getItem('symptomTracker_bbImportLog') || '[]');
      existing.unshift({
        importedAt: new Date().toISOString(),
        source: 'VA Blue Button',
        counts,
        dateRange: { start: dateRangeStart, end: dateRangeEnd },
        sections: selectedSections,
      });
      localStorage.setItem('symptomTracker_bbImportLog', JSON.stringify(existing.slice(0, 10)));
    } catch (e) {
      console.error('Failed to save import audit log:', e);
    }
  };

  // ─────────────────────────────────────────────────────────
  // RENDER
  // ─────────────────────────────────────────────────────────

  return (
      <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col">

          {/* Header */}
          <div className="bg-blue-900 text-white rounded-t-2xl p-5 flex items-center justify-between flex-shrink-0">
            <div>
              <h2 className="text-xl font-bold">VA Blue Button Import</h2>
              <p className="text-blue-200 text-sm mt-0.5">Smart Import Wizard · Doc Bear's Symptom Vault</p>
            </div>
            <button onClick={onClose} className="text-blue-200 hover:text-white transition-colors text-2xl leading-none" aria-label="Close">×</button>
          </div>

          {/* Privacy banner */}
          <div className="bg-green-50 border-b border-green-200 px-5 py-2 flex items-center gap-2 text-sm text-green-800 flex-shrink-0">
            <span>🔒</span>
            <span><strong>Your file never leaves your device.</strong> All parsing happens in your browser.</span>
          </div>

          {step !== WIZARD_STEPS.COMPLETE && <StepIndicator currentStep={step} />}

          {/* Scrollable content */}
          <div className="flex-1 overflow-y-auto p-6">
            {step === WIZARD_STEPS.UPLOAD && (
                <StepUpload
                    onFileSelect={handleFileSelect}
                    onFileDrop={handleFileDrop}
                    onDragOver={(e) => e.preventDefault()}
                    fileInputRef={fileInputRef}
                    isLoading={isLoading}
                    loadProgress={loadProgress}
                    validationError={validationError}
                />
            )}
            {step === WIZARD_STEPS.SELECT && reportInfo && (
                <StepSelect
                    reportInfo={reportInfo}
                    sectionData={sectionData}
                    sectionRanges={sectionRanges}
                    selectedSections={selectedSections}
                    onToggleSection={toggleSection}
                    dateRangeStart={dateRangeStart}
                    dateRangeEnd={dateRangeEnd}
                    onDateRangeStartChange={setDateRangeStart}
                    onDateRangeEndChange={setDateRangeEnd}
                    onBack={() => setStep(WIZARD_STEPS.UPLOAD)}
                    onNext={handleProceedToPreview}
                />
            )}
            {step === WIZARD_STEPS.PREVIEW && (
                <StepPreview
                    isParsing={isParsing}
                    parsedData={parsedData}
                    recordStates={recordStates}
                    onToggleRecord={toggleRecord}
                    onToggleCategory={toggleCategory}
                    onBack={() => setStep(WIZARD_STEPS.SELECT)}
                    onImport={handleImport}
                />
            )}
            {step === WIZARD_STEPS.COMPLETE && importResult && (
                <StepComplete importResult={importResult} onClose={onClose} />
            )}
          </div>
        </div>
      </div>
  );
}

// ─────────────────────────────────────────────────────────────
// SUB-COMPONENTS
// ─────────────────────────────────────────────────────────────

function StepIndicator({ currentStep }) {
  const steps = ['Upload File', 'Select Data', 'Preview', 'Import'];
  return (
      <div className="flex items-center px-6 pt-4 pb-2 flex-shrink-0">
        {steps.map((label, idx) => (
            <div key={idx} className="flex items-center flex-1 last:flex-none">
              <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0
            ${idx < currentStep ? 'bg-green-600 text-white' : idx === currentStep ? 'bg-blue-900 text-white' : 'bg-gray-200 text-gray-500'}`}>
                {idx < currentStep ? '✓' : idx + 1}
              </div>
              <span className={`ml-1.5 text-xs font-medium whitespace-nowrap
            ${idx === currentStep ? 'text-blue-900' : idx < currentStep ? 'text-green-600' : 'text-gray-400'}`}>
            {label}
          </span>
              {idx < steps.length - 1 && (
                  <div className={`flex-1 h-0.5 mx-2 ${idx < currentStep ? 'bg-green-400' : 'bg-gray-200'}`} />
              )}
            </div>
        ))}
      </div>
  );
}

// ── Step 0 ────────────────────────────────────────────────────

function StepUpload({ onFileSelect, onFileDrop, onDragOver, fileInputRef, isLoading, loadProgress, validationError }) {
  return (
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-1">Upload Your Blue Button Report</h3>
        <p className="text-sm text-gray-600 mb-4">
          Download your Blue Button report from{' '}
          <a href="https://www.va.gov/health-care/review-medical-records/" target="_blank" rel="noopener noreferrer" className="text-blue-700 underline">
            VA.gov → Review Medical Records
          </a>{' '}as a <strong>text file (.txt)</strong>, then upload it here.
        </p>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4 text-sm text-blue-900 text-left">
          <p className="font-semibold mb-2">📋 How to download your Blue Button report:</p>
          <ol className="list-decimal list-inside space-y-1 text-blue-800">
            <li>Go to <strong>va.gov/health-care/review-medical-records</strong> and sign in</li>
            <li>Select <strong>"Go to your medical records"</strong></li>
            <li>Scroll down and select <strong>"Go to download your medical records reports"</strong></li>
            <li>Select <strong>"Select records and download report"</strong></li>
            <li>Step 1 of 3: Choose your date range (select <strong>"All dates"</strong> for best results)</li>
            <li>Step 2 of 3: Select record types — check the following items: </li>
            <ul className="list-disc ml-8 mt-1 mb-1 space-y-0.5">
              <li><strong>Lab and test results</strong></li>
              <li><strong>Care summaries and notes</strong></li>
              <li><strong>Health conditions</strong></li>
              <li><strong>Medications</strong></li>
              <li><strong>Past VA appointments</strong></li>
            </ul>
            <li>Step 3 of 3: Select <strong>"Text file"</strong> (not PDF) → click <strong>"Download report"</strong></li>
          </ol>
          <p className="mt-2 text-xs text-blue-700">
            💡 <strong>Tip:</strong> "Care summaries and notes" is where your vital signs live —
            weight, blood pressure, and pulse are recorded in your provider visit notes, not a separate Vitals section.
          </p>
        </div>

        {!isLoading ? (
            <div
                onDrop={onFileDrop} onDragOver={onDragOver}
                onClick={() => fileInputRef.current?.click()}
                className="border-2 border-dashed border-blue-300 rounded-xl p-8 text-center cursor-pointer hover:border-blue-500 hover:bg-blue-50 transition-colors"
                role="button" aria-label="Click or drag to upload Blue Button file"
            >
              <div className="text-4xl mb-3">📄</div>
              <p className="text-gray-700 font-medium">Click to select your Blue Button .txt file</p>
              <p className="text-gray-400 text-sm mt-1">or drag and drop it here</p>
              <p className="text-gray-400 text-xs mt-2">Plain text (.txt) files only</p>
              <input ref={fileInputRef} type="file" accept=".txt,text/plain" className="hidden"
                     onChange={(e) => onFileSelect(e.target.files[0])} />
            </div>
        ) : (
            <div className="border-2 border-blue-300 rounded-xl p-8 text-center bg-blue-50">
              <div className="text-3xl mb-3 animate-pulse">⚙️</div>
              <p className="text-blue-800 font-medium">Reading and validating your file…</p>
              <div className="mt-3 bg-blue-200 rounded-full h-2 w-full">
                <div className="bg-blue-600 rounded-full h-2 transition-all duration-300" style={{ width: `${loadProgress}%` }} />
              </div>
              <p className="text-blue-600 text-xs mt-1">{loadProgress}%</p>
            </div>
        )}

        {validationError && (
            <div className="mt-4 bg-red-50 border border-red-200 rounded-lg p-4 text-sm text-red-800">
              <p className="font-semibold mb-1">⚠️ File not recognized</p>
              <p>{validationError}</p>
            </div>
        )}
      </div>
  );
}

// ── Step 1 ────────────────────────────────────────────────────

function StepSelect({ reportInfo, sectionRanges, selectedSections, onToggleSection,
                      dateRangeStart, dateRangeEnd, onDateRangeStartChange, onDateRangeEndChange, onBack, onNext }) {

  const { veteranName, reportDateRange, detectedSections } = reportInfo;
  const { present, absent } = detectedSections;

  return (
      <div>
        <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-5">
          <p className="text-green-800 font-semibold text-sm">✅ Blue Button report recognized</p>
          <p className="text-green-700 text-sm mt-1">
            <strong>{veteranName}</strong> · {reportDateRange || 'Date range not detected'}
          </p>
          <p className="text-green-600 text-xs mt-1">
            {present.length} section{present.length !== 1 ? 's' : ''} found ·{' '}
            {(reportInfo.fileSize / 1024).toFixed(0)} KB ·{' '}
            {reportInfo.estimatedLines.toLocaleString()} lines
          </p>
        </div>

        <h3 className="text-lg font-semibold text-gray-900 mb-1">Choose What to Import</h3>
        <p className="text-sm text-gray-600 mb-4">
          Select which sections to import and a date range. You'll review everything before anything is saved.
        </p>

        <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-4">
          <p className="text-sm font-semibold text-gray-800 mb-2">📅 Date range filter</p>
          <div className="flex gap-3 items-center flex-wrap">
            <div>
              <label className="text-xs text-gray-600 block mb-1">From</label>
              <input type="date" value={dateRangeStart} onChange={(e) => onDateRangeStartChange(e.target.value)}
                     className="border border-gray-300 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
            <div className="text-gray-400 text-sm mt-4">→</div>
            <div>
              <label className="text-xs text-gray-600 block mb-1">To</label>
              <input type="date" value={dateRangeEnd} onChange={(e) => onDateRangeEndChange(e.target.value)}
                     className="border border-gray-300 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
            <button onClick={() => { onDateRangeStartChange(''); onDateRangeEndChange(''); }}
                    className="mt-4 text-xs text-blue-600 hover:text-blue-800 underline">Clear filter</button>
          </div>
        </div>

        <div className="space-y-2 mb-5">
          {IMPORTABLE_SECTIONS.map(key => (
              <SectionCheckbox key={key} sectionKey={key} label={SECTION_LABELS[key]}
                               isPresent={present.includes(key)} isSelected={selectedSections.includes(key)}
                               range={sectionRanges[key]} onToggle={() => present.includes(key) && onToggleSection(key)} />
          ))}
        </div>

        {absent.filter(k => IMPORTABLE_SECTIONS.includes(k)).length > 0 && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mb-4 text-xs text-yellow-800">
              <p className="font-semibold mb-1">⚠️ Sections not found in this file:</p>
              <ul className="list-disc list-inside">
                {absent.filter(k => IMPORTABLE_SECTIONS.includes(k)).map(k => <li key={k}>{SECTION_LABELS[k]}</li>)}
              </ul>
              <p className="mt-1">Re-download with all sections selected to include them.</p>
            </div>
        )}

        {present.includes(SECTION_KEYS.CARE_NOTES) && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-4 text-xs text-blue-800">
              💡 <strong>Vitals are inside "Care summaries and notes"</strong> — weight, BP, and pulse are recorded
              in provider visit notes. Selecting care notes extracts them automatically.
            </div>
        )}

        <div className="flex justify-between mt-2">
          <button onClick={onBack} className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 text-sm hover:bg-gray-50 transition-colors">← Back</button>
          <button onClick={onNext} disabled={selectedSections.length === 0}
                  className={`px-5 py-2 rounded-lg text-sm font-semibold transition-colors
            ${selectedSections.length > 0 ? 'bg-blue-900 text-white hover:bg-blue-800' : 'bg-gray-200 text-gray-400 cursor-not-allowed'}`}>
            Continue to Preview →
          </button>
        </div>
      </div>
  );
}

function SectionCheckbox({ label, isPresent, isSelected, range, onToggle }) {
  return (
      <label className={`flex items-start gap-3 p-3 rounded-lg border cursor-pointer transition-colors
      ${!isPresent ? 'bg-gray-50 border-gray-200 opacity-50 cursor-not-allowed'
          : isSelected ? 'bg-blue-50 border-blue-300' : 'bg-white border-gray-200 hover:border-gray-300'}`}>
        <input type="checkbox" checked={isSelected && isPresent} disabled={!isPresent} onChange={onToggle}
               className="mt-0.5 h-4 w-4 rounded text-blue-700 focus:ring-blue-500" />
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className={`text-sm font-medium ${isPresent ? 'text-gray-900' : 'text-gray-400'}`}>{label}</span>
            {!isPresent && <span className="text-xs bg-gray-200 text-gray-500 px-1.5 py-0.5 rounded">Not in file</span>}
          </div>
          {isPresent && range && range.recordCount > 0 && (
              <p className="text-xs text-gray-500 mt-0.5">
                ~{range.recordCount} records
                {range.start && range.end && <> · {formatDateForDisplay(range.start)} – {formatDateForDisplay(range.end)}</>}
              </p>
          )}
        </div>
      </label>
  );
}

// ── Step 2: Preview ───────────────────────────────────────────

function StepPreview({ isParsing, parsedData, recordStates, onToggleRecord, onToggleCategory, onBack, onImport }) {
  if (isParsing) {
    return (
        <div className="text-center py-12">
          <div className="text-4xl mb-4 animate-pulse">⚙️</div>
          <p className="text-blue-800 font-semibold">Parsing your Blue Button records…</p>
          <p className="text-gray-500 text-sm mt-1">This may take a moment for large files.</p>
        </div>
    );
  }

  if (!parsedData || parsedData.length === 0) {
    return (
        <div className="text-center py-12">
          <div className="text-4xl mb-4">🔍</div>
          <p className="text-gray-700 font-semibold">No importable records found</p>
          <p className="text-gray-500 text-sm mt-2">Try adjusting your date range or section selection.</p>
          <button onClick={onBack} className="mt-4 px-4 py-2 rounded-lg border border-gray-300 text-gray-700 text-sm hover:bg-gray-50">← Back</button>
        </div>
    );
  }

  const groups = {
    vital:       parsedData.filter(r => r.category === 'vital'),
    lab:         parsedData.filter(r => r.category === 'lab'),
    condition:   parsedData.filter(r => r.category === 'condition'),
    medication:  parsedData.filter(r => r.category === 'medication'),
    appointment: parsedData.filter(r => r.category === 'appointment'),
  };

  const includedCount = Object.values(recordStates).filter(s => s === 'include' || s === 'conflict-import').length;
  const conflictCount = parsedData.filter(r => r._conflict).length;
  const skippedCount  = Object.values(recordStates).filter(s => s === 'skip' || s === 'conflict-skip').length;

  return (
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-1">Review Before Importing</h3>
        <p className="text-sm text-gray-600 mb-4">
          Check or uncheck individual records. Nothing is saved until you click "Import Selected".
        </p>

        {/* Summary bar */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-4 flex flex-wrap gap-4 text-sm">
          <span className="text-blue-900"><strong>{parsedData.length}</strong> records found</span>
          <span className="text-green-700"><strong>{includedCount}</strong> selected to import</span>
          <span className="text-gray-500"><strong>{skippedCount}</strong> skipped</span>
          {conflictCount > 0 && <span className="text-amber-700"><strong>{conflictCount}</strong> conflict{conflictCount !== 1 ? 's' : ''}</span>}
        </div>

        {conflictCount > 0 && (
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 mb-4 text-xs text-amber-800">
              <strong>⚠️ Conflicts detected:</strong> These records match data already in your Vault (same date and type).
              They are <strong>skipped by default</strong>. Toggle a conflicted record to "Import Anyway" to add it as an additional entry.
            </div>
        )}

        {groups.medication.length > 0 && (
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-3 mb-4 text-xs text-gray-700">
              💊 <strong>Medications are reference-only</strong> and will not be written to your Vault medication list.
              They are shown here for informational purposes only.
            </div>
        )}

        {groups.condition.length > 0 && (
            <div className="bg-purple-50 border border-purple-200 rounded-lg p-3 mb-4 text-xs text-purple-800">
              📋 <strong>Health conditions</strong> will be added to your custom symptoms list under
              "Imported (VA Problem List)" so you can use them when logging symptoms.
            </div>
        )}

        {/* Record groups — ordered by likely importance to veterans */}
        {groups.vital.length > 0 && (
            <RecordGroup label="Vitals" category="vital" records={groups.vital}
                         recordStates={recordStates} onToggleRecord={onToggleRecord} onToggleCategory={onToggleCategory} />
        )}
        {groups.lab.length > 0 && (
            <RecordGroup label="Lab Results" category="lab" records={groups.lab}
                         recordStates={recordStates} onToggleRecord={onToggleRecord} onToggleCategory={onToggleCategory} />
        )}
        {groups.condition.length > 0 && (
            <RecordGroup label="Health Conditions" category="condition" records={groups.condition}
                         recordStates={recordStates} onToggleRecord={onToggleRecord} onToggleCategory={onToggleCategory} />
        )}
        {groups.appointment.length > 0 && (
            <RecordGroup label="Appointments" category="appointment" records={groups.appointment}
                         recordStates={recordStates} onToggleRecord={onToggleRecord} onToggleCategory={onToggleCategory} />
        )}
        {groups.medication.length > 0 && (
            <RecordGroup label="Medications (Reference Only)" category="medication" records={groups.medication}
                         recordStates={recordStates} onToggleRecord={onToggleRecord} onToggleCategory={onToggleCategory}
                         referenceOnly />
        )}

        <div className="flex justify-between mt-6 pt-4 border-t border-gray-200">
          <button onClick={onBack} className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 text-sm hover:bg-gray-50 transition-colors">← Back</button>
          <button onClick={onImport} disabled={includedCount === 0}
                  className={`px-6 py-2 rounded-lg text-sm font-semibold transition-colors
            ${includedCount > 0 ? 'bg-green-700 text-white hover:bg-green-600' : 'bg-gray-200 text-gray-400 cursor-not-allowed'}`}>
            📥 Import {includedCount} Record{includedCount !== 1 ? 's' : ''}
          </button>
        </div>
      </div>
  );
}

function RecordGroup({ label, category, records, recordStates, onToggleRecord, onToggleCategory, referenceOnly }) {
  const [collapsed, setCollapsed] = useState(false);
  const selectedInGroup = records.filter(r => {
    const s = recordStates[r._key];
    return s === 'include' || s === 'conflict-import';
  }).length;

  return (
      <div className="mb-4 border border-gray-200 rounded-xl overflow-hidden">
        <div className="bg-gray-50 px-4 py-2.5 flex items-center justify-between">
          <button onClick={() => setCollapsed(c => !c)}
                  className="flex items-center gap-2 text-sm font-semibold text-gray-800 hover:text-gray-900 text-left">
            <span>{collapsed ? '▶' : '▼'}</span>
            <span>{label}</span>
            <span className="text-xs font-normal text-gray-500">
            {referenceOnly ? `${records.length} records · reference only` : `${selectedInGroup}/${records.length} selected`}
          </span>
          </button>
          {!referenceOnly && (
              <div className="flex gap-3">
                <button onClick={() => onToggleCategory(category, 'all')} className="text-xs text-blue-600 hover:text-blue-800 underline">All</button>
                <button onClick={() => onToggleCategory(category, 'none')} className="text-xs text-gray-500 hover:text-gray-700 underline">None</button>
              </div>
          )}
        </div>
        {!collapsed && (
            <div className="divide-y divide-gray-100">
              {records.map(record => (
                  <RecordRow key={record._key} record={record}
                             state={recordStates[record._key]}
                             onToggle={() => !referenceOnly && onToggleRecord(record._key, recordStates[record._key])}
                             referenceOnly={referenceOnly} />
              ))}
            </div>
        )}
      </div>
  );
}

function RecordRow({ record, state, onToggle, referenceOnly }) {
  const isIncluded = state === 'include' || state === 'conflict-import';
  const isConflict = !!record._conflict;
  const label  = _getRecordLabel(record);
  const detail = _getRecordDetail(record);

  return (
      <div className={`flex items-start gap-3 px-4 py-2.5 text-sm
      ${isConflict ? 'bg-amber-50' : isIncluded ? 'bg-white' : 'bg-gray-50 opacity-60'}`}>
        {!referenceOnly ? (
            <input type="checkbox" checked={isIncluded} onChange={onToggle}
                   className="mt-0.5 h-4 w-4 rounded text-blue-700 focus:ring-blue-500 flex-shrink-0 cursor-pointer" />
        ) : (
            <span className="mt-0.5 text-gray-300 text-xs flex-shrink-0 w-4">—</span>
        )}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className={`font-medium ${isIncluded || referenceOnly ? 'text-gray-900' : 'text-gray-400'}`}>{label}</span>
            {isConflict && (
                <span className={`text-xs px-1.5 py-0.5 rounded border ${
                    state === 'conflict-import'
                        ? 'bg-blue-100 text-blue-700 border-blue-200'
                        : 'bg-amber-100 text-amber-700 border-amber-200'
                }`}>
              {state === 'conflict-import' ? '⚡ Import anyway' : '⚠️ Conflict — skipped'}
            </span>
            )}
          </div>
          {detail && <p className="text-xs text-gray-500 mt-0.5">{detail}</p>}
          {isConflict && <p className="text-xs text-amber-600 mt-0.5">{record._conflict}</p>}
        </div>
        <span className="text-xs text-gray-400 flex-shrink-0 mt-0.5">
        {record.dateStr || record.lastFilledStr || '—'}
      </span>
      </div>
  );
}

function _getRecordLabel(record) {
  if (record.category === 'vital') {
    const label = TYPE_LABELS[record.type] || record.type;
    if (record.type === 'weight')         return `${label}: ${record.values?.weight} lb`;
    if (record.type === 'heart-rate') {
      return `HR: ${record.values?.bpm ?? record.values?.heartRate ?? '?'} bpm`;
    }
    if (record.type === 'blood-pressure') return `${label}: ${record.values?.systolic}/${record.values?.diastolic} mmHg`;
    if (record.type === 'heart-rate')     return `${label}: ${record.values?.heartRate} bpm`;
    if (record.type === 'pulse-ox')       return `${label}: ${record.values?.spO2}%`;
    if (record.type === 'pain')           return `${label}: ${record.values?.score}/10`;
    return label;
  }
  if (record.category === 'lab') {
    const label = TYPE_LABELS[record.vaultType] || record.name;
    return `${label}: ${record.value} ${record.unit}${record.flag ? ` (${record.flag})` : ''}`;
  }
  if (record.category === 'condition')   return record.name;
  if (record.category === 'medication')  return record.name;
  if (record.category === 'appointment') return record.clinic || record.location || record.type || 'VA Appointment';
  return 'Record';
}

function _getRecordDetail(record) {
  if (record.category === 'lab')         return record.refRange ? `Ref range: ${record.refRange}` : null;
  if (record.category === 'condition')   return record.sctCode ? `SNOMED: ${record.sctCode}` : null;
  if (record.category === 'medication')  return record.instructions ? record.instructions.slice(0, 80) + (record.instructions.length > 80 ? '…' : '') : null;
  if (record.category === 'appointment') return record.status ? `Status: ${record.status}` : null;
  return null;
}

// ── Step 3: Complete ──────────────────────────────────────────

function StepComplete({ importResult, onClose }) {
  const { measurements, appointments, conditions, medications, skipped, errors } = importResult;
  return (
      <div className="text-center py-8">
        <div className="text-5xl mb-4">✅</div>
        <h3 className="text-xl font-bold text-gray-900 mb-2">Import Complete</h3>
        <p className="text-gray-600 text-sm mb-6">Your VA Blue Button records have been imported into Symptom Vault.</p>

        <div className="bg-green-50 border border-green-200 rounded-xl p-4 mb-4 text-left max-w-xs mx-auto">
          <p className="text-sm font-semibold text-green-900 mb-2">Import summary:</p>
          <ul className="text-sm text-green-800 space-y-1">
            {measurements > 0 && <li>✓ {measurements} measurement{measurements !== 1 ? 's' : ''} (vitals + labs)</li>}
            {appointments > 0 && <li>✓ {appointments} appointment{appointments !== 1 ? 's' : ''}</li>}
            {conditions > 0  && <li>✓ {conditions} condition{conditions !== 1 ? 's' : ''} added to symptom list</li>}
            {medications > 0 && <li className="text-gray-600">📋 {medications} medication{medications !== 1 ? 's' : ''} (reference only)</li>}
            {skipped > 0     && <li className="text-gray-500">— {skipped} record{skipped !== 1 ? 's' : ''} skipped</li>}
            {errors > 0      && <li className="text-red-600">⚠️ {errors} error{errors !== 1 ? 's' : ''}</li>}
          </ul>
        </div>

        {conditions > 0 && (
            <div className="bg-purple-50 border border-purple-200 rounded-lg p-3 mb-4 text-xs text-purple-800 text-left max-w-xs mx-auto">
              📋 Imported conditions appear in your custom symptoms list under "Imported (VA Problem List)".
            </div>
        )}

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-6 text-xs text-blue-800 text-left max-w-xs mx-auto">
          🔒 Your original Blue Button file has been cleared from memory.
          Only the imported records remain, stored locally on your device.
        </div>

        <button onClick={onClose}
                className="px-6 py-2.5 bg-blue-900 text-white rounded-lg font-semibold text-sm hover:bg-blue-800 transition-colors">
          Done — Go to Vault
        </button>
      </div>
  );
}