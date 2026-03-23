/**
 * bluebuttonParser.js
 * Doc Bear's Symptom Vault — Blue Button Smart Import Wizard
 *
 * Pure utility functions for parsing VA Blue Button text reports.
 * ALL parsing is on-device. No data ever leaves the browser.
 *
 * File format confirmed against Edward McKeown's actual Blue Button export.
 * Tested against VistA-generated text (Iowa City HCS / Cedar Rapids CBOC).
 *
 * Two top-level section styles observed in the wild:
 *   Style A (most sections): numbered with underscore separator
 *     _____________________________________________________
 *     1) Lab and test results
 *
 *   Style B (subsections): dashes
 *     TEST NAME on Date
 *     -----------------------------------------------------
 *
 * Vitals are NOT in a standalone section — they are embedded inside
 * "Care summaries and notes" as "VITAL SIGNS:" blocks within individual notes.
 */

// ─────────────────────────────────────────────────────────────
// CONSTANTS — section identifiers as they appear in actual files
// ─────────────────────────────────────────────────────────────

export const SECTION_KEYS = {
  LABS:         'labs',
  CARE_NOTES:   'care_notes',
  VACCINES:     'vaccines',
  CONDITIONS:   'conditions',
  MEDICATIONS:  'medications',
  APPOINTMENTS: 'appointments',
  DEMOGRAPHICS: 'demographics',
  MILITARY:     'military',
  ACCOUNT:      'account',
};

// Maps the numbered section headers in the file to our internal keys.
// Regex is case-insensitive and allows for minor wording variations.
const SECTION_HEADER_PATTERNS = [
  { key: SECTION_KEYS.LABS,         pattern: /lab and test results/i },
  { key: SECTION_KEYS.CARE_NOTES,   pattern: /care summaries and notes/i },
  { key: SECTION_KEYS.VACCINES,     pattern: /vaccines/i },
  { key: SECTION_KEYS.CONDITIONS,   pattern: /health conditions/i },
  { key: SECTION_KEYS.MEDICATIONS,  pattern: /medications/i },
  { key: SECTION_KEYS.APPOINTMENTS, pattern: /appointments/i },
  { key: SECTION_KEYS.DEMOGRAPHICS, pattern: /demographics/i },
  { key: SECTION_KEYS.MILITARY,     pattern: /military service/i },
  { key: SECTION_KEYS.ACCOUNT,      pattern: /account summary/i },
];

// Human-readable labels for the wizard UI
export const SECTION_LABELS = {
  [SECTION_KEYS.LABS]:         'Lab and test results',
  [SECTION_KEYS.CARE_NOTES]:   'Care summaries and notes (includes vitals)',
  [SECTION_KEYS.VACCINES]:     'Vaccines',
  [SECTION_KEYS.CONDITIONS]:   'Health conditions',
  [SECTION_KEYS.MEDICATIONS]:  'Medications',
  [SECTION_KEYS.APPOINTMENTS]: 'Past appointments',
  [SECTION_KEYS.DEMOGRAPHICS]: 'Demographics',
  [SECTION_KEYS.MILITARY]:     'Military service',
  [SECTION_KEYS.ACCOUNT]:      'Account summary',
};

// Which sections we actually import data from (the rest are informational)
export const IMPORTABLE_SECTIONS = [
  SECTION_KEYS.LABS,
  SECTION_KEYS.CARE_NOTES,
  SECTION_KEYS.CONDITIONS,
  SECTION_KEYS.MEDICATIONS,
  SECTION_KEYS.APPOINTMENTS,
];

// ─────────────────────────────────────────────────────────────
// PHASE 0 — File validation
// ─────────────────────────────────────────────────────────────

/**
 * validateBluebuttonFile
 * Checks whether the provided text is a valid VA Blue Button report.
 *
 * @param {string} text - Raw file contents
 * @returns {{ valid: boolean, reason: string|null, reportInfo: object|null }}
 */
export function validateBluebuttonFile(text) {
  if (!text || typeof text !== 'string') {
    return { valid: false, reason: 'File is empty or unreadable.', reportInfo: null };
  }

  // Must contain the Blue Button header signature
  if (!text.includes('VA Blue Button')) {
    return {
      valid: false,
      reason: 'This does not appear to be a VA Blue Button report. Make sure you downloaded the plain text (.txt) version from My HealtheVet.',
      reportInfo: null,
    };
  }

  // Extract veteran name (line after the header)
  const nameMatch = text.match(/VA Blue Button[^\n]*\n\s*\n([^\n]+)/);
  const veteranName = nameMatch ? nameMatch[1].trim() : 'Unknown';

  // Extract date range from the header block
  const dateRangeMatch = text.match(/Date range:\s*([^\n]+)/i);
  const reportDateRange = dateRangeMatch ? dateRangeMatch[1].trim() : null;

  // Detect which sections are present in this file
  const detectedSections = detectSections(text);

  // Warn if no importable sections found
  if (detectedSections.present.length === 0) {
    return {
      valid: false,
      reason: 'No recognizable data sections were found in this file. It may be formatted differently than expected.',
      reportInfo: null,
    };
  }

  return {
    valid: true,
    reason: null,
    reportInfo: {
      veteranName,
      reportDateRange,
      detectedSections,
      fileSize: text.length,
      estimatedLines: text.split('\n').length,
    },
  };
}

// ─────────────────────────────────────────────────────────────
// PHASE 1 — Section detection
// ─────────────────────────────────────────────────────────────

