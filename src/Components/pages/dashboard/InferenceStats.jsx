import React, { useMemo } from "react";
import { motion } from "framer-motion";
import ReactApexChart from "react-apexcharts";
import { useInferences } from "../../../hooks/useInferences";
import { useTranslation } from "react-i18next";
import {
  FaCalculator,
  FaCheckCircle,
  FaTimesCircle,
  FaVirus,
} from "react-icons/fa";

// Animation variants for the card grid (parent)
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2, // Stagger each card by 0.2s
    },
  },
};

// Animation variants for individual cards
const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      type: "spring",
      stiffness: 100,
    },
  },
};

const InferenceStats = () => {
  const { t } = useTranslation();
  const { data, isLoading, isError, error } = useInferences();

  const getInferenceMetrics = useMemo(() => {
    if (!data?.items || !Array.isArray(data.items)) return [];

    const { items: inferences } = data;

    const totalInferences = inferences.length;
    const successfulInferences = inferences.filter(
      (item) => item.status === 1
    ).length;
    const failedInferences = inferences.filter(
      (item) => item.status === -1
    ).length;
    const detectedDiseases = inferences.filter(
      (item) => item.status === 2
    ).length;

    return [
      {
        title: t("total_inferences_key"),
        value: totalInferences,
        icon: FaCalculator,
      },
      {
        title: t("successful_inferences_key"),
        value: successfulInferences,
        icon: FaCheckCircle,
      },
      {
        title: t("failed_inferences_key"),
        value: failedInferences,
        icon: FaTimesCircle,
      },
      {
        title: t("detected_diseases_key"),
        value: detectedDiseases,
        icon: FaVirus,
      },
    ];
  }, [data, t]);

  const getInferenceHistory = useMemo(() => {
    if (!data?.items || !Array.isArray(data.items)) return [];

    const dateCounts = data.items.reduce((acc, item) => {
      const date = new Date(item.created_at).toISOString().split("T")[0];
      acc[date] = (acc[date] || 0) + 1;
      return acc;
    }, {});

    return Object.entries(dateCounts)
      .map(([date, count]) => ({ date, count }))
      .sort((a, b) => new Date(a.date) - new Date(b.date));
  }, [data]);

  const historyChartData = {
    series: [
      {
        name: t("inferences_key"),
        data: getInferenceHistory.map((item) => item.count),
      },
    ],
    options: {
      chart: {
        height: 350,
        type: "line",
      },
      stroke: {
        curve: "smooth",
        width: 8,
      },
      colors: ["#416a00"],
      title: {
        text: t("inference_history_key"),
        align: "left",
        style: {
          fontSize: "18px",
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
      },
      markers: {
        size: 5,
      },
    },
  };

  if (isLoading) return <div className="text-center py-8">Loading...</div>;
  if (isError)
    return (
      <div className="text-center py-8 text-red-500">
        Error: {error.message}
      </div>
    );

  return (
    <div className="space-y-6">
      {/* Stat Cards with Animation */}
      <motion.div
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {getInferenceMetrics.map((stat, index) => (
          <motion.div
            key={index}
            className="bg-white rounded-lg shadow p-4 flex flex-col items-start"
            variants={cardVariants}
          >
            <div className="flex items-center gap-4 justify-between w-full">
              <div className="text-gray-500 text-sm font-medium">
                {stat.title}
              </div>
              <div className="text-2xl text-primary">
                <stat.icon />
              </div>
            </div>
            <div className="text-2xl font-bold text-gray-900 mt-2">
              {stat.value}
            </div>
          </motion.div>
        ))}
      </motion.div>

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
