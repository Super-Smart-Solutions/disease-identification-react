import React from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useUserData } from "../../../hooks/useUserData";
import tokenManager from "../../helpers/tokenManager";
import Button from "../../Button";
import PasswordInput from "../../Formik/PasswordInput";

export default function ResetPassword() {
  const { t } = useTranslation();
  const { resetUserPassword } = useUserData();
  const navigate = useNavigate();

  const validationSchema = Yup.object({
    email: Yup.string()
      .email(t("invalid_email_key"))
      .required(t("required_key")),
    new_password: Yup.string()
      .min(6, t("password_min_key"))
      .required(t("required_key")),
  });

  const initialValues = {
    email: "",
    new_password: "",
  };

  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      const token = tokenManager.getAccessToken();
      await resetUserPassword({
        email: values.email,
        token,
        new_password: values.new_password,
      });
      toast.success(t("password_reset_success_key"));
      navigate("/login");
    } catch (error) {
      toast.error(error || t("password_reset_failed_key"));
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
        {/* Left Image - hidden on mobile */}
        <div className="hidden md:block w-1/2 bg-gray-100">
          <img
            src="/reset-password.png"
            alt="Reset Password"
            className="h-full w-full object-cover"
          />
        </div>

        {/* Right Form */}
        <div className="w-full md:w-1/2 p-6 md:p-10 flex flex-col justify-center">
          <span className="text-2xl font-semibold mb-6">
            {t("reset_password_key")}
          </span>

          <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
          >
            {({ isSubmitting, setFieldValue }) => (
              <Form className="space-y-4">
                {/* Email */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {t("email_key")}
                  </label>
                  <Field type="email" name="email" className="custom-input" placeholder={t("email_key")} />
                  <ErrorMessage
                    name="email"
                    component="div"
                    className="text-red-500 text-sm mt-1"
                  />
                </div>

                {/* New Password */}
                <div>
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
                </div>

                {/* Submit */}
                <Button
                  loading={isSubmitting}
                  type="submit"
                  disabled={isSubmitting}
                  width="full"
                >
                  {t("save_key")}
                </Button>
              </Form>
            )}
          </Formik>
        </div>
      </motion.div>
    </div>
  );
}
