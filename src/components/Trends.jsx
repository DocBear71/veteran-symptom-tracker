import { useState, useEffect, useRef, useMemo, useCallback } from 'react';
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
import { getMeasurements, getMeasurementStats } from '../utils/measurements';
import { getAllMeasurementTypes, getMeasurementType, formatMeasurementValue, interpretMeasurement } from '../data/measurementTypes';
import RatingEvidence from './RatingEvidence';
import { useProfile } from '../hooks/useProfile';
import CPResources from './CPResources';
import ServiceConnectionGuide from './ServiceConnectionGuide';

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
            <ResponsiveContainer width={dimensions.width} height={dimensions.height}>
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

/**
 * Measurements Trends Component
 * Displays measurement history with charts and statistics
 */
const MeasurementsTrends = ({ dateRange }) => {
    const [selectedType, setSelectedType] = useState('all');
    const [measurements, setMeasurements] = useState([]);
    const measurementTypes = getAllMeasurementTypes();

    useEffect(() => {
        loadMeasurements();
    }, [dateRange, selectedType]);

    const loadMeasurements = () => {
        const now = new Date();
        let days = null;

        switch (dateRange) {
            case 'week': days = 7; break;
            case 'month': days = 30; break;
            case '3months': days = 90; break;
            case 'year': days = 365; break;
            default: days = null;
        }

        const options = {};
        if (days) options.days = days;
        if (selectedType !== 'all') options.type = selectedType;

        const data = getMeasurements(options);
        setMeasurements(data);
    };

    // Group measurements by type for summary
    const measurementSummary = useMemo(() => {
        const summary = {};
        measurements.forEach(m => {
            if (!summary[m.measurementType]) {
                summary[m.measurementType] = {
                    type: getMeasurementType(m.measurementType),
                    count: 0,
                    latest: null,
                    values: []
                };
            }
            summary[m.measurementType].count++;
            if (!summary[m.measurementType].latest) {
                summary[m.measurementType].latest = m;
            }
            summary[m.measurementType].values.push(m);
        });
        return summary;
    }, [measurements]);

    // Prepare chart data for selected measurement type
    const chartData = useMemo(() => {
        if (selectedType === 'all' || measurements.length === 0) return [];

        const type = getMeasurementType(selectedType);
        if (!type) return [];

        // Get primary field for charting
        const primaryField = type.fields.find(f => f.required)?.key;
        if (!primaryField) return [];

        return measurements
            .slice()
            .reverse() // Oldest first for chart
            .map(m => ({
                date: new Date(m.timestamp).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
                value: m.values[primaryField],
                fullDate: new Date(m.timestamp).toLocaleString(),
                ...m.values
            }));
    }, [measurements, selectedType]);

    return (
        <div className="space-y-4">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                Measurement Trends
            </h2>

            {/* Filter */}
            <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
                    Filter by measurement type:
                </label>
                <select
                    value={selectedType}
                    onChange={(e) => setSelectedType(e.target.value)}
                    className="w-full md:w-64 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg
                     bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                >
                    <option value="all">All measurements</option>
                    {measurementTypes.map(type => (
                        <option key={type.id} value={type.id}>
                            {type.icon} {type.name}
                        </option>
                    ))}
                </select>
            </div>

            {/* No Data State */}
            {measurements.length === 0 ? (
                <div className="text-center py-12 text-gray-500 dark:text-gray-400">
                    <p className="text-4xl mb-2">📊</p>
                    <p>No measurements recorded</p>
                    <p className="text-sm">Track measurements from the Log tab to see trends</p>
                </div>
            ) : (
                <>
                    {/* Summary Cards - Show when viewing all */}
                    {selectedType === 'all' && (
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                            {Object.entries(measurementSummary).map(([typeId, data]) => (
                                <button
                                    key={typeId}
                                    onClick={() => setSelectedType(typeId)}
                                    className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4 text-left hover:border-blue-400 dark:hover:border-blue-500 transition-colors"
                                >
                                    <div className="flex items-center gap-2 mb-2">
                                        <span className="text-2xl">{data.type?.icon || '📊'}</span>
                                        <span className="font-medium text-gray-900 dark:text-white text-sm">
                      {data.type?.shortName || typeId}
                    </span>
                                    </div>
                                    <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">{data.count}</p>
                                    <p className="text-xs text-gray-500 dark:text-gray-400">entries</p>
                                    {data.latest && (
                                        <p className="text-xs text-gray-600 dark:text-gray-400 mt-1 truncate">
                                            Latest: {formatMeasurementValue(typeId, data.latest.values)}
                                        </p>
                                    )}
                                </button>
                            ))}
                        </div>
                    )}

                    {/* Chart - Show when specific type selected */}
                    {selectedType !== 'all' && chartData.length > 1 && (
                        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4">
                            <h3 className="font-medium text-gray-900 dark:text-white mb-3">
                                {getMeasurementType(selectedType)?.name} Over Time
                            </h3>
                            <ChartContainer height={256}>
                                <LineChart data={chartData} margin={{ top: 5, right: 5, left: -20, bottom: 5 }}>
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
                                    <Tooltip content={(props) => <CustomTooltip {...props} />} />
                                    <Line
                                        type="monotone"
                                        dataKey="value"
                                        stroke="#3B82F6"
                                        strokeWidth={2}
                                        name="Value"
                                        dot={{ fill: '#3B82F6', r: 3 }}
                                        activeDot={{ r: 5 }}
                                    />
                                </LineChart>
                            </ChartContainer>
                        </div>
                    )}

                    {/* Recent Measurements List */}
                    <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
                        <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                            <h3 className="font-medium text-gray-900 dark:text-white">
                                Recent Measurements ({measurements.length})
                            </h3>
                        </div>
                        <div className="divide-y divide-gray-200 dark:divide-gray-700 max-h-96 overflow-y-auto">
                            {measurements.slice(0, 20).map(m => {
                                const type = getMeasurementType(m.measurementType);
                                const interpretation = interpretMeasurement(m.measurementType, m.values, m.metadata);

                                return (
                                    <div key={m.id} className="p-4">
                                        <div className="flex items-start gap-3">
                                            <span className="text-xl">{type?.icon || '📊'}</span>
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-center justify-between gap-2">
                                                    <p className="font-medium text-gray-900 dark:text-white">
                                                        {type?.shortName || m.measurementType}
                                                    </p>
                                                    <p className="text-xs text-gray-500 dark:text-gray-400">
                                                        {new Date(m.timestamp).toLocaleDateString()}
                                                    </p>
                                                </div>
                                                <p className="text-sm text-gray-700 dark:text-gray-300">
                                                    {formatMeasurementValue(m.measurementType, m.values)}
                                                </p>
                                                {interpretation && (
                                                    <span className={`inline-block mt-1 px-2 py-0.5 rounded text-xs font-medium ${
                                                        interpretation.color === 'green' ? 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300' :
                                                            interpretation.color === 'yellow' ? 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300' :
                                                                interpretation.color === 'orange' ? 'bg-orange-100 dark:bg-orange-900/30 text-orange-800 dark:text-orange-300' :
                                                                    interpretation.color === 'red' ? 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300' :
                                                                        'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-300'
                                                    }`}>
                            {interpretation.label}
                          </span>
                                                )}
                                                {m.notes && (
                                                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                                                        📝 {m.notes}
                                                    </p>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </>
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

  // Memoize filtered logs to prevent recalculation on every render
  const filteredLogs = useMemo(() => {
    return selectedSymptom === 'all'
        ? logs
        : logs.filter(log => log.symptomName === selectedSymptom);
  }, [logs, selectedSymptom]);

  // Memoize severity over time calculation - expensive for large datasets
  const severityData = useMemo(() => {
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
  }, [filteredLogs]);

  // Memoize frequency data calculation
  const frequencyData = useMemo(() => {
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
  }, [logs]);

  // Memoize migraine-specific data
  const migraineData = useMemo(() => {
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
  }, [logs]);

  // Memoize summary statistics
  const { totalEntries, avgSeverity, maxSeverity } = useMemo(() => {
    const total = filteredLogs.length;
    const avg = total > 0
        ? Math.round((filteredLogs.reduce((sum, log) => sum + log.severity, 0) / total) * 10) / 10
        : 0;
    const max = total > 0
        ? Math.max(...filteredLogs.map(log => log.severity))
        : 0;
    return { totalEntries: total, avgSeverity: avg, maxSeverity: max };
  }, [filteredLogs]);

  return (
      <div className="space-y-4 pb-20">
          {/* Tab Selector - Grid layout for mobile wrapping */}
          <div className="grid grid-cols-3 sm:grid-cols-5 gap-1 mb-4 bg-gray-100 dark:bg-gray-800 rounded-lg p-1">
              <button
                  onClick={() => setActiveTab('charts')}
                  className={`px-2 py-2 text-xs sm:text-sm font-medium rounded-md transition-colors ${
                      activeTab === 'charts'
                          ? 'bg-white dark:bg-gray-700 text-blue-600 dark:text-blue-400 shadow-sm'
                          : 'text-gray-600 dark:text-gray-400 hover:bg-white/50 dark:hover:bg-gray-700/50'
                  }`}
              >
                  📊 Charts, Trends, & Patterns
              </button>
              <button
                  onClick={() => setActiveTab('rating')}
                  className={`px-2 py-2 text-xs sm:text-sm font-medium rounded-md transition-colors ${
                      activeTab === 'rating'
                          ? 'bg-white dark:bg-gray-700 text-blue-600 dark:text-blue-400 shadow-sm'
                          : 'text-gray-600 dark:text-gray-400 hover:bg-white/50 dark:hover:bg-gray-700/50'
                  }`}
              >
                  ⚖️ Rating & Evidence
              </button>
              <button
                  onClick={() => setActiveTab('cp-resources')}
                  className={`px-2 py-2 text-xs sm:text-sm font-medium rounded-md transition-colors ${
                      activeTab === 'cp-resources'
                          ? 'bg-white dark:bg-gray-700 text-blue-600 dark:text-blue-400 shadow-sm'
                          : 'text-gray-600 dark:text-gray-400 hover:bg-white/50 dark:hover:bg-gray-700/50'
                  }`}
              >
                  🎖️ C&P Resources
              </button>
              <button
                  onClick={() => setActiveTab('service-connection')}
                  className={`px-2 py-2 text-xs sm:text-sm font-medium rounded-md transition-colors ${
                      activeTab === 'service-connection'
                          ? 'bg-white dark:bg-gray-700 text-blue-600 dark:text-blue-400 shadow-sm'
                          : 'text-gray-600 dark:text-gray-400 hover:bg-white/50 dark:hover:bg-gray-700/50'
                  }`}
              >
                  🔗 Service Connection
              </button>
              <button
                  onClick={() => setActiveTab('measurements')}
                  className={`px-2 py-2 text-xs sm:text-sm font-medium rounded-md transition-colors ${
                      activeTab === 'measurements'
                          ? 'bg-white dark:bg-gray-700 text-blue-600 dark:text-blue-400 shadow-sm'
                          : 'text-gray-600 dark:text-gray-400 hover:bg-white/50 dark:hover:bg-gray-700/50'
                  }`}
              >
                  📏 Vitals Measurements
              </button>
          </div>

        {/* Tab Content */}
        {activeTab === 'charts' && (
            <>
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Trends & Patterns
              </h2>

              {/* Filters */}
              <div className="flex gap-2 mb-4 flex-wrap w-full">
                <select
                    value={selectedSymptom}
                    onChange={(e) => setSelectedSymptom(e.target.value)}
                    className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 flex-1 min-w-0 max-w-[160px] sm:max-w-[200px]"
                >
                  <option value="all">All Symptoms</option>
                  {availableSymptoms.map(symptom => (
                      <option key={symptom} value={symptom}>{symptom}</option>
                  ))}
                </select>
                <select
                    value={dateRange}
                    onChange={(e) => setDateRange(e.target.value)}
                    className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 flex-1 min-w-0 max-w-[160px] sm:max-w-[200px]"
                >
                  <option value="week">Last 7 Days</option>
                  <option value="month">Last 30 Days</option>
                  <option value="3months">Last 90 Days</option>
                  <option value="year">Last Year</option>
                  <option value="all">All Time</option>
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
                              <Tooltip content={(props) => <CustomTooltip {...props} />} />
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
                              <Tooltip content={(props) => <CustomTooltip {...props} />} />
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
                              <Tooltip content={(props) => <CustomTooltip {...props} />} />
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
        )}

        {activeTab === 'rating' && (
            <RatingEvidence />
        )}

        {activeTab === 'cp-resources' && (
            <CPResources />
        )}

        {activeTab === 'service-connection' && (
            <ServiceConnectionGuide />
        )}

      {activeTab === 'measurements' && (
          <MeasurementsTrends dateRange={dateRange} />
      )}
      </div>
  );
};

export default Trends;