/**
 * detectSections
 * Scans the file for numbered section headers and determines which
 * importable sections are present vs. absent.
 *
 * @param {string} text - Raw file contents
 * @returns {{ present: string[], absent: string[], sectionMap: object }}
 *
 * sectionMap[key] = { startIndex, endIndex, rawText }
 * rawText is the slice of the file belonging to that section.
 */
export function detectSections(text) {
  // Split file into lines for positional processing
  const lines = text.split('\n');

  // Find all numbered section header lines: "1) Section Name" or "2) Section Name"
  // These appear at the start of a line (may have leading whitespace trimmed away).
  // Format confirmed: /^\d+\) [A-Za-z]/ at roughly column 0
  const sectionBoundaries = [];

  lines.forEach((line, idx) => {
    const trimmed = line.trim();
    // Match top-level numbered sections — single or double digit number
    const match = trimmed.match(/^(\d+)\)\s+(.+)$/);
    if (match) {
      const num = parseInt(match[1], 10);
      const title = match[2].trim();

      // Identify which of our known sections this is
      const found = SECTION_HEADER_PATTERNS.find(({ pattern }) => pattern.test(title));
      if (found) {
        sectionBoundaries.push({
          key: found.key,
          title,
          num,
          lineIndex: idx,
          charOffset: text.indexOf(trimmed, idx > 0 ? lines.slice(0, idx).join('\n').length : 0),
        });
      }
    }
  });

  // Build a map of section key → raw text slice
  const sectionMap = {};
  sectionBoundaries.forEach((section, i) => {
    const nextSection = sectionBoundaries[i + 1];
    const start = section.charOffset;
    const end = nextSection ? nextSection.charOffset : text.length;
    sectionMap[section.key] = {
      startIndex: start,
      endIndex: end,
      rawText: text.slice(start, end),
    };
  });

  const present = Object.keys(sectionMap);
  const absent = IMPORTABLE_SECTIONS.filter(k => !present.includes(k));

  return { present, absent, sectionMap };
}

/**
 * getSectionDateRange
 * Scans a section's raw text to find the earliest and latest dates,
 * and counts the approximate number of records.
 *
 * @param {string} sectionText - Raw text of one section
 * @param {string} sectionKey - Section identifier
 * @returns {{ start: Date|null, end: Date|null, recordCount: number }}
 */
export function getSectionDateRange(sectionText, sectionKey) {
  const dates = [];

  if (sectionKey === SECTION_KEYS.LABS) {
    // Lab entries: "TEST NAME on Month DD, YYYY, H:MM a.m."
    // Also: "Date completed: Month DD, YYYY"
    const labDateRe = /(?:on|Date completed:)\s+([A-Za-z]+ \d{1,2},\s*\d{4})/gi;
    let m;
    while ((m = labDateRe.exec(sectionText)) !== null) {
      const d = parseLooseDate(m[1]);
      if (d) dates.push(d);
    }
  }

  if (sectionKey === SECTION_KEYS.CARE_NOTES) {
    // Care notes: "Date: Month DD, YYYY" (in the Details block of each note)
    const noteDetailDateRe = /^\s+Date:\s+([A-Za-z]+ \d{1,2},\s*\d{4})/gim;
    let m;
    while ((m = noteDetailDateRe.exec(sectionText)) !== null) {
      const d = parseLooseDate(m[1]);
      if (d) dates.push(d);
    }
  }

  if (sectionKey === SECTION_KEYS.CONDITIONS) {
    // Health conditions: "Date: Month DD, YYYY"
    const condDateRe = /^Date:\s+([A-Za-z]+ \d{1,2},\s*\d{4})/gim;
    let m;
    while ((m = condDateRe.exec(sectionText)) !== null) {
      const d = parseLooseDate(m[1]);
      if (d) dates.push(d);
    }
  }

  if (sectionKey === SECTION_KEYS.MEDICATIONS) {
    // Medications: "Last filled on: Month DD, YYYY"
    const medDateRe = /Last filled on:\s+([A-Za-z]+ \d{1,2},\s*\d{4})/gi;
    let m;
    while ((m = medDateRe.exec(sectionText)) !== null) {
      const d = parseLooseDate(m[1]);
      if (d) dates.push(d);
    }
  }

  if (sectionKey === SECTION_KEYS.APPOINTMENTS) {
    // Appointments: "Date: Month DD, YYYY, H:MM AM/PM TZ"
    const apptDateRe = /^Date:\s+([A-Za-z]+ \d{1,2},\s*\d{4})/gim;
    let m;
    while ((m = apptDateRe.exec(sectionText)) !== null) {
      const d = parseLooseDate(m[1]);
      if (d) dates.push(d);
    }
  }

  if (dates.length === 0) {
    return { start: null, end: null, recordCount: 0 };
  }

  dates.sort((a, b) => a - b);

  // Estimate record count by counting subsection separators (-----)
  const separatorCount = (sectionText.match(/^-{5,}/gm) || []).length;

  return {
    start: dates[0],
    end: dates[dates.length - 1],
    recordCount: Math.max(separatorCount, dates.length),
  };
}

// ─────────────────────────────────────────────────────────────
// DATE PARSING UTILITIES
// ─────────────────────────────────────────────────────────────

const MONTH_MAP = {
  jan: 0, feb: 1, mar: 2, apr: 3, may: 4, jun: 5,
  jul: 6, aug: 7, sep: 8, oct: 9, nov: 10, dec: 11,
};

/**
 * parseLooseDate
 * Parses date strings in formats found throughout the Blue Button file:
 *   "October 31, 2025"           → long month name
 *   "OCT 31,2025"                → uppercase abbreviated month (VistA style)
 *   "10/31/2025"                 → MM/DD/YYYY
 *   "11/18/2025 08:44"           → MM/DD/YYYY HH:MM (vital sign timestamp)
 *   "NOV 18,2025@08:41:46"       → VistA legacy timestamp format
 *
 * Returns a Date object (local time) or null if unparseable.
 *
 * @param {string} str
 * @returns {Date|null}
 */
