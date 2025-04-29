import React from "react";
import { IoCalculator } from "react-icons/io5";
import { useUserData } from "../../../hooks/useUserData";
import Modal from "../../Modal";
import { useTranslation } from "react-i18next";
import { useSelector, useDispatch } from "react-redux";
import { setSoilCalculatorOpen } from "../../../redux/features/soilCalculatorSlice";
import { useMutation } from "@tanstack/react-query";
import { assessSoil } from "../../../api/soilApi";
import { useNavigate } from "react-router-dom";
import { fetchCrops } from "../../../api/soilApi";
import { useState } from "react";
import { Formik } from "formik";
import { useSoilCalculatorValidations } from "./soilCalculatorValidations";
import { SoilCalculatorForm } from "./SoilCalculatorForm";

export default function SoilCalculator() {
  const { t } = useTranslation();
  const { user } = useUserData();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const isModalOpen = useSelector((state) => state.soilCalculator.isOpen);

  const [assessmentResult, setAssessmentResult] = useState(null);
  const [searchError, setSearchError] = React.useState(null);

  const { validationSchema, initialValues } = useSoilCalculatorValidations();

  const { mutate: submitAssessment, isPending } = useMutation({
    mutationFn: assessSoil,
    onSuccess: (data) => {
      console.log("Assessment Success:", data);
      setAssessmentResult(data);
    },
    onError: (error) => {
      console.error("Assessment Error:", error);
      setAssessmentResult(null);
    },
  });

  const handleSubmit = async (values, { setSubmitting }) => {
    setAssessmentResult(null);
    setSearchError(null);
    try {
      const cropsResponse = await fetchCrops({ name: values.crop_name });

      if (cropsResponse.items.length === 0) {
        setSearchError("No crop was found, make sure to check the spelling.");
        console.error("No crops found matching the name");
        setSubmitting(false);
        return;
      }

      const crop = cropsResponse.items[0];

      submitAssessment(
        {
          crop_id: crop.id,
          ph: parseFloat(values.ph),
          salinity: parseFloat(values.salinity),
          temperature: parseFloat(values.temperature),
        },
        {
          onSuccess: (data) => {
            setAssessmentResult(data);
          },
          onError: (error) => {
            console.error("Assessment Error:", error);
            setSearchError("An error occurred during soil assessment.");
          },
        }
      );
    } catch (error) {
      console.error("Error during soil assessment:", error);
    } finally {
      setSubmitting(false);
    }
  };

  const handleOpenModal = () => {
    if (!user?.id) {
      navigate("/auth/login");
      return;
    }
    dispatch(setSoilCalculatorOpen(true));
  };

  const handleCloseModal = () => {
    dispatch(setSoilCalculatorOpen(false));
    setAssessmentResult(null);
    setSearchError(null);
  };

  return (
    <div>
      {/* Calculator button */}
      <div
        className="fixed bottom-10 right-10 bg-primary cursor-pointer p-2 rounded-full shadow-md z-50"
        onClick={handleOpenModal}
      >
        <IoCalculator size={24} color="white" />
      </div>

      {/* Modal - only shown if user is logged in */}
      <Modal
        title={t("soil_calculator_key")}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
      >
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({ isSubmitting }) => (
            <SoilCalculatorForm
              isSubmitting={isSubmitting}
              searchError={searchError}
              assessmentResult={assessmentResult}
              t={t}
            />
          )}
        </Formik>
      </Modal>
    </div>
  );
}
