import React, { useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { Link, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useUserData } from "../../../hooks/useUserData";
import Button from "../../Button";
import PasswordInput from "../../Formik/PasswordInput";

export default function ResetPassword() {
  const { t } = useTranslation();
  const { resetUserPassword, requestOTP } = useUserData();
  const navigate = useNavigate();
  const [isOtpRequested, setIsOtpRequested] = useState(false);

  const validationSchema = Yup.object({
    email: Yup.string()
      .email(t("invalid_email_key"))
      .required(t("required_key")),
    otp: isOtpRequested
      ? Yup.string().required(t("required_key"))
      : Yup.string(),
    new_password: isOtpRequested
      ? Yup.string().min(6, t("password_min_key")).required(t("required_key"))
      : Yup.string(),
  });

  const initialValues = {
    email: "",
    otp: "",
    new_password: "",
  };

  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      if (!isOtpRequested) {
        await requestOTP(values.email);
        setIsOtpRequested(true);
        toast.success(t("otp_sent_key"));
      } else {
        await resetUserPassword({
          email: values.email,
          token: values.otp,
          new_password: values.new_password,
        });
        toast.success(t("password_reset_success_key"));
        navigate("/auth/login");
      }
    } catch (error) {
      toast.error(isOtpRequested && t("password_reset_failed_key"));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="absolute mx-auto w-full mt-50">
      <motion.div
        className="flex flex-col md:flex-row items-center md:items-stretch bg-white rounded-lg shadow-lg overflow-hidden max-w-4xl w-full mx-auto"
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <div className="hidden md:block w-1/2 bg-gray-100">
          <img
            src="/reset-password.png"
            alt="Reset Password"
            className="h-full w-full object-cover"
          />
        </div>

        <div className="w-full md:w-1/2 p-6 md:p-10 flex flex-col justify-center">
          <span className="text-2xl font-semibold">
            {t("reset_password_key")}
          </span>
          <span className="my-6 text-gray-700 text-sm">
            {t("reset_password_desc_key")}
          </span>

          <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
          >
            {({ isSubmitting, setFieldValue }) => (
              <Form className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {t("email_key")}
                  </label>
                  <Field
                    type="email"
                    name="email"
                    className="custom-input"
                    placeholder={t("email_key")}
                    readOnly={isOtpRequested}
                  />
                  <ErrorMessage
                    name="email"
                    component="div"
                    className="text-red-500 text-sm mt-1"
                  />
                </div>

                {isOtpRequested && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    transition={{ duration: 0.3 }}
                  >
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      {t("otp_key")}
                    </label>
                    <Field
                      type="text"
                      name="otp"
                      className="custom-input"
                      placeholder={t("otp_key")}
                    />
                    <ErrorMessage
                      name="otp"
                      component="div"
                      className="text-red-500 text-sm mt-1"
                    />
                  </motion.div>
                )}

                {isOtpRequested && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    transition={{ duration: 0.3 }}
                  >
                    <Field name="new_password">
                      {({ field }) => (
                        <PasswordInput
                          label={t("new_password_key")}
                          value={field.value}
                          onChange={(value) =>
                            setFieldValue("new_password", value)
                          }
                          placeholder={t("new_password_key")}
                        />
                      )}
                    </Field>
                    <ErrorMessage
                      name="new_password"
                      component="div"
                      className="text-red-500 text-sm mt-1"
                    />
                  </motion.div>
                )}

                <Button
                  loading={isSubmitting}
                  type="submit"
                  disabled={isSubmitting}
                  width="full"
                  className={`mb-2`}
                >
                  {isOtpRequested ? t("save_key") : t("send_otp_key")}
                </Button>
              </Form>
            )}
          </Formik>
          <Link
            to="/auth/login"
            className="text-blue-500 hover:underline text-sm
 relative mt-auto mx-auto"
          >
            {t("back_to_login_key")}
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
