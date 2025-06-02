import React from "react";
import AvatarUpload from "./AvatarUpload";
import UserProfileForm from "./UserProfileForm";
import useProfileLogic from "../../../hooks/useProfileLogic";

const ProfileHeader = () => {
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
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
      <div className="md:col-span-1 flex justify-center md:justify-start">
        <AvatarUpload
          avatarPreview={avatarPreview}
          handleAvatarChange={handleAvatarChange}
        />
      </div>
      <div className="md:col-span-2">
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
    </div>
  );
};

export default ProfileHeader;
