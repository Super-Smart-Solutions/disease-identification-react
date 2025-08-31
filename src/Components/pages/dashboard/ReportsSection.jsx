import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import moment from "moment/moment";
import { toast } from "sonner";
import DataGrid from "../../DataGrid";
import { FiTrash2 } from "react-icons/fi";
import ConfirmationModal from "../../ConfirmationModal";
import { useReports, useDeleteReport } from "../../../hooks/useReports";
import Button from "../../Button";

export default function ReportsSection() {
  const { t } = useTranslation();
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [reportToDelete, setReportToDelete] = useState(null);

  const { data, isLoading, isError, error } = useReports({ page, pageSize });

  const { mutate: deleteReport } = useDeleteReport();

  const handleConfirmDelete = () => {
    if (!reportToDelete) return;

    deleteReport(reportToDelete, {
      onSuccess: () => {
        toast.success(t("report_deleted_successfully_key"));
      },
      onError: (err) => {
        console.error(err);
        toast.error(t("failed_to_delete_report_key"));
      },
      onSettled: () => {
        setReportToDelete(null);
      },
    });
  };

  const handleDownload = (url) => {
    window.open(url, "_blank", "noopener,noreferrer");
  };

  const columnDefs = [
    { field: "id", headerName: "#", flex: 0.5 },
    {
      field: "status",
      headerName: t("status_key"),
      flex: 1,
      sortable: true,
    },
    {
      field: "report_type",
      headerName: t("report_type_key"),
      flex: 1,
    },
    {
      field: "file_link",
      headerName: t("file_key"),
      cellRenderer: (params) =>
        params?.value ? (
          <Button
            variant="outlined"
            onClick={() => handleDownload(params.value)}
          >
            {t("show_key")}
          </Button>
        ) : (
          "-"
        ),
      flex: 1.5,
    },
    {
      field: "created_at",
      headerName: t("created_at_key"),
      valueFormatter: ({ value }) =>
        value && moment(value).format("YYYY-MM-DD"),
    },
    {
      field: "actions",
      headerName: t("actions_key"),
      cellRenderer: (params) => (
        <button
          onClick={() => setReportToDelete(params?.data?.id)}
          className="p-2 hover:bg-gray-50 rounded-full transition-colors cursor-pointer text-gray-500"
          title={t("delete_key")}
        >
          <FiTrash2 size={20} />
        </button>
      ),
      flex: 0.5,
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
        <h2 className="text-2xl font-semibold">{t("report_logs_key")}</h2>
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
      {reportToDelete && (
        <ConfirmationModal
          t={t}
          onConfirm={handleConfirmDelete}
          onCancel={() => setReportToDelete(null)}
        />
      )}
    </div>
  );
}
