import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getImages, deleteImage } from '../../../api/imagesAPI';
import { toast } from 'sonner';

export const useImageReviewer = ({ selectedPlant, selectedDisease, t }) => {
  const [page, setPage] = useState(1);
  const [images, setImages] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isDeletingImage, setIsDeletingImage] = useState(false);
  const [metadata, setMetadata] = useState({ total: 0, pages: 1 }); // Store total and pages info
  const queryClient = useQueryClient();

  const queryParams = { page, plantId: null, diseaseId: selectedDisease, pageSize: 20 };
  
  // Calculate global index: (current page - 1) * pageSize + current position in current page
  const pageSize = queryParams.pageSize;
  
  // Find which page the current image belongs to based on currentIndex in the loaded images array
  const getCurrentPageForIndex = () => {
    return Math.floor(currentIndex / pageSize) + 1;
  };
  
  const currentImagePage = Math.min(getCurrentPageForIndex(), page);
  const positionInCurrentPage = currentIndex % pageSize;
  const globalIndex = (currentImagePage - 1) * pageSize + positionInCurrentPage;

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
          // No images left
          setCurrentIndex(0);
        } else if (deletedIndex < currentIndex) {
          // Deleted image was before current position
          setCurrentIndex(currentIndex - 1);
        } else if (deletedIndex === currentIndex) {
          // Deleted the current image
          if (currentIndex >= updatedImages.length) {
            // Was the last image, show previous
            const newIndex = Math.max(0, updatedImages.length - 1);
            setCurrentIndex(newIndex);
          }
          // Otherwise keep same index (shows next image)
        }
        // If deleted image was after current position, no index change needed

        return updatedImages;
      });

      setIsDeletingImage(false);

      // Invalidate all pages to ensure consistency
      queryClient.invalidateQueries(['images']);
    },
    onError: () => {
      toast.error(t('delete_failed_key'));
      setIsDeletingImage(false);
    },
  });

  useEffect(() => {
    if (data?.items) {
      // Store metadata from API response
      setMetadata({
        total: data.total || 0,
        pages: data.pages || 1
      });

      if (!isDeletingImage) {
        setImages(prevImages => {
          // First load or filter change
          if (prevImages.length === 0) {
            setCurrentIndex(0);
            return data.items;
          }

          // Check if this is a filter change by comparing first item IDs
          const isFilterChange = prevImages.length > 0 &&
            data.items.length > 0 &&
            !prevImages.some(img => data.items.some(newImg => newImg.id === img.id));

          if (isFilterChange) {
            setCurrentIndex(0);
            return data.items;
          }

          // This is pagination - append new page data
          // Check if this page's data is already in the images array
          const isNewPage = !prevImages.some(img => data.items.some(newImg => newImg.id === img.id));
          if (isNewPage) {
            return [...prevImages, ...data.items];
          }

          return prevImages;
        });
      }
    } else {
      setImages([]);
      setCurrentIndex(0);
      setMetadata({ total: 0, pages: 1 });
    }
  }, [data, isDeletingImage, page]);

  useEffect(() => {
    setIsDeletingImage(false);
    setCurrentIndex(0);
    setPage(1);
    setMetadata({ total: 0, pages: 1 });
  }, [selectedPlant, selectedDisease]);

  // Handle when new page data is loaded and we need to adjust currentIndex
  useEffect(() => {
    if (images.length > 0 && currentIndex >= images.length) {
      // We're waiting for new page data - set index to the first item of the newly loaded page
      const previousPagesImages = (page - 1) * pageSize;
      setCurrentIndex(Math.min(previousPagesImages, images.length - 1));
    }
  }, [images.length, currentIndex, data?.items?.length, page, pageSize]);

  const handleNext = () => {
    const nextIndex = currentIndex + 1;
    
    // If we have more images in current loaded set, just move to next
    if (nextIndex < images.length) {
      setCurrentIndex(nextIndex);
      return;
    }
    
    // If we're at the end of loaded images but there are more pages
    if (nextIndex >= images.length && metadata.pages && page < metadata.pages) {
      setPage(prevPage => prevPage + 1);
      // The currentIndex will be updated when new data loads
    }
    // Otherwise, we're at the end - do nothing
  };

  const handleBack = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
    // Note: Going back across page boundaries would require loading previous pages
    // This is a complex feature that could be added later if needed
    // For now, we only allow going back within the currently loaded images
  };

  const handleDelete = (imageId) => {
    deleteImageMutation.mutate(imageId);
  };

  return {
    images,
    currentIndex,
    globalIndex,
    page,
    totalPages: metadata.pages,
    totalItems: metadata.total,
    isLoading: isLoading || isFetching || deleteImageMutation.isPending,
    error,
    handleNext,
    handleBack,
    handleDelete,
    currentImage: images[currentIndex],
    isDeletingImage,
    hasNextPage: page < metadata.pages,
    hasPrevPage: page > 1,
  };
};
