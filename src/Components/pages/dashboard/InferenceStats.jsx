import React, { useMemo, useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { useInferences } from "../../../hooks/useInferences";
import { useTranslation } from "react-i18next";
import {
  FaCalculator,
  FaCheckCircle,
  FaTimesCircle,
  FaVirus,
} from "react-icons/fa";
import StatCard from "./StatCard";
import InferenceChart from "./InferenceChart";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
    },
  },
};

const InferenceStats = () => {
  const { t } = useTranslation();
  const { getInferenceAggregates } = useInferences();

  const [dateRange, setDateRange] = useState(() => {
    const today = new Date();
    const initialStartDate = new Date();
    initialStartDate.setDate(today.getDate() - 28);
    return {
      start_date: initialStartDate,
      end_date: today,
    };
  });

  const formatDate = useCallback((date) => {
    return date ? date.toISOString().split("T")[0] : "";
  }, []);

  const { data, isLoading, isError } = getInferenceAggregates(
    formatDate(dateRange?.start_date) || undefined,
    formatDate(dateRange?.end_date) || undefined
  );

  const processedData = useMemo(() => {
    if (!Array.isArray(data)) return null;
    return data
      ?.map((item) => ({
        date: item.date.split("T")[0],
        count: item.total_inferences,
        successful: item.successful_inferences,
        failed: item.failed_inferences,
        unique_diseases: item.unique_diseases_count,
        average_confidence: item.average_confidence,
        status_breakdown: item.status_breakdown,
      }))
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  }, [data]);

  const inferenceMetrics = useMemo(() => {
    if (!processedData) return null;
    const totals = processedData.reduce(
      (acc, day) => ({
        total: acc.total + day.count,
        successful: acc.successful + day.successful,
        failed: acc.failed + day.failed,
        diseases: acc.diseases + day.diseases,
      }),
      { total: 0, successful: 0, failed: 0, diseases: 0 }
    );
    return totals;
  }, [processedData]);

  const getInferenceMetrics = useMemo(() => {
    if (!inferenceMetrics) return [];
    return [
      {
        title: t("total_inferences_key"),
        value: inferenceMetrics.total,
        icon: FaCalculator,
      },
      {
        title: t("successful_inferences_key"),
        value: inferenceMetrics.successful,
        icon: FaCheckCircle,
      },
      {
        title: t("failed_inferences_key"),
        value: inferenceMetrics.failed,
        icon: FaTimesCircle,
      },
      {
        title: t("detected_diseases_key"),
        value: inferenceMetrics.diseases,
        icon: FaVirus,
      },
    ];
  }, [inferenceMetrics, t]);

  const handleDateChange = useCallback((dates) => {
    const [newStartDate, newEndDate] = dates;
    if (!newEndDate || (newStartDate && newEndDate >= newStartDate)) {
      setDateRange({
        start_date: newStartDate,
        end_date: newEndDate,
      });
    }
  }, []);

  if (isLoading)
    return <div className="text-center py-8">{t("loading_key")}</div>;
  if (isError)
    return (
      <div className="text-center py-8 text-red-500">
        {t("error_loading_data")}
      </div>
    );

  return (
    <div className="space-y-6">
      <motion.div
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {getInferenceMetrics.map((stat, index) => (
          <StatCard
            isLoading={isLoading}
            key={`stat-${index}`}
            title={stat.title}
            value={stat.value}
            icon={stat.icon}
          />
        ))}
      </motion.div>

      <InferenceChart
        t={t}
        startDate={dateRange.start_date}
        endDate={dateRange.end_date}
        handleDateChange={handleDateChange}
        historyData={processedData || []}
      />
    </div>
  );
};

export default React.memo(InferenceStats);
