import React from "react";
import { FaFish } from "react-icons/fa";
import { GiPlantRoots } from "react-icons/gi";
import { FaCow } from "react-icons/fa6";
import orangeCircular from "../assets/orangeCircular.png";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";

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
    <div className="flex items-center justify-center min-h-screen">
      <div className="relative bg-primaryGray rounded-2xl p-5 flex flex-col gap-6 w-10/12 h-[60vh] justify-center shadow-lg">
        <span className="w-10/12 text-gray-700">
          Lorem ipsum dolor sit amet consectetur. Magnis tortor neque sit risus
          lectus urna libero phasellus elementum.
        </span>
        <span className="w-10/12 text-gray-700">
          Lorem ipsum dolor sit amet consectetur. Libero arcu ut viverra odio
          scelerisque lacus suscipit at. Purus volutpat elementum odio urna
          porta.
        </span>
        <span className="w-10/12 text-gray-700">
          Lorem ipsum dolor sit amet consectetur. Dolor pellentesque mi
          scelerisque vel urna egestas lorem diam. Placerat aliquet nulla
          egestas id.
        </span>

        {/* Icons section */}
        <motion.div
          className="flex justify-around mt-6"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.div
            className="flex flex-col items-center"
            variants={itemVariants}
          >
            <FaFish className="text-4xl text-gray-600" />
            <span className="text-gray-600 font-semibold mt-2">
              {t("fish_key")}
            </span>
          </motion.div>
          <motion.div
            className="flex flex-col items-center"
            variants={itemVariants}
          >
            <GiPlantRoots className="text-4xl text-gray-600" />
            <span className="text-gray-600 font-semibold mt-2">
              {t("plants_key")}
            </span>
          </motion.div>
          <motion.div
            className="flex flex-col items-center"
            variants={itemVariants}
          >
            <FaCow className="text-4xl text-gray-600" />
            <span className="text-gray-600 font-semibold mt-2">
              {t("animals_key")}
            </span>
          </motion.div>
        </motion.div>
      </div>

      {/* Circular Image */}
      <motion.div
        className="absolute ltr:right-30 rtl:left-30  top-2/4"
        variants={itemVariants}
        initial="hidden"
        animate="visible"
        transition={{ delay: 0.9 }}
      >
        <img
          src={orangeCircular}
          alt="Orange Tree"
          className="w-40 h-40 rounded-full border-4 border-white shadow-md"
        />
      </motion.div>
    </div>
  );
}
