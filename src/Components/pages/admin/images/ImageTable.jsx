import { useMemo, useState } from "react";
import { toast } from "sonner";
import { FiEdit, FiTrash2 } from "react-icons/fi";
import Button from "../../../Button";
import ConfirmationModal from "../../../ConfirmationModal";
import DataGrid from "../../../../Components/DataGrid";
import { useDeleteImage, useImages } from "../../../../hooks/useImages";
import ImageModal from "../../dashboard/ImageModal";

const ImageTable = ({ onEdit, onAdd, t }) => {
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [imageToDelete, setImageToDelete] = useState(null);
  const params = useMemo(() => ({ page, pageSize }), [page, pageSize]);

  const { data: images, isLoading, error } = useImages(params);

  const deleteImage = useDeleteImage();

  const handleConfirmDelete = async () => {
    try {
      await deleteImage.mutateAsync(imageToDelete);
      toast.success(t("image_deleted_successfully_key"));
    } catch (err) {
      toast.error(t("delete_failed_key"));
    } finally {
      setImageToDelete(null);
    }
  };

  if (error) return <div>Error loading images</div>;

  const columnDefs = [
    {
      field: "name",
      headerName: t("name_key"),
      flex: 2,
    },
    {
      field: "image_type",
      headerName: t("image_type_key"),
      flex: 2,
    },
    {
      field: "id",
      headerName: t("image_key"),
      cellRenderer: (params) => <ImageModal id={params?.data?.id} />,
      flex: 0.5,
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
            onClick={() => setImageToDelete(params.data.id)}
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
            {t("add_image_key")}
          </Button>
        }
        rowData={images?.items || []}
        colDefs={columnDefs}
        title={t("images_key")}
        pagination={true}
        currentPage={page}
        pageSize={pageSize}
        totalItems={images?.total || 0}
        totalPages={images?.pages || 1}
        onPageChange={setPage}
        onPageSizeChange={setPageSize}
        loading={isLoading}
      />
      {imageToDelete && (
        <ConfirmationModal
          t={t}
          onConfirm={handleConfirmDelete}
          onCancel={() => {
            setImageToDelete(null);
          }}
        />
      )}
    </>
  );
};

export default ImageTable;
