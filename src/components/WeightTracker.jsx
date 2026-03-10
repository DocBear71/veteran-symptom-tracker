/**
 * WeightTracker.jsx
 *
 * Dedicated Weight Tracking page for Doc Bear's Symptom Vault.
 * Provides full weight tracking experience: goal management, dashboard,
 * trends, charts, and history.
 *
 * Phase 1: Goal & Profile Setup
 * Phase 2: Dashboard card (coming next)
 */

import { useState, useEffect, useRef } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
} from 'recharts';
import { getMeasurements, saveMeasurement, deleteMeasurement, getHeight } from '../utils/measurements';
import { getWeightGoal, saveWeightGoal, clearWeightGoal } from '../utils/storage';
import { getMeasurementType, formatMeasurementValue } from '../data/measurementTypes';
import { formatLocalDateTime } from '../utils/datetime';
import { getWeightTrend, getTrendIndicator, getAverageRate } from '../utils/weightStats';

// ============================================
// MAIN WEIGHT TRACKER PAGE
// ============================================

const WeightTracker = ({ onNavigate }) => {
  const [measurements, setMeasurements] = useState([]);
  const [weightGoal, setWeightGoal] = useState(null);
  const [showLogModal, setShowLogModal] = useState(false);
  const [showGoalModal, setShowGoalModal] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    // Load weight measurements only
    const allMeasurements = getMeasurements({ type: 'weight' });
    // Sort newest first
    const sorted = [...allMeasurements].sort(
        (a, b) => new Date(b.timestamp) - new Date(a.timestamp)
    );
    setMeasurements(sorted);
    setWeightGoal(getWeightGoal());
  };

  const handleSaveMeasurement = (measurementData) => {
    saveMeasurement(measurementData);
    loadData();
    setShowLogModal(false);
  };

  const handleDeleteMeasurement = (id) => {
    if (window.confirm('Delete this measurement?')) {
      deleteMeasurement(id);
      loadData();
    }
  };

  const handleSaveGoal = (goalData) => {
    // Auto-capture start weight from first measurement if not set
    const startWeight = goalData.startWeight ||
        (measurements.length > 0
            ? measurements[measurements.length - 1].values.weight  // oldest entry
            : null);

    const saved = saveWeightGoal({ ...goalData, startWeight });
    setWeightGoal(saved);
    setShowGoalModal(false);
  };

  const handleClearGoal = () => {
    if (window.confirm('Remove your weight goal?')) {
      clearWeightGoal();
      setWeightGoal(null);
    }
  };

  // Most recent measurement
  const currentMeasurement = measurements[0] || null;
  const currentWeight = currentMeasurement?.values?.weight || null;

  return (
      <div className="space-y-4 text-left">

        {/* ── Header ── */}
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4">
          <div className="flex items-center gap-3 mb-1">
            <button
                onClick={() => onNavigate('measurements')}
                className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 flex-shrink-0"
                aria-label="Back to Measurements"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
              ⚖️ Weight Tracker
            </h2>
            <span className="text-xs px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 rounded-full ml-auto">
            Beta
          </span>
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400 pl-8">
            Track weight over time for VA documentation
          </p>
        </div>

        {/* ── Goal Banner or Set Goal Prompt ── */}
        {weightGoal ? (
            <WeightDashboard
                measurements={measurements}
                weightGoal={weightGoal}
                onEdit={() => setShowGoalModal(true)}
                onClear={handleClearGoal}
            />
        ) : (
            <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800 p-4">
              <div className="flex items-start gap-3">
                <span className="text-2xl">🎯</span>
                <div className="flex-1">
                  <h3 className="text-sm font-semibold text-blue-900 dark:text-blue-200 mb-1">
                    Set a Weight Goal
                  </h3>
                  <p className="text-xs text-blue-700 dark:text-blue-300 mb-3">
                    A goal lets the tracker calculate your progress, project your timeline,
                    and generate stronger VA documentation.
                  </p>
                  <button
                      onClick={() => setShowGoalModal(true)}
                      className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded-lg transition-colors font-medium"
                  >
                    Set Goal Weight
                  </button>
                </div>
              </div>
            </div>
        )}

        {/* ── Trend Analysis ── */}
        {measurements.length >= 2 && (
            <TrendAnalysis
                measurements={measurements}
                weightGoal={weightGoal}
            />
        )}

        {/* ── Chart ── */}
        {measurements.length >= 2 && (
            <WeightChart
                measurements={measurements}
                weightGoal={weightGoal}
            />
        )}

        {/* ── Log Button ── */}
        <div className="flex justify-end">
          <button
              onClick={() => setShowLogModal(true)}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors font-medium text-sm"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Log Weight
          </button>
        </div>

        {/* ── Measurement History ── */}
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
          <div className="p-4 border-b border-gray-200 dark:border-gray-700">
            <h3 className="text-sm font-medium text-gray-900 dark:text-white">
              Weight History ({measurements.length})
            </h3>
          </div>

          {measurements.length === 0 ? (
              <div className="p-8 text-center">
                <div className="text-4xl mb-2">⚖️</div>
                <p className="text-gray-500 dark:text-gray-400">No weight entries yet</p>
                <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">
                  Tap "Log Weight" above to record your first entry
                </p>
              </div>
          ) : (
              <div className="divide-y divide-gray-200 dark:divide-gray-700">
                {measurements.map((measurement, index) => (
                    <WeightHistoryRow
                        key={measurement.id}
                        measurement={measurement}
                        previousMeasurement={measurements[index + 1] || null}
                        onDelete={handleDeleteMeasurement}
                    />
                ))}
              </div>
          )}
        </div>

        {/* ── Log Weight Modal ── */}
        {showLogModal && (
            <AddWeightModal
                onSave={handleSaveMeasurement}
                onCancel={() => setShowLogModal(false)}
                lastWeight={currentWeight}
            />
        )}

        {/* ── Goal Modal ── */}
        {showGoalModal && (
            <WeightGoalModal
                existingGoal={weightGoal}
                currentWeight={currentWeight}
                onSave={handleSaveGoal}
                onCancel={() => setShowGoalModal(false)}
            />
        )}
      </div>
  );
};

