import React, { useCallback, useRef, useState } from "react";
import html2canvas from "html2canvas-pro";
import jsPDF from "jspdf";
import { FaFilePdf, FaSpinner } from "react-icons/fa";
import { useQuery } from "@tanstack/react-query";
import { getImages } from "../../../api/imagesAPI";
import Button from "../../Button";

export default function ExportPdf({ plant_id, diseaseId, article, t }) {
  const pdfRef = useRef();
  const [isGenerating, setIsGenerating] = useState(false);
  const page = 1;
  const pageSize = 4;
  const formatKey = (str) => str?.replace(/\s+/g, "_").toLowerCase();

  const fetchImages = useCallback(
    () => getImages({ plant_id, diseaseId, size: pageSize, page }),
    [plant_id, diseaseId, pageSize, page]
  );

  const {
    data,
    isLoading: imagesLoading,
    error: imagesError,
  } = useQuery({
    queryKey: ["images", plant_id, diseaseId, page, pageSize],
    queryFn: fetchImages,
    staleTime: 1000 * 60 * 5,
  });
  const images = data?.items || [];

  const handleDownloadPDF = async () => {
    if (!pdfRef.current || isGenerating) return;

    setIsGenerating(true);

    try {
      // Preload all images first
      await Promise.all(
        images.map((img) => {
          return new Promise((resolve) => {
            const image = new Image();
            image.crossOrigin = "Anonymous";
            image.src = img.url + "&response-content-type=image/jpeg";
            image.onload = resolve;
            image.onerror = resolve;
          });
        })
      );

      const canvas = await html2canvas(pdfRef.current, {
        scale: 1,
        useCORS: true,
        allowTaint: true,
        logging: true,
        backgroundColor: "#ffffff",
        removeContainer: true,
        windowWidth: 800,
        async: true,
        onclone: (clonedDoc) => {
          const images = clonedDoc.querySelectorAll("img");
          images.forEach((img) => {
            img.style.width = "100%";
            img.style.height = "auto";
            img.style.maxHeight = "200px";
            img.style.objectFit = "contain";
          });
        },
      });

      const imgData = canvas.toDataURL("image/jpeg", 0.85);

      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4",
      });

      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();
      const margin = 10;
      const contentWidth = pageWidth - margin * 2;
      const contentHeight = (canvas.height * contentWidth) / canvas.width;

      pdf.addImage(
        imgData,
        "JPEG",
        margin,
        margin,
        contentWidth,
        contentHeight
      );

      pdf.save(`${article.english_name || "disease"}_report.pdf`);
    } catch (error) {
      console.error("Error generating PDF:", error);
    } finally {
      setIsGenerating(false);
    }
  };

  const formatTextWithLineBreaks = (text) => {
    if (!text) return t("no_data_available_key");

    return text.split("\n").map((line, i) => (
      <React.Fragment key={i}>
        {line}
        <br />
      </React.Fragment>
    ));
  };

  return (
    <div className="relative">
      {/* Download Button with Loading State */}
      <Button
        className="flex items-center gap-2"
        variant="outlined"
        onClick={handleDownloadPDF}
      >
        {t("download_key")} <FaFilePdf size={16} />
      </Button>

      {/* Loading indicator for images */}
      {imagesLoading && (
        <div className="absolute top-0 left-0 right-0 bottom-0 flex items-center justify-center bg-white bg-opacity-50">
          <FaSpinner className="animate-spin text-2xl text-primary" />
        </div>
      )}

      {/* Error message for images */}
      {imagesError && (
        <div className="text-red-500 text-sm mt-1">
          {t("failed_to_load_images_key")}
        </div>
      )}

      {/* Hidden PDF content with optimized styling */}
      <div ref={pdfRef} style={{ position: "absolute", left: "-9999px" }}>
        <div
          style={{
            padding: "20px",
            maxWidth: "800px",
            fontFamily: "Arial, sans-serif",
            lineHeight: 1.5,
          }}
        >
          {/* Header Section */}
          <div className="mb-6">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">
              {article?.english_name || t("no_disease_selected_key")}
            </h2>

            {article?.arabic_name && (
              <h3 className="text-xl font-bold text-gray-900">
                {t("arabic_name_key")}: {article?.arabic_name}
              </h3>
            )}

            {article?.scientific_name && (
              <h4 className="text-lg font-bold text-gray-900">
                {t("scientific_name_key")}: {article?.scientific_name}
              </h4>
            )}
          </div>

          {/* Content Sections */}
          <div className="space-y-4">
            <div>
              <h4 className="text-lg font-bold text-gray-800 mb-1">
                {t("Symptoms")}
              </h4>
              <p className="text-gray-700 text-base">
                {formatTextWithLineBreaks(
                  t(`${formatKey(article?.english_name)}_symptoms`) ||
                    article?.symptoms ||
                    t("no_symptoms_key")
                )}
              </p>
            </div>

            <div>
              <h4 className="text-lg font-bold text-gray-800 mb-1">
                {t("Description")}
              </h4>
              <p className="text-gray-700 text-base">
                {formatTextWithLineBreaks(
                  article?.description || t("no_description_key")
                )}
              </p>
            </div>

            <div>
              <h4 className="text-lg font-bold text-gray-800 mb-1">
                {t("Control Methods")}
              </h4>
              <p className="text-gray-700 text-base">
                {formatTextWithLineBreaks(
                  t(`${formatKey(article?.english_name)}_treatments`) ||
                    article?.treatments ||
                    t("no_treatment_key")
                )}
              </p>
            </div>
          </div>

          {/* Images Section with optimized layout */}
          {images.length > 0 && (
            <div className="mt-6">
              <h4 className="text-lg font-bold text-gray-800 mb-2">
                {t("Images")} ({images.length})
              </h4>
              <div className="grid grid-cols-4 gap-4">
                {images.map((image, index) => (
                  <div key={index} className="flex flex-col items-center">
                    <img
                      src={image.url}
                      alt={`${article.english_name} - ${index + 1}`}
                      className="w-full h-auto max-h-[200px] object-contain"
                      loading="lazy"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = "/farm.jpeg";
                      }}
                    />
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
