import VoidingDysfunctionRatingCard from './VoidingDysfunctionRatingCard';

/**
 * Urethral Stricture Rating Card - Wrapper for VoidingDysfunctionRatingCard
 * DC 7518 - Rated under Voiding Dysfunction criteria
 */
export default function UrethralStrictureRatingCard({ analysis, expanded, onToggle }) {
  return (
      <VoidingDysfunctionRatingCard
          analysis={analysis}
          expanded={expanded}
          onToggle={onToggle}
          conditionName="Urethral Stricture Disease"
          diagnosticCode="7518"
      />
  );
}