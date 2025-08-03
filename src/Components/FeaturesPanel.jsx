import { motion, AnimatePresence } from "framer-motion";
import { WiStars } from "react-icons/wi";
import { useState, useEffect, useRef } from "react";
import ReviewFormModal from "./features/ReviewFormModal";
import { useTranslation } from "react-i18next";
import { IoCalculator } from "react-icons/io5";
import { useUserData } from "../hooks/useUserData";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import SoilCalculator from "./features/soil-calculator/SoilCalculator";
import { useSoilCalculator } from "../hooks/useSoilCalculator";
import { useOilTest } from "../hooks/features/oilTest/useOilTest";
import ModalOilTest from "./features/OilTest";
import { GiRose } from "react-icons/gi";

const FeaturesPanel = () => {
  const [isExpanded, setIsExpanded] = useState(false);
  const { t } = useTranslation();
  const { user } = useUserData();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const panelRef = useRef(null);
  const toggleButtonRef = useRef(null);

  const { handleOpenModal: openSoilModal } = useSoilCalculator({
    user,
    dispatch,
    navigate,
  });

  const { handleOpenModal: openOilModal } = useOilTest({
    user,
    navigate,
    dispatch,
  });

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        panelRef.current &&
        !panelRef.current.contains(event.target) &&
        toggleButtonRef.current &&
        !toggleButtonRef.current.contains(event.target)
      ) {
        setIsExpanded(false);
      }
    };

    if (isExpanded) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isExpanded]);

  return (
    <motion.div
      ref={panelRef}
      className="realtive fixed bottom-10 right-10 z-50 flex gap-2 flex-col items-center justify-between w-30"
    >
      {/* Features Panel */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ type: "spring", damping: 10 }}
            className="bg-white p-4 rounded-lg shadow-xl border border-gray-200 flex flex-col gap-4"
          >
            <div
              className=" bg-primary cursor-pointer p-2 rounded-full shadow-md  w-fit"
              onClick={() => {
                openSoilModal();
                setIsExpanded(false);
              }}
            >
              <IoCalculator
                title={t("soil_calculator_key")}
                size={32}
                color="white"
              />
            </div>{" "}
            <div
              className="bg-primary cursor-pointer p-2 rounded-full shadow-md w-fit"
              onClick={() => {
                openOilModal();
                setIsExpanded(false);
              }}
            >
              <GiRose title={t("oil_test_key")} size={28} color="white" />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Toggle Button */}
      <motion.div
        ref={toggleButtonRef}
        onClick={() => setIsExpanded(!isExpanded)}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        className="bg-primary cursor-pointer p-1 rounded-full shadow-md flex items-center justify-center"
      >
        <WiStars title={t("extra_feature_key")} size={42} color="white" />
      </motion.div>
      <ModalOilTest />
      <SoilCalculator />
      <ReviewFormModal />
    </motion.div>
  );
};

export default FeaturesPanel;
