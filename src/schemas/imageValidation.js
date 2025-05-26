// imageValidation.js
import * as Yup from "yup";

export const getImageValidationSchema = (t, isEdit) => {
    return Yup.object().shape({
        name: Yup.string(),
        image_type: Yup.string(),
        plant_id: Yup.string().required(t("required_field_key")),
        disease_id: Yup.string().required(t("required_field_key")),

    });
};