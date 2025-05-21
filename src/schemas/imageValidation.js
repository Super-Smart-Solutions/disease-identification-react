// imageValidation.js
import * as Yup from "yup";

export const getImageValidationSchema = (t, isEdit) => {
    return Yup.object().shape({
        name: Yup.string(),
        image_type: Yup.string(),
        plant_id: Yup.string().required(t("select_plant_required_key")),
        disease_id: Yup.string().required(t("select_disease_required_key")),

    });
};