import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { fetchImageById } from "../../../api/imagesAPI";
import { FaCloudDownloadAlt } from "react-icons/fa";
import { createPortal } from "react-dom";
import Modal from "../../Modal";
import Button from "../../Button";

export default function ImageById({ id, tableId }) {
  const { t } = useTranslation();
  const [imageData, setImageData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalRoot, setModalRoot] = useState(null);

  useEffect(() => {
    // Create a portal root for the modal if it doesn't exist
    let root = document.getElementById(`modal-root-${tableId}`);
    if (!root) {
      root = document.createElement("div");
      root.id = `modal-root-${tableId}`;
      document.body.appendChild(root);
    }
    setModalRoot(root);

    return () => {
      // Clean up the portal root when component unmounts
      if (root && document.body.contains(root)) {
        document.body.removeChild(root);
      }
    };
  }, [tableId]);

  useEffect(() => {
    const loadImage = async () => {
      try {
        setLoading(true);
        const data = await fetchImageById(id);
        setImageData(data);
      } catch (err) {
        setError(err.message || t("failed_to_load_image_key"));
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      loadImage();
    }
  }, [id, t]);

  const getDisplayName = (fullPath) => {
    if (!fullPath) return "---";
    const filename = fullPath.split("/").pop();
    return filename;
  };

  const handleDownload = () => {
    if (!imageData?.url) return;

    const link = document.createElement("a");
    link.href = imageData.url;
    link.download = getDisplayName(imageData.name) || "download.jpg";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (loading) {
    return (
      <div key={id} className="p-4 text-gray-500">
        {t("loading_key")}
      </div>
    );
  }

  if (error) {
    return (
      <div key={id} className="p-4 text-red-500">
        {error}
      </div>
    );
  }

  if (!imageData) {
    return (
      <div key={id} className="p-4 text-gray-500">
        {t("no_image_data_key")}
      </div>
    );
  }

  return (
    <div key={id} className="relative">
      {/* Thumbnail Image */}
      <div
        className="group cursor-pointer"
        onClick={() => setIsModalOpen(true)}
      >
        <p className="mt-1 text-sm text-gray-600 truncate max-w-60">
          {getDisplayName(imageData.name)}
        </p>
      </div>

      {/* Modal for full-size image - rendered via portal */}
      {modalRoot &&
        isModalOpen &&
        createPortal(
          <Modal
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            title={getDisplayName(imageData.name)}
            container={modalRoot}
          >
            <div className="relative flex flex-col justify-center items-center gap-4">
              <img
                src={imageData.url}
                alt={getDisplayName(imageData.name)}
                className="max-w-[60vw] max-h-[60vh] object-contain mx-auto"
              />
              <Button
                className={` flex justify-between items-center gap-2`}
                onClick={handleDownload}
              >
                <FaCloudDownloadAlt />
                {t("download_key")}
              </Button>
            </div>
          </Modal>,
          modalRoot
        )}
    </div>
  );
}
