import React, { useEffect, useState } from "react";
import { Formik, Field, ErrorMessage, Form } from "formik";
import { useTranslation } from "react-i18next";
import PasswordInput from "../../Formik/PasswordInput";
import PhoneInput from "../../Formik/PhoneInput";
import Button from "../../Button";
import OTPModal from "../../Formik/OTPModal";
import { useLocation } from "react-router-dom";

import { registerUser } from "../../../api/authAPI";
import {
  generateVerificationCode,
  verifyCode,
} from "../../../api/verificationAPI";

export default function RegisterStepTwo({
  registerData,
  setRegisterData,
  step,
  setStep,
}) {
  const [otpModal, setOtpModal] = useState(false);
  const { t } = useTranslation();
  const location = useLocation();
  const [prefilledEmail, setPrefilledEmail] = useState("");

  const initialValues = {
    email: prefilledEmail || registerData.email || "",
    password: registerData.password || "",
    re_password: registerData.re_password || "",
    phone_number: registerData.phone_number || "",
  };
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const email = params.get("email");
    if (email) {
      setPrefilledEmail(email);
    }
    setRegisterData((prev) => ({ ...prev, email: email }));
  }, [location.search, step]);

  const validate = (values) => {
    const errors = {};

    if (!values.email) {
      errors.email = t("email_required_key");
    } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(values.email)) {
      errors.email = t("email_invalid_key");
    }

    if (!values.password) {
      errors.password = t("password_required_key");
    } else if (values.password.length < 8) {
      errors.password = t("password_min_length_key");
    }

    if (!values.re_password) {
      errors.re_password = t("re_password_required_key");
    } else if (values.re_password !== values.password) {
      errors.re_password = t("passwords_do_not_match_key");
    }

    if (!values.phone_number) {
      errors.phone_number = t("phone_number_required_key");
    } else if (!/^\d+$/.test(values.phone_number)) {
      errors.phone_number = t("phone_number_invalid_key");
    }

    return errors;
  };

  const onSubmit = async (values) => {
    setRegisterData((prev) => ({ ...prev, ...values }));
    const payload = {
      first_name: registerData?.first_name,
      last_name: registerData?.last_name,
      phone_number: values?.phone_number,
      email: values?.email,
      password: values?.password,
      organization_id: null,
    };
    try {
      await registerUser(payload);
      await generateVerificationCode(payload?.email);
      setOtpModal(true);
    } catch (error) {
      console.log(error);
    }
  };
  const onOTPSubmit = async (otp) => {
    try {
      const response = await verifyCode(registerData?.email, otp);
      setStep(step + 1);
      setRegisterData((prev) => ({ ...prev, token: response?.access_token }));
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      {" "}
      <Formik
        initialValues={initialValues}
        validate={validate}
        onSubmit={onSubmit}
        enableReinitialize
      >
        {({ setFieldValue, isSubmitting }) => (
          <Form className="flex flex-col gap-4">
            {/* Email Field */}
            <div className="flex flex-col gap-1">
              <label htmlFor="email">{t("email_key")}</label>
              <Field
                type="email"
                id="email"
                name="email"
                className="custom-input"
                placeholder={t("email_key")}
                readOnly={!!prefilledEmail}
              />
              <ErrorMessage
                name="email"
                component="div"
                className="text-red-500 text-sm"
              />
            </div>

            {/* Password Field */}
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

            {/* Confirm Password Field */}
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

            {/* Phone Number Field */}
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

            {/* Submit Button */}
            <Button loading={isSubmitting} type="submit">
              {t("complete_data_key")}
            </Button>

            <OTPModal
              isOpen={otpModal}
              onClose={() => {
                setOtpModal(false);
              }}
              onSubmit={(otp) => {
                onOTPSubmit(otp);
              }}
            />
          </Form>
        )}
      </Formik>
    </>
  );
}
