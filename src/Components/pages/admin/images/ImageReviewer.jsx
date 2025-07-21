import { useState, useEffect } from 'react';
import { Formik, Form } from 'formik';
import PlantSelect from './PlantSelect';
import DiseaseSelect from './DiseaseSelect';
import Button from '../../../Button';
import { useImageReviewer } from '../../../../hooks/features/adminUploadImage/useImageReviewer';
import { FiChevronLeft, FiChevronRight, FiTrash2 } from 'react-icons/fi';
import { useQuery } from '@tanstack/react-query';
import { fetchDiseasesByPlant, fetchPlants } from '../../../../api/plantAPI';
import ConfirmationModal from '../../../ConfirmationModal';

const ImageReviewer = ({ t, onClose }) => {
  const [selectedPlant, setSelectedPlant] = useState(null);
  const [selectedDisease, setSelectedDisease] = useState(null);
  const [imageToDelete, setImageToDelete] = useState(null);

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

  const { currentImage, isLoading, handleNext, handleBack, handleDelete } = useImageReviewer({
    selectedPlant,
    selectedDisease,
    t,
  });

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'ArrowRight') {
        handleNext();
      } else if (e.key === 'ArrowLeft') {
        handleBack();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [handleNext, handleBack]);

  const confirmDelete = () => {
    if (currentImage) {
      handleDelete(currentImage.id);
    }
    setImageToDelete(null);
  };

  return (
    <div className="p-4 space-y-4">
      <Formik
        initialValues={{ plant_id: '', disease_id: '' }}
        onSubmit={() => {}}
      >
        {({ setFieldValue }) => (
          <Form className="flex flex-col md:flex-row gap-4">
            <PlantSelect
              t={t}
              plantOptions={plantOptions}
              plantsLoading={plantsLoading}
              selectedPlant={selectedPlant}
              setSelectedPlant={setSelectedPlant}
              setFieldValue={(field, value) => {
                setFieldValue(field, value);
                if (field === 'plant_id') {
                  setSelectedPlant(value);
                  setSelectedDisease(null); // Reset disease when plant changes
                  setFieldValue('disease_id', '');
                }
              }}
            />
            <DiseaseSelect
              t={t}
              diseaseOptions={diseaseOptions}
              diseasesLoading={diseasesLoading}
              selectedDisease={selectedDisease}
              setSelectedDisease={setSelectedDisease}
              setFieldValue={(field, value) => {
                setFieldValue(field, value);
                if (field === 'disease_id') {
                  setSelectedDisease(value);
                }
              }}
            />
          </Form>
        )}
      </Formik>

      <div className="relative w-full h-96 bg-gray-100 rounded-lg flex items-center justify-center">
        {isLoading && <p>{t('loading_key')}</p>}
        {!isLoading && currentImage && (
          <img
            src={currentImage.url}
            alt={currentImage.name}
            className="max-h-full max-w-full object-contain"
          />
        )}
        {!isLoading && !currentImage && <p>{t('no_images_found_key')}</p>}
      </div>

      <div className="flex justify-between items-center pt-4">
        <Button onClick={handleBack} disabled={isLoading || !currentImage}>
          <FiChevronLeft className="mr-2" />
          {t('back_key')}
        </Button>
        <Button
          variant="danger"
          onClick={() => setImageToDelete(currentImage)}
          disabled={isLoading || !currentImage}
        >
          <FiTrash2 className="mr-2" />
          {t('delete_key')}
        </Button>
        <Button onClick={handleNext} disabled={isLoading || !currentImage}>
          {t('next_key')}
          <FiChevronRight className="ml-2" />
        </Button>
      </div>

      <div className="flex justify-end space-x-3 pt-4">
        <Button variant="outlined" onClick={onClose}>
          {t('close_key')}
        </Button>
      </div>
      {imageToDelete && (
        <ConfirmationModal
          t={t}
          onConfirm={confirmDelete}
          onCancel={() => setImageToDelete(null)}
        />
      )}
    </div>
  );
};

export default ImageReviewer;
