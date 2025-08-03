import React, { useState } from "react";
import Button from "./Button";

const ConfirmationModal = ({ t, onConfirm, onCancel, message = null }) => {
  const [isDeleting, setIsDeleting] = useState(false);

  const handleConfirm = async () => {
    setIsDeleting(true);

    // Simulate loading for 0.5 seconds
    await new Promise((resolve) => setTimeout(resolve, 500));

    try {
      await onConfirm();
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="overlay fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg w-full max-w-md">
        <h2 className="text-xl font-semibold mb-4">
          {t("confirm_delete_title_key")}
        </h2>
        <p className="mb-6">{message || t("confirm_delete_message_key")}</p>
        <div className="flex justify-end space-x-3">
          <Button variant="outlined" onClick={onCancel} disabled={isDeleting}>
            {t("cancel_key")}
          </Button>
          <Button onClick={handleConfirm} loading={isDeleting}>
            {t("confirm_key")}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationModal;
