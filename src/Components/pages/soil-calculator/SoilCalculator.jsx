import React from "react";
import { IoCalculator } from "react-icons/io5";
import { useUserData } from "../../../hooks/useUserData";
import Modal from "../../Modal";
import { useTranslation } from "react-i18next";
import Button from "../../Button";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { useSelector, useDispatch } from "react-redux";
import { setSoilCalculatorOpen } from "../../../redux/features/soilCalculatorSlice";
import { useMutation } from "@tanstack/react-query";
import { assessSoil } from "../../../api/soilApi";
import { useNavigate } from "react-router-dom";

export default function SoilCalculator() {
  const { t } = useTranslation();
  const { user } = useUserData();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const isModalOpen = useSelector((state) => state.soilCalculator.isOpen);

  const validationSchema = Yup.object().shape({
    crop_name: Yup.string().required(t("required_field_key")),
    ph: Yup.number(t("must_be_a_number_key"))
      .min(0, t("ph_min_error_key"))
      .max(14, t("ph_max_error_key"))
      .required(t("required_field_key")),
    salinity: Yup.number(t("must_be_a_number_key"))
      .min(5, t("salinity_min_error_key"))
      .max(18, t("salinity_max_error_key"))
      .required(t("required_field_key")),
  });

  const initialValues = {
    crop_name: "",
    ph: "",
    salinity: "",
  };

  const { mutate: submitAssessment, isPending } = useMutation({
    mutationFn: assessSoil,
    onSuccess: (data) => {
      console.log("Assessment Success:", data);
    },
    onError: (error) => {
      console.error("Assessment Error:", error);
    },
  });

  const handleSubmit = (values, { setSubmitting }) => {
    submitAssessment({
      crop_name: values.crop_name,
      ph: parseFloat(values.ph),
      salinity: parseFloat(values.salinity),
    });
    setSubmitting(false);
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
            <Form className="space-y-4">
              <div className="flex flex-col md:flex-row justify-between w-full gap-4">
                <div className="space-y-4 w-full md:w-6/12">
                  {/* Crop Field */}
                  <div className="form-group">
                    <label
                      htmlFor="crop_name"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      {t("crop_key")}
                    </label>
                    <Field
                      placeholder={t("type_crop_key")}
                      type="text"
                      name="crop_name"
                      id="crop_name"
                      className="custom-input w-full p-2 border rounded"
                    />
                    <ErrorMessage
                      name="crop_name"
                      component="div"
                      className="text-red-500 text-xs mt-1"
                    />
                  </div>

                  {/* pH Field */}
                  <div className="form-group">
                    <label
                      htmlFor="ph"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      {t("ph_key")}
                    </label>
                    <Field
                      placeholder="(0-14)"
                      type="text"
                      name="ph"
                      id="ph"
                      className="custom-input w-full p-2 border rounded"
                    />
                    <ErrorMessage
                      name="ph"
                      component="div"
                      className="text-red-500 text-xs mt-1"
                    />
                  </div>
                  {/* Salinity Field */}
                  <div className="form-group">
                    <label
                      htmlFor="salinity"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      {t("salinity_key")}
                    </label>
                    <Field
                      placeholder="(5-18)"
                      type="text"
                      name="salinity"
                      id="salinity"
                      className="custom-input w-full p-2 border rounded"
                    />
                    <ErrorMessage
                      name="salinity"
                      component="div"
                      className="text-red-500 text-xs mt-1"
                    />
                  </div>
                </div>

                <div className="cardIt w-full md:w-6/12">
                  {/* Empty cardIt div as requested */}
                </div>
              </div>

              <Button
                type="submit"
                width="full"
                className="mt-4"
                loading={isSubmitting}
              >
                {t("get_data_key")}
              </Button>
            </Form>
          )}
        </Formik>
      </Modal>
    </div>
  );
}
