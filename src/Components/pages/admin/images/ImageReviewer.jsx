import { useState, useEffect } from "react";
import { Formik, Form } from "formik";
import PlantSelect from "./PlantSelect";
import DiseaseSelect from "./DiseaseSelect";
import Button from "../../../Button";
import { useImageReviewer } from "../../../../hooks/features/adminUploadImage/useImageReviewer";
import { FiChevronLeft, FiChevronRight, FiTrash2 } from "react-icons/fi";
import { useQuery } from "@tanstack/react-query";
import { fetchDiseasesByPlant, fetchPlants } from "../../../../api/plantAPI";
import ConfirmationModal from "../../../ConfirmationModal";
import ImageViewer from "./ImageViewer.jsx";

const ImageReviewer = ({ t, onClose }) => {
  const [selectedPlant, setSelectedPlant] = useState(null);
  const [selectedDisease, setSelectedDisease] = useState(null);
  const [imageToDelete, setImageToDelete] = useState(null);

  const { data: plantOptions = [], isLoading: plantsLoading } = useQuery({
    queryKey: ["plants"],
    queryFn: async () => {
      const plants = await fetchPlants();
      return plants.items || [];
    },
  });

  const { data: diseaseOptions = [], isLoading: diseasesLoading } = useQuery({
    queryKey: ["diseases", selectedPlant],
    queryFn: async () => {
      if (!selectedPlant) return [];
      const diseases = await fetchDiseasesByPlant(selectedPlant);
      return diseases?.items || [];
    },
    enabled: !!selectedPlant,
  });

  const {
    currentImage,
    images,
    currentIndex,
    isLoading,
    handleNext,
    handleBack,
    handleDelete,
  } = useImageReviewer({
    selectedPlant,
    selectedDisease,
    t,
  });

  useEffect(() => {
    const handleKeyDown = (e) => {
      // Only handle keyboard events if there are images and no modals are open
      if (!currentImage || imageToDelete) return;

      switch (e.key) {
        case "ArrowRight":
        case "ArrowDown":
          e.preventDefault();
          handleNext();
          break;
        case "ArrowLeft":
        case "ArrowUp":
          e.preventDefault();
          handleBack();
          break;
        case "Delete":
        case "Backspace":
          e.preventDefault();
          setImageToDelete(currentImage);
          break;
        case "Escape":
          e.preventDefault();
          if (imageToDelete) {
            setImageToDelete(null);
          } else {
            onClose();
          }
          break;
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [handleNext, handleBack, currentImage, imageToDelete, onClose]);

  const confirmDelete = () => {
    if (currentImage) {
      handleDelete(currentImage.id);
    }
    setImageToDelete(null);
  };

  return (
    <div className="p-4 space-y-6 max-w-6xl mx-auto">
      {/* Filter Section */}
      <div className="bg-white rounded-lg shadow-sm p-4">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">
          {t("filter_images_key") || "Filter Images"}
        </h3>
        <Formik
          initialValues={{ plant_id: "", disease_id: "" }}
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
                  if (field === "plant_id") {
                    setSelectedPlant(value);
                    setSelectedDisease(null); // Reset disease when plant changes
                    setFieldValue("disease_id", "");
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
                  if (field === "disease_id") {
                    setSelectedDisease(value);
                  }
                }}
              />
            </Form>
          )}
        </Formik>
      </div>

      {/* Image Viewer Section */}
      {selectedPlant && selectedDisease ? (
        <div className="bg-white rounded-lg shadow-sm p-4">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">
            {t("image_review_key") || "Image Review"}
          </h3>

          <ImageViewer
            t={t}
            currentImage={currentImage}
            images={images}
            currentIndex={currentIndex}
            isLoading={isLoading}
            handleBack={handleBack}
            handleNext={handleNext}
          />

          {/* Action Buttons */}
          {currentImage && !isLoading && (
            <div className="flex justify-center pt-6">
              <Button
                variant="danger"
                size="large"
                width="auto"
                onClick={() => setImageToDelete(currentImage)}
                disabled={isLoading || !currentImage}
                className="flex items-center justify-center gap-2"
              >
                <FiTrash2 />
                <span>{t("delete_image_key") || t("delete_key")}</span>
              </Button>
            </div>
          )}
        </div>
      ) : (
        <div className="bg-gray-50 rounded-lg border-2 border-dashed border-gray-300 p-8 text-center">
          <h3 className="text-lg font-medium text-gray-600 mb-2">
            {t("select_plant_disease_key") || "Select Plant and Disease"}
          </h3>
          <p className="text-gray-500">
            {t("select_plant_disease_desc_key") ||
              "Please select both a plant and disease to view images for review."}
          </p>
        </div>
      )}

      {/* Footer Actions */}
      <div className="flex justify-end space-x-3 pt-4">
        <Button
          variant="outlined"
          onClick={onClose}
          className="hover:scale-105 transition-transform"
        >
          {t("close_key")}
        </Button>
      </div>

      {/* Confirmation Modal */}
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
