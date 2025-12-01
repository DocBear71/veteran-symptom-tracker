import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { getSymptomLogs, getMedicationLogs, getMedicationLogsForSymptom } from './storage';

// Generate PDF report
export const generatePDF = (dateRange = 'all') => {
  const logs = filterLogsByDateRange(getSymptomLogs(), dateRange);

  if (logs.length === 0) {
    alert('No data to export for the selected date range');
    return;
  }

  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.width;

  // Title
  doc.setFontSize(20);
  doc.setTextColor(30, 58, 138);
  doc.text('Symptom Tracking Report', 14, 20);

  // Date range and generation info
  doc.setFontSize(10);
  doc.setTextColor(100);
  doc.text(`Report Period: ${getDateRangeLabel(dateRange)}`, 14, 28);
  doc.text(`Generated: ${new Date().toLocaleString()}`, 14, 34);
  doc.text(`Total Entries: ${logs.length}`, 14, 40);

  // Summary table
  doc.setFontSize(14);
  doc.setTextColor(30, 58, 138);
  doc.text('Summary by Symptom', 14, 52);

  const summaryData = generateSummary(logs);

  autoTable(doc, {
    startY: 56,
    head: [['Symptom', 'Category', 'Occurrences', 'Avg Severity', 'Max Severity']],
    body: summaryData.map(row => [
      row.symptom,
      row.category,
      row.count.toString(),
      row.avgSeverity.toFixed(1),
      row.maxSeverity.toString()
    ]),
    headStyles: { fillColor: [30, 58, 138] },
    alternateRowStyles: { fillColor: [245, 247, 250] },
  });

  // Detailed log entries
  const finalY = doc.lastAutoTable.finalY + 10;
  doc.setFontSize(14);
  doc.setTextColor(30, 58, 138);
  doc.text('Detailed Log Entries', 14, finalY);

  const detailData = logs.map(log => {
    const linkedMeds = getMedicationLogsForSymptom(log.id);
    let notes = log.notes || '-';

    // Add migraine details
    if (log.migraineData) {
      const migraineInfo = [];
      if (log.migraineData.prostrating) migraineInfo.push('PROSTRATING');
      if (log.migraineData.duration) migraineInfo.push(formatDuration(log.migraineData.duration));
      if (log.migraineData.aura) migraineInfo.push('Aura');
      if (log.migraineData.nausea) migraineInfo.push('Nausea');
      if (log.migraineData.lightSensitivity) migraineInfo.push('Light sensitivity');
      if (log.migraineData.soundSensitivity) migraineInfo.push('Sound sensitivity');
      if (migraineInfo.length > 0) {
        notes = migraineInfo.join(', ') + (log.notes ? ` | ${log.notes}` : '');
      }
    }

    // Add sleep details
    if (log.sleepData) {
      const sleepInfo = [];
      if (log.sleepData.hoursSlept) sleepInfo.push(`${log.sleepData.hoursSlept}hrs sleep`);
      if (log.sleepData.quality) sleepInfo.push(`Quality: ${log.sleepData.quality}/10`);
      if (log.sleepData.wakeUps) sleepInfo.push(`Woke ${log.sleepData.wakeUps}x`);
      if (log.sleepData.nightmares) sleepInfo.push('Nightmares');
      if (log.sleepData.feelRested === false) sleepInfo.push('Not rested');
      if (sleepInfo.length > 0) {
        notes = sleepInfo.join(', ') + (log.notes ? ` | ${log.notes}` : '');
      }
    }

    // Add PTSD details
    if (log.ptsdData) {
      const ptsdInfo = [];
      if (log.ptsdData.flashbacks) ptsdInfo.push('Flashbacks');
      if (log.ptsdData.intrusiveThoughts) ptsdInfo.push('Intrusive thoughts');
      if (log.ptsdData.avoidance) ptsdInfo.push('Avoidance');
      if (log.ptsdData.hypervigilance) ptsdInfo.push('Hypervigilance');
      if (log.ptsdData.triggerDescription) ptsdInfo.push(`Trigger: ${log.ptsdData.triggerDescription}`);
      if (ptsdInfo.length > 0) {
        notes = ptsdInfo.join(', ') + (log.notes ? ` | ${log.notes}` : '');
      }
    }

    // Add pain details
    if (log.painData) {
      const painInfo = [];
      if (log.painData.painType) painInfo.push(log.painData.painType);
      if (log.painData.flareUp) painInfo.push('FLARE-UP');
      if (log.painData.limitedRangeOfMotion) painInfo.push('Limited ROM');
      if (log.painData.radiating) painInfo.push(`Radiating${log.painData.radiatingTo ? ` to ${log.painData.radiatingTo}` : ''}`);
      if (log.painData.affectedActivities?.length > 0) {
        painInfo.push(`Affects: ${log.painData.affectedActivities.join(', ')}`);
      }
      if (painInfo.length > 0) {
        notes = painInfo.join(', ') + (log.notes ? ` | ${log.notes}` : '');
      }
    }

    // Add medications
    if (linkedMeds.length > 0) {
      const medInfo = linkedMeds.map(m => `${m.medicationName} ${m.dosage}`).join(', ');
      notes = `Meds: ${medInfo}` + (notes !== '-' ? ` | ${notes}` : '');
    }

    return [
      new Date(log.timestamp).toLocaleString(),
      log.symptomName,
      log.severity.toString(),
      notes
    ];
  });

  autoTable(doc, {
    startY: finalY + 4,
    head: [['Date/Time', 'Symptom', 'Severity', 'Notes']],
    body: detailData,
    headStyles: { fillColor: [30, 58, 138] },
    alternateRowStyles: { fillColor: [245, 247, 250] },
    columnStyles: {
      0: { cellWidth: 40 },
      1: { cellWidth: 35 },
      2: { cellWidth: 20 },
      3: { cellWidth: 'auto' }
    },
    styles: { fontSize: 8, cellPadding: 2 },
  });

  // Add page numbers
  const pageCount = doc.internal.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(8);
    doc.setTextColor(150);
    doc.text(`Page ${i} of ${pageCount}`, pageWidth - 25, doc.internal.pageSize.height - 10);
    doc.text('Veteran Symptom Tracker', 14, doc.internal.pageSize.height - 10);
  }

  // Save
  const dateStr = new Date().toISOString().split('T')[0];
  doc.save(`symptom-report-${dateStr}.pdf`);
};

