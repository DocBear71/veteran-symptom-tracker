import { useState, useEffect, useMemo } from 'react';
import { getSymptomLogs, saveSymptomLog } from '../utils/storage';
import {
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
  analyzeTinnitusLogs,
  analyzeFibromyalgiaLogs,
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
  getAllMigraineRatings,
  getAllSleepApneaRatings,
  getAllPTSDRatings,
  getAllMajorDepressionRatings,
  getAllGeneralizedAnxietyRatings,
  getAllPanicDisorderRatings,
  getAllBipolarRatings,
  getMigraineDefinition,
  getSleepApneaDefinition,
  getPTSDDefinition,
  getMajorDepressionDefinition,
  getGeneralizedAnxietyDefinition,
  getPanicDisorderDefinition,
  getBipolarDefinition,
  formatRating,
  getRatingColorClass,
} from '../utils/ratingCriteria';
import HypertensionRatingCard from './HypertensionRatingCard';
import BloodPressureTrendChart from './BloodPressureTrendChart';
import { formatLocalDateTime } from '../utils/datetime';
import DiabetesRatingCard from './DiabetesRatingCard';
import IBSRatingCard from './IBSRatingCard';
import GERDRatingCard from './GERDRatingCard';
import RadiculopathyRatingCard from './RadiculopathyRatingCard';
import ChronicFatigueRatingCard from './ChronicFatigueRatingCard';
import PeripheralNeuropathyRatingCard from './PeripheralNeuropathyRatingCard';
import MenieresRatingCard from './MenieresRatingCard';
import RhinitisRatingCard from './RhinitisRatingCard';
import TMJRatingCard from './TMJRatingCard';
import PlantarFasciitisRatingCard from './PlantarFasciitisRatingCard';
import InsomniaRatingCard from './InsomniaRatingCard';
import SinusitisRatingCard from './SinusitisRatingCard';
import ShoulderRatingCard from './ShoulderRatingCard';
import HipRatingCard from './HipRatingCard';

// Storage key for sleep apnea profile
const SLEEP_APNEA_PROFILE_KEY = 'symptomTracker_sleepApneaProfile';

// Get/save sleep apnea profile
const getSleepApneaProfile = () => {
  try {
    const data = localStorage.getItem(SLEEP_APNEA_PROFILE_KEY);
    return data ? JSON.parse(data) : {};
  } catch {
    return {};
  }
};

const saveSleepApneaProfile = (profile) => {
  localStorage.setItem(SLEEP_APNEA_PROFILE_KEY, JSON.stringify(profile));
};

/**
 * Rating Evidence Summary Component
 * Displays analysis of logged symptoms against VA rating criteria
 *
 * Supported Conditions:
 * - Migraine (DC 8100)
 * - Sleep Apnea (DC 6847)
 * - PTSD (DC 9411)
 * - Major Depressive Disorder (DC 9434)
 * - Generalized Anxiety Disorder (DC 9400)
 * - Panic Disorder (DC 9412)
 * - Bipolar Disorder (DC 9432)
 */
