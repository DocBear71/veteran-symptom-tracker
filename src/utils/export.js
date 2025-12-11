import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { getSymptomLogs, saveSymptomLog, getMedicationLogsForSymptom, getAppointments } from './storage';
import { getMeasurements } from './measurements';
import {
    generateBPTrendChart,
    generateGlucoseTrendChart,
    generateFEV1TrendChart,
    generateHbA1cTrendChart
} from './chartExport';
import {
    CONDITIONS,
    analyzeMigraineLogs,
    analyzeSleepApneaLogs,
    analyzePTSDLogs,
    analyzeMajorDepressionLogs,
    analyzeGeneralizedAnxietyLogs,
    analyzePanicDisorderLogs,
    analyzeBipolarLogs,
    analyzeLumbosacralStrainLogs,
    analyzeIntervertebralDiscLogs,
    analyzeKneeInstabilityLogs,
    analyzeTBILogs,
    analyzeHypertensionLogs,
    analyzeDiabetesLogs,
    analyzeIBSLogs,
    analyzeGERDLogs,
    analyzeRadiculopathyLogs,
    analyzeChronicFatigueLogs,
    analyzePeripheralNeuropathyLogs,
    analyzeMenieresLogs,
    analyzeRhinitisLogs,
    analyzeTMJLogs,
    analyzePlantarFasciitisLogs,
    analyzeInsomniaLogs,
    analyzeSinusitisLogs,
    analyzeShoulderLogs,
    analyzeHipLogs,
    analyzeAnkleLogs,
    analyzeWristLogs,
    analyzeElbowLogs,
    analyzeDegenerativeArthritisLogs,
    analyzeTinnitusLogs,
    analyzeFibromyalgiaLogs,
    analyzeAsthmaLogs,
    analyzeHearingLossLogs,
    analyzeScarsLogs,
    analyzePsoriasisLogs,
    analyzeEczemaLogs,
    analyzeTBIResidualsLogs,
    analyzeGERDComplicationsLogs,
    analyzeUlcerativeColitisLogs,
    analyzePepticUlcerLogs,
    analyzeHemorrhoidLogs,
    analyzeDiverticulitisLogs,
    analyzeHypothyroidismLogs,
    analyzeRaynaudsLogs,
    analyzeVaricoseVeinsLogs,
    analyzeChronicUrticariaLogs,
    analyzeSocialAnxietyLogs,
    analyzeOCDLogs,
    analyzePersistentDepressiveLogs,
    analyzeAdjustmentDisorderLogs,
    analyzeUnspecifiedAnxietyLogs,
    analyzeUnspecifiedDepressiveLogs,
} from './ratingCriteria';

// Appointment type labels for export
const APPOINTMENT_TYPE_LABELS = {
    cp_exam: 'C&P Exam',
    primary_care: 'Primary Care',
    mental_health: 'Mental Health',
    specialty: 'Specialty Care',
    telehealth: 'Telehealth',
    physical_therapy: 'Physical Therapy',
    emergency: 'Emergency/Urgent Care',
    other: 'Other',
};

