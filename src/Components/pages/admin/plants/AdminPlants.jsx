import { useState } from "react";
import PlantForm from "./PlantForm";
import Modal from "../../../Modal";
import PlantTable from "./PlantTable";
import { useTranslation } from "react-i18next";

const AdminPlants = () => {
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
      <PlantTable t={t} onAdd={handleAdd} onEdit={handleEdit} />
      {showForm && (
        <Modal
          isOpen={showForm}
          title={selectedId ? t("edit_key") : t("add_plant_key")}
          onClose={() => setShowForm(false)}
        >
          <PlantForm
            t={t}
            plantId={selectedId}
            onSuccess={() => setShowForm(false)}
            onClose={() => setShowForm(false)}
          />
        </Modal>
      )}
    </div>
  );
};

export default AdminPlants;