const RatingEvidence = () => {
  const [logs, setLogs] = useState([]);
  const [evaluationDays, setEvaluationDays] = useState(90);
  const [expandedSection, setExpandedSection] = useState(null);
  const [sleepApneaProfile, setSleepApneaProfile] = useState(getSleepApneaProfile());
  const [showSleepApneaSetup, setShowSleepApneaSetup] = useState(false);

  useEffect(() => {
    setLogs(getSymptomLogs());
  }, []);

  // Analyze migraine logs
  const migraineAnalysis = useMemo(() => {
    const migraineLogs = logs.filter(log => log.symptom === 'migraine');
    return analyzeMigraineLogs(migraineLogs, { evaluationPeriodDays: evaluationDays });
  }, [logs, evaluationDays]);

  // Analyze sleep apnea logs
  const sleepApneaAnalysis = useMemo(() => {
    return analyzeSleepApneaLogs(logs, sleepApneaProfile, { evaluationPeriodDays: evaluationDays });
  }, [logs, sleepApneaProfile, evaluationDays]);

  // Analyze PTSD logs
  const ptsdAnalysis = useMemo(() => {
    return analyzePTSDLogs(logs, { evaluationPeriodDays: evaluationDays });
  }, [logs, evaluationDays]);

  // Analyze Major Depression logs
  const majorDepressionAnalysis = useMemo(() => {
    return analyzeMajorDepressionLogs(logs, { evaluationPeriodDays: evaluationDays });
  }, [logs, evaluationDays]);

  // Analyze Generalized Anxiety logs
  const generalizedAnxietyAnalysis = useMemo(() => {
    return analyzeGeneralizedAnxietyLogs(logs, { evaluationPeriodDays: evaluationDays });
  }, [logs, evaluationDays]);

  // Analyze Panic Disorder logs
  const panicDisorderAnalysis = useMemo(() => {
    return analyzePanicDisorderLogs(logs, { evaluationPeriodDays: evaluationDays });
  }, [logs, evaluationDays]);

  // Analyze Bipolar logs
  const bipolarAnalysis = useMemo(() => {
    return analyzeBipolarLogs(logs, { evaluationPeriodDays: evaluationDays });
  }, [logs, evaluationDays]);

  // Analyze Lumbosacral Strain logs
  const lumbosacralStrainAnalysis = useMemo(() => {
    return analyzeLumbosacralStrainLogs(logs, { evaluationPeriodDays: evaluationDays });
  }, [logs, evaluationDays]);

  // Analyze Intervertebral Disc logs
  const intervertebralDiscAnalysis = useMemo(() => {
    return analyzeIntervertebralDiscLogs(logs, { evaluationPeriodDays: evaluationDays });
  }, [logs, evaluationDays]);

  // Analyze Knee Instability logs
  const kneeInstabilityAnalysis = useMemo(() => {
    return analyzeKneeInstabilityLogs(logs, { evaluationPeriodDays: evaluationDays });
  }, [logs, evaluationDays]);

  // Analyze TBI logs
  const tbiAnalysis = useMemo(() => {
    return analyzeTBILogs(logs, { evaluationPeriodDays: evaluationDays });
  }, [logs, evaluationDays]);

  // Analyze Hypertension logs (uses BP measurements)
  const hypertensionAnalysis = useMemo(() => {
    return analyzeHypertensionLogs(logs, { evaluationPeriodDays: evaluationDays });
  }, [logs, evaluationDays]);

  // Analyze Diabetes logs (uses glucose/HbA1c measurements)
  const diabetesAnalysis = useMemo(() => {
    return analyzeDiabetesLogs(logs, { evaluationPeriodDays: evaluationDays });
  }, [logs, evaluationDays]);

  // Analyze IBS logs
  const ibsAnalysis = useMemo(() => {
    return analyzeIBSLogs(logs, { evaluationPeriodDays: evaluationDays });
  }, [logs, evaluationDays]);

// Analyze GERD logs
  const gerdAnalysis = useMemo(() => {
    return analyzeGERDLogs(logs, { evaluationPeriodDays: evaluationDays });
  }, [logs, evaluationDays]);

// Analyze Radiculopathy logs
  const radiculopathyAnalysis = useMemo(() => {
    return analyzeRadiculopathyLogs(logs, { evaluationPeriodDays: evaluationDays });
  }, [logs, evaluationDays]);

  const chronicFatigueAnalysis = useMemo(() => {
    return analyzeChronicFatigueLogs(logs, { evaluationPeriodDays: evaluationDays });
  }, [logs, evaluationDays]);

  const peripheralNeuropathyAnalysis = useMemo(() => {
    return analyzePeripheralNeuropathyLogs(logs, { evaluationPeriodDays: evaluationDays });
  }, [logs, evaluationDays]);

  const menieresAnalysis = useMemo(() => {
    return analyzeMenieresLogs(logs, { evaluationPeriodDays: evaluationDays });
  }, [logs, evaluationDays]);

  const rhinitisAnalysis = useMemo(() => {
    return analyzeRhinitisLogs(logs, { evaluationPeriodDays: evaluationDays });
  }, [logs, evaluationDays]);

  const tmjAnalysis = useMemo(() => {
    return analyzeTMJLogs(logs, { evaluationPeriodDays: evaluationDays });
  }, [logs, evaluationDays]);

  const plantarFasciitisAnalysis = useMemo(() => {
    return analyzePlantarFasciitisLogs(logs, { evaluationPeriodDays: evaluationDays });
  }, [logs, evaluationDays]);

  const insomniaAnalysis = useMemo(() => {
    return analyzeInsomniaLogs(logs, { evaluationPeriodDays: evaluationDays });
  }, [logs, evaluationDays]);

  const sinusitisAnalysis = useMemo(() => {
    return analyzeSinusitisLogs(logs, { evaluationPeriodDays: evaluationDays });
  }, [logs, evaluationDays]);

  const shoulderAnalysis = useMemo(() => {
    return analyzeShoulderLogs(logs, { evaluationPeriodDays: evaluationDays });
  }, [logs, evaluationDays]);

  const hipAnalysis = useMemo(() => {
    return analyzeHipLogs(logs, { evaluationPeriodDays: evaluationDays });
  }, [logs, evaluationDays]);

  // Analyze Tinnitus logs
  const tinnitusAnalysis = useMemo(() => {
    return analyzeTinnitusLogs(logs, { evaluationPeriodDays: evaluationDays });
  }, [logs, evaluationDays]);

  // Analyze Fibromyalgia logs
  const fibromyalgiaAnalysis = useMemo(() => {
    return analyzeFibromyalgiaLogs(logs, { evaluationPeriodDays: evaluationDays });
  }, [logs, evaluationDays]);

  // Toggle section expansion
  const toggleSection = (section) => {
    setExpandedSection(expandedSection === section ? null : section);
  };

  // Handle sleep apnea profile save
  const handleSleepApneaProfileSave = (profile) => {
    saveSleepApneaProfile(profile);
    setSleepApneaProfile(profile);
    setShowSleepApneaSetup(false);
  };

  const hasAnyData = migraineAnalysis.hasData ||
      sleepApneaAnalysis.hasData ||
      ptsdAnalysis.hasData ||
      majorDepressionAnalysis.hasData ||
      generalizedAnxietyAnalysis.hasData ||
      panicDisorderAnalysis.hasData ||
      bipolarAnalysis.hasData ||
      lumbosacralStrainAnalysis.hasData ||
      intervertebralDiscAnalysis.hasData ||
      kneeInstabilityAnalysis.hasData ||
      tbiAnalysis.hasData ||
      hypertensionAnalysis.hasData ||
      diabetesAnalysis.hasData ||
      ibsAnalysis.hasData ||
      gerdAnalysis.hasData ||
      radiculopathyAnalysis.hasData ||
      chronicFatigueAnalysis.hasData ||
      peripheralNeuropathyAnalysis.hasData ||
      menieresAnalysis.hasData ||
      rhinitisAnalysis.hasData ||
      tmjAnalysis.hasData ||
      plantarFasciitisAnalysis.hasData ||
      insomniaAnalysis.hasData ||
      sinusitisAnalysis.hasData ||
      shoulderAnalysis.hasData ||
      hipAnalysis.hasData ||
      tinnitusAnalysis.hasData ||
      fibromyalgiaAnalysis.hasData;

  return (
      <div className="space-y-4">
        {/* Header */}
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
              Rating Evidence Summary
            </h2>
            <span className="text-xs px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 rounded-full">
            Beta
          </span>
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            See how your documented symptoms align with VA rating criteria
          </p>

          {/* Evaluation Period Selector */}
          <div className="mt-3 flex items-center gap-2">
            <label className="text-sm text-gray-600 dark:text-gray-400">
              Evaluation period:
            </label>
            <select
                value={evaluationDays}
                onChange={(e) => setEvaluationDays(Number(e.target.value))}
                className="text-sm border border-gray-300 dark:border-gray-600 rounded px-2 py-1
                       bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            >
              <option value={30}>Last 30 days</option>
              <option value={60}>Last 60 days</option>
              <option value={90}>Last 90 days</option>
              <option value={180}>Last 6 months</option>
              <option value={365}>Last year</option>
            </select>
          </div>
        </div>

        {/* Disclaimer */}
        <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg p-3">
          <p className="text-xs text-amber-800 dark:text-amber-300">
            <strong>Important:</strong> This analysis is for documentation guidance only.
            The VA makes all final rating determinations based on the complete evidence of record,
            including medical examinations and service records.
          </p>
        </div>

        {/* Migraine Analysis Card */}
        <MigraineRatingCard
            analysis={migraineAnalysis}
            expanded={expandedSection === 'migraine'}
            onToggle={() => toggleSection('migraine')}
        />

        {/* Sleep Apnea Analysis Card */}
        <SleepApneaRatingCard
            analysis={sleepApneaAnalysis}
            profile={sleepApneaProfile}
            expanded={expandedSection === 'sleep-apnea'}
            onToggle={() => toggleSection('sleep-apnea')}
            onSetupClick={() => setShowSleepApneaSetup(true)}
        />

        {/* PTSD Analysis Card */}
        <PTSDRatingCard
            analysis={ptsdAnalysis}
            expanded={expandedSection === 'ptsd'}
            onToggle={() => toggleSection('ptsd')}
        />

        {/* Major Depression Analysis Card */}
        <MentalHealthRatingCard
            analysis={majorDepressionAnalysis}
            expanded={expandedSection === 'major-depression'}
            onToggle={() => toggleSection('major-depression')}
            icon="😔"
            getAllRatings={getAllMajorDepressionRatings}
            getDefinition={getMajorDepressionDefinition}
        />

        {/* Generalized Anxiety Analysis Card */}
        <MentalHealthRatingCard
            analysis={generalizedAnxietyAnalysis}
            expanded={expandedSection === 'generalized-anxiety'}
            onToggle={() => toggleSection('generalized-anxiety')}
            icon="😰"
            getAllRatings={getAllGeneralizedAnxietyRatings}
            getDefinition={getGeneralizedAnxietyDefinition}
        />

        {/* Panic Disorder Analysis Card */}
        <MentalHealthRatingCard
            analysis={panicDisorderAnalysis}
            expanded={expandedSection === 'panic-disorder'}
            onToggle={() => toggleSection('panic-disorder')}
            icon="😱"
            getAllRatings={getAllPanicDisorderRatings}
            getDefinition={getPanicDisorderDefinition}
        />

        {/* Bipolar Analysis Card */}
        <MentalHealthRatingCard
            analysis={bipolarAnalysis}
            expanded={expandedSection === 'bipolar'}
            onToggle={() => toggleSection('bipolar')}
            icon="🎭"
            getAllRatings={getAllBipolarRatings}
            getDefinition={getBipolarDefinition}
        />

        {/* Lumbosacral Strain Analysis Card */}
        <GenericRatingCard
            analysis={lumbosacralStrainAnalysis}
            expanded={expandedSection === 'lumbosacral-strain'}
            onToggle={() => toggleSection('lumbosacral-strain')}
            icon="🦴"
        />

        {/* Intervertebral Disc Analysis Card */}
        <GenericRatingCard
            analysis={intervertebralDiscAnalysis}
            expanded={expandedSection === 'intervertebral-disc'}
            onToggle={() => toggleSection('intervertebral-disc')}
            icon="💿"
        />

        {/* Knee Instability Analysis Card */}
        <GenericRatingCard
            analysis={kneeInstabilityAnalysis}
            expanded={expandedSection === 'knee-instability'}
            onToggle={() => toggleSection('knee-instability')}
            icon="🦵"
        />

        {/* TBI Analysis Card */}
        <GenericRatingCard
            analysis={tbiAnalysis}
            expanded={expandedSection === 'tbi'}
            onToggle={() => toggleSection('tbi')}
            icon="🧠"
        />

        {/* Hypertension Analysis Card */}
        <HypertensionRatingCard
            analysis={hypertensionAnalysis}
            expanded={expandedSection === 'hypertension'}
            onToggle={() => toggleSection('hypertension')}
        />

        {/* Diabetes Analysis Card */}
        <DiabetesRatingCard
            analysis={diabetesAnalysis}
            expanded={expandedSection === 'diabetes'}
            onToggle={() => toggleSection('diabetes')}
        />

        {/* IBS Analysis Card */}
        <IBSRatingCard
            analysis={ibsAnalysis}
            expanded={expandedSection === 'ibs'}
            onToggle={() => toggleSection('ibs')}
        />

        {/* GERD Analysis Card */}
        <GERDRatingCard
            analysis={gerdAnalysis}
            expanded={expandedSection === 'gerd'}
            onToggle={() => toggleSection('gerd')}
        />

        {/* Radiculopathy Analysis Card */}
        <RadiculopathyRatingCard
            analysis={radiculopathyAnalysis}
            expanded={expandedSection === 'radiculopathy'}
            onToggle={() => toggleSection('radiculopathy')}
        />

        <ChronicFatigueRatingCard
            analysis={chronicFatigueAnalysis}
            expanded={expandedSection === 'chronic-fatigue'}
            onToggle={() => toggleSection('chronic-fatigue')}
        />

        <PeripheralNeuropathyRatingCard
            analysis={peripheralNeuropathyAnalysis}
            expanded={expandedSection === 'peripheral-neuropathy'}
            onToggle={() => toggleSection('peripheral-neuropathy')}
        />

        <MenieresRatingCard
            analysis={menieresAnalysis}
            expanded={expandedSection === 'menieres'}
            onToggle={() => toggleSection('menieres')}
        />

        <RhinitisRatingCard
            analysis={rhinitisAnalysis}
            expanded={expandedSection === 'rhinitis'}
            onToggle={() => toggleSection('rhinitis')}
        />

        <TMJRatingCard
            analysis={tmjAnalysis}
            expanded={expandedSection === 'tmj'}
            onToggle={() => toggleSection('tmj')}
        />

        <PlantarFasciitisRatingCard
            analysis={plantarFasciitisAnalysis}
            expanded={expandedSection === 'plantar-fasciitis'}
            onToggle={() => toggleSection('plantar-fasciitis')}
        />

        <InsomniaRatingCard
            analysis={insomniaAnalysis}
            expanded={expandedSection === 'insomnia'}
            onToggle={() => toggleSection('insomnia')}
        />

        <SinusitisRatingCard
            analysis={sinusitisAnalysis}
            expanded={expandedSection === 'sinusitis'}
            onToggle={() => toggleSection('sinusitis')}
        />

        <ShoulderRatingCard
            analysis={shoulderAnalysis}
            expanded={expandedSection === 'shoulder'}
            onToggle={() => toggleSection('shoulder')}
        />

        <HipRatingCard
            analysis={hipAnalysis}
            expanded={expandedSection === 'hip'}
            onToggle={() => toggleSection('hip')}
        />

        {/* Tinnitus Analysis Card */}
        <GenericRatingCard
            analysis={tinnitusAnalysis}
            expanded={expandedSection === 'tinnitus'}
            onToggle={() => toggleSection('tinnitus')}
            icon="👂"
        />

        {/* Fibromyalgia Analysis Card */}
        <GenericRatingCard
            analysis={fibromyalgiaAnalysis}
            expanded={expandedSection === 'fibromyalgia'}
            onToggle={() => toggleSection('fibromyalgia')}
            icon="💪"
        />

        {/* Sleep Apnea Setup Modal */}
        {showSleepApneaSetup && (
            <SleepApneaSetupModal
                currentProfile={sleepApneaProfile}
                onSave={handleSleepApneaProfileSave}
                onClose={() => setShowSleepApneaSetup(false)}
            />
        )}

        {/* No Data State */}
        {!hasAnyData && (
            <div className="bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6 text-center">
              <p className="text-gray-500 dark:text-gray-400 mb-2">
                No condition data found in the selected period
              </p>
              <p className="text-sm text-gray-400 dark:text-gray-500">
                Start logging symptoms to see how they align with VA rating criteria
              </p>
            </div>
        )}
      </div>
  );
};

