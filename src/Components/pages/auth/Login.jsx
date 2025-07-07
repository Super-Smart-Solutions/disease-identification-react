import React from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import authImage from "../../../assets/auth.png";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import Button from "../../Button";
import PasswordInput from "../../Formik/PasswordInput";
import { loginValidationSchema } from "./../../../schemas/loginValidations";
import { useUserData } from "../../../hooks/useUserData";

export default function Login() {
  const { t } = useTranslation();
  const { login } = useUserData();

  const initialValues = {
    username: "",
    password: "",
  };

  const handleSubmit = async (values) => {
    try {
      await login(values);
      toast.success(t("login_success_key") || "Login successful!");
    } catch (error) {
      console.error("Login failed", error);
    }
  };

  return (
    <motion.div
      className=" absolute mx-auto w-full mt-30 "
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -50 }}
      transition={{ duration: 0.5 }}
    >
      <div className="flex items-center justify-center">
        <div className="flex bg-white shadow-lg rounded-lg w-full max-w-4xl h-[60vh]">
          {/* Left: Auth Image */}
          <div className="w-1/2 hidden md:flex justify-center items-center rounded-lg bg-gray-100">
            <img
              loading="lazy"
              src={authImage}
              alt="Authentication"
              className="w-full h-full object-cover rtl:rounded-r-lg ltr:rounded-l-lg"
            />
          </div>

          {/* Right: Login Form */}
          <div className="w-full md:w-2/3 p-6 flex flex-col justify-center items-center">
            <h2 className="text-2xl font-bold mb-6 me-auto">
              {t("login_key")}
            </h2>
            <Formik
              initialValues={initialValues}
              validationSchema={loginValidationSchema(t)}
              onSubmit={handleSubmit}
              validateOnChange={false}
              validateOnBlur={true}
              onInvalidSubmit={({ errors }) => {
                Object.values(errors).forEach((error) => {
                  toast.error(error);
                });
              }}
            >
              {({ isSubmitting, setFieldValue, errors, touched }) => (
                <Form className="w-full flex flex-col gap-4">
                  <div>
                    <label
                      className="block text-sm font-medium text-gray-700 mb-1"
                      htmlFor="username"
                    >
                      {t("username_key")}
                    </label>
                    <Field
                      type="text"
                      name="username"
                      className={`custom-input ${
                        errors.username && touched.username
                          ? "border-red-500"
                          : ""
                      }`}
                      placeholder={t("username_key")}
                    />
                    <ErrorMessage
                      name="username"
                      render={(msg) => (
                        <motion.div
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          transition={{ duration: 0.3 }}
                          className="text-red-500 text-sm mt-1"
                        >
                          {msg}
                        </motion.div>
                      )}
                    />
                  </div>
                  <div>
                    <Field name="password">
                      {({ field }) => (
                        <PasswordInput
                          label={t("password_key")}
                          value={field.value}
                          onChange={(value) => setFieldValue("password", value)}
                          placeholder={t("password_key")}
                          className={
                            errors.password && touched.password
                              ? "border-red-500"
                              : ""
                          }
                        />
                      )}
                    </Field>
                    <ErrorMessage
                      name="password"
                      render={(msg) => (
                        <motion.div
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          transition={{ duration: 0.3 }}
                          className="text-red-500 text-sm mt-1"
                        >
                          {msg}
                        </motion.div>
                      )}
                    />
                  </div>
                  <Button
                    type="submit"
                    loading={isSubmitting}
                    disabled={isSubmitting}
                    className="w-full"
                  >
                    {t("login_key")}
                  </Button>
                </Form>
              )}
            </Formik>
            <p className="mt-4">
              {t("no_account_key")}
              <Link
                to="/auth/register"
                className="text-blue-500 hover:underline mx-2"
              >
                {t("register_key")}
              </Link>
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
