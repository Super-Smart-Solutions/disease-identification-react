import { useMemo, useState } from "react";
import { toast } from "sonner";
import { useDiseases, useDeleteDisease } from "../../../../hooks/useDiseases";
import DataGrid from "../../../../Components/DataGrid";
import { FiEdit, FiTrash2 } from "react-icons/fi";
import Button from "../../../Button";
import ConfirmationModal from "../../../ConfirmationModal";

const dable = ({ onEdit, onAdd, t }) => {
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [diseaseToDelete, setdoDelete] = useState(null);
  const params = useMemo(() => ({ page, pageSize }), [page, pageSize]);

  const { data: diseases, isLoading, error } = useDiseases(params);

  const deleteDisease = useDeleteDisease();

  const handleConfirmDelete = async () => {
    try {
      await deleteDisease.mutateAsync(diseaseToDelete);
      toast.success(t("disease_deleted_successfully_key"));
    } catch (err) {
      toast.error(t("delete_failed_key"));
    } finally {
      setdoDelete(null);
    }
  };

  if (error) return <div>Error loading diseases</div>;

  const columnDefs = [
    {
      field: "english_name",
      headerName: t("english_name_key"),
      flex: 2,
    },
    {
      field: "arabic_name",
      headerName: t("arabic_name_key"),
      flex: 2,
    },
    {
      field: "scientific_name",
      headerName: t("scientific_name_key"),
      flex: 2,
    },
    {
      field: "description",
      headerName: t("description_key"),
      flex: 3,
      cellStyle: { whiteSpace: "normal" },
    },
    {
      field: "actions",
      headerName: t("actions_key"),
      flex: 1,
      minWidth: 150,
      cellRenderer: (params) => (
        <div className="flex items-center">
          <button
            onClick={() => onEdit(params.data.id)}
            className="p-2 hover:bg-gray-50 rounded-full transition-colors cursor-pointer text-gray-500"
            title={t("edit_key")}
          >
            <FiEdit size={20} />
          </button>
          <button
            onClick={() => setdoDelete(params.data.id)}
            className="p-2 hover:bg-gray-50 rounded-full transition-colors cursor-pointer text-gray-500"
            title={t("delete_key")}
          >
            <FiTrash2 size={20} />
          </button>
        </div>
      ),
    },
  ];

  return (
    <>
      <DataGrid
        onAdd={
          <Button variant="outlined" onClick={onAdd}>
            {t("add_disease_key")}
          </Button>
        }
        rowData={diseases?.items || []}
        colDefs={columnDefs}
        title={t("diseases_key")}
        pagination={true}
        currentPage={page}
        pageSize={pageSize}
        totalItems={diseases?.total || 0}
        totalPages={diseases?.pages || 1}
        onPageChange={setPage}
        onPageSizeChange={setPageSize}
        loading={isLoading}
      />
      {diseaseToDelete && (
        <ConfirmationModal
          t={t}
          onConfirm={handleConfirmDelete}
          onCancel={() => {
            setdoDelete(null);
          }}
        />
      )}
    </>
  );
};

export default dable;