export function parseLooseDate(str) {
  if (!str) return null;
  const s = str.trim();

  // "November 18, 2025" or "October 31, 2025"
  let m = s.match(/^([A-Za-z]+)\s+(\d{1,2}),?\s+(\d{4})/);
  if (m) {
    const mon = MONTH_MAP[m[1].toLowerCase().slice(0, 3)];
    if (mon !== undefined) {
      return new Date(parseInt(m[3]), mon, parseInt(m[2]));
    }
  }

  // "NOV 18,2025@08:41:46" — VistA legacy format (Pulse Ox timestamps)
  m = s.match(/^([A-Z]{3})\s+(\d{1,2}),(\d{4})@(\d{2}):(\d{2})/);
  if (m) {
    const mon = MONTH_MAP[m[1].toLowerCase()];
    if (mon !== undefined) {
      return new Date(parseInt(m[3]), mon, parseInt(m[2]), parseInt(m[4]), parseInt(m[5]));
    }
  }

  // "10/31/2025" or "10/31/2025 08:44"
  m = s.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})(?:\s+(\d{2}):(\d{2}))?/);
  if (m) {
    return new Date(
        parseInt(m[3]),
        parseInt(m[1]) - 1,
        parseInt(m[2]),
        m[4] ? parseInt(m[4]) : 0,
        m[5] ? parseInt(m[5]) : 0,
    );
  }

  return null;
}

/**
 * toISOString
 * Converts a Date to "YYYY-MM-DD" format for localStorage storage.
 * @param {Date} date
 * @returns {string}
 */
export function toISOString(date) {
  if (!date || !(date instanceof Date) || isNaN(date)) return null;
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

/**
 * toISODateTime
 * Converts a Date to "YYYY-MM-DDTHH:MM:00" for measurements that need time.
 * @param {Date} date
 * @returns {string}
 */
export function toISODateTime(date) {
  if (!date || !(date instanceof Date) || isNaN(date)) return null;
  const dateStr = toISOString(date);
  const h = String(date.getHours()).padStart(2, '0');
  const min = String(date.getMinutes()).padStart(2, '0');
  return `${dateStr}T${h}:${min}:00`;
}

// ─────────────────────────────────────────────────────────────
// PHASE 2 — Vitals parser (from Care Summaries)
// ─────────────────────────────────────────────────────────────

/**
 * parseVitals
 * Extracts VITAL SIGNS blocks from care summary notes.
 *
 * The blocks appear in two observed formats:
 *
 *   Format A (Dr. Alam / primary care notes):
 *     VITAL SIGNS:
 *       BP:          101/63 (11/18/2025 08:44)
 *       WT:          222.01 lb [100.70 kg] (11/18/2025 08:41)
 *       Pain (1-10): 9 (11/18/2025 08:41)
 *
 *   Format B (MH / other notes):
 *     VITAL SIGNS:
 *       BP: 125/80 (06/12/2025 14:28)
 *       Wt: 219.58 lb [99.60 kg] (05/07/2025 08:06)
 *       Pain: 7 (06/12/2025 14:28)
 *
 * Both formats handled by the same regex with flexible whitespace.
 *
 * @param {string} sectionText - Raw text of the Care Summaries section
 * @param {{ start: Date|null, end: Date|null }} dateRange - Filter range (inclusive)
 * @returns {VitalRecord[]}
 *
 * VitalRecord shape:
 * {
 *   type: 'weight' | 'blood-pressure' | 'heart-rate' | 'pulse-ox' | 'pain',
 *   values: { ... },   // type-specific fields
 *   date: Date,
 *   dateStr: string,   // ISO date string YYYY-MM-DD
 *   source: 'blue-button',
 *   sourceNote: string // brief description for audit trail
 * }
 */
export function parseVitals(sectionText, dateRange = {}) {
  const results = [];

  // Find each VITAL SIGNS: block — consume lines until a blank line or non-vital line
  // The block starts at "VITAL SIGNS:" (with optional leading space)
  // and continues with indented lines for each measurement.
  const vitalBlockRe = /[ \t]*VITAL SIGNS:[ \t]*\r?\n((?:[ \t]+[A-Za-z].*\r?\n?)*)/gm;

  let blockMatch;
  while ((blockMatch = vitalBlockRe.exec(sectionText)) !== null) {
    const block = blockMatch[1];
    if (!block.trim()) continue;

    const vitals = _parseVitalBlock(block);

    // Each vital within the block has its own timestamp extracted from the parenthetical
    // e.g., "101/63 (11/18/2025 08:44)" — we use the vital-specific date, not the note date.
    // This is more accurate since different vitals in one note may have different timestamps.
    vitals.forEach(vital => {
      if (!vital.date) return;
      if (!_inDateRange(vital.date, dateRange)) return;
      results.push(vital);
    });
  }

  return results;
}

/**
 * _parseVitalBlock (internal)
 * Parses the lines within a single VITAL SIGNS: block.
 * Returns an array of vital records.
 *
 * @param {string} block - The text lines of one VITAL SIGNS block
 * @returns {VitalRecord[]}
 */
function _parseVitalBlock(block) {
  const records = [];
  const lines = block.split('\n');

  lines.forEach(line => {
    if (!line.trim()) return;

    // Extract the parenthetical date/time from the end of the line
    // Formats: (11/18/2025 08:44) or (NOV 18,2025@08:41:46)
    const dateParenRe = /\(([^)]+)\)\s*$/;
    const dateParen = line.match(dateParenRe);
    const date = dateParen ? parseLooseDate(dateParen[1]) : null;
    const dateStr = date ? toISOString(date) : null;

    const source = 'blue-button';
    const sourceNote = 'Imported from VA Blue Button care summary';

    // ─── Blood Pressure ───
    // "BP:          101/63 (11/18/2025 08:44)"
    // "BP: 125/80 (06/12/2025 14:28)"
    let m = line.match(/^\s+BP:\s+(\d+)\/(\d+)/i);
    if (m) {
      records.push({
        type: 'blood-pressure',
        values: { systolic: parseInt(m[1]), diastolic: parseInt(m[2]) },
        date, dateStr, source, sourceNote,
      });
      return;
    }

    // ─── Weight ───
    // "WT:          222.01 lb [100.70 kg] (11/18/2025 08:41)"
    // "Wt: 219.58 lb [99.60 kg] (05/07/2025 08:06)"
    m = line.match(/^\s+W[Tt]:\s+([\d.]+)\s+lb/i);
    if (m) {
      records.push({
        type: 'weight',
        values: { weight: parseFloat(m[1]), unit: 'lb' },
        date, dateStr, source, sourceNote,
      });
      return;
    }

    // ─── Heart Rate / Pulse ───
    // "Pulse:       80 (11/18/2025 08:44)"
    m = line.match(/^\s+Pulse:\s+(\d+)/i);
    if (m) {
      records.push({
        type: 'heart-rate',
        values: { heartRate: parseInt(m[1]) },
        date, dateStr, source, sourceNote,
      });
      return;
    }

    // ─── Pulse Oximetry / SpO2 ───
    // "Pulse Ox:    95  (NOV 18,2025@08:41:46)"
    m = line.match(/^\s+Pulse Ox:\s+([\d.]+)/i);
    if (m) {
      records.push({
        type: 'pulse-ox',
        values: { spO2: parseFloat(m[1]) },
        date, dateStr, source, sourceNote,
      });
      return;
    }

    // ─── Pain Score ───
    // "Pain (1-10): 9 (11/18/2025 08:41)"
    // "Pain: 7 (06/12/2025 14:28)"
    m = line.match(/^\s+Pain(?:\s*\(1-10\))?:\s+(\d+)/i);
    if (m) {
      records.push({
        type: 'pain',
        values: { score: parseInt(m[1]), scale: '0-10' },
        date, dateStr, source, sourceNote,
      });
      return;
    }

    // ─── Temperature (parsed but not currently a Vault measurement type) ───
    // Skipped for MVP — flag for future use
    // m = line.match(/^\s+Temp:\s+([\d.]+)\s+F/i);

    // ─── Respiration, Height, BMI — skipped for MVP ───
  });

  return records;
}

