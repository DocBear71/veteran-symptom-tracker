import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { getSymptomLogs, saveSymptomLog, getMedicationLogsForSymptom, getAppointments, getOccurrenceTime, isBackDated } from './storage';
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
  analyzeSomaticSymptomDisorderLogs,
  analyzeOtherSpecifiedSomaticLogs,
  analyzeUnspecifiedSomaticLogs,
  analyzeIllnessAnxietyLogs,
  analyzeOtherSpecifiedAnxietyLogs,
  analyzeDepersonalizationLogs,
  analyzeCyclothymicLogs,
  analyzeAnorexiaNervosaLogs,
  analyzeBulimiaNervosaLogs,
  analyzeVisionLogs,
  analyzeKidneyStonesLogs,
  analyzeChronicRenalDiseaseLogs,
  analyzeVoidingDysfunctionLogs,
  analyzeSphincterImpairmentLogs,
  analyzeErectileDysfunctionLogs,
  analyzeEndometriosisLogs,
  analyzeFemaleReproductiveOrgansLogs,
  analyzePelvicProlapseLogs,
  analyzeFemaleArousalDisorderLogs,
  analyzeIronDeficiencyAnemiaLogs,
  analyzeFolateDeficiencyAnemiaLogs,
  analyzePerniciousAnemiaLogs,
  analyzeHemolyticAnemiaLogs,
  analyzeSickleCellAnemiaLogs,
  analyzeAplasticAnemiaLogs,
  analyzePolycythemiaVeraLogs,
  analyzeImmuneThrombocytopeniaLogs,
  analyzeLeukemiaLogs,
  analyzeHodgkinsLymphomaLogs,
  analyzeMultipleMyelomaLogs,
  analyzeNonHodgkinsLymphomaLogs,
  analyzeMyeloproliferative7718Logs,
  analyzeChronicMyelogenousLeukemiaLogs,
  analyzeSolitaryPlasmacytomaLogs,
  analyzeMyelodysplasticSyndromesLogs,
  analyzeToothLossLogs,
  analyzeMandibleNonunionLogs,
  analyzeMalignantOralNeoplasmLogs,
  analyzeBenignOralNeoplasmLogs,
  analyzeHIVLogs,
  analyzeHepatitisCLogs,
  analyzeHepatitisBLogs,
  analyzeLymeDiseaseLogs,
  analyzeMalariaLogs,
  analyzeBrucellosisLogs,
  analyzeCampylobacterLogs,
  analyzeQFeverLogs,
  analyzeSalmonellaLogs,
  analyzeShigellaLogs,
  analyzeWestNileLogs,
  analyzeNTMLogs,
  analyzeCardiomyopathyLogs,
  analyzeSVTLogs,
  analyzeVentricularArrhythmiaLogs,
  analyzePericarditisLogs,
  analyzePostPhlebiticLogs, analyzeCirrhosisLogs, analyzeGastritisLogs,
  analyzePancreatitisLogs, analyzeBiliaryTractLogs,
  analyzeMultipleSclerosisLogs,
  analyzeParkinsonsDiseaseLogs,
  analyzeMyastheniaGravisLogs,
  analyzeNarcolepsyLogs,
  analyzeALSLogs,
  analyzeSyringomyeliaLogs,
  analyzeMyelitisLogs,
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
  const allLogs = getSymptomLogs();
  const logs = filterLogsByDateRange(allLogs, dateRange);
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
        const backDatedTag = isBackDated(log) ? ' [BACK-DATED]' : '';
        let notes = log.notes || '-';

        // Phase 1A: Add universal fields first
        const universalInfo = [];
        if (log.isFlareUp) universalInfo.push('🔥 FLARE-UP');
        if (log.duration) universalInfo.push(formatDuration(log.duration));
        if (log.timeOfDay) universalInfo.push(formatTimeOfDay(log.timeOfDay));
        if (universalInfo.length > 0) {
          notes = universalInfo.join(' | ') + (notes !== '-' ? ` | ${notes}` : '');
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
                    notes = migraineInfo.join(', ') + (notes !== '-' ? ` | ${notes}` : '');
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
                    notes = sleepInfo.join(', ') + (notes !== '-' ? ` | ${notes}` : '');
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
                    notes = ptsdInfo.join(', ') + (notes !== '-' ? ` | ${notes}` : '');
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
                    notes = painInfo.join(', ') + (notes !== '-' ? ` | ${notes}` : '');
                }
            }

        // Phase 1E: Add seizure details
        if (log.seizureData) {
          const seizureInfo = [];
          if (log.seizureData.episodeType) {
            const typeMap = {
              generalized: 'Grand Mal',
              partial: 'Partial/Focal',
              absence: 'Petit Mal',
              psychogenic: 'Psychogenic',
              other: 'Other'
            };
            seizureInfo.push(typeMap[log.seizureData.episodeType] || log.seizureData.episodeType);
          }
          if (log.seizureData.duration) seizureInfo.push(`${log.seizureData.duration}sec`);
          if (log.seizureData.lossOfConsciousness === 'yes') seizureInfo.push('LOC');
          else if (log.seizureData.lossOfConsciousness === 'partial') seizureInfo.push('Partial LOC');
          if (log.seizureData.auraPresent) seizureInfo.push('Aura');
          if (log.seizureData.witnessPresent) seizureInfo.push('WITNESSED');
          if (log.seizureData.recoveryTime) seizureInfo.push(`Recovery: ${log.seizureData.recoveryTime}`);
          if (seizureInfo.length > 0) {
            notes = seizureInfo.join(', ') + (notes !== '-' ? ` | ${notes}` : '');
          }
        }

        // Phase 2: Add eye/vision details
        if (log.eyeData) {
          const eyeInfo = [];

          // Affected eye
          if (log.eyeData.affectedEye) {
            const eyeMap = { left: 'Left eye', right: 'Right eye', both: 'Both eyes' };
            eyeInfo.push(eyeMap[log.eyeData.affectedEye] || log.eyeData.affectedEye);
          }

          // Visual acuity
          if (log.eyeData.leftEyeAcuity || log.eyeData.rightEyeAcuity) {
            const acuityInfo = [];
            if (log.eyeData.leftEyeAcuity) acuityInfo.push(`L: ${log.eyeData.leftEyeAcuity}`);
            if (log.eyeData.rightEyeAcuity) acuityInfo.push(`R: ${log.eyeData.rightEyeAcuity}`);
            eyeInfo.push(acuityInfo.join(', '));
          }

          // Symptoms
          if (log.eyeData.symptoms && log.eyeData.symptoms.length > 0) {
            eyeInfo.push(`Symptoms: ${log.eyeData.symptoms.join(', ')}`);
          }

          // Field of vision
          if (log.eyeData.fieldOfVision && log.eyeData.fieldOfVision.length > 0) {
            eyeInfo.push(`Field: ${log.eyeData.fieldOfVision.join(', ')}`);
          }

          // Activities affected
          if (log.eyeData.affectedActivities && log.eyeData.affectedActivities.length > 0) {
            eyeInfo.push(`Affects: ${log.eyeData.affectedActivities.join(', ')}`);
          }

          // Triggers
          if (log.eyeData.triggeringFactors) {
            eyeInfo.push(`Triggers: ${log.eyeData.triggeringFactors}`);
          }

          // Associated conditions
          if (log.eyeData.associatedConditions && log.eyeData.associatedConditions.length > 0) {
            eyeInfo.push(`Related: ${log.eyeData.associatedConditions.join(', ')}`);
          }

          if (eyeInfo.length > 0) {
            notes = eyeInfo.join(' | ') + (notes !== '-' ? ` | ${notes}` : '');
          }
        }

        // Phase 3: Add genitourinary details
        if (log.genitourinaryData) {
          const guInfo = [];
          const gd = log.genitourinaryData;

          // System affected
          if (gd.affectedSystem) {
            const systemMap = {
              kidney: 'Kidney/Renal',
              bladder: 'Bladder/Voiding',
              prostate: 'Prostate',
              reproductive: 'Reproductive',
              sphincter: 'Sphincter/Bowel'
            };
            guInfo.push(systemMap[gd.affectedSystem] || gd.affectedSystem);
          }

          // Kidney-specific
          if (gd.affectedSystem === 'kidney') {
            if (gd.stoneEpisode) guInfo.push('Stone episode');
            if (gd.stonePassedToday) guInfo.push(`Stone passed${gd.stoneSize ? ` (${gd.stoneSize}mm)` : ''}`);
            if (gd.procedureRecent && gd.procedureRecent !== 'none') {
              guInfo.push(`Procedure: ${gd.procedureRecent}`);
            }
            if (gd.dialysis) {
              guInfo.push(`Dialysis: ${gd.dialysisType || 'yes'}${gd.dialysisFrequency ? ` (${gd.dialysisFrequency})` : ''}`);
            }
            if (gd.kidneyPainLocation) guInfo.push(`Pain: ${gd.kidneyPainLocation}`);
          }

          // Bladder/Voiding-specific
          if (gd.affectedSystem === 'bladder') {
            if (gd.urinaryFrequency24h) guInfo.push(`Freq: ${gd.urinaryFrequency24h}/day`);
            if (gd.nocturiaCount) guInfo.push(`Nocturia: ${gd.nocturiaCount}x/night`);
            if (gd.incontinenceEpisode) {
              guInfo.push(`Incontinence: ${gd.incontinenceType || 'yes'}${gd.padChangesRequired ? ` (${gd.padChangesRequired} pads)` : ''}`);
            }
            if (gd.catheterUse) guInfo.push(`Catheter: ${gd.catheterType || 'yes'}`);
            if (gd.uti) guInfo.push('UTI symptoms');
          }

          // Prostate-specific
          if (gd.affectedSystem === 'prostate') {
            if (gd.prostateScore) guInfo.push(`IPSS: ${gd.prostateScore}`);
            if (gd.nocturiaCount) guInfo.push(`Nocturia: ${gd.nocturiaCount}x/night`);
            if (gd.prostateMedications && gd.prostateMedications.length > 0) {
              guInfo.push(`Meds: ${gd.prostateMedications.join(', ')}`);
            }
          }

          // Sphincter-specific
          if (gd.affectedSystem === 'sphincter') {
            if (gd.fecalIncontinenceEpisode) {
              guInfo.push(`Incontinence: ${gd.fecalIncontinenceType || 'yes'}${gd.fecalIncontinenceFrequency ? ` (${gd.fecalIncontinenceFrequency})` : ''}`);
            }
            if (gd.fecalUrgency) guInfo.push('Urgency');
          }

          // Reproductive-specific
          if (gd.affectedSystem === 'reproductive') {
            if (gd.erectileDysfunction) guInfo.push(`ED: ${gd.edSeverity || 'yes'}`);
            if (gd.testicular && gd.testicularSymptoms && gd.testicularSymptoms.length > 0) {
              guInfo.push(`Testicular: ${gd.testicularSymptoms.join(', ')}`);
            }
          }

          // Common fields
          if (gd.activitiesAffected && gd.activitiesAffected.length > 0) {
            guInfo.push(`Affects: ${gd.activitiesAffected.join(', ')}`);
          }
          if (gd.fluidRestriction) guInfo.push('Limiting fluids');
          if (gd.workMissed) guInfo.push('Work missed');

          if (guInfo.length > 0) {
            notes = guInfo.join(' | ') + (notes !== '-' ? ` | ${notes}` : '');
          }
        }

        // Phase 4: Gynecological data extraction
        if (log.gynecologicalData) {
          const gyneInfo = [];
          const gd = log.gynecologicalData;

          // Affected organ
          if (gd.affectedOrgan) {
            const organMap = {
              'vulva': 'Vulva/Clitoris',
              'vagina': 'Vagina',
              'cervix': 'Cervix',
              'uterus': 'Uterus',
              'fallopian-tube': 'Fallopian Tube',
              'ovary': 'Ovary',
              'multiple': 'Multiple Organs'
            };
            gyneInfo.push(organMap[gd.affectedOrgan] || gd.affectedOrgan);
          }

          // Pain details
          if (gd.painType) {
            const painMap = {
              'chronic-pelvic': 'Chronic Pelvic Pain',
              'dysmenorrhea': 'Menstrual Pain',
              'dyspareunia': 'Pain with Intercourse',
              'ovulation': 'Ovulation Pain'
            };
            gyneInfo.push(painMap[gd.painType] || gd.painType);
          }
          if (gd.painLocation) gyneInfo.push(`Location: ${gd.painLocation}`);

          // Endometriosis
          if (gd.endometriosisDiagnosed) {
            gyneInfo.push('Endometriosis');
            if (gd.laparoscopyConfirmed) gyneInfo.push('Laparoscopy confirmed');
            if (gd.lesionLocations && gd.lesionLocations.length > 0) {
              gyneInfo.push(`Lesions: ${gd.lesionLocations.join(', ')}`);
            }
            if (gd.bowelSymptoms) gyneInfo.push('Bowel symptoms');
            if (gd.bladderSymptoms) gyneInfo.push('Bladder symptoms');
            if (gd.treatmentEffectiveness) {
              gyneInfo.push(`Treatment: ${gd.treatmentEffectiveness.replace(/-/g, ' ')}`);
            }
          }

          // Menstrual/PCOS
          if (gd.cycleRegularity) gyneInfo.push(`Cycle: ${gd.cycleRegularity}`);
          if (gd.flowHeaviness && gd.flowHeaviness !== 'moderate') {
            gyneInfo.push(`Flow: ${gd.flowHeaviness}`);
          }
          if (gd.dysmenorrheaSeverity && gd.dysmenorrheaSeverity !== 'none') {
            gyneInfo.push(`Dysmenorrhea: ${gd.dysmenorrheaSeverity}`);
          }
          if (gd.pcosDiagnosed) gyneInfo.push('PCOS');

          // PID
          if (gd.pidDiagnosed) {
            gyneInfo.push('PID');
            if (gd.pidType) gyneInfo.push(`Type: ${gd.pidType}`);
            if (gd.recurrentInfections) gyneInfo.push('Recurrent infections');
          }

          // Prolapse
          if (gd.prolapseDiagnosed) {
            gyneInfo.push('Pelvic Prolapse');
            if (gd.prolapseType) gyneInfo.push(`Type: ${gd.prolapseType}`);
            if (gd.popStage) gyneInfo.push(`Stage: ${gd.popStage}`);
          }

          // Sexual function
          if (gd.sexualDysfunction || gd.arousalDifficulty || gd.libidoDecreased) {
            gyneInfo.push('FSAD');
          }

          // Treatment/Impact
          if (gd.continuousTreatmentRequired) gyneInfo.push('Continuous treatment required');
          if (gd.interferesDailyActivities) gyneInfo.push('Interferes with activities');
          if (gd.workMissed) gyneInfo.push('Work missed');

          if (gyneInfo.length > 0) {
            notes = gyneInfo.join(' | ') + (notes !== '-' ? ` | ${notes}` : '');
          }
        }

        // Phase 6: HIV/AIDS data extraction
        if (log.hivData) {
          const hivInfo = [];
          const hd = log.hivData;

          if (hd.infectionType) {
            const infectionMap = {
              'pcp': 'PCP Pneumonia',
              'cmv': 'CMV',
              'mac': 'MAC',
              'toxoplasmosis': 'Toxoplasmosis',
              'cryptococcal': 'Cryptococcal Meningitis',
              'kaposi': "Kaposi's Sarcoma",
              'lymphoma': 'Lymphoma',
              'wasting': 'Wasting Syndrome',
              'other': 'Other Opportunistic Infection'
            };
            hivInfo.push(infectionMap[hd.infectionType] || hd.infectionType);
          }
          if (hd.constitutionalSymptoms && hd.constitutionalSymptoms.length > 0) {
            hivInfo.push(`Symptoms: ${hd.constitutionalSymptoms.join(', ')}`);
          }
          if (hd.weightLossPercentage) hivInfo.push(`Weight Loss: ${hd.weightLossPercentage}%`);
          if (hd.onAntiretrovirals) hivInfo.push('On ART');
          if (hd.cd4CountKnown && hd.cd4Range) {
            const cd4Map = {
              'below-200': 'CD4 <200',
              '200-500': 'CD4 200-500',
              'above-500': 'CD4 >500'
            };
            hivInfo.push(cd4Map[hd.cd4Range] || hd.cd4Range);
          }
          if (hd.treatmentCompliance) {
            hivInfo.push(`Compliance: ${hd.treatmentCompliance}`);
          }

          if (hivInfo.length > 0) {
            notes = hivInfo.join(' | ') + (notes !== '-' ? ` | ${notes}` : '');
          }
        }

        // Phase 6: Hepatitis B/C data extraction
        if (log.hepatitisData) {
          const hepInfo = [];
          const hep = log.hepatitisData;

          if (hep.weightLossPercentage) hepInfo.push(`Weight Loss: ${hep.weightLossPercentage}%`);
          if (hep.debilitating) hepInfo.push('Debilitating Symptoms');
          if (hep.dietaryRestrictions) hepInfo.push('Dietary Restrictions Required');
          if (hep.symptomFrequency) {
            const freqMap = {
              'daily': 'Daily Symptoms',
              'intermittent': 'Intermittent Symptoms',
              'rare': 'Rare Symptoms'
            };
            hepInfo.push(freqMap[hep.symptomFrequency] || hep.symptomFrequency);
          }

          if (hepInfo.length > 0) {
            notes = hepInfo.join(' | ') + (notes !== '-' ? ` | ${notes}` : '');
          }
        }

        // Phase 6: Lyme Disease data extraction
        if (log.lymeData) {
          const lymeInfo = [];
          const ld = log.lymeData;

          if (ld.activeTreatment) lymeInfo.push('Active Treatment (100% for 1 year)');
          if (ld.treatmentCompleted) lymeInfo.push('Treatment Completed');
          if (ld.treatmentStartDate) lymeInfo.push(`Started: ${new Date(ld.treatmentStartDate).toLocaleDateString()}`);
          if (ld.treatmentCompletionDate) lymeInfo.push(`Completed: ${new Date(ld.treatmentCompletionDate).toLocaleDateString()}`);
          if (ld.rashPresent) {
            const rashMap = {
              'bulls-eye': "Bull's-eye Rash",
              'expanding-red': 'Expanding Red Rash',
              'other': 'Other Rash'
            };
            lymeInfo.push(rashMap[ld.rashType] || 'Rash Present');
          }
          if (ld.neurologicalSymptoms && ld.neurologicalSymptoms.length > 0) {
            lymeInfo.push(`Neuro: ${ld.neurologicalSymptoms.join(', ')}`);
          }
          if (ld.jointSymptoms && ld.jointSymptoms.length > 0) {
            lymeInfo.push(`Joints: ${ld.jointSymptoms.join(', ')}`);
          }

          if (lymeInfo.length > 0) {
            notes = lymeInfo.join(' | ') + (notes !== '-' ? ` | ${notes}` : '');
          }
        }

        // Phase 6: Malaria data extraction
        if (log.malariaData) {
          const malariaInfo = [];
          const md = log.malariaData;

          if (md.relapseEpisode) malariaInfo.push('Relapse Episode');
          if (md.cyclicalPattern) malariaInfo.push('Cyclical Pattern (48-72hr)');
          if (md.feverTemperature) malariaInfo.push(`Temp: ${md.feverTemperature}°F`);
          if (md.hospitalized) malariaInfo.push('Hospitalized');
          if (md.severeComplications) malariaInfo.push('Severe Complications');
          if (md.continuousMedication) malariaInfo.push('Continuous Antimalarials');

          if (malariaInfo.length > 0) {
            notes = malariaInfo.join(' | ') + (notes !== '-' ? ` | ${notes}` : '');
          }
        }

        // Phase 6: Brucellosis data extraction
        if (log.brucellosisData) {
          const brucellosisInfo = [];
          const bd = log.brucellosisData;

          if (bd.relapseEpisode) brucellosisInfo.push('Relapse Episode');
          if (bd.undulantFever) brucellosisInfo.push('Undulant Fever');
          if (bd.chronicArthritis) brucellosisInfo.push('Chronic Arthritis/Spondylitis');
          if (bd.multiOrganInvolvement) brucellosisInfo.push('Multi-Organ Involvement');
          if (bd.neurobrucellosis) brucellosisInfo.push('Neurobrucellosis (CNS)');

          if (brucellosisInfo.length > 0) {
            notes = brucellosisInfo.join(' | ') + (notes !== '-' ? ` | ${notes}` : '');
          }
        }

        // Phase 6: Campylobacter data extraction
        if (log.campylobacterData) {
          const campylobacterInfo = [];
          const cd = log.campylobacterData;

          if (cd.guillainBarre) campylobacterInfo.push('⚠️ GUILLAIN-BARRÉ SYNDROME');
          if (cd.reactiveArthritis) campylobacterInfo.push('Reactive Arthritis');
          if (cd.chronicIBS) campylobacterInfo.push('Post-Infectious IBS');
          if (cd.stoolCultureConfirmed) campylobacterInfo.push('Stool Culture +');
          if (cd.weeksSinceInfection) campylobacterInfo.push(`${cd.weeksSinceInfection} weeks post-infection`);

          if (campylobacterInfo.length > 0) {
            notes = campylobacterInfo.join(' | ') + (notes !== '-' ? ` | ${notes}` : '');
          }
        }

        // Phase 6: Q Fever data extraction
        if (log.qFeverData) {
          const qFeverInfo = [];
          const qd = log.qFeverData;

          if (qd.endocarditis) qFeverInfo.push('⚠️ Q FEVER ENDOCARDITIS');
          if (qd.chronicQFever) qFeverInfo.push('Chronic Q Fever (>6mo)');
          if (qd.fatigueSyndrome) qFeverInfo.push('Q Fever Fatigue Syndrome');
          if (qd.phaseIAntibodies) qFeverInfo.push('Phase I Ab+ (>1:800)');
          if (qd.monthsSinceInfection) qFeverInfo.push(`${qd.monthsSinceInfection} months post-infection`);

          if (qFeverInfo.length > 0) {
            notes = qFeverInfo.join(' | ') + (notes !== '-' ? ` | ${notes}` : '');
          }
        }

        // Phase 6: Salmonella data extraction
        if (log.salmonellaData) {
          const salInfo = [];
          const sal = log.salmonellaData;

          if (sal.stoolCultureConfirmed) salInfo.push('Stool Culture Confirmed');
          if (sal.reactiveArthritis) salInfo.push('Reactive Arthritis');
          if (sal.bacteremia) salInfo.push('Bacteremia/Sepsis');
          if (sal.hospitalized) salInfo.push('Hospitalized');
          if (sal.severeComplications) salInfo.push('Severe Complications');

          if (salInfo.length > 0) {
            notes = salInfo.join(' | ') + (notes !== '-' ? ` | ${notes}` : '');
          }
        }

        // Phase 6: Shigella data extraction
        if (log.shigellaData) {
          const shigInfo = [];
          const shig = log.shigellaData;

          if (shig.stoolCultureConfirmed) shigInfo.push('Stool Culture Confirmed');
          if (shig.reactiveArthritis) shigInfo.push('Reactive Arthritis');
          if (shig.hus) shigInfo.push('HUS (Hemolytic Uremic Syndrome)');
          if (shig.hospitalized) shigInfo.push('Hospitalized');
          if (shig.severeComplications) shigInfo.push('Severe Complications');

          if (shigInfo.length > 0) {
            notes = shigInfo.join(' | ') + (notes !== '-' ? ` | ${notes}` : '');
          }
        }

        // Phase 6: West Nile data extraction
        if (log.westNileData) {
          const wnInfo = [];
          const wn = log.westNileData;

          if (wn.serologyConfirmed) wnInfo.push('Serology Confirmed');
          if (wn.neuroinvasive) wnInfo.push('Neuroinvasive Disease');
          if (wn.encephalitis) wnInfo.push('Encephalitis');
          if (wn.acuteFlaccidParalysis) wnInfo.push('Acute Flaccid Paralysis');
          if (wn.permanentImpairment) wnInfo.push('Permanent Impairment');

          if (wnInfo.length > 0) {
            notes = wnInfo.join(' | ') + (notes !== '-' ? ` | ${notes}` : '');
          }
        }

        // Phase 6: NTM data extraction
        if (log.ntmData) {
          const ntmInfo = [];
          const ntm = log.ntmData;

          if (ntm.ntmSpecies) {
            const speciesMap = {
              'mac': 'MAC',
              'abscessus': 'M. abscessus',
              'kansasii': 'M. kansasii',
              'other': 'Other NTM'
            };
            ntmInfo.push(speciesMap[ntm.ntmSpecies] || ntm.ntmSpecies);
          }
          if (ntm.activeDisease) ntmInfo.push('Active Disease');
          if (ntm.onTreatment) ntmInfo.push(`On Treatment (${ntm.monthsOnTreatment || '?'} months)`);
          if (ntm.disseminated) ntmInfo.push('Disseminated');

          if (ntmInfo.length > 0) {
            notes = ntmInfo.join(' | ') + (notes !== '-' ? ` | ${notes}` : '');
          }
        }

        // Phase 7: Dental/Oral data extraction
        if (log.dentalData) {
          const dentalInfo = [];
          const dd = log.dentalData;

          // Jaw symptoms
          if (dd.jawPainSeverity !== undefined && dd.jawPainSeverity > 0) {
            dentalInfo.push(`Jaw pain: ${dd.jawPainSeverity}/10`);
          }
          if (dd.jawOpening) {
            dentalInfo.push(`Jaw opening: ${dd.jawOpening}mm`);
          }

          // Chewing/eating
          if (dd.chewingDifficulty && dd.chewingDifficulty !== 'none') {
            dentalInfo.push(`Chewing: ${dd.chewingDifficulty}`);
          }
          if (dd.dietaryRestrictions && dd.dietaryRestrictions !== 'none') {
            const dietMap = {
              'semi-solid': 'Semi-solid diet',
              'soft': 'Soft foods',
              'puree': 'Pureed diet',
              'full-liquid': 'Liquid diet only'
            };
            dentalInfo.push(dietMap[dd.dietaryRestrictions] || dd.dietaryRestrictions);
          }

          // Tooth loss
          if (dd.toothCount && dd.toothCount > 0) {
            dentalInfo.push(`${dd.toothCount} teeth lost`);
          }
          if (dd.prosthesisType && dd.prosthesisType !== 'none') {
            const prosthesisMap = {
              'partial': 'Partial denture',
              'complete-upper': 'Complete upper denture',
              'complete-lower': 'Complete lower denture',
              'complete-both': 'Complete dentures (both)',
              'implants': 'Dental implants',
              'bridge': 'Dental bridge'
            };
            dentalInfo.push(prosthesisMap[dd.prosthesisType] || dd.prosthesisType);
          }

          // Bone/fracture issues
          if (dd.boneCondition && dd.boneCondition !== 'none') {
            const boneMap = {
              'osteomyelitis': 'Osteomyelitis',
              'osteonecrosis': 'Osteonecrosis',
              'nonunion': 'Fracture nonunion',
              'malunion': 'Fracture malunion'
            };
            dentalInfo.push(boneMap[dd.boneCondition] || dd.boneCondition);
          }

          // Palate/swallowing
          if (dd.palateSymptoms && dd.palateSymptoms.length > 0) {
            dentalInfo.push(`Palate: ${dd.palateSymptoms.join(', ')}`);
          }
          if (dd.swallowingDifficulty && dd.swallowingDifficulty !== 'none') {
            dentalInfo.push(`Swallowing: ${dd.swallowingDifficulty}`);
          }

          // Neoplasm/tumor
          if (dd.oralMass) {
            dentalInfo.push('Oral mass/tumor');
            if (dd.massLocation) dentalInfo.push(`Location: ${dd.massLocation}`);
            if (dd.massBiopsy) {
              dentalInfo.push(dd.massBiopsy === 'malignant' ? 'Malignant' : 'Benign');
            }
          }

          // Infection
          if (dd.infection) {
            dentalInfo.push('Infection present');
            if (dd.infectionType) dentalInfo.push(`Type: ${dd.infectionType}`);
          }

          // Daily impact
          if (dd.speakingDifficulty) dentalInfo.push('Speaking difficulty');
          if (dd.painWithEating) dentalInfo.push('Pain with eating');
          if (dd.workMissed) dentalInfo.push('Work missed');

          if (dentalInfo.length > 0) {
            notes = dentalInfo.join(' | ') + (notes !== '-' ? ` | ${notes}` : '');
          }
        }

        // PHASE 8A: MENTAL HEALTH FORMS DATA EXTRACTION
        // Anxiety Disorders Form
        if (log.anxietyData) {
          const anxietyInfo = [];
          const ad = log.anxietyData;

          // Physical symptoms
          const physicalSymptoms = [
            ad.heartRacing && 'Heart racing',
            ad.sweating && 'Sweating',
            ad.trembling && 'Trembling',
            ad.shortnessOfBreath && 'SOB',
            ad.chestTightness && 'Chest tightness',
            ad.nausea && 'Nausea',
            ad.dizziness && 'Dizziness',
            ad.hotFlashes && 'Hot flashes',
            ad.numbnessTingling && 'Numbness/tingling'
          ].filter(Boolean);
          if (physicalSymptoms.length > 0) {
            anxietyInfo.push(`Physical: ${physicalSymptoms.join(', ')}`);
          }

          // Cognitive symptoms
          const cognitiveSymptoms = [
            ad.racingThoughts && 'Racing thoughts',
            ad.fearOfLosingControl && 'Fear losing control',
            ad.fearOfDying && 'Fear of dying',
            ad.feelingDetached && 'Detached',
            ad.difficultyConcentrating && 'Poor concentration'
          ].filter(Boolean);
          if (cognitiveSymptoms.length > 0) {
            anxietyInfo.push(`Cognitive: ${cognitiveSymptoms.join(', ')}`);
          }

          // Avoidance/Impact
          const avoidance = [
            ad.avoidedSocial && 'Avoided social',
            ad.leftEarly && 'Left early',
            ad.calledOut && 'Called out work',
            ad.cancelledPlans && 'Cancelled plans',
            ad.neededSafetyPerson && 'Needed safety person'
          ].filter(Boolean);
          if (avoidance.length > 0) {
            anxietyInfo.push(`Impact: ${avoidance.join(', ')}`);
          }

          if (ad.episodeDuration) anxietyInfo.push(`Duration: ${ad.episodeDuration}`);
          if (ad.wasPanicAttack) anxietyInfo.push('⚠️ PANIC ATTACK');
          if (ad.trigger) anxietyInfo.push(`Trigger: ${ad.trigger}`);

          if (anxietyInfo.length > 0) {
            notes = anxietyInfo.join(' | ') + (notes !== '-' ? ` | ${notes}` : '');
          }
        }

        // Depression Form
        if (log.depressionData) {
          const depressionInfo = [];
          const dd = log.depressionData;

          // Mood symptoms
          const moodSymptoms = [
            dd.depressedMood && 'Depressed mood',
            dd.anhedonia && 'Anhedonia',
            dd.worthlessness && 'Worthlessness',
            dd.excessiveGuilt && 'Guilt',
            dd.hopelessness && 'Hopelessness',
            dd.irritability && 'Irritability'
          ].filter(Boolean);
          if (moodSymptoms.length > 0) {
            depressionInfo.push(`Mood: ${moodSymptoms.join(', ')}`);
          }

          // Physical/vegetative
          const physicalSymptoms = [
            dd.insomnia && 'Insomnia',
            dd.hypersomnia && 'Hypersomnia',
            dd.decreasedAppetite && '↓Appetite',
            dd.increasedAppetite && '↑Appetite',
            dd.fatigue && 'Fatigue',
            dd.psychomotorAgitation && 'Agitation',
            dd.psychomotorRetardation && 'Slowed'
          ].filter(Boolean);
          if (physicalSymptoms.length > 0) {
            depressionInfo.push(`Physical: ${physicalSymptoms.join(', ')}`);
          }

          // Cognitive
          const cognitive = [
            dd.difficultyConcentrating && 'Poor concentration',
            dd.difficultyDeciding && 'Indecisive',
            dd.memoryProblems && 'Memory issues',
            dd.thoughtsOfDeath && 'Thoughts of death'
          ].filter(Boolean);
          if (cognitive.length > 0) {
            depressionInfo.push(`Cognitive: ${cognitive.join(', ')}`);
          }

          // Functional impact
          const impact = [
            dd.unableToGetUp && 'Bed-bound',
            dd.calledOutWork && 'Called out',
            dd.neglectedSelfCare && 'Neglected self-care',
            dd.socialWithdrawal && 'Withdrew socially',
            dd.unableToCompleteTasks && 'Unable to complete tasks'
          ].filter(Boolean);
          if (impact.length > 0) {
            depressionInfo.push(`Impact: ${impact.join(', ')}`);
          }

          if (dd.suicidalIdeation) depressionInfo.push('⚠️ SUICIDAL IDEATION');
          if (dd.trigger) depressionInfo.push(`Trigger: ${dd.trigger}`);
          if (dd.episodeContext) depressionInfo.push(`Context: ${dd.episodeContext}`);

          if (depressionInfo.length > 0) {
            notes = depressionInfo.join(' | ') + (notes !== '-' ? ` | ${notes}` : '');
          }
        }

        // Bipolar/Cyclothymic Form
        if (log.bipolarData) {
          const bipolarInfo = [];
          const bd = log.bipolarData;

          if (bd.episodeType) {
            const episodeMap = {
              'manic': 'MANIC EPISODE',
              'hypomanic': 'HYPOMANIC EPISODE',
              'depressive': 'DEPRESSIVE EPISODE',
              'mixed': 'MIXED EPISODE'
            };
            bipolarInfo.push(episodeMap[bd.episodeType] || bd.episodeType);
          }

          // Manic/hypomanic symptoms
          const manicSymptoms = [
            bd.elevatedMood && 'Elevated mood',
            bd.irritableMood && 'Irritable',
            bd.increasedEnergy && '↑Energy',
            bd.decreasedSleep && '↓Sleep need',
            bd.moreTalkative && 'Talkative',
            bd.racingThoughts && 'Racing thoughts',
            bd.distractibility && 'Distractible',
            bd.increasedActivity && '↑Activity',
            bd.riskyBehavior && 'Risky behavior',
            bd.grandiosity && 'Grandiose'
          ].filter(Boolean);
          if (manicSymptoms.length > 0) {
            bipolarInfo.push(`Manic: ${manicSymptoms.join(', ')}`);
          }

          // Depressive symptoms
          const depressiveSymptoms = [
            bd.depressedMood && 'Depressed',
            bd.anhedonia && 'Anhedonia',
            bd.fatigue && 'Fatigue',
            bd.worthlessness && 'Worthless'
          ].filter(Boolean);
          if (depressiveSymptoms.length > 0) {
            bipolarInfo.push(`Depressive: ${depressiveSymptoms.join(', ')}`);
          }

          if (bd.sleepHours) bipolarInfo.push(`Sleep: ${bd.sleepHours}hrs`);
          if (bd.riskyBehaviors && bd.riskyBehaviors.length > 0) {
            bipolarInfo.push(`Risky: ${bd.riskyBehaviors.join(', ')}`);
          }

          // Impact
          const impact = [
            bd.unableToWork && 'Unable to work',
            bd.relationshipConflicts && 'Relationship conflicts',
            bd.legalProblems && 'Legal problems',
            bd.hospitalizationRequired && '⚠️ HOSPITALIZATION REQUIRED'
          ].filter(Boolean);
          if (impact.length > 0) {
            bipolarInfo.push(`Impact: ${impact.join(', ')}`);
          }

          if (bd.episodeDuration) bipolarInfo.push(`Duration: ${bd.episodeDuration}`);

          if (bipolarInfo.length > 0) {
            notes = bipolarInfo.join(' | ') + (notes !== '-' ? ` | ${notes}` : '');
          }
        }

        // OCD Form
        if (log.ocdData) {

          const ocdInfo = [];
          const od = log.ocdData;

          // Obsessions
          const obsessions = [
            od.contaminationFears && 'Contamination',
            od.fearOfHarm && 'Fear of harm',
            od.needForSymmetry && 'Symmetry',
            od.forbiddenThoughts && 'Forbidden thoughts',
            od.religiousObsessions && 'Religious',
            od.hoardingUrges && 'Hoarding',
            od.otherObsession && od.otherObsession
          ].filter(Boolean);


          if (obsessions.length > 0) {
            ocdInfo.push(`Obsessions: ${obsessions.join(', ')}`);
          }

          // Compulsions
          const compulsions = [
            od.washingCleaning && 'Washing',
            od.checking && 'Checking',
            od.repeating && 'Repeating',
            od.counting && 'Counting',
            od.ordering && 'Ordering',
            od.mentalRituals && 'Mental rituals',
            od.reassuranceSeeking && 'Reassurance',
            od.otherCompulsion && od.otherCompulsion
          ].filter(Boolean);

          if (compulsions.length > 0) {
            ocdInfo.push(`Compulsions: ${compulsions.join(', ')}`);
          }

          if (od.timeConsumed) ocdInfo.push(`Time: ${od.timeConsumed}`);
          if (od.distressLevel !== undefined && od.distressLevel !== 5) {
            ocdInfo.push(`Distress: ${od.distressLevel}/10`);
          }

          // Impact
          const impact = [
            od.lateToAppointments && 'Late',
            od.avoidedSituations && 'Avoided situations',
            od.interferedRoutines && 'Disrupted routines',
            od.relationshipProblems && 'Relationship issues',
            od.unableToComplete && 'Unable to complete tasks'
          ].filter(Boolean);

          if (impact.length > 0) {
            ocdInfo.push(`Impact: ${impact.join(', ')}`);
          }

          if (od.trigger) ocdInfo.push(`Trigger: ${od.trigger}`);

          if (ocdInfo.length > 0) {
            const oldNotes = notes;
            notes = ocdInfo.join(' | ') + (notes !== '-' ? ` | ${notes}` : '');
          } else {
          }
        }

        // Adjustment Disorder Form
        if (log.adjustmentDisorderData) {
          const adjustmentInfo = [];
          const ad = log.adjustmentDisorderData;

          if (ad.stressor) adjustmentInfo.push(`Stressor: ${ad.stressor}`);
          if (ad.stressorDate) {
            adjustmentInfo.push(`Date: ${ad.stressorDate}`);
            if (ad.daysSinceStressor) {
              const chronic = parseInt(ad.daysSinceStressor) > 180 ? ' (CHRONIC)' : '';
              adjustmentInfo.push(`${ad.daysSinceStressor} days ago${chronic}`);
            }
          }

          if (ad.presentationType) {
            const typeMap = {
              'depressed': 'With Depressed Mood',
              'anxiety': 'With Anxiety',
              'mixed-emotions': 'Mixed Anxiety & Depression',
              'conduct': 'With Conduct Disturbance',
              'mixed-conduct-emotions': 'Mixed Conduct & Emotions',
              'unspecified': 'Unspecified'
            };
            adjustmentInfo.push(typeMap[ad.presentationType] || ad.presentationType);
          }

          // Symptoms
          const symptoms = [
            ad.tearfulness && 'Tearful',
            ad.hopelessness && 'Hopeless',
            ad.worry && 'Worry',
            ad.physicalTension && 'Tension',
            ad.impulsiveBehaviors && 'Impulsive',
            ad.aggression && 'Aggression',
            ad.ruleViolations && 'Rule violations',
            ad.recklessBehavior && 'Reckless'
          ].filter(Boolean);
          if (symptoms.length > 0) {
            adjustmentInfo.push(`Symptoms: ${symptoms.join(', ')}`);
          }

          // Impact
          const impact = [
            ad.workDifficulty && 'Work difficulty',
            ad.relationshipProblems && 'Relationship issues',
            ad.socialWithdrawal && 'Withdrew',
            ad.selfCareNeglect && 'Neglected self-care',
            ad.unableToFulfillResponsibilities && 'Unable to function'
          ].filter(Boolean);
          if (impact.length > 0) {
            adjustmentInfo.push(`Impact: ${impact.join(', ')}`);
          }

          // Progress
          if (ad.symptomsImproving === true) adjustmentInfo.push('Improving');
          else if (ad.symptomsImproving === false) adjustmentInfo.push('Not improving');

          if (ad.stillAffectingFunctioning === true) adjustmentInfo.push('Still affecting functioning');
          else if (ad.stillAffectingFunctioning === false) adjustmentInfo.push('No longer affecting functioning');

          if (ad.context) adjustmentInfo.push(`Context: ${ad.context}`);

          if (adjustmentInfo.length > 0) {
            notes = adjustmentInfo.join(' | ') + (notes !== '-' ? ` | ${notes}` : '');
          }
        }

        // Eating Disorders Form
        if (log.eatingDisorderData) {
          const eatingInfo = [];
          const ed = log.eatingDisorderData;

          if (ed.currentWeight && ed.expectedMinimumWeight) {
            const weightLoss = ((ed.expectedMinimumWeight - ed.currentWeight) / ed.expectedMinimumWeight * 100).toFixed(1);
            eatingInfo.push(`Weight: ${ed.currentWeight}lbs (Expected: ${ed.expectedMinimumWeight}lbs)`);
            if (weightLoss > 0) eatingInfo.push(`Loss: ${weightLoss}%`);
          }

          if (ed.incapacitatingEpisode) {
            eatingInfo.push('INCAPACITATING EPISODE');
            if (ed.episodeDuration) eatingInfo.push(`Duration: ${ed.episodeDuration}`);
          }

          if (ed.hospitalized) {
            eatingInfo.push('HOSPITALIZED');
            if (ed.tubeFeeding) eatingInfo.push('Tube feeding');
            if (ed.parenteralNutrition) eatingInfo.push('Parenteral nutrition');
          }

          if (ed.bingeEpisode) eatingInfo.push('Binge episode');
          if (ed.purgingEpisode) eatingInfo.push('Purging episode');
          if (ed.compensatoryBehaviors && ed.compensatoryBehaviors.length > 0) {
            eatingInfo.push(`Compensatory: ${ed.compensatoryBehaviors.join(', ')}`);
          }
          if (ed.restrictedIntake) eatingInfo.push('Restricted intake');

          if (eatingInfo.length > 0) {
            notes = eatingInfo.join(' | ') + (notes !== '-' ? ` | ${notes}` : '');
          }
        }

        // ========================================
        // PHASE 8B: ADDITIONAL MENTAL HEALTH DATA EXTRACTION
        // ========================================

        // Binge Eating Disorder Form
        if (log.bingeEatingData) {
          const bedInfo = [];
          const bed = log.bingeEatingData;

          if (bed.bingeEpisode) bedInfo.push('Binge episode');
          if (bed.lossOfControl) bedInfo.push('Loss of control');
          if (bed.distressLevel !== undefined && bed.distressLevel !== 5) {
            bedInfo.push(`Distress: ${bed.distressLevel}/10`);
          }

          if (bedInfo.length > 0) {
            notes = bedInfo.join(', ') + (notes !== '-' ? ` | ${notes}` : '');
          }
        }

        // Dissociative Disorders Form
        if (log.dissociativeData) {
          const dissocInfo = [];
          const dd = log.dissociativeData;

          if (dd.memoryGap) dissocInfo.push('Memory gap');
          if (dd.lostTime) dissocInfo.push('Lost time');
          if (dd.duration) dissocInfo.push(`Duration: ${dd.duration}`);

          if (dissocInfo.length > 0) {
            notes = dissocInfo.join(', ') + (notes !== '-' ? ` | ${notes}` : '');
          }
        }

        // Acute Stress Disorder Form
        if (log.acuteStressData) {
          const asdInfo = [];
          const asd = log.acuteStressData;

          if (asd.traumaDate) asdInfo.push(`Trauma: ${asd.traumaDate}`);
          if (asd.dissociativeSymptoms) asdInfo.push('Dissociative symptoms');
          if (asd.avoidance) asdInfo.push('Avoidance');

          if (asdInfo.length > 0) {
            notes = asdInfo.join(', ') + (notes !== '-' ? ` | ${notes}` : '');
          }
        }

        // Personality Disorders Form
        if (log.personalityData) {
          const pdInfo = [];
          const pd = log.personalityData;

          if (pd.occupationalImpact) pdInfo.push('Occupational impact');
          if (pd.socialImpact) pdInfo.push('Social impact');

          if (pdInfo.length > 0) {
            notes = pdInfo.join(', ') + (notes !== '-' ? ` | ${notes}` : '');
          }
        }

        // Phase 9: Cardiovascular data extraction
        if (log.cardiovascularData) {
          const cvInfo = [];
          const cv = log.cardiovascularData;

          if (cv.activityLevel) {
            const metsMap = {
              'greater-than-10': '>10 METs',
              '7-10': '7-10 METs',
              '5-7': '5-7 METs',
              '3-5': '3-5 METs',
              '1-3': '1-3 METs',
              'less-than-1': '<1 METs'
            };
            cvInfo.push(metsMap[cv.activityLevel] || cv.activityLevel);
          }
          if (cv.atRest) cvInfo.push('Symptoms at rest');
          if (cv.withExertion) cvInfo.push('Symptoms with exertion');
          if (cv.treatmentRequired && cv.treatmentRequired !== 'none') {
            const treatmentMap = {
              'vagal': 'Vagal maneuver',
              'oral': 'Oral medication',
              'iv': 'IV medication',
              'cardioversion': 'Cardioversion',
              'ablation': 'Ablation'
            };
            cvInfo.push(treatmentMap[cv.treatmentRequired] || cv.treatmentRequired);
          }
          if (cv.hospitalized) cvInfo.push('Hospitalized');
          if (cv.hasAICD) cvInfo.push('AICD implanted');
          if (cv.aicdShockDelivered) cvInfo.push('AICD shock delivered');
          if (cv.activeInfection) cvInfo.push('Active infection');
          if (cv.affectedLeg) {
            const legMap = { 'left': 'Left leg', 'right': 'Right leg', 'both': 'Both legs' };
            cvInfo.push(legMap[cv.affectedLeg] || cv.affectedLeg);
          }
          if (cv.compressionUsed) cvInfo.push('Compression therapy');

          if (cvInfo.length > 0) {
            notes = cvInfo.join(' | ') + (notes !== '-' ? ` | ${notes}` : '');
          }
        }

        // Phase 10: Digestive Form
        if (log.digestiveData) {
          const dgInfo = [];
          const dg = log.digestiveData;

          if (dg.hasAscites) dgInfo.push(`Ascites${dg.ascitesSeverity ? ` (${dg.ascitesSeverity})` : ''}`);
          if (dg.hasEncephalopathy) dgInfo.push('Encephalopathy');
          if (dg.hasVaricealBleed) dgInfo.push('Variceal bleed');
          if (dg.onLactulose) dgInfo.push('On lactulose');
          if (dg.episodeDuration) dgInfo.push(`Episode: ${dg.episodeDuration} days`);
          if (dg.onDailyMedication) dgInfo.push('Daily medication');
          if (dg.hasGIBleeding) dgInfo.push('GI bleeding');
          if (dg.onEnzymes) dgInfo.push('On enzymes');
          if (dg.hasMaldigestion) dgInfo.push('Maldigestion');
          if (dg.hasDietaryRestriction) dgInfo.push('Diet restriction');
          if (dg.attackWithNausea && dg.attackWithVomiting) dgInfo.push('Attack with N/V');
          if (dg.hadStrictureDilation) dgInfo.push('Stricture dilation');
          if (dg.hospitalized) dgInfo.push('Hospitalized');

          if (dgInfo.length > 0) {
            notes = dgInfo.join(', ') + (notes !== '-' ? ` | ${notes}` : '');
          }
        }

        // Phase 1A: Multiple Sclerosis Form
        if (log.multipleSclerosisData) {
          const msInfo = [];
          const ms = log.multipleSclerosisData;

          if (ms.isRelapse) msInfo.push(`Relapse${ms.relapseDuration ? ` (${ms.relapseDuration} days)` : ''}`);
          if (ms.relapseRecovery) msInfo.push(`Recovery: ${ms.relapseRecovery}`);
          if (ms.mobilityAid && ms.mobilityAid !== 'none') msInfo.push(`Mobility: ${ms.mobilityAid}`);
          if (ms.assistanceNeeded) msInfo.push('Assistance needed');
          if (ms.onDMT) msInfo.push('On DMT');
          if (ms.recentSteroids) msInfo.push('IV steroids');
          if (ms.heatTriggered) msInfo.push('Heat triggered');

          if (msInfo.length > 0) {
            notes = msInfo.join(', ') + (notes !== '-' ? ` | ${notes}` : '');
          }
        }

        // Phase 1A: Parkinson's Disease Form
        if (log.parkinsonsData) {
          const pdInfo = [];
          const pd = log.parkinsonsData;

          if (pd.tremorSide) pdInfo.push(`Tremor: ${pd.tremorSide}${pd.tremorSeverity ? ` (${pd.tremorSeverity})` : ''}`);
          if (pd.freezingEpisodes) pdInfo.push(`Freezing: ${pd.freezingEpisodes}x`);
          if (pd.fallsToday) pdInfo.push(`Falls: ${pd.fallsToday}`);
          if (pd.medicationState) pdInfo.push(`Med state: ${pd.medicationState}`);
          if (pd.mobilityAid && pd.mobilityAid !== 'none') pdInfo.push(`Mobility: ${pd.mobilityAid}`);
          if (pd.speechAffected) pdInfo.push('Speech affected');
          if (pd.swallowingAffected) pdInfo.push('Swallowing affected');
          if (pd.hallucinationsPresent) pdInfo.push('Hallucinations');
          if (pd.confusionPresent) pdInfo.push('Confusion');

          if (pdInfo.length > 0) {
            notes = pdInfo.join(', ') + (notes !== '-' ? ` | ${notes}` : '');
          }
        }

        // Phase 1A: Myasthenia Gravis Form
        if (log.myastheniaData) {
          const mgInfo = [];
          const mg = log.myastheniaData;

          if (mg.worseWithActivity && mg.betterWithRest) mgInfo.push('Fatigable weakness pattern');
          else if (mg.worseWithActivity) mgInfo.push('Worse with activity');
          if (mg.timeOfDayWorst) mgInfo.push(`Worst: ${mg.timeOfDayWorst}`);
          if (mg.ptosisPresent) mgInfo.push(`Ptosis${mg.ptosisSide ? ` (${mg.ptosisSide})` : ''}`);
          if (mg.doubleVision) mgInfo.push('Double vision');
          if (mg.canRaiseArms) mgInfo.push(`Arm hold: ${mg.canRaiseArms}s`);
          if (mg.breathingDifficulty) mgInfo.push('⚠️ Breathing difficulty');
          if (mg.emergencySigns) mgInfo.push('🚨 Crisis signs');
          if (mg.onPyridostigmine) mgInfo.push('On Mestinon');

          if (mgInfo.length > 0) {
            notes = mgInfo.join(', ') + (notes !== '-' ? ` | ${notes}` : '');
          }
        }

        // Phase 1B: Narcolepsy Form
        if (log.narcolepsyData) {
          const narcoInfo = [];
          const narco = log.narcolepsyData;

          if (narco.sleepAttackDuration) narcoInfo.push(`Attack: ${narco.sleepAttackDuration}`);
          if (narco.sleepAttackTrigger) narcoInfo.push(`Trigger: ${narco.sleepAttackTrigger}`);
          if (narco.cataplexyTrigger) narcoInfo.push(`Cataplexy: ${narco.cataplexyTrigger}`);
          if (narco.cataplexyAffected) narcoInfo.push(`Affected: ${narco.cataplexyAffected}`);
          if (narco.fellDuringCataplexy) narcoInfo.push('Fell');
          if (narco.onStimulants) narcoInfo.push('On stimulants');
          if (narco.onSodiumOxybate) narcoInfo.push('On Xyrem/Xywav');
          if (narco.sleepStudyConfirmed) narcoInfo.push('MSLT confirmed');

          if (narcoInfo.length > 0) {
            notes = narcoInfo.join(', ') + (notes !== '-' ? ` | ${notes}` : '');
          }
        }

        // Phase 1B: ALS Form
        if (log.alsData) {
          const alsInfo = [];
          const als = log.alsData;

          if (als.weaknessLocation) alsInfo.push(`Weakness: ${als.weaknessLocation}${als.weaknessSide ? ` (${als.weaknessSide})` : ''}`);
          if (als.speechClarity) alsInfo.push(`Speech: ${als.speechClarity}`);
          if (als.swallowingSolids) alsInfo.push(`Swallow solids: ${als.swallowingSolids}`);
          if (als.swallowingLiquids) alsInfo.push(`Swallow liquids: ${als.swallowingLiquids}`);
          if (als.breathingDifficulty) alsInfo.push(`Breathing: ${als.breathingDifficulty}`);
          if (als.usesBiPAP) alsInfo.push('BiPAP');
          if (als.usesVentilator) alsInfo.push('Ventilator');
          if (als.usesFeedingTube) alsInfo.push('Feeding tube');
          if (als.mobilityStatus) alsInfo.push(`Mobility: ${als.mobilityStatus}`);

          if (alsInfo.length > 0) {
            notes = alsInfo.join(', ') + (notes !== '-' ? ` | ${notes}` : '');
          }
        }

        // Phase 1B: Syringomyelia Form
        if (log.syringomyeliaData) {
          const syringInfo = [];
          const syring = log.syringomyeliaData;

          if (syring.painType) syringInfo.push(`Pain: ${syring.painType}`);
          if (syring.sensoryLossPattern) syringInfo.push(`Sensory: ${syring.sensoryLossPattern}`);
          if (syring.hadBurnInjury) syringInfo.push('Burn injury');
          if (syring.hadCutInjury) syringInfo.push('Cut injury');
          if (syring.syrinxLocation) syringInfo.push(`Syrinx: ${syring.syrinxLocation}`);

          if (syringInfo.length > 0) {
            notes = syringInfo.join(', ') + (notes !== '-' ? ` | ${notes}` : '');
          }
        }

        // Phase 1B: Myelitis Form
        if (log.myelitisData) {
          const myelInfo = [];
          const myel = log.myelitisData;

          if (myel.weaknessDistribution) myelInfo.push(`Distribution: ${myel.weaknessDistribution}`);
          if (myel.sensoryLevel) myelInfo.push(`Level: ${myel.sensoryLevel}`);
          if (myel.bladderSymptoms) myelInfo.push(`Bladder: ${myel.bladderSymptoms}`);
          if (myel.usesCatheter) myelInfo.push('Catheter');
          if (myel.bowelSymptoms) myelInfo.push(`Bowel: ${myel.bowelSymptoms}`);
          if (myel.mobilityStatus) myelInfo.push(`Mobility: ${myel.mobilityStatus}`);
          if (myel.causeOfMyelitis) myelInfo.push(`Cause: ${myel.causeOfMyelitis}`);

          if (myelInfo.length > 0) {
            notes = myelInfo.join(', ') + (notes !== '-' ? ` | ${notes}` : '');
          }
        }

        // Add medications to the PDF file after all the symptoms
            if (linkedMeds.length > 0) {
                const medInfo = linkedMeds.map(m => `${m.medicationName} ${m.dosage}`).join(', ');
                notes = `Meds: ${medInfo}` + (notes !== '-' ? ` | ${notes}` : '');
            }

        return [
            new Date(getOccurrenceTime(log)).toLocaleString() + backDatedTag,
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
        'Occurred Date', 'Occurred Time', 'Logged Date', 'Logged Time', 'Back-Dated', 'Symptom', 'Category', 'Severity',
        // Universal fields
        'Flare-Up', 'Duration', 'Time of Day',
        'Medications Taken',
        // GI fields
        'Bristol Scale', 'GI Frequency', 'Urgency', 'Blood Present', 'Bloating', 'GI Pain Location', 'Meal Related', 'Nighttime GI',
        // Phase 11: Respiratory fields
        'SpO2 %', 'Peak Flow (L/min)', 'Rescue Inhaler Used', 'Inhaler Puffs', 'Activity Trigger', 'Wheezing', 'Chest Tightness', 'Coughing',
        // Migraine fields
        'Prostrating', 'Migraine Duration', 'Associated Symptoms', 'Triggers',
        // Sleep fields
        'Hours Slept', 'Sleep Quality', 'Wake Ups', 'Sleep Issues',
        // PTSD fields
        'PTSD Symptoms', 'PTSD Trigger',
        // Pain fields
        'Pain Type', 'Pain Flare Up', 'Radiating', 'Limited ROM', 'Activities Affected',
        // Phase 1E: Seizure fields
        'Seizure Type', 'Seizure Duration (sec)', 'Loss of Consciousness', 'Aura Present', 'Witness Present', 'Recovery Time',
        // Phase 2: Eye/Vision fields
        'Affected Eye', 'Left Eye Acuity', 'Right Eye Acuity', 'Eye Symptoms', 'Field of Vision', 'Affected Activities', 'Triggering Factors', 'Associated Conditions',
        // Phase 3: Genitourinary fields
        'GU System', 'Stone Episode', 'Stone Passed', 'Stone Size', 'Procedure', 'Dialysis', 'Dialysis Type',
        'Urinary Frequency/Day', 'Nocturia Count', 'Incontinence Episode', 'Incontinence Type', 'Pad Changes',
        'Catheter Use', 'Catheter Type', 'UTI Symptoms', 'Prostate IPSS', 'Prostate Meds',
        'Fecal Incontinence', 'Fecal Incontinence Frequency', 'Bowel Control Methods',
        'Erectile Dysfunction', 'ED Severity', 'Testicular Symptoms', 'GU Activities Affected',
        // Phase 4: Gynecological fields
        'Gyne Organ', 'Pain Type (Gyne)', 'Pain Location (Gyne)', 'Endometriosis', 'Laparoscopy Confirmed',
        'Treatment Effectiveness', 'Cycle Regularity', 'Flow Heaviness', 'Dysmenorrhea Severity',
        'PCOS Diagnosed', 'PID Diagnosed', 'Prolapse Diagnosed', 'Prolapse Type', 'POP-Q Stage',
        'Continuous Treatment Required', 'Gyne Work Missed',
        // Phase 5: Hemic/Lymphatic fields
        'Anemia Type', 'IV Infusion', 'Oral Supplementation', 'B12 Injection', 'Neurological Symptoms',
        'Bleeding Disorder Type', 'Platelet Count', 'Bleeding Site', 'Bleeding Treatment',
        'Polycythemia Diagnosis', 'Phlebotomy', 'Myelosuppressive Meds', 'JAK Inhibitor',
        'Lymphoma/Leukemia Diagnosis', 'Cancer Treatment Status', 'Cancer Treatment Type', 'Treatment Side Effects',
        'Sickle Cell Crisis', 'Crisis Location', 'Hospitalization Required', 'Organ Damage',
        // Phase 6: Infectious Diseases - HIV/AIDS fields
        'HIV Infection Type', 'HIV Constitutional Symptoms', 'HIV Weight Loss %', 'HIV On ART', 'HIV CD4 Count Known', 'HIV CD4 Range', 'HIV Treatment Compliance',
        // Phase 6: Infectious Diseases - Hepatitis B/C fields
        'Hepatitis Weight Loss %', 'Hepatitis Debilitating', 'Hepatitis Dietary Restrictions', 'Hepatitis Symptom Frequency',
        // Phase 6: Infectious Diseases - Lyme Disease fields
        'Lyme Active Treatment', 'Lyme Treatment Completed', 'Lyme Treatment Date', 'Lyme Rash Present', 'Lyme Rash Type', 'Lyme Neuro Symptoms', 'Lyme Joint Symptoms',
        // Phase 6: Infectious Diseases - Malaria fields
        'Malaria Relapse', 'Malaria Cyclical Pattern', 'Malaria Fever Temp', 'Malaria Hospitalized', 'Malaria Severe Complications', 'Malaria Continuous Meds',
        // Phase 6: Infectious Diseases - Brucellosis fields
        'Brucellosis Relapse', 'Brucellosis Undulant Fever', 'Brucellosis Arthritis', 'Brucellosis Multi-Organ', 'Brucellosis Neuro',
        // Phase 6: Infectious Diseases - Campylobacter fields
        'Campylobacter GBS', 'Campylobacter Arthritis', 'Campylobacter IBS', 'Campylobacter Culture Confirmed', 'Campylobacter Weeks Since Infection',
        // Phase 6: Infectious Diseases - Q Fever fields
        'Q Fever Chronic', 'Q Fever Endocarditis', 'Q Fever Fatigue Syndrome', 'Q Fever Phase I Antibodies', 'Q Fever Months Since Infection',
        // Phase 6: Infectious Diseases - Salmonella fields
        'Salmonella Hospitalized', 'Salmonella Bacteremia', 'Salmonella Reactive Arthritis', 'Salmonella Severe Complications', 'Salmonella Stool Culture',
        // Phase 6: Infectious Diseases - Shigella fields
        'Shigella Hospitalized', 'Shigella HUS', 'Shigella Reactive Arthritis', 'Shigella Severe Complications', 'Shigella Stool Culture',
        // Phase 6: Infectious Diseases - West Nile fields
        'West Nile Neuroinvasive', 'West Nile Encephalitis', 'West Nile AFP', 'West Nile Permanent Impairment', 'West Nile Serology',
        // Phase 6: Infectious Diseases - NTM fields
        'NTM Active Disease', 'NTM On Treatment', 'NTM Disseminated', 'NTM Months Treatment', 'NTM Species',
        // Phase 7: Dental/Oral fields
        'Jaw Pain Severity', 'Jaw Opening (mm)', 'Chewing Difficulty', 'Dietary Restrictions',
        'Missing Teeth Count', 'Prosthesis Type', 'Bone Condition', 'Palate Symptoms',
        'Swallowing Difficulty', 'Oral Mass Present', 'Mass Location', 'Mass Biopsy Result',
        'Infection Present', 'Infection Type', 'Speaking Difficulty', 'Pain with Eating', 'Dental Work Missed',
        // Phase 8A: Mental Health Expansion
        'Somatic - Pain Preoccupation', 'Somatic - Excessive Health Worry', 'Somatic - Multiple Symptoms', 'Somatic - Frequent Doctor Visits', 'Somatic - Functional Impairment',
        'Illness Anxiety - Fear of Illness', 'Illness Anxiety - Body Checking', 'Illness Anxiety - Reassurance Seeking', 'Illness Anxiety - Appointment Avoidance',
        'Illness Anxiety - Health Distress', 'Other Anxiety - Symptoms', 'Other Anxiety - Worry', 'Other Anxiety - Avoidance', 'Other Anxiety - Physical Symptoms',
        'Depersonalization - Detachment', 'Derealization - Unreality', 'Depersonalization - Robot/Autopilot', 'Depersonalization - Distress', 'Cyclothymic - Hypomanic',
        'Cyclothymic - Depressive', 'Cyclothymic - Mood Swings', 'Cyclothymic - Irritability', 'Anorexia - Restricted Eating', 'Anorexia - Weight Loss', 'Anorexia - Fear Weight Gain',
        'Anorexia - Restricted Eating', 'Anorexia - Weight Loss', 'Anorexia - Fear Weight Gain', 'Anorexia - Body Image', 'Anorexia - Incapacitating Episode', 'Anorexia - Hospitalization',
        'Bulimia - Binge Eating', 'Bulimia - Purging', 'Bulimia - Compensatory Behaviors', 'Bulimia - Body Image', 'Bulimia - Incapacitating Episode', 'Bulimia - Hospitalization',
        // PHASE 8A EXTENDED: Mental Health Forms CSV Headers
        // Anxiety Form (22 columns)
        'Anxiety - Heart Racing', 'Anxiety - Sweating', 'Anxiety - Trembling', 'Anxiety - Shortness of Breath', 'Anxiety - Chest Tightness', 'Anxiety - Nausea', 'Anxiety - Dizziness',
        'Anxiety - Hot Flashes', 'Anxiety - Numbness/Tingling', 'Anxiety - Racing Thoughts', 'Anxiety - Fear Losing Control', 'Anxiety - Fear of Dying', 'Anxiety - Feeling Detached',
        'Anxiety - Difficulty Concentrating', 'Anxiety - Avoided Social', 'Anxiety - Left Early', 'Anxiety - Called Out', 'Anxiety - Cancelled Plans', 'Anxiety - Needed Safety Person',
        'Anxiety - Episode Duration', 'Anxiety - Panic Attack', 'Anxiety - Trigger',
        // Depression Form (23 columns)
        'Depression - Depressed Mood', 'Depression - Anhedonia', 'Depression - Worthlessness', 'Depression - Excessive Guilt', 'Depression - Hopelessness', 'Depression - Irritability',
        'Depression - Insomnia', 'Depression - Hypersomnia', 'Depression - Decreased Appetite', 'Depression - Increased Appetite', 'Depression - Fatigue', 'Depression - Psychomotor Agitation',
        'Depression - Psychomotor Retardation', 'Depression - Difficulty Concentrating', 'Depression - Difficulty Deciding', 'Depression - Memory Problems', 'Depression - Thoughts of Death',
        'Depression - Unable to Get Up', 'Depression - Called Out Work', 'Depression - Neglected Self-Care', 'Depression - Social Withdrawal', 'Depression - Unable to Complete Tasks',
        'Depression - Suicidal Ideation', 'Depression - Trigger', 'Depression - Episode Context',
        // Bipolar Form (25 columns)
        'Bipolar - Episode Type', 'Bipolar - Elevated Mood', 'Bipolar - Irritable Mood', 'Bipolar - Increased Energy', 'Bipolar - Decreased Sleep Need', 'Bipolar - More Talkative',
        'Bipolar - Racing Thoughts', 'Bipolar - Distractibility', 'Bipolar - Increased Activity', 'Bipolar - Risky Behavior', 'Bipolar - Grandiosity', 'Bipolar - Depressed Mood',
        'Bipolar - Anhedonia', 'Bipolar - Fatigue', 'Bipolar - Worthlessness', 'Bipolar - Sleep Hours', 'Bipolar - Risky Behaviors List', 'Bipolar - Unable to Work',
        'Bipolar - Relationship Conflicts', 'Bipolar - Legal Problems', 'Bipolar - Hospitalization Required', 'Bipolar - Episode Duration',
        // OCD Form (20 columns)
        'OCD - Contamination Fears', 'OCD - Fear of Harm', 'OCD - Need for Symmetry', 'OCD - Forbidden Thoughts', 'OCD - Religious Obsessions', 'OCD - Hoarding Urges',
        'OCD - Other Obsession', 'OCD - Washing/Cleaning', 'OCD - Checking', 'OCD - Repeating', 'OCD - Counting', 'OCD - Ordering', 'OCD - Mental Rituals',
        'OCD - Reassurance Seeking', 'OCD - Other Compulsion', 'OCD - Time Consumed', 'OCD - Distress Level', 'OCD - Late to Appointments', 'OCD - Avoided Situations',
        'OCD - Interfered Routines', 'OCD - Relationship Problems', 'OCD - Unable to Complete', 'OCD - Trigger',
        // Adjustment Disorder Form (17 columns)
        'Adjustment - Stressor', 'Adjustment - Stressor Date', 'Adjustment - Days Since Stressor', 'Adjustment - Presentation Type', 'Adjustment - Tearfulness',
        'Adjustment - Hopelessness', 'Adjustment - Worry', 'Adjustment - Physical Tension', 'Adjustment - Impulsive Behaviors', 'Adjustment - Aggression', 'Adjustment - Rule Violations',
        'Adjustment - Reckless Behavior', 'Adjustment - Work Difficulty', 'Adjustment - Relationship Problems', 'Adjustment - Social Withdrawal', 'Adjustment - Self-Care Neglect',
        'Adjustment - Unable to Fulfill Responsibilities', 'Adjustment - Symptoms Improving', 'Adjustment - Still Affecting Functioning', 'Adjustment - Context',
        // Phase 8B: Additional Mental Health fields
        'Binge Eating Episode', 'Binge Eating - Loss of Control', 'Binge Eating - Distress Level',
        'Dissociative - Memory Gap', 'Dissociative - Lost Time', 'Dissociative - Duration',
        'Acute Stress - Trauma Date', 'Acute Stress - Dissociative Symptoms', 'Acute Stress - Avoidance',
        'Personality - Occupational Impact', 'Personality - Social Impact',
        // Phase 9: Cardiovascular fields
        'Cardiovascular - At Rest', 'Cardiovascular - With Exertion', 'Cardiovascular - Activity Level',
        'Cardiovascular - Has AICD', 'Cardiovascular - AICD Shock', 'Cardiovascular - Hospitalized',
        'Cardiovascular - Active Infection', 'Cardiovascular - Pain With Breathing',
        'Cardiovascular - Affected Leg', 'Cardiovascular - Compression Used',
        // Phase 10: Digestive fields
        'Digestive - Has Ascites', 'Digestive - Ascites Severity', 'Digestive - Encephalopathy',
        'Digestive - Variceal Bleed', 'Digestive - On Lactulose', 'Digestive - Episode Duration',
        'Digestive - Daily Medication', 'Digestive - GI Bleeding', 'Digestive - On Enzymes',
        'Digestive - Maldigestion', 'Digestive - Dietary Restriction', 'Digestive - Attack With Nausea',
        'Digestive - Attack With Vomiting', 'Digestive - Stricture Dilation', 'Digestive - Hospitalized',
        // Phase 1A: Neurological fields
        'MS - Is Relapse', 'MS - Relapse Duration', 'MS - Relapse Recovery', 'MS - Mobility Aid',
        'MS - Assistance Needed', 'MS - On DMT', 'MS - Recent Steroids', 'MS - Heat Triggered',
        'PD - Tremor Side', 'PD - Tremor Severity', 'PD - Freezing Episodes', 'PD - Falls',
        'PD - Medication State', 'PD - Mobility Aid', 'PD - Speech Affected', 'PD - Swallowing Affected',
        'PD - Hallucinations', 'PD - Confusion',
        'MG - Worse With Activity', 'MG - Better With Rest', 'MG - Time Of Day Worst',
        'MG - Ptosis Present', 'MG - Ptosis Side', 'MG - Double Vision', 'MG - Arm Hold Duration',
        'MG - Breathing Difficulty', 'MG - Emergency Signs', 'MG - On Pyridostigmine',
        // Phase 1B: Narcolepsy fields
        'Narcolepsy - Sleep Attack Duration', 'Narcolepsy - Attack Trigger', 'Narcolepsy - Cataplexy Trigger',
        'Narcolepsy - Cataplexy Affected', 'Narcolepsy - Fell During Cataplexy', 'Narcolepsy - On Stimulants',
        'Narcolepsy - Sleep Study Confirmed',
        // Phase 1B: ALS fields
        'ALS - Weakness Location', 'ALS - Weakness Side', 'ALS - Speech Clarity',
        'ALS - Swallowing Solids', 'ALS - Swallowing Liquids', 'ALS - Breathing Difficulty',
        'ALS - Uses BiPAP', 'ALS - Uses Ventilator', 'ALS - Uses Feeding Tube', 'ALS - Mobility Status',
        // Phase 1B: Syringomyelia fields
        'Syringomyelia - Pain Type', 'Syringomyelia - Pain Location', 'Syringomyelia - Sensory Pattern',
        'Syringomyelia - Burn Injury', 'Syringomyelia - Cut Injury', 'Syringomyelia - Syrinx Location',
        // Phase 1B: Myelitis fields
        'Myelitis - Weakness Distribution', 'Myelitis - Sensory Level', 'Myelitis - Bladder Symptoms',
        'Myelitis - Uses Catheter', 'Myelitis - Bowel Symptoms', 'Myelitis - Mobility Status', 'Myelitis - Cause',
        // Notes
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

          const occurredDate = new Date(getOccurrenceTime(log));
          const loggedDate = new Date(log.timestamp);

          return [
            occurredDate.toLocaleDateString(),
            occurredDate.toLocaleTimeString(),
            loggedDate.toLocaleDateString(),
            loggedDate.toLocaleTimeString(),
            isBackDated(log) ? 'Yes' : 'No',
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
            // Phase 11: Respiratory fields
            log.respiratoryData?.spo2 || '',
            log.respiratoryData?.peakFlow || '',
            log.respiratoryData?.rescueInhalerUsed === true ? 'Yes' : (log.respiratoryData?.rescueInhalerUsed === false ? 'No' : ''),
            log.respiratoryData?.inhalerPuffs || '',
            log.respiratoryData?.activityTrigger || '',
            log.respiratoryData?.wheezing ? 'Yes' : '',
            log.respiratoryData?.chestTightness ? 'Yes' : '',
            log.respiratoryData?.coughing ? 'Yes' : '',
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
            // Phase 1E: Seizure fields
            log.seizureData?.episodeType ? (log.seizureData.episodeType === 'generalized' ? 'Grand Mal' : log.seizureData.episodeType === 'absence' ? 'Petit Mal' : log.seizureData.episodeType) : '',
            log.seizureData?.duration || '',
            log.seizureData?.lossOfConsciousness === 'yes' ? 'Yes' : (log.seizureData?.lossOfConsciousness === 'partial' ? 'Partial' : (log.seizureData?.lossOfConsciousness === 'no' ? 'No' : '')),
            log.seizureData?.auraPresent === true ? 'Yes' : (log.seizureData?.auraPresent === false ? 'No' : ''),
            log.seizureData?.witnessPresent === true ? 'Yes' : (log.seizureData?.witnessPresent === false ? 'No' : ''),
            log.seizureData?.recoveryTime || '',
            // Phase 2: Eye/Vision fields
            log.eyeData?.affectedEye ? (log.eyeData.affectedEye === 'left' ? 'Left' : log.eyeData.affectedEye === 'right' ? 'Right' : 'Both') : '',
            log.eyeData?.leftEyeAcuity || '',
            log.eyeData?.rightEyeAcuity || '',
            log.eyeData?.symptoms?.join('; ') || '',
            log.eyeData?.fieldOfVision?.join('; ') || '',
            log.eyeData?.affectedActivities?.join('; ') || '',
            log.eyeData?.triggeringFactors || '',
            log.eyeData?.associatedConditions?.join('; ') || '',
            // Phase 3: Genitourinary fields
            log.genitourinaryData?.affectedSystem || '',
            log.genitourinaryData?.stoneEpisode ? 'Yes' : '',
            log.genitourinaryData?.stonePassedToday ? 'Yes' : '',
            log.genitourinaryData?.stoneSize || '',
            log.genitourinaryData?.procedureRecent || '',
            log.genitourinaryData?.dialysis ? 'Yes' : '',
            log.genitourinaryData?.dialysisType || '',
            log.genitourinaryData?.urinaryFrequency24h || '',
            log.genitourinaryData?.nocturiaCount || '',
            log.genitourinaryData?.incontinenceEpisode ? 'Yes' : '',
            log.genitourinaryData?.incontinenceType || '',
            log.genitourinaryData?.padChangesRequired || '',
            log.genitourinaryData?.catheterUse ? 'Yes' : '',
            log.genitourinaryData?.catheterType || '',
            log.genitourinaryData?.utiSymptoms?.join('; ') || '',
            log.genitourinaryData?.prostateScore || '',
            log.genitourinaryData?.prostateMedications?.join('; ') || '',
            log.genitourinaryData?.fecalIncontinenceEpisode ? 'Yes' : '',
            log.genitourinaryData?.fecalIncontinenceFrequency || '',
            log.genitourinaryData?.bowelControlMethods?.join('; ') || '',
            log.genitourinaryData?.erectileDysfunction ? 'Yes' : '',
            log.genitourinaryData?.edSeverity || '',
            log.genitourinaryData?.testicularSymptoms?.join('; ') || '',
            log.genitourinaryData?.activitiesAffected?.join('; ') || '',
            // Phase 4: Gynecological fields
            log.gynecologicalData?.affectedOrgan || '',
            log.gynecologicalData?.painType || '',
            log.gynecologicalData?.painLocation || '',
            log.gynecologicalData?.endometriosisDiagnosed ? 'Yes' : '',
            log.gynecologicalData?.laparoscopyConfirmed ? 'Yes' : '',
            log.gynecologicalData?.treatmentEffectiveness || '',
            log.gynecologicalData?.cycleRegularity || '',
            log.gynecologicalData?.flowHeaviness || '',
            log.gynecologicalData?.dysmenorrheaSeverity || '',
            log.gynecologicalData?.pcosDiagnosed ? 'Yes' : '',
            log.gynecologicalData?.pidDiagnosed ? 'Yes' : '',
            log.gynecologicalData?.prolapseDiagnosed ? 'Yes' : '',
            log.gynecologicalData?.prolapseType || '',
            log.gynecologicalData?.popStage || '',
            log.gynecologicalData?.continuousTreatmentRequired ? 'Yes' : '',
            log.gynecologicalData?.workMissed ? 'Yes' : '',
            // Phase 5: Hemic/Lymphatic data
            log.anemiaData?.['anemia_type'] || '',
            log.anemiaData?.treatment?.includes('iv-infusion') ? 'Yes' : '',
            log.anemiaData?.treatment?.includes('oral-supplements') ? 'Yes' : '',
            log.anemiaData?.treatment?.includes('b12-injection') ? 'Yes' : '',
            log.anemiaData?.['neurological_symptoms']?.join(', ') || '',
            log.bleedingDisorderData?.['disorder_type'] || '',
            log.bleedingDisorderData?.['platelet_count'] || '',
            log.bleedingDisorderData?.['bleeding_site']?.join(', ') || '',
            log.bleedingDisorderData?.treatment?.join(', ') || '',
            log.polycythemiaData?.diagnosis || '',
            log.polycythemiaData?.medications?.includes('phlebotomy') ? 'Yes' : '',
            log.polycythemiaData?.medications?.filter(m => m.includes('continuous')).join(', ') || '',
            log.polycythemiaData?.medications?.includes('jakafi-continuous') ? 'Yes' : '',
            log.lymphomaLeukemiaData?.diagnosis || '',
            log.lymphomaLeukemiaData?.['treatment_status'] || '',
            log.lymphomaLeukemiaData?.['treatment_type']?.join(', ') || '',
            log.lymphomaLeukemiaData?.['side_effects']?.join(', ') || '',
            log.sickleCellData?.['crisis_type'] || '',
            log.sickleCellData?.['crisis_location']?.join(', ') || '',
            log.sickleCellData?.['hospitalization_required'] === true ? 'Yes' : '',
            log.sickleCellData?.['organ_damage']?.join(', ') || '',
            // Phase 6: HIV/AIDS data
            log.hivData?.infectionType || '',
            log.hivData?.constitutionalSymptoms?.join('; ') || '',
            log.hivData?.weightLossPercentage || '',
            log.hivData?.onAntiretrovirals ? 'Yes' : '',
            log.hivData?.cd4CountKnown ? 'Yes' : '',
            log.hivData?.cd4Range || '',
            log.hivData?.treatmentCompliance || '',
            // Phase 6: Hepatitis B/C data
            log.hepatitisData?.weightLossPercentage || '',
            log.hepatitisData?.debilitating ? 'Yes' : '',
            log.hepatitisData?.dietaryRestrictions ? 'Yes' : '',
            log.hepatitisData?.symptomFrequency || '',
            // Phase 6: Lyme Disease data
            log.lymeData?.activeTreatment ? 'Yes' : '',
            log.lymeData?.treatmentCompleted ? 'Yes' : '',
            log.lymeData?.treatmentStartDate || log.lymeData?.treatmentCompletionDate || '',
            log.lymeData?.rashPresent ? 'Yes' : '',
            log.lymeData?.rashType || '',
            log.lymeData?.neurologicalSymptoms?.join('; ') || '',
            log.lymeData?.jointSymptoms?.join('; ') || '',
            // Phase 6: Malaria data
            log.malariaData?.relapseEpisode ? 'Yes' : '',
            log.malariaData?.cyclicalPattern ? 'Yes' : '',
            log.malariaData?.feverTemperature || '',
            log.malariaData?.hospitalized ? 'Yes' : '',
            log.malariaData?.severeComplications ? 'Yes' : '',
            log.malariaData?.continuousMedication ? 'Yes' : '',
            // Phase 6: Brucellosis data
            log.brucellosisData?.relapseEpisode ? 'Yes' : '',
            log.brucellosisData?.undulantFever ? 'Yes' : '',
            log.brucellosisData?.chronicArthritis ? 'Yes' : '',
            log.brucellosisData?.multiOrganInvolvement ? 'Yes' : '',
            log.brucellosisData?.neurobrucellosis ? 'Yes' : '',
            // Phase 6: Campylobacter data
            log.campylobacterData?.guillainBarre ? 'Yes' : '',
            log.campylobacterData?.reactiveArthritis ? 'Yes' : '',
            log.campylobacterData?.chronicIBS ? 'Yes' : '',
            log.campylobacterData?.stoolCultureConfirmed ? 'Yes' : '',
            log.campylobacterData?.weeksSinceInfection || '',
            // Phase 6: Q Fever data
            log.qFeverData?.chronicQFever ? 'Yes' : '',
            log.qFeverData?.endocarditis ? 'Yes' : '',
            log.qFeverData?.fatigueSyndrome ? 'Yes' : '',
            log.qFeverData?.phaseIAntibodies ? 'Yes' : '',
            log.qFeverData?.monthsSinceInfection || '',
            // Phase 6: Salmonella data
            log.salmonellaData?.hospitalized ? 'Yes' : '',
            log.salmonellaData?.bacteremia ? 'Yes' : '',
            log.salmonellaData?.reactiveArthritis ? 'Yes' : '',
            log.salmonellaData?.severeComplications ? 'Yes' : '',
            log.salmonellaData?.stoolCultureConfirmed ? 'Yes' : '',
            // Phase 6: Shigella data
            log.shigellaData?.hospitalized ? 'Yes' : '',
            log.shigellaData?.hus ? 'Yes' : '',
            log.shigellaData?.reactiveArthritis ? 'Yes' : '',
            log.shigellaData?.severeComplications ? 'Yes' : '',
            log.shigellaData?.stoolCultureConfirmed ? 'Yes' : '',
            // Phase 6: West Nile data
            log.westNileData?.neuroinvasive ? 'Yes' : '',
            log.westNileData?.encephalitis ? 'Yes' : '',
            log.westNileData?.acuteFlaccidParalysis ? 'Yes' : '',
            log.westNileData?.permanentImpairment ? 'Yes' : '',
            log.westNileData?.serologyConfirmed ? 'Yes' : '',
            // Phase 6: NTM data
            log.ntmData?.activeDisease ? 'Yes' : '',
            log.ntmData?.onTreatment ? 'Yes' : '',
            log.ntmData?.disseminated ? 'Yes' : '',
            log.ntmData?.monthsOnTreatment || '',
            log.ntmData?.ntmSpecies || '',
            // Phase 7: Dental/Oral data
            log.dentalData?.jawPainSeverity || '',
            log.dentalData?.jawOpening || '',
            log.dentalData?.chewingDifficulty || '',
            log.dentalData?.dietaryRestrictions || '',
            log.dentalData?.toothCount || '',
            log.dentalData?.prosthesisType || '',
            log.dentalData?.boneCondition || '',
            log.dentalData?.palateSymptoms?.join('; ') || '',
            log.dentalData?.swallowingDifficulty || '',
            log.dentalData?.oralMass ? 'Yes' : '',
            log.dentalData?.massLocation || '',
            log.dentalData?.massBiopsy || '',
            log.dentalData?.infection ? 'Yes' : '',
            log.dentalData?.infectionType || '',
            log.dentalData?.speakingDifficulty ? 'Yes' : '',
            log.dentalData?.painWithEating ? 'Yes' : '',
            log.dentalData?.workMissed ? 'Yes' : '',
            // Anxiety Form Data (22 columns)
            log.anxietyData?.heartRacing ? 'Yes' : '',
            log.anxietyData?.sweating ? 'Yes' : '',
            log.anxietyData?.trembling ? 'Yes' : '',
            log.anxietyData?.shortnessOfBreath ? 'Yes' : '',
            log.anxietyData?.chestTightness ? 'Yes' : '',
            log.anxietyData?.nausea ? 'Yes' : '',
            log.anxietyData?.dizziness ? 'Yes' : '',
            log.anxietyData?.hotFlashes ? 'Yes' : '',
            log.anxietyData?.numbnessTingling ? 'Yes' : '',
            log.anxietyData?.racingThoughts ? 'Yes' : '',
            log.anxietyData?.fearOfLosingControl ? 'Yes' : '',
            log.anxietyData?.fearOfDying ? 'Yes' : '',
            log.anxietyData?.feelingDetached ? 'Yes' : '',
            log.anxietyData?.difficultyConcentrating ? 'Yes' : '',
            log.anxietyData?.avoidedSocial ? 'Yes' : '',
            log.anxietyData?.leftEarly ? 'Yes' : '',
            log.anxietyData?.calledOut ? 'Yes' : '',
            log.anxietyData?.cancelledPlans ? 'Yes' : '',
            log.anxietyData?.neededSafetyPerson ? 'Yes' : '',
            log.anxietyData?.episodeDuration || '',
            log.anxietyData?.wasPanicAttack ? 'Yes' : '',
            log.anxietyData?.trigger || '',

            // Depression Form Data (25 columns)
            log.depressionData?.depressedMood ? 'Yes' : '',
            log.depressionData?.anhedonia ? 'Yes' : '',
            log.depressionData?.worthlessness ? 'Yes' : '',
            log.depressionData?.excessiveGuilt ? 'Yes' : '',
            log.depressionData?.hopelessness ? 'Yes' : '',
            log.depressionData?.irritability ? 'Yes' : '',
            log.depressionData?.insomnia ? 'Yes' : '',
            log.depressionData?.hypersomnia ? 'Yes' : '',
            log.depressionData?.decreasedAppetite ? 'Yes' : '',
            log.depressionData?.increasedAppetite ? 'Yes' : '',
            log.depressionData?.fatigue ? 'Yes' : '',
            log.depressionData?.psychomotorAgitation ? 'Yes' : '',
            log.depressionData?.psychomotorRetardation ? 'Yes' : '',
            log.depressionData?.difficultyConcentrating ? 'Yes' : '',
            log.depressionData?.difficultyDeciding ? 'Yes' : '',
            log.depressionData?.memoryProblems ? 'Yes' : '',
            log.depressionData?.thoughtsOfDeath ? 'Yes' : '',
            log.depressionData?.unableToGetUp ? 'Yes' : '',
            log.depressionData?.calledOutWork ? 'Yes' : '',
            log.depressionData?.neglectedSelfCare ? 'Yes' : '',
            log.depressionData?.socialWithdrawal ? 'Yes' : '',
            log.depressionData?.unableToCompleteTasks ? 'Yes' : '',
            log.depressionData?.suicidalIdeation ? 'Yes' : '',
            log.depressionData?.trigger || '',
            log.depressionData?.episodeContext || '',

            // Bipolar Form Data (22 columns)
            log.bipolarData?.episodeType || '',
            log.bipolarData?.elevatedMood ? 'Yes' : '',
            log.bipolarData?.irritableMood ? 'Yes' : '',
            log.bipolarData?.increasedEnergy ? 'Yes' : '',
            log.bipolarData?.decreasedSleep ? 'Yes' : '',
            log.bipolarData?.moreTalkative ? 'Yes' : '',
            log.bipolarData?.racingThoughts ? 'Yes' : '',
            log.bipolarData?.distractibility ? 'Yes' : '',
            log.bipolarData?.increasedActivity ? 'Yes' : '',
            log.bipolarData?.riskyBehavior ? 'Yes' : '',
            log.bipolarData?.grandiosity ? 'Yes' : '',
            log.bipolarData?.depressedMood ? 'Yes' : '',
            log.bipolarData?.anhedonia ? 'Yes' : '',
            log.bipolarData?.fatigue ? 'Yes' : '',
            log.bipolarData?.worthlessness ? 'Yes' : '',
            log.bipolarData?.sleepHours || '',
            log.bipolarData?.riskyBehaviors?.join('; ') || '',
            log.bipolarData?.unableToWork ? 'Yes' : '',
            log.bipolarData?.relationshipConflicts ? 'Yes' : '',
            log.bipolarData?.legalProblems ? 'Yes' : '',
            log.bipolarData?.hospitalizationRequired ? 'Yes' : '',
            log.bipolarData?.episodeDuration || '',

            // OCD Form Data (23 columns)
            log.ocdData?.contaminationFears ? 'Yes' : '',
            log.ocdData?.fearOfHarm ? 'Yes' : '',
            log.ocdData?.needForSymmetry ? 'Yes' : '',
            log.ocdData?.forbiddenThoughts ? 'Yes' : '',
            log.ocdData?.religiousObsessions ? 'Yes' : '',
            log.ocdData?.hoardingUrges ? 'Yes' : '',
            log.ocdData?.otherObsession || '',
            log.ocdData?.washingCleaning ? 'Yes' : '',
            log.ocdData?.checking ? 'Yes' : '',
            log.ocdData?.repeating ? 'Yes' : '',
            log.ocdData?.counting ? 'Yes' : '',
            log.ocdData?.ordering ? 'Yes' : '',
            log.ocdData?.mentalRituals ? 'Yes' : '',
            log.ocdData?.reassuranceSeeking ? 'Yes' : '',
            log.ocdData?.otherCompulsion || '',
            log.ocdData?.timeConsumed || '',
            log.ocdData?.distressLevel !== undefined ? log.ocdData.distressLevel.toString() : '',
            log.ocdData?.lateToAppointments ? 'Yes' : '',
            log.ocdData?.avoidedSituations ? 'Yes' : '',
            log.ocdData?.interferedRoutines ? 'Yes' : '',
            log.ocdData?.relationshipProblems ? 'Yes' : '',
            log.ocdData?.unableToComplete ? 'Yes' : '',
            log.ocdData?.trigger || '',
            // Adjustment Disorder Form Data (19 columns)
            log.adjustmentDisorderData?.stressor || '',
            log.adjustmentDisorderData?.stressorDate || '',
            log.adjustmentDisorderData?.daysSinceStressor || '',
            log.adjustmentDisorderData?.presentationType || '',
            log.adjustmentDisorderData?.tearfulness ? 'Yes' : '',
            log.adjustmentDisorderData?.hopelessness ? 'Yes' : '',
            log.adjustmentDisorderData?.worry ? 'Yes' : '',
            log.adjustmentDisorderData?.physicalTension ? 'Yes' : '',
            log.adjustmentDisorderData?.impulsiveBehaviors ? 'Yes' : '',
            log.adjustmentDisorderData?.aggression ? 'Yes' : '',
            log.adjustmentDisorderData?.ruleViolations ? 'Yes' : '',
            log.adjustmentDisorderData?.recklessBehavior ? 'Yes' : '',
            log.adjustmentDisorderData?.workDifficulty ? 'Yes' : '',
            log.adjustmentDisorderData?.relationshipProblems ? 'Yes' : '',
            log.adjustmentDisorderData?.socialWithdrawal ? 'Yes' : '',
            log.adjustmentDisorderData?.selfCareNeglect ? 'Yes' : '',
            log.adjustmentDisorderData?.unableToFulfillResponsibilities ? 'Yes' : '',
            log.adjustmentDisorderData?.symptomsImproving === true ? 'Yes' :
                log.adjustmentDisorderData?.symptomsImproving === false ? 'No' :
                    log.adjustmentDisorderData?.symptomsImproving === null ? 'Unsure' : '',
            log.adjustmentDisorderData?.stillAffectingFunctioning === true ? 'Yes' :
                log.adjustmentDisorderData?.stillAffectingFunctioning === false ? 'No' :
                    log.adjustmentDisorderData?.stillAffectingFunctioning === null ? 'Somewhat' : '',
            log.adjustmentDisorderData?.context || '',
            // Phase 8B: Additional Mental Health data
            log.bingeEatingData?.bingeEpisode ? 'Yes' : '',
            log.bingeEatingData?.lossOfControl ? 'Yes' : '',
            log.bingeEatingData?.distressLevel || '',
            log.dissociativeData?.memoryGap ? 'Yes' : '',
            log.dissociativeData?.lostTime ? 'Yes' : '',
            log.dissociativeData?.duration || '',
            log.acuteStressData?.traumaDate || '',
            log.acuteStressData?.dissociativeSymptoms ? 'Yes' : '',
            log.acuteStressData?.avoidance ? 'Yes' : '',
            log.personalityData?.occupationalImpact ? 'Yes' : '',
            log.personalityData?.socialImpact ? 'Yes' : '',
            // Phase 9: Cardiovascular
            log.cardiovascularData?.activityLevel || '',
            log.cardiovascularData?.atRest ? 'Yes' : '',
            log.cardiovascularData?.withExertion ? 'Yes' : '',
            log.cardiovascularData?.treatmentRequired || '',
            log.cardiovascularData?.hospitalized ? 'Yes' : '',
            log.cardiovascularData?.hasAICD ? 'Yes' : '',
            log.cardiovascularData?.aicdShockDelivered ? 'Yes' : '',
            log.cardiovascularData?.activeInfection ? 'Yes' : '',
            log.cardiovascularData?.painWorseWithBreathing ? 'Yes' : '',
            log.cardiovascularData?.painReliefLeaningForward ? 'Yes' : '',
            log.cardiovascularData?.affectedLeg || '',
            log.cardiovascularData?.compressionUsed ? 'Yes' : '',
            log.cardiovascularData?.elevationHelps ? 'Yes' : '',
            // Phase 10: Digestive data
            log.digestiveData?.hasAscites ? 'Yes' : '',
            log.digestiveData?.ascitesSeverity || '',
            log.digestiveData?.hasEncephalopathy ? 'Yes' : '',
            log.digestiveData?.hasVaricealBleed ? 'Yes' : '',
            log.digestiveData?.onLactulose ? 'Yes' : '',
            log.digestiveData?.episodeDuration || '',
            log.digestiveData?.onDailyMedication ? 'Yes' : '',
            log.digestiveData?.hasGIBleeding ? 'Yes' : '',
            log.digestiveData?.onEnzymes ? 'Yes' : '',
            log.digestiveData?.hasMaldigestion ? 'Yes' : '',
            log.digestiveData?.hasDietaryRestriction ? 'Yes' : '',
            log.digestiveData?.attackWithNausea ? 'Yes' : '',
            log.digestiveData?.attackWithVomiting ? 'Yes' : '',
            log.digestiveData?.hadStrictureDilation ? 'Yes' : '',
            log.digestiveData?.hospitalized ? 'Yes' : '',
            // Phase 1A: Neurological data
            log.multipleSclerosisData?.isRelapse ? 'Yes' : '',
            log.multipleSclerosisData?.relapseDuration || '',
            log.multipleSclerosisData?.relapseRecovery || '',
            log.multipleSclerosisData?.mobilityAid || '',
            log.multipleSclerosisData?.assistanceNeeded ? 'Yes' : '',
            log.multipleSclerosisData?.onDMT ? 'Yes' : '',
            log.multipleSclerosisData?.recentSteroids ? 'Yes' : '',
            log.multipleSclerosisData?.heatTriggered ? 'Yes' : '',
            log.parkinsonsData?.tremorSide || '',
            log.parkinsonsData?.tremorSeverity || '',
            log.parkinsonsData?.freezingEpisodes || '',
            log.parkinsonsData?.fallsToday || '',
            log.parkinsonsData?.medicationState || '',
            log.parkinsonsData?.mobilityAid || '',
            log.parkinsonsData?.speechAffected ? 'Yes' : '',
            log.parkinsonsData?.swallowingAffected ? 'Yes' : '',
            log.parkinsonsData?.hallucinationsPresent ? 'Yes' : '',
            log.parkinsonsData?.confusionPresent ? 'Yes' : '',
            log.myastheniaData?.worseWithActivity ? 'Yes' : '',
            log.myastheniaData?.betterWithRest ? 'Yes' : '',
            log.myastheniaData?.timeOfDayWorst || '',
            log.myastheniaData?.ptosisPresent ? 'Yes' : '',
            log.myastheniaData?.ptosisSide || '',
            log.myastheniaData?.doubleVision ? 'Yes' : '',
            log.myastheniaData?.canRaiseArms || '',
            log.myastheniaData?.breathingDifficulty ? 'Yes' : '',
            log.myastheniaData?.emergencySigns ? 'Yes' : '',
            log.myastheniaData?.onPyridostigmine ? 'Yes' : '',
            // Phase 1B: Narcolepsy data
            log.narcolepsyData?.sleepAttackDuration || '',
            log.narcolepsyData?.sleepAttackTrigger || '',
            log.narcolepsyData?.cataplexyTrigger || '',
            log.narcolepsyData?.cataplexyAffected || '',
            log.narcolepsyData?.fellDuringCataplexy ? 'Yes' : '',
            log.narcolepsyData?.onStimulants ? 'Yes' : '',
            log.narcolepsyData?.sleepStudyConfirmed ? 'Yes' : '',
            // Phase 1B: ALS data
            log.alsData?.weaknessLocation || '',
            log.alsData?.weaknessSide || '',
            log.alsData?.speechClarity || '',
            log.alsData?.swallowingSolids || '',
            log.alsData?.swallowingLiquids || '',
            log.alsData?.breathingDifficulty || '',
            log.alsData?.usesBiPAP ? 'Yes' : '',
            log.alsData?.usesVentilator ? 'Yes' : '',
            log.alsData?.usesFeedingTube ? 'Yes' : '',
            log.alsData?.mobilityStatus || '',
            // Phase 1B: Syringomyelia data
            log.syringomyeliaData?.painType || '',
            log.syringomyeliaData?.painLocation || '',
            log.syringomyeliaData?.sensoryLossPattern || '',
            log.syringomyeliaData?.hadBurnInjury ? 'Yes' : '',
            log.syringomyeliaData?.hadCutInjury ? 'Yes' : '',
            log.syringomyeliaData?.syrinxLocation || '',
            // Phase 1B: Myelitis data
            log.myelitisData?.weaknessDistribution || '',
            log.myelitisData?.sensoryLevel || '',
            log.myelitisData?.bladderSymptoms || '',
            log.myelitisData?.usesCatheter ? 'Yes' : '',
            log.myelitisData?.bowelSymptoms || '',
            log.myelitisData?.mobilityStatus || '',
            log.myelitisData?.causeOfMyelitis || '',
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
        'somatic-symptom-disorder': analyzeSomaticSymptomDisorderLogs,
        'other-specified-somatic': analyzeOtherSpecifiedSomaticLogs,
        'unspecified-somatic': analyzeUnspecifiedSomaticLogs,
        'illness-anxiety': analyzeIllnessAnxietyLogs,
        'other-specified-anxiety': analyzeOtherSpecifiedAnxietyLogs,
        'depersonalization-derealization': analyzeDepersonalizationLogs,
        'cyclothymic': analyzeCyclothymicLogs,
        'anorexia-nervosa': analyzeAnorexiaNervosaLogs,
        'bulimia-nervosa': analyzeBulimiaNervosaLogs,
        'vision-loss': analyzeVisionLogs,
        // Phase 3: Genitourinary
        'kidney-stones': analyzeKidneyStonesLogs,
        'chronic-renal-disease': analyzeChronicRenalDiseaseLogs,
        'chronic-cystitis': analyzeVoidingDysfunctionLogs,
        'neurogenic-bladder': analyzeVoidingDysfunctionLogs,
        'prostate-conditions': analyzeVoidingDysfunctionLogs,
        'urethral-stricture': analyzeVoidingDysfunctionLogs,
        'sphincter-impairment': analyzeSphincterImpairmentLogs,
        'erectile-dysfunction': analyzeErectileDysfunctionLogs,
        // Phase 4: Gynecological
        'endometriosis': analyzeEndometriosisLogs,
        'vulva-clitoris-disease': analyzeFemaleReproductiveOrgansLogs,
        'vagina-disease': analyzeFemaleReproductiveOrgansLogs,
        'cervix-disease': analyzeFemaleReproductiveOrgansLogs,
        'uterus-disease': analyzeFemaleReproductiveOrgansLogs,
        'fallopian-tube-pid': analyzeFemaleReproductiveOrgansLogs,
        'ovary-disease': analyzeFemaleReproductiveOrgansLogs,
        'pelvic-prolapse': analyzePelvicProlapseLogs,
        'female-sexual-arousal-disorder': analyzeFemaleArousalDisorderLogs,
        // Phase 5: Hemic/Lymphatic
        'iron-deficiency-anemia': analyzeIronDeficiencyAnemiaLogs,
        'folate-deficiency-anemia': analyzeFolateDeficiencyAnemiaLogs,
        'pernicious-anemia': analyzePerniciousAnemiaLogs,
        'hemolytic-anemia': analyzeHemolyticAnemiaLogs,
        'sickle-cell-anemia': analyzeSickleCellAnemiaLogs,
        'aplastic-anemia': analyzeAplasticAnemiaLogs,
        'polycythemia-vera': analyzePolycythemiaVeraLogs,
        'immune-thrombocytopenia': analyzeImmuneThrombocytopeniaLogs,
        'leukemia': analyzeLeukemiaLogs,
        'hodgkins-lymphoma': analyzeHodgkinsLymphomaLogs,
        'multiple-myeloma': analyzeMultipleMyelomaLogs,
        'non-hodgkins-lymphoma': analyzeNonHodgkinsLymphomaLogs,
        'essential-thrombocythemia': analyzeMyeloproliferative7718Logs,
        'chronic-myelogenous-leukemia': analyzeChronicMyelogenousLeukemiaLogs,
        'solitary-plasmacytoma': analyzeSolitaryPlasmacytomaLogs,
        'myelodysplastic-syndromes': analyzeMyelodysplasticSyndromesLogs,
        'hiv-aids': analyzeHIVLogs,
        'hepatitis-c': analyzeHepatitisCLogs,
        'hepatitis-b': analyzeHepatitisBLogs,
        'lyme-disease': analyzeLymeDiseaseLogs,
        'malaria': analyzeMalariaLogs,
        'brucellosis': analyzeBrucellosisLogs,
        'campylobacter': analyzeCampylobacterLogs,
        'q-fever': analyzeQFeverLogs,
        'salmonella': analyzeSalmonellaLogs,
        'shigella': analyzeShigellaLogs,
        'west-nile': analyzeWestNileLogs,
        'ntm': analyzeNTMLogs,
        // Phase 9: Cardiovascular
        'cardiomyopathy': analyzeCardiomyopathyLogs,
        'svt': analyzeSVTLogs,
        'ventricular-arrhythmia': analyzeVentricularArrhythmiaLogs,
        'pericarditis': analyzePericarditisLogs,
        'post-phlebitic': analyzePostPhlebiticLogs,
        'cirrhosis': analyzeCirrhosisLogs,
        'gastritis': analyzeGastritisLogs,
        'pancreatitis': analyzePancreatitisLogs,
        'biliaryTract': analyzeBiliaryTractLogs,
        // Phase 1A: Neurological Conditions
        'multiple-sclerosis': analyzeMultipleSclerosisLogs,
        'parkinsons-disease': analyzeParkinsonsDiseaseLogs,
        'myasthenia-gravis': analyzeMyastheniaGravisLogs,
        // Phase 1B: Additional Neurological
        'narcolepsy': analyzeNarcolepsyLogs,
        'als': analyzeALSLogs,
        'syringomyelia': analyzeSyringomyeliaLogs,
        'myelitis': analyzeMyelitisLogs,
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
            } else if (conditionId === 'hypertension' || conditionId === 'diabetes' || conditionId === 'asthma' || conditionId === 'chronic-renal-disease') {
                // These need measurements - will be handled by the function itself
                result = analyzeFunc(logs, { evaluationPeriodDays });
            } else {
                result = analyzeFunc(logs, { evaluationPeriodDays });
            }

            // Only include conditions with actual data
            if (result && result.hasData && result.supportedRating !== null) {
              // Debug: check if condition field is missing
              if (!result.condition) {
                console.warn(`⚠️ Analysis function for '${conditionId}' is missing 'condition' field in return value`);
              }

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

        // Safety check: ensure both conditions exist before comparing
        const conditionA = a.condition || 'Unknown Condition';
        const conditionB = b.condition || 'Unknown Condition';
        return conditionA.localeCompare(conditionB);
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

      const detailData = logs.map(log => {
        const linkedMeds = getMedicationLogsForSymptom(log.id);
        const backDatedTag = isBackDated(log) ? ' [BACK-DATED]' : '';
        let notes = log.notes || '-';

        // Phase 1A: Add universal fields first
        const universalInfo = [];
        if (log.isFlareUp) universalInfo.push('🔥 FLARE-UP');
        if (log.duration) universalInfo.push(formatDuration(log.duration));
        if (log.timeOfDay) universalInfo.push(formatTimeOfDay(log.timeOfDay));
        if (universalInfo.length > 0) {
          notes = universalInfo.join(' | ') + (notes !== '-' ? ` | ${notes}` : '');
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

        // Phase 11: Add respiratory details
        if (log.respiratoryData) {
          const respInfo = [];
          if (log.respiratoryData.spo2) respInfo.push(`SpO₂: ${log.respiratoryData.spo2}%`);
          if (log.respiratoryData.peakFlow) respInfo.push(`Peak Flow: ${log.respiratoryData.peakFlow} L/min`);
          if (log.respiratoryData.rescueInhalerUsed) respInfo.push(`RESCUE INHALER${log.respiratoryData.inhalerPuffs ? ` (${log.respiratoryData.inhalerPuffs} puffs)` : ''}`);
          if (log.respiratoryData.activityTrigger) respInfo.push(`Trigger: ${log.respiratoryData.activityTrigger}`);
          if (log.respiratoryData.wheezing) respInfo.push('Wheezing');
          if (log.respiratoryData.chestTightness) respInfo.push('Chest tightness');
          if (log.respiratoryData.coughing) respInfo.push('Coughing');
          if (respInfo.length > 0) {
            notes = respInfo.join(', ') + (notes !== '-' ? ` | ${notes}` : '');
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
            notes = migraineInfo.join(', ') + (notes !== '-' ? ` | ${notes}` : '');
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
            notes = sleepInfo.join(', ') + (notes !== '-' ? ` | ${notes}` : '');
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
            notes = ptsdInfo.join(', ') + (notes !== '-' ? ` | ${notes}` : '');
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
            notes = painInfo.join(', ') + (notes !== '-' ? ` | ${notes}` : '');
          }
        }

        // Phase 1E: Add seizure details
        if (log.seizureData) {
          const seizureInfo = [];
          if (log.seizureData.episodeType) {
            const typeMap = {
              generalized: 'Grand Mal',
              partial: 'Partial/Focal',
              absence: 'Petit Mal',
              psychogenic: 'Psychogenic',
              other: 'Other'
            };
            seizureInfo.push(typeMap[log.seizureData.episodeType] || log.seizureData.episodeType);
          }
          if (log.seizureData.duration) seizureInfo.push(`${log.seizureData.duration}sec`);
          if (log.seizureData.lossOfConsciousness === 'yes') seizureInfo.push('LOC');
          else if (log.seizureData.lossOfConsciousness === 'partial') seizureInfo.push('Partial LOC');
          if (log.seizureData.auraPresent) seizureInfo.push('Aura');
          if (log.seizureData.witnessPresent) seizureInfo.push('WITNESSED');
          if (log.seizureData.recoveryTime) seizureInfo.push(`Recovery: ${log.seizureData.recoveryTime}`);
          if (seizureInfo.length > 0) {
            notes = seizureInfo.join(', ') + (notes !== '-' ? ` | ${notes}` : '');
          }
        }

        // Phase 2: Add eye/vision details
        if (log.eyeData) {
          const eyeInfo = [];

          // Affected eye
          if (log.eyeData.affectedEye) {
            const eyeMap = { left: 'Left eye', right: 'Right eye', both: 'Both eyes' };
            eyeInfo.push(eyeMap[log.eyeData.affectedEye] || log.eyeData.affectedEye);
          }

          // Visual acuity
          if (log.eyeData.leftEyeAcuity || log.eyeData.rightEyeAcuity) {
            const acuityInfo = [];
            if (log.eyeData.leftEyeAcuity) acuityInfo.push(`L: ${log.eyeData.leftEyeAcuity}`);
            if (log.eyeData.rightEyeAcuity) acuityInfo.push(`R: ${log.eyeData.rightEyeAcuity}`);
            eyeInfo.push(acuityInfo.join(', '));
          }

          // Symptoms
          if (log.eyeData.symptoms && log.eyeData.symptoms.length > 0) {
            eyeInfo.push(`Symptoms: ${log.eyeData.symptoms.join(', ')}`);
          }

          // Field of vision
          if (log.eyeData.fieldOfVision && log.eyeData.fieldOfVision.length > 0) {
            eyeInfo.push(`Field: ${log.eyeData.fieldOfVision.join(', ')}`);
          }

          // Activities affected
          if (log.eyeData.affectedActivities && log.eyeData.affectedActivities.length > 0) {
            eyeInfo.push(`Affects: ${log.eyeData.affectedActivities.join(', ')}`);
          }

          // Triggers
          if (log.eyeData.triggeringFactors) {
            eyeInfo.push(`Triggers: ${log.eyeData.triggeringFactors}`);
          }

          // Associated conditions
          if (log.eyeData.associatedConditions && log.eyeData.associatedConditions.length > 0) {
            eyeInfo.push(`Related: ${log.eyeData.associatedConditions.join(', ')}`);
          }

          if (eyeInfo.length > 0) {
            notes = eyeInfo.join(' | ') + (notes !== '-' ? ` | ${notes}` : '');
          }
        }

        // Phase 3: Add genitourinary details
        if (log.genitourinaryData) {
          const guInfo = [];
          const gd = log.genitourinaryData;

          // System affected
          if (gd.affectedSystem) {
            const systemMap = {
              kidney: 'Kidney/Renal',
              bladder: 'Bladder/Voiding',
              prostate: 'Prostate',
              reproductive: 'Reproductive',
              sphincter: 'Sphincter/Bowel'
            };
            guInfo.push(systemMap[gd.affectedSystem] || gd.affectedSystem);
          }

          // Kidney-specific
          if (gd.affectedSystem === 'kidney') {
            if (gd.stoneEpisode) guInfo.push('Stone episode');
            if (gd.stonePassedToday) guInfo.push(`Stone passed${gd.stoneSize ? ` (${gd.stoneSize}mm)` : ''}`);
            if (gd.procedureRecent && gd.procedureRecent !== 'none') {
              guInfo.push(`Procedure: ${gd.procedureRecent}`);
            }
            if (gd.dialysis) {
              guInfo.push(`Dialysis: ${gd.dialysisType || 'yes'}${gd.dialysisFrequency ? ` (${gd.dialysisFrequency})` : ''}`);
            }
            if (gd.kidneyPainLocation) guInfo.push(`Pain: ${gd.kidneyPainLocation}`);
          }

          // Bladder/Voiding-specific
          if (gd.affectedSystem === 'bladder') {
            if (gd.urinaryFrequency24h) guInfo.push(`Freq: ${gd.urinaryFrequency24h}/day`);
            if (gd.nocturiaCount) guInfo.push(`Nocturia: ${gd.nocturiaCount}x/night`);
            if (gd.incontinenceEpisode) {
              guInfo.push(`Incontinence: ${gd.incontinenceType || 'yes'}${gd.padChangesRequired ? ` (${gd.padChangesRequired} pads)` : ''}`);
            }
            if (gd.catheterUse) guInfo.push(`Catheter: ${gd.catheterType || 'yes'}`);
            if (gd.uti) guInfo.push('UTI symptoms');
          }

          // Prostate-specific
          if (gd.affectedSystem === 'prostate') {
            if (gd.prostateScore) guInfo.push(`IPSS: ${gd.prostateScore}`);
            if (gd.nocturiaCount) guInfo.push(`Nocturia: ${gd.nocturiaCount}x/night`);
            if (gd.prostateMedications && gd.prostateMedications.length > 0) {
              guInfo.push(`Meds: ${gd.prostateMedications.join(', ')}`);
            }
          }

          // Sphincter-specific
          if (gd.affectedSystem === 'sphincter') {
            if (gd.fecalIncontinenceEpisode) {
              guInfo.push(`Incontinence: ${gd.fecalIncontinenceType || 'yes'}${gd.fecalIncontinenceFrequency ? ` (${gd.fecalIncontinenceFrequency})` : ''}`);
            }
            if (gd.fecalUrgency) guInfo.push('Urgency');
          }

          // Reproductive-specific
          if (gd.affectedSystem === 'reproductive') {
            if (gd.erectileDysfunction) guInfo.push(`ED: ${gd.edSeverity || 'yes'}`);
            if (gd.testicular && gd.testicularSymptoms && gd.testicularSymptoms.length > 0) {
              guInfo.push(`Testicular: ${gd.testicularSymptoms.join(', ')}`);
            }
          }

          // Common fields
          if (gd.activitiesAffected && gd.activitiesAffected.length > 0) {
            guInfo.push(`Affects: ${gd.activitiesAffected.join(', ')}`);
          }
          if (gd.fluidRestriction) guInfo.push('Limiting fluids');
          if (gd.workMissed) guInfo.push('Work missed');

          if (guInfo.length > 0) {
            notes = guInfo.join(' | ') + (notes !== '-' ? ` | ${notes}` : '');
          }
        }

        // Phase 4: Gynecological data extraction
        if (log.gynecologicalData) {
          const gyneInfo = [];
          const gd = log.gynecologicalData;

          // Affected organ
          if (gd.affectedOrgan) {
            const organMap = {
              'vulva': 'Vulva/Clitoris',
              'vagina': 'Vagina',
              'cervix': 'Cervix',
              'uterus': 'Uterus',
              'fallopian-tube': 'Fallopian Tube',
              'ovary': 'Ovary',
              'multiple': 'Multiple Organs'
            };
            gyneInfo.push(organMap[gd.affectedOrgan] || gd.affectedOrgan);
          }

          // Pain details
          if (gd.painType) {
            const painMap = {
              'chronic-pelvic': 'Chronic Pelvic Pain',
              'dysmenorrhea': 'Menstrual Pain',
              'dyspareunia': 'Pain with Intercourse',
              'ovulation': 'Ovulation Pain'
            };
            gyneInfo.push(painMap[gd.painType] || gd.painType);
          }
          if (gd.painLocation) gyneInfo.push(`Location: ${gd.painLocation}`);

          // Endometriosis
          if (gd.endometriosisDiagnosed) {
            gyneInfo.push('Endometriosis');
            if (gd.laparoscopyConfirmed) gyneInfo.push('Laparoscopy confirmed');
            if (gd.lesionLocations && gd.lesionLocations.length > 0) {
              gyneInfo.push(`Lesions: ${gd.lesionLocations.join(', ')}`);
            }
            if (gd.bowelSymptoms) gyneInfo.push('Bowel symptoms');
            if (gd.bladderSymptoms) gyneInfo.push('Bladder symptoms');
            if (gd.treatmentEffectiveness) {
              gyneInfo.push(`Treatment: ${gd.treatmentEffectiveness.replace(/-/g, ' ')}`);
            }
          }

          // Menstrual/PCOS
          if (gd.cycleRegularity) gyneInfo.push(`Cycle: ${gd.cycleRegularity}`);
          if (gd.flowHeaviness && gd.flowHeaviness !== 'moderate') {
            gyneInfo.push(`Flow: ${gd.flowHeaviness}`);
          }
          if (gd.dysmenorrheaSeverity && gd.dysmenorrheaSeverity !== 'none') {
            gyneInfo.push(`Dysmenorrhea: ${gd.dysmenorrheaSeverity}`);
          }
          if (gd.pcosDiagnosed) gyneInfo.push('PCOS');

          // PID
          if (gd.pidDiagnosed) {
            gyneInfo.push('PID');
            if (gd.pidType) gyneInfo.push(`Type: ${gd.pidType}`);
            if (gd.recurrentInfections) gyneInfo.push('Recurrent infections');
          }

          // Prolapse
          if (gd.prolapseDiagnosed) {
            gyneInfo.push('Pelvic Prolapse');
            if (gd.prolapseType) gyneInfo.push(`Type: ${gd.prolapseType}`);
            if (gd.popStage) gyneInfo.push(`Stage: ${gd.popStage}`);
          }

          // Sexual function
          if (gd.sexualDysfunction || gd.arousalDifficulty || gd.libidoDecreased) {
            gyneInfo.push('FSAD');
          }

          // Treatment/Impact
          if (gd.continuousTreatmentRequired) gyneInfo.push('Continuous treatment required');
          if (gd.interferesDailyActivities) gyneInfo.push('Interferes with activities');
          if (gd.workMissed) gyneInfo.push('Work missed');

          if (gyneInfo.length > 0) {
            notes = gyneInfo.join(' | ') + (notes !== '-' ? ` | ${notes}` : '');
          }
        }

        // Phase 6: HIV/AIDS data extraction
        if (log.hivData) {
          const hivInfo = [];
          const hd = log.hivData;

          if (hd.infectionType) {
            const infectionMap = {
              'pcp': 'PCP Pneumonia',
              'cmv': 'CMV',
              'mac': 'MAC',
              'toxoplasmosis': 'Toxoplasmosis',
              'cryptococcal': 'Cryptococcal Meningitis',
              'kaposi': "Kaposi's Sarcoma",
              'lymphoma': 'Lymphoma',
              'wasting': 'Wasting Syndrome',
              'other': 'Other Opportunistic Infection'
            };
            hivInfo.push(infectionMap[hd.infectionType] || hd.infectionType);
          }
          if (hd.constitutionalSymptoms && hd.constitutionalSymptoms.length > 0) {
            hivInfo.push(`Symptoms: ${hd.constitutionalSymptoms.join(', ')}`);
          }
          if (hd.weightLossPercentage) hivInfo.push(`Weight Loss: ${hd.weightLossPercentage}%`);
          if (hd.onAntiretrovirals) hivInfo.push('On ART');
          if (hd.cd4CountKnown && hd.cd4Range) {
            const cd4Map = {
              'below-200': 'CD4 <200',
              '200-500': 'CD4 200-500',
              'above-500': 'CD4 >500'
            };
            hivInfo.push(cd4Map[hd.cd4Range] || hd.cd4Range);
          }
          if (hd.treatmentCompliance) {
            hivInfo.push(`Compliance: ${hd.treatmentCompliance}`);
          }

          if (hivInfo.length > 0) {
            notes = hivInfo.join(' | ') + (notes !== '-' ? ` | ${notes}` : '');
          }
        }

        // Phase 6: Hepatitis B/C data extraction
        if (log.hepatitisData) {
          const hepInfo = [];
          const hep = log.hepatitisData;

          if (hep.weightLossPercentage) hepInfo.push(`Weight Loss: ${hep.weightLossPercentage}%`);
          if (hep.debilitating) hepInfo.push('Debilitating Symptoms');
          if (hep.dietaryRestrictions) hepInfo.push('Dietary Restrictions Required');
          if (hep.symptomFrequency) {
            const freqMap = {
              'daily': 'Daily Symptoms',
              'intermittent': 'Intermittent Symptoms',
              'rare': 'Rare Symptoms'
            };
            hepInfo.push(freqMap[hep.symptomFrequency] || hep.symptomFrequency);
          }

          if (hepInfo.length > 0) {
            notes = hepInfo.join(' | ') + (notes !== '-' ? ` | ${notes}` : '');
          }
        }

        // Phase 6: Lyme Disease data extraction
        if (log.lymeData) {
          const lymeInfo = [];
          const ld = log.lymeData;

          if (ld.activeTreatment) lymeInfo.push('Active Treatment (100% for 1 year)');
          if (ld.treatmentCompleted) lymeInfo.push('Treatment Completed');
          if (ld.treatmentStartDate) lymeInfo.push(`Started: ${new Date(ld.treatmentStartDate).toLocaleDateString()}`);
          if (ld.treatmentCompletionDate) lymeInfo.push(`Completed: ${new Date(ld.treatmentCompletionDate).toLocaleDateString()}`);
          if (ld.rashPresent) {
            const rashMap = {
              'bulls-eye': "Bull's-eye Rash",
              'expanding-red': 'Expanding Red Rash',
              'other': 'Other Rash'
            };
            lymeInfo.push(rashMap[ld.rashType] || 'Rash Present');
          }
          if (ld.neurologicalSymptoms && ld.neurologicalSymptoms.length > 0) {
            lymeInfo.push(`Neuro: ${ld.neurologicalSymptoms.join(', ')}`);
          }
          if (ld.jointSymptoms && ld.jointSymptoms.length > 0) {
            lymeInfo.push(`Joints: ${ld.jointSymptoms.join(', ')}`);
          }

          if (lymeInfo.length > 0) {
            notes = lymeInfo.join(' | ') + (notes !== '-' ? ` | ${notes}` : '');
          }
        }

        // Phase 6: Malaria data extraction
        if (log.malariaData) {
          const malariaInfo = [];
          const md = log.malariaData;

          if (md.relapseEpisode) malariaInfo.push('Relapse Episode');
          if (md.cyclicalPattern) malariaInfo.push('Cyclical Pattern (48-72hr)');
          if (md.feverTemperature) malariaInfo.push(`Temp: ${md.feverTemperature}°F`);
          if (md.hospitalized) malariaInfo.push('Hospitalized');
          if (md.severeComplications) malariaInfo.push('Severe Complications');
          if (md.continuousMedication) malariaInfo.push('Continuous Antimalarials');

          if (malariaInfo.length > 0) {
            notes = malariaInfo.join(' | ') + (notes !== '-' ? ` | ${notes}` : '');
          }
        }

        // Phase 6: Brucellosis data extraction
        if (log.brucellosisData) {
          const brucellosisInfo = [];
          const bd = log.brucellosisData;

          if (bd.relapseEpisode) brucellosisInfo.push('Relapse Episode');
          if (bd.undulantFever) brucellosisInfo.push('Undulant Fever');
          if (bd.chronicArthritis) brucellosisInfo.push('Chronic Arthritis/Spondylitis');
          if (bd.multiOrganInvolvement) brucellosisInfo.push('Multi-Organ Involvement');
          if (bd.neurobrucellosis) brucellosisInfo.push('Neurobrucellosis (CNS)');

          if (brucellosisInfo.length > 0) {
            notes = brucellosisInfo.join(' | ') + (notes !== '-' ? ` | ${notes}` : '');
          }
        }

        // Phase 6: Campylobacter data extraction
        if (log.campylobacterData) {
          const campylobacterInfo = [];
          const cd = log.campylobacterData;

          if (cd.guillainBarre) campylobacterInfo.push('⚠️ GUILLAIN-BARRÉ SYNDROME');
          if (cd.reactiveArthritis) campylobacterInfo.push('Reactive Arthritis');
          if (cd.chronicIBS) campylobacterInfo.push('Post-Infectious IBS');
          if (cd.stoolCultureConfirmed) campylobacterInfo.push('Stool Culture +');
          if (cd.weeksSinceInfection) campylobacterInfo.push(`${cd.weeksSinceInfection} weeks post-infection`);

          if (campylobacterInfo.length > 0) {
            notes = campylobacterInfo.join(' | ') + (notes !== '-' ? ` | ${notes}` : '');
          }
        }

        // Phase 6: Q Fever data extraction
        if (log.qFeverData) {
          const qFeverInfo = [];
          const qd = log.qFeverData;

          if (qd.endocarditis) qFeverInfo.push('⚠️ Q FEVER ENDOCARDITIS');
          if (qd.chronicQFever) qFeverInfo.push('Chronic Q Fever (>6mo)');
          if (qd.fatigueSyndrome) qFeverInfo.push('Q Fever Fatigue Syndrome');
          if (qd.phaseIAntibodies) qFeverInfo.push('Phase I Ab+ (>1:800)');
          if (qd.monthsSinceInfection) qFeverInfo.push(`${qd.monthsSinceInfection} months post-infection`);

          if (qFeverInfo.length > 0) {
            notes = qFeverInfo.join(' | ') + (notes !== '-' ? ` | ${notes}` : '');
          }
        }

        // Phase 6: Salmonella data extraction
        if (log.salmonellaData) {
          const salInfo = [];
          const sal = log.salmonellaData;

          if (sal.stoolCultureConfirmed) salInfo.push('Stool Culture Confirmed');
          if (sal.reactiveArthritis) salInfo.push('Reactive Arthritis');
          if (sal.bacteremia) salInfo.push('Bacteremia/Sepsis');
          if (sal.hospitalized) salInfo.push('Hospitalized');
          if (sal.severeComplications) salInfo.push('Severe Complications');

          if (salInfo.length > 0) {
            notes = salInfo.join(' | ') + (notes !== '-' ? ` | ${notes}` : '');
          }
        }

        // Phase 6: Shigella data extraction
        if (log.shigellaData) {
          const shigInfo = [];
          const shig = log.shigellaData;

          if (shig.stoolCultureConfirmed) shigInfo.push('Stool Culture Confirmed');
          if (shig.reactiveArthritis) shigInfo.push('Reactive Arthritis');
          if (shig.hus) shigInfo.push('HUS (Hemolytic Uremic Syndrome)');
          if (shig.hospitalized) shigInfo.push('Hospitalized');
          if (shig.severeComplications) shigInfo.push('Severe Complications');

          if (shigInfo.length > 0) {
            notes = shigInfo.join(' | ') + (notes !== '-' ? ` | ${notes}` : '');
          }
        }

        // Phase 6: West Nile data extraction
        if (log.westNileData) {
          const wnInfo = [];
          const wn = log.westNileData;

          if (wn.serologyConfirmed) wnInfo.push('Serology Confirmed');
          if (wn.neuroinvasive) wnInfo.push('Neuroinvasive Disease');
          if (wn.encephalitis) wnInfo.push('Encephalitis');
          if (wn.acuteFlaccidParalysis) wnInfo.push('Acute Flaccid Paralysis');
          if (wn.permanentImpairment) wnInfo.push('Permanent Impairment');

          if (wnInfo.length > 0) {
            notes = wnInfo.join(' | ') + (notes !== '-' ? ` | ${notes}` : '');
          }
        }

        // Phase 6: NTM data extraction
        if (log.ntmData) {
          const ntmInfo = [];
          const ntm = log.ntmData;

          if (ntm.ntmSpecies) {
            const speciesMap = {
              'mac': 'MAC',
              'abscessus': 'M. abscessus',
              'kansasii': 'M. kansasii',
              'other': 'Other NTM'
            };
            ntmInfo.push(speciesMap[ntm.ntmSpecies] || ntm.ntmSpecies);
          }
          if (ntm.activeDisease) ntmInfo.push('Active Disease');
          if (ntm.onTreatment) ntmInfo.push(`On Treatment (${ntm.monthsOnTreatment || '?'} months)`);
          if (ntm.disseminated) ntmInfo.push('Disseminated');

          if (ntmInfo.length > 0) {
            notes = ntmInfo.join(' | ') + (notes !== '-' ? ` | ${notes}` : '');
          }
        }

        // Phase 7: Dental/Oral data extraction
        if (log.dentalData) {
          const dentalInfo = [];
          const dd = log.dentalData;

          // Jaw symptoms
          if (dd.jawPainSeverity !== undefined && dd.jawPainSeverity > 0) {
            dentalInfo.push(`Jaw pain: ${dd.jawPainSeverity}/10`);
          }
          if (dd.jawOpening) {
            dentalInfo.push(`Jaw opening: ${dd.jawOpening}mm`);
          }

          // Chewing/eating
          if (dd.chewingDifficulty && dd.chewingDifficulty !== 'none') {
            dentalInfo.push(`Chewing: ${dd.chewingDifficulty}`);
          }
          if (dd.dietaryRestrictions && dd.dietaryRestrictions !== 'none') {
            const dietMap = {
              'semi-solid': 'Semi-solid diet',
              'soft': 'Soft foods',
              'puree': 'Pureed diet',
              'full-liquid': 'Liquid diet only'
            };
            dentalInfo.push(dietMap[dd.dietaryRestrictions] || dd.dietaryRestrictions);
          }

          // Tooth loss
          if (dd.toothCount && dd.toothCount > 0) {
            dentalInfo.push(`${dd.toothCount} teeth lost`);
          }
          if (dd.prosthesisType && dd.prosthesisType !== 'none') {
            const prosthesisMap = {
              'partial': 'Partial denture',
              'complete-upper': 'Complete upper denture',
              'complete-lower': 'Complete lower denture',
              'complete-both': 'Complete dentures (both)',
              'implants': 'Dental implants',
              'bridge': 'Dental bridge'
            };
            dentalInfo.push(prosthesisMap[dd.prosthesisType] || dd.prosthesisType);
          }

          // Bone/fracture issues
          if (dd.boneCondition && dd.boneCondition !== 'none') {
            const boneMap = {
              'osteomyelitis': 'Osteomyelitis',
              'osteonecrosis': 'Osteonecrosis',
              'nonunion': 'Fracture nonunion',
              'malunion': 'Fracture malunion'
            };
            dentalInfo.push(boneMap[dd.boneCondition] || dd.boneCondition);
          }

          // Palate/swallowing
          if (dd.palateSymptoms && dd.palateSymptoms.length > 0) {
            dentalInfo.push(`Palate: ${dd.palateSymptoms.join(', ')}`);
          }
          if (dd.swallowingDifficulty && dd.swallowingDifficulty !== 'none') {
            dentalInfo.push(`Swallowing: ${dd.swallowingDifficulty}`);
          }

          // Neoplasm/tumor
          if (dd.oralMass) {
            dentalInfo.push('Oral mass/tumor');
            if (dd.massLocation) dentalInfo.push(`Location: ${dd.massLocation}`);
            if (dd.massBiopsy) {
              dentalInfo.push(dd.massBiopsy === 'malignant' ? 'Malignant' : 'Benign');
            }
          }

          // Infection
          if (dd.infection) {
            dentalInfo.push('Infection present');
            if (dd.infectionType) dentalInfo.push(`Type: ${dd.infectionType}`);
          }

          // Daily impact
          if (dd.speakingDifficulty) dentalInfo.push('Speaking difficulty');
          if (dd.painWithEating) dentalInfo.push('Pain with eating');
          if (dd.workMissed) dentalInfo.push('Work missed');

          if (dentalInfo.length > 0) {
            notes = dentalInfo.join(' | ') + (notes !== '-' ? ` | ${notes}` : '');
          }
        }

        // PHASE 8A: MENTAL HEALTH FORMS DATA EXTRACTION
        // Anxiety Disorders Form
        if (log.anxietyData) {
          const anxietyInfo = [];
          const ad = log.anxietyData;

          // Physical symptoms
          const physicalSymptoms = [
            ad.heartRacing && 'Heart racing',
            ad.sweating && 'Sweating',
            ad.trembling && 'Trembling',
            ad.shortnessOfBreath && 'SOB',
            ad.chestTightness && 'Chest tightness',
            ad.nausea && 'Nausea',
            ad.dizziness && 'Dizziness',
            ad.hotFlashes && 'Hot flashes',
            ad.numbnessTingling && 'Numbness/tingling'
          ].filter(Boolean);
          if (physicalSymptoms.length > 0) {
            anxietyInfo.push(`Physical: ${physicalSymptoms.join(', ')}`);
          }

          // Cognitive symptoms
          const cognitiveSymptoms = [
            ad.racingThoughts && 'Racing thoughts',
            ad.fearOfLosingControl && 'Fear losing control',
            ad.fearOfDying && 'Fear of dying',
            ad.feelingDetached && 'Detached',
            ad.difficultyConcentrating && 'Poor concentration'
          ].filter(Boolean);
          if (cognitiveSymptoms.length > 0) {
            anxietyInfo.push(`Cognitive: ${cognitiveSymptoms.join(', ')}`);
          }

          // Avoidance/Impact
          const avoidance = [
            ad.avoidedSocial && 'Avoided social',
            ad.leftEarly && 'Left early',
            ad.calledOut && 'Called out work',
            ad.cancelledPlans && 'Cancelled plans',
            ad.neededSafetyPerson && 'Needed safety person'
          ].filter(Boolean);
          if (avoidance.length > 0) {
            anxietyInfo.push(`Impact: ${avoidance.join(', ')}`);
          }

          if (ad.episodeDuration) anxietyInfo.push(`Duration: ${ad.episodeDuration}`);
          if (ad.wasPanicAttack) anxietyInfo.push('⚠️ PANIC ATTACK');
          if (ad.trigger) anxietyInfo.push(`Trigger: ${ad.trigger}`);

          if (anxietyInfo.length > 0) {
            notes = anxietyInfo.join(' | ') + (notes !== '-' ? ` | ${notes}` : '');
          }
        }

        // Depression Form
        if (log.depressionData) {
          const depressionInfo = [];
          const dd = log.depressionData;

          // Mood symptoms
          const moodSymptoms = [
            dd.depressedMood && 'Depressed mood',
            dd.anhedonia && 'Anhedonia',
            dd.worthlessness && 'Worthlessness',
            dd.excessiveGuilt && 'Guilt',
            dd.hopelessness && 'Hopelessness',
            dd.irritability && 'Irritability'
          ].filter(Boolean);
          if (moodSymptoms.length > 0) {
            depressionInfo.push(`Mood: ${moodSymptoms.join(', ')}`);
          }

          // Physical/vegetative
          const physicalSymptoms = [
            dd.insomnia && 'Insomnia',
            dd.hypersomnia && 'Hypersomnia',
            dd.decreasedAppetite && '↓Appetite',
            dd.increasedAppetite && '↑Appetite',
            dd.fatigue && 'Fatigue',
            dd.psychomotorAgitation && 'Agitation',
            dd.psychomotorRetardation && 'Slowed'
          ].filter(Boolean);
          if (physicalSymptoms.length > 0) {
            depressionInfo.push(`Physical: ${physicalSymptoms.join(', ')}`);
          }

          // Cognitive
          const cognitive = [
            dd.difficultyConcentrating && 'Poor concentration',
            dd.difficultyDeciding && 'Indecisive',
            dd.memoryProblems && 'Memory issues',
            dd.thoughtsOfDeath && 'Thoughts of death'
          ].filter(Boolean);
          if (cognitive.length > 0) {
            depressionInfo.push(`Cognitive: ${cognitive.join(', ')}`);
          }

          // Functional impact
          const impact = [
            dd.unableToGetUp && 'Bed-bound',
            dd.calledOutWork && 'Called out',
            dd.neglectedSelfCare && 'Neglected self-care',
            dd.socialWithdrawal && 'Withdrew socially',
            dd.unableToCompleteTasks && 'Unable to complete tasks'
          ].filter(Boolean);
          if (impact.length > 0) {
            depressionInfo.push(`Impact: ${impact.join(', ')}`);
          }

          if (dd.suicidalIdeation) depressionInfo.push('⚠️ SUICIDAL IDEATION');
          if (dd.trigger) depressionInfo.push(`Trigger: ${dd.trigger}`);
          if (dd.episodeContext) depressionInfo.push(`Context: ${dd.episodeContext}`);

          if (depressionInfo.length > 0) {
            notes = depressionInfo.join(' | ') + (notes !== '-' ? ` | ${notes}` : '');
          }
        }

        // Bipolar/Cyclothymic Form
        if (log.bipolarData) {
          const bipolarInfo = [];
          const bd = log.bipolarData;

          if (bd.episodeType) {
            const episodeMap = {
              'manic': 'MANIC EPISODE',
              'hypomanic': 'HYPOMANIC EPISODE',
              'depressive': 'DEPRESSIVE EPISODE',
              'mixed': 'MIXED EPISODE'
            };
            bipolarInfo.push(episodeMap[bd.episodeType] || bd.episodeType);
          }

          // Manic/hypomanic symptoms
          const manicSymptoms = [
            bd.elevatedMood && 'Elevated mood',
            bd.irritableMood && 'Irritable',
            bd.increasedEnergy && '↑Energy',
            bd.decreasedSleep && '↓Sleep need',
            bd.moreTalkative && 'Talkative',
            bd.racingThoughts && 'Racing thoughts',
            bd.distractibility && 'Distractible',
            bd.increasedActivity && '↑Activity',
            bd.riskyBehavior && 'Risky behavior',
            bd.grandiosity && 'Grandiose'
          ].filter(Boolean);
          if (manicSymptoms.length > 0) {
            bipolarInfo.push(`Manic: ${manicSymptoms.join(', ')}`);
          }

          // Depressive symptoms
          const depressiveSymptoms = [
            bd.depressedMood && 'Depressed',
            bd.anhedonia && 'Anhedonia',
            bd.fatigue && 'Fatigue',
            bd.worthlessness && 'Worthless'
          ].filter(Boolean);
          if (depressiveSymptoms.length > 0) {
            bipolarInfo.push(`Depressive: ${depressiveSymptoms.join(', ')}`);
          }

          if (bd.sleepHours) bipolarInfo.push(`Sleep: ${bd.sleepHours}hrs`);
          if (bd.riskyBehaviors && bd.riskyBehaviors.length > 0) {
            bipolarInfo.push(`Risky: ${bd.riskyBehaviors.join(', ')}`);
          }

          // Impact
          const impact = [
            bd.unableToWork && 'Unable to work',
            bd.relationshipConflicts && 'Relationship conflicts',
            bd.legalProblems && 'Legal problems',
            bd.hospitalizationRequired && '⚠️ HOSPITALIZATION REQUIRED'
          ].filter(Boolean);
          if (impact.length > 0) {
            bipolarInfo.push(`Impact: ${impact.join(', ')}`);
          }

          if (bd.episodeDuration) bipolarInfo.push(`Duration: ${bd.episodeDuration}`);

          if (bipolarInfo.length > 0) {
            notes = bipolarInfo.join(' | ') + (notes !== '-' ? ` | ${notes}` : '');
          }
        }

        // OCD Form
        if (log.ocdData) {
          const ocdInfo = [];
          const od = log.ocdData;

          // Obsessions
          const obsessions = [
            od.contaminationFears && 'Contamination',
            od.fearOfHarm && 'Fear of harm',
            od.needForSymmetry && 'Symmetry',
            od.forbiddenThoughts && 'Forbidden thoughts',
            od.religiousObsessions && 'Religious',
            od.hoardingUrges && 'Hoarding',
            od.otherObsession && od.otherObsession
          ].filter(Boolean);

          if (obsessions.length > 0) {
            ocdInfo.push(`Obsessions: ${obsessions.join(', ')}`);
          }

          // Compulsions
          const compulsions = [
            od.washingCleaning && 'Washing',
            od.checking && 'Checking',
            od.repeating && 'Repeating',
            od.counting && 'Counting',
            od.ordering && 'Ordering',
            od.mentalRituals && 'Mental rituals',
            od.reassuranceSeeking && 'Reassurance',
            od.otherCompulsion && od.otherCompulsion
          ].filter(Boolean);

          if (compulsions.length > 0) {
            ocdInfo.push(`Compulsions: ${compulsions.join(', ')}`);
          }

          if (od.timeConsumed) ocdInfo.push(`Time: ${od.timeConsumed}`);
          if (od.distressLevel !== undefined && od.distressLevel !== 5) {
            ocdInfo.push(`Distress: ${od.distressLevel}/10`);
          }

          // Impact
          const impact = [
            od.lateToAppointments && 'Late',
            od.avoidedSituations && 'Avoided situations',
            od.interferedRoutines && 'Disrupted routines',
            od.relationshipProblems && 'Relationship issues',
            od.unableToComplete && 'Unable to complete tasks'
          ].filter(Boolean);

          if (impact.length > 0) {
            ocdInfo.push(`Impact: ${impact.join(', ')}`);
          }

          if (od.trigger) ocdInfo.push(`Trigger: ${od.trigger}`);

          if (ocdInfo.length > 0) {
            const oldNotes = notes;
            notes = ocdInfo.join(' | ') + (notes !== '-' ? ` | ${notes}` : '');
          } else {
          }
        }

        // Adjustment Disorder Form
        if (log.adjustmentDisorderData) {
          const adjustmentInfo = [];
          const ad = log.adjustmentDisorderData;

          if (ad.stressor) adjustmentInfo.push(`Stressor: ${ad.stressor}`);
          if (ad.stressorDate) {
            adjustmentInfo.push(`Date: ${ad.stressorDate}`);
            if (ad.daysSinceStressor) {
              const chronic = parseInt(ad.daysSinceStressor) > 180 ? ' (CHRONIC)' : '';
              adjustmentInfo.push(`${ad.daysSinceStressor} days ago${chronic}`);
            }
          }

          if (ad.presentationType) {
            const typeMap = {
              'depressed': 'With Depressed Mood',
              'anxiety': 'With Anxiety',
              'mixed-emotions': 'Mixed Anxiety & Depression',
              'conduct': 'With Conduct Disturbance',
              'mixed-conduct-emotions': 'Mixed Conduct & Emotions',
              'unspecified': 'Unspecified'
            };
            adjustmentInfo.push(typeMap[ad.presentationType] || ad.presentationType);
          }

          // Symptoms
          const symptoms = [
            ad.tearfulness && 'Tearful',
            ad.hopelessness && 'Hopeless',
            ad.worry && 'Worry',
            ad.physicalTension && 'Tension',
            ad.impulsiveBehaviors && 'Impulsive',
            ad.aggression && 'Aggression',
            ad.ruleViolations && 'Rule violations',
            ad.recklessBehavior && 'Reckless'
          ].filter(Boolean);
          if (symptoms.length > 0) {
            adjustmentInfo.push(`Symptoms: ${symptoms.join(', ')}`);
          }

          // Impact
          const impact = [
            ad.workDifficulty && 'Work difficulty',
            ad.relationshipProblems && 'Relationship issues',
            ad.socialWithdrawal && 'Withdrew',
            ad.selfCareNeglect && 'Neglected self-care',
            ad.unableToFulfillResponsibilities && 'Unable to function'
          ].filter(Boolean);
          if (impact.length > 0) {
            adjustmentInfo.push(`Impact: ${impact.join(', ')}`);
          }

          // Progress
          if (ad.symptomsImproving === true) adjustmentInfo.push('Improving');
          else if (ad.symptomsImproving === false) adjustmentInfo.push('Not improving');

          if (ad.stillAffectingFunctioning === true) adjustmentInfo.push('Still affecting functioning');
          else if (ad.stillAffectingFunctioning === false) adjustmentInfo.push('No longer affecting functioning');

          if (ad.context) adjustmentInfo.push(`Context: ${ad.context}`);

          if (adjustmentInfo.length > 0) {
            notes = adjustmentInfo.join(' | ') + (notes !== '-' ? ` | ${notes}` : '');
          }
        }

        // Eating Disorders Form
        if (log.eatingDisorderData) {
          const eatingInfo = [];
          const ed = log.eatingDisorderData;

          if (ed.currentWeight && ed.expectedMinimumWeight) {
            const weightLoss = ((ed.expectedMinimumWeight - ed.currentWeight) / ed.expectedMinimumWeight * 100).toFixed(1);
            eatingInfo.push(`Weight: ${ed.currentWeight}lbs (Expected: ${ed.expectedMinimumWeight}lbs)`);
            if (weightLoss > 0) eatingInfo.push(`Loss: ${weightLoss}%`);
          }

          if (ed.incapacitatingEpisode) {
            eatingInfo.push('INCAPACITATING EPISODE');
            if (ed.episodeDuration) eatingInfo.push(`Duration: ${ed.episodeDuration}`);
          }

          if (ed.hospitalized) {
            eatingInfo.push('HOSPITALIZED');
            if (ed.tubeFeeding) eatingInfo.push('Tube feeding');
            if (ed.parenteralNutrition) eatingInfo.push('Parenteral nutrition');
          }

          if (ed.bingeEpisode) eatingInfo.push('Binge episode');
          if (ed.purgingEpisode) eatingInfo.push('Purging episode');
          if (ed.compensatoryBehaviors && ed.compensatoryBehaviors.length > 0) {
            eatingInfo.push(`Compensatory: ${ed.compensatoryBehaviors.join(', ')}`);
          }
          if (ed.restrictedIntake) eatingInfo.push('Restricted intake');

          if (eatingInfo.length > 0) {
            notes = eatingInfo.join(' | ') + (notes !== '-' ? ` | ${notes}` : '');
          }
        }

        // ========================================
        // PHASE 8B: ADDITIONAL MENTAL HEALTH DATA EXTRACTION
        // ========================================

        // Binge Eating Disorder Form
        if (log.bingeEatingData) {
          const bedInfo = [];
          const bed = log.bingeEatingData;

          if (bed.bingeEpisode) bedInfo.push('Binge episode');
          if (bed.lossOfControl) bedInfo.push('Loss of control');
          if (bed.distressLevel !== undefined && bed.distressLevel !== 5) {
            bedInfo.push(`Distress: ${bed.distressLevel}/10`);
          }

          if (bedInfo.length > 0) {
            notes = bedInfo.join(', ') + (notes !== '-' ? ` | ${notes}` : '');
          }
        }

        // Dissociative Disorders Form
        if (log.dissociativeData) {
          const dissocInfo = [];
          const dd = log.dissociativeData;

          if (dd.memoryGap) dissocInfo.push('Memory gap');
          if (dd.lostTime) dissocInfo.push('Lost time');
          if (dd.duration) dissocInfo.push(`Duration: ${dd.duration}`);

          if (dissocInfo.length > 0) {
            notes = dissocInfo.join(', ') + (notes !== '-' ? ` | ${notes}` : '');
          }
        }

        // Acute Stress Disorder Form
        if (log.acuteStressData) {
          const asdInfo = [];
          const asd = log.acuteStressData;

          if (asd.traumaDate) asdInfo.push(`Trauma: ${asd.traumaDate}`);
          if (asd.dissociativeSymptoms) asdInfo.push('Dissociative symptoms');
          if (asd.avoidance) asdInfo.push('Avoidance');

          if (asdInfo.length > 0) {
            notes = asdInfo.join(', ') + (notes !== '-' ? ` | ${notes}` : '');
          }
        }

        // Personality Disorders Form
        if (log.personalityData) {
          const pdInfo = [];
          const pd = log.personalityData;

          if (pd.occupationalImpact) pdInfo.push('Occupational impact');
          if (pd.socialImpact) pdInfo.push('Social impact');

          if (pdInfo.length > 0) {
            notes = pdInfo.join(', ') + (notes !== '-' ? ` | ${notes}` : '');
          }
        }

        // Phase 9: Cardiovascular data extraction
        if (log.cardiovascularData) {
          const cvInfo = [];
          const cv = log.cardiovascularData;

          if (cv.activityLevel) {
            const metsMap = {
              'greater-than-10': '>10 METs',
              '7-10': '7-10 METs',
              '5-7': '5-7 METs',
              '3-5': '3-5 METs',
              '1-3': '1-3 METs',
              'less-than-1': '<1 METs'
            };
            cvInfo.push(metsMap[cv.activityLevel] || cv.activityLevel);
          }
          if (cv.atRest) cvInfo.push('Symptoms at rest');
          if (cv.withExertion) cvInfo.push('Symptoms with exertion');
          if (cv.treatmentRequired && cv.treatmentRequired !== 'none') {
            const treatmentMap = {
              'vagal': 'Vagal maneuver',
              'oral': 'Oral medication',
              'iv': 'IV medication',
              'cardioversion': 'Cardioversion',
              'ablation': 'Ablation'
            };
            cvInfo.push(treatmentMap[cv.treatmentRequired] || cv.treatmentRequired);
          }
          if (cv.hospitalized) cvInfo.push('Hospitalized');
          if (cv.hasAICD) cvInfo.push('AICD implanted');
          if (cv.aicdShockDelivered) cvInfo.push('AICD shock delivered');
          if (cv.activeInfection) cvInfo.push('Active infection');
          if (cv.affectedLeg) {
            const legMap = { 'left': 'Left leg', 'right': 'Right leg', 'both': 'Both legs' };
            cvInfo.push(legMap[cv.affectedLeg] || cv.affectedLeg);
          }
          if (cv.compressionUsed) cvInfo.push('Compression therapy');

          if (cvInfo.length > 0) {
            notes = cvInfo.join(' | ') + (notes !== '-' ? ` | ${notes}` : '');
          }
        }

        // Phase 10: Digestive Form
        if (log.digestiveData) {
          const dgInfo = [];
          const dg = log.digestiveData;

          if (dg.hasAscites) dgInfo.push(`Ascites${dg.ascitesSeverity ? ` (${dg.ascitesSeverity})` : ''}`);
          if (dg.hasEncephalopathy) dgInfo.push('Encephalopathy');
          if (dg.hasVaricealBleed) dgInfo.push('Variceal bleed');
          if (dg.onLactulose) dgInfo.push('On lactulose');
          if (dg.episodeDuration) dgInfo.push(`Episode: ${dg.episodeDuration} days`);
          if (dg.onDailyMedication) dgInfo.push('Daily medication');
          if (dg.hasGIBleeding) dgInfo.push('GI bleeding');
          if (dg.onEnzymes) dgInfo.push('On enzymes');
          if (dg.hasMaldigestion) dgInfo.push('Maldigestion');
          if (dg.hasDietaryRestriction) dgInfo.push('Diet restriction');
          if (dg.attackWithNausea && dg.attackWithVomiting) dgInfo.push('Attack with N/V');
          if (dg.hadStrictureDilation) dgInfo.push('Stricture dilation');
          if (dg.hospitalized) dgInfo.push('Hospitalized');

          if (dgInfo.length > 0) {
            notes = dgInfo.join(', ') + (notes !== '-' ? ` | ${notes}` : '');
          }
        }

        // Phase 1A: Multiple Sclerosis Form
        if (log.multipleSclerosisData) {
          const msInfo = [];
          const ms = log.multipleSclerosisData;

          if (ms.isRelapse) msInfo.push(`Relapse${ms.relapseDuration ? ` (${ms.relapseDuration} days)` : ''}`);
          if (ms.relapseRecovery) msInfo.push(`Recovery: ${ms.relapseRecovery}`);
          if (ms.mobilityAid && ms.mobilityAid !== 'none') msInfo.push(`Mobility: ${ms.mobilityAid}`);
          if (ms.assistanceNeeded) msInfo.push('Assistance needed');
          if (ms.onDMT) msInfo.push('On DMT');
          if (ms.recentSteroids) msInfo.push('IV steroids');
          if (ms.heatTriggered) msInfo.push('Heat triggered');

          if (msInfo.length > 0) {
            notes = msInfo.join(', ') + (notes !== '-' ? ` | ${notes}` : '');
          }
        }

        // Phase 1A: Parkinson's Disease Form
        if (log.parkinsonsData) {
          const pdInfo = [];
          const pd = log.parkinsonsData;

          if (pd.tremorSide) pdInfo.push(`Tremor: ${pd.tremorSide}${pd.tremorSeverity ? ` (${pd.tremorSeverity})` : ''}`);
          if (pd.freezingEpisodes) pdInfo.push(`Freezing: ${pd.freezingEpisodes}x`);
          if (pd.fallsToday) pdInfo.push(`Falls: ${pd.fallsToday}`);
          if (pd.medicationState) pdInfo.push(`Med state: ${pd.medicationState}`);
          if (pd.mobilityAid && pd.mobilityAid !== 'none') pdInfo.push(`Mobility: ${pd.mobilityAid}`);
          if (pd.speechAffected) pdInfo.push('Speech affected');
          if (pd.swallowingAffected) pdInfo.push('Swallowing affected');
          if (pd.hallucinationsPresent) pdInfo.push('Hallucinations');
          if (pd.confusionPresent) pdInfo.push('Confusion');

          if (pdInfo.length > 0) {
            notes = pdInfo.join(', ') + (notes !== '-' ? ` | ${notes}` : '');
          }
        }

        // Phase 1A: Myasthenia Gravis Form
        if (log.myastheniaData) {
          const mgInfo = [];
          const mg = log.myastheniaData;

          if (mg.worseWithActivity && mg.betterWithRest) mgInfo.push('Fatigable weakness pattern');
          else if (mg.worseWithActivity) mgInfo.push('Worse with activity');
          if (mg.timeOfDayWorst) mgInfo.push(`Worst: ${mg.timeOfDayWorst}`);
          if (mg.ptosisPresent) mgInfo.push(`Ptosis${mg.ptosisSide ? ` (${mg.ptosisSide})` : ''}`);
          if (mg.doubleVision) mgInfo.push('Double vision');
          if (mg.canRaiseArms) mgInfo.push(`Arm hold: ${mg.canRaiseArms}s`);
          if (mg.breathingDifficulty) mgInfo.push('⚠️ Breathing difficulty');
          if (mg.emergencySigns) mgInfo.push('🚨 Crisis signs');
          if (mg.onPyridostigmine) mgInfo.push('On Mestinon');

          if (mgInfo.length > 0) {
            notes = mgInfo.join(', ') + (notes !== '-' ? ` | ${notes}` : '');
          }
        }

        // Phase 1B: Narcolepsy Form
        if (log.narcolepsyData) {
          const narcoInfo = [];
          const narco = log.narcolepsyData;

          if (narco.sleepAttackDuration) narcoInfo.push(`Attack: ${narco.sleepAttackDuration}`);
          if (narco.sleepAttackTrigger) narcoInfo.push(`Trigger: ${narco.sleepAttackTrigger}`);
          if (narco.cataplexyTrigger) narcoInfo.push(`Cataplexy: ${narco.cataplexyTrigger}`);
          if (narco.cataplexyAffected) narcoInfo.push(`Affected: ${narco.cataplexyAffected}`);
          if (narco.fellDuringCataplexy) narcoInfo.push('Fell');
          if (narco.onStimulants) narcoInfo.push('On stimulants');
          if (narco.onSodiumOxybate) narcoInfo.push('On Xyrem/Xywav');
          if (narco.sleepStudyConfirmed) narcoInfo.push('MSLT confirmed');

          if (narcoInfo.length > 0) {
            notes = narcoInfo.join(', ') + (notes !== '-' ? ` | ${notes}` : '');
          }
        }

        // Phase 1B: ALS Form
        if (log.alsData) {
          const alsInfo = [];
          const als = log.alsData;

          if (als.weaknessLocation) alsInfo.push(`Weakness: ${als.weaknessLocation}${als.weaknessSide ? ` (${als.weaknessSide})` : ''}`);
          if (als.speechClarity) alsInfo.push(`Speech: ${als.speechClarity}`);
          if (als.swallowingSolids) alsInfo.push(`Swallow solids: ${als.swallowingSolids}`);
          if (als.swallowingLiquids) alsInfo.push(`Swallow liquids: ${als.swallowingLiquids}`);
          if (als.breathingDifficulty) alsInfo.push(`Breathing: ${als.breathingDifficulty}`);
          if (als.usesBiPAP) alsInfo.push('BiPAP');
          if (als.usesVentilator) alsInfo.push('Ventilator');
          if (als.usesFeedingTube) alsInfo.push('Feeding tube');
          if (als.mobilityStatus) alsInfo.push(`Mobility: ${als.mobilityStatus}`);

          if (alsInfo.length > 0) {
            notes = alsInfo.join(', ') + (notes !== '-' ? ` | ${notes}` : '');
          }
        }

        // Phase 1B: Syringomyelia Form
        if (log.syringomyeliaData) {
          const syringInfo = [];
          const syring = log.syringomyeliaData;

          if (syring.painType) syringInfo.push(`Pain: ${syring.painType}`);
          if (syring.sensoryLossPattern) syringInfo.push(`Sensory: ${syring.sensoryLossPattern}`);
          if (syring.hadBurnInjury) syringInfo.push('Burn injury');
          if (syring.hadCutInjury) syringInfo.push('Cut injury');
          if (syring.syrinxLocation) syringInfo.push(`Syrinx: ${syring.syrinxLocation}`);

          if (syringInfo.length > 0) {
            notes = syringInfo.join(', ') + (notes !== '-' ? ` | ${notes}` : '');
          }
        }

        // Phase 1B: Myelitis Form
        if (log.myelitisData) {
          const myelInfo = [];
          const myel = log.myelitisData;

          if (myel.weaknessDistribution) myelInfo.push(`Distribution: ${myel.weaknessDistribution}`);
          if (myel.sensoryLevel) myelInfo.push(`Level: ${myel.sensoryLevel}`);
          if (myel.bladderSymptoms) myelInfo.push(`Bladder: ${myel.bladderSymptoms}`);
          if (myel.usesCatheter) myelInfo.push('Catheter');
          if (myel.bowelSymptoms) myelInfo.push(`Bowel: ${myel.bowelSymptoms}`);
          if (myel.mobilityStatus) myelInfo.push(`Mobility: ${myel.mobilityStatus}`);
          if (myel.causeOfMyelitis) myelInfo.push(`Cause: ${myel.causeOfMyelitis}`);

          if (myelInfo.length > 0) {
            notes = myelInfo.join(', ') + (notes !== '-' ? ` | ${notes}` : '');
          }
        }

        // Add medications to the PDF after all the symptoms are completed.
            if (linkedMeds.length > 0) {
                const medInfo = linkedMeds.map(m => `${m.medicationName} ${m.dosage}`).join(', ');
                notes = `Meds: ${medInfo}` + (notes !== '-' ? ` | ${notes}` : '');
            }

            return [
                new Date(getOccurrenceTime(log)).toLocaleString() + backDatedTag,
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
                        const lines = doc.splitTextToSize(`- ${evidence}`, 180);
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
                    const lines = doc.splitTextToSize(`* ${gap}`, 170);
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