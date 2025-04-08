// components/modals/ConfirmationModal.jsx
import React from "react";
import Button from "./Button";

const ConfirmationModal = ({
  title,
  message,
  onConfirm,
  onCancel,
  loading,
}) => {
  return (
    <div className="overlay">
      <div className="bg-white p-6 rounded-lg w-full max-w-md">
        <h2 className="text-xl font-semibold mb-4">{title}</h2>
        <p className="mb-6">{message}</p>
        <div className="flex justify-end space-x-3">
          <Button variant="outlined" onClick={onCancel} disabled={loading}>
            Cancel
          </Button>
          <Button onClick={onConfirm} loading={loading}>
            Confirm
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationModal;
