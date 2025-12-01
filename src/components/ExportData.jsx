import { useState } from 'react';
import { generatePDF, generateCSV } from '../utils/export';

const ExportData = () => {
  const [dateRange, setDateRange] = useState('all');

  const handleExportPDF = () => {
    generatePDF(dateRange);
  };

  const handleExportCSV = () => {
    generateCSV(dateRange);
  };

  return (
      <div className="pb-20">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Export Data</h2>

        <div className="bg-white rounded-lg border border-gray-200 p-4 mb-4">
          <h3 className="font-medium text-gray-900 mb-3">Date Range</h3>
          <select
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          >
            <option value="7days">Last 7 Days</option>
            <option value="30days">Last 30 Days</option>
            <option value="90days">Last 90 Days</option>
            <option value="year">Last Year</option>
            <option value="all">All Time</option>
          </select>
        </div>

        <div className="space-y-3">
          <button
              onClick={handleExportPDF}
              className="w-full py-4 px-4 bg-blue-900 text-white font-semibold rounded-lg hover:bg-blue-800 flex items-center justify-center gap-2"
          >
            <span className="text-xl">📄</span>
            Export as PDF
          </button>

          <button
              onClick={handleExportCSV}
              className="w-full py-4 px-4 bg-green-700 text-white font-semibold rounded-lg hover:bg-green-600 flex items-center justify-center gap-2"
          >
            <span className="text-xl">📊</span>
            Export as CSV
          </button>
        </div>

        <div className="mt-6 bg-blue-50 rounded-lg p-4">
          <h3 className="font-medium text-blue-900 mb-2">Export Tips</h3>
          <ul className="text-sm text-blue-800 space-y-1">
            <li>• <strong>PDF</strong> — Best for sharing with your VSO or doctor</li>
            <li>• <strong>CSV</strong> — Best for spreadsheets and detailed analysis</li>
            <li>• Both formats include all symptom details, medications, and condition-specific data</li>
          </ul>
        </div>

        <div className="mt-4 bg-gray-50 rounded-lg p-4">
          <h3 className="font-medium text-gray-700 mb-2">What's Included</h3>
          <ul className="text-sm text-gray-600 space-y-1">
            <li>✓ All symptom entries with severity ratings</li>
            <li>✓ Medications taken for each symptom</li>
            <li>✓ Migraine details (prostrating, duration, triggers)</li>
            <li>✓ Sleep data (hours, quality, issues)</li>
            <li>✓ PTSD symptoms (flashbacks, avoidance, etc.)</li>
            <li>✓ Pain details (type, ROM, affected activities)</li>
            <li>✓ Summary statistics by symptom</li>
          </ul>
        </div>
      </div>
  );
};

export default ExportData;