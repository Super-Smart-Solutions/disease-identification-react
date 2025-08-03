import { useState } from "react";
import ImageForm from "./ImageForm";
import Modal from "../../../Modal";
import ImageTable from "./ImageTable";
import { useTranslation } from "react-i18next";
import ImageReviewer from "./ImageReviewer";

const AdminImages = () => {
  const { t } = useTranslation();
  const [selectedId, setSelectedId] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [showReviewer, setShowReviewer] = useState(false);

  const handleEdit = (id) => {
    setSelectedId(id);
    setShowForm(true);
  };

  const handleAdd = () => {
    setSelectedId(null);
    setShowForm(true);
  };

  const handleReview = () => {
    setShowReviewer(true);
  };

  return (
    <div>
      <ImageTable
        t={t}
        onAdd={handleAdd}
        onEdit={handleEdit}
        onReview={handleReview}
      />
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
      {showReviewer && (
        <Modal
          isOpen={showReviewer}
          title={t("image_reviewer_key")}
          onClose={() => setShowReviewer(false)}
        >
          <ImageReviewer t={t} onClose={() => setShowReviewer(false)} />
        </Modal>
      )}
    </div>
  );
};

export default AdminImages;