// ─────────────────────────────────────────────────────────────
// PHASE 2 — Labs parser
// ─────────────────────────────────────────────────────────────

/**
 * parseLabs
 * Extracts structured numeric lab results from the Lab and Test Results section.
 *
 * Format confirmed from file:
 *   A1C%*ia
 *   Result: 6.9 % (High)
 *   Reference range: 4.4-6.4 %
 *   Status: Final
 *
 *   GLUCOSE*IC
 *   Result: 131 mg/dL (High)
 *   Reference range: 70-115 mg/dL
 *   Status: Final
 *
 * Panel header format: "TEST NAME on Month DD, YYYY, H:MM a.m."
 * Individual test format: "TEST NAME\nResult: value unit (flag)"
 *
 * @param {string} sectionText - Raw text of the Lab and Test Results section
 * @param {{ start: Date|null, end: Date|null }} dateRange - Filter range
 * @returns {LabRecord[]}
 *
 * LabRecord shape:
 * {
 *   name: string,        // raw lab name from file
 *   vaultType: string|null,  // mapped Vault measurement type or null
 *   value: number,
 *   unit: string,
 *   flag: string|null,   // "High", "Low", or null
 *   refRange: string|null,
 *   date: Date,
 *   dateStr: string,
 *   source: 'blue-button',
 * }
 */
