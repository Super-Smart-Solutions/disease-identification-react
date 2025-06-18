import React from "react";
import { Formik, Field, ErrorMessage, Form } from "formik";
import { useTranslation } from "react-i18next";
import Button from "../../Button";

const RegisterStepOne = ({
  registerData,
  validateStepOne,
  handleStepOneSubmit,
}) => {
  const { t } = useTranslation();

  const initialValues = {
    first_name: registerData.first_name || "",
    last_name: registerData.last_name || "",
    user_type: registerData.user_type || "individual",
  };

  return (
    <Formik
      initialValues={initialValues}
      validate={validateStepOne}
      onSubmit={handleStepOneSubmit}
    >
      {() => (
        <Form className="flex flex-col gap-4 justify-between w-full h-full">
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

          <Button type="submit">{t("complete_data_key")}</Button>
        </Form>
      )}
    </Formik>
  );
};

export default RegisterStepOne;
