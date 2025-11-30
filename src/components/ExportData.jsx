import { useState, useEffect } from 'react';
import { getSymptomLogs } from '../utils/storage';
import { exportToPDF, exportToCSV } from '../utils/export';

const ExportData = () => {
  const [logs, setLogs] = useState([]);
  const [dateFilter, setDateFilter] = useState('all');
  const [filteredLogs, setFilteredLogs] = useState([]);

  // Load all logs on mount
  useEffect(() => {
    const allLogs = getSymptomLogs();
    // Sort by date descending
    allLogs.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
    setLogs(allLogs);
  }, []);

  // Filter logs when date filter changes
  useEffect(() => {
    const now = new Date();
    let filtered = [...logs];

    switch (dateFilter) {
      case 'week':
        const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        filtered = logs.filter(log => new Date(log.timestamp) >= weekAgo);
        break;
      case 'month':
        const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        filtered = logs.filter(log => new Date(log.timestamp) >= monthAgo);
        break;
      case '3months':
        const threeMonthsAgo = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
        filtered = logs.filter(log => new Date(log.timestamp) >= threeMonthsAgo);
        break;
      case 'year':
        const yearAgo = new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000);
        filtered = logs.filter(log => new Date(log.timestamp) >= yearAgo);
        break;
      default:
        filtered = logs;
    }

    setFilteredLogs(filtered);
  }, [dateFilter, logs]);

  const getDateRangeLabel = () => {
    switch (dateFilter) {
      case 'week': return 'Last 7 Days';
      case 'month': return 'Last 30 Days';
      case '3months': return 'Last 90 Days';
      case 'year': return 'Last Year';
      default: return 'All Time';
    }
  };

  const handleExportPDF = () => {
    exportToPDF(filteredLogs, getDateRangeLabel());
  };

  const handleExportCSV = () => {
    exportToCSV(filteredLogs);
  };

  // Calculate summary stats for preview
  const getSummaryStats = () => {
    if (filteredLogs.length === 0) return null;

    const symptoms = {};
    filteredLogs.forEach(log => {
      if (!symptoms[log.symptomName]) {
        symptoms[log.symptomName] = { count: 0, totalSeverity: 0 };
      }
      symptoms[log.symptomName].count++;
      symptoms[log.symptomName].totalSeverity += log.severity;
    });

    return Object.entries(symptoms)
    .map(([name, data]) => ({
      name,
      count: data.count,
      avgSeverity: (data.totalSeverity / data.count).toFixed(1),
    }))
    .sort((a, b) => b.count - a.count);
  };

  const stats = getSummaryStats();

  return (
      <div className="pb-20">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Export Your Data</h2>

        {/* Date Range Filter */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Select Date Range
          </label>
          <select
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All Time</option>
            <option value="week">Last 7 Days</option>
            <option value="month">Last 30 Days</option>
            <option value="3months">Last 90 Days</option>
            <option value="year">Last Year</option>
          </select>
        </div>

        {/* Preview Stats */}
        <div className="bg-gray-50 rounded-lg p-4 mb-6">
          <h3 className="text-sm font-medium text-gray-700 mb-2">
            Preview: {getDateRangeLabel()}
          </h3>
          <p className="text-2xl font-bold text-blue-900 mb-3">
            {filteredLogs.length} {filteredLogs.length === 1 ? 'entry' : 'entries'}
          </p>

          {stats && stats.length > 0 && (
              <div className="space-y-2">
                <p className="text-xs text-gray-500 uppercase tracking-wide">Top Symptoms</p>
                {stats.slice(0, 5).map((stat, index) => (
                    <div key={index} className="flex justify-between text-sm">
                      <span className="text-gray-700">{stat.name}</span>
                      <span className="text-gray-500">
                  {stat.count}x (avg: {stat.avgSeverity})
                </span>
                    </div>
                ))}
              </div>
          )}

          {filteredLogs.length === 0 && (
              <p className="text-sm text-gray-500">No entries in this date range</p>
          )}
        </div>

        {/* Export Buttons */}
        <div className="space-y-3">
          <button
              onClick={handleExportPDF}
              disabled={filteredLogs.length === 0}
              className="w-full py-3 px-4 bg-blue-900 text-white font-semibold rounded-lg hover:bg-blue-800 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
          >
            <span>📄</span> Export as PDF
          </button>

          <button
              onClick={handleExportCSV}
              disabled={filteredLogs.length === 0}
              className="w-full py-3 px-4 bg-white text-blue-900 font-semibold rounded-lg border-2 border-blue-900 hover:bg-blue-50 disabled:bg-gray-100 disabled:border-gray-300 disabled:text-gray-400 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
          >
            <span>📊</span> Export as CSV
          </button>
        </div>

        {/* Usage Tips */}
        <div className="mt-6 p-4 bg-blue-50 rounded-lg">
          <h4 className="text-sm font-semibold text-blue-900 mb-2">💡 Tips for VA Claims</h4>
          <ul className="text-sm text-blue-800 space-y-1">
            <li>• PDF reports are ideal for C&P exams and VSO meetings</li>
            <li>• Export before medical appointments as evidence</li>
            <li>• CSV files can be opened in Excel for further analysis</li>
            <li>• Regular tracking shows consistent symptom patterns</li>
          </ul>
        </div>
      </div>
  );
};

export default ExportData;