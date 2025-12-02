import { useState, useEffect } from 'react';
import { generatePDF, generateCSV } from '../utils/export';
import { getDataStats } from '../utils/storage';

const ExportData = () => {
    const [dateRange, setDateRange] = useState('all');
    const [includeAppointments, setIncludeAppointments] = useState(true);
    const [stats, setStats] = useState({ logs: 0, appointments: 0 });

    useEffect(() => {
        const data = getDataStats();
        setStats({
            logs: data.logs || 0,
            appointments: data.appointments || 0,
        });
    }, []);

    const handleExportPDF = () => {
        generatePDF(dateRange, { includeAppointments });
    };

    const handleExportCSV = () => {
        generateCSV(dateRange, { includeAppointments });
    };

    return (
        <div className="pb-20">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Export Data</h2>

            <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4 mb-4">
                <h3 className="font-medium text-gray-900 dark:text-white mb-3">Date Range</h3>
                <select
                    value={dateRange}
                    onChange={(e) => setDateRange(e.target.value)}
                    className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                >
                    <option value="7days">Last 7 Days</option>
                    <option value="30days">Last 30 Days</option>
                    <option value="90days">Last 90 Days</option>
                    <option value="year">Last Year</option>
                    <option value="all">All Time</option>
                </select>
            </div>

            {/* Include Appointments Option */}
            {stats.appointments > 0 && (
                <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4 mb-4">
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
                </div>
            )}

            <div className="space-y-3">
                <button
                    onClick={handleExportPDF}
                    className="w-full py-4 px-4 bg-blue-900 dark:bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-800 dark:hover:bg-blue-700 flex items-center justify-center gap-2"
                >
                    <span className="text-xl">📄</span>
                    Export as PDF
                </button>

                <button
                    onClick={handleExportCSV}
                    className="w-full py-4 px-4 bg-green-700 dark:bg-green-600 text-white font-semibold rounded-lg hover:bg-green-600 dark:hover:bg-green-700 flex items-center justify-center gap-2"
                >
                    <span className="text-xl">📊</span>
                    Export as CSV
                </button>
            </div>

            <div className="mt-6 bg-blue-50 dark:bg-blue-900/30 rounded-lg p-4">
                <h3 className="font-medium text-blue-900 dark:text-blue-200 mb-2">Export Tips</h3>
                <ul className="text-sm text-blue-800 dark:text-blue-300 space-y-1">
                    <li>• <strong>PDF</strong> — Best for sharing with your VSO or doctor</li>
                    <li>• <strong>CSV</strong> — Best for spreadsheets and detailed analysis</li>
                    <li>• Both formats include all symptom details, medications, and condition-specific data</li>
                </ul>
            </div>

            <div className="mt-4 bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
                <h3 className="font-medium text-gray-700 dark:text-gray-300 mb-2">What's Included</h3>
                <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                    <li>✓ All symptom entries with severity ratings</li>
                    <li>✓ Medications taken for each symptom</li>
                    <li>✓ Migraine details (prostrating, duration, triggers)</li>
                    <li>✓ Sleep data (hours, quality, issues)</li>
                    <li>✓ PTSD symptoms (flashbacks, avoidance, etc.)</li>
                    <li>✓ Pain details (type, ROM, affected activities)</li>
                    <li>✓ Summary statistics by symptom</li>
                    {includeAppointments && stats.appointments > 0 && (
                        <li>✓ Appointment notes and C&P exam details</li>
                    )}
                </ul>
            </div>
        </div>
    );
};

export default ExportData;