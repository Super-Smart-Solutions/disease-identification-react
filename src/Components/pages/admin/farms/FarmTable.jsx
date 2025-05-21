import { useMemo, useState } from "react";
import { toast } from "sonner";
import { useFarms, useDeleteFarm } from "../../../../hooks/useFarms.js";
import { FiEdit, FiTrash2 } from "react-icons/fi";
import Button from "../../../Button";
import ConfirmationModal from "../../../ConfirmationModal";
import DataGrid from "../../../../Components/DataGrid";

const FarmTable = ({ onEdit, onAdd, t }) => {
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [farmToDelete, setFarmToDelete] = useState(null);
  const params = useMemo(() => ({ page, pageSize }), [page, pageSize]);

  const { data: farms, isLoading, error } = useFarms(params);

  const deleteFarm = useDeleteFarm();

  const handleConfirmDelete = async () => {
    try {
      await deleteFarm.mutateAsync(farmToDelete);
      toast.success(t("farm_deleted_successfully_key"));
    } catch (err) {
      toast.error(t("delete_failed_key"));
    } finally {
      setFarmToDelete(null);
    }
  };

  if (error) return <div>Error loading farms</div>;

  const columnDefs = [
    {
      field: "name",
      headerName: t("name_key"),
      flex: 2,
    },
    {
      field: "location",
      headerName: t("location_key"),
      flex: 2,
    },
    {
      field: "weather",
      headerName: t("weather_key"),
      flex: 2,
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
            onClick={() => setFarmToDelete(params.data.id)}
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
            {t("add_farm_key")}
          </Button>
        }
        rowData={farms?.items || []}
        colDefs={columnDefs}
        title={t("farms_key")}
        pagination={true}
        currentPage={page}
        pageSize={pageSize}
        totalItems={farms?.total || 0}
        totalPages={farms?.pages || 1}
        onPageChange={setPage}
        onPageSizeChange={setPageSize}
        loading={isLoading}
      />
      {farmToDelete && (
        <ConfirmationModal
          t={t}
          onConfirm={handleConfirmDelete}
          onCancel={() => {
            setFarmToDelete(null);
          }}
        />
      )}
    </>
  );
};

export default FarmTable;
