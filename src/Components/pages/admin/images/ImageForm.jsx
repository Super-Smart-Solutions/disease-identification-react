import { Formik, Form, Field, ErrorMessage } from "formik";
import { toast } from "sonner";
import { useQuery } from "@tanstack/react-query";
import {
  useImageById,
  useUploadImage,
  useUpdateImage,
} from "../../../../hooks/useImages";
import Button from "../../../Button";
import FileUpload from "../../../FileUpload";
import SelectInput from "../../../Formik/SelectInput";
import { fetchDiseasesByPlant, fetchPlants } from "../../../../api/plantAPI";
import { useState, useRef, useEffect } from "react";
import { getImageValidationSchema } from "../../../../schemas/imageValidation";

const ProgressBar = ({ progress = 0 }) => {
  const [displayProgress, setDisplayProgress] = useState(0);

  useEffect(() => {
    const animationDuration = 300;
    let startTime = null;
    let animationFrameId = null;

    const animate = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const elapsed = timestamp - startTime;
      const progressRatio = Math.min(elapsed / animationDuration, 1);
      const currentProgress = progressRatio * progress;

      setDisplayProgress(currentProgress);

      if (progressRatio < 1) {
        animationFrameId = requestAnimationFrame(animate);
      } else {
        setDisplayProgress(progress);
      }
    };

    animationFrameId = requestAnimationFrame(animate);

    return () => {
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }
    };
  }, [progress]);

  return (
    <div className="w-full bg-gray-200 rounded-full h-2.5 mt-2">
      <div
        className="bg-blue-600 h-2.5 rounded-full transition-all duration-100"
        style={{ width: `${displayProgress}%` }}
      />
      <div className="text-sm text-gray-600 mt-1">
        {Math.round(displayProgress)}% Complete
      </div>
    </div>
  );
};

const PlantSelect = ({
  t,
  plantOptions,
  plantsLoading,
  setFieldValue,
  selectedPlant,
  setSelectedPlant,
}) => (
  <div className="w-full md:w-1/2">
    <Field name="plant_id">
      {({ field }) => (
        <SelectInput
          label={t("select_plant_key")}
          options={plantOptions.map((plant) => ({
            value: plant.id,
            label: t(`plants.${plant.english_name}`),
          }))}
          value={selectedPlant}
          onChange={(selectedOption) => {
            setFieldValue("plant_id", selectedOption.value);
            setSelectedPlant(selectedOption.value);
            setFieldValue("disease_id", "");
          }}
          placeholder={t("select_plant_key")}
          isLoading={plantsLoading}
        />
      )}
    </Field>
    <ErrorMessage
      name="plant_id"
      render={(error) => (
        <div className="text-red-500 text-sm mt-1">
          {typeof error === "string"
            ? error
            : t(error.msg || "commonErrors.somethingWentWrong")}
        </div>
      )}
    />
  </div>
);

const DiseaseSelect = ({
  t,
  diseaseOptions,
  diseasesLoading,
  setFieldValue,
  selectedDisease,
  setSelectedDisease,
}) => (
  <div className="w-full md:w-1/2">
    <Field name="disease_id">
      {({ field }) => (
        <SelectInput
          label={t("select_disease_key")}
          options={diseaseOptions.map((disease) => ({
            value: disease.id,
            label: t(`diseases.${disease.english_name}`),
          }))}
          value={selectedDisease}
          onChange={(selectedOption) => {
            setFieldValue("disease_id", selectedOption.value);
            setSelectedDisease(selectedOption.value);
          }}
          placeholder={t("select_disease_key")}
          isLoading={diseasesLoading}
        />
      )}
    </Field>
    <ErrorMessage
      name="disease_id"
      render={(error) => (
        <div className="text-red-500 text-sm mt-1">
          {typeof error === "string"
            ? error
            : t(error.msg || "commonErrors.somethingWentWrong")}
        </div>
      )}
    />
  </div>
);