/**
 * Migraine Rating Card Component
 */
const MigraineRatingCard = ({ analysis, expanded, onToggle }) => {
  const [showDefinitions, setShowDefinitions] = useState(false);

  if (!analysis.hasData) {
    return (
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4">
          <div className="flex items-center gap-3 mb-2">
            <span className="text-2xl">🤕</span>
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white">Migraine (DC 8100)</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">No data in evaluation period</p>
            </div>
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Log migraine episodes to see rating evidence analysis
          </p>
        </div>
    );
  }

  const { supportedRating, evidence, ratingRationale, gaps } = analysis;
  const ratingColorClass = getRatingColorClass(supportedRating);

  return (
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
        {/* Card Header */}
        <button
            onClick={onToggle}
            className="w-full p-4 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
        >
          <div className="flex items-center gap-3">
            <span className="text-2xl">🤕</span>
            <div className="text-left">
              <h3 className="font-semibold text-gray-900 dark:text-white">
                Migraine (DC 8100)
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {evidence.totalMigraines} episodes logged in {evidence.evaluationPeriod.months} months
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className={`px-3 py-1 rounded-full border font-bold ${ratingColorClass}`}>
              {formatRating(supportedRating)}
            </div>
            <span className="text-gray-400 text-xl">{expanded ? 'âˆ’' : '+'}</span>
          </div>
        </button>

        {/* Expanded Content */}
        {expanded && (
            <div className="border-t border-gray-200 dark:border-gray-700">
              {/* Rating Rationale */}
              <div className="p-4 bg-gray-50 dark:bg-gray-700/30">
                <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  Why {formatRating(supportedRating)}?
                </h4>
                <ul className="space-y-1">
                  {ratingRationale.map((reason, index) => (
                      <li key={index} className="text-sm text-gray-600 dark:text-gray-400 flex items-start gap-2">
                        <span className="text-green-500 mt-0.5">âœ“</span>
                        {reason}
                      </li>
                  ))}
                </ul>
              </div>

              {/* Evidence Summary */}
              <div className="p-4">
                <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                  Your Evidence
                </h4>
                <div className="grid grid-cols-2 gap-3">
                  <StatBox
                      label="Total Migraines"
                      value={evidence.totalMigraines}
                      subtext={`${evidence.monthlyRates.total}/month`}
                  />
                  <StatBox
                      label="Prostrating"
                      value={evidence.prostratingCount}
                      subtext={`${evidence.monthlyRates.prostrating}/month`}
                      highlight={evidence.prostratingCount > 0}
                  />
                  <StatBox
                      label="Prolonged (4+ hrs)"
                      value={evidence.prolongedCount}
                      subtext="of prostrating"
                  />
                  <StatBox
                      label="Non-Prostrating"
                      value={evidence.severityBreakdown.nonProstrating}
                      subtext="not counted for rating"
                      muted
                  />
                </div>
              </div>

              {/* Gaps */}
              {gaps.length > 0 && (
                  <div className="p-4 border-t border-gray-200 dark:border-gray-700">
                    <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                      Documentation Opportunities
                    </h4>
                    <ul className="space-y-2">
                      {gaps.map((gap, index) => (
                          <li key={index} className="text-sm text-amber-700 dark:text-amber-400 flex items-start gap-2">
                            <span className="text-amber-500 mt-0.5">ðŸ’¡</span>
                            {gap}
                          </li>
                      ))}
                    </ul>
                  </div>
              )}

              {/* Rating Scale */}
              <div className="p-4 border-t border-gray-200 dark:border-gray-700">
                <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                  Rating Scale (DC 8100)
                </h4>
                <div className="space-y-2">
                  {getAllMigraineRatings().map((rating) => (
                      <RatingRow
                          key={rating.percent}
                          rating={rating}
                          isSupported={supportedRating === rating.percent}
                      />
                  ))}
                </div>
              </div>

              {/* Definitions */}
              <div className="p-4 border-t border-gray-200 dark:border-gray-700">
                <button
                    onClick={() => setShowDefinitions(!showDefinitions)}
                    className="text-sm text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1"
                >
                  {showDefinitions ? 'â–¼' : 'â–¶'} Key Term Definitions
                </button>

                {showDefinitions && (
                    <div className="mt-3 space-y-3">
                      <DefinitionBox definition={getMigraineDefinition('prostrating')} />
                      <DefinitionBox definition={getMigraineDefinition('prolonged')} />
                      <DefinitionBox definition={getMigraineDefinition('economicInadaptability')} />
                    </div>
                )}
              </div>
            </div>
        )}
      </div>
  );
};

