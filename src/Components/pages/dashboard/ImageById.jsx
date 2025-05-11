import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { fetchImageById } from "../../../api/imagesAPI";
import { FaCloudDownloadAlt } from "react-icons/fa";
import Modal from "../../Modal";
import Button from "../../Button";

export default function ImageById({ id, tableId }) {
  const { t } = useTranslation();
  const [imageData, setImageData] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    let root = document.getElementById(`modal-root-${tableId}`);
    if (!root) {
      root = document.createElement("div");
      root.id = `modal-root-${tableId}`;
      document.body.appendChild(root);
    }

    return () => {
      if (root && document.body.contains(root)) {
        document.body.removeChild(root);
      }
    };
  }, [tableId]);

  useEffect(() => {
    const loadImage = async () => {
      try {
        const data = await fetchImageById(id);
        setImageData(data);
      } catch (err) {
      } finally {
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

  return (
    <div key={id} className="relative">
      {/* Thumbnail Image */}
      <Button variant="outlined" onClick={() => setIsModalOpen(true)}>
        {t("show_key")}
      </Button>

      {/* Modal for full-size image - rendered via portal */}
      {isModalOpen && (
        <Modal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          title={getDisplayName(imageData.name)}
        >
          <div className="relative flex flex-col justify-center items-center gap-4">
            <img
              src={imageData.url}
              alt={getDisplayName(imageData.name)}
              className="max-w-full max-h-[60vh] object-contain mx-auto"
            />
            <Button
              className={` flex justify-between items-center gap-2`}
              onClick={handleDownload}
            >
              <FaCloudDownloadAlt />
              {t("download_key")}
            </Button>
          </div>
        </Modal>
      )}
    </div>
  );
}
