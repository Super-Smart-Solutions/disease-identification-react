import React, { useMemo, useReducer } from "react";
import { useTranslation } from "react-i18next";
import Button from "../../Button";
import Modal from "../../Modal";
import { postDeepAnalysis } from "../../../api/inferenceAPI";

export default function DeepAnalysisStep({ modelingData, setModelingData }) {
  const { t, i18n } = useTranslation();
  const isAr = useMemo(() => i18n.language?.toLowerCase().startsWith("ar"), [i18n.language]);

  // Consolidated state to reduce re-renders and simplify updates
  const initialState = useMemo(
    () => ({
      isOpen: false,
      currentStep: 1, // 1..3 questions, 4: results
      answers: { answer_1: "", answer_2: "", answer_3: "" },
      errors: {},
      submitting: false,
      resultText: "",
      apiError: "",
    }),
    []
  );

  function reducer(state, action) {
    return { ...state, ...action };
  }

  const [state, dispatch] = useReducer(reducer, initialState);
  const { isOpen, currentStep, answers, errors, submitting, resultText, apiError } = state;

  const qLabels = useMemo(
    () => ({
      1: t("deep_analysis_question_1_key"),
      2: t("deep_analysis_question_2_key"),
      3: t("deep_analysis_question_3_key"),
    }),
    [i18n.language]
  );

  const validateStep = (step) => {
    const key = `answer_${step}`;
    const newErrors = {};
    if (!answers[key]?.trim()) {
      newErrors[key] = t("field_required_key");
    }
    if (Object.keys(newErrors).length) {
      dispatch({ errors: { ...errors, ...newErrors } });
      return false;
    }
    return true;
  };

  const handleNext = () => {
    dispatch({ apiError: "" });
    if (currentStep <= 3 && !validateStep(currentStep)) return;
    dispatch({ currentStep: Math.min(currentStep + 1, 4) });
  };

  const handlePrev = () => {
    dispatch({ apiError: "" });
    dispatch({ currentStep: Math.max(currentStep - 1, 1) });
  };

  const handleOpen = () => {
    dispatch({ isOpen: true, currentStep: 1, apiError: "", resultText: "" });
  };

  const handleClose = () => {
    dispatch({ isOpen: false, currentStep: 1, apiError: "" });
  };

  const handleChange = (key, val) => {
    dispatch({
      answers: { ...answers, [key]: val },
      errors: { ...errors, [key]: "" },
    });
  };

  const handleSubmit = async () => {
    dispatch({ apiError: "" });
    // Validate last step
    if (!validateStep(3)) return;

    if (!modelingData?.inference_id) {
      dispatch({ apiError: t("missing_inference_id_key") });
      return;
    }

    try {
      dispatch({ submitting: true });
      const locale = isAr ? "ar" : "en";
      const resText = await postDeepAnalysis({
        ...answers,
        locale,
        inference_id: modelingData.inference_id,
      });
      dispatch({
        resultText: typeof resText === "string" ? resText : String(resText),
        currentStep: 4,
      });
    } catch (err) {
      const msg = err?.response?.data || err?.message || t("deep_analysis_error_key");
      dispatch({ apiError: msg });
    } finally {
      dispatch({ submitting: false });
    }
  };

  const renderStep = () => {
    if (currentStep === 4) {
      return (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">{t("deep_analysis_result_title_key")}</h3>
          {apiError && <div className="text-red-500 text-sm">{apiError}</div>}
          <div className="cardIt whitespace-pre-wrap break-words p-3">{resultText}</div>
          <div className="flex justify-end gap-2 mt-4">
            <Button variant="outlined" onClick={handleClose}>{t("close_key")}</Button>
          </div>
        </div>
      );
    }

    const key = `answer_${currentStep}`;
    return (
      <div className="space-y-4">
        <p className="text-sm text-gray-600">{qLabels[currentStep]}</p>
        <textarea
          className="custom-input min-h-[120px]"
          value={answers[key]}
          onChange={(e) => handleChange(key, e.target.value)}
          placeholder={t("deep_analysis_placeholder_key")}
        />
        {errors[key] && <div className="text-red-500 text-sm">{errors[key]}</div>}
        {apiError && <div className="text-red-500 text-sm">{apiError}</div>}

        <div className="flex justify-between gap-2 mt-4">
          <Button width="full" variant="outlined" onClick={handlePrev} disabled={currentStep === 1 || submitting}>
            {t("previous_key")}
          </Button>
          {currentStep < 3 ? (
            <Button width="full" onClick={handleNext} disabled={submitting}>{t("next_key")}</Button>
          ) : (
            <Button width="full" onClick={handleSubmit} loading={submitting} disabled={submitting}>
              {t("submit_key")}
            </Button>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-4">
      <div className="cardIt p-4 flex flex-col items-center">
        <p className="text-gray-700 mb-3">
          {t("deep_analysis_intro_key")}
        </p>
        <Button  onClick={handleOpen} className="mt-2 mx-auto">{t("go_to_deep_analysis_key")}</Button>
      </div>

      <Modal isOpen={isOpen} onClose={handleClose} title={t("deep_analytics_key")}>
        {renderStep()}
      </Modal>
    </div>
  );
}
