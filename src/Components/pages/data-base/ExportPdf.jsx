import React, { useCallback, useRef, useState, useEffect } from "react";
import html2canvas from "html2canvas-pro";
import jsPDF from "jspdf";
import { FaFilePdf, FaSpinner } from "react-icons/fa";
import { useQuery } from "@tanstack/react-query";
import { getImages } from "../../../api/imagesAPI";
import Button from "../../Button";

// Helper functions
const formatKey = (str) => str?.replace(/\s+/g, "_").toLowerCase();

const formatTextWithLineBreaks = (text, t) => {
  if (!text) return t("no_data_available_key");
  return text.split("\n").map((line, i) => (
    <React.Fragment key={i}>
      {line}
      <br />
    </React.Fragment>
  ));
};

// Image processing component
const ImageProcessor = ({ images, onProcessed }) => {
  useEffect(() => {
    const processImages = async () => {
      if (!images?.items) return;

      const processed = await Promise.all(
        images.items.map(async (img) => {
          try {
            const url = await fetchImageWithFallback(img.url);
            return { ...img, processedUrl: url };
          } catch (error) {
            console.error("Error processing image:", error);
            return { ...img, processedUrl: "/farm.jpeg" };
          }
        })
      );
      onProcessed(processed);
    };

    processImages();
  }, [images, onProcessed]);

  const fetchImageWithFallback = async (url) => {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 7000);

    try {
      const response = await fetch(url, {
        signal: controller.signal,
        mode: "cors",
        headers: { "Access-Control-Allow-Origin": "*" },
      });

      clearTimeout(timeout);

      if (!response.ok)
        throw new Error(`HTTP error! status: ${response.status}`);
      const blob = await response.blob();

      if (!["image/jpeg", "image/png"].includes(blob.type)) {
        throw new Error("Unsupported image type");
      }

      return URL.createObjectURL(blob);
    } catch (error) {
      console.warn("Falling back to local image for:", url);
      clearTimeout(timeout);
      return "/farm.jpeg";
    }
  };

  return null;
};

// PDF Content component
const PdfContent = React.forwardRef(({ article, processedImages, t }, ref) => (
  <div ref={ref} style={{ position: "absolute", left: "-9999px" }}>
    <div
      style={{
        padding: "20px",
        maxWidth: "800px",
        backgroundColor: "#fff",
        fontFamily: "Arial, sans-serif",
      }}
    >
      <h2 className="text-3xl font-bold mb-2">
        {article?.english_name || t("no_disease_selected_key")}
      </h2>
      {article?.arabic_name && (
        <h3>
          {t("arabic_name_key")}: {article?.arabic_name}
        </h3>
      )}
      {article?.scientific_name && (
        <h4>
          {t("scientific_name_key")}: {article?.scientific_name}
        </h4>
      )}

      <div className="mt-4">
        <h4>{t("Symptoms")}</h4>
        <p>
          {formatTextWithLineBreaks(article?.symptoms || t("no_symptoms_key"))}
        </p>
      </div>

      <div className="mt-4">
        <h4>{t("Description")}</h4>
        <p>
          {formatTextWithLineBreaks(
            article?.description || t("no_description_key")
          )}
        </p>
      </div>

      <div className="mt-4">
        <h4>{t("Control Methods")}</h4>
        <p>
          {formatTextWithLineBreaks(
            article?.treatments || t("no_treatment_key")
          )}
        </p>
      </div>

      {processedImages.length > 0 && (
        <div className="mt-6 grid grid-cols-4 gap-4">
          {processedImages.map((image, index) => (
            <img
              key={index}
              src={image.processedUrl}
              alt={`${article.english_name} - ${index + 1}`}
              className="w-full h-auto max-h-[200px] object-contain border rounded"
              loading="eager"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = "/farm.jpeg";
              }}
            />
          ))}
        </div>
      )}
    </div>
  </div>
));

// Status indicators
const LoadingIndicator = () => (
  <div className="absolute top-0 left-0 right-0 bottom-0 flex items-center justify-center bg-white bg-opacity-50">
    <FaSpinner className="animate-spin text-2xl text-primary" />
  </div>
);

const ErrorIndicator = ({ t }) => (
  <div className="text-red-500 text-sm mt-1">
    {t("failed_to_load_images_key")}
  </div>
);

// Main component
export default function ExportPdf({ plant_id, diseaseId, article, t }) {
  const pdfRef = useRef();
  const [isGenerating, setIsGenerating] = useState(false);
  const [processedImages, setProcessedImages] = useState([]);
  const page = 1;
  const pageSize = 4;

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

  const handleDownloadPDF = async () => {
    if (!pdfRef.current || isGenerating) return;
    setIsGenerating(true);

    try {
      // Clone and replace image sources
      const pdfContent = pdfRef.current.cloneNode(true);

      processedImages.forEach((img, index) => {
        const imgEl = pdfContent.querySelectorAll("img")[index];
        if (imgEl) {
          imgEl.src = img.processedUrl;
        }
      });

      // Temporarily insert content into DOM
      const originalParent = pdfRef.current.parentNode;
      const originalNextSibling = pdfRef.current.nextSibling;
      pdfRef.current.remove();
      originalParent.insertBefore(pdfContent, originalNextSibling);

      const canvas = await html2canvas(pdfContent, {
        useCORS: true,
        allowTaint: false,
        logging: false,
      });

      // Restore DOM
      pdfContent.remove();
      originalParent.insertBefore(pdfRef.current, originalNextSibling);

      const imgData = canvas.toDataURL("image/jpeg", 0.9);
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

  return (
    <div className="relative">
      <Button
        className="flex items-center gap-2 text-nowrap"
        variant="outlined"
        onClick={handleDownloadPDF}
        loading={isGenerating}
      >
        {t("download_key")} <FaFilePdf size={16} />
      </Button>

      {imagesLoading && <LoadingIndicator />}
      {imagesError && <ErrorIndicator t={t} />}

      <ImageProcessor images={data} onProcessed={setProcessedImages} />
      <PdfContent
        ref={pdfRef}
        article={article}
        processedImages={processedImages}
        t={t}
      />
    </div>
  );
}
