import React, { useState } from "react";
import { Formik, Field, ErrorMessage, Form } from "formik";
import { useTranslation } from "react-i18next";
import PasswordInput from "../../Formik/PasswordInput"; // Import your PasswordInput component
import PhoneInput from "../../Formik/PhoneInput"; // Import your PhoneInput component
import Button from "../../Button";
import OTPModal from "../../Formik/OTPModal";
import {
  registerUser,
  requestVerifyToken,
  verifyEmail,
} from "../../../api/authAPI";
import { useNavigate } from "react-router-dom";

export default function RegisterStepTwo({
  registerData,
  setRegisterData,
  step,
  setStep,
}) {
  const [otpModal, setOtpModal] = useState(false);
  const { t } = useTranslation(); // Translation hook
  const navigate = useNavigate(); // Translation hook

  // Initial form values
  const initialValues = {
    email: registerData.email || "",
    password: registerData.password || "",
    re_password: registerData.re_password || "",
    phone_number: registerData.phone_number || "",
  };
  // Validation function
  const validate = (values) => {
    const errors = {};

    // Email validation
    if (!values.email) {
      errors.email = t("email_required_key");
    } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(values.email)) {
      errors.email = t("email_invalid_key");
    }

    // Password validation
    if (!values.password) {
      errors.password = t("password_required_key");
    } else if (values.password.length < 8) {
      errors.password = t("password_min_length_key");
    }

    // Confirm password validation
    if (!values.re_password) {
      errors.re_password = t("re_password_required_key");
    } else if (values.re_password !== values.password) {
      errors.re_password = t("passwords_do_not_match_key");
    }

    // Phone number validation
    if (!values.phone_number) {
      errors.phone_number = t("phone_number_required_key");
    } else if (!/^\d+$/.test(values.phone_number)) {
      errors.phone_number = t("phone_number_invalid_key");
    }

    return errors;
  };
  // Handle form submission
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
      await requestVerifyToken(payload?.email);
      setOtpModal(true);
    } catch (error) {
      console.log(error);
    }
  };
  const onOTPSubmit = async (otp) => {
    try {
      await verifyEmail(otp);
      if (registerData?.user_type === "individual") {
        navigate("/login");
      } else {
        setStep(step + 1);
      }
    } catch (error) {
      console.log(error);
    } finally {
      if (registerData?.user_type === "individual") {
        navigate("/login");
      } else {
        setStep(step + 1);
      }
      setOtpModal(false);
    }
  };

  return (
    <>
      {" "}
      <Formik
        initialValues={initialValues}
        validate={validate}
        onSubmit={onSubmit}
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
                    value={field.value}
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
