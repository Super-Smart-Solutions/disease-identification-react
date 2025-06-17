import axiosInstance from "../utils/axiosInstance";

const INVITATION_ENDPOINT = "/invitations";

// Create an invitation
export const createInvitation = async (invitee_email) => {
    const response = await axiosInstance.post(INVITATION_ENDPOINT,
        invitee_email,
    );
    return response.data;
};

// Get all invitations
export const fetchInvitations = async () => {
    const response = await axiosInstance.get(INVITATION_ENDPOINT);
    return response.data;
};

// Get a specific invitation by ID
export const fetchInvitationById = async (invitationId) => {
    const response = await axiosInstance.get(`${INVITATION_ENDPOINT}/${invitationId}`);
    return response.data;
};

// Accept an invitation
export const acceptInvitation = async (invitationId) => {
    const response = await axiosInstance.patch(`${INVITATION_ENDPOINT}/${invitationId}/accept`);
    return response.data;
};
// Accept an invitation with token 
export const acceptInvitationWithToken = async (invitationId, token) => {
    const response = await axiosInstance.patch(
        `${INVITATION_ENDPOINT}/${invitationId}/accept`,
        {},
        {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`
            }
        }
    );
    return response.data;
};


// Reject an invitation
export const rejectInvitation = async (invitationId) => {
    const response = await axiosInstance.patch(`${INVITATION_ENDPOINT}/${invitationId}/reject`);
    return response.data;
};
