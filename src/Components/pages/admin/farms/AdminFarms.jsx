import { useState } from "react";
import FarmForm from "./FarmForm";
import Modal from "../../../Modal";
import FarmTable from "./FarmTable";
import { useTranslation } from "react-i18next";

const AdminFarms = () => {
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
      <FarmTable t={t} onAdd={handleAdd} onEdit={handleEdit} />
      {showForm && (
        <Modal
          isOpen={showForm}
          title={selectedId ? t("edit_key") : t("add_farm_key")}
          onClose={() => setShowForm(false)}
        >
          <FarmForm
            t={t}
            farmId={selectedId}
            onSuccess={() => setShowForm(false)}
            onClose={() => setShowForm(false)}
          />
        </Modal>
      )}
    </div>
  );
};

export default AdminFarms;
