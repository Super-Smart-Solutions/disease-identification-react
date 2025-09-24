import { useMemo } from 'react';
import questionsMap from '../utils/diagnosticQuestions.json';

// Usage: const questions = useDiagnosticQuestions({ plant_id, t, diseaseId });
// Returns array of translated questions in deterministic order
export const useDiagnosticQuestions = ({ plant_id, t, diseaseId = null }) => {
  return useMemo(() => {
    if (!plant_id) return [];
    const plantKey = String(plant_id);
    const plantEntry = questionsMap[plantKey];
    if (!plantEntry) return [];

    // If diseaseId provided and exists, use it; otherwise merge all questions for plant (sorted by disease key)
    if (diseaseId && plantEntry[String(diseaseId)]) {
      const list = plantEntry[String(diseaseId)] || [];
      return list.map((k) => t(k));
    }

    // Merge across all disease sections for this plant in ascending key order for stability
    const merged = Object.keys(plantEntry)
      .sort((a, b) => Number(a) - Number(b))
      .flatMap((dk) => plantEntry[dk] || []);

    return merged.map((k) => t(k));
  }, [plant_id, t, diseaseId]);
};

// Usage: const items = useDiagnosticQuestionItems({ plant_id, t, diseaseId });
// Returns array of { key, label } with stable translation keys to associate answers dynamically
export const useDiagnosticQuestionItems = ({ plant_id, t, diseaseId = null }) => {
  return useMemo(() => {
    if (!plant_id) return [];
    const plantKey = String(plant_id);
    const plantEntry = questionsMap[plantKey];
    if (!plantEntry) return [];

    const keys = diseaseId && plantEntry[String(diseaseId)]
      ? [...(plantEntry[String(diseaseId)] || [])]
      : Object.keys(plantEntry)
          .sort((a, b) => Number(a) - Number(b))
          .flatMap((dk) => plantEntry[dk] || []);

    return keys.map((key) => ({ key, label: t(key) }));
  }, [plant_id, t, diseaseId]);
};