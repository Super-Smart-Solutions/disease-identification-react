import React, { useMemo, useReducer, useRef, useEffect } from "react";
import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";
import Button from "../../Button";
import Modal from "../../Modal";
import { postDeepAnalysis } from "../../../api/inferenceAPI";
import { useDiagnosticQuestionItems } from "../../../hooks/useDiagnosticQuestions";
import { useDiseaseById } from "../../../hooks/useDiseases";
import { RiImageEditLine } from "react-icons/ri";
import { GiNotebook } from "react-icons/gi";
import { useNavigate } from "react-router-dom";

export default function DeepAnalysisStep({ modelingData, setModelingData }) {
  const { t, i18n } = useTranslation();
  const isAr = useMemo(
    () => i18n.language?.toLowerCase().startsWith("ar"),
    [i18n.language]
  );
  const navigate = useNavigate();
  // Resolve plant questions dynamically from modelingData.category.value
  const plantId = modelingData?.category?.value;
  const questionItems = useDiagnosticQuestionItems({ plant_id: plantId, t }); // [{ key, label }]
  const fallbackItems = useMemo(
    () => [
      {
        key: "deep_analysis_question_1_key",
        label: t("deep_analysis_question_1_key"),
      },
      {
        key: "deep_analysis_question_2_key",
        label: t("deep_analysis_question_2_key"),
      },
      {
        key: "deep_analysis_question_3_key",
        label: t("deep_analysis_question_3_key"),
      },
    ],
    [i18n.language]
  );
  const items =
    questionItems && questionItems.length > 1 ? questionItems : fallbackItems;
  const totalSteps = items.length;

  // Simple cache for results keyed by inference_id
  const cacheRef = useRef({});
  const lastInferenceIdRef = useRef(modelingData?.inference_id || null);

  // Consolidated state to reduce re-renders and simplify updates
  const initialState = useMemo(
    () => ({
      isOpen: true,
      currentStep: 1, // 1..N questions, N+1: results
      answers: {}, // dynamic mapping by question key
      errors: {},
      submitting: false,
      resultText: "",
      result: null, // structured result object
      apiError: "",
    }),
    []
  );

  function reducer(state, action) {
    return { ...state, ...action };
  }

  const [state, dispatch] = useReducer(reducer, initialState);
  const {
    isOpen,
    currentStep,
    answers,
    errors,
    submitting,
    resultText,
    result,
    apiError,
  } = state;

  // Ref for textarea to auto-focus on step change
  const inputRef = useRef(null);

  // Auto-focus the input when the modal is open and we are on a question step
  useEffect(() => {
    if (isOpen && currentStep <= totalSteps) {
      // Delay to ensure element is rendered
      const id = setTimeout(() => {
        inputRef.current?.focus();
      }, 0);
      return () => clearTimeout(id);
    }
  }, [isOpen, currentStep, totalSteps]);

  // Hydrate persisted deep analysis result from global modelingData when component mounts or re-mounts
  useEffect(() => {
    if (
      !result &&
      modelingData?.deep_analysis_result &&
      modelingData?.inference_id
    ) {
      dispatch({ result: modelingData.deep_analysis_result });
    }
  }, [modelingData?.deep_analysis_result, modelingData?.inference_id]);

  // Reset cached display when inference_id changes
  useEffect(() => {
    if (modelingData?.inference_id !== lastInferenceIdRef.current) {
      lastInferenceIdRef.current = modelingData?.inference_id || null;
      dispatch({ result: null, resultText: "", isOpen: false });
    }
  }, [modelingData?.inference_id]);

  const validateStep = (step) => {
    const item = items[step - 1];
    const qKey = item?.key;
    const newErrors = {};
    if (qKey && !answers[qKey]?.trim()) {
      newErrors[qKey] = t("field_required_key");
    }
    if (Object.keys(newErrors).length) {
      dispatch({ errors: { ...errors, ...newErrors } });
      return false;
    }
    return true;
  };

  const handleNext = () => {
    dispatch({ apiError: "" });
    if (currentStep <= totalSteps && !validateStep(currentStep)) return;
    dispatch({ currentStep: Math.min(currentStep + 1, totalSteps + 1) });
  };

  const handlePrev = () => {
    dispatch({ apiError: "" });
    dispatch({ currentStep: Math.max(currentStep - 1, 1) });
  };

  // Keyboard shortcut: Ctrl/Cmd + Enter advances or submits
  const handleInputKeyDown = (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key === "Enter") {
      e.preventDefault();
      if (currentStep < totalSteps) {
        handleNext();
      } else {
        handleSubmit();
      }
    }
  };

  const navigateToDatabase = () => {
    const diseaseId = diseaseData?.id;
    const plantId = modelingData?.category?.value;

    if (!diseaseId) {
      console.warn("Disease ID is missing. Navigation cancelled.");
      return; // Stop navigation if disease ID is not valid
    }

    const query = new URLSearchParams();

    query.set("disease_id", diseaseId);
    if (plantId) query.set("plant_id", plantId);

    navigate(`/database?${query.toString()}`);
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
    if (!validateStep(totalSteps)) return;

    const inferenceId = modelingData?.inference_id;
    if (!inferenceId) {
      dispatch({ apiError: t("missing_inference_id_key") });
      return;
    }

    try {
      // If we already have cached result for this inference, reuse it
      const cached = cacheRef.current[inferenceId];
      if (cached) {
        // Persist to global state so it survives unmount/remount
        setModelingData((prev) => ({
          ...prev,
          deep_analysis_result: cached,
          is_deep: true,
        }));
        dispatch({ result: cached, isOpen: false, currentStep: 1 });
        return;
      }

      dispatch({ submitting: true });
      const locale = isAr ? "ar" : "en";

      // Build request body: send question texts directly and answers array
      const questions = items.map((item) => item.label);
      const answersArr = items.map((item) => answers[item.key] || "");

      const data = await postDeepAnalysis({
        inference_id: inferenceId,
        locale,
        questions,
        answers: answersArr,
      });

      // Cache and display
      cacheRef.current[inferenceId] = data;
      // Persist to global state so result survives closing/reopening the step
      setModelingData((prev) => ({
        ...prev,
        deep_analysis_result: data,
        is_deep: true,
      }));
      dispatch({ result: data, isOpen: false, currentStep: 1 });
    } catch (err) {
      const msg =
        err?.response?.data || err?.message || t("deep_analysis_error_key");
      dispatch({ apiError: msg });
    } finally {
      dispatch({ submitting: false });
    }
  };

  // Allow user to try a different image: clear image/inference and deep analysis result but keep category
  const handleTryDifferentImage = React.useCallback(() => {
    // Reset local result view
    dispatch({ result: null, resultText: "", isOpen: false });
    // Reset modeling flow to allow selecting a new image
    setModelingData((prev) => ({
      ...prev,
      selected_file: [],
      image_id: null,
      inference_id: null,
      is_final: false,
      is_deep: false,
      deep_analysis_result: null,
    }));
  }, [setModelingData]);

  // Derive result view data

  const attentionMapUrl = result?.attention_map_url;
  const reasoning = result?.deep_analysis_reasoning || resultText || "";
  const visualIndicators = result?.deep_analysis_visual_indicators;
  const confidenceScore = result?.confidence_level;

  const diseaseId = result?.disease_id;
  const {
    data: diseaseData,
    isLoading: diseaseLoading,
    isError: diseaseError,
  } = useDiseaseById(diseaseId);

  const renderStep = () => {
    if (currentStep === totalSteps + 1) {
      return (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">
            {t("deep_analysis_result_title_key")}
          </h3>
          {apiError && <div className="text-red-500 text-sm">{apiError}</div>}
          <div className="cardIt whitespace-pre-wrap break-words p-3">
            {reasoning}
          </div>
          <div className="flex justify-end gap-2 mt-4">
            <Button variant="outlined" onClick={handleClose}>
              {t("close_key")}
            </Button>
          </div>
        </div>
      );
    }

    const item = items[currentStep - 1];
    const qKey = item?.key;
    return (
      <div className="space-y-4">
        <p className="text-sm text-gray-600">{item.label}</p>
        <textarea
          className="custom-input min-h-[120px]"
          value={answers[qKey] || ""}
          onChange={(e) => handleChange(qKey, e.target.value)}
          placeholder={t("deep_analysis_placeholder_key")}
          ref={inputRef}
          onKeyDown={handleInputKeyDown}
        />
        {errors[qKey] && (
          <div className="text-red-500 text-sm">{errors[qKey]}</div>
        )}
        {apiError && <div className="text-red-500 text-sm">{apiError}</div>}

        <div className="flex justify-between gap-2 mt-4">
          <Button
            width="full"
            variant="outlined"
            onClick={handlePrev}
            disabled={currentStep === 1 || submitting}
          >
            {t("previous_key")}
          </Button>
          {currentStep < totalSteps ? (
            <Button width="full" onClick={handleNext} disabled={submitting}>
              {t("next_key")}
            </Button>
          ) : (
            <Button
              width="full"
              onClick={handleSubmit}
              loading={submitting}
              disabled={submitting}
            >
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
        {/* Display results here after successful submission */}
        {reasoning ? (
          <div className="w-full  whitespace-pre-wrap break-words p-3 mb-4">
            {/* Attention Map */}
            {attentionMapUrl && (
              <div className="w-full flex flex-col items-center mb-4">
                <img
                  src={attentionMapUrl}
                  alt={t("attention_map_key")}
                  className="w-72 rounded shadow object-contain"
                  loading="lazy"
                />
              </div>
            )}

            {/* Deep Analysis Reasoning */}
            <div className="mb-3">
              <h4 className="font-semibold text-gray-800 mb-1">
                {t("deep_analysis_result_title_key")}
              </h4>
              <p>
                <span className="font-semibold text-sm text-gray-700">
                  {t("confidence_score_key", {
                    defaultValue: "Confidence Score",
                  })}
                  :
                </span>{" "}
                {confidenceScore !== null && `${confidenceScore.toFixed(2)}%`}
              </p>
              <p className="text-sm text-gray-700">{reasoning}</p>
            </div>

            {/* Visual Indicators */}
            {visualIndicators && (
              <div className="mb-3">
                <h5 className="font-semibold text-gray-800 mb-1">
                  {t("deep_analysis_visual_indicators_key", {
                    defaultValue: "Visual Indicators",
                  })}
                </h5>
                {Array.isArray(visualIndicators) ? (
                  <ul className="list-disc ps-5 text-sm text-gray-700">
                    {visualIndicators.map((vi, idx) => (
                      <li key={idx}>{vi}</li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-sm text-gray-700">{visualIndicators}</p>
                )}
              </div>
            )}

            {/* Disease Info */}
            {diseaseId && (
              <div className="w-full mt-2">
                <h5 className="font-semibold text-gray-800 mb-1">
                  {t("selected_disease")}
                </h5>
                {diseaseLoading ? (
                  <p className="text-sm text-gray-500">
                    {t("loading_key", { defaultValue: "Loading..." })}
                  </p>
                ) : diseaseError ? (
                  <p className="text-sm text-red-500">
                    {t("error_key", {
                      defaultValue: "Failed to load disease info",
                    })}
                  </p>
                ) : (
                  <p>
                    <span className="font-semibold text-sm text-gray-700">
                      {t("name_key", { defaultValue: "Name" })}:
                    </span>{" "}
                    {isAr
                      ? diseaseData?.arabic_name
                      : diseaseData?.english_name}
                  </p>
                )}
              </div>
            )}

            {/* Try Different Image Button under results */}
            <div className="mt-4 flex justify-center gap-4 w-full ">
              <Button
                className="flex items-center gap-2"
                onClick={handleTryDifferentImage}
              >
                <RiImageEditLine size={22} />
                {t("try_with_a_different_image_key")}
              </Button>
              {diseaseId && (
                <Button
                  className="flex items-center gap-2 "
                  onClick={navigateToDatabase}
                >
                  <GiNotebook size={22} />
                  {t("read_more_about_disease_key")}
                </Button>
              )}
            </div>
          </div>
        ) : (
          <>
            <span>{t("deep_analysis_intro_key")}</span>
            <Button
              onClick={() => {
                dispatch({ isOpen: true });
              }}
              className={`mt-2`}
            >
              {t("next_key")}
            </Button>
          </>
        )}
      </div>

      <Modal
        isOpen={!reasoning && isOpen}
        onClose={handleClose}
        title={t("deep_analytics_key")}
      >
        {renderStep()}
      </Modal>
    </div>
  );
}

DeepAnalysisStep.propTypes = {
  modelingData: PropTypes.object.isRequired,
  setModelingData: PropTypes.func.isRequired,
};
