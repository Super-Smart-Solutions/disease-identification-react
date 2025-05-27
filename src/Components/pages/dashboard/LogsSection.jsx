import React, { useState, useCallback } from "react";
import { useTranslation } from "react-i18next";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { FaCheckCircle } from "react-icons/fa";
import {
  getInferences,
  updateInferenceVerify,
} from "../../../api/inferenceAPI";
import { fetchDiseases } from "../../../api/diseaseAPI";
import { fetchPlants } from "../../../api/plantAPI";
import ImageModal from "./ImageModal";
import { getStatusTranslation } from "../../../utils/statusTranslations";
import moment from "moment/moment";
import { useUserData } from "../../../hooks/useUserData";
import { toast } from "sonner";
import DataGrid from "../../DataGrid";
import { useInferences } from "../../../hooks/useInferences";

export default function LogsSection() {
  const queryClient = useQueryClient();
  const { t, i18n } = useTranslation();
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const { user } = useUserData();
  const isAdmin = user?.is_org_admin;

  const { data, isLoading, isError, error } = useInferences(page, pageSize);

  const verifyMutation = useMutation({
    mutationFn: async ({ id }) => {
      // Assuming you have an API function called `updateInferenceVerify`
      return await updateInferenceVerify(id);
    },
    onSuccess: (variables) => {
      // Update the specific inference in the cache
      queryClient.setQueryData(
        ["logs", page, pageSize, i18n.language],
        (oldData) => {
          if (!oldData) return oldData;
          return {
            ...oldData,
            items: oldData.items.map((log) =>
              log.id === variables.id
                ? { ...log, approved: variables.approved }
                : log
            ),
          };
        }
      );
    },
    onError: (error) => {
      toast.error(error);
    },
  });
  const handleVerify = (id) => {
    verifyMutation.mutate({ id });
  };
  console.log(data);

  const columnDefs = [
    { field: "id", headerName: "#", flex: 0.5 },
    {
      field: "plant_name",
      headerName: t("plant_key"),
      flex: 1,
    },
    { field: "disease_name", headerName: t("disease_key"), flex: 1 },
    {
      field: "status_text",
      headerName: t("status_key"),
      flex: 2,
    },
    {
      field: "image_id",
      headerName: t("image_key"),
      cellRenderer: (params) => <ImageModal id={params?.data?.image_id} />,
      flex: 0.5,
    },
    {
      field: "attention_map_url",
      headerName: t("attention_map_key"),
      cellRenderer: (params) => <ImageModal url={params?.value} />,
      flex: 1,
    },
    {
      field: "created_at",
      headerName: t("created_at_key"),
      valueFormatter: ({ value }) =>
        value && moment(value).format("YYYY-MM-DD"),
    },
    ...(isAdmin
      ? [
          {
            field: "approved",
            headerName: t("verify_key"),
            cellRenderer: (params) => (
              <span
                className="cursor-pointer"
                onClick={() => handleVerify(params?.data?.id)}
                title={t("remove_user_key")}
              >
                <FaCheckCircle
                  color={params?.value ? "green" : "gray"}
                  size={18}
                />
              </span>
            ),
          },
        ]
      : []),
  ];

  if (error) {
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