/**
 * Sleep Apnea Rating Card Component
 */
const SleepApneaRatingCard = ({ analysis, profile, expanded, onToggle, onSetupClick }) => {
  const [showDefinitions, setShowDefinitions] = useState(false);

  const { supportedRating, evidence, ratingRationale, gaps, requiresProfileSetup } = analysis;
  const ratingColorClass = supportedRating !== null ? getRatingColorClass(supportedRating) : 'bg-gray-100 text-gray-600 border-gray-300 dark:bg-gray-700 dark:text-gray-400 dark:border-gray-600';

  // Device type display
  const deviceTypeLabels = {
    cpap: 'CPAP',
    bipap: 'BiPAP',
    apap: 'APAP',
    inspire: 'Inspire Implant',
    other: 'Other Device',
  };

  return (
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
        {/* Card Header */}
        <button
            onClick={onToggle}
            className="w-full p-4 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
        >
          <div className="flex items-center gap-3">
            <span className="text-2xl">😴</span>
            <div className="text-left">
              <h3 className="font-semibold text-gray-900 dark:text-white">
                Sleep Apnea (DC 6847)
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {requiresProfileSetup
                    ? 'Profile setup required'
                    : profile.usesBreathingDevice
                        ? `Using ${deviceTypeLabels[profile.deviceType] || 'breathing device'}`
                        : 'Diagnosed, no device'
                }
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className={`px-3 py-1 rounded-full border font-bold ${ratingColorClass}`}>
              {formatRating(supportedRating)}
            </div>
            <span className="text-gray-400 text-xl">{expanded ? 'âˆ’' : '+'}</span>
          </div>
        </button>

        {/* Expanded Content */}
        {expanded && (
            <div className="border-t border-gray-200 dark:border-gray-700">
              {/* Setup Required Banner */}
              {requiresProfileSetup && (
                  <div className="p-4 bg-blue-50 dark:bg-blue-900/20 border-b border-blue-200 dark:border-blue-800">
                    <p className="text-sm text-blue-800 dark:text-blue-300 mb-3">
                      To analyze your Sleep Apnea rating, we need to know about your diagnosis and treatment.
                    </p>
                    <button
                        onClick={onSetupClick}
                        className="w-full py-2 px-4 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      Set Up Sleep Apnea Profile
                    </button>
                  </div>
              )}

              {/* Rating Rationale */}
              {!requiresProfileSetup && (
                  <div className="p-4 bg-gray-50 dark:bg-gray-700/30">
                    <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                      Why {formatRating(supportedRating)}?
                    </h4>
                    <ul className="space-y-1">
                      {ratingRationale.map((reason, index) => (
                          <li key={index} className="text-sm text-gray-600 dark:text-gray-400 flex items-start gap-2">
                            <span className="text-green-500 mt-0.5">âœ“</span>
                            {reason}
                          </li>
                      ))}
                    </ul>
                  </div>
              )}

              {/* Evidence Summary */}
              {!requiresProfileSetup && evidence.sleepLogs.total > 0 && (
                  <div className="p-4">
                    <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                      Sleep Log Summary
                    </h4>
                    <div className="grid grid-cols-2 gap-3">
                      <StatBox
                          label="Sleep Logs"
                          value={evidence.sleepLogs.total}
                          subtext={`in ${evidence.evaluationPeriod.months} months`}
                      />
                      <StatBox
                          label="Unrested Nights"
                          value={evidence.sleepLogs.unrestedNights}
                          highlight={evidence.sleepLogs.unrestedNights > 5}
                      />
                      {evidence.sleepLogs.avgSleepQuality && (
                          <StatBox
                              label="Avg Sleep Quality"
                              value={evidence.sleepLogs.avgSleepQuality}
                              subtext="out of 10"
                          />
                      )}
                      {evidence.sleepLogs.avgHoursSlept && (
                          <StatBox
                              label="Avg Hours Slept"
                              value={evidence.sleepLogs.avgHoursSlept}
                              subtext="per night"
                          />
                      )}
                    </div>
                  </div>
              )}

              {/* Profile Summary */}
              {!requiresProfileSetup && (
                  <div className="p-4 border-t border-gray-200 dark:border-gray-700">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                        Your Profile
                      </h4>
                      <button
                          onClick={onSetupClick}
                          className="text-xs text-blue-600 dark:text-blue-400 hover:underline"
                      >
                        Edit
                      </button>
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                      <p>
                        <span className="font-medium">Diagnosis:</span>{' '}
                        {profile.hasDiagnosis ? 'Yes' : 'No'}
                      </p>
                      <p>
                        <span className="font-medium">Breathing Device:</span>{' '}
                        {profile.usesBreathingDevice
                            ? deviceTypeLabels[profile.deviceType] || 'Yes'
                            : 'No'
                        }
                      </p>
                    </div>
                  </div>
              )}

              {/* Gaps */}
              {gaps.length > 0 && (
                  <div className="p-4 border-t border-gray-200 dark:border-gray-700">
                    <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                      Documentation Opportunities
                    </h4>
                    <ul className="space-y-2">
                      {gaps.map((gap, index) => (
                          <li key={index} className="text-sm text-amber-700 dark:text-amber-400 flex items-start gap-2">
                            <span className="text-amber-500 mt-0.5">ðŸ’¡</span>
                            {gap}
                          </li>
                      ))}
                    </ul>
                  </div>
              )}

              {/* Rating Scale */}
              <div className="p-4 border-t border-gray-200 dark:border-gray-700">
                <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                  Rating Scale (DC 6847)
                </h4>
                <div className="space-y-2">
                  {getAllSleepApneaRatings().map((rating) => (
                      <RatingRow
                          key={rating.percent}
                          rating={rating}
                          isSupported={supportedRating === rating.percent}
                      />
                  ))}
                </div>
              </div>

              {/* Definitions */}
              <div className="p-4 border-t border-gray-200 dark:border-gray-700">
                <button
                    onClick={() => setShowDefinitions(!showDefinitions)}
                    className="text-sm text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1"
                >
                  {showDefinitions ? 'â–¼' : 'â–¶'} Key Term Definitions
                </button>

                {showDefinitions && (
                    <div className="mt-3 space-y-3">
                      <DefinitionBox definition={getSleepApneaDefinition('breathingDevice')} />
                      <DefinitionBox definition={getSleepApneaDefinition('hypersomnolence')} />
                      <DefinitionBox definition={getSleepApneaDefinition('sleepStudy')} />
                    </div>
                )}
              </div>
            </div>
        )}
      </div>
  );
};

