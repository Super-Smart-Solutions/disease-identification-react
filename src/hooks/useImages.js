import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getImages,
  getImageUrls,
  fetchImageById,
  uploadImage,
  updateImage,
  deleteImage,
} from "../api/imagesAPI";

export const useImages = (page = 1, pageSize = 10) => {
  return useQuery({
    queryKey: ["images", page, pageSize],
    queryFn: () => getImages(page, pageSize),
    keepPreviousData: true
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

export const useUploadImage = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: uploadImage,
    onSuccess: () => {
      queryClient.invalidateQueries(["images"]);
    },
  });
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