// ============================================
// TREND ANALYSIS
// Phase 3: 1-week, 30-day, 1-year tendency rows
// ============================================

const TrendAnalysis = ({ measurements, weightGoal }) => {
  const isLossGoal = weightGoal
      ? (weightGoal.startWeight || measurements[measurements.length - 1]?.values?.weight || 0)
      > weightGoal.goalWeight
      : true; // default assumption

  const periods = [
    { label: '1 Week',  days: 7   },
    { label: '30 Days', days: 30  },
    { label: '1 Year',  days: 365 },
  ];

  return (
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4">
        <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">
          Weight Tendency
        </h3>

        <div className="space-y-2">
          {periods.map(({ label, days }) => {
            const trend = getWeightTrend(measurements, days);
            const rate = trend
                ? parseFloat(((trend.delta / Math.max(trend.daySpan, 1)) * 7).toFixed(1))
                : null;
            const indicator = trend
                ? getTrendIndicator(trend.delta, isLossGoal)
                : null;

            return (
                <div
                    key={label}
                    className="flex items-center justify-between py-2 border-b border-gray-100 dark:border-gray-700 last:border-0"
                >
                  {/* Period label */}
                  <div className="text-sm text-gray-600 dark:text-gray-400 w-20 flex-shrink-0">
                    {label}
                  </div>

                  {/* Delta */}
                  <div className="flex-1 text-center">
                    {trend ? (
                        <span className={`text-sm font-semibold ${
                            trend.delta < 0
                                ? 'text-green-600 dark:text-green-400'
                                : trend.delta > 0
                                    ? 'text-red-600 dark:text-red-400'
                                    : 'text-gray-500 dark:text-gray-400'
                        }`}>
                    {trend.delta > 0 ? '+' : ''}{trend.delta} lbs
                  </span>
                    ) : (
                        <span className="text-sm text-gray-400 dark:text-gray-500">
                    — —
                  </span>
                    )}
                  </div>

                  {/* Weekly rate */}
                  <div className="flex-1 text-center">
                    {rate !== null ? (
                        <span className="text-xs text-gray-500 dark:text-gray-400">
                    {rate > 0 ? '+' : ''}{rate} lbs/wk
                  </span>
                    ) : (
                        <span className="text-xs text-gray-400 dark:text-gray-500">—</span>
                    )}
                  </div>

                  {/* Direction arrow + label */}
                  <div className={`flex items-center gap-1 w-24 justify-end flex-shrink-0 ${
                      indicator?.color || 'text-gray-400'
                  }`}>
                    {indicator ? (
                        <>
                          <span className="text-base font-bold">{indicator.arrow}</span>
                          <span className="text-xs">{indicator.label}</span>
                        </>
                    ) : (
                        <span className="text-xs text-gray-400 dark:text-gray-500">
                    Need more data
                  </span>
                    )}
                  </div>
                </div>
            );
          })}
        </div>

        <p className="text-xs text-gray-400 dark:text-gray-500 mt-3">
          Trends require at least 2 entries within the time period.
          1-year trend needs entries spanning more than 30 days.
        </p>
      </div>
  );
};

