import { useState, useEffect, useMemo } from "react";

export function useModelingSteps(modelingData) {
    const [expandedSteps, setExpandedSteps] = useState({
        1: true,
        2: false,
        3: false,
        4: false,
        5: false,
    });

    const activeStep = useMemo(() => {
        if (!modelingData?.category?.value) return 1;
        if (!modelingData?.image_id || modelingData?.selected_file?.length === 0) return 2;
        if (!modelingData?.inference_id || !modelingData?.is_final) return 3;
        if (!modelingData?.is_deep) return 4;
        return 5;
    }, [modelingData]);

    useEffect(() => {
        setExpandedSteps(prev => {
            const newExpandedSteps = { ...prev };
            Object.keys(newExpandedSteps).forEach(key => {
                newExpandedSteps[key] = parseInt(key) === activeStep;
            });
            return newExpandedSteps;
        });
    }, [activeStep]);

    const getStepDisabledState = useMemo(() => ({
        2: !modelingData?.category?.value,
        3: modelingData?.selected_file?.length === 0 || !modelingData?.category?.value,
        4: !modelingData?.is_final || modelingData?.selected_file?.length === 0 || !modelingData?.category?.value,
        5: !modelingData?.is_deep || !modelingData?.is_final || modelingData?.selected_file?.length === 0 || !modelingData?.category?.value,
    }), [modelingData]);

    const handleToggleExpand = (stepId) => {
        setExpandedSteps(prev => ({
            ...prev,
            [stepId]: !prev[stepId],
        }));
    };

    return {
        expandedSteps,
        activeStep,
        getStepDisabledState,
        handleToggleExpand,
    };
}