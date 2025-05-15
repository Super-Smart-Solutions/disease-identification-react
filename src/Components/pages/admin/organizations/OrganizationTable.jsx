import { useMemo, useState } from "react";
import { toast } from "react-toastify";
import {
  useOrganizations,
  useDeleteOrganization,
} from "../../../../hooks/useOrganizations";
import { FiEdit, FiTrash2 } from "react-icons/fi";
import Button from "../../../Button";
import ConfirmationModal from "../../../ConfirmationModal";
import DataGrid from "../../../../Components/DataGrid";

const OrganizationTable = ({ onEdit, onAdd, t }) => {
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [organizationToDelete, setOrganizationToDelete] = useState(null);
  const params = useMemo(() => ({ page, pageSize }), [page, pageSize]);

  const { data: organizations, isLoading, error } = useOrganizations(params);

  const deleteOrganization = useDeleteOrganization();

  const handleConfirmDelete = async () => {
    try {
      await deleteOrganization.mutateAsync(organizationToDelete);
      toast.success(t("organization_deleted_successfully_key"));
    } catch (err) {
      toast.error(t("delete_failed_key"));
    } finally {
      setOrganizationToDelete(null);
    }
  };

  if (error) return <div>Error loading organizations</div>;

  const columnDefs = [
    {
      field: "name",
      headerName: t("name_key"),
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
            disabled={true}
            onClick={() => onEdit(params.data.id)}
            className="p-2 hover:bg-gray-50 rounded-full transition-colors cursor-pointer text-gray-500"
            title={t("edit_key")}
          >
            <FiEdit size={20} />
          </button>
          <button
            onClick={() => setOrganizationToDelete(params.data.id)}
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
            {t("add_organization_key")}
          </Button>
        }
        rowData={organizations?.items || []}
        colDefs={columnDefs}
        title={t("organizations_key")}
        pagination={true}
        currentPage={page}
        pageSize={pageSize}
        totalItems={organizations?.total || 0}
        totalPages={organizations?.pages || 1}
        onPageChange={setPage}
        onPageSizeChange={setPageSize}
        loading={isLoading}
      />
      {organizationToDelete && (
        <ConfirmationModal
          t={t}
          onConfirm={handleConfirmDelete}
          onCancel={() => {
            setOrganizationToDelete(null);
          }}
        />
      )}
    </>
  );
};

export default OrganizationTable;
