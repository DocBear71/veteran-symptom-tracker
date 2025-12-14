import VoidingDysfunctionRatingCard from './VoidingDysfunctionRatingCard';

export default function NeurogenicBladderRatingCard({ analysis }) {
  return (
      <VoidingDysfunctionRatingCard
          analysis={analysis}
          conditionName="Neurogenic Bladder"
          diagnosticCode="7542"
      />
  );
}