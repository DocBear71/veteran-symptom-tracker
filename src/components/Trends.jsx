import { useState, useEffect } from 'react';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import { getSymptomLogs } from '../utils/storage';

const Trends = () => {
  const [logs, setLogs] = useState([]);
  const [dateRange, setDateRange] = useState('month');
  const [selectedSymptom, setSelectedSymptom] = useState('all');
  const [availableSymptoms, setAvailableSymptoms] = useState([]);

  useEffect(() => {
    loadData();
  }, [dateRange]);

  const loadData = () => {
    let allLogs = getSymptomLogs();

    // Filter by date range
    const now = new Date();
    let startDate;

    switch (dateRange) {
      case 'week':
        startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        break;
      case 'month':
        startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        break;
      case '3months':
        startDate = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
        break;
      case 'year':
        startDate = new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000);
        break;
      default:
        startDate = new Date(0); // All time
    }

    allLogs = allLogs.filter(log => new Date(log.timestamp) >= startDate);
    allLogs.sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));

    setLogs(allLogs);

    // Get unique symptoms
    const symptoms = [...new Set(allLogs.map(log => log.symptomName))];
    setAvailableSymptoms(symptoms);
  };

  // Filter logs by selected symptom
  const filteredLogs = selectedSymptom === 'all'
      ? logs
      : logs.filter(log => log.symptomName === selectedSymptom);

  // Prepare data for severity over time chart
  const getSeverityOverTimeData = () => {
    if (filteredLogs.length === 0) return [];

    // Group by date
    const byDate = {};
    filteredLogs.forEach(log => {
      const date = new Date(log.timestamp).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
      });

      if (!byDate[date]) {
        byDate[date] = { date, totalSeverity: 0, count: 0, maxSeverity: 0 };
      }
      byDate[date].totalSeverity += log.severity;
      byDate[date].count++;
      byDate[date].maxSeverity = Math.max(byDate[date].maxSeverity, log.severity);
    });

    return Object.values(byDate).map(day => ({
      date: day.date,
      avgSeverity: Math.round((day.totalSeverity / day.count) * 10) / 10,
      maxSeverity: day.maxSeverity,
      entries: day.count,
    }));
  };

  // Prepare data for symptom frequency chart
  const getSymptomFrequencyData = () => {
    const frequency = {};
    logs.forEach(log => {
      if (!frequency[log.symptomName]) {
        frequency[log.symptomName] = { name: log.symptomName, count: 0, totalSeverity: 0 };
      }
      frequency[log.symptomName].count++;
      frequency[log.symptomName].totalSeverity += log.severity;
    });

    return Object.values(frequency)
    .map(item => ({
      ...item,
      avgSeverity: Math.round((item.totalSeverity / item.count) * 10) / 10,
    }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 10); // Top 10
  };

  // Prepare migraine-specific data
  const getMigraineData = () => {
    const migraineLogs = logs.filter(log => log.migraineData);
    if (migraineLogs.length === 0) return null;

    const prostrating = migraineLogs.filter(log => log.migraineData.prostrating).length;
    const nonProstrating = migraineLogs.length - prostrating;

    // Duration breakdown
    const durations = {};
    migraineLogs.forEach(log => {
      const dur = log.migraineData.duration || 'Unknown';
      durations[dur] = (durations[dur] || 0) + 1;
    });

    return {
      total: migraineLogs.length,
      prostrating,
      nonProstrating,
      prostratingPercent: Math.round((prostrating / migraineLogs.length) * 100),
      durations,
    };
  };

  const severityData = getSeverityOverTimeData();
  const frequencyData = getSymptomFrequencyData();
  const migraineData = getMigraineData();

  // Calculate summary stats
  const totalEntries = filteredLogs.length;
  const avgSeverity = totalEntries > 0
      ? Math.round((filteredLogs.reduce((sum, log) => sum + log.severity, 0) / totalEntries) * 10) / 10
      : 0;
  const maxSeverity = totalEntries > 0
      ? Math.max(...filteredLogs.map(log => log.severity))
      : 0;

  return (
      <div className="pb-20">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Trends & Patterns</h2>

        {/* Filters */}
        <div className="flex gap-2 mb-4 flex-wrap">
          <select
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500"
          >
            <option value="week">Last 7 Days</option>
            <option value="month">Last 30 Days</option>
            <option value="3months">Last 90 Days</option>
            <option value="year">Last Year</option>
            <option value="all">All Time</option>
          </select>

          <select
              value={selectedSymptom}
              onChange={(e) => setSelectedSymptom(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All Symptoms</option>
            {availableSymptoms.map(symptom => (
                <option key={symptom} value={symptom}>{symptom}</option>
            ))}
          </select>
        </div>

        {/* No Data State */}
        {logs.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <p className="text-4xl mb-2">📊</p>
              <p>No data to display</p>
              <p className="text-sm">Start logging symptoms to see trends</p>
            </div>
        ) : (
            <>
              {/* Summary Stats */}
              <div className="grid grid-cols-3 gap-3 mb-6">
                <div className="bg-white rounded-lg border border-gray-200 p-3 text-center">
                  <p className="text-2xl font-bold text-blue-900">{totalEntries}</p>
                  <p className="text-xs text-gray-500">Total Entries</p>
                </div>
                <div className="bg-white rounded-lg border border-gray-200 p-3 text-center">
                  <p className="text-2xl font-bold text-orange-500">{avgSeverity}</p>
                  <p className="text-xs text-gray-500">Avg Severity</p>
                </div>
                <div className="bg-white rounded-lg border border-gray-200 p-3 text-center">
                  <p className="text-2xl font-bold text-red-600">{maxSeverity}</p>
                  <p className="text-xs text-gray-500">Max Severity</p>
                </div>
              </div>

              {/* Severity Over Time Chart */}
              {severityData.length > 1 && (
                  <div className="bg-white rounded-lg border border-gray-200 p-4 mb-4">
                    <h3 className="font-medium text-gray-900 mb-3">Severity Over Time</h3>
                    <div className="h-64">
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={severityData}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis
                              dataKey="date"
                              tick={{ fontSize: 12 }}
                              interval="preserveStartEnd"
                          />
                          <YAxis
                              domain={[0, 10]}
                              tick={{ fontSize: 12 }}
                          />
                          <Tooltip />
                          <Legend />
                          <Line
                              type="monotone"
                              dataKey="avgSeverity"
                              stroke="#1e3a8a"
                              strokeWidth={2}
                              name="Avg Severity"
                              dot={{ fill: '#1e3a8a' }}
                          />
                          <Line
                              type="monotone"
                              dataKey="maxSeverity"
                              stroke="#dc2626"
                              strokeWidth={2}
                              name="Max Severity"
                              dot={{ fill: '#dc2626' }}
                          />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
              )}

              {/* Symptom Frequency Chart */}
              {frequencyData.length > 0 && selectedSymptom === 'all' && (
                  <div className="bg-white rounded-lg border border-gray-200 p-4 mb-4">
                    <h3 className="font-medium text-gray-900 mb-3">Most Frequent Symptoms</h3>
                    <div className="h-64">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={frequencyData} layout="vertical">
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis type="number" tick={{ fontSize: 12 }} />
                          <YAxis
                              type="category"
                              dataKey="name"
                              tick={{ fontSize: 11 }}
                              width={100}
                          />
                          <Tooltip />
                          <Bar dataKey="count" fill="#1e3a8a" name="Occurrences" />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
              )}

              {/* Migraine Summary */}
              {migraineData && (
                  <div className="bg-purple-50 rounded-lg border border-purple-200 p-4 mb-4">
                    <h3 className="font-medium text-purple-900 mb-3">Migraine Summary</h3>

                    <div className="grid grid-cols-2 gap-3 mb-3">
                      <div className="bg-white rounded-lg p-3 text-center">
                        <p className="text-2xl font-bold text-purple-900">{migraineData.total}</p>
                        <p className="text-xs text-gray-500">Total Migraines</p>
                      </div>
                      <div className="bg-white rounded-lg p-3 text-center">
                        <p className="text-2xl font-bold text-red-600">{migraineData.prostratingPercent}%</p>
                        <p className="text-xs text-gray-500">Prostrating</p>
                      </div>
                    </div>

                    <div className="bg-white rounded-lg p-3">
                      <p className="text-sm font-medium text-gray-700 mb-2">Breakdown</p>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Prostrating:</span>
                        <span className="font-medium text-red-600">{migraineData.prostrating}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Non-prostrating:</span>
                        <span className="font-medium text-green-600">{migraineData.nonProstrating}</span>
                      </div>
                    </div>

                    <p className="text-xs text-purple-700 mt-3">
                      💡 VA rates migraines at 50% for prostrating attacks averaging once a month
                    </p>
                  </div>
              )}

              {/* Daily Entries Chart */}
              {severityData.length > 1 && (
                  <div className="bg-white rounded-lg border border-gray-200 p-4">
                    <h3 className="font-medium text-gray-900 mb-3">Daily Entry Count</h3>
                    <div className="h-48">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={severityData}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis
                              dataKey="date"
                              tick={{ fontSize: 12 }}
                              interval="preserveStartEnd"
                          />
                          <YAxis tick={{ fontSize: 12 }} />
                          <Tooltip />
                          <Bar dataKey="entries" fill="#059669" name="Entries" />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
              )}
            </>
        )}
      </div>
  );
};

export default Trends;