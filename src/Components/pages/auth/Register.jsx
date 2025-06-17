import React from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import RegisterStepOne from "./RegisterStepOne";
import RegisterStepTwo from "./RegisterStepTwo";
import AvatarStep from "./AvatarStep";
import authImage from "../../../assets/auth.png";
import useRegisterLogic from "../../../hooks/useRegisterLogic";

const Register = () => {
  const { t } = useTranslation();
  const {
    registerData,
    step,
    handleStepClick,
    validateStepOne,
    validateStepTwo,
    handleStepOneSubmit,
    handleStepTwoSubmit,
    handleOTPSubmit,
    otpModal,
    setOtpModal,
    selectedFile,
    tempSelectedFile,
    showModal,
    setShowModal,
    scale,
    setScale,
    isLoading,
    error,
    handleFileSelect,
    handleAvatarSave,
    handleSkipAvatar,
    invited,
  } = useRegisterLogic();

  const steps = [
    {
      component: (
        <RegisterStepOne
          registerData={registerData}
          validateStepOne={validateStepOne}
          handleStepOneSubmit={handleStepOneSubmit}
        />
      ),
      label: t("Step 1"),
    },
    {
      component: (
        <RegisterStepTwo
          invited={invited}
          registerData={registerData}
          validateStepTwo={validateStepTwo}
          handleStepTwoSubmit={handleStepTwoSubmit}
          otpModal={otpModal}
          setOtpModal={setOtpModal}
          handleOTPSubmit={handleOTPSubmit}
          isLoading={isLoading}
        />
      ),
      label: t("Step 2"),
    },
    {
      component: (
        <AvatarStep
          registerData={registerData}
          selectedFile={selectedFile}
          tempSelectedFile={tempSelectedFile}
          showModal={showModal}
          setShowModal={setShowModal}
          scale={scale}
          setScale={setScale}
          isLoading={isLoading}
          error={error}
          handleFileSelect={handleFileSelect}
          handleAvatarSave={handleAvatarSave}
          handleSkipAvatar={handleSkipAvatar}
        />
      ),
      label: t("Step 3"),
    },
  ];

  return (
    <div className="flex items-center justify-center mt-30">
      <div className="flex bg-white shadow-lg rounded-lg w-full max-w-4xl">
        <div className="w-1/2 hidden md:flex justify-center items-center bg-gray-100">
          <img
            loading="lazy"
            src={authImage}
            alt="Authentication"
            className="w-full h-full object-cover rtl:rounded-r-lg ltr:rounded-l-lg"
          />
        </div>

        <div className="w-full md:w-2/3 p-6 flex flex-col justify-between gap-12 items-center h-[100%]">
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
};

export default Register;