const ImageForm = ({ imageId, onSuccess, onClose, t }) => {
  const isEdit = !!imageId;
  const { data: imageData } = useImageById(imageId);
  const { mutateAsync: uploadImage, isPending: isUploading } = useUploadImage();
  const { mutateAsync: updateImage, isPending: isUpdating } = useUpdateImage();
  const [uploadProgress, setUploadProgress] = useState(0);
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

  const initialValues = {
    name: imageData?.name || "",
    image_type: imageData?.image_type || "",
    plant_id: imageData?.plant_id || "",
    disease_id: imageData?.disease_id || "",
    image_file: null,
  };

  const validationSchema = getImageValidationSchema(t, isEdit);

  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      const formData = new FormData();
      formData.append("name", values.name || values.image_file[0]?.name);
      formData.append("image_type", values.image_type);
      formData.append("plant_id", values.plant_id);
      formData.append("disease_id", values.disease_id);

      if (!isEdit && values.image_file) {
        formData.append("image_file", values.image_file);
      }

      if (!isEdit) {
        await uploadImage(formData, {
          onUploadProgress: (progressEvent) => {
            const percentCompleted = Math.round(
              (progressEvent.loaded * 100) / (progressEvent.total || 1)
            );
            setUploadProgress(percentCompleted);
          },
        });
      } else {
        await updateImage({ ...values, id: imageId });
      }

      toast.success(isEdit ? t("image_updated_key") : t("image_created_key"));
      onSuccess?.();
      handleClose();
    } catch (error) {
      console.error("Upload error:", error);
      toast.error(
        error.response?.data?.message || t("commonErrors.somethingWentWrong")
      );
    } finally {
      setSubmitting(false);
      setUploadProgress(0);
    }
  };

  const handleClose = () => {
    formRef.current?.resetForm();
    setUploadProgress(0);
    onClose?.();
  };

  return (
    <Formik
      innerRef={formRef}
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={handleSubmit}
      enableReinitialize
    >
      {({ isSubmitting, setFieldValue, values }) => (
        <Form className="space-y-4 p-4">
          <fieldset disabled={isUploading || isUpdating || isSubmitting}>
            {/* Name and Image Type inputs */}
            <div className="flex flex-col md:flex-row gap-4">
              <div className="w-full">
                <label
                  htmlFor="image_type"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  {t("image_type_key")}
                </label>
                <Field
                  name="image_type"
                  type="text"
                  className="custom-input w-full"
                  placeholder={t("image_type_placeholder_key")}
                />
                <ErrorMessage
                  name="image_type"
                  render={(error) => (
                    <div className="text-red-500 text-sm mt-1">
                      {typeof error === "string"
                        ? error
                        : t(error.msg || "commonErrors.somethingWentWrong")}
                    </div>
                  )}
                />
              </div>
            </div>

            {/* Plant and Disease selects */}
            <div className="flex flex-col md:flex-row gap-4">
              <PlantSelect
                t={t}
                plantOptions={plantOptions}
                plantsLoading={plantsLoading}
                setFieldValue={setFieldValue}
                selectedPlant={selectedPlant}
                setSelectedPlant={setSelectedPlant}
              />
              <DiseaseSelect
                t={t}
                diseaseOptions={diseaseOptions}
                diseasesLoading={diseasesLoading}
                setFieldValue={setFieldValue}
                selectedDisease={selectedDisease}
                setSelectedDisease={setSelectedDisease}
              />
            </div>

            {/* File Upload Section and Progress Bar */}
            {!isEdit && (
              <div className="w-full">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t("image_upload_key")}
                </label>
                <Field name="image_file">
                  {({ field, form }) => (
                    <FileUpload
                      allowRemove={true}
                      accept="image/*"
                      multiple={false}
                      selectedFile={field.value ? [field.value] : []}
                      setSelectedFile={(files) => {
                        form.setFieldValue("image_file", files[0]);
                        form.setFieldValue("name", files[0]?.name);
                      }}
                    />
                  )}
                </Field>
                {isUploading && <ProgressBar progress={uploadProgress} />}
              </div>
            )}
          </fieldset>

          {/* Form actions */}
          <div className="flex justify-end space-x-3 pt-4">
            <Button
              variant="outlined"
              type="button"
              onClick={handleClose}
              disabled={isSubmitting || isUploading || isUpdating}
            >
              {t("cancel_key")}
            </Button>
            <Button
              type="submit"
              loading={isSubmitting || isUploading || isUpdating}
              disabled={
                (!isEdit && !values.image_file) || isUploading || isUpdating
              }
            >
              {t("save_key")}
            </Button>
          </div>
        </Form>
      )}
    </Formik>
  );
};

export default ImageForm;
