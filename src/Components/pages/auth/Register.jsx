import React, { useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import RegisterStepOne from "./RegisterStepOne";
import RegisterStepTwo from "./RegisterStepTwo";
import RegisterStepThree from "./RegisterStepThree";
import { useTranslation } from "react-i18next";
import authImage from "../../../assets/auth.png"; // Adjust path if necessary
import AvatarStep from "./AvatarStep";

export default function Register() {
  const { t } = useTranslation();
  const [registerData, setRegisterData] = useState({
    email: "",
    password: "",
    is_active: true,
    is_superuser: true,
    is_verified: true,
    organization_id: 0,
    first_name: "",
    last_name: "",
    user_type: null,
    token: null,
  });
  const [step, setStep] = useState(1);

  // Validation functions for each step
  const validateStepOne = () => {
    return (
      registerData.first_name &&
      registerData.last_name &&
      registerData.user_type
    );
  };

  const validateStepTwo = () => {
    return registerData.email && registerData.password;
  };

  const handleStepClick = (newStep) => {
    if (newStep < step) {
      // Allow going back to previous steps without validation
      setStep(newStep);
    } else {
      // Validate current step before proceeding
      if (step === 1 && validateStepOne()) {
        setStep(newStep);
      } else if (step === 2 && validateStepTwo()) {
        setStep(newStep);
      } else if (step === 3) {
        // Handle final submission or next steps
        setStep(newStep);
      }
    }
  };

  const steps = [
    {
      component: (
        <RegisterStepOne
          step={step}
          setStep={handleStepClick}
          registerData={registerData}
          setRegisterData={setRegisterData}
        />
      ),
      label: t("Step 1"),
    },
    {
      component: (
        <RegisterStepTwo
          step={step}
          setStep={handleStepClick}
          registerData={registerData}
          setRegisterData={setRegisterData}
        />
      ),
      label: t("Step 2"),
    },
    {
      component: <AvatarStep registerData={registerData} />,
      label: t("Step 3"),
    },
  ];

  return (
    <div className="flex items-center justify-center  py-6">
      <div className="flex bg-white shadow-lg rounded-lg w-full max-w-4xl">
        {/* Left: Auth Image */}
        <div className="w-1/2 hidden md:flex justify-center items-center bg-gray-100">
          <img
            loading="lazy"
            src={authImage}
            alt="Authentication"
            className="w-full h-full object-cover rtl:rounded-r-lg ltr:rounded-l-lg"
          />
        </div>

        {/* Right: Stepper Content */}
        <div className="w-full md:w-2/3 p-6 flex flex-col justify-between gap-12 items-center h-[100%]">
          {/* Step Indicator */}
          <div className="w-full">
            <div className="flex items-center justify-between mb-6 w-full">
              {steps.map((_, index) => (
                <div
                  key={index}
                  className={`w-8 h-8 flex items-center justify-center rounded-full cursor-pointer ${
                    index + 1 === step ? "bg-primary text-white" : "bg-gray-300"
                  }`}
                  onClick={() => handleStepClick(index + 1)}
                >
                  {index + 1}
                </div>
              ))}
            </div>
            <span className="text-2xl block">{t("create_account_key")}</span>
          </div>

          {/* Step Content with Framer Motion Animation */}
          <motion.div
            className="flex-grow w-full"
            key={step}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ duration: 0.5 }}
          >
            {steps[step - 1].component}
          </motion.div>

          <p className="">
            {t("have_account_key")}
            <Link
              to="/auth/login"
              className="text-blue-500 hover:underline mx-2"
            >
              {t("login_key")}
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
