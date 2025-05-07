import { useTranslation } from "react-i18next";
import ModelingStepOne from "../../../Components/pages/models/ModelingStepOne";
import ModelingStepTwo from "../../../Components/pages/models/ModelingStepTwo";
import ModelingStepThree from "../../../Components/pages/models/ModelingStepThree";
import ModelingStepFour from "../../../Components/pages/models/ModelingStepFour";
import DeepAnalysisStep from "../../../Components/pages/models/DeepAnalysisStep";

export const useModelingStepsConfig = (getStepDisabledState) => {
    const { t } = useTranslation();

    return [
        {
            id: 1,
            title: t("select_model_key"),
            component: ModelingStepOne,
            disabled: false,
        },
        {
            id: 2,
            title: t("select_image_key"),
            component: ModelingStepTwo,
            disabled: getStepDisabledState[2],
        },
        {
            id: 3,
            title: t("processing_image_key"),
            component: ModelingStepThree,
            disabled: getStepDisabledState[3],
        },
        {
            id: 4,
            title: t("result_key"),
            component: ModelingStepFour,
            disabled: getStepDisabledState[4],
        },
        {
            id: 5,
            title: t("deep_analytics_key"),
            component: DeepAnalysisStep,
            disabled: getStepDisabledState[5],
        },
    ];
};