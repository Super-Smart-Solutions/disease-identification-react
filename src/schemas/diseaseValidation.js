import * as Yup from 'yup';
export const diseaseSchema = (t) => Yup.object().shape({
    english_name: Yup.string()
        .required(t("required_field_key"))
    ,
    arabic_name: Yup.string()
        .required(t("required_field_key"))
    ,
    scientific_name: Yup.string()
        .required(t("required_field_key"))
    ,
    treatments: Yup.string()
    ,
    symptoms: Yup.string()
    ,
    description: Yup.string()
        .nullable()
    ,
});