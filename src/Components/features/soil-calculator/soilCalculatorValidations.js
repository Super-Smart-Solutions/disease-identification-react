import * as Yup from "yup";
import { useTranslation } from "react-i18next";

export const useSoilCalculatorValidations = () => {
    const { t } = useTranslation();

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
        temperature: Yup.number()
            .typeError(t("must_be_a_number_key"))
            .min(-100, t("temperature_min_error_key"))
            .max(100, t("temperature_max_error_key"))
            .required(t("required_field_key"))
    });

    const initialValues = {
        crop_name: "",
        ph: "",
        salinity: "",
        temperature: "",
    };

    return { validationSchema, initialValues };
};