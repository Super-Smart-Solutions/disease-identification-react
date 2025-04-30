import React from "react";
import { useTranslation } from "react-i18next";
import { useReactToPrint } from "react-to-print";
import Button from "../../Button";
import { FaFilePdf } from "react-icons/fa6";

export const SummaryStep = ({ assessmentResult }) => {
  const { t } = useTranslation();
  const summaryRef = React.useRef();
  const handleDownloadPDF = useReactToPrint({
    documentTitle: "Title",
    content: () => summaryRef.current,
    pageStyle: `
      @page {
        size: A4;
        margin: 10mm;
      }
      @media print {
        body {
          padding: 20px;
        }
        table {
          width: 100%;
          border-collapse: collapse;
        }
        th, td {
          border: 1px solid #ddd;
          padding: 8px;
          text-align: left;
        }
        th {
          background-color: #f2f2f2;
        }
        .print-header {
          display: flex;
          justify-content: space-between;
          margin-bottom: 20px;
        }
      }
    `,
  });

  if (!assessmentResult) return null;

  return (
    <div className="space-y-3 h-[60vh] overflow-y-auto">
      <div className="print-header flex justify-between items-center">
        <h2 className="text-xl font-bold">{t("summary_key")}</h2>
        <div className="flex justify-end">
          <Button
            className={`flex justify-between gap-2 items-center`}
            variant="outlined"
            onClick={handleDownloadPDF}
          >
            {t("download_key")}

            <FaFilePdf size={18} />
          </Button>
        </div>
      </div>

      <div ref={summaryRef} className="p-4 bg-white rounded-lg">
        <table className="w-full border-collapse mb-6">
          <thead>
            <tr className="bg-gray-100">
              <th className="p-1 border ">{t("inputs_key")}</th>
              <th className="p-1 border ">{t("your_value_key")}</th>
              <th className="p-1 border ">{t("optimal_value_key")}</th>
              <th className="p-1 border ">{t("status_key")}</th>
            </tr>
          </thead>
          <tbody>
            {Object.entries(assessmentResult?.assessment.results).map(
              ([param, data]) => (
                <tr key={param} className="border-b">
                  <td className="p-3 border capitalize">{t(`${param}_key`)}</td>
                  <td className="p-3 border">{data.user_value}</td>
                  <td className="p-3 border">{data.range.join(" - ")}</td>
                  <td className="p-3 border">
                    <span
                      className={`badge text-nowrap ${
                        data.status.toLowerCase() === "optimal"
                          ? "badge-success"
                          : "badge-error"
                      }`}
                    >
                      {t(
                        `status.${data.status
                          .toLowerCase()
                          .replace(/\s+/g, "_")}`
                      )}
                    </span>
                  </td>
                </tr>
              )
            )}
          </tbody>
        </table>

        {assessmentResult?.assessment.recommendations?.length > 0 && (
          <div className="mt-6">
            <h3 className="text-lg font-semibold mb-2">
              {t("recommendations_key")}:
            </h3>
            <ul className="list-disc pl-5 space-y-1">
              {assessmentResult?.assessment.recommendations.map(
                (rec, index) => (
                  <li key={index}>{rec}</li>
                )
              )}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};
