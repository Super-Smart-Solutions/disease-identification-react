import React from "react";
import { useTranslation } from "react-i18next";
import { Formik, Form, Field } from "formik";
import { FaEdit, FaSave } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import Button from "../../Button";

// Discard Modal Component
const DiscardModal = ({ isOpen, onConfirm, onCancel }) => {
  const { t } = useTranslation();

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="bg-white rounded-lg p-6 max-w-sm w-full"
            initial={{ scale: 0.8, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.8, y: 20 }}
            transition={{ duration: 0.3 }}
          >
            <h3 className="text-lg font-bold mb-4">{t("discard_changes")}</h3>
            <p className="text-gray-600 mb-6">{t("discard_confirm")}</p>
            <div className="flex justify-end gap-4">
              <Button variant="outlined" onClick={onCancel}>
                {t("keep_editing_key")}
              </Button>
              <Button onClick={onConfirm}>{t("discard_key")}</Button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

const UserProfileForm = ({
  initialValues,
  isEditMode,
  setIsEditMode,
  changedFields,
  handleCancel,
  handleDiscardConfirm,
  isModalOpen,
  setIsModalOpen,
  handleSubmit,
  handleFieldChange,
}) => {
  const { t } = useTranslation();

  return (
    <motion.div
      className=" w-full"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {!isEditMode && (
        <FaEdit
          className="text-primary cursor-pointer relative ms-auto"
          onClick={() => setIsEditMode(!isEditMode)}
          size={24}
        />
      )}
      <Formik
        initialValues={initialValues}
        enableReinitialize
        onSubmit={handleSubmit}
      >
        {({ setFieldValue, resetForm }) => (
          <Form className="space-y-4">
            <div className="flex flex-col md:flex-row justify-between gap-4 items-center">
              <div className=" w-full md:w-6/12">
                <label className="block text-gray-700">
                  {t("first_name_key")}
                </label>
                <Field
                  name="first_name"
                  type="text"
                  className="custom-input w-full p-2 border rounded"
                  readOnly={!isEditMode}
                  onChange={(e) =>
                    handleFieldChange(
                      setFieldValue,
                      "first_name",
                      e.target.value
                    )
                  }
                />
              </div>
              <div className=" w-full md:w-6/12">
                <label className="block text-gray-700">
                  {t("last_name_key")}
                </label>
                <Field
                  name="last_name"
                  type="text"
                  className="custom-input w-full p-2 border rounded"
                  readOnly={!isEditMode}
                  onChange={(e) =>
                    handleFieldChange(
                      setFieldValue,
                      "last_name",
                      e.target.value
                    )
                  }
                />
              </div>
            </div>
            <div>
              <label className="block text-gray-700">{t("email_key")}</label>
              <Field
                name="email"
                type="email"
                className="custom-input w-full p-2 border rounded"
                readOnly={!isEditMode}
                onChange={(e) =>
                  handleFieldChange(setFieldValue, "email", e.target.value)
                }
              />
            </div>
            <div>
              <label className="block text-gray-700">
                {t("phone_number_key")}
              </label>
              <Field
                name="phone_number"
                type="tel"
                className="custom-input w-full p-2 border rounded"
                readOnly={!isEditMode}
                onChange={(e) =>
                  handleFieldChange(
                    setFieldValue,
                    "phone_number",
                    e.target.value
                  )
                }
              />
            </div>
            {(isEditMode || Object.keys(changedFields).length > 0) && (
              <div className="flex justify-end gap-4">
                <Button
                  variant="outlined"
                  type="button"
                  onClick={() => handleCancel(resetForm)}
                >
                  {t("cancel_key")}
                </Button>
                <Button
                  type="submit"
                  disabled={Object.keys(changedFields).length === 0}
                >
                  {t("save_key")}
                </Button>
              </div>
            )}
            <DiscardModal
              isOpen={isModalOpen}
              onConfirm={() => handleDiscardConfirm(resetForm)}
              onCancel={() => setIsModalOpen(false)}
            />
          </Form>
        )}
      </Formik>
    </motion.div>
  );
};

export default UserProfileForm;
