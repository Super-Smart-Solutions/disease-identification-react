import React, { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import FileUpload from "../FileUpload";
import Button from "../Button";
import { checkOilAuthenticity } from "../../api/oilTestApi";
import Modal from "../Modal";
import { useDispatch, useSelector } from "react-redux";
import { AnimatePresence, motion } from "framer-motion";
import { setOilTestModalOpen } from "../../redux/features/oilTestModalSlice";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";

export default function ModalOilTest() {
  const { t } = useTranslation();
  const [selectedFiles, setSelectedFiles] = useState([]);
  const isOpen = useSelector((state) => state.oilTestModal.isOpen);
  const dispatch = useDispatch();

  const handleClose = () => {
    dispatch(setOilTestModalOpen(false));
    setSelectedFiles([]);
  };

  const mutation = useMutation({
    mutationFn: ({ file, name }) => checkOilAuthenticity(file, name),
    onSuccess: () => {
      handleClose();
    },
  });

  const handleFileChange = (files, setFieldValue) => {
    setSelectedFiles(files);
    if (files?.length) {
      const fileNameWithoutExtension = files[0].name.replace(/\.[^/.]+$/, "");
      setFieldValue("name", fileNameWithoutExtension);
    } else {
      setFieldValue("name", "");
    }
  };

  const validationSchema = Yup.object({
    name: Yup.string().required(t("file_name_required_key")),
  });

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title={t("oil_test_analysis_key")}
    >
      <Formik
        initialValues={{ name: "" }}
        validationSchema={validationSchema}
        onSubmit={(values) => {
          if (!selectedFiles.length) return;
          mutation.mutate({ file: selectedFiles[0], name: values.name });
        }}
      >
        {({ setFieldValue }) => (
          <Form className="space-y-4">
            <span className=" text-2xl text-center my-4 block"> {t("oil_test_key")}</span>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {t("oil_test_desc_key")}
            </label>
            <FileUpload
              selectedFile={selectedFiles}
              setSelectedFile={(files) =>
                handleFileChange(files, setFieldValue)
              }
              accept={{ "text/csv": [".csv"] }}
              allowRemove
            />

            <AnimatePresence>
              {selectedFiles.length > 0 && (
                <motion.div
                  key="nameInput"
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.3 }}
                >
                  <Field
                    type="text"
                    name="name"
                    className="custom-input mt-2"
                    placeholder={t("file_name_key")}
                  />
                  <ErrorMessage
                    name="name"
                    component="div"
                    className="text-sm text-red-500 mt-1"
                  />
                </motion.div>
              )}
            </AnimatePresence>

            <Button type="submit" loading={mutation.isPending} width="full">
              {t("upload_key")}
            </Button>
          </Form>
        )}
      </Formik>
    </Modal>
  );
}
