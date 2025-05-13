import React, { useCallback, useRef, useState, useEffect } from "react";
import html2canvas from "html2canvas-pro";
import jsPDF from "jspdf";
import { FaFilePdf, FaSpinner } from "react-icons/fa";
import { useQuery } from "@tanstack/react-query";
import { getImages } from "../../../api/imagesAPI";
import Button from "../../Button";

export default function ExportPdf({ plant_id, diseaseId, article, t }) {
  const pdfRef = useRef();
  const [isGenerating, setIsGenerating] = useState(false);
  const [processedImages, setProcessedImages] = useState([]);
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

  // Process images to handle CORS issues
  useEffect(() => {
    const processImages = async () => {
      if (!data?.items) return;

      const processed = await Promise.all(
        data.items.map(async (img) => {
          try {
            // Try to load the image first
            const loaded = await loadImageWithFallback(img.url);
            return { ...img, processedUrl: loaded.src };
          } catch (error) {
            console.error("Error processing image:", error);
            return { ...img, processedUrl: "/farm.jpeg" };
          }
        })
      );
      setProcessedImages(processed);
    };

    processImages();
  }, [data]);

  const loadImageWithFallback = (url) => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.crossOrigin = "Anonymous";
      img.src = url;

      const timeout = setTimeout(() => {
        img.onerror = null; // Clear handlers
        console.log(`Timeout loading image: ${url}`);
        loadFallback();
      }, 5000); // 5 second timeout

      img.onload = () => {
        clearTimeout(timeout);
        resolve(img);
      };

      img.onerror = (error) => {
        clearTimeout(timeout);
        console.log("Image error:", error);
        loadFallback();
      };

      function loadFallback() {
        const fallback = new Image();
        fallback.src = "/farm.jpeg";
        fallback.onload = () => resolve(fallback);
        fallback.onerror = () =>
          reject(new Error("Could not load fallback image"));
      }
    });
  };

  const handleDownloadPDF = async () => {
    if (!pdfRef.current || isGenerating) return;

    setIsGenerating(true);

    try {
      // Create a clone of the PDF content to manipulate
      const pdfContent = pdfRef.current.cloneNode(true);

      // Replace all image sources with processed URLs
      await Promise.all(
        processedImages.map(async (img) => {
          try {
            await loadImageWithFallback(img.url);
          } catch (error) {
            console.log(`Failed to pre-load image: ${img.url}`, error);
          }
        })
      );

      // Temporarily replace the original content
      const originalParent = pdfRef.current.parentNode;
      const originalNextSibling = pdfRef.current.nextSibling;
      pdfRef.current.remove();
      originalParent.insertBefore(pdfContent, originalNextSibling);

      // Generate PDF
      const canvas = await html2canvas(pdfContent, {
        useCORS: true,
        allowTaint: true,
        credentials: "include",
      });
      // Restore original content
      pdfContent.remove();
      originalParent.insertBefore(pdfRef.current, originalNextSibling);

      // Create PDF
      const imgData = canvas.toDataURL("image/jpeg", 0.85);
      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4",
      });

      const pageWidth = pdf.internal.pageSize.getWidth();
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
        loading={isGenerating}
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
            backgroundColor: "#ffffff",
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

          {/* Images Section */}
          {processedImages.length > 0 && (
            <div className="mt-6">
              <div className="grid grid-cols-4 gap-4">
                {processedImages.map((image, index) => (
                  <img
                    key={index}
                    src={image.processedUrl || image.url}
                    alt={`${article.english_name} - ${index + 1}`}
                    className="w-full h-auto max-h-[200px] object-contain border rounded"
                    loading="eager"
                    crossOrigin="anonymous"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = "/farm.jpeg";
                    }}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