// Generate PDF report
export const generatePDF = (dateRange = 'all', options = { includeAppointments: true }) => {
    const logs = filterLogsByDateRange(getSymptomLogs(), dateRange);
    const appointments = options.includeAppointments
        ? filterAppointmentsByDateRange(getAppointments(), dateRange)
        : [];

    if (logs.length === 0 && appointments.length === 0) {
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
    doc.text(`Total Symptom Entries: ${logs.length}`, 14, 40);
    if (options.includeAppointments) {
        doc.text(`Total Appointments: ${appointments.length}`, 14, 46);
    }

    let currentY = options.includeAppointments ? 56 : 50;

    // ========== SYMPTOM SECTION ==========
    if (logs.length > 0) {
        // Summary table
        doc.setFontSize(14);
        doc.setTextColor(30, 58, 138);
        doc.text('Summary by Symptom', 14, currentY);

        const summaryData = generateSummary(logs);

        autoTable(doc, {
            startY: currentY + 4,
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
        currentY = doc.lastAutoTable.finalY + 10;
        doc.setFontSize(14);
        doc.setTextColor(30, 58, 138);
        doc.text('Detailed Symptom Entries', 14, currentY);

      const detailData = logs.map(log => {
        const linkedMeds = getMedicationLogsForSymptom(log.id);
        let notes = log.notes || '-';

        // Phase 1A: Add universal fields first
        const universalInfo = [];
        if (log.isFlareUp) universalInfo.push('🔥 FLARE-UP');
        if (log.duration) universalInfo.push(formatDuration(log.duration));
        if (log.timeOfDay) universalInfo.push(formatTimeOfDay(log.timeOfDay));
        if (universalInfo.length > 0) {
          notes = universalInfo.join(' | ') + (log.notes ? ` | ${log.notes}` : '');
        }

        // Phase 1B: Add GI details
        if (log.giData) {
          const giInfo = [];
          if (log.giData.bristolScale) giInfo.push(`Bristol ${log.giData.bristolScale}`);
          if (log.giData.frequencyPerDay) giInfo.push(`${log.giData.frequencyPerDay}x/day`);
          if (log.giData.urgencyLevel && log.giData.urgencyLevel !== 'none') giInfo.push(formatUrgency(log.giData.urgencyLevel));
          if (log.giData.bloodPresent) giInfo.push('BLOOD PRESENT');
          if (log.giData.bloatingSeverity && log.giData.bloatingSeverity !== 'none') giInfo.push(`Bloating: ${log.giData.bloatingSeverity}`);
          if (log.giData.abdominalPainLocation) giInfo.push(`Pain: ${formatPainLocation(log.giData.abdominalPainLocation)}`);
          if (log.giData.mealRelated) giInfo.push('Meal-related');
          if (log.giData.nighttimeSymptoms) giInfo.push('Nighttime');
          if (giInfo.length > 0) {
            notes = giInfo.join(', ') + (notes !== '-' ? ` | ${notes}` : '');
          }
        }

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
            startY: currentY + 4,
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

        currentY = doc.lastAutoTable.finalY + 10;
    }

    // ========== APPOINTMENTS SECTION ==========
    if (options.includeAppointments && appointments.length > 0) {
        // Check if we need a new page
        if (currentY > 230) {
            doc.addPage();
            currentY = 20;
        }

        doc.setFontSize(14);
        doc.setTextColor(30, 58, 138);
        doc.text('Appointment History', 14, currentY);

        const appointmentData = appointments.map(apt => {
            const typeLabel = APPOINTMENT_TYPE_LABELS[apt.appointmentType] || apt.appointmentType;

            let details = apt.discussed || '';
            if (apt.documentsNotes) {
                details += (details ? ' | ' : '') + `Docs: ${apt.documentsNotes}`;
            }
            if (apt.followUpNeeded) {
                details += (details ? ' | ' : '') + 'Follow-up needed';
                if (apt.followUpDate) {
                    details += `: ${new Date(apt.followUpDate + 'T00:00:00').toLocaleDateString()}`;
                }
            }

            return [
                new Date(apt.appointmentDate + 'T00:00:00').toLocaleDateString(),
                typeLabel,
                apt.providerName || '-',
                apt.facility || '-',
                apt.reasonForVisit || '-',
                details
            ];
        });

        autoTable(doc, {
            startY: currentY + 4,
            head: [['Date', 'Type', 'Provider', 'Facility', 'Reason', 'Details']],
            body: appointmentData,
            headStyles: { fillColor: [139, 69, 19] }, // Brown color for appointments
            alternateRowStyles: { fillColor: [254, 249, 243] },
            columnStyles: {
                0: { cellWidth: 25 },
                1: { cellWidth: 25 },
                2: { cellWidth: 25 },
                3: { cellWidth: 30 },
                4: { cellWidth: 30 },
                5: { cellWidth: 'auto' }
            },
            styles: { fontSize: 7, cellPadding: 2 },
        });
    }

    // Add page numbers
    const pageCount = doc.internal.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
        doc.setPage(i);
        doc.setFontSize(8);
        doc.setTextColor(150);
        doc.text(`Page ${i} of ${pageCount}`, pageWidth - 25, doc.internal.pageSize.height - 10);
        doc.text('Universal Symptom Tracker', 14, doc.internal.pageSize.height - 10);
    }

    // Save
    const dateStr = new Date().toISOString().split('T')[0];
    doc.save(`symptom-report-${dateStr}.pdf`);
};

// Generate CSV export
export const generateCSV = (dateRange = 'all', options = { includeAppointments: true }) => {
    const logs = filterLogsByDateRange(getSymptomLogs(), dateRange);
    const appointments = options.includeAppointments
        ? filterAppointmentsByDateRange(getAppointments(), dateRange)
        : [];

    if (logs.length === 0 && appointments.length === 0) {
        alert('No data to export for the selected date range');
        return;
    }

    let csvContent = '';

    // ========== SYMPTOMS SECTION ==========
    if (logs.length > 0) {
        csvContent += '=== SYMPTOM LOG ===\n\n';

      const symptomHeaders = [
        'Date', 'Time', 'Symptom', 'Category', 'Severity',
        // Universal fields
        'Flare-Up', 'Duration', 'Time of Day',
        'Medications Taken',
        // GI fields
        'Bristol Scale', 'GI Frequency', 'Urgency', 'Blood Present', 'Bloating', 'GI Pain Location', 'Meal Related', 'Nighttime GI',
        // Migraine fields
        'Prostrating', 'Migraine Duration', 'Associated Symptoms', 'Triggers',
        // Sleep fields
        'Hours Slept', 'Sleep Quality', 'Wake Ups', 'Sleep Issues',
        // PTSD fields
        'PTSD Symptoms', 'PTSD Trigger',
        // Pain fields
        'Pain Type', 'Pain Flare Up', 'Radiating', 'Limited ROM', 'Activities Affected',
        'Notes'
      ];

        const symptomRows = logs.map(log => {
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
            // Universal fields
            log.isFlareUp ? 'Yes' : '',
            log.duration ? formatDuration(log.duration) : '',
            log.timeOfDay ? formatTimeOfDay(log.timeOfDay) : '',
            linkedMeds.map(m => `${m.medicationName} ${m.dosage}`).join('; '),
            // GI fields
            log.giData?.bristolScale || '',
            log.giData?.frequencyPerDay || '',
            log.giData?.urgencyLevel || '',
            log.giData?.bloodPresent === true ? 'Yes' : (log.giData?.bloodPresent === false ? 'No' : ''),
            log.giData?.bloatingSeverity || '',
            log.giData?.abdominalPainLocation ? formatPainLocation(log.giData.abdominalPainLocation) : '',
            log.giData?.mealRelated ? 'Yes' : '',
            log.giData?.nighttimeSymptoms ? 'Yes' : '',
            // Migraine fields
            log.migraineData?.prostrating ? 'Yes' : (log.migraineData?.prostrating === false ? 'No' : ''),
            log.migraineData?.duration ? formatDuration(log.migraineData.duration) : '',
            migraineSymptoms.join('; '),
            log.migraineData?.triggers || '',
            // Sleep fields
            log.sleepData?.hoursSlept || '',
            log.sleepData?.quality || '',
            log.sleepData?.wakeUps || '',
            sleepIssues.join('; '),
            // PTSD fields
            ptsdSymptoms.join('; '),
            log.ptsdData?.triggerDescription || '',
            // Pain fields
            log.painData?.painType || '',
            log.painData?.flareUp ? 'Yes' : '',
            log.painData?.radiating ? (log.painData.radiatingTo || 'Yes') : '',
            log.painData?.limitedRangeOfMotion ? 'Yes' : '',
            log.painData?.affectedActivities?.join('; ') || '',
            log.notes || ''
          ];
        });

        csvContent += symptomHeaders.join(',') + '\n';
        csvContent += symptomRows.map(row =>
            row.map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(',')
        ).join('\n');
    }

    // ========== APPOINTMENTS SECTION ==========
    if (options.includeAppointments && appointments.length > 0) {
        csvContent += '\n\n=== APPOINTMENTS ===\n\n';

        const appointmentHeaders = [
            'Date', 'Time', 'Type', 'Provider', 'Facility',
            'Reason for Visit', 'What Was Discussed', 'Documents',
            'Follow-up Needed', 'Follow-up Date', 'Follow-up Notes'
        ];

        const appointmentRows = appointments.map(apt => {
            const typeLabel = APPOINTMENT_TYPE_LABELS[apt.appointmentType] || apt.appointmentType;

            return [
                apt.appointmentDate,
                apt.appointmentTime || '',
                typeLabel,
                apt.providerName || '',
                apt.facility || '',
                apt.reasonForVisit || '',
                apt.discussed || '',
                apt.documentsNotes || '',
                apt.followUpNeeded ? 'Yes' : 'No',
                apt.followUpDate || '',
                apt.followUpNotes || ''
            ];
        });

        csvContent += appointmentHeaders.join(',') + '\n';
        csvContent += appointmentRows.map(row =>
            row.map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(',')
        ).join('\n');
    }

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

    // Handle custom date range
    if (typeof range === 'object' && range.type === 'custom') {
        if (!range.startDate || !range.endDate) {
            return logs.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
        }

        const customStart = new Date(range.startDate + 'T00:00:00');
        const customEnd = new Date(range.endDate + 'T23:59:59');

        return logs
            .filter(log => {
                const logDate = new Date(log.timestamp);
                return logDate >= customStart && logDate <= customEnd;
            })
            .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
    }

    // Handle preset ranges
    switch (range) {
        case '7days':
            startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
            break;
        case '30days':
            startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
            break;
        case '60days':
            startDate = new Date(now.getTime() - 60 * 24 * 60 * 60 * 1000);
            break;
        case '90days':
            startDate = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
            break;
        case '180days':
            startDate = new Date(now.getTime() - 180 * 24 * 60 * 60 * 1000);
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

const filterAppointmentsByDateRange = (appointments, range) => {
    const now = new Date();
    let startDate;

    // Handle custom date range
    if (typeof range === 'object' && range.type === 'custom') {
        if (!range.startDate || !range.endDate) {
            return appointments.sort((a, b) =>
                new Date(b.appointmentDate) - new Date(a.appointmentDate)
            );
        }

        const customStart = new Date(range.startDate + 'T00:00:00');
        const customEnd = new Date(range.endDate + 'T23:59:59');

        return appointments
            .filter(apt => {
                const aptDate = new Date(apt.appointmentDate + 'T00:00:00');
                return aptDate >= customStart && aptDate <= customEnd;
            })
            .sort((a, b) => new Date(b.appointmentDate) - new Date(a.appointmentDate));
    }

    // Handle preset ranges
    switch (range) {
        case '7days':
            startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
            break;
        case '30days':
            startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
            break;
        case '60days':
            startDate = new Date(now.getTime() - 60 * 24 * 60 * 60 * 1000);
            break;
        case '90days':
            startDate = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
            break;
        case '180days':
            startDate = new Date(now.getTime() - 180 * 24 * 60 * 60 * 1000);
            break;
        case 'year':
            startDate = new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000);
            break;
        default:
            return appointments.sort((a, b) =>
                new Date(b.appointmentDate) - new Date(a.appointmentDate)
            );
    }

    return appointments
        .filter(apt => new Date(apt.appointmentDate + 'T00:00:00') >= startDate)
        .sort((a, b) => new Date(b.appointmentDate) - new Date(a.appointmentDate));
};

const getDateRangeLabel = (range) => {
    // Handle custom date range
    if (typeof range === 'object' && range.type === 'custom') {
        if (!range.startDate || !range.endDate) {
            return 'Custom Range';
        }
        const start = new Date(range.startDate).toLocaleDateString();
        const end = new Date(range.endDate).toLocaleDateString();
        return `${start} - ${end}`;
    }

    // Handle preset ranges
    switch (range) {
        case '7days': return 'Last 7 Days';
        case '30days': return 'Last 30 Days';
        case '60days': return 'Last 60 Days';
        case '90days': return 'Last 90 Days';
        case '180days': return 'Last 180 Days';
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
    // Migraine-specific durations
    'less-than-1h': '< 1 hour', '1-4h': '1-4 hours', '4-24h': '4-24 hours',
    '1-2d': '1-2 days', 'more-than-2d': '> 2 days', 'ongoing': 'Ongoing',
    // Universal durations (Phase 1A)
    'just-started': 'Just started', 'minutes': 'Minutes', 'hours': 'Hours',
    'days': 'Days', 'weeks': 'Weeks', 'months': 'Months+',
  };
  return labels[duration] || duration;
};

// Phase 1A: Format time of day
const formatTimeOfDay = (timeOfDay) => {
  const labels = {
    'morning': 'Morning', 'afternoon': 'Afternoon', 'evening': 'Evening',
    'night': 'Night', 'all-day': 'All Day', 'varies': 'Varies',
  };
  return labels[timeOfDay] || timeOfDay;
};

// Phase 1B: Format Bristol Scale
const formatBristolScale = (scale) => {
  return scale ? `Bristol ${scale}` : '';
};

// Phase 1B: Format urgency level
const formatUrgency = (urgency) => {
  const labels = {
    'none': 'No urgency', 'mild': 'Mild urgency', 'moderate': 'Moderate urgency',
    'severe': 'Severe urgency', 'incontinence': 'INCONTINENCE',
  };
  return labels[urgency] || urgency;
};

// Phase 1B: Format pain location
const formatPainLocation = (location) => {
  const labels = {
    'upper-left': 'UL', 'upper-center': 'UC', 'upper-right': 'UR',
    'lower-left': 'LL', 'lower-center': 'LC', 'lower-right': 'LR', 'diffuse': 'Diffuse',
  };
  return labels[location] || location;
};

// ============================================
// ENHANCED EXPORT FUNCTIONS
// ============================================

/**
 * Filter logs by condition IDs
 */
const filterLogsByConditions = (logs, conditionIds) => {
    if (!conditionIds || conditionIds.length === 0) {
        return logs;
    }

    // Import CONDITIONS at runtime to avoid circular dependencies
    // For now, we'll filter by symptom IDs that match the conditions
    // This will be enhanced when we integrate with ratingCriteria
    return logs; // Return all logs for now - will be enhanced
};

/**
 * Get measurements for date range
 */
const getMeasurementsForDateRange = (dateRange) => {
    try {
        if (typeof dateRange === 'object' && dateRange.type === 'custom') {
            return getMeasurements({
                startDate: dateRange.startDate,
                endDate: dateRange.endDate
            });
        }

        // Convert preset range to days
        let days;
        switch (dateRange) {
            case '7days': days = 7; break;
            case '30days': days = 30; break;
            case '60days': days = 60; break;
            case '90days': days = 90; break;
            case '180days': days = 180; break;
            case 'year': days = 365; break;
            default: days = null;
        }

        return getMeasurements(days ? { days } : {});
    } catch (error) {
        console.error('Error getting measurements:', error);
        return [];
    }
};

/**
 * Analyze all conditions and return rating evidence
 * @param {Array} logs - All symptom logs
 * @param {Object} options - Analysis options
 * @returns {Array} Array of condition analyses with data
 */
const analyzeAllConditions = (logs, options = {}) => {
    const { evaluationPeriodDays = 90 } = options;

    // Mapping of condition IDs to their analysis functions
    const analysisMap = {
        'migraine': analyzeMigraineLogs,
        'sleep-apnea': analyzeSleepApneaLogs,
        'ptsd': analyzePTSDLogs,
        'major-depression': analyzeMajorDepressionLogs,
        'generalized-anxiety': analyzeGeneralizedAnxietyLogs,
        'panic-disorder': analyzePanicDisorderLogs,
        'bipolar': analyzeBipolarLogs,
        'lumbosacral-strain': analyzeLumbosacralStrainLogs,
        'intervertebral-disc': analyzeIntervertebralDiscLogs,
        'knee-instability': analyzeKneeInstabilityLogs,
        'tbi': analyzeTBILogs,
        'hypertension': analyzeHypertensionLogs,
        'diabetes': analyzeDiabetesLogs,
        'ibs': analyzeIBSLogs,
        'gerd': analyzeGERDLogs,
        'radiculopathy': analyzeRadiculopathyLogs,
        'chronic-fatigue': analyzeChronicFatigueLogs,
        'peripheral-neuropathy': analyzePeripheralNeuropathyLogs,
        'menieres': analyzeMenieresLogs,
        'rhinitis': analyzeRhinitisLogs,
        'tmj': analyzeTMJLogs,
        'plantar-fasciitis': analyzePlantarFasciitisLogs,
        'insomnia': analyzeInsomniaLogs,
        'sinusitis': analyzeSinusitisLogs,
        'shoulder': analyzeShoulderLogs,
        'hip': analyzeHipLogs,
        'ankle': analyzeAnkleLogs,
        'wrist': analyzeWristLogs,
        'elbow': analyzeElbowLogs,
        'degenerative-arthritis': analyzeDegenerativeArthritisLogs,
        'tinnitus': analyzeTinnitusLogs,
        'fibromyalgia': analyzeFibromyalgiaLogs,
        'asthma': analyzeAsthmaLogs,
        'hearing-loss': analyzeHearingLossLogs,
        'scars': analyzeScarsLogs,
        'psoriasis': analyzePsoriasisLogs,
        'eczema': analyzeEczemaLogs,
        'tbi-residuals': analyzeTBIResidualsLogs,
        'gerd-complications': analyzeGERDComplicationsLogs,
        'ulcerative-colitis': analyzeUlcerativeColitisLogs,
        'peptic-ulcer': analyzePepticUlcerLogs,
        'hemorrhoids': analyzeHemorrhoidLogs,
        'diverticulitis': analyzeDiverticulitisLogs,
        'hypothyroidism': analyzeHypothyroidismLogs,
        'raynauds': analyzeRaynaudsLogs,
        'varicose-veins': analyzeVaricoseVeinsLogs,
        'chronic-urticaria': analyzeChronicUrticariaLogs,
        'social-anxiety': analyzeSocialAnxietyLogs,
        'ocd': analyzeOCDLogs,
        'persistent-depressive': analyzePersistentDepressiveLogs,
        'adjustment-disorder': analyzeAdjustmentDisorderLogs,
        'unspecified-anxiety': analyzeUnspecifiedAnxietyLogs,
        'unspecified-depressive': analyzeUnspecifiedDepressiveLogs,
    };

    const analyses = [];

    // Run analysis for each condition
    Object.entries(analysisMap).forEach(([conditionId, analyzeFunc]) => {
        try {
            let result;

            // Special handling for conditions with extra parameters
            if (conditionId === 'sleep-apnea') {
                // Sleep apnea needs profile data - pass empty object for now
                result = analyzeFunc(logs, {}, { evaluationPeriodDays });
            } else if (conditionId === 'hypertension' || conditionId === 'diabetes' || conditionId === 'asthma') {
                // These need measurements - will be handled by the function itself
                result = analyzeFunc(logs, { evaluationPeriodDays });
            } else {
                result = analyzeFunc(logs, { evaluationPeriodDays });
            }

            // Only include conditions with actual data
            if (result && result.hasData && result.supportedRating !== null) {
                analyses.push({
                    conditionId,
                    ...result
                });
            }
        } catch (error) {
            console.error(`Error analyzing ${conditionId}:`, error);
        }
    });

    // Sort by supported rating (highest first), then alphabetically
    analyses.sort((a, b) => {
        const ratingA = parseInt(a.supportedRating) || 0;
        const ratingB = parseInt(b.supportedRating) || 0;

        if (ratingB !== ratingA) {
            return ratingB - ratingA; // Higher ratings first
        }

        return a.condition.localeCompare(b.condition);
    });

    return analyses;
};

/**
 * Generate VA Claim Package PDF
 * Professional format optimized for VA disability claims
 */
export const generateVAClaimPackagePDF = async (dateRange = 'all', options = {}) => {
    const logs = filterLogsByDateRange(getSymptomLogs(), dateRange);
    const filteredLogs = options.conditions ? filterLogsByConditions(logs, options.conditions) : logs;

    const appointments = options.includeAppointments !== false
        ? filterAppointmentsByDateRange(getAppointments(), dateRange)
        : [];

    const measurements = options.includeMeasurements !== false
        ? getMeasurementsForDateRange(dateRange)
        : [];

    if (filteredLogs.length === 0 && appointments.length === 0 && measurements.length === 0) {
        alert('No data to export for the selected date range and filters');
        return;
    }

    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.width;
    let currentY = 20;

    // ========== COVER PAGE ==========
    doc.setFontSize(24);
    doc.setTextColor(30, 58, 138);
    doc.setFont(undefined, 'bold');
    doc.text('VA DISABILITY CLAIM', pageWidth / 2, 60, { align: 'center' });
    doc.text('EVIDENCE PACKAGE', pageWidth / 2, 75, { align: 'center' });

    doc.setFontSize(12);
    doc.setFont(undefined, 'normal');
    doc.setTextColor(100);
    doc.text(`Report Period: ${getDateRangeLabel(dateRange)}`, pageWidth / 2, 100, { align: 'center' });
    doc.text(`Generated: ${new Date().toLocaleDateString()}`, pageWidth / 2, 108, { align: 'center' });

    // Summary box
    doc.setDrawColor(30, 58, 138);
    doc.setLineWidth(0.5);
    doc.rect(40, 130, pageWidth - 80, 60);

    doc.setFontSize(10);
    doc.setTextColor(60);
    const summaryY = 140;
    doc.text(`Total Symptom Entries: ${filteredLogs.length}`, 50, summaryY);
    doc.text(`Total Appointments: ${appointments.length}`, 50, summaryY + 8);
    doc.text(`Total Measurements: ${measurements.length}`, 50, summaryY + 16);
    doc.text(`Conditions Tracked: ${options.conditions?.length || 'All'}`, 50, summaryY + 24);

    doc.setFontSize(9);
    doc.setTextColor(120);
    doc.text('This package contains documented evidence of service-connected conditions', pageWidth / 2, 210, { align: 'center' });
    doc.text('prepared for submission to the Department of Veterans Affairs', pageWidth / 2, 218, { align: 'center' });

    // Start new page for content
    doc.addPage();
    currentY = 20;

    // ========== TABLE OF CONTENTS ==========
    doc.setFontSize(16);
    doc.setTextColor(30, 58, 138);
    doc.setFont(undefined, 'bold');
    doc.text('TABLE OF CONTENTS', 14, currentY);

    doc.setFontSize(10);
    doc.setFont(undefined, 'normal');
    doc.setTextColor(60);
    currentY += 15;

    // Build TOC dynamically based on available data
    // We'll do a preliminary analysis to see if rating data will be available
    const preliminaryAnalyses = analyzeAllConditions(filteredLogs, {
        evaluationPeriodDays: typeof dateRange === 'object' && dateRange.type === 'custom'
            ? Math.floor((new Date(dateRange.endDate) - new Date(dateRange.startDate)) / (1000 * 60 * 60 * 24))
            : (dateRange === '7days' ? 7 : dateRange === '30days' ? 30 : dateRange === '60days' ? 60 : dateRange === '90days' ? 90 : dateRange === '180days' ? 180 : dateRange === 'year' ? 365 : 90)
    });

    const tocItems = [
        '1. Symptom Summary',
        '2. Detailed Symptom Entries',
    ];

    let sectionNum = 3;

    if (preliminaryAnalyses.length > 0) {
        tocItems.push(`${sectionNum}. VA Rating Evidence Analysis`);
        sectionNum++;
    }

    if (appointments.length > 0) {
        tocItems.push(`${sectionNum}. Appointment History`);
        sectionNum++;
    }

    if (measurements.length > 0) {
        tocItems.push(`${sectionNum}. Medical Measurements`);
    }

    tocItems.forEach((item, index) => {
        doc.text(item, 20, currentY + (index * 8));
    });

    // ========== SYMPTOM CONTENT ==========
    if (filteredLogs.length > 0) {
        doc.addPage();
        currentY = 20;

        doc.setFontSize(14);
        doc.setTextColor(30, 58, 138);
        doc.setFont(undefined, 'bold');
        doc.text('1. SYMPTOM SUMMARY', 14, currentY);
        doc.setFont(undefined, 'normal');

        const summaryData = generateSummary(filteredLogs);

        autoTable(doc, {
            startY: currentY + 6,
            head: [['Symptom', 'Category', 'Occurrences', 'Avg Severity', 'Max Severity']],
            body: summaryData.map(row => [
                row.symptom,
                row.category,
                row.count.toString(),
                row.avgSeverity.toFixed(1),
                row.maxSeverity.toString()
            ]),
            headStyles: { fillColor: [30, 58, 138], fontStyle: 'bold' },
            alternateRowStyles: { fillColor: [245, 247, 250] },
            margin: { left: 14, right: 14 },
        });

        // Detailed entries
        doc.addPage();
        currentY = 20;

        doc.setFontSize(14);
        doc.setTextColor(30, 58, 138);
        doc.setFont(undefined, 'bold');
        doc.text('2. DETAILED SYMPTOM ENTRIES', 14, currentY);
        doc.setFont(undefined, 'normal');

        const detailData = filteredLogs.map(log => {
            const linkedMeds = options.includeMedications !== false ? getMedicationLogsForSymptom(log.id) : [];
            let notes = log.notes || '-';

            // Add condition-specific details (migraine, sleep, PTSD, pain)
            if (log.migraineData) {
                const migraineInfo = [];
                if (log.migraineData.prostrating) migraineInfo.push('PROSTRATING');
                if (log.migraineData.duration) migraineInfo.push(formatDuration(log.migraineData.duration));
                if (migraineInfo.length > 0) {
                    notes = migraineInfo.join(', ') + (log.notes ? ` | ${log.notes}` : '');
                }
            }

            if (log.sleepData) {
                const sleepInfo = [];
                if (log.sleepData.hoursSlept) sleepInfo.push(`${log.sleepData.hoursSlept}hrs sleep`);
                if (log.sleepData.quality) sleepInfo.push(`Quality: ${log.sleepData.quality}/10`);
                if (sleepInfo.length > 0) {
                    notes = sleepInfo.join(', ') + (log.notes ? ` | ${log.notes}` : '');
                }
            }

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
            startY: currentY + 6,
            head: [['Date/Time', 'Symptom', 'Severity', 'Details']],
            body: detailData,
            headStyles: { fillColor: [30, 58, 138], fontStyle: 'bold' },
            alternateRowStyles: { fillColor: [245, 247, 250] },
            columnStyles: {
                0: { cellWidth: 40 },
                1: { cellWidth: 35 },
                2: { cellWidth: 20 },
                3: { cellWidth: 'auto' }
            },
            styles: { fontSize: 8, cellPadding: 2 },
            margin: { left: 14, right: 14 },
        });
    }

    // ========== RATING ANALYSIS ==========
    // Analyze all conditions and add rating evidence
    const ratingAnalyses = analyzeAllConditions(filteredLogs, {
        evaluationPeriodDays: typeof dateRange === 'object' && dateRange.type === 'custom'
            ? Math.floor((new Date(dateRange.endDate) - new Date(dateRange.startDate)) / (1000 * 60 * 60 * 24))
            : (dateRange === '7days' ? 7 : dateRange === '30days' ? 30 : dateRange === '60days' ? 60 : dateRange === '90days' ? 90 : dateRange === '180days' ? 180 : dateRange === 'year' ? 365 : 90)
    });

    if (ratingAnalyses.length > 0) {
        doc.addPage();
        currentY = 20;

        doc.setFontSize(14);
        doc.setTextColor(30, 58, 138);
        doc.setFont(undefined, 'bold');
        doc.text('3. VA RATING EVIDENCE ANALYSIS', 14, currentY);
        doc.setFont(undefined, 'normal');

        doc.setFontSize(9);
        doc.setTextColor(100);
        doc.text('Based on documented symptoms and VA rating criteria (38 CFR Part 4)', 14, currentY + 8);

        currentY += 18;

        // Add each condition's rating analysis
        ratingAnalyses.forEach((analysis, index) => {
            // Check if we need a new page
            if (currentY > 230) {
                doc.addPage();
                currentY = 20;
            }

            // Condition header with rating badge
            doc.setFontSize(12);
            doc.setTextColor(30, 58, 138);
            doc.setFont(undefined, 'bold');
            doc.text(`${analysis.condition} (DC ${analysis.diagnosticCode})`, 14, currentY);

            // Supported Rating Badge
            const ratingText = String(analysis.supportedRating);
            const rating = parseInt(analysis.supportedRating) || 0;
            let badgeColor;
            let badgeWidth;

            // Handle special cases
            if (ratingText.includes('Requires')) {
                badgeColor = [107, 114, 128]; // Gray for clinical requirement
                badgeWidth = 70; // Wider badge
            } else {
                // Color based on percentage
                if (rating >= 70) badgeColor = [220, 38, 38]; // Red
                else if (rating >= 50) badgeColor = [249, 115, 22]; // Orange
                else if (rating >= 30) badgeColor = [234, 179, 8]; // Yellow
                else if (rating >= 10) badgeColor = [34, 197, 94]; // Green
                else badgeColor = [156, 163, 175]; // Gray
                badgeWidth = 35; // Standard width
            }

            // Position badge on right side
            const badgeX = pageWidth - 14 - badgeWidth;
            doc.setFillColor(...badgeColor);
            doc.roundedRect(badgeX, currentY - 7, badgeWidth, 10, 2, 2, 'F');
            doc.setTextColor(255, 255, 255);
            doc.setFontSize(ratingText.includes('Requires') ? 8 : 10);
            doc.setFont(undefined, 'bold');
            doc.text(ratingText, badgeX + (badgeWidth / 2), currentY - 0.5, { align: 'center' });

            currentY += 8;
            doc.setFont(undefined, 'normal');

            // Rating Rationale
            if (analysis.ratingRationale && analysis.ratingRationale.length > 0) {
                doc.setFontSize(10);
                doc.setTextColor(60);
                doc.setFont(undefined, 'bold');
                doc.text('Rating Rationale:', 14, currentY);
                doc.setFont(undefined, 'normal');
                currentY += 5;

                analysis.ratingRationale.forEach((rationale) => {
                    const lines = doc.splitTextToSize(`• ${rationale}`, 180);
                    doc.setFontSize(9);
                    doc.setTextColor(80);
                    doc.text(lines, 18, currentY);
                    currentY += (lines.length * 4.5);
                });

                currentY += 2;
            }

            // Evidence Summary
            if (analysis.evidence) {
                const evidenceLines = [];

                if (typeof analysis.evidence === 'object') {
                    // Extract key evidence points
                    if (analysis.evidence.monthlyRates) {
                        const rates = analysis.evidence.monthlyRates;
                        if (rates.prostrating) {
                            evidenceLines.push(`${rates.prostrating} prostrating episodes per month`);
                        }
                        if (rates.total && analysis.condition === 'Migraine') {
                            evidenceLines.push(`${rates.total} total migraines per month`);
                        }
                    }

                    if (analysis.evidence.averageBP) {
                        evidenceLines.push(`Average BP: ${analysis.evidence.averageBP}`);
                    }

                    if (analysis.evidence.predominantly) {
                        evidenceLines.push(analysis.evidence.predominantly);
                    }

                    if (analysis.evidence.attacksPerMonth) {
                        evidenceLines.push(`${analysis.evidence.attacksPerMonth} attacks per month`);
                    }

                    if (analysis.evidence.latestFev1Percent) {
                        evidenceLines.push(`FEV-1: ${analysis.evidence.latestFev1Percent}% predicted`);
                    }

                    if (analysis.evidence.latestHbA1c) {
                        evidenceLines.push(`HbA1c: ${analysis.evidence.latestHbA1c}%`);
                    }
                } else if (Array.isArray(analysis.evidence)) {
                    evidenceLines.push(...analysis.evidence);
                }

                if (evidenceLines.length > 0) {
                    doc.setFontSize(10);
                    doc.setTextColor(60);
                    doc.setFont(undefined, 'bold');
                    doc.text('Key Evidence:', 14, currentY);
                    doc.setFont(undefined, 'normal');
                    currentY += 5;

                    evidenceLines.slice(0, 5).forEach((evidence) => {
                        const lines = doc.splitTextToSize(`âœ“ ${evidence}`, 180);
                        doc.setFontSize(9);
                        doc.setTextColor(22, 163, 74);
                        doc.text(lines, 18, currentY);
                        currentY += (lines.length * 4.5);
                    });

                    currentY += 2;
                }
            }

            // Documentation Gaps (if any)
            if (analysis.gaps && analysis.gaps.length > 0) {
                doc.setFontSize(10);
                doc.setTextColor(60);
                doc.setFont(undefined, 'bold');
                doc.text('Documentation Gaps:', 14, currentY);
                doc.setFont(undefined, 'normal');
                currentY += 5;

                analysis.gaps.slice(0, 3).forEach((gap) => {
                    const lines = doc.splitTextToSize(`⚠  ${gap}`, 180);
                    doc.setFontSize(9);
                    doc.setTextColor(245, 158, 11);
                    doc.text(lines, 18, currentY);
                    currentY += (lines.length * 4.5);
                });

                currentY += 2;
            }

            // Separator line between conditions
            if (index < ratingAnalyses.length - 1) {
                doc.setDrawColor(200, 200, 200);
                doc.setLineWidth(0.5);
                doc.line(14, currentY + 3, pageWidth - 14, currentY + 3);
                currentY += 10;
            } else {
                currentY += 5;
            }
        });

        // Disclaimer box
        if (currentY > 230) {
            doc.addPage();
            currentY = 20;
        }

        doc.setFillColor(254, 249, 195);
        doc.setDrawColor(234, 179, 8);
        doc.rect(14, currentY, pageWidth - 28, 40, 'FD');

        doc.setFontSize(8);
        doc.setTextColor(120, 53, 15);
        doc.setFont(undefined, 'bold');
        doc.text('IMPORTANT DISCLAIMERS:', 18, currentY + 6);
        doc.setFont(undefined, 'normal');

        const disclaimerText = 'This analysis is for documentation guidance only. The VA makes all final rating determinations based on the complete evidence of record, including C&P examinations and medical records. Use this analysis to identify documentation gaps and strengthen your claim evidence.';
        const disclaimerLines = doc.splitTextToSize(disclaimerText, pageWidth - 40);
        doc.text(disclaimerLines, 18, currentY + 12);

        // Service connection disclaimer
        doc.setFont(undefined, 'bold');
        doc.text('SERVICE CONNECTION REQUIRED:', 18, currentY + 26);
        doc.setFont(undefined, 'normal');

        const serviceConnectionText = 'Having symptoms and a supported rating percentage does NOT mean the VA will grant service connection. You must establish a medical nexus (connection) between your condition and your military service through medical evidence, lay statements, or a nexus letter from a qualified medical professional.';
        const serviceConnectionLines = doc.splitTextToSize(serviceConnectionText, pageWidth - 40);
        doc.text(serviceConnectionLines, 18, currentY + 32);
    }

    // ========== APPOINTMENTS ==========
    if (appointments.length > 0) {
        doc.addPage();
        currentY = 20;

        doc.setFontSize(14);
        doc.setTextColor(30, 58, 138);
        doc.setFont(undefined, 'bold');

        // Update section number based on whether rating analysis was included
        const appointmentSectionNum = ratingAnalyses.length > 0 ? '4' : '3';
        doc.text(`${appointmentSectionNum}. APPOINTMENT HISTORY`, 14, currentY);
        doc.setFont(undefined, 'normal');

        const appointmentData = appointments.map(apt => {
            const typeLabel = APPOINTMENT_TYPE_LABELS[apt.appointmentType] || apt.appointmentType;

            return [
                new Date(apt.appointmentDate + 'T00:00:00').toLocaleDateString(),
                typeLabel,
                apt.providerName || '-',
                apt.reasonForVisit || '-',
                apt.discussed || '-'
            ];
        });

        autoTable(doc, {
            startY: currentY + 6,
            head: [['Date', 'Type', 'Provider', 'Reason', 'Discussion']],
            body: appointmentData,
            headStyles: { fillColor: [139, 69, 19], fontStyle: 'bold' },
            alternateRowStyles: { fillColor: [254, 249, 243] },
            styles: { fontSize: 8, cellPadding: 2 },
            margin: { left: 14, right: 14 },
        });
    }

    // ========== MEASUREMENTS ==========
    if (measurements.length > 0) {
        doc.addPage();
        currentY = 20;

        doc.setFontSize(14);
        doc.setTextColor(30, 58, 138);
        doc.setFont(undefined, 'bold');

        // Section number depends on what's been included
        let measurementSectionNum = '3';
        if (ratingAnalyses.length > 0) measurementSectionNum = '4';
        if (appointments.length > 0) measurementSectionNum = String(Number(measurementSectionNum) + 1);

        doc.text(`${measurementSectionNum}. MEDICAL MEASUREMENTS`, 14, currentY);
        doc.setFont(undefined, 'normal');

        doc.setFontSize(10);
        doc.setTextColor(60);
        doc.text(`Total measurements: ${measurements.length}`, 14, currentY + 8);
        doc.text('(Blood Pressure, Glucose, FEV-1, Peak Flow, etc.)', 14, currentY + 14);

        // Group by measurement type
        const measurementsByType = {};
        measurements.forEach(m => {
            if (!measurementsByType[m.measurementType]) {
                measurementsByType[m.measurementType] = [];
            }
            measurementsByType[m.measurementType].push(m);
        });

        currentY += 22;

        // Generate and add charts for each measurement type
        Object.entries(measurementsByType).forEach(([type, typeMeasurements]) => {
            // Check if we need a new page
            if (currentY > 220) {
                doc.addPage();
                currentY = 20;
            }

            // Generate chart based on measurement type
            let chartImage = null;
            // Higher resolution for better print quality (2x size, scaled down in PDF)
            const chartOptions = { width: 1100, height: 560 };

            try {
                switch (type) {
                    case 'blood-pressure':
                        chartImage = generateBPTrendChart(typeMeasurements, {
                            ...chartOptions,
                            title: 'Blood Pressure Trends',
                            showThresholds: true
                        });
                        break;

                    case 'blood-glucose':
                        chartImage = generateGlucoseTrendChart(typeMeasurements, {
                            ...chartOptions,
                            title: 'Blood Glucose Trends'
                        });
                        break;

                    case 'fev1':
                        chartImage = generateFEV1TrendChart(typeMeasurements, {
                            ...chartOptions,
                            title: 'FEV-1 Spirometry Trends (Asthma)'
                        });
                        break;

                    case 'hba1c':
                        chartImage = generateHbA1cTrendChart(typeMeasurements, {
                            width: 1100,
                            height: 460,
                            title: 'HbA1c Progression'
                        });
                        break;
                }
            } catch (error) {
                console.error(`Error generating chart for ${type}:`, error);
            }

            // Add chart if generated
            if (chartImage) {
                doc.addImage(chartImage, 'PNG', 14, currentY, 180, 90);
                currentY += 95;
            } else {
                // No chart - just add title
                doc.setFontSize(11);
                doc.setTextColor(30, 58, 138);
                doc.setFont(undefined, 'bold');
                doc.text(`${type.toUpperCase().replace('-', ' ')} Measurements`, 14, currentY);
                doc.setFont(undefined, 'normal');
                currentY += 6;
            }

            // Add data table below chart
            const measurementData = typeMeasurements.slice(0, 20).map(m => {
                const values = Object.entries(m.values)
                    .map(([k, v]) => `${k}: ${v}`)
                    .join(', ');

                return [
                    new Date(m.timestamp).toLocaleDateString(),
                    values,
                    m.notes || '-'
                ];
            });

            autoTable(doc, {
                startY: currentY,
                head: [['Date', 'Values', 'Notes']],
                body: measurementData,
                headStyles: { fillColor: [30, 58, 138], fontStyle: 'bold', fontSize: 9 },
                alternateRowStyles: { fillColor: [245, 247, 250] },
                styles: { fontSize: 8, cellPadding: 2 },
                margin: { left: 14, right: 14 },
            });

            currentY = doc.lastAutoTable.finalY + 12;
        });
    }

    // Add footer with page numbers
    const pageCount = doc.internal.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
        doc.setPage(i);
        doc.setFontSize(9);
        doc.setTextColor(100);
        doc.text(
            `VA Claim Evidence Package - Page ${i} of ${pageCount}`,
            pageWidth / 2,
            doc.internal.pageSize.height - 10,
            { align: 'center' }
        );
    }

    // Save the PDF
    doc.save(`VA-Claim-Package-${new Date().toISOString().split('T')[0]}.pdf`);
};

/**
 * Generate combined export (PDF + CSV)
 * Downloads both formats sequentially
 */
export const generateCombinedExport = async (dateRange = 'all', options = {}) => {
    try {
        // Generate CSV first
        await generateCSV(dateRange, options);

        // Small delay to ensure first download completes
        await new Promise(resolve => setTimeout(resolve, 500));

        // Generate PDF
        if (options.vaFormat) {
            await generateVAClaimPackagePDF(dateRange, options);
        } else {
            await generatePDF(dateRange, options);
        }

        // Show success message
        alert('Combined export complete! Check your downloads folder for both PDF and CSV files.');
    } catch (error) {
        console.error('Combined export error:', error);
        alert('Error during combined export. Please try exporting formats individually.');
    }
};