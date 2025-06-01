import React, { useEffect, useState, useRef } from "react";
import { motion } from "framer-motion";
import { useInView } from "framer-motion";

const NumberCounter = ({
  value = 0,
  duration = 1,
  suffix = "",
  className = "",
  decimals = 0,
  color = "white",
}) => {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: false, amount: 0.5 });

  const getMilestones = (target) => {
    if (target <= 20) {
      // For small numbers: show more granular steps
      const step = Math.max(1, Math.floor(target / 5));
      return [step, step * 2, step * 3, step * 4, target].filter(
        (v, i, arr) => v !== arr[i - 1]
      );
    } else {
      // For larger numbers: show percentage-based milestones
      return [
        target * 0.1,
        target * 0.2,
        target * 0.3,
        target * 0.4,
        target * 0.5,
        target * 0.6,
        target * 0.7,
        target * 0.8,
        target * 0.85,
        target * 0.9,
        target * 0.95,
        target,
      ]
        .map((n) => Math.round(n))
        .filter((v, i, arr) => v !== arr[i - 1]);
    }
  };

  useEffect(() => {
    if (!isInView) {
      setCount(0);
      return;
    }

    const milestones = getMilestones(value);
    let currentMilestone = 0;
    const totalSteps = milestones.length;
    const intervalTime = (duration * 1000) / totalSteps;

    const interval = setInterval(() => {
      if (currentMilestone < totalSteps) {
        setCount(milestones[currentMilestone]);
        currentMilestone++;
      } else {
        clearInterval(interval);
      }
    }, intervalTime);

    return () => clearInterval(interval);
  }, [isInView, value, duration]);

  return (
    <motion.span
      ref={ref}
      className={`font-semibold ${className} text-2xl text-${color}`}
      initial={{ opacity: 0 }}
      animate={{ opacity: isInView ? 1 : 0.5 }}
      transition={{ duration: 0.5 }}
    >
      {count.toFixed(decimals)}
      {suffix}
    </motion.span>
  );
};

export default NumberCounter;
