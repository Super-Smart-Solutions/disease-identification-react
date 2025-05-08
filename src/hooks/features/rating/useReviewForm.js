import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { useTranslation } from "react-i18next";
import { createReview } from "../../../api/reviewApi";

export function useReviewForm({ user, navigate }) {
    const { t } = useTranslation();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [hoverRating, setHoverRating] = useState(null);

    const mutation = useMutation({
        mutationFn: createReview,
        onSuccess: () => {
            toast.success(t("review_submitted"));
            setIsModalOpen(false);
        },
        onError: () => {
            toast.error(t("review_submit_error"));
        },
    });

    const initialValues = {
        review_text: "",
        rating: 0,
    };

    const handleSubmit = async (values, { setSubmitting }) => {
        mutation.mutate(values);
        setSubmitting(false);
    };

    const handleOpenModal = () => {
        if (!user?.id) {
            navigate("/auth/login");
        } else {
            setIsModalOpen(true);
        }
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
    };

    return {
        isModalOpen,
        handleOpenModal,
        handleCloseModal,
        initialValues,
        handleSubmit,
        isSubmitting: mutation.isPending,
        hoverRating,
        setHoverRating,
        setRating: (setFieldValue, value) => setFieldValue("rating", value),
    };
}
