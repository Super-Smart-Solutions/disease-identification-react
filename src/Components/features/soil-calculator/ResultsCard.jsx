import React from "react";

// Your formatKey utility
const formatKey = (str) =>
  str
    ?.toLowerCase()
    .replace(/&/g, "and") // replace ampersands with 'and'
    .replace(/[^\w\s]/g, "") // remove all non-word/non-space characters
    .replace(/\s+/g, "_") // replace spaces with underscores
    .trim();

export const ResultsCard = ({ assessmentResult, t }) => {
  const results = assessmentResult.assessment.results;
  const recommendations = assessmentResult.assessment.recommendations;

  return (
    <div className="cardIt h-full flex flex-col justify-between overflow-y-auto">
      <div className="space-y-2">
        {/* Render all soil assessment results */}
        {Object.entries(results).map(([key, value]) => (
          <div key={key} className="space-y-2 border-b border-slate-200 p-2">
            <div className="flex items-center justify-between">
              {/* Localized label for each parameter */}
              <div className="font-semibold capitalize">{t(`${key}_key`)}</div>

              {/* Status badge, dynamically styled */}
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

            {/* Display user and optimal value range */}
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

        {/* Render recommendation list if present */}
        {recommendations?.length > 0 && (
          <div>
            <h4 className="font-semibold mb-2">{t("recommendations_key")}:</h4>
            <ul className="list-disc list-inside space-y-1">
              {recommendations.map((rec, index) => (
                <li key={index} className="text-sm">
                  {/* Format and translate each recommendation */}
                  {t(formatKey(rec))}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};
