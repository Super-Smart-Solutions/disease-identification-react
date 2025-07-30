import axiosInstance from "../utils/axiosInstance";

const OIL_TEST_ENDPOINT = "/api/oil-tests";


export const checkOilAuthenticity = async (file, name) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("name", name);

    const response = await axiosInstance.post(`${OIL_TEST_ENDPOINT}/check`, formData, {
        headers: {
            "Content-Type": "multipart/form-data",
        },
    });

    return response.data;
};


export const getUserOilTests = async () => {
    const response = await axiosInstance.get(`${OIL_TEST_ENDPOINT}/tests`);
    return response.data;
};


export const updateOilTestModel = async (data) => {
    const response = await axiosInstance.patch(`${OIL_TEST_ENDPOINT}/update-model`, data);
    return response.data;
};
