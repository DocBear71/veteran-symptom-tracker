// ChronicCystitisRatingCard.jsx
import VoidingDysfunctionRatingCard from './VoidingDysfunctionRatingCard';

export default function ChronicCystitisRatingCard({ analysis }) {
  return (
      <VoidingDysfunctionRatingCard
          analysis={analysis}
          conditionName="Chronic Cystitis (Bladder Infection/Inflammation)"
          diagnosticCode="7512"
      />
  );
}