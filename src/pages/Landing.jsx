import React, { useRef } from "react";
import { FaFish } from "react-icons/fa";
import { GiPlantRoots } from "react-icons/gi";
import { FaCow } from "react-icons/fa6";
import { motion, useAnimation, useInView } from "framer-motion";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import DownloadBanner from "../Components/pages/DownloadBanner";
import farm from "../assets/farm.jpg";
import FeaturesSection from "../Components/pages/FeaturesSection";
import Infographics from "../Components/pages/Infographics";
import { useUserData } from "../hooks/useUserData";

export default function Landing() {
  const { t } = useTranslation();
  const controls = useAnimation();
  const ref = useRef(null);
  const { user } = useUserData();
  const isInView = useInView(ref, { once: true, amount: 0.5 });

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

  // Animate when in view
  React.useEffect(() => {
    if (isInView) {
      controls.start("visible");
    }
  }, [isInView, controls]);

  return (
    <>
      {/* Hero Section (always visible) */}
      <div
        style={{
          backgroundColor: "#2b4700",
          backgroundImage: `url(farm.jpeg)`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
        className="flex items-center justify-center relative h-[100vh] w-full bg-cover bg-center"
      >
        <div className="absolute inset-0 bg-black/40 z-0" />
        <div className="relative p-5 flex flex-col gap-40 w-full h-full justify-center items-center text-white text-center">
          <div className="font-arabic">
            <span dir="rtl" className="w-10/12 text-6xl">
              {t("disease_identification_project_key")}
            </span>
            <span className="block mt-8 w-6/12 text-center mx-auto  text-xl font-semibold">
              {t("disease_identification_description_key")}
            </span>
            <Link
              to="/models"
              className="mt-8 inline-block rounded-full border border-white px-12 py-3 text-sm font-medium text-white hover:bg-white hover:text-primary hover:border-white"
            >
              {user && user.id ? t("try_models_key") : t("Get Started")}
            </Link>
          </div>

          <motion.div
            className="flex justify-around mt-6 w-full items-end"
            variants={containerVariants}
            initial="hidden"
            animate={controls}
            ref={ref}
          >
            <motion.div
              variants={itemVariants}
              className="flex flex-col items-center"
            >
              <FaFish className="text-4xl" />
              <span className="font-semibold mt-2">{t("fish_key")}</span>
            </motion.div>
            <motion.div
              variants={itemVariants}
              className="flex flex-col items-center"
            >
              <GiPlantRoots className="text-4xl" />
              <span className="font-semibold mt-2">{t("plants_key")}</span>
            </motion.div>
            <motion.div
              variants={itemVariants}
              className="flex flex-col items-center"
            >
              <FaCow className="text-4xl" />
              <span className="font-semibold mt-2">{t("animals_key")}</span>
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* Features Section (viewport-triggered) */}
      <ViewportSection>
        <FeaturesSection />
      </ViewportSection>

      {/* Infographics Section (viewport-triggered) */}
      <ViewportSection>
        <Infographics />
      </ViewportSection>

      {/* Download Banner (viewport-triggered) */}
      <ViewportSection>
        <DownloadBanner />
      </ViewportSection>
    </>
  );
}

// Reusable Viewport Section Component
const ViewportSection = ({ children }) => {
  const ref = useRef(null);
  const controls = useAnimation();
  const isInView = useInView(ref, { once: true, amount: 0.3 });

  React.useEffect(() => {
    if (isInView) {
      controls.start("visible");
    }
  }, [isInView, controls]);

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={controls}
      variants={{
        hidden: { opacity: 0, y: 50 },
        visible: {
          opacity: 1,
          y: 0,
          transition: { duration: 0.6, ease: "easeOut" },
        },
      }}
    >
      {children}
    </motion.div>
  );
};
