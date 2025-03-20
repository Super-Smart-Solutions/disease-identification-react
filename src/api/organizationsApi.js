import axiosInstance from "../utils/axiosInstance";

const ORGANIZATIONS_ENDPOINT = import.meta.env.VITE_ORGANIZATIONS_ENDPOINT;

// Retrieve all organizations
export const getOrganizations = async () => {
    const response = await axiosInstance.get(`${ORGANIZATIONS_ENDPOINT}/`);
    return response.data;
};

// Retrieve a single organization by ID
export const getOrganizationById = async (organizationId) => {
    const response = await axiosInstance.get(`${ORGANIZATIONS_ENDPOINT}/${organizationId}`);
    return response.data;
};

// Create a new organization
export const createOrganization = async (organizationData) => {
    const response = await axiosInstance.post(`${ORGANIZATIONS_ENDPOINT}/`, organizationData);
    return response.data;
};

// Update an existing organization by ID
export const updateOrganization = async (organizationId, updateData) => {
    const response = await axiosInstance.put(`${ORGANIZATIONS_ENDPOINT}/${organizationId}`, updateData);
    return response.data;
};

// Delete an organization by ID
export const deleteOrganization = async (organizationId) => {
    const response = await axiosInstance.delete(`${ORGANIZATIONS_ENDPOINT}/${organizationId}`);
    return response.data;
};
