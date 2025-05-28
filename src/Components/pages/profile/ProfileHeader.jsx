import React from "react";
import { useTranslation } from "react-i18next";
import AvatarUpload from "./AvatarUpload";
import UserProfileForm from "./UserProfileForm";
import useProfileLogic from "../../../hooks/useProfileLogic";

const ProfileHeader = () => {
  const { t } = useTranslation();
  const {
    isEditMode,
    setIsEditMode,
    changedFields,
    isModalOpen,
    setIsModalOpen,
    message,
    avatarPreview,
    initialValues,
    handleFieldChange,
    handleAvatarChange,
    handleCancel,
    handleDiscardConfirm,
    handleSubmit,
  } = useProfileLogic();

  return (
    <div className=" flex gap-12">
      <AvatarUpload
        avatarPreview={avatarPreview}
        handleAvatarChange={handleAvatarChange}
      />
      <UserProfileForm
        initialValues={initialValues}
        isEditMode={isEditMode}
        setIsEditMode={setIsEditMode}
        changedFields={changedFields}
        avatarFile={changedFields.avatar}
        handleCancel={handleCancel}
        handleDiscardConfirm={handleDiscardConfirm}
        isModalOpen={isModalOpen}
        setIsModalOpen={setIsModalOpen}
        message={message}
        handleSubmit={handleSubmit}
        handleFieldChange={handleFieldChange}
      />
    </div>
  );
};

export default ProfileHeader;
