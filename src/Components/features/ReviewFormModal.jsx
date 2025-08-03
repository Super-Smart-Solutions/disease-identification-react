import { useFormik } from "formik";
import { FaStar } from "react-icons/fa";
import { useReviewForm } from "../../hooks/features/rating/useReviewForm";
import { useTranslation } from "react-i18next";
import Button from "../Button";
import { useNavigate } from "react-router-dom";
import { useUserData } from "../../hooks/useUserData";
import { IoCloseSharp } from "react-icons/io5";
import { AnimatePresence, motion } from "framer-motion";

const backdropVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
  exit: { opacity: 0 },
};

const drawerVariants = {
  hidden: { y: "100%" },
  visible: {
    y: 0,
    transition: {
      type: "spring",
      stiffness: 300,
      damping: 30,
    },
  },
  exit: {
    y: "100%",
    transition: {
      type: "spring",
      stiffness: 300,
      damping: 35,
    },
  },
};

const BottomDrawer = ({ isOpen, onClose, title, children }) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-50 flex items-end justify-center bottom-5"
          variants={backdropVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
        >
          {/* Drawer */}
          <motion.div
            variants={drawerVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="w-full max-w-xl bg-white rounded-2xl shadow-xl px-6 max-h-[70vh] overflow-y-auto relative"
          >
            {/* Grabber Handle */}
            <div className="absolute top-2 left-1/2 transform -translate-x-1/2">
              <div className="w-12 h-1 bg-gray-300 rounded-full" />
            </div>
            {/* Header */}
            <div className="flex items-center justify-between mb-4 pt-4">
              <h2 className="text-lg font-semibold text-gray-900">{title}</h2>
              <button
                onClick={onClose}
                className="text-gray-500 hover:text-gray-700 focus:outline-none cursor-pointer"
                aria-label="Close"
              >
                <IoCloseSharp size={20} />
              </button>
            </div>
            {children}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default function ReviewFormPopover() {
  const { t } = useTranslation();
  const { user } = useUserData();
  const navigate = useNavigate();

  const {
    isModalOpen,
    handleCloseModal,
    initialValues,
    handleSubmit,
    isSubmitting,
    hoverRating,
    setHoverRating,
    setRating,
  } = useReviewForm({ user, navigate });

  const formik = useFormik({
    initialValues,
    onSubmit: handleSubmit,
  });

  return (
    <BottomDrawer
      isOpen={isModalOpen}
      onClose={handleCloseModal}
      title={t("write_review_key")}
    >
      <form
        onSubmit={formik.handleSubmit}
        className="flex flex-col items-center gap-4 justify-between"
      >
        <textarea
          name="review_text"
          className="custom-input w-full h-18"
          placeholder={t("your_review_key")}
          onChange={formik.handleChange}
          value={formik.values.review_text}
        />

        <div className="flex items-center justify-between space-x-2 w-1/3">
          {[1, 2, 3, 4, 5].map((star) => (
            <FaStar
              key={star}
              size={24}
              className={`cursor-pointer ${
                (hoverRating || formik.values.rating) >= star
                  ? "text-yellow-400"
                  : "text-gray-300"
              }`}
              onClick={() => setRating(formik.setFieldValue, star)}
              onMouseEnter={() => setHoverRating(star)}
              onMouseLeave={() => setHoverRating(null)}
            />
          ))}
        </div>

        <Button className="w-full mb-4" type="submit" loading={isSubmitting}>
          {t("submit_review_key")}
        </Button>
      </form>
    </BottomDrawer>
  );
}
