import React, { useRef, useState, useEffect } from "react";
import html2canvas from "html2canvas-pro";
import jsPDF from "jspdf";
import { FaFilePdf, FaSpinner } from "react-icons/fa";
import Button from "../../Button";
import { useImages } from "../../../hooks/useImages";

const formatTextWithLineBreaks = (text, t) => {
  if (!text) return t("no_data_available_key");
  return text.split("\n").map((line, i) => (
    <React.Fragment key={i}>
      {line}
      <br />
    </React.Fragment>
  ));
};

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

const PdfContent = React.forwardRef(({ article, processedImages, t }, ref) => (
  <div
    style={{
      position: "absolute",
      width: "0",
      height: "0",
      overflow: "hidden",
      opacity: 0,
      pointerEvents: "none",
      zIndex: -1,
    }}
  >
    {/* This is the actual content block for the PDF.
        The ref is moved here. This div has the correct dimensions. */}
    <div
      ref={ref}
      style={{
        width: "800px",
        padding: "20px",
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
          {formatTextWithLineBreaks(
            article?.symptoms || t("no_symptoms_key"),
            t
          )}
        </p>
      </div>

      <div className="mt-4">
        <h4 className=" text-2xl">{t("description_key")}</h4>
        <p>
          {formatTextWithLineBreaks(
            article?.description || t("no_description_key"),
            t
          )}
        </p>
      </div>

      <div className="mt-4">
        <h4 className=" text-2xl">{t("control_methods_key")}</h4>
        <p>
          {formatTextWithLineBreaks(
            article?.treatments || t("no_treatment_key"),
            t
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

export default function ExportPdf({ plant_id, diseaseId, article, t }) {
  const pdfRef = useRef();
  const [isGenerating, setIsGenerating] = useState(false);
  const [processedImages, setProcessedImages] = useState([]);
  const page = 1;
  const pageSize = 8;

  const { data, isLoading, error } = useImages({
    plant_id,
    diseaseId,
    page,
    pageSize,
  });
  const handleDownloadPDF = async () => {
    if (!pdfRef.current || isGenerating) return;
    setIsGenerating(true);

    try {
      const hiddenContainer = document.createElement("div");
      hiddenContainer.style.position = "fixed";
      hiddenContainer.style.left = "-10000px";
      hiddenContainer.style.top = "0";
      hiddenContainer.style.opacity = "0";

      document.body.appendChild(hiddenContainer);

      const pdfContentToRender = pdfRef.current.cloneNode(true);

      hiddenContainer.appendChild(pdfContentToRender);

      processedImages.forEach((img, index) => {
        const imgEls = pdfContentToRender.querySelectorAll("img");
        if (imgEls[index]) {
          imgEls[index].src = img.processedUrl;
        }
      });

      await new Promise((resolve) => {
        const images = pdfContentToRender.getElementsByTagName("img");
        let loadedCount = 0;

        if (images.length === 0) resolve();

        const onLoad = () => {
          loadedCount++;
          if (loadedCount === images.length) resolve();
        };

        for (let img of images) {
          if (img.complete) {
            loadedCount++;
          } else {
            img.addEventListener("load", onLoad);
            img.addEventListener("error", onLoad);
          }
        }

        if (loadedCount === images.length) resolve();
      });

      const canvas = await html2canvas(pdfContentToRender, {
        useCORS: true,
        allowTaint: false,
        logging: true,
        scale: 2,
        windowWidth: pdfContentToRender.scrollWidth,
        windowHeight: pdfContentToRender.scrollHeight,
      });

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
      const hiddenContainer = document.querySelector('div[style*="-10000px"]');
      if (hiddenContainer && hiddenContainer.parentNode === document.body) {
        document.body.removeChild(hiddenContainer);
      }
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

      {isLoading && <LoadingIndicator />}
      {error && <ErrorIndicator t={t} />}

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
