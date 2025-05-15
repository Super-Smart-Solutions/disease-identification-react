import * as Yup from 'yup';
export const diseaseSchema = (t) => Yup.object().shape({
    english_name: Yup.string()
        .required(t("required_key"))
    ,
    arabic_name: Yup.string()
        .required(t("required_key"))
    ,
    scientific_name: Yup.string()
        .required(t("required_key"))
    ,
    description: Yup.string()
        .nullable()
    ,
});