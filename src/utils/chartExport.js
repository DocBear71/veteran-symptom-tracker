// ============================================
// CHART EXPORT UTILITIES FOR PDF GENERATION
// ============================================
// Generates chart images (base64) for embedding in PDFs
// Used by VA Claim Package and Standard Reports

/**
 * Generate Blood Pressure Trend Chart as base64 image
 * @param {Array} measurements - Array of BP measurement objects
 * @param {Object} options - Chart options (width, height, title)
 * @returns {string} Base64 encoded PNG image
 */
export const generateBPTrendChart = (measurements, options = {}) => {
  const {
    width = 600,
    height = 300,
    title = 'Blood Pressure Trends',
    showThresholds = true
  } = options;

  if (!measurements || measurements.length === 0) {
    return null;
  }

  // Create canvas
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');

  // Background
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(0, 0, width, height);

  // Padding and chart area
  const padding = { top: 50, right: 40, bottom: 60, left: 60 };
  const chartWidth = width - padding.left - padding.right;
  const chartHeight = height - padding.top - padding.bottom;

  // Sort measurements by timestamp
  const sortedMeasurements = [...measurements].sort(
      (a, b) => new Date(a.timestamp) - new Date(b.timestamp)
  );

  // Extract data with validation
  const systolicValues = sortedMeasurements
  .filter(m => m.values && m.values.systolic && m.timestamp)
  .map(m => m.values.systolic);

  const diastolicValues = sortedMeasurements
  .filter(m => m.values && m.values.diastolic && m.timestamp)
  .map(m => m.values.diastolic);

  const timestamps = sortedMeasurements
  .filter(m => m.timestamp)
  .map(m => new Date(m.timestamp))
  .filter(d => !isNaN(d.getTime())); // Filter out invalid dates

  // Need at least 2 data points for a meaningful chart
  if (systolicValues.length < 2 || diastolicValues.length < 2 || timestamps.length < 2) {
    console.warn('Insufficient blood pressure data for chart generation');
    return null;
  }

  // Data ranges
  const minBP = Math.min(...diastolicValues, 60);
  const maxBP = Math.max(...systolicValues, 200);
  const bpRange = maxBP - minBP;

  const timeMin = timestamps[0].getTime();
  const timeMax = timestamps[timestamps.length - 1].getTime();
  const timeRange = timeMax - timeMin || 1;

  // Scale functions
  const scaleX = (timestamp) => {
    const time = new Date(timestamp).getTime();
    return padding.left + ((time - timeMin) / timeRange) * chartWidth;
  };

  const scaleY = (value) => {
    return padding.top + chartHeight - ((value - minBP) / bpRange) * chartHeight;
  };

  // Draw title
  ctx.fillStyle = '#1e3a8a';
  ctx.font = 'bold 36px Arial';
  ctx.textAlign = 'center';
  ctx.fillText(title, width / 2, 25);

  // Draw axes
  ctx.strokeStyle = '#666';
  ctx.lineWidth = 4;
  ctx.beginPath();
  // Y-axis
  ctx.moveTo(padding.left, padding.top);
  ctx.lineTo(padding.left, height - padding.bottom);
  // X-axis
  ctx.lineTo(width - padding.right, height - padding.bottom);
  ctx.stroke();

  // Y-axis labels (BP values)
  ctx.fillStyle = '#333';
  ctx.font = '24px Arial';
  ctx.textAlign = 'right';
  for (let bp = Math.ceil(minBP / 10) * 10; bp <= maxBP; bp += 20) {
    const y = scaleY(bp);
    ctx.fillText(bp.toString(), padding.left - 10, y + 4);

    // Grid line
    ctx.strokeStyle = '#e5e5e5';
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.moveTo(padding.left, y);
    ctx.lineTo(width - padding.right, y);
    ctx.stroke();
  }

  // Y-axis label
  ctx.save();
  ctx.translate(20, height / 2);
  ctx.rotate(-Math.PI / 2);
  ctx.textAlign = 'center';
  ctx.fillStyle = '#333';
  ctx.font = 'bold 28px Arial';
  ctx.fillText('Blood Pressure (mmHg)', 0, 0);
  ctx.restore();

  // X-axis labels (dates)
  ctx.textAlign = 'center';
  ctx.fillStyle = '#333';
  ctx.font = '22px Arial';

  const numXLabels = Math.min(5, timestamps.length);
  for (let i = 0; i < numXLabels; i++) {
    const index = Math.floor((timestamps.length - 1) * i / (numXLabels - 1));
    const timestamp = timestamps[index];
    const x = scaleX(timestamp);
    const dateStr = timestamp.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    ctx.fillText(dateStr, x, height - padding.bottom + 20);
  }

  // VA Rating Thresholds (if enabled)
  if (showThresholds) {
    const thresholds = [
      { value: 140, label: 'Stage 2 (140)', color: '#dc2626', dash: [5, 5] },
      { value: 130, label: 'Stage 1 (130)', color: '#f97316', dash: [5, 5] },
      { value: 110, label: '20% (110)', color: '#7c3aed', dash: [3, 3] },
      { value: 100, label: '10% (100)', color: '#8b5cf6', dash: [3, 3] },
    ];

    thresholds.forEach(threshold => {
      const y = scaleY(threshold.value);

      ctx.strokeStyle = threshold.color;
      ctx.lineWidth = 6;
      ctx.setLineDash(threshold.dash);
      ctx.beginPath();
      ctx.moveTo(padding.left, y);
      ctx.lineTo(width - padding.right, y);
      ctx.stroke();
      ctx.setLineDash([]);

      // Threshold label
      ctx.fillStyle = threshold.color;
      ctx.font = '20px Arial';
      ctx.textAlign = 'right';
      ctx.fillText(threshold.label, width - padding.right - 5, y - 3);
    });
  }

  // Draw systolic line (red)
  ctx.strokeStyle = '#dc2626';
  ctx.lineWidth = 5;
  ctx.beginPath();
  sortedMeasurements.forEach((m, i) => {
    const x = scaleX(m.timestamp);
    const y = scaleY(m.values.systolic);
    if (i === 0) {
      ctx.moveTo(x, y);
    } else {
      ctx.lineTo(x, y);
    }
  });
  ctx.stroke();

  // Draw diastolic line (blue)
  ctx.strokeStyle = '#2563eb';
  ctx.lineWidth = 5;
  ctx.beginPath();
  sortedMeasurements.forEach((m, i) => {
    const x = scaleX(m.timestamp);
    const y = scaleY(m.values.diastolic);
    if (i === 0) {
      ctx.moveTo(x, y);
    } else {
      ctx.lineTo(x, y);
    }
  });
  ctx.stroke();

  // Draw data points
  sortedMeasurements.forEach(m => {
    const x = scaleX(m.timestamp);

    // Systolic point
    ctx.fillStyle = '#dc2626';
    ctx.beginPath();
    ctx.arc(x, scaleY(m.values.systolic), 4, 0, 2 * Math.PI);
    ctx.fill();

    // Diastolic point
    ctx.fillStyle = '#2563eb';
    ctx.beginPath();
    ctx.arc(x, scaleY(m.values.diastolic), 4, 0, 2 * Math.PI);
    ctx.fill();
  });

  // Legend
  const legendX = width - padding.right - 150;
  const legendY = padding.top + 10;

  // Systolic legend
  ctx.fillStyle = '#dc2626';
  ctx.fillRect(legendX, legendY, 20, 3);
  ctx.fillStyle = '#333';
  ctx.font = '24px Arial';
  ctx.textAlign = 'left';
  ctx.fillText('Systolic', legendX + 25, legendY + 4);

  // Diastolic legend
  ctx.fillStyle = '#2563eb';
  ctx.fillRect(legendX, legendY + 15, 20, 3);
  ctx.fillStyle = '#333';
  ctx.fillText('Diastolic', legendX + 25, legendY + 19);

  // Stats box
  const avgSystolic = Math.round(systolicValues.reduce((a, b) => a + b, 0) / systolicValues.length);
  const avgDiastolic = Math.round(diastolicValues.reduce((a, b) => a + b, 0) / diastolicValues.length);

  ctx.fillStyle = '#f3f4f6';
  ctx.fillRect(padding.left + 10, padding.top + 10, 120, 50);
  ctx.strokeStyle = '#d1d5db';
  ctx.strokeRect(padding.left + 10, padding.top + 10, 120, 50);

  ctx.fillStyle = '#333';
  ctx.font = 'bold 22px Arial';
  ctx.textAlign = 'left';
  ctx.fillText('Average BP:', padding.left + 15, padding.top + 25);
  ctx.font = '22px Arial';
  ctx.fillText(`${avgSystolic}/${avgDiastolic} mmHg`, padding.left + 15, padding.top + 40);
  ctx.fillText(`${measurements.length} readings`, padding.left + 15, padding.top + 53);

  // Convert to base64
  return canvas.toDataURL('image/png');
};

