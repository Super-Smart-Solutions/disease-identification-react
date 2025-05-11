import { useFormik } from "formik";
import { FaStar } from "react-icons/fa";
import { useReviewForm } from "../../hooks/features/rating/useReviewForm";
import { useTranslation } from "react-i18next";
import Button from "../Button";
import Modal from "../Modal";
import { useNavigate } from "react-router-dom";
import { useUserData } from "../../hooks/useUserData";
import { GiStarsStack } from "react-icons/gi";

export default function ReviewFormModal() {
  const { t } = useTranslation();
  const { user } = useUserData();
  const navigate = useNavigate();

  const {
    isModalOpen,
    handleOpenModal,
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
    <>
      <div
        onClick={handleOpenModal}
        className="bg-primary cursor-pointer p-2 rounded-full shadow-md  w-fit"
      >
        <GiStarsStack title={t("rate_key")} size={32} color="white" />
      </div>
      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title={t("write_review_key")}
      >
        <form
          onSubmit={formik.handleSubmit}
          className="space-y-4 flex flex-col items-center"
        >
          <textarea
            name="review_text"
            className="custom-input w-full h-24"
            placeholder={t("your_review_key")}
            onChange={formik.handleChange}
            value={formik.values.review_text}
          />

          <div className="flex items-center justify-between  space-x-2 w-1/3">
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

          <Button type="submit" loading={isSubmitting}>
            {t("submit_review_key")}
          </Button>
        </form>
      </Modal>
    </>
  );
}
