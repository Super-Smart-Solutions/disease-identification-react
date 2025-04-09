import React, { useState, useCallback } from "react";
import { useTranslation } from "react-i18next";
import { useQuery } from "@tanstack/react-query";
import DataGrid from "../../DataGrid";
import { getInferences } from "../../../api/inferenceAPI";
import { fetchDiseases } from "../../../api/diseaseAPI";
import { fetchPlants } from "../../../api/plantAPI";
import ImageById from "./ImageById";
import { getStatusTranslation } from "../../../utils/statusTranslations";
import moment from "moment/moment";

export default function LogsSection() {
  const { t, i18n } = useTranslation();
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const fetchLogs = useCallback(async () => {
    const [inferencesData, diseasesData, plantsData] = await Promise.all([
      getInferences({ page, size: pageSize }),
      fetchDiseases(),
      fetchPlants(),
    ]);

    const currentLang = i18n.language;

    const enrichedInferences = inferencesData?.items?.map((inference) => {
      const plant = plantsData?.items?.find((p) => p.id === inference.plant_id);
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
        status_text: getStatusTranslation(inference.status, t),
      };
    });

    return {
      items: enrichedInferences || [],
      total: inferencesData.total,
      pages: inferencesData.pages,
    };
  }, [page, pageSize, i18n.language, t]);

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["logs", page, pageSize, i18n.language],
    queryFn: fetchLogs,
    staleTime: 1000 * 60 * 5, // 5 mins
  });

  const columnDefs = [
    { field: "id", headerName: "#", width: 100 },
    { field: "plant_name", headerName: t("plant_key") },
    { field: "disease_name", headerName: t("disease_key") },
    {
      field: "confidence_level",
      headerName: t("confidence_key"),
      valueFormatter: ({ value }) =>
        value && value > 0 ? `${(value * 100).toFixed(2)}%` : "----",
    },
    {
      field: "status_text",
      headerName: t("status_key"),
    },
    {
      field: "image_id",
      headerName: t("image_key"),
      cellRenderer: (params) => <ImageById id={params?.data?.image_id} />,
    },
    {
      field: "created_at",
      headerName: t("created_at_key"),
      valueFormatter: ({ value }) =>
        value && moment(value).format("YYYY-MM-DD"),
    },
  ];

  if (isError) {
    return (
      <div className="text-red-500">
        {error?.message || t("failed_to_load_logs_key")}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold">{t("inference_logs_key")}</h2>
      </div>
      <DataGrid
        rowData={data?.items || []}
        colDefs={columnDefs}
        loading={isLoading}
        pagination={true}
        currentPage={page}
        pageSize={pageSize}
        totalItems={data?.total}
        totalPages={data?.pages}
        onPageChange={setPage}
        onPageSizeChange={setPageSize}
      />
    </div>
  );
}
