import * as Yup from "yup";

const phoneRegExp = /^[0-9+\-\(\) ]*$/;

export const profileFormValidation = (t) => Yup.object({
    first_name: Yup.string()

        .required(t("required_field_key")),
    last_name: Yup.string()

        .required("Last name is required"),
    email: Yup.string()
        .email(t("not_valid_field_key"))
        .required(t("required_field_key"))
    ,
    phone_number: Yup.string()
        .matches(phoneRegExp, t("not_valid_field_key"))
        .optional(),
});
