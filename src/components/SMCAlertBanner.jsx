import React from 'react';
import { useProfile } from '../hooks/useProfile';
import { SMC_RATES_2026 } from '../utils/smcCriteria';

/**
 * SMC Alert Banner Component
 *
 * Displays Special Monthly Compensation eligibility alerts on rating cards
 * for conditions that may qualify for SMC-K, SMC-S, or other SMC levels.
 *
 * @param {Object} props
 * @param {string} props.smcLevel - The SMC level (K, L, S, etc.)
 * @param {string} props.category - The SMC-K category (CREATIVE_ORGAN, EXTREMITY_HAND, etc.)
 * @param {string} props.conditionName - Name of the condition triggering SMC
 * @param {boolean} props.autoGrant - Whether SMC is automatically granted for this condition
 * @param {string} props.note - Additional note about SMC eligibility
 * @param {number} props.currentRating - The current supported rating for the condition
 * @param {number} props.requiredRating - Rating required to trigger SMC (if applicable)
 */
const SMCAlertBanner = ({
                          smcLevel = 'K',
                          category,
                          conditionName,
                          autoGrant = false,
                          note,
                          currentRating,
                          requiredRating,
                          diagnosticCode,
                        }) => {
  const { profile } = useProfile();

  // Only show for veteran profiles
  if (!profile || profile.type !== 'veteran') {
    return null;
  }

  // Check if rating requirement is met (if applicable)
  const meetsRatingRequirement = !requiredRating || currentRating >= requiredRating;

  // Get SMC rate info
  const smcRate = SMC_RATES_2026[smcLevel];
  const monthlyAmount = smcRate?.rate || smcRate?.veteran_alone || 0;

  // Determine alert color based on SMC level
  const getAlertColors = () => {
    switch (smcLevel) {
      case 'K':
        return {
          bg: 'bg-amber-50 dark:bg-amber-900/20',
          border: 'border-amber-300 dark:border-amber-700',
          icon: 'text-amber-600 dark:text-amber-400',
          title: 'text-amber-900 dark:text-amber-100',
          text: 'text-amber-800 dark:text-amber-200',
          badge: 'bg-amber-100 dark:bg-amber-800 text-amber-800 dark:text-amber-200',
        };
      case 'L':
        return {
          bg: 'bg-blue-50 dark:bg-blue-900/20',
          border: 'border-blue-300 dark:border-blue-700',
          icon: 'text-blue-600 dark:text-blue-400',
          title: 'text-blue-900 dark:text-blue-100',
          text: 'text-blue-800 dark:text-blue-200',
          badge: 'bg-blue-100 dark:bg-blue-800 text-blue-800 dark:text-blue-200',
        };
      case 'S':
        return {
          bg: 'bg-purple-50 dark:bg-purple-900/20',
          border: 'border-purple-300 dark:border-purple-700',
          icon: 'text-purple-600 dark:text-purple-400',
          title: 'text-purple-900 dark:text-purple-100',
          text: 'text-purple-800 dark:text-purple-200',
          badge: 'bg-purple-100 dark:bg-purple-800 text-purple-800 dark:text-purple-200',
        };
      default:
        return {
          bg: 'bg-green-50 dark:bg-green-900/20',
          border: 'border-green-300 dark:border-green-700',
          icon: 'text-green-600 dark:text-green-400',
          title: 'text-green-900 dark:text-green-100',
          text: 'text-green-800 dark:text-green-200',
          badge: 'bg-green-100 dark:bg-green-800 text-green-800 dark:text-green-200',
        };
    }
  };

  const colors = getAlertColors();

  // Get category display name
  const getCategoryName = () => {
    switch (category) {
      case 'CREATIVE_ORGAN':
        return 'Loss of Creative Organ';
      case 'EXTREMITY_HAND':
        return 'Loss of Use of Hand';
      case 'EXTREMITY_FOOT':
        return 'Loss of Use of Foot';
      case 'EYE_BLINDNESS':
        return 'Blindness in One Eye';
      case 'DEAFNESS':
        return 'Complete Bilateral Deafness';
      case 'APHONIA':
        return 'Complete Organic Aphonia';
      case 'BUTTOCKS':
        return 'Loss of Use of Both Buttocks';
      case 'BREAST_LOSS':
        return 'Loss of Breast Tissue';
      case 'AID_AND_ATTENDANCE':
        return 'Aid & Attendance Needed';
      default:
        return category;
    }
  };

  // Get SMC level description
  const getSMCDescription = () => {
    switch (smcLevel) {
      case 'K':
        return 'SMC-K is an ADDITIONAL monthly payment on top of your regular VA compensation.';
      case 'L':
        return 'SMC-L provides higher compensation for Aid & Attendance needs or bilateral losses.';
      case 'S':
        return 'SMC-S (Housebound) provides additional compensation for veterans substantially confined to home.';
      default:
        return `SMC-${smcLevel} provides additional compensation for severe disabilities.`;
    }
  };

  return (
      <div className={`${colors.bg} ${colors.border} border-2 rounded-lg p-4 mb-4`}>
        <div className="flex items-start gap-3">
          {/* SMC Badge */}
          <div className={`flex-shrink-0 ${colors.badge} px-2 py-1 rounded-md font-bold text-sm`}>
            SMC-{smcLevel}
          </div>

          <div className="flex-1 min-w-0">
            {/* Title */}
            <h4 className={`font-semibold ${colors.title} mb-1 flex items-center gap-2`}>
              <span>💰</span>
              Special Monthly Compensation Eligible
            </h4>

            {/* Category */}
            <p className={`text-sm ${colors.text} mb-2`}>
              <span className="font-medium">Qualifying Condition:</span> {getCategoryName()}
              {diagnosticCode && <span className="ml-1">(DC {diagnosticCode})</span>}
            </p>

            {/* Monthly Amount */}
            {monthlyAmount > 0 && (
                <div className={`text-sm ${colors.text} mb-2`}>
                  <span className="font-medium">2026 Monthly Rate:</span>{' '}
                  <span className="font-bold">${monthlyAmount.toFixed(2)}</span>
                  {smcLevel === 'K' && (
                      <span className="text-xs ml-1">(added to your regular compensation)</span>
                  )}
                </div>
            )}

            {/* Auto-grant indicator */}
            {autoGrant && meetsRatingRequirement && (
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-green-600 dark:text-green-400">✓</span>
                  <span className={`text-sm font-medium ${colors.text}`}>
                This condition typically qualifies automatically
              </span>
                </div>
            )}

            {/* Rating requirement warning */}
            {requiredRating && !meetsRatingRequirement && (
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-amber-600 dark:text-amber-400">⚠</span>
                  <span className={`text-sm ${colors.text}`}>
                Requires {requiredRating}% rating (current: {currentRating || 0}%)
              </span>
                </div>
            )}

            {/* Note */}
            {note && (
                <p className={`text-xs ${colors.text} italic mt-2`}>
                  ℹ️ {note}
                </p>
            )}

            {/* Description */}
            <p className={`text-xs ${colors.text} mt-2 opacity-80`}>
              {getSMCDescription()}
            </p>

            {/* Action prompt */}
            <div className={`mt-3 pt-2 border-t ${colors.border}`}>
              <p className={`text-xs font-medium ${colors.text}`}>
                📋 <span className="underline">Action:</span> File for SMC-{smcLevel} with your VA claim or as a separate request.
                {smcLevel === 'K' && ' SMC-K can be awarded up to 3 times for different qualifying conditions.'}
              </p>
            </div>
          </div>
        </div>
      </div>
  );
};

