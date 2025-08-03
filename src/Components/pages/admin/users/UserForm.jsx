import { Formik, Form, Field, ErrorMessage } from "formik";
import { toast } from "sonner";
import * as Yup from "yup";
import Button from "../../../Button";
import { useUserById, useUpdateUser } from "../../../../hooks/useUsers";
import { profileFormValidation } from "../../../../schemas/profileFormValidation";
import { registerUser } from "./../../../../api/authAPI";
import { verifyUserById } from "../../../../api/userAPI";
import PasswordInput from "../../../Formik/PasswordInput";

const UserForm = ({ userId, onSuccess, onClose, t }) => {
  const { data: userData } = useUserById(userId);
  const { mutateAsync: updateUser } = useUpdateUser();

  const isEdit = Boolean(userId);

  const initialValues = {
    email: userData?.email || "",
    first_name: userData?.first_name || "",
    last_name: userData?.last_name || "",
    phone_number: userData?.phone_number || "",
    organization_id: userData?.organization_id || "",
  };

  const validationSchema = profileFormValidation(t).concat(
    Yup.object({
      password: isEdit
        ? Yup.string().optional()
        : Yup.string()
            .min(6, t("password_min_length_key"))
            .required(t("required_field_key")),
      organization_id: Yup.string(),
    })
  );

  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      if (isEdit) {
        await updateUser({ id: userId, ...values });
        toast.success(t("updated_key"));
      } else {
        const newUser = await registerUser(values);
        await verifyUserById(newUser.id);
        toast.success(t("registered_and_verified_key"));
      }
      onSuccess?.();
    } catch (error) {
      console.log(error);
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
      validationSchema={validationSchema}
      onSubmit={handleSubmit}
      enableReinitialize
    >
      {({ isSubmitting, setFieldValue }) => (
        <Form className="space-y-4 p-4">
          <div className="flex gap-2 justify-between items-center">
            <div className="w-full md:w-6/12">
              <label
                htmlFor="first_name"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                {t("first_name_key")}
              </label>
              <Field name="first_name" type="text" className="custom-input" />
              <ErrorMessage
                name="first_name"
                component="div"
                className="text-red-500 text-sm mt-1"
              />
            </div>

            <div className="w-full md:w-6/12">
              <label
                htmlFor="last_name"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                {t("last_name_key")}
              </label>
              <Field name="last_name" type="text" className="custom-input" />
              <ErrorMessage
                name="last_name"
                component="div"
                className="text-red-500 text-sm mt-1"
              />
            </div>
          </div>
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              {t("email_key")}
            </label>
            <Field
              name="email"
              type="email"
              className="custom-input"
              placeholder="user@example.com"
            />
            <ErrorMessage
              name="email"
              component="div"
              className="text-red-500 text-sm mt-1"
            />
          </div>
          <div>
            <label
              htmlFor="organization_id"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              {t("organization_id_key")}
            </label>
            <Field
              name="organization_id"
              type="text"
              className="custom-input"
              placeholder={t("organization_id_placeholder_key")}
            />
            <ErrorMessage
              name="organization_id"
              component="div"
              className="text-red-500 text-sm mt-1"
            />
          </div>
          <div>
            <label
              htmlFor="phone_number"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              {t("phone_number_key")}
            </label>
            <Field
              name="phone_number"
              type="tel"
              className="custom-input"
              placeholder="1234567890"
            />
            <ErrorMessage
              name="phone_number"
              component="div"
              className="text-red-500 text-sm mt-1"
            />
          </div>
          {!isEdit && (
            <div>
              <Field name="password">
                {({ field }) => (
                  <PasswordInput
                    label={t("hashed_password_key")}
                    value={field.value}
                    onChange={(value) => setFieldValue("password", value)}
                    placeholder={t("password_key")}
                  />
                )}
              </Field>
              <ErrorMessage
                name="password"
                component="div"
                className="text-red-500 text-sm mt-1"
              />
            </div>
          )}

          <div className="flex justify-end space-x-3 pt-4">
            <Button variant="outlined" type="button" onClick={onClose}>
              {t("cancel_key")}
            </Button>
            <Button type="submit" loading={isSubmitting}>
              {isEdit ? t("save_key") : t("register_key")}
            </Button>
          </div>
        </Form>
      )}
    </Formik>
  );
};

export default UserForm;
