import { Formik, Form, Field, ErrorMessage } from "formik";
import PlantSelect from "./PlantSelect";
import DiseaseSelect from "./DiseaseSelect";
import ProgressBar from "./ProgressBar";
import { useImageForm } from "../../../../hooks/features/adminUploadImage/useImageForm";
import Button from "../../../Button";
import FileUpload from "../../../FileUpload";

const ImageForm = ({ imageId, onSuccess, onClose, t }) => {
  const {
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
  } = useImageForm({ imageId, onSuccess, onClose, t });

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
            {!imageId && (
              <div className="w-full">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t("image_upload_key")}
                </label>
                <Field name="image_file">
                  {({ field, form }) => (
                    <FileUpload
                      allowRemove={true}
                      multiple={false}
                      selectedFile={field.value ? [field.value] : []}
                      setSelectedFile={(files) => {
                        form.setFieldValue("image_file", files[0]);
                        form.setFieldValue("name", files[0]?.name);
                      }}
                    />
                  )}
                </Field>
                {isUploading && <ProgressBar t={t} />}
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
                (!imageId && !values.image_file) || isUploading || isUpdating
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