// ============================================
// WEIGHT CHART
// Phase 4: Line chart with time range selector
// and optional goal reference line.
// ============================================

const WeightChart = ({ measurements, weightGoal }) => {
  const [range, setRange] = useState('90d');
  const containerRef = useRef(null);
  const [chartWidth, setChartWidth] = useState(0);

  // Match the ResizeObserver pattern used in Trends.jsx
  useEffect(() => {
    if (!containerRef.current) return;
    const observer = new ResizeObserver(entries => {
      if (entries[0]) {
        const { width } = entries[0].contentRect;
        if (width > 0) setChartWidth(width);
      }
    });
    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

  // Filter measurements by selected time range
  const getFilteredData = () => {
    const now = new Date();
    const cutoff = new Date();

    switch (range) {
      case '3w':  cutoff.setDate(now.getDate() - 21);  break;
      case '90d': cutoff.setDate(now.getDate() - 90);  break;
      case '1y':  cutoff.setFullYear(now.getFullYear() - 1); break;
      case 'all': cutoff.setFullYear(2000); break;
      default:    cutoff.setDate(now.getDate() - 90);
    }

    // Sort oldest-first for chart (measurements prop is newest-first)
    return [...measurements]
    .filter(m => new Date(m.timestamp) >= cutoff)
    .sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp))
    .map(m => ({
      date: new Date(m.timestamp).toLocaleDateString([], {
        month: 'short',
        day: 'numeric',
      }),
      weight: m.values?.weight,
      bmi: m.values?.height
          ? parseFloat(((m.values.weight / (m.values.height * m.values.height)) * 703).toFixed(1))
          : null,
    }));
  };

  const chartData = getFilteredData();

  // Y-axis domain — add padding so line doesn't hug edges
  const weights = chartData.map(d => d.weight).filter(Boolean);
  const minW = weights.length ? Math.floor(Math.min(...weights) - 5) : 0;
  const maxW = weights.length ? Math.ceil(Math.max(...weights) + 5) : 300;

  // Custom tooltip
  const CustomTooltip = ({ active, payload, label }) => {
    if (!active || !payload?.length) return null;
    return (
        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-2 shadow-lg text-xs">
          <p className="font-medium text-gray-900 dark:text-white mb-1">{label}</p>
          {payload.map((entry, i) => (
              <p key={i} style={{ color: entry.color }}>
                {entry.name}: <span className="font-semibold">{entry.value}</span>
                {entry.name === 'Weight' ? ' lbs' : ''}
              </p>
          ))}
        </div>
    );
  };

  const ranges = [
    { key: '3w',  label: '3 Weeks' },
    { key: '90d', label: '90 Days' },
    { key: '1y',  label: '1 Year'  },
    { key: 'all', label: 'All'     },
  ];

  return (
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4">

        {/* Header + range selector */}
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-semibold text-gray-900 dark:text-white">
            Weight Over Time
          </h3>
          <div className="flex gap-1">
            {ranges.map(r => (
                <button
                    key={r.key}
                    onClick={() => setRange(r.key)}
                    className={`px-2 py-1 text-xs rounded transition-colors ${
                        range === r.key
                            ? 'bg-blue-600 text-white font-medium'
                            : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600'
                    }`}
                >
                  {r.label}
                </button>
            ))}
          </div>
        </div>

        {chartData.length < 2 ? (
            <div className="h-32 flex items-center justify-center text-sm text-gray-400 dark:text-gray-500">
              Not enough data in this range — log more entries or select a wider range
            </div>
        ) : (
            <div ref={containerRef} className="w-full">
              {chartWidth > 0 && (
                  <LineChart
                      width={chartWidth}
                      height={220}
                      data={chartData}
                      margin={{ top: 5, right: 8, left: -10, bottom: 0 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.3} />
                    <XAxis
                        dataKey="date"
                        tick={{ fontSize: 10, fill: '#9CA3AF' }}
                        tickLine={false}
                        interval="preserveStartEnd"
                    />
                    <YAxis
                        domain={[minW, maxW]}
                        tick={{ fontSize: 10, fill: '#9CA3AF' }}
                        tickLine={false}
                        axisLine={false}
                        tickFormatter={v => `${v}`}
                    />
                    <Tooltip content={<CustomTooltip />} />

                    {/* Goal reference line */}
                    {weightGoal?.goalWeight && (
                        <ReferenceLine
                            y={weightGoal.goalWeight}
                            stroke="#22C55E"
                            strokeDasharray="5 3"
                            label={{
                              value: `Goal: ${weightGoal.goalWeight}`,
                              position: 'insideTopRight',
                              fontSize: 10,
                              fill: '#22C55E',
                            }}
                        />
                    )}

                    <Line
                        type="monotone"
                        dataKey="weight"
                        name="Weight"
                        stroke="#3B82F6"
                        strokeWidth={2}
                        dot={{ r: 3, fill: '#3B82F6', strokeWidth: 0 }}
                        activeDot={{ r: 5 }}
                    />
                  </LineChart>
              )}
            </div>
        )}
      </div>
  );
};


// ============================================
// WEIGHT DASHBOARD
// Phase 2: First / Now / Best / Goal stats,
// progress bar, and projected completion.
// ============================================

const WeightDashboard = ({ measurements, weightGoal, onEdit, onClear }) => {
  // Sorted oldest-first for stats
  const sorted = [...measurements].sort(
      (a, b) => new Date(a.timestamp) - new Date(b.timestamp)
  );

  const firstWeight = sorted[0]?.values?.weight || null;
  const currentWeight = sorted[sorted.length - 1]?.values?.weight || null;
  const bestWeight = sorted.length > 0
      ? Math.min(...sorted.map(m => m.values?.weight).filter(Boolean))
      : null;
  const goalWeight = weightGoal.goalWeight;

  // Use saved startWeight from goal if available, otherwise use first measurement
  const startWeight = weightGoal.startWeight || firstWeight;

  // Progress calculation
  // Handles both weight-loss (start > goal) and weight-gain (start < goal) goals
  const isLossGoal = startWeight > goalWeight;
  let progressPct = 0;
  if (startWeight && currentWeight && startWeight !== goalWeight) {
    progressPct = ((startWeight - currentWeight) / (startWeight - goalWeight)) * 100;
    progressPct = Math.min(100, Math.max(0, progressPct)); // clamp 0-100
  }

  // Average weekly change over last 30 days
  const getWeeklyRate = () => {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    const recent = sorted.filter(m => new Date(m.timestamp) >= thirtyDaysAgo);
    if (recent.length < 2) return null;
    const oldest = recent[0].values.weight;
    const newest = recent[recent.length - 1].values.weight;
    const days = (new Date(recent[recent.length - 1].timestamp) - new Date(recent[0].timestamp))
        / (1000 * 60 * 60 * 24);
    if (days < 1) return null;
    return ((newest - oldest) / days) * 7; // lbs per week
  };

  // Projected completion date
  const getProjection = () => {
    if (!currentWeight || !goalWeight) return null;
    const remaining = currentWeight - goalWeight;
    if (Math.abs(remaining) < 0.5) return 'Goal reached! 🎉';
    const weeklyRate = getWeeklyRate();
    if (!weeklyRate || Math.sign(weeklyRate) === Math.sign(remaining) === false) return null;
    // Rate must be moving toward goal
    if (isLossGoal && weeklyRate >= 0) return 'Trending away from goal';
    if (!isLossGoal && weeklyRate <= 0) return 'Trending away from goal';
    const weeksRemaining = Math.abs(remaining / weeklyRate);
    const projectedDate = new Date();
    projectedDate.setDate(projectedDate.getDate() + Math.round(weeksRemaining * 7));
    return `Est. ${projectedDate.toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' })}`;
  };

  const weeklyRate = getWeeklyRate();
  const projection = getProjection();
  const remaining = currentWeight && goalWeight
      ? Math.abs(currentWeight - goalWeight).toFixed(1)
      : null;
  const isAtOrPastGoal = currentWeight && goalWeight &&
      (isLossGoal ? currentWeight <= goalWeight : currentWeight >= goalWeight);

  // BMI for current weight
  const lastWithHeight = [...sorted].reverse().find(m => m.values?.height);
  const height = lastWithHeight?.values?.height || null;
  const currentBMI = height && currentWeight
      ? ((currentWeight / (height * height)) * 703).toFixed(1)
      : null;

  const getBMILabel = (bmi) => {
    const b = parseFloat(bmi);
    if (b >= 40) return { label: 'Obese III', color: 'text-red-600 dark:text-red-400' };
    if (b >= 35) return { label: 'Obese II', color: 'text-red-600 dark:text-red-400' };
    if (b >= 30) return { label: 'Obese I', color: 'text-orange-600 dark:text-orange-400' };
    if (b >= 25) return { label: 'Overweight', color: 'text-yellow-600 dark:text-yellow-400' };
    if (b >= 18.5) return { label: 'Normal', color: 'text-green-600 dark:text-green-400' };
    return { label: 'Underweight', color: 'text-yellow-600 dark:text-yellow-400' };
  };

  const bmiInfo = currentBMI ? getBMILabel(currentBMI) : null;

  return (
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4 space-y-4">

        {/* Header row */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xl">📊</span>
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white">
              Progress Dashboard
            </h3>
          </div>
          <div className="flex items-center gap-3">
            <button onClick={onEdit} className="text-xs text-blue-600 dark:text-blue-400 hover:underline">
              Edit Goal
            </button>
            <button onClick={onClear} className="text-xs text-gray-400 hover:text-red-500 dark:hover:text-red-400">
              Remove
            </button>
          </div>
        </div>

        {/* Four stat boxes: First / Now / Best / Goal */}
        <div className="grid grid-cols-4 gap-2">
          {[
            { label: 'First', value: firstWeight, highlight: false },
            { label: 'Now', value: currentWeight, highlight: true },
            { label: 'Best', value: bestWeight, highlight: false },
            { label: 'Goal', value: goalWeight, highlight: false },
          ].map(({ label, value, highlight }) => (
              <div
                  key={label}
                  className={`rounded-lg p-2 text-center ${
                      highlight
                          ? 'bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-700'
                          : 'bg-gray-50 dark:bg-gray-700/50'
                  }`}
              >
                <div className={`text-xs mb-1 ${
                    highlight
                        ? 'text-blue-600 dark:text-blue-400 font-semibold'
                        : 'text-gray-500 dark:text-gray-400'
                }`}>
                  {label}
                </div>
                <div className="text-base font-bold text-gray-900 dark:text-white leading-tight">
                  {value ?? '—'}
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-400">lbs</div>
              </div>
          ))}
        </div>

        {/* Progress bar */}
        {startWeight && currentWeight && (
            <div>
              <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mb-1">
                <span>Progress to goal</span>
                <span className="font-semibold text-gray-900 dark:text-white">
              {progressPct.toFixed(0)}%
            </span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3 overflow-hidden">
                <div
                    className={`h-3 rounded-full transition-all duration-500 ${
                        isAtOrPastGoal
                            ? 'bg-green-500'
                            : progressPct > 50
                                ? 'bg-blue-500'
                                : 'bg-blue-400'
                    }`}
                    style={{ width: `${progressPct}%` }}
                />
              </div>
              {remaining !== null && !isAtOrPastGoal && (
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    {remaining} lbs remaining
                  </p>
              )}
              {isAtOrPastGoal && (
                  <p className="text-xs text-green-600 dark:text-green-400 mt-1 font-medium">
                    🎉 Goal reached!
                  </p>
              )}
            </div>
        )}

        {/* BMI + Projection row */}
        <div className="grid grid-cols-2 gap-3">

          {/* Current BMI */}
          <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-3">
            <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">Current BMI</div>
            {currentBMI ? (
                <>
                  <div className="text-lg font-bold text-gray-900 dark:text-white">{currentBMI}</div>
                  <div className={`text-xs font-medium ${bmiInfo.color}`}>{bmiInfo.label}</div>
                </>
            ) : (
                <div className="text-xs text-gray-400 dark:text-gray-500">
                  Log height to calculate
                </div>
            )}
          </div>

          {/* Weekly rate + projection */}
          <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-3">
            <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">Weekly Rate</div>
            {weeklyRate !== null ? (
                <>
                  <div className={`text-lg font-bold ${
                      (isLossGoal && weeklyRate < 0) || (!isLossGoal && weeklyRate > 0)
                          ? 'text-green-600 dark:text-green-400'
                          : weeklyRate === 0
                              ? 'text-gray-500 dark:text-gray-400'
                              : 'text-red-600 dark:text-red-400'
                  }`}>
                    {weeklyRate > 0 ? '+' : ''}{weeklyRate.toFixed(1)}
                    <span className="text-xs font-normal text-gray-500 dark:text-gray-400 ml-1">lbs/wk</span>
                  </div>
                  {projection && (
                      <div className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{projection}</div>
                  )}
                </>
            ) : (
                <div className="text-xs text-gray-400 dark:text-gray-500">
                  Need 2+ entries in 30 days
                </div>
            )}
          </div>
        </div>

        {/* Target date if set */}
        {weightGoal.targetDate && (
            <p className="text-xs text-gray-500 dark:text-gray-400 text-center">
              🗓 Target date: {new Date(weightGoal.targetDate).toLocaleDateString()}
            </p>
        )}

      </div>
  );
};


// ============================================
// WEIGHT HISTORY ROW
// Shows each entry with delta from prior entry
// ============================================

const WeightHistoryRow = ({ measurement, previousMeasurement, onDelete }) => {
  const weight = measurement.values?.weight;
  const prevWeight = previousMeasurement?.values?.weight || null;

  // Calculate delta from previous entry
  const delta = prevWeight !== null ? (weight - prevWeight).toFixed(1) : null;
  const deltaNum = delta !== null ? parseFloat(delta) : null;

  const timestamp = new Date(measurement.timestamp);
  const formattedDate = timestamp.toLocaleDateString();
  const formattedTime = timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  // BMI display if height available
  const height = measurement.values?.height;
  const bmi = height ? ((weight / (height * height)) * 703).toFixed(1) : null;

  return (
      <div className="p-4 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
        <div className="flex items-center justify-between gap-3">

          {/* Date */}
          <div className="text-left w-20 flex-shrink-0">
            <div className="text-sm font-medium text-gray-900 dark:text-white">
              {timestamp.toLocaleDateString([], { month: '2-digit', day: '2-digit', year: '2-digit' })}
            </div>
            <div className="text-xs text-gray-500 dark:text-gray-400">{formattedTime}</div>
          </div>

          {/* Weight */}
          <div className="flex-1 text-center">
            <span className="text-xl font-bold text-gray-900 dark:text-white">{weight}</span>
            <span className="text-sm text-gray-500 dark:text-gray-400 ml-1">lbs</span>
            {bmi && (
                <div className="text-xs text-gray-500 dark:text-gray-400">BMI {bmi}</div>
            )}
          </div>

          {/* Delta */}
          <div className="w-16 text-center flex-shrink-0">
            {deltaNum !== null ? (
                <span className={`text-sm font-semibold ${
                    deltaNum > 0 ? 'text-red-600 dark:text-red-400' :
                        deltaNum < 0 ? 'text-green-600 dark:text-green-400' :
                            'text-gray-500 dark:text-gray-400'
                }`}>
              {deltaNum > 0 ? '+' : ''}{delta}
            </span>
            ) : (
                <span className="text-xs text-gray-400">first</span>
            )}
          </div>

          {/* Delete */}
          <button
              onClick={() => onDelete(measurement.id)}
              className="text-gray-400 hover:text-red-600 dark:hover:text-red-400 flex-shrink-0"
              title="Delete"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>

        </div>
      </div>
  );
};


// ============================================
// WEIGHT GOAL MODAL
// ============================================

const WeightGoalModal = ({ existingGoal, currentWeight, onSave, onCancel }) => {
  const [goalWeight, setGoalWeight] = useState(existingGoal?.goalWeight || '');
  const [targetDate, setTargetDate] = useState(existingGoal?.targetDate
      ? existingGoal.targetDate.split('T')[0]  // strip time for date input
      : ''
  );

  const handleSubmit = () => {
    if (!goalWeight || isNaN(goalWeight) || parseFloat(goalWeight) <= 0) {
      alert('Please enter a valid goal weight.');
      return;
    }
    onSave({
      goalWeight: parseFloat(goalWeight),
      targetDate: targetDate ? new Date(targetDate).toISOString() : null,
    });
  };

  return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
        <div className="bg-white dark:bg-gray-800 rounded-lg max-w-sm w-full">

          {/* Header */}
          <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-xl">🎯</span>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                {existingGoal ? 'Edit Goal' : 'Set Weight Goal'}
              </h3>
            </div>
            <button
                onClick={onCancel}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
            >
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Form */}
          <div className="p-4 space-y-4">

            {/* Current weight context */}
            {currentWeight && (
                <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-3 text-sm text-gray-600 dark:text-gray-400">
                  Current weight: <span className="font-semibold text-gray-900 dark:text-white">{currentWeight} lbs</span>
                </div>
            )}

            {/* Goal Weight */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Goal Weight (lbs) <span className="text-red-500">*</span>
              </label>
              <div className="flex items-center gap-2">
                <input
                    type="number"
                    min="50"
                    max="800"
                    step="0.1"
                    value={goalWeight}
                    onChange={(e) => setGoalWeight(e.target.value)}
                    placeholder="e.g. 200"
                    className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg
                  bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
                <span className="text-sm text-gray-500 dark:text-gray-400">lbs</span>
              </div>
            </div>

            {/* Target Date (optional) */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Target Date <span className="text-xs text-gray-400">(optional)</span>
              </label>
              <input
                  type="date"
                  value={targetDate}
                  onChange={(e) => setTargetDate(e.target.value)}
                  min={new Date().toISOString().split('T')[0]}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg
                bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                Used to calculate if you're on track for your goal
              </p>
            </div>

            {/* VA Context Note */}
            <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-3">
              <p className="text-xs text-blue-700 dark:text-blue-300">
                <span className="font-semibold">VA tip:</span> Weight change is relevant for
                Sleep Apnea, knee/back disabilities, Diabetes, and Eating Disorder claims.
                Consistent tracking strengthens your documentation.
              </p>
            </div>

            {/* Buttons */}
            <div className="flex gap-2 pt-1">
              <button
                  type="button"
                  onClick={onCancel}
                  className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg
                text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                Cancel
              </button>
              <button
                  type="button"
                  onClick={handleSubmit}
                  className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg
                transition-colors font-medium"
              >
                {existingGoal ? 'Update Goal' : 'Save Goal'}
              </button>
            </div>
          </div>

        </div>
      </div>
  );
};


// ============================================
// ADD WEIGHT MODAL
// Focused weight-only version of AddMeasurementModal.
// Strips out irrelevant fields from the generic modal.
// ============================================

const AddWeightModal = ({ onSave, onCancel, lastWeight }) => {
  // Auto-fill last weight if setting is enabled (default: on)
  const savedSettings = JSON.parse(localStorage.getItem('symptomTracker_settings') || '{}');
  const autoFill = savedSettings.autoFillLastWeight ?? true;
  const initialWeight = autoFill && lastWeight ? String(lastWeight) : '';
  const [weight, setWeight] = useState(initialWeight);
  const [timeOfDay, setTimeOfDay] = useState('morning');
  const [clothed, setCloathed] = useState(true);
  const [notes, setNotes] = useState('');
  const [timestamp, setTimestamp] = useState(() => formatLocalDateTime());

  // Pre-fill height from saved value
  const savedHeight = getHeight();
  const [height, setHeight] = useState(savedHeight || '');

  const handleSubmit = () => {
    if (!weight || isNaN(weight) || parseFloat(weight) <= 0) {
      alert('Please enter a valid weight.');
      return;
    }

    const values = { weight: parseFloat(weight) };
    if (height) values.height = parseFloat(height);

    onSave({
      measurementType: 'weight',
      values,
      metadata: { timeOfDay, clothed },
      notes,
      timestamp: new Date(timestamp).toISOString(),
    });
  };

  return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
        <div className="bg-white dark:bg-gray-800 rounded-lg max-w-sm w-full max-h-[90vh] overflow-y-auto">

          {/* Header */}
          <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between sticky top-0 bg-white dark:bg-gray-800">
            <div className="flex items-center gap-2">
              <span className="text-xl">⚖️</span>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Log Weight & BMI</h3>
            </div>
            <button onClick={onCancel} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Form */}
          <div className="p-4 space-y-4">

            {/* Date & Time */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Date & Time
              </label>
              <input
                  type="datetime-local"
                  value={timestamp}
                  onChange={(e) => setTimestamp(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg
                bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
            </div>

            {/* Weight */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Weight <span className="text-red-500">*</span>
              </label>
              <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Current weight in pounds</p>
              <div className="flex items-center gap-2">
                <input
                    type="number"
                    min="50"
                    max="800"
                    step="0.1"
                    value={weight}
                    onChange={(e) => setWeight(e.target.value)}
                    placeholder="175"
                    className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg
                  bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
                <span className="text-sm text-gray-500 dark:text-gray-400">lbs</span>
              </div>
            </div>

            {/* Height (if changed) */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Height (if changed)
              </label>
              <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Only enter if height has changed</p>
              <div className="flex items-center gap-2">
                <input
                    type="number"
                    min="36"
                    max="96"
                    step="0.5"
                    value={height}
                    onChange={(e) => setHeight(e.target.value)}
                    placeholder="70"
                    className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg
                  bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
                <span className="text-sm text-gray-500 dark:text-gray-400">inches</span>
              </div>
            </div>

            {/* Time of Day */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Time of day
              </label>
              <select
                  value={timeOfDay}
                  onChange={(e) => setTimeOfDay(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg
                bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              >
                <option value="morning">Morning (before eating)</option>
                <option value="afternoon">Afternoon</option>
                <option value="evening">Evening</option>
              </select>
            </div>

            {/* With Clothes */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                With clothes?
              </label>
              <div className="flex items-center gap-4">
                <label className="flex items-center gap-2">
                  <input
                      type="radio"
                      checked={clothed === true}
                      onChange={() => setCloathed(true)}
                      className="text-blue-600"
                  />
                  <span className="text-sm text-gray-700 dark:text-gray-300">Yes</span>
                </label>
                <label className="flex items-center gap-2">
                  <input
                      type="radio"
                      checked={clothed === false}
                      onChange={() => setCloathed(false)}
                      className="text-blue-600"
                  />
                  <span className="text-sm text-gray-700 dark:text-gray-300">No</span>
                </label>
              </div>
            </div>

            {/* Notes */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Notes (optional)
              </label>
              <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  rows={2}
                  placeholder="Any additional context..."
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg
                bg-white dark:bg-gray-700 text-gray-900 dark:text-white resize-none"
              />
            </div>

            {/* Buttons */}
            <div className="flex gap-2 pt-1">
              <button
                  type="button"
                  onClick={onCancel}
                  className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg
                text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                Cancel
              </button>
              <button
                  type="button"
                  onClick={handleSubmit}
                  className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg
                transition-colors font-medium"
              >
                Save Measurement
              </button>
            </div>

          </div>
        </div>
      </div>
  );
};

export default WeightTracker;