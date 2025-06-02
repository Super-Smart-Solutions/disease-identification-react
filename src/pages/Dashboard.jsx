import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import TeamSection from "../Components/pages/dashboard/TeamSection";
import LogsSection from "../Components/pages/dashboard/LogsSection";
import InvitationPopup from "../Components/pages/dashboard/InvitationPopup";
import InferenceStats from "../Components/pages/dashboard/InferenceStats";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
      when: "beforeChildren",
    },
  },
};

const sectionVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: "easeOut",
    },
  },
};

export default function Dashboard() {
  const [showInvitationPopup, setShowInvitationPopup] = useState(true);

  return (
    <>
      <motion.div
        className="space-y-6"
        initial="hidden"
        animate="visible"
        variants={containerVariants}
      >
        <motion.div variants={sectionVariants}> 

        <InferenceStats/>

        </motion.div>

        <motion.div variants={sectionVariants}>
          <LogsSection />
        </motion.div>
      </motion.div>
      {showInvitationPopup && (
        <InvitationPopup onClose={() => setShowInvitationPopup(false)} />
      )}{" "}
    </>
  );
}
