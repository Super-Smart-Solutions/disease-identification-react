import React from "react";
import { motion } from "framer-motion";
import AppRoutes from "./routes/Approutes";
import Toast from "./Components/Toast";
import FeaturesPanel from "./Components/FeaturesPanel";
import useDocumentTitle from "./hooks/useDocumentTitle";

export default function App() {
  useDocumentTitle();

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }}
    >
      <Toast />
      <AppRoutes />
      <FeaturesPanel />
    </motion.div>
  );
}
