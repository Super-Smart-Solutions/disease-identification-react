import React, { useMemo } from "react";
import ReactApexChart from "react-apexcharts";
import { getStatusTranslation } from "../../../utils/statusTranslations";
import { useInferences } from "../../../hooks/useInferences";
import { useTranslation } from "react-i18next";

const InferenceStats = () => {
  const { t } = useTranslation();
  const { data, isLoading, isError, error } = useInferences();

  // Process data to get counts grouped by date
  const getInferenceHistory = useMemo(() => {
    if (!data?.items) return [];

    // Group inferences by date
    const dateCounts = data.items.reduce((acc, item) => {
      const date = new Date(item.created_at).toISOString().split("T")[0];
      acc[date] = (acc[date] || 0) + 1;
      return acc;
    }, {});

    // Convert to array and sort by date
    return Object.entries(dateCounts)
      .map(([date, count]) => ({ date, count }))
      .sort((a, b) => new Date(a.date) - new Date(b.date));
  }, [data]);

  // Process data to get counts for each status (for the cards)
  const statusCounts = useMemo(() => {
    const counts = {
      0: { count: 0, text: getStatusTranslation(0, t) }, // Created
      1: { count: 0, text: getStatusTranslation(1, t) }, // Image Valid
      [-1]: { count: 0, text: getStatusTranslation(-1, t) }, // Image Invalid
      4: { count: 0, text: getStatusTranslation(4, t) }, // Attention Analysis Completed
    };

    data?.items?.forEach((item) => {
      if (item.status in counts) {
        counts[item.status].count++;
      }
    });

    return counts;
  }, [data, t]);

  // Prepare data for the history chart
  const historyChartData = {
    series: [
      {
        name: t("inferences_key") || "Inferences",
        data: getInferenceHistory.map((item) => item.count),
      },
    ],
    options: {
      chart: {
        height: 350,
        type: "line",
        zoom: { enabled: false },
        toolbar: { show: true },
      },
      stroke: {
        curve: "smooth",
        width: 2,
      },
      colors: ["#3B82F6"],
      title: {
        text: t("inference_history_key") || "Inference History",
        align: "left",
        style: {
          fontSize: "16px",
          fontWeight: "bold",
          color: "#374151",
        },
      },
      xaxis: {
        categories: getInferenceHistory.map((item) => item.date),
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
          text: t("count_key") || "Count",
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
      },
      markers: {
        size: 5,
      },
    },
  };

  // Stat cards data - using your specified changes (+1, -1, +2, -2)
  const stats = [
    { status: 1, change: 1 }, // +1
    { status: -1, change: -1 }, // -1
    { status: 4, change: 2 }, // +2
    { status: 0, change: -2 }, // -2
  ].map((stat) => ({
    ...stat,
    count: statusCounts[stat.status]?.count || 0,
    text: statusCounts[stat.status]?.text || "----",
  }));

  if (isLoading) return <div className="text-center py-8">Loading...</div>;
  if (isError)
    return (
      <div className="text-center py-8 text-red-500">
        Error: {error.message}
      </div>
    );

  return (
    <div className="space-y-6">
      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, index) => (
          <div key={index} className="bg-white rounded-lg shadow p-4">
            <div className="text-gray-500 text-sm font-medium">{stat.text}</div>
            <div className="flex items-baseline justify-between mt-2">
              <div className="text-2xl font-bold text-gray-900">
                {stat.count}
              </div>
              <div
                className={`flex items-center text-sm font-medium ${
                  stat.change > 0 ? "text-green-600" : "text-red-600"
                }`}
              >
                {stat.change > 0 ? (
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 15l7-7 7 7"
                    />
                  </svg>
                ) : (
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                )}
                {stat.change > 0 ? `+${stat.change}` : stat.change}%
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* History Line Chart */}
      <div className="bg-white rounded-lg shadow p-4">
        <ReactApexChart
          options={historyChartData.options}
          series={historyChartData.series}
          type="line"
          height={350}
        />
      </div>
    </div>
  );
};

export default React.memo(InferenceStats);
