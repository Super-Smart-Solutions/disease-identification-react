import React, { useMemo, useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { useInferenceAggregates } from "../../../hooks/useInferenceAggregates";
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
  const { formatDate, processData, calculateMetrics, getInferenceAggregates } =
    useInferenceAggregates();

  const [dateRange, setDateRange] = useState(() => {
    const today = new Date();
    const initialStartDate = new Date();
    initialStartDate.setDate(today.getDate() - 28);
    return {
      start_date: initialStartDate,
      end_date: today,
    };
  });

  const { data, isLoading, isError } = getInferenceAggregates(
    formatDate(dateRange?.start_date) || undefined,
    formatDate(dateRange?.end_date) || undefined
  );

  const processedData = useMemo(() => processData(data), [data, processData]);
  const inferenceMetrics = useMemo(
    () => calculateMetrics(processedData),
    [processedData, calculateMetrics]
  );

  const getInferenceMetrics = useMemo(() => {
    if (!inferenceMetrics) return [];
    return [
      {
        title: t("total_inferences_key"),
        value: inferenceMetrics.total || 0,
        icon: FaCalculator,
      },
      {
        title: t("successful_inferences_key"),
        value: inferenceMetrics.successful || 0,
        icon: FaCheckCircle,
      },
      {
        title: t("failed_inferences_key"),
        value: inferenceMetrics.failed || 0,
        icon: FaTimesCircle,
      },
      {
        title: t("detected_diseases_key"),
        value: inferenceMetrics.diseases || 0,
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

  if (isError)
    return (
      <div className="text-center py-8 text-red-500">
        {t("error_loading_data")}
      </div>
    );

  return (
    <div className="space-y-6">
      <motion.div
        className="grid grid-cols-1 sm:grid-cols-2 lg:gridivols-4 gap-4"
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
