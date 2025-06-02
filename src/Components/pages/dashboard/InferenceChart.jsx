import React from "react";
import ReactApexChart from "react-apexcharts";
import { useTranslation } from "react-i18next";
import DateRangePicker from "../../DateRangePicker";

const InferenceChart = ({
  historyData,
  startDate,
  endDate,
  handleDateChange,
  t,
  isLoading,
}) => {
  const historyChartData = {
    series: [
      {
        name: t("total_inferences_key"),
        data: historyData.map((item) => item.count),
      },
      {
        name: t("successful_inferences_key"),
        data: historyData.map((item) => item.successful),
      },
      {
        name: t("failed_inferences_key"),
        data: historyData.map((item) => item.failed),
      },
    ],
    options: {
      chart: {
        height: 350,
        type: "line",
        toolbar: {
          tools: {
            download: true,
            selection: true,
            zoom: true,
            zoomin: true,
            zoomout: true,
            pan: true,
            reset: true,
          },
        },
      },
      stroke: {
        curve: "smooth",
        width: 3,
      },
      colors: ["#416a00", "#10B981", "#EF4444"],
      xaxis: {
        categories: historyData.map((item) => item.date),
        labels: {
          style: {
            colors: "#6B7280",
            fontSize: "12px",
          },
        },
        type: "datetime",
      },
      yaxis: {
        title: {
          text: t("inferences_key"),
          style: {
            color: "#6B7280",
            fontSize: "12px",
          },
        },
        min: 0,
        labels: {
          style: {
            colors: "#6B7280",
            fontSize: "12px",
          },
        },
      },
      tooltip: {
        x: {
          format: "dd MMM yyyy",
        },
        theme: "light",
        custom: function ({ series, seriesIndex, dataPointIndex, w }) {
          const data = historyData[dataPointIndex];
          return (
            '<div class="p-2 bg-white shadow-lg rounded">' +
            `<div class="font-bold">${data.date}</div>` +
            `<div>${t("total_key")}: ${data.count}</div>` +
            `<div>${t("successful_key")}: ${data.successful}</div>` +
            `<div>${t("failed_key")}: ${data.failed}</div>` +
            `<div>${t("unique_diseases_key")}: ${data.unique_diseases}</div>` +
            `<div>${t("avg_confidence_key")}: ${(
              data.average_confidence * 100
            ).toFixed(2)}%</div>` +
            "</div>"
          );
        },
      },
      markers: {
        size: 5,
      },
      legend: {
        position: "top",
        horizontalAlign: "right",
      },
    },
  };

  return (
    <div
      className={`"bg-white rounded-lg shadow p-4 ${
        isLoading ? " animate-pulse select-none pointer-events-none" : ""
      }`}
    >
      <div className="flex items-center start gap-10 mb-4">
        <h2 className="text-xl font-semibold">{t("inference_history_key")}</h2>
        <DateRangePicker
          startDate={startDate}
          endDate={endDate}
          onDateChange={handleDateChange}
          t={t}
        />
      </div>

      <ReactApexChart
        options={historyChartData.options}
        series={historyChartData.series}
        type="line"
        height={350}
      />
    </div>
  );
};

export default InferenceChart;