/**
 * Sleep Apnea Setup Modal
 */
const SleepApneaSetupModal = ({ currentProfile, onSave, onClose }) => {
  const [hasDiagnosis, setHasDiagnosis] = useState(currentProfile.hasDiagnosis ?? null);
  const [usesBreathingDevice, setUsesBreathingDevice] = useState(currentProfile.usesBreathingDevice ?? null);
  const [deviceType, setDeviceType] = useState(currentProfile.deviceType ?? '');

  const handleSave = () => {
    onSave({
      hasDiagnosis,
      usesBreathingDevice,
      deviceType: usesBreathingDevice ? deviceType : null,
    });
  };

  const canSave = hasDiagnosis !== null && (hasDiagnosis === false || usesBreathingDevice !== null);

  return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white dark:bg-gray-800 rounded-lg w-full max-w-md overflow-hidden shadow-xl">
          <div className="p-4 border-b border-gray-200 dark:border-gray-700">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
              Sleep Apnea Profile
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Help us analyze your rating evidence
            </p>
          </div>

          <div className="p-4 space-y-6">
            {/* Diagnosis Question */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Do you have a sleep apnea diagnosis?
              </label>
              <div className="flex gap-3">
                <button
                    type="button"
                    onClick={() => setHasDiagnosis(true)}
                    className={`flex-1 py-2 px-4 rounded-lg border-2 font-medium transition-colors ${
                        hasDiagnosis === true
                            ? 'bg-blue-100 border-blue-500 text-blue-700 dark:bg-blue-900/30 dark:border-blue-500 dark:text-blue-300'
                            : 'bg-white border-gray-300 text-gray-700 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-300'
                    }`}
                >
                  Yes
                </button>
                <button
                    type="button"
                    onClick={() => {
                      setHasDiagnosis(false);
                      setUsesBreathingDevice(false);
                    }}
                    className={`flex-1 py-2 px-4 rounded-lg border-2 font-medium transition-colors ${
                        hasDiagnosis === false
                            ? 'bg-blue-100 border-blue-500 text-blue-700 dark:bg-blue-900/30 dark:border-blue-500 dark:text-blue-300'
                            : 'bg-white border-gray-300 text-gray-700 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-300'
                    }`}
                >
                  No
                </button>
              </div>
            </div>

            {/* Breathing Device Question */}
            {hasDiagnosis && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Do you use a CPAP or other breathing device?
                  </label>
                  <div className="flex gap-3">
                    <button
                        type="button"
                        onClick={() => setUsesBreathingDevice(true)}
                        className={`flex-1 py-2 px-4 rounded-lg border-2 font-medium transition-colors ${
                            usesBreathingDevice === true
                                ? 'bg-blue-100 border-blue-500 text-blue-700 dark:bg-blue-900/30 dark:border-blue-500 dark:text-blue-300'
                                : 'bg-white border-gray-300 text-gray-700 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-300'
                        }`}
                    >
                      Yes
                    </button>
                    <button
                        type="button"
                        onClick={() => {
                          setUsesBreathingDevice(false);
                          setDeviceType('');
                        }}
                        className={`flex-1 py-2 px-4 rounded-lg border-2 font-medium transition-colors ${
                            usesBreathingDevice === false
                                ? 'bg-blue-100 border-blue-500 text-blue-700 dark:bg-blue-900/30 dark:border-blue-500 dark:text-blue-300'
                                : 'bg-white border-gray-300 text-gray-700 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-300'
                        }`}
                    >
                      No
                    </button>
                  </div>
                </div>
            )}

            {/* Device Type */}
            {usesBreathingDevice && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    What type of device?
                  </label>
                  <select
                      value={deviceType}
                      onChange={(e) => setDeviceType(e.target.value)}
                      className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg
                           bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  >
                    <option value="">Select device type...</option>
                    <option value="cpap">CPAP (Continuous Positive Airway Pressure)</option>
                    <option value="bipap">BiPAP (Bilevel Positive Airway Pressure)</option>
                    <option value="apap">APAP (Automatic/Auto-adjusting)</option>
                    <option value="inspire">Inspire Implant (Hypoglossal Nerve Stimulator)</option>
                    <option value="other">Other</option>
                  </select>
                </div>
            )}

            {/* Rating Preview */}
            {canSave && (
                <div className="bg-gray-50 dark:bg-gray-700/30 rounded-lg p-3">
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    <strong>Based on your answers:</strong>
                  </p>
                  <p className="text-lg font-bold text-gray-900 dark:text-white mt-1">
                    {usesBreathingDevice
                        ? '50% - Requires breathing assistance device'
                        : hasDiagnosis
                            ? '0-30% - Depends on daytime sleepiness documentation'
                            : 'No rating - Diagnosis required'
                    }
                  </p>
                </div>
            )}
          </div>

          {/* Actions */}
          <div className="p-4 border-t border-gray-200 dark:border-gray-700 flex gap-3">
            <button
                onClick={onClose}
                className="flex-1 py-2 px-4 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300
                       font-medium rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            >
              Cancel
            </button>
            <button
                onClick={handleSave}
                disabled={!canSave}
                className={`flex-1 py-2 px-4 font-medium rounded-lg transition-colors ${
                    canSave
                        ? 'bg-blue-600 text-white hover:bg-blue-700'
                        : 'bg-gray-300 text-gray-500 cursor-not-allowed dark:bg-gray-600 dark:text-gray-400'
                }`}
            >
              Save
            </button>
          </div>
        </div>
      </div>
  );
};


