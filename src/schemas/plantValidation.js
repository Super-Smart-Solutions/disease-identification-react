import * as Yup from 'yup';
export const plantSchema = (t) => Yup.object().shape({
    english_name: Yup.string()
        .required(t("required_key"))
        .max(100, t("max_characters_key", { field: t("english_name_key"), max: 100 })),

    arabic_name: Yup.string()
        .required(t("required_key"))
        .max(100, t("max_characters_key", { field: t("arabic_name_key"), max: 100 })),

    scientific_name: Yup.string()
        .required(t("required_key"))
        .max(100, t("max_characters_key", { field: t("scientific_name_key"), max: 100 })),

    description: Yup.string()
        .nullable()
        .max(500, t("max_characters_key", { field: t("description_key"), max: 500 }))
});