import VoidingDysfunctionRatingCard from './VoidingDysfunctionRatingCard';

export default function ProstateConditionsRatingCard({ analysis }) {
  return (
      <VoidingDysfunctionRatingCard
          analysis={analysis}
          conditionName="Prostate Conditions (BPH, Prostatitis)"
          diagnosticCode="7527"
      />
  );
}