// Generate CSV export
export const generateCSV = (dateRange = 'all') => {
  const logs = filterLogsByDateRange(getSymptomLogs(), dateRange);

  if (logs.length === 0) {
    alert('No data to export for the selected date range');
    return;
  }

  const headers = [
    'Date', 'Time', 'Symptom', 'Category', 'Severity',
    'Medications Taken',
    'Prostrating', 'Duration', 'Associated Symptoms', 'Triggers',
    'Hours Slept', 'Sleep Quality', 'Wake Ups', 'Sleep Issues',
    'PTSD Symptoms', 'PTSD Trigger',
    'Pain Type', 'Flare Up', 'Radiating', 'Limited ROM', 'Activities Affected',
    'Notes'
  ];

  const rows = logs.map(log => {
    const date = new Date(log.timestamp);
    const linkedMeds = getMedicationLogsForSymptom(log.id);

    // Migraine data
    const migraineSymptoms = [];
    if (log.migraineData?.aura) migraineSymptoms.push('Aura');
    if (log.migraineData?.nausea) migraineSymptoms.push('Nausea');
    if (log.migraineData?.lightSensitivity) migraineSymptoms.push('Light sensitivity');
    if (log.migraineData?.soundSensitivity) migraineSymptoms.push('Sound sensitivity');

    // Sleep data
    const sleepIssues = [];
    if (log.sleepData?.troubleFallingAsleep) sleepIssues.push('Trouble falling asleep');
    if (log.sleepData?.troubleStayingAsleep) sleepIssues.push('Trouble staying asleep');
    if (log.sleepData?.nightmares) sleepIssues.push('Nightmares');
    if (log.sleepData?.feelRested === false) sleepIssues.push('Not rested');

    // PTSD data
    const ptsdSymptoms = [];
    if (log.ptsdData?.flashbacks) ptsdSymptoms.push('Flashbacks');
    if (log.ptsdData?.intrusiveThoughts) ptsdSymptoms.push('Intrusive thoughts');
    if (log.ptsdData?.avoidance) ptsdSymptoms.push('Avoidance');
    if (log.ptsdData?.emotionalNumbering) ptsdSymptoms.push('Emotional numbness');
    if (log.ptsdData?.hypervigilance) ptsdSymptoms.push('Hypervigilance');
    if (log.ptsdData?.exaggeratedStartle) ptsdSymptoms.push('Startle response');

    return [
      date.toLocaleDateString(),
      date.toLocaleTimeString(),
      log.symptomName,
      log.category,
      log.severity,
      linkedMeds.map(m => `${m.medicationName} ${m.dosage}`).join('; '),
      log.migraineData?.prostrating ? 'Yes' : (log.migraineData?.prostrating === false ? 'No' : ''),
      log.migraineData?.duration ? formatDuration(log.migraineData.duration) : '',
      migraineSymptoms.join('; '),
      log.migraineData?.triggers || '',
      log.sleepData?.hoursSlept || '',
      log.sleepData?.quality || '',
      log.sleepData?.wakeUps || '',
      sleepIssues.join('; '),
      ptsdSymptoms.join('; '),
      log.ptsdData?.triggerDescription || '',
      log.painData?.painType || '',
      log.painData?.flareUp ? 'Yes' : '',
      log.painData?.radiating ? (log.painData.radiatingTo || 'Yes') : '',
      log.painData?.limitedRangeOfMotion ? 'Yes' : '',
      log.painData?.affectedActivities?.join('; ') || '',
      log.notes || ''
    ];
  });

  const csvContent = [
    headers.join(','),
    ...rows.map(row => row.map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(','))
  ].join('\n');

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `symptom-report-${new Date().toISOString().split('T')[0]}.csv`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

// Helper functions
const filterLogsByDateRange = (logs, range) => {
  const now = new Date();
  let startDate;

  switch (range) {
    case '7days':
      startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      break;
    case '30days':
      startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
      break;
    case '90days':
      startDate = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
      break;
    case 'year':
      startDate = new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000);
      break;
    default:
      return logs.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
  }

  return logs
  .filter(log => new Date(log.timestamp) >= startDate)
  .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
};

