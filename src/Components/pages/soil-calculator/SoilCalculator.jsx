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
import { fetchCrops } from "../../../api/soilApi";
import { useState } from "react";


export default function SoilCalculator() {
  const { t } = useTranslation();
  const { user } = useUserData();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const isModalOpen = useSelector((state) => state.soilCalculator.isOpen);

  const [assessmentResult, setAssessmentResult] = useState(null);
  const [searchError, setSearchError] = React.useState(null);

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
    temperature: Yup.number(t("must_be_a_number_key"))
      .min(5, t("temperature_min_error_key"))
      .max(18, t("temperature_max_error_key"))
      .required(t("required_field_key")),
  });

  const initialValues = {
    crop_name: "",
    ph: "",
    salinity: "",
    temperature:"",
  };

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

  // const handleSubmit = (values, { setSubmitting }) => {
  //   submitAssessment({
  //     crop_name: values.crop_name,
  //     ph: parseFloat(values.ph),
  //     salinity: parseFloat(values.salinity),
  //     temperature: parseFloat(values.temperature),
  //   });
  //   setSubmitting(false);
  // };

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

      // submitAssessment({
      //   crop_id: crop.id,
      //   ph: parseFloat(values.ph),
      //   salinity: parseFloat(values.salinity),
      //   temperature: parseFloat(values.temperature),
      // });
      submitAssessment({
      crop_id: crop.id,
      ph: parseFloat(values.ph),
      salinity: parseFloat(values.salinity),
      temperature: parseFloat(values.temperature),
      }, {
        onSuccess: (data) => {
          setAssessmentResult(data);
        },
        onError: (error) => {
          console.error("Assessment Error:", error);
          setSearchError("An error occurred during soil assessment.");
        }
      });

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

                  <div className="form-group">
                    <label
                      htmlFor="temperature"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      {t("temperature_key")}
                    </label>
                    <Field
                      placeholder="(5-18)"
                      type="text"
                      name="temperature"
                      id="temperature"
                      className="custom-input w-full p-2 border rounded"
                    />
                    <ErrorMessage
                      name="temperature"
                      component="div"
                      className="text-red-500 text-xs mt-1"
                    />
                  </div>


                </div>



                <div className="cardIt w-full md:w-6/12">

                  {searchError && (
                    <div className="p-4 border rounded shadow-md text-red-500">
                      {searchError}
                    </div>
                  )}


                  {assessmentResult && !searchError && (
                    <div className="p-4 border rounded shadow-md space-y-6">
                      {/* Results */}
                      <div className="space-y-4">
                        {Object.entries(assessmentResult.assessment.results).map(([parameter, details]) => (
                          <div key={parameter} className="space-y-1">
                            {/* Top line: Parameter name + Status */}
                            <div className="flex items-center gap-2">
                              <div className="font-semibold capitalize">{parameter}</div>
                              <span
                                className={`px-2 py-1 rounded-full text-white text-xs ${
                                  details.status.toLowerCase() === "optimal" ? "bg-green-500" : "bg-red-500"
                                }`}
                              >
                                {details.status}
                              </span>
                            </div>

                            {/* Second line: Values */}
                            <div className="text-sm">
                              Your value: {details.user_value} (Optimal: {details.range[0]}–{details.range[1]})
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* Recommendations */}
                      <div className="mt-4">
                        <h4 className="font-semibold mb-2">Recommendations:</h4>
                        <ul className="list-disc list-inside space-y-1">
                          {assessmentResult.assessment.recommendations.map((rec, index) => (
                            <li key={index} className="text-sm">{rec}</li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  )}
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
