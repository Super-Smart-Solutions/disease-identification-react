import React from "react";
import { motion } from "framer-motion";
import NumberCounter from "../../NumberProgress";

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

const StatCard = ({ title, value, icon: Icon, isLoading }) => {
  return (
    <motion.div
      className={`bg-white rounded-lg shadow p-4 flex flex-col items-start ${
        isLoading ? "opacity-50 animate-pulse  select-none pointer-events-none" : ""
      }`}
      variants={cardVariants}
    >
      <div className="flex items-center gap-4 justify-between w-full">
        <div className="text-gray-500 text-sm font-medium">{title}</div>
        <div className="text-2xl text-primary">
          <Icon />
        </div>
      </div>
      <div className="text-2xl font-bold text-gray-900 mt-2">
        <NumberCounter value={value} color="black" />
      </div>
    </motion.div>
  );
};

export default StatCard;
