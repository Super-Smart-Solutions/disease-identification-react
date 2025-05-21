import axiosInstance from "../utils/axiosInstance";

const IMAGE_ENDPOINT = "/images";
const URL_ENDPOINT = "/images/url";
const UPLOAD_ENDPOINT = "/images/uploads";

// Fetch images with optional filters
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
export const uploadImageAdmin = async (formData, config = {}) => {
  const { onUploadProgress } = config;
  try {
    const response = await axiosInstance.post(UPLOAD_ENDPOINT, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
      onUploadProgress: (progressEvent) => {
        if (onUploadProgress) {
          const percentCompleted = Math.round(
            (progressEvent.loaded * 100) / (progressEvent.total || 1) // Fallback to avoid division by zero
          );
          onUploadProgress(percentCompleted);
        }
      },
      maxBodyLength: 10 * 1024 * 1024, // Increased to 10MB
      maxContentLength: 10 * 1024 * 1024, // Increased to 10MB
      ...config, // Allow additional config overrides
    });
    return response.data;
  } catch (error) {
    console.error("Upload failed:", error);
    throw error; // Let the caller handle the error
  }
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
