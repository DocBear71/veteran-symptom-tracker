import { useState, useEffect } from 'react';
import { hapticSuccess, hapticError } from '../utils/haptics';
import {
  generatePDF,
  generateCSV,
  generateVAClaimPackagePDF,
  generateCombinedExport
} from '../utils/export';
import { getDataStats, getDiagnoses } from '../utils/storage';
import { CONDITIONS } from '../utils/ratingCriteria';
import { getPhotoStorageSummary } from '../utils/photoCapture';

/**
 * Body-system groups for the condition filter, keyed off diagnostic code
 * ranges from 38 CFR Part 4.
 *
 * Grouping by DC range rather than by source file on purpose: a Veteran has
 * already met these categories in their rating decision, so "Neurological
 * (DC 8000-8999)" is a landmark they recognize. The source files are an
 * implementation detail they've never seen.
 *
 * ORDER MATTERS — first match wins. Smell & Taste (6275-6276) sits inside the
 * ear range numerically but belongs in its own bucket under 38 CFR 4.87a, so
 * it has to be tested first. Verified against all 244 conditions; every one
 * lands in a named group, none fall through to Other.
 */
const CONDITION_GROUPS = [
  { label: 'Musculoskeletal',        min: 5000, max: 5399 },
  { label: 'Eye',                    min: 6000, max: 6099 },
  { label: 'Smell & Taste',          min: 6275, max: 6276 },
  { label: 'Ear & Hearing',          min: 6100, max: 6299 },
  { label: 'Infectious Diseases',    min: 6300, max: 6399 },
  { label: 'Nose & Throat',          min: 6500, max: 6599 },
  { label: 'Respiratory',            min: 6600, max: 6899 },
  { label: 'Cardiovascular',         min: 7000, max: 7199 },
  { label: 'Digestive',              min: 7200, max: 7399 },
  { label: 'Genitourinary',          min: 7500, max: 7599 },
  { label: 'Gynecological & Breast', min: 7600, max: 7699 },
  { label: 'Hemic & Lymphatic',      min: 7700, max: 7799 },
  { label: 'Skin',                   min: 7800, max: 7899 },
  { label: 'Endocrine',              min: 7900, max: 7999 },
  { label: 'Neurological',           min: 8000, max: 8999 },
  { label: 'Mental Health',          min: 9200, max: 9599 },
  { label: 'Dental & Oral',          min: 9900, max: 9999 },
];

/**
 * Every diagnostic code a condition carries, as an array of strings.
 *
 * Most conditions have a single `diagnosticCode`. The 21 peripheral nerve
 * conditions instead carry a `diagnosticCodes` object of paralysis, neuritis,
 * and neuralgia codes — which is why they used to render as "DC undefined".
 */
const getConditionCodes = (condition) => {
  if (condition.diagnosticCode) return [condition.diagnosticCode];
  if (condition.diagnosticCodes) return Object.values(condition.diagnosticCodes).filter(Boolean);
  return [];
};

/**
 * Which body-system group a condition belongs to.
 * Uses the first (lowest-listed) code, which for nerves is the paralysis code.
 */
const getConditionGroup = (condition) => {
  const codes = getConditionCodes(condition);
  if (codes.length === 0) return 'Other';

  const numeric = parseInt(String(codes[0]).match(/\d+/)?.[0], 10);
  if (isNaN(numeric)) return 'Other';

  const group = CONDITION_GROUPS.find(g => numeric >= g.min && numeric <= g.max);
  return group ? group.label : 'Other';
};


/**
 * id -> { name, dc } for the "Linked To" column in exported diagnoses.
 * Built here and passed in the export options because export.js can't import
 * CONDITIONS without a circular dependency.
 */
const CONDITION_NAMES = Object.values(CONDITIONS).reduce((acc, c) => {
    if (c && c.id && c.name) {
        acc[c.id] = { name: c.name, dc: getConditionCodes(c)[0] || null };
    }
    return acc;
}, {});

