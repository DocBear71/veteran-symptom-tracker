import VoidingDysfunctionRatingCard from './VoidingDysfunctionRatingCard';

/**
 * Chronic Cystitis Rating Card - Wrapper for VoidingDysfunctionRatingCard
 * DC 7512 - Rated under Voiding Dysfunction criteria
 */
export default function ChronicCystitisRatingCard({ analysis, expanded, onToggle }) {
  return (
      <VoidingDysfunctionRatingCard
          analysis={analysis}
          expanded={expanded}
          onToggle={onToggle}
          conditionName="Chronic Cystitis (Bladder Infection/Inflammation)"
          diagnosticCode="7512"
      />
  );
}