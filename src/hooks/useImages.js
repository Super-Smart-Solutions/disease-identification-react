import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getImages,
  getImageUrls,
  fetchImageById,
  updateImage,
  deleteImage,
  uploadImage,
} from "../api/imagesAPI";
import { preprocessImage } from "../utils/imageProcessor";

export const useImages = ({ plant_id, diseaseId, page = 1, pageSize = 10 }) => {
  return useQuery({
    queryKey: ["images", plant_id, diseaseId, page, pageSize],
    queryFn: () => getImages({ plant_id, diseaseId, page, pageSize }),
    staleTime: 5 * 60 * 1000,
    keepPreviousData: true,
  });
};
export const useImageUrls = () => {
  return useQuery({
    queryKey: ["imageUrls"],
    queryFn: () => getImageUrls(),
  });
};

export const useImageById = (imageId) => {
  return useQuery({
    queryKey: ["image", imageId],
    queryFn: () => fetchImageById(imageId),
    enabled: !!imageId,
  });
};

export const useUploadImage = ({ onSuccess }) => {
  const queryClient = useQueryClient();

  const { mutate, isPending } = useMutation({
    mutationFn: async ({ file, category }) => {

      const processedImage = await preprocessImage(file);

      const selectedPlant = category.label.toLowerCase();
      const timestamp = Date.now();
      const formattedName = `uploads/${selectedPlant}/${timestamp}_${file.name}`;


      return uploadImage({
        name: formattedName,
        plantId: category.value,
        imageFile: processedImage,
      });
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries(["images"]);
      onSuccess?.(data);
    },

  });

  return {
    upload: mutate,
    isUploading: isPending,
  };
};


export const useUpdateImage = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateImage,
    onSuccess: () => {
      queryClient.invalidateQueries(["images"]);
    },
  });
};
export const useDeleteImage = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteImage,
    onSuccess: () => {
      queryClient.invalidateQueries(["images"]);

    },
  });
};
