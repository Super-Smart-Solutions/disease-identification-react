import { useState } from "react";
import UserForm from "./UserForm";
import Modal from "../../../Modal";
import UserTable from "./UserTable";
import { useTranslation } from "react-i18next";

const AdminUsers = () => {
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
      <UserTable t={t} onAdd={handleAdd} onEdit={handleEdit} />
      {showForm && (
        <Modal
          isOpen={showForm}
          title={t("edit_key")}
          onClose={() => setShowForm(false)}
        >
          <UserForm
            t={t}
            userId={selectedId}
            onSuccess={() => setShowForm(false)}
            onClose={() => setShowForm(false)}
          />
        </Modal>
      )}
    </div>
  );
};

export default AdminUsers;
