import { useState } from "react";
import OrganizationForm from "./OrganizationForm";
import Modal from "../../../Modal";
import OrganizationTable from "./OrganizationTable";
import { useTranslation } from "react-i18next";

const AdminOrganizations = () => {
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
      <OrganizationTable t={t} onAdd={handleAdd} onEdit={handleEdit} />
      {showForm && (
        <Modal
          isOpen={showForm}
          title={selectedId ? t("edit_key") : t("add_organization_key")}
          onClose={() => setShowForm(false)}
        >
          <OrganizationForm
            t={t}
            organizationId={selectedId}
            onSuccess={() => setShowForm(false)}
            onClose={() => setShowForm(false)}
          />
        </Modal>
      )}
    </div>
  );
};

export default AdminOrganizations;
