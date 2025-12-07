import { useState, useEffect, useRef } from 'react';
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
import { getSymptomLogs, saveSymptomLog } from '../utils/storage';
import RatingEvidence from './RatingEvidence';
import { useProfile } from '../hooks/useProfile';

// Custom tooltip component for dark mode support
const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-2 shadow-lg">
          <p className="text-sm font-medium text-gray-900 dark:text-white">{label}</p>
          {payload.map((entry, index) => (
              <p key={index} className="text-sm" style={{ color: entry.color }}>
                {entry.name}: {entry.value}
              </p>
          ))}
        </div>
    );
  }
  return null;
};

// Chart wrapper component to handle the responsive container properly
const ChartContainer = ({ children, height = 256 }) => {
  const containerRef = useRef(null);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

  useEffect(() => {
    if (containerRef.current) {
      const resizeObserver = new ResizeObserver(entries => {
        if (entries[0]) {
          const { width } = entries[0].contentRect;
          if (width > 0) {
            setDimensions({ width, height });
          }
        }
      });

      resizeObserver.observe(containerRef.current);
      return () => resizeObserver.disconnect();
    }
  }, [height]);

  return (
      <div ref={containerRef} style={{ width: '100%', height, minWidth: 0 }}>
        {dimensions.width > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              {children}
            </ResponsiveContainer>
        ) : (
            <div
                className="bg-gray-100 dark:bg-gray-700 rounded animate-pulse"
                style={{ height }}
            />
        )}
      </div>
  );
};