export function parseLabs(sectionText, dateRange = {}) {
  const results = [];

  // Split into panel blocks — each starts with "TEST NAME on DATE\n-----"
  // We track the current panel date as we descend through the section.
  const lines = sectionText.split('\n');
  let currentPanelDate = null;

  // Maps lab name patterns → Vault measurement types
  const LAB_TO_VAULT = [
    { pattern: /^A1C%/i,              vaultType: 'hba1c' },
    { pattern: /^GLUCOSE\*IC/i,       vaultType: 'blood-glucose' },
    { pattern: /^GLUCOSE,\s*ANCILLARY/i, vaultType: 'blood-glucose' },
    { pattern: /^GLUCOSE/i,           vaultType: 'blood-glucose' },
    // Future: TSH, cholesterol, creatinine, FEV1
  ];

  let i = 0;
  while (i < lines.length) {
    const line = lines[i];

    // Detect panel header: "TEST PANEL NAME on Month DD, YYYY, ..."
    // Pattern: ends with "on [Month] [DD], [YYYY]" with optional time
    const panelHeaderRe = /\bon\s+([A-Za-z]+ \d{1,2},\s*\d{4})/;
    const panelHeaderMatch = line.match(panelHeaderRe);
    if (panelHeaderMatch && !line.startsWith(' ') && !line.startsWith('\t')) {
      // Only treat as panel header if followed by dashes (confirms it's a lab block)
      const nextLine = lines[i + 1] || '';
      if (nextLine.trim().startsWith('---')) {
        currentPanelDate = parseLooseDate(panelHeaderMatch[1]);
        i++;
        continue;
      }
    }

    // Detect individual result line: "LABNAME*suffix" or "LABNAME"
    // followed immediately by "Result: value unit (flag)"
    // The lab name line: no leading space, contains letters and possibly * or ,
    // Next line must be "Result: ..."
    if (line.trim() && !line.startsWith(' ') && !line.startsWith('\t')) {
      const nextLine = (lines[i + 1] || '').trim();
      const resultMatch = nextLine.match(/^Result:\s+([\d.]+)\s*([^\s(]+)?\s*(?:\((High|Low|Critical)\))?/i);

      if (resultMatch) {
        const labName = line.trim();
        const value = parseFloat(resultMatch[1]);
        const unit = resultMatch[2] || '';
        const flag = resultMatch[3] || null;

        // Get reference range (2 lines after the lab name)
        const refLine = (lines[i + 2] || '').trim();
        const refMatch = refLine.match(/^Reference range:\s*(.+)/i);
        const refRange = refMatch ? refMatch[1].trim() : null;

        // Map to Vault type
        const vaultMapping = LAB_TO_VAULT.find(({ pattern }) => pattern.test(labName));
        const vaultType = vaultMapping ? vaultMapping.vaultType : null;

        // Use the panel date (lab-specific timestamps not available inline)
        const date = currentPanelDate;
        if (!date) { i++; continue; }
        if (!_inDateRange(date, dateRange)) { i++; continue; }

        results.push({
          name: labName,
          vaultType,
          value,
          unit,
          flag,
          refRange,
          date,
          dateStr: toISOString(date),
          source: 'blue-button',
          sourceNote: `Lab result from VA Blue Button (panel: ${toISOString(date)})`,
        });
      }
    }

    i++;
  }

  return results;
}

// ─────────────────────────────────────────────────────────────
// PHASE 3 — Health Conditions parser
// ─────────────────────────────────────────────────────────────

/**
 * parseConditions
 * Extracts health conditions (VA problem list) from the Health Conditions section.
 *
 * Format confirmed:
 *   Condition Name (SCT 12345678)
 *   -----------------------------------------------------
 *   Date: August 26, 2025
 *   Provider: KELSEY M RANSHAW
 *   Status of health condition: undefined
 *   Location: IOWA CITY HCS
 *   SNOMED Clinical term: Condition Name (SCT 12345678)
 *
 * @param {string} sectionText - Raw text of the Health Conditions section
 * @returns {ConditionRecord[]}
 *
 * ConditionRecord shape:
 * {
 *   name: string,        // Cleaned condition name (without SCT code)
 *   sctCode: string|null,
 *   date: Date|null,
 *   dateStr: string|null,
 *   provider: string|null,
 *   location: string|null,
 *   source: 'blue-button',
 * }
 */
export function parseConditions(sectionText) {
  const results = [];

  // ACTUAL FORMAT (confirmed from file):
  //   Condition Name (SCT 123456789)        ← name line BEFORE the dashes
  //   -----------------------------------------------------
  //   Date: August 26, 2025
  //   Provider: KELSEY M RANSHAW
  //   Provider Notes
  //   Status of health condition: undefined
  //   Location: IOWA CITY HCS
  //   SNOMED Clinical term: Condition Name (SCT 123456789)
  //
  // Strategy: split on lines that contain "(SCT XXXXXXX)" — each is a condition name.
  // The detail block immediately follows the next "-----" line.

  const lines = sectionText.split('\n');
  let i = 0;

  while (i < lines.length) {
    const line = lines[i].trim();

    // A condition name line contains an SCT code
    const sctMatch = line.match(/\(SCT\s+(\d+)\)/);

    if (sctMatch) {
      const sctCode = sctMatch[1];
      const name = line.replace(/\s*\(SCT\s+\d+\)/, '').trim();

      // Skip the SNOMED Clinical term repeat line (starts with "SNOMED Clinical term:")
      if (line.startsWith('SNOMED Clinical term:')) {
        i++;
        continue;
      }

      // Skip if name is too short
      if (name.length < 3) {
        i++;
        continue;
      }

      // Collect the detail block: skip the "-----" line, read until next blank+SCT or end
      let dateStr = null, provider = null, location = null;
      let j = i + 1;

      // Skip the dashes line
      if (j < lines.length && /^-{5,}/.test(lines[j].trim())) j++;

      // Read detail lines until we hit a blank line followed by an SCT name, or end
      while (j < lines.length) {
        const detail = lines[j].trim();

        // Stop at the next condition name (has SCT code, not a SNOMED repeat)
        if (/\(SCT\s+\d+\)/.test(detail) && !detail.startsWith('SNOMED Clinical term:')) break;

        const dateMatch = detail.match(/^Date:\s+([A-Za-z]+ \d{1,2},\s*\d{4})/);
        if (dateMatch) dateStr = dateMatch[1];

        const providerMatch = detail.match(/^Provider:\s+(.+)/);
        if (providerMatch && !detail.startsWith('Provider Notes')) {
          provider = providerMatch[1].trim();
        }

        const locationMatch = detail.match(/^Location:\s+(.+)/);
        if (locationMatch) location = locationMatch[1].trim();

        j++;
      }

      const date = dateStr ? parseLooseDate(dateStr) : null;

      results.push({
        name,
        sctCode,
        date,
        dateStr: toISOString(date),
        provider,
        location,
        source: 'blue-button',
      });

      i = j; // jump past the block we just consumed
      continue;
    }

    i++;
  }

  return results;
}

// ─────────────────────────────────────────────────────────────
// PHASE 3 — Medications parser
// ─────────────────────────────────────────────────────────────

/**
 * parseMedications
 * Extracts medication records from the Medications section.
 *
 * Format confirmed:
 *   Title: MEDICATION NAME
 *
 *   About your prescription:
 *   - Last filled on: Month DD, YYYY
 *   - Status: active
 *   - Prescription number: XXXXXXXX
 *   - Prescribed on: Month DD, YYYY
 *   - Prescribed by: PROVIDER NAME
 *   - Facility: FACILITY NAME
 *
 *   About this medication or supply:
 *   - Instructions: DIRECTIONS TEXT
 *   - Reason for use: ...
 *   - Quantity: N
 *
 * @param {string} sectionText - Raw text of the Medications section
 * @returns {MedicationRecord[]}
 */
export function parseMedications(sectionText) {
  const results = [];

  // Split on "Title: " to get individual medication blocks
  const blocks = sectionText.split(/^Title:\s+/m);

  blocks.forEach(block => {
    if (!block.trim()) return;

    const blockLines = block.split('\n');
    const name = blockLines[0].trim();

    // Skip boilerplate blocks and section headers
    if (!name || name.length < 2 || name.startsWith('This is a list')) return;
    if (/^\d+\)\s+/i.test(name)) return; // skip "6) Medications" section header
    if (/^-{3,}$/.test(name)) return;    // skip separator lines

    // Skip medications documented as "never filled" — these are non-VA provider
    // medications recorded for informational purposes only. They were never dispensed
    // by VA pharmacy and should not appear in the veteran's active med list or history.
    if (/- Last filled on:\s+Not filled yet/i.test(block)) return;
    const lastFilledMatch = block.match(/- Last filled on:\s+([A-Za-z]+ \d{1,2},\s*\d{4})/i);
    const statusMatch = block.match(/- Status:\s+(\w+)/i);
    const rxNumMatch = block.match(/- Prescription number:\s+(\S+)/i);
    const prescribedOnMatch = block.match(/- Prescribed on:\s+([A-Za-z]+ \d{1,2},\s*\d{4})/i);
    const prescribedByMatch = block.match(/- Prescribed by:\s+(.+)/i);
    const facilityMatch = block.match(/- Facility:\s+(.+)/i);
    const instructionsMatch = block.match(/- Instructions:\s+(.+)/i);
    const reasonMatch = block.match(/- Reason for use:\s+(.+)/i);
    const quantityMatch = block.match(/- Quantity:\s+(\d+)/i);
    const expirationMatch = block.match(/- Request refills by this prescription expiration date:\s+([A-Za-z]+ \d{1,2},\s*\d{4})/i);

    const lastFilled = lastFilledMatch ? parseLooseDate(lastFilledMatch[1]) : null;
    const prescribedOn = prescribedOnMatch ? parseLooseDate(prescribedOnMatch[1]) : null;
    const expirationDate = expirationMatch ? parseLooseDate(expirationMatch[1]) : null;

    results.push({
      name,
      status: statusMatch ? statusMatch[1].trim().toLowerCase() : 'unknown',
      lastFilled,
      lastFilledStr: toISOString(lastFilled),
      prescribedOn,
      prescribedOnStr: toISOString(prescribedOn),
      expirationDate,
      expirationDateStr: toISOString(expirationDate),
      rxNumber: rxNumMatch ? rxNumMatch[1].trim() : null,
      prescribedBy: prescribedByMatch ? prescribedByMatch[1].trim() : null,
      facility: facilityMatch ? facilityMatch[1].trim() : null,
      instructions: instructionsMatch ? instructionsMatch[1].trim() : null,
      reasonForUse: (reasonMatch && reasonMatch[1].trim() !== 'None recorded') ? reasonMatch[1].trim() : null,
      quantity: quantityMatch ? parseInt(quantityMatch[1]) : null,
      source: 'blue-button',
    });
  });

  return results;
}

