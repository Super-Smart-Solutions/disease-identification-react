import { motion, AnimatePresence } from "framer-motion";
import { WiStars } from "react-icons/wi"; // Make sure to install react-icons
import SoilCalculator from "./pages/soil-calculator/SoilCalculator";
import { useState, useEffect, useRef } from "react";
import ReviewFormModal from "./features/ReviewFormModal";
import { useTranslation } from "react-i18next";
import { IoCalculator } from "react-icons/io5";
import { GiStarsStack } from "react-icons/gi";
import { useSoilCalculator } from "../hooks/useSoilCalculator";
import { useUserData } from "../hooks/useUserData";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { useReviewForm } from "../hooks/features/rating/useReviewForm";

const FeaturesPanel = () => {
  const [isExpanded, setIsExpanded] = useState(false);
  const { t } = useTranslation();
  const { user } = useUserData();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const panelRef = useRef(null); // Ref for the main panel and its content
  const toggleButtonRef = useRef(null); // Ref for the toggle button

  const { handleOpenModal: openSoilModal } = useSoilCalculator({
    user,
    dispatch,
    navigate,
  });
  const { handleOpenModal: openReviewModal } = useReviewForm({
    user,
    dispatch,
    navigate,
  });

  useEffect(() => {
    const handleClickOutside = (event) => {
      // Check if the click is outside the panel and outside the toggle button
      if (
        panelRef.current &&
        !panelRef.current.contains(event.target) &&
        toggleButtonRef.current &&
        !toggleButtonRef.current.contains(event.target)
      ) {
        setIsExpanded(false);
      }
    };

    // Add event listener only when the panel is expanded
    if (isExpanded) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    // Cleanup function to remove the event listener
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isExpanded]); // Re-run effect if isExpanded changes

  return (
    <motion.div
      ref={panelRef} // Assign ref to the main container that includes the expanded panel
      className="realtive fixed bottom-10 right-10 z-50 flex gap-2 flex-col items-center justify-between w-30"
    >
      {/* Features Panel */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            // No separate ref needed here as panelRef covers this
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
              onClick={() => {
                openReviewModal();
                setIsExpanded(false);
              }}
              className="bg-primary cursor-pointer p-2 rounded-full shadow-md  w-fit"
            >
              <GiStarsStack title={t("rate_key")} size={32} color="white" />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Toggle Button */}
      <motion.div
        ref={toggleButtonRef} // Assign ref to the toggle button
        onClick={() => setIsExpanded(!isExpanded)}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        className="bg-primary cursor-pointer p-1 rounded-full shadow-md flex items-center justify-center"
      >
        <WiStars title={t("extra_feature_key")} size={42} color="white" />
      </motion.div>
      <SoilCalculator />
      <ReviewFormModal />
    </motion.div>
  );
};

export default FeaturesPanel;
