import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { fetchImageById } from "../../../api/imagesAPI";
import { IoClose } from "react-icons/io5";
import { FaCloudDownloadAlt } from "react-icons/fa";

export default function ImageById({ id }) {
  const { t } = useTranslation();
  const [imageData, setImageData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showOverlay, setShowOverlay] = useState(false);

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
    // Split by slashes and take the last part
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
        onClick={() => setShowOverlay(true)}
      >
        <p className="mt-1 text-sm text-gray-600 truncate max-w-60">
          {getDisplayName(imageData.name)}
        </p>
      </div>

      {/* Overlay */}
      {showOverlay && (
        <div className="overlay" onClick={() => setShowOverlay(false)}>
          <div
            className="relative max-w-[90vw] max-h-[90vh]"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={imageData.url}
              alt={getDisplayName(imageData.name)}
              className="max-w-[80vw] max-h-[80vh] object-contain mx-auto"
            />
            <p className="text-white font-medium text-center">
              {getDisplayName(imageData.name)}
            </p>
            <button
              onClick={() => setShowOverlay(false)}
              className="absolute top-2 right-2 bg-gray-200 hover:bg-gray-300 rounded-full p-2 transition-colors"
            >
              <IoClose />
            </button>
            <button
              onClick={handleDownload}
              className="absolute top-2 left-2 bg-gray-200 hover:bg-gray-300 rounded-full p-2 transition-colors"
            >
              <FaCloudDownloadAlt />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
