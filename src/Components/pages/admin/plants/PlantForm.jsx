import { Formik, Form, Field, ErrorMessage } from "formik";
import { toast } from "react-toastify";
import { useTranslation } from "react-i18next";
import { plantSchema } from "../../../../schemas/plantValidation";
import {
  useAddPlant,
  useUpdatePlant,
  usePlantById,
} from "../../../../hooks/usePlants";
import Button from "../../../Button";

const PlantForm = ({ plantId, onSuccess, onClose, t }) => {
  const { data: plantData } = usePlantById(plantId);
  const { mutateAsync: createPlant } = useAddPlant();
  const { mutateAsync: updatePlant } = useUpdatePlant();

  const isEdit = Boolean(plantId);

  const initialValues = {
    english_name: plantData?.english_name || "",
    arabic_name: plantData?.arabic_name || "",
    scientific_name: plantData?.scientific_name || "",
    description: plantData?.description || "",
  };

  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      if (isEdit) {
        await updatePlant({ id: plantId, ...values });
        toast.success(t("updated_key"));
      } else {
        await createPlant(values);
        toast.success(t("created_key"));
      }
      onSuccess?.();
    } catch (error) {
      toast.error(
        error.response?.data?.message || t("commonErrors.somethingWentWrong")
      );
    } finally {
      setSubmitting(false);
      onClose?.();
    }
  };

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={plantSchema(t)}
      onSubmit={handleSubmit}
      enableReinitialize
    >
      {({ isSubmitting }) => (
        <Form className="space-y-4 p-4">
          <div className="flex gap-2 justify-between items-center ">
            <div className=" md:w-6/12 w-full">
              <label
                htmlFor="english_name"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                {t("english_name_key")}
              </label>
              <Field name="english_name" type="text" className="custom-input" />
              <ErrorMessage
                name="english_name"
                component="div"
                className="text-red-500 text-sm mt-1"
              />
            </div>

            <div className=" md:w-6/12 w-full">
              <label
                htmlFor="arabic_name"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                {t("arabic_name_key")}
              </label>
              <Field
                name="arabic_name"
                type="text"
                className="custom-input"
                dir="rtl"
              />
              <ErrorMessage
                name="arabic_name"
                component="div"
                className="text-red-500 text-sm mt-1"
              />
            </div>
          </div>

          <div>
            <label
              htmlFor="scientific_name"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              {t("scientific_name_key")}
            </label>
            <Field
              name="scientific_name"
              type="text"
              className="custom-input"
            />
            <ErrorMessage
              name="scientific_name"
              component="div"
              className="text-red-500 text-sm mt-1"
            />
          </div>

          <div>
            <label
              htmlFor="description"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              {t("description_key")}
            </label>
            <Field
              as="textarea"
              name="description"
              rows={3}
              className="custom-input"
            />
            <ErrorMessage
              name="description"
              component="div"
              className="text-red-500 text-sm mt-1"
            />
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <Button variant="outlined" type="button" onClick={onClose}>
              {t("cancel_key")}
            </Button>
            <Button type="submit" loading={isSubmitting}>
              {t("save_key")}{" "}
            </Button>
          </div>
        </Form>
      )}
    </Formik>
  );
};

export default PlantForm;
