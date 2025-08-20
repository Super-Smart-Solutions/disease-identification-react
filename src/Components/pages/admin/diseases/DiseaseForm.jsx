import { Formik, Form, Field, ErrorMessage } from "formik";
import { toast } from "sonner";
import { diseaseSchema } from "../../../../schemas/diseaseValidation";
import {
  useAddDisease,
  useUpdateDisease,
  useDiseaseById,
} from "../../../../hooks/useDiseases";
import Button from "../../../Button";

const DiseaseForm = ({ diseaseId, onSuccess, onClose, t }) => {
  const { data: diseaseData } = useDiseaseById(diseaseId);
  const { mutateAsync: createDisease } = useAddDisease();
  const { mutateAsync: updateDisease } = useUpdateDisease();

  const isEdit = Boolean(diseaseId);

  const initialValues = {
    english_name: diseaseData?.english_name || "",
    arabic_name: diseaseData?.arabic_name || "",
    scientific_name: diseaseData?.scientific_name || "",
    treatments: diseaseData?.treatments || "",
    description: diseaseData?.description || "",
    symptoms: diseaseData?.symptoms || "",
  };

  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      if (isEdit) {
        await updateDisease({ id: diseaseId, ...values });
        toast.success(t("updated_key"));
      } else {
        await createDisease(values);
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
      validationSchema={diseaseSchema(t)}
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
              htmlFor="symptoms"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              {t("symptoms_key")}
            </label>
            <Field
              name="symptoms"
              className="custom-input"
              placeholder={t("symptoms_key")}
            />
            <ErrorMessage
              name="symptoms"
              component="div"
              className="text-red-500 text-sm mt-1"
            />
          </div>

          <div>
            <label
              htmlFor="treatments"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              {t("control_methods_key")}
            </label>
            <Field
              as="textarea"
              rows={3}
              name="treatments"
              className="custom-input"
              placeholder={t("control_methods_key")}
            />
            <ErrorMessage
              name="treatments"
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
              placeholder={t("description_key")}
            />
            <ErrorMessage
              name="description"
              component="div"
              className="text-red-500 text-sm mt-1"
            />
          </div>

          <div className="flex justify-end space-x-3">
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

export default DiseaseForm;
