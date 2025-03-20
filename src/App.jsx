import React from "react";
import { motion } from "framer-motion";
import AppRoutes from "./routes/Approutes";
import { ToastContainer } from "react-toastify";

export default function App() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }}
    > 
     <ToastContainer position="top-right" autoClose={3000} />
      <AppRoutes />
    </motion.div>
  );
}
