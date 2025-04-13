import React from "react";
import { Formik, Field, ErrorMessage, Form } from "formik";
import { useTranslation } from "react-i18next";
import Button from "../../Button";
import { createOrganization } from "../../../api/organizationsApi";
export default function CreateOrganization({ onSuccess, onCancel }) {
  const { t } = useTranslation();

  const initialValues = {
    name: "",
    describtion: "",
  };

  const validate = (values) => {
    const errors = {};

    if (!values.name) {
      errors.name = t("name_required_key");
    }
    if (!values.describtion) {
      errors.describtion = t("describtion_required_key");
    }

    return errors;
  };

  const onSubmit = async (values, { setSubmitting }) => {
    try {
      await createOrganization(values);
      onSuccess(); // This will close the modal and refresh data
    } catch (error) {
      console.error("Organization creation failed", error);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Formik
      initialValues={initialValues}
      validate={validate}
      onSubmit={onSubmit}
    >
      {({ isSubmitting }) => (
        <Form className="flex flex-col gap-4"> 
        <span className=" text-xl me-auto ">{t("create_team_key")}</span>
          <div className="flex flex-col gap-1">
            <label htmlFor="name">{t("name_key")}</label>
            <Field
              type="text"
              id="name"
              name="name"
              className="custom-input"
              placeholder={t("name_key")}
            />
            <ErrorMessage
              name="name"
              component="div"
              className="text-red-500 text-sm"
            />
          </div>

          <div className="flex flex-col gap-1">
            <label htmlFor="describtion">{t("describtion_key")}</label>
            <Field
              type="text"
              id="describtion"
              name="describtion"
              className="custom-input"
              placeholder={t("describtion_key")}
            />
            <ErrorMessage
              name="describtion"
              component="div"
              className="text-red-500 text-sm"
            />
          </div>

          <div className="flex gap-2 justify-end">
            <Button type="button" variant="outlined" onClick={onCancel}>
              {t("close_key")}
            </Button>
            <Button type="submit" loading={isSubmitting}>
              {t("save_key")}
            </Button>
          </div>
        </Form>
      )}
    </Formik>
  );
}