/**
 * SMC-K Alert specifically for creative organ conditions
 * Simplified wrapper for common use case
 */
export const SMCKCreativeOrganAlert = ({ conditionName, diagnosticCode, note }) => (
    <SMCAlertBanner
        smcLevel="K"
        category="CREATIVE_ORGAN"
        conditionName={conditionName}
        diagnosticCode={diagnosticCode}
        autoGrant={true}
        note={note || 'All creative organ losses require SMC-K review under 38 CFR § 3.350(a).'}
    />
);

/**
 * SMC-K Alert for aphonia (complete loss of voice)
 * Only shows when rating is 100%
 */
export const SMCKAphoniaAlert = ({ currentRating }) => (
    <SMCAlertBanner
        smcLevel="K"
        category="APHONIA"
        conditionName="Complete Organic Aphonia"
        diagnosticCode="6519"
        autoGrant={true}
        currentRating={currentRating}
        requiredRating={100}
        note="Complete organic aphonia (constant inability to speak above a whisper) qualifies for SMC-K."
    />
);

/**
 * SMC-L Alert for Aid & Attendance conditions
 */
export const SMCLAidAttendanceAlert = ({ conditionName, diagnosticCode, note }) => (
    <SMCAlertBanner
        smcLevel="L"
        category="AID_AND_ATTENDANCE"
        conditionName={conditionName}
        diagnosticCode={diagnosticCode}
        autoGrant={false}
        note={note || 'This condition may qualify for Aid & Attendance benefits. Requires evaluation of daily living needs.'}
    />
);

/**
 * SMC-S Housebound Alert
 */
export const SMCSHouseboundAlert = ({ conditionName, currentRating, additionalRating }) => (
    <SMCAlertBanner
        smcLevel="S"
        category="HOUSEBOUND"
        conditionName={conditionName}
        autoGrant={false}
        note={
          currentRating === 100 && additionalRating >= 60
              ? `You may qualify for SMC-S: 100% for ${conditionName} + ${additionalRating}% additional disabilities.`
              : `SMC-S requires one condition at 100% plus additional disabilities rated 60% or more.`
        }
    />
);

export default SMCAlertBanner;