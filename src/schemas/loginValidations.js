import * as Yup from "yup";

export const loginValidationSchema = (t) =>
    Yup.object({
        username: Yup.string().required(t("username_required_key")),
        password: Yup.string()
            .min(6, t("password_min_length_key"))
            .required(t("required_field_key")),
    });