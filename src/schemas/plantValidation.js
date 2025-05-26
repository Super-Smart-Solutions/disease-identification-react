import * as Yup from 'yup';
export const plantSchema = (t) => Yup.object().shape({
    english_name: Yup.string()
        .required(t("required_field_key"))
    ,
    arabic_name: Yup.string()
        .required(t("required_field_key"))
    ,
    scientific_name: Yup.string()
        .required(t("required_field_key"))
    ,
    description: Yup.string()
        .nullable()
    ,
});