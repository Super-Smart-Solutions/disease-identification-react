import React from "react";
import { IoCalculator } from "react-icons/io5";
import { useTranslation } from "react-i18next";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Formik, Form } from "formik";
import { useUserData } from "../../../hooks/useUserData";
import { SoilCalculatorForm } from "./SoilCalculatorForm";
import { ResultsCard } from "./ResultsCard";
import { SummaryStep } from "./SummaryStep";
import UploadPdf from "./UploadPdf";
import Modal from "../../Modal";
import Button from "../../Button";
import { useSoilCalculator } from "../../../hooks/useSoilCalculator";

export default function SoilCalculator() {
  const { t } = useTranslation();
  const { user } = useUserData();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const isModalOpen = useSelector((state) => state.soilCalculator.isOpen);

  const {
    currentStep,
    searchError,
    assessmentResult,
    isAssessmentPending,
    isUploadPending,
    validationSchema,
    formValues,
    handleCloseModal,
    handleSubmit,
    handleUploadSubmit,
    goToNextStep,
    goToPrevStep,
    resetForm,
  } = useSoilCalculator({ user, dispatch, navigate });

  return (
    <div>
      <Modal
        title={t("soil_calculator_key")}
        isOpen={isModalOpen}
        onClose={() => {
          resetForm();
          handleCloseModal();
        }}
      >
        <div className="min-h-[60vh]">
          {currentStep === 1 && (
            <Formik
              initialValues={formValues}
              validationSchema={validationSchema}
              onSubmit={handleSubmit}
              enableReinitialize
            >
              {({ isSubmitting, resetForm: formikReset }) => (
                <Form className="space-y-4 min-h-[60vh] flex flex-col justify-between">
                  <div className="">
                    <h3 className="text-lg font-medium mb-4">
                      {t("soil_input_step_key")}
                    </h3>
                    <SoilCalculatorForm
                      isSubmitting={isSubmitting}
                      searchError={searchError}
                      t={t}
                    />
                    {searchError && (
                      <div className="text-red-500 text-sm mt-2">
                        {searchError}
                      </div>
                    )}
                  </div>
                  <div className="flex justify-between mt-4 gap-2">
                    <Button
                      type="button"
                      variant="outlined"
                      width="6/12"
                      onClick={() => {
                        formikReset();
                        resetForm();
                      }}
                    >
                      {t("reset_key")}
                    </Button>
                    <Button
                      type="submit"
                      width="6/12"
                      loading={isAssessmentPending}
                      disabled={isAssessmentPending}
                    >
                      {t("next_key")}
                    </Button>
                  </div>
                </Form>
              )}
            </Formik>
          )}

          {currentStep === 2 && (
            <Formik
              initialValues={formValues}
              validationSchema={validationSchema}
              onSubmit={handleUploadSubmit}
              enableReinitialize
            >
              {({ isSubmitting }) => (
                <Form className="space-y-4 min-h-[60vh] flex flex-col justify-between">
                  <div className="">
                    <h3 className="text-lg font-medium mb-4">
                      {t("upload_pdf_step_key")}
                    </h3>
                    <UploadPdf
                      assessmentResult={assessmentResult}
                      name="uploadedPdf"
                    />
                    {searchError && (
                      <div className="text-red-500 text-sm mt-2">
                        {searchError}
                      </div>
                    )}
                  </div>
                  <div className="flex justify-between mt-4 gap-2">
                    <Button
                      type="button"
                      variant="outlined"
                      width="6/12"
                      onClick={goToPrevStep}
                      disabled={isUploadPending}
                    >
                      {t("previous_key")}
                    </Button>
                    <Button
                      type="submit"
                      width="6/12"
                      loading={isUploadPending}
                      disabled={isUploadPending}
                    >
                      {t("next_key")}
                    </Button>
                  </div>
                </Form>
              )}
            </Formik>
          )}

          {currentStep === 3 && assessmentResult && (
            <div className="space-y-4 min-h-[60vh] flex flex-col justify-between">
              <div className="">
                <h3 className="text-lg font-medium mb-4">
                  {t("results_step_key")}
                </h3>
                <ResultsCard
                  user={user}
                  assessmentResult={assessmentResult}
                  t={t}
                />
                {searchError && (
                  <div className="text-red-500 text-sm mt-2">{searchError}</div>
                )}
              </div>
              <div className="flex justify-between mt-4 gap-2">
                <Button
                  type="button"
                  variant="outlined"
                  width="6/12"
                  onClick={goToPrevStep}
                >
                  {t("previous_key")}
                </Button>
                <Button
                  type="button"
                  width="6/12"
                  onClick={goToNextStep}
                  className="ml-auto"
                >
                  {t("next_key")}
                </Button>
              </div>
            </div>
          )}

          {currentStep === 4 && assessmentResult && (
            <div className="space-y-4 min-h-[60vh] flex flex-col justify-between">
              <div className="">
                <h3 className="text-lg font-medium mb-4">
                  {t("summary_step_key")}
                </h3>
                <SummaryStep
                  assessmentResult={assessmentResult}
                  onPrevStep={goToPrevStep}
                />
                {searchError && (
                  <div className="text-red-500 text-sm mt-2">{searchError}</div>
                )}
              </div>
              <div className="flex justify-between mt-4 gap-2">
                <Button
                  type="button"
                  variant="outlined"
                  width="6/12"
                  onClick={goToPrevStep}
                >
                  {t("previous_key")}
                </Button>
                <Button
                  type="button"
                  onClick={() => {
                    resetForm();
                    handleCloseModal();
                  }}
                  className="ml-auto"
                  width="6/12"
                >
                  {t("finish_key")}
                </Button>
              </div>
            </div>
          )}
        </div>
      </Modal>
    </div>
  );
}
