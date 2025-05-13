import React, { useEffect, useState, useRef } from "react";
import { motion } from "framer-motion";
import { useInView } from "framer-motion";

const NumberCounter = ({
  value = 0,
  duration = 2,
  suffix = "",
  className = "",
  decimals = 0, // New prop for decimal precision
}) => {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: false, amount: 0.5 });

  useEffect(() => {
    if (!isInView) {
      setCount(0);
      return;
    }

    let start = 0;
    const end = value;
    const increment = end / (duration * 30); // 30fps-based increment
    let lastTimestamp = 0;

    const animate = (timestamp) => {
      if (!lastTimestamp) lastTimestamp = timestamp;
      const deltaTime = timestamp - lastTimestamp;

      if (deltaTime > 16) {
        // Roughly 30fps
        start = Math.min(start + increment, end);
        setCount(parseFloat(start.toFixed(decimals)));
        lastTimestamp = timestamp;
      }

      if (start < end) {
        requestAnimationFrame(animate);
      }
    };

    requestAnimationFrame(animate);

    return () => cancelAnimationFrame(animate);
  }, [isInView, value, duration, decimals]);

  return (
    <motion.span
      ref={ref}
      className={`font-semibold ${className} text-2xl text-white`}
      initial={{ opacity: 0 }}
      animate={{ opacity: isInView ? 1 : 0.5 }}
      transition={{ duration: 0.5 }}
    >
      {count}
      {suffix}
    </motion.span>
  );
};

export default NumberCounter;
