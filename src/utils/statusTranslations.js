export const getStatusTranslation = (status, t) => {
    switch (status) {
        case 0:
            return t("created_key");
        case 1:
            return t("image_valid_key");
        case -1:
            return t("image_invalid_key");
        case 2:
            return t("detection_completed_key");
        case -2:
            return t("detection_inconclusive_key");
        case 3:
            return t("deep_analysis_completed_key");
        case -3:
            return t("deep_analysis_failed_key");
        case 4:
            return t("attention_analysis_completed_key");
        case -4:
            return t("attention_analysis_failed_key");
        default:
            return "----";
    }
};