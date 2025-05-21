import { useState } from "react";
import DiseaseForm from "./DiseaseForm";
import Modal from "../../../Modal";
import DiseaseTable from "./DiseaseTable";
import { useTranslation } from "react-i18next";

const AdminDiseases = () => {
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
      <DiseaseTable t={t} onAdd={handleAdd} onEdit={handleEdit} />
      {showForm && (
        <Modal
          isOpen={showForm}
          title={selectedId ? t("edit_key") : t("add_disease_key")}
          onClose={() => setShowForm(false)}
        >
          <DiseaseForm
            t={t}
            diseaseId={selectedId}
            onSuccess={() => setShowForm(false)}
            onClose={() => setShowForm(false)}
          />
        </Modal>
      )}
    </div>
  );
};

export default AdminDiseases;
