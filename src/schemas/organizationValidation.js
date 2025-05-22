import * as Yup from 'yup';
export const organizationSchema = (t) => Yup.object().shape({
    name: Yup.string()
        .required(t("required_field_key"))
    ,
    description: Yup.string()
        .nullable()
    ,
});