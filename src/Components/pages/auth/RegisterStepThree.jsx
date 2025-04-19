import React from "react";
import { Formik, Field, ErrorMessage, Form } from "formik";
import { useTranslation } from "react-i18next";
import Button from "../../Button";
import { createOrganization } from "../../../api/organizationsApi";
import { useNavigate } from "react-router-dom";

export default function RegisterStepThree({
  registerData,
  setRegisterData,
  step,
  setStep,
}) {
  const { t } = useTranslation(); // Translation hook
  const navigate = useNavigate(); // Translation hook

  // Initial form values
  const initialValues = {
    name: registerData.name || "",
    describtion: registerData.describtion || "",
  };

  // Validation function
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

  // Handle form submission
  const onSubmit = async (values, { setSubmitting }) => {
    try {
      const response = await createOrganization(values);
      navigate("/auth/login");
    } catch (error) {
      console.error("Login failed", error);
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
        <Form className="flex flex-col gap-4 justify-between w-full h-full">
          {/* First Name Field */}
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

          {/* Last Name Field */}
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

          <Button loading={isSubmitting} type="submit">
            {t("complete_data_key")}
          </Button>
        </Form>
      )}
    </Formik>
  );
}
