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
      
      // Find the index of the deleted image
      const deletedIndex = images.findIndex(img => img.id === deletedImageId);
      
      // Update local state immediately to prevent reset
      setImages(prevImages => {
        const updatedImages = prevImages.filter(img => img.id !== deletedImageId);
        
        // Adjust current index after deletion
        if (updatedImages.length === 0) {
          setCurrentIndex(0);
        } else if (deletedIndex < currentIndex) {
          // If we deleted an image before current position, move index back by 1
          setCurrentIndex(currentIndex - 1);
        } else if (deletedIndex === currentIndex) {
          // If we deleted the current image, stay at same index (shows next image)
          // but ensure we don't go beyond the array bounds
          if (currentIndex >= updatedImages.length) {
            setCurrentIndex(updatedImages.length - 1);
          }
        }
        // If we deleted an image after current position, keep same index
        
        return updatedImages;
      });
      
      setIsDeletingImage(false);
      
      // Invalidate queries to sync with server
      queryClient.invalidateQueries(['images', queryParams]);
    },
    onError: () => {
      toast.error(t('delete_failed_key'));
      setIsDeletingImage(false);
    },
  });

  useEffect(() => {
    if (data?.items) {
      // Only update images and reset index if this is NOT a post-deletion sync
      if (!isDeletingImage) {
        setImages(prevImages => {
          // Reset index only if this is a completely fresh query (different filters or first load)
          if (prevImages.length === 0) {
            setCurrentIndex(0);
            return data.items;
          }
          
          // If we have existing images, check if this is a filter change
          // by comparing the first image IDs
          const isFilterChange = prevImages.length > 0 && 
            data.items.length > 0 && 
            prevImages[0]?.id !== data.items[0]?.id;
          
          if (isFilterChange) {
            setCurrentIndex(0);
            return data.items;
          }
          
          // Otherwise, this is likely pagination or post-deletion sync
          // Keep current images to prevent state reset
          return prevImages;
        });
      }
      // If we're in deletion mode, the images are already updated in the mutation
    } else {
      setImages([]);
      setCurrentIndex(0);
    }
  }, [data, isDeletingImage]);

  // Reset deletion flag when filters change
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
