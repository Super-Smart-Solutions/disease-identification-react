import React from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import authImage from "../../../assets/auth.png";
import * as Yup from "yup";
import { Link, useNavigate } from "react-router-dom";
import Button from "../../Button";
import PasswordInput from "../../Formik/PasswordInput";
import { useAuthActions } from "../../helpers/authHelpers";

export default function Login() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { login } = useAuthActions();

  const initialValues = {
    username: "",
    password: "",
  };

  const validationSchema = Yup.object({
    username: Yup.string().required(t("username_required_key")),
    password: Yup.string()
      .min(6, t("password_min_length_key"))
      .required(t("required_field_key")),
  });

  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      await login(values);
      navigate(localStorage.getItem("redirectPath").toString() || "/models");
    } catch (error) {
      console.error("Login failed", error);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <motion.div
      className="w-full py-6"
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -50 }}
      transition={{ duration: 0.5 }}
    >
      <div className="flex items-center justify-center ">
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
              validationSchema={validationSchema}
              onSubmit={handleSubmit}
            >
              {({ isSubmitting, setFieldValue }) => (
                <Form className="w-full flex flex-col gap-4">
                  <div>
                    <label
                      className="block text-sm font-medium text-gray-700 mb-1"
                      htmlFor="username"
                    >
                      {t("username_key")}
                    </label>
                    <Field
                      type="username"
                      name="username"
                      className="custom-input"
                      placeholder={t("username_key")}
                    />
                    <ErrorMessage
                      name="username"
                      component="div"
                      className="text-red-500"
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
                        />
                      )}
                    </Field>
                    <ErrorMessage
                      name="password"
                      component="div"
                      className="text-red-500"
                    />
                  </div>
                  <Button
                    type="submit"
                    loading={isSubmitting}
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