// ─────────────────────────────────────────────────────────────
// PHASE 3b — Active Medications Summary parser (Format A)
// ─────────────────────────────────────────────────────────────

/**
 * parseActiveMedSummary
 * Extracts rich metadata from the Format A active medications summary table.
 *
 * Format A appears in TWO locations in the Blue Button file:
 *   1. Standalone section near the top of the file
 *   2. Embedded inside individual care note sections
 *
 * Format A structure (confirmed from actual file):
 *   BACLOFEN 5MG TAB Qty: 360 for 90 days    ACTIVE (S)   Issue: 09/11/24
 *     TAKE ONE TABLET BY MOUTH FOUR TIMES A DAY  Refills: 0  Last : 08/27/25
 *   Indication: FOR SPASTICITY                              Expr : 09/12/25
 *
 * This parser is intentionally additive — it returns an array of objects
 * suitable for MERGING into existing Vault medication entries. It never
 * creates new medications; it only enriches matched ones.
 *
 * @param {string} fullText - The ENTIRE Blue Button file text (not just a section)
 * @returns {FormatARecord[]}
 *
 * FormatARecord shape:
 * {
 *   name: string,              // Raw name from file (e.g., "BACLOFEN 5MG TAB")
 *   baseName: string,          // Stripped base name for matching (e.g., "BACLOFEN")
 *   qty: number|null,
 *   daysSupply: number|null,
 *   status: string,            // "active", "discontinued", etc.
 *   issueDate: Date|null,
 *   issueDateStr: string|null,
 *   lastFillDate: Date|null,
 *   lastFillDateStr: string|null,
 *   expirationDate: Date|null,
 *   expirationDateStr: string|null,
 *   refillsRemaining: number|null,
 *   instructions: string|null,
 *   indication: string|null,
 *   source: 'blue-button',
 * }
 */
