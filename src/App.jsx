import React from "react";
import { motion } from "framer-motion";
import AppRoutes from "./routes/Approutes";

export default function App() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }}
    >
      <AppRoutes />
    </motion.div>
  );
}