const ExportData = () => {
  // Date range states
  const [dateRangeType, setDateRangeType] = useState('preset'); // 'preset' or 'custom'
  const [presetRange, setPresetRange] = useState('90days');
  const [customStartDate, setCustomStartDate] = useState('');
  const [customEndDate, setCustomEndDate] = useState('');

  // Filter states
  const [selectedConditions, setSelectedConditions] = useState([]);
  // Condition filter UI — 244 conditions is unusable as a flat list
  const [conditionSearch, setConditionSearch] = useState('');
  const [expandedGroups, setExpandedGroups] = useState([]);
  const [includeAppointments, setIncludeAppointments] = useState(true);
  const [includeSurgeries, setIncludeSurgeries] = useState(true);
  // On by default. Applies to the VA Claim Package and CSV; the standard
  // report has no diagnoses section.
  const [includeDiagnoses, setIncludeDiagnoses] = useState(true);
  const [diagnosisCounts, setDiagnosisCounts] = useState({ exportable: 0, excluded: 0 });
  const [includeMeasurements, setIncludeMeasurements] = useState(true);
  const [includeMedications, setIncludeMedications] = useState(true);
  const [include8940Worksheet, setInclude8940Worksheet] = useState(true);
  // Off by default — routine vaccines aren't rating evidence, so they don't
  // belong in a filing package unless the Veteran deliberately wants them.
  // Adverse reactions print regardless of this setting.
  const [includeImmunizations, setIncludeImmunizations] = useState(false);
  // Off by default. Photos make the PDF large, and a Veteran should choose to
  // include them rather than be surprised by a 12 MB attachment.
  const [includePhotos, setIncludePhotos] = useState(false);
  const [photoSummary, setPhotoSummary] = useState({ count: 0, formatted: '0 B' });

  useEffect(() => {
    getPhotoStorageSummary()
    .then(setPhotoSummary)
    .catch(() => { /* non-critical */ });
  }, []);

  // Export format
  const [exportFormat, setExportFormat] = useState('standard'); // 'standard' or 'va-claim'

  // Stats
  const [stats, setStats] = useState({
    logs: 0,
    appointments: 0,
    measurements: 0
  });

  // UI states
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [exportAction, setExportAction] = useState('share'); // 'share' or 'save'

    // How many diagnoses will export, and how many the Veteran chose to keep out.
    // The "kept out" count is shown here, never in the PDF.
    useEffect(() => {
        const all = getDiagnoses();
        const excluded = all.filter(d => d.excludeFromExport).length;
        setDiagnosisCounts({ exportable: all.length - excluded, excluded });
    }, []);

  useEffect(() => {
    const data = getDataStats();
    setStats({
      logs: data.logs || 0,
      appointments: data.appointments || 0,
      surgeries: data.surgeries || 0,
      measurements: data.measurements || 0,
    });
  }, []);

  // Get date range for export
  const getDateRange = () => {
    if (dateRangeType === 'custom') {
      return {
        type: 'custom',
        startDate: customStartDate,
        endDate: customEndDate,
      };
    }
    return presetRange;
  };

  // Get export options
  const getExportOptions = () => {
    return {
      exportAction,
      includeAppointments,
      includeSurgeries,
      includeDiagnoses,
      conditionNames: CONDITION_NAMES,
      includeMeasurements,
      includeMedications,
      // Only pass worksheet option when VA Claim format is active
      include8940Worksheet: exportFormat === 'va-claim' ? include8940Worksheet : false,
      // VA Claim format only. The standard report always includes the full
      // immunization record, so this flag doesn't apply there.
      includeImmunizations: exportFormat === 'va-claim' ? includeImmunizations : false,
      // VA Claim format only — the standard report has no photo section.
      includePhotos: exportFormat === 'va-claim' ? includePhotos : false,
      conditions: selectedConditions.length > 0 ? selectedConditions : null,
      vaFormat: exportFormat === 'va-claim',
    };
  };

  // Handle condition selection
  const toggleCondition = (conditionId) => {
    setSelectedConditions(prev =>
        prev.includes(conditionId)
            ? prev.filter(id => id !== conditionId)
            : [...prev, conditionId]
    );
  };

  const selectAllConditions = () => {
    // Must be condition.id, NOT Object.keys(). The checkboxes test
    // selectedConditions.includes(condition.id), so pushing the object keys
    // ('LOSS_OF_TASTE') meant Select All ticked nothing and handed the
    // exporter 244 identifiers it doesn't recognize.
    setSelectedConditions(Object.values(CONDITIONS).map(c => c.id).filter(Boolean));
  };

  const clearAllConditions = () => {
    setSelectedConditions([]);
  };

  const toggleGroup = (groupLabel) => {
    setExpandedGroups(prev =>
        prev.includes(groupLabel)
            ? prev.filter(g => g !== groupLabel)
            : [...prev, groupLabel]
    );
  };

  /**
   * Conditions bucketed by body system, filtered by the search box,
   * alphabetical within each group, empty groups dropped.
   */
  const getGroupedConditions = () => {
    const term = conditionSearch.trim().toLowerCase();

    const matches = Object.values(CONDITIONS).filter(condition => {
      if (!term) return true;
      // Search name and every diagnostic code, so "8620" and "sciatic"
      // both find the same condition
      const haystack = [
        condition.name || '',
        ...getConditionCodes(condition),
      ].join(' ').toLowerCase();
      return haystack.includes(term);
    });

    const buckets = {};
    matches.forEach(condition => {
      const group = getConditionGroup(condition);
      if (!buckets[group]) buckets[group] = [];
      buckets[group].push(condition);
    });

    // Preserve CONDITION_GROUPS order, with any stragglers last
    const ordered = [...CONDITION_GROUPS.map(g => g.label), 'Other'];

    return ordered
    .filter(label => buckets[label]?.length > 0)
    .map(label => ({
      label,
      conditions: buckets[label].sort((a, b) =>
          (a.name || '').localeCompare(b.name || '')
      ),
      selectedCount: buckets[label].filter(c =>
          selectedConditions.includes(c.id)
      ).length,
    }));
  };

  // Export handlers
  const handleExportPDF = async () => {
    setIsExporting(true);
    try {
      const dateRange = getDateRange();
      const options = getExportOptions();

      if (exportFormat === 'va-claim') {
        await generateVAClaimPackagePDF(dateRange, options);
      } else {
        await generatePDF(dateRange, options);
      }
      hapticSuccess();
    } catch (error) {
      hapticError();
      console.error('Export error:', error);
      alert('Error generating PDF. Please try again.');
    } finally {
      setIsExporting(false);
    }
  };

  const handleExportCSV = async () => {
    setIsExporting(true);
    try {
      const dateRange = getDateRange();
      const options = getExportOptions();
      await generateCSV(dateRange, options);
      hapticSuccess();
    } catch (error) {
      hapticError();
      console.error('Export error:', error);
      alert('Error generating CSV. Please try again.');
    } finally {
      setIsExporting(false);
    }
  };

  const handleCombinedExport = async () => {
    setIsExporting(true);
    try {
      const dateRange = getDateRange();
      const options = getExportOptions();
      await generateCombinedExport(dateRange, options);
      hapticSuccess();
    } catch (error) {
      hapticError();
      console.error('Export error:', error);
      alert('Error generating combined export. Please try again.');
    } finally {
      setIsExporting(false);
    }
  };

  // Get condition label.
  // Peripheral nerves carry three codes (paralysis/neuritis/neuralgia) rather
  // than one, and joining them keeps the label honest instead of printing
  // "DC undefined" for all 21 of them.
  const getConditionLabel = (condition) => {
    const codes = getConditionCodes(condition);
    if (codes.length === 0) return condition.name;
    return `${condition.name} (DC ${codes.join('/')})`;
  };

  // Validate custom date range
  const isCustomRangeValid = () => {
    if (dateRangeType !== 'custom') return true;
    if (!customStartDate || !customEndDate) return false;
    return new Date(customStartDate) <= new Date(customEndDate);
  };

  return (
      <div className="pb-20 space-y-4">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Export Data & Reports
        </h2>

        {/* Export Format Selection */}
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4">
          <h3 className="font-medium text-gray-900 dark:text-white mb-3">Export Format</h3>
          <div className="space-y-2">
            <label className="flex items-start gap-3 cursor-pointer p-3 rounded-lg border-2 transition-colors hover:bg-gray-50 dark:hover:bg-gray-700/50"
                   style={{ borderColor: exportFormat === 'standard' ? '#3b82f6' : 'transparent' }}>
              <input
                  type="radio"
                  name="exportFormat"
                  value="standard"
                  checked={exportFormat === 'standard'}
                  onChange={(e) => setExportFormat(e.target.value)}
                  className="mt-1"
              />
              <div className="flex-1">
                <p className="font-medium text-gray-900 dark:text-white text-left">Standard Report</p>
                <p className="text-sm text-gray-500 dark:text-gray-400 text-left">
                  Comprehensive symptom log with all details - best for personal records
                </p>
              </div>
            </label>

            <label className="flex items-start gap-3 cursor-pointer p-3 rounded-lg border-2 transition-colors hover:bg-gray-50 dark:hover:bg-gray-700/50"
                   style={{ borderColor: exportFormat === 'va-claim' ? '#3b82f6' : 'transparent' }}>
              <input
                  type="radio"
                  name="exportFormat"
                  value="va-claim"
                  checked={exportFormat === 'va-claim'}
                  onChange={(e) => setExportFormat(e.target.value)}
                  className="mt-1"
              />
              <div className="flex-1">
                <p className="font-medium text-gray-900 dark:text-white text-left">
                  VA Claim Package 📋
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400 text-left">
                  Professional format optimized for VA disability claims with rating evidence
                </p>
              </div>
            </label>
          </div>
        </div>

        {/* Date Range Selection */}
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4">
          <h3 className="font-medium text-gray-900 dark:text-white mb-3">Date Range</h3>

          <div className="flex gap-2 mb-3">
            <button
                onClick={() => setDateRangeType('preset')}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                    dateRangeType === 'preset'
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                }`}
            >
              Preset Ranges
            </button>
            <button
                onClick={() => setDateRangeType('custom')}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                    dateRangeType === 'custom'
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                }`}
            >
              Custom Range
            </button>
          </div>

          {dateRangeType === 'preset' ? (
              <select
                  value={presetRange}
                  onChange={(e) => setPresetRange(e.target.value)}
                  className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
              >
                <option value="7days">Last 7 Days</option>
                <option value="30days">Last 30 Days (1 month)</option>
                <option value="60days">Last 60 Days (2 months)</option>
                <option value="90days">Last 90 Days (3 months) - VA Standard</option>
                <option value="180days">Last 180 Days (6 months)</option>
                <option value="year">Last Year</option>
                <option value="all">All Time</option>
              </select>
          ) : (
              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Start Date
                  </label>
                  <input
                      type="date"
                      value={customStartDate}
                      onChange={(e) => setCustomStartDate(e.target.value)}
                      className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    End Date
                  </label>
                  <input
                      type="date"
                      value={customEndDate}
                      onChange={(e) => setCustomEndDate(e.target.value)}
                      className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                {!isCustomRangeValid() && customStartDate && customEndDate && (
                    <p className="text-sm text-red-600 dark:text-red-400">
                      End date must be after start date
                    </p>
                )}
              </div>
          )}
        </div>

        {/* Advanced Filters */}
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
          <button
              onClick={() => setShowAdvanced(!showAdvanced)}
              className="w-full p-4 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
          >
            <h3 className="font-medium text-gray-900 dark:text-white">
              Advanced Filters & Options
            </h3>
            <svg
                className={`w-5 h-5 text-gray-400 transition-transform ${showAdvanced ? 'rotate-180' : ''}`}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>

          {showAdvanced && (
              <div className="p-4 border-t border-gray-200 dark:border-gray-700 space-y-4">
                {/* Include Options */}
                <div className="space-y-3">
                  <label key="opt-appointments" className="flex items-center gap-3 cursor-pointer">
                    <input
                        type="checkbox"
                        checked={includeAppointments}
                        onChange={(e) => setIncludeAppointments(e.target.checked)}
                        className="w-5 h-5 rounded border-gray-300 dark:border-gray-600 text-blue-600 focus:ring-blue-500"
                    />
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white text-left ">Include Appointments</p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {stats.appointments} appointment{stats.appointments !== 1 ? 's' : ''} logged
                      </p>
                    </div>
                  </label>
                  <label key="opt-surgeries" className="flex items-center gap-3 cursor-pointer">
                    <input
                        type="checkbox"
                        checked={includeSurgeries}
                        onChange={(e) => setIncludeSurgeries(e.target.checked)}
                        className="w-5 h-5 rounded border-gray-300 dark:border-gray-600 text-blue-600 focus:ring-blue-500"
                    />
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white text-left">Include Surgeries</p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {stats.surgeries || 0} surger{stats.surgeries !== 1 ? 'ies' : 'y'} logged
                      </p>
                    </div>
                  </label>

                    <label key="opt-diagnoses" className="flex items-center gap-3 cursor-pointer">
                        <input
                            type="checkbox"
                            checked={includeDiagnoses}
                            onChange={(e) => setIncludeDiagnoses(e.target.checked)}
                            className="w-5 h-5 rounded border-gray-300 dark:border-gray-600 text-blue-600 focus:ring-blue-500"
                        />
                        <div>
                            <p className="font-medium text-gray-900 dark:text-white text-left">Include Diagnoses</p>
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                                {diagnosisCounts.exportable} diagnos{diagnosisCounts.exportable === 1 ? 'is' : 'es'} will
                                be included in the VA Claim Package and CSV
                            </p>
                            {diagnosisCounts.excluded > 0 && (
                                <p className="text-sm text-amber-700 dark:text-amber-400">
                                    {diagnosisCounts.excluded} marked "leave out of exports" will not be included.
                                    The export doesn't mention them.
                                </p>
                            )}
                        </div>
                    </label>

                  <label key="opt-measurements" className="flex items-center gap-3 cursor-pointer">
                    <input
                        type="checkbox"
                        checked={includeMeasurements}
                        onChange={(e) => setIncludeMeasurements(e.target.checked)}
                        className="w-5 h-5 rounded border-gray-300 dark:border-gray-600 text-blue-600 focus:ring-blue-500"
                    />
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white text-left ">Include Measurements</p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Blood pressure, glucose, FEV-1, etc.
                      </p>
                    </div>
                  </label>

                  <label key="opt-medications" className="flex items-center gap-3 cursor-pointer">
                    <input
                        type="checkbox"
                        checked={includeMedications}
                        onChange={(e) => setIncludeMedications(e.target.checked)}
                        className="w-5 h-5 rounded border-gray-300 dark:border-gray-600 text-blue-600 focus:ring-blue-500"
                    />
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white text-left">Include Medications</p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Medication logs with effectiveness and side effects
                      </p>
                    </div>
                  </label>
                    {/* Symptom photos — VA Claim Package only, off by default */}
                    {exportFormat === 'va-claim' && photoSummary.count > 0 && (
                        <label key="opt-photos" className="flex items-center gap-3 cursor-pointer">
                            <input
                                type="checkbox"
                                checked={includePhotos}
                                onChange={(e) => setIncludePhotos(e.target.checked)}
                                className="w-5 h-5 rounded border-gray-300 dark:border-gray-600 text-blue-600 focus:ring-blue-500"
                            />
                            <div>
                                <p className="font-medium text-gray-900 dark:text-white text-left">
                                    Include symptom photos
                                </p>
                                <p className="text-sm text-gray-500 dark:text-gray-400">
                                    {photoSummary.count} photo{photoSummary.count === 1 ? '' : 's'} ({photoSummary.formatted}).
                                    Visible evidence like rashes, swelling, or bruising is hard to describe and easy to show.
                                    Adds roughly this much to the PDF size.
                                </p>
                            </div>
                        </label>
                    )}
                    {/* Full immunization record — VA Claim Package only, off by default */}
                    {exportFormat === 'va-claim' && (
                        <label key="opt-immunizations" className="flex items-center gap-3 cursor-pointer">
                            <input
                                type="checkbox"
                                checked={includeImmunizations}
                                onChange={(e) => setIncludeImmunizations(e.target.checked)}
                                className="w-5 h-5 rounded border-gray-300 dark:border-gray-600 text-blue-600 focus:ring-blue-500"
                            />
                            <div>
                                <p className="font-medium text-gray-900 dark:text-white text-left">
                                    Include full immunization record
                                </p>
                                <p className="text-sm text-gray-500 dark:text-gray-400">
                                    Routine vaccines aren't rating evidence, so they're left out by default.
                                    Adverse reactions are always included.
                                </p>
                            </div>
                        </label>
                    )}
                  {/* 21-8940 Worksheet — only relevant for VA Claim Package format */}
                  {exportFormat === 'va-claim' && (
                      <label key="opt-worksheet" className="flex items-center gap-3 cursor-pointer">
                        <input
                            type="checkbox"
                            checked={include8940Worksheet}
                            onChange={(e) => setInclude8940Worksheet(e.target.checked)}
                            className="w-5 h-5 rounded border-gray-300 dark:border-gray-600 text-blue-600 focus:ring-blue-500"
                        />
                        <div>
                          <p className="font-medium text-gray-900 dark:text-white text-left">
                            Include 21-8940 Worksheet
                          </p>
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            Appends your TDIU employment history worksheet if data exists
                          </p>
                        </div>
                      </label>
                  )}
                </div>

                {/* Condition Filter */}
                <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="font-medium text-gray-900 dark:text-white">
                      Filter by Condition
                    </h4>
                    <div className="flex gap-2">
                      <button
                          onClick={selectAllConditions}
                          className="text-sm text-blue-600 dark:text-blue-400 hover:underline"
                      >
                        Select All
                      </button>
                      <span className="text-gray-400">|</span>
                      <button
                          onClick={clearAllConditions}
                          className="text-sm text-blue-600 dark:text-blue-400 hover:underline"
                      >
                        Clear All
                      </button>
                    </div>
                  </div>

                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">
                    {selectedConditions.length === 0
                        ? 'Showing all conditions (default)'
                        : `Showing ${selectedConditions.length} condition${selectedConditions.length !== 1 ? 's' : ''}`
                    }
                  </p>

                  {/* Search — the fastest path when you know what you want */}
                  <div className="relative mb-2">
                    <input
                        type="search"
                        value={conditionSearch}
                        onChange={(e) => setConditionSearch(e.target.value)}
                        placeholder="Search conditions or DC number..."
                        aria-label="Search conditions"
                        className="w-full p-3 pl-9 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
                    />
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
                      🔍
                    </span>
                  </div>

                  <div className="max-h-96 overflow-y-auto border border-gray-200 dark:border-gray-600 rounded-lg p-2 space-y-1">
                    {getGroupedConditions().length === 0 && (
                        <p className="text-sm text-gray-500 dark:text-gray-400 p-3 text-center">
                          No conditions match "{conditionSearch}"
                        </p>
                    )}

                    {getGroupedConditions().map((group) => {
                      // A search is an explicit request to see matches, so
                      // matching groups open themselves rather than making the
                      // user click through to find what they just searched for.
                      const isOpen = conditionSearch.trim().length > 0
                          || expandedGroups.includes(group.label);

                      return (
                          <div key={group.label}>
                            <button
                                type="button"
                                onClick={() => toggleGroup(group.label)}
                                aria-expanded={isOpen}
                                className="w-full flex items-center justify-between gap-2 p-2 rounded hover:bg-gray-50 dark:hover:bg-gray-700/50 text-left"
                            >
                              <span className="flex items-center gap-2 min-w-0">
                                <span className="text-gray-400 text-xs flex-shrink-0">
                                  {isOpen ? '▼' : '▶'}
                                </span>
                                <span className="text-sm font-medium text-gray-900 dark:text-white truncate">
                                  {group.label}
                                </span>
                                <span className="text-xs text-gray-500 dark:text-gray-400 flex-shrink-0">
                                  ({group.conditions.length})
                                </span>
                              </span>
                              {group.selectedCount > 0 && (
                                  <span className="text-xs px-2 py-0.5 rounded-full bg-blue-100 dark:bg-blue-900/40 text-blue-800 dark:text-blue-300 flex-shrink-0">
                                    {group.selectedCount} selected
                                  </span>
                              )}
                            </button>

                            {isOpen && (
                                <div className="pl-6 space-y-1">
                                  {group.conditions.map((condition) => (
                                      <label
                                          key={condition.id || condition.name}
                                          className="flex items-center gap-2 p-2 rounded hover:bg-gray-50 dark:hover:bg-gray-700/50 cursor-pointer"
                                      >
                                        <input
                                            type="checkbox"
                                            checked={selectedConditions.includes(condition.id)}
                                            onChange={() => toggleCondition(condition.id)}
                                            className="rounded border-gray-300 dark:border-gray-600 text-blue-600 focus:ring-blue-500"
                                        />
                                        <span className="text-sm text-gray-700 dark:text-gray-300">
                                          {getConditionLabel(condition)}
                                        </span>
                                      </label>
                                  ))}
                                </div>
                            )}
                          </div>
                      );
                    })}
                  </div>
                </div>
              </div>
          )}
        </div>

        {/* Save vs Share Toggle */}
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4">
          <h3 className="font-medium text-gray-900 dark:text-white mb-3">Export Action</h3>
          <div className="flex gap-2">
            <button
                onClick={() => setExportAction('save')}
                className={`flex-1 py-3 px-4 rounded-lg font-medium transition-colors flex items-center justify-center gap-2 ${
                    exportAction === 'save'
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                }`}
            >
              <span>💾</span> Save to Device
            </button>
            <button
                onClick={() => setExportAction('share')}
                className={`flex-1 py-3 px-4 rounded-lg font-medium transition-colors flex items-center justify-center gap-2 ${
                    exportAction === 'share'
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                }`}
            >
              <span>📤</span> Share / Send
            </button>
          </div>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-2 text-center">
            {exportAction === 'save'
                ? 'Choose Downloads, Drive, or a file manager app to save'
                : 'Choose to email, message, or save via share sheet'}
          </p>
        </div>

        {/* Export Buttons */}
        <div className="space-y-3">
          <button
              onClick={handleExportPDF}
              disabled={isExporting || !isCustomRangeValid()}
              className="w-full py-4 px-4 bg-blue-900 dark:bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-800 dark:hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 transition-colors"
          >
            {isExporting ? (
                <>
                  <span className="animate-spin">⏳</span>
                  Generating...
                </>
            ) : (
                <>
                  <span className="text-xl">📄</span>
                  Export as PDF
                  {exportFormat === 'va-claim' && ' (VA Claim Package)'}
                </>
            )}
          </button>

          <button
              onClick={handleExportCSV}
              disabled={isExporting || !isCustomRangeValid()}
              className="w-full py-4 px-4 bg-green-700 dark:bg-green-600 text-white font-semibold rounded-lg hover:bg-green-600 dark:hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 transition-colors"
          >
            {isExporting ? (
                <>
                  <span className="animate-spin">⏳</span>
                  Generating...
                </>
            ) : (
                <>
                  <span className="text-xl">📊</span>
                  Export as CSV
                </>
            )}
          </button>

          <button
              onClick={handleCombinedExport}
              disabled={isExporting || !isCustomRangeValid()}
              className="w-full py-4 px-4 bg-purple-700 dark:bg-purple-600 text-white font-semibold rounded-lg hover:bg-purple-600 dark:hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 transition-colors"
          >
            {isExporting ? (
                <>
                  <span className="animate-spin">⏳</span>
                  Generating...
                </>
            ) : (
                <>
                  <span className="text-xl">📦</span>
                  Combined Export (PDF + CSV)
                </>
            )}
          </button>
        </div>

        {/* Information Cards */}
        <div className="mt-6 bg-blue-50 dark:bg-blue-900/30 rounded-lg p-4">
          <h3 className="font-medium text-blue-900 dark:text-blue-200 mb-2">
            {exportFormat === 'va-claim' ? 'VA Claim Package Features' : 'Export Tips'}
          </h3>
          {exportFormat === 'va-claim' ? (
              <ul className="text-sm text-blue-800 dark:text-blue-300 space-y-1 text-left">
                <li>• Professional cover page with claim information</li>
                <li>• Rating evidence analysis for each tracked condition</li>
                <li>• Symptom frequency analysis aligned to VA criteria</li>
                <li>• Charts for measurements (BP, glucose, etc.)</li>
                <li>• Diagnosed conditions with diagnosis dates and record sources</li>
                <li>• Formatted for easy review by VSO or claims examiner</li>
                <li>• Includes supporting documentation checklist</li>
                <li>• Optionally appends 21-8940 TDIU worksheet (if completed)</li>
              </ul>
          ) : (
              <ul className="text-sm text-blue-800 dark:text-blue-300 space-y-1">
                <li>• <strong>PDF</strong> – Best for sharing with your VSO or doctor</li>
                <li>• <strong>CSV</strong> – Best for spreadsheets and detailed analysis</li>
                <li>• <strong>Combined</strong> – Downloads both formats at once</li>
                <li>• All formats include complete symptom details and condition-specific data</li>
              </ul>
          )}
        </div>

        <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
          <h3 className="font-medium text-gray-700 dark:text-gray-300 mb-2">Data Summary</h3>
          <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
            <li>✓ {stats.logs} symptom {stats.logs !== 1 ? 'entries' : 'entry'} logged</li>
            <li>✓ {stats.appointments} appointment{stats.appointments !== 1 ? 's' : ''} recorded</li>
            {stats.measurements > 0 && (
                <li>✓ {stats.measurements} measurement{stats.measurements !== 1 ? 's' : ''} tracked</li>
            )}
            <li>✓ 29 VA conditions available for tracking</li>
            <li>✓ Condition-specific data fields (migraine, sleep, PTSD, pain, etc.)</li>
          </ul>
        </div>
      </div>
  );
};

export default ExportData;