import { useState, useEffect } from "react";
import Cookies from "js-cookie";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";
import { createReview, updateReviewById } from "../../../api/reviewApi";
import { useDispatch, useSelector } from "react-redux";
import { setreviewModalOpen } from "../../../redux/features/reviewModalSlice";

export function useReviewForm({ user, navigate }) {
    const { t } = useTranslation();
    const dispatch = useDispatch();
    const isModalOpen = useSelector((state) => state.reviewModal.isOpen);
    const [hoverRating, setHoverRating] = useState(null);

    const REVIEW_COOKIE = "hasReviewed";
    const COOKIE_EXPIRES_DAYS = 30;


    useEffect(() => {
        if (Cookies.get(REVIEW_COOKIE)) {
            dispatch(setreviewModalOpen(false));
        }
    }, [dispatch]);

    const { mutate, isPending } = useMutation({
        mutationFn: createReview,
        onSuccess: async (response, variables) => {
            const { status, data } = response;

            if (status === 201) {
                toast.success(t("review_submitted_key"));
            } else if (status === 200) {
                try {
                    await updateReviewById(data.id, variables);
                    toast.success(t("review_updated_key"));
                } catch (error) {
                    toast.error(t("review_update_error_key"));
                }
            } else {
                toast.error(t("review_submit_error"));
                return;
            }


            Cookies.set(REVIEW_COOKIE, "true", { expires: COOKIE_EXPIRES_DAYS, path: "/" });
            dispatch(setreviewModalOpen(false));
        },
        onError: () => {
            toast.error(t("review_submit_error"));
        }
    });

    const initialValues = { review_text: "", rating: 0 };

    const handleSubmit = (values, { setSubmitting }) => {
        mutate(values);
        setSubmitting(false);
    };

    const handleOpenModal = () => {
        if (!user?.id) {
            navigate("/auth/login");
        } else if (!Cookies.get(REVIEW_COOKIE)) {
            dispatch(setreviewModalOpen(true));
        }
    };

    const handleCloseModal = () => {
        dispatch(setreviewModalOpen(false));
    };

    return {
        isModalOpen,
        handleOpenModal,
        handleCloseModal,
        initialValues,
        handleSubmit,
        isSubmitting: isPending,
        hoverRating,
        setHoverRating,
        setRating: (setFieldValue, value) => setFieldValue("rating", value)
    };
}