/**
 * Generate Glucose Trend Chart as base64 image
 * @param {Array} measurements - Array of glucose measurement objects
 * @param {Object} options - Chart options
 * @returns {string} Base64 encoded PNG image
 */
export const generateGlucoseTrendChart = (measurements, options = {}) => {
  const {
    width = 600,
    height = 300,
    title = 'Blood Glucose Trends'
  } = options;

  if (!measurements || measurements.length === 0) {
    return null;
  }

  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');

  // Background
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(0, 0, width, height);

  const padding = { top: 50, right: 40, bottom: 60, left: 60 };
  const chartWidth = width - padding.left - padding.right;
  const chartHeight = height - padding.top - padding.bottom;

  // Sort and extract data
  const sortedMeasurements = [...measurements].sort(
      (a, b) => new Date(a.timestamp) - new Date(b.timestamp)
  );

  const glucoseValues = sortedMeasurements
  .filter(m => m.values && m.values.glucose && m.timestamp)
  .map(m => m.values.glucose);

  const timestamps = sortedMeasurements
  .filter(m => m.timestamp)
  .map(m => new Date(m.timestamp))
  .filter(d => !isNaN(d.getTime())); // Filter out invalid dates

  // Need at least 2 data points for a meaningful chart
  if (glucoseValues.length < 2 || timestamps.length < 2) {
    console.warn('Insufficient glucose data for chart generation');
    return null;
  }

  // Data ranges
  const minGlucose = Math.min(...glucoseValues, 70);
  const maxGlucose = Math.max(...glucoseValues, 200);
  const glucoseRange = maxGlucose - minGlucose;

  const timeMin = timestamps[0].getTime();
  const timeMax = timestamps[timestamps.length - 1].getTime();
  const timeRange = timeMax - timeMin || 1;

  // Scale functions
  const scaleX = (timestamp) => {
    const time = new Date(timestamp).getTime();
    return padding.left + ((time - timeMin) / timeRange) * chartWidth;
  };

  const scaleY = (value) => {
    return padding.top + chartHeight - ((value - minGlucose) / glucoseRange) * chartHeight;
  };

  // Draw title
  ctx.fillStyle = '#1e3a8a';
  ctx.font = 'bold 36px Arial';
  ctx.textAlign = 'center';
  ctx.fillText(title, width / 2, 25);

  // Draw axes
  ctx.strokeStyle = '#666';
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.moveTo(padding.left, padding.top);
  ctx.lineTo(padding.left, height - padding.bottom);
  ctx.lineTo(width - padding.right, height - padding.bottom);
  ctx.stroke();

  // Y-axis labels
  ctx.fillStyle = '#333';
  ctx.font = '24px Arial';
  ctx.textAlign = 'right';
  for (let glucose = Math.ceil(minGlucose / 20) * 20; glucose <= maxGlucose; glucose += 40) {
    const y = scaleY(glucose);
    ctx.fillText(glucose.toString(), padding.left - 10, y + 4);

    ctx.strokeStyle = '#e5e5e5';
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.moveTo(padding.left, y);
    ctx.lineTo(width - padding.right, y);
    ctx.stroke();
  }

  // Y-axis label
  ctx.save();
  ctx.translate(20, height / 2);
  ctx.rotate(-Math.PI / 2);
  ctx.textAlign = 'center';
  ctx.fillStyle = '#333';
  ctx.font = 'bold 28px Arial';
  ctx.fillText('Glucose (mg/dL)', 0, 0);
  ctx.restore();

  // X-axis labels
  ctx.textAlign = 'center';
  ctx.fillStyle = '#333';
  ctx.font = '22px Arial';

  const numXLabels = Math.min(5, timestamps.length);
  for (let i = 0; i < numXLabels; i++) {
    const index = Math.floor((timestamps.length - 1) * i / (numXLabels - 1));
    const timestamp = timestamps[index];
    const x = scaleX(timestamp);
    const dateStr = timestamp.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    ctx.fillText(dateStr, x, height - padding.bottom + 20);
  }

  // Target range zones (ADA guidelines)
  const zones = [
    { min: 0, max: 70, color: 'rgba(220, 38, 38, 0.1)', label: 'Low' },
    { min: 70, max: 140, color: 'rgba(34, 197, 94, 0.1)', label: 'Normal' },
    { min: 140, max: 200, color: 'rgba(251, 146, 60, 0.1)', label: 'Elevated' },
    { min: 200, max: 600, color: 'rgba(220, 38, 38, 0.1)', label: 'High' },
  ];

  zones.forEach(zone => {
    const y1 = scaleY(Math.max(zone.min, minGlucose));
    const y2 = scaleY(Math.min(zone.max, maxGlucose));

    ctx.fillStyle = zone.color;
    ctx.fillRect(padding.left, y2, chartWidth, y1 - y2);
  });

  // Draw threshold lines
  const thresholds = [
    { value: 126, label: 'Diabetes (Fasting)', color: '#dc2626' },
    { value: 100, label: 'Prediabetes (Fasting)', color: '#f97316' },
    { value: 200, label: 'High (Random)', color: '#dc2626' },
  ];

  thresholds.forEach(threshold => {
    if (threshold.value >= minGlucose && threshold.value <= maxGlucose) {
      const y = scaleY(threshold.value);

      ctx.strokeStyle = threshold.color;
      ctx.lineWidth = 6;
      ctx.setLineDash([5, 3]);
      ctx.beginPath();
      ctx.moveTo(padding.left, y);
      ctx.lineTo(width - padding.right, y);
      ctx.stroke();
      ctx.setLineDash([]);
    }
  });

  // Draw glucose line
  ctx.strokeStyle = '#8b5cf6';
  ctx.lineWidth = 5;
  ctx.beginPath();
  sortedMeasurements.forEach((m, i) => {
    const x = scaleX(m.timestamp);
    const y = scaleY(m.values.glucose);
    if (i === 0) {
      ctx.moveTo(x, y);
    } else {
      ctx.lineTo(x, y);
    }
  });
  ctx.stroke();

  // Draw data points
  sortedMeasurements.forEach(m => {
    const x = scaleX(m.timestamp);
    const y = scaleY(m.values.glucose);

    // Color based on value
    let pointColor = '#22c55e'; // Normal
    if (m.values.glucose < 70) pointColor = '#dc2626'; // Low
    else if (m.values.glucose >= 200) pointColor = '#dc2626'; // High
    else if (m.values.glucose >= 140) pointColor = '#f97316'; // Elevated

    ctx.fillStyle = pointColor;
    ctx.beginPath();
    ctx.arc(x, y, 4, 0, 2 * Math.PI);
    ctx.fill();

    // White border
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 6;
    ctx.stroke();
  });

  // Stats box
  const avgGlucose = Math.round(glucoseValues.reduce((a, b) => a + b, 0) / glucoseValues.length);
  const highReadings = glucoseValues.filter(v => v >= 140).length;
  const lowReadings = glucoseValues.filter(v => v < 70).length;

  ctx.fillStyle = '#f3f4f6';
  ctx.fillRect(padding.left + 10, padding.top + 10, 140, 65);
  ctx.strokeStyle = '#d1d5db';
  ctx.strokeRect(padding.left + 10, padding.top + 10, 140, 65);

  ctx.fillStyle = '#333';
  ctx.font = 'bold 22px Arial';
  ctx.textAlign = 'left';
  ctx.fillText('Statistics:', padding.left + 15, padding.top + 25);
  ctx.font = '22px Arial';
  ctx.fillText(`Average: ${avgGlucose} mg/dL`, padding.left + 15, padding.top + 40);
  ctx.fillText(`High readings: ${highReadings}`, padding.left + 15, padding.top + 53);
  ctx.fillText(`Low readings: ${lowReadings}`, padding.left + 15, padding.top + 66);

  return canvas.toDataURL('image/png');
};