/**
 * Generic Mental Health Rating Card Component
 * Used for all mental health conditions (PTSD, Depression, Anxiety, Bipolar, etc.)
 * All share the same General Rating Formula for Mental Disorders
 */
const MentalHealthRatingCard = ({ analysis, expanded, onToggle, icon = '🧠', getAllRatings, getDefinition }) => {
  const [showDefinitions, setShowDefinitions] = useState(false);

  if (!analysis.hasData) {
    return (
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4">
          <div className="flex items-center gap-3 mb-2">
            <span className="text-2xl">{icon}</span>
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white">
                {analysis.condition} (DC {analysis.diagnosticCode})
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">No data in evaluation period</p>
            </div>
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Log {analysis.condition} symptoms to see rating evidence analysis
          </p>
        </div>
    );
  }

  const { supportedRating, evidence, ratingRationale, gaps, assessmentLevel } = analysis;

  return (
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
        {/* Card Header */}
        <button
            onClick={onToggle}
            className="w-full p-4 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
        >
          <div className="flex items-center gap-3">
            <span className="text-2xl">{icon}</span>
            <div className="text-left">
              <h3 className="font-semibold text-gray-900 dark:text-white">
                {analysis.condition} (DC {analysis.diagnosticCode})
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                General Rating Formula for Mental Disorders
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            {/* Supported Rating Badge */}
            <div className={`px-3 py-1 rounded-full text-sm font-medium border ${
                assessmentLevel === 'requires-professional-evaluation'
                    ? 'bg-red-100 text-red-800 border-red-300 dark:bg-red-900/30 dark:text-red-300 dark:border-red-700'
                    : 'bg-blue-100 text-blue-800 border-blue-300 dark:bg-blue-900/30 dark:text-blue-300 dark:border-blue-700'
            }`}>
              {supportedRating}%
            </div>
            {/* Expand Icon */}
            <svg
                className={`w-5 h-5 text-gray-400 transition-transform ${expanded ? 'rotate-180' : ''}`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7"/>
            </svg>
          </div>
        </button>

        {/* Expanded Content */}
        {expanded && (
            <div className="border-t border-gray-200 dark:border-gray-700">
              {/* Crisis Warning if severe symptoms detected */}
              {assessmentLevel === 'requires-professional-evaluation' && evidence.functionalImpact.severeSymptoms > 0 && (
                  <div className="bg-red-50 dark:bg-red-900/20 border-l-4 border-red-500 p-4 m-4">
                    <div className="flex items-start gap-3">
                      <span className="text-2xl">⚠️</span>
                      <div className="flex-1">
                        <h4 className="font-bold text-red-900 dark:text-red-300 mb-2">
                          Crisis Support Available 24/7
                        </h4>
                        <p className="text-sm text-red-800 dark:text-red-400 mb-3">
                          If you're experiencing a crisis or having thoughts of suicide:
                        </p>
                        <div className="space-y-2 text-sm text-red-800 dark:text-red-400">
                          <div>
                            <strong>Call:</strong> Veterans Crisis Line - Dial 988, then Press 1
                          </div>
                          <div>
                            <strong>Text:</strong> 838255
                          </div>
                          <div>
                            <strong>Chat:</strong> VeteransCrisisLine.net/chat
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
              )}

              {/* Analysis Summary */}
              <div className="p-4 space-y-3">
                <div>
                  <h4 className="font-medium text-gray-900 dark:text-white mb-2">
                    Evidence Summary
                  </h4>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                    <StatBox
                        label="Total Symptoms"
                        value={evidence.totalSymptoms}
                        subtext={`${evidence.symptomsPerMonth}/month`}
                    />
                    <StatBox
                        label="Symptom Types"
                        value={evidence.symptomTypesPresent.length}
                        subtext="categories"
                    />
                    <StatBox
                        label="Panic-Related"
                        value={evidence.panicAttacks.total}
                        subtext={`${evidence.panicAttacks.perWeek}/week`}
                        highlight={parseFloat(evidence.panicAttacks.perWeek) > 1}
                    />
                    <StatBox
                        label="Functional Impact"
                        value={evidence.functionalImpact.workImpact + evidence.functionalImpact.socialImpact}
                        subtext="logged impacts"
                    />
                  </div>
                </div>

                {/* Rationale */}
                <div>
                  <h4 className="font-medium text-gray-900 dark:text-white mb-2">
                    Analysis Rationale
                  </h4>
                  <div className="bg-gray-50 dark:bg-gray-700/30 rounded-lg p-3 space-y-2">
                    {ratingRationale.map((reason, i) => (
                        <div key={i} className="flex items-start gap-2">
                          <span className="text-blue-600 dark:text-blue-400 mt-0.5">•</span>
                          <span className="text-sm text-gray-700 dark:text-gray-300">{reason}</span>
                        </div>
                    ))}
                  </div>
                </div>

                {/* Rating Schedule */}
                <div>
                  <h4 className="font-medium text-gray-900 dark:text-white mb-2">
                    VA Rating Schedule
                  </h4>
                  <div className="space-y-2">
                    {getAllRatings().map(rating => (
                        <RatingRow
                            key={rating.percent}
                            rating={rating}
                            isSupported={
                              typeof supportedRating === 'number'
                                  ? rating.percent === supportedRating
                                  : supportedRating.includes(rating.percent.toString())
                            }
                        />
                    ))}
                  </div>
                </div>

                {/* Gaps */}
                {gaps.length > 0 && (
                    <div>
                      <h4 className="font-medium text-gray-900 dark:text-white mb-2">
                        Documentation Gaps
                      </h4>
                      <div className="bg-yellow-50 dark:bg-yellow-900/20 rounded-lg p-3 space-y-2">
                        {gaps.map((gap, i) => (
                            <div key={i} className="flex items-start gap-2">
                              <span className="text-yellow-600 dark:text-yellow-400 mt-0.5">⚠</span>
                              <span className="text-sm text-gray-700 dark:text-gray-300">{gap}</span>
                            </div>
                        ))}
                      </div>
                    </div>
                )}

                {/* Key Definitions */}
                <div>
                  <button
                      onClick={() => setShowDefinitions(!showDefinitions)}
                      className="flex items-center gap-2 text-sm text-blue-600 dark:text-blue-400 hover:underline"
                  >
                    <span>📖</span>
                    <span>{showDefinitions ? 'Hide' : 'Show'} VA Rating Definitions</span>
                  </button>

                  {showDefinitions && (
                      <div className="mt-3 space-y-2">
                        <DefinitionBox definition={getDefinition('generalRatingFormula')}/>
                        <DefinitionBox definition={getDefinition('occupationalImpairment')}/>
                        <DefinitionBox definition={getDefinition('socialImpairment')}/>
                      </div>
                  )}
                </div>

                {/* Important Notes */}
                <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4 border-l-4 border-blue-500">
                  <h4 className="font-medium text-blue-900 dark:text-blue-300 mb-2">
                    Important: Mental Health Rating Considerations
                  </h4>
                  <ul className="space-y-2 text-sm text-blue-800 dark:text-blue-400">
                    {analysis.criteria.importantNotes.map((note, i) => (
                        <li key={i} className="flex items-start gap-2">
                          <span className="mt-0.5">•</span>
                          <span>{note}</span>
                        </li>
                    ))}
                  </ul>
                </div>

                {/* Disclaimer */}
                <div className="bg-gray-100 dark:bg-gray-700/50 rounded-lg p-3 text-xs text-gray-600 dark:text-gray-400">
                  <strong>CRITICAL DISCLAIMER:</strong> {analysis.disclaimer}
                </div>
              </div>
            </div>
        )}
      </div>
  );
};

/**
 * PTSD Rating Card Component (uses the generic MentalHealthRatingCard)
 */
const PTSDRatingCard = ({ analysis, expanded, onToggle }) => {
  return (
      <MentalHealthRatingCard
          analysis={analysis}
          expanded={expanded}
          onToggle={onToggle}
          icon="🧠"
          getAllRatings={getAllPTSDRatings}
          getDefinition={getPTSDDefinition}
      />
  );
};

/**
 * Generic Rating Card Component for simpler conditions
 */
const GenericRatingCard = ({ analysis, expanded, onToggle, icon }) => {
  const [showDefinitions, setShowDefinitions] = useState(false);

  if (!analysis.hasData) return null;

  const {
    condition,
    diagnosticCode,
    supportedRating,
    ratingRationale,
    evidence,
    gaps,
    criteria,
    disclaimer,
  } = analysis;

  return (
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
        {/* Header */}
        <button
            onClick={onToggle}
            className="w-full p-4 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
        >
          <div className="flex items-center gap-3">
            <span className="text-2xl">{icon}</span>
            <div className="text-left">
              <h3 className="font-semibold text-gray-900 dark:text-white">
                {condition}
              </h3>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                DC {diagnosticCode} • {criteria.cfrReference}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            {supportedRating && (
                <span className={`px-3 py-1 rounded-full text-sm font-medium border ${
                    supportedRating.includes('Requires') || supportedRating.includes('Clinical')
                        ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 border-blue-300 dark:border-blue-700'
                        : 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 border-green-300 dark:border-green-700'
                }`}>
                  {supportedRating}
                </span>
            )}
            <svg
                className={`w-5 h-5 text-gray-400 transition-transform ${expanded ? 'rotate-180' : ''}`}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7"/>
            </svg>
          </div>
        </button>

        {/* Expanded Content */}
        {expanded && (
            <div className="p-4 border-t border-gray-200 dark:border-gray-700">
              <div className="space-y-4">
                {/* Evidence Summary */}
                <div>
                  <h4 className="font-medium text-gray-900 dark:text-white mb-2">
                    Evidence Summary
                  </h4>
                  <div className="bg-gray-50 dark:bg-gray-700/30 rounded-lg p-3 space-y-2">
                    {evidence.map((item, i) => (
                        <div key={i} className="flex items-start gap-2">
                          <span className="text-green-600 dark:text-green-400 mt-0.5">✓</span>
                          <span className="text-sm text-gray-700 dark:text-gray-300">{item}</span>
                        </div>
                    ))}
                  </div>
                </div>

                {/* Rationale */}
                {ratingRationale && ratingRationale.length > 0 && (
                    <div>
                      <h4 className="font-medium text-gray-900 dark:text-white mb-2">
                        Analysis Rationale
                      </h4>
                      <div className="bg-gray-50 dark:bg-gray-700/30 rounded-lg p-3 space-y-2">
                        {ratingRationale.map((reason, i) => (
                            <div key={i} className="flex items-start gap-2">
                              <span className="text-blue-600 dark:text-blue-400 mt-0.5">•</span>
                              <span className="text-sm text-gray-700 dark:text-gray-300">{reason}</span>
                            </div>
                        ))}
                      </div>
                    </div>
                )}

                {/* VA Rating Schedule */}
                {criteria.ratings && criteria.ratings.length > 0 && (
                    <div>
                      <h4 className="font-medium text-gray-900 dark:text-white mb-2">
                        VA Rating Schedule
                      </h4>
                      <div className="space-y-2">
                        {criteria.ratings.map(rating => (
                            <RatingRow
                                key={rating.percent}
                                rating={rating}
                                isSupported={
                                  typeof supportedRating === 'number'
                                      ? rating.percent === supportedRating
                                      : supportedRating && supportedRating.includes(rating.percent.toString())
                                }
                            />
                        ))}
                      </div>
                    </div>
                )}

                {/* Documentation Gaps */}
                {gaps && gaps.length > 0 && (
                    <div>
                      <h4 className="font-medium text-gray-900 dark:text-white mb-2">
                        Documentation Gaps
                      </h4>
                      <div className="bg-yellow-50 dark:bg-yellow-900/20 rounded-lg p-3 space-y-2">
                        {gaps.map((gap, i) => (
                            <div key={i} className="flex items-start gap-2">
                              <span className="text-yellow-600 dark:text-yellow-400 mt-0.5">⚠</span>
                              <span className="text-sm text-gray-700 dark:text-gray-300">{gap}</span>
                            </div>
                        ))}
                      </div>
                    </div>
                )}

                {/* Key Definitions */}
                {criteria.definitions && Object.keys(criteria.definitions).length > 0 && (
                    <div>
                      <button
                          onClick={() => setShowDefinitions(!showDefinitions)}
                          className="flex items-center gap-2 text-sm text-blue-600 dark:text-blue-400 hover:underline"
                      >
                        <span>📖</span>
                        <span>{showDefinitions ? 'Hide' : 'Show'} VA Rating Definitions</span>
                      </button>

                      {showDefinitions && (
                          <div className="mt-3 space-y-2">
                            {Object.values(criteria.definitions).map((def, i) => (
                                <DefinitionBox key={i} definition={def}/>
                            ))}
                          </div>
                      )}
                    </div>
                )}

                {/* Disclaimer */}
                {disclaimer && (
                    <div className="bg-gray-100 dark:bg-gray-700/50 rounded-lg p-3 text-xs text-gray-600 dark:text-gray-400">
                      <strong>Important:</strong> {disclaimer}
                    </div>
                )}
              </div>
            </div>
        )}
      </div>
  );
};

/**
 * Stat Box Component
 */
const StatBox = ({ label, value, subtext, highlight = false, muted = false }) => (
    <div className={`p-3 rounded-lg border ${
        highlight
            ? 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800'
            : muted
                ? 'bg-gray-50 dark:bg-gray-700/30 border-gray-200 dark:border-gray-600'
                : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700'
    }`}>
      <div className={`text-2xl font-bold ${
          muted ? 'text-gray-400 dark:text-gray-500' : 'text-gray-900 dark:text-white'
      }`}>
        {value}
      </div>
      <div className={`text-xs ${
          muted ? 'text-gray-400 dark:text-gray-500' : 'text-gray-600 dark:text-gray-400'
      }`}>
        {label}
      </div>
      {subtext && (
          <div className={`text-xs mt-1 ${
              muted ? 'text-gray-400 dark:text-gray-500' : 'text-gray-500 dark:text-gray-500'
          }`}>
            {subtext}
          </div>
      )}
    </div>
);

/**
 * Rating Row Component
 */
const RatingRow = ({ rating, isSupported }) => {
  const colorClass = getRatingColorClass(rating.percent);

  return (
      <div className={`p-2 rounded-lg border flex items-center gap-3 ${
          isSupported
              ? `${colorClass} border-2`
              : 'bg-gray-50 dark:bg-gray-700/30 border-gray-200 dark:border-gray-600'
      }`}>
        <div className={`w-12 text-center font-bold ${
            isSupported ? '' : 'text-gray-500 dark:text-gray-400'
        }`}>
          {formatRating(rating.percent)}
        </div>
        <div className={`flex-1 text-sm ${
            isSupported ? '' : 'text-gray-500 dark:text-gray-400'
        }`}>
          {rating.summary}
        </div>
        {isSupported && (
            <span className="text-green-600 dark:text-green-400">✓</span>
        )}
      </div>
  );
};

/**
 * Definition Box Component
 */
const DefinitionBox = ({ definition }) => {
  if (!definition) return null;

  return (
      <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-3">
        <h5 className="font-medium text-blue-900 dark:text-blue-300 text-sm">
          {definition.term}
        </h5>
        <p className="text-sm text-blue-800 dark:text-blue-400 mt-1">
          {definition.definition}
        </p>
        {definition.examples && (
            <ul className="mt-2 text-xs text-blue-700 dark:text-blue-400 space-y-1">
              {definition.examples.map((example, i) => (
                  <li key={i}>• {example}</li>
              ))}
            </ul>
        )}
        {definition.threshold && (
            <p className="mt-2 text-xs text-blue-600 dark:text-blue-500">
              Threshold: {definition.threshold}
            </p>
        )}
      </div>
  );
};

export default RatingEvidence;