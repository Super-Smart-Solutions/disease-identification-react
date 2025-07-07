import { useMemo, useState } from "react";
import { toast } from "sonner";
import { FiEdit, FiTrash2 } from "react-icons/fi";
import Button from "../../../Button";
import ConfirmationModal from "../../../ConfirmationModal";
import DataGrid from "../../../../Components/DataGrid";
import { useUsers, useDeleteUser } from "../../../../hooks/useUsers";

const UserTable = ({ onEdit, onAdd, t }) => {
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [userToDelete, setUserToDelete] = useState(null);

  const params = useMemo(() => ({ page, pageSize }), [page, pageSize]);

  const { data: users, isLoading, error } = useUsers(params);

  const deleteUserMutation = useDeleteUser();

  const handleConfirmDelete = async () => {
    if (!userToDelete) return;

    try {
      await deleteUserMutation.mutateAsync(userToDelete);
      toast.success(t("user_deleted_successfully_key"));
    } catch (err) {
      toast.error(t("delete_failed_key"));
    } finally {
      setUserToDelete(null);
    }
  };

  if (error) return <div>Error loading users</div>;

  const columnDefs = [
    {
      field: "email",
      headerName: t("email_key"),
      flex: 2,
    },
    {
      field: "first_name",
      headerName: t("first_name_key"),
      flex: 1,
    },
    {
      field: "last_name",
      headerName: t("last_name_key"),
      flex: 1,
    },
    {
      field: "phone_number",
      headerName: t("phone_number_key"),
      flex: 1,
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
            onClick={() => setUserToDelete(params.data.id)}
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
            {t("add_user_key")}
          </Button>
        }
        rowData={users?.items || []}
        colDefs={columnDefs}
        title={t("users_key")}
        pagination={true}
        currentPage={page}
        pageSize={pageSize}
        totalItems={users?.total || 0}
        totalPages={users?.pages || 1}
        onPageChange={setPage}
        onPageSizeChange={setPageSize}
        loading={isLoading}
      />

      {userToDelete && (
        <ConfirmationModal
          t={t}
          onConfirm={handleConfirmDelete}
          onCancel={() => setUserToDelete(null)}
        />
      )}
    </>
  );
};

export default UserTable;
