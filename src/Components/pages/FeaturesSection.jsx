import React from "react";
import { IoIosCalculator } from "react-icons/io";
import { GiRose } from "react-icons/gi";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import { setSoilCalculatorOpen } from "../../redux/features/soilCalculatorSlice";
import { useNavigate } from "react-router-dom";
import { useUserData } from "../../hooks/useUserData";
import { setOilTestModalOpen } from "../../redux/features/oilTestModalSlice";

export default function FeaturesSection() {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useUserData();

  const handleSoilModal = () => {
    if (user?.id) {
      dispatch(setSoilCalculatorOpen(true));
    } else {
      navigate("/auth/login");
      return;
    }
  };

  const handleOilModal = () => {
    if (user?.id) {
      dispatch(setOilTestModalOpen(true));
    } else {
      navigate("/auth/login");
      return;
    }
  };
  const features = [
    {
      label: t("soil_calculator_key"),
      icon: <IoIosCalculator size={36} title={t("soil_calculator_key")} />,
      onClick: handleSoilModal,
    },
    {
      label: t("oil_test_key"),
      icon: <GiRose size={36} title={t("oil_test_analysis_key")} />,
      onClick: handleOilModal,
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

      <div className="w-11/12 mx-auto grid gap-6 sm:grid-cols-2">
        {features.map(({ icon, label, onClick }, index) => (
          <motion.button
            onClick={onClick}
            key={index}
            custom={index}
            initial="hidden"
            animate="visible"
            variants={cardVariants}
            className="flex flex-col gap-4 items-center justify-center bg-slate-50 p-8 rounded-2xl focus:outline-none hover:bg-primary-80 cursor-pointer text-primary hover:text-white transition-colors duration-300"
          >
            <div>{icon}</div>
            <h3 className="text-lg font-semibold">{label}</h3>
          </motion.button>
        ))}
      </div>
    </div>
  );
}
