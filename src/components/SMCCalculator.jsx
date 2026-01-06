import React, { useState, useEffect, useMemo } from 'react';
import { ChevronDown, ChevronUp, DollarSign, AlertTriangle, CheckCircle, Info, Calculator } from 'lucide-react';
import { useProfile } from '../hooks/useProfile';
import { getServiceConnectedConditions } from '../utils/profiles';
import { getSymptomLogs } from '../utils/storage';
import {
  SMC_RATES_2026,
  SMC_K_CRITERIA,
  SMC_S_CRITERIA,
  calculateSMCKEligibility,
  calculateSMCSEligibility,
  getCompleteSMCAnalysis
} from '../utils/smcCriteria';

/**
 * SMC Calculator Component
 *
 * Analyzes service-connected conditions and ADL logs to determine
 * potential SMC eligibility across all levels (K, L, S, R, etc.)
 *
 * Based on:
 * - 38 CFR § 3.350 - Special monthly compensation ratings
 * - 38 CFR § 3.352(a) - Criteria for Aid & Attendance
 * - 38 U.S.C. § 1114 - Rates of wartime disability compensation
 */
const SMCCalculator = ({
                         expanded = false,
                         onToggle,
                         // Pass analyses from RatingEvidence
                         penisAnalysis = null,
                         testisAnalysis = null,
                         edAnalysis = null,
                         aphoniaAnalysis = null,
                         hearingAnalysis = null,
                         // Phase B additions
                         femaleReproductiveAnalysis = null,
                         visionAnalysis = null,
                         amputationAnalysis = null,
                       }) => {
  const { profile } = useProfile();
  const [smcAnalysis, setSmcAnalysis] = useState(null);
  const [adlAnalysis, setAdlAnalysis] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [expandedSections, setExpandedSections] = useState({});

  // Only show for veteran profiles
  if (!profile || profile.type !== 'veteran') {
    return null;
  }

  useEffect(() => {
    const analyzeEligibility = () => {
      setIsLoading(true);

      try {
        // Get service-connected conditions
        const scConditions = getServiceConnectedConditions(profile.id) || [];

        // DEBUG: Log what we're getting
        console.log('🔍 SMC Calculator - Profile ID:', profile.id);
        console.log('🔍 SMC Calculator - SC Conditions loaded:', scConditions.length);
        console.log('🔍 SMC Calculator - Conditions data:', JSON.stringify(scConditions, null, 2));

        // Get all symptom logs for ADL analysis
        const allLogs = getSymptomLogs() || [];

        // Filter ADL logs
        const adlLogs = allLogs.filter(log => {
          const symptomId = log.symptomId || log.symptom;
          return symptomId && symptomId.startsWith('adl-');
        });

        // Perform SMC-K analysis - check both SC conditions AND passed analyses from rating cards
        const smcKFromSC = analyzeSMCKEligibility(scConditions);
        const smcKFromLogs = analyzeSMCKFromProps();

        // Merge results - use whichever found eligibility
        const smcKResults = smcKFromLogs.eligible ? smcKFromLogs : smcKFromSC;

        // DEBUG: Log SMC-K results
        console.log('🔍 SMC Calculator - SMC-K Results:', JSON.stringify(smcKResults, null, 2));

        // Perform SMC-S analysis (100% + 60% rule)
        const smcSResults = analyzeSMCSEligibility(scConditions);

        // Perform ADL/A&A analysis
        const adlResults = analyzeADLForSMC(adlLogs);

        // Combine all results
        setSmcAnalysis({
          smcK: smcKResults,
          smcS: smcSResults,
          scConditions,
          totalConditions: scConditions.length,
        });

        setAdlAnalysis(adlResults);

      } catch (error) {
        console.error('Error analyzing SMC eligibility:', error);
      }

      setIsLoading(false);
    };

    analyzeEligibility();
  }, [profile]);

  /**
   * Analyze service-connected conditions for SMC-K eligibility
   * Checks conditionName, conditionKey, and diagnosticCode for matches
   */
  const analyzeSMCKEligibility = (conditions) => {
    const eligibleConditions = [];
    let totalKAwards = 0;

    // Helper function to check if a condition matches SMC-K criteria
    const matchesCreativeOrgan = (condition) => {
      const name = (condition.conditionName || '').toLowerCase();
      const key = (condition.conditionKey || '').toLowerCase();
      const dc = (condition.diagnosticCode || '').toString();

      // Check diagnostic codes
      const creativeOrganCodes = ['7520', '7521', '7522', '7523', '7524', '7617', '7618', '7619', '7632'];
      if (creativeOrganCodes.some(code => dc.includes(code))) {
        return true;
      }

      // Check condition name or key for keywords
      const creativeOrganKeywords = [
        'penis', 'testis', 'testes', 'testicle', 'testicular',
        'erectile', 'impotence', 'ed ',
        'ovary', 'ovarian', 'ovar',
        'uterus', 'uterine', 'hysterectomy',
        'creative organ', 'loss of use of creative',
        'sexual arousal disorder'
      ];

      return creativeOrganKeywords.some(keyword =>
          name.includes(keyword) || key.includes(keyword)
      );
    };

    const matchesAphonia = (condition) => {
      const name = (condition.conditionName || '').toLowerCase();
      const key = (condition.conditionKey || '').toLowerCase();
      const dc = (condition.diagnosticCode || '').toString();

      return (dc.includes('6519') || name.includes('aphonia') || key.includes('aphonia'))
          && condition.currentRating === 100;
    };

    const matchesDeafness = (condition) => {
      const name = (condition.conditionName || '').toLowerCase();
      const dc = (condition.diagnosticCode || '').toString();

      return (dc.includes('6100') ||
              (name.includes('deaf') && name.includes('bilateral')))
          && condition.currentRating === 100;
    };

    const matchesBlindness = (condition) => {
      const name = (condition.conditionName || '').toLowerCase();
      const dc = (condition.diagnosticCode || '').toString();

      // DC 6061-6070 for various blindness ratings
      const blindnessCodes = ['6061', '6062', '6063', '6064', '6065', '6066', '6067', '6068', '6069', '6070'];
      return blindnessCodes.some(code => dc.includes(code)) ||
          (name.includes('blind') && name.includes('one eye'));
    };

    const matchesExtremityLoss = (condition) => {
      const name = (condition.conditionName || '').toLowerCase();
      const dc = (condition.diagnosticCode || '').toString();

      // Amputation diagnostic codes
      const amputationCodes = ['5120', '5121', '5122', '5123', '5124', '5125', '5126', '5127', '5128', '5129',
        '5130', '5131', '5132', '5133', '5134', '5135', '5136', '5137', '5138', '5139',
        '5160', '5161', '5162', '5163', '5164', '5165', '5166', '5167'];

      return amputationCodes.some(code => dc.includes(code)) ||
          name.includes('amputation') || name.includes('loss of use');
    };

    // Check for Creative Organ conditions
    const creativeConditions = conditions.filter(matchesCreativeOrgan);
    if (creativeConditions.length > 0) {
      const hasAutoGrant = creativeConditions.some(c => {
        const name = (c.conditionName || '').toLowerCase();
        const key = (c.conditionKey || '').toLowerCase();
        // Penis and testis conditions are auto-grant, ED requires nexus
        return name.includes('penis') || name.includes('testis') || name.includes('testes') ||
            name.includes('testicle') || key.includes('penis') || key.includes('testis') ||
            name.includes('ovary') || name.includes('uterus') || name.includes('hysterectomy');
      });

      eligibleConditions.push({
        category: 'CREATIVE_ORGAN',
        categoryName: 'Loss of Creative Organ',
        conditions: creativeConditions,
        awards: 1, // Max 1 award for all creative organ losses
        autoGrant: hasAutoGrant,
      });
      totalKAwards += 1;
    }

    // Check for Aphonia at 100%
    const aphoniaConditions = conditions.filter(matchesAphonia);
    if (aphoniaConditions.length > 0) {
      eligibleConditions.push({
        category: 'APHONIA',
        categoryName: 'Complete Organic Aphonia',
        conditions: aphoniaConditions,
        awards: 1,
        autoGrant: true,
      });
      totalKAwards += 1;
    }

    // Check for bilateral deafness (DC 6100) at 100%
    const deafnessConditions = conditions.filter(matchesDeafness);
    if (deafnessConditions.length > 0) {
      eligibleConditions.push({
        category: 'DEAFNESS',
        categoryName: 'Complete Bilateral Deafness',
        conditions: deafnessConditions,
        awards: 1,
        autoGrant: true,
      });
      totalKAwards += 1;
    }

    // Check for blindness in one eye
    const blindnessConditions = conditions.filter(matchesBlindness);
    if (blindnessConditions.length > 0) {
      eligibleConditions.push({
        category: 'BLINDNESS',
        categoryName: 'Blindness in One Eye',
        conditions: blindnessConditions,
        awards: 1, // Can get 2 if both eyes
        autoGrant: true,
      });
      totalKAwards += 1;
    }

    // Check for extremity loss
    const extremityConditions = conditions.filter(matchesExtremityLoss);
    extremityConditions.forEach(c => {
      const name = (c.conditionName || '').toLowerCase();
      let category = 'EXTREMITY';
      let categoryName = 'Loss of Extremity/Limb';

      if (name.includes('hand')) {
        categoryName = 'Loss of Use of Hand';
      } else if (name.includes('foot') || name.includes('feet')) {
        categoryName = 'Loss of Use of Foot';
      } else if (name.includes('leg')) {
        categoryName = 'Loss of Leg';
      } else if (name.includes('arm')) {
        categoryName = 'Loss of Arm';
      }

      // Only add if not already counted (to avoid duplicates)
      if (!eligibleConditions.some(ec => ec.category === category &&
          ec.conditions.some(existingC => existingC.id === c.id))) {
        eligibleConditions.push({
          category,
          categoryName,
          conditions: [c],
          awards: 1,
          autoGrant: true,
        });
        totalKAwards += 1;
      }
    });

    // Calculate total monthly amount (capped at 3 awards)
    const cappedAwards = Math.min(totalKAwards, 3);
    const monthlyAmount = cappedAwards * SMC_RATES_2026.K.rate;

    return {
      eligible: eligibleConditions.length > 0,
      eligibleConditions,
      totalAwards: totalKAwards,
      cappedAwards,
      monthlyAmount,
      rate: SMC_RATES_2026.K.rate,
      maxAwards: 3,
    };
  };

  /**
   * Analyze for SMC-S (Housebound) eligibility
   */
  const analyzeSMCSEligibility = (conditions) => {
    // Find condition at 100%
    const condition100 = conditions.find(c => c.currentRating === 100);

    if (!condition100) {
      return {
        eligible: false,
        reason: 'No single condition rated at 100%',
        pathway: null,
      };
    }

    // Calculate additional disabilities (excluding the 100% condition)
    const additionalConditions = conditions.filter(c =>
        c.id !== condition100.id && c.currentRating > 0
    );

    // Calculate combined rating of additional conditions
    let additionalCombined = 0;
    if (additionalConditions.length > 0) {
      // Sort by rating descending
      const sorted = [...additionalConditions].sort((a, b) => b.currentRating - a.currentRating);

      // VA math for combining ratings
      let efficiency = 100;
      sorted.forEach(c => {
        efficiency = efficiency - (efficiency * c.currentRating / 100);
      });
      additionalCombined = Math.round(100 - efficiency);
    }

    const meetsStatutory = additionalCombined >= 60;

    return {
      eligible: meetsStatutory,
      pathway: meetsStatutory ? 'statutory' : null,
      condition100: condition100,
      additionalConditions,
      additionalCombined,
      reason: meetsStatutory
          ? `100% for ${condition100.conditionName} + ${additionalCombined}% additional = SMC-S eligible`
          : `Need 60%+ additional disabilities (current: ${additionalCombined}%)`,
      monthlyAmount: meetsStatutory ? SMC_RATES_2026.S.veteran_alone : 0,
    };
  };

  /**
   * Analyze ADL logs for Aid & Attendance eligibility
   */
  const analyzeADLForSMC = (adlLogs) => {
    if (!adlLogs || adlLogs.length === 0) {
      return {
        hasData: false,
        factorsAffected: 0,
        potentialLevel: null,
        message: 'No ADL limitations logged. Track daily living difficulties to assess A&A eligibility.',
      };
    }

    // Count affected ADL factors
    const factors = {
      dressing: adlLogs.filter(l => l.symptomId?.includes('dress')).length > 0,
      hygiene: adlLogs.filter(l => l.symptomId?.includes('hygiene')).length > 0,
      feeding: adlLogs.filter(l => l.symptomId?.includes('feed')).length > 0,
      toileting: adlLogs.filter(l =>
          l.symptomId?.includes('toilet') || l.symptomId?.includes('bowel') ||
          l.symptomId?.includes('bladder') || l.symptomId?.includes('catheter')
      ).length > 0,
      mobility: adlLogs.filter(l =>
          l.symptomId?.includes('mobility') || l.symptomId?.includes('bed') ||
          l.symptomId?.includes('wheelchair') || l.symptomId?.includes('walk')
      ).length > 0,
      safety: adlLogs.filter(l => l.symptomId?.includes('safety')).length > 0,
      cognitive: adlLogs.filter(l => l.symptomId?.includes('cognitive')).length > 0,
    };

    const factorsAffected = Object.values(factors).filter(Boolean).length;

    // Check for severe indicators
    const hasBedridden = adlLogs.some(l => l.symptomId?.includes('bedridden'));
    const hasTotalDependence = adlLogs.some(l => l.symptomId?.includes('total-depend'));
    const hasNursingLevel = adlLogs.some(l => l.symptomId?.includes('nursing-level'));
    const hasHousebound = adlLogs.some(l => l.symptomId?.includes('housebound'));

    // Determine potential SMC level
    let potentialLevel = null;
    let potentialAmount = 0;

    if (hasNursingLevel || (hasTotalDependence && factors.safety)) {
      potentialLevel = 'R';
      potentialAmount = SMC_RATES_2026.R1.veteran_alone;
    } else if (factorsAffected >= 3 || hasBedridden || hasTotalDependence) {
      potentialLevel = 'L';
      potentialAmount = SMC_RATES_2026.L.veteran_alone;
    } else if (hasHousebound) {
      potentialLevel = 'S';
      potentialAmount = SMC_RATES_2026.S.veteran_alone;
    }

    return {
      hasData: true,
      totalLogs: adlLogs.length,
      factorsAffected,
      factors,
      hasBedridden,
      hasTotalDependence,
      hasNursingLevel,
      hasHousebound,
      potentialLevel,
      potentialAmount,
    };
  };

  /**
   * Analyze SMC-K eligibility from passed rating card analyses
   * This checks the actual logged symptoms via the rating card analysis props
   */
  const analyzeSMCKFromProps = () => {
    const eligibleConditions = [];
    let totalKAwards = 0;

    console.log('🔍 SMC-K checking passed props:', {
      penis: penisAnalysis?.smcEligible,
      testis: testisAnalysis?.smcEligible,
      ed: edAnalysis?.smcEligible,
      aphonia: aphoniaAnalysis?.smcEligible,
    });

    // Check Penis Conditions (from prop)
    if (penisAnalysis?.smcEligible && penisAnalysis?.smcData) {
      eligibleConditions.push({
        category: 'CREATIVE_ORGAN',
        categoryName: 'Loss of Creative Organ - Penis',
        conditions: [{ conditionName: penisAnalysis.condition || 'Penis Conditions' }],
        rating: penisAnalysis.supportedRating,
        diagnosticCode: 'DC 7520-7521',
        awards: 1,
        autoGrant: penisAnalysis.smcData.autoGrant,
      });
      totalKAwards += 1;
    }

    // Check Testis Conditions (from prop)
    if (testisAnalysis?.smcEligible && testisAnalysis?.smcData) {
      if (!eligibleConditions.some(c => c.category === 'CREATIVE_ORGAN')) {
        eligibleConditions.push({
          category: 'CREATIVE_ORGAN',
          categoryName: 'Loss of Creative Organ - Testis',
          conditions: [{ conditionName: testisAnalysis.condition || 'Testis Conditions' }],
          rating: testisAnalysis.supportedRating,
          diagnosticCode: 'DC 7523-7524',
          awards: 1,
          autoGrant: testisAnalysis.smcData.autoGrant,
        });
        totalKAwards += 1;
      }
    }

    // Check Erectile Dysfunction (from prop)
    if (edAnalysis?.smcEligible && edAnalysis?.smcData) {
      if (!eligibleConditions.some(c => c.category === 'CREATIVE_ORGAN')) {
        eligibleConditions.push({
          category: 'CREATIVE_ORGAN',
          categoryName: 'Loss of Creative Organ - ED',
          conditions: [{ conditionName: edAnalysis.condition || 'Erectile Dysfunction' }],
          rating: edAnalysis.supportedRating,
          diagnosticCode: 'DC 7522',
          awards: 1,
          autoGrant: false,
          requiresNexus: true,
        });
        totalKAwards += 1;
      }
    }

    // Check Aphonia (from prop)
    if (aphoniaAnalysis?.smcEligible && aphoniaAnalysis?.smcData) {
      eligibleConditions.push({
        category: 'APHONIA',
        categoryName: 'Complete Organic Aphonia',
        conditions: [{ conditionName: aphoniaAnalysis.condition || 'Aphonia' }],
        rating: aphoniaAnalysis.supportedRating,
        diagnosticCode: 'DC 6519',
        awards: 1,
        autoGrant: true,
      });
      totalKAwards += 1;
    }

    // Check Hearing Loss (from prop)
    if (hearingAnalysis?.supportedRating === 100) {
      eligibleConditions.push({
        category: 'DEAFNESS',
        categoryName: 'Complete Bilateral Deafness',
        conditions: [{ conditionName: 'Hearing Loss' }],
        rating: 100,
        diagnosticCode: 'DC 6100',
        awards: 1,
        autoGrant: true,
      });
      totalKAwards += 1;
    }

    // Check Female Reproductive (from prop) - Hysterectomy/Oophorectomy
    if (femaleReproductiveAnalysis?.smcEligible && femaleReproductiveAnalysis?.smcData) {
      if (!eligibleConditions.some(c => c.category === 'CREATIVE_ORGAN')) {
        eligibleConditions.push({
          category: 'CREATIVE_ORGAN',
          categoryName: 'Loss of Creative Organ - Female Reproductive',
          conditions: [{ conditionName: femaleReproductiveAnalysis.condition || 'Female Reproductive Organs' }],
          rating: femaleReproductiveAnalysis.supportedRating,
          diagnosticCode: 'DC 7617-7619',
          awards: 1,
          autoGrant: true,
        });
        totalKAwards += 1;
      }
    }

    // Check Vision/Blindness (from prop)
    if (visionAnalysis?.smcEligible && visionAnalysis?.smcData) {
      eligibleConditions.push({
        category: 'BLINDNESS_ONE_EYE',
        categoryName: 'Blindness in One Eye',
        conditions: [{ conditionName: visionAnalysis.condition || 'Eye/Vision Condition' }],
        rating: visionAnalysis.supportedRating,
        diagnosticCode: 'DC 6061-6070',
        awards: 1,
        autoGrant: true,
      });
      totalKAwards += 1;
    }

    // Check Amputation/Extremity Loss (from prop)
    if (amputationAnalysis?.smcEligible && amputationAnalysis?.smcData) {
      const awards = amputationAnalysis.smcData.awards || 1;
      eligibleConditions.push({
        category: 'EXTREMITY_LOSS',
        categoryName: `Loss of Extremity (${amputationAnalysis.smcData.qualifying?.join(', ') || 'Hand/Foot'})`,
        conditions: [{ conditionName: amputationAnalysis.condition || 'Amputation/Extremity Loss' }],
        rating: amputationAnalysis.supportedRating,
        diagnosticCode: 'DC 5120-5173',
        awards: awards,
        autoGrant: true,
      });
      totalKAwards += awards;
    }

    const cappedAwards = Math.min(totalKAwards, 3);
    const monthlyAmount = cappedAwards * SMC_RATES_2026.K.rate;

    return {
      eligible: eligibleConditions.length > 0,
      eligibleConditions,
      totalAwards: totalKAwards,
      cappedAwards,
      monthlyAmount,
      rate: SMC_RATES_2026.K.rate,
      maxAwards: 3,
    };
  };

  const toggleSection = (section) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  // Calculate total potential SMC
  const totalPotentialSMC = useMemo(() => {
    let total = 0;

    if (smcAnalysis?.smcK?.eligible) {
      total += smcAnalysis.smcK.monthlyAmount;
    }

    // SMC-S/L/R are replacements, not additive (except K)
    // Show the highest applicable level
    if (adlAnalysis?.potentialLevel === 'R') {
      total = Math.max(total, adlAnalysis.potentialAmount);
    } else if (adlAnalysis?.potentialLevel === 'L') {
      total = Math.max(total, adlAnalysis.potentialAmount);
    } else if (smcAnalysis?.smcS?.eligible || adlAnalysis?.potentialLevel === 'S') {
      total = Math.max(total, SMC_RATES_2026.S.veteran_alone);
    }

    // SMC-K is additive on top of S/L (but not O/R/T)
    if (smcAnalysis?.smcK?.eligible && adlAnalysis?.potentialLevel !== 'R') {
      // K can be added to S or L
      if (adlAnalysis?.potentialLevel === 'S' || adlAnalysis?.potentialLevel === 'L' || smcAnalysis?.smcS?.eligible) {
        total += smcAnalysis.smcK.monthlyAmount;
      }
    }

    return total;
  }, [smcAnalysis, adlAnalysis]);

  if (isLoading) {
    return (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <div className="animate-pulse flex items-center gap-3">
            <div className="w-8 h-8 bg-gray-300 dark:bg-gray-600 rounded"></div>
            <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-48"></div>
          </div>
        </div>
    );
  }

  const hasAnyEligibility = smcAnalysis?.smcK?.eligible || smcAnalysis?.smcS?.eligible || adlAnalysis?.potentialLevel;

  return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden border-l-4 border-amber-500">
        {/* Header */}
        <button
            onClick={onToggle}
            className="w-full px-6 py-4 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
        >
          <div className="flex items-center gap-3">
            <span className="text-2xl">💰</span>
            <div className="text-left">
              <h3 className="font-semibold text-lg text-gray-900 dark:text-white">
                Special Monthly Compensation (SMC)
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                38 CFR § 3.350 - Eligibility Analysis
              </p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right">
              {hasAnyEligibility ? (
                  <>
                    <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                      ${totalPotentialSMC.toFixed(2)}
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">
                      Potential Monthly
                    </div>
                  </>
              ) : (
                  <>
                    <div className="text-lg font-medium text-gray-500 dark:text-gray-400">
                      Review Needed
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">
                      Check Eligibility
                    </div>
                  </>
              )}
            </div>
            {expanded ? (
                <ChevronUp className="w-5 h-5 text-gray-400" />
            ) : (
                <ChevronDown className="w-5 h-5 text-gray-400" />
            )}
          </div>
        </button>

        {/* Expanded Content */}
        {expanded && (
            <div className="px-6 pb-6 space-y-6">
              <div className="border-t border-gray-200 dark:border-gray-700" />

              {/* Overview Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* SMC-K Card */}
                <div className={`p-4 rounded-lg border-2 ${
                    smcAnalysis?.smcK?.eligible
                        ? 'bg-amber-50 dark:bg-amber-900/20 border-amber-300 dark:border-amber-700'
                        : 'bg-gray-50 dark:bg-gray-700/30 border-gray-200 dark:border-gray-600'
                }`}>
                  <div className="flex items-center gap-2 mb-2">
                <span className={`px-2 py-0.5 rounded text-xs font-bold ${
                    smcAnalysis?.smcK?.eligible
                        ? 'bg-amber-200 dark:bg-amber-800 text-amber-800 dark:text-amber-200'
                        : 'bg-gray-200 dark:bg-gray-600 text-gray-600 dark:text-gray-300'
                }`}>
                  SMC-K
                </span>
                    {smcAnalysis?.smcK?.eligible && (
                        <CheckCircle className="w-4 h-4 text-green-500" />
                    )}
                  </div>
                  <div className="text-lg font-bold text-gray-900 dark:text-white">
                    {smcAnalysis?.smcK?.eligible
                        ? `$${smcAnalysis.smcK.monthlyAmount.toFixed(2)}/mo`
                        : 'Not Eligible'
                    }
                  </div>
                  <div className="text-xs text-gray-600 dark:text-gray-400">
                    {smcAnalysis?.smcK?.eligible
                        ? `${smcAnalysis.smcK.cappedAwards} of 3 awards`
                        : 'Specific anatomical losses'
                    }
                  </div>
                </div>

                {/* SMC-S Card */}
                <div className={`p-4 rounded-lg border-2 ${
                    smcAnalysis?.smcS?.eligible
                        ? 'bg-purple-50 dark:bg-purple-900/20 border-purple-300 dark:border-purple-700'
                        : 'bg-gray-50 dark:bg-gray-700/30 border-gray-200 dark:border-gray-600'
                }`}>
                  <div className="flex items-center gap-2 mb-2">
                <span className={`px-2 py-0.5 rounded text-xs font-bold ${
                    smcAnalysis?.smcS?.eligible
                        ? 'bg-purple-200 dark:bg-purple-800 text-purple-800 dark:text-purple-200'
                        : 'bg-gray-200 dark:bg-gray-600 text-gray-600 dark:text-gray-300'
                }`}>
                  SMC-S
                </span>
                    {smcAnalysis?.smcS?.eligible && (
                        <CheckCircle className="w-4 h-4 text-green-500" />
                    )}
                  </div>
                  <div className="text-lg font-bold text-gray-900 dark:text-white">
                    {smcAnalysis?.smcS?.eligible
                        ? `$${smcAnalysis.smcS.monthlyAmount.toFixed(2)}/mo`
                        : 'Not Eligible'
                    }
                  </div>
                  <div className="text-xs text-gray-600 dark:text-gray-400">
                    {smcAnalysis?.smcS?.eligible
                        ? 'Housebound status'
                        : '100% + 60% additional'
                    }
                  </div>
                </div>

                {/* SMC-L/R Card (Aid & Attendance) */}
                <div className={`p-4 rounded-lg border-2 ${
                    adlAnalysis?.potentialLevel
                        ? 'bg-blue-50 dark:bg-blue-900/20 border-blue-300 dark:border-blue-700'
                        : 'bg-gray-50 dark:bg-gray-700/30 border-gray-200 dark:border-gray-600'
                }`}>
                  <div className="flex items-center gap-2 mb-2">
                <span className={`px-2 py-0.5 rounded text-xs font-bold ${
                    adlAnalysis?.potentialLevel
                        ? 'bg-blue-200 dark:bg-blue-800 text-blue-800 dark:text-blue-200'
                        : 'bg-gray-200 dark:bg-gray-600 text-gray-600 dark:text-gray-300'
                }`}>
                  SMC-{adlAnalysis?.potentialLevel || 'L/R'}
                </span>
                    {adlAnalysis?.potentialLevel && (
                        <CheckCircle className="w-4 h-4 text-green-500" />
                    )}
                  </div>
                  <div className="text-lg font-bold text-gray-900 dark:text-white">
                    {adlAnalysis?.potentialLevel
                        ? `$${adlAnalysis.potentialAmount.toFixed(2)}/mo`
                        : 'Review ADL'
                    }
                  </div>
                  <div className="text-xs text-gray-600 dark:text-gray-400">
                    {adlAnalysis?.potentialLevel
                        ? 'Aid & Attendance'
                        : 'Log ADL limitations'
                    }
                  </div>
                </div>
              </div>

              {/* SMC-K Details */}
              {smcAnalysis?.smcK && (
                  <div className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
                    <button
                        onClick={() => toggleSection('smcK')}
                        className="w-full px-4 py-3 flex items-center justify-between bg-gray-50 dark:bg-gray-700/50 hover:bg-gray-100 dark:hover:bg-gray-700"
                    >
                      <div className="flex items-center gap-2">
                  <span className="font-medium text-gray-900 dark:text-white">
                    SMC-K Analysis
                  </span>
                        <span className={`px-2 py-0.5 rounded text-xs ${
                            smcAnalysis.smcK.eligible
                                ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300'
                                : 'bg-gray-100 dark:bg-gray-600 text-gray-600 dark:text-gray-300'
                        }`}>
                    {smcAnalysis.smcK.eligible ? 'Eligible' : 'Not Eligible'}
                  </span>
                      </div>
                      {expandedSections.smcK ? (
                          <ChevronUp className="w-4 h-4 text-gray-400" />
                      ) : (
                          <ChevronDown className="w-4 h-4 text-gray-400" />
                      )}
                    </button>

                    {expandedSections.smcK && (
                        <div className="px-4 py-3 space-y-3">
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            SMC-K is an <strong>additional</strong> monthly payment ($139.87) for specific anatomical
                            losses or loss of use. You can receive up to 3 SMC-K awards for different qualifying conditions.
                          </p>

                          {smcAnalysis.smcK.eligible ? (
                              <div className="space-y-2">
                                <h5 className="font-medium text-gray-900 dark:text-white">Qualifying Conditions:</h5>
                                {smcAnalysis.smcK.eligibleConditions.map((cat, idx) => (
                                    <div key={idx} className="bg-amber-50 dark:bg-amber-900/20 p-3 rounded-lg">
                                      <div className="flex items-center gap-2">
                                        <CheckCircle className="w-4 h-4 text-green-500" />
                                        <span className="font-medium text-amber-900 dark:text-amber-100">
                              {cat.categoryName}
                            </span>
                                        {cat.autoGrant && (
                                            <span className="text-xs bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 px-2 py-0.5 rounded">
                                Auto-Grant
                              </span>
                                        )}
                                      </div>
                                      <div className="mt-1 text-sm text-amber-800 dark:text-amber-200">
                                        {cat.conditions.map(c => c.conditionName).join(', ')}
                                      </div>
                                    </div>
                                ))}
                                <div className="mt-3 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                                  <div className="flex items-center gap-2">
                                    <DollarSign className="w-5 h-5 text-green-600 dark:text-green-400" />
                                    <span className="font-bold text-green-700 dark:text-green-300">
                            Monthly SMC-K: ${smcAnalysis.smcK.monthlyAmount.toFixed(2)}
                          </span>
                                  </div>
                                  <p className="text-xs text-green-600 dark:text-green-400 mt-1">
                                    {smcAnalysis.smcK.cappedAwards} award(s) × $139.87
                                  </p>
                                </div>
                              </div>
                          ) : (
                              <div className="bg-gray-100 dark:bg-gray-700 p-3 rounded-lg">
                                <p className="text-sm text-gray-600 dark:text-gray-400">
                                  No qualifying conditions found in your service-connected conditions.
                                  SMC-K requires specific anatomical losses such as:
                                </p>
                                <ul className="mt-2 text-sm text-gray-600 dark:text-gray-400 list-disc list-inside">
                                  <li>Loss of creative organ (penis, testis, ovary, uterus)</li>
                                  <li>Loss of use of hand or foot</li>
                                  <li>Blindness in one eye</li>
                                  <li>Complete bilateral deafness</li>
                                  <li>Complete organic aphonia (100%)</li>
                                </ul>
                              </div>
                          )}
                        </div>
                    )}
                  </div>
              )}

              {/* SMC-S Details */}
              {smcAnalysis?.smcS && (
                  <div className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
                    <button
                        onClick={() => toggleSection('smcS')}
                        className="w-full px-4 py-3 flex items-center justify-between bg-gray-50 dark:bg-gray-700/50 hover:bg-gray-100 dark:hover:bg-gray-700"
                    >
                      <div className="flex items-center gap-2">
                  <span className="font-medium text-gray-900 dark:text-white">
                    SMC-S Analysis (Housebound)
                  </span>
                        <span className={`px-2 py-0.5 rounded text-xs ${
                            smcAnalysis.smcS.eligible
                                ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300'
                                : 'bg-gray-100 dark:bg-gray-600 text-gray-600 dark:text-gray-300'
                        }`}>
                    {smcAnalysis.smcS.eligible ? 'Eligible' : 'Not Eligible'}
                  </span>
                      </div>
                      {expandedSections.smcS ? (
                          <ChevronUp className="w-4 h-4 text-gray-400" />
                      ) : (
                          <ChevronDown className="w-4 h-4 text-gray-400" />
                      )}
                    </button>

                    {expandedSections.smcS && (
                        <div className="px-4 py-3 space-y-3">
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            SMC-S (Housebound) requires one condition rated at 100% PLUS additional
                            disabilities combining to 60% or more (independent of the 100% condition).
                          </p>

                          {smcAnalysis.smcS.condition100 ? (
                              <div className="space-y-2">
                                <div className="bg-purple-50 dark:bg-purple-900/20 p-3 rounded-lg">
                                  <div className="text-sm">
                          <span className="font-medium text-purple-900 dark:text-purple-100">
                            100% Condition:
                          </span>
                                    <span className="ml-2 text-purple-800 dark:text-purple-200">
                            {smcAnalysis.smcS.condition100.conditionName}
                          </span>
                                  </div>
                                  <div className="text-sm mt-1">
                          <span className="font-medium text-purple-900 dark:text-purple-100">
                            Additional Combined:
                          </span>
                                    <span className={`ml-2 ${
                                        smcAnalysis.smcS.additionalCombined >= 60
                                            ? 'text-green-600 dark:text-green-400 font-bold'
                                            : 'text-purple-800 dark:text-purple-200'
                                    }`}>
                            {smcAnalysis.smcS.additionalCombined}%
                                      {smcAnalysis.smcS.additionalCombined >= 60 && ' ✓'}
                          </span>
                                  </div>
                                </div>

                                {smcAnalysis.smcS.eligible ? (
                                    <div className="p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                                      <div className="flex items-center gap-2">
                                        <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400" />
                                        <span className="font-bold text-green-700 dark:text-green-300">
                              SMC-S Eligible: ${smcAnalysis.smcS.monthlyAmount.toFixed(2)}/month
                            </span>
                                      </div>
                                    </div>
                                ) : (
                                    <div className="p-3 bg-amber-50 dark:bg-amber-900/20 rounded-lg">
                                      <div className="flex items-start gap-2">
                                        <AlertTriangle className="w-5 h-5 text-amber-600 dark:text-amber-400 mt-0.5" />
                                        <div>
                              <span className="font-medium text-amber-700 dark:text-amber-300">
                                Need {60 - smcAnalysis.smcS.additionalCombined}% more in additional disabilities
                              </span>
                                          <p className="text-xs text-amber-600 dark:text-amber-400 mt-1">
                                            Consider filing for increase on existing conditions or claiming secondary conditions.
                                          </p>
                                        </div>
                                      </div>
                                    </div>
                                )}
                              </div>
                          ) : (
                              <div className="bg-gray-100 dark:bg-gray-700 p-3 rounded-lg">
                                <p className="text-sm text-gray-600 dark:text-gray-400">
                                  No condition currently rated at 100%. SMC-S statutory housebound requires
                                  at least one condition at 100% schedular rating.
                                </p>
                              </div>
                          )}
                        </div>
                    )}
                  </div>
              )}

              {/* ADL / Aid & Attendance Details */}
              <div className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
                <button
                    onClick={() => toggleSection('adl')}
                    className="w-full px-4 py-3 flex items-center justify-between bg-gray-50 dark:bg-gray-700/50 hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  <div className="flex items-center gap-2">
                <span className="font-medium text-gray-900 dark:text-white">
                  Aid & Attendance Analysis (SMC-L/R)
                </span>
                    <span className={`px-2 py-0.5 rounded text-xs ${
                        adlAnalysis?.potentialLevel
                            ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300'
                            : 'bg-gray-100 dark:bg-gray-600 text-gray-600 dark:text-gray-300'
                    }`}>
                  {adlAnalysis?.potentialLevel ? `Potential SMC-${adlAnalysis.potentialLevel}` : 'Review Needed'}
                </span>
                  </div>
                  {expandedSections.adl ? (
                      <ChevronUp className="w-4 h-4 text-gray-400" />
                  ) : (
                      <ChevronDown className="w-4 h-4 text-gray-400" />
                  )}
                </button>

                {expandedSections.adl && (
                    <div className="px-4 py-3 space-y-3">
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Aid & Attendance (SMC-L) requires factual need based on inability to perform
                        Activities of Daily Living per 38 CFR § 3.352(a).
                      </p>

                      {adlAnalysis?.hasData ? (
                          <div className="space-y-3">
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                              <div className="bg-blue-50 dark:bg-blue-900/20 p-2 rounded text-center">
                                <div className="text-lg font-bold text-blue-600 dark:text-blue-400">
                                  {adlAnalysis.totalLogs}
                                </div>
                                <div className="text-xs text-blue-700 dark:text-blue-300">ADL Logs</div>
                              </div>
                              <div className="bg-purple-50 dark:bg-purple-900/20 p-2 rounded text-center">
                                <div className="text-lg font-bold text-purple-600 dark:text-purple-400">
                                  {adlAnalysis.factorsAffected}/7
                                </div>
                                <div className="text-xs text-purple-700 dark:text-purple-300">Factors</div>
                              </div>
                              <div className={`p-2 rounded text-center ${
                                  adlAnalysis.potentialLevel
                                      ? 'bg-green-50 dark:bg-green-900/20'
                                      : 'bg-gray-50 dark:bg-gray-700/30'
                              }`}>
                                <div className={`text-lg font-bold ${
                                    adlAnalysis.potentialLevel
                                        ? 'text-green-600 dark:text-green-400'
                                        : 'text-gray-400'
                                }`}>
                                  {adlAnalysis.potentialLevel || '—'}
                                </div>
                                <div className="text-xs text-gray-600 dark:text-gray-400">SMC Level</div>
                              </div>
                              <div className={`p-2 rounded text-center ${
                                  adlAnalysis.potentialAmount > 0
                                      ? 'bg-green-50 dark:bg-green-900/20'
                                      : 'bg-gray-50 dark:bg-gray-700/30'
                              }`}>
                                <div className={`text-lg font-bold ${
                                    adlAnalysis.potentialAmount > 0
                                        ? 'text-green-600 dark:text-green-400'
                                        : 'text-gray-400'
                                }`}>
                                  {adlAnalysis.potentialAmount > 0
                                      ? `$${adlAnalysis.potentialAmount.toFixed(0)}`
                                      : '—'
                                  }
                                </div>
                                <div className="text-xs text-gray-600 dark:text-gray-400">Monthly</div>
                              </div>
                            </div>

                            {/* ADL Factors Checklist */}
                            <div className="bg-gray-50 dark:bg-gray-700/30 p-3 rounded-lg">
                              <h5 className="font-medium text-gray-900 dark:text-white mb-2">ADL Factors:</h5>
                              <div className="grid grid-cols-2 gap-2">
                                {Object.entries(adlAnalysis.factors).map(([factor, hasLogs]) => (
                                    <div key={factor} className="flex items-center gap-2">
                                      {hasLogs ? (
                                          <CheckCircle className="w-4 h-4 text-green-500" />
                                      ) : (
                                          <div className="w-4 h-4 rounded-full border-2 border-gray-300 dark:border-gray-600" />
                                      )}
                                      <span className={`text-sm capitalize ${
                                          hasLogs
                                              ? 'text-gray-900 dark:text-white'
                                              : 'text-gray-500 dark:text-gray-400'
                                      }`}>
                              {factor}
                            </span>
                                    </div>
                                ))}
                              </div>
                            </div>

                            {adlAnalysis.potentialLevel && (
                                <div className="p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                                  <div className="flex items-center gap-2">
                                    <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400" />
                                    <span className="font-bold text-green-700 dark:text-green-300">
                            Potential SMC-{adlAnalysis.potentialLevel}: ${adlAnalysis.potentialAmount.toFixed(2)}/month
                          </span>
                                  </div>
                                  <p className="text-xs text-green-600 dark:text-green-400 mt-1">
                                    Based on {adlAnalysis.factorsAffected} ADL factors documented
                                  </p>
                                </div>
                            )}
                          </div>
                      ) : (
                          <div className="bg-amber-50 dark:bg-amber-900/20 p-4 rounded-lg">
                            <div className="flex items-start gap-3">
                              <Info className="w-5 h-5 text-amber-600 dark:text-amber-400 mt-0.5" />
                              <div>
                                <h5 className="font-medium text-amber-900 dark:text-amber-100">
                                  No ADL Data Logged
                                </h5>
                                <p className="text-sm text-amber-800 dark:text-amber-200 mt-1">
                                  To assess Aid & Attendance eligibility, log your daily living limitations
                                  in the "Functional Status / ADL" section of the symptom logger.
                                </p>
                                <ul className="mt-2 text-sm text-amber-700 dark:text-amber-300 list-disc list-inside">
                                  <li>Dressing & undressing difficulties</li>
                                  <li>Bathing & hygiene assistance needs</li>
                                  <li>Feeding & meal preparation</li>
                                  <li>Toileting & continence issues</li>
                                  <li>Mobility & transfer limitations</li>
                                  <li>Safety & supervision requirements</li>
                                </ul>
                              </div>
                            </div>
                          </div>
                      )}
                    </div>
                )}
              </div>

              {/* Filing Guidance */}
              <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg border border-blue-200 dark:border-blue-800">
                <h4 className="font-semibold text-blue-900 dark:text-blue-200 mb-2 flex items-center gap-2">
                  <Info className="w-5 h-5" />
                  How to File for SMC
                </h4>
                <ul className="space-y-2 text-sm text-blue-800 dark:text-blue-300">
                  <li className="flex items-start gap-2">
                    <span className="text-blue-500 mt-0.5">•</span>
                    <span><strong>SMC-K:</strong> Usually granted automatically when qualifying condition is service-connected. If not received, file VA Form 21-526EZ requesting SMC review.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-blue-500 mt-0.5">•</span>
                    <span><strong>SMC-S:</strong> File for increase if you have 100% for one condition. Request "Housebound" status with supporting evidence.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-blue-500 mt-0.5">•</span>
                    <span><strong>SMC-L (A&A):</strong> Submit VA Form 21-2680 (Examination for Housebound Status or Permanent Need for Aid & Attendance) completed by your physician.</span>
                  </li>
                </ul>
              </div>

              {/* Disclaimer */}
              <div className="bg-gray-100 dark:bg-gray-700/50 rounded-lg p-3 text-xs text-gray-600 dark:text-gray-400">
                <strong>Important:</strong> SMC eligibility analysis is based on 38 CFR § 3.350 and 38 U.S.C. § 1114.
                This is for documentation guidance only. The VA makes all final SMC determinations.
                Rates shown are 2026 rates effective December 1, 2025.
              </div>
            </div>
        )}
      </div>
  );
};

export default SMCCalculator;