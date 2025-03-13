import axiosInstance from "../utils/axiosInstance";

const IMAGE_ENDPOINT = "/images";
const URL_ENDPOINT = "/images/url";
const UPLOAD_ENDPOINT = "/images/upload";

// Fetch images with optional filters
export const getImages = async ({ plantId, diseaseId, limit = 10, offset = 0 }) => {
  const params = {
    plant_id: plantId,
    disease_id: diseaseId,
    limit,
    offset,
  };
  const response = await axiosInstance.get(IMAGE_ENDPOINT, { params });
  return response.data;
};

// Get presigned URLs for images
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

// Upload image with metadata
export const uploadImage = async ({ name, plantId, farmId, imageFile }) => {
  const formData = new FormData();
  formData.append("name", name);
  formData.append("farm_id", farmId);
  formData.append("plant_id", plantId);
  formData.append("annotated", "false");
  formData.append("image_file", imageFile);

  const response = await axiosInstance.post(UPLOAD_ENDPOINT, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return response.data;
};

// Update image metadata
export const updateImageMetadata = async ({ imageId, plantId, diseaseId, farmId, metadata }) => {
  const data = {
    img_metadata: metadata,
    annotated: true,
    plant_id: plantId,
    disease_id: diseaseId,
    farm_id: farmId,
  };

  const response = await axiosInstance.put(`${IMAGE_ENDPOINT}/${imageId}`, data);
  return response.data;
};
