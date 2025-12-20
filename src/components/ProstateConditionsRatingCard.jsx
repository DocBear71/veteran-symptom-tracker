import VoidingDysfunctionRatingCard from './VoidingDysfunctionRatingCard';

/**
 * Neurogenic Bladder Rating Card - Wrapper for VoidingDysfunctionRatingCard
 * DC 7542 - Rated under Voiding Dysfunction criteria
 */
export default function NeurogenicBladderRatingCard({ analysis, expanded, onToggle }) {
  return (
      <VoidingDysfunctionRatingCard
          analysis={analysis}
          expanded={expanded}
          onToggle={onToggle}
          conditionName="Neurogenic Bladder"
          diagnosticCode="7542"
      />
  );
}