/**
 * Generate FEV-1 Trend Chart for Asthma
 * @param {Array} measurements - Array of FEV-1 measurement objects
 * @param {Object} options - Chart options
 * @returns {string} Base64 encoded PNG image
 */
export const generateFEV1TrendChart = (measurements, options = {}) => {
  const {
    width = 600,
    height = 300,
    title = 'FEV-1 Spirometry Trends'
  } = options;

  if (!measurements || measurements.length === 0) {
    return null;
  }

  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');

  // Background
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(0, 0, width, height);

  const padding = { top: 50, right: 40, bottom: 60, left: 60 };
  const chartWidth = width - padding.left - padding.right;
  const chartHeight = height - padding.top - padding.bottom;

  // Sort and calculate % predicted
  const sortedMeasurements = [...measurements]
  .filter(m => m.values && m.values.fev1 && m.values.fev1Predicted && m.timestamp)
  .sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));

  if (sortedMeasurements.length < 2) {
    console.warn('Insufficient FEV-1 data for chart generation (need at least 2 points)');
    return null;
  }

  const percentPredicted = sortedMeasurements.map(m =>
      (m.values.fev1 / m.values.fev1Predicted) * 100
  );

  const timestamps = sortedMeasurements
  .map(m => new Date(m.timestamp))
  .filter(d => !isNaN(d.getTime())); // Filter out invalid dates

  if (timestamps.length < 2) {
    console.warn('Insufficient valid timestamps for FEV-1 chart');
    return null;
  }

  // Data ranges
  const minPercent = Math.min(...percentPredicted, 30);
  const maxPercent = Math.max(...percentPredicted, 100);
  const percentRange = maxPercent - minPercent;

  const timeMin = timestamps[0].getTime();
  const timeMax = timestamps[timestamps.length - 1].getTime();
  const timeRange = timeMax - timeMin || 1;

  // Scale functions
  const scaleX = (timestamp) => {
    const time = new Date(timestamp).getTime();
    return padding.left + ((time - timeMin) / timeRange) * chartWidth;
  };

  const scaleY = (value) => {
    return padding.top + chartHeight - ((value - minPercent) / percentRange) * chartHeight;
  };

  // Draw title
  ctx.fillStyle = '#1e3a8a';
  ctx.font = 'bold 36px Arial';
  ctx.textAlign = 'center';
  ctx.fillText(title, width / 2, 25);

  // Draw axes
  ctx.strokeStyle = '#666';
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.moveTo(padding.left, padding.top);
  ctx.lineTo(padding.left, height - padding.bottom);
  ctx.lineTo(width - padding.right, height - padding.bottom);
  ctx.stroke();

  // Y-axis labels (% predicted)
  ctx.fillStyle = '#333';
  ctx.font = '24px Arial';
  ctx.textAlign = 'right';
  for (let percent = Math.ceil(minPercent / 10) * 10; percent <= maxPercent; percent += 10) {
    const y = scaleY(percent);
    ctx.fillText(`${percent}%`, padding.left - 10, y + 4);

    ctx.strokeStyle = '#e5e5e5';
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.moveTo(padding.left, y);
    ctx.lineTo(width - padding.right, y);
    ctx.stroke();
  }

  // Y-axis label
  ctx.save();
  ctx.translate(15, height / 2);
  ctx.rotate(-Math.PI / 2);
  ctx.textAlign = 'center';
  ctx.fillStyle = '#333';
  ctx.font = 'bold 28px Arial';
  ctx.fillText('FEV-1 (% Predicted)', 0, 0);
  ctx.restore();

  // X-axis labels
  ctx.textAlign = 'center';
  ctx.fillStyle = '#333';
  ctx.font = '22px Arial';

  const numXLabels = Math.min(5, timestamps.length);
  for (let i = 0; i < numXLabels; i++) {
    const index = Math.floor((timestamps.length - 1) * i / (numXLabels - 1));
    const timestamp = timestamps[index];
    const x = scaleX(timestamp);
    const dateStr = timestamp.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    ctx.fillText(dateStr, x, height - padding.bottom + 20);
  }

  // VA Rating threshold zones
  const zones = [
    { min: 0, max: 40, color: 'rgba(220, 38, 38, 0.15)', label: '100%' },
    { min: 40, max: 55, color: 'rgba(251, 146, 60, 0.15)', label: '60%' },
    { min: 56, max: 70, color: 'rgba(251, 191, 36, 0.15)', label: '30%' },
    { min: 71, max: 80, color: 'rgba(253, 224, 71, 0.15)', label: '10%' },
    { min: 81, max: 200, color: 'rgba(34, 197, 94, 0.15)', label: 'Normal' },
  ];

  zones.forEach(zone => {
    const y1 = scaleY(Math.max(zone.min, minPercent));
    const y2 = scaleY(Math.min(zone.max, maxPercent));

    ctx.fillStyle = zone.color;
    ctx.fillRect(padding.left, y2, chartWidth, y1 - y2);
  });

  // Draw VA threshold lines
  const thresholds = [
    { value: 40, label: '40% (100% Rating)', color: '#dc2626' },
    { value: 55, label: '55% (60% Rating)', color: '#f97316' },
    { value: 70, label: '70% (30% Rating)', color: '#fbbf24' },
    { value: 80, label: '80% (10% Rating)', color: '#fde047' },
  ];

  thresholds.forEach(threshold => {
    if (threshold.value >= minPercent && threshold.value <= maxPercent) {
      const y = scaleY(threshold.value);

      ctx.strokeStyle = threshold.color;
      ctx.lineWidth = 4;
      ctx.setLineDash([5, 3]);
      ctx.beginPath();
      ctx.moveTo(padding.left, y);
      ctx.lineTo(width - padding.right, y);
      ctx.stroke();
      ctx.setLineDash([]);

      // Label
      ctx.fillStyle = threshold.color;
      ctx.font = '20px Arial';
      ctx.textAlign = 'right';
      ctx.fillText(threshold.label, width - padding.right - 5, y - 3);
    }
  });

  // Draw FEV-1 trend line
  ctx.strokeStyle = '#6366f1';
  ctx.lineWidth = 6;
  ctx.beginPath();
  sortedMeasurements.forEach((m, i) => {
    const x = scaleX(m.timestamp);
    const y = scaleY(percentPredicted[i]);
    if (i === 0) {
      ctx.moveTo(x, y);
    } else {
      ctx.lineTo(x, y);
    }
  });
  ctx.stroke();

  // Draw data points with color coding by rating
  sortedMeasurements.forEach((m, i) => {
    const x = scaleX(m.timestamp);
    const y = scaleY(percentPredicted[i]);
    const percent = percentPredicted[i];

    // Color based on VA rating zone
    let pointColor = '#22c55e'; // Normal (>80%)
    if (percent < 40) pointColor = '#dc2626'; // 100%
    else if (percent < 55) pointColor = '#f97316'; // 60%
    else if (percent < 70) pointColor = '#fbbf24'; // 30%
    else if (percent < 80) pointColor = '#fde047'; // 10%

    ctx.fillStyle = pointColor;
    ctx.beginPath();
    ctx.arc(x, y, 5, 0, 2 * Math.PI);
    ctx.fill();

    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 4;
    ctx.stroke();
  });

  // Stats box
  const avgPercent = Math.round(percentPredicted.reduce((a, b) => a + b, 0) / percentPredicted.length);
  const latestPercent = Math.round(percentPredicted[percentPredicted.length - 1]);

  ctx.fillStyle = '#f3f4f6';
  ctx.fillRect(padding.left + 10, padding.top + 10, 140, 65);
  ctx.strokeStyle = '#d1d5db';
  ctx.strokeRect(padding.left + 10, padding.top + 10, 140, 65);

  ctx.fillStyle = '#333';
  ctx.font = 'bold 22px Arial';
  ctx.textAlign = 'left';
  ctx.fillText('FEV-1 Statistics:', padding.left + 15, padding.top + 25);
  ctx.font = '22px Arial';
  ctx.fillText(`Latest: ${latestPercent}% predicted`, padding.left + 15, padding.top + 40);
  ctx.fillText(`Average: ${avgPercent}% predicted`, padding.left + 15, padding.top + 53);
  ctx.fillText(`${measurements.length} tests`, padding.left + 15, padding.top + 66);

  return canvas.toDataURL('image/png');
};