const Trends = () => {
  const { features } = useProfile();
  const [logs, setLogs] = useState([]);
  const [dateRange, setDateRange] = useState('month');
  const [selectedSymptom, setSelectedSymptom] = useState('all');
  const [availableSymptoms, setAvailableSymptoms] = useState([]);
  const [activeTab, setActiveTab] = useState('charts');

  useEffect(() => {
    loadData();
  }, [dateRange]);

  const loadData = () => {
    let allLogs = getSymptomLogs();

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
        startDate = new Date(0);
    }

    allLogs = allLogs.filter(log => new Date(log.timestamp) >= startDate);
    allLogs.sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));

    setLogs(allLogs);

    const symptoms = [...new Set(allLogs.map(log => log.symptomName))];
    setAvailableSymptoms(symptoms);
  };

  const filteredLogs = selectedSymptom === 'all'
      ? logs
      : logs.filter(log => log.symptomName === selectedSymptom);

  const getSeverityOverTimeData = () => {
    if (filteredLogs.length === 0) return [];

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
    .slice(0, 10);
  };

  const getMigraineData = () => {
    const migraineLogs = logs.filter(log => log.migraineData);
    if (migraineLogs.length === 0) return null;

    const prostrating = migraineLogs.filter(log => log.migraineData.prostrating).length;
    const nonProstrating = migraineLogs.length - prostrating;

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

  const totalEntries = filteredLogs.length;
  const avgSeverity = totalEntries > 0
      ? Math.round((filteredLogs.reduce((sum, log) => sum + log.severity, 0) / totalEntries) * 10) / 10
      : 0;
  const maxSeverity = totalEntries > 0
      ? Math.max(...filteredLogs.map(log => log.severity))
      : 0;

  return (
      <div className="space-y-4 pb-20">
        {/* Tab Selector */}
        <div className="flex border-b border-gray-200 dark:border-gray-700">
          <button
              onClick={() => setActiveTab('charts')}
              className={`flex-1 py-3 text-center font-medium ${
                  activeTab === 'charts'
                      ? 'text-blue-600 border-b-2 border-blue-600'
                      : 'text-gray-500 dark:text-gray-400'
              }`}
          >
            Charts
          </button>
          {features.showRatingCorrelation && (
              <button
                  onClick={() => setActiveTab('ratings')}
                  className={`flex-1 py-3 text-center font-medium ${
                      activeTab === 'ratings'
                          ? 'text-blue-600 border-b-2 border-blue-600'
                          : 'text-gray-500 dark:text-gray-400'
                  }`}
              >
                Rating Evidence
              </button>
          )}
        </div>

        {/* Tab Content */}
        {activeTab === 'charts' ? (
            <>
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Trends & Patterns
              </h2>

              {/* Filters */}
              <div className="flex gap-2 mb-4 flex-wrap">
                <select
                    value={dateRange}
                    onChange={(e) => setDateRange(e.target.value)}
                    className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
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
                    className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                >
                  <option value="all">All Symptoms</option>
                  {availableSymptoms.map(symptom => (
                      <option key={symptom} value={symptom}>{symptom}</option>
                  ))}
                </select>
              </div>

              {/* No Data State */}
              {logs.length === 0 ? (
                  <div className="text-center py-12 text-gray-500 dark:text-gray-400">
                    <p className="text-4xl mb-2">📊</p>
                    <p>No data to display</p>
                    <p className="text-sm">Start logging symptoms to see trends</p>
                  </div>
              ) : (
                  <>
                    {/* Summary Stats */}
                    <div className="grid grid-cols-3 gap-3 mb-6">
                      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-3 text-center">
                        <p className="text-2xl font-bold text-blue-900 dark:text-blue-400">{totalEntries}</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">Total Entries</p>
                      </div>
                      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-3 text-center">
                        <p className="text-2xl font-bold text-orange-500 dark:text-orange-400">{avgSeverity}</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">Avg Severity</p>
                      </div>
                      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-3 text-center">
                        <p className="text-2xl font-bold text-red-600 dark:text-red-400">{maxSeverity}</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">Max Severity</p>
                      </div>
                    </div>

                    {/* Severity Over Time Chart */}
                    {severityData.length > 1 && (
                        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4 mb-4">
                          <h3 className="font-medium text-gray-900 dark:text-white mb-3">Severity Over Time</h3>
                          <ChartContainer height={256}>
                            <LineChart data={severityData} margin={{ top: 5, right: 5, left: -20, bottom: 5 }}>
                              <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.3} />
                              <XAxis
                                  dataKey="date"
                                  tick={{ fontSize: 12, fill: '#9CA3AF' }}
                                  interval="preserveStartEnd"
                                  stroke="#6B7280"
                              />
                              <YAxis
                                  domain={[0, 10]}
                                  tick={{ fontSize: 12, fill: '#9CA3AF' }}
                                  stroke="#6B7280"
                              />
                              <Tooltip content={<CustomTooltip />} />
                              <Legend wrapperStyle={{ fontSize: '12px' }} />
                              <Line
                                  type="monotone"
                                  dataKey="avgSeverity"
                                  stroke="#3B82F6"
                                  strokeWidth={2}
                                  name="Avg Severity"
                                  dot={{ fill: '#3B82F6', r: 3 }}
                                  activeDot={{ r: 5 }}
                              />
                              <Line
                                  type="monotone"
                                  dataKey="maxSeverity"
                                  stroke="#EF4444"
                                  strokeWidth={2}
                                  name="Max Severity"
                                  dot={{ fill: '#EF4444', r: 3 }}
                                  activeDot={{ r: 5 }}
                              />
                            </LineChart>
                          </ChartContainer>
                        </div>
                    )}

                    {/* Symptom Frequency Chart */}
                    {frequencyData.length > 0 && selectedSymptom === 'all' && (
                        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4 mb-4">
                          <h3 className="font-medium text-gray-900 dark:text-white mb-3">Most Frequent Symptoms</h3>
                          <ChartContainer height={Math.max(200, frequencyData.length * 40)}>
                            <BarChart
                                data={frequencyData}
                                layout="vertical"
                                margin={{ top: 5, right: 20, left: 0, bottom: 5 }}
                            >
                              <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.3} />
                              <XAxis
                                  type="number"
                                  tick={{ fontSize: 12, fill: '#9CA3AF' }}
                                  stroke="#6B7280"
                              />
                              <YAxis
                                  type="category"
                                  dataKey="name"
                                  tick={{ fontSize: 11, fill: '#9CA3AF' }}
                                  width={100}
                                  stroke="#6B7280"
                              />
                              <Tooltip content={<CustomTooltip />} />
                              <Bar
                                  dataKey="count"
                                  fill="#3B82F6"
                                  name="Occurrences"
                                  radius={[0, 4, 4, 0]}
                              />
                            </BarChart>
                          </ChartContainer>
                        </div>
                    )}

                    {/* Migraine Summary */}
                    {migraineData && (
                        <div className="bg-purple-50 dark:bg-purple-900/30 rounded-lg border border-purple-200 dark:border-purple-800 p-4 mb-4">
                          <h3 className="font-medium text-purple-900 dark:text-purple-200 mb-3">Migraine Summary</h3>

                          <div className="grid grid-cols-2 gap-3 mb-3">
                            <div className="bg-white dark:bg-gray-800 rounded-lg p-3 text-center">
                              <p className="text-2xl font-bold text-purple-900 dark:text-purple-300">{migraineData.total}</p>
                              <p className="text-xs text-gray-500 dark:text-gray-400">Total Migraines</p>
                            </div>
                            <div className="bg-white dark:bg-gray-800 rounded-lg p-3 text-center">
                              <p className="text-2xl font-bold text-red-600 dark:text-red-400">{migraineData.prostratingPercent}%</p>
                              <p className="text-xs text-gray-500 dark:text-gray-400">Prostrating</p>
                            </div>
                          </div>

                          <div className="bg-white dark:bg-gray-800 rounded-lg p-3">
                            <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Breakdown</p>
                            <div className="flex justify-between text-sm">
                              <span className="text-gray-600 dark:text-gray-400">Prostrating:</span>
                              <span className="font-medium text-red-600 dark:text-red-400">{migraineData.prostrating}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                              <span className="text-gray-600 dark:text-gray-400">Non-prostrating:</span>
                              <span className="font-medium text-green-600 dark:text-green-400">{migraineData.nonProstrating}</span>
                            </div>
                          </div>

                          <p className="text-xs text-purple-700 dark:text-purple-300 mt-3">
                            💡 VA rates migraines at 50% for prostrating attacks averaging once a month
                          </p>
                        </div>
                    )}

                    {/* Daily Entries Chart */}
                    {severityData.length > 1 && (
                        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4">
                          <h3 className="font-medium text-gray-900 dark:text-white mb-3">Daily Entry Count</h3>
                          <ChartContainer height={192}>
                            <BarChart data={severityData} margin={{ top: 5, right: 5, left: -20, bottom: 5 }}>
                              <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.3} />
                              <XAxis
                                  dataKey="date"
                                  tick={{ fontSize: 12, fill: '#9CA3AF' }}
                                  interval="preserveStartEnd"
                                  stroke="#6B7280"
                              />
                              <YAxis
                                  tick={{ fontSize: 12, fill: '#9CA3AF' }}
                                  stroke="#6B7280"
                              />
                              <Tooltip content={<CustomTooltip />} />
                              <Bar
                                  dataKey="entries"
                                  fill="#10B981"
                                  name="Entries"
                                  radius={[4, 4, 0, 0]}
                              />
                            </BarChart>
                          </ChartContainer>
                        </div>
                    )}
                  </>
              )}
            </>
        ) : (
            /* Rating Evidence Tab */
            <RatingEvidence />
        )}
      </div>
  );
};

export default Trends;