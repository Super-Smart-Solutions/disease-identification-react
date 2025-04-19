import axiosInstance from "../utils/axiosInstance";

const USER_ENDPOINT = import.meta.env.VITE_USER_ENDPOINT;

// Fetch current user
export const fetchCurrentUser = async () => {
    const response = await axiosInstance.get(`${USER_ENDPOINT}/me`);
    return response.data;
};

// Update current user
export const updateCurrentUser = async (userData) => {
    const response = await axiosInstance.patch(`${USER_ENDPOINT}/me`, userData);
    return response.data;
};

// Fetch a user by ID
export const fetchUserById = async (userId) => {
    const response = await axiosInstance.get(`${USER_ENDPOINT}/${userId}`);
    return response.data;
};

// Update a user by ID
export const updateUserById = async (userId, userData) => {
    const response = await axiosInstance.patch(`${USER_ENDPOINT}/${userId}`, userData);
    return response.data;
};

// Delete a user by ID
export const deleteUserById = async (userId) => {
    const response = await axiosInstance.delete(`${USER_ENDPOINT}/${userId}`);
    return response.data;
};

// Upload user avatar
export const uploadUserAvatar = async (avatarFile, token) => {
    const formData = new FormData();
    formData.append("file", avatarFile);

    const response = await axiosInstance.patch(`${USER_ENDPOINT}/me/avatar`, formData, {
        headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`
        },
    });
    return response.data;
};

// Fetch all users
export const fetchUsers = async ({ page, size }) => {
    const params = {
        page,
        size
    }
    const response = await axiosInstance.get(USER_ENDPOINT, { params });
    return response.data;
};
