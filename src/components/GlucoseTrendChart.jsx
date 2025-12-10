import { useState } from 'react';
import { formatDisplayDate, formatDisplayTime } from '../utils/datetime';

/**
 * Glucose Trend Chart with HbA1c Overlay
 * Displays blood glucose readings over time with diabetes thresholds and HbA1c trend
 */
const GlucoseTrendChart = ({ glucoseMeasurements, hba1cMeasurements, evaluationDays = 90 }) => {
  const [showDataPoints, setShowDataPoints] = useState(true);
  const [showHbA1c, setShowHbA1c] = useState(true);

  if (!glucoseMeasurements || glucoseMeasurements.length === 0) {
    return (
        <div className="bg-gray-50 dark:bg-gray-700/30 rounded-lg p-8 text-center">
          <div className="text-4xl mb-2">📊</div>
          <p className="text-gray-500 dark:text-gray-400">
            No glucose readings in evaluation period
          </p>
          <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
            Log blood glucose measurements to see trends
          </p>
        </div>
    );
  }

  // Sort by timestamp (oldest first for chart)
  const sortedGlucose = [...glucoseMeasurements].sort(
      (a, b) => new Date(a.timestamp) - new Date(b.timestamp)
  );

  const sortedHbA1c = hba1cMeasurements ? [...hba1cMeasurements].sort(
      (a, b) => new Date(a.timestamp) - new Date(b.timestamp)
  ) : [];

  // Chart dimensions
  const width = 600;
  const height = 300;
  const padding = { top: 20, right: 60, bottom: 40, left: 50 };
  const chartWidth = width - padding.left - padding.right;
  const chartHeight = height - padding.top - padding.bottom;

  // Data ranges for glucose
  const allGlucose = sortedGlucose.map(m => m.values.glucose);
  const minGlucose = Math.min(...allGlucose, 60);
  const maxGlucose = Math.max(...allGlucose, 300);
  const glucoseRange = maxGlucose - minGlucose;

  // Time range
  const timeMin = new Date(sortedGlucose[0].timestamp).getTime();
  const timeMax = new Date(sortedGlucose[sortedGlucose.length - 1].timestamp).getTime();
  const timeRange = timeMax - timeMin || 1; // Avoid division by zero

  // Scale functions for glucose
  const scaleX = (timestamp) => {
    const time = new Date(timestamp).getTime();
    return padding.left + ((time - timeMin) / timeRange) * chartWidth;
  };

  const scaleYGlucose = (value) => {
    return padding.top + chartHeight - ((value - minGlucose) / glucoseRange) * chartHeight;
  };

  // HbA1c scale (right axis, 4-14%)
  const scaleYHbA1c = (value) => {
    const hba1cMin = 4;
    const hba1cMax = 14;
    const hba1cRange = hba1cMax - hba1cMin;
    return padding.top + chartHeight - ((value - hba1cMin) / hba1cRange) * chartHeight;
  };

  // Glucose thresholds (horizontal lines)
  const glucoseThresholds = [
    { value: 70, label: 'Hypoglycemia', color: 'red', dash: '5,5' },
    { value: 100, label: 'Fasting Target', color: 'green', dash: '3,3' },
    { value: 126, label: 'Diabetes (Fasting)', color: 'orange', dash: '5,5' },
    { value: 180, label: 'Post-meal Target', color: 'orange', dash: '3,3' },
    { value: 250, label: 'Severe Hyperglycemia', color: 'red', dash: '5,5' },
  ];

  // HbA1c thresholds
  const hba1cThresholds = [
    { value: 5.7, label: 'Prediabetes', color: 'yellow' },
    { value: 6.5, label: 'Diabetes', color: 'orange' },
    { value: 7, label: 'Target', color: 'blue' },
    { value: 9, label: 'Poor Control', color: 'red' },
  ];

  // Create glucose line path
  const glucosePath = sortedGlucose
  .map((m, i) => {
    const x = scaleX(m.timestamp);
    const y = scaleYGlucose(m.values.glucose);
    return `${i === 0 ? 'M' : 'L'} ${x} ${y}`;
  })
  .join(' ');

  // Create HbA1c line path if available
  const hba1cPath = sortedHbA1c.length > 0 ? sortedHbA1c
  .map((m, i) => {
    const x = scaleX(m.timestamp);
    const y = scaleYHbA1c(m.values.hba1c);
    return `${i === 0 ? 'M' : 'L'} ${x} ${y}`;
  })
  .join(' ') : '';

  // Calculate stats
  const avgGlucose = Math.round(allGlucose.reduce((a, b) => a + b, 0) / allGlucose.length);
  const fastingReadings = sortedGlucose.filter(m => m.metadata?.fasting);
  const avgFasting = fastingReadings.length > 0
      ? Math.round(fastingReadings.reduce((sum, m) => sum + m.values.glucose, 0) / fastingReadings.length)
      : null;

  const hypoglycemicCount = sortedGlucose.filter(m => m.values.glucose < 70).length;
  const hyperglycemicCount = sortedGlucose.filter(m => m.values.glucose > 180).length;

  return (
      <div className="space-y-4 text-left">
        {/* Stats Summary */}
        <div className="grid grid-cols-4 gap-2">
          <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-2 text-center">
            <div className="text-xl font-bold text-blue-900 dark:text-blue-300">
              {glucoseMeasurements.length}
            </div>
            <div className="text-xs text-blue-700 dark:text-blue-400">
              Readings
            </div>
          </div>
          <div className="bg-purple-50 dark:bg-purple-900/20 rounded-lg p-2 text-center">
            <div className="text-xl font-bold text-purple-900 dark:text-purple-300">
              {avgGlucose}
            </div>
            <div className="text-xs text-purple-700 dark:text-purple-400">
              Avg mg/dL
            </div>
          </div>
          {avgFasting && (
              <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-2 text-center">
                <div className="text-xl font-bold text-green-900 dark:text-green-300">
                  {avgFasting}
                </div>
                <div className="text-xs text-green-700 dark:text-green-400">
                  Avg Fasting
                </div>
              </div>
          )}
          {sortedHbA1c.length > 0 && (
              <div className="bg-orange-50 dark:bg-orange-900/20 rounded-lg p-2 text-center">
                <div className="text-xl font-bold text-orange-900 dark:text-orange-300">
                  {sortedHbA1c[sortedHbA1c.length - 1].values.hba1c}%
                </div>
                <div className="text-xs text-orange-700 dark:text-orange-400">
                  Latest HbA1c
                </div>
              </div>
          )}
        </div>

        {/* Issue Summary */}
        {(hypoglycemicCount > 0 || hyperglycemicCount > 0) && (
            <div className="flex gap-2 text-xs">
              {hypoglycemicCount > 0 && (
                  <div className="bg-red-50 dark:bg-red-900/20 px-2 py-1 rounded text-red-700 dark:text-red-400">
                    ⚠️ {hypoglycemicCount} low (&lt;70)
                  </div>
              )}
              {hyperglycemicCount > 0 && (
                  <div className="bg-orange-50 dark:bg-orange-900/20 px-2 py-1 rounded text-orange-700 dark:text-orange-400">
                    ⚠️ {hyperglycemicCount} high (&gt;180)
                  </div>
              )}
            </div>
        )}

        {/* Chart Controls */}
        <div className="flex items-center justify-between">
          <h4 className="text-sm font-medium text-gray-900 dark:text-white">
            Glucose Trend
          </h4>
          <div className="flex gap-3">
            <button
                onClick={() => setShowDataPoints(!showDataPoints)}
                className="text-xs text-blue-600 dark:text-blue-400 hover:underline"
            >
              {showDataPoints ? 'Hide' : 'Show'} points
            </button>
            {sortedHbA1c.length > 0 && (
                <button
                    onClick={() => setShowHbA1c(!showHbA1c)}
                    className="text-xs text-orange-600 dark:text-orange-400 hover:underline"
                >
                  {showHbA1c ? 'Hide' : 'Show'} HbA1c
                </button>
            )}
          </div>
        </div>

        {/* Chart */}
        <div className="bg-white dark:bg-gray-800 rounded-lg p-4 overflow-x-auto">
          <svg
              viewBox={`0 0 ${width} ${height}`}
              className="w-full"
              style={{ minWidth: '500px' }}
          >
            {/* Grid lines (glucose) */}
            {[60, 100, 150, 200, 250, 300].map(value => {
              if (value < minGlucose || value > maxGlucose) return null;
              return (
                  <g key={value}>
                    <line
                        x1={padding.left}
                        y1={scaleYGlucose(value)}
                        x2={width - padding.right}
                        y2={scaleYGlucose(value)}
                        stroke="currentColor"
                        className="text-gray-200 dark:text-gray-700"
                        strokeWidth="1"
                    />
                    <text
                        x={padding.left - 5}
                        y={scaleYGlucose(value)}
                        textAnchor="end"
                        alignmentBaseline="middle"
                        className="text-gray-500 dark:text-gray-400 text-xs"
                        fill="currentColor"
                    >
                      {value}
                    </text>
                  </g>
              );
            })}

            {/* Right axis labels (HbA1c) */}
            {showHbA1c && sortedHbA1c.length > 0 && [5, 7, 9, 11].map(value => (
                <text
                    key={`hba1c-${value}`}
                    x={width - padding.right + 5}
                    y={scaleYHbA1c(value)}
                    textAnchor="start"
                    alignmentBaseline="middle"
                    className="text-orange-500 dark:text-orange-400 text-xs"
                    fill="currentColor"
                >
                  {value}%
                </text>
            ))}

            {/* Glucose thresholds */}
            {glucoseThresholds.map((threshold, i) => {
              if (threshold.value < minGlucose || threshold.value > maxGlucose) return null;
              return (
                  <line
                      key={i}
                      x1={padding.left}
                      y1={scaleYGlucose(threshold.value)}
                      x2={width - padding.right}
                      y2={scaleYGlucose(threshold.value)}
                      stroke={threshold.color}
                      strokeWidth="1.5"
                      strokeDasharray={threshold.dash}
                      opacity="0.4"
                  />
              );
            })}

            {/* Glucose line */}
            <path
                d={glucosePath}
                fill="none"
                stroke="#7C3AED"
                strokeWidth="2.5"
                className="drop-shadow"
            />

            {/* HbA1c line */}
            {showHbA1c && hba1cPath && (
                <path
                    d={hba1cPath}
                    fill="none"
                    stroke="#F97316"
                    strokeWidth="2.5"
                    strokeDasharray="5,5"
                    className="drop-shadow"
                />
            )}

            {/* Glucose data points */}
            {showDataPoints && sortedGlucose.map((m, i) => {
              const isFasting = m.metadata?.fasting;
              const isHypo = m.values.glucose < 70;
              const isHyper = m.values.glucose > 180;

              let color = '#7C3AED'; // purple
              if (isHypo) color = '#DC2626'; // red
              else if (isHyper) color = '#F97316'; // orange

              return (
                  <circle
                      key={i}
                      cx={scaleX(m.timestamp)}
                      cy={scaleYGlucose(m.values.glucose)}
                      r={isFasting ? "5" : "4"}
                      fill={color}
                      stroke="white"
                      strokeWidth="2"
                      className="cursor-pointer"
                  >
                    <title>
                      {formatDisplayDate(m.timestamp)} {formatDisplayTime(m.timestamp)}
                      {'\n'}Glucose: {m.values.glucose} mg/dL
                      {isFasting ? '\n(Fasting)' : '\n(Non-fasting)'}
                    </title>
                  </circle>
              );
            })}

            {/* HbA1c data points */}
            {showHbA1c && showDataPoints && sortedHbA1c.map((m, i) => (
                <g key={`hba1c-${i}`}>
                  <circle
                      cx={scaleX(m.timestamp)}
                      cy={scaleYHbA1c(m.values.hba1c)}
                      r="5"
                      fill="#F97316"
                      stroke="white"
                      strokeWidth="2"
                      className="cursor-pointer"
                  >
                    <title>
                      {formatDisplayDate(m.timestamp)}
                      {'\n'}HbA1c: {m.values.hba1c}%
                    </title>
                  </circle>
                </g>
            ))}

            {/* X-axis labels (dates) */}
            {sortedGlucose.length <= 10 ? (
                sortedGlucose.map((m, i) => (
                    <text
                        key={i}
                        x={scaleX(m.timestamp)}
                        y={height - padding.bottom + 20}
                        textAnchor="middle"
                        className="text-gray-600 dark:text-gray-400 text-xs"
                        fill="currentColor"
                    >
                      {new Date(m.timestamp).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                    </text>
                ))
            ) : (
                <>
                  <text
                      x={scaleX(sortedGlucose[0].timestamp)}
                      y={height - padding.bottom + 20}
                      textAnchor="start"
                      className="text-gray-600 dark:text-gray-400 text-xs"
                      fill="currentColor"
                  >
                    {new Date(sortedGlucose[0].timestamp).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                  </text>
                  <text
                      x={scaleX(sortedGlucose[sortedGlucose.length - 1].timestamp)}
                      y={height - padding.bottom + 20}
                      textAnchor="end"
                      className="text-gray-600 dark:text-gray-400 text-xs"
                      fill="currentColor"
                  >
                    {new Date(sortedGlucose[sortedGlucose.length - 1].timestamp).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                  </text>
                </>
            )}

            {/* Y-axis label (glucose) */}
            <text
                x={15}
                y={height / 2}
                textAnchor="middle"
                transform={`rotate(-90, 15, ${height / 2})`}
                className="text-gray-600 dark:text-gray-400 text-xs font-medium"
                fill="currentColor"
            >
              Blood Glucose (mg/dL)
            </text>

            {/* Right Y-axis label (HbA1c) */}
            {showHbA1c && sortedHbA1c.length > 0 && (
                <text
                    x={width - 15}
                    y={height / 2}
                    textAnchor="middle"
                    transform={`rotate(90, ${width - 15}, ${height / 2})`}
                    className="text-orange-500 dark:text-orange-400 text-xs font-medium"
                    fill="currentColor"
                >
                  HbA1c (%)
                </text>
            )}
          </svg>
        </div>

        {/* Legend */}
        <div className="flex flex-wrap gap-4 text-xs">
          <div className="flex items-center gap-2">
            <div className="w-8 h-0.5 bg-purple-600"></div>
            <span className="text-gray-700 dark:text-gray-300">Glucose</span>
          </div>
          {showHbA1c && sortedHbA1c.length > 0 && (
              <div className="flex items-center gap-2">
                <div className="w-8 h-0.5 border-t-2 border-dashed border-orange-500"></div>
                <span className="text-gray-700 dark:text-gray-300">HbA1c</span>
              </div>
          )}
          <div className="flex items-center gap-2">
            <div className="w-8 h-0.5 border-t-2 border-dashed border-red-500"></div>
            <span className="text-gray-700 dark:text-gray-300">Hypo (&lt;70)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-0.5 border-t-2 border-dashed border-green-500"></div>
            <span className="text-gray-700 dark:text-gray-300">Target (100)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-0.5 border-t-2 border-dashed border-orange-500"></div>
            <span className="text-gray-700 dark:text-gray-300">High (&gt;180)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-purple-600 border-2 border-white"></div>
            <span className="text-gray-700 dark:text-gray-300">Fasting (larger)</span>
          </div>
        </div>
      </div>
  );
};

export default GlucoseTrendChart;