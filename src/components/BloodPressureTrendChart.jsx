import { useState } from 'react';
import { formatDisplayDate, formatDisplayTime } from '../utils/datetime';

/**
 * Blood Pressure Trend Chart
 * Displays systolic and diastolic readings over time with VA rating thresholds
 */
const BloodPressureTrendChart = ({ measurements, evaluationDays = 90 }) => {
  const [showDataPoints, setShowDataPoints] = useState(true);

  if (!measurements || measurements.length === 0) {
    return (
        <div className="bg-gray-50 dark:bg-gray-700/30 rounded-lg p-8 text-center">
          <div className="text-4xl mb-2">📊</div>
          <p className="text-gray-500 dark:text-gray-400">
            No blood pressure readings in evaluation period
          </p>
          <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
            Log BP measurements to see trends
          </p>
        </div>
    );
  }

  // Sort by timestamp (oldest first for chart)
  const sortedMeasurements = [...measurements].sort(
      (a, b) => new Date(a.timestamp) - new Date(b.timestamp)
  );

  // Chart dimensions
  const width = 600;
  const height = 300;
  const padding = { top: 20, right: 20, bottom: 40, left: 50 };
  const chartWidth = width - padding.left - padding.right;
  const chartHeight = height - padding.top - padding.bottom;

  // Data ranges
  const allSystolic = sortedMeasurements.map(m => m.values.systolic);
  const allDiastolic = sortedMeasurements.map(m => m.values.diastolic);

  const minBP = Math.min(...allDiastolic, 60);
  const maxBP = Math.max(...allSystolic, 200);
  const bpRange = maxBP - minBP;

  // Time range
  const timeMin = new Date(sortedMeasurements[0].timestamp).getTime();
  const timeMax = new Date(sortedMeasurements[sortedMeasurements.length - 1].timestamp).getTime();
  const timeRange = timeMax - timeMin || 1; // Avoid division by zero

  // Scale functions
  const scaleX = (timestamp) => {
    const time = new Date(timestamp).getTime();
    return padding.left + ((time - timeMin) / timeRange) * chartWidth;
  };

  const scaleY = (value) => {
    return padding.top + chartHeight - ((value - minBP) / bpRange) * chartHeight;
  };

  // VA Rating Thresholds (horizontal lines)
  const thresholds = [
    { value: 130, label: 'Stage 1 (Systolic)', color: 'orange', dash: '5,5' },
    { value: 140, label: 'Stage 2 (Systolic)', color: 'red', dash: '5,5' },
    { value: 90, label: 'Stage 1 (Diastolic)', color: 'orange', dash: '3,3' },
    { value: 100, label: '10% (Diastolic)', color: 'purple', dash: '3,3' },
    { value: 110, label: '20% (Diastolic)', color: 'red', dash: '3,3' },
  ];

  // Create line paths
  const systolicPath = sortedMeasurements
  .map((m, i) => {
    const x = scaleX(m.timestamp);
    const y = scaleY(m.values.systolic);
    return `${i === 0 ? 'M' : 'L'} ${x} ${y}`;
  })
  .join(' ');

  const diastolicPath = sortedMeasurements
  .map((m, i) => {
    const x = scaleX(m.timestamp);
    const y = scaleY(m.values.diastolic);
    return `${i === 0 ? 'M' : 'L'} ${x} ${y}`;
  })
  .join(' ');

  // Calculate stats
  const avgSystolic = Math.round(allSystolic.reduce((a, b) => a + b, 0) / allSystolic.length);
  const avgDiastolic = Math.round(allDiastolic.reduce((a, b) => a + b, 0) / allDiastolic.length);

  return (
      <div className="space-y-4 text-left">
        {/* Stats Summary */}
        <div className="grid grid-cols-3 gap-3">
          <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-3 text-center">
            <div className="text-2xl font-bold text-blue-900 dark:text-blue-300">
              {measurements.length}
            </div>
            <div className="text-xs text-blue-700 dark:text-blue-400">
              Readings
            </div>
          </div>
          <div className="bg-red-50 dark:bg-red-900/20 rounded-lg p-3 text-center">
            <div className="text-2xl font-bold text-red-900 dark:text-red-300">
              {avgSystolic}
            </div>
            <div className="text-xs text-red-700 dark:text-red-400">
              Avg Systolic
            </div>
          </div>
          <div className="bg-purple-50 dark:bg-purple-900/20 rounded-lg p-3 text-center">
            <div className="text-2xl font-bold text-purple-900 dark:text-purple-300">
              {avgDiastolic}
            </div>
            <div className="text-xs text-purple-700 dark:text-purple-400">
              Avg Diastolic
            </div>
          </div>
        </div>

        {/* Chart Controls */}
        <div className="flex items-center justify-between">
          <h4 className="text-sm font-medium text-gray-900 dark:text-white">
            Blood Pressure Trend
          </h4>
          <button
              onClick={() => setShowDataPoints(!showDataPoints)}
              className="text-xs text-blue-600 dark:text-blue-400 hover:underline"
          >
            {showDataPoints ? 'Hide' : 'Show'} data points
          </button>
        </div>

        {/* Chart */}
        <div className="bg-white dark:bg-gray-800 rounded-lg p-4 overflow-x-auto">
          <svg
              viewBox={`0 0 ${width} ${height}`}
              className="w-full"
              style={{ minWidth: '500px' }}
          >
            {/* Grid lines */}
            {[60, 80, 100, 120, 140, 160, 180, 200].map(value => (
                <g key={value}>
                  <line
                      x1={padding.left}
                      y1={scaleY(value)}
                      x2={width - padding.right}
                      y2={scaleY(value)}
                      stroke="currentColor"
                      className="text-gray-200 dark:text-gray-700"
                      strokeWidth="1"
                  />
                  <text
                      x={padding.left - 5}
                      y={scaleY(value)}
                      textAnchor="end"
                      alignmentBaseline="middle"
                      className="text-gray-500 dark:text-gray-400 text-xs"
                      fill="currentColor"
                  >
                    {value}
                  </text>
                </g>
            ))}

            {/* VA Rating Thresholds */}
            {thresholds.map((threshold, i) => {
              if (threshold.value < minBP || threshold.value > maxBP) return null;
              return (
                  <g key={i}>
                    <line
                        x1={padding.left}
                        y1={scaleY(threshold.value)}
                        x2={width - padding.right}
                        y2={scaleY(threshold.value)}
                        stroke={threshold.color}
                        strokeWidth="1.5"
                        strokeDasharray={threshold.dash}
                        opacity="0.5"
                    />
                  </g>
              );
            })}

            {/* Systolic line */}
            <path
                d={systolicPath}
                fill="none"
                stroke="#DC2626"
                strokeWidth="2"
                className="drop-shadow"
            />

            {/* Diastolic line */}
            <path
                d={diastolicPath}
                fill="none"
                stroke="#7C3AED"
                strokeWidth="2"
                className="drop-shadow"
            />

            {/* Data points */}
            {showDataPoints && sortedMeasurements.map((m, i) => (
                <g key={i}>
                  {/* Systolic point */}
                  <circle
                      cx={scaleX(m.timestamp)}
                      cy={scaleY(m.values.systolic)}
                      r="4"
                      fill="#DC2626"
                      stroke="white"
                      strokeWidth="2"
                      className="cursor-pointer hover:r-6"
                  >
                    <title>
                      {formatDisplayDate(m.timestamp)} {formatDisplayTime(m.timestamp)}
                      {'\n'}Systolic: {m.values.systolic} mmHg
                    </title>
                  </circle>

                  {/* Diastolic point */}
                  <circle
                      cx={scaleX(m.timestamp)}
                      cy={scaleY(m.values.diastolic)}
                      r="4"
                      fill="#7C3AED"
                      stroke="white"
                      strokeWidth="2"
                      className="cursor-pointer hover:r-6"
                  >
                    <title>
                      {formatDisplayDate(m.timestamp)} {formatDisplayTime(m.timestamp)}
                      {'\n'}Diastolic: {m.values.diastolic} mmHg
                    </title>
                  </circle>
                </g>
            ))}

            {/* X-axis labels (dates) */}
            {sortedMeasurements.length <= 10 ? (
                // Show all dates if 10 or fewer readings
                sortedMeasurements.map((m, i) => (
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
                // Show first, middle, last for more than 10
                <>
                  <text
                      x={scaleX(sortedMeasurements[0].timestamp)}
                      y={height - padding.bottom + 20}
                      textAnchor="start"
                      className="text-gray-600 dark:text-gray-400 text-xs"
                      fill="currentColor"
                  >
                    {new Date(sortedMeasurements[0].timestamp).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                  </text>
                  <text
                      x={scaleX(sortedMeasurements[sortedMeasurements.length - 1].timestamp)}
                      y={height - padding.bottom + 20}
                      textAnchor="end"
                      className="text-gray-600 dark:text-gray-400 text-xs"
                      fill="currentColor"
                  >
                    {new Date(sortedMeasurements[sortedMeasurements.length - 1].timestamp).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                  </text>
                </>
            )}

            {/* Y-axis label */}
            <text
                x={15}
                y={height / 2}
                textAnchor="middle"
                transform={`rotate(-90, 15, ${height / 2})`}
                className="text-gray-600 dark:text-gray-400 text-xs font-medium"
                fill="currentColor"
            >
              Blood Pressure (mmHg)
            </text>
          </svg>
        </div>

        {/* Legend */}
        <div className="flex flex-wrap gap-4 text-xs">
          <div className="flex items-center gap-2">
            <div className="w-8 h-0.5 bg-red-600"></div>
            <span className="text-gray-700 dark:text-gray-300">Systolic</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-0.5 bg-purple-600"></div>
            <span className="text-gray-700 dark:text-gray-300">Diastolic</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-0.5 border-t-2 border-dashed border-orange-500"></div>
            <span className="text-gray-700 dark:text-gray-300">Stage 1</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-0.5 border-t-2 border-dashed border-red-500"></div>
            <span className="text-gray-700 dark:text-gray-300">Stage 2</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-0.5 border-t-2 border-dashed border-purple-500"></div>
            <span className="text-gray-700 dark:text-gray-300">VA Thresholds</span>
          </div>
        </div>
      </div>
  );
};

export default BloodPressureTrendChart;