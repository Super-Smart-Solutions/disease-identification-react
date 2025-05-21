import axiosInstance from "../utils/axiosInstance";

const IMAGE_ENDPOINT = "/images";
const URL_ENDPOINT = "/images/url";
const UPLOAD_ENDPOINT = "/images/uploads";


export const getImages = async ({ plantId, diseaseId, page = 1, pageSize = 20 }) => {

  const response = await axiosInstance.get(IMAGE_ENDPOINT, {
    params: {
      plant_id: plantId,
      disease_id: diseaseId,
      page: page,
      size: pageSize
    }
  });
  return response.data;
};

export const getImageUrls = async ({ plantId, diseaseId, limit = 10, offset = 0 }) => {
  const imagesData = await getImages({ plantId, diseaseId, limit, offset });
  const urls = await Promise.all(
    imagesData.data.map(async (image) => {
      const response = await axiosInstance.get(`${URL_ENDPOINT}/${image.id}`);
      return response.data.presigned_url;
    })
  );
  return { urls, images: imagesData.data };
};

export const fetchImageById = async (imageId) => {
  const response = await axiosInstance.get(`${IMAGE_ENDPOINT}/${imageId}`);
  return response.data;
};

export const uploadImageAdmin = async (formData) => {
  try {
    const response = await axiosInstance.post(UPLOAD_ENDPOINT, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      }
    });
    return response.data;
  } catch (error) {
    console.error("Upload failed:", error);
    throw error;
  }
};

export const uploadImage = async ({ name, plantId, imageFile }) => {
  const formData = new FormData();


  formData.append("name", name);
  formData.append("farm_id", "1");
  formData.append("plant_id", plantId);
  formData.append("annotated", "false");


  formData.append("image_file", imageFile);


  const response = await axiosInstance.post(UPLOAD_ENDPOINT, formData);

  return response.data;
};

export const updateImage = async ({ id, plant_id, disease_id, name, image_type }) => {
  const data = {
    name: name,
    image_type: image_type,
    annotated: true,
    plant_id: plant_id,
    disease_id: disease_id,
    farm_id: 1,
  };

  const response = await axiosInstance.put(`${IMAGE_ENDPOINT}/${id}`, data);
  return response.data;
};

export const deleteImage = async (imageId) => {
  const response = await axiosInstance.delete(`${IMAGE_ENDPOINT}/${imageId}`);
  return response.data;
};
