import React, { useState, useEffect, useMemo } from 'react';
import { ChevronDown, ChevronUp, DollarSign, AlertTriangle, CheckCircle, Info, Calculator } from 'lucide-react';
import { useProfile } from '../hooks/useProfile';
import { getServiceConnectedConditions } from '../utils/profiles';
import { getSymptomLogs } from '../utils/storage';
import {
  SMC_RATES_2026,
  SMC_K_CRITERIA,
  SMC_S_CRITERIA,
  SMC_L_CRITERIA,
  SMC_M_CRITERIA,
  SMC_N_CRITERIA,
  SMC_O_CRITERIA,
  SMC_R_CRITERIA,
  SMC_T_CRITERIA,
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
  const [higherSMCAnalysis, setHigherSMCAnalysis] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [expandedSections, setExpandedSections] = useState({});

  // Only show for veteran profiles
  if (!profile || profile.type !== 'veteran') {
    return null;
  }

  /**
   * Merge SMC-K results from both Service-Connected conditions and logged symptoms
   * Combines eligible conditions from both sources, avoiding duplicates
   */
  const mergeSMCKResults = (fromSC, fromLogs) => {
    const combinedConditions = [];
    const seenCategories = new Set();
    let totalAwards = 0;

    // Add conditions from Service-Connected analysis
    if (fromSC?.eligibleConditions) {
      fromSC.eligibleConditions.forEach(cond => {
        if (!seenCategories.has(cond.category)) {
          combinedConditions.push(cond);
          seenCategories.add(cond.category);
          totalAwards += cond.awards || 1;
        }
      });
    }

    // Add conditions from Logs/Props analysis (avoid duplicates)
    if (fromLogs?.eligibleConditions) {
      fromLogs.eligibleConditions.forEach(cond => {
        if (!seenCategories.has(cond.category)) {
          combinedConditions.push(cond);
          seenCategories.add(cond.category);
          totalAwards += cond.awards || 1;
        }
      });
    }

    const cappedAwards = Math.min(totalAwards, 3);
    const monthlyAmount = cappedAwards * SMC_RATES_2026.K.rate;

    return {
      eligible: combinedConditions.length > 0,
      eligibleConditions: combinedConditions,
      totalAwards: totalAwards,
      cappedAwards: cappedAwards,
      monthlyAmount: monthlyAmount,
      rate: SMC_RATES_2026.K.rate,
      maxAwards: 3,
    };
  };

  useEffect(() => {
    const analyzeEligibility = () => {
      setIsLoading(true);

      try {
        // Get service-connected conditions
        const scConditions = getServiceConnectedConditions(profile.id) || [];

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

        // Merge results - combine both sources
        const smcKResults = mergeSMCKResults(smcKFromSC, smcKFromLogs);

        // Perform SMC-S analysis (100% + 60% rule)
        const smcSResults = analyzeSMCSEligibility(scConditions);

        // Perform ADL/A&A analysis
        const adlResults = analyzeADLForSMC(adlLogs);


        // Perform SMC-L analysis
        const smcLResults = analyzeSMCLEligibility(scConditions, adlLogs);

        // Perform Higher SMC analysis (M, N, O, R, T)
        const higherResults = analyzeHigherSMCLevels(scConditions, adlLogs, smcKResults, smcLResults);

        // Combine all results
        setSmcAnalysis({
          smcK: smcKResults,
          smcS: smcSResults,
          smcL: smcLResults,
          scConditions,
          totalConditions: scConditions.length,
        });

        setAdlAnalysis(adlResults);
        setHigherSMCAnalysis(higherResults);


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
   * Analyze for SMC-L eligibility
   * SMC-L requires bilateral losses OR factual A&A need
   */
  const analyzeSMCLEligibility = (conditions, adlLogs) => {
    const eligibleConditions = [];
    let qualifyingPathway = null;

    // Check for bilateral feet loss
    const hasBilateralFeetLoss = conditions.some(c => {
      const name = (c.conditionName || '').toLowerCase();
      return (name.includes('bilateral') && (name.includes('foot') || name.includes('feet'))) ||
          (name.includes('amputation') && name.includes('both') && name.includes('foot'));
    });

    if (hasBilateralFeetLoss) {
      eligibleConditions.push({
        category: 'BILATERAL_FEET',
        name: 'Loss of Both Feet',
        description: 'Anatomical loss or loss of use of both feet',
      });
      qualifyingPathway = 'bilateral_feet';
    }

    // Check for bilateral hands loss
    const hasBilateralHandsLoss = conditions.some(c => {
      const name = (c.conditionName || '').toLowerCase();
      return (name.includes('bilateral') && name.includes('hand')) ||
          (name.includes('amputation') && name.includes('both') && name.includes('hand'));
    });

    if (hasBilateralHandsLoss) {
      eligibleConditions.push({
        category: 'BILATERAL_HANDS',
        name: 'Loss of Both Hands',
        description: 'Anatomical loss or loss of use of both hands',
        note: 'Bilateral hand loss may qualify for SMC-M instead',
      });
      qualifyingPathway = 'bilateral_hands';
    }

    // Check for one hand + one foot loss
    const hasHandLoss = conditions.some(c => {
      const name = (c.conditionName || '').toLowerCase();
      return name.includes('hand') && (name.includes('amputation') || name.includes('loss of use'));
    });

    const hasFootLoss = conditions.some(c => {
      const name = (c.conditionName || '').toLowerCase();
      return name.includes('foot') && (name.includes('amputation') || name.includes('loss of use'));
    });

    if (hasHandLoss && hasFootLoss) {
      eligibleConditions.push({
        category: 'HAND_AND_FOOT',
        name: 'Loss of One Hand and One Foot',
        description: 'Anatomical loss or loss of use of one hand AND one foot',
      });
      qualifyingPathway = 'hand_and_foot';
    }

    // Check ADL logs for factual A&A need
    const adlFactors = analyzeADLFactors(adlLogs);
    const hasFactualAA = adlFactors.factorsAffected >= 3 || adlFactors.hasBedridden || adlFactors.hasTotalDependence;

    if (hasFactualAA) {
      eligibleConditions.push({
        category: 'AID_AND_ATTENDANCE',
        name: 'Factual Need for Aid & Attendance',
        description: `${adlFactors.factorsAffected} ADL factors documented`,
        adlFactors: adlFactors,
      });
      if (!qualifyingPathway) qualifyingPathway = 'factual_aa';
    }

    const eligible = eligibleConditions.length > 0;

    return {
      eligible,
      eligibleConditions,
      qualifyingPathway,
      monthlyAmount: eligible ? SMC_RATES_2026.L.veteran_alone : 0,
      halfStepEligible: eligible && (adlFactors.factorsAffected >= 5 || adlFactors.hasNursingLevel),
      halfStepAmount: SMC_RATES_2026.L_HALF?.veteran_alone || 5240.83,
    };
  };

  /**
   * Analyze ADL factors from logs
   */
  const analyzeADLFactors = (adlLogs) => {
    if (!adlLogs || adlLogs.length === 0) {
      return {
        factorsAffected: 0,
        factors: {},
        hasBedridden: false,
        hasTotalDependence: false,
        hasNursingLevel: false,
        hasHousebound: false,
      };
    }

    const factors = {
      dressing: adlLogs.some(l => l.symptomId?.includes('dress')),
      hygiene: adlLogs.some(l => l.symptomId?.includes('hygiene') || l.symptomId?.includes('bath')),
      feeding: adlLogs.some(l => l.symptomId?.includes('feed') || l.symptomId?.includes('eat')),
      toileting: adlLogs.some(l =>
          l.symptomId?.includes('toilet') || l.symptomId?.includes('bowel') ||
          l.symptomId?.includes('bladder') || l.symptomId?.includes('incontinence')
      ),
      mobility: adlLogs.some(l =>
          l.symptomId?.includes('mobility') || l.symptomId?.includes('bed') ||
          l.symptomId?.includes('wheelchair') || l.symptomId?.includes('transfer')
      ),
      safety: adlLogs.some(l => l.symptomId?.includes('safety') || l.symptomId?.includes('supervision')),
      cognitive: adlLogs.some(l => l.symptomId?.includes('cognitive') || l.symptomId?.includes('memory')),
    };

    return {
      factorsAffected: Object.values(factors).filter(Boolean).length,
      factors,
      hasBedridden: adlLogs.some(l => l.symptomId?.includes('bedridden')),
      hasTotalDependence: adlLogs.some(l => l.symptomId?.includes('total-depend')),
      hasNursingLevel: adlLogs.some(l => l.symptomId?.includes('nursing-level')),
      hasHousebound: adlLogs.some(l => l.symptomId?.includes('housebound')),
    };
  };

  /**
   * Analyze for higher SMC levels (M, N, O, R, T)
   */
  const analyzeHigherSMCLevels = (conditions, adlLogs, smcKResults, smcLResults) => {
    const results = {
      smcM: { eligible: false, conditions: [], reason: '', monthlyAmount: 0 },
      smcN: { eligible: false, conditions: [], reason: '', monthlyAmount: 0 },
      smcO: { eligible: false, conditions: [], reason: '', monthlyAmount: 0 },
      smcR1: { eligible: false, conditions: [], reason: '', monthlyAmount: 0 },
      smcR2: { eligible: false, conditions: [], reason: '', monthlyAmount: 0 },
      smcT: { eligible: false, conditions: [], reason: '', monthlyAmount: 0 },
      highestLevel: null,
      highestAmount: 0,
    };

    // Helper to check for specific loss types
    const hasConditionType = (type) => {
      return conditions.some(c => {
        const name = (c.conditionName || '').toLowerCase();
        const dc = (c.diagnosticCode || '').toString();
        switch (type) {
          case 'bilateral_hands':
            return (name.includes('bilateral') && name.includes('hand')) ||
                (name.includes('both') && name.includes('hand'));
          case 'bilateral_feet':
            return (name.includes('bilateral') && (name.includes('foot') || name.includes('feet')));
          case 'bilateral_blindness':
            return (name.includes('bilateral') && name.includes('blind')) || dc === '6064';
          case 'bilateral_blindness_light_only':
            return dc === '6063' || (name.includes('light perception only') && name.includes('both'));
          case 'bilateral_deafness':
            return (name.includes('bilateral') && name.includes('deaf')) || (dc === '6100' && c.currentRating === 100);
          case 'hand_loss':
            return name.includes('hand') && (name.includes('amputation') || name.includes('loss of use'));
          case 'foot_loss':
            return name.includes('foot') && (name.includes('amputation') || name.includes('loss of use'));
          case 'leg_above_knee':
            return name.includes('leg') && (name.includes('above knee') || name.includes('hip'));
          case 'arm_above_elbow':
            return name.includes('arm') && (name.includes('above elbow') || name.includes('shoulder'));
          case 'paraplegia':
            return name.includes('paraplegia') || name.includes('spinal cord') ||
                (name.includes('paralysis') && name.includes('lower'));
          case 'quadriplegia':
            return name.includes('quadriplegia') || name.includes('tetraplegia');
          case 'tbi_100':
            return (dc === '8045' || name.includes('tbi') || name.includes('traumatic brain')) && c.currentRating === 100;
          case 'als':
            return dc === '8017' || name.includes('als') || name.includes('amyotrophic lateral');
          default:
            return false;
        }
      });
    };

    const adlFactors = analyzeADLFactors(adlLogs);

    // SMC-M Analysis
    if (hasConditionType('bilateral_hands')) {
      results.smcM.eligible = true;
      results.smcM.conditions.push('Loss of use of both hands');
      results.smcM.reason = 'Bilateral hand loss qualifies for SMC-M';
    }

    if (hasConditionType('hand_loss') && hasConditionType('leg_above_knee')) {
      results.smcM.eligible = true;
      results.smcM.conditions.push('Loss of one hand + one leg near hip');
      results.smcM.reason = 'Hand and leg (hip level) loss qualifies for SMC-M';
    }

    if (hasConditionType('bilateral_blindness') && hasConditionType('bilateral_deafness')) {
      results.smcM.eligible = true;
      results.smcM.conditions.push('Bilateral blindness (5/200) + bilateral deafness');
      results.smcM.reason = 'Blindness and deafness combination qualifies for SMC-M';
    }

    if (results.smcM.eligible) {
      results.smcM.monthlyAmount = SMC_RATES_2026.M.veteran_alone;
    }

    // SMC-N Analysis
    if (hasConditionType('arm_above_elbow') && conditions.filter(c =>
        (c.conditionName || '').toLowerCase().includes('arm') &&
        (c.conditionName || '').toLowerCase().includes('above elbow')
    ).length >= 2) {
      results.smcN.eligible = true;
      results.smcN.conditions.push('Loss of both arms above elbow level');
      results.smcN.reason = 'Bilateral arm loss above elbow qualifies for SMC-N';
    }

    if (results.smcN.eligible) {
      results.smcN.monthlyAmount = SMC_RATES_2026.N.veteran_alone;
    }

    // SMC-O Analysis
    if (hasConditionType('paraplegia')) {
      const hasSphincter = conditions.some(c => {
        const name = (c.conditionName || '').toLowerCase();
        return name.includes('sphincter') || name.includes('incontinence');
      });
      if (hasSphincter) {
        results.smcO.eligible = true;
        results.smcO.conditions.push('Paraplegia with loss of sphincter control');
        results.smcO.reason = 'Paraplegia with sphincter loss qualifies for SMC-O';
      }
    }

    if (hasConditionType('quadriplegia')) {
      results.smcO.eligible = true;
      results.smcO.conditions.push('Quadriplegia');
      results.smcO.reason = 'Quadriplegia qualifies for SMC-O';
    }

    if (hasConditionType('als')) {
      results.smcO.eligible = true;
      results.smcO.conditions.push('ALS (Amyotrophic Lateral Sclerosis)');
      results.smcO.reason = 'ALS qualifies for SMC-O (minimum 100% rating)';
    }

    // Check for multiple L/M/N level combinations (pyramiding allowed at O)
    let lmnCount = 0;
    if (smcLResults?.eligible) lmnCount++;
    if (results.smcM.eligible) lmnCount++;
    if (results.smcN.eligible) lmnCount++;

    if (lmnCount >= 2 && !results.smcO.eligible) {
      results.smcO.eligible = true;
      results.smcO.conditions.push('Multiple SMC-L/M/N level disabilities');
      results.smcO.reason = 'Combination meeting multiple L/M/N criteria qualifies for SMC-O (pyramiding)';
    }

    if (results.smcO.eligible) {
      results.smcO.monthlyAmount = SMC_RATES_2026.O.veteran_alone;
      results.smcO.note = 'SMC-K is NOT paid with SMC-O';
    }

    // SMC-R1 Analysis
    if (results.smcO.eligible && adlFactors.factorsAffected >= 3) {
      results.smcR1.eligible = true;
      results.smcR1.conditions.push('SMC-O eligible + Aid & Attendance need');
      results.smcR1.reason = 'SMC-O with separate A&A need qualifies for SMC-R1';
      results.smcR1.monthlyAmount = SMC_RATES_2026.R1.veteran_alone;
    }

    // SMC-R2 Analysis
    if (results.smcR1.eligible && adlFactors.hasNursingLevel) {
      results.smcR2.eligible = true;
      results.smcR2.conditions.push('SMC-R1 eligible + nursing home level care needed');
      results.smcR2.reason = 'SMC-R1 with nursing home level care qualifies for SMC-R2';
      results.smcR2.monthlyAmount = SMC_RATES_2026.R2.veteran_alone;
    }

    // SMC-T Analysis
    if (hasConditionType('tbi_100') && adlFactors.factorsAffected >= 3) {
      results.smcT.eligible = true;
      results.smcT.conditions.push('TBI at 100% + Aid & Attendance need');
      results.smcT.reason = 'TBI at 100% with A&A need qualifies for SMC-T';
      results.smcT.monthlyAmount = SMC_RATES_2026.T.veteran_alone;
      results.smcT.note = 'SMC-T is specifically for TBI residuals requiring A&A';
    }

    // Determine highest eligible level
    const levels = [
      { key: 'smcR2', amount: results.smcR2.monthlyAmount, eligible: results.smcR2.eligible },
      { key: 'smcT', amount: results.smcT.monthlyAmount, eligible: results.smcT.eligible },
      { key: 'smcR1', amount: results.smcR1.monthlyAmount, eligible: results.smcR1.eligible },
      { key: 'smcO', amount: results.smcO.monthlyAmount, eligible: results.smcO.eligible },
      { key: 'smcN', amount: results.smcN.monthlyAmount, eligible: results.smcN.eligible },
      { key: 'smcM', amount: results.smcM.monthlyAmount, eligible: results.smcM.eligible },
    ];

    for (const level of levels) {
      if (level.eligible) {
        results.highestLevel = level.key;
        results.highestAmount = level.amount;
        break;
      }
    }

    return results;
  };

  /**
   * Analyze SMC-K eligibility from passed rating card analyses
   * This checks the actual logged symptoms via the rating card analysis props
   */
  const analyzeSMCKFromProps = () => {
    const eligibleConditions = [];
    let totalKAwards = 0;

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
    let baseLevel = null;

    // Check for highest level (R2 > T > R1 > O > N > M > L > S)
    if (higherSMCAnalysis?.smcR2?.eligible) {
      total = higherSMCAnalysis.smcR2.monthlyAmount;
      baseLevel = 'R2';
    } else if (higherSMCAnalysis?.smcT?.eligible) {
      total = higherSMCAnalysis.smcT.monthlyAmount;
      baseLevel = 'T';
    } else if (higherSMCAnalysis?.smcR1?.eligible) {
      total = higherSMCAnalysis.smcR1.monthlyAmount;
      baseLevel = 'R1';
    } else if (higherSMCAnalysis?.smcO?.eligible) {
      total = higherSMCAnalysis.smcO.monthlyAmount;
      baseLevel = 'O';
    } else if (higherSMCAnalysis?.smcN?.eligible) {
      total = higherSMCAnalysis.smcN.monthlyAmount;
      baseLevel = 'N';
    } else if (higherSMCAnalysis?.smcM?.eligible) {
      total = higherSMCAnalysis.smcM.monthlyAmount;
      baseLevel = 'M';
    } else if (smcAnalysis?.smcL?.eligible) {
      total = smcAnalysis.smcL.monthlyAmount;
      baseLevel = 'L';
    } else if (adlAnalysis?.potentialLevel === 'L') {
      total = adlAnalysis.potentialAmount;
      baseLevel = 'L';
    } else if (smcAnalysis?.smcS?.eligible) {
      total = smcAnalysis.smcS.monthlyAmount;
      baseLevel = 'S';
    }

    // SMC-K is additive UNLESS at O, R, or T
    if (smcAnalysis?.smcK?.eligible && !['O', 'R1', 'R2', 'T'].includes(baseLevel)) {
      total += smcAnalysis.smcK.monthlyAmount;
    }

    return total;
  }, [smcAnalysis, adlAnalysis, higherSMCAnalysis]);

  // Determine highest SMC level
  const highestSMCLevel = useMemo(() => {
    if (higherSMCAnalysis?.smcR2?.eligible) return 'R2';
    if (higherSMCAnalysis?.smcT?.eligible) return 'T';
    if (higherSMCAnalysis?.smcR1?.eligible) return 'R1';
    if (higherSMCAnalysis?.smcO?.eligible) return 'O';
    if (higherSMCAnalysis?.smcN?.eligible) return 'N';
    if (higherSMCAnalysis?.smcM?.eligible) return 'M';
    if (smcAnalysis?.smcL?.eligible || adlAnalysis?.potentialLevel === 'L') return 'L';
    if (smcAnalysis?.smcS?.eligible || adlAnalysis?.potentialLevel === 'S') return 'S';
    if (smcAnalysis?.smcK?.eligible) return 'K';
    return null;
  }, [smcAnalysis, adlAnalysis, higherSMCAnalysis]);

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

  const hasAnyEligibility = smcAnalysis?.smcK?.eligible ||
      smcAnalysis?.smcS?.eligible ||
      smcAnalysis?.smcL?.eligible ||
      adlAnalysis?.potentialLevel ||
      higherSMCAnalysis?.highestLevel;

  // Color scheme for each SMC level
  const getLevelColors = (level) => {
    switch (level) {
      case 'K':
        return { bg: 'bg-amber-50 dark:bg-amber-900/20', border: 'border-amber-300 dark:border-amber-700', text: 'text-amber-600 dark:text-amber-400', badge: 'bg-amber-200 dark:bg-amber-800 text-amber-800 dark:text-amber-200' };
      case 'S':
        return { bg: 'bg-purple-50 dark:bg-purple-900/20', border: 'border-purple-300 dark:border-purple-700', text: 'text-purple-600 dark:text-purple-400', badge: 'bg-purple-200 dark:bg-purple-800 text-purple-800 dark:text-purple-200' };
      case 'L':
        return { bg: 'bg-blue-50 dark:bg-blue-900/20', border: 'border-blue-300 dark:border-blue-700', text: 'text-blue-600 dark:text-blue-400', badge: 'bg-blue-200 dark:bg-blue-800 text-blue-800 dark:text-blue-200' };
      case 'M':
        return { bg: 'bg-indigo-50 dark:bg-indigo-900/20', border: 'border-indigo-300 dark:border-indigo-700', text: 'text-indigo-600 dark:text-indigo-400', badge: 'bg-indigo-200 dark:bg-indigo-800 text-indigo-800 dark:text-indigo-200' };
      case 'N':
        return { bg: 'bg-violet-50 dark:bg-violet-900/20', border: 'border-violet-300 dark:border-violet-700', text: 'text-violet-600 dark:text-violet-400', badge: 'bg-violet-200 dark:bg-violet-800 text-violet-800 dark:text-violet-200' };
      case 'O':
        return { bg: 'bg-red-50 dark:bg-red-900/20', border: 'border-red-300 dark:border-red-700', text: 'text-red-600 dark:text-red-400', badge: 'bg-red-200 dark:bg-red-800 text-red-800 dark:text-red-200' };
      case 'R1':
      case 'R2':
        return { bg: 'bg-rose-50 dark:bg-rose-900/20', border: 'border-rose-300 dark:border-rose-700', text: 'text-rose-600 dark:text-rose-400', badge: 'bg-rose-200 dark:bg-rose-800 text-rose-800 dark:text-rose-200' };
      case 'T':
        return { bg: 'bg-orange-50 dark:bg-orange-900/20', border: 'border-orange-300 dark:border-orange-700', text: 'text-orange-600 dark:text-orange-400', badge: 'bg-orange-200 dark:bg-orange-800 text-orange-800 dark:text-orange-200' };
      default:
        return { bg: 'bg-gray-50 dark:bg-gray-700/30', border: 'border-gray-200 dark:border-gray-600', text: 'text-gray-600 dark:text-gray-400', badge: 'bg-gray-200 dark:bg-gray-600 text-gray-600 dark:text-gray-300' };
    }
  };

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

              {/* SMC Hierarchy Visual */}
              <div className="bg-gradient-to-r from-amber-50 to-red-50 dark:from-gray-700/50 dark:to-gray-700/50 rounded-lg p-4">
                <h4 className="font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                  <Calculator className="w-5 h-5" />
                  SMC Level Hierarchy
                </h4>
                <div className="flex flex-wrap gap-2">
                  {['K', 'S', 'L', 'M', 'N', 'O', 'R1', 'R2', 'T'].map(level => {
                    const colors = getLevelColors(level);
                    const isEligible =
                        (level === 'K' && smcAnalysis?.smcK?.eligible) ||
                        (level === 'S' && smcAnalysis?.smcS?.eligible) ||
                        (level === 'L' && (smcAnalysis?.smcL?.eligible || adlAnalysis?.potentialLevel === 'L')) ||
                        (level === 'M' && higherSMCAnalysis?.smcM?.eligible) ||
                        (level === 'N' && higherSMCAnalysis?.smcN?.eligible) ||
                        (level === 'O' && higherSMCAnalysis?.smcO?.eligible) ||
                        (level === 'R1' && higherSMCAnalysis?.smcR1?.eligible) ||
                        (level === 'R2' && higherSMCAnalysis?.smcR2?.eligible) ||
                        (level === 'T' && higherSMCAnalysis?.smcT?.eligible);
                    const isHighest = level === highestSMCLevel;

                    return (
                        <div
                            key={level}
                            className={`px-3 py-1.5 rounded-lg border-2 flex items-center gap-1.5 ${
                                isEligible ? colors.bg + ' ' + colors.border : 'bg-gray-100 dark:bg-gray-700 border-gray-200 dark:border-gray-600'
                            } ${isHighest ? 'ring-2 ring-green-500 ring-offset-1' : ''}`}
                        >
            <span className={`font-bold text-sm ${isEligible ? colors.text : 'text-gray-400'}`}>
              SMC-{level}
            </span>
                          {isEligible && <CheckCircle className="w-4 h-4 text-green-500" />}
                          {isHighest && <span className="text-xs text-green-600 dark:text-green-400 font-medium">★</span>}
                        </div>
                    );
                  })}
                </div>
                <p className="text-xs text-gray-600 dark:text-gray-400 mt-2">
                  K is additive (except with O/R/T). S through T are replacement rates (highest applies).
                </p>
              </div>

              {/* Overview Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-left">
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

              {/* Overview Cards - Row 2: M, N, O */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* SMC-M Card */}
                <div className={`p-4 rounded-lg border-2 ${
                    higherSMCAnalysis?.smcM?.eligible
                        ? 'bg-indigo-50 dark:bg-indigo-900/20 border-indigo-300 dark:border-indigo-700'
                        : 'bg-gray-50 dark:bg-gray-700/30 border-gray-200 dark:border-gray-600'
                }`}>
                  <div className="flex items-center gap-2 mb-2">
      <span className={`px-2 py-0.5 rounded text-xs font-bold ${
          higherSMCAnalysis?.smcM?.eligible
              ? 'bg-indigo-200 dark:bg-indigo-800 text-indigo-800 dark:text-indigo-200'
              : 'bg-gray-200 dark:bg-gray-600 text-gray-600 dark:text-gray-300'
      }`}>
        SMC-M
      </span>
                    {higherSMCAnalysis?.smcM?.eligible && <CheckCircle className="w-4 h-4 text-green-500" />}
                  </div>
                  <div className="text-lg font-bold text-gray-900 dark:text-white">
                    {higherSMCAnalysis?.smcM?.eligible
                        ? `$${higherSMCAnalysis.smcM.monthlyAmount.toFixed(2)}/mo`
                        : 'Not Eligible'
                    }
                  </div>
                  <div className="text-xs text-gray-600 dark:text-gray-400">
                    Severe combinations
                  </div>
                </div>

                {/* SMC-N Card */}
                <div className={`p-4 rounded-lg border-2 ${
                    higherSMCAnalysis?.smcN?.eligible
                        ? 'bg-violet-50 dark:bg-violet-900/20 border-violet-300 dark:border-violet-700'
                        : 'bg-gray-50 dark:bg-gray-700/30 border-gray-200 dark:border-gray-600'
                }`}>
                  <div className="flex items-center gap-2 mb-2">
      <span className={`px-2 py-0.5 rounded text-xs font-bold ${
          higherSMCAnalysis?.smcN?.eligible
              ? 'bg-violet-200 dark:bg-violet-800 text-violet-800 dark:text-violet-200'
              : 'bg-gray-200 dark:bg-gray-600 text-gray-600 dark:text-gray-300'
      }`}>
        SMC-N
      </span>
                    {higherSMCAnalysis?.smcN?.eligible && <CheckCircle className="w-4 h-4 text-green-500" />}
                  </div>
                  <div className="text-lg font-bold text-gray-900 dark:text-white">
                    {higherSMCAnalysis?.smcN?.eligible
                        ? `$${higherSMCAnalysis.smcN.monthlyAmount.toFixed(2)}/mo`
                        : 'Not Eligible'
                    }
                  </div>
                  <div className="text-xs text-gray-600 dark:text-gray-400">
                    Most severe (below O)
                  </div>
                </div>

                {/* SMC-O Card */}
                <div className={`p-4 rounded-lg border-2 ${
                    higherSMCAnalysis?.smcO?.eligible
                        ? 'bg-red-50 dark:bg-red-900/20 border-red-300 dark:border-red-700'
                        : 'bg-gray-50 dark:bg-gray-700/30 border-gray-200 dark:border-gray-600'
                }`}>
                  <div className="flex items-center gap-2 mb-2">
      <span className={`px-2 py-0.5 rounded text-xs font-bold ${
          higherSMCAnalysis?.smcO?.eligible
              ? 'bg-red-200 dark:bg-red-800 text-red-800 dark:text-red-200'
              : 'bg-gray-200 dark:bg-gray-600 text-gray-600 dark:text-gray-300'
      }`}>
        SMC-O
      </span>
                    {higherSMCAnalysis?.smcO?.eligible && <CheckCircle className="w-4 h-4 text-green-500" />}
                  </div>
                  <div className="text-lg font-bold text-gray-900 dark:text-white">
                    {higherSMCAnalysis?.smcO?.eligible
                        ? `$${higherSMCAnalysis.smcO.monthlyAmount.toFixed(2)}/mo`
                        : 'Not Eligible'
                    }
                  </div>
                  <div className="text-xs text-gray-600 dark:text-gray-400">
                    Maximum schedular
                  </div>
                </div>
              </div>

              {/* Overview Cards - Row 3: R1, R2, T */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* SMC-R1 Card */}
                <div className={`p-4 rounded-lg border-2 ${
                    higherSMCAnalysis?.smcR1?.eligible
                        ? 'bg-rose-50 dark:bg-rose-900/20 border-rose-300 dark:border-rose-700'
                        : 'bg-gray-50 dark:bg-gray-700/30 border-gray-200 dark:border-gray-600'
                }`}>
                  <div className="flex items-center gap-2 mb-2">
      <span className={`px-2 py-0.5 rounded text-xs font-bold ${
          higherSMCAnalysis?.smcR1?.eligible
              ? 'bg-rose-200 dark:bg-rose-800 text-rose-800 dark:text-rose-200'
              : 'bg-gray-200 dark:bg-gray-600 text-gray-600 dark:text-gray-300'
      }`}>
        SMC-R1
      </span>
                    {higherSMCAnalysis?.smcR1?.eligible && <CheckCircle className="w-4 h-4 text-green-500" />}
                  </div>
                  <div className="text-lg font-bold text-gray-900 dark:text-white">
                    {higherSMCAnalysis?.smcR1?.eligible
                        ? `$${higherSMCAnalysis.smcR1.monthlyAmount.toFixed(2)}/mo`
                        : 'Not Eligible'
                    }
                  </div>
                  <div className="text-xs text-gray-600 dark:text-gray-400">
                    Higher A&A (O + A&A)
                  </div>
                </div>

                {/* SMC-R2 Card */}
                <div className={`p-4 rounded-lg border-2 ${
                    higherSMCAnalysis?.smcR2?.eligible
                        ? 'bg-rose-50 dark:bg-rose-900/20 border-rose-300 dark:border-rose-700'
                        : 'bg-gray-50 dark:bg-gray-700/30 border-gray-200 dark:border-gray-600'
                }`}>
                  <div className="flex items-center gap-2 mb-2">
      <span className={`px-2 py-0.5 rounded text-xs font-bold ${
          higherSMCAnalysis?.smcR2?.eligible
              ? 'bg-rose-200 dark:bg-rose-800 text-rose-800 dark:text-rose-200'
              : 'bg-gray-200 dark:bg-gray-600 text-gray-600 dark:text-gray-300'
      }`}>
        SMC-R2
      </span>
                    {higherSMCAnalysis?.smcR2?.eligible && <CheckCircle className="w-4 h-4 text-green-500" />}
                  </div>
                  <div className="text-lg font-bold text-gray-900 dark:text-white">
                    {higherSMCAnalysis?.smcR2?.eligible
                        ? `$${higherSMCAnalysis.smcR2.monthlyAmount.toFixed(2)}/mo`
                        : 'Not Eligible'
                    }
                  </div>
                  <div className="text-xs text-gray-600 dark:text-gray-400">
                    Nursing home level
                  </div>
                </div>

                {/* SMC-T Card */}
                <div className={`p-4 rounded-lg border-2 ${
                    higherSMCAnalysis?.smcT?.eligible
                        ? 'bg-orange-50 dark:bg-orange-900/20 border-orange-300 dark:border-orange-700'
                        : 'bg-gray-50 dark:bg-gray-700/30 border-gray-200 dark:border-gray-600'
                }`}>
                  <div className="flex items-center gap-2 mb-2">
      <span className={`px-2 py-0.5 rounded text-xs font-bold ${
          higherSMCAnalysis?.smcT?.eligible
              ? 'bg-orange-200 dark:bg-orange-800 text-orange-800 dark:text-orange-200'
              : 'bg-gray-200 dark:bg-gray-600 text-gray-600 dark:text-gray-300'
      }`}>
        SMC-T
      </span>
                    {higherSMCAnalysis?.smcT?.eligible && <CheckCircle className="w-4 h-4 text-green-500" />}
                  </div>
                  <div className="text-lg font-bold text-gray-900 dark:text-white">
                    {higherSMCAnalysis?.smcT?.eligible
                        ? `$${higherSMCAnalysis.smcT.monthlyAmount.toFixed(2)}/mo`
                        : 'Not Eligible'
                    }
                  </div>
                  <div className="text-xs text-gray-600 dark:text-gray-400">
                    TBI-specific A&A
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
                        <span className="font-medium text-gray-900 dark:text-white text-left">
                          SMC-K Analysis (Stackable x3)
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
                  <span className="font-medium text-gray-900 dark:text-white text-left">
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

              {/* SMC-M/N/O Details */}
              <div className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
                <button
                    onClick={() => toggleSection('higherSMC')}
                    className="w-full px-4 py-3 flex items-center justify-between bg-gray-50 dark:bg-gray-700/50 hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-gray-900 dark:text-white text-left">SMC-M/N/O Analysis (Severe Combinations)</span>
                    <span className={`px-2 py-0.5 rounded text-xs ${
                        higherSMCAnalysis?.smcM?.eligible || higherSMCAnalysis?.smcN?.eligible || higherSMCAnalysis?.smcO?.eligible
                            ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300'
                            : 'bg-gray-100 dark:bg-gray-600 text-gray-600 dark:text-gray-300'
                    }`}>
        {higherSMCAnalysis?.smcO?.eligible ? 'SMC-O Eligible' :
            higherSMCAnalysis?.smcN?.eligible ? 'SMC-N Eligible' :
                higherSMCAnalysis?.smcM?.eligible ? 'SMC-M Eligible' : 'Not Eligible'}
      </span>
                  </div>
                  {expandedSections.higherSMC ? <ChevronUp className="w-4 h-4 text-gray-400" /> : <ChevronDown className="w-4 h-4 text-gray-400" />}
                </button>

                {expandedSections.higherSMC && (
                    <div className="px-4 py-3 space-y-4">
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        SMC levels M, N, and O are for veterans with severe combinations of disabilities
                        involving multiple anatomical losses or paralysis.
                      </p>

                      {/* SMC-M */}
                      <div className={`p-3 rounded-lg border ${
                          higherSMCAnalysis?.smcM?.eligible
                              ? 'bg-indigo-50 dark:bg-indigo-900/20 border-indigo-300 dark:border-indigo-700'
                              : 'bg-gray-50 dark:bg-gray-700/30 border-gray-200 dark:border-gray-600'
                      }`}>
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-indigo-600 dark:text-indigo-400">SMC-M</span>
                            <span className="text-sm text-gray-600 dark:text-gray-400">${SMC_RATES_2026.M.veteran_alone.toFixed(2)}/mo</span>
                          </div>
                          {higherSMCAnalysis?.smcM?.eligible && <CheckCircle className="w-5 h-5 text-green-500" />}
                        </div>
                        <p className="text-xs text-gray-600 dark:text-gray-400 mb-2">Qualifies for:</p>
                        <ul className="text-xs text-gray-600 dark:text-gray-400 list-disc list-inside">
                          <li>Loss of both hands</li>
                          <li>One hand + one leg near hip preventing prosthesis</li>
                          <li>Blindness (5/200) + deafness</li>
                          <li>Blindness (5/200) + hand or foot loss</li>
                        </ul>
                        {higherSMCAnalysis?.smcM?.eligible && (
                            <div className="mt-2 p-2 bg-green-100 dark:bg-green-900/30 rounded">
                              <p className="text-sm text-green-700 dark:text-green-300">{higherSMCAnalysis.smcM.reason}</p>
                            </div>
                        )}
                      </div>

                      {/* SMC-N */}
                      <div className={`p-3 rounded-lg border ${
                          higherSMCAnalysis?.smcN?.eligible
                              ? 'bg-violet-50 dark:bg-violet-900/20 border-violet-300 dark:border-violet-700'
                              : 'bg-gray-50 dark:bg-gray-700/30 border-gray-200 dark:border-gray-600'
                      }`}>
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-violet-600 dark:text-violet-400">SMC-N</span>
                            <span className="text-sm text-gray-600 dark:text-gray-400">${SMC_RATES_2026.N.veteran_alone.toFixed(2)}/mo</span>
                          </div>
                          {higherSMCAnalysis?.smcN?.eligible && <CheckCircle className="w-5 h-5 text-green-500" />}
                        </div>
                        <p className="text-xs text-gray-600 dark:text-gray-400 mb-2">Qualifies for:</p>
                        <ul className="text-xs text-gray-600 dark:text-gray-400 list-disc list-inside">
                          <li>Loss of both arms above elbow</li>
                          <li>Loss of both legs above knee</li>
                          <li>Blindness (light perception) + hand + foot loss</li>
                        </ul>
                        {higherSMCAnalysis?.smcN?.eligible && (
                            <div className="mt-2 p-2 bg-green-100 dark:bg-green-900/30 rounded">
                              <p className="text-sm text-green-700 dark:text-green-300">{higherSMCAnalysis.smcN.reason}</p>
                            </div>
                        )}
                      </div>

                      {/* SMC-O */}
                      <div className={`p-3 rounded-lg border ${
                          higherSMCAnalysis?.smcO?.eligible
                              ? 'bg-red-50 dark:bg-red-900/20 border-red-300 dark:border-red-700'
                              : 'bg-gray-50 dark:bg-gray-700/30 border-gray-200 dark:border-gray-600'
                      }`}>
                        <div className="flex flex-wrap items-center gap-2 mb-2">
                          <span className="font-bold text-red-600 dark:text-red-400 whitespace-nowrap">SMC-O</span>
                          <span className="text-sm text-gray-600 dark:text-gray-400 whitespace-nowrap">${SMC_RATES_2026.O.veteran_alone.toFixed(2)}/mo</span>
                          <span className="text-xs bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 px-1.5 py-0.5 rounded whitespace-nowrap">Max Schedular</span>
                          {higherSMCAnalysis?.smcO?.eligible && <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />}
                        </div>
                        <p className="text-xs text-gray-600 dark:text-gray-400 mb-2">Qualifies for:</p>
                        <ul className="text-xs text-gray-600 dark:text-gray-400 list-disc list-inside">
                          <li>Paraplegia with sphincter loss</li>
                          <li>Quadriplegia</li>
                          <li>ALS (Amyotrophic Lateral Sclerosis)</li>
                          <li>Multiple L/M/N level combinations (pyramiding allowed)</li>
                        </ul>
                        {higherSMCAnalysis?.smcO?.eligible && (
                            <div className="mt-2 p-2 bg-green-100 dark:bg-green-900/30 rounded">
                              <p className="text-sm text-green-700 dark:text-green-300">{higherSMCAnalysis.smcO.reason}</p>
                            </div>
                        )}
                        <p className="text-xs text-amber-600 dark:text-amber-400 mt-2">
                          ⚠️ SMC-K is NOT paid with SMC-O
                        </p>
                      </div>
                    </div>
                )}
              </div>

              {/* SMC-R/T Details */}
              <div className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
                <button
                    onClick={() => toggleSection('smcRT')}
                    className="w-full px-4 py-3 flex items-center justify-between bg-gray-50 dark:bg-gray-700/50 hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-gray-900 dark:text-white text-left">SMC-R/T Analysis (Higher A&A / TBI)</span>
                    <span className={`px-2 py-0.5 rounded text-xs ${
                        higherSMCAnalysis?.smcR1?.eligible || higherSMCAnalysis?.smcR2?.eligible || higherSMCAnalysis?.smcT?.eligible
                            ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300'
                            : 'bg-gray-100 dark:bg-gray-600 text-gray-600 dark:text-gray-300'
                    }`}>
        {higherSMCAnalysis?.smcR2?.eligible ? 'SMC-R2 Eligible' :
            higherSMCAnalysis?.smcT?.eligible ? 'SMC-T Eligible' :
                higherSMCAnalysis?.smcR1?.eligible ? 'SMC-R1 Eligible' : 'Not Eligible'}
      </span>
                  </div>
                  {expandedSections.smcRT ? <ChevronUp className="w-4 h-4 text-gray-400" /> : <ChevronDown className="w-4 h-4 text-gray-400" />}
                </button>

                {expandedSections.smcRT && (
                    <div className="px-4 py-3 space-y-4">
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        SMC-R and SMC-T are the highest SMC levels, for veterans requiring the most intensive care.
                      </p>

                      {/* SMC-R1 */}
                      <div className={`p-3 rounded-lg border ${
                          higherSMCAnalysis?.smcR1?.eligible
                              ? 'bg-rose-50 dark:bg-rose-900/20 border-rose-300 dark:border-rose-700'
                              : 'bg-gray-50 dark:bg-gray-700/30 border-gray-200 dark:border-gray-600'
                      }`}>
                        <div className="flex flex-wrap items-center gap-2 mb-2">
                          <span className="font-bold text-rose-600 dark:text-rose-400 whitespace-nowrap">SMC-R1</span>
                          <span className="text-sm text-gray-600 dark:text-gray-400 whitespace-nowrap">${SMC_RATES_2026.R1.veteran_alone.toFixed(2)}/mo</span>
                          {higherSMCAnalysis?.smcR1?.eligible && <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />}
                        </div>
                        <p className="text-xs text-gray-600 dark:text-gray-400">
                          Requires SMC-O or SMC-P eligibility PLUS need for Aid & Attendance based on a SEPARATE disability.
                        </p>
                        {higherSMCAnalysis?.smcR1?.eligible && (
                            <div className="mt-2 p-2 bg-green-100 dark:bg-green-900/30 rounded">
                              <p className="text-sm text-green-700 dark:text-green-300">{higherSMCAnalysis.smcR1.reason}</p>
                            </div>
                        )}
                      </div>

                      {/* SMC-R2 */}
                      <div className={`p-3 rounded-lg border ${
                          higherSMCAnalysis?.smcR2?.eligible
                              ? 'bg-rose-50 dark:bg-rose-900/20 border-rose-300 dark:border-rose-700'
                              : 'bg-gray-50 dark:bg-gray-700/30 border-gray-200 dark:border-gray-600'
                      }`}>
                        <div className="flex flex-wrap items-center gap-2 mb-2">
                          <span className="font-bold text-rose-600 dark:text-rose-400 whitespace-nowrap">SMC-R2</span>
                          <span className="text-sm text-gray-600 dark:text-gray-400 whitespace-nowrap">${SMC_RATES_2026.R2.veteran_alone.toFixed(2)}/mo</span>
                          <span className="text-xs bg-rose-100 dark:bg-rose-900/30 text-rose-700 dark:text-rose-300 px-1.5 py-0.5 rounded whitespace-nowrap">Highest</span>
                          {higherSMCAnalysis?.smcR2?.eligible && <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />}
                        </div>
                        <p className="text-xs text-gray-600 dark:text-gray-400">
                          Requires SMC-R1 eligibility PLUS need for nursing home level care (would require hospitalization without personal healthcare services).
                        </p>
                        {higherSMCAnalysis?.smcR2?.eligible && (
                            <div className="mt-2 p-2 bg-green-100 dark:bg-green-900/30 rounded">
                              <p className="text-sm text-green-700 dark:text-green-300">{higherSMCAnalysis.smcR2.reason}</p>
                            </div>
                        )}
                      </div>

                      {/* SMC-T */}
                      <div className={`p-3 rounded-lg border ${
                          higherSMCAnalysis?.smcT?.eligible
                              ? 'bg-orange-50 dark:bg-orange-900/20 border-orange-300 dark:border-orange-700'
                              : 'bg-gray-50 dark:bg-gray-700/30 border-gray-200 dark:border-gray-600'
                      }`}>
                        <div className="flex flex-wrap items-center gap-2 mb-2">
                          <span className="font-bold text-orange-600 dark:text-orange-400 whitespace-nowrap">SMC-T</span>
                          <span className="text-sm text-gray-600 dark:text-gray-400 whitespace-nowrap">${SMC_RATES_2026.T.veteran_alone.toFixed(2)}/mo</span>
                          <span className="text-xs bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300 px-1.5 py-0.5 rounded whitespace-nowrap">TBI</span>
                          {higherSMCAnalysis?.smcT?.eligible && <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />}
                        </div>
                        <p className="text-xs text-gray-600 dark:text-gray-400">
                          Requires TBI (DC 8045) rated at 100% PLUS need for Aid & Attendance specifically due to TBI residuals.
                        </p>
                        {higherSMCAnalysis?.smcT?.eligible && (
                            <div className="mt-2 p-2 bg-green-100 dark:bg-green-900/30 rounded">
                              <p className="text-sm text-green-700 dark:text-green-300">{higherSMCAnalysis.smcT.reason}</p>
                            </div>
                        )}
                        <p className="text-xs text-amber-600 dark:text-amber-400 mt-2">
                          ⚠️ SMC-K is NOT paid with SMC-T
                        </p>
                      </div>
                    </div>
                )}
              </div>

              {/* 2026 Rates Reference */}
              <div className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
                <button
                    onClick={() => toggleSection('rates')}
                    className="w-full px-4 py-3 flex items-center justify-between bg-gray-50 dark:bg-gray-700/50 hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-gray-900 dark:text-white text-left">2026 SMC Rates Reference</span>
                    <span className="text-xs bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 px-2 py-0.5 rounded">
        Effective Dec 1, 2025
      </span>
                  </div>
                  {expandedSections.rates ? <ChevronUp className="w-4 h-4 text-gray-400" /> : <ChevronDown className="w-4 h-4 text-gray-400" />}
                </button>

                {expandedSections.rates && (
                    <div className="px-4 py-3">
                      <table className="w-full text-sm">
                        <thead>
                        <tr className="border-b border-gray-200 dark:border-gray-700">
                          <th className="text-left py-2 text-gray-700 dark:text-gray-300 w-20">Level</th>
                          <th className="text-right py-2 text-gray-700 dark:text-gray-300 w-24">Rate</th>
                          <th className="text-left py-2 text-gray-700 dark:text-gray-300 pl-3">Description</th>
                        </tr>
                        </thead>
                        <tbody className="text-gray-600 dark:text-gray-400">
                        <tr className="border-b border-gray-100 dark:border-gray-800">
                          <td className="py-1.5 font-medium text-amber-600 dark:text-amber-400 whitespace-nowrap">SMC-K</td>
                          <td className="py-1.5 text-right whitespace-nowrap">${SMC_RATES_2026.K.rate.toFixed(2)}</td>
                          <td className="py-1.5 pl-3">Additive (max 3)</td>
                        </tr>
                        <tr className="border-b border-gray-100 dark:border-gray-800">
                          <td className="py-1.5 font-medium text-purple-600 dark:text-purple-400 whitespace-nowrap">SMC-S</td>
                          <td className="py-1.5 text-right whitespace-nowrap">${SMC_RATES_2026.S.veteran_alone.toFixed(2)}</td>
                          <td className="py-1.5 pl-3">Housebound</td>
                        </tr>
                        <tr className="border-b border-gray-100 dark:border-gray-800">
                          <td className="py-1.5 font-medium text-blue-600 dark:text-blue-400 whitespace-nowrap">SMC-L</td>
                          <td className="py-1.5 text-right whitespace-nowrap">${SMC_RATES_2026.L.veteran_alone.toFixed(2)}</td>
                          <td className="py-1.5 pl-3">Basic A&A</td>
                        </tr>
                        <tr className="border-b border-gray-100 dark:border-gray-800">
                          <td className="py-1.5 font-medium text-blue-600 dark:text-blue-400 whitespace-nowrap">SMC-L½</td>
                          <td className="py-1.5 text-right whitespace-nowrap">${SMC_RATES_2026.L_HALF.veteran_alone.toFixed(2)}</td>
                          <td className="py-1.5 pl-3">L + ½ to M</td>
                        </tr>
                        <tr className="border-b border-gray-100 dark:border-gray-800">
                          <td className="py-1.5 font-medium text-indigo-600 dark:text-indigo-400 whitespace-nowrap">SMC-M</td>
                          <td className="py-1.5 text-right whitespace-nowrap">${SMC_RATES_2026.M.veteran_alone.toFixed(2)}</td>
                          <td className="py-1.5 pl-3">Severe combo</td>
                        </tr>
                        <tr className="border-b border-gray-100 dark:border-gray-800">
                          <td className="py-1.5 font-medium text-indigo-600 dark:text-indigo-400 whitespace-nowrap">SMC-M½</td>
                          <td className="py-1.5 text-right whitespace-nowrap">${SMC_RATES_2026.M_HALF.veteran_alone.toFixed(2)}</td>
                          <td className="py-1.5 pl-3">M + ½ to N</td>
                        </tr>
                        <tr className="border-b border-gray-100 dark:border-gray-800">
                          <td className="py-1.5 font-medium text-violet-600 dark:text-violet-400 whitespace-nowrap">SMC-N</td>
                          <td className="py-1.5 text-right whitespace-nowrap">${SMC_RATES_2026.N.veteran_alone.toFixed(2)}</td>
                          <td className="py-1.5 pl-3">Most severe</td>
                        </tr>
                        <tr className="border-b border-gray-100 dark:border-gray-800">
                          <td className="py-1.5 font-medium text-violet-600 dark:text-violet-400 whitespace-nowrap">SMC-N½</td>
                          <td className="py-1.5 text-right whitespace-nowrap">${SMC_RATES_2026.N_HALF.veteran_alone.toFixed(2)}</td>
                          <td className="py-1.5 pl-3">N + ½ to O</td>
                        </tr>
                        <tr className="border-b border-gray-100 dark:border-gray-800 bg-red-50 dark:bg-red-900/10">
                          <td className="py-1.5 font-medium text-red-600 dark:text-red-400 whitespace-nowrap">SMC-O</td>
                          <td className="py-1.5 text-right whitespace-nowrap">${SMC_RATES_2026.O.veteran_alone.toFixed(2)}</td>
                          <td className="py-1.5 pl-3">Max schedular</td>
                        </tr>
                        <tr className="border-b border-gray-100 dark:border-gray-800">
                          <td className="py-1.5 font-medium text-rose-600 dark:text-rose-400 whitespace-nowrap">SMC-R1</td>
                          <td className="py-1.5 text-right whitespace-nowrap">${SMC_RATES_2026.R1.veteran_alone.toFixed(2)}</td>
                          <td className="py-1.5 pl-3">Higher A&A</td>
                        </tr>
                        <tr className="border-b border-gray-100 dark:border-gray-800 bg-rose-50 dark:bg-rose-900/10">
                          <td className="py-1.5 font-medium text-rose-600 dark:text-rose-400 whitespace-nowrap">SMC-R2</td>
                          <td className="py-1.5 text-right whitespace-nowrap">${SMC_RATES_2026.R2.veteran_alone.toFixed(2)}</td>
                          <td className="py-1.5 pl-3">Nursing level</td>
                        </tr>
                        <tr>
                          <td className="py-1.5 font-medium text-orange-600 dark:text-orange-400 whitespace-nowrap">SMC-T</td>
                          <td className="py-1.5 text-right whitespace-nowrap">${SMC_RATES_2026.T.veteran_alone.toFixed(2)}</td>
                          <td className="py-1.5 pl-3">TBI A&A</td>
                        </tr>
                        </tbody>
                      </table>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-3">
                        Veteran alone rates. 2.8% COLA effective Dec 1, 2025.
                      </p>
                    </div>
                )}
              </div>

              {/* ADL / Aid & Attendance Details */}
              <div className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
                <button
                    onClick={() => toggleSection('adl')}
                    className="w-full px-4 py-3 flex items-center justify-between bg-gray-50 dark:bg-gray-700/50 hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  <div className="flex items-center gap-2">
                <span className="font-medium text-gray-900 dark:text-white text-left">
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
                    <span><strong>SMC-S:</strong> File for increase if you have 100% for one condition. Request "Housebound" status.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-blue-500 mt-0.5">•</span>
                    <span><strong>SMC-L/R (A&A):</strong> Submit VA Form 21-2680 completed by your physician.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-blue-500 mt-0.5">•</span>
                    <span><strong>SMC-M/N/O:</strong> These are typically granted based on documented anatomical losses. Ensure all losses are service-connected.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-blue-500 mt-0.5">•</span>
                    <span><strong>SMC-T:</strong> File VA Form 21-2680 noting TBI as the basis for A&A needs.</span>
                  </li>
                </ul>
              </div>

              {/* Disclaimer */}
              <div className="bg-gray-100 dark:bg-gray-700/50 rounded-lg p-3 text-xs text-gray-600 dark:text-gray-400">
                <strong>Important:</strong> SMC eligibility analysis is based on 38 CFR § 3.350 and 38 U.S.C. § 1114.
                This is for documentation guidance only. The VA makes all final SMC determinations.
                Rates shown are 2026 rates effective December 1, 2025. Half-step amounts (L½, M½, N½) are for
                veterans who meet criteria between two levels.
              </div>
            </div>
        )}
      </div>
  );
};

export default SMCCalculator;