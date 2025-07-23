import React from "react";
import { useTranslation } from "react-i18next";
import html2canvas from "html2canvas-pro";
import jsPDF from "jspdf";
import { useQuery } from "@tanstack/react-query";
import Button from "../../Button";
import { FaFilePdf } from "react-icons/fa6";
import { fetchCropById } from "../../../api/soilApi";

export const SummaryStep = ({ assessmentResult }) => {
  const { t } = useTranslation();
  const summaryRef = React.useRef();
  const formatKey = (str) =>
    str
      ?.toLowerCase()
      .replace(/&/g, "and")
      .replace(/[^\w\s]/g, "")
      .replace(/\s+/g, "_")
      .trim();
  // Fetch crop data using TanStack Query
  const { data: cropData, isLoading: isCropLoading } = useQuery({
    queryKey: ["crop", assessmentResult?.crop_id],
    queryFn: () => fetchCropById(assessmentResult?.crop_id),
    enabled: !!assessmentResult?.crop_id,
  });

  const handleDownloadPDF = async () => {
    const summaryEl = summaryRef.current;

    // Store original style
    const originalColor = summaryEl.style.color;

    // Override color to a safe one
    summaryEl.style.color = "#000";

    const canvas = await html2canvas(summaryEl, {
      scale: 2,
      useCORS: true,
    });

    // Restore original style
    summaryEl.style.color = originalColor;

    const imgData = canvas.toDataURL("image/png");
    const pdf = new jsPDF("p", "mm", "a4");
    const imgProps = pdf.getImageProperties(imgData);
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

    pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
    pdf.save(`${cropData?.name.split(",")[0]}-ecology.pdf`);
  };

  if (!assessmentResult) return null;

  const descriptionRows = [
    {
      label: t("life_form_key"),
      value: t(`${formatKey(cropData?.life_form)}`) || t("no_description_key"),
    },
    {
      label: t("physiology_key"),
      value:
        t(`${formatKey(cropData?.physical_description)}`) ||
        t("no_description_key"),
    },
    {
      label: t("habit_key"),
      value: t(`${formatKey(cropData?.habitat)}`) || t("no_description_key"),
    },
    {
      label: t("category_key"),
      value: t(`${formatKey(cropData?.category)}`) || t("no_description_key"),
    },
    {
      label: t("life_span_key"),
      value: t(`${formatKey(cropData?.life_span)}`) || t("no_description_key"),
    },
    {
      label: t("plant_attributes_key"),
      value: t(`${formatKey(cropData?.plant_type)}`) || t("no_description_key"),
    },
  ];
  const ecologyRows = [
    {
      label: t("temperature_key"),
      value: assessmentResult?.temperature,
      optimalMin: cropData?.temp_opt_min,
      optimalMax: cropData?.temp_opt_max,
      rightLabel: t("soil_depth_key"),
      rightOptimal: cropData?.soil_depth,
      rightAbsolute: cropData?.soil_depth_req,
    },
    {
      label: t("salinity_key"),
      value: assessmentResult?.salinity,
      optimalMin: cropData?.salinity,
      optimalMax: "",
      rightLabel: t("soil_texture_key"),
      rightOptimal: cropData?.soil_texture,
      rightAbsolute: cropData?.soil_texture_req,
    },
    {
      label: t("soil_ph_key"),
      value: assessmentResult?.ph,
      optimalMin: cropData?.ph_opt_min,
      optimalMax: cropData?.ph_opt_max,
      rightLabel: t("soil_salinity_key"),
      rightOptimal: cropData?.salinity,
      rightAbsolute: cropData?.salinity_req,
    },
    {
      label: t("light_intensity_key"),
      optimalMin: cropData?.light_opt_min,
      optimalMax: cropData?.light_opt_max,
      rightLabel: t("soil_drainage_key"),
      rightOptimal: cropData?.drainage,
      rightAbsolute: cropData?.drainage_req,
    },
  ];
  return (
    <div className="space-y-3 h-[60vh] overflow-y-auto">
      <Button
        className="flex items-center gap-2"
        variant="outlined"
        onClick={handleDownloadPDF}
      >
        {t("download_key")} <FaFilePdf size={16} />
      </Button>

      <div
        ref={summaryRef}
        className="bg-white rounded-md shadow-md text-sm p-4"
        style={{
          fontFamily: "Arial, sans-serif",
          color: "#333",
        }}
      >
        <table
          className="w-full mb-6"
          style={{
            borderCollapse: "collapse",
            width: "100%",
            tableLayout: "fixed",
            color: "green",
          }}
        >
          <thead>
            <tr
              className="font-bold "
              style={{ backgroundColor: "#ccc", fontWeight: "bold" }}
            >
              <th style={cellStyle} colSpan={4} className="text-left p-2">
                {t("description_key")}
              </th>
            </tr>
          </thead>
          <tbody>
            {descriptionRows.map((row, index) => (
              <tr key={index}>
                <td
                  colSpan={1}
                  style={cellStyle}
                  className="font-bold p-2 bg-gray-200"
                >
                  {row.label}
                </td>
                <td colSpan={3} style={cellStyle} className="p-2">
                  {row.value || "-"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <table
          className="w-full mb-6"
          style={{
            borderCollapse: "collapse",
            width: "100%",
            tableLayout: "fixed",
            color: "green",
          }}
        >
          <thead>
            {/* Main Header Row */}
            <tr style={{ backgroundColor: "#ccc", fontWeight: "bold" }}>
              <th style={cellStyle} colSpan="6" className="text-left p-2">
                {t("ecology_key")}
              </th>
            </tr>

            {/* Sub-header Row */}
            <tr className=" bg-gray-200 font-bold">
              {/* First Table Section */}
              <th style={cellStyle} className="w-1/6"></th> {/* Empty */}
              <th style={cellStyle} className="w-1/6">
                {t("optimal_value_key")}
              </th>
              <th style={cellStyle} className="w-1/6">
                {t("your_value_key")}
              </th>
              {/* Second Table Section */}
              <th style={cellStyle} className="w-1/6"></th> {/* Empty */}
              <th colSpan={2} style={cellStyle} className="w-1/6">
                {t("optimal_value_key")}
              </th>
            </tr>
            <tr style={{ backgroundColor: "white", fontWeight: "bold" }}>
              {/* First Table Section */}
              <th style={cellStyle} className="w-1/6"></th> {/* Empty */}
              <th style={cellStyle} className="w-1/6">
                <div className="flex justify-between w-full text-xs">
                  <span>{t("min_key")}</span>
                  <span>{t("max_key")}</span>
                </div>
              </th>
              <th style={cellStyle} className="w-1/6"></th> {/* Empty */}
              {/* Second Table Section */}
              <th style={cellStyle} className="w-1/6"></th> {/* Empty */}
              <th colSpan={2} style={cellStyle} className="w-1/6"></th>{" "}
              {/* Empty */}
            </tr>
          </thead>
          <tbody>
            {ecologyRows.map((row, index) => (
              <tr key={index}>
                {/* Left side - Ecology parameters */}
                <td style={cellStyle} className="font-bold p-2 bg-gray-200">
                  {row.label}
                </td>
                <td style={cellStyle}>
                  {row.optimalMin !== null && row.optimalMax !== null
                    ? `${row.optimalMin} - ${row.optimalMax}`
                    : "-"}
                </td>
                <td style={cellStyle}>{row.value || "---"}</td>

                {/* Right side - Soil parameters */}
                <td style={cellStyle} className="font-bold p-2 bg-gray-200">
                  {row.rightLabel}
                </td>
                <td colSpan={2} style={cellStyle}>
                  {row.rightOptimal || "-"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const cellStyle = {
  border: "1px solid #999",
  padding: "8px",
  textAlign: "left",
  wordBreak: "break-word",
};