export function parseActiveMedSummary(fullText) {
  const results = [];

  // ── Strategy ──────────────────────────────────────────────
  // Format A entries always follow this 3-line pattern:
  //
  // Line 1 (name/status line):
  //   NAME [Qty: N for N days]   STATUS   Issue: MM/DD/YY
  //
  // Line 2 (instructions line, indented):
  //   [spaces]INSTRUCTIONS   Refills: N   Last : MM/DD/YY
  //
  // Line 3 (indication line, optional):
  //   Indication: TEXT   [spaces]   Expr : MM/DD/YY
  //
  // "Last :" and "Expr :" have a trailing space before the colon — this is
  // intentional in the VistA output and must be matched literally.
  //
  // Date format in Format A is MM/DD/YY (two-digit year), unlike the
  // "Month DD, YYYY" format used everywhere else in the file.
  // ─────────────────────────────────────────────────────────

  const lines = fullText.split('\n');
  const seen = new Set(); // deduplicate across multiple embedded occurrences

  for (let i = 0; i < lines.length - 1; i++) {
    const line = lines[i];

    // Line 1 detection: must contain "ACTIVE" or "DISCONTINUED" and "Issue:"
    // The name is at the START of the line (no leading spaces on line 1)
    if (!/Issue:\s*\d{2}\/\d{2}\/\d{2}/i.test(line)) continue;
    if (!/ACTIVE|DISCONTINUED|EXPIRED|HOLD/i.test(line)) continue;

    // ── Parse Line 1 ──────────────────────────────────────
    // Example: "BACLOFEN 5MG TAB Qty: 360 for 90 days    ACTIVE (S)   Issue: 09/11/24"

    // Extract medication name: everything before "Qty:" or the status word
    // Remove trailing spaces, then strip Qty clause if present
    const nameRaw = line
    .replace(/\s+Qty:.*$/i, '')           // strip "Qty: ..." and everything after
        .replace(/\s+(ACTIVE|DISCONTINUED|EXPIRED|HOLD).*$/i, '') // strip status onward
        .trim();

    if (!nameRaw || nameRaw.length < 3) continue;

    // Extract qty and days supply
    const qtyMatch = line.match(/Qty:\s*(\d+)\s+for\s+(\d+)\s+days/i);
    const qty = qtyMatch ? parseInt(qtyMatch[1]) : null;
    const daysSupply = qtyMatch ? parseInt(qtyMatch[2]) : null;

    // Extract status (ACTIVE, DISCONTINUED, etc.)
    const statusMatch = line.match(/(ACTIVE|DISCONTINUED|EXPIRED|HOLD)\s*(?:\([^)]+\))?/i);
    const status = statusMatch ? statusMatch[1].toLowerCase() : 'unknown';

    // Extract Issue date (MM/DD/YY)
    const issueDateMatch = line.match(/Issue:\s*(\d{2}\/\d{2}\/\d{2})/i);
    const issueDate = issueDateMatch ? parseShortDate(issueDateMatch[1]) : null;

    // ── Parse Line 2 (instructions + refills + last fill) ─
    const line2 = lines[i + 1] || '';
    const refillsMatch = line2.match(/Refills:\s*(\d+)/i);
    const lastFillMatch = line2.match(/Last\s*:\s*(\d{2}\/\d{2}\/\d{2})/i);
    const refillsRemaining = refillsMatch ? parseInt(refillsMatch[1]) : null;
    const lastFillDate = lastFillMatch ? parseShortDate(lastFillMatch[1]) : null;

    // Instructions: everything on line 2 before "Refills:" (trim leading whitespace)
    const instructions = line2
    .replace(/\s+Refills:.*$/i, '')
    .replace(/\s+Last\s*:.*$/i, '')
    .trim() || null;

    // ── Parse Line 3 (indication + expiration, optional) ──
    const line3 = (lines[i + 2] || '');
    const indicationMatch = line3.match(/Indication:\s*(.+?)(?:\s{3,}|Expr\s*:|$)/i);
    const expirationMatch = line3.match(/Expr\s*:\s*(\d{2}\/\d{2}\/\d{2})/i);
    const indication = indicationMatch ? indicationMatch[1].trim() : null;
    const expirationDate = expirationMatch ? parseShortDate(expirationMatch[1]) : null;

    // ── Deduplicate ───────────────────────────────────────
    // Key by name + issue date to avoid duplicating entries that appear in
    // both the standalone section AND embedded in care notes
    const dedupKey = `${nameRaw}|${issueDateMatch?.[1] || ''}`;
    if (seen.has(dedupKey)) continue;
    seen.add(dedupKey);

    // ── Build base name for Vault matching ────────────────
    // Strip strength, form, and route suffixes (same logic used in conflict detection)
    const baseName = nameRaw
    .replace(/\s+\d[\d.]*\s*(MG|MCG|GM|ML|MG\/ML|UNIT|%|UNT)[^\s]*/gi, '')
    .replace(/\s+(TAB|CAP|CREAM|GEL|PATCH|SOLN|PWDR|INJ|OINT|SUPP|DROPS|SPRAY|HCL|SULFATE|SODIUM)[^\s]*/gi, '')
    .trim()
    .toLowerCase();

    results.push({
      name: nameRaw,
      baseName,
      qty,
      daysSupply,
      status,
      issueDate,
      issueDateStr: toISOString(issueDate),
      lastFillDate,
      lastFillDateStr: toISOString(lastFillDate),
      expirationDate,
      expirationDateStr: toISOString(expirationDate),
      refillsRemaining,
      instructions: instructions || null,
      indication,
      source: 'blue-button',
    });
  }

  return results;
}