const getDateRangeLabel = (range) => {
  switch (range) {
    case '7days': return 'Last 7 Days';
    case '30days': return 'Last 30 Days';
    case '90days': return 'Last 90 Days';
    case 'year': return 'Last Year';
    default: return 'All Time';
  }
};

const generateSummary = (logs) => {
  const summary = {};

  logs.forEach(log => {
    if (!summary[log.symptomName]) {
      summary[log.symptomName] = {
        symptom: log.symptomName,
        category: log.category,
        count: 0,
        totalSeverity: 0,
        maxSeverity: 0
      };
    }

    summary[log.symptomName].count++;
    summary[log.symptomName].totalSeverity += log.severity;
    summary[log.symptomName].maxSeverity = Math.max(summary[log.symptomName].maxSeverity, log.severity);
  });

  return Object.values(summary).map(row => ({
    ...row,
    avgSeverity: row.totalSeverity / row.count
  })).sort((a, b) => b.count - a.count);
};

const formatDuration = (duration) => {
  const labels = {
    'less-than-1h': '< 1 hour', '1-4h': '1-4 hours', '4-24h': '4-24 hours',
    '1-2d': '1-2 days', 'more-than-2d': '> 2 days', 'ongoing': 'Ongoing',
  };
  return labels[duration] || duration;
};