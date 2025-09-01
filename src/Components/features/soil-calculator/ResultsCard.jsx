import React, { useRef, useEffect } from "react";
import html2canvas from "html2canvas-pro";
import jsPDF from "jspdf";
import { useUploadReport } from "../../../hooks/useReports";
import { toast } from "sonner";

export const ResultsCard = ({ assessmentResult, t, user }) => {
  const resultsRef = useRef(null);
  const hasGenerated = useRef(false);

  const { mutate: submitUpload } = useUploadReport({
    onSuccess: () => {
      console.log("Upload finished in background");
    },
  });

  const results = assessmentResult.assessment.results;
  const recommendations = assessmentResult.assessment.recommendations;

  useEffect(() => {
    if (hasGenerated.current) return;
    hasGenerated.current = true;

    const generateAndUploadPDF = async () => {
      if (!resultsRef.current) return;

      try {
        const canvas = await html2canvas(resultsRef.current, {
          scale: 2,
          useCORS: true,
          backgroundColor: "#ffffff",
        });

        const imgData = canvas.toDataURL("image/jpeg", 0.6);
        const pdf = new jsPDF("p", "mm", "a4");

        const imgWidth = 210;
        const pageHeight = 297;
        const imgHeight = (canvas.height * imgWidth) / canvas.width;

        let heightLeft = imgHeight;
        let position = 0;

        pdf.addImage(imgData, "JPEG", 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;

        while (heightLeft > 0) {
          position = heightLeft - imgHeight;
          pdf.addPage();
          pdf.addImage(imgData, "JPEG", 0, position, imgWidth, imgHeight);
          heightLeft -= pageHeight;
        }

        const pdfBlob = pdf.output("blob");

        const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
        const file = new File(
          [pdfBlob],
          `soil_report_${user?.id || "guest"}_${timestamp}.pdf`,
          { type: "application/pdf" }
        );

        submitUpload({
          reportType: "soil",
          report_origin: "computed",
          file,
        });
      } catch (error) {
        toast.error("PDF generation/upload failed");
        console.error(error);
      }
    };

    generateAndUploadPDF();
  }, [submitUpload, user]);
  return (
    <div
      ref={resultsRef}
      className="cardIt h-full flex flex-col justify-between overflow-y-auto"
    >
      {/* content same as before */}
      <div className="space-y-2">
        {Object.entries(results).map(([key, value]) => (
          <div key={key} className="space-y-2 border-b border-slate-200 p-2">
            <div className="flex items-center justify-between">
              <div className="font-semibold capitalize">{t(`${key}_key`)}</div>
              <span
                className={`badge ${
                  value.status.toLowerCase() === "optimal"
                    ? "badge-success"
                    : "badge-error"
                }`}
              >
                {t(`status.${value.status.toLowerCase().replace(/\s+/g, "_")}`)}
              </span>
            </div>
            <div className="text-sm flex flex-col">
              <span>
                {t("your_value_key")}: {value.user_value}
              </span>
              <span>
                {t("optimal_value_key")}: {value.range[0]} – {value.range[1]}
              </span>
            </div>
          </div>
        ))}

        {recommendations?.length > 0 && (
          <div>
            <h4 className="font-semibold mb-2">{t("recommendations_key")}:</h4>
            <ul className="list-disc list-inside space-y-1">
              {recommendations.map((rec, index) => (
                <li key={index} className="text-sm">
                  {t(
                    rec
                      ?.toLowerCase()
                      .replace(/&/g, "and")
                      .replace(/[^\w\s]/g, "")
                      .replace(/\s+/g, "_")
                      .trim()
                  )}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};
