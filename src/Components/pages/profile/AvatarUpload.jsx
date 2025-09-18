import React, { useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import AvatarEditor from "react-avatar-editor";
import { motion, AnimatePresence } from "framer-motion";
import { MdEdit } from "react-icons/md";
import Button from "../../Button";

const AvatarUpload = ({ handleAvatarChange, avatarPreview }) => {
  const { t } = useTranslation();
  const editorRef = useRef(null);
  const fileInputRef = useRef(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [tempImage, setTempImage] = useState(null);
  const [scale, setScale] = useState(1.2);
  const [rotate, setRotate] = useState(0);
  const [error, setError] = useState(null);

  const MAX_FILE_SIZE = 4 * 1024 * 1024;

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (!file.type.startsWith("image/")) {
        setError(t("avatar_upload_failed") + ": Only image files are allowed");
        return;
      }
      if (file.size > MAX_FILE_SIZE) {
        setError(
          t("avatar_upload_failed") + ": File size must be less than 4MB"
        );
        return;
      }
      setError(null);
      setTempImage(URL.createObjectURL(file));
      setIsModalOpen(true);
    }
  };

  const handleConfirm = async () => {
    if (editorRef.current) {
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

        handleAvatarChange({ target: { files: [file] } });
        setIsModalOpen(false);
        setTempImage(null);
        setScale(1.2);
        setRotate(0);
      } catch (err) {
        setError(err.message);
      }
    }
  };

  const handleCancel = () => {
    setIsModalOpen(false);
    setTempImage(null);
    setScale(1.2);
    setRotate(0);
    setError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = null;
    }
  };

  return (
    <>
      <div className="flex justify-center mb-6">
        <div className="relative w-full h-64 rounded-full overflow-hidden group">
          <AvatarEditor
            image={avatarPreview || "/user-avatar.png"}
            width={260}
            height={260}
            border={0}
            borderRadius={64}
            scale={1.2}
            rotate={0}
            disableBoundaryChecks={false}
            className="w-full h-full object-cover"
          />
          <div
            className="absolute inset-0 flex items-center justify-center bg-black/50 bg opacity-0 group-hover:opacity-100 transition-opacity duration-300 cursor-pointer"
            onClick={() => fileInputRef.current?.click()}
          >
            <MdEdit className="text-white text-3xl" />
          </div>
          <input
            type="file"
            accept="image/*"
            ref={fileInputRef}
            className="absolute inset-0 opacity-0 cursor-pointer"
            onChange={handleFileChange}
          />
        </div>
      </div>

      <AnimatePresence>
        {isModalOpen && (
          <motion.div
            className="overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-white rounded-lg p-6 max-w-md w-full"
              initial={{ scale: 0.8, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.8, y: 20 }}
              transition={{ duration: 0.3 }}
            >
              <h3 className="text-lg font-bold mb-4">{t("edit_key")}</h3>
              {error && <div className="text-red-500 mb-4">{error}</div>}
              <div className="flex justify-center mb-4">
                <AvatarEditor
                  ref={editorRef}
                  image={tempImage}
                  width={256}
                  height={256}
                  border={0}
                  borderRadius={128}
                  scale={scale}
                  rotate={rotate}
                  disableBoundaryChecks={false}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="space-y-4">
                <div>
                  <label className="block text-gray-700">Scale</label>
                  <input
                    type="range"
                    min="1"
                    max="2"
                    step="0.01"
                    value={scale}
                    onChange={(e) => setScale(parseFloat(e.target.value))}
                    className="w-full"
                  />
                </div>
                <div>
                  <label className="block text-gray-700">Rotate</label>
                  <input
                    type="range"
                    min="0"
                    max="360"
                    step="1"
                    value={rotate}
                    onChange={(e) => setRotate(parseFloat(e.target.value))}
                    className="w-full"
                  />
                </div>
              </div>
              <div className="flex justify-end gap-4 mt-6">
                <Button variant="outlined" onClick={handleCancel}>
                  {t("cancel_key")}
                </Button>
                <Button onClick={handleConfirm}>{t("save_key")}</Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default AvatarUpload;