/**
 * parseShortDate
 * Parses MM/DD/YY format dates used in Format A summary tables.
 * Two-digit years: 00-49 = 2000-2049, 50-99 = 1950-1999.
 *
 * @param {string} str - e.g., "09/11/24"
 * @returns {Date|null}
 */
export function parseShortDate(str) {
  if (!str) return null;
  const m = str.match(/^(\d{2})\/(\d{2})\/(\d{2})$/);
  if (!m) return null;
  const month = parseInt(m[1]) - 1; // zero-indexed
  const day   = parseInt(m[2]);
  const yr    = parseInt(m[3]);
  const year  = yr < 50 ? 2000 + yr : 1900 + yr;
  const d = new Date(year, month, day);
  return isNaN(d.getTime()) ? null : d;
}

// ─────────────────────────────────────────────────────────────
// PHASE 3 — Appointments parser
// ─────────────────────────────────────────────────────────────

/**
 * parseAppointments
 * Extracts past appointments from the Appointments section.
 *
 * Format confirmed:
 *   Date: March 11, 2024, 11:00 AM CDT
 *   Appointment type: Clinic
 *   Status: Confirmed
 *   What: CR/BHIP MH SW 2
 *   Location: CEDAR RAPIDS VA CLINIC
 *   Clinic phone: 319-369-4340
 *
 * @param {string} sectionText - Raw text of the Appointments section
 * @param {{ start: Date|null, end: Date|null }} dateRange - Filter range
 * @returns {AppointmentRecord[]}
 */
export function parseAppointments(sectionText, dateRange = {}) {
  const results = [];

  // Split on "Date: [Month]" to isolate appointment blocks
  // Each appointment starts with "Date: " at column 0
  const blocks = sectionText.split(/(?=^Date:\s+[A-Z][a-z])/m);

  blocks.forEach(block => {
    if (!block.trim()) return;

    const dateMatch = block.match(/^Date:\s+([A-Za-z]+ \d{1,2},\s*\d{4})/m);
    if (!dateMatch) return;

    const date = parseLooseDate(dateMatch[1]);
    if (!date) return;
    if (!_inDateRange(date, dateRange)) return;

    // Extract time if present: "11:00 AM CDT"
    const timeMatch = block.match(/^Date:\s+[A-Za-z]+ \d{1,2},\s*\d{4},\s*(\d{1,2}:\d{2}\s*(?:AM|PM))/mi);

    const typeMatch = block.match(/^Appointment type:\s+(.+)/m);
    const statusMatch = block.match(/^Status:\s+(.+)/m);
    const whatMatch = block.match(/^What:\s+(.+)/m);
    const locationMatch = block.match(/^Location:\s+(.+)/m);
    const phoneMatch = block.match(/^Clinic phone:\s+(.+)/m);

    results.push({
      date,
      dateStr: toISOString(date),
      time: timeMatch ? timeMatch[1].trim() : null,
      type: typeMatch ? typeMatch[1].trim() : null,
      status: statusMatch ? statusMatch[1].trim() : null,
      clinic: whatMatch ? whatMatch[1].trim() : null,
      location: locationMatch ? locationMatch[1].trim() : null,
      phone: phoneMatch ? phoneMatch[1].trim() : null,
      source: 'blue-button',
    });
  });

  return results;
}

// ─────────────────────────────────────────────────────────────
// UTILITY HELPERS
// ─────────────────────────────────────────────────────────────

/**
 * _inDateRange (internal)
 * Returns true if date is within the specified range (inclusive).
 * If range.start or range.end is null/undefined, that bound is ignored.
 *
 * @param {Date} date
 * @param {{ start: Date|null, end: Date|null }} range
 * @returns {boolean}
 */
function _inDateRange(date, range) {
  if (!date || isNaN(date)) return false;
  if (range.start && date < range.start) return false;
  if (range.end && date > range.end) return false;
  return true;
}

/**
 * deduplicateByDateAndType
 * Given an array of records with date and type fields, removes exact duplicates
 * (same date + same type + same primary value). Used during conflict detection.
 *
 * @param {object[]} records
 * @param {(record: object) => string} keyFn - Function that returns a unique key string
 * @returns {{ unique: object[], duplicates: object[] }}
 */
export function deduplicateByDateAndType(records, keyFn) {
  const seen = new Map();
  const unique = [];
  const duplicates = [];

  records.forEach(record => {
    const key = keyFn(record);
    if (seen.has(key)) {
      duplicates.push(record);
    } else {
      seen.set(key, true);
      unique.push(record);
    }
  });

  return { unique, duplicates };
}

/**
 * formatDateForDisplay
 * Returns a human-readable date string for UI display.
 * @param {Date|string} date
 * @returns {string}
 */
export function formatDateForDisplay(date) {
  if (!date) return 'Unknown date';
  const d = date instanceof Date ? date : new Date(date);
  if (isNaN(d)) return 'Unknown date';
  return d.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
}

/**
 * countImportableRecords
 * Returns total record counts across all parsed data.
 * Useful for the wizard summary screen.
 *
 * @param {{ vitals, labs, conditions, medications, appointments }} parsed
 * @returns {{ total: number, byType: object }}
 */
export function countImportableRecords(parsed) {
  const byType = {
    vitals: (parsed.vitals || []).length,
    labs: (parsed.labs || []).length,
    conditions: (parsed.conditions || []).length,
    medications: (parsed.medications || []).length,
    appointments: (parsed.appointments || []).length,
  };
  const total = Object.values(byType).reduce((sum, n) => sum + n, 0);
  return { total, byType };
}