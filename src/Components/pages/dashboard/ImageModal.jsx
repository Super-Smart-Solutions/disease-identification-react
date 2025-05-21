import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { fetchImageById } from "../../../api/imagesAPI";
import { FaCloudDownloadAlt } from "react-icons/fa";
import Modal from "../../Modal";
import Button from "../../Button";

const imageCache = new Map();

export default function ImageModal({ id, url = null, tableId }) {
  const { t } = useTranslation();
  const [imageData, setImageData] = useState(() =>
    id ? imageCache.get(id) : url ? { url, name: url } : null
  );
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const hasNoImage = !id && !url;

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
      if (!id) return;

      setIsLoading(true);
      try {
        if (imageCache.has(id)) {
          setImageData(imageCache.get(id));
          return;
        }

        const data = await fetchImageById(id);
        imageCache.set(id, data);
        setImageData(data);
      } catch (err) {
        console.error("Error fetching image:", err);
      } finally {
        setIsLoading(false);
      }
    };

    loadImage();
  }, [id]);

  useEffect(() => {
    if (url && !imageData) {
      setImageData({ url, name: url });
    }
  }, [url]);

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
    <div key={id || url} className="relative">
      <Button
        variant={id ? "outlined" : "filled"}
        onClick={() => setIsModalOpen(true)}
        disabled={hasNoImage || isLoading}
        loading={isLoading}
      >
        {t("show_key")}
      </Button>

      {isModalOpen && imageData && (
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
              className="flex justify-between items-center gap-2"
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
