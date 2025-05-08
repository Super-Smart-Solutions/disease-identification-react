import { motion, AnimatePresence } from "framer-motion";
import { WiStars } from "react-icons/wi"; // Make sure to install react-icons
import SoilCalculator from "./pages/soil-calculator/SoilCalculator";
import { useState } from "react";
import ReviewFormModal from "./features/ReviewFormModal";
import { useTranslation } from "react-i18next";

const FeaturesPanel = () => {
  const [isExpanded, setIsExpanded] = useState(false);
  const { t } = useTranslation();
  return (
    <motion.div className="fixed bottom-10 right-10 z-50 flex items-end gap-2">
      {/* Features Panel */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            transition={{ type: "spring", damping: 10 }}
            className="bg-white p-4 rounded-lg shadow-xl border border-gray-200 flex gap-4"
          >
            <SoilCalculator />
            <ReviewFormModal />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Toggle Button */}
      <motion.div
        onClick={() => setIsExpanded(!isExpanded)}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        className="bg-primary cursor-pointer p-1 rounded-full shadow-md flex items-center justify-center"
      >
        <WiStars title={t("extra_feature_key")} size={38} color="white" />
      </motion.div>
    </motion.div>
  );
};

export default FeaturesPanel;
