// File: ./hooks/useSoilCalculator.js

import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { assessSoil, fetchCrops } from "../api/soilApi";
import { useSoilCalculatorValidations } from "../Components/pages/soil-calculator/soilCalculatorValidations";
import { setSoilCalculatorOpen } from "../redux/features/soilCalculatorSlice";

export function useSoilCalculator({ user, dispatch, navigate }) {
    const [currentStep, setCurrentStep] = useState(1);
    const [searchError, setSearchError] = useState(null);
    const { validationSchema, initialValues } = useSoilCalculatorValidations();
    const [formValues, setFormValues] = useState(initialValues);
    const {
        data: assessmentResult,
        mutate: submitAssessment,
        isPending,
    } = useMutation({
        mutationFn: assessSoil,
        onSuccess: () => setCurrentStep(2),
        onError: (error) => {
            console.error("Assessment Error:", error);
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

            submitAssessment({
                crop_id: crop.id,
                ph: parseFloat(values.ph),
                salinity: parseFloat(values.salinity),
                temperature: parseFloat(values.temperature),
            });
        } catch (error) {
            console.error("Soil assessment failed:", error);
            setSearchError("An error occurred during soil assessment.");
        } finally {
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
        }
    };

    const handleCloseModal = () => {
        dispatch(setSoilCalculatorOpen(false));
        setCurrentStep(1);
        setSearchError(null);
        setFormValues(initialValues);
    };

    const goToNextStep = () => setCurrentStep((s) => Math.min(s + 1, 3));
    const goToPrevStep = () => setCurrentStep((s) => Math.max(s - 1, 1));

    return {
        currentStep,
        searchError,
        assessmentResult,
        isPending,
        validationSchema,
        initialValues,
        handleOpenModal,
        handleCloseModal,
        handleSubmit,
        goToNextStep,
        goToPrevStep,
        formValues,
        resetForm: () => setFormValues(initialValues)
    };
}
