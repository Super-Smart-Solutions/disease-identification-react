import React, { useCallback, useRef, useEffect, useState } from "react";
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
import html2canvas from "html2canvas-pro";
import jsPDF from "jspdf";
import { uploadReport } from "../../api/reportsApi";
import { useUserData } from "./../../hooks/useUserData";

export default function ModalOilTest() {
  const { t } = useTranslation();
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [resultData, setResultData] = useState(null);
  const isOpen = useSelector((state) => state.oilTestModal.isOpen);
  const dispatch = useDispatch();
  const resultsRef = useRef(null);
  const hasGeneratedForResult = useRef(null);
  const { user } = useUserData();

  const handleClose = () => {
    dispatch(setOilTestModalOpen(false));
    setSelectedFiles([]);
    setResultData(null);
  };

  const { mutate, isPending } = useMutation({
    mutationFn: ({ file, name }) => checkOilAuthenticity(file, name),
    onSuccess: (res) => {
      setResultData(res);
    },
  });

  const { mutate: uploadReportMutate, isPending: isUploading } = useMutation({
    mutationFn: ({ file }) =>
      uploadReport({ file, report_origin: "computed", reportType: "oil" }),
  });

  useEffect(() => {
    const generateAndUpload = async () => {
      if (!resultData?.result || !resultsRef.current) return;

      if (hasGeneratedForResult.current === resultData) return;
      hasGeneratedForResult.current = resultData;

      try {
        const canvas = await html2canvas(resultsRef.current, {
          scale: 2,
          useCORS: true,
          backgroundColor: "#ffffff",
        });

        const imgData = canvas.toDataURL("image/jpeg", 0.6);
        const pdf = new jsPDF("p", "mm", "a4");

        const imgWidth = 210;
        const pageHeight = 297;
        const imgHeight = (canvas.height * imgWidth) / canvas.width;

        let heightLeft = imgHeight;
        let position = 0;

        pdf.addImage(imgData, "JPEG", 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;

        while (heightLeft > 0) {
          position = heightLeft - imgHeight;
          pdf.addPage();
          pdf.addImage(imgData, "JPEG", 0, position, imgWidth, imgHeight);
          heightLeft -= pageHeight;
        }

        const pdfBlob = pdf.output("blob");
        const timestamp = new Date().toISOString().replace(/[:.]/g, "-");

        const file = new File(
          [pdfBlob],
          `oil_report_${user?.id || "guest"}_${timestamp}.pdf`,
          { type: "application/pdf" }
        );

        uploadReportMutate({ file });
      } catch (error) {
        console.error("Failed to generate/upload PDF:", error);
      }
    };

    generateAndUpload();
  }, [resultData, user, uploadReportMutate]);

  const handleFileChange = useCallback((files, setFieldValue) => {
    setSelectedFiles(files);

    if (files?.length) {
      const fileNameWithoutExtension = files[0]?.name.replace(/\.[^/.]+$/, "");
      setFieldValue("name", fileNameWithoutExtension);
    } else {
      setFieldValue("name", "");
      setResultData(null);
    }
  }, []);

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
          mutate({ file: selectedFiles[0], name: values.name });
        }}
      >
        {({ setFieldValue }) => (
          <Form className="space-y-4">
            <span className=" text-2xl text-center my-4 block">
              {t("oil_test_key")}
            </span>
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

            {resultData?.result && (
              <motion.div
                ref={resultsRef}
                key="result"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
                className={`p-4 rounded-md shadow-sm border ${
                  resultData.result === "AUTHENTIC"
                    ? "bg-green-100 border-green-400"
                    : "bg-red-100 border-red-400"
                }`}
              >
                <h3 className="text-lg font-semibold text-gray-800 mb-2">
                  {t("oil_test_result_key", "Oil Test Result")}
                </h3>
                <p className="text-sm text-gray-700 mb-1">
                  <strong>{t("result_key", "Result")}:</strong>{" "}
                  {resultData.result === "AUTHENTIC"
                    ? t("authentic_key", "Authentic")
                    : resultData.result}
                </p>
                {resultData.confidence_score !== undefined && (
                  <p className="text-sm text-gray-700">
                    <strong>
                      {t("confidence_score_key", "Confidence Score")}:
                    </strong>{" "}
                    {(resultData.confidence_score * 100).toFixed(2)}%
                  </p>
                )}
              </motion.div>
            )}

            <Button
              type="submit"
              loading={isPending || isUploading}
              width="full"
            >
              {t("upload_key")}
            </Button>
          </Form>
        )}
      </Formik>
    </Modal>
  );
}
