import axiosInstance from "../utils/axiosInstance";

const IMAGE_ENDPOINT = "/images";
const URL_ENDPOINT = "/images/url";
const UPLOAD_ENDPOINT = "/images/uploads";

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
// Fetch an image by ID
export const fetchImageById = async (imageId) => {
  const response = await axiosInstance.get(`${IMAGE_ENDPOINT}/${imageId}`);
  return response.data;
};

export const uploadImage = async ({ name, plantId, imageFile }) => {
  const formData = new FormData();

  // Append JSON fields
  formData.append("name", name);
  formData.append("farm_id", "1"); // Default farm ID as string
  formData.append("plant_id", plantId);
  formData.append("annotated", "false");

  // Append image file
  formData.append("image_file", imageFile);

  // Make POST request
  const response = await axiosInstance.post(UPLOAD_ENDPOINT, formData);

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
