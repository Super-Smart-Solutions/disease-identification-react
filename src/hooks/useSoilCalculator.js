import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { assessSoil, fetchCrops, uploadReport } from "../api/soilApi";
import { setSoilCalculatorOpen } from "../redux/features/soilCalculatorSlice";
import { useSoilCalculatorValidations } from "../schemas/soilCalculatorValidations";

export function useSoilCalculator({ user, dispatch, navigate }) {
    const [currentStep, setCurrentStep] = useState(1);
    const [searchError, setSearchError] = useState(null);
    const [lastAssessmentData, setLastAssessmentData] = useState(null);
    const { validationSchema, initialValues } = useSoilCalculatorValidations();
    const [formValues, setFormValues] = useState(initialValues);

    const {
        data: assessmentResult,
        mutate: submitAssessment,
        isPending: isAssessmentPending,
        error: assessmentError,
    } = useMutation({
        mutationFn: assessSoil,
        onSuccess: (data, variables) => {
            setSearchError(null);
            setLastAssessmentData(variables); // Store the submitted data
            setCurrentStep(2);
        },
        onError: (error) => {
            console.error("Assessment Error:", error);
            setSearchError(error.message || "An error occurred during soil assessment.");
        },
    });

    const {
        data: uploadResult,
        mutate: submitUpload,
        isPending: isUploadPending,
        error: uploadError,
    } = useMutation({
        mutationFn: uploadReport,
        onSuccess: () => {
            setSearchError(null);
            setCurrentStep(3);
        },
        onError: (error) => {
            console.error("Upload Error:", error);
            setSearchError(error.message || "An error occurred during file upload.");
        },
    });

    const handleSubmit = async (values, { setSubmitting }) => {
        setFormValues(values);
        setSearchError(null);
        try {
            const cropsResponse = await fetchCrops({ name: values.crop_name });
            const crop = cropsResponse.items[0];

            if (!crop) {
                setSearchError("No crop was found, make sure to check the spelling.");
                setSubmitting(false);
                return;
            }

            const assessmentData = {
                crop_id: crop.id,
                ph: parseFloat(values.ph),
                salinity: parseFloat(values.salinity),
                temperature: parseFloat(values.temperature),
            };

            // Check if assessment data is identical to the last submitted data
            if (
                lastAssessmentData &&
                lastAssessmentData.crop_id === assessmentData.crop_id &&
                lastAssessmentData.ph === assessmentData.ph &&
                lastAssessmentData.salinity === assessmentData.salinity &&
                lastAssessmentData.temperature === assessmentData.temperature
            ) {
                // Skip mutation and go to next step
                setSearchError(null);
                setCurrentStep(2);
                setSubmitting(false);
                return;
            }

            submitAssessment(assessmentData);
        } catch (error) {
            console.error("Soil assessment failed:", error);
            setSearchError(error.message || "An error occurred during soil assessment.");
            setSubmitting(false);
        }
    };

    const handleUploadSubmit = async (values, { setSubmitting }) => {
        setFormValues(values);
        setSearchError(null);
        try {
            if (values.uploadedPdf) {
                submitUpload({ file: values.uploadedPdf });
            } else {
                setCurrentStep(3);
            }
        } catch (error) {
            setSearchError(error.message || "An error occurred during file upload.");
        }
        finally {
            setSubmitting(false);

        }
    };

    const handleOpenModal = () => {
        if (!user?.id) {
            navigate("/auth/login");
        } else {
            dispatch(setSoilCalculatorOpen(true));
            setCurrentStep(1);
            setSearchError(null);
            setFormValues(initialValues);
            setLastAssessmentData(null); // Reset last assessment data on modal open
        }
    };

    const handleCloseModal = () => {
        dispatch(setSoilCalculatorOpen(false));
        setCurrentStep(1);
        setSearchError(null);
        setFormValues(initialValues);
        setLastAssessmentData(null); // Reset last assessment data on modal close
    };

    const goToNextStep = () => {
        setSearchError(null);
        setCurrentStep((s) => Math.min(s + 1, 4));
    };

    const goToPrevStep = () => {
        setSearchError(null);
        setCurrentStep((s) => Math.max(s - 1, 1));
    };

    return {
        currentStep,
        searchError,
        assessmentResult,
        uploadResult,
        isAssessmentPending,
        isUploadPending,
        validationSchema,
        initialValues,
        formValues,
        handleOpenModal,
        handleCloseModal,
        handleSubmit,
        handleUploadSubmit,
        goToNextStep,
        goToPrevStep,
        resetForm: () => {
            setFormValues(initialValues);
            setSearchError(null);
            setLastAssessmentData(null); // Reset last assessment data on form reset
        },
    };
}