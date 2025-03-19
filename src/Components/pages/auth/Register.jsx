import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useSearchParams, useLocation, Link } from "react-router-dom"; // For query params
import RegisterStepOne from "./RegisterStepOne";
import RegisterStepTwo from "./RegisterStepTwo";
import RegisterStepThree from "./RegisterStepThree";
import { useTranslation } from "react-i18next";
import authImage from "../../../assets/auth.png"; // Adjust path if necessary

export default function Register() {
  const { t } = useTranslation();
  const [searchParams, setSearchParams] = useSearchParams(); // For query params
  const location = useLocation(); // For current location
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
  });

  // Get step_id from query params or default to 1
  const step_id = parseInt(searchParams.get("step_id") || 1, 10);
  const currentStep = Math.min(Math.max(step_id, 1), 3); // Ensure step is between 1 and 3

  // Step content mapping
  const steps = [
    {
      component: (
        <RegisterStepOne
          step={currentStep}
          setStep={(step) => {
            searchParams.set("step_id", step); // Update step_id in query params
            setSearchParams(searchParams); // Push new query params to URL
          }}
          registerData={registerData}
          setRegisterData={setRegisterData}
        />
      ),
      label: t("Step 1"),
    },
    {
      component: (
        <RegisterStepTwo
          step={currentStep}
          setStep={(step) => {
            searchParams.set("step_id", step); // Update step_id in query params
            setSearchParams(searchParams); // Push new query params to URL
          }}
          registerData={registerData}
          setRegisterData={setRegisterData}
        />
      ),
      label: t("Step 2"),
    },
    {
      component: (
        <RegisterStepThree
          step={currentStep}
          setStep={(step) => {
            searchParams.set("step_id", step); // Update step_id in query params
            setSearchParams(searchParams); // Push new query params to URL
          }}
          registerData={registerData}
          setRegisterData={setRegisterData}
        />
      ),
      label: t("Step 3"),
    },
  ];

  // Handle step navigation
  const handleStepClick = (stepNumber) => {
    // Prevent navigating to steps that are not yet completed
    if (stepNumber > currentStep) {
      return;
    }
    searchParams.set("step_id", stepNumber); // Update step_id in query params
    setSearchParams(searchParams); // Push new query params to URL
  };

  // Sync step state with URL parameter
  useEffect(() => {
    if (!searchParams.get("step_id")) {
      searchParams.set("step_id", currentStep); // Set default step_id if missing
      setSearchParams(searchParams); // Push new query params to URL
    }
  }, [currentStep, searchParams, setSearchParams]);

  return (
    <div className="flex items-center justify-center">
      <div className="flex bg-white shadow-lg rounded-lg w-full max-w-4xl">
        {/* Left: Auth Image */}
        <div className="w-1/2 hidden md:flex justify-center items-center bg-gray-100">
          <img
            loading="lazy"
            src={authImage}
            alt="Authentication"
            className="w-full h-full object-cover  "
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
                    index + 1 === currentStep
                      ? "bg-primary text-white"
                      : "bg-gray-300"
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
            key={currentStep}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ duration: 0.5 }}
          >
            {steps[currentStep - 1].component}
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
