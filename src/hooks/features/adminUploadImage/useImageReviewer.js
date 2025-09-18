import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getImages, deleteImage } from '../../../api/imagesAPI';
import { toast } from 'sonner';

export const useImageReviewer = ({ selectedPlant, selectedDisease, t }) => {
  const [page, setPage] = useState(1);
  const [images, setImages] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isDeletingImage, setIsDeletingImage] = useState(false);
  const queryClient = useQueryClient();

  const queryParams = { page, plantId: null, diseaseId: selectedDisease };

  const { data, isLoading, error, isFetching } = useQuery({
    queryKey: ['images', queryParams],
    queryFn: () => getImages(queryParams),
    enabled: !!(selectedPlant && selectedDisease),
  });

  const deleteImageMutation = useMutation({
    mutationFn: deleteImage,
    onMutate: () => {
      setIsDeletingImage(true);
    },
    onSuccess: (_, deletedImageId) => {
      toast.success(t('image_deleted_successfully_key'));

      const deletedIndex = images.findIndex(img => img.id === deletedImageId);

      setImages(prevImages => {
        const updatedImages = prevImages.filter(img => img.id !== deletedImageId);

        if (updatedImages.length === 0) {
          setCurrentIndex(0);
        } else if (deletedIndex < currentIndex) {
          setCurrentIndex(currentIndex - 1);
        } else if (deletedIndex === currentIndex) {
          if (currentIndex >= updatedImages.length) {
            setCurrentIndex(Math.max(0, updatedImages.length - 1));
          }
        }

        return updatedImages;
      });

      setIsDeletingImage(false);

      queryClient.invalidateQueries(['images', queryParams]);
    },
    onError: () => {
      toast.error(t('delete_failed_key'));
      setIsDeletingImage(false);
    },
  });

  useEffect(() => {
    if (data?.items) {
      if (!isDeletingImage) {
        setImages(prevImages => {
          if (prevImages.length === 0) {
            setCurrentIndex(0);
            return data.items;
          }

          const isFilterChange = prevImages.length > 0 &&
            data.items.length > 0 &&
            prevImages[0]?.id !== data.items[0]?.id;

          if (isFilterChange) {
            setCurrentIndex(0);
            return data.items;
          }

          return prevImages;
        });
      }
    } else {
      setImages([]);
      setCurrentIndex(0);
    }
  }, [data, isDeletingImage]);

  useEffect(() => {
    setIsDeletingImage(false);
    setCurrentIndex(0);
  }, [selectedPlant, selectedDisease]);

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
    isLoading: isLoading || isFetching || deleteImageMutation.isPending,
    error,
    handleNext,
    handleBack,
    handleDelete,
    currentImage: images[currentIndex],
    isDeletingImage,
  };
};
