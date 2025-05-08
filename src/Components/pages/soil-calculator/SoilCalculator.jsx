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
    isPending,
    validationSchema,
    formValues,
    handleOpenModal,
    handleCloseModal,
    handleSubmit,
    goToNextStep,
    goToPrevStep,
    resetForm,
  } = useSoilCalculator({ user, dispatch, navigate });

  return (
    <div>
      {/* Floating Calculator Button */}
      <div
        className=" bg-primary cursor-pointer p-2 rounded-full shadow-md  w-fit"
        onClick={handleOpenModal}
      >
        <IoCalculator title={t("soil_calculator_key")} size={24} color="white" />
      </div>

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
                  <SoilCalculatorForm
                    isSubmitting={isSubmitting}
                    searchError={searchError}
                    t={t}
                  />
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
                    <Button type="submit" width="6/12" loading={isSubmitting}>
                      {t("next_key")}
                    </Button>
                  </div>
                </Form>
              )}
            </Formik>
          )}

          {currentStep === 2 && assessmentResult && (
            <ResultsCard
              assessmentResult={assessmentResult}
              onNextStep={goToNextStep}
              onPrevStep={goToPrevStep}
              t={t}
              isSubmitting={isPending}
            />
          )}

          {currentStep === 3 && assessmentResult && (
            <SummaryStep
              assessmentResult={assessmentResult}
              onPrevStep={goToPrevStep}
            />
          )}
        </div>

        {/* Navigation buttons for steps 2 and 3 */}
        {currentStep !== 1 && (
          <div className="flex justify-between mt-4 gap-2">
            <Button
              type="button"
              variant="outlined"
              width="6/12"
              onClick={goToPrevStep}
            >
              {t("previous_key")}
            </Button>

            {currentStep < 3 ? (
              <Button
                type="button"
                width="6/12"
                onClick={goToNextStep}
                className="ml-auto"
              >
                {t("next_key")}
              </Button>
            ) : (
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
            )}
          </div>
        )}
      </Modal>
    </div>
  );
}
