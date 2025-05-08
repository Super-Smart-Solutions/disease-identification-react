import React, { useEffect, useState } from "react";
import { IoIosCalculator } from "react-icons/io";
import { FaOilCan } from "react-icons/fa";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import { setSoilCalculatorOpen } from "../../redux/features/soilCalculatorSlice";
import { useNavigate } from "react-router-dom";
import { useUserData } from "../../hooks/useUserData";

export default function FeaturesSection() {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useUserData();

  const handleOpenModal = () => {
    if (!user?.id) {
      navigate("/auth/login");
      return;
    }
    dispatch(setSoilCalculatorOpen(true));
  };

  const features = [
    {
      label: t("soil_calculator_key"),
      icon: (
        <IoIosCalculator
          className="text-4xl text-primaryDarker cursor-pointer"
          onClick={handleOpenModal}
        />
      ),
    },
    {
      label: t("oil_test_key"),
      icon: (
        <FaOilCan
          title={t("coming_soon_key")}
          className="text-4xl text-primaryDarker cursor-pointer"
        />
      ),
    },
  ];

  const cardVariants = {
    hidden: { opacity: 0, y: 40 },
    visible: (i) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.2,
        duration: 0.5,
        ease: "easeOut",
      },
    }),
  };

  return (
    <div className="py-12 px-4 sm:px-6 lg:px-8  flex flex-col items-center gap-4 border border-b border-slate-200">
      <span className="text-3xl">{t("extra_feature_key")}</span>
      {/*<span className="text-lg bg-amber-100 text-amber-950 px-2 py-1 rounded-2xl">
        {t("coming_soon_key")}
      </span>
*/}
      <div className="w-11/12 mx-auto grid gap-6 sm:grid-cols-2">
        {features.map((feature, index) => (
          <motion.div
            key={index}
            custom={index}
            initial="hidden"
            animate="visible"
            variants={cardVariants}
            className="flex flex-col items-center justify-center cardIt"
          >
            <div className="mb-4">{feature.icon}</div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">
              {feature.label}
            </h3>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
