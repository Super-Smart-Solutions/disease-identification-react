import { useMemo } from "react";

export const useDiseaseOptions = (filteredOptions, language) => {
    return useMemo(() => {
        return filteredOptions.map((disease) => ({
            value: disease.id,
            label:
                language === "ar"
                    ? disease.arabic_name
                    : disease.english_name || "Unnamed Disease",
            scientificName: disease.scientific_name,
            arabicName: disease.arabic_name,
            englishName: disease.english_name,
            symptoms: disease.symptoms,
            description: disease.description,
        }));
    }, [filteredOptions, language]);
};