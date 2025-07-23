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
            .required(t("required_field_key")),
        uploaded_pdf: Yup.mixed()
            .nullable()
            .test('fileType', t("invalid_file_type_key"), (value) => {
                if (!value) return true; // Allow empty (optional field)
                return value && value.type === "application/pdf";
            })
    });

    const initialValues = {
        crop_name: "",
        ph: "",
        salinity: "",
        temperature: "",
        uploaded_pdf: null
    };

    return { validationSchema, initialValues };
};