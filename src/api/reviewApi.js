import axiosInstance from "../utils/axiosInstance";

const REVIEW_ENDPOINT = import.meta.env.VITE_REVIEW_ENDPOINT;

// Fetch all reviews (with optional pagination)
export const fetchReviews = async ({ page, size } = {}) => {
    const params = {};
    if (page !== undefined) params.page = page;
    if (size !== undefined) params.size = size;

    const response = await axiosInstance.get(REVIEW_ENDPOINT, { params });
    return response.data;
};

// Post a new review
export const createReview = async (reviewData) => {
    const response = await axiosInstance.post(REVIEW_ENDPOINT, reviewData);
    return {
        status: response.status,
        data: response.data,
    };
};

// Get review by ID
export const fetchReviewById = async (reviewId) => {
    const response = await axiosInstance.get(`${REVIEW_ENDPOINT}/${reviewId}`);
    return response.data;
};

// Update review by ID
export const updateReviewById = async (reviewId, reviewData) => {
    const response = await axiosInstance.put(`${REVIEW_ENDPOINT}/${reviewId}`, reviewData);
    return response.data;
};
