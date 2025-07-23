import React from "react";

export const DiseaseOptionLabel = ({
  label,
  scientificName,
  arabicName,
  t,
  language,
}) => (
  <div className="disease-option">
    <div className="font-medium">{label}</div>
    {scientificName && (
      <div className="text-sm">
        {t("scientific_name_key")}: {scientificName}
      </div>
    )}
    {arabicName && language !== "ar" && (
      <div className="text-sm">
        {t("arabic_name_key")}: {arabicName}
      </div>
    )}
  </div>
);
