import { useState } from "react";
import ImageForm from "./ImageForm";
import Modal from "../../../Modal";
import ImageTable from "./ImageTable";
import { useTranslation } from "react-i18next";

const AdminImages = () => {
  const { t } = useTranslation();
  const [selectedId, setSelectedId] = useState(null);
  const [showForm, setShowForm] = useState(false);

  const handleEdit = (id) => {
    setSelectedId(id);
    setShowForm(true);
  };

  const handleAdd = () => {
    setSelectedId(null);
    setShowForm(true);
  };

  return (
    <div>
      <ImageTable t={t} onAdd={handleAdd} onEdit={handleEdit} />
      {showForm && (
        <Modal
          isOpen={showForm}
          title={selectedId ? t("edit_key") : t("add_image_key")}
          onClose={() => setShowForm(false)}
        >
          <ImageForm
            t={t}
            imageId={selectedId}
            onSuccess={() => setShowForm(false)}
            onClose={() => setShowForm(false)}
          />
        </Modal>
      )}
    </div>
  );
};

export default AdminImages;
