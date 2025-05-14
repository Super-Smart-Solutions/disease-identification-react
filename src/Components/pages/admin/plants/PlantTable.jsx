import { useMemo, useState } from "react";
import { toast } from "react-toastify";
import { usePlants, useDeletePlant } from "../../../../hooks/usePlants";
import { useTranslation } from "react-i18next";
import DataGrid from "../../../../components/DataGrid";
import { FiEdit, FiTrash2 } from "react-icons/fi";
import Button from "../../../Button";
import ConfirmationModal from "../../../ConfirmationModal";

const PlantTable = ({ onEdit, onAdd, t }) => {
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [plantToDelete, setPlantToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const params = useMemo(() => ({ page, pageSize }), [page, pageSize]);

  const { data: plants, isLoading, error } = usePlants(params);

  const deletePlant = useDeletePlant();

  const handleConfirmDelete = async () => {
    setIsDeleting(true);
    try {
      await deletePlant.mutateAsync(plantToDelete);
      toast.success(t("plant_deleted_successfully_key"));
    } catch (err) {
      toast.error(t("delete_failed_key"));
    } finally {
      setIsDeleting(false);
      setPlantToDelete(null);
    }
  };

  if (isLoading) return <div>Loading plants...</div>;
  if (error) return <div>Error loading plants</div>;

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
            onClick={() => setPlantToDelete(params.data.id)}
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
            {t("add_plant_key")}
          </Button>
        }
        rowData={plants?.items || []}
        colDefs={columnDefs}
        title={t("plants_key")}
        pagination={true}
        currentPage={page}
        pageSize={pageSize}
        totalItems={plants?.total || 0}
        totalPages={plants?.pages || 1}
        onPageChange={setPage}
        onPageSizeChange={setPageSize}
      />
      {plantToDelete && (
        <ConfirmationModal
          t={t}
          onConfirm={handleConfirmDelete}
          onCancel={() => {
            setPlantToDelete(null);
          }}
        />
      )}
    </>
  );
};

export default PlantTable;
