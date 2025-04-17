import React, { useState, useRef } from "react";
import AvatarEditor from "react-avatar-editor";
import FileUpload from "../../FileUpload";
import Button from "../../Button";
import { IoClose } from "react-icons/io5";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { uploadUserAvatar } from "../../../api/userAPI";
import { toast } from "react-toastify";
import { motion } from "framer-motion";

const AvatarStep = ({ registerData }) => {
  const { t } = useTranslation();
  const editorRef = useRef(null);
  const navigate = useNavigate();
  const [selectedFile, setSelectedFile] = useState(null);
  const [tempSelectedFile, setTempSelectedFile] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [scale, setScale] = useState(1.2);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSave = async () => {
    if (!editorRef.current || isLoading) return;

    setIsLoading(true);
    setError(null);

    try {
      const canvas = editorRef.current.getImageScaledToCanvas();
      const blob = await new Promise((resolve) => {
        canvas.toBlob((blob) => resolve(blob), "image/png", 1);
      });

      if (!blob) {
        throw new Error(t("avatar_upload_failed"));
      }

      const file = new File([blob], "avatar.png", {
        type: "image/png",
        lastModified: Date.now(),
      });

      await uploadUserAvatar(file, registerData?.token);
      setSelectedFile(file);
      setShowModal(false);
      toast.success(t("account_created_successfully"));
      navigate("/auth/login");
    } catch (error) {
      console.error("Error saving avatar:", error);
      setError(error.message || t("avatar_upload_error"));
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileSelect = (files) => {
    if (files.length > 0) {
      setTempSelectedFile(files[0]);
      setSelectedFile(files[0]);
      setShowModal(true);
      setError(null);
    }
  };

  const handleCancel = () => {
    setShowModal(false);
    setTempSelectedFile(null);
    setError(null);
  };

  const handleSkip = () => {
    toast.success(t("account_created_successfully"));
    navigate("/auth/login");
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold text-center mb-6 text-gray-800">
        {t("profile_picture_setup")}
      </h2>

      <p className="text-gray-600 mb-6 text-center">
        {t("profile_picture_instruction")}
      </p>

      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {t("upload_profile_picture")}
          </label>
          <FileUpload
            allowRemove={true}
            accept="image/*"
            multiple={false}
            selectedFile={selectedFile ? [selectedFile] : []}
            setSelectedFile={handleFileSelect}
          />
        </div>

        <div className="flex flex-col sm:flex-row gap-4 pt-4">
          <Button variant="outline" onClick={handleSkip} className="flex-1">
            {t("skip_and_login")}
          </Button>
          <Button
            onClick={() => selectedFile && setShowModal(true)}
            disabled={!selectedFile}
            className="flex-1"
          >
            {t("continue_to_crop")}
          </Button>
        </div>
      </div>

      {showModal && tempSelectedFile && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="overlay"
        >
          <motion.div
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            className="bg-white rounded-lg shadow-xl max-w-md w-full p-6 relative"
          >
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-800">
                {t("adjust_profile_picture")}
              </h3>
              <button
                onClick={handleCancel}
                className="text-gray-500 hover:text-gray-700"
                disabled={isLoading}
              >
                <IoClose size={24} />
              </button>
            </div>

            <div className="flex flex-col items-center space-y-4">
              <AvatarEditor
                ref={editorRef}
                image={tempSelectedFile}
                width={200}
                height={200}
                border={50}
                borderRadius={100}
                color={[255, 255, 255, 0.6]}
                scale={scale}
                rotate={0}
              />

              <div className="w-full max-w-xs">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {t("zoom_level")}
                </label>
                <input
                  type="range"
                  min="1"
                  max="3"
                  step="0.1"
                  value={scale}
                  onChange={(e) => setScale(parseFloat(e.target.value))}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                  disabled={isLoading}
                />
              </div>

              {error && (
                <div className="text-red-500 text-sm mt-2">{error}</div>
              )}

              <div className="flex space-x-3 pt-4 w-full justify-end">
                <Button
                  variant="outline"
                  onClick={handleCancel}
                  disabled={isLoading}
                >
                  {t("cancel")}
                </Button>
                <Button
                  onClick={handleSave}
                  loading={isLoading}
                  disabled={isLoading}
                >
                  {t("save_changes")}
                </Button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
};

export default AvatarStep;