/**
 * Generate HbA1c Trend Chart
 * @param {Array} measurements - Array of HbA1c measurement objects
 * @param {Object} options - Chart options
 * @returns {string} Base64 encoded PNG image
 */
export const generateHbA1cTrendChart = (measurements, options = {}) => {
  const {
    width = 600,
    height = 250,
    title = 'HbA1c Progression'
  } = options;

  if (!measurements || measurements.length === 0) {
    return null;
  }

  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');

  // Background
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(0, 0, width, height);

  const padding = { top: 50, right: 40, bottom: 50, left: 60 };
  const chartWidth = width - padding.left - padding.right;
  const chartHeight = height - padding.top - padding.bottom;

  // Sort measurements
  const sortedMeasurements = [...measurements]
  .filter(m => m.values && m.values.hba1c && m.timestamp)
  .sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));

  if (sortedMeasurements.length < 2) {
    console.warn('Insufficient HbA1c data for chart generation (need at least 2 points)');
    return null;
  }

  const hba1cValues = sortedMeasurements.map(m => m.values.hba1c);
  const timestamps = sortedMeasurements
  .map(m => new Date(m.timestamp))
  .filter(d => !isNaN(d.getTime())); // Filter out invalid dates

  if (timestamps.length < 2) {
    console.warn('Insufficient valid timestamps for HbA1c chart');
    return null;
  }

  // Data ranges
  const minHbA1c = Math.min(...hba1cValues, 5.0);
  const maxHbA1c = Math.max(...hba1cValues, 10.0);
  const hba1cRange = maxHbA1c - minHbA1c;

  const timeMin = timestamps[0].getTime();
  const timeMax = timestamps[timestamps.length - 1].getTime();
  const timeRange = timeMax - timeMin || 1;

  // Scale functions
  const scaleX = (timestamp) => {
    const time = new Date(timestamp).getTime();
    return padding.left + ((time - timeMin) / timeRange) * chartWidth;
  };

  const scaleY = (value) => {
    return padding.top + chartHeight - ((value - minHbA1c) / hba1cRange) * chartHeight;
  };

  // Draw title
  ctx.fillStyle = '#1e3a8a';
  ctx.font = 'bold 32px Arial';
  ctx.textAlign = 'center';
  ctx.fillText(title, width / 2, 25);

  // Draw axes
  ctx.strokeStyle = '#666';
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.moveTo(padding.left, padding.top);
  ctx.lineTo(padding.left, height - padding.bottom);
  ctx.lineTo(width - padding.right, height - padding.bottom);
  ctx.stroke();

  // Y-axis labels
  ctx.fillStyle = '#333';
  ctx.font = '24px Arial';
  ctx.textAlign = 'right';
  for (let hba1c = Math.ceil(minHbA1c * 2) / 2; hba1c <= maxHbA1c; hba1c += 0.5) {
    const y = scaleY(hba1c);
    ctx.fillText(hba1c.toFixed(1) + '%', padding.left - 10, y + 4);

    ctx.strokeStyle = '#e5e5e5';
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.moveTo(padding.left, y);
    ctx.lineTo(width - padding.right, y);
    ctx.stroke();
  }

  // Y-axis label
  ctx.save();
  ctx.translate(20, height / 2);
  ctx.rotate(-Math.PI / 2);
  ctx.textAlign = 'center';
  ctx.fillStyle = '#333';
  ctx.font = 'bold 13px Arial';
  ctx.fillText('HbA1c (%)', 0, 0);
  ctx.restore();

  // X-axis labels
  ctx.textAlign = 'center';
  ctx.fillStyle = '#333';
  ctx.font = '22px Arial';

  timestamps.forEach((timestamp, i) => {
    const x = scaleX(timestamp);
    const dateStr = timestamp.toLocaleDateString('en-US', { month: 'short', year: '2-digit' });
    ctx.fillText(dateStr, x, height - padding.bottom + 20);
  });

  // Target zones
  const zones = [
    { min: 0, max: 5.7, color: 'rgba(34, 197, 94, 0.1)', label: 'Normal' },
    { min: 5.7, max: 6.5, color: 'rgba(251, 191, 36, 0.1)', label: 'Prediabetes' },
    { min: 6.5, max: 8.0, color: 'rgba(251, 146, 60, 0.1)', label: 'Diabetes' },
    { min: 8.0, max: 20, color: 'rgba(220, 38, 38, 0.1)', label: 'Uncontrolled' },
  ];

  zones.forEach(zone => {
    const y1 = scaleY(Math.max(zone.min, minHbA1c));
    const y2 = scaleY(Math.min(zone.max, maxHbA1c));

    ctx.fillStyle = zone.color;
    ctx.fillRect(padding.left, y2, chartWidth, y1 - y2);
  });

  // Threshold lines
  const thresholds = [
    { value: 5.7, label: 'Prediabetes (5.7%)', color: '#fbbf24' },
    { value: 6.5, label: 'Diabetes (6.5%)', color: '#f97316' },
    { value: 8.0, label: 'Uncontrolled (8.0%)', color: '#dc2626' },
  ];

  thresholds.forEach(threshold => {
    if (threshold.value >= minHbA1c && threshold.value <= maxHbA1c) {
      const y = scaleY(threshold.value);

      ctx.strokeStyle = threshold.color;
      ctx.lineWidth = 6;
      ctx.setLineDash([5, 3]);
      ctx.beginPath();
      ctx.moveTo(padding.left, y);
      ctx.lineTo(width - padding.right, y);
      ctx.stroke();
      ctx.setLineDash([]);
    }
  });

  // Draw HbA1c line
  ctx.strokeStyle = '#8b5cf6';
  ctx.lineWidth = 5;
  ctx.beginPath();
  sortedMeasurements.forEach((m, i) => {
    const x = scaleX(m.timestamp);
    const y = scaleY(m.values.hba1c);
    if (i === 0) {
      ctx.moveTo(x, y);
    } else {
      ctx.lineTo(x, y);
    }
  });
  ctx.stroke();

  // Draw data points
  sortedMeasurements.forEach(m => {
    const x = scaleX(m.timestamp);
    const y = scaleY(m.values.hba1c);

    // Color based on value
    let pointColor = '#22c55e'; // Normal
    if (m.values.hba1c >= 8.0) pointColor = '#dc2626'; // Uncontrolled
    else if (m.values.hba1c >= 6.5) pointColor = '#f97316'; // Diabetes
    else if (m.values.hba1c >= 5.7) pointColor = '#fbbf24'; // Prediabetes

    ctx.fillStyle = pointColor;
    ctx.beginPath();
    ctx.arc(x, y, 5, 0, 2 * Math.PI);
    ctx.fill();

    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 4;
    ctx.stroke();
  });

  // Latest value display
  const latest = hba1cValues[hba1cValues.length - 1];
  ctx.fillStyle = '#f3f4f6';
  ctx.fillRect(padding.left + 10, padding.top + 10, 120, 45);
  ctx.strokeStyle = '#d1d5db';
  ctx.strokeRect(padding.left + 10, padding.top + 10, 120, 45);

  ctx.fillStyle = '#333';
  ctx.font = 'bold 22px Arial';
  ctx.textAlign = 'left';
  ctx.fillText('Latest HbA1c:', padding.left + 15, padding.top + 25);
  ctx.font = 'bold 32px Arial';
  ctx.fillText(`${latest.toFixed(1)}%`, padding.left + 15, padding.top + 45);

  return canvas.toDataURL('image/png');
};