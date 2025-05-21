import { Formik, Form, Field, ErrorMessage } from "formik";
import { toast } from "sonner";
import { farmSchema } from "../../../../schemas/farmValidation";
import {
  useAddFarm,
  useUpdateFarm,
  useFarmById,
} from "../../../../hooks/useFarms.js";
import Button from "../../../Button";
import { useUserData } from "../../../../hooks/useUserData.js";

const FarmForm = ({ farmId, onSuccess, onClose, t }) => {
  const { user } = useUserData();
  const { data: farmData } = useFarmById(farmId);
  const { mutateAsync: createFarm } = useAddFarm();
  const { mutateAsync: updateFarm } = useUpdateFarm();

  const isEdit = Boolean(farmId);

  const initialValues = {
    name: farmData?.name || "",
    weather: farmData?.weather || "",
    location: farmData?.location || "",
  };

  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      if (isEdit) {
        await updateFarm({
          id: farmId,
          ...values,
        });
        toast.success(t("updated_key"));
      } else {
        await createFarm({ ...values, organization_id: user?.organization_id });
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
      validationSchema={farmSchema(t)}
      onSubmit={handleSubmit}
      enableReinitialize
    >
      {({ isSubmitting }) => (
        <Form className="space-y-4 p-4">
          <div className="flex gap-2 justify-between items-center ">
            <div className=" md:w-6/12 w-full">
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

            <div className=" md:w-6/12 w-full">
              <label
                htmlFor="weather"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                {t("weather_key")}
              </label>
              <Field
                name="weather"
                type="text"
                className="custom-input"
              />
              <ErrorMessage
                name="weather"
                component="div"
                className="text-red-500 text-sm mt-1"
              />
            </div>
          </div>

          <div>
            <label
              htmlFor="location"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              {t("location_key")}
            </label>
            <Field name="location" type="text" className="custom-input" />
            <ErrorMessage
              name="location"
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

export default FarmForm;
