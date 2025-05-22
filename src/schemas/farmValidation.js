import * as Yup from 'yup';

export const farmSchema = (t) => Yup.object().shape({
    name: Yup.string()
        .required(t("required_field_key")),
    location: Yup.string()
        .required(t("required_field_key")),
    weather: Yup.string()
        .required(t("required_field_key")),
});
