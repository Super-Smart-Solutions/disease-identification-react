import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import moment from "moment/moment";
import { toast } from "sonner";
import DataGrid from "../../DataGrid";
import { FiTrash2 } from "react-icons/fi";
import ConfirmationModal from "../../ConfirmationModal";
import { useReports } from "../../../hooks/useReports";

export default function ReportsSection() {
  const { t } = useTranslation();
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [reportToDelete, setReportToDelete] = useState(null);

  const { data, isLoading, isError, error, removeReport, isDeleting, refetch } =
    useReports({ page, pageSize });

  const handleConfirmDelete = () => {
    if (!reportToDelete) return;

    removeReport(reportToDelete, {
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
          <a
            href={params.value}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 hover:underline"
          >
            {t("view_file_key")}
          </a>
        ) : (
          "-"
        ),
      flex: 1.5,
    },
    {
      field: "date",
      headerName: t("date_key"),
      valueFormatter: ({ value }) =>
        value ? moment(value).format("YYYY-MM-DD") : "-",
      flex: 1,
    },
    {
      field: "actions",
      headerName: t("actions_key"),
      cellRenderer: (params) => (
        <button
          className="text-red-500 hover:text-red-700"
          onClick={() => setReportToDelete(params?.data?.id)}
        >
          <FiTrash2 />
        </button>
      ),
      flex: 0.5,
    },
  ];

//   if (isError) {
//     return (
//       <div className="text-red-500">
//         {error?.message || t("failed_to_load_logs_key")}
//       </div>
//     );
//   }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold">{t("report_logs_key")}</h2>
      </div>
      <DataGrid
        rowData={
          data?.items || [
            {
              id: 1,
              status: "Detected",
              report_type: "Daily",
              file_link: "https://example.com/file1.pdf",
              date: new Date().toISOString(),
            },
            {
              id: 2,
              status: "Pending",
              report_type: "Weekly",
              file_link: "https://example.com/file2.pdf",
              date: new Date().toISOString(),
            },
          ]
        }
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
