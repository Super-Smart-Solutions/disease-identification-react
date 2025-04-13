import React from "react";
import { motion } from "framer-motion";
import { FaApple, FaGooglePlay } from "react-icons/fa";
import FarmingVectorIllustration from "../../assets/FarmingVectorIllustration.jpg";
import PhoneImage from "../../assets/phone.png";
import { useTranslation } from "react-i18next";

export default function DownloadBanner() {
  const { t } = useTranslation();

  return (
    <div
      className="relative w-full h-[600px] bg-cover bg-center flex items-center justify-center "
      style={{
        backgroundImage: `url(${FarmingVectorIllustration})`,
      }}
    >
      {/* Overlay for better text contrast */}
      <div className="absolute inset-0 bg-black/40 z-0" />

      {/* Content */}
      <div className="relative z-10 text-white text-center p-6 max-w-3xl ">
        <h2 className="text-4xl font-bold mb-4">{t("download_title_key")}</h2>
        <p className="text-lg mb-6">{t("download_subtitle_key")}</p>

        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="flex gap-4 justify-center"
        >
          <button className="bg-white text-black px-5 py-3 rounded-2xl flex items-center gap-2 hover:bg-gray-200 transition">
            <FaApple className="text-2xl" />
            <span>{t("app_store_key")}</span>
          </button>
          <button className="bg-white text-black px-5 py-3 rounded-2xl flex items-center gap-2 hover:bg-gray-200 transition">
            <FaGooglePlay className="text-2xl" />
            <span>{t("google_play_key")}</span>
          </button>
        </motion.div>
      </div>

      {/* Phone Image */}
      <motion.img
        src={PhoneImage}
        alt={t("phone_alt_key")}
        className="absolute bottom-50 right-40 w-[100px] md:w-[250px] z-10"
        initial={{ opacity: 0, x: 100 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 1 }}
      />
    </div>
  );
}
