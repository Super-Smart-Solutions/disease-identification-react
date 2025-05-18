import { Formik, Form, Field, ErrorMessage } from "formik";
import { toast } from "sonner";
import { organizationSchema } from "../../../../schemas/organizationValidation";
import {
  useAddOrganization,
  useUpdateOrganization,
  useOrganizationById,
} from "../../../../hooks/useOrganizations";
import Button from "../../../Button";

const OrganizationForm = ({ organizationId, onSuccess, onClose, t }) => {
  // const { data: organizationData } = useOrganizationById(organizationId);
  const { mutateAsync: createOrganization } = useAddOrganization();
  const { mutateAsync: updateOrganization } = useUpdateOrganization();

  const isEdit = Boolean(organizationId?.id);

  const initialValues = {
    name: organizationId?.name || "",
    description: organizationId?.description || "",
  };

  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      if (isEdit) {
        await updateOrganization({ id: organizationId?.id, ...values });
        toast.success(t("updated_key"));
      } else {
        await createOrganization(values);
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
      validationSchema={organizationSchema(t)}
      onSubmit={handleSubmit}
      enableReinitialize
    >
      {({ isSubmitting }) => (
        <Form className="space-y-4 p-4">
          <div>
            <label
              htmlFor="name"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              {t("name_key")}
            </label>
            <Field name="name" type="text" className="custom-input" />
            <ErrorMessage
              name="name"
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

export default OrganizationForm;
