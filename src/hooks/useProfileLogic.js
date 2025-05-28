import { useState } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import { useUserData } from "./useUserData";

const useProfileLogic = () => {
    const { t } = useTranslation();
    const { user, isError, error, updateUserData, uploadUserAvatar } = useUserData();
    const [isEditMode, setIsEditMode] = useState(false);
    const [changedFields, setChangedFields] = useState({});
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [avatarPreview, setAvatarPreview] = useState(user?.avatar || null);

    const initialValues = {
        first_name: user?.first_name || "",
        last_name: user?.last_name || "",
        email: user?.email || "",
        phone_number: user?.phone_number || "",
    };

    const handleFieldChange = (setFieldValue, fieldName, value) => {
        setFieldValue(fieldName, value);
        setChangedFields({ ...changedFields, [fieldName]: value });
    };

    const handleAvatarChange = async (e) => {
        const file = e.target.files[0];
        if (file) {
            setAvatarPreview(URL.createObjectURL(file));
            setChangedFields({ ...changedFields, avatar: file });
            await uploadUserAvatar(file);
            toast.success(t("updated_key"))
        }
    };

    const handleCancel = (resetForm) => {
        if (Object.keys(changedFields).length > 0) {
            setIsModalOpen(true);
        } else {
            resetForm();
            setIsEditMode(false);
            setChangedFields({});
            setAvatarPreview(user?.avatar || null);
        }
    };

    const handleDiscardConfirm = (resetForm) => {
        resetForm();
        setIsEditMode(false);
        setChangedFields({});
        setAvatarPreview(user?.avatar || null);
        setIsModalOpen(false);
    };

    const handleSubmit = async (values, { setSubmitting }) => {
        try {
            if (Object.keys(changedFields).length > 0) {
                const userData = Object.fromEntries(
                    Object.entries(changedFields).filter(([key]) => key !== "avatar")
                );
                if (Object.keys(userData).length > 0) {
                    await updateUserData(user.id, userData);
                }
            }
            toast.success(t("updated_key"));
            setIsEditMode(false);
            setChangedFields({});
        } catch (err) {
            console.log(err);

        }
        setSubmitting(false);
    };

    return {
        user,
        isError,
        error,
        isEditMode,
        setIsEditMode,
        changedFields,
        setChangedFields,
        isModalOpen,
        setIsModalOpen,
        avatarPreview,
        initialValues,
        handleFieldChange,
        handleAvatarChange,
        handleCancel,
        handleDiscardConfirm,
        handleSubmit,
    };
};

export default useProfileLogic;