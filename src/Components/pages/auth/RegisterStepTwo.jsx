import React from "react";
import { Formik, Field, ErrorMessage, Form } from "formik";
import { useTranslation } from "react-i18next";
import PasswordInput from "../../Formik/PasswordInput";
import PhoneInput from "../../Formik/PhoneInput";
import Button from "../../Button";
import OTPModal from "../../Formik/OTPModal";

const RegisterStepTwo = ({
  registerData,
  validateStepTwo,
  handleStepTwoSubmit,
  otpModal,
  setOtpModal,
  handleOTPSubmit,
  invited,
}) => {
  const { t } = useTranslation();

  const initialValues = {
    email: registerData.email || "",
    password: registerData.password || "",
    re_password: registerData.re_password || "",
    phone_number: registerData.phone_number || "",
  };

  return (
    <Formik
      initialValues={initialValues}
      validate={validateStepTwo}
      onSubmit={handleStepTwoSubmit}
      enableReinitialize
    >
      {({ setFieldValue, isSubmitting }) => (
        <Form className="flex flex-col gap-4">
          <div className="flex flex-col gap-1">
            <label htmlFor="email">{t("email_key")}</label>
            <Field
              type="email"
              id="email"
              name="email"
              className="custom-input"
              placeholder={t("email_key")}
              readOnly={invited}
            />
            <ErrorMessage
              name="email"
              component="div"
              className="text-red-500 text-sm"
            />
          </div>

          <div className="flex flex-col gap-1">
            <Field name="password">
              {({ field }) => (
                <PasswordInput
                  label={t("password_key")}
                  value={field.value}
                  onChange={(value) => setFieldValue("password", value)}
                  placeholder={t("password_key")}
                />
              )}
            </Field>
            <ErrorMessage
              name="password"
              component="div"
              className="text-red-500 text-sm"
            />
          </div>

          <div className="flex flex-col gap-1">
            <Field name="re_password">
              {({ field }) => (
                <PasswordInput
                  label={t("re_password_key")}
                  value={field.value}
                  onChange={(value) => setFieldValue("re_password", value)}
                  placeholder={t("re_password_key")}
                />
              )}
            </Field>
            <ErrorMessage
              name="re_password"
              component="div"
              className="text-red-500 text-sm"
            />
          </div>

          <div className="flex flex-col gap-1">
            <label htmlFor="phone_number">{t("phone_number_key")}</label>
            <Field name="phone_number">
              {({ field }) => (
                <PhoneInput
                  initialPhoneNumber={field.value}
                  onChange={({ phoneNumber }) =>
                    setFieldValue("phone_number", phoneNumber)
                  }
                  placeholder={t("phone_number_key")}
                />
              )}
            </Field>
            <ErrorMessage
              name="phone_number"
              component="div"
              className="text-red-500 text-sm"
            />
          </div>

          <Button loading={isSubmitting} type="submit">
            {t("complete_data_key")}
          </Button>

          <OTPModal
            isOpen={otpModal}
            onClose={() => setOtpModal(false)}
            onSubmit={handleOTPSubmit}
          />
        </Form>
      )}
    </Formik>
  );
};

export default RegisterStepTwo;
