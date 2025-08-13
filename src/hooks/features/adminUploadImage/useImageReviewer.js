import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getImages, deleteImage } from '../../../api/imagesAPI';
import { toast } from 'sonner';

export const useImageReviewer = ({ selectedPlant, selectedDisease, t }) => {
  const [page, setPage] = useState(1);
  const [images, setImages] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const queryClient = useQueryClient();

  const queryParams = { page, plantId: null, diseaseId: selectedDisease };

  const { data, isLoading, error, isFetching } = useQuery({
    queryKey: ['images', queryParams],
    queryFn: () => getImages(queryParams),
    enabled: !!(selectedPlant && selectedDisease),
  });

  const deleteImageMutation = useMutation({
    mutationFn: deleteImage,
    onSuccess: () => {
      toast.success(t('image_deleted_successfully_key'));
      queryClient.invalidateQueries(['images', queryParams]);
    },
    onError: () => {
      toast.error(t('delete_failed_key'));
    },
  });

  useEffect(() => {
    if (data?.items) {
      setImages(data.items);
      setCurrentIndex(0);
    } else {
      setImages([]);
    }
  }, [data]);

  const handleNext = () => {
    const nextIndex = currentIndex + 1;
    if (nextIndex >= images.length && page < data?.pages) {
      setPage((prevPage) => prevPage + 1);
    } else if (nextIndex < images.length) {
      setCurrentIndex(nextIndex);
    }
  };

  const handleBack = () => {
    setCurrentIndex((prevIndex) => Math.max(0, prevIndex - 1));
  };

  const handleDelete = (imageId) => {
    deleteImageMutation.mutate(imageId);
  };

  return {
    images,
    currentIndex,
    isLoading: isLoading || isFetching,
    error,
    handleNext,
    handleBack,
    handleDelete,
    currentImage: images[currentIndex],
  };
};
