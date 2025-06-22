import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { FaCheckCircle } from "react-icons/fa";
import ImageModal from "./ImageModal";
import moment from "moment/moment";
import { useUserData } from "../../../hooks/useUserData";
import { toast } from "sonner";
import DataGrid from "../../DataGrid";
import { useInferences } from "../../../hooks/useInferences";
import { FiTrash2 } from "react-icons/fi";
import ConfirmationModal from "../../ConfirmationModal";

export default function LogsSection() {
  const {
    getInferencesData,
    deleteInferenceMutation,
    updateInferenceVerifyMutation,
  } = useInferences();

  const { t } = useTranslation();
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [inferenceToDelete, setInferenceToDelete] = useState(null);

  const { user } = useUserData();
  const isAdmin = user?.is_org_admin;
  const isSuperUser =
    Array.isArray(user?.roles) && user.roles[0]?.name === "superuser";
  const { data, isLoading, isError, error } = getInferencesData(page, pageSize);

  const verifyMutation = updateInferenceVerifyMutation();
  const deleteMutation = deleteInferenceMutation();

  const handleConfirmDelete = async () => {
    if (!inferenceToDelete) return;
    try {
      await deleteMutation.mutateAsync(inferenceToDelete);
      toast.success(t("inference_deleted_successfully_key"));
    } catch (err) {
      console.error(err);
    } finally {
      setInferenceToDelete(null);
    }
  };
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
    ...(isAdmin || isSuperUser
      ? [
          {
            field: "approved",
            headerName: t("verify_key"),
            cellRenderer: (params) => (
              <span
                className="cursor-pointer"
                onClick={() => verifyMutation.mutate(params.data.id)}
                title={t("approved_key")}
              >
                <FaCheckCircle
                  color={params.data.approved ? "green" : "gray"}
                  size={18}
                />
              </span>
            ),
          },
        ]
      : []),
    ...(isSuperUser
      ? [
          {
            field: "actions",
            headerName: t("actions_key"),
            flex: 1,
            minWidth: 150,
            cellRenderer: (params) => (
              <div className="flex items-center">
                {/* <button
                  onClick={() => onEdit(params.data.id)}
                  className="p-2 hover:bg-gray-50 rounded-full transition-colors cursor-pointer text-gray-500"
                  title={t("edit_key")}
                >
                  <FiEdit size={20} />
                </button> */}
                <button
                  onClick={() => setInferenceToDelete(params.data.id)}
                  className="p-2 hover:bg-gray-50 rounded-full transition-colors cursor-pointer text-gray-500"
                  title={t("delete_key")}
                >
                  <FiTrash2 size={20} />
                </button>
              </div>
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
      {inferenceToDelete && (
        <ConfirmationModal
          t={t}
          onConfirm={handleConfirmDelete}
          onCancel={() => setInferenceToDelete(null)}
        />
      )}
    </div>
  );
}
