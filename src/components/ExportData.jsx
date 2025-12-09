import { useState, useEffect } from 'react';
import {
  generatePDF,
  generateCSV,
  generateVAClaimPackagePDF,
  generateCombinedExport
} from '../utils/export';
import { getDataStats } from '../utils/storage';
import { CONDITIONS } from '../utils/ratingCriteria';

const ExportData = () => {
  // Date range states
  const [dateRangeType, setDateRangeType] = useState('preset'); // 'preset' or 'custom'
  const [presetRange, setPresetRange] = useState('90days');
  const [customStartDate, setCustomStartDate] = useState('');
  const [customEndDate, setCustomEndDate] = useState('');

  // Filter states
  const [selectedConditions, setSelectedConditions] = useState([]);
  const [includeAppointments, setIncludeAppointments] = useState(true);
  const [includeMeasurements, setIncludeMeasurements] = useState(true);
  const [includeMedications, setIncludeMedications] = useState(true);

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

  useEffect(() => {
    const data = getDataStats();
    setStats({
      logs: data.logs || 0,
      appointments: data.appointments || 0,
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
      includeAppointments,
      includeMeasurements,
      includeMedications,
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
    setSelectedConditions(Object.keys(CONDITIONS));
  };

  const clearAllConditions = () => {
    setSelectedConditions([]);
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
    } catch (error) {
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
    } catch (error) {
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
    } catch (error) {
      console.error('Export error:', error);
      alert('Error generating combined export. Please try again.');
    } finally {
      setIsExporting(false);
    }
  };

  // Get condition label
  const getConditionLabel = (condition) => {
    return `${condition.name} (DC ${condition.diagnosticCode})`;
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
                <p className="font-medium text-gray-900 dark:text-white">Standard Report</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
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
                <p className="font-medium text-gray-900 dark:text-white">
                  VA Claim Package 📋
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
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
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                        type="checkbox"
                        checked={includeAppointments}
                        onChange={(e) => setIncludeAppointments(e.target.checked)}
                        className="w-5 h-5 rounded border-gray-300 dark:border-gray-600 text-blue-600 focus:ring-blue-500"
                    />
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">Include Appointments</p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {stats.appointments} appointment{stats.appointments !== 1 ? 's' : ''} logged
                      </p>
                    </div>
                  </label>

                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                        type="checkbox"
                        checked={includeMeasurements}
                        onChange={(e) => setIncludeMeasurements(e.target.checked)}
                        className="w-5 h-5 rounded border-gray-300 dark:border-gray-600 text-blue-600 focus:ring-blue-500"
                    />
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">Include Measurements</p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Blood pressure, glucose, FEV-1, etc.
                      </p>
                    </div>
                  </label>

                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                        type="checkbox"
                        checked={includeMedications}
                        onChange={(e) => setIncludeMedications(e.target.checked)}
                        className="w-5 h-5 rounded border-gray-300 dark:border-gray-600 text-blue-600 focus:ring-blue-500"
                    />
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">Include Medications</p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Medication usage linked to symptoms
                      </p>
                    </div>
                  </label>
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

                  <div className="max-h-48 overflow-y-auto border border-gray-200 dark:border-gray-600 rounded-lg p-2 space-y-1">
                    {Object.values(CONDITIONS).map((condition) => (
                        <label
                            key={condition.id}
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
                </div>
              </div>
          )}
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
              <ul className="text-sm text-blue-800 dark:text-blue-300 space-y-1">
                <li>• Professional cover page with claim information</li>
                <li>• Rating evidence analysis for each tracked condition</li>
                <li>• Symptom frequency analysis aligned to VA criteria</li>
                <li>• Charts for measurements (BP, glucose, etc.)</li>
                <li>• Formatted for easy review by VSO or claims examiner</li>
                <li>• Includes supporting documentation checklist</li>
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