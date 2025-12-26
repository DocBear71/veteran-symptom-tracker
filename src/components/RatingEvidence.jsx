import { useState, useEffect, useMemo, memo } from 'react';
import { getSymptomLogs, saveSymptomLog, getChronicSymptoms } from '../utils/storage';
import { getMeasurements } from '../utils/measurements';
import { getProfileType, PROFILE_TYPES } from '../utils/profile';
import { getSuggestedConditions } from '../data/symptoms';
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
  analyzeTBIResidualsLogs,
  analyzeHypertensionLogs,
  analyzeTinnitusLogs,
  analyzeFibromyalgiaLogs,
  analyzeDiabetesLogs,
  analyzeIBSLogs,
  analyzeGERDLogs,
  analyzeGERDComplicationsLogs,
  analyzeUlcerativeColitisLogs,
  analyzePepticUlcerLogs,
  analyzeHemorrhoidLogs,
  analyzeDiverticulitisLogs,
  analyzeHypothyroidismLogs,
  analyzeRaynaudsLogs,
  analyzeVaricoseVeinsLogs,
  analyzeChronicUrticariaLogs,
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
  analyzeAsthmaLogs,
  analyzeHearingLossLogs,
  analyzeScarsLogs,
  analyzePsoriasisLogs,
  analyzeEczemaLogs,
  analyzeSocialAnxietyLogs,
  analyzeOCDLogs,
  analyzePersistentDepressiveLogs,
  analyzeAdjustmentDisorderLogs,
  analyzeUnspecifiedAnxietyLogs,
  analyzeUnspecifiedDepressiveLogs,
  analyzeEpilepsyMajorLogs,
  analyzeEpilepsyMinorLogs,
  analyzeJacksonianEpilepsyLogs,
  analyzeDiencephalicEpilepsyLogs,
  analyzePsychomotorEpilepsyLogs,
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
  analyzeSomaticSymptomDisorderLogs,
  analyzeOtherSpecifiedSomaticLogs,
  analyzeUnspecifiedSomaticLogs,
  analyzeIllnessAnxietyLogs,
  analyzeOtherSpecifiedAnxietyLogs,
  analyzeDepersonalizationLogs,
  analyzeCyclothymicLogs,
  analyzeAnorexiaNervosaLogs,
  analyzeBulimiaNervosaLogs,
  analyzeSchizophreniaLogs,
  analyzeSchizoaffectiveDisorderLogs,
  analyzeDelusionalDisorderLogs,
  analyzePsychoticDisorderNOSLogs,
  analyzeBriefPsychoticDisorderLogs,
  analyzeBingeEatingDisorderLogs,
  analyzeDissociativeIdentityDisorderLogs,
  analyzeDissociativeAmnesiaLogs,
  analyzeAcuteStressDisorderLogs,
  analyzeAntisocialPersonalityDisorderLogs,
  analyzeBorderlinePersonalityDisorderLogs,
  analyzeNarcissisticPersonalityDisorderLogs,
  analyzeAvoidantPersonalityDisorderLogs,
  analyzeCardiomyopathyLogs,
  analyzeCADLogs,
  analyzePostMILogs,
  analyzeHypertensiveHeartLogs,
  analyzeColdInjuryLogs,
  analyzePADLogs,
  analyzeSVTLogs,
  analyzeVentricularArrhythmiaLogs,
  analyzePericarditisLogs,
  analyzePostPhlebiticLogs,
  analyzeCirrhosisLogs,
  analyzeGastritisLogs,
  analyzePancreatitisLogs,
  analyzeBiliaryTractLogs,
  analyzeCOPDLogs,
  analyzeChronicBronchitisLogs,
  analyzeEmphysemaLogs,
  analyzeBronchiectasisLogs,
  analyzePulmonaryFibrosisLogs,
  analyzeSarcoidosisLogs,
  analyzeMultipleSclerosisLogs,
  analyzeParkinsonsDiseaseLogs,
  analyzeMyastheniaGravisLogs,
  analyzeNarcolepsyLogs,
  analyzeALSLogs,
  analyzeSyringomyeliaLogs,
  analyzeMyelitisLogs,
  analyzeUpperRadicularGroupLogs,
  analyzeMiddleRadicularGroupLogs,
  analyzeLowerRadicularGroupLogs,
  analyzeAllRadicularGroupsLogs,
  analyzeRadialNerveLogs,
  analyzeMedianNerveLogs,
  analyzeUlnarNerveLogs,
  analyzeMusculocutaneousNerveLogs,
  analyzeCircumflexNerveLogs,
  analyzeLongThoracicNerveLogs,
  analyzeSciaticNerveLogs,
  analyzeCommonPeronealNerveLogs,
  analyzeSuperficialPeronealNerveLogs,
  analyzeDeepPeronealNerveLogs,
  analyzeTibialNerveLogs,
  analyzePosteriorTibialNerveLogs,
  analyzeFemoralNerveLogs,
  analyzeSaphenousNerveLogs,
  analyzeObturatorNerveLogs,
  analyzeLateralFemoralCutaneousNerveLogs,
  analyzeIlioinguinalNerveLogs,
  analyzeHyperthyroidismLogs,
  analyzeThyroiditisLogs,
  analyzeHyperparathyroidismLogs,
  analyzeHypoparathyroidismLogs,
  analyzeAddisonsDiseaseLog,
  analyzeCushingsSyndromeLogs,
  analyzeDiabetesInsipidusLogs,
  analyzeHyperaldosteronismLogs,
  analyzeGoutLogs,
  analyzeBursitisLogs,
  analyzeTendinitisLogs,
  analyzeMyositisLogs,
  analyzeOsteomyelitisLogs,
  analyzeMultiJointArthritisLogs,
  analyzeVertebralFractureLogs,
  analyzeSacroiliacInjuryLogs,
  analyzeSpinalStenosisLogs,
  analyzeAnkylosingSpondylitisLogs,
  analyzeSpinalFusionLogs,
  analyzeWeakFootLogs,
  analyzeClawFootLogs,
  analyzeMetatarsalgiaLogs,
  analyzeHalluxValgusLogs,
  analyzeHalluxRigidusLogs,
  analyzeHerniaLogs,
  analyzePeritonealAdhesionsLogs,
  analyzeEsophagealLogs,
  analyzePostgastrectomyLogs,
  analyzeIntestinalFistulaLogs,
  analyzeAcneLogs,
  analyzeChloracneLogs,
  analyzeAlopeciaAreataLogs,
  analyzeHyperhidrosisLogs,
  analyzeDiscoidLupusLogs,
  analyzeBullousDisordersLogs,
  analyzeCutaneousVasculitisLogs,
  analyzeDermatophytosisLogs,
  analyzeSkinInfectionsLogs,
  analyzeUveitis,
  analyzeKeratitis,
  analyzeChronicConjunctivitis,
  analyzeScleritis,
  analyzePeripheralVestibular,
  analyzeChronicSuppurativeOtitisMedia,
  analyzeChronicOtitisExterna,
  analyzeChronicNonsuppurativeOtitisMedia,
  getAllMigraineRatings,
  getAllSleepApneaRatings,
  getAllPTSDRatings,
  getAllMajorDepressionRatings,
  getAllGeneralizedAnxietyRatings,
  getAllPanicDisorderRatings,
  getAllBipolarRatings,
  getAllSocialAnxietyRatings,
  getAllOCDRatings,
  getAllPersistentDepressiveRatings,
  getAllAdjustmentDisorderRatings,
  getAllUnspecifiedAnxietyRatings,
  getAllUnspecifiedDepressiveRatings,
  getAllEpilepsyMajorRatings,
  getAllEpilepsyMinorRatings,
  getAllMalariaRatings,
  getAllBrucellosisRatings,
  getAllCampylobacterRatings,
  getAllQFeverRatings,
  getAllSalmonellaRatings,
  getAllShigellaRatings,
  getAllWestNileRatings,
  getAllNTMRatings,
  getAllSomaticSymptomDisorderRatings,
  getAllOtherSpecifiedSomaticRatings,
  getAllUnspecifiedSomaticRatings,
  getAllIllnessAnxietyRatings,
  getAllOtherSpecifiedAnxietyRatings,
  getAllDepersonalizationRatings,
  getAllCyclothymicRatings,
  getAllAnorexiaNervosaRatings,
  getAllBulimiaNervosaRatings,
  getEpilepsyMajorDefinition,
  getEpilepsyMinorDefinition,
  getMigraineDefinition,
  getSleepApneaDefinition,
  getPTSDDefinition,
  getMajorDepressionDefinition,
  getGeneralizedAnxietyDefinition,
  getPanicDisorderDefinition,
  getBipolarDefinition,
  getSocialAnxietyDefinition,
  getOCDDefinition,
  getPersistentDepressiveDefinition,
  getAdjustmentDisorderDefinition,
  getUnspecifiedAnxietyDefinition,
  getUnspecifiedDepressiveDefinition,
  getRatingColorClass,
  getMalariaDefinition,
  getBrucellosisDefinition,
  getCampylobacterDefinition,
  getQFeverDefinition,
  getSalmonellaRatingCriteria,
  getShigellaRatingCriteria,
  getWestNileRatingCriteria,
  getNTMRatingCriteria,
  getSomaticSymptomDisorderDefinition,
  getOtherSpecifiedSomaticDefinition,
  getIllnessAnxietyDefinition,
  getOtherSpecifiedAnxietyDefinition,
  getUnspecifiedSomaticDefinition,
  getDepersonalizationDefinition,
  getCyclothymicDefinition,
  getAnorexiaNervosaDefinition,
  getBulimiaNervosaDefinition,
  formatRating,
} from '../utils/ratingCriteria';
import MigraineRatingCard from './MigraineRatingCard';
import SleepApneaRatingCard from './SleepApneaRatingCard';
import MentalHealthRatingCard from './MentalHealthRatingCard';
import PTSDRatingCard from './PTSDRatingCard';
import GenericRatingCard from './GenericRatingCard';
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
import AsthmaRatingCard from './AsthmaRatingCard';
import EczemaRatingCard from './EczemaRatingCard';
import GERDComplicationsRatingCard from './GERDComplicationsRatingCard';
import HearingLossRatingCard from './HearingLossRatingCard.jsx';
import PsoriasisRatingCard from './PsoriasisRatingCard.jsx';
import SeizureRatingCard from './SeizureRatingCard';
import EpilepsyExpansionRatingCard from './EpilepsyExpansionRatingCard';
import ScarsRatingCard from './ScarsRatingCard.jsx';
import TBIResidualsRatingCard from './TBIResidualsRatingCard.jsx';
import GenericJointRatingCard from './GenericJointRatingCard';
import EyeVisionRatingCard from './EyeVisionRatingCard';
import KidneyStonesRatingCard from './KidneyStoneRatingCard';
import ChronicRenalDiseaseRatingCard from './ChronicRenalDiseaseRatingCard';
import ChronicCystitisRatingCard from './ChronicCystitisRatingCard';
import NeurogenicBladderRatingCard from './NeurogenicBladderRatingCard';
import ProstateConditionsRatingCard from './ProstateConditionsRatingCard';
import UrethralStrictureRatingCard from './UrethralStrictureRatingCard';
import SphincterImpairmentRatingCard from './SphincterImpairmentRatingCard';
import ErectileDysfunctionRatingCard from './ErectileDysfunctionRatingCard';
import EndometriosisRatingCard from './EndometriosisRatingCard';
import FemaleReproductiveOrgansRatingCard from './FemaleReproductiveOrgansRatingCard';
import PelvicProlapseRatingCard from './PelvicProlapseRatingCard';
import FemaleArousalDisorderRatingCard from './FemaleArousalDisorderRatingCard';
import IronDeficiencyAnemiaRatingCard from './IronDeficiencyAnemiaRatingCard';
import FolateDeficiencyAnemiaRatingCard from './FolateDeficiencyAnemiaRatingCard';
import PerniciousAnemiaRatingCard from './PerniciousAnemiaRatingCard';
import HemolyticAnemiaRatingCard from './HemolyticAnemiaRatingCard';
import SickleCellAnemiaRatingCard from './SickleCellAnemiaRatingCard';
import AplasticAnemiaRatingCard from './AplasticAnemiaRatingCard';
import PolycythemiaVeraRatingCard from './PolycythemiaVeraRatingCard';
import ImmuneThrombocytopeniaRatingCard from './ImmuneThrombocytopeniaRatingCard';
import LeukemiaRatingCard from './LeukemiaRatingCard';
import HodgkinsLymphomaRatingCard from './HodgkinsLymphomaRatingCard';
import MultipleMyelomaRatingCard from './MultipleMyelomaRatingCard';
import NonHodgkinsLymphomaRatingCard from './NonHodgkinsLymphomaRatingCard';
import EssentialThrombocythemiaRatingCard from './EssentialThrombocythemiaRatingCard';
import ChronicMyelogenousLeukemiaRatingCard from './ChronicMyelogenousLeukemiaRatingCard';
import SolitaryPlasmacytomaRatingCard from './SolitaryPlasmacytomaRatingCard';
import MyelodysplasticSyndromesRatingCard from './MyelodysplasticSyndromesRatingCard';
import ToothLossRatingCard from './ToothLossRatingCard';
import MandibleNonunionRatingCard from './MandibleNonunionRatingCard';
import MaxillaMalunionRatingCard from './MaxillaMalunionRatingCard';
import MalignantOralNeoplasmRatingCard from './MalignantOralNeoplasmRatingCard';
import BenignOralNeoplasmRatingCard from './BenignOralNeoplasmRatingCard';
import HIVRatingCard from './HIVRatingCard';
import HepatitisCRatingCard from './HepatitisCRatingCard';
import HepatitisBRatingCard from './HepatitisBRatingCard';
import LymeDiseaseRatingCard from './LymeDiseaseRatingCard';
import MalariaRatingCard from './MalariaRatingCard';
import BrucellosisRatingCard from './BrucellosisRatingCard';
import CampylobacterRatingCard from './CampylobacterRatingCard';
import QFeverRatingCard from './QFeverRatingCard';
import SalmonellaRatingCard from './SalmonellaRatingCard';
import ShigellaRatingCard from './ShigellaRatingCard';
import WestNileRatingCard from './WestNileRatingCard';
import NTMRatingCard from './NTMRatingCard';
import Phase8BMentalHealthRatingCard from './Phase8BMentalHealthRatingCard';
import CardiomyopathyRatingCard from './CardiomyopathyRatingCard.jsx';
import ArrhythmiaRatingCard from './ArrhythmiaRatingCard.jsx';
import PericarditisRatingCard from './PericarditisRatingCard.jsx';
import PostPhlebiticRatingCard from './PostPhlebiticRatingCard.jsx';
import CADRatingCard from './CADRatingCard';
import PostMIRatingCard from './PostMIRatingCard';
import HypertensiveHeartRatingCard from './HypertensiveHeartRatingCard';
import CirrhosisRatingCard from './CirrhosisRatingCard';
import GastritisRatingCard from './GastritisRatingCard';
import PancreatitisRatingCard from './PancreatitisRatingCard';
import BiliaryTractRatingCard from './BiliaryTractRatingCard';
import COPDRatingCard from './COPDRatingCard';
import ChronicBronchitisRatingCard from './ChronicBronchitisRatingCard';
import EmphysemaRatingCard from './EmphysemaRatingCard';
import BronchiectasisRatingCard from './BronchiectasisRatingCard';
import PulmonaryFibrosisRatingCard from './PulmonaryFibrosisRatingCard';
import SarcoidosisRatingCard from './SarcoidosisRatingCard';
import MSRatingCard from './MSRatingCard';
import ParkinsonsRatingCard from './ParkinsonsRatingCard';
import MyastheniaGravisRatingCard from './MyastheniaGravisRatingCard';
import NarcolepsyRatingCard from './NarcolepsyRatingCard';
import ALSRatingCard from './ALSRatingCard';
import SyringomyeliaRatingCard from './SyringomyeliaRatingCard';
import MyelitisRatingCard from './MyelitisRatingCard';
import PeripheralNerveRatingCard from './PeripheralNerveRatingCard';
import measurements from './Measurements.jsx';
import ColdInjuryRatingCard from './ColdInjuryRatingCard.jsx';
import PADRatingCard from './PADRatingCard.jsx';
import HyperthyroidismRatingCard from './HyperthyroidismRatingCard';
import ThyroiditisRatingCard from './ThyroiditisRatingCard';
import HyperparathyroidismRatingCard from './HyperparathyroidismRatingCard';
import HypoparathyroidismRatingCard from './HypoparathyroidismRatingCard';
import AddisonsDiseaseRatingCard from './AddisonsDiseaseRatingCard';
import CushingsSyndromeRatingCard from './CushingsSyndromeRatingCard';
import DiabetesInsipidusRatingCard from './DiabetesInsipidusRatingCard';
import HyperaldosteronismRatingCard from './HyperaldosteronismRatingCard';
import GoutRatingCard from './GoutRatingCard';
import BursitisRatingCard from './BursitisRatingCard';
import TendinitisRatingCard from './TendinitisRatingCard';
import MyositisRatingCard from './MyositisRatingCard';
import OsteomyelitisRatingCard from './OsteomyelitisRatingCard';
import MultiJointArthritisRatingCard from './MultiJointArthritisRatingCard';
import SpineConditionsRatingCard from './SpineConditionsRatingCard';
import FootConditionsRatingCard from './FootConditionsRatingCard';
import HerniaRatingCard from './HerniaRatingCard';
import PeritonealAdhesionsRatingCard from './PeritonealAdhesionsRatingCard';
import EsophagealRatingCard from './EsophagealRatingCard';
import PostgastrectomyRatingCard from './PostgastrectomyRatingCard';
import IntestinalFistulaRatingCard from './IntestinalFistulaRatingCard';
import AcneChloracneRatingCard from './AcneChloracneRatingCard';
import AlopeciaAreataRatingCard from './AlopeciaAreataRatingCard';
import HyperhidrosisRatingCard from './HyperhidrosisRatingCard';
import GeneralSkinRatingCard from './GeneralSkinRatingCard';
import GeneralEyeRatingCard from './GeneralEyeRatingCard';
import EarConditionsRatingCard from './EarConditionsRatingCard';
import ConditionGroup from './ConditionGroup';

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
  const [measurements, setMeasurements] = useState([]);
  const [evaluationDays, setEvaluationDays] = useState(90);
  const [expandedSection, setExpandedSection] = useState(null);
  const [expandedGroup, setExpandedGroup] = useState('musculoskeletal');
  const [sleepApneaProfile, setSleepApneaProfile] = useState(getSleepApneaProfile());
  const [showSleepApneaSetup, setShowSleepApneaSetup] = useState(false);
  const [chronicSymptoms, setChronicSymptoms] = useState([]);
  const [showSuggestedConditions, setShowSuggestedConditions] = useState(true);

  // Check if user is a veteran
  const isVeteran = getProfileType() === PROFILE_TYPES.VETERAN;

  const toggleGroup = (groupId) => {
    setExpandedGroup(prev => prev === groupId ? null : groupId);
  };

  useEffect(() => {
    setLogs(getSymptomLogs());
    setMeasurements(getMeasurements());
    setChronicSymptoms(getChronicSymptoms());
  }, []);

  // Get suggested conditions based on what user is tracking
  const suggestedConditions = useMemo(() => {
    if (!isVeteran || chronicSymptoms.length === 0) return [];
    return getSuggestedConditions(chronicSymptoms);
  }, [chronicSymptoms, isVeteran]);

  // Analyze migraine logs
  const migraineAnalysis = useMemo(() => {
    const migraineLogs = logs.filter(log => {
      const symptomId = log.symptomId || log.symptom;
      return symptomId === 'migraine';
    });
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
    // Analyze Social Anxiety logs
    const socialAnxietyAnalysis = useMemo(() => {
        return analyzeSocialAnxietyLogs(logs, { evaluationPeriodDays: evaluationDays });
    }, [logs, evaluationDays]);
    // Analyze OCD logs
    const ocdAnalysis = useMemo(() => {
        return analyzeOCDLogs(logs, { evaluationPeriodDays: evaluationDays });
    }, [logs, evaluationDays]);
    // Analyze Persistent Depressive Disorder (Dysthymia) logs
    const persistentDepressiveAnalysis = useMemo(() => {
        return analyzePersistentDepressiveLogs(logs, { evaluationPeriodDays: evaluationDays });
    }, [logs, evaluationDays]);
    // Analyze Adjustment Disorder logs
    const adjustmentDisorderAnalysis = useMemo(() => {
        return analyzeAdjustmentDisorderLogs(logs, { evaluationPeriodDays: evaluationDays });
    }, [logs, evaluationDays]);
    // Analyze Unspecified Anxiety logs
    const unspecifiedAnxietyAnalysis = useMemo(() => {
        return analyzeUnspecifiedAnxietyLogs(logs, { evaluationPeriodDays: evaluationDays });
    }, [logs, evaluationDays]);
    // Analyze Unspecified Depressive logs
    const unspecifiedDepressiveAnalysis = useMemo(() => {
        return analyzeUnspecifiedDepressiveLogs(logs, { evaluationPeriodDays: evaluationDays });
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
    const ankleAnalysis = useMemo(() => {
        return analyzeAnkleLogs(logs, { evaluationPeriodDays: evaluationDays });
    }, [logs, evaluationDays]);
    const wristAnalysis = useMemo(() => {
        return analyzeWristLogs(logs, { evaluationPeriodDays: evaluationDays });
    }, [logs, evaluationDays]);
    const elbowAnalysis = useMemo(() => {
        return analyzeElbowLogs(logs, { evaluationPeriodDays: evaluationDays });
    }, [logs, evaluationDays]);
    const degenerativeArthritisAnalysis = useMemo(() => {
        return analyzeDegenerativeArthritisLogs(logs, { evaluationPeriodDays: evaluationDays });
    }, [logs, evaluationDays]);
    const asthmaAnalysis = useMemo(() => {
        return analyzeAsthmaLogs(logs, { evaluationPeriodDays: evaluationDays });
    }, [logs, evaluationDays]);
    const eczemaAnalysis = useMemo(() => {
        return analyzeEczemaLogs(logs, { evaluationPeriodDays: evaluationDays });
    }, [logs, evaluationDays]);
    const GERDComplicationsAnalysis = useMemo(() => {
        return analyzeGERDComplicationsLogs(logs, { evaluationPeriodDays: evaluationDays });
    }, [logs, evaluationDays]);
    const ulcerativeColitisAnalysis = useMemo(() => {
        return analyzeUlcerativeColitisLogs(logs, { evaluationPeriodDays: evaluationDays });
    }, [logs, evaluationDays]);
    const pepticUlcerAnalysis = useMemo(() => {
        return analyzePepticUlcerLogs(logs, { evaluationPeriodDays: evaluationDays });
    }, [logs, evaluationDays]);
    const hemorrhoidAnalysis = useMemo(() => {
        return analyzeHemorrhoidLogs(logs, { evaluationPeriodDays: evaluationDays });
    }, [logs, evaluationDays]);
    const diverticulitisAnalysis = useMemo(() => {
        return analyzeDiverticulitisLogs(logs, { evaluationPeriodDays: evaluationDays });
    }, [logs, evaluationDays]);
    const hypothyroidismAnalysis = useMemo(() => {
        return analyzeHypothyroidismLogs(logs, { evaluationPeriodDays: evaluationDays });
    }, [logs, evaluationDays]);
    const raynaudsAnalysis = useMemo(() => {
        return analyzeRaynaudsLogs(logs, { evaluationPeriodDays: evaluationDays });
    }, [logs, evaluationDays]);
    const varicoseVeinsAnalysis = useMemo(() => {
        return analyzeVaricoseVeinsLogs(logs, { evaluationPeriodDays: evaluationDays });
    }, [logs, evaluationDays]);
    const chronicUrticariaAnalysis = useMemo(() => {
        return analyzeChronicUrticariaLogs(logs, { evaluationPeriodDays: evaluationDays });
    }, [logs, evaluationDays]);
    const psoriasisAnalysis = useMemo(() => {
        return analyzePsoriasisLogs(logs, { evaluationPeriodDays: evaluationDays });
    }, [logs, evaluationDays]);
    const scarsAnalysis = useMemo(() => {
        return analyzeScarsLogs(logs, { evaluationPeriodDays: evaluationDays });
    }, [logs, evaluationDays]);
    const tbiResidualsAnalysis = useMemo(() => {
        return analyzeTBIResidualsLogs(logs, { evaluationPeriodDays: evaluationDays });
    }, [logs, evaluationDays]);
    const hearingLossAnalysis = useMemo(() => {
        return analyzeHearingLossLogs(logs, { evaluationPeriodDays: evaluationDays });
    }, [logs, evaluationDays]);
    // Analyze Tinnitus logs
    const tinnitusAnalysis = useMemo(() => {
        return analyzeTinnitusLogs(logs, { evaluationPeriodDays: evaluationDays });
    }, [logs, evaluationDays]);
    // Analyze Fibromyalgia logs
    const fibromyalgiaAnalysis = useMemo(() => {
        return analyzeFibromyalgiaLogs(logs, { evaluationPeriodDays: evaluationDays });
    }, [logs, evaluationDays]);
    // Phase 1E: Analyze Epilepsy - Major Seizures
    const epilepsyMajorAnalysis = useMemo(() => {
        return analyzeEpilepsyMajorLogs(logs, evaluationDays);
    }, [logs, evaluationDays]);
    // Phase 1E: Analyze Epilepsy - Minor Seizures
    const epilepsyMinorAnalysis = useMemo(() => {
        return analyzeEpilepsyMinorLogs(logs, evaluationDays);
    }, [logs, evaluationDays]);
    // Phase 1D: Analyze Jacksonian/Focal Epilepsy (DC 8912)
    const jacksonianEpilepsyAnalysis = useMemo(() => {
      return analyzeJacksonianEpilepsyLogs(logs, { days: evaluationDays });
    }, [logs, evaluationDays]);
    // Phase 1D: Analyze Diencephalic Epilepsy (DC 8913)
    const diencephalicEpilepsyAnalysis = useMemo(() => {
      return analyzeDiencephalicEpilepsyLogs(logs, { days: evaluationDays });
    }, [logs, evaluationDays]);
    // Phase 1D: Analyze Psychomotor Epilepsy (DC 8914)
    const psychomotorEpilepsyAnalysis = useMemo(() => {
      return analyzePsychomotorEpilepsyLogs(logs, { days: evaluationDays });
    }, [logs, evaluationDays]);
    // Phase 2: Analyze Vision/Eye Conditions
    const visionAnalysis = useMemo(() => {
      return analyzeVisionLogs(logs);
    }, [logs]);
    // Phase 3: Genitourinary Conditions Analysis
    const kidneyStonesAnalysis = useMemo(() => {
        return analyzeKidneyStonesLogs(logs);
    }, [logs]);
    const chronicRenalDiseaseAnalysis = useMemo(() => {
        return analyzeChronicRenalDiseaseLogs(logs, { evaluationPeriodDays: evaluationDays });
    }, [logs, evaluationDays]);
    const voidingDysfunctionAnalysis = useMemo(() => {
        return analyzeVoidingDysfunctionLogs(logs);
    }, [logs]);
    const sphincterImpairmentAnalysis = useMemo(() => {
        return analyzeSphincterImpairmentLogs(logs);
    }, [logs]);
    const erectileDysfunctionAnalysis = useMemo(() => {
        return analyzeErectileDysfunctionLogs(logs);
    }, [logs]);
    // Phase 4: Gynecological Analysis Hooks
    const endometriosisAnalysis = useMemo(() => {
        return analyzeEndometriosisLogs(logs);
    }, [logs]);
    const femaleReproductiveOrgansAnalysis = useMemo(() => {
        return analyzeFemaleReproductiveOrgansLogs(logs);
    }, [logs]);
    const pelvicProlapseAnalysis = useMemo(() => {
        return analyzePelvicProlapseLogs(logs);
    }, [logs]);
    const femaleArousalDisorderAnalysis = useMemo(() => {
        return analyzeFemaleArousalDisorderLogs(logs);
    }, [logs]);
    // Phase 5: Hemic/Lymphatic Analysis Hooks
    const ironDeficiencyAnemiaAnalysis = useMemo(() => {
      return analyzeIronDeficiencyAnemiaLogs(logs);
    }, [logs]);
    const folateDeficiencyAnemiaAnalysis = useMemo(() => {
      return analyzeFolateDeficiencyAnemiaLogs(logs);
    }, [logs]);
    const perniciousAnemiaAnalysis = useMemo(() => {
      return analyzePerniciousAnemiaLogs(logs);
    }, [logs]);
    const hemolyticAnemiaAnalysis = useMemo(() => {
      return analyzeHemolyticAnemiaLogs(logs);
    }, [logs]);
    const sickleCellAnemiaAnalysis = useMemo(() => {
      return analyzeSickleCellAnemiaLogs(logs);
    }, [logs]);
    const aplasticAnemiaAnalysis = useMemo(() => {
      return analyzeAplasticAnemiaLogs(logs);
    }, [logs]);
    const polycythemiaVeraAnalysis = useMemo(() => {
      return analyzePolycythemiaVeraLogs(logs);
    }, [logs]);
    const immuneThrombocytopeniaAnalysis = useMemo(() => {
      return analyzeImmuneThrombocytopeniaLogs(logs);
    }, [logs]);
    const leukemiaAnalysis = useMemo(() => {
      return analyzeLeukemiaLogs(logs);
    }, [logs]);
    const hodgkinsLymphomaAnalysis = useMemo(() => {
      return analyzeHodgkinsLymphomaLogs(logs);
    }, [logs]);
    const multipleMyelomaAnalysis = useMemo(() => {
      return analyzeMultipleMyelomaLogs(logs);
    }, [logs]);
    const nonHodgkinsLymphomaAnalysis = useMemo(() => {
      return analyzeNonHodgkinsLymphomaLogs(logs);
    }, [logs]);
    const myeloproliferative7718Analysis = useMemo(() => {
      return analyzeMyeloproliferative7718Logs(logs);
    }, [logs]);
    const chronicMyelogenousLeukemiaAnalysis = useMemo(() => {
      return analyzeChronicMyelogenousLeukemiaLogs(logs);
    }, [logs]);
    const solitaryPlasmacytomaAnalysis = useMemo(() => {
      return analyzeSolitaryPlasmacytomaLogs(logs);
    }, [logs]);
    const myelodysplasticSyndromesAnalysis = useMemo(() => {
      return analyzeMyelodysplasticSyndromesLogs(logs);
    }, [logs]);
    // Phase 6: Diseases
    const hivAnalysis = useMemo(() => {
      return analyzeHIVLogs(logs, { evaluationPeriodDays: evaluationDays });
    }, [logs, evaluationDays]);
    const hepatitisCAnalysis = useMemo(() => {
      return analyzeHepatitisCLogs(logs, { evaluationPeriodDays: evaluationDays });
    }, [logs, evaluationDays]);
    const hepatitisBAnalysis = useMemo(() => {
      return analyzeHepatitisBLogs(logs, { evaluationPeriodDays: evaluationDays });
    }, [logs, evaluationDays]);
    const lymeDiseaseAnalysis = useMemo(() => {
      return analyzeLymeDiseaseLogs(logs, { evaluationPeriodDays: evaluationDays });
    }, [logs, evaluationDays]);
    const malariaAnalysis = useMemo(() => {
      return analyzeMalariaLogs(logs, { evaluationPeriodDays: evaluationDays });
    }, [logs, evaluationDays]);
    const brucellosisAnalysis = useMemo(() => {
      return analyzeBrucellosisLogs(logs, { evaluationPeriodDays: evaluationDays  });
    }, [logs, evaluationDays]);
    const campylobacterAnalysis = useMemo(() => {
      return analyzeCampylobacterLogs(logs, { evaluationPeriodDays: evaluationDays  });
    }, [logs, evaluationDays]);
    const qFeverAnalysis = useMemo(() => {
      return analyzeQFeverLogs(logs, { evaluationPeriodDays: evaluationDays  });
    }, [logs, evaluationDays]);
    const salmonellaAnalysis = useMemo(() => {
      return analyzeSalmonellaLogs(logs, { evaluationPeriodDays: evaluationDays  });
    }, [logs, evaluationDays]);
    const shigellaAnalysis = useMemo(() => {
      return analyzeShigellaLogs(logs, { evaluationPeriodDays: evaluationDays  });
    }, [logs, evaluationDays]);
    const westNileAnalysis = useMemo(() => {
      return analyzeWestNileLogs(logs, { evaluationPeriodDays: evaluationDays  });
    }, [logs, evaluationDays]);
    const ntmAnalysis = useMemo(() => {
      return analyzeNTMLogs(logs, { evaluationPeriodDays: evaluationDays  });
    }, [logs, evaluationDays]);
    // Phase 7: Dental/Oral Analysis Hooks
    const toothLossAnalysis = useMemo(() => {
      return analyzeToothLossLogs(logs, { evaluationPeriodDays: evaluationDays });
    }, [logs, evaluationDays]);
    const mandibleNonunionAnalysis = useMemo(() => {
      return analyzeMandibleNonunionLogs(logs, { evaluationPeriodDays: evaluationDays });
    }, [logs, evaluationDays]);
    const malignantOralNeoplasmAnalysis = useMemo(() => {
      return analyzeMalignantOralNeoplasmLogs(logs, { evaluationPeriodDays: evaluationDays });
    }, [logs, evaluationDays]);
    const benignOralNeoplasmAnalysis = useMemo(() => {
      return analyzeBenignOralNeoplasmLogs(logs, { evaluationPeriodDays: evaluationDays });
    }, [logs, evaluationDays]);
  // PHASE 8A: MENTAL HEALTH EXPANSION - ANALYSIS HOOKS
  // Somatic Symptom Disorders
  const somaticSymptomDisorderAnalysis = useMemo(() => {
    return analyzeSomaticSymptomDisorderLogs(logs, { evaluationPeriodDays: evaluationDays });
  }, [logs, evaluationDays]);
  const otherSpecifiedSomaticAnalysis = useMemo(() => {
    return analyzeOtherSpecifiedSomaticLogs(logs, { evaluationPeriodDays: evaluationDays });
  }, [logs, evaluationDays]);
  const unspecifiedSomaticAnalysis = useMemo(() => {
    return analyzeUnspecifiedSomaticLogs(logs, { evaluationPeriodDays: evaluationDays });
  }, [logs, evaluationDays]);
  const illnessAnxietyAnalysis = useMemo(() => {
    return analyzeIllnessAnxietyLogs(logs, { evaluationPeriodDays: evaluationDays });
  }, [logs, evaluationDays]);
  // Other Mental Health
  const otherSpecifiedAnxietyAnalysis = useMemo(() => {
    return analyzeOtherSpecifiedAnxietyLogs(logs, { evaluationPeriodDays: evaluationDays });
  }, [logs, evaluationDays]);
  const depersonalizationAnalysis = useMemo(() => {
    return analyzeDepersonalizationLogs(logs, { evaluationPeriodDays: evaluationDays });
  }, [logs, evaluationDays]);
  const cyclothymicAnalysis = useMemo(() => {
    return analyzeCyclothymicLogs(logs, { evaluationPeriodDays: evaluationDays });
  }, [logs, evaluationDays]);
  // Eating Disorders
  const anorexiaNervosaAnalysis = useMemo(() => {
    return analyzeAnorexiaNervosaLogs(logs, { evaluationPeriodDays: evaluationDays });
  }, [logs, evaluationDays]);
  const bulimiaNervosaAnalysis = useMemo(() => {
    return analyzeBulimiaNervosaLogs(logs, { evaluationPeriodDays: evaluationDays });
  }, [logs, evaluationDays]);
  // Phase 8B: Additional Mental Health Analysis
  const schizophreniaAnalysis = useMemo(() => {
    return analyzeSchizophreniaLogs(logs, { evaluationPeriodDays: evaluationDays });
  }, [logs, evaluationDays]);
  const schizoaffectiveDisorderAnalysis = useMemo(() => {
    return analyzeSchizoaffectiveDisorderLogs(logs, { evaluationPeriodDays: evaluationDays });
  }, [logs, evaluationDays]);
  const delusionalDisorderAnalysis = useMemo(() => {
    return analyzeDelusionalDisorderLogs(logs, { evaluationPeriodDays: evaluationDays });
  }, [logs, evaluationDays]);
  const psychoticDisorderNOSAnalysis = useMemo(() => {
    return analyzePsychoticDisorderNOSLogs(logs, { evaluationPeriodDays: evaluationDays });
  }, [logs, evaluationDays]);
  const briefPsychoticDisorderAnalysis = useMemo(() => {
    return analyzeBriefPsychoticDisorderLogs(logs, { evaluationPeriodDays: evaluationDays });
  }, [logs, evaluationDays]);
  const bingeEatingDisorderAnalysis = useMemo(() => {
    return analyzeBingeEatingDisorderLogs(logs, { evaluationPeriodDays: evaluationDays });
  }, [logs, evaluationDays]);
  const dissociativeIdentityDisorderAnalysis = useMemo(() => {
    return analyzeDissociativeIdentityDisorderLogs(logs, { evaluationPeriodDays: evaluationDays });
  }, [logs, evaluationDays]);
  const dissociativeAmnesiaAnalysis = useMemo(() => {
    return analyzeDissociativeAmnesiaLogs(logs, { evaluationPeriodDays: evaluationDays });
  }, [logs, evaluationDays]);
  const acuteStressDisorderAnalysis = useMemo(() => {
    return analyzeAcuteStressDisorderLogs(logs, { evaluationPeriodDays: evaluationDays });
  }, [logs, evaluationDays]);
  const antisocialPersonalityDisorderAnalysis = useMemo(() => {
    return analyzeAntisocialPersonalityDisorderLogs(logs, { evaluationPeriodDays: evaluationDays });
  }, [logs, evaluationDays]);
  const borderlinePersonalityDisorderAnalysis = useMemo(() => {
    return analyzeBorderlinePersonalityDisorderLogs(logs, { evaluationPeriodDays: evaluationDays });
  }, [logs, evaluationDays]);
  const narcissisticPersonalityDisorderAnalysis = useMemo(() => {
    return analyzeNarcissisticPersonalityDisorderLogs(logs, { evaluationPeriodDays: evaluationDays });
  }, [logs, evaluationDays]);
  const avoidantPersonalityDisorderAnalysis = useMemo(() => {
    return analyzeAvoidantPersonalityDisorderLogs(logs, { evaluationPeriodDays: evaluationDays });
  }, [logs, evaluationDays]);
  // Phase 9: Cardiovascular Analysis Hooks
  const cardiomyopathyAnalysis = useMemo(() => {
    return analyzeCardiomyopathyLogs(logs, measurements, { evaluationPeriodDays: evaluationDays });
  }, [logs, measurements, evaluationDays]);
  const svtAnalysis = useMemo(() => {
    return analyzeSVTLogs(logs, { evaluationPeriodDays: evaluationDays });
  }, [logs, evaluationDays]);
  const ventricularArrhythmiaAnalysis = useMemo(() => {
    return analyzeVentricularArrhythmiaLogs(logs, { evaluationPeriodDays: evaluationDays });
  }, [logs, evaluationDays]);
  const pericarditisAnalysis = useMemo(() => {
    return analyzePericarditisLogs(logs, measurements, { evaluationPeriodDays: evaluationDays });
  }, [logs, measurements, evaluationDays]);
  const postPhlebiticAnalysis = useMemo(() => {
    return analyzePostPhlebiticLogs(logs, { evaluationPeriodDays: evaluationDays });
  }, [logs, evaluationDays]);
  // Phase 2A: Major Cardiac Conditions (METs-based)
  const cadAnalysis = useMemo(() => {
    return analyzeCADLogs(logs, measurements,{ evaluationPeriodDays: evaluationDays });
  }, [logs, measurements, evaluationDays]);
  const postMIAnalysis = useMemo(() => {
    return analyzePostMILogs(logs, measurements, { evaluationPeriodDays: evaluationDays });
  }, [logs, measurements, evaluationDays]);
  const hypertensiveHeartAnalysis = useMemo(() => {
    return analyzeHypertensiveHeartLogs(logs, measurements, { evaluationPeriodDays: evaluationDays });
  }, [logs, measurements, evaluationDays]);
  // Phase 2B: Vascular Conditions
  const coldInjuryAnalysis = useMemo(() => {
    return analyzeColdInjuryLogs(logs, { evaluationPeriodDays: evaluationDays });
  }, [logs, evaluationDays]);
  const padAnalysis = useMemo(() => {
    return analyzePADLogs(logs, measurements, { evaluationPeriodDays: evaluationDays });
  }, [logs, measurements, evaluationDays]);
  // Phase 10: Digestive Analysis Hooks
  const cirrhosisAnalysis = useMemo(() => {
    return analyzeCirrhosisLogs(logs, measurements, [], { evaluationPeriodDays: evaluationDays });
  }, [logs, measurements, evaluationDays]);
  const gastritisAnalysis = useMemo(() => {
    return analyzeGastritisLogs(logs, { evaluationPeriodDays: evaluationDays });
  }, [logs, evaluationDays]);
  const pancreatitisAnalysis = useMemo(() => {
    return analyzePancreatitisLogs(logs, { evaluationPeriodDays: evaluationDays });
  }, [logs, evaluationDays]);
  const biliaryTractAnalysis = useMemo(() => {
    return analyzeBiliaryTractLogs(logs, { evaluationPeriodDays: evaluationDays });
  }, [logs, evaluationDays]);
  // Phase 11: Respiratory condition analyses
  const copdAnalysis = useMemo(() => {
    return analyzeCOPDLogs(logs, { evaluationPeriodDays: evaluationDays });
  }, [logs, evaluationDays]);
  const chronicBronchitisAnalysis = useMemo(() => {
    return analyzeChronicBronchitisLogs(logs, { evaluationPeriodDays: evaluationDays });
  }, [logs, evaluationDays]);
  const emphysemaAnalysis = useMemo(() => {
    return analyzeEmphysemaLogs(logs, { evaluationPeriodDays: evaluationDays });
  }, [logs, evaluationDays]);
  const bronchiectasisAnalysis = useMemo(() => {
    return analyzeBronchiectasisLogs(logs, { evaluationPeriodDays: evaluationDays });
  }, [logs, evaluationDays]);
  const pulmonaryFibrosisAnalysis = useMemo(() => {
    return analyzePulmonaryFibrosisLogs(logs, { evaluationPeriodDays: evaluationDays });
  }, [logs, evaluationDays]);
  const sarcoidosisAnalysis = useMemo(() => {
    return analyzeSarcoidosisLogs(logs, { evaluationPeriodDays: evaluationDays });
  }, [logs, evaluationDays]);
  // Phase 1A: Neurological condition analysis
  const multipleSclerosisAnalysis = useMemo(() => {
    return analyzeMultipleSclerosisLogs(logs, { evaluationPeriodDays: evaluationDays });
  }, [logs, evaluationDays]);
  const parkinsonsAnalysis = useMemo(() => {
    return analyzeParkinsonsDiseaseLogs(logs, { evaluationPeriodDays: evaluationDays });
  }, [logs, evaluationDays]);
  const myastheniaGravisAnalysis = useMemo(() => {
    return analyzeMyastheniaGravisLogs(logs, { evaluationPeriodDays: evaluationDays });
  }, [logs, evaluationDays]);
  // Phase 1B: Additional Neurological Analysis
  const narcolepsyAnalysis = useMemo(() => {
    return analyzeNarcolepsyLogs(logs, { evaluationPeriodDays: evaluationDays });
  }, [logs, evaluationDays]);
  const alsAnalysis = useMemo(() => {
    return analyzeALSLogs(logs, { evaluationPeriodDays: evaluationDays });
  }, [logs, evaluationDays]);
  const syringomyeliaAnalysis = useMemo(() => {
    return analyzeSyringomyeliaLogs(logs, { evaluationPeriodDays: evaluationDays });
  }, [logs, evaluationDays]);
  const myelitisAnalysis = useMemo(() => {
    return analyzeMyelitisLogs(logs, { evaluationPeriodDays: evaluationDays });
  }, [logs, evaluationDays]);
  // ============================================
  // PHASE 1C: PERIPHERAL NERVE ANALYSIS
  // ============================================
  // Upper Extremity Nerves
  const upperRadicularAnalysis = useMemo(() => {
    return analyzeUpperRadicularGroupLogs(logs, { days: evaluationDays });
  }, [logs, evaluationDays]);
  const middleRadicularAnalysis = useMemo(() => {
    return analyzeMiddleRadicularGroupLogs(logs, { days: evaluationDays });
  }, [logs, evaluationDays]);
  const lowerRadicularAnalysis = useMemo(() => {
    return analyzeLowerRadicularGroupLogs(logs, { days: evaluationDays });
  }, [logs, evaluationDays]);
  const allRadicularAnalysis = useMemo(() => {
    return analyzeAllRadicularGroupsLogs(logs, { days: evaluationDays });
  }, [logs, evaluationDays]);
  const radialNerveAnalysis = useMemo(() => {
    return analyzeRadialNerveLogs(logs, { days: evaluationDays });
  }, [logs, evaluationDays]);
  const medianNerveAnalysis = useMemo(() => {
    return analyzeMedianNerveLogs(logs, { days: evaluationDays });
  }, [logs, evaluationDays]);
  const ulnarNerveAnalysis = useMemo(() => {
    return analyzeUlnarNerveLogs(logs, { days: evaluationDays });
  }, [logs, evaluationDays]);
  const musculocutaneousNerveAnalysis = useMemo(() => {
    return analyzeMusculocutaneousNerveLogs(logs, { days: evaluationDays });
  }, [logs, evaluationDays]);
  const circumflexNerveAnalysis = useMemo(() => {
    return analyzeCircumflexNerveLogs(logs, { days: evaluationDays });
  }, [logs, evaluationDays]);
  const longThoracicNerveAnalysis = useMemo(() => {
    return analyzeLongThoracicNerveLogs(logs, { days: evaluationDays });
  }, [logs, evaluationDays]);
  // Lower Extremity Nerves
  const sciaticNerveAnalysis = useMemo(() => {
    return analyzeSciaticNerveLogs(logs, { days: evaluationDays });
  }, [logs, evaluationDays]);
  const commonPeronealNerveAnalysis = useMemo(() => {
    return analyzeCommonPeronealNerveLogs(logs, { days: evaluationDays });
  }, [logs, evaluationDays]);
  const superficialPeronealNerveAnalysis = useMemo(() => {
    return analyzeSuperficialPeronealNerveLogs(logs, { days: evaluationDays });
  }, [logs, evaluationDays]);
  const deepPeronealNerveAnalysis = useMemo(() => {
    return analyzeDeepPeronealNerveLogs(logs, { days: evaluationDays });
  }, [logs, evaluationDays]);
  const tibialNerveAnalysis = useMemo(() => {
    return analyzeTibialNerveLogs(logs, { days: evaluationDays });
  }, [logs, evaluationDays]);
  const posteriorTibialNerveAnalysis = useMemo(() => {
    return analyzePosteriorTibialNerveLogs(logs, { days: evaluationDays });
  }, [logs, evaluationDays]);
  const femoralNerveAnalysis = useMemo(() => {
    return analyzeFemoralNerveLogs(logs, { days: evaluationDays });
  }, [logs, evaluationDays]);
  const saphenousNerveAnalysis = useMemo(() => {
    return analyzeSaphenousNerveLogs(logs, { days: evaluationDays });
  }, [logs, evaluationDays]);
  const obturatorNerveAnalysis = useMemo(() => {
    return analyzeObturatorNerveLogs(logs, { days: evaluationDays });
  }, [logs, evaluationDays]);
  const lateralFemoralCutaneousNerveAnalysis = useMemo(() => {
    return analyzeLateralFemoralCutaneousNerveLogs(logs, { days: evaluationDays });
  }, [logs, evaluationDays]);
  const ilioinguinalNerveAnalysis = useMemo(() => {
    return analyzeIlioinguinalNerveLogs(logs, { days: evaluationDays });
  }, [logs, evaluationDays]);
  // Phase 3A: Endocrine - Thyroid & Parathyroid Analysis
  const hyperthyroidismAnalysis = useMemo(() => {
    return analyzeHyperthyroidismLogs(logs, { days: evaluationDays });
  }, [logs, evaluationDays]);
  const thyroiditisAnalysis = useMemo(() => {
    return analyzeThyroiditisLogs(logs, { days: evaluationDays });
  }, [logs, evaluationDays]);
  const hyperparathyroidismAnalysis = useMemo(() => {
    return analyzeHyperparathyroidismLogs(logs, { days: evaluationDays });
  }, [logs, evaluationDays]);
  const hypoparathyroidismAnalysis = useMemo(() => {
    return analyzeHypoparathyroidismLogs(logs, { days: evaluationDays });
  }, [logs, evaluationDays]);
  // Phase 3B: Adrenal & Pituitary Analysis
  const addisonsDiseaseAnalysis = useMemo(() => {
    return analyzeAddisonsDiseaseLog(logs, { days: 365 }); // Uses 365 days for crisis/episode counting
  }, [logs]);
  const cushingsSyndromeAnalysis = useMemo(() => {
    return analyzeCushingsSyndromeLogs(logs, { days: evaluationDays });
  }, [logs, evaluationDays]);
  const diabetesInsipidusAnalysis = useMemo(() => {
    return analyzeDiabetesInsipidusLogs(logs, { days: evaluationDays });
  }, [logs, evaluationDays]);
  const hyperaldosteronismAnalysis = useMemo(() => {
    return analyzeHyperaldosteronismLogs(logs, { days: evaluationDays });
  }, [logs, evaluationDays]);
  // Phase 4A: Gout Analysis (DC 5017)
  const goutAnalysis = useMemo(() => {
    return analyzeGoutLogs(logs, { evaluationPeriodDays: evaluationDays });
  }, [logs, evaluationDays]);
  // Phase 4A: Bursitis Analysis (DC 5019)
  const bursitisAnalysis = useMemo(() => {
    return analyzeBursitisLogs(logs, { evaluationPeriodDays: evaluationDays });
  }, [logs, evaluationDays]);
  // Phase 4A: Tendinitis Analysis (DC 5024)
  const tendinitisAnalysis = useMemo(() => {
    return analyzeTendinitisLogs(logs, { evaluationPeriodDays: evaluationDays });
  }, [logs, evaluationDays]);
  // Phase 4B: Myositis Analysis (DC 5021)
  const myositisAnalysis = useMemo(() => {
    return analyzeMyositisLogs(logs, { evaluationPeriodDays: evaluationDays });
  }, [logs, evaluationDays]);
  // Phase 4B: Osteomyelitis Analysis (DC 5000)
  const osteomyelitisAnalysis = useMemo(() => {
    return analyzeOsteomyelitisLogs(logs, { evaluationPeriodDays: evaluationDays });
  }, [logs, evaluationDays]);
  // Phase 4B: Multi-Joint Arthritis Analysis (DC 5002)
  const multiJointArthritisAnalysis = useMemo(() => {
    return analyzeMultiJointArthritisLogs(logs, { evaluationPeriodDays: evaluationDays });
  }, [logs, evaluationDays]);
  // PHASE 4C: SPINE CONDITIONS ANALYSIS
  // DC 5235: Vertebral Fracture/Dislocation
  const vertebralFractureAnalysis = useMemo(() => {
    return analyzeVertebralFractureLogs(logs, { evaluationPeriodDays: evaluationDays });
  }, [logs, evaluationDays]);
  // DC 5236: Sacroiliac Injury and Weakness
  const sacroiliacInjuryAnalysis = useMemo(() => {
    return analyzeSacroiliacInjuryLogs(logs, { evaluationPeriodDays: evaluationDays });
  }, [logs, evaluationDays]);
  // DC 5238: Spinal Stenosis
  const spinalStenosisAnalysis = useMemo(() => {
    return analyzeSpinalStenosisLogs(logs, { evaluationPeriodDays: evaluationDays });
  }, [logs, evaluationDays]);
  // DC 5240: Ankylosing Spondylitis
  const ankylosingSpondylitisAnalysis = useMemo(() => {
    return analyzeAnkylosingSpondylitisLogs(logs, { evaluationPeriodDays: evaluationDays });
  }, [logs, evaluationDays]);
  // DC 5241: Spinal Fusion
  const spinalFusionAnalysis = useMemo(() => {
    return analyzeSpinalFusionLogs(logs, { evaluationPeriodDays: evaluationDays });
  }, [logs, evaluationDays]);
  // Phase 4D: Foot Conditions
  const weakFootAnalysis = useMemo(() => {
    return analyzeWeakFootLogs(logs, { evaluationPeriodDays: evaluationDays });
  }, [logs, evaluationDays]);
  const clawFootAnalysis = useMemo(() => {
    return analyzeClawFootLogs(logs, { evaluationPeriodDays: evaluationDays });
  }, [logs, evaluationDays]);
  const metatarsalgiaAnalysis = useMemo(() => {
    return analyzeMetatarsalgiaLogs(logs, { evaluationPeriodDays: evaluationDays });
  }, [logs, evaluationDays]);
  const halluxValgusAnalysis = useMemo(() => {
    return analyzeHalluxValgusLogs(logs, { evaluationPeriodDays: evaluationDays });
  }, [logs, evaluationDays]);
  const halluxRigidusAnalysis = useMemo(() => {
    return analyzeHalluxRigidusLogs(logs, { evaluationPeriodDays: evaluationDays });
  }, [logs, evaluationDays]);
  // Phase 5A: Hernia & Structural analyses
  const herniaAnalysis = useMemo(() => {
    return analyzeHerniaLogs(logs, { evaluationPeriodDays: evaluationDays });
  }, [logs, evaluationDays]);
  const peritonealAdhesionsAnalysis = useMemo(() => {
    return analyzePeritonealAdhesionsLogs(logs, { evaluationPeriodDays: evaluationDays });
  }, [logs, evaluationDays]);
  // Phase 5B: Esophageal & Post-Surgical analyses
  const esophagealAnalysis = useMemo(() => {
    return analyzeEsophagealLogs(logs, { evaluationPeriodDays: evaluationDays });
  }, [logs, evaluationDays]);
  const postgastrectomyAnalysis = useMemo(() => {
    return analyzePostgastrectomyLogs(logs, { evaluationPeriodDays: evaluationDays });
  }, [logs, evaluationDays]);
  const intestinalFistulaAnalysis = useMemo(() => {
    return analyzeIntestinalFistulaLogs(logs, { evaluationPeriodDays: evaluationDays });
  }, [logs, evaluationDays]);
  // Phase 6A: Skin Condition Analyses
  const acneAnalysis = useMemo(() => {
    return analyzeAcneLogs(logs, { evaluationPeriodDays: evaluationDays });
  }, [logs, evaluationDays]);
  const chloracneAnalysis = useMemo(() => {
    return analyzeChloracneLogs(logs, { evaluationPeriodDays: evaluationDays });
  }, [logs, evaluationDays]);
  const alopeciaAreataAnalysis = useMemo(() => {
    return analyzeAlopeciaAreataLogs(logs, { evaluationPeriodDays: evaluationDays });
  }, [logs, evaluationDays]);
  const hyperhidrosisAnalysis = useMemo(() => {
    return analyzeHyperhidrosisLogs(logs, { evaluationPeriodDays: evaluationDays });
  }, [logs, evaluationDays]);
  // Phase 6B: Additional Skin Condition Analyses
  const discoidLupusAnalysis = useMemo(() => {
    return analyzeDiscoidLupusLogs(logs, { evaluationPeriodDays: evaluationDays });
  }, [logs, evaluationDays]);
  const bullousDisordersAnalysis = useMemo(() => {
    return analyzeBullousDisordersLogs(logs, { evaluationPeriodDays: evaluationDays });
  }, [logs, evaluationDays]);
  const cutaneousVasculitisAnalysis = useMemo(() => {
    return analyzeCutaneousVasculitisLogs(logs, { evaluationPeriodDays: evaluationDays });
  }, [logs, evaluationDays]);
  const dermatophytosisAnalysis = useMemo(() => {
    return analyzeDermatophytosisLogs(logs, { evaluationPeriodDays: evaluationDays });
  }, [logs, evaluationDays]);
  const skinInfectionsAnalysis = useMemo(() => {
    return analyzeSkinInfectionsLogs(logs, { evaluationPeriodDays: evaluationDays });
  }, [logs, evaluationDays]);
  // Phase 7A: Eye Conditions Analysis
  const uveitisAnalysis = useMemo(() => {
    return analyzeUveitis(logs, { evaluationPeriodDays: evaluationDays });
  }, [logs, evaluationDays]);
  const keratitisAnalysis = useMemo(() => {
    return analyzeKeratitis(logs, { evaluationPeriodDays: evaluationDays });
  }, [logs, evaluationDays]);
  const chronicConjunctivitisAnalysis = useMemo(() => {
    return analyzeChronicConjunctivitis(logs, { evaluationPeriodDays: evaluationDays });
  }, [logs, evaluationDays]);
  const scleritisAnalysis = useMemo(() => {
    return analyzeScleritis(logs, { evaluationPeriodDays: evaluationDays });
  }, [logs, evaluationDays]);
  // Phase 7B: Ear Conditions Analysis
  const peripheralVestibularAnalysis = useMemo(() => {
    return analyzePeripheralVestibular(logs, { evaluationPeriodDays: evaluationDays });
  }, [logs, evaluationDays]);
  const chronicSuppurativeOtitisMediaAnalysis = useMemo(() => {
    return analyzeChronicSuppurativeOtitisMedia(logs, { evaluationPeriodDays: evaluationDays });
  }, [logs, evaluationDays]);
  const chronicOtitisExternaAnalysis = useMemo(() => {
    return analyzeChronicOtitisExterna(logs, { evaluationPeriodDays: evaluationDays });
  }, [logs, evaluationDays]);
  const chronicNonsuppurativeOtitisMediaAnalysis = useMemo(() => {
    return analyzeChronicNonsuppurativeOtitisMedia(logs, { evaluationPeriodDays: evaluationDays });
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

  // ============================================
  // BODY SYSTEM CONDITION COUNTS
  // ============================================
  // Count conditions with data for each body system
  const bodySystemCounts = useMemo(() => {
    return {
      mentalHealth: [
        ptsdAnalysis.hasData,
        majorDepressionAnalysis.hasData,
        generalizedAnxietyAnalysis.hasData,
        panicDisorderAnalysis.hasData,
        bipolarAnalysis.hasData,
        socialAnxietyAnalysis.hasData,
        ocdAnalysis.hasData,
        persistentDepressiveAnalysis.hasData,
        adjustmentDisorderAnalysis.hasData,
        unspecifiedAnxietyAnalysis.hasData,
        unspecifiedDepressiveAnalysis.hasData,
        somaticSymptomDisorderAnalysis.hasData,
        otherSpecifiedSomaticAnalysis.hasData,
        unspecifiedSomaticAnalysis.hasData,
        illnessAnxietyAnalysis.hasData,
        otherSpecifiedAnxietyAnalysis.hasData,
        depersonalizationAnalysis.hasData,
        cyclothymicAnalysis.hasData,
        anorexiaNervosaAnalysis.hasData,
        bulimiaNervosaAnalysis.hasData,
        schizophreniaAnalysis.hasData,
        schizoaffectiveDisorderAnalysis.hasData,
        delusionalDisorderAnalysis.hasData,
        psychoticDisorderNOSAnalysis.hasData,
        briefPsychoticDisorderAnalysis.hasData,
        bingeEatingDisorderAnalysis.hasData,
        dissociativeIdentityDisorderAnalysis.hasData,
        dissociativeAmnesiaAnalysis.hasData,
        acuteStressDisorderAnalysis.hasData,
        antisocialPersonalityDisorderAnalysis.hasData,
        borderlinePersonalityDisorderAnalysis.hasData,
        narcissisticPersonalityDisorderAnalysis.hasData,
        avoidantPersonalityDisorderAnalysis.hasData,
      ].filter(Boolean).length,

      neurological: [
        migraineAnalysis.hasData,
        tbiAnalysis.hasData,
        tbiResidualsAnalysis.hasData,
        epilepsyMajorAnalysis.hasData,
        epilepsyMinorAnalysis.hasData,
        jacksonianEpilepsyAnalysis.hasData,
        diencephalicEpilepsyAnalysis.hasData,
        psychomotorEpilepsyAnalysis.hasData,
        radiculopathyAnalysis.hasData,
        peripheralNeuropathyAnalysis.hasData,
        multipleSclerosisAnalysis.hasData,
        parkinsonsAnalysis.hasData,
        myastheniaGravisAnalysis.hasData,
        narcolepsyAnalysis.hasData,
        alsAnalysis.hasData,
        syringomyeliaAnalysis.hasData,
        myelitisAnalysis.hasData,
        upperRadicularAnalysis.hasData,
        middleRadicularAnalysis.hasData,
        lowerRadicularAnalysis.hasData,
        allRadicularAnalysis.hasData,
        radialNerveAnalysis.hasData,
        medianNerveAnalysis.hasData,
        ulnarNerveAnalysis.hasData,
        musculocutaneousNerveAnalysis.hasData,
        circumflexNerveAnalysis.hasData,
        longThoracicNerveAnalysis.hasData,
        sciaticNerveAnalysis.hasData,
        commonPeronealNerveAnalysis.hasData,
        superficialPeronealNerveAnalysis.hasData,
        deepPeronealNerveAnalysis.hasData,
        tibialNerveAnalysis.hasData,
        posteriorTibialNerveAnalysis.hasData,
        femoralNerveAnalysis.hasData,
        saphenousNerveAnalysis.hasData,
        obturatorNerveAnalysis.hasData,
        lateralFemoralCutaneousNerveAnalysis.hasData,
        ilioinguinalNerveAnalysis.hasData,
      ].filter(Boolean).length,

      musculoskeletal: [
        lumbosacralStrainAnalysis.hasData,
        intervertebralDiscAnalysis.hasData,
        kneeInstabilityAnalysis.hasData,
        shoulderAnalysis.hasData,
        hipAnalysis.hasData,
        ankleAnalysis.hasData,
        wristAnalysis.hasData,
        elbowAnalysis.hasData,
        degenerativeArthritisAnalysis.hasData,
        plantarFasciitisAnalysis.hasData,
        tmjAnalysis.hasData,
        fibromyalgiaAnalysis.hasData,
        goutAnalysis.hasData,
        bursitisAnalysis.hasData,
        tendinitisAnalysis.hasData,
        myositisAnalysis.hasData,
        osteomyelitisAnalysis.hasData,
        multiJointArthritisAnalysis.hasData,
        vertebralFractureAnalysis.hasData,
        sacroiliacInjuryAnalysis.hasData,
        spinalStenosisAnalysis.hasData,
        ankylosingSpondylitisAnalysis.hasData,
        spinalFusionAnalysis.hasData,
        weakFootAnalysis.hasData,
        clawFootAnalysis.hasData,
        metatarsalgiaAnalysis.hasData,
        halluxValgusAnalysis.hasData,
        halluxRigidusAnalysis.hasData,
      ].filter(Boolean).length,

      respiratory: [
        sleepApneaAnalysis.hasData,
        asthmaAnalysis.hasData,
        rhinitisAnalysis.hasData,
        sinusitisAnalysis.hasData,
        copdAnalysis.hasData,
        chronicBronchitisAnalysis.hasData,
        emphysemaAnalysis.hasData,
        bronchiectasisAnalysis.hasData,
        pulmonaryFibrosisAnalysis.hasData,
        sarcoidosisAnalysis.hasData,
      ].filter(Boolean).length,

      cardiovascular: [
        hypertensionAnalysis.hasData,
        cardiomyopathyAnalysis.hasData,
        svtAnalysis.hasData,
        ventricularArrhythmiaAnalysis.hasData,
        pericarditisAnalysis.hasData,
        postPhlebiticAnalysis.hasData,
        cadAnalysis.hasData,
        postMIAnalysis.hasData,
        hypertensiveHeartAnalysis.hasData,
        coldInjuryAnalysis.hasData,
        padAnalysis.hasData,
        raynaudsAnalysis.hasData,
        varicoseVeinsAnalysis.hasData,
      ].filter(Boolean).length,

      digestive: [
        ibsAnalysis.hasData,
        gerdAnalysis.hasData,
        GERDComplicationsAnalysis.hasData,
        ulcerativeColitisAnalysis.hasData,
        pepticUlcerAnalysis.hasData,
        hemorrhoidAnalysis.hasData,
        diverticulitisAnalysis.hasData,
        cirrhosisAnalysis.hasData,
        gastritisAnalysis.hasData,
        pancreatitisAnalysis.hasData,
        biliaryTractAnalysis.hasData,
        herniaAnalysis.hasData,
        peritonealAdhesionsAnalysis.hasData,
        esophagealAnalysis.hasData,
        postgastrectomyAnalysis.hasData,
        intestinalFistulaAnalysis.hasData,
      ].filter(Boolean).length,

      endocrine: [
        diabetesAnalysis.hasData,
        hypothyroidismAnalysis.hasData,
        hyperthyroidismAnalysis.hasData,
        thyroiditisAnalysis.hasData,
        hyperparathyroidismAnalysis.hasData,
        hypoparathyroidismAnalysis.hasData,
        addisonsDiseaseAnalysis.hasData,
        cushingsSyndromeAnalysis.hasData,
        diabetesInsipidusAnalysis.hasData,
        hyperaldosteronismAnalysis.hasData,
      ].filter(Boolean).length,

      genitourinary: [
        kidneyStonesAnalysis.hasData,
        chronicRenalDiseaseAnalysis.hasData,
        voidingDysfunctionAnalysis.hasData,
        sphincterImpairmentAnalysis.hasData,
        erectileDysfunctionAnalysis.hasData,
        endometriosisAnalysis.hasData,
        femaleReproductiveOrgansAnalysis.hasData,
        pelvicProlapseAnalysis.hasData,
        femaleArousalDisorderAnalysis.hasData,
      ].filter(Boolean).length,

      skin: [
        eczemaAnalysis.hasData,
        psoriasisAnalysis.hasData,
        scarsAnalysis.hasData,
        chronicUrticariaAnalysis.hasData,
        acneAnalysis.hasData,
        chloracneAnalysis.hasData,
        alopeciaAreataAnalysis.hasData,
        hyperhidrosisAnalysis.hasData,
        discoidLupusAnalysis.hasData,
        bullousDisordersAnalysis.hasData,
        cutaneousVasculitisAnalysis.hasData,
        dermatophytosisAnalysis.hasData,
        skinInfectionsAnalysis.hasData,
      ].filter(Boolean).length,

      eyeEar: [
        visionAnalysis.hasData,
        hearingLossAnalysis.hasData,
        tinnitusAnalysis.hasData,
        menieresAnalysis.hasData,
        uveitisAnalysis.hasData,
        keratitisAnalysis.hasData,
        chronicConjunctivitisAnalysis.hasData,
        scleritisAnalysis.hasData,
        peripheralVestibularAnalysis.hasData,
        chronicSuppurativeOtitisMediaAnalysis.hasData,
        chronicOtitisExternaAnalysis.hasData,
        chronicNonsuppurativeOtitisMediaAnalysis.hasData,
      ].filter(Boolean).length,

      hemicLymphatic: [
        ironDeficiencyAnemiaAnalysis.hasData,
        folateDeficiencyAnemiaAnalysis.hasData,
        perniciousAnemiaAnalysis.hasData,
        hemolyticAnemiaAnalysis.hasData,
        sickleCellAnemiaAnalysis.hasData,
        aplasticAnemiaAnalysis.hasData,
        polycythemiaVeraAnalysis.hasData,
        immuneThrombocytopeniaAnalysis.hasData,
        leukemiaAnalysis.hasData,
        hodgkinsLymphomaAnalysis.hasData,
        multipleMyelomaAnalysis.hasData,
        nonHodgkinsLymphomaAnalysis.hasData,
        myeloproliferative7718Analysis.hasData,
        chronicMyelogenousLeukemiaAnalysis.hasData,
        solitaryPlasmacytomaAnalysis.hasData,
        myelodysplasticSyndromesAnalysis.hasData,
      ].filter(Boolean).length,

      infectious: [
        hivAnalysis.hasData,
        hepatitisBAnalysis.hasData,
        hepatitisCAnalysis.hasData,
        lymeDiseaseAnalysis.hasData,
        malariaAnalysis.hasData,
        brucellosisAnalysis.hasData,
        campylobacterAnalysis.hasData,
        qFeverAnalysis.hasData,
        salmonellaAnalysis.hasData,
        shigellaAnalysis.hasData,
        westNileAnalysis.hasData,
        ntmAnalysis.hasData,
      ].filter(Boolean).length,

      dental: [
        toothLossAnalysis.hasData,
        mandibleNonunionAnalysis.hasData,
        malignantOralNeoplasmAnalysis.hasData,
        benignOralNeoplasmAnalysis.hasData,
      ].filter(Boolean).length,

      other: [
        chronicFatigueAnalysis.hasData,
        insomniaAnalysis.hasData,
      ].filter(Boolean).length,
    };
  }, [
    // Mental Health
    ptsdAnalysis.hasData, majorDepressionAnalysis.hasData, generalizedAnxietyAnalysis.hasData,
    panicDisorderAnalysis.hasData, bipolarAnalysis.hasData, socialAnxietyAnalysis.hasData,
    ocdAnalysis.hasData, persistentDepressiveAnalysis.hasData, adjustmentDisorderAnalysis.hasData,
    unspecifiedAnxietyAnalysis.hasData, unspecifiedDepressiveAnalysis.hasData,
    somaticSymptomDisorderAnalysis.hasData, otherSpecifiedSomaticAnalysis.hasData,
    unspecifiedSomaticAnalysis.hasData, illnessAnxietyAnalysis.hasData,
    otherSpecifiedAnxietyAnalysis.hasData, depersonalizationAnalysis.hasData,
    cyclothymicAnalysis.hasData, anorexiaNervosaAnalysis.hasData, bulimiaNervosaAnalysis.hasData,
    schizophreniaAnalysis.hasData, schizoaffectiveDisorderAnalysis.hasData,
    delusionalDisorderAnalysis.hasData, psychoticDisorderNOSAnalysis.hasData,
    briefPsychoticDisorderAnalysis.hasData, bingeEatingDisorderAnalysis.hasData,
    dissociativeIdentityDisorderAnalysis.hasData, dissociativeAmnesiaAnalysis.hasData,
    acuteStressDisorderAnalysis.hasData, antisocialPersonalityDisorderAnalysis.hasData,
    borderlinePersonalityDisorderAnalysis.hasData, narcissisticPersonalityDisorderAnalysis.hasData,
    avoidantPersonalityDisorderAnalysis.hasData,
    // Neurological
    migraineAnalysis.hasData, tbiAnalysis.hasData, tbiResidualsAnalysis.hasData,
    epilepsyMajorAnalysis.hasData, epilepsyMinorAnalysis.hasData, jacksonianEpilepsyAnalysis.hasData,
    diencephalicEpilepsyAnalysis.hasData, psychomotorEpilepsyAnalysis.hasData,
    radiculopathyAnalysis.hasData, peripheralNeuropathyAnalysis.hasData,
    multipleSclerosisAnalysis.hasData, parkinsonsAnalysis.hasData, myastheniaGravisAnalysis.hasData,
    narcolepsyAnalysis.hasData, alsAnalysis.hasData, syringomyeliaAnalysis.hasData,
    myelitisAnalysis.hasData, upperRadicularAnalysis.hasData, middleRadicularAnalysis.hasData,
    lowerRadicularAnalysis.hasData, allRadicularAnalysis.hasData, radialNerveAnalysis.hasData,
    medianNerveAnalysis.hasData, ulnarNerveAnalysis.hasData, musculocutaneousNerveAnalysis.hasData,
    circumflexNerveAnalysis.hasData, longThoracicNerveAnalysis.hasData, sciaticNerveAnalysis.hasData,
    commonPeronealNerveAnalysis.hasData, superficialPeronealNerveAnalysis.hasData,
    deepPeronealNerveAnalysis.hasData, tibialNerveAnalysis.hasData, posteriorTibialNerveAnalysis.hasData,
    femoralNerveAnalysis.hasData, saphenousNerveAnalysis.hasData, obturatorNerveAnalysis.hasData,
    lateralFemoralCutaneousNerveAnalysis.hasData, ilioinguinalNerveAnalysis.hasData,
    // Musculoskeletal
    lumbosacralStrainAnalysis.hasData, intervertebralDiscAnalysis.hasData, kneeInstabilityAnalysis.hasData,
    shoulderAnalysis.hasData, hipAnalysis.hasData, ankleAnalysis.hasData, wristAnalysis.hasData,
    elbowAnalysis.hasData, degenerativeArthritisAnalysis.hasData, plantarFasciitisAnalysis.hasData,
    tmjAnalysis.hasData, fibromyalgiaAnalysis.hasData, goutAnalysis.hasData, bursitisAnalysis.hasData,
    tendinitisAnalysis.hasData, myositisAnalysis.hasData, osteomyelitisAnalysis.hasData,
    multiJointArthritisAnalysis.hasData, vertebralFractureAnalysis.hasData, sacroiliacInjuryAnalysis.hasData,
    spinalStenosisAnalysis.hasData, ankylosingSpondylitisAnalysis.hasData, spinalFusionAnalysis.hasData,
    weakFootAnalysis.hasData, clawFootAnalysis.hasData, metatarsalgiaAnalysis.hasData,
    halluxValgusAnalysis.hasData, halluxRigidusAnalysis.hasData,
    // Respiratory
    sleepApneaAnalysis.hasData, asthmaAnalysis.hasData, rhinitisAnalysis.hasData,
    sinusitisAnalysis.hasData, copdAnalysis.hasData, chronicBronchitisAnalysis.hasData,
    emphysemaAnalysis.hasData, bronchiectasisAnalysis.hasData, pulmonaryFibrosisAnalysis.hasData,
    sarcoidosisAnalysis.hasData,
    // Cardiovascular
    hypertensionAnalysis.hasData, cardiomyopathyAnalysis.hasData, svtAnalysis.hasData,
    ventricularArrhythmiaAnalysis.hasData, pericarditisAnalysis.hasData, postPhlebiticAnalysis.hasData,
    cadAnalysis.hasData, postMIAnalysis.hasData, hypertensiveHeartAnalysis.hasData,
    coldInjuryAnalysis.hasData, padAnalysis.hasData, raynaudsAnalysis.hasData, varicoseVeinsAnalysis.hasData,
    // Digestive
    ibsAnalysis.hasData, gerdAnalysis.hasData, GERDComplicationsAnalysis.hasData,
    ulcerativeColitisAnalysis.hasData, pepticUlcerAnalysis.hasData, hemorrhoidAnalysis.hasData,
    diverticulitisAnalysis.hasData, cirrhosisAnalysis.hasData, gastritisAnalysis.hasData,
    pancreatitisAnalysis.hasData, biliaryTractAnalysis.hasData, herniaAnalysis.hasData,
    peritonealAdhesionsAnalysis.hasData, esophagealAnalysis.hasData, postgastrectomyAnalysis.hasData,
    intestinalFistulaAnalysis.hasData,
    // Endocrine
    diabetesAnalysis.hasData, hypothyroidismAnalysis.hasData, hyperthyroidismAnalysis.hasData,
    thyroiditisAnalysis.hasData, hyperparathyroidismAnalysis.hasData, hypoparathyroidismAnalysis.hasData,
    addisonsDiseaseAnalysis.hasData, cushingsSyndromeAnalysis.hasData, diabetesInsipidusAnalysis.hasData,
    hyperaldosteronismAnalysis.hasData,
    // Genitourinary
    kidneyStonesAnalysis.hasData, chronicRenalDiseaseAnalysis.hasData, voidingDysfunctionAnalysis.hasData,
    sphincterImpairmentAnalysis.hasData, erectileDysfunctionAnalysis.hasData, endometriosisAnalysis.hasData,
    femaleReproductiveOrgansAnalysis.hasData, pelvicProlapseAnalysis.hasData, femaleArousalDisorderAnalysis.hasData,
    // Skin
    eczemaAnalysis.hasData, psoriasisAnalysis.hasData, scarsAnalysis.hasData, chronicUrticariaAnalysis.hasData,
    acneAnalysis.hasData, chloracneAnalysis.hasData, alopeciaAreataAnalysis.hasData, hyperhidrosisAnalysis.hasData,
    discoidLupusAnalysis.hasData, bullousDisordersAnalysis.hasData, cutaneousVasculitisAnalysis.hasData,
    dermatophytosisAnalysis.hasData, skinInfectionsAnalysis.hasData,
    // Eye/Ear
    visionAnalysis.hasData, hearingLossAnalysis.hasData, tinnitusAnalysis.hasData, menieresAnalysis.hasData,
    uveitisAnalysis.hasData, keratitisAnalysis.hasData, chronicConjunctivitisAnalysis.hasData,
    scleritisAnalysis.hasData, peripheralVestibularAnalysis.hasData, chronicSuppurativeOtitisMediaAnalysis.hasData,
    chronicOtitisExternaAnalysis.hasData, chronicNonsuppurativeOtitisMediaAnalysis.hasData,
    // Hemic/Lymphatic
    ironDeficiencyAnemiaAnalysis.hasData, folateDeficiencyAnemiaAnalysis.hasData, perniciousAnemiaAnalysis.hasData,
    hemolyticAnemiaAnalysis.hasData, sickleCellAnemiaAnalysis.hasData, aplasticAnemiaAnalysis.hasData,
    polycythemiaVeraAnalysis.hasData, immuneThrombocytopeniaAnalysis.hasData, leukemiaAnalysis.hasData,
    hodgkinsLymphomaAnalysis.hasData, multipleMyelomaAnalysis.hasData, nonHodgkinsLymphomaAnalysis.hasData,
    myeloproliferative7718Analysis.hasData, chronicMyelogenousLeukemiaAnalysis.hasData,
    solitaryPlasmacytomaAnalysis.hasData, myelodysplasticSyndromesAnalysis.hasData,
    // Infectious
    hivAnalysis.hasData, hepatitisBAnalysis.hasData, hepatitisCAnalysis.hasData, lymeDiseaseAnalysis.hasData,
    malariaAnalysis.hasData, brucellosisAnalysis.hasData, campylobacterAnalysis.hasData, qFeverAnalysis.hasData,
    salmonellaAnalysis.hasData, shigellaAnalysis.hasData, westNileAnalysis.hasData, ntmAnalysis.hasData,
    // Dental
    toothLossAnalysis.hasData, mandibleNonunionAnalysis.hasData, malignantOralNeoplasmAnalysis.hasData,
    benignOralNeoplasmAnalysis.hasData,
    // Other
    chronicFatigueAnalysis.hasData, insomniaAnalysis.hasData,
  ]);

  // Total conditions with data
  const totalConditionsWithData = Object.values(bodySystemCounts).reduce((a, b) => a + b, 0);

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
        ankleAnalysis.hasData ||
        wristAnalysis.hasData ||
        elbowAnalysis.hasData ||
        degenerativeArthritisAnalysis.hasData ||
        asthmaAnalysis.hasData ||
        eczemaAnalysis.hasData ||
        GERDComplicationsAnalysis.hasData ||
        ulcerativeColitisAnalysis.hasData ||
        pepticUlcerAnalysis.hasData ||
        hemorrhoidAnalysis.hasData ||
        diverticulitisAnalysis.hasData ||
        hypothyroidismAnalysis.hasData ||
        raynaudsAnalysis.hasData ||
        varicoseVeinsAnalysis.hasData ||
        chronicUrticariaAnalysis.hasData ||
        hearingLossAnalysis.hasData ||
        psoriasisAnalysis.hasData ||
        scarsAnalysis.hasData ||
        tbiResidualsAnalysis.hasData ||
        tinnitusAnalysis.hasData ||
        fibromyalgiaAnalysis.hasData ||
        epilepsyMajorAnalysis.hasData ||
        epilepsyMinorAnalysis.hasData ||
        jacksonianEpilepsyAnalysis.hasData ||
        diencephalicEpilepsyAnalysis.hasData ||
        psychomotorEpilepsyAnalysis.hasData ||
        visionAnalysis.hasData ||
        kidneyStonesAnalysis.hasData ||
        chronicRenalDiseaseAnalysis.hasData ||
        voidingDysfunctionAnalysis.hasData ||
        sphincterImpairmentAnalysis.hasData ||
        erectileDysfunctionAnalysis.hasData ||
        endometriosisAnalysis.hasData ||
        femaleReproductiveOrgansAnalysis.hasData ||
        pelvicProlapseAnalysis.hasData ||
        femaleArousalDisorderAnalysis.hasData ||
        ironDeficiencyAnemiaAnalysis.hasData ||
        folateDeficiencyAnemiaAnalysis.hasData ||
        perniciousAnemiaAnalysis.hasData ||
        hemolyticAnemiaAnalysis.hasData ||
        sickleCellAnemiaAnalysis.hasData ||
        aplasticAnemiaAnalysis.hasData ||
        polycythemiaVeraAnalysis.hasData ||
        immuneThrombocytopeniaAnalysis.hasData ||
        leukemiaAnalysis.hasData ||
        hodgkinsLymphomaAnalysis.hasData ||
        multipleMyelomaAnalysis.hasData ||
        nonHodgkinsLymphomaAnalysis.hasData ||
        myeloproliferative7718Analysis.hasData ||
        chronicMyelogenousLeukemiaAnalysis.hasData ||
        solitaryPlasmacytomaAnalysis.hasData ||
        myelodysplasticSyndromesAnalysis.hasData ||
        toothLossAnalysis.hasData ||
        mandibleNonunionAnalysis.hasData ||
        malignantOralNeoplasmAnalysis.hasData ||
        benignOralNeoplasmAnalysis.hasData ||
        hivAnalysis.hasData  ||
        hepatitisBAnalysis.hasData ||
        hepatitisCAnalysis.hasData ||
        lymeDiseaseAnalysis.hasData ||
        malariaAnalysis.hasData ||
        brucellosisAnalysis.hasData ||
        campylobacterAnalysis.hasData ||
        qFeverAnalysis.hasData ||
        salmonellaAnalysis.hasData ||
        shigellaAnalysis.hasData ||
        westNileAnalysis.hasData ||
        ntmAnalysis.hasData ||
        schizophreniaAnalysis.hasData ||
        schizoaffectiveDisorderAnalysis.hasData ||
        delusionalDisorderAnalysis.hasData ||
        psychoticDisorderNOSAnalysis.hasData ||
        briefPsychoticDisorderAnalysis.hasData ||
        bingeEatingDisorderAnalysis.hasData ||
        dissociativeIdentityDisorderAnalysis.hasData ||
        dissociativeAmnesiaAnalysis.hasData ||
        acuteStressDisorderAnalysis.hasData ||
        antisocialPersonalityDisorderAnalysis.hasData ||
        borderlinePersonalityDisorderAnalysis.hasData ||
        narcissisticPersonalityDisorderAnalysis.hasData ||
        avoidantPersonalityDisorderAnalysis.hasData ||
        cardiomyopathyAnalysis.hasData ||
        svtAnalysis.hasData ||
        ventricularArrhythmiaAnalysis.hasData ||
        pericarditisAnalysis.hasData ||
        postPhlebiticAnalysis.hasData ||
        cadAnalysis.hasData ||
        postMIAnalysis.hasData ||
        hypertensiveHeartAnalysis.hasData ||
        cirrhosisAnalysis.hasData ||
        gastritisAnalysis.hasData ||
        pancreatitisAnalysis.hasData ||
        biliaryTractAnalysis.hasData ||
        copdAnalysis.hasData ||
        chronicBronchitisAnalysis.hasData ||
        emphysemaAnalysis.hasData ||
        bronchiectasisAnalysis.hasData ||
        pulmonaryFibrosisAnalysis.hasData ||
        sarcoidosisAnalysis.hasData ||
        multipleSclerosisAnalysis.hasData ||
        parkinsonsAnalysis.hasData ||
        myastheniaGravisAnalysis.hasData ||
        narcolepsyAnalysis.hasData ||
        alsAnalysis.hasData ||
        syringomyeliaAnalysis.hasData ||
        myelitisAnalysis.hasData ||
        upperRadicularAnalysis.hasData ||
        middleRadicularAnalysis.hasData ||
        lowerRadicularAnalysis.hasData ||
        allRadicularAnalysis.hasData ||
        radialNerveAnalysis.hasData ||
        medianNerveAnalysis.hasData ||
        ulnarNerveAnalysis.hasData ||
        musculocutaneousNerveAnalysis.hasData ||
        circumflexNerveAnalysis.hasData ||
        longThoracicNerveAnalysis.hasData ||
        sciaticNerveAnalysis.hasData ||
        commonPeronealNerveAnalysis.hasData ||
        superficialPeronealNerveAnalysis.hasData ||
        deepPeronealNerveAnalysis.hasData ||
        tibialNerveAnalysis.hasData ||
        posteriorTibialNerveAnalysis.hasData ||
        femoralNerveAnalysis.hasData ||
        saphenousNerveAnalysis.hasData ||
        obturatorNerveAnalysis.hasData ||
        lateralFemoralCutaneousNerveAnalysis.hasData ||
        ilioinguinalNerveAnalysis.hasData ||
        hyperthyroidismAnalysis.hasData ||
        thyroiditisAnalysis.hasData ||
        hyperparathyroidismAnalysis.hasData ||
        hypoparathyroidismAnalysis.hasData ||
        addisonsDiseaseAnalysis.hasData ||
        cushingsSyndromeAnalysis.hasData ||
        diabetesInsipidusAnalysis.hasData ||
        hyperaldosteronismAnalysis.hasData ||
        goutAnalysis.hasData ||
        bursitisAnalysis.hasData ||
        tendinitisAnalysis.hasData ||
        myositisAnalysis.hasData ||
        osteomyelitisAnalysis.hasData ||
        multiJointArthritisAnalysis.hasData ||
        vertebralFractureAnalysis.hasData ||
        sacroiliacInjuryAnalysis.hasData ||
        spinalStenosisAnalysis.hasData ||
        ankylosingSpondylitisAnalysis.hasData ||
        spinalFusionAnalysis.hasData ||
        weakFootAnalysis.hasData ||
        clawFootAnalysis.hasData ||
        metatarsalgiaAnalysis.hasData ||
        halluxValgusAnalysis.hasData ||
        halluxRigidusAnalysis.hasData ||
        herniaAnalysis.hasData ||
        peritonealAdhesionsAnalysis.hasData ||
        esophagealAnalysis.hasData ||
        postgastrectomyAnalysis.hasData ||
        intestinalFistulaAnalysis.hasData ||
        acneAnalysis.hasData ||
        chloracneAnalysis.hasData ||
        alopeciaAreataAnalysis.hasData ||
        hyperhidrosisAnalysis.hasData ||
        discoidLupusAnalysis.hasData ||
        bullousDisordersAnalysis.hasData ||
        cutaneousVasculitisAnalysis.hasData ||
        dermatophytosisAnalysis.hasData ||
        skinInfectionsAnalysis.hasData ||
        dermatophytosisAnalysis.hasData ||
        skinInfectionsAnalysis.hasData ||
        uveitisAnalysis.hasData ||
        keratitisAnalysis.hasData ||
        chronicConjunctivitisAnalysis.hasData ||
        scleritisAnalysis.hasData ||
        peripheralVestibularAnalysis.hasData ||
        chronicSuppurativeOtitisMediaAnalysis.hasData ||
        chronicOtitisExternaAnalysis.hasData ||
        chronicNonsuppurativeOtitisMediaAnalysis.hasData
    ;

    return (
        <div className="space-y-4 text-left">
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

          {/* Suggested Related Conditions - Veterans Only */}
          {isVeteran && suggestedConditions.length > 0 && showSuggestedConditions && (
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-lg border border-blue-200 dark:border-blue-800 p-4">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h3 className="font-medium text-blue-900 dark:text-blue-200 flex items-center gap-2">
                      <span>💡</span> Conditions You May Want to Track
                    </h3>
                    <p className="text-xs text-blue-700 dark:text-blue-300 mt-1">
                      Based on your tracked conditions, veterans commonly also claim:
                    </p>
                  </div>
                  <button
                      onClick={() => setShowSuggestedConditions(false)}
                      className="text-blue-400 hover:text-blue-600 dark:hover:text-blue-300 text-sm"
                  >
                    ✕
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {suggestedConditions.map((condition, index) => (
                      <div
                          key={condition.categoryId || index}
                          className="bg-white dark:bg-gray-800 rounded-lg p-3 border border-blue-100 dark:border-gray-700"
                      >
                        <div className="flex items-center gap-2 mb-1">
                                    <span className="font-medium text-gray-900 dark:text-white text-sm">
                                        {condition.name}
                                    </span>
                          <span className="text-xs px-1.5 py-0.5 bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 rounded">
                                        DC {condition.dcCode}
                                    </span>
                        </div>
                        <p className="text-xs text-gray-600 dark:text-gray-400">
                          {condition.reason}
                        </p>
                        <p className="text-xs text-blue-600 dark:text-blue-400 mt-1 italic">
                          Related to: {condition.triggeredBy}
                        </p>
                      </div>
                  ))}
                </div>

                <p className="text-xs text-blue-600 dark:text-blue-400 mt-3">
                  💡 Add these to your Chronic Symptoms on the Log tab to start tracking
                </p>
              </div>
          )}

          {/* ============================================ */}
          {/* GROUPED RATING CARDS BY BODY SYSTEM */}
          {/* ============================================ */}

          {/* Summary of conditions with data */}
          {totalConditionsWithData > 0 && (
              <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium text-gray-900 dark:text-white">
                      Conditions with Logged Data
                    </h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {totalConditionsWithData} condition{totalConditionsWithData !== 1 ? 's' : ''} across {Object.values(bodySystemCounts).filter(c => c > 0).length} body systems
                    </p>
                  </div>
                  <div className="text-3xl font-bold text-blue-600 dark:text-blue-400">
                    {totalConditionsWithData}
                  </div>
                </div>
              </div>
          )}

          {/* ========== MUSCULOSKELETAL ========== */}
          <ConditionGroup
              title="Musculoskeletal"
              icon="🦴"
              conditionCount={bodySystemCounts.musculoskeletal}
              accentColor="amber"
              groupId="musculoskeletal"
              isExpanded={expandedGroup === 'musculoskeletal'}
              onToggle={toggleGroup}
          >
            <GenericRatingCard
                analysis={lumbosacralStrainAnalysis}
                expanded={expandedSection === 'lumbosacral-strain'}
                onToggle={() => toggleSection('lumbosacral-strain')}
                icon="🦴"
            />
            <GenericRatingCard
                analysis={intervertebralDiscAnalysis}
                expanded={expandedSection === 'intervertebral-disc'}
                onToggle={() => toggleSection('intervertebral-disc')}
                icon="💿"
            />
            <GenericRatingCard
                analysis={kneeInstabilityAnalysis}
                expanded={expandedSection === 'knee-instability'}
                onToggle={() => toggleSection('knee-instability')}
                icon="🦵"
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
            <GenericJointRatingCard
                analysis={ankleAnalysis}
                expanded={expandedSection === 'ankle'}
                onToggle={() => toggleSection('ankle')}
                icon="🦶"
            />
            <GenericJointRatingCard
                analysis={wristAnalysis}
                expanded={expandedSection === 'wrist'}
                onToggle={() => toggleSection('wrist')}
                icon="✋"
            />
            <GenericJointRatingCard
                analysis={elbowAnalysis}
                expanded={expandedSection === 'elbow'}
                onToggle={() => toggleSection('elbow')}
                icon="💪"
            />
            <GenericJointRatingCard
                analysis={degenerativeArthritisAnalysis}
                expanded={expandedSection === 'degenerativeArthritis'}
                onToggle={() => toggleSection('degenerativeArthritis')}
                icon="🦴"
            />
            <PlantarFasciitisRatingCard
                analysis={plantarFasciitisAnalysis}
                expanded={expandedSection === 'plantar-fasciitis'}
                onToggle={() => toggleSection('plantar-fasciitis')}
            />
            <TMJRatingCard
                analysis={tmjAnalysis}
                expanded={expandedSection === 'tmj'}
                onToggle={() => toggleSection('tmj')}
            />
            <GenericRatingCard
                analysis={fibromyalgiaAnalysis}
                expanded={expandedSection === 'fibromyalgia'}
                onToggle={() => toggleSection('fibromyalgia')}
                icon="💪"
            />
            <GoutRatingCard
                analysis={goutAnalysis}
                expanded={expandedSection === 'gout'}
                onToggle={() => toggleSection('gout')}
            />
            <BursitisRatingCard
                analysis={bursitisAnalysis}
                expanded={expandedSection === 'bursitis'}
                onToggle={() => toggleSection('bursitis')}
            />
            <TendinitisRatingCard
                analysis={tendinitisAnalysis}
                expanded={expandedSection === 'tendinitis'}
                onToggle={() => toggleSection('tendinitis')}
            />
            <MyositisRatingCard
                analysis={myositisAnalysis}
                expanded={expandedSection === 'myositis'}
                onToggle={() => toggleSection('myositis')}
            />
            <OsteomyelitisRatingCard
                analysis={osteomyelitisAnalysis}
                expanded={expandedSection === 'osteomyelitis'}
                onToggle={() => toggleSection('osteomyelitis')}
            />
            <MultiJointArthritisRatingCard
                analysis={multiJointArthritisAnalysis}
                expanded={expandedSection === 'multi-joint-arthritis'}
                onToggle={() => toggleSection('multi-joint-arthritis')}
            />
            {/* Spine Conditions */}
            <SpineConditionsRatingCard
                analysis={vertebralFractureAnalysis}
                diagnosticCode="5235"
                expanded={expandedSection === 'vertebral-fracture'}
                onToggle={() => toggleSection('vertebral-fracture')}
            />
            <SpineConditionsRatingCard
                analysis={sacroiliacInjuryAnalysis}
                diagnosticCode="5236"
                expanded={expandedSection === 'sacroiliac-injury'}
                onToggle={() => toggleSection('sacroiliac-injury')}
            />
            <SpineConditionsRatingCard
                analysis={spinalStenosisAnalysis}
                diagnosticCode="5238"
                expanded={expandedSection === 'spinal-stenosis'}
                onToggle={() => toggleSection('spinal-stenosis')}
            />
            <SpineConditionsRatingCard
                analysis={ankylosingSpondylitisAnalysis}
                diagnosticCode="5240"
                expanded={expandedSection === 'ankylosing-spondylitis'}
                onToggle={() => toggleSection('ankylosing-spondylitis')}
            />
            <SpineConditionsRatingCard
                analysis={spinalFusionAnalysis}
                diagnosticCode="5241"
                expanded={expandedSection === 'spinal-fusion'}
                onToggle={() => toggleSection('spinal-fusion')}
            />
            {/* Foot Conditions */}
            <FootConditionsRatingCard
                analysis={weakFootAnalysis}
                diagnosticCode="5277"
                expanded={expandedSection === 'weak-foot'}
                onToggle={() => toggleSection('weak-foot')}
            />
            <FootConditionsRatingCard
                analysis={clawFootAnalysis}
                diagnosticCode="5278"
                expanded={expandedSection === 'claw-foot'}
                onToggle={() => toggleSection('claw-foot')}
            />
            <FootConditionsRatingCard
                analysis={metatarsalgiaAnalysis}
                diagnosticCode="5279"
                expanded={expandedSection === 'metatarsalgia'}
                onToggle={() => toggleSection('metatarsalgia')}
            />
            <FootConditionsRatingCard
                analysis={halluxValgusAnalysis}
                diagnosticCode="5280"
                expanded={expandedSection === 'hallux-valgus'}
                onToggle={() => toggleSection('hallux-valgus')}
            />
            <FootConditionsRatingCard
                analysis={halluxRigidusAnalysis}
                diagnosticCode="5281"
                expanded={expandedSection === 'hallux-rigidus'}
                onToggle={() => toggleSection('hallux-rigidus')}
            />
          </ConditionGroup>

          {/* ========== RESPIRATORY ========== */}
          <ConditionGroup
              title="Respiratory"
              icon="🫁"
              conditionCount={bodySystemCounts.respiratory}
              accentColor="cyan"
              groupId="respiratory"
              isExpanded={expandedGroup === 'respiratory'}
              onToggle={toggleGroup}
          >

          <SleepApneaRatingCard
                analysis={sleepApneaAnalysis}
                profile={sleepApneaProfile}
                expanded={expandedSection === 'sleep-apnea'}
                onToggle={() => toggleSection('sleep-apnea')}
                onSetupClick={() => setShowSleepApneaSetup(true)}
            />
            <AsthmaRatingCard
                analysis={asthmaAnalysis}
                expanded={expandedSection === 'asthma'}
                onToggle={() => toggleSection('asthma')}
            />
            <RhinitisRatingCard
                analysis={rhinitisAnalysis}
                expanded={expandedSection === 'rhinitis'}
                onToggle={() => toggleSection('rhinitis')}
            />
            <SinusitisRatingCard
                analysis={sinusitisAnalysis}
                expanded={expandedSection === 'sinusitis'}
                onToggle={() => toggleSection('sinusitis')}
            />
            <COPDRatingCard
                analysis={copdAnalysis}
                expanded={expandedSection === 'copd'}
                onToggle={() => toggleSection('copd')}
            />
            <ChronicBronchitisRatingCard
                analysis={chronicBronchitisAnalysis}
                expanded={expandedSection === 'chronic-bronchitis'}
                onToggle={() => toggleSection('chronic-bronchitis')}
            />
            <EmphysemaRatingCard
                analysis={emphysemaAnalysis}
                expanded={expandedSection === 'emphysema'}
                onToggle={() => toggleSection('emphysema')}
            />
            <BronchiectasisRatingCard
                analysis={bronchiectasisAnalysis}
                expanded={expandedSection === 'bronchiectasis'}
                onToggle={() => toggleSection('bronchiectasis')}
            />
            <PulmonaryFibrosisRatingCard
                analysis={pulmonaryFibrosisAnalysis}
                expanded={expandedSection === 'pulmonary-fibrosis'}
                onToggle={() => toggleSection('pulmonary-fibrosis')}
            />
            <SarcoidosisRatingCard
                analysis={sarcoidosisAnalysis}
                expanded={expandedSection === 'sarcoidosis'}
                onToggle={() => toggleSection('sarcoidosis')}
            />
          </ConditionGroup>


          {/* ========== EYE & EAR ========== */}
          <ConditionGroup
              title="Eye & Ear"
              icon="👁️"
              conditionCount={bodySystemCounts.eyeEar}
              accentColor="blue"
              groupId="eyeEar"
              isExpanded={expandedGroup === 'eyeEar'}
              onToggle={toggleGroup}
          >
            <EyeVisionRatingCard
                logs={logs}
                expanded={expandedSection === 'vision'}
                onToggle={() => toggleSection('vision')}
            />
            <HearingLossRatingCard
                analysis={hearingLossAnalysis}
                expanded={expandedSection === 'hearingLoss'}
                onToggle={() => toggleSection('hearingLoss')}
            />
            <GenericRatingCard
                analysis={tinnitusAnalysis}
                expanded={expandedSection === 'tinnitus'}
                onToggle={() => toggleSection('tinnitus')}
                icon="👂"
            />
            <MenieresRatingCard
                analysis={menieresAnalysis}
                expanded={expandedSection === 'menieres'}
                onToggle={() => toggleSection('menieres')}
            />
            <GeneralEyeRatingCard
                analysis={uveitisAnalysis}
                expanded={expandedSection === 'uveitis'}
                onToggle={() => toggleSection('uveitis')}
            />
            <GeneralEyeRatingCard
                analysis={keratitisAnalysis}
                expanded={expandedSection === 'keratitis'}
                onToggle={() => toggleSection('keratitis')}
            />
            <GeneralEyeRatingCard
                analysis={chronicConjunctivitisAnalysis}
                expanded={expandedSection === 'chronic-conjunctivitis'}
                onToggle={() => toggleSection('chronic-conjunctivitis')}
            />
            <GeneralEyeRatingCard
                analysis={scleritisAnalysis}
                expanded={expandedSection === 'scleritis'}
                onToggle={() => toggleSection('scleritis')}
            />
            <EarConditionsRatingCard
                analysis={peripheralVestibularAnalysis}
                expanded={expandedSection === 'peripheral-vestibular'}
                onToggle={() => toggleSection('peripheral-vestibular')}
            />
            <EarConditionsRatingCard
                analysis={chronicSuppurativeOtitisMediaAnalysis}
                expanded={expandedSection === 'chronic-suppurative-otitis-media'}
                onToggle={() => toggleSection('chronic-suppurative-otitis-media')}
            />
            <EarConditionsRatingCard
                analysis={chronicOtitisExternaAnalysis}
                expanded={expandedSection === 'chronic-otitis-externa'}
                onToggle={() => toggleSection('chronic-otitis-externa')}
            />
            <EarConditionsRatingCard
                analysis={chronicNonsuppurativeOtitisMediaAnalysis}
                expanded={expandedSection === 'chronic-nonsuppurative-otitis-media'}
                onToggle={() => toggleSection('chronic-nonsuppurative-otitis-media')}
            />
          </ConditionGroup>

          {/* ========== INFECTIOUS DISEASES ========== */}
          <ConditionGroup
              title="Infectious Diseases"
              icon="🦠"
              conditionCount={bodySystemCounts.infectious}
              accentColor="green"
              groupId="infectious"
              isExpanded={expandedGroup === 'infectious'}
              onToggle={toggleGroup}
          >
            <HIVRatingCard
                analysis={hivAnalysis}
                expanded={expandedSection === 'hiv-aids'}
                onToggle={() => toggleSection('hiv-aids')}
            />
            <HepatitisCRatingCard
                analysis={hepatitisCAnalysis}
                expanded={expandedSection === 'hepatitis-c'}
                onToggle={() => toggleSection('hepatitis-c')}
            />
            <HepatitisBRatingCard
                analysis={hepatitisBAnalysis}
                expanded={expandedSection === 'hepatitis-b'}
                onToggle={() => toggleSection('hepatitis-b')}
            />
            <LymeDiseaseRatingCard
                analysis={lymeDiseaseAnalysis}
                expanded={expandedSection === 'lyme-disease'}
                onToggle={() => toggleSection('lyme-disease')}
            />
            <MalariaRatingCard
                analysis={malariaAnalysis}
                expanded={expandedSection === 'malaria'}
                onToggle={() => toggleSection('malaria')}
            />
            <BrucellosisRatingCard
                analysis={brucellosisAnalysis}
                expanded={expandedSection === 'brucellosis'}
                onToggle={() => toggleSection('brucellosis')}
            />
            <CampylobacterRatingCard
                analysis={campylobacterAnalysis}
                expanded={expandedSection === 'campylobacter'}
                onToggle={() => toggleSection('campylobacter')}
            />
            <QFeverRatingCard
                analysis={qFeverAnalysis}
                expanded={expandedSection === 'q-fever'}
                onToggle={() => toggleSection('q-fever')}
            />
            <SalmonellaRatingCard
                analysis={salmonellaAnalysis}
                expanded={expandedSection === 'salmonella'}
                onToggle={() => toggleSection('salmonella')}
            />
            <ShigellaRatingCard
                analysis={shigellaAnalysis}
                expanded={expandedSection === 'shigella'}
                onToggle={() => toggleSection('shigella')}
            />
            <WestNileRatingCard
                analysis={westNileAnalysis}
                expanded={expandedSection === 'westNile'}
                onToggle={() => toggleSection('westNile')}
            />
            <NTMRatingCard
                analysis={ntmAnalysis}
                expanded={expandedSection === 'ntm'}
                onToggle={() => toggleSection('ntm')}
            />
          </ConditionGroup>

          {/* ========== CARDIOVASCULAR ========== */}
          <ConditionGroup
              title="Cardiovascular"
              icon="❤️"
              conditionCount={bodySystemCounts.cardiovascular}
              accentColor="red"
              groupId="cardiovascular"
              isExpanded={expandedGroup === 'cardiovascular'}
              onToggle={toggleGroup}
          >
            <HypertensionRatingCard
                analysis={hypertensionAnalysis}
                expanded={expandedSection === 'hypertension'}
                onToggle={() => toggleSection('hypertension')}
            />
            <CardiomyopathyRatingCard
                analysis={cardiomyopathyAnalysis}
                expanded={expandedSection === 'cardiomyopathy'}
                onToggle={() => toggleSection('cardiomyopathy')}
            />
            <ArrhythmiaRatingCard
                analysis={svtAnalysis}
                expanded={expandedSection === 'svt'}
                onToggle={() => toggleSection('svt')}
            />
            <ArrhythmiaRatingCard
                analysis={ventricularArrhythmiaAnalysis}
                expanded={expandedSection === 'ventricular-arrhythmia'}
                onToggle={() => toggleSection('ventricular-arrhythmia')}
            />
            <PericarditisRatingCard
                analysis={pericarditisAnalysis}
                expanded={expandedSection === 'pericarditis'}
                onToggle={() => toggleSection('pericarditis')}
            />
            <PostPhlebiticRatingCard
                analysis={postPhlebiticAnalysis}
                expanded={expandedSection === 'post-phlebitic'}
                onToggle={() => toggleSection('post-phlebitic')}
            />
            <CADRatingCard
                analysis={cadAnalysis}
                expanded={expandedSection === 'cad'}
                onToggle={() => toggleSection('cad')}
            />
            <PostMIRatingCard
                analysis={postMIAnalysis}
                expanded={expandedSection === 'post-mi'}
                onToggle={() => toggleSection('post-mi')}
            />
            <HypertensiveHeartRatingCard
                analysis={hypertensiveHeartAnalysis}
                expanded={expandedSection === 'hypertensive-heart'}
                onToggle={() => toggleSection('hypertensive-heart')}
            />
            <ColdInjuryRatingCard
                analysis={coldInjuryAnalysis}
                expanded={expandedSection === 'cold-injury'}
                onToggle={() => toggleSection('cold-injury')}
            />
            <PADRatingCard
                analysis={padAnalysis}
                expanded={expandedSection === 'peripheral-arterial-disease'}
                onToggle={() => toggleSection('peripheral-arterial-disease')}
            />
            <GenericRatingCard
                analysis={raynaudsAnalysis}
                expanded={expandedSection === 'raynauds'}
                onToggle={() => toggleSection('raynauds')}
                icon="🥶"
            />
            <GenericRatingCard
                analysis={varicoseVeinsAnalysis}
                expanded={expandedSection === 'varicoseVeins'}
                onToggle={() => toggleSection('varicoseVeins')}
                icon="🦵"
            />
          </ConditionGroup>

          {/* ========== DIGESTIVE ========== */}
          <ConditionGroup
              title="Digestive"
              icon="🫃"
              conditionCount={bodySystemCounts.digestive}
              accentColor="lime"
              groupId="digestive"
              isExpanded={expandedGroup === 'digestive'}
              onToggle={toggleGroup}
          >
            <IBSRatingCard
                analysis={ibsAnalysis}
                expanded={expandedSection === 'ibs'}
                onToggle={() => toggleSection('ibs')}
            />
            <GERDRatingCard
                analysis={gerdAnalysis}
                expanded={expandedSection === 'gerd'}
                onToggle={() => toggleSection('gerd')}
            />
            <GERDComplicationsRatingCard
                analysis={gerdAnalysis}
                expanded={expandedSection === 'gerdComplications'}
                onToggle={() => toggleSection('gerdComplications')}
            />
            <GenericRatingCard
                analysis={ulcerativeColitisAnalysis}
                expanded={expandedSection === 'ulcerativeColitis'}
                onToggle={() => toggleSection('ulcerativeColitis')}
                icon="🩸"
            />
            <GenericRatingCard
                analysis={pepticUlcerAnalysis}
                expanded={expandedSection === 'pepticUlcer'}
                onToggle={() => toggleSection('pepticUlcer')}
                icon="🔥"
            />
            <GenericRatingCard
                analysis={hemorrhoidAnalysis}
                expanded={expandedSection === 'hemorrhoids'}
                onToggle={() => toggleSection('hemorrhoids')}
                icon="🩹"
            />
            <GenericRatingCard
                analysis={diverticulitisAnalysis}
                expanded={expandedSection === 'diverticulitis'}
                onToggle={() => toggleSection('diverticulitis')}
                icon="🫃"
            />
            <CirrhosisRatingCard
                analysis={cirrhosisAnalysis}
                expanded={expandedSection === 'cirrhosis'}
                onToggle={() => toggleSection('cirrhosis')}
            />
            <GastritisRatingCard
                analysis={gastritisAnalysis}
                expanded={expandedSection === 'gastritis'}
                onToggle={() => toggleSection('gastritis')}
            />
            <PancreatitisRatingCard
                analysis={pancreatitisAnalysis}
                expanded={expandedSection === 'pancreatitis'}
                onToggle={() => toggleSection('pancreatitis')}
            />
            <BiliaryTractRatingCard
                analysis={biliaryTractAnalysis}
                expanded={expandedSection === 'biliary-tract'}
                onToggle={() => toggleSection('biliary-tract')}
            />
            <HerniaRatingCard
                analysis={herniaAnalysis}
                expanded={expandedSection === 'hernia'}
                onToggle={() => toggleSection('hernia')}
            />
            <PeritonealAdhesionsRatingCard
                analysis={peritonealAdhesionsAnalysis}
                expanded={expandedSection === 'peritoneal-adhesions'}
                onToggle={() => toggleSection('peritoneal-adhesions')}
            />
            <EsophagealRatingCard
                analysis={esophagealAnalysis}
                expanded={expandedSection === 'esophageal'}
                onToggle={() => toggleSection('esophageal')}
            />
            <PostgastrectomyRatingCard
                analysis={postgastrectomyAnalysis}
                expanded={expandedSection === 'postgastrectomy'}
                onToggle={() => toggleSection('postgastrectomy')}
            />
            <IntestinalFistulaRatingCard
                analysis={intestinalFistulaAnalysis}
                expanded={expandedSection === 'intestinal-fistula'}
                onToggle={() => toggleSection('intestinal-fistula')}
            />
          </ConditionGroup>

          {/* ========== GENITOURINARY ========== */}
          <ConditionGroup
              title="Genitourinary"
              icon="🫘"
              conditionCount={bodySystemCounts.genitourinary}
              accentColor="orange"
              groupId="genitourinary"
              isExpanded={expandedGroup === 'genitourinary'}
              onToggle={toggleGroup}
          >
            <KidneyStonesRatingCard
                analysis={kidneyStonesAnalysis}
                expanded={expandedSection === 'kidney-stones'}
                onToggle={() => toggleSection('kidney-stones')}
            />
            <ChronicRenalDiseaseRatingCard
                analysis={chronicRenalDiseaseAnalysis}
                expanded={expandedSection === 'chronic-renal-disease'}
                onToggle={() => toggleSection('chronic-renal-disease')}
            />
            <ChronicCystitisRatingCard
                analysis={voidingDysfunctionAnalysis}
                expanded={expandedSection === 'chronic-cystitis'}
                onToggle={() => toggleSection('chronic-cystitis')}
            />
            <NeurogenicBladderRatingCard
                analysis={voidingDysfunctionAnalysis}
                expanded={expandedSection === 'neurogenic-bladder'}
                onToggle={() => toggleSection('neurogenic-bladder')}
            />
            <ProstateConditionsRatingCard
                analysis={voidingDysfunctionAnalysis}
                expanded={expandedSection === 'prostate-conditions'}
                onToggle={() => toggleSection('prostate-conditions')}
            />
            <UrethralStrictureRatingCard
                analysis={voidingDysfunctionAnalysis}
                expanded={expandedSection === 'urethral-stricture'}
                onToggle={() => toggleSection('urethral-stricture')}
            />
            <SphincterImpairmentRatingCard
                analysis={sphincterImpairmentAnalysis}
                expanded={expandedSection === 'sphincter-impairment'}
                onToggle={() => toggleSection('sphincter-impairment')}
            />
            <ErectileDysfunctionRatingCard
                analysis={erectileDysfunctionAnalysis}
                expanded={expandedSection === 'erectile-dysfunction'}
                onToggle={() => toggleSection('erectile-dysfunction')}
            />
            <EndometriosisRatingCard
                analysis={endometriosisAnalysis}
                expanded={expandedSection === 'endometriosis'}
                onToggle={() => toggleSection('endometriosis')}
            />
            <FemaleReproductiveOrgansRatingCard
                analysis={femaleReproductiveOrgansAnalysis}
                expanded={expandedSection === 'female-reproductive-organs'}
                onToggle={() => toggleSection('female-reproductive-organs')}
            />
            <PelvicProlapseRatingCard
                analysis={pelvicProlapseAnalysis}
                expanded={expandedSection === 'pelvic-prolapse'}
                onToggle={() => toggleSection('pelvic-prolapse')}
            />
            <FemaleArousalDisorderRatingCard
                analysis={femaleArousalDisorderAnalysis}
                expanded={expandedSection === 'female-arousal-disorder'}
                onToggle={() => toggleSection('female-arousal-disorder')}
            />
          </ConditionGroup>


          {/* ========== HEMIC & LYMPHATIC ========== */}
          <ConditionGroup
              title="Hemic & Lymphatic"
              icon="🩸"
              conditionCount={bodySystemCounts.hemicLymphatic}
              accentColor="rose"
              groupId="hemicLymphatic"
              isExpanded={expandedGroup === 'hemicLymphatic'}
              onToggle={toggleGroup}
          >
            <IronDeficiencyAnemiaRatingCard
                analysis={ironDeficiencyAnemiaAnalysis}
                expanded={expandedSection === 'iron-deficiency-anemia'}
                onToggle={() => toggleSection('iron-deficiency-anemia')}
            />
            <FolateDeficiencyAnemiaRatingCard
                analysis={folateDeficiencyAnemiaAnalysis}
                expanded={expandedSection === 'folate-deficiency-anemia'}
                onToggle={() => toggleSection('folate-deficiency-anemia')}
            />
            <PerniciousAnemiaRatingCard
                analysis={perniciousAnemiaAnalysis}
                expanded={expandedSection === 'pernicious-anemia'}
                onToggle={() => toggleSection('pernicious-anemia')}
            />
            <HemolyticAnemiaRatingCard
                analysis={hemolyticAnemiaAnalysis}
                expanded={expandedSection === 'hemolytic-anemia'}
                onToggle={() => toggleSection('hemolytic-anemia')}
            />
            <SickleCellAnemiaRatingCard
                analysis={sickleCellAnemiaAnalysis}
                expanded={expandedSection === 'sickle-cell-anemia'}
                onToggle={() => toggleSection('sickle-cell-anemia')}
            />
            <AplasticAnemiaRatingCard
                analysis={aplasticAnemiaAnalysis}
                expanded={expandedSection === 'aplastic-anemia'}
                onToggle={() => toggleSection('aplastic-anemia')}
            />
            <PolycythemiaVeraRatingCard
                analysis={polycythemiaVeraAnalysis}
                expanded={expandedSection === 'polycythemia-vera'}
                onToggle={() => toggleSection('polycythemia-vera')}
            />
            <ImmuneThrombocytopeniaRatingCard
                analysis={immuneThrombocytopeniaAnalysis}
                expanded={expandedSection === 'immune-thrombocytopenia'}
                onToggle={() => toggleSection('immune-thrombocytopenia')}
            />
            <LeukemiaRatingCard
                analysis={leukemiaAnalysis}
                expanded={expandedSection === 'leukemia'}
                onToggle={() => toggleSection('leukemia')}
            />
            <HodgkinsLymphomaRatingCard
                analysis={hodgkinsLymphomaAnalysis}
                expanded={expandedSection === 'hodgkins-lymphoma'}
                onToggle={() => toggleSection('hodgkins-lymphoma')}
            />
            <MultipleMyelomaRatingCard
                analysis={multipleMyelomaAnalysis}
                expanded={expandedSection === 'multiple-myeloma'}
                onToggle={() => toggleSection('multiple-myeloma')}
            />
            <NonHodgkinsLymphomaRatingCard
                analysis={nonHodgkinsLymphomaAnalysis}
                expanded={expandedSection === 'non-hodgkins-lymphoma'}
                onToggle={() => toggleSection('non-hodgkins-lymphoma')}
            />
            <EssentialThrombocythemiaRatingCard
                analysis={myeloproliferative7718Analysis}
                expanded={expandedSection === 'essential-thrombocythemia'}
                onToggle={() => toggleSection('essential-thrombocythemia')}
            />
            <ChronicMyelogenousLeukemiaRatingCard
                analysis={chronicMyelogenousLeukemiaAnalysis}
                expanded={expandedSection === 'chronic-myelogenous-leukemia'}
                onToggle={() => toggleSection('chronic-myelogenous-leukemia')}
            />
            <SolitaryPlasmacytomaRatingCard
                analysis={solitaryPlasmacytomaAnalysis}
                expanded={expandedSection === 'solitary-plasmacytoma'}
                onToggle={() => toggleSection('solitary-plasmacytoma')}
            />
            <MyelodysplasticSyndromesRatingCard
                analysis={myelodysplasticSyndromesAnalysis}
                expanded={expandedSection === 'myelodysplastic-syndromes'}
                onToggle={() => toggleSection('myelodysplastic-syndromes')}
            />
          </ConditionGroup>

          {/* ========== SKIN ========== */}
          <ConditionGroup
              title="Skin"
              icon="🧴"
              conditionCount={bodySystemCounts.skin}
              accentColor="pink"
              groupId="skin"
              isExpanded={expandedGroup === 'skin'}
              onToggle={toggleGroup}
          >
            <EczemaRatingCard
                analysis={eczemaAnalysis}
                expanded={expandedSection === 'eczema'}
                onToggle={() => toggleSection('eczema')}
            />
            <PsoriasisRatingCard
                analysis={psoriasisAnalysis}
                expanded={expandedSection === 'psoriasis'}
                onToggle={() => toggleSection('psoriasis')}
            />
            <ScarsRatingCard
                analysis={scarsAnalysis}
                expanded={expandedSection === 'scarsAnalysis'}
                onToggle={() => toggleSection('scarsAnalysis')}
            />
            <GenericRatingCard
                analysis={chronicUrticariaAnalysis}
                expanded={expandedSection === 'chronicUrticaria'}
                onToggle={() => toggleSection('chronicUrticaria')}
                icon="🔴"
            />
            <AcneChloracneRatingCard
                analysis={acneAnalysis}
                expanded={expandedSection === 'acne'}
                onToggle={() => toggleSection('acne')}
            />
            <AcneChloracneRatingCard
                analysis={chloracneAnalysis}
                expanded={expandedSection === 'chloracne'}
                onToggle={() => toggleSection('chloracne')}
            />
            <AlopeciaAreataRatingCard
                analysis={alopeciaAreataAnalysis}
                expanded={expandedSection === 'alopecia-areata'}
                onToggle={() => toggleSection('alopecia-areata')}
            />
            <HyperhidrosisRatingCard
                analysis={hyperhidrosisAnalysis}
                expanded={expandedSection === 'hyperhidrosis'}
                onToggle={() => toggleSection('hyperhidrosis')}
            />
            <GeneralSkinRatingCard
                analysis={discoidLupusAnalysis}
                expanded={expandedSection === 'discoid-lupus'}
                onToggle={() => toggleSection('discoid-lupus')}
            />
            <GeneralSkinRatingCard
                analysis={bullousDisordersAnalysis}
                expanded={expandedSection === 'bullous-disorders'}
                onToggle={() => toggleSection('bullous-disorders')}
            />
            <GeneralSkinRatingCard
                analysis={cutaneousVasculitisAnalysis}
                expanded={expandedSection === 'cutaneous-vasculitis'}
                onToggle={() => toggleSection('cutaneous-vasculitis')}
            />
            <GeneralSkinRatingCard
                analysis={dermatophytosisAnalysis}
                expanded={expandedSection === 'dermatophytosis'}
                onToggle={() => toggleSection('dermatophytosis')}
            />
            <GeneralSkinRatingCard
                analysis={skinInfectionsAnalysis}
                expanded={expandedSection === 'skin-infections'}
                onToggle={() => toggleSection('skin-infections')}
            />
          </ConditionGroup>

          {/* ========== ENDOCRINE ========== */}
          <ConditionGroup
              title="Endocrine"
              icon="🦋"
              conditionCount={bodySystemCounts.endocrine}
              accentColor="teal"
              groupId="endocrine"
              isExpanded={expandedGroup === 'endocrine'}
              onToggle={toggleGroup}
          >
            <DiabetesRatingCard
                analysis={diabetesAnalysis}
                expanded={expandedSection === 'diabetes'}
                onToggle={() => toggleSection('diabetes')}
            />
            <GenericRatingCard
                analysis={hypothyroidismAnalysis}
                expanded={expandedSection === 'hypothyroidism'}
                onToggle={() => toggleSection('hypothyroidism')}
                icon="🦋"
            />
            <HyperthyroidismRatingCard
                analysis={hyperthyroidismAnalysis}
                expanded={expandedSection === 'hyperthyroidism'}
                onToggle={() => toggleSection('hyperthyroidism')}
            />
            <ThyroiditisRatingCard
                analysis={thyroiditisAnalysis}
                expanded={expandedSection === 'thyroiditis'}
                onToggle={() => toggleSection('thyroiditis')}
            />
            <HyperparathyroidismRatingCard
                analysis={hyperparathyroidismAnalysis}
                expanded={expandedSection === 'hyperparathyroidism'}
                onToggle={() => toggleSection('hyperparathyroidism')}
            />
            <HypoparathyroidismRatingCard
                analysis={hypoparathyroidismAnalysis}
                expanded={expandedSection === 'hypoparathyroidism'}
                onToggle={() => toggleSection('hypoparathyroidism')}
            />
            <AddisonsDiseaseRatingCard
                analysis={addisonsDiseaseAnalysis}
                expanded={expandedSection === 'addisons-disease'}
                onToggle={() => toggleSection('addisons-disease')}
            />
            <CushingsSyndromeRatingCard
                analysis={cushingsSyndromeAnalysis}
                expanded={expandedSection === 'cushings-syndrome'}
                onToggle={() => toggleSection('cushings-syndrome')}
            />
            <DiabetesInsipidusRatingCard
                analysis={diabetesInsipidusAnalysis}
                expanded={expandedSection === 'diabetes-insipidus'}
                onToggle={() => toggleSection('diabetes-insipidus')}
            />
            <HyperaldosteronismRatingCard
                analysis={hyperaldosteronismAnalysis}
                expanded={expandedSection === 'hyperaldosteronism'}
                onToggle={() => toggleSection('hyperaldosteronism')}
            />
          </ConditionGroup>


          {/* ========== NEUROLOGICAL ========== */}
          <ConditionGroup
              title="Neurological"
              icon="⚡"
              conditionCount={bodySystemCounts.neurological}
              accentColor="indigo"
              groupId="neurological"
              isExpanded={expandedGroup === 'neurological'}
              onToggle={toggleGroup}
          >
            <MigraineRatingCard
                analysis={migraineAnalysis}
                expanded={expandedSection === 'migraine'}
                onToggle={() => toggleSection('migraine')}
            />
            <GenericRatingCard
                analysis={tbiAnalysis}
                expanded={expandedSection === 'tbi'}
                onToggle={() => toggleSection('tbi')}
                icon="🧠"
            />
            <TBIResidualsRatingCard
                analysis={tbiResidualsAnalysis}
                expanded={expandedSection === 'tbiResiduals'}
                onToggle={() => toggleSection('tbiResiduals')}
            />
            <SeizureRatingCard
                analysis={epilepsyMajorAnalysis}
                expanded={expandedSection === 'epilepsyMajor'}
                onToggle={() => toggleSection('epilepsyMajor')}
            />
            <SeizureRatingCard
                analysis={epilepsyMinorAnalysis}
                expanded={expandedSection === 'epilepsyMinor'}
                onToggle={() => toggleSection('epilepsyMinor')}
            />
            <EpilepsyExpansionRatingCard
                analysis={jacksonianEpilepsyAnalysis}
                expanded={expandedSection === 'epilepsyJacksonian'}
                onToggle={() => toggleSection('epilepsyJacksonian')}
                epilepsyType="jacksonian"
            />
            <EpilepsyExpansionRatingCard
                analysis={diencephalicEpilepsyAnalysis}
                expanded={expandedSection === 'epilepsyDiencephalic'}
                onToggle={() => toggleSection('epilepsyDiencephalic')}
                epilepsyType="diencephalic"
            />
            <EpilepsyExpansionRatingCard
                analysis={psychomotorEpilepsyAnalysis}
                expanded={expandedSection === 'epilepsyPsychomotor'}
                onToggle={() => toggleSection('epilepsyPsychomotor')}
                epilepsyType="psychomotor"
            />
            <RadiculopathyRatingCard
                analysis={radiculopathyAnalysis}
                expanded={expandedSection === 'radiculopathy'}
                onToggle={() => toggleSection('radiculopathy')}
            />
            <PeripheralNeuropathyRatingCard
                analysis={peripheralNeuropathyAnalysis}
                expanded={expandedSection === 'peripheral-neuropathy'}
                onToggle={() => toggleSection('peripheral-neuropathy')}
            />
            <MSRatingCard
                analysis={multipleSclerosisAnalysis}
                expanded={expandedSection === 'multiple-sclerosis'}
                onToggle={() => toggleSection('multiple-sclerosis')}
            />
            <ParkinsonsRatingCard
                analysis={parkinsonsAnalysis}
                expanded={expandedSection === 'parkinsons'}
                onToggle={() => toggleSection('parkinsons')}
            />
            <MyastheniaGravisRatingCard
                analysis={myastheniaGravisAnalysis}
                expanded={expandedSection === 'myasthenia-gravis'}
                onToggle={() => toggleSection('myasthenia-gravis')}
            />
            <NarcolepsyRatingCard
                analysis={narcolepsyAnalysis}
                expanded={expandedSection === 'narcolepsy'}
                onToggle={() => toggleSection('narcolepsy')}
            />
            <ALSRatingCard
                analysis={alsAnalysis}
                expanded={expandedSection === 'als'}
                onToggle={() => toggleSection('als')}
            />
            <SyringomyeliaRatingCard
                analysis={syringomyeliaAnalysis}
                expanded={expandedSection === 'syringomyelia'}
                onToggle={() => toggleSection('syringomyelia')}
            />
            <MyelitisRatingCard
                analysis={myelitisAnalysis}
                expanded={expandedSection === 'myelitis'}
                onToggle={() => toggleSection('myelitis')}
            />
            {/* Peripheral Nerves - Upper Extremity */}
            <PeripheralNerveRatingCard
                nerveType="upper-radicular"
                analysis={upperRadicularAnalysis}
                expanded={expandedSection === 'upper-radicular'}
                onToggle={() => toggleSection('upper-radicular')}
            />
            <PeripheralNerveRatingCard
                nerveType="middle-radicular"
                analysis={middleRadicularAnalysis}
                expanded={expandedSection === 'middle-radicular'}
                onToggle={() => toggleSection('middle-radicular')}
            />
            <PeripheralNerveRatingCard
                nerveType="lower-radicular"
                analysis={lowerRadicularAnalysis}
                expanded={expandedSection === 'lower-radicular'}
                onToggle={() => toggleSection('lower-radicular')}
            />
            <PeripheralNerveRatingCard
                nerveType="all-radicular"
                analysis={allRadicularAnalysis}
                expanded={expandedSection === 'all-radicular'}
                onToggle={() => toggleSection('all-radicular')}
            />
            <PeripheralNerveRatingCard
                nerveType="radial"
                analysis={radialNerveAnalysis}
                expanded={expandedSection === 'radial-nerve'}
                onToggle={() => toggleSection('radial-nerve')}
            />
            <PeripheralNerveRatingCard
                nerveType="median"
                analysis={medianNerveAnalysis}
                expanded={expandedSection === 'median-nerve'}
                onToggle={() => toggleSection('median-nerve')}
            />
            <PeripheralNerveRatingCard
                nerveType="ulnar"
                analysis={ulnarNerveAnalysis}
                expanded={expandedSection === 'ulnar-nerve'}
                onToggle={() => toggleSection('ulnar-nerve')}
            />
            <PeripheralNerveRatingCard
                nerveType="musculocutaneous"
                analysis={musculocutaneousNerveAnalysis}
                expanded={expandedSection === 'musculocutaneous-nerve'}
                onToggle={() => toggleSection('musculocutaneous-nerve')}
            />
            <PeripheralNerveRatingCard
                nerveType="circumflex"
                analysis={circumflexNerveAnalysis}
                expanded={expandedSection === 'circumflex-nerve'}
                onToggle={() => toggleSection('circumflex-nerve')}
            />
            <PeripheralNerveRatingCard
                nerveType="long-thoracic"
                analysis={longThoracicNerveAnalysis}
                expanded={expandedSection === 'long-thoracic-nerve'}
                onToggle={() => toggleSection('long-thoracic-nerve')}
            />
            {/* Peripheral Nerves - Lower Extremity */}
            <PeripheralNerveRatingCard
                nerveType="sciatic"
                analysis={sciaticNerveAnalysis}
                expanded={expandedSection === 'sciatic-nerve'}
                onToggle={() => toggleSection('sciatic-nerve')}
            />
            <PeripheralNerveRatingCard
                nerveType="common-peroneal"
                analysis={commonPeronealNerveAnalysis}
                expanded={expandedSection === 'common-peroneal-nerve'}
                onToggle={() => toggleSection('common-peroneal-nerve')}
            />
            <PeripheralNerveRatingCard
                nerveType="superficial-peroneal"
                analysis={superficialPeronealNerveAnalysis}
                expanded={expandedSection === 'superficial-peroneal-nerve'}
                onToggle={() => toggleSection('superficial-peroneal-nerve')}
            />
            <PeripheralNerveRatingCard
                nerveType="deep-peroneal"
                analysis={deepPeronealNerveAnalysis}
                expanded={expandedSection === 'deep-peroneal-nerve'}
                onToggle={() => toggleSection('deep-peroneal-nerve')}
            />
            <PeripheralNerveRatingCard
                nerveType="tibial"
                analysis={tibialNerveAnalysis}
                expanded={expandedSection === 'tibial-nerve'}
                onToggle={() => toggleSection('tibial-nerve')}
            />
            <PeripheralNerveRatingCard
                nerveType="posterior-tibial"
                analysis={posteriorTibialNerveAnalysis}
                expanded={expandedSection === 'posterior-tibial-nerve'}
                onToggle={() => toggleSection('posterior-tibial-nerve')}
            />
            <PeripheralNerveRatingCard
                nerveType="femoral"
                analysis={femoralNerveAnalysis}
                expanded={expandedSection === 'femoral-nerve'}
                onToggle={() => toggleSection('femoral-nerve')}
            />
            <PeripheralNerveRatingCard
                nerveType="saphenous"
                analysis={saphenousNerveAnalysis}
                expanded={expandedSection === 'saphenous-nerve'}
                onToggle={() => toggleSection('saphenous-nerve')}
            />
            <PeripheralNerveRatingCard
                nerveType="obturator"
                analysis={obturatorNerveAnalysis}
                expanded={expandedSection === 'obturator-nerve'}
                onToggle={() => toggleSection('obturator-nerve')}
            />
            <PeripheralNerveRatingCard
                nerveType="lateral-femoral-cutaneous"
                analysis={lateralFemoralCutaneousNerveAnalysis}
                expanded={expandedSection === 'lateral-femoral-cutaneous-nerve'}
                onToggle={() => toggleSection('lateral-femoral-cutaneous-nerve')}
            />
            <PeripheralNerveRatingCard
                nerveType="ilioinguinal"
                analysis={ilioinguinalNerveAnalysis}
                expanded={expandedSection === 'ilioinguinal-nerve'}
                onToggle={() => toggleSection('ilioinguinal-nerve')}
            />
          </ConditionGroup>

          {/* ========== MENTAL HEALTH ========== */}
          <ConditionGroup
              title="Mental Health"
              icon="🧠"
              conditionCount={bodySystemCounts.mentalHealth}
              accentColor="purple"
              groupId="mentalHealth"
              isExpanded={expandedGroup === 'mentalHealth'}
              onToggle={toggleGroup}
          >
            <PTSDRatingCard
                analysis={ptsdAnalysis}
                expanded={expandedSection === 'ptsd'}
                onToggle={() => toggleSection('ptsd')}
            />
            <MentalHealthRatingCard
                analysis={majorDepressionAnalysis}
                expanded={expandedSection === 'major-depression'}
                onToggle={() => toggleSection('major-depression')}
                icon="😔"
                getAllRatings={getAllMajorDepressionRatings}
                getDefinition={getMajorDepressionDefinition}
            />
            <MentalHealthRatingCard
                analysis={generalizedAnxietyAnalysis}
                expanded={expandedSection === 'generalized-anxiety'}
                onToggle={() => toggleSection('generalized-anxiety')}
                icon="😰"
                getAllRatings={getAllGeneralizedAnxietyRatings}
                getDefinition={getGeneralizedAnxietyDefinition}
            />
            <MentalHealthRatingCard
                analysis={panicDisorderAnalysis}
                expanded={expandedSection === 'panic-disorder'}
                onToggle={() => toggleSection('panic-disorder')}
                icon="😱"
                getAllRatings={getAllPanicDisorderRatings}
                getDefinition={getPanicDisorderDefinition}
            />
            <MentalHealthRatingCard
                analysis={bipolarAnalysis}
                expanded={expandedSection === 'bipolar'}
                onToggle={() => toggleSection('bipolar')}
                icon="🎭"
                getAllRatings={getAllBipolarRatings}
                getDefinition={getBipolarDefinition}
            />
            <MentalHealthRatingCard
                analysis={socialAnxietyAnalysis}
                expanded={expandedSection === 'social-anxiety'}
                onToggle={() => toggleSection('social-anxiety')}
                icon="👥"
                getAllRatings={getAllSocialAnxietyRatings}
                getDefinition={getSocialAnxietyDefinition}
            />
            <MentalHealthRatingCard
                analysis={ocdAnalysis}
                expanded={expandedSection === 'ocd'}
                onToggle={() => toggleSection('ocd')}
                icon="🔄"
                getAllRatings={getAllOCDRatings}
                getDefinition={getOCDDefinition}
            />
            <MentalHealthRatingCard
                analysis={persistentDepressiveAnalysis}
                expanded={expandedSection === 'persistent-depressive'}
                onToggle={() => toggleSection('persistent-depressive')}
                icon="😶"
                getAllRatings={getAllPersistentDepressiveRatings}
                getDefinition={getPersistentDepressiveDefinition}
            />
            <MentalHealthRatingCard
                analysis={adjustmentDisorderAnalysis}
                expanded={expandedSection === 'adjustment-disorder'}
                onToggle={() => toggleSection('adjustment-disorder')}
                icon="⚖️"
                getAllRatings={getAllAdjustmentDisorderRatings}
                getDefinition={getAdjustmentDisorderDefinition}
            />
            <MentalHealthRatingCard
                analysis={unspecifiedAnxietyAnalysis}
                expanded={expandedSection === 'unspecified-anxiety'}
                onToggle={() => toggleSection('unspecified-anxiety')}
                icon="😟"
                getAllRatings={getAllUnspecifiedAnxietyRatings}
                getDefinition={getUnspecifiedAnxietyDefinition}
            />
            <MentalHealthRatingCard
                analysis={unspecifiedDepressiveAnalysis}
                expanded={expandedSection === 'unspecified-depressive'}
                onToggle={() => toggleSection('unspecified-depressive')}
                icon="😞"
                getAllRatings={getAllUnspecifiedDepressiveRatings}
                getDefinition={getUnspecifiedDepressiveDefinition}
            />
            <MentalHealthRatingCard
                analysis={somaticSymptomDisorderAnalysis}
                expanded={expandedSection === 'somatic-symptom-disorder'}
                onToggle={() => toggleSection('somatic-symptom-disorder')}
                icon="🏥"
                getAllRatings={getAllSomaticSymptomDisorderRatings}
                getDefinition={getSomaticSymptomDisorderDefinition}
            />
            <MentalHealthRatingCard
                analysis={otherSpecifiedSomaticAnalysis}
                expanded={expandedSection === 'other-specified-somatic'}
                onToggle={() => toggleSection('other-specified-somatic')}
                icon="🏥"
                getAllRatings={getAllOtherSpecifiedSomaticRatings}
                getDefinition={getOtherSpecifiedSomaticDefinition}
            />
            <MentalHealthRatingCard
                analysis={unspecifiedSomaticAnalysis}
                expanded={expandedSection === 'unspecified-somatic'}
                onToggle={() => toggleSection('unspecified-somatic')}
                icon="🏥"
                getAllRatings={getAllUnspecifiedSomaticRatings}
                getDefinition={getUnspecifiedSomaticDefinition}
            />
            <MentalHealthRatingCard
                analysis={illnessAnxietyAnalysis}
                expanded={expandedSection === 'illness-anxiety'}
                onToggle={() => toggleSection('illness-anxiety')}
                icon="😰"
                getAllRatings={getAllIllnessAnxietyRatings}
                getDefinition={getIllnessAnxietyDefinition}
            />
            <MentalHealthRatingCard
                analysis={otherSpecifiedAnxietyAnalysis}
                expanded={expandedSection === 'other-specified-anxiety'}
                onToggle={() => toggleSection('other-specified-anxiety')}
                icon="😟"
                getAllRatings={getAllOtherSpecifiedAnxietyRatings}
                getDefinition={getOtherSpecifiedAnxietyDefinition}
            />
            <MentalHealthRatingCard
                analysis={depersonalizationAnalysis}
                expanded={expandedSection === 'depersonalization-derealization'}
                onToggle={() => toggleSection('depersonalization-derealization')}
                icon="👤"
                getAllRatings={getAllDepersonalizationRatings}
                getDefinition={getDepersonalizationDefinition}
            />
            <MentalHealthRatingCard
                analysis={cyclothymicAnalysis}
                expanded={expandedSection === 'cyclothymic'}
                onToggle={() => toggleSection('cyclothymic')}
                icon="🌓"
                getAllRatings={getAllCyclothymicRatings}
                getDefinition={getCyclothymicDefinition}
            />
            <MentalHealthRatingCard
                analysis={anorexiaNervosaAnalysis}
                expanded={expandedSection === 'anorexia-nervosa'}
                onToggle={() => toggleSection('anorexia-nervosa')}
                icon="🍽️"
                getAllRatings={getAllAnorexiaNervosaRatings}
                getDefinition={getAnorexiaNervosaDefinition}
            />
            <MentalHealthRatingCard
                analysis={bulimiaNervosaAnalysis}
                expanded={expandedSection === 'bulimia-nervosa'}
                onToggle={() => toggleSection('bulimia-nervosa')}
                icon="🍽️"
                getAllBulimiaNervosaRatings={getAllBulimiaNervosaRatings}
                getDefinition={getBulimiaNervosaDefinition}
            />
            <Phase8BMentalHealthRatingCard
                analysis={schizophreniaAnalysis}
                expanded={expandedSection === 'schizophrenia'}
                onToggle={() => toggleSection('schizophrenia')}
            />
            <Phase8BMentalHealthRatingCard
                analysis={schizoaffectiveDisorderAnalysis}
                expanded={expandedSection === 'schizoaffective-disorder'}
                onToggle={() => toggleSection('schizoaffective-disorder')}
            />
            <Phase8BMentalHealthRatingCard
                analysis={delusionalDisorderAnalysis}
                expanded={expandedSection === 'delusional-disorder'}
                onToggle={() => toggleSection('delusional-disorder')}
            />
            <Phase8BMentalHealthRatingCard
                analysis={psychoticDisorderNOSAnalysis}
                expanded={expandedSection === 'psychotic-disorder-nos'}
                onToggle={() => toggleSection('psychotic-disorder-nos')}
            />
            <Phase8BMentalHealthRatingCard
                analysis={briefPsychoticDisorderAnalysis}
                expanded={expandedSection === 'brief-psychotic-disorder'}
                onToggle={() => toggleSection('brief-psychotic-disorder')}
            />
            <Phase8BMentalHealthRatingCard
                analysis={bingeEatingDisorderAnalysis}
                expanded={expandedSection === 'binge-eating-disorder'}
                onToggle={() => toggleSection('binge-eating-disorder')}
            />
            <Phase8BMentalHealthRatingCard
                analysis={dissociativeIdentityDisorderAnalysis}
                expanded={expandedSection === 'dissociative-identity-disorder'}
                onToggle={() => toggleSection('dissociative-identity-disorder')}
            />
            <Phase8BMentalHealthRatingCard
                analysis={dissociativeAmnesiaAnalysis}
                expanded={expandedSection === 'dissociative-amnesia'}
                onToggle={() => toggleSection('dissociative-amnesia')}
            />
            <Phase8BMentalHealthRatingCard
                analysis={acuteStressDisorderAnalysis}
                expanded={expandedSection === 'acute-stress-disorder'}
                onToggle={() => toggleSection('acute-stress-disorder')}
            />
            <Phase8BMentalHealthRatingCard
                analysis={antisocialPersonalityDisorderAnalysis}
                expanded={expandedSection === 'antisocial-personality-disorder'}
                onToggle={() => toggleSection('antisocial-personality-disorder')}
            />
            <Phase8BMentalHealthRatingCard
                analysis={borderlinePersonalityDisorderAnalysis}
                expanded={expandedSection === 'borderline-personality-disorder'}
                onToggle={() => toggleSection('borderline-personality-disorder')}
            />
            <Phase8BMentalHealthRatingCard
                analysis={narcissisticPersonalityDisorderAnalysis}
                expanded={expandedSection === 'narcissistic-personality-disorder'}
                onToggle={() => toggleSection('narcissistic-personality-disorder')}
            />
            <Phase8BMentalHealthRatingCard
                analysis={avoidantPersonalityDisorderAnalysis}
                expanded={expandedSection === 'avoidant-personality-disorder'}
                onToggle={() => toggleSection('avoidant-personality-disorder')}
            />
          </ConditionGroup>

          {/* ========== DENTAL & ORAL ========== */}
          <ConditionGroup
              title="Dental & Oral"
              icon="🦷"
              conditionCount={bodySystemCounts.dental}
              accentColor="yellow"
              groupId="dental"
              isExpanded={expandedGroup === 'dental'}
              onToggle={toggleGroup}
          >
            <ToothLossRatingCard
                analysis={toothLossAnalysis}
                expanded={expandedSection === 'tooth-loss'}
                onToggle={() => toggleSection('tooth-loss')}
            />
            <MandibleNonunionRatingCard
                analysis={mandibleNonunionAnalysis}
                expanded={expandedSection === 'mandible-nonunion'}
                onToggle={() => toggleSection('mandible-nonunion')}
            />
            <MaxillaMalunionRatingCard
                analysis={mandibleNonunionAnalysis}
                expanded={expandedSection === 'maxilla-malunion'}
                onToggle={() => toggleSection('maxilla-malunion')}
            />
            <MalignantOralNeoplasmRatingCard
                analysis={malignantOralNeoplasmAnalysis}
                expanded={expandedSection === 'malignant-oral-neoplasm'}
                onToggle={() => toggleSection('malignant-oral-neoplasm')}
            />
            <BenignOralNeoplasmRatingCard
                analysis={benignOralNeoplasmAnalysis}
                expanded={expandedSection === 'benign-oral-neoplasm'}
                onToggle={() => toggleSection('benign-oral-neoplasm')}
            />
          </ConditionGroup>

          {/* ========== OTHER CONDITIONS ========== */}
          <ConditionGroup
              title="Other Conditions"
              icon="📋"
              conditionCount={bodySystemCounts.other}
              accentColor="blue"
              groupId="other"
              isExpanded={expandedGroup === 'other'}
              onToggle={toggleGroup}
          >
            <ChronicFatigueRatingCard
                analysis={chronicFatigueAnalysis}
                expanded={expandedSection === 'chronic-fatigue'}
                onToggle={() => toggleSection('chronic-fatigue')}
            />
            <InsomniaRatingCard
                analysis={insomniaAnalysis}
                expanded={expandedSection === 'insomnia'}
                onToggle={() => toggleSection('insomnia')}
            />
          </ConditionGroup>

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
 * Stat Box Component
 * Memoized to prevent unnecessary re-renders in rating cards
 */
const StatBox = memo(({ label, value, subtext, highlight = false, muted = false }) => (
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
));
StatBox.displayName = 'StatBox';

/**
 * Rating Row Component
 * Memoized to prevent unnecessary re-renders when displaying rating criteria
 */
const RatingRow = memo(({ rating, isSupported }) => {
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
});
RatingRow.displayName = 'RatingRow';

/**
 * Definition Box Component
 * Memoized to prevent unnecessary re-renders when displaying definitions
 */
const DefinitionBox = memo(({ definition }) => {
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
});
DefinitionBox.displayName = 'DefinitionBox';

export default RatingEvidence;