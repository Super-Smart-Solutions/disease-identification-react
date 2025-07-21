import { useState } from 'react';
import PlantSelect from './PlantSelect';
import DiseaseSelect from './DiseaseSelect';
import Button from '../../../Button';

const ImageReviewer = ({ t, onClose }) => {
  const [selectedPlant, setSelectedPlant] = useState(null);
  const [selectedDisease, setSelectedDisease] = useState(null);

  return (
    <div className="p-4 space-y-4">
      <div className="flex flex-col md:flex-row gap-4">
        <PlantSelect
          t={t}
          plantOptions={[]}
          plantsLoading={false}
          selectedPlant={selectedPlant}
          setSelectedPlant={setSelectedPlant}
          setFieldValue={() => {}}
        />
        <DiseaseSelect
          t={t}
          diseaseOptions={[]}
          diseasesLoading={false}
          selectedDisease={selectedDisease}
          setSelectedDisease={setSelectedDisease}
          setFieldValue={() => {}}
        />
      </div>
      <div className="flex justify-end space-x-3 pt-4">
        <Button variant="outlined" onClick={onClose}>
          {t('close_key')}
        </Button>
      </div>
    </div>
  );
};

export default ImageReviewer;
