// Helpers extracted from WhyTrackThis.jsx for react-refresh compatibility
import { educationalContent, categoryMapping } from '../data/educationalContent';

export const hasEducationalContent = (symptomId) => {
  return !!educationalContent[symptomId];
};

export const getSymptomIdsWithContent = () => {
  return Object.keys(educationalContent).filter(key => !key.startsWith('_'));
};

export const getCategoryMappings = () => {
  return { ...categoryMapping };
};