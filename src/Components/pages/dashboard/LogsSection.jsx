import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import DataGrid from "../../DataGrid";
import Button from "../../Button";
import { getInferences } from "../../../api/inferenceAPI";
import { fetchDiseases } from "../../../api/diseaseAPI";
import { fetchPlants } from "../../../api/plantAPI";
import ImageById from "./ImageById";
import useSavedState from "../../../hooks/UseSavedState";

export default function LogsSection() {
  const { t, i18n } = useTranslation();
  const [inferences, setInferences] = useSavedState([], "inferences");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        const [inferencesData, diseasesData, plantsData] = await Promise.all([
          getInferences(),
          fetchDiseases(),
          fetchPlants(),
        ]);
        const currentLang = i18n.language;
        const enrichedInferences = inferencesData?.items?.map((inference) => {
          const plant = plantsData?.items?.find(
            (p) => p.id === inference.plant_id
          );
          const disease = diseasesData?.items?.find(
            (d) => d.id === inference.disease_id
          );

          return {
            ...inference,
            plant_name: plant
              ? currentLang === "ar"
                ? plant.arabic_name
                : plant.english_name
              : "----",
            disease_name: disease
              ? currentLang === "ar"
                ? disease.arabic_name
                : disease.english_name
              : "----",
          };
        });
        setInferences(enrichedInferences || []);
      } catch (err) {
        setError(err.message || t("failed_to_load_logs_key"));
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [t, i18n.language]);

  const columnDefs = [
    { field: "id", headerName: "#", width: 100 },
    { field: "plant_name", headerName: t("plant_key") },
    { field: "disease_name", headerName: t("disease_key") },
    {
      field: "confidence_level",
      headerName: t("confidence_key"),
      valueFormatter: ({ value }) => {
        if (value && value > 0) {
          return `${(value * 100).toFixed(2)}%`;
        }
        return "----";
      },
    },
    {
      field: "image_id",
      headerName: t("image_key"),
      cellRenderer: (params) => <ImageById id={params?.data?.image_id} />,
    },
  ];

  if (loading && inferences?.length === 0) {
    return (
      <div className="flex justify-center items-center h-40">
        {t("loading_key")}
      </div>
    );
  }

  if (error) {
    return <div className="text-red-500">{error}</div>;
  }
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold">{t("inference_logs_key")}</h2>
      </div>
      <DataGrid rowData={inferences} colDefs={columnDefs} loading={loading} />
    </div>
  );
}
