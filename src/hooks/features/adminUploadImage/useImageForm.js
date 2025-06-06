import { useState, useRef, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { toast } from 'sonner';

import {
    useImageById,
    useUploadImage,
    useUpdateImage,
} from '../../useImages';
import { getImageValidationSchema } from '../../../schemas/imageValidation';
import { fetchDiseasesByPlant, fetchPlants } from '../../../api/plantAPI';

export const useImageForm = ({ imageId, onSuccess, onClose, t }) => {
    const isEdit = !!imageId;
    const { data: imageData } = useImageById(imageId);
    const { mutateAsync: uploadImage, isPending: isUploading } = useUploadImage();
    const { mutateAsync: updateImage, isPending: isUpdating } = useUpdateImage();
    const formRef = useRef();
    const [selectedPlant, setSelectedPlant] = useState(null);
    const [selectedDisease, setSelectedDisease] = useState(null);

    useEffect(() => {
        if (isEdit && imageData) {
            setSelectedPlant(imageData.plant_id || null);
            setSelectedDisease(imageData.disease_id || null);
        }
    }, [isEdit, imageData]);

    const { data: plantOptions = [], isLoading: plantsLoading } = useQuery({
        queryKey: ['plants'],
        queryFn: async () => {
            const plants = await fetchPlants();
            return plants.items || [];
        },
    });

    const { data: diseaseOptions = [], isLoading: diseasesLoading } = useQuery({
        queryKey: ['diseases', selectedPlant],
        queryFn: async () => {
            if (!selectedPlant) return [];
            const diseases = await fetchDiseasesByPlant(selectedPlant);
            return diseases?.items || [];
        },
        enabled: !!selectedPlant,
    });

    const initialValues = {
        name: imageData?.name || '',
        image_type: imageData?.image_type || '',
        plant_id: imageData?.plant_id || '',
        disease_id: imageData?.disease_id || '',
        image_file: null,
    };

    const validationSchema = getImageValidationSchema(t, isEdit);

    const handleSubmit = async (values, { setSubmitting }) => {
        try {
            const formData = new FormData();
            formData.append('name', values.name || values.image_file[0]?.name);
            formData.append('image_type', values.image_type);
            formData.append('plant_id', values.plant_id);
            formData.append('disease_id', values.disease_id);

            if (!isEdit && values.image_file) {
                formData.append('image_file', values.image_file);
            }

            if (!isEdit) {
                await uploadImage(formData);
            } else {
                await updateImage({ ...values, id: imageId });
            }

            toast.success(isEdit ? t('image_updated_key') : t('image_created_key'));
            onSuccess?.();
            handleClose();
        } catch (error) {
            console.error('Upload error:', error);
            toast.error(
                error.response?.data?.message || t('commonErrors.somethingWentWrong')
            );
        } finally {
            setSubmitting(false);
        }
    };

    const handleClose = () => {
        formRef.current?.resetForm();
        onClose?.();
    };

    return {
        formRef,
        initialValues,
        validationSchema,
        handleSubmit,
        handleClose,
        plantOptions,
        plantsLoading,
        diseaseOptions,
        diseasesLoading,
        selectedPlant,
        setSelectedPlant,
        selectedDisease,
        setSelectedDisease,
        isUploading,
        isUpdating,
    };
};