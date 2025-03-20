import React from "react";
import { Formik, Field, ErrorMessage, Form } from "formik";
import { useTranslation } from "react-i18next";
import Button from "../../Button";

export default function RegisterStepOne({
  registerData,
  setRegisterData,
  step,
  setStep,
}) {
  const { t } = useTranslation(); // Translation hook

  // Initial form values
  const initialValues = {
    first_name: registerData.first_name || "",
    last_name: registerData.last_name || "",
    user_type: registerData.user_type || "", // "individual" or "company"
  };

  // Validation function
  const validate = (values) => {
    const errors = {};

    if (!values.first_name) {
      errors.first_name = t("first_name_required_key");
    }
    if (!values.last_name) {
      errors.last_name = t("last_name_required_key");
    }
    if (!values.user_type) {
      errors.user_type = t("user_type_required_key");
    }

    return errors;
  };

  // Handle form submission
  const onSubmit = (values) => {
    setRegisterData((prev) => ({ ...prev, ...values })); // Update registerData
    setStep(step + 1); // Move to the next step
  };

  return (
    <Formik
      initialValues={initialValues}
      validate={validate}
      onSubmit={onSubmit}
    >
      {() => (
        <Form className="flex flex-col gap-4 justify-between w-full h-full">
          {/* First Name Field */}
          <div className="flex flex-col gap-1">
            <label htmlFor="first_name">{t("first_name_key")}</label>
            <Field
              type="text"
              id="first_name"
              name="first_name"
              className="custom-input"
              placeholder={t("first_name_key")}
            />
            <ErrorMessage
              name="first_name"
              component="div"
              className="text-red-500 text-sm"
            />
          </div>

          {/* Last Name Field */}
          <div className="flex flex-col gap-1">
            <label htmlFor="last_name">{t("last_name_key")}</label>
            <Field
              type="text"
              id="last_name"
              name="last_name"
              className="custom-input"
              placeholder={t("last_name_key")}
            />
            <ErrorMessage
              name="last_name"
              component="div"
              className="text-red-500 text-sm"
            />
          </div>

          {/* User Type Radio Buttons */}
          <div className="flex flex-col gap-1">
            <label>{t("user_type_key")}</label>
            <div className="flex gap-4">
              <label className="flex items-center gap-2">
                <Field
                  type="radio"
                  name="user_type"
                  value="individual"
                  className="form-radio"
                />
                {t("individual_key")}
              </label>
              <label className="flex items-center gap-2">
                <Field
                  type="radio"
                  name="user_type"
                  value="company"
                  className="form-radio"
                />
                {t("orgnization_key")}
              </label>
            </div>
            <ErrorMessage
              name="user_type"
              component="div"
              className="text-red-500 text-sm"
            />
          </div>
          <Button type="submit">{t("complete_data_key")}</Button>
        </Form>
      )}
    </Formik>
  );
}
