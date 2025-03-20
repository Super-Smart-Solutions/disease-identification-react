import React from "react";
import { FaFish } from "react-icons/fa";
import { GiPlantRoots } from "react-icons/gi";
import { FaCow } from "react-icons/fa6";
import orangeCircular from "../assets/orangeCircular.png";
import farm from "../assets/farm.jpg";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";

export default function Landing() {
  const { t } = useTranslation();

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.3,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <div className="flex items-center justify-center relative h-[100vh] w-full bg-cover bg-center  ">
      {/* Overlay */}
      <div className=""></div>

      <div className="relative p-5 flex flex-col gap-40 w-full h-full justify-center items-center text-white text-center">
        <div className="font-arabic">
          <span dir="rtl" className="w-10/12 text-6xl ">
            {t("disease_identification_project_key")}
          </span>
          <span className="block mt-8 w-6/12 text-center mx-auto opacity-80">
            {t("disease_identification_description_key")}
          </span>
          <Link
            to="/models"
            className="mt-8 inline-block rounded-full border border-white px-12 py-3 text-sm font-medium text-white hover:bg-white hover:text-primary hover:border-white"
          >
            {t("Get Started")}
          </Link>
        </div>

        {/* Icons section */}
        <motion.div
          className="flex justify-around mt-6 w-full items-end"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.div
            className="flex flex-col items-center"
            variants={itemVariants}
          >
            <FaFish className="text-4xl" />
            <span className="font-semibold mt-2">{t("fish_key")}</span>
          </motion.div>
          <motion.div
            className="flex flex-col items-center"
            variants={itemVariants}
          >
            <GiPlantRoots className="text-4xl" />
            <span className="font-semibold mt-2">{t("plants_key")}</span>
          </motion.div>
          <motion.div
            className="flex flex-col items-center"
            variants={itemVariants}
          >
            <FaCow className="text-4xl" />
            <span className="font-semibold mt-2">{t("animals_key")}</span>
          </motion.div>
        </motion.div>
      </div>

      {/* Circular Image */}
      {/* <motion.div
        className="absolute ltr:right-30 rtl:left-30 top-2/4"
        variants={itemVariants}
        initial="hidden"
        animate="visible"
        transition={{ delay: 0.9 }}
      >
        <img
          src={orangeCircular}
          alt="Orange Tree"
          className="w-40 h-40 rounded-full border-4 border-white shadow-md"
          loading="lazy"
        />
      </motion.div> */}
    </div>
  );
}
